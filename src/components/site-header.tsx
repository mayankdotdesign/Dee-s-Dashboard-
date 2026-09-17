import Link from "next/link";
import { SearchCommand } from "@/components/search-command";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCreators } from "@/lib/creators";

export function SiteHeader() {
  const creators = getCreators();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-heading text-lg font-semibold tracking-tight">
              Dee&apos;s Dashboard
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              growth reference
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm sm:hidden">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Leaderboard
            </Link>
            <Link href="/trending" className="text-muted-foreground hover:text-foreground transition-colors">
              Trending
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-4 text-sm sm:flex">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Leaderboard
            </Link>
            <Link href="/trending" className="text-muted-foreground hover:text-foreground transition-colors">
              Trending
            </Link>
          </nav>
          <SearchCommand creators={creators} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
