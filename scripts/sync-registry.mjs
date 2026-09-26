import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const componentsDir = path.join(rootDir, "src", "registry", "components");
const publicRDir = path.join(rootDir, "public", "r");

if (!fs.existsSync(publicRDir)) {
  fs.mkdirSync(publicRDir, { recursive: true });
}

const componentTitles = {
  accordion: "Blur Reveal Accordion",
  "ai-input": "AI Input",
  "ai-orb": "AI Orb",
  "animated-button": "Animated Button",
  "animated-counter": "Animated Counter",
  "bento-grid": "Bento Grid",
  "candy-button": "Candy Button",
  "code-block": "Code Block",
  dither: "Dither",
  "dotted-accordion": "Dotted Accordion",
  "file-tree": "File Tree",
  "github-activity": "GitHub Activity",
  "glowing-badge": "Glowing Badge",
  "gooey-nav": "Gooey Nav",
  "hook-sidebar": "Hook Sidebar",
  "liquid-toggle": "Liquid Toggle",
  "mac-slider": "Mac Slider",
  "mac-switch": "Mac Switch",
  "morph-search": "Morph Search",
  noise: "Noise",
  orb: "Thinking Orb",
  "otp-input": "OTP Input",
  "pixel-card": "Pixel Card",
  "proximity-sidebar": "Proximity Sidebar",
  scales: "Scales & Borders",
  "search-input": "Search Input",
  "smooth-accordion": "Smooth Accordion",
  "sparkle-button": "Sparkle Button",
  "spotlight-card": "Spotlight Card",
  "spotlight-search": "Spotlight Search",
  "task-list": "Task List",
  "theme-toggle": "Theme Toggle",
  toast: "Toast",
  "twitter-card": "Twitter Card",
};

const getTarget = (filePath, fileName) => {
  const clean = filePath.replace(/^src\//, "");
  if (clean.includes("registry/ui/fx/")) {
    return `@ui/fx/${fileName}`;
  }
  return `@ui/${fileName}`;
};

const files = fs
  .readdirSync(componentsDir)
  .filter((file) => file.endsWith(".json"))
  .sort();

let updatedCount = 0;
let hasError = false;
const registryItems = [];

for (const file of files) {
  const jsonPath = path.join(componentsDir, file);
  const rawData = fs.readFileSync(jsonPath, "utf8");
  const data = JSON.parse(rawData);

  let modified = false;

  if (Array.isArray(data.files)) {
    for (const item of data.files) {
      if (!item.path) continue;
      const sourcePath = path.join(rootDir, "src", item.path.replace(/^src\//, ""));
      if (!fs.existsSync(sourcePath)) {
        console.error(`Error: File not found: ${sourcePath} referenced in ${file}`);
        hasError = true;
        continue;
      }
      const currentCode = fs.readFileSync(sourcePath, "utf8");
      if (item.code !== currentCode) {
        item.code = currentCode;
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf8");
    updatedCount++;
  }

  const slug = data.slug;
  const title = componentTitles[slug] || data.name;

  const itemFilesForRegistry = (data.files || []).map((f) => {
    const rel = f.path.replace(/^src\//, "");
    return {
      path: `src/${rel}`,
      type: "registry:ui",
      target: getTarget(rel, f.name),
    };
  });

  const registryItem = {
    name: slug,
    type: "registry:ui",
    title,
    description: data.description,
    dependencies: data.dependencies || [],
    files: itemFilesForRegistry,
  };

  registryItems.push(registryItem);

  const itemFilesForIndividual = (data.files || []).map((f) => {
    const rel = f.path.replace(/^src\//, "");
    const sourcePath = path.join(rootDir, "src", rel);
    const content = fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath, "utf8") : "";
    return {
      path: `src/${rel}`,
      content,
      type: "registry:ui",
      target: getTarget(rel, f.name),
    };
  });

  const individualRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: slug,
    type: "registry:ui",
    title,
    description: data.description,
    dependencies: data.dependencies || [],
    files: itemFilesForIndividual,
  };

  const itemJsonPath = path.join(publicRDir, `${slug}.json`);
  fs.writeFileSync(
    itemJsonPath,
    JSON.stringify(individualRegistryItem, null, 2) + "\n",
    "utf8"
  );
}

const registryJson = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "devclubnst",
  homepage: "https://devclub.co",
  items: registryItems,
};

fs.writeFileSync(
  path.join(publicRDir, "registry.json"),
  JSON.stringify(registryJson, null, 2) + "\n",
  "utf8"
);

fs.writeFileSync(
  path.join(publicRDir, "index.json"),
  JSON.stringify(registryJson, null, 2) + "\n",
  "utf8"
);

if (hasError) {
  process.exit(1);
}

console.log(
  `Registry sync completed. Total components: ${files.length}. Internal updated: ${updatedCount}. Public registry synced in public/r/.`
);
