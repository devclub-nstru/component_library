# Security Policy

## Supported Versions

DevClub UI actively maintains the latest minor version for security patches, dependency vulnerability fixes, and client-side execution safety updates.

| Version | Supported          | Security Maintenance |
| ------- | ------------------ | -------------------- |
| 0.1.x   | :white_check_mark: | Active               |
| < 0.1.0 | :x:                | End of Life          |

---

## Reporting a Vulnerability

We take the security of **DevClub UI** seriously. If you discover a security vulnerability, potential cross-site scripting (XSS) risk in component props, prototype pollution, or dependency exposure, please report it responsibly.

### How to Submit a Report

**Please DO NOT open a public GitHub issue for security vulnerabilities.**

Instead, report vulnerabilities through one of the following official channels:

1. **GitHub Private Security Advisory**: Submit a report directly via our repository's [Security Advisories](https://github.com/Heyykrishnna/dev-club-components/security/advisories/new) tab.
2. **Security Email**: Send an encrypted or plain text email to `security@devclub.co`.

### What to Include in Your Report

To help us triage and resolve the issue quickly, please include as much detail as possible:

- **Description**: A clear summary of the vulnerability.
- **Component / Module**: The affected component slug (e.g. `dither`, `ai-orb`, `code-block`, `otp-input`) or API route.
- **Reproduction Steps**: A minimal reproducible snippet or step-by-step instructions.
- **Impact**: Potential consequences (e.g. DOM injection, client-side denial of service, memory leak).
- **Suggested Fix**: Optional mitigation recommendations or pull request patch ideas.

---

## Our Security Commitment & Response SLA

When you submit a security report:

1. **Acknowledgement**: We will acknowledge receipt of your report within **24 to 48 hours**.
2. **Assessment & Confirmation**: Our core team will evaluate the issue and confirm impact within **72 hours**.
3. **Patch & Release**: If verified, we aim to publish a patched release within **7 business days** (or sooner for critical vulnerabilities).
4. **Public Disclosure**: A public security advisory (GHSA / CVE) will be issued after the fix is published and downstream adopters have had time to update.

---

## Best Security Practices for Adopters

When integrating DevClub UI components into your Next.js application:

- **Sanitize Dynamic Code Content**: When passing raw code strings to `<CodeBlock />`, ensure input originates from trusted sources or is pre-sanitized.
- **Keep Dependencies Updated**: Regularly update `@gsap/react`, `gsap`, `ogl`, `motion`, and `next` to receive upstream performance and safety patches.
- **Content Security Policy (CSP)**: If using WebGL shader components (e.g. `dither`, `ai-orb`), ensure your CSP permits inline canvas execution and WebGL context creation.
