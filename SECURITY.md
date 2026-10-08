# Security Policy

## Supported versions

We patch the latest minor release of the `@devclubnst/ui` package and the registry at `ui.devclubxnst.online/r/`.

| Version | Supported |
| ------- | --------- |
| 2.1.x   | Yes       |
| < 2.1   | No        |

---

## What's in scope

- Component source in `src/registry/` and the registry JSON published from `public/r/`
- The `@devclubnst/ui` CLI in `bin/cli.mjs`, which writes files and runs package-manager commands on the user's machine
- The documentation site at `ui.devclubxnst.online`
- This repository's GitHub Actions workflows

Vulnerabilities in third-party dependencies belong upstream. Tell us anyway if a component exposes one in a way we can fix.

---

## Reporting a vulnerability

We take the security of **DevClub UI** seriously. If you discover a security vulnerability, potential cross-site scripting (XSS) risk in component props, prototype pollution, or dependency exposure, please report it responsibly.

### How to report

**Please DO NOT open a public GitHub issue for security vulnerabilities.**

Instead, report vulnerabilities through one of the following official channels:

1. **GitHub Private Security Advisory**: Submit a report directly via our repository's [Security Advisories](https://github.com/devclub-nstru/component_library/security/advisories/new) tab.
2. **Security Email**: Send an encrypted or plain text email to `softwaredevg.club@rishihood.edu.in`.

### What to include

To help us triage and resolve the issue quickly, please include as much detail as possible:

- **Description**: A clear summary of the vulnerability.
- **Component / Module**: The affected component slug (e.g. `dither`, `ai-orb`, `code-block`, `otp-input`) or API route.
- **Reproduction Steps**: A minimal reproducible snippet or step-by-step instructions.
- **Impact**: Potential consequences (e.g. DOM injection, client-side denial of service, memory leak).
- **Suggested Fix**: Optional mitigation recommendations or pull request patch ideas.

---

## Response times

When you submit a security report:

1. **Acknowledgement**: We will acknowledge receipt of your report within **24 to 48 hours**.
2. **Assessment & Confirmation**: Our core team will evaluate the issue and confirm impact within **72 hours**.
3. **Patch & Release**: If verified, we aim to publish a patched release within **7 business days** (or sooner for critical vulnerabilities).
4. **Public Disclosure**: A public security advisory (GHSA / CVE) will be issued after the fix is published and downstream adopters have had time to update.

---

## How we protect the supply chain

- `main` only changes through pull requests with two code-owner approvals and passing CI. Force pushes and branch deletion are blocked.
- Releases come from the `release` branch. Only one maintainer can update it, and only to a commit that is already on `main`.
- CI checks that every lockfile entry resolves to the npm registry with a `sha512` hash, fails on high-severity advisories in production dependencies, and verifies that the published registry files match the reviewed source.
- GitHub Actions are pinned to commit SHAs. Workflows run with read-only tokens by default, and runs on PRs from outside collaborators need a maintainer's approval.
- CodeQL, OpenSSF Scorecard, Dependency Review, secret scanning with push protection, and Dependabot security updates are enabled.
- The CLI rejects registry entries whose dependency names contain shell syntax and refuses to write files outside the configured component and lib directories.

---

## Security practices for adopters

When integrating DevClub UI components into your Next.js application:

- **Sanitize Dynamic Code Content**: When passing raw code strings to `<CodeBlock />`, ensure input originates from trusted sources or is pre-sanitized.
- **Keep Dependencies Updated**: Regularly update `@gsap/react`, `gsap`, `ogl`, `motion`, and `next` to receive upstream performance and safety patches.
- **Content Security Policy (CSP)**: If using WebGL shader components (e.g. `dither`, `ai-orb`), ensure your CSP permits inline canvas execution and WebGL context creation.
