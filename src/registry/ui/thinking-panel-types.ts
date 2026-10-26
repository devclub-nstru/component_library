import type { ReactNode } from "react";

export interface ThinkingSource {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface ThinkingStep {
  id: string;
  label: string;
}

export type ThinkingStatus = "thinking" | "complete" | "error";

export const thinkingPanelBounded = (
  value: number,
  fallback: number,
  min: number,
  max: number,
) => (Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback);

export function thinkingSourceUrl(href?: string) {
  if (!href) return undefined;
  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}
