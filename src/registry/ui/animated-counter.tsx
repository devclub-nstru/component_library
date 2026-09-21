"use client";

import { memo, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ComponentProps, ReactNode, Ref } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";

export type Grouping = "western" | "indian";

export interface AnimatedCounterProps
  extends Omit<
    ComponentProps<"span">,
    | "children"
    | "prefix"
    | "onAnimationStart"
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
  > {
  value: number;
  decimals?: number;
  duration?: number;
  padStart?: number;
  separator?: string;
  decimalSeparator?: string;
  grouping?: Grouping;
  prefix?: ReactNode;
  suffix?: ReactNode;
  gooey?: boolean;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const BAND = 10;
const WHEEL = [...DIGITS, ...DIGITS, ...DIGITS];
const LINE_HEIGHT = 1.5;

const MASK_GRADIENT = `linear-gradient(to bottom,
  rgba(0,0,0,0) 0%,
  rgba(0,0,0,0.08) 6%,
  rgba(0,0,0,0.6) 13%,
  rgba(0,0,0,0.96) 20%,
  #000 28%,
  #000 72%,
  rgba(0,0,0,0.96) 80%,
  rgba(0,0,0,0.6) 87%,
  rgba(0,0,0,0.08) 94%,
  rgba(0,0,0,0) 100%)`;

const LEAVE_TRANSITION: Transition = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1],
};

const INSTANT_TRANSITION: Transition = {
  duration: 0,
};

const createSpring = (duration: number): Transition => ({
  type: "spring",
  visualDuration: duration,
  bounce: 0.16,
});

const SIZER_NODES = DIGITS.map((digit) => (
  <span key={digit} aria-hidden className="invisible [grid-area:1/1]">
    {digit}
  </span>
));

const STACK_NODES = WHEEL.map((digit, index) => (
  <span
    key={index}
    className="flex items-center justify-center select-none"
    style={{ height: `${LINE_HEIGHT}em` }}
  >
    {digit}
  </span>
));

const REGEX_WESTERN = /\B(?=(\d{3})+(?!\d))/g;
const REGEX_INDIAN = /\B(?=(\d{2})+(?!\d))/g;

function formatInteger(whole: string, separator: string, grouping: Grouping) {
  if (!separator) return whole;
  if (grouping !== "indian") return whole.replace(REGEX_WESTERN, separator);

  const head = whole.slice(0, -3);
  if (!head) return whole;
  return `${head.replace(REGEX_INDIAN, separator)}${separator}${whole.slice(-3)}`;
}

interface Measurement {
  amount: number;
  scaled: number;
  places: number;
  duration: number;
  width: number;
}

function computeMetrics(
  value: number,
  decimals: number,
  padStart: number,
  duration: number,
): Measurement {
  const amount = Number.isFinite(value) ? value : 0;
  const places = Math.min(15, Math.max(0, Math.trunc(decimals)));
  const pad = Math.min(24, Math.max(1, Math.trunc(padStart)));
  const scaled = Math.min(
    Number.MAX_SAFE_INTEGER,
    Math.round(Math.abs(amount) * 10 ** places),
  );

  return {
    amount,
    scaled,
    places,
    duration: Math.min(60, Math.max(0.01, duration)),
    width: Math.max(String(scaled).length, places + pad),
  };
}

function stringifyValue(
  metrics: Measurement,
  separator: string,
  decimalSeparator: string,
  grouping: Grouping,
) {
  const raw = String(metrics.scaled).padStart(metrics.width, "0");
  const whole = formatInteger(
    raw.slice(0, raw.length - metrics.places) || "0",
    separator,
    grouping,
  );
  return metrics.places
    ? `${whole}${decimalSeparator}${raw.slice(raw.length - metrics.places)}`
    : whole;
}

type CounterCell =
  | { type: "digit"; key: number; digit: number }
  | { type: "mark"; key: string; char: string };

function buildCells(formatted: string, width: number): CounterCell[] {
  const result: CounterCell[] = [];
  let place = 0;
  let markIndex = 0;

  for (const char of formatted) {
    if (char >= "0" && char <= "9") {
      markIndex = 0;
      result.push({
        type: "digit",
        key: width - place++,
        digit: Number(char),
      });
    } else {
      result.push({
        type: "mark",
        key: `mark-${width - place}-${markIndex++}`,
        char,
      });
    }
  }

  return result;
}

function useContinuousWheel(
  initialDigit: number,
  targetDigit: number,
  direction: number,
  duration: number,
  reduced: boolean,
) {
  const pos = useMotionValue(BAND + initialDigit);
  const headingRef = useRef(direction);

  useEffect(() => {
    headingRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (reduced) {
      pos.set(BAND + targetDigit);
      return;
    }

    const current = pos.get();
    const currentFace = ((Math.round(current) % 10) + 10) % 10;
    let diff = targetDigit - currentFace;

    if (headingRef.current > 0 && diff <= 0) diff += 10;
    if (headingRef.current < 0 && diff >= 0) diff -= 10;

    const nextTarget = current + diff;
    const animation = animate(pos, nextTarget, createSpring(duration));

    return () => {
      animation.stop();
      pos.set(BAND + targetDigit);
    };
  }, [targetDigit, duration, reduced, pos]);

  return useTransform(pos, (p) => `${(-p * 100) / WHEEL.length}%`);
}

interface DigitSlotProps {
  reduced: boolean;
  dep: number;
  transition: Transition;
  filterId?: string;
}

const DigitColumn = memo(function DigitColumn({
  digit,
  from,
  direction,
  duration,
  slot,
  ref,
}: {
  digit: number;
  from: number;
  direction: number;
  duration: number;
  slot: DigitSlotProps;
  ref?: Ref<HTMLSpanElement>;
}) {
  const y = useContinuousWheel(from, digit, direction, duration, slot.reduced);

  return (
    <motion.span
      ref={ref}
      data-slot="animated-counter-digit"
      layout={!slot.reduced}
      layoutDependency={slot.dep}
      transition={slot.transition}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: slot.reduced ? INSTANT_TRANSITION : LEAVE_TRANSITION,
      }}
      className="relative inline-grid overflow-hidden select-none"
      style={{
        height: `${LINE_HEIGHT}em`,
        lineHeight: LINE_HEIGHT,
        maskImage: MASK_GRADIENT,
        WebkitMaskImage: MASK_GRADIENT,
        filter: slot.filterId ? `url(#${slot.filterId})` : undefined,
      }}
    >
      {SIZER_NODES}
      <motion.span style={{ y }} className="absolute inset-x-0 top-0">
        {STACK_NODES}
      </motion.span>
    </motion.span>
  );
});

function GooeyDef({ id }: { id: string }) {
  return (
    <svg
      className="absolute w-0 h-0 pointer-events-none opacity-0 overflow-hidden"
      aria-hidden="true"
      tabIndex={-1}
    >
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.65" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -6"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

export function AnimatedCounter({
  value,
  decimals = 0,
  duration = 0.6,
  padStart = 1,
  separator = ",",
  decimalSeparator = ".",
  grouping = "western",
  prefix,
  suffix,
  gooey = true,
  className,
  ...props
}: AnimatedCounterProps) {
  const generatedId = useId().replace(/:/g, "_");
  const filterId = `gooey_${generatedId}`;
  const reduced = useReducedMotion() ?? false;

  const metrics = computeMetrics(value, decimals, padStart, duration);
  const formatted = stringifyValue(metrics, separator, decimalSeparator, grouping);
  const cells = buildCells(formatted, metrics.width);
  const isNegative = metrics.amount < 0 && metrics.scaled > 0;

  const [previous, setPrevious] = useState(metrics.amount);
  const [direction, setDirection] = useState(1);

  if (previous !== metrics.amount) {
    setDirection(metrics.amount >= previous ? 1 : -1);
    setPrevious(metrics.amount);
  }

  const [seedFaces] = useState(() => {
    const initial: Record<number, number> = {};
    for (const cell of cells) {
      if (cell.type === "digit") initial[cell.key] = cell.digit;
    }
    return initial;
  });

  const springTransition = useMemo<Transition>(
    () => (reduced ? INSTANT_TRANSITION : createSpring(metrics.duration)),
    [reduced, metrics.duration],
  );

  const slotProps: DigitSlotProps = {
    reduced,
    dep: formatted.length,
    transition: springTransition,
    filterId: gooey && !reduced ? filterId : undefined,
  };

  return (
    <span
      data-slot="animated-counter"
      className={cn("inline-flex items-center tabular-nums relative", className)}
      {...props}
    >
      {gooey && !reduced && <GooeyDef id={filterId} />}

      {prefix != null && (
        <motion.span
          layout={!reduced}
          layoutDependency={formatted.length}
          transition={springTransition}
          className="inline-block"
        >
          {prefix}
        </motion.span>
      )}

      <span className="sr-only">
        {isNegative ? "-" : ""}
        {formatted}
      </span>

      <span aria-hidden className="inline-flex select-none items-center">
        {isNegative && (
          <motion.span
            layout={!reduced}
            layoutDependency={formatted.length}
            transition={springTransition}
            className="inline-block"
          >
            -
          </motion.span>
        )}
        <AnimatePresence mode="popLayout" initial={false}>
          {cells.map((cell) =>
            cell.type === "digit" ? (
              <DigitColumn
                key={cell.key}
                digit={cell.digit}
                from={seedFaces[cell.key] ?? cell.digit}
                direction={direction}
                duration={metrics.duration}
                slot={slotProps}
              />
            ) : (
              <motion.span
                key={cell.key}
                data-slot="animated-counter-mark"
                layout={!reduced}
                layoutDependency={formatted.length}
                transition={springTransition}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: reduced ? INSTANT_TRANSITION : LEAVE_TRANSITION,
                }}
                className="inline-block"
              >
                {cell.char}
              </motion.span>
            ),
          )}
        </AnimatePresence>
      </span>

      {suffix != null && (
        <motion.span
          layout={!reduced}
          layoutDependency={formatted.length}
          transition={springTransition}
          className="inline-block"
        >
          {suffix}
        </motion.span>
      )}
    </span>
  );
}

export default AnimatedCounter;
