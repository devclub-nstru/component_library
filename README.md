# DevClub UI

React components with expressive motion. Copy the source into your project, make it your own, and build with the tools you already use.

![npm version](https://img.shields.io/npm/v/%40devclubnst%2Fui?style=flat-square&color=171717)
![MIT license](https://img.shields.io/badge/license-MIT-171717?style=flat-square)

[Components](https://ui.devclubxnst.online/components) · [Documentation](https://ui.devclubxnst.online/docs) · [npm](https://www.npmjs.com/package/@devclubnst/ui) · [Community](https://ui.devclubxnst.online/docs/community)

## What you get

- React and TypeScript component source, styled with Tailwind CSS.
- Animated interfaces using GSAP, Motion, and component-specific WebGL effects.
- Live previews, source code, and customization controls in the component studio.
- A CLI and a shadcn-compatible registry for adding components to your own codebase.

DevClub UI distributes source code. You import the installed files from your project and can edit their styles, behavior, and animation settings directly.

## Quick start

Start with a React project configured for Tailwind CSS and the `@/` import alias. See the [installation guide](https://ui.devclubxnst.online/docs/installation) for setup and manual installation.

Add a component:

```sh
npx @devclubnst/ui@latest add noise
```

The CLI copies the component source into your UI directory and installs its declared dependencies using your project's package manager. It reads `aliases.ui` from `components.json` when it uses an `@/` alias; otherwise, it selects `src/components/ui` or `components/ui` based on your project structure.

Import the local component:

```tsx
import { Noise } from "@/components/ui/noise";

export default function Example() {
  return (
    <Noise className="rounded-2xl p-8">
      <h2>A little texture. Your own design.</h2>
    </Noise>
  );
}
```

Discover available components or get CLI help:

```sh
npx @devclubnst/ui@latest list
npx @devclubnst/ui@latest --help
```

Prefer another runner?

```sh
pnpm dlx @devclubnst/ui@latest add noise
bunx @devclubnst/ui@latest add noise
```



### Use the shadcn CLI

In a project configured for shadcn, install directly from the public registry:

```sh
npx shadcn@latest add https://ui.devclubxnst.online/r/noise.json
```

Browse the [registry documentation](https://ui.devclubxnst.online/docs/registry) for the catalog and component JSON format.

## Documentation


| Resource                                                        | Purpose                                           |
| --------------------------------------------------------------- | ------------------------------------------------- |
| [Component library](https://ui.devclubxnst.online/components)   | Explore previews, props, and source code.         |
| [Installation](https://ui.devclubxnst.online/docs/installation) | Add components with the CLI or by copying source. |
| [Theming](https://ui.devclubxnst.online/docs/theming)           | Match components to your design.                  |
| [CLI](https://ui.devclubxnst.online/docs/cli)                   | Learn the installation workflow.                  |
| [Community](https://ui.devclubxnst.online/docs/community)       | Find support, contribution guidance, and updates. |




## Contributing

Documentation improvements, bug reports, accessibility fixes, and component ideas are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before preparing a change, and follow the [Code of Conduct](CODE_OF_CONDUCT.md).

The [GitHub repository](https://github.com/devclub-nstru/component_library) is currently private. Repository, issue, and pull request links require access. To ask a question, share a component idea, or request contributor access, email [softwaredevg.club@rishihood.edu.in](mailto:softwaredevg.club@rishihood.edu.in).

With repository access, [browse existing issues](https://github.com/devclub-nstru/component_library/issues) before opening a report. Include the component name, package version, a minimal reproduction, and the expected behavior.

### Local development

Use Node.js 20.9 or newer and npm. Once you have repository access:

```sh
git clone https://github.com/devclub-nstru/component_library.git
cd component_library
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). Before submitting a change, run:

```sh
npm run lint
npx tsc --noEmit
npm run build
```

If you change component source or registry metadata, run `npm run registry:sync` to regenerate the distributed registry files. The [contribution guide](CONTRIBUTING.md) explains the project structure and component workflow.

## Support and updates

For help, use the [community page](https://ui.devclubxnst.online/docs/community) or email [DevClub](mailto:softwaredevg.club@rishihood.edu.in). Follow published versions on [npm](https://www.npmjs.com/package/@devclubnst/ui?activeTab=versions); contributors with repository access can also read [GitHub releases](https://github.com/devclub-nstru/component_library/releases).

Report security concerns privately by email. See [SECURITY.md](SECURITY.md) for the reporting policy; do not include vulnerability details in a public issue.

## License

[MIT](LICENSE). You may use, modify, and redistribute DevClub UI under the terms of the license. Third-party dependencies retain their own licenses.