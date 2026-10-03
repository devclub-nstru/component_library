"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { AnimatedCounter } from "./animated-counter";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export interface CursorTrailLoaderProps {
  images: string[];
  children?: ReactNode;
  progress?: number;
  duration?: number;
  revealDuration?: number;
  imageSize?: number;
  imageAspectRatio?: number;
  trailLength?: number;
  trailSpacing?: number;
  trailLifetime?: number;
  followDuration?: number;
  rotation?: number;
  borderRadius?: number;
  background?: string;
  foreground?: string;
  paused?: boolean;
  replayKey?: string | number;
  label?: string;
  className?: string;
  onComplete?: () => void;
}

const bounded = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

export function CursorTrailLoader({
  images,
  children,
  progress,
  duration = 4.2,
  revealDuration = 0.9,
  imageSize = 160,
  imageAspectRatio = 0.8,
  trailLength = 10,
  trailSpacing = 55,
  trailLifetime = 0.8,
  followDuration = 0.2,
  rotation = 18,
  borderRadius = 3,
  background = "#f0efe9",
  foreground = "#171717",
  paused = false,
  replayKey = 0,
  label = "Loading",
  className,
  onComplete,
}: CursorTrailLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<{
    progress: (value: number) => void;
    pause: (value: boolean) => void;
  } | null>(null);
  const callbackRef = useRef(onComplete);
  const progressRef = useRef(progress);
  const pausedRef = useRef(paused);
  const finishedRef = useRef(false);
  const [complete, setComplete] = useState(false);
  const [counter, setCounter] = useState(0);
  const automatic = progress === undefined;
  const sourceKey = JSON.stringify(images);
  const loadingDuration = bounded(duration, 4.2, 0.5, 30);
  const exitDuration = bounded(revealDuration, 0.9, 0.2, 3);
  const size = bounded(imageSize, 160, 60, 360);
  const ratio = bounded(imageAspectRatio, 0.8, 0.5, 2);
  const count = Math.round(bounded(trailLength, 10, 1, 18));
  const spacing = bounded(trailSpacing, 55, 15, 180);
  const lifetime = bounded(trailLifetime, 0.8, 0.15, 3);
  const follow = bounded(followDuration, 0.2, 0.05, 0.6);
  const tilt = bounded(rotation, 18, 0, 40);
  const radius = bounded(borderRadius, 3, 0, 32);

  useEffect(() => {
    callbackRef.current = onComplete;
    progressRef.current = progress;
    pausedRef.current = paused;
    controlRef.current?.pause(paused);
  }, [onComplete, progress, paused]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      finishedRef.current = false;
      setComplete(false);
      setCounter(0);

      media.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          standard: "(prefers-reduced-motion: no-preference)",
          hover: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          const root = rootRef.current;
          const overlay = overlayRef.current;
          const content = contentRef.current;
          const counterElement = counterRef.current;
          if (!root || !overlay || !content || !counterElement) return;

          const reduced = Boolean(context.conditions?.reduced);
          const cards = gsap.utils.toArray<HTMLElement>(
            "[data-cursor-trail-card]",
            root,
          );
          const assets = gsap.utils.toArray<HTMLImageElement>(
            "[data-cursor-trail-asset]",
            root,
          );
          let active = true;
          let revealing = finishedRef.current;
          let waiting = false;
          let bounds = root.getBoundingClientRect();
          let imageWidth = 0;
          let index = 0;
          let anchor: { x: number; y: number } | null = null;
          let previous: { x: number; y: number } | null = null;

          const finish = () => {
            if (!active || finishedRef.current) return;
            finishedRef.current = true;
            setComplete(true);
            callbackRef.current?.();
          };
          const showProgress = (value: number) => {
            setCounter(Math.round(value));
            overlay.setAttribute("aria-valuenow", String(Math.round(value)));
          };

          gsap.set(overlay, {
            autoAlpha: finishedRef.current ? 0 : 1,
            yPercent: 0,
          });
          gsap.set(content, {
            y: reduced || finishedRef.current ? 0 : 24,
          });
          gsap.set(counterElement, { autoAlpha: 1, yPercent: 0 });
          gsap.set(cards, { autoAlpha: 0, xPercent: -50, yPercent: -50 });

          const measure = context.add("measure", () => {
            bounds = root.getBoundingClientRect();
            const nextWidth = Math.min(
              size,
              bounds.width * 0.38,
              bounds.height * ratio * 0.55,
            );
            if (nextWidth === imageWidth) return;
            imageWidth = nextWidth;
            gsap.set(cards, { width: imageWidth, height: imageWidth / ratio });
          }) as () => void;
          measure();

          const trails = cards.map((card) => {
            const place = gsap.quickSetter(card, "css");
            const xTo = gsap.quickTo(card, "x", {
              duration: follow,
              ease: "power3.out",
            });
            const yTo = gsap.quickTo(card, "y", {
              duration: follow,
              ease: "power3.out",
            });
            const animation = gsap
              .timeline({ paused: true })
              .fromTo(
                card,
                { autoAlpha: 0, scale: 0.65 },
                { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power3.out" },
              )
              .to(
                card,
                { autoAlpha: 0, scale: 0.92, duration: 0.5, ease: "power2.inOut" },
                0.22 + lifetime,
              );
            return { card, place, xTo, yTo, animation, used: false };
          });

          const spawn = (event: PointerEvent) => {
            if (
              revealing ||
              finishedRef.current ||
              pausedRef.current ||
              event.pointerType === "touch"
            ) return;
            const point = {
              x: event.clientX - bounds.left,
              y: event.clientY - bounds.top,
            };
            const dx = point.x - (previous?.x ?? point.x);
            const dy = point.y - (previous?.y ?? point.y);
            previous = point;
            if (
              anchor &&
              Math.hypot(point.x - anchor.x, point.y - anchor.y) < spacing
            ) return;
            const available = assets.filter(
              (image) => image.complete && image.naturalWidth > 0,
            );
            if (!available.length) return;
            const trail = trails[index % trails.length];
            const image = trail.card.querySelector("img");
            if (!image) return;
            image.src = available[index % available.length].src;
            const x = gsap.utils.clamp(
              imageWidth * 0.6,
              bounds.width - imageWidth * 0.6,
              point.x,
            );
            const y = gsap.utils.clamp(
              imageWidth / ratio * 0.6,
              bounds.height - imageWidth / ratio * 0.6,
              point.y,
            );
            const angle = gsap.utils.clamp(
              -tilt,
              tilt,
              dx * 0.4 + (index % 3 - 1) * tilt * 0.45,
            );
            trail.place({ rotation: angle, zIndex: ++index });
            trail.xTo(x, x - dx * 0.4);
            trail.yTo(y, y - dy * 0.4);
            trail.used = true;
            trail.animation.restart();
            anchor = point;
          };
          const enter = (event: PointerEvent) => {
            bounds = root.getBoundingClientRect();
            anchor = null;
            previous = null;
            spawn(event);
          };
          const leave = () => {
            anchor = null;
            previous = null;
          };

          if (context.conditions?.hover && !reduced) {
            overlay.addEventListener("pointerenter", enter);
            overlay.addEventListener("pointermove", spawn, { passive: true });
            overlay.addEventListener("pointerleave", leave);
          }

          const timeline = gsap.timeline({ paused: true, onComplete: finish });
          if (!reduced) {
            timeline.fromTo(
              counterElement,
              { yPercent: 110 },
              { yPercent: 0, duration: 0.65, ease: "power3.out" },
            );
          }
          if (automatic && !reduced) {
            [24, 55, 76, 100].forEach((value, stage) => {
              timeline.call(
                () => showProgress(value),
                [],
                loadingDuration * [0.22, 0.47, 0.7, 0.9][stage],
              );
            });
          }
          timeline.addLabel(
            "reveal",
            automatic && !reduced ? loadingDuration : reduced ? 0 : 0.65,
          );
          if (!automatic && (progressRef.current ?? 0) < 100) {
            timeline.addPause("reveal", () => {
              waiting = true;
            });
          }
          timeline
            .to({}, { duration: reduced ? 0 : 0.4 }, "reveal")
            .call(() => {
              revealing = true;
              showProgress(100);
              trails.forEach(({ animation, xTo, yTo }) => {
                animation.pause();
                xTo.tween.pause();
                yTo.tween.pause();
              });
            })
            .addLabel("exit")
            .to(
              cards,
              { autoAlpha: 0, scale: 0.85, duration: reduced ? 0 : 0.3 },
              "exit",
            )
            .to(
              counterElement,
              {
                autoAlpha: 0,
                yPercent: -110,
                duration: reduced ? 0 : 0.35,
                ease: "power3.in",
              },
              "exit",
            )
            .to(
              overlay,
              {
                yPercent: -100,
                duration: reduced ? 0 : exitDuration,
                ease: "power3.inOut",
              },
              reduced ? "exit" : "exit+=0.18",
            )
            .to(
              content,
              {
                y: 0,
                duration: reduced ? 0 : exitDuration,
                ease: "power3.out",
              },
              "<",
            )
            .set(overlay, { autoAlpha: 0 });

          const update = (value: number) => {
            if (automatic || revealing || finishedRef.current) return;
            const target = bounded(value, 0, 0, 100);
            showProgress(target);
            if (target === 100) {
              waiting = false;
              timeline.removePause("reveal");
              if (!pausedRef.current) timeline.play();
            }
          };
          const pause = (value: boolean) => {
            if (value || !waiting) timeline.paused(value);
            trails.forEach(({ animation, xTo, yTo, used }) => {
              if (used && (value || !revealing)) {
                animation.paused(value);
                xTo.tween.paused(value);
                yTo.tween.paused(value);
              }
            });
          };
          controlRef.current = { progress: update, pause };
          if (finishedRef.current) {
            gsap.set(overlay, { autoAlpha: 0 });
          } else {
            if (!automatic) update(progressRef.current ?? 0);
            if (!pausedRef.current) timeline.play();
          }

          const observer = new ResizeObserver(measure);
          observer.observe(root);
          window.addEventListener("scroll", measure, { passive: true, capture: true });

          return () => {
            active = false;
            controlRef.current = null;
            observer.disconnect();
            window.removeEventListener("scroll", measure, true);
            overlay.removeEventListener("pointerenter", enter);
            overlay.removeEventListener("pointermove", spawn);
            overlay.removeEventListener("pointerleave", leave);
          };
        },
        rootRef,
      );
      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [
        sourceKey,
        automatic,
        loadingDuration,
        exitDuration,
        size,
        ratio,
        count,
        spacing,
        lifetime,
        follow,
        tilt,
        radius,
        replayKey,
      ],
      revertOnUpdate: true,
    },
  );

  useEffect(() => {
    if (progress !== undefined) controlRef.current?.progress(progress);
  }, [progress]);

  return (
    <div
      ref={rootRef}
      data-slot="cursor-trail-loader"
      aria-busy={!complete}
      className={cn(
        "relative isolate min-h-80 w-full overflow-hidden [container-type:inline-size]",
        className,
      )}
    >
      <div
        ref={contentRef}
        inert={!complete}
        aria-hidden={!complete}
        className="relative min-h-[inherit]"
      >
        {children}
      </div>
      <div
        ref={overlayRef}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={counter}
        aria-hidden={complete}
        className={cn(
          "absolute inset-0 z-20 overflow-hidden",
          complete && "pointer-events-none",
        )}
        style={{ backgroundColor: background, color: foreground }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
          <div className="hidden">
            {images.map((src, index) => (
              <img
                key={`${src}-${index}`}
                data-cursor-trail-asset
                src={src}
                alt=""
                loading="eager"
                decoding="async"
              />
            ))}
          </div>
          {Array.from({ length: count }, (_, index) => (
            <div
              key={index}
              data-cursor-trail-card
              className="invisible absolute top-0 left-0 overflow-hidden opacity-0 will-change-transform"
              style={{ borderRadius: radius }}
            >
              <img alt="" className="h-full w-full object-cover" decoding="async" />
            </div>
          ))}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[6%] bottom-[5%] z-30 overflow-hidden"
        >
          <div
            ref={counterRef}
            className="text-[clamp(2.75rem,10cqw,7.5rem)] leading-none font-semibold tracking-[-0.07em] tabular-nums"
          >
            <AnimatedCounter
              value={counter}
              padStart={2}
              separator=""
              duration={0.4}
              gooey={false}
            />
          </div>
        </div>
      </div>
      <span role="status" className="sr-only">
        {complete ? "Content ready" : label}
      </span>
    </div>
  );
}

export default CursorTrailLoader;
