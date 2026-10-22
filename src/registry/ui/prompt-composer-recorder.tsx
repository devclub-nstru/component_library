"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { LoaderCircle, Square, X } from "lucide-react";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(useGSAP);

export type PromptTranscriber = (
  audio: Blob,
  signal: AbortSignal,
) => Promise<string>;

const BAR_COUNT = 40;
const DEMO_TRANSCRIPT =
  "Remind me to send the design review notes to Sam at 5 pm";

export function PromptComposerRecorder({
  demo,
  onTranscribe,
  onComplete,
  onCancel,
  onError,
}: {
  demo: boolean;
  onTranscribe?: PromptTranscriber;
  onComplete: (text: string) => void;
  onCancel: () => void;
  onError: (message: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const levelsRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const [phase, setPhase] = useState<
    "requesting" | "recording" | "transcribing"
  >(demo ? "recording" : "requesting");
  const [seconds, setSeconds] = useState(0);
  const reduced = useReducedMotion();
  const complete = useEffectEvent(onComplete);
  const fail = useEffectEvent(onError);

  useEffect(() => {
    const controller = new AbortController();
    let stream: MediaStream | null = null;
    let recorder: MediaRecorder | null = null;
    let audioContext: AudioContext | null = null;
    let demoDelay: gsap.core.Tween | null = null;
    let started = 0;
    let lastSecond = 0;
    const clock = () => {
      const elapsed = Math.floor((performance.now() - started) / 1000);
      if (elapsed !== lastSecond) {
        lastSecond = elapsed;
        setSeconds(elapsed);
      }
    };
    const beginClock = () => {
      started = performance.now();
      gsap.ticker.add(clock);
    };
    const stopTracks = () => {
      stream?.getTracks().forEach((track) => track.stop());
      gsap.ticker.remove(clock);
    };
    const transcribe = async (blob: Blob) => {
      if (controller.signal.aborted) return;
      stopTracks();
      try {
        if (!onTranscribe) throw new Error("Missing transcription provider");
        const transcript = await onTranscribe(blob, controller.signal);
        if (controller.signal.aborted) return;
        if (!transcript.trim()) {
          fail("No speech was detected. Please try again.");
          return;
        }
        complete(transcript.trim());
      } catch {
        if (!controller.signal.aborted)
          fail("Transcription failed. Your draft is saved. Please try again.");
      }
    };
    if (demo) {
      beginClock();
      stopRef.current = () => {
        gsap.ticker.remove(clock);
        setPhase("transcribing");
        demoDelay = gsap.delayedCall(0.65, () => complete(DEMO_TRANSCRIPT));
      };
    } else {
      const start = async () => {
        try {
          if (
            !navigator.mediaDevices?.getUserMedia ||
            typeof MediaRecorder === "undefined"
          ) {
            fail(
              "Voice recording is unavailable in this browser. Please type your message.",
            );
            return;
          }
          const media = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          if (controller.signal.aborted) {
            media.getTracks().forEach((track) => track.stop());
            return;
          }
          stream = media;
          audioContext = new AudioContext();
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          audioContext.createMediaStreamSource(media).connect(analyser);
          analyserRef.current = analyser;
          levelsRef.current = new Uint8Array(analyser.frequencyBinCount);
          recorder = new MediaRecorder(media);
          const chunks: Blob[] = [];
          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) chunks.push(event.data);
          };
          recorder.onstop = () => {
            void transcribe(
              new Blob(chunks, { type: recorder?.mimeType || "audio/webm" }),
            );
          };
          recorder.onerror = () => {
            stopTracks();
            if (!controller.signal.aborted)
              fail("Recording failed. Please try again.");
          };
          recorder.start();
          beginClock();
          setPhase("recording");
          stopRef.current = () => {
            if (recorder?.state !== "recording") return;
            setPhase("transcribing");
            recorder.stop();
          };
        } catch (error) {
          stopTracks();
          if (controller.signal.aborted) return;
          fail(
            error instanceof DOMException && error.name === "NotAllowedError"
              ? "Microphone access was denied. You can still type your message."
              : "Could not start recording. Please check your microphone and try again.",
          );
        }
      };
      void start();
    }
    return () => {
      controller.abort();
      demoDelay?.kill();
      stopRef.current = null;
      if (recorder && recorder.state !== "inactive") recorder.stop();
      stopTracks();
      analyserRef.current = null;
      levelsRef.current = null;
      if (audioContext && audioContext.state !== "closed")
        void audioContext.close();
    };
  }, [demo, onTranscribe]);

  useGSAP(
    () => {
      const bars = Array.from(
        rootRef.current?.querySelectorAll<HTMLElement>("[data-voice-bar]") ??
          [],
      );
      if (reduced || phase !== "recording") {
        gsap.set(bars, {
          scaleY: (index) => 0.12 + Math.abs(Math.sin(index * 0.8)) * 0.3,
        });
        return;
      }
      const levels = Array.from({ length: BAR_COUNT }, () => 0.08);
      let previous = 0;
      const paint = () => {
        const time = performance.now();
        if (time - previous < 75) return;
        previous = time;
        let level = 0.08;
        if (demo) {
          level =
            0.12 + Math.abs(Math.sin(time / 190) * Math.sin(time / 470)) * 0.85;
        } else if (analyserRef.current && levelsRef.current) {
          const data = levelsRef.current;
          analyserRef.current.getByteFrequencyData(data);
          level = Math.max(
            0.06,
            data.reduce((sum, sample) => sum + sample, 0) / data.length / 150,
          );
        }
        levels.shift();
        levels.push(Math.min(1, level));
        bars.forEach((bar, index) => {
          bar.style.transform = `scaleY(${levels[index]})`;
        });
      };
      gsap.ticker.add(paint);
      gsap.to("[data-recording-dot]", {
        opacity: 0.35,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      return () => gsap.ticker.remove(paint);
    },
    {
      scope: rootRef,
      dependencies: [phase, reduced, demo],
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={rootRef}
      className="flex h-full min-w-0 flex-1 items-center gap-3 pl-3 sm:pl-4"
      aria-busy={phase !== "recording"}
    >
      <span className="flex shrink-0 items-center gap-2 text-xs tabular-nums text-[var(--pc-muted)]">
        <span
          data-recording-dot
          className="size-2 rounded-full bg-red-400"
          aria-hidden="true"
        />
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
      </span>
      <span className="sr-only" role="status">
        {phase === "requesting"
          ? "Waiting for microphone permission"
          : phase === "transcribing"
            ? "Transcribing audio"
            : demo
              ? "Recording preview. The microphone is not active."
              : "Recording audio"}
      </span>
      <span
        className="flex h-7 min-w-0 flex-1 items-center justify-end gap-[3px] overflow-hidden text-[var(--pc-muted)]"
        aria-hidden="true"
      >
        {phase === "recording" ? (
          Array.from({ length: BAR_COUNT }, (_, index) => (
            <span
              key={index}
              data-voice-bar
              className="h-full w-0.5 shrink-0 origin-center rounded-full bg-current"
            />
          ))
        ) : (
          <span className="truncate text-xs">
            {phase === "requesting" ? "Connecting…" : "Transcribing…"}
          </span>
        )}
      </span>
      <button
        autoFocus
        type="button"
        onClick={onCancel}
        aria-label="Cancel recording"
        className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full outline-none hover:bg-[var(--pc-pill)] focus-visible:ring-2 focus-visible:ring-[var(--pc-accent)]"
      >
        <X className="size-4" />
      </button>
      <button
        type="button"
        disabled={phase !== "recording"}
        onClick={() => stopRef.current?.()}
        aria-label="Stop recording"
        className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-red-400/15 text-red-500 outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-wait disabled:opacity-50"
      >
        {phase === "recording" ? (
          <Square className="size-3 fill-current" />
        ) : (
          <LoaderCircle className="size-4 motion-safe:animate-spin" />
        )}
      </button>
    </div>
  );
}
