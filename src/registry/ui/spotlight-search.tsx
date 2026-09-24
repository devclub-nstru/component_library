"use client";

import React, {
  useId,
  useRef,
  useState,
  useMemo,
} from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

export type SpotlightFilterId = "apps" | "folders" | "layers" | "docs";

export interface SpotlightItem {
  id: string;
  title: string;
  category: SpotlightFilterId;
  subtitle?: string;
  shortcut?: string;
}

export interface SpotlightSearchProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string, activeFilter: SpotlightFilterId | null) => void;
  activeFilter?: SpotlightFilterId | null;
  onFilterChange?: (filter: SpotlightFilterId | null) => void;
  placeholder?: string;
  items?: SpotlightItem[];
  showResults?: boolean;
  className?: string;
  disabled?: boolean;
}

const DEFAULT_ITEMS: SpotlightItem[] = [
  { id: "1", title: "Xcode", category: "apps", subtitle: "Developer Tools" },
  { id: "2", title: "Safari", category: "apps", subtitle: "Web Browser" },
  { id: "3", title: "Figma", category: "apps", subtitle: "Vector Graphics" },
  { id: "4", title: "Terminal", category: "apps", subtitle: "Utilities" },
  { id: "5", title: "Music", category: "apps", subtitle: "Entertainment" },
  {
    id: "6",
    title: "Projects",
    category: "folders",
    subtitle: "~/Developer/Projects",
  },
  { id: "7", title: "Documents", category: "folders", subtitle: "~/Documents" },
  { id: "8", title: "Downloads", category: "folders", subtitle: "~/Downloads" },
  {
    id: "9",
    title: "Quick Note",
    category: "layers",
    subtitle: "Shortcut",
    shortcut: "⌘⇧N",
  },
  {
    id: "10",
    title: "Color Picker",
    category: "layers",
    subtitle: "Utility",
    shortcut: "⌥⌘C",
  },
  {
    id: "11",
    title: "design-system.fig",
    category: "docs",
    subtitle: "Figma Document",
  },
  {
    id: "12",
    title: "roadmap-2026.pdf",
    category: "docs",
    subtitle: "PDF Document",
  },
  {
    id: "13",
    title: "architecture.md",
    category: "docs",
    subtitle: "Markdown File",
  },
];

const fluidSpring: Transition = {
  type: "spring",
  stiffness: 170,
  damping: 24,
  mass: 1.0,
};

const microSpring: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 26,
  mass: 0.8,
};

function AppsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3.5L4.5 19h4" />
      <path d="M12 3.5l7.5 15.5h-4" />
      <path d="M7 14.5h10" />
      <circle cx="12" cy="7" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h3.2c.6 0 1.2.3 1.6.8l1.2 1.4c.4.5 1 .8 1.6.8H18.5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-10z" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3L3 8l9 5 9-5-9-5z" />
      <path d="M3 13l9 5 9-5" />
      <path d="M3 18l9 5 9-5" />
    </svg>
  );
}

function DocsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v12" />
      <rect x="8" y="6" width="12" height="16" rx="2" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7.5" />
      <path d="m20.5 20.5-4.2-4.2" />
    </svg>
  );
}

const FILTER_BUTTONS = [
  { id: "apps" as const, label: "Applications", icon: AppsIcon },
  { id: "folders" as const, label: "Folders", icon: FolderIcon },
  { id: "layers" as const, label: "Workspaces", icon: LayersIcon },
  { id: "docs" as const, label: "Documents", icon: DocsIcon },
];

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onSubmit,
  activeFilter: controlledFilter,
  onFilterChange,
  placeholder = "Spotlight Search",
  items = DEFAULT_ITEMS,
  showResults = true,
  className,
  disabled = false,
}) => {
  const generatedId = useId();
  const filterId = `spotlight-gooey-${generatedId.replace(/:/g, "")}`;
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hoveredButtonId, setHoveredButtonId] = useState<string | null>(null);

  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const query = isControlled ? controlledValue : uncontrolledValue;

  const isControlledFilter = controlledFilter !== undefined;
  const [uncontrolledFilter, setUncontrolledFilter] =
    useState<SpotlightFilterId | null>(null);
  const currentFilter = isControlledFilter
    ? controlledFilter
    : uncontrolledFilter;

  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const isExpanded = isHovered || isFocused || query.length > 0;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesFilter = !currentFilter || item.category === currentFilter;
      const clean = query.trim().toLowerCase();
      if (!clean) return matchesFilter;
      const matchesQuery =
        item.title.toLowerCase().includes(clean) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(clean));
      return matchesFilter && matchesQuery;
    });
  }, [items, currentFilter, query]);

  const safeHighlightedIndex =
    filteredItems.length > 0
      ? Math.min(Math.max(0, highlightedIndex), filteredItems.length - 1)
      : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isControlled) {
      setUncontrolledValue(val);
    }
    setHighlightedIndex(0);
    onChange?.(val);
  };

  const handleFilterToggle = (filterIdSelected: SpotlightFilterId) => {
    const nextFilter = currentFilter === filterIdSelected ? null : filterIdSelected;
    if (!isControlledFilter) {
      setUncontrolledFilter(nextFilter);
    }
    setHighlightedIndex(0);
    onFilterChange?.(nextFilter);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      if (query) {
        if (!isControlled) setUncontrolledValue("");
        onChange?.("");
      } else {
        inputRef.current?.blur();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        filteredItems.length ? (prev + 1) % filteredItems.length : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        filteredItems.length
          ? (prev - 1 + filteredItems.length) % filteredItems.length
          : 0,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredItems[safeHighlightedIndex];
      if (selected) {
        onSubmit?.(selected.title, currentFilter);
      } else {
        onSubmit?.(query, currentFilter);
      }
    }
  };

  const dynamicPlaceholder = useMemo(() => {
    if (!currentFilter) return placeholder;
    switch (currentFilter) {
      case "apps":
        return "Search Applications...";
      case "folders":
        return "Search Folders...";
      case "layers":
        return "Search Workspaces...";
      case "docs":
        return "Search Documents...";
      default:
        return placeholder;
    }
  }, [currentFilter, placeholder]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredButtonId(null);
      }}
      className={cn(
        "relative flex flex-col items-center select-none",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
      style={{ width: 480 }}
    >
      <svg
        width="0"
        height="0"
        className="pointer-events-none absolute -z-10 opacity-0 overflow-hidden"
        aria-hidden="true"
      >
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
            />
          </filter>
        </defs>
      </svg>

      <div className="relative w-full h-12 overflow-visible">
        <div
          className="pointer-events-none absolute inset-0 overflow-visible"
          style={{ filter: `url(#${filterId})` }}
        >
          <motion.div
            initial={false}
            animate={{
              width: isExpanded ? 248 : 480,
            }}
            transition={fluidSpring}
            className="absolute left-0 top-0 h-12 rounded-full bg-[#1c1c1f]"
          />

          {FILTER_BUTTONS.map((btn, idx) => (
            <motion.div
              key={`gooey-blob-${btn.id}`}
              initial={false}
              animate={{
                x: isExpanded ? 258 + idx * 58 : 248,
                scale: isExpanded ? 1 : 0.3,
                opacity: isExpanded ? 1 : 0,
              }}
              transition={{
                ...fluidSpring,
                delay: isExpanded
                  ? idx * 0.035
                  : (FILTER_BUTTONS.length - 1 - idx) * 0.025,
              }}
              className="absolute left-0 top-0 w-12 h-12 rounded-full bg-[#1c1c1f]"
            />
          ))}
        </div>

        <motion.div
          initial={false}
          animate={{
            width: isExpanded ? 248 : 480,
          }}
          transition={fluidSpring}
          onClick={() => inputRef.current?.focus()}
          className={cn(
            "absolute left-0 top-0 h-12 flex items-center px-4 rounded-full border transition-colors cursor-text select-none",
            "bg-[#1c1c1f]/85 backdrop-blur-2xl border-white/12",
            "shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_1.5px_rgba(255,255,255,0.12)]",
            isFocused && "border-white/30 ring-1 ring-white/20",
          )}
        >
          <span className="shrink-0 text-zinc-400 mr-2.5 flex items-center justify-center">
            <SearchIcon />
          </span>

          <div className="relative flex-1 flex items-center h-full overflow-hidden">
            {!query && (
              <span className="w-[1.5px] h-4.5 bg-white/70 animate-pulse mr-1 inline-block shrink-0 rounded-full" />
            )}
            <input
              id={inputId}
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={dynamicPlaceholder}
              autoComplete="off"
              spellCheck="false"
              className="w-full bg-transparent text-[15px] font-normal text-zinc-100 placeholder:text-zinc-400 outline-none caret-white"
            />
          </div>

          {currentFilter && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleFilterToggle(currentFilter);
              }}
              className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors"
            >
              {currentFilter}
            </motion.button>
          )}
        </motion.div>

        {FILTER_BUTTONS.map((btn, idx) => {
          const IconComponent = btn.icon;
          const isActive = currentFilter === btn.id;
          const isHoveredBtn = hoveredButtonId === btn.id;
          const targetX = 258 + idx * 58;

          return (
            <motion.div
              key={btn.id}
              initial={false}
              animate={{
                x: isExpanded ? targetX : 248,
                scale: isExpanded ? 1 : 0.3,
                opacity: isExpanded ? 1 : 0,
                pointerEvents: isExpanded ? "auto" : "none",
              }}
              transition={{
                ...fluidSpring,
                delay: isExpanded
                  ? idx * 0.035
                  : (FILTER_BUTTONS.length - 1 - idx) * 0.025,
                opacity: {
                  duration: 0.22,
                  delay: isExpanded ? 0.05 + idx * 0.035 : 0,
                },
              }}
              className="absolute left-0 top-0 w-12 h-12"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={microSpring}
                onMouseEnter={() => setHoveredButtonId(btn.id)}
                onMouseLeave={() => setHoveredButtonId(null)}
                onClick={() => handleFilterToggle(btn.id)}
                className={cn(
                  "w-full h-full rounded-full flex items-center justify-center cursor-pointer outline-none transition-colors",
                  "bg-[#1c1c1f]/85 backdrop-blur-2xl border",
                  "shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_1.5px_rgba(255,255,255,0.12)]",
                  isActive
                    ? "border-white/40 bg-white/20 text-white shadow-[0_0_16px_rgba(255,255,255,0.2)]"
                    : "border-white/12 text-zinc-400 hover:text-white hover:border-white/25",
                )}
                aria-label={btn.label}
                title={btn.label}
              >
                <IconComponent />
              </motion.button>

              <AnimatePresence>
                {isHoveredBtn && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.9 }}
                    transition={microSpring}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/90 border border-white/10 text-[10px] text-zinc-200 font-medium whitespace-nowrap pointer-events-none z-50 shadow-lg"
                  >
                    {btn.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showResults &&
          isFocused &&
          (query.trim().length > 0 || currentFilter) && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 10, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={fluidSpring}
              className={cn(
                "absolute top-full inset-x-0 z-40 rounded-2xl border border-white/12 bg-[#141416]/95 backdrop-blur-3xl shadow-[0_24px_60px_rgba(0,0,0,0.85)] p-2 overflow-hidden flex flex-col gap-1",
              )}
            >
              {filteredItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-500">
                  No matching results found
                </div>
              ) : (
                <div className="flex flex-col gap-0.5 max-h-64 overflow-y-auto pr-1">
                  {filteredItems.map((item, idx) => {
                    const isHighlighted = idx === safeHighlightedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        onClick={() => onSubmit?.(item.title, currentFilter)}
                        className={cn(
                          "relative flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer w-full select-none",
                          isHighlighted
                            ? "bg-white/10 text-white"
                            : "text-zinc-300 hover:bg-white/5",
                        )}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-zinc-400">
                            {item.category === "apps" && <AppsIcon />}
                            {item.category === "folders" && <FolderIcon />}
                            {item.category === "layers" && <LayersIcon />}
                            {item.category === "docs" && <DocsIcon />}
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-medium truncate text-zinc-100">
                              {item.title}
                            </span>
                            {item.subtitle && (
                              <span className="text-[10px] text-zinc-500 truncate">
                                {item.subtitle}
                              </span>
                            )}
                          </div>
                        </div>

                        {item.shortcut && (
                          <span className="text-[10px] font-mono text-zinc-500 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 shrink-0 ml-2">
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};
