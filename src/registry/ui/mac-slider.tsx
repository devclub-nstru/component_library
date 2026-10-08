"use client";

import React, { useEffect, useRef, useId, useCallback, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  animate,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

export type MacSliderColor =
  | "blue"
  | "emerald"
  | "violet"
  | "amber"
  | "rose"
  | "cyan"
  | "monochrome";

export type MacSliderSize = "sm" | "md" | "lg";
export type MacSliderMaterial = "liquid" | "frosted" | "clear";

export interface FilterProps {
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

const COLOR_THEMES: Record<
  MacSliderColor,
  { fill: string; dot: string; label: string; glow: string }
> = {
  blue: {
    fill: "#007AFF",
    dot: "bg-blue-500",
    label: "Blue",
    glow: "rgba(0, 122, 255, 0.35)",
  },
  emerald: {
    fill: "#10B981",
    dot: "bg-emerald-400",
    label: "Emerald",
    glow: "rgba(16, 185, 129, 0.35)",
  },
  violet: {
    fill: "#8B5CF6",
    dot: "bg-violet-400",
    label: "Violet",
    glow: "rgba(139, 92, 246, 0.35)",
  },
  amber: {
    fill: "#F59E0B",
    dot: "bg-amber-400",
    label: "Amber",
    glow: "rgba(245, 158, 11, 0.35)",
  },
  rose: {
    fill: "#F43F5E",
    dot: "bg-rose-400",
    label: "Rose",
    glow: "rgba(244, 63, 94, 0.35)",
  },
  cyan: {
    fill: "#06B6D4",
    dot: "bg-cyan-400",
    label: "Cyan",
    glow: "rgba(6, 182, 212, 0.35)",
  },
  monochrome: {
    fill: "#F4F4F5",
    dot: "bg-zinc-200",
    label: "Graphite",
    glow: "rgba(255, 255, 255, 0.25)",
  },
};

const SIZE_CONFIGS: Record<
  MacSliderSize,
  {
    sliderWidth: number;
    sliderHeight: number;
    thumbWidth: number;
    thumbHeight: number;
    thumbRadius: number;
    bezelWidth: number;
  }
> = {
  sm: {
    sliderWidth: 260,
    sliderHeight: 10,
    thumbWidth: 72,
    thumbHeight: 48,
    thumbRadius: 24,
    bezelWidth: 12,
  },
  md: {
    sliderWidth: 330,
    sliderHeight: 14,
    thumbWidth: 90,
    thumbHeight: 60,
    thumbRadius: 30,
    bezelWidth: 16,
  },
  lg: {
    sliderWidth: 400,
    sliderHeight: 18,
    thumbWidth: 108,
    thumbHeight: 72,
    thumbRadius: 36,
    bezelWidth: 20,
  },
};

type SpringConfig = Parameters<typeof useSpring>[1];

function useReducibleSpring(
  source: MotionValue<number>,
  config: SpringConfig,
  instant: boolean,
): MotionValue<number> {
  const spring = useSpring(source, config);
  return instant ? source : spring;
}

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

export const Filter: React.FC<FilterProps> = ({
  id = "thumb-filter-slider",
  blur,
  scaleRatio,
  specularOpacity,
  specularSaturation,
  width = 90,
  height = 60,
  radius = 30,
  bezelWidth = 16,
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
          const slope = Math.cos((u * Math.PI) / 2);
          const dirX = dist > 0.001 ? dx / dist : 0;
          const dirY = dist > 0.001 ? dy / dist : 0;
          const nx = -dirX * slope * 0.85;
          const ny = -dirY * slope * 0.85;
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

    const currentBlur = getNumericValue(blur, 0);
    const currentScale = getNumericValue(scaleRatio, 0.4);
    const currentSpec = getNumericValue(specularOpacity, 0.4);
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

  const initialBlur = getNumericValue(blur, 0);
  const initialDisp = getNumericValue(scaleRatio, 0.4) * 24;
  const initialSpec = getNumericValue(specularOpacity, 0.4) * 1.5;
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

export interface MacSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  color?: MacSliderColor;
  size?: MacSliderSize;
  material?: MacSliderMaterial;
  forceActive?: boolean;
  specularOpacity?: number;
  specularSaturation?: number;
  refractionLevel?: number;
  blurLevel?: number;
  className?: string;
  disabled?: boolean;
  label?: string;
}

export const MacSlider: React.FC<MacSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 10,
  value: controlledValue,
  onChange,
  color = "blue",
  size = "md",
  material = "liquid",
  forceActive = false,
  specularOpacity: specularOpacityProp = 0.4,
  specularSaturation: specularSaturationProp = 6,
  refractionLevel = 0.28,
  blurLevel = 0,
  className,
  disabled = false,
  label = "Value",
}) => {
  const generatedId = useId();
  const filterId = `mac-filter-${generatedId.replace(/:/g, "")}`;
  const reduceMotion = useReducedMotion() ?? false;

  const currentTheme = COLOR_THEMES[color] ?? COLOR_THEMES.blue;
  const currentSize = SIZE_CONFIGS[size] ?? SIZE_CONFIGS.md;
  const {
    sliderWidth,
    sliderHeight,
    thumbWidth,
    thumbHeight,
    thumbRadius,
    bezelWidth,
  } = currentSize;

  const SCALE_REST = 0.6;
  const SCALE_DRAG = 1;
  const thumbWidthRest = thumbWidth * SCALE_REST;
  const trackTravel = sliderWidth - thumbWidthRest;
  const minX = -thumbWidthRest / 3;

  const initialVal =
    controlledValue !== undefined ? controlledValue : defaultValue;
  const valueMotion = useMotionValue(initialVal);
  const [ariaValue, setAriaValue] = useState(initialVal);
  useMotionValueEvent(valueMotion, "change", setAriaValue);
  const initialRatio = Math.max(
    0,
    Math.min(1, (initialVal - min) / (max - min)),
  );
  const thumbX = useMotionValue(minX + initialRatio * trackTravel);

  const pointerDown = useMotionValue(0);
  const forceActiveMotion = useMotionValue(forceActive ? 1 : 0);

  useEffect(() => {
    forceActiveMotion.set(forceActive ? 1 : 0);
  }, [forceActive, forceActiveMotion]);

  const isUp = useTransform((): number =>
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

  const scaleRatio = useReducibleSpring(
    useTransform((): number => {
      const press = isUp.get() > 0.5 ? 0.9 : 0.4;
      return press * (refractionBase.get() || 0);
    }),
    {
      stiffness: 400,
      damping: 30,
      mass: 0.8,
    },
    reduceMotion,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const trackBoundsRef = useRef<{ left: number; width: number }>({
    left: 0,
    width: sliderWidth,
  });

  const scaleSpring = useReducibleSpring(
    useTransform(isUp, [0, 1], [SCALE_REST, SCALE_DRAG]),
    {
      stiffness: 400,
      damping: 30,
      mass: 0.8,
    },
    reduceMotion,
  );

  const backgroundOpacity = useReducibleSpring(
    useTransform(isUp, [0, 1], [1, 0.1]),
    {
      stiffness: 400,
      damping: 30,
      mass: 0.8,
    },
    reduceMotion,
  );

  const seekThumb = useCallback(
    (targetX: number) => {
      if (reduceMotion) {
        thumbX.jump(targetX);
        return;
      }
      animate(thumbX, targetX, {
        type: "spring",
        stiffness: 450,
        damping: 32,
        mass: 0.75,
      });
    },
    [reduceMotion, thumbX],
  );

  const updatePositionFromClientX = useCallback(
    (clientX: number, animateSpring = false) => {
      const { left, width } = trackBoundsRef.current;
      const effectiveTravel = width - thumbWidthRest;
      if (effectiveTravel <= 0) return;

      const clickX = clientX - left;
      const ratio = Math.max(
        0,
        Math.min(1, (clickX - thumbWidthRest / 2) / effectiveTravel),
      );

      const rawVal = min + ratio * (max - min);
      const steppedVal =
        step > 0 ? Math.round(rawVal / step) * step : Math.round(rawVal);
      const nextVal = Math.max(min, Math.min(max, steppedVal));

      const normalizedRatio = (nextVal - min) / (max - min);
      const targetX = minX + normalizedRatio * trackTravel;

      if (animateSpring) {
        seekThumb(targetX);
      } else {
        thumbX.set(targetX);
      }

      if (valueMotion.get() !== nextVal) {
        valueMotion.set(nextVal);
        onChange?.(nextVal);
      }
    },
    [
      thumbWidthRest,
      min,
      max,
      step,
      trackTravel,
      minX,
      thumbX,
      seekThumb,
      valueMotion,
      onChange,
    ],
  );

  useEffect(() => {
    const curVal =
      controlledValue !== undefined ? controlledValue : valueMotion.get();
    const ratio = Math.max(0, Math.min(1, (curVal - min) / (max - min)));
    thumbX.set(minX + ratio * trackTravel);
  }, [size, minX, trackTravel, min, max, controlledValue, thumbX, valueMotion]);

  useEffect(() => {
    if (!isDraggingRef.current && controlledValue !== undefined) {
      valueMotion.set(controlledValue);
      const ratio = Math.max(
        0,
        Math.min(1, (controlledValue - min) / (max - min)),
      );
      seekThumb(minX + ratio * trackTravel);
    }
  }, [controlledValue, min, max, minX, trackTravel, seekThumb, valueMotion]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    trackBoundsRef.current = { left: rect.left, width: rect.width };

    isDraggingRef.current = true;
    pointerDown.set(1);

    e.currentTarget.setPointerCapture(e.pointerId);
    updatePositionFromClientX(e.clientX, e.target !== thumbRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || disabled) return;
    updatePositionFromClientX(e.clientX, false);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    pointerDown.set(0);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    let nextVal = valueMotion.get();
    const jump = step || 1;

    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      nextVal = Math.min(max, nextVal + jump);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      nextVal = Math.max(min, nextVal - jump);
    } else if (e.key === "PageUp") {
      e.preventDefault();
      nextVal = Math.min(max, nextVal + jump * 10);
    } else if (e.key === "PageDown") {
      e.preventDefault();
      nextVal = Math.max(min, nextVal - jump * 10);
    } else if (e.key === "Home") {
      e.preventDefault();
      nextVal = min;
    } else if (e.key === "End") {
      e.preventDefault();
      nextVal = max;
    } else {
      return;
    }

    valueMotion.set(nextVal);
    onChange?.(nextVal);
    const ratio = (nextVal - min) / (max - min);
    seekThumb(minX + ratio * trackTravel);
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
        "relative flex items-center justify-center select-none py-6",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    >
      <motion.div
        ref={containerRef}
        tabIndex={0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={ariaValue}
        aria-label={label}
        aria-disabled={disabled || undefined}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-full touch-none select-none cursor-pointer"
        style={{
          position: "relative",
          width: sliderWidth,
          height: thumbHeight,
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: "inline-block",
            width: sliderWidth,
            height: sliderHeight,
            left: 0,
            top: (thumbHeight - sliderHeight) / 2,
            backgroundColor: "#89898F66",
            borderRadius: sliderHeight / 2,
            position: "absolute",
          }}
        >
          <div className="w-full h-full overflow-hidden rounded-full">
            <motion.div
              style={{
                top: 0,
                left: 0,
                height: sliderHeight,
                width: useTransform(
                  thumbX,
                  (x) =>
                    `${Math.max(
                      0,
                      Math.min(sliderWidth, x + thumbWidth / 2),
                    )}px`,
                ),
                borderRadius: sliderHeight / 2,
                backgroundColor: currentTheme.fill,
                boxShadow: `0 0 16px ${currentTheme.glow}`,
              }}
            />
          </div>
        </div>

        {material === "liquid" && (
          <Filter
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
          ref={thumbRef}
          className="absolute pointer-events-none"
          style={{
            height: thumbHeight,
            width: thumbWidth,
            top: 0,
            x: thumbX,
            borderRadius: thumbRadius,
            backdropFilter: backdropStyle,
            WebkitBackdropFilter: backdropStyle,
            scale: scaleSpring,
            willChange: "transform",
            backgroundColor: useTransform(
              backgroundOpacity,
              (op) => `rgba(255, 255, 255, ${op})`,
            ),
            boxShadow:
              "0 4px 18px rgba(0, 0, 0, 0.22), inset 0 1px 1.5px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(0, 0, 0, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.35)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-40"
            style={{
              borderRadius: `${thumbRadius}px ${thumbRadius}px 0 0`,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.05) 100%)",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Slider = MacSlider;
