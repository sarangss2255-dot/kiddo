"use client";

import { createContext, useContext } from "react";
import type { SpecSource } from "@/src/lib/openapi/loader";
import type { ApiCatalog, ServerObject } from "@/src/lib/openapi/types";

export const DOCS_TOKEN_KEY = "kiddo_docs_token";
export const DOCS_BASE_URL_KEY = "kiddo_docs_base_url";

export interface DocsContextValue {
  catalog: ApiCatalog;
  source: SpecSource;
  servers: ServerObject[];
  baseUrl: string;
  setBaseUrl: (url: string) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
  openAuth: () => void;
  openSearch: () => void;
}

export const DocsContext = createContext<DocsContextValue | null>(null);

export function useDocs(): DocsContextValue {
  const context = useContext(DocsContext);
  if (!context) {
    throw new Error("useDocs must be used within DocsLayout");
  }
  return context;
}
