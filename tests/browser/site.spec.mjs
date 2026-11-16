import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const [name, width, height] of [
  ["mobile", 390, 844],
  ["small-mobile", 320, 740],
  ["tablet", 768, 1024],
  ["desktop", 1440, 1000],
]) {
  for (const slug of ["", "work", "about"]) {
    test(`${name} /${slug}: layout, accessibility and keyboard`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height });
      const failed = [];
      page.on("response", (response) => {
        if (response.status() >= 400) failed.push(response.url());
      });
      const response = await page.goto(slug ? `/${slug}/` : "/");
      expect(response.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.keyboard.press("Tab");
      await expect(
        page.getByRole("link", { name: "Skip to content" }),
      ).toBeFocused();
      await page.keyboard.press("Enter");
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      if (!slug)
        expect(
          await page
            .locator("html")
            .evaluate((el) => getComputedStyle(el).scrollBehavior),
        ).toBe("auto");
      else
        await expect(
          page.getByRole("navigation").locator('[aria-current="page"]'),
        ).toHaveAttribute("href", `/${slug}/`);
      expect(failed).toEqual([]);
      // Clear keyboard focus and the fragment before a representative screenshot.
      await page.goto(slug ? `/${slug}/` : "/");
      await page.screenshot({
        path: `artifacts/${slug || "home"}-${name}.png`,
        fullPage: true,
      });
    });
  }
}
test("normal document navigation works without JavaScript, including direct links and back", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const hosts = new Set();
  page.on("request", (request) => hosts.add(new URL(request.url()).hostname));
  await page.goto("http://127.0.0.1:5191/");
  await page.getByRole("link", { name: "Explore our work" }).click();
  await expect(page).toHaveURL(/\/work\/$/);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.reload();
  await expect(page).toHaveTitle("About — Moist");
  await page.goBack();
  await expect(page).toHaveURL(/\/work\/$/);
  expect([...hosts]).toEqual(["127.0.0.1"]);
  const response = await page.goto("http://127.0.0.1:5191/missing");
  expect(response.status()).toBe(404);
  await expect(page.getByRole("link", { name: "Back to Moist" })).toBeVisible();
  await context.close();
});

for (const width of [390, 1440]) {
  for (const slug of ["", "work", "about"]) {
    test(`blue dark theme ${width} /${slug}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
      await page.goto(slug ? `/${slug}/` : "/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(
        page.getByRole("button", { name: "Use light theme" }),
      ).toHaveAttribute("aria-pressed", "true");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.screenshot({
        path: `artifacts/${slug || "home"}-dark-${width}.png`,
        fullPage: true,
      });
    });
  }
}
test("keyboard theme choice persists across navigation and overrides system preference", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Use dark theme" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Use light theme" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Use light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
test("theme remains usable when local storage is unavailable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("blocked");
    };
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
  });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("button", { name: "Use dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
