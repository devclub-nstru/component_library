"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface MorphSearchProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string, intent?: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

type IntentType = "poll" | "event" | "todo" | "timer" | "split" | "search";

interface PollData {
  title: string;
  options: string[];
}

interface EventData {
  title: string;
  time: string;
  attendee: string;
}

interface TodoData {
  items: string[];
}

interface TimerData {
  seconds: number;
  label: string;
}

interface SplitData {
  total: number;
  people: number;
  perPerson: number;
}

interface DetectedIntent {
  type: IntentType;
  poll?: PollData;
  event?: EventData;
  todo?: TodoData;
  timer?: TimerData;
  split?: SplitData;
}

interface SavedEntry {
  id: number;
  intent: IntentType;
  text: string;
  summary: string;
  timestamp: number;
}

const PLACEHOLDERS = [
  "pizza or burgers for friday?",
  "dinner with priya friday 8pm",
  "buy milk, eggs, bread and coffee",
  "25 min focus",
  "split 2400 between 3",
  "explore components and hooks",
];

const springMorph: Transition = {
  type: "spring",
  stiffness: 440,
  damping: 38,
  mass: 0.8,
};

const fadeTween: Transition = {
  duration: 0.14,
  ease: [0.23, 1, 0.32, 1],
};

function parseQuery(text: string): DetectedIntent {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  if (!clean) {
    return { type: "search" };
  }

  if (
    lower.includes(" or ") ||
    lower.includes(" vs ") ||
    (lower.endsWith("?") &&
      (lower.includes("pizza") || lower.includes("burger")))
  ) {
    const rawNoQ = clean.replace(/\?+$/, "");
    const parts = rawNoQ.split(/\s+(?:or|vs\.?)\s+/i).map((s) => s.trim());
    if (parts.length >= 2) {
      const opts = parts.map((p) => {
        const words = p.split(/\s+/);
        return words.length > 3 ? words.slice(-2).join(" ") : p;
      });
      return {
        type: "poll",
        poll: {
          title: clean.endsWith("?") ? clean : `${clean}?`,
          options: opts.slice(0, 4),
        },
      };
    }
  }

  if (
    /^(?:split|divide|share)\b/i.test(lower) ||
    (/\bbetween\s+\d+/i.test(lower) && /\d+/.test(lower))
  ) {
    const numbers = lower.match(/\d+(?:\.\d+)?/g);
    if (numbers && numbers.length >= 2) {
      const total = parseFloat(numbers[0]);
      const people = parseInt(numbers[1], 10) || 1;
      const perPerson = Math.round((total / Math.max(1, people)) * 100) / 100;
      return {
        type: "split",
        split: { total, people, perPerson },
      };
    }
  }

  if (
    /\b(?:timer|focus|break|pomodoro)\b/i.test(lower) ||
    /^\d+\s*(?:m|min|mins|minutes|s|sec|seconds|h|hr|hrs|hours)\b/i.test(lower)
  ) {
    let secs = 25 * 60;
    const match = lower.match(
      /(\d+)\s*(m|min|mins|minutes|s|sec|seconds|h|hr|hrs|hours)?/i,
    );
    if (match) {
      const num = parseInt(match[1], 10);
      const unit = match[2]?.charAt(0) || "m";
      if (unit === "h") secs = num * 3600;
      else if (unit === "s") secs = num;
      else secs = num * 60;
    }
    const label = lower
      .replace(
        /\d+\s*(?:m|min|mins|minutes|s|sec|seconds|h|hr|hrs|hours)?/i,
        "",
      )
      .replace(/timer|for/gi, "")
      .trim();
    return {
      type: "timer",
      timer: {
        seconds: Math.max(10, secs),
        label: label
          ? label.charAt(0).toUpperCase() + label.slice(1)
          : "Focus Session",
      },
    };
  }

  if (
    /^(?:buy|get|todo|tasks|groceries|shopping list)\b/i.test(lower) ||
    (clean.includes(",") && (clean.includes("and") || clean.includes("&")))
  ) {
    const sanitized = clean
      .replace(/^(?:buy|get|todo|tasks|groceries|shopping list):?\s*/i, "")
      .replace(/\band\b/gi, ",");
    const rawItems = sanitized
      .split(/[,;\n]/)
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    if (rawItems.length >= 2) {
      return {
        type: "todo",
        todo: {
          items: rawItems.map(
            (item) => item.charAt(0).toUpperCase() + item.slice(1),
          ),
        },
      };
    }
  }

  if (
    /\b(?:dinner|lunch|breakfast|coffee|meeting|sync|call|party|interview|session)\b/i.test(
      lower,
    ) ||
    /\b(?:today|tomorrow|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(
      lower,
    )
  ) {
    const withMatch = clean.match(/\bwith\s+([A-Za-z]+)/i);
    const timeMatch = clean.match(
      /\b(?:at\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm)?|\d{1,2}\s*(?:am|pm)|noon|midnight)\b/i,
    );
    const dayMatch = clean.match(
      /\b(today|tomorrow|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
    );
    const timeStr = [
      dayMatch
        ? dayMatch[1].charAt(0).toUpperCase() + dayMatch[1].slice(1)
        : "Upcoming",
      timeMatch ? timeMatch[1].toUpperCase() : "8:00 PM",
    ].join(", ");

    return {
      type: "event",
      event: {
        title: clean.charAt(0).toUpperCase() + clean.slice(1),
        time: timeStr,
        attendee: withMatch
          ? withMatch[1].charAt(0).toUpperCase() + withMatch[1].slice(1)
          : "Team",
      },
    };
  }

  return { type: "search" };
}

function formatTimer(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function MorphSearch({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onSubmit,
  onClear,
  placeholder,
  className,
  autoFocus = false,
}: MorphSearchProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const query = isControlled ? controlledValue : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [savedItems, setSavedItems] = useState<SavedEntry[]>([]);

  const [pollVotes, setPollVotes] = useState<Record<number, number>>({});
  const [completedTodos, setCompletedTodos] = useState<Record<number, boolean>>(
    {},
  );
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerTimeLeft, setTimerTimeLeft] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();
  const inputId = useId();

  const detected = useMemo(() => parseQuery(query), [query]);

  useEffect(() => {
    if (reduceMotion) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [reduceMotion]);

  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setPollVotes({});
    setCompletedTodos({});
    setTimerRunning(false);
    setTimerTimeLeft(
      detected.type === "timer" && detected.timer
        ? detected.timer.seconds
        : null,
    );
  }

  useEffect(() => {
    if (!timerRunning || timerTimeLeft === null || timerTimeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimerTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerTimeLeft]);

  const updateQuery = useCallback(
    (newVal: string) => {
      if (!isControlled) {
        setInternalValue(newVal);
      }
      onChange?.(newVal);
    },
    [isControlled, onChange],
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    inputRef.current?.blur();
  }, []);

  const handleClear = useCallback(() => {
    updateQuery("");
    onClear?.();
    inputRef.current?.focus();
  }, [updateQuery, onClear]);

  const saveCurrentItem = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    let summary = trimmed;
    if (detected.type === "poll" && detected.poll) {
      summary = detected.poll.title;
    } else if (detected.type === "event" && detected.event) {
      summary = `${detected.event.title} · ${detected.event.time}`;
    } else if (detected.type === "todo" && detected.todo) {
      summary = detected.todo.items.join(", ");
    } else if (detected.type === "timer" && detected.timer) {
      summary = `${detected.timer.label} · ${formatTimer(detected.timer.seconds)}`;
    } else if (detected.type === "split" && detected.split) {
      summary = `₹${detected.split.total} among ${detected.split.people} (₹${detected.split.perPerson}/person)`;
    }

    const newItem: SavedEntry = {
      id: Date.now() + Math.random(),
      intent: detected.type,
      text: trimmed,
      summary,
      timestamp: Date.now(),
    };

    setSavedItems((prev) => [newItem, ...prev.slice(0, 8)]);
    onSubmit?.(trimmed, detected.type);
    updateQuery("");
    setIsOpen(false);
  }, [query, detected, onSubmit, updateQuery]);

  const reopenItem = (item: SavedEntry) => {
    updateQuery(item.text);
    setIsOpen(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const removeItem = (id: number) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (query) {
        handleClear();
      } else {
        handleClose();
      }
    } else if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      saveCurrentItem();
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.getAttribute("contenteditable") === "true";

      if (
        (e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) &&
        !isInput
      ) {
        e.preventDefault();
        handleOpen();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClose]);

  const voteOnPoll = (index: number) => {
    setPollVotes((prev) => ({
      ...prev,
      [index]: (prev[index] || 0) + 1,
    }));
  };

  const toggleTodo = (index: number) => {
    setCompletedTodos((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const sampleChips = [
    { label: "All", id: "all" },
    { label: "Poll", id: "poll", sample: "pizza or burgers for friday?" },
    { label: "Event", id: "event", sample: "dinner with priya friday 8pm" },
    { label: "Todo", id: "todo", sample: "buy milk, eggs, bread and coffee" },
    { label: "Timer", id: "timer", sample: "25 min focus" },
    { label: "Split", id: "split", sample: "split 2400 between 3" },
  ];

  const searchResults = useMemo(() => {
    if (detected.type !== "search" || !query.trim()) return [];
    const pool = [
      {
        title: "Navigation Components",
        category: "Components",
        desc: "Gooey navbar and fluid floating tab selectors",
      },
      {
        title: "Action Controls",
        category: "Inputs",
        desc: "Tactile buttons, liquid toggles, and switches",
      },
      {
        title: "Micro Physics Engines",
        category: "Motion",
        desc: "Spring solvers, collision dynamics, and kinetic easing",
      },
      {
        title: "Theming & Palette Matrix",
        category: "Tokens",
        desc: "Adaptive dark mode palettes and high contrast curves",
      },
    ];
    return pool.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()),
    );
  }, [detected.type, query]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full max-w-140 mx-auto select-none", className)}
    >
      <motion.div
        layout
        transition={reduceMotion ? fadeTween : springMorph}
        style={{ borderRadius: 28 }}
        className={cn(
          "relative overflow-hidden border border-zinc-200/80 bg-white/95 backdrop-blur-2xl dark:border-white/10 dark:bg-[#0d0d12]/95",
          isOpen
            ? "border-zinc-300 shadow-[0_24px_64px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] dark:border-white/20 dark:shadow-[0_24px_64px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06)]"
            : "hover:border-zinc-300 shadow-[0_8px_32px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.02)] dark:hover:border-white/15 dark:shadow-[0_8px_32px_rgba(0,0,0,0.36),0_1px_1px_rgba(255,255,255,0.04)]",
        )}
      >
        <motion.div
          layout="position"
          transition={reduceMotion ? fadeTween : springMorph}
          className="relative flex h-14.5 items-center px-6 gap-3"
        >
          <div className="relative flex-1 flex items-center h-full min-w-0">
            <input
              id={inputId}
              ref={inputRef}
              autoFocus={autoFocus}
              autoComplete="off"
              spellCheck={false}
              value={query}
              onFocus={handleOpen}
              onChange={(e) => updateQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-[17px] font-normal tracking-[-0.01em] text-zinc-900 caret-zinc-900 dark:text-white dark:caret-white outline-none placeholder:text-transparent"
              aria-label="Search or enter prompt"
            />

            {!query && (
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={placeholderIndex}
                    initial={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 8, filter: "blur(4px)" }
                    }
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -8, filter: "blur(4px)" }
                    }
                    transition={fadeTween}
                    className="truncate text-[17px] font-normal tracking-[-0.01em] text-zinc-400 dark:text-zinc-400"
                  >
                    {placeholder ?? PLACEHOLDERS[placeholderIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                aria-label="Clear input"
              >
                Clear
              </button>
            )}

            {!isOpen ? (
              <button
                type="button"
                onClick={handleOpen}
                className="flex items-center rounded-full border border-zinc-200 bg-zinc-100/80 px-2 py-0.5 text-[11px] font-mono text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white dark:hover:border-white/20 transition-colors cursor-pointer"
              >
                <span>/</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="flex items-center rounded-full border border-zinc-200 bg-zinc-100/80 px-2 py-0.5 text-[11px] font-mono text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white dark:hover:border-white/20 transition-colors cursor-pointer"
              >
                <span>ESC</span>
              </button>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="popLayout" initial={false}>
          {isOpen && (
            <motion.div
              key="content-body"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, filter: "blur(4px)" }
              }
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{
                opacity: 0,
                filter: "blur(4px)",
                transition: { duration: 0.12, ease: [0.23, 1, 0.32, 1] },
              }}
              transition={
                reduceMotion ? fadeTween : { ...springMorph, delay: 0.02 }
              }
              className="w-full overflow-hidden border-t border-zinc-200/80 dark:border-white/8"
            >
              <div className="p-5 flex flex-col gap-4">
                {detected.type === "poll" && detected.poll && (
                  <div className="flex flex-col gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-4 dark:border-white/8 dark:bg-white/2">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        Poll
                      </span>
                      <span>Select an option to vote</span>
                    </div>

                    <h3 className="text-[15px] font-medium text-zinc-900 dark:text-white">
                      {detected.poll.title}
                    </h3>

                    <div className="flex flex-col gap-2">
                      {detected.poll.options.map((opt, idx) => {
                        const totalVotes = Object.values(pollVotes).reduce(
                          (a, b) => a + b,
                          0,
                        );
                        const votes = pollVotes[idx] || 0;
                        const pct =
                          totalVotes > 0
                            ? Math.round((votes / totalVotes) * 100)
                            : 0;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => voteOnPoll(idx)}
                            className="group relative flex items-center justify-between overflow-hidden rounded-lg border border-zinc-200/80 bg-zinc-100/60 px-3.5 py-2.5 text-left text-xs transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/8 dark:bg-white/4 dark:hover:border-white/15 dark:hover:bg-white/7 cursor-pointer"
                          >
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-zinc-900/10 dark:bg-white/10"
                              initial={{ width: "0%" }}
                              animate={{ width: `${pct}%` }}
                              transition={springMorph}
                            />
                            <span className="relative z-10 font-medium text-zinc-800 group-hover:text-zinc-950 dark:text-zinc-200 dark:group-hover:text-white">
                              {opt}
                            </span>
                            <span className="relative z-10 font-mono text-zinc-500 dark:text-zinc-400 tabular-nums">
                              {pct}%
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {Object.values(pollVotes).reduce((a, b) => a + b, 0)}{" "}
                        total votes
                      </span>
                      <button
                        type="button"
                        onClick={saveCurrentItem}
                        className="flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
                      >
                        <span>Save Poll</span>
                      </button>
                    </div>
                  </div>
                )}

                {detected.type === "event" && detected.event && (
                  <div className="flex flex-col gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-4 dark:border-white/8 dark:bg-white/2">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        Event
                      </span>
                      <span>Scheduled Meeting</span>
                    </div>

                    <h3 className="text-[15px] font-medium text-zinc-900 dark:text-white">
                      {detected.event.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 dark:border-white/8 dark:bg-white/4 dark:text-zinc-300">
                        <span>{detected.event.time}</span>
                      </div>
                      <div className="rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 dark:border-white/8 dark:bg-white/4 dark:text-zinc-300">
                        <span>{detected.event.attendee}</span>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={saveCurrentItem}
                        className="flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
                      >
                        <span>Save Event</span>
                      </button>
                    </div>
                  </div>
                )}

                {detected.type === "todo" && detected.todo && (
                  <div className="flex flex-col gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-4 dark:border-white/8 dark:bg-white/2">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        Checklist
                      </span>
                      <span>
                        {Object.values(completedTodos).filter(Boolean).length}/
                        {detected.todo.items.length} completed
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {detected.todo.items.map((item, idx) => {
                        const done = Boolean(completedTodos[idx]);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleTodo(idx)}
                            className="flex items-center gap-2.5 rounded-lg border border-zinc-200/60 bg-zinc-100/40 px-3 py-2 text-left text-xs transition-colors hover:bg-zinc-100/80 dark:border-white/6 dark:bg-white/3 dark:hover:bg-white/6 cursor-pointer"
                          >
                            <span
                              className={cn(
                                "flex size-3.5 shrink-0 rounded-sm border transition-colors",
                                done
                                  ? "border-zinc-900 bg-zinc-900 dark:border-white dark:bg-white"
                                  : "border-zinc-300 dark:border-white/30",
                              )}
                            />
                            <span
                              className={cn(
                                "font-normal transition-all",
                                done
                                  ? "text-zinc-400 line-through dark:text-zinc-500"
                                  : "text-zinc-800 dark:text-zinc-200",
                              )}
                            >
                              {item}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={saveCurrentItem}
                        className="flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
                      >
                        <span>Save Tasks</span>
                      </button>
                    </div>
                  </div>
                )}

                {detected.type === "timer" && detected.timer && (
                  <div className="flex flex-col gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-4 dark:border-white/8 dark:bg-white/2">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        Timer
                      </span>
                      <span>{detected.timer.label}</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="font-mono text-3xl font-medium tracking-tight text-zinc-900 dark:text-white">
                        {formatTimer(timerTimeLeft ?? detected.timer.seconds)}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setTimerRunning((p) => !p)}
                          className="flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
                        >
                          {timerRunning ? "Pause" : "Start"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTimerRunning(false);
                            setTimerTimeLeft(detected.timer?.seconds ?? 1500);
                          }}
                          className="flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs text-zinc-600 hover:text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={saveCurrentItem}
                          className="flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs text-zinc-700 hover:text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {detected.type === "split" && detected.split && (
                  <div className="flex flex-col gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-4 dark:border-white/8 dark:bg-white/2">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        Split Bill
                      </span>
                      <span>
                        {detected.split.total} among {detected.split.people}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between py-1">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        Each pays
                      </span>
                      <span className="font-mono text-2xl font-semibold text-zinc-900 dark:text-white">
                        ₹{detected.split.perPerson}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {(() => {
                        const splitData = detected.split;
                        return Array.from({
                          length: Math.min(6, splitData.people),
                        }).map((_, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center justify-center rounded-lg border border-zinc-200/60 bg-zinc-100/40 py-2 text-center dark:border-white/6 dark:bg-white/3"
                          >
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-500">
                              Person {i + 1}
                            </span>
                            <span className="font-mono text-xs font-medium text-zinc-800 dark:text-zinc-200">
                              {splitData.perPerson}
                            </span>
                          </div>
                        ));
                      })()}
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={saveCurrentItem}
                        className="flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
                      >
                        <span>Save Split</span>
                      </button>
                    </div>
                  </div>
                )}

                {detected.type === "search" && query.trim() && (
                  <div className="flex flex-col gap-1.5">
                    <div className="px-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Search Results
                    </div>
                    {searchResults.length > 0 ? (
                      searchResults.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            updateQuery(item.title);
                            saveCurrentItem();
                          }}
                          className="group flex items-center justify-between rounded-lg border border-transparent px-3 py-2 text-left text-xs transition-colors hover:border-zinc-200 hover:bg-zinc-100/70 dark:hover:border-white/8 dark:hover:bg-white/5 cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-zinc-800 group-hover:text-zinc-950 dark:text-zinc-200 dark:group-hover:text-white">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-zinc-500 dark:text-zinc-500">
                              {item.desc}
                            </span>
                          </div>
                          <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 dark:border-white/8 dark:bg-white/4 dark:text-zinc-400">
                            {item.category}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="py-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
                        No matches found for &quot;{query}&quot;
                      </div>
                    )}
                  </div>
                )}

                {!query.trim() && (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {sampleChips.map((chip) => {
                        const isSelected = activeCategory === chip.id;
                        return (
                          <button
                            key={chip.id}
                            type="button"
                            onClick={() => {
                              setActiveCategory(chip.id);
                              if (chip.sample) {
                                updateQuery(chip.sample);
                              }
                            }}
                            className={cn(
                              "flex items-center rounded-full border px-3 py-1 text-xs transition-colors cursor-pointer",
                              isSelected
                                ? "border-zinc-900 bg-zinc-900 text-white dark:border-white/25 dark:bg-white/10 dark:text-white"
                                : "border-zinc-200 bg-zinc-100 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-white/8 dark:bg-white/4 dark:text-zinc-400 dark:hover:border-white/15 dark:hover:text-zinc-200",
                            )}
                          >
                            <span>{chip.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-1 pt-1">
                      <span className="px-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">
                        Suggested Prompts
                      </span>
                      {PLACEHOLDERS.slice(0, 4).map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => updateQuery(p)}
                          className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          <span className="truncate">{p}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence initial={false}>
        {savedItems.length > 0 && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={reduceMotion ? fadeTween : springMorph}
            className="mt-3 flex flex-col gap-1 rounded-[22px] border border-zinc-200/80 bg-white/95 backdrop-blur-2xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#0d0d12]/95 dark:shadow-[0_8px_32px_rgba(0,0,0,0.36)]"
          >
            <AnimatePresence initial={false}>
              {savedItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={reduceMotion ? fadeTween : springMorph}
                  className="group relative flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-zinc-100/70 dark:hover:bg-white/5 cursor-pointer"
                  onClick={() => reopenItem(item)}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-3">
                    <span className="shrink-0 rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
                      {item.intent}
                    </span>
                    <span className="truncate text-[14px] text-zinc-800 group-hover:text-zinc-950 dark:text-zinc-200 dark:group-hover:text-white">
                      {item.summary}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="shrink-0 rounded px-1.5 py-0.5 text-xs text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
