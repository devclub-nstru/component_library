"use client";

import * as React from "react";
import {
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
  useId,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export type AccordionType = "single" | "multiple";
export type AccordionVariant = "separated" | "bordered" | "ghost";

export interface AccordionItemData {
  value: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface AccordionContextValue {
  type: AccordionType;
  expanded: string[];
  toggleItem: (val: string) => void;
  variant: AccordionVariant;
  blurAmount: number;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled?: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(
  null,
);

function useAccordionItem() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      "AccordionTrigger and AccordionContent must be used within an AccordionItem",
    );
  }
  return context;
}

export interface AccordionProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  type?: AccordionType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  variant?: AccordionVariant;
  blurAmount?: number;
  items?: AccordionItemData[];
}

export function Accordion({
  type = "single",
  value: controlledValue,
  defaultValue,
  onValueChange,
  collapsible = true,
  variant = "separated",
  blurAmount = 8,
  items,
  children,
  className,
  ...props
}: AccordionProps) {
  const [internalExpanded, setInternalExpanded] = useState<string[]>(() => {
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  });

  const isControlled = controlledValue !== undefined;
  const currentExpanded = useMemo(() => {
    if (isControlled) {
      return Array.isArray(controlledValue)
        ? controlledValue
        : controlledValue
          ? [controlledValue]
          : [];
    }
    return internalExpanded;
  }, [isControlled, controlledValue, internalExpanded]);

  const toggleItem = useCallback(
    (itemValue: string) => {
      let next: string[];
      if (type === "single") {
        const isCurrentOpen = currentExpanded.includes(itemValue);
        if (isCurrentOpen) {
          next = collapsible ? [] : [itemValue];
        } else {
          next = [itemValue];
        }
      } else {
        if (currentExpanded.includes(itemValue)) {
          next = currentExpanded.filter((v) => v !== itemValue);
        } else {
          next = [...currentExpanded, itemValue];
        }
      }

      if (!isControlled) {
        setInternalExpanded(next);
      }

      if (onValueChange) {
        onValueChange(type === "single" ? (next[0] ?? "") : next);
      }
    },
    [type, currentExpanded, collapsible, isControlled, onValueChange],
  );

  return (
    <AccordionContext.Provider
      value={{
        type,
        expanded: currentExpanded,
        toggleItem,
        variant,
        blurAmount,
      }}
    >
      <div
        className={cn(
          "w-full select-none",
          variant === "separated" && "flex flex-col gap-2.5",
          variant === "bordered" &&
            "rounded-xl border border-zinc-200 divide-y divide-zinc-200 overflow-hidden bg-white/90 dark:border-white/8 dark:divide-white/8 dark:bg-[#0c0c0e]/80",
          variant === "ghost" &&
            "flex flex-col divide-y divide-zinc-200 dark:divide-white/5",
          className,
        )}
        {...props}
      >
        {items
          ? items.map((item) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                disabled={item.disabled}
              >
                <AccordionTrigger
                  badge={item.badge}
                  icon={item.icon}
                  subtitle={item.subtitle}
                >
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))
          : children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export function AccordionItem({
  value,
  disabled = false,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const { expanded, variant } = useAccordion();
  const id = useId();
  const triggerId = `accordion-trigger-${id}`;
  const contentId = `accordion-content-${id}`;
  const isOpen = expanded.includes(value);

  return (
    <AccordionItemContext.Provider
      value={{ value, isOpen, disabled, triggerId, contentId }}
    >
      <div
        className={cn(
          "group transition-all duration-300",
          variant === "separated" && [
            "rounded-xl border border-zinc-200/90 bg-white/90 backdrop-blur-sm overflow-hidden hover:border-zinc-300 hover:bg-zinc-50/90 dark:border-white/8 dark:bg-[#0c0c0e]/80 dark:hover:border-white/15 dark:hover:bg-[#101014]/90",
            isOpen &&
              "border-zinc-300 bg-white shadow-md dark:border-white/20 dark:bg-[#121217]/95 dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)]",
          ],
          variant === "bordered" && [
            "transition-colors",
            isOpen && "bg-zinc-50/80 dark:bg-[#121217]/60",
          ],
          variant === "ghost" && [
            "transition-colors rounded-lg",
            isOpen && "bg-zinc-100/60 dark:bg-white/3",
          ],
          disabled && "opacity-45 pointer-events-none",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function AccordionTrigger({
  children,
  badge,
  icon,
  subtitle,
  className,
  ...props
}: AccordionTriggerProps) {
  const { toggleItem } = useAccordion();
  const { value, isOpen, disabled, triggerId, contentId } = useAccordionItem();
  const prefersReducedMotion = useReducedMotion();

  return (
    <button
      type="button"
      id={triggerId}
      aria-controls={contentId}
      aria-expanded={isOpen}
      disabled={disabled}
      onClick={() => toggleItem(value)}
      className={cn(
        "w-full flex items-center justify-between gap-4 p-4 text-left cursor-pointer transition-colors outline-none focus-visible:ring-1 focus-visible:ring-foreground/30 dark:focus-visible:ring-white/30",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {icon && (
          <span className="shrink-0 text-zinc-500 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200 transition-colors">
            {icon}
          </span>
        )}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={cn(
                "text-sm font-medium tracking-tight transition-colors duration-200",
                isOpen
                  ? "text-zinc-950 dark:text-white"
                  : "text-zinc-700 group-hover:text-zinc-950 dark:text-zinc-200 dark:group-hover:text-white",
              )}
            >
              {children}
            </span>
            {badge && (
              <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full border border-zinc-200 bg-zinc-100 text-zinc-600 group-hover:text-zinc-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:group-hover:text-zinc-300">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-light mt-0.5 truncate">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 320, damping: 24 }
        }
        className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-white transition-colors"
      >
        <ChevronDownIcon className="w-4 h-4" />
      </motion.div>
    </button>
  );
}

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

export function AccordionContent({
  children,
  className,
  ...props
}: AccordionContentProps) {
  const { blurAmount } = useAccordion();
  const { isOpen, triggerId, contentId } = useAccordionItem();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          initial={{ height: 0 }}
          animate={{
            height: "auto",
            transition: prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
          }}
          exit={{
            height: 0,
            transition: prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
          }}
          className="overflow-hidden"
        >
          <motion.div
            initial={{
              opacity: 0,
              filter: `blur(${blurAmount}px)`,
              y: -8,
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              transition: prefersReducedMotion
                ? { duration: 0 }
                : {
                    delay: 0.08,
                    duration: 0.34,
                    ease: [0.16, 1, 0.3, 1],
                  },
            }}
            exit={{
              opacity: 0,
              filter: `blur(${blurAmount}px)`,
              y: -4,
              transition: prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: 0.18,
                    ease: "easeInOut",
                  },
            }}
          >
            <div
              className={cn(
                "px-4 pb-4.5 pt-0 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed",
                className,
              )}
              {...props}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const SmoothAccordion = Accordion;
