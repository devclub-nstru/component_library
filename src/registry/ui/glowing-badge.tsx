import React from "react";
import { cn } from "@/lib/utils";

export interface GlowingBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "blue" | "emerald" | "amber" | "violet" | "default";
  pulse?: boolean;
}

export const GlowingBadge = ({
  className,
  children,
  ...props
}: GlowingBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 border border-white/20 bg-zinc-950 px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider text-zinc-300",
        className
      )}
      {...props}
    >
      <span>{children}</span>
    </div>
  );
};
