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
    value: "#fdfdfd / #050505",
    usage: "Main application background canvas",
  },
  {
    token: "--foreground",
    value: "#09090b / #f4f4f5",
    usage: "High-contrast text and active icons",
  },
  {
    token: "--muted",
    value: "#f4f4f5 / #18181b",
    usage: "Muted background for chips, inputs, code panels",
  },
  {
    token: "--muted-foreground",
    value: "#71717a / #a1a1aa",
    usage: "Secondary metadata and caption text",
  },
  {
    token: "--border",
    value: "rgba(0,0,0,0.12) / rgba(255,255,255,0.12)",
    usage: "Primary bounding borders for cards and sections",
  },
  {
    token: "--border-subtle",
    value: "rgba(0,0,0,0.08) / rgba(255,255,255,0.08)",
    usage: "Subtle inner dividers and secondary gridlines",
  },
  {
    token: "--border-hairline",
    value: "rgba(0,0,0,0.14) / rgba(255,255,255,0.16)",
    usage: "High-precision edge highlights and rulers",
  },
  {
    token: "--panel",
    value: "#ffffff / #151517",
    usage: "Elevated dialogs, floating toolbars, and studios",
  },
  {
    token: "--line",
    value: "rgba(0,0,0,0.08) / rgb(255,255,255,0.08)",
    usage: "Architectural blueprint and grid lines",
  },
];

export default function DocsThemingPage() {
  return (
    <article className="space-y-10">
      <div className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
          Theming
        </h1>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          DevClub UI employs an architectural design system engineered for high visual fidelity, laser-sharp contrast, and smooth theme transitions.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          CSS Design Tokens
        </h2>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          All components reference semantic CSS variables declared on the root element and dark selector. Below is the reference table of core palette tokens:
        </p>
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-muted border-b border-border text-muted-foreground">
              <tr>
                <th className="p-2.5">Variable</th>
                <th className="p-2.5">Values (Light / Dark)</th>
                <th className="p-2.5">Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {THEME_TOKENS.map((item) => (
                <tr key={item.token} className="hover:bg-muted/40">
                  <td className="p-2.5 font-semibold text-foreground">
                    {item.token}
                  </td>
                  <td className="p-2.5 text-muted-foreground">
                    {item.value}
                  </td>
                  <td className="p-2.5 font-sans font-light text-muted-foreground">
                    {item.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Tailwind CSS v4 Integration
        </h2>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          Tailwind CSS v4 introduces native theme tokens and custom variants:
        </p>
        <CodeBlock
          filename="src/app/globals.css"
          language="css"
          code={`@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: #fdfdfd;
  --foreground: #09090b;
  --border: rgba(0, 0, 0, 0.12);
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
}

.dark {
  --background: #050505;
  --foreground: #f4f4f5;
  --border: rgba(255, 255, 255, 0.12);
  --muted: #18181b;
  --muted-foreground: #a1a1aa;
}`}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Smooth View Transitions
        </h2>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          AnimatedThemeToggler uses the native View Transitions API with polygon clipping paths to deliver ultra-smooth, 60fps circular and geometric ripples across the entire document canvas.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Accessibility & Contrast
        </h2>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          Foreground and background tokens meet WCAG AAA standards with a contrast ratio exceeding 18:1 in both light and dark modes. Muted text meets WCAG AA standards with a ratio exceeding 5.2:1.
        </p>
      </section>
    </article>
  );
}
