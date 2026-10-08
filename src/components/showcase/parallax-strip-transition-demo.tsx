"use client";

import { ResetIcon } from "@radix-ui/react-icons";
import {
  ParallaxStripTransition,
  type ParallaxStripSlide,
} from "@/registry/ui/parallax-strip-transition";
import { CustomizationRange } from "./customization-controls";
import { SCROLLING_CARDS_ITEMS } from "./scrolling-cards-demo";

export const PARALLAX_STRIP_SLIDES: ParallaxStripSlide[] =
  SCROLLING_CARDS_ITEMS.map((item) => ({
    id: item.id,
    src: item.image,
    alt: item.imageAlt,
    imagePosition: item.imagePosition,
  }));

export const PARALLAX_STRIP_DEFAULT_CONFIG = {
  stripCount: 10,
  duration: 0.85,
  stripStagger: 0.03,
  zoomFrom: 1.12,
  autoplay: false,
  autoplayInterval: 6000,
  reduceMotion: false,
};

export type ParallaxStripConfig = typeof PARALLAX_STRIP_DEFAULT_CONFIG;

export function ParallaxStripTransitionDemo({
  config = PARALLAX_STRIP_DEFAULT_CONFIG,
  compact = false,
}: {
  config?: ParallaxStripConfig;
  compact?: boolean;
}) {
  return (
    <ParallaxStripTransition
      {...config}
      slides={
        compact ? PARALLAX_STRIP_SLIDES.slice(0, 1) : PARALLAX_STRIP_SLIDES
      }
      showControls={!compact}
      autoplay={!compact && config.autoplay}
      className={
        compact
          ? "h-56 min-h-0 w-full rounded-lg"
          : "h-full min-h-0 [&_footer]:right-[max(var(--strip-padding),88px)]"
      }
      ariaLabel="Virat Kohli image collection"
    />
  );
}

const ranges = [
  {
    key: "stripCount",
    label: "Strip count",
    min: 2,
    max: 20,
    step: 1,
    unit: "",
  },
  {
    key: "duration",
    label: "Motion duration",
    min: 0.35,
    max: 2,
    step: 0.05,
    unit: "s",
  },
  {
    key: "stripStagger",
    label: "Strip stagger",
    min: 0,
    max: 0.08,
    step: 0.005,
    unit: "s",
  },
  {
    key: "zoomFrom",
    label: "Image zoom",
    min: 1,
    max: 1.4,
    step: 0.01,
    unit: "×",
  },
  {
    key: "autoplayInterval",
    label: "Autoplay interval",
    min: 3000,
    max: 12000,
    step: 500,
    unit: "ms",
  },
] as const;

export function ParallaxStripTransitionControls({
  config,
  onChange,
}: {
  config: ParallaxStripConfig;
  onChange: (config: ParallaxStripConfig) => void;
}) {
  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Parallax strip transition
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Change images to preview the motion.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...PARALLAX_STRIP_DEFAULT_CONFIG })}
          className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          <ResetIcon className="size-3.5" aria-hidden="true" />
          Reset
        </button>
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
                {Number(config[key].toFixed(3))}
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
      {(
        [
          ["autoplay", "Autoplay images"],
          ["reduceMotion", "Reduce motion"],
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
  );
}
