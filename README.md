<div align="center">

# DevClub UI

**High-Performance, Production-Ready Animated UI Primitives & WebGL Shaders for Modern Web Applications**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.15.0-88CE02?logo=greensock)](https://gsap.com)
[![WebGL](https://img.shields.io/badge/WebGL-2.0_(OGL)-990000?logo=webgl)](https://github.com/oamap/ogl)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Explore Components](https://devclub.co/components) • [Documentation](https://devclub.co/docs) • [API Specification](#rest-api-reference) • [Contributing](CONTRIBUTING.md)

</div>

---

## Overview & Engineering Philosophy

**DevClub UI** is an open-source, copy-paste component engineering library designed for developer platforms, high-aesthetic SaaS products, and generative AI interfaces. Built on **Next.js 16**, **React 19**, **Tailwind CSS v4**, **GSAP 3.15**, and **OGL WebGL 2.0**, DevClub UI bridges the gap between raw graphics programming and modern React component architecture.

### Key Architectural Pillars

* **Copy-Paste Modularity**: Zero lock-in. Each component is a self-contained `.tsx` file that you own, inspect, and modify directly in your codebase.
* **Zero Cumulative Layout Shift (CLS 0.0)**: GPU-accelerated compositing ensures hardware-bound layout stability during heavy micro-interactions.
* **Declarative Physics & WebGL Shaders**: Procedural dither noise, 3D Raymarched AI Orbs, dynamic scale hatch marks, and proximity vector cards running on GPU fragment execution units.
* **Strict GSAP Context Scoping**: Fully compliant with `@gsap/react` `useGSAP()` lifecycles, ensuring zero memory leaks or unhandled scroll triggers on unmount.
* **WCAG 2.1 AA Accessibility Compliance**: Semantic HTML tags, full keyboard tab order (`Enter`/`Space`), and automatic `prefers-reduced-motion` detection.

---

## Technical Architecture & Dependency Stack

```text
                        ┌─────────────────────────────────────────┐
                        │              DevClub UI                 │
                        └────────────────────┬────────────────────┘
                                             │
      ┌──────────────────────┬───────────────┴───────────────┬──────────────────────┐
      │                      │                               │                      │
┌─────▼───────────┐    ┌─────▼───────────┐         ┌─────────▼─────────┐    ┌───────▼───────────┐
│ Next.js 16 App  │    │  Tailwind v4    │         │  GSAP 3.15 Engine │    │ WebGL 2.0 / OGL   │
│ React 19 Engine │    │ Design System   │         │ Animated Timeline │    │  GPU Fragment     │
└─────────────────┘    └─────────────────┘         └───────────────────┘    └───────────────────┘
```

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Next.js** | `^16.3.4` | App Router framework, server component rendering, and REST API endpoints |
| **React** | `^19.2.8` | UI component primitives and concurrent rendering |
| **Tailwind CSS** | `^4.0` | Sub-pixel CSS utility styling, grid layouts, and color variable tokens |
| **GSAP & @gsap/react** | `^3.15.0` / `^2.1.2` | Timeline choreography, micro-interaction spring curves, and hook lifecycle scoping |
| **OGL** | `^1.0.11` | Lightweight WebGL 2.0 fragment shader rendering pipeline |
| **Framer Motion** | `^13.4.0` | Motion layout transitions and gesture spring physics |
| **Radix UI Primitives** | `^1.3` / `^1.2` | Accessible unstyled primitives (`@radix-ui/react-icons`, avatar, slot) |

---

## Quick Start & Installation

### 1. Install Base Core Dependencies

Install the lightweight utility packages required across DevClub UI components:

```bash
# Using npm
npm install clsx tailwind-merge @radix-ui/react-icons

# Using pnpm
pnpm add clsx tailwind-merge @radix-ui/react-icons

# Using yarn
yarn add clsx tailwind-merge @radix-ui/react-icons

# Using bun
bun add clsx tailwind-merge @radix-ui/react-icons
```

For components requiring advanced animations or 3D WebGL shaders:

```bash
npm install gsap @gsap/react ogl motion
```

### 2. Configure Class Merging Utility (`src/lib/utils.ts`)

Create a unified class name merger using `clsx` and `tailwind-merge`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 3. Setup Global CSS Design Tokens (`src/app/globals.css`)

Add monochromatic design system variables to your root stylesheet:

```css
@import "tailwindcss";

:root {
  --background: #050505;
  --foreground: #f4f4f5;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-hairline: rgba(255, 255, 255, 0.16);
  --pattern-line: rgba(255, 255, 255, 0.10);
  --pattern: rgba(255, 255, 255, 0.05);
}

@layer base {
  body {
    background-color: var(--background);
    color: var(--foreground);
  }
}
```

---

## Component Registry & Technical Directory

Below is the complete catalog of all production components included in DevClub UI:

| Component Slug | Name | Category | Primary Rendering Engine | WCAG | Key Features |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `scales` | **Scales & Borders** | Scales | CSS Repeating Linear Gradients | AA | Architectural boundary scales (`HorizontalScale`, `VerticalScale`, `Lines`) with sub-pixel 14px pitch |
| `animated-button` | **Animated Button** | Buttons | CSS Hardware Transforms | AA | 4 variants (`primary`, `secondary`, `outline`, `shimmer`) with continuous sweep lighting & group-hover arrow |
| `spotlight-card` | **Spotlight Card** | Cards | Mouse Cartesian Matrix & CSS Radial Mask | AA | Glassmorphic 600px cursor-following lighting spotlight with real-time `getBoundingClientRect()` tracking |
| `dither` | **Dither Grainient** | Feedback | OGL WebGL 2.0 Fragment Shader | AA | Procedural fbm noise, fluid trigonometric domain warp, animated filmic grain, and theme synchronization |
| `ai-orb` | **AI Orb Shader** | Feedback | OGL WebGL 2.0 / Raymarched Shader | AA | Procedural 3D raymarched noise sphere with interactive rotation speed, vertex noise, and chromatic glow |
| `accordion` | **Accordion** | Accordion | Framer Motion / Height Interpolation | AA | Fluid height expansion, accessible keyboard tab focus, and collapsible item grouping |
| `smooth-accordion` | **Smooth Accordion** | Accordion | GSAP Timeline Interpolation | AA | Spring-curved accordion collapse engineered with GSAP timeline choreography and zero layout jitter |
| `dotted-accordion` | **Dotted Accordion** | Accordion | CSS Radial Pattern & Motion | AA | Technical grid-dotted border accordion with dark-mode aesthetic styling |
| `animated-counter` | **Animated Counter** | Feedback | GSAP / Canvas / Spring Physics | AA | Smooth rolling numerical counter with locale formatting and continuous spring transition |
| `bento-grid` | **Bento Grid** | Layout | CSS Grid / Tailwind v4 | AA | High-density feature grid matrix container supporting multi-column span layouts |
| `candy-button` | **Candy Button** | Buttons | CSS 3D Box Shadow & Gradient | AA | Glossy tactile 3D interactive button with active press depth displacement |
| `sparkle-button` | **Sparkle Button** | Buttons | Canvas Particle System / GSAP | AA | Particle explosion feedback effect on click with customizable particle count and velocity decay |
| `code-block` | **Code Block** | Feedback | React Syntax / Clipboard API | AA | High-contrast code snippet display with copy to clipboard, line numbering, and header bar |
| `github-activity` | **GitHub Graph** | Feedback | SVG Vector Matrix / Tooltip Hover | AA | Interactive annual GitHub contribution graph displaying activity levels, tooltips, and streak data |
| `glowing-badge` | **Glowing Badge** | Feedback | CSS Animated Gradient Mask | AA | Sub-pixel luminous status indicator badge with pulse animation |
| `hook-sidebar` | **Hook Sidebar** | Layout | GSAP Proximity Detection | AA | Proximity-aware floating sidebar anchored to cursor distance vectors |
| `proximity-sidebar`| **Proximity Sidebar** | Layout | Mouse Distance Calculation | AA | Interactive navigation sidebar that highlights links dynamically based on cursor proximity radius |
| `otp-input` | **OTP / PIN Input** | Layout | React State / HTML5 Input Matrix | AA | Multi-digit verification code input with auto-advance, backspace navigation, and paste parsing |
| `task-list` | **Task List** | Layout | Framer Motion Reordering | AA | Interactive animated checklist with check mark micro-interactions, strike-through transitions, and badge counts |
| `toast` | **Toast UI** | Feedback | Sonner / Portal Overlay | AA | Stacked pop-over notification toasts with dynamic action triggers and timer dismissal |
| `twitter-card` | **Twitter Card** | Cards | CSS Glassmorphism / Avatar | AA | High-fidelity social post preview card with media attachments, verification badges, and engagement stats |

---

## Detailed Component Specifications & Code Usage

### 1. Scales & Borders (`scales`)

Architectural boundary divider primitives designed for developer consoles, code documentation, and high-density SaaS headers.

```tsx
import { HorizontalScale, VerticalScale, Lines } from "@/components/ui/scales";

export function SectionDivider() {
  return (
    <div className="w-full space-y-6">
      <HorizontalScale className="my-4" />
      <div className="flex h-40">
        <p className="flex-1 text-xs text-zinc-400">Left Workspace</p>
        <VerticalScale />
        <p className="flex-1 text-xs text-zinc-400">Right Inspector</p>
      </div>
      <Lines />
    </div>
  );
}
```

### 2. Dither WebGL Grainient (`dither`)

A GPU-bound procedural WebGL 2.0 fragment shader generating fluid dithered noise, animated filmic grain, and multi-chromatic palette blending.

```tsx
import { Grainient } from "@/components/ui/dither";

export function HeroBackground() {
  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl">
      <Grainient
        color1="#FF9FFC"
        color2="#5227FF"
        color3="#B497CF"
        timeSpeed={0.25}
        warpStrength={1.2}
        grainAmount={0.12}
        grainAnimated={true}
      />
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold text-white">Next Generation Interfaces</h1>
      </div>
    </div>
  );
}
```

### 3. Spotlight Card (`spotlight-card`)

Cursor-tracking glassmorphic container projecting a smooth 600px radial lighting mask.

```tsx
import { SpotlightCard } from "@/components/ui/spotlight-card";

export function FeatureCard() {
  return (
    <SpotlightCard
      spotlightColor="rgba(59, 130, 246, 0.18)"
      className="max-w-md p-8"
    >
      <h3 className="text-lg font-medium text-white">Real-Time Telemetry</h3>
      <p className="mt-2 text-xs text-zinc-400">
        Monitor GPU fragment execution time and frame latency across distributed clusters.
      </p>
    </SpotlightCard>
  );
}
```

---

## GSAP & Animation Standards

DevClub UI enforces strict GSAP practices (documented in `skills/` and project rules) to ensure 60fps performance and leak-free memory cleanup:

1. **Always Scope via `@gsap/react` `useGSAP()`**:
   ```tsx
   useGSAP(() => {
     gsap.to(".element", { x: 100, duration: 0.5 });
   }, { scope: containerRef, dependencies: [value] });
   ```
2. **Context Cleanup**: `useGSAP` automatically reverts all tweens, timelines, and ScrollTriggers created during execution upon component unmount.
3. **Reduced Motion Fallback**:
   ```typescript
   const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   if (prefersReducedMotion) {
     gsap.set(".target", { opacity: 1, y: 0 });
     return;
   }
   ```

---

## WebGL & Shader Performance Guidelines

For WebGL components (`dither`, `ai-orb`):

* **Resolution Capping**: Device Pixel Ratio (DPR) is dynamically capped at `2.0` (`Math.min(window.devicePixelRatio || 1, 2)`).
* **Tab Visibility Listener**: Animation frames (`requestAnimationFrame`) pause when `document.hidden` is `true`.
* **Memory Lifecycle**: WebGL textures, geometries, programs, and array buffers are deleted during React `useEffect` unmount teardown.

---

## Programmatic REST API Reference

DevClub UI provides built-in REST API endpoints to query component metadata, source code, dependencies, and system status programmatically.

### `GET /api/components`

Returns a list of all registered UI components with metadata and category filters.

* **Query Parameters**:
  * `category` *(optional)*: Filter by category (`scales`, `buttons`, `cards`, `accordion`, `feedback`, `layout`).
  * `tag` *(optional)*: Filter by keyword tag (e.g. `webgl`, `shimmer`, `border`).
  * `query` *(optional)*: Free-text search matching name, description, or tags.

* **Example Request**:
  ```bash
  curl -X GET "http://localhost:3000/api/components?category=buttons"
  ```

* **Example Response**:
  ```json
  {
    "success": true,
    "count": 3,
    "data": [
      {
        "slug": "animated-button",
        "name": "Animated Button",
        "description": "Multi-variant interactive button with shimmering effects.",
        "category": "buttons",
        "tags": ["button", "shimmer", "interaction"],
        "version": "1.0.0"
      }
    ]
  }
  ```

### `GET /api/components/[slug]`

Retrieves full component details including TSX source code, prop specifications, physics engine metadata, guidelines, and accessibility attributes.

* **Example Request**:
  ```bash
  curl -X GET "http://localhost:3000/api/components/dither"
  ```

### `GET /api/health`

System health check endpoint returning API version, uptime, registry component count, and status.

* **Example Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-09-22T09:50:00.000Z",
    "version": "0.1.0",
    "componentsCount": 21
  }
  ```

---

## Accessibility & Keyboard Navigation (WCAG 2.1 AA)

All components undergo rigorous accessibility audits:

* **Keyboard Interaction**:
  * `Tab` / `Shift + Tab`: Focus moves logically through interactive elements with high-contrast visible focus rings (`focus-visible:ring-2`).
  * `Enter` / `Space`: Triggers button clicks, accordion toggle states, and task check items.
  * `Escape`: Closes active dialogs or overlays.
* **ARIA Semantic Markup**: Components expose explicit ARIA roles (`role="button"`, `role="separator"`, `role="region"`, `aria-expanded`, `aria-hidden="true"`).

---

## Contributing

We welcome community contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to learn about:

* Setting up your local development environment
* Authoring new animated or WebGL primitives
* Registering components in `src/registry/index.ts`
* Submitting pull requests

Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all community interactions.

---

## Security Policy

If you discover a security vulnerability or component prop injection risk, please review our [Security Policy](SECURITY.md) and report it via `security@devclub.co` or GitHub Private Security Advisories.

---

## License & Copyright

DevClub UI is open-source software distributed under the [MIT License](LICENSE).

```text
Copyright (c) 2026 DevClub (Heyykrishnna / dev-club-components)
```

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.
