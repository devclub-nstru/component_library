"use client";

import { useState } from "react";
import { ArrowUpRight, Check, MousePointer2, RotateCcw } from "lucide-react";
import { AsciiHoverButton } from "@/registry/ui/ascii-hover-button";
import { CandyButton } from "@/registry/ui/candy-button";
import { CurvedNavbar } from "@/registry/ui/curved-navbar";
import { FlipClock } from "@/registry/ui/flip-clock";
import { GooeyNav } from "@/registry/ui/gooey-nav";
import { MacSwitch } from "@/registry/ui/mac-switch";
import { Orb } from "@/registry/ui/orb";
import { Slider } from "@/registry/ui/slider";
import { SITE_CONFIG } from "@/lib/constants";
import { useIsDark } from "@/lib/use-is-dark";

const NAV_ITEMS = ["Buttons", "Motion", "Inputs"];
const NAV_PREVIEWS = [
  { label: "Explore buttons", href: "/components/candy-button" },
  { label: "Explore motion", href: "/components/scroll-text" },
  { label: "Explore inputs", href: "/components/slider" },
];

const CURVED_ITEMS = [
  { label: "Components", href: "/components" },
  { label: "Documentation", href: "/docs" },
  { label: "Curved Navbar", href: "/components/curved-navbar" },
];

export function LandingButtonsPreview() {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-3">
      <CandyButton
        color="#0074d4"
        aria-pressed={pressed}
        onClick={() => setPressed((value) => !value)}
        leftIcon={
          pressed ? <Check aria-hidden="true" /> : <MousePointer2 aria-hidden="true" />
        }
        className="rounded-full px-6 focus-visible:ring-[#0080fc] focus-visible:ring-offset-background motion-reduce:transform-none motion-reduce:transition-none"
      >
        {pressed ? "Feels good, right?" : "Give it a click"}
      </CandyButton>
      <AsciiHoverButton
        text="Hover me"
        color="blue"
        variant="outline"
        size="sm"
        onClick={() => setPressed(false)}
        rightIcon={<RotateCcw size={13} aria-hidden="true" />}
        className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0080fc] motion-reduce:transform-none motion-reduce:transition-none"
        aria-label="Reset the button demo"
      />
    </div>
  );
}

export function LandingControlsPreview() {
  const [intensity, setIntensity] = useState(64);
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="w-full max-w-72 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium">Personality</p>
        <MacSwitch
          size="sm"
          color="blue"
          material="frosted"
          checked={enabled}
          onChange={setEnabled}
          label="Enable personality"
          className="origin-right scale-[0.65] py-0"
        />
      </div>
      <Slider
        label="Intensity"
        value={intensity}
        onValueChange={setIntensity}
        disabled={!enabled}
        format={(value) => `${value}%`}
        className="[&_.bg-zinc-400]:bg-[#0074d4] dark:[&_.bg-zinc-400]:bg-[#0080fc]"
      />
    </div>
  );
}

export function LandingNavigationPreview() {
  const [selected, setSelected] = useState(0);
  const preview = NAV_PREVIEWS[selected];

  return (
    <div className="flex w-full flex-col items-center gap-7">
      <GooeyNav
        items={NAV_ITEMS}
        value={selected}
        onChange={setSelected}
        size="xs"
        separation={8}
        color="cyan"
        activeColor="#0074d4"
        activeLabelColor="#ffffff"
        aria-label="Component categories preview"
      />
      <a
        href={preview.href}
        className="flex items-center gap-2 text-center text-[11px] text-muted-foreground hover:text-[#0074d4] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0080fc]"
      >
        {preview.label}
        <ArrowUpRight size={13} aria-hidden="true" />
      </a>
    </div>
  );
}

export function LandingCurvedNavbarPreview() {
  const isDark = useIsDark();

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[radial-gradient(ellipse_at_50%_100%,#0080fc1a,transparent_70%)]">
      <div aria-hidden="true" className="absolute inset-x-8 bottom-7 h-16 rounded-t-[50%] border-t border-[#0080fc]/20" />
      <div aria-hidden="true" className="absolute inset-x-12 bottom-4 h-16 rounded-t-[50%] border-t border-[#0080fc]/10" />
      <CurvedNavbar
        brand="devclub"
        brandHref="/components"
        logoSrc={SITE_CONFIG.logos.icon}
        items={CURVED_ITEMS}
        actionLabel="Explore components"
        actionHref="/components"
        panelHeading=""
        panelDescription=""
        background={isDark ? "#111111" : "#e8e8df"}
        foreground={isDark ? "#f4f4f5" : "#09090b"}
        accent="#0080fc"
        curveRadius={18}
        duration={0.65}
        stiffness={0.15}
        className="absolute inset-x-0 top-0 [&_[data-navbar-entry]:has(h2)]:hidden [&_[data-navbar-entry]]:py-2 [&_div.grid:has(>div[data-navbar-entry])]:gap-2 [&_div.grid:has(>div[data-navbar-entry])]:p-3"
      />
    </div>
  );
}

export function LandingOrbPreview() {
  const isDark = useIsDark();

  return (
    <Orb
      defaultState="working"
      color="#0080fc"
      theme={isDark ? "dark" : "light"}
      display={144}
      speed={0.8}
      className="focus-visible:ring-[#0080fc] motion-reduce:transform-none motion-reduce:transition-none"
    />
  );
}

export function LandingClockPreview() {
  const isDark = useIsDark();
  const [hourFormat, setHourFormat] = useState<"12" | "24">("24");

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <FlipClock
        hourFormat={hourFormat}
        showSeconds
        showPeriod={false}
        showSeparator
        theme={isDark ? "dark" : "light"}
        cardSize={72}
        gap={8}
        borderRadius={8}
        ariaLabel="Your local time"
      />
      <button
        type="button"
        onClick={() => setHourFormat((format) => format === "24" ? "12" : "24")}
        aria-label="Use 12-hour time"
        aria-pressed={hourFormat === "12"}
        className="rounded-full border border-border px-3 py-1.5 text-[10px] text-muted-foreground hover:border-[#0080fc]/40 hover:text-[#0074d4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0080fc]"
      >
        {hourFormat}-hour time ↗
      </button>
    </div>
  );
}
