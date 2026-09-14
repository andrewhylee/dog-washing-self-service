import { chromium } from "playwright";

const BASE = "https://eternal-arbor-vra2.here.now/";
const results = [];
const note = (label, ok, extra = "") => {
  results.push(`${ok ? "PASS" : "FAIL"}  ${label}${extra ? "  (" + extra + ")" : ""}`);
};

async function waitRowCount(page, expected, timeout = 10000) {
  await page.waitForFunction(
    (n) => document.querySelectorAll("tbody tr:not(.skeleton)").length === n,
    expected,
    { timeout }
  );
}

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(BASE, { waitUntil: "networkidle" });
note("anonymous shows gate title", (await page.title()).includes("Protected"));
const pw = page.locator('input[name="password"]');
note("password field present when anonymous", (await pw.count()) === 1);

await pw.fill("testing111");
await page.locator('button[type="submit"]').click();
await page.waitForLoadState("networkidle");

// only watch for errors from here on (anonymous gate 401 is expected)
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("console.error: " + m.text());
});

note("title after login", (await page.title()).includes("Vaccine Records"));
note("topbar brand visible", (await page.locator(".brand-name").textContent()) === "Fresh Paws");
note("owner badge visible", (await page.locator(".owner-badge").textContent()) === "Owner view");

await page.waitForSelector("tbody tr.skeleton", { state: "detached", timeout: 15000 });
const rowCount = await page.locator("tbody tr:not(.skeleton)").count();
note("records rendered", rowCount === 3, `rows=${rowCount}`);
note("no visible state boxes", (await page.locator(".state-box:visible").count()) === 0);
note("count text", (await page.locator(".count").textContent()).includes("3 of 3"));
note("thumbs rendered", (await page.locator("tbody img.thumb").count()) === 3);
note("open-card links", (await page.locator("tbody .open-link[href]").count()) === 3);
note("sort default desc", (await page.locator("th[aria-sort]").getAttribute("aria-sort")) === "descending");
await page.screenshot({ path: "/tmp/admin_next_loaded.png", fullPage: true });

// sort toggle
const dateHeader = page.locator("th.sortable");
await dateHeader.click();
note("sort toggles to ascending", (await dateHeader.getAttribute("aria-sort")) === "ascending");
await dateHeader.click();

// search
const search = page.locator('input[type="search"]');
await search.fill("Meow");
await waitRowCount(page, 1);
note("search filters to 1 row", true);
await search.fill("zzzz-nothing");
await waitRowCount(page, 0);
note(
  "empty-search state shows",
  (await page.locator(".state-box.empty:visible").textContent()).includes("No records match")
);
await search.fill("");
await waitRowCount(page, 3);
note("cleared search restores rows", true);

// delete + refresh buttons present
note("delete buttons present", (await page.locator(".del-btn").count()) === 3);
await page.locator(".btn").click();
await waitRowCount(page, 3, 15000);
note("refresh re-renders records", true);

note("no console/page errors after login", errors.length === 0, errors.join(" | "));

// --- mobile viewport: stacked cards must not overflow the viewport ---
await page.setViewportSize({ width: 375, height: 720 });
await page.reload();
await page.waitForLoadState("networkidle");
await waitRowCount(page, 3);
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > window.innerWidth
);
const theadDisplay = await page.evaluate(
  () => getComputedStyle(document.querySelector("thead")).display
);
const trDisplay = await page.evaluate(
  () => getComputedStyle(document.querySelector("tbody tr")).display
);
note("mobile: no horizontal overflow (table not cut off)", !overflow);
note("mobile: thead hidden", theadDisplay === "none");
note("mobile: rows render as grid cards", trDisplay === "grid", `display=${trDisplay}`);
await page.screenshot({ path: "/tmp/admin_mobile.png", fullPage: true });

await browser.close();
console.log(results.join("\n"));
process.exit(results.some((r) => r.startsWith("FAIL")) ? 1 : 0);