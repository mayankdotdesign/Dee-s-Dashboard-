"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Play, Layers, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatCount } from "@/lib/utils";
import type { Post } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const HASHTAG_RE = /#[\p{L}\p{N}_]+/gu;

function splitCaption(caption: string) {
  // Real captions sometimes repeat a hashtag — dedupe so it isn't rendered
  // (and keyed) twice.
  const hashtags = [...new Set(caption.match(HASHTAG_RE) ?? [])];
  const text = caption.replace(HASHTAG_RE, "").replace(/\s{2,}/g, " ").trim();
  return { text, hashtags };
}

function StatPill({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Heart;
  value: number;
  label: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-sm font-semibold tabular-nums text-foreground" />
        }
      >
        <Icon className="h-4 w-4 text-primary" />
        {formatCount(value)}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function PostCard({
  post,
  priority = false,
}: {
  post: Post;
  /** Eager-load for above-the-fold cards so the first screenful never shows blank placeholders. */
  priority?: boolean;
}) {
  const { text, hashtags } = splitCaption(post.caption);
  const [loaded, setLoaded] = useState(false);

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 rounded-lg border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-5 sm:p-4"
    >
      <div className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-md bg-muted sm:w-36">
        <Image
          src={post.thumbnail}
          alt={post.caption || "Post thumbnail"}
          fill
          priority={priority}
          sizes="(max-width: 640px) 112px, 144px"
          onLoad={() => setLoaded(true)}
          className={cn(
            "object-cover transition-[opacity,transform] duration-300 group-hover:scale-105 motion-reduce:transition-opacity",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
        <div className="absolute right-1.5 top-1.5 rounded-full bg-black/55 p-1 text-white backdrop-blur-sm">
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

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        {text && (
          <p className="line-clamp-4 text-sm leading-relaxed text-foreground/90">
            {text}
          </p>
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

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <StatPill icon={Heart} value={post.like_count} label="Likes" />
          <StatPill
            icon={MessageCircle}
            value={post.comment_count}
            label="Comments"
          />
          {post.play_count != null && (
            <StatPill icon={Play} value={post.play_count} label="Views" />
          )}
        </div>

        <p className="text-xs text-muted-foreground/70">
          {formatDate(post.created_at)}
        </p>
      </div>
    </a>
  );
}
