"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { CreatorAvatar } from "@/components/creator-avatar";
import { Search, Loader2, ExternalLink } from "lucide-react";
import type { Creator } from "@/lib/types";
import { formatCount } from "@/lib/utils";

interface LookupResult {
  handle: string;
  full_name: string;
  followers: number | null;
  is_private: boolean;
}

export function SearchCommand({ creators }: { creators: Creator[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [lookup, setLookup] = useState<LookupResult | null>(null);
  const [lookupState, setLookupState] = useState<"idle" | "loading" | "not_found" | "error">("idle");
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleaned = query.replace(/^@/, "").trim().toLowerCase();
  const matches = creators.filter((c) =>
    c.handle.toLowerCase().includes(cleaned),
  );
  const isNewLookup = cleaned.length > 1 && matches.length === 0;

  // Cancel any in-flight debounce timer on unmount.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Debounced live fetch, triggered from the input handler (not an effect
  // reacting to state) — only tracked-list matches are free; anything not in
  // the tracked list always hits ScrapeCreators live, per PLAN.md §6.
  function handleQueryChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const nextCleaned = value.replace(/^@/, "").trim().toLowerCase();
    const nextIsNewLookup =
      nextCleaned.length > 1 &&
      !creators.some((c) => c.handle.toLowerCase().includes(nextCleaned));

    if (!nextIsNewLookup) {
      setLookup(null);
      setLookupState("idle");
      return;
    }

    setLookupState("loading");
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/lookup?handle=${encodeURIComponent(nextCleaned)}`);
        if (res.status === 404) {
          setLookupState("not_found");
          setLookup(null);
          return;
        }
        if (!res.ok) {
          setLookupState("error");
          setLookup(null);
          return;
        }
        const data = (await res.json()) as LookupResult;
        setLookup(data);
        setLookupState("idle");
      } catch {
        setLookupState("error");
        setLookup(null);
      }
    }, 500);
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="text-muted-foreground sm:h-8 sm:w-64 sm:justify-start sm:px-3"
        onClick={() => setOpen(true)}
        aria-label="Search @username"
      >
        <Search className="h-4 w-4 sm:mr-2" />
        <span className="hidden text-sm sm:inline">Search @username…</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type an @username…"
          value={query}
          onValueChange={handleQueryChange}
        />
        <CommandList>
          {isNewLookup ? (
            lookupState === "loading" ? (
              <CommandEmpty className="flex items-center gap-2 px-4 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Looking up @{cleaned} on Instagram…
              </CommandEmpty>
            ) : lookup ? (
              <CommandGroup heading="Live lookup (not tracked)">
                <CommandItem
                  value={`live-${lookup.handle}`}
                  onSelect={() => {
                    window.open(
                      `https://www.instagram.com/${lookup.handle}/`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  className="gap-2"
                >
                  <div className="flex flex-1 items-center justify-between gap-2 overflow-hidden">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <CreatorAvatar
                        handle={lookup.handle}
                        fullName={lookup.full_name}
                        className="h-6 w-6 shrink-0"
                      />
                      <span className="truncate">@{lookup.handle}</span>
                      {lookup.followers != null && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatCount(lookup.followers)} followers
                        </span>
                      )}
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  </div>
                </CommandItem>
              </CommandGroup>
            ) : lookupState === "not_found" ? (
              <CommandEmpty className="px-4 py-6 text-sm text-muted-foreground">
                No Instagram account found for{" "}
                <span className="font-medium text-foreground">@{cleaned}</span>.
              </CommandEmpty>
            ) : (
              <CommandEmpty className="px-4 py-6 text-sm text-muted-foreground">
                Couldn&apos;t look that up right now — try again in a moment.
              </CommandEmpty>
            )
          ) : (
            <CommandEmpty>No tracked creators match.</CommandEmpty>
          )}
          <CommandGroup heading="Tracked creators">
            {matches.map((c) => (
              <CommandItem
                key={c.handle}
                value={c.handle}
                onSelect={() => {
                  setOpen(false);
                  router.push(`/creator/${c.handle}`);
                }}
                className="gap-2"
              >
                {/* Single flex child so CommandItem's own trailing (invisible)
                    checkmark — which also carries ml-auto — doesn't split the
                    auto-margin space with ours and pull the name off the edge. */}
                <div className="flex flex-1 items-center justify-between gap-2 overflow-hidden">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <CreatorAvatar
                      handle={c.handle}
                      fullName={c.full_name}
                      className="h-6 w-6 shrink-0"
                    />
                    <span className="truncate">@{c.handle}</span>
                  </div>
                  <span className="shrink-0 text-right text-xs text-muted-foreground">
                    {c.full_name}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
