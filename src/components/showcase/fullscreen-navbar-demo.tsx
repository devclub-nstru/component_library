"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import {
  FullscreenNavbar,
  FULLSCREEN_NAVBAR_ITEMS,
  type FullscreenNavbarItem,
} from "@/registry/ui/fullscreen-navbar";
import { CustomizationRange } from "./customization-controls";
import { SITE_CONFIG } from "@/lib/constants";

export const FULLSCREEN_NAVBAR_DEFAULT_CONFIG = {
  brand: "devclub",
  logoSrc: SITE_CONFIG.logos.icon,
  actionLabel: "Start building",
  duration: 0.8,
  stiffness: 220,
  damping: 26,
  stagger: 0.045,
  background: "#f7f5ef",
  foreground: "#171717",
  accent: "#d34b30",
  headerForeground: "#ffffff",
  hoverDropdowns: true,
  showSpotlight: true,
  items: FULLSCREEN_NAVBAR_ITEMS as readonly FullscreenNavbarItem[],
  spotlightTitle: "Motion, made reusable.",
  spotlightDescription: "Explore animated components crafted by Dev Club.",
  spotlightTag: "Component spotlight",
  footerText: "Built by Dev Club. Made for your next idea.",
  contactLabel: "Let's build something together.",
  backgroundImage:
    "https://i.pinimg.com/736x/69/b4/d4/69b4d4bad8b68cceceed5c7a12ddb9e4.jpg",
};

export type FullscreenNavbarConfig = typeof FULLSCREEN_NAVBAR_DEFAULT_CONFIG;

export function FullscreenNavbarDemo({
  config = FULLSCREEN_NAVBAR_DEFAULT_CONFIG,
  compact = false,
}: {
  config?: FullscreenNavbarConfig;
  compact?: boolean;
}) {
  const [selected, setSelected] = useState("");
  const {
    logoSrc,
    showSpotlight,
    spotlightTitle,
    spotlightDescription,
    spotlightTag,
    backgroundImage,
    ...settings
  } = config;
  return (
    <div
      className={
        compact
          ? "@container/fullnavdemo relative h-60 w-full overflow-hidden rounded-lg bg-[#171717]"
          : "@container/fullnavdemo relative h-full min-h-120 w-full overflow-hidden rounded-lg bg-[#171717]"
      }
      onClickCapture={(event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const link = target.closest("a[href]");
        if (!link) return;
        event.preventDefault();
        setSelected(link.textContent?.trim() ?? "");
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
        className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-black/45"
      />
      <FullscreenNavbar
        {...settings}
        contained
        logo={
          <img
            src={logoSrc}
            alt=""
            className="size-8 rounded-lg object-contain"
          />
        }
        spotlight={
          showSpotlight
            ? {
                title: spotlightTitle,
                description: spotlightDescription,
                tag: spotlightTag,
                image: backgroundImage,
                href: "/components/grid-image-loader",
              }
            : undefined
        }
      />
      <div
        className={
          compact
            ? "absolute bottom-5 left-5 right-5 text-white"
            : "absolute bottom-10 left-6 right-6 text-white @[760px]/fullnavdemo:bottom-12 @[760px]/fullnavdemo:left-10"
        }
      >
        <h1
          className={
            compact
              ? "text-3xl font-medium leading-none tracking-tight"
              : "max-w-xl text-[clamp(2.5rem,6.5cqw,5rem)] font-medium leading-[0.98] tracking-[-0.055em]"
          }
        >
          Build something
          <br />
          worth sharing.
        </h1>
        {!compact && (
          <p className="mt-5 max-w-72 text-xs leading-relaxed text-white/60">
            Animated components. Thoughtful details. A community of builders.
          </p>
        )}
        <p aria-live="polite" className="mt-4 text-[10px] text-white/60">
          {selected ? `Selected: ${selected}` : ""}
        </p>
      </div>
    </div>
  );
}

const ranges = [
  {
    key: "duration",
    label: "Menu duration",
    min: 0.25,
    max: 1.5,
    step: 0.05,
    unit: "s",
  },
  {
    key: "stiffness",
    label: "Spring stiffness",
    min: 80,
    max: 500,
    step: 10,
    unit: "",
  },
  {
    key: "damping",
    label: "Spring damping",
    min: 12,
    max: 50,
    step: 1,
    unit: "",
  },
  {
    key: "stagger",
    label: "Link stagger",
    min: 0,
    max: 0.12,
    step: 0.005,
    unit: "s",
  },
] as const;

const textFields = [
  { key: "brand", label: "Brand name" },
  { key: "logoSrc", label: "Logo image URL" },
  { key: "actionLabel", label: "Action label" },
  { key: "spotlightTitle", label: "Spotlight title" },
  { key: "spotlightDescription", label: "Spotlight description" },
  { key: "spotlightTag", label: "Spotlight tag" },
  { key: "contactLabel", label: "Contact label" },
  { key: "footerText", label: "Footer text" },
  { key: "backgroundImage", label: "Background image URL" },
] as const;

export function FullscreenNavbarControls({
  config,
  onChange,
}: {
  config: FullscreenNavbarConfig;
  onChange: (config: FullscreenNavbarConfig) => void;
}) {
  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Fullscreen navbar</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Tune the menu, spring, and Dev Club content.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...FULLSCREEN_NAVBAR_DEFAULT_CONFIG })}
          className="flex min-h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs hover:bg-muted focus-visible:outline-2 focus-visible:outline-foreground"
        >
          <RotateCcw aria-hidden="true" className="size-3" />
          Reset
        </button>
      </div>
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
      {(
        [
          { key: "hoverDropdowns", label: "Hover dropdowns on desktop" },
          { key: "showSpotlight", label: "Show featured component" },
        ] as const
      ).map(({ key, label }) => (
        <label
          key={key}
          className="flex items-center justify-between gap-3 text-xs"
        >
          {label}
          <input
            type="checkbox"
            checked={config[key]}
            onChange={(event) =>
              onChange({ ...config, [key]: event.target.checked })
            }
            className="size-4 accent-foreground"
          />
        </label>
      ))}
      <div className="grid grid-cols-2 gap-3">
        {(
          ["background", "foreground", "accent", "headerForeground"] as const
        ).map((key) => (
          <label key={key} className="grid gap-2 text-xs text-muted-foreground">
            {
              {
                background: "Menu background",
                foreground: "Menu text",
                accent: "Accent",
                headerForeground: "Header text",
              }[key]
            }
            <input
              type="color"
              aria-label={key}
              value={config[key]}
              onChange={(event) =>
                onChange({ ...config, [key]: event.target.value })
              }
              className="h-9 w-full cursor-pointer rounded-md border border-border bg-transparent p-1"
            />
          </label>
        ))}
      </div>
      {textFields.map(({ key, label }) => (
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
      <label className="grid gap-2 text-xs text-muted-foreground">
        Navigation labels · one per line
        <textarea
          rows={6}
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
