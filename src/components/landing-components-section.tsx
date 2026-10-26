"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FeatureMosaic } from "@/components/feature-mosaic";
import { useIsDark } from "@/lib/use-is-dark";
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
  seed,
  label,
  title,
  description,
  href,
  className,
  children,
}: {
  seed: number;
  label: string;
  title: string;
  description: string;
  href: string;
  className: string;
  children: ReactNode;
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const isDark = useIsDark();

  useGSAP(
    () => {
      const card = previewRef.current?.closest<HTMLElement>("[data-landing-feature]");
      const arrow = card?.querySelector<SVGElement>("[data-feature-arrow]");
      if (!card || !arrow) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        let hovering = false;
        gsap.set(card, { "--mosaic-opacity": 0.42 });
        const lift = gsap.quickTo(card, "y", { duration: 0.5, ease: "power3.out" });
        const mosaic = gsap.quickTo(card, "--mosaic-opacity", { duration: 0.65, ease: "power2.out" });
        const arrowX = gsap.quickTo(arrow, "x", { duration: 0.4, ease: "power3.out" });
        const arrowY = gsap.quickTo(arrow, "y", { duration: 0.4, ease: "power3.out" });
        const sync = () => {
          const active = hovering || Boolean(card.querySelector(":focus-visible"));
          lift(active ? -4 : 0);
          mosaic(active ? 0.8 : 0.42);
          arrowX(active ? 2 : 0);
          arrowY(active ? -2 : 0);
        };
        const enter = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          hovering = true;
          sync();
        };
        const leave = () => {
          hovering = false;
          sync();
        };
        const blur = (event: FocusEvent) => {
          if (event.relatedTarget instanceof Node && card.contains(event.relatedTarget)) return;
          lift(hovering ? -4 : 0);
          mosaic(hovering ? 0.8 : 0.42);
          arrowX(hovering ? 2 : 0);
          arrowY(hovering ? -2 : 0);
        };
        card.addEventListener("pointerenter", enter);
        card.addEventListener("pointerleave", leave);
        card.addEventListener("focusin", sync);
        card.addEventListener("focusout", blur);
        return () => {
          card.removeEventListener("pointerenter", enter);
          card.removeEventListener("pointerleave", leave);
          card.removeEventListener("focusin", sync);
          card.removeEventListener("focusout", blur);
        };
      });
      return () => media.revert();
    },
    { scope: previewRef },
  );

  return (
    <BentoCard
      data-landing-feature
      role="article"
      aria-label={title}
      title={title}
      description={description}
      className={`min-w-0 justify-start rounded-[20px] border-black/12 bg-[#f7f7f2] p-0 shadow-none transition-[border-color] hover:border-[#0080fc]/45 hover:bg-[#f7f7f2] hover:shadow-none focus-within:border-[#0080fc]/45 dark:border-white/12 dark:bg-black dark:hover:border-[#0080fc]/45 dark:hover:bg-black motion-reduce:transition-none [&>div]:gap-0 [&>div>div:first-child]:rounded-none [&>div>div:nth-child(2)]:items-start [&>div>div:nth-child(2)]:gap-3 [&>div>div:nth-child(2)]:px-6 [&>div>div:nth-child(2)]:pt-4 [&>div>div:nth-child(2)>div]:order-2 [&>div>div:nth-child(2)>div]:shrink-0 [&_h3]:min-h-[2.2em] [&_h3]:min-w-0 [&_h3]:flex-1 [&_h3]:font-serif [&_h3]:text-[clamp(24px,2.1vw,28px)] [&_h3]:font-normal [&_h3]:leading-[1.1] [&_h3]:tracking-[-0.035em] [&>div>p]:px-6 [&>div>p]:pb-7 [&>div>p]:pt-2 [&>div>p]:text-[12px] [&>div>p]:leading-[1.7] ${className}`}
      icon={
        <Link
          href={href}
          aria-label={`Explore ${label.toLowerCase()}`}
          className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-[#0080fc]/45 hover:text-[#0074d4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0080fc]"
        >
          <ArrowUpRight data-feature-arrow size={15} aria-hidden="true" />
        </Link>
      }
      header={
        <div ref={previewRef} data-feature-preview className="relative isolate h-72">
          <FeatureMosaic seed={seed} isDark={isDark} />
          <div data-feature-demo className="absolute inset-0 flex items-center justify-center px-6 pb-6 pt-8">{children}</div>
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
      media.add("(prefers-reduced-motion: no-preference)", (context) => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-landing-feature]", rootRef.current);
        const demos = cards.map((card) => card.querySelector("[data-feature-demo]"));
        gsap.set(cards, { autoAlpha: 0 });
        gsap.set(demos, { y: 18 });
        const reveal = context.add("reveal", (batch: HTMLElement[]) => {
          gsap.to(batch, {
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out",
          });
          gsap.to(batch.map((card) => card.querySelector("[data-feature-demo]")), {
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
          });
        });
        ScrollTrigger.batch(cards, {
          start: "top 94%",
          once: true,
          onEnter: (batch) => reveal(batch),
        });
        gsap.from("#inside-heading", {
          autoAlpha: 0,
          y: 14,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 92%", once: true },
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
        <BentoGrid className="grid-cols-1 gap-5 md:grid-cols-6 xl:grid-cols-12">
          <FeatureCard
            seed={0}
            label="Buttons"
            title="Built to be pressed."
            description="A little depth. A little mischief. Buttons that do more than sit there looking clickable."
            href="/components/candy-button"
            className="md:col-span-3 xl:col-span-4"
          >
            <LandingButtonsPreview />
          </FeatureCard>
          <FeatureCard
            seed={1}
            label="Controls"
            title="Your kind of precise."
            description="Slide it. Switch it. Find the sweet spot. The small interactions deserve good physics, too."
            href="/components/slider"
            className="md:col-span-3 xl:col-span-5"
          >
            <LandingControlsPreview />
          </FeatureCard>
          <FeatureCard
            seed={2}
            label="Navigation"
            title="Find your flow."
            description="Fluid navigation that follows your lead. Getting around should feel this good."
            href="/components/gooey-nav"
            className="md:col-span-3 xl:col-span-3"
          >
            <LandingNavigationPreview />
          </FeatureCard>
          <FeatureCard
            seed={3}
            label="Curved Navbar"
            title="A better way around."
            description="A sculpted menu that opens with intention. Fluid curves, clear paths, and room to explore."
            href="/components/curved-navbar"
            className="md:col-span-3 xl:col-span-5"
          >
            <LandingCurvedNavbarPreview />
          </FeatureCard>
          <FeatureCard
            seed={4}
            label="Orb"
            title="A thought with some presence."
            description="An expressive little signal. Breathing, searching, working—every state has its own rhythm."
            href="/components/orb"
            className="md:col-span-3 xl:col-span-4"
          >
            <LandingOrbPreview />
          </FeatureCard>
          <FeatureCard
            seed={5}
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
