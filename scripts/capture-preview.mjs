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
async function capture(route, name) {
  const response = await page.goto(origin + route);
  if (!response.ok()) throw new Error(`Failed ${route}`);
  await page.locator("h1").waitFor();
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images].map(async (image) => {
        image.loading = "eager";
        await image.decode();
      }),
    );
  });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: new URL(`acs-${name}.png`, output).pathname,
    fullPage: true,
  });
}
try {
  await capture("/", "home-desktop");
  await page.screenshot({
    path: new URL("acs-hero-desktop.png", output).pathname,
  });
  for (const route of [
    "products",
    "consulting",
    "technology",
    "applications",
    "about",
  ])
    await capture("/" + route, route + "-desktop");
  await page.setViewportSize({ width: 390, height: 844 });
  await capture("/", "home-mobile");
  await page.screenshot({
    path: new URL("acs-hero-mobile.png", output).pathname,
  });
  await capture("/about#contact", "contact-mobile");
  await capture("/products", "products-mobile");
  await capture("/consulting", "consulting-mobile");
  await page.evaluate(() => localStorage.setItem("acs-language", "en"));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await capture("/", "home-english");
  await page.goto(origin + "/products");
  await page
    .locator(".source-gallery figure")
    .nth(2)
    .getByRole("button")
    .click();
  await page.getByRole("dialog").waitFor();
  await page.screenshot({
    path: new URL("acs-source-image-viewer.png", output).pathname,
  });
  const pdf = await context.request.get(
    origin + "/downloads/Therma-Clear-en.pdf",
  );
  if (
    !pdf.ok() ||
    !(await pdf.body()).subarray(0, 5).equals(Buffer.from("%PDF-"))
  )
    throw new Error("Invalid product PDF");
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(
    "Production browser smoke checks passed; company previews saved with acs- prefix.",
  );
} finally {
  await browser.close();
}
