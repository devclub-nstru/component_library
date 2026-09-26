import React from "react";
import { cn } from "@/lib/utils";

export interface GlowingBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "blue" | "emerald" | "amber" | "violet" | "default";
  pulse?: boolean;
}

export const GlowingBadge = ({
  className,
  children,
  variant = "default",
  pulse = true,
  ...props
}: GlowingBadgeProps) => {
  const variantStyles = {
    blue: "border-blue-500/30 bg-blue-50 text-blue-700 shadow-[0_0_12px_rgba(59,130,246,0.15)] dark:bg-blue-950/40 dark:text-blue-400",
    emerald:
      "border-emerald-500/30 bg-emerald-50 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.15)] dark:bg-emerald-950/40 dark:text-emerald-400",
    amber:
      "border-amber-500/30 bg-amber-50 text-amber-700 shadow-[0_0_12px_rgba(245,158,11,0.15)] dark:bg-amber-950/40 dark:text-amber-400",
    violet:
      "border-violet-500/30 bg-violet-50 text-violet-700 shadow-[0_0_12px_rgba(139,92,246,0.15)] dark:bg-violet-950/40 dark:text-violet-400",
    default:
      "border-zinc-300 bg-zinc-100 text-zinc-800 dark:border-white/20 dark:bg-zinc-950 dark:text-zinc-300",
  };

  const dotColors = {
    blue: "bg-blue-600 dark:bg-blue-400",
    emerald: "bg-emerald-600 dark:bg-emerald-400",
    amber: "bg-amber-600 dark:bg-amber-400",
    violet: "bg-violet-600 dark:bg-violet-400",
    default: "bg-current",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider transition-all duration-200",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              dotColors[variant],
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              dotColors[variant],
            )}
          />
        </span>
      )}
      <span>{children}</span>
    </div>
  );
};
