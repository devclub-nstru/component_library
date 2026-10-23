"use client";

import { useId, useRef, useState, type Ref } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check, ChevronDown, Globe2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  thinkingPanelBounded,
  thinkingSourceUrl,
  type ThinkingSource,
  type ThinkingStatus,
  type ThinkingStep,
} from "./thinking-panel-types";
import { useThinkingPanelMotion } from "./use-thinking-panel-motion";

export type { ThinkingSource, ThinkingStatus, ThinkingStep } from "./thinking-panel-types";

gsap.registerPlugin(useGSAP);

export interface ThinkingPanelProps {
  sources?: readonly ThinkingSource[];
  steps?: readonly ThinkingStep[];
  status?: ThinkingStatus;
  elapsedSeconds?: number;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  visibleSources?: number;
  completionLabel?: string;
  errorMessage?: string;
  width?: number;
  stiffness?: number;
  damping?: number;
  speed?: number;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function ThinkingPanel({
  sources = [],
  steps = [],
  status = "thinking",
  elapsedSeconds,
  expanded,
  defaultExpanded = true,
  onExpandedChange,
  visibleSources = 4,
  completionLabel = "Finished thinking",
  errorMessage = "Something went wrong. Please try again.",
  width = 440,
  stiffness = 380,
  damping = 34,
  speed = 1,
  className,
  ref,
}: ThinkingPanelProps) {
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sourcesTriggerRef = useRef<HTMLButtonElement>(null);
  const clockRef = useRef({ accumulated: 0, started: 0 });
  const [seconds, setSeconds] = useState(0);
  const [ownExpanded, setOwnExpanded] = useState(defaultExpanded);
  const [showAllSources, setShowAllSources] = useState(false);
  const [initialExpanded] = useState(expanded ?? defaultExpanded);
  const isOpen = expanded ?? ownExpanded;
  const sourceLimit = Math.floor(thinkingPanelBounded(visibleSources, 4, 1, 50));
  const displayedSources = showAllSources ? sources : sources.slice(0, sourceLimit);
  const remaining = Math.max(0, sources.length - sourceLimit);
  const elapsed = Math.floor(thinkingPanelBounded(elapsedSeconds ?? seconds, 0, 0, Number.MAX_SAFE_INTEGER));
  const signature = JSON.stringify([sources.map((source) => source.id), steps.map((step) => step.id), status, showAllSources]);

  useGSAP(() => {
    if (status !== "thinking" || elapsedSeconds !== undefined) return;
    const clock = clockRef.current;
    clock.started = performance.now();
    const tick = () => {
      const next = Math.floor((clock.accumulated + performance.now() - clock.started) / 1000);
      setSeconds((previous) => previous === next ? previous : next);
    };
    gsap.ticker.add(tick);
    return () => {
      clock.accumulated += performance.now() - clock.started;
      gsap.ticker.remove(tick);
    };
  }, { dependencies: [status, elapsedSeconds], revertOnUpdate: true });

  useThinkingPanelMotion({ rootRef, panelRef, contentRef, signature, expanded: isOpen, status, stiffness, damping, speed });

  const changeExpanded = (next: boolean) => {
    if (expanded === undefined) setOwnExpanded(next);
    onExpandedChange?.(next);
    if (!next) triggerRef.current?.focus({ preventScroll: true });
  };

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      data-slot="thinking-panel"
      data-expanded={isOpen}
      data-status={status}
      role="region"
      aria-label="AI activity"
      className={cn("max-w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-white text-[13px] leading-5 text-zinc-600 shadow-[0_8px_32px_-20px_#00000020] dark:border-white/[0.08] dark:bg-[#1b1b1d] dark:text-zinc-400 dark:shadow-[0_12px_40px_-20px_#00000050]", className)}
      style={{ width: thinkingPanelBounded(width, 440, 240, 960) }}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !isOpen) return;
        event.preventDefault();
        event.stopPropagation();
        if (showAllSources && contentRef.current?.contains(event.target as Node)) {
          setShowAllSources(false);
          sourcesTriggerRef.current?.focus({ preventScroll: true });
        } else changeExpanded(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${uid}-content`}
        onClick={() => changeExpanded(!isOpen)}
        className="flex min-h-13 w-full cursor-pointer items-center gap-2.5 rounded-2xl px-4 text-left outline-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-400 dark:hover:bg-white/[0.025]"
      >
        <span aria-hidden="true" className="grid size-3.5 shrink-0 grid-cols-3 gap-[2px] text-violet-500 dark:text-violet-400">
          {Array.from({ length: 9 }, (_, index) => <span key={index} data-thinking-pixel className="rounded-[1px] bg-current" style={{ opacity: 0.65 }} />)}
        </span>
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {status === "thinking" ? "Thinking" : status === "error" ? "Interrupted after" : "Worked for"}{" "}
          <span aria-hidden="true" className="font-normal tabular-nums text-zinc-500 dark:text-zinc-400">{elapsed}s</span>
          <span className="sr-only">{status === "thinking" ? "in progress" : `${elapsed} seconds`}</span>
        </span>
        <ChevronDown data-thinking-chevron aria-hidden="true" className="ml-auto size-4 shrink-0 text-zinc-400" style={{ transform: initialExpanded ? "rotate(0deg)" : "rotate(-90deg)" }} />
      </button>
      <div ref={panelRef} id={`${uid}-content`} inert={!isOpen} aria-hidden={!isOpen} className="overflow-hidden" style={{ height: initialExpanded ? "auto" : 0 }}>
        <div ref={contentRef} className="border-t border-zinc-100 px-4 pt-4 pb-4 dark:border-white/[0.055]">
          <ol aria-label="Activity steps" className="space-y-0">
            <li data-thinking-row="sources" className="relative grid grid-cols-[14px_minmax(0,1fr)] gap-x-2.5 pb-3">
              <span aria-hidden="true" className="absolute top-5 bottom-1 left-[6px] w-px bg-zinc-200 dark:bg-white/[0.09]" />
              <Globe2 aria-hidden="true" className="mt-0.5 size-3.5 text-zinc-400 dark:text-zinc-500" />
              <div className="min-w-0">
                <p className="mb-2">{sources.length ? "Searched" : status === "thinking" ? "Searching sources…" : "No sources searched"}</p>
                {sources.length > 0 && <div className="flex flex-wrap items-center gap-1.5">
                  {displayedSources.map((source) => {
                    const href = thinkingSourceUrl(source.href);
                    const contents = <><span aria-hidden="true" className="flex size-3.5 shrink-0 items-center justify-center overflow-hidden rounded-[3px] text-[10px] font-semibold">{source.icon ?? <Globe2 className="size-3" />}</span><span className="truncate">{source.label}</span></>;
                    const chipClass = "inline-flex min-h-7 max-w-full items-center gap-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50/70 px-2 py-1 text-[11px] leading-4 text-zinc-600 dark:border-white/[0.07] dark:bg-white/[0.025] dark:text-zinc-400";
                    return href ? <a key={source.id} data-thinking-source={source.id} href={href} target="_blank" rel="noopener noreferrer" title={href} className={cn(chipClass, "outline-none hover:border-violet-300 hover:bg-violet-50 focus-visible:ring-2 focus-visible:ring-violet-400 dark:hover:border-violet-400/30 dark:hover:bg-violet-400/10")}>
                      {contents}<span className="sr-only"> (opens in a new tab)</span>
                    </a> : <span key={source.id} data-thinking-source={source.id} className={chipClass}>{contents}</span>;
                  })}
                  {remaining > 0 && <button ref={sourcesTriggerRef} type="button" aria-expanded={showAllSources} aria-label={showAllSources ? "Show fewer sources" : `Show ${remaining} more sources`} onClick={() => setShowAllSources(!showAllSources)} className="min-h-7 cursor-pointer rounded-lg px-2 py-1 text-[11px] leading-4 text-zinc-500 outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-violet-400 dark:hover:bg-white/5 dark:hover:text-zinc-200">{showAllSources ? "Show less" : `+${remaining} more`}</button>}
                </div>}
              </div>
            </li>
            {steps.map((step, index) => <li key={step.id} data-thinking-row={`step-${step.id}`} className="relative grid grid-cols-[14px_minmax(0,1fr)] items-start gap-x-2.5 pb-3">
              <span aria-hidden="true" className="absolute top-4 bottom-0 left-[6px] w-px bg-zinc-200 dark:bg-white/[0.09]" />
              <span aria-hidden="true" data-thinking-active={status === "thinking" && index === steps.length - 1 ? "true" : undefined} className={cn("mx-auto mt-2 size-1.5 rounded-full", status === "thinking" && index === steps.length - 1 ? "bg-violet-500 dark:bg-violet-400" : "bg-zinc-300 dark:bg-zinc-600")} />
              <span className="min-w-0 break-words">{step.label}</span>
            </li>)}
            {status !== "thinking" && <li data-thinking-row="result" className="grid grid-cols-[14px_minmax(0,1fr)] items-start gap-x-2.5">
              {status === "complete" ? <span aria-hidden="true" className="mt-0.5 flex size-3.5 items-center justify-center rounded-full bg-violet-500 dark:bg-violet-400"><Check className="size-2.5 text-white dark:text-zinc-950" strokeWidth={3} /></span> : <TriangleAlert aria-hidden="true" className="mt-0.5 size-3.5 text-amber-600 dark:text-amber-400" />}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">{status === "complete" ? completionLabel : errorMessage}</span>
            </li>}
          </ol>
        </div>
      </div>
      <span role={status === "error" ? "alert" : "status"} aria-atomic="true" className="sr-only">{status === "complete" ? completionLabel : status === "error" ? errorMessage : steps.at(-1)?.label ?? "Searching sources"}</span>
    </div>
  );
}
