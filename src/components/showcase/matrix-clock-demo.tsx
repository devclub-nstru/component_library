"use client";

import { useId, useState } from "react";
import { ResetIcon } from "@radix-ui/react-icons";
import { Pause, Play, RotateCcw } from "lucide-react";
import {
  MatrixClock,
  MATRIX_CLOCK_CITIES,
  type MatrixClockCity,
} from "@/registry/ui/matrix-clock";
import { ColorSwatches, CustomizationRange } from "./customization-controls";
import { SegmentedControl } from "./segmented-control";

const palettes = [
  { value: "white", label: "White", color: "#e8e8e8" },
  { value: "amber", label: "Amber", color: "#ffbb55" },
  { value: "green", label: "Green", color: "#8effa0" },
  { value: "blue", label: "Ice blue", color: "#91dbff" },
] as const;

export const MATRIX_CLOCK_DEFAULT_CONFIG = {
  hourFormat: "24" as "12" | "24",
  showSeconds: false,
  animated: true,
  scrambleDuration: 1.6,
  scrambleInterval: 5,
  dotRadius: 0.36,
  rowGap: 3,
  inactiveOpacity: 0.13,
  glow: 0.3,
  maxWidth: 640,
  palette: "white" as (typeof palettes)[number]["value"],
  backgroundColor: "#000000",
  timeSource: "live" as "live" | "reference",
  cities: MATRIX_CLOCK_CITIES.map((city) => ({ ...city })),
};

export type MatrixClockConfig = typeof MATRIX_CLOCK_DEFAULT_CONFIG;

const ranges = [
  {
    key: "scrambleDuration",
    label: "Scramble duration",
    min: 0.3,
    max: 3,
    step: 0.1,
  },
  {
    key: "scrambleInterval",
    label: "Cycle interval",
    min: 0,
    max: 12,
    step: 1,
  },
  { key: "dotRadius", label: "Dot radius", min: 0.15, max: 0.48, step: 0.01 },
  { key: "rowGap", label: "Row spacing", min: 1, max: 8, step: 0.5 },
  {
    key: "inactiveOpacity",
    label: "Inactive dots",
    min: 0,
    max: 0.35,
    step: 0.01,
  },
  { key: "glow", label: "Dot glow", min: 0, max: 1.5, step: 0.1 },
  {
    key: "maxWidth",
    label: "Display width",
    min: 280,
    max: 960,
    step: 20,
  },
] as const;

export function MatrixClockDemo({
  config = MATRIX_CLOCK_DEFAULT_CONFIG,
  compact = false,
}: {
  config?: MatrixClockConfig;
  compact?: boolean;
}) {
  const [running, setRunning] = useState(true);
  const [replayKey, setReplayKey] = useState(0);
  const { palette, timeSource, ...props } = config;
  const color = palettes.find((option) => option.value === palette)!.color;
  return (
    <div
      className={`relative flex h-full w-full min-w-0 items-center justify-center overflow-hidden ${compact ? "min-h-48 px-5 py-10" : "min-h-80 px-5 py-20 sm:px-12"}`}
      style={{ backgroundColor: config.backgroundColor, color }}
    >
      <MatrixClock
        {...props}
        color={color}
        running={running}
        date={timeSource === "reference" ? "2026-10-03T12:00:00Z" : undefined}
        replayKey={replayKey}
      />
      {!compact && (
        <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2 font-sans text-xs">
          <button
            type="button"
            aria-label={running ? "Pause world clock" : "Resume world clock"}
            onClick={() => setRunning((value) => !value)}
            className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-current/20 px-4 opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          >
            {running ? (
              <Pause size={13} aria-hidden="true" />
            ) : (
              <Play size={13} aria-hidden="true" />
            )}
            {running ? "Pause" : "Resume"}
          </button>
          <button
            type="button"
            aria-label="Replay clock scramble"
            onClick={() => setReplayKey((value) => value + 1)}
            disabled={!config.animated || !running}
            className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-current/20 px-4 opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current disabled:cursor-not-allowed disabled:opacity-25"
          >
            <RotateCcw size={13} aria-hidden="true" />
            Replay
          </button>
        </div>
      )}
    </div>
  );
}

export function MatrixClockControls({
  config,
  onChange,
}: {
  config: MatrixClockConfig;
  onChange: (config: MatrixClockConfig) => void;
}) {
  const id = useId();
  const updateCity = (index: number, patch: Partial<MatrixClockCity>) =>
    onChange({
      ...config,
      cities: config.cities.map((city, i) =>
        i === index ? { ...city, ...patch } : city,
      ),
    });
  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Matrix clock</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            One instant, five places. Tune the dot display and its motion.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...MATRIX_CLOCK_DEFAULT_CONFIG,
              cities: MATRIX_CLOCK_CITIES.map((city) => ({ ...city })),
            })
          }
          className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          <ResetIcon className="size-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">
          Hour format
        </legend>
        <SegmentedControl
          options={[
            { value: "24", label: "24 hour" },
            { value: "12", label: "12 hour" },
          ]}
          value={config.hourFormat}
          onChange={(hourFormat) => onChange({ ...config, hourFormat })}
        />
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">
          Time source
        </legend>
        <SegmentedControl
          options={[
            { value: "live", label: "Live time" },
            { value: "reference", label: "12:00 UTC" },
          ]}
          value={config.timeSource}
          onChange={(timeSource) => onChange({ ...config, timeSource })}
        />
      </fieldset>
      <div className="flex flex-wrap gap-x-5 gap-y-3">
        {([
          ["showSeconds", "Show seconds"],
          ["animated", "Scramble motion"],
        ] as const).map(([key, label]) => (
          <label key={key} className="flex cursor-pointer items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={config[key]}
              onChange={(event) =>
                onChange({ ...config, [key]: event.target.checked })
              }
              className="size-4 accent-foreground"
            />
            {label}
          </label>
        ))}
      </div>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">
          Dot color
        </legend>
        <ColorSwatches
          options={palettes}
          value={config.palette}
          onChange={(palette) => onChange({ ...config, palette })}
        />
      </fieldset>
      <label className="flex items-center justify-between text-xs text-muted-foreground">
        Background color
        <input
          type="color"
          aria-label="Clock background color"
          value={config.backgroundColor}
          onChange={(event) =>
            onChange({ ...config, backgroundColor: event.target.value })
          }
          className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
        />
      </label>
      {ranges.map(({ key, label, ...range }) => (
        <label key={key} className="grid gap-1 text-xs text-muted-foreground">
          <span className="flex justify-between gap-4">
            <span>{label}</span>
            <span className="font-mono tabular-nums text-foreground">
              {config[key]}
              {key === "scrambleDuration" || key === "scrambleInterval" ? "s" : ""}
            </span>
          </span>
          <CustomizationRange
            aria-label={label}
            {...range}
            value={config[key]}
            onChange={(event) =>
              onChange({ ...config, [key]: Number(event.target.value) })
            }
          />
        </label>
      ))}
      <p className="-mt-3 text-[11px] text-muted-foreground">
        Set the cycle interval to 0 for an entrance and manual replays.
      </p>
      <fieldset className="grid gap-3">
        <legend className="mb-3 text-xs text-muted-foreground">
          Cities &amp; IANA time zones
        </legend>
        {config.cities.map((city, index) => {
          let valid = true;
          try {
            new Intl.DateTimeFormat("en-GB", { timeZone: city.timeZone });
          } catch {
            valid = false;
          }
          return (
            <div key={index} className="grid gap-1.5 rounded-xl border border-border p-3">
              <label htmlFor={`${id}-city-${index}`} className="text-[11px] text-muted-foreground">
                City {index + 1}
              </label>
              <input
                id={`${id}-city-${index}`}
                value={city.label}
                maxLength={28}
                onChange={(event) => updateCity(index, { label: event.target.value })}
                className="min-h-9 min-w-0 rounded-md border border-border bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
              />
              <label htmlFor={`${id}-zone-${index}`} className="text-[11px] text-muted-foreground">
                Time zone {index + 1}
              </label>
              <input
                id={`${id}-zone-${index}`}
                value={city.timeZone}
                aria-invalid={!valid}
                aria-describedby={!valid ? `${id}-error-${index}` : undefined}
                onChange={(event) => updateCity(index, { timeZone: event.target.value })}
                className="min-h-9 min-w-0 rounded-md border border-border bg-background px-2 font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
              />
              {!valid && (
                <p id={`${id}-error-${index}`} className="text-[11px] text-red-500">
                  Use a valid IANA zone, such as Asia/Kolkata.
                </p>
              )}
            </div>
          );
        })}
      </fieldset>
    </div>
  );
}
