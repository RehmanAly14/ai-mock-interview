"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type QuestionItem = {
  id: string;
  content: string;
  answer?: {
    content: string;
  } | null;
};

type InterviewProgressProps = {
  sessionId: string;
  initialStatus: string;
  questions: QuestionItem[];
};

export default function InterviewProgress({
  sessionId,
  initialStatus,
  questions,
}: InterviewProgressProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const answeredCount = useMemo(() => {
    return questions.filter((q) => q.answer?.content?.trim()).length;
  }, [questions]);

  const totalQuestions = questions.length;
  const progressPercentage =
    totalQuestions === 0 ? 0 : Math.round((answeredCount / totalQuestions) * 100);

  const handleCompleteInterview = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/interview/${sessionId}/complete`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.details || data.error || "Failed to complete interview");
        return;
      }

      setStatus("completed");
      setMessage("Interview marked as completed.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while completing interview."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-400">Interview Progress</p>
          <h2 className="mt-1 text-2xl font-semibold">
            {answeredCount} / {totalQuestions} answered
          </h2>
          <p className="mt-2 text-sm text-slate-400 capitalize">
            Status: {status.replace("_", " ")}
          </p>
        </div>

        <button
          onClick={handleCompleteInterview}
          disabled={loading || status === "completed"}
          className="rounded-xl bg-white px-5 py-3 font-medium text-black disabled:opacity-50"
        >
          {status === "completed"
            ? "Interview Completed"
            : loading
            ? "Completing..."
            : "Complete Interview"}
        </button>
      </div>

      <div className="mt-5">
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-slate-400">{progressPercentage}% complete</p>
      </div>

      {message && (
        <p
          className={`mt-4 text-sm ${
            message.toLowerCase().includes("completed")
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}