"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createMosaicTile } from "@/lib/mosaic-tile";
import { useMediaQuery } from "@/lib/use-media-query";

gsap.registerPlugin(useGSAP);

type MosaicTile = {
  x: number;
  y: number;
  alpha: number;
  phase: number;
  branded: boolean;
};

type MosaicScene = {
  clock: { phase: number; theme: number };
  draw: () => void;
  sync: () => void;
};

export function FeatureMosaic({ seed, isDark }: { seed: number; isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<MosaicScene | null>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;

      const clock = {
        phase: seed * 0.17,
        theme: document.documentElement.classList.contains("dark") ? 1 : 0,
      };
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      let cell = 0;
      let width = 0;
      let height = 0;
      let visible = false;
      let tiles: MosaicTile[] = [];
      let palettes: HTMLCanvasElement[][] = [];

      const draw = () => {
        context.clearRect(0, 0, width, height);
        for (const tile of tiles) {
          const wave = Math.sin(clock.phase * Math.PI * 2 + tile.phase);
          const blue = gsap.utils.clamp(0, 1, (wave + 0.35) / 0.7);
          for (const [index, weight] of [[0, 1 - clock.theme], [1, clock.theme]]) {
            if (weight === 0) continue;
            context.globalAlpha = tile.alpha * weight * (1 - blue);
            context.drawImage(palettes[index][tile.branded ? 1 : 0], tile.x, tile.y, cell, cell);
            context.globalAlpha = tile.alpha * weight * blue;
            context.drawImage(palettes[index][2], tile.x, tile.y, cell, cell);
          }
        }
        context.globalAlpha = 1;
      };

      const resize = () => {
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        const columns = Math.max(16, Math.round(width / 18));
        cell = width / columns;
        const rows = Math.ceil(height / cell);
        palettes = [false, true].map((dark) => [
          createMosaicTile(Math.ceil(cell * ratio), "cream", dark),
          createMosaicTile(Math.ceil(cell * ratio), "brand", dark),
          createMosaicTile(Math.ceil(cell * ratio), "blue", dark),
        ]);
        tiles = [];
        for (let row = 0; row < rows; row++) {
          const y = row / Math.max(1, rows - 1);
          for (let column = 0; column < columns; column++) {
            const x = column / Math.max(1, columns - 1);
            const ribbon = 0.26 + Math.sin(x * 4.2 + seed * 1.3) * 0.2;
            const distance = Math.abs(y - ribbon);
            if (distance > 0.24) continue;
            const grain = Math.sin(column * 2.9 + row * 1.7 + seed * 4.1);
            if (grain < -0.65 && distance > 0.12) continue;
            const clearance = Math.min(1, Math.hypot((x - 0.5) * 2, (y - 0.5) * 2.2));
            tiles.push({
              x: column * cell,
              y: row * cell,
              alpha: (1 - distance / 0.24) * Math.pow(1 - y, 1.8) * (0.3 + clearance * 0.7),
              phase: x * 4 + y * 2 + seed,
              branded: grain > 0.3,
            });
          }
        }
        draw();
      };

      resize();
      const animation = gsap.to(clock, {
        phase: "+=1",
        duration: 18,
        repeat: -1,
        ease: "none",
        paused: true,
        onUpdate: draw,
      });
      const sync = () => animation.paused(motion.matches || document.hidden || !visible);
      sceneRef.current = { clock, draw, sync };
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });
      const observer = new ResizeObserver(resize);
      intersection.observe(canvas);
      observer.observe(canvas);
      document.addEventListener("visibilitychange", sync);

      return () => {
        intersection.disconnect();
        observer.disconnect();
        animation.kill();
        document.removeEventListener("visibilitychange", sync);
        sceneRef.current = null;
      };
    },
    { scope: canvasRef, dependencies: [seed], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      const scene = sceneRef.current;
      if (!scene) return;
      scene.sync();
      gsap.to(scene.clock, {
        theme: isDark ? 1 : 0,
        duration: reducedMotion ? 0 : 0.5,
        ease: "power2.inOut",
        overwrite: "auto",
        onUpdate: scene.draw,
      });
    },
    { scope: canvasRef, dependencies: [isDark, reducedMotion] },
  );

  return (
    <canvas
      ref={canvasRef}
      data-feature-mosaic
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[var(--mosaic-opacity,0.42)]"
    />
  );
}
