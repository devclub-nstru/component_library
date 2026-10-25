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
const temp = await mkdtemp(path.join(os.tmpdir(), "meet-team-props-"));
const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const members = Array.from({ length: 9 }, (_, index) => ({
  id: String(index),
  name: `Member ${index}`,
  role: "Designer",
  image: "",
}));
let browser;

try {
  await writeFile(
    path.join(temp, "loader.cjs"),
    `const ts = require(${JSON.stringify(require.resolve("typescript"))}); module.exports = source => ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;`,
  );
  await writeFile(
    path.join(temp, "entry.tsx"),
    `
    import { useState } from 'react';
    import { createRoot } from 'react-dom/client';
    import { MeetTeam } from ${JSON.stringify(path.join(root, "src/registry/ui/meet-team.tsx"))};
    let root, controls;
    let changes = [];
    function Fixture({ initialMembers }) {
      const [members, setMembers] = useState(initialMembers);
      const [selected, setSelected] = useState(null);
      const [revision, setRevision] = useState(0);
      controls = { setMembers, rerender: () => setRevision(value => value + 1) };
      return <div data-revision={revision} data-selected={selected} style={{ width: 1100, height: 650, display: 'flex' }}>
        <MeetTeam members={members.map(member => ({ ...member }))} className="h-full" onMemberChange={member => { changes.push(member); setSelected(member.id); }} />
      </div>;
    }
    export const mount = members => { root?.unmount(); changes = []; root = createRoot(document.getElementById('fixture')); root.render(<Fixture initialMembers={members} />); };
    export const update = members => controls.setMembers(members);
    export const rerender = () => controls.rerender();
    export const read = () => changes;
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
        library: { name: "MeetTeamFixture", type: "window" },
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
  const page = await browser.newPage({
    viewport: { width: 1280, height: 850 },
    reducedMotion: "no-preference",
  });
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/api/health`);
  const app = await browser.newPage();
  await app.goto(baseUrl, { waitUntil: "domcontentloaded" });
  const styles = await app
    .locator('link[rel="stylesheet"]')
    .evaluateAll((links) => links.map((link) => link.href));
  await app.close();
  await page.setContent('<div id="fixture"></div>');
  for (const url of styles) await page.addStyleTag({ url });
  await page.addScriptTag({ path: path.join(temp, "bundle.js") });
  const failures = [];
  const mount = async (items = members) => {
    await page.evaluate((items) => window.MeetTeamFixture.mount(items), items);
    await page.locator('[data-slot="meet-team"]').waitFor();
    await page.mouse.move(1200, 800);
    await page.waitForTimeout(100);
  };
  const selected = () => page.locator('[data-team-card][aria-pressed="true"]');
  const offset = () =>
    selected().evaluate((card) => {
      const c = card.getBoundingClientRect(),
        s = card.parentElement.getBoundingClientRect();
      return Math.abs(c.x + c.width / 2 - s.x - s.width / 2);
    });
  const centered = () =>
    page.waitForFunction(() => {
      const card = document.querySelector(
        '[data-team-card][aria-pressed="true"]',
      );
      if (!card) return false;
      const c = card.getBoundingClientRect(),
        s = card.parentElement.getBoundingClientRect();
      return Math.abs(c.x + c.width / 2 - s.x - s.width / 2) < 0.5;
    });
  const check = async (name, run) => {
    await mount();
    try {
      await run();
      console.log(`PASS ${name}`);
    } catch (error) {
      failures.push(`${name}: ${error.message}`);
      console.error(`FAIL ${name}: ${error.message}`);
    }
  };

  await check("fresh member arrays preserve spring motion", async () => {
    await page
      .getByRole("button", { name: "Next team member", exact: true })
      .click();
    assert.equal(
      await selected().getAttribute("aria-label"),
      "Member 5, Designer",
    );
    assert.ok(
      (await offset()) > 10,
      "parent state updates must not snap the spring to its target",
    );
    await centered();
  });
  await check("fresh member arrays preserve an entire drag", async () => {
    const stage = await page.locator("[data-team-stage]").boundingBox();
    const x = stage.x + stage.width / 2,
      y = stage.y + stage.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 500, y, { steps: 30 });
    await page.mouse.up();
    await centered();
    assert.equal(
      await selected().getAttribute("aria-label"),
      "Member 6, Designer",
    );
  });
  await check("pointer leave settles the selected portrait", async () => {
    const stage = await page.locator("[data-team-stage]").boundingBox();
    await page.mouse.move(stage.x + stage.width * 0.56, stage.y + 20);
    await page.mouse.move(
      stage.x + stage.width * 0.56,
      stage.y + stage.height + 10,
    );
    await centered();
  });
  await check("asynchronously loaded members start in the middle", async () => {
    await mount([]);
    await page.evaluate(
      (items) => window.MeetTeamFixture.update(items),
      members,
    );
    await page.locator("[data-team-card]").first().waitFor();
    assert.equal(
      await selected().getAttribute("aria-label"),
      "Member 4, Designer",
    );
    await centered();
  });
  await check(
    "content edits preserve selection and update callback objects",
    async () => {
      await page.evaluate(
        (items) => window.MeetTeamFixture.update(items),
        members.map((member) => ({ ...member, role: "Updated role" })),
      );
      await page
        .getByRole("button", { name: "Next team member", exact: true })
        .click();
      await centered();
      const changes = await page.evaluate(() => window.MeetTeamFixture.read());
      assert.equal(changes.at(-1).role, "Updated role");
      assert.equal(changes.at(-1).id, "5");
    },
  );
  await check("reorders and removals keep valid selection", async () => {
    await page
      .getByRole("button", { name: "Next team member", exact: true })
      .click();
    await centered();
    await page.evaluate(
      (items) => window.MeetTeamFixture.update(items),
      [...members].reverse(),
    );
    await centered();
    assert.equal(
      await selected().getAttribute("aria-label"),
      "Member 5, Designer",
    );
    await page.evaluate(
      (items) => window.MeetTeamFixture.update(items),
      members.filter((member) => member.id !== "5"),
    );
    await centered();
    assert.equal(
      await selected().getAttribute("aria-label"),
      "Member 4, Designer",
    );
  });
  await page.evaluate(() => window.MeetTeamFixture.unmount());
  await page.mouse.move(500, 300);
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  console.log(
    "Meet Team public-prop regressions passed without React Compiler.",
  );
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
