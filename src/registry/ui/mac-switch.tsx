"use client";

import React, { useEffect, useRef, useId, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  mix,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

export type MacSwitchColor =
  | "green"
  | "blue"
  | "purple"
  | "orange"
  | "pink"
  | "amber"
  | "monochrome";

export type MacSwitchSize = "sm" | "md" | "lg";
export type MacSwitchMaterial = "liquid" | "frosted" | "clear";

export interface SwitchFilterProps {
  id?: string;
  blur?: MotionValue<number> | number;
  scaleRatio?: MotionValue<number> | number;
  specularOpacity?: MotionValue<number> | number;
  specularSaturation?: MotionValue<number> | number;
  width?: number;
  height?: number;
  radius?: number;
  bezelWidth?: number;
}

const SWITCH_COLORS: Record<
  MacSwitchColor,
  { fill: string; dot: string; label: string; glow: string }
> = {
  green: {
    fill: "#34C759",
    dot: "bg-emerald-500",
    label: "Green",
    glow: "rgba(52, 199, 89, 0.4)",
  },
  blue: {
    fill: "#007AFF",
    dot: "bg-blue-500",
    label: "Blue",
    glow: "rgba(0, 122, 255, 0.4)",
  },
  purple: {
    fill: "#AF52DE",
    dot: "bg-purple-500",
    label: "Purple",
    glow: "rgba(175, 82, 222, 0.4)",
  },
  orange: {
    fill: "#FF9500",
    dot: "bg-orange-500",
    label: "Orange",
    glow: "rgba(255, 149, 0, 0.4)",
  },
  pink: {
    fill: "#FF2D55",
    dot: "bg-pink-500",
    label: "Pink",
    glow: "rgba(255, 45, 85, 0.4)",
  },
  amber: {
    fill: "#FFCC00",
    dot: "bg-amber-400",
    label: "Amber",
    glow: "rgba(255, 204, 0, 0.4)",
  },
  monochrome: {
    fill: "#8E8E93",
    dot: "bg-zinc-300",
    label: "Graphite",
    glow: "rgba(142, 142, 147, 0.3)",
  },
};

const SWITCH_SIZES: Record<
  MacSwitchSize,
  {
    sliderWidth: number;
    sliderHeight: number;
    thumbWidth: number;
    thumbHeight: number;
    bezelWidth: number;
  }
> = {
  sm: {
    sliderWidth: 120,
    sliderHeight: 50,
    thumbWidth: 110,
    thumbHeight: 69,
    bezelWidth: 14,
  },
  md: {
    sliderWidth: 160,
    sliderHeight: 67,
    thumbWidth: 146,
    thumbHeight: 92,
    bezelWidth: 19,
  },
  lg: {
    sliderWidth: 200,
    sliderHeight: 84,
    thumbWidth: 182,
    thumbHeight: 115,
    bezelWidth: 24,
  },
};

function isMotionValue(val: unknown): val is MotionValue<number> {
  return typeof val === "object" && val !== null && "get" in val && "on" in val;
}

function getNumericValue(
  val?: MotionValue<number> | number,
  fallback = 0,
): number {
  if (val === undefined) return fallback;
  if (isMotionValue(val)) return Number(val.get()) || fallback;
  return Number(val) || fallback;
}

export const SwitchFilter: React.FC<SwitchFilterProps> = ({
  id = "thumb-filter-switch",
  blur,
  scaleRatio,
  specularOpacity,
  specularSaturation,
  width = 146,
  height = 92,
  radius = 46,
  bezelWidth = 19,
}) => {
  const feImageRef = useRef<SVGFEImageElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const specRef = useRef<SVGFESpecularLightingElement>(null);
  const satRef = useRef<SVGFEColorMatrixElement>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;
    let pos = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const segX = Math.max(radius, Math.min(width - radius, x));
        const segY = height / 2;
        const dx = x - segX;
        const dy = y - segY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const distEdge = radius - dist;

        if (distEdge <= 0 || distEdge >= bezelWidth) {
          data[pos++] = 128;
          data[pos++] = 128;
          data[pos++] = 255;
          data[pos++] = 255;
        } else {
          const u = distEdge / bezelWidth;
          const slope = Math.sin(u * Math.PI) * (1 - 0.25 * u);
          const dirX = dist > 0.001 ? dx / dist : 0;
          const dirY = dist > 0.001 ? dy / dist : 0;
          const nx = -dirX * slope * 0.9;
          const ny = -dirY * slope * 0.9;
          const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));

          data[pos++] = Math.round(128 + 127 * nx);
          data[pos++] = Math.round(128 + 127 * ny);
          data[pos++] = Math.round(128 + 127 * nz);
          data[pos++] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    feImageRef.current?.setAttribute("href", dataUrl);
  }, [width, height, radius, bezelWidth]);

  useEffect(() => {
    const unsubBlur = isMotionValue(blur)
      ? blur.on("change", (v) => {
          blurRef.current?.setAttribute("stdDeviation", String(v));
        })
      : undefined;

    const unsubDisp = isMotionValue(scaleRatio)
      ? scaleRatio.on("change", (v) => {
          dispRef.current?.setAttribute("scale", String(v * 24));
        })
      : undefined;

    const unsubSpec = isMotionValue(specularOpacity)
      ? specularOpacity.on("change", (v) => {
          specRef.current?.setAttribute("specularConstant", String(v * 1.5));
        })
      : undefined;

    const unsubSat = isMotionValue(specularSaturation)
      ? specularSaturation.on("change", (v) => {
          satRef.current?.setAttribute("values", String(1 + v * 0.15));
        })
      : undefined;

    const currentBlur = getNumericValue(blur, 0.2);
    const currentScale = getNumericValue(scaleRatio, 0.4);
    const currentSpec = getNumericValue(specularOpacity, 0.5);
    const currentSat = getNumericValue(specularSaturation, 6);

    blurRef.current?.setAttribute("stdDeviation", String(currentBlur));
    dispRef.current?.setAttribute("scale", String(currentScale * 24));
    specRef.current?.setAttribute(
      "specularConstant",
      String(currentSpec * 1.5),
    );
    satRef.current?.setAttribute("values", String(1 + currentSat * 0.15));

    return () => {
      unsubBlur?.();
      unsubDisp?.();
      unsubSpec?.();
      unsubSat?.();
    };
  }, [blur, scaleRatio, specularOpacity, specularSaturation]);

  const initialBlur = getNumericValue(blur, 0.2);
  const initialDisp = getNumericValue(scaleRatio, 0.4) * 24;
  const initialSpec = getNumericValue(specularOpacity, 0.5) * 1.5;
  const initialSat = 1 + getNumericValue(specularSaturation, 6) * 0.15;

  return (
    <svg
      width="0"
      height="0"
      className="pointer-events-none absolute -z-10 opacity-0"
      aria-hidden="true"
    >
      <defs>
        <filter
          id={id}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feImage
            ref={feImageRef}
            result="normalMap"
            x="0"
            y="0"
            width={width}
            height={height}
            preserveAspectRatio="none"
          />
          <feGaussianBlur
            ref={blurRef}
            in="SourceGraphic"
            stdDeviation={initialBlur}
            result="blurred"
          />
          <feDisplacementMap
            ref={dispRef}
            in="blurred"
            in2="normalMap"
            scale={initialDisp}
            xChannelSelector="R"
            yChannelSelector="G"
            result="refracted"
          />
          <feSpecularLighting
            ref={specRef}
            in="normalMap"
            surfaceScale="2"
            specularConstant={initialSpec}
            specularExponent="24"
            result="specular"
            lightingColor="#ffffff"
          >
            <feDistantLight azimuth="235" elevation="55" />
          </feSpecularLighting>
          <feColorMatrix
            ref={satRef}
            in="refracted"
            type="saturate"
            values={String(initialSat)}
            result="saturated"
          />
          <feBlend in="saturated" in2="specular" mode="screen" />
        </filter>
      </defs>
    </svg>
  );
};

export const Filter = SwitchFilter;

type SpringConfig = Parameters<typeof useSpring>[1];

function useReducibleSpring(
  source: MotionValue<number>,
  config: SpringConfig,
  instant: boolean,
): MotionValue<number> {
  const spring = useSpring(source, config);
  return instant ? source : spring;
}

export interface MacSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: MacSwitchSize;
  color?: MacSwitchColor;
  material?: MacSwitchMaterial;
  forceActive?: boolean;
  specularOpacity?: number;
  specularSaturation?: number;
  refractionLevel?: number;
  blurLevel?: number;
  className?: string;
  label?: string;
}

export const MacSwitch: React.FC<MacSwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  color = "green",
  material = "liquid",
  forceActive = false,
  specularOpacity: specularOpacityProp = 0.5,
  specularSaturation: specularSaturationProp = 6,
  refractionLevel = 1.0,
  blurLevel = 0.2,
  className,
  label = "Toggle switch",
}) => {
  const generatedId = useId();
  const reduceMotion = useReducedMotion() ?? false;
  const filterId = `mac-switch-filter-${generatedId.replace(/:/g, "")}`;

  const currentTheme = SWITCH_COLORS[color] ?? SWITCH_COLORS.green;
  const currentSize = SWITCH_SIZES[size] ?? SWITCH_SIZES.md;
  const { sliderWidth, sliderHeight, thumbWidth, thumbHeight, bezelWidth } =
    currentSize;

  const thumbRadius = thumbHeight / 2;
  const THUMB_REST_SCALE = 0.65;
  const THUMB_ACTIVE_SCALE = 0.9;
  const THUMB_REST_OFFSET = ((1 - THUMB_REST_SCALE) * thumbWidth) / 2;
  const TRAVEL =
    sliderWidth - sliderHeight - (thumbWidth - thumbHeight) * THUMB_REST_SCALE;
  const thumbMarginLeft =
    -THUMB_REST_OFFSET + (sliderHeight - thumbHeight * THUMB_REST_SCALE) / 2;

  const isControlled = controlledChecked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked);
  const isChecked = isControlled ? controlledChecked : uncontrolledChecked;

  const checked = useMotionValue(isChecked ? 1 : 0);
  const pointerDown = useMotionValue(0);
  const forceActiveMotion = useMotionValue(forceActive ? 1 : 0);
  const xDragRatio = useMotionValue(isChecked ? 1 : 0);
  const initialPointerX = useMotionValue(0);

  const isDraggingRef = useRef(false);

  useEffect(() => {
    forceActiveMotion.set(forceActive ? 1 : 0);
  }, [forceActive, forceActiveMotion]);

  useEffect(() => {
    if (controlledChecked !== undefined) {
      const nextVal = controlledChecked ? 1 : 0;
      checked.set(nextVal);
      xDragRatio.set(nextVal);
    }
  }, [controlledChecked, checked, xDragRatio]);

  const active = useTransform((): number =>
    forceActiveMotion.get() > 0.5 || pointerDown.get() > 0.5 ? 1 : 0,
  );

  const blur = useMotionValue(blurLevel);
  const specularOpacity = useMotionValue(specularOpacityProp);
  const specularSaturation = useMotionValue(specularSaturationProp);
  const refractionBase = useMotionValue(refractionLevel);

  useEffect(() => {
    blur.set(blurLevel);
  }, [blurLevel, blur]);

  useEffect(() => {
    specularOpacity.set(specularOpacityProp);
  }, [specularOpacityProp, specularOpacity]);

  useEffect(() => {
    specularSaturation.set(specularSaturationProp);
  }, [specularSaturationProp, specularSaturation]);

  useEffect(() => {
    refractionBase.set(refractionLevel);
  }, [refractionLevel, refractionBase]);

  const xRatio = useReducibleSpring(
    useTransform((): number => {
      const c = checked.get();
      const dragRatio = xDragRatio.get();
      if (pointerDown.get() > 0.5) {
        return dragRatio;
      }
      return c > 0.5 ? 1 : 0;
    }),
    { damping: 42, stiffness: 520, mass: 0.8 },
    reduceMotion,
  );

  const backgroundOpacity = useReducibleSpring(
    useTransform(active, (v) => 1 - 0.9 * v),
    { damping: 42, stiffness: 600, mass: 0.8 },
    reduceMotion,
  );

  const thumbScale = useReducibleSpring(
    useTransform(
      active,
      (v) => THUMB_REST_SCALE + (THUMB_ACTIVE_SCALE - THUMB_REST_SCALE) * v,
    ),
    { damping: 42, stiffness: 600, mass: 0.8 },
    reduceMotion,
  );

  const scaleRatio = useReducibleSpring(
    useTransform(() => (0.4 + 0.5 * active.get()) * refractionBase.get()),
    { damping: 42, stiffness: 600, mass: 0.8 },
    reduceMotion,
  );

  const considerChecked = useTransform((): number => {
    const x = xDragRatio.get();
    const c = checked.get();
    return pointerDown.get() > 0.5 ? (x > 0.5 ? 1 : 0) : c > 0.5 ? 1 : 0;
  });

  const backgroundColor = useTransform(
    useReducibleSpring(
      considerChecked,
      { damping: 42, stiffness: 520 },
      reduceMotion,
    ),
    mix("#94949F55", currentTheme.fill),
  );

  const thumbX = useTransform(xRatio, (r) => r * TRAVEL);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    isDraggingRef.current = true;
    pointerDown.set(1);
    initialPointerX.set(e.clientX);
    xDragRatio.set(checked.get());
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || disabled) return;
    const baseRatio = checked.get();
    const displacementX = e.clientX - initialPointerX.get();
    const ratio = baseRatio + displacementX / TRAVEL;
    const overflow = ratio < 0 ? -ratio : ratio > 1 ? ratio - 1 : 0;
    const overflowSign = ratio < 0 ? -1 : 1;
    const dampedOverflow = (overflowSign * overflow) / 22;
    xDragRatio.set(Math.min(1, Math.max(0, ratio)) + dampedOverflow);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    pointerDown.set(0);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const displacement = Math.abs(e.clientX - initialPointerX.get());
    let nextChecked: boolean;
    if (displacement < 4) {
      nextChecked = checked.get() < 0.5;
    } else {
      nextChecked = xDragRatio.get() > 0.5;
    }

    const nextVal = nextChecked ? 1 : 0;
    checked.set(nextVal);
    xDragRatio.set(nextVal);
    if (!isControlled) {
      setUncontrolledChecked(nextChecked);
    }
    onChange?.(nextChecked);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const nextChecked = checked.get() < 0.5;
      const nextVal = nextChecked ? 1 : 0;
      checked.set(nextVal);
      xDragRatio.set(nextVal);
      if (!isControlled) {
        setUncontrolledChecked(nextChecked);
      }
      onChange?.(nextChecked);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      checked.set(0);
      xDragRatio.set(0);
      if (!isControlled) {
        setUncontrolledChecked(false);
      }
      onChange?.(false);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      checked.set(1);
      xDragRatio.set(1);
      if (!isControlled) {
        setUncontrolledChecked(true);
      }
      onChange?.(true);
    }
  };

  const backdropStyle =
    material === "liquid"
      ? `url(#${filterId}) blur(14px)`
      : material === "frosted"
        ? "blur(24px) saturate(180%)"
        : "blur(8px) saturate(120%)";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center select-none py-4",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    >
      {material === "liquid" && (
        <SwitchFilter
          id={filterId}
          blur={blur}
          scaleRatio={scaleRatio}
          specularOpacity={specularOpacity}
          specularSaturation={specularSaturation}
          width={thumbWidth}
          height={thumbHeight}
          radius={thumbRadius}
          bezelWidth={bezelWidth}
        />
      )}

      <motion.div
        role="switch"
        aria-checked={isChecked}
        aria-label={label}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative inline-block touch-none select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
        style={{
          width: sliderWidth,
          height: sliderHeight,
          backgroundColor: backgroundColor,
          borderRadius: sliderHeight / 2,
          boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.15)",
        }}
      >
        <motion.div
          className="absolute pointer-events-none"
          style={{
            height: thumbHeight,
            width: thumbWidth,
            marginLeft: thumbMarginLeft,
            x: thumbX,
            y: "-50%",
            borderRadius: thumbRadius,
            top: sliderHeight / 2,
            backdropFilter: backdropStyle,
            WebkitBackdropFilter: backdropStyle,
            scale: thumbScale,
            willChange: "transform",
            backgroundColor: useTransform(
              backgroundOpacity,
              (op) => `rgba(255, 255, 255, ${op})`,
            ),
            boxShadow: useTransform(() => {
              const isPressed = pointerDown.get() > 0.5;
              return (
                "0 4px 22px rgba(0, 0, 0, 0.14), inset 0 1px 1.5px rgba(255, 255, 255, 0.85)" +
                (isPressed
                  ? ", inset 2px 7px 24px rgba(0,0,0,0.09), inset -2px -7px 24px rgba(255,255,255,0.09)"
                  : "")
              );
            }),
            border: "0.5px solid rgba(255, 255, 255, 0.4)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-35"
            style={{
              borderRadius: `${thumbRadius}px ${thumbRadius}px 0 0`,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.05) 100%)",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Switch = MacSwitch;
