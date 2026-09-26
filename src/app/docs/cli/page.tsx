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

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Adding Components
        </h2>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          Use the <code className="text-foreground">add</code> command to fetch components and automatically write them to your local project directory:
        </p>
        <CodeBlock
          filename="Terminal"
          language="bash"
          code="npx devclub add noise"
        />
        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          You can add multiple components simultaneously:
        </p>
        <CodeBlock
          filename="Terminal"
          language="bash"
          code="npx devclub add dotted-accordion ai-orb proximity-sidebar"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Direct Curl & Fetch Workflow
        </h2>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          If you prefer working without an npm runner, you can stream source code directly from our public registry REST API into your workspace:
        </p>
        <CodeBlock
          filename="Terminal"
          language="bash"
          code="curl -s https://devclub.co/api/components/noise | jq -r '.data.code' > src/components/ui/noise.tsx"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Component File Structure
        </h2>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          Every component created by the CLI follows a predictable, atomic architecture:
        </p>
        <CodeBlock
          filename="File Tree"
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
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Zero Lock-In
        </h2>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          Once a component is placed into your directory, it contains zero references to DevClub runtime servers. It is 100% self-contained TypeScript and Tailwind CSS code under your git version control.
        </p>
      </section>
    </article>
  );
}
