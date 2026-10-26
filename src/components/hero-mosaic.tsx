"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "@/lib/use-media-query";

gsap.registerPlugin(useGSAP);

const LiquidMedia = dynamic(
  () => import("@/registry/ui/liquid-media").then((module) => module.LiquidMedia),
  { ssr: false },
);

type Tile = {
  x: number;
  y: number;
  wave: number;
  branded: boolean;
  shade: number;
};

type MosaicScene = {
  clock: { phase: number; theme: number };
  draw: () => void;
  syncPlayback: () => void;
};

function createTile(
  size: number,
  kind: "cream" | "brand" | "blue" | "orange",
  isDark: boolean,
  shade = 0,
) {
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;
  const context = sprite.getContext("2d");
  if (!context) return sprite;

  context.scale(size / 32, size / 32);
  context.lineWidth = 1;
  if (kind === "cream") {
    context.fillStyle = (isDark
      ? ["#e9e3d5", "#d9d3c5", "#c6c1b4"]
      : ["#dad9ca", "#cccbbd", "#bebdaf"])[shade];
    context.fillRect(0.5, 0.5, 31, 31);
  } else if (kind === "brand") {
    context.fillStyle = "#0080fc";
    context.fillRect(0, 0, 32, 32);
    context.strokeStyle = "#062a4f";
    context.lineWidth = 1.7;
    context.beginPath();
    context.moveTo(8, 23);
    context.lineTo(15, 13);
    context.lineTo(19, 18);
    context.lineTo(25, 7);
    context.stroke();
  } else {
    const blue = isDark ? "#4199b5" : "#157caa";
    const orange = isDark ? "#ee6b35" : "#df6a3b";
    context.strokeStyle = kind === "blue" ? blue : orange;
    context.lineWidth = kind === "blue" ? 3.5 : 2;
    if (kind === "orange") {
      context.fillStyle = orange;
      context.fillRect(0, 0, 32, 32);
      context.strokeStyle = "#282723";
    }
    context.strokeRect(3, 3, 26, 26);
  }
  return sprite;
}

export function HeroMosaic({ isDark }: { isDark: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<MosaicScene | null>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const root = rootRef.current;
      const context = canvas?.getContext("2d", { alpha: true });
      const blendCanvas = document.createElement("canvas");
      const blendContext = blendCanvas.getContext("2d");
      if (!canvas || !root || !context || !blendContext) return;

      let width = 0;
      let height = 0;
      let cell = 0;
      let tiles: Tile[] = [];
      let palettes: HTMLCanvasElement[][] = [];
      let inView = false;
      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const clock = {
        phase: 0,
        theme: document.documentElement.classList.contains("dark") ? 1 : 0,
      };
      if (!motionQuery.matches) {
        gsap.from(root, { opacity: 0, duration: 1.4, ease: "power3.out" });
      }

      const drawPalette = (target: CanvasRenderingContext2D, dark: boolean) => {
        const sprites = palettes[dark ? 1 : 0];
        target.fillStyle = dark ? "#000000" : "#f7f7f2";
        target.fillRect(0, 0, width, height);
        for (const tile of tiles) {
          const wave = Math.sin(clock.phase * Math.PI * 2 + tile.wave);
          const blue = gsap.utils.clamp(0, 1, (wave + 0.1) / 0.2);
          const base = sprites[tile.branded ? 3 : tile.shade];
          target.globalAlpha = 1 - blue;
          target.drawImage(base, tile.x, tile.y, cell, cell);
          target.globalAlpha = blue;
          target.drawImage(sprites[4], tile.x, tile.y, cell, cell);
          const spark = Math.max(0, 1 - Math.abs(wave) / 0.16);
          if (spark > 0) {
            target.globalAlpha = spark;
            target.drawImage(sprites[5], tile.x, tile.y, cell, cell);
          }
        }
        target.globalAlpha = 1;
      };

      const draw = () => {
        if (clock.theme === 0 || clock.theme === 1) {
          drawPalette(context, clock.theme === 1);
          return;
        }
        drawPalette(context, false);
        drawPalette(blendContext, true);
        context.globalAlpha = clock.theme;
        context.drawImage(blendCanvas, 0, 0, width, height);
        context.globalAlpha = 1;
      };

      const resize = () => {
        width = root.clientWidth;
        height = root.clientHeight;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        blendCanvas.width = canvas.width;
        blendCanvas.height = canvas.height;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        blendContext.setTransform(ratio, 0, 0, ratio, 0, 0);
        const columns = width < 640 ? 32 : 60;
        cell = width / columns;
        const spriteSize = Math.ceil(cell * ratio);
        palettes = [false, true].map((dark) => [
          createTile(spriteSize, "cream", dark),
          createTile(spriteSize, "cream", dark, 1),
          createTile(spriteSize, "cream", dark, 2),
          createTile(spriteSize, "brand", dark),
          createTile(spriteSize, "blue", dark),
          createTile(spriteSize, "orange", dark),
        ]);
        tiles = [];
        const rows = Math.ceil(height / cell);
        for (let row = 0; row < rows; row++) {
          const y = row / (rows - 1);
          for (let column = 0; column < columns; column++) {
            const right = column >= columns / 2;
            const edge = right ? columns - column - 1 : column;
            const curve = Math.pow(Math.abs(y * 2 - 1), 1.5);
            const ripple =
              Math.sin(row * 0.63 + (right ? 2.3 : 0)) * 0.025 +
              Math.sin(row * 1.47) * 0.014;
            const depth =
              width < 640
                ? (0.015 + curve * 0.3 + ripple * 0.5) * columns
                : (0.07 + curve * 0.22 + ripple) * columns;
            if (edge >= Math.round(depth)) continue;
            const patch =
              Math.sin(column * 0.44 + row * 0.34) +
              Math.cos(row * 0.71 - column * 0.23);
            tiles.push({
              x: column * cell,
              y: row * cell,
              wave: column / columns * 3.6 + Math.sin(row * 0.3) * 0.22 - 1.8,
              branded: patch > 0.25,
              shade:
                patch < -1.25
                  ? 1
                  : (row * 7 + column * 13) % 19 === 0
                    ? 2
                    : 0,
            });
          }
        }
        draw();
      };

      resize();
      const animation = gsap.to(clock, {
        phase: 1,
        duration: 14,
        ease: "none",
        repeat: -1,
        paused: true,
        onUpdate: draw,
      });

      const syncPlayback = () => {
        animation.paused(motionQuery.matches || document.hidden || !inView);
      };
      sceneRef.current = { clock, draw, syncPlayback };
      const visibility = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncPlayback();
      });
      const observer = new ResizeObserver(resize);
      observer.observe(root);
      visibility.observe(root);
      document.addEventListener("visibilitychange", syncPlayback);

      return () => {
        animation.kill();
        observer.disconnect();
        visibility.disconnect();
        document.removeEventListener("visibilitychange", syncPlayback);
        sceneRef.current = null;
      };
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      const scene = sceneRef.current;
      if (!scene) return;
      scene.syncPlayback();
      gsap.to(scene.clock, {
        theme: document.documentElement.classList.contains("dark") ? 1 : 0,
        duration: reducedMotion ? 0 : 0.5,
        ease: "power2.inOut",
        overwrite: "auto",
        onUpdate: scene.draw,
      });
    },
    { scope: rootRef, dependencies: [isDark, reducedMotion] },
  );

  return (
    <div
      ref={rootRef}
      data-hero-art
      aria-hidden="true"
      className="absolute inset-0 z-0 [mask-image:linear-gradient(to_bottom,#000_0%,#000_82%,transparent_100%)]"
    >
      <canvas
        ref={canvasRef}
        data-hero-mosaic
        className="absolute inset-0 h-full w-full"
      />
      {!reducedMotion && (
        <LiquidMedia
          type="canvas"
          source={canvasRef}
          intensity={0.22}
          radius={14}
          expandRate={8}
          decayRate={5}
          containerClassName="pointer-events-none absolute! inset-0"
        />
      )}
    </div>
  );
}
