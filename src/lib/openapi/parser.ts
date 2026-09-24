import type {
  ApiCatalog,
  ApiTag,
  HttpMethod,
  OpenAPISpec,
  OperationObject,
  ParsedOperation,
  SearchEntry,
} from "./types";
import {
  HTTP_METHODS,
  getOperationTags,
  operationHref,
  operationSlug,
  slugify,
  statusCategory,
  tagHref,
} from "./utils";

function buildOperation(
  method: HttpMethod,
  path: string,
  operation: OperationObject,
): ParsedOperation {
  const tag = getOperationTags(operation)[0];
  const tagSlug = slugify(tag);
  const slug = operationSlug(method, path);
  const responses = Object.entries(operation.responses ?? {}).map(
    ([status, response]) => ({
      status,
      response,
      category: statusCategory(status),
    }),
  );

  return {
    id: `${method.toUpperCase()} ${path}`,
    method,
    path,
    operation,
    tag,
    tagSlug,
    slug,
    href: operationHref(tagSlug, slug),
    summary: operation.summary ?? operation.operationId ?? path,
    description: operation.description,
    deprecated: Boolean(operation.deprecated),
    security: operation.security ?? null,
    parameters: operation.parameters ?? [],
    requestBody: operation.requestBody,
    responses,
  };
}

export function buildCatalog(spec: OpenAPISpec): ApiCatalog {
  const operations: ParsedOperation[] = [];

  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (operation) {
        operations.push(buildOperation(method, path, operation));
      }
    }
  }

  const tagMap = new Map<string, ApiTag>();
  const declaredTags = spec.tags ?? [];

  for (const declared of declaredTags) {
    tagMap.set(declared.name, {
      name: declared.name,
      slug: slugify(declared.name),
      description: declared.description,
      href: tagHref(slugify(declared.name)),
      operations: [],
    });
  }

  for (const operation of operations) {
    if (!tagMap.has(operation.tag)) {
      tagMap.set(operation.tag, {
        name: operation.tag,
        slug: operation.tagSlug,
        description: undefined,
        href: tagHref(operation.tagSlug),
        operations: [],
      });
    }
    tagMap.get(operation.tag)!.operations.push(operation);
  }

  const tags = Array.from(tagMap.values()).filter(
    (tag) => tag.operations.length > 0 || declaredTags.some((t) => t.name === tag.name),
  );

  const schemas = spec.components?.schemas ?? {};
  const securitySchemes = spec.components?.securitySchemes ?? {};

  const searchIndex: SearchEntry[] = [
    {
      id: "guide-overview",
      category: "Guides",
      title: "API Overview",
      subtitle: "Introduction, base URL and quick start",
      keywords: "overview introduction getting started base url servers",
      href: "/docs",
    },
    {
      id: "guide-quick-start",
      category: "Guides",
      title: "Quick Start",
      subtitle: "Authenticate, obtain a token and call endpoints",
      keywords: "quick start guide authenticate jwt token curl example",
      href: "/docs/quick-start",
    },
    {
      id: "guide-authentication",
      category: "Guides",
      title: "Authentication",
      subtitle: "JWT bearer tokens and authorization header",
      keywords: "authentication auth jwt bearer token security authorize login",
      href: "/docs/authentication",
    },
    {
      id: "guide-schemas",
      category: "Schemas",
      title: "Data Models",
      subtitle: "All schemas defined by the API",
      keywords: "schemas models components data types",
      href: "/docs/schemas",
    },
    {
      id: "guide-changelog",
      category: "Guides",
      title: "Changelog",
      subtitle: "API version history",
      keywords: "changelog releases version history",
      href: "/changelog",
    },
  ];

  for (const tag of tags) {
    searchIndex.push({
      id: `section-${tag.slug}`,
      category: "Sections",
      title: tag.name,
      subtitle: tag.description ?? `${tag.operations.length} endpoints`,
      keywords: `${tag.name} ${tag.description ?? ""} section tag`,
      href: tag.href,
    });
  }

  for (const operation of operations) {
    searchIndex.push({
      id: `operation-${operation.slug}`,
      category: "Endpoints",
      title: operation.path,
      subtitle: operation.summary,
      keywords: `${operation.method} ${operation.id} ${operation.tag} ${
        operation.description ?? ""
      } ${operation.summary}`,
      href: operation.href,
      method: operation.method,
    });
  }

  for (const name of Object.keys(schemas)) {
    searchIndex.push({
      id: `schema-${name}`,
      category: "Schemas",
      title: name,
      subtitle: schemas[name].description ?? "Schema",
      keywords: `${name} schema model ${schemas[name].description ?? ""}`,
      href: `/docs/schemas#schema-${slugify(name)}`,
    });
  }

  return {
    info: spec.info,
    openapi: spec.openapi,
    servers: spec.servers ?? [],
    securitySchemes,
    security: spec.security ?? [],
    tags,
    operations,
    schemas,
    searchIndex,
    operationCount: operations.length,
  };
}

export function findTag(catalog: ApiCatalog, slug: string): ApiTag | undefined {
  return catalog.tags.find((tag) => tag.slug === slug);
}

export function findOperation(
  catalog: ApiCatalog,
  tagSlug: string,
  opSlug: string,
): ParsedOperation | undefined {
  return catalog.operations.find(
    (operation) => operation.tagSlug === tagSlug && operation.slug === opSlug,
  );
}
