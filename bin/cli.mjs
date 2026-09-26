#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, "..");
const publicRDir = path.join(pkgRoot, "public", "r");

const getTargetDirectory = (cwd) => {
  const componentsJsonPath = path.join(cwd, "components.json");
  if (fs.existsSync(componentsJsonPath)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(componentsJsonPath, "utf8"));
      if (cfg.aliases?.ui) {
        const aliasUi = cfg.aliases.ui;
        if (aliasUi.startsWith("@/")) {
          const sub = aliasUi.replace(/^@\//, "");
          const candidateSrc = path.join(cwd, "src", sub);
          const candidateRoot = path.join(cwd, sub);
          if (fs.existsSync(path.join(cwd, "src"))) {
            return candidateSrc;
          }
          return candidateRoot;
        }
      }
    } catch {}
  }

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

const detectPackageManager = (cwd) => {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "bun.lockb")) || fs.existsSync(path.join(cwd, "bun.lock"))) return "bun";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
};

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "--help" || command === "-h") {
  console.log(`
DevClub UI CLI (@devclubnst/ui)

Usage:
  npx @devclubnst/ui add <component>   Add a component to your project
  npx @devclubnst/ui list              List all available components
  npx @devclubnst/ui --help            Show this help message

Shadcn CLI usage:
  npx shadcn@latest add https://devclub.co/r/<component>.json
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
  const componentName = args[1];
  if (!componentName) {
    console.error("Error: Please specify a component name.\nExample: npx @devclubnst/ui add noise");
    process.exit(1);
  }

  const cleanName = componentName.replace(/^@devclubnst\//, "").replace(/\.json$/, "");
  const itemJsonPath = path.join(publicRDir, `${cleanName}.json`);

  if (!fs.existsSync(itemJsonPath)) {
    console.error(`Error: Component "${cleanName}" not found in @devclubnst/ui.`);
    console.log("Run 'npx @devclubnst/ui list' to view all available components.");
    process.exit(1);
  }

  const componentData = JSON.parse(fs.readFileSync(itemJsonPath, "utf8"));
  const cwd = process.cwd();
  const targetDir = getTargetDirectory(cwd);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const file of componentData.files || []) {
    let fileName = path.basename(file.path);
    if (file.target) {
      fileName = path.basename(file.target);
    }
    const destPath = path.join(targetDir, fileName);
    fs.writeFileSync(destPath, file.content || "", "utf8");
    console.log(`✓ Created ${path.relative(cwd, destPath)}`);
  }

  if (componentData.dependencies?.length) {
    const pkgManager = detectPackageManager(cwd);
    const deps = componentData.dependencies.join(" ");
    console.log(`\nInstalling dependencies: ${deps}...`);
    try {
      const installCmd =
        pkgManager === "pnpm"
          ? `pnpm add ${deps}`
          : pkgManager === "yarn"
          ? `yarn add ${deps}`
          : pkgManager === "bun"
          ? `bun add ${deps}`
          : `npm install ${deps}`;
      execSync(installCmd, { stdio: "inherit", cwd });
    } catch {
      console.warn(`Warning: Could not automatically install dependencies. Please run manually: npm install ${deps}`);
    }
  }

  console.log(`\n✓ Successfully added ${cleanName}!\n`);
  process.exit(0);
}

console.error(`Unknown command: ${command}. Run 'npx @devclubnst/ui --help' for usage.`);
process.exit(1);
