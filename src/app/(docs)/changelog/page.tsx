import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/src/lib/openapi/catalog";

export const metadata: Metadata = {
  title: "Changelog",
  description: "KidDo API version history.",
};

export default async function ChangelogPage() {
  const { catalog, source, specUrl, loadedAt } = await getCatalog();

  const entries = [
    {
      version: `v${catalog.info.version}`,
      date: loadedAt.slice(0, 10),
      title: "Current specification",
      description: `${catalog.operationCount} operations across ${catalog.tags.length} sections and ${Object.keys(catalog.schemas).length} schemas.`,
      current: true,
    },
  ];

  return (
    <article className="max-w-3xl space-y-8">
      <header>
        <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-docs-green">
          Reference
        </p>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-docs-text">
          Changelog
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-docs-muted">
          The documentation portal renders whatever the OpenAPI document
          declares, so this page reflects the specification version in use.
        </p>
      </header>

      <div className="rounded-xl border border-docs-border bg-docs-bg-elevated p-4">
        <dl className="grid gap-3 text-[12.5px] sm:grid-cols-2">
          <div>
            <dt className="font-bold uppercase tracking-wider text-docs-dim">
              OpenAPI
            </dt>
            <dd className="mt-0.5 font-mono text-docs-text">
              {catalog.openapi}
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-wider text-docs-dim">
              API version
            </dt>
            <dd className="mt-0.5 font-mono text-docs-text">
              {catalog.info.version}
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-wider text-docs-dim">
              Document source
            </dt>
            <dd className="mt-0.5 text-docs-text">
              {source === "live" ? "Live backend" : "Bundled snapshot"}
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-wider text-docs-dim">
              Document URL
            </dt>
            <dd className="mt-0.5 break-all font-mono text-docs-text">
              {specUrl}
            </dd>
          </div>
        </dl>
      </div>

      <ol className="space-y-4">
        {entries.map((entry) => (
          <li
            key={entry.version}
            className="relative rounded-xl border border-docs-border bg-docs-bg-elevated p-4 pl-5"
          >
            <span className="absolute left-0 top-4 h-[calc(100%-32px)] w-0.5 rounded bg-docs-green" />
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-mono text-[15px] font-bold text-docs-text">
                {entry.version}
              </h2>
              {entry.current ? (
                <span className="rounded-full border border-docs-green/40 bg-docs-green/10 px-2 py-0.5 text-[10.5px] font-bold text-docs-green">
                  Current
                </span>
              ) : null}
              <span className="text-[11.5px] text-docs-dim">{entry.date}</span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-docs-muted">
              {entry.description}
            </p>
            <Link
              href="/docs"
              className="mt-2 inline-block text-[12.5px] font-bold text-docs-green hover:underline"
            >
              Browse the reference
            </Link>
          </li>
        ))}
      </ol>
    </article>
  );
}
