import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/products", "/technology", "/applications", "/contact"];
for (const locale of ["zh", "en"]) {
  for (const route of routes) {
    test(`${locale} ${route}: renders without errors, broken images or inaccessible controls`, async ({
      page,
    }) => {
      await page.addInitScript(
        (value) => localStorage.setItem("fireproof-language", value),
        locale,
      );
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        locale === "zh" ? "zh-CN" : "en",
      );
      const disclosure = page.locator(".example-disclosure > summary");
      if (await disclosure.count()) await disclosure.click();
      for (const img of await page.locator("img").all()) {
        await img.scrollIntoViewIfNeeded();
        await expect(img).toBeVisible();
        expect(
          await img.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        ).toBe(true);
      }
      expect(errors).toEqual([]);
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(audit.violations).toEqual([]);
    });
  }
}

test("language switches immediately and persists across navigation and reload", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("h1")).toContainText("A closer look.");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Products", exact: true })
    .click();
  await expect(page.locator("h1")).toContainText("THERMA CLEAR");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "切换到中文" }).click();
  await expect(page.locator("h1")).toContainText("THERMA CLEAR 产品介绍");
});

test("product categories filter the catalog, and product details support tabs, inquiry and Escape", async ({
  page,
}) => {
  await page.goto("/products");
  await page.locator(".example-disclosure > summary").click();
  await expect(page.locator(".product-card")).toHaveCount(4);
  await page.getByRole("button", { name: "木结构防护" }).click();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".product-card")).toContainText("WF-60");
  await page.locator(".product-card").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("WF-60");
  await page.getByRole("tab", { name: "性能参数" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("0.5–1.0 mm");
  await page.getByRole("tab", { name: "资料下载" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: /示例技术资料/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("WF-60-zh.pdf");
  expect(await download.failure()).toBeNull();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/products?product=SF-180");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "咨询此产品" })
    .click();
  await expect(page).toHaveURL(/contact\?product=SF-180/);
  await expect(page.locator("select[name=product]")).toHaveValue("SF-180");
});

test("all PDFs and CSVs contain actual documents and correct model identifiers", async ({
  request,
}) => {
  for (const id of ["SF-120", "SF-180", "CF-90", "WF-60"]) {
    for (const lang of ["zh", "en"]) {
      const response = await request.get(`/downloads/${id}-${lang}.pdf`);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("application/pdf");
      const data = await response.body();
      expect(data.subarray(0, 5).toString()).toBe("%PDF-");
      expect(data.toString()).toContain(id);
      expect(data.length).toBeGreaterThan(2000);
    }
  }
  for (const lang of ["zh", "en"]) {
    const response = await request.get(
      `/downloads/product-comparison-${lang}.csv`,
    );
    expect(response.ok()).toBe(true);
    const content = await response.text();
    for (const id of ["SF-120", "SF-180", "CF-90", "WF-60"])
      expect(content).toContain(id);
    expect(content.trim().split("\n")).toHaveLength(5);
  }
});

test("resource selection changes the downloaded PDF and comparison table is complete", async ({
  page,
}) => {
  await page.goto("/technology");
  await page.locator(".example-disclosure > summary").click();
  await expect(page.locator("tbody tr")).toHaveCount(7);
  await page.getByLabel("选择产品").selectOption("CF-90");
  await expect(page.locator(".resources-card")).toContainText("CF-90");
  await expect(
    page.getByRole("link", { name: "下载技术资料" }),
  ).toHaveAttribute("href", "/downloads/CF-90-zh.pdf");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(
    page.getByRole("link", { name: "Download technical sheet" }),
  ).toHaveAttribute("href", "/downloads/CF-90-en.pdf");
});

test("application tabs update images, product recommendations and deep links", async ({
  page,
}) => {
  await page.goto("/applications");
  for (const [name, id] of [
    ["工业厂房与仓储", "SF-180"],
    ["交通与基础设施", "CF-90"],
    ["木构建筑与室内", "WF-60"],
  ]) {
    await page.getByRole("tab", { name }).click();
    await expect(
      page.getByRole("tabpanel").locator(".recommended"),
    ).toContainText(id);
    await expect(page.getByRole("tabpanel").locator("img")).toBeVisible();
  }
  await page.reload();
  await expect(
    page.getByRole("tab", { name: "木构建筑与室内" }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "木构建筑与室内" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "商业与公共建筑" }),
  ).toHaveAttribute("aria-selected", "true");
});

test("contact validates fields and creates a local downloadable brief without sending data", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (req) => {
    if (req.method() === "POST") requests.push(req.url());
  });
  await page.goto("/contact?product=SF-120");
  await page.getByRole("button", { name: "生成项目咨询单" }).click();
  await expect(page.locator("input[name=name]:invalid")).toHaveCount(1);
  await expect(page.locator(".form-success")).toHaveCount(0);
  await page.getByLabel("你的姓名").fill("张先生");
  await page.getByLabel("公司名称").fill("示例建筑设计院");
  await page
    .getByLabel("电子邮箱", { exact: false })
    .fill("architect@example.com");
  await page
    .getByLabel("项目需求")
    .fill("希望了解室内钢结构项目适用的防火涂层方案。");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "生成项目咨询单" }).click();
  await expect(page.locator(".form-success")).toBeVisible();
  await expect(page.locator(".form-success")).toContainText("信息尚未发送");
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    audit.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载我的咨询单" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("project-brief-zh.txt");
  const stream = await download.createReadStream();
  let contents = "";
  for await (const chunk of stream!) contents += chunk.toString();
  expect(contents).toContain("张先生");
  expect(contents).toContain("SF-120");
  expect(requests).toEqual([]);
  await page.getByRole("button", { name: "返回修改" }).click();
  await expect(page.getByLabel("你的姓名")).toHaveValue("张先生");
});

for (const width of [320, 390, 768, 1440]) {
  test(`responsive layout at ${width}px: every page fits the viewport`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const lang of ["zh", "en"]) {
      await page.addInitScript(
        (value) => localStorage.setItem("fireproof-language", value),
        lang,
      );
      for (const route of routes) {
        await page.goto(route);
        await expect(page.locator("h1")).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
          `${lang} ${route} overflows at ${width}`,
        ).toBe(true);
      }
    }
  });
}

test("mobile menu, detail dialog and keyboard controls work", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "打开导航" });
  await menu.click();
  await expect(page.getByRole("navigation", { name: "主导航" })).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "产品展示" })
    .click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await page.locator(".example-disclosure > summary").click();
  await page.locator(".product-card").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("tab", { name: "产品概览" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "性能参数" })).toBeFocused();
  await page.getByRole("button", { name: "关闭产品详情" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("unknown pages show a helpful 404 with a working home link", async ({
  page,
}) => {
  await page.goto("/not-a-real-page");
  await expect(page.getByText("404", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "返回首页", exact: true }).click();
  await expect(page).toHaveURL("/");
});

test("product modal tabs meet automated accessibility checks", async ({
  page,
}) => {
  await page.goto("/products?product=SF-120");
  for (const tab of ["产品概览", "性能参数", "资料下载"]) {
    await page.getByRole("tab", { name: tab }).click();
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      audit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
});

test("THERMA CLEAR is the primary product and illustrative figures are secondary", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-product-name")).toHaveText("THERMA CLEAR");
  await expect(page.locator(".coating-feature")).toHaveCount(3);
  await expect(page.locator(".hero-data-card")).not.toContainText("180");
  await page.getByRole("link", { name: "了解产品", exact: true }).click();
  await expect(page).toHaveURL(/products#therma-clear/);
  await expect(page.locator(".flagship-copy h2")).toHaveText("THERMA CLEAR");
  await expect(page.locator(".example-disclosure")).not.toHaveAttribute("open");
  await page
    .locator(".flagship-copy")
    .getByRole("link", { name: "咨询此产品" })
    .click();
  await expect(page.locator("select[name=product]")).toHaveValue(
    "THERMA-CLEAR",
  );
});

test("unavailable reference files are labelled honestly without broken play or download controls", async ({
  page,
}) => {
  await page.goto("/technology");
  await expect(page.locator(".reference-card")).toHaveCount(4);
  await expect(page.locator(".reference-status")).toHaveCount(4);
  await expect(page.locator(".reference-grid a")).toHaveCount(0);
  await expect(page.locator(".coating-video video")).toHaveCount(0);
  await expect(page.locator(".video-runtime")).toContainText("暂无可播放视频");
  await expect(page.locator('a[href*="sharepoint"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator(".reference-status").first()).toHaveText(
    "Resource to be added",
  );
});

test("home resource link opens the demonstration section", async ({ page }) => {
  await page.goto("/");
  await page
    .locator(".hero-buttons")
    .getByRole("link", { name: "演示与资料", exact: true })
    .click();
  await expect(page).toHaveURL(/technology#demonstration/);
  await expect(page.locator("#demonstration")).toBeInViewport();
  await expect(page.getByRole("navigation")).toContainText("演示与资料");
});
