import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, test } from "node:test";

const cli = path.resolve(import.meta.dirname, "..", "bin", "cli.mjs");
let sandbox;
let stubBin;

const project = () => {
  const dir = fs.mkdtempSync(path.join(sandbox, "app-"));
  fs.mkdirSync(path.join(dir, "src", "app"), { recursive: true });
  fs.writeFileSync(
    path.join(dir, "components.json"),
    JSON.stringify({ tailwind: { css: "src/app/globals.css" } }),
  );
  fs.writeFileSync(path.join(dir, "src", "app", "globals.css"), ":root {\n}\n");
  return dir;
};

const run = (cwd, ...args) =>
  spawnSync(process.execPath, [cli, ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, PATH: `${stubBin}${path.delimiter}${process.env.PATH}` },
  });

before(() => {
  sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "devclub-cli-"));
  stubBin = path.join(sandbox, "bin");
  fs.mkdirSync(stubBin);
  for (const name of ["npm", "npx", "pnpm", "yarn", "bun"]) {
    fs.writeFileSync(path.join(stubBin, name), "#!/bin/sh\nexit 0\n", { mode: 0o755 });
  }
});

after(() => fs.rmSync(sandbox, { recursive: true, force: true }));

describe("cli", { skip: process.platform === "win32" && "stub binaries are POSIX shell scripts" }, () => {
  test("list prints every catalog item", () => {
    const result = run(sandbox, "list");
    assert.equal(result.status, 0);
    assert.match(result.stdout, /- scales\s/);
    assert.match(result.stdout, /Total: \d+ components/);
  });

  test("add rejects unknown components and options", () => {
    const cwd = project();
    assert.equal(run(cwd, "add", "does-not-exist").status, 1);
    assert.equal(run(cwd, "add", "../package").status, 1);
    assert.equal(run(cwd, "add", "scales", "--force").status, 1);
  });

  test("add creates the component and appends missing CSS variables once", () => {
    const cwd = project();
    const result = run(cwd, "add", "scales");
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /✓ Created src\/components\/ui\/scales\.tsx/);
    const css = fs.readFileSync(path.join(cwd, "src", "app", "globals.css"), "utf8");
    assert.match(css, /--[\w-]+:/);
    run(cwd, "add", "scales", "--overwrite");
    assert.equal(fs.readFileSync(path.join(cwd, "src", "app", "globals.css"), "utf8"), css);
  });

  test("add keeps existing files unless --overwrite is passed", () => {
    const cwd = project();
    run(cwd, "add", "scales");
    const file = path.join(cwd, "src", "components", "ui", "scales.tsx");
    fs.writeFileSync(file, "local edit");

    const skipped = run(cwd, "add", "scales");
    assert.match(skipped.stdout, /Skipped existing files/);
    assert.equal(fs.readFileSync(file, "utf8"), "local edit");

    const replaced = run(cwd, "add", "scales", "-o");
    assert.match(replaced.stdout, /✓ Replaced src\/components\/ui\/scales\.tsx/);
    assert.notEqual(fs.readFileSync(file, "utf8"), "local edit");
  });

  test("add --overwrite refuses to write through a symbolic link", () => {
    const cwd = project();
    const outside = path.join(cwd, "outside.txt");
    fs.writeFileSync(outside, "outside");
    fs.mkdirSync(path.join(cwd, "src", "components", "ui"), { recursive: true });
    fs.symlinkSync(outside, path.join(cwd, "src", "components", "ui", "scales.tsx"));

    const result = run(cwd, "add", "scales", "--overwrite");
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Refusing to overwrite "src\/components\/ui\/scales\.tsx"/);
    assert.equal(fs.readFileSync(outside, "utf8"), "outside");
  });

  test("add installs access request helpers and delegates its standard avatar dependency", () => {
    const cwd = project();
    const result = run(cwd, "add", "access-request");
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Adding shadcn\/ui dependencies: utils, avatar/);
    for (const file of [
      "components/ui/access-request.tsx",
      "components/ui/access-request-row.tsx",
      "components/ui/access-request-state.ts",
      "components/ui/use-access-request-motion.ts",
      "lib/use-media-query.ts",
    ]) {
      assert.ok(fs.existsSync(path.join(cwd, "src", file)), `Missing ${file}`);
    }
    const component = fs.readFileSync(path.join(cwd, "src/components/ui/access-request.tsx"), "utf8");
    assert.match(component, /from "\.\/access-request-state"/);
    assert.match(component, /from "@\/components\/ui\/avatar"/);
  });

  test("add installs the prompt composer and all local helpers without a stylesheet", () => {
    const cwd = project();
    const cssPath = path.join(cwd, "src", "app", "globals.css");
    const originalCss = fs.readFileSync(cssPath, "utf8");
    const result = run(cwd, "add", "prompt-composer");
    assert.equal(result.status, 0, result.stderr);
    for (const name of ["prompt-composer.tsx", "prompt-composer-art.tsx", "prompt-composer-model.tsx", "prompt-composer-recorder.tsx", "prompt-composer-motion.ts"]) {
      const installed = path.join(cwd, "src", "components", "ui", name);
      assert.ok(fs.existsSync(installed), `Missing ${name}`);
      const source = fs.readFileSync(path.resolve(import.meta.dirname, "..", "src", "registry", "ui", name), "utf8");
      assert.equal(fs.readFileSync(installed, "utf8"), source);
    }
    assert.equal(fs.readFileSync(cssPath, "utf8"), originalCss);
    assert.match(result.stdout, /Adding shadcn\/ui dependencies: utils/);
  });

  test("add installs thinking panel with every helper and leaves app styles intact", () => {
    const cwd = project();
    const cssPath = path.join(cwd, "src", "app", "globals.css");
    const originalCss = fs.readFileSync(cssPath, "utf8");
    const result = run(cwd, "add", "thinking-panel");
    assert.equal(result.status, 0, result.stderr);
    for (const name of ["thinking-panel.tsx", "thinking-panel-types.ts", "use-thinking-panel-motion.ts", "thinking-panel-sources.tsx", "thinking-panel-spring.ts"]) {
      const installed = path.join(cwd, "src", "components", "ui", name);
      const source = path.resolve(import.meta.dirname, "..", "src", "registry", "ui", name);
      assert.equal(fs.readFileSync(installed, "utf8"), fs.readFileSync(source, "utf8"));
    }
    assert.equal(fs.readFileSync(cssPath, "utf8"), originalCss);
    assert.match(result.stdout, /Adding shadcn\/ui dependencies: utils/);
  });

  test("add warns instead of failing when the Tailwind CSS file is missing", () => {
    const cwd = project();
    fs.rmSync(path.join(cwd, "src", "app", "globals.css"));
    const result = run(cwd, "add", "scales");
    assert.equal(result.status, 0);
    assert.match(result.stderr, /Could not find your Tailwind CSS file/);
  });
});
