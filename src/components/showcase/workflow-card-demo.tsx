"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { WorkflowCard, WORKFLOW_SECTIONS, type WorkflowSection } from "@/registry/ui/workflow-card";
import { CustomizationRange } from "./customization-controls";
import { SegmentedControl } from "./segmented-control";

export const WORKFLOW_CARD_DEFAULT_CONFIG = {
  title: "Onboarding flow",
  description: "Make the first five minutes feel effortless.",
  dueDate: "Oct 24",
  width: 320,
  radius: 18,
  density: "comfortable" as "comfortable" | "compact",
  stiffness: 105,
  damping: 24,
  duration: 0.75,
  closeDelay: 0.24,
  accent: "#32966a",
  defaultExpanded: false,
  openOnHover: true,
  showAssignees: true,
  showDueDate: true,
  showFooter: true,
  showSectionLabels: true,
  showDescription: false,
  sectionCount: 2,
};

export type WorkflowCardConfig = typeof WORKFLOW_CARD_DEFAULT_CONFIG;

const extraSection: WorkflowSection = {
  id: "aftercare",
  label: "A thoughtful follow-up",
  tasks: [
    { id: "measure", label: "Check in on the experience", assigneeId: "mara" },
    { id: "learn", label: "Bring the learnings back", assigneeId: "priya" },
  ],
};

export function WorkflowCardDemo({
  config = WORKFLOW_CARD_DEFAULT_CONFIG,
  compact = false,
}: {
  config?: WorkflowCardConfig;
  compact?: boolean;
}) {
  const [sections, setSections] = useState([...WORKFLOW_SECTIONS, extraSection]);
  const { description, showDescription, sectionCount, ...appearance } = config;
  return (
    <div
      data-slot="workflow-demo"
      className={
        compact
          ? "flex min-h-56 w-full items-start justify-center p-4"
          : "flex h-full min-h-140 w-full items-center justify-center overflow-auto bg-background p-6"
      }
    >
      <div
        className={
          compact
            ? "flex w-full justify-center"
            : "flex min-h-110 w-full items-start justify-center pt-10"
        }
      >
        <WorkflowCard
          key={`${config.defaultExpanded}`}
          {...appearance}
          theme="system"
          width={compact ? 290 : config.width}
          defaultExpanded={compact || config.defaultExpanded}
          description={showDescription ? description : undefined}
          sections={sections.slice(0, sectionCount)}
          onSectionsChange={(next) =>
            setSections((current) => [...next, ...current.slice(sectionCount)])
          }
        />
      </div>
    </div>
  );
}

const ranges = [
  { key: "sectionCount", label: "Checklist sections", min: 1, max: 3, step: 1 },
  { key: "width", label: "Card width", min: 260, max: 480, step: 10 },
  { key: "radius", label: "Corner radius", min: 8, max: 28, step: 1 },
  { key: "stiffness", label: "Spring stiffness", min: 60, max: 240, step: 5 },
  { key: "damping", label: "Spring damping", min: 14, max: 36, step: 1 },
  { key: "duration", label: "Motion duration", min: 0.3, max: 1.2, step: 0.05 },
  {
    key: "closeDelay",
    label: "Hover close delay",
    min: 0,
    max: 0.6,
    step: 0.05,
  },
] as const;
const toggles = [
  { key: "defaultExpanded", label: "Start expanded" },
  { key: "openOnHover", label: "Unfold on hover / focus" },
  { key: "showDescription", label: "Project description" },
  { key: "showSectionLabels", label: "Section headings" },
  { key: "showAssignees", label: "Teammate filters" },
  { key: "showDueDate", label: "Due date" },
  { key: "showFooter", label: "Action footer" },
] as const;
const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40";

export function WorkflowCardControls({
  config,
  onChange,
}: {
  config: WorkflowCardConfig;
  onChange: (config: WorkflowCardConfig) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
          Workflow Card
        </span>
        <button
          type="button"
          onClick={() => onChange({ ...WORKFLOW_CARD_DEFAULT_CONFIG })}
          className="flex cursor-pointer items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
        >
          <RotateCcw size={11} />
          Reset settings
        </button>
      </div>
      <SegmentedControl
        options={[
          { value: "comfortable", label: "Comfortable" },
          { value: "compact", label: "Compact" },
        ]}
        value={config.density}
        onChange={(density) => onChange({ ...config, density })}
      />
      <div className="space-y-3 border-t border-border pt-4">
        <h4 className="text-[10px] font-mono text-muted-foreground uppercase">Content</h4>
        {(["title", "description", "dueDate"] as const).map((key) => (
          <label key={key} className="block text-[11px] text-muted-foreground">
            {key === "dueDate" ? "Due date label" : key === "title" ? "Card title" : "Description"}
            <input
              className={fieldClass}
              value={config[key]}
              onChange={(event) => onChange({ ...config, [key]: event.target.value })}
            />
          </label>
        ))}
      </div>
      <div className="space-y-3 border-t border-border pt-4">
        <h4 className="text-[10px] font-mono text-muted-foreground uppercase">Layout & motion</h4>
        {ranges.map(({ key, label, ...range }) => (
          <label key={key} className="block text-[11px] text-muted-foreground">
            <span className="flex items-center justify-between">
              {label}
              <span className="font-mono tabular-nums">{config[key]}</span>
            </span>
            <CustomizationRange
              {...range}
              aria-label={label}
              value={config[key]}
              onChange={(event) => onChange({ ...config, [key]: Number(event.target.value) })}
            />
          </label>
        ))}
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          Smooth: 105 stiffness · 24 damping. Lower stiffness feels softer; higher damping settles
          with less bounce.
        </p>
      </div>
      <div className="space-y-3 border-t border-border pt-4">
        <h4 className="text-[10px] font-mono text-muted-foreground uppercase">Details</h4>
        {toggles.map(({ key, label }) => (
          <label
            key={key}
            className="flex cursor-pointer items-center justify-between gap-3 text-[11px] text-muted-foreground"
          >
            {label}
            <input
              type="checkbox"
              checked={config[key]}
              onChange={(event) => onChange({ ...config, [key]: event.target.checked })}
              className="size-3.5 cursor-pointer accent-foreground"
            />
          </label>
        ))}
        <label className="flex items-center justify-between text-[11px] text-muted-foreground">
          Accent
          <input
            type="color"
            aria-label="Workflow accent"
            value={config.accent}
            onChange={(event) => onChange({ ...config, accent: event.target.value })}
            className="size-7 cursor-pointer rounded border border-border bg-transparent p-0.5"
          />
        </label>
      </div>
    </div>
  );
}
