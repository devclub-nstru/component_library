"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export type FlipClockMode = "clock" | "countdown";
export type FlipDirection = "down" | "up";

export interface FlipClockProps {
  mode?: FlipClockMode;
  duration?: number;
  targetDate?: Date | string | number;
  date?: Date | string | number;
  running?: boolean;
  hourFormat?: "12" | "24";
  timeZone?: string;
  showSeconds?: boolean;
  showPeriod?: boolean;
  showDays?: boolean;
  showLabels?: boolean;
  padHours?: boolean;
  flipping?: boolean;
  flipDirection?: FlipDirection;
  flipDuration?: number;
  bounce?: number;
  shadowIntensity?: number;
  perspective?: number;
  cardSize?: number;
  gap?: number;
  borderRadius?: number;
  showSeparator?: boolean;
  showHinges?: boolean;
  theme?: "dark" | "light";
  panelColor?: string;
  textColor?: string;
  fontFamily?: string;
  className?: string;
  ariaLabel?: string;
  onComplete?: () => void;
}

const bounded = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

const timestamp = (value: Date | string | number | undefined) =>
  value === undefined ? undefined : new Date(value).getTime();

function useTimeSource({
  mode,
  duration,
  targetDate,
  date,
  running,
  onComplete,
}: {
  mode: FlipClockMode;
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

type FlipUnitProps = {
  value: string;
  label: string;
  period?: string;
  separator: boolean;
  options: { reducedMotion: boolean } & Required<
    Pick<
      FlipClockProps,
      | "flipping"
      | "flipDirection"
      | "flipDuration"
      | "bounce"
      | "shadowIntensity"
      | "perspective"
      | "borderRadius"
      | "showHinges"
      | "showLabels"
      | "fontFamily"
      | "cardSize"
    >
  >;
};

function FlipUnit({ value, label, period, separator, options }: FlipUnitProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const previousRef = React.useRef<string | null>(null);
  const {
    flipping,
    flipDirection,
    flipDuration,
    bounce,
    shadowIntensity,
    perspective,
    borderRadius,
    showHinges,
    showLabels,
    fontFamily,
    cardSize,
    reducedMotion,
  } = options;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const top = root.querySelector<HTMLElement>("[data-flip-static-top]");
      const bottom = root.querySelector<HTMLElement>(
        "[data-flip-static-bottom]",
      );
      const outgoing = root.querySelector<HTMLElement>("[data-flip-outgoing]");
      const incoming = root.querySelector<HTMLElement>("[data-flip-incoming]");
      const outgoingNumber =
        outgoing?.querySelector<HTMLElement>("[data-flip-number]");
      const incomingNumber =
        incoming?.querySelector<HTMLElement>("[data-flip-number]");
      const outgoingShade =
        outgoing?.querySelector<HTMLElement>("[data-flip-shade]");
      const incomingShade =
        incoming?.querySelector<HTMLElement>("[data-flip-shade]");
      if (
        !top ||
        !bottom ||
        !outgoing ||
        !incoming ||
        !outgoingNumber ||
        !incomingNumber ||
        !outgoingShade ||
        !incomingShade
      )
        return;
      const oldValue = previousRef.current;
      previousRef.current = value;
      const reset = () => {
        top.textContent = value;
        bottom.textContent = value;
        gsap.set([outgoing, incoming], { visibility: "hidden", rotationX: 0 });
      };
      reset();
      if (
        !flipping ||
        reducedMotion ||
        oldValue === null ||
        oldValue === "--" ||
        oldValue === value ||
        value === "--"
      )
        return;
      const down = flipDirection === "down";
      const time = bounded(flipDuration, 0.65, 0.15, 0.9);
      const shade = bounded(shadowIntensity, 0.28, 0, 0.7);
      (down ? bottom : top).textContent = oldValue;
      outgoingNumber.textContent = oldValue;
      incomingNumber.textContent = value;
      gsap.set(outgoing, { visibility: "visible", rotationX: 0 });
      gsap.set(incoming, {
        visibility: "hidden",
        rotationX: down ? 90 : -90,
      });
      gsap.set(outgoingShade, { opacity: 0 });
      gsap.set(incomingShade, { opacity: shade });
      const settle = bounded(bounce, 0.12, 0, 0.4);
      gsap
        .timeline()
        .to(
          outgoing,
          {
            rotationX: down ? -90 : 90,
            duration: time * 0.46,
            ease: "power2.in",
          },
          0,
        )
        .to(
          outgoingShade,
          { opacity: shade, duration: time * 0.46, ease: "power1.in" },
          0,
        )
        .set(outgoing, { visibility: "hidden" }, time * 0.46)
        .set(incoming, { visibility: "visible" }, time * 0.46)
        .to(
          incoming,
          {
            rotationX: 0,
            duration: time * 0.54,
            ease: settle ? `back.out(${settle * 5})` : "power3.out",
          },
          time * 0.46,
        )
        .to(
          incomingShade,
          { opacity: 0, duration: time * 0.54, ease: "power2.out" },
          time * 0.46,
        )
        .set([outgoing, incoming], { visibility: "hidden", rotationX: 0 }, time)
        .call(
          () => {
            top.textContent = value;
            bottom.textContent = value;
          },
          [],
          time,
        );
    },
    {
      scope: rootRef,
      dependencies: [
        value,
        reducedMotion,
        flipping,
        flipDirection,
        flipDuration,
        bounce,
        shadowIntensity,
      ],
      revertOnUpdate: true,
    },
  );

  const half = (bottom: boolean, part: "static" | "outgoing" | "incoming") => {
    const moving = part !== "static";
    const corner = `min(${borderRadius}px, ${(borderRadius / cardSize) * 100}cqw)`;
    return (
      <div
        data-flip-outgoing={part === "outgoing" ? "" : undefined}
        data-flip-incoming={part === "incoming" ? "" : undefined}
        className={cn(
          "absolute inset-x-0 h-1/2 overflow-hidden bg-(--flip-panel)",
          bottom ? "bottom-0" : "top-0",
          moving ? "z-20 will-change-transform" : "z-0",
        )}
        style={{
          borderRadius: bottom
            ? `0 0 ${corner} ${corner}`
            : `${corner} ${corner} 0 0`,
          transformOrigin: bottom ? "50% 0%" : "50% 100%",
          backfaceVisibility: "hidden",
          visibility: moving ? "hidden" : undefined,
        }}
      >
        <span
          data-flip-static-top={part === "static" && !bottom ? "" : undefined}
          data-flip-static-bottom={part === "static" && bottom ? "" : undefined}
          data-flip-number
          className="absolute inset-x-0 flex h-[200%] items-center justify-center font-bold leading-none tracking-[-0.065em] text-(--flip-text) tabular-nums"
          style={{
            top: bottom ? "-100%" : 0,
            fontSize: `${58 * Math.min(1, 2 / Math.max(2, value.length))}cqw`,
            fontFamily,
            opacity: bottom ? 1 : 0.86,
          }}
        >
          {value}
        </span>
        <span className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/3 to-transparent" />
        {moving && (
          <span
            data-flip-shade
            className="pointer-events-none absolute inset-0 bg-black"
            style={{ opacity: 0 }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="relative min-w-0 flex-1" aria-hidden="true">
      <div
        ref={rootRef}
        data-slot="flip-clock-unit"
        data-value={value}
        className="relative isolate aspect-[1.14] w-full @container"
        style={{ perspective: bounded(perspective, 900, 250, 2000) }}
      >
        {half(false, "static")}
        {half(true, "static")}
        {half(flipDirection === "up", "outgoing")}
        {half(flipDirection === "down", "incoming")}
        {period && (
          <span
            className="absolute left-[6%] top-[6%] z-30 font-bold leading-none text-(--flip-text) opacity-55"
            style={{ fontSize: "7cqw", fontFamily }}
          >
            {period}
          </span>
        )}
        <span
          data-slot="flip-clock-seam"
          className="pointer-events-none absolute inset-x-0 top-1/2 z-30 -translate-y-1/2 bg-black/90"
          style={{ height: `min(1.5px, ${(1.5 / cardSize) * 100}cqw)` }}
        />
        {showHinges && (
          <>
            <span
              data-slot="flip-clock-hinge"
              className="pointer-events-none absolute left-0 top-1/2 z-40 h-[9%] w-[2.5%] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-linear-to-b from-zinc-500 via-zinc-700 to-zinc-950 shadow-sm"
            />
            <span
              data-slot="flip-clock-hinge"
              className="pointer-events-none absolute right-0 top-1/2 z-40 h-[9%] w-[2.5%] translate-x-1/2 -translate-y-1/2 rounded-sm bg-linear-to-b from-zinc-500 via-zinc-700 to-zinc-950 shadow-sm"
            />
          </>
        )}
      </div>
      {separator && (
        <span className="pointer-events-none absolute left-full top-0 z-40 aspect-[1.14] w-full text-(--flip-text) opacity-45">
          <span
            data-slot="flip-clock-separator"
            className="flex h-full items-center justify-center"
            style={{ width: "var(--flip-gap)" }}
          >
            <svg
              viewBox="0 0 16 40"
              className="aspect-2/5 w-full max-w-4 shrink-0 fill-current"
              aria-hidden="true"
            >
              <circle cx="8" cy="10" r="3" />
              <circle cx="8" cy="30" r="3" />
            </svg>
          </span>
        </span>
      )}
      {showLabels && (
        <span className="mt-3 block text-center text-[clamp(9px,1.5cqw,11px)] font-medium uppercase tracking-[0.16em] text-(--flip-text) opacity-45">
          {label}
        </span>
      )}
    </div>
  );
}

export function FlipClock({
  mode = "clock",
  duration = 3600,
  targetDate,
  date,
  running = true,
  hourFormat = "12",
  timeZone,
  showSeconds = mode === "countdown",
  showPeriod = true,
  showDays = false,
  showLabels = false,
  padHours = false,
  flipping = true,
  flipDirection = "down",
  flipDuration = 0.65,
  bounce = 0.12,
  shadowIntensity = 0.28,
  perspective = 900,
  cardSize = 280,
  gap = 16,
  borderRadius = 14,
  showSeparator = false,
  showHinges = false,
  theme = "dark",
  panelColor,
  textColor,
  fontFamily = "Arial, Helvetica, sans-serif",
  className,
  ariaLabel,
  onComplete,
}: FlipClockProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          standard: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          setReducedMotion(Boolean(context.conditions?.reduced));
        },
      );
      return () => media.revert();
    },
    { scope: rootRef },
  );
  const { time, remaining } = useTimeSource({
    mode,
    duration,
    targetDate,
    date,
    running,
    onComplete,
  });
  const formatter = React.useMemo(() => {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
        timeZone: timeZone || undefined,
      });
    } catch {
      return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      });
    }
  }, [timeZone]);
  const units: { value: string; label: string }[] = [];
  let period: string | undefined;
  const pad = (value: number) => String(value).padStart(2, "0");
  if (mode === "countdown") {
    const days = remaining === null ? null : Math.floor(remaining / 86400);
    const hours =
      remaining === null
        ? null
        : Math.floor(remaining / 3600) % (showDays ? 24 : Infinity);
    if (showDays)
      units.push({ value: days === null ? "--" : pad(days), label: "Days" });
    units.push({ value: hours === null ? "--" : pad(hours), label: "Hours" });
    units.push({
      value: remaining === null ? "--" : pad(Math.floor(remaining / 60) % 60),
      label: "Minutes",
    });
    if (showSeconds)
      units.push({
        value: remaining === null ? "--" : pad(remaining % 60),
        label: "Seconds",
      });
  } else {
    const parts =
      time === null
        ? null
        : Object.fromEntries(
            formatter
              .formatToParts(new Date(time))
              .map((part) => [part.type, part.value]),
          );
    const hour = parts ? Number(parts.hour) : null;
    const displayHour =
      hour === null ? null : hourFormat === "12" ? hour % 12 || 12 : hour;
    if (hour !== null && showPeriod && hourFormat === "12")
      period = hour < 12 ? "AM" : "PM";
    units.push({
      value:
        displayHour === null
          ? "--"
          : hourFormat === "24" || padHours
            ? pad(displayHour)
            : String(displayHour),
      label: "Hours",
    });
    units.push({ value: parts?.minute ?? "--", label: "Minutes" });
    if (showSeconds)
      units.push({ value: parts?.second ?? "--", label: "Seconds" });
  }
  const size = bounded(cardSize, 280, 64, 600);
  const spacing = bounded(gap, 16, 0, 48);
  const width = size * units.length + spacing * (units.length - 1);
  const label =
    ariaLabel ??
    (mode === "clock"
      ? `Current time: ${units.map((unit) => unit.value).join(":")}${period ? ` ${period}` : ""}`
      : `Countdown: ${units.map((unit) => `${unit.value} ${unit.label.toLowerCase()}`).join(", ")}`);
  const options = {
    reducedMotion,
    flipping,
    flipDirection,
    flipDuration,
    bounce,
    shadowIntensity,
    perspective,
    borderRadius: bounded(borderRadius, 14, 0, 40),
    showHinges,
    showLabels,
    fontFamily,
    cardSize: size,
  };

  return (
    <div
      ref={rootRef}
      role="timer"
      aria-live="off"
      aria-label={label}
      data-slot="flip-clock"
      data-mode={mode}
      className={cn("w-full @container", className)}
      style={
        {
          maxWidth: width,
          "--flip-gap": `min(${spacing}px, max(3px, ${(spacing / width) * 100}cqw))`,
          "--flip-panel":
            panelColor ?? (theme === "dark" ? "#111111" : "#e7e7e7"),
          "--flip-text":
            textColor ?? (theme === "dark" ? "#f8f8f8" : "#171717"),
        } as React.CSSProperties
      }
    >
      <div className="flex items-start" style={{ gap: "var(--flip-gap)" }}>
        {units.map((unit, index) => (
          <FlipUnit
            key={unit.label}
            {...unit}
            period={unit.label === "Hours" ? period : undefined}
            separator={showSeparator && index < units.length - 1}
            options={options}
          />
        ))}
      </div>
      <span role="status" className="sr-only">
        {mode === "countdown" && remaining === 0 ? "Countdown complete" : ""}
      </span>
    </div>
  );
}

export default FlipClock;
