import type {
  ApiCatalog,
  MediaTypeObject,
  OpenAPISpec,
  ParsedOperation,
} from "./types";
import {
  generateExample,
  getResponseExample,
  joinUrl,
  stringifyJson,
} from "./utils";

function getJsonMedia(
  content: Record<string, MediaTypeObject> | undefined,
): MediaTypeObject | undefined {
  if (!content) return undefined;
  const jsonKey = Object.keys(content).find((key) =>
    key.toLowerCase().includes("json"),
  );
  const key = jsonKey ?? Object.keys(content)[0];
  return key ? content[key] : undefined;
}

/** Find the operation that bootstraps authentication, from the spec only. */
export function findAuthenticationOperation(
  catalog: ApiCatalog,
): ParsedOperation | undefined {
  const authTag = catalog.tags.find((tag) =>
    /auth|login|token|session/i.test(`${tag.name} ${tag.description ?? ""}`),
  );
  const candidates = authTag?.operations ?? catalog.operations;
  return (
    candidates.find(
      (operation) => operation.method === "post" && operation.requestBody,
    ) ??
    candidates.find((operation) => operation.method === "post") ??
    candidates[0]
  );
}

/** Find a protected GET operation to demonstrate authenticated calls. */
export function findProtectedOperation(
  catalog: ApiCatalog,
): ParsedOperation | undefined {
  return (
    catalog.operations.find(
      (operation) =>
        operation.method === "get" &&
        (operation.security ?? catalog.security).length > 0,
    ) ??
    catalog.operations.find((operation) => operation.method === "get") ??
    catalog.operations[0]
  );
}

export interface QuickStartSnippets {
  baseUrl: string;
  authenticateUrl: string;
  authenticateCurl: string;
  tokenResponse: string;
  authorizeHeader: string;
  callUrl: string;
  callCurl: string;
  authOperation?: ParsedOperation;
  protectedOperation?: ParsedOperation;
}

export function buildQuickStartSnippets(
  catalog: ApiCatalog,
  spec: OpenAPISpec,
): QuickStartSnippets {
  const baseUrl = catalog.servers[0]?.url ?? "";
  const authOperation = findAuthenticationOperation(catalog);
  const protectedOperation = findProtectedOperation(catalog);

  const authBody = authOperation
    ? stringifyJson(
        generateExample(
          spec,
          getJsonMedia(authOperation.requestBody?.content)?.schema,
        ),
      )
    : "";

  const authenticateUrl = authOperation
    ? joinUrl(baseUrl, authOperation.path)
    : "";
  const callUrl = protectedOperation
    ? joinUrl(baseUrl, protectedOperation.path)
    : "";

  const tokenResponse =
    authOperation &&
    getResponseExample(spec, authOperation.responses[0]?.response.content);
  const tokenResponseJson = tokenResponse ? stringifyJson(tokenResponse) : "";

  return {
    baseUrl,
    authenticateUrl,
    authenticateCurl:
      authOperation && authBody
        ? `curl -X POST "${authenticateUrl}" \\\n  -H "Content-Type: application/json" \\\n  -d '${authBody.replace(/\s*\n\s*/g, "")}'`
        : "",
    tokenResponse: tokenResponseJson,
    authorizeHeader: "Authorization: Bearer <token>",
    callUrl,
    callCurl: protectedOperation
      ? `curl "${callUrl}" \\\n  -H "Authorization: Bearer <token>"`
      : "",
    authOperation,
    protectedOperation,
  };
}
