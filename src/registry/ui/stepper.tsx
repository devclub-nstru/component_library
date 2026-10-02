"use client";

import { forwardRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface StepperProps {
  steps: { id: string; title: string; description?: string }[];
  currentStep: number;
  onStepChange?: (step: number) => void;
  disabled?: boolean;
  orientation?: "auto" | "horizontal" | "vertical";
  showDescriptions?: boolean;
  animated?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const Stepper = forwardRef<HTMLElement, StepperProps>(function Stepper({
  steps,
  currentStep,
  onStepChange,
  disabled = false,
  orientation = "auto",
  showDescriptions = true,
  animated = true,
  className,
  ariaLabel = "Progress",
}, ref) {
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion || !animated;
  const current = Number.isFinite(currentStep)
    ? Math.max(0, Math.min(steps.length, Math.trunc(currentStep)))
    : 0;
  const transition = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 32 };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const buttons = Array.from(event.currentTarget.closest("ol")?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []);
    const index = buttons.indexOf(event.currentTarget);
    const target = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : index + (["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1);
    event.preventDefault();
    buttons[Math.max(0, Math.min(buttons.length - 1, target))]?.focus();
  };

  if (steps.length === 0) return null;

  return (
    <nav ref={ref} aria-label={ariaLabel} data-orientation={orientation} className={cn("@container group/stepper", className)}>
      <ol className="flex flex-col gap-6 @md:group-data-[orientation=auto]/stepper:flex-row group-data-[orientation=horizontal]/stepper:flex-row @md:group-data-[orientation=auto]/stepper:gap-0 group-data-[orientation=horizontal]/stepper:gap-0">
        {steps.map((step, index) => {
          const complete = index < current;
          const active = index === current;
          const interactive = Boolean(onStepChange);
          const contents = (
            <>
              <motion.span
                animate={{ scale: active && !reduced ? 1.06 : 1 }}
                transition={transition}
                className={cn(
                  "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border text-sm font-medium shadow-[0_4px_10px_-4px_rgba(0,0,0,0.25),inset_0_1px_3px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.6),inset_0_1px_3px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.2)]",
                  complete
                    ? "border-zinc-700 bg-[radial-gradient(120%_80%_at_50%_70%,#3f3f46_0%,#18181b_100%)] text-white dark:border-zinc-200 dark:bg-[radial-gradient(120%_80%_at_50%_70%,#ffffff_0%,#e4e4e7_100%)] dark:text-zinc-950"
                    : active
                      ? "border-zinc-400 bg-[radial-gradient(120%_80%_at_50%_70%,#ffffff_0%,#e4e4e7_100%)] text-zinc-950 ring-4 ring-zinc-900/5 dark:border-white/40 dark:bg-[radial-gradient(120%_80%_at_50%_70%,#3f3f46_0%,#18181b_100%)] dark:text-zinc-100 dark:ring-white/10"
                      : "border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-500",
                )}
                aria-hidden="true"
              >
                <span className="pointer-events-none absolute inset-x-1 top-0 h-1/2 rounded-t-full bg-linear-to-b from-white/25 to-transparent" />
                <AnimatePresence mode="wait" initial={false}>
                  {complete ? (
                    <motion.svg key="check" viewBox="0 0 24 24" className="h-5 w-5" fill="none" initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
                      <path
                        d="m5 12 4 4 10-10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  ) : (
                    <motion.span key="number" initial={{ opacity: 0, y: reduced ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -6 }} transition={transition}>
                      {index + 1}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>
              <span className="min-w-0 text-left @md:group-data-[orientation=auto]/stepper:text-center group-data-[orientation=horizontal]/stepper:text-center">
                <span className={cn("block text-xs font-medium", complete || active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400")}>
                  {step.title}
                </span>
                {showDescriptions && step.description && <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">{step.description}</span>}
                <span className="sr-only">{complete ? ", completed" : active ? ", current step" : ", upcoming"}</span>
              </span>
            </>
          );

          return (
            <li key={step.id} aria-current={active ? "step" : undefined} className="relative min-w-0 @md:group-data-[orientation=auto]/stepper:flex-1 group-data-[orientation=horizontal]/stepper:flex-1">
              {index < steps.length - 1 && (
                <span aria-hidden="true" className="absolute left-[calc(1.25rem-1.5px)] top-10 h-[calc(100%-1rem)] w-[3px] text-zinc-300 @md:group-data-[orientation=auto]/stepper:left-[calc(50%+1.5rem)] group-data-[orientation=horizontal]/stepper:left-[calc(50%+1.5rem)] @md:group-data-[orientation=auto]/stepper:top-[calc(1.25rem-1.5px)] group-data-[orientation=horizontal]/stepper:top-[calc(1.25rem-1.5px)] @md:group-data-[orientation=auto]/stepper:h-[3px] group-data-[orientation=horizontal]/stepper:h-[3px] @md:group-data-[orientation=auto]/stepper:w-[calc(100%-3rem)] group-data-[orientation=horizontal]/stepper:w-[calc(100%-3rem)] dark:text-zinc-700">
                  <motion.span animate={{ opacity: complete ? 0 : 1 }} initial={false} transition={transition} className="absolute inset-0 bg-[radial-gradient(circle,currentColor_1px,transparent_1.5px)] bg-[length:8px_8px] bg-center" />
                  <motion.span animate={{ opacity: complete ? 1 : 0 }} initial={false} transition={transition} className="absolute inset-px rounded-full bg-zinc-900 dark:bg-zinc-100" />
                </span>
              )}
              {interactive ? (
                <button type="button" disabled={disabled || index > current} onClick={() => onStepChange?.(index)} onKeyDown={handleKeyDown} className="relative flex w-full items-center gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-4 focus-visible:ring-offset-white disabled:cursor-default @md:group-data-[orientation=auto]/stepper:flex-col group-data-[orientation=horizontal]/stepper:flex-col @md:group-data-[orientation=auto]/stepper:gap-3 group-data-[orientation=horizontal]/stepper:gap-3 dark:focus-visible:ring-offset-zinc-950">
                  {contents}
                </button>
              ) : (
                <div className="relative flex items-center gap-3 @md:group-data-[orientation=auto]/stepper:flex-col group-data-[orientation=horizontal]/stepper:flex-col @md:group-data-[orientation=auto]/stepper:gap-3 group-data-[orientation=horizontal]/stepper:gap-3">{contents}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

Stepper.displayName = "Stepper";
