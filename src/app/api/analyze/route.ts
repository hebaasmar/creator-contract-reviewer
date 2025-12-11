import { NextRequest, NextResponse } from "next/server";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

const ANALYSIS_PROMPT = `You are an expert contract analyst specializing in creator and influencer agreements. Analyze the following contract and provide a structured analysis.

Your analysis must be returned as a valid JSON object with this exact structure:
{
  "summary": "A 2-3 paragraph plain-English summary of what this contract is about, what the creator is agreeing to, and the key terms.",
  "redFlags": [
    {
      "issue": "Brief title of the issue",
      "severity": "high" | "medium" | "low",
      "explanation": "Detailed explanation of why this is problematic and what it means for the creator"
    }
  ],
  "negotiableTerms": [
    {
      "term": "The specific term or clause",
      "suggestion": "How this could be negotiated to be more favorable"
    }
  ],
  "questionsToAsk": [
    "Specific questions the creator should ask before signing"
  ]
}

Guidelines for your analysis:
- Focus on issues that specifically affect content creators (IP rights, exclusivity, usage rights, payment terms, termination clauses)
- Rate severity as "high" for deal-breakers or significant financial/legal risk, "medium" for concerning but negotiable items, "low" for minor issues worth noting
- Provide actionable suggestions, not just problem identification
- Include at least 3-5 questions to ask
- Write in accessible language a non-lawyer can understand
- Be thorough but concise

CONTRACT TEXT:
`;

export async function POST(request: NextRequest) {
  try {
    const { contractText, email } = await request.json();

    if (!contractText || typeof contractText !== "string") {
      return NextResponse.json(
        { error: "Contract text is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    // Here you would typically save the email to your database
    // For now, we'll just log it (in production, use a proper database)
    console.log(`Email captured: ${email}`);

    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: ANALYSIS_PROMPT + contractText,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Claude API error:", errorData);
      return NextResponse.json(
        { error: "Failed to analyze contract" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    if (!content) {
      return NextResponse.json(
        { error: "No analysis generated" },
        { status: 500 }
      );
    }

    // Extract JSON from the response
    let analysis;
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse Claude response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze contract" },
      { status: 500 }
    );
  }
}
