import React from "react";
import { CodeBlock } from "@/components/showcase/code-block";

export const metadata = {
  title: "Registry",
  description: "DevClub UI JSON registry schema, REST endpoints, and programmatic distribution.",
};

export default function DocsRegistryPage() {
  return (
    <article className="space-y-10">
      <div className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
          Registry Specification
        </h1>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          DevClub UI distributes components via an open JSON registry specification that can be consumed by CLI tools, automated agents, or custom build pipelines.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          REST Endpoints
        </h2>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          The registry exposes clean REST endpoints to search, filter, and fetch component source code programmatically:
        </p>
        <div className="space-y-3 font-sans">
          <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5 space-y-2 transition-all hover:border-foreground/20 hover:bg-muted/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  GET
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  /api/components
                </span>
              </div>
              <span className="text-xs text-muted-foreground">List Catalog</span>
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Returns all available registry components. Supports query parameters <code className="text-foreground">?category=</code>, <code className="text-foreground">?q=</code>, and <code className="text-foreground">?tag=</code>.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5 space-y-2 transition-all hover:border-foreground/20 hover:bg-muted/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  GET
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  /api/components/[slug]
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Fetch Component Detail</span>
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Returns the complete JSON schema for a single component, including raw TSX source code, dependencies, and metadata.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5 space-y-2 transition-all hover:border-foreground/20 hover:bg-muted/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  GET
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  /r/registry.json
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Shadcn Registry Index</span>
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Open shadcn-compatible schema catalog. Individual components can be installed directly via <code className="text-foreground">npx shadcn@latest add https://devclub.co/r/[name].json</code>.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5 space-y-2 transition-all hover:border-foreground/20 hover:bg-muted/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  GET
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  /api/health
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Health & Diagnostics</span>
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Diagnostic status check returning active component counts and API uptime.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Registry Item Schema
        </h2>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          Each component definition in the registry adheres to the following TypeScript interface:
        </p>
        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5">
          <CodeBlock
            filename="src/types/component.ts"
            language="typescript"
            code={`export interface ComponentRegistryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: "accordion" | "scales" | "buttons" | "cards" | "feedback" | "layout" | "ai-stuff";
  tags: string[];
  dependencies: string[];
  devDependencies?: string[];
  code: string;
  interactiveProps?: Record<string, unknown>;
}`}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Sample Response Payload
        </h2>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          Executing a GET request against <code className="text-foreground">/api/components/noise</code> produces the following response:
        </p>
        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5">
          <CodeBlock
            filename="Response (application/json)"
            language="json"
            code={`{
  "success": true,
  "data": {
    "name": "Noise Generator",
    "slug": "noise",
    "category": "ai-stuff",
    "description": "High-performance Perlin / Simplex procedural grain canvas with GSAP blending.",
    "dependencies": ["gsap", "@gsap/react"],
    "code": "\\"use client\\";\\\\n\\\\nimport React, { useRef, useEffect } from 'react';..."
  },
  "timestamp": "2026-09-23T15:00:00.000Z"
}`}
          />
        </div>
      </section>
    </article>
  );
}
