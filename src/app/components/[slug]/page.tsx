import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getComponentBySlug, getAllComponents } from "@/registry";
import { ComponentPreview } from "@/components/showcase/component-preview";
import { GlowingBadge } from "@/registry/ui/glowing-badge";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { HorizontalScale, VerticalScale, Lines } from "@/registry/ui/scales";
import { AnimatedButton } from "@/registry/ui/animated-button";
import { SpotlightCard } from "@/registry/ui/spotlight-card";
import { BentoGrid, BentoCard } from "@/registry/ui/bento-grid";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const components = getAllComponents();
  return components.map((c) => ({ slug: c.slug }));
}

export default async function ComponentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  const renderComponentInteractive = (slug: string) => {
    switch (slug) {
      case "scales":
        return (
          <div className="w-full max-w-xl flex flex-col gap-6 py-4">
            <div>
              <span className="text-[11px] font-mono text-zinc-500 mb-1.5 block">
                Horizontal Scale
              </span>
              <HorizontalScale className="w-full" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-zinc-500 mb-1.5 block">
                Pattern Lines
              </span>
              <Lines className="w-full" />
            </div>
            <div className="flex justify-center h-28">
              <VerticalScale />
            </div>
          </div>
        );
      case "animated-button":
        return (
          <div className="flex flex-wrap items-center justify-center gap-3 py-6">
            <AnimatedButton variant="primary" showArrow>
              Primary Action
            </AnimatedButton>
            <AnimatedButton variant="secondary">Secondary</AnimatedButton>
            <AnimatedButton variant="outline">Outline</AnimatedButton>
            <AnimatedButton variant="shimmer" showArrow>
              Shimmer Glow
            </AnimatedButton>
          </div>
        );
      case "spotlight-card":
        return (
          <div className="w-full max-w-sm py-4">
            <SpotlightCard>
              <h4 className="text-sm font-semibold text-zinc-100">
                Interactive Spotlight
              </h4>
              <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                Move your cursor across this card to observe the fluid radial gradient tracking effect.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Tailwind CSS</span>
                <span className="text-blue-400">GPU Accelerated</span>
              </div>
            </SpotlightCard>
          </div>
        );
      case "glowing-badge":
        return (
          <div className="flex flex-wrap items-center justify-center gap-3 py-6">
            <GlowingBadge variant="blue">Production</GlowingBadge>
            <GlowingBadge variant="emerald">Live 99.9%</GlowingBadge>
            <GlowingBadge variant="amber">Degraded</GlowingBadge>
            <GlowingBadge variant="violet">Beta Feature</GlowingBadge>
          </div>
        );
      case "bento-grid":
        return (
          <div className="w-full max-w-2xl py-4">
            <BentoGrid className="grid-cols-2">
              <BentoCard
                colSpan={1}
                title="Telemetry"
                description="Real-time monitoring and analytics."
              />
              <BentoCard
                colSpan={1}
                title="Performance"
                description="Zero overhead execution."
              />
            </BentoGrid>
          </div>
        );
      default:
        return <div className="text-zinc-500 text-xs">Preview unavailable</div>;
    }
  };

  const installCommand = `npm install ${component.dependencies.join(" ")}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#f4f4f5]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link
            href="/components"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            <span>Back to Components</span>
          </Link>
        </div>

        <div className="flex flex-col gap-3 mb-8 border-b border-white/8 pb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-white">
            {component.name}
          </h1>
          <p className="text-sm text-zinc-400 font-light max-w-2xl">
            {component.description}
          </p>

          <div className="flex items-center gap-2 pt-2 flex-wrap">
            {component.tags.map((tag) => (
              <span
                key={tag}
                className="border border-white/10 bg-black/40 px-2 py-0.5 text-[11px] text-zinc-400 font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3">Preview & Code</h2>
            <ComponentPreview
              code={component.files[0]?.code || ""}
              filename={component.files[0]?.name}
            >
              {renderComponentInteractive(component.slug)}
            </ComponentPreview>
          </div>

          <div>
            <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3">Installation</h2>
            <div className="border border-white/15 bg-black/60 p-4 font-mono text-xs text-zinc-200 flex items-center justify-between">
              <span>{installCommand}</span>
              <span className="text-[11px] text-zinc-500">bash</span>
            </div>
          </div>

          {component.props && component.props.length > 0 && (
            <div>
              <h2 className="text-base font-mono uppercase tracking-wider text-white mb-3">Props & Attributes</h2>
              <div className="border border-white/15 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 border-b border-white/10 text-zinc-400 font-mono">
                    <tr>
                      <th className="p-3">Prop</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Default</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-black">
                    {component.props.map((p) => (
                      <tr key={p.name} className="hover:bg-zinc-950/60 font-mono">
                        <td className="p-3 text-zinc-200">{p.name}</td>
                        <td className="p-3 text-zinc-400">{p.type}</td>
                        <td className="p-3 text-zinc-500">
                          {p.defaultValue || "-"}
                        </td>
                        <td className="p-3 text-zinc-300 font-sans font-light">
                          {p.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
