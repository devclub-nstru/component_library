import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
  headless: true,
});
const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const context = await browser.newContext({
  viewport: { width: 1440, height: 1050 },
  colorScheme: "light",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const section = page.getByRole("region", { name: "What’s inside.", exact: true });
const cards = section.locator("[data-landing-feature]");
const card = (name) => section.getByRole("article", { name, exact: true });

async function reveal() {
  for (const item of await cards.all()) {
    await item.scrollIntoViewIfNeeded();
    await page.waitForFunction((element) => getComputedStyle(element).opacity === "1", await item.elementHandle());
  }
}

async function geometry(width) {
  await page.mouse.move(0, 0);
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  await page.waitForTimeout(650);
  const bounds = await cards.evaluateAll((items) => items.map((item) => {
    const card = item.getBoundingClientRect();
    const preview = item.querySelector("[data-feature-preview]").getBoundingClientRect();
    const heading = item.querySelector("h3").getBoundingClientRect();
    return { left: card.left, right: card.right, top: card.top, height: card.height, previewHeight: preview.height, headingTop: heading.top - card.top };
  }));
  assert.equal(bounds.length, 6);
  assert.ok(bounds.every((item) => item.left >= 19 && item.right <= width - 19), "Cards fit inside the page gutters");
  assert.ok(bounds.every((item) => item.previewHeight === bounds[0].previewHeight && Math.abs(item.headingTop - bounds[0].headingTop) < 1), "Preview and heading alignment is consistent");
  if (width >= 1280) {
    assert.ok(bounds.slice(0, 3).every((item) => Math.abs(item.top - bounds[0].top) < 1));
    assert.ok(bounds.slice(3).every((item) => Math.abs(item.top - bounds[3].top) < 1));
    assert.ok(bounds.every((item) => Math.abs(item.height - bounds[0].height) < 1), "Desktop cards share a row height");
  }
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "No page overflow");
}

async function screenshot(name) {
  if (!process.env.SCREENSHOT_DIR) return;
  await mkdir(process.env.SCREENSHOT_DIR, { recursive: true });
  await page.evaluate((top) => scrollTo(0, top - 110), await section.evaluate((element) => element.getBoundingClientRect().top + scrollY));
  await section.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, `${name}.png`) });
}

try {
  await page.goto(baseUrl);
  await section.waitFor();
  assert.ok(await section.evaluate((element) => element.previousElementSibling.getAttribute("aria-labelledby") === "scroll-story-heading"));
  assert.equal(await section.getByText(/Plenty of personality|Real components\. Right here|give your cursor|Hover, click, repeat/).count(), 0);
  assert.equal(await section.getByText(/^0[1-6]\s*(Buttons|Controls|Navigation|Curved Navbar|Orb|Clocks)$/).count(), 0, "Numbered category labels are removed");
  await reveal();
  await geometry(1440);

  const buttons = card("Built to be pressed.");
  await buttons.scrollIntoViewIfNeeded();
  const mosaic = buttons.locator("[data-feature-mosaic]");
  assert.equal(await section.locator("[data-feature-mosaic]").count(), 6);
  assert.equal(await mosaic.evaluate((canvas) => getComputedStyle(canvas).filter), "blur(1.5px)", "Mosaic backgrounds have a subtle blur");
  assert.equal(await buttons.locator("[data-feature-demo]").evaluate((element) => getComputedStyle(element).filter), "none", "Live controls stay sharp");
  assert.equal(await buttons.locator("h3").evaluate((element) => getComputedStyle(element).filter), "none", "Card copy stays sharp");
  const pixels = await mosaic.evaluate((canvas) => canvas.toDataURL());
  await page.waitForFunction(({ canvas, pixels }) => canvas.toDataURL() !== pixels, { canvas: await mosaic.elementHandle(), pixels });
  await buttons.hover({ position: { x: 20, y: 20 } });
  await page.waitForTimeout(650);
  assert.ok(await buttons.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m42 < -3), "Hover gently lifts the card");
  assert.ok(await mosaic.evaluate((canvas) => Number(getComputedStyle(canvas).opacity) > 0.7), "Hover reveals more of the mosaic");
  await page.mouse.move(0, 0);
  await page.waitForTimeout(650);
  assert.ok(await buttons.evaluate((element) => Math.abs(new DOMMatrix(getComputedStyle(element).transform).m42) < 0.1), "Card motion settles back to its aligned position");
  const candy = buttons.getByRole("button", { name: "Give it a click", exact: true });
  await candy.click();
  assert.equal(await buttons.getByRole("button", { name: "Feels good, right?", exact: true }).getAttribute("aria-pressed"), "true");
  const reset = buttons.getByRole("button", { name: "Reset the button demo" });
  await reset.hover();
  await reset.focus();
  await reset.press("Enter");
  assert.equal(await candy.getAttribute("aria-pressed"), "false");

  const controls = card("Your kind of precise.");
  const slider = controls.getByRole("slider");
  await slider.focus();
  await slider.press("ArrowRight");
  assert.equal(await slider.getAttribute("aria-valuenow"), "65");
  const toggle = controls.getByRole("switch", { name: "Enable personality" });
  await toggle.focus();
  await toggle.press("Space");
  assert.equal(await toggle.getAttribute("aria-checked"), "false");
  assert.equal(await slider.getAttribute("aria-disabled"), "true");

  const nav = card("Find your flow.");
  await nav.getByRole("tab", { name: "Buttons", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await nav.getByRole("tab", { name: "Motion", exact: true }).getAttribute("aria-selected"), "true");
  assert.equal(await nav.getByRole("link", { name: "Explore motion", exact: true }).getAttribute("href"), "/components/scroll-text");

  const curved = card("A better way around.");
  const open = curved.getByRole("button", { name: "Open navigation", exact: true });
  await open.click();
  assert.equal(await curved.getByRole("button", { name: "Close navigation", exact: true }).getAttribute("aria-expanded"), "true");
  await curved.getByRole("link", { name: "Documentation", exact: true }).waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await open.getAttribute("aria-expanded"), "false");
  assert.equal(await open.evaluate((element) => document.activeElement === element), true, "Closing the menu restores focus");

  const orb = card("A thought with some presence.");
  const orbButton = orb.getByRole("button", { name: /^Orb state is/ });
  await orbButton.hover();
  await orbButton.focus();
  await orbButton.press("Enter");
  assert.equal(await orbButton.getAttribute("aria-label"), "Orb state is solving. Click to cycle state.");
  await orb.locator("canvas").waitFor();
  await orb.locator("canvas").evaluate((element) => { element.dataset.continuityCheck = "present"; });

  const clock = card("Good timing is everything.");
  await clock.getByRole("button", { name: "Use 12-hour time" }).click();
  assert.equal(await clock.getByRole("button", { name: "Use 12-hour time" }).getAttribute("aria-pressed"), "true");
  const timer = clock.getByRole("timer");
  const before = await timer.textContent();
  await page.waitForFunction(({ element, before }) => element.textContent !== before, { element: await timer.elementHandle(), before });

  await screenshot("inside-light");
  await page.getByRole("button", { name: "Switch to dark theme", exact: true }).click();
  await page.waitForTimeout(700);
  assert.equal(await section.evaluate((element) => getComputedStyle(element).backgroundColor), "rgb(0, 0, 0)");
  assert.equal(await buttons.evaluate((element) => getComputedStyle(element).backgroundColor), "rgb(0, 0, 0)");
  assert.equal(await toggle.getAttribute("aria-checked"), "false", "Theme changes preserve demo state");
  assert.equal(await slider.getAttribute("aria-valuenow"), "65");
  assert.equal(await orbButton.getAttribute("aria-label"), "Orb state is solving. Click to cycle state.");
  assert.equal(await orb.locator("canvas").getAttribute("data-continuity-check"), "present", "Theme changes preserve the orb instance");
  assert.equal(await nav.getByRole("tab", { name: "Motion", exact: true }).getAttribute("aria-selected"), "true");
  await screenshot("inside-dark");

  for (const width of [1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await reveal();
    await geometry(width);
    await curved.getByRole("button", { name: "Open navigation", exact: true }).click();
    await page.waitForTimeout(750);
    assert.ok(await curved.evaluate((element) => {
      const menu = element.querySelector("nav").getBoundingClientRect();
      const preview = element.querySelector("[data-feature-preview]").getBoundingClientRect();
      return menu.left >= preview.left && menu.right <= preview.right && menu.top >= preview.top && menu.bottom <= preview.bottom;
    }), "The open curved menu stays inside its preview");
    await page.keyboard.press("Escape");
    await screenshot(`inside-dark-${width}`);
  }
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.getByRole("button", { name: "Switch to light theme", exact: true }).click();
  await reveal();
  await geometry(320);
  assert.equal(await section.evaluate((element) => getComputedStyle(element).backgroundColor), "rgb(247, 247, 242)");
  await buttons.scrollIntoViewIfNeeded();
  const reducedPixels = await mosaic.evaluate((canvas) => canvas.toDataURL());
  await buttons.hover({ position: { x: 20, y: 20 } });
  await page.waitForTimeout(350);
  assert.equal(await mosaic.evaluate((canvas) => canvas.toDataURL()), reducedPixels, "Mosaic animation stops for reduced motion");
  assert.ok(await buttons.evaluate((element) => Math.abs(new DOMMatrix(getComputedStyle(element).transform).m42) < 0.1), "Reduced motion disables card lifting");
  await screenshot("inside-light-320-reduced");

  await section.getByRole("link", { name: "Explore clocks", exact: true }).click();
  await page.waitForURL("**/components/flip-clock");
  await page.goBack();
  await section.waitFor();
  await reveal();
  assert.equal(await cards.count(), 6);
  assert.deepEqual(errors, []);
  console.log("Landing components passed: mosaic motion, hover settling, reduced motion, live button, slider, switch, navigation, curved menu, Orb and clock interactions; state continuity, responsive alignment, themes and route cleanup.");
} finally {
  await browser.close();
}
