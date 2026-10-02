"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ResetIcon } from "@radix-ui/react-icons";
import {
  OrbitGallery,
  type OrbitGalleryProps,
} from "@/registry/base/orbit-gallery/orbit-gallery";
import { CustomizationRange } from "./customization-controls";
import { SegmentedControl } from "./segmented-control";

const photos = [
  ["photo-1490750967868-88aa4486c946", "Yellow flowers against the sky"],
  ["photo-1518837695005-2083093ee35b", "Turquoise ocean waves"],
  ["photo-1558618666-fcd25c85cd64", "Sport and movement"],
  ["photo-1500530855697-b586d89ba3ee", "Golden light over the landscape"],
  ["photo-1470252649378-9c29740c9fa8", "Warm sunset over rolling hills"],
  ["photo-1483985988355-763728e1935b", "Fashion in the city"],
  ["photo-1507525428034-b723cf961d3e", "Blue water and a sunlit beach"],
  ["photo-1533738363-b7f9aef128ce", "A playful portrait of a cat"],
  ["photo-1464822759023-fed622ff2c3b", "Mountain peaks in the clouds"],
  ["photo-1497250681960-ef046c08a56e", "Fresh green leaves"],
  ["photo-1493246507139-91e8fad9978e", "A mountain reflected in a lake"],
  ["photo-1441974231531-c6227db76b6e", "Sunlight through a forest"],
  ["photo-1519681393784-d120267933ba", "Stars above a snowy mountain"],
  ["photo-1524504388940-b1c1722653e1", "Portrait in warm light"],
  ["photo-1501854140801-50d01698950b", "Green hills from above"],
  ["photo-1482192596544-9eb780fc7f66", "A quiet alpine landscape"],
  ["photo-1470770841072-f978cf4d019e", "A lake beneath dramatic mountains"],
  ["photo-1506744038136-46273834b3fb", "A valley filled with golden light"],
  ["photo-1515886657613-9f3515b0c78f", "Colourful street style"],
  ["photo-1533105079780-92b9be482077", "Sunlit Mediterranean architecture"],
];

export const ORBIT_GALLERY_DEMO_ITEMS = photos.map(([id, alt]) => ({
  src: `https://images.unsplash.com/${id}?w=1000&auto=format&fit=crop&q=80`,
  alt,
}));

export const ORBIT_GALLERY_DEFAULT_CONFIG = {
  ringCount: 3,
  radius: 350,
  ringGap: 185,
  imageSize: 96,
  borderRadius: 12,
  speed: 3,
  tilt: 38,
  inertia: 0.8,
  hoverScale: 1.12,
  motionDuration: 0.65,
  autoRotate: true,
  pauseOnHover: true,
  reverse: false,
};

export type OrbitGalleryConfig = typeof ORBIT_GALLERY_DEFAULT_CONFIG;

const presets = {
  calm: { speed: 1.5, inertia: 1.2, tilt: 24, motionDuration: 0.85 },
  flow: { speed: 3, inertia: 0.8, tilt: 38, motionDuration: 0.65 },
  lively: { speed: 6, inertia: 0.55, tilt: 48, motionDuration: 0.5 },
};

const ranges = [
  { key: "ringCount", label: "Rings", min: 1, max: 5, step: 1 },
  { key: "radius", label: "Inner radius", min: 220, max: 550, step: 10 },
  { key: "ringGap", label: "Ring spacing", min: 100, max: 260, step: 5 },
  { key: "imageSize", label: "Image size", min: 40, max: 160, step: 4 },
  { key: "borderRadius", label: "Corner radius", min: 0, max: 40, step: 1 },
  { key: "speed", label: "Rotation speed", min: 0, max: 12, step: 0.5 },
  { key: "tilt", label: "Image tilt", min: 0, max: 65, step: 1 },
  { key: "inertia", label: "Scroll settling", min: 0.15, max: 2, step: 0.05 },
  { key: "hoverScale", label: "Hover scale", min: 1, max: 1.4, step: 0.01 },
  {
    key: "motionDuration",
    label: "Opening duration",
    min: 0.2,
    max: 1.5,
    step: 0.05,
  },
] as const;

export default function OrbitGalleryDemo(controls: Partial<OrbitGalleryProps>) {
  const [galleryReady, setGalleryReady] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative isolate h-full min-h-64 w-full overflow-hidden bg-[#0c0c10] @container">
      {galleryReady && (
        <motion.h1
          initial={{
            opacity: 0,
            filter: reducedMotion ? "blur(0px)" : "blur(3px)",
          }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: reducedMotion ? 0 : 0.8,
            ease: [0.2, 0.03, 0.26, 0.99],
          }}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center"
        >
          <span className="mb-2 font-serif text-[clamp(24px,4.2cqw,46px)] font-normal leading-none tracking-[-0.045em] text-[#ececf0]">
            Orbit gallery
          </span>
          <span className="text-[clamp(10px,1.5cqw,14px)] font-normal tracking-normal text-[#64646f]">
            Scroll or select a ring image
          </span>
        </motion.h1>
      )}
      <OrbitGallery
        {...controls}
        items={controls.items ?? ORBIT_GALLERY_DEMO_ITEMS}
        onReady={() => {
          setGalleryReady(true);
          controls.onReady?.();
        }}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

export function OrbitGalleryControls({
  config,
  onChange,
}: {
  config: OrbitGalleryConfig;
  onChange: (config: OrbitGalleryConfig) => void;
}) {
  const activePreset =
    Object.entries(presets).find(
      ([, preset]) =>
        preset.speed === config.speed &&
        preset.inertia === config.inertia &&
        preset.tilt === config.tilt &&
        preset.motionDuration === config.motionDuration,
    )?.[0] ?? "custom";

  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Orbit gallery
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Scroll, drag, or select an image to explore.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...ORBIT_GALLERY_DEFAULT_CONFIG })}
          className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          <ResetIcon className="size-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">
          Motion preset
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
      <div className="flex flex-wrap gap-x-5 gap-y-3">
        {(
          [
            ["autoRotate", "Auto rotate"],
            ["pauseOnHover", "Pause on hover"],
            ["reverse", "Reverse direction"],
          ] as const
        ).map(([key, label]) => (
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
    </div>
  );
}
