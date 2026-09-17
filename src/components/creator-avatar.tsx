import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

// Deterministic hue from the handle so avatars stay visually distinct
// without needing live (and short-lived) Instagram CDN image URLs.
function hueFromHandle(handle: string) {
  let hash = 0;
  for (let i = 0; i < handle.length; i++) {
    hash = (hash * 31 + handle.charCodeAt(i)) % 360;
  }
  return hash;
}

export function CreatorAvatar({
  handle,
  fullName,
  className,
}: {
  handle: string;
  fullName: string;
  className?: string;
}) {
  const hue = hueFromHandle(handle);
  return (
    <Avatar className={cn("border border-border", className)}>
      <AvatarFallback
        style={{
          backgroundColor: `oklch(0.9 0.05 ${hue})`,
          color: `oklch(0.32 0.08 ${hue})`,
        }}
        className="font-heading font-semibold"
      >
        {initials(fullName) || handle.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
