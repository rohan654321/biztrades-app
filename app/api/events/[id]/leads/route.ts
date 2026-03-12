import { proxyJson } from "@/lib/backend-proxy";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> | { id: string } }
) {
  // In Next 16 app routes, params can be a Promise; always await to be safe.
  const { id } = await Promise.resolve(ctx.params);

  return proxyJson(req, `/api/events/${id}/leads`, {
    method: "POST",
  });
}