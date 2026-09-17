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
import type { Creator } from "@/lib/types";

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function LeaderboardTable({ creators }: { creators: Creator[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 text-muted-foreground">#</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Niche</TableHead>
            <TableHead className="text-right">Followers</TableHead>
            <TableHead>Engagement</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creators.map((creator, i) => (
            <TableRow key={creator.handle} className="group">
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
                <EngagementMeter valuePct={creator.engagement_rate_pct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
