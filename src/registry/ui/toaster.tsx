"use client";

import {
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { calcGeneratorDuration, spring } from "motion";
import { ArrowRight, Check, Info, LoaderCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/use-media-query";

gsap.registerPlugin(useGSAP);

export type ToastDismissReason = "dismiss" | "timeout" | "action";

export interface ToastAction {
  label: string;
  onClick: (signal: AbortSignal) => void | Promise<void>;
  dismissOnSuccess?: boolean;
  errorMessage?: string;
}

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: "neutral" | "info" | "danger" | "success";
  icon?: ReactNode;
  date?: { month: string; day: string };
  badges?: readonly string[];
  duration?: number;
  countdownLabel?: string;
  footer?: string;
  action?: ToastAction;
  secondaryAction?: ToastAction;
  actionPlacement?: "inline" | "footer";
  dismiss?: ToastDismissReason;
}

export interface ToasterProps {
  items: readonly ToastItem[];
  onDismiss: (id: string, reason: ToastDismissReason) => void;
  stiffness?: number;
  damping?: number;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

const bounded = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

function useToastMotion(stiffness: number, damping: number) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  return useMemo(() => {
    const response = spring({
      keyframes: [0, 1],
      stiffness: bounded(stiffness, 240, 80, 500),
      damping: bounded(damping, 28, 16, 50),
      restSpeed: 0.001,
      restDelta: 0.001,
    });
    const duration = calcGeneratorDuration(response) / 1000;
    return {
      reduced,
      duration: reduced ? 0 : duration,
      ease: (progress: number) =>
        progress === 1 ? 1 : response.next(progress * duration * 1000).value,
    };
  }, [stiffness, damping, reduced]);
}

const buttonClass =
  "inline-flex min-h-8 cursor-pointer items-center justify-center gap-2 rounded-md px-1.5 text-[13px] font-medium outline-none hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-current disabled:cursor-wait disabled:opacity-50 dark:hover:bg-white/10";

function ToastCard({
  item,
  onDismiss,
  motion,
}: {
  item: ToastItem;
  onDismiss: (
    id: string,
    reason: ToastDismissReason,
    restoreFocus: boolean,
  ) => void;
  motion: ReturnType<typeof useToastMotion>;
}) {
  const titleId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<gsap.core.Timeline | null>(null);
  const pausesRef = useRef(new Set<string>());
  const closingRef = useRef(false);
  const restoreFocusRef = useRef(false);
  const requestRef = useRef<AbortController | null>(null);
  const callbacksRef = useRef({ onDismiss });
  const [closing, setClosing] = useState<ToastDismissReason | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const { contextSafe } = useGSAP({ scope: cardRef });
  const duration = bounded(item.duration ?? 0, 0, 0, 3600000);
  const tone = item.tone ?? "neutral";
  const hasFooter = Boolean(
    item.footer ||
    (item.countdownLabel && duration > 0) ||
    (item.action && item.actionPlacement === "footer"),
  );

  useGSAP(
    () => {
      callbacksRef.current = { onDismiss };
    },
    { dependencies: [onDismiss] },
  );

  const pause = (reason: string, active: boolean) => {
    if (active) pausesRef.current.add(reason);
    else pausesRef.current.delete(reason);
    timerRef.current?.paused(pausesRef.current.size > 0 || closingRef.current);
  };

  const dismiss = (reason: ToastDismissReason) => {
    if (closingRef.current) return;
    restoreFocusRef.current ||= Boolean(
      cardRef.current?.contains(document.activeElement),
    );
    closingRef.current = true;
    timerRef.current?.pause();
    requestRef.current?.abort();
    setClosing(reason);
  };

  useGSAP(
    () => {
      if (item.dismiss) dismiss(item.dismiss);
    },
    { dependencies: [item.dismiss], scope: cardRef },
  );

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      gsap.fromTo(
        cardRef.current,
        { autoAlpha: 0, y: reduced ? 0 : 18, scale: reduced ? 1 : 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: reduced ? 0 : motion.duration,
          ease: motion.ease,
          overwrite: "auto",
        },
      );
      return () => {
        requestRef.current?.abort();
      };
    },
    { scope: cardRef },
  );

  useGSAP(
    () => {
      if (!closing) return;
      gsap.to(cardRef.current, {
        autoAlpha: 0,
        y: motion.reduced ? 0 : -8,
        scale: motion.reduced ? 1 : 0.97,
        duration: motion.reduced ? 0 : 0.18,
        ease: "power2.in",
        overwrite: true,
        onComplete: () =>
          callbacksRef.current.onDismiss(
            item.id,
            closing,
            restoreFocusRef.current,
          ),
      });
    },
    { dependencies: [closing, motion], scope: cardRef, revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (!busy || motion.reduced) return;
      gsap.to("[data-toast-spinner]", {
        rotation: 360,
        duration: 0.8,
        ease: "none",
        repeat: -1,
      });
    },
    {
      dependencies: [busy, motion.reduced],
      scope: cardRef,
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      if (!duration) return;
      const clock = { remaining: duration / 1000 };
      let lastSecond = Math.ceil(clock.remaining);
      const timer = gsap.timeline({
        paused: true,
        onComplete: () => dismiss("timeout"),
      });
      timer.to(
        clock,
        {
          remaining: 0,
          duration: duration / 1000,
          ease: "none",
          onUpdate: () => {
            const second = Math.ceil(clock.remaining);
            if (second !== lastSecond && secondsRef.current) {
              secondsRef.current.textContent = `${second} ${second === 1 ? "second" : "seconds"}`;
              lastSecond = second;
            }
          },
        },
        0,
      );
      timer.fromTo(
        progressRef.current,
        { scaleX: 1 },
        { scaleX: 0, duration: duration / 1000, ease: "none" },
        0,
      );
      timerRef.current = timer;
      const visibility = () => pause("hidden", document.hidden);
      visibility();
      document.addEventListener("visibilitychange", visibility);
      return () => {
        document.removeEventListener("visibilitychange", visibility);
        timerRef.current = null;
      };
    },
    { dependencies: [duration], scope: cardRef, revertOnUpdate: true },
  );

  const runAction = async (action: ToastAction) => {
    if (requestRef.current || closingRef.current) return;
    restoreFocusRef.current = Boolean(
      cardRef.current?.contains(document.activeElement),
    );
    const request = new AbortController();
    requestRef.current = request;
    pause("action", true);
    setBusy(action.label);
    setError("");
    try {
      await action.onClick(request.signal);
      if (request.signal.aborted) return;
      if (action.dismissOnSuccess !== false) dismiss("action");
      pause("error", false);
    } catch {
      if (!request.signal.aborted) {
        setError(
          action.errorMessage ??
            "Couldn’t complete this action. Please try again.",
        );
        pause("error", true);
      }
    } finally {
      if (!request.signal.aborted) {
        requestRef.current = null;
        setBusy(null);
        pause("action", false);
      }
    }
  };

  const highlightFooter = contextSafe(
    (button: HTMLButtonElement, active: boolean) => {
      const highlight = button.querySelector("[data-toast-footer-highlight]");
      if (!highlight) return;
      gsap.to(highlight, {
        opacity: active ? 1 : 0,
        duration: motion.reduced ? 0 : 0.18,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
  );

  const actionButton = (action: ToastAction, footer = false) => (
    <button
      type="button"
      disabled={busy !== null || closing !== null}
      onClick={() => void runAction(action)}
      onPointerEnter={
        footer
          ? (event) => highlightFooter(event.currentTarget, true)
          : undefined
      }
      onPointerLeave={
        footer
          ? (event) => highlightFooter(event.currentTarget, false)
          : undefined
      }
      onFocus={
        footer
          ? (event) => highlightFooter(event.currentTarget, true)
          : undefined
      }
      onBlur={
        footer
          ? (event) => highlightFooter(event.currentTarget, false)
          : undefined
      }
      className={cn(
        buttonClass,
        footer &&
          "relative isolate min-h-11 w-full overflow-hidden px-4 hover:bg-transparent dark:hover:bg-transparent",
        footer && !item.footer && "rounded-none rounded-b-2xl",
        !footer && "-ml-1.5",
      )}
    >
      {footer && (
        <span
          data-toast-footer-highlight
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-black/[0.06] opacity-0 dark:bg-white/[0.08]"
        />
      )}
      {busy === action.label && (
        <LoaderCircle data-toast-spinner aria-hidden="true" size={14} />
      )}
      {action.label}
      {footer && item.footer && (
        <ArrowRight aria-hidden="true" size={14} className="ml-auto" />
      )}
    </button>
  );

  return (
    <div
      ref={cardRef}
      data-slot="toast"
      data-tone={tone}
      data-state={closing ? "closing" : busy ? "busy" : "open"}
      className={cn(
        "relative w-full rounded-2xl text-zinc-950 dark:text-zinc-100",
        hasFooter && "bg-zinc-100 p-1 pb-0 dark:bg-[#191919]",
        tone === "danger" && "bg-red-50 p-1 dark:bg-[#251414]",
        hasFooter && "pb-0",
        tone === "danger"
          ? "[--toast-accent:#dc2626] dark:[--toast-accent:#f87171]"
          : tone === "success"
            ? "[--toast-accent:#15803d] dark:[--toast-accent:#4ade80]"
            : tone === "info"
              ? "[--toast-accent:#2563eb] dark:[--toast-accent:#60a5fa]"
              : "[--toast-accent:#71717a] dark:[--toast-accent:#a1a1aa]",
      )}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") pause("hover", true);
      }}
      onPointerLeave={() => pause("hover", false)}
      onFocusCapture={() => pause("focus", true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          pause("focus", false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          dismiss("dismiss");
        }
      }}
    >
      <article
        aria-labelledby={titleId}
        aria-busy={busy !== null}
        className={cn(
          "relative isolate overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_2px_4px_#0000000a] dark:border-white/10 dark:bg-[#0c0c0c] dark:shadow-none",
          tone === "danger" && "border-red-200 dark:border-red-500/20",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [mask-image:linear-gradient(to_right,transparent_45%,black)]"
          style={{
            backgroundImage:
              "radial-gradient(var(--toast-accent) 0.8px, transparent 0.8px)",
            backgroundSize: "7px 7px",
          }}
        />
        <div className="flex items-start gap-3 p-4 pr-11">
          {item.date ? (
            <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-[10px] border border-zinc-100 bg-white text-center shadow-xs dark:border-white/10 dark:bg-black/30">
              <span className="text-[10px] font-medium uppercase text-zinc-500 dark:text-zinc-400">
                {item.date.month}
              </span>
              <span className="text-xl leading-6 font-medium tabular-nums">
                {item.date.day}
              </span>
            </div>
          ) : (
            item.icon !== null && (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-zinc-100 text-(--toast-accent) dark:bg-white/5">
                {item.icon ??
                  (tone === "success" ? (
                    <Check size={17} aria-hidden="true" />
                  ) : (
                    <Info size={17} aria-hidden="true" />
                  ))}
              </span>
            )
          )}
          <div className="min-w-0 flex-1">
            <h3
              id={titleId}
              className="text-[14px] leading-5 font-medium tracking-[-0.025em] wrap-anywhere"
            >
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-1 text-[13px] leading-5 text-zinc-500 wrap-anywhere dark:text-zinc-400">
                {item.description}
              </p>
            )}
            {(item.secondaryAction ||
              (item.action && item.actionPlacement !== "footer")) && (
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                {item.secondaryAction ? (
                  actionButton(item.secondaryAction)
                ) : (
                  <button
                    type="button"
                    className={cn(
                      buttonClass,
                      "-ml-1.5 text-zinc-500 dark:text-zinc-400",
                    )}
                    onClick={() => dismiss("dismiss")}
                    disabled={busy !== null || closing !== null}
                  >
                    Dismiss
                  </button>
                )}
                {item.action &&
                  item.actionPlacement !== "footer" &&
                  actionButton(item.action)}
              </div>
            )}
            {error && (
              <p
                role="alert"
                className="mt-2 text-xs leading-5 text-red-600 dark:text-red-400"
              >
                {error}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          aria-label={`Dismiss ${item.title}`}
          disabled={busy !== null || closing !== null}
          onClick={() => dismiss("dismiss")}
          className={cn(
            buttonClass,
            "absolute top-2 right-2 size-8 p-0 text-zinc-500 dark:text-zinc-400",
          )}
        >
          <X size={16} aria-hidden="true" />
        </button>
        {item.badges && item.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-t border-zinc-100 bg-zinc-50/80 px-4 py-2.5 dark:border-white/5 dark:bg-white/[0.025]">
            {item.badges.map((badge, index) => (
              <span
                key={`${badge}-${index}`}
                className={cn(
                  "rounded-md bg-zinc-200/70 px-2 py-1 text-[10px] leading-3 font-medium dark:bg-white/10",
                  index === 0 && "bg-(--toast-accent)/10 text-(--toast-accent)",
                )}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        {duration > 0 && (
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-0.5 bg-(--toast-accent)/10"
          >
            <div
              ref={progressRef}
              className="h-full origin-left bg-(--toast-accent)/50"
            />
          </div>
        )}
      </article>
      {hasFooter && (
        <div
          className={cn(
            "flex min-h-8 flex-wrap items-center justify-center gap-x-1 px-2 text-center text-[11px] leading-5 text-zinc-500 dark:text-zinc-400",
            tone === "danger" && "text-red-600 dark:text-red-400",
            item.action &&
              item.actionPlacement === "footer" &&
              !item.footer &&
              "-mx-1 overflow-hidden rounded-b-2xl px-0",
          )}
        >
          {item.countdownLabel && duration > 0 ? (
            <>
              <span>{item.countdownLabel}</span>
              <span
                ref={secondsRef}
                className="font-medium text-(--toast-accent) tabular-nums"
              >
                {Math.ceil(duration / 1000)}{" "}
                {Math.ceil(duration / 1000) === 1 ? "second" : "seconds"}
              </span>
            </>
          ) : (
            item.footer && (
              <span className={cn(item.action && "mr-auto pl-2 text-left")}>
                {item.footer}
              </span>
            )
          )}
          {item.action && item.actionPlacement === "footer" && (
            <div className={cn("flex", item.footer ? "ml-auto" : "w-full")}>
              {actionButton(item.action, true)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function measureToastPositions(root: HTMLDivElement | null) {
  const rows = Array.from(
    root?.querySelectorAll<HTMLLIElement>("[data-toast-id]") ?? [],
  );
  return rows.map((row) => {
    const rect = row.getBoundingClientRect();
    const currentX = Number(gsap.getProperty(row, "x")) || 0;
    const currentY = Number(gsap.getProperty(row, "y")) || 0;
    return {
      row,
      id: row.dataset.toastId ?? "",
      x: rect.left - currentX,
      y: rect.top - currentY,
      currentX,
      currentY,
    };
  });
}

export function Toaster({
  items,
  onDismiss,
  stiffness = 240,
  damping = 28,
  className,
  ref,
}: ToasterProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const positionsRef = useRef(new Map<string, { x: number; y: number }>());
  const restoreFocusRef = useRef(false);
  const motion = useToastMotion(stiffness, damping);
  const itemKey = JSON.stringify(items.map((item) => item.id));

  useGSAP(
    () => {
      const positions = measureToastPositions(rootRef.current);
      for (const { row, id, x, y, currentX, currentY } of positions) {
        const previous = positionsRef.current.get(id);
        if (previous) {
          gsap.fromTo(
            row,
            { x: previous.x - x + currentX, y: previous.y - y + currentY },
            {
              x: 0,
              y: 0,
              duration: motion.duration,
              ease: motion.ease,
              overwrite: true,
            },
          );
        }
      }
      positionsRef.current = new Map(
        positions.map(({ id, x, y }) => [id, { x, y }]),
      );
      if (restoreFocusRef.current) {
        (
          positions[0]?.row.querySelector<HTMLButtonElement>(
            "button:not(:disabled)",
          ) ?? rootRef.current
        )?.focus({ preventScroll: true });
        restoreFocusRef.current = false;
      }
    },
    { dependencies: [itemKey, motion, className], scope: rootRef },
  );

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      role="region"
      aria-label="Notifications"
      tabIndex={-1}
      className="w-full outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
    >
      <ol
        className={cn(
          "relative mx-auto flex w-full max-w-[440px] flex-col gap-4",
          className,
        )}
      >
        {items.map((item) => (
          <li
            key={item.id}
            data-toast-id={item.id}
            className="relative min-w-0"
          >
            <ToastCard
              item={item}
              motion={motion}
              onDismiss={(id, reason, restoreFocus) => {
                positionsRef.current = new Map(
                  measureToastPositions(rootRef.current).map(
                    ({ id: toastId, x, y }) => [toastId, { x, y }],
                  ),
                );
                const row = Array.from(
                  rootRef.current?.querySelectorAll<HTMLLIElement>(
                    "[data-toast-id]",
                  ) ?? [],
                ).find((element) => element.dataset.toastId === id);
                const activeElement = document.activeElement;
                const containsFocus = Boolean(row?.contains(activeElement));
                restoreFocusRef.current ||=
                  containsFocus ||
                  (restoreFocus && activeElement === document.body);
                onDismiss(id, reason);
              }}
            />
          </li>
        ))}
      </ol>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {items.map((item) => item.title).join(". ")}
      </div>
    </div>
  );
}

export default Toaster;
