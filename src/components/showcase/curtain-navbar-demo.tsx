"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import {
  CurtainNavbar,
  CURTAIN_NAVBAR_ITEMS,
  type CurtainNavbarItem,
} from "@/registry/ui/curtain-navbar";
import { CustomizationRange } from "./customization-controls";

export const CURTAIN_NAVBAR_DEFAULT_CONFIG = {
  brand: "devclub",
  logoSrc: "/logo-favicon.png",
  duration: 0.85,
  stagger: 0.045,
  hoverDuration: 0.35,
  closeSpeed: 1.2,
  glitchDuration: 0.55,
  hoverScroll: true,
  scrollDuration: 0.8,
  background: "#67df32",
  foreground: "#161616",
  headerBackground: "#222222b3",
  headerForeground: "#ffffff",
  leftNote: "A community of builders.\nOpen source. Open minds.",
  rightNote: "Made by Dev Club.\nBuilt for the web.",
  footerText: "Thoughtful interfaces.\nMotion with purpose.",
  backgroundImage:
    "https://i.pinimg.com/736x/69/b4/d4/69b4d4bad8b68cceceed5c7a12ddb9e4.jpg",
  items: CURTAIN_NAVBAR_ITEMS as readonly CurtainNavbarItem[],
};

export type CurtainNavbarConfig = typeof CURTAIN_NAVBAR_DEFAULT_CONFIG;

export function CurtainNavbarDemo({
  config = CURTAIN_NAVBAR_DEFAULT_CONFIG,
  compact = false,
}: {
  config?: CurtainNavbarConfig;
  compact?: boolean;
}) {
  const [selected, setSelected] = useState("");
  const { backgroundImage, logoSrc, ...settings } = config;
  return (
    <div
      className={
        compact
          ? "@container/curtain-demo relative h-60 w-full overflow-hidden rounded-lg bg-[#171717]"
          : "@container/curtain-demo relative h-full min-h-120 w-full overflow-hidden rounded-lg bg-[#171717]"
      }
      onClickCapture={(event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const link = target.closest("a[href]");
        if (!link) return;
        event.preventDefault();
        setSelected(
          link.getAttribute("aria-label") ?? link.textContent?.trim() ?? "",
        );
      }}
    >
      <img
        src={backgroundImage}
        alt="Virat Kohli"
        className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
        loading="eager"
        decoding="async"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/85 via-black/15 to-black/35"
      />
      <CurtainNavbar
        {...settings}
        contained
        logo={
          <img src={logoSrc} alt="" className="h-full w-full object-cover" />
        }
      />
      <div className="pointer-events-none absolute inset-x-6 bottom-9 text-white @[760px]/curtain-demo:inset-x-9">
        <h1
          className={
            compact
              ? "text-3xl font-medium leading-none tracking-tight"
              : "max-w-xl text-[clamp(2.5rem,6.5cqw,5rem)] font-medium leading-none tracking-[-0.06em]"
          }
        >
          Ideas in motion.
          <br />
          Made to build.
        </h1>
        {!compact && (
          <p className="mt-5 max-w-sm text-xs leading-relaxed text-white/65">
            Components, craft, and a community that builds together.
          </p>
        )}
        <p
          aria-live="polite"
          className="mt-5 min-h-4 font-mono text-[9px] uppercase text-white/70"
        >
          {selected ? `Selected / ${selected}` : "Open the menu to explore"}
        </p>
      </div>
    </div>
  );
}

const ranges = [
  {
    key: "glitchDuration",
    label: "ASCII duration",
    min: 0.15,
    max: 1.2,
    step: 0.05,
    unit: "s",
  },
  {
    key: "scrollDuration",
    label: "Hover scroll duration",
    min: 0.2,
    max: 1.5,
    step: 0.05,
    unit: "s",
  },
  {
    key: "duration",
    label: "Curtain duration",
    min: 0.3,
    max: 1.6,
    step: 0.05,
    unit: "s",
  },
  {
    key: "stagger",
    label: "Link stagger",
    min: 0,
    max: 0.12,
    step: 0.005,
    unit: "s",
  },
  {
    key: "hoverDuration",
    label: "Hover duration",
    min: 0.15,
    max: 0.8,
    step: 0.05,
    unit: "s",
  },
  {
    key: "closeSpeed",
    label: "Close speed",
    min: 0.7,
    max: 2,
    step: 0.1,
    unit: "×",
  },
] as const;

export function CurtainNavbarControls({
  config,
  onChange,
}: {
  config: CurtainNavbarConfig;
  onChange: (config: CurtainNavbarConfig) => void;
}) {
  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Curtain navbar</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Tune the reveal, hover, and Dev Club content.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...CURTAIN_NAVBAR_DEFAULT_CONFIG })}
          className="flex min-h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs hover:bg-muted focus-visible:outline-2 focus-visible:outline-foreground"
        >
          <RotateCcw aria-hidden="true" className="size-3" />
          Reset
        </button>
      </div>
      <label className="flex items-center justify-between gap-3 text-xs">
        Scroll menu on hover
        <input
          type="checkbox"
          checked={config.hoverScroll}
          onChange={(event) =>
            onChange({ ...config, hoverScroll: event.target.checked })
          }
          className="size-4 accent-foreground"
        />
      </label>
      {ranges.map((range) => (
        <label
          key={range.key}
          className="grid gap-1.5 text-xs text-muted-foreground"
        >
          {range.label} · {config[range.key]}
          {range.unit}
          <CustomizationRange
            aria-label={range.label}
            min={range.min}
            max={range.max}
            step={range.step}
            value={config[range.key]}
            onChange={(event) =>
              onChange({ ...config, [range.key]: Number(event.target.value) })
            }
          />
        </label>
      ))}
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            { key: "background", label: "Menu background" },
            { key: "foreground", label: "Menu text" },
            { key: "headerForeground", label: "Header text" },
          ] as const
        ).map(({ key, label }) => (
          <label key={key} className="grid gap-2 text-xs text-muted-foreground">
            {label}
            <input
              type="color"
              aria-label={label}
              value={config[key]}
              onChange={(event) =>
                onChange({ ...config, [key]: event.target.value })
              }
              className="h-9 w-full cursor-pointer rounded-md border border-border bg-transparent p-1"
            />
          </label>
        ))}
      </div>
      {(
        [
          { key: "brand", label: "Brand name" },
          { key: "logoSrc", label: "Logo image URL" },
          { key: "headerBackground", label: "Header background (CSS color)" },
          { key: "backgroundImage", label: "Background image URL" },
        ] as const
      ).map(({ key, label }) => (
        <label key={key} className="grid gap-2 text-xs text-muted-foreground">
          {label}
          <input
            type="text"
            value={config[key]}
            onChange={(event) =>
              onChange({ ...config, [key]: event.target.value })
            }
            className="h-9 min-w-0 rounded-lg border border-border bg-background px-3 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-foreground"
          />
        </label>
      ))}
      {(
        [
          { key: "leftNote", label: "Left note" },
          { key: "rightNote", label: "Right note" },
          { key: "footerText", label: "Footer text" },
        ] as const
      ).map(({ key, label }) => (
        <label key={key} className="grid gap-2 text-xs text-muted-foreground">
          {label}
          <textarea
            rows={2}
            value={config[key]}
            onChange={(event) =>
              onChange({ ...config, [key]: event.target.value })
            }
            className="min-w-0 resize-y rounded-lg border border-border bg-background p-3 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-foreground"
          />
        </label>
      ))}
      <label className="grid gap-2 text-xs text-muted-foreground">
        Navigation labels · one per line
        <textarea
          rows={5}
          value={config.items.map((item) => item.label).join("\n")}
          onChange={(event) => {
            const labels = event.target.value.split("\n");
            onChange({
              ...config,
              items: config.items.map((item, index) => ({
                ...item,
                label: labels[index] ?? item.label,
              })),
            });
          }}
          className="min-w-0 resize-y rounded-lg border border-border bg-background p-3 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-foreground"
        />
      </label>
    </div>
  );
}
