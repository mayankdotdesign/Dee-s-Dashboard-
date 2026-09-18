import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

// Deterministic hue from the handle so the fallback stays visually distinct
// per creator even before a real photo (or if one never loads).
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
  profilePicUrl,
  className,
}: {
  handle: string;
  fullName: string;
  /** Already proxied through /api/img — see lib/creators.ts. */
  profilePicUrl?: string | null;
  className?: string;
}) {
  const hue = hueFromHandle(handle);
  return (
    <Avatar className={cn("border border-border", className)}>
      {profilePicUrl && (
        <AvatarImage src={profilePicUrl} alt={`@${handle}`} />
      )}
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
