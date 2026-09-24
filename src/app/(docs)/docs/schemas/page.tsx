import type { Metadata } from "next";
import { getCatalog } from "@/src/lib/openapi/catalog";
import { SchemaViewer } from "@/src/components/docs/schema-viewer";
import { slugify } from "@/src/lib/openapi/utils";

export const metadata: Metadata = {
  title: "Data Models",
  description: "All schemas defined by the KidDo OpenAPI specification.",
};

export default async function SchemasPage() {
  const { catalog, spec } = await getCatalog();
  const schemas = Object.entries(catalog.schemas);

  return (
    <article className="max-w-4xl space-y-8">
      <header>
        <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-docs-green">
          Reference
        </p>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-docs-text">
          Data Models
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-docs-muted">
          {schemas.length} schemas are declared in the specification. Values are
          generated from the schema definitions themselves.
        </p>
      </header>

      {schemas.length === 0 ? (
        <p className="rounded-lg border border-dashed border-docs-border bg-docs-bg-elevated px-4 py-6 text-center text-[13px] text-docs-dim">
          The specification does not declare any schemas.
        </p>
      ) : (
        <div className="space-y-6">
          {schemas.map(([name, schema]) => (
            <section
              key={name}
              id={`schema-${slugify(name)}`}
              className="scroll-mt-24 space-y-2.5 rounded-xl border border-docs-border bg-docs-bg-elevated p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-mono text-[15px] font-bold text-docs-text">
                  {name}
                </h2>
                {schema.type ? (
                  <span className="rounded border border-docs-border bg-docs-card-nested px-1.5 py-0.5 font-mono text-[10.5px] text-docs-dim">
                    {Array.isArray(schema.type) ? schema.type.join(" | ") : schema.type}
                  </span>
                ) : null}
              </div>
              {schema.description ? (
                <p className="text-[13px] leading-relaxed text-docs-muted">
                  {schema.description}
                </p>
              ) : null}
              <SchemaViewer spec={spec} schema={schema} />
            </section>
          ))}
        </div>
      )}
    </article>
  );
}
