import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const publicR = path.join(root, "public", "r");
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const { homepage } = readJson(path.join(root, "package.json"));
const catalog = readJson(path.join(publicR, "registry.json"));
const itemFiles = fs
  .readdirSync(publicR)
  .filter((file) => file.endsWith(".json") && file !== "registry.json" && file !== "index.json");
const items = itemFiles.map((file) => ({ file, item: readJson(path.join(publicR, file)) }));

describe("public registry", () => {
  test("every published item is listed in the catalog exactly once", () => {
    const catalogNames = catalog.items.map((item) => item.name);
    assert.equal(new Set(catalogNames).size, catalogNames.length);
    assert.deepEqual(
      [...catalogNames].sort(),
      items.map(({ item }) => item.name).sort(),
    );
  });

  test("index.json mirrors registry.json", () => {
    assert.deepEqual(readJson(path.join(publicR, "index.json")), catalog);
  });

  for (const { file, item } of items) {
    describe(file, () => {
      test("is named after its file", () => {
        assert.equal(`${item.name}.json`, file);
      });

      test("ships the reviewed source byte for byte", () => {
        assert.ok(item.files?.length, "item has no files");
        for (const entry of item.files) {
          const source = fs.readFileSync(path.join(root, entry.path), "utf8");
          assert.equal(entry.content, source, `${entry.path} differs from its payload`);
        }
      });

      test("links registry dependencies to published items on the site", () => {
        for (const dependency of item.registryDependencies ?? []) {
          if (!dependency.startsWith("http")) continue;
          const url = new URL(dependency);
          assert.equal(url.origin, new URL(homepage).origin, dependency);
          const target = url.pathname.match(/^\/r\/([a-z0-9-]+\.json)$/)?.[1];
          assert.ok(target && itemFiles.includes(target), `${dependency} is not in public/r/`);
        }
      });
    });
  }
});
