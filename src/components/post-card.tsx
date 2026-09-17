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

export function PostCard({ post }: { post: Post }) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={post.thumbnail}
          alt={post.caption || "Post thumbnail"}
          fill
          sizes="(max-width: 640px) 50vw, 240px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute right-2 top-2 rounded-full bg-black/55 p-1.5 text-white backdrop-blur-sm">
          {post.media_label === "reel" ? (
            <Play className="h-3 w-3 fill-white" />
          ) : post.media_label === "carousel" ? (
            <Layers className="h-3 w-3" />
          ) : null}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
          <ExternalLink className="h-5 w-5 text-white drop-shadow" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Heart className="h-3.5 w-3.5" />
            {formatCount(post.like_count)}
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <MessageCircle className="h-3.5 w-3.5" />
            {formatCount(post.comment_count)}
          </span>
          {post.play_count != null && (
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Play className="h-3.5 w-3.5" />
              {formatCount(post.play_count)}
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {post.caption || "No caption"}
        </p>
        <p className="text-[11px] text-muted-foreground/70">
          {formatDate(post.created_at)}
        </p>
      </div>
    </a>
  );
}
