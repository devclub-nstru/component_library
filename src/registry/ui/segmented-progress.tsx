"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export type SegmentedProgressColor =
  | "emerald"
  | "blue"
  | "violet"
  | "amber"
  | "rose"
  | "cyan";

export interface ColorConfig {
  active: string;
  glow: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  inactive: string;
}

const COLOR_MAP: Record<SegmentedProgressColor, ColorConfig> = {
  emerald: {
    active: "#4ade80",
    glow: "rgba(74, 222, 128, 0.38)",
    badgeBg: "rgba(16, 185, 129, 0.12)",
    badgeText: "#4ade80",
    badgeBorder: "rgba(74, 222, 128, 0.25)",
    inactive: "#1e1e22",
  },
  blue: {
    active: "#60a5fa",
    glow: "rgba(96, 165, 250, 0.38)",
    badgeBg: "rgba(59, 130, 246, 0.12)",
    badgeText: "#60a5fa",
    badgeBorder: "rgba(96, 165, 250, 0.25)",
    inactive: "#1e1e22",
  },
  violet: {
    active: "#a78bfa",
    glow: "rgba(167, 139, 250, 0.38)",
    badgeBg: "rgba(139, 92, 246, 0.12)",
    badgeText: "#a78bfa",
    badgeBorder: "rgba(167, 139, 250, 0.25)",
    inactive: "#1e1e22",
  },
  amber: {
    active: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.38)",
    badgeBg: "rgba(245, 158, 11, 0.12)",
    badgeText: "#fbbf24",
    badgeBorder: "rgba(251, 191, 36, 0.25)",
    inactive: "#1e1e22",
  },
  rose: {
    active: "#fb7185",
    glow: "rgba(251, 113, 133, 0.38)",
    badgeBg: "rgba(244, 63, 94, 0.12)",
    badgeText: "#fb7185",
    badgeBorder: "rgba(251, 113, 133, 0.25)",
    inactive: "#1e1e22",
  },
  cyan: {
    active: "#22d3ee",
    glow: "rgba(34, 211, 238, 0.38)",
    badgeBg: "rgba(6, 182, 212, 0.12)",
    badgeText: "#22d3ee",
    badgeBorder: "rgba(34, 211, 238, 0.25)",
    inactive: "#1e1e22",
  },
};

const COLOR_ALIAS_MAP: Record<string, SegmentedProgressColor> = {
  green: "emerald",
  purple: "violet",
  red: "rose",
  orange: "amber",
};

function resolveColor(color: SegmentedProgressColor | string): ColorConfig {
  const normalized = COLOR_ALIAS_MAP[color] || color;
  if (normalized in COLOR_MAP) {
    return COLOR_MAP[normalized as SegmentedProgressColor];
  }
  return {
    active: color,
    glow: `color-mix(in srgb, ${color} 40%, transparent)`,
    badgeBg: `color-mix(in srgb, ${color} 15%, transparent)`,
    badgeText: color,
    badgeBorder: `color-mix(in srgb, ${color} 28%, transparent)`,
    inactive: "#1e1e22",
  };
}

export function ProgressPieIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={cn("w-5 h-5 text-white", className)}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-40"
      />
      <path
        d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12H12V3Z"
        fill="currentColor"
      />
    </svg>
  );
}

type Part = { key: string; digit: number } | { key: string; text: string };

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const rollMotionTokens = {
  spring: {
    snappy: { visualDuration: 0.32, bounce: 0.12 },
    morph: { visualDuration: 0.4, bounce: 0.08 },
    smooth: { visualDuration: 0.35, bounce: 0 },
  },
  duration: {
    instant: 0.08,
    fast: 0.18,
    normal: 0.3,
  },
  blur: {
    subtle: 1.5,
    soft: 2.5,
  },
  ease: {
    enter: [0.16, 1, 0.3, 1] as const,
    standard: [0.2, 0, 0, 1] as const,
  },
};

const enterEase = [...rollMotionTokens.ease.enter] as [
  number,
  number,
  number,
  number,
];
const exitEase = [...rollMotionTokens.ease.standard] as [
  number,
  number,
  number,
  number,
];

const physicalSpring = ({
  visualDuration,
  bounce,
}: {
  visualDuration: number;
  bounce: number;
}) => {
  const root = (2 * Math.PI) / (visualDuration * 1.2);
  return {
    type: "spring" as const,
    stiffness: root * root,
    damping: 2 * (1 - bounce) * root,
    restDelta: 0.002,
    restSpeed: 0.02,
  };
};

const rollSpring = physicalSpring(rollMotionTokens.spring.snappy);

function partsOf(text: string): Part[] {
  const chars = [...text];
  const first = chars.findIndex((c) => c >= "0" && c <= "9");
  const last =
    chars.length -
    1 -
    [...chars].reverse().findIndex((c) => c >= "0" && c <= "9");
  let place = chars.filter((c) => c >= "0" && c <= "9").length;
  return chars.map((char, index): Part => {
    if (first < 0 || index < first)
      return { key: `p${index}${char}`, text: char };
    if (index > last)
      return { key: `s${chars.length - index}${char}`, text: char };
    if (char >= "0" && char <= "9")
      return { key: `d${--place}`, digit: Number(char) };
    return { key: `g${place}${char}`, text: char };
  });
}

const slotVariants: Variants = {
  enter: (direction: number) => ({
    width: 0,
    scale: 0.6,
    opacity: 0,
    y: `${direction * 0.3}em`,
    filter: `blur(${rollMotionTokens.blur.soft}px)`,
  }),
  center: {
    width: "auto",
    scale: 1,
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transitionEnd: { filter: "none" },
    transition: {
      width: rollMotionTokens.spring.morph,
      scale: rollMotionTokens.spring.morph,
      opacity: rollMotionTokens.spring.morph,
      y: rollMotionTokens.spring.snappy,
      filter: { duration: 0.22, ease: enterEase },
    },
  },
  exit: (direction: number) => ({
    width: 0,
    scale: 0.6,
    opacity: 0,
    y: `${direction * -0.3}em`,
    filter: `blur(${rollMotionTokens.blur.subtle}px)`,
    transition: {
      width: rollMotionTokens.spring.smooth,
      scale: rollMotionTokens.spring.smooth,
      y: { duration: rollMotionTokens.duration.fast, ease: exitEase },
      opacity: { duration: rollMotionTokens.duration.instant },
      filter: { duration: rollMotionTokens.duration.instant },
    },
  }),
};

const stillVariants: Variants = {
  enter: { width: "auto", scale: 1, opacity: 0, y: 0, filter: "none" },
  center: {
    width: "auto",
    scale: 1,
    opacity: 1,
    y: 0,
    filter: "none",
    transition: { duration: rollMotionTokens.duration.instant },
  },
  exit: { width: 0, opacity: 0, transition: { duration: 0 } },
};

function Glyph({
  position,
  digit,
}: {
  position: MotionValue<number>;
  digit: number;
}) {
  const offset = (current: number) => {
    const diff = (((digit - current) % 10) + 10) % 10;
    return diff > 5 ? diff - 10 : diff;
  };
  const y = useTransform(position, (current) => `${offset(current) * 1.05}em`);
  const opacity = useTransform(position, (current) =>
    Math.max(0, 1 - Math.abs(offset(current)) ** 1.5 * 1.1),
  );
  const visibility = useTransform(position, (current) =>
    Math.abs(offset(current)) >= 1 ? "hidden" : "visible",
  );
  const filter = useTransform(position, (current) => {
    const distance = Math.abs(offset(current));
    return distance < 0.02 || distance >= 1
      ? "none"
      : `blur(${(distance * rollMotionTokens.blur.soft * 0.75).toFixed(2)}px)`;
  });

  return (
    <motion.span
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none will-change-transform"
      style={{ y, opacity, filter, visibility }}
    >
      {digit}
    </motion.span>
  );
}

function Wheel({ digit, direction }: { digit: number; direction: number }) {
  const reduced = useReducedMotion();
  const position = useMotionValue(digit);
  const wheel = useRef({ digit, target: digit });

  useEffect(() => {
    const state = wheel.current;
    if (state.digit === digit) return;
    state.target +=
      direction > 0
        ? (digit - state.digit + 10) % 10
        : -((state.digit - digit + 10) % 10);
    state.digit = digit;
    if (reduced) position.jump(state.target);
    else animate(position, state.target, rollSpring);
  }, [digit, direction, position, reduced]);

  return (
    <>
      <span className="invisible pointer-events-none select-none tabular-nums font-semibold">
        0
      </span>
      {DIGITS.map((item) => (
        <Glyph key={item} position={position} digit={item} />
      ))}
    </>
  );
}

export function RollingNumber({
  value,
  text,
  className,
}: {
  value: number;
  text: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [trail, setTrail] = useState({ value, direction: 1 });

  if (trail.value !== value) {
    setTrail({ value, direction: value >= trail.value ? 1 : -1 });
  }
  const direction =
    trail.value === value ? trail.direction : value >= trail.value ? 1 : -1;

  return (
    <span
      className={cn(
        "inline-flex items-baseline overflow-hidden tabular-nums leading-none select-none",
        className,
      )}
    >
      <AnimatePresence initial={false} custom={direction}>
        {partsOf(text).map((part) => (
          <motion.span
            key={part.key}
            className={
              "digit" in part
                ? "relative inline-flex items-center justify-center overflow-hidden h-[1.15em] align-baseline"
                : "inline-flex items-center justify-center align-baseline"
            }
            custom={direction}
            variants={reduced ? stillVariants : slotVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {"digit" in part ? (
              <Wheel digit={part.digit} direction={direction} />
            ) : (
              part.text
            )}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}

export interface SegmentedProgressBarProps {
  value: number;
  segments?: number;
  color?: SegmentedProgressColor | string;
  height?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  onHoverChange?: (hoveredValue: number | null, index: number | null) => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export function SegmentedProgressBar({
  value,
  segments = 32,
  color = "emerald",
  height = 26,
  interactive = true,
  onChange,
  onHoverChange,
  className,
  disabled = false,
  ariaLabel,
}: SegmentedProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const colorConfig = useMemo(() => resolveColor(color), [color]);
  const clampedValue = Math.max(0, Math.min(100, Math.round(value)));
  const baselineCount = Math.round((clampedValue / 100) * segments);

  const isAdjustable = interactive && !disabled && Boolean(onChange);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const isDraggingRef = useRef(false);

  const activeSegmentsCount =
    hoverIndex !== null ? hoverIndex + 1 : baselineCount;

  const isReducedMotion = useRef(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      isReducedMotion.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
    }
  }, []);

  useGSAP(
    () => {
      if (isReducedMotion.current) return;
      const elements = segmentRefs.current.slice(0, baselineCount);
      if (elements.length === 0) return;

      gsap.fromTo(
        elements,
        {
          scaleY: 0.35,
          opacity: 0.2,
        },
        {
          scaleY: 1,
          opacity: 1,
          duration: 0.45,
          stagger: {
            each: 0.012,
            from: "start",
          },
          ease: "power2.out",
        },
      );
    },
    {
      scope: containerRef,
      dependencies: [baselineCount],
      revertOnUpdate: false,
    },
  );

  const updateHoverEffect = useCallback((targetIndex: number | null) => {
    if (!segmentRefs.current.length) return;

    segmentRefs.current.forEach((seg, idx) => {
      if (!seg) return;
      if (targetIndex === null) {
        gsap.to(seg, {
          scaleY: 1,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        const dist = Math.abs(idx - targetIndex);
        if (dist < 4) {
          const scale = 1 + 0.16 * Math.exp(-(dist * dist) / 3.5);
          gsap.to(seg, {
            scaleY: scale,
            duration: 0.16,
            ease: "power1.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(seg, {
            scaleY: 1,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      }
    });
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pointerX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const ratio = pointerX / rect.width;
      const index = Math.min(segments - 1, Math.floor(ratio * segments));
      const hoveredVal = Math.round(((index + 1) / segments) * 100);

      setHoverIndex(index);
      onHoverChange?.(hoveredVal, index);
      updateHoverEffect(index);

      if (isDraggingRef.current && interactive && onChange) {
        onChange(hoveredVal);
      }
    },
    [
      disabled,
      segments,
      onHoverChange,
      updateHoverEffect,
      interactive,
      onChange,
    ],
  );

  const handlePointerLeave = useCallback(() => {
    isDraggingRef.current = false;
    setHoverIndex(null);
    onHoverChange?.(null, null);
    updateHoverEffect(null);
  }, [onHoverChange, updateHoverEffect]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || !interactive) return;
      isDraggingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      handlePointerMove(e);
    },
    [disabled, interactive, handlePointerMove],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {}
      }
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled || !interactive || !onChange) return;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        onChange(Math.min(100, clampedValue + 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        onChange(Math.max(0, clampedValue - 1));
      } else if (e.key === "Home") {
        e.preventDefault();
        onChange(0);
      } else if (e.key === "End") {
        e.preventDefault();
        onChange(100);
      }
    },
    [disabled, interactive, onChange, clampedValue],
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full select-none touch-none py-1",
        disabled && "opacity-40 pointer-events-none",
        className,
      )}
    >
      <div
        ref={trackRef}
        role={isAdjustable ? "slider" : "progressbar"}
        tabIndex={isAdjustable ? 0 : -1}
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${clampedValue}%`}
        aria-label={ariaLabel || "Progress bar"}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerLeave}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative flex w-full items-center justify-between gap-0.75 sm:gap-1 outline-none",
          interactive &&
            "cursor-pointer focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-md",
        )}
        style={{ height }}
      >
        {Array.from({ length: segments }).map((_, idx) => {
          const isActive = idx < activeSegmentsCount;

          const activeStyle = isActive
            ? {
                backgroundColor: colorConfig.active,
                boxShadow: `0 0 10px ${colorConfig.glow}`,
                opacity: 1,
              }
            : {
                backgroundColor: colorConfig.inactive,
                opacity: 1,
              };

          return (
            <div
              key={idx}
              ref={(el) => {
                segmentRefs.current[idx] = el;
              }}
              style={{
                height: "100%",
                ...activeStyle,
              }}
              className="flex-1 min-w-0.75 rounded-full transition-colors duration-150 will-change-transform"
            />
          );
        })}
      </div>
    </div>
  );
}

export interface SegmentedProgressMetric {
  id: string;
  label: string;
  value: number;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  color?: SegmentedProgressColor | string;
  unit?: string;
  formatValue?: (val: number) => string;
}

export interface SegmentedProgressItemProps {
  metric: SegmentedProgressMetric;
  segments?: number;
  interactive?: boolean;
  onChange?: (val: number) => void;
}

export function SegmentedProgressItem({
  metric,
  segments = 32,
  interactive = true,
  onChange,
}: SegmentedProgressItemProps) {
  const {
    label,
    value,
    trend,
    trendDirection = "up",
    color = "emerald",
    unit = "%",
    formatValue,
  } = metric;

  const colorConfig = useMemo(() => resolveColor(color), [color]);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const displayVal = hoveredValue !== null ? hoveredValue : value;
  const formattedText = formatValue
    ? formatValue(displayVal)
    : `${displayVal}${unit}`;

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex items-center justify-between">
        <span className="text-[13px] sm:text-sm font-medium text-zinc-400">
          {label}
        </span>
        <div className="flex items-center gap-2.5">
          {trend && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: colorConfig.badgeBg,
                color: colorConfig.badgeText,
                border: `1px solid ${colorConfig.badgeBorder}`,
              }}
            >
              <span className="text-xs">
                {trendDirection === "up"
                  ? "↑"
                  : trendDirection === "down"
                    ? "↓"
                    : "•"}
              </span>
              <span>{trend}</span>
            </div>
          )}
          <span className="text-lg sm:text-xl font-semibold tabular-nums text-white min-w-[3.5ch] text-right inline-flex items-baseline justify-end">
            <RollingNumber value={displayVal} text={formattedText} />
          </span>
        </div>
      </div>

      <SegmentedProgressBar
        value={value}
        segments={segments}
        color={color}
        interactive={interactive}
        onChange={onChange}
        onHoverChange={(hoverVal) => setHoveredValue(hoverVal)}
        ariaLabel={`${label} progress`}
      />
    </div>
  );
}

export interface SegmentedProgressProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: SegmentedProgressColor | string;
  metrics?: SegmentedProgressMetric[];
  segments?: number;
  footerText?: string;
  footerHref?: string;
  footerAction?: () => void;
  onMoreClick?: () => void;
  interactive?: boolean;
  onMetricChange?: (metricId: string, newValue: number) => void;
  className?: string;
}

const DEFAULT_METRICS: SegmentedProgressMetric[] = [
  {
    id: "performing-progress",
    label: "Performing Progress",
    value: 89,
  },
  {
    id: "target-sales",
    label: "Target Sales",
    value: 67,
  },
];

export function SegmentedProgress({
  title = "Project Progress",
  subtitle = "Overall completion rate all projects.",
  icon,
  color = "emerald",
  metrics = DEFAULT_METRICS,
  segments = 32,
  footerText = "Up by 6% compared to last week, great momentum!",
  footerHref,
  footerAction,
  onMoreClick,
  interactive = true,
  onMetricChange,
  className,
}: SegmentedProgressProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [valueOverrides, setValueOverrides] = useState<Record<string, number>>(
    {},
  );

  const colorConfig = useMemo(() => resolveColor(color), [color]);

  const activeMetrics = useMemo(() => {
    return metrics.map((m) => ({
      ...m,
      color: m.color || color,
      value:
        valueOverrides[m.id] !== undefined ? valueOverrides[m.id] : m.value,
    }));
  }, [metrics, valueOverrides, color]);

  const handleMetricChange = useCallback(
    (id: string, val: number) => {
      setValueOverrides((prev) => ({ ...prev, [id]: val }));
      onMetricChange?.(id, val);
    },
    [onMetricChange],
  );

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative w-full max-w-105 rounded-2xl bg-[#141416] p-5 sm:p-6 text-white border border-white/8 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] flex flex-col gap-5 overflow-hidden",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-b from-[#2a2a2e] to-[#141416] border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_12px_rgba(0,0,0,0.5)]">
            {icon || (
              <ProgressPieIcon
                className="w-5 h-5 transition-colors duration-200"
                style={{ color: colorConfig.active }}
              />
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="text-[15px] sm:text-base font-semibold text-white tracking-tight leading-snug">
              {title}
            </h3>
            <p className="text-xs sm:text-[13px] text-zinc-400 font-normal leading-normal">
              {subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onMoreClick}
          aria-label="More options"
          className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/6 transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-white/20"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {activeMetrics.map((metric) => (
          <SegmentedProgressItem
            key={metric.id}
            metric={metric}
            segments={segments}
            interactive={interactive}
            onChange={(newVal) => handleMetricChange(metric.id, newVal)}
          />
        ))}
      </div>

      {footerText && (
        <div
          role={footerAction || footerHref ? "button" : undefined}
          tabIndex={footerAction || footerHref ? 0 : undefined}
          onClick={footerAction}
          style={{
            backgroundColor: colorConfig.badgeBg,
            borderColor: colorConfig.badgeBorder,
            color: colorConfig.badgeText,
          }}
          className={cn(
            "group relative flex items-center justify-between rounded-xl px-4 py-3 border transition-colors duration-200",
            (footerAction || footerHref) &&
              "cursor-pointer hover:brightness-110",
          )}
        >
          {footerHref ? (
            <a
              href={footerHref}
              className="flex items-center justify-between w-full text-xs sm:text-[13px] font-medium leading-relaxed"
            >
              <span>{footerText}</span>
              <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          ) : (
            <>
              <span className="text-xs sm:text-[13px] font-medium leading-relaxed">
                {footerText}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SegmentedProgress;
