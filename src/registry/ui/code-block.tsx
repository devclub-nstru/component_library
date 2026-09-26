"use client";

import React, { useState, useMemo } from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  code?: string;
  language?: string;
  color?: string;
  showLineNumbers?: boolean;
  className?: string;
  filename?: string;
}

const DEFAULT_CODE = `import { useSpring, animated } from "motion/react";

type OrbitProps = {
  radius?: number;
  speed?: number;
};

export function Orbit({ radius = 120, speed = 1 }: OrbitProps) {
  const angle = useSpring(0, { stiffness: 80, damping: 20 });

  const x = Math.cos(angle.get()) * radius;
  const y = Math.sin(angle.get()) * radius;

  return (
    <animated.div
      style={{ x, y }}
      className="size-4 rounded-full bg-current"
    />
  );
}`;

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "const",
  "let",
  "var",
  "function",
  "return",
  "interface",
  "type",
  "extends",
  "as",
  "typeof",
  "keyof",
  "new",
  "true",
  "false",
  "null",
  "undefined",
  "if",
  "else",
  "switch",
  "case",
]);

export const CodeBlock = ({
  code = DEFAULT_CODE,
  color = "#4ade80",
  showLineNumbers = true,
  className,
  filename,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const lines = useMemo(() => {
    return code.split("\n").map((line, lineIdx) => {
      const regex =
        /(".*?"|'.*?'|`.*?`|<\/?[A-Za-z0-9_$.]+|\/?>|\b[A-Za-z_$][A-Za-z0-9_$]*\b|\b\d+\b|[{}()[\];:,.=><&|!+*/?-]|\s+)/g;
      const tokens: React.ReactNode[] = [];
      let match;
      const isImportLine = line.trimStart().startsWith("import ");

      while ((match = regex.exec(line)) !== null) {
        const token = match[0];
        const key = `${lineIdx}-${match.index}`;

        if (
          token.startsWith('"') ||
          token.startsWith("'") ||
          token.startsWith("`")
        ) {
          if (isImportLine) {
            tokens.push(
              <span key={key} className="text-[#9333ea] dark:text-[#c084fc]">
                {token}
              </span>,
            );
          } else {
            tokens.push(
              <span key={key} style={{ color }}>
                {token}
              </span>,
            );
          }
        } else if (token.startsWith("<") || token === "/>" || token === ">") {
          tokens.push(
            <span key={key} style={{ color }}>
              {token}
            </span>,
          );
        } else if (token === "style" || token === "className") {
          tokens.push(
            <span key={key} className="italic text-zinc-500 dark:text-zinc-400">
              {token}
            </span>,
          );
        } else if (KEYWORDS.has(token)) {
          tokens.push(
            <span key={key} style={{ color }}>
              {token}
            </span>,
          );
        } else if (/^\d+$/.test(token)) {
          tokens.push(
            <span key={key} style={{ color }}>
              {token}
            </span>,
          );
        } else if (/^[{}()[\];:,.=><&|!+*/?-]+$/.test(token)) {
          tokens.push(
            <span key={key} className="text-zinc-500 dark:text-zinc-400">
              {token}
            </span>,
          );
        } else if (/^\s+$/.test(token)) {
          tokens.push(<span key={key}>{token}</span>);
        } else {
          tokens.push(
            <span key={key} className="text-zinc-900 dark:text-zinc-100">
              {token}
            </span>,
          );
        }
      }

      return {
        text: line,
        tokens,
      };
    });
  }, [code, color]);

  return (
    <div className={cn("relative w-full max-w-2xl select-text", className)}>
      {filename && (
        <div className="mb-2 text-xs font-mono text-muted-foreground">
          {filename}
        </div>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-0 right-0 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-border dark:border-white/10 bg-muted/40 dark:bg-white/4 text-muted-foreground dark:text-zinc-400 backdrop-blur-sm transition-colors hover:border-foreground/20 dark:hover:border-white/20 hover:bg-muted dark:hover:bg-white/8 hover:text-foreground dark:hover:text-white cursor-pointer"
        title={copied ? "Copied" : "Copy code"}
      >
        {copied ? (
          <CheckIcon className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
        ) : (
          <CopyIcon className="h-4 w-4" />
        )}
      </button>

      <div className="overflow-x-auto pr-10">
        <div className="font-mono text-[13px] leading-6 sm:text-sm sm:leading-6">
          {lines.map((line, idx) => (
            <div key={idx} className="flex">
              {showLineNumbers && (
                <span className="w-8 shrink-0 select-none text-right pr-6 font-mono text-zinc-400 dark:text-zinc-600">
                  {idx + 1}
                </span>
              )}
              <div className="flex-1 whitespace-pre font-mono">
                {line.tokens.length > 0 ? line.tokens : "\u00A0"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
