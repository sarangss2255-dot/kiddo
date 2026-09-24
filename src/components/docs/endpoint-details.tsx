"use client";

import Link from "next/link";
import { ChevronRight, Lock, Unlock } from "lucide-react";
import type {
  MediaTypeObject,
  OpenAPISpec,
  ParameterObject,
  ParsedOperation,
  ResponseObject,
} from "@/src/lib/openapi/types";
import {
  generateExample,
  schemaTypeLabel,
  stringifyJson,
} from "@/src/lib/openapi/utils";
import { cn } from "@/src/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./docs-tabs";
import { useDocs } from "./docs-context";
import { CopyButton } from "./copy-button";
import { JsonEditor } from "./json-editor";
import { MethodBadge } from "./method-badge";
import { RequestBuilder } from "./request-builder";
import { SchemaViewer } from "./schema-viewer";
import { StatusBadge } from "./status-badge";

function getJsonMedia(
  content: Record<string, MediaTypeObject> | undefined,
): { contentType: string; media: MediaTypeObject } | undefined {
  if (!content) return undefined;
  const jsonKey = Object.keys(content).find((key) =>
    key.toLowerCase().includes("json"),
  );
  const key = jsonKey ?? Object.keys(content)[0];
  if (!key) return undefined;
  return { contentType: key, media: content[key] };
}

function ParametersTable({ parameters }: { parameters: ParameterObject[] }) {
  if (parameters.length === 0) {
    return (
      <p className="text-[13px] text-docs-dim">
        This operation has no parameters.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-docs-border bg-docs-bg-elevated">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-docs-border">
            {["Name", "In", "Type", "Required", "Description"].map((header) => (
              <th
                key={header}
                className="px-3 py-2.5 text-[10.5px] font-bold uppercase tracking-wider text-docs-dim"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {parameters.map((parameter) => (
            <tr
              key={`${parameter.in}-${parameter.name}`}
              className="border-b border-docs-border align-top last:border-b-0"
            >
              <td className="px-3 py-2.5 font-mono text-[12px] font-semibold text-docs-text">
                {parameter.name}
              </td>
              <td className="px-3 py-2.5 font-mono text-[11.5px] text-docs-muted">
                {parameter.in}
              </td>
              <td className="px-3 py-2.5 font-mono text-[11.5px] text-docs-muted">
                {schemaTypeLabel(parameter.schema)}
              </td>
              <td className="px-3 py-2.5">
                {parameter.required ? (
                  <span className="rounded-full bg-docs-red/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-docs-red">
                    required
                  </span>
                ) : (
                  <span className="text-[11.5px] text-docs-dim">optional</span>
                )}
              </td>
              <td className="px-3 py-2.5 text-[12px] text-docs-muted">
                {parameter.description ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MediaTabs({
  spec,
  media,
  contentType,
}: {
  spec: OpenAPISpec;
  media: MediaTypeObject;
  contentType: string;
}) {
  const example =
    media.example !== undefined
      ? stringifyJson(media.example)
      : stringifyJson(generateExample(spec, media.schema));

  return (
    <Tabs defaultValue="example">
      <div className="flex items-center justify-between gap-2">
        <TabsList>
          <TabsTrigger value="example">Example</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10.5px] text-docs-dim">
            {contentType}
          </span>
          {example ? <CopyButton value={example} iconOnly ariaLabel="Copy example" /> : null}
        </div>
      </div>
      <TabsContent value="example">
        <JsonEditor
          value={example || "{}"}
          readOnly
          height="240px"
          label="Example payload"
        />
      </TabsContent>
      <TabsContent value="schema">
        <SchemaViewer spec={spec} schema={media.schema} />
      </TabsContent>
    </Tabs>
  );
}

function ResponseBlock({
  spec,
  status,
  response,
}: {
  spec: OpenAPISpec;
  status: string;
  response: ResponseObject;
}) {
  const content = getJsonMedia(response.content);
  return (
    <div className="overflow-hidden rounded-lg border border-docs-border bg-docs-bg-elevated">
      <div className="flex flex-wrap items-center gap-2 border-b border-docs-border px-3.5 py-2.5">
        <StatusBadge status={status} />
        <span className="text-[12.5px] text-docs-muted">
          {response.description ?? ""}
        </span>
      </div>
      {content ? (
        <div className="p-3.5">
          <MediaTabs
            spec={spec}
            media={content.media}
            contentType={content.contentType}
          />
        </div>
      ) : null}
    </div>
  );
}

export function EndpointDetails({
  operation,
  spec,
}: {
  operation: ParsedOperation;
  spec: OpenAPISpec;
}) {
  const { catalog } = useDocs();
  const tag = catalog.tags.find((item) => item.slug === operation.tagSlug);
  const security = operation.security ?? catalog.security;
  const requiresAuth = security.length > 0;
  const bodyContent = getJsonMedia(operation.requestBody?.content);

  return (
    <article className="space-y-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-docs-dim">
        <Link href="/docs" className="hover:text-docs-text">
          API Reference
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={tag?.href ?? `/docs/${operation.tagSlug}`} className="hover:text-docs-text">
          {operation.tag}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-mono text-docs-muted">{operation.path}</span>
      </nav>

      <header className="rounded-xl border border-docs-border bg-docs-bg-elevated p-5">
        <div className="flex flex-wrap items-center gap-3">
          <MethodBadge method={operation.method} />
          <h1 className="break-all font-mono text-[18px] font-bold text-docs-text">
            {operation.path}
          </h1>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-bold",
              requiresAuth
                ? "border-docs-blue/40 bg-docs-blue/10 text-docs-blue"
                : "border-docs-green/40 bg-docs-green/10 text-docs-green",
            )}
          >
            {requiresAuth ? <Lock className="h-2.5 w-2.5" /> : <Unlock className="h-2.5 w-2.5" />}
            {requiresAuth ? "Authentication required" : "Public endpoint"}
          </span>
          {operation.deprecated ? (
            <span className="rounded-full border border-docs-orange/40 bg-docs-orange/10 px-2 py-0.5 text-[10.5px] font-bold text-docs-orange">
              Deprecated
            </span>
          ) : null}
        </div>
        <p className="mt-3 text-[15px] font-semibold text-docs-text">
          {operation.summary}
        </p>
        {operation.description ? (
          <p className="mt-2 whitespace-pre-line text-[13.5px] leading-relaxed text-docs-muted">
            {operation.description}
          </p>
        ) : tag?.description ? (
          <p className="mt-2 text-[13.5px] leading-relaxed text-docs-muted">
            {tag.description}
          </p>
        ) : null}
      </header>

      <section aria-labelledby="authentication-heading" className="space-y-3">
        <h2 id="authentication-heading" className="text-[15px] font-bold text-docs-text">
          Authentication
        </h2>
        {requiresAuth ? (
          <div className="space-y-2">
            {security.map((requirement, index) =>
              Object.keys(requirement).map((schemeName) => {
                const scheme = catalog.securitySchemes[schemeName];
                return (
                  <div
                    key={`${schemeName}-${index}`}
                    className="rounded-lg border border-docs-border bg-docs-bg-elevated px-3.5 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="font-mono text-[12.5px] font-bold text-docs-text">
                        {schemeName}
                      </code>
                      {scheme ? (
                        <span className="rounded border border-docs-border bg-docs-card-nested px-1.5 py-0.5 font-mono text-[10.5px] text-docs-dim">
                          {scheme.type}
                          {scheme.scheme ? ` · ${scheme.scheme}` : ""}
                          {scheme.bearerFormat ? ` · ${scheme.bearerFormat}` : ""}
                        </span>
                      ) : null}
                    </div>
                    {scheme?.description ? (
                      <p className="mt-1.5 text-[12.5px] text-docs-muted">
                        {scheme.description}
                      </p>
                    ) : (
                      <p className="mt-1.5 font-mono text-[12px] text-docs-muted">
                        Authorization: Bearer &lt;token&gt;
                      </p>
                    )}
                  </div>
                );
              }),
            )}
          </div>
        ) : (
          <p className="rounded-lg border border-docs-border bg-docs-bg-elevated px-3.5 py-3 text-[13px] text-docs-muted">
            This endpoint can be called without authentication.
          </p>
        )}
      </section>

      <section aria-labelledby="parameters-heading" className="space-y-3">
        <h2 id="parameters-heading" className="text-[15px] font-bold text-docs-text">
          Parameters
        </h2>
        <ParametersTable parameters={operation.parameters} />
      </section>

      {bodyContent ? (
        <section aria-labelledby="request-body-heading" className="space-y-3">
          <h2 id="request-body-heading" className="text-[15px] font-bold text-docs-text">
            Request Body
          </h2>
          <div className="rounded-lg border border-docs-border bg-docs-bg-elevated p-3.5">
            {operation.requestBody?.description ? (
              <p className="mb-3 text-[13px] text-docs-muted">
                {operation.requestBody.description}
              </p>
            ) : null}
            <MediaTabs
              spec={spec}
              media={bodyContent.media}
              contentType={bodyContent.contentType}
            />
          </div>
        </section>
      ) : null}

      <section aria-labelledby="responses-heading" className="space-y-3">
        <h2 id="responses-heading" className="text-[15px] font-bold text-docs-text">
          Responses
        </h2>
        {operation.responses.length === 0 ? (
          <p className="text-[13px] text-docs-dim">
            No responses documented for this operation.
          </p>
        ) : (
          <div className="space-y-3">
            {operation.responses.map(({ status, response }) => (
              <ResponseBlock
                key={status}
                spec={spec}
                status={status}
                response={response}
              />
            ))}
          </div>
        )}
      </section>

      <RequestBuilder operation={operation} spec={spec} />
    </article>
  );
}
