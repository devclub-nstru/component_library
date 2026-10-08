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

export interface DottedAccordionItem {
  title: string;
  description: string;
}

export interface DottedAccordionProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onToggle"
> {
  items: DottedAccordionItem[];
  defaultIndex?: number | null;
  collapsible?: boolean;
  extensionLength?: number;
  closeOnClickOutside?: boolean;
  onToggle?: (index: number | null) => void;
}

export const DottedAccordion = forwardRef<HTMLDivElement, DottedAccordionProps>(
  (
    {
      items,
      className,
      defaultIndex = 0,
      collapsible = true,
      extensionLength = 48,
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

    const horizontalMaskStyle = useMemo(
      () => ({
        WebkitMaskImage: `linear-gradient(to right, transparent, black ${extensionLength}px, black calc(100% - ${extensionLength}px), transparent)`,
        maskImage: `linear-gradient(to right, transparent, black ${extensionLength}px, black calc(100% - ${extensionLength}px), transparent)`,
      }),
      [extensionLength],
    );

    const verticalMaskStyle = useMemo(
      () => ({
        WebkitMaskImage: `linear-gradient(to bottom, transparent, black ${extensionLength}px, black calc(100% - ${extensionLength}px), transparent)`,
        maskImage: `linear-gradient(to bottom, transparent, black ${extensionLength}px, black calc(100% - ${extensionLength}px), transparent)`,
      }),
      [extensionLength],
    );

    return (
      <div className="relative py-12 px-8 sm:px-14 w-full flex justify-center overflow-visible select-none">
        <div
          ref={innerRef}
          className={cn(
            "relative w-full max-w-xl rounded-none border border-zinc-200 bg-white dark:border-white/10 dark:bg-black",
            className,
          )}
          {...props}
        >
          <div className="flex flex-col gap-0 rounded-none divide-y divide-zinc-200 dark:divide-white/10 relative z-10">
            {items.map((item, index) => {
              const isOpen = activeIndex === index;
              const triggerId = `${baseId}-trigger-${index}`;
              const panelId = `${baseId}-panel-${index}`;

              return (
                <div
                  key={index}
                  className={cn(
                    "relative rounded-none transition-colors duration-200",
                    isOpen
                      ? "bg-zinc-50 dark:bg-[#111116]"
                      : "bg-white hover:bg-zinc-50/70 dark:bg-[#0a0a0c] dark:hover:bg-[#0f0f13]",
                  )}
                >
                  <AnimatePresence>
                    {isOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-0 -left-12 -right-12 h-0 border-t border-dotted border-zinc-900/70 dark:border-white/70 pointer-events-none z-20"
                          style={horizontalMaskStyle}
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute bottom-0 -left-12 -right-12 h-0 border-b border-dotted border-zinc-900/70 dark:border-white/70 pointer-events-none z-20"
                          style={horizontalMaskStyle}
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 -top-12 -bottom-12 w-0 border-l border-dotted border-zinc-900/70 dark:border-white/70 pointer-events-none z-20"
                          style={verticalMaskStyle}
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 -top-12 -bottom-12 w-0 border-r border-dotted border-zinc-900/70 dark:border-white/70 pointer-events-none z-20"
                          style={verticalMaskStyle}
                        />
                      </>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? panelId : undefined}
                    onClick={() => toggleAccordion(index)}
                    className="group flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left rounded-none transition-colors outline-none focus-visible:ring-1 focus-visible:ring-foreground/30 dark:focus-visible:ring-white/30"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <span className="font-mono text-xs text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors shrink-0 w-5">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "text-sm font-medium tracking-tight transition-colors duration-200 truncate",
                          isOpen
                            ? "text-zinc-950 dark:text-white"
                            : "text-zinc-700 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-white",
                        )}
                      >
                        {item.title}
                      </span>
                    </div>

                    <div className="relative flex items-center justify-center w-5 h-5 text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-200 transition-colors shrink-0 ml-3">
                      <motion.span
                        className="absolute h-[1.5px] w-3 bg-current rounded-none"
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 320, damping: 24 }
                        }
                      />
                      <motion.span
                        className="absolute w-[1.5px] h-3 bg-current rounded-none"
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
                                  duration: 0.32,
                                  ease: [0.16, 1, 0.3, 1],
                                },
                                opacity: {
                                  duration: 0.22,
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
                                  duration: 0.25,
                                  ease: [0.16, 1, 0.3, 1],
                                },
                                opacity: {
                                  duration: 0.15,
                                  ease: "easeIn",
                                },
                              },
                        }}
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        className="overflow-hidden rounded-none"
                      >
                        <div
                          className="cursor-pointer pl-13.5 pr-5 pb-5 pt-0.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-light"
                          onClick={() => toggleAccordion(index)}
                        >
                          {item.description}
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

DottedAccordion.displayName = "DottedAccordion";

export default DottedAccordion;
