# Contributing to DevClub UI

Thank you for your interest in contributing to **DevClub UI**! We welcome contributions from developers of all skill levels. Whether you are adding a new animated component, optimizing WebGL shaders, fixing accessibility attributes, or improving documentation, your efforts help build a better open-source ecosystem.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before getting started.

---

## Getting Started

### 1. Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: `v20.0.0` or higher
- **Package Manager**: `npm` (v10+), `pnpm` (v9+), or `bun` (v1.1+)
- **Git**: `v2.30.0` or higher

### 2. Fork and Clone the Repository

```bash
# Fork the repository on GitHub, then clone your fork locally:
git clone https://github.com/YOUR_USERNAME/dev-club-components.git
cd dev-club-components

# Set up upstream remote
git remote add upstream https://github.com/Heyykrishnna/dev-club-components.git
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the interactive showcase and documentation live.

---

## Project Structure Overview

```text
devclub-co/
├── src/
│   ├── app/                    # Next.js 16 App Router pages and REST API routes
│   │   ├── api/
│   │   │   ├── components/     # GET /api/components & GET /api/components/[slug]
│   │   │   └── health/         # GET /api/health
│   │   ├── components/         # Interactive component showcase page (/components)
│   │   ├── docs/               # Interactive documentation page (/docs)
│   │   └── globals.css         # Global CSS design tokens & Tailwind CSS v4 setup
│   ├── components/             # Internal UI wrapper components (Navbar, Footer, Showcase)
│   ├── lib/                    # Shared core utilities (cn(), registry helper, constants)
│   ├── registry/               # Centralized component registry source of truth
│   │   ├── index.ts            # Complete metadata, props, physics, and code catalog
│   │   └── ui/                 # Production component source files (.tsx)
│   └── types/                  # TypeScript interface definitions
├── skills/                     # Project GSAP animation skill definitions & LLM indexes
├── LICENSE                     # MIT Open Source License
├── README.md                   # Primary open source manual
├── CONTRIBUTING.md             # Contributor guidelines
├── CODE_OF_CONDUCT.md          # Community code of conduct
└── SECURITY.md                 # Security disclosure policy
```

---

## Component Engineering Guidelines

When authoring a new component or modifying existing UI primitives, adhere strictly to the following architectural standards:

### 1. Zero Runtime Overheads & Performance First

- **Avoid Unnecessary State**: Keep state local and minimal. Avoid heavy global state re-renders.
- **GPU Compositing**: Animate GPU-friendly CSS properties (`transform`, `opacity`) rather than layout-triggering properties (`width`, `height`, `top`, `left`).
- **Hardware Acceleration**: Use `will-change` sparingly and only when necessary for high-frequency hardware acceleration.

### 2. GSAP & Animation Rules

- **React Scoping**: Always use `@gsap/react` `useGSAP()` or `gsap.context()` for React component lifecycles to ensure proper cleanup on unmount.
- **Avoid Standalone `setTimeout`/`setInterval`**: Use GSAP timelines (`gsap.timeline()`) or GSAP tickers for synchronized scheduling.
- **Cleanup on Unmount**: Ensure all ScrollTriggers, tweens, and event listeners created inside component logic are reverted/killed when the component unmounts.
- **Reduced Motion**: Respect `prefers-reduced-motion`. Provide fallback static states when motion is disabled by user preferences.

```tsx
// Standard GSAP Component Template
"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const MyAnimatedComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".animate-item", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef}>
      <div className="animate-item">Content 1</div>
      <div className="animate-item">Content 2</div>
    </div>
  );
};
```

### 3. WebGL & Shader Architecture (OGL / Canvas)

- **Context Cleanup**: Always dispose of WebGL renderers, textures, geometries, and programs when components unmount.
- **DPR Calibration**: Cap device pixel ratio at `Math.min(window.devicePixelRatio || 1, 2)` to prevent mobile battery drain.
- **Visibility Observers**: Use `IntersectionObserver` or `document.hidden` event listeners to pause WebGL animation frames (`requestAnimationFrame`) when off-screen or tab is backgrounded.

### 4. Accessibility (WCAG 2.1 AA)

- Use semantic HTML elements (`<button>`, `<section>`, `<nav>`, `<article>`).
- Ensure interactive primitives forward `ref` via `React.forwardRef`.
- Include suitable `aria-` attributes (`aria-expanded`, `aria-label`, `aria-hidden="true"` for decorative shaders).
- Support full keyboard navigation (`Tab`, `Enter`, `Space`, Arrow keys).

---

## Adding a New Component to the Registry

To contribute a new component to DevClub UI:

1. **Create the Component Source File**:
   Add your TSX file under `src/registry/ui/your-component-slug.tsx`.

2. **Register in Component Registry (`src/registry/components/your-component-slug.json`)**:
   Create a JSON file under `src/registry/components/your-component-slug.json` containing:
   - `slug`: Unique identifier string.
   - `name`: Human-readable display title.
   - `description`: Concise summary.
   - `summary`: Detailed architectural overview.
   - `category`: Category string (`accordion`, `scales`, `buttons`, `cards`, `feedback`, `layout`, `ai-stuff`, `apple-ui`, `inputs`, `display`, `navigation`).
   - `tags`: Array of search tags.
   - `dependencies`: List of npm package dependencies required.
   - `version`: Version string (e.g. `"1.0.0"`).
   - `highlights`: Key technical features array.
   - `anatomy`: Structural component elements.
   - `physics`: Engine details (GSAP, OGL WebGL, CSS transforms).
   - `accessibility`: ARIA roles and keyboard interactions.
   - `guidelines`: Best practices and recommended usage.
   - `props`: Exhaustive props specification table.
   - `files`: File object array including exact string code for the component (automatically synchronized via `npm run registry:sync`).

   Then export the component in `src/registry/components/index.ts` and `src/registry/index.ts`.

3. **Verify in Local Server**:
   Ensure your component renders correctly at `http://localhost:3000/components/your-component-slug` and responds to query filters.

---

## Code Quality & Linting

Before opening a pull request, verify that your code builds cleanly and adheres to code quality standards:

```bash
# Check TypeScript types and lint rules
npm run lint

# Verify build
npm run build
```

---

## Pull Request Process

1. **Create a Feature Branch**:

   ```bash
   git checkout -b feature/add-awesome-component
   ```

2. **Commit Your Changes**:
   Follow conventional commit messages:
   - `feat: add new liquid particle button component`
   - `fix(dither): resolve memory leak on webgl context loss`
   - `docs: update installation instructions in README`

3. **Push to Your Fork & Open PR**:

   ```bash
   git push origin feature/add-awesome-component
   ```

   Open a Pull Request targeting the `main` branch of `Heyykrishnna/dev-club-components`.

4. **PR Review**:
   Maintainers will review your code for responsiveness, animation performance, accessibility, and registry metadata completeness.

---

## License & Copyright

By contributing to DevClub UI, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
