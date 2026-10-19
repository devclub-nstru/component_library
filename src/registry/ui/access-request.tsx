"use client";

import {
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
  type Ref,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check, ChevronDown, ShieldCheck, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { AccessRequestRow } from "./access-request-row";
import {
  accessRequestReducer,
  createAccessRequestState,
  type AccessDecision,
  type AccessRequester,
  type AccessRequestEntry,
} from "./access-request-state";
import { useAccessRequestMotion } from "./use-access-request-motion";

export type { AccessDecision, AccessRequester } from "./access-request-state";

gsap.registerPlugin(useGSAP);

export interface AccessRequestProps {
  requests: readonly AccessRequester[];
  onDecision: (
    person: AccessRequester,
    decision: AccessDecision,
    signal: AbortSignal,
  ) => void | Promise<void>;
  onResolved?: (person: AccessRequester, decision: AccessDecision) => void;
  onDismiss?: () => void;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  disabled?: boolean;
  width?: number;
  stiffness?: number;
  damping?: number;
  speed?: number;
  errorMessage?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

const controlClass =
  "flex size-8 cursor-pointer items-center justify-center rounded-lg text-zinc-500 outline-none hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-500 disabled:pointer-events-none pointer-coarse:size-10 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white dark:focus-visible:ring-zinc-400";
const colors = ["#ede9fe", "#ffe4e6", "#fef9c3", "#dcfce7"];

function RequestAvatar({
  person,
  index,
  expanded,
  count,
}: {
  person: AccessRequester;
  index: number;
  expanded: boolean;
  count: number;
}) {
  const [initialIndex] = useState(index);
  const colorIndex =
    Array.from(person.id).reduce(
      (total, letter) => total + letter.charCodeAt(0),
      0,
    ) % colors.length;
  return (
    <div
      data-request-avatar={person.id}
      className="absolute top-0 left-0"
      style={{
        transform: `translate(${expanded ? 16 : 16 + initialIndex * 21}px, ${expanded ? 81 + initialIndex * 56 : 16}px)`,
        opacity: expanded || initialIndex < 2 ? 1 : 0,
        zIndex: count - index + 1,
      }}
    >
      <Avatar className="size-8 border-2 border-white dark:border-[#171717]">
        {person.avatar && (
          <AvatarImage src={person.avatar} alt="" className="object-cover" />
        )}
        <AvatarFallback
          className={cn(
            "text-[11px] font-semibold text-zinc-800",
            person.emoji && "text-[20px]",
          )}
          style={{ backgroundColor: person.color ?? colors[colorIndex] }}
        >
          {person.emoji ??
            person.name
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((word) => word[0])
              .join("")}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

export function AccessRequest({
  requests,
  onDecision,
  onResolved,
  onDismiss,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  disabled = false,
  width = 360,
  stiffness = 420,
  damping = 28,
  speed = 1,
  errorMessage = "Couldn’t save this decision. Please try again.",
  className,
  ref,
}: AccessRequestProps) {
  const [state, dispatch] = useReducer(
    accessRequestReducer,
    requests,
    createAccessRequestState,
  );
  const [ownExpanded, setOwnExpanded] = useState(defaultExpanded);
  const [dismissing, setDismissing] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [initialExpanded] = useState(expanded ?? defaultExpanded);
  const [initialCount] = useState(state.entries.length);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pendingRef = useRef(new Map<string, AbortController>());
  const decisionFocusRef = useRef(new Set<string>());
  const nextFocusRef = useRef<number | null>(null);
  const callbacksRef = useRef({ onResolved, onDismiss });
  const dismissingRef = useRef(false);
  const uid = useId();
  const isOpen = expanded ?? ownExpanded;
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const count = state.entries.length;
  const pendingCount = state.entries.filter(
    (entry) => entry.phase === "pending",
  ).length;
  const reviewed = state.approved + state.declined;
  const first = state.entries[0]?.person;
  const summary = first
    ? `${first.handle ? `@${first.handle.replace(/^@/, "")}` : first.name}${count > 1 ? ` and ${count - 1} ${count === 2 ? "other" : "others"}` : ""}`
    : "All caught up";
  const signature = JSON.stringify(
    state.entries.map((entry) => [entry.person.id, entry.phase, entry.error]),
  );
  const size = Number.isFinite(width)
    ? Math.min(480, Math.max(280, width))
    : 360;

  useAccessRequestMotion({
    rootRef,
    panelRef,
    contentRef,
    signature,
    expanded: isOpen,
    stiffness,
    damping,
    speed,
    enabled: !dismissed,
  });
  const { contextSafe } = useGSAP({ scope: rootRef });

  useGSAP(
    () => {
      callbacksRef.current = { onResolved, onDismiss };
    },
    { dependencies: [onResolved, onDismiss] },
  );

  useEffect(() => {
    dispatch({ type: "sync", requests });
  }, [requests]);

  useEffect(() => {
    for (const [id, controller] of pendingRef.current) {
      const entry = state.entries.find((item) => item.person.id === id);
      if (!entry || entry.phase === "removing") {
        controller.abort();
        pendingRef.current.delete(id);
      }
    }
  }, [state.entries]);

  useEffect(() => {
    const pending = pendingRef.current;
    return () => {
      for (const controller of pending.values()) controller.abort();
      pending.clear();
    };
  }, []);

  useGSAP(
    () => {
      if (nextFocusRef.current === null) return;
      const rows = Array.from(
        contentRef.current?.querySelectorAll<HTMLElement>(
          "[data-request-row]",
        ) ?? [],
      );
      const row = rows[Math.min(nextFocusRef.current, rows.length - 1)];
      (isOpen
        ? (row?.querySelector<HTMLButtonElement>("button:not(:disabled)") ??
          triggerRef.current)
        : triggerRef.current
      )?.focus({ preventScroll: true });
      nextFocusRef.current = null;
    },
    { scope: rootRef, dependencies: [signature, isOpen] },
  );

  const changeExpanded = (next: boolean) => {
    if (dismissingRef.current) return;
    if (expanded === undefined) setOwnExpanded(next);
    onExpandedChange?.(next);
    if (!next) triggerRef.current?.focus({ preventScroll: true });
  };

  const decide = async (
    entry: AccessRequestEntry,
    decision: AccessDecision,
  ) => {
    const { person } = entry;
    if (
      disabled ||
      dismissingRef.current ||
      entry.phase !== "idle" ||
      pendingRef.current.has(person.id)
    )
      return;
    const controller = new AbortController();
    pendingRef.current.set(person.id, controller);
    const row = Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>("[data-request-row]") ??
        [],
    ).find((element) => element.dataset.requestRow === person.id);
    if (row?.contains(document.activeElement))
      decisionFocusRef.current.add(person.id);
    dispatch({ type: "begin", id: person.id, decision });
    setAnnouncement(
      `${decision === "approved" ? "Approving" : "Declining"} ${person.name}.`,
    );
    try {
      await onDecision(person, decision, controller.signal);
      if (controller.signal.aborted) return;
      dispatch({ type: "resolve", id: person.id, decision });
      setAnnouncement(`${person.name} ${decision}.`);
    } catch {
      if (!controller.signal.aborted) {
        dispatch({ type: "reject", id: person.id, message: errorMessage });
        setAnnouncement(
          `Decision for ${person.name} failed. Please try again.`,
        );
        if (
          decisionFocusRef.current.has(person.id) &&
          document.activeElement === document.body
        )
          nextFocusRef.current = state.entries.findIndex(
            (item) => item.person.id === person.id,
          );
      }
    } finally {
      if (pendingRef.current.get(person.id) === controller)
        pendingRef.current.delete(person.id);
    }
  };

  const finish = (entry: AccessRequestEntry) => {
    const rows = Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>("[data-request-row]") ??
        [],
    );
    const row = rows.find(
      (element) => element.dataset.requestRow === entry.person.id,
    );
    if (
      row?.contains(document.activeElement) ||
      (decisionFocusRef.current.has(entry.person.id) &&
        document.activeElement === document.body)
    )
      nextFocusRef.current = state.entries.findIndex(
        (item) => item.person.id === entry.person.id,
      );
    decisionFocusRef.current.delete(entry.person.id);
    dispatch({ type: "remove", id: entry.person.id });
    if (entry.phase === "decided" && entry.decision)
      callbacksRef.current.onResolved?.(entry.person, entry.decision);
  };

  const dismiss = () =>
    contextSafe(() => {
      if (dismissingRef.current) return;
      dismissingRef.current = true;
      setDismissing(true);
      for (const [id, controller] of pendingRef.current) {
        controller.abort();
        dispatch({ type: "reject", id, message: "Decision cancelled." });
      }
      pendingRef.current.clear();
      gsap.to(rootRef.current, {
        autoAlpha: 0,
        y: reduced ? 0 : -8,
        scale: reduced ? 1 : 0.97,
        duration: reduced ? 0 : 0.18,
        ease: "power2.in",
        overwrite: "auto",
        onComplete: () => {
          setDismissed(true);
          callbacksRef.current.onDismiss?.();
        },
      });
    })();

  if (dismissed) return null;

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      data-slot="access-request"
      data-expanded={isOpen}
      role="region"
      aria-labelledby={`${uid}-heading`}
      className={cn(
        "relative max-w-full overflow-hidden rounded-[20px] border border-zinc-200 bg-white text-zinc-900 shadow-[0_8px_30px_-12px_#00000020] dark:border-white/[0.07] dark:bg-[#171717] dark:text-zinc-100 dark:shadow-[0_8px_30px_-12px_#00000050]",
        className,
      )}
      style={{ width: size }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          if (isOpen) changeExpanded(false);
          else dismiss();
        }
      }}
    >
      <div className="relative h-16">
        <button
          type="button"
          data-request-compact
          aria-expanded={isOpen}
          aria-controls={`${uid}-panel`}
          aria-label={
            count
              ? `Review ${count} access ${count === 1 ? "request" : "requests"}`
              : "Review completed requests"
          }
          aria-hidden={isOpen}
          inert={isOpen || dismissing}
          tabIndex={isOpen ? -1 : 0}
          onClick={() => changeExpanded(true)}
          className="absolute inset-y-0 left-0 right-20 cursor-pointer rounded-l-[20px] text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-400"
          style={{ opacity: initialExpanded ? 0 : 1 }}
        >
          <span
            data-request-summary
            className="absolute inset-y-0 left-0 flex min-w-0 flex-col justify-center"
            style={{
              transform: `translateX(${initialCount > 2 ? 108 : initialCount > 1 ? 84 : initialCount ? 60 : 58}px)`,
            }}
          >
            <span className="truncate text-[12px] leading-5 font-medium">
              {summary}
            </span>
            <span className="truncate text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">
              {pendingCount
                ? `Reviewing ${pendingCount} ${pendingCount === 1 ? "request" : "requests"}…`
                : count
                  ? "requested access"
                  : `${reviewed} ${reviewed === 1 ? "request" : "requests"} reviewed`}
            </span>
          </span>
        </button>
        <h3
          id={`${uid}-heading`}
          data-request-heading
          className="pointer-events-none absolute top-[22px] left-4 text-[13px] leading-5 font-medium"
          style={{ opacity: initialExpanded ? 1 : 0 }}
        >
          Access requests
        </h3>
        <div className="absolute top-4 right-11 pointer-coarse:top-3">
          <button
            ref={triggerRef}
            type="button"
            aria-label={
              isOpen ? "Collapse access requests" : "Expand access requests"
            }
            aria-expanded={isOpen}
            aria-controls={`${uid}-panel`}
            disabled={dismissing}
            onClick={() => changeExpanded(!isOpen)}
            className={controlClass}
          >
            <ChevronDown
              data-request-chevron
              size={17}
              aria-hidden="true"
              style={{
                transform: initialExpanded ? "rotate(180deg)" : undefined,
              }}
            />
          </button>
        </div>
        <div className="absolute top-4 right-2 pointer-coarse:top-3">
          <button
            type="button"
            aria-label="Dismiss access requests"
            onClick={dismiss}
            disabled={dismissing}
            className={controlClass}
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        ref={panelRef}
        id={`${uid}-panel`}
        inert={!isOpen || dismissing}
        aria-hidden={!isOpen}
        className="overflow-hidden"
        style={{ height: initialExpanded ? "auto" : 0 }}
      >
        <div ref={contentRef} style={{ opacity: initialExpanded ? 1 : 0 }}>
          <div className="mx-4 h-px bg-zinc-100 dark:bg-white/[0.07]" />
          {count ? (
            <ul className="relative py-2">
              {state.entries.map((entry) => (
                <AccessRequestRow
                  key={entry.person.id}
                  entry={entry}
                  expanded={isOpen}
                  disabled={disabled || dismissing}
                  reduced={reduced}
                  onDecision={(decision) => void decide(entry, decision)}
                  onExit={() => finish(entry)}
                />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center px-5 py-8 text-center">
              <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
                <ShieldCheck size={20} aria-hidden="true" />
              </span>
              <p className="text-[13px] font-medium">
                {reviewed
                  ? "Everyone’s accounted for."
                  : "No pending requests."}
              </p>
              <p className="mt-1.5 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
                {reviewed
                  ? `${state.approved} approved · ${state.declined} declined`
                  : "New access requests will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {state.entries.map(({ person }, index) => (
          <RequestAvatar
            key={person.id}
            person={person}
            index={index}
            expanded={initialExpanded}
            count={state.entries.length}
          />
        ))}
        <span
          data-request-overflow
          className="absolute top-0 left-0 flex size-8 items-center justify-center rounded-full bg-zinc-100 text-[12px] font-medium text-zinc-600 dark:bg-[#272727] dark:text-zinc-300"
          style={{
            transform: "translate(58px, 16px)",
            opacity: !initialExpanded && initialCount > 2 ? 1 : 0,
          }}
        >
          {Math.max(0, count - 2)}
        </span>
        {!count && (
          <span
            className="absolute top-4 left-4 flex size-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400"
            style={{ opacity: isOpen ? 0 : 1 }}
          >
            <Check size={17} />
          </span>
        )}
      </div>
      <span role="status" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}

export default AccessRequest;
