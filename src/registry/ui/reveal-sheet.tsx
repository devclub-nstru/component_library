"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export type RevealSheetSide = "top" | "right" | "bottom" | "left";

export interface RevealSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: RevealSheetSide;
  speed?: number;
  bounce?: number;
  showGrid?: boolean;
  showShine?: boolean;
  shineDirection?: "clockwise" | "counterclockwise";
  shineSpeed?: number;
  shineIntensity?: number;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showClose?: boolean;
}

const sideClasses: Record<RevealSheetSide, string> = {
  top: "inset-x-0 top-0 max-h-[85vh] rounded-b-3xl border-b",
  right: "inset-y-0 right-0 w-full max-w-xl rounded-l-3xl border-l",
  bottom: "inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl border-t",
  left: "inset-y-0 left-0 w-full max-w-xl rounded-r-3xl border-r",
};

const transformOrigins: Record<RevealSheetSide, string> = {
  top: "center top",
  right: "right center",
  bottom: "center bottom",
  left: "left center",
};

const revealOrigins: Record<RevealSheetSide, string> = {
  top: "50% 0%",
  right: "100% 50%",
  bottom: "50% 100%",
  left: "0% 50%",
};

const closeButton =
  "group inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-transparent text-muted-foreground transition-colors duration-200 hover:text-red-500 dark:hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50";

const RevealSheetPanel = ({
  open,
  onExitComplete,
  overlayRef,
  side = "right",
  speed = 1,
  bounce = 1,
  showGrid = true,
  showShine = true,
  shineDirection = "clockwise",
  shineSpeed = 1,
  shineIntensity = 0.55,
  title = "Explore the collection",
  description,
  children,
  className,
  showClose = true,
}: Omit<RevealSheetProps, "onOpenChange"> & {
  onExitComplete: () => void;
  overlayRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const shineRef = React.useRef<HTMLDivElement>(null);
  const timelineRef = React.useRef<gsap.core.Timeline | null>(null);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const bounceAmount = Number.isFinite(bounce)
    ? Math.min(2, Math.max(0, bounce))
    : 1;

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const panel = contentRef.current;
        const overlay = overlayRef.current;
        if (!panel || !overlay) return;

        const horizontal = side === "left" || side === "right";
        const stretchAxis = horizontal ? "scaleX" : "scaleY";
        const radius = horizontal
          ? Math.hypot(panel.offsetWidth, panel.offsetHeight / 2) + 2
          : Math.hypot(panel.offsetWidth / 2, panel.offsetHeight) + 2;
        const origin = revealOrigins[side];

        gsap.set(panel, {
          clipPath: `circle(0px at ${origin})`,
          transformOrigin: transformOrigins[side],
          willChange: "clip-path, transform",
        });

        const timeline = gsap.timeline({
          paused: true,
          onComplete: () =>
            gsap.set(panel, {
              clearProps: "clipPath,transform,transformOrigin,willChange",
            }),
          onReverseComplete: onExitComplete,
        })
          .fromTo(
            overlay,
            { opacity: 0 },
            { opacity: 1, duration: 0.35, ease: "power2.out" },
            0,
          )
          .to(panel, {
            clipPath: `circle(${radius}px at ${origin})`,
            duration: 0.72,
            ease: "power3.inOut",
          }, 0)
          .to(panel, {
            [stretchAxis]: 1 + 0.032 * bounceAmount,
            duration: 0.18,
            ease: "power3.out",
          }, "-=0.18")
          .to(panel, {
            [stretchAxis]: 1 - 0.008 * bounceAmount,
            duration: 0.16,
            ease: "power2.inOut",
          })
          .to(panel, {
            [stretchAxis]: 1 + 0.006 * bounceAmount,
            duration: 0.14,
            ease: "power2.out",
          })
          .to(panel, {
            [stretchAxis]: 1,
            duration: 0.16,
            ease: "power2.out",
          })
          .timeScale(Number.isFinite(speed) ? Math.max(0.1, speed) : 1);

        timelineRef.current = timeline;
        if (open) timeline.play();
      }, contentRef);

      return () => {
        media.revert();
        timelineRef.current = null;
      };
    },
    { scope: contentRef },
  );

  useGSAP(
    () => {
      const shine = shineRef.current;
      if (!shine || !showShine) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          shine,
          { "--shine-angle": "0deg" },
          {
            "--shine-angle": shineDirection === "clockwise" ? "360deg" : "-360deg",
            duration:
              7 /
              (Number.isFinite(shineSpeed)
                ? Math.max(0.1, shineSpeed)
                : 1),
            ease: "none",
            repeat: -1,
          },
        );
      });
      return () => media.revert();
    },
    {
      scope: contentRef,
      dependencies: [showShine, shineDirection, shineSpeed],
      revertOnUpdate: true,
    },
  );

  React.useEffect(() => {
    const timeline = timelineRef.current;
    if (open) {
      timeline?.play();
    } else if (timeline) {
      gsap.set(contentRef.current, { willChange: "clip-path, transform" });
      timeline.reverse();
    } else {
      onExitComplete();
    }
  }, [open, onExitComplete]);

  return (
    <Dialog.Content
      ref={contentRef}
      onOpenAutoFocus={() => {
        returnFocusRef.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
      }}
      onCloseAutoFocus={(event) => {
        const target = returnFocusRef.current;
        returnFocusRef.current = null;
        if (!target?.isConnected) return;
        event.preventDefault();
        target.focus({ preventScroll: true });
      }}
      className={cn(
        "fixed z-50 flex flex-col overflow-hidden border-border/80 bg-[linear-gradient(155deg,#fff_0%,#f5f5f7_100%)] text-foreground shadow-[0_24px_80px_-28px_rgba(0,0,0,0.75)] outline-none dark:bg-[linear-gradient(155deg,#1c1c20_0%,#101013_100%)]",
        sideClasses[side],
        className,
      )}
    >
      {showGrid && (
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent_55%)]" />
      )}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <header className="flex items-start justify-between gap-6 border-b border-border/70 px-6 py-5 sm:px-8">
          <div className="min-w-0 space-y-1">
            <Dialog.Title className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
              {title}
            </Dialog.Title>
            {description && (
              <Dialog.Description className="max-w-md text-sm leading-6 text-muted-foreground">
                {description}
              </Dialog.Description>
            )}
          </div>
          {showClose && (
            <Dialog.Close asChild>
              <button
                type="button"
                className={closeButton}
                aria-label="Close sheet"
              >
                <X className="size-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:rotate-90 motion-safe:group-hover:scale-125" />
              </button>
            </Dialog.Close>
          )}
        </header>
        <div className="relative min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {children}
        </div>
      </div>
      {showShine && (
        <div
          ref={shineRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] p-[2px] [background:conic-gradient(from_var(--shine-angle,0deg),transparent_0deg,transparent_298deg,rgba(255,255,255,0.15)_321deg,rgba(255,255,255,0.95)_338deg,rgba(255,255,255,0.15)_351deg,transparent_360deg)]"
          style={{
            opacity: Number.isFinite(shineIntensity)
              ? Math.min(1, Math.max(0, shineIntensity))
              : 0.55,
            mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
          }}
        />
      )}
    </Dialog.Content>
  );
};

export const RevealSheet = ({
  open,
  onOpenChange,
  ...panelProps
}: RevealSheetProps) => {
  const [present, setPresent] = React.useState(open);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const onExitComplete = React.useCallback(() => setPresent(false), []);

  if (open && !present) setPresent(true);

  return (
    <Dialog.Root open={present} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          ref={overlayRef}
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
        />
        <RevealSheetPanel
          {...panelProps}
          open={open}
          onExitComplete={onExitComplete}
          overlayRef={overlayRef}
        />
      </Dialog.Portal>
    </Dialog.Root>
  );
};

RevealSheet.displayName = "RevealSheet";

export default RevealSheet;
