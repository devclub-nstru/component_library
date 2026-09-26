import React from "react";
import { CodeBlock } from "@/components/showcase/code-block";

export const metadata = {
  title: "Typeset",
  description:
    "Typography hierarchy, font pairings, and editorial scale in DevClub UI.",
};

const TYPE_SCALES = [
  {
    role: "Display Large",
    font: "Gambetta Serif",
    size: "48px - 64px",
    weight: "300 / 400",
    sample: "DevClub Architecture",
  },
  {
    role: "Section Heading",
    font: "Poppins Sans",
    size: "20px - 28px",
    weight: "600",
    sample: "Design Tokens & Physics",
  },
  {
    role: "Body Standard",
    font: "Poppins Sans",
    size: "14px - 16px",
    weight: "300 / 400",
    sample: "Components engineered for high visual fidelity and frame rate.",
  },
  {
    role: "Code & Metadata",
    font: "Monospace",
    size: "11px - 13px",
    weight: "400",
    sample: "GET /api/components/[slug]",
  },
];

export default function DocsTypesetPage() {
  return (
    <article className="space-y-10">
      <div className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
          Typeset & Typography
        </h1>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          An editorial typographic scale combining high-craft Italian serifs,
          clean geometric grotesques, and technical monospace labels.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Font Family Pairings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          <div className="border border-border bg-card p-4 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Display Serif
            </span>
            <h3 className="text-xl font-serif text-foreground">Gambetta</h3>
            <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
              Used for hero titles, quotes, and primary section headers. Conveys
              craft, timelessness, and prestige.
            </p>
          </div>
          <div className="border border-border bg-card p-4 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Interface Sans
            </span>
            <h3 className="text-xl font-sans font-medium text-foreground">
              Poppins
            </h3>
            <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
              Used for interactive controls, paragraph bodies, and inputs.
              Clean, geometric, and effortless to scan.
            </p>
          </div>
          <div className="border border-border bg-card p-4 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Technical Mono
            </span>
            <h3 className="text-xl font-mono text-foreground">JetBrains Mono</h3>
            <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
              Used for code blocks, badges, category indicators, API routes, and
              uppercase micro-labels.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Typographic Hierarchy & Scale
        </h2>
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-muted border-b border-border font-mono text-muted-foreground">
              <tr>
                <th className="p-2.5">Role</th>
                <th className="p-2.5">Font</th>
                <th className="p-2.5">Size & Weight</th>
                <th className="p-2.5">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {TYPE_SCALES.map((item) => (
                <tr key={item.role} className="hover:bg-muted/40">
                  <td className="p-2.5 font-mono font-medium text-foreground">
                    {item.role}
                  </td>
                  <td className="p-2.5 font-mono text-muted-foreground">{item.font}</td>
                  <td className="p-2.5 font-mono text-muted-foreground">
                    {item.size} ({item.weight})
                  </td>
                  <td className="p-2.5 text-foreground">{item.sample}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Font Setup in Next.js
        </h2>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          Configure fonts via Next.js Google Fonts and local font loader in{" "}
          <code className="text-foreground">src/app/layout.tsx</code>:
        </p>
        <CodeBlock
          filename="src/app/layout.tsx"
          language="tsx"
          code={`import { Poppins } from "next/font/google";
import localFont from "next/font/local";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const gambetta = localFont({
  src: "../../public/fonts/Gambetta-Regular.otf",
  variable: "--font-gambetta",
  display: "swap",
});`}
        />
      </section>
    </article>
  );
}
