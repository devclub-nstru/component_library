"use client";

import { useState } from "react";
import { ResetIcon } from "@radix-ui/react-icons";
import { Pause, Play, RotateCcw } from "lucide-react";
import {
  FlipClock,
  type FlipClockMode,
  type FlipDirection,
} from "@/registry/ui/flip-clock";
import { CustomizationRange } from "./customization-controls";
import { SegmentedControl } from "./segmented-control";

export const FLIP_CLOCK_DEFAULT_CONFIG = {
  mode: "clock" as FlipClockMode,
  duration: 600,
  hourFormat: "12" as "12" | "24",
  timeZone: "local",
  timeSource: "live" as "live" | "reference" | "midnight" | "noon",
  showSeconds: false,
  showPeriod: true,
  showDays: false,
  showLabels: false,
  padHours: false,
  flipping: true,
  flipDirection: "down" as FlipDirection,
  flipDuration: 0.65,
  bounce: 0.12,
  shadowIntensity: 0.28,
  perspective: 900,
  cardSize: 280,
  gap: 16,
  borderRadius: 14,
  showSeparator: false,
  showHinges: false,
  theme: "dark" as "dark" | "light",
  panelColor: "#111111",
  textColor: "#f8f8f8",
};

export type FlipClockConfig = typeof FLIP_CLOCK_DEFAULT_CONFIG;

const referenceDates = {
  reference: "2026-10-02T21:19:00",
  midnight: "2026-10-02T00:00:00",
  noon: "2026-10-02T12:00:00",
};

const presets = {
  soft: { flipDuration: 0.85, bounce: 0.06, shadowIntensity: 0.22 },
  classic: { flipDuration: 0.65, bounce: 0.12, shadowIntensity: 0.28 },
  crisp: { flipDuration: 0.35, bounce: 0.04, shadowIntensity: 0.35 },
};

const ranges = [
  {
    key: "flipDuration",
    label: "Flip duration",
    min: 0.15,
    max: 0.9,
    step: 0.05,
  },
  { key: "bounce", label: "Settling bounce", min: 0, max: 0.4, step: 0.01 },
  {
    key: "shadowIntensity",
    label: "Moving shadow",
    min: 0,
    max: 0.7,
    step: 0.01,
  },
  { key: "perspective", label: "Perspective", min: 250, max: 2000, step: 50 },
  { key: "cardSize", label: "Panel width", min: 100, max: 440, step: 10 },
  { key: "gap", label: "Panel spacing", min: 0, max: 48, step: 2 },
  { key: "borderRadius", label: "Corner radius", min: 0, max: 40, step: 1 },
] as const;

export function FlipClockDemo({ config }: { config: FlipClockConfig }) {
  const [running, setRunning] = useState(true);
  const [run, setRun] = useState(0);
  const { timeSource, timeZone, ...props } = config;
  return (
    <div
      className="relative flex h-full min-h-64 w-full items-center justify-center overflow-hidden px-5 py-16 sm:px-10"
      style={{
        backgroundColor: config.theme === "dark" ? "#000000" : "#fafafa",
      }}
    >
      <FlipClock
        key={`${config.mode}-${run}`}
        {...props}
        date={timeSource === "live" ? undefined : referenceDates[timeSource]}
        timeZone={timeZone === "local" ? undefined : timeZone}
        running={config.mode === "clock" || running}
      />
      {config.mode === "countdown" && (
        <div
          className="absolute inset-x-0 bottom-5 flex justify-center gap-2 text-xs"
          style={{ color: config.textColor }}
        >
          <button
            type="button"
            onClick={() => setRunning((value) => !value)}
            aria-label={running ? "Pause countdown" : "Resume countdown"}
            className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-current/15 px-4 opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
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
            aria-label="Restart countdown"
            onClick={() => {
              setRun((value) => value + 1);
              setRunning(true);
            }}
            className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-current/15 px-4 opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          >
            <RotateCcw size={13} aria-hidden="true" />
            Restart
          </button>
        </div>
      )}
    </div>
  );
}

export function FlipClockControls({
  config,
  onChange,
}: {
  config: FlipClockConfig;
  onChange: (config: FlipClockConfig) => void;
}) {
  const activePreset =
    Object.entries(presets).find(
      ([, preset]) =>
        preset.flipDuration === config.flipDuration &&
        preset.bounce === config.bounce &&
        preset.shadowIntensity === config.shadowIntensity,
    )?.[0] ?? "custom";
  const checks = [
    ["showSeconds", "Seconds"],
    ["showLabels", "Unit labels"],
    ["showSeparator", "Colon separators"],
    ["showHinges", "Metal hinges"],
    ...(config.mode === "clock" && config.hourFormat === "12"
      ? ([
          ["showPeriod", "AM / PM"],
          ["padHours", "Leading hour zero"],
        ] as const)
      : []),
    ...(config.mode === "countdown"
      ? ([["showDays", "Days panel"]] as const)
      : []),
  ] as readonly (readonly [
    (
      | "showSeconds"
      | "showLabels"
      | "showSeparator"
      | "showHinges"
      | "showPeriod"
      | "padHours"
      | "showDays"
    ),
    string,
  ])[];

  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Flip clock</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Tune the display and the weight of each flip.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...FLIP_CLOCK_DEFAULT_CONFIG })}
          className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          <ResetIcon className="size-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">Mode</legend>
        <SegmentedControl
          options={[
            { value: "clock", label: "Clock" },
            { value: "countdown", label: "Countdown" },
          ]}
          value={config.mode}
          onChange={(mode) =>
            onChange({
              ...config,
              mode,
              showSeconds: mode === "countdown",
              showLabels: mode === "countdown",
            })
          }
        />
      </fieldset>
      {config.mode === "clock" ? (
        <>
          <fieldset>
            <legend className="mb-2 text-xs text-muted-foreground">
              Hour format
            </legend>
            <SegmentedControl
              options={[
                { value: "12", label: "12 hour" },
                { value: "24", label: "24 hour" },
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
                { value: "live", label: "Live" },
                { value: "reference", label: "9:19 PM" },
                { value: "midnight", label: "Midnight" },
                { value: "noon", label: "Noon" },
              ]}
              value={config.timeSource}
              onChange={(timeSource) => onChange({ ...config, timeSource })}
            />
          </fieldset>
          <label className="flex flex-col gap-2 text-xs text-muted-foreground">
            Time zone
            <select
              aria-label="Time zone"
              value={config.timeZone}
              onChange={(event) =>
                onChange({ ...config, timeZone: event.target.value })
              }
              className="min-h-10 w-full cursor-pointer rounded-xl border border-border bg-background px-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
            >
              <option value="local">Local time</option>
              <option value="UTC">UTC</option>
              <option value="Asia/Kolkata">Kolkata</option>
              <option value="America/New_York">New York</option>
              <option value="Europe/London">London</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </label>
        </>
      ) : (
        <label className="flex flex-col gap-2 text-xs text-muted-foreground">
          Countdown duration in seconds
          <input
            type="number"
            aria-label="Countdown duration in seconds"
            min={0}
            max={863999999}
            step={1}
            value={config.duration}
            onChange={(event) => {
              if (event.target.value !== "")
                onChange({
                  ...config,
                  duration: Math.max(
                    0,
                    Math.min(863999999, Number(event.target.value)),
                  ),
                });
            }}
            className="min-h-10 w-full rounded-xl border border-border bg-background px-3 font-mono text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
          />
        </label>
      )}
      <div className="grid grid-cols-2 gap-3">
        {checks.map(([key, label]) => (
          <label
            key={key}
            className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"
          >
            <input
              type="checkbox"
              checked={config[key]}
              onChange={(event) =>
                onChange({ ...config, [key]: event.target.checked })
              }
              className="size-4 accent-black dark:accent-white"
            />
            {label}
          </label>
        ))}
      </div>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">
          Flip motion
        </legend>
        <SegmentedControl
          options={Object.keys(presets).map((value) => ({
            value,
            label: value[0].toUpperCase() + value.slice(1),
          }))}
          value={activePreset}
          onChange={(value) =>
            onChange({ ...config, ...presets[value as keyof typeof presets] })
          }
          className="grid-cols-3"
        />
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">
          Flip direction
        </legend>
        <SegmentedControl
          options={[
            { value: "down", label: "Down" },
            { value: "up", label: "Up" },
          ]}
          value={config.flipDirection}
          onChange={(flipDirection) => onChange({ ...config, flipDirection })}
        />
      </fieldset>
      <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={config.flipping}
          onChange={(event) =>
            onChange({ ...config, flipping: event.target.checked })
          }
          className="size-4 accent-black dark:accent-white"
        />
        Enable flipping
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        {ranges.map(({ key, label, ...range }) => (
          <label
            key={key}
            className="flex min-w-0 flex-col gap-2 rounded-xl border border-border p-3"
          >
            <span className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              {label}
              <span className="font-mono text-foreground">
                {Number(config[key].toFixed(2))}
              </span>
            </span>
            <CustomizationRange
              {...range}
              aria-label={label}
              value={config[key]}
              onChange={(event) =>
                onChange({ ...config, [key]: Number(event.target.value) })
              }
            />
          </label>
        ))}
      </div>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">
          Appearance
        </legend>
        <SegmentedControl
          options={[
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" },
          ]}
          value={config.theme}
          onChange={(theme) =>
            onChange({
              ...config,
              theme,
              panelColor: theme === "dark" ? "#111111" : "#e7e7e7",
              textColor: theme === "dark" ? "#f8f8f8" : "#171717",
            })
          }
        />
      </fieldset>
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            ["panelColor", "Panel colour"],
            ["textColor", "Number colour"],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className="flex items-center justify-between gap-2 rounded-xl border border-border p-3 text-xs text-muted-foreground"
          >
            {label}
            <input
              type="color"
              aria-label={label}
              value={config[key]}
              onChange={(event) =>
                onChange({ ...config, [key]: event.target.value })
              }
              className="size-8 cursor-pointer rounded-md border-0 bg-transparent p-0"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
