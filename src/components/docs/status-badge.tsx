import { cn } from "@/src/lib/utils";
import { statusLabel } from "@/src/lib/openapi/utils";

const STATUS_STYLES: Record<string, string> = {
  "2xx": "border-docs-green/40 bg-docs-green/10 text-docs-green",
  "3xx": "border-docs-blue/40 bg-docs-blue/10 text-docs-blue",
  "4xx": "border-docs-orange/40 bg-docs-orange/10 text-docs-orange",
  "5xx": "border-docs-red/40 bg-docs-red/10 text-docs-red",
  default: "border-docs-border-strong bg-docs-card-nested text-docs-muted",
};

export function statusTone(status: string): keyof typeof STATUS_STYLES {
  if (/^2\d\d$/.test(status)) return "2xx";
  if (/^3\d\d$/.test(status)) return "3xx";
  if (/^4\d\d$/.test(status)) return "4xx";
  if (/^5\d\d$/.test(status)) return "5xx";
  return "default";
}

export function StatusBadge({
  status,
  className,
  showLabel = true,
}: {
  status: string;
  className?: string;
  showLabel?: boolean;
}) {
  const tone = statusTone(status);
  const label = statusLabel(status);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] font-bold",
        STATUS_STYLES[tone],
        className,
      )}
    >
      {status}
      {showLabel && label ? (
        <span className="font-sans text-[10px] font-semibold opacity-80">
          {label}
        </span>
      ) : null}
    </span>
  );
}
