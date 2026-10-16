import fs from "node:fs/promises";
import { chromium as playwrightChromium } from "@playwright/test";
import chromium, { setupLambdaEnvironment } from "@sparticuz/chromium";

setupLambdaEnvironment("/tmp/al2023/lib");
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const sitemap = await fetch(`${base}/sitemap.xml`);
if (!sitemap.ok) throw new Error(`Sitemap HTTP ${sitemap.status}`);
const xml = await sitemap.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (!urls.length || new Set(urls).size !== urls.length)
  throw new Error("Sitemap missing or duplicated URLs");
const browser = await playwrightChromium.launch({
  executablePath: await chromium.executablePath(),
  args: chromium.args.filter(
    (a) => a !== "--single-process" && a !== "--disable-web-security",
  ),
  headless: true,
});
const results = [];
const errors = [];
const titles = new Set();
const descriptions = new Set();
try {
  const page = await browser.newPage();
  for (const canonical of urls) {
    const path = new URL(canonical).pathname;
    if (/admin|api\/|review-media|\?/.test(path))
      throw new Error(`Nonpublic path in sitemap: ${path}`);
    const response = await page.goto(`${base}${path}`);
    const item = await page.evaluate(() => ({
      title: document.title,
      description: document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content"),
      canonical: document
        .querySelector('link[rel="canonical"]')
        ?.getAttribute("href"),
      robots: document
        .querySelector('meta[name="robots"]')
        ?.getAttribute("content"),
      ogTitle: document
        .querySelector('meta[property="og:title"]')
        ?.getAttribute("content"),
      ogDescription: document
        .querySelector('meta[property="og:description"]')
        ?.getAttribute("content"),
      ogImage: document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute("content"),
      twitterCard: document
        .querySelector('meta[name="twitter:card"]')
        ?.getAttribute("content"),
      h1: Array.from(document.querySelectorAll("h1")).map((h) => h.textContent),
      headings: Array.from(
        document.querySelectorAll("main h1,main h2,main h3,main h4"),
      ).map((h) => ({
        level: Number(h.tagName.slice(1)),
        text: h.textContent,
      })),
      schemas: Array.from(
        document.querySelectorAll('script[type="application/ld+json"]'),
      ).map((s) => JSON.parse(s.textContent)),
    }));
    const status = response?.status();
    const robotsHeader = await response?.headerValue("x-robots-tag");
    if (status !== 200) errors.push(`${path}: HTTP ${status}`);
    if (
      !item.canonical ||
      new URL(item.canonical).href !== new URL(canonical).href
    )
      errors.push(`${path}: canonical mismatch`);
    if (item.h1.length !== 1) errors.push(`${path}: ${item.h1.length} H1s`);
    if (
      !item.description ||
      titles.has(item.title) ||
      descriptions.has(item.description)
    )
      errors.push(`${path}: missing/duplicate metadata`);
    if (
      item.ogTitle !== item.title ||
      item.ogDescription !== item.description ||
      !item.ogImage ||
      item.twitterCard !== "summary_large_image"
    )
      errors.push(`${path}: incomplete social metadata`);
    if (
      process.env.EXPECT_REVIEW !== "false" &&
      (!item.robots?.includes("noindex") || !robotsHeader?.includes("noindex"))
    )
      errors.push(`${path}: missing private-review noindex`);
    for (let i = 1; i < item.headings.length; i++)
      if (item.headings[i].level > item.headings[i - 1].level + 1)
        errors.push(
          `${path}: heading level skipped at ${item.headings[i].text}`,
        );
    titles.add(item.title);
    descriptions.add(item.description);
    results.push({ path, status, robotsHeader, ...item });
  }
  const og = await fetch(`${base}/opengraph-image`);
  if (!og.ok || !og.headers.get("content-type")?.startsWith("image/"))
    errors.push("Shared Open Graph image unavailable");
  await fs.mkdir("artifacts", { recursive: true });
  await fs.writeFile(
    "artifacts/public-seo-audit.json",
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        pages: results.length,
        errors,
        results,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify(
      {
        pages: results.length,
        uniqueTitles: titles.size,
        uniqueDescriptions: descriptions.size,
        errors,
        openGraphImageStatus: og.status,
      },
      null,
      2,
    ),
  );
  if (errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
