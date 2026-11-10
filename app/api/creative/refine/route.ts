import { z } from "zod";
import type { NextRequest } from "next/server";
import { getStudioContext } from "@/lib/supabase/studio";
import { privateJson } from "@/lib/api-response";
import { isSameOriginRequest } from "@/lib/request-security";
import {
  readBoundedJson,
  BodyTooLargeError,
  BodyReadTimeoutError,
} from "@/lib/bounded-json";
import { checkRateLimit } from "@/lib/rate-limit";
import { serviceSlugs } from "@/lib/cms/schema";
import {
  askStudioAI,
  refinementPreservesFacts,
  studioAIAvailable,
} from "@/lib/studio-ai";
export const runtime = "nodejs";
const schema = z
  .object({
    service: z.enum(serviceSlugs),
    source: z.string().trim().min(20).max(2500),
  })
  .strict();
export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return privateJson({ message: "Request not accepted." }, { status: 403 });
  const auth = await getStudioContext();
  if (!auth.ok)
    return privateJson(
      { message: "Creative or owner access is required." },
      {
        status:
          auth.reason === "not-configured"
            ? 503
            : auth.reason === "unauthenticated"
              ? 401
              : 403,
      },
    );
  if (!studioAIAvailable())
    return privateJson(
      {
        message:
          "The AI writing assistant is not configured yet. You can still write, save and submit your own description.",
      },
      { status: 503 },
    );
  if (!checkRateLimit(`creative-ai:${auth.user.id}`, 12, 600000).allowed)
    return privateJson(
      { message: "Please wait before asking for another refinement." },
      { status: 429 },
    );
  try {
    const parsed = schema.safeParse(await readBoundedJson(request, 12000));
    if (!parsed.success)
      return privateJson(
        { message: "Provide 20–2500 characters of factual project notes." },
        { status: 400 },
      );
    if (
      auth.role === "creative_editor" &&
      !["graphic-design", "ai-video-adverts"].includes(parsed.data.service)
    )
      return privateJson(
        {
          message:
            "Your role can refine graphic-design and AI-advert work only.",
        },
        { status: 403 },
      );
    const text = await askStudioAI(
      "You refine factual Growthly project descriptions. Improve clarity, grammar and flow without adding or strengthening facts. Keep uncertainty. Do not add clients, results, numbers, credentials, features, prices, rights or promises. If the notes are insufficient, say what information is missing rather than inventing it. Never claim work is published, approved or client work unless explicitly stated in the supplied notes.",
      JSON.stringify(parsed.data),
    );
    if (!refinementPreservesFacts(parsed.data.source, text))
      return privateJson(
        {
          message:
            "The suggestion added an unsupported claim. Nothing was applied; review your notes and retry.",
        },
        { status: 422 },
      );
    return privateJson({ refinement: text });
  } catch (error) {
    return privateJson(
      {
        message:
          "The writing suggestion could not be completed. Your draft has not changed.",
      },
      {
        status:
          error instanceof BodyTooLargeError
            ? 413
            : error instanceof BodyReadTimeoutError
              ? 408
              : error instanceof SyntaxError
                ? 400
                : 503,
      },
    );
  }
}
