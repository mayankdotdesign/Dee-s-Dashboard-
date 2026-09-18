import { NextResponse } from "next/server";
import { proxiedImage } from "@/lib/utils";

export const dynamic = "force-dynamic";

// On-demand @username lookup for the search box — always hits ScrapeCreators
// live (no caching, no DB write), regardless of the tracked list's monthly
// cadence. Gated by the same DASHBOARD_PASSWORD session as the rest of the
// app (see src/proxy.ts), since each call spends a ScrapeCreators credit.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get("handle")?.trim().replace(/^@/, "");

  if (!handle || !/^[a-zA-Z0-9._]{1,30}$/.test(handle)) {
    return NextResponse.json({ error: "Invalid handle" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.scrapecreators.com/v1/instagram/profile?handle=${encodeURIComponent(handle)}&trim=true`,
    { headers: { "x-api-key": process.env.SCRAPECREATORS_API_KEY! } },
  );

  if (res.status === 404) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (!res.ok) {
    return NextResponse.json({ error: "lookup_failed" }, { status: 502 });
  }

  const data = await res.json();
  const user = data?.data?.user;
  if (!user) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const picUrl: string | null = user.profile_pic_url_hd ?? user.profile_pic_url ?? null;

  return NextResponse.json({
    handle: user.username ?? handle,
    full_name: user.full_name ?? user.username ?? handle,
    followers: user.edge_followed_by?.count ?? null,
    is_private: Boolean(user.is_private),
    profile_pic_url: picUrl ? proxiedImage(picUrl) : null,
  });
}
