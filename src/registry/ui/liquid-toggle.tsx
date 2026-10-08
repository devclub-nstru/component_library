"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { cn } from "@/lib/utils";

export type LiquidToggleSize = "sm" | "md" | "lg";
export type LiquidToggleColor =
  | "monochrome"
  | "emerald"
  | "violet"
  | "amber"
  | "cyan";
export type LiquidToggleViscosity = "fluid" | "jelly";

export interface LiquidToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: LiquidToggleSize;
  color?: LiquidToggleColor;
  viscosity?: LiquidToggleViscosity;
  label?: string;
  className?: string;
  id?: string;
}

const SIZES = {
  sm: {
    trackWidth: 42,
    trackHeight: 24,
    thumb: 16,
    drop: 11,
    off: 4,
    on: 42 - 16 - 4,
    blur: 2.6,
  },
  md: {
    trackWidth: 50,
    trackHeight: 28,
    thumb: 18,
    drop: 13,
    off: 5,
    on: 50 - 18 - 5,
    blur: 3.2,
  },
  lg: {
    trackWidth: 64,
    trackHeight: 36,
    thumb: 24,
    drop: 17,
    off: 6,
    on: 64 - 24 - 6,
    blur: 4.2,
  },
} as const;

const TUNING = {
  fluid: {
    thumbStiffness: 260,
    thumbDamping: 20,
    dropStiffness: 125,
    dropDamping: 15,
    stretch: 0.003,
  },
  jelly: {
    thumbStiffness: 340,
    thumbDamping: 14,
    dropStiffness: 160,
    dropDamping: 12,
    stretch: 0.005,
  },
} as const;

const COLOR_STYLES = {
  monochrome: {
    activeBlob: "bg-zinc-900 dark:bg-[#f4f4f5]",
    inactiveBlob: "bg-zinc-400 dark:bg-[#71717a]",
    trackOn:
      "border-zinc-300 bg-zinc-200/80 shadow-[0_0_20px_rgba(0,0,0,0.06)] dark:border-white/20 dark:bg-white/10 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    trackOff: "border-zinc-200 bg-zinc-100 dark:border-white/8 dark:bg-white/4",
    aura: "bg-zinc-300/40 dark:bg-white/10",
  },
  emerald: {
    activeBlob: "bg-[#059669] dark:bg-[#34d399]",
    inactiveBlob: "bg-zinc-400 dark:bg-[#71717a]",
    trackOn:
      "border-emerald-500/40 bg-emerald-500/20 shadow-[0_0_24px_rgba(16,185,129,0.2)] dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:shadow-[0_0_24px_rgba(52,211,153,0.2)]",
    trackOff: "border-zinc-200 bg-zinc-100 dark:border-white/8 dark:bg-white/4",
    aura: "bg-emerald-400/20",
  },
  violet: {
    activeBlob: "bg-[#7c3aed] dark:bg-[#a78bfa]",
    inactiveBlob: "bg-zinc-400 dark:bg-[#71717a]",
    trackOn:
      "border-violet-500/40 bg-violet-500/20 shadow-[0_0_24px_rgba(139,92,246,0.2)] dark:border-violet-500/30 dark:bg-violet-500/10 dark:shadow-[0_0_24px_rgba(167,139,250,0.2)]",
    trackOff: "border-zinc-200 bg-zinc-100 dark:border-white/8 dark:bg-white/4",
    aura: "bg-violet-400/20",
  },
  amber: {
    activeBlob: "bg-[#d97706] dark:bg-[#fbbf24]",
    inactiveBlob: "bg-zinc-400 dark:bg-[#71717a]",
    trackOn:
      "border-amber-500/40 bg-amber-500/20 shadow-[0_0_24px_rgba(245,158,11,0.2)] dark:border-amber-500/30 dark:bg-amber-500/10 dark:shadow-[0_0_24px_rgba(251,191,36,0.2)]",
    trackOff: "border-zinc-200 bg-zinc-100 dark:border-white/8 dark:bg-white/4",
    aura: "bg-amber-400/20",
  },
  cyan: {
    activeBlob: "bg-[#0891b2] dark:bg-[#22d3ee]",
    inactiveBlob: "bg-zinc-400 dark:bg-[#71717a]",
    trackOn:
      "border-cyan-500/40 bg-cyan-500/20 shadow-[0_0_24px_rgba(6,182,212,0.2)] dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:shadow-[0_0_24px_rgba(34,211,238,0.2)]",
    trackOff: "border-zinc-200 bg-zinc-100 dark:border-white/8 dark:bg-white/4",
    aura: "bg-cyan-400/20",
  },
} as const;

export function LiquidToggle({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  color = "monochrome",
  viscosity = "fluid",
  label = "Toggle switch",
  className,
  id: customId,
}: LiquidToggleProps) {
  const generatedId = useId();
  const toggleId = customId ?? `liquid-toggle-${generatedId}`;
  const filterId = `liquid-goo-${generatedId.replace(/:/g, "")}`;

  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const config = SIZES[size];
  const tune = TUNING[viscosity];
  const colorTheme = COLOR_STYLES[color];

  const thumbRef = useRef<HTMLSpanElement>(null);
  const dropRef = useRef<HTMLSpanElement>(null);
  const auraRef = useRef<HTMLSpanElement>(null);

  const initialTarget = isChecked ? config.on : config.off;
  const motion = useRef({
    x: initialTarget,
    v: 0,
    dropX: initialTarget,
    dropV: 0,
    target: initialTarget,
    dragging: false,
    raf: 0,
    last: 0,
  });

  const press = useRef<{
    startX: number;
    from: number;
    moved: boolean;
  } | null>(null);

  const paint = useCallback(() => {
    const m = motion.current;
    const direction = m.v >= 0 ? 1 : -1;
    const stretch = Math.min(0.35, Math.abs(m.v) * tune.stretch);
    const scaleX = 1 + stretch;
    const scaleY = 1 / Math.sqrt(scaleX);

    if (thumbRef.current) {
      thumbRef.current.style.transform = `translate3d(${m.x}px, 0, 0) scale(${scaleX}, ${scaleY})`;
    }
    if (dropRef.current) {
      const dropOffset = (config.thumb - config.drop) / 2;
      const trailLag = direction * -0.5 * stretch * config.drop;
      dropRef.current.style.transform = `translate3d(${m.dropX + dropOffset + trailLag}px, 0, 0)`;
    }
    if (auraRef.current) {
      const progress = (m.x - config.off) / (config.on - config.off || 1);
      auraRef.current.style.opacity = `${Math.max(0, Math.min(1, progress))}`;
    }
  }, [config.drop, config.off, config.on, config.thumb, tune.stretch]);

  const run = useCallback(() => {
    const m = motion.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cancelAnimationFrame(m.raf);
      m.raf = 0;
      if (!m.dragging) m.x = m.target;
      m.dropX = m.x;
      m.v = 0;
      m.dropV = 0;
      paint();
      return;
    }
    if (m.raf) return;
    m.last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - m.last) / 1000);
      m.last = now;

      if (!m.dragging) {
        const springForce = tune.thumbStiffness * (m.target - m.x);
        const dampingForce = tune.thumbDamping * m.v;
        m.v += (springForce - dampingForce) * dt;
        m.x += m.v * dt;
      }

      const dropSpringForce = tune.dropStiffness * (m.x - m.dropX);
      const dropDampingForce = tune.dropDamping * m.dropV;
      m.dropV += (dropSpringForce - dropDampingForce) * dt;
      m.dropX += m.dropV * dt;

      paint();

      const settled =
        !m.dragging &&
        Math.abs(m.target - m.x) < 0.05 &&
        Math.abs(m.v) < 0.5 &&
        Math.abs(m.x - m.dropX) < 0.05 &&
        Math.abs(m.dropV) < 0.5;

      if (settled) {
        m.x = m.target;
        m.dropX = m.target;
        m.v = 0;
        m.dropV = 0;
        paint();
        m.raf = 0;
      } else {
        m.raf = requestAnimationFrame(tick);
      }
    };

    m.raf = requestAnimationFrame(tick);
  }, [
    paint,
    tune.dropDamping,
    tune.dropStiffness,
    tune.thumbDamping,
    tune.thumbStiffness,
  ]);

  useEffect(() => {
    motion.current.target = isChecked ? config.on : config.off;
    run();
  }, [isChecked, config.on, config.off, run]);

  useEffect(() => {
    paint();
    const m = motion.current;
    return () => {
      if (m.raf) {
        cancelAnimationFrame(m.raf);
        m.raf = 0;
      }
    };
  }, [paint]);

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    press.current = {
      startX: e.clientX,
      from: motion.current.x,
      moved: false,
    };
  };

  const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const p = press.current;
    if (!p || disabled) return;
    const by = e.clientX - p.startX;
    if (Math.abs(by) > 3) p.moved = true;
    if (!p.moved) return;

    const m = motion.current;
    m.dragging = true;
    m.x = Math.max(config.off, Math.min(config.on, p.from + by));
    m.v = 0;
    run();
  };

  const handlePointerUp = () => {
    const p = press.current;
    press.current = null;
    if (!p || disabled) return;

    const m = motion.current;
    m.dragging = false;

    const nextState = p.moved ? m.x > (config.off + config.on) / 2 : !isChecked;
    m.target = nextState ? config.on : config.off;
    run();

    if (!isControlled) {
      setInternalChecked(nextState);
    }
    onChange?.(nextState);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const nextState = !isChecked;
      motion.current.target = nextState ? config.on : config.off;
      run();
      if (!isControlled) {
        setInternalChecked(nextState);
      }
      onChange?.(nextState);
    }
  };

  return (
    <button
      id={toggleId}
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={label}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative shrink-0 cursor-pointer select-none touch-none rounded-full border outline-none transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:focus-visible:outline-white/60 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40",
        isChecked ? colorTheme.trackOn : colorTheme.trackOff,
        className,
      )}
      style={{
        width: config.trackWidth,
        height: config.trackHeight,
      }}
    >
      <span
        ref={auraRef}
        className={cn(
          "pointer-events-none absolute -inset-1 rounded-full blur-md transition-opacity duration-300 motion-reduce:transition-none",
          colorTheme.aura,
        )}
        style={{ opacity: isChecked ? 1 : 0 }}
        aria-hidden="true"
      />

      <svg
        width="0"
        height="0"
        className="pointer-events-none absolute"
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={config.blur}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
            />
          </filter>
        </defs>
      </svg>

      <span
        className="pointer-events-none absolute inset-0 overflow-visible"
        style={{ filter: `url(#${filterId})` }}
      >
        <span
          ref={dropRef}
          className={cn(
            "absolute left-0 rounded-full transition-colors duration-300",
            isChecked ? colorTheme.activeBlob : colorTheme.inactiveBlob,
          )}
          style={{
            width: config.drop,
            height: config.drop,
            top: (config.trackHeight - config.drop) / 2,
          }}
        />
        <span
          ref={thumbRef}
          className={cn(
            "absolute left-0 rounded-full shadow-xs transition-colors duration-300",
            isChecked ? colorTheme.activeBlob : colorTheme.inactiveBlob,
          )}
          style={{
            width: config.thumb,
            height: config.thumb,
            top: (config.trackHeight - config.thumb) / 2,
          }}
        />
      </span>
    </button>
  );
}
