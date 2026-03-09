import { proxyJson } from "@/lib/backend-proxy";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  return proxyJson(req, `/api/events/${params.id}/leads`, {
    method: "POST",
  });
}