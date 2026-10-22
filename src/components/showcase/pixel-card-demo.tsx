"use client";

import {
  PixelCard,
  type PixelCardPattern,
  type PixelCardVariant,
} from "@/registry/ui/pixel-card";
import { SegmentedControl } from "./segmented-control";

export interface PixelCardConfig {
  variant: PixelCardVariant;
  pattern: PixelCardPattern;
  speed: number;
  noise: number;
  gap: number;
}

export const PIXEL_CARD_DEFAULT_CONFIG: PixelCardConfig = {
  variant: "default",
  pattern: "wave",
  speed: 25,
  noise: 0,
  gap: 6,
};

export function PixelCardDemo({ config }: { config: PixelCardConfig }) {
  return (
    <div className="flex w-full max-w-72 items-center justify-center p-2 select-none">
      <PixelCard
        {...config}
        aria-label="Pixel card preview"
        className="aspect-4/5 w-full border-border bg-card p-6 dark:border-white/10 dark:bg-[#0c0c0e]"
        maxTilt={6}
      />
    </div>
  );
}

export function PixelCardControls({
  config,
  onChange,
}: {
  config: PixelCardConfig;
  onChange: (config: PixelCardConfig) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-4 p-3 font-sans sm:p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-foreground">
          Pixel Card settings
        </span>
        <button
          type="button"
          onClick={() => onChange({ ...PIXEL_CARD_DEFAULT_CONFIG })}
          className="cursor-pointer rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          Reset
        </button>
      </div>
      <fieldset className="min-w-0 space-y-2">
        <legend className="mb-2 text-xs text-muted-foreground">Pattern</legend>
        <SegmentedControl
          options={[
            { value: "wave", label: "Wave" },
            { value: "matrix", label: "Matrix" },
            { value: "scan", label: "Scan" },
            { value: "cross", label: "Cross" },
          ]}
          value={config.pattern}
          onChange={(pattern) => onChange({ ...config, pattern })}
        />
      </fieldset>
      <fieldset className="min-w-0 space-y-2">
        <legend className="mb-2 text-xs text-muted-foreground">Color</legend>
        <SegmentedControl
          options={[
            { value: "default", label: "Cyan" },
            { value: "blue", label: "Blue" },
            { value: "emerald", label: "Matrix" },
            { value: "yellow", label: "Amber" },
            { value: "pink", label: "Rose" },
            { value: "purple", label: "Violet" },
          ]}
          value={config.variant}
          onChange={(variant) => onChange({ ...config, variant })}
        />
      </fieldset>
      {([
        {
          key: "speed",
          label: "Speed",
          options: [
            { value: 12, label: "Slow" },
            { value: 25, label: "Normal" },
            { value: 45, label: "Fast" },
            { value: 70, label: "Turbo" },
          ],
        },
        {
          key: "noise",
          label: "Noise",
          options: [
            { value: 0, label: "Off" },
            { value: 0.25, label: "Subtle" },
            { value: 0.5, label: "Medium" },
            { value: 0.85, label: "Glitch" },
          ],
        },
        {
          key: "gap",
          label: "Density",
          options: [
            { value: 4, label: "Dense" },
            { value: 6, label: "Balanced" },
            { value: 9, label: "Sparse" },
          ],
        },
      ] as const).map(({ key, label, options }) => (
        <fieldset key={key} className="min-w-0 space-y-2">
          <legend className="mb-2 text-xs text-muted-foreground">{label}</legend>
          <SegmentedControl
            options={options.map((option) => ({
              value: String(option.value),
              label: option.label,
            }))}
            value={String(config[key])}
            onChange={(value) => onChange({ ...config, [key]: Number(value) })}
          />
        </fieldset>
      ))}
    </div>
  );
}
