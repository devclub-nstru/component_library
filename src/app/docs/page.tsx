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

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-3 mb-10 border-b border-white/8 pb-8">
          <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white">
            Getting Started
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl font-light leading-relaxed">
            Configure design tokens, inspect architectural primitives, and integrate components into your Next.js application.
          </p>
        </div>

        <div className="space-y-12">
          <section className="space-y-4">
            <h2 className="text-lg font-mono uppercase tracking-wider text-white">1. Core Dependencies</h2>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              DevClub components rely on lightweight utility packages:
            </p>
            <div className="border border-white/15 bg-black/60 p-4 font-mono text-xs text-zinc-200">
              npm install clsx tailwind-merge @radix-ui/react-icons
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-mono uppercase tracking-wider text-white">2. Class Utility</h2>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Create a helper function to merge Tailwind classes cleanly:
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
            <h2 className="text-lg font-mono uppercase tracking-wider text-white">3. Configure CSS Tokens</h2>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Add monochromatic variables to your global stylesheet:
            </p>
            <CodeBlock
              filename="src/app/globals.css"
              language="css"
              code={`:root {
  --background: #050505;
  --foreground: #f4f4f5;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-hairline: rgba(255, 255, 255, 0.16);
  --pattern-line: rgba(255, 255, 255, 0.1);
}`}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-mono uppercase tracking-wider text-white">4. API Endpoints</h2>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Query components and status programmatically:
            </p>
            <div className="space-y-2 font-mono">
              <div className="flex items-center justify-between p-3 border border-white/10 bg-black/40 text-xs">
                <span className="text-zinc-200">GET /api/components</span>
                <span className="text-zinc-500">List all library components</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-white/10 bg-black/40 text-xs">
                <span className="text-zinc-200">GET /api/components/[slug]</span>
                <span className="text-zinc-500">Get specific component code & props</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-white/10 bg-black/40 text-xs">
                <span className="text-zinc-200">GET /api/health</span>
                <span className="text-zinc-500">Health and status check</span>
              </div>
            </div>
          </section>

          <div className="pt-6 border-t border-white/8 flex justify-between items-center font-mono">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/components"
              className="inline-flex items-center gap-1.5 text-xs text-white hover:underline transition-colors"
            >
              <span>Explore Components</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
