"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/src/lib/utils";

export function CopyButton({
  value,
  label = "Copy",
  className,
  iconOnly = false,
  ariaLabel,
}: {
  value: string;
  label?: string;
  className?: string;
  iconOnly?: boolean;
  ariaLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel ?? (copied ? "Copied" : label)}
      title={copied ? "Copied" : label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-docs-border bg-docs-card px-2.5 py-1.5 text-xs font-semibold text-docs-muted transition-colors hover:border-docs-green hover:text-docs-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-docs-green",
        copied && "border-docs-green text-docs-green",
        iconOnly && "px-2 py-2",
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {!iconOnly && <span>{copied ? "Copied" : label}</span>}
    </button>
  );
}
