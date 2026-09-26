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

export interface ThemeToggleProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
  variant?: TransitionVariant;
  fromCenter?: boolean;
  candy?: boolean;
  theme?: "light" | "dark";
  onThemeChange?: (theme: "light" | "dark") => void;
}

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
    case "rectangle": {
      const w = Math.max(cx, viewportWidth - cx) * 1.05;
      const h = Math.max(cy, viewportHeight - cy) * 1.05;
      const end = [
        point(cx - w, cy - h),
        point(cx + w, cy - h),
        point(cx + w, cy + h),
        point(cx - w, cy + h),
      ].join(", ");
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }
    case "triangle": {
      const R = maxRadius * 1.5;
      const start = [
        point(cx, cy),
        point(cx, cy),
        point(cx, cy),
      ].join(", ");
      const end = [
        point(cx, cy - R),
        point(cx + R * Math.cos(Math.PI / 6), cy + R * Math.sin(Math.PI / 6)),
        point(cx - R * Math.cos(Math.PI / 6), cy + R * Math.sin(Math.PI / 6)),
      ].join(", ");
      return [`polygon(${start})`, `polygon(${end})`];
    }
    case "diamond": {
      const R = maxRadius * 1.1;
      const end = [
        point(cx, cy - R),
        point(cx + R, cy),
        point(cx, cy + R),
        point(cx - R, cy),
      ].join(", ");
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }
    case "hexagon": {
      const R = maxRadius * 1.1;
      const verts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 - Math.PI / 6;
        verts.push(point(cx + R * Math.cos(a), cy + R * Math.sin(a)));
      }
      return [polygonCollapsed(point(cx, cy), 6), `polygon(${verts.join(", ")})`];
    }
    case "star": {
      const R = maxRadius * 1.25;
      const innerRatio = 0.42;
      const starPolygon = (radius: number) => {
        const verts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const outerA = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const innerA = outerA + Math.PI / 5;
          verts.push(
            point(cx + radius * Math.cos(outerA), cy + radius * Math.sin(outerA)),
          );
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

export const ThemeToggle = ({
  className,
  duration = 450,
  variant,
  fromCenter = false,
  candy = false,
  theme,
  onThemeChange,
  ...props
}: ThemeToggleProps) => {
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

    let cx: number;
    let cy: number;

    if (fromCenter) {
      cx = viewportWidth / 2;
      cy = viewportHeight / 2;
    } else {
      const rect = button.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
    }

    const maxRadius = Math.hypot(
      Math.max(cx, viewportWidth - cx),
      Math.max(cy, viewportHeight - cy),
    );

    const clipPath = getThemeTransitionClipPaths(
      shape,
      cx,
      cy,
      maxRadius,
      viewportWidth,
      viewportHeight,
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
      }
      try {
        localStorage.setItem("theme", nextIsDark ? "dark" : "light");
      } catch {}
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "theme",
          newValue: nextIsDark ? "dark" : "light",
        }),
      );
    };

    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      applyTheme();
      return;
    }

    cancelAnim();

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

  const candyClasses = candy
    ? "relative inline-flex items-center justify-center font-medium leading-none tracking-[0.01em] select-none overflow-hidden cursor-pointer transition-all duration-200 ease-out active:scale-[0.98] active:brightness-95 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 bg-[radial-gradient(120%_80%_at_50%_70%,#3f3f46_0%,#18181b_100%)] text-zinc-100 border border-white/10 shadow-[0px_4px_20px_-6px_rgba(0,0,0,0.4),inset_0px_1px_3px_0px_rgba(255,255,255,0.25),inset_0px_-2px_4px_0px_rgba(0,0,0,0.2)] hover:shadow-[0px_6px_24px_-4px_rgba(0,0,0,0.5),inset_0px_1px_3px_0px_rgba(255,255,255,0.35),inset_0px_-2px_4px_0px_rgba(0,0,0,0.2)] after:absolute after:top-0 after:left-[15%] after:right-[15%] after:h-px after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] after:pointer-events-none"
    : "";

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(className, candyClasses)}
      aria-label="Toggle theme"
      {...props}
    >
      {candy && (
        <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,transparent_100%)] pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center justify-center">
        {isDark ? (
          <Sun
            className={cn(
              "h-4 w-4 transition-transform duration-300 hover:rotate-45",
              candy
                ? "text-zinc-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                : "text-foreground",
            )}
          />
        ) : (
          <Moon
            className={cn(
              "h-4 w-4 transition-transform duration-300 hover:-rotate-12",
              candy
                ? "text-zinc-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                : "text-foreground",
            )}
          />
        )}
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export const AnimatedThemeToggler = ThemeToggle;
export default ThemeToggle;
