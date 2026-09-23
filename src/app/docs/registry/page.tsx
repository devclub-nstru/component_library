import React from "react";
import { CodeBlock } from "@/components/showcase/code-block";

export const metadata = {
  title: "Registry",
  description: "DevClub UI JSON registry schema, REST endpoints, and programmatic distribution.",
};

export default function DocsRegistryPage() {
  return (
    <article className="space-y-10">
      <div className="space-y-2 border-b border-white/10 pb-6">
        <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-white">
          Registry Specification
        </h1>
        <p className="text-xs sm:text-[13px] text-zinc-400 font-light leading-relaxed">
          DevClub UI distributes components via an open JSON registry specification that can be consumed by CLI tools, automated agents, or custom build pipelines.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-white">
          REST Endpoints
        </h2>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">
          The registry exposes clean REST endpoints to search, filter, and fetch component source code programmatically:
        </p>
        <div className="space-y-2.5 font-mono">
          <div className="p-3 border border-white/10 bg-black/60 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold">GET /api/components</span>
              <span className="text-zinc-500 text-[10px]">List Catalog</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans font-light">
              Returns all available registry components. Supports query parameters <code className="text-zinc-200">?category=</code>, <code className="text-zinc-200">?q=</code>, and <code className="text-zinc-200">?tag=</code>.
            </p>
          </div>

          <div className="p-3 border border-white/10 bg-black/60 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold">GET /api/components/[slug]</span>
              <span className="text-zinc-500 text-[10px]">Fetch Component Detail</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans font-light">
              Returns the complete JSON schema for a single component, including raw TSX source code, dependencies, and metadata.
            </p>
          </div>

          <div className="p-3 border border-white/10 bg-black/60 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold">GET /api/health</span>
              <span className="text-zinc-500 text-[10px]">Health & Diagnostics</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans font-light">
              Diagnostic status check returning active component counts and API uptime.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-white">
          Registry Item Schema
        </h2>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">
          Each component definition in the registry adheres to the following TypeScript interface:
        </p>
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
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-white">
          Sample Response Payload
        </h2>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">
          Executing a GET request against <code className="text-white">/api/components/noise</code> produces the following response:
        </p>
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
    "code": "\"use client\";\\n\\nimport React, { useRef, useEffect } from 'react';..."
  },
  "timestamp": "2026-09-23T15:00:00.000Z"
}`}
        />
      </section>
    </article>
  );
}
