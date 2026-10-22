# Security assessment

This is the threat model for DevClub UI as of 2026-10-20 (version 2.2.0). It covers the four places where a problem would reach users: the CLI, the registry and docs site, CI/CD, and npm publishing. Each threat has a STRIDE category, likelihood and impact, the mitigations in place, and what's left. [ARCHITECTURE.md](ARCHITECTURE.md) describes the actors and trust boundaries it refers to.

Maintainers review this document when a release changes the CLI, the registry format, a workflow or the publishing process, and at least once a year.

Likelihood and impact are `Low`, `Medium` or `High`. STRIDE categories: **S**poofing, **T**ampering, **R**epudiation, **I**nformation disclosure, **D**enial of service, **E**levation of privilege.

## What we protect

- Developers' machines and projects, where the CLI writes files and runs commands.
- Apps that ship our component code to their own users.
- The integrity of the source on `main`, the registry JSON and the npm package.

## CLI (`bin/cli.mjs`)

| # | Threat | STRIDE | Likelihood | Impact | Mitigations | Residual risk |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | Shell injection through a dependency name in a registry item, since installs run through `execSync` with a command string | E | Low | High | Every package spec must match `PACKAGE_SPEC`, and every registry dependency must match `SHADCN_ITEM`. The check runs before any file is written. Registry items come from the installed package, not the network. | The spec pattern allows `*`, which the shell treats as a glob. No item uses it today. |
| C2 | Path traversal: a registry file `target` like `@ui/../../.bashrc` writes outside the project | T | Low | High | `getDestination` resolves every path and exits if it falls outside the UI and lib directories. Lib files and files without a target use only the basename. | A component with several files can exit partway through, after earlier files were written. |
| C3 | `--overwrite` writes through a symbolic link at the destination, replacing a file outside the project | T | Low | Medium | **Fixed in 2.2.0.** Overwrites open the file with `O_NOFOLLOW`, so the CLI exits instead of following the link. Covered by `test/cli.test.mjs`. Without `--overwrite`, new files are created with `wx`, which never follows a link. | Directories in the path can still be symlinks, which is normal in monorepos. Windows has no `O_NOFOLLOW`. |
| C4 | Silent overwrite of a developer's edited component | T | Medium | Low | Existing files are skipped and listed unless `--overwrite` is passed. Exclusive-create writes leave no gap between the existence check and the write (#107). | None |
| C5 | CSS injection: `cssVars` values are appended to the user's Tailwind CSS file as they are | T | Low | Low | Values come from reviewed source in the published package, and only undeclared variables are added | A malicious value could close the block and add rules. That needs a malicious package, which is threat N1. |
| C6 | `npx shadcn@latest add` runs whatever shadcn version is current | T, E | Low | High | Runs only for shadcn primitives the project is missing, and only when `components.json` exists | We don't pin shadcn. A compromised shadcn release would run on users' machines. |
| C7 | Network tampering with registry JSON during `add` | T | Low | High | The CLI makes no HTTP requests. It reads the JSON bundled in the npm tarball, which npm checks against its `sha512` integrity hash. | Only the shadcn CLI install path fetches over the network, and it uses HTTPS. |
| C8 | A typosquatted package with a name close to `@devclubnst/ui` | S | Medium | High | The docs and README give exact commands to copy | We can't stop other people registering similar names |

## Registry and docs site

| # | Threat | STRIDE | Likelihood | Impact | Mitigations | Residual risk |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | A PR changes `public/r/*.json` so the published registry differs from the reviewed source | T | Medium | High | The CI "Supply chain integrity" job regenerates the registry and fails if anything differs. `test/registry.test.mjs` checks every payload against its source. | None while the check is required |
| R2 | Malicious or unsafe component code is merged, for example XSS through `dangerouslySetInnerHTML` | T, E | Low | High | Code-owner review, CodeQL (`security-extended`) as a required check, the code rules in CONTRIBUTING.md, signed commits | Review can miss subtle code. Users copy source they can read, which limits how hidden it can be. |
| R3 | Someone with Vercel access deploys a registry that doesn't match `main` | T | Low | High | Production deploys come from `main` through the Vercel GitHub integration | Vercel team membership isn't listed in [GOVERNANCE.md](../GOVERNANCE.md) yet |
| R4 | Abuse of the read-only API (`/api/components`, `/api/health`, `/api/github/stars`) | D, I | Low | Low | No authentication, secrets or writes. Responses are JSON. The stars call is cached for an hour. Vercel applies platform limits. | Error messages echo the requested slug inside JSON |

## CI/CD

| # | Threat | STRIDE | Likelihood | Impact | Mitigations | Residual risk |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | A fork PR runs code with write tokens or secrets ("pwn request") | E | Low | High | Untrusted code runs only on `pull_request` with a read-only token. The three `pull_request_target` workflows never check out PR code. Outside contributors' runs need approval. No Actions secrets are stored. | None known |
| P2 | Script injection through PR titles, branch names or bodies | E | Low | High | No `${{ }}` expression with untrusted data appears in a `run:` or `script:` block. Values go through `env:`. zizmor audits every workflow change. | None known |
| P3 | A compromised third-party action | T | Low | High | Every action is pinned to a full SHA (repository setting), only allow-listed actions can run, and Dependabot waits 7 days before proposing action updates | A pinned SHA can still contain a bug or backdoor that was there when it was pinned |
| P4 | A direct push or force push to `main` or `release` | T | Low | High | The `main`, `release` and `release tags` rulesets block it. Only `component-library-admins` can move `release`, and only to a commit already on `main`. | Org owners can edit rulesets |
| P5 | A maintainer account is taken over | S, E | Medium | High | Rulesets need a second person's approval for every change to `main`, and commits must be signed | The organization doesn't require two-factor authentication yet (**Settings > Authentication security**) |
| P6 | A release is changed after it's published | T, R | Low | High | The release workflow refuses to reuse a tag. `v*` tags can't be updated or deleted except by the admins team. Release assets carry a Sigstore-signed provenance attestation. | None known |

## npm publishing

| # | Threat | STRIDE | Likelihood | Impact | Mitigations | Residual risk |
| --- | --- | --- | --- | --- | --- | --- |
| N1 | An npm version contains code that never went through review | T, R | Medium | High | From 2.2.0 the release workflow builds the tarball from the tagged commit and attaches it with `SHA256SUMS` and a provenance attestation, and publishers publish that exact file | **Found in this review:** npm 2.1.2 and 2.1.3 list `gitHead` commits (`c8db9a9`, `dff7b268`) that don't exist in this repository. Publishing is still manual. |
| N2 | One of the six npm publisher accounts is compromised | S, E | Medium | High | npm account security is up to each publisher | Several publishers have only read access on GitHub, so npm is the weakest point in the supply chain |
| N3 | `npx @devclubnst/ui` installs much more than the CLI needs | T | Medium | Medium | `ignore-scripts=true` applies only in this repository, not on users' machines | `package.json` lists the docs site's packages (Next.js, three and others) as `dependencies`, so every CLI user downloads them |

## Planned fixes for npm publishing

These need an npm owner of `@devclubnst/ui`. In order:

1. Configure [npm trusted publishing](https://docs.npmjs.com/trusted-publishers) for `devclub-nstru/component_library` and `publish-release.yml`, then publish from the workflow with provenance. That removes manual publishing.
2. Cut the npm maintainer list down to the release managers in [GOVERNANCE.md](../GOVERNANCE.md), and require two-factor authentication for publishing (`npm access set mfa=publish @devclubnst/ui`).
3. Deprecate 2.1.2 and 2.1.3 with a pointer to 2.2.0 (`npm deprecate @devclubnst/ui@"2.1.2 - 2.1.3" "Not built from a reviewed commit. Use 2.2.0 or later."`).

## Residual risks

Ranked by what we'd fix first:

1. Manual npm publishing by six accounts, and versions that can't be traced to source (N1, N2).
2. No organization-wide two-factor requirement (P5).
3. Docs site packages declared as runtime `dependencies` of the CLI package (N3). Moving them to `devDependencies` needs a check that Vercel builds still install them.
4. Unpinned `npx shadcn@latest` (C6).
5. `*` allowed in package specs, and partial writes when a path check fails (C1, C2).
