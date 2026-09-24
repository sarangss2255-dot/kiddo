"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { CopyButton } from "./copy-button";
import { JsonEditor } from "./json-editor";
import { MethodBadge } from "./method-badge";
import { StatusBadge } from "./status-badge";

export interface RequestResult {
  status: number;
  statusText: string;
  ok: boolean;
  headers: [string, string][];
  body: string;
  timeMs: number;
  url: string;
  method: string;
  contentType: string;
}

function formatBody(body: string, contentType: string): string {
  if (!body) return "";
  if (contentType.includes("json") || /^\s*[[{]/.test(body)) {
    try {
      return JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      return body;
    }
  }
  return body;
}

export function ResponseViewer({
  result,
  loading,
  error,
}: {
  result: RequestResult | null;
  loading: boolean;
  error: string | null;
}) {
  const [tab, setTab] = useState<"body" | "headers">("body");
  const prettyBody = useMemo(
    () => (result ? formatBody(result.body, result.contentType) : ""),
    [result],
  );

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-docs-border bg-docs-bg-elevated px-4 py-6 text-sm text-docs-muted">
        <Loader2 className="h-4 w-4 animate-spin text-docs-green" />
        Sending request...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-docs-red/40 bg-docs-red/10 px-4 py-3 text-[13px] text-docs-red">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-bold">Request failed</p>
          <p className="mt-0.5 break-all text-[12.5px] opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-lg border border-dashed border-docs-border bg-docs-bg-elevated px-4 py-6 text-center text-[13px] text-docs-dim">
        Execute the request to inspect the response.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-docs-border bg-docs-bg-elevated">
      <div className="flex flex-wrap items-center gap-3 border-b border-docs-border px-3.5 py-3">
        <StatusBadge status={String(result.status)} />
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-docs-muted">
          <Clock className="h-3.5 w-3.5" />
          {result.timeMs} ms
        </span>
        <span className="text-[12px] text-docs-dim">
          {new TextEncoder().encode(result.body).length} bytes
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTab("body")}
            className={cn(
              "rounded-md px-2.5 py-1 text-[11.5px] font-bold transition-colors",
              tab === "body"
                ? "bg-docs-card-nested text-docs-text"
                : "text-docs-muted hover:text-docs-text",
            )}
          >
            Body
          </button>
          <button
            type="button"
            onClick={() => setTab("headers")}
            className={cn(
              "rounded-md px-2.5 py-1 text-[11.5px] font-bold transition-colors",
              tab === "headers"
                ? "bg-docs-card-nested text-docs-text"
                : "text-docs-muted hover:text-docs-text",
            )}
          >
            Headers ({result.headers.length})
          </button>
          {prettyBody ? (
            <CopyButton value={prettyBody} label="Copy" className="ml-1" />
          ) : null}
        </div>
      </div>

      <div className="border-b border-docs-border px-3.5 py-2.5">
        <p className="flex items-center gap-2 overflow-x-auto whitespace-nowrap font-mono text-[11.5px] text-docs-muted">
          <MethodBadge method={result.method} size="sm" />
          {result.url}
        </p>
      </div>

      {tab === "body" ? (
        prettyBody ? (
          <JsonEditor
            value={prettyBody}
            readOnly
            height="280px"
            className="rounded-none border-0"
            label="Response body"
          />
        ) : (
          <p className="px-3.5 py-6 text-center text-[13px] text-docs-dim">
            Empty response body.
          </p>
        )
      ) : (
        <div className="max-h-72 overflow-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-docs-border">
                <th className="px-3.5 py-2 text-[10.5px] font-bold uppercase tracking-wider text-docs-dim">
                  Header
                </th>
                <th className="px-3.5 py-2 text-[10.5px] font-bold uppercase tracking-wider text-docs-dim">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {result.headers.map(([key, value]) => (
                <tr key={key} className="border-b border-docs-border last:border-b-0">
                  <td className="px-3.5 py-2 font-mono text-[11.5px] text-docs-text">
                    {key}
                  </td>
                  <td className="break-all px-3.5 py-2 font-mono text-[11.5px] text-docs-muted">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
