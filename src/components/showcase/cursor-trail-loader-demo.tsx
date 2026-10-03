"use client";

import { useState } from "react";
import { PauseIcon, PlayIcon, ResetIcon } from "@radix-ui/react-icons";
import { CursorTrailLoader } from "@/registry/ui/cursor-trail-loader";
import { IMAGE_LOADER_IMAGES } from "./image-loader-demo";
import { CustomizationRange } from "./customization-controls";
import { SegmentedControl } from "./segmented-control";

export const CURSOR_TRAIL_LOADER_DEFAULT_CONFIG = {
  images: IMAGE_LOADER_IMAGES.map((image) => image.src),
  duration: 4.2,
  revealDuration: 0.9,
  imageSize: 160,
  imageAspectRatio: 0.8,
  trailLength: 10,
  trailSpacing: 55,
  trailLifetime: 0.8,
  followDuration: 0.2,
  rotation: 18,
  borderRadius: 3,
  background: "#f0efe9",
  foreground: "#171717",
  mode: "automatic" as "automatic" | "manual",
  progress: 0,
};

export type CursorTrailLoaderConfig = typeof CURSOR_TRAIL_LOADER_DEFAULT_CONFIG;

export function CursorTrailLoaderDemo({
  config = CURSOR_TRAIL_LOADER_DEFAULT_CONFIG,
  compact = false,
}: {
  config?: CursorTrailLoaderConfig;
  compact?: boolean;
}) {
  const [replay, setReplay] = useState(0);
  const [paused, setPaused] = useState(false);
  const { mode, progress, ...settings } = config;

  return (
    <div className={compact ? "w-full" : "flex w-full max-w-5xl flex-col gap-4"}>
      <CursorTrailLoader
        {...settings}
        imageSize={compact ? 65 : config.imageSize}
        trailSpacing={compact ? 25 : config.trailSpacing}
        progress={mode === "manual" ? progress : undefined}
        paused={paused}
        replayKey={`${mode}-${replay}`}
        className={
          compact ? "min-h-44 rounded-md" : "min-h-100 rounded-lg sm:min-h-120"
        }
      >
        <div className="relative min-h-[inherit] overflow-hidden bg-[#191919]">
          <img
            src="https://i.pinimg.com/736x/69/b4/d4/69b4d4bad8b68cceceed5c7a12ddb9e4.jpg"
            alt="Virat Kohli"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      </CursorTrailLoader>
      {!compact && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            Move the cursor while loading. Replay to explore again.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused((value) => !value)}
              className="flex min-h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
            >
              {paused ? (
                <PlayIcon aria-hidden="true" />
              ) : (
                <PauseIcon aria-hidden="true" />
              )}
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPaused(false);
                setReplay((value) => value + 1);
              }}
              className="flex min-h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
            >
              <ResetIcon aria-hidden="true" />
              Replay loader
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const ranges = [
  {
    key: "duration",
    label: "Loading duration",
    min: 1,
    max: 12,
    step: 0.2,
    unit: "s",
  },
  {
    key: "revealDuration",
    label: "Reveal duration",
    min: 0.2,
    max: 2,
    step: 0.05,
    unit: "s",
  },
  {
    key: "imageSize",
    label: "Image width",
    min: 80,
    max: 280,
    step: 10,
    unit: "px",
  },
  {
    key: "imageAspectRatio",
    label: "Image ratio",
    min: 0.5,
    max: 2,
    step: 0.05,
    unit: "",
  },
  {
    key: "trailLength",
    label: "Trail length",
    min: 1,
    max: 18,
    step: 1,
    unit: "",
  },
  {
    key: "trailSpacing",
    label: "Image spacing",
    min: 15,
    max: 150,
    step: 5,
    unit: "px",
  },
  {
    key: "trailLifetime",
    label: "Image hold",
    min: 0.15,
    max: 2,
    step: 0.05,
    unit: "s",
  },
  {
    key: "followDuration",
    label: "Cursor smoothing",
    min: 0.05,
    max: 0.6,
    step: 0.05,
    unit: "s",
  },
  {
    key: "rotation",
    label: "Image tilt",
    min: 0,
    max: 40,
    step: 1,
    unit: "°",
  },
  {
    key: "borderRadius",
    label: "Corner radius",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
  },
] as const;

export function CursorTrailLoaderControls({
  config,
  onChange,
}: {
  config: CursorTrailLoaderConfig;
  onChange: (config: CursorTrailLoaderConfig) => void;
}) {
  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Cursor trail loader
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Tune the image trail and loading reveal.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...CURSOR_TRAIL_LOADER_DEFAULT_CONFIG })}
          className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          <ResetIcon aria-hidden="true" />
          Reset
        </button>
      </div>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">
          Progress source
        </legend>
        <SegmentedControl
          options={[
            { value: "automatic", label: "Timeline" },
            { value: "manual", label: "Manual progress" },
          ]}
          value={config.mode}
          onChange={(mode) =>
            onChange({
              ...config,
              mode: mode as CursorTrailLoaderConfig["mode"],
              progress: 0,
            })
          }
        />
      </fieldset>
      {config.mode === "manual" && (
        <label className="flex flex-col gap-2 text-xs text-muted-foreground">
          Loading progress · {config.progress}%
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
          <span>Move the cursor in the preview. Reach 100 to reveal.</span>
        </label>
      )}
      <div className="grid grid-cols-2 gap-3">
        {(["background", "foreground"] as const).map((key) => (
          <label
            key={key}
            className="flex items-center justify-between gap-2 text-xs text-muted-foreground"
          >
            {key === "background" ? "Background" : "Counter"}
            <input
              type="color"
              aria-label={
                key === "background" ? "Loader background" : "Counter color"
              }
              value={config[key]}
              onChange={(event) =>
                onChange({ ...config, [key]: event.target.value })
              }
              className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
            />
          </label>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {ranges.map(({ key, label, unit, ...range }) => (
          <label
            key={key}
            className="flex min-w-0 flex-col gap-2 rounded-xl border border-border p-3"
          >
            <span className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              {label}
              <span className="font-mono text-foreground">
                {Number(config[key].toFixed(2))}
                {unit}
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
      <details className="rounded-xl border border-border p-3">
        <summary className="cursor-pointer text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50">
          Trail images
        </summary>
        <div className="mt-4 flex flex-col gap-3">
          {config.images.map((src, index) => (
            <label
              key={index}
              className="flex flex-col gap-2 text-xs text-muted-foreground"
            >
              Image {index + 1} URL
              <input
                type="url"
                value={src}
                onChange={(event) =>
                  onChange({
                    ...config,
                    images: config.images.map((image, imageIndex) =>
                      imageIndex === index ? event.target.value : image,
                    ),
                  })
                }
                className="min-h-9 min-w-0 rounded-lg border border-border bg-background px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
              />
            </label>
          ))}
        </div>
      </details>
    </div>
  );
}
