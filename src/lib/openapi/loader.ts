import type { OpenAPISpec } from "./types";
import bundledSpec from "./kiddo-openapi.json";

/**
 * Resolve the OpenAPI document URL from configuration only.
 * Priority: NEXT_PUBLIC_OPENAPI_URL → <origin of NEXT_PUBLIC_API_URL>/api-docs.json
 * → same-origin /api-docs.json.
 */
function resolveOpenApiUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_OPENAPI_URL;
  if (explicit) return explicit;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    if (/^https?:\/\//i.test(apiUrl)) {
      try {
        return `${new URL(apiUrl).origin}/api-docs.json`;
      } catch {
        return "/api-docs.json";
      }
    }
    return "/api-docs.json";
  }

  return "/api-docs.json";
}

const OPENAPI_URL = resolveOpenApiUrl();

const REVALIDATE_SECONDS = Number(
  process.env.OPENAPI_REVALIDATE_SECONDS ?? "300",
);

export type SpecSource = "live" | "bundled";

export interface LoadedSpec {
  spec: OpenAPISpec;
  source: SpecSource;
  url: string;
  loadedAt: string;
}

function countOperations(spec: OpenAPISpec): number {
  let count = 0;
  for (const pathItem of Object.values(spec.paths ?? {})) {
    for (const value of Object.values(pathItem ?? {})) {
      if (value && typeof value === "object" && "responses" in value) {
        count += 1;
      }
    }
  }
  return count;
}

/**
 * Load the OpenAPI document. The live document is preferred, but only when it
 * is at least as complete as the bundled canonical snapshot (a deployment can
 * lag behind the source spec). Falls back to the bundled snapshot when the
 * document cannot be fetched or is invalid.
 */
export async function loadOpenApiSpec(): Promise<LoadedSpec> {
  const fallback = bundledSpec as unknown as OpenAPISpec;
  const bundledOperations = countOperations(fallback);
  const loadedAt = new Date().toISOString();

  try {
    const response = await fetch(OPENAPI_URL, {
      headers: { accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      throw new Error(`OpenAPI request failed with status ${response.status}`);
    }

    const live = (await response.json()) as OpenAPISpec;
    if (!live || typeof live !== "object" || !live.paths) {
      throw new Error("Invalid OpenAPI document received");
    }

    if (countOperations(live) < bundledOperations) {
      return {
        spec: fallback,
        source: "bundled",
        url: OPENAPI_URL,
        loadedAt,
      };
    }

    return { spec: live, source: "live", url: OPENAPI_URL, loadedAt };
  } catch {
    return {
      spec: fallback,
      source: "bundled",
      url: OPENAPI_URL,
      loadedAt,
    };
  }
}
