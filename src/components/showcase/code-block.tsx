"use client";

import React, { useState } from "react";
import { CheckIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export const CodeBlock = ({
  code,
  language = "tsx",
  filename,
  className,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "relative rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/50 px-4 py-2.5">
        <span className="text-[11px] text-zinc-400 font-sans font-medium">
          {filename || language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md border border-zinc-800 px-2 py-1 text-[11px] font-sans text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <ClipboardCopyIcon className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-zinc-300 leading-relaxed whitespace-pre font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
