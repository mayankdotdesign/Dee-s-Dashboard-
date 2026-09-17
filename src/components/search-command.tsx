"use client";

import { useEffect, useState } from "react";
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
import { Search } from "lucide-react";
import type { Creator } from "@/lib/types";

export function SearchCommand({ creators }: { creators: Creator[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const cleaned = query.replace(/^@/, "").trim().toLowerCase();
  const matches = creators.filter((c) =>
    c.handle.toLowerCase().includes(cleaned),
  );
  const isNewLookup = cleaned.length > 1 && matches.length === 0;

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search @username…
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type an @username…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {isNewLookup ? (
            <CommandEmpty className="px-4 py-6 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                @{cleaned}
              </span>{" "}
              isn&apos;t in your tracked list yet. Looking up any account
              on demand is coming soon.
            </CommandEmpty>
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
                <CreatorAvatar
                  handle={c.handle}
                  fullName={c.full_name}
                  className="h-6 w-6"
                />
                <span>@{c.handle}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {c.full_name}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
