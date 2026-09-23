import React from "react";
import { CodeBlock } from "@/components/showcase/code-block";

export const metadata = {
  title: "Agent Skills",
  description: "Curated AI Agent Skills for Claude Code, Cursor, Antigravity, and Copilot.",
};

const SKILL_MODULES = [
  { name: "gsap-core", purpose: "gsap.to(), from(), easing, duration, stagger, matchMedia for responsive animations." },
  { name: "gsap-timeline", purpose: "gsap.timeline(), sequenced keyframes, playback control, choreographies." },
  { name: "gsap-scrolltrigger", purpose: "Scroll-linked scrub animations, pinning sections, cleanup on unmount." },
  { name: "gsap-react", purpose: "useGSAP hook, context scoping, SSR safety, React 19 lifecycle compatibility." },
  { name: "gsap-performance", purpose: "GPU-accelerated transforms, will-change, 60fps jank prevention." },
  { name: "gsap-plugins", purpose: "Draggable, Inertia, SplitText, ScrambleText, and SVG physics modules." },
];

export default function DocsSkillsPage() {
  return (
    <article className="space-y-10">
      <div className="space-y-2 border-b border-white/10 pb-6">
        <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-white">
          Agent Skills
        </h1>
        <p className="text-xs sm:text-[13px] text-zinc-400 font-light leading-relaxed">
          Specialized prompt rules, API schemas, and animation constraints that empower AI coding assistants to write and maintain DevClub UI code with 100% architectural fidelity.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-white">
          What are Agent Skills?
        </h2>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">
          Agent Skills are modular instruction sets recognized by modern agentic development environments like Claude Code, Cursor, Antigravity, and GitHub Copilot. Instead of generic hallucinations, skills provide your agent with exact design tokens, GSAP lifecycle rules, and WebGL cleanup patterns.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-white">
          Included GSAP Skill Index
        </h2>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">
          DevClub UI ships with built-in skills indexed via <code className="text-white">skills/llms.txt</code>. When pair-programming with an agent, it reads these skills before generating animations:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {SKILL_MODULES.map((skill) => (
            <div key={skill.name} className="p-3 border border-white/10 bg-zinc-950/60 space-y-1">
              <span className="font-mono text-[11px] text-emerald-400 font-semibold">{skill.name}</span>
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed">{skill.purpose}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-white">
          llms.txt Agent Discovery
        </h2>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">
          The <code className="text-white">skills/llms.txt</code> index defines trigger keywords and capabilities for every animation module:
        </p>
        <CodeBlock
          filename="skills/llms.txt"
          language="markdown"
          code={`# GSAP Skills — Index for AI Agents

gsap-core
  Core API: gsap.to(), from(), fromTo(), easing, duration, stagger, gsap.matchMedia().

gsap-react
  React: useGSAP hook, refs, gsap.context(), automatic unmount cleanup, SSR safety.

gsap-performance
  Performance: transforms, will-change, batching, GPU optimization.`}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-white">
          Using with Cursor & Claude Code
        </h2>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">
          Add DevClub guidelines to your project&apos;s agent rules (<code className="text-white">.cursorrules</code>, <code className="text-white">CLAUDE.md</code>, or <code className="text-white">AGENTS.md</code>):
        </p>
        <CodeBlock
          filename="AGENTS.md"
          language="markdown"
          code={`When generating or modifying DevClub UI components:
1. Always inspect the skills/ directory before writing animations.
2. Wrap React animations in @gsap/react useGSAP() or gsap.context().
3. Never use raw setInterval or CSS keyframes when GSAP covers the behavior.
4. Strictly follow monochromatic CSS tokens (--background, --foreground, --border).`}
        />
      </section>
    </article>
  );
}
