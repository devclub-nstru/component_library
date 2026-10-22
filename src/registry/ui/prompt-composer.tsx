"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowUp,
  CalendarDays,
  FileText,
  ImagePlus,
  LoaderCircle,
  Mic,
  Plus,
  StickyNote,
  X,
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  promptComposerBounded as bounded,
  promptComposerSpring,
} from "./prompt-composer-motion";
import { PromptComposerArt, type PromptActionId } from "./prompt-composer-art";
import {
  PromptComposerModelPicker,
  type PromptComposerModel,
} from "./prompt-composer-model";
import {
  PromptComposerRecorder,
  type PromptTranscriber,
} from "./prompt-composer-recorder";

gsap.registerPlugin(useGSAP);

export type { PromptActionId, PromptComposerModel, PromptTranscriber };

export interface PromptComposerAction {
  id: PromptActionId;
  label: string;
  placeholder: string;
}

export interface PromptComposerSubmission {
  text: string;
  action: PromptActionId | null;
  model: string;
}

export interface PromptComposerProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSend?: (prompt: PromptComposerSubmission) => void | Promise<void>;
  actions?: readonly PromptComposerAction[];
  models?: readonly PromptComposerModel[];
  defaultModel?: string;
  onModelChange?: (model: PromptComposerModel) => void;
  placeholder?: string;
  label?: string;
  theme?: "system" | "light" | "dark";
  width?: number;
  radius?: number;
  cardLift?: number;
  cardSpread?: number;
  speed?: number;
  stiffness?: number;
  damping?: number;
  accentColor?: string;
  defaultTrayOpen?: boolean;
  disabled?: boolean;
  demoVoice?: boolean;
  onTranscribe?: PromptTranscriber;
  errorMessage?: string;
  className?: string;
  style?: CSSProperties;
}

export const PROMPT_COMPOSER_ACTIONS: readonly PromptComposerAction[] = [
  {
    id: "image",
    label: "Create image",
    placeholder: "Describe the image you want…",
  },
  { id: "note", label: "Add note", placeholder: "Write a note…" },
  {
    id: "event",
    label: "Create event",
    placeholder: "What’s the event, and when?",
  },
  { id: "voice", label: "Voice mode", placeholder: "" },
  { id: "docs", label: "Analyse docs", placeholder: "Ask about a document…" },
];

export const PROMPT_COMPOSER_MODELS: readonly PromptComposerModel[] = [
  { id: "quick", name: "Quick 1.5", description: "Fast answers" },
  { id: "deep", name: "Deep 2.0", description: "Thinks it through" },
  { id: "vision", name: "Vision 1.2", description: "Sees your images" },
];

const cardStyle = {
  image: { tilt: -5, rise: 0, layer: 1, Icon: ImagePlus },
  note: { tilt: 2.5, rise: 3, layer: 2, Icon: StickyNote },
  event: { tilt: -2, rise: 6, layer: 4, Icon: CalendarDays },
  voice: { tilt: 3, rise: 3, layer: 3, Icon: Mic },
  docs: { tilt: -4.5, rise: 0, layer: 4, Icon: FileText },
} as const;

export const PromptComposer = forwardRef<HTMLDivElement, PromptComposerProps>(
  function PromptComposer(
    {
      value,
      defaultValue = "",
      onValueChange,
      onSend,
      actions = PROMPT_COMPOSER_ACTIONS,
      models = PROMPT_COMPOSER_MODELS,
      defaultModel,
      onModelChange,
      placeholder = "Ask anything",
      label = "Message",
      theme = "system",
      width = 760,
      radius = 18,
      cardLift = 16,
      cardSpread = 10,
      speed = 1,
      stiffness = 360,
      damping = 32,
      accentColor = "#ee8068",
      defaultTrayOpen = true,
      disabled = false,
      demoVoice = false,
      onTranscribe,
      errorMessage = "Could not send your message. Please try again.",
      className,
      style,
    },
    forwardedRef,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mountedRef = useRef(false);
    const sendingRef = useRef(false);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const [draft, setDraft] = useState(defaultValue);
    const [actionId, setActionId] = useState<PromptActionId | null>(null);
    const [trayOpen, setTrayOpen] = useState(defaultTrayOpen);
    const [hovered, setHovered] = useState<PromptActionId | null>(null);
    const [modelId, setModelId] = useState(defaultModel ?? models[0]?.id);
    const [voiceOpen, setVoiceOpen] = useState(false);
    const voiceWasOpenRef = useRef(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [round, setRound] = useState(0);
    const reduced = useReducedMotion();
    const inputId = useId();
    const fanId = useId();
    const errorId = useId();
    const text = value ?? draft;
    const uniqueActions = actions
      .filter(
        (action, index) =>
          actions.findIndex((candidate) => candidate.id === action.id) ===
          index,
      )
      .slice(0, 5);
    const availableModels = models.filter(
      (model, index) =>
        models.findIndex((candidate) => candidate.id === model.id) === index,
    );
    const model =
      availableModels.find((candidate) => candidate.id === modelId) ??
      availableModels[0];
    const picked =
      uniqueActions.find((action) => action.id === actionId) ?? null;
    const voiceEnabled = Boolean(onTranscribe || demoVoice);
    const [voiceAvailable, setVoiceAvailable] = useState(
      !disabled && voiceEnabled,
    );
    if (voiceAvailable !== (!disabled && voiceEnabled)) {
      setVoiceAvailable(!disabled && voiceEnabled);
      setVoiceOpen(false);
    }
    const recording = voiceOpen && voiceAvailable;
    const fanUp = trayOpen && !picked && !recording;
    const busy = disabled || sending || recording;
    const motionSpeed = bounded(speed, 1, 0.5, 2);
    const canSend = Boolean(text.trim() && model && !busy);

    useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
      };
    }, []);

    useEffect(() => {
      if (voiceWasOpenRef.current && !recording && !disabled)
        inputRef.current?.focus({ preventScroll: true });
      voiceWasOpenRef.current = recording;
    }, [recording, disabled]);

    const updateText = (next: string) => {
      setDraft(next);
      onValueChange?.(next);
    };
    const focusInput = () => inputRef.current?.focus({ preventScroll: true });
    const clearAction = () => {
      setActionId(null);
      setTrayOpen(true);
      setHovered(null);
      focusInput();
    };

    useGSAP(
      () => {
        gsap.set("[data-prompt-card]", {
          yPercent: 120,
          autoAlpha: 0,
          scale: 0.92,
          rotation: 0,
        });
      },
      { scope: rootRef },
    );

    useGSAP(
      () => {
        const root = rootRef.current;
        if (!root) return;
        const { duration, ease } = promptComposerSpring(
          stiffness,
          damping,
          motionSpeed,
          reduced,
        );
        timelineRef.current?.kill();
        const timeline = gsap.timeline({
          defaults: { duration, ease, overwrite: "auto" },
        });
        timelineRef.current = timeline;
        const cards = Array.from(
          root.querySelectorAll<HTMLButtonElement>("[data-prompt-card]"),
        );
        const hoverIndex = cards.findIndex(
          (card) => card.dataset.promptCard === hovered,
        );
        cards.forEach((card, index) => {
          const id = uniqueActions[index]?.id;
          if (!id) return;
          const config = cardStyle[id];
          const lifted = fanUp && hovered === id;
          const near = hoverIndex >= 0 && Math.abs(hoverIndex - index) === 1;
          const direction =
            hoverIndex < 0 || lifted ? 0 : index < hoverIndex ? -1 : 1;
          timeline.to(
            card,
            {
              yPercent: fanUp ? 0 : 120,
              y: fanUp
                ? -config.rise -
                  (lifted ? bounded(cardLift, 16, 0, 32) : near ? 3 : 0)
                : 0,
              x: fanUp
                ? direction * bounded(cardSpread, 10, 0, 20) * (near ? 1 : 0.4)
                : 0,
              rotation: fanUp
                ? lifted
                  ? config.tilt * 0.3
                  : config.tilt + direction * (near ? 1.5 : 0.5)
                : 0,
              scale: fanUp ? (lifted ? 1.05 : 1) : 0.92,
              autoAlpha: fanUp ? 1 : 0,
            },
            reduced
              ? 0
              : hovered
                ? 0
                : fanUp
                  ? index * 0.035
                  : id === actionId
                    ? 0.05
                    : 0,
          );
          const artwork = (selector: string, vars: gsap.TweenVars) => {
            const targets = card.querySelectorAll(selector);
            if (targets.length)
              timeline.to(
                targets,
                {
                  transformOrigin: "50% 50%",
                  duration,
                  ...vars,
                },
                0,
              );
          };
          artwork("[data-art-spark]", {
            rotation: lifted && !reduced ? 90 : 0,
            scale: lifted && !reduced ? 1.2 : 1,
          });
          artwork("[data-art-triangle]", {
            rotation: lifted && !reduced ? -14 : 0,
          });
          artwork("[data-art-circle], [data-art-date], [data-art-doc]", {
            y: lifted && !reduced ? -3 : 0,
          });
          artwork("[data-art-line]", {
            scaleX: lifted && !reduced ? 0.9 : 1,
            transformOrigin: "0% 50%",
          });
          artwork("[data-art-mic], [data-art-dot]", {
            scale: lifted && !reduced ? 1.08 : 1,
          });
          artwork("[data-art-fold]", { scale: lifted && !reduced ? 1.15 : 1 });
        });
        timeline.to("[data-tray-icon]", { rotation: fanUp ? 0 : 135 }, 0);
        return () => {
          timeline.kill();
        };
      },
      {
        scope: rootRef,
        dependencies: [
          fanUp,
          hovered,
          picked?.id,
          voiceOpen,
          reduced,
          motionSpeed,
          cardLift,
          cardSpread,
          stiffness,
          damping,
          round,
          uniqueActions.map((action) => action.id).join(","),
        ],
      },
    );

    useGSAP(
      () => {
        if (!voiceOpen)
          gsap.fromTo(
            "[data-composer-content]",
            { opacity: 0, y: reduced ? 0 : 4 },
            {
              opacity: 1,
              y: 0,
              duration: reduced ? 0 : 0.2 / motionSpeed,
              ease: "power2.out",
              overwrite: true,
            },
          );
      },
      {
        scope: rootRef,
        dependencies: [picked?.id, voiceOpen, round, reduced, motionSpeed],
      },
    );

    const send = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canSend || !model || sendingRef.current) return;
      sendingRef.current = true;
      setSending(true);
      setError("");
      try {
        await onSend?.({
          text: text.trim(),
          action: picked?.id ?? null,
          model: model.id,
        });
        if (!mountedRef.current) return;
        updateText("");
        setActionId(null);
        setTrayOpen(true);
        setHovered(null);
        setRound((current) => current + 1);
      } catch {
        if (mountedRef.current) setError(errorMessage);
      } finally {
        sendingRef.current = false;
        if (mountedRef.current) {
          setSending(false);
          inputRef.current?.focus({ preventScroll: true });
        }
      }
    };

    const tone =
      "[--pc-paper:#fff] [--pc-foot:#f2f2f2] [--pc-ink:#363636] [--pc-muted:#797979] [--pc-art:#d4d4d4] [--pc-border:#00000016] [--pc-pill:#f0f0f0] [--pc-field:#fafafa] [--pc-rule:#c6c6c6]";
    const darkTone =
      "[--pc-paper:#272729] [--pc-foot:#202022] [--pc-ink:#ededee] [--pc-muted:#a3a3a8] [--pc-art:#404044] [--pc-border:#ffffff1a] [--pc-pill:#262628] [--pc-field:#202022] [--pc-rule:#454548]";
    const systemTone =
      "dark:[--pc-paper:#272729] dark:[--pc-foot:#202022] dark:[--pc-ink:#ededee] dark:[--pc-muted:#a3a3a8] dark:[--pc-art:#404044] dark:[--pc-border:#ffffff1a] dark:[--pc-pill:#262628] dark:[--pc-field:#202022] dark:[--pc-rule:#454548]";
    const ChipIcon = picked ? cardStyle[picked.id].Icon : null;

    return (
      <div
        ref={(element) => {
          rootRef.current = element;
          if (typeof forwardedRef === "function") forwardedRef(element);
          else if (forwardedRef) forwardedRef.current = element;
        }}
        data-slot="prompt-composer"
        data-theme={theme}
        className={cn(
          "@container/composer w-full min-w-0 text-[var(--pc-ink)]",
          tone,
          theme === "dark" ? darkTone : theme === "system" ? systemTone : "",
          className,
        )}
        style={
          {
            maxWidth: bounded(width, 760, 280, 1200),
            "--pc-radius": `${bounded(radius, 18, 10, 28)}px`,
            "--pc-accent": accentColor,
            ...style,
          } as CSSProperties
        }
      >
        <form
          onSubmit={send}
          aria-label="Prompt composer"
          aria-busy={sending}
          onKeyDown={(event) => {
            if (event.key === "Escape" && voiceOpen) {
              setVoiceOpen(false);
              focusInput();
            }
          }}
          className="relative grid min-w-0 grid-cols-1 items-end gap-x-3 gap-y-3 @min-[561px]/composer:grid-cols-[auto_minmax(0,1fr)]"
        >
          {model && (
            <div className="order-2 @min-[561px]/composer:order-0 @min-[561px]/composer:pb-1.5">
              <PromptComposerModelPicker
                models={availableModels}
                value={model}
                onChange={(next) => {
                  setModelId(next.id);
                  onModelChange?.(next);
                }}
                disabled={busy}
                speed={motionSpeed}
                stiffness={stiffness}
                damping={damping}
              />
            </div>
          )}
          <div
            className={cn(
              "@container/field min-w-0",
              !model && "col-span-full",
            )}
          >
            <div className="relative min-w-0 pt-[calc(17cqw+8px)]">
              <div
                id={fanId}
                inert={!fanUp || busy}
                aria-hidden={!fanUp}
                className="absolute inset-x-0 top-2 h-[21cqw] [clip-path:inset(-64px_-32px_calc(4cqw_-_24px)_-32px)]"
                onPointerLeave={() => setHovered(null)}
              >
                {uniqueActions.map((action, index) => {
                  const config = cardStyle[action.id];
                  const isVoiceDisabled =
                    action.id === "voice" && !voiceEnabled;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      data-prompt-card={action.id}
                      aria-label={action.label}
                      disabled={busy || isVoiceDisabled}
                      tabIndex={fanUp && !busy ? 0 : -1}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse")
                          setHovered(action.id);
                      }}
                      onFocus={() => setHovered(action.id)}
                      onBlur={() => setHovered(null)}
                      onClick={() => {
                        setHovered(null);
                        setError("");
                        if (action.id === "voice") setVoiceOpen(true);
                        else {
                          setActionId(action.id);
                          focusInput();
                        }
                      }}
                      className="absolute top-0 h-[21cqw] w-[18.6cqw] origin-bottom cursor-pointer rounded-[clamp(8px,2.5cqw,15px)] shadow-[0_2px_6px_#0000000a,0_8px_18px_#0000000a] outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-accent)] disabled:cursor-default disabled:opacity-60"
                      style={{
                        left: `calc(${50 + (index - (uniqueActions.length - 1) / 2) * 17.9}% - 9.3cqw)`,
                        zIndex: hovered === action.id ? 10 : config.layer,
                        transform: `rotate(${config.tilt}deg)`,
                      }}
                    >
                      <span
                        className={cn(
                          "absolute inset-0 overflow-hidden rounded-[inherit] border border-[var(--pc-border)] bg-linear-to-b from-[var(--pc-paper)] to-[var(--pc-foot)] shadow-[inset_0_1px_0_#ffffff20]",
                          action.id === "docs" &&
                            "[clip-path:polygon(0_0,80%_0,100%_20%,100%_100%,0_100%)]",
                        )}
                      >
                        {(action.id === "note" || action.id === "event") && (
                          <span
                            className={cn(
                              "absolute inset-x-0 top-0 h-[15%] border-b border-black/10 bg-linear-to-b shadow-[inset_0_1px_0_#ffffff60]",
                              action.id === "note"
                                ? "from-[#ffe495] to-[#f3ce61]"
                                : "from-[#f49a9d] to-[#de6b70]",
                            )}
                          />
                        )}
                        {action.id === "docs" && (
                          <span
                            data-art-fold
                            className="absolute top-0 right-0 size-[3.8cqw] origin-top-right rounded-bl-[0.9cqw] bg-[var(--pc-art)] shadow-[-2px_2px_3px_#00000016]"
                          />
                        )}
                        <span
                          className={cn(
                            "absolute inset-x-[7%] top-[9%] text-center text-[clamp(8px,1.75cqw,12px)] leading-tight font-medium text-[var(--pc-muted)]",
                            (action.id === "note" || action.id === "event") &&
                              "top-[22%]",
                            action.id === "docs" && "right-[22%] left-[4%]",
                          )}
                        >
                          {action.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-x-0 top-[37%] bottom-0 flex justify-center text-[var(--pc-art)]",
                            (action.id === "event" || action.id === "note") &&
                              "top-[43%]",
                          )}
                        >
                          <PromptComposerArt id={action.id} />
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="relative z-20 flex h-13 min-w-0 items-center rounded-[var(--pc-radius)] border border-[var(--pc-border)] bg-[var(--pc-field)] pr-1.5 shadow-[0_1px_2px_#00000004,inset_0_1px_0_#ffffff08] focus-within:ring-2 focus-within:ring-[var(--pc-accent)]/40">
                {recording ? (
                  <PromptComposerRecorder
                    demo={!onTranscribe && demoVoice}
                    onTranscribe={onTranscribe}
                    onComplete={(transcript) => {
                      updateText(
                        [text.trim(), transcript].filter(Boolean).join(" "),
                      );
                      setVoiceOpen(false);
                      focusInput();
                    }}
                    onCancel={() => {
                      setVoiceOpen(false);
                      focusInput();
                    }}
                    onError={(message) => {
                      setError(message);
                      setVoiceOpen(false);
                      focusInput();
                    }}
                  />
                ) : (
                  <div
                    key={`${picked?.id ?? "plain"}-${round}`}
                    data-composer-content
                    className="flex h-full min-w-0 flex-1 items-center gap-1 pl-2.5 @min-[421px]/field:gap-2 @min-[421px]/field:pl-4"
                  >
                    {picked && ChipIcon && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={clearAction}
                        aria-label={`Remove ${picked.label}`}
                        data-action-chip
                        className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-[var(--pc-pill)] px-2 text-[11px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-accent)] disabled:opacity-50"
                      >
                        <ChipIcon
                          className="size-3.5 text-[var(--pc-accent)]"
                          aria-hidden="true"
                        />
                        <span className="hidden max-w-28 truncate @min-[481px]/field:inline">
                          {picked.label}
                        </span>
                        <X className="size-3" aria-hidden="true" />
                      </button>
                    )}
                    <label htmlFor={inputId} className="sr-only">
                      {label}
                    </label>
                    <input
                      ref={inputRef}
                      id={inputId}
                      value={text}
                      onChange={(event) => {
                        updateText(event.target.value);
                        if (error) setError("");
                      }}
                      onKeyDown={(event) => {
                        if (
                          picked &&
                          (event.key === "Escape" ||
                            (event.key === "Backspace" && !text))
                        ) {
                          event.preventDefault();
                          clearAction();
                        }
                      }}
                      disabled={busy}
                      placeholder={picked?.placeholder ?? placeholder}
                      autoComplete="off"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? errorId : undefined}
                      className="h-full w-0 min-w-0 flex-1 bg-transparent text-base text-[var(--pc-ink)] outline-none placeholder:text-[var(--pc-muted)] disabled:opacity-60 @min-[561px]/composer:text-sm"
                    />
                    <button
                      type="button"
                      aria-label={
                        fanUp ? "Hide quick actions" : "Show quick actions"
                      }
                      aria-expanded={fanUp}
                      aria-controls={fanId}
                      disabled={busy}
                      onClick={() => {
                        if (picked) clearAction();
                        else setTrayOpen(!trayOpen);
                        setHovered(null);
                      }}
                      className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-[var(--pc-ink)] outline-none hover:bg-[var(--pc-pill)] focus-visible:ring-2 focus-visible:ring-[var(--pc-accent)] disabled:opacity-40"
                    >
                      <Plus
                        data-tray-icon
                        className="size-5"
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      type="button"
                      aria-label="Voice mode"
                      disabled={busy || !voiceEnabled}
                      onClick={() => {
                        setError("");
                        setHovered(null);
                        setVoiceOpen(true);
                      }}
                      className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full outline-none hover:bg-[var(--pc-pill)] focus-visible:ring-2 focus-visible:ring-[var(--pc-accent)] disabled:cursor-default disabled:opacity-35"
                    >
                      <Mic className="size-4.5" aria-hidden="true" />
                    </button>
                    <button
                      type="submit"
                      aria-label={sending ? "Sending message" : "Send message"}
                      disabled={!canSend}
                      className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-[var(--pc-accent)] text-white outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc-accent)] focus-visible:ring-offset-2 disabled:cursor-default disabled:bg-[var(--pc-pill)] disabled:text-[var(--pc-muted)]"
                    >
                      {sending ? (
                        <LoaderCircle
                          className="size-4 motion-safe:animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowUp
                          className="size-4"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {error && (
            <p
              id={errorId}
              role="alert"
              className="col-span-full order-3 max-w-full text-xs leading-5 text-red-500"
            >
              {error}
            </p>
          )}
        </form>
      </div>
    );
  },
);

export default PromptComposer;
