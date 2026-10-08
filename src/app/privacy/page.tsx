import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { createPageMetadata } from "@/lib/metadata";
import { PRIVACY_ITEMS } from "./privacy-data";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How DevClub UI handles personal information, including the analytics services and cookies used on this website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <Navbar />

      <main id="main-content" className="legal-content flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="space-y-2 mb-8 border-b border-border pb-6">
          <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-muted-foreground">
            <span>Last Updated: 8 October 2026</span>
            <span>•</span>
            <span>Effective Date: 23 September 2026</span>
            <span>•</span>
            <span>Version: 1.1</span>
            <span>•</span>
            <span>94 Sections</span>
          </div>
        </div>

        <div className="p-3 border border-border bg-muted/40 text-[11px] text-muted-foreground font-light leading-relaxed mb-8">
          <strong className="text-foreground font-medium">Important:</strong> This Privacy Policy outlines data handling practices for DevClub UI. Components run client-side in your application without silent telemetry. This website uses Microsoft Clarity, Vercel Web Analytics and Vercel Speed Insights, as described in Sections 7 and 19.
        </div>

        <div className="space-y-6 text-xs font-light text-muted-foreground leading-relaxed">
          {PRIVACY_ITEMS.map((item) => (
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
          <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
            ← Terms & Conditions
          </Link>
          <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
            Documentation →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
