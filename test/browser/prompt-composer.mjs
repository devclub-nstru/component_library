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
  await page.goto(`${baseUrl}/components/prompt-composer`);
  await page.locator('[data-slot="prompt-composer"]').waitFor();
  await page
    .getByRole("link", { name: "Pin UI (opens in a new tab)", exact: true })
    .waitFor();
  assert.equal(
    await page
      .getByRole("link", { name: "Pin UI (opens in a new tab)", exact: true })
      .getAttribute("href"),
    "https://www.pinui.xyz/components/prompt-composer",
  );
  await page.waitForFunction(() => {
    const card = document.querySelector('[data-prompt-card="image"]');
    return (
      card &&
      getComputedStyle(card).visibility !== "hidden" &&
      Number(getComputedStyle(card).opacity) > 0.99
    );
  });
  await page.waitForTimeout(600);
  return page;
}

async function screenshot(page, name) {
  if (!output) return;
  await page.waitForTimeout(800);
  await mkdir(output, { recursive: true });
  await page
    .locator('[data-slot="prompt-composer-demo"]')
    .screenshot({ path: path.join(output, `${name}.png`) });
}

async function waitUntil(page, callback) {
  await page.waitForFunction(callback);
}

try {
  const page = await openPage();
  const composer = page.locator('[data-slot="prompt-composer"]');
  const input = composer.getByRole("textbox", { name: "Message", exact: true });
  assert.equal(await composer.locator("[data-prompt-card]").count(), 5);
  assert.equal(
    await composer
      .getByRole("button", { name: "Send message", exact: true })
      .isDisabled(),
    true,
  );
  await input.fill("   ");
  assert.equal(
    await composer
      .getByRole("button", { name: "Send message", exact: true })
      .isDisabled(),
    true,
  );
  await input.fill("");
  await page.mouse.move(300, 100);
  await screenshot(page, "prompt-composer-light");

  const image = composer.getByRole("button", {
    name: "Create image",
    exact: true,
  });
  const before = await image.boundingBox();
  await image.hover({ position: { x: 30, y: 20 } });
  await page.waitForFunction(
    (top) =>
      document
        .querySelector('[data-prompt-card="image"]')
        .getBoundingClientRect().top <
      top - 10,
    before.y,
  );
  await image.click({ position: { x: 30, y: 20 } });
  assert.equal(
    await input.getAttribute("placeholder"),
    "Describe the image you want…",
  );
  await input.press("Escape");
  assert.equal(await input.getAttribute("placeholder"), "Ask anything");
  await composer
    .getByRole("button", { name: "Add note", exact: true })
    .click({ position: { x: 25, y: 20 } });
  await input.press("Backspace");
  assert.equal(await input.getAttribute("placeholder"), "Ask anything");

  const trigger = composer.getByRole("button", { name: /^Model:/ });
  await trigger.hover();
  const menu = composer.getByRole("menu", { name: "Choose a model" });
  await menu.waitFor({ state: "visible" });
  assert.equal(
    await input.evaluate((element) => document.activeElement === element),
    true,
  );
  await menu.getByRole("menuitemradio", { name: /Deep 2.0/ }).hover();
  await page.waitForFunction(() => {
    const highlight = document
      .querySelector("[data-model-highlight]")
      .getBoundingClientRect();
    const option = document
      .querySelector('[data-model-option="deep"]')
      .getBoundingClientRect();
    return (
      Math.abs(highlight.top - option.top) < 1 &&
      Math.abs(highlight.height - option.height) < 1
    );
  });
  await screenshot(page, "prompt-composer-model-hover");
  await trigger.focus();
  await trigger.press("ArrowDown");
  assert.equal(
    await menu
      .getByRole("menuitemradio", { name: /Quick 1.5/ })
      .evaluate((option) => document.activeElement === option),
    true,
  );
  await page.keyboard.press("Escape");
  await page.mouse.move(300, 100);
  await menu.waitFor({ state: "hidden" });
  await trigger.focus();
  await trigger.press("ArrowDown");
  await menu.waitFor({ state: "visible" });
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  assert.match(await trigger.getAttribute("aria-label"), /Vision 1.2/);
  await page.mouse.move(300, 100);

  await composer
    .getByRole("button", { name: "Create event", exact: true })
    .click({ position: { x: 25, y: 20 } });
  await input.fill("  Plan the design review  ");
  await input.press("Enter");
  assert.equal(
    await composer
      .getByRole("button", { name: "Sending message" })
      .isDisabled(),
    true,
  );
  await page.waitForFunction(() =>
    document
      .querySelector('[data-slot="prompt-composer-demo"] [role="status"]')
      .textContent.includes("Sent to vision · event: Plan the design review"),
  );
  assert.equal(await input.inputValue(), "");
  assert.equal(await input.getAttribute("placeholder"), "Ask anything");
  assert.equal(
    await input.evaluate((element) => document.activeElement === element),
    true,
  );

  await page
    .getByRole("button", { name: "Show customization", exact: true })
    .click();
  await page.getByLabel("Simulate failed sends", { exact: true }).check();
  await page
    .getByRole("button", { name: "Hide customization", exact: true })
    .click();
  await input.fill("Keep this failed draft");
  await input.press("Enter");
  await composer.getByRole("alert").waitFor();
  assert.equal(await input.inputValue(), "Keep this failed draft");
  await page
    .getByRole("button", { name: "Show customization", exact: true })
    .click();
  await page.getByLabel("Simulate failed sends", { exact: true }).uncheck();
  await page
    .getByRole("button", { name: "Hide customization", exact: true })
    .click();
  await input.press("Enter");
  await page.waitForFunction(
    () =>
      document.querySelector('[data-slot="prompt-composer"] input').value ===
      "",
  );
  assert.equal(await composer.getByRole("alert").count(), 0);

  await input.fill("Existing draft.");
  await composer
    .getByRole("button", { name: "Voice mode", exact: true })
    .last()
    .click();
  await composer
    .getByRole("button", { name: "Stop recording", exact: true })
    .waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await input.inputValue(), "Existing draft.");
  assert.equal(
    await input.evaluate((element) => document.activeElement === element),
    true,
  );
  await composer
    .getByRole("button", { name: "Voice mode", exact: true })
    .last()
    .click();
  await composer
    .getByRole("button", { name: "Stop recording", exact: true })
    .click();
  await page.waitForFunction(() =>
    document
      .querySelector('[data-slot="prompt-composer"] input')
      ?.value.includes("Existing draft. Remind me to send"),
  );
  assert.equal(
    await input.evaluate((element) => document.activeElement === element),
    true,
  );

  await page
    .getByRole("button", { name: "Show customization", exact: true })
    .click();
  await page.getByLabel("Disable composer", { exact: true }).check();
  await page
    .getByRole("button", { name: "Hide customization", exact: true })
    .click();
  assert.equal(await input.isDisabled(), true);
  await page
    .getByRole("button", { name: "Show customization", exact: true })
    .click();
  await page.getByLabel("Disable composer", { exact: true }).uncheck();
  await page
    .getByRole("button", { name: "Hide customization", exact: true })
    .click();
  assert.equal(await input.isDisabled(), false);
  await input.fill("");

  const darkToggle = page.getByRole("button", {
    name: "Switch to dark theme",
    exact: true,
  });
  if (await darkToggle.count()) await darkToggle.click();
  await waitUntil(page, () =>
    document.documentElement.classList.contains("dark"),
  );
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector('[data-slot="prompt-composer"]'))
        .getPropertyValue("--pc-paper")
        .trim() === "#25232a",
  );
  await screenshot(page, "prompt-composer-dark");
  if (output)
    await page.screenshot({
      path: path.join(output, "prompt-composer-studio.png"),
    });
  await page.close();

  const mobile = await openPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mobileComposer = mobile.locator('[data-slot="prompt-composer"]');
  const mobileBounds = await mobileComposer.boundingBox();
  assert.ok(mobileBounds.x >= 0 && mobileBounds.x + mobileBounds.width <= 391);
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
  );
  await mobileComposer
    .getByRole("button", { name: "Analyse docs", exact: true })
    .tap({ position: { x: 20, y: 12 } });
  const mobileInput = mobileComposer.getByRole("textbox", {
    name: "Message",
    exact: true,
  });
  assert.ok((await mobileInput.boundingBox()).width >= 50);
  assert.equal(
    await mobileInput.getAttribute("placeholder"),
    "Ask about a document…",
  );
  await mobileInput.press("Escape");
  await screenshot(mobile, "prompt-composer-mobile");
  await mobile.close();

  const reduced = await openPage({ reducedMotion: "reduce" });
  const reducedComposer = reduced.locator('[data-slot="prompt-composer"]');
  await reducedComposer
    .getByRole("button", { name: "Hide quick actions", exact: true })
    .click();
  assert.equal(
    await reducedComposer
      .locator("[data-prompt-card]")
      .first()
      .evaluate((card) => getComputedStyle(card).visibility),
    "hidden",
  );
  await reducedComposer
    .getByRole("button", { name: "Show quick actions", exact: true })
    .click();
  await reducedComposer
    .getByRole("button", { name: "Voice mode", exact: true })
    .last()
    .click();
  const firstWave = await reducedComposer
    .locator("[data-voice-bar]")
    .evaluateAll((bars) => bars.map((bar) => bar.style.transform));
  await reduced.waitForTimeout(200);
  assert.deepEqual(
    await reducedComposer
      .locator("[data-voice-bar]")
      .evaluateAll((bars) => bars.map((bar) => bar.style.transform)),
    firstWave,
  );
  await reducedComposer
    .getByRole("button", { name: "Cancel recording", exact: true })
    .click();
  await reduced.close();
  assert.deepEqual(errors, []);
  console.log(
    "Prompt Composer browser checks passed: card hover, keyboard actions, shared model highlight, async send/retry, voice cancellation/transcript, disabled state, light/dark, 390px layout and reduced motion.",
  );
} finally {
  await browser.close();
}
