"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BentoCard, BentoGrid } from "@/registry/ui/bento-grid";
import {
  LandingButtonsPreview,
  LandingClockPreview,
  LandingControlsPreview,
  LandingCurvedNavbarPreview,
  LandingNavigationPreview,
  LandingOrbPreview,
} from "@/components/landing-component-previews";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function FeatureCard({
  number,
  label,
  title,
  description,
  href,
  className,
  children,
}: {
  number: string;
  label: string;
  title: string;
  description: string;
  href: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <BentoCard
      data-landing-feature
      role="article"
      aria-label={title}
      title={title}
      description={description}
      className={`min-w-0 justify-start rounded-[22px] border-black/10 bg-white/65 p-1.5 shadow-none hover:border-[#0080fc]/30 hover:bg-white/80 hover:shadow-none dark:border-white/10 dark:bg-[#080808] dark:hover:border-[#0080fc]/35 dark:hover:bg-[#0a0a0a] motion-reduce:transition-none [&>div]:gap-0 [&_h3]:px-5 [&_h3]:pt-5 [&_h3]:text-[16px] [&_h3]:font-medium [&>div>p]:px-5 [&>div>p]:pb-6 [&>div>p]:pt-2 [&>div>p]:text-[12px] [&>div>p]:leading-relaxed ${className}`}
      header={
        <div data-feature-preview className="relative flex h-64 flex-col rounded-[16px] bg-[#f2f2ec] dark:bg-black">
          <div className="flex shrink-0 items-center justify-between gap-3 px-4 pt-4">
            <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              <span className="mr-2 text-[#0074d4] dark:text-[#0080fc]">{number}</span>{label}
            </span>
            <Link
              href={href}
              aria-label={`Explore ${label.toLowerCase()}`}
              className="rounded-full p-1 text-muted-foreground hover:text-[#0074d4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0080fc]"
            >
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4">{children}</div>
        </div>
      }
    />
  );
}

export function LandingComponentsSection() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-landing-feature]", rootRef.current).forEach((card) => {
          gsap.from(card, {
            y: 24,
            autoAlpha: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 94%", once: true },
          });
        });
      });
      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-labelledby="inside-heading"
      className="bg-[#f7f7f2] px-5 pb-36 pt-2 text-foreground dark:bg-black sm:px-10 sm:pb-44"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-9 sm:mb-11">
          <h2
            id="inside-heading"
            className="font-serif text-[clamp(36px,4vw,56px)] font-normal leading-none tracking-[-0.045em]"
          >
            What’s inside.
          </h2>
        </header>
        <BentoGrid className="grid-cols-1 gap-4 md:grid-cols-6 xl:grid-cols-12">
          <FeatureCard
            number="01"
            label="Buttons"
            title="Built to be pressed."
            description="A little depth. A little mischief. Buttons that do more than sit there looking clickable."
            href="/components/candy-button"
            className="md:col-span-3 xl:col-span-5"
          >
            <LandingButtonsPreview />
          </FeatureCard>
          <FeatureCard
            number="02"
            label="Controls"
            title="Your kind of precise."
            description="Slide it. Switch it. Find the sweet spot. The small interactions deserve good physics, too."
            href="/components/slider"
            className="md:col-span-3 xl:col-span-4"
          >
            <LandingControlsPreview />
          </FeatureCard>
          <FeatureCard
            number="03"
            label="Navigation"
            title="Find your flow."
            description="Fluid navigation that follows your lead. Getting around should feel this good."
            href="/components/gooey-nav"
            className="md:col-span-3 xl:col-span-3"
          >
            <LandingNavigationPreview />
          </FeatureCard>
          <FeatureCard
            number="04"
            label="Curved Navbar"
            title="A better way around."
            description="A sculpted menu that opens with intention. Fluid curves, clear paths, and room to explore."
            href="/components/curved-navbar"
            className="md:col-span-3 xl:col-span-4"
          >
            <LandingCurvedNavbarPreview />
          </FeatureCard>
          <FeatureCard
            number="05"
            label="Orb"
            title="A thought with some presence."
            description="An expressive little signal. Breathing, searching, working—every state has its own rhythm."
            href="/components/orb"
            className="md:col-span-3 xl:col-span-5"
          >
            <LandingOrbPreview />
          </FeatureCard>
          <FeatureCard
            number="06"
            label="Clocks"
            title="Good timing is everything."
            description="Real time. Mechanical charm. Because even a Tuesday deserves a better clock."
            href="/components/flip-clock"
            className="md:col-span-3 xl:col-span-3"
          >
            <LandingClockPreview />
          </FeatureCard>
        </BentoGrid>
      </div>
    </section>
  );
}
