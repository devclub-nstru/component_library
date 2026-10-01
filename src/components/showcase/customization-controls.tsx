"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { SegmentedControlGroup } from "./segmented-control";

export function CustomizationRange({
  min = 0,
  max = 100,
  value,
  className,
  style,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const progress =
    ((Number(value ?? min) - Number(min)) / (Number(max) - Number(min))) * 100;

  return (
    <input
      {...props}
      type="range"
      min={min}
      max={max}
      value={value}
      style={{
        backgroundImage: `linear-gradient(to right, #000 ${progress}%, var(--border) ${progress}%)`,
        backgroundSize: "100% 4px",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        ...style,
      }}
      className={cn(
        "h-7 w-full min-w-0 cursor-pointer appearance-none rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm dark:[&::-webkit-slider-thumb]:outline dark:[&::-webkit-slider-thumb]:outline-white/40 [&::-moz-range-thumb]:size-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm dark:[&::-moz-range-thumb]:outline dark:[&::-moz-range-thumb]:outline-white/40",
        className,
      )}
    />
  );
}

export function ColorSwatches<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: string; color: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <SegmentedControlGroup
      aria-label="Accent color"
      className="flex flex-wrap justify-start gap-2 border-0 bg-transparent p-0 dark:bg-transparent"
      indicatorClassName="rounded-full border-2 border-foreground bg-transparent shadow-none ring-0"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-label={option.label}
          aria-pressed={value === option.value}
          title={option.label}
          onClick={() => onChange(option.value)}
          className="relative z-10 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span
            className="size-6 rounded-full border border-black/10 shadow-sm dark:border-white/15"
            style={{ backgroundColor: option.color }}
          />
        </button>
      ))}
    </SegmentedControlGroup>
  );
}
