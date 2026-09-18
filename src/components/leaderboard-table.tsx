import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreatorAvatar } from "@/components/creator-avatar";
import { CategoryBadge } from "@/components/category-badge";
import { EngagementMeter } from "@/components/engagement-meter";
import { NicheFilter } from "@/components/niche-filter";
import type { Creator } from "@/lib/types";

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function LeaderboardTable({ creators }: { creators: Creator[] }) {
  const maxEngagement = Math.max(0, ...creators.map((c) => c.engagement_rate_pct ?? 0));

  return (
    <>
      <LeaderboardCards creators={creators} maxEngagement={maxEngagement} />

      <div className="hidden overflow-x-auto rounded-lg border border-border sm:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 text-muted-foreground">#</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead className="p-0">
                <NicheFilter />
              </TableHead>
              <TableHead className="text-right">Followers</TableHead>
              <TableHead>Engagement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creators.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No creators in this niche yet.
                </TableCell>
              </TableRow>
            )}
            {creators.map((creator, i) => (
              <TableRow key={creator.handle} className="group transition-colors hover:bg-muted/40">
                <TableCell className="tabular-nums text-muted-foreground">
                  {i + 1}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/creator/${creator.handle}`}
                    className="flex items-center gap-3 rounded-md py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <CreatorAvatar
                      handle={creator.handle}
                      fullName={creator.full_name}
                      profilePicUrl={creator.profile_pic_url}
                      className="h-9 w-9"
                    />
                    <span className="flex flex-col">
                      <span className="font-medium leading-tight group-hover:text-primary transition-colors">
                        @{creator.handle}
                      </span>
                      <span className="text-xs text-muted-foreground leading-tight">
                        {creator.full_name}
                      </span>
                    </span>
                  </Link>
                </TableCell>
                <TableCell>
                  <CategoryBadge category={creator.category} />
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">
                  {formatFollowers(creator.followers)}
                </TableCell>
                <TableCell>
                  <EngagementMeter
                    valuePct={creator.engagement_rate_pct}
                    max={maxEngagement}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

// Below `sm`, a 5-column table forces horizontal scrolling and hides the
// Niche/Followers/Engagement columns off-screen — a stacked card per creator
// keeps everything visible without scrolling sideways.
function LeaderboardCards({
  creators,
  maxEngagement,
}: {
  creators: Creator[];
  maxEngagement: number;
}) {
  return (
    <div className="flex flex-col gap-2 sm:hidden">
      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          Filter
        </span>
        <NicheFilter />
      </div>

      {creators.length === 0 && (
        <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          No creators in this niche yet.
        </p>
      )}

      {creators.map((creator, i) => (
        <Link
          key={creator.handle}
          href={`/creator/${creator.handle}`}
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="w-4 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
            {i + 1}
          </span>
          <CreatorAvatar
            handle={creator.handle}
            fullName={creator.full_name}
            profilePicUrl={creator.profile_pic_url}
            className="h-10 w-10 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium leading-tight">
              @{creator.handle}
            </p>
            <p className="truncate text-xs leading-tight text-muted-foreground">
              {creator.full_name}
            </p>
            <div className="mt-1.5">
              <CategoryBadge category={creator.category} />
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="text-sm font-medium tabular-nums">
              {formatFollowers(creator.followers)}
            </span>
            <EngagementMeter
              valuePct={creator.engagement_rate_pct}
              max={maxEngagement}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
