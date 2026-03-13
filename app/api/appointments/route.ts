import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { proxyJson } from "@/lib/backend-proxy"

// Event–exhibitor appointments are stored on the backend (PostgreSQL).
// Proxy GET/POST/PUT to backend so eventId/exhibitorId (UUIDs from backend) match.
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return proxyJson(request as unknown as Request, "/api/appointments", {
    method: "GET",
  })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await request.json().catch(() => ({}))
  if (body.requesterId && body.requesterId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return proxyJson(request as unknown as Request, "/api/appointments", {
    method: "POST",
    body: JSON.stringify({ ...body, requesterId: body.requesterId ?? session.user.id }),
  })
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await request.json().catch(() => ({}))
  if (!body.appointmentId) {
    return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 })
  }
  if (body.status === "CANCELLED") {
    body.cancelledBy = session.user.id
  }
  return proxyJson(request as unknown as Request, "/api/appointments", {
    method: "PUT",
    body: JSON.stringify(body),
  })
}