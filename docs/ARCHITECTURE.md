# Architecture

DevClub UI ships React components as source code. Nothing is compiled into a library. A developer copies a component's files into their own app, either with the `@devclubnst/ui` CLI or with the shadcn CLI, and owns the code from then on. This document shows every component of the project, every actor, the actions each actor takes, and the trust boundaries between them. External interfaces are specified in [INTERFACES.md](INTERFACES.md), and the threats to each flow are in [SECURITY_ASSESSMENT.md](SECURITY_ASSESSMENT.md).

## Components

| Component | Location | What it does |
| --- | --- | --- |
| Component source | `src/registry/ui/`, `src/lib/` | The `.tsx` and `.ts` files that end up in users' apps |
| Component metadata | `src/registry/components/*.json` | Name, dependencies, props and docs content for each component |
| Registry generator | [scripts/sync-registry.mjs](../scripts/sync-registry.mjs) | Inlines source into shadcn registry items. Writes `public/r/*.json`, `registry.json` and the npm-only `r/` directory. |
| Published registry | `public/r/*.json`, `registry.json` | Static JSON served at `https://ui.devclubxnst.com/r/` and bundled in the npm package |
| CLI | [bin/cli.mjs](../bin/cli.mjs) | `npx @devclubnst/ui add` and `list`. Reads the registry JSON bundled with the package. It makes no HTTP requests of its own. |
| Docs site | `src/app/` (Next.js App Router) | Component studio, docs pages and a read-only JSON API. Hosted on Vercel at `https://ui.devclubxnst.com`. |
| CI/CD | [.github/workflows/](../.github/workflows) | Lint, typecheck, tests, builds, CodeQL, Scorecard, dependency review, DCO and the release workflow |

## Actors

| Actor | Trust | Actions |
| --- | --- | --- |
| Contributor | Untrusted | Opens issues and PRs from a fork. Their code runs in CI only after a maintainer approves the run, and only with a read-only token. |
| Code owner | Trusted | Reviews and approves PRs. One approval is needed to merge into `main`. |
| Release manager (`component-library-admins`) | Trusted | Fast-forwards `release` to a commit on `main`, which triggers the release workflow |
| npm publisher | Trusted | Runs `npm publish` for `@devclubnst/ui`. Listed in [GOVERNANCE.md](../GOVERNANCE.md). |
| GitHub Actions | Trusted, scoped | Runs workflows with a read-only `GITHUB_TOKEN` by default. Write scopes are granted per job. |
| Dependabot | Semi-trusted | Opens dependency update PRs, which go through the same review and checks |
| Vercel | Trusted third party | Builds `main` and preview branches and serves the site and `/r/*.json` |
| npm registry | Trusted third party | Hosts `@devclubnst/ui` and every dependency |
| Developer (consumer) | User | Runs the CLI or shadcn CLI in their own project and reviews the copied code |
| shadcn CLI | Third-party tool | Fetches `/r/<name>.json` over HTTPS and writes files. Our CLI also calls it to add shadcn primitives such as `avatar`. |
| Site visitor | Untrusted | Browses the docs site. |
| GitHub API | Third-party service | `/api/github/stars` reads the star count from the GitHub API. |

## Flows

```mermaid
flowchart LR
  subgraph GH["GitHub: devclub-nstru/component_library"]
    PR["Pull request"] --> CI["CI: lint, typecheck, test, build,<br/>CodeQL, DCO, supply chain"]
    CI --> Review["Code-owner review"]
    Review --> Main[("main<br/>ruleset protected")]
    Main --> Release[("release branch")]
    Release --> RW["Publish Release workflow"]
    RW --> GHR["GitHub release v*<br/>tarball, SHA256SUMS,<br/>provenance attestation"]
  end

  Contributor(["Contributor"]) --> PR
  Owner(["Code owner"]) --> Review
  RM(["Release manager"]) --> Release

  subgraph Vercel["Vercel"]
    Site["Docs site + /api/*"]
    Static["/r/*.json"]
  end
  Main --> Site
  Main --> Static

  subgraph NPM["npm registry"]
    Pkg["@devclubnst/ui"]
    Deps["Component dependencies"]
  end
  Publisher(["npm publisher"]) -- "npm publish from tag" --> Pkg
  GHR -. "same tarball, checked by hash" .- Pkg

  subgraph Dev["Developer machine"]
    CLI["npx @devclubnst/ui add"]
    Shadcn["npx shadcn add"]
    App["Developer's app source"]
  end
  Pkg --> CLI
  CLI -- "writes files" --> App
  CLI -- "npm/pnpm/yarn/bun add" --> Deps
  CLI -- "shadcn primitives" --> Shadcn
  Static -- "HTTPS" --> Shadcn
  Shadcn -- "writes files" --> App

  Visitor(["Site visitor"]) --> Site
  Site -- "stars" --> GHAPI[("GitHub API")]
```

### Change flow

1. A contributor opens a PR against `main`. The PR title must be a Conventional Commit, and every commit must have a DCO sign-off.
2. If the contributor is outside the org, a maintainer approves the workflow run. CI then runs on `pull_request` with a read-only token. Workflows on `pull_request_target` (labeling, title check, greeting) use only the GitHub API and never check out PR code.
3. A code owner approves. The `main` ruleset requires that approval, the 11 required checks, resolved threads, signed commits and an up-to-date branch. The PR is squash-merged.
4. Vercel deploys `main`, which updates the site and `/r/*.json`.

### Release flow

1. A PR bumps `version` in `package.json` and moves `[Unreleased]` in [CHANGELOG.md](../CHANGELOG.md) under the new version.
2. A release manager fast-forwards `release` to that commit on `main`.
3. [publish-release.yml](../.github/workflows/publish-release.yml) checks that `release` is on `main` and that the tag doesn't exist yet. It packs the npm tarball, writes `SHA256SUMS`, signs a build provenance attestation with Sigstore, then creates the `v<version>` tag and GitHub release with those files attached.
4. An npm publisher publishes the same version from a clean checkout of the tag.

### Install flows

- **`@devclubnst/ui` CLI.** `npx` downloads the package from npm. The CLI reads `components.json` to find the target directories, resolves the requested items and their DevClub dependencies from the bundled `public/r/`, and validates every dependency name. It refuses to write outside the UI and lib directories, writes files without overwriting unless `--overwrite` is given, and appends missing CSS variables to the Tailwind CSS file. Finally it runs the project's package manager to install npm dependencies, and `npx shadcn@latest add` for missing shadcn primitives.
- **shadcn CLI.** `npx shadcn add https://ui.devclubxnst.com/r/<name>.json` fetches the item from Vercel over HTTPS and writes it using shadcn's own logic.

## Trust boundaries

| Boundary | What crosses it | Control |
| --- | --- | --- |
| Fork to repository | PR code and metadata | Workflow approval for outside contributors, read-only tokens, no `pull_request_target` checkout, code-owner review |
| Repository to Vercel | `main` and preview builds | Vercel GitHub integration. Production builds come from `main`, and PR branches get preview deployments. |
| Repository to npm | The published tarball | Manual publish by npm maintainers. Hashes and attestations on the GitHub release let anyone compare the two. |
| npm or Vercel to developer machine | Package code, registry JSON, component source | npm integrity hashes, HTTPS, CLI validation of names and paths, developer review of copied code |
| Developer machine to package registries | Dependency installs run by the CLI | The user's own package manager and lockfile |
| Site to GitHub API | Star count | Called server-side and cached for an hour. |
