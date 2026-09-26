import React from "react";
import { CodeBlock } from "@/components/showcase/code-block";

export const metadata = {
  title: "Installation",
  description: "How to install dependencies and configure DevClub UI in your Next.js project.",
};

export default function DocsInstallationPage() {
  return (
    <article className="space-y-10">
      <div className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
          Installation
        </h1>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          How to install required dependencies, set up utility helpers, and configure design tokens in your project.
        </p>
      </div>

      <div className="space-y-8">
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 border border-border font-mono text-[11px] text-foreground bg-foreground/5">
              1
            </span>
            <h2 className="text-sm sm:text-base font-mono uppercase tracking-wider text-foreground">
              Install Core Dependencies
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
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
            <span className="flex items-center justify-center w-5 h-5 border border-border font-mono text-[11px] text-foreground bg-foreground/5">
              2
            </span>
            <h2 className="text-sm sm:text-base font-mono uppercase tracking-wider text-foreground">
              Add Class Utility (cn)
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
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
            <span className="flex items-center justify-center w-5 h-5 border border-border font-mono text-[11px] text-foreground bg-foreground/5">
              3
            </span>
            <h2 className="text-sm sm:text-base font-mono uppercase tracking-wider text-foreground">
              Configure Tailwind CSS & CSS Tokens
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Add the design tokens, hairline borders, and surface variables to your global stylesheet:
          </p>
          <CodeBlock
            filename="src/app/globals.css"
            language="css"
            code={`@import "tailwindcss";

:root {
  --background: #fdfdfd;
  --foreground: #09090b;
  --border: rgba(0, 0, 0, 0.12);
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
}

.dark {
  --background: #050505;
  --foreground: #f4f4f5;
  --border: rgba(255, 255, 255, 0.12);
  --muted: #18181b;
  --muted-foreground: #a1a1aa;
}`}
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 border border-border font-mono text-[11px] text-foreground bg-foreground/5">
              4
            </span>
            <h2 className="text-sm sm:text-base font-mono uppercase tracking-wider text-foreground">
              Verify Your First Component
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
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
