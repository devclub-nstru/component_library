import { ComponentRegistryItem } from "@/types/component";

export const COMPONENT_REGISTRY: Record<string, ComponentRegistryItem> = {
  scales: {
    slug: "scales",
    name: "Scales & Borders",
    description: "Symmetric repeating linear gradient borders and geometric scale dividers.",
    category: "scales",
    tags: ["borders", "scales", "divider", "linear-gradient"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    props: [
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes to apply.",
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
    category: "buttons",
    tags: ["button", "shimmer", "interaction", "animation"],
    dependencies: ["clsx", "tailwind-merge", "@radix-ui/react-icons"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "shimmer"',
        defaultValue: '"primary"',
        description: "Visual style variant of the button.",
      },
      {
        name: "showArrow",
        type: "boolean",
        defaultValue: "false",
        description: "Display an animated arrow icon on hover.",
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
    category: "cards",
    tags: ["card", "spotlight", "hover", "interactive"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    props: [
      {
        name: "spotlightColor",
        type: "string",
        defaultValue: '"rgba(59, 130, 246, 0.15)"',
        description: "Radial gradient spotlight color on hover.",
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
    category: "feedback",
    tags: ["badge", "status", "glow", "indicator"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    props: [
      {
        name: "variant",
        type: '"blue" | "emerald" | "amber" | "violet"',
        defaultValue: '"blue"',
        description: "Color palette of the badge.",
      },
      {
        name: "pulse",
        type: "boolean",
        defaultValue: "true",
        description: "Enable the pinging pulse dot indicator.",
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
  "bento-grid": {
    slug: "bento-grid",
    name: "Bento Grid",
    description: "Responsive 3-column asymmetric layout grid for high-impact feature displays.",
    category: "layout",
    tags: ["bento", "grid", "layout", "cards"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    props: [
      {
        name: "colSpan",
        type: "1 | 2 | 3",
        defaultValue: "1",
        description: "Number of grid columns spanned by BentoCard on medium+ screens.",
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
};

export const getAllComponents = (): ComponentRegistryItem[] => {
  return Object.values(COMPONENT_REGISTRY);
};

export const getComponentBySlug = (
  slug: string
): ComponentRegistryItem | undefined => {
  return COMPONENT_REGISTRY[slug];
};
