"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight, Check, ReceiptText, RotateCcw } from "lucide-react";
import {
  Toaster,
  type ToastItem,
  type ToastDismissReason,
} from "@/registry/ui/toaster";
import { CustomizationRange } from "./customization-controls";
import { SegmentedControl } from "./segmented-control";

export const TOASTER_DEFAULT_CONFIG = {
  stiffness: 240,
  damping: 28,
  duration: 5,
  width: 440,
  layout: "grid" as "grid" | "stack",
  failActions: false,
  replayKey: 0,
};

export type ToasterConfig = typeof TOASTER_DEFAULT_CONFIG;
type Detail = "storage" | "deployment" | null;

function previewAction(signal: AbortSignal, fail: boolean) {
  return new Promise<void>((resolve, reject) => {
    const cancel = () => {
      delay.kill();
      reject(new DOMException("Preview action cancelled", "AbortError"));
    };
    const delay = gsap.delayedCall(0.7, () => {
      signal.removeEventListener("abort", cancel);
      if (fail) reject(new Error("Demo action failure"));
      else resolve();
    });
    if (signal.aborted) cancel();
    else signal.addEventListener("abort", cancel, { once: true });
  });
}

export function ToasterDemo({
  config = TOASTER_DEFAULT_CONFIG,
}: {
  config?: ToasterConfig;
}) {
  const [generation, setGeneration] = useState(config.replayKey);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [running, setRunning] = useState(config.replayKey > 0);
  const [feedback, setFeedback] = useState("");
  const [detail, setDetail] = useState<Detail>(null);
  const [storageUpgraded, setStorageUpgraded] = useState(false);
  const replayRef = useRef<HTMLButtonElement>(null);
  const toasterRef = useRef<HTMLDivElement>(null);
  const id = (value: string) => `${generation}-${value}`;
  const duration = running ? config.duration * 1000 : 0;
  const showDetails = (value: Detail) => {
    setDetail(value);
    setFeedback(
      value === "storage"
        ? "Storage breakdown opened below."
        : "Deployment report opened below.",
    );
  };
  const items: ToastItem[] = [
    {
      id: id("saved"),
      title: "Changes saved",
      description: "Your workspace preferences are up to date.",
      duration,
      action: {
        label: "Undo",
        onClick: () =>
          setFeedback(
            "Changes undone. Your previous preferences have been restored in this preview.",
          ),
      },
    },
    {
      id: id("countdown"),
      title: "Changes saved",
      description: "Everything is right where you left it.",
      tone: "info",
      duration,
      countdownLabel: "This message will close in",
      footer: `${config.duration}-second countdown · Replay to start`,
      action: {
        label: "Undo",
        onClick: () => setFeedback("Save undone in this preview."),
      },
    },
    {
      id: id("deleted"),
      title: "Invoice deleted",
      description: "INV-2026-0412 moved to trash.",
      tone: "danger",
      duration,
      countdownLabel: "Permanently deleted in",
      footer: `${config.duration}-second undo window · Replay to start`,
      action: {
        label: "Undo",
        onClick: () =>
          setFeedback(
            "Invoice INV-2026-0412 restored from trash in this preview.",
          ),
      },
    },
    {
      id: id("invoice"),
      title: "Invoice INV-0412 from Acme Inc.",
      description: "€1,240 · in 3 days",
      date: { month: "Nov", day: "15" },
      actionPlacement: "footer",
      action: {
        label: "Pay invoice",
        onClick: async (signal) => {
          await previewAction(signal, config.failActions);
          if (!signal.aborted)
            setFeedback(
              "Demo invoice marked as paid. No payment was collected.",
            );
        },
        errorMessage:
          "Demo payment failed. Turn off Simulate action failure and try again.",
      },
    },
    {
      id: id("storage"),
      dismiss: storageUpgraded ? "action" : undefined,
      title: "Your workspace has used 95% of its available storage",
      description:
        "Uploads, syncing and backups will stop once storage is full. Free up space or upgrade your plan.",
      tone: "danger",
      icon: null,
      badges: ["Storage limit warning", "47.5 / 50 GB"],
      footer: "Keep your workspace moving",
      actionPlacement: "footer",
      action: {
        label: "Review storage",
        onClick: () => showDetails("storage"),
        dismissOnSuccess: false,
      },
    },
    {
      id: id("deployment"),
      title: "Production deploy finished for api-gateway v2.4.1",
      description:
        "All 12 services passed their health checks. The rollout took 3 minutes 42 seconds, with no errors reported.",
      icon: null,
      tone: "info",
      badges: ["Production", "v2.4.1", "3m 42s"],
      action: {
        label: "View deployment",
        onClick: () => showDetails("deployment"),
        dismissOnSuccess: false,
      },
    },
  ];

  const dismiss = (toastId: string, reason: ToastDismissReason) => {
    setDismissed((current) => [...current, toastId]);
    if (reason !== "action") {
      const title =
        items.find((item) => item.id === toastId)?.title ?? "Notification";
      setFeedback(
        reason === "timeout"
          ? `${title}: countdown completed.`
          : `${title} dismissed.`,
      );
    }
  };

  const replay = () => {
    setGeneration((current) => current + 1);
    setDismissed([]);
    setRunning(true);
    setDetail(null);
    setStorageUpgraded(false);
    setFeedback(
      "Notifications replayed. Hover or focus a card to pause its countdown.",
    );
  };

  return (
    <div
      data-slot="toaster-demo"
      className="@container h-full w-full overflow-auto"
    >
      <div className="mx-auto flex min-h-full w-full max-w-[1060px] flex-col justify-center px-4 py-10 @min-[600px]:px-10">
        <div
          className="mx-auto w-full"
          style={{
            maxWidth: config.layout === "stack" ? config.width : undefined,
          }}
        >
          <Toaster
            ref={toasterRef}
            items={items.filter((item) => !dismissed.includes(item.id))}
            onDismiss={dismiss}
            stiffness={config.stiffness}
            damping={config.damping}
            className={
              config.layout === "grid"
                ? "grid max-w-none grid-cols-1 items-start gap-5 @min-[760px]:grid-cols-2"
                : "max-w-none"
            }
          />
        </div>
        {dismissed.length === items.length && (
          <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
            <Check
              size={24}
              className="mx-auto mb-3 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-sm">All caught up.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your notifications are clear.
            </p>
            <button
              ref={replayRef}
              type="button"
              onClick={replay}
              className="mt-4 min-h-9 cursor-pointer rounded-full border border-border px-4 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
            >
              Replay notifications
            </button>
          </div>
        )}
        <div role="status" className="sr-only">
          {feedback}
        </div>
        {detail && (
          <div
            className="mt-4 rounded-xl border border-border bg-card p-5"
            role="region"
            aria-label={
              detail === "storage" ? "Storage details" : "Deployment details"
            }
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-medium">
                {detail === "storage" ? (
                  <ReceiptText size={15} />
                ) : (
                  <ArrowUpRight size={15} />
                )}
                {detail === "storage"
                  ? "Workspace storage"
                  : "Deployment report"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setDetail(null);
                  (replayRef.current ?? toasterRef.current)?.focus();
                }}
                className="min-h-8 cursor-pointer rounded px-2 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
              >
                Close details
              </button>
            </div>
            {detail === "storage" ? (
              <>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  Files: 32 GB · Backups: 12 GB · Media: 3.5 GB
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[95%] rounded-full bg-amber-500" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStorageUpgraded(true);
                    setDetail(null);
                    setFeedback(
                      "Demo plan upgraded to 100 GB. Storage is now at 47.5%; no charge was made.",
                    );
                    (replayRef.current ?? toasterRef.current)?.focus();
                  }}
                  className="mt-4 min-h-9 cursor-pointer rounded-lg bg-foreground px-3 text-xs text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2"
                >
                  Apply demo upgrade
                </button>
              </>
            ) : (
              <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-xs">
                <dt className="text-muted-foreground">Environment</dt>
                <dd>Production</dd>
                <dt className="text-muted-foreground">Version</dt>
                <dd>v2.4.1</dd>
                <dt className="text-muted-foreground">Health checks</dt>
                <dd>12 of 12 passed</dd>
                <dt className="text-muted-foreground">Duration</dt>
                <dd>3 minutes 42 seconds</dd>
              </dl>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ToasterControls({
  config,
  onChange,
}: {
  config: ToasterConfig;
  onChange: (config: ToasterConfig) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
          Toaster
        </span>
        <button
          type="button"
          onClick={() => onChange({ ...TOASTER_DEFAULT_CONFIG })}
          className="flex min-h-8 cursor-pointer items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
        >
          <RotateCcw size={11} />
          Reset settings
        </button>
      </div>
      <button
        type="button"
        onClick={() => onChange({ ...config, replayKey: config.replayKey + 1 })}
        className="flex min-h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border text-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
      >
        <RotateCcw size={13} aria-hidden="true" />
        Replay notifications
      </button>
      <SegmentedControl
        options={[
          { value: "grid", label: "Gallery" },
          { value: "stack", label: "Stack" },
        ]}
        value={config.layout}
        onChange={(layout) => onChange({ ...config, layout })}
      />
      {(
        [
          {
            key: "stiffness",
            label: "Spring stiffness",
            min: 80,
            max: 500,
            step: 10,
          },
          {
            key: "damping",
            label: "Spring damping",
            min: 16,
            max: 50,
            step: 1,
          },
          {
            key: "duration",
            label: "Countdown seconds",
            min: 3,
            max: 15,
            step: 1,
          },
          { key: "width", label: "Stack width", min: 280, max: 520, step: 10 },
        ] as const
      )
        .filter(({ key }) => key !== "width" || config.layout === "stack")
        .map(({ key, label, ...range }) => (
          <label key={key} className="block text-[11px] text-muted-foreground">
            <span className="flex justify-between">
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
        Simulate action failure
        <input
          type="checkbox"
          checked={Boolean(config.failActions)}
          onChange={(event) =>
            onChange({ ...config, failActions: event.target.checked })
          }
          className="size-4 accent-orange-500"
        />
      </label>
      <p className="text-[11px] leading-5 text-muted-foreground">
        240 stiffness and 28 damping give a quick, soft landing. Changes apply
        to the next motion. Reduced motion follows your device preference.
      </p>
    </div>
  );
}
