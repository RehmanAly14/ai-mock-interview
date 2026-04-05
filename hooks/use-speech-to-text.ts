"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;

  start(): void;
  stop(): void;

  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: any) => void) | null;
  onresult: ((event: any) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

type Props = {
  lang?: string;
  onFinalTranscript: (text: string) => void;
  onInterimTranscript?: (text: string) => void;
};

export function useSpeechToText({
  lang = "en-US",
  onFinalTranscript,
  onInterimTranscript,
}: Props) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const shouldKeepListeningRef = useRef(false);
  const stoppedByUserRef = useRef(false);

  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- start ---------- */

  const startListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;

    stoppedByUserRef.current = false;
    shouldKeepListeningRef.current = true;

    try {
      rec.start();
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  /* ---------- stop ---------- */

  const stopListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;

    stoppedByUserRef.current = true;
    shouldKeepListeningRef.current = false;

    try {
      rec.stop();
    } catch (err) {
      setError((err as Error).message);
    }

    setIsListening(false);
  }, []);

  /* ---------- init ---------- */

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechClass) {
      setIsSupported(false);
      setError("Speech recognition not supported");
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechClass();

    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += text + " ";
        } else {
          interim += text + " ";
        }
      }

      if (interim && onInterimTranscript) {
        onInterimTranscript(interim.trim());
      }

      if (finalText) {
        onFinalTranscript(finalText.trim());
      }
    };

    recognition.onerror = (e: any) => {
      // Ignore aborted errors from user‑triggered stop
      if (e.error === "aborted") return;

      setError(e.error || "speech recognition error");
    };

    recognition.onend = () => {
      // If user stopped → do nothing special
      if (stoppedByUserRef.current) {
        setIsListening(false);
        return;
      }

      // If we should keep listening, restart
      if (shouldKeepListeningRef.current) {
        try {
          recognition.start();
          return;
        } catch (err) {
          setError((err as Error).message);
        }
      }

      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      shouldKeepListeningRef.current = false;

      const rec = recognitionRef.current;
      if (rec) {
        // Stop if still running
        try {
          rec.stop();
        } catch (err) {
          console.error("Error stopping recognition:", err);
        }
      }
    };
  }, [lang, onFinalTranscript, onInterimTranscript]);

  return {
    isSupported,
    isListening,
    error,
    startListening,
    stopListening,
  };
}
