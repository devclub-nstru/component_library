"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check, ChevronDown, Flower } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { promptComposerSpring } from "./prompt-composer-motion";

gsap.registerPlugin(useGSAP);

export interface PromptComposerModel {
  id: string;
  name: string;
  description?: string;
}

export function PromptComposerModelPicker({
  models,
  value,
  onChange,
  disabled,
  speed,
  stiffness,
  damping,
}: {
  models: readonly PromptComposerModel[];
  value: PromptComposerModel;
  onChange: (model: PromptComposerModel) => void;
  disabled: boolean;
  speed: number;
  stiffness: number;
  damping: number;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const pinnedRef = useRef(false);
  const focusOnOpenRef = useRef(false);
  const focusEdgeRef = useRef<"first" | "last" | "selected">("selected");
  const closeDelayRef = useRef<gsap.core.Tween | null>(null);
  const highlightedRef = useRef(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const menuId = useId();
  const reduced = useReducedMotion();
  const visible = open && !disabled;
  const { contextSafe } = useGSAP(() => () => closeDelayRef.current?.kill(), {
    scope: rootRef,
  });

  const close = useCallback(() => {
    closeDelayRef.current?.kill();
    focusOnOpenRef.current = false;
    pinnedRef.current = false;
    setOpen(false);
    setHovered(null);
  }, []);

  const focusMenu = useCallback((edge: "first" | "last" | "selected") => {
    const options = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitemradio"]',
      ) ?? [],
    );
    const option =
      edge === "first"
        ? options[0]
        : edge === "last"
          ? options.at(-1)
          : options.find(
              (item) => item.getAttribute("aria-checked") === "true",
            );
    option?.focus({ preventScroll: true });
  }, []);

  const scheduleClose = () =>
    contextSafe(() => {
      if (
        pinnedRef.current ||
        menuRef.current?.contains(document.activeElement)
      )
        return;
      closeDelayRef.current?.kill();
      closeDelayRef.current = gsap.delayedCall(0.18, close);
    })();

  useGSAP(
    () => {
      gsap.to(menuRef.current, {
        autoAlpha: visible ? 1 : 0,
        y: visible ? 0 : 7,
        scale: visible ? 1 : 0.96,
        ...promptComposerSpring(stiffness, damping, speed, reduced),
        overwrite: true,
      });
      gsap.to("[data-model-chevron]", {
        rotation: visible ? 180 : 0,
        ...promptComposerSpring(stiffness, damping, speed, reduced),
        overwrite: true,
      });
    },
    {
      scope: rootRef,
      dependencies: [visible, reduced, speed, stiffness, damping],
    },
  );

  useGSAP(
    () => {
      const target = Array.from(
        menuRef.current?.querySelectorAll<HTMLButtonElement>(
          "[data-model-option]",
        ) ?? [],
      ).find((option) => option.dataset.modelOption === (hovered ?? value.id));
      if (!target || !visible) {
        highlightedRef.current = false;
        return;
      }
      const vars = {
        y: target.offsetTop,
        height: target.offsetHeight,
        autoAlpha: 1,
      };
      if (!highlightedRef.current || reduced)
        gsap.set(highlightRef.current, vars);
      else
        gsap.to(highlightRef.current, {
          ...vars,
          ...promptComposerSpring(stiffness, damping, speed, reduced),
          overwrite: true,
        });
      highlightedRef.current = true;
    },
    {
      scope: rootRef,
      dependencies: [
        hovered,
        visible,
        value.id,
        reduced,
        speed,
        stiffness,
        damping,
        models.map((model) => model.id).join(","),
      ],
    },
  );

  useEffect(() => {
    if (!visible) return;
    if (focusOnOpenRef.current) focusMenu(focusEdgeRef.current);
    focusOnOpenRef.current = false;
    const dismiss = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      )
        close();
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [visible, close, focusMenu]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
      triggerRef.current?.focus({ preventScroll: true });
      return;
    }
    const options = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitemradio"]',
      ) ?? [],
    );
    const index = options.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? options.length - 1
          : event.key === "ArrowDown"
            ? (index + 1) % options.length
            : event.key === "ArrowUp"
              ? (index - 1 + options.length) % options.length
              : null;
    if (next !== null) {
      event.preventDefault();
      options[next]?.focus({ preventScroll: true });
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative z-30 w-fit shrink-0"
      onPointerEnter={(event) => {
        closeDelayRef.current?.kill();
        if (event.pointerType === "mouse" && !disabled && models.length > 1)
          setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") scheduleClose();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Model: ${value.name}`}
        aria-haspopup="menu"
        aria-expanded={visible}
        aria-controls={menuId}
        disabled={disabled || models.length < 2}
        onClick={() => {
          closeDelayRef.current?.kill();
          if (visible && pinnedRef.current) close();
          else {
            pinnedRef.current = true;
            focusEdgeRef.current = "selected";
            focusOnOpenRef.current = true;
            setOpen(true);
            if (visible) {
              focusOnOpenRef.current = false;
              focusMenu("selected");
            }
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            closeDelayRef.current?.kill();
            pinnedRef.current = true;
            const edge = event.key === "ArrowUp" ? "last" : "first";
            if (visible) focusMenu(edge);
            else {
              focusEdgeRef.current = edge;
              focusOnOpenRef.current = true;
              setOpen(true);
            }
          }
        }}
        className="flex min-h-10 w-36 max-w-full cursor-pointer items-center gap-2 rounded-full bg-[var(--pc-pill)] px-3.5 text-xs font-medium text-[var(--pc-muted)] outline-none hover:text-[var(--pc-ink)] focus-visible:ring-2 focus-visible:ring-[var(--pc-accent)] focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-60"
      >
        <Flower className="size-3.5 shrink-0" aria-hidden="true" />
        <span data-model-name className="truncate">
          {value.name}
        </span>
        <ChevronDown
          data-model-chevron
          className="size-3 shrink-0"
          aria-hidden="true"
        />
      </button>
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label="Choose a model"
        inert={!visible}
        aria-hidden={!visible}
        onKeyDown={onKeyDown}
        className="invisible absolute bottom-[calc(100%+8px)] left-0 flex w-56 origin-bottom-left flex-col gap-0.5 rounded-2xl border border-[var(--pc-border)] bg-[var(--pc-paper)] p-1.5 opacity-0 shadow-xl @min-[561px]/composer:top-[calc(100%+8px)] @min-[561px]/composer:bottom-auto @min-[561px]/composer:origin-top-left"
      >
        <span
          ref={highlightRef}
          data-model-highlight
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-1.5 left-1.5 rounded-xl bg-[var(--pc-pill)] opacity-0"
        />
        {models.map((model) => (
          <button
            key={model.id}
            type="button"
            role="menuitemradio"
            data-model-option={model.id}
            aria-checked={value.id === model.id}
            tabIndex={visible && value.id === model.id ? 0 : -1}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setHovered(model.id);
            }}
            onFocus={() => setHovered(model.id)}
            onClick={() => {
              onChange(model);
              close();
              triggerRef.current?.focus({ preventScroll: true });
            }}
            className="relative z-10 flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[var(--pc-accent)]/40"
          >
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-xs font-medium">{model.name}</span>
              {model.description && (
                <span className="truncate text-[11px] text-[var(--pc-muted)]">
                  {model.description}
                </span>
              )}
            </span>
            {value.id === model.id && (
              <Check className="size-3.5 shrink-0" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
