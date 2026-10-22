# Changelog

All notable changes to `@devclubnst/ui` and the registry at `https://ui.devclubxnst.com/r/` are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

Each release has these sections when they apply: `Added`, `Changed`, `Fixed`, `Removed`, `Deprecated`, and `Security`. `Security` lists every fixed vulnerability with its advisory link, and also any change that alters the attack surface, such as new network access, new install-time behavior or a dependency swap for security reasons. A release with nothing to report there says `None.` so readers can tell it was checked.

Every release is tagged `v<version>` and has a [GitHub release](https://github.com/devclub-nstru/component_library/releases) with the npm tarball, a `SHA256SUMS` file and a signed build provenance attestation.

## [Unreleased]

### Changed

- The docs site and registry at `ui.devclubxnst.com` are served from a Docker container on the club's VPS instead of Vercel. Every push to `main` builds an attested image, pushes it to GHCR and deploys it with a health-checked rollback. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
- Privacy Policy version 1.2.

### Removed

- Vercel Web Analytics and Vercel Speed Insights (`@vercel/analytics`, `@vercel/speed-insights`) from the docs site.

### Security

- New attack surface: the Deploy workflow stores SSH credentials for the VPS as `production` environment secrets, readable only by deploys from `main`. Threats H1 to H4 in [docs/SECURITY_ASSESSMENT.md](docs/SECURITY_ASSESSMENT.md#production-hosting) cover it.
- The site container runs as a non-root user with a read-only root filesystem, no Linux capabilities and resource limits, bound to `127.0.0.1` behind nginx.

## [2.2.0] - 2026-10-20

This is the first release cut by the [Publish Release](.github/workflows/publish-release.yml) workflow from a tagged commit on `main`. npm versions 2.1.2 and 2.1.3 were published by hand from commits that never reached this repository, so they can't be traced to reviewed source. 2.2.0 replaces them, and the entries below cover everything merged since 2.1.1 (`cc2948f`).

### Added

- Access Request component, an avatar pill that unfolds into approve and decline rows (#110).
- Toaster component with synchronized notification cards (#105).
- Workflow Card component with a theme-synced expandable checklist (#72).
- Calendar Card component with responsive layout and event popups (#71).
- Responsive, accessible footer navigation on the docs site (#96).
- iPhone-style frame for the mobile preview in the component studio (#73).
- PostHog analytics on the docs site, proxied through `/ingest` (#84).
- `npm test` suites for the registry and the CLI (#108).
- Release assets: npm tarball, `SHA256SUMS` and a Sigstore-signed build provenance attestation on every GitHub release.
- DCO sign-off check on pull requests.

### Changed

- Docs, CLI help and registry URLs point at `ui.devclubxnst.com` (#106).
- Dependency updates for five packages, with `voice-glow` held at a compatible minor (#85, #103).

### Fixed

- Narrow-container layouts for Date Range Picker, Spotlight Search, Dotted Accordion and Gooey Nav (#86, #87, #89, #91).
- Component studio preview sizing for toasts, steppers, calendars, parallax controls and the proximity sidebar (#74, #88, #90, #93, #94, #100).
- Gallery previews for every published component (#95).

### Security

- The CLI no longer checks whether a file exists before writing it. It opens files with an exclusive-create flag, which closes the check-then-write race CodeQL reported (#107).
- `.gitignore` covers `dist/` so build output can't be committed by accident (#111).
- Releases now ship with checksums and a signed provenance attestation, so users can check that a tarball was built from this repository by GitHub Actions.

## [2.1.1] - 2026-10-10

Published to npm from `cc2948f`. Earlier versions (1.0.0 to 2.1.0) were published before this changelog existed. See the [commit history](https://github.com/devclub-nstru/component_library/commits/main) for their changes.

[Unreleased]: https://github.com/devclub-nstru/component_library/compare/v2.2.0...HEAD
[2.2.0]: https://github.com/devclub-nstru/component_library/compare/cc2948f...v2.2.0
[2.1.1]: https://github.com/devclub-nstru/component_library/tree/cc2948f
