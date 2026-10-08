#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, "..");
const publicRDir = path.join(pkgRoot, "public", "r");

const readComponentsConfig = (cwd) => {
  const componentsJsonPath = path.join(cwd, "components.json");
  if (!fs.existsSync(componentsJsonPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(componentsJsonPath, "utf8"));
  } catch {
    return null;
  }
};

const resolveAliasDirectory = (cwd, alias) => {
  if (!alias?.startsWith("@/")) return null;
  const sub = alias.replace(/^@\//, "");
  if (fs.existsSync(path.join(cwd, "src"))) {
    return path.join(cwd, "src", sub);
  }
  return path.join(cwd, sub);
};

const getTargetDirectory = (cwd, config) => {
  const fromAlias = resolveAliasDirectory(cwd, config?.aliases?.ui);
  if (fromAlias) return fromAlias;

  if (fs.existsSync(path.join(cwd, "src", "components", "ui"))) {
    return path.join(cwd, "src", "components", "ui");
  }
  if (fs.existsSync(path.join(cwd, "components", "ui"))) {
    return path.join(cwd, "components", "ui");
  }
  if (fs.existsSync(path.join(cwd, "src"))) {
    return path.join(cwd, "src", "components", "ui");
  }
  return path.join(cwd, "components", "ui");
};

const getLibDirectory = (cwd, config) =>
  resolveAliasDirectory(cwd, config?.aliases?.lib) ??
  resolveAliasDirectory(cwd, "@/lib");

const detectPackageManager = (cwd) => {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "bun.lockb")) || fs.existsSync(path.join(cwd, "bun.lock"))) return "bun";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
};

const installCommand = (pkgManager, packages, dev) => {
  const list = packages.join(" ");
  if (pkgManager === "pnpm") return `pnpm add ${dev ? "-D " : ""}${list}`;
  if (pkgManager === "yarn") return `yarn add ${dev ? "-D " : ""}${list}`;
  if (pkgManager === "bun") return `bun add ${dev ? "-d " : ""}${list}`;
  return `npm install ${dev ? "-D " : ""}${list}`;
};

const itemJsonPath = (name) => path.join(publicRDir, `${name}.json`);

const devclubItemName = (dependency) => {
  const match = dependency.match(/\/r\/([^/]+)\.json$/);
  if (match && fs.existsSync(itemJsonPath(match[1]))) return match[1];
  return null;
};

const resolveItems = (names) => {
  const ordered = [];
  const seen = new Set();
  const shadcnDependencies = new Set();

  const visit = (name) => {
    if (seen.has(name)) return;
    seen.add(name);
    const data = JSON.parse(fs.readFileSync(itemJsonPath(name), "utf8"));
    for (const dependency of data.registryDependencies || []) {
      const devclubName = devclubItemName(dependency);
      if (devclubName) {
        visit(devclubName);
      } else {
        shadcnDependencies.add(dependency);
      }
    }
    ordered.push(data);
  };

  names.forEach(visit);
  return { items: ordered, shadcnDependencies: [...shadcnDependencies] };
};

const getDestination = (file, uiDir, libDir) => {
  if (file.type === "registry:lib") {
    return path.join(libDir, path.basename(file.path));
  }
  if (file.target?.startsWith("@ui/")) {
    return path.join(uiDir, ...file.target.slice("@ui/".length).split("/"));
  }
  return path.join(uiDir, path.basename(file.target || file.path));
};

const shadcnDependencyExists = (name, uiDir, libDir) => {
  if (name === "utils") {
    return ["utils.ts", "utils.js"].some((file) =>
      fs.existsSync(path.join(libDir, file)),
    );
  }
  return ["tsx", "jsx"].some((ext) =>
    fs.existsSync(path.join(uiDir, `${name}.${ext}`)),
  );
};

const appendCssVars = (cwd, config, items) => {
  const cssPath = config?.tailwind?.css && path.join(cwd, config.tailwind.css);
  const withVars = items.filter((item) => item.cssVars);
  if (!withVars.length) return;
  if (!cssPath || !fs.existsSync(cssPath)) {
    console.warn(
      "Warning: Could not find your Tailwind CSS file. Add these CSS variables manually:",
    );
    for (const item of withVars) {
      console.warn(JSON.stringify(item.cssVars, null, 2));
    }
    return;
  }

  const css = fs.readFileSync(cssPath, "utf8");
  const blocks = { theme: new Map(), light: new Map(), dark: new Map() };
  for (const item of withVars) {
    for (const scope of Object.keys(blocks)) {
      for (const [name, value] of Object.entries(item.cssVars[scope] || {})) {
        if (!css.includes(`--${name}:`)) {
          blocks[scope].set(name, value);
        }
      }
    }
  }

  const render = (selector, vars) =>
    vars.size
      ? `\n${selector} {\n${[...vars].map(([name, value]) => `  --${name}: ${value};`).join("\n")}\n}\n`
      : "";
  const addition =
    render(":root", blocks.light) +
    render(".dark", blocks.dark) +
    render("@theme inline", blocks.theme);

  if (addition) {
    fs.appendFileSync(cssPath, addition, "utf8");
    console.log(`✓ Updated ${path.relative(cwd, cssPath)}`);
  }
};

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "--help" || command === "-h") {
  console.log(`
DevClub UI CLI (@devclubnst/ui)

Usage:
  npx @devclubnst/ui add <component...>   Add components to your project
  npx @devclubnst/ui list                 List all available components
  npx @devclubnst/ui --help               Show this help message

Options for add:
  -o, --overwrite   Overwrite files that already exist

Shadcn CLI usage:
  npx shadcn@latest add https://ui.devclubxnst.online/r/<component>.json
  npx shadcn@latest add devclub-nstru/component_library/<component>
`);
  process.exit(0);
}

if (command === "list") {
  const registryJsonPath = path.join(publicRDir, "registry.json");
  if (!fs.existsSync(registryJsonPath)) {
    console.error("Registry catalog not found.");
    process.exit(1);
  }
  const reg = JSON.parse(fs.readFileSync(registryJsonPath, "utf8"));
  console.log("\nAvailable components in @devclubnst/ui:\n");
  for (const item of reg.items || []) {
    console.log(`  - ${item.name.padEnd(24)} ${item.title || ""}`);
  }
  console.log(`\nTotal: ${reg.items?.length || 0} components\n`);
  process.exit(0);
}

if (command === "add") {
  const options = args.slice(1).filter((arg) => arg.startsWith("-"));
  const overwrite = options.includes("--overwrite") || options.includes("-o");
  const names = args
    .slice(1)
    .filter((arg) => !arg.startsWith("-"))
    .map((name) => name.replace(/^@devclubnst\//, "").replace(/\.json$/, ""));

  if (!names.length) {
    console.error("Error: Please specify a component name.\nExample: npx @devclubnst/ui add noise");
    process.exit(1);
  }

  for (const name of names) {
    if (!/^[a-z0-9-]+$/.test(name) || !fs.existsSync(itemJsonPath(name))) {
      console.error(`Error: Component "${name}" not found in @devclubnst/ui.`);
      console.log("Run 'npx @devclubnst/ui list' to view all available components.");
      process.exit(1);
    }
  }

  const cwd = process.cwd();
  const config = readComponentsConfig(cwd);
  const targetDir = getTargetDirectory(cwd, config);
  const libDir = getLibDirectory(cwd, config);
  const { items, shadcnDependencies } = resolveItems(names);

  const missingShadcn = shadcnDependencies.filter(
    (name) => !shadcnDependencyExists(name, targetDir, libDir),
  );
  if (missingShadcn.length) {
    const shadcnCommand = `npx shadcn@latest add ${missingShadcn.join(" ")} --yes`;
    if (config) {
      console.log(`\nAdding shadcn/ui dependencies: ${missingShadcn.join(", ")}...`);
      try {
        execSync(shadcnCommand, { stdio: "inherit", cwd });
      } catch {
        console.warn(`Warning: Could not add shadcn/ui dependencies. Please run manually: ${shadcnCommand}`);
      }
    } else {
      console.warn(`Warning: No components.json found. Run 'npx shadcn@latest init', then: ${shadcnCommand}`);
    }
  }

  const skipped = [];
  for (const item of items) {
    for (const file of item.files || []) {
      const destPath = getDestination(file, targetDir, libDir);
      const relativePath = path.relative(cwd, destPath);
      if (fs.existsSync(destPath) && !overwrite) {
        skipped.push(relativePath);
        continue;
      }
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, file.content || "", "utf8");
      console.log(`✓ Created ${relativePath}`);
    }
  }

  if (skipped.length) {
    console.log("\nSkipped existing files (use --overwrite to replace them):");
    for (const file of skipped) {
      console.log(`  - ${file}`);
    }
  }

  appendCssVars(cwd, config, items);

  const pkgManager = detectPackageManager(cwd);
  const dependencies = [...new Set(items.flatMap((item) => item.dependencies || []))];
  const devDependencies = [...new Set(items.flatMap((item) => item.devDependencies || []))];
  for (const [packages, dev] of [
    [dependencies, false],
    [devDependencies, true],
  ]) {
    if (!packages.length) continue;
    const cmd = installCommand(pkgManager, packages, dev);
    console.log(`\nInstalling ${dev ? "dev " : ""}dependencies: ${packages.join(" ")}...`);
    try {
      execSync(cmd, { stdio: "inherit", cwd });
    } catch {
      console.warn(`Warning: Could not automatically install dependencies. Please run manually: ${cmd}`);
    }
  }

  console.log(`\n✓ Successfully added ${names.join(", ")}!\n`);
  process.exit(0);
}

console.error(`Unknown command: ${command}. Run 'npx @devclubnst/ui --help' for usage.`);
process.exit(1);
