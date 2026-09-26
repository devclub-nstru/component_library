import React from "react";
import { cn } from "@/lib/utils";

export type BentoGridProps = React.HTMLAttributes<HTMLDivElement>;

export const BentoGrid = ({
  className,
  children,
  ...props
}: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto w-full",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
  description: string;
  colSpan?: 1 | 2 | 3;
}

export const BentoCard = ({
  className,
  header,
  icon,
  title,
  description,
  colSpan = 1,
  ...props
}: BentoCardProps) => {
  const colSpanClasses = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200/80 bg-white/70 p-6 transition-all duration-300 hover:border-zinc-300 hover:bg-zinc-50/80 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-950/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/40",
        colSpanClasses[colSpan],
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-3">
        {header && <div className="overflow-hidden rounded-lg">{header}</div>}
        <div className="flex items-center gap-2">
          {icon && (
            <div className="text-zinc-500 group-hover:text-blue-500 dark:text-zinc-400 dark:group-hover:text-blue-400 transition-colors">
              {icon}
            </div>
          )}
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base tracking-tight">
            {title}
          </h3>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
