"use client";

import {
  Children,
  isValidElement,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Cross2Icon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import { CandyButton } from "@/registry/ui/candy-button";
import { motionTokens } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export function CustomizationDock({ children }: { children: ReactNode }) {
  const controls = Children.toArray(children);
  const paletteOnly =
    controls.length === 1 &&
    isValidElement<{ "data-customization-palette"?: number }>(controls[0]) &&
    Boolean(controls[0].props["data-customization-palette"]);
  const paletteCount =
    paletteOnly &&
    isValidElement<{ "data-customization-palette"?: number }>(controls[0])
      ? (controls[0].props["data-customization-palette"] ?? 0)
      : 0;
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotionRef = useRef(false);
  const panelId = useId();

  useGSAP(
    () => {
      const root = rootRef.current;
      const surface = surfaceRef.current;
      const content = contentRef.current;
      const trigger = triggerRef.current;
      if (!root || !surface || !content || !trigger) return;

      const media = gsap.matchMedia();
      media.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          animate: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const reduced = Boolean(context.conditions?.reduce);
          reducedMotionRef.current = reduced;
          let lastWidth = 0;
          let lastHeight = 0;

          const buildTimeline = context.add("resize", () => {
            const width = root.offsetWidth;
            const height = root.offsetHeight;
            if (width === lastWidth && height === lastHeight) return;
            lastWidth = width;
            lastHeight = height;
            const previous = timelineRef.current;
            const progress = previous?.progress() ?? (openRef.current ? 1 : 0);
            const moving = previous?.isActive();
            previous?.kill();

            const timeline = gsap.timeline({
              paused: true,
              defaults: { ease: "power3.inOut" },
              onComplete: () => {
                if (openRef.current)
                  closeRef.current?.focus({ preventScroll: true });
              },
              onReverseComplete: () => {
                if (!openRef.current) trigger.focus({ preventScroll: true });
              },
            });

            timeline
              .fromTo(
                surface,
                {
                  clipPath: `inset(${Math.max(0, height - 56)}px 0px 0px ${Math.max(0, width - 56)}px round 28px)`,
                },
                {
                  clipPath: "inset(0px 0px 0px 0px round 24px)",
                  duration: motionTokens.duration.considered + 0.1,
                },
                0,
              )
              .fromTo(
                trigger,
                { autoAlpha: 1, scale: 1 },
                {
                  autoAlpha: 0,
                  scale: 0.86,
                  duration: motionTokens.duration.fast,
                },
                0,
              )
              .fromTo(
                content,
                { autoAlpha: 0, y: reduced ? 0 : 12 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: motionTokens.duration.standard,
                  ease: "power2.out",
                },
                0.24,
              );

            timelineRef.current = timeline;
            timeline.progress(
              reduced ? Number(openRef.current) : progress,
              true,
            );
            if (!reduced && moving) {
              if (openRef.current) timeline.play();
              else timeline.reverse();
            }
          });

          buildTimeline();
          const observer = new ResizeObserver(() => buildTimeline());
          observer.observe(root);

          const illumination = reduced
            ? null
            : gsap.to("[data-dock-light]", {
                xPercent: (index) => (index === 0 ? 18 : -16),
                yPercent: (index) => (index === 0 ? -12 : 14),
                scale: 1.15,
                duration: 4.5,
                stagger: 0.7,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
              });

          const syncVisibility = () => {
            illumination?.paused(document.hidden);
          };
          syncVisibility();
          document.addEventListener("visibilitychange", syncVisibility);

          return () => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", syncVisibility);
            illumination?.kill();
            timelineRef.current?.kill();
            timelineRef.current = null;
          };
        },
        root,
      );

      return () => media.revert();
    },
    { scope: rootRef },
  );

  const toggle = (nextOpen: boolean) => {
    openRef.current = nextOpen;
    setOpen(nextOpen);
    const timeline = timelineRef.current;
    if (!timeline) return;
    if (reducedMotionRef.current) {
      timeline.progress(Number(nextOpen));
    } else if (nextOpen) {
      timeline.timeScale(1).play();
    } else {
      timeline.timeScale(1.15).reverse();
    }
  };

  if (controls.length === 0) return null;

  return (
    <div
      ref={rootRef}
      data-state={open ? "open" : "closed"}
      className="pointer-events-none absolute bottom-4 right-4 z-30 flex max-h-[calc(100%-2rem)] flex-col max-sm:fixed max-sm:max-h-[60dvh]"
      style={{
        width: `min(${paletteOnly ? paletteCount * 44 + 40 : 640}px, calc(100% - 2rem))`,
      }}
      onKeyDown={(event) => {
        if (
          event.key === "Escape" &&
          !event.defaultPrevented &&
          openRef.current
        ) {
          event.preventDefault();
          event.stopPropagation();
          toggle(false);
        }
      }}
    >
      <div
        ref={surfaceRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl border border-border bg-panel shadow-[0_12px_40px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:bg-[#101010] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.08)]"
        style={{ clipPath: "inset(100% 0 0 100% round 28px)" }}
      >
        <span
          data-dock-light
          className="absolute -bottom-20 -left-16 h-56 w-96 rounded-full bg-[radial-gradient(ellipse,rgba(0,0,0,0.04),transparent_70%)] dark:bg-[radial-gradient(ellipse,rgba(255,255,255,0.04),transparent_70%)]"
        />
        <span
          data-dock-light
          className="absolute -right-20 -top-24 h-64 w-96 rounded-full bg-[radial-gradient(ellipse,rgba(0,0,0,0.03),transparent_70%)] dark:bg-[radial-gradient(ellipse,rgba(255,255,255,0.03),transparent_70%)]"
        />
        <span className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent" />
      </div>

      <div
        ref={contentRef}
        id={panelId}
        role="region"
        aria-label="Component customization"
        aria-hidden={!open}
        inert={!open}
        style={{ opacity: 0, visibility: "hidden" }}
        className={cn(
          "relative flex min-h-0 flex-col rounded-3xl",
          open && "pointer-events-auto",
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 px-5 pb-2 pt-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            <MixerHorizontalIcon className="size-3.5 text-foreground" />
            Customization
          </div>
          <button
            ref={closeRef}
            type="button"
            aria-label="Hide customization"
            onClick={() => toggle(false)}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-muted text-muted-foreground hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
          >
            <Cross2Icon className="size-3.5" />
          </button>
        </div>
        <div className="flex min-h-0 flex-col gap-2 overflow-y-auto overscroll-contain px-2 pb-2 scrollbar-thin [&>div]:mx-0! [&>div]:w-full! [&>div]:max-w-none! [&>div]:rounded-2xl! [&>div]:border-0! [&>div]:bg-transparent! [&>div]:shadow-none! [&>div]:backdrop-blur-none!">
          {controls}
        </div>
      </div>

      <CandyButton
        ref={triggerRef}
        type="button"
        color="#000000"
        glow={false}
        size="icon"
        aria-label="Show customization"
        aria-controls={panelId}
        aria-expanded={open}
        aria-hidden={open}
        tabIndex={open ? -1 : 0}
        title="Customize component"
        onClick={() => toggle(true)}
        className="pointer-events-auto absolute bottom-0 right-0 size-14! rounded-full! transition-none! active:scale-100 border border-white/20 focus-visible:ring-foreground/50 focus-visible:ring-offset-background [&_svg]:size-5"
      >
        <MixerHorizontalIcon />
      </CandyButton>
    </div>
  );
}
