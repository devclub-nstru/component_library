"use client";

import { FileText, Mic } from "lucide-react";

export type PromptActionId = "image" | "note" | "event" | "voice" | "docs";

export function PromptComposerArt({ id }: { id: PromptActionId }) {
  if (id === "note")
    return (
      <span className="flex w-[82%] flex-col gap-[1.7cqw] pt-[4%]">
        {[1, 0.85, 1, 0.7].map((width, index) => (
          <span key={index} data-art-line className="h-px origin-left rounded-full bg-current opacity-45" style={{ width: `${width * 100}%` }} />
        ))}
      </span>
    );

  if (id === "event")
    return <span data-art-date className="block font-sans text-[8cqw] leading-none font-bold tracking-[-0.07em]">12</span>;

  if (id === "voice")
    return (
      <span className="relative flex w-[60%] items-start justify-center">
        <Mic data-art-mic className="size-full max-h-[13cqw]" strokeWidth={2.5} />
        <span data-art-dot className="absolute top-[8.6cqw] left-1/2 size-[3.7cqw] -translate-x-1/2 rounded-full bg-[#e96d6d] shadow-[inset_0_1px_1px_#ffffff60]">
          <span className="absolute inset-[30%] rounded-full bg-white/50" />
        </span>
      </span>
    );

  if (id === "docs")
    return <FileText data-art-doc className="mt-[1cqw] size-[13cqw] fill-current stroke-[var(--pc-paper)]" strokeWidth={1.5} />;

  return (
    <svg className="h-auto w-[66%] overflow-visible" viewBox="0 0 80 64" fill="none" aria-hidden="true">
      <path data-art-spark d="M52 4c1.3 7.4 3.6 9.7 11 11-7.4 1.3-9.7 3.6-11 11-1.3-7.4-3.6-9.7-11-11 7.4-1.3 9.7-3.6 11-11Z" fill="currentColor" />
      <path data-art-triangle d="M24 22 35 41H13Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
      <rect x="12" y="48" width="18" height="18" rx="4.5" stroke="currentColor" strokeWidth="5" />
      <circle data-art-circle cx="52" cy="54" r="9" stroke="currentColor" strokeWidth="5" />
    </svg>
  );
}
