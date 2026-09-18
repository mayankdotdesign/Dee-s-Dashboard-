import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_HOSTS = [".cdninstagram.com", ".fbcdn.net"];

// Instagram's CDN sends Cross-Origin-Resource-Policy: same-origin on some
// edge hosts, which blocks the browser from loading the image directly on
// our domain. Fetching it server-side (no CORS) and re-serving it same-origin
// works around that. Doesn't solve the CDN URL's own eventual expiry, but
// that's the same trade-off the original locally-hosted thumbnails avoided
// only by pre-downloading at scrape time.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("url");
  if (!src) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(src);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }
  if (
    parsed.protocol !== "https:" ||
    !ALLOWED_HOSTS.some((h) => parsed.hostname.endsWith(h))
  ) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
  }

  const res = await fetch(src);
  if (!res.ok) {
    return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 });
  }

  const buf = await res.arrayBuffer();
  return new NextResponse(buf, {
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
