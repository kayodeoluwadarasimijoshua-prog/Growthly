import { defineConfig } from "@playwright/test";
import chromium from "@sparticuz/chromium";
import { setupLambdaEnvironment } from "@sparticuz/chromium";
// npm-packaged Chromium is useful in restricted CI where browser-download hosts are unavailable.
setupLambdaEnvironment("/tmp/al2023/lib");
export default defineConfig({
  testDir: "./tests/browser",
  workers: 1,
  timeout: 60000,
  reporter: [
    ["list"],
    ["json", { outputFile: "artifacts/browser-results.json" }],
  ],
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://127.0.0.1:3000",
    headless: true,
    launchOptions: {
      executablePath: "/tmp/chromium",
      args: chromium.args.filter(
        (a) => a !== "--single-process" && a !== "--disable-web-security",
      ),
    },
    screenshot: "only-on-failure",
  },
  outputDir: "artifacts/browser",
});
