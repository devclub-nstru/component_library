"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Dither } from "@/registry/ui/dither";

export interface AiOrbProps {
  className?: string;
  color?: string;
  colorNum?: number;
  dither?: boolean;
  interactive?: boolean;
  pixelSize?: number;
  showText?: boolean;
  size?: number;
  speed?: number;
  text?: string;
  variant?:
    | "chromatic"
    | "neon"
    | "cyberpunk"
    | "emerald"
    | "amber"
    | "monochrome";
}

const VERTEX_SHADER = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = (position + 1.0) * 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_color;
uniform vec3 u_bg_color;
uniform float u_pixel_size;
uniform float u_color_num;
uniform float u_speed;
uniform float u_dither_active;

const float bayerMatrix8x8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 4; i++) {
    v += a * abs(cnoise(p));
    p = rot * p * 2.0 + vec2(100.0);
    a *= 0.5;
  }
  return v;
}

vec3 dither(vec2 coord, vec3 color) {
  if (u_dither_active < 0.5) return color;
  vec2 scaledCoord = floor(coord / u_pixel_size);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));
  int index = y * 8 + x;
  float threshold = 0.0;
  for (int i = 0; i < 64; i++) {
    if (i == index) {
      threshold = bayerMatrix8x8[i] - 0.25;
      break;
    }
  }
  float stepVal = 1.0 / max(1.0, u_color_num - 1.0);
  color += threshold * stepVal;
  float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
  float bias = mix(0.15, 0.0, smoothstep(0.4, 0.8, luminance));
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (u_color_num - 1.0) + 0.5) / (u_color_num - 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 centered = uv - 0.5;
  centered.x *= u_resolution.x / u_resolution.y;

  float len = length(centered);
  if (len > 0.5) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float t = u_time * u_speed;
  vec2 p = centered * 3.4;

  vec2 m = (u_mouse / u_resolution - 0.5) * vec2(1.0, -1.0);
  m.x *= u_resolution.x / u_resolution.y;
  float mDist = length(centered - m);
  float mEffect = 1.0 - smoothstep(0.0, 0.45, mDist);

  float n1 = fbm(p + vec2(t * 0.35, -t * 0.25));
  float n2 = fbm(p - vec2(t * 0.15, t * 0.2) + n1);
  float n = n2 - mEffect * 0.35;

  float sphericalVignette = smoothstep(0.5, 0.2, len);
  vec3 col = mix(u_bg_color, u_color, clamp(n, 0.0, 1.0));
  col = mix(col, vec3(1.0), pow(clamp(n * 1.25, 0.0, 1.0), 3.0) * 0.65);

  col = dither(gl_FragCoord.xy, col);
  float alpha = sphericalVignette * 0.92;

  gl_FragColor = vec4(col, alpha);
}
`;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const intVal = parseInt(clean, 16);
  if (isNaN(intVal)) return [0.68, 0.37, 1.0];
  const r = ((intVal >> 16) & 255) / 255;
  const g = ((intVal >> 8) & 255) / 255;
  const b = (intVal & 255) / 255;
  return [r, g, b];
}

const VARIANT_PRESETS: Record<
  NonNullable<AiOrbProps["variant"]>,
  { primary: string; secondary: string; shadowA: string; shadowB: string }
> = {
  chromatic: {
    primary: "#ad5fff",
    secondary: "#471eec",
    shadowA: "#ad5fff",
    shadowB: "#471eec",
  },
  neon: {
    primary: "#3B82F6",
    secondary: "#10B981",
    shadowA: "#3B82F6",
    shadowB: "#10B981",
  },
  cyberpunk: {
    primary: "#F43F5E",
    secondary: "#06B6D4",
    shadowA: "#F43F5E",
    shadowB: "#06B6D4",
  },
  emerald: {
    primary: "#10B981",
    secondary: "#047857",
    shadowA: "#34D399",
    shadowB: "#064E3B",
  },
  amber: {
    primary: "#F59E0B",
    secondary: "#B45309",
    shadowA: "#FBBF24",
    shadowB: "#78350F",
  },
  monochrome: {
    primary: "#FFFFFF",
    secondary: "#52525B",
    shadowA: "#E4E4E7",
    shadowB: "#27272A",
  },
};

export function AiOrb({
  className,
  color,
  colorNum = 5,
  dither = true,
  interactive = true,
  pixelSize = 2,
  showText = true,
  size = 190,
  speed = 0.8,
  text = "Generating",
  variant = "chromatic",
}: AiOrbProps) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });

  const preset = VARIANT_PRESETS[variant] ?? VARIANT_PRESETS.chromatic;
  const primaryColor = color ?? preset.primary;
  const secondaryColor = preset.secondary;

  const rgbPrimary = useMemo(() => hexToRgb(primaryColor), [primaryColor]);
  const rgbSecondary = useMemo(
    () => hexToRgb(secondaryColor),
    [secondaryColor],
  );

  const letters = useMemo(() => text.split(""), [text]);
  const reduceMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    const canvas = document.createElement("canvas");
    canvas.className = "relative block h-full w-full";
    host.appendChild(canvas);

    let gl: WebGLRenderingContext | null = null;
    const releaseCanvas = () => {
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        preserveDrawingBuffer: false,
      });
    } catch {
      return releaseCanvas;
    }

    if (!gl) {
      return releaseCanvas;
    }

    const compileShader = (type: number, src: string) => {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    if (!vs || !fs) {
      return releaseCanvas;
    }

    const program = gl.createProgram();
    if (!program) return releaseCanvas;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return releaseCanvas;
    }

    gl.useProgram(program);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uColor = gl.getUniformLocation(program, "u_color");
    const uBgColor = gl.getUniformLocation(program, "u_bg_color");
    const uPixelSize = gl.getUniformLocation(program, "u_pixel_size");
    const uColorNum = gl.getUniformLocation(program, "u_color_num");
    const uSpeed = gl.getUniformLocation(program, "u_speed");
    const uDitherActive = gl.getUniformLocation(program, "u_dither_active");

    let animationFrameId = 0;
    const startTime = performance.now();

    const render = () => {
      if (!gl || !canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = Math.floor(canvas.clientWidth * dpr);
      const displayHeight = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const elapsed = (performance.now() - startTime) * 0.001;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mousePos.current.x * dpr, mousePos.current.y * dpr);
      gl.uniform3f(uColor, rgbPrimary[0], rgbPrimary[1], rgbPrimary[2]);
      gl.uniform3f(uBgColor, rgbSecondary[0], rgbSecondary[1], rgbSecondary[2]);
      gl.uniform1f(uPixelSize, pixelSize);
      gl.uniform1f(uColorNum, colorNum);
      gl.uniform1f(uSpeed, speed);
      gl.uniform1f(uDitherActive, dither ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!reduceMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    const resizeObserver = reduceMotion ? new ResizeObserver(render) : null;
    resizeObserver?.observe(host);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver?.disconnect();
      if (gl) {
        gl.deleteBuffer(quadBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
      releaseCanvas();
    };
  }, [
    colorNum,
    dither,
    pixelSize,
    reduceMotion,
    rgbPrimary,
    rgbSecondary,
    speed,
  ]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerLeave = () => {
    mousePos.current = { x: -1000, y: -1000 };
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      data-slot="ai-orb"
      className={cn(
        "relative flex items-center justify-center rounded-full select-none cursor-pointer overflow-visible transition-transform duration-300 hover:scale-[1.03]",
        className,
      )}
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className="absolute inset-[-15%] rounded-full blur-2xl opacity-40 pointer-events-none transition-colors duration-500 will-change-transform"
        style={{
          background: `radial-gradient(circle, ${primaryColor} 0%, ${secondaryColor} 60%, transparent 75%)`,
        }}
      />

      <div className="absolute inset-0 rounded-full overflow-hidden z-0">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${primaryColor} 0%, ${secondaryColor} 55%, #050508 100%)`,
          }}
        />
        <div ref={canvasHostRef} className="relative h-full w-full" />
      </div>

      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none z-10"
        animate={{ rotate: reduceMotion ? 0 : 360 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { repeat: Infinity, duration: 3.5 / speed, ease: "linear" }
        }
        style={{
          boxShadow: `
            0 10px 22px 0 rgba(255, 255, 255, 0.85) inset,
            0 24px 34px 0 ${primaryColor} inset,
            0 64px 64px 0 ${secondaryColor} inset,
            0 0 20px 2px ${primaryColor}66
          `,
        }}
      />

      <motion.div
        className="absolute inset-0.75 rounded-full pointer-events-none z-10 border border-white/20"
        animate={{ rotate: reduceMotion ? 0 : -360 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { repeat: Infinity, duration: 7 / speed, ease: "linear" }
        }
        style={{
          boxShadow: `
            0 -8px 18px 0 rgba(255, 255, 255, 0.4) inset,
            0 -16px 28px 0 ${secondaryColor} inset
          `,
        }}
      />

      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-15 mix-blend-screen opacity-55">
        <Dither
          color1={primaryColor}
          color2={secondaryColor}
          color3="#000000"
          grainAmount={0.16}
          grainScale={2.0}
          grainAnimated={true}
          warpStrength={1.2}
          timeSpeed={speed * 0.25}
          zoom={1.1}
        />
      </div>

      <div className="absolute inset-0 rounded-full pointer-events-none z-20 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.35)_0%,transparent_50%)]" />

      {showText && (
        <div className="relative z-30 flex items-center justify-center gap-0.5 px-3 pointer-events-none select-none">
          {letters.map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              initial={{ opacity: 0.35, y: 0, scale: 1 }}
              animate={
                reduceMotion
                  ? { opacity: 0.85, scale: 1, y: 0 }
                  : {
                      opacity: [0.35, 1, 0.65, 0.35],
                      scale: [1, 1.18, 1, 1],
                      y: [0, -2.5, 0, 0],
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 2.2 / speed,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.1,
                    }
              }
              className="inline-block font-sans font-light tracking-wide text-white text-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
            >
              {char}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}

export default AiOrb;
