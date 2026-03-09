const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function proxyJson(
  req: Request,
  backendPath: string,
  init?: RequestInit
): Promise<Response> {
  const url = new URL(req.url);
  const search = url.search ? url.search : "";

  const target = `${API_BASE_URL}${backendPath}${search}`;

  const auth = req.headers.get("authorization") ?? undefined;
  const method = init?.method ?? req.method;

  let body: BodyInit | undefined = init?.body;

  if (!body && method !== "GET" && method !== "HEAD") {
    try {
      const json = await req.json();
      body = JSON.stringify(json);
    } catch {
      // ignore body-less requests
    }
  }

  const res = await fetch(target, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
      ...(init?.headers ?? {}),
    },
    body,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  return Response.json(data, { status: res.status });
}

