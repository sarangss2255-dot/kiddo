import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCatalog } from "@/src/lib/openapi/catalog";
import { buildQuickStartSnippets } from "@/src/lib/openapi/guides";
import { CodeBlock } from "@/src/components/docs/code-block";
import { MethodBadge } from "@/src/components/docs/method-badge";
import { OpenAuthButton } from "@/src/components/docs/open-auth-button";

export const metadata: Metadata = {
  title: "Quick Start",
  description: "Authenticate and make your first KidDo API request.",
};

export default async function QuickStartPage() {
  const { catalog, spec } = await getCatalog();
  const snippets = buildQuickStartSnippets(catalog, spec);

  return (
    <article className="max-w-3xl space-y-8">
      <header>
        <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-docs-green">
          Getting Started
        </p>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-docs-text">
          Quick Start
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-docs-muted">
          Authenticate, obtain a JWT token, authorize your requests and call the
          first endpoint. Every value below comes from the live OpenAPI
          document.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <OpenAuthButton />
          <Link
            href="/docs/authentication"
            className="inline-flex items-center gap-1 text-[12.5px] font-bold text-docs-green hover:underline"
          >
            Authentication details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-[17px] font-bold text-docs-text">
          1. Authenticate
        </h2>
        <p className="text-[13.5px] leading-relaxed text-docs-muted">
          {snippets.authOperation ? (
            <>
              Send your credentials to{" "}
              <MethodBadge method={snippets.authOperation.method} size="sm" />{" "}
              <code className="font-mono text-docs-green">
                {snippets.authOperation.path}
              </code>
              .
            </>
          ) : (
            "Send your credentials to the authentication endpoint."
          )}
        </p>
        {snippets.authenticateCurl ? (
          <CodeBlock code={snippets.authenticateCurl} />
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-[17px] font-bold text-docs-text">
          2. Obtain the JWT token
        </h2>
        <p className="text-[13.5px] leading-relaxed text-docs-muted">
          The authentication response includes an access token. Keep it out of
          logs and source control.
        </p>
        {snippets.tokenResponse ? (
          <CodeBlock code={snippets.tokenResponse} />
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-[17px] font-bold text-docs-text">
          3. Authorize requests
        </h2>
        <p className="text-[13.5px] leading-relaxed text-docs-muted">
          Add the token to every protected request. The docs portal can store it
          for you in this browser only.
        </p>
        <CodeBlock code={snippets.authorizeHeader} />
      </section>

      <section className="space-y-3">
        <h2 className="text-[17px] font-bold text-docs-text">
          4. Call endpoints
        </h2>
        {snippets.protectedOperation ? (
          <p className="text-[13.5px] leading-relaxed text-docs-muted">
            Start with{" "}
            <MethodBadge method={snippets.protectedOperation.method} size="sm" />{" "}
            <code className="font-mono text-docs-green">
              {snippets.protectedOperation.path}
            </code>{" "}
            or browse the{" "}
            <Link
              href="/docs"
              className="font-semibold text-docs-green hover:underline"
            >
              API reference
            </Link>
            .
          </p>
        ) : (
          "Browse the API reference and start calling endpoints."
        )}
        {snippets.callCurl ? <CodeBlock code={snippets.callCurl} /> : null}
      </section>
    </article>
  );
}
