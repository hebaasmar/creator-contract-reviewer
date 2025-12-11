"use client";

import { useState } from "react";
import { Mail, Lock, CheckCircle } from "lucide-react";

interface EmailCaptureProps {
  onSubmit: (email: string) => void;
}

export default function EmailCapture({ onSubmit }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    onSubmit(email);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Almost there!
        </h2>
        <p className="text-slate-600">
          Enter your email to receive your contract analysis and save your results.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="you@example.com"
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              error ? "border-red-300 bg-red-50" : "border-slate-300"
            }`}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          Get My Analysis
        </button>
      </form>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Lock className="w-4 h-4 text-slate-400" />
          <span>Your contract is encrypted and never shared</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <CheckCircle className="w-4 h-4 text-slate-400" />
          <span>Unsubscribe anytime with one click</span>
        </div>
      </div>
    </div>
  );
}
