"use client";

import * as React from "react";
import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type Contribution = {
  date: string;
  count: number;
  level: ContributionLevel;
};

export type GitHubActivityVariant = "emerald" | "teal" | "github";

export interface GitHubActivityProps extends React.HTMLAttributes<HTMLDivElement> {
  username?: string;
  title?: string;
  subtitle?: string;
  totalContributions?: number;
  year?: number;
  contributions?: Contribution[];
  variant?: GitHubActivityVariant;
  className?: string;
}

const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const VARIANT_CONFIGS: Record<
  GitHubActivityVariant,
  {
    levels: Record<ContributionLevel, string>;
    badge: string;
    dot: string;
    text: string;
    glow: string;
  }
> = {
  teal: {
    levels: {
      0: "bg-white/4 border border-white/4",
      1: "bg-[#015451]/35 border border-[#015451]/50",
      2: "bg-[#015451]/65 border border-[#00c9a7]/40",
      3: "bg-[#00a88c] border border-[#00c9a7]/70 shadow-[0_0_8px_rgba(0,201,167,0.35)]",
      4: "bg-[#00c9a7] border border-[#5eead4] shadow-[0_0_12px_rgba(0,201,167,0.65)]",
    },
    badge: "bg-[#00c9a7]/10 text-[#00c9a7] border border-[#00c9a7]/25",
    dot: "bg-[#00c9a7]",
    text: "text-[#00c9a7]",
    glow: "bg-[#00c9a7]/12",
  },
  emerald: {
    levels: {
      0: "bg-white/4 border border-white/4",
      1: "bg-[#0e4429] border border-[#006d32]/40",
      2: "bg-[#006d32] border border-[#26a641]/50",
      3: "bg-[#26a641] border border-[#39d353]/60 shadow-[0_0_8px_rgba(38,166,65,0.35)]",
      4: "bg-[#39d353] border border-[#4ae365] shadow-[0_0_12px_rgba(57,211,83,0.6)]",
    },
    badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    glow: "bg-emerald-500/12",
  },
  github: {
    levels: {
      0: "bg-white/4 border border-white/4",
      1: "bg-[#0e4429] border border-[#006d32]/40",
      2: "bg-[#006d32] border border-[#26a641]/50",
      3: "bg-[#26a641] border border-[#39d353]/60 shadow-[0_0_8px_rgba(38,166,65,0.35)]",
      4: "bg-[#39d353] border border-[#4ae365] shadow-[0_0_12px_rgba(57,211,83,0.6)]",
    },
    badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    glow: "bg-emerald-500/12",
  },
};

export function GitHubActivity({
  username,
  title = "Commit Heatmap",
  subtitle,
  year = 2025,
  contributions,
  variant = "teal",
  className,
  ...props
}: GitHubActivityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCell, setHoveredCell] = useState<{
    count: number;
    date: string;
    x: number;
    y: number;
    height: number;
    isNearTop: boolean;
  } | null>(null);

  const activeTheme = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.teal;

  const gridData = useMemo(() => {
    const cols = 26;
    const rows = 7;

    if (contributions && contributions.length >= cols * rows) {
      const matrix: {
        level: ContributionLevel;
        count: number;
        date: string;
      }[][] = [];
      for (let c = 0; c < cols; c++) {
        const colData = [];
        for (let r = 0; r < rows; r++) {
          colData.push(contributions[c * rows + r]);
        }
        matrix.push(colData);
      }
      return matrix;
    }

    const matrix: {
      level: ContributionLevel;
      count: number;
      date: string;
    }[][] = [];
    const monthNames = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let c = 0; c < cols; c++) {
      const colData = [];
      const monthIdx = Math.min(6, Math.floor((c / cols) * 7));
      const dayOffset = ((c * 7) % 30) + 1;

      for (let r = 0; r < rows; r++) {
        const hash = ((c * 19 + r * 37 + 43) * 9301 + 49297) % 233280;
        const rand = hash / 233280;
        let level: ContributionLevel = 0;
        let count = 0;

        if (rand > 0.82) {
          level = 4;
          count = 13 + Math.floor(rand * 12);
        } else if (rand > 0.64) {
          level = 3;
          count = 8 + Math.floor(rand * 5);
        } else if (rand > 0.44) {
          level = 2;
          count = 4 + Math.floor(rand * 4);
        } else if (rand > 0.24) {
          level = 1;
          count = 1 + Math.floor(rand * 3);
        }

        colData.push({
          level,
          count,
          date: `${monthNames[monthIdx]} ${((dayOffset + r - 1) % 30) + 1}, ${year}`,
        });
      }
      matrix.push(colData);
    }
    return matrix;
  }, [contributions, year]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full max-w-145 rounded-2xl border border-white/10 bg-zinc-950/75 p-4 sm:p-6 backdrop-blur-xl shadow-[0_20px_48px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.14)] select-none",
        className,
      )}
      {...props}
    >
      <div className="relative z-10 flex flex-col pb-3 sm:pb-4 border-b border-white/6">
        <span className="text-xs sm:text-sm font-semibold text-zinc-100 tracking-tight">
          {title}
        </span>
        <span className="text-[11px] sm:text-xs text-zinc-400 font-normal">
          {subtitle ||
            (username ? `@${username}` : "GitHub Contribution Matrix")}
        </span>
      </div>

      <div className="relative z-10 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-1 px-1 sm:mx-0 sm:px-0">
        <div className="min-w-130 sm:min-w-0 w-full">
          <div className="flex justify-between px-1 pt-2.5 pb-2 text-[10px] sm:text-[11px] font-medium text-zinc-400">
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          <div className="pb-2">
            <div className="flex w-full justify-between items-center py-1">
              {gridData.map((col, cIdx) => (
                <div key={cIdx} className="flex flex-col gap-1 sm:gap-1.5">
                  {col.map((cell, rIdx) => (
                    <div
                      key={rIdx}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const containerRect =
                          containerRef.current?.getBoundingClientRect();
                        const containerWidth = containerRect?.width || 560;
                        const rawX = containerRect
                          ? rect.left - containerRect.left + rect.width / 2
                          : 0;
                        const clampedX = Math.max(
                          80,
                          Math.min(containerWidth - 80, rawX),
                        );
                        const y = containerRect
                          ? rect.top - containerRect.top
                          : 0;
                        setHoveredCell({
                          count: cell.count,
                          date: cell.date,
                          x: clampedX,
                          y,
                          height: rect.height,
                          isNearTop: y < 65,
                        });
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={cn(
                        "h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 rounded-[2.5px] sm:rounded-[3.5px] transition-all duration-150 cursor-pointer",
                        "hover:scale-125 hover:z-20 hover:ring-1 hover:ring-white/50",
                        activeTheme.levels[cell.level],
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {hoveredCell && (
          <motion.div
            key="activity-tooltip"
            initial={{
              opacity: 0,
              scale: 0.92,
              x: hoveredCell.x,
              y: hoveredCell.isNearTop
                ? hoveredCell.y + hoveredCell.height + 4
                : hoveredCell.y - 4,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: hoveredCell.x,
              y: hoveredCell.isNearTop
                ? hoveredCell.y + hoveredCell.height + 8
                : hoveredCell.y - 8,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              transition: { duration: 0.12, ease: "easeOut" },
            }}
            transition={{
              type: "spring",
              stiffness: 480,
              damping: 32,
              mass: 0.5,
            }}
            style={{
              left: 0,
              top: 0,
              translateX: "-50%",
              translateY: hoveredCell.isNearTop ? "0%" : "-100%",
            }}
            className="pointer-events-none absolute z-50 px-3 py-1.5 rounded-lg bg-zinc-900/95 backdrop-blur-md text-xs font-medium text-white border border-white/15 shadow-2xl whitespace-nowrap"
          >
            <div
              className={cn(
                "absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent",
                hoveredCell.isNearTop
                  ? "bottom-full border-b-4 border-b-zinc-900"
                  : "top-full border-t-4 border-t-zinc-900",
              )}
            />
            <div className="flex items-center gap-1.5 font-medium">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={hoveredCell.count}
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 3 }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                  className={cn("font-bold tabular-nums", activeTheme.text)}
                >
                  {hoveredCell.count} commits
                </motion.span>
              </AnimatePresence>
              <span className="text-zinc-400">on</span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={hoveredCell.date}
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 2 }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                  className="text-zinc-200 tabular-nums"
                >
                  {hoveredCell.date}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex items-center justify-between pt-3 sm:pt-3.5 border-t border-white/6 text-[11px] sm:text-xs text-zinc-400">
        <span className="font-medium">Activity Level:</span>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] sm:text-xs text-zinc-400">Less</span>
          <div
            className={cn(
              "w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-[2.5px] sm:rounded-[3px]",
              activeTheme.levels[0],
            )}
          />
          <div
            className={cn(
              "w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-[2.5px] sm:rounded-[3px]",
              activeTheme.levels[1],
            )}
          />
          <div
            className={cn(
              "w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-[2.5px] sm:rounded-[3px]",
              activeTheme.levels[2],
            )}
          />
          <div
            className={cn(
              "w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-[2.5px] sm:rounded-[3px]",
              activeTheme.levels[3],
            )}
          />
          <div
            className={cn(
              "w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-[2.5px] sm:rounded-[3px]",
              activeTheme.levels[4],
            )}
          />
          <span className="text-[11px] sm:text-xs text-zinc-400">More</span>
        </div>
      </div>
    </div>
  );
}
