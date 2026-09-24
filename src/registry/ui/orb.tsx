"use client";

import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import type { OrbState } from "thinking-orbs";
import { cn } from "@/lib/utils";

const ThinkingOrb = dynamic(
  () => import("thinking-orbs").then((m) => m.ThinkingOrb),
  { ssr: false },
);

export const ORB_STATES: OrbState[] = [
  "breathing",
  "searching",
  "working",
  "solving",
  "listening",
  "connecting",
  "weaving",
  "composing",
  "shaping",
];

export interface OrbColorOption {
  label: string;
  value?: string;
  hex: string;
}

export const ORB_COLORS: OrbColorOption[] = [
  { label: "Default", value: undefined, hex: "#ffffff" },
  { label: "Beige", value: "#e8d8c8", hex: "#e8d8c8" },
  { label: "Red", value: "#ef4444", hex: "#ef4444" },
  { label: "Amber", value: "#f59e0b", hex: "#f59e0b" },
  { label: "Emerald", value: "#10b981", hex: "#10b981" },
  { label: "Cyan", value: "#06b6d4", hex: "#06b6d4" },
  { label: "Blue", value: "#3b82f6", hex: "#3b82f6" },
  { label: "Violet", value: "#8b5cf6", hex: "#8b5cf6" },
  { label: "Rose", value: "#ec4899", hex: "#ec4899" },
];

export interface OrbProps {
  state?: OrbState;
  defaultState?: OrbState;
  size?: 64 | 20;
  display?: number;
  paused?: boolean;
  speed?: number;
  theme?: "dark" | "light" | "auto";
  color?: string;
  interactive?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>, nextState: OrbState) => void;
  onStateChange?: (state: OrbState) => void;
}

export function Orb({
  state: controlledState,
  defaultState = "breathing",
  size = 64,
  display,
  paused = false,
  speed = 1,
  theme = "dark",
  color,
  interactive = true,
  className,
  onClick,
  onStateChange,
}: OrbProps) {
  const isControlled = controlledState !== undefined;
  const [internalState, setInternalState] = useState<OrbState>(defaultState);
  const currentState = isControlled ? controlledState : internalState;

  const px = display ?? size;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const currentIndex = ORB_STATES.indexOf(currentState);
      const nextIndex = (currentIndex + 1) % ORB_STATES.length;
      const nextState = ORB_STATES[nextIndex];

      if (!isControlled) {
        setInternalState(nextState);
      }
      onStateChange?.(nextState);
      onClick?.(e, nextState);
    },
    [currentState, isControlled, onClick, onStateChange],
  );

  const canvas = (
    <ThinkingOrb
      state={currentState}
      size={size}
      theme={theme}
      speed={speed}
      paused={paused}
      color={color}
      style={{ width: px, height: px, display: "block" }}
    />
  );

  if (!interactive && !onClick) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center select-none",
          className,
        )}
        style={{ width: px, height: px }}
        aria-hidden
      >
        {canvas}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Orb state is ${currentState}. Click to cycle state.`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center p-0 border-0 bg-transparent cursor-pointer select-none transition-transform duration-200 ease-out hover:scale-105 active:scale-95 outline-none rounded-full focus-visible:ring-1 focus-visible:ring-white/20",
        className,
      )}
      style={{ width: px, height: px }}
    >
      {canvas}
    </button>
  );
}

export const ThinkingOrbComponent = Orb;
