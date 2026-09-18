"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CATEGORY_LABEL } from "@/lib/category";
import type { Category } from "@/lib/types";

const ALL_CATEGORIES: Category[] = ["sarkari", "travel", "books", "fitness"];

function parseSelected(searchParams: URLSearchParams): Category[] {
  const raw = searchParams.get("niche");
  if (!raw) return [];
  return raw
    .split(",")
    .filter((v): v is Category => ALL_CATEGORIES.includes(v as Category));
}

export function NicheFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = parseSelected(searchParams);

  function toggle(category: Category, checked: boolean) {
    const next = checked
      ? [...selected, category]
      : selected.filter((c) => c !== category);

    const params = new URLSearchParams(searchParams.toString());
    if (next.length === 0) {
      params.delete("niche");
    } else {
      params.set("niche", next.join(","));
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "-ml-1 h-auto gap-1 px-3 py-1 text-xs font-medium text-foreground hover:bg-muted",
        )}
      >
        Niche
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        {selected.length > 0 && (
          <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
            {selected.length}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" style={{ minWidth: 200 }}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Filter by niche</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ALL_CATEGORIES.map((category) => (
            <DropdownMenuCheckboxItem
              key={category}
              checked={selected.includes(category)}
              onCheckedChange={(checked) => toggle(category, checked === true)}
              onSelect={(e) => e.preventDefault()}
            >
              {CATEGORY_LABEL[category]}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
