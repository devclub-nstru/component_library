"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type CSSProperties,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronDown, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  time?: string;
  color?: string;
  assignee?: string;
}

export interface CalendarCardProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  className?: string;
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventAdd?: (event: CalendarEvent) => void;
  accentColor?: string;
  density?: "comfortable" | "compact";
  weekStartsOn?: 0 | 1;
  showEvents?: boolean;
  showProgress?: boolean;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const weekdays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];
const subscribe = () => () => {};
const readToday = () => new Date().toDateString();
const serverToday = () => "";

function inMonth(date: Date, year: number, month: number) {
  return new Date(
    year,
    month,
    Math.min(date.getDate(), new Date(year, month + 1, 0).getDate()),
  );
}

export function CalendarCard({
  value, defaultValue, onChange, className, events = [], onEventClick, onEventAdd,
  accentColor = "#ff675c", density = "comfortable", weekStartsOn = 1,
  showEvents = true, showProgress = true,
}: CalendarCardProps) {
  const today = useSyncExternalStore(subscribe, readToday, serverToday);
  const [internalDate, setInternalDate] = useState(defaultValue);
  const date = value ?? internalDate ?? new Date(today || "January 1, 2000");
  const ready = Boolean(value || internalDate || today);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const [pickerYear, setPickerYear] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const eventTitleRef = useRef<HTMLInputElement>(null);
  const popupAnchor = useRef<HTMLButtonElement | null>(null);
  const closePopupTween = useRef<gsap.core.Tween | null>(null);
  const [popupDay, setPopupDay] = useState<number | null>(null);
  const [eventFormDate, setEventFormDate] = useState<string | null>(null);
  const titleRef = useRef<HTMLButtonElement>(null);
  const keyboardFocus = useRef(false);
  const previousNumbers = useRef({ day, year: pickerYear });
  const previousHighlight = useRef<HTMLElement | null>(null);
  const panelId = useId();
  const popupId = useId();
  const count = new Date(year, month + 1, 0).getDate();
  const offset = (new Date(year, month, 1).getDay() - weekStartsOn + 7) % 7;
  const week = weekStartsOn === 1 ? weekdays : [weekdays[6], ...weekdays.slice(0, 6)];
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const eventsByDay = new Map<number, CalendarEvent[]>();
  for (const event of events) {
    if (!event.date.startsWith(`${monthKey}-`)) continue;
    const eventDay = Number(event.date.slice(monthKey.length + 1));
    if (event.date !== `${monthKey}-${String(eventDay).padStart(2, "0")}` || eventDay < 1 || eventDay > count) continue;
    const entries = eventsByDay.get(eventDay) ?? [];
    entries.push(event);
    eventsByDay.set(eventDay, entries);
  }
  const selectedEvents = eventsByDay.get(day) ?? [];
  const popupEvents = eventsByDay.get(popupDay ?? 0) ?? [];
  const popupOpen = showEvents && pickerYear === null && popupDay !== null && popupEvents.length > 0;
  const dateKey = `${monthKey}-${String(day).padStart(2, "0")}`;
  const EventTag = onEventClick ? "button" : "div";
  const selectedLabel = `${months[month]} ${day}, ${year}`;
  const buttonClass = "cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--calendar-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#191919]";

  useGSAP(
    () => {
      if (!ready) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-calendar-panel]", {
          y: 8, opacity: 0, duration: 0.28,
          ease: "power3.out", clearProps: "transform,opacity",
        });
      }, rootRef);
      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [year, month, pickerYear !== null, ready],
      revertOnUpdate: true,
    },
  );

  useGSAP(() => {
    const previous = previousNumbers.current;
    previousNumbers.current = { day, year: pickerYear };
    if (!ready) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      for (const [name, before, after] of [
        ["day", previous.day, day],
        ["year", previous.year, pickerYear],
      ] as const) {
        if (before === null || after === null || before === after) continue;
        const direction = after > before ? 1 : -1;
        const duration = name === "year" ? 0.38 : 0.3;
        const slots = rootRef.current?.querySelectorAll<HTMLElement>(
          name === "year" ? "[data-calendar-year-digit]" : "[data-calendar-day-number]",
        );
        slots?.forEach((slot) => {
          const place = Number(slot.dataset.calendarYearDigit ?? 0);
          const oldText = name === "year" ? String(before).at(-place - 1) ?? "" : String(before);
          const newText = name === "year" ? String(after).at(-place - 1) ?? "" : String(after);
          if (oldText === newText) return;
          const outgoing = slot.querySelector<HTMLElement>(`[data-calendar-${name}-out]`);
          const incoming = slot.querySelector<HTMLElement>(`[data-calendar-${name}]`);
          if (!outgoing || !incoming) return;
          outgoing.textContent = oldText;
          gsap.fromTo(outgoing,
            { yPercent: 0, opacity: 1 },
            { yPercent: -direction * 100, opacity: 0, duration, ease: "power3.out" },
          );
          gsap.fromTo(incoming,
            { yPercent: direction * 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration, ease: "power3.out" },
          );
        });
      }
    }, rootRef);
    return () => media.revert();
  }, { scope: rootRef, dependencies: [day, pickerYear, ready], revertOnUpdate: true });

  useGSAP(() => {
    const grid = rootRef.current?.querySelector<HTMLElement>("[data-calendar-grid]");
    const hover = grid?.querySelector<HTMLElement>("[data-calendar-hover]");
    if (!grid || !hover) return;
    const media = gsap.matchMedia();
    media.add({ reduced: "(prefers-reduced-motion: reduce)", standard: "(prefers-reduced-motion: no-preference)" }, (context) => {
      const duration = context.conditions?.reduced ? 0 : 0.24;
      const xTo = gsap.quickTo(hover, "x", { duration, ease: "power3.out" });
      const yTo = gsap.quickTo(hover, "y", { duration, ease: "power3.out" });
      const opacityTo = gsap.quickTo(hover, "opacity", { duration: duration * 0.75 });
      let hovered: HTMLElement | null = null;
      const hide = () => { hovered = null; opacityTo(0); };
      const move = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const target = (event.target as HTMLElement).closest<HTMLElement>("[data-calendar-date]");
        if (!target || !grid.contains(target)) return;
        const first = !hovered;
        hovered = target;
        xTo(target.offsetLeft);
        yTo(target.offsetTop);
        if (first) {
          xTo.tween.progress(1);
          yTo.tween.progress(1);
        }
        opacityTo(1);
      };
      let width = grid.clientWidth;
      const observer = new ResizeObserver(() => {
        if (grid.clientWidth === width) return;
        width = grid.clientWidth;
        hide();
      });
      observer.observe(grid);
      grid.addEventListener("pointerover", move);
      grid.addEventListener("pointerleave", hide);
      return () => {
        observer.disconnect();
        grid.removeEventListener("pointerover", move);
        grid.removeEventListener("pointerleave", hide);
      };
    }, rootRef);
    return () => media.revert();
  }, { scope: rootRef, dependencies: [year, month, pickerYear !== null, ready, density, weekStartsOn], revertOnUpdate: true });

  useEffect(() => {
    if (!ready || !rootRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fills = rootRef.current.querySelectorAll("[data-calendar-fill]");
    const fillTween = fills.length ? gsap.to(fills, {
      scaleX: (index: number) => Math.max(0, Math.min(1, day / count * 4 - index)),
      duration: reduced ? 0 : 0.35,
      ease: "power3.out",
      overwrite: true,
    }) : undefined;
    const highlight = rootRef.current.querySelector<HTMLElement>("[data-calendar-highlight]");
    const selected = rootRef.current.querySelector<HTMLElement>("[data-selected-day]");
    let highlightTween: gsap.core.Tween | undefined;
    let observer: ResizeObserver | undefined;
    if (highlight && selected) {
      const first = previousHighlight.current !== highlight;
      previousHighlight.current = highlight;
      const position = { x: selected.offsetLeft, y: selected.offsetTop, opacity: 1 };
      highlightTween = gsap.to(highlight, {
        ...position,
        duration: reduced || first ? 0 : 0.3,
        ease: "power3.out",
        overwrite: true,
      });
      let width = highlight.parentElement!.clientWidth;
      observer = new ResizeObserver(() => {
        const nextWidth = highlight.parentElement!.clientWidth;
        if (nextWidth === width) return;
        width = nextWidth;
        highlightTween?.kill();
        gsap.set(highlight, { x: selected.offsetLeft, y: selected.offsetTop, opacity: 1 });
      });
      observer.observe(highlight.parentElement!);
    }
    return () => {
      fillTween?.kill();
      highlightTween?.kill();
      observer?.disconnect();
    };
  }, [day, count, year, month, pickerYear, ready, density, weekStartsOn, showProgress]);

  useEffect(() => {
    if (!keyboardFocus.current) return;
    rootRef.current?.querySelector<HTMLButtonElement>("[data-selected-day]")?.focus();
    keyboardFocus.current = false;
  }, [year, month, day]);

  useGSAP(() => {
    const popup = popupRef.current;
    const anchor = popupAnchor.current;
    const root = rootRef.current;
    if (!popupOpen || !popup || !anchor || !root) return;
    const media = gsap.matchMedia();
    const position = () => {
      const card = root.getBoundingClientRect();
      const cell = anchor.getBoundingClientRect();
      const width = popup.offsetWidth;
      const height = popup.offsetHeight;
      const x = Math.max(12, Math.min(cell.left - card.left + cell.width / 2 - width / 2, root.clientWidth - width - 12));
      const below = cell.bottom - card.top + 6;
      const y = Math.max(12, below + height < root.clientHeight - 12 ? below : cell.top - card.top - height - 6);
      gsap.set(popup, { left: x, top: y });
    };
    position();
    const observer = new ResizeObserver(position);
    observer.observe(root);
    observer.observe(popup);
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(popup, { y: 5, opacity: 0, duration: 0.18, ease: "power3.out", clearProps: "transform,opacity" });
    }, rootRef);
    return () => { observer.disconnect(); media.revert(); };
  }, { scope: rootRef, dependencies: [popupDay, popupOpen, year, month, density, weekStartsOn], revertOnUpdate: true });

  useEffect(() => () => { closePopupTween.current?.kill(); }, []);

  useEffect(() => {
    if (!popupOpen) return;
    const dismiss = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!popupRef.current?.contains(target) && !popupAnchor.current?.contains(target)) setPopupDay(null);
    };
    document.addEventListener("pointerdown", dismiss, true);
    return () => document.removeEventListener("pointerdown", dismiss, true);
  }, [popupOpen]);

  function showPopup(number: number, anchor: HTMLButtonElement) {
    closePopupTween.current?.kill();
    popupAnchor.current = anchor;
    setPopupDay(number);
  }

  function schedulePopupClose() {
    closePopupTween.current?.kill();
    closePopupTween.current = gsap.delayedCall(0.15, () => {
      if (!popupRef.current?.contains(document.activeElement)) setPopupDay(null);
    });
  }

  function pick(next: Date) {
    closePopupTween.current?.kill();
    setPopupDay(null);
    if (value === undefined) setInternalDate(next);
    onChange?.(new Date(next));
  }

  function onDayKey(event: KeyboardEvent<HTMLButtonElement>, number: number) {
    const current = new Date(year, month, number);
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    let next: Date;
    if (event.key in steps) {
      next = new Date(year, month, number + steps[event.key]);
    } else if (event.key === "Home") next = new Date(year, month, 1);
    else if (event.key === "End") next = new Date(year, month, count);
    else if (event.key === "PageUp" || event.key === "PageDown") {
      next = inMonth(current, year, month + (event.key === "PageUp" ? -1 : 1));
    } else return;
    event.preventDefault();
    keyboardFocus.current = true;
    pick(next);
  }

  return (
    <Dialog.Root open={eventFormDate !== null} onOpenChange={(open) => { setEventFormDate(open ? dateKey : null); setPopupDay(null); }}>
    <div
      ref={rootRef}
      data-slot="calendar-card"
      aria-label="Date picker"
      aria-busy={!ready}
      onKeyDown={(event) => { if (event.key === "Escape" && popupOpen) { event.stopPropagation(); popupAnchor.current?.focus(); setPopupDay(null); } }}
      style={{
        "--calendar-accent": accentColor,
        "--calendar-cell-mobile": density === "compact" ? "36px" : "40px",
        "--calendar-cell-desktop": density === "compact" ? "36px" : "44px",
      } as CSSProperties}
      className={cn(
        "@container relative w-full max-w-[44rem] rounded-3xl border border-white/10 bg-[#191919] p-4 text-zinc-100 shadow-[0_24px_48px_-16px_#000,0_1px_1px_0_#ffffff18,inset_0_1px_0_0_#ffffff0a] sm:rounded-[2rem] sm:p-8",
        className,
      )}
    >
      <div className={cn("@min-[480px]:grid @min-[480px]:grid-cols-[184px_minmax(0,1fr)] @min-[480px]:gap-x-8", !ready && "invisible")}>
        <div className="@min-[480px]:col-start-1 @min-[480px]:row-start-1">
          <div className={cn("flex items-start justify-between gap-3 @min-[480px]:flex-col-reverse @min-[480px]:gap-5", onEventAdd && "flex-col-reverse gap-4")}>
            <div className="flex min-w-0 items-center gap-4 @min-[480px]:block">
              <span className="mb-3 hidden text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400 @min-[480px]:block">Selected date</span>
              <div data-calendar-day-number className="relative h-14 shrink-0 overflow-hidden text-5xl font-medium leading-none tracking-[-0.07em] tabular-nums @min-[480px]:h-20 @min-[480px]:text-7xl" aria-hidden="true">
                <span data-calendar-day-out className="absolute inset-x-0 top-0 opacity-0" />
                <span data-calendar-day className="block">{day}</span>
              </div>
              <button ref={titleRef} type="button" aria-expanded={pickerYear !== null} aria-controls={panelId} aria-label="Choose month and year" onClick={() => setPickerYear(pickerYear === null ? year : null)} className={cn(buttonClass, "grid min-h-11 grid-cols-[auto_auto] items-center gap-x-2 px-2 py-1 text-left text-base hover:bg-white/5 @min-[480px]:-ml-2 @min-[480px]:flex @min-[480px]:min-h-0 @min-[480px]:gap-1")}>
                <span className="col-start-1 font-medium">{months[month]}</span>
                <span className="col-start-1 row-start-2 text-sm text-zinc-400 @min-[480px]:text-base">{year}</span>
                <ChevronDown aria-hidden="true" size={14} className={cn("col-start-2 row-span-2 row-start-1 text-zinc-400", pickerYear !== null && "rotate-180")} />
              </button>
            </div>
            <div className={cn("mt-1 flex items-center gap-3", onEventAdd && "w-full justify-between")}>
              <button type="button" aria-label="Go to today" title="Go to today" onClick={() => { const now = new Date(); pick(new Date(now.getFullYear(), now.getMonth(), now.getDate())); setPickerYear(null); }} className={cn(buttonClass, "group h-10 w-10 shrink-0 @min-[480px]:h-12 @min-[480px]:w-12 overflow-hidden border border-white/5 bg-[#202020] shadow-[0_3px_8px_#0004] hover:bg-[#292929]")}>
                <span aria-hidden="true" className="block h-3 bg-[var(--calendar-accent)] shadow-[0_2px_8px_color-mix(in_srgb,var(--calendar-accent)_20%,transparent)]" />
                <span aria-hidden="true" className="grid grid-cols-7 gap-0.5 p-2">
                  {Array.from({ length: 21 }, (_, index) => <span key={index} className={cn("h-0.5 rounded-full bg-zinc-600", index === (day - 1) % 21 && "bg-[var(--calendar-accent)]")} />)}
                </span>
              </button>
              {onEventAdd && (
                <Dialog.Trigger asChild>
                  <button type="button" className={cn(buttonClass, "flex min-h-10 shrink-0 items-center gap-2 border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium hover:bg-white/10")}><Plus size={14} aria-hidden="true" />Add event</button>
                </Dialog.Trigger>
              )}
            </div>
          </div>

          {showProgress && <div className="my-4 flex gap-1.5 @min-[480px]:my-6" aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => (
              <span key={index} className="h-1 flex-1 overflow-hidden rounded-full bg-white/7">
                <span data-calendar-fill className="block h-full origin-left rounded-full bg-[var(--calendar-accent)]" style={{ transform: "scaleX(0)" }} />
              </span>
            ))}
          </div>}
        </div>

        <div id={panelId} data-calendar-panel className="min-h-64 @min-[480px]:col-start-2 @min-[480px]:row-span-2 @min-[480px]:row-start-1 @min-[480px]:min-h-86 @min-[480px]:border-l @min-[480px]:border-white/5 @min-[480px]:pl-8" onKeyDown={(event) => { if (event.key === "Escape" && pickerYear !== null) { setPickerYear(null); titleRef.current?.focus(); } }}>
          {pickerYear !== null ? (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <button type="button" aria-label="Previous year" onClick={() => setPickerYear(pickerYear - 1)} className={cn(buttonClass, "flex h-11 w-11 items-center justify-center rounded-full bg-white/5 @min-[480px]:h-9 @min-[480px]:w-9 hover:bg-white/10")}><ChevronLeft aria-hidden="true" size={16} /></button>
                <span aria-live="polite" className="inline-flex h-7 items-center justify-center text-lg font-semibold leading-7 tabular-nums">
                  <span className="sr-only">{pickerYear}</span>
                  {String(pickerYear).split("").map((digit, index, digits) => (
                    <span key={digits.length - index} data-calendar-year-digit={digits.length - index - 1} aria-hidden="true" className="relative block h-7 w-[1ch] overflow-hidden text-center">
                      <span data-calendar-year-out className="absolute inset-x-0 top-0 opacity-0" />
                      <span data-calendar-year className="block">{digit}</span>
                    </span>
                  ))}
                </span>
                <button type="button" aria-label="Next year" onClick={() => setPickerYear(pickerYear + 1)} className={cn(buttonClass, "flex h-11 w-11 items-center justify-center rounded-full bg-white/5 @min-[480px]:h-9 @min-[480px]:w-9 hover:bg-white/10")}><ChevronRight aria-hidden="true" size={16} /></button>
              </div>
              <div role="group" aria-label={`Months in ${pickerYear}`} className="grid grid-cols-3 gap-x-4 gap-y-3 @min-[480px]:gap-y-5">
                {months.map((name, index) => (
                  <button key={name} type="button" aria-label={`${name} ${pickerYear}`} aria-pressed={index === month && pickerYear === year} onClick={() => { pick(inMonth(date, pickerYear, index)); setPickerYear(null); titleRef.current?.focus(); }} className={cn(buttonClass, "h-11 text-sm font-medium @min-[480px]:h-11 @min-[480px]:text-base", index === month && pickerYear === year ? "bg-[var(--calendar-accent)] text-zinc-950 shadow-[0_2px_12px_color-mix(in_srgb,var(--calendar-accent)_16%,transparent)]" : "text-zinc-300 hover:bg-white/5 hover:text-white")}>
                    {name.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div role="group" aria-label={`${months[month]} ${year}`}>
              <div className="mb-3 grid grid-cols-7 @min-[480px]:mb-5">
                {week.map((name) => <span key={name} aria-label={name} className="text-center text-xs font-medium text-zinc-400">{name[0]}</span>)}
              </div>
              <div data-calendar-grid className="relative grid grid-cols-7 gap-y-1 @min-[480px]:gap-y-2">
                <span data-calendar-highlight aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-[var(--calendar-cell-mobile)] w-[calc(100%/7)] rounded-lg bg-[var(--calendar-accent)] opacity-0 shadow-[0_2px_12px_color-mix(in_srgb,var(--calendar-accent)_16%,transparent)] @min-[480px]:h-[var(--calendar-cell-desktop)]" />
                <span data-calendar-hover aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-[1] h-[var(--calendar-cell-mobile)] w-[calc(100%/7)] rounded-lg border border-white/10 bg-white/5 opacity-0 @min-[480px]:h-[var(--calendar-cell-desktop)]" />
                {Array.from({ length: offset }, (_, index) => <span key={`empty-${index}`} aria-hidden="true" />)}
                {Array.from({ length: count }, (_, index) => {
                  const number = index + 1;
                  const dayEvents = eventsByDay.get(number) ?? [];
                  return (
                    <button
                      key={number}
                      type="button"
                      data-calendar-date=""
                      data-selected-day={number === day ? "" : undefined}
                      aria-label={`${months[month]} ${number}, ${year}${dayEvents.length ? `, ${dayEvents.length} ${dayEvents.length === 1 ? "event" : "events"}` : ""}`}
                      aria-pressed={number === day}
                      tabIndex={number === day ? 0 : -1}
                      aria-haspopup={showEvents && dayEvents.length > 0 ? "dialog" : undefined}
                      aria-expanded={showEvents && dayEvents.length > 0 ? popupOpen && popupDay === number : undefined}
                      aria-controls={popupOpen && popupDay === number ? popupId : undefined}
                      onPointerEnter={(event) => { if (event.pointerType !== "touch" && !eventFormDate) showPopup(number, event.currentTarget); }}
                      onPointerLeave={schedulePopupClose}
                      onFocus={(event) => { if (event.currentTarget.matches(":focus-visible") && !eventFormDate) showPopup(number, event.currentTarget); }}
                      onBlur={(event) => { if (!popupRef.current?.contains(event.relatedTarget)) schedulePopupClose(); }}
                      onClick={(event) => { pick(new Date(year, month, number)); showPopup(number, event.currentTarget); }}
                      onKeyDown={(event) => onDayKey(event, number)}
                      className={cn(
                        buttonClass,
                        "relative z-10 flex h-[var(--calendar-cell-mobile)] flex-col items-center justify-center rounded-lg text-base font-medium tabular-nums @min-[480px]:h-[var(--calendar-cell-desktop)]",
                        number === day
                          ? "text-zinc-950"
                          : "text-zinc-200 hover:text-white",
                      )}
                    >
                      <span className="leading-none">{number}</span>
                      {events.length > 0 && (
                        <span aria-hidden="true" className="mt-1 flex h-[3px] items-center justify-center gap-[3px]">
                          {dayEvents.slice(0, 3).map((event) => <span key={event.id} className="size-[3px] rounded-full" style={{ backgroundColor: number === day ? "#09090b" : event.color ?? accentColor }} />)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {popupOpen && (
          <div ref={popupRef} id={popupId} role="dialog" aria-label={`Events for ${months[month]} ${popupDay}, ${year}`} onPointerEnter={() => closePopupTween.current?.kill()} onPointerLeave={schedulePopupClose} onFocus={() => closePopupTween.current?.kill()} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) schedulePopupClose(); }} className="absolute z-30 w-[min(17rem,calc(100%_-_24px))] rounded-2xl border border-white/10 bg-[#242424] p-4 shadow-[0_12px_40px_#0009]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-medium">{months[month].slice(0, 3)} {popupDay} · {popupEvents.length} {popupEvents.length === 1 ? "event" : "events"}</span>
              <button type="button" aria-label="Close event popup" onClick={() => { popupAnchor.current?.focus(); setPopupDay(null); }} className={cn(buttonClass, "flex size-6 items-center justify-center text-zinc-400 hover:bg-white/10")}><X size={13} aria-hidden="true" /></button>
            </div>
            <ul className="max-h-40 space-y-2 overflow-y-auto">
              {popupEvents.map((event) => (
                <li key={event.id}>
                  <EventTag type={onEventClick ? "button" : undefined} onClick={onEventClick ? () => onEventClick(event) : undefined} className={cn("flex w-full items-start gap-2 rounded-xl px-2 py-2 text-left", onEventClick && [buttonClass, "bg-white/4 hover:bg-white/8"])}>
                    <span aria-hidden="true" className="mt-1 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: event.color ?? accentColor }} />
                    <span className="min-w-0 flex-1">
                      <span className="block break-words text-xs font-medium">{event.title}</span>
                      <span className="mt-1 block text-[10px] text-zinc-400">{event.time ?? "All day"}{event.assignee && ` · ${event.assignee}`}</span>
                    </span>
                  </EventTag>
                </li>
              ))}
            </ul>
            {onEventAdd && <button type="button" onClick={() => { setEventFormDate(`${monthKey}-${String(popupDay).padStart(2, "0")}`); setPopupDay(null); }} className={cn(buttonClass, "mt-3 flex w-full items-center justify-center gap-2 border-t border-white/10 pt-3 text-xs text-zinc-300")}><Plus size={13} aria-hidden="true" />Add event to this day</button>}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 @min-[480px]:col-start-1 @min-[480px]:row-start-2 @min-[480px]:self-end">
          <button type="button" aria-label="Previous month" onClick={() => { pick(inMonth(date, year, month - 1)); setPickerYear(null); }} className={cn(buttonClass, "flex h-11 w-11 items-center justify-center text-zinc-400 @min-[480px]:h-8 @min-[480px]:w-8 hover:bg-white/5 hover:text-white")}><ChevronLeft aria-hidden="true" size={15} /></button>
          <span className="text-xs font-medium text-zinc-400">{weekdays[(date.getDay() + 6) % 7].slice(0, 3)}, {months[month].slice(0, 3)} {day}</span>
          <button type="button" aria-label="Advance one month" onClick={() => { pick(inMonth(date, year, month + 1)); setPickerYear(null); }} className={cn(buttonClass, "flex h-11 w-11 items-center justify-center text-zinc-400 @min-[480px]:h-8 @min-[480px]:w-8 hover:bg-white/5 hover:text-white")}><ChevronRight aria-hidden="true" size={15} /></button>
        </div>
        <span role="status" className="sr-only">Selected date: {selectedLabel}{events.length > 0 && `, ${selectedEvents.length} ${selectedEvents.length === 1 ? "event" : "events"}`}</span>
      </div>
    </div>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
      <Dialog.Content onOpenAutoFocus={(event) => { event.preventDefault(); eventTitleRef.current?.focus(); }} style={{ "--calendar-accent": accentColor } as CSSProperties} className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/10 bg-[#202020] p-6 text-zinc-100 shadow-2xl">
        <Dialog.Title className="text-lg font-semibold">Add an event</Dialog.Title>
        <Dialog.Description className="mt-1 text-xs text-zinc-400">Choose a date and optionally assign it to someone.</Dialog.Description>
        <Dialog.Close aria-label="Close add event" className={cn(buttonClass, "absolute right-4 top-4 flex size-8 items-center justify-center hover:bg-white/5")}><X size={16} aria-hidden="true" /></Dialog.Close>
        <form className="mt-5 space-y-4" onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const fields = new FormData(form);
          const title = String(fields.get("title") ?? "").trim();
          const titleInput = form.elements.namedItem("title") as HTMLInputElement;
          if (!title) { titleInput.setCustomValidity("Enter an event title."); titleInput.reportValidity(); return; }
          const eventDate = String(fields.get("date"));
          onEventAdd?.({ id: crypto.randomUUID(), date: eventDate, title, time: String(fields.get("time") ?? "") || undefined, assignee: String(fields.get("assignee") ?? "").trim() || undefined, color: String(fields.get("color")) });
          pick(new Date(`${eventDate}T00:00:00`));
          setEventFormDate(null);
        }}>
          <label className="block space-y-1.5 text-xs text-zinc-300">Title<input ref={eventTitleRef} name="title" required maxLength={120} placeholder="Design review" onInput={(event) => event.currentTarget.setCustomValidity("")} className={cn(buttonClass, "block w-full cursor-text rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-base text-white sm:text-sm")} /></label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5 text-xs text-zinc-300">Date<input name="date" type="date" required defaultValue={eventFormDate ?? dateKey} className={cn(buttonClass, "block w-full min-w-0 rounded-lg border border-white/10 bg-white/5 px-2 py-2.5 text-base [color-scheme:dark] sm:text-xs")} /></label>
            <label className="block space-y-1.5 text-xs text-zinc-300">Time<input name="time" type="time" className={cn(buttonClass, "block w-full min-w-0 rounded-lg border border-white/10 bg-white/5 px-2 py-2.5 text-base [color-scheme:dark] sm:text-xs")} /></label>
          </div>
          <label className="block space-y-1.5 text-xs text-zinc-300">Assign to <span className="text-zinc-500">(optional)</span><input name="assignee" maxLength={80} placeholder="Name or team" className={cn(buttonClass, "block w-full cursor-text rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-base text-white sm:text-sm")} /></label>
          <label className="flex items-center justify-between text-xs text-zinc-300">Event color<input name="color" type="color" defaultValue={accentColor.startsWith("#") && accentColor.length === 7 ? accentColor : "#ff675c"} className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent" /></label>
          <div className="flex justify-end gap-2 pt-2">
            <Dialog.Close className={cn(buttonClass, "px-4 py-2 text-xs text-zinc-400 hover:bg-white/5")}>Cancel</Dialog.Close>
            <button type="submit" className={cn(buttonClass, "bg-[var(--calendar-accent)] px-4 py-2 text-xs font-semibold text-zinc-950")}>Save event</button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CalendarCard;
