import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { isSameOriginRequest } from "@/lib/request-security";
import { getAdminContext } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const updateSchema = z
  .object({
    status: z
      .enum(["new", "contacted", "qualified", "proposal_sent", "won", "lost"])
      .optional(),
    assigned_to: z.string().trim().max(120).nullable().optional(),
    internal_notes: z.string().trim().max(5000).optional(),
    quoted_amount: z
      .number()
      .finite()
      .min(0)
      .max(999_999_999_999)
      .nullable()
      .optional(),
    deposit_status: z
      .enum(["not-discussed", "not-requested", "awaiting", "partial", "paid"])
      .optional(),
    follow_up_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable()
      .optional(),
  })
  .strict()
  .refine(
    (value) => Object.keys(value).length > 0,
    "Add at least one field to update.",
  );

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { message: "This request could not be accepted." },
      { status: 403 },
    );
  }
  const auth = await getAdminContext();
  if (!auth.ok) {
    const status =
      auth.reason === "not-configured"
        ? 503
        : auth.reason === "forbidden"
          ? 403
          : 401;
    return NextResponse.json(
      { message: "You are not authorised to update lead records." },
      { status },
    );
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > 12_000)
      return NextResponse.json(
        { message: "The update is too large." },
        { status: 413 },
      );
    body = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { message: "Enter a valid update." },
      { status: 400 },
    );
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Check the lead update and try again." },
      { status: 400 },
    );
  }

  const { id } = await context.params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json(
      { message: "That lead record was not found." },
      { status: 404 },
    );
  }

  if (parsed.data.follow_up_date) {
    const date = new Date(`${parsed.data.follow_up_date}T00:00:00.000Z`);
    if (
      Number.isNaN(date.valueOf()) ||
      date.toISOString().slice(0, 10) !== parsed.data.follow_up_date
    ) {
      return NextResponse.json(
        { message: "Choose a valid follow-up date." },
        { status: 400 },
      );
    }
  }

  const { data, error } = await auth.supabase
    .from("inquiries")
    .update(parsed.data)
    .eq("id", id)
    .select(
      "id, status, assigned_to, internal_notes, quoted_amount, deposit_status, follow_up_date",
    )
    .single();

  if (error || !data) {
    if (error)
      console.error("Admin lead update failed", error.code ?? "unknown");
    return NextResponse.json(
      { message: "The record could not be updated. Refresh and try again." },
      { status: error?.code === "PGRST116" ? 404 : 500 },
    );
  }

  return NextResponse.json({ lead: data });
}
