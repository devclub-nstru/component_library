"use client";

import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ThinkingStatus } from "./thinking-panel-types";
import { thinkingPanelSpring } from "./thinking-panel-spring";

gsap.registerPlugin(useGSAP);

export function useThinkingPanelMotion({
  rootRef,
  panelRef,
  contentRef,
  signature,
  expanded,
  status,
  stiffness,
  damping,
  speed,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  signature: string;
  expanded: boolean;
  status: ThinkingStatus;
  stiffness: number;
  damping: number;
  speed: number;
}) {
  const syncRef = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const panel = panelRef.current;
      const content = contentRef.current;
      if (!root || !panel || !content) return;
      const media = gsap.matchMedia();
      media.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          standard: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const reduced = Boolean(context.conditions?.reduced);
          const { duration, ease } = thinkingPanelSpring(
            stiffness,
            damping,
            speed,
            reduced,
          );
          let timeline: gsap.core.Timeline | null = null;
          let positions = new Map<string, { top: number; left: number }>();
          let visible = true;
          const pulse = reduced
            ? null
            : gsap.to("[data-thinking-pixel]", {
                opacity: 0.2,
                duration: 0.6,
                stagger: { each: 0.08, repeat: -1, yoyo: true },
                ease: "sine.inOut",
                paused: true,
              });
          const updatePulse = () => {
            if (
              visible &&
              !document.hidden &&
              root.dataset.expanded === "true" &&
              root.dataset.status === "thinking"
            )
              pulse?.resume();
            else pulse?.pause();
          };
          const sync = context.add("sync", (immediate = false) => {
            const open = root.dataset.expanded === "true";
            const rows = Array.from(
              content.querySelectorAll<HTMLElement>(
                "[data-thinking-row], [data-thinking-source]",
              ),
            );
            const measurements = rows.map((row) => ({
              row,
              id: row.dataset.thinkingRow
                ? `row-${row.dataset.thinkingRow}`
                : `source-${row.dataset.thinkingSource}`,
              top: row.offsetTop,
              left: row.offsetLeft,
              x: Number(gsap.getProperty(row, "x")) || 0,
              y: Number(gsap.getProperty(row, "y")) || 0,
            }));
            const height = content.offsetHeight;
            timeline?.kill();
            timeline = gsap.timeline({
              defaults: {
                duration: immediate ? 0 : duration,
                ease,
                overwrite: "auto",
              },
            });
            timeline.to(panel, { height: open ? height : 0 }, 0);
            timeline.to(
              "[data-thinking-chevron]",
              { rotation: open ? 0 : -90 },
              0,
            );
            timeline.to(
              content,
              {
                opacity: open ? 1 : 0,
                duration: immediate || reduced ? 0 : 0.18,
                ease: "power2.out",
              },
              0,
            );
            for (const { row, id, top, left, x, y } of measurements) {
              const previous = positions.get(id);
              if (previous !== undefined)
                timeline.fromTo(
                  row,
                  { x: previous.left - left + x, y: previous.top - top + y },
                  { x: 0, y: 0, opacity: 1 },
                  0,
                );
              else if (!immediate && open)
                timeline.fromTo(
                  row,
                  { y: reduced ? 0 : 7, opacity: 0 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: reduced ? 0 : Math.min(duration, 0.4),
                  },
                  0,
                );
            }
            positions = new Map(
              measurements.map(({ id, top, left }) => [id, { top, left }]),
            );
            updatePulse();
          });
          syncRef.current = () => sync();
          sync(true);
          const observer = new ResizeObserver(() => sync());
          observer.observe(content);
          const visibility = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            updatePulse();
          });
          visibility.observe(root);
          document.addEventListener("visibilitychange", updatePulse);
          return () => {
            observer.disconnect();
            visibility.disconnect();
            document.removeEventListener("visibilitychange", updatePulse);
            timeline?.kill();
            pulse?.kill();
            syncRef.current = null;
          };
        },
        root,
      );
      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [stiffness, damping, speed],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    (context) => {
      context.ignore(() => syncRef.current?.());
    },
    { scope: rootRef, dependencies: [signature, expanded, status] },
  );
}
