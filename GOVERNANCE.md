# Governance

DevClub UI is maintained by DevClub (NSTxRU) under the [`devclub-nstru`](https://github.com/devclub-nstru) GitHub organization. This file says who holds which role, what each role is responsible for, and who can reach the project's sensitive resources. Day-to-day maintainer procedures are in [.github/MAINTAINING.md](.github/MAINTAINING.md).

## Roles and responsibilities

### Contributor

Anyone who opens an issue or pull request.

- Follows [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).
- Signs off every commit under the [Developer Certificate of Origin](https://developercertificate.org/) (`git commit -s`).
- Adds or updates tests for behavior changes in `bin/`, `scripts/` or the registry format.
- Reports vulnerabilities privately as described in [SECURITY.md](SECURITY.md), never in a public issue.

Contributors have no write access. Their workflow runs need a maintainer's approval.

### Reviewer (code owner)

Listed in [.github/CODEOWNERS](.github/CODEOWNERS). One code-owner approval is required to merge into `main`.

- Reviews pull requests against CONTRIBUTING.md, with extra care for `.github/`, `bin/`, `scripts/`, `package.json`, `package-lock.json`, `.npmrc` and `public/r/`.
- Reads a first-time contributor's diff before approving their workflow run.
- Asks for tests, a sign-off or a split PR when needed, and resolves review threads before approving.
- Never approves their own changes. The ruleset also blocks this: the last push needs approval from someone else.

### Maintainer

Has write access or above to the repository.

- Triages issues and pull requests and applies labels.
- Keeps dependencies current by reviewing Dependabot PRs, following [docs/DEPENDENCIES.md](docs/DEPENDENCIES.md).
- Updates [CHANGELOG.md](CHANGELOG.md) under `[Unreleased]` when merging user-facing or security-relevant changes.
- Handles security reports: acknowledges, triages, fixes and publishes advisories within the timeframes in [SECURITY.md](SECURITY.md).

### Admin and release manager

Admins have the `admin` role on the repository. Release managers are members of the `component-library-admins` team.

- Change repository settings and rulesets, but only after the change is agreed in an issue and committed to [.github/rulesets/](.github/rulesets) in a reviewed PR.
- Cut releases by fast-forwarding the `release` branch, as described in [MAINTAINING.md](.github/MAINTAINING.md#cutting-a-release).
- Publish `@devclubnst/ui` to npm from the tagged release, and keep the npm maintainer list in sync with this file.
- Add and remove people from the roles below, and remove access within 7 days of someone leaving the club.

## Who has access to sensitive resources

Checked against the GitHub API and the npm registry on 2026-10-20. Any change to this list goes through a PR that updates this file.

### GitHub repository `devclub-nstru/component_library`

| GitHub handle | Access | How it's granted | Code owner |
| --- | --- | --- | --- |
| [@Yash121l](https://github.com/Yash121l) | Admin, release manager | Org owner, `component-library-admins` team | Yes |
| [@AdityaInnovates](https://github.com/AdityaInnovates) | Admin | Org owner | Yes |
| [@kevish-dev](https://github.com/kevish-dev) | Admin | Org owner | Yes |
| [@PiyushY111](https://github.com/PiyushY111) | Admin | Org owner | Yes |
| [@3ncryptor](https://github.com/3ncryptor) | Admin | Org owner | Yes |
| [@devclubnstru](https://github.com/devclubnstru) | Admin | Org owner (shared club account) | No |
| [@Heyykrishnna](https://github.com/Heyykrishnna) | Write | Direct collaborator | No |

Everyone else in the organization has read access, which is the org's base permission. Only `component-library-admins` can bypass the `main` ruleset, and only while merging a pull request. Only that team can move the `release` branch and `v*` tags.

### npm package `@devclubnst/ui`

These npm accounts can publish new versions:

`4bhiy`, `whispered_era`, `piyushy111`, `3ncryptor`, `rajdeep-2004`, `khanakjain_`

Several of these accounts belong to people who only have read access on GitHub. Until publishing moves to npm trusted publishing from the release workflow, a release is official only if its version has a matching `v<version>` tag and GitHub release with a provenance attestation. See [docs/SECURITY_ASSESSMENT.md](docs/SECURITY_ASSESSMENT.md#npm-publishing).

### Other resources

| Resource | Who controls it |
| --- | --- |
| Production VPS serving `ui.devclubxnst.com` and `/r/*.json` | Club core team. Members with SSH access aren't listed here yet. |
| Container images at `ghcr.io/devclub-nstru/component_library` | Pushed only by the Deploy workflow. Org owners administer the package. |
| Domain `devclubxnst.com` | Club account. Members aren't listed here yet. |
| Security inbox `softwaredevg.club@rishihood.edu.in` | Club core team |
| GitHub Actions secrets | `VPS_HOST`, `VPS_USERNAME`, `VPS_SSH_KEY` and `VPS_KNOWN_HOSTS`, stored on the `production` environment and readable only by deploys from `main`. Repository admins manage them. All other workflows use only the per-run `GITHUB_TOKEN` and OIDC. |

Whoever administers each club account adds its members to this table.

## Decisions

Maintainers make decisions by consensus in issues and pull requests. When they can't agree, the org owners decide by majority. Changes to this file, rulesets, release process or security policy need approval from a code owner other than the author.
