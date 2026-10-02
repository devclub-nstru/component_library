"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export interface ProjectRevealItem {
  id: string;
  title: string;
  category: string;
  year: string | number;
  image: string;
  imageAlt?: string;
  imagePosition?: string;
  description: string;
  href?: string;
  content?: React.ReactNode;
}

export interface ProjectRevealProps {
  items: ProjectRevealItem[];
  stiffness?: number;
  damping?: number;
  mass?: number;
  speed?: number;
  closeSpeed?: number;
  borderRadius?: number;
  thumbnailSize?: number;
  modalWidth?: number;
  imageRatio?: number;
  overlayOpacity?: number;
  hoverDuration?: number;
  hoverClassName?: string;
  showYear?: boolean;
  closeOnOutsideClick?: boolean;
  actionLabel?: string;
  ariaLabel?: string;
  className?: string;
  rowClassName?: string;
  modalClassName?: string;
  onOpenChange?: (item: ProjectRevealItem | null) => void;
}

const bounded = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

function createSpring(stiffness: number, damping: number, mass: number) {
  const frequency = Math.sqrt(stiffness / mass);
  const decay = damping / (2 * mass);
  const discriminant = decay * decay - frequency * frequency;
  const rate = decay - Math.sqrt(Math.max(0, discriminant));
  const duration = Math.min(3, Math.max(0.25, 8 / rate));
  const response = (time: number) => {
    if (Math.abs(discriminant) < 0.0001) {
      return 1 - Math.exp(-decay * time) * (1 + decay * time);
    }
    const omega = Math.sqrt(Math.abs(discriminant));
    if (discriminant < 0) {
      return (
        1 -
        Math.exp(-decay * time) *
          (Math.cos(omega * time) + (decay / omega) * Math.sin(omega * time))
      );
    }
    const slow = -decay + omega;
    const fast = -decay - omega;
    return (
      1 -
      (fast * Math.exp(slow * time) - slow * Math.exp(fast * time)) /
        (fast - slow)
    );
  };
  const end = response(duration);
  return {
    duration,
    ease: (progress: number) => response(progress * duration) / end,
  };
}

type Selection = { item: ProjectRevealItem; source: HTMLButtonElement };

function ProjectRevealPanel({
  selection,
  open,
  onExitComplete,
  overlayRef,
  stiffness = 300,
  damping = 32,
  mass = 1,
  speed = 1,
  closeSpeed = 1.15,
  borderRadius = 12,
  modalWidth = 840,
  imageRatio = 0.455,
  showYear = true,
  closeOnOutsideClick = true,
  actionLabel = "View project",
  modalClassName,
}: ProjectRevealProps & {
  selection: Selection;
  open: boolean;
  onExitComplete: () => void;
  overlayRef: React.RefObject<HTMLDivElement | null>;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const imageRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const categoryRef = React.useRef<HTMLSpanElement>(null);
  const yearRef = React.useRef<HTMLSpanElement>(null);
  const detailRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const timelineRef = React.useRef<gsap.core.Timeline | null>(null);
  const initializedRef = React.useRef(false);
  const reducedMotionRef = React.useRef(false);
  const transitionRef = React.useRef<(() => void) | null>(null);
  const { item, source } = selection;

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          standard: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          reducedMotionRef.current = Boolean(context.conditions?.reduced);
          transitionRef.current?.();
        },
      );
      const resize = () => transitionRef.current?.();
      window.addEventListener("resize", resize);
      window.visualViewport?.addEventListener("resize", resize);
      return () => {
        media.revert();
        window.removeEventListener("resize", resize);
        window.visualViewport?.removeEventListener("resize", resize);
        transitionRef.current = null;
        timelineRef.current?.kill();
        initializedRef.current = false;
      };
    },
    { scope: panelRef },
  );

  useGSAP(
    (_context, contextSafe) => {
      const transition = contextSafe!(() => {
        const panel = panelRef.current;
        const image = imageRef.current;
        const title = titleRef.current;
        const category = categoryRef.current;
        const detail = detailRef.current;
        const overlay = overlayRef.current;
        if (!panel || !image || !title || !category || !detail || !overlay)
          return;

        const row = source.getBoundingClientRect();
        const thumbnail = source
          .querySelector("[data-project-image]")!
          .getBoundingClientRect();
        const rowTitle = source.querySelector("[data-project-title]")!;
        const titleBounds = rowTitle.getBoundingClientRect();
        const categoryBounds = source
          .querySelector("[data-project-category]")!
          .getBoundingClientRect();
        const yearBounds = source
          .querySelector("[data-project-year]")
          ?.getBoundingClientRect();
        const viewport = window.visualViewport;
        const viewportWidth = viewport?.width ?? window.innerWidth;
        const viewportHeight = viewport?.height ?? window.innerHeight;
        const width = Math.min(
          bounded(modalWidth, 840, 320, 1400),
          viewportWidth - 32,
        );
        const stacked = width < 560;
        const height = Math.min(
          stacked ? 640 : width * 0.6,
          viewportHeight - 48,
        );
        const padding = stacked ? 24 : 32;
        const imageWidth = stacked
          ? width
          : width * bounded(imageRatio, 0.455, 0.3, 0.6);
        const imageHeight = stacked
          ? Math.min(width * 0.8, height * 0.46)
          : height;
        const contentX = stacked ? padding : imageWidth + padding;
        const contentY = stacked ? imageHeight + padding : padding;
        const contentWidth = width - contentX - padding;
        const titleSize = stacked ? 28 : 36;
        const rowTitleSize = parseFloat(getComputedStyle(rowTitle).fontSize);
        const x = (viewport?.offsetLeft ?? 0) + (viewportWidth - width) / 2;
        const y = (viewport?.offsetTop ?? 0) + (viewportHeight - height) / 2;
        const spring = createSpring(
          bounded(stiffness, 300, 80, 800),
          bounded(damping, 32, 12, 80),
          bounded(mass, 1, 0.25, 3),
        );
        const duration = reducedMotionRef.current
          ? 0
          : spring.duration /
            (bounded(speed, 1, 0.25, 3) *
              (open ? 1 : bounded(closeSpeed, 1.15, 0.5, 2)));
        const local = (bounds: DOMRect) => ({
          x: bounds.left - row.left,
          y: bounds.top - row.top,
        });
        const rowYear =
          yearBounds && yearRef.current
            ? {
                x: yearBounds.right - row.left - yearRef.current.offsetWidth,
                y: yearBounds.top - row.top,
              }
            : null;

        timelineRef.current?.kill();
        gsap.set(title, { fontSize: titleSize });
        if (!initializedRef.current) {
          gsap.set(panel, {
            x: row.left,
            y: row.top,
            width: row.width,
            height: row.height,
            opacity: 1,
            borderRadius: 4,
          });
          gsap.set(image, {
            ...local(thumbnail),
            width: thumbnail.width,
            height: thumbnail.height,
            borderRadius: 2,
          });
          gsap.set(title, {
            ...local(titleBounds),
            scale: rowTitleSize / titleSize,
          });
          gsap.set(category, local(categoryBounds));
          if (yearRef.current && rowYear) gsap.set(yearRef.current, rowYear);
          gsap.set([detail, overlay], { autoAlpha: 0 });
          gsap.set(closeRef.current, { opacity: 0 });
          initializedRef.current = true;
        }
        const detailY = contentY + titleSize * 1.15 + 48;
        gsap.set(detail, {
          left: contentX,
          top: detailY,
          width: contentWidth,
          height: Math.max(0, height - detailY - padding),
        });
        gsap.set(title, { maxWidth: open ? contentWidth - 8 : "none" });
        gsap.set(panel, { opacity: 1, willChange: "transform" });
        const timeline = gsap.timeline({
          defaults: { duration, ease: spring.ease, overwrite: "auto" },
          onComplete: contextSafe!(() => {
            gsap.set(panel, { clearProps: "willChange" });
            if (!open) onExitComplete();
          }),
        });
        timeline
          .to(
            panel,
            open
              ? {
                  x,
                  y,
                  width,
                  height,
                  borderRadius: bounded(borderRadius, 12, 0, 32),
                }
              : {
                  x: row.left,
                  y: row.top,
                  width: row.width,
                  height: row.height,
                  borderRadius: 4,
                },
            0,
          )
          .to(
            image,
            open
              ? {
                  x: 0,
                  y: 0,
                  width: imageWidth,
                  height: imageHeight,
                  borderRadius: 0,
                }
              : {
                  ...local(thumbnail),
                  width: thumbnail.width,
                  height: thumbnail.height,
                  borderRadius: 2,
                },
            0,
          )
          .to(
            title,
            open
              ? { x: contentX, y: contentY, scale: 1 }
              : {
                  ...local(titleBounds),
                  scale: rowTitleSize / titleSize,
                },
            0,
          )
          .to(
            category,
            open
              ? { x: contentX, y: contentY + titleSize * 1.15 + 10 }
              : local(categoryBounds),
            0,
          )
          .to(
            overlay,
            {
              autoAlpha: open ? 1 : 0,
              duration: duration * 0.7,
              ease: "power2.inOut",
            },
            0,
          )
          .to(
            detail,
            {
              autoAlpha: open ? 1 : 0,
              y: open ? 0 : 8,
              duration: duration * (open ? 0.45 : 0.2),
              ease: "power2.out",
            },
            open ? duration * 0.22 : 0,
          )
          .to(
            closeRef.current,
            {
              opacity: open ? 1 : 0,
              duration: duration * 0.25,
              ease: "power2.out",
            },
            open ? duration * 0.35 : 0,
          );
        if (yearRef.current && rowYear) {
          timeline.to(
            yearRef.current,
            open
              ? {
                  x: contentX + category.offsetWidth + 16,
                  y: contentY + titleSize * 1.15 + 10,
                }
              : rowYear,
            0,
          );
        }
        timelineRef.current = timeline;
      });
      transitionRef.current = transition;
      transition();
    },
    {
      scope: panelRef,
      dependencies: [
        open,
        stiffness,
        damping,
        mass,
        speed,
        closeSpeed,
        borderRadius,
        modalWidth,
        imageRatio,
        showYear,
        onExitComplete,
        source,
      ],
    },
  );

  return (
    <Dialog.Content
      ref={panelRef}
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        closeRef.current?.focus({ preventScroll: true });
      }}
      onCloseAutoFocus={(event) => {
        event.preventDefault();
        source.focus({ preventScroll: true });
      }}
      onInteractOutside={(event) => {
        if (!closeOnOutsideClick || !open) event.preventDefault();
      }}
      onEscapeKeyDown={(event) => {
        if (!open) event.preventDefault();
      }}
      className={cn(
        "fixed left-0 top-0 z-50 overflow-hidden bg-white font-sans text-zinc-950 shadow-[0_24px_100px_-24px_rgba(0,0,0,0.3)] outline-none dark:bg-[#18181b] dark:text-zinc-50",
        modalClassName,
      )}
      style={{ opacity: 0 }}
      data-project-panel
      data-state={open ? "opening" : "closing"}
    >
      <div
        ref={imageRef}
        className="absolute left-0 top-0 overflow-hidden bg-zinc-200 dark:bg-zinc-800"
      >
        <img
          src={item.image}
          alt={item.imageAlt ?? item.title}
          draggable={false}
          className="h-full w-full object-cover"
          style={{ objectPosition: item.imagePosition }}
        />
      </div>
      <Dialog.Title
        ref={titleRef}
        className="absolute left-0 top-0 origin-top-left truncate font-normal leading-[1.15] tracking-[-0.045em]"
      >
        {item.title}
      </Dialog.Title>
      <span
        ref={categoryRef}
        className="absolute left-0 top-0 text-[11px] leading-4 text-zinc-500 dark:text-zinc-400"
      >
        {item.category}
      </span>
      {showYear && (
        <span
          ref={yearRef}
          className="absolute left-0 top-0 text-[11px] leading-4 text-zinc-500 dark:text-zinc-400"
        >
          {item.year}
        </span>
      )}
      <div
        ref={detailRef}
        className="absolute flex flex-col justify-end-safe gap-5 overflow-y-auto overscroll-contain text-sm leading-relaxed"
      >
        <Dialog.Description className="text-zinc-600 dark:text-zinc-300">
          {item.description}
        </Dialog.Description>
        {item.content}
        {item.href && (
          <a
            href={item.href}
            className="flex w-fit shrink-0 items-center gap-1 border-b border-current pb-0.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4"
          >
            {actionLabel}
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </a>
        )}
      </div>
      <Dialog.Close asChild>
        <button
          ref={closeRef}
          type="button"
          disabled={!open}
          aria-label="Close project"
          className="absolute right-3 top-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </Dialog.Close>
    </Dialog.Content>
  );
}

export function ProjectReveal({
  items,
  thumbnailSize = 36,
  overlayOpacity = 0.4,
  showYear = true,
  hoverDuration = 0.35,
  hoverClassName,
  ariaLabel = "Selected projects",
  className,
  rowClassName,
  onOpenChange,
  ...panelProps
}: ProjectRevealProps) {
  const [selection, setSelection] = React.useState<Selection | null>(null);
  const [open, setOpen] = React.useState(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const highlightRef = React.useRef<HTMLLIElement>(null);
  const hoveredRowRef = React.useRef<HTMLButtonElement | null>(null);
  const focusedRowRef = React.useRef<HTMLButtonElement | null>(null);
  const syncHighlightRef = React.useRef<
    ((row: HTMLButtonElement | null, immediate?: boolean) => void) | null
  >(null);
  const onExitComplete = React.useCallback(() => setSelection(null), []);
  const size = bounded(thumbnailSize, 36, 24, 64);

  useGSAP(
    () => {
      const list = listRef.current;
      const highlight = highlightRef.current;
      if (!list || !highlight) return;

      const media = gsap.matchMedia();
      media.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          standard: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const spring = createSpring(450, 38, 0.9);
          const sync = context.add(
            "syncHighlight",
            (row: HTMLButtonElement | null, immediate = false) => {
              const duration =
                context.conditions?.reduced || immediate
                  ? 0
                  : bounded(hoverDuration, 0.35, 0.1, 0.8);

              if (
                !row?.isConnected ||
                getComputedStyle(row).visibility === "hidden"
              ) {
                gsap.to(highlight, {
                  autoAlpha: 0,
                  duration: duration * 0.55,
                  ease: "power2.out",
                  overwrite: "auto",
                });
                return;
              }

              const listBounds = list.getBoundingClientRect();
              const rowBounds = row.getBoundingClientRect();
              const geometry = {
                x: rowBounds.left - listBounds.left,
                y: rowBounds.top - listBounds.top,
                width: rowBounds.width,
                height: rowBounds.height,
              };
              if (Number(gsap.getProperty(highlight, "opacity")) === 0) {
                gsap.set(highlight, geometry);
              }
              gsap.to(highlight, {
                ...geometry,
                autoAlpha: 1,
                duration,
                ease: spring.ease,
                overwrite: "auto",
              });
            },
          );

          syncHighlightRef.current = (row, immediate) => sync(row, immediate);
          const resize = () =>
            sync(hoveredRowRef.current ?? focusedRowRef.current, true);
          const observer = new ResizeObserver(resize);
          observer.observe(list);
          resize();
          return () => {
            observer.disconnect();
            syncHighlightRef.current = null;
          };
        },
        list,
      );
      return () => media.revert();
    },
    { scope: listRef, dependencies: [hoverDuration], revertOnUpdate: true },
  );

  return (
    <Dialog.Root
      open={selection !== null}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && open) {
          setOpen(false);
          onOpenChange?.(null);
        }
      }}
    >
      <ul
        ref={listRef}
        aria-label={ariaLabel}
        onPointerLeave={() => {
          hoveredRowRef.current = null;
          syncHighlightRef.current?.(focusedRowRef.current);
        }}
        className={cn("relative isolate w-full max-w-2xl font-sans", className)}
      >
        <li
          ref={highlightRef}
          aria-hidden="true"
          data-project-highlight
          className={cn(
            "pointer-events-none absolute left-0 top-0 z-0 rounded-md bg-zinc-950/[0.035] ring-1 ring-inset ring-zinc-950/2.5 dark:bg-white/7.5 dark:ring-white/[0.035]",
            hoverClassName,
          )}
          style={{ opacity: 0, visibility: "hidden" }}
        />
        {items.map((item) => (
          <li
            key={item.id}
            className="relative z-10 border-b border-zinc-200/70 last:border-b-0 dark:border-zinc-800"
          >
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label={`Open ${item.title}`}
                aria-expanded={selection?.item.id === item.id}
                className={cn(
                  "group flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-sm px-2 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
                  rowClassName,
                )}
                style={{
                  visibility:
                    selection?.item.id === item.id ? "hidden" : undefined,
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType === "touch") return;
                  hoveredRowRef.current = event.currentTarget;
                  syncHighlightRef.current?.(event.currentTarget);
                }}
                onFocus={(event) => {
                  if (!event.currentTarget.matches(":focus-visible")) return;
                  focusedRowRef.current = event.currentTarget;
                  syncHighlightRef.current?.(event.currentTarget);
                }}
                onBlur={() => {
                  focusedRowRef.current = null;
                  syncHighlightRef.current?.(hoveredRowRef.current);
                }}
                onClick={(event) => {
                  syncHighlightRef.current?.(null);
                  setSelection({ item, source: event.currentTarget });
                  setOpen(true);
                  onOpenChange?.(item);
                }}
              >
                <span
                  data-project-image
                  className="shrink-0 overflow-hidden rounded-xs bg-zinc-200 dark:bg-zinc-800"
                  style={{ width: size, height: size * 1.25 }}
                >
                  <img
                    src={item.image}
                    alt=""
                    width={size}
                    height={size * 1.25}
                    draggable={false}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: item.imagePosition }}
                  />
                </span>
                <span
                  data-project-title
                  className="min-w-0 flex-1 truncate text-[13px] font-normal leading-[1.15] tracking-[-0.045em] text-zinc-950 dark:text-zinc-100"
                >
                  {item.title}
                </span>
                <span
                  data-project-category
                  className="w-24 shrink-0 truncate text-[11px] leading-4 text-zinc-500 dark:text-zinc-400 sm:w-32"
                >
                  {item.category}
                </span>
                {showYear && (
                  <span
                    data-project-year
                    className="w-9 shrink-0 text-right text-[11px] leading-4 text-zinc-500 dark:text-zinc-400"
                  >
                    {item.year}
                  </span>
                )}
              </button>
            </Dialog.Trigger>
          </li>
        ))}
      </ul>
      {selection && (
        <Dialog.Portal>
          <Dialog.Overlay
            ref={overlayRef}
            className="fixed inset-0 z-40"
            style={{
              backgroundColor: `rgba(0,0,0,${bounded(overlayOpacity, 0.4, 0, 0.8)})`,
            }}
          />
          <ProjectRevealPanel
            {...panelProps}
            items={items}
            selection={selection}
            open={open}
            onExitComplete={onExitComplete}
            overlayRef={overlayRef}
            showYear={showYear}
          />
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}

export default ProjectReveal;
