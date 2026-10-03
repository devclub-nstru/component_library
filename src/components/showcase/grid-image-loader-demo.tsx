"use client";

import { useState } from "react";
import { PauseIcon, PlayIcon, ResetIcon } from "@radix-ui/react-icons";
import {
  GridImageLoader,
  GRID_IMAGE_LOADER_MESSAGES,
} from "@/registry/ui/grid-image-loader";
import { IMAGE_LOADER_IMAGES } from "./image-loader-demo";
import { CustomizationRange } from "./customization-controls";
import { SegmentedControl } from "./segmented-control";

export const GRID_IMAGE_LOADER_DEFAULT_CONFIG = {
  images: IMAGE_LOADER_IMAGES.map((image) => image.src),
  messages: [...GRID_IMAGE_LOADER_MESSAGES] as string[],
  duration: 6,
  revealDuration: 0.95,
  trailLifetime: 0.65,
  gridColumns: 4,
  gridRows: 4,
  gridOpacity: 0.07,
  borderRadius: 0,
  background: "#191919",
  foreground: "#f0efe9",
  finalImage: "https://i.pinimg.com/736x/69/b4/d4/69b4d4bad8b68cceceed5c7a12ddb9e4.jpg",
  mode: "automatic" as "automatic" | "manual",
  progress: 0,
};

export type GridImageLoaderConfig = typeof GRID_IMAGE_LOADER_DEFAULT_CONFIG;

export function GridImageLoaderDemo({
  config = GRID_IMAGE_LOADER_DEFAULT_CONFIG,
  compact = false,
}: {
  config?: GridImageLoaderConfig;
  compact?: boolean;
}) {
  const [replay, setReplay] = useState(0);
  const [paused, setPaused] = useState(false);
  const { finalImage, mode, progress, ...settings } = config;
  return (
    <div className={compact ? "w-full" : "flex h-full w-full flex-col"}>
      <GridImageLoader
        {...settings}
        progress={mode === "manual" ? progress : undefined}
        paused={paused}
        replayKey={`${mode}-${replay}`}
        className={
          compact
            ? "min-h-48 rounded-lg"
            : "h-full min-h-100 rounded-lg sm:min-h-120"
        }
      >
        <div className="relative h-full min-h-[inherit] overflow-hidden bg-[#191919]">
          <img
            src={finalImage}
            alt="Virat Kohli"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      </GridImageLoader>
      {!compact && (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-1 pt-4">
          <span className="text-xs text-muted-foreground">
            Hover across the grid to reveal images. Replay to try again.
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
    max: 15,
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
    key: "trailLifetime",
    label: "Image hold",
    min: 0.15,
    max: 2,
    step: 0.05,
    unit: "s",
  },
  { key: "gridColumns", label: "Grid columns", min: 2, max: 8, step: 1, unit: "" },
  { key: "gridRows", label: "Grid rows", min: 2, max: 8, step: 1, unit: "" },
  {
    key: "gridOpacity",
    label: "Grid visibility",
    min: 0,
    max: 0.3,
    step: 0.01,
    unit: "",
  },
  {
    key: "borderRadius",
    label: "Image corners",
    min: 0,
    max: 24,
    step: 1,
    unit: "px",
  },
] as const;

export function GridImageLoaderControls({
  config,
  onChange,
}: {
  config: GridImageLoaderConfig;
  onChange: (config: GridImageLoaderConfig) => void;
}) {
  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Grid image loader
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Tune the grid, phrases, images, and reveal.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...GRID_IMAGE_LOADER_DEFAULT_CONFIG })}
          className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
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
          onChange={(mode) => onChange({ ...config, mode, progress: 0 })}
        />
      </fieldset>
      {config.mode === "manual" && (
        <label className="grid gap-2 text-xs text-muted-foreground">
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
          <span>Reach 100 to open the Virat Kohli image.</span>
        </label>
      )}
      <label className="grid gap-2 text-xs text-muted-foreground">
        Loading phrases · one per line
        <textarea
          aria-label="Loading phrases"
          rows={6}
          value={config.messages.join("\n")}
          onChange={(event) =>
            onChange({
              ...config,
              messages: event.target.value.split("\n").slice(0, 12),
            })
          }
          className="min-w-0 resize-y rounded-xl border border-border bg-background p-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        {(["background", "foreground"] as const).map((key) => (
          <label key={key} className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            {key === "background" ? "Background" : "Text & grid"}
            <input
              type="color"
              aria-label={
                key === "background" ? "Loader background" : "Loader foreground"
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
      {ranges.map(({ key, label, unit, ...range }) => (
        <label key={key} className="grid gap-2 rounded-xl border border-border p-3">
          <span className="flex justify-between gap-3 text-xs text-muted-foreground">
            <span>{label}</span>
            <span className="font-mono text-foreground">
              {Number(config[key].toFixed(2))}{unit}
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
      <details className="rounded-xl border border-border p-3">
        <summary className="cursor-pointer text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50">
          Image URLs
        </summary>
        <div className="mt-4 grid gap-3">
          {config.images.map((src, index) => (
            <label key={index} className="grid gap-2 text-xs text-muted-foreground">
              Hover image {index + 1}
              <input
                type="url"
                value={src}
                onChange={(event) =>
                  onChange({
                    ...config,
                    images: config.images.map((image, i) =>
                      i === index ? event.target.value : image,
                    ),
                  })
                }
                className="min-h-9 min-w-0 rounded-lg border border-border bg-background px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
              />
            </label>
          ))}
          <label className="grid gap-2 text-xs text-muted-foreground">
            Revealed image
            <input
              type="url"
              value={config.finalImage}
              onChange={(event) =>
                onChange({ ...config, finalImage: event.target.value })
              }
              className="min-h-9 min-w-0 rounded-lg border border-border bg-background px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
            />
          </label>
        </div>
      </details>
    </div>
  );
}
