"use client";

import * as React from "react";

const bounded = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

const timestamp = (value: Date | string | number | undefined) =>
  value === undefined ? undefined : new Date(value).getTime();

export function useTimeSource({
  mode,
  duration,
  targetDate,
  date,
  running,
  onComplete,
}: {
  mode: "clock" | "countdown";
  duration: number;
  targetDate?: Date | string | number;
  date?: Date | string | number;
  running: boolean;
  onComplete?: () => void;
}) {
  const [snapshot, setSnapshot] = React.useState<{
    time: number | null;
    remaining: number | null;
  }>({ time: null, remaining: null });
  const runRef = React.useRef({
    signature: "",
    remaining: 0,
    deadline: 0,
    completed: false,
    clockTime: 0,
  });
  const completeRef = React.useRef(onComplete);
  const seconds = bounded(duration, 3600, 0, 863999999);
  const target = timestamp(targetDate);
  const fixedDate = timestamp(date);

  React.useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  React.useEffect(() => {
    const run = runRef.current;
    const signature =
      mode === "countdown"
        ? `${mode}:${seconds}:${target}`
        : `${mode}:${fixedDate}`;
    if (run.signature !== signature) {
      run.signature = signature;
      run.remaining =
        mode === "countdown" && target !== undefined && Number.isFinite(target)
          ? Math.max(0, target - Date.now())
          : seconds * 1000;
      run.completed = false;
      run.clockTime = 0;
    }
    const relative = mode === "countdown" && target === undefined;
    if (relative && running) run.deadline = performance.now() + run.remaining;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    const refresh = () => {
      if (disposed) return;
      clearTimeout(timer);
      const wallTime = Date.now();
      let time: number | null = null;
      let remaining: number | null = null;
      if (mode === "clock") {
        if (fixedDate !== undefined)
          time = Number.isFinite(fixedDate) ? fixedDate : null;
        else {
          if (running || !run.clockTime)
            run.clockTime = Math.floor(wallTime / 1000) * 1000;
          time = run.clockTime;
        }
      } else if (relative) {
        if (running)
          run.remaining = Math.max(0, run.deadline - performance.now());
        remaining = Math.ceil(run.remaining / 1000);
      } else if (Number.isFinite(target)) {
        if (running) run.remaining = Math.max(0, target! - wallTime);
        remaining = Math.ceil(run.remaining / 1000);
      }
      setSnapshot((previous) =>
        previous.time === time && previous.remaining === remaining
          ? previous
          : { time, remaining },
      );
      if (mode === "countdown" && remaining === 0 && !run.completed) {
        run.completed = true;
        completeRef.current?.();
      }
      const needsTick =
        running &&
        (mode === "clock"
          ? fixedDate === undefined
          : remaining !== null && remaining > 0);
      if (needsTick && !document.hidden) {
        const delay = relative
          ? (run.remaining % 1000 || 1000) + 10
          : 1010 - (Date.now() % 1000);
        timer = setTimeout(refresh, delay);
      }
    };
    const visibility = () => {
      if (document.hidden) clearTimeout(timer);
      else refresh();
    };
    refresh();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", visibility);
      if (relative && running)
        run.remaining = Math.max(0, run.deadline - performance.now());
    };
  }, [mode, seconds, target, fixedDate, running]);

  return snapshot;
}

