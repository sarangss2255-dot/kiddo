import Link from "next/link";
import { ArrowUpRight, Lock, Unlock } from "lucide-react";
import type { ParsedOperation } from "@/src/lib/openapi/types";
import { MethodBadge } from "./method-badge";

export function EndpointCard({
  operation,
  requiresAuth,
}: {
  operation: ParsedOperation;
  requiresAuth: boolean;
}) {
  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-docs-border bg-docs-bg-elevated p-3.5 transition-colors hover:border-docs-border-strong sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <MethodBadge method={operation.method} />
        <div className="min-w-0">
          <Link
            href={operation.href}
            className="block truncate font-mono text-[13px] font-semibold text-docs-text transition-colors group-hover:text-docs-green"
          >
            {operation.path}
          </Link>
          <p className="mt-0.5 truncate text-[12.5px] text-docs-muted">
            {operation.summary}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 pl-[64px] sm:pl-0">
        <span
          className={
            requiresAuth
              ? "inline-flex items-center gap-1 rounded-full border border-docs-blue/40 bg-docs-blue/10 px-2 py-0.5 text-[10px] font-bold text-docs-blue"
              : "inline-flex items-center gap-1 rounded-full border border-docs-green/40 bg-docs-green/10 px-2 py-0.5 text-[10px] font-bold text-docs-green"
          }
        >
          {requiresAuth ? (
            <Lock className="h-2.5 w-2.5" />
          ) : (
            <Unlock className="h-2.5 w-2.5" />
          )}
          {requiresAuth ? "Auth" : "Public"}
        </span>
        <Link
          href={`${operation.href}#try-it`}
          className="inline-flex items-center gap-1 rounded-lg border border-docs-border px-2.5 py-1.5 text-[11.5px] font-bold text-docs-muted transition-colors hover:border-docs-green hover:text-docs-green"
        >
          Try it
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
