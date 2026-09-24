"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  Compass,
  Database,
  KeyRound,
  Layers,
  Rocket,
  ScrollText,
  X,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useDocs } from "./docs-context";
import { MethodBadge } from "./method-badge";

interface NavItem {
  label: string;
  href: string;
  icon: typeof BookOpen;
}

const GETTING_STARTED: NavItem[] = [
  { label: "Overview", href: "/docs", icon: Compass },
  { label: "Quick Start", href: "/docs/quick-start", icon: Rocket },
  { label: "Authentication", href: "/docs/authentication", icon: KeyRound },
];

const RESOURCES: NavItem[] = [
  { label: "Data Models", href: "/docs/schemas", icon: Database },
  { label: "Guides", href: "/guides", icon: BookOpen },
  { label: "Changelog", href: "/changelog", icon: ScrollText },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/docs") return pathname === "/docs";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { catalog } = useDocs();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const normalized = query.trim().toLowerCase();

  const filteredTags = useMemo(() => {
    if (!normalized) return catalog.tags;
    return catalog.tags
      .map((tag) => {
        const tagMatches =
          tag.name.toLowerCase().includes(normalized) ||
          (tag.description ?? "").toLowerCase().includes(normalized);
        const operations = tag.operations.filter((operation) =>
          `${operation.method} ${operation.path} ${operation.summary}`
            .toLowerCase()
            .includes(normalized),
        );
        if (tagMatches) return tag;
        if (operations.length > 0) return { ...tag, operations };
        return null;
      })
      .filter((tag): tag is NonNullable<typeof tag> => Boolean(tag));
  }, [catalog.tags, normalized]);

  useEffect(() => {
    if (!normalized) return;
    setCollapsed((current) => {
      const next = { ...current };
      for (const tag of filteredTags) next[tag.slug] = false;
      return next;
    });
  }, [normalized, filteredTags]);

  const toggleTag = (slug: string) =>
    setCollapsed((current) => ({ ...current, [slug]: !current[slug] }));

  return (
    <nav aria-label="Documentation" className="flex flex-col gap-5 pb-8">
      <div className="px-1">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter endpoints..."
          aria-label="Filter endpoints in sidebar"
          className="h-9 w-full rounded-lg border border-docs-border bg-docs-card px-3 text-[12.5px] text-docs-text placeholder:text-docs-dim focus:border-docs-green focus:outline-none"
        />
      </div>
      <div>
        <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-docs-dim">
          Getting Started
        </p>
        <ul className="space-y-0.5">
          {GETTING_STARTED.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition-colors",
                    active
                      ? "bg-docs-green/10 text-docs-green"
                      : "text-docs-muted hover:bg-docs-card hover:text-docs-text",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <div className="flex items-center justify-between px-2 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-docs-dim">
            API Reference
          </p>
          <span className="rounded-full bg-docs-card-nested px-1.5 py-0.5 text-[10px] font-bold text-docs-dim">
            {catalog.operationCount}
          </span>
        </div>

        {filteredTags.length === 0 ? (
          <p className="px-2.5 py-2 text-xs text-docs-dim">No matches.</p>
        ) : (
          <ul className="space-y-0.5">
            {filteredTags.map((tag) => {
              const tagActive =
                pathname === tag.href || pathname.startsWith(`${tag.href}/`);
              const isCollapsed =
                collapsed[tag.slug] ?? (!normalized && !tagActive);
              return (
                <li key={tag.slug}>
                  <button
                    type="button"
                    onClick={() => toggleTag(tag.slug)}
                    aria-expanded={!isCollapsed}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] font-bold transition-colors",
                      tagActive
                        ? "text-docs-green"
                        : "text-docs-text hover:bg-docs-card",
                    )}
                  >
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 text-docs-dim transition-transform",
                        !isCollapsed && "rotate-90",
                      )}
                    />
                    <span className="min-w-0 flex-1 truncate">{tag.name}</span>
                    <span className="rounded-full bg-docs-card-nested px-1.5 py-0.5 text-[10px] font-bold text-docs-dim">
                      {tag.operations.length}
                    </span>
                  </button>
                  {!isCollapsed ? (
                    <ul className="mb-1 ml-3 space-y-0.5 border-l border-docs-border pl-2">
                      {tag.operations.map((operation) => {
                        const active = pathname === operation.href;
                        return (
                          <li key={operation.id}>
                            <Link
                              href={operation.href}
                              onClick={onNavigate}
                              title={operation.summary}
                              className={cn(
                                "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
                                active
                                  ? "bg-docs-card-nested text-docs-text"
                                  : "text-docs-muted hover:bg-docs-card hover:text-docs-text",
                              )}
                            >
                              <MethodBadge method={operation.method} size="sm" />
                              <span className="min-w-0 truncate font-mono text-[11.5px]">
                                {operation.path}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-docs-dim">
          Resources
        </p>
        <ul className="space-y-0.5">
          {RESOURCES.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition-colors",
                    active
                      ? "bg-docs-green/10 text-docs-green"
                      : "text-docs-muted hover:bg-docs-card hover:text-docs-text",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export function DocsSidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const { catalog } = useDocs();

  return (
    <>
      <aside className="sticky top-[76px] hidden max-h-[calc(100vh-96px)] w-[288px] shrink-0 overflow-y-auto rounded-xl border border-docs-border bg-docs-bg-elevated p-3 lg:block">
        <div className="mb-2 flex items-center gap-2 border-b border-docs-border px-1 pb-3">
          <Layers className="h-4 w-4 text-docs-green" />
          <span className="text-xs font-bold text-docs-text">API Reference</span>
          <span className="ml-auto text-[10px] font-semibold text-docs-dim">
            v{catalog.info.version}
          </span>
        </div>
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />
          <div className="absolute inset-y-0 left-0 flex w-[320px] max-w-[85vw] flex-col border-r border-docs-border bg-docs-bg-elevated">
            <div className="flex items-center justify-between border-b border-docs-border px-4 py-3">
              <span className="text-sm font-bold text-docs-text">
                Documentation
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-docs-muted hover:bg-docs-card hover:text-docs-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <SidebarContent onNavigate={onClose} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
