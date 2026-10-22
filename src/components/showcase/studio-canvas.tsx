"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import {
  CursorArrowIcon,
  HandIcon,
  MoveIcon,
  MinusIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, Draggable);

type CanvasMode = "interact" | "move" | "pan";

const modes = [
  { value: "interact", label: "Interact with component", icon: CursorArrowIcon },
  { value: "move", label: "Move component", icon: MoveIcon },
  { value: "pan", label: "Pan canvas", icon: HandIcon },
] as const;

export function StudioCanvas({
  children,
  className,
  showGrid = true,
}: {
  children: ReactNode;
  className?: string;
  showGrid?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Draggable | null>(null);
  const zoomRef = useRef(1);
  const [mode, setMode] = useState<CanvasMode>("interact");
  const [zoom, setZoom] = useState(1);

  const syncGrid = useCallback(() => {
    const grid = gridRef.current;
    const root = rootRef.current;
    const camera = cameraRef.current;
    if (!grid || !root || !camera) return;
    const scale = zoomRef.current;
    const x = Number(gsap.getProperty(camera, "x"));
    const y = Number(gsap.getProperty(camera, "y"));
    const originX = x + root.clientWidth * (1 - scale) / 2;
    const originY = y + root.clientHeight * (1 - scale) / 2;
    grid.style.backgroundPosition = `${originX}px ${originY}px`;
    grid.style.backgroundSize = `${20 * scale}px ${20 * scale}px`;
  }, []);

  const { contextSafe } = useGSAP({ scope: rootRef });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(syncGrid);
    observer.observe(root);
    syncGrid();
    return () => observer.disconnect();
  }, [syncGrid]);

  useEffect(() => {
    const camera = cameraRef.current;
    const component = componentRef.current;
    const trigger = surfaceRef.current;
    if (mode === "interact" || !camera || !component || !trigger) return;
    trigger.focus({ preventScroll: true });
    const [drag] = Draggable.create(mode === "move" ? component : camera, {
      type: "x,y",
      trigger,
      zIndexBoost: false,
      minimumMovement: 3,
      dragClickables: true,
      cursor: mode === "move" ? "move" : "grab",
      activeCursor: "grabbing",
      onDrag: syncGrid,
    });
    dragRef.current = drag;
    return () => {
      drag.kill();
      dragRef.current = null;
    };
  }, [mode, syncGrid]);

  const changeZoom = (next: number) => {
    contextSafe(() => {
      const value = Math.min(2, Math.max(0.25, Math.round(next * 100) / 100));
      zoomRef.current = value;
      setZoom(value);
      gsap.set(scaleRef.current, { scale: value });
      dragRef.current?.update();
      syncGrid();
    })();
  };

  const reset = () => {
    contextSafe(() => {
      gsap.set([cameraRef.current, componentRef.current], { x: 0, y: 0 });
      changeZoom(1);
      dragRef.current?.update();
    })();
  };

  const moveWithKeyboard = (key: string, shift: boolean) => {
    contextSafe(() => {
      const offsets: Record<string, [number, number]> = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      };
      const offset = offsets[key];
      const target = mode === "move" ? componentRef.current : cameraRef.current;
      if (!offset || !target) return;
      const step = (shift ? 50 : 10) / (mode === "move" ? zoomRef.current : 1);
      gsap.set(target, {
        x: Number(gsap.getProperty(target, "x")) + offset[0] * step,
        y: Number(gsap.getProperty(target, "y")) + offset[1] * step,
      });
      dragRef.current?.update();
      syncGrid();
    })();
  };

  return (
    <div
      ref={rootRef}
      data-studio-canvas
      className="absolute inset-0 isolate overflow-hidden"
    >
      {showGrid && (
        <div
          ref={gridRef}
          data-studio-grid
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-size-[20px_20px] text-foreground/8"
        />
      )}
      <div ref={cameraRef} className="pointer-events-none absolute inset-0">
        <div ref={scaleRef} className="absolute inset-0 origin-center">
          <div
            ref={componentRef}
            data-studio-component
            className={cn(
              "pointer-events-auto flex h-full w-full cursor-auto items-center justify-center",
              className,
            )}
          >
            {children}
          </div>
        </div>
      </div>
      {mode !== "interact" && (
        <div
          ref={surfaceRef}
          role="group"
          aria-label={
            mode === "move" ? "Move component on canvas" : "Pan infinite canvas"
          }
          tabIndex={0}
          className="absolute inset-0 z-10 touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              setMode("interact");
              rootRef.current
                ?.querySelector<HTMLButtonElement>('[data-canvas-mode="interact"]')
                ?.focus();
            } else if (
              ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
            ) {
              event.preventDefault();
              moveWithKeyboard(event.key, event.shiftKey);
            }
          }}
        />
      )}
      <div
        data-studio-canvas-tools
        role="toolbar"
        aria-label="Canvas tools"
        className="absolute bottom-4 left-4 z-20 flex max-w-[calc(100%-6rem)] flex-wrap items-center gap-0.5 rounded-xl border border-border bg-panel p-1 shadow-sm"
      >
        {modes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            data-canvas-mode={value}
            aria-label={label}
            aria-pressed={mode === value}
            title={label}
            onClick={() => setMode(value)}
            className={cn(
              "flex size-9 cursor-pointer items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
              mode === value
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
          </button>
        ))}
        <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
        <button
          type="button"
          aria-label="Zoom out"
          title="Zoom out"
          disabled={zoom <= 0.25}
          onClick={() => changeZoom(zoom - 0.1)}
          className="flex size-9 cursor-pointer items-center justify-center rounded-lg hover:bg-muted focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-40"
        >
          <MinusIcon className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label="Reset canvas"
          title="Reset position and zoom"
          onClick={reset}
          className="h-9 min-w-11 cursor-pointer rounded-lg px-1 font-mono text-[11px] hover:bg-muted focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          aria-label="Zoom in"
          title="Zoom in"
          disabled={zoom >= 2}
          onClick={() => changeZoom(zoom + 0.1)}
          className="flex size-9 cursor-pointer items-center justify-center rounded-lg hover:bg-muted focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-40"
        >
          <PlusIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
