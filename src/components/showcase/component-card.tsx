import React from "react";
import Link from "next/link";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { ComponentRegistryItem } from "@/types/component";

interface ComponentCardProps {
  component: ComponentRegistryItem;
  preview?: React.ReactNode;
}

export const ComponentCard = ({ component, preview }: ComponentCardProps) => {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden border border-white/[0.08] bg-black/60 transition-all duration-300 hover:border-white/30 hover:bg-zinc-950/80">
      <div className="relative flex h-48 w-full items-center justify-center overflow-hidden border-b border-white/[0.08] bg-zinc-950/40 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[16px_16px] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex w-full items-center justify-center">
          {preview}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 className="font-medium text-zinc-100 text-sm tracking-tight group-hover:text-white transition-colors mb-2">
            {component.name}
          </h3>
          <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-2">
            {component.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 flex-wrap">
            {component.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-400 font-mono"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href={`/components/${component.slug}`}
            className="inline-flex items-center gap-1 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
          >
            <span>View</span>
            <ArrowTopRightIcon className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
