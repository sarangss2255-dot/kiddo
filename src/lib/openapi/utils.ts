import type {
  HttpMethod,
  OpenAPISpec,
  OperationObject,
  SchemaObject,
} from "./types";

export const HTTP_METHODS: HttpMethod[] = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "head",
  "trace",
];

export const METHOD_LABELS: Record<HttpMethod, string> = {
  get: "GET",
  post: "POST",
  put: "PUT",
  patch: "PATCH",
  delete: "DELETE",
  options: "OPTIONS",
  head: "HEAD",
  trace: "TRACE",
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function operationSlug(method: HttpMethod, path: string): string {
  const pathPart = path
    .replace(/[{}]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `${method}-${pathPart}`;
}

export function tagHref(tagSlug: string): string {
  return `/docs/${tagSlug}`;
}

export function operationHref(tagSlug: string, opSlug: string): string {
  return `/docs/${tagSlug}/${opSlug}`;
}

export function getOperationTags(operation: OperationObject): string[] {
  const tags = operation.tags?.filter(Boolean) ?? [];
  return tags.length > 0 ? tags : ["Untagged"];
}

export function resolveRef<T = unknown>(
  spec: OpenAPISpec,
  ref: string | undefined,
): T | undefined {
  if (!ref || !ref.startsWith("#/")) return undefined;
  const segments = ref
    .slice(2)
    .split("/")
    .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"));
  let current: unknown = spec;
  for (const segment of segments) {
    if (current && typeof current === "object" && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }
  return current as T;
}

export function refName(ref: string | undefined): string | undefined {
  if (!ref) return undefined;
  const parts = ref.split("/");
  return parts[parts.length - 1];
}

export function dereferenceSchema(
  spec: OpenAPISpec,
  schema: SchemaObject | undefined,
  depth = 0,
): SchemaObject | undefined {
  if (!schema || depth > 12) return schema;
  if (schema.$ref) {
    const resolved = resolveRef<SchemaObject>(spec, schema.$ref);
    if (resolved) return dereferenceSchema(spec, resolved, depth + 1);
  }
  return schema;
}

export function schemaTypeLabel(schema: SchemaObject | undefined): string {
  if (!schema) return "any";
  if (schema.$ref) return refName(schema.$ref) ?? "object";
  const type = Array.isArray(schema.type) ? schema.type.join(" | ") : schema.type;
  if (type === "array" && schema.items) {
    return `${schemaTypeLabel(schema.items)}[]`;
  }
  return type ?? "any";
}

export function mergeAllOf(
  spec: OpenAPISpec,
  schema: SchemaObject,
): SchemaObject {
  if (!schema.allOf || schema.allOf.length === 0) return schema;
  const merged: SchemaObject = { ...schema, allOf: undefined };
  const properties: Record<string, SchemaObject> = { ...(schema.properties ?? {}) };
  const required = new Set(schema.required ?? []);

  for (const part of schema.allOf) {
    const resolved = dereferenceSchema(spec, part) ?? part;
    if (resolved.properties) {
      Object.assign(properties, resolved.properties);
    }
    (resolved.required ?? []).forEach((key) => required.add(key));
  }

  if (Object.keys(properties).length > 0) merged.properties = properties;
  if (required.size > 0) merged.required = Array.from(required);
  return merged;
}

export function generateExample(
  spec: OpenAPISpec,
  schema: SchemaObject | undefined,
  depth = 0,
): unknown {
  if (!schema || depth > 10) return null;
  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;

  const resolved = dereferenceSchema(spec, schema) ?? schema;

  if (resolved.example !== undefined) return resolved.example;
  if (resolved.enum && resolved.enum.length > 0) return resolved.enum[0];
  if (resolved.const !== undefined) return resolved.const;

  if (resolved.allOf && resolved.allOf.length > 0) {
    return generateExample(spec, mergeAllOf(spec, resolved), depth + 1);
  }
  if (resolved.oneOf && resolved.oneOf.length > 0) {
    return generateExample(spec, resolved.oneOf[0], depth + 1);
  }
  if (resolved.anyOf && resolved.anyOf.length > 0) {
    return generateExample(spec, resolved.anyOf[0], depth + 1);
  }

  const type = Array.isArray(resolved.type) ? resolved.type[0] : resolved.type;

  switch (type) {
    case "object": {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(resolved.properties ?? {})) {
        result[key] = generateExample(spec, value, depth + 1);
      }
      if (
        Object.keys(result).length === 0 &&
        resolved.additionalProperties &&
        typeof resolved.additionalProperties === "object"
      ) {
        return { key: generateExample(spec, resolved.additionalProperties, depth + 1) };
      }
      return result;
    }
    case "array":
      return [generateExample(spec, resolved.items, depth + 1)];
    case "integer":
    case "number":
      return typeof resolved.minimum === "number" ? resolved.minimum : 0;
    case "boolean":
      return true;
    case "string":
      if (resolved.format === "date-time") return new Date(0).toISOString();
      if (resolved.format === "date") return new Date(0).toISOString().split("T")[0];
      if (resolved.format === "email") return "user@example.com";
      if (resolved.format === "uri" || resolved.format === "url") {
        return "https://example.com";
      }
      if (resolved.format === "uuid") return "00000000-0000-0000-0000-000000000000";
      if (resolved.format === "password") return "password123";
      if (resolved.pattern) return "string";
      return "string";
    default:
      return null;
  }
}

export function getResponseExample(
  spec: OpenAPISpec,
  content: Record<string, { schema?: SchemaObject; example?: unknown }> | undefined,
): unknown {
  if (!content) return undefined;
  const media =
    content["application/json"] ??
    content[Object.keys(content).find((key) => key.includes("json")) ?? ""] ??
    content[Object.keys(content)[0]];
  if (!media) return undefined;
  if (media.example !== undefined) return media.example;
  return generateExample(spec, media.schema);
}

export function statusCategory(status: string): "2xx" | "3xx" | "4xx" | "5xx" | "default" {
  if (/^2\d\d$/.test(status)) return "2xx";
  if (/^3\d\d$/.test(status)) return "3xx";
  if (/^4\d\d$/.test(status)) return "4xx";
  if (/^5\d\d$/.test(status)) return "5xx";
  return "default";
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    "200": "OK",
    "201": "Created",
    "202": "Accepted",
    "204": "No Content",
    "301": "Moved Permanently",
    "302": "Found",
    "304": "Not Modified",
    "400": "Bad Request",
    "401": "Unauthorized",
    "403": "Forbidden",
    "404": "Not Found",
    "409": "Conflict",
    "422": "Unprocessable Entity",
    "429": "Too Many Requests",
    "500": "Internal Server Error",
    "502": "Bad Gateway",
    "503": "Service Unavailable",
  };
  return map[status] ?? (statusCategory(status) === "default" ? "Response" : "");
}

export function stringifyJson(value: unknown, space = 2): string {
  if (value === undefined) return "";
  try {
    return JSON.stringify(value, null, space);
  } catch {
    return String(value);
  }
}

export function joinUrl(base: string, path: string): string {
  if (!base) return path;
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
