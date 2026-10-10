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
- **npm**: `v10` or higher. The repo uses `package-lock.json`, so use npm rather than pnpm, yarn, or bun.
- **Git**: `v2.30.0` or higher

### 2. Fork and Clone the Repository

```bash
# Fork the repository on GitHub, then clone your fork locally:
git clone https://github.com/YOUR_USERNAME/component_library.git
cd component_library

# Set up upstream remote
git remote add upstream https://github.com/devclub-nstru/component_library.git
```

### 3. Install Dependencies

```bash
npm ci
```

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the interactive showcase and documentation live.

---

## Project Structure Overview

```text
component_library/
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

   Then export the component in `src/registry/components/index.ts` and `src/registry/index.ts`, and run `npm run registry:sync` to synchronize the catalog and public shadcn registry files in `public/r/`.

3. **Verify in Local Server**:
   Ensure your component renders correctly at `http://localhost:3000/components/your-component-slug` and responds to query filters.

---

## Before you open a pull request

Run the same checks CI runs:

```bash
npm run lint
npm run typecheck
npm run build
npm run check:lockfile
```

If you changed anything under `src/registry/`, run `npm run registry:sync` and commit the regenerated `public/r/` and `registry.json`. CI rebuilds the registry and fails if the committed files differ from the source. People install components from `public/r/`, so it has to match the reviewed code exactly.

---

## Pull request process

Every change goes to `main` through a pull request. Nobody pushes to `main` directly, maintainers included.

1. Fork the repository and create a branch from `main`:

   ```bash
   git fetch upstream
   git checkout -b feat/liquid-particle-button upstream/main
   ```

2. Make one focused change. A new component, a bug fix, and a docs cleanup are three separate PRs.

3. Title the PR as a [Conventional Commit](https://www.conventionalcommits.org/). CI rejects other formats. PRs are squash-merged, so the title becomes the commit message on `main`.
   - `feat(dither): add grain intensity prop`
   - `fix(otp-input): keep focus on paste`
   - `docs: correct registry install command`

   Allowed types: `feat`, `fix`, `perf`, `refactor`, `style`, `docs`, `test`, `build`, `ci`, `chore`, `revert`. The subject starts with a lowercase letter.

4. Fill in the PR template, including screenshots or a recording for any visual change.

### PR size

A bot labels every PR by the number of changed lines. Generated files (`public/r/`, `registry.json`, `package-lock.json`) don't count.

| Label          | Changed lines | What to expect                                 |
| -------------- | ------------- | ---------------------------------------------- |
| `size/xs`      | under 10      | Quick review                                   |
| `size/small`   | 10 to 99      | Normal review                                  |
| `size/medium`  | 100 to 299    | Normal review                                  |
| `size/large`   | 300 to 699    | Slower review, explain the structure in the PR |
| `size/x-large` | 700 to 1499   | Expect a request to split it                   |
| `size/excess`  | 1500 or more  | Split it before review starts                  |

A single new component usually lands in `small` or `medium`. If yours is bigger, put shared helpers in their own PR first.

### Review and merge

- CI runs on your PR after a maintainer approves the workflow run. That's GitHub's protection against untrusted code using our runners, so the wait isn't a sign that something is wrong.
- Every PR needs **one approval** from a code owner, every required check passing, and every review thread resolved.
- New commits pushed after an approval dismiss it. The last push needs a fresh approval from someone other than its author.
- Your branch has to be up to date with `main` before merging. Use the "Update branch" button.
- Maintainers squash-merge. Merge commits and rebase merges are disabled.

---

## Security and supply chain rules

DevClub UI code ends up copied straight into other people's apps, so we hold contributions to a stricter standard than most projects. A PR that breaks any of these rules will be closed.

### Dependencies

- **Open an issue before adding a dependency.** Explain why existing dependencies or a few lines of code won't do. Every new package becomes a dependency of every app that installs the component.
- Use `npm` only. Don't commit `yarn.lock`, `pnpm-lock.yaml`, or `bun.lock`.
- Change `package-lock.json` only by running `npm install`, never by hand. CI checks that every package resolves to `https://registry.npmjs.org/` with a `sha512` integrity hash and that each URL matches the package name.
- No packages with install scripts unless a maintainer has signed off. The repo's `.npmrc` sets `ignore-scripts=true`, and CI installs with `--ignore-scripts`.
- Dependency Review blocks PRs that add packages with known vulnerabilities (moderate or worse) or GPL, AGPL, or SSPL licenses.
- Dependabot waits 7 days before proposing a new version (30 for major versions), so freshly published malicious releases have time to be caught upstream. Security updates skip the wait.

### Code

- No minified, obfuscated, or bundled code. No binaries other than images and fonts in `public/` and maintainer-added README media in `.github/assets/`.
- No network requests from component code unless the component's purpose requires it and the PR says so.
- No `eval`, `new Function`, or `dangerouslySetInnerHTML` with values that come from props or user input.
- Don't hand-edit `public/r/` or `registry.json`. Generate them with `npm run registry:sync`.
- Never commit secrets, `.env` files, or tokens. Secret scanning with push protection is on and will reject the push.

### Workflows and tooling

- Changes to `.github/`, `bin/`, `scripts/`, `package.json`, `package-lock.json`, or `.npmrc` get extra scrutiny. Expect questions.
- Pin every GitHub Action to a full commit SHA with the version in a trailing comment, for example `actions/checkout@<sha> # v7.0.1`. The repository rejects unpinned actions.
- Workflows that run on `pull_request_target` must never check out or execute PR code.

### Reporting vulnerabilities

Don't open public issues for security problems. Follow [SECURITY.md](SECURITY.md).

---

## License & Copyright

By contributing to DevClub UI, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
