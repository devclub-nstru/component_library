"use client";

import { ResetIcon } from "@radix-ui/react-icons";
import type { ProjectRevealItem } from "@/registry/ui/project-reveal";
import { CustomizationRange } from "./customization-controls";
import { SegmentedControl } from "./segmented-control";

export const PROJECT_REVEAL_DEMO_ITEMS: ProjectRevealItem[] = [
  {
    id: "spiral",
    title: "Spiral",
    category: "Product film",
    year: 2026,
    image:
      "https://i.pinimg.com/736x/1d/49/b5/1d49b5da4ebfc59d5d7d4f1c288ecf17.jpg",
    imageAlt: "Artwork for Spiral",
    description:
      "The new boot, set into a spiral mown by hand the night before. We shot it top-down so the pattern did the talking.",
  },
  {
    id: "profile",
    title: "Profile",
    category: "Identity",
    year: 2025,
    image:
      "https://i.pinimg.com/736x/aa/dc/f3/aadcf3a33ce5d7c5281d730e385b16b3.jpg",
    imageAlt: "Artwork for Profile",
    description:
      "A portrait system for the athlete roster: one light, one colour field per sport, and no faces until the season opens.",
  },
  {
    id: "last-shot",
    title: "Last shot",
    category: "Campaign",
    year: 2025,
    image:
      "https://i.pinimg.com/736x/30/91/9c/30919cea93b729d9f5f52dadace041c4.jpg",
    imageAlt: "Artwork for Last shot",
    description:
      "A single frame at the buzzer, printed across twelve cities. The shadow carried the whole line.",
  },
];

export const PROJECT_REVEAL_DEFAULT_CONFIG = {
  stiffness: 300,
  damping: 32,
  mass: 1,
  speed: 1,
  closeSpeed: 1.15,
  borderRadius: 12,
  thumbnailSize: 36,
  modalWidth: 840,
  imageRatio: 0.455,
  overlayOpacity: 0.4,
  hoverDuration: 0.35,
  showYear: true,
};

export type ProjectRevealConfig = typeof PROJECT_REVEAL_DEFAULT_CONFIG;

const presets = {
  soft: { stiffness: 180, damping: 25, mass: 1 },
  smooth: { stiffness: 300, damping: 32, mass: 1 },
  snappy: { stiffness: 480, damping: 38, mass: 1 },
  springy: { stiffness: 260, damping: 22, mass: 1 },
};

const ranges = [
  { key: "stiffness", label: "Stiffness", min: 80, max: 800, step: 10 },
  { key: "damping", label: "Damping", min: 12, max: 80, step: 1 },
  { key: "mass", label: "Mass", min: 0.25, max: 3, step: 0.05 },
  { key: "speed", label: "Opening speed", min: 0.25, max: 3, step: 0.05 },
  {
    key: "hoverDuration",
    label: "Hover duration",
    min: 0.1,
    max: 0.8,
    step: 0.05,
  },
  {
    key: "closeSpeed",
    label: "Closing speed multiplier",
    min: 0.5,
    max: 2,
    step: 0.05,
  },
  { key: "borderRadius", label: "Corner radius", min: 0, max: 32, step: 1 },
  { key: "thumbnailSize", label: "Thumbnail size", min: 24, max: 64, step: 2 },
  { key: "modalWidth", label: "Card width", min: 560, max: 1100, step: 20 },
  {
    key: "imageRatio",
    label: "Image proportion",
    min: 0.3,
    max: 0.6,
    step: 0.005,
  },
  {
    key: "overlayOpacity",
    label: "Backdrop opacity",
    min: 0,
    max: 0.8,
    step: 0.05,
  },
] as const;

export function ProjectRevealControls({
  config,
  onChange,
}: {
  config: ProjectRevealConfig;
  onChange: (config: ProjectRevealConfig) => void;
}) {
  const activePreset =
    Object.entries(presets).find(
      ([, preset]) =>
        preset.stiffness === config.stiffness &&
        preset.damping === config.damping &&
        preset.mass === config.mass,
    )?.[0] ?? "custom";

  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Project reveal
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Tune the motion, then open any project.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...PROJECT_REVEAL_DEFAULT_CONFIG })}
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
          className="grid-cols-2 sm:grid-cols-4"
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
                {Number(config[key].toFixed(3))}
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
      <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={config.showYear}
          onChange={(event) =>
            onChange({ ...config, showYear: event.target.checked })
          }
          className="size-4 accent-black dark:accent-white"
        />
        Show year
      </label>
    </div>
  );
}
