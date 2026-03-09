import { proxyJson } from "@/lib/backend-proxy";

export async function GET(req: Request) {
  return proxyJson(req, "/api/events/speakers");
}

export async function POST(req: Request) {
  return proxyJson(req, "/api/events/speakers", { method: "POST" });
}
