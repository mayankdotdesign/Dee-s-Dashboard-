import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) {
    // Nothing configured — treat as open, same as the proxy's own fallback.
    return NextResponse.json({ ok: true });
  }

  const body = await request.json().catch(() => null);
  const supplied = typeof body?.password === "string" ? body.password : "";

  if (supplied !== password) {
    return NextResponse.json(
      { ok: false, error: "That password isn't right — try again." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await hashPassword(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return response;
}
