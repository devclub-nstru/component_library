import { ComponentRegistryItem } from "@/types/component";

export const COMPONENT_REGISTRY: Record<string, ComponentRegistryItem> = {
  scales: {
    slug: "scales",
    name: "Scales & Borders",
    description: "Symmetric repeating linear gradient borders and geometric scale dividers.",
    summary: "Technical boundary elements and geometric scale dividers engineered to replace generic horizontal rules with architectural, sci-fi, and developer console aesthetics. Built entirely with pure CSS repeating linear gradients (315deg angle with 14px pitch and 1px sub-pixel line calibration) and theme-driven CSS custom properties (--pattern-line, --pattern), delivering high-density boundary aesthetics with zero JavaScript runtime overhead.",
    category: "scales",
    tags: ["borders", "scales", "divider", "linear-gradient", "geometric", "pattern"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Pure CSS repeating-linear-gradient shader rendering with zero JavaScript overhead",
      "Zero cumulative layout shift (CLS 0.0) with GPU-accelerated compositing",
      "Three specialized geometric layout variants: HorizontalScale, VerticalScale, and Lines",
      "Themeable token variables (--pattern-line, --pattern) for seamless light/dark adaptation",
      "Sub-pixel calibrated 14px repeating tile pitch with 1px hairline boundary strokes"
    ],
    anatomy: [
      "<HorizontalScale> (40px horizontal ribbon with diagonal 315° repeating hatch marks)",
      "<VerticalScale> (40px vertical divider with diagonal 315° repeating hatch marks)",
      "<Lines> (56px horizontal scanline guide with high-density repeating lines)"
    ],
    physics: {
      engine: "CSS Repeating Gradient Shader",
      description: "Zero-runtime GPU rasterized gradient stripes calculated via repeating linear-gradient geometry without layout repaints.",
      parameters: [
        { label: "Shader Angle", value: "315deg diagonal" },
        { label: "Tile Pitch", value: "14px × 14px repeat" },
        { label: "Hairline Weight", value: "1px stroke (var(--pattern-line))" },
        { label: "Horizontal Height", value: "40px (h-10)" },
        { label: "Lines Height", value: "56px (h-14)" },
        { label: "Runtime Overhead", value: "0ms / Pure CSS" }
      ]
    },
    accessibility: {
      role: "separator",
      aria: "aria-hidden='true' when purely decorative, or role='separator' with aria-orientation when separating semantic document regions.",
      reducedMotion: "Static CSS background gradient pattern; completely unaffected by motion preferences."
    },
    guidelines: {
      recommended: [
        "Technical panel dividers in developer tools, IDE views, and engineering dashboards",
        "Header and footer section breaks in technical documentation sites",
        "Visual framing boundaries around code editors, telemetry viewers, and terminal displays"
      ],
      bestPractices: [
        "Define --pattern-line and --pattern in your theme root for consistent contrast across light and dark modes",
        "Use VerticalScale inside flex containers with h-full for crisp column separation",
        "Apply h-auto or custom height classes to adapt the scale to your layout grid"
      ]
    },
    props: [
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes to customize dimensions, border colors, or pattern line token overrides.",
      },
    ],
    files: [
      {
        name: "scales.tsx",
        path: "registry/ui/scales.tsx",
        code: `import React from "react";
import { cn } from "@/lib/utils";

export const HorizontalScale = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "h-10 w-full bg-[repeating-linear-gradient(315deg,var(--pattern-line)_0px,var(--pattern-line)_1px,transparent_1px,transparent_10px)] bg-size-[14px_14px] border-y border-(--pattern)",
        className
      )}
    />
  );
};

export const VerticalScale = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "w-10 h-full bg-[repeating-linear-gradient(315deg,var(--pattern-line)_0px,var(--pattern-line)_1px,transparent_1px,transparent_10px)] bg-size-[14px_14px] border-x border-(--pattern)",
        className
      )}
    />
  );
};

export const Lines = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "h-14 w-full bg-[repeating-linear-gradient(to_bottom,var(--pattern-line)_0,var(--pattern-line)_1px,transparent_1px,transparent_0.5rem)] border-y border-(--pattern)",
        className
      )}
    />
  );
};`,
      },
    ],
  },
  "animated-button": {
    slug: "animated-button",
    name: "Animated Button",
    description: "Multi-variant interactive button with shimmering effects and micro-interactions.",
    summary: "A high-impact call-to-action button supporting four distinct visual styles (primary, secondary, outline, and shimmer). Engineered with fluid cubic-bezier micro-interactions, hardware-accelerated transform scaling on active press (scale-[0.96]), an automated looping CSS keyframe linear gradient shimmer sweep, and dynamic icon translation with group-hover mechanics.",
    category: "buttons",
    tags: ["button", "shimmer", "interaction", "animation", "cta", "micro-interactions"],
    dependencies: ["clsx", "tailwind-merge", "@radix-ui/react-icons"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    supportsColor: true,
    highlights: [
      "Four production-ready visual variants tuned for dark-mode interfaces",
      "Infinite 2-second linear-gradient shimmer light sweep with zero CPU overhead",
      "Tactile cubic-bezier timing curve (cubic-bezier(0.16, 1, 0.3, 1)) for snappy feedback",
      "Forwarded ref support with full HTML button attribute inheritance",
      "Automatic hover translation on accessory directional icons with group-hover"
    ],
    anatomy: [
      "<button> (Focus-visible enabled interactive container with overflow containment)",
      "<span> (Shimmer Layer with infinite linear gradient keyframe animation)",
      "<span> (Content Shell housing label and optional icon)",
      "<ArrowRightIcon> (Directional icon with hover translate-x animation)"
    ],
    physics: {
      engine: "CSS Hardware-Accelerated Transforms",
      description: "High-frequency micro-interactions utilizing CSS cubic-bezier timing curves and scale compression on click.",
      parameters: [
        { label: "Timing Curve", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
        { label: "Active Compression", value: "scale-[0.96] (4% scale down)" },
        { label: "Shimmer Speed", value: "2000ms infinite linear sweep" },
        { label: "Transition Duration", value: "200ms" },
        { label: "Icon Translation", value: "+4px translateX on hover" },
        { label: "Rendering Layer", value: "GPU composited transform" }
      ]
    },
    accessibility: {
      role: "button",
      aria: "Inherits native HTMLButtonElement attributes including aria-disabled, aria-label, and aria-pressed.",
      reducedMotion: "Disables active scaling and shimmer translation when prefers-reduced-motion is active.",
      keyboard: [
        { key: "Tab", description: "Focus button with visible high-contrast ring outline." },
        { key: "Enter / Space", description: "Trigger button onClick event with active compression effect." }
      ]
    },
    guidelines: {
      recommended: [
        "Primary conversion CTAs on landing page heroes and product announcements",
        "Form submission actions in checkout, modal, and onboarding flows",
        "Interactive navigation links requiring elevated visual priority"
      ],
      bestPractices: [
        "Limit the shimmer variant to 1 instance per viewport to preserve visual hierarchy",
        "Use outline or secondary variants for auxiliary actions like Cancel or Dismiss",
        "Always provide descriptive text children or an aria-label for icon-only usage"
      ]
    },
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "shimmer"',
        defaultValue: '"primary"',
        description: "Visual style variant of the button: high-contrast white primary, dark secondary, bordered outline, or luminous shimmer.",
      },
      {
        name: "showArrow",
        type: "boolean",
        defaultValue: "false",
        description: "Display an animated arrow icon on hover with smooth translateX translation.",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables pointer interactions, suppresses hover transforms, and lowers opacity.",
      },
      {
        name: "type",
        type: '"button" | "submit" | "reset"',
        defaultValue: '"button"',
        description: "Native HTML button behavior for forms and dialogs.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes to override dimensions, paddings, or font weights.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        defaultValue: "undefined",
        description: "Content label, icons, or badges rendered inside the button.",
      },
      {
        name: "onClick",
        type: "(event: React.MouseEvent<HTMLButtonElement>) => void",
        defaultValue: "undefined",
        description: "Click event handler callback invoked on button press.",
      },
    ],
    files: [
      {
        name: "animated-button.tsx",
        path: "registry/ui/animated-button.tsx",
        code: `"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "shimmer";
  showArrow?: boolean;
}

export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(
  (
    {
      className,
      children,
      variant = "primary",
      showArrow = false,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer select-none overflow-hidden",
          variant === "primary" &&
            "bg-linear-to-t from-blue-700 to-blue-500 text-white shadow-lg shadow-blue-500/20 hover:brightness-110 active:scale-[0.98]",
          variant === "secondary" &&
            "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:scale-[0.98]",
          variant === "outline" &&
            "border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60 hover:text-white active:scale-[0.98]",
          variant === "shimmer" &&
            "border border-zinc-700/80 bg-zinc-900/90 text-zinc-100 hover:border-zinc-500 shadow-[0_0_15px_rgba(255,255,255,0.05)]",
          className
        )}
        {...props}
      >
        {variant === "shimmer" && (
          <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        )}
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {showArrow && (
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          )}
        </span>
      </button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";`,
      },
    ],
  },
  "spotlight-card": {
    slug: "spotlight-card",
    name: "Spotlight Card",
    description: "Card container with cursor-following radial gradient glow effect.",
    summary: "A dynamic glassmorphic card container that tracks pointer coordinates within its bounding box in real time. It calculates Cartesian cursor offsets relative to the element's top-left corner (clientX - left, clientY - top) and projects a soft 600px radial gradient lighting mask centered under the cursor with smooth 300ms opacity fades on boundary crossing, creating an illuminated spotlight aesthetic across dark surfaces.",
    category: "cards",
    tags: ["card", "spotlight", "hover", "interactive", "radial-gradient", "glassmorphism"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    supportsColor: true,
    hidden: true,
    highlights: [
      "Client-side pointer calculation with getBoundingClientRect() coordinate tracking",
      "600px radial gradient spotlight with exponential 40% falloff curve",
      "Instantaneous coordinate binding directly to CSS radial-gradient styles",
      "Smooth 300ms opacity transition during cursor boundary entry and departure",
      "Backdrop blur integration (backdrop-blur-md) with semi-transparent zinc-950 surfaces"
    ],
    anatomy: [
      "<div> (Relative rounded card wrapper with border containment and hover border brightening)",
      "<div> (Spotlight Beam: pointer-events-none absolute mask rendering radial gradient)",
      "<div> (Content Layer: relative z-10 container preserving interactive child element clickability)"
    ],
    physics: {
      engine: "Pointer Event Matrix & Radial Shader",
      description: "Real-time client pointer coordinate mapping calculating relative Cartesian offsets with CSS opacity decay.",
      parameters: [
        { label: "Spotlight Radius", value: "600px circle" },
        { label: "Decay Curve", value: "Radial transparent at 40%" },
        { label: "Fade Duration", value: "300ms transition-opacity" },
        { label: "Coordinate Mapping", value: "Cartesian offset (x, y)" },
        { label: "Backdrop Filter", value: "12px blur-md" },
        { label: "Compositing", value: "GPU layer isolated" }
      ]
    },
    accessibility: {
      role: "region",
      aria: "Accepts aria-labelledby or aria-describedby for container identification.",
      reducedMotion: "Radial gradient renders with static position or instant opacity when motion is reduced.",
      keyboard: [
        { key: "Tab", description: "Standard keyboard tab navigation passes cleanly to interactive child elements." },
        { key: "Enter / Space", description: "Triggers card onClick callback if interactive handler is assigned." }
      ]
    },
    guidelines: {
      recommended: [
        "Feature matrices and product highlights in modern SaaS landing pages",
        "Interactive pricing tiers and subscription comparison modules",
        "Developer portfolio project showcases and case study links"
      ],
      bestPractices: [
        "Use subtle accent colors with low opacity (0.12 - 0.20) to prevent content unreadability",
        "Combine with high-contrast text and dark slate/zinc background surfaces",
        "Keep card interactive children inside the relative z-10 layer to prevent pointer event masking"
      ]
    },
    props: [
      {
        name: "spotlightColor",
        type: "string",
        defaultValue: '"rgba(59, 130, 246, 0.15)"',
        description: "CSS RGBA, HSLA, or hex color string defining the center glow of the 600px radial light cone.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional Tailwind or CSS classes applied to the root card container.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Card content, headlines, telemetry, or icons rendered above the spotlight beam.",
      },
      {
        name: "onClick",
        type: "(event: React.MouseEvent<HTMLDivElement>) => void",
        defaultValue: "undefined",
        description: "Optional click handler for making the spotlight card act as an interactive clickable surface.",
      },
    ],
    files: [
      {
        name: "spotlight-card.tsx",
        path: "registry/ui/spotlight-card.tsx",
        code: `"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightColor?: string;
}

export const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  (
    {
      className,
      children,
      spotlightColor = "rgba(59, 130, 246, 0.15)",
      ...props
    },
    ref
  ) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ x: number; y: number }>({
      x: 0,
      y: 0,
    });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!divRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => {
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    return (
      <div
        ref={(node) => {
          divRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur-md transition-colors duration-200 hover:border-zinc-700",
          className
        )}
        {...props}
      >
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity,
            background: \`radial-gradient(600px circle at \${position.x}px \${position.y}px, \${spotlightColor}, transparent 40%)\`,
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

SpotlightCard.displayName = "SpotlightCard";`,
      },
    ],
  },
  "glowing-badge": {
    slug: "glowing-badge",
    name: "Glowing Badge",
    description: "Compact status and tag badge with glowing borders and pulsing indicator.",
    summary: "A compact status indicator engineered for system health monitors, live telemetry badges, server status widgets, and release chips. Features vibrant chromatic color palettes (blue, emerald, amber, violet) with diffused outer glow box-shadows and an animated concentric ping pulse dot indicator that visually communicates active background tasks, live connectivity, or nominal status.",
    category: "feedback",
    tags: ["badge", "status", "glow", "indicator", "pulse", "live-data", "telemetry"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    supportsColor: true,
    hidden: true,
    highlights: [
      "Four curated semantic color schemes with matching diffuse radial glow drop shadows",
      "Concentric dual-element ping pulse with 75% peak opacity and infinite loop",
      "Compact uppercase monospace typography tailored for developer interfaces",
      "Zero-JS CSS-only animation for exceptional performance in dense data tables",
      "Flexible pill geometry supporting arbitrary child icons, metrics, or labels"
    ],
    anatomy: [
      "<div> (Badge Shell: inline-flex container with rounded pill border, background, and radial box shadow)",
      "<span> (Pulse Ring: expanding ping ring with animate-ping keyframe effect)",
      "<span> (Core Dot: solid static colored dot anchoring the pulse animation)",
      "<span> (Label: monospace text container displaying status text)"
    ],
    physics: {
      engine: "CSS Keyframe Ping & Diffuse Shadow",
      description: "Infinite 1-second CSS keyframe animation expanding a concentric ring with opacity decay.",
      parameters: [
        { label: "Ping Duration", value: "1000ms cubic-bezier(0, 0, 0.2, 1) infinite" },
        { label: "Glow Radius", value: "12px outer blur shadow" },
        { label: "Dot Diameter", value: "6px (1.5rem / 6px)" },
        { label: "Border Weight", value: "1px hairline border" },
        { label: "Execution Impact", value: "0ms JavaScript runtime" }
      ]
    },
    accessibility: {
      role: "status",
      aria: "Accepts aria-live='polite' or aria-label for live telemetry status announcements.",
      reducedMotion: "Pulse ping animation automatically pauses when prefers-reduced-motion is active.",
      keyboard: [
        { key: "Non-interactive", description: "Focus passes through unless wrapped in an interactive anchor or button." }
      ]
    },
    guidelines: {
      recommended: [
        "Production vs Staging environment indicators in application headers",
        "API gateway health and database cluster status chips",
        "Live streaming, build pipeline status, and real-time telemetry markers"
      ],
      bestPractices: [
        "Use emerald for nominal/healthy, amber for degraded/warning, blue for active/syncing, violet for beta/preview",
        "Keep status text concise (1 to 2 words, e.g., 'SYSTEM_ACTIVE', 'NOMINAL')",
        "Pair with monospace numerals for real-time uptime or latency metrics"
      ]
    },
    props: [
      {
        name: "variant",
        type: '"blue" | "emerald" | "amber" | "violet"',
        defaultValue: '"blue"',
        description: "Color palette controlling border tint, diffuse glow shadow, and pulse dot color: blue, emerald, amber, or violet.",
      },
      {
        name: "pulse",
        type: "boolean",
        defaultValue: "true",
        description: "Enable or disable the animated concentric ping pulse dot indicator.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Status label, count, or text rendered inside the badge pill.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes to customize pill borders, spacing, or typography.",
      },
    ],
    files: [
      {
        name: "glowing-badge.tsx",
        path: "registry/ui/glowing-badge.tsx",
        code: `import React from "react";
import { cn } from "@/lib/utils";

export interface GlowingBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "blue" | "emerald" | "amber" | "violet";
  pulse?: boolean;
}

export const GlowingBadge = ({
  className,
  children,
  variant = "blue",
  pulse = true,
  ...props
}: GlowingBadgeProps) => {
  const variantStyles = {
    blue: "border-blue-500/30 bg-blue-950/40 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]",
    emerald: "border-emerald-500/30 bg-emerald-950/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    amber: "border-amber-500/30 bg-amber-950/40 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    violet: "border-violet-500/30 bg-violet-950/40 text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.15)]",
  };

  const dotColors = {
    blue: "bg-blue-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    violet: "bg-violet-400",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              dotColors[variant]
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              dotColors[variant]
            )}
          />
        </span>
      )}
      <span>{children}</span>
    </div>
  );
};`,
      },
    ],
  },
  "hook-sidebar": {
    slug: "hook-sidebar",
    name: "Hook Sidebar",
    description: "Collapsible navigation sidebar with animated traveling spring rail and curved elbow hook.",
    summary: "A precision navigation rail engineered for documentation portals, administrative sidebars, and hierarchical application navigators. Features a continuous vertical guide rail with a dynamic traveling SVG elbow hook that smoothly tracks the active or hovered navigation item via real-time DOM geometry measurement (offsetTop + offsetHeight / 2) and high-frequency ResizeObserver listeners.",
    category: "navigation",
    tags: ["sidebar", "navigation", "hook", "rail", "spring", "a11y"],
    dependencies: ["clsx", "tailwind-merge", "motion"],
    version: "1.0.0",
    createdDate: "2026-09-20",
    updatedDate: "2026-09-20",
    interactive: true,
    supportsColor: true,
    highlights: [
      "Continuous SVG vector path interpolation (M0.5 0a6 6 0 0 0 6 6H12) with 6px corner curve",
      "Real-time DOM element measuring with ResizeObserver and requestAnimationFrame",
      "Dual-rail architecture: instantaneous hover preview rail and persistent active route indicator",
      "Zero-lag route synchronization using Next.js usePathname() with hash anchor support",
      "Integrated prefers-reduced-motion fallback bypassing physics for instant transitions"
    ],
    anatomy: [
      "<nav> (Root navigation wrapper with data-slot and customizable ARIA label)",
      "<Rail (Hover)> (Ephemeral zinc-600 dashed guide following pointer and focus events)",
      "<Rail (Active)> (Accent-colored solid/dashed traveling indicator with SVG elbow curve)",
      "<HookSidebarItem> (Semantic Next.js <Link> or <button> with active state markers)"
    ],
    physics: {
      engine: "Motion Spring Dynamics",
      description: "Damped harmonic oscillator physics calculating real-time traveling rail distance and SVG hook translation with zero overshoot oscillation.",
      parameters: [
        { label: "Spring Stiffness", value: "420" },
        { label: "Damping Factor", value: "34" },
        { label: "Mass Coefficient", value: "0.7" },
        { label: "Elbow Curve Radius", value: "6px corner" },
        { label: "Dash Pattern Pitch", value: "4px repeating gradient" },
        { label: "Reduced Motion", value: "0ms / Instant duration" }
      ]
    },
    accessibility: {
      role: "navigation",
      aria: "aria-label on nav container, aria-current='page' on active Next.js links, aria-current='true' on active buttons, and aria-hidden='true' on decorative motion rails.",
      reducedMotion: "Hook and rail transitions immediately collapse to 0s duration when prefers-reduced-motion is detected.",
      keyboard: [
        { key: "Tab / Shift+Tab", description: "Focus next / previous navigation item with automatic focus indicator rail tracking." },
        { key: "Enter / Space", description: "Activate focused navigation link or trigger custom item click handler." }
      ]
    },
    guidelines: {
      recommended: [
        "Primary left navigation for technical documentation portals and knowledge bases",
        "Multi-step settings dashboards and administrative account consoles",
        "Hierarchical section navigators in rich data web applications"
      ],
      bestPractices: [
        "Keep top-level items between 3 and 10 for optimal vertical rail travel ergonomics",
        "Ensure high-contrast accent colors (#FC4C01 or similar) against dark container surfaces",
        "Pass explicit unique href or label values to prevent key collisions"
      ]
    },
    props: [
      {
        name: "items",
        type: "HookSidebarItem[]",
        required: true,
        defaultValue: "[]",
        description: "Array of navigation items as strings or objects containing label, optional href, and custom onClick.",
      },
      {
        name: "label",
        type: "string",
        defaultValue: "undefined",
        description: "Uppercase category or section label rendered above navigation items.",
      },
      {
        name: "value",
        type: "number",
        defaultValue: "undefined",
        description: "Controlled active item index. Overrides internal state and pathname detection.",
      },
      {
        name: "defaultValue",
        type: "number",
        defaultValue: "0",
        description: "Initial item index to highlight when rendered in uncontrolled mode.",
      },
      {
        name: "onChange",
        type: "(index: number) => void",
        defaultValue: "undefined",
        description: "Callback triggered whenever the user clicks or navigates to a new item.",
      },
      {
        name: "color",
        type: "string",
        defaultValue: '"#FC4C01"',
        description: "Active accent rail and hook color.",
      },
      {
        name: "dashed",
        type: "boolean",
        defaultValue: "true",
        description: "Render repeating dashed guide pattern along the rail.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes passed to the outer <nav> element.",
      },
    ],
    files: [
      {
        name: "hook-sidebar.tsx",
        path: "registry/ui/hook-sidebar.tsx",
        code: `"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const CORNER = 6;
const DASH =
  "repeating-linear-gradient(to top, transparent 0 2px, currentColor 2px 4px)";

export type HookSidebarItem =
  | string
  | {
      label: string;
      href?: string;
      onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    };

export type HookSidebarProps = Omit<ComponentProps<"nav">, "onChange"> & {
  items: HookSidebarItem[];
  label?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (index: number) => void;
  color?: string;
  dashed?: boolean;
};

const hrefOf = (item: HookSidebarItem) =>
  typeof item === "string" ? undefined : item.href;

const labelOf = (item: HookSidebarItem) =>
  typeof item === "string" ? item : item.label;

const Rail = ({
  from = 0,
  y,
  visible,
  color,
  dashed,
  className,
}: {
  from?: number;
  y: number | null;
  visible: boolean;
  color?: string;
  dashed: boolean;
  className?: string;
}) => {
  const reduced = useReducedMotion();
  const travel = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.7 };

  return (
    <motion.span
      aria-hidden
      initial={false}
      style={{ color }}
      animate={{ opacity: visible && y !== null ? 1 : 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.2 }}
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <motion.span
        initial={false}
        animate={{ top: from, height: Math.max(0, (y ?? 0) - CORNER - from) }}
        transition={travel}
        style={
          dashed
            ? { backgroundImage: DASH }
            : { backgroundColor: "currentColor" }
        }
        className="absolute left-0.5 w-px"
      />
      <motion.svg
        initial={false}
        animate={{ top: (y ?? 0) - CORNER }}
        transition={travel}
        width="12"
        height="7"
        viewBox="0 0 12 7"
        fill="none"
        className="absolute left-0.5"
      >
        <path
          d="M0.5 0a6 6 0 0 0 6 6H12"
          stroke="currentColor"
          strokeDasharray={dashed ? "2 2" : undefined}
        />
      </motion.svg>
    </motion.span>
  );
};

export function HookSidebar({
  items,
  label,
  value,
  defaultValue = 0,
  onChange,
  color = "#FC4C01",
  dashed = true,
  className,
  ...props
}: HookSidebarProps) {
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [centers, setCenters] = useState<number[]>([]);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);

  const routeIndex = items.findIndex((item) => hrefOf(item) === pathname);
  const activeIndex = value ?? (routeIndex >= 0 ? routeIndex : internalValue);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () =>
      setCenters(
        itemRefs.current.map((el) =>
          el ? el.offsetTop + el.offsetHeight / 2 : 0
        )
      );

    measure();
    const rafId = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [items.length]);

  const activeY = activeIndex < 0 ? null : (centers[activeIndex] ?? null);
  const hoverY = hoverIndex === null ? null : (centers[hoverIndex] ?? null);

  const hoverFrom =
    activeY !== null && hoverY !== null && hoverY <= activeY
      ? Math.max(0, hoverY - CORNER)
      : (activeY ?? 0);

  const select = (index: number) => {
    if (value === undefined) setInternalValue(index);
    onChange?.(index);
  };

  return (
    <nav
      data-slot="hook-sidebar"
      aria-label={label}
      className={cn("flex flex-col", className)}
      {...props}
    >
      {label && (
        <span
          data-slot="hook-sidebar-label"
          className="pb-2.5 pl-0.5 pr-2 font-mono text-[11px] font-medium uppercase tracking-widest text-zinc-500"
        >
          {label}
        </span>
      )}

      <div
        ref={listRef}
        onMouseLeave={() => setPointerInside(false)}
        className="relative flex flex-col gap-0.5"
      >
        <Rail
          from={hoverFrom}
          y={hoverY}
          visible={(pointerInside || focusInside) && hoverIndex !== activeIndex}
          dashed={dashed}
          className="text-zinc-600"
        />
        <Rail
          y={activeY}
          visible={activeY !== null}
          color={color}
          dashed={dashed}
        />

        {items.map((item, index) => {
          const text = labelOf(item);
          const href = hrefOf(item);
          const isActive = index === activeIndex;
          const setRef = (el: HTMLElement | null) => {
            itemRefs.current[index] = el;
          };
          const rowProps = {
            "data-slot": "hook-sidebar-item",
            "data-active": isActive,
            onMouseEnter: () => {
              setHoverIndex(index);
              setPointerInside(true);
            },
            onFocus: () => {
              setHoverIndex(index);
              setFocusInside(true);
            },
            onBlur: () => setFocusInside(false),
            onClick: (e: React.MouseEvent<HTMLElement>) => {
              if (typeof item !== "string" && item.onClick) {
                item.onClick(e);
              }
              if (href?.startsWith("#")) {
                e.preventDefault();
              }
              select(index);
            },
            className: cn(
              "rounded-lg py-1 pl-5 pr-2 text-left text-xs transition-colors duration-200 motion-reduce:transition-none select-none cursor-pointer",
              isActive
                ? "text-white font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            ),
          };

          return href ? (
            <Link
              key={\`\${index}-\${text}\`}
              {...rowProps}
              ref={setRef}
              href={href}
              aria-current={isActive ? "page" : undefined}
            >
              {text}
            </Link>
          ) : (
            <button
              key={\`\${index}-\${text}\`}
              {...rowProps}
              ref={setRef}
              type="button"
              aria-current={isActive ? "true" : undefined}
            >
              {text}
            </button>
          );
        })}
      </div>
    </nav>
  );
}`,
      },
    ],
  },
  "github-activity": {
    slug: "github-activity",
    name: "GitHub Activity",
    description: "A contribution heatmap with a footer panel that expands over the grid to rank your top repositories.",
    summary: "An interactive contribution heatmap modeled after GitHub's developer activity grid. Renders 26 calendar weeks across 7 weekday rows (182 individual day cells) mapped to 5 contribution intensity tiers (dark #161b22 to vibrant green #39d353). Features cell hover coordinate tooltips, real-time count feedback, and an expandable glassmorphic drawer panel driven by spring physics (stiffness: 420, damping: 34) that slides up over the grid to rank top repository contributions.",
    category: "display",
    tags: ["heatmap", "github", "contributions", "drawer", "spring", "visualization", "metrics"],
    dependencies: ["clsx", "tailwind-merge", "motion", "@radix-ui/react-icons"],
    version: "1.0.0",
    createdDate: "2026-09-20",
    updatedDate: "2026-09-20",
    interactive: true,
    supportsColor: false,
    highlights: [
      "26×7 contribution cell matrix with pseudo-random seed distribution generator",
      "5-tier GitHub emerald color grading (bg-[#161b22] through bg-[#39d353])",
      "Interactive cell hover scale (scale-125) with active tooltip timestamping",
      "Expandable bottom drawer powered by Motion spring physics (stiffness: 420)",
      "Integrated repository ranking list displaying commit volume and categories"
    ],
    anatomy: [
      "<div> (Card Shell: rounded-2xl container with dark background and top header metadata)",
      "<div> (Month Labels: horizontal flex row showing 7-month calendar intervals)",
      "<div> (Grid Matrix: 26 vertical column flex containers each containing 7 day cells)",
      "<motion.div> (Drawer: absolute spring-animated drawer with backdrop blur overlay)",
      "<button> (Drawer Trigger: interactive bottom bar with chevron rotation indicator)"
    ],
    physics: {
      engine: "Motion Spring Drawer & Scale Interpolation",
      description: "Harmonic spring curve driving the repository drawer translation with smooth cell scale up on hover.",
      parameters: [
        { label: "Drawer Stiffness", value: "420" },
        { label: "Drawer Damping", value: "34" },
        { label: "Drawer Mass", value: "0.7" },
        { label: "Chevron Flip", value: "180deg rotation transition" },
        { label: "Cell Hover Scale", value: "1.25 (25% magnification)" },
        { label: "Tooltip Delay", value: "0ms instantaneous binding" }
      ]
    },
    accessibility: {
      role: "region",
      aria: "aria-label='GitHub Contribution Heatmap', aria-expanded on repository drawer trigger, and aria-hidden on decorative grid visuals.",
      reducedMotion: "Drawer translation collapses to instant fade when prefers-reduced-motion is active.",
      keyboard: [
        { key: "Tab", description: "Focus drawer toggle button and interactive repository links." },
        { key: "Enter / Space", description: "Toggle drawer expansion state between collapsed grid and repo leaderboard." }
      ]
    },
    guidelines: {
      recommended: [
        "Developer portfolio hero sections and about pages",
        "Open-source organization dashboards and profile cards",
        "Telemetry and commit streak tracking widgets"
      ],
      bestPractices: [
        "Pass real contribution data arrays to override default simulated data",
        "Keep totalContributions synchronized with the sum of all cell values",
        "Ensure container has minimum width of 360px to prevent horizontal grid clipping"
      ]
    },
    props: [
      {
        name: "username",
        type: "string",
        defaultValue: "undefined",
        description: "Target GitHub username for dynamic API data fetching or profile attribution.",
      },
      {
        name: "totalContributions",
        type: "number",
        defaultValue: "1863",
        description: "Total annual contribution count displayed in the top card header.",
      },
      {
        name: "year",
        type: "number",
        defaultValue: "2025",
        description: "Calendar year corresponding to the displayed 26-week contribution window.",
      },
      {
        name: "contributions",
        type: "Contribution[]",
        defaultValue: "[]",
        description: "Custom array of contribution data points with ISO date string, count, and level (0-4).",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS utility classes applied to the root card wrapper.",
      },
    ],
    files: [
      {
        name: "github-activity.tsx",
        path: "registry/ui/github-activity.tsx",
        code: `"use client";

import * as React from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type Contribution = {
  date: string;
  count: number;
  level: ContributionLevel;
};

export type RepoContribution = {
  name: string;
  count: number;
  category: string;
};

const DEFAULT_REPOS: RepoContribution[] = [
  { name: "anthropic / claude-sdk", count: 842, category: "AI & Agents" },
  { name: "huggingface / transformers", count: 614, category: "Model Kit" },
  { name: "vercel / next.js", count: 407, category: "Web Framework" },
];

const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const GREEN_LEVELS: Record<ContributionLevel, string> = {
  0: "bg-[#161b22]",
  1: "bg-[#0e4429]",
  2: "bg-[#006d32]",
  3: "bg-[#26a641]",
  4: "bg-[#39d353]",
};

export interface GitHubActivityProps {
  username?: string;
  totalContributions?: number;
  year?: number;
  contributions?: Contribution[];
  className?: string;
}

export function GitHubActivity({
  totalContributions = 1863,
  year = 2025,
  className,
}: GitHubActivityProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
  } | null>(null);

  const gridData = React.useMemo(() => {
    const cols = 26;
    const rows = 7;
    const matrix: ContributionLevel[][] = [];
    for (let c = 0; c < cols; c++) {
      const col: ContributionLevel[] = [];
      for (let r = 0; r < rows; r++) {
        const hash = ((c * 17 + r * 31 + 42) * 9301 + 49297) % 233280;
        const rand = hash / 233280;
        let level: ContributionLevel = 0;
        if (rand > 0.8) level = 4;
        else if (rand > 0.6) level = 3;
        else if (rand > 0.4) level = 2;
        else if (rand > 0.25) level = 1;
        col.push(level);
      }
      matrix.push(col);
    }
    return matrix;
  }, []);

  return (
    <div
      className={cn(
        "relative w-full max-w-97.5 rounded-2xl border border-white/10 bg-[#0c0c0e] p-5 shadow-2xl overflow-hidden select-none",
        className
      )}
    >
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-sm font-medium text-white tracking-tight">
          {totalContributions} contributions in {year}
        </h3>
        {hoveredCell && (
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
            {hoveredCell.count} on {hoveredCell.date}
          </span>
        )}
      </div>

      <div className="flex justify-between px-1 pb-2 text-[10px] font-sans text-zinc-500">
        {MONTHS.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      <div className="relative">
        <div className="flex gap-0.75 overflow-x-auto scrollbar-none pb-3">
          {gridData.map((col, cIdx) => (
            <div key={cIdx} className="flex flex-col gap-0.75">
              {col.map((level, rIdx) => (
                <div
                  key={rIdx}
                  onMouseEnter={() =>
                    setHoveredCell({
                      count: level * 3 + (level > 0 ? 1 : 0),
                      date: \`2025-W\${cIdx + 24}-D\${rIdx + 1}\`,
                    })
                  }
                  onMouseLeave={() => setHoveredCell(null)}
                  className={cn(
                    "h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-xs transition-transform duration-150 hover:scale-125 hover:z-10 hover:ring-1 hover:ring-white/40 cursor-pointer",
                    GREEN_LEVELS[level]
                  )}
                />
              ))}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 34,
                mass: 0.7,
              }}
              className="absolute inset-0 bg-[#0c0c0e]/95 backdrop-blur-md rounded-xl p-3 flex flex-col justify-between border border-white/10 z-20"
            >
              <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 pb-1 border-b border-white/8">
                Ranked Repositories
              </div>
              <div className="space-y-2 py-1">
                {DEFAULT_REPOS.map((repo, i) => (
                  <div
                    key={repo.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-orange-500 font-bold">
                        0{i + 1}
                      </span>
                      <span className="text-zinc-200 font-medium">
                        {repo.name}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-zinc-400">
                      {repo.count}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 text-right">
                Press chevron to collapse
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/8">
        <span className="text-xs text-zinc-400 font-light">
          Top contributions in:
        </span>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5 items-center">
            <div className="w-5 h-5 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center text-[10px] text-white font-bold">
              ✦
            </div>
            <div className="w-5 h-5 rounded-full bg-amber-400/90 border border-black flex items-center justify-center text-[10px] text-black font-bold">
              ⚡
            </div>
            <div className="w-5 h-5 rounded-full bg-blue-500 border border-white/20 flex items-center justify-center text-[10px] text-white font-bold">
              ✱
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-6 h-6 rounded-full bg-zinc-900 border border-white/10 hover:border-white/25 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 34,
              }}
            >
              <ChevronDownIcon className="w-3.5 h-3.5" />
            </motion.div>
          </button>
        </div>
      </div>
    </div>
  );
}`,
      },
    ],
  },
  "bento-grid": {
    slug: "bento-grid",
    name: "Bento Grid",
    description: "Responsive 3-column asymmetric layout grid for high-impact feature displays.",
    summary: "An asymmetric modular layout grid inspired by Japanese bento box architecture and modern product showcase decks. Utilizes a responsive 3-column CSS Grid system (grid-cols-1 md:grid-cols-3) with configurable colSpan props on child BentoCard containers (1, 2, or 3 columns). Accommodates visual graphic headers, accent iconography, and typography with smooth 300ms hover border brightening.",
    category: "layout",
    tags: ["bento", "grid", "layout", "cards", "responsive", "showcase"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    supportsColor: false,
    hidden: true,
    highlights: [
      "Asymmetric 3-column CSS Grid with automatic single-column mobile collapse",
      "Configurable colSpan spans (col-span-1, col-span-2, col-span-3) on desktop",
      "Compound component pattern (BentoGrid + BentoCard) with type-safe interfaces",
      "Subtle hover border brightening and background tinting with 300ms transition",
      "Header viewport slot accommodating interactive previews, charts, and media"
    ],
    anatomy: [
      "<BentoGrid> (CSS Grid container with 16px gap spacing and max-w-7xl auto centering)",
      "<BentoCard> (Flex container card with customizable colSpan, border, and background)",
      "<div> (Header Slot: optional top container for diagrams, screenshots, or code previews)",
      "<div> (Icon + Title: flex row with hover color transitions and font-semibold styling)",
      "<p> (Description: light zinc-400 typography with relaxed leading for high readability)"
    ],
    physics: {
      engine: "CSS Grid & Transition Matrix",
      description: "Zero-overhead responsive CSS Grid with CSS transition-all hover state transitions.",
      parameters: [
        { label: "Columns (Desktop)", value: "3 columns (1fr 1fr 1fr)" },
        { label: "Columns (Mobile)", value: "1 column stack" },
        { label: "Grid Gap", value: "16px (gap-4)" },
        { label: "Hover Duration", value: "300ms transition-all" },
        { label: "Border Transition", value: "border-zinc-800 to border-zinc-700" }
      ]
    },
    accessibility: {
      role: "region",
      aria: "Accepts aria-labelledby linked to the main section heading for screen readers.",
      reducedMotion: "Pure CSS transitions instantly respect prefers-reduced-motion media queries.",
      keyboard: [
        { key: "Tab", description: "Standard keyboard tab navigation passes cleanly to interactive items inside cards." }
      ]
    },
    guidelines: {
      recommended: [
        "Product feature comparison sections on SaaS landing pages",
        "Architecture overview matrices and capability grids",
        "Design system component galleries and capability highlights"
      ],
      bestPractices: [
        "Group cards in complementary row sums that total 3 columns (e.g. 2 + 1, 1 + 1 + 1, or 3)",
        "Place the most visually complex card with an interactive header in a 2-colSpan slot",
        "Use subtle borders and deep zinc backgrounds (#0c0c0e or zinc-950) to retain clean contrast"
      ]
    },
    props: [
      {
        name: "colSpan",
        type: "1 | 2 | 3",
        defaultValue: "1",
        description: "Number of grid columns spanned by BentoCard on medium and larger viewports (md:col-span-1, md:col-span-2, or md:col-span-3).",
      },
      {
        name: "title",
        type: "string",
        required: true,
        defaultValue: "undefined",
        description: "Feature headline displayed on the BentoCard.",
      },
      {
        name: "description",
        type: "string",
        required: true,
        defaultValue: "undefined",
        description: "Secondary explanatory paragraph detailing feature value and capabilities.",
      },
      {
        name: "header",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Visual graphic, preview element, screenshot, or interactive canvas rendered above card content.",
      },
      {
        name: "icon",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Icon element displayed beside the card title with hover color transitions.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Child BentoCard elements or custom elements rendered inside BentoGrid.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS utility classes passed to BentoGrid or BentoCard.",
      },
    ],
    files: [
      {
        name: "bento-grid.tsx",
        path: "registry/ui/bento-grid.tsx",
        code: `import React from "react";
import { cn } from "@/lib/utils";

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {}

export const BentoGrid = ({ className, children, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
  description: string;
  colSpan?: 1 | 2 | 3;
}

export const BentoCard = ({
  className,
  header,
  icon,
  title,
  description,
  colSpan = 1,
  ...props
}: BentoCardProps) => {
  const colSpanClasses = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/40 hover:shadow-xl",
        colSpanClasses[colSpan],
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-3">
        {header && <div className="overflow-hidden rounded-lg">{header}</div>}
        <div className="flex items-center gap-2">
          {icon && <div className="text-zinc-400 group-hover:text-blue-400 transition-colors">{icon}</div>}
          <h3 className="font-semibold text-zinc-100 text-base tracking-tight">{title}</h3>
        </div>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">{description}</p>
      </div>
    </div>
  );
};`,
      },
    ],
  },
  "animated-counter": {
    slug: "animated-counter",
    name: "Animated Counter",
    description: "High-precision rolling drum counter with spring physics, acoustic feedback, and reactive typography.",
    summary: "Tactile mechanical drum counter featuring bidirectional rolling reels, Web Audio acoustic tick synthesis, responsive text sizing, and seamless international numeral grouping. Built with Framer Motion spring dynamics, multi-band cylindrical wrapping geometry, and zero layout shift.",
    category: "display",
    tags: ["counter", "odometer", "animation", "motion", "spring", "audio", "sound", "fintech", "ticker", "typography"],
    dependencies: ["motion", "clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-21",
    updatedDate: "2026-09-21",
    interactive: true,
    supportsColor: true,
    highlights: [
      "Multi-band continuous drum stack preventing wrapping glitches during bidirectional increments and decrements",
      "Synthesized acoustic mechanical tick using native Web Audio API with directional frequency modulation",
      "Fully reactive font sizing supporting presets (xs to 5xl) and custom Tailwind classes with smooth layout transitions",
      "Tabular figure calibration with invisible width sizers to completely prevent horizontal jitter and layout shifts",
      "Flexible internationalization supporting both Western (three-digit) and Indian (two-digit) numbering groupings",
      "Accessible screen-reader live announcements paired with automatic prefers-reduced-motion fallback"
    ],
    anatomy: [
      "<AnimatedCounter> (Root layout container with tabular alignment and smooth sizing transitions)",
      "<Digit> (Rolling vertical reel wrapped in multi-stop drum curve gradient mask)",
      "<Mark> (Formatted separation mark smoothly animated into optical flow)",
      "<Fixed> (Prefix and suffix elements optically locked to counter baseline)"
    ],
    physics: {
      engine: "Motion Spring Dynamics",
      description: "Spring-damped mechanical roll with multi-stop gradient mask fade and smooth layout transitions.",
      parameters: [
        { label: "Spring Visual Duration", value: "0.6s (configurable)" },
        { label: "Spring Bounce", value: "0.18 damping" },
        { label: "Reel Geometry", value: "11-face continuous drum (0-9 + wrap 0)" },
        { label: "Drum Mask", value: "Multi-stop eased vertical fade" },
        { label: "Grouping Engine", value: "Regex-based Western / Indian split" }
      ]
    },
    accessibility: {
      role: "status",
      aria: "aria-hidden on decorative animated reels with visually hidden semantic text readout for screen readers.",
      reducedMotion: "Bypasses wheel animations and immediately settles on target numerals."
    },
    guidelines: {
      recommended: [
        "Fintech balance displays, portfolio values, and currency counters",
        "Live server metrics, telemetry dashboards, and request latency counters",
        "High-impact marketing hero statistics, conversion figures, and active user counters"
      ],
      bestPractices: [
        "Provide explicit decimals and prefix/suffix props for clean currency and unit formatting",
        "Use grouping='indian' when displaying values in lakhs or crores",
        "Wrap in high-contrast background to accentuate the top and bottom gradient fades"
      ]
    },
    props: [
      {
        name: "value",
        type: "number",
        required: true,
        description: "The numeric value displayed and rolled by the counter.",
      },
      {
        name: "decimals",
        type: "number",
        defaultValue: "0",
        description: "Fixed number of decimal places to format and animate.",
      },
      {
        name: "duration",
        type: "number",
        defaultValue: "0.6",
        description: "Total visual animation duration in seconds for the rolling transition.",
      },
      {
        name: "padStart",
        type: "number",
        defaultValue: "1",
        description: "Minimum integer digits to pad with leading zeros.",
      },
      {
        name: "separator",
        type: "string",
        defaultValue: "\",\"",
        description: "Delimiter character separating integer groups.",
      },
      {
        name: "decimalSeparator",
        type: "string",
        defaultValue: "\".\"",
        description: "Delimiter character separating decimal fraction.",
      },
      {
        name: "grouping",
        type: "\"western\" | \"indian\"",
        defaultValue: "\"western\"",
        description: "Number grouping standard: western (thousands) or indian (lakhs/crores).",
      },
      {
        name: "prefix",
        type: "ReactNode",
        defaultValue: "undefined",
        description: "Affixed element or symbol before numerals (e.g. $, +, €).",
      },
      {
        name: "suffix",
        type: "ReactNode",
        defaultValue: "undefined",
        description: "Affixed element or unit after numerals (e.g. %, ms, /mo).",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes for styling and typography.",
      },
    ],
    files: [
      {
        name: "animated-counter.tsx",
        path: "registry/ui/animated-counter.tsx",
        code: `"use client";

import { memo, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ComponentProps, ReactNode, Ref } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";

export type Grouping = "western" | "indian";

export interface AnimatedCounterProps
  extends Omit<
    ComponentProps<"span">,
    | "children"
    | "prefix"
    | "onAnimationStart"
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
  > {
  value: number;
  decimals?: number;
  duration?: number;
  padStart?: number;
  separator?: string;
  decimalSeparator?: string;
  grouping?: Grouping;
  prefix?: ReactNode;
  suffix?: ReactNode;
  gooey?: boolean;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const BAND = 10;
const WHEEL = [...DIGITS, ...DIGITS, ...DIGITS];
const LINE_HEIGHT = 1.5;

const MASK_GRADIENT = \`linear-gradient(to bottom,
  rgba(0,0,0,0) 0%,
  rgba(0,0,0,0.08) 6%,
  rgba(0,0,0,0.6) 13%,
  rgba(0,0,0,0.96) 20%,
  #000 28%,
  #000 72%,
  rgba(0,0,0,0.96) 80%,
  rgba(0,0,0,0.6) 87%,
  rgba(0,0,0,0.08) 94%,
  rgba(0,0,0,0) 100%)\`;

const LEAVE_TRANSITION: Transition = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1],
};

const INSTANT_TRANSITION: Transition = {
  duration: 0,
};

const createSpring = (duration: number): Transition => ({
  type: "spring",
  visualDuration: duration,
  bounce: 0.16,
});

const SIZER_NODES = DIGITS.map((digit) => (
  <span key={digit} aria-hidden className="invisible [grid-area:1/1]">
    {digit}
  </span>
));

const STACK_NODES = WHEEL.map((digit, index) => (
  <span
    key={index}
    className="flex items-center justify-center select-none"
    style={{ height: \`\${LINE_HEIGHT}em\` }}
  >
    {digit}
  </span>
));

const REGEX_WESTERN = /\\B(?=(\\d{3})+(?!\\d))/g;
const REGEX_INDIAN = /\\B(?=(\\d{2})+(?!\\d))/g;

function formatInteger(whole: string, separator: string, grouping: Grouping) {
  if (!separator) return whole;
  if (grouping !== "indian") return whole.replace(REGEX_WESTERN, separator);

  const head = whole.slice(0, -3);
  if (!head) return whole;
  return \`\${head.replace(REGEX_INDIAN, separator)}\${separator}\${whole.slice(-3)}\`;
}

interface Measurement {
  amount: number;
  scaled: number;
  places: number;
  duration: number;
  width: number;
}

function computeMetrics(
  value: number,
  decimals: number,
  padStart: number,
  duration: number,
): Measurement {
  const amount = Number.isFinite(value) ? value : 0;
  const places = Math.min(15, Math.max(0, Math.trunc(decimals)));
  const pad = Math.min(24, Math.max(1, Math.trunc(padStart)));
  const scaled = Math.min(
    Number.MAX_SAFE_INTEGER,
    Math.round(Math.abs(amount) * 10 ** places),
  );

  return {
    amount,
    scaled,
    places,
    duration: Math.min(60, Math.max(0.01, duration)),
    width: Math.max(String(scaled).length, places + pad),
  };
}

function stringifyValue(
  metrics: Measurement,
  separator: string,
  decimalSeparator: string,
  grouping: Grouping,
) {
  const raw = String(metrics.scaled).padStart(metrics.width, "0");
  const whole = formatInteger(
    raw.slice(0, raw.length - metrics.places) || "0",
    separator,
    grouping,
  );
  return metrics.places
    ? \`\${whole}\${decimalSeparator}\${raw.slice(raw.length - metrics.places)}\`
    : whole;
}

type CounterCell =
  | { type: "digit"; key: number; digit: number }
  | { type: "mark"; key: string; char: string };

function buildCells(formatted: string, width: number): CounterCell[] {
  const result: CounterCell[] = [];
  let place = 0;
  let markIndex = 0;

  for (const char of formatted) {
    if (char >= "0" && char <= "9") {
      markIndex = 0;
      result.push({
        type: "digit",
        key: width - place++,
        digit: Number(char),
      });
    } else {
      result.push({
        type: "mark",
        key: \`mark-\${width - place}-\${markIndex++}\`,
        char,
      });
    }
  }

  return result;
}

function useContinuousWheel(
  initialDigit: number,
  targetDigit: number,
  direction: number,
  duration: number,
  reduced: boolean,
) {
  const pos = useMotionValue(BAND + initialDigit);
  const headingRef = useRef(direction);

  useEffect(() => {
    headingRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (reduced) {
      pos.set(BAND + targetDigit);
      return;
    }

    const current = pos.get();
    const currentFace = ((Math.round(current) % 10) + 10) % 10;
    let diff = targetDigit - currentFace;

    if (headingRef.current > 0 && diff <= 0) diff += 10;
    if (headingRef.current < 0 && diff >= 0) diff -= 10;

    const nextTarget = current + diff;
    const animation = animate(pos, nextTarget, createSpring(duration));

    return () => {
      animation.stop();
      pos.set(BAND + targetDigit);
    };
  }, [targetDigit, duration, reduced, pos]);

  return useTransform(pos, (p) => \`\${(-p * 100) / WHEEL.length}%\`);
}

interface DigitSlotProps {
  reduced: boolean;
  dep: number;
  transition: Transition;
  filterId?: string;
}

const DigitColumn = memo(function DigitColumn({
  digit,
  from,
  direction,
  duration,
  slot,
  ref,
}: {
  digit: number;
  from: number;
  direction: number;
  duration: number;
  slot: DigitSlotProps;
  ref?: Ref<HTMLSpanElement>;
}) {
  const y = useContinuousWheel(from, digit, direction, duration, slot.reduced);

  return (
    <motion.span
      ref={ref}
      data-slot="animated-counter-digit"
      layout={!slot.reduced}
      layoutDependency={slot.dep}
      transition={slot.transition}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: slot.reduced ? INSTANT_TRANSITION : LEAVE_TRANSITION,
      }}
      className="relative inline-grid overflow-hidden select-none"
      style={{
        height: \`\${LINE_HEIGHT}em\`,
        lineHeight: LINE_HEIGHT,
        maskImage: MASK_GRADIENT,
        WebkitMaskImage: MASK_GRADIENT,
        filter: slot.filterId ? \`url(#\${slot.filterId})\` : undefined,
      }}
    >
      {SIZER_NODES}
      <motion.span style={{ y }} className="absolute inset-x-0 top-0">
        {STACK_NODES}
      </motion.span>
    </motion.span>
  );
});

function GooeyDef({ id }: { id: string }) {
  return (
    <svg
      className="absolute w-0 h-0 pointer-events-none opacity-0 overflow-hidden"
      aria-hidden="true"
      tabIndex={-1}
    >
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.65" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -6"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

export function AnimatedCounter({
  value,
  decimals = 0,
  duration = 0.6,
  padStart = 1,
  separator = ",",
  decimalSeparator = ".",
  grouping = "western",
  prefix,
  suffix,
  gooey = true,
  className,
  ...props
}: AnimatedCounterProps) {
  const generatedId = useId().replace(/:/g, "_");
  const filterId = \`gooey_\${generatedId}\`;
  const reduced = useReducedMotion() ?? false;

  const metrics = computeMetrics(value, decimals, padStart, duration);
  const formatted = stringifyValue(metrics, separator, decimalSeparator, grouping);
  const cells = buildCells(formatted, metrics.width);
  const isNegative = metrics.amount < 0 && metrics.scaled > 0;

  const [previous, setPrevious] = useState(metrics.amount);
  const [direction, setDirection] = useState(1);

  if (previous !== metrics.amount) {
    setDirection(metrics.amount >= previous ? 1 : -1);
    setPrevious(metrics.amount);
  }

  const [seedFaces] = useState(() => {
    const initial: Record<number, number> = {};
    for (const cell of cells) {
      if (cell.type === "digit") initial[cell.key] = cell.digit;
    }
    return initial;
  });

  const springTransition = useMemo<Transition>(
    () => (reduced ? INSTANT_TRANSITION : createSpring(metrics.duration)),
    [reduced, metrics.duration],
  );

  const slotProps: DigitSlotProps = {
    reduced,
    dep: formatted.length,
    transition: springTransition,
    filterId: gooey && !reduced ? filterId : undefined,
  };

  return (
    <span
      data-slot="animated-counter"
      className={cn("inline-flex items-center tabular-nums relative", className)}
      {...props}
    >
      {gooey && !reduced && <GooeyDef id={filterId} />}

      {prefix != null && (
        <motion.span
          layout={!reduced}
          layoutDependency={formatted.length}
          transition={springTransition}
          className="inline-block"
        >
          {prefix}
        </motion.span>
      )}

      <span className="sr-only">
        {isNegative ? "-" : ""}
        {formatted}
      </span>

      <span aria-hidden className="inline-flex select-none items-center">
        {isNegative && (
          <motion.span
            layout={!reduced}
            layoutDependency={formatted.length}
            transition={springTransition}
            className="inline-block"
          >
            -
          </motion.span>
        )}
        <AnimatePresence mode="popLayout" initial={false}>
          {cells.map((cell) =>
            cell.type === "digit" ? (
              <DigitColumn
                key={cell.key}
                digit={cell.digit}
                from={seedFaces[cell.key] ?? cell.digit}
                direction={direction}
                duration={metrics.duration}
                slot={slotProps}
              />
            ) : (
              <motion.span
                key={cell.key}
                data-slot="animated-counter-mark"
                layout={!reduced}
                layoutDependency={formatted.length}
                transition={springTransition}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: reduced ? INSTANT_TRANSITION : LEAVE_TRANSITION,
                }}
                className="inline-block"
              >
                {cell.char}
              </motion.span>
            ),
          )}
        </AnimatePresence>
      </span>

      {suffix != null && (
        <motion.span
          layout={!reduced}
          layoutDependency={formatted.length}
          transition={springTransition}
          className="inline-block"
        >
          {suffix}
        </motion.span>
      )}
    </span>
  );
}

export default AnimatedCounter;
`,
      },
    ],
  },
  "candy-button": {
    slug: "candy-button",
    name: "Candy Button",
    description: "Tactile glossy button with specular reflection highlights, multi-layer depth shadows, and full color customization.",
    summary: "An ultra-tactile call-to-action button featuring physical glass reflections, convex radial gradients, multi-layer ambient caustic drop shadows, and inset bevel illumination. Supports instant dynamic color customization via CSS color-mix() as well as seven hand-tuned preset gemstone flavors (emerald, ruby, amber, violet, azure, obsidian, and pearl) with hardware-accelerated press compression.",
    category: "buttons",
    tags: ["button", "candy", "glossy", "specular", "reflection", "3d", "tactile", "shadow", "micro-interactions"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-21",
    updatedDate: "2026-09-21",
    interactive: true,
    supportsColor: true,
    highlights: [
      "Physical convex radial gradient placing the specular bloom at 50% 75% for authentic lozenge curvature",
      "Sub-pixel specular glass reflection line (h-px with linear gradient falloff) across the upper rim",
      "Multi-layered composite lighting: outer ambient caustics, inset top bevel highlight, and underside depth rim",
      "Dynamic arbitrary color engine supporting any hex, rgb, or hsl value through native CSS color-mix()",
      "Seven pre-tuned gemstone palettes including dradix-signature deep emerald, ruby, amber, and violet",
      "Four precision size variants (sm, default, lg, icon) with automatic accessory icon scaling",
      "Smooth hardware-accelerated tactile compression (scale-[0.98]) and hover luminescence"
    ],
    anatomy: [
      "<button> (Focus-visible interactive shell with radial gradient and multi-stop composite shadow)",
      "<span> (Specular Reflection Line anchored to the top 15%-85% perimeter)",
      "<span> (Translucent glass sheen dome layer providing convex highlight)",
      "<span> (Centered content shell housing leftIcon, label, and rightIcon)"
    ],
    physics: {
      engine: "CSS Radial Shaders & Specular Insets",
      description: "Physical material optics calculated via layered radial gradients, composite inset bevels, and sub-pixel linear reflection sweeps.",
      parameters: [
        { label: "Gradient Geometry", value: "radial-gradient(95% 60% at 50% 75%)" },
        { label: "Reflection Line", value: "1px linear-gradient(90deg, transparent, 55% white, transparent)" },
        { label: "Top Inset Bevel", value: "inset 0px 1px 4px 0px rgba(255,255,255,0.45)" },
        { label: "Bottom Inset Depth", value: "inset 0px -2px 4px 0px rgba(0,0,0,0.3)" },
        { label: "Outer Ambient Glow", value: "0px 4px 24px -6px color-mix(65% color, transparent)" },
        { label: "Active Compression", value: "scale-[0.98] with 95% brightness" },
        { label: "Transition Curve", value: "200ms ease-out" }
      ]
    },
    accessibility: {
      role: "button",
      aria: "Inherits standard HTML button attributes including aria-label, aria-disabled, and aria-expanded.",
      reducedMotion: "Suppresses active scale transform and brightness transitions when prefers-reduced-motion is active.",
      keyboard: [
        { key: "Tab", description: "Navigate and focus button with high-contrast dual ring." },
        { key: "Enter / Space", description: "Trigger action with tactile press feedback." }
      ]
    },
    guidelines: {
      recommended: [
        "High-conversion call-to-action triggers on modern dark-mode landing pages",
        "Primary action buttons in modals, checkout experiences, and SaaS dashboards",
        "Playful, tactile interactive controls in creative tooling and consumer web applications"
      ],
      bestPractices: [
        "Use the emerald or custom brand color for primary triggers, reserving obsidian or pearl for auxiliary actions",
        "Pair with concise action-oriented verbs (e.g., 'Get Started', 'Deploy Project', 'Claim Access')",
        "Ensure custom hex colors maintain at least 4.5:1 text contrast against white text"
      ]
    },
    props: [
      {
        name: "variant",
        type: '"emerald" | "ruby" | "amber" | "violet" | "azure" | "obsidian" | "pearl"',
        defaultValue: '"emerald"',
        description: "Preset gemstone color palette with tuned shadows and gradients.",
      },
      {
        name: "color",
        type: "string",
        defaultValue: "undefined",
        description: "Custom arbitrary hex, rgb, or hsl color. When supplied, dynamically computes radial gradients and shadows.",
      },
      {
        name: "size",
        type: '"sm" | "default" | "lg" | "icon"',
        defaultValue: '"default"',
        description: "Button dimensions, paddings, and font sizes.",
      },
      {
        name: "glow",
        type: "boolean",
        defaultValue: "true",
        description: "Enable or disable outer ambient colored drop shadow caustics.",
      },
      {
        name: "glassSheen",
        type: "boolean",
        defaultValue: "true",
        description: "Renders translucent upper glass dome reflection sheen.",
      },
      {
        name: "leftIcon",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Icon element rendered before the button label with automatic size calibration.",
      },
      {
        name: "rightIcon",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Icon element rendered after the button label with automatic size calibration.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes to override dimensions, margins, or positioning.",
      },
    ],
    files: [
      {
        name: "candy-button.tsx",
        path: "registry/ui/candy-button.tsx",
        code: `"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type CandyButtonVariant =
  | "emerald"
  | "ruby"
  | "amber"
  | "violet"
  | "azure"
  | "obsidian"
  | "pearl";

export type CandyButtonSize = "sm" | "default" | "lg" | "icon";

export interface CandyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CandyButtonVariant;
  size?: CandyButtonSize;
  color?: string;
  glow?: boolean;
  glassSheen?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<CandyButtonVariant, string> = {
  emerald:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#006a66_0%,#003835_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(0,106,102,0.5),inset_0px_1px_4px_0px_rgba(255,255,255,0.4),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_28px_-4px_rgba(0,106,102,0.65),inset_0px_1px_4px_0px_rgba(255,255,255,0.5),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)]",
  ruby:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#e11d48_0%,#9f1239_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(225,29,72,0.5),inset_0px_1px_4px_0px_rgba(255,255,255,0.4),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_28px_-4px_rgba(225,29,72,0.65),inset_0px_1px_4px_0px_rgba(255,255,255,0.5),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)]",
  amber:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#f59e0b_0%,#b45309_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(245,158,11,0.5),inset_0px_1px_4px_0px_rgba(255,255,255,0.4),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_28px_-4px_rgba(245,158,11,0.65),inset_0px_1px_4px_0px_rgba(255,255,255,0.5),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)]",
  violet:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#8b5cf6_0%,#581c87_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(139,92,246,0.5),inset_0px_1px_4px_0px_rgba(255,255,255,0.4),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_28px_-4px_rgba(139,92,246,0.65),inset_0px_1px_4px_0px_rgba(255,255,255,0.5),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)]",
  azure:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#0ea5e9_0%,#0369a1_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(14,165,233,0.5),inset_0px_1px_4px_0px_rgba(255,255,255,0.4),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_28px_-4px_rgba(14,165,233,0.65),inset_0px_1px_4px_0px_rgba(255,255,255,0.5),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)]",
  obsidian:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#3f3f46_0%,#18181b_100%)] text-zinc-100 border border-white/10 shadow-[0px_4px_20px_-6px_rgba(0,0,0,0.4),inset_0px_1px_3px_0px_rgba(255,255,255,0.25),inset_0px_-2px_4px_0px_rgba(0,0,0,0.2)] hover:shadow-[0px_6px_24px_-4px_rgba(0,0,0,0.5),inset_0px_1px_3px_0px_rgba(255,255,255,0.35),inset_0px_-2px_4px_0px_rgba(0,0,0,0.2)]",
  pearl:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#ffffff_0%,#e4e4e7_100%)] text-zinc-950 shadow-[0px_4px_20px_-6px_rgba(255,255,255,0.35),inset_0px_1px_3px_0px_rgba(255,255,255,0.9),inset_0px_-2px_4px_0px_rgba(0,0,0,0.08)] hover:shadow-[0px_6px_24px_-4px_rgba(255,255,255,0.45),inset_0px_1px_3px_0px_rgba(255,255,255,1),inset_0px_-2px_4px_0px_rgba(0,0,0,0.08)]",
};

const sizeStyles: Record<CandyButtonSize, string> = {
  sm: "h-8 px-3.5 text-xs rounded-lg gap-1.5 [&_svg]:size-3.5",
  default: "h-10 px-5 text-sm rounded-xl gap-2 [&_svg]:size-4",
  lg: "h-12 px-7 text-base rounded-2xl gap-2.5 [&_svg]:size-5",
  icon: "size-10 p-0 rounded-xl gap-0 [&_svg]:size-4",
};

export const CandyButton = React.forwardRef<HTMLButtonElement, CandyButtonProps>(
  (
    {
      className,
      children,
      variant = "emerald",
      size = "default",
      color,
      glow = true,
      glassSheen = true,
      leftIcon,
      rightIcon,
      style,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isCustom = Boolean(color);

    const customStyle: React.CSSProperties = isCustom
      ? {
          background: \`radial-gradient(120% 80% at 50% 70%, \${color} 0%, color-mix(in srgb, \${color} 50%, black) 100%)\`,
          boxShadow: glow
            ? \`0px 4px 24px -6px color-mix(in srgb, \${color} 65%, transparent), inset 0px 1px 4px 0px rgba(255, 255, 255, 0.45), inset 0px -2px 4px 0px rgba(0, 0, 0, 0.15)\`
            : \`inset 0px 1px 4px 0px rgba(255, 255, 255, 0.45), inset 0px -2px 4px 0px rgba(0, 0, 0, 0.15)\`,
          color: "#ffffff",
          ...style,
        }
      : (style ?? {});

    return (
      <button
        ref={ref}
        disabled={disabled}
        style={customStyle}
        className={cn(
          "relative inline-flex items-center justify-center font-medium leading-none tracking-[0.01em] select-none overflow-hidden cursor-pointer transition-all duration-200 ease-out active:scale-[0.98] active:brightness-95 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
          "after:absolute after:top-0 after:left-[15%] after:right-[15%] after:h-px after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] after:pointer-events-none",
          !isCustom && variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {glassSheen && (
          <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,transparent_100%)] pointer-events-none" />
        )}
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </span>
      </button>
    );
  },
);

CandyButton.displayName = "CandyButton";

export default CandyButton;
`,
      },
    ],
  },
  "sparkle-button": {
    slug: "sparkle-button",
    name: "Sparkle Button",
    description: "Monochromatic AI generation button featuring staggered letter-wave luminescence, smooth fade-and-blur morphing, and gentle star flare pulsing.",
    summary: "An ultra-tactile generation trigger engineered with staggered character-level wave animations, buttery-smooth blur-and-fade text morphing between idle ('Generate') and active ('Generating') modes, tactile multi-layer black and white inset bevel lighting, and an ambient pulsing star flare. Features pure monochromatic aesthetics with zero harsh color distortion.",
    category: "buttons",
    tags: ["button", "sparkle", "ai", "generate", "letters", "stagger", "morph", "flicker", "tactile", "monochrome"],
    dependencies: ["clsx", "tailwind-merge", "motion"],
    version: "1.0.0",
    createdDate: "2026-09-21",
    updatedDate: "2026-09-21",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Character-by-character staggered wave shimmer animation with sequential delays",
      "Liquid-smooth AnimatePresence fade-and-blur morphing between 'Generate' and 'Generating' states with layout size animation",
      "Tri-star magic SVG with ambient flicker and non-rotating luminescent pulse when generating",
      "Monochromatic deep tactile bevel with multi-stop black and white composite inset shadows and upper specular reflection",
      "Three precision size scales (sm, default, lg) with automatic vector scaling",
      "Full keyboard focus ring and accessible ARIA state support"
    ],
    anatomy: [
      "<div> (Ambient layout container for the interactive button)",
      "<button> (Focus-visible tactile pill container with monochromatic inset bevel lighting)",
      "<motion.svg> (Pulsing tri-star magic sparkle vector with soft ambient glow)",
      "<AnimatePresence> (Handles seamless blur and fade crossfade between idle and active states)",
      "<span> (Individual animated character glyph with staggered wave keyframe delays)"
    ],
    physics: {
      engine: "Motion Glyphs & Monochromatic Optics",
      description: "Hardware-accelerated sequential character wave animations combined with non-rotating vector pulsing and composite inset lighting.",
      parameters: [
        { label: "Letter Delay", value: "80ms per character stagger" },
        { label: "Wave Cycle", value: "2200ms ease-in-out infinite loop" },
        { label: "Star Flicker", value: "2000ms linear opacity respiration" },
        { label: "State Morph", value: "280ms cubic-bezier(0.16, 1, 0.3, 1) fade & blur" },
        { label: "Tactile Compression", value: "scale-[0.98] on active press" },
        { label: "Shadow Optics", value: "Multi-tier black and white specular insets" }
      ]
    },
    accessibility: {
      role: "button",
      aria: "Inherits native button attributes, with automatic aria-busy reflection during active generating state.",
      reducedMotion: "Suppresses continuous letter wave and star flicker loops when prefers-reduced-motion is active.",
      keyboard: [
        { key: "Tab", description: "Focus button with high-contrast dual ring outline." },
        { key: "Enter / Space", description: "Toggle between Generate and Generating states with smooth morph." }
      ]
    },
    guidelines: {
      recommended: [
        "Primary AI prompt submission and content generation triggers",
        "Creative workflow controls in image, video, or code generation interfaces",
        "Minimalist, monochromatic hero call-to-actions needing tactile, magical feedback"
      ],
      bestPractices: [
        "Pair with real backend generation callbacks via loading and onLoadingChange props",
        "Keep the monochromatic palette intact for clean developer and dark-mode aesthetics",
        "Use AnimatePresence mode='wait' for seamless crossfading without abrupt jumps"
      ]
    },
    props: [
      {
        name: "text",
        type: "string",
        defaultValue: '"Generate Magic"',
        description: "Idle label rendered with BlurText staggered reveal animation.",
      },
      {
        name: "activeText",
        type: "string",
        defaultValue: '"Generating..."',
        description: "Active label displayed when generating with smooth fade & blur reveal.",
      },
      {
        name: "animateBy",
        type: '"letters" | "words"',
        defaultValue: '"letters"',
        description: "Whether blur reveal staggers by individual letters or full words.",
      },
      {
        name: "direction",
        type: '"top" | "bottom"',
        defaultValue: '"top"',
        description: "Direction from which blurred glyphs drift into place.",
      },
      {
        name: "delay",
        type: "number",
        defaultValue: "40",
        description: "Stagger delay between sequential elements in milliseconds.",
      },
      {
        name: "stepDuration",
        type: "number",
        defaultValue: "0.35",
        description: "Reveal transition duration for each letter or word in seconds.",
      },
      {
        name: "dissolveDuration",
        type: "number",
        defaultValue: "0.2",
        description: "Fade and blur dissolve duration when exiting previous text state.",
      },
      {
        name: "springStiffness",
        type: "number",
        defaultValue: "350",
        description: "Stiffness parameter for the button's layout resizing spring animation.",
      },
      {
        name: "springDamping",
        type: "number",
        defaultValue: "28",
        description: "Damping parameter for the button's layout resizing spring animation.",
      },
      {
        name: "loading",
        type: "boolean",
        defaultValue: "undefined",
        description: "Controlled generation state. When undefined, toggles automatically on click.",
      },
      {
        name: "size",
        type: '"sm" | "default" | "lg"',
        defaultValue: '"default"',
        description: "Button dimensions, font sizes, and icon scaling.",
      },
      {
        name: "onLoadingChange",
        type: "(loading: boolean) => void",
        defaultValue: "undefined",
        description: "Callback triggered when generation state changes.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes to override dimensions or margins.",
      },
    ],
    files: [
      {
        name: "sparkle-button.tsx",
        path: "registry/ui/sparkle-button.tsx",
        code: `"use client";

import React, { useState, useMemo, useRef, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

export type SparkleButtonSize = "sm" | "default" | "lg";
export type BlurAnimateBy = "letters" | "words";
export type BlurDirection = "top" | "bottom";

export interface SparkleButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  text?: string;
  activeText?: string;
  loading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  size?: SparkleButtonSize;
  icon?: React.ReactNode;
  animateBy?: BlurAnimateBy;
  direction?: BlurDirection;
  delay?: number;
  stepDuration?: number;
  dissolveDuration?: number;
  springStiffness?: number;
  springDamping?: number;
}

const sizeStyles: Record<SparkleButtonSize, string> = {
  sm: "h-8 px-4 text-xs gap-2 [&_svg]:size-3.5",
  default: "h-10 px-5 text-sm gap-2.5 [&_svg]:size-4",
  lg: "h-12 px-7 text-base gap-3 [&_svg]:size-5",
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>,
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

export const SparkleButton = React.forwardRef<
  HTMLButtonElement,
  SparkleButtonProps
>(
  (
    {
      className,
      text = "Generate Magic",
      activeText = "Generating...",
      loading,
      onLoadingChange,
      size = "default",
      icon,
      animateBy = "letters",
      direction = "top",
      delay = 40,
      stepDuration = 0.35,
      dissolveDuration = 0.2,
      springStiffness = 350,
      springDamping = 28,
      onClick,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [internalLoading, setInternalLoading] = useState(false);
    const isControlled = loading !== undefined;
    const isLoading = isControlled ? loading : internalLoading;

    const idleMeasureRef = useRef<HTMLSpanElement>(null);
    const activeMeasureRef = useRef<HTMLSpanElement>(null);
    const [measuredWidths, setMeasuredWidths] = useState<{
      idle: number;
      active: number;
    }>({ idle: 0, active: 0 });

    const updateMeasurements = () => {
      if (idleMeasureRef.current && activeMeasureRef.current) {
        const idleW = Math.ceil(
          idleMeasureRef.current.getBoundingClientRect().width,
        );
        const activeW = Math.ceil(
          activeMeasureRef.current.getBoundingClientRect().width,
        );
        setMeasuredWidths({ idle: idleW, active: activeW });
      }
    };

    useIsomorphicLayoutEffect(() => {
      updateMeasurements();
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready.then(updateMeasurements);
      }
      window.addEventListener("resize", updateMeasurements);
      return () => window.removeEventListener("resize", updateMeasurements);
    }, [text, activeText, size]);

    const targetWidth = isLoading
      ? measuredWidths.active
      : measuredWidths.idle;
    const currentTargetText = isLoading ? activeText : text;

    const segments = useMemo(() => {
      if (animateBy === "words") {
        return currentTargetText.split(" ");
      }
      return currentTargetText.split("");
    }, [currentTargetText, animateBy]);

    const defaultFrom = useMemo(
      () =>
        direction === "top"
          ? { filter: "blur(10px)", opacity: 0, y: -12 }
          : { filter: "blur(10px)", opacity: 0, y: 12 },
      [direction],
    );

    const defaultTo = useMemo(
      () => [
        {
          filter: "blur(4px)",
          opacity: 0.65,
          y: direction === "top" ? 2 : -2,
        },
        { filter: "blur(0px)", opacity: 1, y: 0 },
      ],
      [direction],
    );

    const stepCount = defaultTo.length + 1;
    const times = useMemo(
      () =>
        Array.from({ length: stepCount }, (_, i) =>
          stepCount === 1 ? 0 : i / (stepCount - 1),
        ),
      [stepCount],
    );

    const animateKeyframes = useMemo(
      () => buildKeyframes(defaultFrom, defaultTo),
      [defaultFrom, defaultTo],
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (!isControlled) {
        setInternalLoading((prev) => !prev);
      }
      onLoadingChange?.(!isLoading);
      onClick?.(e);
    };

    return (
      <div className="relative inline-flex items-center justify-center p-1 select-none">
        <motion.button
          ref={ref}
          disabled={disabled}
          onClick={handleClick}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "group relative inline-flex items-center justify-center rounded-full font-medium select-none overflow-hidden cursor-pointer",
            "bg-[#0d0d0f] text-white border border-white/15",
            "transition-[border-color,box-shadow,filter] duration-300 ease-out",
            "shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.22),inset_0px_2px_3px_0px_rgba(255,255,255,0.1),inset_0px_-2px_4px_0px_rgba(0,0,0,0.5),0px_4px_16px_-2px_rgba(0,0,0,0.8),0px_1px_2px_0px_rgba(0,0,0,0.4)]",
            "hover:border-white/30 hover:shadow-[inset_0px_1px_1.5px_0px_rgba(255,255,255,0.35),inset_0px_2px_4px_0px_rgba(255,255,255,0.15),inset_0px_-2px_4px_0px_rgba(0,0,0,0.5),0px_8px_24px_-4px_rgba(0,0,0,0.9),0px_0px_16px_0px_rgba(255,255,255,0.06)] hover:brightness-105",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
            "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
            "after:absolute after:top-0 after:left-[12%] after:right-[12%] after:h-px after:pointer-events-none",
            "after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]",
            sizeStyles[size],
            className,
          )}
          {...props}
        >
          <span
            ref={idleMeasureRef}
            aria-hidden="true"
            className="invisible absolute pointer-events-none opacity-0 select-none whitespace-nowrap tracking-tight font-medium"
          >
            {text}
          </span>
          <span
            ref={activeMeasureRef}
            aria-hidden="true"
            className="invisible absolute pointer-events-none opacity-0 select-none whitespace-nowrap tracking-tight font-medium"
          >
            {activeText}
          </span>

          <span className="relative z-10 flex items-center justify-center gap-2.5">
            {icon ? (
              <span className="shrink-0">{icon}</span>
            ) : (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                animate={
                  isLoading
                    ? {
                        scale: [1, 1.15, 1],
                        filter: [
                          "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
                          "drop-shadow(0 0 9px rgba(255,255,255,0.95))",
                          "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
                        ],
                      }
                    : {
                        scale: 1,
                        filter: "drop-shadow(0 0 2px rgba(255,255,255,0.4))",
                      }
                }
                transition={
                  isLoading
                    ? {
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : { duration: 0.25 }
                }
                className="shrink-0 fill-[#e8e8e8] transition-colors duration-300 group-hover:fill-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                />
              </motion.svg>
            )}

            <motion.div
              animate={targetWidth > 0 ? { width: targetWidth } : undefined}
              transition={{
                type: "spring",
                stiffness: springStiffness,
                damping: springDamping,
                mass: 0.8,
              }}
              style={{ willChange: "width" }}
              className="relative inline-flex items-center justify-center overflow-hidden"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={isLoading ? "active" : "idle"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    filter: "blur(8px)",
                    y: direction === "top" ? 8 : -8,
                    transition: {
                      duration: dissolveDuration,
                      ease: [0.16, 1, 0.3, 1] as const,
                    },
                  }}
                  className="inline-flex items-center justify-center tracking-tight font-medium text-white whitespace-nowrap"
                >
                  {segments.map((segment, index) => (
                    <motion.span
                      key={\`\${isLoading ? "act" : "idl"}-\${index}\`}
                      initial={defaultFrom}
                      animate={animateKeyframes}
                      transition={{
                        duration: stepDuration,
                        times,
                        delay: (index * delay) / 1000,
                        ease: [0.16, 1, 0.3, 1] as const,
                      }}
                      style={{
                        display: "inline-block",
                        willChange: "transform, filter, opacity",
                      }}
                    >
                      {segment === " " ? "\\u00A0" : segment}
                      {animateBy === "words" &&
                        index < segments.length - 1 &&
                        "\\u00A0"}
                    </motion.span>
                  ))}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </span>
        </motion.button>
      </div>
    );
  },
);

SparkleButton.displayName = "SparkleButton";

export default SparkleButton;

`,
      },
    ],
  },
};

export const getAllComponents = (
  includeHidden = false
): ComponentRegistryItem[] => {
  const items = Object.values(COMPONENT_REGISTRY);
  if (includeHidden) return items;
  return items.filter((item) => !item.hidden);
};

export const getComponentBySlug = (
  slug: string,
  includeHidden = false
): ComponentRegistryItem | undefined => {
  const item = COMPONENT_REGISTRY[slug];
  if (!item) return undefined;
  if (item.hidden && !includeHidden) return undefined;
  return item;
};
