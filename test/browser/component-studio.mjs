import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";

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

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
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
  await page.getByRole("button", { name: "Mobile (390px)", exact: true }).click();
  await page.waitForTimeout(900);
  assert.ok(await page.getByLabel("Pixel card preview", { exact: true }).isVisible());

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
