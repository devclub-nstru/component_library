import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";

const require = createRequire(import.meta.url);
const { webpack } = require("next/dist/compiled/webpack/webpack");
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const root = path.resolve(import.meta.dirname, "../..");
const temp = await mkdtemp(path.join(os.tmpdir(), "thinking-panel-props-"));
const baseUrl = process.env.BASE_URL || "http://localhost:3000";
let browser;

try {
  await writeFile(
    path.join(temp, "loader.cjs"),
    `const ts = require(${JSON.stringify(require.resolve("typescript"))}); module.exports = source => ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;`,
  );
  await writeFile(
    path.join(temp, "entry.tsx"),
    `
    import { createRoot } from 'react-dom/client';
    import { ThinkingPanel } from ${JSON.stringify(path.join(root, "src/registry/ui/thinking-panel.tsx"))};
    let root;
    const stats = { attached: 0, cleaned: 0, detached: 0, changes: [] };
    const cleanupRef = node => { if (node) { stats.attached++; return () => { stats.cleaned++; }; } };
    const legacyRef = node => { if (node) stats.attached++; else stats.detached++; };
    export const render = (props, mode = 'cleanup') => {
      root ??= createRoot(document.getElementById('fixture'));
      root.render(<ThinkingPanel {...props} ref={mode === 'cleanup' ? cleanupRef : legacyRef} onExpandedChange={next => stats.changes.push(next)} />);
    };
    export const read = () => stats;
    export const unmount = () => { root.unmount(); root = undefined; };
  `,
  );
  await new Promise((resolve, reject) => {
    const compiler = webpack({
      mode: "development",
      devtool: false,
      entry: path.join(temp, "entry.tsx"),
      output: {
        path: temp,
        filename: "bundle.js",
        library: { name: "ThinkingPanelFixture", type: "window" },
      },
      resolve: {
        extensions: [".tsx", ".ts", ".js"],
        modules: [path.join(root, "node_modules"), "node_modules"],
        alias: { "@": path.join(root, "src") },
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: path.join(temp, "loader.cjs"),
          },
        ],
      },
    });
    compiler.run((error, stats) =>
      compiler.close(() =>
        error || stats.hasErrors()
          ? reject(
              error || new Error(stats.toString({ all: false, errors: true })),
            )
          : resolve(),
      ),
    );
  });
  browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
    headless: true,
  });
  const app = await browser.newPage();
  await app.goto(`${baseUrl}/components/thinking-panel`, {
    waitUntil: "domcontentloaded",
  });
  const styles = await app
    .locator('link[rel="stylesheet"]')
    .evaluateAll((links) => links.map((link) => link.href));
  await app.close();
  const page = await browser.newPage({
    viewport: { width: 800, height: 700 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/api/health`);
  await page.setContent(
    '<div id="fixture" style="width:640px;padding:40px"></div>',
  );
  for (const url of styles) await page.addStyleTag({ url });
  await page.addScriptTag({ path: path.join(temp, "bundle.js") });
  const sources = [
    { id: "one", label: "Short source", href: "https://example.com" },
    { id: "two", label: "Second source", href: "javascript:alert(1)" },
  ];
  await page.evaluate(
    (sources) => window.ThinkingPanelFixture.render({ sources }),
    sources,
  );
  const panel = page.locator('[data-slot="thinking-panel"]');
  await panel.waitFor();
  await page.waitForTimeout(1200);
  assert.equal(
    (await page.evaluate(() => window.ThinkingPanelFixture.read())).attached,
    1,
    "timer renders must preserve the consumer ref",
  );
  assert.equal(
    await panel.getByRole("link").count(),
    1,
    "unsafe source URL must render without a link",
  );
  await panel.locator('[data-thinking-source="one"]').hover();
  const resized = [
    { ...sources[0], label: "A substantially longer source label" },
    sources[1],
  ];
  await page.evaluate(
    (sources) => window.ThinkingPanelFixture.render({ sources }),
    resized,
  );
  await page.waitForFunction(() => {
    const source = document
      .querySelector('[data-thinking-source="one"]')
      .getBoundingClientRect();
    const highlight = document
      .querySelector("[data-source-highlight]")
      .getBoundingClientRect();
    return (
      Math.abs(source.width - highlight.width) < 1 &&
      Math.abs(source.x - highlight.x) < 1
    );
  });
  await page.evaluate(() => window.ThinkingPanelFixture.unmount());
  assert.equal(
    (await page.evaluate(() => window.ThinkingPanelFixture.read())).cleaned,
    1,
    "React 19 ref cleanup must run exactly once",
  );
  await page.evaluate(() =>
    window.ThinkingPanelFixture.render(
      { expanded: false, status: "complete", elapsedSeconds: 12 },
      "legacy",
    ),
  );
  const header = panel.getByRole("button", { name: /Worked for/ });
  await header.click();
  assert.equal(
    await header.getAttribute("aria-expanded"),
    "false",
    "controlled disclosure waits for application state",
  );
  assert.deepEqual(
    (await page.evaluate(() => window.ThinkingPanelFixture.read())).changes,
    [true],
  );
  await page.evaluate(() =>
    window.ThinkingPanelFixture.render(
      { expanded: true, status: "complete", elapsedSeconds: 12 },
      "legacy",
    ),
  );
  await panel.getByText("No sources searched", { exact: true }).waitFor();
  assert.match(await header.textContent(), /12s/);
  await page.evaluate(() => window.ThinkingPanelFixture.unmount());
  const stats = await page.evaluate(() => window.ThinkingPanelFixture.read());
  assert.equal(stats.attached, 2);
  assert.equal(
    stats.detached,
    1,
    "legacy callback refs must receive null on unmount",
  );
  assert.deepEqual(errors, []);
  console.log(
    "Thinking Panel public-prop checks passed: live label/hover resizing, safe links, controlled disclosure/timer, empty state, stable React 19 refs and cleanup, legacy ref detachment.",
  );
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
