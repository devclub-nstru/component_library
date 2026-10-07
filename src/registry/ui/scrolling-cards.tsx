"use client";

import { useId, useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface ScrollingCardItem {
  id: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  color?: string;
}

export interface ScrollingCardsProps {
  items: readonly ScrollingCardItem[];
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  stackGap?: number;
  scaleStep?: number;
  stiffness?: number;
  friction?: number;
  cardHeight?: number;
  borderRadius?: number;
  showIntro?: boolean;
  className?: string;
  ariaLabel?: string;
}

const bounded = (value: number, min: number, max: number, fallback: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

export function ScrollingCards({
  items,
  title = "A story worth scrolling.",
  subtitle = "Scroll down. Let every card become part of the story.",
  eyebrow = "THE COLLECTION",
  stackGap = 24,
  scaleStep = 0.05,
  stiffness = 260,
  friction = 32,
  cardHeight = 420,
  borderRadius = 24,
  showIntro = true,
  className,
  ariaLabel = "Scrolling card collection",
}: ScrollingCardsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const gap = bounded(stackGap, 0, 40, 24);
  const scale = bounded(scaleStep, 0, 0.1, 0.05);
  const tension = bounded(stiffness, 80, 500, 260);
  const damping = bounded(friction, 12, 60, 32);
  const height = bounded(cardHeight, 240, 600, 420);
  const radius = bounded(borderRadius, 0, 40, 24);

  useGSAP(
    () => {
      const root = rootRef.current;
      const collection = collectionRef.current;
      if (!root || !collection || items.length === 0) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-scrolling-card]",
        root,
      );
      const stages = gsap.utils.toArray<HTMLElement>(
        "[data-scrolling-stage]",
        root,
      );
      const media = gsap.matchMedia();

      media.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          animate: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const reduced = Boolean(context.conditions?.reduce);
          root.dataset.reducedMotion = String(reduced);
          let viewportHeight = 0;
          let viewportWidth = 0;
          let fittedGap = 0;

          const measure = () => {
            viewportHeight = root.clientHeight;
            viewportWidth = root.clientWidth;
            const available = Math.max(0, viewportHeight - 64);
            fittedGap = Math.min(gap, available / Math.max(1, items.length + 3));
            const fittedHeight = Math.min(
              height,
              Math.max(0, available - (items.length - 1) * fittedGap),
            );
            root.style.setProperty("--sc-viewport", `${viewportHeight}px`);
            root.style.setProperty("--sc-height", `${fittedHeight}px`);
            root.style.setProperty(
              "--sc-top",
              `${Math.max(24, (viewportHeight - fittedHeight - (items.length - 1) * fittedGap) / 2)}px`,
            );
          };

          measure();
          let timeline: gsap.core.Timeline | undefined;
          let trigger: ScrollTrigger | undefined;
          let position = 0;
          let target = 0;
          let velocity = 0;
          let ticking = false;

          const stop = () => {
            gsap.ticker.remove(tick);
            ticking = false;
          };

          const tick = (_time: number, deltaTime: number) => {
            const elapsed = Math.min(deltaTime / 1000, 0.064);
            const steps = Math.max(1, Math.ceil(elapsed / (1 / 120)));
            const step = elapsed / steps;
            for (let index = 0; index < steps; index++) {
              velocity +=
                (tension * (target - position) - damping * velocity) * step;
              position += velocity * step;
            }
            timeline?.progress(gsap.utils.clamp(0, 1, position));
            if (
              Math.abs(target - position) < 0.00005 &&
              Math.abs(velocity) < 0.0005
            ) {
              position = target;
              velocity = 0;
              timeline?.progress(target);
              stop();
            }
          };

          if (!reduced && items.length > 1) {
            gsap.set(stages, { y: (index) => (index === 0 ? 0 : viewportHeight) });
            gsap.set(cards, { scale: 1, transformOrigin: "center top" });
            const stageSetters = stages.map((stage) =>
              gsap.quickSetter(stage, "y", "px"),
            );
            const scaleSetters = cards.map((card) =>
              gsap.quickSetter(card, "scale"),
            );
            const stackTimeline = gsap.timeline({
              paused: true,
              defaults: { duration: 1, ease: "none" },
            });
            timeline = stackTimeline;

            stages.slice(1).forEach((stage, index) => {
              const cardIndex = index + 1;
              stackTimeline.fromTo(
                stage,
                { y: () => viewportHeight },
                { y: () => cardIndex * fittedGap, immediateRender: false },
                index,
              );
              cards.slice(0, cardIndex).forEach((card, previousIndex) => {
                stackTimeline.to(
                  card,
                  { scale: Math.max(0.65, 1 - (cardIndex - previousIndex) * scale) },
                  index,
                );
              });
            });

            const refresh = (self: ScrollTrigger) => {
              stop();
              position = target = self.progress;
              velocity = 0;
              stageSetters.forEach((setY, index) =>
                setY(index === 0 ? 0 : viewportHeight),
              );
              scaleSetters.forEach((setScale) => setScale(1));
              timeline?.invalidate().progress(position);
            };

            trigger = ScrollTrigger.create({
              scroller: root,
              trigger: collection,
              start: () => collection.offsetTop,
              end: () => collection.offsetTop + (items.length - 1) * viewportHeight,
              onUpdate: (self) => {
                target = self.progress;
                if (!ticking) {
                  ticking = true;
                  gsap.ticker.add(tick);
                }
              },
              onRefresh: (self) => refresh(self),
            });
          }

          const observer = new ResizeObserver(() => {
            if (
              root.clientHeight === viewportHeight &&
              root.clientWidth === viewportWidth
            )
              return;
            measure();
            trigger?.refresh();
          });
          observer.observe(root);

          return () => {
            observer.disconnect();
            stop();
            delete root.dataset.reducedMotion;
            ["--sc-viewport", "--sc-height", "--sc-top"].forEach((property) =>
              root.style.removeProperty(property),
            );
          };
        },
        root,
      );

      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [items, gap, scale, tension, damping, height, showIntro],
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      className={cn(
        "scrolling-cards @container/sc relative isolate h-[600px] w-full overflow-x-hidden overflow-y-auto overscroll-contain bg-[#090909] font-sans text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60",
        className,
      )}
      style={{ "--sc-radius": `${radius}px` } as CSSProperties}
    >
      <style>{`
        .scrolling-cards {
          --sc-viewport: 600px;
          --sc-height: 420px;
          --sc-top: 66px;
          scrollbar-color: #505050 #090909;
          scrollbar-width: thin;
        }
        .scrolling-cards [data-scrolling-list] {
          position: sticky;
          top: 0;
          height: var(--sc-viewport);
          overflow: clip;
        }
        .scrolling-cards [data-scrolling-stage] {
          position: absolute;
          inset: 0;
          padding-top: var(--sc-top);
        }
        .scrolling-cards [data-scrolling-card] {
          height: var(--sc-height);
          border-radius: var(--sc-radius);
          transform-origin: center top;
        }
        .scrolling-cards [data-scrolling-stage]:not(:first-child) {
          transform: translateY(var(--sc-viewport));
        }
        .scrolling-cards[data-reduced-motion="true"] [data-scrolling-collection] {
          height: auto !important;
        }
        .scrolling-cards[data-reduced-motion="true"] [data-scrolling-list] {
          position: relative;
          height: auto;
          overflow: visible;
        }
        .scrolling-cards[data-reduced-motion="true"] [data-scrolling-stage] {
          position: relative;
          padding: 16px 0;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .scrolling-cards [data-scrolling-collection] { height: auto !important; }
          .scrolling-cards [data-scrolling-list] { position: relative; height: auto; overflow: visible; }
          .scrolling-cards [data-scrolling-stage] { position: relative; padding: 16px 0; transform: none; }
        }
      `}</style>
      {showIntro && (
        <header
          className="flex flex-col items-center justify-center gap-5 px-6 text-center"
          style={{ height: "calc(var(--sc-viewport) * 0.6)" }}
        >
          <p className="font-mono text-[10px] tracking-[0.28em] text-white/50">
            {eyebrow}
          </p>
          <h2
            id={headingId}
            className="max-w-xl text-[clamp(28px,5cqi,58px)] font-medium leading-[1.08] tracking-[-0.055em] text-balance"
          >
            {title}
          </h2>
          <p className="max-w-sm text-xs leading-relaxed text-white/55 @lg/sc:text-sm">
            {subtitle}
          </p>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/70">
            Scroll to explore
            <ArrowDown className="size-3.5" aria-hidden="true" />
          </span>
        </header>
      )}
      <div
        ref={collectionRef}
        data-scrolling-collection
        className="relative"
        style={{ height: `calc(var(--sc-viewport) * ${items.length})` }}
      >
        <ol
          data-scrolling-list
          aria-labelledby={showIntro ? headingId : undefined}
          aria-label={showIntro ? undefined : "Cards"}
          className="m-0 list-none p-0"
        >
          {items.map((item, index) => (
            <li
              key={item.id}
              data-scrolling-stage
              style={{ zIndex: index + 1 }}
            >
              <article
                data-scrolling-card
                aria-label={item.imageAlt}
                className="relative mx-auto w-[calc(100%-32px)] max-w-4xl overflow-hidden p-0.5 shadow-[0_20px_80px_#0009] @lg/sc:w-[84%]"
                style={{
                  background: `conic-gradient(from 210deg, #ffffff38, ${item.color ?? "#638aff"}, #ffffff28, ${item.color ?? "#638aff"}, #ffffff38)`,
                }}
              >
                <div
                  className="relative h-full w-full overflow-hidden bg-zinc-900"
                  style={{ borderRadius: Math.max(0, radius - 2) }}
                >
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: item.imagePosition ?? "center" }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/20"
                  />
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default ScrollingCards;
