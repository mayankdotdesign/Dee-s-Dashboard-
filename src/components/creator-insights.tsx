import { Clock, Hash, Repeat, Activity, Film, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCount } from "@/lib/utils";
import {
  formatPerformance,
  bestPostingTime,
  topHashtags,
  postingCadence,
  consistency,
  type ConsistencyLevel,
} from "@/lib/insights";

const CONSISTENCY_LABEL: Record<ConsistencyLevel, string> = {
  steady: "Steady performer",
  "occasional-breakout": "Occasional breakout",
  "breakout-driven": "Breakout-driven",
};

function InsightCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Clock;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="gap-2 py-4">
      <CardContent className="flex flex-col gap-2.5 px-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {title}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function EmptyInsightCard({
  icon: Icon,
  title,
  message,
}: {
  icon: typeof Clock;
  title: string;
  message: string;
}) {
  return (
    <Card className="gap-2 border-dashed py-4">
      <CardContent className="flex flex-col gap-2.5 px-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {title}
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

function FormatMeter({
  label,
  value,
  max,
  isBest,
}: {
  label: string;
  value: number;
  max: number;
  isBest: boolean;
}) {
  const pct = max > 0 ? Math.max(4, (value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 shrink-0 capitalize text-muted-foreground">
        {label}
      </span>
      <div className="h-1.5 flex-1 rounded-full bg-primary/15">
        <div
          className={isBest ? "h-1.5 rounded-full bg-primary" : "h-1.5 rounded-full bg-primary/50"}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right tabular-nums text-muted-foreground">
        {formatCount(value)}
      </span>
    </div>
  );
}

export function CreatorInsights({ handle }: { handle: string }) {
  const format = formatPerformance(handle);
  const timing = bestPostingTime(handle);
  const hashtags = topHashtags(handle);
  const cadence = postingCadence(handle);
  const stability = consistency(handle);

  const maxFormatEngagement = format
    ? Math.max(...format.map((f) => f.avgEngagement))
    : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {format ? (
        <InsightCard icon={Film} title="Best format">
          <div className="flex flex-col gap-1.5">
            {format.map((f) => (
              <FormatMeter
                key={f.label}
                label={f.label}
                value={f.avgEngagement}
                max={maxFormatEngagement}
                isBest={f.isBest}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium capitalize text-foreground">
              {format[0].label}s
            </span>{" "}
            average the most engagement per post.
          </p>
        </InsightCard>
      ) : (
        <EmptyInsightCard
          icon={Film}
          title="Best format"
          message="Not enough format variety in the sampled posts to compare yet."
        />
      )}

      {timing ? (
        <InsightCard icon={Clock} title="Best time to post">
          <p className="text-xl font-semibold capitalize">
            {timing.dayLabel}, {timing.timeLabel}
          </p>
          <p className="text-xs text-muted-foreground">
            Based on the last {timing.sampleSize} posts (IST).
          </p>
        </InsightCard>
      ) : (
        <EmptyInsightCard
          icon={Clock}
          title="Best time to post"
          message="Need a few more posts before a day/time pattern is reliable."
        />
      )}

      {hashtags.length > 0 ? (
        <InsightCard icon={Hash} title="Frequently used hashtags">
          <div className="flex flex-wrap gap-1.5">
            {hashtags.map((h) => (
              <span
                key={h.tag}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {h.tag}
                <span className="ml-1 text-muted-foreground/60">
                  ×{h.count}
                </span>
              </span>
            ))}
          </div>
        </InsightCard>
      ) : (
        <EmptyInsightCard
          icon={Hash}
          title="Frequently used hashtags"
          message="No hashtags found in the sampled posts."
        />
      )}

      {cadence ? (
        <InsightCard icon={Repeat} title="Posting cadence">
          <p className="text-xl font-semibold tabular-nums">
            ~{cadence.postsPerWeek.toFixed(1)} posts/week
          </p>
          <p className="text-xs text-muted-foreground">
            Typically about every {cadence.typicalDaysBetween.toFixed(1)} days.
          </p>
        </InsightCard>
      ) : (
        <EmptyInsightCard
          icon={Repeat}
          title="Posting cadence"
          message="Need a few more posts to estimate a posting rhythm."
        />
      )}

      {stability ? (
        <InsightCard icon={Activity} title="Consistency">
          <p className="text-xl font-semibold">
            {CONSISTENCY_LABEL[stability.level]}
          </p>
          <p className="text-xs text-muted-foreground tabular-nums">
            Typical post: ~{formatCount(stability.medianEngagement)}{" "}
            engagements · Best: ~{formatCount(stability.maxEngagement)}
          </p>
        </InsightCard>
      ) : (
        <EmptyInsightCard
          icon={Activity}
          title="Consistency"
          message="Need a few more posts to tell steady performers from one-hit spikes."
        />
      )}

      <EmptyInsightCard
        icon={TrendingUp}
        title="Follower growth over time"
        message="Coming soon — this will fill in once we've tracked a few weeks of history for this account."
      />
    </div>
  );
}
