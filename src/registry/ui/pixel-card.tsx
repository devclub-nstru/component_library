"use client";

import React, { useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export type PixelCardVariant =
  | "default"
  | "blue"
  | "yellow"
  | "pink"
  | "purple"
  | "emerald";

export type PixelCardPattern = "wave" | "matrix" | "scan" | "cross";

export interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: PixelCardVariant;
  pattern?: PixelCardPattern;
  noise?: number;
  gap?: number;
  speed?: number;
  colors?: string;
  noFocus?: boolean;
  enableTilt?: boolean;
  maxTilt?: number;
  enableSpotlight?: boolean;
  spotlightColor?: string;
  enableGlare?: boolean;
  children?: React.ReactNode;
  className?: string;
}

interface PixelData {
  x: number;
  y: number;
  color: string;
  size: number;
  alpha: number;
  maxSize: number;
  phase: number;
}

interface VariantConfig {
  activeColor: string;
  spotlight: string;
  borderColor: string;
  gap: number;
  speed: number;
  colors: string;
  noFocus: boolean;
}

const VARIANTS: Record<PixelCardVariant, VariantConfig> = {
  default: {
    activeColor: "rgba(56, 189, 248, 0.08)",
    spotlight: "rgba(56, 189, 248, 0.07)",
    borderColor: "rgba(56, 189, 248, 0.25)",
    gap: 6,
    speed: 25,
    colors: "#f8fafc,#cbd5e1,#94a3b8,#38bdf8",
    noFocus: false,
  },
  blue: {
    activeColor: "rgba(14, 165, 233, 0.1)",
    spotlight: "rgba(56, 189, 248, 0.09)",
    borderColor: "rgba(56, 189, 248, 0.3)",
    gap: 7,
    speed: 22,
    colors: "#e0f2fe,#7dd3fc,#38bdf8,#0ea5e9",
    noFocus: false,
  },
  yellow: {
    activeColor: "rgba(234, 179, 8, 0.08)",
    spotlight: "rgba(250, 204, 21, 0.07)",
    borderColor: "rgba(250, 204, 21, 0.28)",
    gap: 6,
    speed: 20,
    colors: "#fef08a,#fde047,#facc15,#eab308",
    noFocus: false,
  },
  pink: {
    activeColor: "rgba(244, 63, 94, 0.1)",
    spotlight: "rgba(244, 63, 94, 0.08)",
    borderColor: "rgba(251, 113, 133, 0.28)",
    gap: 6,
    speed: 30,
    colors: "#fecdd3,#fda4af,#fb7185,#f43f5e",
    noFocus: true,
  },
  purple: {
    activeColor: "rgba(168, 85, 247, 0.1)",
    spotlight: "rgba(192, 132, 252, 0.08)",
    borderColor: "rgba(192, 132, 252, 0.28)",
    gap: 6,
    speed: 24,
    colors: "#f3e8ff,#d8b4fe,#c084fc,#a855f7",
    noFocus: false,
  },
  emerald: {
    activeColor: "rgba(16, 185, 129, 0.1)",
    spotlight: "rgba(52, 211, 153, 0.08)",
    borderColor: "rgba(52, 211, 153, 0.28)",
    gap: 6,
    speed: 22,
    colors: "#d1fae5,#6ee7b7,#34d399,#10b981",
    noFocus: false,
  },
};

export const PixelCard = React.forwardRef<HTMLDivElement, PixelCardProps>(
  (
    {
      variant = "default",
      pattern = "wave",
      noise = 0,
      gap,
      speed,
      colors,
      noFocus,
      enableTilt = true,
      maxTilt = 6,
      enableSpotlight = true,
      spotlightColor,
      enableGlare = true,
      className,
      children,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const pixelsRef = useRef<PixelData[]>([]);
    const isHoveredRef = useRef(false);
    const animatingRef = useRef(false);

    const pointerRef = useRef({
      x: 0,
      y: 0,
      entryTime: 0,
    });

    const targetPointerRef = useRef({
      x: 0,
      y: 0,
    });

    const rotXRef = useRef<gsap.QuickToFunc | null>(null);
    const rotYRef = useRef<gsap.QuickToFunc | null>(null);
    const scaleRef = useRef<gsap.QuickToFunc | null>(null);

    const isReducedMotion = useRef(
      typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ).current;

    const variantCfg = VARIANTS[variant] || VARIANTS.default;
    const finalGap = gap ?? variantCfg.gap;
    const finalSpeed = speed ?? variantCfg.speed;
    const finalColors = colors ?? variantCfg.colors;
    const finalNoFocus = noFocus ?? variantCfg.noFocus;
    const finalSpotlightColor = spotlightColor ?? variantCfg.spotlight;

    const initPixels = useCallback(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      if (width <= 0 || height <= 0) return;

      const dpr = Math.min(
        typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
        2,
      );
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const step = Math.max(4, parseInt(finalGap.toString(), 10) || 6);
      const cols = Math.floor(width / step);
      const rows = Math.floor(height / step);
      const xOffset = Math.floor((width - (cols - 1) * step) / 2);
      const yOffset = Math.floor((height - (rows - 1) * step) / 2);

      const colorList = finalColors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      const pixelGrid: PixelData[] = [];

      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const x = xOffset + col * step;
          const y = yOffset + row * step;
          const color =
            colorList[Math.floor(Math.random() * colorList.length)] ||
            "#38bdf8";
          const maxSize = 1.1 + Math.random() * 1.3;
          pixelGrid.push({
            x,
            y,
            color,
            size: 0,
            alpha: 0,
            maxSize,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
      pixelsRef.current = pixelGrid;
    }, [finalColors, finalGap]);

    const tick = useCallback(
      (time: number, deltaTime: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = parseFloat(canvas.style.width) || canvas.width;
        const height = parseFloat(canvas.style.height) || canvas.height;

        const isHovered = isHoveredRef.current;
        const pointer = pointerRef.current;
        const targetPointer = targetPointerRef.current;

        pointer.x += (targetPointer.x - pointer.x) * 0.15;
        pointer.y += (targetPointer.y - pointer.y) * 0.15;

        const pixels = pixelsRef.current;
        const dt = Math.min(deltaTime, 33.33);
        const factor = Math.min(1, 0.12 * (dt / 16.67));

        ctx.clearRect(0, 0, width, height);

        let hasVisiblePixels = false;
        const elapsed = time - pointer.entryTime;
        const waveRadius = isReducedMotion ? 99999 : elapsed * 320;
        const effectiveSpeed = finalSpeed * 0.05;

        for (let i = 0; i < pixels.length; i++) {
          const p = pixels[i];
          let targetSize = 0;
          let targetAlpha = 0;

          if (isHovered) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (pattern === "wave") {
              if (dist <= waveRadius) {
                const waveIntensity = Math.min(
                  1,
                  Math.max(0, (waveRadius - dist) / 45),
                );
                const proximity = Math.max(0, 1 - dist / 130);
                const proximityBoost = proximity * proximity;
                const harmonicWave =
                  Math.sin(time * effectiveSpeed + p.phase) * 0.5 + 0.5;
                const pulse =
                  Math.sin(time * (effectiveSpeed * 1.2) - dist * 0.03) * 0.5 +
                  0.5;

                targetSize =
                  p.maxSize *
                  waveIntensity *
                  (0.3 + 0.55 * harmonicWave + proximityBoost * 0.65);
                targetAlpha = Math.min(
                  1,
                  0.2 + 0.65 * pulse + proximityBoost * 0.4,
                );
              }
            } else if (pattern === "matrix") {
              const colOffset = Math.sin(p.x * 0.08) * 120;
              const streamY =
                ((time * (effectiveSpeed * 160) + colOffset) % (height + 120)) -
                60;
              const streamDist = Math.abs(p.y - streamY);
              const streamIntensity = Math.max(0, 1 - streamDist / 60);
              const proximity = Math.max(0, 1 - dist / 120);
              const pulse =
                Math.sin(time * (effectiveSpeed * 2) + p.phase) * 0.5 + 0.5;

              targetSize =
                p.maxSize * (0.2 + 0.8 * streamIntensity + proximity * 0.5);
              targetAlpha = Math.min(
                1,
                0.2 + 0.8 * streamIntensity * pulse + proximity * 0.4,
              );
            } else if (pattern === "scan") {
              const scanAngle = time * (effectiveSpeed * 0.9);
              const cx = width / 2;
              const cy = height / 2;
              const relX = p.x - cx;
              const relY = p.y - cy;
              const beamDist = Math.abs(
                relX * Math.cos(scanAngle) + relY * Math.sin(scanAngle),
              );
              const beamIntensity = Math.max(0, 1 - beamDist / 45);
              const proximity = Math.max(0, 1 - dist / 120);

              targetSize =
                p.maxSize * (0.25 + 0.75 * beamIntensity + proximity * 0.5);
              targetAlpha = Math.min(
                1,
                0.2 + 0.8 * beamIntensity + proximity * 0.4,
              );
            } else if (pattern === "cross") {
              const lineDist = Math.min(Math.abs(dx), Math.abs(dy));
              const lineIntensity = Math.max(0, 1 - lineDist / 32);
              const proximity = Math.max(0, 1 - dist / 130);
              const pulse =
                Math.sin(time * (effectiveSpeed * 1.5) - dist * 0.035) * 0.5 +
                0.5;

              targetSize =
                p.maxSize * (0.25 + 0.75 * lineIntensity + proximity * 0.5);
              targetAlpha = Math.min(
                1,
                0.2 + 0.8 * lineIntensity * pulse + proximity * 0.4,
              );
            }

            if (noise > 0) {
              const noiseSeed =
                Math.sin(p.x * 12.9898 + p.y * 78.233 + time * 14) * 43758.5453;
              const pseudoRand = noiseSeed - Math.floor(noiseSeed);
              const noiseDelta = (pseudoRand - 0.5) * noise * 1.1;
              targetSize = Math.max(0, targetSize * (1 + noiseDelta));
              targetAlpha = Math.min(
                1,
                Math.max(0, targetAlpha * (1 + noiseDelta * 0.7)),
              );
            }
          }

          p.size += (targetSize - p.size) * factor;
          p.alpha += (targetAlpha - p.alpha) * factor;

          if (!isHovered && p.size < 0.05) {
            p.size = 0;
            p.alpha = 0;
          }

          if (p.size > 0.04 && p.alpha > 0.01) {
            hasVisiblePixels = true;
            const offset = (p.maxSize - p.size) * 0.5;
            ctx.globalAlpha = Math.min(1, Math.max(0, p.alpha));
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x + offset, p.y + offset, p.size, p.size);
          }
        }

        if (!isHovered && !hasVisiblePixels) {
          animatingRef.current = false;
          gsap.ticker.remove(tick);
          ctx.clearRect(0, 0, width, height);
        }
      },
      [finalSpeed, isReducedMotion, noise, pattern],
    );

    const startAnimation = useCallback(() => {
      if (!animatingRef.current) {
        animatingRef.current = true;
        gsap.ticker.add(tick);
      }
    }, [tick]);

    useGSAP(
      () => {
        const card = containerRef.current;
        if (!card) return;

        if (isReducedMotion || !enableTilt) return;

        rotXRef.current = gsap.quickTo(card, "rotationX", {
          duration: 0.45,
          ease: "power2.out",
        });
        rotYRef.current = gsap.quickTo(card, "rotationY", {
          duration: 0.45,
          ease: "power2.out",
        });
        scaleRef.current = gsap.quickTo(card, "scale", {
          duration: 0.45,
          ease: "power2.out",
        });

        return () => {
          rotXRef.current = null;
          rotYRef.current = null;
          scaleRef.current = null;
          animatingRef.current = false;
          gsap.ticker.remove(tick);
        };
      },
      {
        scope: containerRef,
        dependencies: [enableTilt, isReducedMotion, tick],
      },
    );

    useEffect(() => {
      initPixels();

      const container = containerRef.current;
      if (!container) return;

      const observer = new ResizeObserver(() => {
        initPixels();
      });
      observer.observe(container);

      return () => {
        observer.disconnect();
        animatingRef.current = false;
        gsap.ticker.remove(tick);
      };
    }, [initPixels, tick]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const card = containerRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      targetPointerRef.current.x = x;
      targetPointerRef.current.y = y;

      card.style.setProperty("--pointer-x", `${x}px`);
      card.style.setProperty("--pointer-y", `${y}px`);

      if (
        enableTilt &&
        !isReducedMotion &&
        rotXRef.current &&
        rotYRef.current &&
        scaleRef.current
      ) {
        const nx = (x - rect.width / 2) / (rect.width / 2);
        const ny = (y - rect.height / 2) / (rect.height / 2);
        const clampedX = Math.max(-1, Math.min(1, nx));
        const clampedY = Math.max(-1, Math.min(1, ny));

        rotXRef.current(-clampedY * maxTilt);
        rotYRef.current(clampedX * maxTilt);
        scaleRef.current(1.008);
      }

      onMouseMove?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      const card = containerRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      pointerRef.current.x = x;
      pointerRef.current.y = y;
      targetPointerRef.current.x = x;
      targetPointerRef.current.y = y;
      pointerRef.current.entryTime = gsap.ticker.time;
      isHoveredRef.current = true;

      card.style.setProperty("--pointer-x", `${x}px`);
      card.style.setProperty("--pointer-y", `${y}px`);
      card.style.setProperty("--spotlight-opacity", "1");

      startAnimation();
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      isHoveredRef.current = false;
      const card = containerRef.current;
      if (card) {
        card.style.setProperty("--spotlight-opacity", "0");
      }

      if (
        enableTilt &&
        !isReducedMotion &&
        rotXRef.current &&
        rotYRef.current &&
        scaleRef.current
      ) {
        rotXRef.current(0);
        rotYRef.current(0);
        scaleRef.current(1);
      }

      onMouseLeave?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
      if (
        finalNoFocus ||
        (e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node))
      ) {
        return;
      }

      const card = containerRef.current;
      if (card) {
        const rect = card.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        pointerRef.current.x = cx;
        pointerRef.current.y = cy;
        targetPointerRef.current.x = cx;
        targetPointerRef.current.y = cy;
        pointerRef.current.entryTime = gsap.ticker.time;

        card.style.setProperty("--pointer-x", `${cx}px`);
        card.style.setProperty("--pointer-y", `${cy}px`);
        card.style.setProperty("--spotlight-opacity", "1");
      }

      isHoveredRef.current = true;
      startAnimation();
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      if (
        finalNoFocus ||
        (e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node))
      ) {
        return;
      }

      const card = containerRef.current;
      if (card) {
        card.style.setProperty("--spotlight-opacity", "0");
      }

      isHoveredRef.current = false;
      onBlur?.(e);
    };

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        tabIndex={finalNoFocus ? -1 : 0}
        role={finalNoFocus ? undefined : "region"}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={finalNoFocus ? undefined : handleFocus}
        onBlur={finalNoFocus ? undefined : handleBlur}
        className={cn(
          "group relative isolate flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/8 bg-black/80 text-zinc-100 select-none",
          "transition-[border-color,box-shadow] duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-black/60",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500/60 focus-visible:ring-offset-1 focus-visible:ring-offset-black",
          "transform-3d will-change-transform",
          className,
        )}
        {...props}
      >
        {enableSpotlight && (
          <div
            className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-500 ease-out"
            style={{
              opacity: "var(--spotlight-opacity, 0)",
              background: `radial-gradient(320px circle at var(--pointer-x, 50%) var(--pointer-y, 50%), ${finalSpotlightColor}, transparent 70%)`,
            }}
          />
        )}
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] border border-transparent transition-opacity duration-500 ease-out"
          style={{
            opacity: "var(--spotlight-opacity, 0)",
            background: `radial-gradient(280px circle at var(--pointer-x, 50%) var(--pointer-y, 50%), ${variantCfg.borderColor}, transparent 65%) border-box`,
            WebkitMask:
              "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
        {enableGlare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500 ease-out"
            style={{
              opacity: "var(--spotlight-opacity, 0)",
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, transparent 45%, rgba(255, 255, 255, 0.01) 100%)",
            }}
          />
        )}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 block h-full w-full rounded-[inherit]"
        />
        {children && (
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center transform-3d transform-[translateZ(18px)] pointer-events-auto">
            {children}
          </div>
        )}
      </div>
    );
  },
);

PixelCard.displayName = "PixelCard";

export default PixelCard;
