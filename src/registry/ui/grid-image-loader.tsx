"use client";

import {
  CursorTrailLoader,
  type CursorTrailLoaderProps,
} from "./cursor-trail-loader";

export const GRID_IMAGE_LOADER_MESSAGES = [
  "MOVE FIRST",
  "OWN THE PACE",
  "CHASE DAYLIGHT",
  "MOVE FIRST",
  "READY?",
  "LET'S GO",
] as const;

export type GridImageLoaderProps = Pick<
  CursorTrailLoaderProps,
  | "images"
  | "children"
  | "progress"
  | "duration"
  | "revealDuration"
  | "trailLifetime"
  | "borderRadius"
  | "background"
  | "foreground"
  | "paused"
  | "replayKey"
  | "label"
  | "className"
  | "onComplete"
  | "messages"
  | "gridColumns"
  | "gridRows"
  | "gridOpacity"
>;

export function GridImageLoader({
  messages = GRID_IMAGE_LOADER_MESSAGES,
  duration = 6,
  revealDuration = 0.95,
  trailLifetime = 0.65,
  gridColumns = 4,
  gridRows = 4,
  gridOpacity = 0.07,
  borderRadius = 0,
  background = "#191919",
  foreground = "#f0efe9",
  ...props
}: GridImageLoaderProps) {
  return (
    <CursorTrailLoader
      {...props}
      layout="grid"
      messages={messages}
      duration={duration}
      revealDuration={revealDuration}
      trailLifetime={trailLifetime}
      gridColumns={gridColumns}
      gridRows={gridRows}
      gridOpacity={gridOpacity}
      borderRadius={borderRadius}
      background={background}
      foreground={foreground}
      trailLength={12}
      rotation={0}
    />
  );
}

export default GridImageLoader;
