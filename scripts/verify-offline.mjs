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
  await expect(page.locator("h1")).toContainText("先进防火技术解决方案");
  await expect(
    page.locator(".hero-copy > p, .hero-copy .eyebrow, .hero-signature"),
  ).toHaveCount(0);
  await expect(page.locator(".support-statement p")).toContainText(
    "HK Tech 300",
  );
  await expect(page.locator(".brand").first()).toContainText(
    "卓界科技有限公司",
  );
  await expect(page.locator(".brand-logo")).toHaveCount(2);
  for (const logo of await page.locator(".brand-logo").all()) {
    await expect(logo).toHaveAttribute("src", /^data:image\/png;base64,/);
    expect(
      await logo.evaluate(
        (image) => image.complete && image.naturalWidth === 1254,
      ),
    ).toBe(true);
  }
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    "href",
    /^data:image\/png;base64,/,
  );
  await page.getByRole("link", { name: "向下探索" }).click();
  await expect(page.locator("#businesses")).toBeInViewport();
  await page.getByRole("link", { name: "返回顶部" }).click();
  await expect(page.locator("h1")).toBeInViewport();
  for (const [name, heading] of [
    ["产品介绍", "透明防火，兼顾材料美感。"],
    ["工程咨询", "材料、结构与防火工程咨询。"],
    ["技术与性能", "透明屏障背后的防火机理。"],
    ["应用领域", "保留本色，延伸材料的可能。"],
    ["关于卓界", "卓界科技有限公司"],
  ]) {
    if (["产品介绍", "技术与性能", "应用领域"].includes(name)) {
      await page
        .getByRole("navigation", { name: "主导航" })
        .getByRole("button", { name: "防火涂层材料", exact: true })
        .click();
    }
    await page
      .getByRole("navigation", { name: "主导航" })
      .getByRole("link", { name, exact: true })
      .click();
    await expect(page.locator("h1")).toHaveText(heading);
  }
  await expect(page.locator(".company-logo-panel img")).toHaveAttribute(
    "src",
    /^data:image\/png;base64,/,
  );
  await expect(page.locator(".business-introduction")).toHaveText(
    "卓界科技有限公司的业务范围包括：",
  );
  await expect(page.locator(".business-heading-line > span")).toHaveText([
    "先进防火技术解决方案",
    "复合材料开发",
    "工程咨询",
  ]);
  await expect(page.locator('[data-contact="phone"] dd')).toBeEmpty();
  await expect(page.locator('[data-contact="email"] a')).toHaveAttribute(
    "href",
    "mailto:info@acs-x.com",
  );
  await expect(page.locator('[data-contact="address"]')).toContainText(
    "10楼E15室",
  );
  await page
    .getByRole("navigation", { name: "主导航" })
    .getByRole("button", { name: "防火涂层材料", exact: true })
    .click();
  await page
    .getByRole("navigation", { name: "主导航" })
    .getByRole("link", { name: "产品介绍", exact: true })
    .click();
  await expect(page.locator(".source-gallery figure")).toHaveCount(6);
  await expect(page.locator("h1")).toHaveText("透明防火，兼顾材料美感。");
  await expect(page.locator(".product-name")).toHaveText(
    "FireCoat-X™ ThermaClear™",
  );
  await expect(page.locator(".product-overview .product-subtitle")).toHaveText(
    "Therma Clear",
  );
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
  await expect(page.getByRole("link", { name: "下载产品资料" })).toHaveCount(0);
  await page.getByRole("link", { name: "查看技术参数", exact: true }).click();
  await expect(page.locator("#technical-data")).toBeInViewport();
  await expect(page.getByRole("link", { name: "下载产品资料" })).toHaveCount(0);
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
  await expect(page.locator(".support-statement p")).toHaveText(
    "Our company is supported by HK Tech 300 Seed Fund and Hong Kong Science and Technology Parks Corporation (HKSTP) Ideation Programme",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  // Regression: truncation in trailing attribution must not reproduce the old blank page.
  served = html.slice(0, html.indexOf("<!-- THIRD-PARTY LICENCES") + 100);
  await page.goto("http://offline-preview.test/");
  await expect(page.locator("h1")).toContainText(
    "Advanced Fire Protection Solutions",
  );
  // A genuinely incomplete executable script still presents useful static content.
  served = html.slice(0, html.indexOf("<script>") + 100);
  await page.goto("http://offline-preview.test/");
  await expect(page.locator("#root")).toContainText("网页正在载入");
  await expect(page.locator("h1")).toHaveText("卓界科技有限公司");
  expect(errors).toEqual([]);
  console.log(
    "Standalone company preview passed: six pages, updated business statements, six embedded product images, company logo, image viewer, in-page technical data, language persistence, mobile navigation, company contact details with blank phone and truncated-file regressions. Network disabled.",
  );
} finally {
  await browser.close();
}
