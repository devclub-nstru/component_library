"use client";

import { cn } from "../lib/utils";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-(--bg-primary) transition-colors duration-300 flex items-center justify-center">
      <HorizontalScale className="absolute top-0 left-0 right-0 w-full z-20 pointer-events-none" />
      <HorizontalScale className="absolute bottom-0 left-0 right-0 w-full z-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto w-full h-full flex items-center justify-center p-4 sm:p-6 md:px-12 md:py-10">
        <div className="relative size-full flex items-stretch">
          <VerticalScale className="hidden md:block shrink-0 h-full z-20" />

          <div className="relative flex-1 h-full flex flex-col justify-between border border-(--border-primary) bg-(--bg-card) rounded-lg overflow-hidden transition-all duration-300 shadow-2xl p-6 sm:p-10 md:p-12">
            <div className="absolute inset-0 select-none pointer-events-none opacity-20 dark:opacity-40">
              <img
                src="https://wallpapercave.com/wp/wp4140937.jpg"
                alt="Background artwork"
                className="object-cover size-full"
              />
              <div className="absolute inset-0 bg-linear-to-t from-(--bg-card) via-transparent to-(--bg-card)" />
            </div>

            <nav className="flex items-center justify-between z-20 mt-2">
              <div className="flex items-center gap-6">
                <a
                  href="/components"
                  className="text-(--text-secondary) hover:text-(--text-primary) transition-colors text-xs font-medium"
                >
                  Components
                </a>
                <a
                  href="#features"
                  className="text-(--text-secondary) hover:text-(--text-primary) transition-colors text-xs font-medium"
                >
                  Features
                </a>
                <a
                  href="#setup"
                  className="text-(--text-secondary) hover:text-(--text-primary) transition-colors text-xs font-medium"
                >
                  Setup
                </a>
                <a
                  href="#testimonials"
                  className="text-(--text-secondary) hover:text-(--text-primary) transition-colors text-xs font-medium"
                >
                  Reviews
                </a>
                <a
                  href="/pricing"
                  className="text-(--text-secondary) hover:text-(--text-primary) transition-colors text-xs font-medium"
                >
                  Pricing
                </a>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-md border border-(--border-primary) text-(--text-primary) hover:bg-(--accent-glow) text-xs font-medium transition-all duration-150 cursor-pointer"
                >
                  GitHub
                </a>
                <a
                  href="/auth"
                  className="px-4 py-2 rounded-md bg-linear-to-t from-blue-700 to-blue-400 text-white text-xs font-medium shadow-md hover:opacity-90 transition-all duration-150 cursor-pointer"
                >
                  Get Started
                </a>
              </div>
            </nav>

            <div className="flex flex-col max-w-4xl relative z-20">
              <h1 className="tracking-tight text-(--text-primary) font-heading leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                High Performance UI Components.
                <br />
                Engineered for Speed.
              </h1>
              <p className="tracking-tight text-(--text-muted) text-sm sm:text-base max-w-2xl mt-4 font-light leading-relaxed">
                A premium library of interactive, fully accessible, copy-paste
                React components styled with Tailwind. Build and ship your next
                interface faster.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="/components"
                  className="px-6 py-3 rounded-md bg-linear-to-t from-blue-700 to-blue-400 text-white text-xs font-medium shadow-md hover:opacity-90 transition-all duration-150 cursor-pointer no-underline"
                >
                  Browse Components
                </a>
                <a
                  href="/docs"
                  className="px-6 py-3 rounded-md border border-(--border-accent) text-(--text-primary) hover:bg-(--accent-glow) text-xs font-medium transition-all duration-150 cursor-pointer no-underline"
                >
                  Read Docs
                </a>
              </div>
            </div>
          </div>

          <VerticalScale className="hidden md:block shrink-0 h-full z-20" />
        </div>
      </div>
    </section>
  );
}

export const HorizontalScale = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "h-10 w-full bg-[repeating-linear-gradient(315deg,var(--pattern-line)_0px,var(--pattern-line)_1px,transparent_1px,transparent_10px)] bg-size-[14px_14px] border-y border-(--pattern)",
        className,
      )}
    />
  );
};

export const VerticalScale = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "w-10 h-full bg-[repeating-linear-gradient(315deg,var(--pattern-line)_0px,var(--pattern-line)_1px,transparent_1px,transparent_10px)] bg-size-[14px_14px] border-x border-(--pattern)",
        className,
      )}
    />
  );
};

export const Lines = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "h-14 w-full bg-[repeating-linear-gradient(to_bottom,var(--pattern-line)_0,var(--pattern-line)_1px,transparent_1px,transparent_0.5rem)] border-y border-(--pattern)",
        className,
      )}
    />
  );
};
