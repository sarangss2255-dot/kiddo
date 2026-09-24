"use client";

import { useCallback, useMemo, useState } from "react";
import {
  AlertCircle,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import type {
  MediaTypeObject,
  OpenAPISpec,
  ParameterObject,
  ParsedOperation,
} from "@/src/lib/openapi/types";
import {
  generateExample,
  joinUrl,
  stringifyJson,
} from "@/src/lib/openapi/utils";
import { cn } from "@/src/lib/utils";
import { useDocs } from "./docs-context";
import { CopyButton } from "./copy-button";
import { JsonEditor } from "./json-editor";
import { MethodBadge } from "./method-badge";
import { ResponseViewer, type RequestResult } from "./response-viewer";

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

function initialBody(operation: ParsedOperation, spec: OpenAPISpec): string {
  const content = getJsonMedia(operation.requestBody?.content);
  if (!content) return "";
  if (content.media.example !== undefined) {
    return stringifyJson(content.media.example);
  }
  const example = generateExample(spec, content.media.schema);
  if (example === undefined || example === null) return "";
  return stringifyJson(example);
}

function fieldPlaceholder(parameter: ParameterObject, spec: OpenAPISpec): string {
  const schema = parameter.schema;
  if (parameter.example !== undefined) return String(parameter.example);
  if (schema?.example !== undefined) return String(schema.example);
  if (schema?.enum?.length) return String(schema.enum[0]);
  if (schema?.default !== undefined) return String(schema.default);
  if (schema?.type === "integer" || schema?.type === "number") return "0";
  if (schema?.type === "boolean") return "true";
  const generated = generateExample(spec, schema);
  if (generated === null || generated === undefined) return "";
  return typeof generated === "string" ? generated : JSON.stringify(generated);
}

function ParamField({
  parameter,
  spec,
  value,
  onChange,
}: {
  parameter: ParameterObject;
  spec: OpenAPISpec;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex flex-wrap items-center gap-1.5">
        <code className="font-mono text-[12px] font-bold text-docs-text">
          {parameter.name}
        </code>
        <span className="rounded border border-docs-border bg-docs-card-nested px-1.5 py-0.5 font-mono text-[10px] text-docs-dim">
          {parameter.in}
        </span>
        {parameter.required ? (
          <span className="text-[10px] font-bold uppercase tracking-wide text-docs-red">
            required
          </span>
        ) : null}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={fieldPlaceholder(parameter, spec)}
        className="h-9 w-full rounded-lg border border-docs-border bg-docs-card px-3 font-mono text-[12px] text-docs-text placeholder:text-docs-dim focus:border-docs-green focus:outline-none"
      />
      {parameter.description ? (
        <span className="mt-1 block text-[11.5px] text-docs-dim">
          {parameter.description}
        </span>
      ) : null}
    </label>
  );
}

export function RequestBuilder({
  operation,
  spec,
}: {
  operation: ParsedOperation;
  spec: OpenAPISpec;
}) {
  const { baseUrl, token, openAuth } = useDocs();

  const pathParameters = useMemo(
    () => operation.parameters.filter((parameter) => parameter.in === "path"),
    [operation.parameters],
  );
  const queryParameters = useMemo(
    () => operation.parameters.filter((parameter) => parameter.in === "query"),
    [operation.parameters],
  );
  const headerParameters = useMemo(
    () => operation.parameters.filter((parameter) => parameter.in === "header"),
    [operation.parameters],
  );

  const bodyContent = useMemo(
    () => getJsonMedia(operation.requestBody?.content),
    [operation.requestBody],
  );

  const defaultBody = useMemo(
    () => initialBody(operation, spec),
    [operation, spec],
  );

  const [pathValues, setPathValues] = useState<Record<string, string>>({});
  const [queryValues, setQueryValues] = useState<Record<string, string>>({});
  const [headerValues, setHeaderValues] = useState<Record<string, string>>({});
  const [customHeaders, setCustomHeaders] = useState<
    { id: number; name: string; value: string }[]
  >([]);
  const [body, setBody] = useState(defaultBody);
  const [bodyError, setBodyError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RequestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resolvedPath = useMemo(
    () =>
      operation.path.replace(/\{([^}]+)\}/g, (_, name: string) => {
        const value = pathValues[name];
        return value ? encodeURIComponent(value) : `{${name}}`;
      }),
    [operation.path, pathValues],
  );

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    for (const parameter of queryParameters) {
      const value = queryValues[parameter.name];
      if (value) params.set(parameter.name, value);
    }
    const serialized = params.toString();
    return serialized ? `?${serialized}` : "";
  }, [queryParameters, queryValues]);

  const requestUrl = `${joinUrl(baseUrl, resolvedPath)}${queryString}`;

  const missingPathParams = pathParameters.filter(
    (parameter) => parameter.required && !pathValues[parameter.name],
  );

  const handleExecute = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const headers: Record<string, string> = { Accept: "application/json" };
    if (bodyContent && body.trim()) {
      headers["Content-Type"] = bodyContent.contentType;
    }
    for (const parameter of headerParameters) {
      if (headerValues[parameter.name]) {
        headers[parameter.name] = headerValues[parameter.name];
      }
    }
    if (token) headers.Authorization = `Bearer ${token}`;
    for (const header of customHeaders) {
      if (header.name.trim()) headers[header.name.trim()] = header.value;
    }

    const started = performance.now();
    try {
      const response = await fetch(requestUrl, {
        method: operation.method.toUpperCase(),
        headers,
        body:
          bodyContent && body.trim() && operation.method !== "get"
            ? body
            : undefined,
      });
      const elapsed = Math.round(performance.now() - started);
      const text = await response.text();
      setResult({
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Array.from(response.headers.entries()),
        body: text,
        timeMs: elapsed,
        url: requestUrl,
        method: operation.method,
        contentType: response.headers.get("content-type") ?? "",
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The request could not be completed.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    baseUrl,
    body,
    bodyContent,
    customHeaders,
    headerParameters,
    headerValues,
    operation.method,
    requestUrl,
    token,
  ]);

  const handleFormat = () => {
    try {
      setBody(JSON.stringify(JSON.parse(body), null, 2));
      setBodyError("");
    } catch {
      setBodyError("Request body is not valid JSON.");
    }
  };

  const handleReset = () => {
    setPathValues({});
    setQueryValues({});
    setHeaderValues({});
    setCustomHeaders([]);
    setBody(defaultBody);
    setBodyError("");
    setResult(null);
    setError(null);
  };

  return (
    <section
      id="try-it"
      aria-label="Try it out"
      className="scroll-mt-24 overflow-hidden rounded-xl border border-docs-border bg-docs-bg-elevated"
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-docs-border bg-docs-card-nested px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-docs-text">
          <Sparkles className="h-4 w-4 text-docs-green" />
          Try it out
        </span>
        <span className="text-[11.5px] text-docs-dim">
          Requests run from your browser
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {token ? (
            <span className="rounded-full border border-docs-green/40 bg-docs-green/10 px-2 py-0.5 text-[10.5px] font-bold text-docs-green">
              Bearer token attached
            </span>
          ) : (
            <button
              type="button"
              onClick={openAuth}
              className="rounded-full border border-docs-border px-2 py-0.5 text-[10.5px] font-bold text-docs-muted transition-colors hover:border-docs-green hover:text-docs-green"
            >
              Add token
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4">
        {pathParameters.length > 0 ? (
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-docs-dim">
              Path parameters
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {pathParameters.map((parameter) => (
                <ParamField
                  key={parameter.name}
                  parameter={parameter}
                  spec={spec}
                  value={pathValues[parameter.name] ?? ""}
                  onChange={(value) =>
                    setPathValues((current) => ({
                      ...current,
                      [parameter.name]: value,
                    }))
                  }
                />
              ))}
            </div>
          </div>
        ) : null}

        {queryParameters.length > 0 ? (
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-docs-dim">
              Query parameters
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {queryParameters.map((parameter) => (
                <ParamField
                  key={parameter.name}
                  parameter={parameter}
                  spec={spec}
                  value={queryValues[parameter.name] ?? ""}
                  onChange={(value) =>
                    setQueryValues((current) => ({
                      ...current,
                      [parameter.name]: value,
                    }))
                  }
                />
              ))}
            </div>
          </div>
        ) : null}

        {headerParameters.length > 0 ? (
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-docs-dim">
              Header parameters
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {headerParameters.map((parameter) => (
                <ParamField
                  key={parameter.name}
                  parameter={parameter}
                  spec={spec}
                  value={headerValues[parameter.name] ?? ""}
                  onChange={(value) =>
                    setHeaderValues((current) => ({
                      ...current,
                      [parameter.name]: value,
                    }))
                  }
                />
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-docs-dim">
              Additional headers
            </p>
            <button
              type="button"
              onClick={() =>
                setCustomHeaders((current) => [
                  ...current,
                  { id: Date.now(), name: "", value: "" },
                ])
              }
              className="inline-flex items-center gap-1 rounded-md border border-docs-border px-2 py-1 text-[11px] font-bold text-docs-muted transition-colors hover:border-docs-green hover:text-docs-green"
            >
              <Plus className="h-3 w-3" />
              Add header
            </button>
          </div>
          {customHeaders.length === 0 ? (
            <p className="text-[12px] text-docs-dim">
              No additional headers. The bearer token and content type are
              applied automatically.
            </p>
          ) : (
            <div className="space-y-2">
              {customHeaders.map((header) => (
                <div key={header.id} className="flex items-center gap-2">
                  <input
                    value={header.name}
                    onChange={(event) =>
                      setCustomHeaders((current) =>
                        current.map((item) =>
                          item.id === header.id
                            ? { ...item, name: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="Header name"
                    className="h-9 flex-1 rounded-lg border border-docs-border bg-docs-card px-3 font-mono text-[12px] text-docs-text placeholder:text-docs-dim focus:border-docs-green focus:outline-none"
                  />
                  <input
                    value={header.value}
                    onChange={(event) =>
                      setCustomHeaders((current) =>
                        current.map((item) =>
                          item.id === header.id
                            ? { ...item, value: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="Value"
                    className="h-9 flex-[1.4] rounded-lg border border-docs-border bg-docs-card px-3 font-mono text-[12px] text-docs-text placeholder:text-docs-dim focus:border-docs-green focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Remove header"
                    onClick={() =>
                      setCustomHeaders((current) =>
                        current.filter((item) => item.id !== header.id),
                      )
                    }
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-docs-border text-docs-dim transition-colors hover:border-docs-red hover:text-docs-red"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {bodyContent ? (
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-docs-dim">
                Request body
              </p>
              <span className="rounded border border-docs-border bg-docs-card-nested px-1.5 py-0.5 font-mono text-[10px] text-docs-dim">
                {bodyContent.contentType}
              </span>
              {operation.requestBody?.required ? (
                <span className="text-[10px] font-bold uppercase tracking-wide text-docs-red">
                  required
                </span>
              ) : null}
              <span className="ml-auto flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleFormat}
                  className="inline-flex items-center gap-1 rounded-md border border-docs-border px-2 py-1 text-[11px] font-bold text-docs-muted transition-colors hover:border-docs-green hover:text-docs-green"
                >
                  <Wand2 className="h-3 w-3" />
                  Format
                </button>
                <CopyButton value={body} label="Copy" />
              </span>
            </div>
            <JsonEditor
              value={body}
              onChange={setBody}
              height="240px"
              label="Request body editor"
            />
            {bodyError ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-docs-red">
                <AlertCircle className="h-3.5 w-3.5" />
                {bodyError}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="rounded-lg border border-docs-border bg-docs-bg px-3 py-2.5">
          <div className="flex items-center gap-2">
            <MethodBadge method={operation.method} size="sm" />
            <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[11.5px] text-docs-muted">
              {requestUrl || "Select an environment to build the URL"}
            </code>
            <CopyButton value={requestUrl} iconOnly ariaLabel="Copy request URL" />
          </div>
        </div>

        {missingPathParams.length > 0 ? (
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-docs-orange">
            <AlertCircle className="h-3.5 w-3.5" />
            Fill in required path parameters:{" "}
            {missingPathParams.map((parameter) => parameter.name).join(", ")}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExecute}
            disabled={loading || missingPathParams.length > 0}
            className="inline-flex items-center gap-2 rounded-lg border border-docs-green bg-docs-green px-4 py-2 text-[13px] font-bold text-[#04160a] transition-colors hover:bg-docs-green-strong disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            {loading ? "Sending..." : "Execute"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-docs-border px-3 py-2 text-[12.5px] font-bold text-docs-muted transition-colors hover:border-docs-border-strong hover:text-docs-text"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>

        <ResponseViewer result={result} loading={loading} error={error} />
      </div>
    </section>
  );
}
