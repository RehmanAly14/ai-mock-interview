"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Sparkles,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Zap,
  Timer,
} from "lucide-react";
import QuestionAnswerCard from "@/components/question-answer-card";

const QUESTION_TIME_SECONDS = 120;

/* ---------------- TYPES ---------------- */
type Feedback = {
  score: number;
  strengths: string;
  improvements: string;
  improvedAnswer?: string | null;
};

type Question = {
  id: string;
  type: string;
  content: string;
  answer?: {
    id: string;
    content: string;
    feedback?: Feedback | null;
  } | null;
};

type InterviewQuestionsProps = {
  sessionId: string;
  initialStatus: string;
};

export default function InterviewQuestions({
  sessionId,
  initialStatus,
}: InterviewQuestionsProps) {
  const router = useRouter();

  /* ---------------- STATE ---------------- */
  const [questions, setQuestions] = useState<Question[]>([]);
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [lockedAnswers, setLockedAnswers] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState(initialStatus);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [completing, setCompleting] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS);

  const currentIndexRef = useRef(0);
  const isAutoSavingRef = useRef(false);

  currentIndexRef.current = currentIndex;

  /* ---------------- LOAD QUESTIONS ---------------- */
  const loadQuestions = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch(`/api/interview/${sessionId}/questions`, { method: "POST" });
      const data = await res.json();
      const loaded: Question[] = data.questions || [];

      const drafts: Record<string, string> = {};
      const locks: Record<string, boolean> = {};

      loaded.forEach((q) => {
        drafts[q.id] = q.answer?.content || "";
        locks[q.id] = !!q.answer?.content;
      });

      setQuestions(loaded);
      setDraftAnswers(drafts);
      setLockedAnswers(locks);
    } catch (e) {
      console.error("Failed to fetch questions:", e);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadQuestions(true);
  }, [loadQuestions]);

  /* ---------------- DERIVED DATA (SAFE ACCESS) ---------------- */
  // Move these AFTER the load check or use optional chaining + fallbacks
  const isCompleted = status === "completed";
  const currentQuestion = questions[currentIndex] || null; // Avoid undefined
  const isLastQuestion = questions.length > 0 && currentIndex === questions.length - 1;
  const currentFeedback = currentQuestion?.answer?.feedback;
  const progressPercentage = questions.length === 0 
    ? 0 
    : Math.round(((currentIndex + 1) / questions.length) * 100);

 /* ---------------- TIMER ---------------- */
useEffect(() => {
  // 1. Stop if interview is finished
  if (isCompleted) return;
  
  // 2. Stop if there is no question
  if (!currentQuestion) return;

  // 3. NEW: Stop the timer if the current question is already solved/locked
  if (lockedAnswers[currentQuestion.id]) {
    return; 
  }

  // 4. Handle expiration
  if (timeLeft <= 0) {
    if (!isAutoSavingRef.current) {
      isAutoSavingRef.current = true;
      handleAutoTimeout();
    }
    return;
  }

  const id = setInterval(() => {
    setTimeLeft((t) => t - 1);
  }, 1000);

  return () => clearInterval(id);
  
  // Add lockedAnswers to the dependency array so the timer reacts to saves
}, [timeLeft, currentIndex, isCompleted, currentQuestion?.id, lockedAnswers]);

  /* ---------------- HANDLERS ---------------- */
  const persistAnswer = useCallback(async (silent = false) => {
    const q = questions[currentIndexRef.current];
    if (!q || isCompleted || lockedAnswers[q.id]) return true;

    const content = (draftAnswers[q.id] || "").trim();
    if (!content) return false;

    try {
      setSaving(true);
      const res = await fetch(`/api/questions/${q.id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error();

      setLockedAnswers((p) => ({ ...p, [q.id]: true }));
      await loadQuestions(false);
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  }, [questions, draftAnswers, lockedAnswers, isCompleted, loadQuestions]);

  const handleAutoTimeout = async () => {
    await persistAnswer(true);
    if (!isLastQuestion) {
      setCurrentIndex((i) => i + 1);
      setTimeLeft(QUESTION_TIME_SECONDS);
    }
    isAutoSavingRef.current = false;
  };

  const handleManualNav = async (index: number) => {
    await persistAnswer(true);
    setCurrentIndex(index);
    setTimeLeft(QUESTION_TIME_SECONDS);
  };

  const generateFeedback = async () => {
    if (!currentQuestion?.answer?.id) return;
    try {
      setEvaluating(true);
      const res = await fetch(`/api/answers/${currentQuestion.answer.id}/feedback`, { method: "POST" });
      if (!res.ok) throw new Error();
      await loadQuestions(false);
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  const handleCompleteInterview = async () => {
    try {
      setCompleting(true);
      await persistAnswer(true);
      const res = await fetch(`/api/interview/${sessionId}/complete`, { method: "POST" });
      if (!res.ok) throw new Error();

      setStatus("completed");
      router.push(`/interview/${sessionId}/report`);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setCompleting(false);
    }
  };

  /* ---------------- RENDER GUARDS ---------------- */
  // This is the most important part to fix your "type of undefined" error
  if (loading || !currentQuestion) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-400 font-medium">Preparing your interview workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Timer size={24} className={timeLeft < 20 && timeLeft > 0 ? "animate-pulse text-red-400" : ""} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Question {currentIndex + 1} of {questions.length}</h2>
              <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">
                {lockedAnswers[currentQuestion.id] ? (
      <span className="text-emerald-400 flex items-center gap-1">
        <CheckCircle2 size={12} /> Response Recorded
      </span>
    ) : timeLeft > 0 ? (
      `${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s remaining`
    ) : (
      "Time Expired"
    )}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleCompleteInterview}
            disabled={completing || isCompleted}
            className="group relative overflow-hidden flex items-center gap-2 rounded-2xl bg-white px-8 py-3 text-sm font-black text-black transition hover:bg-indigo-50 disabled:opacity-50"
          >
            {completing ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
            Finalize & Get Report
          </button>
        </div>

        <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div 
            className="h-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-1000" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>
      </div>
       {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-8">
        <button
          onClick={() => handleManualNav(Math.max(currentIndex - 1, 0))}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-white transition disabled:opacity-0"
        >
          <ChevronLeft size={20}/> Previous Goal
        </button>
        <button
          onClick={() => handleManualNav(Math.min(currentIndex + 1, questions.length - 1))}
          disabled={isLastQuestion}
          className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-8 py-3 text-sm font-bold text-white hover:bg-white/10 transition disabled:opacity-0"
        >
          Next Insight <ChevronRight size={20}/>
        </button>
      </div>

      <QuestionAnswerCard
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        questionType={currentQuestion.type}
        questionContent={currentQuestion.content}
        value={draftAnswers[currentQuestion.id] || ""}
        onChange={(v) => setDraftAnswers((p) => ({ ...p, [currentQuestion.id]: v }))}
        onSave={() => persistAnswer(false)}
        loading={saving}
        disabled={isCompleted || lockedAnswers[currentQuestion.id]}
        timeLeft={timeLeft}
      />

      {/* AI Controls */}
      {!isCompleted && currentQuestion.answer?.id && (
        <div className="flex justify-center py-4">
          <button
            onClick={generateFeedback}
            disabled={evaluating}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-bold text-white hover:bg-white/10 transition duration-300"
          >
            {evaluating ? <Loader2 className="animate-spin text-indigo-400" size={18} /> : <Sparkles className="text-indigo-400 group-hover:rotate-12 transition" size={18} />}
            {currentFeedback ? "Update AI Score" : "Instant Evaluation"}
          </button>
        </div>
      )}

      {/* Real-time Feedback Display */}
      {currentFeedback && (
        <div className="grid gap-4 sm:grid-cols-3 animate-in fade-in zoom-in duration-500">
           <div className="rounded-3xl border border-white/5 bg-linear-to-br from-white/5 to-transparent p-6 text-center">
              <Trophy className="mx-auto mb-2 text-amber-400" size={28} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Rank</p>
              <p className="text-4xl font-black text-white">{currentFeedback.score}<span className="text-lg text-slate-600">/10</span></p>
           </div>
           <div className="sm:col-span-2 space-y-4">
              <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-6">
                <div className="flex items-center gap-2 mb-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest"><Zap size={14}/> Expert Praise</div>
                <p className="text-sm text-slate-300 leading-relaxed">{currentFeedback.strengths}</p>
              </div>
           </div>
        </div>
      )}

     
    </div>
  );
}