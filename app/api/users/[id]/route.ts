import { proxyJson } from "@/lib/backend-proxy";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  return proxyJson(req, `/api/users/${params.id}`);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  return proxyJson(req, `/api/users/${params.id}`, { method: "PUT" });
}