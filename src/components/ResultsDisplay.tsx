"use client";

import { AlertTriangle, CheckCircle, HelpCircle, FileText, AlertCircle, Info } from "lucide-react";

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

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const { summary, redFlags, negotiableTerms, questionsToAsk } = result;

  const highRiskCount = redFlags.filter((f) => f.severity === "high").length;
  const mediumRiskCount = redFlags.filter((f) => f.severity === "medium").length;
  const lowRiskCount = redFlags.filter((f) => f.severity === "low").length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "medium":
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case "low":
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Contract Analysis Complete
        </h1>
        <p className="text-slate-600">
          Here&apos;s what you need to know about this contract.
        </p>

        {/* Risk Summary */}
        <div className="flex flex-wrap gap-4 mt-6">
          {highRiskCount > 0 && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{highRiskCount} High Risk</span>
            </div>
          )}
          {mediumRiskCount > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">{mediumRiskCount} Medium Risk</span>
            </div>
          )}
          {lowRiskCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
              <Info className="w-5 h-5" />
              <span className="font-medium">{lowRiskCount} Low Risk</span>
            </div>
          )}
          {redFlags.length === 0 && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">No major issues found</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">
            Plain-English Summary
          </h2>
        </div>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      </div>

      {/* Red Flags Section */}
      {redFlags.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Red Flags ({redFlags.length})
            </h2>
          </div>
          <div className="space-y-4">
            {redFlags.map((flag, index) => (
              <div
                key={index}
                className={`border rounded-xl p-4 ${getSeverityColor(flag.severity)}`}
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(flag.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{flag.issue}</h3>
                      <span
                        className={`text-xs font-medium uppercase px-2 py-0.5 rounded ${
                          flag.severity === "high"
                            ? "bg-red-200 text-red-800"
                            : flag.severity === "medium"
                            ? "bg-amber-200 text-amber-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {flag.severity}
                      </span>
                    </div>
                    <p className="text-sm opacity-90">{flag.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Negotiable Terms Section */}
      {negotiableTerms.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Negotiable Terms ({negotiableTerms.length})
            </h2>
          </div>
          <div className="space-y-4">
            {negotiableTerms.map((item, index) => (
              <div
                key={index}
                className="border border-green-200 bg-green-50 rounded-xl p-4"
              >
                <h3 className="font-semibold text-green-900 mb-2">
                  {item.term}
                </h3>
                <p className="text-green-800 text-sm">
                  <span className="font-medium">Suggestion: </span>
                  {item.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions to Ask Section */}
      {questionsToAsk.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Questions to Ask Before Signing
            </h2>
          </div>
          <ul className="space-y-3">
            {questionsToAsk.map((question, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-slate-700">{question}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <p className="text-sm text-slate-500 text-center">
          <strong>Disclaimer:</strong> This analysis is for informational purposes only
          and does not constitute legal advice. Always consult with a qualified attorney
          before signing any contract.
        </p>
      </div>
    </div>
  );
}
