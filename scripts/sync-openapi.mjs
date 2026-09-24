import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

function resolveOpenApiUrl() {
  const explicit = process.env.NEXT_PUBLIC_OPENAPI_URL;
  if (explicit) return explicit;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl && /^https?:\/\//i.test(apiUrl)) {
    try {
      return `${new URL(apiUrl).origin}/api-docs.json`;
    } catch {
      return undefined;
    }
  }

  return undefined;
}

const openApiUrl = resolveOpenApiUrl();

if (!openApiUrl) {
  console.error(
    "Set NEXT_PUBLIC_OPENAPI_URL (or an absolute NEXT_PUBLIC_API_URL) before syncing.",
  );
  process.exit(1);
}

const target = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/lib/openapi/kiddo-openapi.json",
);

function countOperations(spec) {
  let count = 0;
  for (const pathItem of Object.values(spec.paths ?? {})) {
    for (const value of Object.values(pathItem ?? {})) {
      if (value && typeof value === "object" && "responses" in value) count += 1;
    }
  }
  return count;
}

const response = await fetch(openApiUrl, {
  headers: { accept: "application/json" },
});

if (!response.ok) {
  console.error(`Failed to fetch ${openApiUrl}: ${response.status}`);
  process.exit(1);
}

const spec = await response.json();
if (!spec?.paths) {
  console.error("The remote document is not a valid OpenAPI spec.");
  process.exit(1);
}

writeFileSync(target, `${JSON.stringify(spec, null, 2)}\n`, "utf8");
console.log(
  `Wrote ${Object.keys(spec.paths).length} paths / ${countOperations(spec)} operations to ${target}`,
);
