/** Server-side provider transport: deadline covers headers AND body, not just connect. */
export async function providerFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 5000,
  maxBytes = 2_000_000,
): Promise<Response> {
  if (
    !Number.isFinite(timeoutMs) ||
    timeoutMs <= 0 ||
    !Number.isSafeInteger(maxBytes) ||
    maxBytes < 1
  )
    throw new RangeError("Invalid provider bounds");
  const controller = new AbortController();
  const signal = init.signal
    ? AbortSignal.any([init.signal, controller.signal])
    : controller.signal;
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  let completed = false;
  let abort: () => void = () => {};
  const stopped = new Promise<never>((_, reject) => {
    abort = () =>
      reject(signal.reason ?? new Error("Provider request aborted"));
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
  });
  const timer = setTimeout(
    () => controller.abort(new Error("Provider request timed out")),
    timeoutMs,
  );
  try {
    const response = await Promise.race([
      Promise.resolve().then(async () => {
        if (signal.aborted) throw signal.reason;
        const response = await fetch(input, { ...init, signal });
        if (signal.aborted) {
          void response.body?.cancel().catch(() => {});
          throw signal.reason;
        }
        return response;
      }),
      stopped,
    ]);
    if (!response.body) {
      completed = true;
      return response;
    }
    reader = response.body.getReader();
    const parts: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const chunk = await Promise.race([reader.read(), stopped]);
      if (chunk.done) break;
      length += chunk.value.byteLength;
      if (length > maxBytes) throw new Error("Provider response exceeds limit");
      parts.push(chunk.value);
    }
    const body = new Uint8Array(length);
    let offset = 0;
    for (const part of parts) {
      body.set(part, offset);
      offset += part.length;
    }
    const headers = new Headers(response.headers);
    // fetch already decoded any transfer encoding; don't copy a stale encoded length.
    headers.delete("content-encoding");
    headers.delete("content-length");
    completed = true;
    return new Response(length ? body : null, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", abort);
    if (!completed) {
      controller.abort();
      void reader?.cancel().catch(() => {});
    }
    try {
      reader?.releaseLock();
    } catch {
      /* A non-cooperative transport may still be reading. */
    }
  }
}
