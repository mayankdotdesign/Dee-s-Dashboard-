import { cn } from "@/lib/utils";
import { CATEGORY_LABEL } from "@/lib/creators";
import type { Category } from "@/lib/types";

const CATEGORY_CLASSES: Record<Category, string> = {
  sarkari: "bg-tag-sarkari text-tag-sarkari-foreground",
  travel: "bg-tag-travel text-tag-travel-foreground",
  books: "bg-tag-books text-tag-books-foreground",
  fitness: "bg-tag-fitness text-tag-fitness-foreground",
};

export function CategoryBadge({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium leading-none",
        CATEGORY_CLASSES[category],
        className,
      )}
    >
      {CATEGORY_LABEL[category]}
    </span>
  );
}
