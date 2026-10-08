"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  useId,
  useImperativeHandle,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  title: string;
  description: string;
}

export interface BlurTextProps {
  text?: string;
  delay?: number;
  startDelay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  stiffness?: number;
  damping?: number;
  mass?: number;
  blurAmount?: number;
  onAnimationComplete?: () => void;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay,
  startDelay = 0.05,
  className = "",
  animateBy = "letters",
  direction = "bottom",
  stiffness = 180,
  damping = 22,
  mass = 0.6,
  blurAmount = 8,
  onAnimationComplete,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const words = useMemo(() => text.split(" "), [text]);

  const totalChars = useMemo(() => text.length, [text]);
  const effectiveDelay = useMemo(() => {
    if (delay !== undefined) return delay;
    if (animateBy === "words") return 0.05;
    return Math.max(0.007, Math.min(0.016, 1.1 / Math.max(totalChars, 1)));
  }, [delay, animateBy, totalChars]);

  let charCounter = 0;

  if (prefersReducedMotion) {
    return <p className={cn("leading-relaxed", className)}>{text}</p>;
  }

  return (
    <p
      aria-label={text}
      className={cn(
        "flex flex-wrap items-baseline leading-relaxed select-none",
        className,
      )}
    >
      {words.map((word, wordIndex) => {
        if (animateBy === "words") {
          const currentWordIndex = wordIndex;
          const isLast = currentWordIndex === words.length - 1;
          const wordDelay = startDelay + currentWordIndex * effectiveDelay;

          return (
            <React.Fragment key={wordIndex}>
              <motion.span
                aria-hidden="true"
                initial={{
                  opacity: 0,
                  filter: `blur(${blurAmount}px)`,
                  y: direction === "top" ? -8 : 8,
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                }}
                transition={{
                  opacity: {
                    duration: 0.32,
                    ease: [0.22, 1, 0.36, 1],
                    delay: wordDelay,
                  },
                  filter: {
                    duration: 0.36,
                    ease: [0.22, 1, 0.36, 1],
                    delay: wordDelay,
                  },
                  y: {
                    type: "spring",
                    stiffness,
                    damping,
                    mass,
                    delay: wordDelay,
                  },
                }}
                onAnimationComplete={isLast ? onAnimationComplete : undefined}
                style={{
                  display: "inline-block",
                  willChange: "transform, filter, opacity",
                }}
              >
                {word}
              </motion.span>
              {wordIndex < words.length - 1 && (
                <span aria-hidden="true" className="inline-block">
                  &nbsp;
                </span>
              )}
            </React.Fragment>
          );
        }

        const letters = word.split("");

        return (
          <React.Fragment key={wordIndex}>
            <span aria-hidden="true" className="inline-block whitespace-nowrap">
              {letters.map((char, letterIndex) => {
                const globalIndex = charCounter++;
                const isLast =
                  globalIndex === totalChars - 1 ||
                  (wordIndex === words.length - 1 &&
                    letterIndex === letters.length - 1);
                const letterAnimationDelay =
                  startDelay + globalIndex * effectiveDelay;

                return (
                  <motion.span
                    key={letterIndex}
                    initial={{
                      opacity: 0,
                      filter: `blur(${blurAmount}px)`,
                      y: direction === "top" ? -8 : 8,
                    }}
                    animate={{
                      opacity: 1,
                      filter: "blur(0px)",
                      y: 0,
                    }}
                    transition={{
                      opacity: {
                        duration: 0.32,
                        ease: [0.22, 1, 0.36, 1],
                        delay: letterAnimationDelay,
                      },
                      filter: {
                        duration: 0.36,
                        ease: [0.22, 1, 0.36, 1],
                        delay: letterAnimationDelay,
                      },
                      y: {
                        type: "spring",
                        stiffness,
                        damping,
                        mass,
                        delay: letterAnimationDelay,
                      },
                    }}
                    onAnimationComplete={
                      isLast ? onAnimationComplete : undefined
                    }
                    style={{
                      display: "inline-block",
                      willChange: "transform, filter, opacity",
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
            {wordIndex < words.length - 1 && (
              <span aria-hidden="true" className="inline-block">
                &nbsp;
              </span>
            )}
          </React.Fragment>
        );
      })}
    </p>
  );
};

export interface AccordionProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onToggle"
> {
  items: AccordionItem[];
  defaultIndex?: number | null;
  collapsible?: boolean;
  letterDelay?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  blurAmount?: number;
  closeOnClickOutside?: boolean;
  onToggle?: (index: number | null) => void;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      className,
      defaultIndex = 1,
      collapsible = true,
      letterDelay,
      stiffness = 180,
      damping = 22,
      mass = 0.6,
      blurAmount = 8,
      closeOnClickOutside = true,
      onToggle,
      ...props
    },
    ref,
  ) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(defaultIndex);
    const innerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const baseId = useId();

    useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    useEffect(() => {
      if (!closeOnClickOutside) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          innerRef.current &&
          !innerRef.current.contains(event.target as Node)
        ) {
          setActiveIndex(null);
          onToggle?.(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [closeOnClickOutside, onToggle]);

    const toggleAccordion = (index: number) => {
      const nextIndex =
        activeIndex === index ? (collapsible ? null : index) : index;
      setActiveIndex(nextIndex);
      onToggle?.(nextIndex);
    };

    return (
      <div
        ref={innerRef}
        className={cn("w-full select-none", className)}
        {...props}
      >
        <div className="mx-auto w-full max-w-lg rounded-2xl bg-linear-to-b from-[#fdf7f9] to-[#fcebf2] p-1.5 border border-black/5 dark:from-black dark:to-[#0c0c0e]/80 dark:border-white/8">
          <div className="space-y-1.5">
            {items.map((item, index) => {
              const isOpen = activeIndex === index;
              const triggerId = `${baseId}-trigger-${index}`;
              const panelId = `${baseId}-panel-${index}`;

              return (
                <div
                  key={index}
                  className={cn(
                    "overflow-hidden rounded-xl border transition-all duration-300",
                    isOpen
                      ? "border-black/10 bg-white shadow-sm dark:border-white/20 dark:bg-[#121217] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
                      : "border-transparent bg-white shadow-xs hover:border-black/5 dark:border-white/8 dark:bg-[#0c0c0e]/90 dark:hover:border-white/15 dark:hover:bg-[#101014]",
                  )}
                >
                  <button
                    type="button"
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? panelId : undefined}
                    className="group flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left text-base font-medium transition-colors text-gray-800 hover:text-gray-950 dark:text-zinc-200 dark:hover:text-white"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span
                      className={cn(
                        "transition-colors duration-200",
                        isOpen
                          ? "text-gray-950 dark:text-white"
                          : "text-gray-800 dark:text-zinc-200",
                      )}
                    >
                      {item.title}
                    </span>
                    <div className="relative flex items-center justify-center w-5 h-5 text-gray-400 transition-colors dark:text-zinc-400 group-hover:text-gray-600 dark:group-hover:text-zinc-200">
                      <motion.span
                        className="absolute h-[1.5px] w-3 bg-current rounded-full"
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 320, damping: 24 }
                        }
                      />
                      <motion.span
                        className="absolute w-[1.5px] h-3 bg-current rounded-full"
                        animate={{
                          scaleY: isOpen ? 0 : 1,
                          opacity: isOpen ? 0 : 1,
                          rotate: isOpen ? 90 : 0,
                        }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 320, damping: 24 }
                        }
                      />
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: prefersReducedMotion
                            ? { duration: 0 }
                            : {
                                height: {
                                  duration: 0.38,
                                  ease: [0.16, 1, 0.3, 1],
                                },
                                opacity: {
                                  duration: 0.25,
                                  ease: "easeOut",
                                },
                              },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: prefersReducedMotion
                            ? { duration: 0 }
                            : {
                                height: {
                                  duration: 0.28,
                                  ease: [0.16, 1, 0.3, 1],
                                },
                                opacity: {
                                  duration: 0.18,
                                  ease: "easeIn",
                                },
                              },
                        }}
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        className="overflow-hidden"
                      >
                        <div
                          className="cursor-pointer px-5 pb-4 text-sm leading-relaxed text-gray-600 dark:text-zinc-400 font-light"
                          onClick={() => toggleAccordion(index)}
                        >
                          <BlurText
                            text={item.description}
                            animateBy="letters"
                            delay={letterDelay}
                            stiffness={stiffness}
                            damping={damping}
                            mass={mass}
                            blurAmount={blurAmount}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

Accordion.displayName = "Accordion";

export default Accordion;
