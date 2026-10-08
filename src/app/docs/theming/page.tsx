import React from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CodeBlock } from "@/components/showcase/code-block";
import { createPageMetadata } from "@/lib/metadata";
import { extractSourceBlocks } from "@/lib/source-blocks";

export const metadata = createPageMetadata({
  title: "Theming",
  description:
    "Monochromatic design tokens, CSS variables, and Tailwind CSS v4 theme integration.",
  path: "/docs/theming",
});

const THEME_SNIPPET = extractSourceBlocks(
  readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8"),
  /^(?:@import "tailwindcss";|@custom-variant dark .*;|(?::root|\.dark|@theme inline) \{\n[\s\S]*?\n\})$/gm,
  5,
);

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
    token: "--card",
    value: "#ffffff / #0c0c0e",
    usage: "Card surfaces, paired with --card-foreground for text",
  },
  {
    token: "--primary",
    value: "#18181b / #f4f4f5",
    usage: "Solid emphasis fills, paired with --primary-foreground",
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
  {
    token: "--line-strong",
    value: "rgba(0,0,0,0.14) / rgb(255,255,255,0.16)",
    usage: "Stronger outlines and focus borders",
  },
  {
    token: "--text",
    value: "#09090b / #f2f2f3",
    usage: "Text inside panels and inputs",
  },
  {
    token: "--faint",
    value: "#a1a1aa / #56565c",
    usage: "Placeholders and faint hints",
  },
  {
    token: "--ink",
    value: "#ffffff / #0b0b0c",
    usage: "Inverse text, the opposite of --text",
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
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          All components reference semantic CSS variables declared on the root element and dark selector. Below is the reference table of core palette tokens:
        </p>
        <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card/40 shadow-sm">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-muted/60 border-b border-border/80 text-muted-foreground">
              <tr>
                <th className="p-3 font-medium">Variable</th>
                <th className="p-3 font-medium">Values (Light / Dark)</th>
                <th className="p-3 font-medium">Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {THEME_TOKENS.map((item) => (
                <tr key={item.token} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <code className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-muted border border-border/80 text-foreground">
                      {item.token}
                    </code>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-muted-foreground">
                    {item.value}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground font-light">
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
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          Declare the variables on <code className="text-foreground">:root</code>{" "}
          and <code className="text-foreground">.dark</code>, then map them to
          Tailwind colors in an <code className="text-foreground">@theme inline</code>{" "}
          block. The mapping is what turns each variable into utilities such as{" "}
          <code className="text-foreground">bg-background</code>,{" "}
          <code className="text-foreground">text-muted-foreground</code> and{" "}
          <code className="text-foreground">border-border</code>. Without it,
          those classes are not generated.
        </p>
        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5">
          <CodeBlock
            filename="src/app/globals.css"
            language="css"
            code={THEME_SNIPPET}
          />
        </div>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          If your project already ran <code className="text-foreground">npx shadcn@latest init</code>,
          keep its variables and add any DevClub tokens that are missing, such as{" "}
          <code className="text-foreground">--border-subtle</code>,{" "}
          <code className="text-foreground">--border-hairline</code>,{" "}
          <code className="text-foreground">--panel</code>,{" "}
          <code className="text-foreground">--line</code>,{" "}
          <code className="text-foreground">--line-strong</code>,{" "}
          <code className="text-foreground">--text</code>,{" "}
          <code className="text-foreground">--faint</code> and{" "}
          <code className="text-foreground">--ink</code>, with matching{" "}
          <code className="text-foreground">--color-*</code> entries.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card/40 p-5 space-y-2">
          <h2 className="text-base font-sans font-semibold tracking-tight text-foreground">
            Smooth View Transitions
          </h2>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            AnimatedThemeToggler uses the native View Transitions API with polygon clipping paths to deliver ultra-smooth, 60fps circular and geometric ripples across the canvas.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/40 p-5 space-y-2">
          <h2 className="text-base font-sans font-semibold tracking-tight text-foreground">
            Accessibility & Contrast
          </h2>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Foreground and background tokens meet WCAG AAA standards with a contrast ratio exceeding 18:1 in both light and dark modes. Muted text meets WCAG AA standards.
          </p>
        </div>
      </div>
    </article>
  );
}
