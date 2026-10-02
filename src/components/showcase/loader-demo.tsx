"use client";

import { useState } from "react";
import { ResetIcon } from "@radix-ui/react-icons";
import { Loader } from "@/registry/ui/loader";
import { CustomizationRange } from "./customization-controls";
import { SegmentedControl } from "./segmented-control";

export const LOADER_DEFAULT_CONFIG = {
  duration: 2.2,
  revealDuration: 0.85,
  stagger: 0.09,
  columns: 5,
  mode: "automatic" as "automatic" | "manual",
  progress: 0,
};

export type LoaderConfig = typeof LOADER_DEFAULT_CONFIG;

export function LoaderDemo({
  config = LOADER_DEFAULT_CONFIG,
  compact = false,
}: {
  config?: LoaderConfig;
  compact?: boolean;
}) {
  const [replay, setReplay] = useState(0);

  return (
    <div
      className={compact ? "w-full" : "flex w-full max-w-5xl flex-col gap-4"}
    >
      <Loader
        key={replay}
        duration={config.duration}
        revealDuration={config.revealDuration}
        stagger={config.stagger}
        columns={config.columns}
        progress={config.mode === "manual" ? config.progress : undefined}
        className={
          compact ? "min-h-44 rounded-md" : "min-h-100 rounded-lg sm:min-h-120"
        }
      >
        <div className="relative min-h-[inherit] overflow-hidden bg-[#191919]">
          <img
            src="https://i.pinimg.com/1200x/20/e8/17/20e8178dde52e8c531ef288f4aca7177.jpg"
            alt="A cricket player in a red and navy jersey on a field"
            loading={compact ? "lazy" : "eager"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      </Loader>
      {!compact && (
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">
            Counter → staggered reveal
          </span>
          <button
            type="button"
            onClick={() => setReplay((value) => value + 1)}
            className="flex min-h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
          >
            <ResetIcon aria-hidden="true" className="size-3.5" />
            Replay loader
          </button>
        </div>
      )}
    </div>
  );
}

const ranges = [
  { key: "duration", label: "Loading duration", min: 0.5, max: 6, step: 0.1 },
  {
    key: "revealDuration",
    label: "Reveal duration",
    min: 0.2,
    max: 2,
    step: 0.05,
  },
  { key: "stagger", label: "Panel stagger", min: 0, max: 0.25, step: 0.01 },
  { key: "columns", label: "Panels", min: 2, max: 10, step: 1 },
] as const;

export function LoaderControls({
  config,
  onChange,
}: {
  config: LoaderConfig;
  onChange: (config: LoaderConfig) => void;
}) {
  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Loader motion</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Tune the counter and the curtain reveal.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...LOADER_DEFAULT_CONFIG })}
          className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          <ResetIcon aria-hidden="true" className="size-3.5" />
          Reset
        </button>
      </div>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">Progress source</legend>
        <SegmentedControl
          options={[
            { value: "automatic", label: "Timeline" },
            { value: "manual", label: "Manual progress" },
          ]}
          value={config.mode}
          onChange={(mode) =>
            onChange({ ...config, mode: mode as LoaderConfig["mode"], progress: 0 })
          }
        />
      </fieldset>
      {config.mode === "manual" && (
        <label className="flex flex-col gap-2 text-xs text-muted-foreground">
          <span>Loading progress · {config.progress}%</span>
          <CustomizationRange
            aria-label="Loading progress"
            min={0}
            max={100}
            step={1}
            value={config.progress}
            onChange={(event) =>
              onChange({ ...config, progress: Number(event.target.value) })
            }
          />
          <span>Reach 100 to reveal. Replay to start another load.</span>
        </label>
      )}
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
                {key === "columns" ? "" : "s"}
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
    </div>
  );
}
