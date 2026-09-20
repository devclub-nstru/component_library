"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
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
import { HookSidebar } from "@/registry/ui/hook-sidebar";
import { GitHubActivity } from "@/registry/ui/github-activity";
import { cn } from "@/lib/utils";

interface ComponentStudioProps {
  component: ComponentRegistryItem;
  allComponents?: ComponentRegistryItem[];
}

const CATEGORIES = [
  {
    label: "DISPLAY",
    items: [
      { label: "Scales & Borders", href: "/components/scales" },
      { label: "Spotlight Card", href: "/components/spotlight-card" },
      { label: "GitHub activity", href: "/components/github-activity" },
    ],
  },
  {
    label: "NAVIGATION",
    items: [{ label: "Hook Sidebar", href: "/components/hook-sidebar" }],
  },
  {
    label: "INPUTS",
    items: [{ label: "Animated Button", href: "/components/animated-button" }],
  },
  {
    label: "LAYOUT & FEEDBACK",
    items: [
      { label: "Bento Grid", href: "/components/bento-grid" },
      { label: "Status Badge", href: "/components/glowing-badge" },
    ],
  },
];

const CODE_KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "const",
  "let",
  "var",
  "function",
  "return",
  "interface",
  "type",
  "extends",
  "as",
  "typeof",
  "keyof",
  "new",
  "true",
  "false",
  "null",
  "undefined",
  "if",
  "else",
  "switch",
  "case",
]);

function highlightCode(code: string) {
  return code.split("\n").map((line, lineIdx) => {
    const regex =
      /(".*?"|'.*?'|`.*?`|\b[A-Za-z_$][A-Za-z0-9_$]*\b|[{}()[\];:,.=><&|!+*/?-]|\s+)/g;
    const tokens = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      const token = match[0];
      let colorClass = "text-zinc-300";
      if (
        token.startsWith('"') ||
        token.startsWith("'") ||
        token.startsWith("`")
      ) {
        colorClass = "text-zinc-400";
      } else if (CODE_KEYWORDS.has(token)) {
        colorClass = "text-white font-medium";
      } else if (/^[A-Z][A-Za-z0-9_$]*$/.test(token)) {
        colorClass = "text-zinc-200";
      } else if (/^[{}()[\];:,.=><&|!+*/?-]+$/.test(token)) {
        colorClass = "text-zinc-500";
      } else if (/^\d+$/.test(token)) {
        colorClass = "text-zinc-300";
      }
      tokens.push(
        <span key={match.index} className={colorClass}>
          {token}
        </span>
      );
    }
    return (
      <div key={lineIdx} className="whitespace-pre">
        {tokens.length > 0 ? tokens : "\u00A0"}
      </div>
    );
  });
}

export const ComponentStudio = ({ component }: ComponentStudioProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<"none" | "info" | "code">(
    "none"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [installCopied, setInstallCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const activeCode = component.files[0]?.code || "";
  const codeLines = useMemo(() => activeCode.split("\n"), [activeCode]);
  const highlighted = useMemo(() => highlightCode(activeCode), [activeCode]);

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
          <div className="w-full max-w-md bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 select-none">
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
              <span>Stiffness: 420, Damping: 34</span>
              <span className="text-zinc-400">GPU Accelerated</span>
            </div>
          </div>
        );
      case "github-activity":
        return <GitHubActivity />;
      case "hook-sidebar":
        return (
          <div className="w-full max-w-sm bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/8">
              <span className="text-xs font-mono uppercase text-zinc-400">
                Hook Rail Demonstration
              </span>
              <span className="text-[10px] font-mono text-orange-500">
                Stiffness: 420
              </span>
            </div>
            <HookSidebar
              label="SIDEBAR NAVIGATION"
              defaultValue={1}
              items={[
                { label: "Overview", href: "#overview" },
                { label: "Components", href: "#components" },
                { label: "Documentation", href: "#docs" },
                { label: "Settings", href: "#settings" },
              ]}
            />
          </div>
        );
      case "scales":
        return (
          <div className="w-full max-w-xl bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
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
            <SpotlightCard className="p-6 border-white/10 bg-[#0c0c0e]">
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
          <div className="w-full max-w-lg bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 shadow-2xl">
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
          <div className="w-full max-w-md bg-[#0c0c0e] border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center gap-4">
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
    <div className="h-screen w-screen bg-black text-[#f4f4f5] flex overflow-hidden select-none">
      {!isFullscreen && (
        <motion.aside
          initial={false}
          animate={{
            width: sidebarOpen ? 260 : 64,
          }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 34,
            mass: 0.7,
          }}
          className="shrink-0 bg-black flex flex-col overflow-hidden h-full z-10"
        >
          <div className="p-4 flex items-center justify-between h-14">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-8 h-8 rounded-lg border border-white/10 bg-[#18181b] hover:bg-[#222226] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
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
              <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest font-medium">
                Studio
              </span>
            )}
          </div>

          {sidebarOpen && (
            <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2 space-y-7 scrollbar-none font-sans">
              <Link
                href="/components"
                className="block text-sm font-medium text-white hover:text-orange-400 transition-colors tracking-tight"
              >
                Components
              </Link>

              <div className="space-y-6">
                {CATEGORIES.map((cat) => (
                  <HookSidebar
                    key={cat.label}
                    label={cat.label}
                    items={cat.items}
                    color="#FC4C01"
                    dashed={true}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.aside>
      )}

      <div className="flex-1 flex p-3 gap-3 overflow-hidden h-full relative">
        <motion.main
          layout
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 34,
            mass: 0.7,
          }}
          className={cn(
            "relative rounded-[28px] border border-white/6 bg-[#0f0f11] flex flex-col justify-between overflow-hidden h-full flex-1",
            isFullscreen && "fixed inset-0 z-50 rounded-none border-none m-0"
          )}
        >
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleInstallCopy}
              className="h-10 px-4 rounded-xl border border-white/10 bg-[#18181b]/90 hover:bg-[#222226] text-zinc-300 hover:text-white text-xs font-mono transition-colors cursor-pointer flex items-center justify-center shadow-lg"
            >
              {installCopied ? "Copied!" : "Install"}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-10 h-10 rounded-xl border border-white/10 bg-[#18181b]/90 hover:bg-[#222226] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg"
            >
              {isFullscreen ? (
                <ExitFullScreenIcon className="w-4 h-4" />
              ) : (
                <EnterFullScreenIcon className="w-4 h-4" />
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() =>
                setActivePanel(activePanel === "code" ? "none" : "code")
              }
              className={cn(
                "w-10 h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shadow-lg",
                activePanel === "code"
                  ? "border-orange-500/80 text-orange-400 bg-orange-500/10"
                  : "border-white/10 bg-[#18181b]/90 hover:bg-[#222226] text-zinc-400 hover:text-white"
              )}
            >
              <CodeIcon className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() =>
                setActivePanel(activePanel === "info" ? "none" : "info")
              }
              className={cn(
                "w-10 h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shadow-lg",
                activePanel === "info"
                  ? "border-orange-500/80 text-orange-400 bg-orange-500/10"
                  : "border-white/10 bg-[#18181b]/90 hover:bg-[#222226] text-zinc-400 hover:text-white"
              )}
            >
              <InfoCircledIcon className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            {renderInteractivePreview(component.slug)}
          </div>

          <AnimatePresence>
            {activePanel === "code" && (
              <motion.div
                key="code-sheet"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 36,
                  mass: 0.8,
                }}
                className="absolute inset-x-3 bottom-3 top-3 z-30 rounded-[24px] border border-white/10 bg-[#0a0a0c] shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="w-12 h-1 bg-zinc-700/60 rounded-full mx-auto my-3 shrink-0" />

                <div className="px-6 pb-3 border-b border-white/8 flex items-center justify-between shrink-0">
                  <span className="text-sm font-sans font-medium text-zinc-100 tracking-tight">
                    {component.name}
                  </span>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleInstallCopy}
                      className="border border-white/10 hover:border-white/20 bg-[#18181b] hover:bg-[#222226] text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                    >
                      {installCopied ? "Copied!" : "Install"}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleCodeCopy}
                      className="w-8 h-8 rounded-lg border border-white/10 hover:border-white/20 bg-[#18181b] hover:bg-[#222226] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      {codeCopied ? (
                        <CheckIcon className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <CopyIcon className="w-4 h-4" />
                      )}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setActivePanel("none")}
                      className="w-8 h-8 rounded-lg border border-white/10 hover:border-white/20 bg-[#18181b] hover:bg-[#222226] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Cross2Icon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-auto font-mono text-xs leading-relaxed bg-[#070709]">
                  <div className="flex">
                    <div className="select-none text-zinc-600 text-right pr-5 shrink-0 space-y-0.5">
                      {codeLines.map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    <div className="flex-1 overflow-x-auto">{highlighted}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>

        <AnimatePresence mode="wait">
          {activePanel === "info" && (
            <motion.aside
              key="info-panel"
              initial={{ opacity: 0, x: 50, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 440 }}
              exit={{ opacity: 0, x: 50, width: 0 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 34,
                mass: 0.7,
              }}
              className="shrink-0 h-full border border-white/8 bg-[#0c0c0e] rounded-[24px] p-6 sm:p-8 overflow-y-auto flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                    {component.slug.replace("-", " ")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActivePanel("none")}
                    className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
                  >
                    <Cross2Icon className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
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
                        className="inline-flex items-center gap-1.5 border border-white/10 bg-black/60 px-3 py-1 text-xs font-mono text-zinc-300 rounded-lg"
                      >
                        <span className="text-zinc-500">〰</span>
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
                    <div className="border border-white/8 rounded-xl overflow-hidden">
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
                              <td className="p-2.5">
                                <span className="bg-zinc-900 border border-white/10 px-2 py-0.5 rounded text-zinc-300 text-[11px]">
                                  {p.name}
                                </span>
                              </td>
                              <td className="p-2.5 text-zinc-400">{p.type}</td>
                              <td className="p-2.5 text-zinc-300 font-sans font-light">
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
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
