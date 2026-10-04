"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import {
  AsciiGlitchText,
  type AsciiGlitchTextHandle,
} from "./ascii-hover-button";

gsap.registerPlugin(useGSAP);

export interface CurtainNavbarItem {
  label: string;
  href: string;
  category?: string;
  detail?: string;
  description?: string;
}

export interface CurtainNavbarLink {
  label: string;
  href: string;
}

export interface CurtainNavbarProps {
  brand?: string;
  brandHref?: string;
  logo?: ReactNode;
  items?: readonly CurtainNavbarItem[];
  quickLinks?: readonly CurtainNavbarLink[];
  footerLinks?: readonly CurtainNavbarLink[];
  leftNote?: string;
  rightNote?: string;
  footerText?: string;
  background?: string;
  foreground?: string;
  headerBackground?: string;
  headerForeground?: string;
  duration?: number;
  stagger?: number;
  hoverDuration?: number;
  closeSpeed?: number;
  glitchDuration?: number;
  hoverScroll?: boolean;
  scrollDuration?: number;
  contained?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const CURTAIN_NAVBAR_ITEMS: readonly CurtainNavbarItem[] = [
  {
    label: "Build",
    href: "/components",
    category: "Components",
    detail: "UI",
    description: "Find your next component.",
  },
  {
    label: "Learn",
    href: "/docs/introduction",
    category: "Documentation",
    detail: "01",
    description: "Make motion part of your craft.",
  },
  {
    label: "Club",
    href: "https://github.com/devclub-nstru/component_library",
    category: "Community",
    detail: "Open",
    description: "Built together. Shared with everyone.",
  },
  {
    label: "Hello",
    href: "https://github.com/devclub-nstru/component_library/issues",
    category: "Connect",
    detail: "↗",
    description: "Bring an idea. Start a conversation.",
  },
  {
    label: "Source",
    href: "https://github.com/devclub-nstru/component_library",
    category: "Open source",
    detail: "MIT",
    description: "Explore the code behind the motion.",
  },
];

const DEFAULT_QUICK_LINKS: readonly CurtainNavbarLink[] = [
  { label: "Build", href: "/components" },
  { label: "Learn", href: "/docs/introduction" },
  {
    label: "Hello",
    href: "https://github.com/devclub-nstru/component_library/issues",
  },
];

const DEFAULT_FOOTER_LINKS: readonly CurtainNavbarLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/devclub-nstru/component_library",
  },
  { label: "Installation", href: "/docs/installation" },
  { label: "Dev Club", href: "https://devclub.co" },
];

const clamp = (value: number, min: number, max: number, fallback: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

function MenuMark({ open }: { open: boolean }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const animateRef = useRef<((next: boolean) => void) | null>(null);
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        { reduced: "(prefers-reduced-motion: reduce)", all: "all" },
        (context) => {
          const animate = context.add("animate", (next: boolean) =>
            gsap.to(rootRef.current, {
              rotation: next ? 135 : 0,
              duration: context.conditions?.reduced ? 0 : 0.45,
              ease: "power3.inOut",
              overwrite: "auto",
            }),
          );
          animateRef.current = (next) => animate(next);
          animate(openRef.current);
          return () => {
            animateRef.current = null;
          };
        },
      );
      return () => media.revert();
    },
    { scope: rootRef },
  );
  useGSAP(
    () => {
      animateRef.current?.(open);
    },
    { scope: rootRef, dependencies: [open] },
  );
  return (
    <span
      ref={rootRef}
      aria-hidden="true"
      className="grid size-3.5 grid-cols-2 gap-0.5"
    >
      {[0, 1, 2, 3].map((index) => (
        <span key={index} className="rounded-[1px] bg-current" />
      ))}
    </span>
  );
}

function HeaderLink({
  link,
  onNavigate,
  duration,
}: {
  link: CurtainNavbarLink;
  onNavigate?: () => void;
  duration: number;
}) {
  const glitchRef = useRef<AsciiGlitchTextHandle>(null);
  return (
    <a
      href={link.href}
      aria-label={link.label}
      onClick={onNavigate}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") glitchRef.current?.trigger();
      }}
      onPointerLeave={() => glitchRef.current?.reset()}
      onFocus={() => glitchRef.current?.trigger()}
      onBlur={() => glitchRef.current?.reset()}
      className="rounded-sm opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
    >
      <AsciiGlitchText
        ref={glitchRef}
        text={link.label.toUpperCase()}
        duration={duration}
        className="font-mono text-[10px] font-normal tracking-wide text-inherit transition-none [&>span]:w-[1ch] [&>span]:font-mono [&>span]:text-inherit [&>span]:transition-none"
      />
    </a>
  );
}

function CurtainHeader({
  brand,
  brandHref,
  logo,
  quickLinks,
  button,
  onNavigate,
  background,
  foreground,
  glitchDuration,
}: {
  brand: string;
  brandHref: string;
  logo?: ReactNode;
  quickLinks: readonly CurtainNavbarLink[];
  button: ReactNode;
  onNavigate?: () => void;
  background: string;
  foreground: string;
  glitchDuration: number;
}) {
  return (
    <header
      className="@container/curtain-header pointer-events-auto absolute inset-x-4 top-4 z-20 mx-auto flex h-14 max-w-2xl items-center justify-between gap-3 rounded-xl px-4 font-mono text-[10px] uppercase tracking-wide backdrop-blur-xl"
      style={{ background, color: foreground }}
    >
      <a
        href={brandHref}
        onClick={onNavigate}
        className="flex min-w-0 items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
      >
        {logo && (
          <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md">
            {logo}
          </span>
        )}
        <span className="truncate">{brand}</span>
      </a>
      <div className="flex shrink-0 items-center gap-2">
        <nav
          aria-label="Quick navigation"
          className="hidden items-center gap-4 @[450px]/curtain-header:flex"
        >
          {quickLinks.map((link) => (
            <HeaderLink
              key={`${link.label}-${link.href}`}
              link={link}
              onNavigate={onNavigate}
              duration={glitchDuration}
            />
          ))}
        </nav>
        {button}
      </div>
    </header>
  );
}

type CurtainSettings = Required<
  Omit<
    CurtainNavbarProps,
    "logo" | "open" | "defaultOpen" | "onOpenChange" | "className"
  >
> &
  Pick<CurtainNavbarProps, "logo">;

function CurtainPanel({
  open,
  onClose,
  onExit,
  settings,
}: {
  open: boolean;
  onClose: () => void;
  onExit: () => void;
  settings: CurtainSettings;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const moveRef = useRef<((next: boolean) => void) | null>(null);
  const openRef = useRef(open);
  const enteredRef = useRef(false);
  const {
    brand,
    brandHref,
    logo,
    items,
    footerLinks,
    leftNote,
    rightNote,
    footerText,
    background,
    foreground,
    headerBackground,
    headerForeground,
    duration,
    stagger,
    hoverDuration,
    closeSpeed,
    glitchDuration,
    hoverScroll,
    scrollDuration,
    contained,
  } = settings;

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const sheet = sheetRef.current;
      if (!root || !sheet) return;
      const titles = root.querySelectorAll<HTMLElement>("[data-curtain-title]");
      const notes = root.querySelectorAll<HTMLElement>("[data-curtain-note]");
      const nav = root.querySelector<HTMLElement>("[data-curtain-nav]");
      const scroller = root.querySelector<HTMLElement>("[data-curtain-scroll]");
      const media = gsap.matchMedia();
      media.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          pointer: "(hover: hover) and (pointer: fine)",
          all: "all",
        },
        (context) => {
          const reduced = Boolean(context.conditions?.reduced);
          gsap.set(sheet, {
            y: 0,
            yPercent: 100,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
          });
          gsap.set(titles, { y: 0, yPercent: 115 });
          gsap.set(notes, { opacity: 0, y: 10 });
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
              {
                yPercent: 0,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                duration,
                ease: "power4.inOut",
              },
              0,
            )
            .to(
              titles,
              {
                y: 0,
                yPercent: 0,
                duration: duration * 0.75,
                stagger,
                ease: "power4.out",
              },
              duration * 0.3,
            )
            .to(
              notes,
              {
                opacity: 1,
                y: 0,
                duration: duration * 0.4,
                stagger: 0.02,
                ease: "power3.out",
              },
              duration * 0.6,
            );
          let selected: HTMLElement | null = null;
          let pointer: { x: number; y: number } | null = null;
          const scrollTo =
            scroller && !reduced
              ? gsap.quickTo(scroller, "scrollTop", {
                  duration: scrollDuration,
                  ease: "power3.out",
                })
              : null;
          const select = context.add("select", (row: HTMLElement | null) => {
            if (selected === row) return;
            if (selected) {
              gsap.to(selected.querySelector("[data-curtain-word]"), {
                opacity: 1,
                x: 0,
                duration: reduced ? 0 : hoverDuration,
                ease: "power3.out",
                overwrite: "auto",
              });
              gsap.to(selected.querySelectorAll("[data-curtain-detail]"), {
                autoAlpha: 0,
                y: reduced ? 0 : -8,
                duration: reduced ? 0 : hoverDuration * 0.7,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
            selected = row;
            if (!row) return;
            gsap.to(row.querySelector("[data-curtain-word]"), {
              opacity: 0.45,
              x: reduced ? 0 : 5,
              duration: reduced ? 0 : hoverDuration,
              ease: "power3.out",
              overwrite: "auto",
            });
            gsap.fromTo(
              row.querySelectorAll("[data-curtain-detail]"),
              { autoAlpha: 0, y: reduced ? 0 : 8 },
              {
                autoAlpha: 1,
                y: 0,
                duration: reduced ? 0 : hoverDuration,
                ease: "power3.out",
                overwrite: "auto",
              },
            );
          });
          const point = (event: Event) => {
            if (event instanceof PointerEvent && event.pointerType !== "mouse")
              return;
            const row =
              event.target instanceof Element
                ? event.target.closest<HTMLElement>("[data-curtain-row]")
                : null;
            if (row && nav?.contains(row)) select(row);
          };
          const scroll = (event: PointerEvent) => {
            if (event.pointerType === "mouse")
              pointer = { x: event.clientX, y: event.clientY };
            if (
              !scroller ||
              !scrollTo ||
              !hoverScroll ||
              !context.conditions?.pointer ||
              event.pointerType !== "mouse" ||
              !openRef.current ||
              !enteredRef.current
            )
              return;
            const bounds = scroller.getBoundingClientRect();
            const progress = gsap.utils.clamp(
              0,
              1,
              (event.clientY - bounds.top - 24) /
                Math.max(1, bounds.height - 48),
            );
            scrollTo(
              progress *
                Math.max(0, scroller.scrollHeight - scroller.clientHeight),
              scroller.scrollTop,
            );
          };
          const stopScroll = () => scrollTo?.tween.pause();
          const syncHover = () => {
            if (!pointer || nav?.contains(document.activeElement)) return;
            const target = document.elementFromPoint(pointer.x, pointer.y);
            const row =
              target?.closest<HTMLElement>("[data-curtain-row]") ?? null;
            select(row && nav?.contains(row) ? row : null);
          };
          const leaveScroll = () => {
            pointer = null;
            stopScroll();
          };
          const focusScroll = (event: FocusEvent) => {
            if (!scroller || !(event.target instanceof HTMLElement)) return;
            stopScroll();
            const bounds = scroller.getBoundingClientRect();
            const target = event.target.getBoundingClientRect();
            const offset =
              target.top < bounds.top + 12
                ? target.top - bounds.top - 12
                : target.bottom > bounds.bottom - 12
                  ? target.bottom - bounds.bottom + 12
                  : 0;
            if (offset === 0) return;
            const next = gsap.utils.clamp(
              0,
              Math.max(0, scroller.scrollHeight - scroller.clientHeight),
              scroller.scrollTop + offset,
            );
            if (scrollTo) scrollTo(next, scroller.scrollTop);
            else scroller.scrollTop = next;
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
          scroller?.addEventListener("pointermove", scroll, { passive: true });
          scroller?.addEventListener("pointerleave", leaveScroll);
          scroller?.addEventListener("scroll", syncHover, { passive: true });
          scroller?.addEventListener("wheel", stopScroll, { passive: true });
          scroller?.addEventListener("touchstart", stopScroll, {
            passive: true,
          });
          scroller?.addEventListener("focusin", focusScroll);
          const move = context.add("move", (next: boolean) => {
            if (!next) stopScroll();
            if (reduced) {
              timeline.progress(1).pause();
              if (!next) onExit();
            } else if (next) timeline.timeScale(1).play();
            else if (timeline.progress() === 0) onExit();
            else timeline.timeScale(closeSpeed).reverse();
          });
          moveRef.current = (next) => move(next);
          if (enteredRef.current && openRef.current)
            timeline.progress(1).pause();
          else move(openRef.current);
          return () => {
            moveRef.current = null;
            nav?.removeEventListener("pointerover", point);
            nav?.removeEventListener("focusin", point);
            nav?.removeEventListener("pointerleave", leave);
            nav?.removeEventListener("focusout", blur);
            scroller?.removeEventListener("pointermove", scroll);
            scroller?.removeEventListener("pointerleave", leaveScroll);
            scroller?.removeEventListener("scroll", syncHover);
            scroller?.removeEventListener("wheel", stopScroll);
            scroller?.removeEventListener("touchstart", stopScroll);
            scroller?.removeEventListener("focusin", focusScroll);
          };
        },
      );
      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [
        duration,
        stagger,
        hoverDuration,
        closeSpeed,
        hoverScroll,
        scrollDuration,
        items,
        onExit,
      ],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      moveRef.current?.(open);
    },
    { scope: rootRef, dependencies: [open] },
  );

  return (
    <Dialog.Content
      ref={rootRef}
      data-slot="curtain-navbar-panel"
      className={cn(
        "@container/curtain pointer-events-auto inset-0 z-50 overflow-hidden outline-none",
        contained ? "absolute" : "fixed",
      )}
      style={{ color: foreground, containerType: "size" }}
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
        Explore Dev Club components, documentation, and community resources.
      </Dialog.Description>
      <div
        ref={sheetRef}
        className="absolute inset-0 overflow-hidden"
        style={{ background }}
      >
        <div
          data-curtain-note
          className="pointer-events-none absolute left-7 top-5 hidden max-w-[16%] whitespace-pre-line font-mono text-[9px] uppercase leading-relaxed @[1100px]/curtain:block"
        >
          {leftNote}
        </div>
        <div
          data-curtain-note
          className="pointer-events-none absolute right-7 top-5 hidden max-w-[16%] whitespace-pre-line text-right font-mono text-[9px] uppercase leading-relaxed @[1100px]/curtain:block"
        >
          {rightNote}
        </div>
        <div
          data-curtain-scroll
          className="absolute inset-x-0 bottom-20 top-20 overflow-y-auto overscroll-contain px-4 py-3 scrollbar-none [&::-webkit-scrollbar]:hidden @[760px]/curtain:px-7"
        >
          <nav
            data-curtain-nav
            aria-label={`${brand} main navigation`}
            className="my-auto w-full shrink-0"
            style={
              {
                "--curtain-row-height": "clamp(96px,20cqh,260px)",
              } as CSSProperties
            }
          >
            {items.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                data-curtain-row
                className="relative flex items-center justify-center"
                style={{ height: "var(--curtain-row-height)" }}
              >
                <div
                  data-curtain-detail
                  aria-hidden="true"
                  className="pointer-events-none invisible absolute inset-y-0 left-0 hidden w-[22%] items-center justify-between gap-3 font-mono text-[9px] uppercase opacity-0 @[760px]/curtain:flex"
                >
                  <span className="max-w-[75%] wrap-break-words">
                    {item.category}
                  </span>
                  <span>{item.detail}</span>
                </div>
                <a
                  href={item.href}
                  onClick={onClose}
                  className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current @[760px]/curtain:w-[54%]"
                  aria-label={item.label}
                >
                  <span
                    className="block shrink-0 pb-1"
                    style={{
                      clipPath: "inset(0 -100% 0 -100%)",
                      fontFamily: "Arial, Helvetica, sans-serif",
                      fontSize: `clamp(60px,min(calc(var(--curtain-row-height) * 1.05),${Math.min(34, 235 / Math.max(item.label.length, 1))}cqw),260px)`,
                      fontWeight: 400,
                      lineHeight: 0.9,
                      letterSpacing: "-0.075em",
                    }}
                  >
                    <span data-curtain-title className="block">
                      <span
                        data-curtain-word
                        className="block origin-center scale-x-[0.62] whitespace-nowrap uppercase"
                      >
                        {item.label}
                      </span>
                    </span>
                  </span>
                </a>
                <div
                  data-curtain-detail
                  aria-hidden="true"
                  className="pointer-events-none invisible absolute inset-y-0 right-0 hidden w-[22%] items-center justify-end text-right font-mono text-[9px] uppercase leading-relaxed opacity-0 @[760px]/curtain:flex"
                >
                  {item.description}
                </div>
              </div>
            ))}
            <div
              data-curtain-note
              className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-3 font-mono text-[9px] uppercase"
            >
              {footerLinks.map((link) => (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  onClick={onClose}
                  className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
        <div
          data-curtain-note
          className="pointer-events-none absolute inset-x-0 bottom-0 flex min-h-16 items-end justify-between gap-4 px-5 pb-5 pt-5 font-mono text-[9px] uppercase leading-relaxed @[760px]/curtain:px-7"
          style={{
            background: `linear-gradient(transparent, ${background} 45%)`,
          }}
        >
          <p className="max-w-52 whitespace-pre-line">{footerText}</p>
          <span className="shrink-0">Dev Club ©</span>
        </div>
      </div>
      <CurtainHeader
        brand={brand}
        brandHref={brandHref}
        logo={logo}
        quickLinks={[]}
        background={headerBackground}
        foreground={headerForeground}
        glitchDuration={glitchDuration}
        onNavigate={onClose}
        button={
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          >
            <MenuMark open={open} />
          </button>
        }
      />
    </Dialog.Content>
  );
}

export function CurtainNavbar({
  brand = "devclub",
  brandHref = "/",
  logo,
  items = CURTAIN_NAVBAR_ITEMS,
  quickLinks = DEFAULT_QUICK_LINKS,
  footerLinks = DEFAULT_FOOTER_LINKS,
  leftNote = "A community of builders.\nOpen source. Open minds.",
  rightNote = "Made by Dev Club.\nBuilt for the web.",
  footerText = "Thoughtful interfaces.\nMotion with purpose.",
  background = "#67df32",
  foreground = "#161616",
  headerBackground = "#222222b3",
  headerForeground = "#ffffff",
  duration = 0.85,
  stagger = 0.045,
  hoverDuration = 0.35,
  closeSpeed = 1.2,
  glitchDuration = 0.55,
  hoverScroll = true,
  scrollDuration = 0.8,
  contained = false,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className,
}: CurtainNavbarProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const [present, setPresent] = useState(open);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const finishExit = useCallback(() => setPresent(false), []);
  if (open && !present) setPresent(true);
  const changeOpen = (next: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const settings: CurtainSettings = {
    brand,
    brandHref,
    logo,
    items,
    quickLinks,
    footerLinks,
    leftNote,
    rightNote,
    footerText,
    background,
    foreground,
    headerBackground,
    headerForeground,
    duration: clamp(duration, 0.3, 1.6, 0.85),
    stagger: clamp(stagger, 0, 0.12, 0.045),
    hoverDuration: clamp(hoverDuration, 0.15, 0.8, 0.35),
    closeSpeed: clamp(closeSpeed, 0.7, 2, 1.2),
    glitchDuration: clamp(glitchDuration, 0.15, 1.2, 0.55),
    hoverScroll,
    scrollDuration: clamp(scrollDuration, 0.2, 1.5, 0.8),
    contained,
  };
  return (
    <div
      ref={setHost}
      data-slot="curtain-navbar"
      className={cn(
        "pointer-events-none inset-0 z-30",
        contained ? "absolute" : "fixed",
        className,
      )}
    >
      <Dialog.Root open={present} onOpenChange={changeOpen}>
        <div aria-hidden={present} inert={present}>
          <CurtainHeader
            brand={brand}
            brandHref={brandHref}
            logo={logo}
            quickLinks={quickLinks}
            background={headerBackground}
            foreground={headerForeground}
            glitchDuration={settings.glitchDuration}
            button={
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                >
                  <MenuMark open={false} />
                </button>
              </Dialog.Trigger>
            }
          />
        </div>
        <Dialog.Portal container={contained ? host : undefined}>
          <CurtainPanel
            open={open}
            onClose={() => changeOpen(false)}
            onExit={finishExit}
            settings={settings}
          />
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default CurtainNavbar;
