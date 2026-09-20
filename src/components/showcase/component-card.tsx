import React from "react";
import Link from "next/link";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { ComponentRegistryItem } from "@/types/component";
import { GlowingBadge } from "@/registry/ui/glowing-badge";

interface ComponentCardProps {
  component: ComponentRegistryItem;
  preview?: React.ReactNode;
}

export const ComponentCard = ({ component, preview }: ComponentCardProps) => {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/60 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/40 hover:shadow-xl">
      <div className="relative flex h-48 w-full items-center justify-center overflow-hidden border-b border-zinc-800/60 bg-zinc-900/30 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />
        <div className="relative z-10 flex w-full items-center justify-center">
          {preview}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-semibold text-zinc-100 text-sm tracking-tight group-hover:text-blue-400 transition-colors">
              {component.name}
            </h3>
            <GlowingBadge
              variant="blue"
              pulse={false}
              className="capitalize text-[10px]"
            >
              {component.category}
            </GlowingBadge>
          </div>
          <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-2">
            {component.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
          <div className="flex items-center gap-1.5 flex-wrap">
            {component.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded bg-zinc-800/60 px-1.5 py-0.5 text-[10px] text-zinc-400 font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>

          <Link
            href={`/components/${component.slug}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
          >
            <span>View</span>
            <ArrowTopRightIcon className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
