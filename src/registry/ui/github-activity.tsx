"use client";

import * as React from "react";
import {
  useState,
  useRef,
  useMemo,
  useEffect,
  createContext,
  useContext,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type Contribution = {
  date: string;
  count: number;
  level: ContributionLevel;
};

export type Activity = Contribution;

export type GitHubActivityVariant = "emerald" | "teal" | "github";

export interface GitHubActivityProps extends React.HTMLAttributes<HTMLDivElement> {
  username?: string;
  title?: string;
  subtitle?: string;
  totalContributions?: number;
  year?: number;
  contributions?: Contribution[];
  data?: Contribution[];
  variant?: GitHubActivityVariant;
  blockSize?: number;
  blockGap?: number;
  className?: string;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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

type Week = Array<Contribution | undefined>;

type MonthLabel = {
  weekIndex: number;
  label: string;
};

function generateYearData(targetYear: number): Contribution[] {
  const result: Contribution[] = [];
  const start = new Date(targetYear, 0, 1);
  const end = new Date(targetYear, 11, 31);

  const current = new Date(start);
  while (current <= end) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const seed =
      (targetYear * 365 + (current.getMonth() + 1) * 31 + current.getDate()) *
      17;
    const pseudoRand = ((seed * 9301 + 49297) % 233280) / 233280;

    let level: ContributionLevel = 0;
    let count = 0;

    if (pseudoRand > 0.82) {
      level = 4;
      count = 13 + Math.floor(pseudoRand * 12);
    } else if (pseudoRand > 0.62) {
      level = 3;
      count = 7 + Math.floor(pseudoRand * 6);
    } else if (pseudoRand > 0.42) {
      level = 2;
      count = 3 + Math.floor(pseudoRand * 4);
    } else if (pseudoRand > 0.22) {
      level = 1;
      count = 1 + Math.floor(pseudoRand * 2);
    }

    result.push({
      date: dateStr,
      count,
      level,
    });

    current.setDate(current.getDate() + 1);
  }

  return result;
}

function parseDateString(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function formatDateDisplay(dateStr: string): string {
  const date = parseDateString(dateStr);
  const m = MONTH_NAMES[date.getMonth()];
  const d = date.getDate();
  const y = date.getFullYear();
  return `${m} ${d}, ${y}`;
}

function groupIntoWeeks(data: Contribution[], weekStart = 0): Week[] {
  if (!data || data.length === 0) return [];

  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = parseDateString(sorted[0].date);
  const firstDay = firstDate.getDay();

  const leadingPadding = (firstDay - weekStart + 7) % 7;
  const padded: Array<Contribution | undefined> = [
    ...new Array(leadingPadding).fill(undefined),
    ...sorted,
  ];

  const weeksCount = Math.ceil(padded.length / 7);
  const weeks: Week[] = [];

  for (let w = 0; w < weeksCount; w++) {
    const weekSlice = padded.slice(w * 7, w * 7 + 7);
    while (weekSlice.length < 7) {
      weekSlice.push(undefined);
    }
    weeks.push(weekSlice);
  }

  return weeks;
}

function calculateMonthLabels(weeks: Week[]): MonthLabel[] {
  const labels: MonthLabel[] = [];

  weeks.forEach((week, weekIndex) => {
    const validDay = week.find((day) => day !== undefined);
    if (!validDay) return;

    const date = parseDateString(validDay.date);
    const month = MONTH_NAMES[date.getMonth()];
    const prev = labels[labels.length - 1];

    if (weekIndex === 0 || !prev || prev.label !== month) {
      labels.push({ weekIndex, label: month });
    }
  });

  return labels.filter(({ weekIndex }, index) => {
    const minWeeks = 2;
    if (index === 0) {
      return labels[1] ? labels[1].weekIndex - weekIndex >= minWeeks : true;
    }
    if (index === labels.length - 1) {
      return weeks.length - weekIndex >= minWeeks;
    }
    return true;
  });
}

type ContributionGraphContextType = {
  data: Contribution[];
  weeks: Week[];
  monthLabels: MonthLabel[];
  blockSize: number;
  blockGap: number;
  totalContributions: number;
  year: number;
  variant: GitHubActivityVariant;
  activeTheme: (typeof VARIANT_CONFIGS)["teal"];
  hoveredCell: {
    count: number;
    date: string;
    x: number;
    y: number;
    height: number;
    isNearTop: boolean;
  } | null;
  setHoveredCell: React.Dispatch<
    React.SetStateAction<{
      count: number;
      date: string;
      x: number;
      y: number;
      height: number;
      isNearTop: boolean;
    } | null>
  >;
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

const ContributionGraphContext =
  createContext<ContributionGraphContextType | null>(null);

export function useContributionGraph() {
  const context = useContext(ContributionGraphContext);
  if (!context) {
    throw new Error(
      "ContributionGraph components must be used within a ContributionGraph provider",
    );
  }
  return context;
}

export function ContributionGraph({
  username,
  title = "Commit Heatmap",
  subtitle,
  totalContributions: totalContributionsProp,
  year = new Date().getFullYear(),
  contributions,
  data: dataProp,
  variant = "teal",
  blockSize = 10,
  blockGap = 3,
  className,
  children,
  ...props
}: GitHubActivityProps & { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [hoveredCell, setHoveredCell] = useState<{
    count: number;
    date: string;
    x: number;
    y: number;
    height: number;
    isNearTop: boolean;
  } | null>(null);

  const rawData = dataProp || contributions;
  const data = useMemo(() => {
    if (rawData && rawData.length > 0) {
      return rawData;
    }
    return generateYearData(year);
  }, [rawData, year]);

  const weeks = useMemo(() => groupIntoWeeks(data, 0), [data]);
  const monthLabels = useMemo(() => calculateMonthLabels(weeks), [weeks]);

  const calculatedTotal = useMemo(
    () => data.reduce((sum, item) => sum + item.count, 0),
    [data],
  );

  const totalContributions =
    typeof totalContributionsProp === "number"
      ? totalContributionsProp
      : calculatedTotal;

  const activeTheme = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.teal;

  useEffect(() => {
    if (scrollRef.current && typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
      }
    }
  }, [weeks.length]);

  return (
    <ContributionGraphContext.Provider
      value={{
        data,
        weeks,
        monthLabels,
        blockSize,
        blockGap,
        totalContributions,
        year,
        variant,
        activeTheme,
        hoveredCell,
        setHoveredCell,
        containerRef,
        scrollRef,
      }}
    >
      <div
        ref={containerRef}
        className={cn(
          "relative w-full max-w-full sm:max-w-3xl rounded-2xl border border-white/10 bg-zinc-950/75 p-4 sm:p-6 backdrop-blur-xl shadow-[0_20px_48px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.14)] select-none",
          className,
        )}
        {...props}
      >
        {children || (
          <>
            <div className="relative z-10 flex flex-col pb-3 sm:pb-4 border-b border-white/6">
              <span className="text-xs sm:text-sm font-semibold text-zinc-100 tracking-tight">
                {title}
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-400 font-normal">
                {subtitle ||
                  (username ? `@${username}` : "GitHub Contribution Matrix")}
              </span>
            </div>

            <ContributionGraphCalendar />

            <ContributionGraphTooltip />

            <ContributionGraphFooter>
              <ContributionGraphTotalCount />
              <ContributionGraphLegend />
            </ContributionGraphFooter>
          </>
        )}
      </div>
    </ContributionGraphContext.Provider>
  );
}

export function ContributionGraphTooltip() {
  const { hoveredCell, activeTheme } = useContributionGraph();

  return (
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
                {formatDateDisplay(hoveredCell.date)}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ContributionGraphCalendar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children?: (props: {
    activity: Contribution | undefined;
    dayIndex: number;
    weekIndex: number;
  }) => React.ReactNode;
}) {
  const { weeks, monthLabels, blockSize, blockGap, scrollRef, setHoveredCell } =
    useContributionGraph();

  const totalWidth = weeks.length * (blockSize + blockGap) - blockGap;

  return (
    <div
      ref={scrollRef}
      onScroll={() => setHoveredCell(null)}
      className={cn(
        "relative z-10 overflow-x-auto scrollbar-none pb-2 pt-2.5 -mx-1 px-1 sm:mx-0 sm:px-0",
        className,
      )}
      {...props}
    >
      <div
        className="inline-flex flex-col select-none"
        style={{ width: `${totalWidth}px` }}
      >
        <div
          className="relative h-4 mb-2 text-[10px] sm:text-[11px] font-medium text-zinc-400"
          style={{ width: `${totalWidth}px` }}
        >
          {monthLabels.map(({ label, weekIndex }) => (
            <span
              key={`${label}-${weekIndex}`}
              className="absolute top-0 transition-opacity"
              style={{
                left: `${weekIndex * (blockSize + blockGap)}px`,
              }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex" style={{ gap: `${blockGap}px` }}>
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className="flex flex-col"
              style={{ gap: `${blockGap}px` }}
            >
              {week.map((activity, dayIndex) => {
                if (children) {
                  return (
                    <React.Fragment key={`${weekIndex}-${dayIndex}`}>
                      {children({ activity, dayIndex, weekIndex })}
                    </React.Fragment>
                  );
                }

                return (
                  <ContributionGraphBlock
                    key={`${weekIndex}-${dayIndex}`}
                    activity={activity}
                    dayIndex={dayIndex}
                    weekIndex={weekIndex}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContributionGraphBlock({
  activity,
  className,
  ...props
}: {
  activity?: Contribution;
  dayIndex?: number;
  weekIndex?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { activeTheme, blockSize, setHoveredCell, containerRef } =
    useContributionGraph();

  if (!activity) {
    return (
      <div
        style={{ width: `${blockSize}px`, height: `${blockSize}px` }}
        className="pointer-events-none opacity-0"
      />
    );
  }

  const activateTooltip = (target: HTMLDivElement) => {
    const rect = target.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    const containerWidth = containerRect?.width || 560;
    const rawX = containerRect
      ? rect.left - containerRect.left + rect.width / 2
      : 0;
    const clampedX = Math.max(75, Math.min(containerWidth - 75, rawX));
    const y = containerRect ? rect.top - containerRect.top : 0;

    setHoveredCell({
      count: activity.count,
      date: activity.date,
      x: clampedX,
      y,
      height: rect.height,
      isNearTop: y < 65,
    });
  };

  return (
    <div
      onMouseEnter={(e) => activateTooltip(e.currentTarget)}
      onMouseLeave={() => setHoveredCell(null)}
      onClick={(e) => activateTooltip(e.currentTarget)}
      style={{ width: `${blockSize}px`, height: `${blockSize}px` }}
      className={cn(
        "rounded-[2.5px] sm:rounded-[3px] transition-all duration-150 cursor-pointer",
        "hover:scale-125 hover:z-20 hover:ring-1 hover:ring-white/50",
        activeTheme.levels[activity.level],
        className,
      )}
      {...props}
    />
  );
}

export function ContributionGraphFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3 sm:pt-3.5 border-t border-white/6 text-[11px] sm:text-xs text-zinc-400",
        className,
      )}
      {...props}
    />
  );
}

export function ContributionGraphTotalCount({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children?: (props: { totalCount: number; year: number }) => React.ReactNode;
}) {
  const { totalContributions, year } = useContributionGraph();

  if (children) {
    return <>{children({ totalCount: totalContributions, year })}</>;
  }

  return (
    <div className={cn("font-medium text-zinc-400", className)} {...props}>
      {totalContributions.toLocaleString()} contributions in {year}
    </div>
  );
}

export function ContributionGraphLegend({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children?: (props: { level: ContributionLevel }) => React.ReactNode;
}) {
  const { activeTheme, blockSize } = useContributionGraph();
  const levels: ContributionLevel[] = [0, 1, 2, 3, 4];

  if (children) {
    return (
      <div className={cn("flex items-center gap-1.5 sm:gap-2", className)}>
        {levels.map((level) => (
          <React.Fragment key={level}>{children({ level })}</React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-400",
        className,
      )}
      {...props}
    >
      <span>Less</span>
      {levels.map((level) => (
        <div
          key={level}
          style={{ width: `${blockSize}px`, height: `${blockSize}px` }}
          className={cn(
            "rounded-[2.5px] sm:rounded-[3px]",
            activeTheme.levels[level],
          )}
        />
      ))}
      <span>More</span>
    </div>
  );
}

export { ContributionGraph as GitHubActivity };
export default ContributionGraph;
