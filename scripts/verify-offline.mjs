// The environment restricts file:// navigation. Serve the exact standalone HTML
// through a Playwright fixture with network disabled to verify its interactions.
import { chromium, expect } from "@playwright/test";
import fs from "node:fs";
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
    (fs.existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  offline: true,
});
const html = fs.readFileSync(
  new URL("../artifacts/fireproof-materials-preview.html", import.meta.url),
  "utf8",
);
await context.route("http://offline-preview.test/**", (route) =>
  route.fulfill({ status: 200, contentType: "text/html", body: html }),
);
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto("http://offline-preview.test/");
  await expect(page.locator(".hero-product-name")).toHaveText("THERMA CLEAR");
  await page.getByRole("link", { name: "向下探索" }).click();
  await expect(page.locator("#protection")).toBeInViewport();
  await expect(page.locator("h1")).toContainText("涂层的价值");
  await page.getByRole("link", { name: "返回顶部" }).click();
  await expect(page.locator("h1")).toBeInViewport();
  for (const name of ["产品展示", "演示与资料", "应用场景", "联系我们"]) {
    await page
      .getByRole("navigation")
      .getByRole("link", { name, exact: true })
      .click();
    await expect(page.locator("h1")).toBeVisible();
  }
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "首页", exact: true })
    .click();
  await page
    .locator(".hero-buttons")
    .getByRole("link", { name: "演示与资料", exact: true })
    .click();
  await expect(page.locator("#demonstration")).toBeInViewport();
  await expect(page.locator(".reference-status")).toHaveCount(4);
  await expect(page.locator(".coating-video video")).toHaveCount(0);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "产品展示", exact: true })
    .click();
  await page.locator(".example-disclosure > summary").click();
  await page.locator(".product-card").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("tab", { name: "资料下载" }).click();
  const pending = page.waitForEvent("download");
  await page
    .getByRole("dialog")
    .getByRole("link", { name: /示例技术资料/ })
    .click();
  const doc = await pending;
  expect(doc.suggestedFilename()).toBe("SF-120-zh.pdf");
  expect(await doc.failure()).toBeNull();
  await page.getByRole("button", { name: "关闭产品详情" }).click();
  await page
    .locator(".flagship-copy")
    .getByRole("link", { name: "咨询此产品" })
    .click();
  await expect(page.locator("select[name=product]")).toHaveValue(
    "THERMA-CLEAR",
  );
  await page.getByRole("button", { name: "Switch to English" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Products", exact: true })
    .click();
  await expect(page.locator("h1")).toContainText("THERMA CLEAR");
  await page
    .locator(".flagship-copy")
    .getByRole("link", { name: "Product enquiry" })
    .click();
  await page.getByLabel("Your name").fill("Demo User");
  await page.getByLabel("Email address").fill("demo@example.com");
  await page
    .getByLabel("Project requirements")
    .fill("Please provide more information about the coating.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Create my project brief" }).click();
  await expect(page.locator(".form-success")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  console.log(
    "Standalone preview passed: five pages, section links, resource placeholders, PDF download, THERMA CLEAR enquiry, persisted bilingual switch, mobile navigation and local form. Network disabled.",
  );
} finally {
  await browser.close();
}
