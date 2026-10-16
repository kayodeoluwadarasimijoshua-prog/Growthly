export class BodyTooLargeError extends Error {
  constructor() {
    super("Request body exceeds the byte limit.");
    this.name = "BodyTooLargeError";
  }
}

export class BodyReadTimeoutError extends Error {
  constructor() {
    super("Request body read deadline exceeded.");
    this.name = "BodyReadTimeoutError";
  }
}

/** Bound application buffering even when Content-Length is absent or misleading.
 * The host/proxy may buffer earlier; this is not a substitute for host limits. */
export async function readBoundedJson(
  request: Request,
  maxBytes: number,
  timeoutMs = 15_000,
): Promise<unknown> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1)
    throw new RangeError("Invalid body limit.");
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1)
    throw new RangeError("Invalid body read deadline.");
  const declared = request.headers.get("content-length");
  if (
    declared &&
    /^\d+$/.test(declared.trim()) &&
    Number(declared) > maxBytes
  ) {
    // Do not start reading an already-declared oversized upload.
    throw new BodyTooLargeError();
  }
  if (!request.body) throw new SyntaxError("Missing JSON body.");
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let total = 0;
  let text = "";
  let completed = false;
  let timer: ReturnType<typeof setTimeout>;
  // One total deadline; trickling a byte must not reset it indefinitely.
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new BodyReadTimeoutError()), timeoutMs);
  });
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), deadline]);
      if (done) {
        completed = true;
        break;
      }
      total += value.byteLength;
      if (total > maxBytes) throw new BodyTooLargeError();
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } finally {
    clearTimeout(timer!);
    if (!completed) {
      // Don't wait for an untrusted producer's cancellation promise to settle.
      void reader.cancel().catch(() => {});
    }
    reader.releaseLock();
  }
}
