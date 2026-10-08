"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

export type Side = "left" | "right";
export type SectionKind = "title" | "subtitle" | "section" | "body";
export type SectionLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type ProximitySection = {
  id: string;
  label: string;
  kind?: SectionKind;
  level?: SectionLevel;
};

type DashPreset = {
  base: number;
  bump: number;
  thickness: number;
  className: string;
};

type DashProps = {
  active: boolean;
  color?: string;
  maxDashWidth: number;
  mouseY: MotionValue<number>;
  onSelect: (id: string) => void;
  radius: number;
  registerDash: (id: string, node: HTMLButtonElement | null) => void;
  section: ProximitySection;
  sectionKind: SectionKind;
  side: Side;
};

export type ProximitySidebarProps = {
  activeOffset?: number;
  className?: string;
  color?: string;
  defaultValue?: string;
  maxDashWidth?: number;
  onChange?: (id: string) => void;
  radius?: number;
  sections: ProximitySection[];
  side?: Side;
  value?: string;
};

const DEFAULT_RADIUS = 32;
const DEFAULT_MAX_DASH_WIDTH = 90;
const SCROLL_IDLE_RESET_DELAY = 80;

const DASH_PRESETS: Record<SectionKind, DashPreset> = {
  title: {
    base: 54,
    bump: 36,
    thickness: 1.5,
    className: "bg-zinc-900 dark:bg-white",
  },
  subtitle: {
    base: 40,
    bump: 42,
    thickness: 1.25,
    className: "bg-zinc-700 dark:bg-zinc-300",
  },
  section: {
    base: 26,
    bump: 48,
    thickness: 1,
    className: "bg-zinc-400 dark:bg-zinc-600",
  },
  body: {
    base: 22,
    bump: 48,
    thickness: 1,
    className: "bg-zinc-400 dark:bg-zinc-600",
  },
};

const getSectionElement = (id: string) =>
  typeof document === "undefined" ? null : document.getElementById(id);

const getSectionKind = (section: ProximitySection): SectionKind => {
  if (section.kind) return section.kind;
  if (section.level === 1) return "title";
  if (section.level === 2) return "subtitle";
  if (section.level === 3) return "section";
  return "body";
};

const getScrollParent = (element: HTMLElement): EventTarget => {
  let parent = element.parentElement;

  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);
    if (/(auto|scroll|overlay)/.test(overflowY)) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return window;
};

const Dash = ({
  active,
  color,
  maxDashWidth,
  mouseY,
  onSelect,
  radius,
  registerDash,
  section,
  sectionKind,
  side,
}: DashProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const centerCoord = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const preset = DASH_PRESETS[sectionKind];

  useEffect(() => {
    registerDash(section.id, ref.current);
    return () => registerDash(section.id, null);
  }, [registerDash, section.id]);

  useEffect(() => {
    const invalidate = () => {
      centerCoord.current = null;
    };

    window.addEventListener("resize", invalidate, { passive: true });
    window.addEventListener("scroll", invalidate, { passive: true });

    return () => {
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("scroll", invalidate);
    };
  }, []);

  const targetScaleX = useTransform(mouseY, (y) => {
    if (!ref.current || y === Infinity) {
      return preset.base / maxDashWidth;
    }

    if (centerCoord.current === null) {
      const rect = ref.current.getBoundingClientRect();
      centerCoord.current = rect.top + rect.height / 2;
    }

    const dist = Math.abs(y - centerCoord.current);
    if (dist >= radius) {
      return preset.base / maxDashWidth;
    }

    const factor = Math.cos((dist / radius) * (Math.PI / 2));
    const width = preset.base + preset.bump * factor;
    return Math.min(1, width / maxDashWidth);
  });

  const springScaleX = useSpring(targetScaleX, {
    stiffness: 350,
    damping: 32,
    mass: 0.6,
  });

  const scaleX = shouldReduceMotion ? targetScaleX : springScaleX;

  return (
    <button
      ref={ref}
      type="button"
      data-slot="proximity-dash"
      data-active={active}
      aria-current={active ? "location" : undefined}
      aria-label={`Go to ${section.label}`}
      title={section.label}
      className={cn(
        "group relative flex h-1.5 pointer-coarse:h-6 items-center border-0 bg-transparent p-0 outline-none select-none cursor-pointer",
        side === "right" ? "justify-end" : "justify-start",
      )}
      style={{ width: maxDashWidth }}
      onClick={() => onSelect(section.id)}
    >
      <motion.span
        className={cn(
          "block rounded-full transition-colors duration-200 group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-black will-change-transform",
          active
            ? color
              ? ""
              : "bg-zinc-950 dark:bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:shadow-[0_0_8px_rgba(255,255,255,0.7)]"
            : cn(
                preset.className,
                "group-hover:bg-zinc-950 dark:group-hover:bg-zinc-200",
              ),
        )}
        style={{
          backgroundColor: active && color ? color : undefined,
          boxShadow: active && color ? `0 0 10px ${color}80` : undefined,
          height: preset.thickness,
          scaleX,
          transformOrigin: side === "left" ? "left center" : "right center",
          width: maxDashWidth,
        }}
      />
    </button>
  );
};

export function ProximitySidebar({
  activeOffset = 0.4,
  className,
  color,
  defaultValue,
  maxDashWidth = DEFAULT_MAX_DASH_WIDTH,
  onChange,
  radius = DEFAULT_RADIUS,
  sections,
  side = "left",
  value,
}: ProximitySidebarProps) {
  const mouseY = useMotionValue(Infinity);
  const shouldReduceMotion = useReducedMotion();
  const dashRefs = useRef(new Map<string, HTMLButtonElement>());
  const pointerInside = useRef(false);
  const resetTimer = useRef<number | null>(null);

  const [internalActiveId, setInternalActiveId] = useState<string>(
    defaultValue ?? sections[0]?.id ?? "",
  );

  const activeId = value !== undefined ? value : internalActiveId;

  const sectionKinds = useMemo(() => {
    return sections.reduce<Record<string, SectionKind>>(
      (nextKinds, section) => {
        nextKinds[section.id] = getSectionKind(section);
        return nextKinds;
      },
      {},
    );
  }, [sections]);

  const registerDash = useCallback(
    (id: string, node: HTMLButtonElement | null) => {
      if (node) {
        dashRefs.current.set(id, node);
      } else {
        dashRefs.current.delete(id);
      }
    },
    [],
  );

  const clearPendingReset = useCallback(() => {
    if (!resetTimer.current) return;
    window.clearTimeout(resetTimer.current);
    resetTimer.current = null;
  }, []);

  const setMouseToDash = useCallback(
    (id?: string) => {
      if (!id) {
        mouseY.set(Infinity);
        return;
      }

      const node = dashRefs.current.get(id);
      if (!node) return;

      const rect = node.getBoundingClientRect();
      mouseY.set(rect.top + rect.height / 2);
    },
    [mouseY],
  );

  const pulseDash = useCallback(
    (id?: string) => {
      setMouseToDash(id);
      clearPendingReset();

      if (!id || pointerInside.current) return;

      resetTimer.current = window.setTimeout(() => {
        mouseY.set(Infinity);
        resetTimer.current = null;
      }, SCROLL_IDLE_RESET_DELAY);
    },
    [clearPendingReset, mouseY, setMouseToDash],
  );

  const selectSection = useCallback(
    (id: string) => {
      const element = getSectionElement(id);
      if (element) {
        element.scrollIntoView({
          behavior: shouldReduceMotion ? "auto" : "smooth",
          block: "start",
        });
        window.history.replaceState(null, "", `#${id}`);
      }

      if (value === undefined) {
        setInternalActiveId(id);
      }
      onChange?.(id);
      pulseDash(id);
    },
    [onChange, pulseDash, shouldReduceMotion, value],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const focusedId = sections.find(
        (s) => dashRefs.current.get(s.id) === event.target,
      )?.id;
      const currentIndex = sections.findIndex(
        (s) => s.id === (focusedId ?? activeId),
      );
      if (currentIndex === -1) return;

      event.preventDefault();
      const nextIndex =
        event.key === "ArrowDown"
          ? Math.min(sections.length - 1, currentIndex + 1)
          : Math.max(0, currentIndex - 1);
      const nextId = sections[nextIndex].id;
      selectSection(nextId);
      dashRefs.current.get(nextId)?.focus();
    },
    [activeId, sections, selectSection],
  );

  useEffect(() => () => clearPendingReset(), [clearPendingReset]);

  useEffect(() => {
    if (!sections.length) return;

    let frame = 0;

    const scrollParents = new Set<EventTarget>([window]);

    for (const section of sections) {
      const element = getSectionElement(section.id);
      if (element) {
        scrollParents.add(getScrollParent(element));
      }
    }

    const updateActiveSection = () => {
      frame = 0;

      let primaryScrollElement: HTMLElement | null = null;
      for (const parent of scrollParents) {
        if (
          parent instanceof HTMLElement &&
          parent !== document.body &&
          parent !== document.documentElement
        ) {
          primaryScrollElement = parent;
          break;
        }
      }

      if (primaryScrollElement) {
        if (primaryScrollElement.scrollTop <= 15) {
          const firstId = sections[0]?.id;
          if (firstId) {
            if (value === undefined) setInternalActiveId(firstId);
            if (!pointerInside.current) pulseDash(firstId);
          }
          return;
        }

        if (
          primaryScrollElement.scrollTop + primaryScrollElement.clientHeight >=
          primaryScrollElement.scrollHeight - 15
        ) {
          const lastId = sections[sections.length - 1]?.id;
          if (lastId) {
            if (value === undefined) setInternalActiveId(lastId);
            if (!pointerInside.current) pulseDash(lastId);
          }
          return;
        }
      } else if (typeof window !== "undefined") {
        if (window.scrollY <= 15) {
          const firstId = sections[0]?.id;
          if (firstId) {
            if (value === undefined) setInternalActiveId(firstId);
            if (!pointerInside.current) pulseDash(firstId);
          }
          return;
        }

        if (
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 15
        ) {
          const lastId = sections[sections.length - 1]?.id;
          if (lastId) {
            if (value === undefined) setInternalActiveId(lastId);
            if (!pointerInside.current) pulseDash(lastId);
          }
          return;
        }
      }

      const anchorY = primaryScrollElement
        ? primaryScrollElement.getBoundingClientRect().top + 50
        : 60;

      let nextActiveId = sections[0]?.id;

      for (const section of sections) {
        const element = getSectionElement(section.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top <= anchorY) {
          nextActiveId = section.id;
        }
      }

      if (nextActiveId) {
        if (value === undefined) {
          setInternalActiveId(nextActiveId);
        }
        if (!pointerInside.current) {
          pulseDash(nextActiveId);
        }
      }
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();

    for (const parent of scrollParents) {
      parent.addEventListener("scroll", scheduleUpdate, { passive: true });
    }

    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);

      for (const parent of scrollParents) {
        parent.removeEventListener("scroll", scheduleUpdate);
      }

      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [activeOffset, pulseDash, sections, value]);

  return (
    <nav
      data-slot="proximity-sidebar"
      aria-label="Page sections"
      className={cn(
        "flex select-none",
        side === "left" ? "justify-start" : "justify-end",
        className,
      )}
    >
      <div
        role="group"
        tabIndex={0}
        aria-label="Proximity navigation"
        onKeyDown={handleKeyDown}
        className={cn(
          "flex flex-col outline-none gap-1 pointer-coarse:gap-0 py-0",
          side === "right" ? "items-end" : "items-start",
        )}
        onPointerEnter={(event) => {
          clearPendingReset();
          pointerInside.current = true;
          mouseY.set(event.clientY);
        }}
        onPointerMove={(event) => {
          clearPendingReset();
          pointerInside.current = true;
          mouseY.set(event.clientY);
        }}
        onPointerLeave={() => {
          pointerInside.current = false;
          mouseY.set(Infinity);
        }}
      >
        {sections.map((section) => (
          <Dash
            key={section.id}
            active={section.id === activeId}
            color={color}
            maxDashWidth={maxDashWidth}
            mouseY={mouseY}
            onSelect={selectSection}
            radius={radius}
            registerDash={registerDash}
            section={section}
            sectionKind={sectionKinds[section.id] ?? getSectionKind(section)}
            side={side}
          />
        ))}
      </div>
    </nav>
  );
}

export default ProximitySidebar;
