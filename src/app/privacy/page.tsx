import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PRIVACY_ITEMS } from "./privacy-data";

export const metadata = {
  title: "Privacy Policy",
  description: "Comprehensive 94-section privacy policy for DevClub UI and its developer platform.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#f4f4f5]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="space-y-2 mb-8 border-b border-white/10 pb-6">
          <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-white">
            Privacy Policy
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-zinc-400">
            <span>Last Updated: 23 September 2026</span>
            <span>•</span>
            <span>Effective Date: 23 September 2026</span>
            <span>•</span>
            <span>Version: 1.0</span>
            <span>•</span>
            <span>94 Sections</span>
          </div>
        </div>

        <div className="p-3 border border-white/15 bg-white/5 text-[11px] text-zinc-400 font-light leading-relaxed mb-8">
          <strong className="text-white font-medium">Important:</strong> This Privacy Policy outlines data handling practices for DevClub UI. Components run client-side in your application without silent telemetry.
        </div>

        <div className="space-y-6 text-xs font-light text-zinc-400 leading-relaxed">
          {PRIVACY_ITEMS.map((item) => (
            <section
              key={item.id}
              id={`section-${item.id}`}
              className="space-y-2 pt-2 border-b border-white/5 pb-4 last:border-b-0"
            >
              <h2 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-white">
                {item.title}
              </h2>
              {item.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
              {item.list && (
                <ol className="list-decimal pl-5 space-y-1 pt-1 text-[11px] text-zinc-400">
                  {item.list.map((li, lIdx) => (
                    <li key={lIdx}>{li}</li>
                  ))}
                </ol>
              )}
            </section>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex justify-between items-center font-mono text-[11px]">
          <Link href="/terms" className="text-zinc-400 hover:text-white transition-colors">
            ← Terms & Conditions
          </Link>
          <Link href="/docs" className="text-zinc-400 hover:text-white transition-colors">
            Documentation →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
