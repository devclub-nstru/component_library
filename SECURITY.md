# Security Policy

## Supported versions

We patch the latest minor release of the `@devclubnst/ui` package and the registry at `ui.devclubxnst.com/r/`.

| Version | Supported |
| ------- | --------- |
| 2.2.x   | Yes       |
| < 2.2   | No        |

Versions 2.1.2 and 2.1.3 on npm were not built from a reviewed commit. Upgrade to 2.2.0 or later.

---

## What's in scope

- Component source in `src/registry/` and the registry JSON published from `public/r/`
- The `@devclubnst/ui` CLI in `bin/cli.mjs`, which writes files and runs package-manager commands on the user's machine
- The documentation site at `ui.devclubxnst.com`
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

## Coordinated disclosure policy

We follow coordinated disclosure. Reports go through a private channel, we fix the problem, and then we publish what happened. Business days are Monday to Friday, excluding Indian public holidays.

| Step | Timeframe |
| --- | --- |
| Acknowledge your report | Within 3 business days |
| Triage: confirm or reject, and give a severity using CVSS v3.1 | Within 7 days of the report |
| Fix released for critical or high severity | Target 30 days from confirmation |
| Fix released for medium or low severity | Target 90 days from confirmation |
| Public advisory | When the fix is released, or 90 days after the report if there is no fix by then |

While we work on it:

- We keep you updated at least every 14 days in the advisory or email thread.
- Please keep the details private until the advisory is published. If we can't meet a deadline, we tell you why and agree a new date with you.
- If the issue is being exploited, we may publish early with mitigations.
- We credit you in the advisory unless you ask us not to.

## How we publish vulnerabilities

Every confirmed vulnerability is published as a GitHub Security Advisory at <https://github.com/devclub-nstru/component_library/security/advisories>, with the affected and fixed versions, severity, and credit. We request a CVE for each one through GitHub, which is a CVE Numbering Authority. The fix is also listed under `Security` in [CHANGELOG.md](CHANGELOG.md) with a link to the advisory, and the affected npm versions get an `npm deprecate` notice that points to the fixed version.

No vulnerabilities have been reported so far, so the advisories page is empty.

---

## How we protect the supply chain

- `main` only changes through pull requests with a code-owner approval and passing CI. Force pushes and branch deletion are blocked.
- Releases come from the `release` branch. Only release managers can update it, and only to a commit that is already on `main`.
- Each GitHub release includes the npm tarball, a `SHA256SUMS` file and a Sigstore-signed build provenance attestation. [docs/INTERFACES.md](docs/INTERFACES.md#2-npm-package) shows how to verify them.
- CI checks that every lockfile entry resolves to the npm registry with a `sha512` hash, fails on high-severity advisories in production dependencies, and verifies that the published registry files match the reviewed source.
- GitHub Actions are pinned to commit SHAs. Workflows run with read-only tokens by default, and runs on PRs from outside collaborators need a maintainer's approval.
- CodeQL, OpenSSF Scorecard, Dependency Review, secret scanning with push protection, and Dependabot security updates are enabled.
- The CLI rejects registry entries whose dependency names contain shell syntax, refuses to write files outside the configured component and lib directories, and won't overwrite through a symbolic link.
- Every commit in a pull request needs a DCO `Signed-off-by` line.

The full threat model, including known residual risks, is in [docs/SECURITY_ASSESSMENT.md](docs/SECURITY_ASSESSMENT.md).

---

## Security practices for adopters

When integrating DevClub UI components into your Next.js application:

- **Sanitize Dynamic Code Content**: When passing raw code strings to `<CodeBlock />`, ensure input originates from trusted sources or is pre-sanitized.
- **Keep Dependencies Updated**: Regularly update `@gsap/react`, `gsap`, `ogl`, `motion`, and `next` to receive upstream performance and safety patches.
- **Content Security Policy (CSP)**: If using WebGL shader components (e.g. `dither`, `ai-orb`), ensure your CSP permits inline canvas execution and WebGL context creation.
