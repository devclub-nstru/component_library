import React from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@radix-ui/react-icons";

export const metadata = {
  title: "Introduction",
  description: "DevClub UI philosophy, architecture, and high-performance design principles.",
};

export default function DocsIntroductionPage() {
  return (
    <article className="space-y-12 max-w-2xl font-sans">
      <div className="space-y-3 pb-6 border-b border-border/60">
        <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
          Introduction
        </h1>
        <p className="text-sm sm:text-[15px] text-muted-foreground font-light leading-relaxed">
          DevClub UI is an open-source library of physics-driven interface
          primitives and animated micro-interactions built with Next.js, Tailwind
          CSS v4, GSAP, and WebGL.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Design Principles
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
          Modern web interfaces often suffer from visual uniformity. DevClub UI
          was engineered around three core tenets:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <div className="rounded-2xl border border-border/80 bg-card/50 p-4 space-y-2 shadow-xs">
            <span className="text-xs font-sans font-semibold text-foreground">
              01. Code Ownership
            </span>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              No black-box node_modules wrappers. Copy the source into your
              components folder and customize every curve, easing, and layout node.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/50 p-4 space-y-2 shadow-xs">
            <span className="text-xs font-sans font-semibold text-foreground">
              02. Physics & Shaders
            </span>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Infused with GSAP-powered inertial springs, tactile feedback, and
              WebGL GPU shaders engineered for 60+ FPS fluid motion.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/50 p-4 space-y-2 shadow-xs">
            <span className="text-xs font-sans font-semibold text-emerald-500 dark:text-emerald-400">
              03. Agent-Ready
            </span>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Full TypeScript schemas, shadcn registry compliance, and curated
              LLM skills for Claude Code, Cursor, and Antigravity.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Flexible Distribution
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
          Choose the workflow that fits your team:
        </p>

        <div className="space-y-2.5">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-border/80 bg-card/40">
            <div className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
              <CheckIcon className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-sans font-medium text-foreground">
                DevClub CLI:
              </span>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Run <code className="text-foreground">npx @devclubnst/ui add [name]</code> to scaffold component source directly into your workspace.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-border/80 bg-card/40">
            <div className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
              <CheckIcon className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-sans font-medium text-foreground">
                Shadcn CLI:
              </span>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Add directly via registry URL with <code className="text-foreground">npx shadcn@latest add https://ui.devclubxnst.online/r/[name].json</code>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-border/80 bg-card/40">
            <div className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
              <CheckIcon className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-sans font-medium text-foreground">
                Manual Copy & Paste:
              </span>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Open any component studio, click the Code tab, copy the clean TSX source, and paste it straight into your project.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          <div className="rounded-2xl border border-border/80 bg-card/50 p-4 space-y-1.5 shadow-xs">
            <h3 className="text-xs sm:text-sm font-sans font-medium text-foreground">
              Can I use DevClub UI in commercial projects?
            </h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Yes. DevClub UI is published under the MIT license. You can freely use,
              modify, and distribute components in SaaS applications, client work,
              and enterprise products.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/50 p-4 space-y-1.5 shadow-xs">
            <h3 className="text-xs sm:text-sm font-sans font-medium text-foreground">
              Which frameworks are supported?
            </h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Components are written in React 19 / TypeScript and styled with
              Tailwind CSS v4. They are drop-in compatible with Next.js (App
              Router), Remix, Vite, Astro, and Gatsby.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/50 p-4 space-y-1.5 shadow-xs">
            <h3 className="text-xs sm:text-sm font-sans font-medium text-foreground">
              How does it integrate with shadcn/ui?
            </h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              DevClub UI adheres to the official shadcn registry item schema. You
              can use both libraries seamlessly side-by-side in the same
              project directory.
            </p>
          </div>
        </div>
      </section>

      <div className="p-5 rounded-2xl border border-border/80 bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h3 className="text-sm font-sans font-medium text-foreground">
            Ready to get started?
          </h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Follow our clean installation guide to start using components in minutes.
          </p>
        </div>
        <Link
          href="/docs/installation"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans font-medium bg-foreground text-background hover:opacity-90 transition-opacity self-start sm:self-auto shrink-0 shadow-xs"
        >
          <span>Installation Guide</span>
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
