import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const outputDir = "output/playwright";
const results = [];
const proxyServer = process.env.HTTPS_PROXY ?? process.env.https_proxy;

async function openContext(viewport) {
  return chromium.launchPersistentContext("", {
    headless: true,
    viewport,
    proxy: proxyServer ? { server: proxyServer, bypass: "127.0.0.1,localhost" } : undefined,
    args: ["--single-process", "--no-zygote", "--disable-gpu"],
  });
}

async function expect(label, condition, details = "") {
  if (!condition) throw new Error(`${label}${details ? `: ${details}` : ""}`);
  results.push(`PASS ${label}`);
}

async function inspectViewport(name, viewport) {
  const context = await openContext(viewport);
  const page = context.pages()[0] ?? await context.newPage();
  const consoleErrors = [];
  const failedRequests = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    if (request.method() === "HEAD" && request.failure()?.errorText === "net::ERR_ABORTED") return;
    failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? ""}`);
  });

  const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
  await expect(`${name}: homepage responds`, response?.ok());
  await expect(`${name}: homepage title`, (await page.title()).includes("Fresh Paws"));
  await expect(`${name}: hero visible`, await page.getByRole("heading", { name: /Fresh paws/i }).isVisible());
  await page.screenshot({ path: `${outputDir}/home-${name}-fold-v2.png` });
  await page.keyboard.press("Tab");
  await expect(`${name}: skip link receives first focus`, await page.locator(".skip-link").evaluate((element) => element === document.activeElement));
  await page.keyboard.press("Enter");
  await expect(`${name}: skip link moves focus to main`, await page.locator("#main-content").evaluate((element) => element === document.activeElement));

  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
    heroBottom: document.querySelector(".hero")?.getBoundingClientRect().bottom ?? 0,
    ctaBottom: document.querySelector(".hero-actions")?.getBoundingClientRect().bottom ?? 0,
  }));
  await expect(`${name}: no horizontal overflow`, dimensions.documentWidth <= dimensions.viewportWidth + 1, JSON.stringify(dimensions));
  await expect(`${name}: primary CTA stays inside hero`, dimensions.ctaBottom <= dimensions.heroBottom, JSON.stringify(dimensions));

  if (viewport.width < 768) {
    await expect(`${name}: sticky action visible`, await page.locator(".mobile-sticky").isVisible());
    await page.locator(".mobile-menu summary").click();
    await expect(`${name}: menu opens`, await page.locator(".mobile-menu nav").isVisible());
    await page.getByRole("link", { name: "FAQ" }).click();
    await expect(`${name}: menu closes after navigation`, !(await page.locator(".mobile-menu").getAttribute("open")));
  } else {
    await expect("desktop: navigation visible", await page.locator(".desktop-nav").isVisible());
    await expect("desktop: mobile sticky hidden", !(await page.locator(".mobile-sticky").isVisible()));
  }

  const firstFaq = page.locator(".faq-list details").first();
  await firstFaq.locator("summary").click();
  await expect(`${name}: FAQ expands`, await firstFaq.locator("p").isVisible());

  const proofSection = page.locator("#reviews");
  await proofSection.scrollIntoViewIfNeeded();
  await expect(`${name}: social proof heading visible`, await proofSection.getByRole("heading", { name: /Loved by the neighborhood/i }).isVisible());
  await expect(`${name}: current Google rating visible`, await proofSection.getByText("5.0", { exact: true }).isVisible());
  await expect(`${name}: 3 attributed review cards`, await proofSection.locator(".review-card").count() === 3);
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".listing-photo img")].every(
      (image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
    ),
  );
  await expect(
    `${name}: all 3 listing photos load`,
    await proofSection.locator(".listing-photo img").count() === 3,
  );
  await proofSection.evaluate((element) => {
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 78,
      behavior: "instant",
    });
  });
  await page.waitForTimeout(100);
  await page.screenshot({ path: `${outputDir}/home-${name}-reviews-v3.png` });

  const accessibility = await new AxeBuilder({ page }).analyze();
  await expect(
    `${name}: no automated accessibility violations`,
    accessibility.violations.length === 0,
    accessibility.violations
      .map((item) => `${item.impact}:${item.id} ${item.nodes.map((node) => node.target.join(" ")).join(" | ")}`)
      .join(", "),
  );

  await page.screenshot({ path: `${outputDir}/home-${name}-full-v2.png`, fullPage: true });
  await page.locator("#visit").evaluate((element) => {
    window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 108);
  });
  await page.waitForTimeout(100);
  const headerBox = await page.locator(".site-header").boundingBox();
  await expect(`${name}: header remains sticky after scroll`, Boolean(headerBox && Math.abs(headerBox.y) <= 1), JSON.stringify(headerBox));
  await page.screenshot({ path: `${outputDir}/home-${name}-visit-v2.png` });
  await expect(`${name}: no console errors`, consoleErrors.length === 0, consoleErrors.join(" | "));
  await expect(`${name}: no failed requests`, failedRequests.length === 0, failedRequests.join(" | "));
  await context.close();
}

async function testBooking() {
  const context = await openContext({ width: 390, height: 844 });
  const page = context.pages()[0] ?? await context.newPage();
  const consoleErrors = [];
  const failedRequests = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    if (request.method() === "HEAD" && request.failure()?.errorText === "net::ERR_ABORTED") return;
    failedRequests.push(`${request.method()} ${request.url()}`);
  });
  const response = await page.goto(`${baseUrl}/book`, { waitUntil: "networkidle" });
  await expect("booking: page responds", response?.ok());
  await expect("booking: disclaimer visible", await page.getByText(/does not save information/i).isVisible());
  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  await expect("booking: no horizontal overflow", dimensions.documentWidth <= dimensions.viewportWidth + 1, JSON.stringify(dimensions));
  const accessibility = await new AxeBuilder({ page }).analyze();
  await expect(
    "booking: no automated accessibility violations",
    accessibility.violations.length === 0,
    accessibility.violations
      .map((item) => `${item.impact}:${item.id} ${item.nodes.map((node) => node.target.join(" ")).join(" | ")}`)
      .join(", "),
  );
  await page.evaluate(() => (document.activeElement instanceof HTMLElement ? document.activeElement.blur() : undefined));
  await page.getByRole("button", { name: /Tue 01/i }).click();
  await page.getByRole("button", { name: "11:00 AM" }).click();
  await page.getByRole("button", { name: /Continue/i }).click();
  await expect("booking: dog step visible", await page.getByRole("heading", { name: /Who’s getting fresh/i }).isVisible());
  await page.getByLabel(/Dog’s first name/i).fill("Mochi");
  await page.screenshot({
    path: `${outputDir}/booking-mobile-step2-v2.png`,
    fullPage: true,
    style: ".skip-link { display: none !important; }",
  });
  await page.getByRole("button", { name: /Review/i }).click();
  await expect("booking: selection preserved", await page.getByText("Tue, 11:00 AM").isVisible());
  await expect("booking: dog name preserved", await page.getByText("Mochi", { exact: true }).isVisible());
  await expect("booking: no-submission confirmation", await page.getByText(/Nothing was reserved/i).isVisible());
  await page.screenshot({
    path: `${outputDir}/booking-mobile-review-v2.png`,
    fullPage: true,
    style: ".skip-link { display: none !important; }",
  });
  await expect("booking: no console errors", consoleErrors.length === 0, consoleErrors.join(" | "));
  await expect("booking: no failed requests", failedRequests.length === 0, failedRequests.join(" | "));
  await context.close();
}

await inspectViewport("mobile", { width: 390, height: 844 });
await inspectViewport("compact", { width: 320, height: 700 });
await inspectViewport("desktop", { width: 1440, height: 1000 });
await testBooking();
console.log(results.join("\n"));
console.log(`PASS ${results.length} checks`);
