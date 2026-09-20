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
    <Link
      href={`/components/${component.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/8 bg-[#0c0c0e] hover:border-white/25 transition-all duration-300"
    >
      <div className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-black/60 p-6 border-b border-white/6">
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[16px_16px] opacity-15 pointer-events-none" />
        <div className="relative z-10 flex w-full items-center justify-center pointer-events-none">
          {preview}
        </div>
      </div>

      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="font-medium text-zinc-200 text-sm tracking-tight group-hover:text-white transition-colors">
            {component.name}
          </h3>
          {badge && (
            <span className="text-[10px] font-mono font-medium text-orange-500 uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>

        <ArrowTopRightIcon className="h-4 w-4 text-zinc-500 group-hover:text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </Link>
  );
};
