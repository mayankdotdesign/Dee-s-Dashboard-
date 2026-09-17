"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchCommand } from "@/components/search-command";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { getCreators } from "@/lib/creators";

const NAV_LINKS = [
  { href: "/", label: "Leaderboard" },
  { href: "/trending", label: "Trending" },
];

export function SiteHeader() {
  const creators = getCreators();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3">
        <Link
          href="/"
          aria-label="Dee's Dashboard home"
          className="flex h-10 w-10 items-center justify-center text-[32px] leading-none"
        >
          🌻
        </Link>

        <nav className="flex items-center justify-center gap-6 text-sm">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors",
                  active
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          <SearchCommand creators={creators} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
