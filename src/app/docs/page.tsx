import React from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@radix-ui/react-icons";

export const metadata = {
  title: "Introduction",
  description: "DevClub UI philosophy, architecture, and high-performance design principles.",
};

export default function DocsIntroductionPage() {
  return (
    <article className="space-y-10">
      <div className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
          Introduction
        </h1>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          DevClub UI is an open-source collection of class-crafted, physics-driven interface components and micro-interactions built with Next.js, Tailwind CSS v4, GSAP, and WebGL.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Philosophy
        </h2>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          Modern web applications often suffer from visual uniformity and heavy abstraction layers. DevClub UI was engineered around three core tenets:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <div className="border border-border bg-card p-3.5 space-y-1.5">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-foreground">
              01. Copy-Paste Freedom
            </h3>
            <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
              You own the code. No obscure node_modules wrappers. Copy the component source into your workspace, customize every bezier curve and DOM node to your product needs.
            </p>
          </div>
          <div className="border border-border bg-card p-3.5 space-y-1.5">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-foreground">
              02. Physics & Shaders
            </h3>
            <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
              Components are infused with GSAP-powered inertial animations, tactile haptics, and WebGL canvas shaders that operate on the GPU at 60+ FPS.
            </p>
          </div>
          <div className="border border-border bg-card p-3.5 space-y-1.5">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-emerald-500 dark:text-emerald-400">
              03. Agent-Ready
            </h3>
            <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
              Formatted with strict TypeScript schemas, structured registry endpoints, and dedicated AI Agent Skills for Claude Code, Cursor, and Antigravity.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Why not an npm package?
        </h2>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          Component libraries distributed through bloated npm bundles inevitably force you into rigid API constraints, version locks, and CSS override struggles. By adopting a registry distribution model:
        </p>
        <ul className="space-y-2 text-[11px] text-muted-foreground font-light">
          <li className="flex items-start gap-2">
            <CheckIcon className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>Zero build bloat: only include the exact components and animations your project uses.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>Direct code ownership: adjust shader uniforms, easing timings, or markup without submitting pull requests to third-party repos.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>Seamless AI agent pair programming: coding assistants can read, refactor, and extend raw component files with full semantic awareness.</span>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2.5 font-light">
          <div className="border border-border bg-card p-3.5 space-y-1">
            <h3 className="text-xs font-sans font-medium text-foreground">
              Can I use DevClub UI in commercial projects?
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Yes. DevClub UI is published under the MIT license. You can freely use, modify, and distribute the components in SaaS applications, client work, and enterprise platforms without fee or restriction.
            </p>
          </div>
          <div className="border border-border bg-card p-3.5 space-y-1">
            <h3 className="text-xs font-sans font-medium text-foreground">
              Which frameworks are supported?
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Components are written in React 19 / TypeScript and styled with Tailwind CSS v4. They are drop-in compatible with Next.js (App Router), Remix, Vite, Astro, and Gatsby.
            </p>
          </div>
          <div className="border border-border bg-card p-3.5 space-y-1">
            <h3 className="text-xs font-sans font-medium text-foreground">
              How does it compare to shadcn/ui?
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              DevClub UI embraces the same registry copy-paste philosophy as shadcn/ui, but specializes in boutique, visceral interactions: WebGL fragment shaders, GSAP physics transitions, and editorial monochromatic styling.
            </p>
          </div>
        </div>
      </section>

      <div className="p-3.5 border border-border bg-card flex items-center justify-between">
        <div>
          <h3 className="text-xs font-sans font-medium text-foreground">Ready to get started?</h3>
          <p className="text-[11px] text-muted-foreground font-light">Set up your workspace with our step-by-step installation guide.</p>
        </div>
        <Link
          href="/docs/installation"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          <span>Installation</span>
          <ArrowRightIcon className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}
