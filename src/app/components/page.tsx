"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ComponentCard } from "@/components/showcase/component-card";
import { getAllComponents } from "@/registry";
import { CATEGORIES } from "@/lib/constants";
import { GlowingBadge } from "@/registry/ui/glowing-badge";
import { HorizontalScale, Lines } from "@/registry/ui/scales";
import { AnimatedButton } from "@/registry/ui/animated-button";
import { SpotlightCard } from "@/registry/ui/spotlight-card";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export default function ComponentsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allComponents = useMemo(() => getAllComponents(), []);

  const filteredComponents = useMemo(() => {
    return allComponents.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [allComponents, selectedCategory, searchQuery]);

  const previewRenderers: Record<string, React.ReactNode> = {
    scales: (
      <div className="w-full flex flex-col gap-2">
        <HorizontalScale className="w-full" />
        <Lines className="w-full" />
      </div>
    ),
    "animated-button": (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <AnimatedButton variant="primary" showArrow>
          Primary
        </AnimatedButton>
        <AnimatedButton variant="shimmer">
          Shimmer
        </AnimatedButton>
      </div>
    ),
    "spotlight-card": (
      <SpotlightCard className="w-full max-w-xs p-3">
        <div className="text-xs font-semibold text-zinc-100">Spotlight</div>
        <div className="text-[10px] text-zinc-400">Radial Hover</div>
      </SpotlightCard>
    ),
    "glowing-badge": (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <GlowingBadge variant="blue">Production</GlowingBadge>
        <GlowingBadge variant="emerald">Operational</GlowingBadge>
      </div>
    ),
    "bento-grid": (
      <div className="w-full p-2 border border-zinc-800 rounded bg-zinc-950/60 text-center">
        <span className="text-xs font-mono text-zinc-400">Bento Grid Preview</span>
      </div>
    ),
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-3 mb-10">
          <div className="flex items-center gap-2">
            <GlowingBadge variant="blue">Registry</GlowingBadge>
            <span className="text-xs text-zinc-500 font-mono">
              {filteredComponents.length} components available
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-heading">
            Component Library
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl font-light">
            Modular, high-performance UI components built with Tailwind CSS, Radix UI icons, and custom design tokens. Copy and paste directly into your project.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer",
                  selectedCategory === category.id
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        {filteredComponents.length === 0 ? (
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/50 py-16 text-center">
            <p className="text-sm text-zinc-400">No components match your search query.</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-3 text-xs text-blue-400 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map((item) => (
              <ComponentCard
                key={item.slug}
                component={item}
                preview={previewRenderers[item.slug]}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
