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

async function open(options = {}) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    colorScheme: "light",
    ...options,
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(baseUrl);
  await page.waitForFunction(() => {
    const canvas = document.querySelector("[data-hero-mosaic]");
    return canvas && canvas.width === Math.round(canvas.clientWidth * Math.min(devicePixelRatio, 2));
  });
  await page.waitForTimeout(1600);
  return page;
}

async function pixels(page) {
  return page.locator("[data-hero-mosaic]").evaluate((canvas) => canvas.toDataURL());
}

async function moving(page, previous) {
  await page.waitForFunction(
    (image) => document.querySelector("[data-hero-mosaic]").toDataURL() !== image,
    previous,
    { timeout: 10000 },
  );
}

async function changeTheme(page, theme) {
  const capture = page.evaluate((nextTheme) => new Promise((resolve, reject) => {
    const canvas = document.querySelector("[data-hero-mosaic]");
    const context = canvas.getContext("2d");
    const colors = [];
    let resets = 0;
    const observer = new MutationObserver((records) => { resets += records.length; });
    observer.observe(canvas, { attributes: true, attributeFilter: ["width", "height"] });
    const start = performance.now();
    const sample = () => {
      colors.push(Array.from(context.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data).slice(0, 3));
      const expected = nextTheme === "dark" ? 0 : 247;
      const settled = document.documentElement.classList.contains("dark") === (nextTheme === "dark")
        && colors.length > 1 && colors.at(-1)[0] === expected;
      if (settled) {
        observer.disconnect();
        resolve({ colors, resets, sameCanvas: document.querySelector("[data-hero-mosaic]") === canvas });
      } else if (performance.now() - start > 8000) {
        observer.disconnect();
        reject(new Error("Theme palette did not finish transitioning"));
      } else {
        requestAnimationFrame(sample);
      }
    };
    requestAnimationFrame(sample);
  }), theme);
  await page.getByRole("button", { name: `Switch to ${theme} theme`, exact: true }).click();
  const { colors, resets, sameCanvas } = await capture;
  assert.ok(sameCanvas, "Theme switching preserves the live canvas");
  assert.equal(resets, 0, "Theme switching never clears or resizes the running canvas");
  const intermediate = new Set(colors.filter(([red]) => red > 0 && red < 247).map((color) => color.join(",")));
  assert.ok(intermediate.size >= 3, "The palette blends smoothly between themes");
  assert.deepEqual(colors.at(-1), theme === "dark" ? [0, 0, 0] : [247, 247, 242]);
}

async function aligned(page) {
  const geometry = await page.locator("#hero-heading").evaluate((heading) => {
    const hero = heading.closest("section").getBoundingClientRect();
    const title = heading.getBoundingClientRect();
    const copy = heading.parentElement.getBoundingClientRect();
    return {
      offset: Math.abs(title.x + title.width / 2 - hero.x - hero.width / 2),
      overflow: document.documentElement.scrollWidth > innerWidth,
      fits: title.left >= 20 && title.right <= innerWidth - 20,
      centered: Math.abs(copy.y + copy.height / 2 - hero.y - hero.height / 2) < 14,
    };
  });
  assert.ok(geometry.offset < 1, "Heading stays horizontally centered");
  assert.ok(!geometry.overflow, "No horizontal overflow");
  assert.ok(geometry.fits, "Heading fits inside the viewport");
  assert.ok(geometry.centered, "Copy and actions remain vertically balanced");
}

async function screenshot(page, name) {
  if (!process.env.SCREENSHOT_DIR) return;
  await mkdir(process.env.SCREENSHOT_DIR, { recursive: true });
  await page.screenshot({
    path: path.join(process.env.SCREENSHOT_DIR, `${name}.png`),
    fullPage: true,
  });
}

try {
  const page = await open();
  await aligned(page);
  assert.equal(await page.getByRole("heading", { level: 1 }).count(), 1);
  assert.equal(await page.getByRole("button", { name: /hero animation/ }).count(), 0);
  assert.equal(await page.getByText("Crafted for the interaction").count(), 0);
  const primary = page.getByRole("link", { name: "Explore components", exact: true });
  assert.equal(await primary.getAttribute("href"), "/components");
  assert.equal(await page.getByRole("link", { name: "Read the docs", exact: true }).getAttribute("href"), "/docs");
  assert.ok(await primary.evaluate((link) => parseFloat(getComputedStyle(link).borderRadius) > 20));
  const finish = await primary.evaluate((link) => getComputedStyle(link).backgroundImage);
  assert.match(finish, /radial-gradient/);
  assert.match(finish, /rgb\(0, 116, 212\)/);
  assert.equal(await page.locator("section[aria-labelledby=hero-heading]").getByText(/Tailwind CSS/).count(), 0);
  assert.equal(await page.locator("[data-hero-art] [data-atelier-webgl] canvas").count(), 1);
  const initial = await pixels(page);
  await page.waitForTimeout(500);
  await moving(page, initial);
  await screenshot(page, "hero-desktop");

  for (const theme of ["light", "dark"]) {
    if (theme === "dark") {
      await changeTheme(page, "dark");
    }
    const center = await page.locator("[data-hero-mosaic]").evaluate((canvas) =>
      Array.from(canvas.getContext("2d").getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data).slice(0, 3),
    );
    assert.deepEqual(center, theme === "dark" ? [0, 0, 0] : [247, 247, 242]);
    for (const width of [768, 390, 320, 1440]) {
      await page.setViewportSize({ width, height: width < 640 ? 844 : 1000 });
      await page.waitForTimeout(500);
      await aligned(page);
      const source = await page.locator("[data-hero-mosaic]").boundingBox();
      const rendered = await page.locator("[data-hero-art] [data-atelier-webgl] canvas").boundingBox();
      assert.ok(source && rendered);
      assert.ok(Math.abs(source.width - rendered.width) < 1);
      assert.ok(Math.abs(source.height - rendered.height) < 1);
      await screenshot(page, `hero-${theme}-${width}`);
    }
  }

  await changeTheme(page, "light");
  await changeTheme(page, "dark");
  const afterThemeChanges = await pixels(page);
  await moving(page, afterThemeChanges);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  const still = await pixels(page);
  await page.waitForTimeout(500);
  assert.equal(await pixels(page), still, "Reduced motion stops the mosaic");
  assert.equal(await page.locator("[data-hero-art] [data-atelier-webgl]").count(), 0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(400);
  const resumed = await pixels(page);
  await page.waitForTimeout(400);
  await moving(page, resumed);
  await page.getByRole("link", { name: "Read the docs", exact: true }).click();
  await page.waitForURL("**/docs");
  await page.goBack();
  await page.locator("[data-hero-mosaic]").waitFor();
  await page.waitForTimeout(1600);
  const remounted = await pixels(page);
  await page.waitForTimeout(400);
  await moving(page, remounted);
  await page.close();

  const reduced = await open({
    reducedMotion: "reduce",
    deviceScaleFactor: 2,
    viewport: { width: 390, height: 844 },
  });
  await aligned(reduced);
  const palette = await reduced.locator("[data-hero-mosaic]").evaluate((canvas) => {
    const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    let brand = 0;
    let pink = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      const [red, green, blue] = pixels.slice(index, index + 3);
      if (red === 0 && green === 128 && blue === 252) brand++;
      if (red > 150 && blue > green * 1.05 && red > green * 1.1) pink++;
    }
    return { brand, pink };
  });
  assert.ok(palette.brand > 0, "Filled tiles use the logo blue");
  assert.equal(palette.pink, 0, "The mosaic contains no pink tiles");
  const staticFrame = await pixels(reduced);
  await reduced.waitForTimeout(500);
  assert.equal(await pixels(reduced), staticFrame);
  await screenshot(reduced, "hero-reduced-motion");
  await reduced.close();
  assert.deepEqual(errors, []);
  console.log("Hero checks passed: alignment, continuous theme changes, logo-blue tiles, light/dark themes, CandyButton finishes, responsive resizing, live Liquid Media, animation, reduced motion, and navigation cleanup.");
} finally {
  await browser.close();
}
