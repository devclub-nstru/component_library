import React from "react";
import { CodeBlock } from "@/components/showcase/code-block";

export const metadata = {
  title: "Installation",
  description: "How to install dependencies and configure DevClub UI in your Next.js project.",
};

export default function DocsInstallationPage() {
  return (
    <article className="space-y-10">
      <div className="space-y-2 border-b border-white/10 pb-6">
        <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-white">
          Installation
        </h1>
        <p className="text-xs sm:text-[13px] text-zinc-400 font-light leading-relaxed">
          How to install required dependencies, set up utility helpers, and configure design tokens in your project.
        </p>
      </div>

      <div className="space-y-8">
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 border border-white/20 font-mono text-[11px] text-white bg-white/5">
              1
            </span>
            <h2 className="text-sm sm:text-base font-mono uppercase tracking-wider text-white">
              Install Core Dependencies
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            DevClub UI components rely on a curated set of battle-tested primitives for class merging, unstyled primitives, GSAP animations, and WebGL rendering:
          </p>
          <CodeBlock
            filename="Terminal"
            language="bash"
            code="npm install clsx tailwind-merge @radix-ui/react-icons gsap @gsap/react ogl motion"
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 border border-white/20 font-mono text-[11px] text-white bg-white/5">
              2
            </span>
            <h2 className="text-sm sm:text-base font-mono uppercase tracking-wider text-white">
              Add Class Utility (cn)
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Create a helper utility to reliably merge Tailwind CSS utility classes and resolve conflicts cleanly:
          </p>
          <CodeBlock
            filename="src/lib/utils.ts"
            language="typescript"
            code={`import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 border border-white/20 font-mono text-[11px] text-white bg-white/5">
              3
            </span>
            <h2 className="text-sm sm:text-base font-mono uppercase tracking-wider text-white">
              Configure Tailwind CSS & CSS Tokens
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Add the monochromatic design tokens, hairline borders, and surface variables to your global stylesheet:
          </p>
          <CodeBlock
            filename="src/app/globals.css"
            language="css"
            code={`@import "tailwindcss";

:root {
  --background: #050505;
  --foreground: #f4f4f5;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-hairline: rgba(255, 255, 255, 0.16);
  --pattern-line: rgba(255, 255, 255, 0.10);
  --border: rgba(255, 255, 255, 0.12);
  --muted: #18181b;
  --muted-foreground: #a1a1aa;
  --panel: #151517;
  --line: rgb(255 255 255 / 0.08);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-border: var(--border);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-panel: var(--panel);
  --color-line: var(--line);
}

body {
  background: var(--background);
  color: var(--foreground);
}`}
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 border border-white/20 font-mono text-[11px] text-white bg-white/5">
              4
            </span>
            <h2 className="text-sm sm:text-base font-mono uppercase tracking-wider text-white">
              Verify Your First Component
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Grab any component from our registry (such as the Dotted Accordion, AI Orb, or Proximity Sidebar) and drop it directly into your components folder. Test it inside any page:
          </p>
          <CodeBlock
            filename="src/app/page.tsx"
            language="tsx"
            code={`import { DottedAccordion } from "@/components/ui/dotted-accordion";

export default function Page() {
  return (
    <div className="p-8 max-w-xl mx-auto">
      <DottedAccordion items={[{ title: "Getting Started", content: "DevClub UI installed successfully." }]} />
    </div>
  );
}`}
          />
        </section>
      </div>
    </article>
  );
}
