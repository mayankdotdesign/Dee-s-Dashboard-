import { cn } from "@/lib/utils";

/**
 * Inline meter: fill = single accent hue, track = lighter step of the same
 * ramp (via opacity, not a second hue) — per dataviz skill's Meter spec.
 * Magnitude only, not a categorical comparison, so one hue throughout.
 */
export function EngagementMeter({
  valuePct,
  max = 40,
  className,
}: {
  valuePct: number | null;
  max?: number;
  className?: string;
}) {
  if (valuePct == null) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="h-1.5 w-16 rounded-full bg-primary/10" />
        <span className="text-xs text-muted-foreground">n/a</span>
      </div>
    );
  }

  const pct = Math.max(0, Math.min(100, (valuePct / max) * 100));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 w-16 rounded-full bg-primary/15">
        <div
          className="h-1.5 rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums">
        {valuePct.toFixed(1)}%
      </span>
    </div>
  );
}
