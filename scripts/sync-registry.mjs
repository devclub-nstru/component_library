import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const componentsDir = path.join(rootDir, "src", "registry", "components");
const publicRDir = path.join(rootDir, "public", "r");
const rootRDir = path.join(rootDir, "r");

if (!fs.existsSync(publicRDir)) {
  fs.mkdirSync(publicRDir, { recursive: true });
}
if (!fs.existsSync(rootRDir)) {
  fs.mkdirSync(rootRDir, { recursive: true });
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
  "confirm-morph": "Confirm Morph",
  dither: "Dither",
  "dotted-accordion": "Dotted Accordion",
  editor: "Selection AI Editor",
  "file-upload": "File Upload",
  "file-tree": "File Tree",
  "github-activity": "GitHub Activity",
  "glowing-badge": "Glowing Badge",
  "gooey-nav": "Gooey Nav",
  "hook-sidebar": "Hook Sidebar",
  "liquid-toggle": "Liquid Toggle",
  "mac-slider": "Mac Slider",
  "mac-switch": "Mac Switch",
  slider: "Slider",
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
  "profile-menu": "Profile Command Menu",
  "date-range-picker": "Date Range Picker",
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

  const slug = data.slug;
  const title = componentTitles[slug] || data.name;

  if (data.type !== "registry:ui") {
    data.type = "registry:ui";
    modified = true;
  }
  if (!data.$schema) {
    data.$schema = "https://ui.shadcn.com/schema/registry-item.json";
    modified = true;
  }
  if (data.title !== title) {
    data.title = title;
    modified = true;
  }

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
      if (item.content !== currentCode) {
        item.content = currentCode;
        modified = true;
      }
      if (item.type !== "registry:ui") {
        item.type = "registry:ui";
        modified = true;
      }
      const target = getTarget(item.path.replace(/^src\//, ""), item.name);
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
  const rootRItemJsonPath = path.join(rootRDir, `${slug}.json`);
  const individualContent =
    JSON.stringify(individualRegistryItem, null, 2) + "\n";
  fs.writeFileSync(itemJsonPath, individualContent, "utf8");
  fs.writeFileSync(rootRItemJsonPath, individualContent, "utf8");
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
  `Registry sync completed. Total components: ${files.length}. Internal updated: ${updatedCount}. Public registry synced in public/r/.`
);
