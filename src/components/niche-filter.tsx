"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CATEGORY_LABEL } from "@/lib/creators";
import type { Category } from "@/lib/types";

const OPTIONS: Array<{ value: Category | "all"; label: string }> = [
  { value: "all", label: "All niches" },
  { value: "sarkari", label: CATEGORY_LABEL.sarkari },
  { value: "travel", label: CATEGORY_LABEL.travel },
  { value: "books", label: CATEGORY_LABEL.books },
  { value: "fitness", label: CATEGORY_LABEL.fitness },
  { value: "other", label: CATEGORY_LABEL.other },
];

export function NicheFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("niche") ?? "all";

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("niche");
    } else {
      params.set("niche", value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const activeLabel = OPTIONS.find((o) => o.value === current)?.label ?? "Niche";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-auto gap-1 px-3 py-1 text-xs font-medium text-foreground hover:bg-muted"
          />
        }
      >
        {current === "all" ? "Niche" : activeLabel}
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup value={current} onValueChange={onChange}>
          <DropdownMenuLabel>Filter by niche</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {OPTIONS.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value}>
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
