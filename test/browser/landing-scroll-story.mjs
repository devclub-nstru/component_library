import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  colorScheme: "light",
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const story = page.getByRole("region", { name: "Interfaces with a pulse", exact: true });
const words = story.locator("[data-scroll-word]");

async function finished() {
  await page.waitForFunction(() => {
    const words = Array.from(document.querySelectorAll("#scroll-story-heading + p [data-scroll-word], #scroll-story-heading + p [data-scroll-ink]"));
    return words.length > 0 && words.every((word) => Number(getComputedStyle(word).opacity) > 0.98);
  });
}

async function screenshot(name) {
  if (!process.env.SCREENSHOT_DIR) return;
  await mkdir(process.env.SCREENSHOT_DIR, { recursive: true });
  await story.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, `${name}.png`) });
}

try {
  await page.goto(process.env.BASE_URL || "http://localhost:3000");
  await story.waitFor();
  await page.waitForTimeout(1000);
  const seam = await story.evaluate((section) => ({
    top: section.getBoundingClientRect().top,
    heroBottom: section.previousElementSibling.getBoundingClientRect().bottom,
    background: getComputedStyle(section).backgroundColor,
    heroBackground: getComputedStyle(section.previousElementSibling).backgroundColor,
  }));
  assert.ok(Math.abs(seam.top - seam.heroBottom) < 1);
  const gap = await story.locator("p").evaluate((paragraph) => paragraph.getBoundingClientRect().top - paragraph.closest("section").getBoundingClientRect().top);
  assert.ok(gap <= 64, "The paragraph sits close to the hero");
  assert.equal(seam.background, seam.heroBackground);
  assert.equal(await story.evaluate((section) => getComputedStyle(section).borderTopWidth), "0px");
  const typography = await story.locator("p").evaluate((paragraph) => {
    const style = getComputedStyle(paragraph);
    const lines = new Set(Array.from(paragraph.querySelectorAll("[data-scroll-word]")).map((word) => Math.round(word.getBoundingClientRect().top)));
    return { lines: lines.size, size: parseFloat(style.fontSize) };
  });
  assert.ok(typography.size <= 40, "The story uses medium-size typography");
  assert.ok(typography.lines >= 4 && typography.lines <= 5, "The desktop copy fits four or five lines");
  assert.equal(await story.locator("[data-hero-art]").count(), 0, "The scroll section has no mosaic artwork");
  const mosaic = await page.locator("[data-hero-art]").evaluate((art) => ({
    bottom: art.getBoundingClientRect().bottom,
    heroBottom: document.querySelector("#hero-heading").closest("section").getBoundingClientRect().bottom,
    insideHero: document.querySelector("#hero-heading").closest("section").contains(art),
  }));
  assert.ok(mosaic.insideHero && mosaic.bottom <= mosaic.heroBottom + 1, "Mosaic artwork stays inside the hero");
  assert.equal(await story.locator(".sr-only").filter({ hasText: "DevClub UI brings tactile components," }).count(), 1);
  assert.ok(await words.first().evaluate((word) => Number(getComputedStyle(word).opacity) < 0.3));

  const middle = await story.locator("p").evaluate((paragraph) => {
    const bounds = paragraph.getBoundingClientRect();
    return (bounds.top + scrollY - innerHeight * 0.9 + bounds.bottom + scrollY - innerHeight * 0.8) / 2;
  });
  await page.evaluate((position) => scrollTo(0, position), middle);
  await page.waitForFunction(() => {
    const words = document.querySelectorAll("#scroll-story-heading + p [data-scroll-word]");
    return Number(getComputedStyle(words[0]).opacity) > 0.8
      && Number(getComputedStyle(words[words.length - 1]).opacity) < 0.8;
  });

  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await finished();
  await screenshot("scroll-story-light");
  await page.getByRole("button", { name: "Switch to dark theme", exact: true }).click();
  await page.waitForTimeout(650);
  await finished();
  assert.equal(await story.evaluate((section) => getComputedStyle(section).backgroundColor), "rgb(0, 0, 0)");
  await screenshot("scroll-story-dark");

  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.waitForTimeout(1000);
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await finished();
    assert.ok(await story.evaluate((section) => {
      const bounds = section.querySelector("p").getBoundingClientRect();
      return bounds.left >= 20 && bounds.right <= innerWidth - 20
        && document.documentElement.scrollWidth <= innerWidth;
    }));
    await screenshot(`scroll-story-${width}`);
  }

  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForFunction(() => Number(getComputedStyle(document.querySelector("[data-scroll-word]")).opacity) < 0.3);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await finished();
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await screenshot("scroll-story-reduced");
  assert.deepEqual(errors, []);
  console.log("Scroll story passed: hero alignment, progressive and reversible reveal, fully reachable ending, themes, 320px/390px layouts, and reduced motion.");
} finally {
  await browser.close();
}
