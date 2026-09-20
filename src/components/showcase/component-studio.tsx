"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import {
  CodeIcon,
  InfoCircledIcon,
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  Cross2Icon,
  CopyIcon,
  CheckIcon,
  ChevronRightIcon,
  LayersIcon,
  DesktopIcon,
  MobileIcon,
  ViewGridIcon,
  DragHandleDots2Icon,
} from "@radix-ui/react-icons";
import { ComponentRegistryItem } from "@/types/component";
import { getComponentBySlug } from "@/registry";
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
      { label: "Scales & Borders", slug: "scales", href: "/components/scales" },
      { label: "Spotlight Card", slug: "spotlight-card", href: "/components/spotlight-card" },
      { label: "GitHub activity", slug: "github-activity", href: "/components/github-activity" },
    ],
  },
  {
    label: "NAVIGATION",
    items: [{ label: "Hook Sidebar", slug: "hook-sidebar", href: "/components/hook-sidebar" }],
  },
  {
    label: "INPUTS",
    items: [{ label: "Animated Button", slug: "animated-button", href: "/components/animated-button" }],
  },
  {
    label: "LAYOUT & FEEDBACK",
    items: [
      { label: "Bento Grid", slug: "bento-grid", href: "/components/bento-grid" },
      { label: "Status Badge", slug: "glowing-badge", href: "/components/glowing-badge" },
    ],
  },
];

const PALETTE = [
  { id: "blue", hex: "#3B82F6", label: "Electric Blue" },
  { id: "purple", hex: "#A855F7", label: "Neon Purple" },
  { id: "red", hex: "#EF4444", label: "Coral Red" },
  { id: "orange", hex: "#F97316", label: "Sunset Orange" },
  { id: "green", hex: "#22C55E", label: "Vibrant Green" },
] as const;

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

const panelSpring = {
  type: "spring" as const,
  stiffness: 450,
  damping: 35,
  mass: 0.8,
};

const microSpring = {
  type: "spring" as const,
  stiffness: 520,
  damping: 30,
};

const sheetSpring = {
  type: "spring" as const,
  stiffness: 460,
  damping: 38,
  mass: 0.8,
};

const fadeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 420,
      damping: 32,
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.15 },
  },
};

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
        </span>,
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
  const [selectedSlug, setSelectedSlug] = useState(component.slug);
  const [prevPropSlug, setPrevPropSlug] = useState(component.slug);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeColor, setActiveColor] = useState<string>(PALETTE[3].hex);
  const dragControls = useDragControls();
  const [hookDemoIndex, setHookDemoIndex] = useState(0);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<"none" | "info" | "code">("none");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [installCopied, setInstallCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  if (component.slug !== prevPropSlug) {
    setPrevPropSlug(component.slug);
    setSelectedSlug(component.slug);
  }

  const activeComponent = useMemo(() => {
    return getComponentBySlug(selectedSlug) || component;
  }, [selectedSlug, component]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activePanel !== "none") {
          setActivePanel("none");
        } else if (isFullscreen) {
          setIsFullscreen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePanel, isFullscreen]);

  useEffect(() => {
    const handlePopState = () => {
      const parts = window.location.pathname.split("/").filter(Boolean);
      if (parts[0] === "components" && parts[1]) {
        const target = getComponentBySlug(parts[1]);
        if (target) {
          setSelectedSlug(target.slug);
          setSelectedFileIndex(0);
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSelectSlug = (slug: string) => {
    const nextComp = getComponentBySlug(slug);
    if (nextComp && nextComp.slug !== activeComponent.slug) {
      setSelectedSlug(slug);
      setSelectedFileIndex(0);
      window.history.pushState(null, "", `/components/${slug}`);
    }
  };

  const activeFile =
    activeComponent.files[selectedFileIndex] || activeComponent.files[0];
  const activeCode = activeFile?.code || "";
  const codeLines = useMemo(() => activeCode.split("\n"), [activeCode]);
  const highlighted = useMemo(() => highlightCode(activeCode), [activeCode]);

  const handleInstallCopy = async () => {
    const cmd = `npm install ${activeComponent.dependencies.join(" ")}`;
    await navigator.clipboard.writeText(cmd);
    setInstallCopied(true);
    setTimeout(() => setInstallCopied(false), 2000);
  };

  const handleCodeCopy = async () => {
    await navigator.clipboard.writeText(activeCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const renderComponentPreview = (slug: string, color: string) => {
    switch (slug) {
      case "animated-button":
        return (
          <div className="w-full max-w-md bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 select-none">
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div>
                <h3 className="text-sm font-medium text-white">Interactive Action Stack</h3>
                <p className="text-[11px] text-zinc-400 font-light mt-0.5">High-stiffness spring feedback & damping</p>
              </div>
              <span className="text-[10px] font-mono uppercase font-medium" style={{ color }}>
                Spring
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <AnimatedButton
                variant="primary"
                showArrow
                style={{ backgroundColor: color }}
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
              <span className="text-xs font-mono uppercase text-zinc-400">Hook Rail Demonstration</span>
              <span className="text-[10px] font-mono font-medium" style={{ color }}>
                Stiffness: 420
              </span>
            </div>
            <HookSidebar
              label="SIDEBAR NAVIGATION"
              value={hookDemoIndex}
              onChange={setHookDemoIndex}
              color={color}
              items={[
                { label: "Overview" },
                { label: "Components" },
                { label: "Documentation" },
                { label: "Settings" },
              ]}
            />
          </div>
        );
      case "scales":
        return (
          <div className="w-full max-w-xl bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div>
                <h3 className="text-sm font-medium text-white">Architectural Scales</h3>
                <p className="text-[11px] text-zinc-400 font-light mt-0.5">Repeating linear gradient borders</p>
              </div>
              <span className="text-[10px] font-mono uppercase font-medium" style={{ color }}>
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
            <SpotlightCard className="p-6 border-white/10 bg-[#0c0c0e]" spotlightColor={color}>
              <h4 className="text-base font-medium text-white">Radial Spotlight</h4>
              <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                Smooth cursor tracking with radial falloff gradient.
              </p>
              <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Tailwind CSS</span>
                <span style={{ color }}>Active Theme</span>
              </div>
            </SpotlightCard>
          </div>
        );
      case "bento-grid":
        return (
          <div className="w-full max-w-lg bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <BentoGrid className="grid-cols-2 gap-3">
              <BentoCard colSpan={1} title="Telemetry" description="Real-time event logging." />
              <BentoCard colSpan={1} title="Throughput" description="Low latency processing." />
            </BentoGrid>
          </div>
        );
      case "glowing-badge":
        return (
          <div className="w-full max-w-md bg-[#0c0c0e] border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <GlowingBadge>PRODUCTION</GlowingBadge>
              <GlowingBadge style={{ borderColor: `${color}60`, color, boxShadow: `0 0 20px ${color}35` }}>
                LIVE
              </GlowingBadge>
            </div>
            <span className="text-xs font-mono text-zinc-500">Geometric status indicators</span>
          </div>
        );
      default:
        return <div className="text-zinc-500 font-mono text-xs">Preview unavailable</div>;
    }
  };

  return (
    <div className="h-screen w-screen bg-black text-[#f4f4f5] flex overflow-hidden select-none">
      <motion.aside
        initial={false}
        animate={{
          width: isFullscreen ? 0 : sidebarOpen ? 260 : 64,
          opacity: isFullscreen ? 0 : 1,
        }}
        transition={panelSpring}
        className="shrink-0 bg-black flex flex-col overflow-hidden h-full z-20 border-r border-white/5"
      >
        <div className="p-3.5 flex items-center justify-between h-14 shrink-0 border-b border-white/5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            transition={microSpring}
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg border border-white/10 bg-[#18181b] hover:bg-[#222226] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={microSpring}
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
            </motion.div>
          </motion.button>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence initial={false} mode="popLayout">
            {sidebarOpen ? (
              <motion.div
                key="sidebar-expanded"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={panelSpring}
                className="w-65 min-w-65 h-full overflow-y-auto px-4 pb-6 pt-3 space-y-6 scrollbar-none font-sans"
              >
                <Link
                  href="/components"
                  className="flex items-center justify-between text-xs font-medium text-zinc-300 hover:text-orange-400 transition-colors tracking-tight px-1 py-1"
                >
                  <span>All Components</span>
                  <ChevronRightIcon className="w-3.5 h-3.5 text-zinc-600" />
                </Link>

                <div className="space-y-6">
                  {CATEGORIES.map((cat) => {
                    const activeItemIdx = cat.items.findIndex(
                      (item) => item.slug === activeComponent.slug,
                    );

                    return (
                      <HookSidebar
                        key={cat.label}
                        label={cat.label}
                        value={activeItemIdx >= 0 ? activeItemIdx : -1}
                        items={cat.items.map((item) => ({
                          label: item.label,
                          href: item.href,
                          onClick: (e: React.MouseEvent<HTMLElement>) => {
                            if (
                              !e.metaKey &&
                              !e.ctrlKey &&
                              !e.shiftKey &&
                              e.button === 0
                            ) {
                              e.preventDefault();
                              handleSelectSlug(item.slug);
                            }
                          },
                        }))}
                        color={activeColor}
                        dashed={true}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sidebar-collapsed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={microSpring}
                className="w-16 h-full flex flex-col items-center py-4 gap-4"
              >
                <Link
                  href="/components"
                  title="All Components"
                  className="w-9 h-9 rounded-lg border border-white/5 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <LayersIcon className="w-4 h-4" />
                </Link>
                <div className="w-6 h-px bg-white/5" />
                <div className="flex flex-col gap-2">
                  {CATEGORIES.map((cat, idx) => (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => {
                        const first = cat.items[0];
                        if (first) {
                          handleSelectSlug(first.slug);
                        }
                      }}
                      title={cat.label}
                      className={cn(
                        "w-9 h-9 rounded-lg transition-colors font-mono text-[10px] flex items-center justify-center cursor-pointer",
                        cat.items.some(
                          (item) => item.slug === activeComponent.slug,
                        )
                          ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5",
                      )}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      <motion.div
        animate={{
          padding: isFullscreen ? "0px" : "14px",
          gap: isFullscreen ? "0px" : "16px",
        }}
        transition={panelSpring}
        className={cn(
          "flex-1 flex overflow-hidden h-full relative p-3.5 gap-4",
          isFullscreen && "p-0 gap-0",
        )}
      >
        <motion.main
          layout
          transition={panelSpring}
          animate={{
            borderRadius: isFullscreen ? 0 : 24,
            scale: activePanel === "code" ? 0.985 : 1,
            opacity: activePanel === "code" ? 0.75 : 1,
          }}
          className={cn(
            "relative border border-white/8 bg-[#0f0f11] flex flex-col overflow-hidden h-full flex-1",
            isFullscreen && "border-none",
          )}
        >
          <div className="h-14 px-5 border-b border-white/5 flex items-center justify-between z-20 shrink-0 bg-[#0f0f11]/80 backdrop-blur-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 shrink-0">
                {activeComponent.category}
              </span>
              <span className="text-zinc-700 shrink-0">/</span>
              <span className="text-xs font-sans font-medium text-white tracking-tight truncate">
                {activeComponent.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center p-0.5 rounded-lg border border-white/10 bg-[#18181b]/90 shadow-sm mr-1">
                <button
                  type="button"
                  onClick={() => setViewport("desktop")}
                  title="Desktop (100%)"
                  className={cn(
                    "p-1.5 rounded-md transition-colors cursor-pointer",
                    viewport === "desktop" ? "bg-white/15 text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <DesktopIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("tablet")}
                  title="Tablet (768px)"
                  className={cn(
                    "p-1.5 rounded-md transition-colors cursor-pointer",
                    viewport === "tablet" ? "bg-white/15 text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <ViewGridIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("mobile")}
                  title="Mobile (390px)"
                  className={cn(
                    "p-1.5 rounded-md transition-colors cursor-pointer",
                    viewport === "mobile" ? "bg-white/15 text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <MobileIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                transition={microSpring}
                type="button"
                onClick={handleInstallCopy}
                className="h-8 px-3 rounded-lg border border-white/10 bg-[#18181b]/90 hover:bg-[#222226] text-zinc-300 hover:text-white text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                {installCopied ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <span>npm i</span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                transition={microSpring}
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={
                  isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"
                }
                className="w-8 h-8 rounded-lg border border-white/10 bg-[#18181b]/90 hover:bg-[#222226] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
              >
                {isFullscreen ? (
                  <ExitFullScreenIcon className="w-3.5 h-3.5" />
                ) : (
                  <EnterFullScreenIcon className="w-3.5 h-3.5" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                transition={microSpring}
                type="button"
                onClick={() =>
                  setActivePanel(activePanel === "code" ? "none" : "code")
                }
                className={cn(
                  "h-8 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs transition-all cursor-pointer shadow-sm",
                  activePanel === "code"
                    ? "border-orange-500/80 text-orange-400 bg-orange-500/15 shadow-orange-500/10 shadow-md font-medium"
                    : "border-white/10 bg-[#18181b]/90 hover:bg-[#222226] text-zinc-400 hover:text-white",
                )}
              >
                <CodeIcon className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">Code</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                transition={microSpring}
                type="button"
                onClick={() =>
                  setActivePanel(activePanel === "info" ? "none" : "info")
                }
                className={cn(
                  "h-8 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs transition-all cursor-pointer shadow-sm",
                  activePanel === "info"
                    ? "border-orange-500/80 text-orange-400 bg-orange-500/15 shadow-orange-500/10 shadow-md font-medium"
                    : "border-white/10 bg-[#18181b]/90 hover:bg-[#222226] text-zinc-400 hover:text-white",
                )}
              >
                <InfoCircledIcon className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">Info</span>
              </motion.button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[20px_20px] opacity-15 pointer-events-none" />

            <motion.div
              layout
              transition={panelSpring}
              animate={{
                width: viewport === "mobile" ? 390 : viewport === "tablet" ? 768 : "100%",
                height: viewport === "mobile" ? 640 : viewport === "tablet" ? 520 : "100%",
                borderRadius: viewport === "mobile" ? 40 : viewport === "tablet" ? 24 : 0,
              }}
              className={cn(
                "relative flex flex-col items-center justify-center overflow-hidden transition-colors",
                viewport !== "desktop" &&
                  "border border-white/15 bg-[#09090b] shadow-[0_25px_60px_rgba(0,0,0,0.9)] my-auto max-h-[90vh]"
              )}
            >
              {viewport === "mobile" && (
                <div className="absolute top-3 inset-x-0 flex justify-center z-30 pointer-events-none">
                  <div className="w-20 h-3.5 bg-black rounded-full border border-white/10" />
                </div>
              )}

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeComponent.slug}
                  initial={{ opacity: 0, scale: 0.97, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -10 }}
                  transition={panelSpring}
                  className="w-full h-full flex items-center justify-center p-6 overflow-auto"
                >
                  {renderComponentPreview(activeComponent.slug, activeColor)}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              drag
              dragListener={false}
              dragControls={dragControls}
              dragMomentum={false}
              dragElastic={0.1}
              dragConstraints={{ left: -260, right: 260, top: -350, bottom: 20 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={panelSpring}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 rounded-full border border-white/10 bg-[#141416]/95 backdrop-blur-2xl px-3.5 py-2 shadow-[0_12px_36px_rgba(0,0,0,0.85)] flex items-center gap-2.5 select-none"
            >
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-300 pr-1 flex items-center touch-none"
              >
                <DragHandleDots2Icon className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-2">
                {PALETTE.map((p) => {
                  const isSelected = activeColor === p.hex;
                  return (
                    <motion.button
                      key={p.id}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.92 }}
                      transition={microSpring}
                      type="button"
                      onClick={() => setActiveColor(p.hex)}
                      title={p.label}
                      style={{ backgroundColor: p.hex }}
                      className={cn(
                        "w-7 h-7 rounded-xl transition-all cursor-pointer shadow-md",
                        isSelected
                          ? "scale-110 ring-2 ring-white/90 ring-offset-2 ring-offset-black"
                          : "opacity-75 hover:opacity-100"
                      )}
                    />
                  );
                })}
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {activePanel === "code" && (
              <>
                <motion.div
                  key="code-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setActivePanel("none")}
                  className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-30"
                />
                <motion.div
                  key="code-sheet"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={sheetSpring}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0.05, bottom: 0.4 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 100 || info.velocity.y > 400) {
                      setActivePanel("none");
                    }
                  }}
                  className="absolute inset-x-2 bottom-2 top-10 z-40 rounded-2xl border border-white/10 bg-[#0a0a0c] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
                >
                  <div className="pt-2.5 pb-1 flex justify-center shrink-0 cursor-grab active:cursor-grabbing">
                    <div className="w-10 h-1 bg-zinc-700/80 rounded-full" />
                  </div>

                  <div className="px-5 pb-3 border-b border-white/8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {activeComponent.files.map((file, idx) => (
                        <button
                          key={file.name}
                          type="button"
                          onClick={() => setSelectedFileIndex(idx)}
                          className={cn(
                            "relative px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer",
                            idx === selectedFileIndex
                              ? "text-white"
                              : "text-zinc-500 hover:text-zinc-300",
                          )}
                        >
                          {idx === selectedFileIndex && (
                            <motion.div
                              layoutId="active-code-tab"
                              transition={microSpring}
                              className="absolute inset-0 bg-white/10 border border-white/10 rounded-lg"
                            />
                          )}
                          <span className="relative z-10">{file.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.94 }}
                        transition={microSpring}
                        type="button"
                        onClick={handleInstallCopy}
                        className="border border-white/10 hover:border-white/20 bg-[#18181b] hover:bg-[#222226] text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                      >
                        {installCopied ? "Copied!" : "Install"}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.94 }}
                        transition={microSpring}
                        type="button"
                        onClick={handleCodeCopy}
                        className="w-8 h-8 rounded-lg border border-white/10 hover:border-white/20 bg-[#18181b] hover:bg-[#222226] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Copy code"
                      >
                        {codeCopied ? (
                          <CheckIcon className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <CopyIcon className="w-4 h-4" />
                        )}
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        transition={microSpring}
                        type="button"
                        onClick={() => setActivePanel("none")}
                        className="w-8 h-8 rounded-lg border border-white/10 hover:border-white/20 bg-[#18181b] hover:bg-[#222226] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Close (Esc)"
                      >
                        <Cross2Icon className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex-1 p-6 overflow-auto font-mono text-xs leading-relaxed bg-[#070709] select-text">
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
              </>
            )}
          </AnimatePresence>
        </motion.main>

        <AnimatePresence>
          {activePanel === "info" && (
            <motion.aside
              key="info-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 420, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={panelSpring}
              className="shrink-0 h-full border border-white/8 bg-[#0c0c0e] rounded-3xl overflow-hidden flex flex-col"
            >
              <div className="w-105 min-w-105 h-full p-6 sm:p-7 overflow-y-auto flex flex-col justify-between scrollbar-none">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  transition={{ staggerChildren: 0.05 }}
                  className="space-y-6"
                >
                  <motion.div
                    variants={fadeVariants}
                    className="flex items-center justify-between pb-2 border-b border-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-medium">
                        {activeComponent.slug.replace("-", " ")}
                      </span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      transition={microSpring}
                      type="button"
                      onClick={() => setActivePanel("none")}
                      className="w-7 h-7 rounded-lg border border-white/10 hover:border-white/20 bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                      title="Close (Esc)"
                    >
                      <Cross2Icon className="w-3.5 h-3.5" />
                    </motion.button>
                  </motion.div>

                  <motion.div variants={fadeVariants}>
                    <h2 className="text-xl sm:text-2xl font-serif text-white tracking-tight leading-snug">
                      {activeComponent.description}
                    </h2>
                  </motion.div>

                  <motion.div variants={fadeVariants} className="space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      Dependencies
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeComponent.dependencies.map((dep) => (
                        <span
                          key={dep}
                          className="inline-flex items-center gap-1.5 border border-white/10 bg-black/60 px-3 py-1 text-xs font-mono text-zinc-300 rounded-lg"
                        >
                          <span className="text-orange-500/70">~</span>
                          {dep}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={fadeVariants} className="space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      Interaction Physics
                    </div>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      Interactive spring-physics state dampening with smooth hover
                      transitions and tactile feedback.
                    </p>
                  </motion.div>

                  {activeComponent.props && activeComponent.props.length > 0 && (
                    <motion.div
                      variants={fadeVariants}
                      className="space-y-3 pt-4 border-t border-white/8"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                          Props Interface
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {activeComponent.props.length} configurable
                        </span>
                      </div>
                      <div className="border border-white/8 rounded-xl overflow-hidden bg-black/40">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-zinc-950 border-b border-white/8 text-zinc-500 font-mono text-[10px] uppercase">
                            <tr>
                              <th className="p-2.5 font-medium">Prop</th>
                              <th className="p-2.5 font-medium">Type</th>
                              <th className="p-2.5 font-medium">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/6 font-mono text-xs">
                            {activeComponent.props.map((p) => (
                              <tr
                                key={p.name}
                                className="hover:bg-white/5 transition-colors"
                              >
                                <td className="p-2.5">
                                  <span className="bg-zinc-900 border border-white/10 px-2 py-0.5 rounded text-orange-400 text-[11px]">
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
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
