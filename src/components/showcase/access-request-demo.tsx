"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { RotateCcw } from "lucide-react";
import {
  AccessRequest,
  type AccessRequester,
  type AccessDecision,
} from "@/registry/ui/access-request";
import { CustomizationRange } from "./customization-controls";

export const ACCESS_REQUEST_DEFAULT_CONFIG = {
  width: 360,
  stiffness: 420,
  damping: 28,
  speed: 1,
  defaultExpanded: false,
  failDecisions: false,
  resetKey: 0,
};

export type AccessRequestConfig = typeof ACCESS_REQUEST_DEFAULT_CONFIG;

const initialRequests: readonly AccessRequester[] = [
  {
    id: "yash",
    name: "Yash Lunawat",
    handle: "yashlunawa",
    emoji: "👨🏻",
    color: "#c084fc",
  },
  {
    id: "piyush",
    name: "Piyush Yadav",
    handle: "piyushyadav",
    emoji: "🧔🏻",
    color: "#fb7185",
  },
  {
    id: "abhimanyu",
    name: "Abhimanyu",
    handle: "abhimanyu",
    emoji: "👨🏽‍💻",
    color: "#fde047",
  },
  {
    id: "yatharth",
    name: "Yatharth Khandelwal",
    handle: "yatharth",
    emoji: "👱🏻",
    color: "#bef264",
  },
];

function simulateDecision(signal: AbortSignal, fail: boolean) {
  return new Promise<void>((resolve, reject) => {
    const abort = () => {
      delay.kill();
      reject(new DOMException("Decision cancelled", "AbortError"));
    };
    const delay = gsap.delayedCall(0.65, () => {
      signal.removeEventListener("abort", abort);
      if (fail) reject(new Error("Preview failure"));
      else resolve();
    });
    if (signal.aborted) abort();
    else signal.addEventListener("abort", abort, { once: true });
  });
}

export function AccessRequestDemo({
  config = ACCESS_REQUEST_DEFAULT_CONFIG,
}: {
  config?: AccessRequestConfig;
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [dismissed, setDismissed] = useState(false);
  const [version, setVersion] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const restoreRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dismissed) restoreRef.current?.focus({ preventScroll: true });
    else if (version > 0)
      cardRef.current
        ?.querySelector<HTMLButtonElement>("button")
        ?.focus({ preventScroll: true });
  }, [dismissed, version]);

  const resolve = (person: AccessRequester, decision: AccessDecision) => {
    setRequests((current) =>
      current.filter((request) => request.id !== person.id),
    );
    setAnnouncement(`${person.name} ${decision} in this preview.`);
  };

  return (
    <div
      data-slot="access-request-demo"
      className="flex h-full min-h-110 w-full items-center justify-center overflow-auto p-4 sm:p-8"
    >
      <div className="flex min-h-90 w-full max-w-[480px] items-start justify-center pt-8">
        {dismissed ? (
          <button
            ref={restoreRef}
            type="button"
            onClick={() => {
              setVersion((current) => current + 1);
              setDismissed(false);
            }}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-5 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
          >
            <RotateCcw size={14} aria-hidden="true" />
            Show requests
          </button>
        ) : (
          <AccessRequest
            key={version}
            ref={cardRef}
            requests={requests}
            onDecision={(_person, _decision, signal) =>
              simulateDecision(signal, config.failDecisions)
            }
            onResolved={resolve}
            onDismiss={() => {
              setDismissed(true);
              setAnnouncement(
                "Request panel dismissed. Use Show requests to reopen it.",
              );
            }}
            defaultExpanded={config.defaultExpanded}
            width={config.width}
            stiffness={config.stiffness}
            damping={config.damping}
            speed={config.speed}
            errorMessage="Preview failed. Turn off Simulate failed decisions and try again."
          />
        )}
        <span role="status" className="sr-only">
          {announcement}
        </span>
      </div>
    </div>
  );
}

const ranges = [
  { key: "width", label: "Card width", min: 280, max: 480, step: 10 },
  { key: "stiffness", label: "Spring stiffness", min: 80, max: 600, step: 10 },
  { key: "damping", label: "Spring damping", min: 16, max: 60, step: 1 },
  { key: "speed", label: "Motion speed", min: 0.5, max: 2, step: 0.1 },
] as const;

export function AccessRequestControls({
  config,
  onChange,
}: {
  config: AccessRequestConfig;
  onChange: (config: AccessRequestConfig) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
          Access request
        </span>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...ACCESS_REQUEST_DEFAULT_CONFIG,
              resetKey: config.resetKey + 1,
            })
          }
          className="flex min-h-8 cursor-pointer items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
        >
          <RotateCcw size={11} aria-hidden="true" />
          Reset settings
        </button>
      </div>
      <button
        type="button"
        onClick={() => onChange({ ...config, resetKey: config.resetKey + 1 })}
        className="flex min-h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border text-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
      >
        <RotateCcw size={13} aria-hidden="true" />
        Reset requests
      </button>
      {ranges.map(({ key, label, ...range }) => (
        <label key={key} className="block text-[11px] text-muted-foreground">
          <span className="flex justify-between gap-3">
            {label}
            <span className="font-mono tabular-nums">{config[key]}</span>
          </span>
          <CustomizationRange
            {...range}
            aria-label={label}
            value={config[key]}
            onChange={(event) =>
              onChange({ ...config, [key]: Number(event.target.value) })
            }
          />
        </label>
      ))}
      <label className="flex cursor-pointer items-center justify-between gap-3 text-[11px] text-muted-foreground">
        Start expanded
        <input
          type="checkbox"
          checked={config.defaultExpanded}
          onChange={(event) =>
            onChange({
              ...config,
              defaultExpanded: event.target.checked,
              resetKey: config.resetKey + 1,
            })
          }
          className="size-4 accent-orange-500"
        />
      </label>
      <label className="flex cursor-pointer items-center justify-between gap-3 text-[11px] text-muted-foreground">
        Simulate failed decisions
        <input
          type="checkbox"
          checked={config.failDecisions}
          onChange={(event) =>
            onChange({ ...config, failDecisions: event.target.checked })
          }
          className="size-4 accent-orange-500"
        />
      </label>
      <p className="text-[11px] leading-5 text-muted-foreground">
        420 stiffness and 28 damping give the pill a firm, controlled settle.
        Click to unfold; Escape collapses it. Decisions only affect this
        preview. Closing preserves the remaining queue.
      </p>
    </div>
  );
}
