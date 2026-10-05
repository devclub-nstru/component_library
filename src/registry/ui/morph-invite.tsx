"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { calcGeneratorDuration, spring } from "motion";
import { Check, LoaderCircle, Mail, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export interface MorphInviteMember {
  id: string;
  name: string;
  email?: string;
  color?: string;
}

export interface MorphInviteProps {
  members?: readonly MorphInviteMember[];
  onInvite: (
    email: string,
    signal: AbortSignal,
  ) => void | MorphInviteMember | Promise<void | MorphInviteMember>;
  stiffness?: number;
  damping?: number;
  mass?: number;
  speed?: number;
  expandedWidth?: number;
  disabled?: boolean;
  className?: string;
}

const defaultMembers: readonly MorphInviteMember[] = [
  { id: "alex", name: "Alex", color: "#e9e4d7" },
  { id: "maya", name: "Maya", color: "#dce5df" },
  { id: "leo", name: "Leo", color: "#e3dff0" },
];

const bounded = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

export function MorphInvite({
  members = defaultMembers,
  onInvite,
  stiffness = 420,
  damping = 32,
  mass = 0.8,
  speed = 1,
  expandedWidth = 360,
  disabled = false,
  className,
}: MorphInviteProps) {
  const uid = useId();
  const [state, setState] = useState<
    "idle" | "editing" | "sending" | "sent"
  >("idle");
  const [email, setEmail] = useState("");
  const [invited, setInvited] = useState<MorphInviteMember[]>([]);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const spinnerRef = useRef<SVGSVGElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const focusRef = useRef<"input" | "trigger" | null>(null);
  const layoutRef = useRef<((immediate?: boolean) => void) | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const seenRef = useRef(new Set<string>());
  const expanded = state !== "idle";
  const busy = state === "sending" || state === "sent";
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const roster = useMemo(
    () => [
      ...invited,
      ...members.filter(
        (member) => !invited.some((item) => item.id === member.id),
      ),
    ],
    [invited, members],
  );
  const visibleMembers = roster.slice(0, 4);
  const avatarWidth = visibleMembers.length
    ? 32 + (visibleMembers.length - 1) * 21
    : 0;
  const compactWidth = visibleMembers.length
    ? 32 + (visibleMembers.length - 1) * 5
    : 0;
  const rosterKey = visibleMembers.map((member) => member.id).join("|");

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const pill = pillRef.current;
      const form = formRef.current;
      const trigger = triggerRef.current;
      if (!wrapper || !pill || !form || !trigger) return;

      const response = spring({
        keyframes: [0, 1],
        stiffness: bounded(stiffness, 420, 80, 800),
        damping: bounded(damping, 32, 12, 80),
        mass: bounded(mass, 0.8, 0.25, 3),
        restSpeed: 0.001,
        restDelta: 0.001,
      });
      const settleTime = calcGeneratorDuration(response) / 1000;
      const springEase = (progress: number) =>
        progress === 1 ? 1 : response.next(progress * settleTime * 1000).value;
      const media = gsap.matchMedia();
      media.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          standard: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const sync = context.add("sync", (immediate = false) => {
            const avatars = Array.from(
              pill.querySelectorAll<HTMLElement>("[data-invite-avatar]"),
            );
            const isExpanded = pill.dataset.state !== "idle";
            const stackWidth = avatars.length ? 32 + (avatars.length - 1) * 21 : 0;
            const targetWidth = isExpanded
              ? bounded(expandedWidth, 360, 280, 560)
              : stackWidth + (stackWidth ? 16 : 8) + 98;
            const reduced = Boolean(context.conditions?.reduced);
            const duration = immediate || reduced
              ? 0
              : settleTime / bounded(speed, 1, 0.25, 3);
            const fadeDuration = immediate || reduced
              ? 0
              : Math.min(0.18, duration);

            timelineRef.current?.kill();
            const timeline = gsap.timeline({
              defaults: { duration, ease: springEase, overwrite: "auto" },
            });
            timelineRef.current = timeline;
            timeline.to(
              pill,
              { width: Math.min(targetWidth, wrapper.clientWidth) },
              0,
            );
            timeline.to(trigger, {
              autoAlpha: isExpanded ? 0 : 1,
              x: isExpanded ? -6 : 0,
              duration: fadeDuration,
              ease: "power2.out",
            }, 0);
            timeline.to(form, {
              autoAlpha: isExpanded ? 1 : 0,
              x: isExpanded ? 0 : 8,
              duration: fadeDuration,
              ease: "power2.out",
            }, isExpanded && duration ? 0.06 : 0);
            avatars.forEach((avatar, index) => {
              const id = avatar.dataset.inviteAvatar!;
              if (!immediate && !reduced && !seenRef.current.has(id)) {
                gsap.set(avatar, {
                  x: 54, y: -22, scale: 0.45, opacity: 0,
                });
              }
              timeline.to(avatar, {
                x: index * (isExpanded ? 5 : 21),
                y: 0,
                scale: isExpanded ? 0.9 : 1,
                opacity: 1,
              }, 0);
              seenRef.current.add(id);
            });
            timeline.call(() => {
              if (focusRef.current === "input" && isExpanded) {
                inputRef.current?.focus({ preventScroll: true });
                focusRef.current = null;
              } else if (focusRef.current === "trigger" && !isExpanded) {
                trigger.focus({ preventScroll: true });
                focusRef.current = null;
              }
            }, [], fadeDuration + (isExpanded && duration ? 0.06 : 0));
          });

          layoutRef.current = (immediate) => sync(immediate);
          sync(true);
          const observer = new ResizeObserver(() => sync(true));
          observer.observe(wrapper);
          return () => {
            observer.disconnect();
            timelineRef.current?.kill();
            layoutRef.current = null;
          };
        },
        wrapper,
      );
      return () => media.revert();
    },
    {
      scope: wrapperRef,
      dependencies: [stiffness, damping, mass, speed, expandedWidth],
      revertOnUpdate: true,
    },
  );

  useGSAP(() => layoutRef.current?.(), {
    scope: wrapperRef,
    dependencies: [expanded, rosterKey],
  });

  useGSAP(
    () => {
      if (state === "sent") {
        gsap.delayedCall(Math.max(0.85, timelineRef.current?.duration() ?? 0), () => {
          const restoreFocus = pillRef.current?.contains(document.activeElement);
          if (restoreFocus) focusRef.current = "trigger";
          setState("idle");
          setEmail("");
        });
      }
      if (state !== "sending" || !spinnerRef.current) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(spinnerRef.current, {
          rotation: 360,
          duration: 0.8,
          repeat: -1,
          ease: "none",
          transformOrigin: "center",
        });
      });
      return () => media.revert();
    },
    { scope: wrapperRef, dependencies: [state], revertOnUpdate: true },
  );

  useEffect(() => {
    if (state !== "editing") return;
    inputRef.current?.focus({ preventScroll: true });
    const onPointerDown = (event: PointerEvent) => {
      if (!pillRef.current?.contains(event.target as Node) && !requestRef.current) {
        focusRef.current = null;
        setState("idle");
        setError("");
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [state]);

  useEffect(() => () => requestRef.current?.abort(), []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled || busy || requestRef.current || !validEmail) return;
    const address = email.trim();
    if (roster.some((member) => member.email?.toLowerCase() === address.toLowerCase())) {
      setError("This person has already been invited.");
      inputRef.current?.focus();
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setError("");
    setState("sending");
    setAnnouncement(`Sending an invitation to ${address}.`);
    try {
      const member = await onInvite(address, controller.signal);
      if (controller.signal.aborted) return;
      const newMember = member ?? {
        id: address.toLowerCase(),
        email: address,
        name: address.split("@")[0],
        color: "#4f46e5",
      };
      setInvited((current) => [
        newMember,
        ...current.filter((item) => item.id !== newMember.id),
      ]);
      setState("sent");
      setAnnouncement(`Invitation sent to ${address}.`);
    } catch (reason) {
      if (controller.signal.aborted) return;
      setState("editing");
      setError(
        reason instanceof Error && reason.message
          ? reason.message
          : "Couldn’t send the invitation. Try again.",
      );
      setAnnouncement("");
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
    }
  };

  return (
    <div ref={wrapperRef} className={cn("relative flex w-full max-w-full flex-col items-center", className)}>
      <div
        ref={pillRef}
        data-state={state}
        className="relative isolate h-12 w-[188px] max-w-full rounded-full border border-black/5 bg-white text-zinc-900 shadow-[0_2px_3px_-1px_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-white/10 dark:bg-[#242426] dark:text-zinc-100 dark:shadow-[0_8px_28px_-12px_rgba(0,0,0,0.6)]"
        onKeyDown={(event) => {
          if (event.key === "Escape" && state === "editing" && !requestRef.current) {
            event.preventDefault();
            event.stopPropagation();
            setState("idle");
            setError("");
            focusRef.current = "trigger";
          }
        }}
      >
        <div role="group" aria-label={`${roster.length} team members`} className="pointer-events-none absolute top-[7px] left-[7px] h-8" style={{ width: avatarWidth }}>
          {visibleMembers.map((member, index) => (
            <span
              key={member.id}
              data-invite-avatar={member.id}
              aria-label={member.name}
              title={member.name}
              className="absolute top-0 left-0 flex size-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-medium dark:border-[#242426]"
              style={{
                zIndex: visibleMembers.length - index,
                backgroundColor: member.color ?? "#e3dff0",
                color: member.color === "#4f46e5" ? "#ffffff" : "#3f3f46",
              }}
            >
              {member.name.trim().charAt(0).toUpperCase() || "?"}
            </span>
          ))}
        </div>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          tabIndex={expanded ? -1 : 0}
          aria-hidden={expanded || undefined}
          aria-expanded={expanded}
          aria-controls={`${uid}-form`}
          onClick={() => {
            focusRef.current = "input";
            setError("");
            setState("editing");
          }}
          className="absolute top-[5px] right-[5px] flex h-9 w-[92px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[#efeee8] text-xs font-medium hover:bg-[#e8e7df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/8 dark:hover:bg-white/12"
        >
          <Plus className="size-3.5" strokeWidth={2} aria-hidden="true" />
          Invite
        </button>
        <form
          ref={formRef}
          id={`${uid}-form`}
          aria-label="Invite a team member"
          aria-hidden={!expanded || undefined}
          aria-busy={state === "sending"}
          inert={!expanded}
          onSubmit={submit}
          className="invisible absolute top-[5px] right-[5px] flex h-9 min-w-0 items-center gap-2 rounded-full bg-[#efeee8] pl-3 pr-1 opacity-0 dark:bg-white/8"
          style={{ left: compactWidth + (compactWidth ? 15 : 5) }}
        >
          <Mail className="size-3.5 shrink-0 text-zinc-600 dark:text-zinc-400" strokeWidth={1.8} aria-hidden="true" />
          <input
            ref={inputRef}
            type="email"
            name="email"
            required
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            aria-label="Email address"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${uid}-error` : undefined}
            placeholder="Invite by email"
            value={email}
            disabled={disabled}
            readOnly={busy}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            className={cn(
              "h-full w-full min-w-0 flex-1 bg-transparent text-[16px] tracking-tight outline-none placeholder:text-zinc-500 sm:text-xs dark:placeholder:text-zinc-400",
              state === "sent" && "text-zinc-500 dark:text-zinc-400",
            )}
          />
          <button
            type="submit"
            disabled={disabled || !validEmail || busy}
            aria-label={
              state === "sending" ? "Sending invitation"
                : state === "sent" ? "Invitation sent" : "Send invitation"
            }
            className={cn(
              "flex h-7 min-w-[56px] shrink-0 cursor-pointer items-center justify-center gap-1 rounded-full px-2.5 text-[11px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-default",
              state === "sent"
                ? "bg-indigo-600 text-white"
                : validEmail
                  ? "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                  : "bg-[#deddd5] text-zinc-600 dark:bg-white/10 dark:text-zinc-400",
            )}
          >
            {state === "sending" ? (
              <LoaderCircle ref={spinnerRef} className="size-3.5" aria-hidden="true" />
            ) : state === "sent" ? (
              <><Check className="size-3" aria-hidden="true" />Sent</>
            ) : "Send"}
          </button>
        </form>
      </div>
      <p
        id={`${uid}-error`}
        role="alert"
        className="absolute top-full mt-3 max-w-full text-center text-xs text-rose-600 dark:text-rose-400"
      >
        {error}
      </p>
      <span role="status" className="sr-only">{announcement}</span>
    </div>
  );
}
