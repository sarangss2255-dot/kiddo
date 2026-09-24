import { cn } from "@/src/lib/utils";
import { METHOD_LABELS } from "@/src/lib/openapi/utils";
import type { HttpMethod } from "@/src/lib/openapi/types";

const METHOD_STYLES: Record<string, string> = {
  get: "border-docs-blue/40 bg-docs-blue/10 text-docs-blue",
  post: "border-docs-green/40 bg-docs-green/10 text-docs-green",
  put: "border-docs-orange/40 bg-docs-orange/10 text-docs-orange",
  patch: "border-docs-orange/40 bg-docs-orange/10 text-docs-orange",
  delete: "border-docs-red/40 bg-docs-red/10 text-docs-red",
  options: "border-docs-border-strong bg-docs-card-nested text-docs-muted",
  head: "border-docs-border-strong bg-docs-card-nested text-docs-muted",
  trace: "border-docs-border-strong bg-docs-card-nested text-docs-muted",
};

export function MethodBadge({
  method,
  className,
  size = "default",
}: {
  method: HttpMethod | string;
  className?: string;
  size?: "default" | "sm";
}) {
  const key = method.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md border font-mono font-bold uppercase tracking-wider",
        size === "sm" ? "min-w-[38px] px-1.5 py-0.5 text-[9px]" : "min-w-[52px] px-2 py-1 text-[10px]",
        METHOD_STYLES[key] ?? METHOD_STYLES.options,
        className,
      )}
    >
      {METHOD_LABELS[key as HttpMethod] ?? method.toUpperCase()}
    </span>
  );
}
