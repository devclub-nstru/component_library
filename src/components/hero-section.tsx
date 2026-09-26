"use client";

import Image from "next/image";
import { cn } from "../lib/utils";

const LANDMARK_POINTS = [
  { id: 1, x: 33.0, y: 4.5 },
  { id: 2, x: 65.2, y: 4.5 },
  { id: 3, x: 67.7, y: 23.6 },
  { id: 4, x: 68.5, y: 46.8 },
  { id: 5, x: 63.4, y: 64.8 },
  { id: 6, x: 51.0, y: 73.8 },
  { id: 7, x: 41.2, y: 64.8 },
  { id: 8, x: 36.0, y: 46.8 },
  { id: 9, x: 33.2, y: 23.6 },
];

export default function HeroSection() {
  return (
    <section className="relative flex-1 min-h-[calc(100vh-4rem)] w-full bg-background text-foreground flex flex-col justify-between overflow-hidden select-none transition-colors duration-200">
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <Image
          src="/COMP-HE.png"
          alt="Visual artwork"
          fill
          priority
          draggable={false}
          className="object-cover object-center pointer-events-none select-none contrast-105 dark:contrast-110 opacity-75 dark:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 bg-white/45 dark:bg-black/30 pointer-events-none transition-colors duration-200" />
      </div>

      <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 h-full w-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-full border-r border-dashed border-border dark:border-white/8",
              i >= 6 && "hidden sm:block",
              i >= 8 && "hidden md:block",
            )}
          />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none z-20">
        <svg
          className="absolute inset-0 w-full h-full text-foreground/25 dark:text-white/20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon
            points={LANDMARK_POINTS.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.25"
            strokeDasharray="1 1"
          />
        </svg>

        {LANDMARK_POINTS.map((point) => (
          <div
            key={point.id}
            className="absolute w-2 h-2 -ml-1 -mt-1 bg-foreground dark:bg-white rounded-full shadow-[0_0_6px_rgba(0,0,0,0.3)] dark:shadow-[0_0_6px_rgba(255,255,255,0.9)]"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
            }}
          />
        ))}
      </div>

      <RepeatingLineScale className="absolute top-0 left-0 right-0 z-30 pointer-events-none" />

      <div className="flex-1" />

      <div className="relative z-30 w-full max-w-4xl px-6 sm:px-10 md:px-14 pb-12">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-normal leading-[1.18] text-foreground dark:text-white/95 tracking-tight transition-colors duration-200">
          Recent news about agricultural innovations driven by material advances
          and robotics
        </h1>
      </div>

      <RepeatingLineScale className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none" />
    </section>
  );
}

export const RepeatingLineScale = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "h-3 w-full bg-[repeating-linear-gradient(90deg,currentColor_0px,currentColor_1px,transparent_1px,transparent_8px)] text-border-subtle border-y border-border",
        className,
      )}
    />
  );
};
