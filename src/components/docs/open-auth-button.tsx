"use client";

import { KeyRound } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useDocs } from "./docs-context";

export function OpenAuthButton({ className }: { className?: string }) {
  const { token, openAuth } = useDocs();

  return (
    <button
      type="button"
      onClick={openAuth}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[12.5px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-docs-green",
        token
          ? "border-docs-green bg-docs-green/10 text-docs-green"
          : "border-docs-green bg-docs-green text-[#04160a] hover:bg-docs-green-strong",
        className,
      )}
    >
      <KeyRound className="h-3.5 w-3.5" />
      {token ? "Manage token" : "Authorize"}
    </button>
  );
}
