"use client";

import { ResetIcon } from "@radix-ui/react-icons";
import {
  ScrollingCards,
  type ScrollingCardItem,
} from "@/registry/ui/scrolling-cards";
import { IMAGE_LOADER_IMAGES } from "./image-loader-demo";
import { CustomizationRange } from "./customization-controls";

export const SCROLLING_CARDS_ITEMS: ScrollingCardItem[] = [
  {
    id: "the-moment",
    image: IMAGE_LOADER_IMAGES[0].src,
    imageAlt: "Virat Kohli smiling under stadium lights in his blue India jersey",
    imagePosition: "50% 38%",
    color: "#ef4444",
  },
  {
    id: "the-passion",
    image: IMAGE_LOADER_IMAGES[1].src,
    imageAlt:
      "Virat Kohli laughing in his Test cricket whites while holding his bat and helmet",
    imagePosition: "50% 35%",
    color: "#3b82f6",
  },
  {
    id: "the-person",
    image: IMAGE_LOADER_IMAGES[2].src,
    imageAlt:
      "Virat Kohli smiling while seated beside the cricket field in his India Test jersey",
    imagePosition: "50% 42%",
    color: "#84cc16",
  },
];

export const SCROLLING_CARDS_DEFAULT_CONFIG = {
  stackGap: 24,
  scaleStep: 0.05,
  stiffness: 260,
  friction: 32,
  cardHeight: 420,
  borderRadius: 24,
  showIntro: true,
};

export type ScrollingCardsConfig = typeof SCROLLING_CARDS_DEFAULT_CONFIG;

export function ScrollingCardsDemo({
  config = SCROLLING_CARDS_DEFAULT_CONFIG,
  compact = false,
}: {
  config?: ScrollingCardsConfig;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div aria-hidden="true" className="relative h-44 w-full max-w-72">
        {SCROLLING_CARDS_ITEMS.map((item, index) => (
          <div
            key={item.id}
            className="absolute inset-x-0 h-32 overflow-hidden rounded-xl border-2 bg-zinc-950 shadow-xl"
            style={{
              top: index * 20,
              transform: `scale(${0.88 + index * 0.06})`,
              transformOrigin: "center top",
              borderColor: item.color,
              zIndex: index,
            }}
          >
            <img
              src={item.image}
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: item.imagePosition }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <ScrollingCards
      items={SCROLLING_CARDS_ITEMS}
      {...config}
      title="One player. Every emotion."
      eyebrow="THE VIRAT COLLECTION"
      subtitle="Three frames of Virat Kohli. One story, stacked as you scroll."
      ariaLabel="Virat Kohli scrolling cards"
      className="h-full min-h-0"
    />
  );
}

const ranges = [
  { key: "stackGap", label: "Stack spacing", min: 0, max: 40, step: 1, unit: "px" },
  { key: "scaleStep", label: "Scale step", min: 0, max: 0.1, step: 0.005, unit: "" },
  { key: "stiffness", label: "Stiffness", min: 80, max: 500, step: 10, unit: "" },
  { key: "friction", label: "Friction", min: 12, max: 60, step: 1, unit: "" },
  { key: "cardHeight", label: "Card height", min: 240, max: 600, step: 10, unit: "px" },
  { key: "borderRadius", label: "Corner radius", min: 0, max: 40, step: 1, unit: "px" },
] as const;

export function ScrollingCardsControls({
  config,
  onChange,
}: {
  config: ScrollingCardsConfig;
  onChange: (config: ScrollingCardsConfig) => void;
}) {
  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Scrolling cards</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Tune the motion, then scroll inside the preview.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...SCROLLING_CARDS_DEFAULT_CONFIG })}
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
                {Number(config[key].toFixed(3))}{unit}
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
          checked={config.showIntro}
          onChange={(event) =>
            onChange({ ...config, showIntro: event.target.checked })
          }
          className="size-4 accent-black dark:accent-white"
        />
        Show introduction
      </label>
    </div>
  );
}
