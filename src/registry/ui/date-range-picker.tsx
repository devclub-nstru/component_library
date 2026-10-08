"use client";

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { Calendar, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DateRangePreset {
  label: string;
  range: (today: Date) => DateRange;
}

export interface DateRangePickerProps {
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onChange?: (range: DateRange) => void;
  onApply?: (range: DateRange) => void;
  onCancel?: () => void;
  label?: string;
  placeholder?: string;
  presets?: DateRangePreset[];
  minDate?: Date;
  maxDate?: Date;
  weekStartsOn?: 0 | 1;
  locale?: string;
  months?: "auto" | 1 | 2;
  className?: string;
}

type Bezier = [number, number, number, number];

const DAY = 864e5;
const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
const monthStart = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);
const monthEnd = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0);
const addDays = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
const addMonths = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);
const shiftMonths = (date: Date, amount: number) =>
  new Date(
    date.getFullYear(),
    date.getMonth() + amount,
    Math.min(
      date.getDate(),
      new Date(date.getFullYear(), date.getMonth() + amount + 1, 0).getDate(),
    ),
  );
const dayDiff = (a: Date, b: Date) =>
  Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / DAY);
const monthDiff = (a: Date, b: Date) =>
  (a.getFullYear() - b.getFullYear()) * 12 + a.getMonth() - b.getMonth();
const sameDay = (a?: Date | null, b?: Date | null) =>
  Boolean(a && b && dayDiff(a, b) === 0);
const keyOf = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
const fromKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
};
const ordered = (a: Date, b: Date): DateRange =>
  dayDiff(a, b) <= 0 ? { start: a, end: b } : { start: b, end: a };
const sameRange = (a?: DateRange | null, b?: DateRange | null) =>
  Boolean(a && b && sameDay(a.start, b.start) && sameDay(a.end, b.end));
const clampDate = (date: Date, min?: Date, max?: Date) =>
  min && dayDiff(date, min) < 0
    ? startOfDay(min)
    : max && dayDiff(date, max) > 0
      ? startOfDay(max)
      : date;

export const defaultDateRangePresets: DateRangePreset[] = [
  { label: "Today", range: (today) => ({ start: today, end: today }) },
  {
    label: "Yesterday",
    range: (today) => ({
      start: addDays(today, -1),
      end: addDays(today, -1),
    }),
  },
  {
    label: "Last 7 days",
    range: (today) => ({ start: addDays(today, -6), end: today }),
  },
  {
    label: "Last 30 days",
    range: (today) => ({ start: addDays(today, -29), end: today }),
  },
  {
    label: "This month",
    range: (today) => ({ start: monthStart(today), end: today }),
  },
  {
    label: "Last month",
    range: (today) => ({
      start: addMonths(today, -1),
      end: monthEnd(addMonths(today, -1)),
    }),
  },
  {
    label: "This quarter",
    range: (today) => ({
      start: new Date(
        today.getFullYear(),
        Math.floor(today.getMonth() / 3) * 3,
        1,
      ),
      end: today,
    }),
  },
  {
    label: "Year to date",
    range: (today) => ({
      start: new Date(today.getFullYear(), 0, 1),
      end: today,
    }),
  },
];

const subscribeToday = (notify: () => void) => {
  let timer = 0;
  const schedule = () => {
    const now = new Date();
    timer = window.setTimeout(
      () => {
        notify();
        schedule();
      },
      addDays(now, 1).getTime() - now.getTime() + 1000,
    );
  };
  const onVisible = () => {
    if (document.visibilityState === "visible") notify();
  };
  schedule();
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    window.clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisible);
  };
};

const readToday = () => keyOf(new Date());
const serverToday = () => "";

export function useToday() {
  const key = useSyncExternalStore(subscribeToday, readToday, serverToday);
  return useMemo(() => (key ? fromKey(key) : undefined), [key]);
}

const subscribeWindow = (callback: () => void) => {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};
const getIsSmallScreen = () => window.innerWidth < 768;
const getServerIsSmallScreen = () => false;

function useIsSmallScreen() {
  return useSyncExternalStore(
    subscribeWindow,
    getIsSmallScreen,
    getServerIsSmallScreen,
  );
}

const noop = () => () => {};
function useReducedFlag() {
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  return !!useReducedMotion() && hydrated;
}

const enterEase: Bezier = [0.16, 1, 0.3, 1];
const standardEase: Bezier = [0.7, 0, 0.84, 0];

const roll: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: `${direction * 0.45}em`,
    filter: "blur(2px)",
  }),
  center: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.24, ease: enterEase },
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: `${direction * -0.45}em`,
    filter: "blur(2px)",
    transition: { duration: 0.14, ease: standardEase },
  }),
};

const fade: Variants = {
  enter: { opacity: 0 },
  center: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.12 },
  },
  exit: { opacity: 0, transition: { duration: 0.08 } },
};

const slide: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction * 28,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: enterEase,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -28,
    transition: {
      duration: 0.14,
      ease: standardEase,
    },
  }),
};

function Rolling({
  text,
  direction,
  reduced,
}: {
  text: string;
  direction: number;
  reduced: boolean;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span
      className="inline-flex flex-wrap items-baseline gap-[0.25em]"
      aria-hidden="true"
    >
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden h-[1.25em] leading-[1.25em] relative align-baseline"
        >
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.span
              key={word}
              className="inline-block align-baseline"
              custom={direction}
              variants={reduced ? fade : roll}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {word}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

function useDirection(range: DateRange | null) {
  const time = range ? range.start.getTime() * 2 + range.end.getTime() : null;
  const [previous, setPrevious] = useState(time);
  const [direction, setDirection] = useState(1);
  if (time !== previous) {
    setPrevious(time);
    setDirection(
      time === null || previous === null || time >= previous ? 1 : -1,
    );
  }
  return direction;
}

type Segment = { left: number; width: number } | null;

interface MonthProps {
  month: Date;
  range: DateRange | null;
  tabbable: string;
  today?: Date;
  minDate?: Date;
  maxDate?: Date;
  weekStartsOn: 0 | 1;
  formatters: {
    title: Intl.DateTimeFormat;
    day: Intl.DateTimeFormat;
    weekday: Intl.DateTimeFormat;
    weekdayLong: Intl.DateTimeFormat;
  };
  onPick: (date: Date) => void;
  onHover: (date: Date) => void;
  onKey: (event: ReactKeyboardEvent<HTMLButtonElement>, date: Date) => void;
  onFocusDay: (date: Date) => void;
  idBase: string;
}

function Month({
  month,
  range,
  tabbable,
  today,
  minDate,
  maxDate,
  weekStartsOn,
  formatters,
  onPick,
  onHover,
  onKey,
  onFocusDay,
  idBase,
}: MonthProps) {
  const first = useMemo(
    () => addDays(month, -((month.getDay() - weekStartsOn + 7) % 7)),
    [month, weekStartsOn],
  );
  const rows = useMemo(
    () =>
      Array.from({ length: 6 }, (_, row) =>
        Array.from({ length: 7 }, (_, col) => addDays(first, row * 7 + col)),
      ),
    [first],
  );
  const titleId = `${idBase}-${keyOf(month)}`;
  const inMonth = (date: Date) => monthDiff(date, month) === 0;

  const lo = range?.start;
  const hi = range?.end;
  const loKey = lo ? keyOf(lo) : "";
  const hiKey = hi ? keyOf(hi) : "";

  const segments = useMemo<Segment[]>(() => {
    if (!loKey || !hiKey) return rows.map(() => null);
    const start = fromKey(loKey);
    const end = fromKey(hiKey);
    const unit = 100 / 7;
    const colOf = (date: Date) => dayDiff(date, first) % 7;

    return rows.map((row) => {
      const days = row.filter((date) => monthDiff(date, month) === 0);
      if (!days.length) return null;
      const inRangeDays = days.filter(
        (date) => dayDiff(date, start) >= 0 && dayDiff(date, end) <= 0,
      );
      if (inRangeDays.length <= 1) return null;

      const firstInRange = inRangeDays[0];
      const lastInRange = inRangeDays[inRangeDays.length - 1];
      const a = colOf(firstInRange);
      const b = colOf(lastInRange);

      return {
        left: a * unit,
        width: (b - a + 1) * unit,
      };
    });
  }, [first, hiKey, loKey, month, rows]);

  return (
    <div className="flex flex-col select-none w-full md:w-66.5 shrink-0">
      <p
        id={titleId}
        className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 text-center mb-3.5 tracking-tight"
      >
        {formatters.title.format(month)}
      </p>
      <div role="grid" aria-labelledby={titleId} className="flex flex-col">
        <div role="row" className="grid grid-cols-7 mb-2.5">
          {rows[0].map((date) => (
            <span
              key={date.getDay()}
              role="columnheader"
              aria-label={formatters.weekdayLong.format(date)}
              className="text-[11.5px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-center py-0.5"
            >
              {formatters.weekday.format(date).slice(0, 2)}
            </span>
          ))}
        </div>
        <div className="relative h-57">
          <span
            className="absolute inset-0 pointer-events-none z-10"
            aria-hidden="true"
          >
            {segments.map((segment, row) => {
              if (!segment) return null;
              return (
                <span
                  key={row}
                  className="absolute h-9 rounded-full bg-zinc-150 dark:bg-zinc-800/90 border border-zinc-200/50 dark:border-white/4 pointer-events-none transition-all duration-150"
                  style={{
                    left: `${segment.left}%`,
                    width: `${segment.width}%`,
                    top: `calc(${row} * 38px + 1px)`,
                  }}
                />
              );
            })}
          </span>
          <div className="grid grid-rows-6 h-full">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} role="row" className="grid grid-cols-7 h-9.5">
                {row.map((date) => {
                  if (!inMonth(date)) {
                    return (
                      <span
                        key={keyOf(date)}
                        role="gridcell"
                        className="w-full h-full"
                      />
                    );
                  }
                  const key = keyOf(date);
                  const disabled = Boolean(
                    (minDate && dayDiff(date, minDate) < 0) ||
                    (maxDate && dayDiff(date, maxDate) > 0),
                  );
                  const inRange = Boolean(
                    lo &&
                    hi &&
                    dayDiff(date, lo) >= 0 &&
                    dayDiff(date, hi) <= 0,
                  );
                  const isEdge = sameDay(date, lo) || sameDay(date, hi);
                  const isToday = sameDay(date, today);

                  return (
                    <span
                      key={key}
                      role="gridcell"
                      aria-selected={inRange}
                      className="w-full h-9.5 flex items-center justify-center relative"
                    >
                      <button
                        type="button"
                        data-date={key}
                        data-edge={isEdge || undefined}
                        data-range={inRange || undefined}
                        data-today={isToday || undefined}
                        tabIndex={key === tabbable ? 0 : -1}
                        disabled={disabled}
                        aria-current={isToday ? "date" : undefined}
                        aria-label={formatters.day.format(date)}
                        onClick={() => onPick(date)}
                        onPointerEnter={() => {
                          if (!disabled) onHover(date);
                        }}
                        onFocus={() => onFocusDay(date)}
                        onKeyDown={(event) => onKey(event, date)}
                        className={cn(
                          "w-9 h-9 rounded-full flex flex-col items-center justify-center relative z-20 transition-all duration-150 cursor-pointer select-none",
                          isEdge
                            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-[0_2px_10px_rgba(0,0,0,0.18)] dark:shadow-[0_2px_12px_rgba(255,255,255,0.22)] scale-[1.02]"
                            : inRange
                              ? "text-zinc-900 dark:text-zinc-100 font-semibold"
                              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/8 font-medium",
                          disabled &&
                            "opacity-25 cursor-not-allowed hover:bg-transparent",
                        )}
                      >
                        <span className="leading-none text-sm">
                          {date.getDate()}
                        </span>
                        {isToday && (
                          <span
                            className={cn(
                              "w-1 h-1 rounded-full mt-0.5",
                              isEdge
                                ? "bg-white dark:bg-zinc-950"
                                : "bg-zinc-900 dark:bg-zinc-400",
                            )}
                          />
                        )}
                      </button>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MonthsView({
  children,
  direction,
  reduced,
}: {
  children: ReactNode;
  direction: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      custom={direction}
      variants={reduced ? fade : slide}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col md:flex-row gap-6 md:gap-10 w-full"
    >
      {children}
    </motion.div>
  );
}

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  onApply,
  onCancel,
  label = "Date range",
  placeholder = "Select dates",
  presets = defaultDateRangePresets,
  minDate,
  maxDate,
  weekStartsOn = 0,
  locale = "en-US",
  months = "auto",
  className,
}: DateRangePickerProps) {
  const reduced = useReducedFlag();
  const isSmallScreen = useIsSmallScreen();
  const detectedToday = useToday();
  const today = useMemo(() => detectedToday ?? new Date(), [detectedToday]);
  const uid = useId();

  const initialRange = useMemo(() => {
    if (value !== undefined) return value;
    if (defaultValue !== undefined) return defaultValue;
    return {
      start: addDays(today, -6),
      end: today,
    };
  }, [defaultValue, today, value]);

  const [inner, setInner] = useState<DateRange | null>(initialRange);
  const committed = value !== undefined ? value : inner;

  const compact = months === 1 || (months === "auto" && isSmallScreen);

  const [view, setView] = useState<Date>(() => {
    const end = committed?.end ?? today;
    return addMonths(monthStart(end), -1);
  });
  const [direction, setDirection] = useState(1);
  const [draft, setDraft] = useState<DateRange | null>(committed);
  const [anchor, setAnchor] = useState<Date | null>(null);
  const [hover, setHover] = useState<Date | null>(null);
  const [focusKey, setFocusKey] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const appliedTimerRef = useRef<number | null>(null);

  const formatters = useMemo(
    () => ({
      label: new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      title: new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
      }),
      day: new Intl.DateTimeFormat(locale, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      weekday: new Intl.DateTimeFormat(locale, { weekday: "short" }),
      weekdayLong: new Intl.DateTimeFormat(locale, { weekday: "long" }),
    }),
    [locale],
  );

  const format = useCallback(
    (range: DateRange | null) => {
      if (!range) return placeholder;
      if (sameDay(range.start, range.end)) {
        return formatters.label.format(range.start);
      }
      return formatters.label.formatRange(range.start, range.end);
    },
    [formatters, placeholder],
  );

  const count = compact ? 1 : 2;
  const visible = useMemo(
    () => Array.from({ length: count }, (_, index) => addMonths(view, index)),
    [count, view],
  );

  const shown = anchor ? ordered(anchor, hover ?? anchor) : draft;
  const activePreset =
    today && !anchor
      ? presets.findIndex((preset) => sameRange(preset.range(today), draft))
      : -1;
  const days = shown ? dayDiff(shown.end, shown.start) + 1 : 0;
  const shownDirection = useDirection(shown);

  const rootRef = useRef<HTMLDivElement>(null);

  const viewFor = useCallback(
    (range: DateRange | null, single: boolean, fallback: Date) => {
      const end = monthStart(range?.end ?? fallback);
      return single ? end : addMonths(end, -1);
    },
    [],
  );

  const goTo = useCallback((next: Date) => {
    setView((prev) => {
      const delta = monthDiff(next, prev);
      if (!delta) return prev;
      setDirection(Math.sign(delta));
      return next;
    });
  }, []);

  const reveal = useCallback(
    (range: DateRange) => {
      const first = view;
      const last = addMonths(view, count - 1);
      if (monthDiff(range.start, first) >= 0 && monthDiff(range.end, last) <= 0)
        return;
      goTo(viewFor(range, compact, range.end));
    },
    [compact, count, goTo, view, viewFor],
  );

  const pick = (date: Date) => {
    setFocusKey(keyOf(date));
    if (!anchor) {
      setAnchor(date);
      setHover(date);
      return;
    }
    const next = ordered(anchor, date);
    setDraft(next);
    setAnchor(null);
    setHover(null);
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  const choosePreset = (preset: DateRangePreset) => {
    const range = preset.range(today);
    setDraft(range);
    setAnchor(null);
    setHover(null);
    setFocusKey(keyOf(range.start));
    reveal(range);
    if (value === undefined) setInner(range);
    onChange?.(range);
  };

  const handleApply = () => {
    const next = anchor ? { start: anchor, end: anchor } : draft;
    if (!next) return;
    if (value === undefined) setInner(next);
    setIsApplied(true);
    if (appliedTimerRef.current) window.clearTimeout(appliedTimerRef.current);
    appliedTimerRef.current = window.setTimeout(() => {
      setIsApplied(false);
    }, 1500);
    onChange?.(next);
    onApply?.(next);
  };

  const handleCancel = () => {
    setDraft(committed);
    setAnchor(null);
    setHover(null);
    onCancel?.();
  };

  const onDayKey = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    date: Date,
  ) => {
    const weekday = (date.getDay() - weekStartsOn + 7) % 7;
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(date, -1),
      ArrowRight: () => addDays(date, 1),
      ArrowUp: () => addDays(date, -7),
      ArrowDown: () => addDays(date, 7),
      Home: () => addDays(date, -weekday),
      End: () => addDays(date, 6 - weekday),
      PageUp: () => shiftMonths(date, event.shiftKey ? -12 : -1),
      PageDown: () => shiftMonths(date, event.shiftKey ? 12 : 1),
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    const next = clampDate(move(), minDate, maxDate);
    setFocusKey(keyOf(next));
    if (anchor) setHover(next);
    const first = view;
    const last = addMonths(view, count - 1);
    if (monthDiff(next, first) < 0) goTo(monthStart(next));
    else if (monthDiff(next, last) > 0)
      goTo(addMonths(monthStart(next), -(count - 1)));
  };

  const tabbable = useMemo(() => {
    const onScreen = (date: Date) =>
      visible.some((month) => monthDiff(date, month) === 0);
    if (focusKey && onScreen(fromKey(focusKey))) return focusKey;
    if (shown && onScreen(shown.start)) return keyOf(shown.start);
    return keyOf(visible[0]);
  }, [focusKey, shown, visible]);

  const shownText = shown ? format(shown) : placeholder;
  const countText = shown ? `${days} ${days === 1 ? "day" : "days"}` : "";
  const status = anchor
    ? `Start ${formatters.label.format(anchor)}. Choose an end date.`
    : shown
      ? `${shownText}, ${countText}`
      : "";

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label={label}
      style={{ "--cell": "38px" } as CSSProperties}
      className={cn(
        "relative inline-flex flex-col bg-white/95 dark:bg-[#141416]/95 border border-zinc-200/90 dark:border-white/8 rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl text-zinc-900 dark:text-zinc-100 max-w-full overflow-hidden select-none",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-400/25 dark:via-white/20 to-transparent pointer-events-none rounded-t-3xl" />

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
        <div
          role="group"
          aria-label="Date presets"
          className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:pr-6 md:border-r border-zinc-200/80 dark:border-white/6 shrink-0 scrollbar-none w-full md:w-44"
        >
          {presets.map((preset, index) => {
            const isActive = index === activePreset;
            return (
              <button
                key={preset.label}
                type="button"
                data-preset={index}
                aria-pressed={isActive}
                onClick={() => choosePreset(preset)}
                className={cn(
                  "relative px-4 py-2.5 rounded-xl text-[13.5px] font-medium text-left transition-colors whitespace-nowrap cursor-pointer z-10 select-none",
                  isActive
                    ? "text-zinc-950 dark:text-white font-semibold"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-white/4",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId={`${uid}-preset-pill`}
                    className="absolute inset-0 rounded-xl bg-zinc-200/80 dark:bg-zinc-800/90 shadow-sm dark:shadow-inner border border-zinc-300/40 dark:border-white/6 -z-10"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        <div
          className="relative flex-1"
          onPointerLeave={() => {
            if (anchor) setHover(null);
          }}
        >
          <div className="absolute top-0 left-0 z-30">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              aria-label="Previous month"
              onClick={() => goTo(addMonths(view, -1))}
              disabled={Boolean(minDate && monthDiff(view, minDate) <= 0)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-zinc-200/80 dark:border-white/8 hover:bg-zinc-100 dark:hover:bg-white/6 hover:border-zinc-300 dark:hover:border-white/15 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-xs"
            >
              <ChevronLeft size={16} strokeWidth={2.2} aria-hidden="true" />
            </motion.button>
          </div>
          <div className="absolute top-0 right-0 z-30">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              aria-label="Next month"
              onClick={() => goTo(addMonths(view, 1))}
              disabled={Boolean(
                maxDate && monthDiff(addMonths(view, count - 1), maxDate) >= 0,
              )}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-zinc-200/80 dark:border-white/8 hover:bg-zinc-100 dark:hover:bg-white/6 hover:border-zinc-300 dark:hover:border-white/15 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-xs"
            >
              <ChevronRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </motion.button>
          </div>

          <div className="relative overflow-hidden w-full min-h-73.5">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <MonthsView
                key={`${keyOf(view)}-${count}`}
                direction={direction}
                reduced={reduced}
              >
                {visible.map((month) => (
                  <Month
                    key={keyOf(month)}
                    month={month}
                    range={shown}
                    tabbable={tabbable}
                    today={today}
                    minDate={minDate}
                    maxDate={maxDate}
                    weekStartsOn={weekStartsOn}
                    formatters={formatters}
                    idBase={uid}
                    onPick={pick}
                    onHover={(date) => {
                      if (anchor) setHover(date);
                    }}
                    onKey={onDayKey}
                    onFocusDay={(date) => setFocusKey(keyOf(date))}
                  />
                ))}
              </MonthsView>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-zinc-200/80 dark:border-white/8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white/6 border border-zinc-200/60 dark:border-white/8 flex items-center justify-center text-zinc-600 dark:text-zinc-400 shrink-0 shadow-xs">
            <Calendar size={15} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="text-[14.5px] font-semibold text-zinc-950 dark:text-white tracking-tight">
              <Rolling
                text={shownText}
                direction={shownDirection}
                reduced={reduced}
              />
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {countText && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-white/[0.07] text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-white/6">
                  <Rolling
                    text={
                      anchor && sameDay(anchor, hover)
                        ? "Pick an end date"
                        : countText
                    }
                    direction={shownDirection}
                    reduced={reduced}
                  />
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            onClick={handleCancel}
            className="px-4 py-2 text-[13.5px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer rounded-full hover:bg-zinc-100 dark:hover:bg-white/6"
          >
            Cancel
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: !shown ? 1 : 1.03 }}
            whileTap={{ scale: !shown ? 1 : 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            onClick={handleApply}
            disabled={!shown}
            className={cn(
              "relative flex items-center justify-center min-w-21 px-5 py-2 text-[13.5px] font-semibold rounded-full cursor-pointer transition-all duration-200 select-none shadow-sm",
              isApplied
                ? "bg-emerald-600 text-white shadow-emerald-500/25 dark:bg-emerald-500 dark:text-white"
                : "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 dark:shadow-[0_2px_12px_rgba(255,255,255,0.2)]",
              !shown && "opacity-40 pointer-events-none",
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isApplied ? (
                <motion.span
                  key="applied"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-1.5"
                >
                  <Check size={14} strokeWidth={2.5} />
                  <span>Applied</span>
                </motion.span>
              ) : (
                <motion.span
                  key="apply"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                >
                  Apply
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

export default DateRangePicker;
