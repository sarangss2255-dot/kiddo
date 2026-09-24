import { cn } from "@/src/lib/utils";
import { CopyButton } from "./copy-button";

export function CodeBlock({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-docs-border bg-docs-code",
        className,
      )}
    >
      <pre className="overflow-x-auto px-3.5 py-3 font-mono text-[11.5px] leading-relaxed text-docs-text">
        {code}
      </pre>
      <CopyButton
        value={code}
        iconOnly
        ariaLabel="Copy snippet"
        className="absolute right-2 top-2"
      />
    </div>
  );
}
