import fs from "node:fs";
import { chromium } from "@playwright/test";
const output = new URL("../artifacts/", import.meta.url);
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
    (fs.existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const origin = "http://127.0.0.1:4173";
const capture = async (route, name, fullPage = true) => {
  const response = await page.goto(origin + route);
  if (!response.ok()) throw new Error(`Failed production route: ${route}`);
  await page.locator("h1").waitFor();
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images].map(async (img) => {
        img.loading = "eager";
        await img.decode();
      }),
    );
  });
  await page.screenshot({
    path: new URL(name + ".png", output).pathname,
    fullPage,
  });
};
await capture("/", "home-desktop");
await page.screenshot({
  path: new URL("preview-desktop.png", output).pathname,
});
for (const route of ["products", "technology", "applications", "contact"])
  await capture("/" + route, route + "-desktop");
await page.setViewportSize({ width: 390, height: 844 });
await capture("/", "home-mobile");
await page.screenshot({ path: new URL("preview-mobile.png", output).pathname });
await page.evaluate(() => localStorage.setItem("fireproof-language", "en"));
await page.setViewportSize({ width: 1440, height: 1000 });
await capture("/", "home-english-desktop");
await capture("/products?product=SF-120", "product-details-desktop");
await page.getByRole("dialog").waitFor();
await page.screenshot({
  path: new URL("product-details-desktop.png", output).pathname,
});
const pdf = await context.request.get(origin + "/downloads/SF-120-en.pdf");
if (
  !pdf.ok() ||
  !(await pdf.body()).subarray(0, 5).equals(Buffer.from("%PDF-"))
)
  throw new Error("Production PDF not valid");
if (errors.length) throw new Error(errors.join("\n"));
console.log(
  "Production smoke check passed: all 5 routes, language switch, product dialog, images and PDF. Saved 10 preview screenshots.",
);
await browser.close();
