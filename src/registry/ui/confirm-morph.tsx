"use client";

import {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useIsPresent,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
  type Transition,
  type Variants,
} from "motion/react";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmMorphState =
  | "idle"
  | "confirming"
  | "pending"
  | "done"
  | "error";

export interface ConfirmMorphProps {
  label: ReactNode;
  icon?: ReactNode;
  prompt?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  pendingLabel?: string;
  doneLabel?: string;
  errorLabel?: string;
  retryLabel?: string;
  undoLabel?: string;
  undoingLabel?: string;
  tone?: "danger" | "neutral";
  onConfirm?: () => void | Promise<unknown>;
  onUndo?: () => void | Promise<unknown>;
  onCancel?: () => void;
  state?: ConfirmMorphState;
  defaultState?: ConfirmMorphState;
  onStateChange?: (state: ConfirmMorphState) => void;
  confirmTimeout?: number;
  resultTimeout?: number;
  cancelOnOutsidePress?: boolean;
  disabled?: boolean;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

const GROW: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.8,
};

const SHRINK: Transition = {
  type: "spring",
  stiffness: 460,
  damping: 34,
  mass: 0.8,
};

const SLIDE: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.8,
};

const emptySubscribe = () => () => {};

function useReducedFlag() {
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const reducedMotion = useReducedMotion();
  return Boolean(reducedMotion && hydrated);
}

const faceVariants: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction * 8,
  }),
  shown: {
    opacity: 1,
    x: 0,
    transition: {
      x: SLIDE,
      opacity: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
    },
  },
  gone: (direction: number) => ({
    opacity: 0,
    x: direction * -6,
    transition: {
      duration: 0.09,
      ease: [0.2, 0, 0, 1],
    },
  }),
};

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.12 } },
  gone: { opacity: 0, transition: { duration: 0.08 } },
};

function Face({
  id,
  direction,
  reduced,
  onSize,
  children,
  labelledBy,
}: {
  id: ConfirmMorphState;
  direction: number;
  reduced: boolean;
  onSize: (id: ConfirmMorphState, width: number) => void;
  children: ReactNode;
  labelledBy?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const present = useIsPresent();

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || !present) return;
    const report = () => {
      const flex = node.style.flex;
      node.style.flex = "none";
      const width =
        node.scrollWidth || Math.ceil(node.getBoundingClientRect().width);
      node.style.flex = flex;
      onSize(id, width);
    };
    report();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(report);
    observer.observe(node);
    return () => observer.disconnect();
  }, [id, onSize, present]);

  return (
    <motion.div
      ref={ref}
      className="flex h-full items-center justify-center gap-1.5 px-3 whitespace-nowrap text-xs select-none will-change-[transform,opacity]"
      data-face={id}
      custom={direction}
      role={labelledBy ? "group" : undefined}
      aria-labelledby={labelledBy}
      variants={reduced ? fadeVariants : faceVariants}
      initial="hidden"
      animate="shown"
      exit="gone"
      inert={!present || undefined}
    >
      {children}
    </motion.div>
  );
}

function Check({ reduced }: { reduced: boolean }) {
  return (
    <svg
      className="size-4 shrink-0"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <motion.circle
        className="fill-emerald-500/15 stroke-emerald-500 dark:stroke-emerald-400"
        cx="9"
        cy="9"
        r="7.5"
        strokeWidth="1.5"
        style={{ transformOrigin: "9px 9px" }}
        initial={reduced ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          scale: { type: "spring", stiffness: 450, damping: 28 },
          opacity: { duration: 0.12 },
        }}
      />
      <motion.path
        className="stroke-emerald-500 dark:stroke-emerald-400"
        d="M5.6 9.3 7.8 11.4 12.4 6.7"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
      />
    </svg>
  );
}

export function ConfirmMorph({
  label,
  icon,
  prompt,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  pendingLabel = "Deleting",
  doneLabel = "Deleted",
  errorLabel = "Couldn’t finish",
  retryLabel = "Retry",
  undoLabel = "Undo",
  undoingLabel = "Restoring",
  tone = "danger",
  onConfirm,
  onUndo,
  onCancel,
  state: stateProp,
  defaultState = "idle",
  onStateChange,
  confirmTimeout = 6000,
  resultTimeout = 5000,
  cancelOnOutsidePress = true,
  disabled = false,
  className,
  ref,
}: ConfirmMorphProps) {
  const reduced = useReducedFlag();
  const uid = useId();
  const promptId = `${uid}-prompt`;
  const rootRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => rootRef.current as HTMLDivElement, []);

  const [inner, setInner] = useState<ConfirmMorphState>(defaultState);
  const state = stateProp ?? inner;
  const [direction, setDirection] = useState(1);
  const [working, setWorking] = useState<"confirm" | "undo">("confirm");
  const [announcement, setAnnouncement] = useState("");

  const live = useRef({
    state,
    onStateChange,
    controlled: stateProp !== undefined,
  });
  useLayoutEffect(() => {
    live.current = {
      state,
      onStateChange,
      controlled: stateProp !== undefined,
    };
  });
  const pendingFocus = useRef(false);
  const run = useRef(0);

  const go = useCallback((next: ConfirmMorphState) => {
    const current = live.current.state;
    if (next === current) return;
    const root = rootRef.current;
    pendingFocus.current =
      Boolean(root) &&
      (root?.contains(document.activeElement) ||
        document.activeElement === document.body);
    setDirection(next === "idle" ? -1 : 1);
    if (!live.current.controlled) setInner(next);
    live.current.state = next;
    live.current.onStateChange?.(next);
  }, []);

  const toIdle = useCallback(() => {
    run.current++;
    go("idle");
  }, [go]);

  const perform = useCallback(
    async (kind: "confirm" | "undo") => {
      const handler = kind === "confirm" ? onConfirm : onUndo;
      const token = ++run.current;
      setWorking(kind);
      let result: void | Promise<unknown> | undefined;
      try {
        result = handler?.();
      } catch {
        go("error");
        setAnnouncement(errorLabel);
        return;
      }
      if (result && typeof (result as Promise<unknown>).then === "function") {
        go("pending");
        setAnnouncement(kind === "confirm" ? pendingLabel : undoingLabel);
        try {
          await result;
        } catch {
          if (token !== run.current) return;
          go("error");
          setAnnouncement(errorLabel);
          return;
        }
        if (token !== run.current) return;
      }
      if (kind === "undo") {
        go("idle");
        setAnnouncement("Undone");
        return;
      }
      go("done");
      setAnnouncement(
        onUndo ? `${doneLabel}. ${undoLabel} is available.` : doneLabel,
      );
    },
    [
      doneLabel,
      errorLabel,
      go,
      onConfirm,
      onUndo,
      pendingLabel,
      undoLabel,
      undoingLabel,
    ],
  );

  const cancel = useCallback(() => {
    onCancel?.();
    toIdle();
    setAnnouncement("Cancelled");
  }, [onCancel, toIdle]);

  const expire = useRef(() => {});
  useLayoutEffect(() => {
    expire.current = () => {
      if (live.current.state === "confirming") cancel();
      else toIdle();
    };
  });

  const width = useMotionValue<number | "auto">("auto");
  const target = useRef(0);
  const flight = useRef(0);

  const onFaceSize = useCallback(
    (id: ConfirmMorphState, w: number) => {
      if (id !== live.current.state || Math.abs(w - target.current) < 0.5)
        return;
      const from = target.current;
      target.current = w;
      if (!from || reduced) {
        width.set(w);
        return;
      }
      if (width.get() === "auto") width.jump(from);
      const token = ++flight.current;
      animate(width, w, w > from ? GROW : SHRINK).then(() => {
        if (token === flight.current) width.set(w);
      });
    },
    [reduced, width],
  );

  const drain = useMotionValue(1);
  const clock = useRef<AnimationPlaybackControls | null>(null);
  const holds = useRef({ hover: false, hidden: false });
  const timeout =
    state === "confirming"
      ? confirmTimeout
      : state === "done" || state === "error"
        ? resultTimeout
        : 0;

  const sync = useCallback(() => {
    const control = clock.current;
    if (!control) return;
    const held = holds.current.hover || holds.current.hidden;
    if (held) control.pause();
    else control.play();
  }, []);

  useEffect(() => {
    if (!timeout) return;
    drain.jump(1);
    const control = animate(drain, 0, {
      duration: timeout / 1000,
      ease: "linear",
    });
    clock.current = control;
    control.then(() => {
      if (clock.current === control) {
        clock.current = null;
        expire.current();
      }
    });
    sync();
    return () => {
      if (clock.current === control) clock.current = null;
      control.stop();
    };
  }, [drain, state, sync, timeout]);

  useEffect(() => {
    const onVisibility = () => {
      holds.current.hidden = document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [sync]);

  useEffect(() => {
    if (state !== "confirming" || !cancelOnOutsidePress) return;
    const down = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) cancel();
    };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [cancel, cancelOnOutsidePress, state]);

  useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    const root = rootRef.current;
    if (!root) return;
    const faceElement = root.querySelector<HTMLElement>(
      `[data-face="${state}"]`,
    );
    const autofocus = faceElement?.querySelector<HTMLElement>(
      "[data-autofocus]:not(:disabled)",
    );
    (autofocus ?? root).focus({ preventScroll: true });
  }, [state]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return;
    if (state === "confirming") {
      event.preventDefault();
      event.stopPropagation();
      cancel();
    } else if (state === "done" || state === "error") {
      event.preventDefault();
      event.stopPropagation();
      toIdle();
    }
  };

  const shownPrompt = prompt ?? <>{label}?</>;

  const face = (() => {
    switch (state) {
      case "confirming":
        return (
          <>
            <span
              id={promptId}
              className="text-xs font-medium text-zinc-100 pr-1 select-none"
            >
              {shownPrompt}
            </span>
            <button
              type="button"
              className="rounded-full px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 active:scale-95"
              data-autofocus
              onClick={cancel}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-all cursor-pointer outline-none active:scale-95 shadow-xs",
                tone === "danger"
                  ? "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-1 focus-visible:ring-rose-400"
                  : "bg-foreground text-background hover:bg-foreground/90 focus-visible:ring-1 focus-visible:ring-foreground/30",
              )}
              onClick={() => void perform("confirm")}
            >
              {confirmLabel}
            </button>
          </>
        );
      case "pending":
        return (
          <span className="flex items-center gap-2 text-xs font-medium text-zinc-300 select-none">
            <LoaderCircle
              className="size-3.5 shrink-0 animate-spin text-zinc-400"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>{working === "undo" ? undoingLabel : pendingLabel}</span>
          </span>
        );
      case "done":
        return (
          <>
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 select-none">
              <Check reduced={reduced} />
              <span>{doneLabel}</span>
            </span>
            {onUndo && (
              <button
                type="button"
                className="rounded-full px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 active:scale-95 ml-1"
                data-autofocus
                onClick={() => void perform("undo")}
              >
                {undoLabel}
              </button>
            )}
          </>
        );
      case "error":
        return (
          <>
            <span className="flex items-center gap-1.5 text-xs font-medium text-rose-400 select-none">
              <CircleAlert
                className="size-3.5 shrink-0 text-rose-400"
                strokeWidth={2}
                aria-hidden="true"
              />
              <span>{errorLabel}</span>
            </span>
            <button
              type="button"
              className="rounded-full px-2.5 py-1 text-xs font-medium text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-rose-400 active:scale-95 ml-1"
              data-autofocus
              onClick={() => void perform(working)}
            >
              {retryLabel}
            </button>
          </>
        );
      default:
        return (
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors outline-none rounded-full select-none",
              tone === "danger"
                ? "text-rose-400 hover:text-rose-300"
                : "text-zinc-200 hover:text-white",
              disabled && "opacity-50 pointer-events-none cursor-not-allowed",
            )}
            data-autofocus
            disabled={disabled}
            onClick={() => {
              setAnnouncement(
                typeof shownPrompt === "string" ? shownPrompt : "",
              );
              go("confirming");
            }}
          >
            {icon && (
              <span
                className="shrink-0 size-3.5 flex items-center justify-center text-current"
                aria-hidden="true"
              >
                {icon}
              </span>
            )}
            <span>{label}</span>
          </button>
        );
    }
  })();

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative inline-flex items-center select-none",
        disabled && state === "idle" && "opacity-50 pointer-events-none",
        className,
      )}
      data-state={state}
      data-tone={tone}
      data-disabled={disabled || undefined}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      aria-busy={state === "pending" || undefined}
      onPointerEnter={() => {
        holds.current.hover = true;
        sync();
      }}
      onPointerLeave={() => {
        holds.current.hover = false;
        sync();
      }}
      onPointerCancel={() => {
        holds.current.hover = false;
        sync();
      }}
    >
      <motion.div
        className={cn(
          "box-content relative inline-flex h-8 items-center justify-center overflow-hidden rounded-full border transition-colors duration-150 backdrop-blur-md",
          tone === "danger" &&
            state === "idle" &&
            "border-rose-500/25 bg-rose-500/10 hover:border-rose-500/40 hover:bg-rose-500/15",
          tone === "neutral" &&
            state === "idle" &&
            "border-zinc-700/60 bg-zinc-800/80 hover:border-zinc-600 hover:bg-zinc-800",
          state === "confirming" && "border-zinc-700/80 bg-zinc-900 shadow-md",
          state === "pending" && "border-zinc-700/80 bg-zinc-900/90 shadow-md",
          state === "done" && "border-emerald-500/30 bg-emerald-500/10",
          state === "error" && "border-rose-500/30 bg-rose-500/10",
        )}
        style={{ width }}
      >
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <Face
            key={state}
            id={state}
            direction={direction}
            reduced={reduced}
            onSize={onFaceSize}
            labelledBy={state === "confirming" ? promptId : undefined}
          >
            {face}
          </Face>
        </AnimatePresence>
      </motion.div>
      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}

export default ConfirmMorph;
