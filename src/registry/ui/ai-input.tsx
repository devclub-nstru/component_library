"use client";

import * as React from "react";
import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useId,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const SPRING_TRANSITION =
  "max-width 0.42s cubic-bezier(0.16, 1, 0.3, 1), height 0.42s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.28s ease, box-shadow 0.3s ease";
const SMOOTH_HEIGHT_TRANSITION =
  "max-width 0.42s cubic-bezier(0.16, 1, 0.3, 1), height 0.16s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.3s ease";

const emptySubscribe = () => () => {};

export interface Attachment {
  id: string;
  file: File;
  url: string;
  name: string;
  width?: number;
  height?: number;
}

export interface ModelOption {
  name: string;
  icon?: string | React.ReactNode;
}

export interface PromptInputMeta {
  model: string;
  effort: string;
  attachments: File[];
}

export interface PromptInputRef {
  focus: () => void;
  expand: () => void;
  collapse: () => void;
  startVoice: () => void;
  stopVoice: () => void;
  addAttachment: (
    file: File,
    url: string,
    width?: number,
    height?: number,
  ) => void;
  clear: () => void;
  element: HTMLDivElement | null;
}

export interface PromptInputProps {
  onSubmit?: (value: string, meta: PromptInputMeta) => void;
  placeholder?: string;
  className?: string;
  models?: (string | ModelOption)[];
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  efforts?: string[];
  selectedEffort?: string;
  onEffortChange?: (effort: string) => void;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  maxAttachments?: number;
  allowAttachments?: boolean;
  allowVoice?: boolean;
  allowModelSelect?: boolean;
  allowEffortSelect?: boolean;
  minWidth?: number | string;
  maxWidth?: number | string;
  collapsedHeight?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  accentColor?: string;
  variant?: "default" | "glow" | "minimal";
  modelIcons?: Record<string, string | React.ReactNode>;
}

interface BrowserSpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: { transcript: string };
    };
  };
}

interface BrowserSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

const DEFAULT_MODELS: string[] = [
  "GPT 5.5",
  "Opus 4.8",
  "Gemini 3.5 Flash",
  "Composer 2.5",
  "GLM 5.2",
];

const DEFAULT_EFFORTS: string[] = ["Low", "Medium", "Max Effort"];

const DEFAULT_ICONS: Record<string, string> = {
  "Composer 2.5":
    "https://cdn.21st.dev/assets/mirror/7d/7dc00bc09f225fcda46cbc9c6b669c69c025a231877d6c17baa6a003f04f02b2.svg",
  "Gemini 3.5 Flash":
    "https://cdn.21st.dev/assets/mirror/cd/cda2df6631d5fa227de3fa04ed78cf354f910ba92a9f086e7455655c10ad9d09.svg",
  "GPT 5.5":
    "https://cdn.21st.dev/assets/mirror/b9/b93fa7942be639a1dae60194ff12141145d7d9fd59581582d6ff23335755f19c.svg",
  "Opus 4.8":
    "https://cdn.21st.dev/assets/mirror/5d/5de1221c77cc91e748066fd642ad0eee1c1fa65328814f5178166f901e599709.svg",
  "GLM 5.2":
    "https://cdn.21st.dev/assets/mirror/b2/b2a6c0ff63efd8a555edf8a174ea6fcfeca120ac1595a2d461ca11d3ae89276c.svg",
};

function ArrowUpIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="1"
        width="4"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2.75 6.5V7a4.25 4.25 0 0 0 8.5 0v-.5M7 11.25V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 2.5V11.5M2.5 7H11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 2.5L11.5 11.5M11.5 2.5L2.5 11.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 7.5L5.5 10.5L11.5 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DynamicBarsIcon({ level }: { level: string }) {
  const isMediumOrHigh = level === "Medium" || level === "Max Effort";
  const isHigh = level === "Max Effort";

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="1.5"
        y="8"
        width="2.5"
        height="4.5"
        rx="1"
        fill="currentColor"
        className="transition-opacity duration-300"
        opacity={1}
      />
      <rect
        x="5.75"
        y="5"
        width="2.5"
        height="7.5"
        rx="1"
        fill="currentColor"
        className="transition-opacity duration-300"
        opacity={isMediumOrHigh ? 1 : 0.3}
      />
      <rect
        x="10"
        y="2"
        width="2.5"
        height="10.5"
        rx="1"
        fill="currentColor"
        className="transition-opacity duration-300"
        opacity={isHigh ? 1 : 0.3}
      />
    </svg>
  );
}

function ModelFallbackIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="7"
        cy="7"
        r="5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="3 2"
      />
      <circle cx="7" cy="7" r="2" fill="currentColor" />
    </svg>
  );
}

function ModelIcon({
  model,
  customIcon,
  className,
}: {
  model: string;
  customIcon?: string | React.ReactNode;
  className?: string;
}) {
  const [loadFailed, setLoadFailed] = useState(false);

  if (customIcon && typeof customIcon !== "string") {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center",
          className,
        )}
      >
        {customIcon}
      </span>
    );
  }

  const iconSrc =
    typeof customIcon === "string" ? customIcon : DEFAULT_ICONS[model];

  if (!iconSrc || loadFailed) {
    return (
      <ModelFallbackIcon
        className={cn("size-3.5 shrink-0 opacity-70", className)}
      />
    );
  }

  return (
    <img
      src={iconSrc}
      alt={model}
      onError={() => setLoadFailed(true)}
      className={cn(
        "size-3.5 shrink-0 object-contain",
        model === "GPT 5.5" && "dark:invert",
        className,
      )}
    />
  );
}

function MorphingText({ text }: { text: string }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | "auto">("auto");

  useLayoutEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.getBoundingClientRect().width);
    }
  }, [text]);

  return (
    <span
      className="relative inline-flex items-center justify-center overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ width: width === "auto" ? "auto" : `${width}px` }}
    >
      <span ref={spanRef} className="invisible whitespace-nowrap px-1">
        {text}
      </span>
      <span
        key={text}
        className="absolute inset-0 flex items-center justify-center whitespace-nowrap animate-in fade-in zoom-in-95 duration-200"
      >
        {text}
      </span>
    </span>
  );
}

function AttachmentThumb({
  attachment,
  index,
  onRemove,
  onOpen,
  registerRef,
}: {
  attachment: Attachment;
  index: number;
  onRemove: (id: string) => void;
  onOpen: (attachment: Attachment, rect: DOMRect) => void;
  registerRef: (id: string, el: HTMLButtonElement | null) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={(el) => {
        btnRef.current = el;
        registerRef(attachment.id, el);
      }}
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (btnRef.current) {
          onOpen(attachment, btnRef.current.getBoundingClientRect());
        }
      }}
      style={{
        animationDelay: `${index * 35}ms`,
        animationFillMode: "backwards",
      }}
      className={cn(
        "group relative size-12 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-zinc-900/90 outline-none",
        "transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] active:scale-[0.96]",
        "animate-in fade-in slide-in-from-top-3 zoom-in-90 duration-300",
      )}
      aria-label={`Open preview of ${attachment.name}`}
    >
      <img
        src={attachment.url}
        alt={attachment.name}
        className="size-full object-cover"
        draggable={false}
      />
      <span
        className={cn(
          "absolute inset-0 flex items-start justify-end bg-black/0 transition-colors duration-200",
          isHovered && "bg-black/30",
        )}
      >
        <span
          role="button"
          tabIndex={-1}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(attachment.id);
          }}
          className={cn(
            "m-1 flex size-4 items-center justify-center rounded-full bg-zinc-200/90 text-zinc-600 dark:bg-zinc-950/90 dark:text-zinc-300 shadow-sm transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black hover:scale-110",
            isHovered
              ? "opacity-100 scale-100"
              : "opacity-0 scale-50 pointer-events-none",
          )}
          aria-label={`Remove ${attachment.name}`}
        >
          <CloseIcon />
        </span>
      </span>
    </button>
  );
}

function AttachmentGalleryModal({
  attachment,
  originRect,
  onClose,
}: {
  attachment: Attachment;
  originRect: DOMRect;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"opening" | "open" | "closing">("opening");

  const targetGeometry = React.useMemo(() => {
    if (typeof window === "undefined") {
      return { top: 0, left: 0, width: 300, height: 200, radius: 20 };
    }
    const maxW = Math.min(window.innerWidth * 0.88, 620);
    const maxH = Math.min(window.innerHeight * 0.82, 760);

    const naturalW = attachment.width || 800;
    const naturalH = attachment.height || 600;
    const scale = Math.min(maxW / naturalW, maxH / naturalH, 1.5);

    const width = naturalW * scale;
    const height = naturalH * scale;

    return {
      top: (window.innerHeight - height) / 2,
      left: (window.innerWidth - width) / 2,
      width,
      height,
      radius: 20,
    };
  }, [attachment.width, attachment.height]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase("open"));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = useCallback(() => setPhase("closing"), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const isOpen = phase === "open";
  const isClosing = phase === "closing";

  const geometry = isOpen
    ? targetGeometry
    : {
        top: originRect.top,
        left: originRect.left,
        width: originRect.width,
        height: originRect.height,
        radius: 12,
      };

  const animEasing = isClosing ? "ease-out" : "cubic-bezier(0.16, 1, 0.3, 1)";
  const animDur = isClosing ? "0.26s" : "0.38s";
  const flipTransition = `top ${animDur} ${animEasing}, left ${animDur} ${animEasing}, width ${animDur} ${animEasing}, height ${animDur} ${animEasing}, border-radius ${animDur} ${animEasing}`;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
      />
      <div
        style={{
          position: "fixed",
          top: geometry.top,
          left: geometry.left,
          width: geometry.width,
          height: geometry.height,
          borderRadius: geometry.radius,
          transition: flipTransition,
          overflow: "hidden",
          boxShadow: isOpen
            ? "0 28px 70px -15px rgba(0, 0, 0, 0.7)"
            : "0 0 0 0 transparent",
        }}
        className="bg-zinc-100 border border-zinc-200 dark:bg-zinc-950 dark:border-white/10"
        onTransitionEnd={() => {
          if (phase === "closing") onClose();
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={attachment.url}
          alt={attachment.name}
          className="size-full object-cover select-none"
          draggable={false}
        />
      </div>

      <button
        type="button"
        onClick={handleClose}
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1)" : "scale(0.8)",
        }}
        className={cn(
          "fixed right-5 top-5 flex size-9 items-center justify-center rounded-full bg-white/90 text-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300 shadow-lg border border-zinc-200 dark:border-white/10 backdrop-blur-sm",
          "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white",
          !isOpen && "pointer-events-none",
        )}
        aria-label="Close image preview"
      >
        <span className="scale-125">
          <CloseIcon />
        </span>
      </button>
    </div>,
    document.body,
  );
}

export const PromptInput = React.forwardRef<PromptInputRef, PromptInputProps>(
  (
    {
      onSubmit,
      placeholder = "Ask anything",
      className,
      models = DEFAULT_MODELS,
      selectedModel: controlledModel,
      onModelChange,
      efforts = DEFAULT_EFFORTS,
      selectedEffort: controlledEffort,
      onEffortChange,
      defaultValue = "",
      value: controlledValue,
      onChange,
      expanded: controlledExpanded,
      onExpandedChange,
      maxAttachments = 6,
      allowAttachments = true,
      allowVoice = true,
      allowModelSelect = true,
      allowEffortSelect = true,
      minWidth = 320,
      maxWidth = 480,
      collapsedHeight = 48,
      autoFocus = false,
      disabled = false,
      accentColor,
      variant = "default",
      modelIcons,
    },
    ref,
  ) => {
    const inputId = useId();
    const mounted = useSyncExternalStore(
      emptySubscribe,
      () => true,
      () => false,
    );

    const normalizedModels: ModelOption[] = React.useMemo(() => {
      return models.map((m) => {
        if (typeof m === "string") {
          return { name: m, icon: modelIcons?.[m] };
        }
        return { name: m.name, icon: m.icon ?? modelIcons?.[m.name] };
      });
    }, [models, modelIcons]);

    const isControlledModel = controlledModel !== undefined;
    const [internalModel, setInternalModel] = useState<string>(
      controlledModel || (normalizedModels[0]?.name ?? "GPT 5.5"),
    );
    const activeModel = isControlledModel ? controlledModel : internalModel;

    const isControlledEffort = controlledEffort !== undefined;
    const [internalEffortIndex, setInternalEffortIndex] = useState(1);
    const currentEffort = isControlledEffort
      ? controlledEffort
      : efforts[internalEffortIndex] || efforts[0] || "Medium";

    const [isSmoothResize, setIsSmoothResize] = useState(false);
    const [localValue, setLocalValue] = useState(defaultValue);
    const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);

    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [activeAttachment, setActiveAttachment] = useState<{
      attachment: Attachment;
      rect: DOMRect;
    } | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [audioData, setAudioData] = useState<number[]>(new Array(5).fill(0));
    const valueRef = useRef(
      controlledValue !== undefined ? controlledValue : localValue,
    );

    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const rafRef = useRef<number | null>(null);
    const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
    const demoIntervalRef = useRef<number | null>(null);
    const demoTextIntervalRef = useRef<number | null>(null);

    const initialModelIdx = Math.max(
      0,
      normalizedModels.findIndex((m) => m.name === activeModel),
    );
    const [hoverStyle, setHoverStyle] = useState({
      opacity: 0,
      transform: `translateY(${initialModelIdx * 34}px) scale(0.96)`,
      transition: "none",
    });

    const [textareaHeight, setTextareaHeight] = useState(68);
    const containerHeight = Math.max(116, textareaHeight + 48);
    const [isScrolling, setIsScrolling] = useState(false);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : localValue;
    const hasAttachments = attachments.length > 0;
    const hasValue = value.trim() !== "" || hasAttachments;

    const isControlledExpanded = controlledExpanded !== undefined;
    const [internalExpanded, setInternalExpanded] = useState(
      Boolean(
        autoFocus ||
        (defaultValue && defaultValue.trim() !== "") ||
        (controlledValue && controlledValue.trim() !== ""),
      ),
    );
    const expanded = isControlledExpanded
      ? controlledExpanded
      : internalExpanded || hasValue;

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const internalContainerRef = useRef<HTMLDivElement>(null);
    const topFadeRef = useRef<HTMLDivElement>(null);
    const bottomFadeRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modelTriggerRef = useRef<HTMLButtonElement>(null);
    const modelMenuRef = useRef<HTMLDivElement>(null);
    const modelMenuId = `${inputId}-models`;
    const thumbRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

    useEffect(() => {
      valueRef.current = value;
    }, [value]);

    const updateFades = useCallback(() => {
      const el = textareaRef.current;
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (topFadeRef.current) {
        topFadeRef.current.style.opacity = Math.min(
          scrollTop / 20,
          1,
        ).toString();
      }
      if (bottomFadeRef.current) {
        const bottomScroll = scrollHeight - clientHeight - scrollTop;
        bottomFadeRef.current.style.opacity = Math.min(
          Math.max(bottomScroll - 16, 0) / 10,
          1,
        ).toString();
      }
    }, []);

    const handleValueChange = useCallback(
      (val: string) => {
        setIsSmoothResize(true);
        if (!isControlled) setLocalValue(val);
        onChange?.(val);
        if (val.trim() !== "" && !internalExpanded) {
          setInternalExpanded(true);
          onExpandedChange?.(true);
        }
      },
      [isControlled, onChange, internalExpanded, onExpandedChange],
    );

    const expand = useCallback(() => {
      setIsSmoothResize(false);
      setInternalExpanded(true);
      onExpandedChange?.(true);
    }, [onExpandedChange]);

    const stopRecording = useCallback(() => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {}
        audioContextRef.current = null;
      }
      if (demoIntervalRef.current) {
        window.clearInterval(demoIntervalRef.current);
        demoIntervalRef.current = null;
      }
      if (demoTextIntervalRef.current) {
        window.clearInterval(demoTextIntervalRef.current);
        demoTextIntervalRef.current = null;
      }
      setIsRecording(false);
      setAudioData(new Array(5).fill(0));
    }, []);

    const startRecording = useCallback(async () => {
      setIsSmoothResize(false);
      setInternalExpanded(true);
      onExpandedChange?.(true);

      let stream: MediaStream | null = null;
      try {
        if (
          typeof navigator !== "undefined" &&
          navigator.mediaDevices?.getUserMedia
        ) {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
      } catch {
        stream = null;
      }

      setIsRecording(true);

      const simulateText = () => {
        const fakeText =
          "Build a high performance, accessible AI prompt input with smooth spring transitions.";
        const words = fakeText.split(" ");
        let i = 0;
        let currentBase = valueRef.current;
        demoTextIntervalRef.current = window.setInterval(() => {
          if (i < words.length) {
            currentBase = (currentBase ? currentBase + " " : "") + words[i];
            handleValueChange(currentBase);
            i++;
          } else {
            stopRecording();
          }
        }, 260);
      };

      if (stream) {
        streamRef.current = stream;
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateVisualizer = () => {
          analyser.getByteFrequencyData(dataArray);
          const bands = new Array(5).fill(0);
          const step = Math.floor(dataArray.length / 5);
          for (let i = 0; i < 5; i++) {
            let sum = 0;
            for (let j = 0; j < step; j++) {
              sum += dataArray[i * step + j];
            }
            bands[i] = sum / step / 255;
          }
          setAudioData(bands);
          rafRef.current = requestAnimationFrame(updateVisualizer);
        };
        updateVisualizer();

        const SpeechRec =
          (
            window as unknown as {
              SpeechRecognition?: BrowserSpeechRecognitionConstructor;
              webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
            }
          ).SpeechRecognition ||
          (
            window as unknown as {
              SpeechRecognition?: BrowserSpeechRecognitionConstructor;
              webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
            }
          ).webkitSpeechRecognition;

        if (SpeechRec) {
          const recognition = new SpeechRec();
          recognition.continuous = true;
          recognition.interimResults = true;

          let baseline = valueRef.current;

          recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {
            let interimTranscript = "";
            let finalTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }

            if (finalTranscript) {
              baseline += (baseline ? " " : "") + finalTranscript;
            }

            handleValueChange(
              (
                baseline + (interimTranscript ? " " + interimTranscript : "")
              ).trim(),
            );
          };

          recognition.onerror = () => {
            stopRecording();
          };

          recognition.onend = () => {
            stopRecording();
          };

          recognitionRef.current = recognition;
          try {
            recognition.start();
          } catch {
            simulateText();
          }
        } else {
          simulateText();
        }
      } else {
        demoIntervalRef.current = window.setInterval(() => {
          setAudioData(
            Array.from({ length: 5 }, () => Math.random() * 0.75 + 0.15),
          );
        }, 90);
        simulateText();
      }
    }, [handleValueChange, stopRecording, onExpandedChange]);

    useEffect(() => {
      if (isRecording && textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }, [value, isRecording]);

    useEffect(() => {
      return () => {
        stopRecording();
        attachments.forEach((a) => URL.revokeObjectURL(a.url));
      };
    }, [stopRecording, attachments]);

    useEffect(() => {
      if (expanded && !isRecording) {
        const timer = setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            const length = textareaRef.current.value.length;
            textareaRef.current.setSelectionRange(length, length);
          }
        }, 40);
        return () => clearTimeout(timer);
      }
    }, [expanded, isRecording]);

    useEffect(() => {
      const el = textareaRef.current;
      if (!el) return;

      el.style.height = "auto";
      const scrollHeight = el.scrollHeight;
      const newHeight = Math.max(68, Math.min(scrollHeight, 180));
      el.style.height = `${newHeight}px`;

      setTextareaHeight(newHeight);
      setIsScrolling(scrollHeight > 180);
      updateFades();
    }, [value, expanded, updateFades]);

    const closeModelSelect = useCallback(() => {
      const restoreFocus = modelMenuRef.current?.contains(
        document.activeElement,
      );
      setIsModelSelectOpen(false);
      if (restoreFocus) modelTriggerRef.current?.focus();
    }, []);

    useEffect(() => {
      if (!isModelSelectOpen) return;

      const handleOutsideClick = (e: MouseEvent) => {
        if (
          internalContainerRef.current &&
          !internalContainerRef.current.contains(e.target as Node)
        ) {
          setIsModelSelectOpen(false);
        }
      };
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key !== "Escape") return;
        e.preventDefault();
        e.stopPropagation();
        closeModelSelect();
      };
      document.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("keydown", handleEscape, true);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
        window.removeEventListener("keydown", handleEscape, true);
      };
    }, [isModelSelectOpen, closeModelSelect]);

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      if (
        internalContainerRef.current &&
        internalContainerRef.current.contains(e.relatedTarget as Node)
      ) {
        return;
      }
      if (value.trim() === "" && !hasAttachments && !isRecording) {
        setIsSmoothResize(false);
        setInternalExpanded(false);
        onExpandedChange?.(false);
        setIsModelSelectOpen(false);
      }
    };

    const handleSubmit = () => {
      if (value.trim() === "" && !hasAttachments) return;
      setIsSmoothResize(false);
      onSubmit?.(value, {
        model: activeModel,
        effort: currentEffort,
        attachments: attachments.map((a) => a.file),
      });
      handleValueChange("");
      attachments.forEach((a) => URL.revokeObjectURL(a.url));
      setAttachments([]);
      setInternalExpanded(false);
      onExpandedChange?.(false);
      setIsModelSelectOpen(false);
    };

    const cycleEffort = (e: React.MouseEvent) => {
      e.stopPropagation();
      const nextIdx = (internalEffortIndex + 1) % efforts.length;
      if (!isControlledEffort) {
        setInternalEffortIndex(nextIdx);
      }
      onEffortChange?.(efforts[nextIdx]);
    };

    const selectModel = (modelName: string) => {
      if (!isControlledModel) {
        setInternalModel(modelName);
      }
      onModelChange?.(modelName);
      closeModelSelect();
    };

    const activeModelIndex = Math.max(
      0,
      normalizedModels.findIndex((m) => m.name === activeModel),
    );

    const highlightModel = (idx: number) => {
      setHoverStyle({
        opacity: 1,
        transform: `translateY(${idx * 34}px) scale(1)`,
        transition:
          "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease",
      });
    };

    const focusModelOption = (idx: number) => {
      const options = modelMenuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitemradio"]',
      );
      if (!options?.length) return;
      options[(idx + options.length) % options.length].focus();
    };

    const openModelSelectWithFocus = () => {
      setIsModelSelectOpen(true);
      requestAnimationFrame(() => focusModelOption(activeModelIndex));
    };

    const handleModelMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const options = Array.from(
        e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitemradio"]'),
      );
      const current = options.indexOf(document.activeElement as HTMLElement);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        focusModelOption(current + (e.key === "ArrowDown" ? 1 : -1));
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        focusModelOption(e.key === "Home" ? 0 : options.length - 1);
      } else if (e.key === "Tab") {
        setIsModelSelectOpen(false);
      }
    };

    const openFileChooser = (e: React.MouseEvent) => {
      e.stopPropagation();
      fileInputRef.current?.click();
    };

    const addAttachment = useCallback(
      (file: File, url: string, width = 800, height = 600) => {
        const id = `${file.name}-${file.lastModified || Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        setAttachments((prev) => [
          ...prev,
          { id, file, url, name: file.name, width, height },
        ]);
        setInternalExpanded(true);
        onExpandedChange?.(true);
      },
      [onExpandedChange],
    );

    const handleFilesChosen = async (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const files = Array.from(e.target.files ?? []).filter((f) =>
        f.type.startsWith("image/"),
      );
      e.target.value = "";

      if (files.length === 0) return;
      const room = Math.max(0, maxAttachments - attachments.length);
      const accepted = files.slice(0, room);

      if (!expanded) {
        setIsSmoothResize(false);
        setInternalExpanded(true);
        onExpandedChange?.(true);
      } else {
        setIsSmoothResize(true);
      }

      for (const file of accepted) {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () =>
          addAttachment(file, url, img.naturalWidth, img.naturalHeight);
        img.onerror = () => addAttachment(file, url, 800, 600);
        img.src = url;
      }
    };

    React.useImperativeHandle(
      ref,
      () => ({
        focus: () => textareaRef.current?.focus(),
        expand: () => {
          setIsSmoothResize(false);
          setInternalExpanded(true);
          onExpandedChange?.(true);
        },
        collapse: () => {
          setIsSmoothResize(false);
          setInternalExpanded(false);
          onExpandedChange?.(false);
        },
        startVoice: () => {
          startRecording();
        },
        stopVoice: () => {
          stopRecording();
        },
        addAttachment: (file: File, url: string, width = 800, height = 600) => {
          addAttachment(file, url, width, height);
        },
        clear: () => {
          handleValueChange("");
          attachments.forEach((a) => URL.revokeObjectURL(a.url));
          setAttachments([]);
          setInternalExpanded(false);
          onExpandedChange?.(false);
        },
        element: internalContainerRef.current,
      }),
      [
        startRecording,
        stopRecording,
        addAttachment,
        handleValueChange,
        attachments,
        onExpandedChange,
      ],
    );

    const removeAttachment = (id: string) => {
      setIsSmoothResize(true);
      setAttachments((prev) => {
        const target = prev.find((a) => a.id === id);
        if (target) URL.revokeObjectURL(target.url);
        return prev.filter((a) => a.id !== id);
      });
      thumbRefs.current.delete(id);
    };

    const showArrow = hasValue && !isRecording;
    const showStop = isRecording;
    const showMic = !hasValue && !isRecording;

    const onActionButtonClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (disabled) return;
      if (isRecording) {
        stopRecording();
      } else if (hasValue) {
        handleSubmit();
      } else if (allowVoice) {
        startRecording();
      }
    };

    const resolvedMinW =
      typeof minWidth === "number" ? `${minWidth}px` : minWidth;
    const resolvedMaxW =
      typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;

    const customGlowShadow =
      variant === "glow"
        ? accentColor
          ? `0 0 35px -5px ${accentColor}33, 0 16px 40px rgba(0, 0, 0, 0.65)`
          : "0 0 35px -5px rgba(255, 255, 255, 0.12), 0 16px 40px rgba(0, 0, 0, 0.65)"
        : undefined;

    return (
      <>
        <div
          ref={(node) => {
            (
              internalContainerRef as React.MutableRefObject<HTMLDivElement | null>
            ).current = node;
          }}
          onBlur={handleBlur}
          className={cn(
            "relative flex flex-col w-full items-center",
            className,
          )}
          style={{
            maxWidth: expanded
              ? `min(100%, ${resolvedMaxW})`
              : `min(100%, ${resolvedMinW})`,
            transition: isSmoothResize
              ? "max-width 0.16s ease-out"
              : "max-width 0.42s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {allowAttachments && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              disabled={disabled}
              onChange={handleFilesChosen}
              className="hidden"
              tabIndex={-1}
              aria-hidden="true"
            />
          )}

          <div
            aria-hidden={!hasAttachments}
            style={{
              height: hasAttachments && expanded ? 68 : 0,
              transition: isSmoothResize
                ? "height 0.16s ease-out"
                : "height 0.42s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="w-full relative z-0 overflow-hidden"
          >
            <div
              style={{
                position: "absolute",
                bottom: -8,
                left: 16,
                right: 16,
                height: 68,
                transform:
                  hasAttachments && expanded
                    ? "translateY(0)"
                    : "translateY(100%)",
                opacity: hasAttachments && expanded ? 1 : 0,
                transition: isSmoothResize
                  ? "transform 0.16s ease-out, opacity 0.16s ease-out"
                  : "transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out",
              }}
              className="border border-zinc-200 dark:border-white/10 border-b-0 bg-zinc-50/95 dark:bg-[#161619]/95 backdrop-blur-xl rounded-t-2xl px-2.5 pt-2 pb-1 flex items-start gap-2 overflow-x-auto prompt-scrollbar"
            >
              {attachments.map((attachment, index) => (
                <AttachmentThumb
                  key={attachment.id}
                  attachment={attachment}
                  index={index}
                  onRemove={removeAttachment}
                  onOpen={(a, rect) =>
                    setActiveAttachment({ attachment: a, rect })
                  }
                  registerRef={(id, el) => thumbRefs.current.set(id, el)}
                />
              ))}
            </div>
          </div>

          <div
            onMouseDown={(e) => {
              const isTextarea = e.target === textareaRef.current;
              if (expanded && !isTextarea && !isRecording && !disabled) {
                e.preventDefault();
                textareaRef.current?.focus();
              }
            }}
            style={{
              borderRadius: 24,
              height: expanded ? containerHeight : collapsedHeight,
              transition: isSmoothResize
                ? SMOOTH_HEIGHT_TRANSITION
                : SPRING_TRANSITION,
              overflow: expanded ? "visible" : "hidden",
              boxShadow: customGlowShadow,
            }}
            className={cn(
              "relative w-full border bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.6)] z-10 transition-colors duration-200",
              variant === "glow"
                ? "border-zinc-300 dark:border-white/20"
                : variant === "minimal"
                  ? "border-zinc-200 dark:border-white/8 dark:bg-[#09090b]/90"
                  : "border-zinc-200 dark:border-white/12",
              "focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-300 dark:focus-within:border-white/30 dark:focus-within:ring-white/20 hover:border-zinc-300 dark:hover:border-white/20",
              expanded ? "cursor-text" : "cursor-default",
              disabled && "opacity-60 pointer-events-none",
            )}
          >

            <textarea
              id={inputId}
              ref={textareaRef}
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              onScroll={updateFades}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
                if (
                  e.key === "Escape" &&
                  value.trim() === "" &&
                  !hasAttachments &&
                  !isModelSelectOpen
                ) {
                  setIsSmoothResize(false);
                  setInternalExpanded(false);
                  onExpandedChange?.(false);
                }
              }}
              placeholder={placeholder}
              aria-label="Prompt message"
              disabled={isRecording || disabled}
              style={{
                transition: isSmoothResize
                  ? "height 0.16s ease-out"
                  : "opacity 0.25s ease-out, transform 0.25s ease-out, height 0.42s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              className={cn(
                "prompt-scrollbar absolute top-0 inset-x-0 z-1 w-full resize-none bg-transparent pl-4 pr-12 py-3.5 text-sm leading-5.5 text-zinc-900 dark:text-zinc-100 outline-none placeholder:font-medium placeholder:text-zinc-400 dark:placeholder:text-zinc-500 cursor-text",
                expanded
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
                isScrolling ? "overflow-y-auto" : "overflow-y-hidden",
                isRecording && "pointer-events-none",
              )}
            />

            <div
              ref={topFadeRef}
              className="absolute left-4 right-12 top-0 z-2 h-7 bg-linear-to-b from-white dark:from-[#0c0c0e] via-white/85 dark:via-[#0c0c0e]/85 to-transparent pointer-events-none opacity-0 transition-opacity duration-150"
            />
            <div
              ref={bottomFadeRef}
              className="absolute left-4 right-12 z-2 h-7 bg-linear-to-t from-white dark:from-[#0c0c0e] via-white/85 dark:via-[#0c0c0e]/85 to-transparent pointer-events-none opacity-0"
              style={{
                top: `${textareaHeight - 28}px`,
                transition: isSmoothResize
                  ? "top 0.16s ease-out, opacity 0.15s ease-out"
                  : "top 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease-out",
              }}
            />

            <button
              type="button"
              onClick={expand}
              style={{
                transition: isSmoothResize
                  ? "none"
                  : "all 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              className={cn(
                "absolute inset-x-0 top-0 z-1 cursor-text pl-4 pr-12 py-3.75 text-left text-sm font-medium leading-4.25 text-zinc-400 dark:text-zinc-500 outline-none select-none",
                !expanded
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-105 translate-y-1 pointer-events-none",
              )}
              aria-label="Open prompt input"
            >
              {placeholder}
            </button>

            <div
              className={cn(
                "absolute bottom-2 left-3 right-12 z-10 flex items-center gap-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                expanded && !isRecording
                  ? "opacity-100 blur-0 translate-y-0 pointer-events-auto"
                  : "opacity-0 blur-sm translate-y-2 pointer-events-none",
              )}
            >
              {allowModelSelect && (
                <div className="relative">
                  <button
                    ref={modelTriggerRef}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      const activeIdx = normalizedModels.findIndex(
                        (m) => m.name === activeModel,
                      );
                      if (activeIdx !== -1) {
                        setHoverStyle({
                          opacity: 1,
                          transform: `translateY(${activeIdx * 34}px) scale(1)`,
                          transition: "none",
                        });
                      }
                      if (isModelSelectOpen) {
                        setIsModelSelectOpen(false);
                      } else if (e.detail === 0) {
                        openModelSelectWithFocus();
                      } else {
                        setIsModelSelectOpen(true);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                        e.preventDefault();
                        openModelSelectWithFocus();
                      }
                    }}
                    aria-haspopup="menu"
                    aria-expanded={isModelSelectOpen}
                    aria-controls={modelMenuId}
                    className={cn(
                      "group relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-zinc-500 dark:text-zinc-400 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-white/40 after:absolute after:-inset-y-2.5 after:inset-x-0 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-zinc-100 cursor-pointer select-none",
                      isModelSelectOpen ? "bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white" : "",
                    )}
                    aria-label={`Select model. Current: ${activeModel}`}
                  >
                    <ModelIcon
                      model={activeModel}
                      customIcon={
                        normalizedModels.find((m) => m.name === activeModel)
                          ?.icon
                      }
                      className="size-3.5 opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="text-xs font-medium select-none transition-colors">
                      <MorphingText text={activeModel} />
                    </span>
                  </button>

                  <div
                    ref={modelMenuRef}
                    id={modelMenuId}
                    role="menu"
                    aria-label="Models"
                    inert={!isModelSelectOpen}
                    onKeyDown={handleModelMenuKeyDown}
                    style={{ transformOrigin: "bottom left" }}
                    onMouseLeave={() => {
                      const activeIdx = normalizedModels.findIndex(
                        (m) => m.name === activeModel,
                      );
                      if (activeIdx !== -1) {
                        setHoverStyle({
                          opacity: 1,
                          transform: `translateY(${activeIdx * 34}px) scale(1)`,
                          transition:
                            "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease",
                        });
                      } else {
                        setHoverStyle((prev) => ({
                          ...prev,
                          opacity: 0,
                          transform: prev.transform.replace(
                            "scale(1)",
                            "scale(0.96)",
                          ),
                          transition:
                            "opacity 0.2s ease-in, transform 0.2s ease-out",
                        }));
                      }
                    }}
                    className={cn(
                      "absolute bottom-full left-0 mb-2.5 z-50 w-48 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-[#121215]/95 p-1 shadow-xl dark:shadow-2xl backdrop-blur-2xl flex flex-col gap-0.5 transition-all duration-300 select-none",
                      isModelSelectOpen
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto ease-[cubic-bezier(0.16,1,0.3,1)]"
                        : "opacity-0 scale-95 translate-y-2 pointer-events-none ease-[cubic-bezier(0.16,1,0.3,1)]",
                    )}
                  >
                    <div className="relative flex flex-col gap-0.5">
                      <div
                        style={hoverStyle}
                        className="absolute left-0 right-0 top-0 h-8 -z-10 rounded-xl bg-zinc-100 dark:bg-white/10 pointer-events-none"
                      />
                      {normalizedModels.map((m, idx) => {
                        const isSelected = m.name === activeModel;
                        return (
                          <button
                            key={m.name}
                            type="button"
                            role="menuitemradio"
                            aria-checked={isSelected}
                            tabIndex={-1}
                            onMouseDown={(e) => e.preventDefault()}
                            onMouseEnter={() => highlightModel(idx)}
                            onFocus={() => highlightModel(idx)}
                            onClick={(e) => {
                              e.stopPropagation();
                              selectModel(m.name);
                            }}
                            className={cn(
                              "group relative flex h-8 w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs font-medium transition-colors outline-none active:scale-[0.98] cursor-pointer",
                              isSelected
                                ? "text-zinc-900 font-semibold dark:text-white"
                                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200",
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <ModelIcon
                                model={m.name}
                                customIcon={m.icon}
                                className={cn(
                                  "size-3.5 transition-opacity",
                                  isSelected
                                    ? "opacity-100"
                                    : "opacity-75 group-hover:opacity-100",
                                )}
                              />
                              <span>{m.name}</span>
                            </span>
                            {isSelected && (
                              <span className="text-zinc-900 dark:text-white">
                                <CheckIcon />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {allowEffortSelect && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={cycleEffort}
                  className="group relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-zinc-500 dark:text-zinc-400 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-zinc-100 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-white/40 after:absolute after:-inset-y-2.5 after:inset-x-0 cursor-pointer select-none"
                  aria-label={`Cycle effort level. Current: ${currentEffort}`}
                >
                  <DynamicBarsIcon level={currentEffort} />
                  <span className="text-xs font-medium select-none transition-colors">
                    <MorphingText text={currentEffort} />
                  </span>
                </button>
              )}

              {allowAttachments && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={openFileChooser}
                  disabled={attachments.length >= maxAttachments || disabled}
                  className="relative ml-auto flex size-7 items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-zinc-100 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-white/40 after:absolute after:-inset-y-2 after:-left-2 after:right-0 cursor-pointer disabled:opacity-40 disabled:pointer-events-none select-none"
                  aria-label="Attach images"
                >
                  <PlusIcon />
                </button>
              )}
            </div>

            <div
              className={cn(
                "absolute right-12 bottom-2 z-10 flex h-8 items-center justify-end gap-0.75 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                isRecording
                  ? "w-16 opacity-100 translate-x-0"
                  : "w-0 opacity-0 translate-x-4 pointer-events-none",
              )}
            >
              {audioData.map((val, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1 rounded-full transition-[height] duration-75 ease-out",
                    !accentColor && "bg-zinc-900 dark:bg-white",
                  )}
                  style={{
                    height: `${Math.max(4, val * 24)}px`,
                    ...(accentColor ? { backgroundColor: accentColor } : {}),
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={onActionButtonClick}
              disabled={disabled}
              aria-label={
                showArrow
                  ? "Send prompt"
                  : showStop
                    ? "Stop recording"
                    : "Use voice input"
              }
              style={{
                backgroundColor: accentColor || undefined,
                color: accentColor ? "#000000" : undefined,
              }}
              className="absolute right-2 bottom-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black transition-all duration-300 hover:opacity-90 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-white/40 after:absolute after:-inset-1.5 cursor-pointer shadow-sm"
            >
              <span className="relative flex h-full w-full items-center justify-center">
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    showArrow
                      ? "opacity-100 scale-100 rotate-0 blur-none"
                      : "opacity-0 scale-50 rotate-45 blur-[1px] pointer-events-none",
                  )}
                >
                  <ArrowUpIcon />
                </span>
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    showMic
                      ? "opacity-100 scale-100 rotate-0 blur-none"
                      : "opacity-0 scale-50 -rotate-45 blur-[1px] pointer-events-none",
                  )}
                >
                  <MicIcon />
                </span>
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    showStop
                      ? "opacity-100 scale-100 rotate-0 blur-none"
                      : "opacity-0 scale-50 rotate-45 blur-[1px] pointer-events-none",
                  )}
                >
                  <StopIcon />
                </span>
              </span>
            </button>
          </div>
        </div>

        {mounted && activeAttachment && (
          <AttachmentGalleryModal
            attachment={activeAttachment.attachment}
            originRect={activeAttachment.rect}
            onClose={() => setActiveAttachment(null)}
          />
        )}
      </>
    );
  },
);

PromptInput.displayName = "PromptInput";

export const AiInput = PromptInput;
export default PromptInput;
