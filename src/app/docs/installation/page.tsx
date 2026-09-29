"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckIcon,
  CopyIcon,
  FileTextIcon,
  CodeIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { toast } from "@/registry/ui/toast";

function SnippetBlock({
  code,
  showLines = true,
}: {
  code: string;
  showLines?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const lines = code.trim().split("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group w-full rounded-2xl bg-card/90 dark:bg-[#070709] border border-border/80 dark:border-white/10 p-4 font-mono text-xs text-foreground dark:text-zinc-300 shadow-sm overflow-hidden transition-colors">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-lg bg-muted/60 hover:bg-muted dark:bg-white/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
        title="Copy code"
      >
        {copied ? (
          <CheckIcon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
        ) : (
          <CopyIcon className="w-4 h-4" />
        )}
      </button>

      <div className="overflow-x-auto pr-10 font-mono text-[12px] leading-relaxed">
        {lines.map((line, idx) => (
          <div key={idx} className="flex">
            {showLines && (
              <span className="w-6 shrink-0 select-none text-right pr-4 text-muted-foreground/60 dark:text-zinc-600 font-mono text-[11px]">
                {idx + 1}
              </span>
            )}
            <span className="flex-1 whitespace-pre font-mono text-foreground dark:text-zinc-200">
              {line}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DocsInstallationPage() {
  const [method, setMethod] = useState<"manual" | "cli">("manual");
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const handleCopyMarkdown = async () => {
    const md = `# DevClub UI Installation

## Manual Installation
1. Pick a component from https://ui.devclubxnst.online/components
2. Copy component source into your \`src/components/ui/\` folder
3. Install core dependencies:
\`\`\`bash
npm install clsx tailwind-merge gsap @gsap/react motion
\`\`\`

## CLI Installation
\`\`\`bash
npx @devclubnst/ui add [component]
\`\`\`

## Shadcn Compatibility
\`\`\`bash
npx shadcn@latest add https://ui.devclubxnst.online/r/[component].json
\`\`\`
`;
    await navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    toast.success("Documentation copied as Markdown");
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  return (
    <article className="space-y-12 max-w-2xl font-sans">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
            Installation
          </h1>
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/80 bg-card hover:bg-muted text-xs font-sans text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-xs shrink-0"
          >
            {copiedMarkdown ? (
              <>
                <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <FileTextIcon className="w-3.5 h-3.5" />
                <span>Copy as Markdown</span>
              </>
            )}
          </button>
        </div>

        <p className="text-sm sm:text-[15px] text-muted-foreground font-light leading-relaxed">
          Add DevClub UI components two ways — copy the source by hand, or pull
          them in with a CLI. Your choice is saved and used across the site.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Pick the method
        </h2>
        <div className="inline-flex p-1 rounded-2xl border border-border/80 bg-muted/40 dark:bg-zinc-900/60 shadow-xs">
          <button
            type="button"
            onClick={() => setMethod("manual")}
            className={cn(
              "relative flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-sans font-medium transition-colors cursor-pointer select-none",
              method === "manual"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {method === "manual" && (
              <motion.div
                layoutId="install-method-pill"
                transition={{
                  type: "spring",
                  stiffness: 480,
                  damping: 32,
                  mass: 0.8,
                }}
                className="absolute inset-0 bg-background dark:bg-[#1e1e24] rounded-xl shadow-xs border border-border/60 z-0"
              />
            )}
            <FileTextIcon className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Manual</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod("cli")}
            className={cn(
              "relative flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-sans font-medium transition-colors cursor-pointer select-none",
              method === "cli"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {method === "cli" && (
              <motion.div
                layoutId="install-method-pill"
                transition={{
                  type: "spring",
                  stiffness: 480,
                  damping: 32,
                  mass: 0.8,
                }}
                className="absolute inset-0 bg-background dark:bg-[#1e1e24] rounded-xl shadow-xs border border-border/60 z-0"
              />
            )}
            <CodeIcon className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">CLI</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {method === "manual" ? (
          <motion.div
            key="manual-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
                Steps
              </h2>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Copy a component&apos;s source straight into your project.
              </p>
            </div>

            <section className="space-y-2">
              <h3 className="text-sm font-sans font-medium text-foreground">
                1. Pick a component
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Browse the library, open a component you like, and switch to its{" "}
                <strong className="text-foreground font-medium">Code</strong>{" "}
                tab.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-sans font-medium text-foreground">
                2. Set your stack
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Choose your language and styling below. Every{" "}
                <strong className="text-foreground font-medium">Code</strong>{" "}
                tab across the site updates to match, and your choice is
                remembered on this device.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-card/60 text-xs font-sans font-medium text-foreground shadow-xs">
                  <span className="px-1 py-0.5 rounded text-[10px] font-mono bg-foreground/10 text-foreground font-semibold">
                    TS
                  </span>
                  <span>TypeScript</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-card/60 text-xs font-sans font-medium text-foreground shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Tailwind CSS</span>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-sans font-medium text-foreground">
                3. Copy the code
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                The{" "}
                <strong className="text-foreground font-medium">Code</strong>{" "}
                tab now shows the full source for your selected stack — copy it
                into a new file in your project.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-sans font-medium text-foreground">
                4. Install dependencies & use it
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                If a component relies on external libraries, its{" "}
                <strong className="text-foreground font-medium">Code</strong>{" "}
                tab lists them. Install what it needs:
              </p>

              <SnippetBlock code="npm install clsx tailwind-merge gsap @gsap/react motion" />

              <p className="text-xs text-muted-foreground font-light leading-relaxed pt-2">
                Then import and render it like any other component:
              </p>

              <SnippetBlock
                code={`import { Noise } from "@/components/ui/noise";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Noise mode="grain" alpha={25} />
    </main>
  );
}`}
              />
            </section>

            <section className="space-y-2 pt-4 border-t border-border/60">
              <h3 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
                That&apos;s all!
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                From here on, it&apos;s all about how you integrate the
                component into your project. The code is yours to play around
                with — modify styling, functionality, anything goes!
              </p>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="cli-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
                Steps
              </h2>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Pull components directly into your project using terminal
                commands.
              </p>
            </div>

            <section className="space-y-3">
              <h3 className="text-sm font-sans font-medium text-foreground">
                1. DevClub UI CLI Runner
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Use the official{" "}
                <code className="text-foreground">@devclubnst/ui</code> runner
                to download components straight into your workspace:
              </p>

              <SnippetBlock code="npx @devclubnst/ui add noise" />

              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                You can also add multiple components simultaneously:
              </p>

              <SnippetBlock code="npx @devclubnst/ui add accordion noise animated-counter" />

              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Supports pnpm and bun natively:
              </p>

              <SnippetBlock code="pnpm dlx @devclubnst/ui add noise" />
              <SnippetBlock code="bunx @devclubnst/ui add noise" />
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-sans font-medium text-foreground">
                2. Install via shadcn CLI
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Every DevClub UI component complies with the open shadcn
                registry schema. You can add components with the standard shadcn
                CLI:
              </p>

              <SnippetBlock code="npx shadcn@latest add https://ui.devclubxnst.online/r/noise.json" />

              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Or using the direct unpkg registry link:
              </p>

              <SnippetBlock code="npx shadcn@latest add https://unpkg.com/@devclubnst/ui@latest/public/r/noise.json" />
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-sans font-medium text-foreground">
                3. Component Placement
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Components are automatically written to your{" "}
                <code className="text-foreground">@/components/ui/</code>{" "}
                directory. Peer dependencies are installed automatically.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-border/60">
              <h3 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
                That&apos;s all!
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                The component is now in your codebase with zero runtime wrapper
                overhead. Import and customize as you like!
              </p>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
