"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type NoiseMode = "grain" | "static" | "dust";

export interface NoiseProps extends HTMLAttributes<HTMLDivElement> {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
  mode?: NoiseMode;
  animated?: boolean;
  fps?: number;
  vignette?: boolean;
  vignetteDarkness?: number;
  scanlines?: boolean;
  scanlineDensity?: number;
  scanlineOpacity?: number;
  blendMode?: CSSProperties["mixBlendMode"];
  fullScreen?: boolean;
  canvasClassName?: string;
  canvasRef?: React.Ref<HTMLCanvasElement>;
  children?: ReactNode;
}

const createPatternFrame = (
  size: number,
  alpha: number,
  mode: NoiseMode,
  frameIdx: number,
): HTMLCanvasElement => {
  const pCanvas = document.createElement("canvas");
  pCanvas.width = size;
  pCanvas.height = size;
  const pCtx = pCanvas.getContext("2d", { alpha: true });
  if (!pCtx) return pCanvas;

  const imgData = pCtx.createImageData(size, size);
  const buf32 = new Uint32Array(imgData.data.buffer);
  const total = size * size;

  for (let i = 0; i < total; i++) {
    const y = (i / size) | 0;

    let v = 0;
    let a = alpha;

    if (mode === "static") {
      const scan = (y + frameIdx * 3) % 8 === 0 ? 55 : 0;
      v = Math.min(255, ((Math.random() * 256) | 0) + scan);
    } else if (mode === "dust") {
      const isDust = Math.random() > 0.994;
      const isFleck = Math.random() > 0.999;
      if (isDust) {
        v = isFleck ? 255 : (Math.random() * 200 + 55) | 0;
        a = Math.min(255, alpha * 5);
      } else {
        v = (Math.random() * 90) | 0;
        a = (alpha * 0.35) | 0;
      }
    } else {
      v = (Math.random() * 256) | 0;
    }

    buf32[i] = (a << 24) | (v << 16) | (v << 8) | v;
  }

  pCtx.putImageData(imgData, 0, 0);
  return pCanvas;
};

export const Noise = forwardRef<HTMLDivElement, NoiseProps>(
  (
    {
      patternSize = 250,
      patternScaleX = 1,
      patternScaleY = 1,
      patternRefreshInterval = 1,
      patternAlpha = 15,
      mode = "grain",
      animated = true,
      fps = 30,
      vignette = false,
      vignetteDarkness = 0.6,
      scanlines = false,
      scanlineDensity = 3,
      scanlineOpacity = 0.1,
      blendMode = "normal",
      fullScreen = false,
      canvasClassName,
      canvasRef: externalCanvasRef,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const patternsRef = useRef<HTMLCanvasElement[]>([]);

    const [isVisible, setIsVisible] = useState(true);
    const [isPageActive, setIsPageActive] = useState(true);
    const [reducedMotion, setReducedMotion] = useState(false);

    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    const setCanvasRefs = useCallback(
      (node: HTMLCanvasElement | null) => {
        internalCanvasRef.current = node;
        if (typeof externalCanvasRef === "function") {
          externalCanvasRef(node);
        } else if (externalCanvasRef && "current" in externalCanvasRef) {
          (
            externalCanvasRef as React.MutableRefObject<HTMLCanvasElement | null>
          ).current = node;
        }
      },
      [externalCanvasRef],
    );

    useEffect(() => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(media.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }, []);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0 },
      );

      observer.observe(container);

      const handleVisibility = () => {
        setIsPageActive(!document.hidden);
      };
      document.addEventListener("visibilitychange", handleVisibility);

      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    }, []);

    useEffect(() => {
      const container = containerRef.current;
      const canvas = internalCanvasRef.current;
      if (!container || !canvas) return;

      const updateSize = () => {
        const rect = container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const displayWidth = Math.max(1, Math.round(rect.width));
        const displayHeight = Math.max(1, Math.round(rect.height));

        const targetW = displayWidth * dpr;
        const targetH = displayHeight * dpr;

        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
          canvas.style.width = `${displayWidth}px`;
          canvas.style.height = `${displayHeight}px`;
        }
      };

      updateSize();
      const observer = new ResizeObserver(updateSize);
      observer.observe(container);

      return () => {
        observer.disconnect();
      };
    }, [fullScreen]);

    useEffect(() => {
      const frameCount = 8;
      const frames: HTMLCanvasElement[] = [];

      for (let i = 0; i < frameCount; i++) {
        frames.push(createPatternFrame(patternSize, patternAlpha, mode, i));
      }

      patternsRef.current = frames;
    }, [patternSize, patternAlpha, mode]);

    useEffect(() => {
      let animationId: number;
      let frameCount = 0;
      let cacheIdx = 0;
      let lastTime = performance.now();
      const targetInterval = fps > 0 ? 1000 / fps : 1000 / 60;

      const render = (now: number) => {
        animationId = window.requestAnimationFrame(render);

        if (!isVisible || !isPageActive) return;

        if (now - lastTime < targetInterval) return;
        lastTime = now;

        frameCount++;
        if (
          patternRefreshInterval > 1 &&
          frameCount % patternRefreshInterval !== 0
        ) {
          return;
        }

        const canvas = internalCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        if (w === 0 || h === 0) return;

        ctx.clearRect(0, 0, w, h);

        const frames = patternsRef.current;
        if (frames.length > 0) {
          if (animated && !reducedMotion) {
            cacheIdx = (cacheIdx + 1) % frames.length;
          }
          const currentFrame = frames[cacheIdx];
          const pattern = ctx.createPattern(currentFrame, "repeat");
          if (pattern) {
            const matrix = new DOMMatrix();
            if (animated && !reducedMotion) {
              const jx = (Math.random() * patternSize) | 0;
              const jy = (Math.random() * patternSize) | 0;
              matrix.translateSelf(jx, jy);
            }
            matrix.scaleSelf(patternScaleX, patternScaleY);
            pattern.setTransform(matrix);
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, w, h);
          }
        }
      };

      animationId = window.requestAnimationFrame(render);

      return () => {
        window.cancelAnimationFrame(animationId);
      };
    }, [
      patternSize,
      patternScaleX,
      patternScaleY,
      patternRefreshInterval,
      animated,
      fps,
      isVisible,
      isPageActive,
      reducedMotion,
    ]);

    return (
      <div
        ref={containerRef}
        data-slot="noise"
        className={cn(
          "relative overflow-hidden",
          fullScreen ? "fixed inset-0 h-screen w-screen z-0" : "w-full h-full",
          className,
        )}
        style={style}
        {...props}
      >
        <canvas
          ref={setCanvasRefs}
          data-slot="noise-canvas"
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full",
            canvasClassName,
          )}
          style={{
            imageRendering: "pixelated",
            mixBlendMode: blendMode,
          }}
        />

        {vignette && (
          <div
            data-slot="noise-vignette"
            className="pointer-events-none absolute inset-0 z-2"
            style={{
              background: `radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, ${vignetteDarkness}) 100%)`,
            }}
          />
        )}

        {scanlines && (
          <div
            data-slot="noise-scanlines"
            className="pointer-events-none absolute inset-0 z-3"
            style={{
              background: `repeating-linear-gradient(to bottom, transparent 0px, transparent ${scanlineDensity}px, rgba(0, 0, 0, ${scanlineOpacity}) ${scanlineDensity}px, rgba(0, 0, 0, ${scanlineOpacity}) ${scanlineDensity * 2}px)`,
            }}
          />
        )}

        {children && <div className="relative z-10">{children}</div>}
      </div>
    );
  },
);

Noise.displayName = "Noise";

export default Noise;
