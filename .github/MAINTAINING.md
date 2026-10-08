# Maintaining DevClub UI

This is the rulebook for people with write access. Contributors should read [CONTRIBUTING.md](../CONTRIBUTING.md) instead.

## Roles

| Role | Who | Can do |
| --- | --- | --- |
| Code owners | @Yash121l, @AdityaInnovates, @kevish-dev, @PiyushY111, @3ncryptor (see [CODEOWNERS](CODEOWNERS)) | Approve PRs. Two approvals are needed to merge. |
| Release manager | @Yash121l, through the `component-library-admins` team | Bypass `main` rules when merging a PR, update the `release` branch, move or delete `v*` tags |

Everyone else, including other org owners, follows the rules. Org owners can still edit rulesets, so any ruleset change has to be agreed in an issue first and then committed to [`rulesets/`](rulesets) in a PR.

## Branches

- `main` is the only development branch. Every PR targets it.
- `release` marks what's been released. It only moves forward, to commits that are already on `main`.
- There are no long-lived feature or staging branches. Branches are deleted automatically after merge.

## Cutting a release

1. Open a PR to `main` that bumps `version` in `package.json` (`chore(release): 2.2.0`). Get it reviewed and merged like any other PR.
2. Once CI is green on `main`, fast-forward `release`:

   ```bash
   git fetch origin
   git push origin origin/main:release
   ```

3. The [Publish Release](workflows/publish-release.yml) workflow checks that `release` points at a commit on `main`, creates the `v<version>` tag, and publishes a GitHub release with notes generated from PR labels ([release.yml](release.yml)). It fails if the tag already exists, so a release without a version bump can't overwrite an old one.
4. Publish to npm from a clean checkout of the tag: `git checkout v2.2.0 && npm ci --ignore-scripts && npm publish`. The next hardening step is moving this into the workflow with [npm trusted publishing](https://docs.npmjs.com/trusted-publishers), which adds provenance and removes long-lived npm tokens.

## Reviewing pull requests

- Read the diff before approving the workflow run on a first-time contributor's PR. Approving runs their code on our runners.
- Pay extra attention to `.github/`, `bin/`, `scripts/`, `package.json`, `package-lock.json`, `.npmrc`, and `public/r/`. A one-line change to any of these can affect every user.
- For new dependencies, check who publishes the package, its download history, whether it has install scripts, and whether the maintainers look real. Make the contributor justify it in an issue first.
- For `public/r/` changes, make sure CI's "Supply chain integrity" job passed. It proves the JSON matches the reviewed source.
- Don't check out a contributor's branch and run `npm install` on your machine without reading `package.json` and the lockfile diff first.
- Ask for an `excess` PR to be split rather than reviewing it.
- Squash-merge, and make sure the squash title is the Conventional Commit PR title.

## Labels

| Label | Applied by | Meaning |
| --- | --- | --- |
| `size/*` | [PR Size](workflows/pr-size.yml) | Changed lines, excluding generated files |
| `area/*` | [PR Labeler](workflows/pr-labeler.yml) | Which part of the repo changed ([labeler.yml](labeler.yml)) |
| `dependencies` | Dependabot | Dependency update |
| `skip-changelog` | Maintainers | Leave out of release notes |
| `stale` | [Stale Triage](workflows/stale.yml) | No activity for 60 days. Closed after 7 more. |

## Required checks on `main`

Lint, Typecheck, Supply chain integrity, Build (Node 20.x), Build (Node 22.x), Dependency review, Conventional PR title, and Analyze for both CodeQL languages. GitHub only accepts each check from the GitHub Actions app, so a commit status posted through the API can't satisfy it. Merging is also blocked while CodeQL has open alerts of high severity or above.

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
| Dependabot alerts and security updates | On |

## If something goes wrong

- **A secret was pushed.** Revoke it at the provider first, then remove it from history. Rotating it matters more than rewriting history.
- **A malicious PR was merged.** Revert it on `main` right away, and don't move `release`. If it reached a release, publish a patched version, deprecate the bad one with `npm deprecate`, and open a GitHub security advisory.
- **A maintainer account is compromised.** An org owner removes it from the org, then audits recent pushes, ruleset changes, and workflow runs in the org audit log.
