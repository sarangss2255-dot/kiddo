import { cache } from "react";
import { loadOpenApiSpec, type SpecSource } from "./loader";
import { buildCatalog } from "./parser";
import type { ApiCatalog, OpenAPISpec } from "./types";

export interface DocsCatalog {
  catalog: ApiCatalog;
  spec: OpenAPISpec;
  source: SpecSource;
  specUrl: string;
  loadedAt: string;
}

/**
 * Request-scoped memoized catalog. Layout, pages and metadata all call this
 * and share a single spec load per request.
 */
export const getCatalog = cache(async (): Promise<DocsCatalog> => {
  const { spec, source, url, loadedAt } = await loadOpenApiSpec();
  return {
    catalog: buildCatalog(spec),
    spec,
    source,
    specUrl: url,
    loadedAt,
  };
});
