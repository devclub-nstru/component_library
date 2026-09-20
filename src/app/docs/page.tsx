import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CodeBlock } from "@/components/showcase/code-block";
import { GlowingBadge } from "@/registry/ui/glowing-badge";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-3 mb-10">
          <GlowingBadge variant="blue">Documentation</GlowingBadge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-heading">
            Getting Started
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl font-light leading-relaxed">
            Learn how to set up DevClub UI components, configure design tokens, and integrate them into your Next.js application.
          </p>
        </div>

        <div className="space-y-12">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">1. Core Dependencies</h2>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              DevClub components rely on lightweight utility packages for class merging and icons:
            </p>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 font-mono text-xs text-zinc-200">
              npm install clsx tailwind-merge @radix-ui/react-icons hugeicons-react
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">2. Setup Class Utility</h2>
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
            <h2 className="text-xl font-semibold text-white">3. Configure CSS Tokens</h2>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Add the following CSS custom variables to your global stylesheet (e.g., globals.css):
            </p>
            <CodeBlock
              filename="src/app/globals.css"
              language="css"
              code={`:root {
  --bg-primary: #09090b;
  --bg-card: #0f1015;
  --border-primary: rgba(255, 255, 255, 0.1);
  --border-accent: rgba(59, 130, 246, 0.4);
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --accent-glow: rgba(59, 130, 246, 0.16);
  --pattern: rgba(255, 255, 255, 0.08);
  --pattern-line: rgba(255, 255, 255, 0.12);
  --font-heading: var(--font-geist-sans), sans-serif;
}`}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">4. REST API Integration</h2>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Programmatically query available components, versions, and code snippets through built-in API endpoints:
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/40 text-xs">
                <span className="font-mono text-emerald-400">GET /api/components</span>
                <span className="text-zinc-500">List all library components</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/40 text-xs">
                <span className="font-mono text-emerald-400">GET /api/components/[slug]</span>
                <span className="text-zinc-500">Get specific component code & props</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/40 text-xs">
                <span className="font-mono text-emerald-400">GET /api/health</span>
                <span className="text-zinc-500">Health and status check</span>
              </div>
            </div>
          </section>

          <div className="pt-6 border-t border-zinc-900 flex justify-between items-center">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/components"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
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
