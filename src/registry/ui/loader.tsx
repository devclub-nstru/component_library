"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export interface LoaderProps {
  children?: ReactNode;
  progress?: number;
  duration?: number;
  revealDuration?: number;
  stagger?: number;
  columns?: number;
  background?: string;
  foreground?: string;
  label?: string;
  className?: string;
  onComplete?: () => void;
}

const bounded = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

export function Loader({
  children,
  progress,
  duration = 2.2,
  revealDuration = 0.85,
  stagger = 0.09,
  columns = 5,
  background = "#191919",
  foreground = "#f2f0e9",
  label = "Loading",
  className,
  onComplete,
}: LoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const controllerRef = useRef<((value: number) => void) | null>(null);
  const callbackRef = useRef(onComplete);
  const progressRef = useRef(progress);
  const finishedRef = useRef(false);
  const [complete, setComplete] = useState(false);
  const automatic = progress === undefined;
  const panelCount = Math.round(bounded(columns, 5, 2, 12));
  const loadingDuration = bounded(duration, 2.2, 0.3, 30);
  const exitDuration = bounded(revealDuration, 0.85, 0.2, 3);
  const panelStagger = bounded(stagger, 0.09, 0, 0.3);

  useEffect(() => {
    callbackRef.current = onComplete;
    progressRef.current = progress;
  }, [onComplete, progress]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      finishedRef.current = false;
      setComplete(false);

      media.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          animate: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const overlay = overlayRef.current;
          const content = contentRef.current;
          const counter = counterRef.current;
          const number = numberRef.current;
          if (!overlay || !content || !counter || !number) return;

          const panels = gsap.utils.toArray<HTMLElement>(
            "[data-loader-panel]",
            rootRef.current,
          );
          const reduced = Boolean(context.conditions?.reduceMotion);
          const state = { value: 0 };
          let revealing = false;
          let progressTween: gsap.core.Tween | null = null;
          const moveCounter = gsap.quickSetter(counter, "xPercent");
          const alignNumber = gsap.quickSetter(number, "xPercent");

          const renderProgress = () => {
            const value = Math.round(state.value);
            number.textContent = String(value).padStart(2, "0");
            overlay.setAttribute("aria-valuenow", String(value));
            moveCounter(reduced ? 0 : state.value);
            alignNumber(reduced ? 0 : -state.value);
          };

          const finish = () => {
            if (finishedRef.current) return;
            finishedRef.current = true;
            setComplete(true);
            callbackRef.current?.();
          };

          const reveal = context.add("reveal", () => {
            if (revealing || finishedRef.current) return;
            revealing = true;
            if (reduced) {
              gsap.set(overlay, { autoAlpha: 0 });
              gsap.set(content, { y: 0 });
              finish();
              return;
            }

            gsap
              .timeline({
                defaults: { ease: "power3.inOut" },
                onComplete: finish,
              })
              .to(counter, { autoAlpha: 0, y: -16, duration: 0.18 })
              .to(
                panels,
                { yPercent: -100, duration: exitDuration, stagger: panelStagger },
                ">+=0.12",
              )
              .to(
                content,
                { y: 0, duration: exitDuration, ease: "power3.out" },
                "<+=0.12",
              )
              .set(overlay, { autoAlpha: 0 });
          }) as () => void;

          gsap.set(overlay, { autoAlpha: finishedRef.current ? 0 : 1 });
          gsap.set(content, { y: reduced || finishedRef.current ? 0 : 24 });
          gsap.set(counter, { autoAlpha: 1, y: 0 });
          gsap.set(panels, { yPercent: 0 });
          renderProgress();

          const updateProgress = context.add("updateProgress", (value: number) => {
            if (revealing || finishedRef.current) return;
            const target = bounded(value, 0, 0, 100);
            progressTween?.kill();
            if (reduced) {
              state.value = target;
              renderProgress();
              if (target === 100) reveal();
              return;
            }
            progressTween = gsap.to(state, {
              value: target,
              duration: 0.45,
              ease: "power2.out",
              onUpdate: renderProgress,
              onComplete: () => {
                if (target === 100) reveal();
              },
            });
          }) as (value: number) => void;

          controllerRef.current = updateProgress;
          if (!finishedRef.current) {
            if (automatic) {
              if (reduced) updateProgress(100);
              else {
                gsap
                  .timeline({
                    defaults: { ease: "power2.inOut" },
                    onUpdate: renderProgress,
                    onComplete: reveal,
                  })
                  .to(state, { value: 16, duration: loadingDuration * 0.14 })
                  .to(state, { value: 16, duration: loadingDuration * 0.07 })
                  .to(state, { value: 40, duration: loadingDuration * 0.18 })
                  .to(state, { value: 40, duration: loadingDuration * 0.09 })
                  .to(state, { value: 61, duration: loadingDuration * 0.16 })
                  .to(state, { value: 61, duration: loadingDuration * 0.08 })
                  .to(state, { value: 100, duration: loadingDuration * 0.2 })
                  .to(state, { value: 100, duration: loadingDuration * 0.08 });
              }
            } else updateProgress(progressRef.current ?? 0);
          }

          return () => {
            progressTween?.kill();
            controllerRef.current = null;
          };
        },
        rootRef,
      );

      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [
        automatic,
        panelCount,
        loadingDuration,
        exitDuration,
        panelStagger,
      ],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      if (progress !== undefined) controllerRef.current?.(progress);
    },
    { scope: rootRef, dependencies: [progress] },
  );

  return (
    <div
      ref={rootRef}
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
        aria-valuenow={0}
        aria-hidden={complete}
        className={cn(
          "absolute inset-0 z-20 overflow-hidden",
          complete && "pointer-events-none",
        )}
        style={{ color: foreground }}
      >
        <div aria-hidden="true" className="absolute inset-0 flex">
          {Array.from({ length: panelCount }, (_, index) => (
            <div
              key={index}
              data-loader-panel
              className="h-full min-w-0 flex-1 will-change-transform"
              style={{
                backgroundColor: background,
                marginRight: index < panelCount - 1 ? -1 : 0,
              }}
            />
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-x-[6%] top-[7%]">
          <div ref={counterRef} className="w-full will-change-transform">
            <span
              ref={numberRef}
              className="inline-block text-[clamp(3.5rem,13cqw,10rem)] leading-none font-semibold tracking-[-0.075em] tabular-nums will-change-transform"
            >
              00
            </span>
          </div>
        </div>
      </div>
      <span role="status" className="sr-only">
        {complete ? "Content ready" : label}
      </span>
    </div>
  );
}

export default Loader;
