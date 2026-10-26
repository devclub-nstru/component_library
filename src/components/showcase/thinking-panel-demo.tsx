"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RotateCcw } from "lucide-react";
import {
  ThinkingPanel,
  type ThinkingSource,
  type ThinkingStep,
} from "@/registry/ui/thinking-panel";
import { CustomizationRange } from "./customization-controls";
import { ThinkingSourceLogo } from "./thinking-panel-logos";

gsap.registerPlugin(useGSAP);

export const THINKING_PANEL_DEFAULT_CONFIG = {
  width: 440,
  stiffness: 380,
  damping: 34,
  speed: 1,
  visibleSources: 4,
  defaultExpanded: true,
  showError: false,
  resetKey: 0,
};

export type ThinkingPanelConfig = typeof THINKING_PANEL_DEFAULT_CONFIG;

const sources: readonly ThinkingSource[] = [
  {
    id: "slack",
    label: "Slack – #team-offsite",
    href: "https://slack.com",
    icon: <ThinkingSourceLogo brand="slack" />,
  },
  {
    id: "x",
    label: "X – @lisbonguide",
    href: "https://x.com",
    icon: <ThinkingSourceLogo brand="x" />,
  },
  {
    id: "notion",
    label: "Notion – Offsite plan",
    href: "https://www.notion.so",
    icon: <ThinkingSourceLogo brand="notion" />,
  },
  {
    id: "wikipedia",
    label: "Wikipedia – Lisbon",
    href: "https://en.wikipedia.org/wiki/Lisbon",
    icon: <ThinkingSourceLogo brand="wikipedia" />,
  },
  {
    id: "flights",
    label: "Google Flights – LIS",
    href: "https://www.google.com/travel/flights",
    icon: <ThinkingSourceLogo brand="google" />,
  },
  {
    id: "booking",
    label: "Booking.com – Lisbon",
    href: "https://www.booking.com",
    icon: <ThinkingSourceLogo brand="booking" />,
  },
  {
    id: "airbnb",
    label: "Airbnb – Alfama",
    href: "https://www.airbnb.com",
    icon: <ThinkingSourceLogo brand="airbnb" />,
  },
];

const steps: readonly ThinkingStep[] = [
  { id: "reading", label: "Reading 7 sources about the trip" },
  { id: "comparing", label: "Comparing flights and hotels" },
  { id: "calendar", label: "Checking dates against the team calendar" },
  { id: "drafting", label: "Drafting the offsite agenda" },
];

function ThinkingPanelPlayback({ config }: { config: ThinkingPanelConfig }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [sourceCount, setSourceCount] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [complete, setComplete] = useState(false);

  useGSAP(
    () => {
      const timeline = gsap.timeline();
      timeline.call(() => setSourceCount(sources.length), [], 0.6);
      steps.forEach((_, index) =>
        timeline.call(() => setStepCount(index + 1), [], 1.6 + index * 1.3),
      );
      timeline.call(() => setComplete(true), [], 7);
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="flex w-full justify-center">
      <ThinkingPanel
        {...config}
        sources={sources.slice(0, sourceCount)}
        steps={steps.slice(0, stepCount)}
        status={
          complete ? (config.showError ? "error" : "complete") : "thinking"
        }
        errorMessage="Couldn’t finish the search. Replay to try again."
      />
    </div>
  );
}

export function ThinkingPanelDemo({
  config = THINKING_PANEL_DEFAULT_CONFIG,
}: {
  config?: ThinkingPanelConfig;
}) {
  const [replay, setReplay] = useState(0);
  return (
    <div
      data-slot="thinking-panel-demo"
      className="flex min-h-[440px] w-full flex-col items-center justify-center gap-6 px-4 py-10 sm:px-8"
    >
      <ThinkingPanelPlayback
        key={`${config.resetKey}-${replay}`}
        config={config}
      />
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
        <span>Simulated activity · no searches are performed</span>
        <button
          type="button"
          onClick={() => setReplay((value) => value + 1)}
          className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md px-2 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <RotateCcw aria-hidden="true" className="size-3" />
          Replay
        </button>
      </div>
    </div>
  );
}

const ranges = [
  { key: "width", label: "Panel width", min: 280, max: 640, step: 10 },
  { key: "stiffness", label: "Spring stiffness", min: 120, max: 600, step: 10 },
  { key: "damping", label: "Spring damping", min: 20, max: 60, step: 1 },
  { key: "speed", label: "Motion speed", min: 0.5, max: 2, step: 0.1 },
  { key: "visibleSources", label: "Visible sources", min: 1, max: 7, step: 1 },
] as const;

export function ThinkingPanelControls({
  config,
  onChange,
}: {
  config: ThinkingPanelConfig;
  onChange: (config: ThinkingPanelConfig) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          Thinking panel
        </span>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...THINKING_PANEL_DEFAULT_CONFIG,
              resetKey: config.resetKey + 1,
            })
          }
          className="flex min-h-9 cursor-pointer items-center gap-1 text-[10px] text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <RotateCcw aria-hidden="true" className="size-3" />
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
      {(
        [
          ["defaultExpanded", "Start expanded"],
          ["showError", "Simulate interrupted search"],
        ] as const
      ).map(([key, label]) => (
        <label
          key={key}
          className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground"
        >
          {label}
          <input
            type="checkbox"
            checked={config[key]}
            onChange={(event) =>
              onChange({
                ...config,
                [key]: event.target.checked,
                resetKey: config.resetKey + 1,
              })
            }
            className="size-4 cursor-pointer accent-violet-500"
          />
        </label>
      ))}
    </div>
  );
}
