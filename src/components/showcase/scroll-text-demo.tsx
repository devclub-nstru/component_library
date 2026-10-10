"use client";

import { useRef, type CSSProperties } from "react";
import { ResetIcon } from "@radix-ui/react-icons";
import { ScrollText } from "@/registry/ui/scroll-text";
import { ColorSwatches, CustomizationRange } from "./customization-controls";
import { SegmentedControl } from "./segmented-control";

export const SCROLL_TEXT_DEFAULT_CONFIG = {
  effect: "fade" as "fade" | "ascii" | "mosaic",
  dimOpacity: 0.16,
  scrub: 0.6,
  stagger: 0.12,
  rise: 0,
  blur: 8,
  fontSize: 36,
  lineHeight: 1.3,
  maxWidth: 880,
  align: "center" as "left" | "center" | "right",
  accentColor: "#c9a76a",
};

export type ScrollTextConfig = typeof SCROLL_TEXT_DEFAULT_CONFIG;

export function ScrollTextThumbnail() {
  return (
    <p
      aria-hidden="true"
      className="max-w-72 text-center text-2xl font-medium leading-[1.3] tracking-[-0.035em]"
    >
      Every word, <span className="text-[#c9a76a]">at your pace.</span>{" "}
      <span className="opacity-45">A little motion.</span>{" "}
      <span className="opacity-20">A lasting impression.</span>
    </p>
  );
}

export function ScrollTextDemo({
  config = SCROLL_TEXT_DEFAULT_CONFIG,
}: {
  config?: ScrollTextConfig;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { fontSize, lineHeight, maxWidth, ...revealConfig } = config;

  return (
    <div
      ref={scrollerRef}
      role="region"
      aria-label="Scroll text preview"
      tabIndex={0}
      className="@container/st h-full min-h-0 w-full overflow-x-hidden overflow-y-auto overscroll-contain bg-[#111110] font-sans text-[#eeede9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c9a76a] [scrollbar-color:#55534d_#111110] [scrollbar-width:thin]"
    >
      <div aria-hidden="true" className="h-[50%] min-h-24" />
      <div className="px-6 @lg/st:px-10">
        <ScrollText
          {...revealConfig}
          text="Scroll systems, cursor effects, text reveals, page transitions, and WebGL scenes, refined on real client launches. Preview the moment you need, install it with one command, then tune it in your own repo. It’s not a black box. It’s not another UI kit. It’s real, inspectable code you own."
          highlightWords={["systems", "refined", "tune", "black", "inspectable", "own"]}
          scroller={scrollerRef}
          start="top 50%"
          end="clamp(bottom 35%)"
          className="mx-auto text-[clamp(22px,4.4cqi,var(--st-font-size))]"
          style={
            {
              "--st-font-size": `${fontSize}px`,
              maxWidth,
              lineHeight,
            } as CSSProperties
          }
        />
      </div>
      <div aria-hidden="true" className="h-[65%] min-h-24" />
    </div>
  );
}

const ranges = [
  {
    key: "dimOpacity",
    label: "Dimmed opacity",
    min: 0.05,
    max: 0.6,
    step: 0.01,
  },
  { key: "scrub", label: "Scroll smoothing", min: 0, max: 2, step: 0.05 },
  { key: "stagger", label: "Word stagger", min: 0.01, max: 0.5, step: 0.01 },
  { key: "rise", label: "Word rise (px)", min: 0, max: 40, step: 1 },
  { key: "blur", label: "Softness (px)", min: 0, max: 12, step: 0.5 },
  { key: "fontSize", label: "Font size (px)", min: 24, max: 64, step: 1 },
  { key: "lineHeight", label: "Line height", min: 1.1, max: 1.8, step: 0.05 },
  { key: "maxWidth", label: "Text width (px)", min: 320, max: 1100, step: 20 },
] as const;

export function ScrollTextControls({
  config,
  onChange,
}: {
  config: ScrollTextConfig;
  onChange: (config: ScrollTextConfig) => void;
}) {
  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Scroll text</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Tune the reveal, then scroll in either direction.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...SCROLL_TEXT_DEFAULT_CONFIG })}
          className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          <ResetIcon className="size-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">Reveal effect</legend>
        <SegmentedControl
          options={[
            { value: "fade", label: "Fade" },
            { value: "ascii", label: "ASCII" },
            { value: "mosaic", label: "Mosaic" },
          ]}
          value={config.effect}
          onChange={(effect) => onChange({ ...config, effect })}
          className="grid-cols-3"
        />
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">Alignment</legend>
        <SegmentedControl
          options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ]}
          value={config.align}
          onChange={(align) => onChange({ ...config, align })}
          className="grid-cols-3"
        />
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">Accent color</legend>
        <ColorSwatches
          options={[
            { value: "#c9a76a", label: "Warm gold", color: "#c9a76a" },
            { value: "#a5b4fc", label: "Lavender", color: "#a5b4fc" },
            { value: "#86efac", label: "Mint", color: "#86efac" },
            { value: "#fda4af", label: "Rose", color: "#fda4af" },
          ]}
          value={config.accentColor}
          onChange={(accentColor) => onChange({ ...config, accentColor })}
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
              onChange={(event) => onChange({ ...config, [key]: Number(event.target.value) })}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
