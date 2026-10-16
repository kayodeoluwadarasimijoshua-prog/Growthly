import { afterEach, describe, expect, it, vi } from "vitest";
import { providerFetch } from "@/lib/provider-fetch";
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe("bounded server provider transport", () => {
  it("preserves JSON, status and ordinary headers; clears its timer", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response('{"ok":true}', {
          status: 201,
          headers: { "x-test": "yes" },
        }),
      ),
    );
    const response = await providerFetch("https://provider.invalid");
    expect(response.status).toBe(201);
    expect(response.headers.get("x-test")).toBe("yes");
    expect(await response.json()).toEqual({ ok: true });
    expect(vi.getTimerCount()).toBe(0);
  });
  it("times out even if fetch ignores cancellation", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn(() => new Promise<Response>(() => {}));
    vi.stubGlobal("fetch", fetcher);
    const failure = expect(
      providerFetch("https://provider.invalid", {}, 100),
    ).rejects.toThrow("timed out");
    await vi.advanceTimersByTimeAsync(100);
    await failure;
    expect(fetcher.mock.calls[0]).toBeDefined();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("bounds a stalled body and never awaits an uncooperative cancel", async () => {
    vi.useFakeTimers();
    const cancel = vi.fn(() => new Promise<void>(() => {}));
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(new ReadableStream({ cancel }))),
    );
    const failure = expect(
      providerFetch("https://provider.invalid", {}, 100),
    ).rejects.toThrow("timed out");
    await vi.advanceTimersByTimeAsync(100);
    await failure;
    expect(cancel).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("does not restart the deadline for trickled response bytes", async () => {
    vi.useFakeTimers();
    let writer!: ReadableStreamDefaultController<Uint8Array>;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          new ReadableStream({
            start(c) {
              writer = c;
            },
          }),
        ),
      ),
    );
    const failure = expect(
      providerFetch("https://provider.invalid", {}, 100),
    ).rejects.toThrow("timed out");
    await vi.advanceTimersByTimeAsync(70);
    writer.enqueue(new Uint8Array([1]));
    await vi.advanceTimersByTimeAsync(30);
    await failure;
  });
  it("rejects oversized streamed responses without reading their remaining tail", async () => {
    const cancel = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          new ReadableStream({
            start(c) {
              c.enqueue(new Uint8Array(11));
            },
            cancel,
          }),
        ),
      ),
    );
    await expect(
      providerFetch("https://provider.invalid", {}, 100, 10),
    ).rejects.toThrow("exceeds limit");
    expect(cancel).toHaveBeenCalled();
  });
  it("honours an existing caller abort signal", async () => {
    const controller = new AbortController();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>(() => {})),
    );
    const failure = expect(
      providerFetch("https://provider.invalid", { signal: controller.signal }),
    ).rejects.toThrow("Caller cancelled");
    controller.abort(new Error("Caller cancelled"));
    await failure;
  });
  it("preserves empty responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    );
    expect((await providerFetch("https://provider.invalid")).status).toBe(204);
  });
  it("cleans up after a synchronous transport failure", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        throw new Error("offline");
      }),
    );
    await expect(providerFetch("https://provider.invalid")).rejects.toThrow(
      "offline",
    );
    expect(vi.getTimerCount()).toBe(0);
  });
  it("rejects invalid bounds", async () => {
    await expect(
      providerFetch("https://provider.invalid", {}, Infinity),
    ).rejects.toThrow(RangeError);
  });
});

it("does not start transport for an already cancelled caller", async () => {
  const fetcher = vi.fn();
  vi.stubGlobal("fetch", fetcher);
  const controller = new AbortController();
  controller.abort(new Error("Already cancelled"));
  await expect(
    providerFetch("https://provider.invalid", { signal: controller.signal }),
  ).rejects.toThrow("Already cancelled");
  expect(fetcher).not.toHaveBeenCalled();
});
it("cancels a late response from a transport that ignored the abort", async () => {
  vi.useFakeTimers();
  let finish!: (r: Response) => void;
  vi.stubGlobal(
    "fetch",
    vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          finish = resolve;
        }),
    ),
  );
  const failure = expect(
    providerFetch("https://provider.invalid", {}, 100),
  ).rejects.toThrow("timed out");
  await vi.advanceTimersByTimeAsync(100);
  await failure;
  const cancel = vi.fn();
  finish(new Response(new ReadableStream({ cancel })));
  await vi.advanceTimersByTimeAsync(0);
  expect(cancel).toHaveBeenCalled();
});
