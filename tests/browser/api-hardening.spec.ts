import { test, expect } from "@playwright/test";
import http from "node:http";
import https from "node:https";

// Real HTTP chunked transport, not a mocked provider/body read.
function chunkedUpload(baseURL: string) {
  return new Promise<{
    status: number;
    headers: http.IncomingHttpHeaders;
    body: string;
  }>((resolve, reject) => {
    const url = new URL("/api/inquiries", baseURL);
    const client = url.protocol === "https:" ? https : http;
    const request = client.request(
      url,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "transfer-encoding": "chunked",
          "sec-fetch-site": "same-origin",
        },
      },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () =>
          resolve({
            status: response.statusCode!,
            headers: response.headers,
            body,
          }),
        );
        response.on("error", reject);
      },
    );
    request.on("error", reject);
    request.setTimeout(8000, () =>
      request.destroy(new Error("Chunked regression request timed out")),
    );
    request.write("x".repeat(12_000));
    request.write("x".repeat(12_000));
    request.end("x");
  });
}

test("actual chunked and declared oversized enquiries receive private 413 responses", async ({
  baseURL,
  request,
}) => {
  const result = await chunkedUpload(baseURL!);
  expect(result.status).toBe(413);
  expect(result.headers["cache-control"]).toBe("private, no-store");
  expect(JSON.parse(result.body).message).toContain("too large");
  expect(result.body).not.toContain("x".repeat(100));
  const declared = await request.post("/api/inquiries", {
    data: "x".repeat(24_001),
    headers: {
      "sec-fetch-site": "same-origin",
      "content-type": "application/json",
    },
  });
  expect(declared.status()).toBe(413);
  expect(declared.headers()["cache-control"]).toBe("private, no-store");
});

test("API errors and framework method refusals cannot be cached", async ({
  request,
}) => {
  for (const [path, method] of [
    ["/api/inquiries", "POST"],
    ["/api/admin/login", "POST"],
    ["/api/admin/logout", "POST"],
    ["/api/admin/leads/11111111-1111-4111-8111-111111111111", "PATCH"],
  ]) {
    const response = await request.fetch(path, {
      method,
      data: {},
      headers: { origin: "https://untrusted.example" },
    });
    expect(response.status()).toBe(403);
    expect(response.headers()["cache-control"]).toBe("private, no-store");
  }
  const method = await request.get("/api/inquiries");
  expect(method.status()).toBe(405);
  expect(method.headers()["cache-control"]).toBe("private, no-store");
});

test("an actual stalled upload times out with private retry feedback", async ({
  baseURL,
}) => {
  const result = await new Promise<{
    status: number;
    body: string;
    cache?: string;
  }>((resolve, reject) => {
    const url = new URL("/api/inquiries", baseURL!);
    const client = url.protocol === "https:" ? https : http;
    const request = client.request(
      url,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "transfer-encoding": "chunked",
          "sec-fetch-site": "same-origin",
        },
      },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          resolve({
            status: response.statusCode!,
            body,
            cache: response.headers["cache-control"],
          });
          request.destroy();
        });
        response.on("error", reject);
      },
    );
    request.on("error", reject);
    request.setTimeout(22_000, () =>
      request.destroy(new Error("Server failed to enforce upload deadline")),
    );
    // Deliberately never complete the request body: the application must stop waiting.
    request.write("{");
  });
  expect(result.status).toBe(408);
  expect(result.cache).toBe("private, no-store");
  expect(JSON.parse(result.body).message).toContain("retry");
});
