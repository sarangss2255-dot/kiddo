"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyRound, Menu, Search, ShieldCheck } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useDocs } from "./docs-context";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { label: "Guides", href: "/guides" },
  { label: "API Reference", href: "/docs" },
  { label: "Changelog", href: "/changelog" },
];

export function DocsHeader({ onOpenNav }: { onOpenNav: () => void }) {
  const {
    catalog,
    baseUrl,
    setBaseUrl,
    token,
    openAuth,
    openSearch,
  } = useDocs();
  const pathname = usePathname();
  const [isLocalHost, setIsLocalHost] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    setIsLocalHost(host === "localhost" || host === "127.0.0.1");
  }, []);

  const environmentOptions = useMemo(() => {
    const options = catalog.servers.map((server) => ({
      value: server.url,
      label: server.description
        ? `${server.description} — ${server.url}`
        : server.url,
    }));
    if (isLocalHost && !options.some((option) => option.value === "/api/v1")) {
      options.push({ value: "/api/v1", label: "Local proxy — /api/v1" });
    }
    if (baseUrl && !options.some((option) => option.value === baseUrl)) {
      options.push({ value: baseUrl, label: baseUrl });
    }
    return options;
  }, [catalog.servers, isLocalHost, baseUrl]);

  return (
    <header className="sticky top-0 z-50 border-b border-docs-border bg-docs-bg-elevated/95 backdrop-blur">
      <div className="mx-auto flex min-h-[60px] max-w-[1600px] items-center gap-3 px-4 lg:px-6">
        <button
          type="button"
          onClick={onOpenNav}
          aria-label="Open navigation"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-docs-border text-docs-muted hover:text-docs-text lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link href="/docs" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-lg border border-docs-green/40 bg-docs-green/10">
            <img
              src="/kiddo-logo-64.png"
              alt="KidDo"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-[15px] font-bold text-docs-text">
              KidDo API
            </span>
            <span className="text-[11px] font-medium text-docs-muted">
              Developer Docs
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="ml-2 hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/docs"
                ? pathname === "/docs" || pathname.startsWith("/docs/")
                : pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-[13px] font-semibold transition-colors",
                  active
                    ? "bg-docs-card text-docs-text"
                    : "text-docs-muted hover:bg-docs-card hover:text-docs-text",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <label className="hidden xl:block">
            <span className="sr-only">API environment</span>
            <select
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
              className="h-9 max-w-[240px] cursor-pointer rounded-lg border border-docs-border bg-docs-card px-2.5 text-[12.5px] font-semibold text-docs-text focus:border-docs-green focus:outline-none"
            >
              {environmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="hidden lg:block">
            <span className="sr-only">API version</span>
            <select
              value={catalog.info.version}
              disabled
              aria-disabled="true"
              className="h-9 cursor-default rounded-lg border border-docs-border bg-docs-card px-2.5 text-[12.5px] font-semibold text-docs-muted focus:outline-none"
            >
              <option value={catalog.info.version}>
                v{catalog.info.version}
              </option>
            </select>
          </label>

          <button
            type="button"
            onClick={openSearch}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-docs-border bg-docs-card px-2.5 text-[12.5px] font-semibold text-docs-muted transition-colors hover:border-docs-border-strong hover:text-docs-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-docs-green"
            aria-label="Search documentation"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-docs-border px-1.5 py-0.5 font-mono text-[10px] text-docs-dim md:inline-block">
              Ctrl K
            </kbd>
          </button>

          <button
            type="button"
            onClick={openAuth}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-lg border px-2.5 text-[12.5px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-docs-green",
              token
                ? "border-docs-green bg-docs-green text-[#05210f]"
                : "border-docs-green/50 bg-docs-green/10 text-docs-green hover:bg-docs-green/20",
            )}
          >
            {token ? (
              <ShieldCheck className="h-3.5 w-3.5" />
            ) : (
              <KeyRound className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">
              {token ? "Authorized" : "Authorize"}
            </span>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
