"use client";

import {
  Mic,
  MicOff,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import {
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";

import { useSpeechToText } from "@/hooks/use-speech-to-text";

type QuestionAnswerCardProps = {
  questionNumber: number;
  totalQuestions: number;
  questionType: string;
  questionContent: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  loading?: boolean;
  message?: string;
  disabled?: boolean;
  timeLeft: number;
};

export default function QuestionAnswerCard({
  questionNumber,
  totalQuestions,
  questionType,
  questionContent,
  value,
  onChange,
  onSave,
  loading = false,
  message = "",
  disabled = false,
  timeLeft,
}: QuestionAnswerCardProps) {
  const [interimText, setInterimText] = useState("");
  const [savingLocked, setSavingLocked] = useState(false);

  const isDanger = timeLeft <= 30;

  // ---------------- STOP MIC WHEN DISABLED ----------------

  const handleFinalTranscript = useCallback(
    (text: string) => {
      if (disabled || savingLocked) return;

      onChange(
        value.trim()
          ? `${value.trim()} ${text}`
          : text
      );

      setInterimText("");
    },
    [disabled, savingLocked, value, onChange]
  );

  const {
    isSupported,
    isListening,
    startListening,
    stopListening,
  } = useSpeechToText({
    lang: "en-US",
    onFinalTranscript: handleFinalTranscript,
    onInterimTranscript: setInterimText,
  });

  // ---------------- AUTO STOP LISTENING ----------------

  useEffect(() => {
    if (disabled || savingLocked || timeLeft <= 0) {
      if (isListening) stopListening();
    }
  }, [disabled, savingLocked, timeLeft, isListening, stopListening]);

  // ---------------- DISPLAY VALUE ----------------

  const displayedValue = useMemo(() => {
    if (disabled || savingLocked) return value;

    if (!interimText) return value;

    return value.trim()
      ? `${value}\n\n[Listening...] ${interimText}`
      : `[Listening...] ${interimText}`;
  }, [value, interimText, disabled, savingLocked]);

  // ---------------- FORMAT TIME ----------------

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // ---------------- SAVE HANDLER ----------------

  const handleSaveClick = () => {
    if (disabled) return;
    if (savingLocked) return;
    if (loading) return;

    setSavingLocked(true);

    onSave();
  };

  // ---------------- RESET LOCK WHEN QUESTION CHANGES ----------------

  useEffect(() => {
    setSavingLocked(false);
    setInterimText("");
  }, [questionContent]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl">

      {/* Glow */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-[100px]" />

      <div className="relative z-10">

        {/* HEADER */}

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

          <div className="max-w-xl">

            <span className="rounded-lg bg-indigo-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-indigo-500/20">
              {questionType.replace("_", " ")}
            </span>

            <h3 className="mt-4 text-2xl font-bold leading-tight text-white">
              {questionContent}
            </h3>

          </div>

          {/* TIMER */}

          <div
            className={`flex flex-col items-center rounded-2xl border px-6 py-3 transition-all ${
              isDanger
                ? "border-red-500/40 bg-red-500/10 scale-105"
                : "border-white/5 bg-white/5"
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-500 flex items-center gap-1">
              <Clock size={10} /> Time Left
            </p>

            <p
              className={`text-2xl font-mono font-bold ${
                isDanger
                  ? "text-red-400 animate-pulse"
                  : "text-white"
              }`}
            >
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>

        {/* VOICE */}

        <div className="mt-8 flex items-center justify-between">

          <div className="flex items-center gap-3">

            {isSupported && (
              <button
                type="button"
                onClick={
                  isListening
                    ? stopListening
                    : startListening
                }
                disabled={disabled || savingLocked}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-white/5 text-slate-300 border border-white/10"
                }`}
              >
                {isListening ? (
                  <MicOff size={14} />
                ) : (
                  <Mic size={14} />
                )}

                {isListening
                  ? "Stop Recording"
                  : "Voice Answer"}
              </button>
            )}

          </div>

          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Question {questionNumber} of {totalQuestions}
          </p>
        </div>

        {/* TEXTAREA */}

        <div className="relative mt-4">

          <textarea
            value={displayedValue}
            disabled={disabled || savingLocked}
            onChange={(e) => {
              setInterimText("");
              onChange(e.target.value);
            }}
            placeholder="Type your structured response here..."
            className="min-h-80 w-full resize-none rounded-2xl border border-white/5 bg-black/40 p-6 text-lg leading-relaxed text-slate-200 outline-none disabled:opacity-50
            [&::-webkit-scrollbar]:hidden 
    [-ms-overflow-style:none] 
    [scrollbar-width:none]
            "
          />

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="text-sm">
            {message && (
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={16} />
                {message}
              </div>
            )}
          </div>

          <button
            onClick={handleSaveClick}
            disabled={
              disabled ||
              loading ||
              savingLocked
            }
            className="rounded-xl bg-white px-10 py-3.5 font-bold text-black disabled:opacity-50"
          >
            Save Answer
          </button>

        </div>

      </div>
    </div>
  );
}