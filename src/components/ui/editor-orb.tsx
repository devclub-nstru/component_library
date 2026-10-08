"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type OrbVariant =
  | "S1"
  | "S2"
  | "S3"
  | "breathing"
  | "searching"
  | "working"
  | "solving"
  | "listening"
  | "connecting"
  | "weaving"
  | "composing"
  | "shaping"
  | string;

export interface OrbProps {
  variant?: OrbVariant;
  label?: string;
  size?: number;
  className?: string;
  interactive?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const variantGradients: Record<
  string,
  { core: string; glow: string; ring: string }
> = {
  S1: {
    core: "from-emerald-400 via-teal-500 to-cyan-600",
    glow: "rgba(16, 185, 129, 0.45)",
    ring: "border-emerald-400/40",
  },
  S2: {
    core: "from-cyan-400 via-sky-500 to-indigo-600",
    glow: "rgba(6, 182, 212, 0.45)",
    ring: "border-cyan-400/40",
  },
  S3: {
    core: "from-violet-500 via-purple-500 to-amber-400",
    glow: "rgba(139, 92, 246, 0.45)",
    ring: "border-violet-400/50",
  },
  breathing: {
    core: "from-blue-400 via-indigo-500 to-violet-600",
    glow: "rgba(99, 102, 241, 0.4)",
    ring: "border-blue-400/40",
  },
  searching: {
    core: "from-cyan-400 via-blue-500 to-indigo-600",
    glow: "rgba(14, 165, 233, 0.45)",
    ring: "border-cyan-400/40",
  },
  working: {
    core: "from-amber-400 via-orange-500 to-rose-500",
    glow: "rgba(245, 158, 11, 0.45)",
    ring: "border-amber-400/40",
  },
};

export function Orb({
  variant = "S1",
  label,
  size = 20,
  className,
  interactive = false,
  onClick,
}: OrbProps) {
  const reduceMotion = useReducedMotion();
  const theme = variantGradients[variant] ?? variantGradients.S3;

  return (
    <div
      role="img"
      aria-label={label ?? `AI Orb: ${variant}`}
      onClick={onClick}
      style={{ width: size, height: size }}
      className={cn(
        "relative flex shrink-0 items-center justify-center select-none",
        interactive && "cursor-pointer hover:scale-105 transition-transform",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-[-30%] rounded-full blur-[6px] transition-colors duration-500"
        style={{ background: theme.glow }}
      />

      <motion.div
        animate={
          reduceMotion
            ? { scale: 1 }
            : {
                scale: [0.92, 1.08, 0.92],
                rotate: variant === "S2" ? [0, 180, 360] : [0, 0, 0],
              }
        }
        transition={{
          repeat: Infinity,
          duration: variant === "S2" ? 3 : 2.4,
          ease: "easeInOut",
        }}
        className={cn(
          "relative h-full w-full rounded-full bg-linear-to-tr shadow-inner",
          theme.core,
        )}
      >
        <div className="absolute inset-0 rounded-full bg-radial from-white/70 via-transparent to-black/30" />
      </motion.div>

      <motion.div
        animate={
          reduceMotion
            ? { rotate: 0 }
            : {
                rotate: [0, 360],
              }
        }
        transition={{
          repeat: Infinity,
          duration: variant === "S3" ? 2.5 : 4,
          ease: "linear",
        }}
        className={cn(
          "pointer-events-none absolute -inset-0.5 rounded-full border border-dashed",
          theme.ring,
        )}
      />
    </div>
  );
}

export function EditorOrb({
  stirring = false,
  className,
}: {
  stirring?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      data-stirring={stirring || undefined}
      className={cn(
        "editor-orb relative flex size-5 shrink-0 items-center justify-center rounded-full overflow-hidden",
        className,
      )}
    >
      <motion.div
        animate={
          reduceMotion
            ? { rotate: 0 }
            : stirring
              ? { rotate: [0, 720], scale: [1, 1.15, 1] }
              : { rotate: [0, 360] }
        }
        transition={{
          repeat: Infinity,
          duration: stirring ? 1.4 : 4,
          ease: stirring ? "easeInOut" : "linear",
        }}
        className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,#8b5cf6,#06b6d4,#10b981,#f59e0b,#8b5cf6)] blur-[1px]"
      />
      <div className="relative size-3.5 rounded-full bg-popover/90 dark:bg-card/90 shadow-sm flex items-center justify-center">
        <div className="size-1.5 rounded-full bg-linear-to-r from-violet-400 to-cyan-400" />
      </div>
    </div>
  );
}

export default Orb;
