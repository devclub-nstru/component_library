import { ComponentRegistryItem } from "@/types/component";

export const COMPONENT_REGISTRY: Record<string, ComponentRegistryItem> = {
  scales: {
    slug: "scales",
    name: "Scales & Borders",
    description: "Symmetric repeating linear gradient borders and geometric scale dividers.",
    category: "scales",
    tags: ["borders", "scales", "divider", "linear-gradient"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    props: [
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes to apply.",
      },
    ],
    files: [
      {
        name: "scales.tsx",
        path: "registry/ui/scales.tsx",
        code: `import React from "react";
import { cn } from "@/lib/utils";

export const HorizontalScale = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "h-10 w-full bg-[repeating-linear-gradient(315deg,var(--pattern-line)_0px,var(--pattern-line)_1px,transparent_1px,transparent_10px)] bg-size-[14px_14px] border-y border-(--pattern)",
        className
      )}
    />
  );
};

export const VerticalScale = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "w-10 h-full bg-[repeating-linear-gradient(315deg,var(--pattern-line)_0px,var(--pattern-line)_1px,transparent_1px,transparent_10px)] bg-size-[14px_14px] border-x border-(--pattern)",
        className
      )}
    />
  );
};

export const Lines = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "h-14 w-full bg-[repeating-linear-gradient(to_bottom,var(--pattern-line)_0,var(--pattern-line)_1px,transparent_1px,transparent_0.5rem)] border-y border-(--pattern)",
        className
      )}
    />
  );
};`,
      },
    ],
  },
  "animated-button": {
    slug: "animated-button",
    name: "Animated Button",
    description: "Multi-variant interactive button with shimmering effects and micro-interactions.",
    category: "buttons",
    tags: ["button", "shimmer", "interaction", "animation"],
    dependencies: ["clsx", "tailwind-merge", "@radix-ui/react-icons"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "shimmer"',
        defaultValue: '"primary"',
        description: "Visual style variant of the button.",
      },
      {
        name: "showArrow",
        type: "boolean",
        defaultValue: "false",
        description: "Display an animated arrow icon on hover.",
      },
    ],
    files: [
      {
        name: "animated-button.tsx",
        path: "registry/ui/animated-button.tsx",
        code: `"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "shimmer";
  showArrow?: boolean;
}

export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(
  (
    {
      className,
      children,
      variant = "primary",
      showArrow = false,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer select-none overflow-hidden",
          variant === "primary" &&
            "bg-linear-to-t from-blue-700 to-blue-500 text-white shadow-lg shadow-blue-500/20 hover:brightness-110 active:scale-[0.98]",
          variant === "secondary" &&
            "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:scale-[0.98]",
          variant === "outline" &&
            "border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60 hover:text-white active:scale-[0.98]",
          variant === "shimmer" &&
            "border border-zinc-700/80 bg-zinc-900/90 text-zinc-100 hover:border-zinc-500 shadow-[0_0_15px_rgba(255,255,255,0.05)]",
          className
        )}
        {...props}
      >
        {variant === "shimmer" && (
          <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        )}
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {showArrow && (
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          )}
        </span>
      </button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";`,
      },
    ],
  },
  "spotlight-card": {
    slug: "spotlight-card",
    name: "Spotlight Card",
    description: "Card container with cursor-following radial gradient glow effect.",
    category: "cards",
    tags: ["card", "spotlight", "hover", "interactive"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    props: [
      {
        name: "spotlightColor",
        type: "string",
        defaultValue: '"rgba(59, 130, 246, 0.15)"',
        description: "Radial gradient spotlight color on hover.",
      },
    ],
    files: [
      {
        name: "spotlight-card.tsx",
        path: "registry/ui/spotlight-card.tsx",
        code: `"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightColor?: string;
}

export const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  (
    {
      className,
      children,
      spotlightColor = "rgba(59, 130, 246, 0.15)",
      ...props
    },
    ref
  ) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ x: number; y: number }>({
      x: 0,
      y: 0,
    });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!divRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => {
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    return (
      <div
        ref={(node) => {
          divRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur-md transition-colors duration-200 hover:border-zinc-700",
          className
        )}
        {...props}
      >
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity,
            background: \`radial-gradient(600px circle at \${position.x}px \${position.y}px, \${spotlightColor}, transparent 40%)\`,
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

SpotlightCard.displayName = "SpotlightCard";`,
      },
    ],
  },
  "glowing-badge": {
    slug: "glowing-badge",
    name: "Glowing Badge",
    description: "Compact status and tag badge with glowing borders and pulsing indicator.",
    category: "feedback",
    tags: ["badge", "status", "glow", "indicator"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    props: [
      {
        name: "variant",
        type: '"blue" | "emerald" | "amber" | "violet"',
        defaultValue: '"blue"',
        description: "Color palette of the badge.",
      },
      {
        name: "pulse",
        type: "boolean",
        defaultValue: "true",
        description: "Enable the pinging pulse dot indicator.",
      },
    ],
    files: [
      {
        name: "glowing-badge.tsx",
        path: "registry/ui/glowing-badge.tsx",
        code: `import React from "react";
import { cn } from "@/lib/utils";

export interface GlowingBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "blue" | "emerald" | "amber" | "violet";
  pulse?: boolean;
}

export const GlowingBadge = ({
  className,
  children,
  variant = "blue",
  pulse = true,
  ...props
}: GlowingBadgeProps) => {
  const variantStyles = {
    blue: "border-blue-500/30 bg-blue-950/40 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]",
    emerald: "border-emerald-500/30 bg-emerald-950/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    amber: "border-amber-500/30 bg-amber-950/40 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    violet: "border-violet-500/30 bg-violet-950/40 text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.15)]",
  };

  const dotColors = {
    blue: "bg-blue-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    violet: "bg-violet-400",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              dotColors[variant]
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              dotColors[variant]
            )}
          />
        </span>
      )}
      <span>{children}</span>
    </div>
  );
};`,
      },
    ],
  },
  "hook-sidebar": {
    slug: "hook-sidebar",
    name: "Hook Sidebar",
    description: "Collapsible navigation sidebar with animated traveling spring rail and curved elbow hook.",
    category: "navigation",
    tags: ["sidebar", "navigation", "hook", "rail", "spring"],
    dependencies: ["clsx", "tailwind-merge", "motion"],
    version: "1.0.0",
    createdDate: "2026-09-20",
    updatedDate: "2026-09-20",
    interactive: true,
    props: [
      {
        name: "items",
        type: "HookSidebarItem[]",
        defaultValue: "[]",
        description: "List of items or links to render in the navigation sidebar.",
      },
      {
        name: "label",
        type: "string",
        defaultValue: "undefined",
        description: "Optional category or section label rendered above items.",
      },
      {
        name: "color",
        type: "string",
        defaultValue: '"#FC4C01"',
        description: "Active accent rail and hook color.",
      },
      {
        name: "dashed",
        type: "boolean",
        defaultValue: "true",
        description: "Render repeating dashed guide pattern along the rail.",
      },
    ],
    files: [
      {
        name: "hook-sidebar.tsx",
        path: "registry/ui/hook-sidebar.tsx",
        code: `"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const CORNER = 6;
const DASH =
  "repeating-linear-gradient(to top, transparent 0 2px, currentColor 2px 4px)";

export type HookSidebarItem = string | { label: string; href?: string };

export type HookSidebarProps = Omit<ComponentProps<"nav">, "onChange"> & {
  items: HookSidebarItem[];
  label?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (index: number) => void;
  color?: string;
  dashed?: boolean;
};

const hrefOf = (item: HookSidebarItem) =>
  typeof item === "string" ? undefined : item.href;

const labelOf = (item: HookSidebarItem) =>
  typeof item === "string" ? item : item.label;

const Rail = ({
  from = 0,
  y,
  visible,
  color,
  dashed,
  className,
}: {
  from?: number;
  y: number | null;
  visible: boolean;
  color?: string;
  dashed: boolean;
  className?: string;
}) => {
  const reduced = useReducedMotion();
  const travel = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.7 };

  return (
    <motion.span
      aria-hidden
      initial={false}
      style={{ color }}
      animate={{ opacity: visible && y !== null ? 1 : 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.2 }}
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <motion.span
        initial={false}
        animate={{ top: from, height: Math.max(0, (y ?? 0) - CORNER - from) }}
        transition={travel}
        style={
          dashed
            ? { backgroundImage: DASH }
            : { backgroundColor: "currentColor" }
        }
        className="absolute left-0.5 w-px"
      />
      <motion.svg
        initial={false}
        animate={{ top: (y ?? 0) - CORNER }}
        transition={travel}
        width="12"
        height="7"
        viewBox="0 0 12 7"
        fill="none"
        className="absolute left-0.5"
      >
        <path
          d="M0.5 0a6 6 0 0 0 6 6H12"
          stroke="currentColor"
          strokeDasharray={dashed ? "2 2" : undefined}
        />
      </motion.svg>
    </motion.span>
  );
};

export function HookSidebar({
  items,
  label,
  value,
  defaultValue = 0,
  onChange,
  color = "#FC4C01",
  dashed = true,
  className,
  ...props
}: HookSidebarProps) {
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [centers, setCenters] = useState<number[]>([]);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);

  const routed = items.some((item) => hrefOf(item));
  const routeIndex = items.findIndex((item) => hrefOf(item) === pathname);
  const activeIndex = value ?? (routed ? routeIndex : internalValue);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () =>
      setCenters(
        itemRefs.current.map((el) =>
          el ? el.offsetTop + el.offsetHeight / 2 : 0
        )
      );

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [items.length]);

  const activeY = activeIndex < 0 ? null : (centers[activeIndex] ?? null);
  const hoverY = hoverIndex === null ? null : (centers[hoverIndex] ?? null);

  const hoverFrom =
    activeY !== null && hoverY !== null && hoverY <= activeY
      ? Math.max(0, hoverY - CORNER)
      : (activeY ?? 0);

  const select = (index: number) => {
    if (value === undefined) setInternalValue(index);
    onChange?.(index);
  };

  return (
    <nav
      data-slot="hook-sidebar"
      aria-label={label}
      className={cn("flex flex-col", className)}
      {...props}
    >
      {label && (
        <span
          data-slot="hook-sidebar-label"
          className="pb-2.5 pl-0.5 pr-2 font-mono text-[11px] font-medium uppercase tracking-widest text-zinc-500"
        >
          {label}
        </span>
      )}

      <div
        ref={listRef}
        onMouseLeave={() => setPointerInside(false)}
        className="relative flex flex-col gap-0.5"
      >
        <Rail
          from={hoverFrom}
          y={hoverY}
          visible={(pointerInside || focusInside) && hoverIndex !== activeIndex}
          dashed={dashed}
          className="text-zinc-600"
        />
        <Rail
          y={activeY}
          visible={activeY !== null}
          color={color}
          dashed={dashed}
        />

        {items.map((item, index) => {
          const text = labelOf(item);
          const href = hrefOf(item);
          const isActive = index === activeIndex;
          const setRef = (el: HTMLElement | null) => {
            itemRefs.current[index] = el;
          };
          const rowProps = {
            "data-slot": "hook-sidebar-item",
            "data-active": isActive,
            onMouseEnter: () => {
              setHoverIndex(index);
              setPointerInside(true);
            },
            onFocus: () => {
              setHoverIndex(index);
              setFocusInside(true);
            },
            onBlur: () => setFocusInside(false),
            onClick: () => select(index),
            className: cn(
              "rounded-lg py-1 pl-5 pr-2 text-left text-xs transition-colors duration-200 motion-reduce:transition-none select-none",
              isActive
                ? "text-white font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            ),
          };

          return href ? (
            <Link
              key={\`\${index}-\${text}\`}
              {...rowProps}
              ref={setRef}
              href={href}
              aria-current={isActive ? "page" : undefined}
            >
              {text}
            </Link>
          ) : (
            <button
              key={\`\${index}-\${text}\`}
              {...rowProps}
              ref={setRef}
              type="button"
              aria-current={isActive ? "true" : undefined}
            >
              {text}
            </button>
          );
        })}
      </div>
    </nav>
  );
}`,
      },
    ],
  },
  "github-activity": {
    slug: "github-activity",
    name: "GitHub activity",
    description: "A contribution heatmap with a footer panel that expands over the grid to rank your top repositories.",
    category: "display",
    tags: ["heatmap", "github", "contributions", "drawer", "spring"],
    dependencies: ["clsx", "tailwind-merge", "motion", "@radix-ui/react-icons"],
    version: "1.0.0",
    createdDate: "2026-09-20",
    updatedDate: "2026-09-20",
    interactive: true,
    props: [
      {
        name: "username",
        type: "string",
        defaultValue: "undefined",
        description: "The GitHub username you want the data for.",
      },
      {
        name: "contributions",
        type: "Contribution[]",
        defaultValue: "[]",
        description: "Your own contribution data instead of a username.",
      },
    ],
    files: [
      {
        name: "github-activity.tsx",
        path: "registry/ui/github-activity.tsx",
        code: `"use client";

import * as React from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type Contribution = {
  date: string;
  count: number;
  level: ContributionLevel;
};

export type RepoContribution = {
  name: string;
  count: number;
  category: string;
};

const DEFAULT_REPOS: RepoContribution[] = [
  { name: "anthropic / claude-sdk", count: 842, category: "AI & Agents" },
  { name: "huggingface / transformers", count: 614, category: "Model Kit" },
  { name: "vercel / next.js", count: 407, category: "Web Framework" },
];

const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const GREEN_LEVELS: Record<ContributionLevel, string> = {
  0: "bg-[#161b22]",
  1: "bg-[#0e4429]",
  2: "bg-[#006d32]",
  3: "bg-[#26a641]",
  4: "bg-[#39d353]",
};

export interface GitHubActivityProps {
  username?: string;
  totalContributions?: number;
  year?: number;
  contributions?: Contribution[];
  className?: string;
}

export function GitHubActivity({
  totalContributions = 1863,
  year = 2025,
  className,
}: GitHubActivityProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
  } | null>(null);

  const gridData = React.useMemo(() => {
    const cols = 26;
    const rows = 7;
    const matrix: ContributionLevel[][] = [];
    for (let c = 0; c < cols; c++) {
      const col: ContributionLevel[] = [];
      for (let r = 0; r < rows; r++) {
        const hash = ((c * 17 + r * 31 + 42) * 9301 + 49297) % 233280;
        const rand = hash / 233280;
        let level: ContributionLevel = 0;
        if (rand > 0.8) level = 4;
        else if (rand > 0.6) level = 3;
        else if (rand > 0.4) level = 2;
        else if (rand > 0.25) level = 1;
        col.push(level);
      }
      matrix.push(col);
    }
    return matrix;
  }, []);

  return (
    <div
      className={cn(
        "relative w-full max-w-[390px] rounded-2xl border border-white/10 bg-[#0c0c0e] p-5 shadow-2xl overflow-hidden select-none",
        className
      )}
    >
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-sm font-medium text-white tracking-tight">
          {totalContributions} contributions in {year}
        </h3>
        {hoveredCell && (
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
            {hoveredCell.count} on {hoveredCell.date}
          </span>
        )}
      </div>

      <div className="flex justify-between px-1 pb-2 text-[10px] font-sans text-zinc-500">
        {MONTHS.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      <div className="relative">
        <div className="flex gap-[3px] overflow-x-auto scrollbar-none pb-3">
          {gridData.map((col, cIdx) => (
            <div key={cIdx} className="flex flex-col gap-[3px]">
              {col.map((level, rIdx) => (
                <div
                  key={rIdx}
                  onMouseEnter={() =>
                    setHoveredCell({
                      count: level * 3 + (level > 0 ? 1 : 0),
                      date: \`2025-W\${cIdx + 24}-D\${rIdx + 1}\`,
                    })
                  }
                  onMouseLeave={() => setHoveredCell(null)}
                  className={cn(
                    "h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-[2px] transition-transform duration-150 hover:scale-125 hover:z-10 hover:ring-1 hover:ring-white/40 cursor-pointer",
                    GREEN_LEVELS[level]
                  )}
                />
              ))}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 34,
                mass: 0.7,
              }}
              className="absolute inset-0 bg-[#0c0c0e]/95 backdrop-blur-md rounded-xl p-3 flex flex-col justify-between border border-white/10 z-20"
            >
              <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 pb-1 border-b border-white/8">
                Ranked Repositories
              </div>
              <div className="space-y-2 py-1">
                {DEFAULT_REPOS.map((repo, i) => (
                  <div
                    key={repo.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-orange-500 font-bold">
                        0{i + 1}
                      </span>
                      <span className="text-zinc-200 font-medium">
                        {repo.name}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-zinc-400">
                      {repo.count}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 text-right">
                Press chevron to collapse
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/8">
        <span className="text-xs text-zinc-400 font-light">
          Top contributions in:
        </span>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5 items-center">
            <div className="w-5 h-5 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center text-[10px] text-white font-bold">
              ✦
            </div>
            <div className="w-5 h-5 rounded-full bg-amber-400/90 border border-black flex items-center justify-center text-[10px] text-black font-bold">
              ⚡
            </div>
            <div className="w-5 h-5 rounded-full bg-blue-500 border border-white/20 flex items-center justify-center text-[10px] text-white font-bold">
              ✱
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-6 h-6 rounded-full bg-zinc-900 border border-white/10 hover:border-white/25 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 34,
              }}
            >
              <ChevronDownIcon className="w-3.5 h-3.5" />
            </motion.div>
          </button>
        </div>
      </div>
    </div>
  );
}`,
      },
    ],
  },
  "bento-grid": {
    slug: "bento-grid",
    name: "Bento Grid",
    description: "Responsive 3-column asymmetric layout grid for high-impact feature displays.",
    category: "layout",
    tags: ["bento", "grid", "layout", "cards"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    props: [
      {
        name: "colSpan",
        type: "1 | 2 | 3",
        defaultValue: "1",
        description: "Number of grid columns spanned by BentoCard on medium+ screens.",
      },
    ],
    files: [
      {
        name: "bento-grid.tsx",
        path: "registry/ui/bento-grid.tsx",
        code: `import React from "react";
import { cn } from "@/lib/utils";

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {}

export const BentoGrid = ({ className, children, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
  description: string;
  colSpan?: 1 | 2 | 3;
}

export const BentoCard = ({
  className,
  header,
  icon,
  title,
  description,
  colSpan = 1,
  ...props
}: BentoCardProps) => {
  const colSpanClasses = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/40 hover:shadow-xl",
        colSpanClasses[colSpan],
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-3">
        {header && <div className="overflow-hidden rounded-lg">{header}</div>}
        <div className="flex items-center gap-2">
          {icon && <div className="text-zinc-400 group-hover:text-blue-400 transition-colors">{icon}</div>}
          <h3 className="font-semibold text-zinc-100 text-base tracking-tight">{title}</h3>
        </div>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">{description}</p>
      </div>
    </div>
  );
};`,
      },
    ],
  },
};

export const getAllComponents = (): ComponentRegistryItem[] => {
  return Object.values(COMPONENT_REGISTRY);
};

export const getComponentBySlug = (
  slug: string
): ComponentRegistryItem | undefined => {
  return COMPONENT_REGISTRY[slug];
};
