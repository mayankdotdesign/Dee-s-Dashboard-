import { NextResponse, type NextRequest } from "next/server";

// Simple HTTP Basic Auth gate — keeps this off search engines and casual
// link-sharing without needing a real auth provider for a single-user tool.
// Set DASHBOARD_PASSWORD in Vercel env vars. Username can be anything.
export function middleware(request: NextRequest) {
  const password = process.env.DASHBOARD_PASSWORD;

  // No password configured (e.g. local dev without .env.local) — don't lock
  // the owner out of their own machine.
  if (!password) return NextResponse.next();

  const auth = request.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const [, suppliedPassword] = decoded.split(":");
      if (suppliedPassword === password) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Dee\'s Dashboard"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
