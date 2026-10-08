import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REGISTRY = "https://registry.npmjs.org/";
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lockfile = JSON.parse(fs.readFileSync(path.join(rootDir, "package-lock.json"), "utf8"));

const packageNameFromKey = (key) => key.slice(key.lastIndexOf("node_modules/") + "node_modules/".length);

const problems = [];
let checked = 0;
for (const [key, entry] of Object.entries(lockfile.packages ?? {})) {
  if (key === "" || entry.link || !key.includes("node_modules/")) continue;

  checked++;
  const name = entry.name ?? packageNameFromKey(key);
  if (!entry.resolved?.startsWith(REGISTRY)) {
    problems.push(`${key}: resolved from ${entry.resolved ?? "nowhere"}, expected ${REGISTRY}`);
    continue;
  }
  if (!entry.resolved.startsWith(`${REGISTRY}${name}/-/`)) {
    problems.push(`${key}: resolved URL ${entry.resolved} does not match package name ${name}`);
  }
  if (!entry.integrity?.startsWith("sha512-")) {
    problems.push(`${key}: missing sha512 integrity hash`);
  }
}

if (lockfile.lockfileVersion !== 3) {
  problems.push(`lockfileVersion is ${lockfile.lockfileVersion}, expected 3`);
}

if (problems.length) {
  console.error(`package-lock.json failed ${problems.length} integrity check(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`package-lock.json OK: ${checked} packages resolve to ${REGISTRY} with sha512 integrity.`);
