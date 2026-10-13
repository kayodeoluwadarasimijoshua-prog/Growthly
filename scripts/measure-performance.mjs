import fs from "node:fs/promises";
import chromium, { setupLambdaEnvironment } from "@sparticuz/chromium";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
setupLambdaEnvironment("/tmp/al2023/lib");
const chrome = await launch({
  chromePath: await chromium.executablePath(),
  chromeFlags: chromium.args.filter(
    (a) => a !== "--single-process" && a !== "--disable-web-security",
  ),
});
const summaries = [];
try {
  for (const [path, mode] of [
    ["/", "mobile"],
    ["/", "desktop"],
    ["/website-development", "mobile"],
    ["/request-a-quote", "mobile"],
  ]) {
    const config =
      mode === "desktop"
        ? (await import("lighthouse/core/config/desktop-config.js")).default
        : undefined;
    const result = await lighthouse(
      `http://127.0.0.1:3000${path}`,
      {
        port: chrome.port,
        output: ["json", "html"],
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
      },
      config,
    );
    const name = `${path === "/" ? "home" : path.slice(1)}-${mode}`;
    await fs.writeFile(`artifacts/lighthouse-${name}.json`, result.report[0]);
    await fs.writeFile(`artifacts/lighthouse-${name}.html`, result.report[1]);
    const a = result.lhr.audits;
    const summary = {
      path,
      mode,
      scores: Object.fromEntries(
        Object.entries(result.lhr.categories).map(([k, v]) => [
          k,
          Math.round(v.score * 100),
        ]),
      ),
      LCP: a["largest-contentful-paint"].numericValue,
      CLS: a["cumulative-layout-shift"].numericValue,
      TBT: a["total-blocking-time"].numericValue,
      FCP: a["first-contentful-paint"].numericValue,
      failed: Object.values(a)
        .filter((v) => v.score !== null && v.score < 1)
        .map((v) => ({ id: v.id, title: v.title, display: v.displayValue })),
    };
    summaries.push(summary);
    console.log(JSON.stringify(summary));
  }
  await fs.writeFile(
    "artifacts/performance-summary.json",
    JSON.stringify(summaries, null, 2),
  );
} finally {
  await chrome.kill();
}
