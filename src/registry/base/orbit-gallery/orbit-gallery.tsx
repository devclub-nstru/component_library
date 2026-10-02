"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Pause, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export interface OrbitGalleryItem {
  src: string;
  alt: string;
}

export interface OrbitGalleryProps {
  items: OrbitGalleryItem[];
  ringCount?: number;
  radius?: number;
  ringGap?: number;
  imageSize?: number;
  imageAspectRatio?: number;
  borderRadius?: number;
  speed?: number;
  reverse?: boolean;
  autoRotate?: boolean;
  pauseOnHover?: boolean;
  tilt?: number;
  inertia?: number;
  hoverScale?: number;
  scrollSensitivity?: number;
  dragSensitivity?: number;
  motionDuration?: number;
  showControls?: boolean;
  className?: string;
  ariaLabel?: string;
  onReady?: () => void;
  onSelect?: (item: OrbitGalleryItem | null) => void;
}

const bounded = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

type Selection = {
  item: OrbitGalleryItem;
  source: HTMLButtonElement;
  aspectRatio: number;
};
type Slot = { ring: number; angle: number; itemIndex: number };

function OrbitImage({
  selection,
  open,
  duration,
  borderRadius,
  overlayRef,
  onExit,
}: {
  selection: Selection;
  open: boolean;
  duration: number;
  borderRadius: number;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  onExit: () => void;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const timelineRef = React.useRef<gsap.core.Timeline | null>(null);
  const initializedRef = React.useRef(false);
  const transitionRef = React.useRef<(() => void) | null>(null);
  const { item, source, aspectRatio } = selection;

  useGSAP(
    () => {
      const resize = () => transitionRef.current?.();
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      window.addEventListener("resize", resize);
      media.addEventListener("change", resize);
      return () => {
        window.removeEventListener("resize", resize);
        media.removeEventListener("change", resize);
        timelineRef.current?.kill();
        initializedRef.current = false;
        source.style.visibility = "";
      };
    },
    { scope: panelRef },
  );

  useGSAP(
    (_context, contextSafe) => {
      const animate = contextSafe!(() => {
        const panel = panelRef.current;
        const overlay = overlayRef.current;
        if (!panel || !overlay) return;
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const rect = source.getBoundingClientRect();
        const rotation = Number(gsap.getProperty(source, "rotation")) || 0;
        const thumbnail = source.querySelector<HTMLSpanElement>(
          "[data-orbit-thumbnail]",
        );
        const scale = thumbnail
          ? Number(gsap.getProperty(thumbnail, "scaleX")) || 1
          : 1;
        const origin = {
          x: rect.left + rect.width / 2 - (source.offsetWidth * scale) / 2,
          y: rect.top + rect.height / 2 - (source.offsetHeight * scale) / 2,
          width: source.offsetWidth * scale,
          height: source.offsetHeight * scale,
          rotation,
        };
        const width = Math.min(
          600,
          window.innerWidth - 40,
          (window.innerHeight - 100) * aspectRatio,
        );
        const target = {
          x: (window.innerWidth - width) / 2,
          y: (window.innerHeight - width / aspectRatio) / 2,
          width,
          height: width / aspectRatio,
          rotation: 0,
        };
        timelineRef.current?.kill();
        if (!initializedRef.current) {
          gsap.set(panel, origin);
          gsap.set([overlay, closeRef.current], { opacity: 0 });
          source.style.visibility = "hidden";
          initializedRef.current = true;
        }
        gsap.set(panel, { opacity: 1 });
        const time = reduced ? 0 : duration;
        const timeline = gsap.timeline({
          onComplete: open
            ? undefined
            : contextSafe!(() => {
                source.style.visibility = "";
                onExit();
              }),
        });
        timeline
          .to(
            panel,
            {
              ...(open ? target : origin),
              duration: time,
              ease: "power3.inOut",
            },
            0,
          )
          .to(
            overlay,
            {
              opacity: open ? 1 : 0,
              duration: time * 0.75,
              ease: "power2.out",
            },
            0,
          )
          .to(
            closeRef.current,
            { opacity: open ? 1 : 0, duration: time * 0.3 },
            open ? time * 0.65 : 0,
          );
        timelineRef.current = timeline;
      });
      transitionRef.current = animate;
      animate();
    },
    {
      scope: panelRef,
      dependencies: [open, duration, aspectRatio, onExit, overlayRef, source],
      revertOnUpdate: false,
    },
  );

  return (
    <Dialog.Content
      ref={panelRef}
      aria-describedby={undefined}
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        closeRef.current?.focus({ preventScroll: true });
      }}
      onCloseAutoFocus={(event) => {
        event.preventDefault();
        source.focus({ preventScroll: true });
      }}
      onInteractOutside={(event) => {
        if (!open) event.preventDefault();
      }}
      className="fixed left-0 top-0 z-50 overflow-hidden bg-[#141419] shadow-2xl outline-none"
      style={{
        borderRadius,
        opacity: 0,
        willChange: "transform, width, height",
      }}
    >
      <Dialog.Title className="sr-only">{item.alt}</Dialog.Title>
      <img
        src={item.src}
        alt={item.alt}
        draggable={false}
        className="h-full w-full object-cover"
      />
      <Dialog.Close asChild>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close image"
          className="absolute right-3 top-3 flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </Dialog.Close>
    </Dialog.Content>
  );
}

export function OrbitGallery({
  items,
  ringCount = 3,
  radius = 350,
  ringGap = 185,
  imageSize = 96,
  imageAspectRatio = 0.84,
  borderRadius = 12,
  speed = 3,
  reverse = false,
  autoRotate = true,
  pauseOnHover = true,
  tilt = 38,
  inertia = 0.8,
  hoverScale = 1.12,
  scrollSensitivity = 0.06,
  dragSensitivity = 0.22,
  motionDuration = 0.65,
  showControls = true,
  className,
  ariaLabel = "Orbit image gallery",
  onReady,
  onSelect,
}: OrbitGalleryProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const phaseRef = React.useRef({ rotation: 0, offset: 0 });
  const readyRef = React.useRef(onReady);
  const notifiedRef = React.useRef(false);
  const interactiveRef = React.useRef<{
    hover: (button: HTMLButtonElement, active: boolean) => void;
    focus: (index: number) => void;
  } | null>(null);
  const [paused, setPaused] = React.useState(false);
  const [selection, setSelection] = React.useState<Selection | null>(null);
  const [open, setOpen] = React.useState(false);
  const selectedRef = React.useRef(false);
  const pausedRef = React.useRef(false);
  const count = Math.round(bounded(ringCount, 3, 1, 5));
  const size = bounded(imageSize, 96, 40, 160);
  const ratio = bounded(imageAspectRatio, 0.84, 0.5, 1.5);
  const corners = bounded(borderRadius, 12, 0, 40);
  const easing = bounded(inertia, 0.8, 0.15, 2);
  const duration = bounded(motionDuration, 0.65, 0.2, 1.5);
  const slots = React.useMemo(() => {
    if (!items.length) return [];
    return Array.from({ length: count }, (_, ring) => {
      const length = Math.min(
        40,
        Math.max(12, Math.round(items.length * (1 + ring * 0.3))),
      );
      return Array.from(
        { length },
        (_, index): Slot => ({
          ring,
          angle: (index * 360) / length + ring * 9,
          itemIndex: (index + ring * 7) % items.length,
        }),
      );
    }).flat();
  }, [count, items.length]);

  React.useEffect(() => {
    readyRef.current = onReady;
  }, [onReady]);
  React.useEffect(() => {
    selectedRef.current = Boolean(selection);
  }, [selection]);
  React.useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current;
      if (!root) return;
      const buttons = Array.from(
        root.querySelectorAll<HTMLButtonElement>("[data-orbit-item]"),
      );
      const setters = buttons.map((button) => gsap.quickSetter(button, "css"));
      const phase = phaseRef.current;
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      let reduced = media.matches;
      let width = 0;
      let height = 0;
      let targetOffset = phase.offset;
      let visible = true;
      let hovered = false;
      let lastRotation = NaN;
      let lastOffset = NaN;
      let ignoreClickUntil = 0;
      let dragging: {
        id: number;
        x: number;
        y: number;
        offset: number;
        active: boolean;
      } | null = null;
      const move = gsap.quickTo(phase, "offset", {
        duration: easing,
        ease: "power3.out",
      });
      const motion = { velocity: 0 };
      const changeVelocity = gsap.quickTo(motion, "velocity", {
        duration: 0.6,
        ease: "power2.out",
      });
      let targetVelocity = -1;
      const render = (force = false) => {
        if (
          !width ||
          !height ||
          (!force &&
            phase.rotation === lastRotation &&
            phase.offset === lastOffset)
        )
          return;
        const scale = Math.max(0.32, width / 1600);
        const imageWidth = Math.max(30, size * scale);
        buttons.forEach((button, index) => {
          const slot = slots[index];
          const direction = slot.ring % 2 ? -1 : 1;
          const angle =
            slot.angle +
            direction *
              (phase.rotation + phase.offset) *
              (1 + slot.ring * 0.12);
          const radians = (angle * Math.PI) / 180;
          const distance =
            (bounded(radius, 350, 220, 550) +
              slot.ring * bounded(ringGap, 185, 100, 260)) *
            scale;
          setters[index]({
            x: width / 2 + Math.cos(radians) * distance - imageWidth / 2,
            y:
              height / 2 +
              Math.sin(radians) * distance -
              imageWidth / ratio / 2,
            rotation: reduced
              ? 0
              : Math.sin(radians * 2) * bounded(tilt, 38, 0, 65),
          });
        });
        lastRotation = phase.rotation;
        lastOffset = phase.offset;
      };
      const measure = () => {
        width = root.clientWidth;
        height = root.clientHeight;
        const imageWidth = Math.max(30, size * Math.max(0.32, width / 1600));
        gsap.set(buttons, { width: imageWidth, height: imageWidth / ratio });
        gsap.set(
          buttons.map((button) =>
            button.querySelector("[data-orbit-thumbnail]"),
          ),
          { borderRadius: corners * Math.min(1, Math.max(0.32, width / 1600)) },
        );
        render(true);
        if (width && height && !notifiedRef.current) {
          notifiedRef.current = true;
          readyRef.current?.();
        }
      };
      const advance = (delta: number) => {
        targetOffset += delta;
        if (reduced) {
          move.tween.pause();
          phase.offset = targetOffset;
          render();
        } else move(targetOffset);
      };
      const wheel = (event: WheelEvent) => {
        if (
          event.ctrlKey ||
          event.metaKey ||
          selectedRef.current ||
          !slots.length
        )
          return;
        event.preventDefault();
        const delta =
          (event.deltaY || event.deltaX) *
          (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1);
        advance(
          Math.max(-160, Math.min(160, delta)) *
            bounded(scrollSensitivity, 0.06, 0.01, 0.3),
        );
      };
      const pointerDown = (event: PointerEvent) => {
        if (
          event.button !== 0 ||
          selectedRef.current ||
          (event.target as HTMLElement).closest("[data-orbit-control]")
        )
          return;
        dragging = {
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          offset: targetOffset,
          active: false,
        };
      };
      const pointerMove = (event: PointerEvent) => {
        if (!dragging || event.pointerId !== dragging.id) return;
        const delta =
          event.clientX - dragging.x + (event.clientY - dragging.y) * 0.5;
        if (
          !dragging.active &&
          Math.hypot(event.clientX - dragging.x, event.clientY - dragging.y) < 6
        )
          return;
        if (!dragging.active) {
          dragging.active = true;
          root.setPointerCapture(event.pointerId);
        }
        targetOffset =
          dragging.offset - delta * bounded(dragSensitivity, 0.22, 0.05, 0.6);
        if (reduced) {
          phase.offset = targetOffset;
          render();
        } else move(targetOffset);
      };
      const pointerUp = (event: PointerEvent) => {
        if (!dragging || event.pointerId !== dragging.id) return;
        if (dragging.active) {
          ignoreClickUntil = performance.now() + 350;
          if (root.hasPointerCapture(event.pointerId))
            root.releasePointerCapture(event.pointerId);
        }
        dragging = null;
      };
      const captureClick = (event: MouseEvent) => {
        if (performance.now() < ignoreClickUntil) {
          event.preventDefault();
          event.stopPropagation();
        }
      };
      const keyboard = (event: KeyboardEvent) => {
        if (
          selectedRef.current ||
          (event.target as HTMLElement).closest("[data-orbit-control]")
        )
          return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          advance(event.key === "ArrowRight" ? 18 : -18);
        }
        if (event.key === " " && event.target === root) {
          event.preventDefault();
          setPaused((value) => !value);
        }
      };
      const enter = () => {
        hovered = true;
      };
      const leave = () => {
        hovered = false;
      };
      const changeMotion = () => {
        reduced = media.matches;
        move.tween.pause();
        targetOffset = phase.offset;
        render(true);
      };
      const tick = (_time: number, delta: number) => {
        if (!visible || document.hidden || selectedRef.current) {
          move.tween.pause();
          targetOffset = phase.offset;
          return;
        }
        const velocity =
          !reduced &&
          autoRotate &&
          !pausedRef.current &&
          !(pauseOnHover && hovered) &&
          !dragging
            ? 1
            : 0;
        if (velocity !== targetVelocity) {
          targetVelocity = velocity;
          if (reduced) {
            changeVelocity.tween.pause();
            motion.velocity = 0;
          } else changeVelocity(velocity);
        }
        if (motion.velocity) {
          phase.rotation +=
            (Math.min(delta, 40) / 1000) *
            bounded(speed, 3, 0, 18) *
            motion.velocity *
            (reverse ? -1 : 1);
        }
        render();
      };
      interactiveRef.current = {
        hover: contextSafe!((button: HTMLButtonElement, active: boolean) => {
          const thumbnail = button.querySelector("[data-orbit-thumbnail]");
          gsap.to(thumbnail, {
            scale: active ? bounded(hoverScale, 1.12, 1, 1.4) : 1,
            duration: reduced ? 0 : 0.4,
            ease: "power3.out",
            overwrite: true,
          });
          button.style.zIndex = active ? "2" : "1";
        }),
        focus: (index: number) => {
          const button = buttons[index];
          if (!button) return;
          const rect = button.getBoundingClientRect();
          const frame = root.getBoundingClientRect();
          if (rect.top < frame.top + 10 || rect.bottom > frame.bottom - 10) {
            const slot = slots[index];
            const rate = (slot.ring % 2 ? -1 : 1) * (1 + slot.ring * 0.12);
            const angle = slot.angle + rate * (phase.rotation + phase.offset);
            advance(-(((((angle + 180) % 360) + 360) % 360) - 180) / rate);
          }
        },
      };
      const resize = new ResizeObserver(measure);
      const intersection = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { threshold: 0 },
      );
      resize.observe(root);
      intersection.observe(root);
      root.addEventListener("wheel", wheel, { passive: false });
      root.addEventListener("pointerdown", pointerDown);
      root.addEventListener("pointermove", pointerMove);
      root.addEventListener("pointerup", pointerUp);
      root.addEventListener("pointercancel", pointerUp);
      root.addEventListener("lostpointercapture", pointerUp);
      root.addEventListener("click", captureClick, true);
      root.addEventListener("keydown", keyboard);
      root.addEventListener("pointerenter", enter);
      root.addEventListener("pointerleave", leave);
      media.addEventListener("change", changeMotion);
      measure();
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        move.tween.kill();
        changeVelocity.tween.kill();
        resize.disconnect();
        intersection.disconnect();
        root.removeEventListener("wheel", wheel);
        root.removeEventListener("pointerdown", pointerDown);
        root.removeEventListener("pointermove", pointerMove);
        root.removeEventListener("pointerup", pointerUp);
        root.removeEventListener("pointercancel", pointerUp);
        root.removeEventListener("lostpointercapture", pointerUp);
        root.removeEventListener("click", captureClick, true);
        root.removeEventListener("keydown", keyboard);
        root.removeEventListener("pointerenter", enter);
        root.removeEventListener("pointerleave", leave);
        media.removeEventListener("change", changeMotion);
        interactiveRef.current = null;
      };
    },
    {
      scope: rootRef,
      dependencies: [
        slots,
        size,
        ratio,
        corners,
        radius,
        ringGap,
        speed,
        reverse,
        autoRotate,
        pauseOnHover,
        tilt,
        easing,
        hoverScale,
        scrollSensitivity,
        dragSensitivity,
      ],
      revertOnUpdate: true,
    },
  );

  const exit = React.useCallback(() => {
    selectedRef.current = false;
    setSelection(null);
  }, []);
  const close = (value: boolean) => {
    if (!value) {
      setOpen(false);
      onSelect?.(null);
    }
  };

  return (
    <Dialog.Root open={Boolean(selection)} onOpenChange={close}>
      <div
        ref={rootRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className={cn(
          "relative isolate h-full min-h-64 w-full overflow-hidden bg-[#0c0c10] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/40",
          className,
        )}
        style={{ touchAction: "pan-y" }}
      >
        <div
          className="absolute inset-0"
          role="list"
          aria-label="Gallery images"
        >
          {slots.map((slot, index) => {
            const item = items[slot.itemIndex];
            return (
              <div key={`${slot.ring}-${index}`} role="listitem">
                <button
                  type="button"
                  data-orbit-item
                  aria-label={`View ${item.alt}, ring ${slot.ring + 1}`}
                  aria-haspopup="dialog"
                  tabIndex={slot.ring === 0 && index < items.length ? 0 : -1}
                  onPointerEnter={(event) =>
                    interactiveRef.current?.hover(event.currentTarget, true)
                  }
                  onPointerLeave={(event) => {
                    if (!event.currentTarget.matches(":focus-visible"))
                      interactiveRef.current?.hover(event.currentTarget, false);
                  }}
                  onFocus={(event) => {
                    if (event.currentTarget.matches(":focus-visible")) {
                      interactiveRef.current?.hover(event.currentTarget, true);
                      interactiveRef.current?.focus(index);
                    }
                  }}
                  onBlur={(event) =>
                    interactiveRef.current?.hover(event.currentTarget, false)
                  }
                  onClick={(event) => {
                    if (selectedRef.current) return;
                    selectedRef.current = true;
                    const image = event.currentTarget.querySelector("img");
                    setSelection({
                      item,
                      source: event.currentTarget,
                      aspectRatio:
                        image?.naturalWidth && image.naturalHeight
                          ? image.naturalWidth / image.naturalHeight
                          : ratio,
                    });
                    setOpen(true);
                    onSelect?.(item);
                  }}
                  className="absolute left-0 top-0 z-1 cursor-pointer border-0 bg-transparent p-0 outline-none will-change-transform focus-visible:z-10"
                  style={{ width: 0, height: 0 }}
                >
                  <span
                    data-orbit-thumbnail
                    className="block h-full w-full overflow-hidden bg-[#26262d] shadow-sm ring-white/80 in-focus-visible:ring-2"
                    style={{ borderRadius: corners }}
                  >
                    <img
                      src={item.src}
                      alt=""
                      draggable={false}
                      loading="eager"
                      decoding="async"
                      className="h-full w-full select-none object-cover"
                    />
                  </span>
                </button>
              </div>
            );
          })}
        </div>
        {showControls && autoRotate && (
          <button
            type="button"
            data-orbit-control
            onClick={() => setPaused((value) => !value)}
            aria-label={
              paused ? "Resume gallery motion" : "Pause gallery motion"
            }
            aria-pressed={paused}
            className="absolute bottom-4 left-4 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#0c0c10]/80 text-white/60 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {paused ? (
              <Play size={14} aria-hidden="true" />
            ) : (
              <Pause size={14} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {selection && (
        <Dialog.Portal>
          <Dialog.Overlay
            ref={overlayRef}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          />
          <OrbitImage
            selection={selection}
            open={open}
            duration={duration}
            borderRadius={corners}
            overlayRef={overlayRef}
            onExit={exit}
          />
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}

export default OrbitGallery;
