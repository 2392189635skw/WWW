import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = ["/", "/products", "/technology", "/applications", "/about"];
for (const locale of ["zh", "en"]) {
  for (const route of routes) {
    test(`${locale} ${route}: company page renders with real images and accessible controls`, async ({
      page,
    }) => {
      await page.addInitScript(
        (lang) => localStorage.setItem("acs-language", lang),
        locale,
      );
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      expect((await page.goto(route))?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        locale === "zh" ? "zh-CN" : "en",
      );
      for (const img of await page.locator("main img").all()) {
        await img.scrollIntoViewIfNeeded();
        await expect(img).toBeVisible();
        expect(
          await img.evaluate(
            (element: HTMLImageElement) =>
              element.complete && element.naturalWidth > 0,
          ),
        ).toBe(true);
        expect(await img.getAttribute("src")).toMatch(
          /therma-clear-[1-6]\.webp$/,
        );
      }
      expect(errors).toEqual([]);
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        audit.violations.map((item) => ({
          id: item.id,
          nodes: item.nodes.map((node) => ({
            target: node.target,
            summary: node.failureSummary,
          })),
        })),
      ).toEqual([]);
    });
  }
}
test("company naming and bilingual navigation persist across reload", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".site-header .brand")).toContainText(
    "卓界科技有限公司",
  );
  await expect(page.locator(".site-header .brand")).toContainText(
    "Advanced Composites Studio Limited",
  );
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("h1")).toContainText("Protection,");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Company", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText(
    "Advanced Composites Studio Limited",
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "切换到中文" }).click();
  await expect(page.locator("h1")).toHaveText("卓界科技有限公司");
});
test("technical figures keep the source substrate conditions and remove invented data", async ({
  page,
}) => {
  await page.goto("/technology");
  await expect(page.locator("tbody tr")).toHaveCount(6);
  await expect(
    page.getByRole("row", { name: /木材防火与隔热保护/ }),
  ).toContainText(">2 h");
  await expect(
    page.getByRole("row", { name: /木材防火与隔热保护/ }),
  ).toContainText("5mm 木材");
  await expect(
    page.getByRole("row", { name: /纸板防火与隔热保护/ }),
  ).toContainText(">1 h");
  await expect(
    page.getByRole("row", { name: /纸板防火与隔热保护/ }),
  ).toContainText("1mm 纸板");
  await expect(page.getByRole("row", { name: /透光率/ })).toContainText(">80%");
  await expect(page.getByRole("row", { name: /附着力/ })).toContainText(
    ">1.25 MPa",
  );
  await expect(page.locator(".source-note")).toContainText("基材与厚度");
  await expect(page.locator("#exposure-result")).toContainText(
    "受火 2 小时后温度",
  );
  await expect(page.locator("#exposure-result")).toContainText("约 150°C");
  await expect(page.getByText("画面温度标注", { exact: true })).toHaveCount(0);
  await expect(page.getByText("演示时间标注", { exact: true })).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText("SF-120");
  await expect(page.locator("body")).not.toContainText("资料待补充");
});
test("all six supplied images can be opened, navigated by keyboard and downloaded", async ({
  page,
}) => {
  await page.goto("/products");
  await expect(page.locator(".source-gallery figure")).toHaveCount(6);
  await page
    .locator(".source-gallery figure")
    .first()
    .getByRole("button")
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").locator("img")).toHaveAttribute(
    "src",
    "/images/therma-clear-1.webp",
  );
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog").locator("img")).toHaveAttribute(
    "src",
    "/images/therma-clear-2.webp",
  );
  await page.keyboard.press("ArrowLeft");
  const pending = page.waitForEvent("download");
  await page.getByRole("link", { name: "保存图片" }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("Therma-Clear-1.webp");
  expect(await download.failure()).toBeNull();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.locator(".source-gallery figure").first().getByRole("button"),
  ).toBeFocused();
});
test("application tabs follow architecture, packaging and rail content with keyboard support", async ({
  page,
}) => {
  await page.goto("/applications");
  for (const name of ["包装与物流", "轨道交通内饰", "建筑与历史保护"]) {
    await page.getByRole("tab", { name }).click();
    await expect(page.getByRole("tabpanel").locator("h2")).toHaveText(name);
  }
  await page.getByRole("tab", { name: "建筑与历史保护" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "包装与物流" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "包装与物流" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "轨道交通内饰" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
test("contact information remains intentionally empty without fake details or a form", async ({
  page,
}) => {
  await page.goto("/contact");
  await expect(page).toHaveURL(/\/about#contact$/);
  await expect(page.locator("#contact")).toBeInViewport();
  await expect(page.locator(".contact-fields dt")).toHaveText([
    "电话",
    "邮箱",
    "地址",
  ]);
  for (const field of await page.locator(".contact-fields dd").all())
    await expect(field).toHaveText("");
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:"],a[href^="tel:"]')).toHaveCount(
    0,
  );
  await expect(page.locator("body")).not.toContainText(".example");
});
test("PDF summaries remain valid and the product link opens in-page technical data", async ({
  page,
  request,
}) => {
  for (const lang of ["zh", "en"]) {
    const response = await request.get(`/downloads/Therma-Clear-${lang}.pdf`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    const buffer = await response.body();
    expect(buffer.subarray(0, 5).toString()).toBe("%PDF-");
    expect(buffer.toString()).toContain("Advanced Composites Studio Limited");
    expect(buffer.length).toBeGreaterThan(2000);
  }
  await page.goto("/products");
  await expect(page.getByRole("link", { name: "下载产品资料" })).toHaveCount(0);
  await page.getByRole("link", { name: "查看技术参数", exact: true }).click();
  await expect(page).toHaveURL(/technology#technical-data$/);
  await expect(page.locator("#technical-data")).toBeInViewport();
  await expect(page.getByRole("link", { name: "下载产品资料" })).toHaveCount(0);
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(
    page.getByRole("link", { name: "Download product summary" }),
  ).toHaveCount(0);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Product", exact: true })
    .click();
  await page
    .getByRole("link", { name: "View technical data", exact: true })
    .click();
  await expect(page).toHaveURL(/technology#technical-data$/);
  await expect(page.locator("#technical-data")).toBeInViewport();
});
for (const width of [320, 390, 768, 1440]) {
  test(`responsive at ${width}px in both languages without page overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const lang of ["zh", "en"]) {
      await page.addInitScript(
        (value) => localStorage.setItem("acs-language", value),
        lang,
      );
      for (const route of routes) {
        await page.goto(route);
        await expect(page.locator("h1")).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${lang} ${route} at ${width}`,
        ).toBe(true);
      }
    }
  });
}
test("mobile menu, image dialog and back-to-top work", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "打开导航" }).click();
  await page
    .getByRole("navigation", { name: "主导航" })
    .getByRole("link", { name: "产品介绍" })
    .click();
  await expect(page.getByRole("button", { name: "打开导航" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await page
    .locator(".source-gallery figure")
    .last()
    .getByRole("button")
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    await page
      .getByRole("dialog")
      .evaluate((el) => el.getBoundingClientRect().width),
  ).toBeLessThanOrEqual(390);
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    audit.violations.map((item) => ({
      id: item.id,
      targets: item.nodes.map((node) => node.target),
    })),
  ).toEqual([]);
  await page.getByRole("button", { name: "关闭图片" }).click();
  await page.getByRole("link", { name: "返回顶部" }).click();
  await expect(page.locator("h1")).toBeInViewport();
});
test("unknown routes have a working return-home link", async ({ page }) => {
  await page.goto("/missing-page");
  await expect(page.locator("h1")).toContainText("没有找到");
  await page.getByRole("link", { name: "返回首页", exact: true }).click();
  await expect(page).toHaveURL("/");
});
