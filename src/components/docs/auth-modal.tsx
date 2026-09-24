"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, ShieldCheck, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/Dialog";
import { cn } from "@/src/lib/utils";
import { useDocs } from "./docs-context";

export function AuthModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { token, setToken, clearToken } = useDocs();
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setValue(token ?? "");
      setError("");
    }
  }, [open, token]);

  const handleAuthorize = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Enter a bearer token to authorize requests.");
      return;
    }
    setToken(trimmed);
    onOpenChange(false);
  };

  const handleClear = () => {
    clearToken();
    setValue("");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg! gap-0! border-docs-border-strong! bg-docs-bg-elevated! p-0! text-docs-text">
        <DialogHeader className="border-b border-docs-border px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-docs-text">
            <KeyRound className="h-4 w-4 text-docs-green" />
            Authorize requests
          </DialogTitle>
          <DialogDescription className="text-[13px] text-docs-muted">
            Provide a JWT bearer token to authenticate requests from the
            documentation portal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-5 py-4">
          <div>
            <label
              htmlFor="docs-bearer-token"
              className="mb-1.5 block text-[12px] font-bold text-docs-text"
            >
              JWT Bearer Token
            </label>
            <div className="relative">
              <input
                id="docs-bearer-token"
                type={visible ? "text" : "password"}
                value={value}
                onChange={(event) => {
                  setValue(event.target.value);
                  setError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleAuthorize();
                }}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                autoComplete="off"
                spellCheck={false}
                className="h-11 w-full rounded-lg border border-docs-border-strong bg-docs-card px-3 pr-10 font-mono text-[12.5px] text-docs-text placeholder:text-docs-dim focus:border-docs-green focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setVisible((current) => !current)}
                aria-label={visible ? "Hide token" : "Show token"}
                className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-docs-dim hover:bg-docs-card-nested hover:text-docs-text"
              >
                {visible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {error ? (
              <p className="mt-1.5 text-[12px] font-semibold text-docs-red">
                {error}
              </p>
            ) : null}
          </div>

          <div className="rounded-lg border border-docs-border bg-docs-bg px-3.5 py-3">
            <p className="text-[12px] font-bold uppercase tracking-wider text-docs-dim">
              Requests will send
            </p>
            <code className="mt-1.5 block break-all font-mono text-[12px] text-docs-green">
              Authorization: Bearer &lt;token&gt;
            </code>
          </div>

          <p className="text-[12px] leading-relaxed text-docs-muted">
            Tokens are stored in this browser&apos;s local storage only and are
            attached to requests you execute from the docs. They are never
            logged by the portal. Clear the token when you are done on a shared
            device.
          </p>

          {token ? (
            <p className="flex items-center gap-1.5 text-[12px] font-semibold text-docs-green">
              <ShieldCheck className="h-3.5 w-3.5" />
              A token is currently authorized.
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-docs-border px-5 py-4">
          <button
            type="button"
            onClick={handleClear}
            disabled={!token}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border border-docs-border px-3 py-2 text-[12.5px] font-bold text-docs-muted transition-colors hover:border-docs-red hover:text-docs-red disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear token
          </button>
          <button
            type="button"
            onClick={handleAuthorize}
            className="inline-flex items-center gap-1.5 rounded-lg border border-docs-green bg-docs-green px-4 py-2 text-[12.5px] font-bold text-[#04160a] transition-colors hover:bg-docs-green-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-docs-green"
          >
            <KeyRound className="h-3.5 w-3.5" />
            Authorize
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
