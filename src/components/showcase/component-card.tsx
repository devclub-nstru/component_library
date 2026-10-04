import React from "react";
import Link from "next/link";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { ComponentRegistryItem } from "@/types/component";

interface ComponentCardProps {
  component: ComponentRegistryItem;
  preview?: React.ReactNode;
  badge?: string;
}

export const ComponentCard = ({
  component,
  preview,
  badge = "NEW",
}: ComponentCardProps) => {
  return (
    <div
      className="group relative isolate flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card hover:border-foreground/25 focus-within:border-foreground/25 hover:shadow-lg dark:hover:shadow-black/40 transition-all duration-300"
    >
      <Link
        href={`/components/${component.slug}`}
        aria-label={component.name}
        className="absolute inset-0 z-20 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground/50"
      />
      <div className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-muted/40 dark:bg-black/60 p-6 border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] text-foreground/10 bg-size-[16px_16px] pointer-events-none" />
        <div inert aria-hidden="true" className="relative z-10 flex w-full items-center justify-center pointer-events-none">
          {preview}
        </div>
      </div>

      <div className="px-4 sm:px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <h3 className="font-medium text-foreground text-sm tracking-tight transition-colors">
            {component.name}
          </h3>
          {badge && (
            <span className="text-[10px] font-mono font-medium text-orange-500 uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>

        <ArrowTopRightIcon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </div>
  );
};
