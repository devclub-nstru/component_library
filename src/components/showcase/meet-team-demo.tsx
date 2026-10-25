"use client";

import { useState } from "react";
import { ResetIcon } from "@radix-ui/react-icons";
import { MeetTeam, type MeetTeamMember } from "@/registry/ui/meet-team";
import { CustomizationRange } from "./customization-controls";
import { SegmentedControl } from "./segmented-control";

export const MEET_TEAM_MEMBERS: MeetTeamMember[] = [
  {
    id: "ava",
    name: "Ava Morgan",
    role: "Creative Director",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop&crop=faces&auto=format&q=85",
  },
  {
    id: "leo",
    name: "Leo Chen",
    role: "Design Engineer",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop&crop=faces&auto=format&q=85",
  },
  {
    id: "maya",
    name: "Maya Patel",
    role: "Brand Strategist",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&crop=faces&auto=format&q=85",
  },
  {
    id: "noah",
    name: "Noah Williams",
    role: "Motion Designer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=faces&auto=format&q=85",
  },
  {
    id: "ella",
    name: "Ella Thompson",
    role: "Product Designer",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop&crop=faces&auto=format&q=85",
  },
  {
    id: "oliver",
    name: "Oliver James",
    role: "Frontend Developer",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&h=800&fit=crop&crop=faces&auto=format&q=85",
  },
  {
    id: "sofia",
    name: "Sofia Rivera",
    role: "Art Director",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop&crop=faces&auto=format&q=85",
  },
  {
    id: "james",
    name: "James Park",
    role: "Product Lead",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=faces&auto=format&q=85",
  },
  {
    id: "isla",
    name: "Isla Brooks",
    role: "Experience Designer",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop&crop=faces&auto=format&q=85",
  },
];

export const MEET_TEAM_DEFAULT_CONFIG = {
  members: MEET_TEAM_MEMBERS,
  title: "Meet Team",
  subtitle: "Different minds. One shared direction.",
  cardWidth: 210,
  aspectRatio: 0.76,
  gap: 20,
  tilt: 52,
  depth: 36,
  perspective: 1200,
  borderRadius: 4,
  stiffness: 180,
  damping: 28,
  mass: 1,
  grayscale: true,
  followPointer: true,
  showDetails: true,
  showControls: true,
};

export type MeetTeamConfig = typeof MEET_TEAM_DEFAULT_CONFIG;

export function MeetTeamDemo({
  config = MEET_TEAM_DEFAULT_CONFIG,
  compact = false,
}: {
  config?: MeetTeamConfig;
  compact?: boolean;
}) {
  return (
    <MeetTeam
      {...config}
      {...(compact
        ? {
            cardWidth: 100,
            gap: 8,
            showDetails: false,
            showControls: false,
            subtitle: "",
            followPointer: false,
          }
        : {})}
      className={
        compact
          ? "h-48 min-h-0 bg-transparent py-3 dark:bg-transparent [&_h2]:text-sm"
          : "h-full min-h-0"
      }
    />
  );
}

const presets = [
  { value: "soft", label: "Soft", stiffness: 100, damping: 24, mass: 1.2 },
  { value: "smooth", label: "Smooth", stiffness: 180, damping: 28, mass: 1 },
  { value: "snappy", label: "Snappy", stiffness: 400, damping: 38, mass: 0.8 },
  { value: "springy", label: "Springy", stiffness: 240, damping: 16, mass: 1 },
] as const;

const ranges = [
  { key: "cardWidth", label: "Portrait width", min: 100, max: 360, step: 5 },
  { key: "aspectRatio", label: "Aspect ratio", min: 0.6, max: 1.2, step: 0.02 },
  { key: "gap", label: "Card spacing", min: 0, max: 64, step: 1 },
  { key: "tilt", label: "Fan angle", min: 0, max: 70, step: 1 },
  { key: "depth", label: "Depth", min: 0, max: 100, step: 2 },
  { key: "perspective", label: "Perspective", min: 500, max: 2400, step: 50 },
  { key: "borderRadius", label: "Corner radius", min: 0, max: 40, step: 1 },
  { key: "stiffness", label: "Stiffness", min: 60, max: 600, step: 10 },
  { key: "damping", label: "Damping", min: 10, max: 80, step: 1 },
  { key: "mass", label: "Mass", min: 0.5, max: 3, step: 0.1 },
] as const;

const toggles = [
  { key: "grayscale", label: "Black and white portraits" },
  { key: "followPointer", label: "Follow pointer" },
  { key: "showDetails", label: "Show member details" },
  { key: "showControls", label: "Show navigation" },
] as const;

const inputClassName =
  "min-h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50";

export function MeetTeamControls({
  config,
  onChange,
}: {
  config: MeetTeamConfig;
  onChange: (config: MeetTeamConfig) => void;
}) {
  const [editingId, setEditingId] = useState(MEET_TEAM_MEMBERS[0].id);
  const editing =
    config.members.find((member) => member.id === editingId) ??
    config.members[0];
  const activePreset =
    presets.find(
      (preset) =>
        preset.stiffness === config.stiffness &&
        preset.damping === config.damping &&
        preset.mass === config.mass,
    )?.value ?? "custom";
  const updateMember = (
    key: "name" | "role" | "image" | "imagePosition" | "href",
    value: string,
  ) => {
    onChange({
      ...config,
      members: config.members.map((member) =>
        member.id === editing?.id ? { ...member, [key]: value } : member,
      ),
    });
  };

  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Meet Team</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Move across the portraits, drag, or use the arrows.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...MEET_TEAM_DEFAULT_CONFIG })}
          className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          <ResetIcon className="size-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-xs font-medium">Content</legend>
        {(["title", "subtitle"] as const).map((key) => (
          <label
            key={key}
            className="flex flex-col gap-2 text-xs text-muted-foreground"
          >
            {key === "title" ? "Heading" : "Subtitle"}
            <input
              value={config[key]}
              onChange={(event) =>
                onChange({ ...config, [key]: event.target.value })
              }
              className={inputClassName}
            />
          </label>
        ))}
        <label className="flex flex-col gap-2 text-xs text-muted-foreground">
          Edit team member
          <select
            aria-label="Edit team member"
            disabled={!editing}
            value={editing?.id ?? ""}
            onChange={(event) => setEditingId(event.target.value)}
            className={inputClassName}
          >
            {config.members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name || "Unnamed member"}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              const member: MeetTeamMember = {
                id: crypto.randomUUID(),
                name: "New member",
                role: "Team member",
                image: "",
              };
              onChange({ ...config, members: [...config.members, member] });
              setEditingId(member.id);
            }}
            className={inputClassName + " cursor-pointer hover:bg-muted"}
          >
            Add member
          </button>
          <button
            type="button"
            disabled={!editing}
            onClick={() =>
              onChange({
                ...config,
                members: config.members.filter(
                  (member) => member.id !== editing?.id,
                ),
              })
            }
            className={
              inputClassName +
              " cursor-pointer hover:bg-muted disabled:cursor-default disabled:opacity-40"
            }
          >
            Remove member
          </button>
        </div>
        {editing && (
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { key: "name", label: "Member name" },
                { key: "role", label: "Member role" },
                { key: "image", label: "Portrait URL" },
                { key: "imagePosition", label: "Image position" },
                { key: "href", label: "Profile link" },
              ] as const
            ).map(({ key, label }) => (
              <label
                key={key}
                className="flex min-w-0 flex-col gap-2 text-xs text-muted-foreground"
              >
                {label}
                <input
                  value={editing[key] ?? ""}
                  onChange={(event) => updateMember(key, event.target.value)}
                  className={inputClassName}
                />
              </label>
            ))}
          </div>
        )}
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-xs font-medium">Motion preset</legend>
        <SegmentedControl
          options={presets}
          value={activePreset}
          onChange={(value) => {
            const preset = presets.find((item) => item.value === value);
            if (preset)
              onChange({
                ...config,
                stiffness: preset.stiffness,
                damping: preset.damping,
                mass: preset.mass,
              });
          }}
        />
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">
        {ranges.map(({ key, label, ...range }) => (
          <label
            key={key}
            className="flex min-w-0 flex-col gap-2 rounded-xl border border-border p-3"
          >
            <span className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              {label}
              <span className="font-mono text-foreground">
                {Number(config[key].toFixed(2))}
              </span>
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
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {toggles.map(({ key, label }) => (
          <label
            key={key}
            className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"
          >
            <input
              type="checkbox"
              checked={config[key]}
              onChange={(event) =>
                onChange({ ...config, [key]: event.target.checked })
              }
              className="size-4 accent-black dark:accent-white"
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}
