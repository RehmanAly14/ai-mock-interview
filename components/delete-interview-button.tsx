// @/components/delete-interview-button.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteInterviewButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Permanent Action: Are you sure you want to delete this session?")) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/interview/${sessionId}/delete`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/10 hover:border-red-500/40 disabled:opacity-50"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      {loading ? "Deleting..." : "Delete Session"}
    </button>
  );
}