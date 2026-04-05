"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartInterviewPage() {
  const router = useRouter();

  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("junior");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startInterview = async () => {
    if (!role.trim()) {
      setError("Please enter a role");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, difficulty }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create interview");
        setLoading(false);
        return;
      }

      router.push(`/interview/${data.sessionId}`);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl" />

      {/* Card */}
      <div className="relative w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 space-y-6 shadow-2xl">

        <h1 className="text-2xl font-bold text-center">
          Start Mock Interview
        </h1>

        {/* Role */}
        <div className="space-y-2">
          <label className="text-sm text-slate-300">
            Role
          </label>

          <input
            className="w-full rounded-xl bg-slate-800/70 p-3 outline-none border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            placeholder="Frontend Developer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <label className="text-sm text-slate-300">
            Difficulty
          </label>

          <select
            className="w-full rounded-xl bg-slate-800/70 p-3 outline-none border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option className="bg-slate-800 hover:bg-slate-900" value="junior">Junior</option>
            <option className="bg-slate-800 hover:bg-slate-900" value="mid">Mid</option>
            <option className="bg-slate-800 hover:bg-slate-900" value="senior">Senior</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400 text-center">
            {error}
          </p>
        )}

        {/* Button */}
        <button
          onClick={startInterview}
          disabled={loading}
          className="w-full rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 py-3 font-semibold text-white transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Starting..." : "Start Interview"}
        </button>

      </div>
    </main>
  );
}