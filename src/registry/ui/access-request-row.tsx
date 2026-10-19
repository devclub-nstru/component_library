"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check, LoaderCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AccessDecision,
  AccessRequestEntry,
} from "./access-request-state";

gsap.registerPlugin(useGSAP);

interface AccessRequestRowProps {
  entry: AccessRequestEntry;
  expanded: boolean;
  disabled: boolean;
  reduced: boolean;
  onDecision: (decision: AccessDecision) => void;
  onExit: () => void;
}

const actionClass =
  "relative flex min-h-7 min-w-14 cursor-pointer items-center justify-center gap-1 rounded-full border px-2.5 text-[11px] leading-4 font-medium outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-wait disabled:opacity-50 pointer-coarse:min-h-10 dark:focus-visible:ring-offset-[#171717]";

export function AccessRequestRow({
  entry,
  expanded,
  disabled,
  reduced,
  onDecision,
  onExit,
}: AccessRequestRowProps) {
  const rowRef = useRef<HTMLLIElement>(null);
  const callbacksRef = useRef(onExit);
  const { person, phase, decision, error } = entry;
  const leaving = phase === "decided" || phase === "removing";
  const busy = phase === "pending";

  useGSAP(
    () => {
      callbacksRef.current = onExit;
    },
    { dependencies: [onExit] },
  );

  useGSAP(
    () => {
      const face = rowRef.current?.querySelector("[data-request-face]");
      if (!face) return;
      const duration = reduced ? 0 : 0.18;
      if (leaving) {
        const timeline = gsap.timeline({
          onComplete: () => callbacksRef.current(),
        });
        timeline.to(
          face,
          {
            x: reduced ? 0 : decision === "approved" ? 10 : -10,
            autoAlpha: 0,
            scale: reduced ? 1 : 0.98,
            duration: expanded ? duration : 0,
            ease: "power2.in",
          },
          expanded && phase === "decided" && !reduced ? 0.25 : 0,
        );
        return;
      }
      gsap.to(face, {
        x: 0,
        autoAlpha: 1,
        scale: 1,
        duration,
        overwrite: "auto",
      });
      if (busy && expanded && !reduced)
        gsap.to("[data-request-spinner]", {
          rotation: 360,
          duration: 0.8,
          repeat: -1,
          ease: "none",
        });
    },
    {
      dependencies: [phase, decision, expanded, reduced],
      scope: rowRef,
      revertOnUpdate: true,
    },
  );

  return (
    <li
      ref={rowRef}
      data-request-row={person.id}
      data-phase={phase}
      className="relative min-w-0 list-none"
      aria-busy={busy}
    >
      <div
        data-request-face
        className="grid min-h-14 grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-x-2.5 px-4 py-2"
      >
        <span data-request-anchor className="size-8" aria-hidden="true" />
        <div className="min-w-0">
          <p
            className="truncate text-[12px] leading-5 font-medium"
            title={person.name}
          >
            {person.name}
          </p>
          {person.description && (
            <p
              className="truncate text-[10px] leading-4 text-zinc-500 dark:text-zinc-400"
              title={person.description}
            >
              {person.description}
            </p>
          )}
        </div>
        {phase === "decided" ? (
          <span
            className={cn(
              "flex items-center gap-1.5 text-[11px] font-medium",
              decision === "approved"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-zinc-500 dark:text-zinc-400",
            )}
          >
            {decision === "approved" ? (
              <Check size={13} aria-hidden="true" />
            ) : (
              <X size={13} aria-hidden="true" />
            )}
            {decision === "approved" ? "Approved" : "Declined"}
          </span>
        ) : (
          <div className="flex items-center gap-1.5">
            {(["approved", "declined"] as const).map((value) => (
              <button
                key={value}
                type="button"
                disabled={busy || disabled || leaving}
                aria-label={`${value === "approved" ? "Approve" : "Decline"} ${person.name}`}
                onClick={() => onDecision(value)}
                className={cn(
                  actionClass,
                  value === "approved"
                    ? "border-transparent bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/15"
                    : "border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100",
                )}
              >
                {busy && decision === value ? (
                  <LoaderCircle
                    data-request-spinner
                    size={12}
                    aria-hidden="true"
                  />
                ) : value === "approved" ? (
                  "Approve"
                ) : (
                  "Decline"
                )}
              </button>
            ))}
          </div>
        )}
        {error && (
          <p
            role="alert"
            className="col-start-2 col-end-4 pt-1.5 text-[11px] leading-4 text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    </li>
  );
}
