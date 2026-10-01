"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { spring } from "motion";
import { motionTokens } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const duration = motionTokens.duration.considered;
const response = spring({
  keyframes: [0, 1],
  stiffness: 450,
  damping: 35,
  mass: 0.8,
  restSpeed: 0.001,
  restDelta: 0.001,
});
const springEase = (progress: number) =>
  progress === 1 ? 1 : response.next(progress * duration * 1000).value;

interface SegmentedControlProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

interface SegmentedControlGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  indicatorClassName?: string;
}

export function SegmentedControlGroup({
  children,
  className,
  indicatorClassName,
  ...props
}: SegmentedControlGroupProps) {
  const buttons = Children.toArray(children).filter(
    isValidElement<{ "aria-pressed"?: boolean }>,
  );
  const selectedIndex = buttons.findIndex(
    (button) => button.props["aria-pressed"],
  );
  const columns = Math.min(buttons.length, 4);
  const rootRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const syncRef = useRef<((immediate?: boolean) => void) | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const indicator = indicatorRef.current;
      if (!root || !indicator) return;

      const media = gsap.matchMedia();
      media.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          animate: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const sync = context.add("sync", (immediate = false) => {
            const selected = root.querySelector<HTMLButtonElement>(
              'button[aria-pressed="true"]',
            );
            gsap.killTweensOf(indicator);
            if (!selected) {
              gsap.to(indicator, {
                autoAlpha: 0,
                duration: context.conditions?.reduce
                  ? 0
                  : motionTokens.duration.fast,
              });
              return;
            }

            gsap.set(indicator, {
              width: selected.offsetWidth,
              height: selected.offsetHeight,
            });
            gsap.to(indicator, {
              x: selected.offsetLeft,
              y: selected.offsetTop,
              autoAlpha: 1,
              duration: immediate || context.conditions?.reduce ? 0 : duration,
              ease: springEase,
              overwrite: "auto",
            });
          });

          syncRef.current = (immediate) => sync(immediate);
          sync(true);
          const observer = new ResizeObserver(() => sync(true));
          observer.observe(root);

          return () => {
            observer.disconnect();
            syncRef.current = null;
            gsap.killTweensOf(indicator);
          };
        },
        root,
      );
      return () => media.revert();
    },
    { scope: rootRef },
  );

  useEffect(() => syncRef.current?.(), [selectedIndex]);

  return (
    <div
      {...props}
      ref={rootRef}
      role="group"
      className={cn(
        "relative isolate grid gap-1.5 rounded-xl border border-orange-400/15 bg-zinc-950/5 p-1.5 dark:bg-black/30",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        columns === 4 && "grid-cols-2 sm:grid-cols-4",
        buttons.length > 4 && "grid-cols-3 sm:grid-cols-6",
        buttons.length > 6 && "grid-cols-2 sm:grid-cols-4",
        className,
      )}
    >
      <span
        ref={indicatorRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-0 top-0 rounded-lg bg-orange-500 shadow-[0_2px_12px_rgba(249,115,22,0.2)]",
          indicatorClassName,
        )}
        style={{ opacity: 0, visibility: "hidden" }}
      />
      {children}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <SegmentedControlGroup className={className}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative z-10 flex min-h-10 cursor-pointer items-center justify-center rounded-lg px-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
            value === option.value
              ? "text-zinc-950"
              : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50",
          )}
        >
          {option.label}
        </button>
      ))}
    </SegmentedControlGroup>
  );
}
