import React from "react";
import { CodeBlock } from "@/components/showcase/code-block";

export const metadata = {
  title: "Theming",
  description:
    "Monochromatic design tokens, CSS variables, and Tailwind CSS v4 theme integration.",
};

const THEME_TOKENS = [
  {
    token: "--background",
    value: "#050505",
    usage: "Main application background canvas",
  },
  {
    token: "--foreground",
    value: "#f4f4f5",
    usage: "High-contrast text and active icons",
  },
  {
    token: "--muted",
    value: "#18181b",
    usage: "Muted background for chips, inputs, code panels",
  },
  {
    token: "--muted-foreground",
    value: "#a1a1aa",
    usage: "Secondary metadata and caption text",
  },
  {
    token: "--border",
    value: "rgba(255,255,255,0.12)",
    usage: "Primary bounding borders for cards and sections",
  },
  {
    token: "--border-subtle",
    value: "rgba(255,255,255,0.08)",
    usage: "Subtle inner dividers and secondary gridlines",
  },
  {
    token: "--border-hairline",
    value: "rgba(255,255,255,0.16)",
    usage: "High-precision edge highlights and rulers",
  },
  {
    token: "--panel",
    value: "#151517",
    usage: "Elevated dialogs, floating toolbars, and studios",
  },
  {
    token: "--line",
    value: "rgba(255,255,255,0.08)",
    usage: "Architectural blueprint and grid lines",
  },
];

export default function DocsThemingPage() {
  return (
    <article className="space-y-10">
      <div className="space-y-2 border-b border-white/10 pb-6">
        <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-white">
          Theming
        </h1>
        <p className="text-xs sm:text-[13px] text-zinc-400 font-light leading-relaxed">
          DevClub UI employs an architectural, monochromatic design system
          engineered for high visual fidelity, laser-sharp contrast, and
          dark-mode precision.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-white">
          CSS Design Tokens
        </h2>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">
          All components reference semantic CSS variables declared on the root
          element. Below is the reference table of core palette tokens:
        </p>
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-white/5 border-b border-white/10 text-zinc-400">
              <tr>
                <th className="p-2.5">Variable</th>
                <th className="p-2.5">Default Value</th>
                <th className="p-2.5">Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {THEME_TOKENS.map((item) => (
                <tr key={item.token} className="hover:bg-white/2">
                  <td className="p-2.5 font-semibold text-white">
                    {item.token}
                  </td>
                  <td className="p-2.5 text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-block w-3 h-3 border border-white/20"
                        style={{ backgroundColor: item.value }}
                      />
                      <span>{item.value}</span>
                    </div>
                  </td>
                  <td className="p-2.5 font-sans font-light text-zinc-400">
                    {item.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-white">
          Tailwind CSS v4 Integration
        </h2>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">
          Tailwind CSS v4 introduces the native{" "}
          <code className="text-white">@theme inline</code> block, replacing the
          legacy tailwind.config.js file with direct CSS token mappings:
        </p>
        <CodeBlock
          filename="src/app/globals.css"
          language="css"
          code={`@import "tailwindcss";

:root {
  --background: #050505;
  --foreground: #f4f4f5;
  --border: rgba(255, 255, 255, 0.12);
  --muted: #18181b;
  --muted-foreground: #a1a1aa;
  --panel: #151517;
  --line: rgb(255 255 255 / 0.08);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-border: var(--border);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-panel: var(--panel);
  --color-line: var(--line);
}`}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-white">
          Hairline Border Aesthetics
        </h2>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">
          Rather than relying on heavy solid borders, DevClub UI employs
          alpha-transparent hairline borders (
          <code className="text-zinc-200">border border-white/10</code>,{" "}
          <code className="text-zinc-200">border-white/15</code>). This ensures
          elements nest cleanly without visual competition.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-white">
          Accessibility & Contrast
        </h2>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">
          Foreground tokens (<code className="text-zinc-200">#f4f4f5</code> on{" "}
          <code className="text-zinc-200">#050505</code>) meet WCAG AAA
          standards with a contrast ratio exceeding 18:1. Muted text (
          <code className="text-zinc-200">#a1a1aa</code>) meets WCAG AA
          standards with a ratio exceeding 5.2:1.
        </p>
      </section>
    </article>
  );
}
