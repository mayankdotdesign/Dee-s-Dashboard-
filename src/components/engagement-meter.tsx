import { cn } from "@/lib/utils";

/**
 * Inline meter: fill = single accent hue, track = lighter step of the same
 * ramp (via opacity, not a second hue) — per dataviz skill's Meter spec.
 * Magnitude only, not a categorical comparison, so one hue throughout.
 *
 * Scaled with sqrt, not linearly, against `max` — real engagement rates
 * from live data span roughly 5%-370%, and a single small/viral account
 * makes a linear scale either clip everything to full or crush the rest
 * to slivers. sqrt keeps the ranking visually legible across that range.
 */
export function EngagementMeter({
  valuePct,
  max = 100,
  className,
}: {
  valuePct: number | null;
  /** The highest value in the set being compared — pass the dataset max for a meaningful relative scale. */
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

  const ratio = max > 0 ? Math.max(0, valuePct) / max : 0;
  const pct = Math.max(0, Math.min(100, Math.sqrt(ratio) * 100));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 w-16 rounded-full bg-primary/15">
        <div
          className="h-1.5 rounded-full bg-primary transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums">
        {valuePct.toFixed(1)}%
      </span>
    </div>
  );
}
