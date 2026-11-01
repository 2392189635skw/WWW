// Verify the exact standalone HTML using a network-disabled browser fixture.
// System policy prevents direct file:// navigation in this cloud runtime.
import fs from "node:fs";
import { chromium, expect } from "@playwright/test";
const html = fs.readFileSync(
  new URL("../artifacts/acs-website-preview.html", import.meta.url),
  "utf8",
);
expect(html.trim().endsWith("<!-- ACS_PREVIEW_COMPLETE -->")).toBe(true);
expect(html.indexOf("</script>")).toBeLessThan(
  html.indexOf("<!-- THIRD-PARTY LICENCES"),
);
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
    (fs.existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  const context = await browser.newContext({
    offline: true,
    viewport: { width: 1440, height: 1000 },
  });
  let served = html;
  await context.route("http://offline-preview.test/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html;charset=utf-8",
      body: served,
    }),
  );
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://offline-preview.test/");
  await expect(page.locator("h1")).toContainText("透明防火");
  await expect(page.locator(".brand").first()).toContainText(
    "卓界科技有限公司",
  );
  await page.getByRole("link", { name: "向下探索" }).click();
  await expect(page.locator("#features")).toBeInViewport();
  await page.getByRole("link", { name: "返回顶部" }).click();
  await expect(page.locator("h1")).toBeInViewport();
  for (const [name, heading] of [
    ["产品介绍", "透明防火，兼顾材料美感。"],
    ["技术与性能", "透明屏障背后的防火机理。"],
    ["应用领域", "保留本色，延伸材料的可能。"],
    ["关于卓界", "卓界科技有限公司"],
  ]) {
    await page
      .getByRole("navigation", { name: "主导航" })
      .getByRole("link", { name, exact: true })
      .click();
    await expect(page.locator("h1")).toHaveText(heading);
  }
  for (const field of await page.locator(".contact-fields dd").all())
    await expect(field).toHaveText("");
  await page
    .getByRole("navigation", { name: "主导航" })
    .getByRole("link", { name: "产品介绍", exact: true })
    .click();
  await expect(page.locator(".source-gallery figure")).toHaveCount(6);
  await expect(page.locator("h1")).toHaveText("透明防火，兼顾材料美感。");
  for (const image of await page.locator("main img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute("src", /^data:image\/webp;base64,/);
    expect(
      await image.evaluate((el) => el.complete && el.naturalWidth > 0),
    ).toBe(true);
  }
  await page
    .locator(".source-gallery figure")
    .nth(2)
    .getByRole("button")
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog").locator("h2")).toContainText(
    "水性多功能",
  );
  await page.getByRole("button", { name: "关闭图片" }).click();
  const pending = page.waitForEvent("download");
  await page.getByRole("link", { name: "下载产品资料" }).click();
  const doc = await pending;
  expect(doc.suggestedFilename()).toBe("Therma-Clear-zh.pdf");
  expect(await doc.failure()).toBeNull();
  await page.getByRole("button", { name: "Switch to English" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Company", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText(
    "Advanced Composites Studio Limited",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  // Regression: truncation in trailing attribution must not reproduce the old blank page.
  served = html.slice(0, html.indexOf("<!-- THIRD-PARTY LICENCES") + 100);
  await page.goto("http://offline-preview.test/");
  await expect(page.locator("h1")).toContainText("Protection,");
  // A genuinely incomplete executable script still presents useful static content.
  served = html.slice(0, html.indexOf("<script>") + 100);
  await page.goto("http://offline-preview.test/");
  await expect(page.locator("#root")).toContainText("网页正在载入");
  await expect(page.locator("h1")).toHaveText("卓界科技有限公司");
  expect(errors).toEqual([]);
  console.log(
    "Standalone company preview passed: five pages, six embedded images, image viewer, PDF, language persistence, mobile navigation, empty contact fields and truncated-file regressions. Network disabled.",
  );
} finally {
  await browser.close();
}
