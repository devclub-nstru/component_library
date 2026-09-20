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
    <section className="relative h-screen w-full bg-[#050505] text-[#f4f4f5] flex flex-col justify-between overflow-hidden select-none">
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <Image
          src="/COMP-HE.png"
          alt="Visual artwork"
          fill
          priority
          draggable={false}
          className="object-cover object-center pointer-events-none select-none contrast-110"
        />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
      </div>

      <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 h-full w-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-full border-r border-dashed border-white/8",
              i >= 6 && "hidden sm:block",
              i >= 8 && "hidden md:block"
            )}
          />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none z-20">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon
            points={LANDMARK_POINTS.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.25"
            strokeDasharray="1 1"
          />
        </svg>

        {LANDMARK_POINTS.map((point) => (
          <div
            key={point.id}
            className="absolute w-2 h-2 -ml-1 -mt-1 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.9)]"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
            }}
          />
        ))}
      </div>

      <RepeatingLineScale className="absolute top-0 left-0 right-0 z-30 pointer-events-none" />

      <header className="relative z-30 w-full px-6 sm:px-10 md:px-14 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border border-white flex items-center justify-center p-0.5">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="w-full h-full stroke-white"
              strokeWidth="1.2"
            >
              <rect x="1" y="1" width="14" height="14" />
              <line x1="1" y1="1" x2="15" y2="15" />
              <line x1="15" y1="1" x2="1" y2="15" />
            </svg>
          </div>
          <span className="font-sans text-xl font-medium tracking-tight text-white">
            devclub
          </span>
        </div>

        <nav className="flex items-center gap-6 text-xs text-white/80 font-mono">
          <a
            href="/components"
            className="hover:text-white transition-colors cursor-pointer"
          >
            Components
          </a>
          <a
            href="/docs"
            className="hover:text-white transition-colors cursor-pointer"
          >
            Docs
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors cursor-pointer"
          >
            GitHub
          </a>
        </nav>
      </header>

      <div className="relative z-30 w-full max-w-4xl px-6 sm:px-10 md:px-14 pb-10">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-normal leading-[1.18] text-white/95 tracking-tight">
          Recent news about agricultural innovations driven by material advances and robotics
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
        "h-3 w-full bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.12)_0px,rgba(255,255,255,0.12)_1px,transparent_1px,transparent_8px)] border-y border-white/6",
        className
      )}
    />
  );
};
