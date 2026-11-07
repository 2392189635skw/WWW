import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/products",
  "/consulting",
  "/technology",
  "/applications",
  "/about",
];
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
      await expect(page.locator(".brand-logo")).toHaveCount(2);
      for (const logo of await page.locator(".brand-logo").all()) {
        await expect(logo).toHaveAttribute("src", "/images/acs-logo.png");
        expect(
          await logo.evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth === 1254,
          ),
        ).toBe(true);
      }
      await expect(page.locator(".brand-mark")).toHaveCount(0);
      await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
        "href",
        "/images/acs-logo.png",
      );
      if (route === "/" || route === "/about") {
        await expect(page.locator(".support-statement p")).toHaveText(
          locale === "zh"
            ? "本公司获 HK Tech 300 种子基金及香港科技园公司（HKSTP）Ideation Programme 支持。"
            : "Our company is supported by HK Tech 300 Seed Fund and Hong Kong Science and Technology Parks Corporation (HKSTP) Ideation Programme",
        );
      }
      if (route === "/products") {
        await expect(page.locator(".product-name")).toHaveText(
          "FireCoat-X™ ThermaClear™",
        );
        await expect(
          page.locator(".product-overview .product-subtitle"),
        ).toHaveText("Therma Clear");
      }
      if (route === "/about") {
        await expect(page.locator(".company-logo-panel img")).toHaveAttribute(
          "src",
          "/images/acs-logo.png",
        );
        await expect(page.locator(".about-grid .source-image")).toHaveCount(0);
      }
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
          /(?:therma-clear-[1-6]\.webp|acs-logo\.png)$/,
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
  await expect(page.locator("h1")).toContainText("Coatings.");
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
test("contact uses the supplied company email and registered address while phone stays blank", async ({
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
  await expect(page.locator('[data-contact="phone"] dd')).toBeEmpty();
  await expect(page.locator('[data-contact="email"] a')).toHaveAttribute(
    "href",
    "mailto:info@acs-x.com",
  );
  await expect(page.locator('[data-contact="email"] a')).toHaveText(
    "info@acs-x.com",
  );
  await expect(page.locator('[data-contact="address"] address')).toHaveText(
    "香港九龙新蒲岗大有街2–4号 Wong King Industrial Building 10楼E15室",
  );
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator('[data-contact="address"] address')).toHaveText(
    "Flat E15, 10/F, Wong King Industrial Building, 2–4 Tai Yau Street, San Po Kong, Kowloon, Hong Kong",
  );
  await expect(page.locator('[data-contact="phone"] dd')).toBeEmpty();
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(".example");
});
test("both business entrances work and engineering consultancy leads to the company contact", async ({
  page,
}) => {
  await page.goto("/");
  const businesses = page.locator("#businesses");
  await expect(businesses.locator("article")).toHaveCount(2);
  await businesses
    .getByRole("link", { name: "了解涂层产品", exact: true })
    .click();
  await expect(page).toHaveURL(/\/products$/);
  await page.goBack();
  await businesses
    .getByRole("link", { name: "了解工程咨询", exact: true })
    .click();
  await expect(page).toHaveURL(/\/consulting$/);
  await page.reload();
  await expect(page.locator(".consulting-card h3")).toHaveText([
    "材料工程咨询",
    "结构工程咨询",
    "防火工程咨询",
  ]);
  await expect(
    page.locator("main").getByRole("link", { name: "info@acs-x.com" }),
  ).toHaveAttribute("href", "mailto:info@acs-x.com");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator(".consulting-card h3")).toHaveText([
    "Materials Engineering",
    "Structural Engineering",
    "Fire Engineering",
  ]);
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await expect(page).toHaveURL(/\/about#contact$/);
  await expect(page.locator('[data-contact="email"]')).toBeInViewport();
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
    .getByRole("button", { name: "Fire Protection Coatings", exact: true })
    .click();
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
for (const width of [320, 390, 641, 768, 1440]) {
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
    .getByRole("button", { name: "防火涂层材料", exact: true })
    .click();
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

for (const lang of ["zh", "en"]) {
  test(`${lang}: coating subpages are grouped alongside consultancy with keyboard and mobile navigation`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => localStorage.setItem("acs-language", value),
      lang,
    );
    await page.goto("/");
    const nav = page.getByRole("navigation", {
      name: lang === "zh" ? "主导航" : "Main navigation",
    });
    const coatings = nav.getByRole("button", {
      name: lang === "zh" ? "防火涂层材料" : "Fire Protection Coatings",
      exact: true,
    });
    await expect(
      nav.locator(":scope > a, :scope > .nav-group > button"),
    ).toHaveText(
      lang === "zh"
        ? ["首页", "防火涂层材料", "工程咨询", "关于卓界"]
        : ["Home", "Fire Protection Coatings", "Consultancy", "Company"],
    );
    await expect(coatings).toHaveAttribute("aria-expanded", "false");
    await coatings.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#coating-navigation")).toBeVisible();
    await expect(page.locator("#coating-navigation a")).toHaveText(
      lang === "zh"
        ? ["产品介绍", "技术与性能", "应用领域"]
        : ["Product", "Technology", "Applications"],
    );
    await page.keyboard.press("Escape");
    await expect(page.locator("#coating-navigation")).toBeHidden();
    await expect(coatings).toBeFocused();
    const pages =
      lang === "zh"
        ? [
            ["产品介绍", "/products"],
            ["技术与性能", "/technology"],
            ["应用领域", "/applications"],
          ]
        : [
            ["Product", "/products"],
            ["Technology", "/technology"],
            ["Applications", "/applications"],
          ];
    for (const [label, path] of pages) {
      await coatings.click();
      await page
        .locator("#coating-navigation")
        .getByRole("link", { name: label, exact: true })
        .click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(coatings).toHaveAttribute("aria-expanded", "false");
      await expect(coatings).toHaveClass(/is-active/);
    }
    await coatings.click();
    await page.locator("h1").click();
    await expect(coatings).toHaveAttribute("aria-expanded", "false");
    await nav
      .getByRole("link", {
        name: lang === "zh" ? "工程咨询" : "Consultancy",
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(/\/consulting$/);
    await expect(coatings).not.toHaveClass(/is-active/);
    await page.setViewportSize({ width: 390, height: 844 });
    await page
      .getByRole("button", {
        name: lang === "zh" ? "打开导航" : "Open menu",
        exact: true,
      })
      .click();
    await coatings.click();
    await page
      .locator("#coating-navigation")
      .getByRole("link", {
        name: lang === "zh" ? "技术与性能" : "Technology",
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(/\/technology$/);
    await expect(page.locator(".menu-toggle")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
}
