"use client";

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
        className,
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
                      date: `2025-W${cIdx + 24}-D${rIdx + 1}`,
                    })
                  }
                  onMouseLeave={() => setHoveredCell(null)}
                  className={cn(
                    "h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-[2px] transition-transform duration-150 hover:scale-125 hover:z-10 hover:ring-1 hover:ring-white/40 cursor-pointer",
                    GREEN_LEVELS[level],
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
}
