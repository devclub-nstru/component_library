import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const output = process.env.SCREENSHOT_DIR;
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
  headless: true,
});
const errors = [];

async function openPage(options = {}) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    ...options,
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/components/thinking-panel`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.locator('[data-slot="thinking-panel"]').waitFor();
  return page;
}

async function screenshot(page, name) {
  if (!output) return;
  await mkdir(output, { recursive: true });
  await page
    .locator('[data-slot="thinking-panel-demo"]')
    .screenshot({ path: path.join(output, `${name}.png`) });
}

async function settled(page) {
  await page.waitForFunction(() => {
    const panel = document.querySelector('[data-slot="thinking-panel"]');
    const body = panel.querySelector('[id$="-content"]');
    return (
      body &&
      Math.abs(
        body.getBoundingClientRect().height -
          body.firstElementChild.getBoundingClientRect().height,
      ) < 1
    );
  });
  await page.waitForTimeout(700);
}

async function highlightAligned(page, id) {
  await page.waitForFunction((sourceId) => {
    const target = document.querySelector(
      `[data-thinking-source="${sourceId}"]`,
    );
    const highlight = document.querySelector("[data-source-highlight]");
    if (!target || !highlight) return false;
    const source = target.getBoundingClientRect();
    const bounds = highlight.getBoundingClientRect();
    return (
      Number(getComputedStyle(highlight).opacity) > 0.99 &&
      Math.abs(source.x - bounds.x) < 1 &&
      Math.abs(source.y - bounds.y) < 1 &&
      Math.abs(source.width - bounds.width) < 1 &&
      Math.abs(source.height - bounds.height) < 1
    );
  }, id);
}

try {
  const page = await openPage();
  const panel = page.locator('[data-slot="thinking-panel"]');
  const header = panel.getByRole("button", {
    name: /^(Thinking|Worked for|Interrupted after)/,
  });
  await panel.locator("[data-thinking-source]").first().waitFor();
  assert.equal(await panel.locator("[data-thinking-source]").count(), 4);
  await panel
    .getByRole("button", { name: "Show 3 more sources", exact: true })
    .click();
  assert.equal(await panel.locator("[data-thinking-source]").count(), 7);
  await panel.getByRole("link", { name: /Airbnb/ }).focus();
  await page.keyboard.press("Escape");
  assert.equal(await panel.locator("[data-thinking-source]").count(), 4);
  assert.equal(
    await panel
      .getByRole("button", { name: "Show 3 more sources", exact: true })
      .evaluate((node) => node === document.activeElement),
    true,
  );
  await page.waitForFunction(
    () =>
      document.querySelector('[data-slot="thinking-panel"]').dataset.status ===
      "complete",
    { timeout: 15000 },
  );
  assert.equal(await panel.locator('[data-thinking-row^="step-"]').count(), 4);
  await settled(page);
  assert.match(await header.textContent(), /Worked for/);
  assert.equal(await panel.locator("[data-brand-logo]").count(), 4);
  await panel.locator('[data-thinking-source="slack"]').hover();
  await highlightAligned(page, "slack");
  const slackBounds = await panel
    .locator('[data-thinking-source="slack"]')
    .boundingBox();
  await page.mouse.move(
    slackBounds.x + slackBounds.width + 3,
    slackBounds.y + slackBounds.height / 2,
    { steps: 12 },
  );
  await page.waitForTimeout(220);
  assert.ok(
    await panel
      .locator("[data-source-highlight]")
      .evaluate((node) => Number(getComputedStyle(node).opacity) > 0.99),
    "highlight must remain visible in chip gaps",
  );

  await panel.locator('[data-thinking-source="x"]').hover();
  await highlightAligned(page, "x");
  await screenshot(page, "thinking-panel-hover");
  await panel.locator('[data-thinking-source="notion"]').focus();
  await highlightAligned(page, "notion");
  for (const source of ["slack", "x", "wikipedia", "notion", "slack"])
    await panel.locator(`[data-thinking-source="${source}"]`).hover();
  await highlightAligned(page, "slack");
  await header.focus();
  await page.mouse.move(20, 20);
  await page.waitForFunction(
    () =>
      Number(
        getComputedStyle(document.querySelector("[data-source-highlight]"))
          .opacity,
      ) === 0,
  );
  const finished = await header.textContent();
  await page.waitForTimeout(1100);
  assert.equal(
    await header.textContent(),
    finished,
    "completed timer must stop",
  );
  assert.equal(
    await panel.getByRole("status").textContent(),
    "Finished thinking",
  );
  for (const link of await panel.getByRole("link").all()) {
    assert.match(await link.getAttribute("href"), /^https:\/\//);
    assert.equal(await link.getAttribute("rel"), "noopener noreferrer");
    assert.equal(await link.getAttribute("target"), "_blank");
  }
  await page.mouse.move(20, 20);
  await screenshot(page, "thinking-panel-light");

  await header.focus();
  await page.keyboard.press("Enter");
  assert.equal(await header.getAttribute("aria-expanded"), "false");
  assert.equal(
    await panel.locator('[id$="-content"]').evaluate((node) => node.inert),
    true,
  );
  await page.waitForTimeout(700);
  assert.ok((await panel.boundingBox()).height < 56);
  await page.keyboard.press("Space");
  await settled(page);
  for (let index = 0; index < 6; index++) await header.click();
  await settled(page);
  assert.equal(await header.getAttribute("aria-expanded"), "true");
  await panel
    .getByRole("button", { name: "Show 3 more sources", exact: true })
    .click();
  await settled(page);
  const rows = await panel
    .locator("[data-thinking-row]")
    .evaluateAll((elements) =>
      elements.map((node) => ({
        top: node.getBoundingClientRect().top,
        bottom: node.getBoundingClientRect().bottom,
        opacity: Number(getComputedStyle(node).opacity),
      })),
    );
  assert.ok(
    rows.every((row) => row.opacity > 0.99),
    "interrupted entrances must settle fully visible",
  );
  for (let index = 1; index < rows.length; index++)
    assert.ok(
      rows[index].top >= rows[index - 1].bottom - 1,
      "timeline rows must remain aligned without overlap",
    );
  await screenshot(page, "thinking-panel-expanded");

  const darkToggle = page.getByRole("button", {
    name: "Switch to dark theme",
    exact: true,
  });
  if (await darkToggle.count()) await darkToggle.click();
  await page.waitForFunction(() =>
    document.documentElement.classList.contains("dark"),
  );
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector('[data-slot="thinking-panel"]'))
        .backgroundColor === "rgb(27, 27, 29)",
  );
  await page.waitForTimeout(800);
  await screenshot(page, "thinking-panel-dark");
  if (output)
    await page.screenshot({
      path: path.join(output, "thinking-panel-studio.png"),
    });

  for (const width of [320, 375, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.waitForTimeout(700);
    const bounds = await panel.boundingBox();
    assert.ok(
      bounds.x >= -1 && bounds.x + bounds.width <= width + 1,
      `panel overflow at ${width}px`,
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
    );
    const chips = await panel
      .locator("[data-thinking-source]")
      .evaluateAll((elements) =>
        elements.map((node) => ({
          left: node.getBoundingClientRect().left,
          right: node.getBoundingClientRect().right,
        })),
      );
    assert.ok(
      chips.every(
        (chip) =>
          chip.left >= bounds.x && chip.right <= bounds.x + bounds.width + 1,
      ),
      `source overflow at ${width}px`,
    );
    if (width === 390) await screenshot(page, "thinking-panel-mobile");
  }

  await page
    .getByRole("button", { name: "Show customization", exact: true })
    .click();
  const widthControl = page.getByRole("slider", {
    name: "Panel width",
    exact: true,
  });
  await widthControl.focus();
  await widthControl.press("Home");
  await page.waitForFunction(
    () =>
      document.querySelector('[data-slot="thinking-panel"]').style.width ===
      "280px",
  );
  await page
    .getByRole("slider", { name: "Spring stiffness", exact: true })
    .focus();
  await page.keyboard.press("End");
  assert.equal(
    await page
      .getByRole("slider", { name: "Spring stiffness", exact: true })
      .inputValue(),
    "600",
  );
  await page
    .getByRole("button", { name: "Reset settings", exact: true })
    .click();
  await page.waitForFunction(
    () => document.querySelectorAll("[data-thinking-source]").length === 4,
  );
  await page
    .getByRole("slider", { name: "Visible sources", exact: true })
    .focus();
  await page.keyboard.press("Home");
  assert.equal(await panel.locator("[data-thinking-source]").count(), 1);
  await page
    .getByRole("button", { name: "Reset settings", exact: true })
    .click();
  await page.waitForFunction(
    () =>
      document.querySelector('[data-slot="thinking-panel"]').style.width ===
      "440px",
  );
  assert.equal(
    await page
      .getByRole("slider", { name: "Spring stiffness", exact: true })
      .inputValue(),
    "380",
  );
  await page.getByLabel("Simulate interrupted search", { exact: true }).check();
  await page
    .getByRole("button", { name: "Hide customization", exact: true })
    .click();
  await panel.getByRole("alert").waitFor({ timeout: 15000 });
  assert.match(await header.textContent(), /Interrupted after/);
  assert.match(await panel.getByRole("alert").textContent(), /Couldn’t finish/);
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  assert.equal(await panel.getAttribute("data-status"), "thinking");
  assert.equal(await panel.locator('[data-thinking-row^="step-"]').count(), 0);
  assert.match(await header.textContent(), /0s/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll("[data-thinking-pixel]")).every(
      (node) => getComputedStyle(node).opacity === "0.65",
    ),
  );
  const pixels = await panel
    .locator("[data-thinking-pixel]")
    .evaluateAll((elements) =>
      elements.map((node) => getComputedStyle(node).opacity),
    );
  await page.waitForTimeout(400);
  assert.deepEqual(
    await panel
      .locator("[data-thinking-pixel]")
      .evaluateAll((elements) =>
        elements.map((node) => getComputedStyle(node).opacity),
      ),
    pixels,
  );
  await header.click();
  assert.equal(
    await panel
      .locator('[id$="-content"]')
      .evaluate((node) => node.getBoundingClientRect().height),
    0,
  );
  await header.click();
  await settled(page);
  await panel.locator('[data-thinking-source="slack"]').hover();
  await highlightAligned(page, "slack");
  await panel.locator('[data-thinking-source="x"]').hover();
  await highlightAligned(page, "x");
  await page.close();

  const touch = await openPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  await touch
    .getByRole("button", { name: "Show 3 more sources", exact: true })
    .tap();
  assert.equal(await touch.locator("[data-thinking-source]").count(), 7);
  await touch.close();
  assert.deepEqual(errors, []);
  console.log(
    "Thinking Panel browser checks passed: playback, timer, source links and disclosure, keyboard/focus, rapid toggles, aligned rows, light/dark, 320–1440px layouts, interruption/replay, live reduced motion and touch.",
  );
} finally {
  await browser.close();
}
