import type { ApiTag, SecurityRequirement } from "@/src/lib/openapi/types";
import { EndpointCard } from "./endpoint-card";

export function ApiSection({
  tag,
  globalSecurity,
}: {
  tag: ApiTag;
  globalSecurity: SecurityRequirement[];
}) {
  return (
    <section className="space-y-4">
      <header className="border-b border-docs-border pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[22px] font-bold tracking-tight text-docs-text">
            {tag.name}
          </h1>
          <span className="rounded-full bg-docs-card-nested px-2 py-0.5 text-[11px] font-bold text-docs-dim">
            {tag.operations.length} endpoint
            {tag.operations.length === 1 ? "" : "s"}
          </span>
        </div>
        {tag.description ? (
          <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-docs-muted">
            {tag.description}
          </p>
        ) : null}
      </header>

      {tag.operations.length === 0 ? (
        <p className="rounded-lg border border-dashed border-docs-border bg-docs-bg-elevated px-4 py-6 text-center text-[13px] text-docs-dim">
          No endpoints are documented for this section.
        </p>
      ) : (
        <div className="space-y-2.5">
          {tag.operations.map((operation) => (
            <EndpointCard
              key={operation.id}
              operation={operation}
              requiresAuth={(operation.security ?? globalSecurity).length > 0}
            />
          ))}
        </div>
      )}
    </section>
  );
}
