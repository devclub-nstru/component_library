import React from "react";
import { CodeBlock } from "@/components/showcase/code-block";

export const metadata = {
  title: "CLI",
  description: "DevClub command-line interface and direct registry installation workflows.",
};

export default function DocsCliPage() {
  return (
    <article className="space-y-10">
      <div className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
          Command Line Interface
        </h1>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          Add components, initialize project configs, and synchronize registry items directly from your terminal.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-sans font-medium">
            1
          </span>
          <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
            Quick Installation via CLI
          </h2>
        </div>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          DevClub UI components can be installed directly into your local codebase using either the dedicated package runner or the universal shadcn CLI:
        </p>

        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-medium text-foreground">
              Official Package CLI
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Recommended
            </span>
          </div>
          <CodeBlock
            filename="Terminal"
            language="bash"
            code="npx @devclubnst/ui add noise"
          />
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-medium text-foreground">
              Universal Shadcn Registry
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium bg-muted text-muted-foreground border border-border">
              Remote JSON
            </span>
          </div>
          <CodeBlock
            filename="Terminal"
            language="bash"
            code="npx shadcn@latest add https://devclub.co/r/noise.json"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-sans font-medium">
            2
          </span>
          <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
            Batch Installation
          </h2>
        </div>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          Install multiple components in a single execution to scaffold complete application views:
        </p>
        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5">
          <CodeBlock
            filename="Terminal"
            language="bash"
            code="npx @devclubnst/ui add dotted-accordion ai-orb proximity-sidebar pixel-card"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-sans font-medium">
            3
          </span>
          <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
            Component File Structure
          </h2>
        </div>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          Every component created by the CLI follows a predictable, atomic architecture inside your project:
        </p>
        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5">
          <CodeBlock
            filename="Project Tree"
            language="text"
            code={`src/
├── components/
│   └── ui/
│       ├── dotted-accordion.tsx
│       ├── ai-orb.tsx
│       ├── proximity-sidebar.tsx
│       └── noise.tsx
└── lib/
    └── utils.ts`}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border/80 bg-card/40 p-5 sm:p-6 space-y-2">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Zero Lock-In
        </h2>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          Once a component is placed into your directory, it contains zero references to external runtime servers. It is 100% self-contained TypeScript and Tailwind CSS code under your git version control.
        </p>
      </section>
    </article>
  );
}
