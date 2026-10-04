"use client";

import { useState } from "react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { CurvedNavbar, CURVED_NAVBAR_ITEMS } from "@/registry/ui/curved-navbar";
import { CustomizationRange } from "./customization-controls";

export const CURVED_NAVBAR_DEFAULT_CONFIG = {
  brand: "devclub",
  logoSrc:
    "https://i.pinimg.com/736x/16/16/72/16167292c79a7d3ca27ef4f94d1b7424.jpg",
  actionLabel: "Get started",
  panelHeading: "A space for everything.",
  duration: 0.6,
  stiffness: 0.35,
  closeDelay: 0.12,
  compactWidth: 880,
  expandedWidth: 1040,
  curveRadius: 26,
  background: "#080808",
  foreground: "#f5f5f5",
  accent: "#b9f582",
  openOnHover: true,
  backgroundImage:
    "https://i.pinimg.com/736x/69/b4/d4/69b4d4bad8b68cceceed5c7a12ddb9e4.jpg",
};

export type CurvedNavbarConfig = typeof CURVED_NAVBAR_DEFAULT_CONFIG;

const sections = [
  {
    id: "features",
    label: "Features",
    title: "Made to move with you.",
    detail:
      "Thoughtful details. A little less friction. More room for what matters.",
  },
  {
    id: "stories",
    label: "Stories",
    title: "Every moment has a story.",
    detail: "Find a new perspective in the moments between the milestones.",
  },
  {
    id: "updates",
    label: "Updates",
    title: "Always moving forward.",
    detail: "Fresh ideas and considered improvements, one detail at a time.",
  },
  {
    id: "about",
    label: "About",
    title: "Built around your world.",
    detail: "A space for passion, purpose, and everything in between.",
  },
  {
    id: "get-started",
    label: "Get started",
    title: "Make your next move.",
    detail: "Your next chapter starts with a little curiosity.",
  },
];

export function CurvedNavbarDemo({
  config = CURVED_NAVBAR_DEFAULT_CONFIG,
  compact = false,
}: {
  config?: CurvedNavbarConfig;
  compact?: boolean;
}) {
  const [section, setSection] = useState("home");
  const active = sections.find((item) => item.id === section);
  const { backgroundImage, ...settings } = config;
  return (
    <div
      className={
        compact
          ? "@container/demo relative h-60 w-full overflow-hidden rounded-lg bg-[#151515]"
          : "@container/demo relative h-full min-h-140 w-full overflow-hidden rounded-lg bg-[#151515]"
      }
      onClick={(event) => {
        const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
          "a[href^='#']",
        );
        if (!link) return;
        event.preventDefault();
        setSection(link.getAttribute("href")!.slice(1));
      }}
    >
      <img
        src={backgroundImage}
        alt="Virat Kohli"
        loading="eager"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-black/15"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: config.background }}
      />
      <CurvedNavbar
        {...settings}
        items={CURVED_NAVBAR_ITEMS}
        className="top-1.5"
      >
        <a
          href="#stories"
          className="group block overflow-hidden rounded-2xl bg-white/6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--nav-accent)"
        >
          <div className="relative h-28 overflow-hidden">
            <img
              src={backgroundImage}
              alt=""
              loading="eager"
              className="h-full w-full object-cover object-[center_30%]"
            />
            <span className="absolute bottom-2 left-3 rounded-full bg-black/50 px-2 py-1 text-[9px] uppercase tracking-widest text-white backdrop-blur-sm">
              In focus
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 p-3">
            <div>
              <span className="block text-xs font-medium">
                The art of showing up.
              </span>
              <span className="mt-1 block text-[10px] opacity-45">
                Explore the story
              </span>
            </div>
            <ArrowUpRight aria-hidden="true" className="size-4 opacity-60" />
          </div>
        </a>
      </CurvedNavbar>
      <div
        className={
          compact
            ? "absolute bottom-5 left-5 right-5 text-white"
            : "absolute bottom-10 left-6 right-6 text-white sm:bottom-12 sm:left-10"
        }
        aria-live="polite"
      >
        <h1
          className={
            compact
              ? "max-w-56 text-3xl font-medium leading-none tracking-tight"
              : "max-w-lg text-[clamp(2.6rem,6cqw,5.5rem)] font-medium leading-[0.96] tracking-tighter"
          }
        >
          {active?.title ?? <>Stay in your element.</>}
        </h1>
        {!compact && (
          <p className="mt-5 max-w-72 text-sm leading-relaxed text-white/65">
            {active?.detail ??
              "A place for every passion. A new perspective on movement."}
          </p>
        )}
      </div>
      {!compact && (
        <span className="pointer-events-none absolute bottom-5 right-6 hidden text-[10px] text-white/50 @[680px]/demo:block">
          Hover to explore · click to stay
        </span>
      )}
    </div>
  );
}

const ranges = [
  {
    key: "duration",
    label: "Motion duration",
    min: 0.15,
    max: 1.5,
    step: 0.05,
    unit: "s",
  },
  {
    key: "stiffness",
    label: "Spring response",
    min: 0,
    max: 1,
    step: 0.05,
    unit: "",
  },
  {
    key: "closeDelay",
    label: "Hover close delay",
    min: 0,
    max: 0.6,
    step: 0.02,
    unit: "s",
  },
  {
    key: "compactWidth",
    label: "Compact width",
    min: 560,
    max: 1100,
    step: 20,
    unit: "px",
  },
  {
    key: "expandedWidth",
    label: "Expanded width",
    min: 700,
    max: 1400,
    step: 20,
    unit: "px",
  },
  {
    key: "curveRadius",
    label: "Corner curves",
    min: 12,
    max: 40,
    step: 1,
    unit: "px",
  },
] as const;

export function CurvedNavbarControls({
  config,
  onChange,
}: {
  config: CurvedNavbarConfig;
  onChange: (config: CurvedNavbarConfig) => void;
}) {
  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Curved navbar</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Shape the curves, motion, and content.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...CURVED_NAVBAR_DEFAULT_CONFIG })}
          className="flex min-h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs hover:bg-muted focus-visible:outline-2 focus-visible:outline-foreground"
        >
          <RotateCcw aria-hidden="true" className="size-3" />
          Reset
        </button>
      </div>
      <label className="flex items-center justify-between gap-3 text-xs">
        Open on hover
        <input
          type="checkbox"
          checked={config.openOnHover}
          onChange={(event) =>
            onChange({ ...config, openOnHover: event.target.checked })
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
      <div className="grid grid-cols-3 gap-3">
        {(["background", "foreground", "accent"] as const).map((key) => (
          <label
            key={key}
            className="grid gap-2 text-xs capitalize text-muted-foreground"
          >
            {key}
            <input
              type="color"
              aria-label={`Navbar ${key}`}
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
          "brand",
          "logoSrc",
          "actionLabel",
          "panelHeading",
          "backgroundImage",
        ] as const
      ).map((key) => (
        <label key={key} className="grid gap-2 text-xs text-muted-foreground">
          {
            {
              brand: "Brand name",
              logoSrc: "Logo image URL",
              actionLabel: "Action label",
              panelHeading: "Panel heading",
              backgroundImage: "Background image URL",
            }[key]
          }
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
    </div>
  );
}
