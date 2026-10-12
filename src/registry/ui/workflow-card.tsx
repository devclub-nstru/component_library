"use client";

import { useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { spring, useReducedMotion } from "motion/react";
import { ArrowRight, Check, CircleDashed, CircleDot, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export const WORKFLOW_STATUSES = {
  todo: { label: "To do", color: "#8060bd", Icon: CircleDashed },
  progress: { label: "In progress", color: "#b57a29", Icon: CircleDot },
  review: { label: "In review", color: "#557bc4", Icon: Eye },
  done: { label: "Done", color: "#32966a", Icon: Check },
} as const;

export type WorkflowStatus = keyof typeof WORKFLOW_STATUSES;

export interface WorkflowAssignee {
  id: string;
  name: string;
  color?: string;
}

export interface WorkflowTask {
  id: string;
  label: string;
  done?: boolean;
  assigneeId?: string;
}

export interface WorkflowSection {
  id: string;
  label?: string;
  tasks: WorkflowTask[];
}

export interface WorkflowCardProps {
  title?: string;
  description?: string;
  dueDate?: string;
  sections?: WorkflowSection[];
  defaultSections?: WorkflowSection[];
  onSectionsChange?: (sections: WorkflowSection[]) => void;
  assignees?: WorkflowAssignee[];
  status?: WorkflowStatus;
  defaultStatus?: WorkflowStatus;
  onStatusChange?: (status: WorkflowStatus) => void;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  openOnHover?: boolean;
  closeDelay?: number;
  theme?: "system" | "light" | "dark";
  accent?: string;
  width?: number;
  radius?: number;
  density?: "compact" | "comfortable";
  stiffness?: number;
  damping?: number;
  duration?: number;
  showAssignees?: boolean;
  showDueDate?: boolean;
  showFooter?: boolean;
  showSectionLabels?: boolean;
  className?: string;
  onOpen?: () => void;
}

export const WORKFLOW_ASSIGNEES: WorkflowAssignee[] = [
  { id: "mara", name: "Mara", color: "#91c788" },
  { id: "jonas", name: "Jonas", color: "#a095d7" },
  { id: "priya", name: "Priya", color: "#8ca6dc" },
];

export const WORKFLOW_SECTIONS: WorkflowSection[] = [
  {
    id: "setup",
    label: "Getting started",
    tasks: [
      {
        id: "welcome",
        label: "Welcome screen",
        done: true,
        assigneeId: "mara",
      },
      {
        id: "workspace",
        label: "Workspace setup",
        done: true,
        assigneeId: "jonas",
      },
      {
        id: "invite",
        label: "Invite teammates",
        done: true,
        assigneeId: "mara",
      },
    ],
  },
  {
    id: "follow-through",
    label: "Follow through",
    tasks: [
      { id: "checklist", label: "First-run checklist", assigneeId: "priya" },
      { id: "emails", label: "Lifecycle emails", assigneeId: "jonas" },
    ],
  },
];

const focusClass =
  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--wf-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--wf-surface)]";
const bounded = (value: number, min: number, max: number, fallback: number) =>
  Number.isFinite(value) ? gsap.utils.clamp(min, max, value) : fallback;
const themeTokens = [
  ["surface", "card", "#ffffff", "#222222"],
  ["ink", "foreground", "#252525", "#eeeeee"],
  ["muted", "muted-foreground", "#858583", "#92928f"],
  ["line", "border", "#dededb", "#484845"],
  ["hover", "muted", "#f4f4f2", "#2c2c2a"],
  ["outer", "muted", "#eaeae7", "#1b1b1a"],
] as const;

function WorkflowRow({
  task,
  person,
  dimmed,
  onToggle,
  duration,
  ease,
}: {
  task: WorkflowTask;
  person?: WorkflowAssignee;
  dimmed: boolean;
  onToggle: () => void;
  duration: number;
  ease: (progress: number) => number;
}) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const mounted = useRef(false);
  const [initialDone] = useState(!!task.done);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const time = reduced || !mounted.current ? 0 : duration;
      gsap.to(root, {
        opacity: dimmed ? 0.4 : 1,
        duration: time * 0.5,
        overwrite: "auto",
      });
      gsap.to(root.querySelector("[data-check]"), {
        scale: task.done ? 1 : 0,
        duration: time * 0.65,
        ease,
        overwrite: "auto",
      });
      gsap.to(root.querySelector("[data-tick]"), {
        strokeDashoffset: task.done ? 0 : 1,
        duration: time * 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(root.querySelector("[data-label]"), {
        opacity: task.done ? 0.58 : 1,
        duration: time * 0.55,
        ease: "power2.out",
        overwrite: "auto",
      });
      mounted.current = true;
    },
    { scope: rootRef, dependencies: [task.done, dimmed, duration, ease, reduced] },
  );

  return (
    <button
      ref={rootRef}
      type="button"
      role="checkbox"
      aria-checked={!!task.done}
      aria-label={`${task.label}${person ? `, assigned to ${person.name}` : ""}`}
      onClick={onToggle}
      data-slot="workflow-task"
      data-done={!!task.done}
      className={cn(
        "group/task relative z-10 flex w-full cursor-pointer pointer-coarse:[--wf-touch-height:44px] items-center gap-2.5 rounded-md px-2 text-left",
        focusClass,
      )}
      style={{
        minHeight: "max(var(--wf-row-height), var(--wf-touch-height, 0px))",
      }}
    >
      <span
        className="relative flex size-3.5 shrink-0 items-center justify-center rounded-full border border-[var(--wf-line)]"
        aria-hidden="true"
      >
        <span
          data-check
          className="absolute -inset-px rounded-full bg-[var(--wf-ink)]"
          style={{ transform: `scale(${initialDone ? 1 : 0})` }}
        />
        <svg viewBox="0 0 14 14" className="relative size-3.5 text-[var(--wf-surface)]" fill="none">
          <path
            data-tick
            d="m4 7 2 2 4-4"
            pathLength="1"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1"
            strokeDashoffset={initialDone ? 0 : 1}
          />
        </svg>
      </span>
      <span data-label className="min-w-0 flex-1 py-1.5 text-[12px] leading-[1.4] wrap-anywhere">
        {task.label}
      </span>
      {person && (
        <span
          aria-hidden="true"
          title={person.name}
          data-row-person
          className="flex size-4 shrink-0 items-center justify-center rounded-[4px] text-[9px] font-semibold opacity-0"
          style={{
            background: `color-mix(in srgb, ${person.color ?? "var(--wf-accent)"}, transparent 80%)`,
            color: person.color ?? "var(--wf-accent)",
          }}
        >
          {person.name.slice(0, 1)}
        </span>
      )}
    </button>
  );
}

export function WorkflowCard({
  title = "Onboarding flow",
  description,
  dueDate = "Oct 24",
  sections,
  defaultSections = WORKFLOW_SECTIONS,
  onSectionsChange,
  assignees = WORKFLOW_ASSIGNEES,
  status,
  defaultStatus = "progress",
  onStatusChange,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  openOnHover = true,
  closeDelay = 0.24,
  theme = "system",
  accent = "#32966a",
  width = 320,
  radius = 18,
  density = "comfortable",
  stiffness = 105,
  damping = 24,
  duration = 0.75,
  showAssignees = true,
  showDueDate = true,
  showFooter = true,
  showSectionLabels = true,
  className,
  onOpen,
}: WorkflowCardProps) {
  const [ownSections, setOwnSections] = useState(defaultSections);
  const [ownStatus, setOwnStatus] = useState(defaultStatus);
  const [ownExpanded, setOwnExpanded] = useState(defaultExpanded);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const pickerContentRef = useRef<HTMLFieldSetElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const hoveredRowRef = useRef<HTMLElement | null>(null);
  const pressedRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const statusRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<gsap.core.Tween | null>(null);
  const syncRef = useRef<((immediate?: boolean) => void) | null>(null);
  const id = useId();
  const currentSections = sections ?? ownSections;
  const currentStatus = status ?? ownStatus;
  const isOpen = expanded ?? ownExpanded;
  const tasks = currentSections.flatMap((section) => section.tasks);
  const complete = tasks.filter((task) => task.done).length;
  const segmentCount = Math.max(1, Math.min(tasks.length, 20));
  const filteredPerson = showAssignees
    ? assignees.find((person) => person.id === filter)
    : undefined;
  const visibleTasks = filteredPerson
    ? tasks.filter((task) => task.assigneeId === filteredPerson.id)
    : tasks;
  const visibleComplete = visibleTasks.filter((task) => task.done).length;
  const statusSpec = WORKFLOW_STATUSES[currentStatus];
  const time = bounded(duration, 0.3, 1.2, 0.75);
  const tension = bounded(stiffness, 60, 240, 105);
  const friction = bounded(damping, 14, 36, 24);
  const ease = useMemo(() => {
    const response = spring({
      keyframes: [0, 1],
      stiffness: tension,
      damping: friction,
      mass: 1,
    });
    const settle = Math.max(0.8, 16 / friction);
    const end = response.next(settle * 1000).value;
    return (progress: number) =>
      progress === 1 ? 1 : response.next(progress * settle * 1000).value / end;
  }, [tension, friction]);

  const changeExpanded = (next: boolean) => {
    closeRef.current?.kill();
    if (expanded === undefined) setOwnExpanded(next);
    onExpandedChange?.(next);
    if (!next) setPickerOpen(false);
  };

  const { contextSafe } = useGSAP(
    () => {
      const root = rootRef.current;
      const panel = panelRef.current;
      const content = contentRef.current;
      if (!root || !panel || !content) return;
      const picker = pickerRef.current;
      const pickerContent = pickerContentRef.current;
      if (!picker || !pickerContent) return;
      const media = gsap.matchMedia();
      media.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          animate: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          let reveal: gsap.core.Timeline | null = null;
          const sync = context.add("sync", (immediate = false) => {
            const open = root.dataset.expanded === "true";
            const choosing = open && root.dataset.pickerOpen === "true";
            const instant = immediate || context.conditions?.reduce;
            const pickerHeight = choosing ? pickerContent.offsetHeight : 0;
            reveal?.kill();
            reveal = gsap
              .timeline({
                defaults: {
                  duration: instant ? 0 : time,
                  ease: open ? ease : "power3.out",
                  overwrite: "auto",
                },
              })
              .to(panel, { height: open ? content.offsetHeight + pickerHeight : 0 }, 0)
              .to(picker, { height: pickerHeight }, 0)
              .to(
                pickerContent,
                {
                  opacity: choosing ? 1 : 0,
                  y: choosing ? 0 : -3,
                  duration: instant ? 0 : time * 0.48,
                },
                0,
              )
              .to(
                content,
                {
                  opacity: open ? 1 : 0,
                  duration: instant ? 0 : time * (open ? 0.65 : 0.4),
                  ease: "power2.out",
                },
                0,
              );
          });
          syncRef.current = (immediate) => sync(immediate);
          sync(true);
          const observer = new ResizeObserver(() => sync());
          observer.observe(content);
          observer.observe(pickerContent);
          return () => {
            observer.disconnect();
            reveal?.kill();
            syncRef.current = null;
          };
        },
      );
      return () => {
        closeRef.current?.kill();
        media.revert();
      };
    },
    { scope: rootRef, dependencies: [time, ease], revertOnUpdate: true },
  );

  useGSAP(
    (context) => {
      context.ignore(() => syncRef.current?.());
    },
    { scope: rootRef, dependencies: [isOpen, pickerOpen, time, ease] },
  );

  useGSAP(
    () => {
      gsap.to(rootRef.current?.querySelectorAll("[data-segment]") ?? [], {
        opacity: (index: number) =>
          index < Math.round((visibleComplete / Math.max(1, visibleTasks.length)) * segmentCount)
            ? hovered
              ? 1
              : 0.82
            : hovered
              ? 0.28
              : 0.14,
        duration: reduced ? 0 : time * 0.6,
        stagger: reduced ? 0 : 0.018,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    {
      scope: rootRef,
      dependencies: [visibleComplete, visibleTasks.length, segmentCount, time, hovered, reduced],
    },
  );

  const scheduleClose = () =>
    contextSafe(() => {
      closeRef.current?.kill();
      closeRef.current = gsap.delayedCall(bounded(closeDelay, 0, 1, 0.24), () => {
        if (
          !rootRef.current?.contains(document.activeElement) ||
          !document.activeElement?.matches(":focus-visible")
        )
          changeExpanded(false);
      });
    })();
  const press = contextSafe((target: HTMLElement, down: boolean) => {
    if (reduced) return;
    gsap.to(target, {
      scale: down ? 0.985 : 1,
      duration: down ? 0.12 : time * 0.6,
      ease: down ? "power2.out" : ease,
      overwrite: "auto",
    });
  });
  const highlightRow = (target: HTMLElement | null) =>
    contextSafe(() => {
      const highlight = highlightRef.current;
      const content = contentRef.current;
      if (!highlight || !content || hoveredRowRef.current === target) return;
      const previous = hoveredRowRef.current;
      hoveredRowRef.current = target;
      const previousPerson = previous?.querySelector("[data-row-person]");
      if (previousPerson)
        gsap.to(previousPerson, {
          opacity: 0,
          duration: reduced ? 0 : 0.25,
          overwrite: "auto",
        });
      if (!target) {
        gsap.to(highlight, {
          opacity: 0,
          duration: reduced ? 0 : 0.3,
          overwrite: "auto",
        });
        return;
      }
      const rect = target.getBoundingClientRect();
      const parent = content.getBoundingClientRect();
      if (!previous)
        gsap.set(highlight, {
          x: rect.left - parent.left,
          y: rect.top - parent.top,
          width: rect.width,
          height: rect.height,
        });
      gsap.to(highlight, {
        x: rect.left - parent.left,
        y: rect.top - parent.top,
        width: rect.width,
        height: rect.height,
        opacity: 1,
        duration: reduced ? 0 : 0.38,
        ease: "power3.out",
        overwrite: "auto",
      });
      const person = target.querySelector("[data-row-person]");
      if (person)
        gsap.to(person, {
          opacity: 1,
          duration: reduced ? 0 : 0.3,
          overwrite: "auto",
        });
    })();
  const releasePress = () => {
    if (pressedRef.current) press(pressedRef.current, false);
    pressedRef.current = null;
  };

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      gsap.to(root.querySelectorAll("[data-assignee]"), {
        opacity: (_, target: HTMLElement) =>
          filteredPerson && target.dataset.assignee !== filter ? 0.45 : 1,
        duration: reduced ? 0 : 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(root.querySelectorAll("[data-assignee-ring]"), {
        opacity: (_, target: HTMLElement) =>
          target.parentElement?.dataset.assignee === filteredPerson?.id ? 1 : 0,
        scale: (_, target: HTMLElement) =>
          target.parentElement?.dataset.assignee === filteredPerson?.id ? 1 : 0.86,
        duration: reduced ? 0 : 0.4,
        ease,
        overwrite: "auto",
      });
      gsap.to(root.querySelectorAll("[data-status-ring]"), {
        opacity: (_, target: HTMLElement) => (target.dataset.statusRing === currentStatus ? 1 : 0),
        duration: reduced ? 0 : 0.32,
        overwrite: "auto",
      });
    },
    {
      scope: rootRef,
      dependencies: [filter, filteredPerson?.id, currentStatus, showAssignees, ease, reduced],
    },
  );

  const toggleTask = (sectionId: string, taskId: string) => {
    const next = currentSections.map((section) =>
      section.id !== sectionId
        ? section
        : {
            ...section,
            tasks: section.tasks.map((task) =>
              task.id !== taskId ? task : { ...task, done: !task.done },
            ),
          },
    );
    if (sections === undefined) setOwnSections(next);
    onSectionsChange?.(next);
    const task = next
      .find((section) => section.id === sectionId)
      ?.tasks.find((item) => item.id === taskId);
    setAnnouncement(`${task?.label} ${task?.done ? "completed" : "reopened"}`);
  };
  const footerLabel = filteredPerson
    ? `${filteredPerson.name} · ${visibleComplete} of ${visibleTasks.length} done`
    : tasks.length === 0
      ? "No tasks yet"
      : complete === tasks.length
        ? "All done. Nicely done."
        : `${tasks.length - complete} left to do`;
  const inherited = theme === "system";
  const light = theme !== "dark";
  const curve = bounded(radius, 8, 28, 18);
  const colors = Object.fromEntries(
    themeTokens.map(([name, token, lightColor, darkColor]) => [
      `--wf-${name}`,
      inherited ? `var(--${token}, ${lightColor})` : light ? lightColor : darkColor,
    ]),
  );

  return (
    <article
      ref={rootRef}
      data-slot="workflow-card"
      data-expanded={isOpen}
      data-picker-open={pickerOpen}
      data-theme={theme}
      aria-labelledby={`${id}-title`}
      className={cn("relative isolate w-full max-w-full font-sans", className)}
      style={
        {
          width: bounded(width, 260, 480, 320),
          borderRadius: curve + 3,
          "--wf-accent": accent,
          ...colors,
          "--wf-row-height": density === "compact" ? "28px" : "34px",
          background: "var(--wf-outer)",
          padding: 3,
          color: "var(--wf-ink)",
          boxShadow: light
            ? "0 3px 8px -4px #00000018, inset 0 0 0 1px #00000004"
            : "0 3px 12px -6px #00000080, inset 0 0 0 1px #ffffff04",
        } as CSSProperties
      }
      onPointerEnter={(event) => {
        closeRef.current?.kill();
        if (event.pointerType !== "touch") setHovered(true);
        if (openOnHover && event.pointerType !== "touch") changeExpanded(true);
      }}
      onPointerLeave={() => {
        setHovered(false);
        highlightRow(null);
        releasePress();
        if (openOnHover) scheduleClose();
      }}
      onPointerOver={(event) => {
        const row = (event.target as HTMLElement).closest<HTMLElement>(
          '[data-slot="workflow-task"]',
        );
        if (row) highlightRow(row);
      }}
      onFocusCapture={(event) => {
        closeRef.current?.kill();
        highlightRow(
          (event.target as HTMLElement).closest<HTMLElement>('[data-slot="workflow-task"]'),
        );
        if (event.target.matches(":focus-visible")) setHovered(true);
        if (
          openOnHover &&
          event.target.matches(":focus-visible") &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          changeExpanded(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setHovered(false);
          highlightRow(null);
        }
        if (openOnHover && !event.currentTarget.contains(event.relatedTarget)) scheduleClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.stopPropagation();
        if (pickerOpen) {
          setPickerOpen(false);
          statusRef.current?.focus();
        } else {
          changeExpanded(false);
          triggerRef.current?.focus();
        }
      }}
      onPointerDown={(event) => {
        const target = (event.target as HTMLElement).closest<HTMLElement>("button");
        if (target && target.dataset.slot !== "workflow-task") {
          pressedRef.current = target;
          press(target, true);
        }
      }}
      onPointerUp={releasePress}
      onPointerCancel={releasePress}
      onLostPointerCapture={releasePress}
    >
      <div
        className="relative overflow-hidden bg-[var(--wf-surface)]"
        style={{
          borderRadius: curve,
          boxShadow: light ? "0 1px 3px #00000008" : "0 1px 3px #00000030",
        }}
      >
        <header className="flex items-center gap-2.5 px-3 py-3">
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={isOpen}
            aria-controls={`${id}-panel`}
            aria-label={`${isOpen ? "Collapse" : "Expand"} ${title}`}
            onClick={() => changeExpanded(!isOpen)}
            className={cn(
              "relative flex size-8 shrink-0 cursor-pointer pointer-coarse:size-10 items-center justify-center rounded-full",
              focusClass,
            )}
          >
            <svg
              viewBox="0 0 36 36"
              className="absolute inset-0 size-full -rotate-90"
              aria-hidden="true"
            >
              {Array.from({ length: segmentCount }, (_, index) => {
                const count = segmentCount;
                const circumference = 2 * Math.PI * 14;
                return (
                  <circle
                    key={index}
                    data-segment
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="var(--wf-ink)"
                    strokeWidth="2.7"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.max(1, circumference / count - 3.8)} ${circumference}`}
                    strokeDashoffset={(-index * circumference) / count}
                    style={{ opacity: 0.16 }}
                  />
                );
              })}
            </svg>
            <span aria-hidden="true" className="text-[11px] font-semibold tabular-nums">
              {complete}
            </span>
          </button>
          <div className="min-w-0 flex-1">
            <h3
              id={`${id}-title`}
              className="text-[13px] leading-5 font-semibold tracking-[-0.025em]"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${id}-panel`}
                onClick={() => changeExpanded(!isOpen)}
                className={cn(
                  "block max-w-full cursor-pointer rounded-sm text-left wrap-anywhere",
                  focusClass,
                )}
              >
                {title}
              </button>
            </h3>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] leading-4">
              <button
                ref={statusRef}
                type="button"
                aria-expanded={pickerOpen && isOpen}
                aria-controls={`${id}-status`}
                aria-label={`Change status, currently ${statusSpec.label}`}
                onClick={() => {
                  changeExpanded(true);
                  setPickerOpen(!pickerOpen);
                }}
                className={cn(
                  "flex w-24 shrink-0 cursor-pointer items-center gap-1 rounded px-1.5",
                  focusClass,
                )}
                style={{
                  color: `color-mix(in srgb, ${statusSpec.color}, var(--wf-ink) 18%)`,
                  background: `color-mix(in srgb, ${statusSpec.color}, transparent 86%)`,
                }}
              >
                <statusSpec.Icon size={10} strokeWidth={2} aria-hidden="true" />
                {statusSpec.label}
              </button>
              {showDueDate && dueDate && (
                <span className="text-[var(--wf-muted)]">Due {dueDate}</span>
              )}
            </div>
          </div>
          {showAssignees && assignees.length > 0 && (
            <div className="flex shrink-0 -space-x-1.5" aria-label="Filter by teammate">
              {assignees.slice(0, 5).map((person) => (
                <button
                  key={person.id}
                  data-assignee={person.id}
                  type="button"
                  title={`${filter === person.id ? "Show everyone" : `Filter ${person.name}'s tasks`}`}
                  aria-label={`Filter ${person.name}'s tasks`}
                  aria-pressed={filter === person.id}
                  onClick={() => {
                    changeExpanded(true);
                    setFilter(filter === person.id ? null : person.id);
                  }}
                  className={cn(
                    "relative flex size-6 cursor-pointer pointer-coarse:size-8 items-center justify-center rounded-full border-2 border-[var(--wf-surface)] text-[9px] font-semibold hover:z-10",
                    focusClass,
                  )}
                  style={{
                    background: `color-mix(in srgb, ${person.color ?? accent}, var(--wf-surface) ${light ? 60 : 75}%)`,
                    color: person.color ?? accent,
                    zIndex: filter === person.id ? 10 : undefined,
                  }}
                >
                  <span
                    data-assignee-ring
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-0.5 rounded-full border border-current opacity-0"
                  />
                  {person.name.slice(0, 1)}
                </button>
              ))}
            </div>
          )}
        </header>
        <div
          ref={panelRef}
          id={`${id}-panel`}
          inert={!isOpen}
          aria-hidden={!isOpen}
          className="overflow-hidden"
          style={{ height: defaultExpanded ? "auto" : 0 }}
        >
          <div
            ref={pickerRef}
            className="overflow-hidden"
            inert={!pickerOpen || !isOpen}
            aria-hidden={!pickerOpen || !isOpen}
            style={{ height: 0 }}
          >
            <fieldset
              ref={pickerContentRef}
              id={`${id}-status`}
              className="mx-3 flex flex-wrap gap-1.5 border-b border-[var(--wf-line)] pb-3 pt-1"
            >
              <legend className="sr-only">Workflow status</legend>
              {(Object.entries(WORKFLOW_STATUSES) as [WorkflowStatus, typeof statusSpec][]).map(
                ([key, spec]) => (
                  <label
                    key={key}
                    className="relative flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-[10px]"
                    style={{
                      color: `color-mix(in srgb, ${spec.color}, var(--wf-ink) 18%)`,
                      background: `color-mix(in srgb, ${spec.color}, transparent 88%)`,
                    }}
                  >
                    <input
                      disabled={!pickerOpen || !isOpen}
                      type="radio"
                      name={`${id}-workflow-status`}
                      value={key}
                      checked={currentStatus === key}
                      onChange={() => {
                        if (status === undefined) setOwnStatus(key);
                        onStatusChange?.(key);
                        setPickerOpen(false);
                        setAnnouncement(`Status changed to ${spec.label}`);
                        statusRef.current?.focus();
                      }}
                      className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"
                    />
                    <span
                      data-status-ring={key}
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-md border border-current opacity-0"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-current"
                    />
                    <spec.Icon size={11} aria-hidden="true" />
                    {spec.label}
                  </label>
                ),
              )}
            </fieldset>
          </div>
          <div ref={contentRef} className="relative" onPointerLeave={() => highlightRow(null)}>
            <span
              ref={highlightRef}
              data-hover-highlight
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 rounded-md bg-[var(--wf-hover)] opacity-0"
            />
            <div className="relative px-2 pb-2">
              {description && (
                <p className="px-2 pb-3 text-[11px] leading-relaxed text-[var(--wf-muted)] wrap-anywhere">
                  {description}
                </p>
              )}
              {currentSections.map((section, index) => (
                <section
                  data-section
                  key={section.id}
                  aria-label={section.label ?? `Checklist ${index + 1}`}
                  className={index > 0 ? "mt-2 border-t border-[var(--wf-line)] pt-2" : ""}
                >
                  {showSectionLabels && section.label && (
                    <h4 className="mb-1 flex items-center justify-between gap-2 px-2 text-[9px] font-medium tracking-[0.08em] text-[var(--wf-muted)] uppercase">
                      <span className="min-w-0 wrap-anywhere">{section.label}</span>
                      <span className="shrink-0 tabular-nums">
                        {section.tasks.filter((task) => task.done).length}/{section.tasks.length}
                      </span>
                    </h4>
                  )}
                  {section.tasks.map((task) => (
                    <WorkflowRow
                      key={task.id}
                      task={task}
                      person={assignees.find((person) => person.id === task.assigneeId)}
                      dimmed={!!filteredPerson && task.assigneeId !== filter}
                      onToggle={() => toggleTask(section.id, task.id)}
                      duration={time}
                      ease={ease}
                    />
                  ))}
                </section>
              ))}
              {tasks.length === 0 && (
                <p className="px-2 py-4 text-[12px] text-[var(--wf-muted)]">
                  A fresh start. Add your first task.
                </p>
              )}
            </div>
            {showFooter && (
              <footer className="flex min-h-10 items-center justify-between gap-2 rounded-b-[inherit] bg-[var(--wf-hover)] px-4 py-2 text-[10px] text-[var(--wf-muted)]">
                <span className="min-w-0 wrap-anywhere">{footerLabel}</span>
                <button
                  type="button"
                  aria-label={onOpen ? `Open ${title}` : `Collapse ${title}`}
                  onClick={() => (onOpen ? onOpen() : changeExpanded(false))}
                  className={cn(
                    "group/open flex shrink-0 cursor-pointer items-center gap-1 rounded-sm py-1 font-medium text-[var(--wf-ink)]",
                    focusClass,
                  )}
                >
                  {onOpen ? "Open" : "Close"}
                  <ArrowRight size={12} aria-hidden="true" />
                </button>
              </footer>
            )}
          </div>
        </div>
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </article>
  );
}

export default WorkflowCard;
