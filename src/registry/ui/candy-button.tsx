"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type CandyButtonVariant =
  | "emerald"
  | "ruby"
  | "amber"
  | "violet"
  | "azure"
  | "obsidian"
  | "pearl";

export type CandyButtonSize = "sm" | "default" | "lg" | "icon";

export interface CandyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CandyButtonVariant;
  size?: CandyButtonSize;
  color?: string;
  glow?: boolean;
  glassSheen?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<CandyButtonVariant, string> = {
  emerald:
    "bg-[radial-gradient(95%_60%_at_50%_75%,#005451_0%,#002927_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(0,60,58,0.6),inset_0px_1px_4px_0px_rgba(255,255,255,0.4),inset_0px_-2px_4px_0px_rgba(0,0,0,0.3)] hover:shadow-[0px_6px_28px_-4px_rgba(0,60,58,0.75),inset_0px_1px_4px_0px_rgba(255,255,255,0.5),inset_0px_-2px_4px_0px_rgba(0,0,0,0.3)]",
  ruby: "bg-[radial-gradient(95%_60%_at_50%_75%,#dc2626_0%,#991b1b_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(220,38,38,0.6),inset_0px_1px_4px_0px_rgba(255,255,255,0.4),inset_0px_-2px_4px_0px_rgba(0,0,0,0.3)] hover:shadow-[0px_6px_28px_-4px_rgba(220,38,38,0.75),inset_0px_1px_4px_0px_rgba(255,255,255,0.5),inset_0px_-2px_4px_0px_rgba(0,0,0,0.3)]",
  amber:
    "bg-[radial-gradient(95%_60%_at_50%_75%,#ea580c_0%,#9a3412_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(234,88,12,0.6),inset_0px_1px_4px_0px_rgba(255,255,255,0.4),inset_0px_-2px_4px_0px_rgba(0,0,0,0.3)] hover:shadow-[0px_6px_28px_-4px_rgba(234,88,12,0.75),inset_0px_1px_4px_0px_rgba(255,255,255,0.5),inset_0px_-2px_4px_0px_rgba(0,0,0,0.3)]",
  violet:
    "bg-[radial-gradient(95%_60%_at_50%_75%,#7c3aed_0%,#4c1d95_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(124,58,237,0.6),inset_0px_1px_4px_0px_rgba(255,255,255,0.4),inset_0px_-2px_4px_0px_rgba(0,0,0,0.3)] hover:shadow-[0px_6px_28px_-4px_rgba(124,58,237,0.75),inset_0px_1px_4px_0px_rgba(255,255,255,0.5),inset_0px_-2px_4px_0px_rgba(0,0,0,0.3)]",
  azure:
    "bg-[radial-gradient(95%_60%_at_50%_75%,#0284c7_0%,#0369a1_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(2,132,199,0.6),inset_0px_1px_4px_0px_rgba(255,255,255,0.4),inset_0px_-2px_4px_0px_rgba(0,0,0,0.3)] hover:shadow-[0px_6px_28px_-4px_rgba(2,132,199,0.75),inset_0px_1px_4px_0px_rgba(255,255,255,0.5),inset_0px_-2px_4px_0px_rgba(0,0,0,0.3)]",
  obsidian:
    "bg-[radial-gradient(95%_60%_at_50%_75%,#27272a_0%,#121214_100%)] text-zinc-100 border border-white/10 shadow-[0px_4px_24px_-6px_rgba(0,0,0,0.7),inset_0px_1px_3px_0px_rgba(255,255,255,0.25),inset_0px_-2px_4px_0px_rgba(0,0,0,0.4)] hover:shadow-[0px_6px_28px_-4px_rgba(0,0,0,0.85),inset_0px_1px_3px_0px_rgba(255,255,255,0.35),inset_0px_-2px_4px_0px_rgba(0,0,0,0.4)]",
  pearl:
    "bg-[radial-gradient(95%_60%_at_50%_75%,#ffffff_0%,#d4d4d8_100%)] text-zinc-950 shadow-[0px_4px_20px_-6px_rgba(255,255,255,0.35),inset_0px_1px_3px_0px_rgba(255,255,255,0.9),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_24px_-4px_rgba(255,255,255,0.45),inset_0px_1px_3px_0px_rgba(255,255,255,1),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)]",
};

const sizeStyles: Record<CandyButtonSize, string> = {
  sm: "h-8 px-3.5 text-xs rounded-lg gap-1.5 [&_svg]:size-3.5",
  default: "h-10 px-5 text-sm rounded-xl gap-2 [&_svg]:size-4",
  lg: "h-12 px-7 text-base rounded-2xl gap-2.5 [&_svg]:size-5",
  icon: "size-10 p-0 rounded-xl gap-0 [&_svg]:size-4",
};

export const CandyButton = React.forwardRef<
  HTMLButtonElement,
  CandyButtonProps
>(
  (
    {
      className,
      children,
      variant = "emerald",
      size = "default",
      color,
      glow = true,
      glassSheen = true,
      leftIcon,
      rightIcon,
      style,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isCustom = Boolean(color);

    const customStyle: React.CSSProperties = isCustom
      ? {
          background: `radial-gradient(95% 60% at 50% 75%, ${color} 0%, color-mix(in srgb, ${color} 25%, black) 100%)`,
          boxShadow: glow
            ? `0px 4px 24px -6px color-mix(in srgb, ${color} 65%, transparent), inset 0px 1px 4px 0px rgba(255, 255, 255, 0.45), inset 0px -2px 4px 0px rgba(0, 0, 0, 0.3)`
            : `inset 0px 1px 4px 0px rgba(255, 255, 255, 0.45), inset 0px -2px 4px 0px rgba(0, 0, 0, 0.3)`,
          color: "#ffffff",
          ...style,
        }
      : (style ?? {});

    return (
      <button
        ref={ref}
        disabled={disabled}
        style={customStyle}
        className={cn(
          "relative inline-flex items-center justify-center font-medium leading-none tracking-[0.01em] select-none overflow-hidden cursor-pointer transition-all duration-200 ease-out active:scale-[0.98] active:brightness-95 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
          "after:absolute after:top-0 after:left-[15%] after:right-[15%] after:h-px after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] after:pointer-events-none",
          !isCustom && variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {glassSheen && (
          <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,transparent_100%)] pointer-events-none" />
        )}
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </span>
      </button>
    );
  },
);

CandyButton.displayName = "CandyButton";

export default CandyButton;
