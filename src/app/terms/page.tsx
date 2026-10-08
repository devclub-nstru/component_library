import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { createPageMetadata } from "@/lib/metadata";
import { TERMS_ITEMS } from "./terms-data";

export const metadata = createPageMetadata({
  title: "Terms and Conditions",
  description:
    "Terms and conditions governing the use and distribution of DevClub UI.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <Navbar />

      <main id="main-content" className="legal-content flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="space-y-2 mb-8 border-b border-border pb-6">
          <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
            Terms and Conditions
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-muted-foreground">
            <span>Last Updated: 23 September 2026</span>
            <span>•</span>
            <span>Effective Date: 23 September 2026</span>
            <span>•</span>
            <span>Version: 1.0</span>
            <span>•</span>
            <span>143 Sections</span>
          </div>
        </div>

        <div className="p-3 border border-border bg-muted/40 text-[11px] text-muted-foreground font-light leading-relaxed mb-8">
          <strong className="text-foreground font-medium">Important:</strong> This document establishes the terms and conditions governing access, use, modification, and distribution of DevClub UI and its component registry.
        </div>

        <div className="space-y-6 text-xs font-light text-muted-foreground leading-relaxed">
          {TERMS_ITEMS.map((item) => (
            <section
              key={item.id}
              id={`section-${item.id}`}
              className="space-y-2 pt-2 border-b border-border-subtle pb-4 last:border-b-0"
            >
              <h2 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-foreground">
                {item.title}
              </h2>
              {item.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
              {item.list && (
                <ol className="list-decimal pl-5 space-y-1 pt-1 text-[11px] text-muted-foreground">
                  {item.list.map((li, lIdx) => (
                    <li key={lIdx}>{li}</li>
                  ))}
                </ol>
              )}
            </section>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-border flex justify-between items-center font-mono text-[11px]">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            ← Home
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
