"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import { HeroMosaic } from "@/components/hero-mosaic";
import { CandyButton } from "@/registry/ui/candy-button";
import { useIsDark } from "@/lib/use-is-dark";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export default function HeroSection() {
  const rootRef = useRef<HTMLElement>(null);
  const isDark = useIsDark();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out", duration: 1 } })
          .from("[data-hero-copy]", { opacity: 0, y: 18, stagger: 0.11 }, 0.15);
      });
      return () => media.revert();
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const colors = getComputedStyle(root);
      gsap.to(root, {
        "--hero-foreground": colors.getPropertyValue("--foreground").trim(),
        "--hero-muted": colors.getPropertyValue("--muted-foreground").trim(),
        duration: reducedMotion ? 0 : 0.5,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    },
    { scope: rootRef, dependencies: [isDark, reducedMotion] },
  );

  return (
    <section
      ref={rootRef}
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[max(700px,calc(100svh-4rem))] flex-col items-center justify-center overflow-hidden bg-[#f7f7f2] px-6 py-28 text-[color:var(--hero-foreground,var(--foreground))] dark:bg-black sm:min-h-[max(720px,calc(100svh-4rem))] sm:px-10 sm:py-32"
    >
      <HeroMosaic isDark={isDark} />
      <div className="relative z-10 mx-auto flex w-full max-w-170 flex-col items-center text-center">
        <h1
          id="hero-heading"
          data-hero-copy
          className="font-serif text-[clamp(40px,5.5vw,88px)] font-normal leading-[0.99] tracking-[-0.055em]"
        >
          <span className="block">Build interfaces</span>
          <span className="block">that feel as good</span>
          <span className="block">as they look.</span>
        </h1>

        <p
          data-hero-copy
          className="mb-8 mt-7 max-w-100 text-[12px] leading-relaxed text-[color:var(--hero-muted,var(--muted-foreground))] sm:mb-9 sm:text-[14px]"
        >
          Tactile React components. Physical motion.
          <br className="hidden sm:block" />
          {" "}The details that make an interface unforgettable.
        </p>

        <div
          data-hero-copy
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <CandyButton
            as="a"
            role="link"
            href="/components"
            color="#0074d4"
            rightIcon={<ArrowUpRight aria-hidden="true" />}
            className="h-11 rounded-full px-6 text-xs focus-visible:ring-[#0074d4]/60 focus-visible:ring-offset-background motion-reduce:transform-none motion-reduce:transition-none"
          >
            Explore components
          </CandyButton>
          <CandyButton
            as="a"
            role="link"
            href="/docs"
            variant={isDark ? "obsidian" : "pearl"}
            rightIcon={<ArrowUpRight aria-hidden="true" />}
            className="h-11 rounded-full border border-border px-6 text-xs focus-visible:ring-[#0074d4]/60 focus-visible:ring-offset-background motion-reduce:transform-none motion-reduce:transition-none"
          >
            Read the docs
          </CandyButton>
        </div>
      </div>
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
