"use client";

import React, {
  useState,
  type ComponentProps,
  type CSSProperties,
} from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

const POP_SCALE = [1, 1.12, 1];
const FLICK = [0, 6, -2, 0];
const FLICK_TIMES = [0, 0.35, 0.7, 1];

const FILL: Transition = { duration: 0.22, ease: EASE_OUT };
const POP: Transition = { duration: 0.32, ease: EASE_OUT, times: [0, 0.4, 1] };
const TICK: Transition = { duration: 0.24, ease: EASE_OUT, delay: 0.04 };
const STRIKE: Transition = { duration: 0.36, ease: EASE_IN_OUT };
const NUDGE: Transition = {
  duration: 0.28,
  ease: EASE_OUT,
  times: FLICK_TIMES,
};
const REORDER: Transition = { type: "spring", stiffness: 340, damping: 28 };
const INSTANT: Transition = { duration: 0 };

const RING_R = 10.5;
const RING_DASH = "1 4.5";

const STRIKE_STYLE: CSSProperties = {
  backgroundImage: "linear-gradient(currentColor, currentColor)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "0 52%",
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
};

const SIZES = {
  sm: {
    row: "gap-2.5 rounded-xl px-3 py-2",
    check: "h-4.5 w-4.5",
    text: "text-[13px] leading-5",
    line: "1.5px",
    list: "gap-1.5",
    particleDist: 14,
  },
  md: {
    row: "gap-3 rounded-[14px] px-3.5 py-2.5",
    check: "h-5.5 w-5.5",
    text: "text-[14.5px] leading-6",
    line: "2px",
    list: "gap-2",
    particleDist: 18,
  },
  lg: {
    row: "gap-3.5 rounded-2xl px-4 py-3",
    check: "h-6.5 w-6.5",
    text: "text-[16px] leading-7",
    line: "2.5px",
    list: "gap-2.5",
    particleDist: 22,
  },
} as const;

export type TaskSize = keyof typeof SIZES;

const STAGE = {
  idle: "idle",
  tick: "tick",
  strike: "strike",
  nudge: "nudge",
  settled: "settled",
  unstrike: "unstrike",
  untick: "untick",
} as const;
type Stage = (typeof STAGE)[keyof typeof STAGE];

const FILLED: Stage[] = ["tick", "strike", "nudge", "settled", "unstrike"];
const STRUCK: Stage[] = ["strike", "nudge", "settled"];

const CARD =
  "bg-zinc-900/70 border border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:border-white/15 hover:bg-zinc-900/90 active:scale-[0.985] text-zinc-100 backdrop-blur-md";
const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315] as const;

function useTiming() {
  const reduced = useReducedMotion() ?? false;
  return (transition: Transition) => (reduced ? INSTANT : transition);
}

function TaskParticles({
  active,
  distance,
  accent,
}: {
  active: boolean;
  distance: number;
  accent: string;
}) {
  const timing = useTiming();

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {PARTICLE_ANGLES.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const targetX = Math.cos(rad) * distance;
        const targetY = Math.sin(rad) * distance;
        const size = i % 2 === 0 ? 3.5 : 2.5;

        return (
          <motion.span
            key={angle}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: accent,
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={
              active
                ? {
                    x: [0, targetX * 1.1, targetX],
                    y: [0, targetY * 1.1, targetY],
                    scale: [0, 1.4, 0],
                    opacity: [1, 1, 0],
                  }
                : { x: 0, y: 0, scale: 0, opacity: 0 }
            }
            transition={
              active
                ? timing({
                    duration: 0.48,
                    ease: EASE_OUT,
                    times: [0, 0.4, 1],
                  })
                : INSTANT
            }
          />
        );
      })}
    </div>
  );
}

function TaskCheck({
  filled,
  size,
  onDrawn,
  accent,
}: {
  filled: boolean;
  size: TaskSize;
  onDrawn: () => void;
  accent: string;
}) {
  const timing = useTiming();
  const dist = SIZES[size].particleDist;

  return (
    <div className="relative shrink-0 flex items-center justify-center">
      <TaskParticles active={filled} distance={dist} accent={accent} />

      <motion.div
        className="absolute inset-0 rounded-full blur-xs pointer-events-none"
        style={{ backgroundColor: accent }}
        initial={false}
        animate={
          filled
            ? { scale: [0.8, 1.5, 1.7], opacity: [0, 0.45, 0] }
            : { scale: 0.8, opacity: 0 }
        }
        transition={
          filled ? timing({ duration: 0.4, ease: EASE_OUT }) : INSTANT
        }
      />

      <motion.svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn(
          "shrink-0 text-zinc-500 transition-colors relative z-10",
          SIZES[size].check,
        )}
        initial={false}
        animate={{ scale: filled ? POP_SCALE : 1 }}
        transition={filled ? timing(POP) : INSTANT}
      >
        <motion.circle
          cx="12"
          cy="12"
          r={RING_R}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray={RING_DASH}
          initial={false}
          animate={{ opacity: filled ? 0 : 1 }}
          transition={timing(FILL)}
        />
        <motion.circle
          cx="12"
          cy="12"
          r="11.5"
          fill={accent}
          style={{ transformBox: "view-box", transformOrigin: "12px 12px" }}
          initial={false}
          animate={{ scale: filled ? 1 : 0 }}
          transition={timing(FILL)}
        />
        <motion.path
          d="M7.2 12.2 10.5 15.5 16.8 8.7"
          fill="none"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: filled ? 1 : 0, opacity: filled ? 1 : 0 }}
          transition={timing(TICK)}
          onAnimationComplete={onDrawn}
        />
      </motion.svg>
    </div>
  );
}

function TaskLabel({
  label,
  struck,
  size,
  onStruck,
}: {
  label: string;
  struck: boolean;
  size: TaskSize;
  onStruck: () => void;
}) {
  const timing = useTiming();
  const { text, line } = SIZES[size];

  return (
    <span className="min-w-0 flex-1">
      <motion.span
        style={STRIKE_STYLE}
        className={cn(
          "font-medium tracking-[-0.01em] transition-all duration-300 block select-none",
          text,
          struck ? "text-zinc-500 opacity-60" : "text-zinc-100 opacity-100",
        )}
        initial={false}
        animate={{
          backgroundSize: `${struck ? 100 : 0}% ${line}`,
          filter: struck ? "blur(0.15px)" : "blur(0px)",
        }}
        transition={timing(STRIKE)}
        onAnimationComplete={onStruck}
      >
        {label}
      </motion.span>
    </span>
  );
}

export type Task = {
  id: string;
  label: string;
  done?: boolean;
};

export type TaskItemProps = Omit<
  ComponentProps<"button">,
  "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  size?: TaskSize;
  accent?: string;
  onCheckedChange?: (checked: boolean) => void;
  onSettled?: () => void;
  onReverted?: () => void;
};

export function TaskItem({
  label,
  checked,
  defaultChecked = false,
  size = "md",
  accent = "#FF5F2E",
  onCheckedChange,
  onSettled,
  onReverted,
  className,
  onClick,
  style,
  ...props
}: TaskItemProps) {
  const timing = useTiming();
  const [own, setOwn] = useState(defaultChecked);
  const done = checked ?? own;

  const [stage, setStage] = useState<Stage>(done ? STAGE.settled : STAGE.idle);
  const [was, setWas] = useState(done);

  if (was !== done) {
    setWas(done);
    setStage(done ? STAGE.tick : STAGE.unstrike);
  }

  const onDrawn = () => {
    if (stage === STAGE.tick) setStage(STAGE.strike);
    if (stage === STAGE.untick) {
      setStage(STAGE.idle);
      onReverted?.();
    }
  };

  const onStruck = () => {
    if (stage === STAGE.strike) setStage(STAGE.nudge);
    if (stage === STAGE.unstrike) setStage(STAGE.untick);
  };

  const onFlicked = () => {
    if (stage !== STAGE.nudge) return;
    setStage(STAGE.settled);
    onSettled?.();
  };

  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={done}
      data-slot="task-item"
      data-state={done ? "checked" : "unchecked"}
      style={style}
      onClick={(event) => {
        onClick?.(event);
        if (checked === undefined) setOwn(!done);
        onCheckedChange?.(!done);
      }}
      animate={{ x: stage === STAGE.nudge ? FLICK : 0 }}
      transition={stage === STAGE.nudge ? timing(NUDGE) : INSTANT}
      onAnimationComplete={onFlicked}
      className={cn(
        "flex w-full cursor-pointer items-center text-left transition-[border-color,background-color,filter,box-shadow] duration-200",
        SIZES[size].row,
        CARD,
        FOCUS,
        done && "bg-zinc-950/40 border-white/4",
        className,
      )}
      {...props}
    >
      <TaskCheck
        filled={FILLED.includes(stage)}
        size={size}
        onDrawn={onDrawn}
        accent={accent}
      />
      <TaskLabel
        label={label}
        struck={STRUCK.includes(stage)}
        size={size}
        onStruck={onStruck}
      />
    </motion.button>
  );
}

export type TaskListProps = ComponentProps<"ul"> & {
  tasks?: Task[];
  defaultTasks?: Task[];
  size?: TaskSize;
  accent?: string;
  reorderCompleted?: boolean;
  onTasksChange?: (tasks: Task[]) => void;
};

const DEFAULT_SAMPLE_TASKS: Task[] = [
  { id: "1", label: "Refactor animation spring curves", done: false },
  { id: "2", label: "Implement micro-particle spark bursts", done: true },
  { id: "3", label: "Sub-pixel calibrated hairline strokes", done: false },
  { id: "4", label: "Hardware accelerated scaleX transitions", done: false },
  { id: "5", label: "Synchronize theme token variables", done: true },
];

export function TaskList({
  tasks,
  defaultTasks = DEFAULT_SAMPLE_TASKS,
  size = "md",
  accent = "#FF5F2E",
  reorderCompleted = true,
  onTasksChange,
  className,
  ...props
}: TaskListProps) {
  const timing = useTiming();
  const [own, setOwn] = useState<Task[]>(defaultTasks);
  const current = tasks ?? own;

  const [parked, setParked] = useState<string[]>(() =>
    (tasks ?? defaultTasks).filter((task) => task.done).map((task) => task.id),
  );
  const [announcement, setAnnouncement] = useState("");

  const updateTasks = (next: Task[]) => {
    if (tasks === undefined) setOwn(next);
    onTasksChange?.(next);
  };

  const toggle = (task: Task, done: boolean) => {
    const next = current.map((item) =>
      item.id === task.id ? { ...item, done } : item,
    );
    updateTasks(next);
    setAnnouncement(`${task.label} ${done ? "completed" : "reopened"}`);
  };

  const finished = reorderCompleted
    ? parked
        .map((id) => current.find((task) => task.id === id))
        .filter((task): task is Task => task?.done === true)
    : [];

  const open = reorderCompleted
    ? current.filter((task) => !finished.includes(task))
    : current;

  return (
    <ul
      data-slot="task-list"
      className={cn(
        "flex w-full max-w-md flex-col select-none",
        SIZES[size].list,
        className,
      )}
      {...props}
    >
      {[...open, ...finished].map((task) => (
        <motion.li
          key={task.id}
          layout
          transition={timing(REORDER)}
          className="w-full list-none"
        >
          <TaskItem
            label={task.label}
            checked={!!task.done}
            size={size}
            accent={accent}
            onCheckedChange={(done) => toggle(task, done)}
            onSettled={() => {
              if (reorderCompleted) {
                setParked((ids) =>
                  ids.includes(task.id) ? ids : [...ids, task.id],
                );
              }
            }}
            onReverted={() => {
              if (reorderCompleted) {
                setParked((ids) => ids.filter((id) => id !== task.id));
              }
            }}
          />
        </motion.li>
      ))}
      <li role="status" aria-live="polite" className="sr-only">
        {announcement}
      </li>
    </ul>
  );
}

export default TaskList;
