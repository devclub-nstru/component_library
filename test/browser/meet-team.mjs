import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
  headless: true,
});
const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const output = process.env.SCREENSHOT_DIR;
const errors = [];

async function open(options = {}) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    ...options,
  });
  page.setDefaultTimeout(15000);
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/components/meet-team`);
  await page.getByRole("heading", { name: "Meet Team", exact: true }).waitFor();
  await page.locator('[data-team-card][aria-pressed="true"]').waitFor();
  await page.waitForTimeout(700);
  return page;
}

async function selected(page, name) {
  const card = page.getByRole("button", { name, exact: true });
  await page.waitForFunction(
    (label) =>
      document
        .querySelector('[data-team-card][aria-pressed="true"]')
        ?.getAttribute("aria-label") === label,
    name,
  );
  return card;
}

async function centered(page) {
  await page.waitForFunction(() => {
    const card = document.querySelector(
      '[data-team-card][aria-pressed="true"]',
    );
    const stage = document.querySelector("[data-team-stage]");
    if (!card || !stage) return false;
    const portrait = card.getBoundingClientRect();
    const bounds = stage.getBoundingClientRect();
    return (
      Math.abs(portrait.x + portrait.width / 2 - bounds.x - bounds.width / 2) <
        0.5 &&
      Math.abs(
        portrait.y + portrait.height / 2 - bounds.y - bounds.height / 2,
      ) < 0.5
    );
  });
}

async function controls(page) {
  const panel = page.getByRole("region", {
    name: "Component customization",
    exact: true,
  });
  if (!(await panel.isVisible()))
    await page
      .getByRole("button", { name: "Show customization", exact: true })
      .click();
  await panel.waitFor();
  return panel;
}

async function screenshot(page, name) {
  if (!output) return;
  await mkdir(output, { recursive: true });
  await page.screenshot({ path: path.join(output, `${name}.png`) });
}

async function drag(page, fraction = 0.75) {
  const stage = await page.locator("[data-team-stage]").boundingBox();
  assert.ok(stage);
  const x = stage.x + stage.width / 2;
  const y = stage.y + stage.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - Math.min(stage.width * fraction, 230), y, {
    steps: 12,
  });
  await page.mouse.up();
  await centered(page);
}

try {
  const page = await open();
  const root = page.locator('[data-slot="meet-team"]');
  assert.equal(await root.locator("[data-team-card]").count(), 9);
  await centered(page);
  await screenshot(page, "meet-team-light");

  const initial = await selected(page, "Ella Thompson, Product Designer");
  await initial.focus();
  await page.keyboard.press("End");
  await selected(page, "Isla Brooks, Experience Designer");
  await centered(page);
  assert.equal(
    await page
      .getByRole("button", { name: "Next team member", exact: true })
      .isDisabled(),
    true,
  );
  await page.keyboard.press("Home");
  await selected(page, "Ava Morgan, Creative Director");
  await centered(page);
  assert.equal(
    await page
      .getByRole("button", { name: "Previous team member", exact: true })
      .isDisabled(),
    true,
  );
  await page
    .getByRole("button", { name: "Next team member", exact: true })
    .click();
  await selected(page, "Leo Chen, Design Engineer");
  await centered(page);

  const stage = await page.locator("[data-team-stage]").boundingBox();
  assert.ok(stage);
  await page.mouse.move(stage.x + stage.width - 2, stage.y + 15);
  await selected(page, "Isla Brooks, Experience Designer");
  await page.mouse.move(stage.x + stage.width / 2, stage.y + 15);
  await selected(page, "Ella Thompson, Product Designer");
  await centered(page);

  const panel = await controls(page);
  await panel.getByLabel("Follow pointer", { exact: true }).uncheck();
  await panel.getByLabel("Heading", { exact: true }).fill("Our people");
  assert.equal(
    await root
      .getByRole("heading", { name: "Our people", exact: true })
      .count(),
    1,
  );
  await panel.getByRole("button", { name: "Snappy", exact: true }).click();
  assert.equal(
    await panel
      .getByRole("slider", { name: "Stiffness", exact: true })
      .inputValue(),
    "400",
  );
  await panel
    .getByLabel("Edit team member", { exact: true })
    .selectOption("ella");
  await panel.getByLabel("Member name", { exact: true }).fill("Ella Studio");
  await selected(page, "Ella Studio, Product Designer");
  await panel
    .getByLabel("Black and white portraits", { exact: true })
    .uncheck();
  assert.equal(
    await root
      .locator("img")
      .first()
      .evaluate((image) => getComputedStyle(image).filter),
    "none",
  );
  await panel.getByRole("button", { name: "Reset", exact: true }).click();
  assert.equal(
    await panel.getByLabel("Heading", { exact: true }).inputValue(),
    "Meet Team",
  );
  assert.equal(
    await panel
      .getByRole("slider", { name: "Stiffness", exact: true })
      .inputValue(),
    "180",
  );
  await panel.getByLabel("Follow pointer", { exact: true }).uncheck();
  await page
    .getByRole("button", { name: "Hide customization", exact: true })
    .click();

  for (const zoom of [50, 150]) {
    await page
      .getByRole("button", { name: "Reset canvas", exact: true })
      .click();
    for (let index = 0; index < 5; index++)
      await page
        .getByRole("button", {
          name: zoom === 50 ? "Zoom out" : "Zoom in",
          exact: true,
        })
        .click();
    await page
      .getByRole("button", {
        name: "Ella Thompson, Product Designer",
        exact: true,
      })
      .focus();
    await page.keyboard.press("Home");
    await centered(page);
    await drag(page);
    assert.notEqual(
      await root
        .locator('[data-team-card][aria-pressed="true"]')
        .getAttribute("aria-label"),
      "Ava Morgan, Creative Director",
    );
  }

  await page.getByRole("button", { name: "Reset canvas", exact: true }).click();
  await page
    .getByRole("button", { name: "Switch to dark theme", exact: true })
    .click();
  await page.waitForTimeout(700);
  await screenshot(page, "meet-team-dark");
  const edit = await controls(page);
  await edit.getByRole("button", { name: "Add member", exact: true }).click();
  assert.equal(await root.locator("[data-team-card]").count(), 10);
  await edit.getByLabel("Member name", { exact: true }).fill("Alex");
  await edit
    .getByLabel("Portrait URL", { exact: true })
    .fill("/missing-team-portrait.jpg");
  await page.waitForFunction(() => {
    const image = document.querySelector(
      '[aria-label="Alex, Team member"] img',
    );
    return image && getComputedStyle(image).visibility === "hidden";
  });
  for (let index = 0; index < 9; index++)
    await edit
      .getByRole("button", { name: "Remove member", exact: true })
      .click();
  assert.equal(await root.locator("[data-team-card]").count(), 1);
  assert.equal(
    await page
      .getByRole("button", { name: "Next team member", exact: true })
      .isDisabled(),
    true,
  );
  assert.equal(
    await page
      .getByRole("button", { name: "Previous team member", exact: true })
      .isDisabled(),
    true,
  );
  await centered(page);
  await edit
    .getByRole("button", { name: "Remove member", exact: true })
    .click();
  assert.equal(
    await root.getByRole("status").textContent(),
    "No team members to display.",
  );
  await edit.getByRole("button", { name: "Add member", exact: true }).click();
  assert.equal(await root.locator("[data-team-card]").count(), 1);
  await centered(page);
  await edit.getByRole("button", { name: "Reset", exact: true }).click();
  assert.equal(await root.locator("[data-team-card]").count(), 9);
  await page.close();

  const mobile = await open({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await centered(mobile);
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
  );
  const mobileCard = await mobile
    .locator('[data-team-card][aria-pressed="true"]')
    .boundingBox();
  const mobileStage = await mobile.locator("[data-team-stage]").boundingBox();
  assert.ok(mobileCard && mobileStage);
  assert.ok(
    mobileCard.x >= mobileStage.x &&
      mobileCard.x + mobileCard.width <= mobileStage.x + mobileStage.width,
  );
  const session = await mobile.context().newCDPSession(mobile);
  const touch = {
    x: mobileStage.x + mobileStage.width / 2,
    y: mobileStage.y + mobileStage.height / 2,
  };
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [touch],
  });
  for (let step = 1; step <= 10; step++) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: touch.x - step * 12, y: touch.y }],
    });
    await mobile.waitForTimeout(16);
  }
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await centered(mobile);
  assert.notEqual(
    await mobile
      .locator('[data-team-card][aria-pressed="true"]')
      .getAttribute("aria-label"),
    "Ella Thompson, Product Designer",
  );
  await screenshot(mobile, "meet-team-mobile");
  await mobile.close();

  const reduced = await open({ reducedMotion: "reduce" });
  await reduced
    .getByRole("button", { name: "Next team member", exact: true })
    .click();
  await selected(reduced, "Oliver James, Frontend Developer");
  await centered(reduced);
  const reducedStage = await reduced.locator("[data-team-stage]").boundingBox();
  await reduced.mouse.move(reducedStage.x + 5, reducedStage.y + 15);
  assert.equal(
    await reduced
      .locator('[data-team-card][aria-pressed="true"]')
      .getAttribute("aria-label"),
    "Oliver James, Frontend Developer",
  );
  await screenshot(reduced, "meet-team-reduced");
  await reduced.close();
  assert.deepEqual(errors, []);
  console.log(
    "Meet Team browser checks passed: selection, centering, pointer input, dragging at 50%/150% zoom, content, presets, reset, image fallback, empty/single-member states, dark theme, 390px touch layout, and reduced motion.",
  );
} finally {
  await browser.close();
}
