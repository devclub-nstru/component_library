"use client";

import { useState } from "react";
import { ResetIcon, PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import {
  ImageLoader,
  type ImageLoaderImage,
  type ImageLoaderEase,
} from "@/registry/ui/image-loader";
import { CustomizationRange } from "./customization-controls";
import { SegmentedControl } from "./segmented-control";

export const IMAGE_LOADER_IMAGES: ImageLoaderImage[] = [
  { src: "https://i.pinimg.com/736x/90/d7/28/90d728ba8da89e3f8c5fa86e7bbc3c1d.jpg" },
  { src: "https://i.pinimg.com/736x/da/fb/fa/dafbfadbb9cfb655b6ee60a960e34ce6.jpg" },
  { src: "https://i.pinimg.com/1200x/1d/6a/86/1d6a8649762634fd81401570693ea0ad.jpg" },
  { src: "https://i.pinimg.com/736x/02/02/0a/02020a754dd06b9ee1cb3e19aef487a8.jpg" },
  { src: "https://i.pinimg.com/736x/26/ef/e9/26efe972773303318a79f8f4df2501a0.jpg" },
];

export const IMAGE_LOADER_FINAL_IMAGE: ImageLoaderImage = {
  src: "https://i.pinimg.com/736x/da/d7/03/dad703e531b247d0bb0e729078a56db7.jpg",
  alt: "A woman embracing a cricket player after a match",
  objectPosition: "50% 45%",
};

export const IMAGE_LOADER_DEFAULT_CONFIG = {
  images: IMAGE_LOADER_IMAGES,
  finalImage: IMAGE_LOADER_FINAL_IMAGE,
  imageDuration: 0.22,
  transitionDuration: 0.12,
  holdDuration: 1,
  revealDuration: 0.9,
  initialDelay: 0.15,
  thumbnailWidth: 240,
  thumbnailAspectRatio: 1.6,
  borderRadius: 6,
  entranceScale: 0.85,
  ease: "power3.inOut" as ImageLoaderEase,
  background: "#191919",
};

export type ImageLoaderConfig = typeof IMAGE_LOADER_DEFAULT_CONFIG;

export function ImageLoaderDemo({
  config = IMAGE_LOADER_DEFAULT_CONFIG,
  compact = false,
}: {
  config?: ImageLoaderConfig;
  compact?: boolean;
}) {
  const [replay, setReplay] = useState(0);
  const [paused, setPaused] = useState(false);

  return (
    <div className={compact ? "w-full" : "flex w-full max-w-5xl flex-col gap-4"}>
      <ImageLoader
        {...config}
        thumbnailWidth={compact ? 88 : config.thumbnailWidth}
        paused={paused}
        replayKey={replay}
        className={
          compact ? "min-h-44 rounded-md" : "min-h-100 rounded-lg sm:min-h-120"
        }
      />
      {!compact && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            Five images. One reveal.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-pressed={paused}
              className="flex min-h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
            >
              {paused ? (
                <PlayIcon aria-hidden="true" className="size-3.5" />
              ) : (
                <PauseIcon aria-hidden="true" className="size-3.5" />
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
              <ResetIcon aria-hidden="true" className="size-3.5" />
              Replay loader
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const ranges = [
  { key: "imageDuration", label: "Image hold", min: 0.05, max: 1.5, step: 0.05, unit: "s" },
  { key: "transitionDuration", label: "Crossfade duration", min: 0.03, max: 0.6, step: 0.01, unit: "s" },
  { key: "holdDuration", label: "Last image hold", min: 0, max: 3, step: 0.1, unit: "s" },
  { key: "revealDuration", label: "Expansion duration", min: 0.2, max: 2.5, step: 0.05, unit: "s" },
  { key: "initialDelay", label: "Start delay", min: 0, max: 1, step: 0.05, unit: "s" },
  { key: "thumbnailWidth", label: "Thumbnail width", min: 100, max: 400, step: 10, unit: "px" },
  { key: "thumbnailAspectRatio", label: "Thumbnail ratio", min: 0.75, max: 2.5, step: 0.05, unit: "" },
  { key: "borderRadius", label: "Corner radius", min: 0, max: 32, step: 1, unit: "px" },
  { key: "entranceScale", label: "Entrance scale", min: 0.5, max: 1, step: 0.05, unit: "×" },
] as const;

export function ImageLoaderControls({
  config,
  onChange,
}: {
  config: ImageLoaderConfig;
  onChange: (config: ImageLoaderConfig) => void;
}) {
  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Image loader</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Tune the image sequence, then replay.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...IMAGE_LOADER_DEFAULT_CONFIG })}
          className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          <ResetIcon aria-hidden="true" className="size-3.5" />
          Reset
        </button>
      </div>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">Expansion easing</legend>
        <SegmentedControl
          options={[
            { value: "power3.inOut", label: "Smooth" },
            { value: "expo.inOut", label: "Dramatic" },
            { value: "sine.inOut", label: "Gentle" },
          ]}
          value={config.ease}
          onChange={(ease) =>
            onChange({ ...config, ease: ease as ImageLoaderEase })
          }
        />
      </fieldset>
      <label className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        Background
        <input
          type="color"
          aria-label="Loader background"
          value={config.background}
          onChange={(event) =>
            onChange({ ...config, background: event.target.value })
          }
          className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        {ranges.map(({ key, label, unit, ...range }) => (
          <label
            key={key}
            className="flex min-w-0 flex-col gap-2 rounded-xl border border-border p-3"
          >
            <span className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              {label}
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
      </div>
      <details className="rounded-xl border border-border p-3">
        <summary className="cursor-pointer text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50">
          Images and cropping
        </summary>
        <div className="mt-4 flex flex-col gap-3">
          {config.images.map((image, index) => (
            <label key={index} className="flex flex-col gap-2 text-xs text-muted-foreground">
              Image {index + 1} URL
              <input
                type="url"
                value={image.src}
                onChange={(event) => onChange({
                  ...config,
                  images: config.images.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, src: event.target.value } : item,
                  ),
                })}
                className="min-h-9 min-w-0 rounded-lg border border-border bg-background px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
              />
            </label>
          ))}
          <label className="flex flex-col gap-2 text-xs text-muted-foreground">
            Final image URL
            <input
              type="url"
              value={config.finalImage.src}
              onChange={(event) => onChange({
                ...config,
                finalImage: { ...config.finalImage, src: event.target.value },
              })}
              className="min-h-9 min-w-0 rounded-lg border border-border bg-background px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
            />
          </label>
          <fieldset>
            <legend className="mb-2 text-xs text-muted-foreground">Final image crop</legend>
            <SegmentedControl
              options={[
                { value: "50% 0%", label: "Top" },
                { value: "50% 45%", label: "Center" },
                { value: "50% 100%", label: "Bottom" },
              ]}
              value={config.finalImage.objectPosition ?? "50% 45%"}
              onChange={(objectPosition) => onChange({
                ...config,
                finalImage: { ...config.finalImage, objectPosition },
              })}
            />
          </fieldset>
        </div>
      </details>
    </div>
  );
}
