# Dependencies

There are two kinds of dependency in this project:

- **Repository dependencies** in [package.json](../package.json) build and run the docs site, the registry generator and the tests.
- **Component dependencies** are the npm packages listed in each registry item's `dependencies` array, for example [public/r/access-request.json](../public/r/access-request.json). The CLI and the shadcn CLI install these into the user's app when they add a component. A component dependency therefore becomes a dependency of every app that installs that component.

[bin/cli.mjs](../bin/cli.mjs) uses only Node.js built-ins. The published `@devclubnst/ui` package still declares the docs site's packages as `dependencies`, so `npx @devclubnst/ui` downloads them too. Moving them to `devDependencies` is tracked in [docs/SECURITY_ASSESSMENT.md](SECURITY_ASSESSMENT.md#residual-risks).

## How we select a dependency

A new dependency needs an issue first, explaining why existing dependencies or a few lines of code won't do. Reviewers check:

| Check | What we look for |
| --- | --- |
| Need | The package does something we can't reasonably write and maintain ourselves. We prefer packages already in the tree, such as `gsap`, `motion`, `clsx` and `tailwind-merge`. |
| License | MIT-compatible. Dependency Review fails PRs that add GPL, AGPL or SSPL packages. |
| Maintenance | Recent releases, more than one maintainer or an organization behind it, issues getting answers. |
| Publisher | Real maintainers, a download history that matches its age, a repository link that resolves, no recent ownership transfer. |
| Install scripts | None, unless a maintainer signs off. `.npmrc` sets `ignore-scripts=true`. |
| Size | Small enough to ship in client components. |
| Security | No open advisories. Dependency Review fails PRs on moderate or worse, and shows the package's OpenSSF Scorecard. |

## How we obtain dependencies

- npm is the only package manager. [package-lock.json](../package-lock.json) pins every package to an exact version and `sha512` integrity hash.
- Developers and CI install with `npm ci`, which installs exactly what the lockfile says and fails if `package.json` and the lockfile disagree. CI and the [Dockerfile](../Dockerfile) also pass `--ignore-scripts`.
- [scripts/check-lockfile.mjs](../scripts/check-lockfile.mjs) (`npm run check:lockfile`) fails if any lockfile entry resolves outside `https://registry.npmjs.org/`, lacks a `sha512` hash, or has a URL that doesn't match its package name.
- No workflow downloads code with `curl`, `wget` or `| sh`. GitHub Actions are pinned to full commit SHAs, and the repository rejects unpinned actions. The Docker base image is pinned to a digest.
- Component dependencies are installed by the user's own package manager (npm, pnpm, yarn or bun, detected from their lockfile). The CLI only passes names that match a strict package-spec pattern.

## How we track dependencies

- [.github/dependabot.yml](../.github/dependabot.yml) opens weekly PRs for npm packages, GitHub Actions and the Docker base image. Minor and patch updates are grouped. New versions wait 7 days (30 for majors) before Dependabot proposes them, so a malicious release has time to be caught. Security updates skip the wait.
- Dependabot alerts and security updates are on for the repository.
- The CI "Supply chain integrity" job runs `npm audit --omit=dev --audit-level=high` and the lockfile check on every PR and push to `main`.
- [Dependency Review](../.github/workflows/dependency-review.yml) runs on every PR.
- [OpenSSF Scorecard](../.github/workflows/scorecard.yml) runs weekly and on pushes to `main`.
- Deliberate holds are written in `dependabot.yml` with the reason in [.github/MAINTAINING.md](../.github/MAINTAINING.md#dependency-updates).

## Updating or removing a dependency

Update with `npm install <package>@<version>` and commit the `package-lock.json` change in the same PR. Never edit the lockfile by hand. When a component stops using a package, remove it from that component's metadata in `src/registry/components/` and run `npm run registry:sync`.
