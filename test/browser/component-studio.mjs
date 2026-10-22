import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const spotlightSource = ts.createSourceFile(
  "spotlight-card.tsx",
  await readFile(new URL("../../src/registry/ui/spotlight-card.tsx", import.meta.url), "utf8"),
  ts.ScriptTarget.ES2022,
  true,
  ts.ScriptKind.TSX,
);
let spotlightHandler;
function findSpotlightHandler(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(spotlightSource) === "handleMouseMove") {
    spotlightHandler = node.initializer.getText(spotlightSource);
  }
  ts.forEachChild(node, findSpotlightHandler);
}
findSpotlightHandler(spotlightSource);
assert.ok(spotlightHandler);
const { outputText: spotlightFactory } = ts.transpileModule(
  `function createHandler(divRef, setPosition) { return ${spotlightHandler}; }`,
  { compilerOptions: { target: ts.ScriptTarget.ES2022 } },
);

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
  headless: true,
});
const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const errors = [];

async function open(page, slug) {
  await page.goto(`${baseUrl}/components/${slug}`);
  await page.locator(".studio-preview").waitFor();
  await page.waitForTimeout(900);
}

async function drag(page, locator, dx, dy) {
  const box = await locator.boundingBox();
  assert.ok(box);
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 12 });
  await page.mouse.up();
}

async function position(locator) {
  const box = await locator.boundingBox();
  assert.ok(box);
  return box;
}

async function setZoom(page, percent) {
  await page.getByRole("button", { name: "Reset canvas", exact: true }).click();
  const name = percent < 100 ? "Zoom out" : "Zoom in";
  for (let step = 0; step < Math.abs(percent - 100) / 10; step += 1) {
    await page.getByRole("button", { name, exact: true }).click();
  }
}

async function assertPixelGeometry(page, percent) {
  await setZoom(page, percent);
  await page.getByRole("button", { name: "Show customization", exact: true }).click();
  const controls = page.getByRole("region", { name: "Component customization", exact: true });
  await controls.getByRole("button", { name: "Sparse", exact: true }).click();
  await controls.getByRole("button", { name: "Cross", exact: true }).click();
  const card = page.getByLabel("Pixel card preview", { exact: true });
  const size = await card.evaluate((element) => {
    const canvas = element.querySelector("canvas");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    return {
      width: element.offsetWidth,
      height: element.offsetHeight,
      canvasWidth: parseFloat(canvas.style.width),
      canvasHeight: parseFloat(canvas.style.height),
      bufferWidth: canvas.width,
      bufferHeight: canvas.height,
      dpr,
    };
  });
  assert.equal(size.canvasWidth, size.width, `Pixel Card canvas width at ${percent}%`);
  assert.equal(size.canvasHeight, size.height, `Pixel Card canvas height at ${percent}%`);
  assert.equal(size.bufferWidth, Math.floor(size.width * size.dpr));
  assert.equal(size.bufferHeight, Math.floor(size.height * size.dpr));
  await controls.getByRole("button", { name: "Hide customization", exact: true }).click();
  for (const type of ["mouseover", "mousemove"]) {
    const pointer = await card.evaluate((element, eventType) => {
      const rect = element.getBoundingClientRect();
      element.dispatchEvent(new MouseEvent(eventType, {
        bubbles: true,
        clientX: rect.left + rect.width / 4,
        clientY: rect.top + rect.height * 3 / 4,
      }));
      return {
        x: parseFloat(element.style.getPropertyValue("--pointer-x")),
        y: parseFloat(element.style.getPropertyValue("--pointer-y")),
        expectedX: element.offsetWidth / 4,
        expectedY: element.offsetHeight * 3 / 4,
      };
    }, type);
    const tolerance = 100 / percent + 0.1;
    assert.ok(Math.abs(pointer.x - pointer.expectedX) < tolerance, `${type} x at ${percent}%: ${JSON.stringify(pointer)}`);
    assert.ok(Math.abs(pointer.y - pointer.expectedY) < tolerance, `${type} y at ${percent}%: ${JSON.stringify(pointer)}`);
  }
  await card.dispatchEvent("mouseout");
  await card.focus();
  const focus = await card.evaluate((element) => ({
    x: parseFloat(element.style.getPropertyValue("--pointer-x")),
    y: parseFloat(element.style.getPropertyValue("--pointer-y")),
    width: element.offsetWidth,
    height: element.offsetHeight,
  }));
  assert.equal(focus.x, focus.width / 2);
  assert.equal(focus.y, focus.height / 2);
  await card.blur();
  await page.getByRole("button", { name: "Show customization", exact: true }).click();
  await controls.getByRole("button", { name: "Reset", exact: true }).click();
  await controls.getByRole("button", { name: "Hide customization", exact: true }).click();
  const component = page.locator("[data-studio-component]");
  for (const mode of ["Move component", "Pan canvas"]) {
    await page.getByRole("button", { name: mode, exact: true }).click();
    const before = await position(component);
    await page.keyboard.press("ArrowRight");
    assert.ok(Math.abs((await position(component)).x - before.x - 10) < 1);
    await page.keyboard.press("Shift+ArrowDown");
    assert.ok(Math.abs((await position(component)).y - before.y - 50) < 1);
    await page.keyboard.press("Escape");
  }
}

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("same key")) {
      errors.push(message.text());
    }
  });
  await open(page, "gooey-nav");
  const nav = page.locator('[data-slot="gooey-nav"]');
  const preview = page.locator(".studio-preview");
  const navBox = await position(nav);
  const previewBox = await position(preview);
  assert.ok(
    Math.abs(navBox.x + navBox.width / 2 - previewBox.x - previewBox.width / 2) < 2,
    "Gooey Nav must be horizontally centered",
  );
  await nav.getByRole("tab").nth(1).click();
  assert.equal(await nav.getByRole("tab").nth(1).getAttribute("aria-selected"), "true");

  const component = page.locator("[data-studio-component]");
  const original = await position(component);
  await page.getByRole("button", { name: "Move component", exact: true }).click();
  const surface = page.getByRole("group", { name: "Move component on canvas", exact: true });
  await drag(page, surface, 120, 60);
  const moved = await position(component);
  assert.ok(Math.abs(moved.x - original.x - 120) < 3);
  assert.ok(Math.abs(moved.y - original.y - 60) < 3);
  await surface.press("ArrowRight");
  assert.ok(Math.abs((await position(component)).x - moved.x - 10) < 2);
  await surface.press("Escape");
  assert.equal(await surface.count(), 0);

  await page.getByRole("button", { name: "Pan canvas", exact: true }).click();
  await drag(page, page.getByRole("group", { name: "Pan infinite canvas", exact: true }), -90, -45);
  const panned = await position(component);
  assert.ok(Math.abs(panned.x - moved.x - 10 + 90) < 3);
  assert.ok(Math.abs(panned.y - moved.y + 45) < 3);
  assert.notEqual(await page.locator("[data-studio-grid]").evaluate((el) => el.style.backgroundPosition), "0px 0px");
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "Reset canvas", exact: true }).textContent(), "110%");
  await page.getByRole("button", { name: "Move component", exact: true }).click();
  const zoomed = await position(component);
  await drag(page, surface, 80, 40);
  const movedAtZoom = await position(component);
  assert.ok(Math.abs(movedAtZoom.x - zoomed.x - 80) < 3);
  assert.ok(Math.abs(movedAtZoom.y - zoomed.y - 40) < 3);
  for (let step = 0; step < 30; step += 1) await surface.press("Shift+ArrowRight");
  assert.ok((await position(component)).x - movedAtZoom.x > 1490);
  await page.getByRole("button", { name: "Reset canvas", exact: true }).click();
  const reset = await position(component);
  assert.ok(Math.abs(reset.x - original.x) < 2);
  assert.ok(Math.abs(reset.y - original.y) < 2);

  await page.getByRole("button", { name: "Move component", exact: true }).click();
  await page.getByRole("group", { name: "Move component on canvas", exact: true }).press("Shift+ArrowRight");
  await page.getByRole("link", { name: "Pixel Card", exact: true }).click();
  await page.getByLabel("Pixel card preview", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Show customization", exact: true }).waitFor();
  assert.equal(await page.locator("[data-studio-canvas]").count(), 1);
  await page.getByRole("group", { name: "Move component on canvas", exact: true }).waitFor({ state: "hidden", timeout: 5000 });
  assert.equal(await preview.getByText("Pixel Card Controls", { exact: true }).count(), 0);
  await page.getByRole("button", { name: "Show customization", exact: true }).click();
  const controls = page.getByRole("region", { name: "Component customization", exact: true });
  await controls.getByRole("button", { name: "Scan", exact: true }).click();
  await controls.getByRole("button", { name: "Violet", exact: true }).click();
  const swatch = controls.getByRole("button", { name: "Matrix", exact: true }).locator("span");
  assert.equal(await swatch.evaluate((element) => getComputedStyle(element).backgroundColor), "rgb(52, 211, 153)");
  assert.equal(await controls.getByRole("button", { name: "Scan", exact: true }).getAttribute("aria-pressed"), "true");
  assert.equal(await controls.getByRole("button", { name: "Violet", exact: true }).getAttribute("aria-pressed"), "true");
  const spotlight = page.getByLabel("Pixel card preview", { exact: true }).locator("div").first();
  assert.match(await spotlight.getAttribute("style"), /192, 132, 252/);
  await controls.getByRole("button", { name: "Turbo", exact: true }).click();
  await controls.getByRole("button", { name: "Glitch", exact: true }).click();
  await controls.getByRole("button", { name: "Sparse", exact: true }).click();
  await controls.getByRole("button", { name: "Reset", exact: true }).click();
  assert.equal(await controls.getByRole("button", { name: "Wave", exact: true }).getAttribute("aria-pressed"), "true");
  assert.equal(await controls.getByRole("button", { name: "Cyan", exact: true }).getAttribute("aria-pressed"), "true");
  assert.match(await spotlight.getAttribute("style"), /56, 189, 248/);
  assert.equal(await controls.getByRole("button", { name: "Normal", exact: true }).getAttribute("aria-pressed"), "true");
  assert.equal(await controls.getByRole("button", { name: "Off", exact: true }).getAttribute("aria-pressed"), "true");
  assert.equal(await controls.getByRole("button", { name: "Balanced", exact: true }).getAttribute("aria-pressed"), "true");
  await controls.getByRole("button", { name: "Hide customization", exact: true }).click();
  for (const percent of [50, 100, 150]) await assertPixelGeometry(page, percent);
  await page.getByRole("button", { name: "Reset canvas", exact: true }).click();
  await page.getByRole("button", { name: "Mobile (390px)", exact: true }).click();
  await page.waitForTimeout(900);
  assert.ok(await page.getByLabel("Pixel card preview", { exact: true }).isVisible());

  for (const percent of [50, 100, 150]) {
    await setZoom(page, percent);
    const pointer = await page.getByLabel("Pixel card preview", { exact: true }).evaluate((element, factory) => {
      const rect = element.getBoundingClientRect();
      let position;
      const createHandler = new Function(`${factory}; return createHandler;`)();
      const handleMouseMove = createHandler({ current: element }, (next) => { position = next; });
      handleMouseMove({
        clientX: rect.left + rect.width / 4,
        clientY: rect.top + rect.height * 3 / 4,
      });
      return { ...position, expectedX: element.offsetWidth / 4, expectedY: element.offsetHeight * 3 / 4 };
    }, spotlightFactory);
    assert.ok(Math.abs(pointer.x - pointer.expectedX) < 1, `Spotlight x at ${percent}%`);
    assert.ok(Math.abs(pointer.y - pointer.expectedY) < 1, `Spotlight y at ${percent}%`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await open(page, "pixel-card");
  await page.getByRole("button", { name: "Show customization", exact: true }).click();
  await controls.getByRole("button", { name: "Matrix", exact: true }).first().click();
  assert.ok(await controls.getByRole("button", { name: "Reset", exact: true }).isVisible());
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  if (process.env.SCREENSHOT_DIR) {
    await mkdir(process.env.SCREENSHOT_DIR, { recursive: true });
    await page.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, "studio-mobile.png") });
  }
  assert.deepEqual(errors, []);
  console.log("Component Studio browser checks passed");
} finally {
  await browser.close();
}
