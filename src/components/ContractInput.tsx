"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";

interface ContractInputProps {
  onSubmit: (text: string) => void;
}

export default function ContractInput({ onSubmit }: ContractInputProps) {
  const [inputMode, setInputMode] = useState<"paste" | "upload">("paste");
  const [contractText, setContractText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setError(null);

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setIsProcessing(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to parse PDF");
      }

      const { text } = await response.json();
      setContractText(text);
      setInputMode("paste");
    } catch {
      setError("Failed to parse PDF. Please try pasting the text directly.");
      setFileName(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const clearFile = () => {
    setFileName(null);
    setContractText("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (contractText.trim().length < 100) {
      setError("Please enter at least 100 characters of contract text");
      return;
    }
    onSubmit(contractText);
  };

  const charCount = contractText.length;
  const isValidLength = charCount >= 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Upload Your Contract
      </h2>
      <p className="text-slate-600 mb-6">
        Paste your contract text or upload a PDF file for analysis.
      </p>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setInputMode("paste")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            inputMode === "paste"
              ? "bg-indigo-100 text-indigo-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Paste Text
        </button>
        <button
          onClick={() => setInputMode("upload")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            inputMode === "upload"
              ? "bg-indigo-100 text-indigo-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Upload PDF
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {inputMode === "paste" ? (
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={contractText}
              onChange={(e) => {
                setContractText(e.target.value);
                setError(null);
              }}
              placeholder="Paste your contract text here..."
              className="w-full h-80 p-4 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 placeholder:text-slate-400"
            />
            <div className="absolute bottom-3 right-3 text-sm text-slate-400">
              {charCount.toLocaleString()} characters
              {!isValidLength && charCount > 0 && (
                <span className="text-amber-600 ml-2">
                  (minimum 100)
                </span>
              )}
            </div>
          </div>
          {fileName && (
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
              <FileText className="w-4 h-4" />
              <span>Extracted from: {fileName}</span>
              <button
                onClick={clearFile}
                className="ml-auto text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            isDragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-slate-300 hover:border-slate-400"
          }`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-indigo-200 border-t-indigo-600 mb-4"></div>
              <p className="text-slate-600">Processing PDF...</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-700 mb-2">
                Drop your PDF here
              </p>
              <p className="text-slate-500 mb-4">or</p>
              <label className="cursor-pointer">
                <span className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Browse Files
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-slate-400 mt-4">
                PDF files only, max 10MB
              </p>
            </>
          )}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!isValidLength}
        className={`w-full mt-6 py-4 rounded-xl font-semibold transition-colors ${
          isValidLength
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        Continue to Analysis
      </button>
    </div>
  );
}
