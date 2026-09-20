"use client";

import React, { useState } from "react";
import { EyeOpenIcon, CodeIcon } from "@radix-ui/react-icons";
import { CodeBlock } from "./code-block";
import { cn } from "@/lib/utils";

interface ComponentPreviewProps {
  children: React.ReactNode;
  code: string;
  filename?: string;
  className?: string;
}

export const ComponentPreview = ({
  children,
  code,
  filename,
  className,
}: ComponentPreviewProps) => {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/40 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              activeTab === "preview"
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <EyeOpenIcon className="h-3.5 w-3.5" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              activeTab === "code"
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <CodeIcon className="h-3.5 w-3.5" />
            <span>Code</span>
          </button>
        </div>
      </div>

      <div className="p-0">
        {activeTab === "preview" ? (
          <div className="relative flex min-h-[320px] w-full items-center justify-center p-8 overflow-hidden bg-zinc-950/40">
            <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
            <div className="relative z-10 w-full flex items-center justify-center">
              {children}
            </div>
          </div>
        ) : (
          <CodeBlock
            code={code}
            filename={filename}
            className="border-0 rounded-none"
          />
        )}
      </div>
    </div>
  );
};
