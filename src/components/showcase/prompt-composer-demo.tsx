"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RotateCcw } from "lucide-react";
import {
  PromptComposer,
  type PromptComposerSubmission,
} from "@/registry/ui/prompt-composer";
import { CustomizationRange } from "./customization-controls";

gsap.registerPlugin(useGSAP);

export const PROMPT_COMPOSER_DEFAULT_CONFIG = {
  width: 760,
  radius: 18,
  cardLift: 16,
  cardSpread: 10,
  speed: 1,
  stiffness: 360,
  damping: 32,
  accentColor: "#8662d9",
  placeholder: "Ask anything",
  defaultTrayOpen: true,
  demoVoice: true,
  disabled: false,
  failSend: false,
  resetKey: 0,
};

export type PromptComposerConfig = typeof PROMPT_COMPOSER_DEFAULT_CONFIG;

export function PromptComposerDemo({
  config = PROMPT_COMPOSER_DEFAULT_CONFIG,
}: {
  config?: PromptComposerConfig;
}) {
  const [lastSent, setLastSent] = useState<PromptComposerSubmission | null>(
    null,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: rootRef });

  return (
    <div
      ref={rootRef}
      data-slot="prompt-composer-demo"
      className="flex min-h-96 w-full flex-col items-center justify-center gap-6 px-4 py-16 sm:px-8"
    >
      <PromptComposer
        {...config}
        onSend={(prompt) =>
          contextSafe(async () => {
            await new Promise<void>((resolve) => {
              gsap.delayedCall(0.55, resolve);
            });
            if (config.failSend) throw new Error("Preview send failure");
            setLastSent(prompt);
          })()
        }
        errorMessage="Preview failed. Turn off Simulate failed sends and try again."
      />
      <div className="flex min-h-10 w-full max-w-190 flex-col items-center gap-1 text-center text-[11px] leading-5 text-muted-foreground">
        <p>Interactive preview · voice uses a sample transcript</p>
        <p role="status" className="max-w-full truncate px-2">
          {lastSent
            ? `Sent to ${lastSent.model}${lastSent.action ? ` · ${lastSent.action}` : ""}: ${lastSent.text}`
            : "Choose a card, type a message, or try voice mode."}
        </p>
      </div>
    </div>
  );
}

const ranges = [
  { key: "width", label: "Composer width", min: 320, max: 1000, step: 20 },
  { key: "radius", label: "Field radius", min: 10, max: 28, step: 1 },
  { key: "cardLift", label: "Card hover lift", min: 0, max: 32, step: 1 },
  { key: "cardSpread", label: "Neighbour spread", min: 0, max: 20, step: 1 },
  { key: "speed", label: "Motion speed", min: 0.5, max: 2, step: 0.1 },
  { key: "stiffness", label: "Spring stiffness", min: 120, max: 600, step: 10 },
  { key: "damping", label: "Spring damping", min: 18, max: 60, step: 1 },
] as const;

export function PromptComposerControls({
  config,
  onChange,
}: {
  config: PromptComposerConfig;
  onChange: (config: PromptComposerConfig) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          Prompt composer
        </span>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...PROMPT_COMPOSER_DEFAULT_CONFIG,
              resetKey: config.resetKey + 1,
            })
          }
          className="flex min-h-9 cursor-pointer items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <RotateCcw className="size-3" aria-hidden="true" />
          Reset settings
        </button>
      </div>
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
      <label className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
        Accent color
        <input
          type="color"
          aria-label="Composer accent color"
          value={config.accentColor}
          onChange={(event) =>
            onChange({ ...config, accentColor: event.target.value })
          }
          className="size-8 cursor-pointer rounded border border-border bg-transparent"
        />
      </label>
      <label className="block space-y-2 text-[11px] text-muted-foreground">
        <span>Placeholder</span>
        <input
          value={config.placeholder}
          onChange={(event) =>
            onChange({ ...config, placeholder: event.target.value })
          }
          className="min-h-10 w-full rounded-lg border border-border bg-transparent px-3 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        />
      </label>
      {(
        [
          ["defaultTrayOpen", "Start with cards open"],
          ["demoVoice", "Enable voice preview"],
          ["disabled", "Disable composer"],
          ["failSend", "Simulate failed sends"],
        ] as const
      ).map(([key, label]) => (
        <label
          key={key}
          className="flex min-h-8 cursor-pointer items-center justify-between gap-3 text-[11px] text-muted-foreground"
        >
          {label}
          <input
            type="checkbox"
            checked={config[key]}
            onChange={(event) =>
              onChange({
                ...config,
                [key]: event.target.checked,
                resetKey:
                  key === "defaultTrayOpen"
                    ? config.resetKey + 1
                    : config.resetKey,
              })
            }
            className="size-4 accent-orange-500"
          />
        </label>
      ))}
      <button
        type="button"
        onClick={() => onChange({ ...config, resetKey: config.resetKey + 1 })}
        className="flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border text-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      >
        <RotateCcw className="size-3.5" aria-hidden="true" />
        Replay entrance
      </button>
      <p className="text-[11px] leading-5 text-muted-foreground">
        Hover or focus a card to lift it. Escape removes the selected action;
        Backspace removes it when the field is empty. Voice preview never
        activates your microphone. Sends only update this preview.
      </p>
    </div>
  );
}
