"use client";

import React, { useMemo, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ComponentCard } from "@/components/showcase/component-card";
import { getAllComponents } from "@/registry";
import { HorizontalScale, Lines } from "@/registry/ui/scales";
import { SparkleButton } from "@/registry/ui/sparkle-button";
import { CandyButton } from "@/registry/ui/candy-button";
import { AnimatedButton } from "@/registry/ui/animated-button";
import { SpotlightCard } from "@/registry/ui/spotlight-card";
import { PixelCard } from "@/registry/ui/pixel-card";
import { HookSidebar } from "@/registry/ui/hook-sidebar";
import { GitHubActivity } from "@/registry/ui/github-activity";
import { AnimatedCounter } from "@/registry/ui/animated-counter";
import { OtpInput } from "@/registry/ui/otp-input";
import { CodeBlock } from "@/registry/ui/code-block";
import { SmoothAccordion } from "@/registry/ui/smooth-accordion";
import { Accordion } from "@/registry/ui/accordion";
import { DottedAccordion } from "@/registry/ui/dotted-accordion";
import { Dither } from "@/registry/ui/dither";
import { AiOrb } from "@/registry/ui/ai-orb";
import { TwitterCard } from "@/registry/ui/twitter-card";
import { ToasterDemo } from "@/registry/ui/toast";
import { TaskList } from "@/registry/ui/task-list";
import { FileUpload } from "@/registry/ui/file-upload";
import { SearchComposer } from "@/registry/ui/search-input";
import { MorphSearch } from "@/registry/ui/morph-search";
import { Orb } from "@/registry/ui/orb";
import { LiquidToggle } from "@/registry/ui/liquid-toggle";
import { GooeyNav } from "@/registry/ui/gooey-nav";
import { PromptInput } from "@/registry/ui/ai-input";
import { MacSlider } from "@/registry/ui/mac-slider";
import { MacSwitch } from "@/registry/ui/mac-switch";
import { SpotlightSearch } from "@/registry/ui/spotlight-search";
import { ProfileMenu } from "@/registry/ui/profile-menu";
import { RevealSheet } from "@/registry/ui/reveal-sheet";
import { Editor } from "@/registry/ui/editor";
import { cn } from "@/lib/utils";

function CounterPreview() {
  const [val, setVal] = React.useState(122337);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setVal((v) => (v === 122337 ? 84920 : v === 84920 ? 142100 : 122337));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 py-3 select-none">
      <AnimatedCounter
        value={val}
        duration={0.5}
        grouping="indian"
        prefix={<span className="mr-0.5">₹</span>}
        className="font-mono text-3xl font-bold tracking-tight text-foreground **:data-[slot=animated-counter-mark]:mx-[-0.1em] sm:text-4xl"
      />
      <div className="flex items-center justify-between w-48 h-3 shrink-0">
        {Array.from({ length: 28 }).map((_, i) => {
          const progress = Math.min(
            1,
            Math.max(0, (val - 50000) / (150000 - 50000)),
          );
          const active = Math.round(progress * 27);
          return (
            <div
              key={i}
              className={cn(
                "w-[1.5px]",
                i === active
                  ? "h-4 -my-0.5 bg-orange-500"
                  : i < active
                    ? "h-2.5 bg-zinc-900 dark:bg-white"
                    : "h-2.5 bg-zinc-300 dark:bg-[#262626]",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function ComponentsPage() {
  const allComponents = useMemo(() => getAllComponents(), []);
  const [revealSheetOpen, setRevealSheetOpen] = useState(false);

  const previewRenderers: Record<string, React.ReactNode> = {
    scales: (
      <div className="w-full max-w-70 flex flex-col gap-3">
        <HorizontalScale className="w-full h-8" />
        <Lines className="w-full h-10" />
      </div>
    ),
    toast: (
      <div className="w-full flex flex-col items-center justify-center scale-90 origin-center select-none">
        <ToasterDemo />
      </div>
    ),
    "twitter-card": (
      <div className="flex flex-col items-center justify-center scale-[0.62] origin-center select-none">
        <TwitterCard
          username="hey_krishnna"
          name="KRISHNA 🤍"
          staticCard={true}
          enableCardTilt={false}
        />
      </div>
    ),
    "reveal-sheet": (
      <div className="flex flex-col items-center justify-center gap-3 select-none">
        <button
          type="button"
          onClick={() => setRevealSheetOpen(true)}
          className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
        >
          Open Reveal Sheet
        </button>
        <RevealSheet
          open={revealSheetOpen}
          onOpenChange={setRevealSheetOpen}
          side="right"
          title="Release checklist"
          description="Track the final details before this component ships."
        >
          <TaskList
            className="max-w-none"
            defaultTasks={[
              { id: "review", label: "Review the circular reveal", done: true },
              { id: "directions", label: "Test every opening direction" },
              { id: "accessibility", label: "Check keyboard and reduced motion" },
              { id: "publish", label: "Publish the component" },
            ]}
          />
        </RevealSheet>
      </div>
    ),
    "otp-input": (
      <div className="flex flex-col items-center gap-3 select-none pointer-events-none scale-90 sm:scale-95 origin-center">
        <OtpInput length={4} size="sm" status="idle" />
      </div>
    ),
    "sparkle-button": (
      <div className="flex flex-col items-center gap-3 select-none">
        <SparkleButton text="Generate Magic" activeText="Generating..." />
      </div>
    ),
    "candy-button": (
      <div className="flex flex-col items-center gap-3 select-none">
        <CandyButton variant="emerald" size="default">
          Emerald Candy
        </CandyButton>
        <CandyButton variant="ruby" size="sm">
          Ruby Gloss
        </CandyButton>
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
      <SpotlightCard className="w-full max-w-60 p-4 border-zinc-200 bg-white dark:border-white/10 dark:bg-black/80">
        <div className="text-xs font-medium text-zinc-900 dark:text-white">
          Radial Spotlight
        </div>
        <div className="text-[11px] text-zinc-500 mt-1 font-mono">
          GPU Accelerated
        </div>
      </SpotlightCard>
    ),
    "pixel-card": (
      <PixelCard
        className="w-full max-w-60 aspect-4/5 border-zinc-200 bg-white dark:border-white/10 dark:bg-black/80"
        variant="default"
        maxTilt={6}
      />
    ),
    "bento-grid": (
      <div className="w-full max-w-70 grid grid-cols-2 gap-2">
        <div className="p-3 border border-zinc-200 bg-zinc-100 text-left dark:border-white/10 dark:bg-zinc-950">
          <span className="text-[10px] font-mono text-zinc-500 block">
            Matrix
          </span>
          <span className="text-xs text-zinc-900 dark:text-white font-medium">
            Telemetry
          </span>
        </div>
        <div className="p-3 border border-zinc-200 bg-zinc-100 text-left dark:border-white/10 dark:bg-zinc-950">
          <span className="text-[10px] font-mono text-zinc-500 block">
            Latency
          </span>
          <span className="text-xs text-zinc-900 dark:text-white font-medium">
            12ms
          </span>
        </div>
      </div>
    ),
    "glowing-badge": (
      <div className="flex flex-col items-center gap-2 font-mono">
        <div className="border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs text-zinc-800 dark:border-white/20 dark:bg-zinc-950 dark:text-zinc-200">
          SYSTEM_ACTIVE
        </div>
        <div className="border border-orange-500/40 bg-orange-50 px-3 py-1 text-xs text-orange-600 dark:border-orange-500/40 dark:bg-zinc-950 dark:text-orange-400">
          PRODUCTION
        </div>
      </div>
    ),
    "hook-sidebar": (
      <div className="w-48 bg-white border border-zinc-200 rounded-xl p-3 pointer-events-none dark:bg-zinc-950/90 dark:border-white/10">
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
    "animated-counter": <CounterPreview />,
    "code-block": (
      <div className="w-full max-w-72 pointer-events-none scale-[0.68] origin-top-left overflow-hidden max-h-36 select-none">
        <CodeBlock color="#4ade80" />
      </div>
    ),
    "dotted-accordion": (
      <div className="w-full max-w-72 pointer-events-none scale-85 origin-center">
        <DottedAccordion
          defaultIndex={0}
          items={[
            {
              title: "Grid Architecture",
              description:
                "Sharp rectangular geometry with continuous dotted guide lines.",
            },
            {
              title: "Fade Mask Effect",
              description:
                "Vertical and horizontal guidelines exceeding bounds with smooth masks.",
            },
          ]}
        />
      </div>
    ),
    accordion: (
      <div className="w-full max-w-72 pointer-events-none scale-90 origin-center">
        <Accordion
          defaultIndex={0}
          items={[
            {
              title: "Letter Reveal",
              description: "Smooth blur bloom and spring physics per letter.",
            },
            {
              title: "Fluid Collapsing",
              description:
                "Synchronized height unfolding and click-outside close.",
            },
          ]}
        />
      </div>
    ),
    "smooth-accordion": (
      <div className="w-full max-w-72 pointer-events-none scale-90 origin-center">
        <SmoothAccordion
          type="single"
          defaultValue="preview-1"
          items={[
            {
              value: "preview-1",
              title: "Synchronized Motion",
              content: "Fluid height expansion with optical blur-reveal curve.",
            },
            {
              value: "preview-2",
              title: "Concurrent Collapsing",
              content: "Active panel closes simultaneously as new ones expand.",
            },
          ]}
        />
      </div>
    ),
    dither: (
      <div className="w-full h-44 rounded-lg overflow-hidden border border-zinc-200 dark:border-white/10 relative pointer-events-none">
        <Dither
          color1="#FF9FFC"
          color2="#5227FF"
          color3="#0A0A10"
          grainAmount={0.12}
          grainScale={2.0}
          warpStrength={1.0}
          timeSpeed={0.25}
          className="w-full h-full"
        />
      </div>
    ),
    "ai-orb": (
      <div className="flex items-center justify-center p-2 scale-75 origin-center pointer-events-none">
        <AiOrb size={130} />
      </div>
    ),
    "task-list": (
      <div className="w-full max-w-72 scale-90 origin-center pointer-events-none select-none">
        <TaskList
          size="sm"
          defaultTasks={[
            { id: "p1", label: "Refactor spring curves", done: false },
            { id: "p2", label: "Micro-particle bursts", done: true },
          ]}
        />
      </div>
    ),
    "file-upload": (
      <div className="pointer-events-none w-full max-w-80 origin-center scale-75 select-none">
        <FileUpload uploadFile={async (_file, onProgress) => onProgress(100)} />
      </div>
    ),
    "search-input": (
      <div className="w-full max-w-sm scale-90 origin-center pointer-events-none select-none px-2">
        <SearchComposer
          value="AI copilot"
          onChange={() => {}}
          onSubmit={() => {}}
          onClear={() => {}}
          busy={false}
          placeholder="What are we overthinking today?"
          autoFocus={false}
        />
      </div>
    ),
    "morph-search": (
      <div className="w-full max-w-sm scale-90 origin-center pointer-events-none select-none px-2">
        <MorphSearch
          placeholder="pizza or burgers for friday?"
          autoFocus={false}
        />
      </div>
    ),
    orb: (
      <div className="flex items-center justify-center p-3 select-none pointer-events-none">
        <Orb display={72} size={64} interactive={false} />
      </div>
    ),
    "liquid-toggle": (
      <div className="flex items-center justify-center p-3 select-none pointer-events-none">
        <LiquidToggle defaultChecked={true} size="md" color="monochrome" />
      </div>
    ),
    "mac-slider": (
      <div className="w-full flex items-center justify-center p-2 pointer-events-none scale-75 origin-center">
        <MacSlider defaultValue={45} />
      </div>
    ),
    "mac-switch": (
      <div className="w-full flex items-center justify-center p-2 pointer-events-none scale-75 origin-center">
        <MacSwitch defaultChecked={true} />
      </div>
    ),
    "spotlight-search": (
      <div className="w-full flex items-center justify-center p-2 pointer-events-none scale-70 origin-center">
        <SpotlightSearch />
      </div>
    ),
    "gooey-nav": (
      <div className="flex items-center justify-center p-3 select-none pointer-events-none scale-85 origin-center">
        <GooeyNav
          items={["Deploy", "Builds", "Logs"]}
          defaultValue={0}
          size="sm"
          color="orange"
        />
      </div>
    ),
    "ai-input": (
      <div className="w-full flex items-center justify-center scale-90 origin-center pointer-events-none select-none px-2">
        <PromptInput placeholder="Ask anything" />
      </div>
    ),
    "profile-menu": (
      <div className="w-full flex items-center justify-center p-2 pointer-events-none scale-75 origin-center">
        <ProfileMenu />
      </div>
    ),
    editor: (
      <div className="w-full flex items-center justify-center p-2 scale-75 origin-center">
        <Editor
          title="AI Selection"
          answer="DevClub UI provides accessible, physics-driven components for React and Next.js applications."
        >
          Select any text here to format or ask questions.
        </Editor>
      </div>
    ),
  };

  const newReleases = allComponents.slice(0, 3);
  const displayComponents = allComponents.slice(3);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-foreground max-w-3xl leading-tight">
            20+ rare and unique components
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mt-4 font-light leading-relaxed">
            Every component is a single file you own, not a dependency you
            install. Built with clean geometry, minimal aesthetics, and high
            performance.
          </p>
        </div>

        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-sm sm:text-xl font-medium font-serif text-foreground tracking-tight">
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
                <h2 className="text-sm sm:text-xl font-medium font-serif text-foreground tracking-tight">
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
