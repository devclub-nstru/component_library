"use client";

import dynamic from "next/dynamic";
import type { OrbState } from "thinking-orbs";

const ThinkingOrb = dynamic(
  () => import("thinking-orbs").then((m) => m.ThinkingOrb),
  { ssr: false }
);

export type OrbProps = {
  state: OrbState;
  size?: 64 | 20;
  display?: number;
  paused?: boolean;
};

export function Orb({ state, size = 64, display, paused }: OrbProps) {
  const px = display ?? size;
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center"
      style={{ width: px, height: px }}
      aria-hidden
    >
      <ThinkingOrb
        state={state}
        size={size}
        theme="dark"
        paused={paused}
        style={{ width: px, height: px, display: "block" }}
      />
    </span>
  );
}
