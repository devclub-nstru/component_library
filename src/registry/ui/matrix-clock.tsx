"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useTimeSource } from "./use-time-source";

gsap.registerPlugin(useGSAP);

export interface MatrixClockCity {
  label: string;
  timeZone: string;
}

export interface MatrixClockProps {
  cities?: readonly MatrixClockCity[];
  date?: Date | string | number;
  running?: boolean;
  hourFormat?: "12" | "24";
  showSeconds?: boolean;
  animated?: boolean;
  scrambleDuration?: number;
  scrambleInterval?: number;
  replayKey?: string | number;
  dotRadius?: number;
  rowGap?: number;
  inactiveOpacity?: number;
  glow?: number;
  color?: string;
  backgroundColor?: string;
  maxWidth?: number;
  className?: string;
  ariaLabel?: string;
}

export const MATRIX_CLOCK_CITIES: readonly MatrixClockCity[] = [
  { label: "NEW YORK CITY", timeZone: "America/New_York" },
  { label: "TOKYO", timeZone: "Asia/Tokyo" },
  { label: "HAWAII", timeZone: "Pacific/Honolulu" },
  { label: "LOS ANGELES", timeZone: "America/Los_Angeles" },
  { label: "INDIA", timeZone: "Asia/Kolkata" },
];

const GLYPHS: Record<string, readonly number[]> = {
  " ": [0, 0, 0, 0, 0, 0, 0],
  "0": [14, 17, 19, 21, 25, 17, 14],
  "1": [4, 12, 4, 4, 4, 4, 14],
  "2": [14, 17, 1, 2, 4, 8, 31],
  "3": [30, 1, 1, 14, 1, 1, 30],
  "4": [2, 6, 10, 18, 31, 2, 2],
  "5": [31, 16, 16, 30, 1, 1, 30],
  "6": [14, 16, 16, 30, 17, 17, 14],
  "7": [31, 1, 2, 4, 8, 8, 8],
  "8": [14, 17, 17, 14, 17, 17, 14],
  "9": [14, 17, 17, 15, 1, 1, 14],
  A: [14, 17, 17, 31, 17, 17, 17],
  B: [30, 17, 17, 30, 17, 17, 30],
  C: [14, 17, 16, 16, 16, 17, 14],
  D: [30, 17, 17, 17, 17, 17, 30],
  E: [31, 16, 16, 30, 16, 16, 31],
  F: [31, 16, 16, 30, 16, 16, 16],
  G: [14, 17, 16, 23, 17, 17, 15],
  H: [17, 17, 17, 31, 17, 17, 17],
  I: [14, 4, 4, 4, 4, 4, 14],
  J: [7, 2, 2, 2, 18, 18, 12],
  K: [17, 18, 20, 24, 20, 18, 17],
  L: [16, 16, 16, 16, 16, 16, 31],
  M: [17, 27, 21, 21, 17, 17, 17],
  N: [17, 25, 21, 19, 17, 17, 17],
  O: [14, 17, 17, 17, 17, 17, 14],
  P: [30, 17, 17, 30, 16, 16, 16],
  Q: [14, 17, 17, 17, 21, 18, 13],
  R: [30, 17, 17, 30, 20, 18, 17],
  S: [15, 16, 16, 14, 1, 1, 30],
  T: [31, 4, 4, 4, 4, 4, 4],
  U: [17, 17, 17, 17, 17, 17, 14],
  V: [17, 17, 17, 17, 17, 10, 4],
  W: [17, 17, 17, 21, 21, 21, 10],
  X: [17, 17, 10, 4, 10, 17, 17],
  Y: [17, 17, 10, 4, 4, 4, 4],
  Z: [31, 1, 2, 4, 8, 16, 31],
  ":": [0, 4, 4, 0, 4, 4, 0],
  "-": [0, 0, 0, 31, 0, 0, 0],
  ".": [0, 0, 0, 0, 0, 12, 12],
  "/": [1, 1, 2, 4, 8, 16, 16],
  "?": [14, 17, 1, 2, 4, 0, 4],
};

const SCRAMBLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const bounded = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

function glyphPath(rows: readonly number[], radius: number) {
  let path = "";
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 5; x++) {
      if (rows[y] & (1 << (4 - x)))
        path += `M${x + 0.5 - radius},${y + 0.5}a${radius},${radius} 0 1,0 ${radius * 2},0a${radius},${radius} 0 1,0 ${-radius * 2},0`;
    }
  }
  return path;
}

export function MatrixClock({
  cities = MATRIX_CLOCK_CITIES,
  date,
  running = true,
  hourFormat = "24",
  showSeconds = false,
  animated = true,
  scrambleDuration = 1.6,
  scrambleInterval = 5,
  replayKey = 0,
  dotRadius = 0.36,
  rowGap = 3,
  inactiveOpacity = 0.13,
  glow = 0.3,
  color = "#e8e8e8",
  backgroundColor = "#000000",
  maxWidth = 640,
  className,
  ariaLabel = "World clock",
}: MatrixClockProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const paintRef = React.useRef<((time: number | null) => void) | null>(null);
  const playbackRef = React.useRef<(() => void) | null>(null);
  const { time } = useTimeSource({ mode: "clock", duration: 0, date, running });
  const selectedCities = React.useMemo(
    () =>
      cities.slice(0, 12).map((city) => {
        let formatter: Intl.DateTimeFormat | null = null;
        try {
          formatter = new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            ...(showSeconds ? { second: "2-digit" } : {}),
            hourCycle: hourFormat === "24" ? "h23" : "h12",
            timeZone: city.timeZone,
          });
        } catch {
          formatter = null;
        }
        const label = city.label.trim() || city.timeZone;
        const displayLabel = label
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase()
          .replace(/[^A-Z0-9 .:/-]/g, "?")
          .slice(0, 28);
        return { ...city, label, displayLabel, formatter };
      }),
    [cities, hourFormat, showSeconds],
  );
  const timeColumns = (showSeconds ? 8 : 5) + (hourFormat === "12" ? 3 : 0);
  const columns =
    timeColumns +
    2 +
    Math.max(12, ...selectedCities.map((city) => city.displayLabel.length)) +
    3;
  const pitch = 7 + bounded(rowGap, 3, 1, 8);
  const height = Math.max(7, (selectedCities.length - 1) * pitch + 7);
  const radius = bounded(dotRadius, 0.36, 0.15, 0.48);
  const paths = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(GLYPHS).map(([glyph, rows]) => [
          glyph,
          glyphPath(rows, radius),
        ]),
      ),
    [radius],
  );
  const inactivePath = React.useMemo(
    () => glyphPath([31, 31, 31, 31, 31, 31, 31], radius),
    [radius],
  );
  const displayTimes = selectedCities.map((city) =>
    time === null || !city.formatter
      ? `${showSeconds ? "--:--:--" : "--:--"}${hourFormat === "12" ? " --" : ""}`
      : city.formatter.format(time).toUpperCase(),
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const cells = Array.from(
        root.querySelectorAll<SVGPathElement>("[data-matrix-cell]"),
      );
      const rendered = cells.map(() => "");
      let text = selectedCities.map(
        (city) => `${"-".repeat(timeColumns)}  ${city.displayLabel}`.padEnd(columns),
      );
      const state = { progress: 1 };
      let lastFrame = -1;
      const paint = (force = false) => {
        const frame = Math.floor(performance.now() / 45);
        if (!force && frame === lastFrame) return;
        lastFrame = frame;
        cells.forEach((cell, index) => {
          const row = Math.floor(index / columns);
          const column = index % columns;
          const threshold =
            0.18 +
            (column / columns) * 0.68 +
            (row / Math.max(1, selectedCities.length)) * 0.1;
          const settled = state.progress >= threshold;
          const glyph = settled
            ? text[row][column]
            : SCRAMBLE_GLYPHS[(frame * 7 + index * 13) % SCRAMBLE_GLYPHS.length];
          if (rendered[index] === glyph) return;
          rendered[index] = glyph;
          cell.setAttribute("d", paths[glyph] ?? paths["?"]);
          cell.setAttribute("data-glyph", glyph);
        });
      };
      paintRef.current = (timestamp) => {
        text = selectedCities.map((city) => {
          const value =
            timestamp === null || !city.formatter
              ? `${showSeconds ? "--:--:--" : "--:--"}${hourFormat === "12" ? " --" : ""}`
              : city.formatter.format(timestamp).toUpperCase();
          return `${value}  ${city.displayLabel}`.padEnd(columns);
        });
        paint(true);
      };
      paint(true);
      const media = gsap.matchMedia();
      media.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          standard: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const duration = bounded(scrambleDuration, 1.6, 0.3, 4);
          const interval = bounded(scrambleInterval, 5, 0, 60);
          const allowed = animated && !context.conditions?.reduced;
          const cycle = gsap.timeline({
            paused: true,
            repeat: interval > 0 ? -1 : 0,
          });
          cycle.set(state, { progress: 0 }, 0);
          cycle.to(
            state,
            {
              progress: 1,
              duration,
              ease: "power1.inOut",
              onUpdate: () => paint(),
              onComplete: () => paint(true),
            },
            0,
          );
          if (interval > 0)
            cycle.to({}, { duration: Math.max(0.8, interval - duration) });
          const visible = () =>
            !document.hidden && root.getAttribute("data-visible") !== "false";
          const syncPlayback = () => {
            if (!allowed || !running || !visible()) {
              cycle.pause(duration);
              state.progress = 1;
              paint(true);
            } else {
              cycle.play();
            }
          };
          playbackRef.current = () => {
            if (!allowed || !running || !visible()) return;
            cycle.restart();
          };
          const observer = new IntersectionObserver(([entry]) => {
            root.setAttribute("data-visible", String(entry.isIntersecting));
            syncPlayback();
          });
          observer.observe(root);
          document.addEventListener("visibilitychange", syncPlayback);
          syncPlayback();
          return () => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", syncPlayback);
            playbackRef.current = null;
            state.progress = 1;
            paint(true);
          };
        },
        root,
      );
      return () => {
        media.revert();
        paintRef.current = null;
      };
    },
    {
      scope: rootRef,
      dependencies: [
        selectedCities,
        columns,
        timeColumns,
        paths,
        showSeconds,
        hourFormat,
        animated,
        running,
        scrambleDuration,
        scrambleInterval,
      ],
      revertOnUpdate: true,
    },
  );

  React.useEffect(() => paintRef.current?.(time), [
    time,
    selectedCities,
    paths,
    running,
    animated,
    scrambleDuration,
    scrambleInterval,
    showSeconds,
    hourFormat,
  ]);
  React.useEffect(() => {
    if (replayKey !== 0) playbackRef.current?.();
  }, [replayKey]);

  return (
    <div
      ref={rootRef}
      data-slot="matrix-clock"
      data-timestamp={time ?? undefined}
      className={cn("w-full min-w-0", className)}
      style={{
        maxWidth: bounded(maxWidth, 640, 180, 1200),
        backgroundColor,
        color,
      }}
      role="group"
      aria-label={ariaLabel}
    >
      <svg
        viewBox={`0 0 ${columns * 6 - 1} ${height}`}
        className="block h-auto w-full overflow-visible"
        aria-hidden="true"
        style={{
          filter:
            glow > 0
              ? `drop-shadow(0 0 ${bounded(glow, 0.3, 0, 1.5)}px ${color})`
              : undefined,
        }}
      >
        {selectedCities.map((city, row) => (
          <g
            key={`${row}-${city.timeZone}`}
            transform={`translate(0 ${row * pitch})`}
            data-matrix-row={city.timeZone}
          >
            {Array.from({ length: columns }, (_, column) => (
              <g key={column} transform={`translate(${column * 6} 0)`}>
                <path
                  d={inactivePath}
                  fill="currentColor"
                  opacity={bounded(inactiveOpacity, 0.13, 0, 0.35)}
                />
                <path data-matrix-cell d="" fill="currentColor" />
              </g>
            ))}
          </g>
        ))}
      </svg>
      <ul className="sr-only" aria-live="off">
        {selectedCities.map((city, index) => (
          <li key={`${index}-${city.timeZone}`}>
            {city.label}: <time>{displayTimes[index]}</time>
            {!city.formatter && " (Invalid time zone)"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MatrixClock;
