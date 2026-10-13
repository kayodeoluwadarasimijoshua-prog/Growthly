import chromium, { inflate } from "@sparticuz/chromium";
import path from "node:path";
await inflate(
  path.resolve("node_modules/@sparticuz/chromium/bin/al2023.tar.br"),
);
console.log(`Browser prepared at ${await chromium.executablePath()}`);
