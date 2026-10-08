"use client";

import React, {
  useState,
  useMemo,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";
import { cn } from "@/lib/utils";

export type SparkleButtonSize = "sm" | "default" | "lg";
export type SparkleButtonVariant = "default" | "outline" | "glass";
export type BlurAnimateBy = "letters" | "words";
export type BlurDirection = "top" | "bottom";

export interface SparkleButtonProps extends Omit<
  HTMLMotionProps<"button">,
  "children"
> {
  variant?: SparkleButtonVariant;
  text?: string;
  activeText?: string;
  loading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  size?: SparkleButtonSize;
  icon?: React.ReactNode;
  animateBy?: BlurAnimateBy;
  direction?: BlurDirection;
  delay?: number;
  stepDuration?: number;
  dissolveDuration?: number;
  springStiffness?: number;
  springDamping?: number;
}

const sizeStyles: Record<SparkleButtonSize, string> = {
  sm: "h-8 px-4 text-xs gap-2 [&_svg]:size-3.5",
  default: "h-10 px-5 text-sm gap-2.5 [&_svg]:size-4",
  lg: "h-12 px-7 text-base gap-3 [&_svg]:size-5",
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>,
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

export const SparkleButton = React.forwardRef<
  HTMLButtonElement,
  SparkleButtonProps
>(
  (
    {
      className,
      variant = "default",
      text = "Generate Magic",
      activeText = "Generating...",
      loading,
      onLoadingChange,
      size = "default",
      icon,
      animateBy = "letters",
      direction = "top",
      delay = 40,
      stepDuration = 0.35,
      dissolveDuration = 0.2,
      springStiffness = 350,
      springDamping = 28,
      onClick,
      disabled,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const [internalLoading, setInternalLoading] = useState(false);
    const isControlled = loading !== undefined;
    const isLoading = isControlled ? loading : internalLoading;

    const idleMeasureRef = useRef<HTMLSpanElement>(null);
    const activeMeasureRef = useRef<HTMLSpanElement>(null);
    const [measuredWidths, setMeasuredWidths] = useState<{
      idle: number;
      active: number;
    }>({ idle: 0, active: 0 });

    const updateMeasurements = () => {
      if (idleMeasureRef.current && activeMeasureRef.current) {
        const idleW = Math.ceil(
          idleMeasureRef.current.getBoundingClientRect().width,
        );
        const activeW = Math.ceil(
          activeMeasureRef.current.getBoundingClientRect().width,
        );
        setMeasuredWidths({ idle: idleW, active: activeW });
      }
    };

    useIsomorphicLayoutEffect(() => {
      updateMeasurements();
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready.then(updateMeasurements);
      }
      window.addEventListener("resize", updateMeasurements);
      return () => window.removeEventListener("resize", updateMeasurements);
    }, [text, activeText, size]);

    const targetWidth = isLoading ? measuredWidths.active : measuredWidths.idle;
    const currentTargetText = isLoading ? activeText : text;

    const segments = useMemo(() => {
      if (animateBy === "words") {
        return currentTargetText.split(" ");
      }
      return currentTargetText.split("");
    }, [currentTargetText, animateBy]);

    const defaultFrom = useMemo(
      () =>
        direction === "top"
          ? { filter: "blur(10px)", opacity: 0, y: -12 }
          : { filter: "blur(10px)", opacity: 0, y: 12 },
      [direction],
    );

    const defaultTo = useMemo(
      () => [
        {
          filter: "blur(4px)",
          opacity: 0.65,
          y: direction === "top" ? 2 : -2,
        },
        { filter: "blur(0px)", opacity: 1, y: 0 },
      ],
      [direction],
    );

    const stepCount = defaultTo.length + 1;
    const times = useMemo(
      () =>
        Array.from({ length: stepCount }, (_, i) =>
          stepCount === 1 ? 0 : i / (stepCount - 1),
        ),
      [stepCount],
    );

    const animateKeyframes = useMemo(
      () => buildKeyframes(defaultFrom, defaultTo),
      [defaultFrom, defaultTo],
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (!isControlled) {
        setInternalLoading((prev) => !prev);
      }
      onLoadingChange?.(!isLoading);
      onClick?.(e);
    };

    const getVariantStyles = () => {
      switch (variant) {
        case "outline":
          return cn(
            "bg-white text-zinc-900 border border-zinc-200 shadow-xs hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-sm focus-visible:ring-zinc-400 focus-visible:ring-offset-background",
            "dark:bg-zinc-950/80 dark:text-zinc-100 dark:border-white/15 dark:shadow-none dark:hover:bg-zinc-900 dark:hover:border-white/25 dark:focus-visible:ring-white/40 dark:focus-visible:ring-offset-black",
            "after:opacity-0",
          );
        case "glass":
          return cn(
            "bg-zinc-100/80 text-zinc-900 border border-zinc-300/80 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_14px_rgba(0,0,0,0.06)] hover:bg-zinc-100 hover:border-zinc-400 focus-visible:ring-zinc-400 focus-visible:ring-offset-background",
            "dark:bg-white/6 dark:text-white dark:border-white/15 dark:backdrop-blur-md dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_4px_16px_rgba(0,0,0,0.5)] dark:hover:bg-white/10 dark:hover:border-white/25 dark:focus-visible:ring-white/40 dark:focus-visible:ring-offset-black",
            "after:opacity-0",
          );
        default:
          return cn(
            "bg-zinc-900 text-white border-zinc-800 shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.25),0px_4px_14px_-2px_rgba(0,0,0,0.22),0px_1px_2px_0px_rgba(0,0,0,0.12)] hover:bg-black hover:border-zinc-700 hover:shadow-[inset_0px_1px_1.5px_0px_rgba(255,255,255,0.35),0px_8px_20px_-4px_rgba(0,0,0,0.28)] focus-visible:ring-zinc-950/40 focus-visible:ring-offset-background",
            "dark:bg-[#0d0d0f] dark:text-white dark:border-white/15 dark:shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.22),inset_0px_2px_3px_0px_rgba(255,255,255,0.1),inset_0px_-2px_4px_0px_rgba(0,0,0,0.5),0px_4px_16px_-2px_rgba(0,0,0,0.8),0px_1px_2px_0px_rgba(0,0,0,0.4)] dark:hover:border-white/30 dark:hover:shadow-[inset_0px_1px_1.5px_0px_rgba(255,255,255,0.35),inset_0px_2px_4px_0px_rgba(255,255,255,0.15),inset_0px_-2px_4px_0px_rgba(0,0,0,0.5),0px_8px_24px_-4px_rgba(0,0,0,0.9),0px_0px_16px_0px_rgba(255,255,255,0.06)] dark:hover:brightness-105 dark:focus-visible:ring-white/40 dark:focus-visible:ring-offset-black",
            "after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]",
          );
      }
    };

    return (
      <div className="relative inline-flex items-center justify-center p-1 select-none">
        <motion.button
          ref={ref}
          type="button"
          aria-busy={isLoading}
          disabled={disabled}
          onClick={handleClick}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className={cn(
            "group relative inline-flex items-center justify-center rounded-full font-medium select-none overflow-hidden cursor-pointer",
            "transition-[border-color,box-shadow,filter,background-color] duration-300 ease-out",
            "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
            "after:absolute after:top-0 after:left-[12%] after:right-[12%] after:h-px after:pointer-events-none",
            getVariantStyles(),
            sizeStyles[size],
            className,
          )}
          {...props}
        >
          <span
            ref={idleMeasureRef}
            aria-hidden="true"
            className="invisible absolute pointer-events-none opacity-0 select-none whitespace-nowrap tracking-tight font-medium"
          >
            {text}
          </span>
          <span
            ref={activeMeasureRef}
            aria-hidden="true"
            className="invisible absolute pointer-events-none opacity-0 select-none whitespace-nowrap tracking-tight font-medium"
          >
            {activeText}
          </span>

          <span className="sr-only">{currentTargetText}</span>

          <span
            aria-hidden="true"
            className="relative z-10 flex items-center justify-center gap-2.5"
          >
            {icon ? (
              <span className="shrink-0">{icon}</span>
            ) : (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                animate={
                  isLoading && !reduceMotion
                    ? {
                        scale: [1, 1.15, 1],
                        filter: [
                          "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
                          "drop-shadow(0 0 9px rgba(255,255,255,0.95))",
                          "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
                        ],
                      }
                    : {
                        scale: 1,
                        filter: "drop-shadow(0 0 2px rgba(255,255,255,0.4))",
                      }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : isLoading
                      ? {
                          duration: 1.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                      : { duration: 0.25 }
                }
                className={cn(
                  "shrink-0 transition-colors duration-300",
                  variant === "outline" || variant === "glass"
                    ? "fill-zinc-700 group-hover:fill-zinc-950 dark:fill-[#e8e8e8] dark:group-hover:fill-white"
                    : "fill-[#e8e8e8] group-hover:fill-white",
                )}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                />
              </motion.svg>
            )}

            <motion.div
              animate={targetWidth > 0 ? { width: targetWidth } : undefined}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      stiffness: springStiffness,
                      damping: springDamping,
                      mass: 0.8,
                    }
              }
              style={{ willChange: "width" }}
              className="relative inline-flex items-center justify-center overflow-hidden"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={isLoading ? "active" : "idle"}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0, transition: { duration: 0 } }
                      : {
                          opacity: 0,
                          filter: "blur(8px)",
                          y: direction === "top" ? 8 : -8,
                          transition: {
                            duration: dissolveDuration,
                            ease: [0.16, 1, 0.3, 1] as const,
                          },
                        }
                  }
                  className={cn(
                    "inline-flex items-center justify-center tracking-tight font-medium whitespace-nowrap",
                    variant === "outline" || variant === "glass"
                      ? "text-zinc-900 dark:text-white"
                      : "text-white",
                  )}
                >
                  {segments.map((segment, index) => (
                    <motion.span
                      key={`${isLoading ? "act" : "idl"}-${index}`}
                      initial={reduceMotion ? false : defaultFrom}
                      animate={
                        reduceMotion
                          ? { filter: "blur(0px)", opacity: 1, y: 0 }
                          : animateKeyframes
                      }
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : {
                              duration: stepDuration,
                              times,
                              delay: (index * delay) / 1000,
                              ease: [0.16, 1, 0.3, 1] as const,
                            }
                      }
                      style={{
                        display: "inline-block",
                        willChange: "transform, filter, opacity",
                      }}
                    >
                      {segment === " " ? "\u00A0" : segment}
                      {animateBy === "words" &&
                        index < segments.length - 1 &&
                        "\u00A0"}
                    </motion.span>
                  ))}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </span>
        </motion.button>
      </div>
    );
  },
);

SparkleButton.displayName = "SparkleButton";

export default SparkleButton;
