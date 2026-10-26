"use client";

import { useId, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export interface MeetTeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  imageAlt?: string;
  imagePosition?: string;
  href?: string;
}

export interface MeetTeamProps {
  members: readonly MeetTeamMember[];
  title?: string;
  subtitle?: string;
  cardWidth?: number;
  aspectRatio?: number;
  gap?: number;
  tilt?: number;
  depth?: number;
  perspective?: number;
  borderRadius?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  grayscale?: boolean;
  followPointer?: boolean;
  showDetails?: boolean;
  showControls?: boolean;
  className?: string;
  cardClassName?: string;
  ariaLabel?: string;
  onMemberChange?: (member: MeetTeamMember) => void;
}

const bounded = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

export function MeetTeam({
  members,
  title = "Meet Team",
  subtitle = "Different minds. One shared direction.",
  cardWidth = 210,
  aspectRatio = 0.76,
  gap = 20,
  tilt = 52,
  depth = 36,
  perspective = 1200,
  borderRadius = 4,
  stiffness = 180,
  damping = 28,
  mass = 1,
  grayscale = true,
  followPointer = true,
  showDetails = true,
  showControls = true,
  className,
  cardClassName,
  ariaLabel = "Meet the team",
  onMemberChange,
}: MeetTeamProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<((index: number) => void) | null>(null);
  const callbackRef = useRef(onMemberChange);
  const membersRef = useRef(members);
  const memberKey = JSON.stringify(members.map((member) => member.id));
  const selectionRef = useRef(members[Math.floor(members.length / 2)]?.id);
  const [selectedId, setSelectedId] = useState(
    () => members[Math.floor(members.length / 2)]?.id,
  );
  const headingId = useId();
  const instructionsId = useId();
  const selectionIndex = members.findIndex(
    (member) => member.id === selectedId,
  );
  const selectedIndex =
    selectionIndex < 0 ? Math.floor(members.length / 2) : selectionIndex;
  const selected = members[selectedIndex];
  const width = bounded(cardWidth, 210, 100, 360);
  const ratio = bounded(aspectRatio, 0.76, 0.6, 1.2);
  const spacing = bounded(gap, 20, 0, 64);
  const angle = bounded(tilt, 52, 0, 70);
  const recession = bounded(depth, 36, 0, 100);
  const tension = bounded(stiffness, 180, 60, 600);
  const friction = bounded(damping, 28, 10, 80);
  const weight = bounded(mass, 1, 0.5, 3);

  useGSAP(
    () => {
      membersRef.current = members;
      callbackRef.current = onMemberChange;
    },
    { dependencies: [members, onMemberChange] },
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      if (!root || !stage || membersRef.current.length === 0) return;

      const cards = Array.from(
        stage.querySelectorAll<HTMLButtonElement>("[data-team-card]"),
      );
      const media = gsap.matchMedia();
      media.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          standard: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const reduced = Boolean(context.conditions?.reduced);
          const initialIndex = membersRef.current.findIndex(
            (member) => member.id === selectionRef.current,
          );
          let current =
            initialIndex < 0 ? Math.floor(cards.length / 2) : initialIndex;
          let target = current;
          let velocity = 0;
          let fittedWidth = width;
          let ticking = false;
          let visible = true;
          let pointer: {
            id: number;
            x: number;
            y: number;
            start: number;
          } | null = null;
          let dragged = false;
          let lastIndex = current;
          const transforms = cards.map((card) => gsap.quickSetter(card, "css"));

          const render = () => {
            const radians = (angle * Math.PI) / 180;
            transforms.forEach((set, index) => {
              const distance = index - current;
              const absolute = Math.abs(distance);
              const curved = Math.min(absolute, 2.5);
              const rate = radians / 2.5;
              const offset =
                rate > 0
                  ? fittedWidth *
                    (Math.sin(curved * rate) / rate +
                      Math.max(0, absolute - 2.5) * Math.cos(radians))
                  : fittedWidth * absolute;
              set({
                x: Math.sign(distance) * (offset + absolute * spacing),
                y: 0,
                z: -Math.min(absolute, 6) * recession,
                rotationY:
                  -Math.sign(distance) * Math.min(absolute / 2.5, 1) * angle,
              });
              cards[index].style.zIndex = String(
                cards.length - Math.round(absolute),
              );
            });
          };

          const stop = () => {
            gsap.ticker.remove(tick);
            ticking = false;
          };
          const tick = (_time: number, deltaTime: number) => {
            const elapsed = Math.min(deltaTime / 1000, 0.064);
            const steps = Math.max(1, Math.ceil(elapsed / (1 / 240)));
            const step = elapsed / steps;
            for (let index = 0; index < steps; index++) {
              velocity +=
                ((tension * (target - current) - friction * velocity) /
                  weight) *
                step;
              current += velocity * step;
            }
            render();
            if (
              Math.abs(target - current) < 0.0001 &&
              Math.abs(velocity) < 0.001
            ) {
              current = target;
              velocity = 0;
              render();
              stop();
            }
          };
          const start = () => {
            if (reduced || !visible || document.hidden) {
              current = target;
              velocity = 0;
              render();
              return;
            }
            if (!ticking) {
              ticking = true;
              gsap.ticker.add(tick);
            }
          };
          const choose = (index: number) => {
            target = gsap.utils.clamp(0, cards.length - 1, index);
            const next = Math.round(target);
            const member = membersRef.current[next];
            if (!member) return;
            if (lastIndex !== next || selectionRef.current !== member.id) {
              lastIndex = next;
              selectionRef.current = member.id;
              setSelectedId(member.id);
              callbackRef.current?.(member);
            }
            root.dataset.activeMember = member.id;
            start();
          };
          const measure = () => {
            fittedWidth = Math.max(
              1,
              Math.min(
                width,
                stage.clientWidth * 0.58,
                Math.max(1, stage.clientHeight - 40) * ratio,
              ),
            );
            gsap.set(cards, {
              width: fittedWidth,
              height: fittedWidth / ratio,
              xPercent: -50,
              yPercent: -50,
            });
            render();
          };
          const down = (event: PointerEvent) => {
            if (!event.isPrimary || event.button !== 0) return;
            pointer = {
              id: event.pointerId,
              x: event.clientX,
              y: event.clientY,
              start: target,
            };
            dragged = false;
          };
          const move = (event: PointerEvent) => {
            if (!event.isPrimary) return;
            const bounds = stage.getBoundingClientRect();
            if (pointer?.id === event.pointerId) {
              const dx = event.clientX - pointer.x;
              const dy = event.clientY - pointer.y;
              if (!dragged && Math.abs(dy) > Math.max(8, Math.abs(dx))) {
                pointer = null;
                return;
              }
              if (!dragged && Math.abs(dx) > 6) {
                dragged = true;
                stage.setPointerCapture(event.pointerId);
                stage.dataset.dragging = "true";
              }
              if (dragged) {
                event.preventDefault();
                const scale = bounds.width / Math.max(1, stage.clientWidth);
                choose(pointer.start - dx / (scale * (fittedWidth + spacing)));
              }
            } else if (
              followPointer &&
              !reduced &&
              event.pointerType === "mouse" &&
              event.buttons === 0
            ) {
              const progress = gsap.utils.clamp(
                0,
                1,
                (event.clientX - bounds.left) / Math.max(1, bounds.width),
              );
              choose(progress * (cards.length - 1));
            }
          };
          const leave = () => {
            if (!pointer) choose(Math.round(target));
          };
          const release = (event: PointerEvent) => {
            if (event.type === "lostpointercapture" && event.target !== stage)
              return;
            if (pointer?.id !== event.pointerId) return;
            pointer = null;
            if (stage.hasPointerCapture(event.pointerId))
              stage.releasePointerCapture(event.pointerId);
            delete stage.dataset.dragging;
            choose(Math.round(target));
          };
          const click = (event: MouseEvent) => {
            if (dragged) {
              event.preventDefault();
              event.stopPropagation();
              dragged = false;
            }
          };
          const keyboard = (event: KeyboardEvent) => {
            const next =
              event.key === "ArrowRight"
                ? Math.round(target) + 1
                : event.key === "ArrowLeft"
                  ? Math.round(target) - 1
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? cards.length - 1
                      : null;
            if (next === null) return;
            event.preventDefault();
            const index = gsap.utils.clamp(0, cards.length - 1, next);
            choose(index);
            cards[index]?.focus({ preventScroll: true });
          };
          const focus = (event: FocusEvent) => {
            const index = cards.findIndex((card) => card === event.target);
            if (index >= 0) {
              choose(index);
              if (pointer && !dragged) pointer.start = target;
            }
          };
          const visibility = () => {
            if (document.hidden) stop();
            else start();
          };
          const resize = new ResizeObserver(measure);
          const intersection = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
            else stop();
          });

          root.dataset.reducedMotion = String(reduced);
          navigationRef.current = choose;
          measure();
          choose(current);
          resize.observe(stage);
          intersection.observe(stage);
          stage.addEventListener("pointerdown", down);
          stage.addEventListener("pointermove", move);
          stage.addEventListener("pointerleave", leave);
          window.addEventListener("pointerup", release);
          window.addEventListener("pointercancel", release);
          stage.addEventListener("lostpointercapture", release);
          stage.addEventListener("click", click, true);
          stage.addEventListener("keydown", keyboard);
          stage.addEventListener("focusin", focus);
          document.addEventListener("visibilitychange", visibility);

          return () => {
            stop();
            resize.disconnect();
            intersection.disconnect();
            if (pointer && stage.hasPointerCapture(pointer.id))
              stage.releasePointerCapture(pointer.id);
            stage.removeEventListener("pointerdown", down);
            stage.removeEventListener("pointermove", move);
            stage.removeEventListener("pointerleave", leave);
            window.removeEventListener("pointerup", release);
            window.removeEventListener("pointercancel", release);
            stage.removeEventListener("lostpointercapture", release);
            stage.removeEventListener("click", click, true);
            stage.removeEventListener("keydown", keyboard);
            stage.removeEventListener("focusin", focus);
            document.removeEventListener("visibilitychange", visibility);
            delete root.dataset.reducedMotion;
            delete root.dataset.activeMember;
            delete stage.dataset.dragging;
            navigationRef.current = null;
          };
        },
        root,
      );
      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [
        memberKey,
        width,
        ratio,
        spacing,
        angle,
        recession,
        tension,
        friction,
        weight,
        followPointer,
      ],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={rootRef}
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      data-slot="meet-team"
      className={cn(
        "relative isolate flex min-h-100 w-full flex-col justify-center gap-5 overflow-hidden bg-[#f2f1ed] py-8 font-sans text-zinc-950 dark:bg-[#151517] dark:text-zinc-100",
        className,
      )}
    >
      <header className="shrink-0 px-6 text-center">
        <h2
          id={headingId}
          className="text-xl font-medium tracking-[-0.04em] sm:text-2xl"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {subtitle}
          </p>
        )}
      </header>
      <p id={instructionsId} className="sr-only">
        Drag to explore. Use the left and right arrow keys, Home, or End to
        choose a team member.
      </p>
      {members.length > 0 ? (
        <>
          <div
            ref={stageRef}
            role="group"
            aria-labelledby={headingId}
            aria-describedby={instructionsId}
            data-team-stage
            className="relative min-h-32 w-full shrink select-none [transform-style:preserve-3d] data-[dragging=true]:cursor-grabbing"
            style={{
              height: width / ratio + 64,
              perspective: bounded(perspective, 1200, 500, 2400),
              touchAction: "pan-y pinch-zoom",
            }}
          >
            {members.map((member, index) => (
              <button
                key={member.id}
                type="button"
                data-team-card
                aria-label={`${member.name}, ${member.role}`}
                aria-pressed={member.id === selected?.id}
                tabIndex={index === selectedIndex ? 0 : -1}
                onClick={() => navigationRef.current?.(index)}
                className={cn(
                  "absolute left-1/2 top-1/2 cursor-grab border-0 bg-zinc-200 p-0 text-left outline-none will-change-transform [backface-visibility:hidden] focus-visible:ring-2 focus-visible:ring-zinc-800 focus-visible:ring-offset-4 dark:bg-zinc-800 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-[#151517]",
                  cardClassName,
                )}
                style={{
                  width,
                  height: width / ratio,
                  borderRadius: bounded(borderRadius, 4, 0, 40),
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span
                  className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[inherit] text-5xl text-zinc-500"
                  aria-hidden="true"
                >
                  {member.name
                    .split(/\s+/)
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                {member.image && (
                  <img
                    key={member.image}
                    src={member.image}
                    alt={member.imageAlt ?? member.name}
                    draggable={false}
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                    className="relative h-full w-full rounded-[inherit] object-cover"
                    style={{
                      objectPosition: member.imagePosition ?? "50% 40%",
                      filter: grayscale ? "grayscale(1)" : undefined,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
          {(showDetails || showControls) && (
            <footer className="relative z-10 mx-auto flex w-full max-w-lg shrink-0 items-center justify-between gap-4 px-6 pt-2">
              {showControls && (
                <button
                  type="button"
                  aria-label="Previous team member"
                  disabled={selectedIndex === 0}
                  onClick={() => navigationRef.current?.(selectedIndex - 1)}
                  className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-zinc-950/15 hover:bg-zinc-950/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current disabled:cursor-default disabled:opacity-30 dark:border-white/20 dark:hover:bg-white/5"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                </button>
              )}
              <div
                className="min-w-0 flex-1 text-center"
                aria-live="polite"
                aria-atomic="true"
              >
                {showDetails && selected && (
                  <>
                    <p className="truncate text-sm font-medium">
                      {selected.name}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                      {selected.role}
                    </p>
                    {selected.href && (
                      <a
                        href={selected.href}
                        className="mt-2 inline-flex items-center gap-1 text-xs underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
                      >
                        View profile
                        <ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                    )}
                  </>
                )}
                {showControls && (
                  <p className="mt-2 text-[10px] tabular-nums tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                    {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                    {String(members.length).padStart(2, "0")}
                  </p>
                )}
              </div>
              {showControls && (
                <button
                  type="button"
                  aria-label="Next team member"
                  disabled={selectedIndex === members.length - 1}
                  onClick={() => navigationRef.current?.(selectedIndex + 1)}
                  className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-zinc-950/15 hover:bg-zinc-950/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current disabled:cursor-default disabled:opacity-30 dark:border-white/20 dark:hover:bg-white/5"
                >
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
            </footer>
          )}
        </>
      ) : (
        <p
          role="status"
          className="flex flex-1 items-center justify-center p-8 text-sm text-zinc-500 dark:text-zinc-400"
        >
          No team members to display.
        </p>
      )}
    </section>
  );
}
