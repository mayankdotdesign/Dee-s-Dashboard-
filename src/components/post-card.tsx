import Image from "next/image";
import { Heart, MessageCircle, Play, Layers, ExternalLink } from "lucide-react";
import type { Post } from "@/lib/types";

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const HASHTAG_RE = /#[\p{L}\p{N}_]+/gu;

function splitCaption(caption: string) {
  const hashtags = caption.match(HASHTAG_RE) ?? [];
  const text = caption.replace(HASHTAG_RE, "").replace(/\s{2,}/g, " ").trim();
  return { text, hashtags };
}

function StatPill({
  icon: Icon,
  value,
}: {
  icon: typeof Heart;
  value: number;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-sm font-semibold tabular-nums text-foreground">
      <Icon className="h-4 w-4 text-primary" />
      {formatCount(value)}
    </span>
  );
}

export function PostCard({ post }: { post: Post }) {
  const { text, hashtags } = splitCaption(post.caption);

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        <Image
          src={post.thumbnail}
          alt={post.caption || "Post thumbnail"}
          fill
          sizes="(max-width: 640px) 100vw, 480px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute right-2 top-2 rounded-full bg-black/55 p-1.5 text-white backdrop-blur-sm">
          {post.media_label === "reel" ? (
            <Play className="h-3.5 w-3.5 fill-white" />
          ) : post.media_label === "carousel" ? (
            <Layers className="h-3.5 w-3.5" />
          ) : null}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
          <ExternalLink className="h-6 w-6 text-white drop-shadow" />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatPill icon={Heart} value={post.like_count} />
          <StatPill icon={MessageCircle} value={post.comment_count} />
          {post.play_count != null && (
            <StatPill icon={Play} value={post.play_count} />
          )}
        </div>

        {text && (
          <p className="text-sm leading-relaxed text-foreground/90">{text}</p>
        )}

        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground/70">
          {formatDate(post.created_at)}
        </p>
      </div>
    </a>
  );
}
