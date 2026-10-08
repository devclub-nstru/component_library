import React from "react";
import { CodeBlock } from "@/components/showcase/code-block";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Typeset",
  description:
    "Typography hierarchy, font pairings, and editorial scale in DevClub UI.",
  path: "/docs/typeset",
});

const TYPE_SCALES = [
  {
    role: "Display Large",
    font: "Gambetta Serif",
    size: "24px - 48px",
    weight: "400",
    sample: "DevClub Architecture",
  },
  {
    role: "Section Heading",
    font: "Poppins Sans",
    size: "16px - 18px",
    weight: "600",
    sample: "Design Tokens & Physics",
  },
  {
    role: "Body Standard",
    font: "Poppins Sans",
    size: "12px - 15px",
    weight: "300 / 400",
    sample: "Components engineered for high visual fidelity and frame rate.",
  },
  {
    role: "Code & Metadata",
    font: "System Monospace",
    size: "11px - 14px",
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
          An editorial typographic scale combining a high-contrast display
          serif, a clean geometric sans, and the system monospace stack for
          code.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Font Family Pairings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          <div className="rounded-2xl border border-border/80 bg-card/40 p-5 space-y-2 transition-all hover:border-foreground/20 hover:bg-muted/20">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium tracking-wide uppercase bg-muted text-muted-foreground border border-border/60">
              Display Serif
            </span>
            <h3 className="text-xl font-serif text-foreground">Gambetta</h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Used for hero titles, quotes, and primary section headers. Designed by Indian Type Foundry (ITF) and distributed through Fontshare. The site self-hosts the Regular, Medium and Semibold weights.
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card/40 p-5 space-y-2 transition-all hover:border-foreground/20 hover:bg-muted/20">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium tracking-wide uppercase bg-muted text-muted-foreground border border-border/60">
              Interface Sans
            </span>
            <h3 className="text-xl font-sans font-medium text-foreground">
              Poppins
            </h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Used for interactive controls, paragraph bodies, and inputs. Clean, geometric, and effortless to scan.
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card/40 p-5 space-y-2 transition-all hover:border-foreground/20 hover:bg-muted/20">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium tracking-wide uppercase bg-muted text-muted-foreground border border-border/60">
              Technical Mono
            </span>
            <h3 className="text-xl font-mono text-foreground">System Mono</h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Tailwind&apos;s default <code className="text-foreground">font-mono</code> stack (ui-monospace, SF Mono, Menlo, Consolas). Used for code blocks, terminal snippets, API payload fields, and technical parameters. No web font is downloaded.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-sans font-semibold tracking-tight text-foreground">
          Typographic Hierarchy & Scale
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card/40 shadow-sm">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-muted/60 border-b border-border/80 text-muted-foreground">
              <tr>
                <th className="p-3 font-medium">Role</th>
                <th className="p-3 font-medium">Font Family</th>
                <th className="p-3 font-medium">Size & Weight</th>
                <th className="p-3 font-medium">Sample Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {TYPE_SCALES.map((item) => (
                <tr key={item.role} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <code className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-muted border border-border/80 text-foreground font-medium">
                      {item.role}
                    </code>
                  </td>
                  <td className="p-3 text-muted-foreground font-sans">
                    {item.font}
                  </td>
                  <td className="p-3 font-mono text-[11px] text-muted-foreground">
                    {item.size} ({item.weight})
                  </td>
                  <td className="p-3 text-foreground font-light">
                    {item.sample}
                  </td>
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
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          Configure fonts via Next.js Google Fonts and local font loader in{" "}
          <code className="text-foreground">src/app/layout.tsx</code>, then
          apply both variables to the <code className="text-foreground">&lt;html&gt;</code>{" "}
          element and map them in <code className="text-foreground">@theme inline</code>{" "}
          as <code className="text-foreground">--font-sans</code> and{" "}
          <code className="text-foreground">--font-serif</code>:
        </p>
        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5">
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
  src: [
    {
      path: "../../public/fonts/Gambetta-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gambetta-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gambetta-Semibold.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-gambetta",
  display: "swap",
});`}
          />
        </div>
        <p className="text-xs sm:text-[13px] text-muted-foreground font-light leading-relaxed">
          Gambetta is copyright Indian Type Foundry. If you self-host it in
          your own project, download it from Fontshare and follow the licence
          that ships with the font files.
        </p>
      </section>
    </article>
  );
}
