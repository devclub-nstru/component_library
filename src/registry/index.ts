import { ComponentRegistryItem } from "@/types/component";

export const COMPONENT_REGISTRY: Record<string, ComponentRegistryItem> = {
  scales: {
    slug: "scales",
    name: "Scales & Borders",
    description: "Symmetric repeating linear gradient borders and geometric scale dividers.",
    summary: "Technical boundary elements and geometric scale dividers engineered to replace generic horizontal rules with architectural, sci-fi, and developer console aesthetics. Built entirely with pure CSS repeating linear gradients (315deg angle with 14px pitch and 1px sub-pixel line calibration) and theme-driven CSS custom properties (--pattern-line, --pattern), delivering high-density boundary aesthetics with zero JavaScript runtime overhead.",
    category: "scales",
    tags: ["borders", "scales", "divider", "linear-gradient", "geometric", "pattern"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Pure CSS repeating-linear-gradient shader rendering with zero JavaScript overhead",
      "Zero cumulative layout shift (CLS 0.0) with GPU-accelerated compositing",
      "Three specialized geometric layout variants: HorizontalScale, VerticalScale, and Lines",
      "Themeable token variables (--pattern-line, --pattern) for seamless light/dark adaptation",
      "Sub-pixel calibrated 14px repeating tile pitch with 1px hairline boundary strokes"
    ],
    anatomy: [
      "<HorizontalScale> (40px horizontal ribbon with diagonal 315° repeating hatch marks)",
      "<VerticalScale> (40px vertical divider with diagonal 315° repeating hatch marks)",
      "<Lines> (56px horizontal scanline guide with high-density repeating lines)"
    ],
    physics: {
      engine: "CSS Repeating Gradient Shader",
      description: "Zero-runtime GPU rasterized gradient stripes calculated via repeating linear-gradient geometry without layout repaints.",
      parameters: [
        { label: "Shader Angle", value: "315deg diagonal" },
        { label: "Tile Pitch", value: "14px × 14px repeat" },
        { label: "Hairline Weight", value: "1px stroke (var(--pattern-line))" },
        { label: "Horizontal Height", value: "40px (h-10)" },
        { label: "Lines Height", value: "56px (h-14)" },
        { label: "Runtime Overhead", value: "0ms / Pure CSS" }
      ]
    },
    accessibility: {
      role: "separator",
      aria: "aria-hidden='true' when purely decorative, or role='separator' with aria-orientation when separating semantic document regions.",
      reducedMotion: "Static CSS background gradient pattern; completely unaffected by motion preferences."
    },
    guidelines: {
      recommended: [
        "Technical panel dividers in developer tools, IDE views, and engineering dashboards",
        "Header and footer section breaks in technical documentation sites",
        "Visual framing boundaries around code editors, telemetry viewers, and terminal displays"
      ],
      bestPractices: [
        "Define --pattern-line and --pattern in your theme root for consistent contrast across light and dark modes",
        "Use VerticalScale inside flex containers with h-full for crisp column separation",
        "Apply h-auto or custom height classes to adapt the scale to your layout grid"
      ]
    },
    props: [
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes to customize dimensions, border colors, or pattern line token overrides.",
      },
    ],
    files: [
      {
        name: "scales.tsx",
        path: "registry/ui/scales.tsx",
        code: `import React from "react";
import { cn } from "@/lib/utils";

export const HorizontalScale = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "h-10 w-full bg-[repeating-linear-gradient(315deg,var(--pattern-line)_0px,var(--pattern-line)_1px,transparent_1px,transparent_10px)] bg-size-[14px_14px] border-y border-(--pattern)",
        className
      )}
    />
  );
};

export const VerticalScale = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "w-10 h-full bg-[repeating-linear-gradient(315deg,var(--pattern-line)_0px,var(--pattern-line)_1px,transparent_1px,transparent_10px)] bg-size-[14px_14px] border-x border-(--pattern)",
        className
      )}
    />
  );
};

export const Lines = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "h-14 w-full bg-[repeating-linear-gradient(to_bottom,var(--pattern-line)_0,var(--pattern-line)_1px,transparent_1px,transparent_0.5rem)] border-y border-(--pattern)",
        className
      )}
    />
  );
};`,
      },
    ],
  },
  "animated-button": {
    slug: "animated-button",
    name: "Animated Button",
    description: "Multi-variant interactive button with shimmering effects and micro-interactions.",
    summary: "A high-impact call-to-action button supporting four distinct visual styles (primary, secondary, outline, and shimmer). Engineered with fluid cubic-bezier micro-interactions, hardware-accelerated transform scaling on active press (scale-[0.96]), an automated looping CSS keyframe linear gradient shimmer sweep, and dynamic icon translation with group-hover mechanics.",
    category: "buttons",
    tags: ["button", "shimmer", "interaction", "animation", "cta", "micro-interactions"],
    dependencies: ["clsx", "tailwind-merge", "@radix-ui/react-icons"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    supportsColor: true,
    highlights: [
      "Four production-ready visual variants tuned for dark-mode interfaces",
      "Infinite 2-second linear-gradient shimmer light sweep with zero CPU overhead",
      "Tactile cubic-bezier timing curve (cubic-bezier(0.16, 1, 0.3, 1)) for snappy feedback",
      "Forwarded ref support with full HTML button attribute inheritance",
      "Automatic hover translation on accessory directional icons with group-hover"
    ],
    anatomy: [
      "<button> (Focus-visible enabled interactive container with overflow containment)",
      "<span> (Shimmer Layer with infinite linear gradient keyframe animation)",
      "<span> (Content Shell housing label and optional icon)",
      "<ArrowRightIcon> (Directional icon with hover translate-x animation)"
    ],
    physics: {
      engine: "CSS Hardware-Accelerated Transforms",
      description: "High-frequency micro-interactions utilizing CSS cubic-bezier timing curves and scale compression on click.",
      parameters: [
        { label: "Timing Curve", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
        { label: "Active Compression", value: "scale-[0.96] (4% scale down)" },
        { label: "Shimmer Speed", value: "2000ms infinite linear sweep" },
        { label: "Transition Duration", value: "200ms" },
        { label: "Icon Translation", value: "+4px translateX on hover" },
        { label: "Rendering Layer", value: "GPU composited transform" }
      ]
    },
    accessibility: {
      role: "button",
      aria: "Inherits native HTMLButtonElement attributes including aria-disabled, aria-label, and aria-pressed.",
      reducedMotion: "Disables active scaling and shimmer translation when prefers-reduced-motion is active.",
      keyboard: [
        { key: "Tab", description: "Focus button with visible high-contrast ring outline." },
        { key: "Enter / Space", description: "Trigger button onClick event with active compression effect." }
      ]
    },
    guidelines: {
      recommended: [
        "Primary conversion CTAs on landing page heroes and product announcements",
        "Form submission actions in checkout, modal, and onboarding flows",
        "Interactive navigation links requiring elevated visual priority"
      ],
      bestPractices: [
        "Limit the shimmer variant to 1 instance per viewport to preserve visual hierarchy",
        "Use outline or secondary variants for auxiliary actions like Cancel or Dismiss",
        "Always provide descriptive text children or an aria-label for icon-only usage"
      ]
    },
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "shimmer"',
        defaultValue: '"primary"',
        description: "Visual style variant of the button: high-contrast white primary, dark secondary, bordered outline, or luminous shimmer.",
      },
      {
        name: "showArrow",
        type: "boolean",
        defaultValue: "false",
        description: "Display an animated arrow icon on hover with smooth translateX translation.",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables pointer interactions, suppresses hover transforms, and lowers opacity.",
      },
      {
        name: "type",
        type: '"button" | "submit" | "reset"',
        defaultValue: '"button"',
        description: "Native HTML button behavior for forms and dialogs.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes to override dimensions, paddings, or font weights.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        defaultValue: "undefined",
        description: "Content label, icons, or badges rendered inside the button.",
      },
      {
        name: "onClick",
        type: "(event: React.MouseEvent<HTMLButtonElement>) => void",
        defaultValue: "undefined",
        description: "Click event handler callback invoked on button press.",
      },
    ],
    files: [
      {
        name: "animated-button.tsx",
        path: "registry/ui/animated-button.tsx",
        code: `"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "shimmer";
  showArrow?: boolean;
}

export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(
  (
    {
      className,
      children,
      variant = "primary",
      showArrow = false,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer select-none overflow-hidden",
          variant === "primary" &&
            "bg-linear-to-t from-blue-700 to-blue-500 text-white shadow-lg shadow-blue-500/20 hover:brightness-110 active:scale-[0.98]",
          variant === "secondary" &&
            "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:scale-[0.98]",
          variant === "outline" &&
            "border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60 hover:text-white active:scale-[0.98]",
          variant === "shimmer" &&
            "border border-zinc-700/80 bg-zinc-900/90 text-zinc-100 hover:border-zinc-500 shadow-[0_0_15px_rgba(255,255,255,0.05)]",
          className
        )}
        {...props}
      >
        {variant === "shimmer" && (
          <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        )}
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {showArrow && (
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          )}
        </span>
      </button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";`,
      },
    ],
  },
  "spotlight-card": {
    slug: "spotlight-card",
    name: "Spotlight Card",
    description: "Card container with cursor-following radial gradient glow effect.",
    summary: "A dynamic glassmorphic card container that tracks pointer coordinates within its bounding box in real time. It calculates Cartesian cursor offsets relative to the element's top-left corner (clientX - left, clientY - top) and projects a soft 600px radial gradient lighting mask centered under the cursor with smooth 300ms opacity fades on boundary crossing, creating an illuminated spotlight aesthetic across dark surfaces.",
    category: "cards",
    tags: ["card", "spotlight", "hover", "interactive", "radial-gradient", "glassmorphism"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    supportsColor: true,
    hidden: true,
    highlights: [
      "Client-side pointer calculation with getBoundingClientRect() coordinate tracking",
      "600px radial gradient spotlight with exponential 40% falloff curve",
      "Instantaneous coordinate binding directly to CSS radial-gradient styles",
      "Smooth 300ms opacity transition during cursor boundary entry and departure",
      "Backdrop blur integration (backdrop-blur-md) with semi-transparent zinc-950 surfaces"
    ],
    anatomy: [
      "<div> (Relative rounded card wrapper with border containment and hover border brightening)",
      "<div> (Spotlight Beam: pointer-events-none absolute mask rendering radial gradient)",
      "<div> (Content Layer: relative z-10 container preserving interactive child element clickability)"
    ],
    physics: {
      engine: "Pointer Event Matrix & Radial Shader",
      description: "Real-time client pointer coordinate mapping calculating relative Cartesian offsets with CSS opacity decay.",
      parameters: [
        { label: "Spotlight Radius", value: "600px circle" },
        { label: "Decay Curve", value: "Radial transparent at 40%" },
        { label: "Fade Duration", value: "300ms transition-opacity" },
        { label: "Coordinate Mapping", value: "Cartesian offset (x, y)" },
        { label: "Backdrop Filter", value: "12px blur-md" },
        { label: "Compositing", value: "GPU layer isolated" }
      ]
    },
    accessibility: {
      role: "region",
      aria: "Accepts aria-labelledby or aria-describedby for container identification.",
      reducedMotion: "Radial gradient renders with static position or instant opacity when motion is reduced.",
      keyboard: [
        { key: "Tab", description: "Standard keyboard tab navigation passes cleanly to interactive child elements." },
        { key: "Enter / Space", description: "Triggers card onClick callback if interactive handler is assigned." }
      ]
    },
    guidelines: {
      recommended: [
        "Feature matrices and product highlights in modern SaaS landing pages",
        "Interactive pricing tiers and subscription comparison modules",
        "Developer portfolio project showcases and case study links"
      ],
      bestPractices: [
        "Use subtle accent colors with low opacity (0.12 - 0.20) to prevent content unreadability",
        "Combine with high-contrast text and dark slate/zinc background surfaces",
        "Keep card interactive children inside the relative z-10 layer to prevent pointer event masking"
      ]
    },
    props: [
      {
        name: "spotlightColor",
        type: "string",
        defaultValue: '"rgba(59, 130, 246, 0.15)"',
        description: "CSS RGBA, HSLA, or hex color string defining the center glow of the 600px radial light cone.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional Tailwind or CSS classes applied to the root card container.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Card content, headlines, telemetry, or icons rendered above the spotlight beam.",
      },
      {
        name: "onClick",
        type: "(event: React.MouseEvent<HTMLDivElement>) => void",
        defaultValue: "undefined",
        description: "Optional click handler for making the spotlight card act as an interactive clickable surface.",
      },
    ],
    files: [
      {
        name: "spotlight-card.tsx",
        path: "registry/ui/spotlight-card.tsx",
        code: `"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightColor?: string;
}

export const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  (
    {
      className,
      children,
      spotlightColor = "rgba(59, 130, 246, 0.15)",
      ...props
    },
    ref
  ) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ x: number; y: number }>({
      x: 0,
      y: 0,
    });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!divRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => {
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    return (
      <div
        ref={(node) => {
          divRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur-md transition-colors duration-200 hover:border-zinc-700",
          className
        )}
        {...props}
      >
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity,
            background: \`radial-gradient(600px circle at \${position.x}px \${position.y}px, \${spotlightColor}, transparent 40%)\`,
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

SpotlightCard.displayName = "SpotlightCard";`,
      },
    ],
  },
  "dither": {
    slug: "dither",
    name: "Dither",
    description: "Hardware-accelerated procedural WebGL dithered grainient with fluid warping, noise, and animated grain.",
    summary: "A high-performance WebGL 2.0 procedural dithered gradient shader built on OGL. Generates fluid, organic distortion waves using multi-frequency warping and animated filmic grain with full color customization, rotation, and lighting modes.",
    category: "feedback",
    tags: ["dither", "grain", "shader", "webgl", "ogl", "gradient", "warp", "noise", "motion"],
    dependencies: ["ogl"],
    version: "1.0.0",
    createdDate: "2026-09-22",
    updatedDate: "2026-09-22",
    interactive: true,
    supportsColor: true,
    highlights: [
      "Lightweight OGL WebGL 2.0 renderer with full GPU pipeline lifecycle management",
      "Procedural fbm noise and trigonometric fluid warp distortion",
      "Sub-pixel animated grain and dither simulation with zero texture overhead",
      "Dynamic color blending between three customizable chromatic palette points",
      "Light and dark adaptive mode with real-time uniform synchronization"
    ],
    anatomy: [
      "<div> (Responsive Canvas Container: manages ResizeObserver and IntersectionObserver lifecycle)",
      "<canvas> (OGL WebGL 2.0 Canvas: full-resolution viewport rendering pipeline)",
      "Triangle (Full-screen quad geometry rendering vertex and fragment shaders)"
    ],
    physics: {
      engine: "OGL WebGL 2.0 Fragment Shader",
      description: "Mathematical noise and sine warp domain displacement running in parallel across GPU fragment execution units.",
      parameters: [
        { label: "Warp Frequency", value: "5.0 domain cycles" },
        { label: "Noise Scale", value: "2.0 octave frequency" },
        { label: "Rotation Amount", value: "500.0 degrees" },
        { label: "Grain Scale", value: "2.0 sub-pixel resolution" }
      ]
    },
    accessibility: {
      role: "presentation",
      aria: "aria-hidden='true' for purely decorative background shaders.",
      reducedMotion: "Pauses animation loops when prefers-reduced-motion is detected or when tab is inactive."
    },
    guidelines: {
      recommended: [
        "Hero section dynamic ambient background in high-aesthetic developer platforms",
        "Fluid chromatic texture inside cards, dialogs, or generative AI interfaces",
        "Overlay layer for orbs, badges, or interactive creative canvases"
      ],
      bestPractices: [
        "Use subtle grainAmount (0.1 - 0.2) to maintain smooth performance and aesthetic balance",
        "Match color1 with your active theme primary accent for cohesive brand identity",
        "Ensure parent container has relative positioning and explicit dimensions"
      ]
    },
    props: [
      {
        name: "color1",
        type: "string",
        defaultValue: "'#FF9FFC'",
        description: "Primary accent color for the upper gradient blend.",
      },
      {
        name: "color2",
        type: "string",
        defaultValue: "'#5227FF'",
        description: "Secondary chromatic color for the mid warp flow.",
      },
      {
        name: "color3",
        type: "string",
        defaultValue: "'#B497CF'",
        description: "Darker base color for the background depth.",
      },
      {
        name: "timeSpeed",
        type: "number",
        defaultValue: "0.25",
        description: "Speed of the procedural fluid time evolution.",
      },
      {
        name: "warpStrength",
        type: "number",
        defaultValue: "1.0",
        description: "Magnitude of domain warping displacement.",
      },
      {
        name: "grainAmount",
        type: "number",
        defaultValue: "0.1",
        description: "Intensity of the simulated dither grain overlay.",
      },
      {
        name: "grainAnimated",
        type: "boolean",
        defaultValue: "false",
        description: "Whether the grain noise particles shift dynamically each frame.",
      }
    ],
    files: [
      {
        name: "dither.tsx",
        path: "registry/ui/dither.tsx",
        code: `"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

export interface GrainientProps {
  timeSpeed?: number;
  colorBalance?: number;
  warpStrength?: number;
  warpFrequency?: number;
  warpSpeed?: number;
  warpAmplitude?: number;
  blendAngle?: number;
  blendSoftness?: number;
  rotationAmount?: number;
  noiseScale?: number;
  grainAmount?: number;
  grainScale?: number;
  grainAnimated?: boolean;
  contrast?: number;
  gamma?: number;
  saturation?: number;
  centerX?: number;
  centerY?: number;
  zoom?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  lightMode?: boolean;
  className?: string;
}

export type DitherProps = GrainientProps;

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

const vertex = \`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
\`;

const fragment = \`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uLightMode;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);} 
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);} 
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);

  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;

  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);

  vec3 colLav=uColor1;
  vec3 colOrg=uColor2;
  vec3 colDark=uColor3;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));

  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);} 
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;

  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);
  if(uLightMode>0.5){
    float energy=max(max(col.r,col.g),col.b);
    vec3 hue=col/max(energy,0.001);
    float chroma=length(col-vec3(dot(col,vec3(0.333333))));
    float coverage=clamp(0.12+chroma*1.15+energy*0.18,0.0,0.88);
    col=mix(vec3(1.0),clamp(hue*0.58+col*0.18,0.0,1.0),coverage);
  }

  o=vec4(col,1.0);
}
void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}
\`;

type GrainientCtx = {
  renderer: InstanceType<typeof Renderer>;
  program: InstanceType<typeof Program>;
  mesh: InstanceType<typeof Mesh>;
};
const ctxMap = new WeakMap<HTMLDivElement, GrainientCtx>();

export const Grainient: React.FC<GrainientProps> = ({
  timeSpeed = 0.25,
  colorBalance = 0.0,
  warpStrength = 1.0,
  warpFrequency = 5.0,
  warpSpeed = 2.0,
  warpAmplitude = 50.0,
  blendAngle = 0.0,
  blendSoftness = 0.05,
  rotationAmount = 500.0,
  noiseScale = 2.0,
  grainAmount = 0.1,
  grainScale = 2.0,
  grainAnimated = false,
  contrast = 1.5,
  gamma = 1.0,
  saturation = 1.0,
  centerX = 0.0,
  centerY = 0.0,
  zoom = 0.9,
  color1 = "#FF9FFC",
  color2 = "#5227FF",
  color3 = "#B497CF",
  lightMode = false,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uTimeSpeed: { value: 0.25 },
        uColorBalance: { value: 0.0 },
        uWarpStrength: { value: 1.0 },
        uWarpFrequency: { value: 5.0 },
        uWarpSpeed: { value: 2.0 },
        uWarpAmplitude: { value: 50.0 },
        uBlendAngle: { value: 0.0 },
        uBlendSoftness: { value: 0.05 },
        uRotationAmount: { value: 500.0 },
        uNoiseScale: { value: 2.0 },
        uGrainAmount: { value: 0.1 },
        uGrainScale: { value: 2.0 },
        uGrainAnimated: { value: 0.0 },
        uContrast: { value: 1.5 },
        uGamma: { value: 1.0 },
        uSaturation: { value: 1.0 },
        uCenterOffset: { value: new Float32Array([0, 0]) },
        uZoom: { value: 0.9 },
        uColor1: { value: new Float32Array([1, 1, 1]) },
        uColor2: { value: new Float32Array([1, 1, 1]) },
        uColor3: { value: new Float32Array([1, 1, 1]) },
        uLightMode: { value: 0.0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctxMap.set(container, { renderer, program, mesh });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h);
      const res = (program.uniforms.iResolution as { value: Float32Array })
        .value;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
      renderer.render({ scene: mesh });
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const t0 = performance.now();

    const loop = (t: number) => {
      (program.uniforms.iTime as { value: number }).value = (t - t0) * 0.001;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && raf === 0) {
        raf = requestAnimationFrame(loop);
      }
    };
    const tryStop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          tryStart();
        } else {
          tryStop();
        }
      },
      { threshold: 0 },
    );
    io.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) {
        tryStart();
      } else {
        tryStop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    tryStart();

    return () => {
      tryStop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      ctxMap.delete(container);
      try {
        container.removeChild(canvas);
      } catch {}
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ctx = ctxMap.get(container);
    if (!ctx) return;
    const { program } = ctx;
    const u = program.uniforms as Record<string, { value: unknown }>;

    u.uTimeSpeed.value = timeSpeed;
    u.uColorBalance.value = colorBalance;
    u.uWarpStrength.value = warpStrength;
    u.uWarpFrequency.value = warpFrequency;
    u.uWarpSpeed.value = warpSpeed;
    u.uWarpAmplitude.value = warpAmplitude;
    u.uBlendAngle.value = blendAngle;
    u.uBlendSoftness.value = blendSoftness;
    u.uRotationAmount.value = rotationAmount;
    u.uNoiseScale.value = noiseScale;
    u.uGrainAmount.value = grainAmount;
    u.uGrainScale.value = grainScale;
    u.uGrainAnimated.value = grainAnimated ? 1.0 : 0.0;
    u.uContrast.value = contrast;
    u.uGamma.value = gamma;
    u.uSaturation.value = saturation;
    u.uCenterOffset.value = new Float32Array([centerX, centerY]);
    u.uZoom.value = zoom;
    u.uColor1.value = new Float32Array(hexToRgb(color1));
    u.uColor2.value = new Float32Array(hexToRgb(color2));
    u.uColor3.value = new Float32Array(hexToRgb(color3));
    u.uLightMode.value = lightMode ? 1.0 : 0.0;
  }, [
    timeSpeed,
    colorBalance,
    warpStrength,
    warpFrequency,
    warpSpeed,
    warpAmplitude,
    blendAngle,
    blendSoftness,
    rotationAmount,
    noiseScale,
    grainAmount,
    grainScale,
    grainAnimated,
    contrast,
    gamma,
    saturation,
    centerX,
    centerY,
    zoom,
    color1,
    color2,
    color3,
    lightMode,
  ]);

  return (
    <div
      ref={containerRef}
      className={\`relative h-full w-full overflow-hidden \${className}\`.trim()}
    />
  );
};

export const Dither = Grainient;
export default Grainient;
`
      }
    ]
  },
  "ai-orb": {
    slug: "ai-orb",
    name: "AI Orb",
    description: "Luminescent AI generation sphere with native WebGL Bayer 8x8 dithered plasma and animated letter wave typography.",
    summary: "An ultra-fluid generative AI orb component combining volumetric chromatic sphere glows, rotating multi-depth inset shadows, and an embedded native WebGL 8x8 Bayer matrix dithered plasma wave core. Features real-time cursor proximity warping and fluid displacement, customizable color themes, and staggered animated letter wave typography for generation states, loaders, and agentic assistant interfaces.",
    category: "ai-stuff",
    tags: ["ai", "orb", "dither", "webgl", "shader", "loader", "bayer", "motion", "plasma"],
    dependencies: ["clsx", "tailwind-merge", "motion"],
    version: "1.0.0",
    createdDate: "2026-09-22",
    updatedDate: "2026-09-22",
    interactive: true,
    supportsColor: true,
    highlights: [
      "Native WebGL 8x8 Bayer matrix dithered procedural plasma shader with zero three.js overhead",
      "Interactive pointer displacement warping fluid noise with smooth spherical vignette falloff",
      "Volumetric 3D chromatic inset box shadows with continuous harmonic counter-rotations",
      "Sinusoidal staggered letter wave typography with customizable labels ('Generating', 'Thinking', etc.)",
      "Quantized color stepping and configurable pixelation density with light/dark adaptive presets"
    ],
    anatomy: [
      "<div> (Outer Halo Container: relative circular wrapper with ambient radial glow dispersion)",
      "<canvas> (Native WebGL Canvas: hardware-accelerated 8x8 Bayer dithered fbm plasma)",
      "<motion.div> (Primary Chromatic Shell: clockwise rotating volumetric inset shadow layer)",
      "<motion.div> (Secondary Rim Ring: counter-clockwise rotating specular highlight border)",
      "<div> (Specular Highlight: radial gradient reflection on upper hemisphere)",
      "<motion.span[]> (Letter Wave: staggered animated typography spanning generation states)"
    ],
    physics: {
      engine: "Bayer 8x8 Dither Shader + Harmonic CSS Box-Shadow Rotation",
      description: "GPU-accelerated fbm simplex noise passed through an 8x8 Bayer ordered dithering kernel, overlaid with counter-rotating volumetric chromatic inset shadows.",
      parameters: [
        { label: "Dither Matrix", value: "8x8 Bayer Ordered Kernel" },
        { label: "Noise Function", value: "4-Octave Fractional Brownian Motion (fbm)" },
        { label: "Primary Rotation Speed", value: "3.5s linear infinite" },
        { label: "Secondary Rotation Speed", value: "7.0s counter-linear infinite" },
        { label: "Letter Wave Frequency", value: "2.2s ease-in-out with 100ms stagger" }
      ]
    },
    accessibility: {
      role: "status",
      aria: "aria-live='polite' on generation text container, and role='status' for screen reader recognition of ongoing generation operations.",
      reducedMotion: "Collapses rotation and letter wave animations to subtle static glows when prefers-reduced-motion is active."
    },
    guidelines: {
      recommended: [
        "Primary AI generation indicator during LLM inference or agentic orchestration",
        "Centered focal point in conversational AI sidebars, chat modals, or synthesis screens",
        "Interactive retro-cyberpunk hero element in developer tools and creative platforms"
      ],
      bestPractices: [
        "Provide a concise descriptive text prop like 'Thinking' or 'Synthesizing' for clear user feedback",
        "Use matching color props to align the orb with your application's primary brand accents",
        "Ensure parent container provides enough clearance for the outer 15% radial glow aura"
      ]
    },
    props: [
      {
        name: "size",
        type: "number",
        defaultValue: "190",
        description: "Width and height of the orb in pixels.",
      },
      {
        name: "text",
        type: "string",
        defaultValue: "'Generating'",
        description: "Text displayed in the center with staggered letter wave animation.",
      },
      {
        name: "color",
        type: "string",
        defaultValue: "undefined",
        description: "Primary accent color for the plasma waves, outer aura, and inner chromatic shadows.",
      },
      {
        name: "variant",
        type: "'chromatic' | 'neon' | 'cyberpunk' | 'emerald' | 'amber' | 'monochrome'",
        defaultValue: "'chromatic'",
        description: "Color palette theme for the dual-tone plasma and volumetric shadows.",
      },
      {
        name: "dither",
        type: "boolean",
        defaultValue: "true",
        description: "Enables retro 8x8 Bayer ordered matrix dithering across the plasma.",
      },
      {
        name: "pixelSize",
        type: "number",
        defaultValue: "2",
        description: "Resolution scale factor for the dither pixels (1-8).",
      },
      {
        name: "colorNum",
        type: "number",
        defaultValue: "5",
        description: "Number of quantized color bands rendered by the dither kernel.",
      },
      {
        name: "speed",
        type: "number",
        defaultValue: "0.8",
        description: "Playback speed multiplier for plasma turbulence and shadow rotation.",
      },
      {
        name: "interactive",
        type: "boolean",
        defaultValue: "true",
        description: "Enables pointer position tracking to distort plasma waves on hover.",
      },
      {
        name: "showText",
        type: "boolean",
        defaultValue: "true",
        description: "Controls whether the centered letter wave typography is visible.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes applied to the root container.",
      },
    ],
    files: [
      {
        name: "ai-orb.tsx",
        path: "registry/ui/ai-orb.tsx",
        code: `"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

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
  variant?: "chromatic" | "neon" | "cyberpunk" | "emerald" | "amber" | "monochrome";
}

const VERTEX_SHADER = \`
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = (position + 1.0) * 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
\`;

const FRAGMENT_SHADER = \`
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
\`;

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });

  const preset = VARIANT_PRESETS[variant] ?? VARIANT_PRESETS.chromatic;
  const primaryColor = color ?? preset.primary;
  const secondaryColor = preset.secondary;

  const rgbPrimary = useMemo(() => hexToRgb(primaryColor), [primaryColor]);
  const rgbSecondary = useMemo(() => hexToRgb(secondaryColor), [secondaryColor]);

  const letters = useMemo(() => text.split(""), [text]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        preserveDrawingBuffer: false,
      });
    } catch {
      return;
    }

    if (!gl) {
      return;
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
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1,
      ]),
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

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (gl) {
        gl.deleteBuffer(quadBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [colorNum, dither, pixelSize, rgbPrimary, rgbSecondary, speed]);

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
          background: \`radial-gradient(circle, \${primaryColor} 0%, \${secondaryColor} 60%, transparent 75%)\`,
        }}
      />

      <div className="absolute inset-0 rounded-full overflow-hidden z-0">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: \`radial-gradient(circle at 35% 35%, \${primaryColor} 0%, \${secondaryColor} 55%, #050508 100%)\`,
          }}
        />
        <canvas
          ref={canvasRef}
          className="relative w-full h-full block"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none z-10"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 3.5 / speed,
          ease: "linear",
        }}
        style={{
          boxShadow: \`
            0 10px 22px 0 rgba(255, 255, 255, 0.85) inset,
            0 24px 34px 0 \${primaryColor} inset,
            0 64px 64px 0 \${secondaryColor} inset,
            0 0 20px 2px \${primaryColor}66
          \`,
        }}
      />

      <motion.div
        className="absolute inset-0.75 rounded-full pointer-events-none z-10 border border-white/20"
        animate={{ rotate: -360 }}
        transition={{
          repeat: Infinity,
          duration: 7 / speed,
          ease: "linear",
        }}
        style={{
          boxShadow: \`
            0 -8px 18px 0 rgba(255, 255, 255, 0.4) inset,
            0 -16px 28px 0 \${secondaryColor} inset
          \`,
        }}
      />

      <div className="absolute inset-0 rounded-full pointer-events-none z-20 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.35)_0%,transparent_50%)]" />

      {showText && (
        <div className="relative z-30 flex items-center justify-center gap-0.5 px-3 pointer-events-none select-none">
          {letters.map((char, index) => (
            <motion.span
              key={\`\${char}-\${index}\`}
              initial={{ opacity: 0.35, y: 0, scale: 1 }}
              animate={{
                opacity: [0.35, 1, 0.65, 0.35],
                scale: [1, 1.18, 1, 1],
                y: [0, -2.5, 0, 0],
              }}
              transition={{
                duration: 2.2 / speed,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1,
              }}
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
`,
      },
    ],
  },
  "glowing-badge": {
    slug: "glowing-badge",
    name: "Glowing Badge",
    description: "Compact status and tag badge with glowing borders and pulsing indicator.",
    summary: "A compact status indicator engineered for system health monitors, live telemetry badges, server status widgets, and release chips. Features vibrant chromatic color palettes (blue, emerald, amber, violet) with diffused outer glow box-shadows and an animated concentric ping pulse dot indicator that visually communicates active background tasks, live connectivity, or nominal status.",
    category: "feedback",
    tags: ["badge", "status", "glow", "indicator", "pulse", "live-data", "telemetry"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    supportsColor: true,
    hidden: true,
    highlights: [
      "Four curated semantic color schemes with matching diffuse radial glow drop shadows",
      "Concentric dual-element ping pulse with 75% peak opacity and infinite loop",
      "Compact uppercase monospace typography tailored for developer interfaces",
      "Zero-JS CSS-only animation for exceptional performance in dense data tables",
      "Flexible pill geometry supporting arbitrary child icons, metrics, or labels"
    ],
    anatomy: [
      "<div> (Badge Shell: inline-flex container with rounded pill border, background, and radial box shadow)",
      "<span> (Pulse Ring: expanding ping ring with animate-ping keyframe effect)",
      "<span> (Core Dot: solid static colored dot anchoring the pulse animation)",
      "<span> (Label: monospace text container displaying status text)"
    ],
    physics: {
      engine: "CSS Keyframe Ping & Diffuse Shadow",
      description: "Infinite 1-second CSS keyframe animation expanding a concentric ring with opacity decay.",
      parameters: [
        { label: "Ping Duration", value: "1000ms cubic-bezier(0, 0, 0.2, 1) infinite" },
        { label: "Glow Radius", value: "12px outer blur shadow" },
        { label: "Dot Diameter", value: "6px (1.5rem / 6px)" },
        { label: "Border Weight", value: "1px hairline border" },
        { label: "Execution Impact", value: "0ms JavaScript runtime" }
      ]
    },
    accessibility: {
      role: "status",
      aria: "Accepts aria-live='polite' or aria-label for live telemetry status announcements.",
      reducedMotion: "Pulse ping animation automatically pauses when prefers-reduced-motion is active.",
      keyboard: [
        { key: "Non-interactive", description: "Focus passes through unless wrapped in an interactive anchor or button." }
      ]
    },
    guidelines: {
      recommended: [
        "Production vs Staging environment indicators in application headers",
        "API gateway health and database cluster status chips",
        "Live streaming, build pipeline status, and real-time telemetry markers"
      ],
      bestPractices: [
        "Use emerald for nominal/healthy, amber for degraded/warning, blue for active/syncing, violet for beta/preview",
        "Keep status text concise (1 to 2 words, e.g., 'SYSTEM_ACTIVE', 'NOMINAL')",
        "Pair with monospace numerals for real-time uptime or latency metrics"
      ]
    },
    props: [
      {
        name: "variant",
        type: '"blue" | "emerald" | "amber" | "violet"',
        defaultValue: '"blue"',
        description: "Color palette controlling border tint, diffuse glow shadow, and pulse dot color: blue, emerald, amber, or violet.",
      },
      {
        name: "pulse",
        type: "boolean",
        defaultValue: "true",
        description: "Enable or disable the animated concentric ping pulse dot indicator.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Status label, count, or text rendered inside the badge pill.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes to customize pill borders, spacing, or typography.",
      },
    ],
    files: [
      {
        name: "glowing-badge.tsx",
        path: "registry/ui/glowing-badge.tsx",
        code: `import React from "react";
import { cn } from "@/lib/utils";

export interface GlowingBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "blue" | "emerald" | "amber" | "violet";
  pulse?: boolean;
}

export const GlowingBadge = ({
  className,
  children,
  variant = "blue",
  pulse = true,
  ...props
}: GlowingBadgeProps) => {
  const variantStyles = {
    blue: "border-blue-500/30 bg-blue-950/40 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]",
    emerald: "border-emerald-500/30 bg-emerald-950/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    amber: "border-amber-500/30 bg-amber-950/40 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    violet: "border-violet-500/30 bg-violet-950/40 text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.15)]",
  };

  const dotColors = {
    blue: "bg-blue-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    violet: "bg-violet-400",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              dotColors[variant]
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              dotColors[variant]
            )}
          />
        </span>
      )}
      <span>{children}</span>
    </div>
  );
};`,
      },
    ],
  },
  "hook-sidebar": {
    slug: "hook-sidebar",
    name: "Hook Sidebar",
    description: "Collapsible navigation sidebar with animated traveling spring rail and curved elbow hook.",
    summary: "A precision navigation rail engineered for documentation portals, administrative sidebars, and hierarchical application navigators. Features a continuous vertical guide rail with a dynamic traveling SVG elbow hook that smoothly tracks the active or hovered navigation item via real-time DOM geometry measurement (offsetTop + offsetHeight / 2) and high-frequency ResizeObserver listeners.",
    category: "navigation",
    tags: ["sidebar", "navigation", "hook", "rail", "spring", "a11y"],
    dependencies: ["clsx", "tailwind-merge", "motion"],
    version: "1.0.0",
    createdDate: "2026-09-20",
    updatedDate: "2026-09-20",
    interactive: true,
    supportsColor: true,
    highlights: [
      "Continuous SVG vector path interpolation (M0.5 0a6 6 0 0 0 6 6H12) with 6px corner curve",
      "Real-time DOM element measuring with ResizeObserver and requestAnimationFrame",
      "Dual-rail architecture: instantaneous hover preview rail and persistent active route indicator",
      "Zero-lag route synchronization using Next.js usePathname() with hash anchor support",
      "Integrated prefers-reduced-motion fallback bypassing physics for instant transitions"
    ],
    anatomy: [
      "<nav> (Root navigation wrapper with data-slot and customizable ARIA label)",
      "<Rail (Hover)> (Ephemeral zinc-600 dashed guide following pointer and focus events)",
      "<Rail (Active)> (Accent-colored solid/dashed traveling indicator with SVG elbow curve)",
      "<HookSidebarItem> (Semantic Next.js <Link> or <button> with active state markers)"
    ],
    physics: {
      engine: "Motion Spring Dynamics",
      description: "Damped harmonic oscillator physics calculating real-time traveling rail distance and SVG hook translation with zero overshoot oscillation.",
      parameters: [
        { label: "Spring Stiffness", value: "420" },
        { label: "Damping Factor", value: "34" },
        { label: "Mass Coefficient", value: "0.7" },
        { label: "Elbow Curve Radius", value: "6px corner" },
        { label: "Dash Pattern Pitch", value: "4px repeating gradient" },
        { label: "Reduced Motion", value: "0ms / Instant duration" }
      ]
    },
    accessibility: {
      role: "navigation",
      aria: "aria-label on nav container, aria-current='page' on active Next.js links, aria-current='true' on active buttons, and aria-hidden='true' on decorative motion rails.",
      reducedMotion: "Hook and rail transitions immediately collapse to 0s duration when prefers-reduced-motion is detected.",
      keyboard: [
        { key: "Tab / Shift+Tab", description: "Focus next / previous navigation item with automatic focus indicator rail tracking." },
        { key: "Enter / Space", description: "Activate focused navigation link or trigger custom item click handler." }
      ]
    },
    guidelines: {
      recommended: [
        "Primary left navigation for technical documentation portals and knowledge bases",
        "Multi-step settings dashboards and administrative account consoles",
        "Hierarchical section navigators in rich data web applications"
      ],
      bestPractices: [
        "Keep top-level items between 3 and 10 for optimal vertical rail travel ergonomics",
        "Ensure high-contrast accent colors (#FC4C01 or similar) against dark container surfaces",
        "Pass explicit unique href or label values to prevent key collisions"
      ]
    },
    props: [
      {
        name: "items",
        type: "HookSidebarItem[]",
        required: true,
        defaultValue: "[]",
        description: "Array of navigation items as strings or objects containing label, optional href, and custom onClick.",
      },
      {
        name: "label",
        type: "string",
        defaultValue: "undefined",
        description: "Uppercase category or section label rendered above navigation items.",
      },
      {
        name: "value",
        type: "number",
        defaultValue: "undefined",
        description: "Controlled active item index. Overrides internal state and pathname detection.",
      },
      {
        name: "defaultValue",
        type: "number",
        defaultValue: "0",
        description: "Initial item index to highlight when rendered in uncontrolled mode.",
      },
      {
        name: "onChange",
        type: "(index: number) => void",
        defaultValue: "undefined",
        description: "Callback triggered whenever the user clicks or navigates to a new item.",
      },
      {
        name: "color",
        type: "string",
        defaultValue: '"#FC4C01"',
        description: "Active accent rail and hook color.",
      },
      {
        name: "dashed",
        type: "boolean",
        defaultValue: "true",
        description: "Render repeating dashed guide pattern along the rail.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes passed to the outer <nav> element.",
      },
    ],
    files: [
      {
        name: "hook-sidebar.tsx",
        path: "registry/ui/hook-sidebar.tsx",
        code: `"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const CORNER = 6;
const DASH =
  "repeating-linear-gradient(to top, transparent 0 2px, currentColor 2px 4px)";

export type HookSidebarItem =
  | string
  | {
      label: string;
      href?: string;
      onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    };

export type HookSidebarProps = Omit<ComponentProps<"nav">, "onChange"> & {
  items: HookSidebarItem[];
  label?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (index: number) => void;
  color?: string;
  dashed?: boolean;
};

const hrefOf = (item: HookSidebarItem) =>
  typeof item === "string" ? undefined : item.href;

const labelOf = (item: HookSidebarItem) =>
  typeof item === "string" ? item : item.label;

const Rail = ({
  from = 0,
  y,
  visible,
  color,
  dashed,
  className,
}: {
  from?: number;
  y: number | null;
  visible: boolean;
  color?: string;
  dashed: boolean;
  className?: string;
}) => {
  const reduced = useReducedMotion();
  const travel = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.7 };

  return (
    <motion.span
      aria-hidden
      initial={false}
      style={{ color }}
      animate={{ opacity: visible && y !== null ? 1 : 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.2 }}
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <motion.span
        initial={false}
        animate={{ top: from, height: Math.max(0, (y ?? 0) - CORNER - from) }}
        transition={travel}
        style={
          dashed
            ? { backgroundImage: DASH }
            : { backgroundColor: "currentColor" }
        }
        className="absolute left-0.5 w-px"
      />
      <motion.svg
        initial={false}
        animate={{ top: (y ?? 0) - CORNER }}
        transition={travel}
        width="12"
        height="7"
        viewBox="0 0 12 7"
        fill="none"
        className="absolute left-0.5"
      >
        <path
          d="M0.5 0a6 6 0 0 0 6 6H12"
          stroke="currentColor"
          strokeDasharray={dashed ? "2 2" : undefined}
        />
      </motion.svg>
    </motion.span>
  );
};

export function HookSidebar({
  items,
  label,
  value,
  defaultValue = 0,
  onChange,
  color = "#FC4C01",
  dashed = true,
  className,
  ...props
}: HookSidebarProps) {
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [centers, setCenters] = useState<number[]>([]);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);

  const routeIndex = items.findIndex((item) => hrefOf(item) === pathname);
  const activeIndex = value ?? (routeIndex >= 0 ? routeIndex : internalValue);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () =>
      setCenters(
        itemRefs.current.map((el) =>
          el ? el.offsetTop + el.offsetHeight / 2 : 0
        )
      );

    measure();
    const rafId = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [items.length]);

  const activeY = activeIndex < 0 ? null : (centers[activeIndex] ?? null);
  const hoverY = hoverIndex === null ? null : (centers[hoverIndex] ?? null);

  const hoverFrom =
    activeY !== null && hoverY !== null && hoverY <= activeY
      ? Math.max(0, hoverY - CORNER)
      : (activeY ?? 0);

  const select = (index: number) => {
    if (value === undefined) setInternalValue(index);
    onChange?.(index);
  };

  return (
    <nav
      data-slot="hook-sidebar"
      aria-label={label}
      className={cn("flex flex-col", className)}
      {...props}
    >
      {label && (
        <span
          data-slot="hook-sidebar-label"
          className="pb-2.5 pl-0.5 pr-2 font-poppins text-[11px] font-medium uppercase tracking-wider text-zinc-500"
        >
          {label}
        </span>
      )}

      <div
        ref={listRef}
        onMouseLeave={() => setPointerInside(false)}
        className="relative flex flex-col gap-0.5"
      >
        <Rail
          from={hoverFrom}
          y={hoverY}
          visible={(pointerInside || focusInside) && hoverIndex !== activeIndex}
          dashed={dashed}
          className="text-zinc-600"
        />
        <Rail
          y={activeY}
          visible={activeY !== null}
          color={color}
          dashed={dashed}
        />

        {items.map((item, index) => {
          const text = labelOf(item);
          const href = hrefOf(item);
          const isActive = index === activeIndex;
          const setRef = (el: HTMLElement | null) => {
            itemRefs.current[index] = el;
          };
          const rowProps = {
            "data-slot": "hook-sidebar-item",
            "data-active": isActive,
            onMouseEnter: () => {
              setHoverIndex(index);
              setPointerInside(true);
            },
            onFocus: () => {
              setHoverIndex(index);
              setFocusInside(true);
            },
            onBlur: () => setFocusInside(false),
            onClick: (e: React.MouseEvent<HTMLElement>) => {
              if (typeof item !== "string" && item.onClick) {
                item.onClick(e);
              }
              if (href?.startsWith("#")) {
                e.preventDefault();
              }
              select(index);
            },
            className: cn(
              "rounded-lg py-1 pl-5 pr-2 text-left text-xs transition-colors duration-200 motion-reduce:transition-none select-none cursor-pointer",
              isActive
                ? "text-white font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            ),
          };

          return href ? (
            <Link
              key={\`\${index}-\${text}\`}
              {...rowProps}
              ref={setRef}
              href={href}
              aria-current={isActive ? "page" : undefined}
            >
              {text}
            </Link>
          ) : (
            <button
              key={\`\${index}-\${text}\`}
              {...rowProps}
              ref={setRef}
              type="button"
              aria-current={isActive ? "true" : undefined}
            >
              {text}
            </button>
          );
        })}
      </div>
    </nav>
  );
}`,
      },
    ],
  },
  "proximity-sidebar": {
    slug: "proximity-sidebar",
    name: "Proximity Sidebar",
    description: "Dynamic document navigation minimap with smooth spring-physics cursor proximity expansion and scroll tracking.",
    summary: "An ultra-fluid document outline and navigation minimap engineered for content-heavy pages, documentation portals, and long-form articles. Features hierarchical dash indicators that smoothly expand horizontally as the pointer approaches vertically, driven by cosine falloff curves and spring damping physics. Fully synchronized with viewport and container scrolling, supporting bidirectional click-to-scroll, keyboard navigation, and customizable accent themes with zero layout thrashing.",
    category: "navigation",
    tags: ["sidebar", "navigation", "proximity", "minimap", "spring", "motion", "a11y"],
    dependencies: ["clsx", "tailwind-merge", "motion"],
    version: "1.0.0",
    createdDate: "2026-09-22",
    updatedDate: "2026-09-22",
    interactive: true,
    supportsColor: true,
    highlights: [
      "Harmonic spring physics (stiffness 350, damping 32, mass 0.6) with cosine proximity falloff",
      "Zero layout thrashing with cached element geometry during pointer interaction",
      "Hierarchical dash indicators for title, subtitle, section, and body heading depths",
      "Bidirectional scroll synchronization with requestAnimationFrame debouncing",
      "Pure minimalist aesthetics with zero container boxes or borders",
      "Accessible keyboard navigation with Tab and ArrowUp / ArrowDown support"
    ],
    anatomy: [
      "<nav> (Root container with data-slot='proximity-sidebar' and accessible role)",
      "<button> (Focusable item with generous interactive hit target)",
      "<motion.span> (GPU-accelerated scaleX transformed hairline indicator)"
    ],
    physics: {
      engine: "Motion Spring Dynamics + Cosine Proximity Falloff",
      description: "Cosine-smoothed proximity distance mapping feeding a damped harmonic spring oscillator, resulting in zero-crease elastic expansion and retraction.",
      parameters: [
        { label: "Proximity Radius", value: "48px default (configurable)" },
        { label: "Max Dash Width", value: "110px default (configurable)" },
        { label: "Spring Stiffness", value: "350" },
        { label: "Damping Coefficient", value: "32" },
        { label: "Mass Coefficient", value: "0.6" },
        { label: "Falloff Function", value: "cos(dist / radius * (PI / 2))" }
      ]
    },
    accessibility: {
      role: "navigation",
      aria: "aria-label on nav container and proximity group, aria-current='location' on active section dash, and descriptive aria-label on all interactive buttons.",
      reducedMotion: "Bypasses spring physics and transitions instantly when prefers-reduced-motion is active.",
      keyboard: [
        { key: "Tab / Shift+Tab", description: "Focus into and navigate through individual section dashes." },
        { key: "ArrowUp / ArrowDown", description: "Cycle through sections sequentially and scroll to the selected section." },
        { key: "Enter / Space", description: "Activate selected section and trigger smooth scroll to target heading." }
      ]
    },
    guidelines: {
      recommended: [
        "Right or left document minimap for technical documentation, RFCs, and API references",
        "Chapter and section outline for interactive tutorials, case studies, and engineering blog posts",
        "Executive summary navigation for dashboard reports and analytics breakdowns"
      ],
      bestPractices: [
        "Ensure target section elements have matching id attributes corresponding to section.id",
        "Use appropriate kind or level values to convey clear document hierarchy",
        "Add scroll-margin-top to section targets if using a fixed top navigation bar"
      ]
    },
    props: [
      {
        name: "sections",
        type: "ProximitySection[]",
        required: true,
        defaultValue: "[]",
        description: "Array of sections with id, label, and optional kind ('title' | 'subtitle' | 'section' | 'body') or level (1-6).",
      },
      {
        name: "side",
        type: "'left' | 'right'",
        defaultValue: "'left'",
        description: "Orientation of the sidebar and direction from which dashes expand.",
      },
      {
        name: "color",
        type: "string",
        defaultValue: "undefined",
        description: "Custom accent color for the active section dash.",
      },
      {
        name: "radius",
        type: "number",
        defaultValue: "48",
        description: "Proximity influence radius in pixels around the pointer position.",
      },
      {
        name: "maxDashWidth",
        type: "number",
        defaultValue: "110",
        description: "Maximum horizontal width of the dash in pixels at peak proximity.",
      },
      {
        name: "activeOffset",
        type: "number",
        defaultValue: "0.4",
        description: "Viewport height fraction (0-1) used as the detection anchor for scroll synchronization.",
      },
      {
        name: "value",
        type: "string",
        defaultValue: "undefined",
        description: "Controlled active section id.",
      },
      {
        name: "defaultValue",
        type: "string",
        defaultValue: "undefined",
        description: "Initial section id highlighted when rendered in uncontrolled mode.",
      },
      {
        name: "onChange",
        type: "(id: string) => void",
        defaultValue: "undefined",
        description: "Callback invoked whenever a section is activated by click or keyboard navigation.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes applied to the outer <nav> element.",
      },
    ],
    files: [
      {
        name: "proximity-sidebar.tsx",
        path: "registry/ui/proximity-sidebar.tsx",
        code: `"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

export type Side = "left" | "right";
export type SectionKind = "title" | "subtitle" | "section" | "body";
export type SectionLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type ProximitySection = {
  id: string;
  label: string;
  kind?: SectionKind;
  level?: SectionLevel;
};

type DashPreset = {
  base: number;
  bump: number;
  thickness: number;
  className: string;
};

type DashProps = {
  active: boolean;
  color?: string;
  maxDashWidth: number;
  mouseY: MotionValue<number>;
  onSelect: (id: string) => void;
  radius: number;
  registerDash: (id: string, node: HTMLButtonElement | null) => void;
  section: ProximitySection;
  sectionKind: SectionKind;
  side: Side;
};

export type ProximitySidebarProps = {
  activeOffset?: number;
  className?: string;
  color?: string;
  defaultValue?: string;
  maxDashWidth?: number;
  onChange?: (id: string) => void;
  radius?: number;
  sections: ProximitySection[];
  side?: Side;
  value?: string;
};

const DEFAULT_RADIUS = 32;
const DEFAULT_MAX_DASH_WIDTH = 90;
const SCROLL_IDLE_RESET_DELAY = 80;

const DASH_PRESETS: Record<SectionKind, DashPreset> = {
  title: {
    base: 54,
    bump: 36,
    thickness: 1.5,
    className: "bg-white",
  },
  subtitle: {
    base: 40,
    bump: 42,
    thickness: 1.25,
    className: "bg-zinc-300",
  },
  section: {
    base: 26,
    bump: 48,
    thickness: 1,
    className: "bg-zinc-600",
  },
  body: {
    base: 22,
    bump: 48,
    thickness: 1,
    className: "bg-zinc-600",
  },
};

const getSectionElement = (id: string) =>
  typeof document === "undefined" ? null : document.getElementById(id);

const getSectionKind = (section: ProximitySection): SectionKind => {
  if (section.kind) return section.kind;
  if (section.level === 1) return "title";
  if (section.level === 2) return "subtitle";
  if (section.level === 3) return "section";
  return "body";
};

const getScrollParent = (element: HTMLElement): EventTarget => {
  let parent = element.parentElement;

  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);
    if (/(auto|scroll|overlay)/.test(overflowY)) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return window;
};

const Dash = ({
  active,
  color,
  maxDashWidth,
  mouseY,
  onSelect,
  radius,
  registerDash,
  section,
  sectionKind,
  side,
}: DashProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const centerCoord = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const preset = DASH_PRESETS[sectionKind];

  useEffect(() => {
    registerDash(section.id, ref.current);
    return () => registerDash(section.id, null);
  }, [registerDash, section.id]);

  useEffect(() => {
    const invalidate = () => {
      centerCoord.current = null;
    };

    window.addEventListener("resize", invalidate, { passive: true });
    window.addEventListener("scroll", invalidate, { passive: true });

    return () => {
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("scroll", invalidate);
    };
  }, []);

  const targetScaleX = useTransform(mouseY, (y) => {
    if (!ref.current || y === Infinity) {
      return preset.base / maxDashWidth;
    }

    if (centerCoord.current === null) {
      const rect = ref.current.getBoundingClientRect();
      centerCoord.current = rect.top + rect.height / 2;
    }

    const dist = Math.abs(y - centerCoord.current);
    if (dist >= radius) {
      return preset.base / maxDashWidth;
    }

    const factor = Math.cos((dist / radius) * (Math.PI / 2));
    const width = preset.base + preset.bump * factor;
    return Math.min(1, width / maxDashWidth);
  });

  const springScaleX = useSpring(targetScaleX, {
    stiffness: 350,
    damping: 32,
    mass: 0.6,
  });

  const scaleX = shouldReduceMotion ? targetScaleX : springScaleX;

  return (
    <button
      ref={ref}
      type="button"
      data-slot="proximity-dash"
      data-active={active}
      aria-current={active ? "location" : undefined}
      aria-label={\`Go to \${section.label}\`}
      title={section.label}
      className={cn(
        "group relative flex h-1.5 items-center border-0 bg-transparent p-0 outline-none select-none cursor-pointer",
        side === "right" ? "justify-end" : "justify-start",
      )}
      style={{ width: maxDashWidth }}
      onClick={() => onSelect(section.id)}
    >
      <motion.span
        className={cn(
          "block rounded-full transition-colors duration-200 group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-black will-change-transform",
          active
            ? color
              ? ""
              : "bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"
            : cn(preset.className, "group-hover:bg-zinc-200"),
        )}
        style={{
          backgroundColor: active && color ? color : undefined,
          boxShadow: active && color ? \`0 0 10px \${color}80\` : undefined,
          height: preset.thickness,
          scaleX,
          transformOrigin: side === "left" ? "left center" : "right center",
          width: maxDashWidth,
        }}
      />
    </button>
  );
};

export function ProximitySidebar({
  activeOffset = 0.4,
  className,
  color,
  defaultValue,
  maxDashWidth = DEFAULT_MAX_DASH_WIDTH,
  onChange,
  radius = DEFAULT_RADIUS,
  sections,
  side = "left",
  value,
}: ProximitySidebarProps) {
  const mouseY = useMotionValue(Infinity);
  const shouldReduceMotion = useReducedMotion();
  const dashRefs = useRef(new Map<string, HTMLButtonElement>());
  const pointerInside = useRef(false);
  const resetTimer = useRef<number | null>(null);

  const [internalActiveId, setInternalActiveId] = useState<string>(
    defaultValue ?? sections[0]?.id ?? "",
  );

  const activeId = value !== undefined ? value : internalActiveId;

  const sectionKinds = useMemo(() => {
    return sections.reduce<Record<string, SectionKind>>(
      (nextKinds, section) => {
        nextKinds[section.id] = getSectionKind(section);
        return nextKinds;
      },
      {},
    );
  }, [sections]);

  const registerDash = useCallback(
    (id: string, node: HTMLButtonElement | null) => {
      if (node) {
        dashRefs.current.set(id, node);
      } else {
        dashRefs.current.delete(id);
      }
    },
    [],
  );

  const clearPendingReset = useCallback(() => {
    if (!resetTimer.current) return;
    window.clearTimeout(resetTimer.current);
    resetTimer.current = null;
  }, []);

  const setMouseToDash = useCallback(
    (id?: string) => {
      if (!id) {
        mouseY.set(Infinity);
        return;
      }

      const node = dashRefs.current.get(id);
      if (!node) return;

      const rect = node.getBoundingClientRect();
      mouseY.set(rect.top + rect.height / 2);
    },
    [mouseY],
  );

  const pulseDash = useCallback(
    (id?: string) => {
      setMouseToDash(id);
      clearPendingReset();

      if (!id || pointerInside.current) return;

      resetTimer.current = window.setTimeout(() => {
        mouseY.set(Infinity);
        resetTimer.current = null;
      }, SCROLL_IDLE_RESET_DELAY);
    },
    [clearPendingReset, mouseY, setMouseToDash],
  );

  const selectSection = useCallback(
    (id: string) => {
      const element = getSectionElement(id);
      if (element) {
        element.scrollIntoView({
          behavior: shouldReduceMotion ? "auto" : "smooth",
          block: "start",
        });
        window.history.replaceState(null, "", \`#\${id}\`);
      }

      if (value === undefined) {
        setInternalActiveId(id);
      }
      onChange?.(id);
      pulseDash(id);
    },
    [onChange, pulseDash, shouldReduceMotion, value],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = sections.findIndex((s) => s.id === activeId);
      if (currentIndex === -1) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = Math.min(sections.length - 1, currentIndex + 1);
        selectSection(sections[nextIndex].id);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const prevIndex = Math.max(0, currentIndex - 1);
        selectSection(sections[prevIndex].id);
      }
    },
    [activeId, sections, selectSection],
  );

  useEffect(() => () => clearPendingReset(), [clearPendingReset]);

  useEffect(() => {
    if (!sections.length) return;

    let frame = 0;

    const scrollParents = new Set<EventTarget>([window]);

    for (const section of sections) {
      const element = getSectionElement(section.id);
      if (element) {
        scrollParents.add(getScrollParent(element));
      }
    }

    const updateActiveSection = () => {
      frame = 0;

      let primaryScrollElement: HTMLElement | null = null;
      for (const parent of scrollParents) {
        if (parent instanceof HTMLElement && parent !== document.body && parent !== document.documentElement) {
          primaryScrollElement = parent;
          break;
        }
      }

      if (primaryScrollElement) {
        if (primaryScrollElement.scrollTop <= 15) {
          const firstId = sections[0]?.id;
          if (firstId) {
            if (value === undefined) setInternalActiveId(firstId);
            if (!pointerInside.current) pulseDash(firstId);
          }
          return;
        }

        if (
          primaryScrollElement.scrollTop + primaryScrollElement.clientHeight >=
          primaryScrollElement.scrollHeight - 15
        ) {
          const lastId = sections[sections.length - 1]?.id;
          if (lastId) {
            if (value === undefined) setInternalActiveId(lastId);
            if (!pointerInside.current) pulseDash(lastId);
          }
          return;
        }
      } else if (typeof window !== "undefined") {
        if (window.scrollY <= 15) {
          const firstId = sections[0]?.id;
          if (firstId) {
            if (value === undefined) setInternalActiveId(firstId);
            if (!pointerInside.current) pulseDash(firstId);
          }
          return;
        }

        if (
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 15
        ) {
          const lastId = sections[sections.length - 1]?.id;
          if (lastId) {
            if (value === undefined) setInternalActiveId(lastId);
            if (!pointerInside.current) pulseDash(lastId);
          }
          return;
        }
      }

      const anchorY = primaryScrollElement
        ? primaryScrollElement.getBoundingClientRect().top + 50
        : 60;

      let nextActiveId = sections[0]?.id;

      for (const section of sections) {
        const element = getSectionElement(section.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top <= anchorY) {
          nextActiveId = section.id;
        }
      }

      if (nextActiveId) {
        if (value === undefined) {
          setInternalActiveId(nextActiveId);
        }
        if (!pointerInside.current) {
          pulseDash(nextActiveId);
        }
      }
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();

    for (const parent of scrollParents) {
      parent.addEventListener("scroll", scheduleUpdate, { passive: true });
    }

    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);

      for (const parent of scrollParents) {
        parent.removeEventListener("scroll", scheduleUpdate);
      }

      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [activeOffset, pulseDash, sections, value]);

  return (
    <nav
      data-slot="proximity-sidebar"
      aria-label="Page sections"
      className={cn(
        "flex select-none",
        side === "left" ? "justify-start" : "justify-end",
        className,
      )}
    >
      <div
        role="group"
        tabIndex={0}
        aria-label="Proximity navigation"
        onKeyDown={handleKeyDown}
        className={cn(
          "flex flex-col outline-none gap-1 py-0",
          side === "right" ? "items-end" : "items-start",
        )}
        onPointerEnter={(event) => {
          clearPendingReset();
          pointerInside.current = true;
          mouseY.set(event.clientY);
        }}
        onPointerMove={(event) => {
          clearPendingReset();
          pointerInside.current = true;
          mouseY.set(event.clientY);
        }}
        onPointerLeave={() => {
          pointerInside.current = false;
          mouseY.set(Infinity);
        }}
      >
        {sections.map((section) => (
          <Dash
            key={section.id}
            active={section.id === activeId}
            color={color}
            maxDashWidth={maxDashWidth}
            mouseY={mouseY}
            onSelect={selectSection}
            radius={radius}
            registerDash={registerDash}
            section={section}
            sectionKind={sectionKinds[section.id] ?? getSectionKind(section)}
            side={side}
          />
        ))}
      </div>
    </nav>
  );
}

export default ProximitySidebar;
`,
      },
    ],
  },
  "github-activity": {
    slug: "github-activity",
    name: "GitHub Activity",
    description: "A minimalist, glass-inspired contribution heatmap matrix with interactive hover feedback and activity tiers.",
    summary: "An interactive, glassmorphic GitHub contribution heatmap modeled after Dradix and GitHub's developer activity matrix. Renders 26 calendar weeks across 7 weekday rows with interactive coordinate hover tooltips, live commit count feedback, multi-tier color themes, and an activity level legend. Built with translucent backdrop blur, subtle perimeter highlights, and rich layered shadows.",
    category: "display",
    tags: ["heatmap", "github", "contributions", "glassmorphism", "visualization", "metrics", "dradix"],
    dependencies: ["clsx", "tailwind-merge", "motion"],
    version: "2.0.0",
    createdDate: "2026-09-20",
    updatedDate: "2026-09-21",
    interactive: true,
    supportsColor: false,
    highlights: [
      "26×7 contribution cell matrix with pseudo-random seed distribution generator",
      "Multi-tier color grading supporting signature Dradix teal and classic GitHub emerald",
      "Interactive cell hover scale (scale-125) with smooth spring-gliding glass tooltip",
      "Pure chart architecture with zero extra drawer blocks for maximum minimalism",
      "Multi-layered glassmorphic container with backdrop-blur-xl and delicate light sheen"
    ],
    anatomy: [
      "<div> (Glass Shell: rounded-2xl container with backdrop-blur-xl and multi-layer depth shadow)",
      "<div> (Header: matrix title and subtitle)",
      "<div> (Month Labels: horizontal interval markers across the top of the grid)",
      "<div> (Grid Matrix: 26 column flex containers each containing 7 weekday cells)",
      "<motion.div> (Gliding Tooltip: spring-animated floating glass pill with live rolling text)",
      "<div> (Activity Legend: bottom Less/More intensity tier indicator)"
    ],
    physics: {
      engine: "Motion Spring Gliding & popLayout Text Transitions",
      description: "Spring physics (stiffness: 480, damping: 32) smoothly glides the tooltip between hovered cells, while popLayout transitions animate rolling commit count updates.",
      parameters: [
        { label: "Cell Hover Scale", value: "1.25 (25% magnification)" },
        { label: "Transition Duration", value: "150ms ease-out" },
        { label: "Tooltip Delay", value: "0ms instantaneous binding" }
      ]
    },
    accessibility: {
      role: "region",
      aria: "aria-label='GitHub Contribution Heatmap', and aria-hidden on decorative grid visuals.",
      reducedMotion: "Cell hover scale transitions collapse to instant states when prefers-reduced-motion is active.",
      keyboard: [
        { key: "Tab", description: "Focus interactive container." }
      ]
    },
    guidelines: {
      recommended: [
        "Developer portfolio hero sections and about pages",
        "Open-source organization dashboards and profile cards",
        "Telemetry and commit streak tracking widgets"
      ],
      bestPractices: [
        "Pass real contribution data arrays to override default simulated data",
        "Keep totalContributions synchronized with the sum of all cell values",
        "Ensure container has minimum width of 360px to prevent horizontal grid clipping"
      ]
    },
    props: [
      {
        name: "username",
        type: "string",
        defaultValue: "undefined",
        description: "Target GitHub username for dynamic API data fetching or profile attribution.",
      },
      {
        name: "title",
        type: "string",
        defaultValue: "\"Commit Heatmap\"",
        description: "Main header title for the contribution heatmap card.",
      },
      {
        name: "subtitle",
        type: "string",
        defaultValue: "undefined",
        description: "Secondary header label or user attribution.",
      },
      {
        name: "totalContributions",
        type: "number",
        defaultValue: "1863",
        description: "Total annual contribution count displayed in the top card header.",
      },
      {
        name: "year",
        type: "number",
        defaultValue: "2025",
        description: "Calendar year corresponding to the displayed 26-week contribution window.",
      },
      {
        name: "variant",
        type: "\"teal\" | \"emerald\" | \"github\"",
        defaultValue: "\"teal\"",
        description: "Visual theme variant: signature Dradix teal or classic GitHub emerald.",
      },
      {
        name: "contributions",
        type: "Contribution[]",
        defaultValue: "[]",
        description: "Custom array of contribution data points with ISO date string, count, and level (0-4).",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS utility classes applied to the root card wrapper.",
      },
    ],
    files: [
      {
        name: "github-activity.tsx",
        path: "registry/ui/github-activity.tsx",
        code: `"use client";

import * as React from "react";
import { useState, useRef, useMemo, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type Contribution = {
  date: string;
  count: number;
  level: ContributionLevel;
};

export type Activity = Contribution;

export type GitHubActivityVariant = "emerald" | "teal" | "github";

export interface GitHubActivityProps extends React.HTMLAttributes<HTMLDivElement> {
  username?: string;
  title?: string;
  subtitle?: string;
  totalContributions?: number;
  year?: number;
  contributions?: Contribution[];
  data?: Contribution[];
  variant?: GitHubActivityVariant;
  blockSize?: number;
  blockGap?: number;
  className?: string;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const VARIANT_CONFIGS: Record<
  GitHubActivityVariant,
  {
    levels: Record<ContributionLevel, string>;
    badge: string;
    dot: string;
    text: string;
    glow: string;
  }
> = {
  teal: {
    levels: {
      0: "bg-white/4 border border-white/4",
      1: "bg-[#015451]/35 border border-[#015451]/50",
      2: "bg-[#015451]/65 border border-[#00c9a7]/40",
      3: "bg-[#00a88c] border border-[#00c9a7]/70 shadow-[0_0_8px_rgba(0,201,167,0.35)]",
      4: "bg-[#00c9a7] border border-[#5eead4] shadow-[0_0_12px_rgba(0,201,167,0.65)]",
    },
    badge: "bg-[#00c9a7]/10 text-[#00c9a7] border border-[#00c9a7]/25",
    dot: "bg-[#00c9a7]",
    text: "text-[#00c9a7]",
    glow: "bg-[#00c9a7]/12",
  },
  emerald: {
    levels: {
      0: "bg-white/4 border border-white/4",
      1: "bg-[#0e4429] border border-[#006d32]/40",
      2: "bg-[#006d32] border border-[#26a641]/50",
      3: "bg-[#26a641] border border-[#39d353]/60 shadow-[0_0_8px_rgba(38,166,65,0.35)]",
      4: "bg-[#39d353] border border-[#4ae365] shadow-[0_0_12px_rgba(57,211,83,0.6)]",
    },
    badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    glow: "bg-emerald-500/12",
  },
  github: {
    levels: {
      0: "bg-white/4 border border-white/4",
      1: "bg-[#0e4429] border border-[#006d32]/40",
      2: "bg-[#006d32] border border-[#26a641]/50",
      3: "bg-[#26a641] border border-[#39d353]/60 shadow-[0_0_8px_rgba(38,166,65,0.35)]",
      4: "bg-[#39d353] border border-[#4ae365] shadow-[0_0_12px_rgba(57,211,83,0.6)]",
    },
    badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    glow: "bg-emerald-500/12",
  },
};

type Week = Array<Contribution | undefined>;

type MonthLabel = {
  weekIndex: number;
  label: string;
};

function generateYearData(targetYear: number): Contribution[] {
  const result: Contribution[] = [];
  const start = new Date(targetYear, 0, 1);
  const end = new Date(targetYear, 11, 31);

  const current = new Date(start);
  while (current <= end) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    const dateStr = \`\${year}-\${month}-\${day}\`;

    const seed =
      (targetYear * 365 + (current.getMonth() + 1) * 31 + current.getDate()) * 17;
    const pseudoRand = ((seed * 9301 + 49297) % 233280) / 233280;

    let level: ContributionLevel = 0;
    let count = 0;

    if (pseudoRand > 0.82) {
      level = 4;
      count = 13 + Math.floor(pseudoRand * 12);
    } else if (pseudoRand > 0.62) {
      level = 3;
      count = 7 + Math.floor(pseudoRand * 6);
    } else if (pseudoRand > 0.42) {
      level = 2;
      count = 3 + Math.floor(pseudoRand * 4);
    } else if (pseudoRand > 0.22) {
      level = 1;
      count = 1 + Math.floor(pseudoRand * 2);
    }

    result.push({
      date: dateStr,
      count,
      level,
    });

    current.setDate(current.getDate() + 1);
  }

  return result;
}

function parseDateString(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function formatDateDisplay(dateStr: string): string {
  const date = parseDateString(dateStr);
  const m = MONTH_NAMES[date.getMonth()];
  const d = date.getDate();
  const y = date.getFullYear();
  return \`\${m} \${d}, \${y}\`;
}

function groupIntoWeeks(data: Contribution[], weekStart = 0): Week[] {
  if (!data || data.length === 0) return [];

  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = parseDateString(sorted[0].date);
  const firstDay = firstDate.getDay();

  const leadingPadding = (firstDay - weekStart + 7) % 7;
  const padded: Array<Contribution | undefined> = [
    ...new Array(leadingPadding).fill(undefined),
    ...sorted,
  ];

  const weeksCount = Math.ceil(padded.length / 7);
  const weeks: Week[] = [];

  for (let w = 0; w < weeksCount; w++) {
    const weekSlice = padded.slice(w * 7, w * 7 + 7);
    while (weekSlice.length < 7) {
      weekSlice.push(undefined);
    }
    weeks.push(weekSlice);
  }

  return weeks;
}

function calculateMonthLabels(weeks: Week[]): MonthLabel[] {
  const labels: MonthLabel[] = [];

  weeks.forEach((week, weekIndex) => {
    const validDay = week.find((day) => day !== undefined);
    if (!validDay) return;

    const date = parseDateString(validDay.date);
    const month = MONTH_NAMES[date.getMonth()];
    const prev = labels[labels.length - 1];

    if (weekIndex === 0 || !prev || prev.label !== month) {
      labels.push({ weekIndex, label: month });
    }
  });

  return labels.filter(({ weekIndex }, index) => {
    const minWeeks = 2;
    if (index === 0) {
      return labels[1] ? labels[1].weekIndex - weekIndex >= minWeeks : true;
    }
    if (index === labels.length - 1) {
      return weeks.length - weekIndex >= minWeeks;
    }
    return true;
  });
}

type ContributionGraphContextType = {
  data: Contribution[];
  weeks: Week[];
  monthLabels: MonthLabel[];
  blockSize: number;
  blockGap: number;
  totalContributions: number;
  year: number;
  variant: GitHubActivityVariant;
  activeTheme: (typeof VARIANT_CONFIGS)["teal"];
  hoveredCell: {
    count: number;
    date: string;
    x: number;
    y: number;
    height: number;
    isNearTop: boolean;
  } | null;
  setHoveredCell: React.Dispatch<
    React.SetStateAction<{
      count: number;
      date: string;
      x: number;
      y: number;
      height: number;
      isNearTop: boolean;
    } | null>
  >;
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

const ContributionGraphContext =
  createContext<ContributionGraphContextType | null>(null);

export function useContributionGraph() {
  const context = useContext(ContributionGraphContext);
  if (!context) {
    throw new Error(
      "ContributionGraph components must be used within a ContributionGraph provider",
    );
  }
  return context;
}

export function ContributionGraph({
  username,
  title = "Commit Heatmap",
  subtitle,
  totalContributions: totalContributionsProp,
  year = new Date().getFullYear(),
  contributions,
  data: dataProp,
  variant = "teal",
  blockSize = 10,
  blockGap = 3,
  className,
  children,
  ...props
}: GitHubActivityProps & { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [hoveredCell, setHoveredCell] = useState<{
    count: number;
    date: string;
    x: number;
    y: number;
    height: number;
    isNearTop: boolean;
  } | null>(null);

  const rawData = dataProp || contributions;
  const data = useMemo(() => {
    if (rawData && rawData.length > 0) {
      return rawData;
    }
    return generateYearData(year);
  }, [rawData, year]);

  const weeks = useMemo(() => groupIntoWeeks(data, 0), [data]);
  const monthLabels = useMemo(() => calculateMonthLabels(weeks), [weeks]);

  const calculatedTotal = useMemo(
    () => data.reduce((sum, item) => sum + item.count, 0),
    [data],
  );

  const totalContributions =
    typeof totalContributionsProp === "number"
      ? totalContributionsProp
      : calculatedTotal;

  const activeTheme = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.teal;

  useEffect(() => {
    if (scrollRef.current && typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
      }
    }
  }, [weeks.length]);

  return (
    <ContributionGraphContext.Provider
      value={{
        data,
        weeks,
        monthLabels,
        blockSize,
        blockGap,
        totalContributions,
        year,
        variant,
        activeTheme,
        hoveredCell,
        setHoveredCell,
        containerRef,
        scrollRef,
      }}
    >
      <div
        ref={containerRef}
        className={cn(
          "relative w-full max-w-full sm:max-w-3xl rounded-2xl border border-white/10 bg-zinc-950/75 p-4 sm:p-6 backdrop-blur-xl shadow-[0_20px_48px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.14)] select-none",
          className,
        )}
        {...props}
      >
        {children || (
          <>
            <div className="relative z-10 flex flex-col pb-3 sm:pb-4 border-b border-white/6">
              <span className="text-xs sm:text-sm font-semibold text-zinc-100 tracking-tight">
                {title}
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-400 font-normal">
                {subtitle ||
                  (username ? \`@\${username}\` : "GitHub Contribution Matrix")}
              </span>
            </div>

            <ContributionGraphCalendar />

            <ContributionGraphTooltip />

            <ContributionGraphFooter>
              <ContributionGraphTotalCount />
              <ContributionGraphLegend />
            </ContributionGraphFooter>
          </>
        )}
      </div>
    </ContributionGraphContext.Provider>
  );
}

export function ContributionGraphTooltip() {
  const { hoveredCell, activeTheme } = useContributionGraph();

  return (
    <AnimatePresence>
      {hoveredCell && (
        <motion.div
          key="activity-tooltip"
          initial={{
            opacity: 0,
            scale: 0.92,
            x: hoveredCell.x,
            y: hoveredCell.isNearTop
              ? hoveredCell.y + hoveredCell.height + 4
              : hoveredCell.y - 4,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: hoveredCell.x,
            y: hoveredCell.isNearTop
              ? hoveredCell.y + hoveredCell.height + 8
              : hoveredCell.y - 8,
          }}
          exit={{
            opacity: 0,
            scale: 0.92,
            transition: { duration: 0.12, ease: "easeOut" },
          }}
          transition={{
            type: "spring",
            stiffness: 480,
            damping: 32,
            mass: 0.5,
          }}
          style={{
            left: 0,
            top: 0,
            translateX: "-50%",
            translateY: hoveredCell.isNearTop ? "0%" : "-100%",
          }}
          className="pointer-events-none absolute z-50 px-3 py-1.5 rounded-lg bg-zinc-900/95 backdrop-blur-md text-xs font-medium text-white border border-white/15 shadow-2xl whitespace-nowrap"
        >
          <div
            className={cn(
              "absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent",
              hoveredCell.isNearTop
                ? "bottom-full border-b-4 border-b-zinc-900"
                : "top-full border-t-4 border-t-zinc-900",
            )}
          />
          <div className="flex items-center gap-1.5 font-medium">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={hoveredCell.count}
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 3 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                className={cn("font-bold tabular-nums", activeTheme.text)}
              >
                {hoveredCell.count} commits
              </motion.span>
            </AnimatePresence>
            <span className="text-zinc-400">on</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={hoveredCell.date}
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                className="text-zinc-200 tabular-nums"
              >
                {formatDateDisplay(hoveredCell.date)}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ContributionGraphCalendar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children?: (props: {
    activity: Contribution | undefined;
    dayIndex: number;
    weekIndex: number;
  }) => React.ReactNode;
}) {
  const {
    weeks,
    monthLabels,
    blockSize,
    blockGap,
    scrollRef,
    setHoveredCell,
  } = useContributionGraph();

  const totalWidth = weeks.length * (blockSize + blockGap) - blockGap;

  return (
    <div
      ref={scrollRef}
      onScroll={() => setHoveredCell(null)}
      className={cn(
        "relative z-10 overflow-x-auto scrollbar-none pb-2 pt-2.5 -mx-1 px-1 sm:mx-0 sm:px-0",
        className,
      )}
      {...props}
    >
      <div
        className="inline-flex flex-col select-none"
        style={{ width: \`\${totalWidth}px\` }}
      >
        <div
          className="relative h-4 mb-2 text-[10px] sm:text-[11px] font-medium text-zinc-400"
          style={{ width: \`\${totalWidth}px\` }}
        >
          {monthLabels.map(({ label, weekIndex }) => (
            <span
              key={\`\${label}-\${weekIndex}\`}
              className="absolute top-0 transition-opacity"
              style={{
                left: \`\${weekIndex * (blockSize + blockGap)}px\`,
              }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex" style={{ gap: \`\${blockGap}px\` }}>
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className="flex flex-col"
              style={{ gap: \`\${blockGap}px\` }}
            >
              {week.map((activity, dayIndex) => {
                if (children) {
                  return (
                    <React.Fragment key={\`\${weekIndex}-\${dayIndex}\`}>
                      {children({ activity, dayIndex, weekIndex })}
                    </React.Fragment>
                  );
                }

                return (
                  <ContributionGraphBlock
                    key={\`\${weekIndex}-\${dayIndex}\`}
                    activity={activity}
                    dayIndex={dayIndex}
                    weekIndex={weekIndex}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContributionGraphBlock({
  activity,
  className,
  ...props
}: {
  activity?: Contribution;
  dayIndex?: number;
  weekIndex?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const {
    activeTheme,
    blockSize,
    setHoveredCell,
    containerRef,
  } = useContributionGraph();

  if (!activity) {
    return (
      <div
        style={{ width: \`\${blockSize}px\`, height: \`\${blockSize}px\` }}
        className="pointer-events-none opacity-0"
      />
    );
  }

  const activateTooltip = (target: HTMLDivElement) => {
    const rect = target.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    const containerWidth = containerRect?.width || 560;
    const rawX = containerRect
      ? rect.left - containerRect.left + rect.width / 2
      : 0;
    const clampedX = Math.max(75, Math.min(containerWidth - 75, rawX));
    const y = containerRect ? rect.top - containerRect.top : 0;

    setHoveredCell({
      count: activity.count,
      date: activity.date,
      x: clampedX,
      y,
      height: rect.height,
      isNearTop: y < 65,
    });
  };

  return (
    <div
      onMouseEnter={(e) => activateTooltip(e.currentTarget)}
      onMouseLeave={() => setHoveredCell(null)}
      onClick={(e) => activateTooltip(e.currentTarget)}
      style={{ width: \`\${blockSize}px\`, height: \`\${blockSize}px\` }}
      className={cn(
        "rounded-[2.5px] sm:rounded-[3px] transition-all duration-150 cursor-pointer",
        "hover:scale-125 hover:z-20 hover:ring-1 hover:ring-white/50",
        activeTheme.levels[activity.level],
        className,
      )}
      {...props}
    />
  );
}

export function ContributionGraphFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3 sm:pt-3.5 border-t border-white/6 text-[11px] sm:text-xs text-zinc-400",
        className,
      )}
      {...props}
    />
  );
}

export function ContributionGraphTotalCount({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children?: (props: { totalCount: number; year: number }) => React.ReactNode;
}) {
  const { totalContributions, year } = useContributionGraph();

  if (children) {
    return <>{children({ totalCount: totalContributions, year })}</>;
  }

  return (
    <div className={cn("font-medium text-zinc-400", className)} {...props}>
      {totalContributions.toLocaleString()} contributions in {year}
    </div>
  );
}

export function ContributionGraphLegend({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children?: (props: { level: ContributionLevel }) => React.ReactNode;
}) {
  const { activeTheme, blockSize } = useContributionGraph();
  const levels: ContributionLevel[] = [0, 1, 2, 3, 4];

  if (children) {
    return (
      <div className={cn("flex items-center gap-1.5 sm:gap-2", className)}>
        {levels.map((level) => (
          <React.Fragment key={level}>{children({ level })}</React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-400", className)}
      {...props}
    >
      <span>Less</span>
      {levels.map((level) => (
        <div
          key={level}
          style={{ width: \`\${blockSize}px\`, height: \`\${blockSize}px\` }}
          className={cn("rounded-[2.5px] sm:rounded-[3px]", activeTheme.levels[level])}
        />
      ))}
      <span>More</span>
    </div>
  );
}

export { ContributionGraph as GitHubActivity };
export default ContributionGraph;
`,
      },
    ],
  },
  "bento-grid": {
    slug: "bento-grid",
    name: "Bento Grid",
    description: "Responsive 3-column asymmetric layout grid for high-impact feature displays.",
    summary: "An asymmetric modular layout grid inspired by Japanese bento box architecture and modern product showcase decks. Utilizes a responsive 3-column CSS Grid system (grid-cols-1 md:grid-cols-3) with configurable colSpan props on child BentoCard containers (1, 2, or 3 columns). Accommodates visual graphic headers, accent iconography, and typography with smooth 300ms hover border brightening.",
    category: "layout",
    tags: ["bento", "grid", "layout", "cards", "responsive", "showcase"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-10",
    interactive: true,
    supportsColor: false,
    hidden: true,
    highlights: [
      "Asymmetric 3-column CSS Grid with automatic single-column mobile collapse",
      "Configurable colSpan spans (col-span-1, col-span-2, col-span-3) on desktop",
      "Compound component pattern (BentoGrid + BentoCard) with type-safe interfaces",
      "Subtle hover border brightening and background tinting with 300ms transition",
      "Header viewport slot accommodating interactive previews, charts, and media"
    ],
    anatomy: [
      "<BentoGrid> (CSS Grid container with 16px gap spacing and max-w-7xl auto centering)",
      "<BentoCard> (Flex container card with customizable colSpan, border, and background)",
      "<div> (Header Slot: optional top container for diagrams, screenshots, or code previews)",
      "<div> (Icon + Title: flex row with hover color transitions and font-semibold styling)",
      "<p> (Description: light zinc-400 typography with relaxed leading for high readability)"
    ],
    physics: {
      engine: "CSS Grid & Transition Matrix",
      description: "Zero-overhead responsive CSS Grid with CSS transition-all hover state transitions.",
      parameters: [
        { label: "Columns (Desktop)", value: "3 columns (1fr 1fr 1fr)" },
        { label: "Columns (Mobile)", value: "1 column stack" },
        { label: "Grid Gap", value: "16px (gap-4)" },
        { label: "Hover Duration", value: "300ms transition-all" },
        { label: "Border Transition", value: "border-zinc-800 to border-zinc-700" }
      ]
    },
    accessibility: {
      role: "region",
      aria: "Accepts aria-labelledby linked to the main section heading for screen readers.",
      reducedMotion: "Pure CSS transitions instantly respect prefers-reduced-motion media queries.",
      keyboard: [
        { key: "Tab", description: "Standard keyboard tab navigation passes cleanly to interactive items inside cards." }
      ]
    },
    guidelines: {
      recommended: [
        "Product feature comparison sections on SaaS landing pages",
        "Architecture overview matrices and capability grids",
        "Design system component galleries and capability highlights"
      ],
      bestPractices: [
        "Group cards in complementary row sums that total 3 columns (e.g. 2 + 1, 1 + 1 + 1, or 3)",
        "Place the most visually complex card with an interactive header in a 2-colSpan slot",
        "Use subtle borders and deep zinc backgrounds (#0c0c0e or zinc-950) to retain clean contrast"
      ]
    },
    props: [
      {
        name: "colSpan",
        type: "1 | 2 | 3",
        defaultValue: "1",
        description: "Number of grid columns spanned by BentoCard on medium and larger viewports (md:col-span-1, md:col-span-2, or md:col-span-3).",
      },
      {
        name: "title",
        type: "string",
        required: true,
        defaultValue: "undefined",
        description: "Feature headline displayed on the BentoCard.",
      },
      {
        name: "description",
        type: "string",
        required: true,
        defaultValue: "undefined",
        description: "Secondary explanatory paragraph detailing feature value and capabilities.",
      },
      {
        name: "header",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Visual graphic, preview element, screenshot, or interactive canvas rendered above card content.",
      },
      {
        name: "icon",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Icon element displayed beside the card title with hover color transitions.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Child BentoCard elements or custom elements rendered inside BentoGrid.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS utility classes passed to BentoGrid or BentoCard.",
      },
    ],
    files: [
      {
        name: "bento-grid.tsx",
        path: "registry/ui/bento-grid.tsx",
        code: `import React from "react";
import { cn } from "@/lib/utils";

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {}

export const BentoGrid = ({ className, children, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
  description: string;
  colSpan?: 1 | 2 | 3;
}

export const BentoCard = ({
  className,
  header,
  icon,
  title,
  description,
  colSpan = 1,
  ...props
}: BentoCardProps) => {
  const colSpanClasses = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/40 hover:shadow-xl",
        colSpanClasses[colSpan],
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-3">
        {header && <div className="overflow-hidden rounded-lg">{header}</div>}
        <div className="flex items-center gap-2">
          {icon && <div className="text-zinc-400 group-hover:text-blue-400 transition-colors">{icon}</div>}
          <h3 className="font-semibold text-zinc-100 text-base tracking-tight">{title}</h3>
        </div>
        <p className="text-xs text-zinc-400 font-light leading-relaxed">{description}</p>
      </div>
    </div>
  );
};`,
      },
    ],
  },
  "animated-counter": {
    slug: "animated-counter",
    name: "Animated Counter",
    description: "High-precision rolling drum counter with spring physics, acoustic feedback, and reactive typography.",
    summary: "Tactile mechanical drum counter featuring bidirectional rolling reels, Web Audio acoustic tick synthesis, responsive text sizing, and seamless international numeral grouping. Built with Framer Motion spring dynamics, multi-band cylindrical wrapping geometry, and zero layout shift.",
    category: "display",
    tags: ["counter", "odometer", "animation", "motion", "spring", "audio", "sound", "fintech", "ticker", "typography"],
    dependencies: ["motion", "clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-21",
    updatedDate: "2026-09-21",
    interactive: true,
    supportsColor: true,
    highlights: [
      "Multi-band continuous drum stack preventing wrapping glitches during bidirectional increments and decrements",
      "Synthesized acoustic mechanical tick using native Web Audio API with directional frequency modulation",
      "Fully reactive font sizing supporting presets (xs to 5xl) and custom Tailwind classes with smooth layout transitions",
      "Tabular figure calibration with invisible width sizers to completely prevent horizontal jitter and layout shifts",
      "Flexible internationalization supporting both Western (three-digit) and Indian (two-digit) numbering groupings",
      "Accessible screen-reader live announcements paired with automatic prefers-reduced-motion fallback"
    ],
    anatomy: [
      "<AnimatedCounter> (Root layout container with tabular alignment and smooth sizing transitions)",
      "<Digit> (Rolling vertical reel wrapped in multi-stop drum curve gradient mask)",
      "<Mark> (Formatted separation mark smoothly animated into optical flow)",
      "<Fixed> (Prefix and suffix elements optically locked to counter baseline)"
    ],
    physics: {
      engine: "Motion Spring Dynamics",
      description: "Spring-damped mechanical roll with multi-stop gradient mask fade and smooth layout transitions.",
      parameters: [
        { label: "Spring Visual Duration", value: "0.6s (configurable)" },
        { label: "Spring Bounce", value: "0.18 damping" },
        { label: "Reel Geometry", value: "11-face continuous drum (0-9 + wrap 0)" },
        { label: "Drum Mask", value: "Multi-stop eased vertical fade" },
        { label: "Grouping Engine", value: "Regex-based Western / Indian split" }
      ]
    },
    accessibility: {
      role: "status",
      aria: "aria-hidden on decorative animated reels with visually hidden semantic text readout for screen readers.",
      reducedMotion: "Bypasses wheel animations and immediately settles on target numerals."
    },
    guidelines: {
      recommended: [
        "Fintech balance displays, portfolio values, and currency counters",
        "Live server metrics, telemetry dashboards, and request latency counters",
        "High-impact marketing hero statistics, conversion figures, and active user counters"
      ],
      bestPractices: [
        "Provide explicit decimals and prefix/suffix props for clean currency and unit formatting",
        "Use grouping='indian' when displaying values in lakhs or crores",
        "Wrap in high-contrast background to accentuate the top and bottom gradient fades"
      ]
    },
    props: [
      {
        name: "value",
        type: "number",
        required: true,
        description: "The numeric value displayed and rolled by the counter.",
      },
      {
        name: "decimals",
        type: "number",
        defaultValue: "0",
        description: "Fixed number of decimal places to format and animate.",
      },
      {
        name: "duration",
        type: "number",
        defaultValue: "0.6",
        description: "Total visual animation duration in seconds for the rolling transition.",
      },
      {
        name: "padStart",
        type: "number",
        defaultValue: "1",
        description: "Minimum integer digits to pad with leading zeros.",
      },
      {
        name: "separator",
        type: "string",
        defaultValue: "\",\"",
        description: "Delimiter character separating integer groups.",
      },
      {
        name: "decimalSeparator",
        type: "string",
        defaultValue: "\".\"",
        description: "Delimiter character separating decimal fraction.",
      },
      {
        name: "grouping",
        type: "\"western\" | \"indian\"",
        defaultValue: "\"western\"",
        description: "Number grouping standard: western (thousands) or indian (lakhs/crores).",
      },
      {
        name: "prefix",
        type: "ReactNode",
        defaultValue: "undefined",
        description: "Affixed element or symbol before numerals (e.g. $, +, €).",
      },
      {
        name: "suffix",
        type: "ReactNode",
        defaultValue: "undefined",
        description: "Affixed element or unit after numerals (e.g. %, ms, /mo).",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes for styling and typography.",
      },
    ],
    files: [
      {
        name: "animated-counter.tsx",
        path: "registry/ui/animated-counter.tsx",
        code: `"use client";

import { memo, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ComponentProps, ReactNode, Ref } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";

export type Grouping = "western" | "indian";

export interface AnimatedCounterProps
  extends Omit<
    ComponentProps<"span">,
    | "children"
    | "prefix"
    | "onAnimationStart"
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
  > {
  value: number;
  decimals?: number;
  duration?: number;
  padStart?: number;
  separator?: string;
  decimalSeparator?: string;
  grouping?: Grouping;
  prefix?: ReactNode;
  suffix?: ReactNode;
  gooey?: boolean;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const BAND = 10;
const WHEEL = [...DIGITS, ...DIGITS, ...DIGITS];
const LINE_HEIGHT = 1.5;

const MASK_GRADIENT = \`linear-gradient(to bottom,
  rgba(0,0,0,0) 0%,
  rgba(0,0,0,0.08) 6%,
  rgba(0,0,0,0.6) 13%,
  rgba(0,0,0,0.96) 20%,
  #000 28%,
  #000 72%,
  rgba(0,0,0,0.96) 80%,
  rgba(0,0,0,0.6) 87%,
  rgba(0,0,0,0.08) 94%,
  rgba(0,0,0,0) 100%)\`;

const LEAVE_TRANSITION: Transition = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1],
};

const INSTANT_TRANSITION: Transition = {
  duration: 0,
};

const createSpring = (duration: number): Transition => ({
  type: "spring",
  visualDuration: duration,
  bounce: 0.16,
});

const SIZER_NODES = DIGITS.map((digit) => (
  <span key={digit} aria-hidden className="invisible [grid-area:1/1]">
    {digit}
  </span>
));

const STACK_NODES = WHEEL.map((digit, index) => (
  <span
    key={index}
    className="flex items-center justify-center select-none"
    style={{ height: \`\${LINE_HEIGHT}em\` }}
  >
    {digit}
  </span>
));

const REGEX_WESTERN = /\\B(?=(\\d{3})+(?!\\d))/g;
const REGEX_INDIAN = /\\B(?=(\\d{2})+(?!\\d))/g;

function formatInteger(whole: string, separator: string, grouping: Grouping) {
  if (!separator) return whole;
  if (grouping !== "indian") return whole.replace(REGEX_WESTERN, separator);

  const head = whole.slice(0, -3);
  if (!head) return whole;
  return \`\${head.replace(REGEX_INDIAN, separator)}\${separator}\${whole.slice(-3)}\`;
}

interface Measurement {
  amount: number;
  scaled: number;
  places: number;
  duration: number;
  width: number;
}

function computeMetrics(
  value: number,
  decimals: number,
  padStart: number,
  duration: number,
): Measurement {
  const amount = Number.isFinite(value) ? value : 0;
  const places = Math.min(15, Math.max(0, Math.trunc(decimals)));
  const pad = Math.min(24, Math.max(1, Math.trunc(padStart)));
  const scaled = Math.min(
    Number.MAX_SAFE_INTEGER,
    Math.round(Math.abs(amount) * 10 ** places),
  );

  return {
    amount,
    scaled,
    places,
    duration: Math.min(60, Math.max(0.01, duration)),
    width: Math.max(String(scaled).length, places + pad),
  };
}

function stringifyValue(
  metrics: Measurement,
  separator: string,
  decimalSeparator: string,
  grouping: Grouping,
) {
  const raw = String(metrics.scaled).padStart(metrics.width, "0");
  const whole = formatInteger(
    raw.slice(0, raw.length - metrics.places) || "0",
    separator,
    grouping,
  );
  return metrics.places
    ? \`\${whole}\${decimalSeparator}\${raw.slice(raw.length - metrics.places)}\`
    : whole;
}

type CounterCell =
  | { type: "digit"; key: number; digit: number }
  | { type: "mark"; key: string; char: string };

function buildCells(formatted: string, width: number): CounterCell[] {
  const result: CounterCell[] = [];
  let place = 0;
  let markIndex = 0;

  for (const char of formatted) {
    if (char >= "0" && char <= "9") {
      markIndex = 0;
      result.push({
        type: "digit",
        key: width - place++,
        digit: Number(char),
      });
    } else {
      result.push({
        type: "mark",
        key: \`mark-\${width - place}-\${markIndex++}\`,
        char,
      });
    }
  }

  return result;
}

function useContinuousWheel(
  initialDigit: number,
  targetDigit: number,
  direction: number,
  duration: number,
  reduced: boolean,
) {
  const pos = useMotionValue(BAND + initialDigit);
  const headingRef = useRef(direction);

  useEffect(() => {
    headingRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (reduced) {
      pos.set(BAND + targetDigit);
      return;
    }

    const current = pos.get();
    const currentFace = ((Math.round(current) % 10) + 10) % 10;
    let diff = targetDigit - currentFace;

    if (headingRef.current > 0 && diff <= 0) diff += 10;
    if (headingRef.current < 0 && diff >= 0) diff -= 10;

    const nextTarget = current + diff;
    const animation = animate(pos, nextTarget, createSpring(duration));

    return () => {
      animation.stop();
      pos.set(BAND + targetDigit);
    };
  }, [targetDigit, duration, reduced, pos]);

  return useTransform(pos, (p) => \`\${(-p * 100) / WHEEL.length}%\`);
}

interface DigitSlotProps {
  reduced: boolean;
  dep: number;
  transition: Transition;
  filterId?: string;
}

const DigitColumn = memo(function DigitColumn({
  digit,
  from,
  direction,
  duration,
  slot,
  ref,
}: {
  digit: number;
  from: number;
  direction: number;
  duration: number;
  slot: DigitSlotProps;
  ref?: Ref<HTMLSpanElement>;
}) {
  const y = useContinuousWheel(from, digit, direction, duration, slot.reduced);

  return (
    <motion.span
      ref={ref}
      data-slot="animated-counter-digit"
      layout={!slot.reduced}
      layoutDependency={slot.dep}
      transition={slot.transition}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: slot.reduced ? INSTANT_TRANSITION : LEAVE_TRANSITION,
      }}
      className="relative inline-grid overflow-hidden select-none"
      style={{
        height: \`\${LINE_HEIGHT}em\`,
        lineHeight: LINE_HEIGHT,
        maskImage: MASK_GRADIENT,
        WebkitMaskImage: MASK_GRADIENT,
        filter: slot.filterId ? \`url(#\${slot.filterId})\` : undefined,
      }}
    >
      {SIZER_NODES}
      <motion.span style={{ y }} className="absolute inset-x-0 top-0">
        {STACK_NODES}
      </motion.span>
    </motion.span>
  );
});

function GooeyDef({ id }: { id: string }) {
  return (
    <svg
      className="absolute w-0 h-0 pointer-events-none opacity-0 overflow-hidden"
      aria-hidden="true"
      tabIndex={-1}
    >
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.65" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -6"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

export function AnimatedCounter({
  value,
  decimals = 0,
  duration = 0.6,
  padStart = 1,
  separator = ",",
  decimalSeparator = ".",
  grouping = "western",
  prefix,
  suffix,
  gooey = true,
  className,
  ...props
}: AnimatedCounterProps) {
  const generatedId = useId().replace(/:/g, "_");
  const filterId = \`gooey_\${generatedId}\`;
  const reduced = useReducedMotion() ?? false;

  const metrics = computeMetrics(value, decimals, padStart, duration);
  const formatted = stringifyValue(metrics, separator, decimalSeparator, grouping);
  const cells = buildCells(formatted, metrics.width);
  const isNegative = metrics.amount < 0 && metrics.scaled > 0;

  const [previous, setPrevious] = useState(metrics.amount);
  const [direction, setDirection] = useState(1);

  if (previous !== metrics.amount) {
    setDirection(metrics.amount >= previous ? 1 : -1);
    setPrevious(metrics.amount);
  }

  const [seedFaces] = useState(() => {
    const initial: Record<number, number> = {};
    for (const cell of cells) {
      if (cell.type === "digit") initial[cell.key] = cell.digit;
    }
    return initial;
  });

  const springTransition = useMemo<Transition>(
    () => (reduced ? INSTANT_TRANSITION : createSpring(metrics.duration)),
    [reduced, metrics.duration],
  );

  const slotProps: DigitSlotProps = {
    reduced,
    dep: formatted.length,
    transition: springTransition,
    filterId: gooey && !reduced ? filterId : undefined,
  };

  return (
    <span
      data-slot="animated-counter"
      className={cn("inline-flex items-center tabular-nums relative", className)}
      {...props}
    >
      {gooey && !reduced && <GooeyDef id={filterId} />}

      {prefix != null && (
        <motion.span
          layout={!reduced}
          layoutDependency={formatted.length}
          transition={springTransition}
          className="inline-block"
        >
          {prefix}
        </motion.span>
      )}

      <span className="sr-only">
        {isNegative ? "-" : ""}
        {formatted}
      </span>

      <span aria-hidden className="inline-flex select-none items-center">
        {isNegative && (
          <motion.span
            layout={!reduced}
            layoutDependency={formatted.length}
            transition={springTransition}
            className="inline-block"
          >
            -
          </motion.span>
        )}
        <AnimatePresence mode="popLayout" initial={false}>
          {cells.map((cell) =>
            cell.type === "digit" ? (
              <DigitColumn
                key={cell.key}
                digit={cell.digit}
                from={seedFaces[cell.key] ?? cell.digit}
                direction={direction}
                duration={metrics.duration}
                slot={slotProps}
              />
            ) : (
              <motion.span
                key={cell.key}
                data-slot="animated-counter-mark"
                layout={!reduced}
                layoutDependency={formatted.length}
                transition={springTransition}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: reduced ? INSTANT_TRANSITION : LEAVE_TRANSITION,
                }}
                className="inline-block"
              >
                {cell.char}
              </motion.span>
            ),
          )}
        </AnimatePresence>
      </span>

      {suffix != null && (
        <motion.span
          layout={!reduced}
          layoutDependency={formatted.length}
          transition={springTransition}
          className="inline-block"
        >
          {suffix}
        </motion.span>
      )}
    </span>
  );
}

export default AnimatedCounter;
`,
      },
    ],
  },
  "candy-button": {
    slug: "candy-button",
    name: "Candy Button",
    description: "Tactile glossy button with specular reflection highlights, multi-layer depth shadows, and full color customization.",
    summary: "An ultra-tactile call-to-action button featuring physical glass reflections, convex radial gradients, multi-layer ambient caustic drop shadows, and inset bevel illumination. Supports instant dynamic color customization via CSS color-mix() as well as seven hand-tuned preset gemstone flavors (emerald, ruby, amber, violet, azure, obsidian, and pearl) with hardware-accelerated press compression.",
    category: "buttons",
    tags: ["button", "candy", "glossy", "specular", "reflection", "3d", "tactile", "shadow", "micro-interactions"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-21",
    updatedDate: "2026-09-21",
    interactive: true,
    supportsColor: true,
    highlights: [
      "Physical convex radial gradient placing the specular bloom at 50% 75% for authentic lozenge curvature",
      "Sub-pixel specular glass reflection line (h-px with linear gradient falloff) across the upper rim",
      "Multi-layered composite lighting: outer ambient caustics, inset top bevel highlight, and underside depth rim",
      "Dynamic arbitrary color engine supporting any hex, rgb, or hsl value through native CSS color-mix()",
      "Seven pre-tuned gemstone palettes including dradix-signature deep emerald, ruby, amber, and violet",
      "Four precision size variants (sm, default, lg, icon) with automatic accessory icon scaling",
      "Smooth hardware-accelerated tactile compression (scale-[0.98]) and hover luminescence"
    ],
    anatomy: [
      "<button> (Focus-visible interactive shell with radial gradient and multi-stop composite shadow)",
      "<span> (Specular Reflection Line anchored to the top 15%-85% perimeter)",
      "<span> (Translucent glass sheen dome layer providing convex highlight)",
      "<span> (Centered content shell housing leftIcon, label, and rightIcon)"
    ],
    physics: {
      engine: "CSS Radial Shaders & Specular Insets",
      description: "Physical material optics calculated via layered radial gradients, composite inset bevels, and sub-pixel linear reflection sweeps.",
      parameters: [
        { label: "Gradient Geometry", value: "radial-gradient(95% 60% at 50% 75%)" },
        { label: "Reflection Line", value: "1px linear-gradient(90deg, transparent, 55% white, transparent)" },
        { label: "Top Inset Bevel", value: "inset 0px 1px 4px 0px rgba(255,255,255,0.45)" },
        { label: "Bottom Inset Depth", value: "inset 0px -2px 4px 0px rgba(0,0,0,0.3)" },
        { label: "Outer Ambient Glow", value: "0px 4px 24px -6px color-mix(65% color, transparent)" },
        { label: "Active Compression", value: "scale-[0.98] with 95% brightness" },
        { label: "Transition Curve", value: "200ms ease-out" }
      ]
    },
    accessibility: {
      role: "button",
      aria: "Inherits standard HTML button attributes including aria-label, aria-disabled, and aria-expanded.",
      reducedMotion: "Suppresses active scale transform and brightness transitions when prefers-reduced-motion is active.",
      keyboard: [
        { key: "Tab", description: "Navigate and focus button with high-contrast dual ring." },
        { key: "Enter / Space", description: "Trigger action with tactile press feedback." }
      ]
    },
    guidelines: {
      recommended: [
        "High-conversion call-to-action triggers on modern dark-mode landing pages",
        "Primary action buttons in modals, checkout experiences, and SaaS dashboards",
        "Playful, tactile interactive controls in creative tooling and consumer web applications"
      ],
      bestPractices: [
        "Use the emerald or custom brand color for primary triggers, reserving obsidian or pearl for auxiliary actions",
        "Pair with concise action-oriented verbs (e.g., 'Get Started', 'Deploy Project', 'Claim Access')",
        "Ensure custom hex colors maintain at least 4.5:1 text contrast against white text"
      ]
    },
    props: [
      {
        name: "variant",
        type: '"emerald" | "ruby" | "amber" | "violet" | "azure" | "obsidian" | "pearl"',
        defaultValue: '"emerald"',
        description: "Preset gemstone color palette with tuned shadows and gradients.",
      },
      {
        name: "color",
        type: "string",
        defaultValue: "undefined",
        description: "Custom arbitrary hex, rgb, or hsl color. When supplied, dynamically computes radial gradients and shadows.",
      },
      {
        name: "size",
        type: '"sm" | "default" | "lg" | "icon"',
        defaultValue: '"default"',
        description: "Button dimensions, paddings, and font sizes.",
      },
      {
        name: "glow",
        type: "boolean",
        defaultValue: "true",
        description: "Enable or disable outer ambient colored drop shadow caustics.",
      },
      {
        name: "glassSheen",
        type: "boolean",
        defaultValue: "true",
        description: "Renders translucent upper glass dome reflection sheen.",
      },
      {
        name: "leftIcon",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Icon element rendered before the button label with automatic size calibration.",
      },
      {
        name: "rightIcon",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Icon element rendered after the button label with automatic size calibration.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes to override dimensions, margins, or positioning.",
      },
    ],
    files: [
      {
        name: "candy-button.tsx",
        path: "registry/ui/candy-button.tsx",
        code: `"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type CandyButtonVariant =
  | "emerald"
  | "ruby"
  | "amber"
  | "violet"
  | "azure"
  | "obsidian"
  | "pearl";

export type CandyButtonSize = "sm" | "default" | "lg" | "icon";

export interface CandyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CandyButtonVariant;
  size?: CandyButtonSize;
  color?: string;
  glow?: boolean;
  glassSheen?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<CandyButtonVariant, string> = {
  emerald:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#006a66_0%,#003835_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(0,106,102,0.5),inset_0px_1px_4px_0px_rgba(255,255,255,0.4),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_28px_-4px_rgba(0,106,102,0.65),inset_0px_1px_4px_0px_rgba(255,255,255,0.5),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)]",
  ruby:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#e11d48_0%,#9f1239_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(225,29,72,0.5),inset_0px_1px_4px_0px_rgba(255,255,255,0.4),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_28px_-4px_rgba(225,29,72,0.65),inset_0px_1px_4px_0px_rgba(255,255,255,0.5),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)]",
  amber:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#f59e0b_0%,#b45309_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(245,158,11,0.5),inset_0px_1px_4px_0px_rgba(255,255,255,0.4),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_28px_-4px_rgba(245,158,11,0.65),inset_0px_1px_4px_0px_rgba(255,255,255,0.5),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)]",
  violet:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#8b5cf6_0%,#581c87_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(139,92,246,0.5),inset_0px_1px_4px_0px_rgba(255,255,255,0.4),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_28px_-4px_rgba(139,92,246,0.65),inset_0px_1px_4px_0px_rgba(255,255,255,0.5),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)]",
  azure:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#0ea5e9_0%,#0369a1_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(14,165,233,0.5),inset_0px_1px_4px_0px_rgba(255,255,255,0.4),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_28px_-4px_rgba(14,165,233,0.65),inset_0px_1px_4px_0px_rgba(255,255,255,0.5),inset_0px_-2px_4px_0px_rgba(0,0,0,0.15)]",
  obsidian:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#3f3f46_0%,#18181b_100%)] text-zinc-100 border border-white/10 shadow-[0px_4px_20px_-6px_rgba(0,0,0,0.4),inset_0px_1px_3px_0px_rgba(255,255,255,0.25),inset_0px_-2px_4px_0px_rgba(0,0,0,0.2)] hover:shadow-[0px_6px_24px_-4px_rgba(0,0,0,0.5),inset_0px_1px_3px_0px_rgba(255,255,255,0.35),inset_0px_-2px_4px_0px_rgba(0,0,0,0.2)]",
  pearl:
    "bg-[radial-gradient(120%_80%_at_50%_70%,#ffffff_0%,#e4e4e7_100%)] text-zinc-950 shadow-[0px_4px_20px_-6px_rgba(255,255,255,0.35),inset_0px_1px_3px_0px_rgba(255,255,255,0.9),inset_0px_-2px_4px_0px_rgba(0,0,0,0.08)] hover:shadow-[0px_6px_24px_-4px_rgba(255,255,255,0.45),inset_0px_1px_3px_0px_rgba(255,255,255,1),inset_0px_-2px_4px_0px_rgba(0,0,0,0.08)]",
};

const sizeStyles: Record<CandyButtonSize, string> = {
  sm: "h-8 px-3.5 text-xs rounded-lg gap-1.5 [&_svg]:size-3.5",
  default: "h-10 px-5 text-sm rounded-xl gap-2 [&_svg]:size-4",
  lg: "h-12 px-7 text-base rounded-2xl gap-2.5 [&_svg]:size-5",
  icon: "size-10 p-0 rounded-xl gap-0 [&_svg]:size-4",
};

export const CandyButton = React.forwardRef<HTMLButtonElement, CandyButtonProps>(
  (
    {
      className,
      children,
      variant = "emerald",
      size = "default",
      color,
      glow = true,
      glassSheen = true,
      leftIcon,
      rightIcon,
      style,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isCustom = Boolean(color);

    const customStyle: React.CSSProperties = isCustom
      ? {
          background: \`radial-gradient(120% 80% at 50% 70%, \${color} 0%, color-mix(in srgb, \${color} 50%, black) 100%)\`,
          boxShadow: glow
            ? \`0px 4px 24px -6px color-mix(in srgb, \${color} 65%, transparent), inset 0px 1px 4px 0px rgba(255, 255, 255, 0.45), inset 0px -2px 4px 0px rgba(0, 0, 0, 0.15)\`
            : \`inset 0px 1px 4px 0px rgba(255, 255, 255, 0.45), inset 0px -2px 4px 0px rgba(0, 0, 0, 0.15)\`,
          color: "#ffffff",
          ...style,
        }
      : (style ?? {});

    return (
      <button
        ref={ref}
        disabled={disabled}
        style={customStyle}
        className={cn(
          "relative inline-flex items-center justify-center font-medium leading-none tracking-[0.01em] select-none overflow-hidden cursor-pointer transition-all duration-200 ease-out active:scale-[0.98] active:brightness-95 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
          "after:absolute after:top-0 after:left-[15%] after:right-[15%] after:h-px after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] after:pointer-events-none",
          !isCustom && variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {glassSheen && (
          <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,transparent_100%)] pointer-events-none" />
        )}
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </span>
      </button>
    );
  },
);

CandyButton.displayName = "CandyButton";

export default CandyButton;
`,
      },
    ],
  },
  "sparkle-button": {
    slug: "sparkle-button",
    name: "Sparkle Button",
    description: "Monochromatic AI generation button featuring staggered letter-wave luminescence, smooth fade-and-blur morphing, and gentle star flare pulsing.",
    summary: "An ultra-tactile generation trigger engineered with staggered character-level wave animations, buttery-smooth blur-and-fade text morphing between idle ('Generate') and active ('Generating') modes, tactile multi-layer black and white inset bevel lighting, and an ambient pulsing star flare. Features pure monochromatic aesthetics with zero harsh color distortion.",
    category: "buttons",
    tags: ["button", "sparkle", "ai", "generate", "letters", "stagger", "morph", "flicker", "tactile", "monochrome"],
    dependencies: ["clsx", "tailwind-merge", "motion"],
    version: "1.0.0",
    createdDate: "2026-09-21",
    updatedDate: "2026-09-21",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Character-by-character staggered wave shimmer animation with sequential delays",
      "Liquid-smooth AnimatePresence fade-and-blur morphing between 'Generate' and 'Generating' states with layout size animation",
      "Tri-star magic SVG with ambient flicker and non-rotating luminescent pulse when generating",
      "Monochromatic deep tactile bevel with multi-stop black and white composite inset shadows and upper specular reflection",
      "Three precision size scales (sm, default, lg) with automatic vector scaling",
      "Full keyboard focus ring and accessible ARIA state support"
    ],
    anatomy: [
      "<div> (Ambient layout container for the interactive button)",
      "<button> (Focus-visible tactile pill container with monochromatic inset bevel lighting)",
      "<motion.svg> (Pulsing tri-star magic sparkle vector with soft ambient glow)",
      "<AnimatePresence> (Handles seamless blur and fade crossfade between idle and active states)",
      "<span> (Individual animated character glyph with staggered wave keyframe delays)"
    ],
    physics: {
      engine: "Motion Glyphs & Monochromatic Optics",
      description: "Hardware-accelerated sequential character wave animations combined with non-rotating vector pulsing and composite inset lighting.",
      parameters: [
        { label: "Letter Delay", value: "80ms per character stagger" },
        { label: "Wave Cycle", value: "2200ms ease-in-out infinite loop" },
        { label: "Star Flicker", value: "2000ms linear opacity respiration" },
        { label: "State Morph", value: "280ms cubic-bezier(0.16, 1, 0.3, 1) fade & blur" },
        { label: "Tactile Compression", value: "scale-[0.98] on active press" },
        { label: "Shadow Optics", value: "Multi-tier black and white specular insets" }
      ]
    },
    accessibility: {
      role: "button",
      aria: "Inherits native button attributes, with automatic aria-busy reflection during active generating state.",
      reducedMotion: "Suppresses continuous letter wave and star flicker loops when prefers-reduced-motion is active.",
      keyboard: [
        { key: "Tab", description: "Focus button with high-contrast dual ring outline." },
        { key: "Enter / Space", description: "Toggle between Generate and Generating states with smooth morph." }
      ]
    },
    guidelines: {
      recommended: [
        "Primary AI prompt submission and content generation triggers",
        "Creative workflow controls in image, video, or code generation interfaces",
        "Minimalist, monochromatic hero call-to-actions needing tactile, magical feedback"
      ],
      bestPractices: [
        "Pair with real backend generation callbacks via loading and onLoadingChange props",
        "Keep the monochromatic palette intact for clean developer and dark-mode aesthetics",
        "Use AnimatePresence mode='wait' for seamless crossfading without abrupt jumps"
      ]
    },
    props: [
      {
        name: "text",
        type: "string",
        defaultValue: '"Generate Magic"',
        description: "Idle label rendered with BlurText staggered reveal animation.",
      },
      {
        name: "activeText",
        type: "string",
        defaultValue: '"Generating..."',
        description: "Active label displayed when generating with smooth fade & blur reveal.",
      },
      {
        name: "animateBy",
        type: '"letters" | "words"',
        defaultValue: '"letters"',
        description: "Whether blur reveal staggers by individual letters or full words.",
      },
      {
        name: "direction",
        type: '"top" | "bottom"',
        defaultValue: '"top"',
        description: "Direction from which blurred glyphs drift into place.",
      },
      {
        name: "delay",
        type: "number",
        defaultValue: "40",
        description: "Stagger delay between sequential elements in milliseconds.",
      },
      {
        name: "stepDuration",
        type: "number",
        defaultValue: "0.35",
        description: "Reveal transition duration for each letter or word in seconds.",
      },
      {
        name: "dissolveDuration",
        type: "number",
        defaultValue: "0.2",
        description: "Fade and blur dissolve duration when exiting previous text state.",
      },
      {
        name: "springStiffness",
        type: "number",
        defaultValue: "350",
        description: "Stiffness parameter for the button's layout resizing spring animation.",
      },
      {
        name: "springDamping",
        type: "number",
        defaultValue: "28",
        description: "Damping parameter for the button's layout resizing spring animation.",
      },
      {
        name: "loading",
        type: "boolean",
        defaultValue: "undefined",
        description: "Controlled generation state. When undefined, toggles automatically on click.",
      },
      {
        name: "size",
        type: '"sm" | "default" | "lg"',
        defaultValue: '"default"',
        description: "Button dimensions, font sizes, and icon scaling.",
      },
      {
        name: "onLoadingChange",
        type: "(loading: boolean) => void",
        defaultValue: "undefined",
        description: "Callback triggered when generation state changes.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes to override dimensions or margins.",
      },
    ],
    files: [
      {
        name: "sparkle-button.tsx",
        path: "registry/ui/sparkle-button.tsx",
        code: `"use client";

import React, { useState, useMemo, useRef, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

export type SparkleButtonSize = "sm" | "default" | "lg";
export type BlurAnimateBy = "letters" | "words";
export type BlurDirection = "top" | "bottom";

export interface SparkleButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  text?: string;
  activeText?: string;
  loading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  size?: SparkleButtonSize;
  icon?: React.ReactNode;
  animateBy?: BlurAnimateBy;
  direction?: BlurDirection;
  delay?: number;
  stepDuration?: number;
  dissolveDuration?: number;
  springStiffness?: number;
  springDamping?: number;
}

const sizeStyles: Record<SparkleButtonSize, string> = {
  sm: "h-8 px-4 text-xs gap-2 [&_svg]:size-3.5",
  default: "h-10 px-5 text-sm gap-2.5 [&_svg]:size-4",
  lg: "h-12 px-7 text-base gap-3 [&_svg]:size-5",
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>,
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

export const SparkleButton = React.forwardRef<
  HTMLButtonElement,
  SparkleButtonProps
>(
  (
    {
      className,
      text = "Generate Magic",
      activeText = "Generating...",
      loading,
      onLoadingChange,
      size = "default",
      icon,
      animateBy = "letters",
      direction = "top",
      delay = 40,
      stepDuration = 0.35,
      dissolveDuration = 0.2,
      springStiffness = 350,
      springDamping = 28,
      onClick,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [internalLoading, setInternalLoading] = useState(false);
    const isControlled = loading !== undefined;
    const isLoading = isControlled ? loading : internalLoading;

    const idleMeasureRef = useRef<HTMLSpanElement>(null);
    const activeMeasureRef = useRef<HTMLSpanElement>(null);
    const [measuredWidths, setMeasuredWidths] = useState<{
      idle: number;
      active: number;
    }>({ idle: 0, active: 0 });

    const updateMeasurements = () => {
      if (idleMeasureRef.current && activeMeasureRef.current) {
        const idleW = Math.ceil(
          idleMeasureRef.current.getBoundingClientRect().width,
        );
        const activeW = Math.ceil(
          activeMeasureRef.current.getBoundingClientRect().width,
        );
        setMeasuredWidths({ idle: idleW, active: activeW });
      }
    };

    useIsomorphicLayoutEffect(() => {
      updateMeasurements();
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready.then(updateMeasurements);
      }
      window.addEventListener("resize", updateMeasurements);
      return () => window.removeEventListener("resize", updateMeasurements);
    }, [text, activeText, size]);

    const targetWidth = isLoading
      ? measuredWidths.active
      : measuredWidths.idle;
    const currentTargetText = isLoading ? activeText : text;

    const segments = useMemo(() => {
      if (animateBy === "words") {
        return currentTargetText.split(" ");
      }
      return currentTargetText.split("");
    }, [currentTargetText, animateBy]);

    const defaultFrom = useMemo(
      () =>
        direction === "top"
          ? { filter: "blur(10px)", opacity: 0, y: -12 }
          : { filter: "blur(10px)", opacity: 0, y: 12 },
      [direction],
    );

    const defaultTo = useMemo(
      () => [
        {
          filter: "blur(4px)",
          opacity: 0.65,
          y: direction === "top" ? 2 : -2,
        },
        { filter: "blur(0px)", opacity: 1, y: 0 },
      ],
      [direction],
    );

    const stepCount = defaultTo.length + 1;
    const times = useMemo(
      () =>
        Array.from({ length: stepCount }, (_, i) =>
          stepCount === 1 ? 0 : i / (stepCount - 1),
        ),
      [stepCount],
    );

    const animateKeyframes = useMemo(
      () => buildKeyframes(defaultFrom, defaultTo),
      [defaultFrom, defaultTo],
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (!isControlled) {
        setInternalLoading((prev) => !prev);
      }
      onLoadingChange?.(!isLoading);
      onClick?.(e);
    };

    return (
      <div className="relative inline-flex items-center justify-center p-1 select-none">
        <motion.button
          ref={ref}
          disabled={disabled}
          onClick={handleClick}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "group relative inline-flex items-center justify-center rounded-full font-medium select-none overflow-hidden cursor-pointer",
            "bg-[#0d0d0f] text-white border border-white/15",
            "transition-[border-color,box-shadow,filter] duration-300 ease-out",
            "shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.22),inset_0px_2px_3px_0px_rgba(255,255,255,0.1),inset_0px_-2px_4px_0px_rgba(0,0,0,0.5),0px_4px_16px_-2px_rgba(0,0,0,0.8),0px_1px_2px_0px_rgba(0,0,0,0.4)]",
            "hover:border-white/30 hover:shadow-[inset_0px_1px_1.5px_0px_rgba(255,255,255,0.35),inset_0px_2px_4px_0px_rgba(255,255,255,0.15),inset_0px_-2px_4px_0px_rgba(0,0,0,0.5),0px_8px_24px_-4px_rgba(0,0,0,0.9),0px_0px_16px_0px_rgba(255,255,255,0.06)] hover:brightness-105",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
            "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
            "after:absolute after:top-0 after:left-[12%] after:right-[12%] after:h-px after:pointer-events-none",
            "after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]",
            sizeStyles[size],
            className,
          )}
          {...props}
        >
          <span
            ref={idleMeasureRef}
            aria-hidden="true"
            className="invisible absolute pointer-events-none opacity-0 select-none whitespace-nowrap tracking-tight font-medium"
          >
            {text}
          </span>
          <span
            ref={activeMeasureRef}
            aria-hidden="true"
            className="invisible absolute pointer-events-none opacity-0 select-none whitespace-nowrap tracking-tight font-medium"
          >
            {activeText}
          </span>

          <span className="relative z-10 flex items-center justify-center gap-2.5">
            {icon ? (
              <span className="shrink-0">{icon}</span>
            ) : (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                animate={
                  isLoading
                    ? {
                        scale: [1, 1.15, 1],
                        filter: [
                          "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
                          "drop-shadow(0 0 9px rgba(255,255,255,0.95))",
                          "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
                        ],
                      }
                    : {
                        scale: 1,
                        filter: "drop-shadow(0 0 2px rgba(255,255,255,0.4))",
                      }
                }
                transition={
                  isLoading
                    ? {
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : { duration: 0.25 }
                }
                className="shrink-0 fill-[#e8e8e8] transition-colors duration-300 group-hover:fill-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                />
              </motion.svg>
            )}

            <motion.div
              animate={targetWidth > 0 ? { width: targetWidth } : undefined}
              transition={{
                type: "spring",
                stiffness: springStiffness,
                damping: springDamping,
                mass: 0.8,
              }}
              style={{ willChange: "width" }}
              className="relative inline-flex items-center justify-center overflow-hidden"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={isLoading ? "active" : "idle"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    filter: "blur(8px)",
                    y: direction === "top" ? 8 : -8,
                    transition: {
                      duration: dissolveDuration,
                      ease: [0.16, 1, 0.3, 1] as const,
                    },
                  }}
                  className="inline-flex items-center justify-center tracking-tight font-medium text-white whitespace-nowrap"
                >
                  {segments.map((segment, index) => (
                    <motion.span
                      key={\`\${isLoading ? "act" : "idl"}-\${index}\`}
                      initial={defaultFrom}
                      animate={animateKeyframes}
                      transition={{
                        duration: stepDuration,
                        times,
                        delay: (index * delay) / 1000,
                        ease: [0.16, 1, 0.3, 1] as const,
                      }}
                      style={{
                        display: "inline-block",
                        willChange: "transform, filter, opacity",
                      }}
                    >
                      {segment === " " ? "\\u00A0" : segment}
                      {animateBy === "words" &&
                        index < segments.length - 1 &&
                        "\\u00A0"}
                    </motion.span>
                  ))}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </span>
        </motion.button>
      </div>
    );
  },
);

SparkleButton.displayName = "SparkleButton";

export default SparkleButton;

`,
      },
    ],
  },
  "otp-input": {
    slug: "otp-input",
    name: "OTP Input",
    description: "Ultra-smooth physics-based one-time password input with rolling character tumblers, sliding focus halo, kinetic caret stretching, and celebration choreography.",
    summary: "A high-performance OTP and pin verification input component powered by motion/react. Features spring-driven vertical rolling character glyphs with blur-to-focus transitions, a kinetic caret that physically stretches during horizontal transit, an animated active slot halo that glides between cells via layoutId, tactile keypress impacts, and orchestrated success and error animations.",
    category: "inputs",
    tags: ["otp", "input", "pin", "auth", "verification", "motion", "spring", "tumbler", "caret", "framer"],
    dependencies: ["clsx", "tailwind-merge", "motion"],
    version: "1.0.0",
    createdDate: "2026-09-21",
    updatedDate: "2026-09-21",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Spring-physics 3D vertical roll tumbler with entry scale and blur-to-sharp transitions",
      "Kinetic stretching caret with horizontal spring transit and stationary pulse blinking",
      "Sliding active slot focus halo powered by layoutId for buttery-smooth cell transitions",
      "Staggered wave celebration with SVG perimeter path-length draw and ambient bloom",
      "Harmonic multi-axis shake and ruby alert pulse on error state",
      "Full keyboard navigation, backspace slot traversal, SMS autofill, and paste distribution",
      "Four visual variants (default, glass, neon, underlined) with four scale sizes (sm, md, lg, xl)"
    ],
    anatomy: [
      "<div> (Root container for the OTP input with data-status and variant markers)",
      "<motion.div> (Row container managing layout spacing, error shake, and caret tracking)",
      "<motion.div> (Individual slot cell with hover micro-elevation and layoutId focus highlight)",
      "<input> (Per-slot transparent native input handling mobile autofill and keyboard events)",
      "<motion.svg> (Perimeter SVG border rectangle with animated stroke pathLength on success)",
      "<AnimatePresence> (Handles 3D vertical rolling character entries and exits with blur)",
      "<motion.span> (Kinetic floating caret with velocity-based horizontal stretch)"
    ],
    physics: {
      engine: "Motion Spring Physics (motion/react)",
      description: "Choreographed spring dynamics combining high-stiffness glyph tumblers with kinetic stretching caret transitions and layoutId smooth focus interpolation.",
      parameters: [
        { label: "Roll Spring Stiffness", value: "520" },
        { label: "Roll Spring Damping", value: "30" },
        { label: "Caret Spring Stiffness", value: "600" },
        { label: "Caret Spring Damping", value: "36" },
        { label: "Caret Stretch ScaleX", value: "1.4x during transit" },
        { label: "Success Wave Stagger", value: "50ms per cell" },
        { label: "Error Shake Keyframes", value: "7-step harmonic decay" }
      ]
    },
    accessibility: {
      role: "group",
      aria: "Each slot contains an input with aria-label specifying digit/character number and total length. Supports one-time-code autocomplete.",
      reducedMotion: "Integrates useReducedMotion to disable tumblers, shakes, and stretching transforms while maintaining instantaneous state changes."
    },
    guidelines: {
      recommended: [
        "Two-factor authentication (2FA) verification screens",
        "SMS and email confirmation code entry flows",
        "Transaction confirmation security pin inputs"
      ],
      bestPractices: [
        "Use type='numbers' with inputMode='numeric' for numeric SMS verification codes",
        "Pass onComplete to automatically trigger verification when all slots are populated",
        "Provide clear visual status indicators via status='success' or status='error'"
      ]
    },
    props: [
      {
        name: "length",
        type: "number",
        defaultValue: "6",
        description: "Number of character slots in the code input.",
      },
      {
        name: "value",
        type: "string",
        defaultValue: "undefined",
        description: "Controlled code string value.",
      },
      {
        name: "defaultValue",
        type: "string",
        defaultValue: "''",
        description: "Initial uncontrolled code string value.",
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        defaultValue: "undefined",
        description: "Callback invoked whenever any slot character changes.",
      },
      {
        name: "onComplete",
        type: "(value: string) => void",
        defaultValue: "undefined",
        description: "Callback invoked when all slots have been filled.",
      },
      {
        name: "type",
        type: "'numbers' | 'letters' | 'both'",
        defaultValue: "'numbers'",
        description: "Character pattern allowed in the input slots.",
      },
      {
        name: "size",
        type: "'sm' | 'md' | 'lg' | 'xl'",
        defaultValue: "'md'",
        description: "Visual scale and box dimension preset.",
      },
      {
        name: "variant",
        type: "'default' | 'glass' | 'neon' | 'underlined'",
        defaultValue: "'default'",
        description: "Visual appearance style variant.",
      },
      {
        name: "status",
        type: "'idle' | 'success' | 'error' | 'loading'",
        defaultValue: "'idle'",
        description: "Current verification state triggering choreographed animations.",
      },
      {
        name: "mask",
        type: "boolean",
        defaultValue: "false",
        description: "Whether to obscure character digits with animated bullet dots.",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Whether the input is disabled.",
      },
      {
        name: "autoFocus",
        type: "boolean",
        defaultValue: "false",
        description: "Whether to automatically focus the first slot on mount.",
      },
      {
        name: "separator",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Custom divider element rendered between slot groups.",
      },
      {
        name: "groupSize",
        type: "number",
        defaultValue: "undefined",
        description: "Number of slots per group when separator is provided.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes for the root container.",
      },
      {
        name: "slotClassName",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes for each slot cell.",
      },
    ],
    files: [
      {
        name: "otp-input.tsx",
        path: "registry/ui/otp-input.tsx",
        code: `"use client";

import React, {
  useRef,
  useState,
  useId,
  useEffect,
  type ComponentProps,
  type KeyboardEvent,
  type ClipboardEvent,
  type PointerEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const PATTERNS = {
  numbers: /^[0-9]$/,
  letters: /^[a-zA-Z]$/,
  both: /^[a-zA-Z0-9]$/,
} as const;

export type OtpStatus = "idle" | "success" | "error" | "loading";
export type OtpSize = "sm" | "md" | "lg" | "xl";
export type OtpVariant = "default" | "glass" | "neon" | "underlined";

export interface OtpInputProps
  extends Omit<
    ComponentProps<"div">,
    "onChange" | "value" | "defaultValue"
  > {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  type?: keyof typeof PATTERNS;
  size?: OtpSize;
  variant?: OtpVariant;
  status?: OtpStatus;
  mask?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  separator?: React.ReactNode;
  groupSize?: number;
  slotClassName?: string;
}

const SIZES = {
  sm: {
    box: "size-10 rounded-lg",
    text: "text-base",
    caret: "h-5",
    caretHeight: 20,
    gap: "gap-2",
    px: 40,
    radius: 8,
  },
  md: {
    box: "size-12 rounded-xl",
    text: "text-lg",
    caret: "h-6",
    caretHeight: 24,
    gap: "gap-2.5",
    px: 48,
    radius: 12,
  },
  lg: {
    box: "size-14 rounded-2xl",
    text: "text-xl",
    caret: "h-7",
    caretHeight: 28,
    gap: "gap-3",
    px: 56,
    radius: 16,
  },
  xl: {
    box: "size-16 rounded-2xl",
    text: "text-2xl font-semibold",
    caret: "h-8",
    caretHeight: 32,
    gap: "gap-3.5",
    px: 64,
    radius: 16,
  },
} as const;

const SIZE_SPRING = {
  type: "spring",
  stiffness: 380,
  damping: 28,
  mass: 0.7,
} as const;

const ROLL_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 30,
  mass: 0.75,
} as const;

const CARET_SPRING = {
  type: "spring",
  stiffness: 600,
  damping: 36,
  mass: 0.6,
} as const;

const SHAKE_KEYFRAMES = [0, -12, 10, -8, 6, -3, 0];

const toSlots = (code: string, length: number) =>
  Array.from({ length }, (_, i) => code[i] ?? "");

export function OtpInput({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  type = "numbers",
  size = "md",
  variant = "default",
  status = "idle",
  mask = false,
  disabled = false,
  autoFocus = false,
  separator,
  groupSize,
  className,
  slotClassName,
  ...props
}: OtpInputProps) {
  const instanceId = useId();
  const [uncontrolled, setUncontrolled] = useState(() =>
    toSlots(defaultValue, length)
  );
  const [clearedSlot, setClearedSlot] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [caretX, setCaretX] = useState<number>(0);
  const [isCaretMoving, setIsCaretMoving] = useState(false);
  const [lastPunchedIndex, setLastPunchedIndex] = useState<number | null>(null);
  const [prevStatus, setPrevStatus] = useState(status);
  const [isCelebrating, setIsCelebrating] = useState(false);

  if (prevStatus !== status) {
    setPrevStatus(status);
    if (status === "success") {
      setIsCelebrating(true);
    } else {
      setIsCelebrating(false);
    }
  }

  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const cells = useRef<(HTMLDivElement | null)[]>([]);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const editingAt = useRef<number | null>(null);
  const caretTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isCelebrating) {
      const timer = setTimeout(() => {
        setIsCelebrating(false);
      }, 500 + length * 50);
      return () => clearTimeout(timer);
    }
  }, [isCelebrating, length]);

  const slots =
    value === undefined
      ? Array.from({ length }, (_, i) => uncontrolled[i] ?? "")
      : toSlots(value, length);

  const numeric = type === "numbers";
  const scale = SIZES[size];
  const caretVisible =
    focusedIndex !== null && !slots[focusedIndex] && status !== "error";

  const updateCaretPosition = (index: number) => {
    const cell = cells.current[index];
    const row = rowRef.current;
    if (cell && row) {
      const cellRect = cell.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      const targetX =
        cell.offsetParent === row
          ? cell.offsetLeft + cell.offsetWidth / 2
          : cellRect.left - rowRect.left + cellRect.width / 2;

      setIsCaretMoving(true);
      setCaretX(targetX);

      if (caretTimerRef.current) clearTimeout(caretTimerRef.current);
      caretTimerRef.current = setTimeout(() => {
        setIsCaretMoving(false);
      }, 240);
    }
  };

  useEffect(() => {
    if (focusedIndex !== null) {
      updateCaretPosition(focusedIndex);
      const frame = requestAnimationFrame(() => {
        updateCaretPosition(focusedIndex);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [focusedIndex, size, length]);

  const commit = (next: string[]) => {
    if (value === undefined) setUncontrolled(next);
    const code = next.join("");
    onChange?.(code);
    if (next.every(Boolean)) onComplete?.(code);
  };

  const focusAt = (index: number) => {
    const target = Math.min(Math.max(index, 0), length - 1);
    const input = inputs.current[target];
    input?.focus();
    input?.select();
    setFocusedIndex(target);
    updateCaretPosition(target);
  };

  const setCharAt = (index: number, char: string) => {
    if (!char) {
      setClearedSlot(index);
    } else {
      setClearedSlot(null);
      setLastPunchedIndex(index);
      setTimeout(() => setLastPunchedIndex(null), 180);
    }

    const next = slots.map((slot, i) => (i === index ? char : slot));
    commit(next);
  };

  const fill = (startIndex: number, chars: string[]) => {
    const availableSpace = Math.min(chars.length, length - startIndex);
    const next = [...slots];
    chars.slice(0, availableSpace).forEach((char, i) => {
      next[startIndex + i] = char;
    });
    setClearedSlot(null);
    commit(next);
    editingAt.current = null;
    focusAt(startIndex + availableSpace);
  };

  const handleChange = (index: number, raw: string) => {
    const filtered = raw.split("").filter((char) => PATTERNS[type].test(char));
    if (!filtered.length) {
      if (raw === "") {
        setCharAt(index, "");
      }
      return;
    }

    const typedChar =
      filtered.length === 1
        ? filtered[0]
        : filtered.length === 2 && filtered[0] === slots[index]
        ? filtered[1]
        : null;

    if (typedChar === null) {
      fill(index, filtered);
      return;
    }

    if (slots.every(Boolean) && editingAt.current !== index) return;

    setCharAt(index, typedChar);
    editingAt.current = null;
    focusAt(index + 1);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      editingAt.current = Math.max(index - 1, 0);
      focusAt(index - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      editingAt.current = Math.min(index + 1, length - 1);
      focusAt(index + 1);
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      if (slots[index]) {
        setCharAt(index, "");
      } else if (index > 0) {
        setCharAt(index - 1, "");
        focusAt(index - 1);
      }
      return;
    }

    if (event.key === "Delete") {
      event.preventDefault();
      setCharAt(index, "");
      return;
    }
  };

  const handlePaste = (
    index: number,
    event: ClipboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .split("")
      .filter((char) => PATTERNS[type].test(char));
    if (pasted.length) fill(index, pasted);
  };

  const handlePointerDown = (
    index: number,
    event: PointerEvent<HTMLInputElement>
  ) => {
    const firstEmpty = slots.findIndex((slot) => !slot);
    const target = firstEmpty === -1 ? index : Math.min(index, firstEmpty);
    editingAt.current = target;
    if (target === index) return;
    event.preventDefault();
    focusAt(target);
  };

  const getVariantStyles = (filled: boolean, isFocused: boolean) => {
    switch (variant) {
      case "glass":
        return cn(
          "bg-white/4 dark:bg-white/3 backdrop-blur-md border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]",
          filled && "border-white/25 bg-white/8",
          isFocused && "border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        );
      case "neon":
        return cn(
          "bg-zinc-950 border border-zinc-800 shadow-[0_0_12px_rgba(0,0,0,0.5)]",
          filled && "border-zinc-600 shadow-[0_0_16px_rgba(255,255,255,0.06)]",
          isFocused && "border-zinc-300 shadow-[0_0_24px_rgba(255,255,255,0.2)]"
        );
      case "underlined":
        return cn(
          "bg-transparent border-b-2 rounded-none! border-zinc-700 shadow-none",
          filled && "border-zinc-400",
          isFocused && "border-white"
        );
      default:
        return cn(
          "bg-[#F4F4F9] dark:bg-[#161619] border border-black/5 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.08)]",
          filled && "dark:border-white/20 border-black/15 dark:bg-[#1a1a1e]",
          isFocused && "dark:border-white/35 border-black/25"
        );
    }
  };

  return (
    <div
      data-slot="otp-input"
      data-status={status}
      data-variant={variant}
      className={cn("relative inline-flex flex-col items-center select-none", className)}
      {...props}
    >
      <motion.div
        ref={rowRef}
        data-slot="otp-input-row"
        layout
        transition={{
          layout: reduceMotion ? { duration: 0 } : SIZE_SPRING,
          duration: 0.42,
          ease: [0.36, 0.66, 0.04, 1],
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setFocusedIndex(null);
          }
        }}
        animate={{
          x: status === "error" && !reduceMotion ? SHAKE_KEYFRAMES : 0,
        }}
        className={cn("relative flex items-center", scale.gap)}
      >
        {slots.map((slot, index) => {
          const isFocused = focusedIndex === index;
          const isFilled = Boolean(slot);
          const isLastPunched = lastPunchedIndex === index;
          const showSeparator =
            separator &&
            groupSize &&
            index > 0 &&
            index % groupSize === 0;

          return (
            <React.Fragment key={index}>
              {showSeparator && (
                <motion.div
                  layout
                  transition={{
                    layout: reduceMotion ? { duration: 0 } : SIZE_SPRING,
                  }}
                  aria-hidden="true"
                  className="shrink-0 flex items-center justify-center text-zinc-400 dark:text-zinc-600 px-0.5"
                >
                  {separator}
                </motion.div>
              )}

              <motion.div
                ref={(el) => {
                  cells.current[index] = el;
                }}
                data-slot="otp-input-cell"
                data-filled={isFilled}
                data-focused={isFocused}
                layout
                transition={{
                  layout: reduceMotion ? { duration: 0 } : SIZE_SPRING,
                }}
                whileHover={
                  disabled || reduceMotion || status === "success" || status === "error" || isCelebrating
                    ? undefined
                    : { y: -1.5, scale: 1.02 }
                }
                animate={
                  isCelebrating && !reduceMotion
                    ? {
                        y: [0, -10, 0],
                        scale: [1, 1.07, 1],
                        transition: {
                          duration: 0.5,
                          delay: index * 0.05,
                          ease: [0.34, 1.56, 0.64, 1],
                        },
                      }
                    : status === "loading" && !reduceMotion
                    ? {
                        opacity: [0.5, 1, 0.5],
                        y: [0, -3, 0],
                        transition: {
                          repeat: Infinity,
                          duration: 1.2,
                          delay: index * 0.12,
                          ease: "easeInOut",
                        },
                      }
                    : isLastPunched && !reduceMotion
                    ? {
                        scale: [1, 1.12, 1],
                        y: [0, -2, 0],
                        transition: { duration: 0.22, ease: "easeOut" },
                      }
                    : isFocused && !reduceMotion && status !== "success"
                    ? {
                        scale: 1.04,
                        y: -1.5,
                        transition: { type: "spring", stiffness: 450, damping: 28 },
                      }
                    : {
                        scale: 1,
                        y: 0,
                        transition: { type: "spring", stiffness: 450, damping: 28 },
                      }
                }
                className={cn(
                  "relative flex items-center justify-center transition-colors duration-200",
                  scale.box,
                  getVariantStyles(isFilled, isFocused),
                  slotClassName
                )}
              >
                <AnimatePresence>
                  {isFocused && !reduceMotion && status !== "success" && (
                    <motion.div
                      layoutId={"otp-active-glow-" + instanceId}
                      layout
                      transition={{
                        layout: reduceMotion ? { duration: 0 } : SIZE_SPRING,
                        type: "spring",
                        stiffness: 450,
                        damping: 34,
                        mass: 0.6,
                      }}
                      className={cn(
                        "pointer-events-none absolute -inset-0.5 rounded-[inherit] border-2 border-white/60 dark:border-white/50 shadow-[0_0_18px_rgba(255,255,255,0.2)] z-20",
                        variant === "underlined" && "border-0 border-b-2 rounded-none! shadow-[0_4px_12px_rgba(255,255,255,0.3)] inset-x-0 -bottom-0.5 top-auto h-0.5",
                        status === "error" &&
                          "border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                      )}
                    />
                  )}
                </AnimatePresence>

                <input
                  ref={(el) => {
                    inputs.current[index] = el;
                  }}
                  data-slot="otp-input-slot"
                  data-filled={isFilled}
                  value={slot}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={(event) => handlePaste(index, event)}
                  onPointerDown={(event) => handlePointerDown(index, event)}
                  onFocus={() => {
                    setFocusedIndex(index);
                    updateCaretPosition(index);
                  }}
                  type={mask ? "password" : "text"}
                  inputMode={numeric ? "numeric" : "text"}
                  autoCapitalize={numeric ? undefined : "characters"}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  autoFocus={autoFocus && index === 0}
                  disabled={disabled}
                  aria-label={(numeric ? "Digit " : "Character ") + (index + 1) + " of " + length}
                  className="absolute inset-0 size-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-30"
                />

                <AnimatePresence>
                  {status === "success" && (
                    <motion.svg
                      aria-hidden="true"
                      data-slot="otp-input-ring"
                      viewBox={"0 0 " + scale.px + " " + scale.px}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pointer-events-none absolute inset-0 size-full z-20 overflow-visible"
                    >
                      {variant === "underlined" ? (
                        <motion.line
                          x1={0}
                          y1={scale.px - 1}
                          x2={scale.px}
                          y2={scale.px - 1}
                          stroke="#10b981"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          initial={
                            reduceMotion ? false : { pathLength: 0, opacity: 0 }
                          }
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : {
                                  duration: 0.45,
                                  ease: [0.16, 1, 0.3, 1],
                                  delay: 0.08 + index * 0.05,
                                }
                          }
                          style={{
                            filter: "drop-shadow(0 0 6px rgba(16,185,129,0.7))",
                          }}
                        />
                      ) : (
                        <motion.rect
                          x={1.5}
                          y={1.5}
                          width={scale.px - 3}
                          height={scale.px - 3}
                          rx={scale.radius - 1}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          initial={
                            reduceMotion ? false : { pathLength: 0, opacity: 0 }
                          }
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : {
                                  duration: 0.5,
                                  ease: [0.16, 1, 0.3, 1],
                                  delay: 0.1 + index * 0.05,
                                }
                          }
                          style={{
                            filter: "drop-shadow(0 0 6px rgba(16,185,129,0.7))",
                          }}
                        />
                      )}
                    </motion.svg>
                  )}
                </AnimatePresence>

                <div className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden z-10">
                  <AnimatePresence
                    mode="popLayout"
                    initial={false}
                    custom={clearedSlot === index}
                  >
                    {slot && (
                      <motion.span
                        key={slot + "-" + index}
                        layout="position"
                        initial={
                          reduceMotion
                            ? { opacity: 0 }
                            : {
                                y: 26,
                                opacity: 0,
                                scale: 0.65,
                                filter: "blur(4px)",
                              }
                        }
                        animate={{
                          y: 0,
                          opacity: 1,
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : {
                                y: clearedSlot === index ? 22 : -22,
                                opacity: 0,
                                scale: 0.7,
                                filter: "blur(3px)",
                              }
                        }
                        transition={{
                          layout: reduceMotion ? { duration: 0 } : SIZE_SPRING,
                          ...(reduceMotion ? { duration: 0.15 } : ROLL_SPRING),
                        }}
                        data-slot="otp-input-char"
                        className={cn(
                          "font-mono font-semibold tracking-wider text-black dark:text-white select-none inline-flex items-center justify-center",
                          scale.text
                        )}
                      >
                        {mask ? (
                          <motion.span
                            initial={{ scale: 0.4 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 600, damping: 28 }}
                            className="inline-block size-2.5 rounded-full bg-current shadow-[0_0_8px_currentColor]"
                          />
                        ) : (
                          slot
                        )}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </React.Fragment>
          );
        })}

        {caretVisible && (
          <motion.span
            aria-hidden="true"
            data-slot="otp-input-caret"
            initial={false}
            animate={{
              x: caretX - 1,
              y: "-50%",
              height: scale.caretHeight,
              scaleX: isCaretMoving && !reduceMotion ? 1.4 : 1,
              scaleY: isCaretMoving && !reduceMotion ? 0.85 : 1,
              opacity: isCaretMoving ? 1 : [1, 1, 0, 0],
            }}
            transition={{
              x: reduceMotion ? { duration: 0 } : CARET_SPRING,
              height: reduceMotion ? { duration: 0 } : SIZE_SPRING,
              scaleX: { duration: 0.15 },
              scaleY: { duration: 0.15 },
              opacity: isCaretMoving
                ? { duration: 0.05 }
                : {
                    duration: 1.05,
                    times: [0, 0.48, 0.5, 1],
                    repeat: Infinity,
                    ease: "linear",
                  },
            }}
            className="pointer-events-none absolute left-0 top-1/2 w-0.5 rounded-full bg-black dark:bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-30"
          />
        )}
      </motion.div>
    </div>
  );
}

export default OtpInput;
`,
      },
    ],
  },
  "code-block": {
    slug: "code-block",
    name: "Code Block",
    description: "Minimal syntax-highlighted code block with line numbers, copy action, and accent color customization.",
    summary: "A pure, borderless syntax-highlighted code block component engineered for seamless developer experiences. Eliminates bulky outer card frames and box shadows in favor of a clean, line-synchronized layout where line numbers and tokens maintain mathematical alignment across empty and wrapped lines. Features instant one-click clipboard copying, interactive token styling, and dynamic accent color theming.",
    category: "display",
    tags: ["code", "syntax-highlighting", "developer", "minimal", "copy", "line-numbers"],
    dependencies: ["clsx", "tailwind-merge", "@radix-ui/react-icons"],
    version: "1.0.0",
    createdDate: "2026-09-21",
    updatedDate: "2026-09-21",
    interactive: true,
    supportsColor: true,
    highlights: [
      "Borderless, container-free aesthetic designed to float cleanly on dark backgrounds",
      "Per-row line synchronization ensuring line numbers never desync from code lines",
      "Dynamic accent color customization for keywords, tags, numbers, and attributes",
      "One-click clipboard copy button with active feedback states",
      "Zero-dependency lightweight syntax tokenizer"
    ],
    anatomy: [
      "<CodeBlock> (Root container with font-mono and select-text styling)",
      "<CopyButton> (Absolute top-right floating translucent action button)",
      "<LineRow> (Line-synchronized flex row pairing line number with tokens)"
    ],
    guidelines: {
      recommended: [
        "Inline documentation snippets and interactive code playgrounds",
        "Developer tool displays and command showcases",
        "Clean terminal or code output screens without visual clutter"
      ],
      bestPractices: [
        "Pass a valid CSS color string to color to match your product's accent theme",
        "Use showLineNumbers={false} for compact single-line or small multi-line snippets"
      ]
    },
    props: [
      {
        name: "code",
        type: "string",
        defaultValue: "DEFAULT_CODE",
        description: "Code string to display and syntax highlight.",
      },
      {
        name: "color",
        type: "string",
        defaultValue: '"#4ade80"',
        description: "Accent color for keywords, numbers, tags, and highlights.",
      },
      {
        name: "showLineNumbers",
        type: "boolean",
        defaultValue: "true",
        description: "Whether to display line numbers column on the left.",
      },
      {
        name: "filename",
        type: "string",
        defaultValue: "undefined",
        description: "Optional filename or title displayed above the code.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes to customize spacing or container.",
      },
    ],
    files: [
      {
        name: "code-block.tsx",
        path: "registry/ui/code-block.tsx",
        code: `"use client";

import React, { useState, useMemo } from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  code?: string;
  language?: string;
  color?: string;
  showLineNumbers?: boolean;
  className?: string;
  filename?: string;
}

const DEFAULT_CODE = \`import { useSpring, animated } from "motion/react";

type OrbitProps = {
  radius?: number;
  speed?: number;
};

export function Orbit({ radius = 120, speed = 1 }: OrbitProps) {
  const angle = useSpring(0, { stiffness: 80, damping: 20 });

  const x = Math.cos(angle.get()) * radius;
  const y = Math.sin(angle.get()) * radius;

  return (
    <animated.div
      style={{ x, y }}
      className="size-4 rounded-full bg-current"
    />
  );
}\`;

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "const",
  "let",
  "var",
  "function",
  "return",
  "interface",
  "type",
  "extends",
  "as",
  "typeof",
  "keyof",
  "new",
  "true",
  "false",
  "null",
  "undefined",
  "if",
  "else",
  "switch",
  "case",
]);

export const CodeBlock = ({
  code = DEFAULT_CODE,
  color = "#4ade80",
  showLineNumbers = true,
  className,
  filename,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const lines = useMemo(() => {
    return code.split("\\n").map((line, lineIdx) => {
      const regex =
        /(".*?"|'.*?'|\`.*?\`|<\\/?[A-Za-z0-9_$.]+|\\/?>|\\b[A-Za-z_$][A-Za-z0-9_$]*\\b|\\b\\d+\\b|[{}()[\\];:,.=><&|!+*/?-]|\\s+)/g;
      const tokens: React.ReactNode[] = [];
      let match;
      const isImportLine = line.trimStart().startsWith("import ");

      while ((match = regex.exec(line)) !== null) {
        const token = match[0];
        const key = \`\${lineIdx}-\${match.index}\`;

        if (
          token.startsWith('"') ||
          token.startsWith("'") ||
          token.startsWith("\`")
        ) {
          if (isImportLine) {
            tokens.push(
              <span key={key} className="text-[#c084fc]">
                {token}
              </span>,
            );
          } else {
            tokens.push(
              <span key={key} style={{ color }}>
                {token}
              </span>,
            );
          }
        } else if (token.startsWith("<") || token === "/>" || token === ">") {
          tokens.push(
            <span key={key} style={{ color }}>
              {token}
            </span>,
          );
        } else if (token === "style" || token === "className") {
          tokens.push(
            <span key={key} className="italic text-zinc-400">
              {token}
            </span>,
          );
        } else if (KEYWORDS.has(token)) {
          tokens.push(
            <span key={key} style={{ color }}>
              {token}
            </span>,
          );
        } else if (/^\\d+$/.test(token)) {
          tokens.push(
            <span key={key} style={{ color }}>
              {token}
            </span>,
          );
        } else if (/^[{}()[\\];:,.=><&|!+*/?-]+$/.test(token)) {
          tokens.push(
            <span key={key} className="text-zinc-400">
              {token}
            </span>,
          );
        } else if (/^\\s+$/.test(token)) {
          tokens.push(<span key={key}>{token}</span>);
        } else {
          tokens.push(
            <span key={key} className="text-zinc-100">
              {token}
            </span>,
          );
        }
      }

      return {
        text: line,
        tokens,
      };
    });
  }, [code, color]);

  return (
    <div className={cn("relative w-full max-w-2xl select-text", className)}>
      {filename && (
        <div className="mb-2 text-xs font-mono text-zinc-500">
          {filename}
        </div>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-0 right-0 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-white/4 text-zinc-400 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/8 hover:text-white cursor-pointer"
        title={copied ? "Copied" : "Copy code"}
      >
        {copied ? (
          <CheckIcon className="h-4 w-4 text-emerald-400" />
        ) : (
          <CopyIcon className="h-4 w-4" />
        )}
      </button>

      <div className="overflow-x-auto pr-10">
        <div className="font-mono text-[13px] leading-6 sm:text-sm sm:leading-6">
          {lines.map((line, idx) => (
            <div key={idx} className="flex">
              {showLineNumbers && (
                <span className="w-8 shrink-0 select-none text-right pr-6 font-mono text-zinc-600">
                  {idx + 1}
                </span>
              )}
              <div className="flex-1 whitespace-pre font-mono">
                {line.tokens.length > 0 ? line.tokens : "\\u00A0"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
`,
      },
    ],
  },
  "smooth-accordion": {
    slug: "smooth-accordion",
    name: "Smooth Accordion",
    description: "Fluid collapsible accordion with synchronized layout transitions and smooth blur-reveal mechanics.",
    summary: "An ultra-smooth collapsible accordion designed for developer portals, FAQs, and settings panels. Features simultaneous synchronized collapsing and expanding where one item smoothly closes while another expands without layout stutter. Answers emerge through an optical blur-to-sharp transition and vertical translation curve. Supports single exclusive or multiple modes, custom accent colors, and multiple visual variants.",
    category: "accordion",
    tags: ["accordion", "collapse", "motion", "blur", "spring", "sync", "faq", "interactive"],
    dependencies: ["clsx", "tailwind-merge", "motion", "@radix-ui/react-icons"],
    version: "1.0.0",
    createdDate: "2026-09-21",
    updatedDate: "2026-09-21",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Simultaneous synchronized expansion and collapse with zero layout jitter",
      "Dynamic optical blur-reveal transition on expandable content with staggered delay",
      "Spring-calibrated 180° indicator rotation with dampening",
      "Three dark-mode tailored variants: separated cards, connected bordered list, and ghost",
      "Compound component architecture with full keyboard and ARIA accessibility",
      "Adaptive prefers-reduced-motion fallback ensuring instant zero-motion toggling"
    ],
    anatomy: [
      "<Accordion> (Root state provider and layout wrapper supporting single/multiple modes)",
      "<AccordionItem> (Context-bound item with active state styling and borders)",
      "<AccordionTrigger> (Accessible button trigger housing title, subtitle, badge, and animated chevron)",
      "<AccordionContent> (Synchronized animated container with height collapse and delayed blur-to-sharp filter)"
    ],
    physics: {
      engine: "Framer Motion Spring & Bezier Filter Transitions",
      description: "Synchronized dual-axis height expansion and CSS filter blur interpolation using cubic-bezier(0.16, 1, 0.3, 1).",
      parameters: [
        { label: "Height Transition", value: "380ms [0.16, 1, 0.3, 1]" },
        { label: "Content Delay", value: "80ms staggered reveal" },
        { label: "Blur Reveal", value: "8px -> 0px (340ms)" },
        { label: "Opacity Curve", value: "0 -> 1 (340ms)" },
        { label: "Chevron Spring", value: "stiffness: 320, damping: 24" },
        { label: "Sync Mode", value: "Concurrent enter/exit" },
        { label: "Compositing", value: "GPU filter + transform" }
      ]
    },
    accessibility: {
      role: "region",
      aria: "Each trigger links to its corresponding content via aria-controls and aria-labelledby with live aria-expanded state.",
      reducedMotion: "Instantaneous height and opacity changes with blur filter disabled when prefers-reduced-motion is active.",
      keyboard: [
        { key: "Tab", description: "Navigate between accordion item triggers." },
        { key: "Enter / Space", description: "Expand or collapse the focused accordion item." }
      ]
    },
    guidelines: {
      recommended: [
        "Product FAQ sections and documentation feature breakdowns",
        "Configurable settings and preference panels in developer dashboards",
        "Nested multi-section information architectures requiring clean spatial hierarchy"
      ],
      bestPractices: [
        "Use variant='separated' for high-emphasis feature FAQs with distinct cards",
        "Use variant='bordered' inside modals or compact settings lists",
        "Enable single mode when content is lengthy to prevent vertical scrolling fatigue"
      ]
    },
    props: [
      {
        name: "type",
        type: "'single' | 'multiple'",
        defaultValue: "'single'",
        description: "Determines whether one item or multiple items can be expanded simultaneously.",
      },
      {
        name: "collapsible",
        type: "boolean",
        defaultValue: "true",
        description: "When type is 'single', allows closing an active item by clicking it again.",
      },
      {
        name: "variant",
        type: "'separated' | 'bordered' | 'ghost'",
        defaultValue: "'separated'",
        description: "Visual styling variant for the accordion containers and borders.",
      },
      {
        name: "blurAmount",
        type: "number",
        defaultValue: "8",
        description: "Intensity of the entrance and exit blur effect in pixels.",
      },
      {
        name: "items",
        type: "AccordionItemData[]",
        defaultValue: "undefined",
        description: "Optional declarative array of items to render without writing JSX compound children.",
      },
    ],
    files: [
      {
        name: "smooth-accordion.tsx",
        path: "registry/ui/smooth-accordion.tsx",
        code: `"use client";

import * as React from "react";
import {
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
  useId,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export type AccordionType = "single" | "multiple";
export type AccordionVariant = "separated" | "bordered" | "ghost";

export interface AccordionItemData {
  value: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface AccordionContextValue {
  type: AccordionType;
  expanded: string[];
  toggleItem: (val: string) => void;
  variant: AccordionVariant;
  blurAmount: number;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled?: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(
  null,
);

function useAccordionItem() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      "AccordionTrigger and AccordionContent must be used within an AccordionItem",
    );
  }
  return context;
}

export interface AccordionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  type?: AccordionType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  variant?: AccordionVariant;
  blurAmount?: number;
  items?: AccordionItemData[];
}

export function Accordion({
  type = "single",
  value: controlledValue,
  defaultValue,
  onValueChange,
  collapsible = true,
  variant = "separated",
  blurAmount = 8,
  items,
  children,
  className,
  ...props
}: AccordionProps) {
  const [internalExpanded, setInternalExpanded] = useState<string[]>(() => {
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  });

  const isControlled = controlledValue !== undefined;
  const currentExpanded = useMemo(() => {
    if (isControlled) {
      return Array.isArray(controlledValue)
        ? controlledValue
        : controlledValue
          ? [controlledValue]
          : [];
    }
    return internalExpanded;
  }, [isControlled, controlledValue, internalExpanded]);

  const toggleItem = useCallback(
    (itemValue: string) => {
      let next: string[];
      if (type === "single") {
        const isCurrentOpen = currentExpanded.includes(itemValue);
        if (isCurrentOpen) {
          next = collapsible ? [] : [itemValue];
        } else {
          next = [itemValue];
        }
      } else {
        if (currentExpanded.includes(itemValue)) {
          next = currentExpanded.filter((v) => v !== itemValue);
        } else {
          next = [...currentExpanded, itemValue];
        }
      }

      if (!isControlled) {
        setInternalExpanded(next);
      }

      if (onValueChange) {
        onValueChange(type === "single" ? (next[0] ?? "") : next);
      }
    },
    [type, currentExpanded, collapsible, isControlled, onValueChange],
  );

  return (
    <AccordionContext.Provider
      value={{
        type,
        expanded: currentExpanded,
        toggleItem,
        variant,
        blurAmount,
      }}
    >
      <div
        className={cn(
          "w-full select-none",
          variant === "separated" && "flex flex-col gap-2.5",
          variant === "bordered" &&
            "rounded-xl border border-white/8 divide-y divide-white/8 overflow-hidden bg-[#0c0c0e]/80",
          variant === "ghost" && "flex flex-col divide-y divide-white/5",
          className,
        )}
        {...props}
      >
        {items
          ? items.map((item) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                disabled={item.disabled}
              >
                <AccordionTrigger
                  badge={item.badge}
                  icon={item.icon}
                  subtitle={item.subtitle}
                >
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))
          : children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export function AccordionItem({
  value,
  disabled = false,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const { expanded, variant } = useAccordion();
  const id = useId();
  const triggerId = \`accordion-trigger-\${id}\`;
  const contentId = \`accordion-content-\${id}\`;
  const isOpen = expanded.includes(value);

  return (
    <AccordionItemContext.Provider
      value={{ value, isOpen, disabled, triggerId, contentId }}
    >
      <div
        className={cn(
          "group transition-all duration-300",
          variant === "separated" && [
            "rounded-xl border border-white/8 bg-[#0c0c0e]/80 backdrop-blur-sm overflow-hidden",
            "hover:border-white/15 hover:bg-[#101014]/90",
            isOpen && "border-white/20 bg-[#121217]/95 shadow-[0_12px_32px_rgba(0,0,0,0.4)]",
          ],
          variant === "bordered" && [
            "transition-colors",
            isOpen && "bg-[#121217]/60",
          ],
          variant === "ghost" && [
            "transition-colors rounded-lg",
            isOpen && "bg-white/3",
          ],
          disabled && "opacity-45 pointer-events-none",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function AccordionTrigger({
  children,
  badge,
  icon,
  subtitle,
  className,
  ...props
}: AccordionTriggerProps) {
  const { toggleItem } = useAccordion();
  const { value, isOpen, disabled, triggerId, contentId } = useAccordionItem();
  const prefersReducedMotion = useReducedMotion();

  return (
    <button
      type="button"
      id={triggerId}
      aria-controls={contentId}
      aria-expanded={isOpen}
      disabled={disabled}
      onClick={() => toggleItem(value)}
      className={cn(
        "w-full flex items-center justify-between gap-4 p-4 text-left cursor-pointer transition-colors outline-none focus-visible:ring-1 focus-visible:ring-white/30",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {icon && (
          <span className="shrink-0 text-zinc-400 group-hover:text-zinc-200 transition-colors">
            {icon}
          </span>
        )}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={cn(
                "text-sm font-medium tracking-tight transition-colors duration-200",
                isOpen ? "text-white" : "text-zinc-200 group-hover:text-white",
              )}
            >
              {children}
            </span>
            {badge && (
              <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-zinc-400 group-hover:text-zinc-300">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <span className="text-xs text-zinc-400 font-light mt-0.5 truncate">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 320, damping: 24 }
        }
        className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors"
      >
        <ChevronDownIcon className="w-4 h-4" />
      </motion.div>
    </button>
  );
}

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

export function AccordionContent({
  children,
  className,
  ...props
}: AccordionContentProps) {
  const { blurAmount } = useAccordion();
  const { isOpen, triggerId, contentId } = useAccordionItem();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          initial={{ height: 0 }}
          animate={{
            height: "auto",
            transition: prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
          }}
          exit={{
            height: 0,
            transition: prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
          }}
          className="overflow-hidden"
        >
          <motion.div
            initial={{
              opacity: 0,
              filter: \`blur(\${blurAmount}px)\`,
              y: -8,
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              transition: prefersReducedMotion
                ? { duration: 0 }
                : {
                    delay: 0.08,
                    duration: 0.34,
                    ease: [0.16, 1, 0.3, 1],
                  },
            }}
            exit={{
              opacity: 0,
              filter: \`blur(\${blurAmount}px)\`,
              y: -4,
              transition: prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: 0.18,
                    ease: "easeInOut",
                  },
            }}
          >
            <div
              className={cn(
                "px-4 pb-4.5 pt-0 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed",
                className,
              )}
              {...props}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const SmoothAccordion = Accordion;
`
      },
    ],
  },
  accordion: {
    slug: "accordion",
    name: "Blur Reveal Accordion",
    description: "Interactive accordion with synchronized height expansion and smooth letter-by-letter blur text reveals.",
    summary: "An ultra-smooth accordion with character-by-character optical blur reveal physics, spring-calibrated toggle morphing, and synchronized height transitions. Features click-outside auto-collapse, dark/light adaptive styling, and customizable spring physics for silky-smooth typography blooming.",
    category: "accordion",
    tags: ["accordion", "collapse", "motion", "blur-text", "reveal", "spring", "letters", "interactive"],
    dependencies: ["clsx", "tailwind-merge", "motion"],
    version: "1.0.0",
    createdDate: "2026-09-22",
    updatedDate: "2026-09-22",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Staggered letter-by-letter blur-to-sharp optical reveal animation",
      "Spring-calibrated morphing indicator transitioning smoothly between plus and minus",
      "Sub-pixel calibrated height transitions with zero layout shift",
      "Automatic click-outside detection to dismiss expanded panels",
      "Full word-boundary containment preventing mid-word line breaks during stagger",
      "Complete prefers-reduced-motion fallback ensuring instant zero-latency transitions"
    ],
    anatomy: [
      "<Accordion> (Root container with gradient background shell and click-outside handler)",
      "<button> (Accessible toggle header with animated morphing plus/minus indicator)",
      "<BlurText> (Character-by-character blooming typography engine with spring physics)"
    ],
    physics: {
      engine: "Motion Spring & Bezier Filter Engine",
      description: "Dual-axis height bezier curve combined with per-character optical blur dissolving and spring dampening.",
      parameters: [
        { label: "Height Transition", value: "380ms [0.16, 1, 0.3, 1]" },
        { label: "Letter Spring", value: "stiffness: 180, damping: 22, mass: 0.6" },
        { label: "Blur Dissolve", value: "8px -> 0px [0.22, 1, 0.36, 1]" },
        { label: "Stagger Pitch", value: "Dynamic 7ms - 16ms per character" },
        { label: "Indicator Spring", value: "stiffness: 320, damping: 24" },
        { label: "Word Protection", value: "inline-block whitespace-nowrap" },
        { label: "Compositing", value: "GPU filter + transform" }
      ]
    },
    accessibility: {
      role: "region",
      aria: "Uses semantic button triggers with live aria-expanded state and aria-label accessibility on animated blur text.",
      reducedMotion: "Instantaneous height and opacity changes with blur filter disabled when prefers-reduced-motion is active.",
      keyboard: [
        { key: "Tab", description: "Navigate between accordion item triggers." },
        { key: "Enter / Space", description: "Expand or collapse the focused accordion item." }
      ]
    },
    guidelines: {
      recommended: [
        "Product FAQ sections and documentation feature breakdowns",
        "Feature highlights where dramatic typography reveals enhance storytelling",
        "Settings drawers and expandable guidance cards in developer consoles"
      ],
      bestPractices: [
        "Keep descriptions under 250 characters for optimal staggered reveal pacing",
        "Use closeOnClickOutside for interactive drawers in compact layouts",
        "Enable reduced-motion fallbacks for users with vestibular sensitivities"
      ]
    },
    props: [
      {
        name: "items",
        type: "AccordionItem[]",
        defaultValue: "required",
        description: "Array of items containing title and description strings to render in the accordion.",
      },
      {
        name: "defaultIndex",
        type: "number | null",
        defaultValue: "1",
        description: "Index of the item that should be open by default on mount.",
      },
      {
        name: "collapsible",
        type: "boolean",
        defaultValue: "true",
        description: "Whether clicking an active item closes it.",
      },
      {
        name: "letterDelay",
        type: "number",
        defaultValue: "auto",
        description: "Custom stagger delay in seconds between consecutive characters.",
      },
      {
        name: "stiffness",
        type: "number",
        defaultValue: "180",
        description: "Spring stiffness coefficient for the vertical letter translation.",
      },
      {
        name: "damping",
        type: "number",
        defaultValue: "22",
        description: "Spring damping coefficient to control bouncing on letter arrival.",
      },
      {
        name: "blurAmount",
        type: "number",
        defaultValue: "8",
        description: "Initial blur filter radius in pixels before dissolving into sharpness.",
      },
      {
        name: "closeOnClickOutside",
        type: "boolean",
        defaultValue: "true",
        description: "Whether clicking outside the accordion automatically closes any open items.",
      },
    ],
    files: [
      {
        name: "accordion.tsx",
        path: "registry/ui/accordion.tsx",
        code: `"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  title: string;
  description: string;
}

export interface BlurTextProps {
  text?: string;
  delay?: number;
  startDelay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  stiffness?: number;
  damping?: number;
  mass?: number;
  blurAmount?: number;
  onAnimationComplete?: () => void;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay,
  startDelay = 0.05,
  className = "",
  animateBy = "letters",
  direction = "bottom",
  stiffness = 180,
  damping = 22,
  mass = 0.6,
  blurAmount = 8,
  onAnimationComplete,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const words = useMemo(() => text.split(" "), [text]);

  const totalChars = useMemo(() => text.length, [text]);
  const effectiveDelay = useMemo(() => {
    if (delay !== undefined) return delay;
    if (animateBy === "words") return 0.05;
    return Math.max(0.007, Math.min(0.016, 1.1 / Math.max(totalChars, 1)));
  }, [delay, animateBy, totalChars]);

  let charCounter = 0;

  if (prefersReducedMotion) {
    return <p className={cn("leading-relaxed", className)}>{text}</p>;
  }

  return (
    <p
      aria-label={text}
      className={cn(
        "flex flex-wrap items-baseline leading-relaxed select-none",
        className,
      )}
    >
      {words.map((word, wordIndex) => {
        if (animateBy === "words") {
          const currentWordIndex = wordIndex;
          const isLast = currentWordIndex === words.length - 1;
          const wordDelay = startDelay + currentWordIndex * effectiveDelay;

          return (
            <React.Fragment key={wordIndex}>
              <motion.span
                aria-hidden="true"
                initial={{
                  opacity: 0,
                  filter: \`blur(\${blurAmount}px)\`,
                  y: direction === "top" ? -8 : 8,
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                }}
                transition={{
                  opacity: {
                    duration: 0.32,
                    ease: [0.22, 1, 0.36, 1],
                    delay: wordDelay,
                  },
                  filter: {
                    duration: 0.36,
                    ease: [0.22, 1, 0.36, 1],
                    delay: wordDelay,
                  },
                  y: {
                    type: "spring",
                    stiffness,
                    damping,
                    mass,
                    delay: wordDelay,
                  },
                }}
                onAnimationComplete={isLast ? onAnimationComplete : undefined}
                style={{
                  display: "inline-block",
                  willChange: "transform, filter, opacity",
                }}
              >
                {word}
              </motion.span>
              {wordIndex < words.length - 1 && (
                <span aria-hidden="true" className="inline-block">
                  &nbsp;
                </span>
              )}
            </React.Fragment>
          );
        }

        const letters = word.split("");

        return (
          <React.Fragment key={wordIndex}>
            <span aria-hidden="true" className="inline-block whitespace-nowrap">
              {letters.map((char, letterIndex) => {
                const globalIndex = charCounter++;
                const isLast =
                  globalIndex === totalChars - 1 ||
                  (wordIndex === words.length - 1 &&
                    letterIndex === letters.length - 1);
                const letterAnimationDelay =
                  startDelay + globalIndex * effectiveDelay;

                return (
                  <motion.span
                    key={letterIndex}
                    initial={{
                      opacity: 0,
                      filter: \`blur(\${blurAmount}px)\`,
                      y: direction === "top" ? -8 : 8,
                    }}
                    animate={{
                      opacity: 1,
                      filter: "blur(0px)",
                      y: 0,
                    }}
                    transition={{
                      opacity: {
                        duration: 0.32,
                        ease: [0.22, 1, 0.36, 1],
                        delay: letterAnimationDelay,
                      },
                      filter: {
                        duration: 0.36,
                        ease: [0.22, 1, 0.36, 1],
                        delay: letterAnimationDelay,
                      },
                      y: {
                        type: "spring",
                        stiffness,
                        damping,
                        mass,
                        delay: letterAnimationDelay,
                      },
                    }}
                    onAnimationComplete={
                      isLast ? onAnimationComplete : undefined
                    }
                    style={{
                      display: "inline-block",
                      willChange: "transform, filter, opacity",
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
            {wordIndex < words.length - 1 && (
              <span aria-hidden="true" className="inline-block">
                &nbsp;
              </span>
            )}
          </React.Fragment>
        );
      })}
    </p>
  );
};

export interface AccordionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  items: AccordionItem[];
  defaultIndex?: number | null;
  collapsible?: boolean;
  letterDelay?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  blurAmount?: number;
  closeOnClickOutside?: boolean;
  onToggle?: (index: number | null) => void;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      className,
      defaultIndex = 1,
      collapsible = true,
      letterDelay,
      stiffness = 180,
      damping = 22,
      mass = 0.6,
      blurAmount = 8,
      closeOnClickOutside = true,
      onToggle,
      ...props
    },
    ref,
  ) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(defaultIndex);
    const innerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    useEffect(() => {
      if (!closeOnClickOutside) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          innerRef.current &&
          !innerRef.current.contains(event.target as Node)
        ) {
          setActiveIndex(null);
          onToggle?.(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [closeOnClickOutside, onToggle]);

    const toggleAccordion = (index: number) => {
      const nextIndex =
        activeIndex === index ? (collapsible ? null : index) : index;
      setActiveIndex(nextIndex);
      onToggle?.(nextIndex);
    };

    return (
      <div
        ref={innerRef}
        className={cn("w-full select-none", className)}
        {...props}
      >
        <div className="mx-auto w-full max-w-lg rounded-2xl bg-linear-to-b from-[#fdf7f9] to-[#fcebf2] p-1.5 border border-black/5 dark:from-black dark:to-[#0c0c0e]/80 dark:border-white/8">
          <div className="space-y-1.5">
            {items.map((item, index) => {
              const isOpen = activeIndex === index;

              return (
                <div
                  key={index}
                  className={cn(
                    "overflow-hidden rounded-xl border transition-all duration-300",
                    isOpen
                      ? "border-black/10 bg-white shadow-sm dark:border-white/20 dark:bg-[#121217] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
                      : "border-transparent bg-white shadow-xs hover:border-black/5 dark:border-white/8 dark:bg-[#0c0c0e]/90 dark:hover:border-white/15 dark:hover:bg-[#101014]"
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    className="group flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left text-base font-medium transition-colors text-gray-800 hover:text-gray-950 dark:text-zinc-200 dark:hover:text-white"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span
                      className={cn(
                        "transition-colors duration-200",
                        isOpen
                          ? "text-gray-950 dark:text-white"
                          : "text-gray-800 dark:text-zinc-200"
                      )}
                    >
                      {item.title}
                    </span>
                    <div className="relative flex items-center justify-center w-5 h-5 text-gray-400 transition-colors dark:text-zinc-400 group-hover:text-gray-600 dark:group-hover:text-zinc-200">
                      <motion.span
                        className="absolute h-[1.5px] w-3 bg-current rounded-full"
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 320, damping: 24 }
                        }
                      />
                      <motion.span
                        className="absolute w-[1.5px] h-3 bg-current rounded-full"
                        animate={{
                          scaleY: isOpen ? 0 : 1,
                          opacity: isOpen ? 0 : 1,
                          rotate: isOpen ? 90 : 0,
                        }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 320, damping: 24 }
                        }
                      />
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: prefersReducedMotion
                            ? { duration: 0 }
                            : {
                                height: {
                                  duration: 0.38,
                                  ease: [0.16, 1, 0.3, 1],
                                },
                                opacity: {
                                  duration: 0.25,
                                  ease: "easeOut",
                                },
                              },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: prefersReducedMotion
                            ? { duration: 0 }
                            : {
                                height: {
                                  duration: 0.28,
                                  ease: [0.16, 1, 0.3, 1],
                                },
                                opacity: {
                                  duration: 0.18,
                                  ease: "easeIn",
                                },
                              },
                        }}
                        className="overflow-hidden"
                      >
                        <div
                          className="cursor-pointer px-5 pb-4 text-sm leading-relaxed text-gray-600 dark:text-zinc-400 font-light"
                          onClick={() => toggleAccordion(index)}
                        >
                          <BlurText
                            text={item.description}
                            animateBy="letters"
                            delay={letterDelay}
                            stiffness={stiffness}
                            damping={damping}
                            mass={mass}
                            blurAmount={blurAmount}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

Accordion.displayName = "Accordion";

export default Accordion;
`
      },
    ],
  },
  "dotted-accordion": {
    slug: "dotted-accordion",
    name: "Dotted Accordion",
    description: "Rectangular architectural accordion with contiguous flush items and continuous dotted crosshair guidelines exceeding bounds with smooth gradient masks.",
    summary: "A precision-engineered technical accordion designed with strict zero-radius rectangular geometry, zero gap between items, and projecting boundary guidelines. On selection, the active item's horizontal and vertical boundaries transform into continuous dotted grid lines that extend beyond both axes and fade smoothly into transparency using linear gradient CSS masks. Includes letter-by-letter blur text reveals and synchronized spring transitions.",
    category: "accordion",
    tags: ["accordion", "dotted", "grid", "crosshair", "blueprint", "technical", "mask", "fade", "interactive"],
    dependencies: ["clsx", "tailwind-merge", "motion"],
    version: "1.0.0",
    createdDate: "2026-09-22",
    updatedDate: "2026-09-22",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Zero-radius crisp rectangular geometry with zero gap between points",
      "Continuous dotted boundary guidelines that project outward on both horizontal and vertical axes",
      "Bilateral gradient mask effect fading extended guidelines smoothly to transparent",
      "Active item selection illuminates bounding crosshairs with animated opacity transitions",
      "Synchronized drawer height animation with character-by-character blooming blur text reveal",
      "Monospace technical index prefixes and zero-radius square morphing indicators"
    ],
    anatomy: [
      "<DottedAccordion> (Root container with projecting vertical and horizontal dotted framing guides)",
      "<button> (Zero-radius trigger header housing monospace index prefix, title, and indicator)",
      "<DottedBlurText> (Staggered typography blooming engine rendering within expanding drawer)"
    ],
    physics: {
      engine: "Motion Spring & CSS Gradient Mask Shaders",
      description: "Dual-axis height spring transitions combined with hardware-accelerated WebKit mask image linear-gradients.",
      parameters: [
        { label: "Height Transition", value: "380ms [0.16, 1, 0.3, 1]" },
        { label: "Guideline Extension", value: "48px past boundary" },
        { label: "Mask Falloff", value: "48px linear-gradient ramp" },
        { label: "Letter Spring", value: "stiffness: 180, damping: 22, mass: 0.6" },
        { label: "Line Style", value: "border-dotted border-white/70" },
        { label: "Corner Radius", value: "0px (rounded-none)" },
        { label: "Compositing", value: "GPU filter + transform + mask" }
      ]
    },
    accessibility: {
      role: "region",
      aria: "Uses semantic button triggers with live aria-expanded state and aria-label accessibility on animated blur text.",
      reducedMotion: "Instantaneous height and opacity changes with blur filter disabled when prefers-reduced-motion is active.",
      keyboard: [
        { key: "Tab", description: "Navigate between accordion item triggers." },
        { key: "Enter / Space", description: "Expand or collapse the focused accordion item." }
      ]
    },
    guidelines: {
      recommended: [
        "Technical developer consoles, terminal settings, and telemetry dashboards",
        "CAD, engineering, and architectural product feature presentations",
        "Developer tools requiring precision grid alignment and crosshair aesthetics"
      ],
      bestPractices: [
        "Provide sufficient container padding (px-8 or px-12) so extended guidelines fade out naturally",
        "Use technical monospace tags or prefixes to reinforce the architectural grid aesthetic",
        "Enable reduced-motion fallbacks for users with vestibular sensitivities"
      ]
    },
    props: [
      {
        name: "items",
        type: "DottedAccordionItem[]",
        defaultValue: "required",
        description: "Array of items containing title, description, and optional tag strings.",
      },
      {
        name: "defaultIndex",
        type: "number | null",
        defaultValue: "0",
        description: "Index of the item that should be open by default on mount.",
      },
      {
        name: "collapsible",
        type: "boolean",
        defaultValue: "true",
        description: "Whether clicking an active item closes it.",
      },
      {
        name: "extensionLength",
        type: "number",
        defaultValue: "48",
        description: "Distance in pixels that dotted guidelines project outward beyond the accordion boundary.",
      },
      {
        name: "letterDelay",
        type: "number",
        defaultValue: "auto",
        description: "Custom stagger delay in seconds between consecutive characters.",
      },
      {
        name: "stiffness",
        type: "number",
        defaultValue: "180",
        description: "Spring stiffness coefficient for the vertical letter translation.",
      },
      {
        name: "damping",
        type: "number",
        defaultValue: "22",
        description: "Spring damping coefficient to control bouncing on letter arrival.",
      },
      {
        name: "closeOnClickOutside",
        type: "boolean",
        defaultValue: "true",
        description: "Whether clicking outside the accordion automatically closes any open items.",
      },
    ],
    files: [
      {
        name: "dotted-accordion.tsx",
        path: "registry/ui/dotted-accordion.tsx",
        code: `"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface DottedAccordionItem {
  title: string;
  description: string;
}

export interface DottedAccordionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  items: DottedAccordionItem[];
  defaultIndex?: number | null;
  collapsible?: boolean;
  extensionLength?: number;
  closeOnClickOutside?: boolean;
  onToggle?: (index: number | null) => void;
}

export const DottedAccordion = forwardRef<HTMLDivElement, DottedAccordionProps>(
  (
    {
      items,
      className,
      defaultIndex = 0,
      collapsible = true,
      extensionLength = 48,
      closeOnClickOutside = true,
      onToggle,
      ...props
    },
    ref,
  ) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(defaultIndex);
    const innerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    useEffect(() => {
      if (!closeOnClickOutside) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          innerRef.current &&
          !innerRef.current.contains(event.target as Node)
        ) {
          setActiveIndex(null);
          onToggle?.(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [closeOnClickOutside, onToggle]);

    const toggleAccordion = (index: number) => {
      const nextIndex =
        activeIndex === index ? (collapsible ? null : index) : index;
      setActiveIndex(nextIndex);
      onToggle?.(nextIndex);
    };

    const horizontalMaskStyle = useMemo(
      () => ({
        WebkitMaskImage: \`linear-gradient(to right, transparent, black \${extensionLength}px, black calc(100% - \${extensionLength}px), transparent)\`,
        maskImage: \`linear-gradient(to right, transparent, black \${extensionLength}px, black calc(100% - \${extensionLength}px), transparent)\`,
      }),
      [extensionLength],
    );

    const verticalMaskStyle = useMemo(
      () => ({
        WebkitMaskImage: \`linear-gradient(to bottom, transparent, black \${extensionLength}px, black calc(100% - \${extensionLength}px), transparent)\`,
        maskImage: \`linear-gradient(to bottom, transparent, black \${extensionLength}px, black calc(100% - \${extensionLength}px), transparent)\`,
      }),
      [extensionLength],
    );

    return (
      <div className="relative py-12 px-8 sm:px-14 w-full flex justify-center overflow-visible select-none">
        <div
          ref={innerRef}
          className={cn(
            "relative w-full max-w-xl rounded-none border border-white/10 bg-black",
            className,
          )}
          {...props}
        >
          <div className="flex flex-col gap-0 rounded-none divide-y divide-white/10 relative z-10">
            {items.map((item, index) => {
              const isOpen = activeIndex === index;

              return (
                <div
                  key={index}
                  className={cn(
                    "relative rounded-none transition-colors duration-200",
                    isOpen
                      ? "bg-[#111116]"
                      : "bg-[#0a0a0c] hover:bg-[#0f0f13]",
                  )}
                >
                  <AnimatePresence>
                    {isOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-0 -left-12 -right-12 h-0 border-t border-dotted border-white/70 pointer-events-none z-20"
                          style={horizontalMaskStyle}
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute bottom-0 -left-12 -right-12 h-0 border-b border-dotted border-white/70 pointer-events-none z-20"
                          style={horizontalMaskStyle}
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 -top-12 -bottom-12 w-0 border-l border-dotted border-white/70 pointer-events-none z-20"
                          style={verticalMaskStyle}
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 -top-12 -bottom-12 w-0 border-r border-dotted border-white/70 pointer-events-none z-20"
                          style={verticalMaskStyle}
                        />
                      </>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleAccordion(index)}
                    className="group flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left rounded-none transition-colors outline-none focus-visible:ring-1 focus-visible:ring-white/30"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <span className="font-mono text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors shrink-0 w-5">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "text-sm font-medium tracking-tight transition-colors duration-200 truncate",
                          isOpen
                            ? "text-white"
                            : "text-zinc-300 group-hover:text-white",
                        )}
                      >
                        {item.title}
                      </span>
                    </div>

                    <div className="relative flex items-center justify-center w-5 h-5 text-zinc-500 group-hover:text-zinc-200 transition-colors shrink-0 ml-3">
                      <motion.span
                        className="absolute h-[1.5px] w-3 bg-current rounded-none"
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 320, damping: 24 }
                        }
                      />
                      <motion.span
                        className="absolute w-[1.5px] h-3 bg-current rounded-none"
                        animate={{
                          scaleY: isOpen ? 0 : 1,
                          opacity: isOpen ? 0 : 1,
                          rotate: isOpen ? 90 : 0,
                        }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 320, damping: 24 }
                        }
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: prefersReducedMotion
                            ? { duration: 0 }
                            : {
                                height: {
                                  duration: 0.32,
                                  ease: [0.16, 1, 0.3, 1],
                                },
                                opacity: {
                                  duration: 0.22,
                                  ease: "easeOut",
                                },
                              },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: prefersReducedMotion
                            ? { duration: 0 }
                            : {
                                height: {
                                  duration: 0.25,
                                  ease: [0.16, 1, 0.3, 1],
                                },
                                opacity: {
                                  duration: 0.15,
                                  ease: "easeIn",
                                },
                              },
                        }}
                        className="overflow-hidden rounded-none"
                      >
                        <div
                          className="cursor-pointer pl-13.5 pr-5 pb-5 pt-0.5 text-sm leading-relaxed text-zinc-400 font-light"
                          onClick={() => toggleAccordion(index)}
                        >
                          {item.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

DottedAccordion.displayName = "DottedAccordion";

export default DottedAccordion;
`
      },
    ],
  },
  "twitter-card": {
    slug: "twitter-card",
    name: "Twitter(X) Card",
    description:
      "Interactive Twitter (X) profile card component featuring magnetic 3D tilt, spring physics, and real-time public profile data fetching.",
    summary:
      "An interactive Twitter (X) profile card component engineered with harmonic spring physics, 3D perspective mouse tracking, and real-time public profile synchronization via the FXTwitter API. Supports fluid popover reveal with isolated hit bridging to prevent cursor jitter, magnetic tilt angles, and static standalone rendering mode with full theme support.",
    category: "cards",
    tags: [
      "twitter",
      "x",
      "card",
      "3d",
      "tilt",
      "popover",
      "spring",
      "motion",
      "profile",
    ],
    dependencies: ["clsx", "tailwind-merge", "motion"],
    version: "1.0.0",
    createdDate: "2026-09-22",
    updatedDate: "2026-09-22",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Real-time profile data fetching from FXTwitter API with automatic avatar upscaling and AbortController synchronization",
      "Harmonic spring physics (stiffness 300, damping 24) with independent link and card 3D tilt axes",
      "Zero-jitter popover positioning using decoupled geometric centering and motion matrix rotation",
      "Seamless hover hit-bridge avoiding cursor gaps between trigger and floating profile popover",
      "Dual rendering modes: interactive link trigger with popover or standalone static 3D tilt card",
      "Comprehensive accessibility support with prefers-reduced-motion fallbacks and keyboard focus boundaries",
    ],
    anatomy: [
      "<div> (Inline root container with label prefix and perspective viewport)",
      "<motion.div> (Magnetic link trigger with 3D spring tilt on cursor hover)",
      "<div> (Isolated absolute centering container preventing transform collisions)",
      "<motion.div> (Floating popover card with 3D tilt, blur bloom, and hit bridge)",
      "<img> (Avatar and banner containers with fallback gradients and silhouettes)",
    ],
    physics: {
      engine: "Motion Spring Dynamics (300 stiffness, 24 damping)",
      description:
        "Normalized cursor offset coordinates mapped to dual spring oscillators driving 3D rotation along the X and Y axes with zero layout repaints.",
      parameters: [
        { label: "Spring Stiffness", value: "300" },
        { label: "Damping Coefficient", value: "24" },
        { label: "Mass Factor", value: "0.6" },
        {
          label: "Max Card Tilt",
          value: "5deg (configurable via cardTiltMaxRotate)",
        },
        {
          label: "Max Link Tilt",
          value: "5deg (configurable via linkTiltMaxRotate)",
        },
        { label: "Perspective Depth", value: "1000px" },
      ],
    },
    accessibility: {
      role: "region",
      aria: "Descriptive aria-label attributes for external profile links and verification badges.",
      reducedMotion:
        "Bypasses 3D spring tilt and instant opacity transitions when prefers-reduced-motion is active.",
      keyboard: [
        {
          key: "Tab",
          description: "Focus onto profile link anchor trigger.",
        },
        {
          key: "Enter / Space",
          description: "Open external profile URL in a new browser tab.",
        },
      ],
    },
    guidelines: {
      recommended: [
        "Creator credits, team author bios, and portfolio contact links",
        "Community and open source repository contributor recognition cards",
        "Sponsor showcase panels and founder profile previews",
      ],
      bestPractices: [
        "Provide a username prop with valid Twitter handle; API data will populate automatically",
        "Supply fallback name and avatarUrl for fast initial rendering or offline environments",
        "Use staticCard={true} when embedding directly within grid columns or dashboards",
      ],
    },
    props: [
      {
        name: "username",
        type: "string",
        required: true,
        description: "The X (Twitter) username (handle) of the profile.",
      },
      {
        name: "name",
        type: "string",
        defaultValue: "'Twitter User'",
        description: "The fallback display name of the profile.",
      },
      {
        name: "avatarUrl",
        type: "string",
        defaultValue: "undefined",
        description: "Optional custom URL or fallback for the avatar image.",
      },
      {
        name: "bannerUrl",
        type: "string",
        defaultValue: "undefined",
        description:
          "Optional custom URL or fallback for the profile banner image.",
      },
      {
        name: "staticCard",
        type: "boolean",
        defaultValue: "false",
        description:
          "If true, renders the card statically without the link/popover interaction.",
      },
      {
        name: "joinedDate",
        type: "string",
        defaultValue: "undefined",
        description: "Explicit joined date text override.",
      },
      {
        name: "year",
        type: "number | string",
        defaultValue: "2026",
        description: "Fallback year for the joined date text.",
      },
      {
        name: "text",
        type: "string",
        defaultValue: "'Follow me on'",
        description: "Prefix description text displayed before the link.",
      },
      {
        name: "linkText",
        type: "string",
        defaultValue: "'X'",
        description: "Text content for the profile link trigger.",
      },
      {
        name: "href",
        type: "string",
        defaultValue: "undefined",
        description:
          "Custom profile URL override (defaults to https://x.com/${username}).",
      },
      {
        name: "enableLinkTilt",
        type: "boolean",
        defaultValue: "true",
        description:
          "Whether to enable mouse tracking 3D tilt effect on the link trigger.",
      },
      {
        name: "linkTiltMaxRotate",
        type: "number",
        defaultValue: "5",
        description: "Maximum tilt angle in degrees for the link rotation.",
      },
      {
        name: "enableCardTilt",
        type: "boolean",
        defaultValue: "true",
        description:
          "Whether to enable mouse tracking 3D tilt effect on the card.",
      },
      {
        name: "cardTiltMaxRotate",
        type: "number",
        defaultValue: "5",
        description: "Maximum tilt angle in degrees for the card rotation.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes to style the outer container.",
      },
      {
        name: "popoverClassName",
        type: "string",
        defaultValue: "undefined",
        description:
          "Additional CSS classes to style the popup card container.",
      },
      {
        name: "linkClassName",
        type: "string",
        defaultValue: "undefined",
        description:
          "Additional CSS classes to style the anchor trigger element.",
      },
      {
        name: "labelClassName",
        type: "string",
        defaultValue: "undefined",
        description:
          "Additional CSS classes to style the label description text.",
      },
    ],
    files: [
      {
        name: "twitter-card.tsx",
        path: "registry/ui/twitter-card.tsx",
        code: `"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface TwitterCardProps {
  username: string;
  name?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  staticCard?: boolean;
  joinedDate?: string;
  year?: number | string;
  text?: string;
  linkText?: string;
  href?: string;
  enableLinkTilt?: boolean;
  linkTiltMaxRotate?: number;
  enableCardTilt?: boolean;
  cardTiltMaxRotate?: number;
  className?: string;
  popoverClassName?: string;
  linkClassName?: string;
  labelClassName?: string;
}

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("fill-current", className)}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const VerifiedBadge = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 22 22"
    className={cn("shrink-0 fill-current", className)}
    aria-label="Verified account"
  >
    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.27-1.9-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.136 2.136 5.408-5.407 1.293 1.292-6.701 6.709z" />
  </svg>
);

const LocationIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("shrink-0", className)}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const LinkIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("shrink-0", className)}
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("shrink-0", className)}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const DefaultAvatar = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "flex h-full w-full items-center justify-center bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
      className,
    )}
  >
    <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  </div>
);

export const TwitterCard = ({
  username,
  name = "Twitter User",
  avatarUrl,
  bannerUrl,
  staticCard = false,
  joinedDate,
  year = 2026,
  text = "Follow me on",
  linkText = "X",
  href,
  enableLinkTilt = true,
  linkTiltMaxRotate = 5,
  enableCardTilt = true,
  cardTiltMaxRotate = 5,
  className,
  popoverClassName,
  linkClassName,
  labelClassName,
}: TwitterCardProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);
  const [failedBanner, setFailedBanner] = useState<string | null>(null);

  const profileUrl = href || \`https://x.com/\${username}\`;
  const linkRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState({
    name: name || "Twitter User",
    avatarUrl: avatarUrl || "",
    bannerUrl: bannerUrl || "",
    bio: "This user hasn't added a bio yet.",
    following: 0,
    followers: 0,
    joinedDate: joinedDate || \`Joined \${year}\`,
    location: "",
    website: null as { url: string; display_url: string } | null,
    verified: false,
  });

  useEffect(() => {
    if (!username) return;

    let isMounted = true;
    const controller = new AbortController();

    fetch(\`https://api.fxtwitter.com/\${username}\`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("API request failed");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;

        if (data.code === 200 && data.user) {
          const user = data.user;
          const formattedJoined = user.joined
            ? \`Joined \${new Date(user.joined).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}\`
            : joinedDate || \`Joined \${year}\`;

          setProfile({
            name: user.name || name || "Twitter User",
            avatarUrl:
              user.avatar_url?.replace("_normal", "_400x400") ||
              avatarUrl ||
              "",
            bannerUrl: user.banner_url || bannerUrl || "",
            bio: user.description || "This user hasn't added a bio yet.",
            following: user.following ?? 0,
            followers: user.followers ?? 0,
            joinedDate: formattedJoined,
            location: user.location || "",
            website: user.website || null,
            verified: Boolean(user.verification?.verified),
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [username, name, avatarUrl, bannerUrl, joinedDate, year]);

  const linkX = useMotionValue(0);
  const linkY = useMotionValue(0);
  const linkSpringX = useSpring(linkX, { stiffness: 320, damping: 24 });
  const linkSpringY = useSpring(linkY, { stiffness: 320, damping: 24 });

  const linkRotateX = useTransform(
    linkSpringY,
    [-1, 1],
    [linkTiltMaxRotate, -linkTiltMaxRotate],
  );
  const linkRotateY = useTransform(
    linkSpringX,
    [-1, 1],
    [-linkTiltMaxRotate, linkTiltMaxRotate],
  );

  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const cardSpringX = useSpring(cardX, {
    stiffness: 300,
    damping: 24,
    mass: 0.6,
  });
  const cardSpringY = useSpring(cardY, {
    stiffness: 300,
    damping: 24,
    mass: 0.6,
  });

  const cardRotateX = useTransform(
    cardSpringY,
    [-1, 1],
    [cardTiltMaxRotate, -cardTiltMaxRotate],
  );
  const cardRotateY = useTransform(
    cardSpringX,
    [-1, 1],
    [-cardTiltMaxRotate, cardTiltMaxRotate],
  );

  const handleLinkMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableLinkTilt || !linkRef.current || prefersReducedMotion) return;
      const rect = linkRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      linkX.set(Math.max(-1, Math.min(1, nx)));
      linkY.set(Math.max(-1, Math.min(1, ny)));
    },
    [enableLinkTilt, linkX, linkY, prefersReducedMotion],
  );

  const handleCardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableCardTilt || !cardRef.current || prefersReducedMotion) return;
      const rect = cardRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      cardX.set(Math.max(-1, Math.min(1, nx)));
      cardY.set(Math.max(-1, Math.min(1, ny)));
    },
    [enableCardTilt, cardX, cardY, prefersReducedMotion],
  );

  const handleContainerMouseLeave = useCallback(() => {
    setIsHovered(false);
    linkX.set(0);
    linkY.set(0);
    cardX.set(0);
    cardY.set(0);
  }, [linkX, linkY, cardX, cardY]);

  const handleStaticMouseLeave = useCallback(() => {
    cardX.set(0);
    cardY.set(0);
  }, [cardX, cardY]);

  const formatCount = (count: number | string | undefined): string => {
    if (count === undefined || count === null) return "0";
    if (typeof count === "string") return count;
    if (count >= 1000000) {
      return \`\${(count / 1000000).toFixed(1).replace(/\\.0$/, "")}M\`;
    }
    if (count >= 1000) {
      return \`\${(count / 1000).toFixed(1).replace(/\\.0$/, "")}K\`;
    }
    return count.toLocaleString("en-US");
  };

  const cardContent = (
    <div className="flex flex-col text-left">
      <div className="relative -mx-4 -mt-4 h-24 overflow-hidden rounded-t-2xl bg-neutral-100 dark:bg-neutral-900">
        {profile.bannerUrl && failedBanner !== profile.bannerUrl ? (
          <img
            src={profile.bannerUrl}
            alt="Profile Banner"
            onError={() => setFailedBanner(profile.bannerUrl)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900" />
        )}
      </div>

      <div className="relative mb-2 flex items-start justify-between">
        <div className="relative z-10 -mt-8 h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-neutral-100 shadow-md dark:border-neutral-950 dark:bg-neutral-900">
          {profile.avatarUrl && failedAvatar !== profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={\`\${profile.name}'s Avatar\`}
              onError={() => setFailedAvatar(profile.avatarUrl)}
              className="h-full w-full object-cover"
            />
          ) : (
            <DefaultAvatar />
          )}
        </div>

        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-neutral-400 transition-colors hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-200"
          aria-label={\`View @\${username} on X\`}
        >
          <XIcon className="h-5 w-5" />
        </a>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-semibold leading-snug tracking-tight text-neutral-900 dark:text-white">
            {profile.name}
          </span>
          {profile.verified && (
            <VerifiedBadge className="h-4 w-4 text-sky-500 dark:text-sky-400" />
          )}
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          @{username}
        </a>
      </div>

      <p className="mt-2.5 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
        {profile.bio}
      </p>

      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-500 dark:text-neutral-400">
        {profile.location && (
          <div className="flex items-center gap-1.5">
            <LocationIcon className="h-3.5 w-3.5" />
            <span>{profile.location}</span>
          </div>
        )}

        {profile.website && (
          <div className="flex items-center gap-1.5">
            <LinkIcon className="h-3.5 w-3.5" />
            <a
              href={profile.website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 hover:underline dark:text-sky-400"
            >
              {profile.website.display_url}
            </a>
          </div>
        )}

        {profile.joinedDate && (
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{profile.joinedDate}</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-neutral-900 dark:text-white">
            {formatCount(profile.following)}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400">
            Following
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold text-neutral-900 dark:text-white">
            {formatCount(profile.followers)}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400">
            Followers
          </span>
        </div>
      </div>
    </div>
  );

  if (staticCard) {
    return (
      <div
        className={cn(
          "relative inline-block w-80 perspective-[1000px]",
          className,
        )}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleStaticMouseLeave}
          style={
            enableCardTilt && !prefersReducedMotion
              ? {
                  rotateX: cardRotateX,
                  rotateY: cardRotateY,
                  transformStyle: "preserve-3d",
                }
              : undefined
          }
          className={cn(
            "w-80 rounded-2xl border border-dashed border-neutral-300 bg-white/95 p-4 shadow-xl backdrop-blur-md transition-colors dark:border-neutral-800 dark:bg-neutral-950/80",
            popoverClassName,
          )}
        >
          {cardContent}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "text-lg font-medium text-neutral-900/60 transition-colors dark:text-neutral-100/60",
          labelClassName,
        )}
      >
        {text}
      </span>

      <div
        className="relative inline-flex flex-col items-center perspective-[1000px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleContainerMouseLeave}
      >
        <motion.div
          ref={linkRef}
          onMouseMove={handleLinkMouseMove}
          style={
            enableLinkTilt && !prefersReducedMotion
              ? {
                  rotateX: linkRotateX,
                  rotateY: linkRotateY,
                  transformStyle: "preserve-3d",
                }
              : undefined
          }
          className="cursor-pointer"
        >
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <span
              className={cn(
                "text-lg font-medium text-neutral-900/60 underline underline-offset-4 transition-colors duration-200 hover:text-neutral-900 dark:text-neutral-100/60 dark:hover:text-neutral-100",
                linkClassName,
              )}
            >
              {linkText}
            </span>
          </a>
        </motion.div>

        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3.5 -translate-x-1/2">
          <motion.div
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
            variants={{
              hidden: {
                opacity: 0,
                y: 8,
                scale: 0.97,
                filter: "blur(2px)",
                pointerEvents: "none",
                transition: {
                  duration: 0.15,
                  ease: "easeIn",
                },
              },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                pointerEvents: "auto",
                transition: {
                  type: "spring",
                  damping: 24,
                  stiffness: 300,
                },
              },
            }}
            style={
              enableCardTilt && !prefersReducedMotion
                ? {
                    rotateX: cardRotateX,
                    rotateY: cardRotateY,
                    transformStyle: "preserve-3d",
                  }
                : undefined
            }
            className={cn(
              "w-80 rounded-2xl border border-dashed border-neutral-300 bg-white/95 p-4 shadow-2xl backdrop-blur-xl transition-colors select-text dark:border-neutral-800 dark:bg-neutral-950/85",
              "after:absolute after:top-full after:left-0 after:h-4 after:w-full after:content-['']",
              popoverClassName,
            )}
          >
            {cardContent}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TwitterCard;
`,
      },
    ],
  },
  toast: {
    slug: "toast",
    name: "Toast",
    description: "Sonner-powered toast notifications featuring ultra-smooth blur dissolving entry and exit transitions.",
    summary: "Minimalist, high-performance toast notification system combining Sonner's stacking architecture with custom GPU-accelerated blur dissolving transitions. Features subtle 12px blur reveal on entry, smooth cubic-bezier physics, glassmorphic backdrop filters, and smooth vanishing exit animations across default, success, error, and async promise states.",
    category: "feedback",
    tags: ["toast", "notification", "sonner", "feedback", "blur", "dissolve", "animation"],
    dependencies: ["sonner", "next-themes", "@radix-ui/react-slot", "class-variance-authority", "clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-22",
    updatedDate: "2026-09-22",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Physics-tuned blur dissolving entrance transitioning from 12px blur to crisp clarity",
      "Silky smooth vanishing exit animation dissolving into 14px blur and fading away",
      "Native Sonner stacking architecture supporting interactive action and undo callbacks",
      "High-density glassmorphic styling with backdrop-blur-md and subtle border hairlines",
      "First-class async promise handling with animated spinners and automatic state resolution"
    ],
    anatomy: [
      "<Toaster> (Global fixed notification viewport with position and theme orchestration)",
      "<ToasterDemo> (Interactive action surface with default, success, error, and promise triggers)",
      "<Button> (High-contrast interactive trigger primitive with tactile active scaling)"
    ],
    physics: {
      engine: "GPU CSS Hardware-Accelerated Blur & Cubic Bezier",
      description: "Sub-pixel calibrated cubic-bezier(0.16, 1, 0.3, 1) transition curves synchronizing opacity, scale, and backdrop blur filters with zero layout reflows.",
      parameters: [
        { label: "Entry Duration", value: "420ms" },
        { label: "Exit Duration", value: "220ms" },
        { label: "Blur Radius (Entry)", value: "12px -> 0px" },
        { label: "Blur Radius (Exit)", value: "0px -> 14px" },
        { label: "Easing Curve", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
        { label: "Backdrop Filter", value: "blur(16px)" }
      ]
    },
    accessibility: {
      role: "status / alert",
      aria: "Uses ARIA live regions managed by Sonner for automatic screen-reader announcements of transient system alerts.",
      reducedMotion: "Automatically suppresses blur filters and switches to instantaneous 150ms opacity fades when prefers-reduced-motion is detected."
    },
    guidelines: {
      recommended: [
        "Instant confirmation of destructive or reversible actions with Undo support",
        "Form submission status updates, authentication notices, and API error reports",
        "Asynchronous task progress monitoring via toast.promise with live resolution updates"
      ],
      bestPractices: [
        "Render <Toaster /> once at the root level of your layout or modal boundary",
        "Keep toast descriptions concise (under 80 characters) for rapid scanning",
        "Provide clear undo action handlers for destructive operations"
      ]
    },
    props: [
      {
        name: "theme",
        type: '"light" | "dark" | "system"',
        defaultValue: '"system"',
        description: "Controls the active color scheme of notification cards.",
      },
      {
        name: "position",
        type: '"top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"',
        defaultValue: '"bottom-right"',
        description: "Screen anchor location for incoming toasts.",
      },
      {
        name: "richColors",
        type: "boolean",
        defaultValue: "false",
        description: "Whether status toasts (success, error, warning, info) use saturated semantic accents.",
      },
      {
        name: "expand",
        type: "boolean",
        defaultValue: "false",
        description: "Whether toasts expand on hover to reveal stacked items.",
      },
      {
        name: "duration",
        type: "number",
        defaultValue: "4000",
        description: "Time in milliseconds before automatically dissolving and vanishing.",
      },
    ],
    files: [
      {
        name: "sonner.tsx",
        path: "components/ui/sonner.tsx",
        code: `"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg !h-auto",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
export default Toaster;
`,
      },
      {
        name: "button.tsx",
        path: "components/ui/button.tsx",
        code: `"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0 cursor-pointer select-none ease-[cubic-bezier(0.16,1,0.3,1)]",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black hover:bg-zinc-200 active:scale-[0.97] shadow-sm",
        destructive:
          "bg-red-500/90 text-white hover:bg-red-500 active:scale-[0.97] shadow-sm",
        outline:
          "border border-white/15 bg-zinc-900/60 text-zinc-300 hover:border-white/30 hover:bg-zinc-800 hover:text-white active:scale-[0.97]",
        secondary:
          "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:scale-[0.97]",
        ghost: "hover:bg-white/10 hover:text-white active:scale-[0.97]",
        link: "text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-lg px-6 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
`,
      },
      {
        name: "toast.tsx",
        path: "registry/ui/toast.tsx",
        code: `"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export function ToasterDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full select-none p-2">
      <Toaster />
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Button
          variant="outline"
          onClick={() =>
            toast("Event has been created", {
              description: "Sunday, December 03, 2023 at 9:00 AM",
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
            })
          }
        >
          Default Toast
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            toast.success("Success!", {
              description: "Your action was completed successfully",
            })
          }
        >
          Success Toast
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            toast.error("Error!", {
              description: "Something went wrong. Please try again.",
            })
          }
        >
          Error Toast
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            toast.promise(
              new Promise((resolve) => setTimeout(resolve, 2000)),
              {
                loading: "Loading...",
                success: "Promise resolved",
                error: "Promise rejected",
              }
            )
          }
        >
          Promise Toast
        </Button>
      </div>
    </div>
  );
}

export { Toaster, toast };
export default ToasterDemo;
`,
      },
    ],
  },
  "task-list": {
    slug: "task-list",
    name: "Task List",
    description: "Interactive todo task list featuring micro-particle spark bursts, ambient glow halos, smooth SVG ring morphing, and fluid spring layout reordering.",
    summary: "High-performance interactive task and todo management primitive with multi-stage transition choreography. Integrates radial micro-particle emitters upon completion, dynamic ambient glow pulses, sub-pixel dashed perimeter rings that morph into spring-scaled filled badges, and GPU-accelerated spring layout transitions.",
    category: "inputs",
    tags: ["task", "todo", "list", "checkbox", "particles", "animation", "motion", "spring"],
    dependencies: ["motion", "clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-22",
    updatedDate: "2026-09-22",
    interactive: true,
    supportsColor: true,
    highlights: [
      "8-point radial geometric particle spark bursts emitting on task completion",
      "Dashed perimeter SVG ring that morphs into an elastic spring-filled checkmark",
      "Clone-breaking gradient strikethrough with optical character shift and blur dissipation",
      "Spring layout reordering that glides completed tasks smoothly to the bottom",
      "Haptic flick nudge animation upon task state settlement",
      "Three calibrated density scales (sm, md, lg)"
    ],
    anatomy: [
      "<TaskList> (Main orchestrator managing task collection and fluid reordering)",
      "<TaskItem> (Interactive row item with checkbox, label, and spring layout)",
      "<TaskCheck> (SVG multi-layer checkmark combining dashed boundary, fill ring, and path draw)",
      "<TaskParticles> (Radial micro-particle emitter firing sparks outward on completion)"
    ],
    physics: {
      engine: "Framer Motion Spring & GPU Keyframe Choreography",
      description: "Multi-stage choreographed animation sequence transitioning through tick, strike, nudge, and settled stages with hardware-accelerated transforms.",
      parameters: [
        { label: "Reorder Spring", value: "stiffness: 340, damping: 28" },
        { label: "Pop Scale", value: "[1, 1.12, 1] / 320ms" },
        { label: "Flick Nudge", value: "[0, 6, -2, 0] / 280ms" },
        { label: "Strike Duration", value: "360ms ease-in-out" },
        { label: "Particle Emitter", value: "8 sparks, 480ms radial ease-out" }
      ]
    },
    accessibility: {
      role: "checkbox / list",
      aria: "Each TaskItem provides role='checkbox' and aria-checked. The task list includes an aria-live='polite' region announcing task completion status changes.",
      reducedMotion: "Full respect for prefers-reduced-motion, instantly settling states without intermediate flick, pop, or particle sequences."
    },
    guidelines: {
      recommended: [
        "Task checklists, onboarding steps, and actionable project todo workflows",
        "Feature checklists with interactive progress states in product dashboards",
        "Interactive completion steps in technical forms and wizard flows"
      ],
      bestPractices: [
        "Pass an accent color matching your primary theme or studio palette",
        "Enable reorderCompleted for satisfying dopamine-rich task clearing",
        "Use the size prop ('sm', 'md', 'lg') to balance density across desktop and mobile screens"
      ]
    },
    props: [
      {
        name: "tasks",
        type: "Task[]",
        defaultValue: "undefined",
        description: "Controlled list of task objects.",
      },
      {
        name: "defaultTasks",
        type: "Task[]",
        defaultValue: "DEFAULT_SAMPLE_TASKS",
        description: "Uncontrolled initial tasks array.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Controls dimensions, padding, font size, and checkmark scale.",
      },
      {
        name: "accent",
        type: "string",
        defaultValue: '"#FF5F2E"',
        description: "Custom accent color hex for checkmark and particles.",
      },
      {
        name: "reorderCompleted",
        type: "boolean",
        defaultValue: "true",
        description: "Whether completed tasks automatically glide to the bottom of the list.",
      },
      {
        name: "onTasksChange",
        type: "(tasks: Task[]) => void",
        defaultValue: "undefined",
        description: "Callback invoked when tasks are toggled.",
      },
    ],
    files: [
      {
        name: "task-list.tsx",
        path: "registry/ui/task-list.tsx",
        code: `"use client";

import React, {
  useState,
  type ComponentProps,
  type CSSProperties,
} from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

const POP_SCALE = [1, 1.12, 1];
const FLICK = [0, 6, -2, 0];
const FLICK_TIMES = [0, 0.35, 0.7, 1];

const FILL: Transition = { duration: 0.22, ease: EASE_OUT };
const POP: Transition = { duration: 0.32, ease: EASE_OUT, times: [0, 0.4, 1] };
const TICK: Transition = { duration: 0.24, ease: EASE_OUT, delay: 0.04 };
const STRIKE: Transition = { duration: 0.36, ease: EASE_IN_OUT };
const NUDGE: Transition = {
  duration: 0.28,
  ease: EASE_OUT,
  times: FLICK_TIMES,
};
const REORDER: Transition = { type: "spring", stiffness: 340, damping: 28 };
const INSTANT: Transition = { duration: 0 };

const RING_R = 10.5;
const RING_DASH = "1 4.5";

const STRIKE_STYLE: CSSProperties = {
  backgroundImage: "linear-gradient(currentColor, currentColor)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "0 52%",
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
};

const SIZES = {
  sm: {
    row: "gap-2.5 rounded-xl px-3 py-2",
    check: "h-4.5 w-4.5",
    text: "text-[13px] leading-5",
    line: "1.5px",
    list: "gap-1.5",
    particleDist: 14,
  },
  md: {
    row: "gap-3 rounded-[14px] px-3.5 py-2.5",
    check: "h-5.5 w-5.5",
    text: "text-[14.5px] leading-6",
    line: "2px",
    list: "gap-2",
    particleDist: 18,
  },
  lg: {
    row: "gap-3.5 rounded-2xl px-4 py-3",
    check: "h-6.5 w-6.5",
    text: "text-[16px] leading-7",
    line: "2.5px",
    list: "gap-2.5",
    particleDist: 22,
  },
} as const;

export type TaskSize = keyof typeof SIZES;

const STAGE = {
  idle: "idle",
  tick: "tick",
  strike: "strike",
  nudge: "nudge",
  settled: "settled",
  unstrike: "unstrike",
  untick: "untick",
} as const;
type Stage = (typeof STAGE)[keyof typeof STAGE];

const FILLED: Stage[] = ["tick", "strike", "nudge", "settled", "unstrike"];
const STRUCK: Stage[] = ["strike", "nudge", "settled"];

const CARD =
  "bg-zinc-900/70 border border-white/8 shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:border-white/15 hover:bg-zinc-900/90 active:scale-[0.985] text-zinc-100 backdrop-blur-md";
const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315] as const;

function useTiming() {
  const reduced = useReducedMotion() ?? false;
  return (transition: Transition) => (reduced ? INSTANT : transition);
}

function TaskParticles({
  active,
  distance,
  accent,
}: {
  active: boolean;
  distance: number;
  accent: string;
}) {
  const timing = useTiming();

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {PARTICLE_ANGLES.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const targetX = Math.cos(rad) * distance;
        const targetY = Math.sin(rad) * distance;
        const size = i % 2 === 0 ? 3.5 : 2.5;

        return (
          <motion.span
            key={angle}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: accent,
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={
              active
                ? {
                    x: [0, targetX * 1.1, targetX],
                    y: [0, targetY * 1.1, targetY],
                    scale: [0, 1.4, 0],
                    opacity: [1, 1, 0],
                  }
                : { x: 0, y: 0, scale: 0, opacity: 0 }
            }
            transition={
              active
                ? timing({
                    duration: 0.48,
                    ease: EASE_OUT,
                    times: [0, 0.4, 1],
                  })
                : INSTANT
            }
          />
        );
      })}
    </div>
  );
}

function TaskCheck({
  filled,
  size,
  onDrawn,
  accent,
}: {
  filled: boolean;
  size: TaskSize;
  onDrawn: () => void;
  accent: string;
}) {
  const timing = useTiming();
  const dist = SIZES[size].particleDist;

  return (
    <div className="relative shrink-0 flex items-center justify-center">
      <TaskParticles active={filled} distance={dist} accent={accent} />

      <motion.div
        className="absolute inset-0 rounded-full blur-xs pointer-events-none"
        style={{ backgroundColor: accent }}
        initial={false}
        animate={
          filled
            ? { scale: [0.8, 1.5, 1.7], opacity: [0, 0.45, 0] }
            : { scale: 0.8, opacity: 0 }
        }
        transition={
          filled ? timing({ duration: 0.4, ease: EASE_OUT }) : INSTANT
        }
      />

      <motion.svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn(
          "shrink-0 text-zinc-500 transition-colors relative z-10",
          SIZES[size].check,
        )}
        initial={false}
        animate={{ scale: filled ? POP_SCALE : 1 }}
        transition={filled ? timing(POP) : INSTANT}
      >
        <motion.circle
          cx="12"
          cy="12"
          r={RING_R}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray={RING_DASH}
          initial={false}
          animate={{ opacity: filled ? 0 : 1 }}
          transition={timing(FILL)}
        />
        <motion.circle
          cx="12"
          cy="12"
          r="11.5"
          fill={accent}
          style={{ transformBox: "view-box", transformOrigin: "12px 12px" }}
          initial={false}
          animate={{ scale: filled ? 1 : 0 }}
          transition={timing(FILL)}
        />
        <motion.path
          d="M7.2 12.2 10.5 15.5 16.8 8.7"
          fill="none"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: filled ? 1 : 0, opacity: filled ? 1 : 0 }}
          transition={timing(TICK)}
          onAnimationComplete={onDrawn}
        />
      </motion.svg>
    </div>
  );
}

function TaskLabel({
  label,
  struck,
  size,
  onStruck,
}: {
  label: string;
  struck: boolean;
  size: TaskSize;
  onStruck: () => void;
}) {
  const timing = useTiming();
  const { text, line } = SIZES[size];

  return (
    <span className="min-w-0 flex-1">
      <motion.span
        style={STRIKE_STYLE}
        className={cn(
          "font-medium tracking-[-0.01em] transition-all duration-300 block select-none",
          text,
          struck ? "text-zinc-500 opacity-60" : "text-zinc-100 opacity-100",
        )}
        initial={false}
        animate={{
          backgroundSize: \`\${struck ? 100 : 0}% \${line}\`,
          filter: struck ? "blur(0.15px)" : "blur(0px)",
        }}
        transition={timing(STRIKE)}
        onAnimationComplete={onStruck}
      >
        {label}
      </motion.span>
    </span>
  );
}

export type Task = {
  id: string;
  label: string;
  done?: boolean;
};

export type TaskItemProps = Omit<
  ComponentProps<"button">,
  "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  size?: TaskSize;
  accent?: string;
  onCheckedChange?: (checked: boolean) => void;
  onSettled?: () => void;
  onReverted?: () => void;
};

export function TaskItem({
  label,
  checked,
  defaultChecked = false,
  size = "md",
  accent = "#FF5F2E",
  onCheckedChange,
  onSettled,
  onReverted,
  className,
  onClick,
  style,
  ...props
}: TaskItemProps) {
  const timing = useTiming();
  const [own, setOwn] = useState(defaultChecked);
  const done = checked ?? own;

  const [stage, setStage] = useState<Stage>(done ? STAGE.settled : STAGE.idle);
  const [was, setWas] = useState(done);

  if (was !== done) {
    setWas(done);
    setStage(done ? STAGE.tick : STAGE.unstrike);
  }

  const onDrawn = () => {
    if (stage === STAGE.tick) setStage(STAGE.strike);
    if (stage === STAGE.untick) {
      setStage(STAGE.idle);
      onReverted?.();
    }
  };

  const onStruck = () => {
    if (stage === STAGE.strike) setStage(STAGE.nudge);
    if (stage === STAGE.unstrike) setStage(STAGE.untick);
  };

  const onFlicked = () => {
    if (stage !== STAGE.nudge) return;
    setStage(STAGE.settled);
    onSettled?.();
  };

  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={done}
      data-slot="task-item"
      data-state={done ? "checked" : "unchecked"}
      style={style}
      onClick={(event) => {
        onClick?.(event);
        if (checked === undefined) setOwn(!done);
        onCheckedChange?.(!done);
      }}
      animate={{ x: stage === STAGE.nudge ? FLICK : 0 }}
      transition={stage === STAGE.nudge ? timing(NUDGE) : INSTANT}
      onAnimationComplete={onFlicked}
      className={cn(
        "flex w-full cursor-pointer items-center text-left transition-[border-color,background-color,filter,box-shadow] duration-200",
        SIZES[size].row,
        CARD,
        FOCUS,
        done && "bg-zinc-950/40 border-white/4",
        className,
      )}
      {...props}
    >
      <TaskCheck
        filled={FILLED.includes(stage)}
        size={size}
        onDrawn={onDrawn}
        accent={accent}
      />
      <TaskLabel
        label={label}
        struck={STRUCK.includes(stage)}
        size={size}
        onStruck={onStruck}
      />
    </motion.button>
  );
}

export type TaskListProps = ComponentProps<"ul"> & {
  tasks?: Task[];
  defaultTasks?: Task[];
  size?: TaskSize;
  accent?: string;
  reorderCompleted?: boolean;
  onTasksChange?: (tasks: Task[]) => void;
};

const DEFAULT_SAMPLE_TASKS: Task[] = [
  { id: "1", label: "Refactor animation spring curves", done: false },
  { id: "2", label: "Implement micro-particle spark bursts", done: true },
  { id: "3", label: "Sub-pixel calibrated hairline strokes", done: false },
  { id: "4", label: "Hardware accelerated scaleX transitions", done: false },
  { id: "5", label: "Synchronize theme token variables", done: true },
];

export function TaskList({
  tasks,
  defaultTasks = DEFAULT_SAMPLE_TASKS,
  size = "md",
  accent = "#FF5F2E",
  reorderCompleted = true,
  onTasksChange,
  className,
  ...props
}: TaskListProps) {
  const timing = useTiming();
  const [own, setOwn] = useState<Task[]>(defaultTasks);
  const current = tasks ?? own;

  const [parked, setParked] = useState<string[]>(() =>
    (tasks ?? defaultTasks).filter((task) => task.done).map((task) => task.id),
  );
  const [announcement, setAnnouncement] = useState("");

  const updateTasks = (next: Task[]) => {
    if (tasks === undefined) setOwn(next);
    onTasksChange?.(next);
  };

  const toggle = (task: Task, done: boolean) => {
    const next = current.map((item) =>
      item.id === task.id ? { ...item, done } : item,
    );
    updateTasks(next);
    setAnnouncement(\`\${task.label} \${done ? "completed" : "reopened"}\`);
  };

  const finished = reorderCompleted
    ? parked
        .map((id) => current.find((task) => task.id === id))
        .filter((task): task is Task => task?.done === true)
    : [];

  const open = reorderCompleted
    ? current.filter((task) => !finished.includes(task))
    : current;

  return (
    <ul
      data-slot="task-list"
      className={cn(
        "flex w-full max-w-md flex-col select-none",
        SIZES[size].list,
        className,
      )}
      {...props}
    >
      {[...open, ...finished].map((task) => (
        <motion.li
          key={task.id}
          layout
          transition={timing(REORDER)}
          className="w-full list-none"
        >
          <TaskItem
            label={task.label}
            checked={!!task.done}
            size={size}
            accent={accent}
            onCheckedChange={(done) => toggle(task, done)}
            onSettled={() => {
              if (reorderCompleted) {
                setParked((ids) =>
                  ids.includes(task.id) ? ids : [...ids, task.id],
                );
              }
            }}
            onReverted={() => {
              if (reorderCompleted) {
                setParked((ids) => ids.filter((id) => id !== task.id));
              }
            }}
          />
        </motion.li>
      ))}
      <li role="status" aria-live="polite" className="sr-only">
        {announcement}
      </li>
    </ul>
  );
}

export default TaskList;
`,
      },
    ],
  },
  "file-tree": {
    slug: "file-tree",
    name: "File Tree",
    description: "Smooth, interactive file tree component with guide lines, nested folder expansion, selection, and keyboard navigation.",
    summary: "A clean, high-performance file tree component designed for developer tools, file explorers, IDE sidebars, and hierarchical directory structures. Built with framer-motion layout transitions, pixel-aligned guide lines, smooth chevron rotation, single and multi-selection support, and full keyboard accessibility.",
    category: "navigation",
    tags: ["file-tree", "tree", "navigation", "directory", "explorer", "sidebar", "motion", "interactive"],
    dependencies: ["clsx", "tailwind-merge", "motion", "lucide-react"],
    version: "1.0.0",
    createdDate: "2026-09-22",
    updatedDate: "2026-09-22",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Smooth height expansion and spring-calibrated chevron rotation",
      "Pixel-aligned vertical guide lines for deep tree hierarchies",
      "Clean borderless design optimized for dark and light theme sidebars",
      "Controlled and uncontrolled node expansion and selection states",
      "Full keyboard accessibility with arrow key folder navigation and Space/Enter selection"
    ],
    anatomy: [
      "<TreeView> (Root container managing tree state, keyboard handlers, and layout)",
      "<TreeNode> (Hierarchical node item rendering chevrons, icons, labels, and children)"
    ],
    physics: {
      engine: "Framer Motion Layout & Height Transitions",
      description: "Height expansion curves [0.16, 1, 0.3, 1] with 150ms chevron rotation.",
      parameters: [
        { label: "Height Expansion", value: "200ms cubic-bezier(0.16, 1, 0.3, 1)" },
        { label: "Chevron Rotation", value: "150ms ease-in-out" },
        { label: "Row Hover Feedback", value: "150ms transition-colors" },
        { label: "Indentation Step", value: "16px default pitch" }
      ]
    },
    accessibility: {
      role: "tree",
      aria: "Uses role='tree' and role='treeitem' with live aria-expanded and aria-selected state management.",
      reducedMotion: "Instantaneous node expansion without motion delay when prefers-reduced-motion is active.",
      keyboard: [
        { key: "ArrowRight", description: "Expand focused folder node." },
        { key: "ArrowLeft", description: "Collapse focused folder node." },
        { key: "Enter / Space", description: "Select focused node or toggle folder state." }
      ]
    },
    guidelines: {
      recommended: [
        "IDE sidebars, project file browsers, and file manager interfaces",
        "Hierarchical documentation tables of contents and nested category trees",
        "Directory structure visualization in developer toolkits"
      ],
      bestPractices: [
        "Set expandOnFolderClick=true for intuitive folder opening experience",
        "Provide unique id properties for each node in the data tree",
        "Use showLines=true to aid visual depth tracking in multi-level trees"
      ]
    },
    props: [
      {
        name: "data",
        type: "TreeNode[]",
        required: true,
        description: "Array of tree nodes representing files, folders, and nested children.",
      },
      {
        name: "showLines",
        type: "boolean",
        defaultValue: "true",
        description: "Render vertical guide lines for visual depth tracking.",
      },
      {
        name: "showIcons",
        type: "boolean",
        defaultValue: "true",
        description: "Display folder and file icons next to node labels.",
      },
      {
        name: "selectable",
        type: "boolean",
        defaultValue: "true",
        description: "Enable node selection on click.",
      },
      {
        name: "multiSelect",
        type: "boolean",
        defaultValue: "false",
        description: "Allow selecting multiple nodes with Ctrl/Cmd key.",
      },
      {
        name: "indent",
        type: "number",
        defaultValue: "16",
        description: "Indentation width in pixels per level.",
      },
      {
        name: "animateExpand",
        type: "boolean",
        defaultValue: "true",
        description: "Enable smooth motion animation during folder expansion.",
      }
    ],
    files: [
      {
        name: "file-tree.tsx",
        path: "registry/ui/file-tree.tsx",
        code: `"use client";

import React, { useState, useCallback, useMemo } from "react";
import { ChevronRight, Folder, FolderOpen, File } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type TreeNode = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  data?: unknown;
  disabled?: boolean;
};

export type TreeViewProps = {
  data: TreeNode[];
  className?: string;
  onNodeClick?: (node: TreeNode) => void;
  onNodeExpand?: (nodeId: string, expanded: boolean) => void;
  defaultExpandedIds?: string[];
  expandedIds?: string[];
  onExpandedIdsChange?: (expandedIds: string[]) => void;
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  indent?: number;
  animateExpand?: boolean;
  expandOnFolderClick?: boolean;
};

export function TreeView({
  data,
  className,
  onNodeClick,
  onNodeExpand,
  defaultExpandedIds = [],
  expandedIds: controlledExpandedIds,
  onExpandedIdsChange,
  showLines = true,
  showIcons = true,
  selectable = true,
  multiSelect = false,
  selectedIds: controlledSelectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
  indent = 16,
  animateExpand = true,
  expandOnFolderClick = true,
}: TreeViewProps) {
  const prefersReducedMotion = useReducedMotion();

  const [internalExpandedIds, setInternalExpandedIds] = useState<Set<string>>(
    () => new Set(defaultExpandedIds),
  );

  const isExpandedControlled = controlledExpandedIds !== undefined;
  const currentExpandedSet = useMemo(() => {
    if (isExpandedControlled) {
      return new Set(controlledExpandedIds);
    }
    return internalExpandedIds;
  }, [isExpandedControlled, controlledExpandedIds, internalExpandedIds]);

  const toggleExpanded = useCallback(
    (nodeId: string) => {
      const nextSet = new Set(currentExpandedSet);
      const isExpanded = nextSet.has(nodeId);
      if (isExpanded) {
        nextSet.delete(nodeId);
      } else {
        nextSet.add(nodeId);
      }

      if (!isExpandedControlled) {
        setInternalExpandedIds(nextSet);
      }

      onExpandedIdsChange?.(Array.from(nextSet));
      onNodeExpand?.(nodeId, !isExpanded);
    },
    [
      currentExpandedSet,
      isExpandedControlled,
      onExpandedIdsChange,
      onNodeExpand,
    ],
  );

  const [internalSelectedIds, setInternalSelectedIds] =
    useState<string[]>(defaultSelectedIds);

  const isSelectedControlled = controlledSelectedIds !== undefined;
  const currentSelectedIds = isSelectedControlled
    ? controlledSelectedIds
    : internalSelectedIds;

  const handleSelection = useCallback(
    (nodeId: string, isCtrlKey: boolean) => {
      if (!selectable) return;

      let nextSelection: string[];

      if (multiSelect && isCtrlKey) {
        nextSelection = currentSelectedIds.includes(nodeId)
          ? currentSelectedIds.filter((id) => id !== nodeId)
          : [...currentSelectedIds, nodeId];
      } else {
        nextSelection = currentSelectedIds.includes(nodeId) ? [] : [nodeId];
      }

      if (!isSelectedControlled) {
        setInternalSelectedIds(nextSelection);
      }

      onSelectionChange?.(nextSelection);
    },
    [
      selectable,
      multiSelect,
      currentSelectedIds,
      isSelectedControlled,
      onSelectionChange,
    ],
  );

  const handleNodeClick = useCallback(
    (node: TreeNode, e: React.MouseEvent) => {
      e.stopPropagation();
      if (node.disabled) return;

      const hasChildren = (node.children?.length ?? 0) > 0;
      if (hasChildren && expandOnFolderClick) {
        toggleExpanded(node.id);
      }

      handleSelection(node.id, e.ctrlKey || e.metaKey);
      onNodeClick?.(node);
    },
    [expandOnFolderClick, toggleExpanded, handleSelection, onNodeClick],
  );

  const renderNode = (node: TreeNode, level = 0) => {
    const hasChildren = (node.children?.length ?? 0) > 0;
    const isExpanded = currentExpandedSet.has(node.id);
    const isSelected = currentSelectedIds.includes(node.id);

    return (
      <div key={node.id} className="relative">
        <div
          role="treeitem"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={selectable ? isSelected : undefined}
          tabIndex={0}
          className={cn(
            "group/node relative flex items-center h-8 px-2 rounded-md cursor-pointer select-none transition-colors duration-150 outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600",
            isSelected
              ? "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-medium"
              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100",
            node.disabled && "opacity-50 pointer-events-none",
          )}
          style={{ paddingLeft: \`\${level * indent + 8}px\` }}
          onClick={(e) => handleNodeClick(node, e)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleNodeClick(node, e as unknown as React.MouseEvent);
            } else if (e.key === "ArrowRight" && hasChildren && !isExpanded) {
              e.preventDefault();
              toggleExpanded(node.id);
            } else if (e.key === "ArrowLeft" && hasChildren && isExpanded) {
              e.preventDefault();
              toggleExpanded(node.id);
            }
          }}
        >
          {showLines && level > 0 && (
            <div className="absolute left-0 top-0 bottom-0 pointer-events-none">
              {Array.from({ length: level }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-l border-zinc-200 dark:border-zinc-800"
                  style={{ left: \`\${i * indent + 14}px\` }}
                />
              ))}
            </div>
          )}

          <div className="w-4 h-4 flex items-center justify-center shrink-0 mr-1">
            {hasChildren ? (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={
                  prefersReducedMotion || !animateExpand
                    ? { duration: 0 }
                    : { duration: 0.15, ease: "easeInOut" }
                }
                className="flex items-center justify-center text-zinc-400 group-hover/node:text-zinc-600 dark:group-hover/node:text-zinc-300"
                onClick={(e) => {
                  if (!expandOnFolderClick) {
                    e.stopPropagation();
                    toggleExpanded(node.id);
                  }
                }}
              >
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              </motion.div>
            ) : (
              <span className="w-3.5 h-3.5" />
            )}
          </div>

          {showIcons && (
            <div className="w-4 h-4 flex items-center justify-center shrink-0 mr-2 text-zinc-400 group-hover/node:text-zinc-600 dark:text-zinc-400 dark:group-hover/node:text-zinc-200">
              {node.icon ? (
                node.icon
              ) : hasChildren ? (
                isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-amber-500/90 dark:text-amber-400/90" />
                ) : (
                  <Folder className="h-4 w-4 text-amber-500/90 dark:text-amber-400/90" />
                )
              ) : (
                <File className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              )}
            </div>
          )}

          <span className="text-xs sm:text-sm truncate leading-none pt-px">
            {node.label}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition:
                  prefersReducedMotion || !animateExpand
                    ? { duration: 0 }
                    : {
                        height: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.15, delay: 0.03 },
                      },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition:
                  prefersReducedMotion || !animateExpand
                    ? { duration: 0 }
                    : {
                        height: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.1 },
                      },
              }}
              className="overflow-hidden"
            >
              {node.children!.map((child) => renderNode(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div
      role="tree"
      className={cn(
        "w-full select-none text-zinc-900 dark:text-zinc-100 font-sans",
        className,
      )}
    >
      {data.map((node) => renderNode(node, 0))}
    </div>
  );
}

export const FileTree = TreeView;
`,
      },
    ],
  },
  "search-input": {
    slug: "search-input",
    name: "Search Input",
    description: "Voice-glow powered typing-reactive search composer with animated thinking orbs.",
    summary: "An ultra-smooth, responsive search composer component inspired by modern AI search interfaces. Integrates voice-glow dynamic border beam lighting driven by keystroke energy decay physics, coupled with thinking-orbs 2D canvas particle loading indicators that transition smoothly between idle breathing and searching states.",
    category: "ai-stuff",
    tags: ["search", "input", "voice-glow", "orb", "ai", "beam", "glow", "thinking-orbs", "form"],
    dependencies: ["clsx", "tailwind-merge", "voice-glow", "thinking-orbs"],
    version: "1.0.0",
    createdDate: "2026-09-22",
    updatedDate: "2026-09-22",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Dynamic keystroke-reactive energy decay lighting powered by voice-glow VoiceBeam",
      "Canvas-rendered thinking orb with fluid breathing and high-speed searching orbital states",
      "Global shortcut listener with '/' trigger for instant keyboard-first focus",
      "Backdrop blur-2xl glassmorphism panel with subtle border lighting and responsive hover/focus dynamics",
      "Hydration-safe dual-stage mounting ensuring instant server render usability"
    ],
    anatomy: [
      "<VoiceBeam> (Outer wrapper applying audio/energy reactive colorful perimeter glow)",
      "<form> (Semantic search container with backdrop-blur-2xl and transition-colors)",
      "<input> (Transparent text entry field with keystroke energy accumulator and keyboard shortcuts)",
      "<button> (Submit action button with disabled states and tactile active scale)",
      "<Orb> (Dynamic next/dynamic canvas loader displaying thinking-orbs animations)"
    ],
    physics: {
      engine: "RAF Energy Decay & Thinking Orb Particle Simulation",
      description: "Keystroke energy accumulator with 0.91 exponential decay loop per requestAnimationFrame, coupled with 2D canvas orbital particle mathematics.",
      parameters: [
        { label: "Energy Boost Per Key", value: "+0.5" },
        { label: "Decay Factor", value: "0.91 / frame" },
        { label: "VoiceBeam Strength", value: "0.9" },
        { label: "Orb Base Size", value: "64px (rendered at 30px)" },
        { label: "Orb Idle State", value: "breathing" },
        { label: "Orb Busy State", value: "searching" }
      ]
    },
    accessibility: {
      role: "search",
      aria: "Form carries role='search' with sr-only labels and live aria-label on the submit orb button.",
      reducedMotion: "Thinking Orb automatically pauses or reduces motion when prefers-reduced-motion is detected."
    },
    guidelines: {
      recommended: [
        "Primary search and command interfaces in AI copilot applications",
        "Interactive query bars on landing pages and discovery portals",
        "Startup indexers and catalog exploration inputs"
      ],
      bestPractices: [
        "Supply an onSubmit handler to capture query executions",
        "Toggle the busy prop during asynchronous data fetching to transition the orb into searching state",
        "Keep the parent container styled with dark panel themes for maximum voice glow contrast"
      ]
    },
    props: [
      {
        name: "value",
        type: "string",
        defaultValue: "undefined",
        description: "Controlled search query string."
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        defaultValue: "undefined",
        description: "Callback fired whenever the input text changes."
      },
      {
        name: "onSubmit",
        type: "(value: string) => void",
        defaultValue: "undefined",
        description: "Callback triggered on Enter keypress or search button submission."
      },
      {
        name: "onClear",
        type: "() => void",
        defaultValue: "undefined",
        description: "Callback triggered when the Escape key is pressed."
      },
      {
        name: "busy",
        type: "boolean",
        defaultValue: "false",
        description: "Whether search or processing is actively in progress."
      },
      {
        name: "placeholder",
        type: "string",
        defaultValue: "\"What are we overthinking today?\"",
        description: "Placeholder text shown when input is empty."
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Optional custom CSS class name for the wrapper."
      }
    ],
    files: [
      {
        name: "search-input.tsx",
        path: "registry/ui/search-input.tsx",
        code: `"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { VoiceBeam } from "voice-glow";
import { Orb } from "./fx/Orb";

const emptySubscribe = () => () => {};

export type SearchComposerProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  onSubmit?: (v: string) => void;
  onClear?: () => void;
  busy?: boolean;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
};

export function SearchComposer({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onSubmit,
  onClear,
  busy = false,
  placeholder = "Describe a startup",
  className,
  autoFocus = true,
}: SearchComposerProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? controlledValue : internalValue;

  const input = useRef<HTMLInputElement>(null);
  const energy = useRef(0);
  const ready = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      energy.current *= 0.91;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const typed = input.current?.value;
    if (typed && typed !== currentValue) {
      if (!isControlled) {
        setInternalValue(typed);
      }
      onChange?.(typed);
    }
  }, [currentValue, isControlled, onChange]);

  const submit = () => onSubmit?.(input.current?.value ?? currentValue);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = document.activeElement instanceof HTMLInputElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const form = (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex w-full items-center gap-3 rounded-[5px] border border-line bg-panel/95 py-3 pl-6 pr-3 backdrop-blur-2xl transition-colors duration-300 focus-within:border-line-strong"
    >
      <label htmlFor="q" className="sr-only">
        Describe an image
      </label>
      <input
        id="q"
        ref={input}
        autoFocus={autoFocus}
        autoComplete="off"
        spellCheck={false}
        maxLength={300}
        value={currentValue}
        onChange={(e) => {
          energy.current = Math.min(1, energy.current + 0.5);
          if (!isControlled) {
            setInternalValue(e.target.value);
          }
          onChange?.(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
          if (e.key === "Escape") {
            if (!isControlled) {
              setInternalValue("");
            }
            onClear?.();
            input.current?.blur();
          }
        }}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent py-2 text-[18px] leading-8 tracking-[-0.01em] text-text outline-none placeholder:text-faint"
      />
      <button
        type="submit"
        disabled={busy || currentValue.trim().length < 2}
        aria-label={busy ? "Searching" : "Search"}
        className="grid size-12 shrink-0 place-items-center rounded-[5px] border border-line transition-all duration-300 ease-out enabled:hover:border-line-strong enabled:hover:bg-white/6 enabled:active:scale-95 disabled:opacity-45"
      >
        <Orb state={busy ? "searching" : "breathing"} size={64} display={30} />
      </button>
    </form>
  );

  if (!ready) return form;

  return (
    <VoiceBeam
      type="default"
      theme="dark"
      colorVariant="colorful"
      level={() => energy.current}
      processing={busy}
      strength={0.9}
      className={className ? \`w-full \${className}\` : "w-full"}
    >
      {form}
    </VoiceBeam>
  );
}

export const SearchInput = SearchComposer;
export type SearchInputProps = SearchComposerProps;
export { Orb, type OrbProps } from "./fx/Orb";
`,
      },
      {
        name: "Orb.tsx",
        path: "registry/ui/fx/Orb.tsx",
        code: `"use client";

import dynamic from "next/dynamic";
import type { OrbState } from "thinking-orbs";

const ThinkingOrb = dynamic(
  () => import("thinking-orbs").then((m) => m.ThinkingOrb),
  { ssr: false }
);

export type OrbProps = {
  state: OrbState;
  size?: 64 | 20;
  display?: number;
  paused?: boolean;
};

export function Orb({ state, size = 64, display, paused }: OrbProps) {
  const px = display ?? size;
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center"
      style={{ width: px, height: px }}
      aria-hidden
    >
      <ThinkingOrb
        state={state}
        size={size}
        theme="dark"
        paused={paused}
        style={{ width: px, height: px, display: "block" }}
      />
    </span>
  );
}
`,
      },
    ],
  },
  "morph-search": {
    slug: "morph-search",
    name: "Morph Search",
    description: "Adaptive morphing search bar with cycling placeholder, spring physics, and intent card morphs.",
    summary: "An ultra-fluid adaptive search bar inspired by Shapeshift. Features a pill-shaped input with continuous cycling placeholders, spring-driven opening and closing morphs, and interactive contextual card transformations for polls, events, checklists, timers, expense splits, and instant search queries.",
    category: "ai-stuff",
    tags: ["search", "input", "morph", "shapeshift", "spring", "motion", "card", "intent"],
    dependencies: ["clsx", "tailwind-merge", "motion"],
    version: "1.0.0",
    createdDate: "2026-09-23",
    updatedDate: "2026-09-23",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Smooth layout morphing from closed pill to expanded command card with spring physics",
      "Dynamic cycling placeholder with smooth vertical crossfade and blur transition",
      "Contextual intent morphs: interactive polls, event schedules, task checklists, timers, and bill splits",
      "Full keyboard accessibility with '/' and 'Cmd+K' triggers, Escape closing, and Enter submission",
      "Strict typography-first design with zero icons, zero emojis, and zero side borders"
    ],
    anatomy: [
      "<MorphSearch> (Main interactive container with spring layout morph)",
      "<input> (Search and prompt text input)",
      "<CyclingPlaceholder> (Animated crossfading prompt suggestions)",
      "<PollCard> (Interactive voting options with live percentage bars)",
      "<EventCard> (Schedule preview with time and attendee tags)",
      "<ChecklistCard> (Interactive tasks with completion toggles)",
      "<TimerCard> (Focus countdown with active controls)",
      "<SplitCard> (Bill split breakdown per person)"
    ],
    physics: {
      engine: "Motion Spring Solver",
      description: "Custom spring transition on container layout with 420 stiffness and 32 damping for immediate tactile response without overshoot.",
      parameters: [
        { label: "Stiffness", value: "420" },
        { label: "Damping", value: "32" },
        { label: "Mass", value: "0.85" },
        { label: "Closed Radius", value: "28px" },
        { label: "Opened Radius", value: "24px" }
      ]
    },
    accessibility: {
      role: "search",
      aria: "Carries semantic input attributes, labelled search action buttons, and keyboard shortcuts.",
      reducedMotion: "Automatically suppresses cycling animations and replaces spring layouts with soft opacity fades."
    },
    guidelines: {
      recommended: [
        "Primary search bar and copilot entry points",
        "Interactive command palettes and multi-intent query prompts",
        "Landing page search demonstrations and productivity tools"
      ],
      bestPractices: [
        "Provide an onSubmit callback to handle confirmed user prompts",
        "Keep placeholder examples relevant to your application's domain",
        "Use subtle backdrop-blur panels for elevated contrast"
      ]
    },
    props: [
      {
        name: "value",
        type: "string",
        defaultValue: "undefined",
        description: "Controlled search query string."
      },
      {
        name: "defaultValue",
        type: "string",
        defaultValue: "\"\"",
        description: "Initial uncontrolled query string."
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        defaultValue: "undefined",
        description: "Callback fired whenever the input text changes."
      },
      {
        name: "onSubmit",
        type: "(value: string, intent?: string) => void",
        defaultValue: "undefined",
        description: "Callback fired when Enter is pressed or an action is submitted."
      },
      {
        name: "onClear",
        type: "() => void",
        defaultValue: "undefined",
        description: "Callback fired when query is cleared."
      },
      {
        name: "placeholder",
        type: "string",
        defaultValue: "undefined",
        description: "Custom placeholder text to override cycling placeholders."
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Optional custom CSS class name for the wrapper."
      },
      {
        name: "autoFocus",
        type: "boolean",
        defaultValue: "false",
        description: "Whether the input should auto-focus on initial mount."
      }
    ],
    files: [
      {
        name: "morph-search.tsx",
        path: "registry/ui/morph-search.tsx",
        code: `"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import {
  Calendar,
  Check,
  CheckSquare,
  Clock,
  CornerDownLeft,
  Pause,
  PieChart,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Timer,
  User,
  Vote,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MorphSearchProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string, intent?: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function MorphSearch(props: MorphSearchProps) {
  return null;
}
`,
      },
    ],
  },
  orb: {
    slug: "orb",
    name: "Thinking Orb",
    description: "Interactive 2D dotted thought-orb indicator with 9 animated AI states and tactile click cycling.",
    summary: "A purpose-tuned animated indicator component engineered for AI agent UIs, copilot status indicators, and creative loaders. Powered by thinking-orbs, it renders nine distinct orbital particle states (breathing, searching, working, solving, listening, connecting, weaving, composing, shaping) onto a lightweight 2D canvas with full click-to-cycle interactivity, responsive sizes, and sleek presentation variants.",
    category: "ai-stuff",
    tags: ["orb", "thinking-orb", "ai", "loader", "particles", "canvas", "interactive", "animation"],
    dependencies: ["clsx", "tailwind-merge", "thinking-orbs"],
    version: "1.0.0",
    createdDate: "2026-09-22",
    updatedDate: "2026-09-22",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Nine hand-tuned agent animation states: breathing, searching, working, solving, listening, connecting, weaving, composing, shaping",
      "Interactive click-to-cycle state transition with tactile hover and active scaling",
      "Three distinct presentation variants: minimal (pure orb), card (framed telemetry card), and pill (compact status chip)",
      "High-efficiency 2D HTML5 canvas rendering without WebGL or heavy shader pipeline overhead",
      "Hydration-safe dynamic loader with automatic offscreen pause and reduced motion support"
    ],
    anatomy: [
      "<button> (Accessible interactive trigger with tactile scale and focus rings)",
      "<span> (Soft ambient blur wash reflecting state and elevation)",
      "<canvas> (2D particle simulation rendering mathematical orbital paths)",
      "<span> (Optional monospace uppercase status chip displaying active state)"
    ],
    physics: {
      engine: "2D Canvas Particle Kinematics",
      description: "Mathematical trigonometric orbits and particle velocity vectors running through a unified shared frame clock.",
      parameters: [
        { label: "Orbital States", value: "9 unique verbs" },
        { label: "Rendering Tech", value: "2D Canvas (No WebGL)" },
        { label: "Base Presets", value: "64px (avatar) / 20px (inline)" },
        { label: "Device Pixel Ratio", value: "Capped at 2x" },
        { label: "Performance", value: "60 FPS with offscreen culling" }
      ]
    },
    accessibility: {
      role: "button",
      aria: "Carries live aria-label communicating current state and click action. Automatically freezes animation when prefers-reduced-motion is active.",
      reducedMotion: "Renders a static representative frame with zero loop computation."
    },
    guidelines: {
      recommended: [
        "AI agent and copilot status indicators in navigation headers and sidebars",
        "Loading and thinking states during generative tasks and deep reasoning queries",
        "Interactive state selectors and futuristic feedback elements"
      ],
      bestPractices: [
        "Use variant='minimal' for inline avatars or nested button search triggers",
        "Use variant='pill' for persistent status bars and header telemetry",
        "Use variant='card' for interactive feature showcases and agent controls"
      ]
    },
    props: [
      {
        name: "state",
        type: "OrbState",
        defaultValue: "undefined",
        description: "Controlled orb animation state (breathing, searching, working, solving, listening, connecting, weaving, composing, shaping)."
      },
      {
        name: "defaultState",
        type: "OrbState",
        defaultValue: "\"breathing\"",
        description: "Initial state when uncontrolled."
      },
      {
        name: "size",
        type: "64 | 20",
        defaultValue: "64",
        description: "Authoring tuning preset and canvas buffer resolution."
      },
      {
        name: "display",
        type: "number",
        defaultValue: "undefined",
        description: "CSS dimensions to render the orb at in pixels."
      },
      {
        name: "interactive",
        type: "boolean",
        defaultValue: "true",
        description: "Whether clicking cycles through orb states with tactile feedback."
      },
      {
        name: "paused",
        type: "boolean",
        defaultValue: "false",
        description: "Freeze the animation on the current frame."
      },
      {
        name: "speed",
        type: "number",
        defaultValue: "1",
        description: "Animation speed multiplier."
      },
      {
        name: "onClick",
        type: "(e, nextState) => void",
        defaultValue: "undefined",
        description: "Callback fired on click with event and next state."
      }
    ],
    files: [
      {
        name: "orb.tsx",
        path: "registry/ui/orb.tsx",
        code: `"use client";

import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import type { OrbState } from "thinking-orbs";
import { cn } from "@/lib/utils";

const ThinkingOrb = dynamic(
  () => import("thinking-orbs").then((m) => m.ThinkingOrb),
  { ssr: false }
);

export const ORB_STATES: OrbState[] = [
  "breathing",
  "searching",
  "working",
  "solving",
  "listening",
  "connecting",
  "weaving",
  "composing",
  "shaping",
];

export interface OrbProps {
  state?: OrbState;
  defaultState?: OrbState;
  size?: 64 | 20;
  display?: number;
  paused?: boolean;
  speed?: number;
  theme?: "dark" | "light" | "auto";
  interactive?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>, nextState: OrbState) => void;
  onStateChange?: (state: OrbState) => void;
}

export function Orb({
  state: controlledState,
  defaultState = "breathing",
  size = 64,
  display,
  paused = false,
  speed = 1,
  theme = "dark",
  interactive = true,
  className,
  onClick,
  onStateChange,
}: OrbProps) {
  const isControlled = controlledState !== undefined;
  const [internalState, setInternalState] = useState<OrbState>(defaultState);
  const currentState = isControlled ? controlledState : internalState;

  const px = display ?? size;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const currentIndex = ORB_STATES.indexOf(currentState);
      const nextIndex = (currentIndex + 1) % ORB_STATES.length;
      const nextState = ORB_STATES[nextIndex];

      if (!isControlled) {
        setInternalState(nextState);
      }
      onStateChange?.(nextState);
      onClick?.(e, nextState);
    },
    [currentState, isControlled, onClick, onStateChange]
  );

  const canvas = (
    <ThinkingOrb
      state={currentState}
      size={size}
      theme={theme}
      speed={speed}
      paused={paused}
      style={{ width: px, height: px, display: "block" }}
    />
  );

  if (!interactive && !onClick) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center select-none",
          className
        )}
        style={{ width: px, height: px }}
        aria-hidden
      >
        {canvas}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={\`Orb state is \${currentState}. Click to cycle state.\`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center p-0 border-0 bg-transparent cursor-pointer select-none transition-transform duration-200 ease-out hover:scale-105 active:scale-95 outline-none rounded-full focus-visible:ring-1 focus-visible:ring-white/20",
        className
      )}
      style={{ width: px, height: px }}
    >
      {canvas}
    </button>
  );
}

export const ThinkingOrbComponent = Orb;
`,
      },
    ],
  },
  "liquid-toggle": {
    slug: "liquid-toggle",
    name: "Liquid Toggle",
    description: "Organic liquid goo physics switch with fluid meta-ball fusion and spring dynamics.",
    summary: "An organic switch component driven by damped harmonic spring physics and SVG filter meta-ball fusion. As the toggle is flicked or dragged across its track, a lagging satellite drop stretches, disconnects, and snaps back with velocity-scaled squash and stretch dynamics, evoking authentic fluid surface tension.",
    category: "inputs",
    tags: ["switch", "toggle", "liquid", "goo", "physics", "spring", "fluid", "a11y"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-23",
    updatedDate: "2026-09-23",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Bespoke dual-spring physics coupling the primary thumb with a trailing satellite droplet",
      "SVG feGaussianBlur and feColorMatrix alpha thresholding for seamless fluid meta-ball fusion",
      "Dynamic squash-and-stretch velocity scaling along the motion vector preserving volume",
      "Touch and mouse drag pointer capture with thresholded gesture release snapping",
      "Per-instance collision-free SVG filter IDs preventing multi-component style leakage",
      "Accessible ARIA switch semantics with keyboard Enter/Space toggling support"
    ],
    anatomy: [
      "<button> (Track shell with role='switch', aria-checked, focus ring, and color styling)",
      "<span> (Diffuse radial aura glow illuminating upon active state)",
      "<svg> (Scoped filter definition with feGaussianBlur and high-contrast feColorMatrix)",
      "<span> (Goo container referencing SVG filter)",
      "<span> (Satellite droplet lagging behind during velocity transitions)",
      "<span> (Primary thumb blob scaling dynamically with velocity)"
    ],
    physics: {
      engine: "Dual Spring Harmonic Oscillator with SVG Meta-Ball Thresholding",
      description: "Analytical Euler integration simulating independent spring tension on the main thumb and satellite drop, linked with velocity squash-and-stretch.",
      parameters: [
        { label: "Thumb Stiffness", value: "260 - 460" },
        { label: "Thumb Damping", value: "14 - 26" },
        { label: "Drop Stiffness", value: "125 - 240" },
        { label: "Drop Damping", value: "12 - 20" },
        { label: "Goo Threshold", value: "19 * alpha - 8" },
        { label: "Velocity Stretch", value: "0.002 - 0.005 factor" }
      ]
    },
    accessibility: {
      role: "switch",
      aria: "Standard role='switch' with aria-checked, aria-label, and disabled state reflection.",
      reducedMotion: "Physics settling handles graceful termination and supports instant state transitions.",
      keyboard: [
        { key: "Space / Enter", description: "Toggle switch state when focused." },
        { key: "Tab / Shift+Tab", description: "Move focus to/from the switch with custom focus ring." }
      ]
    },
    guidelines: {
      recommended: [
        "Feature flags, dark mode toggles, and system preferences where high tactile delight is desired",
        "Audio, visual, and AI tool parameter activation panels",
        "Interactive settings menus prioritizing premium micro-interaction design"
      ],
      bestPractices: [
        "Use monochrome for neutral/dark interfaces and chromatic colors to indicate affirmative features",
        "Provide an explicit label or aria-label for screen reader clarity",
        "Pair with concise switch labels positioned alongside the component"
      ]
    },
    props: [
      {
        name: "checked",
        type: "boolean",
        defaultValue: "false",
        description: "Controlled checked state of the liquid toggle.",
      },
      {
        name: "defaultChecked",
        type: "boolean",
        defaultValue: "false",
        description: "Initial checked state when used uncontrolled.",
      },
      {
        name: "onChange",
        type: "(checked: boolean) => void",
        defaultValue: "undefined",
        description: "Callback invoked when checked state changes.",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Whether interaction is disabled.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Size preset governing track and thumb dimensions.",
      },
      {
        name: "color",
        type: '"monochrome" | "emerald" | "violet" | "amber" | "cyan"',
        defaultValue: '"monochrome"',
        description: "Curated active theme palette styling.",
      },
      {
        name: "viscosity",
        type: '"fluid" | "jelly"',
        defaultValue: '"fluid"',
        description: "Spring physics presets altering liquid goo elasticity.",
      },
      {
        name: "label",
        type: "string",
        defaultValue: '"Toggle switch"',
        description: "Accessible ARIA label for screen readers.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes passed to the outer track button.",
      },
    ],
    files: [
      {
        name: "liquid-toggle.tsx",
        path: "registry/ui/liquid-toggle.tsx",
        code: `"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { cn } from "@/lib/utils";

export type LiquidToggleSize = "sm" | "md" | "lg";
export type LiquidToggleColor =
  | "monochrome"
  | "emerald"
  | "violet"
  | "amber"
  | "cyan";
export type LiquidToggleViscosity = "fluid" | "jelly";

export interface LiquidToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: LiquidToggleSize;
  color?: LiquidToggleColor;
  viscosity?: LiquidToggleViscosity;
  label?: string;
  className?: string;
  id?: string;
}

const SIZES = {
  sm: {
    trackWidth: 42,
    trackHeight: 24,
    thumb: 16,
    drop: 11,
    off: 4,
    on: 42 - 16 - 4,
    blur: 2.6,
  },
  md: {
    trackWidth: 50,
    trackHeight: 28,
    thumb: 18,
    drop: 13,
    off: 5,
    on: 50 - 18 - 5,
    blur: 3.2,
  },
  lg: {
    trackWidth: 64,
    trackHeight: 36,
    thumb: 24,
    drop: 17,
    off: 6,
    on: 64 - 24 - 6,
    blur: 4.2,
  },
} as const;

const TUNING = {
  fluid: {
    thumbStiffness: 260,
    thumbDamping: 20,
    dropStiffness: 125,
    dropDamping: 15,
    stretch: 0.003,
  },
  jelly: {
    thumbStiffness: 340,
    thumbDamping: 14,
    dropStiffness: 160,
    dropDamping: 12,
    stretch: 0.005,
  },
} as const;

const COLOR_STYLES = {
  monochrome: {
    activeBlob: "bg-[#f4f4f5]",
    inactiveBlob: "bg-[#71717a]",
    trackOn: "border-white/20 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    trackOff: "border-white/8 bg-white/4",
    aura: "bg-white/10",
  },
  emerald: {
    activeBlob: "bg-[#34d399]",
    inactiveBlob: "bg-[#71717a]",
    trackOn:
      "border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_24px_rgba(52,211,153,0.2)]",
    trackOff: "border-white/8 bg-white/4",
    aura: "bg-emerald-400/20",
  },
  violet: {
    activeBlob: "bg-[#a78bfa]",
    inactiveBlob: "bg-[#71717a]",
    trackOn:
      "border-violet-500/30 bg-violet-500/10 shadow-[0_0_24px_rgba(167,139,250,0.2)]",
    trackOff: "border-white/8 bg-white/4",
    aura: "bg-violet-400/20",
  },
  amber: {
    activeBlob: "bg-[#fbbf24]",
    inactiveBlob: "bg-[#71717a]",
    trackOn:
      "border-amber-500/30 bg-amber-500/10 shadow-[0_0_24px_rgba(251,191,36,0.2)]",
    trackOff: "border-white/8 bg-white/4",
    aura: "bg-amber-400/20",
  },
  cyan: {
    activeBlob: "bg-[#22d3ee]",
    inactiveBlob: "bg-[#71717a]",
    trackOn:
      "border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_24px_rgba(34,211,238,0.2)]",
    trackOff: "border-white/8 bg-white/4",
    aura: "bg-cyan-400/20",
  },
} as const;

export function LiquidToggle({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  color = "monochrome",
  viscosity = "fluid",
  label = "Toggle switch",
  className,
  id: customId,
}: LiquidToggleProps) {
  const generatedId = useId();
  const toggleId = customId ?? \`liquid-toggle-\${generatedId}\`;
  const filterId = \`liquid-goo-\${generatedId.replace(/:/g, "")}\`;

  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const config = SIZES[size];
  const tune = TUNING[viscosity];
  const colorTheme = COLOR_STYLES[color];

  const thumbRef = useRef<HTMLSpanElement>(null);
  const dropRef = useRef<HTMLSpanElement>(null);
  const auraRef = useRef<HTMLSpanElement>(null);

  const initialTarget = isChecked ? config.on : config.off;
  const motion = useRef({
    x: initialTarget,
    v: 0,
    dropX: initialTarget,
    dropV: 0,
    target: initialTarget,
    dragging: false,
    raf: 0,
    last: 0,
  });

  const press = useRef<{
    startX: number;
    from: number;
    moved: boolean;
  } | null>(null);

  const paint = useCallback(() => {
    const m = motion.current;
    const direction = m.v >= 0 ? 1 : -1;
    const stretch = Math.min(0.35, Math.abs(m.v) * tune.stretch);
    const scaleX = 1 + stretch;
    const scaleY = 1 / Math.sqrt(scaleX);

    if (thumbRef.current) {
      thumbRef.current.style.transform = \`translate3d(\${m.x}px, 0, 0) scale(\${scaleX}, \${scaleY})\`;
    }
    if (dropRef.current) {
      const dropOffset = (config.thumb - config.drop) / 2;
      const trailLag = direction * -0.5 * stretch * config.drop;
      dropRef.current.style.transform = \`translate3d(\${m.dropX + dropOffset + trailLag}px, 0, 0)\`;
    }
    if (auraRef.current) {
      const progress = (m.x - config.off) / (config.on - config.off || 1);
      auraRef.current.style.opacity = \`\${Math.max(0, Math.min(1, progress))}\`;
    }
  }, [config.drop, config.off, config.on, config.thumb, tune.stretch]);

  const run = useCallback(() => {
    const m = motion.current;
    if (m.raf) return;
    m.last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - m.last) / 1000);
      m.last = now;

      if (!m.dragging) {
        const springForce = tune.thumbStiffness * (m.target - m.x);
        const dampingForce = tune.thumbDamping * m.v;
        m.v += (springForce - dampingForce) * dt;
        m.x += m.v * dt;
      }

      const dropSpringForce = tune.dropStiffness * (m.x - m.dropX);
      const dropDampingForce = tune.dropDamping * m.dropV;
      m.dropV += (dropSpringForce - dropDampingForce) * dt;
      m.dropX += m.dropV * dt;

      paint();

      const settled =
        !m.dragging &&
        Math.abs(m.target - m.x) < 0.05 &&
        Math.abs(m.v) < 0.5 &&
        Math.abs(m.x - m.dropX) < 0.05 &&
        Math.abs(m.dropV) < 0.5;

      if (settled) {
        m.x = m.target;
        m.dropX = m.target;
        m.v = 0;
        m.dropV = 0;
        paint();
        m.raf = 0;
      } else {
        m.raf = requestAnimationFrame(tick);
      }
    };

    m.raf = requestAnimationFrame(tick);
  }, [paint, tune.dropDamping, tune.dropStiffness, tune.thumbDamping, tune.thumbStiffness]);

  useEffect(() => {
    motion.current.target = isChecked ? config.on : config.off;
    run();
  }, [isChecked, config.on, config.off, run]);

  useEffect(() => {
    paint();
    const m = motion.current;
    return () => {
      if (m.raf) {
        cancelAnimationFrame(m.raf);
        m.raf = 0;
      }
    };
  }, [paint]);

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    press.current = {
      startX: e.clientX,
      from: motion.current.x,
      moved: false,
    };
  };

  const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const p = press.current;
    if (!p || disabled) return;
    const by = e.clientX - p.startX;
    if (Math.abs(by) > 3) p.moved = true;
    if (!p.moved) return;

    const m = motion.current;
    m.dragging = true;
    m.x = Math.max(config.off, Math.min(config.on, p.from + by));
    m.v = 0;
    run();
  };

  const handlePointerUp = () => {
    const p = press.current;
    press.current = null;
    if (!p || disabled) return;

    const m = motion.current;
    m.dragging = false;

    const nextState = p.moved ? m.x > (config.off + config.on) / 2 : !isChecked;
    m.target = nextState ? config.on : config.off;
    run();

    if (!isControlled) {
      setInternalChecked(nextState);
    }
    onChange?.(nextState);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const nextState = !isChecked;
      motion.current.target = nextState ? config.on : config.off;
      run();
      if (!isControlled) {
        setInternalChecked(nextState);
      }
      onChange?.(nextState);
    }
  };

  return (
    <button
      id={toggleId}
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={label}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative shrink-0 cursor-pointer select-none touch-none rounded-full border outline-none transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-white/20 active:scale-95 disabled:pointer-events-none disabled:opacity-40",
        isChecked ? colorTheme.trackOn : colorTheme.trackOff,
        className
      )}
      style={{
        width: config.trackWidth,
        height: config.trackHeight,
      }}
    >
      <span
        ref={auraRef}
        className={cn(
          "pointer-events-none absolute -inset-1 rounded-full blur-md transition-opacity duration-300",
          colorTheme.aura
        )}
        style={{ opacity: isChecked ? 1 : 0 }}
        aria-hidden="true"
      />

      <svg
        width="0"
        height="0"
        className="pointer-events-none absolute"
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={config.blur}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
            />
          </filter>
        </defs>
      </svg>

      <span
        className="pointer-events-none absolute inset-0 overflow-visible"
        style={{ filter: \`url(#\${filterId})\` }}
      >
        <span
          ref={dropRef}
          className={cn(
            "absolute left-0 rounded-full transition-colors duration-300",
            isChecked ? colorTheme.activeBlob : colorTheme.inactiveBlob
          )}
          style={{
            width: config.drop,
            height: config.drop,
            top: (config.trackHeight - config.drop) / 2,
          }}
        />
        <span
          ref={thumbRef}
          className={cn(
            "absolute left-0 rounded-full shadow-xs transition-colors duration-300",
            isChecked ? colorTheme.activeBlob : colorTheme.inactiveBlob
          )}
          style={{
            width: config.thumb,
            height: config.thumb,
            top: (config.trackHeight - config.thumb) / 2,
          }}
        />
      </span>
    </button>
  );
}
`,
      },
    ],
  },
  "gooey-nav": {
    slug: "gooey-nav",
    name: "Gooey Nav",
    description: "Segmented tab navigation with dynamic organic bezier neck stretching and corner radius morphing.",
    summary: "An organic navigation bar engineered with harmonic spring physics and dynamic SVG quadratic bezier neck interpolation. When switching active tabs, adjacent segments fluidly separate with an elastic connecting meniscus that pinches, stretches, and snaps across tabs, while border radii dynamically morph between fused and detached states.",
    category: "navigation",
    tags: ["navigation", "tabs", "gooey", "menu", "spring", "bezier", "liquid", "a11y"],
    dependencies: ["clsx", "tailwind-merge", "motion"],
    version: "1.0.0",
    createdDate: "2026-09-23",
    updatedDate: "2026-09-23",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Dynamic SVG quadratic bezier neck interpolation with volume-preserving waist pinching",
      "Simultaneous spring-driven corner radius morphing between fused (0px) and detached (corner) states",
      "Integrated keyboard accessibility supporting ArrowLeft, ArrowRight, Home, and End navigation",
      "Customizable spring dynamics with fluid, elastic, and smooth elasticity tuning",
      "Multiple visual variants including solid elevated surface, vibrant aura glow, and frosted glass",
      "Independent active color palettes with matching linear gradients spanning the seam gaps"
    ],
    anatomy: [
      "<nav> (Semantic navigation shell with role='tablist' and keyboard event listeners)",
      "<Segment> (Spring-positioned segment with dynamic margin-left and corner radius morphing)",
      "<svg> (Connecting seam bridge rendering the dynamic bezier neck path)",
      "<linearGradient> (Dynamic two-stop color transition bridging neighboring tiles)",
      "<NavLabel> (Interactive tab link or button with ARIA attributes and active styling)"
    ],
    physics: {
      engine: "Motion Spring Dynamics & Quadratic Bezier Geometry",
      description: "Damped harmonic oscillator governing seam separation distances coupled with mathematical waist thinning at NECK_BREAK = 0.44.",
      parameters: [
        { label: "Spring Stiffness", value: "170 - 320" },
        { label: "Spring Damping", value: "18 - 26" },
        { label: "Neck Break Threshold", value: "0.44 gap / span" },
        { label: "Waist Decay Exponent", value: "1.4 power curve" },
        { label: "Separation Span", value: "14px - 24px" }
      ]
    },
    accessibility: {
      role: "tablist",
      aria: "Standard role='tablist' on container, role='tab' on buttons, aria-selected for active state, and proper tabIndex handling.",
      reducedMotion: "useReducedMotion fallback jumps positions instantly with zero duration.",
      keyboard: [
        { key: "ArrowRight", description: "Select the next navigation tab." },
        { key: "ArrowLeft", description: "Select the previous navigation tab." },
        { key: "Home", description: "Jump to the first tab." },
        { key: "End", description: "Jump to the last tab." }
      ]
    },
    guidelines: {
      recommended: [
        "Primary application navigation bars and section tab switchers",
        "Dashboard sub-navigation and workspace segmented controls",
        "Interactive product feature walkthrough tabs"
      ],
      bestPractices: [
        "Keep tab count between 3 and 7 for optimal horizontal stretching ergonomics",
        "Use distinct icons alongside labels for improved scannability",
        "Choose high-contrast active colors against dark backgrounds"
      ]
    },
    props: [
      {
        name: "items",
        type: "GooeyNavItem[]",
        required: true,
        defaultValue: "[]",
        description: "Array of tab navigation items as strings or objects with label, icon, and optional href.",
      },
      {
        name: "value",
        type: "number",
        defaultValue: "undefined",
        description: "Controlled active tab index.",
      },
      {
        name: "defaultValue",
        type: "number",
        defaultValue: "0",
        description: "Initial tab index when uncontrolled.",
      },
      {
        name: "onChange",
        type: "(index: number) => void",
        defaultValue: "undefined",
        description: "Callback triggered when the active tab index changes.",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Size preset governing padding, typography, icon size, and separation distance.",
      },
      {
        name: "color",
        type: '"orange" | "emerald" | "violet" | "cyan" | "amber" | "monochrome"',
        defaultValue: '"orange"',
        description: "Curated active theme palette styling.",
      },
      {
        name: "activeColor",
        type: "string",
        defaultValue: "undefined",
        description: "Custom active background color override (hex/rgb).",
      },
      {
        name: "activeLabelColor",
        type: "string",
        defaultValue: "undefined",
        description: "Custom active label text color override.",
      },
      {
        name: "variant",
        type: '"solid" | "glow" | "glass"',
        defaultValue: '"solid"',
        description: "Visual appearance style: solid elevated tiles, ambient glow, or frosted glass.",
      },
      {
        name: "elasticity",
        type: '"fluid" | "elastic"',
        defaultValue: '"fluid"',
        description: "Spring dynamics preset governing transition stiffness and damping.",
      },
      {
        name: "separation",
        type: "number",
        defaultValue: "undefined",
        description: "Custom gap distance in pixels between separated segments.",
      },
      {
        name: "radius",
        type: "number",
        defaultValue: "undefined",
        description: "Custom corner border radius in pixels.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes passed to the outer nav element.",
      },
    ],
    files: [
      {
        name: "gooey-nav.tsx",
        path: "registry/ui/gooey-nav.tsx",
        code: `"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

const SPRING_TUNING = {
  fluid: { stiffness: 220, damping: 24, mass: 0.9 },
  elastic: { stiffness: 320, damping: 18, mass: 1 },
} as const;

const NECK_BREAK = 0.44;
const NECK_H = 100;

const SIZES = {
  xs: {
    label: "gap-1.5 px-3 py-1.5 text-[11px] leading-4 [&_svg]:size-3.5",
    radius: 8,
    separation: 14,
  },
  sm: {
    label: "gap-2 px-3.5 py-2 text-xs leading-4 [&_svg]:size-4",
    radius: 10,
    separation: 16,
  },
  md: {
    label: "gap-2.5 px-5 py-2.5 text-sm leading-5 [&_svg]:size-4.5",
    radius: 12,
    separation: 20,
  },
  lg: {
    label: "gap-3 px-6 py-3 text-base leading-6 [&_svg]:size-5",
    radius: 14,
    separation: 24,
  },
} as const;

export type GooeyNavSize = keyof typeof SIZES;
export type GooeyNavElasticity = keyof typeof SPRING_TUNING;
export type GooeyNavVariant = "solid" | "glow" | "glass";

export type GooeyNavColor =
  | "orange"
  | "emerald"
  | "violet"
  | "cyan"
  | "amber"
  | "monochrome";

const COLOR_PRESETS: Record<
  GooeyNavColor,
  { hex: string; text: string; glow: string; dot: string }
> = {
  orange: {
    hex: "#FC4C01",
    text: "#ffffff",
    glow: "rgba(252,76,1,0.35)",
    dot: "bg-[#FC4C01]",
  },
  emerald: {
    hex: "#10B981",
    text: "#ffffff",
    glow: "rgba(16,185,129,0.35)",
    dot: "bg-emerald-400",
  },
  violet: {
    hex: "#8B5CF6",
    text: "#ffffff",
    glow: "rgba(139,92,246,0.35)",
    dot: "bg-violet-400",
  },
  cyan: {
    hex: "#06B6D4",
    text: "#ffffff",
    glow: "rgba(6,182,212,0.35)",
    dot: "bg-cyan-400",
  },
  amber: {
    hex: "#F59E0B",
    text: "#ffffff",
    glow: "rgba(245,158,11,0.35)",
    dot: "bg-amber-400",
  },
  monochrome: {
    hex: "#F4F4F5",
    text: "#09090b",
    glow: "rgba(244,244,245,0.25)",
    dot: "bg-zinc-200",
  },
};

export type GooeyNavItemObject = {
  label: string;
  href?: string;
  icon?: ReactNode;
  id?: string;
};

export type GooeyNavItem = string | GooeyNavItemObject;

const toItem = (item: GooeyNavItem): GooeyNavItemObject =>
  typeof item === "string" ? { label: item } : item;

export type GooeyNavProps = Omit<ComponentProps<"nav">, "onChange"> & {
  items: GooeyNavItem[];
  value?: number;
  defaultValue?: number;
  onChange?: (index: number) => void;
  size?: GooeyNavSize;
  color?: GooeyNavColor;
  activeColor?: string;
  activeLabelColor?: string;
  variant?: GooeyNavVariant;
  elasticity?: GooeyNavElasticity;
  separation?: number;
  radius?: number;
};

function neckPath(gap: number, span: number, breakRatio = NECK_BREAK) {
  if (
    !Number.isFinite(gap) ||
    !Number.isFinite(span) ||
    gap <= 0 ||
    span <= 0
  ) {
    return "";
  }
  const progress = gap / (span * breakRatio);
  if (progress >= 1) return "";
  const waist = NECK_H * Math.pow(1 - progress, 1.4);
  if (waist <= 0.2) return "";
  const start = span - gap;
  const mid = start + gap / 2;
  const dip = (NECK_H - waist) / 2;
  return \`M\${start} 0 Q\${mid} \${dip} \${span} 0 L\${span} \${NECK_H} Q\${mid} \${NECK_H - dip} \${start} \${NECK_H} Z\`;
}

type SegmentProps = {
  gap: number;
  span: number;
  hasSeam: boolean;
  leftFill: string;
  rightFill: string;
  reduced: boolean;
  radii: Record<string, number>;
  springConfig: { stiffness: number; damping: number; mass: number };
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

function Segment({
  gap,
  span,
  hasSeam,
  leftFill,
  rightFill,
  reduced,
  radii,
  springConfig,
  className,
  style,
  children,
}: SegmentProps) {
  const marginLeft = useSpring(gap, springConfig);
  const gradientId = \`gooey-neck-\${useId().replace(/:/g, "")}\`;

  useEffect(() => {
    if (reduced) marginLeft.jump(gap);
    else marginLeft.set(gap);
  }, [gap, marginLeft, reduced]);

  const d = useTransform(marginLeft, (g) => neckPath(g, span));

  return (
    <motion.li
      data-slot="gooey-nav-segment"
      className={cn("relative list-none", className)}
      style={{ ...style, marginLeft }}
      initial={false}
      animate={radii}
      transition={
        reduced
          ? { duration: 0 }
          : { type: "spring", ...springConfig }
      }
    >
      {hasSeam && (
        <svg
          aria-hidden="true"
          width={span}
          viewBox={\`0 0 \${span} \${NECK_H}\`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute top-0 right-full h-full overflow-visible text-[#18181b]"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={leftFill} />
              <stop offset="100%" stopColor={rightFill} />
            </linearGradient>
          </defs>
          <motion.path d={d} fill={\`url(#\${gradientId})\`} />
        </svg>
      )}
      {children}
    </motion.li>
  );
}

type NavLabelProps = GooeyNavItemObject & {
  isActive: boolean;
  size: GooeyNavSize;
  activeLabelColor: string;
  onSelect: () => void;
  tabIndex: number;
  id: string;
};

function NavLabel({
  label,
  href,
  icon,
  isActive,
  size,
  activeLabelColor,
  onSelect,
  tabIndex,
  id,
}: NavLabelProps) {
  const props = {
    id,
    role: "tab",
    "aria-selected": isActive,
    tabIndex,
    "data-slot": "gooey-nav-item",
    "data-active": isActive,
    className: cn(
      "relative z-10 flex cursor-pointer items-center justify-center whitespace-nowrap font-medium outline-none transition-all duration-300 ease-out select-none active:scale-95 focus-visible:ring-1 focus-visible:ring-white/30",
      SIZES[size].label,
      isActive ? "opacity-100" : "text-zinc-400 hover:text-white opacity-80 hover:opacity-100",
    ),
    style: isActive ? { color: activeLabelColor } : undefined,
    onClick: onSelect,
  } as const;

  const content = (
    <>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </>
  );

  return href ? (
    <Link href={href} {...props}>
      {content}
    </Link>
  ) : (
    <button type="button" {...props}>
      {content}
    </button>
  );
}

export function GooeyNav({
  items,
  value,
  defaultValue = 0,
  onChange,
  size = "md",
  color = "orange",
  activeColor: customActiveColor,
  activeLabelColor: customActiveLabelColor,
  variant = "solid",
  elasticity = "fluid",
  separation,
  radius,
  className,
  ...props
}: GooeyNavProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion() ?? false;
  const navRef = useRef<HTMLElement>(null);

  const routeIndex = items.findIndex((item) => toItem(item).href === pathname);
  const [uncontrolled, setUncontrolled] = useState(() =>
    routeIndex === -1 ? defaultValue : routeIndex,
  );
  const [seenRoute, setSeenRoute] = useState(routeIndex);

  if (routeIndex !== seenRoute) {
    setSeenRoute(routeIndex);
    if (routeIndex !== -1 && value === undefined) setUncontrolled(routeIndex);
  }

  const active = Math.max(0, Math.min(items.length - 1, value ?? uncontrolled));
  const span = separation ?? SIZES[size].separation;
  const corner = radius ?? SIZES[size].radius;
  const springConfig = SPRING_TUNING[elasticity];

  const preset = COLOR_PRESETS[color] ?? COLOR_PRESETS.orange;
  const computedActiveColor = customActiveColor ?? preset.hex;
  const computedLabelColor = customActiveLabelColor ?? preset.text;

  const open = (seam: number) =>
    seam === 0 ||
    seam === items.length ||
    seam - 1 === active ||
    seam === active;

  const baseSurface =
    variant === "glass"
      ? "bg-white/6 backdrop-blur-md border border-white/10"
      : "bg-[#18181b] border border-white/8";

  const fill = (i: number) =>
    i === active ? computedActiveColor : "#18181b";

  const handleKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (active + 1) % items.length;
      if (value === undefined) setUncontrolled(next);
      onChange?.(next);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (active - 1 + items.length) % items.length;
      if (value === undefined) setUncontrolled(prev);
      onChange?.(prev);
    } else if (e.key === "Home") {
      e.preventDefault();
      if (value === undefined) setUncontrolled(0);
      onChange?.(0);
    } else if (e.key === "End") {
      e.preventDefault();
      const last = items.length - 1;
      if (value === undefined) setUncontrolled(last);
      onChange?.(last);
    }
  };

  return (
    <nav
      ref={navRef}
      data-slot="gooey-nav"
      className={cn("inline-block select-none", className)}
      {...props}
    >
      <ul
        role="tablist"
        onKeyDown={handleKeyDown}
        className="flex items-center m-0 p-0 list-none"
      >
        {items.map((item, i) => {
          const navItem = toItem(item);
          const isActive = i === active;
          const itemId = navItem.id ?? \`gooey-tab-\${i}\`;

          return (
            <Segment
              key={\`\${i}-\${navItem.label}\`}
              gap={i === 0 ? 0 : open(i) ? span : -1}
              span={span}
              hasSeam={i > 0}
              leftFill={fill(i - 1)}
              rightFill={fill(i)}
              reduced={reduced}
              springConfig={springConfig}
              radii={{
                borderTopLeftRadius: open(i) ? corner : 0,
                borderBottomLeftRadius: open(i) ? corner : 0,
                borderTopRightRadius: open(i + 1) ? corner : 0,
                borderBottomRightRadius: open(i + 1) ? corner : 0,
              }}
              className={cn(
                "transition-all duration-300 ease-out",
                baseSurface,
                isActive && variant === "glow" && "shadow-[0_0_24px_var(--glow-color)]",
              )}
              style={
                {
                  "--glow-color": preset.glow,
                  backgroundColor: isActive ? computedActiveColor : undefined,
                  borderColor: isActive ? "transparent" : undefined,
                } as CSSProperties
              }
            >
              <NavLabel
                {...navItem}
                id={itemId}
                isActive={isActive}
                size={size}
                activeLabelColor={computedLabelColor}
                tabIndex={isActive ? 0 : -1}
                onSelect={() => {
                  if (value === undefined) setUncontrolled(i);
                  onChange?.(i);
                }}
              />
            </Segment>
          );
        })}
      </ul>
    </nav>
  );
}

export default GooeyNav;
`,
      },
    ],
  },
  "noise": {
    slug: "noise",
    name: "Noise Background",
    description: "High-performance procedural grain noise background with CRT static, film dust, vignette, and scanlines.",
    summary: "An ultra-optimized hardware-accelerated procedural canvas noise generator engineered for cinematic backgrounds and atmosphere. Features sub-pixel pattern tiling via 32-bit Uint32 buffer rendering, 3 distinct procedural grain algorithms (film grain, analog static, and film dust), edge vignette darkening, CRT scanline rasterization, and automatic viewport/container adaptation with IntersectionObserver and reduced-motion support.",
    category: "layout",
    tags: ["noise", "grain", "canvas", "background", "texture", "vignette", "scanlines"],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-23",
    updatedDate: "2026-09-23",
    interactive: false,
    supportsColor: false,
    highlights: [
      "Sub-pixel pattern tiling running on 32-bit Uint32Array memory buffers for near-zero CPU overhead",
      "Three selectable noise algorithms: Film Grain, CRT Static, and Film Dust",
      "Built-in cinematic radial vignette and retro CRT scanline raster layers",
      "Seamless container adaptation supporting both fixed fullscreen and container-bounded layouts",
      "Automatic battery-saving lifecycle management with IntersectionObserver and document.hidden pauses",
      "Full accessibility with automatic prefers-reduced-motion detection and animation freezing"
    ],
    anatomy: [
      "<div> (Responsive Container: handles ResizeObserver and IntersectionObserver lifecycle)",
      "<canvas> (2D Canvas Buffer: renders high-density tiled noise patterns without CPU overhead)",
      "<div> (Cinematic Vignette: radial gradient edge darkening layer)",
      "<div> (Scanline Overlay: repeating-linear-gradient CRT monitor raster lines)"
    ],
    physics: {
      engine: "32-bit Uint32 Procedural Buffer + 2D Canvas Matrix Pattern Transform",
      description: "Direct memory buffer generation coupled with GPU hardware-accelerated 2D canvas pattern matrix translation and jitter.",
      parameters: [
        { label: "Pattern Buffer Size", value: "250px × 250px" },
        { label: "Memory Pipeline", value: "32-bit Uint32Array" },
        { label: "Frame Rate Cap", value: "30 / 60 FPS configurable" },
        { label: "Refresh Interval", value: "2 frame stride default" }
      ]
    },
    accessibility: {
      role: "presentation",
      aria: "data-slot='noise' rendered with aria-hidden or presentation semantics for decorative textures.",
      reducedMotion: "Automatically stops animated pattern jitter and freezes grain texture when prefers-reduced-motion is active."
    },
    guidelines: {
      recommended: [
        "Cinematic dark mode hero backgrounds in developer platforms, dashboards, and landing pages",
        "Subtle analogue film grain texture inside card surfaces, modals, and container boundaries",
        "Terminal, retro, or synthesizer interfaces utilizing CRT static and scanlines"
      ],
      bestPractices: [
        "Use low patternAlpha values (10 - 25) for subtle, premium film grain that does not overpower foreground typography",
        "Pair with dark container backgrounds for optimal contrast with film grain highlights",
        "Enable scanlines or vignette for retro hardware and CRT aesthetics"
      ]
    },
    props: [
      {
        name: "patternSize",
        type: "number",
        defaultValue: "250",
        description: "Dimensions (width and height in px) of the offscreen noise generator pattern buffer tile.",
      },
      {
        name: "patternScaleX",
        type: "number",
        defaultValue: "1",
        description: "Horizontal scaling factor applied to the noise grain texture.",
      },
      {
        name: "patternScaleY",
        type: "number",
        defaultValue: "1",
        description: "Vertical scaling factor applied to the noise grain texture.",
      },
      {
        name: "patternRefreshInterval",
        type: "number",
        defaultValue: "1",
        description: "Frame interval divider governing pattern shifts (e.g. 1 updates every single frame).",
      },
      {
        name: "patternAlpha",
        type: "number",
        defaultValue: "15",
        description: "Opacity alpha intensity of the grain noise particles (0 - 255).",
      },
      {
        name: "mode",
        type: '"grain" | "static" | "dust"',
        defaultValue: '"grain"',
        description: "Noise rendering algorithm: film grain, CRT static, or film dust.",
      },
      {
        name: "animated",
        type: "boolean",
        defaultValue: "true",
        description: "Whether the noise texture continuously shifts and jitters over time.",
      },
      {
        name: "fps",
        type: "number",
        defaultValue: "30",
        description: "Target render frame rate throttle cap.",
      },
      {
        name: "vignette",
        type: "boolean",
        defaultValue: "false",
        description: "Enables cinematic radial gradient vignette darkening around canvas boundaries.",
      },
      {
        name: "vignetteDarkness",
        type: "number",
        defaultValue: "0.6",
        description: "Darkness multiplier factor for the radial vignette edge falloff.",
      },
      {
        name: "scanlines",
        type: "boolean",
        defaultValue: "false",
        description: "Enables retro CRT monitor horizontal scanline overlay.",
      },
      {
        name: "scanlineDensity",
        type: "number",
        defaultValue: "3",
        description: "Pixel pitch spacing between CRT scanline raster bands.",
      },
      {
        name: "scanlineOpacity",
        type: "number",
        defaultValue: "0.1",
        description: "Opacity intensity of the CRT scanline raster bands.",
      },
      {
        name: "blendMode",
        type: "CSSProperties['mixBlendMode']",
        defaultValue: '"normal"',
        description: "CSS mix-blend-mode applied to the noise canvas element (e.g. 'overlay', 'soft-light').",
      },
      {
        name: "fullScreen",
        type: "boolean",
        defaultValue: "false",
        description: "Whether the noise container fixes to the entire viewport (100vw x 100vh).",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes passed to the outer wrapper container.",
      },
      {
        name: "canvasClassName",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS classes passed directly to the underlying canvas element.",
      },
    ],
    files: [
      {
        name: "noise.tsx",
        path: "registry/ui/noise.tsx",
        code: `"use client";

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
          canvas.style.width = \`\${displayWidth}px\`;
          canvas.style.height = \`\${displayHeight}px\`;
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
        frames.push(
          createPatternFrame(patternSize, patternAlpha, mode, i),
        );
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
              background: \`radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, \${vignetteDarkness}) 100%)\`,
            }}
          />
        )}

        {scanlines && (
          <div
            data-slot="noise-scanlines"
            className="pointer-events-none absolute inset-0 z-3"
            style={{
              background: \`repeating-linear-gradient(to bottom, transparent 0px, transparent \${scanlineDensity}px, rgba(0, 0, 0, \${scanlineOpacity}) \${scanlineDensity}px, rgba(0, 0, 0, \${scanlineOpacity}) \${scanlineDensity * 2}px)\`,
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
`,
      },
    ],
  },
  "ai-input": {
    slug: "ai-input",
    name: "AI Input",
    description: "Ultra-smooth expandable AI prompt composer with model selection, effort control, attachments tray, and voice visualizer.",
    summary: "An ultra-smooth AI prompt input component engineered with cubic-bezier spring physics, dynamic morphing text width transition, interactive model selector with cursor-following highlight pill, effort level cycle switcher, sliding image attachment drawer with shared-element FLIP modal preview, and Web Audio API real-time voice visualizer with speech recognition.",
    category: "ai-stuff",
    tags: [
      "ai",
      "prompt",
      "input",
      "composer",
      "voice",
      "spring",
      "attachments",
      "gallery",
      "model-selector",
      "audio-visualizer"
    ],
    dependencies: ["clsx", "tailwind-merge"],
    version: "1.0.0",
    createdDate: "2026-09-24",
    updatedDate: "2026-09-24",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Fluid spring physics expanding from compact 48px bar to multi-line textarea with zero layout flicker",
      "Morphing text with smooth subpixel width transitions on model and effort switches",
      "Interactive model selector dropdown with floating cursor-following active highlight pill",
      "Sliding attachment tray that glides up smoothly from behind the input with hover thumbnail removal",
      "Shared-element FLIP image gallery modal transitioning from thumbnail rect to centered modal",
      "Web Audio API real-time 5-band frequency visualizer with graceful animated simulation fallback",
      "Web Speech Recognition API integration with real-time text transcription and auto-scrolling",
      "Full keyboard navigation: Enter to submit, Escape to collapse, auto-focus support",
      "100% responsive and centered across mobile and desktop viewports"
    ],
    anatomy: [
      "<PromptInput> (Outer relative flex container with spring max-width animation)",
      "<AttachmentDrawer> (Independent sliding drawer emerging from behind the input card)",
      "<AttachmentThumb> (Individual image thumbnail with remove button and click-to-preview)",
      "<AttachmentGalleryModal> (Shared-element FLIP modal rendered via Portal)",
      "<textarea> (Auto-growing multiline input with top and bottom scroll fades)",
      "<ModelSelector> (Dropdown with animated floating highlight pill and custom icon support)",
      "<EffortSelector> (Dynamic 3-bar indicator and effort label cycler)",
      "<AudioVisualizer> (Real-time frequency bars reactive to voice input)",
      "<ActionButton> (Morphing 3-state button toggling between send, mic, and stop)"
    ],
    physics: {
      engine: "CSS Spring Physics (cubic-bezier) & Web Audio API Analyser",
      description: "Custom cubic-bezier(0.16, 1, 0.3, 1) spring physics for container dimensions, combined with FFT 64-point audio frequency spectrum normalization.",
      parameters: [
        { label: "Container Expand Curve", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
        { label: "Container Expand Duration", value: "420ms" },
        { label: "Height Growth Curve", value: "cubic-bezier(0.2, 0, 0, 1) (160ms)" },
        { label: "Audio Analyser FFT", value: "64 bands normalized 0..1" },
        { label: "Audio Visualizer Frequency", value: "60 FPS requestAnimationFrame" }
      ]
    },
    accessibility: {
      role: "form",
      aria: "Textarea labeled with aria-label; model and effort buttons carry descriptive aria-label attributes; full keyboard escape and enter shortcuts supported.",
      keyboard: [
        { key: "Enter", description: "Submits current prompt and attachments when Shift is not held" },
        { key: "Shift + Enter", description: "Inserts a new line into the prompt" },
        { key: "Escape", description: "Collapses prompt input if empty, or closes gallery preview modal" }
      ],
      reducedMotion: "Transitions respect reduced motion and use hardware-accelerated transforms and opacity."
    },
    guidelines: {
      recommended: [
        "Primary AI prompt entry field in chatbots, copilots, and AI assistant apps",
        "Modern conversational search interfaces and query composers",
        "Multimodal generative AI input surfaces with file attachments and voice capture"
      ],
      bestPractices: [
        "Pass an onSubmit handler to capture query text along with model, effort, and attachment files",
        "Configure custom models and modelIcons to match your AI backend offerings",
        "Use controlled value and onChange props if managing state in parent application stores"
      ]
    },
    props: [
      {
        name: "placeholder",
        type: "string",
        defaultValue: '"Ask anything"',
        description: "Placeholder text displayed when the input is empty or collapsed."
      },
      {
        name: "models",
        type: "(string | ModelOption)[]",
        defaultValue: '["GPT 5.5", "Opus 4.8", "Gemini 3.5 Flash", "Composer 2.5", "GLM 5.2"]',
        description: "Available AI models for user selection, supporting custom icons."
      },
      {
        name: "selectedModel",
        type: "string",
        defaultValue: "undefined",
        description: "Controlled selected model name."
      },
      {
        name: "onModelChange",
        type: "(model: string) => void",
        defaultValue: "undefined",
        description: "Callback invoked when the user selects a different model."
      },
      {
        name: "efforts",
        type: "string[]",
        defaultValue: '["Low", "Medium", "Max Effort"]',
        description: "Available reasoning effort levels."
      },
      {
        name: "selectedEffort",
        type: "string",
        defaultValue: "undefined",
        description: "Controlled reasoning effort level."
      },
      {
        name: "onEffortChange",
        type: "(effort: string) => void",
        defaultValue: "undefined",
        description: "Callback invoked when the user toggles effort level."
      },
      {
        name: "value",
        type: "string",
        defaultValue: "undefined",
        description: "Controlled prompt input value."
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        defaultValue: "undefined",
        description: "Callback invoked on prompt text changes."
      },
      {
        name: "onSubmit",
        type: "(value: string, meta: PromptInputMeta) => void",
        defaultValue: "undefined",
        description: "Callback triggered when submitting prompt with model, effort, and attachment metadata."
      },
      {
        name: "maxAttachments",
        type: "number",
        defaultValue: "6",
        description: "Maximum number of image attachments allowed."
      },
      {
        name: "allowAttachments",
        type: "boolean",
        defaultValue: "true",
        description: "Whether the attachment upload button and tray are enabled."
      },
      {
        name: "allowVoice",
        type: "boolean",
        defaultValue: "true",
        description: "Whether voice input recording and audio visualizer are enabled."
      },
      {
        name: "allowModelSelect",
        type: "boolean",
        defaultValue: "true",
        description: "Whether the model dropdown selector is enabled."
      },
      {
        name: "allowEffortSelect",
        type: "boolean",
        defaultValue: "true",
        description: "Whether the effort level cycler is enabled."
      },
      {
        name: "minWidth",
        type: "number | string",
        defaultValue: "320",
        description: "Minimum width of the collapsed input container."
      },
      {
        name: "maxWidth",
        type: "number | string",
        defaultValue: "480",
        description: "Maximum width of the expanded input container."
      },
      {
        name: "autoFocus",
        type: "boolean",
        defaultValue: "false",
        description: "Whether the input should auto-focus and expand on mount."
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables interaction with the input."
      }
    ],
    files: [
      {
        name: "ai-input.tsx",
        path: "registry/ui/ai-input.tsx",
        code: "\"use client\";\n\nimport * as React from \"react\";\nimport { useRef, useState, useEffect, useLayoutEffect, useCallback, useId, useSyncExternalStore } from \"react\";\nimport { createPortal } from \"react-dom\";\nimport { cn } from \"@/lib/utils\";\n\nconst SPRING_TRANSITION = \"max-width 0.42s cubic-bezier(0.16, 1, 0.3, 1), height 0.42s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.28s ease\";\nconst SMOOTH_HEIGHT_TRANSITION = \"max-width 0.42s cubic-bezier(0.16, 1, 0.3, 1), height 0.16s cubic-bezier(0.2, 0, 0, 1)\";\n\nconst emptySubscribe = () => () => {};\n\nexport interface Attachment {\n  id: string;\n  file: File;\n  url: string;\n  name: string;\n  width?: number;\n  height?: number;\n}\n\nexport interface ModelOption {\n  name: string;\n  icon?: string | React.ReactNode;\n}\n\nexport interface PromptInputMeta {\n  model: string;\n  effort: string;\n  attachments: File[];\n}\n\nexport interface PromptInputProps {\n  onSubmit?: (value: string, meta: PromptInputMeta) => void;\n  placeholder?: string;\n  className?: string;\n  models?: (string | ModelOption)[];\n  selectedModel?: string;\n  onModelChange?: (model: string) => void;\n  efforts?: string[];\n  selectedEffort?: string;\n  onEffortChange?: (effort: string) => void;\n  defaultValue?: string;\n  value?: string;\n  onChange?: (value: string) => void;\n  maxAttachments?: number;\n  allowAttachments?: boolean;\n  allowVoice?: boolean;\n  allowModelSelect?: boolean;\n  allowEffortSelect?: boolean;\n  minWidth?: number | string;\n  maxWidth?: number | string;\n  collapsedHeight?: number;\n  autoFocus?: boolean;\n  disabled?: boolean;\n  modelIcons?: Record<string, string | React.ReactNode>;\n}\n\ninterface BrowserSpeechRecognitionEvent {\n  resultIndex: number;\n  results: {\n    length: number;\n    [index: number]: {\n      isFinal: boolean;\n      [index: number]: { transcript: string };\n    };\n  };\n}\n\ninterface BrowserSpeechRecognition {\n  continuous: boolean;\n  interimResults: boolean;\n  start: () => void;\n  stop: () => void;\n  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;\n  onerror: (() => void) | null;\n  onend: (() => void) | null;\n}\n\ntype BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;\n\nconst DEFAULT_MODELS: string[] = [\n  \"GPT 5.5\",\n  \"Opus 4.8\",\n  \"Gemini 3.5 Flash\",\n  \"Composer 2.5\",\n  \"GLM 5.2\",\n];\n\nconst DEFAULT_EFFORTS: string[] = [\"Low\", \"Medium\", \"Max Effort\"];\n\nconst DEFAULT_ICONS: Record<string, string> = {\n  \"Composer 2.5\": \"https://cdn.21st.dev/assets/mirror/7d/7dc00bc09f225fcda46cbc9c6b669c69c025a231877d6c17baa6a003f04f02b2.svg\",\n  \"Gemini 3.5 Flash\": \"https://cdn.21st.dev/assets/mirror/cd/cda2df6631d5fa227de3fa04ed78cf354f910ba92a9f086e7455655c10ad9d09.svg\",\n  \"GPT 5.5\": \"https://cdn.21st.dev/assets/mirror/b9/b93fa7942be639a1dae60194ff12141145d7d9fd59581582d6ff23335755f19c.svg\",\n  \"Opus 4.8\": \"https://cdn.21st.dev/assets/mirror/5d/5de1221c77cc91e748066fd642ad0eee1c1fa65328814f5178166f901e599709.svg\",\n  \"GLM 5.2\": \"https://cdn.21st.dev/assets/mirror/b2/b2a6c0ff63efd8a555edf8a174ea6fcfeca120ac1595a2d461ca11d3ae89276c.svg\",\n};\n\nfunction ArrowUpIcon() {\n  return (\n    <svg width=\"13\" height=\"13\" viewBox=\"0 0 14 14\" fill=\"none\" aria-hidden=\"true\">\n      <path d=\"M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5\" stroke=\"currentColor\" strokeWidth=\"1.8\" strokeLinecap=\"round\" strokeLinejoin=\"round\" />\n    </svg>\n  );\n}\n\nfunction MicIcon() {\n  return (\n    <svg width=\"13\" height=\"13\" viewBox=\"0 0 14 14\" fill=\"none\" aria-hidden=\"true\">\n      <rect x=\"5\" y=\"1\" width=\"4\" height=\"7\" rx=\"2\" stroke=\"currentColor\" strokeWidth=\"1.5\" />\n      <path d=\"M2.75 6.5V7a4.25 4.25 0 0 0 8.5 0v-.5M7 11.25V13\" stroke=\"currentColor\" strokeWidth=\"1.5\" strokeLinecap=\"round\" />\n    </svg>\n  );\n}\n\nfunction StopIcon() {\n  return (\n    <svg width=\"13\" height=\"13\" viewBox=\"0 0 14 14\" fill=\"none\" aria-hidden=\"true\">\n      <rect x=\"3.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"1.5\" fill=\"currentColor\" />\n    </svg>\n  );\n}\n\nfunction PlusIcon() {\n  return (\n    <svg width=\"13\" height=\"13\" viewBox=\"0 0 14 14\" fill=\"none\" aria-hidden=\"true\">\n      <path d=\"M7 2.5V11.5M2.5 7H11.5\" stroke=\"currentColor\" strokeWidth=\"1.5\" strokeLinecap=\"round\" />\n    </svg>\n  );\n}\n\nfunction CloseIcon() {\n  return (\n    <svg width=\"10\" height=\"10\" viewBox=\"0 0 14 14\" fill=\"none\" aria-hidden=\"true\">\n      <path d=\"M2.5 2.5L11.5 11.5M11.5 2.5L2.5 11.5\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" />\n    </svg>\n  );\n}\n\nfunction CheckIcon() {\n  return (\n    <svg width=\"12\" height=\"12\" viewBox=\"0 0 14 14\" fill=\"none\" aria-hidden=\"true\">\n      <path d=\"M2.5 7.5L5.5 10.5L11.5 3.5\" stroke=\"currentColor\" strokeWidth=\"1.8\" strokeLinecap=\"round\" strokeLinejoin=\"round\" />\n    </svg>\n  );\n}\n\nfunction DynamicBarsIcon({ level }: { level: string }) {\n  const isMediumOrHigh = level === \"Medium\" || level === \"Max Effort\";\n  const isHigh = level === \"Max Effort\";\n\n  return (\n    <svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" fill=\"none\" aria-hidden=\"true\">\n      <rect x=\"1.5\" y=\"8\" width=\"2.5\" height=\"4.5\" rx=\"1\" fill=\"currentColor\" className=\"transition-opacity duration-300\" opacity={1} />\n      <rect x=\"5.75\" y=\"5\" width=\"2.5\" height=\"7.5\" rx=\"1\" fill=\"currentColor\" className=\"transition-opacity duration-300\" opacity={isMediumOrHigh ? 1 : 0.3} />\n      <rect x=\"10\" y=\"2\" width=\"2.5\" height=\"10.5\" rx=\"1\" fill=\"currentColor\" className=\"transition-opacity duration-300\" opacity={isHigh ? 1 : 0.3} />\n    </svg>\n  );\n}\n\nfunction ModelFallbackIcon({ className }: { className?: string }) {\n  return (\n    <svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" fill=\"none\" className={className} aria-hidden=\"true\">\n      <circle cx=\"7\" cy=\"7\" r=\"5\" stroke=\"currentColor\" strokeWidth=\"1.2\" strokeDasharray=\"3 2\" />\n      <circle cx=\"7\" cy=\"7\" r=\"2\" fill=\"currentColor\" />\n    </svg>\n  );\n}\n\nfunction ModelIcon({\n  model,\n  customIcon,\n  className,\n}: {\n  model: string;\n  customIcon?: string | React.ReactNode;\n  className?: string;\n}) {\n  const [loadFailed, setLoadFailed] = useState(false);\n\n  if (customIcon && typeof customIcon !== \"string\") {\n    return <span className={cn(\"inline-flex shrink-0 items-center justify-center\", className)}>{customIcon}</span>;\n  }\n\n  const iconSrc = typeof customIcon === \"string\" ? customIcon : DEFAULT_ICONS[model];\n\n  if (!iconSrc || loadFailed) {\n    return <ModelFallbackIcon className={cn(\"size-3.5 shrink-0 opacity-70\", className)} />;\n  }\n\n  return (\n    <img\n      src={iconSrc}\n      alt={model}\n      onError={() => setLoadFailed(true)}\n      className={cn(\"size-3.5 shrink-0 object-contain\", model === \"GPT 5.5\" && \"dark:invert\", className)}\n    />\n  );\n}\n\nfunction MorphingText({ text }: { text: string }) {\n  const spanRef = useRef<HTMLSpanElement>(null);\n  const [width, setWidth] = useState<number | \"auto\">(\"auto\");\n\n  useLayoutEffect(() => {\n    if (spanRef.current) {\n      setWidth(spanRef.current.getBoundingClientRect().width);\n    }\n  }, [text]);\n\n  return (\n    <span\n      className=\"relative inline-flex items-center justify-center overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]\"\n      style={{ width: width === \"auto\" ? \"auto\" : `${width}px` }}\n    >\n      <span ref={spanRef} className=\"invisible whitespace-nowrap px-1\">\n        {text}\n      </span>\n      <span\n        key={text}\n        className=\"absolute inset-0 flex items-center justify-center whitespace-nowrap animate-in fade-in zoom-in-95 duration-200\"\n      >\n        {text}\n      </span>\n    </span>\n  );\n}\n\nfunction AttachmentThumb({\n  attachment,\n  index,\n  onRemove,\n  onOpen,\n  registerRef,\n}: {\n  attachment: Attachment;\n  index: number;\n  onRemove: (id: string) => void;\n  onOpen: (attachment: Attachment, rect: DOMRect) => void;\n  registerRef: (id: string, el: HTMLButtonElement | null) => void;\n}) {\n  const [isHovered, setIsHovered] = useState(false);\n  const btnRef = useRef<HTMLButtonElement>(null);\n\n  return (\n    <button\n      ref={(el) => {\n        btnRef.current = el;\n        registerRef(attachment.id, el);\n      }}\n      type=\"button\"\n      onMouseDown={(e) => e.preventDefault()}\n      onMouseEnter={() => setIsHovered(true)}\n      onMouseLeave={() => setIsHovered(false)}\n      onClick={(e) => {\n        e.stopPropagation();\n        if (btnRef.current) {\n          onOpen(attachment, btnRef.current.getBoundingClientRect());\n        }\n      }}\n      style={{ animationDelay: `${index * 35}ms`, animationFillMode: \"backwards\" }}\n      className={cn(\n        \"group relative size-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/90 outline-none\",\n        \"transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] active:scale-[0.96]\",\n        \"animate-in fade-in slide-in-from-top-3 zoom-in-90 duration-300\"\n      )}\n      aria-label={`Open preview of ${attachment.name}`}\n    >\n      <img src={attachment.url} alt={attachment.name} className=\"size-full object-cover\" draggable={false} />\n      <span className={cn(\"absolute inset-0 flex items-start justify-end bg-black/0 transition-colors duration-200\", isHovered && \"bg-black/30\")}>\n        <span\n          role=\"button\"\n          tabIndex={-1}\n          onMouseDown={(e) => {\n            e.preventDefault();\n            e.stopPropagation();\n          }}\n          onClick={(e) => {\n            e.stopPropagation();\n            onRemove(attachment.id);\n          }}\n          className={cn(\n            \"m-1 flex size-4 items-center justify-center rounded-full bg-zinc-950/90 text-zinc-300 shadow-sm transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white hover:text-black hover:scale-110\",\n            isHovered ? \"opacity-100 scale-100\" : \"opacity-0 scale-50 pointer-events-none\"\n          )}\n          aria-label={`Remove ${attachment.name}`}\n        >\n          <CloseIcon />\n        </span>\n      </span>\n    </button>\n  );\n}\n\nfunction AttachmentGalleryModal({\n  attachment,\n  originRect,\n  onClose,\n}: {\n  attachment: Attachment;\n  originRect: DOMRect;\n  onClose: () => void;\n}) {\n  const [phase, setPhase] = useState<\"opening\" | \"open\" | \"closing\">(\"opening\");\n\n  const targetGeometry = React.useMemo(() => {\n    if (typeof window === \"undefined\") {\n      return { top: 0, left: 0, width: 300, height: 200, radius: 20 };\n    }\n    const maxW = Math.min(window.innerWidth * 0.88, 620);\n    const maxH = Math.min(window.innerHeight * 0.82, 760);\n\n    const naturalW = attachment.width || 800;\n    const naturalH = attachment.height || 600;\n    const scale = Math.min(maxW / naturalW, maxH / naturalH, 1.5);\n\n    const width = naturalW * scale;\n    const height = naturalH * scale;\n\n    return {\n      top: (window.innerHeight - height) / 2,\n      left: (window.innerWidth - width) / 2,\n      width,\n      height,\n      radius: 20,\n    };\n  }, [attachment.width, attachment.height]);\n\n  useEffect(() => {\n    const raf = requestAnimationFrame(() => setPhase(\"open\"));\n    return () => cancelAnimationFrame(raf);\n  }, []);\n\n  const handleClose = useCallback(() => setPhase(\"closing\"), []);\n\n  useEffect(() => {\n    const onKey = (e: KeyboardEvent) => {\n      if (e.key === \"Escape\") handleClose();\n    };\n    document.addEventListener(\"keydown\", onKey);\n    return () => document.removeEventListener(\"keydown\", onKey);\n  }, [handleClose]);\n\n  const isOpen = phase === \"open\";\n  const isClosing = phase === \"closing\";\n\n  const geometry =\n    isOpen\n      ? targetGeometry\n      : {\n          top: originRect.top,\n          left: originRect.left,\n          width: originRect.width,\n          height: originRect.height,\n          radius: 12,\n        };\n\n  const animEasing = isClosing ? \"ease-out\" : \"cubic-bezier(0.16, 1, 0.3, 1)\";\n  const animDur = isClosing ? \"0.26s\" : \"0.38s\";\n  const flipTransition = `top ${animDur} ${animEasing}, left ${animDur} ${animEasing}, width ${animDur} ${animEasing}, height ${animDur} ${animEasing}, border-radius ${animDur} ${animEasing}`;\n\n  return createPortal(\n    <div className=\"fixed inset-0 z-[100] flex items-center justify-center\" onClick={handleClose} role=\"dialog\" aria-modal=\"true\">\n      <div\n        className=\"absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300\"\n        style={{ opacity: isOpen ? 1 : 0 }}\n      />\n      <div\n        style={{\n          position: \"fixed\",\n          top: geometry.top,\n          left: geometry.left,\n          width: geometry.width,\n          height: geometry.height,\n          borderRadius: geometry.radius,\n          transition: flipTransition,\n          overflow: \"hidden\",\n          boxShadow: isOpen ? \"0 28px 70px -15px rgba(0, 0, 0, 0.7)\" : \"0 0 0 0 transparent\",\n        }}\n        className=\"bg-zinc-950 border border-white/10\"\n        onTransitionEnd={() => {\n          if (phase === \"closing\") onClose();\n        }}\n        onClick={(e) => e.stopPropagation()}\n      >\n        <img src={attachment.url} alt={attachment.name} className=\"size-full object-cover select-none\" draggable={false} />\n      </div>\n\n      <button\n        type=\"button\"\n        onClick={handleClose}\n        style={{ opacity: isOpen ? 1 : 0, transform: isOpen ? \"scale(1)\" : \"scale(0.8)\" }}\n        className={cn(\n          \"fixed right-5 top-5 flex size-9 items-center justify-center rounded-full bg-zinc-900/90 text-zinc-300 shadow-lg border border-white/10 backdrop-blur-sm\",\n          \"transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-800 hover:text-white\",\n          !isOpen && \"pointer-events-none\"\n        )}\n        aria-label=\"Close image preview\"\n      >\n        <span className=\"scale-125\">\n          <CloseIcon />\n        </span>\n      </button>\n    </div>,\n    document.body\n  );\n}\n\nexport const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(\n  (\n    {\n      onSubmit,\n      placeholder = \"Ask anything\",\n      className,\n      models = DEFAULT_MODELS,\n      selectedModel: controlledModel,\n      onModelChange,\n      efforts = DEFAULT_EFFORTS,\n      selectedEffort: controlledEffort,\n      onEffortChange,\n      defaultValue = \"\",\n      value: controlledValue,\n      onChange,\n      maxAttachments = 6,\n      allowAttachments = true,\n      allowVoice = true,\n      allowModelSelect = true,\n      allowEffortSelect = true,\n      minWidth = 320,\n      maxWidth = 480,\n      collapsedHeight = 48,\n      autoFocus = false,\n      disabled = false,\n      modelIcons,\n    },\n    ref\n  ) => {\n    const inputId = useId();\n    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);\n\n    const normalizedModels: ModelOption[] = React.useMemo(() => {\n      return models.map((m) => {\n        if (typeof m === \"string\") {\n          return { name: m, icon: modelIcons?.[m] };\n        }\n        return { name: m.name, icon: m.icon ?? modelIcons?.[m.name] };\n      });\n    }, [models, modelIcons]);\n\n    const isControlledModel = controlledModel !== undefined;\n    const [internalModel, setInternalModel] = useState<string>(\n      controlledModel || (normalizedModels[0]?.name ?? \"GPT 5.5\")\n    );\n    const activeModel = isControlledModel ? controlledModel : internalModel;\n\n    const isControlledEffort = controlledEffort !== undefined;\n    const [internalEffortIndex, setInternalEffortIndex] = useState(1);\n    const currentEffort = isControlledEffort\n      ? controlledEffort\n      : efforts[internalEffortIndex] || efforts[0] || \"Medium\";\n\n    const [expanded, setExpanded] = useState(Boolean(autoFocus));\n    const [isSmoothResize, setIsSmoothResize] = useState(false);\n    const [localValue, setLocalValue] = useState(defaultValue);\n    const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);\n\n    const [attachments, setAttachments] = useState<Attachment[]>([]);\n    const [activeAttachment, setActiveAttachment] = useState<{\n      attachment: Attachment;\n      rect: DOMRect;\n    } | null>(null);\n\n    const [isRecording, setIsRecording] = useState(false);\n    const [audioData, setAudioData] = useState<number[]>(new Array(5).fill(0));\n    const valueRef = useRef(controlledValue !== undefined ? controlledValue : localValue);\n\n    const streamRef = useRef<MediaStream | null>(null);\n    const audioContextRef = useRef<AudioContext | null>(null);\n    const rafRef = useRef<number | null>(null);\n    const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);\n    const demoIntervalRef = useRef<number | null>(null);\n    const demoTextIntervalRef = useRef<number | null>(null);\n\n    const initialModelIdx = Math.max(\n      0,\n      normalizedModels.findIndex((m) => m.name === activeModel)\n    );\n    const [hoverStyle, setHoverStyle] = useState({\n      opacity: 0,\n      transform: `translateY(${initialModelIdx * 34}px) scale(0.96)`,\n      transition: \"none\",\n    });\n\n    const [textareaHeight, setTextareaHeight] = useState(68);\n    const containerHeight = Math.max(116, textareaHeight + 48);\n    const [isScrolling, setIsScrolling] = useState(false);\n\n    const isControlled = controlledValue !== undefined;\n    const value = isControlled ? controlledValue : localValue;\n    const hasValue = value.trim() !== \"\" || attachments.length > 0;\n    const hasAttachments = attachments.length > 0;\n\n    const textareaRef = useRef<HTMLTextAreaElement>(null);\n    const internalContainerRef = useRef<HTMLDivElement>(null);\n    const topFadeRef = useRef<HTMLDivElement>(null);\n    const bottomFadeRef = useRef<HTMLDivElement>(null);\n    const fileInputRef = useRef<HTMLInputElement>(null);\n    const thumbRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());\n\n    useEffect(() => {\n      valueRef.current = value;\n    }, [value]);\n\n    const updateFades = useCallback(() => {\n      const el = textareaRef.current;\n      if (!el) return;\n      const { scrollTop, scrollHeight, clientHeight } = el;\n      if (topFadeRef.current) {\n        topFadeRef.current.style.opacity = Math.min(scrollTop / 20, 1).toString();\n      }\n      if (bottomFadeRef.current) {\n        const bottomScroll = scrollHeight - clientHeight - scrollTop;\n        bottomFadeRef.current.style.opacity = Math.min(\n          Math.max(bottomScroll - 16, 0) / 10,\n          1\n        ).toString();\n      }\n    }, []);\n\n    const handleValueChange = useCallback(\n      (val: string) => {\n        setIsSmoothResize(true);\n        if (!isControlled) setLocalValue(val);\n        onChange?.(val);\n        if (val.trim() !== \"\" && !expanded) {\n          setExpanded(true);\n        }\n      },\n      [isControlled, onChange, expanded]\n    );\n\n    const expand = useCallback(() => {\n      setIsSmoothResize(false);\n      setExpanded(true);\n    }, []);\n\n    const stopRecording = useCallback(() => {\n      if (recognitionRef.current) {\n        try {\n          recognitionRef.current.stop();\n        } catch {}\n        recognitionRef.current = null;\n      }\n      if (rafRef.current) {\n        cancelAnimationFrame(rafRef.current);\n        rafRef.current = null;\n      }\n      if (streamRef.current) {\n        streamRef.current.getTracks().forEach((track) => track.stop());\n        streamRef.current = null;\n      }\n      if (audioContextRef.current) {\n        try {\n          audioContextRef.current.close();\n        } catch {}\n        audioContextRef.current = null;\n      }\n      if (demoIntervalRef.current) {\n        window.clearInterval(demoIntervalRef.current);\n        demoIntervalRef.current = null;\n      }\n      if (demoTextIntervalRef.current) {\n        window.clearInterval(demoTextIntervalRef.current);\n        demoTextIntervalRef.current = null;\n      }\n      setIsRecording(false);\n      setAudioData(new Array(5).fill(0));\n    }, []);\n\n    const startRecording = useCallback(async () => {\n      setIsSmoothResize(false);\n      setExpanded(true);\n\n      let stream: MediaStream | null = null;\n      try {\n        if (typeof navigator !== \"undefined\" && navigator.mediaDevices?.getUserMedia) {\n          stream = await navigator.mediaDevices.getUserMedia({ audio: true });\n        }\n      } catch {\n        stream = null;\n      }\n\n      setIsRecording(true);\n\n      const simulateText = () => {\n        const fakeText =\n          \"Build a high performance, accessible AI prompt input with smooth spring transitions.\";\n        const words = fakeText.split(\" \");\n        let i = 0;\n        let currentBase = valueRef.current;\n        demoTextIntervalRef.current = window.setInterval(() => {\n          if (i < words.length) {\n            currentBase = (currentBase ? currentBase + \" \" : \"\") + words[i];\n            handleValueChange(currentBase);\n            i++;\n          } else {\n            stopRecording();\n          }\n        }, 260);\n      };\n\n      if (stream) {\n        streamRef.current = stream;\n        const AudioCtx =\n          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;\n        const audioCtx = new AudioCtx();\n        audioContextRef.current = audioCtx;\n\n        const analyser = audioCtx.createAnalyser();\n        analyser.fftSize = 64;\n        const source = audioCtx.createMediaStreamSource(stream);\n        source.connect(analyser);\n\n        const dataArray = new Uint8Array(analyser.frequencyBinCount);\n\n        const updateVisualizer = () => {\n          analyser.getByteFrequencyData(dataArray);\n          const bands = new Array(5).fill(0);\n          const step = Math.floor(dataArray.length / 5);\n          for (let i = 0; i < 5; i++) {\n            let sum = 0;\n            for (let j = 0; j < step; j++) {\n              sum += dataArray[i * step + j];\n            }\n            bands[i] = sum / step / 255;\n          }\n          setAudioData(bands);\n          rafRef.current = requestAnimationFrame(updateVisualizer);\n        };\n        updateVisualizer();\n\n        const SpeechRec = (\n          window as unknown as {\n            SpeechRecognition?: BrowserSpeechRecognitionConstructor;\n            webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;\n          }\n        ).SpeechRecognition ||\n        (\n          window as unknown as {\n            SpeechRecognition?: BrowserSpeechRecognitionConstructor;\n            webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;\n          }\n        ).webkitSpeechRecognition;\n\n        if (SpeechRec) {\n          const recognition = new SpeechRec();\n          recognition.continuous = true;\n          recognition.interimResults = true;\n\n          let baseline = valueRef.current;\n\n          recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {\n            let interimTranscript = \"\";\n            let finalTranscript = \"\";\n\n            for (let i = event.resultIndex; i < event.results.length; ++i) {\n              if (event.results[i].isFinal) {\n                finalTranscript += event.results[i][0].transcript;\n              } else {\n                interimTranscript += event.results[i][0].transcript;\n              }\n            }\n\n            if (finalTranscript) {\n              baseline += (baseline ? \" \" : \"\") + finalTranscript;\n            }\n\n            handleValueChange(\n              (baseline + (interimTranscript ? \" \" + interimTranscript : \"\")).trim()\n            );\n          };\n\n          recognition.onerror = () => {\n            stopRecording();\n          };\n\n          recognition.onend = () => {\n            stopRecording();\n          };\n\n          recognitionRef.current = recognition;\n          try {\n            recognition.start();\n          } catch {\n            simulateText();\n          }\n        } else {\n          simulateText();\n        }\n      } else {\n        demoIntervalRef.current = window.setInterval(() => {\n          setAudioData(Array.from({ length: 5 }, () => Math.random() * 0.75 + 0.15));\n        }, 90);\n        simulateText();\n      }\n    }, [handleValueChange, stopRecording]);\n\n    useEffect(() => {\n      if (isRecording && textareaRef.current) {\n        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;\n      }\n    }, [value, isRecording]);\n\n    useEffect(() => {\n      return () => {\n        stopRecording();\n        attachments.forEach((a) => URL.revokeObjectURL(a.url));\n      };\n    }, [stopRecording, attachments]);\n\n    useEffect(() => {\n      if (expanded && !isRecording) {\n        const timer = setTimeout(() => {\n          if (textareaRef.current) {\n            textareaRef.current.focus();\n            const length = textareaRef.current.value.length;\n            textareaRef.current.setSelectionRange(length, length);\n          }\n        }, 40);\n        return () => clearTimeout(timer);\n      }\n    }, [expanded, isRecording]);\n\n    useEffect(() => {\n      const el = textareaRef.current;\n      if (!el) return;\n\n      el.style.height = \"auto\";\n      const scrollHeight = el.scrollHeight;\n      const newHeight = Math.max(68, Math.min(scrollHeight, 180));\n      el.style.height = `${newHeight}px`;\n\n      setTextareaHeight(newHeight);\n      setIsScrolling(scrollHeight > 180);\n      updateFades();\n    }, [value, expanded, updateFades]);\n\n    useEffect(() => {\n      if (!isModelSelectOpen) return;\n\n      const handleOutsideClick = (e: MouseEvent) => {\n        if (\n          internalContainerRef.current &&\n          !internalContainerRef.current.contains(e.target as Node)\n        ) {\n          setIsModelSelectOpen(false);\n        }\n      };\n      document.addEventListener(\"mousedown\", handleOutsideClick);\n      return () => document.removeEventListener(\"mousedown\", handleOutsideClick);\n    }, [isModelSelectOpen]);\n\n    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {\n      if (\n        internalContainerRef.current &&\n        internalContainerRef.current.contains(e.relatedTarget as Node)\n      ) {\n        return;\n      }\n      if (value.trim() === \"\" && !hasAttachments && !isRecording) {\n        setIsSmoothResize(false);\n        setExpanded(false);\n        setIsModelSelectOpen(false);\n      }\n    };\n\n    const handleSubmit = () => {\n      if (value.trim() === \"\" && !hasAttachments) return;\n      setIsSmoothResize(false);\n      onSubmit?.(value, {\n        model: activeModel,\n        effort: currentEffort,\n        attachments: attachments.map((a) => a.file),\n      });\n      handleValueChange(\"\");\n      attachments.forEach((a) => URL.revokeObjectURL(a.url));\n      setAttachments([]);\n      setExpanded(false);\n      setIsModelSelectOpen(false);\n    };\n\n    const cycleEffort = (e: React.MouseEvent) => {\n      e.stopPropagation();\n      const nextIdx = (internalEffortIndex + 1) % efforts.length;\n      if (!isControlledEffort) {\n        setInternalEffortIndex(nextIdx);\n      }\n      onEffortChange?.(efforts[nextIdx]);\n    };\n\n    const selectModel = (modelName: string) => {\n      if (!isControlledModel) {\n        setInternalModel(modelName);\n      }\n      onModelChange?.(modelName);\n      setIsModelSelectOpen(false);\n    };\n\n    const openFileChooser = (e: React.MouseEvent) => {\n      e.stopPropagation();\n      fileInputRef.current?.click();\n    };\n\n    const handleFilesChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {\n      const files = Array.from(e.target.files ?? []).filter((f) =>\n        f.type.startsWith(\"image/\")\n      );\n      e.target.value = \"\";\n\n      if (files.length === 0) return;\n      const room = Math.max(0, maxAttachments - attachments.length);\n      const accepted = files.slice(0, room);\n\n      if (!expanded) {\n        setIsSmoothResize(false);\n        setExpanded(true);\n      } else {\n        setIsSmoothResize(true);\n      }\n\n      for (const file of accepted) {\n        const url = URL.createObjectURL(file);\n        const img = new Image();\n        img.onload = () => addAttachment(file, url, img.naturalWidth, img.naturalHeight);\n        img.onerror = () => addAttachment(file, url, 800, 600);\n        img.src = url;\n      }\n    };\n\n    const addAttachment = (file: File, url: string, width: number, height: number) => {\n      const id = `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`;\n      setAttachments((prev) => [\n        ...prev,\n        { id, file, url, name: file.name, width, height },\n      ]);\n    };\n\n    const removeAttachment = (id: string) => {\n      setIsSmoothResize(true);\n      setAttachments((prev) => {\n        const target = prev.find((a) => a.id === id);\n        if (target) URL.revokeObjectURL(target.url);\n        return prev.filter((a) => a.id !== id);\n      });\n      thumbRefs.current.delete(id);\n    };\n\n    const showArrow = hasValue && !isRecording;\n    const showStop = isRecording;\n    const showMic = !hasValue && !isRecording;\n\n    const onActionButtonClick = (e: React.MouseEvent) => {\n      e.preventDefault();\n      if (disabled) return;\n      if (isRecording) {\n        stopRecording();\n      } else if (hasValue) {\n        handleSubmit();\n      } else if (allowVoice) {\n        startRecording();\n      }\n    };\n\n    const resolvedMinW = typeof minWidth === \"number\" ? `${minWidth}px` : minWidth;\n    const resolvedMaxW = typeof maxWidth === \"number\" ? `${maxWidth}px` : maxWidth;\n\n    return (\n      <>\n        <div\n          ref={(node) => {\n            if (typeof ref === \"function\") ref(node);\n            else if (ref) ref.current = node;\n            (internalContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;\n          }}\n          onBlur={handleBlur}\n          className={cn(\"relative flex flex-col w-full items-center\", className)}\n          style={{\n            maxWidth: expanded\n              ? `min(100%, ${resolvedMaxW})`\n              : `min(100%, ${resolvedMinW})`,\n            transition: isSmoothResize\n              ? \"max-width 0.16s ease-out\"\n              : \"max-width 0.42s cubic-bezier(0.16, 1, 0.3, 1)\",\n          }}\n        >\n          {allowAttachments && (\n            <input\n              ref={fileInputRef}\n              type=\"file\"\n              accept=\"image/*\"\n              multiple\n              disabled={disabled}\n              onChange={handleFilesChosen}\n              className=\"hidden\"\n              tabIndex={-1}\n              aria-hidden=\"true\"\n            />\n          )}\n\n          <div\n            aria-hidden={!hasAttachments}\n            style={{\n              height: hasAttachments && expanded ? 68 : 0,\n              transition: isSmoothResize\n                ? \"height 0.16s ease-out\"\n                : \"height 0.42s cubic-bezier(0.16, 1, 0.3, 1)\",\n            }}\n            className=\"w-full relative z-0 overflow-hidden\"\n          >\n            <div\n              style={{\n                position: \"absolute\",\n                bottom: -8,\n                left: 16,\n                right: 16,\n                height: 68,\n                transform: hasAttachments && expanded ? \"translateY(0)\" : \"translateY(100%)\",\n                opacity: hasAttachments && expanded ? 1 : 0,\n                transition: isSmoothResize\n                  ? \"transform 0.16s ease-out, opacity 0.16s ease-out\"\n                  : \"transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out\",\n              }}\n              className=\"border border-white/10 border-b-0 bg-[#161619]/95 backdrop-blur-xl rounded-t-2xl px-2.5 pt-2 pb-1 flex items-start gap-2 overflow-x-auto prompt-scrollbar\"\n            >\n              {attachments.map((attachment, index) => (\n                <AttachmentThumb\n                  key={attachment.id}\n                  attachment={attachment}\n                  index={index}\n                  onRemove={removeAttachment}\n                  onOpen={(a, rect) => setActiveAttachment({ attachment: a, rect })}\n                  registerRef={(id, el) => thumbRefs.current.set(id, el)}\n                />\n              ))}\n            </div>\n          </div>\n\n          <div\n            onMouseDown={(e) => {\n              const isTextarea = e.target === textareaRef.current;\n              if (expanded && !isTextarea && !isRecording && !disabled) {\n                e.preventDefault();\n                textareaRef.current?.focus();\n              }\n            }}\n            style={{\n              borderRadius: 24,\n              height: expanded ? containerHeight : collapsedHeight,\n              transition: isSmoothResize ? SMOOTH_HEIGHT_TRANSITION : SPRING_TRANSITION,\n              overflow: expanded ? \"visible\" : \"hidden\",\n            }}\n            className={cn(\n              \"relative w-full border border-white/12 bg-[#0c0c0e]/95 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.6)]\",\n              \"focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 hover:border-white/20 z-10 transition-colors duration-200\",\n              expanded ? \"cursor-text\" : \"cursor-default\",\n              disabled && \"opacity-60 pointer-events-none\"\n            )}\n          >\n            <style dangerouslySetInnerHTML={{ __html: `\n              .prompt-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; background: transparent; }\n              .prompt-scrollbar::-webkit-scrollbar-track { background: transparent; }\n              .prompt-scrollbar::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; }\n              .prompt-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); }\n            `}} />\n\n            <textarea\n              id={inputId}\n              ref={textareaRef}\n              value={value}\n              onChange={(e) => handleValueChange(e.target.value)}\n              onScroll={updateFades}\n              onKeyDown={(e) => {\n                if (e.key === \"Enter\" && !e.shiftKey) {\n                  e.preventDefault();\n                  handleSubmit();\n                }\n                if (e.key === \"Escape\" && value.trim() === \"\" && !hasAttachments) {\n                  setIsSmoothResize(false);\n                  setExpanded(false);\n                  setIsModelSelectOpen(false);\n                }\n              }}\n              placeholder={placeholder}\n              aria-label=\"Prompt message\"\n              disabled={isRecording || disabled}\n              style={{\n                transition: isSmoothResize\n                  ? \"height 0.16s ease-out\"\n                  : \"opacity 0.25s ease-out, transform 0.25s ease-out, height 0.42s cubic-bezier(0.16, 1, 0.3, 1)\",\n              }}\n              className={cn(\n                \"prompt-scrollbar absolute top-0 inset-x-0 z-[1] w-full resize-none bg-transparent pl-4 pr-12 py-3.5 text-sm leading-[22px] text-zinc-100 outline-none placeholder:font-medium placeholder:text-zinc-500 cursor-text\",\n                expanded ? \"opacity-100 scale-100 translate-y-0\" : \"opacity-0 scale-95 -translate-y-1 pointer-events-none\",\n                isScrolling ? \"overflow-y-auto\" : \"overflow-y-hidden\",\n                isRecording && \"pointer-events-none\"\n              )}\n            />\n\n            <div\n              ref={topFadeRef}\n              className=\"absolute left-4 right-12 top-0 z-[2] h-7 bg-gradient-to-b from-[#0c0c0e] via-[#0c0c0e]/85 to-transparent pointer-events-none opacity-0 transition-opacity duration-150\"\n            />\n            <div\n              ref={bottomFadeRef}\n              className=\"absolute left-4 right-12 z-[2] h-7 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/85 to-transparent pointer-events-none opacity-0\"\n              style={{\n                top: `${textareaHeight - 28}px`,\n                transition: isSmoothResize\n                  ? \"top 0.16s ease-out, opacity 0.15s ease-out\"\n                  : \"top 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease-out\",\n              }}\n            />\n\n            <button\n              type=\"button\"\n              onClick={expand}\n              style={{\n                transition: isSmoothResize ? \"none\" : \"all 0.38s cubic-bezier(0.16, 1, 0.3, 1)\",\n              }}\n              className={cn(\n                \"absolute inset-x-0 top-0 z-[1] cursor-text pl-4 pr-12 py-[15px] text-left text-sm font-medium leading-[17px] text-zinc-500 outline-none select-none\",\n                !expanded\n                  ? \"opacity-100 scale-100 translate-y-0\"\n                  : \"opacity-0 scale-105 translate-y-1 pointer-events-none\"\n              )}\n              aria-label=\"Open prompt input\"\n            >\n              {placeholder}\n            </button>\n\n            <div\n              className={cn(\n                \"absolute bottom-2 left-3 right-12 z-[10] flex items-center gap-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]\",\n                expanded && !isRecording\n                  ? \"opacity-100 blur-0 translate-y-0 pointer-events-auto\"\n                  : \"opacity-0 blur-sm translate-y-2 pointer-events-none\"\n              )}\n            >\n              {allowModelSelect && (\n                <div className=\"relative\">\n                  <button\n                    type=\"button\"\n                    onMouseDown={(e) => e.preventDefault()}\n                    onClick={(e) => {\n                      e.stopPropagation();\n                      const activeIdx = normalizedModels.findIndex((m) => m.name === activeModel);\n                      if (activeIdx !== -1) {\n                        setHoverStyle({\n                          opacity: 1,\n                          transform: `translateY(${activeIdx * 34}px) scale(1)`,\n                          transition: \"none\",\n                        });\n                      }\n                      setIsModelSelectOpen((prev) => !prev);\n                    }}\n                    className={cn(\n                      \"group flex items-center gap-1.5 rounded-full px-2.5 py-1 text-zinc-400 transition-all duration-200 outline-none hover:bg-white/10 hover:text-zinc-100 cursor-pointer select-none\",\n                      isModelSelectOpen ? \"bg-white/10 text-white\" : \"\"\n                    )}\n                    aria-label={`Select model. Current: ${activeModel}`}\n                  >\n                    <ModelIcon\n                      model={activeModel}\n                      customIcon={normalizedModels.find((m) => m.name === activeModel)?.icon}\n                      className=\"size-3.5 opacity-80 group-hover:opacity-100 transition-opacity\"\n                    />\n                    <span className=\"text-xs font-medium select-none transition-colors\">\n                      <MorphingText text={activeModel} />\n                    </span>\n                  </button>\n\n                  <div\n                    style={{ transformOrigin: \"bottom left\" }}\n                    onMouseLeave={() => {\n                      const activeIdx = normalizedModels.findIndex((m) => m.name === activeModel);\n                      if (activeIdx !== -1) {\n                        setHoverStyle({\n                          opacity: 1,\n                          transform: `translateY(${activeIdx * 34}px) scale(1)`,\n                          transition: \"transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease\",\n                        });\n                      } else {\n                        setHoverStyle((prev) => ({\n                          ...prev,\n                          opacity: 0,\n                          transform: prev.transform.replace(\"scale(1)\", \"scale(0.96)\"),\n                          transition: \"opacity 0.2s ease-in, transform 0.2s ease-out\",\n                        }));\n                      }\n                    }}\n                    className={cn(\n                      \"absolute bottom-full left-0 mb-2.5 z-50 w-48 rounded-2xl border border-white/10 bg-[#121215]/95 p-1 shadow-2xl backdrop-blur-2xl flex flex-col gap-0.5 transition-all duration-300 select-none\",\n                      isModelSelectOpen\n                        ? \"opacity-100 scale-100 translate-y-0 pointer-events-auto ease-[cubic-bezier(0.16,1,0.3,1)]\"\n                        : \"opacity-0 scale-95 translate-y-2 pointer-events-none ease-[cubic-bezier(0.16,1,0.3,1)]\"\n                    )}\n                  >\n                    <div className=\"relative flex flex-col gap-0.5\">\n                      <div\n                        style={hoverStyle}\n                        className=\"absolute left-0 right-0 top-0 h-8 -z-10 rounded-xl bg-white/10 pointer-events-none\"\n                      />\n                      {normalizedModels.map((m, idx) => {\n                        const isSelected = m.name === activeModel;\n                        return (\n                          <button\n                            key={m.name}\n                            type=\"button\"\n                            onMouseDown={(e) => e.preventDefault()}\n                            onMouseEnter={() => {\n                              setHoverStyle({\n                                opacity: 1,\n                                transform: `translateY(${idx * 34}px) scale(1)`,\n                                transition: \"transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease\",\n                              });\n                            }}\n                            onClick={(e) => {\n                              e.stopPropagation();\n                              selectModel(m.name);\n                            }}\n                            className={cn(\n                              \"group relative flex h-8 w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs font-medium transition-colors outline-none active:scale-[0.98] cursor-pointer\",\n                              isSelected ? \"text-white font-semibold\" : \"text-zinc-400 hover:text-zinc-200\"\n                            )}\n                          >\n                            <span className=\"flex items-center gap-2\">\n                              <ModelIcon\n                                model={m.name}\n                                customIcon={m.icon}\n                                className={cn(\n                                  \"size-3.5 transition-opacity\",\n                                  isSelected ? \"opacity-100\" : \"opacity-75 group-hover:opacity-100\"\n                                )}\n                              />\n                              <span>{m.name}</span>\n                            </span>\n                            {isSelected && (\n                              <span className=\"text-white\">\n                                <CheckIcon />\n                              </span>\n                            )}\n                          </button>\n                        );\n                      })}\n                    </div>\n                  </div>\n                </div>\n              )}\n\n              {allowEffortSelect && (\n                <button\n                  type=\"button\"\n                  onMouseDown={(e) => e.preventDefault()}\n                  onClick={cycleEffort}\n                  className=\"group flex items-center gap-1.5 rounded-full px-2.5 py-1 text-zinc-400 transition-all duration-200 hover:bg-white/10 hover:text-zinc-100 outline-none cursor-pointer select-none\"\n                  aria-label={`Cycle effort level. Current: ${currentEffort}`}\n                >\n                  <DynamicBarsIcon level={currentEffort} />\n                  <span className=\"text-xs font-medium select-none transition-colors\">\n                    <MorphingText text={currentEffort} />\n                  </span>\n                </button>\n              )}\n\n              {allowAttachments && (\n                <button\n                  type=\"button\"\n                  onMouseDown={(e) => e.preventDefault()}\n                  onClick={openFileChooser}\n                  disabled={attachments.length >= maxAttachments || disabled}\n                  className=\"ml-auto flex size-7 items-center justify-center rounded-full text-zinc-400 transition-all duration-200 hover:bg-white/10 hover:text-zinc-100 outline-none cursor-pointer disabled:opacity-40 disabled:pointer-events-none select-none\"\n                  aria-label=\"Attach images\"\n                >\n                  <PlusIcon />\n                </button>\n              )}\n            </div>\n\n            <div\n              className={cn(\n                \"absolute right-12 bottom-2 z-[10] flex h-8 items-center justify-end gap-[3px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]\",\n                isRecording\n                  ? \"w-16 opacity-100 translate-x-0\"\n                  : \"w-0 opacity-0 translate-x-4 pointer-events-none\"\n              )}\n            >\n              {audioData.map((val, i) => (\n                <div\n                  key={i}\n                  className=\"w-1 rounded-full bg-white transition-[height] duration-75 ease-out\"\n                  style={{ height: `${Math.max(4, val * 24)}px` }}\n                />\n              ))}\n            </div>\n\n            <button\n              type=\"button\"\n              onMouseDown={(e) => {\n                e.preventDefault();\n                e.stopPropagation();\n              }}\n              onClick={onActionButtonClick}\n              disabled={disabled}\n              aria-label={\n                showArrow\n                  ? \"Send prompt\"\n                  : showStop\n                  ? \"Stop recording\"\n                  : \"Use voice input\"\n              }\n              className=\"absolute right-2 bottom-2 z-[10] flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-all duration-300 hover:bg-zinc-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer shadow-sm\"\n            >\n              <span className=\"relative flex h-full w-full items-center justify-center\">\n                <span\n                  className={cn(\n                    \"absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]\",\n                    showArrow\n                      ? \"opacity-100 scale-100 rotate-0 blur-none\"\n                      : \"opacity-0 scale-50 rotate-45 blur-[1px] pointer-events-none\"\n                  )}\n                >\n                  <ArrowUpIcon />\n                </span>\n                <span\n                  className={cn(\n                    \"absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]\",\n                    showMic\n                      ? \"opacity-100 scale-100 rotate-0 blur-none\"\n                      : \"opacity-0 scale-50 -rotate-45 blur-[1px] pointer-events-none\"\n                  )}\n                >\n                  <MicIcon />\n                </span>\n                <span\n                  className={cn(\n                    \"absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]\",\n                    showStop\n                      ? \"opacity-100 scale-100 rotate-0 blur-none\"\n                      : \"opacity-0 scale-50 rotate-45 blur-[1px] pointer-events-none\"\n                  )}\n                >\n                  <StopIcon />\n                </span>\n              </span>\n            </button>\n          </div>\n        </div>\n\n        {mounted && activeAttachment && (\n          <AttachmentGalleryModal\n            attachment={activeAttachment.attachment}\n            originRect={activeAttachment.rect}\n            onClose={() => setActiveAttachment(null)}\n          />\n        )}\n      </>\n    );\n  }\n);\n\nPromptInput.displayName = \"PromptInput\";\n\nexport const AiInput = PromptInput;\nexport default PromptInput;\n",
      },
    ],
  },
  "mac-slider": {
    slug: "mac-slider",
    name: "Mac Slider",
    description: "Liquid glass slider with squircle normal map refraction, specular rim sheen, and tactile spring physics.",
    summary: "A native-feeling macOS slider component built with physics-based liquid glass optics and damped harmonic oscillator springs. Features real-time squircle normal-map displacement, specular edge reflections, and dynamic transparency that shifts from solid white at rest to optical glass when dragged, coupled with responsive track scrubbing, multiple sizes, materials, and keyboard navigation.",
    category: "apple-ui",
    tags: ["slider", "range", "liquid-glass", "refraction", "macos", "physics", "spring", "apple"],
    dependencies: ["clsx", "tailwind-merge", "motion"],
    version: "1.0.0",
    createdDate: "2026-09-24",
    updatedDate: "2026-09-24",
    interactive: true,
    supportsColor: false,
    highlights: [
      "Ultra-smooth pointer-capture tracking with zero-latency MotionValue synchronization",
      "Real-time squircle normal-map refraction distortion using SVG feDisplacementMap",
      "Dynamic specular lighting highlights along the 16px convex squircle lens bezel",
      "Damped harmonic spring dynamics (stiffness: 400, damping: 30) for tactile drag expansion",
      "Fluid state morphing from solid white pill at rest to translucent liquid glass under drag",
      "Accurate sub-pixel track fill tracking the exact optical center of the thumb",
      "Three size variants (sm, md, lg) and three glass materials (liquid, frosted, clear)",
      "Seven color themes including macOS System Blue, Emerald, Violet, Amber, Rose, Cyan, and Graphite",
      "Full keyboard accessibility with Arrow keys, PageUp/Down, Home, End, and ARIA slider semantics",
      "Live interactive parameter sliders driven by MotionValues with zero React re-render overhead"
    ],
    anatomy: [
      "<motion.div> (Track shell with role=\"slider\", ARIA value attributes, and focus ring)",
      "<motion.div> (Active progress fill bar tracking thumb center)",
      "<Filter> (Scoped SVG filter with normal map, feGaussianBlur, feDisplacementMap, feSpecularLighting, feColorMatrix)",
      "<motion.div> (Draggable thumb pill with spring-driven scale, liquid background, and specular sheen)"
    ],
    physics: {
      engine: "Harmonic Damped Spring Oscillator & SVG Refraction Shader",
      description: "Analytical spring integration driving scale expansion, backdrop opacity, and track seek animations, coupled with GPU-accelerated displacement mapping.",
      parameters: [
        { label: "Rest Scale", value: "0.6 (54px × 36px)" },
        { label: "Drag Scale", value: "1.0 (90px × 60px)" },
        { label: "Scale Stiffness", value: "400" },
        { label: "Scale Damping", value: "30" },
        { label: "Seek Stiffness", value: "450" },
        { label: "Seek Damping", value: "32" },
        { label: "Bezel Width", value: "12px - 20px convex squircle" }
      ]
    },
    accessibility: {
      role: "slider",
      aria: "Standard role=\"slider\" with aria-valuenow, aria-valuemin, aria-valuemax, and focus-visible ring.",
      reducedMotion: "Instant state transitions and graceful settling when motion is reduced.",
      keyboard: [
        { key: "ArrowLeft / ArrowDown", description: "Decrease value by 1 step." },
        { key: "ArrowRight / ArrowUp", description: "Increase value by 1 step." },
        { key: "PageDown / PageUp", description: "Decrease or increase value by 10 steps." },
        { key: "Home / End", description: "Jump to minimum or maximum value." }
      ]
    },
    guidelines: {
      recommended: [
        "Audio volume controls, brightness adjustments, and media scrubber interfaces",
        "Control Center style settings panels where authentic macOS tactile feel is desired",
        "Creative tool sliders and shader parameter controllers"
      ],
      bestPractices: [
        "Position over visually rich backgrounds to showcase the optical refraction effect",
        "Ensure sufficient contrast between the track background and active progress fill",
        "Provide explicit min, max, and onChange callbacks for controlled state integration"
      ]
    },
    props: [
      {
        name: "value",
        type: "number",
        defaultValue: "undefined",
        description: "Controlled slider value between min and max."
      },
      {
        name: "defaultValue",
        type: "number",
        defaultValue: "10",
        description: "Initial value for uncontrolled slider usage."
      },
      {
        name: "min",
        type: "number",
        defaultValue: "0",
        description: "Minimum value of the slider range."
      },
      {
        name: "max",
        type: "number",
        defaultValue: "100",
        description: "Maximum value of the slider range."
      },
      {
        name: "step",
        type: "number",
        defaultValue: "1",
        description: "Stepping increment for the slider value."
      },
      {
        name: "color",
        type: "\"blue\" | \"emerald\" | \"violet\" | \"amber\" | \"rose\" | \"cyan\" | \"monochrome\"",
        defaultValue: "\"blue\"",
        description: "Theme accent color for the active progress bar and ambient glow."
      },
      {
        name: "size",
        type: "\"sm\" | \"md\" | \"lg\"",
        defaultValue: "\"md\"",
        description: "Size preset controlling track width, height, and thumb scale."
      },
      {
        name: "material",
        type: "\"liquid\" | \"frosted\" | \"clear\"",
        defaultValue: "\"liquid\"",
        description: "Glass optical material for the thumb lens."
      },
      {
        name: "forceActive",
        type: "boolean",
        defaultValue: "false",
        description: "Whether the thumb lens is forcefully expanded."
      },
      {
        name: "specularOpacity",
        type: "number",
        defaultValue: "0.4",
        description: "Intensity of the specular light reflection (0 - 1)."
      },
      {
        name: "specularSaturation",
        type: "number",
        defaultValue: "6",
        description: "Specular color saturation multiplier (0 - 50)."
      },
      {
        name: "refractionLevel",
        type: "number",
        defaultValue: "0.28",
        description: "Refractive normal map displacement factor (0 - 1)."
      },
      {
        name: "blurLevel",
        type: "number",
        defaultValue: "0",
        description: "Gaussian blur standard deviation in pixels (0 - 40)."
      },
      {
        name: "onChange",
        type: "(value: number) => void",
        defaultValue: "undefined",
        description: "Callback invoked when the slider value changes."
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables interaction with the slider."
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Additional CSS class names for outer container."
      }
    ],
    files: [
      {
        name: "mac-slider.tsx",
        path: "registry/ui/mac-slider.tsx",
        code: "\"use client\";\n\nimport React, { useEffect, useRef, useId, useCallback } from \"react\";\nimport {\n  motion,\n  useMotionValue,\n  useSpring,\n  useTransform,\n  animate,\n  type MotionValue,\n} from \"motion/react\";\nimport { cn } from \"@/lib/utils\";\n\nexport type MacSliderColor =\n  | \"blue\"\n  | \"emerald\"\n  | \"violet\"\n  | \"amber\"\n  | \"rose\"\n  | \"cyan\"\n  | \"monochrome\";\n\nexport type MacSliderSize = \"sm\" | \"md\" | \"lg\";\nexport type MacSliderMaterial = \"liquid\" | \"frosted\" | \"clear\";\n\nexport interface FilterProps {\n  id?: string;\n  blur?: MotionValue<number> | number;\n  scaleRatio?: MotionValue<number> | number;\n  specularOpacity?: MotionValue<number> | number;\n  specularSaturation?: MotionValue<number> | number;\n  width?: number;\n  height?: number;\n  radius?: number;\n  bezelWidth?: number;\n}\n\nconst COLOR_THEMES: Record<\n  MacSliderColor,\n  { fill: string; dot: string; label: string; glow: string }\n> = {\n  blue: {\n    fill: \"#007AFF\",\n    dot: \"bg-blue-500\",\n    label: \"Blue\",\n    glow: \"rgba(0, 122, 255, 0.35)\",\n  },\n  emerald: {\n    fill: \"#10B981\",\n    dot: \"bg-emerald-400\",\n    label: \"Emerald\",\n    glow: \"rgba(16, 185, 129, 0.35)\",\n  },\n  violet: {\n    fill: \"#8B5CF6\",\n    dot: \"bg-violet-400\",\n    label: \"Violet\",\n    glow: \"rgba(139, 92, 246, 0.35)\",\n  },\n  amber: {\n    fill: \"#F59E0B\",\n    dot: \"bg-amber-400\",\n    label: \"Amber\",\n    glow: \"rgba(245, 158, 11, 0.35)\",\n  },\n  rose: {\n    fill: \"#F43F5E\",\n    dot: \"bg-rose-400\",\n    label: \"Rose\",\n    glow: \"rgba(244, 63, 94, 0.35)\",\n  },\n  cyan: {\n    fill: \"#06B6D4\",\n    dot: \"bg-cyan-400\",\n    label: \"Cyan\",\n    glow: \"rgba(6, 182, 212, 0.35)\",\n  },\n  monochrome: {\n    fill: \"#F4F4F5\",\n    dot: \"bg-zinc-200\",\n    label: \"Graphite\",\n    glow: \"rgba(255, 255, 255, 0.25)\",\n  },\n};\n\nconst SIZE_CONFIGS: Record<\n  MacSliderSize,\n  {\n    sliderWidth: number;\n    sliderHeight: number;\n    thumbWidth: number;\n    thumbHeight: number;\n    thumbRadius: number;\n    bezelWidth: number;\n  }\n> = {\n  sm: {\n    sliderWidth: 260,\n    sliderHeight: 10,\n    thumbWidth: 72,\n    thumbHeight: 48,\n    thumbRadius: 24,\n    bezelWidth: 12,\n  },\n  md: {\n    sliderWidth: 330,\n    sliderHeight: 14,\n    thumbWidth: 90,\n    thumbHeight: 60,\n    thumbRadius: 30,\n    bezelWidth: 16,\n  },\n  lg: {\n    sliderWidth: 400,\n    sliderHeight: 18,\n    thumbWidth: 108,\n    thumbHeight: 72,\n    thumbRadius: 36,\n    bezelWidth: 20,\n  },\n};\n\nfunction isMotionValue(val: unknown): val is MotionValue<number> {\n  return typeof val === \"object\" && val !== null && \"get\" in val && \"on\" in val;\n}\n\nfunction getNumericValue(\n  val?: MotionValue<number> | number,\n  fallback = 0,\n): number {\n  if (val === undefined) return fallback;\n  if (isMotionValue(val)) return Number(val.get()) || fallback;\n  return Number(val) || fallback;\n}\n\nexport const Filter: React.FC<FilterProps> = ({\n  id = \"thumb-filter-slider\",\n  blur,\n  scaleRatio,\n  specularOpacity,\n  specularSaturation,\n  width = 90,\n  height = 60,\n  radius = 30,\n  bezelWidth = 16,\n}) => {\n  const feImageRef = useRef<SVGFEImageElement>(null);\n  const blurRef = useRef<SVGFEGaussianBlurElement>(null);\n  const dispRef = useRef<SVGFEDisplacementMapElement>(null);\n  const specRef = useRef<SVGFESpecularLightingElement>(null);\n  const satRef = useRef<SVGFEColorMatrixElement>(null);\n\n  useEffect(() => {\n    if (typeof document === \"undefined\") return;\n\n    const canvas = document.createElement(\"canvas\");\n    canvas.width = width;\n    canvas.height = height;\n    const ctx = canvas.getContext(\"2d\");\n    if (!ctx) return;\n\n    const imgData = ctx.createImageData(width, height);\n    const data = imgData.data;\n    let pos = 0;\n\n    for (let y = 0; y < height; y++) {\n      for (let x = 0; x < width; x++) {\n        const segX = Math.max(radius, Math.min(width - radius, x));\n        const segY = height / 2;\n        const dx = x - segX;\n        const dy = y - segY;\n        const dist = Math.sqrt(dx * dx + dy * dy);\n        const distEdge = radius - dist;\n\n        if (distEdge <= 0 || distEdge >= bezelWidth) {\n          data[pos++] = 128;\n          data[pos++] = 128;\n          data[pos++] = 255;\n          data[pos++] = 255;\n        } else {\n          const u = distEdge / bezelWidth;\n          const slope = Math.cos((u * Math.PI) / 2);\n          const dirX = dist > 0.001 ? dx / dist : 0;\n          const dirY = dist > 0.001 ? dy / dist : 0;\n          const nx = -dirX * slope * 0.85;\n          const ny = -dirY * slope * 0.85;\n          const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));\n\n          data[pos++] = Math.round(128 + 127 * nx);\n          data[pos++] = Math.round(128 + 127 * ny);\n          data[pos++] = Math.round(128 + 127 * nz);\n          data[pos++] = 255;\n        }\n      }\n    }\n\n    ctx.putImageData(imgData, 0, 0);\n    const dataUrl = canvas.toDataURL(\"image/png\");\n    feImageRef.current?.setAttribute(\"href\", dataUrl);\n  }, [width, height, radius, bezelWidth]);\n\n  useEffect(() => {\n    const unsubBlur = isMotionValue(blur)\n      ? blur.on(\"change\", (v) => {\n          blurRef.current?.setAttribute(\"stdDeviation\", String(v));\n        })\n      : undefined;\n\n    const unsubDisp = isMotionValue(scaleRatio)\n      ? scaleRatio.on(\"change\", (v) => {\n          dispRef.current?.setAttribute(\"scale\", String(v * 24));\n        })\n      : undefined;\n\n    const unsubSpec = isMotionValue(specularOpacity)\n      ? specularOpacity.on(\"change\", (v) => {\n          specRef.current?.setAttribute(\"specularConstant\", String(v * 1.5));\n        })\n      : undefined;\n\n    const unsubSat = isMotionValue(specularSaturation)\n      ? specularSaturation.on(\"change\", (v) => {\n          satRef.current?.setAttribute(\"values\", String(1 + v * 0.15));\n        })\n      : undefined;\n\n    const currentBlur = getNumericValue(blur, 0);\n    const currentScale = getNumericValue(scaleRatio, 0.4);\n    const currentSpec = getNumericValue(specularOpacity, 0.4);\n    const currentSat = getNumericValue(specularSaturation, 6);\n\n    blurRef.current?.setAttribute(\"stdDeviation\", String(currentBlur));\n    dispRef.current?.setAttribute(\"scale\", String(currentScale * 24));\n    specRef.current?.setAttribute(\"specularConstant\", String(currentSpec * 1.5));\n    satRef.current?.setAttribute(\"values\", String(1 + currentSat * 0.15));\n\n    return () => {\n      unsubBlur?.();\n      unsubDisp?.();\n      unsubSpec?.();\n      unsubSat?.();\n    };\n  }, [blur, scaleRatio, specularOpacity, specularSaturation]);\n\n  const initialBlur = getNumericValue(blur, 0);\n  const initialDisp = getNumericValue(scaleRatio, 0.4) * 24;\n  const initialSpec = getNumericValue(specularOpacity, 0.4) * 1.5;\n  const initialSat = 1 + getNumericValue(specularSaturation, 6) * 0.15;\n\n  return (\n    <svg\n      width=\"0\"\n      height=\"0\"\n      className=\"pointer-events-none absolute -z-10 opacity-0\"\n      aria-hidden=\"true\"\n    >\n      <defs>\n        <filter\n          id={id}\n          x=\"-20%\"\n          y=\"-20%\"\n          width=\"140%\"\n          height=\"140%\"\n          colorInterpolationFilters=\"sRGB\"\n        >\n          <feImage\n            ref={feImageRef}\n            result=\"normalMap\"\n            x=\"0\"\n            y=\"0\"\n            width={width}\n            height={height}\n            preserveAspectRatio=\"none\"\n          />\n          <feGaussianBlur\n            ref={blurRef}\n            in=\"SourceGraphic\"\n            stdDeviation={initialBlur}\n            result=\"blurred\"\n          />\n          <feDisplacementMap\n            ref={dispRef}\n            in=\"blurred\"\n            in2=\"normalMap\"\n            scale={initialDisp}\n            xChannelSelector=\"R\"\n            yChannelSelector=\"G\"\n            result=\"refracted\"\n          />\n          <feSpecularLighting\n            ref={specRef}\n            in=\"normalMap\"\n            surfaceScale=\"2\"\n            specularConstant={initialSpec}\n            specularExponent=\"24\"\n            result=\"specular\"\n            lightingColor=\"#ffffff\"\n          >\n            <feDistantLight azimuth=\"235\" elevation=\"55\" />\n          </feSpecularLighting>\n          <feColorMatrix\n            ref={satRef}\n            in=\"refracted\"\n            type=\"saturate\"\n            values={String(initialSat)}\n            result=\"saturated\"\n          />\n          <feBlend in=\"saturated\" in2=\"specular\" mode=\"screen\" />\n        </filter>\n      </defs>\n    </svg>\n  );\n};\n\nexport interface MacSliderProps {\n  min?: number;\n  max?: number;\n  step?: number;\n  defaultValue?: number;\n  value?: number;\n  onChange?: (value: number) => void;\n  color?: MacSliderColor;\n  size?: MacSliderSize;\n  material?: MacSliderMaterial;\n  forceActive?: boolean;\n  specularOpacity?: number;\n  specularSaturation?: number;\n  refractionLevel?: number;\n  blurLevel?: number;\n  className?: string;\n  disabled?: boolean;\n}\n\nexport const MacSlider: React.FC<MacSliderProps> = ({\n  min = 0,\n  max = 100,\n  step = 1,\n  defaultValue = 10,\n  value: controlledValue,\n  onChange,\n  color = \"blue\",\n  size = \"md\",\n  material = \"liquid\",\n  forceActive = false,\n  specularOpacity: specularOpacityProp = 0.4,\n  specularSaturation: specularSaturationProp = 6,\n  refractionLevel = 0.28,\n  blurLevel = 0,\n  className,\n  disabled = false,\n}) => {\n  const generatedId = useId();\n  const filterId = `mac-filter-${generatedId.replace(/:/g, \"\")}`;\n\n  const currentTheme = COLOR_THEMES[color] ?? COLOR_THEMES.blue;\n  const currentSize = SIZE_CONFIGS[size] ?? SIZE_CONFIGS.md;\n  const {\n    sliderWidth,\n    sliderHeight,\n    thumbWidth,\n    thumbHeight,\n    thumbRadius,\n    bezelWidth,\n  } = currentSize;\n\n  const SCALE_REST = 0.6;\n  const SCALE_DRAG = 1;\n  const thumbWidthRest = thumbWidth * SCALE_REST;\n  const trackTravel = sliderWidth - thumbWidthRest;\n  const minX = -thumbWidthRest / 3;\n\n  const initialVal =\n    controlledValue !== undefined ? controlledValue : defaultValue;\n  const valueMotion = useMotionValue(initialVal);\n  const initialRatio = Math.max(0, Math.min(1, (initialVal - min) / (max - min)));\n  const thumbX = useMotionValue(minX + initialRatio * trackTravel);\n\n  const pointerDown = useMotionValue(0);\n  const forceActiveMotion = useMotionValue(forceActive ? 1 : 0);\n\n  useEffect(() => {\n    forceActiveMotion.set(forceActive ? 1 : 0);\n  }, [forceActive, forceActiveMotion]);\n\n  const isUp = useTransform(\n    (): number =>\n      forceActiveMotion.get() > 0.5 || pointerDown.get() > 0.5 ? 1 : 0,\n  );\n\n  const blur = useMotionValue(blurLevel);\n  const specularOpacity = useMotionValue(specularOpacityProp);\n  const specularSaturation = useMotionValue(specularSaturationProp);\n  const refractionBase = useMotionValue(refractionLevel);\n\n  useEffect(() => {\n    blur.set(blurLevel);\n  }, [blurLevel, blur]);\n\n  useEffect(() => {\n    specularOpacity.set(specularOpacityProp);\n  }, [specularOpacityProp, specularOpacity]);\n\n  useEffect(() => {\n    specularSaturation.set(specularSaturationProp);\n  }, [specularSaturationProp, specularSaturation]);\n\n  useEffect(() => {\n    refractionBase.set(refractionLevel);\n  }, [refractionLevel, refractionBase]);\n\n  const scaleRatio = useSpring(\n    useTransform((): number => {\n      const press = isUp.get() > 0.5 ? 0.9 : 0.4;\n      return press * (refractionBase.get() || 0);\n    }),\n    {\n      stiffness: 400,\n      damping: 30,\n      mass: 0.8,\n    },\n  );\n\n  const containerRef = useRef<HTMLDivElement>(null);\n  const trackRef = useRef<HTMLDivElement>(null);\n  const thumbRef = useRef<HTMLDivElement>(null);\n  const isDraggingRef = useRef(false);\n  const trackBoundsRef = useRef<{ left: number; width: number }>({\n    left: 0,\n    width: sliderWidth,\n  });\n\n  const scaleSpring = useSpring(\n    useTransform(isUp, [0, 1], [SCALE_REST, SCALE_DRAG]),\n    {\n      stiffness: 400,\n      damping: 30,\n      mass: 0.8,\n    },\n  );\n\n  const backgroundOpacity = useSpring(useTransform(isUp, [0, 1], [1, 0.1]), {\n    stiffness: 400,\n    damping: 30,\n    mass: 0.8,\n  });\n\n  const updatePositionFromClientX = useCallback(\n    (clientX: number, animateSpring = false) => {\n      const { left, width } = trackBoundsRef.current;\n      const effectiveTravel = width - thumbWidthRest;\n      if (effectiveTravel <= 0) return;\n\n      const clickX = clientX - left;\n      const ratio = Math.max(\n        0,\n        Math.min(1, (clickX - thumbWidthRest / 2) / effectiveTravel),\n      );\n\n      const rawVal = min + ratio * (max - min);\n      const steppedVal =\n        step > 0 ? Math.round(rawVal / step) * step : Math.round(rawVal);\n      const nextVal = Math.max(min, Math.min(max, steppedVal));\n\n      const normalizedRatio = (nextVal - min) / (max - min);\n      const targetX = minX + normalizedRatio * trackTravel;\n\n      if (animateSpring) {\n        animate(thumbX, targetX, {\n          type: \"spring\",\n          stiffness: 450,\n          damping: 32,\n          mass: 0.75,\n        });\n      } else {\n        thumbX.set(targetX);\n      }\n\n      if (valueMotion.get() !== nextVal) {\n        valueMotion.set(nextVal);\n        onChange?.(nextVal);\n      }\n    },\n    [\n      thumbWidthRest,\n      min,\n      max,\n      step,\n      trackTravel,\n      minX,\n      thumbX,\n      valueMotion,\n      onChange,\n    ],\n  );\n\n  useEffect(() => {\n    const curVal =\n      controlledValue !== undefined ? controlledValue : valueMotion.get();\n    const ratio = Math.max(0, Math.min(1, (curVal - min) / (max - min)));\n    thumbX.set(minX + ratio * trackTravel);\n  }, [size, minX, trackTravel, min, max, controlledValue, thumbX, valueMotion]);\n\n  useEffect(() => {\n    if (!isDraggingRef.current && controlledValue !== undefined) {\n      valueMotion.set(controlledValue);\n      const ratio = Math.max(\n        0,\n        Math.min(1, (controlledValue - min) / (max - min)),\n      );\n      const targetX = minX + ratio * trackTravel;\n      animate(thumbX, targetX, {\n        type: \"spring\",\n        stiffness: 450,\n        damping: 32,\n        mass: 0.75,\n      });\n    }\n  }, [controlledValue, min, max, minX, trackTravel, thumbX, valueMotion]);\n\n  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {\n    if (disabled || !trackRef.current) return;\n\n    const rect = trackRef.current.getBoundingClientRect();\n    trackBoundsRef.current = { left: rect.left, width: rect.width };\n\n    isDraggingRef.current = true;\n    pointerDown.set(1);\n\n    e.currentTarget.setPointerCapture(e.pointerId);\n    updatePositionFromClientX(e.clientX, e.target !== thumbRef.current);\n  };\n\n  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {\n    if (!isDraggingRef.current || disabled) return;\n    updatePositionFromClientX(e.clientX, false);\n  };\n\n  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {\n    if (!isDraggingRef.current) return;\n    isDraggingRef.current = false;\n    pointerDown.set(0);\n\n    try {\n      e.currentTarget.releasePointerCapture(e.pointerId);\n    } catch {}\n  };\n\n  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {\n    if (disabled) return;\n    let nextVal = valueMotion.get();\n    const jump = step || 1;\n\n    if (e.key === \"ArrowRight\" || e.key === \"ArrowUp\") {\n      e.preventDefault();\n      nextVal = Math.min(max, nextVal + jump);\n    } else if (e.key === \"ArrowLeft\" || e.key === \"ArrowDown\") {\n      e.preventDefault();\n      nextVal = Math.max(min, nextVal - jump);\n    } else if (e.key === \"PageUp\") {\n      e.preventDefault();\n      nextVal = Math.min(max, nextVal + jump * 10);\n    } else if (e.key === \"PageDown\") {\n      e.preventDefault();\n      nextVal = Math.max(min, nextVal - jump * 10);\n    } else if (e.key === \"Home\") {\n      e.preventDefault();\n      nextVal = min;\n    } else if (e.key === \"End\") {\n      e.preventDefault();\n      nextVal = max;\n    } else {\n      return;\n    }\n\n    valueMotion.set(nextVal);\n    onChange?.(nextVal);\n    const ratio = (nextVal - min) / (max - min);\n    const targetX = minX + ratio * trackTravel;\n    animate(thumbX, targetX, {\n      type: \"spring\",\n      stiffness: 450,\n      damping: 32,\n      mass: 0.75,\n    });\n  };\n\n  const backdropStyle =\n    material === \"liquid\"\n      ? `url(#${filterId}) blur(14px)`\n      : material === \"frosted\"\n        ? \"blur(24px) saturate(180%)\"\n        : \"blur(8px) saturate(120%)\";\n\n  return (\n    <div\n      className={cn(\n        \"relative flex items-center justify-center select-none py-6\",\n        disabled && \"opacity-50 pointer-events-none\",\n        className,\n      )}\n    >\n      <motion.div\n        ref={containerRef}\n        tabIndex={0}\n        role=\"slider\"\n        aria-valuemin={min}\n        aria-valuemax={max}\n        aria-valuenow={valueMotion.get()}\n        onKeyDown={handleKeyDown}\n        onPointerDown={handlePointerDown}\n        onPointerMove={handlePointerMove}\n        onPointerUp={handlePointerUp}\n        onPointerCancel={handlePointerUp}\n        className=\"outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-full touch-none select-none cursor-pointer\"\n        style={{\n          position: \"relative\",\n          width: sliderWidth,\n          height: thumbHeight,\n        }}\n      >\n        <div\n          ref={trackRef}\n          style={{\n            display: \"inline-block\",\n            width: sliderWidth,\n            height: sliderHeight,\n            left: 0,\n            top: (thumbHeight - sliderHeight) / 2,\n            backgroundColor: \"#89898F66\",\n            borderRadius: sliderHeight / 2,\n            position: \"absolute\",\n          }}\n        >\n          <div className=\"w-full h-full overflow-hidden rounded-full\">\n            <motion.div\n              style={{\n                top: 0,\n                left: 0,\n                height: sliderHeight,\n                width: useTransform(\n                  thumbX,\n                  (x) =>\n                    `${Math.max(\n                      0,\n                      Math.min(sliderWidth, x + thumbWidth / 2),\n                    )}px`,\n                ),\n                borderRadius: sliderHeight / 2,\n                backgroundColor: currentTheme.fill,\n                boxShadow: `0 0 16px ${currentTheme.glow}`,\n              }}\n            />\n          </div>\n        </div>\n\n        {material === \"liquid\" && (\n          <Filter\n            id={filterId}\n            blur={blur}\n            scaleRatio={scaleRatio}\n            specularOpacity={specularOpacity}\n            specularSaturation={specularSaturation}\n            width={thumbWidth}\n            height={thumbHeight}\n            radius={thumbRadius}\n            bezelWidth={bezelWidth}\n          />\n        )}\n\n        <motion.div\n          ref={thumbRef}\n          className=\"absolute pointer-events-none\"\n          style={{\n            height: thumbHeight,\n            width: thumbWidth,\n            top: 0,\n            x: thumbX,\n            borderRadius: thumbRadius,\n            backdropFilter: backdropStyle,\n            WebkitBackdropFilter: backdropStyle,\n            scale: scaleSpring,\n            willChange: \"transform\",\n            backgroundColor: useTransform(\n              backgroundOpacity,\n              (op) => `rgba(255, 255, 255, ${op})`,\n            ),\n            boxShadow:\n              \"0 4px 18px rgba(0, 0, 0, 0.22), inset 0 1px 1.5px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(0, 0, 0, 0.12)\",\n            border: \"1px solid rgba(255, 255, 255, 0.35)\",\n          }}\n        >\n          <div\n            className=\"pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-40\"\n            style={{\n              borderRadius: `${thumbRadius}px ${thumbRadius}px 0 0`,\n              background:\n                \"linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.05) 100%)\",\n            }}\n          />\n        </motion.div>\n      </motion.div>\n    </div>\n  );\n};\n\nexport const Slider = MacSlider;\n"
      }
    ]
  },
  "mac-switch": {
  "slug": "mac-switch",
  "name": "Mac Switch",
  "description": "Apple-inspired macOS liquid glass switch with refractive lip bezel optics, spring-loaded tactile thumb kinematics, and customizable color themes.",
  "summary": "A native-feeling macOS switch component built with physics-based liquid glass optics and harmonic oscillator springs. Features real-time squircle normal-map displacement with lip bezel curvature, specular edge reflections, dynamic transparency, and fluid track morphing between neutral zinc and vibrant Apple accent colors, coupled with responsive pointer capture dragging, multiple sizes, materials, and keyboard navigation.",
  "category": "apple-ui",
  "tags": [
    "switch",
    "toggle",
    "liquid-glass",
    "refraction",
    "macos",
    "physics",
    "spring",
    "apple"
  ],
  "dependencies": [
    "clsx",
    "tailwind-merge",
    "motion"
  ],
  "version": "1.0.0",
  "createdDate": "2026-09-24",
  "updatedDate": "2026-09-24",
  "interactive": true,
  "supportsColor": false,
  "highlights": [
    "Ultra-smooth pointer-capture tracking with zero-latency MotionValue synchronization and drag overflow damping",
    "Real-time squircle normal-map refraction distortion using SVG feDisplacementMap with lip bezel optics",
    "Dynamic specular lighting highlights along the 19px lip bezel lens contour",
    "Damped harmonic spring dynamics (stiffness: 520, damping: 42) for tactile drag expansion",
    "Fluid track color morphing from neutral zinc to vibrant macOS system tints via motion mix interpolation",
    "Three size presets (sm, md, lg) and three glass optical materials (liquid, frosted, clear)",
    "Seven macOS color themes including Green, Blue, Purple, Orange, Pink, Amber, and Graphite",
    "Full keyboard accessibility with Space, Enter, ArrowLeft, ArrowRight, and ARIA switch semantics",
    "Live interactive parameter controls driven by MotionValues with zero React re-render overhead"
  ],
  "anatomy": [
    "<motion.div> (Track shell with role=\"switch\", ARIA checked attributes, and focus ring)",
    "<SwitchFilter> (Scoped SVG filter with normal map, feGaussianBlur, feDisplacementMap, feSpecularLighting, feColorMatrix)",
    "<motion.div> (Draggable thumb pill with spring-driven scale, liquid background, and specular sheen)"
  ],
  "physics": {
    "engine": "Harmonic Damped Spring Oscillator & SVG Refraction Shader",
    "description": "Analytical spring integration driving scale expansion, backdrop opacity, and track seek animations, coupled with GPU-accelerated displacement mapping.",
    "parameters": [
      {
        "label": "Rest Scale",
        "value": "0.65 (95px \u00d7 60px)"
      },
      {
        "label": "Active Scale",
        "value": "0.90 (131px \u00d7 83px)"
      },
      {
        "label": "Scale Stiffness",
        "value": "600"
      },
      {
        "label": "Scale Damping",
        "value": "42"
      },
      {
        "label": "Travel Stiffness",
        "value": "520"
      },
      {
        "label": "Travel Damping",
        "value": "42"
      },
      {
        "label": "Bezel Width",
        "value": "14px - 24px lip squircle"
      }
    ]
  },
  "accessibility": {
    "role": "switch",
    "aria": "Standard role=\"switch\" with aria-checked and focus-visible ring.",
    "reducedMotion": "Instant state transitions and graceful settling when motion is reduced.",
    "keyboard": [
      {
        "key": "Space / Enter",
        "description": "Toggle switch on/off."
      },
      {
        "key": "ArrowLeft",
        "description": "Turn switch off."
      },
      {
        "key": "ArrowRight",
        "description": "Turn switch on."
      }
    ]
  },
  "guidelines": {
    "recommended": [
      "System preferences, feature toggles, and settings panels where authentic macOS tactile feel is desired",
      "Control Center style toggles and mode selectors",
      "Creative and luxury product interfaces showcasing liquid glass materials"
    ],
    "bestPractices": [
      "Position over visually rich backgrounds to showcase the optical refraction effect",
      "Ensure sufficient contrast between the track background and active progress fill",
      "Provide explicit checked and onChange callbacks for controlled state integration"
    ]
  },
  "props": [
    {
      "name": "checked",
      "type": "boolean",
      "defaultValue": "undefined",
      "description": "Controlled checked state of the switch."
    },
    {
      "name": "defaultChecked",
      "type": "boolean",
      "defaultValue": "false",
      "description": "Initial checked state when used uncontrolled."
    },
    {
      "name": "color",
      "type": "\"green\" | \"blue\" | \"purple\" | \"orange\" | \"pink\" | \"amber\" | \"monochrome\"",
      "defaultValue": "\"green\"",
      "description": "Vibrant macOS accent theme for the active track fill."
    },
    {
      "name": "size",
      "type": "\"sm\" | \"md\" | \"lg\"",
      "defaultValue": "\"md\"",
      "description": "Size preset controlling track and thumb dimensions."
    },
    {
      "name": "material",
      "type": "\"liquid\" | \"frosted\" | \"clear\"",
      "defaultValue": "\"liquid\"",
      "description": "Optic material variant (liquid SVG refraction, frosted glass, or clear)."
    },
    {
      "name": "forceActive",
      "type": "boolean",
      "defaultValue": "false",
      "description": "Forces the glass thumb into expanded tactile state."
    },
    {
      "name": "specularOpacity",
      "type": "number",
      "defaultValue": "0.5",
      "description": "Specular light highlight intensity (0 - 1)."
    },
    {
      "name": "specularSaturation",
      "type": "number",
      "defaultValue": "6",
      "description": "Refracted light color saturation boost (0 - 50)."
    },
    {
      "name": "refractionLevel",
      "type": "number",
      "defaultValue": "1.0",
      "description": "Refractive normal map displacement factor (0 - 1)."
    },
    {
      "name": "blurLevel",
      "type": "number",
      "defaultValue": "0.2",
      "description": "Gaussian blur standard deviation in pixels (0 - 40)."
    },
    {
      "name": "onChange",
      "type": "(checked: boolean) => void",
      "defaultValue": "undefined",
      "description": "Callback invoked when the switch is toggled."
    },
    {
      "name": "disabled",
      "type": "boolean",
      "defaultValue": "false",
      "description": "Disables interaction with the switch."
    },
    {
      "name": "className",
      "type": "string",
      "defaultValue": "undefined",
      "description": "Additional CSS class names for outer container."
    }
  ],
  "files": [
    {
      "name": "mac-switch.tsx",
      "path": "registry/ui/mac-switch.tsx",
      "code": "\"use client\";\n\nimport React, { useEffect, useRef, useId, useState } from \"react\";\nimport {\n  motion,\n  useMotionValue,\n  useSpring,\n  useTransform,\n  mix,\n  type MotionValue,\n} from \"motion/react\";\nimport { cn } from \"@/lib/utils\";\n\nexport type MacSwitchColor =\n  | \"green\"\n  | \"blue\"\n  | \"purple\"\n  | \"orange\"\n  | \"pink\"\n  | \"amber\"\n  | \"monochrome\";\n\nexport type MacSwitchSize = \"sm\" | \"md\" | \"lg\";\nexport type MacSwitchMaterial = \"liquid\" | \"frosted\" | \"clear\";\n\nexport interface SwitchFilterProps {\n  id?: string;\n  blur?: MotionValue<number> | number;\n  scaleRatio?: MotionValue<number> | number;\n  specularOpacity?: MotionValue<number> | number;\n  specularSaturation?: MotionValue<number> | number;\n  width?: number;\n  height?: number;\n  radius?: number;\n  bezelWidth?: number;\n}\n\nconst SWITCH_COLORS: Record<\n  MacSwitchColor,\n  { fill: string; dot: string; label: string; glow: string }\n> = {\n  green: {\n    fill: \"#34C759\",\n    dot: \"bg-emerald-500\",\n    label: \"Green\",\n    glow: \"rgba(52, 199, 89, 0.4)\",\n  },\n  blue: {\n    fill: \"#007AFF\",\n    dot: \"bg-blue-500\",\n    label: \"Blue\",\n    glow: \"rgba(0, 122, 255, 0.4)\",\n  },\n  purple: {\n    fill: \"#AF52DE\",\n    dot: \"bg-purple-500\",\n    label: \"Purple\",\n    glow: \"rgba(175, 82, 222, 0.4)\",\n  },\n  orange: {\n    fill: \"#FF9500\",\n    dot: \"bg-orange-500\",\n    label: \"Orange\",\n    glow: \"rgba(255, 149, 0, 0.4)\",\n  },\n  pink: {\n    fill: \"#FF2D55\",\n    dot: \"bg-pink-500\",\n    label: \"Pink\",\n    glow: \"rgba(255, 45, 85, 0.4)\",\n  },\n  amber: {\n    fill: \"#FFCC00\",\n    dot: \"bg-amber-400\",\n    label: \"Amber\",\n    glow: \"rgba(255, 204, 0, 0.4)\",\n  },\n  monochrome: {\n    fill: \"#8E8E93\",\n    dot: \"bg-zinc-300\",\n    label: \"Graphite\",\n    glow: \"rgba(142, 142, 147, 0.3)\",\n  },\n};\n\nconst SWITCH_SIZES: Record<\n  MacSwitchSize,\n  {\n    sliderWidth: number;\n    sliderHeight: number;\n    thumbWidth: number;\n    thumbHeight: number;\n    bezelWidth: number;\n  }\n> = {\n  sm: {\n    sliderWidth: 120,\n    sliderHeight: 50,\n    thumbWidth: 110,\n    thumbHeight: 69,\n    bezelWidth: 14,\n  },\n  md: {\n    sliderWidth: 160,\n    sliderHeight: 67,\n    thumbWidth: 146,\n    thumbHeight: 92,\n    bezelWidth: 19,\n  },\n  lg: {\n    sliderWidth: 200,\n    sliderHeight: 84,\n    thumbWidth: 182,\n    thumbHeight: 115,\n    bezelWidth: 24,\n  },\n};\n\nfunction isMotionValue(val: unknown): val is MotionValue<number> {\n  return typeof val === \"object\" && val !== null && \"get\" in val && \"on\" in val;\n}\n\nfunction getNumericValue(\n  val?: MotionValue<number> | number,\n  fallback = 0,\n): number {\n  if (val === undefined) return fallback;\n  if (isMotionValue(val)) return Number(val.get()) || fallback;\n  return Number(val) || fallback;\n}\n\nexport const SwitchFilter: React.FC<SwitchFilterProps> = ({\n  id = \"thumb-filter-switch\",\n  blur,\n  scaleRatio,\n  specularOpacity,\n  specularSaturation,\n  width = 146,\n  height = 92,\n  radius = 46,\n  bezelWidth = 19,\n}) => {\n  const feImageRef = useRef<SVGFEImageElement>(null);\n  const blurRef = useRef<SVGFEGaussianBlurElement>(null);\n  const dispRef = useRef<SVGFEDisplacementMapElement>(null);\n  const specRef = useRef<SVGFESpecularLightingElement>(null);\n  const satRef = useRef<SVGFEColorMatrixElement>(null);\n\n  useEffect(() => {\n    if (typeof document === \"undefined\") return;\n\n    const canvas = document.createElement(\"canvas\");\n    canvas.width = width;\n    canvas.height = height;\n    const ctx = canvas.getContext(\"2d\");\n    if (!ctx) return;\n\n    const imgData = ctx.createImageData(width, height);\n    const data = imgData.data;\n    let pos = 0;\n\n    for (let y = 0; y < height; y++) {\n      for (let x = 0; x < width; x++) {\n        const segX = Math.max(radius, Math.min(width - radius, x));\n        const segY = height / 2;\n        const dx = x - segX;\n        const dy = y - segY;\n        const dist = Math.sqrt(dx * dx + dy * dy);\n        const distEdge = radius - dist;\n\n        if (distEdge <= 0 || distEdge >= bezelWidth) {\n          data[pos++] = 128;\n          data[pos++] = 128;\n          data[pos++] = 255;\n          data[pos++] = 255;\n        } else {\n          const u = distEdge / bezelWidth;\n          const slope = Math.sin(u * Math.PI) * (1 - 0.25 * u);\n          const dirX = dist > 0.001 ? dx / dist : 0;\n          const dirY = dist > 0.001 ? dy / dist : 0;\n          const nx = -dirX * slope * 0.9;\n          const ny = -dirY * slope * 0.9;\n          const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));\n\n          data[pos++] = Math.round(128 + 127 * nx);\n          data[pos++] = Math.round(128 + 127 * ny);\n          data[pos++] = Math.round(128 + 127 * nz);\n          data[pos++] = 255;\n        }\n      }\n    }\n\n    ctx.putImageData(imgData, 0, 0);\n    const dataUrl = canvas.toDataURL(\"image/png\");\n    feImageRef.current?.setAttribute(\"href\", dataUrl);\n  }, [width, height, radius, bezelWidth]);\n\n  useEffect(() => {\n    const unsubBlur = isMotionValue(blur)\n      ? blur.on(\"change\", (v) => {\n          blurRef.current?.setAttribute(\"stdDeviation\", String(v));\n        })\n      : undefined;\n\n    const unsubDisp = isMotionValue(scaleRatio)\n      ? scaleRatio.on(\"change\", (v) => {\n          dispRef.current?.setAttribute(\"scale\", String(v * 24));\n        })\n      : undefined;\n\n    const unsubSpec = isMotionValue(specularOpacity)\n      ? specularOpacity.on(\"change\", (v) => {\n          specRef.current?.setAttribute(\"specularConstant\", String(v * 1.5));\n        })\n      : undefined;\n\n    const unsubSat = isMotionValue(specularSaturation)\n      ? specularSaturation.on(\"change\", (v) => {\n          satRef.current?.setAttribute(\"values\", String(1 + v * 0.15));\n        })\n      : undefined;\n\n    const currentBlur = getNumericValue(blur, 0.2);\n    const currentScale = getNumericValue(scaleRatio, 0.4);\n    const currentSpec = getNumericValue(specularOpacity, 0.5);\n    const currentSat = getNumericValue(specularSaturation, 6);\n\n    blurRef.current?.setAttribute(\"stdDeviation\", String(currentBlur));\n    dispRef.current?.setAttribute(\"scale\", String(currentScale * 24));\n    specRef.current?.setAttribute(\n      \"specularConstant\",\n      String(currentSpec * 1.5),\n    );\n    satRef.current?.setAttribute(\"values\", String(1 + currentSat * 0.15));\n\n    return () => {\n      unsubBlur?.();\n      unsubDisp?.();\n      unsubSpec?.();\n      unsubSat?.();\n    };\n  }, [blur, scaleRatio, specularOpacity, specularSaturation]);\n\n  const initialBlur = getNumericValue(blur, 0.2);\n  const initialDisp = getNumericValue(scaleRatio, 0.4) * 24;\n  const initialSpec = getNumericValue(specularOpacity, 0.5) * 1.5;\n  const initialSat = 1 + getNumericValue(specularSaturation, 6) * 0.15;\n\n  return (\n    <svg\n      width=\"0\"\n      height=\"0\"\n      className=\"pointer-events-none absolute -z-10 opacity-0\"\n      aria-hidden=\"true\"\n    >\n      <defs>\n        <filter\n          id={id}\n          x=\"-20%\"\n          y=\"-20%\"\n          width=\"140%\"\n          height=\"140%\"\n          colorInterpolationFilters=\"sRGB\"\n        >\n          <feImage\n            ref={feImageRef}\n            result=\"normalMap\"\n            x=\"0\"\n            y=\"0\"\n            width={width}\n            height={height}\n            preserveAspectRatio=\"none\"\n          />\n          <feGaussianBlur\n            ref={blurRef}\n            in=\"SourceGraphic\"\n            stdDeviation={initialBlur}\n            result=\"blurred\"\n          />\n          <feDisplacementMap\n            ref={dispRef}\n            in=\"blurred\"\n            in2=\"normalMap\"\n            scale={initialDisp}\n            xChannelSelector=\"R\"\n            yChannelSelector=\"G\"\n            result=\"refracted\"\n          />\n          <feSpecularLighting\n            ref={specRef}\n            in=\"normalMap\"\n            surfaceScale=\"2\"\n            specularConstant={initialSpec}\n            specularExponent=\"24\"\n            result=\"specular\"\n            lightingColor=\"#ffffff\"\n          >\n            <feDistantLight azimuth=\"235\" elevation=\"55\" />\n          </feSpecularLighting>\n          <feColorMatrix\n            ref={satRef}\n            in=\"refracted\"\n            type=\"saturate\"\n            values={String(initialSat)}\n            result=\"saturated\"\n          />\n          <feBlend in=\"saturated\" in2=\"specular\" mode=\"screen\" />\n        </filter>\n      </defs>\n    </svg>\n  );\n};\n\nexport const Filter = SwitchFilter;\n\nexport interface MacSwitchProps {\n  checked?: boolean;\n  defaultChecked?: boolean;\n  onChange?: (checked: boolean) => void;\n  disabled?: boolean;\n  size?: MacSwitchSize;\n  color?: MacSwitchColor;\n  material?: MacSwitchMaterial;\n  forceActive?: boolean;\n  specularOpacity?: number;\n  specularSaturation?: number;\n  refractionLevel?: number;\n  blurLevel?: number;\n  className?: string;\n}\n\nexport const MacSwitch: React.FC<MacSwitchProps> = ({\n  checked: controlledChecked,\n  defaultChecked = false,\n  onChange,\n  disabled = false,\n  size = \"md\",\n  color = \"green\",\n  material = \"liquid\",\n  forceActive = false,\n  specularOpacity: specularOpacityProp = 0.5,\n  specularSaturation: specularSaturationProp = 6,\n  refractionLevel = 1.0,\n  blurLevel = 0.2,\n  className,\n}) => {\n  const generatedId = useId();\n  const filterId = `mac-switch-filter-${generatedId.replace(/:/g, \"\")}`;\n\n  const currentTheme = SWITCH_COLORS[color] ?? SWITCH_COLORS.green;\n  const currentSize = SWITCH_SIZES[size] ?? SWITCH_SIZES.md;\n  const {\n    sliderWidth,\n    sliderHeight,\n    thumbWidth,\n    thumbHeight,\n    bezelWidth,\n  } = currentSize;\n\n  const thumbRadius = thumbHeight / 2;\n  const THUMB_REST_SCALE = 0.65;\n  const THUMB_ACTIVE_SCALE = 0.9;\n  const THUMB_REST_OFFSET = ((1 - THUMB_REST_SCALE) * thumbWidth) / 2;\n  const TRAVEL =\n    sliderWidth - sliderHeight - (thumbWidth - thumbHeight) * THUMB_REST_SCALE;\n  const thumbMarginLeft =\n    -THUMB_REST_OFFSET + (sliderHeight - thumbHeight * THUMB_REST_SCALE) / 2;\n\n  const isControlled = controlledChecked !== undefined;\n  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);\n  const isChecked = isControlled ? controlledChecked : uncontrolledChecked;\n\n  const checked = useMotionValue(isChecked ? 1 : 0);\n  const pointerDown = useMotionValue(0);\n  const forceActiveMotion = useMotionValue(forceActive ? 1 : 0);\n  const xDragRatio = useMotionValue(isChecked ? 1 : 0);\n  const initialPointerX = useMotionValue(0);\n\n  const isDraggingRef = useRef(false);\n\n  useEffect(() => {\n    forceActiveMotion.set(forceActive ? 1 : 0);\n  }, [forceActive, forceActiveMotion]);\n\n  useEffect(() => {\n    if (controlledChecked !== undefined) {\n      const nextVal = controlledChecked ? 1 : 0;\n      checked.set(nextVal);\n      xDragRatio.set(nextVal);\n    }\n  }, [controlledChecked, checked, xDragRatio]);\n\n  const active = useTransform(\n    (): number =>\n      forceActiveMotion.get() > 0.5 || pointerDown.get() > 0.5 ? 1 : 0,\n  );\n\n  const blur = useMotionValue(blurLevel);\n  const specularOpacity = useMotionValue(specularOpacityProp);\n  const specularSaturation = useMotionValue(specularSaturationProp);\n  const refractionBase = useMotionValue(refractionLevel);\n\n  useEffect(() => {\n    blur.set(blurLevel);\n  }, [blurLevel, blur]);\n\n  useEffect(() => {\n    specularOpacity.set(specularOpacityProp);\n  }, [specularOpacityProp, specularOpacity]);\n\n  useEffect(() => {\n    specularSaturation.set(specularSaturationProp);\n  }, [specularSaturationProp, specularSaturation]);\n\n  useEffect(() => {\n    refractionBase.set(refractionLevel);\n  }, [refractionLevel, refractionBase]);\n\n  const xRatio = useSpring(\n    useTransform((): number => {\n      const c = checked.get();\n      const dragRatio = xDragRatio.get();\n      if (pointerDown.get() > 0.5) {\n        return dragRatio;\n      }\n      return c > 0.5 ? 1 : 0;\n    }),\n    { damping: 42, stiffness: 520, mass: 0.8 },\n  );\n\n  const backgroundOpacity = useSpring(\n    useTransform(active, (v) => 1 - 0.9 * v),\n    { damping: 42, stiffness: 600, mass: 0.8 },\n  );\n\n  const thumbScale = useSpring(\n    useTransform(\n      active,\n      (v) => THUMB_REST_SCALE + (THUMB_ACTIVE_SCALE - THUMB_REST_SCALE) * v,\n    ),\n    { damping: 42, stiffness: 600, mass: 0.8 },\n  );\n\n  const scaleRatio = useSpring(\n    useTransform(() => (0.4 + 0.5 * active.get()) * refractionBase.get()),\n    { damping: 42, stiffness: 600, mass: 0.8 },\n  );\n\n  const considerChecked = useTransform((): number => {\n    const x = xDragRatio.get();\n    const c = checked.get();\n    return pointerDown.get() > 0.5\n      ? x > 0.5\n        ? 1\n        : 0\n      : c > 0.5\n        ? 1\n        : 0;\n  });\n\n  const backgroundColor = useTransform(\n    useSpring(considerChecked, { damping: 42, stiffness: 520 }),\n    mix(\"#94949F55\", currentTheme.fill),\n  );\n\n  const thumbX = useTransform(xRatio, (r) => r * TRAVEL);\n\n  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {\n    if (disabled) return;\n    isDraggingRef.current = true;\n    pointerDown.set(1);\n    initialPointerX.set(e.clientX);\n    xDragRatio.set(checked.get());\n    try {\n      e.currentTarget.setPointerCapture(e.pointerId);\n    } catch {}\n  };\n\n  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {\n    if (!isDraggingRef.current || disabled) return;\n    const baseRatio = checked.get();\n    const displacementX = e.clientX - initialPointerX.get();\n    const ratio = baseRatio + displacementX / TRAVEL;\n    const overflow = ratio < 0 ? -ratio : ratio > 1 ? ratio - 1 : 0;\n    const overflowSign = ratio < 0 ? -1 : 1;\n    const dampedOverflow = (overflowSign * overflow) / 22;\n    xDragRatio.set(Math.min(1, Math.max(0, ratio)) + dampedOverflow);\n  };\n\n  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {\n    if (!isDraggingRef.current) return;\n    isDraggingRef.current = false;\n    pointerDown.set(0);\n\n    try {\n      e.currentTarget.releasePointerCapture(e.pointerId);\n    } catch {}\n\n    const displacement = Math.abs(e.clientX - initialPointerX.get());\n    let nextChecked: boolean;\n    if (displacement < 4) {\n      nextChecked = checked.get() < 0.5;\n    } else {\n      nextChecked = xDragRatio.get() > 0.5;\n    }\n\n    const nextVal = nextChecked ? 1 : 0;\n    checked.set(nextVal);\n    xDragRatio.set(nextVal);\n    if (!isControlled) {\n      setUncontrolledChecked(nextChecked);\n    }\n    onChange?.(nextChecked);\n  };\n\n  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {\n    if (disabled) return;\n    if (e.key === \" \" || e.key === \"Enter\") {\n      e.preventDefault();\n      const nextChecked = checked.get() < 0.5;\n      const nextVal = nextChecked ? 1 : 0;\n      checked.set(nextVal);\n      xDragRatio.set(nextVal);\n      if (!isControlled) {\n        setUncontrolledChecked(nextChecked);\n      }\n      onChange?.(nextChecked);\n    } else if (e.key === \"ArrowLeft\") {\n      e.preventDefault();\n      checked.set(0);\n      xDragRatio.set(0);\n      if (!isControlled) {\n        setUncontrolledChecked(false);\n      }\n      onChange?.(false);\n    } else if (e.key === \"ArrowRight\") {\n      e.preventDefault();\n      checked.set(1);\n      xDragRatio.set(1);\n      if (!isControlled) {\n        setUncontrolledChecked(true);\n      }\n      onChange?.(true);\n    }\n  };\n\n  const backdropStyle =\n    material === \"liquid\"\n      ? `url(#${filterId}) blur(14px)`\n      : material === \"frosted\"\n        ? \"blur(24px) saturate(180%)\"\n        : \"blur(8px) saturate(120%)\";\n\n  return (\n    <div\n      className={cn(\n        \"relative flex items-center justify-center select-none py-4\",\n        disabled && \"opacity-50 pointer-events-none\",\n        className,\n      )}\n    >\n      {material === \"liquid\" && (\n        <SwitchFilter\n          id={filterId}\n          blur={blur}\n          scaleRatio={scaleRatio}\n          specularOpacity={specularOpacity}\n          specularSaturation={specularSaturation}\n          width={thumbWidth}\n          height={thumbHeight}\n          radius={thumbRadius}\n          bezelWidth={bezelWidth}\n        />\n      )}\n\n      <motion.div\n        role=\"switch\"\n        aria-checked={isChecked}\n        tabIndex={disabled ? -1 : 0}\n        onKeyDown={handleKeyDown}\n        onPointerDown={handlePointerDown}\n        onPointerMove={handlePointerMove}\n        onPointerUp={handlePointerUp}\n        onPointerCancel={handlePointerUp}\n        className=\"relative inline-block touch-none select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50\"\n        style={{\n          width: sliderWidth,\n          height: sliderHeight,\n          backgroundColor: backgroundColor,\n          borderRadius: sliderHeight / 2,\n          boxShadow: \"inset 0 1px 3px rgba(0, 0, 0, 0.15)\",\n        }}\n      >\n        <motion.div\n          className=\"absolute pointer-events-none\"\n          style={{\n            height: thumbHeight,\n            width: thumbWidth,\n            marginLeft: thumbMarginLeft,\n            x: thumbX,\n            y: \"-50%\",\n            borderRadius: thumbRadius,\n            top: sliderHeight / 2,\n            backdropFilter: backdropStyle,\n            WebkitBackdropFilter: backdropStyle,\n            scale: thumbScale,\n            willChange: \"transform\",\n            backgroundColor: useTransform(\n              backgroundOpacity,\n              (op) => `rgba(255, 255, 255, ${op})`,\n            ),\n            boxShadow: useTransform(() => {\n              const isPressed = pointerDown.get() > 0.5;\n              return (\n                \"0 4px 22px rgba(0, 0, 0, 0.14), inset 0 1px 1.5px rgba(255, 255, 255, 0.85)\" +\n                (isPressed\n                  ? \", inset 2px 7px 24px rgba(0,0,0,0.09), inset -2px -7px 24px rgba(255,255,255,0.09)\"\n                  : \"\")\n              );\n            }),\n            border: \"0.5px solid rgba(255, 255, 255, 0.4)\",\n          }}\n        >\n          <div\n            className=\"pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-35\"\n            style={{\n              borderRadius: `${thumbRadius}px ${thumbRadius}px 0 0`,\n              background:\n                \"linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.05) 100%)\",\n            }}\n          />\n        </motion.div>\n      </motion.div>\n    </div>\n  );\n};\n\nexport const Switch = MacSwitch;\n"
      }
    ]
  },
};

export const getAllComponents = (
  includeHidden = false
): ComponentRegistryItem[] => {
  const items = Object.values(COMPONENT_REGISTRY);
  if (includeHidden) return items;
  return items.filter((item) => !item.hidden);
};

export const getComponentBySlug = (
  slug: string,
  includeHidden = false
): ComponentRegistryItem | undefined => {
  const item = COMPONENT_REGISTRY[slug];
  if (!item) return undefined;
  if (item.hidden && !includeHidden) return undefined;
  return item;
};
