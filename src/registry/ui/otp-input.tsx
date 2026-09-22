"use client";

import React, {
  useRef,
  useState,
  useId,
  useEffect,
  type ComponentProps,
  type KeyboardEvent,
  type ClipboardEvent,
  type PointerEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const PATTERNS = {
  numbers: /^[0-9]$/,
  letters: /^[a-zA-Z]$/,
  both: /^[a-zA-Z0-9]$/,
} as const;

export type OtpStatus = "idle" | "success" | "error" | "loading";
export type OtpSize = "sm" | "md" | "lg" | "xl";
export type OtpVariant = "default" | "glass" | "neon" | "underlined";

export interface OtpInputProps extends Omit<
  ComponentProps<"div">,
  "onChange" | "value" | "defaultValue"
> {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  type?: keyof typeof PATTERNS;
  size?: OtpSize;
  variant?: OtpVariant;
  status?: OtpStatus;
  mask?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  separator?: React.ReactNode;
  groupSize?: number;
  slotClassName?: string;
}

const SIZES = {
  sm: {
    box: "size-10 rounded-lg",
    text: "text-base",
    caret: "h-5",
    caretHeight: 20,
    gap: "gap-2",
    px: 40,
    radius: 8,
  },
  md: {
    box: "size-12 rounded-xl",
    text: "text-lg",
    caret: "h-6",
    caretHeight: 24,
    gap: "gap-2.5",
    px: 48,
    radius: 12,
  },
  lg: {
    box: "size-14 rounded-2xl",
    text: "text-xl",
    caret: "h-7",
    caretHeight: 28,
    gap: "gap-3",
    px: 56,
    radius: 16,
  },
  xl: {
    box: "size-16 rounded-2xl",
    text: "text-2xl font-semibold",
    caret: "h-8",
    caretHeight: 32,
    gap: "gap-3.5",
    px: 64,
    radius: 16,
  },
} as const;

const SIZE_SPRING = {
  type: "spring",
  stiffness: 380,
  damping: 28,
  mass: 0.7,
} as const;

const ROLL_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 30,
  mass: 0.75,
} as const;

const CARET_SPRING = {
  type: "spring",
  stiffness: 600,
  damping: 36,
  mass: 0.6,
} as const;

const SHAKE_KEYFRAMES = [0, -12, 10, -8, 6, -3, 0];

const toSlots = (code: string, length: number) =>
  Array.from({ length }, (_, i) => code[i] ?? "");

export function OtpInput({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  type = "numbers",
  size = "md",
  variant = "default",
  status = "idle",
  mask = false,
  disabled = false,
  autoFocus = false,
  separator,
  groupSize,
  className,
  slotClassName,
  ...props
}: OtpInputProps) {
  const instanceId = useId();
  const [uncontrolled, setUncontrolled] = useState(() =>
    toSlots(defaultValue, length),
  );
  const [clearedSlot, setClearedSlot] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [caretX, setCaretX] = useState<number>(0);
  const [isCaretMoving, setIsCaretMoving] = useState(false);
  const [lastPunchedIndex, setLastPunchedIndex] = useState<number | null>(null);
  const [prevStatus, setPrevStatus] = useState(status);
  const [isCelebrating, setIsCelebrating] = useState(false);

  if (prevStatus !== status) {
    setPrevStatus(status);
    if (status === "success") {
      setIsCelebrating(true);
    } else {
      setIsCelebrating(false);
    }
  }

  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const cells = useRef<(HTMLDivElement | null)[]>([]);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const editingAt = useRef<number | null>(null);
  const caretTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isCelebrating) {
      const timer = setTimeout(
        () => {
          setIsCelebrating(false);
        },
        500 + length * 50,
      );
      return () => clearTimeout(timer);
    }
  }, [isCelebrating, length]);

  const slots =
    value === undefined
      ? Array.from({ length }, (_, i) => uncontrolled[i] ?? "")
      : toSlots(value, length);

  const numeric = type === "numbers";
  const scale = SIZES[size];
  const caretVisible =
    focusedIndex !== null && !slots[focusedIndex] && status !== "error";

  const updateCaretPosition = (index: number) => {
    const cell = cells.current[index];
    const row = rowRef.current;
    if (cell && row) {
      const cellRect = cell.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      const targetX =
        cell.offsetParent === row
          ? cell.offsetLeft + cell.offsetWidth / 2
          : cellRect.left - rowRect.left + cellRect.width / 2;

      setIsCaretMoving(true);
      setCaretX(targetX);

      if (caretTimerRef.current) clearTimeout(caretTimerRef.current);
      caretTimerRef.current = setTimeout(() => {
        setIsCaretMoving(false);
      }, 240);
    }
  };

  useEffect(() => {
    if (focusedIndex !== null) {
      updateCaretPosition(focusedIndex);
      const frame = requestAnimationFrame(() => {
        updateCaretPosition(focusedIndex);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [focusedIndex, size, length]);

  const commit = (next: string[]) => {
    if (value === undefined) setUncontrolled(next);
    const code = next.join("");
    onChange?.(code);
    if (next.every(Boolean)) onComplete?.(code);
  };

  const focusAt = (index: number) => {
    const target = Math.min(Math.max(index, 0), length - 1);
    const input = inputs.current[target];
    input?.focus();
    input?.select();
    setFocusedIndex(target);
    updateCaretPosition(target);
  };

  const setCharAt = (index: number, char: string) => {
    if (!char) {
      setClearedSlot(index);
    } else {
      setClearedSlot(null);
      setLastPunchedIndex(index);
      setTimeout(() => setLastPunchedIndex(null), 180);
    }

    const next = slots.map((slot, i) => (i === index ? char : slot));
    commit(next);
  };

  const fill = (startIndex: number, chars: string[]) => {
    const availableSpace = Math.min(chars.length, length - startIndex);
    const next = [...slots];
    chars.slice(0, availableSpace).forEach((char, i) => {
      next[startIndex + i] = char;
    });
    setClearedSlot(null);
    commit(next);
    editingAt.current = null;
    focusAt(startIndex + availableSpace);
  };

  const handleChange = (index: number, raw: string) => {
    const filtered = raw.split("").filter((char) => PATTERNS[type].test(char));
    if (!filtered.length) {
      if (raw === "") {
        setCharAt(index, "");
      }
      return;
    }

    const typedChar =
      filtered.length === 1
        ? filtered[0]
        : filtered.length === 2 && filtered[0] === slots[index]
          ? filtered[1]
          : null;

    if (typedChar === null) {
      fill(index, filtered);
      return;
    }

    if (slots.every(Boolean) && editingAt.current !== index) return;

    setCharAt(index, typedChar);
    editingAt.current = null;
    focusAt(index + 1);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      editingAt.current = Math.max(index - 1, 0);
      focusAt(index - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      editingAt.current = Math.min(index + 1, length - 1);
      focusAt(index + 1);
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      if (slots[index]) {
        setCharAt(index, "");
      } else if (index > 0) {
        setCharAt(index - 1, "");
        focusAt(index - 1);
      }
      return;
    }

    if (event.key === "Delete") {
      event.preventDefault();
      setCharAt(index, "");
      return;
    }
  };

  const handlePaste = (
    index: number,
    event: ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .split("")
      .filter((char) => PATTERNS[type].test(char));
    if (pasted.length) fill(index, pasted);
  };

  const handlePointerDown = (
    index: number,
    event: PointerEvent<HTMLInputElement>,
  ) => {
    const firstEmpty = slots.findIndex((slot) => !slot);
    const target = firstEmpty === -1 ? index : Math.min(index, firstEmpty);
    editingAt.current = target;
    if (target === index) return;
    event.preventDefault();
    focusAt(target);
  };

  const getVariantStyles = (filled: boolean, isFocused: boolean) => {
    switch (variant) {
      case "glass":
        return cn(
          "bg-white/4 dark:bg-white/3 backdrop-blur-md border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]",
          filled && "border-white/25 bg-white/8",
          isFocused &&
            "border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.15)]",
        );
      case "neon":
        return cn(
          "bg-zinc-950 border border-zinc-800 shadow-[0_0_12px_rgba(0,0,0,0.5)]",
          filled && "border-zinc-600 shadow-[0_0_16px_rgba(255,255,255,0.06)]",
          isFocused &&
            "border-zinc-300 shadow-[0_0_24px_rgba(255,255,255,0.2)]",
        );
      case "underlined":
        return cn(
          "bg-transparent border-b-2 rounded-none! border-zinc-700 shadow-none",
          filled && "border-zinc-400",
          isFocused && "border-white",
        );
      default:
        return cn(
          "bg-[#F4F4F9] dark:bg-[#161619] border border-black/5 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.08)]",
          filled && "dark:border-white/20 border-black/15 dark:bg-[#1a1a1e]",
          isFocused && "dark:border-white/35 border-black/25",
        );
    }
  };

  return (
    <div
      data-slot="otp-input"
      data-status={status}
      data-variant={variant}
      className={cn(
        "relative inline-flex flex-col items-center select-none",
        className,
      )}
      {...props}
    >
      <motion.div
        ref={rowRef}
        data-slot="otp-input-row"
        layout
        transition={{
          layout: reduceMotion ? { duration: 0 } : SIZE_SPRING,
          duration: 0.42,
          ease: [0.36, 0.66, 0.04, 1],
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setFocusedIndex(null);
          }
        }}
        animate={{
          x: status === "error" && !reduceMotion ? SHAKE_KEYFRAMES : 0,
        }}
        className={cn("relative flex items-center", scale.gap)}
      >
        {slots.map((slot, index) => {
          const isFocused = focusedIndex === index;
          const isFilled = Boolean(slot);
          const isLastPunched = lastPunchedIndex === index;
          const showSeparator =
            separator && groupSize && index > 0 && index % groupSize === 0;

          return (
            <React.Fragment key={index}>
              {showSeparator && (
                <motion.div
                  layout
                  transition={{
                    layout: reduceMotion ? { duration: 0 } : SIZE_SPRING,
                  }}
                  aria-hidden="true"
                  className="shrink-0 flex items-center justify-center text-zinc-400 dark:text-zinc-600 px-0.5"
                >
                  {separator}
                </motion.div>
              )}

              <motion.div
                ref={(el) => {
                  cells.current[index] = el;
                }}
                data-slot="otp-input-cell"
                data-filled={isFilled}
                data-focused={isFocused}
                layout
                transition={{
                  layout: reduceMotion ? { duration: 0 } : SIZE_SPRING,
                }}
                whileHover={
                  disabled ||
                  reduceMotion ||
                  status === "success" ||
                  status === "error" ||
                  isCelebrating
                    ? undefined
                    : { y: -1.5, scale: 1.02 }
                }
                animate={
                  isCelebrating && !reduceMotion
                    ? {
                        y: [0, -10, 0],
                        scale: [1, 1.07, 1],
                        transition: {
                          duration: 0.5,
                          delay: index * 0.05,
                          ease: [0.34, 1.56, 0.64, 1],
                        },
                      }
                    : status === "loading" && !reduceMotion
                      ? {
                          opacity: [0.5, 1, 0.5],
                          y: [0, -3, 0],
                          transition: {
                            repeat: Infinity,
                            duration: 1.2,
                            delay: index * 0.12,
                            ease: "easeInOut",
                          },
                        }
                      : isLastPunched && !reduceMotion
                        ? {
                            scale: [1, 1.12, 1],
                            y: [0, -2, 0],
                            transition: { duration: 0.22, ease: "easeOut" },
                          }
                        : isFocused && !reduceMotion && status !== "success"
                          ? {
                              scale: 1.04,
                              y: -1.5,
                              transition: {
                                type: "spring",
                                stiffness: 450,
                                damping: 28,
                              },
                            }
                          : {
                              scale: 1,
                              y: 0,
                              transition: {
                                type: "spring",
                                stiffness: 450,
                                damping: 28,
                              },
                            }
                }
                className={cn(
                  "relative flex items-center justify-center transition-colors duration-200",
                  scale.box,
                  getVariantStyles(isFilled, isFocused),
                  slotClassName,
                )}
              >
                <AnimatePresence>
                  {isFocused && !reduceMotion && status !== "success" && (
                    <motion.div
                      layoutId={"otp-active-glow-" + instanceId}
                      layout
                      transition={{
                        layout: reduceMotion ? { duration: 0 } : SIZE_SPRING,
                        type: "spring",
                        stiffness: 450,
                        damping: 34,
                        mass: 0.6,
                      }}
                      className={cn(
                        "pointer-events-none absolute -inset-0.5 rounded-[inherit] border-2 border-white/60 dark:border-white/50 shadow-[0_0_18px_rgba(255,255,255,0.2)] z-20",
                        variant === "underlined" &&
                          "border-0 border-b-2 rounded-none! shadow-[0_4px_12px_rgba(255,255,255,0.3)] inset-x-0 -bottom-0.5 top-auto h-0.5",
                        status === "error" &&
                          "border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.4)]",
                      )}
                    />
                  )}
                </AnimatePresence>

                <input
                  ref={(el) => {
                    inputs.current[index] = el;
                  }}
                  data-slot="otp-input-slot"
                  data-filled={isFilled}
                  value={slot}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={(event) => handlePaste(index, event)}
                  onPointerDown={(event) => handlePointerDown(index, event)}
                  onFocus={() => {
                    setFocusedIndex(index);
                    updateCaretPosition(index);
                  }}
                  type={mask ? "password" : "text"}
                  inputMode={numeric ? "numeric" : "text"}
                  autoCapitalize={numeric ? undefined : "characters"}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  autoFocus={autoFocus && index === 0}
                  disabled={disabled}
                  aria-label={
                    (numeric ? "Digit " : "Character ") +
                    (index + 1) +
                    " of " +
                    length
                  }
                  className="absolute inset-0 size-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-30"
                />

                <AnimatePresence>
                  {status === "success" && (
                    <motion.svg
                      aria-hidden="true"
                      data-slot="otp-input-ring"
                      viewBox={"0 0 " + scale.px + " " + scale.px}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pointer-events-none absolute inset-0 size-full z-20 overflow-visible"
                    >
                      {variant === "underlined" ? (
                        <motion.line
                          x1={0}
                          y1={scale.px - 1}
                          x2={scale.px}
                          y2={scale.px - 1}
                          stroke="#10b981"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          initial={
                            reduceMotion ? false : { pathLength: 0, opacity: 0 }
                          }
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : {
                                  duration: 0.45,
                                  ease: [0.16, 1, 0.3, 1],
                                  delay: 0.08 + index * 0.05,
                                }
                          }
                          style={{
                            filter: "drop-shadow(0 0 6px rgba(16,185,129,0.7))",
                          }}
                        />
                      ) : (
                        <motion.rect
                          x={1.5}
                          y={1.5}
                          width={scale.px - 3}
                          height={scale.px - 3}
                          rx={scale.radius - 1}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          initial={
                            reduceMotion ? false : { pathLength: 0, opacity: 0 }
                          }
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : {
                                  duration: 0.5,
                                  ease: [0.16, 1, 0.3, 1],
                                  delay: 0.1 + index * 0.05,
                                }
                          }
                          style={{
                            filter: "drop-shadow(0 0 6px rgba(16,185,129,0.7))",
                          }}
                        />
                      )}
                    </motion.svg>
                  )}
                </AnimatePresence>

                <div className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden z-10">
                  <AnimatePresence
                    mode="popLayout"
                    initial={false}
                    custom={clearedSlot === index}
                  >
                    {slot && (
                      <motion.span
                        key={slot + "-" + index}
                        layout="position"
                        initial={
                          reduceMotion
                            ? { opacity: 0 }
                            : {
                                y: 26,
                                opacity: 0,
                                scale: 0.65,
                                filter: "blur(4px)",
                              }
                        }
                        animate={{
                          y: 0,
                          opacity: 1,
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : {
                                y: clearedSlot === index ? 22 : -22,
                                opacity: 0,
                                scale: 0.7,
                                filter: "blur(3px)",
                              }
                        }
                        transition={{
                          layout: reduceMotion ? { duration: 0 } : SIZE_SPRING,
                          ...(reduceMotion ? { duration: 0.15 } : ROLL_SPRING),
                        }}
                        data-slot="otp-input-char"
                        className={cn(
                          "font-mono font-semibold tracking-wider text-black dark:text-white select-none inline-flex items-center justify-center",
                          scale.text,
                        )}
                      >
                        {mask ? (
                          <motion.span
                            initial={{ scale: 0.4 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 600,
                              damping: 28,
                            }}
                            className="inline-block size-2.5 rounded-full bg-current shadow-[0_0_8px_currentColor]"
                          />
                        ) : (
                          slot
                        )}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </React.Fragment>
          );
        })}

        {caretVisible && (
          <motion.span
            aria-hidden="true"
            data-slot="otp-input-caret"
            initial={false}
            animate={{
              x: caretX - 1,
              y: "-50%",
              height: scale.caretHeight,
              scaleX: isCaretMoving && !reduceMotion ? 1.4 : 1,
              scaleY: isCaretMoving && !reduceMotion ? 0.85 : 1,
              opacity: isCaretMoving ? 1 : [1, 1, 0, 0],
            }}
            transition={{
              x: reduceMotion ? { duration: 0 } : CARET_SPRING,
              height: reduceMotion ? { duration: 0 } : SIZE_SPRING,
              scaleX: { duration: 0.15 },
              scaleY: { duration: 0.15 },
              opacity: isCaretMoving
                ? { duration: 0.05 }
                : {
                    duration: 1.05,
                    times: [0, 0.48, 0.5, 1],
                    repeat: Infinity,
                    ease: "linear",
                  },
            }}
            className="pointer-events-none absolute left-0 top-1/2 w-0.5 rounded-full bg-black dark:bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-30"
          />
        )}
      </motion.div>
    </div>
  );
}

export default OtpInput;
