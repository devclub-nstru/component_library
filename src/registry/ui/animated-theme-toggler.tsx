"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

export type TransitionVariant =
  | "circle"
  | "square"
  | "triangle"
  | "diamond"
  | "hexagon"
  | "rectangle"
  | "star";

export type CandyGemstoneVariant =
  | "amber"
  | "azure"
  | "violet"
  | "emerald"
  | "ruby"
  | "obsidian"
  | "pearl"
  | "auto";

export interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
  variant?: TransitionVariant;
  fromCenter?: boolean;
  theme?: "light" | "dark";
  onThemeChange?: (theme: "light" | "dark") => void;
  candy?: boolean;
  candyVariant?: CandyGemstoneVariant;
  candyColor?: string;
}

const candyVariantStyles: Record<
  Exclude<CandyGemstoneVariant, "auto">,
  string
> = {
  amber:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#f59e0b_0%,#b45309_100%)] text-white shadow-[0px_4px_20px_-4px_rgba(245,158,11,0.55),inset_0px_1px_3px_0px_rgba(255,255,255,0.45),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_24px_-2px_rgba(245,158,11,0.7),inset_0px_1px_3px_0px_rgba(255,255,255,0.55)]",
  azure:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#0ea5e9_0%,#0369a1_100%)] text-white shadow-[0px_4px_20px_-4px_rgba(14,165,233,0.5),inset_0px_1px_3px_0px_rgba(255,255,255,0.45),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_24px_-2px_rgba(14,165,233,0.65),inset_0px_1px_3px_0px_rgba(255,255,255,0.55)]",
  violet:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#8b5cf6_0%,#581c87_100%)] text-white shadow-[0px_4px_20px_-4px_rgba(139,92,246,0.5),inset_0px_1px_3px_0px_rgba(255,255,255,0.45),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_24px_-2px_rgba(139,92,246,0.65),inset_0px_1px_3px_0px_rgba(255,255,255,0.55)]",
  emerald:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#006a66_0%,#003835_100%)] text-white shadow-[0px_4px_20px_-4px_rgba(0,106,102,0.5),inset_0px_1px_3px_0px_rgba(255,255,255,0.45),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_24px_-2px_rgba(0,106,102,0.65),inset_0px_1px_3px_0px_rgba(255,255,255,0.55)]",
  ruby:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#e11d48_0%,#9f1239_100%)] text-white shadow-[0px_4px_20px_-4px_rgba(225,29,72,0.5),inset_0px_1px_3px_0px_rgba(255,255,255,0.45),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_24px_-2px_rgba(225,29,72,0.65),inset_0px_1px_3px_0px_rgba(255,255,255,0.55)]",
  obsidian:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#3f3f46_0%,#18181b_100%)] text-zinc-100 border border-white/10 shadow-[0px_4px_20px_-6px_rgba(0,0,0,0.4),inset_0px_1px_3px_0px_rgba(255,255,255,0.25),inset_0px_-2px_4px_0px_rgba(0,0,0,0.2)] hover:shadow-[0px_6px_24px_-4px_rgba(0,0,0,0.5),inset_0px_1px_3px_0px_rgba(255,255,255,0.35)]",
  pearl:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#ffffff_0%,#e4e4e7_100%)] text-zinc-950 shadow-[0px_4px_20px_-6px_rgba(255,255,255,0.35),inset_0px_1px_3px_0px_rgba(255,255,255,0.9),inset_0px_-2px_4px_0px_rgba(0,0,0,0.08)] hover:shadow-[0px_6px_24px_-4px_rgba(255,255,255,0.45),inset_0px_1px_3px_0px_rgba(255,255,255,1)]",
};

function polygonCollapsed(point: string, vertexCount: number): string {
  const pairs = Array.from({ length: vertexCount }, () => point).join(", ");
  return `polygon(${pairs})`;
}

function getThemeTransitionClipPaths(
  variant: TransitionVariant,
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number,
): [string, string] {
  const toX = (x: number) => `${(x / viewportWidth) * 100}%`;
  const toY = (y: number) => `${(y / viewportHeight) * 100}%`;
  const point = (x: number, y: number) => `${toX(x)} ${toY(y)}`;
  const toRadius = (r: number) =>
    `${(r / (Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2)) * 100}%`;

  switch (variant) {
    case "circle":
      return [
        `circle(0% at ${point(cx, cy)})`,
        `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`,
      ];
    case "square": {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const halfSide = Math.max(halfW, halfH) * 1.05;
      const end = [
        point(cx - halfSide, cy - halfSide),
        point(cx + halfSide, cy - halfSide),
        point(cx + halfSide, cy + halfSide),
        point(cx - halfSide, cy + halfSide),
      ].join(", ");
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }
    case "triangle": {
      const scale = maxRadius * 2.2;
      const dx = (Math.sqrt(3) / 2) * scale;
      const verts = [
        point(cx, cy - scale),
        point(cx + dx, cy + 0.5 * scale),
        point(cx - dx, cy + 0.5 * scale),
      ].join(", ");
      return [polygonCollapsed(point(cx, cy), 3), `polygon(${verts})`];
    }
    case "diamond": {
      const R = maxRadius * Math.SQRT2;
      const end = [
        point(cx, cy - R),
        point(cx + R, cy),
        point(cx, cy + R),
        point(cx - R, cy),
      ].join(", ");
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }
    case "hexagon": {
      const R = maxRadius * Math.SQRT2;
      const verts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        verts.push(point(cx + R * Math.cos(a), cy + R * Math.sin(a)));
      }
      return [
        polygonCollapsed(point(cx, cy), 6),
        `polygon(${verts.join(", ")})`,
      ];
    }
    case "rectangle": {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const end = [
        point(cx - halfW, cy - halfH),
        point(cx + halfW, cy - halfH),
        point(cx + halfW, cy + halfH),
        point(cx - halfW, cy + halfH),
      ].join(", ");
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }
    case "star": {
      const R = maxRadius * Math.SQRT2 * 1.03;
      const innerRatio = 0.42;
      const starPolygon = (radius: number) => {
        const verts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          verts.push(
            point(
              cx + radius * Math.cos(outerA),
              cy + radius * Math.sin(outerA),
            ),
          );
          const innerA = outerA + Math.PI / 5;
          verts.push(
            point(
              cx + radius * innerRatio * Math.cos(innerA),
              cy + radius * innerRatio * Math.sin(innerA),
            ),
          );
        }
        return `polygon(${verts.join(", ")})`;
      };
      const startR = Math.max(2, R * 0.025);
      return [starPolygon(startR), starPolygon(R)];
    }
    default:
      return [
        `circle(0% at ${point(cx, cy)})`,
        `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`,
      ];
  }
}

export const AnimatedThemeToggler = ({
  className,
  duration = 450,
  variant,
  fromCenter = false,
  theme,
  onThemeChange,
  candy = false,
  candyVariant = "auto",
  candyColor,
  style,
  ...props
}: AnimatedThemeTogglerProps) => {
  const shape = variant ?? "circle";
  const isControlled = theme !== undefined;
  const [internalIsDark, setInternalIsDark] = useState(true);
  const isDark = isControlled ? theme === "dark" : internalIsDark;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTransitioningRef = useRef(false);
  const activeAnimRef = useRef<Animation | null>(null);

  const cancelAnim = useCallback(() => {
    activeAnimRef.current?.cancel();
    activeAnimRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cancelAnim();
      const root = document.documentElement;
      if (root.dataset.magicuiThemeVt !== "active") return;
      delete root.dataset.magicuiThemeVt;
      root.style.removeProperty("--magicui-theme-toggle-vt-duration");
      root.style.removeProperty("--magicui-theme-vt-clip-from");
    };
  }, [cancelAnim]);

  useEffect(() => {
    if (isControlled) return;

    const updateTheme = () => {
      setInternalIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme") {
        updateTheme();
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleStorage);
    };
  }, [isControlled]);

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    if (
      !button ||
      isTransitioningRef.current ||
      document.documentElement.dataset.magicuiThemeVt === "active"
    )
      return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x: number;
    let y: number;
    if (fromCenter) {
      x = viewportWidth / 2;
      y = viewportHeight / 2;
    } else {
      const { top, left, width, height } = button.getBoundingClientRect();
      x = left + width / 2;
      y = top + height / 2;
    }

    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y),
    );

    const applyTheme = () => {
      const isCurrentlyDark =
        document.documentElement.classList.contains("dark");
      const nextIsDark = !isCurrentlyDark;
      if (nextIsDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      if (isControlled) {
        onThemeChange?.(nextIsDark ? "dark" : "light");
      } else {
        setInternalIsDark(nextIsDark);
        try {
          localStorage.setItem("theme", nextIsDark ? "dark" : "light");
        } catch {}
      }
    };

    if (typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }

    const clipPath = getThemeTransitionClipPaths(
      shape,
      x,
      y,
      maxRadius,
      viewportWidth,
      viewportHeight,
    );

    const root = document.documentElement;
    root.dataset.magicuiThemeVt = "active";
    root.style.setProperty(
      "--magicui-theme-toggle-vt-duration",
      `${duration}ms`,
    );
    root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0]);

    const cleanup = () => {
      isTransitioningRef.current = false;
      delete root.dataset.magicuiThemeVt;
      root.style.removeProperty("--magicui-theme-toggle-vt-duration");
      root.style.removeProperty("--magicui-theme-vt-clip-from");
      cancelAnim();
    };

    isTransitioningRef.current = true;
    const transition = document.startViewTransition(() => {
      flushSync(applyTheme);
    });

    if (typeof transition?.finished?.finally === "function") {
      transition.finished.finally(cleanup).catch(() => {});
    } else {
      cleanup();
    }

    const ready = transition?.ready;
    if (ready && typeof ready.then === "function") {
      ready
        .then(() => {
          const anim = document.documentElement.animate(
            {
              clipPath,
            },
            {
              duration,
              easing: shape === "star" ? "linear" : "ease-in-out",
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)",
            },
          );
          activeAnimRef.current = anim;
        })
        .catch(() => {});
    }
  }, [shape, fromCenter, duration, isControlled, onThemeChange, cancelAnim]);

  const customCandyStyle: React.CSSProperties =
    candy && candyColor
      ? {
          background: `radial-gradient(120% 80% at 50% 70%, ${candyColor} 0%, color-mix(in srgb, ${candyColor} 50%, black) 100%)`,
          boxShadow: `0px 4px 20px -4px color-mix(in srgb, ${candyColor} 65%, transparent), inset 0px 1px 3px 0px rgba(255, 255, 255, 0.45), inset 0px -2px 4px 0px rgba(0, 0, 0, 0.15)`,
          color: "#ffffff",
          ...style,
        }
      : (style ?? {});

  const candyClasses = candy
    ? cn(
        "relative inline-flex items-center justify-center font-medium select-none overflow-hidden cursor-pointer transition-all duration-200 ease-out active:scale-[0.95] active:brightness-95 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 border-0",
        "after:absolute after:top-0 after:left-[15%] after:right-[15%] after:h-px after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.65),transparent)] after:pointer-events-none",
        !candyColor &&
          (candyVariant === "auto"
            ? candyVariantStyles.obsidian
            : candyVariantStyles[candyVariant]),
      )
    : "";

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      style={customCandyStyle}
      className={cn(className, candyClasses)}
      aria-label="Toggle theme"
      {...props}
    >
      {candy && (
        <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,transparent_100%)] pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center justify-center">
        {isDark ? (
          <Sun
            className={cn(
              "h-4 w-4 transition-transform duration-300 hover:rotate-45",
              candy
                ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                : "text-foreground",
            )}
          />
        ) : (
          <Moon
            className={cn(
              "h-4 w-4 transition-transform duration-300 hover:-rotate-12",
              candy
                ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                : "text-foreground",
            )}
          />
        )}
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export const ThemeToggle = AnimatedThemeToggler;
export default AnimatedThemeToggler;
