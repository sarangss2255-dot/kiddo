"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { SpecSource } from "@/src/lib/openapi/loader";
import type { ApiCatalog } from "@/src/lib/openapi/types";
import {
  DOCS_BASE_URL_KEY,
  DOCS_TOKEN_KEY,
  DocsContext,
  type DocsContextValue,
} from "./docs-context";
import { AuthModal } from "./auth-modal";
import { DocsHeader } from "./docs-header";
import { DocsSearch } from "./docs-search";
import { DocsSidebar } from "./docs-sidebar";

function resolveDefaultBaseUrl(catalog: ApiCatalog): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (configured) return configured;
  return catalog.servers[0]?.url ?? "";
}

export function DocsLayout({
  catalog,
  source,
  children,
}: {
  catalog: ApiCatalog;
  source: SpecSource;
  children: React.ReactNode;
}) {
  const [baseUrl, setBaseUrlState] = useState(() =>
    resolveDefaultBaseUrl(catalog),
  );
  const [token, setTokenState] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    const isLocalHost = host === "localhost" || host === "127.0.0.1";
    const storedBaseUrl = window.localStorage.getItem(DOCS_BASE_URL_KEY);
    const storedToken = window.localStorage.getItem(DOCS_TOKEN_KEY);

    if (storedBaseUrl) {
      setBaseUrlState(storedBaseUrl);
    } else if (isLocalHost && catalog.servers.length > 0) {
      setBaseUrlState("/api/v1");
    }

    if (storedToken) setTokenState(storedToken);
  }, [catalog.servers.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const setBaseUrl = useCallback((next: string) => {
    setBaseUrlState(next);
    try {
      window.localStorage.setItem(DOCS_BASE_URL_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const setToken = useCallback((next: string | null) => {
    setTokenState(next);
    try {
      if (next) window.localStorage.setItem(DOCS_TOKEN_KEY, next);
      else window.localStorage.removeItem(DOCS_TOKEN_KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const clearToken = useCallback(() => setToken(null), [setToken]);

  const value = useMemo<DocsContextValue>(
    () => ({
      catalog,
      source,
      servers: catalog.servers,
      baseUrl,
      setBaseUrl,
      token,
      setToken,
      clearToken,
      openAuth: () => setAuthOpen(true),
      openSearch: () => setSearchOpen(true),
    }),
    [catalog, source, baseUrl, setBaseUrl, token, setToken, clearToken],
  );

  return (
    <DocsContext.Provider value={value}>
      <div className="docs-root min-h-screen bg-docs-bg font-sans text-docs-text">
        <a
          href="#docs-content"
          className="sr-only z-[100] rounded-lg bg-docs-green px-4 py-2 font-bold text-[#04160a] focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          Skip to content
        </a>

        <DocsHeader onOpenNav={() => setMobileNavOpen(true)} />

        <div className="mx-auto flex max-w-[1600px] items-start gap-6 px-4 lg:px-6">
          <DocsSidebar
            mobileOpen={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
          />
          <main id="docs-content" className="min-w-0 flex-1 py-6 pb-24">
            {children}
          </main>
        </div>

        <footer className="border-t border-docs-border px-4 py-8 lg:px-6">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-2 text-xs text-docs-dim">
            <span className="font-semibold text-docs-muted">
              {catalog.info.title}
            </span>
            <span>OpenAPI {catalog.openapi}</span>
            <span>v{catalog.info.version}</span>
            <span>{catalog.operationCount} operations</span>
            <Link
              href="/changelog"
              className="ml-auto font-semibold text-docs-muted transition-colors hover:text-docs-text"
            >
              Changelog
            </Link>
          </div>
        </footer>

        <DocsSearch open={searchOpen} onOpenChange={setSearchOpen} />
        <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      </div>
    </DocsContext.Provider>
  );
}
