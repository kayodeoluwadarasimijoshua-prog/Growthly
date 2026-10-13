import { permanentRedirect } from "next/navigation";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query))
    if (typeof v === "string") params.set(k, v);
  permanentRedirect(`/request-a-quote${params.size ? `?${params}` : ""}`);
}
