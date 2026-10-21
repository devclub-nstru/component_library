"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check, ChevronDown, Flower } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export interface PromptComposerModel {
  id: string;
  name: string;
  description?: string;
}

export function PromptComposerModelPicker({ models, value, onChange, disabled, speed }: {
  models: readonly PromptComposerModel[];
  value: PromptComposerModel;
  onChange: (model: PromptComposerModel) => void;
  disabled: boolean;
  speed: number;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const reduced = useReducedMotion();
  const visible = open && !disabled;

  useGSAP(() => {
    gsap.to(menuRef.current, {
      autoAlpha: visible ? 1 : 0,
      y: visible ? 0 : 5,
      scale: visible ? 1 : 0.97,
      duration: reduced ? 0 : 0.18 / speed,
      ease: "power3.out",
      overwrite: true,
    });
    gsap.to("[data-model-chevron]", { rotation: visible ? 180 : 0, duration: reduced ? 0 : 0.25 / speed, overwrite: true });
  }, { scope: rootRef, dependencies: [visible, reduced, speed] });

  useEffect(() => {
    if (!visible) return;
    menuRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus({ preventScroll: true });
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [visible]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
      return;
    }
    const options = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? []);
    const index = options.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : event.key === "ArrowDown" ? (index + 1) % options.length : event.key === "ArrowUp" ? (index - 1 + options.length) % options.length : null;
    if (next !== null) {
      event.preventDefault();
      options[next]?.focus({ preventScroll: true });
    }
  };

  return (
    <div ref={rootRef} className="relative z-30 w-fit shrink-0" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button ref={triggerRef} type="button" aria-label={`Model: ${value.name}`} aria-haspopup="menu" aria-expanded={visible} aria-controls={menuId} disabled={disabled || models.length < 2} onClick={() => setOpen(!open)} onKeyDown={(event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          setOpen(true);
        }
      }} className="flex min-h-10 max-w-52 cursor-pointer items-center gap-2 rounded-full bg-[var(--pc-pill)] px-3.5 text-xs font-medium text-[var(--pc-muted)] outline-none hover:text-[var(--pc-ink)] focus-visible:ring-2 focus-visible:ring-[var(--pc-accent)] focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-60">
        <Flower className="size-3.5 shrink-0" aria-hidden="true" />
        <span data-model-name className="truncate">{value.name}</span>
        <ChevronDown data-model-chevron className="size-3 shrink-0" aria-hidden="true" />
      </button>
      <div ref={menuRef} id={menuId} role="menu" aria-label="Choose a model" inert={!visible} aria-hidden={!visible} onKeyDown={onKeyDown} className="invisible absolute bottom-[calc(100%+8px)] left-0 flex w-56 origin-bottom-left flex-col gap-0.5 rounded-2xl border border-[var(--pc-border)] bg-[var(--pc-paper)] p-1.5 opacity-0 shadow-xl @min-[561px]/composer:top-[calc(100%+8px)] @min-[561px]/composer:bottom-auto @min-[561px]/composer:origin-top-left">
        {models.map((model) => (
          <button key={model.id} type="button" role="menuitemradio" aria-checked={value.id === model.id} tabIndex={visible ? 0 : -1} onClick={() => {
            onChange(model);
            setOpen(false);
            triggerRef.current?.focus({ preventScroll: true });
          }} className={cn("flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left outline-none hover:bg-[var(--pc-pill)] focus-visible:bg-[var(--pc-pill)]", value.id === model.id && "bg-[var(--pc-pill)]/60")}>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-xs font-medium">{model.name}</span>
              {model.description && <span className="truncate text-[11px] text-[var(--pc-muted)]">{model.description}</span>}
            </span>
            {value.id === model.id && <Check className="size-3.5 shrink-0" aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  );
}
