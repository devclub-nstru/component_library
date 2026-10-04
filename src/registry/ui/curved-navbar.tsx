"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export interface CurvedNavbarItem {
  label: string;
  href: string;
  description?: string;
}

export interface CurvedNavbarProps {
  brand?: string;
  brandHref?: string;
  logo?: ReactNode;
  logoSrc?: string;
  items?: readonly CurvedNavbarItem[];
  actionLabel?: string;
  actionHref?: string;
  panelHeading?: string;
  panelDescription?: string;
  children?: ReactNode;
  duration?: number;
  stiffness?: number;
  closeDelay?: number;
  compactWidth?: number;
  expandedWidth?: number;
  curveRadius?: number;
  background?: string;
  foreground?: string;
  accent?: string;
  openOnHover?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const CURVED_NAVBAR_ITEMS: readonly CurvedNavbarItem[] = [
  {
    label: "Features",
    href: "#features",
    description: "Built for your everyday flow.",
  },
  {
    label: "Stories",
    href: "#stories",
    description: "A little inspiration, every day.",
  },
  {
    label: "Updates",
    href: "#updates",
    description: "See what we have been working on.",
  },
  {
    label: "About",
    href: "#about",
    description: "The people behind the details.",
  },
];

const bounded = (value: number, min: number, max: number, fallback: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

export function CurvedNavbar({
  brand = "devclub",
  brandHref = "#home",
  logo,
  logoSrc = "https://i.pinimg.com/736x/16/16/72/16167292c79a7d3ca27ef4f94d1b7424.jpg",
  items = CURVED_NAVBAR_ITEMS,
  actionLabel = "Get started",
  actionHref = "#get-started",
  panelHeading = "A space for everything.",
  panelDescription = "Explore the details. Find your next perspective.",
  children,
  duration = 0.6,
  stiffness = 0.35,
  closeDelay = 0.12,
  compactWidth = 880,
  expandedWidth = 1040,
  curveRadius = 26,
  background = "#080808",
  foreground = "#f5f5f5",
  accent = "#b9f582",
  openOnHover = true,
  onOpenChange,
  className,
}: CurvedNavbarProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const closeRef = useRef<gsap.core.Tween | null>(null);
  const animateRef = useRef<((expanded: boolean) => void) | null>(null);
  const openRef = useRef(false);
  const changeRef = useRef(onOpenChange);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const radius = bounded(curveRadius, 12, 40, 26);
  const speed = bounded(duration, 0.15, 1.5, 0.6);
  const spring = bounded(stiffness, 0, 1, 0.35);
  const delay = bounded(closeDelay, 0, 0.6, 0.12);
  const narrowWidth = bounded(compactWidth, 320, 1400, 880);
  const wideWidth = Math.max(
    narrowWidth,
    bounded(expandedWidth, 320, 1600, 1040),
  );

  useEffect(() => {
    changeRef.current = onOpenChange;
  }, [onOpenChange]);

  const updateOpen = (next: boolean) => {
    closeRef.current?.kill();
    if (openRef.current === next) return;
    openRef.current = next;
    setOpen(next);
    changeRef.current?.(next);
  };

  useGSAP(
    () => {
      const frame = frameRef.current;
      const shell = shellRef.current;
      const panel = panelRef.current;
      const content = contentRef.current;
      if (!frame || !shell || !panel || !content) return;
      const media = gsap.matchMedia();
      media.add(
        { reduced: "(prefers-reduced-motion: reduce)", all: "all" },
        (context) => {
          const reduced = Boolean(context.conditions?.reduced);
          let needsResize = false;
          const build = context.add("build", () => {
            needsResize = false;
            const wasOpen = openRef.current;
            timelineRef.current?.kill();
            const available = frame.clientWidth;
            const collapsed = Math.min(
              narrowWidth,
              Math.max(0, available - 48),
            );
            const mobile = available < 680;
            const viewportHeight = Math.max(
              64,
              frame.parentElement?.clientHeight ?? 0,
            );
            const fullHeight =
              viewportHeight > 80 ? viewportHeight : window.innerHeight;
            const expanded = mobile
              ? available
              : Math.min(wideWidth, Math.max(0, available - 32));
            gsap.set(content, {
              maxHeight: mobile
                ? Math.max(0, fullHeight - 64)
                : "min(440px,65vh)",
            });
            const entries = content.querySelectorAll("[data-navbar-entry]");
            gsap.set(shell, { width: expanded });
            const expandedHeight = mobile
              ? Math.max(0, fullHeight - 64)
              : content.offsetHeight;
            gsap.set(shell, {
              width: collapsed,
              top: 0,
              borderBottomLeftRadius: radius,
              borderBottomRightRadius: radius,
            });
            gsap.set(panel, { height: 0, autoAlpha: 0 });
            gsap.set(entries, { y: reduced ? 0 : 12, opacity: 0 });
            const timeline = gsap
              .timeline({
                paused: true,
                onComplete: () => {
                  if (needsResize) build();
                },
                onReverseComplete: () => {
                  if (needsResize) build();
                },
              })
              .to(
                shell,
                {
                  width: expanded,
                  top: mobile ? -frame.offsetTop : 0,
                  borderBottomLeftRadius: mobile ? 0 : radius,
                  borderBottomRightRadius: mobile ? 0 : radius,
                  duration: reduced ? 0 : speed,
                  ease:
                    spring === 0 ? "power3.out" : `back.out(${spring * 0.8})`,
                },
                0,
              )
              .to(
                panel,
                {
                  height: expandedHeight,
                  autoAlpha: 1,
                  duration: reduced ? 0 : speed,
                  ease: "power3.inOut",
                },
                0,
              )
              .to(
                entries,
                {
                  y: 0,
                  opacity: 1,
                  duration: reduced ? 0 : speed * 0.55,
                  stagger: reduced ? 0 : Math.min(0.035, speed / 12),
                  ease: "power3.out",
                },
                reduced ? 0 : speed * 0.22,
              );
            timelineRef.current = timeline;
            if (reduced) animate(wasOpen);
            else if (wasOpen) timeline.progress(1);
          });
          const animate = context.add("animate", (next: boolean) => {
            if (reduced) {
              const available = frame.clientWidth;
              const mobile = available < 680;
              const viewportHeight = Math.max(
                64,
                frame.parentElement?.clientHeight ?? 0,
              );
              const fullHeight =
                viewportHeight > 80 ? viewportHeight : window.innerHeight;
              gsap.set(shell, {
                width:
                  next && mobile
                    ? available
                    : Math.min(
                        next ? wideWidth : narrowWidth,
                        Math.max(0, available - (next ? 32 : 48)),
                      ),
                top: next && mobile ? -frame.offsetTop : 0,
                borderBottomLeftRadius: next && mobile ? 0 : radius,
                borderBottomRightRadius: next && mobile ? 0 : radius,
              });
              gsap.set(panel, {
                height: next
                  ? mobile
                    ? Math.max(0, fullHeight - 64)
                    : content.offsetHeight
                  : 0,
                autoAlpha: next ? 1 : 0,
              });
              gsap.set(content.querySelectorAll("[data-navbar-entry]"), {
                y: 0,
                opacity: next ? 1 : 0,
              });
            } else if (next) {
              timelineRef.current?.play();
            } else {
              timelineRef.current?.reverse();
            }
          });
          animateRef.current = (next) => animate(next);
          const leave = context.add("leave", (event: PointerEvent) => {
            if (event.pointerType !== "mouse" || frame.clientWidth < 680)
              return;
            if (shell.contains(document.activeElement)) return;
            closeRef.current?.kill();
            closeRef.current = gsap.delayedCall(delay, () => updateOpen(false));
          });
          const handleLeave = (event: PointerEvent) => leave(event);
          shell.addEventListener("pointerleave", handleLeave);
          build();
          const observer = new ResizeObserver(() => {
            const timeline = timelineRef.current;
            if (timeline?.isActive()) {
              needsResize = true;
              return;
            }
            build();
          });
          observer.observe(frame);
          if (frame.parentElement) observer.observe(frame.parentElement);
          observer.observe(content);
          return () => {
            observer.disconnect();
            shell.removeEventListener("pointerleave", handleLeave);
            closeRef.current?.kill();
            timelineRef.current?.kill();
            timelineRef.current = null;
            animateRef.current = null;
          };
        },
      );
      return () => media.revert();
    },
    {
      scope: frameRef,
      dependencies: [
        speed,
        spring,
        delay,
        radius,
        narrowWidth,
        wideWidth,
        items,
        children,
      ],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      closeRef.current?.kill();
      animateRef.current?.(open);
    },
    { scope: frameRef, dependencies: [open] },
  );

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !shellRef.current?.contains(event.target)
      ) {
        openRef.current = false;
        setOpen(false);
        changeRef.current?.(false);
      }
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  return (
    <div
      ref={frameRef}
      data-slot="curved-navbar"
      className={cn("@container/nav relative z-20 h-16 w-full", className)}
    >
      <nav
        ref={shellRef}
        aria-label={`${brand} navigation`}
        data-open={open}
        className="absolute left-1/2 top-0 w-[calc(100%-48px)] -translate-x-1/2 rounded-b-(--nav-radius) shadow-[0_16px_48px_-20px_rgba(0,0,0,0.6)]"
        style={
          {
            background,
            color: foreground,
            "--nav-radius": `${radius}px`,
            "--nav-accent": accent,
          } as React.CSSProperties
        }
        onPointerEnter={(event) => {
          closeRef.current?.kill();
          if (
            openOnHover &&
            event.pointerType === "mouse" &&
            (frameRef.current?.clientWidth ?? 0) >= 680
          )
            updateOpen(true);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            updateOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Escape" || !open) return;
          event.preventDefault();
          event.stopPropagation();
          updateOpen(false);
          triggerRef.current?.focus();
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 40 40"
          className="pointer-events-none absolute right-full top-0"
          style={{ width: radius, height: radius, fill: background }}
        >
          <path d="M0 0H40V40C40 18 22 0 0 0Z" />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 40 40"
          className="pointer-events-none absolute left-full top-0 -scale-x-100"
          style={{ width: radius, height: radius, fill: background }}
        >
          <path d="M0 0H40V40C40 18 22 0 0 0Z" />
        </svg>
        <div className="flex h-16 items-center gap-3 px-4 @[680px]/nav:px-5">
          <a
            href={brandHref}
            onClick={() => updateOpen(false)}
            className="flex shrink-0 items-center gap-2.5 rounded-md font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--nav-accent)"
          >
            <span
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-[10px] bg-(--nav-accent) text-black"
            >
              {logo ??
                (logoSrc ? (
                  <img
                    src={logoSrc}
                    alt=""
                    className="size-full rounded-[inherit] object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold">{brand.slice(0, 1)}</span>
                ))}
            </span>
            <span className="max-w-28 truncate">{brand}</span>
          </a>
          <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 @[680px]/nav:flex">
            {items.slice(0, 6).map((item) => (
              <a
                key={`${item.label}-${item.href}`}
                href={item.href}
                onClick={() => updateOpen(false)}
                className="truncate rounded-lg px-3 py-2 text-[13px] opacity-65 hover:bg-white/8 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-(--nav-accent)"
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            href={actionHref}
            onClick={() => updateOpen(false)}
            className="ml-auto hidden min-h-9 shrink-0 items-center gap-1.5 rounded-xl bg-(--nav-accent) px-3 text-xs font-semibold text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--nav-accent) @[680px]/nav:flex @[680px]/nav:text-[13px]"
          >
            {actionLabel}
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
          <button
            ref={triggerRef}
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => updateOpen(!openRef.current)}
            className="ml-auto flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/8 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-(--nav-accent) @[680px]/nav:sr-only @[680px]/nav:focus-visible:not-sr-only @[680px]/nav:focus-visible:absolute @[680px]/nav:focus-visible:right-5 @[680px]/nav:focus-visible:top-4 @[680px]/nav:focus-visible:h-8 @[680px]/nav:focus-visible:w-auto @[680px]/nav:focus-visible:bg-[#222] @[680px]/nav:focus-visible:px-3"
          >
            <span className="@[680px]/nav:hidden">
              {open ? (
                <X aria-hidden="true" className="size-4" />
              ) : (
                <Menu aria-hidden="true" className="size-4" />
              )}
            </span>
            <span className="hidden text-xs @[680px]/nav:block">
              {open ? "Close" : "Menu"}
            </span>
          </button>
        </div>
        <div
          ref={panelRef}
          id={panelId}
          aria-hidden={!open}
          inert={!open}
          className="h-0 overflow-hidden invisible"
        >
          <div
            ref={contentRef}
            className="max-h-[min(440px,65vh)] overflow-y-auto overscroll-contain border-t border-white/10 scrollbar-thin [scrollbar-color:rgba(255,255,255,0.2)_transparent]"
          >
            <div className="grid gap-6 p-5 @[680px]/nav:grid-cols-[1fr_1.1fr_1fr] @[680px]/nav:gap-8 @[680px]/nav:p-7">
              <div
                data-navbar-entry
                className="flex flex-col justify-between gap-5"
              >
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-45">
                    Discover {brand}
                  </span>
                  <h2 className="mt-3 max-w-64 text-2xl font-medium leading-tight tracking-tight">
                    {panelHeading}
                  </h2>
                  <p className="mt-3 max-w-64 text-xs leading-relaxed opacity-50">
                    {panelDescription}
                  </p>
                </div>
                <a
                  href={actionHref}
                  onClick={() => updateOpen(false)}
                  className="flex w-fit items-center gap-2 rounded-md text-xs text-(--nav-accent) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--nav-accent)"
                >
                  {actionLabel}
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </a>
              </div>
              <div className="grid content-start gap-1">
                {items.map((item, index) => (
                  <a
                    data-navbar-entry
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    onClick={() => updateOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/6 focus-visible:outline-2 focus-visible:outline-(--nav-accent)]"
                  >
                    <span
                      aria-hidden="true"
                      className="text-[10px] tabular-nums opacity-30"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="mt-0.5 block text-[11px] leading-relaxed opacity-45">
                          {item.description}
                        </span>
                      )}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5 shrink-0 opacity-25 group-hover:opacity-100"
                    />
                  </a>
                ))}
              </div>
              {children && (
                <div data-navbar-entry className="min-w-0">
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default CurvedNavbar;
