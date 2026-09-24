import Link from "next/link";
import type { OpenAPISpec, SchemaObject } from "@/src/lib/openapi/types";
import {
  dereferenceSchema,
  generateExample,
  mergeAllOf,
  refName,
  schemaTypeLabel,
  slugify,
  stringifyJson,
} from "@/src/lib/openapi/utils";
import { cn } from "@/src/lib/utils";

function PropertyType({ schema }: { schema: SchemaObject }) {
  if (schema.$ref) {
    const name = refName(schema.$ref) ?? "object";
    return (
      <Link
        href={`/docs/schemas#schema-${slugify(name)}`}
        className="font-mono text-[11.5px] text-docs-blue hover:underline"
      >
        {name}
      </Link>
    );
  }
  return (
    <span className="font-mono text-[11.5px] text-docs-muted">
      {schemaTypeLabel(schema)}
      {schema.format ? (
        <span className="text-docs-dim"> &lt;{schema.format}&gt;</span>
      ) : null}
    </span>
  );
}

function PropertyRow({
  spec,
  name,
  schema,
  required,
  depth,
  visited,
}: {
  spec: OpenAPISpec;
  name: string;
  schema: SchemaObject;
  required: boolean;
  depth: number;
  visited: Set<string>;
}) {
  const resolved = dereferenceSchema(spec, schema) ?? schema;
  const merged = mergeAllOf(spec, resolved);
  const properties = merged.properties ?? {};
  const hasChildren =
    Object.keys(properties).length > 0 ||
    (merged.type === "array" && Boolean(merged.items));

  const refKey = schema.$ref;
  const alreadyVisited = refKey ? visited.has(refKey) : false;
  const canExpand = hasChildren && depth < 3 && !alreadyVisited;

  return (
    <div className="border-b border-docs-border last:border-b-0">
      <div className="grid grid-cols-1 gap-1 px-3 py-2.5 sm:grid-cols-[minmax(140px,26%)_1fr]">
        <div className="flex items-center gap-1.5">
          <code className="font-mono text-[12.5px] font-semibold text-docs-text">
            {name}
          </code>
          {required ? (
            <span className="rounded-full bg-docs-red/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-docs-red">
              required
            </span>
          ) : null}
        </div>
        <div className="min-w-0 space-y-1.5">
          <PropertyType schema={resolved} />
          {resolved.description ? (
            <p className="text-[12px] leading-relaxed text-docs-muted">
              {resolved.description}
            </p>
          ) : null}
          {resolved.enum ? (
            <p className="flex flex-wrap gap-1">
              {resolved.enum.map((value) => (
                <code
                  key={String(value)}
                  className="rounded border border-docs-border bg-docs-card-nested px-1.5 py-0.5 font-mono text-[11px] text-docs-muted"
                >
                  {String(value)}
                </code>
              ))}
            </p>
          ) : null}
        </div>
      </div>

      {canExpand ? (
        <div className="ml-3 border-l border-docs-border sm:ml-4">
          {merged.type === "array" && merged.items ? (
            <SchemaViewer
              spec={spec}
              schema={merged.items}
              depth={depth + 1}
              visited={visited}
              compact
            />
          ) : (
            Object.entries(properties).map(([childName, childSchema]) => (
              <PropertyRow
                key={childName}
                spec={spec}
                name={childName}
                schema={childSchema}
                required={(merged.required ?? []).includes(childName)}
                depth={depth + 1}
                visited={visited}
              />
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

export function SchemaViewer({
  spec,
  schema,
  name,
  depth = 0,
  visited,
  compact = false,
  className,
}: {
  spec: OpenAPISpec;
  schema: SchemaObject | undefined;
  name?: string;
  depth?: number;
  visited?: Set<string>;
  compact?: boolean;
  className?: string;
}) {
  const seen = visited ?? new Set<string>();
  if (schema?.$ref) seen.add(schema.$ref);

  const resolved = dereferenceSchema(spec, schema) ?? schema;
  const merged = resolved ? mergeAllOf(spec, resolved) : undefined;
  const properties = merged?.properties ?? {};
  const hasProperties = Object.keys(properties).length > 0;
  const isArrayOfObjects =
    merged?.type === "array" && merged.items && !merged.items.$ref;

  return (
    <div className={cn("space-y-2", className)}>
      {name ? (
        <div className="flex items-center gap-2">
          <code className="font-mono text-[12.5px] font-bold text-docs-text">
            {name}
          </code>
          {resolved?.type ? (
            <span className="font-mono text-[11px] text-docs-dim">
              {schemaTypeLabel(resolved)}
            </span>
          ) : null}
        </div>
      ) : null}

      {resolved?.description && !compact ? (
        <p className="text-[12.5px] leading-relaxed text-docs-muted">
          {resolved.description}
        </p>
      ) : null}

      {hasProperties ? (
        <div className="overflow-hidden rounded-lg border border-docs-border bg-docs-bg-elevated">
          {Object.entries(properties).map(([propertyName, propertySchema]) => (
            <PropertyRow
              key={propertyName}
              spec={spec}
              name={propertyName}
              schema={propertySchema}
              required={(merged?.required ?? []).includes(propertyName)}
              depth={depth}
              visited={seen}
            />
          ))}
        </div>
      ) : isArrayOfObjects ? (
        <SchemaViewer
          spec={spec}
          schema={merged!.items}
          depth={depth + 1}
          visited={seen}
          compact
        />
      ) : (
        <div className="rounded-lg border border-docs-border bg-docs-bg-elevated px-3 py-2.5">
          <PropertyType schema={resolved ?? {}} />
          {merged?.enum ? (
            <span className="ml-2 text-[11.5px] text-docs-dim">
              {merged.enum.map((value) => String(value)).join(" | ")}
            </span>
          ) : null}
        </div>
      )}

      {resolved ? (
        <details className="group rounded-lg border border-docs-border bg-docs-bg-elevated">
          <summary className="cursor-pointer list-none px-3 py-2 text-[11.5px] font-bold uppercase tracking-wider text-docs-dim hover:text-docs-text">
            Example value
          </summary>
          <pre className="max-h-72 overflow-auto border-t border-docs-border px-3 py-2.5 font-mono text-[11.5px] leading-relaxed text-docs-text">
            {stringifyJson(generateExample(spec, resolved))}
          </pre>
        </details>
      ) : null}
    </div>
  );
}
