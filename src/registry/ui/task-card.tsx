"use client";

import { useId, useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FolderClosed, Link2, MessagesSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export const TASK_CARD_PRIORITIES = {
  moderate: { label: "Moderate priority", color: "#ff7415" },
  urgent: { label: "Urgent", color: "#fa454b" },
  low: { label: "Low priority", color: "#36ad71" },
  onboarding: { label: "On boarding", color: "#47b3f5" },
} as const;

export type TaskCardPriority = keyof typeof TASK_CARD_PRIORITIES;

export interface TaskCardAssignee {
  name: string;
  src?: string;
}

export interface TaskCardProps {
  title: string;
  description?: string;
  priority?: TaskCardPriority;
  priorityLabel?: string;
  priorityColor?: string;
  status?: string;
  assignees?: TaskCardAssignee[];
  maxAssignees?: number;
  comments?: number;
  links?: number;
  files?: number;
  dueDate?: string;
  theme?: "dark" | "light";
  radius?: number;
  padding?: number;
  shadow?: number;
  hoverLift?: number;
  avatarSize?: number;
  bandHeight?: number;
  dashedBorder?: boolean;
  showAssignees?: boolean;
  showStatus?: boolean;
  showFooter?: boolean;
  surfaceColor?: string;
  textColor?: string;
  className?: string;
  onOpen?: () => void;
}

const bounded = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

export function TaskCard({
  title,
  description,
  priority = "moderate",
  priorityLabel,
  priorityColor,
  status = "In Progress",
  assignees = [],
  maxAssignees = 4,
  comments = 8,
  links = 4,
  files = 12,
  dueDate,
  theme = "dark",
  radius = 20,
  padding = 18,
  shadow = 0.7,
  hoverLift = 3,
  avatarSize = 30,
  bandHeight = 38,
  dashedBorder = true,
  showAssignees = true,
  showStatus = true,
  showFooter = true,
  surfaceColor,
  textColor,
  className,
  onOpen,
}: TaskCardProps) {
  const rootRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const lift = bounded(hoverLift, 3, 0, 10);
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !lift) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const hover = window.matchMedia("(hover: hover)");
        const motion = gsap.to(root, {
          y: -lift,
          duration: 0.35,
          ease: "power3.out",
          paused: true,
        });
        const enter = () => {
          if (hover.matches) motion.play();
        };
        const focus = () => motion.play();
        const leave = () => {
          if (!root.contains(document.activeElement)) motion.reverse();
        };
        const blur = () => {
          if (!root.matches(":hover")) motion.reverse();
        };
        root.addEventListener("pointerenter", enter);
        root.addEventListener("pointerleave", leave);
        root.addEventListener("focusin", focus);
        root.addEventListener("focusout", blur);
        return () => {
          root.removeEventListener("pointerenter", enter);
          root.removeEventListener("pointerleave", leave);
          root.removeEventListener("focusin", focus);
          root.removeEventListener("focusout", blur);
        };
      });
      return () => media.revert();
    },
    { scope: rootRef, dependencies: [lift], revertOnUpdate: true },
  );

  const light = theme === "light";
  const depth = bounded(shadow, 0.7, 0, 1);
  const curve = bounded(radius, 20, 8, 36);
  const inset = bounded(padding, 18, 12, 32);
  const size = bounded(avatarSize, 30, 20, 44);
  const limit = Math.floor(bounded(maxAssignees, 4, 1, 8));
  const date = dueDate ? new Date(`${dueDate}T00:00:00Z`) : null;
  const validDate = date && Number.isFinite(date.getTime());
  const dateLabel = validDate
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      }).format(date)
    : undefined;
  const base = TASK_CARD_PRIORITIES[priority] ?? TASK_CARD_PRIORITIES.moderate;
  const visibleAssignees = assignees.slice(0, limit);
  const overflow = assignees.length - visibleAssignees.length;

  return (
    <article
      ref={rootRef}
      aria-labelledby={titleId}
      data-slot="task-card"
      data-priority={priority}
      className={cn("relative isolate w-full min-w-0 font-sans", className)}
      style={
        {
          "--task-radius": `${curve}px`,
          "--task-inset": `${inset}px`,
          "--task-surface": surfaceColor ?? (light ? "#ffffff" : "#202020"),
          "--task-text": textColor ?? (light ? "#202124" : "#f4f4f4"),
          "--task-muted": light ? "#74777c" : "#96989b",
          "--task-border": light ? "#d4d5d8" : "#555658",
          "--task-status": light ? "#e7e7e8" : "#474747",
          borderRadius: curve,
          background: light ? "#f2f2f3" : "#171717",
          border: `1px solid ${light ? "#dddddf" : "#292929"}`,
          boxShadow: `0 ${12 * depth}px ${28 * depth}px -${8 * depth}px rgb(0 0 0 / ${depth * (light ? 0.16 : 0.4)}), 0 2px 4px rgb(0 0 0 / ${depth * 0.16}), inset 0 1px 0 rgb(255 255 255 / ${depth * 0.06})`,
          color: "var(--task-text)",
        } as CSSProperties
      }
    >
      <div
        data-slot="task-card-priority"
        className="flex items-start justify-center overflow-hidden px-3 pt-1.5 pb-3 text-center text-[13px] font-semibold uppercase tracking-[0.045em] text-white"
        style={{
          minHeight: bounded(bandHeight, 38, 38, 60),
          borderRadius: `${curve - 1}px ${curve - 1}px 0 0`,
          background: `linear-gradient(105deg, color-mix(in srgb, ${priorityColor ?? base.color}, white 4%), ${priorityColor ?? base.color})`,
          textShadow: "0 1px 2px rgb(0 0 0 / 0.15)",
        }}
      >
        <span className="min-w-0 line-clamp-2 wrap-anywhere">
          {priorityLabel ?? base.label}
        </span>
      </div>
      <div
        className="relative -mt-3 rounded-(--task-radius) bg-(--task-surface)"
        style={{ padding: inset, boxShadow: "0 -1px 0 rgb(0 0 0 / 0.2)" }}
      >
        {dashedBorder && (
          <span
            data-slot="task-card-outline"
            aria-hidden="true"
            className="pointer-events-none absolute inset-1 border border-dashed border-(--task-border)"
            style={{ borderRadius: Math.max(4, curve - 4) }}
          />
        )}
        <h3
          id={titleId}
          className="text-[19px] leading-snug font-medium tracking-[-0.04em] wrap-anywhere"
        >
          {onOpen ? (
            <button
              type="button"
              onClick={onOpen}
              className="cursor-pointer rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
              aria-label={`Open ${title || "Untitled task"}`}
            >
              {title || "Untitled task"}
            </button>
          ) : (
            title || "Untitled task"
          )}
        </h3>
        {description && (
          <p className="mt-2.5 line-clamp-2 text-[15px] leading-[1.45] tracking-[-0.025em] text-(--task-muted) wrap-anywhere">
            {description}
          </p>
        )}
        {((showAssignees && assignees.length > 0) ||
          (showStatus && status)) && (
          <div className="mt-4 flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2">
            {showAssignees && assignees.length > 0 && (
              <ul aria-label="Assignees" className="flex -space-x-3">
                {visibleAssignees.map((person, index) => (
                  <li key={`${person.name}-${index}`} title={person.name}>
                    <Avatar
                      className="border-[1.5px] border-white bg-zinc-300 ring-[1.5px] ring-black"
                      style={{ width: size, height: size }}
                    >
                      <AvatarImage
                        src={person.src}
                        alt={person.name}
                        className="object-cover"
                      />
                      <AvatarFallback
                        className="bg-zinc-300 text-[10px] font-semibold text-zinc-800"
                        aria-label={person.name}
                      >
                        {person.name
                          .split(/\s+/)
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((word) => word[0])
                          .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </li>
                ))}
                {overflow > 0 && (
                  <li
                    className="relative flex items-center justify-center rounded-full border border-white bg-zinc-700 text-[10px] font-medium text-white ring-[1.5px] ring-black"
                    style={{ width: size, height: size }}
                    aria-label={`${overflow} more assignees: ${assignees
                      .slice(limit)
                      .map((person) => person.name)
                      .join(", ")}`}
                  >
                    +{overflow}
                  </li>
                )}
              </ul>
            )}
            {showStatus && status && (
              <span className="ml-auto max-w-full rounded-[5px] bg-(--task-status) px-2.5 py-1.5 text-[13px] leading-snug tracking-[-0.03em] wrap-anywhere">
                {status}
              </span>
            )}
          </div>
        )}
      </div>
      {showFooter && (
        <footer
          className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3 text-[16px] tabular-nums"
          style={{ paddingInline: inset }}
        >
          <div className="flex items-center gap-4">
            {[
              { Icon: MessagesSquare, value: comments, label: "comments" },
              { Icon: Link2, value: links, label: "links" },
              { Icon: FolderClosed, value: files, label: "files" },
            ].map(({ Icon, value, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5"
                aria-label={`${Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0} ${label}`}
              >
                <Icon
                  size={17}
                  strokeWidth={1.6}
                  className="text-(--task-muted)"
                  aria-hidden="true"
                />
                <span aria-hidden="true">
                  {Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0}
                </span>
              </span>
            ))}
          </div>
          {dateLabel && (
            <time
              dateTime={dueDate}
              className="ml-auto text-(--task-muted)"
              aria-label={`Due ${dateLabel}`}
            >
              {dateLabel}
            </time>
          )}
        </footer>
      )}
    </article>
  );
}

export default TaskCard;
