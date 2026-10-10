<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/logo/WHITE-LOGO.png">
  <img alt="devclub.ui" src="public/logo/BLACK-LOGO.png" width="420">
</picture>

### React components with expressive motion

Copy the source into your project and change whatever you want. There's no runtime package to keep in sync.

[![npm version](https://img.shields.io/npm/v/%40devclubnst%2Fui?style=flat-square&color=0a5cff&label=npm)](https://www.npmjs.com/package/@devclubnst/ui)
[![CI](https://img.shields.io/github/actions/workflow/status/devclub-nstru/component_library/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/devclub-nstru/component_library/actions/workflows/ci.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/devclub-nstru/component_library/badge?style=flat-square)](https://securityscorecards.dev/viewer/?uri=github.com/devclub-nstru/component_library)
[![MIT license](https://img.shields.io/badge/license-MIT-171717?style=flat-square)](LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-12c8ff?style=flat-square)](CONTRIBUTING.md)

[Components](https://ui.devclubxnst.online/components) · [Docs](https://ui.devclubxnst.online/docs) · [npm](https://www.npmjs.com/package/@devclubnst/ui) · [Contributing](CONTRIBUTING.md) · [Community](https://ui.devclubxnst.online/docs/community)

<br>

<a href=".github/assets/devclub-ui-demo.mp4">
  <img src=".github/assets/devclub-ui-demo.gif" alt="DevClub UI demo: installing the Dither component with the CLI, then Dither, Orbit Gallery, AI Orb, Morph Search, Gooey Nav, Candy Button, Sparkle Button and Mac Switch in motion" width="100%">
</a>

<sub>Every clip is recorded from the live component pages. <a href=".github/assets/devclub-ui-demo.mp4">Watch in 1080p</a>.</sub>

</div>

## What you get

- 59 components written in React and TypeScript and styled with Tailwind CSS.
- Motion built on GSAP and Motion. Some components add WebGL shaders through OGL or three.js.
- A live preview, the full source, and prop controls for every component in the [component studio](https://ui.devclubxnst.online/components).
- A CLI and a shadcn-compatible registry that copy the source into your codebase and install its dependencies.

## Quick start

You need a React project with Tailwind CSS and the `@/` import alias. The [installation guide](https://ui.devclubxnst.online/docs/installation) covers setup and manual installation.

Add a component:

```sh
npx @devclubnst/ui@latest add dither
```

The CLI writes the component into your UI directory and installs its dependencies with your package manager. If `components.json` sets `aliases.ui` to an `@/` path, it uses that. Otherwise it picks `src/components/ui` or `components/ui`.

Then import it like any other file in your project:

```tsx
import { Dither } from "@/components/ui/dither";

export default function Hero() {
  return (
    <section className="relative h-[480px] overflow-hidden rounded-3xl">
      <Dither className="absolute inset-0" />
      <h1 className="relative p-12 text-5xl text-white">Ship something that moves.</h1>
    </section>
  );
}
```

Add several at once, list everything, or get help:

```sh
npx @devclubnst/ui@latest add orbit-gallery morph-search mac-switch
npx @devclubnst/ui@latest list
npx @devclubnst/ui@latest --help
```

The CLI works with `pnpm dlx` and `bunx` as well.

### With the shadcn CLI

Projects already set up for shadcn can install straight from the public registry:

```sh
npx shadcn@latest add https://ui.devclubxnst.online/r/dither.json
```

The [registry docs](https://ui.devclubxnst.online/docs/registry) describe the catalog and the component JSON format.

## Components

| Category | Components |
| --- | --- |
| Buttons & actions | [Animated Button](https://ui.devclubxnst.online/components/animated-button) · [ASCII Hover Button](https://ui.devclubxnst.online/components/ascii-hover-button) · [Candy Button](https://ui.devclubxnst.online/components/candy-button) · [Confirm Morph](https://ui.devclubxnst.online/components/confirm-morph) · [Sparkle Button](https://ui.devclubxnst.online/components/sparkle-button) |
| Inputs & forms | [File Dropzone](https://ui.devclubxnst.online/components/file-dropzone) · [File Upload](https://ui.devclubxnst.online/components/file-upload) · [Morph Invite](https://ui.devclubxnst.online/components/morph-invite) · [OTP Input](https://ui.devclubxnst.online/components/otp-input) |
| Search & commands | [Morph Search](https://ui.devclubxnst.online/components/morph-search) · [Search Input](https://ui.devclubxnst.online/components/search-input) · [Spotlight Search](https://ui.devclubxnst.online/components/spotlight-search) |
| Navbar | [Curtain Navbar](https://ui.devclubxnst.online/components/curtain-navbar) · [Curved Navbar](https://ui.devclubxnst.online/components/curved-navbar) · [Fullscreen Navbar](https://ui.devclubxnst.online/components/fullscreen-navbar) |
| Navigation | [File Tree](https://ui.devclubxnst.online/components/file-tree) · [Gooey Nav](https://ui.devclubxnst.online/components/gooey-nav) · [Hook Sidebar](https://ui.devclubxnst.online/components/hook-sidebar) · [Proximity Sidebar](https://ui.devclubxnst.online/components/proximity-sidebar) |
| Sliders & toggles | [Liquid Toggle](https://ui.devclubxnst.online/components/liquid-toggle) · [Mac Slider](https://ui.devclubxnst.online/components/mac-slider) · [Mac Switch](https://ui.devclubxnst.online/components/mac-switch) · [Slider](https://ui.devclubxnst.online/components/slider) · [Theme Toggle](https://ui.devclubxnst.online/components/theme-toggle) |
| Menus & overlays | [Profile Menu](https://ui.devclubxnst.online/components/profile-menu) · [Reveal Sheet](https://ui.devclubxnst.online/components/reveal-sheet) |
| Cards & testimonials | [Focus Testimonials](https://ui.devclubxnst.online/components/focus-testimonials) · [Pixel Card](https://ui.devclubxnst.online/components/pixel-card) · [Scrolling Cards](https://ui.devclubxnst.online/components/scrolling-cards) · [Task Card](https://ui.devclubxnst.online/components/task-card) · [Twitter(X) Card](https://ui.devclubxnst.online/components/twitter-card) |
| Galleries & media | [Liquid Media](https://ui.devclubxnst.online/components/liquid-media) · [Orbit Gallery](https://ui.devclubxnst.online/components/orbit-gallery) · [Project Reveal](https://ui.devclubxnst.online/components/project-reveal) |
| Page Transitions | [Parallax Strip Transition](https://ui.devclubxnst.online/components/parallax-strip-transition) |
| AI & editors | [AI Input](https://ui.devclubxnst.online/components/ai-input) · [AI Orb](https://ui.devclubxnst.online/components/ai-orb) · [Selection AI Editor](https://ui.devclubxnst.online/components/editor) · [Thinking Orb](https://ui.devclubxnst.online/components/orb) |
| Data & display | [Animated Counter](https://ui.devclubxnst.online/components/animated-counter) · [Code Block](https://ui.devclubxnst.online/components/code-block) · [GitHub Activity](https://ui.devclubxnst.online/components/github-activity) · [Scales & Borders](https://ui.devclubxnst.online/components/scales) · [Task List](https://ui.devclubxnst.online/components/task-list) |
| Backgrounds & effects | [Dither](https://ui.devclubxnst.online/components/dither) · [Noise Background](https://ui.devclubxnst.online/components/noise) |
| Feedback & progress | [Segmented Progress](https://ui.devclubxnst.online/components/segmented-progress) · [Stepper](https://ui.devclubxnst.online/components/stepper) · [Toast](https://ui.devclubxnst.online/components/toast) |
| Loaders | [Cursor Trail Loader](https://ui.devclubxnst.online/components/cursor-trail-loader) · [Grid Image Loader](https://ui.devclubxnst.online/components/grid-image-loader) · [Image Loader](https://ui.devclubxnst.online/components/image-loader) · [Loader](https://ui.devclubxnst.online/components/loader) |
| Accordions | [Blur Reveal Accordion](https://ui.devclubxnst.online/components/accordion) · [Dotted Accordion](https://ui.devclubxnst.online/components/dotted-accordion) · [Smooth Accordion](https://ui.devclubxnst.online/components/smooth-accordion) |
| Clocks & timers | [Flip Clock](https://ui.devclubxnst.online/components/flip-clock) · [Matrix Clock](https://ui.devclubxnst.online/components/matrix-clock) |
| Date & time | [Date Range Picker](https://ui.devclubxnst.online/components/date-range-picker) |

## Documentation

| Resource | What's there |
| --- | --- |
| [Component studio](https://ui.devclubxnst.online/components) | Live previews, props, and source for every component |
| [Installation](https://ui.devclubxnst.online/docs/installation) | Setup with the CLI or by copying source |
| [Theming](https://ui.devclubxnst.online/docs/theming) | Matching components to your design tokens |
| [CLI](https://ui.devclubxnst.online/docs/cli) | Every command and flag |
| [Registry](https://ui.devclubxnst.online/docs/registry) | The shadcn-compatible catalog format |
| [Skills](https://ui.devclubxnst.online/docs/skills) | GSAP guidance for AI coding agents working on this repo |

## Contributing

We want contributions: new components, bug fixes, accessibility work, and docs. Start with [CONTRIBUTING.md](CONTRIBUTING.md). Issues labelled [`good first issue`](https://github.com/devclub-nstru/component_library/labels/good%20first%20issue) are a good place to begin.

How a change gets in:

1. Fork the repo and branch from `main`.
2. Open a PR to `main` with a [Conventional Commit](https://www.conventionalcommits.org/) title, for example `feat(dither): add grain intensity prop`.
3. CI runs lint, typecheck, two builds, CodeQL, dependency review, and a supply-chain check that confirms the published registry matches the source.
4. A bot labels the PR by size, from `size/xs` to `size/excess`. Smaller PRs get reviewed faster, and `excess` PRs get asked to split.
5. One code owner approves and the PR is squash-merged.

### Local development

Use Node.js 20.9 or newer, and npm.

```sh
git clone https://github.com/devclub-nstru/component_library.git
cd component_library
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). Before pushing, run the same checks as CI:

```sh
npm run lint
npm run typecheck
npm run build
npm run check:lockfile
```

If you change component source or registry metadata, run `npm run registry:sync` and commit the regenerated files in `public/r/`.

## Security

Report vulnerabilities privately through [GitHub security advisories](https://github.com/devclub-nstru/component_library/security/advisories/new), not in a public issue. [SECURITY.md](SECURITY.md) covers what's in scope, response times, and the supply-chain protections on this repo.

## Support

Ask questions and share ideas in [issues](https://github.com/devclub-nstru/component_library/issues) or on the [community page](https://ui.devclubxnst.online/docs/community). Release notes are on [GitHub releases](https://github.com/devclub-nstru/component_library/releases), and published versions are on [npm](https://www.npmjs.com/package/@devclubnst/ui?activeTab=versions). You can also email [softwaredevg.club@rishihood.edu.in](mailto:softwaredevg.club@rishihood.edu.in).

## License

[MIT](LICENSE). Built by DevClub. Dependencies keep their own licenses.
