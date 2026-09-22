import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CodeBlock } from "@/components/showcase/code-block";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#f4f4f5]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col gap-4 mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest bg-white/10 text-white border border-white/20">
              Open Source v0.1.0
            </span>
            <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
              MIT Licensed
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-white">
            Developer Documentation
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl font-light leading-relaxed">
            Architectural reference, design system token configuration, WebGL fragment shader guidelines, GSAP animation lifecycle rules, and REST API specifications for DevClub UI.
          </p>
        </div>

        <div className="space-y-16">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-zinc-500">01</span>
              <h2 className="text-xl font-mono uppercase tracking-wider text-white">Core Dependencies</h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              DevClub UI components rely on lightweight utility libraries for class merging, unstyled primitives, and hardware-accelerated animations:
            </p>
            <div className="border border-white/15 bg-black/80 p-4 font-mono text-xs text-zinc-200">
              npm install clsx tailwind-merge @radix-ui/react-icons gsap @gsap/react ogl motion
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-zinc-500">02</span>
              <h2 className="text-xl font-mono uppercase tracking-wider text-white">Class Merging Utility</h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              Create a helper function to merge Tailwind CSS classes cleanly without class conflicts:
            </p>
            <CodeBlock
              filename="src/lib/utils.ts"
              code={`import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}
            />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-zinc-500">03</span>
              <h2 className="text-xl font-mono uppercase tracking-wider text-white">Configure CSS Design Tokens</h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              Add monochromatic variables and pattern stroke tokens to your global stylesheet (`src/app/globals.css`):
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
  --pattern: rgba(255, 255, 255, 0.05);
}

@layer base {
  body {
    background-color: var(--background);
    color: var(--foreground);
  }
}`}
            />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-zinc-500">04</span>
              <h2 className="text-xl font-mono uppercase tracking-wider text-white">GSAP & WebGL Guidelines</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-white/10 bg-zinc-950/60 p-5 space-y-3">
                <h3 className="text-sm font-mono text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  GSAP Context Scoping
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Always wrap React component animations inside `@gsap/react` `useGSAP()` or `gsap.context()`. This guarantees automatic cleanup of tweens, timelines, and ScrollTriggers on unmount.
                </p>
              </div>
              <div className="border border-white/10 bg-zinc-950/60 p-5 space-y-3">
                <h3 className="text-sm font-mono text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  WebGL Shader Performance
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  WebGL shaders (e.g. `dither`, `ai-orb`) feature DPR resolution capping (`Math.min(dpr, 2)`), visibility observers to pause frame loops when hidden, and WebGL memory context cleanup on unmount.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-zinc-500">05</span>
              <h2 className="text-xl font-mono uppercase tracking-wider text-white">REST API Reference</h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              DevClub UI provides REST endpoints to query component metadata, source code, and health status programmatically:
            </p>
            <div className="space-y-3 font-mono">
              <div className="p-4 border border-white/10 bg-black/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold">GET /api/components</span>
                  <span className="text-zinc-500 text-[11px]">List & Filter Component Catalog</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans">
                  Query parameters: <code className="text-zinc-200">category</code>, <code className="text-zinc-200">tag</code>, <code className="text-zinc-200">query</code>
                </p>
              </div>

              <div className="p-4 border border-white/10 bg-black/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold">GET /api/components/[slug]</span>
                  <span className="text-zinc-500 text-[11px]">Get Source Code & Specs</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans">
                  Returns TSX source code, props schema, physics engine details, and accessibility rules.
                </p>
              </div>

              <div className="p-4 border border-white/10 bg-black/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold">GET /api/health</span>
                  <span className="text-zinc-500 text-[11px]">System Status & Uptime</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans">
                  System diagnostic endpoint returning API version and active component count.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-zinc-500">06</span>
              <h2 className="text-xl font-mono uppercase tracking-wider text-white">Open Source License & Attribution</h2>
            </div>
            <div className="p-6 border border-white/10 bg-zinc-950/80 space-y-3">
              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                DevClub UI is licensed under the permissive <strong className="text-white">MIT License</strong>. You are free to use, modify, distribute, and integrate these components into personal, commercial, or open-source projects without restriction.
              </p>
              <p className="text-xs text-zinc-500 font-mono">
                Copyright (c) 2026 DevClub (Heyykrishnna / dev-club-components)
              </p>
            </div>
          </section>

          <div className="pt-8 border-t border-white/10 flex justify-between items-center font-mono">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              ← Home
            </Link>
            <Link
              href="/components"
              className="inline-flex items-center gap-1.5 text-xs text-white hover:underline transition-colors"
            >
              <span>Explore All 21+ Components</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
