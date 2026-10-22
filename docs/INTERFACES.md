# External interfaces

These are all the interfaces DevClub UI exposes to other software: the `@devclubnst/ui` CLI, the npm package, the registry JSON, the docs site's HTTP API, and the component props in copied source. Any change to them is a user-facing change and goes in [CHANGELOG.md](../CHANGELOG.md). [ARCHITECTURE.md](ARCHITECTURE.md) shows how they fit together.

## 1. CLI: `@devclubnst/ui`

Source: [bin/cli.mjs](../bin/cli.mjs). It uses only Node.js built-ins, and CI tests it on Node 22. The package registers the same script under four bin names: `@devclubnst/ui`, `devclub`, `devclubnst` and `ui`.

### Commands

| Command | What it does |
| --- | --- |
| `npx @devclubnst/ui` (no arguments), `--help`, `-h` | Prints usage |
| `npx @devclubnst/ui list` | Prints every component name and title from the bundled `public/r/registry.json` |
| `npx @devclubnst/ui add <component...> [--overwrite \| -o]` | Copies the components and their DevClub dependencies into the current project, then installs their npm dependencies |

`add` accepts one or more names. It strips an `@devclubnst/` prefix and a `.json` suffix, so `add @devclubnst/noise.json` is the same as `add noise`. Each name must match `^[a-z0-9-]+$` and exist as `public/r/<name>.json` in the installed package. `--overwrite` (`-o`) is the only option.

### What `add` reads and writes

| Input | Use |
| --- | --- |
| `./components.json` | Optional shadcn config. Uses `aliases.ui`, `aliases.lib` and `tailwind.css`. An unreadable or invalid file counts as missing. |
| Lockfile in the current directory | Picks the package manager: `pnpm-lock.yaml` means pnpm, `bun.lockb` or `bun.lock` means bun, `yarn.lock` means yarn, otherwise npm |

The UI directory is `aliases.ui` when it starts with `@/` (resolved under `src/` if `src/` exists). Otherwise it's the first existing directory of `src/components/ui` and `components/ui`, and failing both, `src/components/ui` if `src/` exists or else `components/ui`. The lib directory is `aliases.lib`, or `@/lib` resolved the same way.

| Registry file | Destination |
| --- | --- |
| `type: "registry:lib"` | `<lib dir>/<basename of path>` |
| `target` starting with `@ui/` | `<ui dir>/<rest of target>` |
| Anything else | `<ui dir>/<basename of target or path>` |

The CLI exits with an error if a destination falls outside both directories. It creates new files with an exclusive-create flag. It skips existing files and lists them, unless `--overwrite` is set. CSS variables from an item's `cssVars` that aren't already declared go at the end of the `tailwind.css` file, in `:root`, `.dark` and `@theme inline` blocks. If there is no CSS file, the CLI prints the variables instead.

### Commands the CLI runs

| Command | When |
| --- | --- |
| `npx shadcn@latest add <names...> --yes` | Missing shadcn primitives (for example `utils`, `avatar`) when `components.json` exists. Without it, the CLI prints the command instead. |
| `npm install`, `pnpm add`, `yarn add` or `bun add` with the item's `dependencies` | After the files are written |
| Same with `-D` (`-d` for bun) and the item's `devDependencies` | After the files are written |

Before running anything, the CLI checks every package spec against `^(@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*(@[a-z0-9.^~*-]+)?$`. Every registry dependency must be a bare name or an `https://` URL ending in `.json`. If either check fails, the CLI exits before writing any file. A failed install prints a warning with the command to run by hand, and doesn't change the exit code.

### Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Help or list printed, or `add` finished. This includes runs where every file already existed or an install step failed with a warning. |
| `1` | Unknown command, unknown option, no component name, unknown component, missing registry catalog, invalid dependency in a registry item, a destination outside the target directories, or an unexpected filesystem error |

## 2. npm package

`@devclubnst/ui` on [npm](https://www.npmjs.com/package/@devclubnst/ui). It has no `main` or `exports` field, so it can't be imported from JavaScript. It ships:

| Path | Contents |
| --- | --- |
| `bin/cli.mjs` | The CLI above |
| `public/r/*.json`, `r/*.json` | Registry items and catalog. The two copies are identical. |
| `registry.json` | Registry catalog |
| `src/registry/` | Component source and metadata |

Versions follow semver. Each official version has a `v<version>` tag and a [GitHub release](https://github.com/devclub-nstru/component_library/releases) whose assets include the same tarball (`devclubnst-ui-<version>.tgz`) and a `SHA256SUMS` file. To verify a tarball:

```sh
npm pack @devclubnst/ui@<version>
sha256sum -c SHA256SUMS
gh attestation verify devclubnst-ui-<version>.tgz --repo devclub-nstru/component_library
```

## 3. Registry JSON

Static files served by the docs site on the production VPS, generated from source by `npm run registry:sync` and baked into each container image. They follow the shadcn [registry](https://ui.shadcn.com/schema/registry.json) and [registry-item](https://ui.shadcn.com/schema/registry-item.json) schemas.

| URL | Contents |
| --- | --- |
| `https://ui.devclubxnst.com/r/registry.json` | Catalog: `{ "$schema", "name": "devclubnst", "homepage", "items": [...] }`. Each item has `name`, `type`, `title`, `description`, `dependencies`, `registryDependencies` and `files` (paths only). |
| `https://ui.devclubxnst.com/r/index.json` | Same content as `registry.json` |
| `https://ui.devclubxnst.com/r/<name>.json` | One registry item, with the fields in the table below |

| Field | Type | Notes |
| --- | --- | --- |
| `$schema` | string | `https://ui.shadcn.com/schema/registry-item.json` |
| `name` | string | Component slug, `[a-z0-9-]+` |
| `type` | string | Always `registry:ui` |
| `title`, `description` | string | Display text |
| `dependencies` | string[] | npm package specs, such as `gsap` or `voice-glow@^0.2.1` |
| `devDependencies` | string[] | Optional |
| `registryDependencies` | string[] | shadcn names (`utils`, `avatar`) or full `https://ui.devclubxnst.com/r/<name>.json` URLs for DevClub items |
| `files[]` | object[] | `path`, `type` (`registry:ui` or `registry:lib`), optional `target` (`@ui/...`), and `content` (full source as a string) |
| `cssVars` | object | Optional `theme`, `light` and `dark` maps from variable name to value |

The CLI's help text also lists `npx shadcn@latest add devclub-nstru/component_library/<name>` as an install form.

## 4. Docs site HTTP API

Read-only JSON endpoints on `https://ui.devclubxnst.com`, from `src/app/api/`. They need no authentication and only accept `GET`. Responses other than `/api/github/stars` use the envelope `{ "success": boolean, "data"?: T, "error"?: string, "timestamp": ISO-8601 }` from [src/types/api.ts](../src/types/api.ts).

| Endpoint | Parameters | Response |
| --- | --- | --- |
| `GET /api/components` | `category` (exact match, case-insensitive, `all` means no filter), `tag` (exact match), `q` (substring of name, description, category label or tag, case-insensitive) | `data: { components: ComponentRegistryItem[], total, categories: string[] }` |
| `GET /api/components/<slug>` | None | `data: ComponentRegistryItem`, or `404` with `error` |
| `GET /api/health` | None | `data: { status: "ok", version, uptime, timestamp, environment }`. `version` is a fixed `"1.0.0"`, not the package version. |
| `GET /api/github/stars` | None | `{ "stars": number \| null }`, cached for an hour |

`ComponentRegistryItem` is defined in [src/types/component.ts](../src/types/component.ts). It's the metadata in `src/registry/components/<slug>.json`: slug, name, description, category, tags, dependencies, props, accessibility notes and usage examples. Errors return `500` with `success: false`.

## 5. Component props

Each component is a React component whose public interface is its exported props type in `src/registry/ui/<slug>.tsx`, the file that gets copied into the user's app. The same props are described in the `props` array (`name`, `type`, `required`, `description`, and `default` or `defaultValue` where set) of `src/registry/components/<slug>.json`. That array is shown on `https://ui.devclubxnst.com/components/<slug>` and returned by `/api/components/<slug>`.

After a component is copied into an app, its code belongs to that app. A props change in a later release only reaches users who run `add --overwrite` again. Props changes are listed under `Changed` in the changelog.
