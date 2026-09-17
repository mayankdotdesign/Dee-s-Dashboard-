"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LeaderboardTable } from "@/components/leaderboard-table";
import type { Creator } from "@/lib/types";

function DisabledTabTrigger({ label }: { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span tabIndex={0} className="inline-flex" />}>
        <TabsTrigger value={label.toLowerCase().replace(" ", "-")} disabled>
          {label}
        </TabsTrigger>
      </TooltipTrigger>
      <TooltipContent>
        Needs a few {label === "This week" ? "weeks" : "months"} of history
        from the ingestion cron before this can differ from All time.
      </TooltipContent>
    </Tooltip>
  );
}

export function LeaderboardTabs({ creators }: { creators: Creator[] }) {
  return (
    <Tabs defaultValue="all-time" className="gap-4">
      <TabsList>
        <DisabledTabTrigger label="This week" />
        <DisabledTabTrigger label="This month" />
        <TabsTrigger value="all-time">All time</TabsTrigger>
      </TabsList>

      <TabsContent value="all-time">
        <LeaderboardTable creators={creators} />
      </TabsContent>
    </Tabs>
  );
}
