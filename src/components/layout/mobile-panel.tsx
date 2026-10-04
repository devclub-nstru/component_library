"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motionTokens } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

interface MobilePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  triggerRef?: RefObject<HTMLElement | null>;
  className?: string;
}

function PanelContent({
  open,
  onOpenChange,
  title,
  children,
  triggerRef,
  className,
  onExitComplete,
}: MobilePanelProps & { onExitComplete: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const reducedRef = useRef(false);
  const openRef = useRef(open);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const media = gsap.matchMedia();
      media.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          animate: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          reducedRef.current = Boolean(context.conditions?.reduce);
          timelineRef.current = gsap
            .timeline({ paused: true, onReverseComplete: onExitComplete })
            .fromTo(
              panel,
              { xPercent: reducedRef.current ? 0 : 100, autoAlpha: 0 },
              {
                xPercent: 0,
                autoAlpha: 1,
                duration: motionTokens.duration.standard,
                ease: "power3.inOut",
              },
            );
          if (openRef.current) {
            if (reducedRef.current) timelineRef.current.progress(1);
            else timelineRef.current.play();
          } else {
            onExitComplete();
          }
          return () => {
            timelineRef.current = null;
          };
        },
        panel,
      );
      return () => media.revert();
    },
    { scope: panelRef },
  );

  useEffect(() => {
    openRef.current = open;
    const timeline = timelineRef.current;
    if (!timeline) return;
    if (open) {
      if (reducedRef.current) timeline.progress(1);
      else timeline.timeScale(1).play();
    } else if (reducedRef.current) {
      onExitComplete();
    } else {
      timeline.timeScale(1.2).reverse();
    }
  }, [open, onExitComplete]);

  return (
    <>
      <Dialog.Overlay className="fixed inset-0 z-150 bg-black/40" />
      <Dialog.Content
        ref={panelRef}
        aria-describedby={undefined}
        onCloseAutoFocus={(event) => {
          if (triggerRef?.current) {
            event.preventDefault();
            triggerRef.current.focus({ preventScroll: true });
          }
        }}
        className="fixed inset-0 z-160 flex h-dvh min-w-0 flex-col bg-background text-foreground outline-none"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <Dialog.Title className="min-w-0 truncate text-sm font-medium">
            {title}
          </Dialog.Title>
          <button
            type="button"
            aria-label={`Close ${title}`}
            onClick={() => onOpenChange(false)}
            className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
          >
            <Cross2Icon className="size-5" />
          </button>
        </div>
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
            className,
          )}
        >
          {children}
        </div>
      </Dialog.Content>
    </>
  );
}

export function MobilePanel(props: MobilePanelProps) {
  const [present, setPresent] = useState(props.open);
  if (props.open && !present) setPresent(true);
  const onExitComplete = useCallback(() => setPresent(false), []);

  return (
    <Dialog.Root open={present} onOpenChange={props.onOpenChange}>
      {present && (
        <Dialog.Portal>
          <PanelContent {...props} onExitComplete={onExitComplete} />
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
