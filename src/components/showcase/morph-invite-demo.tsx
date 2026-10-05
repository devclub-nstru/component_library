"use client";

import { useState } from "react";
import gsap from "gsap";
import { RotateCcw } from "lucide-react";
import { MorphInvite } from "@/registry/ui/morph-invite";
import { CustomizationRange } from "./customization-controls";
import { SegmentedControl } from "./segmented-control";

export const MORPH_INVITE_DEFAULT_CONFIG = {
  stiffness: 420,
  damping: 32,
  mass: 0.8,
  speed: 1,
  expandedWidth: 360,
  fail: false,
};

export type MorphInviteConfig = typeof MORPH_INVITE_DEFAULT_CONFIG;

export function MorphInviteDemo({ config }: { config: MorphInviteConfig }) {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-10 px-4 py-16 sm:px-8">
      <div className="text-center">
        <p className="text-sm font-medium tracking-tight text-foreground">Better together.</p>
        <p className="mt-1.5 text-xs text-muted-foreground">A little room for your next teammate.</p>
      </div>
      <div className="w-full max-w-lg pb-6">
        <MorphInvite
          key={resetKey}
          {...config}
          onInvite={(_email, signal) =>
            new Promise<void>((resolve, reject) => {
              const abort = () => {
                delay.kill();
                reject(new DOMException("Aborted", "AbortError"));
              };
              const delay = gsap.delayedCall(0.75, () => {
                signal.removeEventListener("abort", abort);
                if (config.fail) reject(new Error("Couldn’t send the invitation. Please try again."));
                else resolve();
              });
              signal.addEventListener("abort", abort, { once: true });
              if (signal.aborted) abort();
            })
          }
        />
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="text-[11px] text-muted-foreground">Local demo. No emails are sent.</p>
        <button
          type="button"
          onClick={() => setResetKey((current) => current + 1)}
          className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <RotateCcw className="size-3" aria-hidden="true" />
          Reset invites
        </button>
      </div>
    </div>
  );
}

const presets = {
  soft: { stiffness: 240, damping: 28, mass: 1 },
  smooth: { stiffness: 420, damping: 32, mass: 0.8 },
  snappy: { stiffness: 620, damping: 40, mass: 0.7 },
  bouncy: { stiffness: 320, damping: 20, mass: 0.8 },
};

const ranges = [
  { key: "stiffness", label: "Stiffness", min: 80, max: 800, step: 10 },
  { key: "damping", label: "Damping", min: 12, max: 80, step: 1 },
  { key: "mass", label: "Mass", min: 0.25, max: 3, step: 0.05 },
  { key: "speed", label: "Playback speed", min: 0.25, max: 3, step: 0.05 },
  { key: "expandedWidth", label: "Expanded width", min: 280, max: 560, step: 10 },
] as const;

export function MorphInviteControls({
  config,
  onChange,
}: {
  config: MorphInviteConfig;
  onChange: (config: MorphInviteConfig) => void;
}) {
  const preset = Object.entries(presets).find(([, item]) =>
    item.stiffness === config.stiffness && item.damping === config.damping && item.mass === config.mass,
  )?.[0] ?? "custom";

  return (
    <div className="flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Morph invite</h3>
          <p className="mt-1 text-xs text-muted-foreground">Tune the spring, then invite a teammate.</p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...MORPH_INVITE_DEFAULT_CONFIG })}
          className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs hover:bg-muted focus-visible:outline-2 focus-visible:outline-indigo-500"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />Reset
        </button>
      </div>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">Motion preset</legend>
        <SegmentedControl
          options={Object.keys(presets).map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) }))}
          value={preset}
          onChange={(value) => onChange({ ...config, ...presets[value as keyof typeof presets] })}
        />
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">
        {ranges.map((range) => (
          <label key={range.key} className="flex min-w-0 flex-col gap-2 rounded-xl border border-border/80 bg-background/40 p-3">
            <span className="flex items-center justify-between gap-2 text-xs">
              {range.label}<span className="font-mono text-muted-foreground">{config[range.key]}</span>
            </span>
            <CustomizationRange
              aria-label={range.label}
              min={range.min}
              max={range.max}
              step={range.step}
              value={config[range.key]}
              onChange={(event) => onChange({ ...config, [range.key]: Number(event.target.value) })}
            />
          </label>
        ))}
      </div>
      <fieldset>
        <legend className="mb-2 text-xs text-muted-foreground">Demo response</legend>
        <SegmentedControl
          options={[{ value: "success", label: "Succeeds" }, { value: "error", label: "Fails" }]}
          value={config.fail ? "error" : "success"}
          onChange={(value) => onChange({ ...config, fail: value === "error" })}
        />
      </fieldset>
    </div>
  );
}
