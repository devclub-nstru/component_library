"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
import { useIsDark } from "@/lib/use-is-dark";
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
import { FileUpload, type FileUploadLayout } from "@/registry/ui/file-upload";
import { FileDropzone } from "@/registry/ui/file-dropzone";
import { FileTree, type TreeNode } from "@/registry/ui/file-tree";
import { GitHubButton } from "@/components/ui/github-button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
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
import { Slider } from "@/registry/ui/slider";
import { Volume2, VolumeX } from "lucide-react";
import { MacSwitch, type MacSwitchColor } from "@/registry/ui/mac-switch";
import { SpotlightSearch } from "@/registry/ui/spotlight-search";
import { ProfileMenu } from "@/registry/ui/profile-menu";
import { DateRangePicker } from "@/registry/ui/date-range-picker";
import { RevealSheet, type RevealSheetSide } from "@/registry/ui/reveal-sheet";
import {
  FlipClockDemo,
  FlipClockControls,
  FLIP_CLOCK_DEFAULT_CONFIG,
} from "./flip-clock-demo";
import {
  TaskCardDemo,
  TaskCardControls,
  TASK_CARD_DEFAULT_CONFIG,
} from "./task-card-demo";
import OrbitGalleryDemo, {
  ORBIT_GALLERY_DEFAULT_CONFIG,
  OrbitGalleryControls,
} from "./orbit-gallery-demo";
import { ProjectReveal } from "@/registry/ui/project-reveal";
import {
  PROJECT_REVEAL_DEMO_ITEMS,
  PROJECT_REVEAL_DEFAULT_CONFIG,
  ProjectRevealControls,
} from "./project-reveal-demo";
import { Editor } from "@/registry/ui/editor";
import { DeleteSelectionShowcase } from "@/registry/ui/delete-selection";
import { SegmentedProgress } from "@/registry/ui/segmented-progress";
import { Stepper, type StepperProps } from "@/registry/ui/stepper";
import { AsciiHoverButton } from "@/registry/ui/ascii-hover-button";
import { FocusTestimonials } from "@/registry/ui/focus-testimonials";
import {
  LiquidMediaShowcase,
  LIQUID_MEDIA_PRESETS,
  LIQUID_MEDIA_IMAGES,
  type LiquidMediaPreset,
  type LiquidMediaPresetId,
  type LiquidMediaImageId,
} from "@/registry/ui/liquid-media";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getComponentCategories, getCategoryLabel } from "@/lib/registry";
import { CustomizationDock } from "./customization-dock";
import { SegmentedControl, SegmentedControlGroup } from "./segmented-control";
import { ColorSwatches, CustomizationRange } from "./customization-controls";

type InstallTool = "npx" | "pnpm" | "bun" | "shadcn";

const INSTALL_TOOLS: { id: InstallTool; label: string }[] = [
  { id: "npx", label: "npx" },
  { id: "pnpm", label: "pnpm" },
  { id: "bun", label: "bun" },
  { id: "shadcn", label: "shadcn" },
];

const getInstallCommand = (slug: string, tool: InstallTool) => {
  switch (tool) {
    case "pnpm":
      return `pnpm dlx @devclubnst/ui add ${slug}`;
    case "bun":
      return `bunx @devclubnst/ui add ${slug}`;
    case "shadcn":
      return `npx shadcn@latest add https://ui.devclubxnst.online/r/${slug}.json`;
    case "npx":
    default:
      return `npx @devclubnst/ui add ${slug}`;
  }
};

interface ComponentStudioProps {
  component: ComponentRegistryItem;
  allComponents?: ComponentRegistryItem[];
}

const CATEGORIES = getComponentCategories().map((category) => ({
  label: category.label.toUpperCase(),
  items: category.items.map((item) => ({
    label: item.name,
    slug: item.slug,
    href: `/components/${item.slug}`,
  })),
}));

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

const STEPPER_DEMO_STEPS = [
  { id: "account", title: "Account", description: "Your profile" },
  { id: "workspace", title: "Workspace", description: "Your team" },
  { id: "review", title: "Review", description: "Check details" },
  { id: "finish", title: "Finish", description: "Ready to go" },
];

function StepperDemo({
  orientation,
  showDescriptions,
  animated,
}: Pick<StepperProps, "orientation" | "showDescriptions" | "animated">) {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "Virat Kohli",
    email: "virat@devclubxnst.online",
    workspaceName: "DevClub",
    workspaceSlug: "devclub",
    teamSize: 12,
    environment: "production",
    notifications: true,
    autoDeploy: true,
  });

  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion || !animated;
  const finished = current === STEPPER_DEMO_STEPS.length;
  const titles = [
    "Create your account",
    "Name your workspace",
    "Review your setup",
    "Ready to launch",
    "All steps complete",
  ];
  const descriptions = [
    "Start with your profile details.",
    "Give your team a dedicated place to collaborate.",
    "Check your account and workspace details before continuing.",
    "Everything is ready. Complete the setup to finish.",
    "Your workspace is ready to use.",
  ];

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "workspaceName" && typeof value === "string") {
        next.workspaceSlug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }
      return next;
    });
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const update = () => {
      if (contentRef.current) {
        const h = contentRef.current.offsetHeight;
        if (h > 0) {
          setContentHeight(h);
        }
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [current]);

  return (
    <div className="w-full p-4 sm:p-8">
      <div className="mx-auto w-full max-w-xl space-y-6 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-white/8 dark:bg-[#141416]">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
            Workspace setup
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Configure your team workspace in a few quick steps
          </p>
        </div>
        <Stepper
          orientation={orientation}
          showDescriptions={showDescriptions}
          animated={animated}
          steps={STEPPER_DEMO_STEPS}
          currentStep={current}
          onStepChange={setCurrent}
          ariaLabel="Workspace setup steps"
        />
        <motion.div
          animate={{ height: contentHeight }}
          transition={
            reduced
              ? { duration: 0 }
              : { type: "spring", stiffness: 320, damping: 30, mass: 0.8 }
          }
          className="relative overflow-hidden rounded-xl border border-zinc-200/90 bg-zinc-50/70 dark:border-white/10 dark:bg-white/2"
        >
          <div ref={contentRef} className="p-4 sm:p-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current}
                initial={{ opacity: 0, y: reduced ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -6 }}
                transition={{
                  opacity: { duration: reduced ? 0 : 0.14 },
                  y: { duration: reduced ? 0 : 0.14 },
                }}
              >
                <div className="border-b border-zinc-200/70 pb-3 dark:border-white/5">
                  <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
                    {titles[current]}
                  </h4>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {descriptions[current]}
                  </p>
                </div>

                <div className="mt-4">
                  {current === 0 && (
                    <div className="space-y-3.5">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) =>
                              handleInputChange("fullName", e.target.value)
                            }
                            placeholder="e.g. Alex Rivera"
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 dark:border-white/10 dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-white/30 dark:focus:ring-white/10"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            Work Email
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            placeholder="alex@acme.dev"
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 dark:border-white/10 dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-white/30 dark:focus:ring-white/10"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        We will send workspace invitations and security
                        notifications to this address.
                      </p>
                    </div>
                  )}

                  {current === 1 && (
                    <div className="space-y-3.5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          Workspace Name
                        </label>
                        <input
                          type="text"
                          value={formData.workspaceName}
                          onChange={(e) =>
                            handleInputChange("workspaceName", e.target.value)
                          }
                          placeholder="e.g. Acme Studio"
                          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 dark:border-white/10 dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-white/30 dark:focus:ring-white/10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          Workspace URL
                        </label>
                        <div className="flex items-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-white/10 dark:bg-zinc-900/80">
                          <span className="select-none text-zinc-400 dark:text-zinc-500">
                            devclubxnst.online/
                          </span>
                          <input
                            type="text"
                            value={formData.workspaceSlug}
                            onChange={(e) =>
                              handleInputChange("workspaceSlug", e.target.value)
                            }
                            placeholder="acme-studio"
                            className="w-full bg-transparent pl-1 text-zinc-900 outline-none dark:text-zinc-100"
                          />
                        </div>
                      </div>
                      <div className="pt-2">
                        <Slider
                          label="Team Size"
                          value={formData.teamSize}
                          onValueChange={(val) =>
                            handleInputChange(
                              "teamSize",
                              typeof val === "number" ? val : val[0],
                            )
                          }
                          min={1}
                          max={50}
                          step={1}
                          showValue={true}
                          format={(val) => `${val}`}
                          marks={[
                            { value: 1, label: "1" },
                            { value: 10, label: "10" },
                            { value: 25, label: "25" },
                            { value: 50, label: "50+" },
                          ]}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {current === 2 && (
                    <div className="space-y-3.5">
                      <div className="rounded-lg border border-zinc-200/80 bg-white p-3 text-xs dark:border-white/5 dark:bg-zinc-900/50">
                        <div className="grid grid-cols-2 gap-2 text-zinc-600 dark:text-zinc-400">
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                              Account
                            </span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-200">
                              {formData.fullName || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                              Email
                            </span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-200">
                              {formData.email || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                              Workspace
                            </span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-200">
                              {formData.workspaceName || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                              Team Size
                            </span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-200">
                              {formData.teamSize}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="block text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                              URL
                            </span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-200">
                              devclubxnst.online/{formData.workspaceSlug}
                            </span>
                          </div>
                        </div>
                      </div>
                      <label className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notifications}
                          onChange={(e) =>
                            handleInputChange("notifications", e.target.checked)
                          }
                          className="size-4 rounded border-zinc-300 accent-zinc-900 dark:accent-white"
                        />
                        <span>
                          Send onboarding guides and team invitations to my
                          email
                        </span>
                      </label>
                    </div>
                  )}

                  {current === 3 && (
                    <div className="space-y-3.5">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          Target Environment
                        </label>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {[
                            {
                              id: "production",
                              title: "Production",
                              desc: "Live domain with edge caching",
                            },
                            {
                              id: "staging",
                              title: "Staging / Sandbox",
                              desc: "Isolated sandbox environment",
                            },
                          ].map((env) => (
                            <button
                              key={env.id}
                              type="button"
                              onClick={() =>
                                handleInputChange("environment", env.id)
                              }
                              className={cn(
                                "flex flex-col items-start rounded-lg border p-3 text-left transition cursor-pointer",
                                formData.environment === env.id
                                  ? "border-zinc-900 bg-zinc-900/5 ring-1 ring-zinc-900/20 dark:border-white/40 dark:bg-white/5 dark:ring-white/20"
                                  : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-900/50 dark:hover:border-white/20",
                              )}
                            >
                              <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                                {env.title}
                              </span>
                              <span className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                                {env.desc}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <label className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.autoDeploy}
                          onChange={(e) =>
                            handleInputChange("autoDeploy", e.target.checked)
                          }
                          className="size-4 rounded border-zinc-300 accent-zinc-900 dark:accent-white"
                        />
                        <span>
                          Automatically provision database and API secrets on
                          completion
                        </span>
                      </label>
                    </div>
                  )}

                  {finished && (
                    <div className="flex flex-col items-center justify-center py-3 text-center">
                      <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                        <CheckIcon className="size-5" />
                      </div>
                      <h5 className="mt-2.5 text-sm font-semibold text-zinc-900 dark:text-white">
                        Workspace Ready!
                      </h5>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {formData.workspaceName} is set up for{" "}
                        {formData.fullName} ({formData.teamSize}{" "}
                        {formData.teamSize === 1 ? "member" : "members"}).
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
                        <span>devclubxnst.online/{formData.workspaceSlug}</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
        <p role="status" className="sr-only">
          {finished
            ? "Setup complete"
            : `Step ${current + 1} of 4: ${STEPPER_DEMO_STEPS[current].title}`}
        </p>
        <div className="flex items-center justify-between">
          <CandyButton
            type="button"
            variant="obsidian"
            size="sm"
            className="motion-reduce:transition-none motion-reduce:active:scale-100"
            disabled={current === 0}
            onClick={() => setCurrent((step) => Math.max(0, step - 1))}
          >
            Back
          </CandyButton>
          <CandyButton
            type="button"
            variant="obsidian"
            size="sm"
            className="motion-reduce:transition-none motion-reduce:active:scale-100"
            rightIcon={!finished ? <ArrowRightIcon /> : undefined}
            onClick={() => setCurrent((step) => (finished ? 0 : step + 1))}
          >
            {finished ? "Start again" : current === 3 ? "Complete" : "Continue"}
          </CandyButton>
        </div>
      </div>
    </div>
  );
}

export const ComponentStudio = ({ component }: ComponentStudioProps) => {
  const [selectedSlug, setSelectedSlug] = useState(component.slug);
  const [prevPropSlug, setPrevPropSlug] = useState(component.slug);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [activeColor, setActiveColor] = useState<string>(PALETTE[3].hex);
  const [stepperOrientation, setStepperOrientation] =
    useState<NonNullable<StepperProps["orientation"]>>("auto");
  const [stepperDescriptions, setStepperDescriptions] = useState(true);
  const [stepperAnimated, setStepperAnimated] = useState(true);
  const [fileUploadLayout, setFileUploadLayout] =
    useState<FileUploadLayout>("full");
  const [fileDropzonePlacement, setFileDropzonePlacement] = useState<
    "below" | "inside"
  >("below");
  const [fileDropzoneKey, setFileDropzoneKey] = useState(0);
  const [hookDemoIndex, setHookDemoIndex] = useState(0);
  const [counterDemoValue, setCounterDemoValue] = useState(122337);
  const [editorDemoContent, _setEditorDemoContent] = useState(
    "DevClub UI components are engineered with mathematical spring physics, subpixel alignment, and hardware-accelerated GPU animations. Try selecting any portion of this paragraph to trigger the contextual floating toolbar: you can toggle formatting like bold, italic, and code, or click 'Ask AI' to stream a real-time AI response with staged reasoning.",
  );
  const [editorDemoAnswer, _setEditorDemoAnswer] = useState(
    "DevClub UI Selection AI Editor integrates seamless text formatting, an interactive thinking orb, multi-stage context retrieval, and word-by-word streaming.",
  );
  const [revealSheetOpen, setRevealSheetOpen] = useState(false);
  const [taskCardConfig, setTaskCardConfig] = useState(TASK_CARD_DEFAULT_CONFIG);
  const [selectedTaskCard, setSelectedTaskCard] = useState("interface");
  const [flipClockConfig, setFlipClockConfig] = useState({
    ...FLIP_CLOCK_DEFAULT_CONFIG,
  });
  const [orbitGalleryConfig, setOrbitGalleryConfig] = useState({
    ...ORBIT_GALLERY_DEFAULT_CONFIG,
  });
  const [projectRevealConfig, setProjectRevealConfig] = useState({
    ...PROJECT_REVEAL_DEFAULT_CONFIG,
  });
  const [revealSheetConfig, setRevealSheetConfig] = useState<{
    side: RevealSheetSide;
    speed: number;
    bounce: number;
    showGrid: boolean;
    showShine: boolean;
    shineDirection: "clockwise" | "counterclockwise";
    shineSpeed: number;
    shineIntensity: number;
  }>({
    side: "right",
    speed: 1,
    bounce: 1,
    showGrid: true,
    showShine: true,
    shineDirection: "clockwise",
    shineSpeed: 1,
    shineIntensity: 0.55,
  });
  const [sparkleConfig, setSparkleConfig] = useState({
    variant: "default" as "default" | "outline" | "glass",
    size: "lg" as "sm" | "default" | "lg",
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
      variant: "default",
      size: "lg",
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

  const [liquidMediaConfig, setLiquidMediaConfig] = useState<{
    preset: LiquidMediaPresetId;
    intensity: number;
    radius: number;
    expandRate: number;
    decayRate: number;
    image: LiquidMediaImageId;
    caption: string;
    showCaption: boolean;
    webglEnabled: boolean;
  }>({
    preset: "glass",
    intensity: 0.22,
    radius: 12,
    expandRate: 11,
    decayRate: 3.0,
    image: "portrait",
    caption: "Hover anywhere!",
    showCaption: true,
    webglEnabled: true,
  });

  const resetLiquidMediaConfig = () => {
    setLiquidMediaConfig({
      preset: "glass",
      intensity: 0.22,
      radius: 12,
      expandRate: 11,
      decayRate: 3.0,
      image: "portrait",
      caption: "Hover anywhere!",
      showCaption: true,
      webglEnabled: true,
    });
  };

  const applyLiquidMediaPreset = (preset: LiquidMediaPreset) => {
    setLiquidMediaConfig((prev) => ({
      ...prev,
      preset: preset.id,
      intensity: preset.intensity,
      radius: preset.radius,
      expandRate: preset.expandRate,
      decayRate: preset.decayRate,
    }));
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

  const [sliderIdeation, setSliderIdeation] = useState<
    "both" | "budget" | "volume"
  >("both");
  const [sliderBudget, setSliderBudget] = useState<[number, number]>([
    4500, 8000,
  ]);
  const [sliderVolume, setSliderVolume] = useState<number>(60);
  const [sliderDisabled, setSliderDisabled] = useState(false);
  const [sliderMinSteps, setSliderMinSteps] = useState(1);

  const resetSliderConfig = () => {
    setSliderIdeation("both");
    setSliderBudget([4500, 8000]);
    setSliderVolume(60);
    setSliderDisabled(false);
    setSliderMinSteps(1);
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

  const [themeTogglerConfig, setThemeTogglerConfig] = useState<{
    variant: "circle" | "square" | "triangle" | "diamond" | "hexagon" | "star";
    candy: boolean;
    fromCenter: boolean;
    duration: number;
  }>({
    variant: "circle",
    candy: true,
    fromCenter: false,
    duration: 450,
  });

  const resetThemeTogglerConfig = () => {
    setThemeTogglerConfig({
      variant: "circle",
      candy: true,
      fromCenter: false,
      duration: 450,
    });
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isDark = useIsDark();
  const [activePanel, setActivePanel] = useState<"none" | "info" | "code">(
    "none",
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [installTool, setInstallTool] = useState<InstallTool>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(
        "devclub_install_tool",
      ) as InstallTool | null;
      if (
        saved &&
        (saved === "npx" ||
          saved === "pnpm" ||
          saved === "bun" ||
          saved === "shadcn")
      ) {
        return saved;
      }
    }
    return "npx";
  });
  const [installMenuOpen, setInstallMenuOpen] = useState(false);
  const [installCopied, setInstallCopied] = useState(false);
  const [copiedToolKey, setCopiedToolKey] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const installMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        installMenuRef.current &&
        !installMenuRef.current.contains(e.target as Node)
      ) {
        setInstallMenuOpen(false);
      }
    };
    if (installMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [installMenuOpen]);

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
    activeComponent.slug !== "slider" &&
    activeComponent.slug !== "pixel-card" &&
    activeComponent.slug !== "task-card" &&
    activeComponent.slug !== "orb" &&
    activeComponent.slug !== "theme-toggle" &&
    activeComponent.slug !== "animated-theme-toggler" &&
    activeComponent.slug !== "theme-toggler" &&
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

  const handleInstallCopy = async (overrideTool?: InstallTool) => {
    const targetTool = overrideTool || installTool;
    const cmd = getInstallCommand(activeComponent.slug, targetTool);
    await navigator.clipboard.writeText(cmd);
    setInstallCopied(true);
    setCopiedToolKey(targetTool);
    toast.success(`Copied: ${cmd}`);
    setTimeout(() => {
      setInstallCopied(false);
      setCopiedToolKey(null);
    }, 2000);
  };

  const handleSelectTool = (tool: InstallTool) => {
    setInstallTool(tool);
    if (typeof window !== "undefined") {
      localStorage.setItem("devclub_install_tool", tool);
    }
    handleInstallCopy(tool);
  };

  const handleCustomCopy = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedToolKey(key);
    toast.success(`Copied: ${text}`);
    setTimeout(() => {
      setCopiedToolKey(null);
    }, 2000);
  };

  const handleCodeCopy = async () => {
    await navigator.clipboard.writeText(activeCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const renderComponentPreview = (slug: string, color: string) => {
    switch (slug) {
      case "file-upload":
        return (
          <div className="flex w-full max-w-xl flex-col items-center justify-center gap-3 p-4">
            <div
              draggable
              title="Drag this sample into the uploader"
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "copy";
                event.dataTransfer.items.add(
                  new File([new Uint8Array(640_000)], "product-shot.png", {
                    type: "image/png",
                  }),
                );
              }}
              className="flex cursor-grab items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground shadow-sm active:cursor-grabbing"
            >
              <span className="size-2 rounded-sm bg-foreground/70" />
              <span className="font-medium text-foreground">
                product-shot.png
              </span>
              <span>625 KB · drag to test</span>
            </div>
            <FileUpload
              accept="image/*,.pdf"
              layout={fileUploadLayout}
              accent={color}
              uploadFile={async (_file, onProgress, signal) => {
                for (let progress = 8; progress <= 100; progress += 8) {
                  await new Promise<void>((resolve, reject) => {
                    const timer = window.setTimeout(resolve, 90);
                    signal.addEventListener(
                      "abort",
                      () => {
                        window.clearTimeout(timer);
                        reject(new DOMException("Aborted", "AbortError"));
                      },
                      { once: true },
                    );
                  });
                  onProgress(progress);
                }
              }}
            />
          </div>
        );
      case "file-dropzone":
        return (
          <div className="flex w-full max-w-xl flex-col items-center justify-center gap-3 p-4">
            <FileDropzone
              key={fileDropzoneKey}
              label="Add launch assets"
              description="Drop, paste, or choose files from your device"
              note="PDF, images, or video up to 10 MB."
              listPlacement={fileDropzonePlacement}
              maxSize={10 * 1024 * 1024}
              defaultItems={[
                {
                  id: "sample-1",
                  name: "Peace.jpg",
                  size: 1.8 * 1024 * 1024,
                  status: "uploaded",
                  preview:
                    "https://i.pinimg.com/736x/44/cd/e9/44cde9e31e0bf09320e28d0d7cefdf52.jpg",
                },
                {
                  id: "sample-2",
                  name: "Hehe.pdf",
                  size: 2.4 * 1024 * 1024,
                  status: "uploaded",
                },
                {
                  id: "sample-3",
                  name: "Expectation.mp4",
                  size: 8.6 * 1024 * 1024,
                  status: "failed",
                  error: "Connection lost",
                  retryable: true,
                },
              ]}
              onUpload={async (_item, { onProgress, signal }) => {
                for (let progress = 10; progress <= 100; progress += 10) {
                  await new Promise<void>((resolve, reject) => {
                    const timer = window.setTimeout(resolve, 80);
                    signal.addEventListener(
                      "abort",
                      () => {
                        window.clearTimeout(timer);
                        reject(new DOMException("Aborted", "AbortError"));
                      },
                      { once: true },
                    );
                  });
                  onProgress(progress);
                }
              }}
            />
          </div>
        );
      case "confirm-morph":
      case "morph-selection":
        return (
          <div className="flex w-full items-center justify-center p-4">
            <DeleteSelectionShowcase />
          </div>
        );
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
                  <span className="w-2.5 h-0.5 rounded-full bg-zinc-400 dark:bg-zinc-700" />
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
      case "stepper":
        return (
          <StepperDemo
            orientation={stepperOrientation}
            showDescriptions={stepperDescriptions}
            animated={stepperAnimated}
          />
        );
      case "segmented-progress":
        return (
          <div className="flex flex-col items-center justify-center w-full h-full min-h-96 select-none p-4 sm:p-8">
            <SegmentedProgress color={color} />
          </div>
        );
      case "focus-testimonials":
        return (
          <div className="flex w-full items-center justify-center p-4 sm:p-8 select-none">
            <FocusTestimonials />
          </div>
        );
      case "task-card":
        return (
          <TaskCardDemo
            config={taskCardConfig}
            selectedId={selectedTaskCard}
          />
        );
      case "flip-clock":
        return (
          <FlipClockDemo key={flipClockConfig.mode} config={flipClockConfig} />
        );
      case "orbit-gallery":
        return <OrbitGalleryDemo {...orbitGalleryConfig} />;
      case "project-reveal":
        return (
          <div className="flex w-full max-w-3xl items-center justify-center px-4 py-12 sm:px-10">
            <ProjectReveal
              items={PROJECT_REVEAL_DEMO_ITEMS}
              {...projectRevealConfig}
            />
          </div>
        );
      case "liquid-media": {
        const activeImg = LIQUID_MEDIA_IMAGES[liquidMediaConfig.image];
        return (
          <div className="flex w-full items-center justify-center p-4 sm:p-8 select-none">
            <LiquidMediaShowcase
              key={`${liquidMediaConfig.image}-${liquidMediaConfig.webglEnabled}`}
              src={activeImg.src}
              caption={
                liquidMediaConfig.showCaption ? liquidMediaConfig.caption : ""
              }
              intensity={liquidMediaConfig.intensity}
              radius={liquidMediaConfig.radius}
              expandRate={liquidMediaConfig.expandRate}
              decayRate={liquidMediaConfig.decayRate}
              webglEnabled={liquidMediaConfig.webglEnabled}
            />
          </div>
        );
      }
      case "slider":
        return (
          <div className="flex flex-col items-center justify-center w-full h-full min-h-96 select-none p-4 sm:p-8">
            <div className="w-full max-w-xl flex flex-col gap-10 p-6 sm:p-10 rounded-2xl bg-zinc-950/40 dark:bg-black/40 border border-zinc-800/80 dark:border-white/10 backdrop-blur-xl shadow-2xl transition-all">
              {(sliderIdeation === "both" || sliderIdeation === "budget") && (
                <div className="w-full">
                  <Slider
                    label="Budget"
                    value={sliderBudget}
                    onValueChange={setSliderBudget}
                    min={0}
                    max={15000}
                    step={100}
                    minStepsBetweenThumbs={sliderMinSteps}
                    format={(val) => `₹${val.toLocaleString("en-US")}`}
                    disabled={sliderDisabled}
                  />
                </div>
              )}

              {(sliderIdeation === "both" || sliderIdeation === "volume") && (
                <div className="w-full">
                  <Slider
                    label="Volume"
                    value={sliderVolume}
                    onValueChange={setSliderVolume}
                    min={0}
                    max={100}
                    step={1}
                    format={(val) => `${val}%`}
                    disabled={sliderDisabled}
                    start={
                      <button
                        type="button"
                        onClick={() =>
                          setSliderVolume((v) => (v === 0 ? 60 : 0))
                        }
                        className="w-9 h-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        aria-label="Toggle mute"
                      >
                        {sliderVolume === 0 ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    }
                    marks={[
                      { value: 0, label: "0%" },
                      { value: 25, label: "25%" },
                      { value: 50, label: "50%" },
                      { value: 75, label: "75%" },
                      { value: 100, label: "100%" },
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case "mac-switch":
        return (
          <div className="flex flex-col items-center justify-center w-full h-full min-h-96 select-none p-4 sm:p-8">
            <MacSwitch defaultChecked={true} color={macSwitchColor} />
          </div>
        );
      case "profile-menu":
        return (
          <div className="flex flex-col items-center justify-center w-full h-full min-h-96 select-none p-4 sm:p-8">
            <div className="w-full flex justify-center">
              <ProfileMenu />
            </div>
          </div>
        );
      case "date-range-picker":
        return (
          <div className="flex flex-col items-center justify-center w-full h-full min-h-96 select-none p-4 sm:p-8">
            <DateRangePicker
              onApply={(range) => {
                const fmt = new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                toast.success("Date range applied", {
                  description: fmt.formatRange(range.start, range.end),
                });
              }}
              onCancel={() => {
                toast.info("Date range reset", {
                  description: "Selection reverted to previous dates",
                });
              }}
            />
          </div>
        );
      case "reveal-sheet":
        return (
          <div className="flex min-h-96 items-center justify-center p-8">
            <Button onClick={() => setRevealSheetOpen(true)}>
              Open Reveal Sheet
            </Button>
            <RevealSheet
              open={revealSheetOpen}
              onOpenChange={setRevealSheetOpen}
              side={revealSheetConfig.side}
              speed={revealSheetConfig.speed}
              bounce={revealSheetConfig.bounce}
              showGrid={revealSheetConfig.showGrid}
              showShine={revealSheetConfig.showShine}
              shineDirection={revealSheetConfig.shineDirection}
              shineSpeed={revealSheetConfig.shineSpeed}
              shineIntensity={revealSheetConfig.shineIntensity}
              title="Release checklist"
              description="Track the final details before this component ships."
            >
              <TaskList
                className="max-w-none"
                defaultTasks={[
                  {
                    id: "review",
                    label: "Review the circular reveal",
                    done: true,
                  },
                  { id: "directions", label: "Test every opening direction" },
                  {
                    id: "accessibility",
                    label: "Check keyboard and reduced motion",
                  },
                  { id: "publish", label: "Publish the component" },
                ]}
              />
            </RevealSheet>
          </div>
        );
      case "editor":
        return (
          <div className="flex w-full max-w-2xl flex-col items-center justify-center p-6">
            <div className="w-full">
              <Editor title="Interactive Document" answer={editorDemoAnswer}>
                {editorDemoContent}
              </Editor>
            </div>
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
              variant={sparkleConfig.variant}
              size={sparkleConfig.size}
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
      case "animated-theme-toggler":
      case "theme-toggle":
      case "theme-toggler":
        return (
          <div className="flex flex-col items-center justify-center gap-8 select-none max-w-2xl w-full p-4">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative flex items-center justify-center p-8 rounded-3xl border border-border dark:border-white/10 bg-card/80 dark:bg-[#121215]/80 backdrop-blur-xl shadow-2xl">
                <AnimatedThemeToggler
                  variant={themeTogglerConfig.variant}
                  duration={themeTogglerConfig.duration}
                  fromCenter={themeTogglerConfig.fromCenter}
                  candy={themeTogglerConfig.candy}
                  className="w-16 h-16 rounded-2xl shadow-xl [&_svg]:size-7 cursor-pointer"
                />
              </div>{" "}
            </div>
          </div>
        );

      case "animated-button":
        return (
          <div className="w-full max-w-md bg-card dark:bg-[#0c0c0e] border border-border dark:border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 select-none">
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
          </div>
        );

      case "ascii-hover-button":
        return (
          <div className="flex flex-col items-center justify-center select-none max-w-xl w-full p-4 sm:p-8">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <AsciiHoverButton
                text="1M"
                variant="segmented"
                active
                color={color}
                size="default"
              />
              <AsciiHoverButton
                text="Deploy Project"
                variant="card"
                color={color}
                size="default"
              />
              <AsciiHoverButton
                text="Terminal Access"
                variant="outline"
                color={color}
                size="default"
              />
              <AsciiHoverButton
                text="View Docs"
                variant="ghost"
                color={color}
                size="default"
              />
            </div>
          </div>
        );

      case "github-activity":
        return <GitHubActivity />;
      case "hook-sidebar":
        return (
          <div className="w-full max-w-sm bg-card dark:bg-[#0c0c0e] border border-border dark:border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
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
                        "border-b border-border dark:border-white/8 pb-2",
                        idx === 0 ? "pt-0" : "pt-5",
                      )}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground dark:text-zinc-500 block leading-none">
                        Section
                      </span>
                      <h2 className="text-base font-medium text-foreground dark:text-white tracking-tight mt-1 leading-tight">
                        {sec.label}
                      </h2>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <h3 className="text-xs font-mono uppercase tracking-wider text-foreground/90 dark:text-zinc-300">
                        {sec.label}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground dark:text-zinc-400 font-light">
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
          <div className="w-full max-w-xl bg-card dark:bg-[#0c0c0e] border border-border dark:border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-white/8">
              <div>
                <h3 className="text-sm font-medium text-foreground dark:text-white">
                  Architectural Scales
                </h3>
                <p className="text-[11px] text-muted-foreground dark:text-zinc-400 font-light mt-0.5">
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
              className="p-6 border-border dark:border-white/10 bg-card dark:bg-[#0c0c0e]"
              spotlightColor={color.startsWith("#") ? `${color}30` : color}
            >
              <h4 className="text-base font-medium text-foreground dark:text-white">
                Radial Spotlight
              </h4>
              <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-2 font-light leading-relaxed">
                Smooth cursor tracking with radial falloff gradient.
              </p>
              <div className="mt-6 pt-4 border-t border-border dark:border-white/8 flex items-center justify-between text-[11px] font-mono text-muted-foreground dark:text-zinc-500">
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
                className="w-full aspect-4/5 p-6 border-border dark:border-white/10 bg-card dark:bg-[#0c0c0e]"
                variant={pixelVariant}
                pattern={pixelPattern}
                speed={pixelSpeed}
                noise={pixelNoise}
                gap={pixelGap}
                maxTilt={6}
              />
            </div>

            <div className="w-full max-w-xl shrink-0 rounded-2xl border border-border dark:border-white/10 bg-card/95 dark:bg-[#121215]/95 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.85)] flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-foreground dark:text-white/90 tracking-tight">
                  Pixel Card Controls
                </span>
                <button
                  type="button"
                  onClick={resetPixelConfig}
                  className="text-[11px] text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ResetIcon className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="rounded-xl border border-border dark:border-white/5 bg-muted/40 dark:bg-[#0b0b0e] p-2 sm:p-2.5 flex flex-col gap-2">
                <div className="h-9 rounded-lg border border-border dark:border-white/5 bg-card dark:bg-[#17171b] px-3.5 flex items-center gap-3 text-xs">
                  <span className="w-16 text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                    Pattern
                  </span>
                  <div className="flex-1 min-w-0 flex items-center gap-1 bg-muted/80 dark:bg-black/30 p-0.5 rounded-md border border-border dark:border-white/5 overflow-hidden">
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
                            ? "text-background font-semibold dark:text-black"
                            : "text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white",
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
                            className="absolute inset-0 bg-foreground dark:bg-white rounded shadow-xs"
                          />
                        )}
                        <span className="relative z-10 truncate">
                          {p.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-9 rounded-lg border border-border dark:border-white/5 bg-card dark:bg-[#17171b] px-3.5 flex items-center gap-3 text-xs">
                  <span className="w-16 text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                    Color
                  </span>
                  <div className="flex-1 min-w-0 flex items-center gap-1 bg-muted/80 dark:bg-black/30 p-0.5 rounded-md border border-border dark:border-white/5 overflow-hidden">
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
                            ? "text-background font-semibold dark:text-black"
                            : "text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white",
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
                            className="absolute inset-0 bg-foreground dark:bg-white rounded shadow-xs"
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

                <div className="h-9 rounded-lg border border-border dark:border-white/5 bg-card dark:bg-[#17171b] px-3.5 flex items-center gap-3 text-xs">
                  <span className="w-16 text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                    Speed
                  </span>
                  <div className="flex-1 min-w-0 flex items-center gap-1 bg-muted/80 dark:bg-black/30 p-0.5 rounded-md border border-border dark:border-white/5 overflow-hidden">
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
                            ? "text-background font-semibold dark:text-black"
                            : "text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white",
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
                            className="absolute inset-0 bg-foreground dark:bg-white rounded shadow-xs"
                          />
                        )}
                        <span className="relative z-10 truncate">
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-9 rounded-lg border border-border dark:border-white/5 bg-card dark:bg-[#17171b] px-3.5 flex items-center gap-3 text-xs">
                  <span className="w-16 text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                    Noise
                  </span>
                  <div className="flex-1 min-w-0 flex items-center gap-1 bg-muted/80 dark:bg-black/30 p-0.5 rounded-md border border-border dark:border-white/5 overflow-hidden">
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
                            ? "text-background font-semibold dark:text-black"
                            : "text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white",
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
                            className="absolute inset-0 bg-foreground dark:bg-white rounded shadow-xs"
                          />
                        )}
                        <span className="relative z-10 truncate">
                          {n.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-9 rounded-lg border border-border dark:border-white/5 bg-card dark:bg-[#17171b] px-3.5 flex items-center gap-3 text-xs">
                  <span className="w-16 text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                    Density
                  </span>
                  <div className="flex-1 min-w-0 flex items-center gap-1 bg-muted/80 dark:bg-black/30 p-0.5 rounded-md border border-border dark:border-white/5 overflow-hidden">
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
                            ? "text-background font-semibold dark:text-black"
                            : "text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white",
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
                            className="absolute inset-0 bg-foreground dark:bg-white rounded shadow-xs"
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
          <div className="w-full max-w-lg bg-card dark:bg-[#0c0c0e] border border-border dark:border-white/10 rounded-2xl p-6 shadow-2xl">
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
          <div className="w-full max-w-md bg-card dark:bg-[#0c0c0e] border border-border dark:border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center gap-4">
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
            <span className="text-xs font-mono text-muted-foreground dark:text-zinc-500">
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
              className="font-mono text-6xl font-bold tracking-tight text-foreground dark:text-white **:data-[slot=animated-counter-mark]:mx-[-0.1em] sm:text-7xl"
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
                          ? "h-5 bg-zinc-800 dark:bg-[#EBEBF5]"
                          : "h-3.5 bg-zinc-300 dark:bg-[#3C3C43]"
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
    <div className="h-screen w-screen bg-background text-foreground flex overflow-hidden select-none">
      <motion.aside
        initial={false}
        animate={{
          width: isFullscreen ? 0 : sidebarOpen ? 260 : 64,
          opacity: isFullscreen ? 0 : 1,
        }}
        transition={panelSpring}
        className={cn(
          "shrink-0 bg-background flex flex-col overflow-hidden h-full z-20 border-r border-border",
          isFullscreen && "border-r-0",
        )}
      >
        <div className="p-3.5 flex items-center justify-between h-14 shrink-0 border-b border-border">
          {sidebarOpen ? (
            <Link
              href="/"
              className="flex items-center group hover:opacity-80 transition-opacity"
              title="DevClub Home"
            >
              <Image
                src={isDark ? "/logo-he.png" : "/logo-he-bl.png"}
                alt="DevClub"
                width={120}
                height={50}
                className="h-12 w-auto object-contain"
              />
            </Link>
          ) : (
            <div></div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            transition={microSpring}
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg border border-border bg-card dark:bg-[#18181b] hover:bg-muted dark:hover:bg-[#222226] text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
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
                  className="flex items-center justify-between text-xs font-medium text-muted-foreground hover:text-orange-500 transition-colors tracking-tight px-1 py-1"
                >
                  <span>All Components</span>
                  <ChevronRightIcon className="w-3.5 h-3.5 text-muted-foreground" />
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
          className="relative border border-border bg-card dark:bg-[#0f0f11] flex flex-col overflow-hidden h-full flex-1 rounded-3xl"
        >
          <div className="h-14 px-5 border-b border-border flex items-center justify-between z-20 shrink-0 bg-card/80 dark:bg-[#0f0f11]/80 backdrop-blur-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <Link
                href="/components"
                className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                {getCategoryLabel(activeComponent.category)}
              </Link>
              <span className="text-border shrink-0">/</span>
              <span className="text-xs font-sans font-medium text-foreground tracking-tight truncate">
                {activeComponent.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center p-0.5 rounded-lg border border-border bg-muted/60 dark:bg-[#18181b]/90 shadow-sm mr-1">
                <button
                  type="button"
                  onClick={() => setViewport("desktop")}
                  title="Desktop (100%)"
                  className={cn(
                    "p-1.5 rounded-md transition-colors cursor-pointer",
                    viewport === "desktop"
                      ? "bg-background dark:bg-white/15 text-foreground dark:text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
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
                      ? "bg-background dark:bg-white/15 text-foreground dark:text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
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
                      ? "bg-background dark:bg-white/15 text-foreground dark:text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <MobileIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <GitHubButton className="h-8 px-2.5 rounded-lg text-xs" />
              <AnimatedThemeToggler
                candy
                className="w-8 h-8 rounded-lg shrink-0 [&_svg]:size-3.5 shadow-sm"
              />

              <div className="relative" ref={installMenuRef}>
                <div className="flex items-center rounded-lg border border-border bg-muted/60 hover:border-foreground/20 dark:bg-[#18181b]/90 dark:hover:bg-[#222226] shadow-sm transition-colors overflow-hidden h-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.94 }}
                    transition={microSpring}
                    type="button"
                    onClick={() => handleInstallCopy()}
                    className="h-full px-2.5 text-muted-foreground hover:text-foreground dark:text-zinc-300 dark:hover:text-white text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    title={`Copy: ${getInstallCommand(activeComponent.slug, installTool)}`}
                  >
                    {installCopied ? (
                      <>
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">
                          Copied
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-mono text-xs">
                          {installTool === "npx"
                            ? "npm i"
                            : `${installTool} add`}
                        </span>
                      </>
                    )}
                  </motion.button>
                  <div className="w-px h-4 bg-border/80" />
                  <button
                    type="button"
                    onClick={() => setInstallMenuOpen((prev) => !prev)}
                    className="h-full px-1.5 text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white hover:bg-muted/80 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center"
                    title="Customize package manager & command"
                    aria-label="Customize install command"
                  >
                    <ChevronDownIcon
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        installMenuOpen && "rotate-180",
                      )}
                    />
                  </button>
                </div>

                <AnimatePresence>
                  {installMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={microSpring}
                      className="absolute right-0 top-10 z-50 w-80 sm:w-96 rounded-xl border border-border bg-popover/95 dark:bg-[#121215]/98 backdrop-blur-md p-3.5 shadow-2xl text-popover-foreground space-y-3"
                    >
                      <div className="flex items-center justify-between pb-1 border-b border-border/50">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground tracking-tight">
                            Install Component
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {activeComponent.slug}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setInstallMenuOpen(false)}
                          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                        >
                          <Cross2Icon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="relative grid grid-cols-4 gap-1 p-1 bg-muted/50 dark:bg-zinc-900/80 rounded-lg border border-border/60">
                        {INSTALL_TOOLS.map((t) => {
                          const isActive = installTool === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => handleSelectTool(t.id)}
                              className={cn(
                                "relative py-1 text-xs font-mono rounded-md transition-colors cursor-pointer text-center select-none",
                                isActive
                                  ? "text-foreground dark:text-white font-medium"
                                  : "text-muted-foreground hover:text-foreground",
                              )}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="active-install-tool-pill"
                                  transition={{
                                    type: "spring",
                                    stiffness: 480,
                                    damping: 32,
                                    mass: 0.8,
                                  }}
                                  className="absolute inset-0 bg-background dark:bg-[#27272a] rounded-md shadow-xs border border-border/60 z-0"
                                />
                              )}
                              <span className="relative z-10">{t.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="rounded-lg bg-[#09090b] border border-border/70 p-2.5 flex items-center justify-between gap-2 shadow-inner">
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none font-mono text-xs text-zinc-300">
                          <span className="text-orange-400 select-none font-bold">
                            $
                          </span>
                          <span className="select-all">
                            {getInstallCommand(
                              activeComponent.slug,
                              installTool,
                            )}
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.94 }}
                          transition={microSpring}
                          type="button"
                          onClick={() => handleInstallCopy(installTool)}
                          className="shrink-0 p-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy active command"
                        >
                          {copiedToolKey === installTool ? (
                            <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <CopyIcon className="w-3.5 h-3.5" />
                          )}
                        </motion.button>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          Quick Presets
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border text-xs">
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="font-medium text-foreground text-[11px]">
                              Shadcn Registry
                            </span>
                            <span className="text-[11px] font-mono text-muted-foreground truncate select-all">
                              {`npx shadcn@latest add https://ui.devclubxnst.online/r/${activeComponent.slug}.json`}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCustomCopy(
                                "shadcn_url",
                                `npx shadcn@latest add https://ui.devclubxnst.online/r/${activeComponent.slug}.json`,
                              )
                            }
                            className="shrink-0 p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="Copy shadcn command"
                          >
                            {copiedToolKey === "shadcn_url" ? (
                              <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <CopyIcon className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border text-xs">
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="font-medium text-foreground text-[11px]">
                              Shadcn (unpkg direct)
                            </span>
                            <span className="text-[11px] font-mono text-muted-foreground truncate select-all">
                              {`npx shadcn@latest add https://unpkg.com/@devclubnst/ui@latest/public/r/${activeComponent.slug}.json`}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCustomCopy(
                                "shadcn_unpkg",
                                `npx shadcn@latest add https://unpkg.com/@devclubnst/ui@latest/public/r/${activeComponent.slug}.json`,
                              )
                            }
                            className="shrink-0 p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="Copy unpkg shadcn command"
                          >
                            {copiedToolKey === "shadcn_unpkg" ? (
                              <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <CopyIcon className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {activeComponent.dependencies.length > 0 && (
                          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border text-xs">
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="font-medium text-foreground text-[11px]">
                                Peer Dependencies
                              </span>
                              <span className="text-[11px] font-mono text-muted-foreground truncate select-all">
                                {`npm i ${activeComponent.dependencies.join(" ")}`}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleCustomCopy(
                                  "deps",
                                  `npm i ${activeComponent.dependencies.join(" ")}`,
                                )
                              }
                              className="shrink-0 p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              title="Copy peer dependencies"
                            >
                              {copiedToolKey === "deps" ? (
                                <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <CopyIcon className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                        <span>Package: @devclubnst/ui</span>
                        <Link
                          href="/docs/cli"
                          className="hover:text-foreground transition-colors underline underline-offset-2"
                        >
                          CLI docs &rarr;
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                transition={microSpring}
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={
                  isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"
                }
                className="w-8 h-8 rounded-lg border border-border bg-muted/60 hover:bg-muted dark:bg-[#18181b]/90 dark:hover:bg-[#222226] text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
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
                    ? "border-orange-500/80 text-orange-600 dark:text-orange-400 bg-orange-500/10 dark:bg-orange-500/15 shadow-orange-500/10 shadow-md font-medium"
                    : "border-border bg-muted/60 hover:bg-muted dark:bg-[#18181b]/90 dark:hover:bg-[#222226] text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white",
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
                    ? "border-orange-500/80 text-orange-600 dark:text-orange-400 bg-orange-500/10 dark:bg-orange-500/15 shadow-orange-500/10 shadow-md font-medium"
                    : "border-border bg-muted/60 hover:bg-muted dark:bg-[#18181b]/90 dark:hover:bg-[#222226] text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white",
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
                activeComponent.slug === "noise" ||
                activeComponent.slug === "orbit-gallery" ||
                activeComponent.slug === "flip-clock" ||
                activeComponent.slug === "task-card") &&
                viewport === "desktop"
                ? "p-0"
                : "p-6",
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] text-foreground/8 bg-size-[20px_20px] pointer-events-none" />

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
                  "border border-border bg-background dark:bg-[#09090b] shadow-[0_25px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)] my-auto max-h-[90vh]",
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
                      activeComponent.slug === "noise" ||
                      activeComponent.slug === "orbit-gallery" ||
                      activeComponent.slug === "flip-clock" ||
                      activeComponent.slug === "task-card"
                      ? "p-0"
                      : "p-6",
                  )}
                >
                  {renderComponentPreview(activeComponent.slug, activeColor)}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <CustomizationDock key={activeComponent.slug}>
              {supportsColor && activeComponent.slug !== "file-upload" && (
                <div
                  key="floating-color-palette"
                  data-customization-palette={PALETTE.length}
                  className="flex min-w-0 flex-col gap-3 p-3 font-sans sm:p-4"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    Accent color
                  </span>
                  <ColorSwatches
                    options={PALETTE.map((color) => ({
                      value: color.hex,
                      label: color.label,
                      color: color.hex,
                    }))}
                    value={activeColor}
                    onChange={setActiveColor}
                  />
                </div>
              )}

              {activeComponent.slug === "stepper" && (
                <div className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-foreground">
                      Stepper settings
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setStepperOrientation("auto");
                        setStepperDescriptions(true);
                        setStepperAnimated(true);
                      }}
                      className="rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                    >
                      Reset
                    </button>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Layout
                  </span>
                  <SegmentedControlGroup
                    aria-label="Stepper layout"
                    className="w-full min-w-0"
                  >
                    {(["auto", "horizontal", "vertical"] as const).map(
                      (orientation) => (
                        <button
                          key={orientation}
                          type="button"
                          aria-pressed={stepperOrientation === orientation}
                          onClick={() => setStepperOrientation(orientation)}
                          className="relative z-10 min-h-10 flex-1 rounded-lg px-2 text-xs capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                        >
                          {orientation}
                        </button>
                      ),
                    )}
                  </SegmentedControlGroup>
                  <label className="flex cursor-pointer items-center justify-between gap-4 text-xs text-foreground">
                    Show descriptions
                    <input
                      type="checkbox"
                      checked={stepperDescriptions}
                      onChange={(event) =>
                        setStepperDescriptions(event.target.checked)
                      }
                      className="size-4 accent-orange-500"
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between gap-4 text-xs text-foreground">
                    Animate transitions
                    <input
                      type="checkbox"
                      checked={stepperAnimated}
                      onChange={(event) =>
                        setStepperAnimated(event.target.checked)
                      }
                      className="size-4 accent-orange-500"
                    />
                  </label>
                </div>
              )}

              {activeComponent.slug === "file-upload" && (
                <div className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4">
                  <span className="pl-1 text-sm font-semibold text-foreground">
                    Upload settings
                  </span>
                  <SegmentedControlGroup
                    role="group"
                    aria-label="Upload component size"
                    className="w-full min-w-0"
                  >
                    {(["full", "compact"] as const).map((layout) => (
                      <button
                        key={layout}
                        type="button"
                        aria-pressed={fileUploadLayout === layout}
                        onClick={() => setFileUploadLayout(layout)}
                        className={cn(
                          "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 capitalize",
                          fileUploadLayout === layout
                            ? "text-white"
                            : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                        )}
                      >
                        {layout}
                      </button>
                    ))}
                  </SegmentedControlGroup>

                  <fieldset className="min-w-0">
                    <legend className="mb-2.5 text-xs font-medium text-muted-foreground">
                      Accent color
                    </legend>
                    <ColorSwatches
                      options={PALETTE.map((color) => ({
                        value: color.hex,
                        label: color.label,
                        color: color.hex,
                      }))}
                      value={activeColor}
                      onChange={setActiveColor}
                    />
                  </fieldset>
                </div>
              )}

              {activeComponent.slug === "file-dropzone" && (
                <div className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4">
                  <span className="pl-1 text-sm font-semibold text-foreground">
                    Placement
                  </span>
                  <SegmentedControlGroup
                    role="group"
                    aria-label="Dropzone list placement"
                    className="w-full min-w-0"
                  >
                    {(["below", "inside"] as const).map((placement) => (
                      <button
                        key={placement}
                        type="button"
                        aria-pressed={fileDropzonePlacement === placement}
                        onClick={() => setFileDropzonePlacement(placement)}
                        className={cn(
                          "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 capitalize",
                          fileDropzonePlacement === placement
                            ? "text-white"
                            : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                        )}
                      >
                        {placement}
                      </button>
                    ))}
                  </SegmentedControlGroup>

                  <button
                    type="button"
                    onClick={() => setFileDropzoneKey((k) => k + 1)}
                    className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white/60 px-3 text-xs font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                  >
                    <ResetIcon className="size-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              )}

              {activeComponent.slug === "reveal-sheet" && (
                <div className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4">
                  <div className="flex shrink-0 items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      Sheet settings
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setRevealSheetConfig({
                            side: "right",
                            speed: 1,
                            bounce: 1,
                            showGrid: true,
                            showShine: true,
                            shineDirection: "clockwise",
                            shineSpeed: 1,
                            shineIntensity: 0.55,
                          })
                        }
                        className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white/60 px-3 text-xs font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                      >
                        <ResetIcon className="size-3.5" />
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setRevealSheetOpen(true)}
                        className="rounded-xl bg-black ring-1 ring-inset ring-white/20 px-3 py-1.5 text-xs font-medium text-zinc-950 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
                      >
                        Replay sheet
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="min-w-0 space-y-3">
                      <div className="flex min-w-0 flex-col gap-2.5">
                        <span className="text-[11px] text-muted-foreground">
                          Direction
                        </span>
                        <SegmentedControlGroup
                          role="group"
                          aria-label="Sheet direction"
                          className="w-full min-w-0"
                        >
                          {(["top", "right", "bottom", "left"] as const).map(
                            (side) => (
                              <button
                                key={side}
                                type="button"
                                aria-pressed={revealSheetConfig.side === side}
                                onClick={() =>
                                  setRevealSheetConfig((prev) => ({
                                    ...prev,
                                    side,
                                  }))
                                }
                                className={cn(
                                  "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 capitalize",
                                  revealSheetConfig.side === side
                                    ? "text-white"
                                    : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                                )}
                              >
                                {side}
                              </button>
                            ),
                          )}
                        </SegmentedControlGroup>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <label
                              htmlFor="reveal-sheet-speed"
                              className="text-muted-foreground"
                            >
                              Speed
                            </label>
                            <span className="font-medium tabular-nums text-foreground">
                              {revealSheetConfig.speed.toFixed(1)}×
                            </span>
                          </div>
                          <CustomizationRange
                            id="reveal-sheet-speed"
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={revealSheetConfig.speed}
                            onChange={(event) =>
                              setRevealSheetConfig((prev) => ({
                                ...prev,
                                speed: Number(event.target.value),
                              }))
                            }
                          />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <label
                              htmlFor="reveal-sheet-bounce"
                              className="text-muted-foreground"
                            >
                              Bounce strength
                            </label>
                            <span className="font-medium tabular-nums text-foreground">
                              {revealSheetConfig.bounce.toFixed(1)}×
                            </span>
                          </div>
                          <CustomizationRange
                            id="reveal-sheet-bounce"
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={revealSheetConfig.bounce}
                            onChange={(event) =>
                              setRevealSheetConfig((prev) => ({
                                ...prev,
                                bounce: Number(event.target.value),
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 space-y-3 border-t border-border pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 dark:border-border">
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <label
                          htmlFor="reveal-sheet-grid"
                          className="text-muted-foreground"
                        >
                          Grid background
                        </label>
                        <input
                          id="reveal-sheet-grid"
                          type="checkbox"
                          checked={revealSheetConfig.showGrid}
                          onChange={(event) =>
                            setRevealSheetConfig((prev) => ({
                              ...prev,
                              showGrid: event.target.checked,
                            }))
                          }
                          className="size-4 cursor-pointer accent-black"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <label
                          htmlFor="reveal-sheet-shine"
                          className="text-muted-foreground"
                        >
                          Edge shine
                        </label>
                        <input
                          id="reveal-sheet-shine"
                          type="checkbox"
                          checked={revealSheetConfig.showShine}
                          onChange={(event) =>
                            setRevealSheetConfig((prev) => ({
                              ...prev,
                              showShine: event.target.checked,
                            }))
                          }
                          className="size-4 cursor-pointer accent-black"
                        />
                      </div>
                      {revealSheetConfig.showShine && (
                        <div className="flex min-w-0 flex-col gap-2.5">
                          <span className="text-[11px] text-muted-foreground">
                            Shine direction
                          </span>
                          <SegmentedControlGroup
                            role="group"
                            aria-label="Shine direction"
                            className="w-full min-w-0"
                          >
                            {(["clockwise", "counterclockwise"] as const).map(
                              (direction) => (
                                <button
                                  key={direction}
                                  type="button"
                                  aria-pressed={
                                    revealSheetConfig.shineDirection ===
                                    direction
                                  }
                                  onClick={() =>
                                    setRevealSheetConfig((prev) => ({
                                      ...prev,
                                      shineDirection: direction,
                                    }))
                                  }
                                  className={cn(
                                    "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                                    revealSheetConfig.shineDirection ===
                                      direction
                                      ? "text-white"
                                      : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                                  )}
                                >
                                  {direction === "clockwise"
                                    ? "Clockwise"
                                    : "Counterclockwise"}
                                </button>
                              ),
                            )}
                          </SegmentedControlGroup>
                        </div>
                      )}
                    </div>
                    {revealSheetConfig.showShine && (
                      <div className="min-w-0 space-y-3 border-t border-border pt-3 sm:col-span-2 dark:border-border">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <label
                              htmlFor="reveal-sheet-shine-speed"
                              className="text-muted-foreground"
                            >
                              Shine speed
                            </label>
                            <span className="font-medium tabular-nums text-foreground">
                              {revealSheetConfig.shineSpeed.toFixed(1)}×
                            </span>
                          </div>
                          <CustomizationRange
                            id="reveal-sheet-shine-speed"
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={revealSheetConfig.shineSpeed}
                            onChange={(event) =>
                              setRevealSheetConfig((prev) => ({
                                ...prev,
                                shineSpeed: Number(event.target.value),
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <label
                              htmlFor="reveal-sheet-shine-intensity"
                              className="text-muted-foreground"
                            >
                              Shine intensity
                            </label>
                            <span className="font-medium tabular-nums text-foreground">
                              {Math.round(
                                revealSheetConfig.shineIntensity * 100,
                              )}
                              %
                            </span>
                          </div>
                          <CustomizationRange
                            id="reveal-sheet-shine-intensity"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={revealSheetConfig.shineIntensity}
                            onChange={(event) =>
                              setRevealSheetConfig((prev) => ({
                                ...prev,
                                shineIntensity: Number(event.target.value),
                              }))
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeComponent.slug === "sparkle-button" && (
                <div
                  key="sparkle-customize-panel"
                  className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-foreground dark:text-white/90 tracking-tight">
                      Customize
                    </span>
                    <button
                      type="button"
                      onClick={resetSparkleConfig}
                      className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white/60 px-3 text-xs font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1.5 border-b border-border dark:border-border">
                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium">
                          Variant
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {(["default", "outline", "glass"] as const).map(
                            (v) => (
                              <button
                                key={v}
                                type="button"
                                aria-pressed={sparkleConfig.variant === v}
                                onClick={() =>
                                  setSparkleConfig((prev) => ({
                                    ...prev,
                                    variant: v,
                                  }))
                                }
                                className={cn(
                                  "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 capitalize",
                                  sparkleConfig.variant === v
                                    ? "text-white"
                                    : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                                )}
                              >
                                <span className="relative z-10">{v}</span>
                              </button>
                            ),
                          )}
                        </SegmentedControlGroup>
                      </div>

                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium">
                          Size
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {(["sm", "default", "lg"] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              aria-pressed={sparkleConfig.size === sz}
                              onClick={() =>
                                setSparkleConfig((prev) => ({
                                  ...prev,
                                  size: sz,
                                }))
                              }
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 uppercase",
                                sparkleConfig.size === sz
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">
                                {sz === "default" ? "MD" : sz}
                              </span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                        className="rounded-xl border border-border dark:border-border bg-white/60 dark:bg-white/5 hover:bg-muted dark:hover:bg-[#1f1f25] px-3 py-2 flex items-center justify-between text-xs transition-colors cursor-pointer"
                      >
                        <span className="text-muted-foreground dark:text-zinc-400">
                          Animate By
                        </span>
                        <span className="text-foreground dark:text-zinc-100 font-medium flex items-center gap-3">
                          {sparkleConfig.animateBy === "letters"
                            ? "Letters"
                            : "Words"}
                          <ChevronDownIcon className="w-3.5 h-3.5 text-muted-foreground dark:text-zinc-400" />
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
                        className="rounded-xl border border-border dark:border-border bg-white/60 dark:bg-white/5 hover:bg-muted dark:hover:bg-[#1f1f25] px-3 py-2 flex items-center justify-between text-xs transition-colors cursor-pointer"
                      >
                        <span className="text-muted-foreground dark:text-zinc-400">
                          Direction
                        </span>
                        <span className="text-foreground dark:text-zinc-100 font-medium flex items-center gap-3">
                          {sparkleConfig.direction === "top" ? "Top" : "Bottom"}
                          <ChevronDownIcon className="w-3.5 h-3.5 text-muted-foreground dark:text-zinc-400" />
                        </span>
                      </button>

                      <div className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-white/60 p-3 text-xs dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 shrink-0">
                          Delay
                        </span>

                        <CustomizationRange
                          type="range"
                          aria-label="Delay"
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
                          className="col-span-2 row-start-2"
                        />
                        <span className="col-start-2 row-start-1 rounded-md bg-muted px-2 py-1 text-xs font-semibold tabular-nums text-foreground dark:text-zinc-200">
                          {sparkleConfig.delay}ms
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-white/60 p-3 text-xs dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 shrink-0">
                          Reveal
                        </span>

                        <CustomizationRange
                          type="range"
                          aria-label="Reveal"
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
                          className="col-span-2 row-start-2"
                        />
                        <span className="col-start-2 row-start-1 rounded-md bg-muted px-2 py-1 text-xs font-semibold tabular-nums text-foreground dark:text-zinc-200">
                          {(sparkleConfig.stepDuration * 1000).toFixed(0)}ms
                        </span>
                      </div>

                      <div className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-white/60 p-3 text-xs dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 shrink-0">
                          Dissolve
                        </span>

                        <CustomizationRange
                          type="range"
                          aria-label="Dissolve"
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
                          className="col-span-2 row-start-2"
                        />
                        <span className="col-start-2 row-start-1 rounded-md bg-muted px-2 py-1 text-xs font-semibold tabular-nums text-foreground dark:text-zinc-200">
                          {(sparkleConfig.dissolveDuration * 1000).toFixed(0)}
                          ms
                        </span>
                      </div>

                      <div className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-white/60 p-3 text-xs dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 shrink-0">
                          Stiffness
                        </span>

                        <CustomizationRange
                          type="range"
                          aria-label="Stiffness"
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
                          className="col-span-2 row-start-2"
                        />
                        <span className="col-start-2 row-start-1 rounded-md bg-muted px-2 py-1 text-xs font-semibold tabular-nums text-foreground dark:text-zinc-200">
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
                  className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-foreground dark:text-white/90 tracking-tight">
                      Customize
                    </span>
                    <button
                      type="button"
                      onClick={resetTwitterCardConfig}
                      className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white/60 px-3 text-xs font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex min-w-0 flex-col gap-2.5">
                      <SegmentedControlGroup className="w-full min-w-0">
                        <button
                          type="button"
                          aria-pressed={!twitterCardConfig.staticCard}
                          onClick={() =>
                            setTwitterCardConfig((prev) => ({
                              ...prev,
                              staticCard: false,
                            }))
                          }
                          className={cn(
                            "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                            !twitterCardConfig.staticCard
                              ? "text-white"
                              : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                          )}
                        >
                          <span className="relative z-10">Trigger Popover</span>
                        </button>
                        <button
                          type="button"
                          aria-pressed={twitterCardConfig.staticCard}
                          onClick={() =>
                            setTwitterCardConfig((prev) => ({
                              ...prev,
                              staticCard: true,
                            }))
                          }
                          className={cn(
                            "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                            twitterCardConfig.staticCard
                              ? "text-white"
                              : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                          )}
                        >
                          <span className="relative z-10">Static Card</span>
                        </button>
                      </SegmentedControlGroup>

                      <SegmentedControlGroup className="w-full min-w-0">
                        {["hey_krishnna", "karpathy", "shadcn"].map(
                          (handle) => (
                            <button
                              key={handle}
                              type="button"
                              aria-pressed={
                                twitterCardConfig.username === handle
                              }
                              onClick={() =>
                                setTwitterCardConfig((prev) => ({
                                  ...prev,
                                  username: handle,
                                }))
                              }
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                                twitterCardConfig.username === handle
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              @{handle}
                            </button>
                          ),
                        )}
                      </SegmentedControlGroup>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setTwitterCardConfig((prev) => ({
                            ...prev,
                            enableCardTilt: !prev.enableCardTilt,
                          }))
                        }
                        className="rounded-xl border border-border dark:border-border bg-white/60 dark:bg-white/5 hover:bg-muted dark:hover:bg-[#1f1f25] px-3 py-2 flex items-center justify-between text-xs transition-colors cursor-pointer"
                      >
                        <span className="text-muted-foreground dark:text-zinc-400">
                          Card 3D Tilt
                        </span>
                        <span
                          className={cn(
                            "font-medium",
                            twitterCardConfig.enableCardTilt
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground dark:text-zinc-500",
                          )}
                        >
                          {twitterCardConfig.enableCardTilt
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </button>

                      <div className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-white/60 p-3 text-xs dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 shrink-0">
                          Tilt Angle
                        </span>

                        <CustomizationRange
                          type="range"
                          aria-label="Tilt Angle"
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
                          className="col-span-2 row-start-2"
                        />
                        <span className="col-start-2 row-start-1 rounded-md bg-muted px-2 py-1 text-xs font-semibold tabular-nums text-foreground dark:text-zinc-200">
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
                  className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-foreground dark:text-white/90 tracking-tight">
                      Toast Settings
                    </span>
                    <button
                      type="button"
                      onClick={resetToastConfig}
                      className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white/60 px-3 text-xs font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex min-w-0 flex-col gap-2.5">
                      <span className="text-[11px] text-muted-foreground dark:text-zinc-400">
                        Position
                      </span>
                      <SegmentedControlGroup className="w-full min-w-0">
                        {(
                          [
                            "bottom-right",
                            "bottom-left",
                            "top-right",
                            "top-left",
                          ] as const
                        ).map((pos) => {
                          const isActive = toastConfig.position === pos;
                          return (
                            <button
                              key={pos}
                              type="button"
                              aria-pressed={isActive}
                              onClick={() =>
                                setToastConfig((prev) => ({
                                  ...prev,
                                  position: pos,
                                }))
                              }
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 capitalize",
                                isActive
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">
                                {pos.replace("-", " ")}
                              </span>
                            </button>
                          );
                        })}
                      </SegmentedControlGroup>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-border dark:border-border">
                      <span className="text-[11px] text-muted-foreground dark:text-zinc-400">
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
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full p-0.5 items-center transition-colors duration-200 ease-in-out",
                          toastConfig.richColors
                            ? "bg-black ring-1 ring-inset ring-white/20"
                            : "bg-muted-foreground/30 dark:bg-zinc-800",
                        )}
                      >
                        <motion.span
                          layout
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 32,
                          }}
                          className={cn(
                            "pointer-events-none inline-block h-4 w-4 rounded-full shadow-xs ring-0",
                            toastConfig.richColors
                              ? "translate-x-4 bg-background dark:bg-black"
                              : "translate-x-0 bg-white dark:bg-zinc-400",
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-border dark:border-border">
                      <span className="text-[11px] text-muted-foreground dark:text-zinc-400">
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
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full p-0.5 items-center transition-colors duration-200 ease-in-out",
                          toastConfig.expand
                            ? "bg-black ring-1 ring-inset ring-white/20"
                            : "bg-muted-foreground/30 dark:bg-zinc-800",
                        )}
                      >
                        <motion.span
                          layout
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 32,
                          }}
                          className={cn(
                            "pointer-events-none inline-block h-4 w-4 rounded-full shadow-xs ring-0",
                            toastConfig.expand
                              ? "translate-x-4 bg-background dark:bg-black"
                              : "translate-x-0 bg-white dark:bg-zinc-400",
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {(activeComponent.slug === "animated-theme-toggler" ||
                activeComponent.slug === "theme-toggle" ||
                activeComponent.slug === "theme-toggler") && (
                <div
                  key="theme-toggler-customize-panel"
                  className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-foreground dark:text-white/90 tracking-tight">
                      Theme Toggler Settings
                    </span>
                    <button
                      type="button"
                      onClick={resetThemeTogglerConfig}
                      className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white/60 px-3 text-xs font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex min-w-0 flex-col gap-2.5">
                      <span className="text-[11px] text-muted-foreground dark:text-zinc-400">
                        Transition Shape
                      </span>
                      <SegmentedControlGroup className="w-full min-w-0">
                        {(
                          [
                            "circle",
                            "square",
                            "triangle",
                            "diamond",
                            "hexagon",
                            "star",
                          ] as const
                        ).map((v) => {
                          const isActive = themeTogglerConfig.variant === v;
                          return (
                            <button
                              key={v}
                              type="button"
                              aria-pressed={isActive}
                              onClick={() =>
                                setThemeTogglerConfig((prev) => ({
                                  ...prev,
                                  variant: v,
                                }))
                              }
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 capitalize",
                                isActive
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{v}</span>
                            </button>
                          );
                        })}
                      </SegmentedControlGroup>
                    </div>

                    <div className="flex min-w-0 flex-col gap-2.5">
                      <span className="text-[11px] text-muted-foreground dark:text-zinc-400">
                        Candy Style
                      </span>
                      <SegmentedControlGroup className="w-full min-w-0">
                        {[
                          { label: "Candy", value: true },
                          { label: "Minimal", value: false },
                        ].map((opt) => {
                          const isActive =
                            themeTogglerConfig.candy === opt.value;
                          return (
                            <button
                              key={opt.label}
                              type="button"
                              aria-pressed={isActive}
                              onClick={() =>
                                setThemeTogglerConfig((prev) => ({
                                  ...prev,
                                  candy: opt.value,
                                }))
                              }
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                                isActive
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{opt.label}</span>
                            </button>
                          );
                        })}
                      </SegmentedControlGroup>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-border dark:border-border">
                      <span className="text-[11px] text-muted-foreground dark:text-zinc-400">
                        Emanate from Center
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setThemeTogglerConfig((prev) => ({
                            ...prev,
                            fromCenter: !prev.fromCenter,
                          }))
                        }
                        className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full p-0.5 items-center transition-colors duration-200 ease-in-out",
                          themeTogglerConfig.fromCenter
                            ? "bg-black ring-1 ring-inset ring-white/20"
                            : "bg-muted-foreground/30 dark:bg-zinc-800",
                        )}
                      >
                        <motion.span
                          layout
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 32,
                          }}
                          className={cn(
                            "pointer-events-none inline-block h-4 w-4 rounded-full shadow-xs ring-0",
                            themeTogglerConfig.fromCenter
                              ? "translate-x-4 bg-background dark:bg-black"
                              : "translate-x-0 bg-white dark:bg-zinc-400",
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
                  className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-foreground dark:text-white/90 tracking-tight">
                      Customize
                    </span>
                    <button
                      type="button"
                      onClick={resetOtpConfig}
                      className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white/60 px-3 text-xs font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex min-w-0 flex-col gap-2.5">
                      <SegmentedControlGroup className="w-full min-w-0">
                        {(["idle", "success", "error", "loading"] as const).map(
                          (s) => (
                            <button
                              key={s}
                              type="button"
                              aria-pressed={otpStatus === s}
                              onClick={() => setOtpStatus(s)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 capitalize",
                                otpStatus === s
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{s}</span>
                            </button>
                          ),
                        )}
                      </SegmentedControlGroup>

                      <div className="flex items-center gap-1 bg-muted/80 dark:bg-white/5 p-1 rounded-xl border border-border dark:border-border">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpValue("729481");
                            setOtpStatus("success");
                          }}
                          className="h-7 px-2.5 rounded-xl text-xs text-foreground/80 dark:text-zinc-300 hover:text-foreground dark:hover:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
                        >
                          Auto-fill
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOtpValue("999999");
                            setOtpStatus("error");
                          }}
                          className="h-7 px-2.5 rounded-xl text-xs font-sans text-foreground/80 dark:text-zinc-300 hover:text-foreground dark:hover:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
                        >
                          Error
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOtpValue("");
                            setOtpStatus("idle");
                          }}
                          className="h-7 px-2.5 rounded-xl text-xs font-sans text-foreground/80 dark:text-zinc-300 hover:text-foreground dark:hover:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium">
                          Size
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              aria-pressed={otpSize === sz}
                              onClick={() => setOtpSize(sz)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 uppercase",
                                otpSize === sz
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{sz}</span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>

                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium">
                          Variant
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {(
                            ["default", "glass", "neon", "underlined"] as const
                          ).map((v) => (
                            <button
                              key={v}
                              type="button"
                              aria-pressed={otpVariant === v}
                              onClick={() => setOtpVariant(v)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 capitalize",
                                otpVariant === v
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">
                                {v === "underlined" ? "Underline" : v}
                              </span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>

                      <button
                        type="button"
                        onClick={() => setOtpMask((m) => !m)}
                        className="min-h-12 rounded-xl border border-border dark:border-border bg-white/60 dark:bg-white/5 hover:bg-muted dark:hover:bg-[#1f1f25] px-3 flex items-center justify-between text-xs transition-colors cursor-pointer"
                      >
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium">
                          Mask (•)
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[11px] font-sans uppercase transition-colors",
                            otpMask
                              ? "bg-black ring-1 ring-inset ring-white/20 text-zinc-950 font-semibold"
                              : "bg-muted text-muted-foreground dark:bg-white/5 dark:text-zinc-400",
                          )}
                        >
                          {otpMask ? "ON" : "OFF"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOtpGrouped((g) => !g)}
                        className="min-h-12 rounded-xl border border-border dark:border-border bg-white/60 dark:bg-white/5 hover:bg-muted dark:hover:bg-[#1f1f25] px-3 flex items-center justify-between text-xs transition-colors cursor-pointer"
                      >
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium">
                          3-3 Split
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[11px] font-sans uppercase transition-colors",
                            otpGrouped
                              ? "bg-black ring-1 ring-inset ring-white/20 text-zinc-950 font-semibold"
                              : "bg-muted text-muted-foreground dark:bg-white/5 dark:text-zinc-400",
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
                  className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground dark:text-white/90 tracking-tight">
                        Orb Controls
                      </span>
                      {orbStudioColor && (
                        <span className="text-[10px] uppercase font-sans px-1.5 py-0.5 rounded bg-muted text-muted-foreground dark:bg-white/10 dark:text-zinc-300">
                          {ORB_COLORS.find((c) => c.value === orbStudioColor)
                            ?.label || "Custom"}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={resetOrbConfig}
                      className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white/60 px-3 text-xs font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-col gap-4">
                    <SegmentedControlGroup className="w-full min-w-0">
                      {ORB_STATES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={orbStudioState === s}
                          onClick={() => setOrbStudioState(s)}
                          className={cn(
                            "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 capitalize",
                            orbStudioState === s
                              ? "text-white"
                              : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                          )}
                        >
                          <span className="relative z-10">{s}</span>
                        </button>
                      ))}
                    </SegmentedControlGroup>

                    <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                      <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium px-2.5 shrink-0">
                        Color
                      </span>

                      <SegmentedControlGroup className="w-full min-w-0">
                        {ORB_COLORS.map((c) => {
                          const isSelected = orbStudioColor === c.value;
                          return (
                            <button
                              key={c.label}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => setOrbStudioColor(c.value)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                                isSelected
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span
                                className={cn(
                                  "relative z-10 w-2 h-2 rounded-full shrink-0",
                                  c.value === undefined &&
                                    "border border-zinc-400 dark:border-zinc-500",
                                )}
                                style={{ backgroundColor: c.hex }}
                              />
                              <span className="relative z-10">{c.label}</span>
                            </button>
                          );
                        })}
                      </SegmentedControlGroup>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                          Size
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {[
                            { label: "S", value: 64 },
                            { label: "M", value: 96 },
                            { label: "L", value: 140 },
                            { label: "XL", value: 180 },
                          ].map((sz) => (
                            <button
                              key={sz.label}
                              type="button"
                              aria-pressed={orbStudioSize === sz.value}
                              onClick={() => setOrbStudioSize(sz.value)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                                orbStudioSize === sz.value
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{sz.label}</span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>

                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                          Speed
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {[0.5, 1, 1.5, 2].map((sp) => (
                            <button
                              key={sp}
                              type="button"
                              aria-pressed={orbStudioSpeed === sp}
                              onClick={() => setOrbStudioSpeed(sp)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                                orbStudioSpeed === sp
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{sp}x</span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium">
                          Motion
                        </span>
                        <span className="text-[11px] text-muted-foreground dark:text-zinc-500 font-sans ">
                          {orbStudioPaused ? "Paused" : "Active"}
                        </span>
                      </div>
                      <SegmentedControlGroup className="w-full min-w-0">
                        <button
                          type="button"
                          aria-pressed={!orbStudioPaused}
                          onClick={() => setOrbStudioPaused(false)}
                          className={cn(
                            "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                            !orbStudioPaused
                              ? "text-white"
                              : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                          )}
                        >
                          <span className="relative z-10 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Playing
                          </span>
                        </button>
                        <button
                          type="button"
                          aria-pressed={orbStudioPaused}
                          onClick={() => setOrbStudioPaused(true)}
                          className={cn(
                            "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                            orbStudioPaused
                              ? "text-white"
                              : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                          )}
                        >
                          <span className="relative z-10 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground dark:bg-zinc-400" />
                            Paused
                          </span>
                        </button>
                      </SegmentedControlGroup>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent.slug === "mac-slider" && (
                <div
                  key="mac-slider-customize-panel"
                  className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-foreground dark:text-white/90 tracking-tight">
                      Mac Slider Controls
                    </span>
                    <button
                      type="button"
                      onClick={resetMacSliderConfig}
                      className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white/60 px-3 text-xs font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-col gap-4">
                    <SegmentedControlGroup className="w-full min-w-0">
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
                            dot: "bg-zinc-700 dark:bg-zinc-200",
                          },
                        ] as const
                      ).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          aria-pressed={macSliderColor === c.id}
                          onClick={() => setMacSliderColor(c.id)}
                          className={cn(
                            "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                            macSliderColor === c.id
                              ? "text-white"
                              : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                          )}
                        >
                          <span
                            className={cn(
                              "relative z-10 w-2 h-2 rounded-full shrink-0 shadow-xs",
                              c.dot,
                            )}
                          />
                          <span className="relative z-10 ">{c.label}</span>
                        </button>
                      ))}
                    </SegmentedControlGroup>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                          Size
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {(["sm", "md", "lg"] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              aria-pressed={macSliderSize === sz}
                              onClick={() => setMacSliderSize(sz)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 uppercase",
                                macSliderSize === sz
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{sz}</span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>

                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                          Lens State
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {[
                            { label: "Rest", value: false },
                            { label: "Expanded", value: true },
                          ].map((st) => (
                            <button
                              key={st.label}
                              type="button"
                              aria-pressed={macSliderForceActive === st.value}
                              onClick={() => setMacSliderForceActive(st.value)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                                macSliderForceActive === st.value
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{st.label}</span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                      <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                        Glass Material
                      </span>
                      <SegmentedControlGroup className="w-full min-w-0">
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
                            aria-pressed={macSliderMaterial === m.id}
                            onClick={() => setMacSliderMaterial(m.id)}
                            className={cn(
                              "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                              macSliderMaterial === m.id
                                ? "text-white"
                                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                            )}
                          >
                            <span className="relative z-10">{m.label}</span>
                          </button>
                        ))}
                      </SegmentedControlGroup>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-border dark:border-border">
                      <div className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-white/60 p-3 text-xs dark:bg-white/5">
                        <span className="w-18 shrink-0 text-muted-foreground dark:text-zinc-400 text-[11px] font-medium">
                          Specular
                        </span>

                        <CustomizationRange
                          type="range"
                          aria-label="Specular"
                          min="0"
                          max="1"
                          step="0.01"
                          value={macSliderSpecularOpacity}
                          onChange={(e) =>
                            setMacSliderSpecularOpacity(
                              parseFloat(e.target.value),
                            )
                          }
                          className="col-span-2 row-start-2"
                        />
                        <span className="col-start-2 row-start-1 rounded-md bg-muted px-2 py-1 text-xs font-semibold tabular-nums text-foreground dark:text-zinc-200">
                          {macSliderSpecularOpacity.toFixed(2)}
                        </span>
                      </div>

                      <div className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-white/60 p-3 text-xs dark:bg-white/5">
                        <span className="w-18 shrink-0 text-muted-foreground dark:text-zinc-400 text-[11px] font-medium">
                          Saturation
                        </span>

                        <CustomizationRange
                          type="range"
                          aria-label="Saturation"
                          min="0"
                          max="50"
                          step="1"
                          value={macSliderSpecularSaturation}
                          onChange={(e) =>
                            setMacSliderSpecularSaturation(
                              parseFloat(e.target.value),
                            )
                          }
                          className="col-span-2 row-start-2"
                        />
                        <span className="col-start-2 row-start-1 rounded-md bg-muted px-2 py-1 text-xs font-semibold tabular-nums text-foreground dark:text-zinc-200">
                          {macSliderSpecularSaturation}
                        </span>
                      </div>

                      <div className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-white/60 p-3 text-xs dark:bg-white/5">
                        <span className="w-18 shrink-0 text-muted-foreground dark:text-zinc-400 text-[11px] font-medium">
                          Refraction
                        </span>

                        <CustomizationRange
                          type="range"
                          aria-label="Refraction"
                          min="0"
                          max="1"
                          step="0.01"
                          value={macSliderRefractionLevel}
                          onChange={(e) =>
                            setMacSliderRefractionLevel(
                              parseFloat(e.target.value),
                            )
                          }
                          className="col-span-2 row-start-2"
                        />
                        <span className="col-start-2 row-start-1 rounded-md bg-muted px-2 py-1 text-xs font-semibold tabular-nums text-foreground dark:text-zinc-200">
                          {macSliderRefractionLevel.toFixed(2)}
                        </span>
                      </div>

                      <div className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-white/60 p-3 text-xs dark:bg-white/5">
                        <span className="w-18 shrink-0 text-muted-foreground dark:text-zinc-400 text-[11px] font-medium">
                          Blur
                        </span>

                        <CustomizationRange
                          type="range"
                          aria-label="Blur"
                          min="0"
                          max="40"
                          step="0.5"
                          value={macSliderBlurLevel}
                          onChange={(e) =>
                            setMacSliderBlurLevel(parseFloat(e.target.value))
                          }
                          className="col-span-2 row-start-2"
                        />
                        <span className="col-start-2 row-start-1 rounded-md bg-muted px-2 py-1 text-xs font-semibold tabular-nums text-foreground dark:text-zinc-200">
                          {macSliderBlurLevel.toFixed(1)}px
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent.slug === "slider" && (
                <div
                  key="slider-customize-panel"
                  className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-foreground dark:text-white/90 tracking-tight">
                      Slider Controls & Ideations
                    </span>
                    <button
                      type="button"
                      onClick={resetSliderConfig}
                      className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white/60 px-3 text-xs font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-col gap-4">
                    <SegmentedControlGroup className="w-full min-w-0">
                      {(
                        [
                          { id: "both", label: "Both Ideations" },
                          { id: "budget", label: "Budget Range" },
                          { id: "volume", label: "Volume Control" },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          aria-pressed={sliderIdeation === tab.id}
                          onClick={() => setSliderIdeation(tab.id)}
                          className={cn(
                            "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                            sliderIdeation === tab.id
                              ? "text-white"
                              : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                          )}
                        >
                          <span className="relative z-10">{tab.label}</span>
                        </button>
                      ))}
                    </SegmentedControlGroup>

                    <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground dark:text-zinc-400">
                          Status:
                        </span>
                        <button
                          type="button"
                          onClick={() => setSliderDisabled(!sliderDisabled)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border",
                            sliderDisabled
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                          )}
                        >
                          {sliderDisabled ? "Disabled" : "Active"}
                        </button>
                      </div>

                      {sliderIdeation !== "volume" && (
                        <div className="flex items-center gap-3 text-muted-foreground dark:text-zinc-400">
                          <span>Range:</span>
                          <span className="font-medium text-foreground dark:text-zinc-200 tabular-nums">
                            ${sliderBudget[0].toLocaleString()} – $
                            {sliderBudget[1].toLocaleString()}
                          </span>
                        </div>
                      )}

                      {sliderIdeation !== "budget" && (
                        <div className="flex items-center gap-3 text-muted-foreground dark:text-zinc-400">
                          <span>Volume:</span>
                          <span className="font-medium text-foreground dark:text-zinc-200 tabular-nums">
                            {sliderVolume}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeComponent.slug === "mac-switch" && (
                <div
                  key="mac-switch-color-palette"
                  data-customization-palette={7}
                  className="flex min-w-0 flex-col gap-3 p-3 font-sans sm:p-4"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    Accent color
                  </span>
                  <ColorSwatches
                    options={
                      [
                        { value: "green", label: "Green", color: "#34C759" },
                        { value: "blue", label: "Blue", color: "#007AFF" },
                        { value: "purple", label: "Purple", color: "#AF52DE" },
                        { value: "orange", label: "Orange", color: "#FF9500" },
                        { value: "pink", label: "Pink", color: "#FF2D55" },
                        { value: "amber", label: "Amber", color: "#FFCC00" },
                        {
                          value: "monochrome",
                          label: "Graphite",
                          color: "#8E8E93",
                        },
                      ] as const
                    }
                    value={macSwitchColor}
                    onChange={setMacSwitchColor}
                  />
                </div>
              )}

              {activeComponent.slug === "task-card" && (
                <TaskCardControls
                  config={taskCardConfig}
                  onChange={setTaskCardConfig}
                  selectedId={selectedTaskCard}
                  onSelect={setSelectedTaskCard}
                />
              )}
              {activeComponent.slug === "flip-clock" && (
                <FlipClockControls
                  config={flipClockConfig}
                  onChange={setFlipClockConfig}
                />
              )}

              {activeComponent.slug === "orbit-gallery" && (
                <OrbitGalleryControls
                  config={orbitGalleryConfig}
                  onChange={setOrbitGalleryConfig}
                />
              )}

              {activeComponent.slug === "project-reveal" && (
                <ProjectRevealControls
                  config={projectRevealConfig}
                  onChange={setProjectRevealConfig}
                />
              )}

              {activeComponent.slug === "liquid-media" && (
                <div
                  key="liquid-media-customize-panel"
                  className="pointer-events-auto flex w-full max-w-2xl flex-col gap-5 p-3 font-sans sm:p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                        Liquid distortion
                      </h3>
                      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                        Shape the flow. Make it your own.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={resetLiquidMediaConfig}
                      className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white/60 px-3 text-xs font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      <ResetIcon className="size-3.5" aria-hidden="true" />
                      Reset
                    </button>
                  </div>

                  <fieldset className="min-w-0">
                    <legend className="mb-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Motion preset
                    </legend>
                    <SegmentedControl
                      options={LIQUID_MEDIA_PRESETS.map((preset) => ({
                        value: preset.id,
                        label: preset.label,
                      }))}
                      value={liquidMediaConfig.preset}
                      onChange={(value) => {
                        const preset = LIQUID_MEDIA_PRESETS.find(
                          (preset) => preset.id === value,
                        );
                        if (preset) applyLiquidMediaPreset(preset);
                      }}
                      className="grid-cols-2 sm:grid-cols-4"
                    />
                  </fieldset>

                  <fieldset className="min-w-0">
                    <legend className="mb-2.5 flex w-full items-center justify-between gap-3">
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        Fine tune
                      </span>
                      <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground dark:text-zinc-200">
                        {liquidMediaConfig.preset === "custom"
                          ? "Custom"
                          : LIQUID_MEDIA_PRESETS.find(
                              (preset) =>
                                preset.id === liquidMediaConfig.preset,
                            )?.label}
                      </span>
                    </legend>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {(
                        [
                          {
                            key: "intensity",
                            label: "Distortion intensity",
                            min: 0.05,
                            max: 0.8,
                            step: 0.01,
                            format: (value: number) => value.toFixed(2),
                          },
                          {
                            key: "radius",
                            label: "Ripple radius",
                            min: 5,
                            max: 30,
                            step: 1,
                            format: (value: number) => String(value),
                          },
                          {
                            key: "expandRate",
                            label: "Expansion speed",
                            min: 4,
                            max: 25,
                            step: 1,
                            format: (value: number) => `${value}×`,
                          },
                          {
                            key: "decayRate",
                            label: "Dissipation decay",
                            min: 1,
                            max: 8,
                            step: 0.2,
                            format: (value: number) => value.toFixed(1),
                          },
                        ] as const
                      ).map((control) => {
                        const value = liquidMediaConfig[control.key];

                        return (
                          <label
                            key={control.key}
                            className="flex min-w-0 flex-col gap-2 rounded-xl border border-border bg-white/60 px-3.5 pb-2.5 pt-3.5 dark:bg-white/5"
                          >
                            <span className="flex items-center justify-between gap-3">
                              <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                                {control.label}
                              </span>
                              <span className="min-w-11 shrink-0 rounded-md bg-muted px-2 py-1 text-center text-xs font-semibold tabular-nums text-foreground dark:text-zinc-200">
                                {control.format(value)}
                              </span>
                            </span>
                            <CustomizationRange
                              type="range"
                              aria-label={control.label}
                              aria-valuetext={control.format(value)}
                              min={control.min}
                              max={control.max}
                              step={control.step}
                              value={value}
                              onChange={(event) =>
                                setLiquidMediaConfig((prev) => ({
                                  ...prev,
                                  preset: "custom",
                                  [control.key]: Number(event.target.value),
                                }))
                              }
                            />
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
                    <fieldset className="min-w-0">
                      <legend className="mb-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        Source image
                      </legend>
                      <SegmentedControl
                        options={(
                          ["portrait", "architecture", "ocean"] as const
                        ).map((image) => ({
                          value: image,
                          label: LIQUID_MEDIA_IMAGES[image].label,
                        }))}
                        value={liquidMediaConfig.image}
                        onChange={(image) =>
                          setLiquidMediaConfig((prev) => ({
                            ...prev,
                            image,
                            caption: LIQUID_MEDIA_IMAGES[image].caption,
                          }))
                        }
                        className="grid-cols-3 gap-1 p-1 [&_button]:text-[11px]"
                      />
                    </fieldset>

                    <fieldset className="min-w-0">
                      <legend className="mb-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        Display
                      </legend>
                      <div className="grid grid-cols-2 gap-2">
                        {(
                          [
                            { key: "showCaption", label: "Caption" },
                            { key: "webglEnabled", label: "Liquid effect" },
                          ] as const
                        ).map((option) => {
                          const enabled = liquidMediaConfig[option.key];
                          return (
                            <button
                              key={option.key}
                              type="button"
                              role="switch"
                              aria-checked={enabled}
                              aria-label={option.label}
                              onClick={() =>
                                setLiquidMediaConfig((prev) => ({
                                  ...prev,
                                  [option.key]: !prev[option.key],
                                }))
                              }
                              className="flex min-h-12.5 min-w-0 cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-white/60 px-2.5 text-[11px] font-medium text-foreground/80 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
                            >
                              {option.label}
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "flex h-4 w-7 shrink-0 items-center rounded-full p-0.5",
                                  enabled
                                    ? "bg-black ring-1 ring-inset ring-white/20"
                                    : "bg-zinc-300 dark:bg-zinc-700",
                                )}
                              >
                                <span
                                  className={cn(
                                    "size-3 rounded-full bg-white shadow-sm",
                                    enabled && "translate-x-3",
                                  )}
                                />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                </div>
              )}

              {activeComponent.slug === "liquid-toggle" && (
                <div
                  key="liquid-toggle-customize-panel"
                  className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-foreground dark:text-white/90 tracking-tight">
                      Liquid Toggle Controls
                    </span>
                    <button
                      type="button"
                      onClick={resetLiquidConfig}
                      className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white/60 px-3 text-xs font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-col gap-4">
                    <SegmentedControlGroup className="w-full min-w-0">
                      {(
                        [
                          {
                            id: "monochrome",
                            label: "Monochrome",
                            dot: "bg-zinc-700 dark:bg-zinc-200",
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
                          aria-pressed={liquidColor === c.id}
                          onClick={() => setLiquidColor(c.id)}
                          className={cn(
                            "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                            liquidColor === c.id
                              ? "text-white"
                              : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                          )}
                        >
                          <span
                            className={cn(
                              "relative z-10 w-2 h-2 rounded-full shrink-0 shadow-xs",
                              c.dot,
                            )}
                          />
                          <span className="relative z-10">{c.label}</span>
                        </button>
                      ))}
                    </SegmentedControlGroup>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                          State
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {[
                            { label: "OFF", value: false },
                            { label: "ON", value: true },
                          ].map((st) => (
                            <button
                              key={st.label}
                              type="button"
                              aria-pressed={liquidChecked === st.value}
                              onClick={() => setLiquidChecked(st.value)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                                liquidChecked === st.value
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{st.label}</span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>

                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                          Size
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {(["sm", "md", "lg"] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              aria-pressed={liquidSize === sz}
                              onClick={() => setLiquidSize(sz)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 uppercase",
                                liquidSize === sz
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{sz}</span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>

                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                          Viscosity
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {(["fluid", "jelly"] as const).map((v) => (
                            <button
                              key={v}
                              type="button"
                              aria-pressed={liquidViscosity === v}
                              onClick={() => setLiquidViscosity(v)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 capitalize",
                                liquidViscosity === v
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{v}</span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent.slug === "gooey-nav" && (
                <div
                  key="gooey-nav-customize-panel"
                  className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-foreground dark:text-white/90 tracking-tight">
                      Gooey Nav Controls
                    </span>
                    <button
                      type="button"
                      onClick={resetGooeyNavConfig}
                      className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white/60 px-3 text-xs font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-col gap-4">
                    <SegmentedControlGroup className="w-full min-w-0">
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
                            dot: "bg-zinc-700 dark:bg-zinc-200",
                          },
                        ] as const
                      ).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          aria-pressed={gooeyNavColor === c.id}
                          onClick={() => setGooeyNavColor(c.id)}
                          className={cn(
                            "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                            gooeyNavColor === c.id
                              ? "text-white"
                              : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                          )}
                        >
                          <span
                            className={cn(
                              "relative z-10 w-2 h-2 rounded-full shrink-0 shadow-xs",
                              c.dot,
                            )}
                          />
                          <span className="relative z-10">{c.label}</span>
                        </button>
                      ))}
                    </SegmentedControlGroup>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                          Size
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {(["xs", "sm", "md", "lg"] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              aria-pressed={gooeyNavSize === sz}
                              onClick={() => setGooeyNavSize(sz)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 uppercase",
                                gooeyNavSize === sz
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{sz}</span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>

                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                          Variant
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {(["solid", "glow", "glass"] as const).map((v) => (
                            <button
                              key={v}
                              type="button"
                              aria-pressed={gooeyNavVariant === v}
                              onClick={() => setGooeyNavVariant(v)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 capitalize",
                                gooeyNavVariant === v
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{v}</span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>

                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                          Motion
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {(["fluid", "elastic"] as const).map((e) => (
                            <button
                              key={e}
                              type="button"
                              aria-pressed={gooeyNavElasticity === e}
                              onClick={() => setGooeyNavElasticity(e)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 capitalize",
                                gooeyNavElasticity === e
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{e}</span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent.slug === "noise" && (
                <div
                  key="noise-customize-panel"
                  className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-foreground dark:text-white/90 tracking-tight">
                      Noise Background Controls
                    </span>
                    <button
                      type="button"
                      onClick={resetNoiseConfig}
                      className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white/60 px-3 text-xs font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-col gap-4">
                    <SegmentedControlGroup className="w-full min-w-0">
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
                          aria-pressed={noiseMode === m.id}
                          onClick={() => setNoiseMode(m.id)}
                          className={cn(
                            "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                            noiseMode === m.id
                              ? "text-white"
                              : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                          )}
                        >
                          <span className="relative z-10">{m.label}</span>
                        </button>
                      ))}
                    </SegmentedControlGroup>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                          Alpha
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {([10, 25, 50, 80] as const).map((a) => (
                            <button
                              key={a}
                              type="button"
                              aria-pressed={noiseAlpha === a}
                              onClick={() => setNoiseAlpha(a)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                                noiseAlpha === a
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{a}</span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>

                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                          Scale
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {([1, 2, 4] as const).map((s) => (
                            <button
                              key={s}
                              type="button"
                              aria-pressed={noiseScale === s}
                              onClick={() => setNoiseScale(s)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                                noiseScale === s
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{s}x</span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>

                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                          Interval
                        </span>
                        <SegmentedControlGroup className="w-full min-w-0">
                          {([1, 2, 4] as const).map((iv) => (
                            <button
                              key={iv}
                              type="button"
                              aria-pressed={noiseInterval === iv}
                              onClick={() => setNoiseInterval(iv)}
                              className={cn(
                                "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                                noiseInterval === iv
                                  ? "text-white"
                                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                              )}
                            >
                              <span className="relative z-10">{iv}f</span>
                            </button>
                          ))}
                        </SegmentedControlGroup>
                      </div>

                      <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-white/60 p-3 dark:bg-white/5">
                        <span className="text-muted-foreground dark:text-zinc-400 text-xs font-medium shrink-0">
                          Effects
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            aria-pressed={noiseVignette}
                            onClick={() => setNoiseVignette(!noiseVignette)}
                            className={cn(
                              "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                              noiseVignette
                                ? "bg-black text-white ring-1 ring-inset ring-white/20"
                                : "border border-border bg-white/60 text-zinc-600 hover:text-zinc-950 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-zinc-50",
                            )}
                          >
                            Vignette
                          </button>
                          <button
                            type="button"
                            aria-pressed={noiseScanlines}
                            onClick={() => setNoiseScanlines(!noiseScanlines)}
                            className={cn(
                              "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                              noiseScanlines
                                ? "bg-black text-white ring-1 ring-inset ring-white/20"
                                : "border border-border bg-white/60 text-zinc-600 hover:text-zinc-950 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-zinc-50",
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
                  className="pointer-events-auto flex w-full min-w-0 flex-col gap-5 p-3 font-sans sm:p-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-foreground dark:text-white/90 tracking-tight">
                      AI Input Controls
                    </span>
                    <button
                      type="button"
                      onClick={resetAiInputConfig}
                      className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white/60 px-3 text-xs font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      <ResetIcon className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex min-w-0 flex-col gap-2.5">
                      <SegmentedControlGroup className="w-full min-w-0">
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
                            aria-pressed={aiInputVariant === v.id}
                            onClick={() => setAiInputVariant(v.id)}
                            className={cn(
                              "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                              aiInputVariant === v.id
                                ? "text-white"
                                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                            )}
                          >
                            <span className="relative z-10">{v.label}</span>
                          </button>
                        ))}
                      </SegmentedControlGroup>

                      <SegmentedControlGroup className="w-full min-w-0">
                        {[
                          { label: "Compact", value: 380 },
                          { label: "Default", value: 480 },
                          { label: "Wide", value: 560 },
                          { label: "Full", value: 640 },
                        ].map((sz) => (
                          <button
                            key={sz.value}
                            type="button"
                            aria-pressed={aiInputMaxWidth === sz.value}
                            onClick={() => setAiInputMaxWidth(sz.value)}
                            className={cn(
                              "relative z-10 flex min-h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
                              aiInputMaxWidth === sz.value
                                ? "text-white"
                                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
                            )}
                          >
                            <span className="relative z-10">{sz.label}</span>
                          </button>
                        ))}
                      </SegmentedControlGroup>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button
                        type="button"
                        onClick={() => setAiInputAllowAttachments((v) => !v)}
                        className={cn(
                          "h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                          aiInputAllowAttachments
                            ? "border-foreground/20 bg-muted text-foreground dark:text-zinc-200"
                            : "border-border bg-white/60 text-muted-foreground hover:text-foreground dark:bg-white/5 dark:text-zinc-400 dark:hover:text-zinc-200",
                        )}
                      >
                        <span>Attachments</span>
                        <span className="text-[10px] font-sans uppercase">
                          {aiInputAllowAttachments ? "ON" : "OFF"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAiInputAllowVoice((v) => !v)}
                        className={cn(
                          "h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                          aiInputAllowVoice
                            ? "border-foreground/20 bg-muted text-foreground dark:text-zinc-200"
                            : "border-border bg-white/60 text-muted-foreground hover:text-foreground dark:bg-white/5 dark:text-zinc-400 dark:hover:text-zinc-200",
                        )}
                      >
                        <span>Voice</span>
                        <span className="text-[10px] font-sans uppercase">
                          {aiInputAllowVoice ? "ON" : "OFF"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAiInputAllowModelSelect((v) => !v)}
                        className={cn(
                          "h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                          aiInputAllowModelSelect
                            ? "border-foreground/20 bg-muted text-foreground dark:text-zinc-200"
                            : "border-border bg-white/60 text-muted-foreground hover:text-foreground dark:bg-white/5 dark:text-zinc-400 dark:hover:text-zinc-200",
                        )}
                      >
                        <span>Models</span>
                        <span className="text-[10px] font-sans uppercase">
                          {aiInputAllowModelSelect ? "ON" : "OFF"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAiInputAllowEffortSelect((v) => !v)}
                        className={cn(
                          "h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                          aiInputAllowEffortSelect
                            ? "border-foreground/20 bg-muted text-foreground dark:text-zinc-200"
                            : "border-border bg-white/60 text-muted-foreground hover:text-foreground dark:bg-white/5 dark:text-zinc-400 dark:hover:text-zinc-200",
                        )}
                      >
                        <span>Effort</span>
                        <span className="text-[10px] font-sans uppercase">
                          {aiInputAllowEffortSelect ? "ON" : "OFF"}
                        </span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-0.5">
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
                        className="h-7 px-2.5 rounded-xl border border-border dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-muted dark:hover:bg-white/10 hover:border-foreground/20 dark:hover:border-white/20 text-xs font-medium text-foreground/80 dark:text-zinc-300 hover:text-foreground dark:hover:text-white transition-all flex items-center gap-3 cursor-pointer"
                      >
                        <PlusIcon className="w-3.5 h-3.5 text-muted-foreground dark:text-zinc-400" />
                        <span>Attach Mockup</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          promptInputRef.current?.startVoice();
                        }}
                        className="h-7 px-2.5 rounded-xl border border-border dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-muted dark:hover:bg-white/10 hover:border-foreground/20 dark:hover:border-white/20 text-xs font-medium text-foreground/80 dark:text-zinc-300 hover:text-foreground dark:hover:text-white transition-all flex items-center gap-3 cursor-pointer"
                      >
                        <span>Simulate Voice</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          promptInputRef.current?.expand();
                          promptInputRef.current?.focus();
                        }}
                        className="h-7 px-2.5 rounded-xl border border-border dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-muted dark:hover:bg-white/10 hover:border-foreground/20 dark:hover:border-white/20 text-xs font-medium text-foreground/80 dark:text-zinc-300 hover:text-foreground dark:hover:text-white transition-all flex items-center gap-3 cursor-pointer"
                      >
                        <span>Expand Composer</span>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-border dark:border-border">
                      <div className="flex flex-wrap items-center gap-2 py-0.5">
                        <span className="text-[11px] text-muted-foreground dark:text-zinc-500 shrink-0 font-medium pl-1">
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
                            className="min-h-9 rounded-lg border border-border bg-white/60 px-2.5 py-2 text-left text-[11px] text-foreground/80 hover:bg-muted dark:bg-white/5 dark:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
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
                          className="h-6 px-2 rounded-md text-[11px] text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CustomizationDock>
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
                  className="absolute inset-x-2 bottom-2 top-10 z-40 rounded-2xl border border-border bg-card dark:bg-[#0a0a0c] shadow-[0_-20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_-20px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
                >
                  <div className="pt-2.5 pb-1 flex justify-center shrink-0 cursor-grab active:cursor-grabbing">
                    <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                  </div>

                  <div className="px-5 pb-3 border-b border-border flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {activeComponent.files.map((file, idx) => (
                        <button
                          key={file.name}
                          type="button"
                          onClick={() => setSelectedFileIndex(idx)}
                          className={cn(
                            "relative px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer",
                            idx === selectedFileIndex
                              ? "text-foreground font-medium"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {idx === selectedFileIndex && (
                            <motion.div
                              layoutId="active-code-tab"
                              transition={microSpring}
                              className="absolute inset-0 bg-muted border border-border rounded-lg"
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
                        onClick={() => handleInstallCopy()}
                        className="border border-border bg-card dark:bg-[#18181b] hover:bg-muted dark:hover:bg-[#222226] text-muted-foreground hover:text-foreground dark:text-zinc-300 dark:hover:text-white px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        {installCopied ? (
                          <>
                            <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <span>
                            {installTool === "npx"
                              ? "npm i"
                              : `${installTool} add`}
                          </span>
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.94 }}
                        transition={microSpring}
                        type="button"
                        onClick={handleCodeCopy}
                        className="w-8 h-8 rounded-lg border border-border bg-card dark:bg-[#18181b] hover:bg-muted dark:hover:bg-[#222226] text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
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
                        className="w-8 h-8 rounded-lg border border-border bg-card dark:bg-[#18181b] hover:bg-muted dark:hover:bg-[#222226] text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Close (Esc)"
                      >
                        <Cross2Icon className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-6 py-2 bg-[#0c0c0f] border-b border-border/40 text-xs font-mono">
                    <div className="flex items-center gap-2 text-zinc-400 min-w-0">
                      <span className="text-orange-400 select-none font-bold">
                        $
                      </span>
                      <span className="text-zinc-200 truncate select-all">
                        {getInstallCommand(activeComponent.slug, installTool)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInstallCopy()}
                      className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                    >
                      {installCopied ? (
                        <>
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
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
              animate={{ width: 490, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={panelSpring}
              className="shrink-0 h-full border border-border bg-card dark:bg-[#0c0c0e] rounded-3xl overflow-hidden flex flex-col"
            >
              <div className="w-122.5 min-w-122.5 h-full p-6 sm:p-7 overflow-y-auto flex flex-col gap-6 scrollbar-none pb-12">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  transition={{ staggerChildren: 0.05 }}
                  className="space-y-6"
                >
                  <motion.div
                    variants={fadeVariants}
                    className="flex items-center justify-between pb-2 border-b border-border"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                        {activeComponent.slug.replace("-", " ")}
                      </span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                        {getCategoryLabel(activeComponent.category)}
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
                      className="w-7 h-7 rounded-lg border border-border hover:border-foreground/20 bg-muted/60 dark:bg-zinc-900 text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center"
                      title="Close (Esc)"
                    >
                      <Cross2Icon className="w-3.5 h-3.5" />
                    </motion.button>
                  </motion.div>

                  <motion.div variants={fadeVariants} className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-serif text-foreground tracking-tight leading-snug">
                      {activeComponent.name}
                    </h2>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      {activeComponent.description}
                    </p>
                    {activeComponent.summary && (
                      <p className="text-xs text-muted-foreground font-light leading-relaxed pt-1">
                        {activeComponent.summary}
                      </p>
                    )}
                  </motion.div>

                  {activeComponent.highlights &&
                    activeComponent.highlights.length > 0 && (
                      <motion.div
                        variants={fadeVariants}
                        className="space-y-2.5 pt-4 border-t border-border"
                      >
                        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          Capabilities & Highlights
                        </div>
                        <div className="space-y-1.5">
                          {activeComponent.highlights.map((h, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs text-foreground font-light leading-relaxed"
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
                        className="space-y-2.5 pt-4 border-t border-border"
                      >
                        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          Component Anatomy
                        </div>
                        <div className="border border-border rounded-xl bg-muted/40 p-3 space-y-1 font-mono text-[11px]">
                          {activeComponent.anatomy.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-foreground"
                            >
                              <span className="text-muted-foreground text-[10px] w-3 shrink-0 text-right">
                                {idx + 1}
                              </span>
                              <span className="text-muted-foreground">→</span>
                              <span className="text-foreground font-mono text-[11px]">
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
                      className="space-y-3 pt-4 border-t border-border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          Motion & Interaction Spec
                        </div>
                        <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                          {activeComponent.physics.engine}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-light leading-relaxed">
                        {activeComponent.physics.description}
                      </p>
                      {activeComponent.physics.parameters && (
                        <div className="border border-border rounded-xl overflow-hidden bg-muted/40">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-muted border-b border-border text-muted-foreground font-mono text-[10px] uppercase">
                              <tr>
                                <th className="p-2.5 font-medium">Parameter</th>
                                <th className="p-2.5 font-medium">Value</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border font-mono text-[11px]">
                              {activeComponent.physics.parameters.map(
                                (param) => (
                                  <tr
                                    key={param.label}
                                    className="hover:bg-muted/50 transition-colors"
                                  >
                                    <td className="p-2.5 text-muted-foreground">
                                      {param.label}
                                    </td>
                                    <td className="p-2.5 text-foreground">
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
                        className="space-y-3 pt-4 border-t border-border"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                              Props Interface
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20 font-medium">
                              {activeComponent.props.length}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground/60">
                            TypeScript
                          </span>
                        </div>
                        <div className="border border-border/80 dark:border-white/10 rounded-xl overflow-x-auto bg-card/60 dark:bg-zinc-950/60 shadow-xs">
                          <table className="w-full text-left text-xs min-w-140 border-collapse">
                            <thead className="bg-muted/70 dark:bg-white/3 border-b border-border/80 dark:border-white/10 text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
                              <tr>
                                <th className="py-2.5 px-3 font-medium w-[22%] min-w-27.5">
                                  Prop
                                </th>
                                <th className="py-2.5 px-3 font-medium w-[26%] min-w-35">
                                  Type
                                </th>
                                <th className="py-2.5 px-3 font-medium w-[22%] min-w-30">
                                  Default
                                </th>
                                <th className="py-2.5 px-3 font-medium w-[30%] min-w-47.5">
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60 dark:divide-white/5 text-xs">
                              {activeComponent.props.map((p) => (
                                <tr
                                  key={p.name}
                                  className="hover:bg-muted/40 dark:hover:bg-white/2 transition-colors align-top"
                                >
                                  <td className="py-3 px-3 font-mono">
                                    <div className="flex flex-col items-start gap-1">
                                      <code className="bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/25 px-1.5 py-0.5 rounded text-orange-600 dark:text-orange-400 text-[11px] font-medium font-mono whitespace-nowrap">
                                        {p.name}
                                      </code>
                                      {p.required ? (
                                        <span className="text-[9px] uppercase tracking-wider text-rose-500 dark:text-rose-400 font-medium font-mono bg-rose-500/10 px-1 py-0.2 rounded">
                                          Required
                                        </span>
                                      ) : (
                                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50 font-mono">
                                          Optional
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-3 align-top whitespace-normal">
                                    <code className="text-[11px] font-mono text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/20 px-1.5 py-0.5 rounded inline-block wrap-break-word max-w-50 leading-relaxed">
                                      {p.type}
                                    </code>
                                  </td>
                                  <td className="py-3 px-3 align-top font-mono text-[11px]">
                                    {p.defaultValue &&
                                    p.defaultValue !== "undefined" ? (
                                      <code
                                        className="text-muted-foreground dark:text-zinc-400 bg-muted/80 dark:bg-white/5 border border-border/80 dark:border-white/10 px-1.5 py-0.5 rounded inline-block max-w-32.5 truncate align-middle"
                                        title={p.defaultValue}
                                      >
                                        {p.defaultValue}
                                      </code>
                                    ) : (
                                      <span className="text-muted-foreground/40 font-mono text-[11px] select-none">
                                        —
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-3 text-foreground/85 dark:text-zinc-300 font-sans font-light leading-relaxed text-xs align-top">
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
                      className="space-y-3 pt-4 border-t border-border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          Accessibility & Shortcuts
                        </div>
                        {activeComponent.accessibility.role && (
                          <span className="text-[10px] font-mono text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded">
                            role=&quot;{activeComponent.accessibility.role}
                            &quot;
                          </span>
                        )}
                      </div>
                      {activeComponent.accessibility.aria && (
                        <p className="text-xs text-muted-foreground font-light leading-relaxed">
                          {activeComponent.accessibility.aria}
                        </p>
                      )}
                      {activeComponent.accessibility.keyboard &&
                        activeComponent.accessibility.keyboard.length > 0 && (
                          <div className="border border-border rounded-xl overflow-hidden bg-muted/40">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-muted border-b border-border text-muted-foreground font-mono text-[10px] uppercase">
                                <tr>
                                  <th className="p-2.5 font-medium">Key</th>
                                  <th className="p-2.5 font-medium">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border text-xs">
                                {activeComponent.accessibility.keyboard.map(
                                  (kb) => (
                                    <tr
                                      key={kb.key}
                                      className="hover:bg-muted/50 transition-colors align-top"
                                    >
                                      <td className="p-2.5 font-mono">
                                        <kbd className="bg-muted border border-border px-1.5 py-0.5 rounded text-foreground text-[11px]">
                                          {kb.key}
                                        </kbd>
                                      </td>
                                      <td className="p-2.5 text-foreground font-sans font-light leading-relaxed">
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
                        <div className="flex items-start gap-2 text-xs text-muted-foreground font-light leading-relaxed bg-muted border border-border rounded-lg p-2.5">
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
                      className="space-y-3 pt-4 border-t border-border"
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        Integration & Best Practices
                      </div>
                      {activeComponent.guidelines.recommended && (
                        <div className="space-y-1.5">
                          <div className="text-[10px] font-mono uppercase text-muted-foreground">
                            Recommended Use
                          </div>
                          {activeComponent.guidelines.recommended.map(
                            (rec, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-xs text-foreground font-light leading-relaxed"
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
                          <div className="text-[10px] font-mono uppercase text-muted-foreground">
                            Best Practices
                          </div>
                          {activeComponent.guidelines.bestPractices.map(
                            (bp, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-xs text-foreground font-light leading-relaxed"
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
                    className="space-y-2.5 pt-4 border-t border-border"
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Dependencies & Source
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeComponent.dependencies.map((dep) => (
                        <span
                          key={dep}
                          className="inline-flex items-center gap-1.5 border border-border bg-muted px-3 py-1 text-xs font-mono text-foreground rounded-lg"
                        >
                          <span className="text-orange-500/70">~</span>
                          {dep}
                        </span>
                      ))}
                    </div>
                    {activeComponent.files && activeComponent.files[0] && (
                      <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground bg-muted/40 border border-border rounded-lg px-3 py-2 mt-2">
                        <span>Source File</span>
                        <span className="text-foreground">
                          {activeComponent.files[0].path}
                        </span>
                      </div>
                    )}
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground pt-2">
                      Install via CLI
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-muted/40 border border-border rounded-lg font-mono text-xs">
                      <div className="flex items-center gap-1.5 min-w-0 pr-2">
                        <span className="text-orange-500 select-none font-bold">
                          $
                        </span>
                        <span className="text-foreground truncate select-all">
                          {`npx @devclubnst/ui add ${activeComponent.slug}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInstallCopy("npx")}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                        title="Copy command"
                      >
                        {copiedToolKey === "npx" ? (
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <CopyIcon className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
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
