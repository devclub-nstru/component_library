"use client";

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export type AsciiHoverColor =
  | "default"
  | "emerald"
  | "blue"
  | "violet"
  | "amber"
  | "rose"
  | "cyan";

export interface AsciiColorPalette {
  dark: {
    text: string;
    glow: string;
  };
  light: {
    text: string;
    glow: string;
  };
}

const COLOR_PALETTES: Record<AsciiHoverColor, AsciiColorPalette> = {
  default: {
    dark: {
      text: "#ffffff",
      glow: "rgba(255, 255, 255, 0.4)",
    },
    light: {
      text: "#09090b",
      glow: "rgba(0, 0, 0, 0.12)",
    },
  },
  emerald: {
    dark: {
      text: "#34d399",
      glow: "rgba(52, 211, 153, 0.45)",
    },
    light: {
      text: "#059669",
      glow: "rgba(5, 150, 105, 0.25)",
    },
  },
  blue: {
    dark: {
      text: "#60a5fa",
      glow: "rgba(96, 165, 250, 0.45)",
    },
    light: {
      text: "#2563eb",
      glow: "rgba(37, 99, 235, 0.25)",
    },
  },
  violet: {
    dark: {
      text: "#a78bfa",
      glow: "rgba(167, 139, 250, 0.45)",
    },
    light: {
      text: "#7c3aed",
      glow: "rgba(124, 58, 237, 0.25)",
    },
  },
  cyan: {
    dark: {
      text: "#38bdf8",
      glow: "rgba(56, 189, 248, 0.45)",
    },
    light: {
      text: "#0284c7",
      glow: "rgba(2, 132, 199, 0.25)",
    },
  },
  amber: {
    dark: {
      text: "#fbbf24",
      glow: "rgba(251, 191, 36, 0.45)",
    },
    light: {
      text: "#d97706",
      glow: "rgba(217, 119, 6, 0.25)",
    },
  },
  rose: {
    dark: {
      text: "#fb7185",
      glow: "rgba(251, 113, 133, 0.45)",
    },
    light: {
      text: "#e11d48",
      glow: "rgba(225, 29, 72, 0.25)",
    },
  },
};

const DEFAULT_ASCII_CHARS = "!<>-_\\/[]{}—=+*^?#_$%&~:;0123456789";

export interface AsciiGlitchTextHandle {
  trigger: () => void;
  reset: () => void;
}

export interface AsciiGlitchTextProps {
  text: string;
  isHovered?: boolean;
  active?: boolean;
  color?: AsciiHoverColor | string;
  duration?: number;
  asciiChars?: string;
  className?: string;
}

export const AsciiGlitchText = React.forwardRef<
  AsciiGlitchTextHandle,
  AsciiGlitchTextProps
>(
  (
    {
      text,
      isHovered = false,
      active = false,
      color = "default",
      duration = 0.75,
      asciiChars = DEFAULT_ASCII_CHARS,
      className,
    },
    ref,
  ) => {
    const [displayChars, setDisplayChars] = useState<string[]>(() =>
      text.split(""),
    );
    const [prevText, setPrevText] = useState(text);
    const progressRef = useRef({ progress: 0 });
    const lastUpdateRef = useRef(0);
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    if (prevText !== text) {
      setPrevText(text);
      setDisplayChars(text.split(""));
    }

    const isPresetColor = color in COLOR_PALETTES;
    const isCustomColor = !isPresetColor && Boolean(color);

    const triggerGlitch = useCallback(() => {
      if (typeof window === "undefined") return;

      if (tweenRef.current) {
        tweenRef.current.kill();
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        setDisplayChars(text.split(""));
        return;
      }

      progressRef.current.progress = 0;
      lastUpdateRef.current = 0;
      const chars = text.split("");
      const total = chars.length;
      const glyphs = asciiChars || DEFAULT_ASCII_CHARS;

      tweenRef.current = gsap.to(progressRef.current, {
        progress: 1,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          const now = performance.now();
          const p = progressRef.current.progress;

          const shouldRegenerate =
            now - lastUpdateRef.current >= 45 || p >= 0.98;
          if (!shouldRegenerate && p < 0.98) return;
          lastUpdateRef.current = now;

          const updated = chars.map((char, index) => {
            if (char === " ") return " ";
            const threshold = (index + 0.6) / (total + 0.4);
            if (p >= threshold) {
              return char;
            }
            const randomIndex = Math.floor(Math.random() * glyphs.length);
            return glyphs[randomIndex];
          });
          setDisplayChars(updated);
        },
        onComplete: () => {
          setDisplayChars(chars);
        },
      });
    }, [text, duration, asciiChars]);

    const resetGlitch = useCallback(() => {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
      setDisplayChars(text.split(""));
    }, [text]);

    useImperativeHandle(
      ref,
      () => ({
        trigger: triggerGlitch,
        reset: resetGlitch,
      }),
      [triggerGlitch, resetGlitch],
    );

    useEffect(() => {
      if (isHovered) {
        const frame = requestAnimationFrame(() => {
          triggerGlitch();
        });
        return () => cancelAnimationFrame(frame);
      }
    }, [isHovered, triggerGlitch]);

    useEffect(() => {
      return () => {
        if (tweenRef.current) {
          tweenRef.current.kill();
        }
      };
    }, []);

    const highlighted = isHovered || active;

    const customColorStyle = useMemo(() => {
      if (!highlighted) return undefined;
      if (isCustomColor) {
        return {
          color,
          textShadow: `0 0 10px ${color}80`,
        };
      }
      return undefined;
    }, [highlighted, isCustomColor, color]);

    const originalChars = useMemo(() => text.split(""), [text]);

    return (
      <span
        className={cn(
          "inline-flex items-center justify-center font-sans text-sm tracking-wider font-semibold select-none transition-colors duration-300 ease-out",
          !highlighted &&
            "text-zinc-400 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100",
          highlighted &&
            isPresetColor &&
            color === "default" &&
            "text-zinc-950 dark:text-white",
          highlighted &&
            isPresetColor &&
            color === "emerald" &&
            "text-emerald-600 dark:text-emerald-400",
          highlighted &&
            isPresetColor &&
            color === "blue" &&
            "text-blue-600 dark:text-blue-400",
          highlighted &&
            isPresetColor &&
            color === "violet" &&
            "text-violet-600 dark:text-violet-400",
          highlighted &&
            isPresetColor &&
            color === "cyan" &&
            "text-cyan-600 dark:text-cyan-400",
          highlighted &&
            isPresetColor &&
            color === "amber" &&
            "text-amber-600 dark:text-amber-400",
          highlighted &&
            isPresetColor &&
            color === "rose" &&
            "text-rose-600 dark:text-rose-400",
          className,
        )}
        style={customColorStyle}
        aria-label={text}
      >
        {displayChars.map((char, index) => {
          const isGlitching = char !== originalChars[index];

          return (
            <span
              key={index}
              className={cn(
                "inline-block text-center transition-colors duration-150",
                isGlitching &&
                  "text-zinc-500 dark:text-zinc-300 opacity-90 font-mono",
              )}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </span>
    );
  },
);

AsciiGlitchText.displayName = "AsciiGlitchText";

export type AsciiHoverButtonVariant =
  | "segmented"
  | "card"
  | "outline"
  | "ghost";

export type AsciiHoverButtonSize = "sm" | "default" | "lg";

export interface AsciiHoverButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> {
  text?: string;
  variant?: AsciiHoverButtonVariant;
  size?: AsciiHoverButtonSize;
  color?: AsciiHoverColor | string;
  active?: boolean;
  asciiChars?: string;
  scrambleDuration?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles: Record<AsciiHoverButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs gap-1.5 rounded-xl",
  default: "h-11 px-5 text-sm gap-2 rounded-2xl",
  lg: "h-13 px-7 text-base gap-2.5 rounded-2xl",
};

export const AsciiHoverButton = React.forwardRef<
  HTMLButtonElement,
  AsciiHoverButtonProps
>(
  (
    {
      text = "Explore",
      children,
      variant = "segmented",
      size = "default",
      color = "default",
      active = false,
      asciiChars = DEFAULT_ASCII_CHARS,
      scrambleDuration = 0.75,
      leftIcon,
      rightIcon,
      className,
      disabled,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const glitchRef = useRef<AsciiGlitchTextHandle>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      setIsHovered(true);
      glitchRef.current?.trigger();
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(false);
      onMouseLeave?.(e);
    };

    const buttonText = typeof children === "string" ? children : text;

    return (
      <button
        ref={ref}
        disabled={disabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none overflow-hidden active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          sizeStyles[size],
          variant === "segmented" &&
            (active
              ? "bg-white text-zinc-950 border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] dark:bg-[#18181b] dark:text-white dark:border-white/20 dark:shadow-[0_2px_10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]"
              : "bg-zinc-100/70 border border-transparent text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100"),
          variant === "card" &&
            "bg-zinc-100 text-zinc-900 border border-zinc-200/80 shadow-sm hover:border-zinc-300 hover:bg-zinc-200/60 dark:bg-[#121214] dark:text-zinc-100 dark:border-white/10 dark:hover:border-white/25 dark:hover:bg-zinc-900/90 dark:shadow-xl",
          variant === "outline" &&
            "border border-zinc-300 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100/80 dark:border-white/20 dark:text-zinc-300 dark:hover:border-white/40 dark:hover:bg-white/5",
          variant === "ghost" &&
            "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100",
          className,
        )}
        {...props}
      >
        {leftIcon && (
          <span className="relative z-10 shrink-0 transition-transform duration-200 group-hover:scale-105">
            {leftIcon}
          </span>
        )}
        <AsciiGlitchText
          ref={glitchRef}
          text={buttonText}
          isHovered={isHovered}
          active={active}
          color={color}
          duration={scrambleDuration}
          asciiChars={asciiChars}
        />
        {rightIcon && (
          <span className="relative z-10 shrink-0 transition-transform duration-200 group-hover:scale-105">
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

AsciiHoverButton.displayName = "AsciiHoverButton";

export default AsciiHoverButton;
