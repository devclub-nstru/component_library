"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight, ChevronDown, Code2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export interface FullscreenNavbarLink {
  label: string;
  href: string;
}

export interface FullscreenNavbarItem {
  label: string;
  href?: string;
  links?: readonly FullscreenNavbarLink[];
}

export interface FullscreenNavbarSpotlight {
  title: string;
  description: string;
  tag?: string;
  image: string;
  href: string;
}

export interface FullscreenNavbarProps {
  brand?: string;
  brandHref?: string;
  logo?: ReactNode;
  items?: readonly FullscreenNavbarItem[];
  connectLinks?: readonly FullscreenNavbarLink[];
  spotlight?: FullscreenNavbarSpotlight;
  actionLabel?: string;
  actionHref?: string;
  footerText?: string;
  contactLabel?: string;
  contactHref?: string;
  duration?: number;
  stiffness?: number;
  damping?: number;
  stagger?: number;
  background?: string;
  foreground?: string;
  accent?: string;
  headerForeground?: string;
  hoverDropdowns?: boolean;
  contained?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const FULLSCREEN_NAVBAR_ITEMS: readonly FullscreenNavbarItem[] = [
  {
    label: "Components",
    links: [
      { label: "Explore the library", href: "/components" },
      { label: "Animated buttons", href: "/components/animated-button" },
      { label: "Navigation bars", href: "/components/curved-navbar" },
      { label: "Image loaders", href: "/components/grid-image-loader" },
    ],
  },
  {
    label: "Documentation",
    links: [
      { label: "Introduction", href: "/docs/introduction" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Theming", href: "/docs/theming" },
      { label: "CLI & registry", href: "/docs/cli" },
    ],
  },
  {
    label: "Community",
    links: [
      {
        label: "Dev Club on GitHub",
        href: "https://github.com/devclub-nstru/component_library",
      },
      {
        label: "Report an issue",
        href: "https://github.com/devclub-nstru/component_library/issues",
      },
      {
        label: "Contribute",
        href: "https://github.com/devclub-nstru/component_library/blob/main/CONTRIBUTING.md",
      },
    ],
  },
  { label: "Showcase", href: "/components" },
  { label: "Our story", href: "/docs/introduction" },
  {
    label: "Source code",
    href: "https://github.com/devclub-nstru/component_library",
  },
];

export const FULLSCREEN_NAVBAR_CONNECT_LINKS: readonly FullscreenNavbarLink[] =
  [
    {
      label: "GitHub",
      href: "https://github.com/devclub-nstru/component_library",
    },
    { label: "Docs", href: "/docs" },
    { label: "Dev Club", href: "https://devclub.co" },
  ];

const bounded = (value: number, min: number, max: number, fallback: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

function springEase(stiffness: number, damping: number, duration: number) {
  const frequency = Math.sqrt(stiffness);
  const ratio = damping / (2 * frequency);
  const response = (time: number) => {
    if (ratio < 1) {
      const rate = frequency * Math.sqrt(1 - ratio * ratio);
      return (
        1 -
        Math.exp((-damping * time) / 2) *
          (Math.cos(rate * time) +
            (damping / (2 * rate)) * Math.sin(rate * time))
      );
    }
    if (Math.abs(ratio - 1) < 0.001)
      return 1 - (1 + frequency * time) * Math.exp(-frequency * time);
    const delta = Math.sqrt(ratio * ratio - 1);
    const slow = -frequency * (ratio - delta);
    const fast = -frequency * (ratio + delta);
    return (
      1 -
      (fast * Math.exp(slow * time) - slow * Math.exp(fast * time)) /
        (fast - slow)
    );
  };
  const end = response(duration);
  return (progress: number) =>
    progress === 1 ? 1 : response(progress * duration) / Math.max(0.001, end);
}

function NavbarHeader({
  brand,
  brandHref,
  logo,
  actionLabel,
  actionHref,
  menuButton,
  onNavigate,
}: {
  brand: string;
  brandHref: string;
  logo?: ReactNode;
  actionLabel: string;
  actionHref: string;
  menuButton: ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-20 w-full items-center justify-between gap-3 px-5 @[760px]/fullnav:px-9">
      <a
        href={brandHref}
        onClick={onNavigate}
        className="flex min-w-0 items-center gap-2.5 rounded-lg text-xl font-semibold tracking-[-0.04em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--fullnav-accent)"
      >
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg"
        >
          {logo ?? <Code2 className="size-7" />}
        </span>
        <span className="max-w-32 truncate">{brand}</span>
      </a>
      <div className="flex shrink-0 items-center gap-2">
        <a
          href={actionHref}
          onClick={onNavigate}
          className="hidden min-h-10 items-center gap-1.5 rounded-full bg-(--fullnav-accent) px-4 text-xs font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--fullnav-accent) @[480px]/fullnav:flex"
        >
          {actionLabel}
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </a>
        {menuButton}
      </div>
    </div>
  );
}

const HOVER_CLICK_GRACE_MS = 350;

const menuButtonClass =
  "flex min-h-10 min-w-24 cursor-pointer items-center justify-center gap-2 rounded-full border border-current/15 bg-current/5 px-4 text-xs font-medium backdrop-blur-lg hover:bg-current/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--fullnav-accent)]";

function NavbarRow({
  item,
  index,
  expanded,
  onExpand,
  onNavigate,
  mobile,
  duration,
  stiffness,
  damping,
  hoverDropdowns,
}: {
  item: FullscreenNavbarItem;
  index: number;
  expanded: boolean;
  onExpand: () => void;
  onNavigate: () => void;
  mobile: boolean;
  duration: number;
  stiffness: number;
  damping: number;
  hoverDropdowns: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const animateRef = useRef<((next: boolean) => void) | null>(null);
  const expandedRef = useRef(expanded);
  const hoverOpenedAtRef = useRef(0);
  const id = useId();
  const hasLinks = Boolean(item.links?.length);
  useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  useGSAP(
    () => {
      const panel = panelRef.current;
      const content = contentRef.current;
      const arrow = arrowRef.current;
      if (!panel || !content || !arrow) return;
      const media = gsap.matchMedia();
      media.add(
        { reduced: "(prefers-reduced-motion: reduce)", all: "all" },
        (context) => {
          const reduced = Boolean(context.conditions?.reduced);
          const animate = context.add("animate", (next: boolean) => {
            gsap.killTweensOf([panel, arrow, content]);
            if (reduced) {
              gsap.set(panel, {
                height: next ? "auto" : 0,
                autoAlpha: next ? 1 : 0,
              });
              gsap.set(arrow, { rotation: next ? 180 : 0 });
              gsap.set(content, { y: 0, opacity: 1 });
              return;
            }
            gsap.to(panel, {
              height: next ? "auto" : 0,
              autoAlpha: next ? 1 : 0,
              duration: duration * 0.55,
              ease: "power3.inOut",
              overwrite: "auto",
            });
            gsap.to(arrow, {
              rotation: next ? 180 : 0,
              duration: duration * 0.65,
              ease: springEase(stiffness, damping, duration * 0.65),
              overwrite: "auto",
            });
            gsap.fromTo(
              content,
              { y: next ? 8 : 0, opacity: next ? 0 : 1 },
              {
                y: 0,
                opacity: next ? 1 : 0,
                duration: duration * 0.45,
                ease: "power3.out",
              },
            );
          });
          animateRef.current = (next) => animate(next);
          animate(expandedRef.current);
          return () => {
            animateRef.current = null;
          };
        },
      );
      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [duration, stiffness, damping, item.links],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      animateRef.current?.(expanded);
    },
    { scope: rootRef, dependencies: [expanded] },
  );

  const label = (
    <>
      <span
        aria-hidden="true"
        className="w-7 shrink-0 pt-1 text-[10px] font-normal tabular-nums tracking-wide opacity-35 @[760px]/fullnav:w-9"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        data-fullnav-label
        className="min-w-0 wrap-break-words text-[clamp(1.65rem,4.8cqw,3.75rem)] font-semibold leading-[1.08] tracking-[-0.055em]"
      >
        {item.label}
      </span>
      {hasLinks ? (
        <ChevronDown
          ref={arrowRef}
          data-fullnav-arrow="chevron"
          aria-hidden="true"
          className="ml-2 size-5 shrink-0 opacity-35 @[760px]/fullnav:size-7"
        />
      ) : (
        <ArrowUpRight
          aria-hidden="true"
          data-fullnav-arrow="link"
          className="ml-2 size-5 shrink-0 opacity-0"
        />
      )}
    </>
  );
  const rowClass = cn(
    "group relative z-10 flex w-full items-center rounded-lg py-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fullnav-accent)]",
    expanded && "text-[var(--fullnav-accent)]",
  );
  return (
    <div ref={rootRef} data-fullnav-entry>
      {hasLinks ? (
        <button
          type="button"
          data-fullnav-hit
          id={`trigger-${id}`}
          aria-expanded={expanded}
          aria-controls={`panel-${id}`}
          onClick={(event) => {
            const hoverOpenedAt = hoverOpenedAtRef.current;
            hoverOpenedAtRef.current = 0;
            if (
              event.detail > 0 &&
              hoverOpenedAt > 0 &&
              performance.now() - hoverOpenedAt < HOVER_CLICK_GRACE_MS
            ) {
              return;
            }
            onExpand();
          }}
          onPointerEnter={(event) => {
            if (
              !mobile &&
              hoverDropdowns &&
              event.pointerType === "mouse" &&
              !expanded
            ) {
              hoverOpenedAtRef.current = performance.now();
              onExpand();
            }
          }}
          className={cn(rowClass, "cursor-pointer")}
        >
          {label}
        </button>
      ) : (
        <a
          data-fullnav-hit
          href={item.href ?? "#"}
          onClick={onNavigate}
          className={rowClass}
        >
          {label}
        </a>
      )}
      {hasLinks && (
        <div
          ref={panelRef}
          id={`panel-${id}`}
          role="region"
          aria-labelledby={`trigger-${id}`}
          aria-hidden={!expanded}
          inert={!expanded}
          className="invisible h-0 overflow-hidden"
        >
          <div
            ref={contentRef}
            className="flex flex-col items-start gap-2.5 pb-4 pl-7 pt-2 @[760px]/fullnav:pl-9"
          >
            {item.links!.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                data-fullnav-hit
                href={link.href}
                onClick={onNavigate}
                className="relative z-10 max-w-full rounded-md text-sm leading-relaxed opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--fullnav-accent)"
              >
                <span data-fullnav-label className="inline-block">
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FullscreenPanel({
  open,
  onExit,
  onClose,
  mobile,
  settings,
}: {
  open: boolean;
  onExit: () => void;
  onClose: () => void;
  mobile: boolean;
  settings: Required<
    Pick<
      FullscreenNavbarProps,
      | "brand"
      | "brandHref"
      | "items"
      | "connectLinks"
      | "actionLabel"
      | "actionHref"
      | "footerText"
      | "contactLabel"
      | "contactHref"
      | "duration"
      | "stiffness"
      | "damping"
      | "stagger"
      | "background"
      | "foreground"
      | "accent"
      | "hoverDropdowns"
      | "contained"
    >
  > &
    Pick<FullscreenNavbarProps, "logo" | "spotlight">;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const motionRef = useRef<((next: boolean) => void) | null>(null);
  const enteredRef = useRef(false);
  const openRef = useRef(open);
  const [active, setActive] = useState<number | null>(null);
  const {
    brand,
    brandHref,
    logo,
    items,
    connectLinks,
    spotlight,
    actionLabel,
    actionHref,
    footerText,
    contactLabel,
    contactHref,
    duration,
    stiffness,
    damping,
    stagger,
    background,
    foreground,
    accent,
    hoverDropdowns,
    contained,
  } = settings;
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useGSAP(
    () => {
      const sheet = sheetRef.current;
      const overlay = overlayRef.current;
      const root = rootRef.current;
      if (!sheet || !overlay || !root) return;
      const entries = root.querySelectorAll("[data-fullnav-entry]");
      const side = root.querySelector("[data-fullnav-side]");
      const media = gsap.matchMedia();
      media.add(
        { reduced: "(prefers-reduced-motion: reduce)", all: "all" },
        (context) => {
          const reduced = Boolean(context.conditions?.reduced);
          gsap.set(sheet, {
            xPercent: mobile ? 0 : 100,
            yPercent: mobile ? -100 : 0,
          });
          gsap.set(entries, { y: 24, opacity: 0 });
          if (side) gsap.set(side, { y: 16, opacity: 0 });
          gsap.set(overlay, { opacity: 0 });
          const timeline = gsap
            .timeline({
              paused: true,
              onComplete: () => {
                enteredRef.current = true;
              },
              onReverseComplete: onExit,
            })
            .to(
              sheet,
              { xPercent: 0, yPercent: 0, duration, ease: "power3.inOut" },
              0,
            )
            .to(overlay, { opacity: 1, duration: duration * 0.6 }, 0)
            .to(
              entries,
              {
                y: 0,
                opacity: 1,
                duration: duration * 0.6,
                ease: springEase(stiffness, damping, duration * 0.6),
                stagger,
              },
              duration * 0.25,
            );
          if (side)
            timeline.to(
              side,
              {
                y: 0,
                opacity: 1,
                duration: duration * 0.6,
                ease: "power3.out",
              },
              duration * 0.4,
            );
          const nav = root.querySelector<HTMLElement>("[data-fullnav-list]");
          const highlight = root.querySelector<HTMLElement>(
            "[data-fullnav-highlight]",
          );
          const hoverDuration = Math.min(0.5, Math.max(0.25, duration * 0.45));
          const hoverEase = springEase(stiffness, damping, hoverDuration);
          let selected: HTMLElement | null = null;
          const quick =
            highlight && !reduced
              ? {
                  x: gsap.quickTo(highlight, "x", {
                    duration: hoverDuration,
                    ease: hoverEase,
                  }),
                  y: gsap.quickTo(highlight, "y", {
                    duration: hoverDuration,
                    ease: hoverEase,
                  }),
                  width: gsap.quickTo(highlight, "width", {
                    duration: hoverDuration,
                    ease: "power3.out",
                  }),
                  height: gsap.quickTo(highlight, "height", {
                    duration: hoverDuration,
                    ease: "power3.out",
                  }),
                }
              : null;
          const positionHighlight = context.add("positionHighlight", () => {
            if (!nav || !highlight || !selected) return;
            const bounds = selected.getBoundingClientRect();
            const parent = nav.getBoundingClientRect();
            const geometry = {
              x: bounds.left - parent.left - 8,
              y: bounds.top - parent.top - 2,
              width: bounds.width + 16,
              height: bounds.height + 4,
            };
            if (quick) {
              quick.x(geometry.x);
              quick.y(geometry.y);
              quick.width(geometry.width);
              quick.height(geometry.height);
            } else gsap.set(highlight, geometry);
          });
          const select = context.add("select", (target: HTMLElement | null) => {
            if (!highlight || !nav || target === selected) return;
            if (selected) {
              const oldLabel = selected.querySelector("[data-fullnav-label]");
              const oldArrow = selected.querySelector<SVGSVGElement>(
                "[data-fullnav-arrow]",
              );
              if (oldLabel)
                gsap.to(oldLabel, {
                  x: 0,
                  duration: reduced ? 0 : hoverDuration,
                  ease: hoverEase,
                  overwrite: "auto",
                });
              if (oldArrow)
                gsap.to(oldArrow, {
                  x: 0,
                  opacity: oldArrow.dataset.fullnavArrow === "link" ? 0 : 0.35,
                  duration: reduced ? 0 : hoverDuration,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              const previous = selected;
              gsap.to(previous, {
                color:
                  previous.getAttribute("aria-expanded") === "true"
                    ? accent
                    : foreground,
                duration: reduced ? 0 : 0.2,
                overwrite: "auto",
                onComplete: () => previous.style.removeProperty("color"),
              });
            }
            const first = selected === null;
            selected = target;
            if (first && target) {
              const bounds = target.getBoundingClientRect();
              const parent = nav.getBoundingClientRect();
              gsap.set(highlight, {
                x: bounds.left - parent.left - 8,
                y: bounds.top - parent.top - 2,
                width: bounds.width + 16,
                height: bounds.height + 4,
              });
            }
            positionHighlight();
            gsap.to(highlight, {
              opacity: target ? 1 : 0,
              duration: reduced ? 0 : 0.2,
              overwrite: "auto",
            });
            if (!target) return;
            const label = target.querySelector("[data-fullnav-label]");
            const arrow = target.querySelector("[data-fullnav-arrow]");
            if (label)
              gsap.to(label, {
                x: reduced ? 0 : 6,
                duration: reduced ? 0 : hoverDuration,
                ease: hoverEase,
                overwrite: "auto",
              });
            if (arrow)
              gsap.to(arrow, {
                x: reduced ? 0 : 3,
                opacity: 0.65,
                duration: reduced ? 0 : hoverDuration,
                ease: hoverEase,
                overwrite: "auto",
              });
            gsap.to(target, {
              color: accent,
              duration: reduced ? 0 : 0.2,
              overwrite: "auto",
            });
          });
          const point = (event: Event) => {
            if (
              event instanceof PointerEvent &&
              (event.pointerType !== "mouse" || mobile)
            )
              return;
            const target =
              event.target instanceof Element
                ? event.target.closest<HTMLElement>("[data-fullnav-hit]")
                : null;
            if (target && nav?.contains(target)) select(target);
          };
          const leave = () => {
            if (!nav?.contains(document.activeElement)) select(null);
          };
          const blur = (event: FocusEvent) => {
            if (
              !(event.relatedTarget instanceof Node) ||
              !nav?.contains(event.relatedTarget)
            )
              select(null);
          };
          nav?.addEventListener("pointerover", point);
          nav?.addEventListener("focusin", point);
          nav?.addEventListener("pointerleave", leave);
          nav?.addEventListener("focusout", blur);
          const hoverObserver = new ResizeObserver(() => positionHighlight());
          if (nav) hoverObserver.observe(nav);
          const move = context.add("move", (next: boolean) => {
            if (reduced) {
              gsap.set(sheet, { xPercent: 0, yPercent: 0 });
              gsap.set(entries, { y: 0, opacity: 1 });
              if (side) gsap.set(side, { y: 0, opacity: 1 });
              gsap.set(overlay, { opacity: 1 });
              if (!next) onExit();
            } else if (next) timeline.play();
            else timeline.timeScale(1.25).reverse();
          });
          motionRef.current = (next) => move(next);
          if (enteredRef.current && openRef.current && !reduced)
            timeline.progress(1);
          else move(openRef.current);
          return () => {
            motionRef.current = null;
            nav?.removeEventListener("pointerover", point);
            nav?.removeEventListener("focusin", point);
            nav?.removeEventListener("pointerleave", leave);
            nav?.removeEventListener("focusout", blur);
            hoverObserver.disconnect();
          };
        },
      );
      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [
        mobile,
        duration,
        stiffness,
        damping,
        stagger,
        items,
        accent,
        foreground,
        onExit,
      ],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      motionRef.current?.(open);
    },
    { scope: rootRef, dependencies: [open] },
  );

  return (
    <Dialog.Content
      ref={rootRef}
      className={cn(
        "@container/fullnav inset-0 z-50 overflow-hidden outline-none pointer-events-auto",
        contained ? "absolute" : "fixed",
      )}
      style={{ color: foreground, "--fullnav-accent": accent } as CSSProperties}
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        closeRef.current?.focus({ preventScroll: true });
      }}
      onEscapeKeyDown={(event) => {
        event.preventDefault();
        onClose();
      }}
      onPointerDownOutside={(event) => event.preventDefault()}
    >
      <Dialog.Title className="sr-only">{brand} navigation</Dialog.Title>
      <Dialog.Description className="sr-only">
        Explore components, documentation, and community resources.
      </Dialog.Description>
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="absolute inset-0 bg-black/25"
      />
      <div ref={sheetRef} className="absolute inset-0" style={{ background }}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,0.04),transparent_65%)]"
        />
        <div className="relative flex h-full flex-col">
          <div className="shrink-0 border-b border-current/8">
            <NavbarHeader
              brand={brand}
              brandHref={brandHref}
              logo={logo}
              actionLabel={actionLabel}
              actionHref={actionHref}
              onNavigate={onClose}
              menuButton={
                <button
                  ref={closeRef}
                  type="button"
                  aria-label="Close menu"
                  onClick={onClose}
                  className={menuButtonClass}
                >
                  Close
                  <X aria-hidden="true" className="size-4" />
                </button>
              }
            />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-7 scrollbar-thin @[760px]/fullnav:px-9 @[760px]/fullnav:py-9">
            <div className="mx-auto grid w-full max-w-7xl gap-10 @[760px]/fullnav:grid-cols-[1.45fr_1fr] @[760px]/fullnav:gap-10">
              <nav
                data-fullnav-list
                aria-label={`${brand} main navigation`}
                className="relative isolate min-w-0"
                onPointerLeave={(event) => {
                  if (
                    !mobile &&
                    event.pointerType === "mouse" &&
                    !event.currentTarget.contains(document.activeElement)
                  )
                    setActive(null);
                }}
              >
                <div
                  data-fullnav-highlight
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 z-0 rounded-xl bg-[color-mix(in_srgb,var(--fullnav-accent)_7%,transparent)] opacity-0"
                />
                {items.map((item, index) => (
                  <NavbarRow
                    key={`${item.label}-${index}`}
                    item={item}
                    index={index}
                    expanded={active === index}
                    onExpand={() =>
                      setActive((current) => (current === index ? null : index))
                    }
                    onNavigate={onClose}
                    mobile={mobile}
                    duration={duration}
                    stiffness={stiffness}
                    damping={damping}
                    hoverDropdowns={hoverDropdowns}
                  />
                ))}
              </nav>
              <aside
                data-fullnav-side
                className="min-w-0 border-t border-current/10 pt-7 @[760px]/fullnav:border-l @[760px]/fullnav:border-t-0 @[760px]/fullnav:pl-8 @[760px]/fullnav:pt-0"
              >
                {spotlight && (
                  <div className="mb-7">
                    <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] opacity-40">
                      Spotlight
                    </p>
                    <a
                      href={spotlight.href}
                      onClick={onClose}
                      className="group relative block aspect-16/10 overflow-hidden rounded-2xl bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--fullnav-accent)"
                    >
                      <img
                        src={spotlight.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                      {spotlight.tag && (
                        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[9px] uppercase tracking-wider text-white backdrop-blur-lg">
                          {spotlight.tag}
                        </span>
                      )}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="max-w-64 text-xl font-medium leading-tight tracking-tight">
                          {spotlight.title}
                        </h3>
                        <p className="mt-2 max-w-72 text-[11px] leading-relaxed text-white/65">
                          {spotlight.description}
                        </p>
                      </div>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="absolute top-4 right-4 size-4 text-white/75"
                      />
                    </a>
                  </div>
                )}
                <div className="mb-7">
                  <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] opacity-40">
                    Connect
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {connectLinks.map((link) => (
                      <a
                        key={`${link.label}-${link.href}`}
                        href={link.href}
                        onClick={onClose}
                        target={
                          link.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          link.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="flex min-h-9 items-center gap-2 rounded-full border border-current/12 px-3 text-[11px] hover:bg-current/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--fullnav-accent)"
                      >
                        {link.label}
                        <ArrowUpRight aria-hidden="true" className="size-3" />
                      </a>
                    ))}
                  </div>
                </div>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] opacity-40">
                  Build with us
                </p>
                <a
                  href={contactHref}
                  onClick={onClose}
                  className="block w-fit max-w-full wrap-break-words rounded-md text-lg font-medium tracking-tight hover:text-(--fullnav-accent) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--fullnav-accent)"
                >
                  {contactLabel}
                </a>
                <a
                  href={actionHref}
                  onClick={onClose}
                  className="mt-7 flex min-h-10 w-fit items-center gap-3 rounded-full bg-(--fullnav-accent) px-5 text-xs font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--fullnav-accent)"
                >
                  {actionLabel}
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </a>
              </aside>
            </div>
            <p className="mx-auto mt-10 max-w-7xl border-t border-current/10 pt-4 text-[10px] tracking-wide opacity-40">
              {footerText}
            </p>
          </div>
        </div>
      </div>
    </Dialog.Content>
  );
}

export function FullscreenNavbar({
  brand = "devclub",
  brandHref = "/",
  logo,
  items = FULLSCREEN_NAVBAR_ITEMS,
  connectLinks = FULLSCREEN_NAVBAR_CONNECT_LINKS,
  spotlight,
  actionLabel = "Start building",
  actionHref = "/docs/installation",
  footerText = "Built by Dev Club. Made for your next idea.",
  contactLabel = "Let's build something together.",
  contactHref = "https://github.com/devclub-nstru/component_library/issues",
  duration = 0.8,
  stiffness = 220,
  damping = 26,
  stagger = 0.045,
  background = "#f7f5ef",
  foreground = "#171717",
  accent = "#d34b30",
  headerForeground = "#ffffff",
  hoverDropdowns = true,
  contained = false,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className,
}: FullscreenNavbarProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const [present, setPresent] = useState(open);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [mobile, setMobile] = useState(false);
  const finishExit = useCallback(() => setPresent(false), []);
  if (open && !present) setPresent(true);
  const changeOpen = (next: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!host) return;
    const observer = new ResizeObserver(() =>
      setMobile(host.clientWidth < 760),
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, [host]);

  const settings = {
    brand,
    brandHref,
    logo,
    items,
    connectLinks,
    spotlight,
    actionLabel,
    actionHref,
    footerText,
    contactLabel,
    contactHref,
    duration: bounded(duration, 0.25, 1.5, 0.8),
    stiffness: bounded(stiffness, 80, 500, 220),
    damping: bounded(damping, 12, 50, 26),
    stagger: bounded(stagger, 0, 0.12, 0.045),
    background,
    foreground,
    accent,
    hoverDropdowns,
    contained,
  };
  return (
    <div
      ref={setHost}
      data-slot="fullscreen-navbar"
      className={cn(
        "pointer-events-none inset-0 z-30",
        contained ? "absolute" : "fixed",
        className,
      )}
    >
      <Dialog.Root open={present} onOpenChange={changeOpen}>
        <div
          aria-hidden={present}
          inert={present}
          className="@container/fullnav pointer-events-auto absolute inset-x-0 top-0"
          style={
            {
              color: headerForeground,
              "--fullnav-accent": accent,
            } as CSSProperties
          }
        >
          <NavbarHeader
            brand={brand}
            brandHref={brandHref}
            logo={logo}
            actionLabel={actionLabel}
            actionHref={actionHref}
            menuButton={
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className={menuButtonClass}
                >
                  Menu
                  <Menu aria-hidden="true" className="size-4" />
                </button>
              </Dialog.Trigger>
            }
          />
        </div>
        <Dialog.Portal container={contained ? host : undefined}>
          <FullscreenPanel
            open={open}
            onExit={finishExit}
            onClose={() => changeOpen(false)}
            mobile={mobile}
            settings={settings}
          />
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default FullscreenNavbar;
