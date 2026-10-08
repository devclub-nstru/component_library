import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const componentsDir = path.join(rootDir, "src", "registry", "components");
const publicRDir = path.join(rootDir, "public", "r");
const rootRDir = path.join(rootDir, "r");
const registryBaseUrl = (
  process.env.REGISTRY_BASE_URL || "https://ui.devclubxnst.online"
).replace(/\/+$/, "");
const catalogFiles = new Set(["registry.json", "index.json"]);
const runtimePackages = new Set(["react", "react-dom"]);
const utilsPackages = new Set(["clsx", "tailwind-merge"]);

if (!fs.existsSync(publicRDir)) {
  fs.mkdirSync(publicRDir, { recursive: true });
}
if (!fs.existsSync(rootRDir)) {
  fs.mkdirSync(rootRDir, { recursive: true });
}

const toRel = (filePath) => filePath.replace(/^src\//, "");

const isLibFile = (file) => file.type === "registry:lib";

const getFileType = (file) => (isLibFile(file) ? "registry:lib" : "registry:ui");

const getTarget = (filePath, fileName) => {
  if (filePath.includes("registry/ui/fx/")) {
    return `@ui/fx/${fileName}`;
  }
  return `@ui/${fileName}`;
};

const withoutExtension = (value) => value.replace(/\.(tsx?|jsx?)$/, "");

const packageName = (specifier) => {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
};

const declaredName = (dependency) => dependency.replace(/(?!^)@.*$/, "");

const readImports = (code) => {
  const specifiers = new Set();
  const patterns = [
    /^(?:import|export)\s[^;'"]*?from\s*["']([^"']+)["']/gm,
    /^import\s*["']([^"']+)["']/gm,
    /\bimport\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of code.matchAll(pattern)) {
      specifiers.add(match[1]);
    }
  }
  return [...specifiers];
};

const files = fs
  .readdirSync(componentsDir)
  .filter((file) => file.endsWith(".json"))
  .sort();

let updatedCount = 0;
let hasError = false;
const fail = (message) => {
  console.error(`Error: ${message}`);
  hasError = true;
};

const components = [];

for (const file of files) {
  const jsonPath = path.join(componentsDir, file);
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  let modified = false;

  if (data.type !== "registry:ui") {
    data.type = "registry:ui";
    modified = true;
  }
  if (!data.$schema) {
    data.$schema = "https://ui.shadcn.com/schema/registry-item.json";
    modified = true;
  }
  if (data.title !== data.name) {
    data.title = data.name;
    modified = true;
  }

  for (const item of data.files || []) {
    if (!item.path) continue;
    const rel = toRel(item.path);
    const sourcePath = path.join(rootDir, "src", rel);
    if (!fs.existsSync(sourcePath)) {
      fail(`File not found: ${sourcePath} referenced in ${file}`);
      continue;
    }
    const currentCode = fs.readFileSync(sourcePath, "utf8");
    if (item.code !== currentCode) {
      item.code = currentCode;
      modified = true;
    }
    if (item.content !== currentCode) {
      item.content = currentCode;
      modified = true;
    }
    const type = getFileType(item);
    if (item.type !== type) {
      item.type = type;
      modified = true;
    }
    if (isLibFile(item)) {
      if (item.target !== undefined) {
        delete item.target;
        modified = true;
      }
    } else {
      const target = getTarget(rel, item.name);
      if (item.target !== target) {
        item.target = target;
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf8");
    updatedCount++;
  }

  components.push(data);
}

const published = components.filter((data) => !data.hidden);
const publishedSlugs = new Set(published.map((data) => data.slug));

const resolveRegistryDependency = (name) =>
  publishedSlugs.has(name) ? `${registryBaseUrl}/r/${name}.json` : name;

const buildItem = (data) => {
  const declared = data.registryDependencies || [];
  const provided = new Set(declared);
  const itemFiles = (data.files || [])
    .filter((f) => !provided.has(withoutExtension(f.name)))
    .map((f) => {
      const rel = toRel(f.path);
      const sourcePath = path.join(rootDir, "src", rel);
      const content = fs.existsSync(sourcePath)
        ? fs.readFileSync(sourcePath, "utf8")
        : "";
      const entry = { path: `src/${rel}`, content, type: getFileType(f) };
      if (!isLibFile(f)) {
        entry.target = getTarget(rel, f.name);
      }
      return entry;
    });

  const imports = itemFiles.flatMap((f) =>
    readImports(f.content).map((specifier) => ({ file: f, specifier })),
  );
  const registryDependencies = [...declared];
  if (
    imports.some(({ specifier }) => specifier === "@/lib/utils") &&
    !registryDependencies.includes("utils")
  ) {
    registryDependencies.unshift("utils");
  }

  return {
    data,
    files: itemFiles,
    imports,
    registryDependencies,
  };
};

const items = new Map(published.map((data) => [data.slug, buildItem(data)]));

const collectTargets = (slug, seen = new Set()) => {
  if (seen.has(slug)) return [];
  seen.add(slug);
  const item = items.get(slug);
  if (!item) return [];
  const own = item.files.map((f) =>
    f.target
      ? withoutExtension(f.target)
      : `@lib/${withoutExtension(path.basename(f.path))}`,
  );
  const fromDeps = item.registryDependencies
    .filter((name) => publishedSlugs.has(name))
    .flatMap((name) => collectTargets(name, seen));
  return [...own, ...fromDeps];
};

for (const [slug, item] of items) {
  const available = new Set(collectTargets(slug));
  const shadcnDependencies = new Set(
    item.registryDependencies.filter((name) => !publishedSlugs.has(name)),
  );
  const dependencies = item.data.dependencies || [];
  const declaredPackages = new Set(
    [...dependencies, ...(item.data.devDependencies || [])].map(declaredName),
  );
  const usedPackages = new Set(
    (item.data.files || [])
      .flatMap((f) => readImports(f.code || ""))
      .filter((specifier) => !specifier.startsWith(".") && !specifier.startsWith("@/"))
      .map(packageName),
  );

  for (const { file, specifier } of item.imports) {
    if (specifier.startsWith(".")) {
      const resolved = path.posix.normalize(
        path.posix.join(path.posix.dirname(file.target || "@lib/x"), specifier),
      );
      if (!available.has(withoutExtension(resolved))) {
        fail(`${slug}: ${file.path} imports "${specifier}", which is not shipped`);
      }
    } else if (specifier === "@/lib/utils") {
      continue;
    } else if (specifier.startsWith("@/components/ui/")) {
      const name = specifier.slice("@/components/ui/".length);
      if (!available.has(`@ui/${name}`) && !shadcnDependencies.has(name)) {
        fail(`${slug}: ${file.path} imports "${specifier}", which is not shipped`);
      }
    } else if (specifier.startsWith("@/lib/")) {
      if (!available.has(`@lib/${specifier.slice("@/lib/".length)}`)) {
        fail(`${slug}: ${file.path} imports "${specifier}", which is not shipped`);
      }
    } else if (specifier.startsWith("@/")) {
      fail(`${slug}: ${file.path} imports site-internal path "${specifier}"`);
    } else {
      const name = packageName(specifier);
      if (!runtimePackages.has(name) && !declaredPackages.has(name)) {
        fail(`${slug}: imports "${name}" but does not declare it`);
      }
    }
  }

  for (const dependency of dependencies) {
    const name = declaredName(dependency);
    if (!usedPackages.has(name) && !utilsPackages.has(name)) {
      fail(`${slug}: declares "${dependency}" but never imports it`);
    }
  }
}

const toRegistryEntry = ({ data, registryDependencies }, itemFiles) => {
  const entry = {
    name: data.slug,
    type: "registry:ui",
    title: data.name,
    description: data.description,
    dependencies: data.dependencies || [],
  };
  if (data.devDependencies?.length) {
    entry.devDependencies = data.devDependencies;
  }
  if (registryDependencies.length) {
    entry.registryDependencies = registryDependencies.map(
      resolveRegistryDependency,
    );
  }
  if (data.cssVars) {
    entry.cssVars = data.cssVars;
  }
  entry.files = itemFiles;
  return entry;
};

const registryItems = [];
const writtenFiles = new Set(catalogFiles);

for (const item of items.values()) {
  registryItems.push(
    toRegistryEntry(
      item,
      item.files.map(({ path: filePath, type, target }) =>
        target ? { path: filePath, type, target } : { path: filePath, type },
      ),
    ),
  );

  const individualContent =
    JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        ...toRegistryEntry(item, item.files),
      },
      null,
      2,
    ) + "\n";
  const fileName = `${item.data.slug}.json`;
  writtenFiles.add(fileName);
  fs.writeFileSync(path.join(publicRDir, fileName), individualContent, "utf8");
  fs.writeFileSync(path.join(rootRDir, fileName), individualContent, "utf8");
}

for (const dir of [publicRDir, rootRDir]) {
  for (const existing of fs.readdirSync(dir)) {
    if (existing.endsWith(".json") && !writtenFiles.has(existing)) {
      fs.rmSync(path.join(dir, existing));
    }
  }
}

const registryJson = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "devclubnst",
  homepage: "https://ui.devclubxnst.online",
  items: registryItems,
};

const registryContent = JSON.stringify(registryJson, null, 2) + "\n";

fs.writeFileSync(path.join(publicRDir, "registry.json"), registryContent, "utf8");
fs.writeFileSync(path.join(rootRDir, "registry.json"), registryContent, "utf8");
fs.writeFileSync(path.join(publicRDir, "index.json"), registryContent, "utf8");
fs.writeFileSync(path.join(rootRDir, "index.json"), registryContent, "utf8");
fs.writeFileSync(path.join(rootDir, "registry.json"), registryContent, "utf8");

if (hasError) {
  process.exit(1);
}

console.log(
  `Registry sync completed. Components: ${files.length}. Published: ${published.length}. Internal updated: ${updatedCount}. Public registry synced in public/r/.`
);
