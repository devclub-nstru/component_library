"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRightIcon,
  CodeIcon,
  InfoCircledIcon,
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  Cross2Icon,
  CopyIcon,
  CheckIcon,
  ChevronRightIcon,
  DesktopIcon,
  MobileIcon,
  ViewGridIcon,
  ResetIcon,
  ChevronDownIcon,
  LayersIcon,
  RocketIcon,
  BarChartIcon,
  GearIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { ComponentRegistryItem } from "@/types/component";
import { getComponentBySlug } from "@/registry";
import { SparkleButton } from "@/registry/ui/sparkle-button";
import { CandyButton } from "@/registry/ui/candy-button";
import { AnimatedButton } from "@/registry/ui/animated-button";
import { HorizontalScale, VerticalScale, Lines } from "@/registry/ui/scales";
import { SpotlightCard } from "@/registry/ui/spotlight-card";
import { PixelCard } from "@/registry/ui/pixel-card";
import { BentoGrid, BentoCard } from "@/registry/ui/bento-grid";
import { GlowingBadge } from "@/registry/ui/glowing-badge";
import { HookSidebar } from "@/registry/ui/hook-sidebar";
import { GitHubActivity } from "@/registry/ui/github-activity";
import { AnimatedCounter } from "@/registry/ui/animated-counter";
import {
  OtpInput,
  type OtpStatus,
  type OtpSize,
  type OtpVariant,
} from "@/registry/ui/otp-input";
import { CodeBlock } from "@/registry/ui/code-block";
import { SmoothAccordion } from "@/registry/ui/smooth-accordion";
import { Accordion } from "@/registry/ui/accordion";
import { DottedAccordion } from "@/registry/ui/dotted-accordion";
import {
  ProximitySidebar,
  type ProximitySection,
} from "@/registry/ui/proximity-sidebar";
import { Dither } from "@/registry/ui/dither";
import { Noise, type NoiseMode } from "@/registry/ui/noise";
import { AiOrb } from "@/registry/ui/ai-orb";
import { TwitterCard } from "@/registry/ui/twitter-card";
import { Toaster, toast } from "@/registry/ui/toast";
import { TaskList } from "@/registry/ui/task-list";
import { FileTree, type TreeNode } from "@/registry/ui/file-tree";
import { SearchComposer } from "@/registry/ui/search-input";
import { MorphSearch } from "@/registry/ui/morph-search";
import { Orb, ORB_STATES, ORB_COLORS } from "@/registry/ui/orb";
import type { OrbState } from "thinking-orbs";
import {
  LiquidToggle,
  type LiquidToggleSize,
  type LiquidToggleColor,
  type LiquidToggleViscosity,
} from "@/registry/ui/liquid-toggle";
import {
  GooeyNav,
  type GooeyNavSize,
  type GooeyNavColor,
  type GooeyNavVariant,
  type GooeyNavElasticity,
  type GooeyNavItem,
} from "@/registry/ui/gooey-nav";
import { PromptInput, type PromptInputRef } from "@/registry/ui/ai-input";
import {
  MacSlider,
  type MacSliderColor,
  type MacSliderSize,
  type MacSliderMaterial,
} from "@/registry/ui/mac-slider";
import { MacSwitch, type MacSwitchColor } from "@/registry/ui/mac-switch";
import { SpotlightSearch } from "@/registry/ui/spotlight-search";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComponentStudioProps {
  component: ComponentRegistryItem;
  allComponents?: ComponentRegistryItem[];
}

const ALL_CATEGORIES = [
  {
    label: "DISPLAY",
    items: [
      { label: "Scales & Borders", slug: "scales", href: "/components/scales" },
      {
        label: "Twitter(X) Card",
        slug: "twitter-card",
        href: "/components/twitter-card",
      },
      {
        label: "Spotlight Card",
        slug: "spotlight-card",
        href: "/components/spotlight-card",
      },
      {
        label: "Pixel Card",
        slug: "pixel-card",
        href: "/components/pixel-card",
      },
      {
        label: "GitHub activity",
        slug: "github-activity",
        href: "/components/github-activity",
      },
      {
        label: "Animated Counter",
        slug: "animated-counter",
        href: "/components/animated-counter",
      },
      {
        label: "Code Block",
        slug: "code-block",
        href: "/components/code-block",
      },
    ],
  },
  {
    label: "NAVIGATION",
    items: [
      {
        label: "Hook Sidebar",
        slug: "hook-sidebar",
        href: "/components/hook-sidebar",
      },
      {
        label: "Proximity Sidebar",
        slug: "proximity-sidebar",
        href: "/components/proximity-sidebar",
      },
      {
        label: "File Tree",
        slug: "file-tree",
        href: "/components/file-tree",
      },
      {
        label: "Gooey Nav",
        slug: "gooey-nav",
        href: "/components/gooey-nav",
      },
    ],
  },
  {
    label: "INPUTS",
    items: [
      {
        label: "OTP Input",
        slug: "otp-input",
        href: "/components/otp-input",
      },
      {
        label: "Sparkle Button",
        slug: "sparkle-button",
        href: "/components/sparkle-button",
      },
      {
        label: "Candy Button",
        slug: "candy-button",
        href: "/components/candy-button",
      },
      {
        label: "Animated Button",
        slug: "animated-button",
        href: "/components/animated-button",
      },
      {
        label: "Task List",
        slug: "task-list",
        href: "/components/task-list",
      },
      {
        label: "Liquid Toggle",
        slug: "liquid-toggle",
        href: "/components/liquid-toggle",
      },
    ],
  },
  {
    label: "AI STUFF",
    items: [
      {
        label: "AI Orb",
        slug: "ai-orb",
        href: "/components/ai-orb",
      },
      {
        label: "Thinking Orb",
        slug: "orb",
        href: "/components/orb",
      },
      {
        label: "Search Input",
        slug: "search-input",
        href: "/components/search-input",
      },
      {
        label: "Morph Search",
        slug: "morph-search",
        href: "/components/morph-search",
      },
      {
        label: "AI Input",
        slug: "ai-input",
        href: "/components/ai-input",
      },
    ],
  },
  {
    label: "ACCORDIONS",
    items: [
      {
        label: "Dotted Accordion",
        slug: "dotted-accordion",
        href: "/components/dotted-accordion",
      },
      {
        label: "Blur Reveal Accordion",
        slug: "accordion",
        href: "/components/accordion",
      },
      {
        label: "Smooth Accordion",
        slug: "smooth-accordion",
        href: "/components/smooth-accordion",
      },
    ],
  },
  {
    label: "APPLE UI",
    items: [
      {
        label: "Mac Slider",
        slug: "mac-slider",
        href: "/components/mac-slider",
      },
      {
        label: "Mac Switch",
        slug: "mac-switch",
        href: "/components/mac-switch",
      },
      {
        label: "Spotlight Search",
        slug: "spotlight-search",
        href: "/components/spotlight-search",
      },
    ],
  },
  {
    label: "LAYOUT & FEEDBACK",
    items: [
      {
        label: "Bento Grid",
        slug: "bento-grid",
        href: "/components/bento-grid",
      },
      {
        label: "Status Badge",
        slug: "glowing-badge",
        href: "/components/glowing-badge",
      },
      {
        label: "Toast",
        slug: "toast",
        href: "/components/toast",
      },
      {
        label: "Dither",
        slug: "dither",
        href: "/components/dither",
      },
      {
        label: "Noise",
        slug: "noise",
        href: "/components/noise",
      },
    ],
  },
];

const CATEGORIES = ALL_CATEGORIES.map((cat) => ({
  ...cat,
  items: cat.items.filter((item) => {
    const comp = getComponentBySlug(item.slug);
    return Boolean(comp && !comp.hidden);
  }),
})).filter((cat) => cat.items.length > 0);

const GOOEY_DEMO_ITEMS: GooeyNavItem[] = [
  { label: "Overview", icon: <LayersIcon className="w-3.5 h-3.5" /> },
  { label: "Deployments", icon: <RocketIcon className="w-3.5 h-3.5" /> },
  { label: "Analytics", icon: <BarChartIcon className="w-3.5 h-3.5" /> },
  { label: "Settings", icon: <GearIcon className="w-3.5 h-3.5" /> },
];

const FILE_TREE_DEMO_DATA: TreeNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      {
        id: "app",
        label: "app",
        children: [
          { id: "page-ts", label: "page.tsx" },
          { id: "layout-ts", label: "layout.tsx" },
          { id: "globals-css", label: "globals.css" },
        ],
      },
      {
        id: "components",
        label: "components",
        children: [
          { id: "hero-ts", label: "hero-section.tsx" },
          { id: "navbar-ts", label: "navbar.tsx" },
          { id: "footer-ts", label: "footer.tsx" },
        ],
      },
      {
        id: "registry",
        label: "registry",
        children: [
          {
            id: "ui-folder",
            label: "ui",
            children: [
              { id: "file-tree-ts", label: "file-tree.tsx" },
              { id: "smooth-accordion-ts", label: "smooth-accordion.tsx" },
              { id: "spotlight-card-ts", label: "spotlight-card.tsx" },
            ],
          },
          { id: "index-ts", label: "index.ts" },
        ],
      },
      {
        id: "lib",
        label: "lib",
        children: [
          { id: "utils-ts", label: "utils.ts" },
          { id: "registry-ts", label: "registry.ts" },
        ],
      },
    ],
  },
  {
    id: "public",
    label: "public",
    children: [
      { id: "favicon-ico", label: "favicon.ico" },
      { id: "logo-svg", label: "logo.svg" },
    ],
  },
  { id: "package-json", label: "package.json" },
  { id: "tsconfig-json", label: "tsconfig.json" },
  { id: "readme-md", label: "README.md" },
];

const HOOK_SIDEBAR_DEMO_CATEGORIES = [
  {
    label: "PLATFORM",
    items: [
      { label: "Overview" },
      { label: "Analytics" },
      { label: "Activity" },
    ],
  },
  {
    label: "DEVELOPMENT",
    items: [
      { label: "Components" },
      { label: "Hook Sidebar" },
      { label: "Spotlight Card" },
      { label: "Bento Grid" },
    ],
  },
  {
    label: "RESOURCES",
    items: [
      { label: "Documentation" },
      { label: "API Reference" },
      { label: "Settings" },
    ],
  },
];

type DemoSection = ProximitySection & { description?: string };

const PROXIMITY_DEMO_SECTIONS: DemoSection[] = [
  { id: "overview", label: "Overview & Architecture", kind: "title", level: 1 },
  {
    id: "overview-design",
    label: "System Design",
    kind: "body",
    description:
      "A lightweight document navigation minimap designed to replace heavy table-of-contents blocks with intuitive spatial awareness.",
  },
  {
    id: "overview-boundaries",
    label: "Architectural Boundaries",
    kind: "body",
    description:
      "Engineered without DOM wrappers, borders, or nested cards to integrate seamlessly into any article or documentation canvas.",
  },
  {
    id: "overview-primitives",
    label: "Core Primitives",
    kind: "body",
    description:
      "Constructed using hardware-accelerated scaleX transforms anchored to the document edge to preserve zero-cost layout calculations.",
  },
  {
    id: "overview-runtime",
    label: "Runtime Efficiency",
    kind: "body",
    description:
      "Zero layout shifts and sub-millisecond execution time make it well-suited for long-form documentation and interactive code references.",
  },
  {
    id: "overview-telemetry",
    label: "Telemetry Integration",
    kind: "body",
    description:
      "Real-time scroll position feedback provides precise tracking of reader engagement without extraneous polling loops.",
  },
  {
    id: "overview-topology",
    label: "State Topology",
    kind: "body",
    description:
      "Supports both controlled and uncontrolled active state bindings with optional external callbacks for seamless router synchronization.",
  },

  {
    id: "motion-engine",
    label: "Harmonic Motion Engine",
    kind: "title",
    level: 1,
  },
  {
    id: "motion-springs",
    label: "Spring Dynamics",
    kind: "body",
    description:
      "Harmonic oscillator configuration (stiffness 350, damping 32, mass 0.6) yields physical elasticity without unwanted overshoot.",
  },
  {
    id: "motion-cosine",
    label: "Cosine Proximity",
    kind: "body",
    description:
      "Cosine mathematical mapping ensures tangent boundaries at the perimeter of the proximity radius with zero sharp creases.",
  },
  {
    id: "motion-damping",
    label: "Damped Decay",
    kind: "body",
    description:
      "When the cursor departs the sidebar boundary, dashes return to their baseline rests through smooth exponential decay.",
  },
  {
    id: "motion-gpu",
    label: "GPU scaleX Pipeline",
    kind: "body",
    description:
      "Dash dimensions mutate strictly along the X axis via composited transform matrices, avoiding expensive style recalculations.",
  },
  {
    id: "motion-thrash",
    label: "Zero Layout Thrashing",
    kind: "body",
    description:
      "Bounding client geometry is evaluated and cached on pointer entry and resize rather than executed per continuous pointermove event.",
  },
  {
    id: "motion-origins",
    label: "Transform Anchors",
    kind: "body",
    description:
      "Supports left-center or right-center orientation anchors so lines extend naturally away from the document perimeter.",
  },

  {
    id: "scroll-sync",
    label: "Scroll Synchronization",
    kind: "title",
    level: 1,
  },
  {
    id: "scroll-anchors",
    label: "Viewport Anchors",
    kind: "body",
    description:
      "Tracks reading position against a configurable vertical anchor offset (default 40% from the container top).",
  },
  {
    id: "scroll-geometry",
    label: "Intersection Geometry",
    kind: "body",
    description:
      "Distance calculations determine the closest section boundary to prevent flickering between neighboring paragraphs.",
  },
  {
    id: "scroll-raf",
    label: "RequestAnimationFrame Sync",
    kind: "body",
    description:
      "Scroll event listeners are debounced through animation frames to guarantee 60-120 FPS synchronization during continuous momentum scrolling.",
  },
  {
    id: "scroll-containers",
    label: "Container Hierarchy",
    kind: "body",
    description:
      "Intelligently climbs the DOM hierarchy to detect overflow scroll parents or the window viewport dynamically.",
  },
  {
    id: "scroll-glide",
    label: "Bidirectional Glide",
    kind: "body",
    description:
      "Clicking any dash triggers smooth scrollIntoView behavior that places the corresponding heading directly at the top of the viewport.",
  },
  {
    id: "scroll-history",
    label: "URL Hash Synchronization",
    kind: "body",
    description:
      "Updates browser location history without disrupting scrolling or polluting the navigation history stack.",
  },
  {
    id: "scroll-thresholds",
    label: "Dynamic Thresholds",
    kind: "body",
    description:
      "Responsive height adjustments adapt the active detection anchor across compact tablet views and large widescreen monitors.",
  },

  {
    id: "interaction",
    label: "Interactive Ergonomics",
    kind: "title",
    level: 1,
  },
  {
    id: "inter-targets",
    label: "Hit Target Sizing",
    kind: "body",
    description:
      "Generous interactive hit heights ensure effortless targeting on touchscreens and mice while preserving hairline visual aesthetics.",
  },
  {
    id: "inter-proximity",
    label: "Proximity Radius",
    kind: "body",
    description:
      "Configurable influence radius smoothly expands nearby dashes before the cursor even makes contact with the dash stroke.",
  },
  {
    id: "inter-keyboard",
    label: "Keyboard Stepping",
    kind: "body",
    description:
      "Full ArrowUp and ArrowDown support allows keyboard users to step through document sections sequentially with auto-scrolling.",
  },
  {
    id: "inter-focus",
    label: "Focus Rings",
    kind: "body",
    description:
      "Accessible focus-visible rings highlight the currently focused dash during keyboard tab traversal.",
  },
  {
    id: "inter-aria",
    label: "ARIA Landmarks",
    kind: "body",
    description:
      "Proper role='navigation', aria-label='Page sections', and aria-current='location' tags provide complete screen reader compatibility.",
  },

  {
    id: "performance",
    label: "Performance & Reliability",
    kind: "title",
    level: 1,
  },
  {
    id: "perf-framerate",
    label: "120 FPS High Refresh",
    kind: "body",
    description:
      "Tested on ProMotion and 144Hz gaming displays to ensure fluid cursor tracking without frame skipping.",
  },
  {
    id: "perf-cached",
    label: "Cached Rects",
    kind: "body",
    description:
      "Eliminating synchronous getBoundingClientRect calls during motion transforms keeps CPU utilization below 1%.",
  },
  {
    id: "perf-subpixel",
    label: "Sub-pixel Compositing",
    kind: "body",
    description:
      "Hairline line widths maintain crisp sub-pixel clarity across Retina, OLED, and standard DPI displays.",
  },
  {
    id: "perf-memory",
    label: "Memory Footprint",
    kind: "body",
    description:
      "Minimal closure allocations and proper unmount teardown prevent memory leaks during long reading sessions.",
  },
  {
    id: "perf-listeners",
    label: "Passive Event Handlers",
    kind: "body",
    description:
      "Scroll and resize listeners use passive flags to avoid blocking browser scrolling and input threads.",
  },
  {
    id: "perf-bundle",
    label: "Bundle Optimization",
    kind: "body",
    description:
      "Zero dependencies beyond Motion and Tailwind keeps production bundle overhead under 3KB gzipped.",
  },

  { id: "appendix", label: "Specification Appendix", kind: "title", level: 1 },
];

const PALETTE = [
  { id: "blue", hex: "#3B82F6", label: "Electric Blue" },
  { id: "purple", hex: "#A855F7", label: "Neon Purple" },
  { id: "red", hex: "#EF4444", label: "Coral Red" },
  { id: "orange", hex: "#F97316", label: "Sunset Orange" },
  { id: "green", hex: "#22C55E", label: "Vibrant Green" },
] as const;

const CODE_KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "const",
  "let",
  "var",
  "function",
  "return",
  "interface",
  "type",
  "extends",
  "as",
  "typeof",
  "keyof",
  "new",
  "true",
  "false",
  "null",
  "undefined",
  "if",
  "else",
  "switch",
  "case",
]);

const panelSpring = {
  type: "spring" as const,
  stiffness: 450,
  damping: 35,
  mass: 0.8,
};

const microSpring = {
  type: "spring" as const,
  stiffness: 520,
  damping: 30,
};

const sheetSpring = {
  type: "spring" as const,
  stiffness: 460,
  damping: 38,
  mass: 0.8,
};

const fadeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 420,
      damping: 32,
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.15 },
  },
};

function highlightCode(code: string) {
  return code.split("\n").map((line, lineIdx) => {
    const regex =
      /(".*?"|'.*?'|`.*?`|\b[A-Za-z_$][A-Za-z0-9_$]*\b|[{}()[\];:,.=><&|!+*/?-]|\s+)/g;
    const tokens = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      const token = match[0];
      let colorClass = "text-zinc-300";
      if (
        token.startsWith('"') ||
        token.startsWith("'") ||
        token.startsWith("`")
      ) {
        colorClass = "text-zinc-400";
      } else if (CODE_KEYWORDS.has(token)) {
        colorClass = "text-white font-medium";
      } else if (/^[A-Z][A-Za-z0-9_$]*$/.test(token)) {
        colorClass = "text-zinc-200";
      } else if (/^[{}()[\];:,.=><&|!+*/?-]+$/.test(token)) {
        colorClass = "text-zinc-500";
      } else if (/^\d+$/.test(token)) {
        colorClass = "text-zinc-300";
      }
      tokens.push(
        <span key={match.index} className={colorClass}>
          {token}
        </span>,
      );
    }
    return (
      <div key={lineIdx} className="whitespace-pre">
        {tokens.length > 0 ? tokens : "\u00A0"}
      </div>
    );
  });
}

export const ComponentStudio = ({ component }: ComponentStudioProps) => {
  const [selectedSlug, setSelectedSlug] = useState(component.slug);
  const [prevPropSlug, setPrevPropSlug] = useState(component.slug);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [activeColor, setActiveColor] = useState<string>(PALETTE[3].hex);
  const [hookDemoIndex, setHookDemoIndex] = useState(0);
  const [counterDemoValue, setCounterDemoValue] = useState(122337);
  const [sparkleConfig, setSparkleConfig] = useState({
    animateBy: "letters" as "letters" | "words",
    direction: "top" as "top" | "bottom",
    delay: 40,
    stepDuration: 0.35,
    dissolveDuration: 0.2,
    springStiffness: 350,
    springDamping: 28,
  });

  const resetSparkleConfig = () => {
    setSparkleConfig({
      animateBy: "letters",
      direction: "top",
      delay: 40,
      stepDuration: 0.35,
      dissolveDuration: 0.2,
      springStiffness: 350,
      springDamping: 28,
    });
  };

  const [otpValue, setOtpValue] = useState("");
  const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");
  const [otpMask, setOtpMask] = useState(false);
  const [otpSize, setOtpSize] = useState<OtpSize>("md");
  const [otpVariant, setOtpVariant] = useState<OtpVariant>("default");
  const [otpGrouped, setOtpGrouped] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchBusy, setSearchBusy] = useState(false);
  const [orbStudioState, setOrbStudioState] = useState<OrbState>("breathing");
  const [orbStudioSize, setOrbStudioSize] = useState<number>(120);
  const [orbStudioSpeed, setOrbStudioSpeed] = useState<number>(1);
  const [orbStudioPaused, setOrbStudioPaused] = useState<boolean>(false);
  const [orbStudioColor, setOrbStudioColor] = useState<string | undefined>(
    undefined,
  );

  const resetOrbConfig = () => {
    setOrbStudioState("breathing");
    setOrbStudioSize(120);
    setOrbStudioSpeed(1);
    setOrbStudioPaused(false);
    setOrbStudioColor(undefined);
  };

  const [liquidChecked, setLiquidChecked] = useState(true);
  const [liquidSize, setLiquidSize] = useState<LiquidToggleSize>("md");
  const [liquidColor, setLiquidColor] =
    useState<LiquidToggleColor>("monochrome");
  const [liquidViscosity, setLiquidViscosity] =
    useState<LiquidToggleViscosity>("fluid");

  const resetLiquidConfig = () => {
    setLiquidChecked(true);
    setLiquidSize("md");
    setLiquidColor("monochrome");
    setLiquidViscosity("fluid");
  };

  const [macSliderVal, setMacSliderVal] = useState(45);
  const [macSliderColor, setMacSliderColor] = useState<MacSliderColor>("blue");
  const [macSliderSize, setMacSliderSize] = useState<MacSliderSize>("md");
  const [macSliderMaterial, setMacSliderMaterial] =
    useState<MacSliderMaterial>("liquid");
  const [macSliderForceActive, setMacSliderForceActive] = useState(false);
  const [macSliderSpecularOpacity, setMacSliderSpecularOpacity] = useState(0.4);
  const [macSliderSpecularSaturation, setMacSliderSpecularSaturation] =
    useState(6);
  const [macSliderRefractionLevel, setMacSliderRefractionLevel] =
    useState(0.28);
  const [macSliderBlurLevel, setMacSliderBlurLevel] = useState(0);

  const resetMacSliderConfig = () => {
    setMacSliderVal(45);
    setMacSliderColor("blue");
    setMacSliderSize("md");
    setMacSliderMaterial("liquid");
    setMacSliderForceActive(false);
    setMacSliderSpecularOpacity(0.4);
    setMacSliderSpecularSaturation(6);
    setMacSliderRefractionLevel(0.28);
    setMacSliderBlurLevel(0);
  };

  const [macSwitchColor, setMacSwitchColor] = useState<MacSwitchColor>("green");

  const [gooeyNavIndex, setGooeyNavIndex] = useState(0);
  const [gooeyNavSize, setGooeyNavSize] = useState<GooeyNavSize>("md");
  const [gooeyNavColor, setGooeyNavColor] = useState<GooeyNavColor>("orange");
  const [gooeyNavVariant, setGooeyNavVariant] =
    useState<GooeyNavVariant>("solid");
  const [gooeyNavElasticity, setGooeyNavElasticity] =
    useState<GooeyNavElasticity>("fluid");

  const resetGooeyNavConfig = () => {
    setGooeyNavIndex(0);
    setGooeyNavSize("md");
    setGooeyNavColor("orange");
    setGooeyNavVariant("solid");
    setGooeyNavElasticity("fluid");
  };

  const [noiseMode, setNoiseMode] = useState<NoiseMode>("grain");
  const [noiseAlpha, setNoiseAlpha] = useState(25);
  const [noiseInterval, setNoiseInterval] = useState(1);
  const [noiseScale, setNoiseScale] = useState(1);
  const [noiseVignette, setNoiseVignette] = useState(true);
  const [noiseScanlines, setNoiseScanlines] = useState(false);

  const resetNoiseConfig = () => {
    setNoiseMode("grain");
    setNoiseAlpha(25);
    setNoiseInterval(1);
    setNoiseScale(1);
    setNoiseVignette(true);
    setNoiseScanlines(false);
  };

  const [pixelVariant, setPixelVariant] = useState<
    "default" | "blue" | "yellow" | "pink" | "purple" | "emerald"
  >("default");
  const [pixelPattern, setPixelPattern] = useState<
    "wave" | "matrix" | "scan" | "cross"
  >("wave");
  const [pixelSpeed, setPixelSpeed] = useState<number>(25);
  const [pixelNoise, setPixelNoise] = useState<number>(0);
  const [pixelGap, setPixelGap] = useState<number>(6);

  const resetPixelConfig = () => {
    setPixelVariant("default");
    setPixelPattern("wave");
    setPixelSpeed(25);
    setPixelNoise(0);
    setPixelGap(6);
  };

  const resetOtpConfig = () => {
    setOtpStatus("idle");
    setOtpMask(false);
    setOtpSize("md");
    setOtpVariant("default");
    setOtpGrouped(false);
  };

  const promptInputRef = React.useRef<PromptInputRef>(null);
  const [aiInputValue, setAiInputValue] = useState("");
  const [aiInputVariant, setAiInputVariant] = useState<
    "default" | "glow" | "minimal"
  >("default");
  const [aiInputPlaceholder, setAiInputPlaceholder] = useState("Ask anything");
  const [aiInputAllowAttachments, setAiInputAllowAttachments] = useState(true);
  const [aiInputAllowVoice, setAiInputAllowVoice] = useState(true);
  const [aiInputAllowModelSelect, setAiInputAllowModelSelect] = useState(true);
  const [aiInputAllowEffortSelect, setAiInputAllowEffortSelect] =
    useState(true);
  const [aiInputMaxWidth, setAiInputMaxWidth] = useState<number>(480);

  const resetAiInputConfig = () => {
    promptInputRef.current?.clear();
    setAiInputValue("");
    setAiInputVariant("default");
    setAiInputPlaceholder("Ask anything");
    setAiInputAllowAttachments(true);
    setAiInputAllowVoice(true);
    setAiInputAllowModelSelect(true);
    setAiInputAllowEffortSelect(true);
    setAiInputMaxWidth(480);
  };

  const [twitterCardConfig, setTwitterCardConfig] = useState({
    username: "hey_krishnna",
    staticCard: false,
    enableCardTilt: true,
    enableLinkTilt: true,
    cardTiltMaxRotate: 6,
    linkTiltMaxRotate: 5,
  });

  const resetTwitterCardConfig = () => {
    setTwitterCardConfig({
      username: "hey_krishnna",
      staticCard: false,
      enableCardTilt: true,
      enableLinkTilt: true,
      cardTiltMaxRotate: 6,
      linkTiltMaxRotate: 5,
    });
  };

  const [toastConfig, setToastConfig] = useState<{
    position:
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right"
      | "top-center"
      | "bottom-center";
    richColors: boolean;
    expand: boolean;
    duration: number;
  }>({
    position: "bottom-right",
    richColors: false,
    expand: false,
    duration: 4000,
  });

  const resetToastConfig = () => {
    setToastConfig({
      position: "bottom-right",
      richColors: false,
      expand: false,
      duration: 4000,
    });
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<"none" | "info" | "code">(
    "none",
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [installCopied, setInstallCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  if (component.slug !== prevPropSlug) {
    setPrevPropSlug(component.slug);
    setSelectedSlug(component.slug);
  }

  const activeComponent = useMemo(() => {
    return getComponentBySlug(selectedSlug) || component;
  }, [selectedSlug, component]);

  const supportsColor = Boolean(
    activeComponent.slug !== "liquid-toggle" &&
    activeComponent.slug !== "gooey-nav" &&
    activeComponent.slug !== "ai-input" &&
    activeComponent.slug !== "mac-slider" &&
    activeComponent.slug !== "pixel-card" &&
    activeComponent.slug !== "orb" &&
    (activeComponent.supportsColor ??
      [
        "dither",
        "candy-button",
        "hook-sidebar",
        "proximity-sidebar",
        "ai-orb",
        "animated-button",
        "spotlight-card",
        "glowing-badge",
        "animated-counter",
        "code-block",
        "task-list",
        "file-tree",
      ].includes(activeComponent.slug)),
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activePanel !== "none") {
          setActivePanel("none");
        } else if (isFullscreen) {
          setIsFullscreen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePanel, isFullscreen]);

  useEffect(() => {
    const handlePopState = () => {
      const parts = window.location.pathname.split("/").filter(Boolean);
      if (parts[0] === "components" && parts[1]) {
        const target = getComponentBySlug(parts[1]);
        if (target) {
          setSelectedSlug(target.slug);
          setSelectedFileIndex(0);
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSelectSlug = (slug: string) => {
    const nextComp = getComponentBySlug(slug);
    if (nextComp && nextComp.slug !== activeComponent.slug) {
      setSelectedSlug(slug);
      setSelectedFileIndex(0);
      window.history.pushState(null, "", `/components/${slug}`);
    }
  };

  const activeFile =
    activeComponent.files[selectedFileIndex] || activeComponent.files[0];
  const activeCode = activeFile?.code || "";
  const codeLines = useMemo(() => activeCode.split("\n"), [activeCode]);
  const highlighted = useMemo(() => highlightCode(activeCode), [activeCode]);

  const handleInstallCopy = async () => {
    const cmd = `npm install ${activeComponent.dependencies.join(" ")}`;
    await navigator.clipboard.writeText(cmd);
    setInstallCopied(true);
    setTimeout(() => setInstallCopied(false), 2000);
  };

  const handleCodeCopy = async () => {
    await navigator.clipboard.writeText(activeCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const renderComponentPreview = (slug: string, color: string) => {
    switch (slug) {
      case "task-list":
        return (
          <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4 select-none">
            <TaskList accent={color} />
          </div>
        );
      case "otp-input":
        return (
          <div className="flex flex-col items-center justify-center gap-5 select-none w-full p-8 min-h-55">
            <OtpInput
              length={6}
              value={otpValue}
              onChange={setOtpValue}
              onComplete={(code) => {
                setOtpStatus(
                  code === "123456" || code === "729481" ? "success" : "error",
                );
              }}
              status={otpStatus}
              size={otpSize}
              variant={otpVariant}
              mask={otpMask}
              separator={
                otpGrouped ? (
                  <span className="w-2.5 h-0.5 rounded-full bg-zinc-600 dark:bg-zinc-700" />
                ) : undefined
              }
              groupSize={otpGrouped ? 3 : undefined}
            />
          </div>
        );
      case "search-input":
        return (
          <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-8">
            <SearchComposer
              value={searchValue}
              onChange={setSearchValue}
              onSubmit={() => {
                setSearchBusy(true);
                setTimeout(() => setSearchBusy(false), 2200);
              }}
              onClear={() => setSearchValue("")}
              busy={searchBusy}
              placeholder="What are we overthinking today?"
            />
          </div>
        );
      case "morph-search":
        return (
          <div className="flex items-center justify-center w-full max-w-xl mx-auto p-8">
            <MorphSearch />
          </div>
        );
      case "ai-input":
        return (
          <div className="flex items-center justify-center w-full min-h-110 p-4 sm:p-8 select-none">
            <PromptInput
              ref={promptInputRef}
              value={aiInputValue}
              onChange={setAiInputValue}
              placeholder={aiInputPlaceholder}
              allowAttachments={aiInputAllowAttachments}
              allowVoice={aiInputAllowVoice}
              allowModelSelect={aiInputAllowModelSelect}
              allowEffortSelect={aiInputAllowEffortSelect}
              maxWidth={aiInputMaxWidth}
              variant={aiInputVariant}
              onSubmit={(val, meta) => {
                toast.success(`Prompt sent to ${meta.model}`, {
                  description: `${meta.effort} effort • ${meta.attachments.length} attachment${meta.attachments.length === 1 ? "" : "s"}`,
                });
              }}
            />
          </div>
        );
      case "orb":
        return (
          <div className="flex items-center justify-center w-full h-full min-h-96 select-none p-8">
            <Orb
              state={orbStudioState}
              display={orbStudioSize}
              size={orbStudioSize <= 32 ? 20 : 64}
              speed={orbStudioSpeed}
              paused={orbStudioPaused}
              color={orbStudioColor}
              onClick={(_, nextState) => setOrbStudioState(nextState)}
            />
          </div>
        );
      case "liquid-toggle":
        return (
          <div className="flex items-center justify-center w-full h-full min-h-96 select-none p-8">
            <LiquidToggle
              checked={liquidChecked}
              onChange={setLiquidChecked}
              size={liquidSize}
              color={liquidColor}
              viscosity={liquidViscosity}
            />
          </div>
        );
      case "mac-slider":
        return (
          <div className="flex flex-col items-center justify-center w-full h-full min-h-96 select-none p-4 sm:p-8">
            <MacSlider
              value={macSliderVal}
              onChange={setMacSliderVal}
              color={macSliderColor}
              size={macSliderSize}
              material={macSliderMaterial}
              forceActive={macSliderForceActive}
              specularOpacity={macSliderSpecularOpacity}
              specularSaturation={macSliderSpecularSaturation}
              refractionLevel={macSliderRefractionLevel}
              blurLevel={macSliderBlurLevel}
            />
          </div>
        );
      case "mac-switch":
        return (
          <div className="flex flex-col items-center justify-center w-full h-full min-h-96 select-none p-4 sm:p-8">
            <MacSwitch defaultChecked={true} color={macSwitchColor} />
          </div>
        );
      case "spotlight-search":
        return (
          <div className="flex flex-col items-center justify-center w-full h-full min-h-96 select-none p-4 sm:p-8">
            <SpotlightSearch />
          </div>
        );
      case "gooey-nav":
        return (
          <div className="flex items-center justify-center w-full h-full min-h-96 select-none p-8">
            <GooeyNav
              items={GOOEY_DEMO_ITEMS}
              value={gooeyNavIndex}
              onChange={setGooeyNavIndex}
              size={gooeyNavSize}
              color={gooeyNavColor}
              variant={gooeyNavVariant}
              elasticity={gooeyNavElasticity}
            />
          </div>
        );
      case "sparkle-button":
        return (
          <div className="flex items-center justify-center select-none w-full p-8 min-h-55">
            <SparkleButton
              size="lg"
              text="Generate Magic"
              activeText="Generating..."
              animateBy={sparkleConfig.animateBy}
              direction={sparkleConfig.direction}
              delay={sparkleConfig.delay}
              stepDuration={sparkleConfig.stepDuration}
              dissolveDuration={sparkleConfig.dissolveDuration}
              springStiffness={sparkleConfig.springStiffness}
              springDamping={sparkleConfig.springDamping}
            />
          </div>
        );
      case "candy-button":
        return (
          <div className="flex flex-col items-center justify-center gap-7 select-none max-w-2xl w-full p-4">
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <CandyButton
                color={color}
                size="lg"
                rightIcon={<ArrowRightIcon className="h-4 w-4" />}
              >
                Interactive Action
              </CandyButton>
              <CandyButton color={color} size="default">
                Get Started
              </CandyButton>
              <CandyButton color={color} size="sm">
                Explore
              </CandyButton>
              <CandyButton color={color} size="icon">
                <CheckIcon className="h-4 w-4" />
              </CandyButton>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <CandyButton variant="emerald" size="default">
                Emerald
              </CandyButton>
              <CandyButton variant="ruby" size="default">
                Ruby
              </CandyButton>
              <CandyButton variant="amber" size="default">
                Amber
              </CandyButton>
              <CandyButton variant="violet" size="default">
                Violet
              </CandyButton>
              <CandyButton variant="azure" size="default">
                Azure
              </CandyButton>
              <CandyButton variant="obsidian" size="default">
                Obsidian
              </CandyButton>
            </div>
          </div>
        );
      case "animated-button":
        return (
          <div className="w-full max-w-md bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 select-none">
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div>
                <h3 className="text-sm font-medium text-white">
                  Interactive Action Stack
                </h3>
                <p className="text-[11px] text-zinc-400 font-light mt-0.5">
                  High-stiffness spring feedback & damping
                </p>
              </div>
              <span
                className="text-[10px] font-mono uppercase font-medium transition-colors duration-200"
                style={{ color }}
              >
                Spring
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <AnimatedButton
                variant="primary"
                showArrow
                style={{ backgroundColor: color }}
                className="w-full justify-between text-white shadow-lg transition-colors duration-200"
              >
                <span>Primary Action</span>
              </AnimatedButton>
              <div className="grid grid-cols-2 gap-3">
                <AnimatedButton variant="secondary" className="w-full">
                  Secondary
                </AnimatedButton>
                <AnimatedButton variant="outline" className="w-full">
                  Outline
                </AnimatedButton>
              </div>
              <AnimatedButton
                variant="shimmer"
                showArrow
                className="w-full justify-between"
              >
                <span>Shimmer Glow</span>
              </AnimatedButton>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/8 text-[11px] font-mono text-zinc-500">
              <span>Stiffness: 420, Damping: 34</span>
              <span className="text-zinc-400">GPU Accelerated</span>
            </div>
          </div>
        );
      case "github-activity":
        return <GitHubActivity />;
      case "hook-sidebar":
        return (
          <div className="w-full max-w-sm bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
            {HOOK_SIDEBAR_DEMO_CATEGORIES.map((cat, catIdx) => {
              const baseIndex = HOOK_SIDEBAR_DEMO_CATEGORIES.slice(
                0,
                catIdx,
              ).reduce((acc, c) => acc + c.items.length, 0);
              const activeIdx =
                hookDemoIndex >= baseIndex &&
                hookDemoIndex < baseIndex + cat.items.length
                  ? hookDemoIndex - baseIndex
                  : -1;

              return (
                <HookSidebar
                  key={cat.label}
                  label={cat.label}
                  value={activeIdx}
                  onChange={(idx) => setHookDemoIndex(baseIndex + idx)}
                  color={color}
                  items={cat.items}
                />
              );
            })}
          </div>
        );
      case "proximity-sidebar":
        return (
          <div className="w-full max-w-3xl h-140 flex items-start justify-center gap-12 select-text">
            <div className="sticky top-0 shrink-0 select-none pt-0.5">
              <ProximitySidebar
                sections={PROXIMITY_DEMO_SECTIONS}
                color={color}
                side="left"
              />
            </div>
            <div className="flex-1 h-full overflow-y-auto pr-6 space-y-7 scroll-smooth">
              {PROXIMITY_DEMO_SECTIONS.map((sec, idx) => (
                <div
                  key={sec.id}
                  id={sec.id}
                  className="scroll-mt-4 space-y-1.5"
                >
                  {sec.kind === "title" ? (
                    <div
                      className={cn(
                        "border-b border-white/8 pb-2",
                        idx === 0 ? "pt-0" : "pt-5",
                      )}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block leading-none">
                        Section
                      </span>
                      <h2 className="text-base font-medium text-white tracking-tight mt-1 leading-tight">
                        {sec.label}
                      </h2>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                        {sec.label}
                      </h3>
                      <p className="text-xs leading-relaxed text-zinc-400 font-light">
                        {sec.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case "twitter-card":
        return (
          <div className="flex h-full w-full items-center justify-center p-12 select-none">
            <TwitterCard
              username={twitterCardConfig.username}
              staticCard={twitterCardConfig.staticCard}
              enableCardTilt={twitterCardConfig.enableCardTilt}
              enableLinkTilt={twitterCardConfig.enableLinkTilt}
              cardTiltMaxRotate={twitterCardConfig.cardTiltMaxRotate}
              linkTiltMaxRotate={twitterCardConfig.linkTiltMaxRotate}
            />
          </div>
        );
      case "file-tree":
        return (
          <div className="w-full max-w-xs select-none">
            <FileTree
              data={FILE_TREE_DEMO_DATA}
              defaultExpandedIds={["src", "registry", "ui-folder"]}
              defaultSelectedIds={["file-tree-ts"]}
              showLines={true}
              showIcons={true}
              selectable={true}
            />
          </div>
        );
      case "dither":
        return (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <Dither
              color1={color}
              color2="#5227FF"
              color3="#0A0A10"
              grainAmount={0.15}
              grainScale={2.0}
              grainAnimated={true}
              warpStrength={1.2}
              timeSpeed={0.25}
              className="w-full h-full"
            />
          </div>
        );
      case "noise":
        return (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <Noise
              mode={noiseMode}
              patternAlpha={noiseAlpha}
              patternRefreshInterval={noiseInterval}
              patternScaleX={noiseScale}
              patternScaleY={noiseScale}
              vignette={noiseVignette}
              scanlines={noiseScanlines}
              className="w-full h-full"
            />
          </div>
        );
      case "ai-orb":
        return (
          <div className="flex flex-col items-center justify-center p-12 min-h-80 w-full select-none">
            <AiOrb color={color} />
          </div>
        );
      case "toast":
        return (
          <div className="flex flex-col items-center justify-center p-12 min-h-80 w-full select-none">
            <Toaster
              position={toastConfig.position}
              richColors={toastConfig.richColors}
              expand={toastConfig.expand}
              duration={toastConfig.duration}
            />
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <Button
                variant="outline"
                onClick={() =>
                  toast("Event has been created", {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                    action: {
                      label: "Undo",
                      onClick: () => {},
                    },
                  })
                }
              >
                Default Toast
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast.success("Success!", {
                    description: "Your action was completed successfully",
                  })
                }
              >
                Success Toast
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast.error("Error!", {
                    description: "Something went wrong. Please try again.",
                  })
                }
              >
                Error Toast
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast.promise(
                    new Promise((resolve) => setTimeout(resolve, 2000)),
                    {
                      loading: "Loading...",
                      success: "Promise resolved",
                      error: "Promise rejected",
                    },
                  )
                }
              >
                Promise Toast
              </Button>
            </div>
          </div>
        );
      case "scales":
        return (
          <div className="w-full max-w-xl bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div>
                <h3 className="text-sm font-medium text-white">
                  Architectural Scales
                </h3>
                <p className="text-[11px] text-zinc-400 font-light mt-0.5">
                  Repeating linear gradient borders
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <HorizontalScale className="w-full h-8" />
              <Lines className="w-full h-10" />
              <div className="h-20 flex justify-center items-center">
                <VerticalScale className="h-full" />
              </div>
            </div>
          </div>
        );
      case "spotlight-card":
        return (
          <div className="w-full max-w-md">
            <SpotlightCard
              className="p-6 border-white/10 bg-[#0c0c0e]"
              spotlightColor={color.startsWith("#") ? `${color}30` : color}
            >
              <h4 className="text-base font-medium text-white">
                Radial Spotlight
              </h4>
              <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                Smooth cursor tracking with radial falloff gradient.
              </p>
              <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Tailwind CSS</span>
                <span
                  className="transition-colors duration-200 font-medium"
                  style={{ color }}
                >
                  Active Theme
                </span>
              </div>
            </SpotlightCard>
          </div>
        );
      case "pixel-card":
        return (
          <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 p-4 sm:p-6 select-none">
            <div className="w-full max-w-72 shrink-0 flex items-center justify-center">
              <PixelCard
                className="w-full aspect-4/5 p-6 border-white/10 bg-[#0c0c0e]"
                variant={pixelVariant}
                pattern={pixelPattern}
                speed={pixelSpeed}
                noise={pixelNoise}
                gap={pixelGap}
                maxTilt={6}
              />
            </div>

            <div className="w-full max-w-xl shrink-0 rounded-2xl border border-white/10 bg-[#121215]/95 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-white/90 tracking-tight">
                  Pixel Card Controls
                </span>
                <button
                  type="button"
                  onClick={resetPixelConfig}
                  className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ResetIcon className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#0b0b0e] p-2 sm:p-2.5 flex flex-col gap-2">
                <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3.5 flex items-center gap-3 text-xs">
                  <span className="w-16 text-zinc-400 text-xs font-medium shrink-0">
                    Pattern
                  </span>
                  <div className="flex-1 min-w-0 flex items-center gap-1 bg-black/30 p-0.5 rounded-md border border-white/5 overflow-hidden">
                    {(
                      [
                        { id: "wave", label: "Wave" },
                        { id: "matrix", label: "Matrix" },
                        { id: "scan", label: "Scan" },
                        { id: "cross", label: "Cross" },
                      ] as const
                    ).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPixelPattern(p.id)}
                        className={cn(
                          "relative flex-1 min-w-0 h-6.5 px-2 rounded text-[11px] font-medium flex items-center justify-center transition-colors cursor-pointer select-none",
                          pixelPattern === p.id
                            ? "text-black font-semibold"
                            : "text-zinc-400 hover:text-white",
                        )}
                      >
                        {pixelPattern === p.id && (
                          <motion.div
                            layoutId="activePixelPatternIndicator"
                            transition={{
                              type: "spring",
                              stiffness: 450,
                              damping: 32,
                            }}
                            className="absolute inset-0 bg-white rounded shadow-xs"
                          />
                        )}
                        <span className="relative z-10 truncate">
                          {p.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3.5 flex items-center gap-3 text-xs">
                  <span className="w-16 text-zinc-400 text-xs font-medium shrink-0">
                    Color
                  </span>
                  <div className="flex-1 min-w-0 flex items-center gap-1 bg-black/30 p-0.5 rounded-md border border-white/5 overflow-hidden">
                    {(
                      [
                        { id: "default", label: "Cyan", dot: "bg-sky-400" },
                        { id: "blue", label: "Blue", dot: "bg-blue-500" },
                        {
                          id: "emerald",
                          label: "Matrix",
                          dot: "bg-emerald-400",
                        },
                        { id: "yellow", label: "Amber", dot: "bg-amber-400" },
                        { id: "pink", label: "Rose", dot: "bg-rose-400" },
                        {
                          id: "purple",
                          label: "Violet",
                          dot: "bg-purple-400",
                        },
                      ] as const
                    ).map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setPixelVariant(v.id)}
                        className={cn(
                          "relative flex-1 min-w-0 h-6.5 px-1.5 sm:px-2 rounded text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none",
                          pixelVariant === v.id
                            ? "text-black font-semibold"
                            : "text-zinc-400 hover:text-white",
                        )}
                      >
                        {pixelVariant === v.id && (
                          <motion.div
                            layoutId="activePixelVariantIndicator"
                            transition={{
                              type: "spring",
                              stiffness: 450,
                              damping: 32,
                            }}
                            className="absolute inset-0 bg-white rounded shadow-xs"
                          />
                        )}
                        <span
                          className={cn(
                            "relative z-10 w-2 h-2 rounded-full shrink-0",
                            v.dot,
                          )}
                        />
                        <span className="relative z-10 truncate">
                          {v.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3.5 flex items-center gap-3 text-xs">
                  <span className="w-16 text-zinc-400 text-xs font-medium shrink-0">
                    Speed
                  </span>
                  <div className="flex-1 min-w-0 flex items-center gap-1 bg-black/30 p-0.5 rounded-md border border-white/5 overflow-hidden">
                    {(
                      [
                        { val: 12, label: "Slow" },
                        { val: 25, label: "Normal" },
                        { val: 45, label: "Fast" },
                        { val: 70, label: "Turbo" },
                      ] as const
                    ).map((s) => (
                      <button
                        key={s.val}
                        type="button"
                        onClick={() => setPixelSpeed(s.val)}
                        className={cn(
                          "relative flex-1 min-w-0 h-6.5 px-2 rounded text-[11px] font-medium flex items-center justify-center transition-colors cursor-pointer select-none",
                          pixelSpeed === s.val
                            ? "text-black font-semibold"
                            : "text-zinc-400 hover:text-white",
                        )}
                      >
                        {pixelSpeed === s.val && (
                          <motion.div
                            layoutId="activePixelSpeedIndicator"
                            transition={{
                              type: "spring",
                              stiffness: 450,
                              damping: 32,
                            }}
                            className="absolute inset-0 bg-white rounded shadow-xs"
                          />
                        )}
                        <span className="relative z-10 truncate">
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3.5 flex items-center gap-3 text-xs">
                  <span className="w-16 text-zinc-400 text-xs font-medium shrink-0">
                    Noise
                  </span>
                  <div className="flex-1 min-w-0 flex items-center gap-1 bg-black/30 p-0.5 rounded-md border border-white/5 overflow-hidden">
                    {(
                      [
                        { val: 0, label: "Off" },
                        { val: 0.25, label: "Subtle" },
                        { val: 0.5, label: "Medium" },
                        { val: 0.85, label: "Glitch" },
                      ] as const
                    ).map((n) => (
                      <button
                        key={n.val}
                        type="button"
                        onClick={() => setPixelNoise(n.val)}
                        className={cn(
                          "relative flex-1 min-w-0 h-6.5 px-2 rounded text-[11px] font-medium flex items-center justify-center transition-colors cursor-pointer select-none",
                          pixelNoise === n.val
                            ? "text-black font-semibold"
                            : "text-zinc-400 hover:text-white",
                        )}
                      >
                        {pixelNoise === n.val && (
                          <motion.div
                            layoutId="activePixelNoiseIndicator"
                            transition={{
                              type: "spring",
                              stiffness: 450,
                              damping: 32,
                            }}
                            className="absolute inset-0 bg-white rounded shadow-xs"
                          />
                        )}
                        <span className="relative z-10 truncate">
                          {n.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3.5 flex items-center gap-3 text-xs">
                  <span className="w-16 text-zinc-400 text-xs font-medium shrink-0">
                    Density
                  </span>
                  <div className="flex-1 min-w-0 flex items-center gap-1 bg-black/30 p-0.5 rounded-md border border-white/5 overflow-hidden">
                    {(
                      [
                        { val: 4, label: "Dense" },
                        { val: 6, label: "Balanced" },
                        { val: 9, label: "Sparse" },
                      ] as const
                    ).map((g) => (
                      <button
                        key={g.val}
                        type="button"
                        onClick={() => setPixelGap(g.val)}
                        className={cn(
                          "relative flex-1 min-w-0 h-6.5 px-2 rounded text-[11px] font-medium flex items-center justify-center transition-colors cursor-pointer select-none",
                          pixelGap === g.val
                            ? "text-black font-semibold"
                            : "text-zinc-400 hover:text-white",
                        )}
                      >
                        {pixelGap === g.val && (
                          <motion.div
                            layoutId="activePixelGapIndicator"
                            transition={{
                              type: "spring",
                              stiffness: 450,
                              damping: 32,
                            }}
                            className="absolute inset-0 bg-white rounded shadow-xs"
                          />
                        )}
                        <span className="relative z-10 truncate">
                          {g.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "bento-grid":
        return (
          <div className="w-full max-w-lg bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <BentoGrid className="grid-cols-2 gap-3">
              <BentoCard
                colSpan={1}
                title="Telemetry"
                description="Real-time event logging."
              />
              <BentoCard
                colSpan={1}
                title="Throughput"
                description="Low latency processing."
              />
            </BentoGrid>
          </div>
        );
      case "glowing-badge":
        return (
          <div className="w-full max-w-md bg-[#0c0c0e] border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <GlowingBadge>PRODUCTION</GlowingBadge>
              <GlowingBadge
                style={{
                  borderColor: `${color}60`,
                  color,
                  boxShadow: `0 0 20px ${color}35`,
                  transition:
                    "color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                LIVE
              </GlowingBadge>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              Geometric status indicators
            </span>
          </div>
        );
      case "animated-counter": {
        const MAX = 150_000;
        const ROLL = 0.5;
        const TICKS = 41;
        const marker = Math.round(
          (Math.min(MAX, Math.max(0, counterDemoValue)) / MAX) * (TICKS - 1),
        );

        return (
          <div className="flex h-full w-full flex-col items-center justify-center gap-14 p-6 select-none">
            <AnimatedCounter
              value={counterDemoValue}
              duration={ROLL}
              grouping="indian"
              prefix={<span className="mr-0.5">₹</span>}
              className="font-mono text-6xl font-bold tracking-tight text-white **:data-[slot=animated-counter-mark]:mx-[-0.1em] sm:text-7xl"
            />

            <div className="relative w-80 sm:w-96 max-w-full shrink-0 rounded-xl px-px has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-[#868593]">
              <div
                aria-hidden
                className="flex h-8 w-full items-end justify-between"
              >
                {Array.from({ length: TICKS }, (_, index) =>
                  index === marker ? (
                    <span
                      key={index}
                      style={{ backgroundColor: color || "#FC4C01" }}
                      className="mx-[-0.5px] h-7 w-0.75 rounded-full shrink-0"
                    />
                  ) : (
                    <span
                      key={index}
                      className={`w-0.5 rounded-full shrink-0 transition-[height,background-color] duration-200 motion-reduce:transition-none ${
                        index < marker
                          ? "h-5 bg-[#EBEBF5]"
                          : "h-3.5 bg-[#3C3C43]"
                      }`}
                    />
                  ),
                )}
              </div>

              <input
                type="range"
                min={0}
                max={MAX}
                step={1}
                value={counterDemoValue}
                aria-label="Counter value"
                onChange={(event) =>
                  setCounterDemoValue(event.target.valueAsNumber)
                }
                className="absolute inset-0 h-full w-full cursor-grab appearance-none bg-transparent opacity-0 outline-none active:cursor-grabbing"
              />
            </div>
          </div>
        );
      }
      case "code-block":
        return (
          <div className="w-full max-w-2xl flex items-center justify-center p-4">
            <CodeBlock color={color} />
          </div>
        );
      case "dotted-accordion":
        return (
          <div className="w-full max-w-2xl p-4 sm:p-6 flex items-center justify-center">
            <DottedAccordion
              defaultIndex={0}
              items={[
                {
                  title: "Rectangular Grid Architecture",
                  description:
                    "Engineered with strict zero-radius rectangular geometry and flush contiguous boundary lines for technical developer dashboards and console layouts.",
                },
                {
                  title: "Continuous Dotted Guidelines",
                  description:
                    "Boundary strokes morph into continuous dotted lines that extend beyond both horizontal and vertical axes with smooth opacity mask falloffs.",
                },
                {
                  title: "Synchronized Drawer Mechanics",
                  description:
                    "Smooth height transitions perfectly synchronized with character reveals and adaptive spring damping curves.",
                },
                {
                  title: "Full Keyboard Accessibility",
                  description:
                    "Compliant with WAI-ARIA accordion standards with semantic button controls, aria-expanded binding, and zero-latency reduced-motion fallbacks.",
                },
              ]}
            />
          </div>
        );
      case "accordion":
        return (
          <div className="w-full max-w-xl p-4 sm:p-6">
            <Accordion
              defaultIndex={0}
              items={[
                {
                  title: "What is DevClub UI?",
                  description:
                    "DevClub UI is a curated collection of production-ready motion components built with React and Tailwind CSS, engineered for fluid micro-interactions and developer consoles.",
                },
                {
                  title: "How does the blur reveal physics work?",
                  description:
                    "Text reveals character-by-character using optical blur filters and spring damping curves, creating a smooth blooming effect as accordion drawers unfold.",
                },
                {
                  title: "Can I customize spring damping and stiffness?",
                  description:
                    "Yes, every physical property including stiffness, damping, mass, and stagger delay can be customized via props or overridden per instance.",
                },
                {
                  title: "Is keyboard accessibility supported?",
                  description:
                    "Full WAI-ARIA pattern support with semantic buttons, aria-expanded states, and automatic reduced motion fallbacks for accessibility.",
                },
              ]}
            />
          </div>
        );
      case "smooth-accordion":
        return (
          <div className="w-full max-w-xl p-4 sm:p-6">
            <SmoothAccordion
              type="single"
              defaultValue="item-1"
              items={[
                {
                  value: "item-1",
                  title: "Fluid Motion & Blur Physics",
                  subtitle: "GPU composited filter and height interpolation",
                  content:
                    "Answers emerge through an optical blur-to-sharp filter curve combined with hardware-accelerated transform interpolation. When another section is clicked, the active panel collapses concurrently in complete visual harmony with zero layout stutter.",
                },
                {
                  value: "item-2",
                  title: "Synchronized State Transitions",
                  subtitle: "Concurrent enter and exit animations",
                  content:
                    "Traditional accordions close before opening the next item, causing jarring multi-step layout jumps. DevClub UI synchronizes both lifecycles through identical spring damping curves for seamless fluid movement.",
                },
                {
                  value: "item-3",
                  title: "Sub-pixel Layout Calibration",
                  subtitle: "Zero CLS and overflow containment",
                  content:
                    "Calibrated with overflow clipping containment to prevent scrollbar flicker. Each trigger and content region maintains strict boundary geometry with theme-aware border accents and spring-rotated chevrons.",
                },
                {
                  value: "item-4",
                  title: "Accessible Keyboard Navigation",
                  subtitle:
                    "WAI-ARIA accordion pattern with Tab and Space/Enter",
                  content:
                    "Fully compliant with WAI-ARIA authoring practices. Features dynamic aria-expanded and aria-controls state binding, focus-visible indicators, and automatic reduced-motion fallbacks for vestibular sensitivity.",
                },
              ]}
            />
          </div>
        );
      default:
        return (
          <div className="text-zinc-500 font-mono text-xs">
            Preview unavailable
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen bg-black text-[#f4f4f5] flex overflow-hidden select-none">
      <motion.aside
        initial={false}
        animate={{
          width: isFullscreen ? 0 : sidebarOpen ? 260 : 64,
          opacity: isFullscreen ? 0 : 1,
        }}
        transition={panelSpring}
        className={cn(
          "shrink-0 bg-black flex flex-col overflow-hidden h-full z-20 border-r border-white/5",
          isFullscreen && "border-r-0",
        )}
      >
        <div className="p-3.5 flex items-center justify-between h-14 shrink-0 border-b border-white/5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            transition={microSpring}
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg border border-white/10 bg-[#18181b] hover:bg-[#222226] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={microSpring}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <rect x="2" y="2" width="12" height="12" rx="2" />
                <path d="M6 2v12" />
              </svg>
            </motion.div>
          </motion.button>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence initial={false} mode="popLayout">
            {sidebarOpen && (
              <motion.div
                key="sidebar-expanded"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={panelSpring}
                className="w-65 min-w-65 h-full overflow-y-auto px-4 pb-6 pt-3 space-y-6 scrollbar-none font-sans"
              >
                <Link
                  href="/components"
                  className="flex items-center justify-between text-xs font-medium text-zinc-300 hover:text-orange-400 transition-colors tracking-tight px-1 py-1"
                >
                  <span>All Components</span>
                  <ChevronRightIcon className="w-3.5 h-3.5 text-zinc-600" />
                </Link>

                <div className="space-y-6">
                  {CATEGORIES.map((cat) => {
                    const activeItemIdx = cat.items.findIndex(
                      (item) => item.slug === activeComponent.slug,
                    );

                    return (
                      <HookSidebar
                        key={cat.label}
                        label={cat.label}
                        value={activeItemIdx >= 0 ? activeItemIdx : -1}
                        items={cat.items.map((item) => ({
                          label: item.label,
                          href: item.href,
                          onClick: (e: React.MouseEvent<HTMLElement>) => {
                            if (
                              !e.metaKey &&
                              !e.ctrlKey &&
                              !e.shiftKey &&
                              e.button === 0
                            ) {
                              e.preventDefault();
                              handleSelectSlug(item.slug);
                            }
                          },
                        }))}
                        color="#F97316"
                        dashed={true}
                      />
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      <motion.div
        animate={{
          padding: "14px",
          gap: "16px",
        }}
        transition={panelSpring}
        className="flex-1 flex overflow-hidden h-full relative p-3.5 gap-4"
      >
        <motion.main
          layout
          transition={panelSpring}
          animate={{
            borderRadius: 24,
            scale: activePanel === "code" ? 0.985 : 1,
            opacity: activePanel === "code" ? 0.75 : 1,
          }}
          className="relative border border-white/8 bg-[#0f0f11] flex flex-col overflow-hidden h-full flex-1 rounded-3xl"
        >
          <div className="h-14 px-5 border-b border-white/5 flex items-center justify-between z-20 shrink-0 bg-[#0f0f11]/80 backdrop-blur-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 shrink-0">
                {activeComponent.category.replace("-", " ")}
              </span>
              <span className="text-zinc-700 shrink-0">/</span>
              <span className="text-xs font-sans font-medium text-white tracking-tight truncate">
                {activeComponent.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center p-0.5 rounded-lg border border-white/10 bg-[#18181b]/90 shadow-sm mr-1">
                <button
                  type="button"
                  onClick={() => setViewport("desktop")}
                  title="Desktop (100%)"
                  className={cn(
                    "p-1.5 rounded-md transition-colors cursor-pointer",
                    viewport === "desktop"
                      ? "bg-white/15 text-white"
                      : "text-zinc-500 hover:text-zinc-300",
                  )}
                >
                  <DesktopIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("tablet")}
                  title="Tablet (768px)"
                  className={cn(
                    "p-1.5 rounded-md transition-colors cursor-pointer",
                    viewport === "tablet"
                      ? "bg-white/15 text-white"
                      : "text-zinc-500 hover:text-zinc-300",
                  )}
                >
                  <ViewGridIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("mobile")}
                  title="Mobile (390px)"
                  className={cn(
                    "p-1.5 rounded-md transition-colors cursor-pointer",
                    viewport === "mobile"
                      ? "bg-white/15 text-white"
                      : "text-zinc-500 hover:text-zinc-300",
                  )}
                >
                  <MobileIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                transition={microSpring}
                type="button"
                onClick={handleInstallCopy}
                className="h-8 px-3 rounded-lg border border-white/10 bg-[#18181b]/90 hover:bg-[#222226] text-zinc-300 hover:text-white text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                {installCopied ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <span>npm i</span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                transition={microSpring}
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={
                  isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"
                }
                className="w-8 h-8 rounded-lg border border-white/10 bg-[#18181b]/90 hover:bg-[#222226] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
              >
                {isFullscreen ? (
                  <ExitFullScreenIcon className="w-3.5 h-3.5" />
                ) : (
                  <EnterFullScreenIcon className="w-3.5 h-3.5" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                transition={microSpring}
                type="button"
                onClick={() =>
                  setActivePanel(activePanel === "code" ? "none" : "code")
                }
                className={cn(
                  "h-8 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs transition-all cursor-pointer shadow-sm",
                  activePanel === "code"
                    ? "border-orange-500/80 text-orange-400 bg-orange-500/15 shadow-orange-500/10 shadow-md font-medium"
                    : "border-white/10 bg-[#18181b]/90 hover:bg-[#222226] text-zinc-400 hover:text-white",
                )}
              >
                <CodeIcon className="w-3.5 h-3.5" />
                <span className="text-[11px]">Code</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                transition={microSpring}
                type="button"
                onClick={() =>
                  setActivePanel(activePanel === "info" ? "none" : "info")
                }
                className={cn(
                  "h-8 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs transition-all cursor-pointer shadow-sm",
                  activePanel === "info"
                    ? "border-orange-500/80 text-orange-400 bg-orange-500/15 shadow-orange-500/10 shadow-md font-medium"
                    : "border-white/10 bg-[#18181b]/90 hover:bg-[#222226] text-zinc-400 hover:text-white",
                )}
              >
                <InfoCircledIcon className="w-3.5 h-3.5" />
                <span className="text-[11px]">Info</span>
              </motion.button>
            </div>
          </div>

          <div
            className={cn(
              "flex-1 flex items-center justify-center overflow-hidden relative",
              (activeComponent.slug === "dither" ||
                activeComponent.slug === "noise") &&
                viewport === "desktop"
                ? "p-0"
                : "p-6",
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[20px_20px] opacity-15 pointer-events-none" />

            <motion.div
              layout
              transition={panelSpring}
              animate={{
                width:
                  viewport === "mobile"
                    ? 390
                    : viewport === "tablet"
                      ? 768
                      : "100%",
                height:
                  viewport === "mobile"
                    ? 640
                    : viewport === "tablet"
                      ? 520
                      : "100%",
                borderRadius:
                  viewport === "mobile" ? 40 : viewport === "tablet" ? 24 : 0,
              }}
              className={cn(
                "relative flex flex-col items-center justify-center overflow-hidden transition-colors",
                viewport !== "desktop" &&
                  "border border-white/15 bg-[#09090b] shadow-[0_25px_60px_rgba(0,0,0,0.9)] my-auto max-h-[90vh]",
              )}
            >
              {viewport === "mobile" && (
                <div className="absolute top-3 inset-x-0 flex justify-center z-30 pointer-events-none">
                  <div className="w-20 h-3.5 bg-black rounded-full border border-white/10" />
                </div>
              )}

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeComponent.slug}
                  initial={{ opacity: 0, scale: 0.97, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -10 }}
                  transition={panelSpring}
                  className={cn(
                    "w-full h-full flex items-center justify-center overflow-auto",
                    activeComponent.slug === "dither" ||
                      activeComponent.slug === "noise"
                      ? "p-0"
                      : "p-6",
                  )}
                >
                  {renderComponentPreview(activeComponent.slug, activeColor)}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none z-30">
              {supportsColor && (
                <div
                  key="floating-color-palette"
                  className="pointer-events-auto rounded-full border border-white/12 bg-[#121215]/95 backdrop-blur-2xl p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)] flex items-center gap-1.5 select-none"
                >
                  {PALETTE.map((p) => {
                    const isSelected = activeColor === p.hex;
                    return (
                      <motion.button
                        key={p.id}
                        type="button"
                        onClick={() => setActiveColor(p.hex)}
                        title={p.label}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        transition={microSpring}
                        className="relative w-8 h-8 rounded-full flex items-center justify-center cursor-pointer outline-none shrink-0"
                      >
                        {isSelected && (
                          <motion.span
                            layoutId="activeColorRing"
                            className="absolute inset-0 rounded-full border-2 border-white shadow-[0_0_12px_rgba(255,255,255,0.4)] pointer-events-none"
                            transition={{
                              type: "spring",
                              stiffness: 480,
                              damping: 32,
                            }}
                          />
                        )}
                        <span
                          style={{ backgroundColor: p.hex }}
                          className={cn(
                            "w-5.5 h-5.5 rounded-full shadow-xs transition-all duration-200",
                            isSelected
                              ? "opacity-100 scale-100"
                              : "opacity-65 hover:opacity-90 scale-95 hover:scale-100",
                          )}
                        />
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {activeComponent.slug === "sparkle-button" && (
                <div
                  key="sparkle-customize-panel"
                  className="pointer-events-auto rounded-2xl border border-white/10 bg-[#121215]/95 backdrop-blur-2xl p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] max-w-xl w-full mx-4 select-none flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-white/90 tracking-tight">
                      Customize
                    </span>
                    <button
                      type="button"
                      onClick={resetSparkleConfig}
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#0b0b0e] p-1.5 flex flex-col gap-1.5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setSparkleConfig((prev) => ({
                            ...prev,
                            animateBy:
                              prev.animateBy === "letters"
                                ? "words"
                                : "letters",
                          }))
                        }
                        className="rounded-lg border border-white/5 bg-[#17171b] hover:bg-[#1f1f25] px-3 py-2 flex items-center justify-between text-xs transition-colors cursor-pointer"
                      >
                        <span className="text-zinc-400">Animate By</span>
                        <span className="text-zinc-100 font-medium flex items-center gap-1.5">
                          {sparkleConfig.animateBy === "letters"
                            ? "Letters"
                            : "Words"}
                          <ChevronDownIcon className="w-3.5 h-3.5 text-zinc-400" />
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSparkleConfig((prev) => ({
                            ...prev,
                            direction:
                              prev.direction === "top" ? "bottom" : "top",
                          }))
                        }
                        className="rounded-lg border border-white/5 bg-[#17171b] hover:bg-[#1f1f25] px-3 py-2 flex items-center justify-between text-xs transition-colors cursor-pointer"
                      >
                        <span className="text-zinc-400">Direction</span>
                        <span className="text-zinc-100 font-medium flex items-center gap-1.5">
                          {sparkleConfig.direction === "top" ? "Top" : "Bottom"}
                          <ChevronDownIcon className="w-3.5 h-3.5 text-zinc-400" />
                        </span>
                      </button>

                      <div className="rounded-lg border border-white/5 bg-[#17171b] px-3 py-2 flex items-center justify-between gap-2.5 text-xs">
                        <span className="text-zinc-400 shrink-0">Delay</span>
                        <div className="h-3.5 w-px bg-white/10 shrink-0" />
                        <input
                          type="range"
                          min="10"
                          max="200"
                          step="5"
                          value={sparkleConfig.delay}
                          onChange={(e) =>
                            setSparkleConfig((prev) => ({
                              ...prev,
                              delay: Number(e.target.value),
                            }))
                          }
                          className="w-full accent-white h-1 bg-white/10 rounded cursor-pointer"
                        />
                        <span className="text-zinc-100 font-medium shrink-0 min-w-10.5 text-right">
                          {sparkleConfig.delay}ms
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                      <div className="rounded-lg border border-white/5 bg-[#17171b] px-3 py-2 flex items-center justify-between gap-2.5 text-xs">
                        <span className="text-zinc-400 shrink-0">Reveal</span>
                        <div className="h-3.5 w-px bg-white/10 shrink-0" />
                        <input
                          type="range"
                          min="0.15"
                          max="0.60"
                          step="0.05"
                          value={sparkleConfig.stepDuration}
                          onChange={(e) =>
                            setSparkleConfig((prev) => ({
                              ...prev,
                              stepDuration: Number(e.target.value),
                            }))
                          }
                          className="w-full accent-white h-1 bg-white/10 rounded cursor-pointer"
                        />
                        <span className="text-zinc-100 font-medium shrink-0 min-w-10.5 text-right">
                          {(sparkleConfig.stepDuration * 1000).toFixed(0)}ms
                        </span>
                      </div>

                      <div className="rounded-lg border border-white/5 bg-[#17171b] px-3 py-2 flex items-center justify-between gap-2.5 text-xs">
                        <span className="text-zinc-400 shrink-0">Dissolve</span>
                        <div className="h-3.5 w-px bg-white/10 shrink-0" />
                        <input
                          type="range"
                          min="0.10"
                          max="0.40"
                          step="0.02"
                          value={sparkleConfig.dissolveDuration}
                          onChange={(e) =>
                            setSparkleConfig((prev) => ({
                              ...prev,
                              dissolveDuration: Number(e.target.value),
                            }))
                          }
                          className="w-full accent-white h-1 bg-white/10 rounded cursor-pointer"
                        />
                        <span className="text-zinc-100 font-medium shrink-0 min-w-10.5 text-right">
                          {(sparkleConfig.dissolveDuration * 1000).toFixed(0)}
                          ms
                        </span>
                      </div>

                      <div className="rounded-lg border border-white/5 bg-[#17171b] px-3 py-2 flex items-center justify-between gap-2.5 text-xs">
                        <span className="text-zinc-400 shrink-0">
                          Stiffness
                        </span>
                        <div className="h-3.5 w-px bg-white/10 shrink-0" />
                        <input
                          type="range"
                          min="150"
                          max="500"
                          step="10"
                          value={sparkleConfig.springStiffness}
                          onChange={(e) =>
                            setSparkleConfig((prev) => ({
                              ...prev,
                              springStiffness: Number(e.target.value),
                            }))
                          }
                          className="w-full accent-white h-1 bg-white/10 rounded cursor-pointer"
                        />
                        <span className="text-zinc-100 font-medium shrink-0 min-w-10.5 text-right">
                          {sparkleConfig.springStiffness}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent.slug === "twitter-card" && (
                <div
                  key="twitter-customize-panel"
                  className="pointer-events-auto rounded-2xl border border-white/10 bg-[#121215]/95 backdrop-blur-2xl p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] max-w-xl w-full mx-4 select-none flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-white/90 tracking-tight">
                      Customize
                    </span>
                    <button
                      type="button"
                      onClick={resetTwitterCardConfig}
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#0b0b0e] p-1.5 flex flex-col gap-1.5">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 pb-1.5 border-b border-white/5">
                      <div className="flex items-center gap-0.5 bg-[#17171b] p-1 rounded-xl border border-white/5">
                        <button
                          type="button"
                          onClick={() =>
                            setTwitterCardConfig((prev) => ({
                              ...prev,
                              staticCard: false,
                            }))
                          }
                          className={cn(
                            "relative h-7 px-3 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center",
                            !twitterCardConfig.staticCard
                              ? "text-black font-semibold"
                              : "text-zinc-400 hover:text-white",
                          )}
                        >
                          {!twitterCardConfig.staticCard && (
                            <motion.div
                              layoutId="activeTwitterModeIndicator"
                              transition={{
                                type: "spring",
                                stiffness: 450,
                                damping: 32,
                              }}
                              className="absolute inset-0 bg-white rounded-lg shadow-xs"
                            />
                          )}
                          <span className="relative z-10">Trigger Popover</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setTwitterCardConfig((prev) => ({
                              ...prev,
                              staticCard: true,
                            }))
                          }
                          className={cn(
                            "relative h-7 px-3 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center",
                            twitterCardConfig.staticCard
                              ? "text-black font-semibold"
                              : "text-zinc-400 hover:text-white",
                          )}
                        >
                          {twitterCardConfig.staticCard && (
                            <motion.div
                              layoutId="activeTwitterModeIndicator"
                              transition={{
                                type: "spring",
                                stiffness: 450,
                                damping: 32,
                              }}
                              className="absolute inset-0 bg-white rounded-lg shadow-xs"
                            />
                          )}
                          <span className="relative z-10">Static Card</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1 bg-[#17171b] p-1 rounded-xl border border-white/5">
                        {["hey_krishnna", "karpathy", "shadcn"].map(
                          (handle) => (
                            <button
                              key={handle}
                              type="button"
                              onClick={() =>
                                setTwitterCardConfig((prev) => ({
                                  ...prev,
                                  username: handle,
                                }))
                              }
                              className={cn(
                                "h-7 px-2.5 rounded-lg text-xs transition-colors cursor-pointer",
                                twitterCardConfig.username === handle
                                  ? "bg-white/10 text-white font-medium"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              @{handle}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setTwitterCardConfig((prev) => ({
                            ...prev,
                            enableCardTilt: !prev.enableCardTilt,
                          }))
                        }
                        className="rounded-lg border border-white/5 bg-[#17171b] hover:bg-[#1f1f25] px-3 py-2 flex items-center justify-between text-xs transition-colors cursor-pointer"
                      >
                        <span className="text-zinc-400">Card 3D Tilt</span>
                        <span
                          className={cn(
                            "font-medium",
                            twitterCardConfig.enableCardTilt
                              ? "text-emerald-400"
                              : "text-zinc-500",
                          )}
                        >
                          {twitterCardConfig.enableCardTilt
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </button>

                      <div className="rounded-lg border border-white/5 bg-[#17171b] px-3 py-2 flex items-center justify-between gap-2.5 text-xs">
                        <span className="text-zinc-400 shrink-0">
                          Tilt Angle
                        </span>
                        <div className="h-3.5 w-px bg-white/10 shrink-0" />
                        <input
                          type="range"
                          min="2"
                          max="18"
                          step="1"
                          value={twitterCardConfig.cardTiltMaxRotate}
                          onChange={(e) =>
                            setTwitterCardConfig((prev) => ({
                              ...prev,
                              cardTiltMaxRotate: Number(e.target.value),
                            }))
                          }
                          className="w-full accent-white h-1 bg-white/10 rounded cursor-pointer"
                        />
                        <span className="text-zinc-100 font-medium shrink-0 min-w-8 text-right">
                          {twitterCardConfig.cardTiltMaxRotate}°
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent.slug === "toast" && (
                <div
                  key="toast-customize-panel"
                  className="pointer-events-auto rounded-2xl border border-white/10 bg-[#121215]/95 backdrop-blur-2xl p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] max-w-xl w-full mx-4 select-none flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-white/90 tracking-tight">
                      Toast Settings
                    </span>
                    <button
                      type="button"
                      onClick={resetToastConfig}
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#0b0b0e] p-2 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-zinc-400">
                        Position
                      </span>
                      <div className="flex items-center gap-1 bg-[#17171b] p-1 rounded-lg border border-white/5">
                        {(
                          [
                            "bottom-right",
                            "bottom-left",
                            "top-right",
                            "top-left",
                          ] as const
                        ).map((pos) => (
                          <button
                            key={pos}
                            type="button"
                            onClick={() =>
                              setToastConfig((prev) => ({
                                ...prev,
                                position: pos,
                              }))
                            }
                            className={cn(
                              "text-[10px] px-2 py-1 rounded transition-colors cursor-pointer capitalize",
                              toastConfig.position === pos
                                ? "bg-white text-black font-semibold shadow-sm"
                                : "text-zinc-400 hover:text-white",
                            )}
                          >
                            {pos.replace("-", " ")}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                      <span className="text-[11px] text-zinc-400">
                        Rich Colors
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setToastConfig((prev) => ({
                            ...prev,
                            richColors: !prev.richColors,
                          }))
                        }
                        className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out",
                          toastConfig.richColors ? "bg-white" : "bg-zinc-800",
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5",
                            toastConfig.richColors
                              ? "translate-x-4"
                              : "translate-x-0.5 bg-zinc-400",
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                      <span className="text-[11px] text-zinc-400">
                        Expand on Hover
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setToastConfig((prev) => ({
                            ...prev,
                            expand: !prev.expand,
                          }))
                        }
                        className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out",
                          toastConfig.expand ? "bg-white" : "bg-zinc-800",
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5",
                            toastConfig.expand
                              ? "translate-x-4"
                              : "translate-x-0.5 bg-zinc-400",
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent.slug === "otp-input" && (
                <div
                  key="otp-customize-panel"
                  className="pointer-events-auto rounded-2xl border border-white/10 bg-[#121215]/95 backdrop-blur-2xl p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] max-w-xl w-full mx-4 select-none flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-white/90 tracking-tight">
                      Customize
                    </span>
                    <button
                      type="button"
                      onClick={resetOtpConfig}
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#0b0b0e] p-1.5 flex flex-col gap-1.5">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 pb-1.5 border-b border-white/5">
                      <div className="flex items-center gap-0.5 bg-[#17171b] p-1 rounded-xl border border-white/5">
                        {(["idle", "success", "error", "loading"] as const).map(
                          (s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setOtpStatus(s)}
                              className={cn(
                                "relative h-7 px-2.5 rounded-lg text-xs capitalize transition-colors cursor-pointer flex items-center justify-center",
                                otpStatus === s
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              {otpStatus === s && (
                                <motion.div
                                  layoutId="activeOtpStatusIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded-lg shadow-xs"
                                />
                              )}
                              <span className="relative z-10">{s}</span>
                            </button>
                          ),
                        )}
                      </div>

                      <div className="flex items-center gap-1 bg-[#17171b] p-1 rounded-xl border border-white/5">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpValue("729481");
                            setOtpStatus("success");
                          }}
                          className="h-7 px-2.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
                        >
                          Auto-fill
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOtpValue("999999");
                            setOtpStatus("error");
                          }}
                          className="h-7 px-2.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
                        >
                          Error
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOtpValue("");
                            setOtpStatus("idle");
                          }}
                          className="h-7 px-2.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs">
                        <span className="text-zinc-400 text-xs font-medium">
                          Size
                        </span>
                        <div className="flex items-center gap-0.5 bg-black/25 p-0.5 rounded-md border border-white/5">
                          {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => setOtpSize(sz)}
                              className={cn(
                                "relative px-2 py-0.5 rounded text-[11px] uppercase transition-colors cursor-pointer",
                                otpSize === sz
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              {otpSize === sz && (
                                <motion.div
                                  layoutId="activeOtpSizeIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded shadow-xs"
                                />
                              )}
                              <span className="relative z-10">{sz}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const variants: OtpVariant[] = [
                            "default",
                            "glass",
                            "neon",
                            "underlined",
                          ];
                          const nextIndex =
                            (variants.indexOf(otpVariant) + 1) %
                            variants.length;
                          setOtpVariant(variants[nextIndex]);
                        }}
                        className="h-9 rounded-lg border border-white/5 bg-[#17171b] hover:bg-[#1f1f25] px-3 flex items-center justify-between text-xs transition-colors cursor-pointer"
                      >
                        <span className="text-zinc-400 text-xs font-medium">
                          Variant
                        </span>
                        <span className="text-zinc-100 font-medium capitalize flex items-center gap-1.5 text-xs">
                          {otpVariant}
                          <ChevronDownIcon className="w-3.5 h-3.5 text-zinc-400" />
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOtpMask((m) => !m)}
                        className="h-9 rounded-lg border border-white/5 bg-[#17171b] hover:bg-[#1f1f25] px-3 flex items-center justify-between text-xs transition-colors cursor-pointer"
                      >
                        <span className="text-zinc-400 text-xs font-medium">
                          Mask (•)
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[11px] font-mono uppercase transition-colors",
                            otpMask
                              ? "bg-white text-black font-semibold"
                              : "bg-white/5 text-zinc-400",
                          )}
                        >
                          {otpMask ? "ON" : "OFF"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOtpGrouped((g) => !g)}
                        className="h-9 rounded-lg border border-white/5 bg-[#17171b] hover:bg-[#1f1f25] px-3 flex items-center justify-between text-xs transition-colors cursor-pointer"
                      >
                        <span className="text-zinc-400 text-xs font-medium">
                          3-3 Split
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[11px] font-mono uppercase transition-colors",
                            otpGrouped
                              ? "bg-white text-black font-semibold"
                              : "bg-white/5 text-zinc-400",
                          )}
                        >
                          {otpGrouped ? "ON" : "OFF"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent.slug === "orb" && (
                <div
                  key="orb-customize-panel"
                  className="pointer-events-auto rounded-2xl border border-white/10 bg-[#121215]/95 backdrop-blur-2xl p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] max-w-2xl w-full mx-4 select-none flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white/90 tracking-tight">
                        Orb Controls
                      </span>
                      {orbStudioColor && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">
                          {ORB_COLORS.find((c) => c.value === orbStudioColor)
                            ?.label || "Custom"}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={resetOrbConfig}
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#0b0b0e] p-2 flex flex-col gap-2">
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-[#17171b] p-1 rounded-xl border border-white/5">
                      {ORB_STATES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setOrbStudioState(s)}
                          className={cn(
                            "relative h-7 px-2.5 rounded-lg text-xs capitalize transition-colors cursor-pointer flex items-center justify-center shrink-0",
                            orbStudioState === s
                              ? "text-black font-semibold"
                              : "text-zinc-400 hover:text-white",
                          )}
                        >
                          {orbStudioState === s && (
                            <motion.div
                              layoutId="activeOrbStateIndicator"
                              transition={{
                                type: "spring",
                                stiffness: 450,
                                damping: 32,
                              }}
                              className="absolute inset-0 bg-white rounded-lg shadow-xs"
                            />
                          )}
                          <span className="relative z-10">{s}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-[#17171b] p-1 rounded-xl border border-white/5">
                      <span className="text-zinc-400 text-xs font-medium px-2.5 shrink-0">
                        Color
                      </span>
                      <div className="h-3.5 w-px bg-white/10 shrink-0 mr-1" />
                      <div className="flex items-center gap-1 shrink-0">
                        {ORB_COLORS.map((c) => {
                          const isSelected = orbStudioColor === c.value;
                          return (
                            <button
                              key={c.label}
                              type="button"
                              onClick={() => setOrbStudioColor(c.value)}
                              className={cn(
                                "relative h-7 px-2.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0",
                                isSelected
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white hover:bg-white/5",
                              )}
                            >
                              {isSelected && (
                                <motion.div
                                  layoutId="activeOrbColorIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded-lg shadow-xs"
                                />
                              )}
                              <span
                                className={cn(
                                  "relative z-10 w-2 h-2 rounded-full shrink-0",
                                  c.value === undefined &&
                                    "border border-zinc-500",
                                )}
                                style={{ backgroundColor: c.hex }}
                              />
                              <span className="relative z-10">{c.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs min-w-0 overflow-hidden">
                        <span className="text-zinc-400 text-xs font-medium shrink-0">
                          Size
                        </span>
                        <div className="flex items-center gap-0.5 bg-black/25 p-0.5 rounded-md border border-white/5 shrink-0">
                          {[
                            { label: "S", value: 64 },
                            { label: "M", value: 96 },
                            { label: "L", value: 140 },
                            { label: "XL", value: 180 },
                          ].map((sz) => (
                            <button
                              key={sz.label}
                              type="button"
                              onClick={() => setOrbStudioSize(sz.value)}
                              className={cn(
                                "relative px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer shrink-0",
                                orbStudioSize === sz.value
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              {orbStudioSize === sz.value && (
                                <motion.div
                                  layoutId="activeOrbSizeIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded shadow-xs"
                                />
                              )}
                              <span className="relative z-10">{sz.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs min-w-0 overflow-hidden">
                        <span className="text-zinc-400 text-xs font-medium shrink-0">
                          Speed
                        </span>
                        <div className="flex items-center gap-0.5 bg-black/25 p-0.5 rounded-md border border-white/5 shrink-0">
                          {[0.5, 1, 1.5, 2].map((sp) => (
                            <button
                              key={sp}
                              type="button"
                              onClick={() => setOrbStudioSpeed(sp)}
                              className={cn(
                                "relative px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer shrink-0",
                                orbStudioSpeed === sp
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              {orbStudioSpeed === sp && (
                                <motion.div
                                  layoutId="activeOrbSpeedIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded shadow-xs"
                                />
                              )}
                              <span className="relative z-10">{sp}x</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-zinc-400 text-xs font-medium">
                          Motion
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                          {orbStudioPaused ? "Paused" : "Active"}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 bg-black/25 p-0.5 rounded-md border border-white/5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setOrbStudioPaused(false)}
                          className={cn(
                            "relative px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer shrink-0",
                            !orbStudioPaused
                              ? "text-black font-semibold"
                              : "text-zinc-400 hover:text-white",
                          )}
                        >
                          {!orbStudioPaused && (
                            <motion.div
                              layoutId="activeOrbMotionIndicator"
                              transition={{
                                type: "spring",
                                stiffness: 450,
                                damping: 32,
                              }}
                              className="absolute inset-0 bg-white rounded shadow-xs"
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Playing
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrbStudioPaused(true)}
                          className={cn(
                            "relative px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer shrink-0",
                            orbStudioPaused
                              ? "text-black font-semibold"
                              : "text-zinc-400 hover:text-white",
                          )}
                        >
                          {orbStudioPaused && (
                            <motion.div
                              layoutId="activeOrbMotionIndicator"
                              transition={{
                                type: "spring",
                                stiffness: 450,
                                damping: 32,
                              }}
                              className="absolute inset-0 bg-white rounded shadow-xs"
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                            Paused
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent.slug === "mac-slider" && (
                <div
                  key="mac-slider-customize-panel"
                  className="pointer-events-auto rounded-2xl border border-white/10 bg-[#121215]/95 backdrop-blur-2xl p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] max-w-2xl w-full mx-4 select-none flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-white/90 tracking-tight">
                      Mac Slider Controls
                    </span>
                    <button
                      type="button"
                      onClick={resetMacSliderConfig}
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#0b0b0e] p-2 flex flex-col gap-2">
                    <div className="flex items-center gap-1 bg-[#17171b] p-1 rounded-xl border border-white/5 w-full">
                      {(
                        [
                          { id: "blue", label: "Blue", dot: "bg-blue-500" },
                          {
                            id: "emerald",
                            label: "Emerald",
                            dot: "bg-emerald-400",
                          },
                          {
                            id: "violet",
                            label: "Violet",
                            dot: "bg-violet-400",
                          },
                          { id: "amber", label: "Amber", dot: "bg-amber-400" },
                          { id: "rose", label: "Rose", dot: "bg-rose-400" },
                          { id: "cyan", label: "Cyan", dot: "bg-cyan-400" },
                          {
                            id: "monochrome",
                            label: "Graphite",
                            dot: "bg-zinc-200",
                          },
                        ] as const
                      ).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setMacSliderColor(c.id)}
                          className={cn(
                            "relative flex-1 h-7.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none",
                            macSliderColor === c.id
                              ? "text-black font-semibold"
                              : "text-zinc-400 hover:text-white",
                          )}
                        >
                          {macSliderColor === c.id && (
                            <motion.div
                              layoutId="activeMacSliderColorIndicator"
                              transition={{
                                type: "spring",
                                stiffness: 450,
                                damping: 32,
                              }}
                              className="absolute inset-0 bg-white rounded-lg shadow-xs"
                            />
                          )}
                          <span
                            className={cn(
                              "relative z-10 w-2 h-2 rounded-full shrink-0 shadow-xs",
                              c.dot,
                            )}
                          />
                          <span className="relative z-10 truncate hidden sm:inline">
                            {c.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs">
                        <span className="text-zinc-400 text-xs font-medium shrink-0">
                          Size
                        </span>
                        <div className="flex items-center gap-0.5 bg-black/30 p-0.5 rounded-md border border-white/5">
                          {(["sm", "md", "lg"] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => setMacSliderSize(sz)}
                              className={cn(
                                "relative px-2.5 py-0.5 rounded text-[11px] font-mono uppercase transition-colors cursor-pointer",
                                macSliderSize === sz
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              {macSliderSize === sz && (
                                <motion.div
                                  layoutId="activeMacSliderSizeIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded shadow-xs"
                                />
                              )}
                              <span className="relative z-10">{sz}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs">
                        <span className="text-zinc-400 text-xs font-medium shrink-0">
                          Lens State
                        </span>
                        <div className="flex items-center gap-0.5 bg-black/30 p-0.5 rounded-md border border-white/5">
                          {[
                            { label: "Rest", value: false },
                            { label: "Expanded", value: true },
                          ].map((st) => (
                            <button
                              key={st.label}
                              type="button"
                              onClick={() => setMacSliderForceActive(st.value)}
                              className={cn(
                                "relative px-2.5 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer",
                                macSliderForceActive === st.value
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              {macSliderForceActive === st.value && (
                                <motion.div
                                  layoutId="activeMacSliderForceActiveIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded shadow-xs"
                                />
                              )}
                              <span className="relative z-10">{st.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs">
                      <span className="text-zinc-400 text-xs font-medium shrink-0">
                        Glass Material
                      </span>
                      <div className="flex items-center gap-0.5 bg-black/30 p-0.5 rounded-md border border-white/5">
                        {(
                          [
                            { id: "liquid", label: "Liquid" },
                            { id: "frosted", label: "Frosted" },
                            { id: "clear", label: "Clear" },
                          ] as const
                        ).map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setMacSliderMaterial(m.id)}
                            className={cn(
                              "relative px-3.5 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer",
                              macSliderMaterial === m.id
                                ? "text-black font-semibold"
                                : "text-zinc-400 hover:text-white",
                            )}
                          >
                            {macSliderMaterial === m.id && (
                              <motion.div
                                layoutId="activeMacSliderMaterialIndicator"
                                transition={{
                                  type: "spring",
                                  stiffness: 450,
                                  damping: 32,
                                }}
                                className="absolute inset-0 bg-white rounded shadow-xs"
                              />
                            )}
                            <span className="relative z-10">{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-white/5">
                      <div className="rounded-lg border border-white/5 bg-[#17171b] px-3 py-2 flex items-center justify-between gap-2.5 text-xs">
                        <span className="w-18 shrink-0 text-zinc-400 text-[11px] font-medium">
                          Specular
                        </span>
                        <div className="h-3.5 w-px bg-white/10 shrink-0" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={macSliderSpecularOpacity}
                          onChange={(e) =>
                            setMacSliderSpecularOpacity(
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full accent-white h-1 bg-white/10 rounded cursor-pointer"
                        />
                        <span className="w-12 text-right font-mono text-[11px] text-zinc-100 tabular-nums shrink-0 font-medium">
                          {macSliderSpecularOpacity.toFixed(2)}
                        </span>
                      </div>

                      <div className="rounded-lg border border-white/5 bg-[#17171b] px-3 py-2 flex items-center justify-between gap-2.5 text-xs">
                        <span className="w-18 shrink-0 text-zinc-400 text-[11px] font-medium">
                          Saturation
                        </span>
                        <div className="h-3.5 w-px bg-white/10 shrink-0" />
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="1"
                          value={macSliderSpecularSaturation}
                          onChange={(e) =>
                            setMacSliderSpecularSaturation(
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full accent-white h-1 bg-white/10 rounded cursor-pointer"
                        />
                        <span className="w-12 text-right font-mono text-[11px] text-zinc-100 tabular-nums shrink-0 font-medium">
                          {macSliderSpecularSaturation}
                        </span>
                      </div>

                      <div className="rounded-lg border border-white/5 bg-[#17171b] px-3 py-2 flex items-center justify-between gap-2.5 text-xs">
                        <span className="w-18 shrink-0 text-zinc-400 text-[11px] font-medium">
                          Refraction
                        </span>
                        <div className="h-3.5 w-px bg-white/10 shrink-0" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={macSliderRefractionLevel}
                          onChange={(e) =>
                            setMacSliderRefractionLevel(
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full accent-white h-1 bg-white/10 rounded cursor-pointer"
                        />
                        <span className="w-12 text-right font-mono text-[11px] text-zinc-100 tabular-nums shrink-0 font-medium">
                          {macSliderRefractionLevel.toFixed(2)}
                        </span>
                      </div>

                      <div className="rounded-lg border border-white/5 bg-[#17171b] px-3 py-2 flex items-center justify-between gap-2.5 text-xs">
                        <span className="w-18 shrink-0 text-zinc-400 text-[11px] font-medium">
                          Blur
                        </span>
                        <div className="h-3.5 w-px bg-white/10 shrink-0" />
                        <input
                          type="range"
                          min="0"
                          max="40"
                          step="0.5"
                          value={macSliderBlurLevel}
                          onChange={(e) =>
                            setMacSliderBlurLevel(parseFloat(e.target.value))
                          }
                          className="w-full accent-white h-1 bg-white/10 rounded cursor-pointer"
                        />
                        <span className="w-12 text-right font-mono text-[11px] text-zinc-100 tabular-nums shrink-0 font-medium">
                          {macSliderBlurLevel.toFixed(1)}px
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent.slug === "mac-switch" && (
                <div
                  key="mac-switch-color-palette"
                  className="pointer-events-auto rounded-full border border-white/12 bg-[#121215]/95 backdrop-blur-2xl p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)] flex items-center gap-1.5 select-none"
                >
                  {(
                    [
                      { id: "green", label: "Green", hex: "#34C759" },
                      { id: "blue", label: "Blue", hex: "#007AFF" },
                      { id: "purple", label: "Purple", hex: "#AF52DE" },
                      { id: "orange", label: "Orange", hex: "#FF9500" },
                      { id: "pink", label: "Pink", hex: "#FF2D55" },
                      { id: "amber", label: "Amber", hex: "#FFCC00" },
                      { id: "monochrome", label: "Graphite", hex: "#8E8E93" },
                    ] as const
                  ).map((c) => {
                    const isSelected = macSwitchColor === c.id;
                    return (
                      <motion.button
                        key={c.id}
                        type="button"
                        onClick={() => setMacSwitchColor(c.id)}
                        title={c.label}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        transition={microSpring}
                        className="relative w-8 h-8 rounded-full flex items-center justify-center cursor-pointer outline-none shrink-0"
                      >
                        {isSelected && (
                          <motion.span
                            layoutId="activeMacSwitchColorRing"
                            className="absolute inset-0 rounded-full border-2 border-white shadow-[0_0_12px_rgba(255,255,255,0.4)] pointer-events-none"
                            transition={{
                              type: "spring",
                              stiffness: 480,
                              damping: 32,
                            }}
                          />
                        )}
                        <span
                          style={{ backgroundColor: c.hex }}
                          className={cn(
                            "w-5.5 h-5.5 rounded-full shadow-xs transition-all duration-200",
                            isSelected
                              ? "opacity-100 scale-100"
                              : "opacity-65 hover:opacity-90 scale-95 hover:scale-100",
                          )}
                        />
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {activeComponent.slug === "liquid-toggle" && (
                <div
                  key="liquid-toggle-customize-panel"
                  className="pointer-events-auto rounded-2xl border border-white/10 bg-[#121215]/95 backdrop-blur-2xl p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] max-w-2xl w-full mx-4 select-none flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-white/90 tracking-tight">
                      Liquid Toggle Controls
                    </span>
                    <button
                      type="button"
                      onClick={resetLiquidConfig}
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#0b0b0e] p-2 flex flex-col gap-2">
                    <div className="flex items-center gap-1 bg-[#17171b] p-1 rounded-xl border border-white/5 w-full">
                      {(
                        [
                          {
                            id: "monochrome",
                            label: "Monochrome",
                            dot: "bg-zinc-200",
                          },
                          {
                            id: "emerald",
                            label: "Emerald",
                            dot: "bg-emerald-400",
                          },
                          {
                            id: "violet",
                            label: "Violet",
                            dot: "bg-violet-400",
                          },
                          {
                            id: "amber",
                            label: "Amber",
                            dot: "bg-amber-400",
                          },
                          { id: "cyan", label: "Cyan", dot: "bg-cyan-400" },
                        ] as const
                      ).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setLiquidColor(c.id)}
                          className={cn(
                            "relative flex-1 h-7.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none",
                            liquidColor === c.id
                              ? "text-black font-semibold"
                              : "text-zinc-400 hover:text-white",
                          )}
                        >
                          {liquidColor === c.id && (
                            <motion.div
                              layoutId="activeLiquidColorIndicator"
                              transition={{
                                type: "spring",
                                stiffness: 450,
                                damping: 32,
                              }}
                              className="absolute inset-0 bg-white rounded-lg shadow-xs"
                            />
                          )}
                          <span
                            className={cn(
                              "relative z-10 w-2 h-2 rounded-full shrink-0 shadow-xs",
                              c.dot,
                            )}
                          />
                          <span className="relative z-10 truncate">
                            {c.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs">
                        <span className="text-zinc-400 text-xs font-medium shrink-0">
                          State
                        </span>
                        <div className="flex items-center gap-0.5 bg-black/25 p-0.5 rounded-md border border-white/5">
                          {[
                            { label: "OFF", value: false },
                            { label: "ON", value: true },
                          ].map((st) => (
                            <button
                              key={st.label}
                              type="button"
                              onClick={() => setLiquidChecked(st.value)}
                              className={cn(
                                "relative px-2.5 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer",
                                liquidChecked === st.value
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              {liquidChecked === st.value && (
                                <motion.div
                                  layoutId="activeLiquidStateIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded shadow-xs"
                                />
                              )}
                              <span className="relative z-10">{st.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs">
                        <span className="text-zinc-400 text-xs font-medium shrink-0">
                          Size
                        </span>
                        <div className="flex items-center gap-0.5 bg-black/25 p-0.5 rounded-md border border-white/5">
                          {(["sm", "md", "lg"] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => setLiquidSize(sz)}
                              className={cn(
                                "relative px-2 py-0.5 rounded text-[11px] font-mono uppercase transition-colors cursor-pointer",
                                liquidSize === sz
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              {liquidSize === sz && (
                                <motion.div
                                  layoutId="activeLiquidSizeIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded shadow-xs"
                                />
                              )}
                              <span className="relative z-10">{sz}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs">
                        <span className="text-zinc-400 text-xs font-medium shrink-0">
                          Viscosity
                        </span>
                        <div className="flex items-center gap-0.5 bg-black/25 p-0.5 rounded-md border border-white/5">
                          {(["fluid", "jelly"] as const).map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setLiquidViscosity(v)}
                              className={cn(
                                "relative px-2.5 py-0.5 rounded text-[11px] capitalize transition-colors cursor-pointer",
                                liquidViscosity === v
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              {liquidViscosity === v && (
                                <motion.div
                                  layoutId="activeLiquidViscosityIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded shadow-xs"
                                />
                              )}
                              <span className="relative z-10">{v}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent.slug === "gooey-nav" && (
                <div
                  key="gooey-nav-customize-panel"
                  className="pointer-events-auto rounded-2xl border border-white/10 bg-[#121215]/95 backdrop-blur-2xl p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] max-w-2xl w-full mx-4 select-none flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-white/90 tracking-tight">
                      Gooey Nav Controls
                    </span>
                    <button
                      type="button"
                      onClick={resetGooeyNavConfig}
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#0b0b0e] p-2 flex flex-col gap-2">
                    <div className="flex items-center gap-1 bg-[#17171b] p-1 rounded-xl border border-white/5 w-full">
                      {(
                        [
                          {
                            id: "orange",
                            label: "Orange",
                            dot: "bg-[#FC4C01]",
                          },
                          {
                            id: "emerald",
                            label: "Emerald",
                            dot: "bg-emerald-400",
                          },
                          {
                            id: "violet",
                            label: "Violet",
                            dot: "bg-violet-400",
                          },
                          { id: "cyan", label: "Cyan", dot: "bg-cyan-400" },
                          { id: "amber", label: "Amber", dot: "bg-amber-400" },
                          {
                            id: "monochrome",
                            label: "Mono",
                            dot: "bg-zinc-200",
                          },
                        ] as const
                      ).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setGooeyNavColor(c.id)}
                          className={cn(
                            "relative flex-1 h-7.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none",
                            gooeyNavColor === c.id
                              ? "text-black font-semibold"
                              : "text-zinc-400 hover:text-white",
                          )}
                        >
                          {gooeyNavColor === c.id && (
                            <motion.div
                              layoutId="activeGooeyColorIndicator"
                              transition={{
                                type: "spring",
                                stiffness: 450,
                                damping: 32,
                              }}
                              className="absolute inset-0 bg-white rounded-lg shadow-xs"
                            />
                          )}
                          <span
                            className={cn(
                              "relative z-10 w-2 h-2 rounded-full shrink-0 shadow-xs",
                              c.dot,
                            )}
                          />
                          <span className="relative z-10 truncate">
                            {c.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs">
                        <span className="text-zinc-400 text-xs font-medium shrink-0">
                          Size
                        </span>
                        <div className="flex items-center gap-0.5 bg-black/25 p-0.5 rounded-md border border-white/5">
                          {(["xs", "sm", "md", "lg"] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => setGooeyNavSize(sz)}
                              className={cn(
                                "relative px-2 py-0.5 rounded text-[11px] font-mono uppercase transition-colors cursor-pointer",
                                gooeyNavSize === sz
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              {gooeyNavSize === sz && (
                                <motion.div
                                  layoutId="activeGooeySizeIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded shadow-xs"
                                />
                              )}
                              <span className="relative z-10">{sz}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs">
                        <span className="text-zinc-400 text-xs font-medium shrink-0">
                          Variant
                        </span>
                        <div className="flex items-center gap-0.5 bg-black/25 p-0.5 rounded-md border border-white/5">
                          {(["solid", "glow", "glass"] as const).map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setGooeyNavVariant(v)}
                              className={cn(
                                "relative px-2 py-0.5 rounded text-[11px] capitalize transition-colors cursor-pointer",
                                gooeyNavVariant === v
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              {gooeyNavVariant === v && (
                                <motion.div
                                  layoutId="activeGooeyVariantIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded shadow-xs"
                                />
                              )}
                              <span className="relative z-10">{v}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs">
                        <span className="text-zinc-400 text-xs font-medium shrink-0">
                          Motion
                        </span>
                        <div className="flex items-center gap-0.5 bg-black/25 p-0.5 rounded-md border border-white/5">
                          {(["fluid", "elastic"] as const).map((e) => (
                            <button
                              key={e}
                              type="button"
                              onClick={() => setGooeyNavElasticity(e)}
                              className={cn(
                                "relative px-2.5 py-0.5 rounded text-[11px] capitalize transition-colors cursor-pointer",
                                gooeyNavElasticity === e
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              {gooeyNavElasticity === e && (
                                <motion.div
                                  layoutId="activeGooeyMotionIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded shadow-xs"
                                />
                              )}
                              <span className="relative z-10">{e}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent.slug === "noise" && (
                <div
                  key="noise-customize-panel"
                  className="pointer-events-auto rounded-2xl border border-white/10 bg-[#121215]/95 backdrop-blur-2xl p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] max-w-2xl w-full mx-4 select-none flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-white/90 tracking-tight">
                      Noise Background Controls
                    </span>
                    <button
                      type="button"
                      onClick={resetNoiseConfig}
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#0b0b0e] p-2 flex flex-col gap-2">
                    <div className="flex items-center gap-1 bg-[#17171b] p-1 rounded-xl border border-white/5 w-full">
                      {(
                        [
                          { id: "grain", label: "Film Grain" },
                          { id: "static", label: "CRT Static" },
                          { id: "dust", label: "Film Dust" },
                        ] as const
                      ).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setNoiseMode(m.id)}
                          className={cn(
                            "relative flex-1 h-7.5 px-2 rounded-lg text-xs flex items-center justify-center transition-colors cursor-pointer select-none",
                            noiseMode === m.id
                              ? "text-black font-semibold"
                              : "text-zinc-400 hover:text-white",
                          )}
                        >
                          {noiseMode === m.id && (
                            <motion.div
                              layoutId="activeNoiseModeIndicator"
                              transition={{
                                type: "spring",
                                stiffness: 450,
                                damping: 32,
                              }}
                              className="absolute inset-0 bg-white rounded-lg shadow-xs"
                            />
                          )}
                          <span className="relative z-10 truncate">
                            {m.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs">
                        <span className="text-zinc-400 text-xs font-medium shrink-0">
                          Alpha
                        </span>
                        <div className="flex items-center gap-0.5 bg-black/25 p-0.5 rounded-md border border-white/5">
                          {([10, 25, 50, 80] as const).map((a) => (
                            <button
                              key={a}
                              type="button"
                              onClick={() => setNoiseAlpha(a)}
                              className={cn(
                                "relative px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer select-none",
                                noiseAlpha === a
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              {noiseAlpha === a && (
                                <motion.div
                                  layoutId="activeNoiseAlphaIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded shadow-xs"
                                />
                              )}
                              <span className="relative z-10">{a}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs">
                        <span className="text-zinc-400 text-xs font-medium shrink-0">
                          Scale
                        </span>
                        <div className="flex items-center gap-0.5 bg-black/25 p-0.5 rounded-md border border-white/5">
                          {([1, 2, 4] as const).map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setNoiseScale(s)}
                              className={cn(
                                "relative px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer select-none",
                                noiseScale === s
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              {noiseScale === s && (
                                <motion.div
                                  layoutId="activeNoiseScaleIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded shadow-xs"
                                />
                              )}
                              <span className="relative z-10">{s}x</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs">
                        <span className="text-zinc-400 text-xs font-medium shrink-0">
                          Interval
                        </span>
                        <div className="flex items-center gap-0.5 bg-black/25 p-0.5 rounded-md border border-white/5">
                          {([1, 2, 4] as const).map((iv) => (
                            <button
                              key={iv}
                              type="button"
                              onClick={() => setNoiseInterval(iv)}
                              className={cn(
                                "relative px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer select-none",
                                noiseInterval === iv
                                  ? "text-black font-semibold"
                                  : "text-zinc-400 hover:text-white",
                              )}
                            >
                              {noiseInterval === iv && (
                                <motion.div
                                  layoutId="activeNoiseIntervalIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 450,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 bg-white rounded shadow-xs"
                                />
                              )}
                              <span className="relative z-10">{iv}f</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-9 rounded-lg border border-white/5 bg-[#17171b] px-3 flex items-center justify-between text-xs">
                        <span className="text-zinc-400 text-xs font-medium shrink-0">
                          Effects
                        </span>
                        <div className="flex items-center gap-1 bg-black/25 p-0.5 rounded-md border border-white/5">
                          <button
                            type="button"
                            onClick={() => setNoiseVignette(!noiseVignette)}
                            className={cn(
                              "relative px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer select-none",
                              noiseVignette
                                ? "bg-white text-black font-semibold shadow-xs"
                                : "text-zinc-400 hover:text-white",
                            )}
                          >
                            Vignette
                          </button>
                          <button
                            type="button"
                            onClick={() => setNoiseScanlines(!noiseScanlines)}
                            className={cn(
                              "relative px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer select-none",
                              noiseScanlines
                                ? "bg-white text-black font-semibold shadow-xs"
                                : "text-zinc-400 hover:text-white",
                            )}
                          >
                            CRT
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent.slug === "ai-input" && (
                <div
                  key="ai-input-customize-panel"
                  className="pointer-events-auto rounded-2xl border border-white/10 bg-[#121215]/95 backdrop-blur-2xl p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] max-w-2xl w-full mx-4 select-none flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-white/90 tracking-tight">
                      AI Input Controls
                    </span>
                    <button
                      type="button"
                      onClick={resetAiInputConfig}
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#0b0b0e] p-2 flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 pb-1 border-b border-white/5">
                      <div className="flex items-center gap-1 bg-[#17171b] p-1 rounded-xl border border-white/5 flex-1">
                        {(
                          [
                            { id: "default", label: "Default Glass" },
                            { id: "glow", label: "Ambient Glow" },
                            { id: "minimal", label: "Minimal Hairline" },
                          ] as const
                        ).map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setAiInputVariant(v.id)}
                            className={cn(
                              "relative flex-1 h-7.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center transition-colors cursor-pointer select-none",
                              aiInputVariant === v.id
                                ? "text-black font-semibold"
                                : "text-zinc-400 hover:text-white",
                            )}
                          >
                            {aiInputVariant === v.id && (
                              <motion.div
                                layoutId="activeAiInputVariantIndicator"
                                transition={{
                                  type: "spring",
                                  stiffness: 450,
                                  damping: 32,
                                }}
                                className="absolute inset-0 bg-white rounded-lg shadow-xs"
                              />
                            )}
                            <span className="relative z-10 truncate">
                              {v.label}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 bg-[#17171b] p-1 rounded-xl border border-white/5">
                        {[
                          { label: "Compact", value: 380 },
                          { label: "Default", value: 480 },
                          { label: "Wide", value: 560 },
                          { label: "Full", value: 640 },
                        ].map((sz) => (
                          <button
                            key={sz.value}
                            type="button"
                            onClick={() => setAiInputMaxWidth(sz.value)}
                            className={cn(
                              "relative px-2.5 h-7 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-center select-none",
                              aiInputMaxWidth === sz.value
                                ? "text-black font-semibold"
                                : "text-zinc-400 hover:text-white",
                            )}
                          >
                            {aiInputMaxWidth === sz.value && (
                              <motion.div
                                layoutId="activeAiInputWidthIndicator"
                                transition={{
                                  type: "spring",
                                  stiffness: 450,
                                  damping: 32,
                                }}
                                className="absolute inset-0 bg-white rounded-lg shadow-xs"
                              />
                            )}
                            <span className="relative z-10">{sz.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAiInputAllowAttachments((v) => !v)}
                        className={cn(
                          "h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                          aiInputAllowAttachments
                            ? "border-white/20 bg-white/10 text-white"
                            : "border-white/5 bg-[#17171b] text-zinc-500 hover:text-zinc-300",
                        )}
                      >
                        <span>Attachments</span>
                        <span className="text-[10px] font-mono uppercase">
                          {aiInputAllowAttachments ? "ON" : "OFF"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAiInputAllowVoice((v) => !v)}
                        className={cn(
                          "h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                          aiInputAllowVoice
                            ? "border-white/20 bg-white/10 text-white"
                            : "border-white/5 bg-[#17171b] text-zinc-500 hover:text-zinc-300",
                        )}
                      >
                        <span>Voice</span>
                        <span className="text-[10px] font-mono uppercase">
                          {aiInputAllowVoice ? "ON" : "OFF"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAiInputAllowModelSelect((v) => !v)}
                        className={cn(
                          "h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                          aiInputAllowModelSelect
                            ? "border-white/20 bg-white/10 text-white"
                            : "border-white/5 bg-[#17171b] text-zinc-500 hover:text-zinc-300",
                        )}
                      >
                        <span>Models</span>
                        <span className="text-[10px] font-mono uppercase">
                          {aiInputAllowModelSelect ? "ON" : "OFF"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAiInputAllowEffortSelect((v) => !v)}
                        className={cn(
                          "h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                          aiInputAllowEffortSelect
                            ? "border-white/20 bg-white/10 text-white"
                            : "border-white/5 bg-[#17171b] text-zinc-500 hover:text-zinc-300",
                        )}
                      >
                        <span>Effort</span>
                        <span className="text-[10px] font-mono uppercase">
                          {aiInputAllowEffortSelect ? "ON" : "OFF"}
                        </span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          promptInputRef.current?.addAttachment(
                            new File([""], "dashboard-mockup.png", {
                              type: "image/png",
                            }),
                            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
                            800,
                            600,
                          );
                        }}
                        className="h-7 px-2.5 rounded-lg border border-white/10 bg-[#17171b] hover:bg-white/10 hover:border-white/20 text-xs font-medium text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <PlusIcon className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Attach Mockup</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          promptInputRef.current?.startVoice();
                        }}
                        className="h-7 px-2.5 rounded-lg border border-white/10 bg-[#17171b] hover:bg-white/10 hover:border-white/20 text-xs font-medium text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Simulate Voice</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          promptInputRef.current?.expand();
                          promptInputRef.current?.focus();
                        }}
                        className="h-7 px-2.5 rounded-lg border border-white/10 bg-[#17171b] hover:bg-white/10 hover:border-white/20 text-xs font-medium text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Expand Composer</span>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 pt-1 border-t border-white/5">
                      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                        <span className="text-[11px] text-zinc-500 shrink-0 font-medium pl-1">
                          Try prompt:
                        </span>
                        {[
                          "Build an animated dashboard",
                          "Explain quantum annealing",
                          "Polish dark mode theme",
                        ].map((promptText) => (
                          <button
                            key={promptText}
                            type="button"
                            onClick={() => setAiInputValue(promptText)}
                            className="h-6 px-2 rounded-md bg-[#17171b] hover:bg-[#222228] border border-white/5 text-[11px] text-zinc-300 hover:text-white transition-colors cursor-pointer truncate max-w-40"
                          >
                            {promptText}
                          </button>
                        ))}
                      </div>

                      {aiInputValue && (
                        <button
                          type="button"
                          onClick={() => {
                            setAiInputValue("");
                            promptInputRef.current?.collapse();
                          }}
                          className="h-6 px-2 rounded-md text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {activePanel === "code" && (
              <>
                <motion.div
                  key="code-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setActivePanel("none")}
                  className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-30"
                />
                <motion.div
                  key="code-sheet"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={sheetSpring}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0.05, bottom: 0.4 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 100 || info.velocity.y > 400) {
                      setActivePanel("none");
                    }
                  }}
                  className="absolute inset-x-2 bottom-2 top-10 z-40 rounded-2xl border border-white/10 bg-[#0a0a0c] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
                >
                  <div className="pt-2.5 pb-1 flex justify-center shrink-0 cursor-grab active:cursor-grabbing">
                    <div className="w-10 h-1 bg-zinc-700/80 rounded-full" />
                  </div>

                  <div className="px-5 pb-3 border-b border-white/8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {activeComponent.files.map((file, idx) => (
                        <button
                          key={file.name}
                          type="button"
                          onClick={() => setSelectedFileIndex(idx)}
                          className={cn(
                            "relative px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer",
                            idx === selectedFileIndex
                              ? "text-white"
                              : "text-zinc-500 hover:text-zinc-300",
                          )}
                        >
                          {idx === selectedFileIndex && (
                            <motion.div
                              layoutId="active-code-tab"
                              transition={microSpring}
                              className="absolute inset-0 bg-white/10 border border-white/10 rounded-lg"
                            />
                          )}
                          <span className="relative z-10">{file.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.94 }}
                        transition={microSpring}
                        type="button"
                        onClick={handleInstallCopy}
                        className="border border-white/10 hover:border-white/20 bg-[#18181b] hover:bg-[#222226] text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        {installCopied ? "Copied!" : "Install"}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.94 }}
                        transition={microSpring}
                        type="button"
                        onClick={handleCodeCopy}
                        className="w-8 h-8 rounded-lg border border-white/10 hover:border-white/20 bg-[#18181b] hover:bg-[#222226] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Copy code"
                      >
                        {codeCopied ? (
                          <CheckIcon className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <CopyIcon className="w-4 h-4" />
                        )}
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        transition={microSpring}
                        type="button"
                        onClick={() => setActivePanel("none")}
                        className="w-8 h-8 rounded-lg border border-white/10 hover:border-white/20 bg-[#18181b] hover:bg-[#222226] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Close (Esc)"
                      >
                        <Cross2Icon className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex-1 p-6 overflow-auto font-mono text-xs leading-relaxed bg-[#070709] select-text">
                    <div className="space-y-0.5">
                      {codeLines.map((_, i) => (
                        <div key={i} className="flex">
                          <span className="w-8 shrink-0 select-none text-right pr-5 text-zinc-600 font-mono">
                            {i + 1}
                          </span>
                          <div className="flex-1 overflow-x-auto">
                            {highlighted[i]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.main>

        <AnimatePresence>
          {activePanel === "info" && (
            <motion.aside
              key="info-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 440, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={panelSpring}
              className="shrink-0 h-full border border-white/8 bg-[#0c0c0e] rounded-3xl overflow-hidden flex flex-col"
            >
              <div className="w-110 min-w-110 h-full p-6 sm:p-7 overflow-y-auto flex flex-col gap-6 scrollbar-none pb-12">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  transition={{ staggerChildren: 0.05 }}
                  className="space-y-6"
                >
                  <motion.div
                    variants={fadeVariants}
                    className="flex items-center justify-between pb-2 border-b border-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
                        {activeComponent.slug.replace("-", " ")}
                      </span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/8">
                        {activeComponent.category.replace("-", " ")}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        v{activeComponent.version}
                      </span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      transition={microSpring}
                      type="button"
                      onClick={() => setActivePanel("none")}
                      className="w-7 h-7 rounded-lg border border-white/10 hover:border-white/20 bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                      title="Close (Esc)"
                    >
                      <Cross2Icon className="w-3.5 h-3.5" />
                    </motion.button>
                  </motion.div>

                  <motion.div variants={fadeVariants} className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-serif text-white tracking-tight leading-snug">
                      {activeComponent.name}
                    </h2>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      {activeComponent.description}
                    </p>
                    {activeComponent.summary && (
                      <p className="text-xs text-zinc-400 font-light leading-relaxed pt-1">
                        {activeComponent.summary}
                      </p>
                    )}
                  </motion.div>

                  {activeComponent.highlights &&
                    activeComponent.highlights.length > 0 && (
                      <motion.div
                        variants={fadeVariants}
                        className="space-y-2.5 pt-4 border-t border-white/8"
                      >
                        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                          Capabilities & Highlights
                        </div>
                        <div className="space-y-1.5">
                          {activeComponent.highlights.map((h, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs text-zinc-300 font-light leading-relaxed"
                            >
                              <span className="text-orange-500 text-[11px] font-mono shrink-0 select-none">
                                ›
                              </span>
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                  {activeComponent.anatomy &&
                    activeComponent.anatomy.length > 0 && (
                      <motion.div
                        variants={fadeVariants}
                        className="space-y-2.5 pt-4 border-t border-white/8"
                      >
                        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                          Component Anatomy
                        </div>
                        <div className="border border-white/8 rounded-xl bg-black/40 p-3 space-y-1 font-mono text-[11px]">
                          {activeComponent.anatomy.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-zinc-300"
                            >
                              <span className="text-zinc-600 text-[10px] w-3 shrink-0 text-right">
                                {idx + 1}
                              </span>
                              <span className="text-zinc-500">→</span>
                              <span className="text-zinc-300 font-mono text-[11px]">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                  {activeComponent.physics && (
                    <motion.div
                      variants={fadeVariants}
                      className="space-y-3 pt-4 border-t border-white/8"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                          Motion & Interaction Spec
                        </div>
                        <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                          {activeComponent.physics.engine}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed">
                        {activeComponent.physics.description}
                      </p>
                      {activeComponent.physics.parameters && (
                        <div className="border border-white/8 rounded-xl overflow-hidden bg-black/40">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-zinc-950 border-b border-white/8 text-zinc-500 font-mono text-[10px] uppercase">
                              <tr>
                                <th className="p-2.5 font-medium">Parameter</th>
                                <th className="p-2.5 font-medium">Value</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/6 font-mono text-[11px]">
                              {activeComponent.physics.parameters.map(
                                (param) => (
                                  <tr
                                    key={param.label}
                                    className="hover:bg-white/5 transition-colors"
                                  >
                                    <td className="p-2.5 text-zinc-400">
                                      {param.label}
                                    </td>
                                    <td className="p-2.5 text-zinc-200">
                                      {param.value}
                                    </td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeComponent.props &&
                    activeComponent.props.length > 0 && (
                      <motion.div
                        variants={fadeVariants}
                        className="space-y-3 pt-4 border-t border-white/8"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                            Props Interface
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {activeComponent.props.length} configurable
                          </span>
                        </div>
                        <div className="border border-white/8 rounded-xl overflow-hidden bg-black/40">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-zinc-950 border-b border-white/8 text-zinc-500 font-mono text-[10px] uppercase">
                              <tr>
                                <th className="p-2.5 font-medium">Prop</th>
                                <th className="p-2.5 font-medium">Type</th>
                                <th className="p-2.5 font-medium">Default</th>
                                <th className="p-2.5 font-medium">
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/6 text-xs">
                              {activeComponent.props.map((p) => (
                                <tr
                                  key={p.name}
                                  className="hover:bg-white/5 transition-colors align-top"
                                >
                                  <td className="p-2.5 font-mono">
                                    <div className="flex flex-col items-start gap-1">
                                      <span className="bg-zinc-900 border border-white/10 px-2 py-0.5 rounded text-orange-400 text-[11px]">
                                        {p.name}
                                      </span>
                                      {p.required && (
                                        <span className="text-[9px] uppercase tracking-wider text-rose-400 font-medium font-mono">
                                          Required
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-2.5 text-zinc-400 font-mono text-[11px] break-all">
                                    {p.type}
                                  </td>
                                  <td className="p-2.5 text-zinc-500 font-mono text-[11px]">
                                    {p.defaultValue ?? "—"}
                                  </td>
                                  <td className="p-2.5 text-zinc-300 font-sans font-light leading-relaxed">
                                    {p.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}

                  {activeComponent.accessibility && (
                    <motion.div
                      variants={fadeVariants}
                      className="space-y-3 pt-4 border-t border-white/8"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                          Accessibility & Shortcuts
                        </div>
                        {activeComponent.accessibility.role && (
                          <span className="text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/8 px-2 py-0.5 rounded">
                            role=&quot;{activeComponent.accessibility.role}
                            &quot;
                          </span>
                        )}
                      </div>
                      {activeComponent.accessibility.aria && (
                        <p className="text-xs text-zinc-400 font-light leading-relaxed">
                          {activeComponent.accessibility.aria}
                        </p>
                      )}
                      {activeComponent.accessibility.keyboard &&
                        activeComponent.accessibility.keyboard.length > 0 && (
                          <div className="border border-white/8 rounded-xl overflow-hidden bg-black/40">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-zinc-950 border-b border-white/8 text-zinc-500 font-mono text-[10px] uppercase">
                                <tr>
                                  <th className="p-2.5 font-medium">Key</th>
                                  <th className="p-2.5 font-medium">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/6 text-xs">
                                {activeComponent.accessibility.keyboard.map(
                                  (kb) => (
                                    <tr
                                      key={kb.key}
                                      className="hover:bg-white/5 transition-colors align-top"
                                    >
                                      <td className="p-2.5 font-mono">
                                        <kbd className="bg-zinc-900 border border-white/10 px-1.5 py-0.5 rounded text-zinc-200 text-[11px]">
                                          {kb.key}
                                        </kbd>
                                      </td>
                                      <td className="p-2.5 text-zinc-300 font-sans font-light leading-relaxed">
                                        {kb.description}
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      {activeComponent.accessibility.reducedMotion && (
                        <div className="flex items-start gap-2 text-xs text-zinc-400 font-light leading-relaxed bg-zinc-950/60 border border-white/6 rounded-lg p-2.5">
                          <span className="text-orange-400 text-[11px] font-mono select-none">
                            ✦
                          </span>
                          <span>
                            {activeComponent.accessibility.reducedMotion}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeComponent.guidelines && (
                    <motion.div
                      variants={fadeVariants}
                      className="space-y-3 pt-4 border-t border-white/8"
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        Integration & Best Practices
                      </div>
                      {activeComponent.guidelines.recommended && (
                        <div className="space-y-1.5">
                          <div className="text-[10px] font-mono uppercase text-zinc-500">
                            Recommended Use
                          </div>
                          {activeComponent.guidelines.recommended.map(
                            (rec, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-xs text-zinc-300 font-light leading-relaxed"
                              >
                                <span className="text-emerald-500 text-[11px] font-mono select-none">
                                  ✓
                                </span>
                                <span>{rec}</span>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                      {activeComponent.guidelines.bestPractices && (
                        <div className="space-y-1.5 pt-2">
                          <div className="text-[10px] font-mono uppercase text-zinc-500">
                            Best Practices
                          </div>
                          {activeComponent.guidelines.bestPractices.map(
                            (bp, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-xs text-zinc-300 font-light leading-relaxed"
                              >
                                <span className="text-orange-400 text-[11px] font-mono select-none">
                                  ·
                                </span>
                                <span>{bp}</span>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}

                  <motion.div
                    variants={fadeVariants}
                    className="space-y-2.5 pt-4 border-t border-white/8"
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      Dependencies & Source
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeComponent.dependencies.map((dep) => (
                        <span
                          key={dep}
                          className="inline-flex items-center gap-1.5 border border-white/10 bg-black/60 px-3 py-1 text-xs font-mono text-zinc-300 rounded-lg"
                        >
                          <span className="text-orange-500/70">~</span>
                          {dep}
                        </span>
                      ))}
                    </div>
                    {activeComponent.files && activeComponent.files[0] && (
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 bg-black/40 border border-white/8 rounded-lg px-3 py-2 mt-2">
                        <span>Source File</span>
                        <span className="text-zinc-300">
                          {activeComponent.files[0].path}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
