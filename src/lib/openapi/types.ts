export type HttpMethod =
  | "get"
  | "put"
  | "post"
  | "delete"
  | "options"
  | "head"
  | "patch"
  | "trace";

export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
    termsOfService?: string;
    contact?: { name?: string; url?: string; email?: string };
    license?: { name?: string; url?: string };
  };
  servers?: ServerObject[];
  tags?: TagObject[];
  paths: Record<string, PathItemObject>;
  components?: ComponentsObject;
  security?: SecurityRequirement[];
  externalDocs?: { url: string; description?: string };
}

export interface ServerObject {
  url: string;
  description?: string;
}

export interface TagObject {
  name: string;
  description?: string;
  externalDocs?: { url: string; description?: string };
}

export interface ComponentsObject {
  schemas?: Record<string, SchemaObject>;
  securitySchemes?: Record<string, SecuritySchemeObject>;
  responses?: Record<string, ResponseObject>;
  parameters?: Record<string, ParameterObject>;
  requestBodies?: Record<string, RequestBodyObject>;
}

export interface SecuritySchemeObject {
  type: "apiKey" | "http" | "oauth2" | "openIdConnect" | string;
  description?: string;
  name?: string;
  in?: "query" | "header" | "cookie";
  scheme?: string;
  bearerFormat?: string;
  flows?: Record<string, unknown>;
  openIdConnectUrl?: string;
}

export type SecurityRequirement = Record<string, string[]>;

export interface PathItemObject {
  summary?: string;
  description?: string;
  parameters?: ParameterObject[];
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  patch?: OperationObject;
  trace?: OperationObject;
}

export interface OperationObject {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: ParameterObject[];
  requestBody?: RequestBodyObject;
  responses?: Record<string, ResponseObject>;
  security?: SecurityRequirement[];
  deprecated?: boolean;
  externalDocs?: { url: string; description?: string };
}

export interface ParameterObject {
  name: string;
  in: "query" | "header" | "path" | "cookie" | string;
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  schema?: SchemaObject;
  example?: unknown;
  examples?: Record<string, { value?: unknown; summary?: string }>;
  content?: Record<string, MediaTypeObject>;
}

export interface RequestBodyObject {
  description?: string;
  required?: boolean;
  content?: Record<string, MediaTypeObject>;
}

export interface MediaTypeObject {
  schema?: SchemaObject;
  example?: unknown;
  examples?: Record<string, { value?: unknown; summary?: string }>;
  encoding?: Record<string, unknown>;
}

export interface HeaderObject {
  description?: string;
  required?: boolean;
  schema?: SchemaObject;
}

export interface ResponseObject {
  description?: string;
  headers?: Record<string, HeaderObject>;
  content?: Record<string, MediaTypeObject>;
  links?: Record<string, unknown>;
}

export interface SchemaObject {
  $ref?: string;
  title?: string;
  type?: string | string[];
  format?: string;
  description?: string;
  nullable?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  deprecated?: boolean;
  required?: string[];
  properties?: Record<string, SchemaObject>;
  items?: SchemaObject;
  additionalProperties?: boolean | SchemaObject;
  enum?: unknown[];
  const?: unknown;
  default?: unknown;
  example?: unknown;
  allOf?: SchemaObject[];
  oneOf?: SchemaObject[];
  anyOf?: SchemaObject[];
  not?: SchemaObject;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  pattern?: string;
  uniqueItems?: boolean;
  multipleOf?: number;
  discriminator?: { propertyName: string; mapping?: Record<string, string> };
  externalDocs?: { url: string; description?: string };
}

export interface ParsedOperation {
  id: string;
  method: HttpMethod;
  path: string;
  operation: OperationObject;
  tag: string;
  tagSlug: string;
  slug: string;
  href: string;
  summary: string;
  description?: string;
  deprecated: boolean;
  security: SecurityRequirement[] | null;
  parameters: ParameterObject[];
  requestBody?: RequestBodyObject;
  responses: Array<{
    status: string;
    response: ResponseObject;
    category: "2xx" | "3xx" | "4xx" | "5xx" | "default";
  }>;
}

export interface ApiTag {
  name: string;
  slug: string;
  description?: string;
  href: string;
  operations: ParsedOperation[];
}

export interface SearchEntry {
  id: string;
  category: "Endpoints" | "Sections" | "Schemas" | "Guides";
  title: string;
  subtitle?: string;
  keywords: string;
  href: string;
  method?: HttpMethod;
}

export interface ApiCatalog {
  info: OpenAPISpec["info"];
  openapi: string;
  servers: ServerObject[];
  securitySchemes: Record<string, SecuritySchemeObject>;
  security: SecurityRequirement[];
  tags: ApiTag[];
  operations: ParsedOperation[];
  schemas: Record<string, SchemaObject>;
  searchIndex: SearchEntry[];
  operationCount: number;
}
