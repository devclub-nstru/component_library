"use client";

import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { thinkingSourceUrl, type ThinkingSource } from "./thinking-panel-types";
import { thinkingPanelSpring } from "./thinking-panel-spring";

gsap.registerPlugin(useGSAP);

export function ThinkingPanelSources({
  sources,
  remaining,
  showAll,
  onToggle,
  triggerRef,
  expanded,
  stiffness,
  damping,
  speed,
}: {
  sources: readonly ThinkingSource[];
  remaining: number;
  showAll: boolean;
  onToggle: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  expanded: boolean;
  stiffness: number;
  damping: number;
  speed: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const highlight = highlightRef.current;
      if (!root || !highlight) return;
      const media = gsap.matchMedia();
      media.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          standard: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const reduced = Boolean(context.conditions?.reduced);
          const physics = thinkingPanelSpring(
            stiffness,
            damping,
            speed,
            reduced,
          );
          let hovered = window.matchMedia("(hover: hover)").matches
            ? root.querySelector<HTMLElement>("[data-source-target]:hover")
            : null;
          let current: HTMLElement | null = null;
          let tween: gsap.core.Tween | null = null;
          const targetFor = (target: EventTarget | null) => {
            const item =
              target instanceof Element
                ? target.closest<HTMLElement>("[data-source-target]")
                : null;
            return item && root.contains(item) ? item : null;
          };
          const move = context.add("move", (force = false) => {
            if (hovered && !root.contains(hovered)) hovered = null;
            const target = expanded
              ? (hovered ?? targetFor(document.activeElement))
              : null;
            if (!force && target === current) return;
            tween?.kill();
            if (!target) {
              current = null;
              tween = gsap.to(highlight, {
                autoAlpha: 0,
                duration: reduced ? 0 : 0.16,
                ease: "power2.out",
                overwrite: true,
              });
              return;
            }
            const geometry = {
              x: target.offsetLeft,
              y: target.offsetTop,
              width: target.offsetWidth,
              height: target.offsetHeight,
            };
            if (!current || reduced)
              gsap.set(highlight, { ...geometry, scale: reduced ? 1 : 0.98 });
            current = target;
            tween = gsap.to(highlight, {
              ...geometry,
              scale: 1,
              autoAlpha: 1,
              ...physics,
              overwrite: true,
            });
          });
          const enter = (event: PointerEvent) => {
            if (event.pointerType === "touch") return;
            hovered = targetFor(event.target);
            move();
          };
          const leave = () => {
            hovered = null;
            move();
          };
          const focus = () => {
            hovered = null;
            move(true);
          };
          const blurInContext = context.add("blur", (event: FocusEvent) => {
            if (
              !root.contains(
                event.relatedTarget instanceof Node
                  ? event.relatedTarget
                  : null,
              )
            ) {
              hovered = null;
              current = null;
              tween?.kill();
              tween = gsap.to(highlight, {
                autoAlpha: 0,
                duration: reduced ? 0 : 0.16,
                overwrite: true,
              });
            } else move(true);
          });
          const blur = (event: FocusEvent) => blurInContext(event);
          const observer = new ResizeObserver(() => move(true));
          observer.observe(root);
          root
            .querySelectorAll<HTMLElement>("[data-source-target]")
            .forEach((target) => observer.observe(target));
          root.addEventListener("pointerover", enter);
          root.addEventListener("pointerleave", leave);
          root.addEventListener("focusin", focus);
          root.addEventListener("focusout", blur);
          move(true);
          return () => {
            observer.disconnect();
            root.removeEventListener("pointerover", enter);
            root.removeEventListener("pointerleave", leave);
            root.removeEventListener("focusin", focus);
            root.removeEventListener("focusout", blur);
            tween?.kill();
          };
        },
        root,
      );
      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [
        stiffness,
        damping,
        speed,
        expanded,
        JSON.stringify(sources.map(({ id, href }) => [id, href])),
      ],
      revertOnUpdate: true,
    },
  );

  const chipClass =
    "relative z-10 inline-flex min-h-7 max-w-full items-center gap-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50/60 px-2 py-1 text-[11px] leading-4 text-zinc-600 pointer-coarse:min-h-10 dark:border-white/[0.07] dark:bg-white/[0.025] dark:text-zinc-300";
  return (
    <div
      ref={rootRef}
      data-thinking-sources
      className="relative isolate flex flex-wrap items-center gap-1.5"
    >
      <span
        ref={highlightRef}
        data-source-highlight
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-0 rounded-lg bg-zinc-200/80 opacity-0 shadow-[0_2px_8px_-4px_#00000025] dark:bg-white/[0.09]"
        style={{ visibility: "hidden", transformOrigin: "center" }}
      />
      {sources.map((source) => {
        const href = thinkingSourceUrl(source.href);
        const content = (
          <>
            <span
              data-source-logo
              aria-hidden="true"
              className="flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-[3px] [&>svg]:size-full"
            >
              {source.icon ?? <Globe2 className="size-3.5" />}
            </span>
            <span className="truncate">{source.label}</span>
          </>
        );
        return href ? (
          <a
            key={source.id}
            data-thinking-source={source.id}
            data-source-target
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={href}
            className={cn(
              chipClass,
              "outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
            )}
          >
            {content}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <span
            key={source.id}
            data-thinking-source={source.id}
            data-source-target
            className={chipClass}
          >
            {content}
          </span>
        );
      })}
      {remaining > 0 && (
        <button
          ref={triggerRef}
          type="button"
          data-source-target
          aria-expanded={showAll}
          aria-label={
            showAll ? "Show fewer sources" : `Show ${remaining} more sources`
          }
          onClick={onToggle}
          className="relative z-10 min-h-7 cursor-pointer rounded-lg px-2 py-1 text-[11px] leading-4 text-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-violet-400 pointer-coarse:min-h-10 dark:text-zinc-400"
        >
          {showAll ? "Show less" : `+${remaining} more`}
        </button>
      )}
    </div>
  );
}
