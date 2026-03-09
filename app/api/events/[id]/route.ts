import { proxyJson } from "@/lib/backend-proxy";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  return proxyJson(req, `/api/events/${params.id}`);
}