"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/src/components/ui/Dialog";
import { cn } from "@/src/lib/utils";
import type { SearchEntry } from "@/src/lib/openapi/types";
import { useDocs } from "./docs-context";
import { MethodBadge } from "./method-badge";

const CATEGORY_ORDER: SearchEntry["category"][] = [
  "Endpoints",
  "Sections",
  "Schemas",
  "Guides",
];

interface GroupedResults {
  category: SearchEntry["category"];
  entries: SearchEntry[];
}

export function DocsSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { catalog } = useDocs();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return catalog.searchIndex
        .filter((entry) => entry.category === "Endpoints")
        .slice(0, 12)
        .concat(
          catalog.searchIndex.filter((entry) => entry.category === "Guides"),
        );
    }

    const terms = normalized.split(/\s+/);
    return catalog.searchIndex
      .map((entry) => {
        const title = entry.title.toLowerCase();
        const haystack =
          `${entry.title} ${entry.subtitle ?? ""} ${entry.keywords}`.toLowerCase();
        let score = 0;
        for (const term of terms) {
          if (!haystack.includes(term)) return null;
          if (title.includes(term)) score += 5;
          if (title.startsWith(term)) score += 3;
          if (entry.category === "Endpoints") score += 1;
        }
        return { entry, score };
      })
      .filter((item): item is { entry: SearchEntry; score: number } => Boolean(item))
      .sort((a, b) => b.score - a.score)
      .map((item) => item.entry)
      .slice(0, 40);
  }, [catalog, query]);

  const grouped = useMemo<GroupedResults[]>(() => {
    const map = new Map<SearchEntry["category"], SearchEntry[]>();
    for (const entry of results) {
      const list = map.get(entry.category) ?? [];
      list.push(entry);
      map.set(entry.category, list);
    }
    return CATEGORY_ORDER.filter((category) => map.has(category)).map(
      (category) => ({ category, entries: map.get(category)! }),
    );
  }, [results]);

  const flat = useMemo(
    () => grouped.flatMap((group) => group.entries),
    [grouped],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const active = container.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const go = (entry: SearchEntry | undefined) => {
    if (!entry) return;
    onOpenChange(false);
    setQuery("");
    router.push(entry.href);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, flat.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(flat[activeIndex]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl! gap-0! overflow-hidden border-docs-border-strong! bg-docs-bg-elevated! p-0! text-docs-text">
        <DialogTitle className="sr-only">Search documentation</DialogTitle>
        <DialogDescription className="sr-only">
          Search endpoints, sections, schemas and guides.
        </DialogDescription>

        <div className="flex items-center gap-3 border-b border-docs-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-docs-dim" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search endpoints, schemas, guides..."
            aria-label="Search documentation"
            className="h-8 w-full bg-transparent text-sm text-docs-text placeholder:text-docs-dim focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-docs-border bg-docs-card px-1.5 py-0.5 font-mono text-[10px] text-docs-dim sm:inline-block">
            ESC
          </kbd>
        </div>

        <div
          ref={listRef}
          className="max-h-[min(60vh,480px)] overflow-y-auto p-2"
          role="listbox"
          aria-label="Search results"
        >
          {flat.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-docs-muted">
              No results for <span className="text-docs-text">“{query}”</span>.
            </p>
          ) : (
            grouped.map((group) => (
              <div key={group.category} className="mb-1.5">
                <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-docs-dim">
                  {group.category}
                </p>
                {group.entries.map((entry) => {
                  const index = flat.indexOf(entry);
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      data-index={index}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => go(entry)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-left transition-colors",
                        isActive
                          ? "border-docs-border-strong bg-docs-card-nested"
                          : "hover:bg-docs-card",
                      )}
                    >
                      {entry.method ? (
                        <MethodBadge method={entry.method} size="sm" />
                      ) : null}
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-sm font-semibold",
                            entry.method ? "font-mono text-[12.5px]" : "",
                          )}
                        >
                          {entry.title}
                        </span>
                        {entry.subtitle ? (
                          <span className="block truncate text-xs text-docs-muted">
                            {entry.subtitle}
                          </span>
                        ) : null}
                      </span>
                      {isActive ? (
                        <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-docs-dim" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
