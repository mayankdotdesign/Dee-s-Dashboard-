import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, hashPassword } from "@/lib/auth";

// Gates the whole app behind a single shared password, via a branded
// /login page instead of the browser's native Basic Auth prompt.
// Set DASHBOARD_PASSWORD in Vercel env vars.
export async function proxy(request: NextRequest) {
  const password = process.env.DASHBOARD_PASSWORD;

  // No password configured (e.g. local dev without .env.local) — don't lock
  // the owner out of their own machine.
  if (!password) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname === "/login" || pathname === "/api/login") {
    return NextResponse.next();
  }
  // Vercel Cron hits this on its own schedule with no session cookie —
  // it's gated by CRON_SECRET inside the route itself instead.
  if (pathname.startsWith("/api/cron/")) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const expected = await hashPassword(password);
  if (cookie === expected) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
