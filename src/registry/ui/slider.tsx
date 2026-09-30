"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionStyle,
  type MotionValue,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";

export type SliderValue = number | [number, number];

export interface SliderMark {
  value: number;
  label?: string;
}

export interface SliderProps<T extends SliderValue = number> {
  label: string;
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  onValueCommit?: (value: T) => void;
  min?: number;
  max?: number;
  step?: number;
  largeStep?: number;
  marks?: (number | SliderMark)[];
  minStepsBetweenThumbs?: number;
  format?: (value: number) => string;
  showValue?: boolean;
  thumbLabels?: [string, string];
  start?: ReactNode;
  end?: ReactNode;
  description?: ReactNode;
  name?: string;
  disabled?: boolean;
  className?: string;
}

type Part = { key: string; digit: number } | { key: string; text: string };

type Drag = {
  pointer: number;
  index: number | null;
  grab: number;
  x: number;
  raw: number;
  samples: { t: number; p: number }[];
};

const motionTokens = {
  spring: {
    snappy: { visualDuration: 0.35, bounce: 0.15 },
    morph: { visualDuration: 0.45, bounce: 0.1 },
    smooth: { visualDuration: 0.4, bounce: 0 },
  },
  duration: {
    instant: 0.08,
    fast: 0.18,
    normal: 0.3,
  },
  blur: {
    subtle: 1.5,
    soft: 3,
  },
  ease: {
    enter: [0.16, 1, 0.3, 1] as const,
    standard: [0.2, 0, 0, 1] as const,
  },
};

const enterEase = [...motionTokens.ease.enter] as [number, number, number, number];
const exitEase = [...motionTokens.ease.standard] as [number, number, number, number];
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const physical = ({
  visualDuration,
  bounce,
}: {
  visualDuration: number;
  bounce: number;
}) => {
  const root = (2 * Math.PI) / (visualDuration * 1.2);
  return {
    type: "spring" as const,
    stiffness: root * root,
    damping: 2 * (1 - bounce) * root,
    restDelta: 0.002,
    restSpeed: 0.02,
  };
};

const thumbSpring = physical(motionTokens.spring.snappy);
const kickSpring = physical(motionTokens.spring.morph);
const STRETCH = 9;
const BUMP_PX = 150;
const SNAP_PX = 12;

const rubber = (distance: number, limit = STRETCH) =>
  Math.sign(distance) *
  (1 - 1 / ((Math.abs(distance) * 0.55) / limit + 1)) *
  limit;

const project = (velocity: number) => velocity * 0.099;
const decimalsOf = (value: number) => (String(value).split(".")[1] ?? "").length;
const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value));
const isDigit = (char: string) => char >= "0" && char <= "9";

function partsOf(text: string): Part[] {
  const chars = [...text];
  const first = chars.findIndex(isDigit);
  const last = chars.length - 1 - [...chars].reverse().findIndex(isDigit);
  let place = chars.filter(isDigit).length;
  return chars.map((char, index): Part => {
    if (first < 0 || index < first) return { key: `p${index}${char}`, text: char };
    if (index > last) return { key: `s${chars.length - index}${char}`, text: char };
    if (isDigit(char)) return { key: `d${--place}`, digit: Number(char) };
    return { key: `g${place}${char}`, text: char };
  });
}

const slot: Variants = {
  enter: (direction: number) => ({
    width: 0,
    scale: 0.6,
    opacity: 0,
    y: `${direction * 0.3}em`,
    filter: `blur(${motionTokens.blur.soft}px)`,
  }),
  center: {
    width: "auto",
    scale: 1,
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transitionEnd: { filter: "none" },
    transition: {
      width: motionTokens.spring.morph,
      scale: motionTokens.spring.morph,
      opacity: motionTokens.spring.morph,
      y: motionTokens.spring.snappy,
      filter: { duration: 0.22, ease: enterEase },
    },
  },
  exit: (direction: number) => ({
    width: 0,
    scale: 0.6,
    opacity: 0,
    y: `${direction * -0.3}em`,
    filter: `blur(${motionTokens.blur.subtle}px)`,
    transition: {
      width: motionTokens.spring.smooth,
      scale: motionTokens.spring.smooth,
      y: { duration: motionTokens.duration.fast, ease: exitEase },
      opacity: { duration: motionTokens.duration.instant },
      filter: { duration: motionTokens.duration.instant },
    },
  }),
};

const still: Variants = {
  enter: { width: "auto", scale: 1, opacity: 0, y: 0, filter: "none" },
  center: {
    width: "auto",
    scale: 1,
    opacity: 1,
    y: 0,
    filter: "none",
    transition: { duration: motionTokens.duration.instant },
  },
  exit: { width: 0, opacity: 0, transition: { duration: 0 } },
};

function Glyph({
  position,
  digit,
}: {
  position: MotionValue<number>;
  digit: number;
}) {
  const offset = (current: number) => ((((digit - current) % 10) + 15) % 10) - 5;
  const y = useTransform(position, (current) => `${offset(current) * 1.05}em`);
  const opacity = useTransform(
    position,
    (current) => Math.max(0, 1 - Math.abs(offset(current)) ** 1.5 * 1.1)
  );
  const visibility = useTransform(position, (current) =>
    Math.abs(offset(current)) >= 1 ? "hidden" : "visible"
  );
  const filter = useTransform(position, (current) => {
    const distance = Math.abs(offset(current));
    return distance < 0.02 || distance >= 1
      ? "none"
      : `blur(${(distance * motionTokens.blur.soft * 0.75).toFixed(2)}px)`;
  });

  return (
    <motion.span
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none will-change-transform"
      style={{ y, opacity, filter, visibility }}
    >
      {digit}
    </motion.span>
  );
}

function Wheel({ digit, direction }: { digit: number; direction: number }) {
  const reduced = useReducedMotion();
  const position = useMotionValue(digit);
  const wheel = useRef({ digit, target: digit });

  useIsomorphicLayoutEffect(() => {
    const state = wheel.current;
    if (state.digit === digit) return;
    state.target +=
      direction > 0
        ? (digit - state.digit + 10) % 10
        : -((state.digit - digit + 10) % 10);
    state.digit = digit;
    if (reduced) position.jump(state.target);
    else animate(position, state.target, thumbSpring);
  }, [digit, direction, position, reduced]);

  return (
    <>
      <span className="invisible pointer-events-none select-none tabular-nums font-medium">
        0
      </span>
      {DIGITS.map((item) => (
        <Glyph key={item} position={position} digit={item} />
      ))}
    </>
  );
}

function RollingNumber({ value, text }: { value: number; text: string }) {
  const reduced = useReducedMotion();
  const [trail, setTrail] = useState({ value, direction: 1 });

  if (trail.value !== value) {
    setTrail({ value, direction: value > trail.value ? 1 : -1 });
  }
  const direction =
    trail.value === value ? trail.direction : value > trail.value ? 1 : -1;

  return (
    <span className="inline-flex items-baseline overflow-hidden tabular-nums leading-none">
      <AnimatePresence initial={false} custom={direction}>
        {partsOf(text).map((part) => (
          <motion.span
            key={part.key}
            className={
              "digit" in part
                ? "relative inline-flex items-center justify-center overflow-hidden h-[1.15em] align-baseline"
                : "inline-flex items-center justify-center align-baseline"
            }
            custom={direction}
            variants={reduced ? still : slot}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {"digit" in part ? (
              <Wheel digit={part.digit} direction={direction} />
            ) : (
              part.text
            )}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}

const bubbleIn = {
  opacity: 0,
  scale: 0.6,
  y: 6,
  filter: `blur(${motionTokens.blur.subtle}px)`,
};

const bubbleRest = {
  opacity: 1,
  scale: 1,
  y: 0,
  filter: "blur(0px)",
  transitionEnd: { filter: "none" },
};

const bubbleOut = {
  opacity: 0,
  scale: 0.8,
  y: 4,
  filter: `blur(${motionTokens.blur.subtle}px)`,
  transition: { duration: motionTokens.duration.instant, ease: exitEase },
};

const bubbleEnter = {
  ...motionTokens.spring.snappy,
  opacity: { duration: motionTokens.duration.fast, ease: enterEase },
  filter: { duration: motionTokens.duration.fast, ease: enterEase },
};

interface ThumbProps {
  quiet: boolean;
  index: number;
  shown: MotionValue<number>;
  value: number;
  text: string;
  low: number;
  high: number;
  ariaLabel?: string;
  labelledBy?: string;
  active: boolean;
  lifted: boolean;
  bubble: boolean;
  disabled?: boolean;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onFocus: (event: FocusEvent<HTMLDivElement>) => void;
  onBlur: () => void;
}

function Thumb({
  quiet,
  index,
  shown,
  value,
  text,
  low,
  high,
  ariaLabel,
  labelledBy,
  active,
  lifted,
  bubble,
  disabled,
  onKeyDown,
  onFocus,
  onBlur,
}: ThumbProps) {
  const reduced = useReducedMotion();
  const x = useTransform(shown, (current) => `${current - 100}%`);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ x, zIndex: active ? 20 : 10 }}
    >
      <motion.div
        role="slider"
        data-thumb=""
        data-index={index}
        data-active={lifted || undefined}
        data-quiet={quiet || undefined}
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : labelledBy}
        aria-valuemin={low}
        aria-valuemax={high}
        aria-valuenow={value}
        aria-valuetext={text}
        aria-orientation="horizontal"
        aria-disabled={disabled || undefined}
        initial={false}
        animate={{ scale: lifted ? 1.15 : 1 }}
        transition={reduced ? { duration: 0 } : motionTokens.spring.snappy}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cn(
          "pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2",
          "w-5 h-5 rounded-full bg-white dark:bg-white shadow-[0_1px_4px_rgba(0,0,0,0.35),0_3px_10px_rgba(0,0,0,0.2)]",
          "border border-black/10 dark:border-white/10 ring-offset-background",
          "cursor-grab active:cursor-grabbing",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2",
          "transition-shadow",
          lifted && "shadow-[0_2px_12px_rgba(0,0,0,0.45)] cursor-grabbing",
          disabled && "cursor-not-allowed opacity-50"
        )}
      />
      <motion.span
        className="absolute right-0 bottom-full mb-2.5 translate-x-1/2 flex items-center justify-center pointer-events-none"
        style={{ "--at": shown } as MotionStyle}
      >
        <AnimatePresence>
          {bubble && (
            <motion.span
              key="bubble"
              aria-hidden="true"
              initial={reduced ? { opacity: 0 } : bubbleIn}
              animate={bubbleRest}
              exit={
                reduced
                  ? {
                      opacity: 0,
                      transition: { duration: motionTokens.duration.instant },
                    }
                  : bubbleOut
              }
              transition={reduced ? { duration: 0.15 } : bubbleEnter}
              className="relative px-2.5 py-1 rounded-md bg-zinc-900/95 dark:bg-zinc-800/95 text-white dark:text-zinc-100 text-xs font-medium tabular-nums shadow-xl border border-white/10 backdrop-blur-sm pointer-events-none whitespace-nowrap select-none flex items-center justify-center"
            >
              <RollingNumber value={value} text={text} />
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-zinc-900/95 dark:border-t-zinc-800/95" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </motion.div>
  );
}

export function Slider<T extends SliderValue = number>({
  label,
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step: stepProp = 1,
  largeStep,
  marks,
  minStepsBetweenThumbs = 0,
  format,
  showValue = true,
  thumbLabels,
  start,
  end,
  description,
  name,
  disabled,
  className,
}: SliderProps<T>) {
  const reduced = useReducedMotion();
  const labelId = useId();
  const step = stepProp > 0 ? stepProp : 1;
  const span = max - min || 1;
  const isRange = Array.isArray(value ?? defaultValue);

  const toArray = (input: SliderValue | undefined) =>
    input === undefined
      ? [min, max].slice(0, isRange ? 2 : 1)
      : Array.isArray(input)
      ? [input[0], input[1]]
      : [input];

  const [internal, setInternal] = useState(() => toArray(defaultValue));
  const values = value === undefined ? internal : toArray(value);
  const decimals = Math.max(decimalsOf(step), decimalsOf(min));
  const formatValue =
    format ??
    ((input: number) =>
      input.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }));

  const gap = isRange ? minStepsBetweenThumbs * step : 0;
  const pct = (input: number) => ((input - min) / span) * 100;
  const valueAt = (percent: number) => min + (percent / 100) * span;
  const snap = (input: number) =>
    Number((min + Math.round((input - min) / step) * step).toFixed(decimals));

  const lowOf = (index: number, current: number[]) =>
    index === 1 ? current[0] + gap : min;
  const highOf = (index: number, current: number[]) =>
    index === 0 && isRange ? current[1] - gap : max;
  const settle = (index: number, input: number, current: number[]) =>
    clamp(
      snap(clamp(input, min, max)),
      lowOf(index, current),
      highOf(index, current)
    );

  const trackRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const latest = useRef(values);
  const goal = useRef(values.map(pct));
  const drag = useRef<Drag | null>(null);
  const pointerFocus = useRef(false);
  const lingerTimer = useRef<number | undefined>(undefined);

  const [dragging, setDragging] = useState<number | null>(null);
  const [keyFocus, setKeyFocus] = useState<number | null>(null);
  const [linger, setLinger] = useState<number | null>(null);
  const [lastActive, setLastActive] = useState(isRange ? 1 : 0);
  const [quiet, setQuiet] = useState<number | null>(null);

  const pos0 = useMotionValue(pct(values[0]));
  const pos1 = useMotionValue(pct(values[1] ?? values[0]));
  const lag0 = useMotionValue(0);
  const lag1 = useMotionValue(0);

  const shown0 = useTransform(() => pos0.get() + lag0.get());
  const shown1 = useTransform(() => pos1.get() + lag1.get());

  const clipPath = useTransform(() => {
    const s0 = clamp(shown0.get(), 0, 100);
    const s1 = clamp(shown1.get(), 0, 100);
    const from = isRange ? Math.min(s0, s1) : 0;
    const to = isRange ? Math.max(s0, s1) : s0;
    return `inset(0 ${(100 - to).toFixed(3)}% 0 ${from.toFixed(3)}% round 999px)`;
  });

  const thumbs = [
    { pos: pos0, lag: lag0, shown: shown0 },
    { pos: pos1, lag: lag1, shown: shown1 },
  ];

  const emit = (next: number[]) => (isRange ? [next[0], next[1]] : next[0]) as T;

  function commit(index: number, next: number) {
    const current = latest.current;
    if (current[index] === next) return;
    const updated = current.map((item, at) => (at === index ? next : item));
    latest.current = updated;
    if (value === undefined) setInternal(updated);
    onValueChange?.(emit(updated));
  }

  useIsomorphicLayoutEffect(() => {
    latest.current = values;
    values.forEach((item, index) => {
      const target = pct(item);
      const thumb = thumbs[index];
      if (drag.current?.index === index || goal.current[index] === target) return;
      goal.current[index] = target;
      const from = thumb.pos.get() + thumb.lag.get();
      thumb.lag.jump(0);
      thumb.pos.jump(from);
      if (reduced) thumb.pos.jump(target);
      else animate(thumb.pos, target, thumbSpring);
    });
  });

  useEffect(() => () => window.clearTimeout(lingerTimer.current), []);

  const thumbNode = (index: number) =>
    thumbsRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`);

  function focusFromPointer(index: number) {
    const node = thumbNode(index);
    if (!node || document.activeElement === node) return;
    setQuiet(index);
    pointerFocus.current = true;
    node.focus({ preventScroll: true });
    pointerFocus.current = false;
  }

  const trackWidth = () => trackRef.current?.getBoundingClientRect().width || 1;

  function nearest(at: number, current: number[]) {
    if (!isRange) return 0;
    const low = Math.abs(at - pct(current[0]));
    const high = Math.abs(at - pct(current[1]));
    return low === high ? (at < pct(current[0]) ? 0 : 1) : low < high ? 0 : 1;
  }

  function holdBubble(index: number) {
    window.clearTimeout(lingerTimer.current);
    setLinger(index);
    lingerTimer.current = window.setTimeout(() => setLinger(null), 700);
  }

  function begin(state: Drag, index: number, at: number, press: boolean) {
    const thumb = thumbs[index];
    const from = thumb.pos.get() + thumb.lag.get();
    state.index = index;
    state.grab = press ? 0 : at - from;
    thumb.lag.jump(0);
    thumb.pos.jump(from);
    setDragging(index);
    setLastActive(index);
    window.clearTimeout(lingerTimer.current);
    setLinger(null);
    focusFromPointer(index);
    if (press) follow(state, at, 0, true);
  }

  function follow(state: Drag, at: number, time: number, press = false) {
    const index = state.index;
    if (index === null) return;
    const thumb = thumbs[index];
    const current = latest.current;
    const width = trackWidth();
    const raw = at - state.grab;
    const low = pct(lowOf(index, current));
    const high = pct(highOf(index, current));
    const edge = clamp(raw, low, high);
    const placed = reduced
      ? edge
      : edge + (rubber(((raw - edge) / 100) * width) / width) * 100;

    if (press && !reduced) {
      const from = thumb.pos.get();
      thumb.pos.jump(placed);
      thumb.lag.jump(from - placed);
      animate(thumb.lag, 0, thumbSpring);
    } else {
      thumb.pos.set(placed);
    }

    state.raw = raw;
    state.samples.push({ t: time, p: placed });
    if (state.samples.length > 6) state.samples.shift();
    commit(index, settle(index, valueAt(raw), current));
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (disabled || event.button !== 0 || !event.isPrimary) return;
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const at = ((event.clientX - rect.left) / (rect.width || 1)) * 100;
    const grabbed = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-thumb]"
    );
    const current = latest.current;
    event.currentTarget.setPointerCapture(event.pointerId);
    const state: Drag = {
      pointer: event.pointerId,
      index: null,
      grab: 0,
      x: event.clientX,
      raw: at,
      samples: [],
    };
    drag.current = state;

    if (grabbed && isRange && current[0] === current[1]) {
      focusFromPointer(Number(grabbed.dataset.index));
      return;
    }

    begin(
      state,
      grabbed ? Number(grabbed.dataset.index) : nearest(at, current),
      at,
      !grabbed
    );
    state.samples = [
      { t: event.timeStamp, p: thumbs[state.index ?? 0].pos.get() },
    ];
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || state.pointer !== event.pointerId) return;
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const at = ((event.clientX - rect.left) / (rect.width || 1)) * 100;
    if (state.index === null) {
      const dx = event.clientX - state.x;
      if (Math.abs(dx) < 2) return;
      begin(state, dx < 0 ? 0 : 1, at - (dx / (rect.width || 1)) * 100, false);
    }
    follow(state, at, event.timeStamp);
  }

  function onPointerEnd(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || state.pointer !== event.pointerId) return;
    drag.current = null;
    const index = state.index;
    if (index === null) return;
    const thumb = thumbs[index];
    const current = latest.current;
    const width = trackWidth();
    const samples = state.samples;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const elapsed = last && first ? (last.t - first.t) / 1000 : 0;
    const velocity =
      (elapsed > 0.008 && event.timeStamp - last.t < 60
        ? (last.p - first.p) / elapsed
        : 0) + thumb.lag.getVelocity();

    const stepPct = (step / span) * 100;
    const carry =
      event.type === "pointerup" && (stepPct / 100) * width >= SNAP_PX
        ? clamp(project(velocity), -stepPct, stepPct)
        : 0;

    const next = settle(index, valueAt(state.raw + carry), current);
    const from = thumb.pos.get() + thumb.lag.get();
    const target = pct(next);

    thumb.lag.jump(0);
    thumb.pos.jump(from);
    goal.current[index] = target;

    if (reduced) thumb.pos.jump(target);
    else animate(thumb.pos, target, { ...thumbSpring, velocity });

    commit(index, next);
    setDragging(null);
    holdBubble(index);
    onValueCommit?.(emit(latest.current));
  }

  function onKeyDown(index: number, event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    const current = latest.current;
    const now = current[index];
    const large = largeStep ?? Math.max(step, snap(min + span / 10) - min);
    const moves: Record<string, number> = {
      ArrowRight: step,
      ArrowUp: step,
      ArrowLeft: -step,
      ArrowDown: -step,
      PageUp: large,
      PageDown: -large,
    };

    let wanted: number;
    if (event.key === "Home") wanted = lowOf(index, current);
    else if (event.key === "End") wanted = highOf(index, current);
    else if (event.key in moves)
      wanted =
        now +
        (event.shiftKey && /^Arrow/.test(event.key)
          ? Math.sign(moves[event.key]) * large
          : moves[event.key]);
    else return;

    event.preventDefault();
    setKeyFocus(index);
    setQuiet(null);
    setLastActive(index);
    const next = settle(index, wanted, current);

    if (next === now) {
      const toward = Math.sign(wanted - now);
      if (toward && !reduced)
        animate(thumbs[index].pos, goal.current[index], {
          ...kickSpring,
          velocity: ((toward * BUMP_PX) / trackWidth()) * 100,
        });
      return;
    }

    commit(index, next);
    onValueCommit?.(emit(latest.current));
  }

  function jumpTo(target: number) {
    if (disabled) return;
    const current = latest.current;
    const index = nearest(pct(target), current);
    const next = settle(index, target, current);
    setLastActive(index);
    focusFromPointer(index);
    if (next === current[index]) return;
    commit(index, next);
    onValueCommit?.(emit(latest.current));
  }

  const markList = (marks ?? [])
    .map((mark) => (typeof mark === "number" ? ({ value: mark } as SliderMark) : mark))
    .filter((mark) => mark.value >= min && mark.value <= max);

  const ticks = markList.filter((mark) => mark.value > min && mark.value < max);
  const labelled = markList.filter((mark) => mark.label);
  const inRange = (mark: number) =>
    isRange
      ? mark >= values[0] && mark <= values[1]
      : mark <= values[0];

  const names = thumbLabels ?? [
    `${label}, minimum`,
    `${label}, maximum`,
  ];

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 w-full select-none",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      data-disabled={disabled || undefined}
      data-dragging={dragging !== null || undefined}
      data-marks={labelled.length > 0 || undefined}
    >
      <div className="flex items-center justify-between gap-3 select-none mb-1">
        <span
          id={labelId}
          className="text-sm font-medium text-foreground dark:text-zinc-200 tracking-tight"
        >
          {label}
        </span>
        {showValue && (
          <div
            className="flex items-center text-sm font-medium text-foreground dark:text-zinc-200 tabular-nums select-none tracking-tight"
            aria-hidden="true"
          >
            <RollingNumber value={values[0]} text={formatValue(values[0])} />
            {isRange && (
              <>
                <span className="mx-1.5 text-muted-foreground select-none font-normal">–</span>
                <RollingNumber value={values[1]} text={formatValue(values[1])} />
              </>
            )}
          </div>
        )}
      </div>

      <div className="w-full flex flex-col">
        <div className="flex items-start gap-3 w-full">
          {start && (
            <div className="shrink-0 h-9 flex items-center justify-center">
              {start}
            </div>
          )}
          <div className="flex-1 flex flex-col min-w-0">
            <div
              className="relative flex items-center w-full h-9 py-2 touch-none cursor-pointer"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerEnd}
              onPointerCancel={onPointerEnd}
              onLostPointerCapture={onPointerEnd}
              onMouseDown={(event) => event.preventDefault()}
            >
              <div
                ref={trackRef}
                className="relative w-full h-1.5 rounded-full bg-zinc-800 dark:bg-zinc-800 overflow-hidden"
              >
                {ticks.map((mark) => (
                  <span
                    key={mark.value}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-zinc-600 dark:bg-zinc-600 pointer-events-none"
                    style={{ left: `${pct(mark.value)}%` }}
                  />
                ))}
                <motion.div
                  className="absolute inset-0 bg-zinc-400 dark:bg-zinc-300 rounded-full pointer-events-none"
                  style={{ clipPath }}
                >
                  {ticks.map((mark) => (
                    <span
                      key={mark.value}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-zinc-700 dark:bg-zinc-700 pointer-events-none"
                      style={{ left: `${pct(mark.value)}%` }}
                    />
                  ))}
                </motion.div>
              </div>

              <div ref={thumbsRef} className="absolute inset-0 pointer-events-none">
                {values.map((item, index) => (
                  <Thumb
                    key={index}
                    quiet={quiet === index}
                    index={index}
                    shown={thumbs[index].shown}
                    value={item}
                    text={formatValue(item)}
                    low={lowOf(index, values)}
                    high={highOf(index, values)}
                    ariaLabel={isRange ? names[index] : undefined}
                    labelledBy={labelId}
                    active={lastActive === index}
                    lifted={dragging === index}
                    bubble={
                      dragging === index ||
                      keyFocus === index ||
                      linger === index
                    }
                    disabled={disabled}
                    onKeyDown={(event) => onKeyDown(index, event)}
                    onFocus={(event) => {
                      if (
                        !pointerFocus.current &&
                        event.currentTarget.matches(":focus-visible")
                      ) {
                        setKeyFocus(index);
                      }
                    }}
                    onBlur={() => {
                      setKeyFocus((current) =>
                        current === index ? null : current
                      );
                      setQuiet((current) =>
                        current === index ? null : current
                      );
                    }}
                  />
                ))}
              </div>
            </div>

            {labelled.length > 0 && (
              <div
                className="relative w-full h-5 mt-1 select-none"
                aria-hidden="true"
              >
                {labelled.map((mark) => {
                  const isStart = mark.value === min;
                  const isEnd = mark.value === max;
                  return (
                    <span
                      key={mark.value}
                      onClick={() => jumpTo(mark.value)}
                      className={cn(
                        "absolute top-0 text-xs font-medium tabular-nums transition-colors cursor-pointer select-none whitespace-nowrap",
                        inRange(mark.value)
                          ? "text-foreground dark:text-zinc-200"
                          : "text-muted-foreground hover:text-foreground dark:text-zinc-500 dark:hover:text-zinc-300",
                        isStart
                          ? "left-0 translate-x-0 text-left"
                          : isEnd
                          ? "right-0 translate-x-0 text-right"
                          : "-translate-x-1/2 text-center"
                      )}
                      style={
                        !isStart && !isEnd
                          ? { left: `${pct(mark.value)}%` }
                          : undefined
                      }
                    >
                      {mark.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          {end && (
            <div className="shrink-0 h-9 flex items-center justify-center">
              {end}
            </div>
          )}
        </div>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-0.5 tracking-tight">
          {description}
        </p>
      )}

      {name &&
        values.map((item, index) => (
          <input
            key={index}
            type="hidden"
            name={isRange ? `${name}[${index}]` : name}
            value={item}
            disabled={disabled}
          />
        ))}
    </div>
  );
}

export default Slider;
