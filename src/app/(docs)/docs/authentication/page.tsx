import type { Metadata } from "next";
import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import { getCatalog } from "@/src/lib/openapi/catalog";
import { MethodBadge } from "@/src/components/docs/method-badge";
import { OpenAuthButton } from "@/src/components/docs/open-auth-button";
import { CodeBlock } from "@/src/components/docs/code-block";

export const metadata: Metadata = {
  title: "Authentication",
  description: "How to authenticate with the KidDo API using JWT bearer tokens.",
};

export default async function AuthenticationPage() {
  const { catalog } = await getCatalog();

  const authTag = catalog.tags.find((tag) =>
    /auth|login|token|session/i.test(`${tag.name} ${tag.description ?? ""}`),
  );
  const authOperations = authTag?.operations ?? [];
  const schemes = Object.entries(catalog.securitySchemes);
  const protectedCount = catalog.operations.filter(
    (operation) => (operation.security ?? catalog.security).length > 0,
  ).length;

  return (
    <article className="max-w-3xl space-y-8">
      <header>
        <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-docs-green">
          Getting Started
        </p>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-docs-text">
          Authentication
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-docs-muted">
          The KidDo API uses bearer tokens. {protectedCount} of{" "}
          {catalog.operationCount} operations require authentication. Public
          operations such as health checks and login do not.
        </p>
        <div className="mt-4">
          <OpenAuthButton />
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-[17px] font-bold text-docs-text">
          Authorization header
        </h2>
        <p className="text-[13.5px] leading-relaxed text-docs-muted">
          Send the token on every protected request. Tokens are issued by the
          authentication endpoints and should be treated as secrets.
        </p>
        <CodeBlock code={'Authorization: Bearer <token>'} />
      </section>

      <section className="space-y-3">
        <h2 className="text-[17px] font-bold text-docs-text">
          Security schemes
        </h2>
        {schemes.length === 0 ? (
          <p className="rounded-lg border border-docs-border bg-docs-bg-elevated px-4 py-3 text-[13px] text-docs-muted">
            No security schemes are declared in the specification.
          </p>
        ) : (
          <div className="space-y-2">
            {schemes.map(([name, scheme]) => (
              <div
                key={name}
                className="rounded-lg border border-docs-border bg-docs-bg-elevated px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-docs-green" />
                  <code className="font-mono text-[12.5px] font-bold text-docs-text">
                    {name}
                  </code>
                  <span className="rounded border border-docs-border bg-docs-card-nested px-1.5 py-0.5 font-mono text-[10.5px] text-docs-dim">
                    {scheme.type}
                    {scheme.scheme ? ` · ${scheme.scheme}` : ""}
                    {scheme.bearerFormat ? ` · ${scheme.bearerFormat}` : ""}
                  </span>
                </div>
                {scheme.description ? (
                  <p className="mt-1.5 text-[12.5px] text-docs-muted">
                    {scheme.description}
                  </p>
                ) : (
                  <p className="mt-1.5 text-[12.5px] text-docs-muted">
                    Pass the token in the Authorization header.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {authOperations.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-[17px] font-bold text-docs-text">
            Authentication endpoints
          </h2>
          <div className="space-y-2">
            {authOperations.map((operation) => (
              <Link
                key={operation.id}
                href={operation.href}
                className="flex items-center gap-3 rounded-lg border border-docs-border bg-docs-bg-elevated px-3.5 py-2.5 transition-colors hover:border-docs-border-strong"
              >
                <MethodBadge method={operation.method} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-mono text-[12.5px] text-docs-text">
                    {operation.path}
                  </span>
                  <span className="block truncate text-[12px] text-docs-muted">
                    {operation.summary}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-[17px] font-bold text-docs-text">
          Token handling
        </h2>
        <ul className="space-y-2 text-[13.5px] leading-relaxed text-docs-muted">
          <li className="flex gap-2">
            <Lock className="mt-1 h-3.5 w-3.5 shrink-0 text-docs-green" />
            Store tokens in memory or secure browser storage; never commit them
            to source control.
          </li>
          <li className="flex gap-2">
            <Lock className="mt-1 h-3.5 w-3.5 shrink-0 text-docs-green" />
            The documentation portal keeps authorized tokens in this
            browser&apos;s local storage and attaches them only to requests you
            execute here.
          </li>
          <li className="flex gap-2">
            <Lock className="mt-1 h-3.5 w-3.5 shrink-0 text-docs-green" />
            Tokens are never written to logs. Clear the token when using a
            shared device.
          </li>
        </ul>
      </section>
    </article>
  );
}
