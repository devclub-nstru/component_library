"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight as IconArrowRight,
  Bold as IconBold,
  Code as IconCode,
  Italic as IconItalic,
  Strikethrough as IconStrikethrough,
  Underline as IconUnderline,
  X as IconClose,
  Check as IconCheck,
  Copy as IconCopy,
  CornerDownLeft as IconInsert,
  RotateCcw as IconReset,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Orb, EditorOrb, type OrbVariant } from "@/components/ui/orb";
import { StreamingText } from "@/components/ui/streaming-text";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { cn } from "@/lib/utils";

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 440,
  damping: 28,
  mass: 0.7,
} as const;

const EXIT_TRANSITION = {
  duration: 0.2,
  ease: [0.16, 1, 0.3, 1],
} as const;

const BUTTON_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 22,
} as const;

const SETTLE = 100;
const ANSWER_WORD_MS = 24;

const FORMATS = [
  { name: "Bold", icon: IconBold, command: "bold" },
  { name: "Italic", icon: IconItalic, command: "italic" },
  { name: "Underline", icon: IconUnderline, command: "underline" },
  { name: "Strikethrough", icon: IconStrikethrough, command: "strikeThrough" },
  { name: "Code", icon: IconCode, command: "code" },
] as const;

const SOURCES = ["wikipedia.org", "reddit.com", "chatgpt.com"];

const STAGES = {
  understanding: { label: "Understanding the context…", orb: "S3" },
  gathering: { label: "Gathering sources…", orb: "S2" },
} as const satisfies Record<string, { label: string; orb: OrbVariant }>;

export interface EditorProps {
  title?: string;
  children: string;
  answer: string;
  className?: string;
  onAsk?: (question: string) => void;
}

export function Editor({
  title,
  children,
  answer,
  className,
  onAsk,
}: EditorProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const prose = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const asking = useRef(false);
  const isFormatting = useRef(false);
  const savedRange = useRef<Range | null>(null);
  const lastPointerPosition = useRef<{ x: number; y: number } | null>(null);

  const [at, setAt] = useState<{
    x: number;
    y: number;
    arrowOffset: number;
    placeBottom: boolean;
  } | null>(null);
  const [askMode, setAskMode] = useState(false);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const updateActiveFormats = useCallback(() => {
    const active: string[] = [];
    if (typeof document !== "undefined") {
      if (document.queryCommandState("bold")) active.push("Bold");
      if (document.queryCommandState("italic")) active.push("Italic");
      if (document.queryCommandState("underline")) active.push("Underline");
      if (document.queryCommandState("strikeThrough")) active.push("Strikethrough");
    }
    setActiveFormats(active);
  }, []);

  const enterAskMode = useCallback(() => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      savedRange.current = range.cloneRange();
      if (typeof CSS !== "undefined" && "highlights" in CSS && typeof Highlight !== "undefined") {
        try {
          CSS.highlights.set("editor-ask", new Highlight(range.cloneRange()));
        } catch {}
      }
    }
    asking.current = true;
    setAskMode(true);
  }, []);

  const exitAskMode = useCallback(() => {
    if (typeof CSS !== "undefined" && "highlights" in CSS) {
      try {
        CSS.highlights.delete("editor-ask");
      } catch {}
    }
    asking.current = false;
    setAskMode(false);
  }, []);

  const handleFormat = (name: string, command: string) => {
    if (!prose.current) return;
    isFormatting.current = true;

    const selection = window.getSelection();
    if (savedRange.current && (!selection || selection.isCollapsed)) {
      selection?.removeAllRanges();
      selection?.addRange(savedRange.current);
    }

    if (command === "code") {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const selectedText = range.toString();
        const codeNode = document.createElement("code");
        codeNode.className =
          "rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground border border-border/60";
        codeNode.textContent = selectedText;
        range.deleteContents();
        range.insertNode(codeNode);
        savedRange.current = range.cloneRange();
      }
    } else {
      document.execCommand(command, false);
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) {
        savedRange.current = sel.getRangeAt(0).cloneRange();
      }
    }

    updateActiveFormats();

    setTimeout(() => {
      isFormatting.current = false;
    }, 150);
  };

  const handleReplaceSelection = (replacement: string) => {
    if (savedRange.current) {
      savedRange.current.deleteContents();
      savedRange.current.insertNode(document.createTextNode(replacement));
      exitAskMode();
      setAt(null);
    }
  };

  const handleInsertBelow = (textToInsert: string) => {
    if (prose.current) {
      const p = document.createElement("p");
      p.className =
        "mt-3 text-sm leading-relaxed text-foreground bg-accent/30 p-3 rounded-xl border border-border/50";
      p.textContent = textToInsert;
      prose.current.appendChild(p);
      exitAskMode();
      setAt(null);
    }
  };

  useEffect(() => {
    let timer = 0;

    const show = () => {
      const selection = window.getSelection();
      const proseEl = prose.current;
      const wrapEl = wrap.current;
      if (
        !selection ||
        selection.isCollapsed ||
        !proseEl ||
        !wrapEl ||
        !proseEl.contains(selection.anchorNode) ||
        !proseEl.contains(selection.focusNode)
      ) {
        if (!isFormatting.current && !asking.current) {
          setAt(null);
        }
        return;
      }

      const range = selection.getRangeAt(0);
      savedRange.current = range.cloneRange();
      const origin = wrapEl.getBoundingClientRect();
      const rects = range.getClientRects();

      let targetX: number;
      let targetY: number;

      if (lastPointerPosition.current) {
        targetX = lastPointerPosition.current.x - origin.left;
        targetY = lastPointerPosition.current.y - origin.top;
      } else if (rects.length > 0) {
        const lastRect = rects[rects.length - 1];
        targetX = lastRect.right - origin.left;
        targetY = lastRect.top - origin.top;
      } else {
        const box = range.getBoundingClientRect();
        targetX = box.left + box.width / 2 - origin.left;
        targetY = box.top - origin.top;
      }

      const clampedX = Math.max(200, Math.min(origin.width - 200, targetX));
      const arrowOffset = Math.max(-140, Math.min(140, targetX - clampedX));
      const placeBottom = targetY < 58;
      const finalY = placeBottom ? targetY + 22 : targetY - 10;

      setAt({ x: clampedX, y: finalY, arrowOffset, placeBottom });
      updateActiveFormats();
    };

    const onSelectionChange = () => {
      if (asking.current || isFormatting.current) return;
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        window.clearTimeout(timer);
        setAt(null);
        return;
      }
      window.clearTimeout(timer);
      if (!dragging.current) timer = window.setTimeout(show, SETTLE);
    };

    const onPointerDown = (event: PointerEvent) => {
      if ((event.target as Element).closest("[data-editor-toolbar]")) return;
      exitAskMode();
      dragging.current = true;
      window.clearTimeout(timer);
    };

    const onPointerUp = (event: PointerEvent) => {
      if ((event.target as Element).closest("[data-editor-toolbar]")) return;
      lastPointerPosition.current = { x: event.clientX, y: event.clientY };
      dragging.current = false;
      show();
    };

    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);
      if (typeof CSS !== "undefined" && "highlights" in CSS) {
        try {
          CSS.highlights.delete("editor-ask");
        } catch {}
      }
    };
  }, [exitAskMode, updateActiveFormats]);

  return (
    <div ref={wrap} className={cn("relative selection:bg-primary/20", className)}>
      <style>{`
        ::highlight(editor-ask) {
          background-color: rgba(99, 102, 241, 0.28);
          color: inherit;
          border-radius: 4px;
        }
      `}</style>

      <div
        ref={prose}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        role="textbox"
        aria-multiline="true"
        aria-label={title ?? "Document"}
        className="min-h-[150px] rounded-2xl border border-border/60 bg-card p-6 outline-none transition-colors focus-visible:border-primary/50 shadow-xs"
      >
        {title ? (
          <h3 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h3>
        ) : null}

        <p className={cn("text-sm leading-relaxed text-muted-foreground", title && "mt-4")}>
          {children}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {at && (
          <motion.div
            key="toolbar"
            className="absolute z-50 pointer-events-auto"
            style={{
              left: at.x,
              top: at.y,
              transform: at.placeBottom
                ? "translate(-50%, 0)"
                : "translate(-50%, -100%)",
            }}
            initial={{
              opacity: 0,
              scale: 0.96,
              y: at.placeBottom ? -6 : 6,
              filter: "blur(4px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              filter: "blur(6px)",
              transition: EXIT_TRANSITION,
            }}
            transition={SPRING_TRANSITION}
          >
            <SelectionToolbar
              askMode={askMode}
              answer={answer}
              arrowOffset={at.arrowOffset}
              placeBottom={at.placeBottom}
              onAsk={enterAskMode}
              onClose={() => {
                exitAskMode();
                setAt(null);
              }}
              activeFormats={activeFormats}
              onFormat={handleFormat}
              onSubmitQuestion={onAsk}
              onReplace={handleReplaceSelection}
              onInsertBelow={handleInsertBelow}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SelectionToolbarProps {
  askMode: boolean;
  answer: string;
  arrowOffset?: number;
  placeBottom?: boolean;
  onAsk: () => void;
  onClose: () => void;
  activeFormats: string[];
  onFormat: (name: string, command: string) => void;
  onSubmitQuestion?: (question: string) => void;
  onReplace?: (text: string) => void;
  onInsertBelow?: (text: string) => void;
}

function SelectionToolbar({
  askMode,
  answer,
  arrowOffset = 0,
  placeBottom = false,
  onAsk,
  onClose,
  activeFormats,
  onFormat,
  onSubmitQuestion,
  onReplace,
  onInsertBelow,
}: SelectionToolbarProps) {
  const input = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const [query, setQuery] = useState<string | null>(null);
  const [stage, setStage] = useState<keyof typeof STAGES>("understanding");
  const [answering, setAnswering] = useState(false);
  const [shown, setShown] = useState(1);
  const [copied, setCopied] = useState(false);

  const words = React.useMemo(() => answer.split(" "), [answer]);

  useEffect(() => {
    if (!query) return;

    const stageTimer = window.setTimeout(() => setStage("gathering"), 1800);
    const answerTimer = window.setTimeout(() => setAnswering(true), 3600);

    return () => {
      window.clearTimeout(stageTimer);
      window.clearTimeout(answerTimer);
    };
  }, [query]);

  useEffect(() => {
    if (!answering || shown >= words.length) return;
    const timer = window.setTimeout(() => setShown((count) => count + 1), ANSWER_WORD_MS);
    return () => window.clearTimeout(timer);
  }, [answering, shown, words.length]);

  const submit = () => {
    const value = input.current?.value.trim();
    if (!value || query) return;
    setQuery(value);
    onSubmitQuestion?.(value);
    input.current?.blur();
  };

  const handleCopy = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleReset = () => {
    setQuery(null);
    setStage("understanding");
    setAnswering(false);
    setShown(1);
    if (input.current) {
      input.current.value = "";
      setTimeout(() => input.current?.focus(), 50);
    }
  };

  const isStreamComplete = answering && shown >= words.length;

  return (
    <motion.div
      layout
      transition={reduceMotion ? { duration: 0 } : SPRING_TRANSITION}
      role="toolbar"
      aria-label="Selection"
      data-editor-toolbar
      data-ask={askMode ? "" : undefined}
      data-sent={query ? "" : undefined}
      onMouseDown={(event) => {
        if ((event.target as HTMLElement).tagName !== "INPUT") {
          event.preventDefault();
        }
      }}
      className={cn(
        "group relative flex w-[370px] sm:w-[410px] flex-col overflow-hidden rounded-2xl",
        "border border-border/80 bg-card/95 dark:bg-[#121215]/95 backdrop-blur-2xl",
        "text-muted-foreground shadow-[0_16px_44px_-8px_rgba(0,0,0,0.22),0_4px_16px_-4px_rgba(0,0,0,0.12)]",
        "dark:shadow-[0_24px_56px_-10px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)]",
        "transition-colors"
      )}
    >
      <div
        aria-hidden="true"
        style={{ left: `calc(50% + ${arrowOffset}px)` }}
        className={cn(
          "pointer-events-none absolute -translate-x-1/2",
          placeBottom ? "-top-1" : "-bottom-1"
        )}
      >
        <div
          className={cn(
            "size-2.5 rotate-45 bg-card dark:bg-[#121215]",
            placeBottom
              ? "border-l border-t border-border/80"
              : "border-r border-b border-border/80"
          )}
        />
      </div>

      <div className="relative flex h-10 items-center justify-between px-2.5">
        <AnimatePresence mode="wait" initial={false}>
          {!askMode ? (
            <motion.div
              key="default-bar"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8, filter: "blur(3px)" }}
              transition={SPRING_TRANSITION}
              className="flex w-full items-center justify-between"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={BUTTON_SPRING}
                type="button"
                onClick={() => {
                  onAsk();
                  setTimeout(() => input.current?.focus({ preventScroll: true }), 40);
                }}
                className={cn(
                  "flex h-8 items-center gap-2 rounded-xl pl-2 pr-3.5 text-xs font-semibold text-foreground",
                  "bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-transparent",
                  "border border-border/60 hover:border-violet-500/40 hover:from-violet-500/15 hover:to-cyan-500/15",
                  "transition-all cursor-pointer shadow-2xs"
                )}
              >
                <EditorOrb stirring={false} />
                <span>Ask AI</span>
              </motion.button>

              <div className="mx-2 h-4.5 w-px shrink-0 bg-border/80" />

              <div className="flex items-center gap-1">
                {FORMATS.map(({ name, icon: Icon, command }) => {
                  const isActive = activeFormats.includes(name);
                  return (
                    <motion.button
                      key={name}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      transition={BUTTON_SPRING}
                      type="button"
                      aria-label={name}
                      onClick={() => onFormat(name, command)}
                      className={cn(
                        "relative flex size-7.5 items-center justify-center rounded-lg transition-colors cursor-pointer",
                        isActive
                          ? "bg-foreground text-background dark:bg-white dark:text-black font-semibold shadow-xs"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground active:bg-muted"
                      )}
                    >
                      <Icon className="size-3.5" strokeWidth={isActive ? 2.6 : 2} />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : !query ? (
            <motion.div
              key="input-bar"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10, filter: "blur(3px)" }}
              transition={SPRING_TRANSITION}
              className="flex w-full items-center gap-2"
            >
              <EditorOrb stirring={true} className="ml-1" />

              <input
                ref={input}
                type="text"
                autoFocus
                aria-label="Ask about the selection"
                placeholder="Ask anything about the selected text…"
                onKeyDown={(event) => {
                  if (event.key === "Enter") submit();
                  if (event.key === "Escape") onClose();
                }}
                className="h-8 min-w-0 flex-1 bg-transparent px-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground/70"
              />

              <div className="flex items-center gap-1.5">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  transition={BUTTON_SPRING}
                  type="button"
                  aria-label="Send"
                  onClick={submit}
                  className="flex size-7.5 items-center justify-center rounded-lg bg-foreground text-background hover:opacity-90 cursor-pointer shadow-xs"
                >
                  <IconArrowRight className="size-3.5" strokeWidth={2.4} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  transition={BUTTON_SPRING}
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  className="flex size-7.5 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                >
                  <IconClose className="size-3.5" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="sent-bar"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={SPRING_TRANSITION}
              className="flex w-full items-center justify-between gap-2 overflow-hidden px-1"
            >
              <div className="flex min-w-0 items-center gap-2">
                <EditorOrb stirring={!isStreamComplete} />
                <span className="truncate text-xs font-semibold text-foreground">
                  {query}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {isStreamComplete && (
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    transition={BUTTON_SPRING}
                    type="button"
                    aria-label="Ask another question"
                    onClick={handleReset}
                    className="flex size-7.5 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                  >
                    <IconReset className="size-3.5" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  transition={BUTTON_SPRING}
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  className="flex size-7.5 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                >
                  <IconClose className="size-3.5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {query && (
          <motion.div
            key="stage-container"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : SPRING_TRANSITION}
            className="overflow-hidden border-t border-border/70 bg-muted/30"
          >
            <AnimatePresence mode="wait" initial={false}>
              {!answering ? (
                <motion.div
                  key="stage-status"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={SPRING_TRANSITION}
                  className="flex items-center gap-2.5 px-3.5 py-3"
                >
                  <Orb
                    variant={STAGES[stage].orb}
                    label={STAGES[stage].label}
                    size={20}
                    className="shrink-0"
                  />

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={stage}
                      initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="min-w-0 flex-1 text-xs font-medium"
                    >
                      <TextShimmer duration={1.5}>
                        {STAGES[stage].label}
                      </TextShimmer>
                    </motion.div>
                  </AnimatePresence>

                  <div className="ml-auto flex items-center pl-2">
                    {stage === "gathering" &&
                      SOURCES.map((domain, index) => (
                        <motion.img
                          key={domain}
                          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                          alt={domain}
                          initial={{ opacity: 0, x: 10, scale: 0.4 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ delay: index * 0.08, ...BUTTON_SPRING }}
                          className="-ml-1.5 size-5 rounded-full bg-background ring-2 ring-card first:ml-0 shadow-xs"
                        />
                      ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="answer-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-3 px-4 py-3.5"
                >
                  <div className="max-h-48 overflow-y-auto pr-1 text-xs leading-relaxed text-foreground select-text">
                    <StreamingText cursor={!isStreamComplete}>
                      {words.slice(0, shown).join(" ")}
                    </StreamingText>
                  </div>

                  {isStreamComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={SPRING_TRANSITION}
                      className="flex items-center justify-between border-t border-border/60 pt-2.5 text-[11px]"
                    >
                      <div className="flex items-center gap-1.5">
                        {onReplace && (
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.95 }}
                            transition={BUTTON_SPRING}
                            type="button"
                            onClick={() => onReplace(answer)}
                            className="flex items-center gap-1 rounded-md bg-foreground text-background px-2.5 py-1 font-medium transition-colors hover:opacity-90 cursor-pointer shadow-xs"
                          >
                            <IconInsert className="size-3" />
                            <span>Replace</span>
                          </motion.button>
                        )}
                        {onInsertBelow && (
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.95 }}
                            transition={BUTTON_SPRING}
                            type="button"
                            onClick={() => onInsertBelow(answer)}
                            className="flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 font-medium text-foreground hover:bg-muted cursor-pointer transition-colors shadow-2xs"
                          >
                            <span>Insert below</span>
                          </motion.button>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={BUTTON_SPRING}
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
                      >
                        {copied ? (
                          <>
                            <IconCheck className="size-3 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">Copied</span>
                          </>
                        ) : (
                          <>
                            <IconCopy className="size-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Editor;
