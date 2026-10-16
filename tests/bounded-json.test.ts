import { describe, expect, it, vi } from "vitest";
import {
  readBoundedJson,
  BodyTooLargeError,
  BodyReadTimeoutError,
} from "@/lib/bounded-json";
import { privateJson } from "@/lib/api-response";

function streamed(chunks: Uint8Array[], headers: Record<string, string> = {}) {
  let index = 0;
  const cancel = vi.fn();
  const pull = vi.fn(
    (controller: ReadableStreamDefaultController<Uint8Array>) => {
      if (index < chunks.length) controller.enqueue(chunks[index++]);
      else controller.close();
    },
  );
  const body = new ReadableStream<Uint8Array>(
    { pull, cancel },
    { highWaterMark: 0 },
  );
  const request = new Request("https://growthly.example/api/inquiries", {
    method: "POST",
    headers,
    body,
    duplex: "half",
  } as RequestInit);
  return { request, cancel, pull };
}
const encode = (text: string) => new TextEncoder().encode(text);
describe("bounded JSON request reader", () => {
  it("accepts valid JSON exactly at the byte boundary", async () => {
    const bytes = encode('{"name":"Synthetic"}');
    const { request } = streamed([bytes.subarray(0, 7), bytes.subarray(7)]);
    await expect(readBoundedJson(request, bytes.length)).resolves.toEqual({
      name: "Synthetic",
    });
  });
  it("decodes UTF-8 across chunk boundaries and counts bytes, not characters", async () => {
    const bytes = encode('{"name":"café 😀"}');
    const split = Array.from(bytes, (value) => new Uint8Array([value]));
    await expect(
      readBoundedJson(streamed(split).request, bytes.length),
    ).resolves.toEqual({ name: "café 😀" });
    await expect(
      readBoundedJson(streamed(split).request, bytes.length - 1),
    ).rejects.toBeInstanceOf(BodyTooLargeError);
  });
  it("stops and cancels a chunked upload without consuming the remaining body", async () => {
    const upload = streamed([
      encode("x".repeat(10)),
      encode("x".repeat(10)),
      encode("private unread tail"),
    ]);
    await expect(readBoundedJson(upload.request, 15)).rejects.toBeInstanceOf(
      BodyTooLargeError,
    );
    expect(upload.pull).toHaveBeenCalledTimes(2);
    expect(upload.cancel).toHaveBeenCalledTimes(1);
    expect(upload.request.body?.locked).toBe(false);
  });
  it("cannot be bypassed by an understated Content-Length", async () => {
    const upload = streamed([encode("x".repeat(30))], {
      "content-length": "1",
    });
    await expect(readBoundedJson(upload.request, 20)).rejects.toBeInstanceOf(
      BodyTooLargeError,
    );
    expect(upload.cancel).toHaveBeenCalledOnce();
  });
  it("rejects declared oversize without starting a body read", async () => {
    const upload = streamed([encode("unread body")], {
      "content-length": "1000",
    });
    const reader = vi.spyOn(upload.request.body!, "getReader");
    await expect(readBoundedJson(upload.request, 20)).rejects.toBeInstanceOf(
      BodyTooLargeError,
    );
    expect(reader).not.toHaveBeenCalled();
    expect(upload.pull).not.toHaveBeenCalled();
  });
  it("keeps bounding bytes when declared lengths are invalid", async () => {
    for (const value of ["not-a-number", "-1", "1.1", "1e9"])
      await expect(
        readBoundedJson(
          streamed([encode("x".repeat(30))], { "content-length": value })
            .request,
          20,
        ),
      ).rejects.toBeInstanceOf(BodyTooLargeError);
  });
  it("rejects empty and malformed JSON without exposing body contents", async () => {
    await expect(
      readBoundedJson(streamed([]).request, 20),
    ).rejects.toBeInstanceOf(SyntaxError);
    await expect(
      readBoundedJson(streamed([encode("not JSON")]).request, 20),
    ).rejects.toBeInstanceOf(SyntaxError);
    await expect(
      readBoundedJson(
        new Request("https://example.com", { method: "POST" }),
        20,
      ),
    ).rejects.toBeInstanceOf(SyntaxError);
  });
  it("rejects invalid UTF-8 and cancels the unread remainder", async () => {
    const upload = streamed([new Uint8Array([255]), encode("unread")]);
    await expect(readBoundedJson(upload.request, 20)).rejects.toBeInstanceOf(
      TypeError,
    );
    expect(upload.cancel).toHaveBeenCalledOnce();
  });
  it("propagates transport read errors with the reader released", async () => {
    const body = new ReadableStream({
      pull(controller) {
        controller.error(new Error("transport stopped"));
      },
    });
    const request = new Request("https://example.com", {
      method: "POST",
      body,
      duplex: "half",
    } as RequestInit);
    await expect(readBoundedJson(request, 20)).rejects.toThrow(
      "transport stopped",
    );
    expect(body.locked).toBe(false);
  });
  it("times out a stalled producer without waiting for cancellation to resolve", async () => {
    vi.useFakeTimers();
    try {
      const cancel = vi.fn(() => new Promise<void>(() => {}));
      const body = new ReadableStream<Uint8Array>({ cancel });
      const request = new Request("https://example.com", {
        method: "POST",
        body,
        duplex: "half",
      } as RequestInit);
      const result = readBoundedJson(request, 100, 10);
      const assertion =
        expect(result).rejects.toBeInstanceOf(BodyReadTimeoutError);
      await vi.advanceTimersByTimeAsync(10);
      await assertion;
      expect(cancel).toHaveBeenCalledOnce();
      expect(body.locked).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
  it("does not let trickled bytes reset the total upload deadline", async () => {
    vi.useFakeTimers();
    try {
      let interval: ReturnType<typeof setInterval>;
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encode("{"));
          interval = setInterval(() => controller.enqueue(encode(" ")), 4);
        },
        cancel() {
          clearInterval(interval);
        },
      });
      const request = new Request("https://example.com", {
        method: "POST",
        body,
        duplex: "half",
      } as RequestInit);
      const assertion = expect(
        readBoundedJson(request, 100, 10),
      ).rejects.toBeInstanceOf(BodyReadTimeoutError);
      await vi.advanceTimersByTimeAsync(10);
      await assertion;
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
  it("clears deadline timers after a successful parse", async () => {
    vi.useFakeTimers();
    try {
      await expect(
        readBoundedJson(streamed([encode("{}")]).request, 100),
      ).resolves.toEqual({});
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
  it("requires a finite positive deadline", async () => {
    for (const timeout of [0, -1, Infinity, 1.5])
      await expect(
        readBoundedJson(streamed([encode("{}")]).request, 100, timeout),
      ).rejects.toBeInstanceOf(RangeError);
  });
  it("rejects invalid limits before reading", async () => {
    for (const size of [0, -1, 1.5, Infinity]) {
      const upload = streamed([encode("{}")]);
      await expect(
        readBoundedJson(upload.request, size),
      ).rejects.toBeInstanceOf(RangeError);
      expect(upload.pull).not.toHaveBeenCalled();
    }
  });
});
describe("private JSON responses", () => {
  it("preserves statuses, payloads and retry headers while enforcing no-store", async () => {
    const response = privateJson(
      { message: "Try later" },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "Cache-Control": "public, max-age=900",
        },
      },
    );
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("60");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(await response.json()).toEqual({ message: "Try later" });
  });
});
