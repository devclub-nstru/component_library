"use client";

import React, { useMemo } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ComponentCard } from "@/components/showcase/component-card";
import { getAllComponents } from "@/registry";
import { HorizontalScale, Lines } from "@/registry/ui/scales";
import { AnimatedButton } from "@/registry/ui/animated-button";
import { SpotlightCard } from "@/registry/ui/spotlight-card";
import { HookSidebar } from "@/registry/ui/hook-sidebar";
import { GitHubActivity } from "@/registry/ui/github-activity";

export default function ComponentsPage() {
  const allComponents = useMemo(() => getAllComponents(), []);

  const previewRenderers: Record<string, React.ReactNode> = {
    scales: (
      <div className="w-full max-w-70 flex flex-col gap-3">
        <HorizontalScale className="w-full h-8" />
        <Lines className="w-full h-10" />
      </div>
    ),
    "animated-button": (
      <div className="flex flex-col items-center gap-3">
        <AnimatedButton variant="primary" showArrow>
          Primary Action
        </AnimatedButton>
        <AnimatedButton variant="shimmer">Shimmer Effect</AnimatedButton>
      </div>
    ),
    "spotlight-card": (
      <SpotlightCard className="w-full max-w-60 p-4 border-white/10 bg-black/80">
        <div className="text-xs font-medium text-white">Radial Spotlight</div>
        <div className="text-[11px] text-zinc-500 mt-1 font-mono">
          GPU Accelerated
        </div>
      </SpotlightCard>
    ),
    "bento-grid": (
      <div className="w-full max-w-70 grid grid-cols-2 gap-2">
        <div className="p-3 border border-white/10 bg-zinc-950 text-left">
          <span className="text-[10px] font-mono text-zinc-500 block">
            Matrix
          </span>
          <span className="text-xs text-white font-medium">Telemetry</span>
        </div>
        <div className="p-3 border border-white/10 bg-zinc-950 text-left">
          <span className="text-[10px] font-mono text-zinc-500 block">
            Latency
          </span>
          <span className="text-xs text-white font-medium">12ms</span>
        </div>
      </div>
    ),
    "glowing-badge": (
      <div className="flex flex-col items-center gap-2 font-mono">
        <div className="border border-white/20 bg-zinc-950 px-3 py-1 text-xs text-zinc-200">
          SYSTEM_ACTIVE
        </div>
        <div className="border border-orange-500/40 bg-zinc-950 px-3 py-1 text-xs text-orange-400">
          PRODUCTION
        </div>
      </div>
    ),
    "hook-sidebar": (
      <div className="w-48 bg-zinc-950/90 border border-white/10 rounded-xl p-3 pointer-events-none">
        <HookSidebar
          items={[
            { label: "Overview" },
            { label: "Components" },
            { label: "Documentation" },
          ]}
          defaultValue={1}
          color="#F97316"
        />
      </div>
    ),
    "github-activity": (
      <div className="w-full max-w-72 pointer-events-none scale-75 origin-center">
        <GitHubActivity totalContributions={1863} year={2025} />
      </div>
    ),
  };

  const newReleases = allComponents.slice(0, 3);
  const displayComponents = allComponents.slice(3);

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#f4f4f5]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white max-w-3xl leading-tight">
            20+ rare and unique components
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mt-4 font-light leading-relaxed">
            Every component is a single file you own, not a dependency you
            install. Built with clean geometry, minimal aesthetics, and high
            performance.
          </p>
        </div>

        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-sm sm:text-xl font-medium font-serif text-white tracking-tight">
                New releases
              </h2>
              <span className="text-xs font-mono font-medium text-orange-500">
                [{newReleases.length}]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newReleases.map((item) => (
                <ComponentCard
                  key={item.slug}
                  component={item}
                  preview={previewRenderers[item.slug]}
                  badge="NEW"
                />
              ))}
            </div>
          </section>

          {displayComponents.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-sm sm:text-xl font-medium font-serif text-white tracking-tight">
                  Display
                </h2>
                <span className="text-xs font-mono font-medium text-orange-500">
                  [{displayComponents.length}]
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayComponents.map((item) => (
                  <ComponentCard
                    key={item.slug}
                    component={item}
                    preview={previewRenderers[item.slug]}
                    badge="NEW"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
