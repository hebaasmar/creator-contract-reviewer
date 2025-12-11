"use client";

import { useState } from "react";
import {
  Shield,
  AlertTriangle,
  FileText,
  MessageSquare,
  Upload,
  ChevronRight,
  CheckCircle,
  Sparkles
} from "lucide-react";
import ContractInput from "@/components/ContractInput";
import EmailCapture from "@/components/EmailCapture";
import ResultsDisplay from "@/components/ResultsDisplay";

type AnalysisResult = {
  summary: string;
  redFlags: Array<{
    issue: string;
    severity: "high" | "medium" | "low";
    explanation: string;
  }>;
  negotiableTerms: Array<{
    term: string;
    suggestion: string;
  }>;
  questionsToAsk: string[];
};

export default function Home() {
  const [step, setStep] = useState<"landing" | "input" | "email" | "analyzing" | "results">("landing");
  const [contractText, setContractText] = useState("");
  const [email, setEmail] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleContractSubmit = (text: string) => {
    setContractText(text);
    setStep("email");
  };

  const handleEmailSubmit = async (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep("analyzing");
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText, email: submittedEmail }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Please try again.");
      }

      const result = await response.json();
      setAnalysisResult(result);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("input");
    }
  };

  const handleStartOver = () => {
    setStep("landing");
    setContractText("");
    setEmail("");
    setAnalysisResult(null);
    setError(null);
  };

  if (step === "landing") {
    return <LandingPage onGetStarted={() => setStep("input")} />;
  }

  if (step === "input") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={handleStartOver}
            className="text-slate-600 hover:text-slate-900 mb-8 flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to home
          </button>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          <ContractInput onSubmit={handleContractSubmit} />
        </div>
      </div>
    );
  }

  if (step === "email") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={() => setStep("input")}
            className="text-slate-600 hover:text-slate-900 mb-8 flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to contract
          </button>
          <EmailCapture onSubmit={handleEmailSubmit} />
        </div>
      </div>
    );
  }

  if (step === "analyzing") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Analyzing your contract</h2>
          <p className="text-slate-600">This usually takes 15-30 seconds...</p>
        </div>
      </div>
    );
  }

  if (step === "results" && analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={handleStartOver}
            className="text-slate-600 hover:text-slate-900 mb-8 flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Analyze another contract
          </button>
          <ResultsDisplay result={analysisResult} />
        </div>
      </div>
    );
  }

  return null;
}

function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold text-slate-900">ContractGuard</span>
        </div>
        <button
          onClick={onGetStarted}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          AI-Powered Contract Analysis for Creators
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Protect Your Creative Career<br />
          <span className="text-indigo-600">Before You Sign</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Musicians, YouTubers, influencers, and content creators: don&apos;t sign away your rights.
          Get instant AI analysis of brand deals, sync licenses, record deals, and sponsorship contracts.
        </p>
        <button
          onClick={onGetStarted}
          className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
        >
          Analyze Your Contract Free
          <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-slate-500 text-sm mt-4">No credit card required</p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
          Built for creators who want to protect their work
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<FileText className="w-6 h-6" />}
            title="Plain-English Summary"
            description="Understand exactly what your brand deal, management agreement, or record contract actually means."
          />
          <FeatureCard
            icon={<AlertTriangle className="w-6 h-6" />}
            title="Red Flag Detection"
            description="Spot unfair exclusivity clauses, revenue splits, IP grabs, and perpetual licenses before they cost you."
          />
          <FeatureCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Negotiable Terms"
            description="Learn which sponsorship rates, sync fees, and royalty terms creators commonly push back on."
          />
          <FeatureCard
            icon={<MessageSquare className="w-6 h-6" />}
            title="Questions to Ask"
            description="Get specific questions to ask brands, labels, or managers before you commit to any deal."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Upload or Paste"
              description="Upload a PDF or paste your contract text directly into our secure platform."
            />
            <StepCard
              number="2"
              title="AI Analysis"
              description="Our AI reviews every clause, identifies issues, and generates insights in seconds."
            />
            <StepCard
              number="3"
              title="Get Insights"
              description="Receive a comprehensive report with summaries, red flags, and actionable advice."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          Don&apos;t sign that brand deal or record contract blind
        </h2>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Whether it&apos;s a sync license, sponsorship agreement, or management contract—get
          AI-powered insights in seconds. Protect your music, your content, and your career.
        </p>
        <button
          onClick={onGetStarted}
          className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload Your Contract
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>ContractGuard is for informational purposes only and does not constitute legal advice.</p>
          <p className="mt-2">Always consult with a qualified attorney for legal matters.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all">
      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}
