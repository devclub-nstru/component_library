"use client";

import { RotateCcw } from "lucide-react";
import {
  TaskCard,
  TASK_CARD_PRIORITIES,
  type TaskCardProps,
  type TaskCardPriority,
} from "@/registry/ui/task-card";
import { CustomizationRange } from "./customization-controls";
import { SegmentedControl } from "./segmented-control";

const people = [
  {
    name: "DevClub Design",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&auto=format&fit=crop&crop=faces&q=80",
  },
  {
    name: "DevClub UI",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&auto=format&fit=crop&crop=faces&q=80",
  },
  {
    name: "DevClub Platform",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&auto=format&fit=crop&crop=faces&q=80",
  },
  {
    name: "DevClub QA",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&auto=format&fit=crop&crop=faces&q=80",
  },
];

type DemoTask = Pick<
  TaskCardProps,
  | "title"
  | "description"
  | "priority"
  | "priorityLabel"
  | "priorityColor"
  | "status"
  | "comments"
  | "links"
  | "files"
  | "dueDate"
  | "assignees"
> & {
  id: string;
  column: "planning" | "development";
};

export const TASK_CARD_DEMO_TASKS: DemoTask[] = [
  {
    id: "interface",
    column: "planning",
    title: "DevClub Interface Flows",
    description:
      "Map component discovery, search, and customization flows for the DevClub UI library.",
    priority: "moderate",
    status: "Design Review",
    assignees: people.slice(0, 2),
    comments: 5,
    links: 3,
    files: 9,
    dueDate: "2026-10-07",
  },
  {
    id: "library",
    column: "planning",
    title: "DevClub Component Plan",
    description:
      "Define reusable cards, navigation, and input patterns for upcoming DevClub projects.",
    priority: "low",
    status: "Planned",
    assignees: [people[0], people[2], people[3]],
    comments: 7,
    links: 2,
    files: 6,
    dueDate: "2026-10-09",
  },
  {
    id: "studio",
    column: "development",
    title: "Component Studio Build",
    description:
      "Build responsive DevClub Studio previews with accessible controls and polished motion.",
    priority: "urgent",
    status: "In Progress",
    assignees: [people[2], people[0], people[3]],
    comments: 12,
    links: 4,
    files: 14,
    dueDate: "2026-10-12",
  },
  {
    id: "quality",
    column: "development",
    title: "DevClub Quality Review",
    description:
      "Review component behavior, improve performance, and document DevClub UI usage.",
    priority: "onboarding",
    priorityLabel: "Quality assurance",
    status: "In Review",
    assignees: [people[2], people[3], people[1]],
    comments: 3,
    links: 2,
    files: 8,
    dueDate: "2026-10-15",
  },
];

export const TASK_CARD_DEFAULT_CONFIG = {
  layout: "board" as "board" | "card",
  theme: "dark" as "dark" | "light",
  radius: 20,
  padding: 18,
  shadow: 0.7,
  hoverLift: 3,
  avatarSize: 30,
  bandHeight: 38,
  dashedBorder: true,
  showAssignees: true,
  showStatus: true,
  showFooter: true,
  surfaceColor: "#202020",
  textColor: "#f4f4f4",
  planningTitle: "Project planning",
  developmentTitle: "Development",
  projectLabel: "DevClub UI · 2026",
  tasks: TASK_CARD_DEMO_TASKS,
};

export type TaskCardConfig = typeof TASK_CARD_DEFAULT_CONFIG;

export function TaskCardDemo({
  config,
  selectedId = "interface",
}: {
  config: TaskCardConfig;
  selectedId?: string;
}) {
  const {
    layout,
    planningTitle,
    developmentTitle,
    projectLabel,
    tasks,
    ...appearance
  } = config;
  const light = config.theme === "light";
  const selected = tasks.find((task) => task.id === selectedId) ?? tasks[0];

  return (
    <div
      data-slot="task-card-demo"
      className="flex h-full w-full overflow-auto font-sans"
      style={{
        padding: "clamp(16px, 3%, 36px)",
        backgroundColor: light ? "#f3f3f4" : "#191919",
        color: light ? "#252525" : "#f4f4f4",
        backgroundImage: `radial-gradient(${light ? "#dddddf" : "#202020"} 1px, transparent 1px)`,
        backgroundSize: "6px 6px",
      }}
    >
      {layout === "card" ? (
        <div className="m-auto w-full max-w-100 py-6">
          {selected && <TaskCard {...appearance} {...selected} />}
        </div>
      ) : (
        <div
          className="m-auto grid w-full max-w-215 items-start gap-5 py-6"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          }}
        >
          {(["planning", "development"] as const).map((column) => {
            const title =
              column === "planning" ? planningTitle : developmentTitle;
            const columnTasks = tasks.filter((task) => task.column === column);
            return (
              <section
                key={column}
                aria-label={`${title} tasks`}
                className="min-w-0"
              >
                <header className="relative mb-4 px-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="h-5 w-1 shrink-0 rounded-full"
                      style={{
                        background:
                          column === "planning" ? "#36ad71" : "#fa454b",
                      }}
                      aria-hidden="true"
                    />
                    <h2 className="min-w-0 flex-1 text-[19px] leading-tight font-medium uppercase tracking-[-0.025em] wrap-anywhere">
                      {title}
                    </h2>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pl-4 text-[13px] text-zinc-400">
                    <span>
                      {columnTasks.length}{" "}
                      {columnTasks.length === 1 ? "Task" : "Tasks"}
                    </span>
                    <span>{projectLabel}</span>
                  </div>
                </header>
                <div
                  className="flex flex-col gap-3 rounded-[25px] p-2"
                  style={{
                    background: light ? "#e5e5e7" : "#101010",
                    boxShadow: light
                      ? "inset 0 1px 2px rgb(0 0 0 / 0.08)"
                      : "inset 0 1px 3px rgb(0 0 0 / 0.3)",
                  }}
                >
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} {...appearance} {...task} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

const ranges = [
  { key: "radius", label: "Corner radius", min: 8, max: 36, step: 1 },
  { key: "padding", label: "Content padding", min: 12, max: 32, step: 1 },
  { key: "shadow", label: "Shadow depth", min: 0, max: 1, step: 0.05 },
  { key: "hoverLift", label: "Hover lift", min: 0, max: 10, step: 1 },
  { key: "avatarSize", label: "Avatar size", min: 20, max: 44, step: 1 },
  {
    key: "bandHeight",
    label: "Priority band height",
    min: 38,
    max: 60,
    step: 1,
  },
] as const;

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40";

export function TaskCardControls({
  config,
  onChange,
  selectedId,
  onSelect,
}: {
  config: TaskCardConfig;
  onChange: (config: TaskCardConfig) => void;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const selected =
    config.tasks.find((task) => task.id === selectedId) ?? config.tasks[0];
  const updateTask = (values: Partial<DemoTask>) =>
    onChange({
      ...config,
      tasks: config.tasks.map((task) =>
        task.id === selected?.id ? { ...task, ...values } : task,
      ),
    });
  return (
    <div className="pointer-events-auto flex w-full flex-col gap-5 p-3 font-sans sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Task card</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Customize your DevClub project cards.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            onChange(TASK_CARD_DEFAULT_CONFIG);
            onSelect("interface");
          }}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>
      <fieldset className="space-y-2">
        <legend className="mb-2 text-xs font-medium">Preview</legend>
        <SegmentedControl
          options={[
            { value: "board", label: "Board" },
            { value: "card", label: "Single card" },
          ]}
          value={config.layout}
          onChange={(layout) => onChange({ ...config, layout })}
        />
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-xs font-medium">Card to customize</legend>
        <SegmentedControl
          className="grid-cols-1 sm:grid-cols-2 [&_button]:wrap-anywhere"
          options={config.tasks.map((task) => ({
            value: task.id,
            label: task.title || "Untitled task",
          }))}
          value={selected?.id ?? ""}
          onChange={onSelect}
        />
      </fieldset>
      {selected && (
        <fieldset className="space-y-3">
          <legend className="mb-3 text-xs font-medium">Card content</legend>
          <label className="block text-xs">
            Title
            <input
              className={fieldClass}
              value={selected.title}
              onChange={(event) => updateTask({ title: event.target.value })}
            />
          </label>
          <label className="block text-xs">
            Description
            <textarea
              className={fieldClass}
              rows={3}
              value={selected.description ?? ""}
              onChange={(event) =>
                updateTask({ description: event.target.value })
              }
            />
          </label>
          <fieldset>
            <legend className="mb-2 text-xs">Priority</legend>
            <SegmentedControl
              options={(
                Object.keys(TASK_CARD_PRIORITIES) as TaskCardPriority[]
              ).map((value) => ({
                value,
                label: TASK_CARD_PRIORITIES[value].label,
              }))}
              value={selected.priority ?? "moderate"}
              onChange={(priority) =>
                updateTask({
                  priority,
                  priorityLabel: undefined,
                  priorityColor: undefined,
                })
              }
            />
          </fieldset>
          <label className="block text-xs">
            Priority label
            <input
              className={fieldClass}
              value={
                selected.priorityLabel ??
                TASK_CARD_PRIORITIES[selected.priority ?? "moderate"].label
              }
              onChange={(event) =>
                updateTask({ priorityLabel: event.target.value })
              }
            />
          </label>
          <label className="flex items-center justify-between text-xs">
            Priority color
            <input
              type="color"
              className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
              value={
                selected.priorityColor ??
                TASK_CARD_PRIORITIES[selected.priority ?? "moderate"].color
              }
              onChange={(event) =>
                updateTask({ priorityColor: event.target.value })
              }
            />
          </label>
          <label className="block text-xs">
            Status
            <input
              className={fieldClass}
              value={selected.status ?? ""}
              onChange={(event) => updateTask({ status: event.target.value })}
            />
          </label>
          <label className="block text-xs">
            Due date
            <input
              type="date"
              className={fieldClass}
              value={selected.dueDate ?? ""}
              onChange={(event) => updateTask({ dueDate: event.target.value })}
            />
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["comments", "links", "files"] as const).map((key) => (
              <label key={key} className="text-xs capitalize">
                {key}
                <input
                  type="number"
                  min={0}
                  max={9999}
                  className={fieldClass}
                  value={selected[key] ?? 0}
                  onChange={(event) =>
                    updateTask({
                      [key]: Math.max(
                        0,
                        Math.min(9999, Number(event.target.value) || 0),
                      ),
                    })
                  }
                />
              </label>
            ))}
          </div>
          <label className="block text-xs">
            Assignee count
            <CustomizationRange
              aria-label="Assignee count"
              min={0}
              max={people.length}
              step={1}
              value={selected.assignees?.length ?? 0}
              onChange={(event) =>
                updateTask({
                  assignees: people.slice(0, Number(event.target.value)),
                })
              }
            />
          </label>
        </fieldset>
      )}
      <fieldset className="space-y-3">
        <legend className="mb-3 text-xs font-medium">Appearance</legend>
        <SegmentedControl
          options={[
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" },
          ]}
          value={config.theme}
          onChange={(theme) =>
            onChange({
              ...config,
              theme,
              surfaceColor: theme === "dark" ? "#202020" : "#ffffff",
              textColor: theme === "dark" ? "#f4f4f4" : "#202124",
            })
          }
        />
        {(["surfaceColor", "textColor"] as const).map((key) => (
          <label
            key={key}
            className="flex items-center justify-between text-xs"
          >
            {key === "surfaceColor" ? "Card surface" : "Text color"}
            <input
              type="color"
              className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
              value={config[key]}
              onChange={(event) =>
                onChange({ ...config, [key]: event.target.value })
              }
            />
          </label>
        ))}
        {ranges.map((range) => (
          <label key={range.key} className="block text-xs">
            <span className="flex justify-between">
              <span>{range.label}</span>
              <span className="text-muted-foreground tabular-nums">
                {config[range.key]}
              </span>
            </span>
            <CustomizationRange
              aria-label={range.label}
              min={range.min}
              max={range.max}
              step={range.step}
              value={config[range.key]}
              onChange={(event) =>
                onChange({ ...config, [range.key]: Number(event.target.value) })
              }
            />
          </label>
        ))}
        {(
          [
            { key: "dashedBorder", label: "Dashed inset border" },
            { key: "showAssignees", label: "Assignee avatars" },
            { key: "showStatus", label: "Status badge" },
            { key: "showFooter", label: "Task details footer" },
          ] as const
        ).map(({ key, label }) => (
          <label
            key={key}
            className="flex cursor-pointer items-center gap-2 text-xs"
          >
            <input
              type="checkbox"
              className="size-4 accent-foreground"
              checked={config[key]}
              onChange={(event) =>
                onChange({ ...config, [key]: event.target.checked })
              }
            />
            {label}
          </label>
        ))}
      </fieldset>
      {config.layout === "board" && (
        <fieldset className="space-y-3">
          <legend className="mb-3 text-xs font-medium">Board headings</legend>
          {(
            [
              { key: "planningTitle", label: "First column" },
              { key: "developmentTitle", label: "Second column" },
              { key: "projectLabel", label: "Project label" },
            ] as const
          ).map(({ key, label }) => (
            <label key={key} className="block text-xs">
              {label}
              <input
                className={fieldClass}
                value={config[key]}
                onChange={(event) =>
                  onChange({ ...config, [key]: event.target.value })
                }
              />
            </label>
          ))}
        </fieldset>
      )}
    </div>
  );
}
