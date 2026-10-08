"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export interface ParallaxStripSlide {
  id: string;
  src: string;
  alt: string;
  title?: string;
  imagePosition?: string;
}

export interface ParallaxStripTransitionProps {
  slides: readonly ParallaxStripSlide[];
  stripCount?: number;
  duration?: number;
  stripStagger?: number;
  zoomFrom?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
  showControls?: boolean;
  reduceMotion?: boolean;
  className?: string;
  ariaLabel?: string;
}

const bounded = (value: number, min: number, max: number, fallback: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

export function ParallaxStripTransition(props: ParallaxStripTransitionProps) {
  return (
    <StripTransitionStage
      key={props.slides
        .map(({ id, src, title }) => `${id}:${src}:${title}`)
        .join("|")}
      {...props}
    />
  );
}

function StripTransitionStage({
  slides,
  stripCount = 10,
  duration = 0.85,
  stripStagger = 0.03,
  zoomFrom = 1.12,
  autoplay = false,
  autoplayInterval = 6000,
  showControls = true,
  reduceMotion = false,
  className,
  ariaLabel = "Image collection",
}: ParallaxStripTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState<{
    index: number;
    direction: 1 | -1;
    ready: boolean;
  } | null>(null);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  const total = slides.length;
  const count = Math.round(bounded(stripCount, 2, 20, 10));
  const timing = bounded(duration, 0.35, 2, 0.85);
  const stagger = bounded(stripStagger, 0, 0.08, 0.03);
  const zoom = bounded(zoomFrom, 1, 1.4, 1.12);
  const interval = bounded(autoplayInterval, 3000, 30000, 6000);
  const active = slides[current];
  const incoming = transition ? slides[transition.index] : null;
  const canAutoplay =
    autoplay &&
    showControls &&
    !reduceMotion &&
    !systemReducedMotion &&
    total > 1;
  const rotating = canAutoplay && !paused && !focused;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (total < 2) return;
    const neighbors = new Set([
      (current + 1) % total,
      (current - 1 + total) % total,
    ]);
    neighbors.forEach((index) => {
      const image = new Image();
      image.src = slides[index].src;
    });
  }, [current, slides, total]);

  const goTo = useCallback(
    (index: number, direction: 1 | -1) => {
      if (busyRef.current || total < 2) return;
      const next = ((index % total) + total) % total;
      if (next === current) return;
      busyRef.current = true;
      setTransition({ index: next, direction, ready: false });
    },
    [current, total],
  );

  useGSAP(
    () => {
      if (!transition?.ready || !rootRef.current) return;
      const { index, direction } = transition;
      const finish = () => {
        setCurrent(index);
        setTransition(null);
        busyRef.current = false;
      };
      const media = gsap.matchMedia();
      media.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          animated: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          if (reduceMotion || context.conditions?.reduced) {
            finish();
            return;
          }
          const root = rootRef.current!;
          const strips = gsap.utils.toArray<HTMLElement>("[data-strip]", root);
          const images = gsap.utils.toArray<HTMLElement>(
            "[data-strip-image]",
            root,
          );
          const revealTime = timing * 0.72;
          const revealEnd = revealTime + (count - 1) * stagger;
          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
            onComplete: finish,
          });
          timeline
            .set("[data-incoming]", { autoAlpha: 1 }, 0)
            .fromTo(
              direction === 1 ? strips : [...strips].reverse(),
              {
                clipPath:
                  direction === 1 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
              },
              { clipPath: "inset(0 0% 0 0%)", duration: revealTime, stagger },
              0,
            )
            .fromTo(
              images,
              { scale: zoom },
              { scale: 1, duration: Math.max(timing, revealEnd) },
              0,
            );
          const currentNumber = root.querySelector("[data-current-number]");
          const incomingNumber = root.querySelector("[data-incoming-number]");
          if (currentNumber && incomingNumber) {
            timeline
              .to(
                currentNumber,
                {
                  yPercent: -110 * direction,
                  autoAlpha: 0,
                  duration: timing * 0.7,
                  ease: "power3.inOut",
                },
                0,
              )
              .fromTo(
                incomingNumber,
                { yPercent: 110 * direction, autoAlpha: 0 },
                {
                  yPercent: 0,
                  autoAlpha: 1,
                  duration: timing * 0.8,
                  ease: "power3.inOut",
                },
                timing * 0.08,
              );
          }
        },
        rootRef,
      );
      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [
        transition,
        current,
        total,
        count,
        timing,
        stagger,
        zoom,
        reduceMotion,
      ],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !canAutoplay || paused || transition) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        let timer: gsap.core.Tween | undefined;
        let visible = false;
        let hovered = false;
        let disposed = false;
        const schedule = () => {
          timer?.kill();
          if (
            !disposed &&
            visible &&
            !document.hidden &&
            !hovered &&
            !root.contains(document.activeElement)
          ) {
            timer = gsap.delayedCall(interval / 1000, () =>
              goTo(current + 1, 1),
            );
          }
        };
        const stop = () => timer?.kill();
        const onPointerEnter = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          hovered = true;
          stop();
        };
        const onPointerLeave = () => {
          hovered = false;
          schedule();
        };
        const onFocusOut = () => {
          stop();
          timer = gsap.delayedCall(0, schedule);
        };
        const observer = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            schedule();
          },
          { threshold: 0.25 },
        );
        observer.observe(root);
        root.addEventListener("pointerenter", onPointerEnter);
        root.addEventListener("pointerleave", onPointerLeave);
        root.addEventListener("focusin", stop);
        root.addEventListener("focusout", onFocusOut);
        document.addEventListener("visibilitychange", schedule);
        return () => {
          disposed = true;
          stop();
          observer.disconnect();
          root.removeEventListener("pointerenter", onPointerEnter);
          root.removeEventListener("pointerleave", onPointerLeave);
          root.removeEventListener("focusin", stop);
          root.removeEventListener("focusout", onFocusOut);
          document.removeEventListener("visibilitychange", schedule);
        };
      });
      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [
        canAutoplay,
        paused,
        transition,
        current,
        interval,
        goTo,
      ],
      revertOnUpdate: true,
    },
  );

  const controlClass =
    "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/35 bg-black/15 text-white backdrop-blur-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black aria-disabled:cursor-wait";

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      aria-busy={Boolean(transition)}
      tabIndex={showControls && total > 1 ? 0 : undefined}
      className={cn(
        "@container relative isolate h-150 min-h-72 w-full touch-pan-y overflow-hidden bg-zinc-950 font-sans text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70",
        className,
      )}
      style={
        {
          "--strip-padding": "clamp(16px, 4cqw, 48px)",
        } as CSSProperties
      }
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setFocused(false);
      }}
      onKeyDown={(event) => {
        if (
          !showControls ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          (event.target as HTMLElement).closest(
            "input,textarea,select,[contenteditable=true]",
          )
        )
          return;
        const destinations: Record<string, [number, 1 | -1]> = {
          ArrowRight: [current + 1, 1],
          ArrowLeft: [current - 1, -1],
          Home: [0, -1],
          End: [total - 1, 1],
        };
        if (destinations[event.key]) {
          event.preventDefault();
          goTo(...destinations[event.key]);
        }
      }}
      onPointerDown={(event) => {
        if (
          event.pointerType !== "touch" ||
          (event.target as HTMLElement).closest("button,a")
        )
          return;
        touchRef.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={(event) => {
        const start = touchRef.current;
        touchRef.current = null;
        if (!start || !showControls) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          goTo(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
        }
      }}
      onPointerCancel={() => {
        touchRef.current = null;
      }}
    >
      {active ? (
        <>
          <img
            src={active.src}
            alt={active.alt}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: active.imagePosition }}
          />
          {incoming && transition && (
            <div
              data-incoming=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 invisible"
            >
              {Array.from({ length: count }, (_, index) => (
                <div
                  key={index}
                  data-strip=""
                  className="absolute inset-y-0 overflow-hidden"
                  style={{
                    left: `${(index * 100) / count}%`,
                    width: `calc(${100 / count}% + 0.5px)`,
                    clipPath: "inset(0 100% 0 0)",
                  }}
                >
                  <div
                    className="absolute inset-y-0"
                    style={{
                      left: `${(-index * 100) / count}cqw`,
                      width: "100cqw",
                    }}
                  >
                    <div
                      data-strip-image=""
                      className="absolute inset-0 will-change-transform"
                    >
                      <img
                        src={incoming.src}
                        alt=""
                        draggable={false}
                        className="h-full w-full object-cover"
                        style={{ objectPosition: incoming.imagePosition }}
                        onLoad={
                          index === 0
                            ? () =>
                                setTransition((pending) =>
                                  pending && !pending.ready
                                    ? { ...pending, ready: true }
                                    : pending,
                                )
                            : undefined
                        }
                        onError={
                          index === 0
                            ? () =>
                                setTransition((pending) =>
                                  pending && !pending.ready
                                    ? { ...pending, ready: true }
                                    : pending,
                                )
                            : undefined
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showControls && total > 1 && (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 bg-linear-to-t from-black/35 to-transparent"
              />
              <footer className="absolute inset-x-[var(--strip-padding)] bottom-[var(--strip-padding)] z-20">
                <div className="flex items-center justify-between gap-4">
                  <div
                    aria-hidden="true"
                    className="flex items-baseline gap-3 font-mono tabular-nums"
                  >
                    <div className="relative h-8 w-9 overflow-hidden text-2xl leading-8">
                      <span data-current-number="" className="block">
                        {String(current + 1).padStart(2, "0")}
                      </span>
                      {transition && (
                        <span
                          data-incoming-number=""
                          className="absolute inset-0 invisible"
                        >
                          {String(transition.index + 1).padStart(2, "0")}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-white/60">
                      {String(total).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {canAutoplay && (
                      <button
                        type="button"
                        aria-label={
                          paused ? "Resume slideshow" : "Pause slideshow"
                        }
                        onClick={() => setPaused((value) => !value)}
                        className={controlClass}
                      >
                        {paused ? (
                          <Play size={16} aria-hidden="true" />
                        ) : (
                          <Pause size={16} aria-hidden="true" />
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label="Previous page"
                      aria-disabled={Boolean(transition)}
                      onClick={() => goTo(current - 1, -1)}
                      className={controlClass}
                    >
                      <ArrowLeft size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next page"
                      aria-disabled={Boolean(transition)}
                      onClick={() => goTo(current + 1, 1)}
                      className={controlClass}
                    >
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </footer>
            </>
          )}
          <p
            className="sr-only"
            role="status"
            aria-live={rotating ? "off" : "polite"}
            aria-atomic="true"
          >
            {active.title ?? active.alt}. Page {current + 1} of {total}.
          </p>
        </>
      ) : null}
    </div>
  );
}
