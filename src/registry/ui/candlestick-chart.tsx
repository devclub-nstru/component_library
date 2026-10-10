"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface CandlestickRange {
  label: string;
  sessions?: number;
}

export interface CandlestickChartProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  data?: Candle[];
  title?: string;
  description?: string;
  valuePrefix?: string;
  showVolume?: boolean;
  ranges?: CandlestickRange[];
  animated?: boolean;
  onCandleSelect?: (candle: Candle | null) => void;
}

interface Measurement {
  from: number;
  to: number;
}

const AXIS_WIDTH = 48;
const AXIS_HEIGHT = 22;
const PLOT_TOP = 8;
const VOLUME_RATIO = 0.2;
const VOLUME_GAP = 8;
const PRICE_TICKS = 4;
const MAX_DATE_TICKS = 5;
const DATE_LABEL_SPACING = 64;

const DEFAULT_RANGES: CandlestickRange[] = [
  { label: "1W", sessions: 7 },
  { label: "2W", sessions: 14 },
  { label: "1M", sessions: 30 },
  { label: "All" },
];

const roundToCents = (value: number) => Math.round(value * 100) / 100;

function getNiceStep(rawStep: number) {
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  const factor =
    normalized <= 1
      ? 1
      : normalized <= 2
        ? 2
        : normalized <= 2.5
          ? 2.5
          : normalized <= 5
            ? 5
            : 10;
  return factor * magnitude;
}

function generateDemoCandles(count = 40): Candle[] {
  let seed = 7;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const candles: Candle[] = [];
  let price = 182;

  for (let index = 0; index < count; index++) {
    const open = price;
    const close = Math.max(
      1,
      open + (random() - 0.48) * 6 + Math.sin(index / 5) * 1.6,
    );
    candles.push({
      date: new Date(Date.UTC(2026, 7, 1 + index)).toISOString().slice(0, 10),
      open: roundToCents(open),
      high: roundToCents(Math.max(open, close) + random() * 2.6),
      low: roundToCents(Math.min(open, close) - random() * 2.6),
      close: roundToCents(close),
      volume: Math.round(1_200_000 + random() * 2_600_000),
    });
    price = close;
  }

  return candles;
}

const DEMO_CANDLES = generateDemoCandles();

const priceFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const formatDate = (date: string) => {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : dateFormatter.format(parsed);
};

const formatPercent = (value: number) =>
  Number.isFinite(value) ? `${value >= 0 ? "+" : ""}${value.toFixed(2)}%` : "N/A";

const isValidCandle = (candle: Candle) =>
  [candle.open, candle.high, candle.low, candle.close].every(Number.isFinite) &&
  candle.low <= Math.min(candle.open, candle.close) &&
  candle.high >= Math.max(candle.open, candle.close) &&
  (candle.volume === undefined ||
    (Number.isFinite(candle.volume) && candle.volume >= 0));

const rangeButtonClass =
  "relative z-10 w-9 rounded-md py-1 text-[11px] font-medium text-zinc-500 transition-colors duration-150 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 aria-pressed:text-zinc-900 motion-reduce:transition-none dark:text-zinc-400 dark:hover:text-zinc-100 dark:aria-pressed:text-zinc-100";

export const CandlestickChart = forwardRef<
  HTMLDivElement,
  CandlestickChartProps
>(function CandlestickChart(
  {
    data = DEMO_CANDLES,
    title = "Price action",
    description,
    valuePrefix = "$",
    showVolume = true,
    ranges = DEFAULT_RANGES,
    animated = true,
    onCandleSelect,
    className,
    ...props
  },
  forwardedRef,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const plotRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ anchor: number; last: number } | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [rangeLabel, setRangeLabel] = useState(ranges.at(-1)?.label);
  const [storedHoverIndex, setHoverIndex] = useState<number | null>(null);
  const [storedPinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [storedMeasurement, setMeasurement] = useState<Measurement | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  const validCandles = useMemo(() => data.filter(isValidCandle), [data]);
  const rangeIndex = ranges.findIndex((range) => range.label === rangeLabel);
  const sessions = ranges[rangeIndex]?.sessions;
  const start = sessions !== undefined && Number.isFinite(sessions)
    ? Math.max(0, validCandles.length - Math.max(1, Math.floor(sessions)))
    : 0;
  const candles = useMemo(
    () => validCandles.slice(start),
    [validCandles, start],
  );

  const candlesKey = useMemo(() => JSON.stringify(candles.map(
    ({ date, open, high, low, close, volume }) =>
      [date, open, high, low, close, volume ?? null],
  )), [candles]);
  const [selectionKey, setSelectionKey] = useState(candlesKey);
  const hoverIndex = selectionKey === candlesKey ? storedHoverIndex : null;
  const pinnedIndex = selectionKey === candlesKey ? storedPinnedIndex : null;
  const measurement = selectionKey === candlesKey ? storedMeasurement : null;
  const previousSelection = useRef({ candlesKey, pinnedIndex });

  if (selectionKey !== candlesKey) {
    setSelectionKey(candlesKey);
    setHoverIndex(null);
    setPinnedIndex(null);
    setMeasurement(null);
    setAnnouncement("");
  }

  useEffect(() => {
    const previous = previousSelection.current;
    if (previous.candlesKey !== candlesKey) {
      dragRef.current = null;
      if (previous.pinnedIndex !== null) onCandleSelect?.(null);
    }
    previousSelection.current = { candlesKey, pinnedIndex };
  }, [candlesKey, pinnedIndex, onCandleSelect]);

  const hasSize = size.width > AXIS_WIDTH && size.height > AXIS_HEIGHT + PLOT_TOP;
  const hasVolume =
    showVolume && candles.some((candle) => (candle.volume ?? 0) > 0);

  useEffect(() => {
    const node = plotRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.floor(width), height: Math.floor(height) });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!animated || !hasSize || candles.length === 0) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".candle-grid", { opacity: 0, duration: 0.4 });
        gsap.from(".candle-body", {
          scaleY: 0,
          transformOrigin: "50% 50%",
          duration: 0.55,
          ease: "power3.out",
          stagger: Math.min(0.018, 0.6 / candles.length),
        });
        gsap.from(".candle-volume", {
          scaleY: 0,
          transformOrigin: "50% 100%",
          duration: 0.5,
          ease: "power2.out",
          stagger: Math.min(0.018, 0.6 / candles.length),
          delay: 0.1,
        });
      }, containerRef);
      return () => mm.revert();
    },
    {
      scope: containerRef,
      dependencies: [candlesKey, animated, hasSize, hasVolume],
      revertOnUpdate: true,
    },
  );

  const layout = useMemo(() => {
    if (!hasSize || candles.length === 0) return null;
    const right = size.width - AXIS_WIDTH;
    const bottom = size.height - AXIS_HEIGHT;
    const volumeHeight = hasVolume ? (bottom - PLOT_TOP) * VOLUME_RATIO : 0;
    const priceBottom = hasVolume ? bottom - volumeHeight - VOLUME_GAP : bottom;
    const rawMin = Math.min(...candles.map((candle) => candle.low));
    const rawMax = Math.max(...candles.map((candle) => candle.high));
    const padding = (rawMax - rawMin) * 0.08 || 1;
    const min = rawMin - padding;
    const max = rawMax + padding;
    const step = right / candles.length;
    const tickStep = getNiceStep((max - min) / PRICE_TICKS);
    const dateTickCount = Math.max(
      2,
      Math.min(MAX_DATE_TICKS, Math.floor(right / DATE_LABEL_SPACING)),
    );

    return {
      right,
      bottom,
      priceBottom,
      volumeHeight,
      step,
      bodyWidth: Math.max(1, Math.min(14, step * 0.62)),
      maxVolume: Math.max(...candles.map((candle) => candle.volume ?? 0)),
      x: (index: number) => step * (index + 0.5),
      y: (value: number) =>
        PLOT_TOP + ((max - value) / (max - min)) * (priceBottom - PLOT_TOP),
      ticks: Array.from(
        { length: Math.floor(max / tickStep) - Math.ceil(min / tickStep) + 1 },
        (_, index) => (Math.ceil(min / tickStep) + index) * tickStep,
      ),
      tickFormatter: new Intl.NumberFormat("en-US", {
        minimumFractionDigits: tickStep < 1 ? 2 : 0,
        maximumFractionDigits: tickStep < 1 ? 2 : 0,
      }),
      dateTicks: [
        ...new Set(
          Array.from({ length: dateTickCount }, (_, index) =>
            Math.round((index * (candles.length - 1)) / (dateTickCount - 1)),
          ),
        ),
      ],
    };
  }, [candles, hasSize, hasVolume, size.height, size.width]);

  const lastIndex = candles.length - 1;
  const cursorIndex = hoverIndex ?? pinnedIndex;
  const displayIndex = cursorIndex ?? lastIndex;
  const displayCandle = candles[displayIndex];
  const previousClose =
    displayIndex > 0 ? candles[displayIndex - 1].close : displayCandle?.open;
  const change = displayCandle ? displayCandle.close - previousClose : 0;
  const changePercent = previousClose ? (change / previousClose) * 100 : NaN;

  const formatPrice = (value: number) =>
    `${valuePrefix}${priceFormatter.format(value)}`;

  const clampIndex = (index: number) => Math.max(0, Math.min(lastIndex, index));

  const describeCandle = (candle: Candle) =>
    `${formatDate(candle.date)}: open ${formatPrice(candle.open)}, high ${formatPrice(candle.high)}, low ${formatPrice(candle.low)}, close ${formatPrice(candle.close)}`;

  const describeMeasurement = ({ from, to }: Measurement) => {
    const startCandle = candles[Math.min(from, to)];
    const endCandle = candles[Math.max(from, to)];
    const percent = startCandle.close
      ? ((endCandle.close - startCandle.close) / startCandle.close) * 100
      : NaN;
    const span = Math.abs(to - from);
    return {
      percent,
      label: `${formatPercent(percent)} · ${span} ${span === 1 ? "bar" : "bars"}`,
      text: `${formatPercent(percent)} from ${formatDate(startCandle.date)} to ${formatDate(endCandle.date)}, ${span} ${span === 1 ? "session" : "sessions"}`,
    };
  };

  const togglePin = (index: number) => {
    const next = pinnedIndex === index ? null : index;
    setPinnedIndex(next);
    previousSelection.current.pinnedIndex = next;
    onCandleSelect?.(next === null ? null : candles[next]);
    setAnnouncement(
      next === null
        ? "Selection cleared"
        : `Pinned ${describeCandle(candles[next])}`,
    );
  };

  const clearSelection = () => {
    setHoverIndex(null);
    setMeasurement(null);
    if (pinnedIndex !== null) {
      previousSelection.current.pinnedIndex = null;
      onCandleSelect?.(null);
    }
    setPinnedIndex(null);
  };

  const selectRange = (label: string) => {
    if (label === rangeLabel) return;
    clearSelection();
    setRangeLabel(label);
  };

  const indexAt = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return clampIndex(
      Math.floor((event.clientX - bounds.left) / (layout?.step ?? 1)),
    );
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!layout || !event.isPrimary || event.button !== 0) return;
    const index = indexAt(event);
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { anchor: index, last: index };
    setHoverIndex(index);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!layout) return;
    const index = indexAt(event);
    setHoverIndex(index);
    const drag = dragRef.current;
    if (drag && index !== drag.last) {
      drag.last = index;
      setMeasurement({ from: drag.anchor, to: index });
    }
  };

  const handlePointerUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;
    if (drag.last !== drag.anchor) {
      setAnnouncement(
        describeMeasurement({ from: drag.anchor, to: drag.last }).text,
      );
      return;
    }
    setMeasurement(null);
    togglePin(drag.anchor);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (candles.length === 0) return;
    const current = cursorIndex ?? lastIndex;

    if (event.key === "Escape") {
      clearSelection();
      setAnnouncement("Selection cleared");
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePin(current);
      return;
    }

    const targets: Record<string, number> = {
      ArrowLeft: cursorIndex === null ? lastIndex : current - 1,
      ArrowRight: current + 1,
      Home: 0,
      End: lastIndex,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    const target = clampIndex(targets[event.key]);
    setHoverIndex(target);

    if (event.shiftKey) {
      const next = { from: measurement?.from ?? current, to: target };
      setMeasurement(next);
      setAnnouncement(describeMeasurement(next).text);
      return;
    }
    setMeasurement(null);
    setAnnouncement(describeCandle(candles[target]));
  };

  const cursorCandle = cursorIndex === null ? null : candles[cursorIndex];
  const lastCandle = candles[lastIndex];
  const tagPrice = cursorCandle?.close ?? lastCandle?.close;
  const tagY = layout && tagPrice !== undefined ? layout.y(tagPrice) : null;
  const cursorX = layout && cursorIndex !== null ? layout.x(cursorIndex) : null;
  const lastIsUp = lastCandle ? lastCandle.close >= lastCandle.open : true;
  const measureLabelWidth = measurement
    ? describeMeasurement(measurement).label.length * 6.4 + 12
    : 0;
  const measureView =
    measurement && layout
      ? {
          ...describeMeasurement(measurement),
          fromX: layout.x(measurement.from),
          toX: layout.x(measurement.to),
          fromY: layout.y(candles[measurement.from].close),
          toY: layout.y(candles[measurement.to].close),
          left: layout.x(Math.min(measurement.from, measurement.to)),
          right: layout.x(Math.max(measurement.from, measurement.to)),
          labelX: Math.max(
            measureLabelWidth / 2,
            Math.min(
              layout.right - measureLabelWidth / 2,
              (layout.x(measurement.from) + layout.x(measurement.to)) / 2,
            ),
          ),
        }
      : null;

  return (
    <div
      ref={setRefs}
      className={cn(
        "relative w-full max-w-full sm:max-w-3xl rounded-2xl border border-zinc-200 bg-white/90 p-3 sm:p-6 backdrop-blur-xl shadow-[0_20px_48px_-10px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.8)] dark:border-white/10 dark:bg-zinc-950/75 dark:shadow-[0_20px_48px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.14)] select-none",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-xs sm:text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {title}
          </span>
          <span className="truncate text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400">
            {[
              description,
              displayCandle && formatDate(displayCandle.date),
              pinnedIndex !== null && hoverIndex === null && "Pinned",
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </div>
        {displayCandle && (
          <div className="flex shrink-0 flex-col items-end">
            <span className="text-lg sm:text-2xl font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-100">
              {formatPrice(displayCandle.close)}
            </span>
            <span
              className={cn(
                "text-xs font-medium tabular-nums",
                change >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400",
              )}
            >
              {formatPercent(changePercent)}
            </span>
          </div>
        )}
      </div>

      {ranges.length > 1 && (
        <div
          role="group"
          aria-label="Time range"
          className="relative mt-4 flex w-fit rounded-lg bg-zinc-100 p-0.5 dark:bg-white/5"
        >
          {rangeIndex >= 0 && (
            <span
              aria-hidden="true"
              style={{ transform: `translateX(${rangeIndex * 100}%)` }}
              className="absolute bottom-0.5 left-0.5 top-0.5 w-9 rounded-md bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none dark:bg-white/10"
            />
          )}
          {ranges.map((range) => (
            <button
              key={range.label}
              type="button"
              aria-pressed={range.label === rangeLabel}
              onClick={() => selectRange(range.label)}
              className={rangeButtonClass}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}

      <div
        ref={plotRef}
        tabIndex={candles.length > 0 ? 0 : -1}
        role="group"
        aria-roledescription="candlestick chart"
        aria-label={`${title}, ${candles.length} sessions. Arrow keys inspect candles, Enter pins one, Shift with arrow keys measures change, Escape clears.`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => (dragRef.current = null)}
        onPointerLeave={() => setHoverIndex(null)}
        onKeyDown={handleKeyDown}
        onBlur={() => setHoverIndex(null)}
        className="relative mt-3 h-56 sm:h-64 w-full cursor-crosshair touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-zinc-950"
      >
        {candles.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-zinc-500 dark:text-zinc-400">
            No price data
          </div>
        ) : (
          layout && (
            <svg
              width={size.width}
              height={size.height}
              className="absolute inset-0 overflow-visible"
              aria-hidden="true"
            >
              <g className="candle-grid">
                {layout.ticks.map((tick) => (
                  <g
                    key={tick}
                    className={cn(
                      tagY !== null &&
                        Math.abs(layout.y(tick) - tagY) < 12 &&
                        "[&>text]:opacity-0",
                    )}
                  >
                    <line
                      x1={0}
                      x2={layout.right}
                      y1={layout.y(tick)}
                      y2={layout.y(tick)}
                      className="stroke-zinc-100 dark:stroke-white/5"
                    />
                    <text
                      x={layout.right + 8}
                      y={layout.y(tick) + 3}
                      className="fill-zinc-400 text-[10px] tabular-nums dark:fill-zinc-500"
                    >
                      {layout.tickFormatter.format(tick)}
                    </text>
                  </g>
                ))}
                {layout.dateTicks.map((index) => (
                  <text
                    key={index}
                    x={index === 0 ? 0 : layout.x(index)}
                    y={layout.bottom + 16}
                    textAnchor={index === 0 ? "start" : "middle"}
                    className="fill-zinc-400 text-[10px] dark:fill-zinc-500"
                  >
                    {formatDate(candles[index].date)}
                  </text>
                ))}
              </g>

              {measureView && (
                <rect
                  x={measureView.left - layout.step / 2}
                  y={PLOT_TOP}
                  width={measureView.right - measureView.left + layout.step}
                  height={layout.priceBottom - PLOT_TOP}
                  className={
                    measureView.percent >= 0
                      ? "fill-emerald-500/10"
                      : "fill-rose-500/10"
                  }
                />
              )}

              {candles.map((candle, index) => {
                const up = candle.close >= candle.open;
                const x = layout.x(index);
                const top = layout.y(Math.max(candle.open, candle.close));
                const bodyHeight = Math.max(
                  1,
                  layout.y(Math.min(candle.open, candle.close)) - top,
                );
                const volumeHeight = layout.maxVolume
                  ? ((candle.volume ?? 0) / layout.maxVolume) *
                    layout.volumeHeight
                  : 0;
                const inMeasure =
                  measurement &&
                  index >= Math.min(measurement.from, measurement.to) &&
                  index <= Math.max(measurement.from, measurement.to);
                const dimmed = measurement
                  ? !inMeasure
                  : cursorIndex !== null && cursorIndex !== index;

                return (
                  <g
                    key={`${candle.date}-${index}`}
                    className={cn(
                      "transition-opacity duration-150 motion-reduce:transition-none",
                      up
                        ? "fill-emerald-500 stroke-emerald-500 dark:fill-emerald-400 dark:stroke-emerald-400"
                        : "fill-rose-500 stroke-rose-500 dark:fill-rose-400 dark:stroke-rose-400",
                      dimmed ? "opacity-35" : "opacity-100",
                    )}
                  >
                    {hasVolume && (
                      <rect
                        className="candle-volume"
                        x={x - layout.bodyWidth / 2}
                        y={layout.bottom - volumeHeight}
                        width={layout.bodyWidth}
                        height={volumeHeight}
                        rx={1}
                        fillOpacity={0.2}
                        stroke="none"
                      />
                    )}
                    <g className="candle-body">
                      <line
                        x1={x}
                        x2={x}
                        y1={layout.y(candle.high)}
                        y2={layout.y(candle.low)}
                        strokeWidth={1}
                      />
                      <rect
                        x={x - layout.bodyWidth / 2}
                        y={top}
                        width={layout.bodyWidth}
                        height={bodyHeight}
                        rx={Math.min(2, layout.bodyWidth / 4)}
                        stroke="none"
                      />
                    </g>
                  </g>
                );
              })}

              {measureView && (
                <g className="pointer-events-none">
                  <line
                    x1={measureView.fromX}
                    x2={measureView.toX}
                    y1={measureView.fromY}
                    y2={measureView.toY}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    className="stroke-zinc-900 dark:stroke-zinc-100"
                  />
                  <circle
                    cx={measureView.fromX}
                    cy={measureView.fromY}
                    r={3}
                    className="fill-zinc-900 dark:fill-zinc-100"
                  />
                  <rect
                    x={measureView.labelX - measureLabelWidth / 2}
                    y={PLOT_TOP}
                    width={measureLabelWidth}
                    height={18}
                    rx={9}
                    className={
                      measureView.percent >= 0
                        ? "fill-emerald-500 dark:fill-emerald-400"
                        : "fill-rose-500 dark:fill-rose-400"
                    }
                  />
                  <text
                    x={measureView.labelX}
                    y={PLOT_TOP + 12.5}
                    textAnchor="middle"
                    className="fill-white text-[10px] font-semibold tabular-nums dark:fill-zinc-950"
                  >
                    {measureView.label}
                  </text>
                </g>
              )}

              {cursorX !== null && (
                <line
                  x1={cursorX}
                  x2={cursorX}
                  y1={PLOT_TOP}
                  y2={layout.bottom}
                  className="pointer-events-none stroke-zinc-300 dark:stroke-zinc-600"
                  strokeDasharray={
                    hoverIndex === null && pinnedIndex !== null
                      ? undefined
                      : "3 3"
                  }
                />
              )}

              {tagY !== null && tagPrice !== undefined && (
                <g className="pointer-events-none">
                  <rect
                    x={layout.right + 2}
                    y={tagY - 9}
                    width={AXIS_WIDTH - 4}
                    height={18}
                    rx={4}
                    className={
                      cursorCandle
                        ? "fill-zinc-900 dark:fill-zinc-100"
                        : lastIsUp
                          ? "fill-emerald-500 dark:fill-emerald-400"
                          : "fill-rose-500 dark:fill-rose-400"
                    }
                  />
                  <text
                    x={layout.right + AXIS_WIDTH / 2}
                    y={tagY + 3.5}
                    textAnchor="middle"
                    className={cn(
                      "text-[10px] font-medium tabular-nums",
                      cursorCandle
                        ? "fill-white dark:fill-zinc-900"
                        : "fill-white dark:fill-zinc-950",
                    )}
                  >
                    {priceFormatter.format(tagPrice)}
                  </text>
                </g>
              )}
            </svg>
          )
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
});

CandlestickChart.displayName = "CandlestickChart";

