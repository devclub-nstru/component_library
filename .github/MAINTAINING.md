# Maintaining DevClub UI

This is the rulebook for people with write access. Contributors should read [CONTRIBUTING.md](../CONTRIBUTING.md) instead. The full list of roles and who holds access to the repo, npm and hosting is in [GOVERNANCE.md](../GOVERNANCE.md).

## Roles

| Role | Who | Can do |
| --- | --- | --- |
| Code owners | @Yash121l, @AdityaInnovates, @kevish-dev, @PiyushY111, @3ncryptor (see [CODEOWNERS](CODEOWNERS)) | Approve PRs. One code-owner approval is needed to merge. |
| Release manager | @Yash121l, through the `component-library-admins` team | Bypass `main` rules when merging a PR, update the `release` branch, move or delete `v*` tags |

Everyone else, including other org owners, follows the rules. Org owners can still edit rulesets, so any ruleset change has to be agreed in an issue first and then committed to [`rulesets/`](rulesets) in a PR.

## Branches

- `main` is the only development branch. Every PR targets it.
- `release` marks what's been released. It only moves forward, to commits that are already on `main`.
- There are no long-lived feature or staging branches. Branches are deleted automatically after merge.

## Cutting a release

1. Open a PR to `main` that bumps `version` in `package.json` and `package-lock.json` (`npm version 2.3.0 --no-git-tag-version`) and moves the `[Unreleased]` entries in [CHANGELOG.md](../CHANGELOG.md) under the new version, including a `Security` section. Title it `chore(release): 2.3.0`. Get it reviewed and merged like any other PR.
2. Once CI is green on `main`, fast-forward `release`:

   ```bash
   git fetch origin
   git push origin origin/main:release
   ```

3. The [Publish Release](workflows/publish-release.yml) workflow checks that `release` points at a commit on `main` and that the tag doesn't exist yet, so a release without a version bump can't overwrite an old one. It packs the npm tarball, writes `SHA256SUMS`, creates a Sigstore-signed build provenance attestation, then creates the `v<version>` tag and a GitHub release. The release notes link to the changelog, followed by notes generated from PR labels ([release.yml](release.yml)), and the tarball and `SHA256SUMS` are attached.
4. Publish the attested tarball to npm, not a local build, so npm and GitHub serve the same bytes:

   ```bash
   gh release download v2.3.0 -R devclub-nstru/component_library -p '*.tgz' -p SHA256SUMS
   sha256sum -c SHA256SUMS
   gh attestation verify devclubnst-ui-2.3.0.tgz --repo devclub-nstru/component_library
   npm publish devclubnst-ui-2.3.0.tgz
   ```

   The next step is publishing from the workflow with [npm trusted publishing](https://docs.npmjs.com/trusted-publishers), which adds npm provenance and removes manual publishing. It needs an npm owner to add the workflow as a trusted publisher.

## Deploying the site

Every merge to `main` deploys `https://ui.devclubxnst.com` through the [Deploy](workflows/deploy.yml) workflow. Nothing needs doing by hand. To roll back, run **Actions > Deploy > Run workflow** on `main` with `image-tag` set to the commit SHA of a good earlier deploy. Server setup, the `production` environment secrets, nginx and day-to-day commands are in [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md).

## Reviewing pull requests

- Read the diff before approving the workflow run on a first-time contributor's PR. Approving runs their code on our runners.
- Pay extra attention to `.github/`, `bin/`, `scripts/`, `Dockerfile`, `package.json`, `package-lock.json`, `.npmrc`, and `public/r/`. A one-line change to any of these can affect every user.
- For new dependencies, check who publishes the package, its download history, whether it has install scripts, and whether the maintainers look real. Make the contributor justify it in an issue first.
- For `public/r/` changes, make sure CI's "Supply chain integrity" job passed. It proves the JSON matches the reviewed source.
- Don't check out a contributor's branch and run `npm install` on your machine without reading `package.json` and the lockfile diff first.
- Ask for an `excess` PR to be split rather than reviewing it.
- Squash-merge, and make sure the squash title is the Conventional Commit PR title.

## Labels

| Label | Applied by | Meaning |
| --- | --- | --- |
| `size/*` | [PR Triage](workflows/pr-labeler.yml) | Changed lines, excluding generated files |
| `area/*` | [PR Triage](workflows/pr-labeler.yml) | Which part of the repo changed ([labeler.yml](labeler.yml)) |
| `dependencies` | Dependabot | Dependency update |
| `skip-changelog` | Maintainers | Leave out of release notes |
| `stale` | [Stale Triage](workflows/stale.yml) | No activity for 60 days. Closed after 7 more. |

## Dependency updates

Dependabot skips two kinds of major update on purpose:

- `@types/node` stays on the major of the oldest Node version we support (20). Newer types allow APIs that crash on Node 20.
- `eslint` stays on 9 until `eslint-config-next` and its plugins support 10.
- The `node` base image in the [Dockerfile](../Dockerfile) stays on 22 to match the Node version CI tests. Dependabot still updates its digest. Move it to the next LTS together with CI's Node matrix.

Lift an ignore in `dependabot.yml` when its reason no longer holds.

## Required checks on `main`

Lint, Typecheck, Test, Supply chain integrity, Build (Node 20.x), Build (Node 22.x), Container image, Dependency review, Conventional PR title, DCO, and Analyze for both CodeQL languages. GitHub only accepts each check from the GitHub Actions app, so a commit status posted through the API can't satisfy it. Merging is also blocked while CodeQL has open alerts of high severity or above.

If you rename a job, update [rulesets/main.json](rulesets/main.json) and re-apply it in the same PR. Otherwise every PR waits forever on a check that no longer exists.

## Repository settings

The rulesets in [`rulesets/`](rulesets) are the source of truth. To re-apply one:

```bash
id=$(gh api repos/devclub-nstru/component_library/rulesets --jq '.[] | select(.name=="main") | .id')
gh api -X PUT repos/devclub-nstru/component_library/rulesets/$id --input .github/rulesets/main.json
```

Settings that live outside the rulesets:

| Setting | Value |
| --- | --- |
| Merge methods | Squash only, title from PR title, body from PR description |
| Delete branch on merge | On |
| Suggest updating PR branches | On |
| Default `GITHUB_TOKEN` permissions | Read-only, cannot approve PRs |
| Actions must be pinned to a full SHA | On |
| Fork PR workflows need approval | All outside collaborators |
| Secret scanning and push protection | On |
| Private vulnerability reporting | On |
| Require sign off on web-based commits | On |
| `production` environment | Deploys from `main` only. Holds the VPS secrets ([docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md#4-configure-github)). |
| Dependabot alerts and security updates | On |

## If something goes wrong

- **A secret was pushed.** Revoke it at the provider first, then remove it from history. Rotating it matters more than rewriting history.
- **A malicious PR was merged.** Revert it on `main` right away, and don't move `release`. If it reached a release, publish a patched version, deprecate the bad one with `npm deprecate`, and open a GitHub security advisory.
- **A maintainer account is compromised.** An org owner removes it from the org, then audits recent pushes, ruleset changes, and workflow runs in the org audit log.
