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
        backgroundImage: `linear-gradient(to right, #f97316 ${progress}%, rgba(249,115,22,0.18) ${progress}%)`,
        backgroundSize: "100% 4px",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        ...style,
      }}
      className={cn(
        "h-7 w-full min-w-0 cursor-pointer appearance-none rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff8f2] disabled:cursor-not-allowed disabled:opacity-40 dark:focus-visible:ring-offset-[#101010] [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:size-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-orange-500 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm",
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
      indicatorClassName="rounded-full border-2 border-orange-500 bg-transparent shadow-none"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-label={option.label}
          aria-pressed={value === option.value}
          title={option.label}
          onClick={() => onChange(option.value)}
          className="relative z-10 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
