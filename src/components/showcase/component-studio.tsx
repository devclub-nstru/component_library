"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CodeIcon,
  InfoCircledIcon,
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  Cross2Icon,
  CopyIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { ComponentRegistryItem } from "@/types/component";
import { AnimatedButton } from "@/registry/ui/animated-button";
import { HorizontalScale, VerticalScale, Lines } from "@/registry/ui/scales";
import { SpotlightCard } from "@/registry/ui/spotlight-card";
import { BentoGrid, BentoCard } from "@/registry/ui/bento-grid";
import { GlowingBadge } from "@/registry/ui/glowing-badge";
import { cn } from "@/lib/utils";

interface ComponentStudioProps {
  component: ComponentRegistryItem;
  allComponents: ComponentRegistryItem[];
}

const CATEGORY_TREE = [
  {
    category: "DISPLAY",
    items: [
      { name: "Scales & Borders", slug: "scales" },
      { name: "Spotlight Card", slug: "spotlight-card" },
      { name: "Folder component", slug: "scales", disabled: true },
      { name: "Code Block", slug: "scales", disabled: true },
      { name: "Gravity Letters", slug: "scales", disabled: true },
      { name: "GitHub activity", slug: "scales", disabled: true },
      { name: "Step player", slug: "scales", disabled: true },
      { name: "Animated counter", slug: "scales", disabled: true },
    ],
  },
  {
    category: "AI KIT",
    items: [
      { name: "Fluid Orb", slug: "spotlight-card", disabled: true },
      { name: "Grid Reveal", slug: "spotlight-card", disabled: true },
      { name: "Matrix orb", slug: "spotlight-card", disabled: true },
    ],
  },
  {
    category: "NAVIGATION",
    items: [
      { name: "Bounce sidebar", slug: "bento-grid", disabled: true },
      { name: "Hook Sidebar", slug: "bento-grid", disabled: true },
      { name: "Proximity Sidebar", slug: "bento-grid", disabled: true },
      { name: "Scroll Progress", slug: "bento-grid", disabled: true },
      { name: "Gooey nav", slug: "bento-grid", disabled: true },
    ],
  },
  {
    category: "INPUTS",
    items: [
      { name: "Animated Button", slug: "animated-button" },
      { name: "Duration Picker", slug: "animated-button", disabled: true },
      { name: "OTP Input", slug: "animated-button", disabled: true },
      { name: "Delete button", slug: "animated-button", disabled: true },
      { name: "Task list", slug: "animated-button", disabled: true },
    ],
  },
  {
    category: "LAYOUT & FEEDBACK",
    items: [
      { name: "Bento Grid", slug: "bento-grid" },
      { name: "Status Badge", slug: "glowing-badge" },
    ],
  },
];

export const ComponentStudio = ({
  component,
  allComponents,
}: ComponentStudioProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<"none" | "info" | "code">(
    "none",
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [installCopied, setInstallCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const activeCode = component.files[0]?.code || "";
  const codeLines = activeCode.split("\n");

  const handleInstallCopy = async () => {
    const cmd = `npm install ${component.dependencies.join(" ")}`;
    await navigator.clipboard.writeText(cmd);
    setInstallCopied(true);
    setTimeout(() => setInstallCopied(false), 2000);
  };

  const handleCodeCopy = async () => {
    await navigator.clipboard.writeText(activeCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const renderInteractivePreview = (slug: string) => {
    switch (slug) {
      case "animated-button":
        return (
          <div className="w-full max-w-md bg-[#0d0d0f] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 select-none">
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div>
                <h3 className="text-sm font-medium text-white">
                  Interactive Action Stack
                </h3>
                <p className="text-[11px] text-zinc-400 font-light mt-0.5">
                  High-stiffness spring feedback & damping
                </p>
              </div>
              <span className="text-[10px] font-mono text-orange-500 uppercase font-medium">
                Spring
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <AnimatedButton
                variant="primary"
                showArrow
                className="w-full justify-between"
              >
                <span>Primary Action</span>
              </AnimatedButton>
              <div className="grid grid-cols-2 gap-3">
                <AnimatedButton variant="secondary" className="w-full">
                  Secondary
                </AnimatedButton>
                <AnimatedButton variant="outline" className="w-full">
                  Outline
                </AnimatedButton>
              </div>
              <AnimatedButton
                variant="shimmer"
                showArrow
                className="w-full justify-between"
              >
                <span>Shimmer Glow</span>
              </AnimatedButton>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/8 text-[11px] font-mono text-zinc-500">
              <span>Stiffness: 350, Damping: 25</span>
              <span className="text-zinc-400">GPU Accelerated</span>
            </div>
          </div>
        );
      case "scales":
        return (
          <div className="w-full max-w-xl bg-[#0d0d0f] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div>
                <h3 className="text-sm font-medium text-white">
                  Architectural Scales
                </h3>
                <p className="text-[11px] text-zinc-400 font-light mt-0.5">
                  Repeating linear gradient borders
                </p>
              </div>
              <span className="text-[10px] font-mono text-orange-500 uppercase font-medium">
                Grid
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <HorizontalScale className="w-full h-8" />
              <Lines className="w-full h-10" />
              <div className="h-20 flex justify-center items-center">
                <VerticalScale className="h-full" />
              </div>
            </div>
          </div>
        );
      case "spotlight-card":
        return (
          <div className="w-full max-w-md">
            <SpotlightCard className="p-6 border-white/10 bg-[#0d0d0f]">
              <h4 className="text-base font-medium text-white">
                Radial Spotlight
              </h4>
              <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                Smooth cursor tracking with radial falloff gradient.
              </p>
              <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Tailwind CSS</span>
                <span className="text-orange-400">GPU Native</span>
              </div>
            </SpotlightCard>
          </div>
        );
      case "bento-grid":
        return (
          <div className="w-full max-w-lg bg-[#0d0d0f] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <BentoGrid className="grid-cols-2 gap-3">
              <BentoCard
                colSpan={1}
                title="Telemetry"
                description="Real-time event logging."
              />
              <BentoCard
                colSpan={1}
                title="Throughput"
                description="Low latency processing."
              />
            </BentoGrid>
          </div>
        );
      case "glowing-badge":
        return (
          <div className="w-full max-w-md bg-[#0d0d0f] border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <GlowingBadge>PRODUCTION</GlowingBadge>
              <GlowingBadge className="border-orange-500/40 text-orange-400">
                LIVE
              </GlowingBadge>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              Geometric status indicators
            </span>
          </div>
        );
      default:
        return (
          <div className="text-zinc-500 font-mono text-xs">
            Preview unavailable
          </div>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex bg-black text-[#f4f4f5] overflow-hidden">
      {!isFullscreen && (
        <aside
          className={cn(
            "shrink-0 bg-black border-r border-white/8 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden",
            sidebarOpen ? "w-64" : "w-14",
          )}
        >
          <div className="p-3.5 flex items-center justify-between border-b border-white/8 h-14">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-8 h-8 rounded-lg border border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <rect x="2" y="2" width="12" height="12" rx="2" />
                <path d="M6 2v12" />
              </svg>
            </button>
            {sidebarOpen && (
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                Studio
              </span>
            )}
          </div>

          {sidebarOpen && (
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none font-mono">
              <div className="text-xs font-semibold text-white tracking-wide">
                Components
              </div>

              {CATEGORY_TREE.map((group) => (
                <div key={group.category} className="space-y-1.5">
                  <div className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase font-medium">
                    {group.category}
                  </div>
                  <div className="border-l border-white/10 ml-1.5 pl-3 space-y-1">
                    {group.items.map((item) => {
                      const isActive =
                        item.slug === component.slug && !item.disabled;
                      return (
                        <div key={item.name} className="relative">
                          {item.disabled ? (
                            <span className="block text-xs text-zinc-600 py-1 select-none">
                              {item.name}
                            </span>
                          ) : (
                            <Link
                              href={`/components/${item.slug}`}
                              className={cn(
                                "block text-xs py-1 transition-colors cursor-pointer relative",
                                isActive
                                  ? "text-white font-medium before:absolute before:-left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-orange-500"
                                  : "text-zinc-400 hover:text-zinc-200",
                              )}
                            >
                              {isActive ? `.. ${item.name}` : item.name}
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      )}

      <div className="flex-1 flex p-3 gap-3 overflow-hidden">
        <main
          className={cn(
            "relative rounded-2xl border border-white/8 bg-[#0a0a0c] flex flex-col justify-between overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            activePanel === "none" ? "flex-1" : "flex-1 lg:flex-[1.2]",
          )}
        >
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstallCopy}
              className="border border-white/10 hover:border-white/25 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer"
            >
              {installCopied ? "Copied!" : "Install"}
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 rounded-lg border border-white/10 hover:border-white/25 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              {isFullscreen ? (
                <ExitFullScreenIcon className="w-4 h-4" />
              ) : (
                <EnterFullScreenIcon className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setActivePanel(activePanel === "code" ? "none" : "code")
              }
              className={cn(
                "w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer",
                activePanel === "code"
                  ? "border-orange-500/80 text-orange-400 bg-orange-500/10"
                  : "border-white/10 hover:border-white/25 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white",
              )}
            >
              <CodeIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                setActivePanel(activePanel === "info" ? "none" : "info")
              }
              className={cn(
                "w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer",
                activePanel === "info"
                  ? "border-orange-500/80 text-orange-400 bg-orange-500/10"
                  : "border-white/10 hover:border-white/25 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white",
              )}
            >
              <InfoCircledIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            {renderInteractivePreview(component.slug)}
          </div>
        </main>

        {activePanel === "info" && (
          <aside className="w-full max-w-md lg:max-w-lg border border-white/8 bg-[#0c0c0e] rounded-2xl p-6 sm:p-8 overflow-y-auto flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  {component.category}
                </span>
                <button
                  type="button"
                  onClick={() => setActivePanel("none")}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <Cross2Icon className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-snug">
                  {component.description}
                </h2>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Dependencies
                </div>
                <div className="flex flex-wrap gap-2">
                  {component.dependencies.map((dep) => (
                    <span
                      key={dep}
                      className="border border-white/10 bg-black/60 px-2.5 py-1 text-xs font-mono text-zinc-300 rounded-md"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Interaction Type
                </div>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Interactive spring-physics state dampening with smooth hover
                  transitions and tactile feedback.
                </p>
              </div>

              {component.props && component.props.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-white/8">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Props
                  </div>
                  <p className="text-xs text-zinc-400 font-light">
                    Options you can pass to customize this component.
                  </p>
                  <div className="border border-white/8 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-950 border-b border-white/8 text-zinc-500 font-mono text-[10px] uppercase">
                        <tr>
                          <th className="p-2.5">Prop</th>
                          <th className="p-2.5">Type</th>
                          <th className="p-2.5">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/6 font-mono text-xs">
                        {component.props.map((p) => (
                          <tr key={p.name} className="hover:bg-white/5">
                            <td className="p-2.5 text-zinc-200">{p.name}</td>
                            <td className="p-2.5 text-zinc-400">{p.type}</td>
                            <td className="p-2.5 text-zinc-400 font-sans font-light">
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
          </aside>
        )}

        {activePanel === "code" && (
          <aside className="w-full max-w-xl lg:max-w-2xl border border-white/8 bg-[#0c0c0e] rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="p-4 border-b border-white/8 flex items-center justify-between bg-black/40">
              <span className="text-xs font-mono font-medium text-white">
                {component.name}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInstallCopy}
                  className="border border-white/10 hover:border-white/25 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer"
                >
                  {installCopied ? "Copied!" : "Install"}
                </button>

                <button
                  type="button"
                  onClick={handleCodeCopy}
                  className="w-7 h-7 rounded-md border border-white/10 hover:border-white/25 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  {codeCopied ? (
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <CopyIcon className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActivePanel("none")}
                  className="w-7 h-7 rounded-md border border-white/10 hover:border-white/25 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <Cross2Icon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed bg-[#080809]">
              <div className="flex">
                <div className="select-none text-zinc-600 text-right pr-4 shrink-0 space-y-0.5">
                  {codeLines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <pre className="text-zinc-300 whitespace-pre overflow-x-auto">
                  <code>{activeCode}</code>
                </pre>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
