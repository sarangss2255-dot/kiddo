import Link from "next/link";
import { ArrowRight, Boxes, Braces, Layers, Server } from "lucide-react";
import type { ApiCatalog, OpenAPISpec } from "@/src/lib/openapi/types";
import { buildQuickStartSnippets } from "@/src/lib/openapi/guides";
import { CodeBlock } from "./code-block";
import { CopyButton } from "./copy-button";
import { MethodBadge } from "./method-badge";

export function ApiOverview({
  catalog,
  spec,
}: {
  catalog: ApiCatalog;
  spec: OpenAPISpec;
}) {
  const snippets = buildQuickStartSnippets(catalog, spec);
  const { authOperation, protectedOperation } = snippets;

  const stats = [
    { label: "Endpoints", value: catalog.operationCount, icon: Layers },
    { label: "Sections", value: catalog.tags.length, icon: Boxes },
    { label: "Schemas", value: Object.keys(catalog.schemas).length, icon: Braces },
    { label: "Environments", value: catalog.servers.length, icon: Server },
  ];

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-xl border border-docs-border bg-docs-bg-elevated">
        <div className="border-b border-docs-border px-6 py-7">
          <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-docs-green">
            Developer documentation
          </p>
          <h1 className="mt-2 text-[30px] font-bold leading-tight tracking-tight text-docs-text">
            {catalog.info.title}
          </h1>
          <p className="mt-2.5 max-w-2xl text-[14.5px] leading-relaxed text-docs-muted">
            {catalog.info.description ??
              "Build powerful integrations with the KidDo platform."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-docs-border bg-docs-card px-2.5 py-1 text-[11.5px] font-semibold text-docs-muted">
              v{catalog.info.version}
            </span>
            <span className="rounded-full border border-docs-border bg-docs-card px-2.5 py-1 text-[11.5px] font-semibold text-docs-muted">
              OpenAPI {catalog.openapi}
            </span>
            <span className="rounded-full border border-docs-border bg-docs-card px-2.5 py-1 text-[11.5px] font-semibold text-docs-muted">
              REST API
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-6 py-4">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-docs-dim">
            Base URL
          </span>
          <code className="min-w-0 flex-1 break-all font-mono text-[12.5px] text-docs-green">
            {snippets.baseUrl || "Not declared in the specification"}
          </code>
          {snippets.baseUrl ? (
            <CopyButton value={snippets.baseUrl} label="Copy" />
          ) : null}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-docs-border bg-docs-bg-elevated px-4 py-3.5"
            >
              <div className="flex items-center gap-2 text-docs-dim">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[10.5px] font-bold uppercase tracking-[0.12em]">
                  {stat.label}
                </span>
              </div>
              <p className="mt-1.5 text-[22px] font-bold text-docs-text">
                {stat.value}
              </p>
            </div>
          );
        })}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-bold text-docs-text">Quick Start</h2>
            <p className="mt-1 text-[13.5px] text-docs-muted">
              Four steps from zero to your first authenticated request.
            </p>
          </div>
          <Link
            href="/docs/quick-start"
            className="inline-flex items-center gap-1 text-[12.5px] font-bold text-docs-green hover:underline"
          >
            Full quick start guide
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-docs-border bg-docs-bg-elevated p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-docs-green/10 text-[11px] font-bold text-docs-green">
                1
              </span>
              <h3 className="text-[14px] font-bold text-docs-text">
                Authenticate
              </h3>
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-docs-muted">
              {authOperation ? (
                <>
                  Call{" "}
                  <code className="font-mono text-docs-green">
                    {authOperation.method.toUpperCase()} {authOperation.path}
                  </code>{" "}
                  with your credentials.
                </>
              ) : (
                "Call the authentication endpoint with your credentials."
              )}
            </p>
            {snippets.authenticateCurl ? (
              <div className="mt-3">
                <CodeBlock code={snippets.authenticateCurl} />
              </div>
            ) : null}
          </div>

          <div className="rounded-xl border border-docs-border bg-docs-bg-elevated p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-docs-green/10 text-[11px] font-bold text-docs-green">
                2
              </span>
              <h3 className="text-[14px] font-bold text-docs-text">
                Obtain the JWT token
              </h3>
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-docs-muted">
              The response contains an access token. Store it securely and never
              expose it in logs or client code.
            </p>
            {snippets.tokenResponse ? (
              <div className="mt-3">
                <CodeBlock code={snippets.tokenResponse} />
              </div>
            ) : null}
          </div>

          <div className="rounded-xl border border-docs-border bg-docs-bg-elevated p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-docs-green/10 text-[11px] font-bold text-docs-green">
                3
              </span>
              <h3 className="text-[14px] font-bold text-docs-text">
                Authorize requests
              </h3>
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-docs-muted">
              Send the token on every protected request using the{" "}
              <code className="font-mono text-docs-green">Authorization</code>{" "}
              header.
            </p>
            <div className="mt-3">
              <CodeBlock code={snippets.authorizeHeader} />
            </div>
          </div>

          <div className="rounded-xl border border-docs-border bg-docs-bg-elevated p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-docs-green/10 text-[11px] font-bold text-docs-green">
                4
              </span>
              <h3 className="text-[14px] font-bold text-docs-text">
                Call endpoints
              </h3>
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-docs-muted">
              {protectedOperation ? (
                <>
                  Start with{" "}
                  <code className="font-mono text-docs-green">
                    {protectedOperation.method.toUpperCase()}{" "}
                    {protectedOperation.path}
                  </code>
                  .
                </>
              ) : (
                "Start calling the endpoints documented in the reference."
              )}
            </p>
            {snippets.callCurl ? (
              <div className="mt-3">
                <CodeBlock code={snippets.callCurl} />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-bold text-docs-text">
              Browse the API
            </h2>
            <p className="mt-1 text-[13.5px] text-docs-muted">
              Sections are generated from the OpenAPI tags.
            </p>
          </div>
          <Link
            href="/docs/schemas"
            className="inline-flex items-center gap-1 text-[12.5px] font-bold text-docs-green hover:underline"
          >
            View data models
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {catalog.tags.map((tag) => (
            <div
              key={tag.slug}
              className="group rounded-xl border border-docs-border bg-docs-bg-elevated p-4 transition-colors hover:border-docs-border-strong"
            >
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={tag.href}
                  className="text-[14px] font-bold text-docs-text transition-colors group-hover:text-docs-green"
                >
                  {tag.name}
                </Link>
                <span className="rounded-full bg-docs-card-nested px-2 py-0.5 text-[10.5px] font-bold text-docs-dim">
                  {tag.operations.length}
                </span>
              </div>
              {tag.description ? (
                <p className="mt-1.5 line-clamp-2 text-[12.5px] text-docs-muted">
                  {tag.description}
                </p>
              ) : null}
              <ul className="mt-3 space-y-1">
                {tag.operations.slice(0, 3).map((operation) => (
                  <li key={operation.id}>
                    <Link
                      href={operation.href}
                      className="flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-docs-card"
                    >
                      <MethodBadge method={operation.method} size="sm" />
                      <span className="truncate font-mono text-[11.5px] text-docs-muted">
                        {operation.path}
                      </span>
                    </Link>
                  </li>
                ))}
                {tag.operations.length > 3 ? (
                  <li>
                    <Link
                      href={tag.href}
                      className="inline-flex px-1.5 py-1 text-[11.5px] font-semibold text-docs-dim hover:text-docs-green"
                    >
                      +{tag.operations.length - 3} more
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
