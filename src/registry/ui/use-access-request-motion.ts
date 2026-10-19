"use client";

import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { calcGeneratorDuration, spring } from "motion";

gsap.registerPlugin(useGSAP);

const bounded = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

export function useAccessRequestMotion({
  rootRef,
  panelRef,
  contentRef,
  signature,
  expanded,
  stiffness,
  damping,
  speed,
  enabled,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  signature: string;
  expanded: boolean;
  stiffness: number;
  damping: number;
  speed: number;
  enabled: boolean;
}) {
  const syncRef = useRef<((immediate?: boolean) => void) | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const panel = panelRef.current;
      const content = contentRef.current;
      if (!root || !panel || !content || !enabled) return;
      const response = spring({
        keyframes: [0, 1],
        stiffness: bounded(stiffness, 280, 80, 600),
        damping: bounded(damping, 30, 16, 60),
        restSpeed: 0.001,
        restDelta: 0.001,
      });
      const settle = calcGeneratorDuration(response);
      const ease = (progress: number) =>
        progress === 1 ? 1 : response.next(progress * settle).value;
      const media = gsap.matchMedia();
      media.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          standard: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          let timeline: gsap.core.Timeline | null = null;
          let positions = new Map<string, number>();
          const sync = context.add("sync", (immediate = false) => {
            const open = root.dataset.expanded === "true";
            const reduced = Boolean(context.conditions?.reduced);
            const duration =
              immediate || reduced
                ? 0
                : settle / 1000 / bounded(speed, 1, 0.5, 2);
            const rootRect = root.getBoundingClientRect();
            const rows = Array.from(
              content.querySelectorAll<HTMLElement>("[data-request-row]"),
            );
            const rowMap = new Map(
              rows.map((row) => [row.dataset.requestRow, row]),
            );
            const measurements = rows.map((row) => ({
              row,
              id: row.dataset.requestRow ?? "",
              top: row.offsetTop,
              currentY: Number(gsap.getProperty(row, "y")) || 0,
            }));
            const avatars = Array.from(
              root.querySelectorAll<HTMLElement>("[data-request-avatar]"),
            );
            const targets = avatars.map((avatar, index) => {
              const row = rowMap.get(avatar.dataset.requestAvatar);
              const rect = row
                ?.querySelector("[data-request-anchor]")
                ?.getBoundingClientRect();
              const rowY = row ? Number(gsap.getProperty(row, "y")) || 0 : 0;
              const leaving =
                row?.dataset.phase === "decided" ||
                row?.dataset.phase === "removing";
              return {
                avatar,
                x: open && rect ? rect.left - rootRect.left : 16 + index * 21,
                y: open && rect ? rect.top - rootRect.top - rowY : 16,
                visible: !leaving && (open || index < 2),
              };
            });
            const summaryX =
              avatars.length > 2
                ? 108
                : avatars.length > 1
                  ? 84
                  : avatars.length
                    ? 60
                    : 58;
            timeline?.kill();
            timeline = gsap.timeline({
              defaults: { duration, ease, overwrite: "auto" },
            });
            timeline.to(panel, { height: open ? content.offsetHeight : 0 }, 0);
            timeline.to(
              "[data-request-compact]",
              {
                autoAlpha: open ? 0 : 1,
                duration: Math.min(duration, 0.14),
                ease: "power2.out",
              },
              0,
            );
            timeline.to(
              "[data-request-heading]",
              {
                autoAlpha: open ? 1 : 0,
                x: open ? 0 : 6,
                duration: Math.min(duration, 0.18),
                ease: "power2.out",
              },
              open && duration ? 0.06 : 0,
            );
            timeline.to(
              content,
              {
                opacity: open ? 1 : 0,
                duration: Math.min(duration, 0.2),
                ease: "power2.out",
              },
              open && duration ? 0.04 : 0,
            );
            timeline.to(
              "[data-request-chevron]",
              { rotation: open ? 180 : 0 },
              0,
            );
            timeline.to(
              "[data-request-overflow]",
              {
                x: 58,
                y: 16,
                autoAlpha: !open && avatars.length > 2 ? 1 : 0,
                scale: open ? 0.8 : 1,
                duration: Math.min(duration, 0.2),
              },
              0,
            );
            timeline.to("[data-request-summary]", { x: summaryX }, 0);
            gsap.set("[data-request-summary]", {
              width: Math.max(0, root.clientWidth - summaryX - 80),
            });
            for (const { avatar, x, y, visible } of targets) {
              timeline.to(
                avatar,
                { x, y, autoAlpha: visible ? 1 : 0, scale: visible ? 1 : 0.65 },
                0,
              );
            }
            for (const { row, id, top, currentY } of measurements) {
              const previous = positions.get(id);
              if (previous !== undefined)
                timeline.fromTo(
                  row,
                  { y: previous - top + currentY },
                  { y: 0, immediateRender: true },
                  0,
                );
            }
            positions = new Map(measurements.map(({ id, top }) => [id, top]));
          });
          syncRef.current = (immediate) => sync(immediate);
          sync(true);
          let previousWidth = root.clientWidth;
          let previousHeight = content.offsetHeight;
          const observer = new ResizeObserver(() => {
            const width = root.clientWidth;
            const height = content.offsetHeight;
            if (width === previousWidth && height === previousHeight) return;
            previousWidth = width;
            previousHeight = height;
            sync();
          });
          observer.observe(content);
          observer.observe(root);
          return () => {
            observer.disconnect();
            timeline?.kill();
            syncRef.current = null;
          };
        },
        root,
      );
      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [stiffness, damping, speed, enabled],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    (context) => {
      context.ignore(() => syncRef.current?.());
    },
    { scope: rootRef, dependencies: [signature, expanded] },
  );
}
