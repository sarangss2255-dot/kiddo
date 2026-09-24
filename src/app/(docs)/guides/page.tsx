import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Database, KeyRound, Layers, ScrollText } from "lucide-react";
import { getCatalog } from "@/src/lib/openapi/catalog";

export const metadata: Metadata = {
  title: "Guides",
  description: "Guides for integrating with the KidDo API.",
};

export default async function GuidesPage() {
  const { catalog } = await getCatalog();

  const guides = [
    {
      title: "Quick Start",
      description:
        "Authenticate, obtain a token and make your first request in four steps.",
      href: "/docs/quick-start",
      icon: BookOpen,
    },
    {
      title: "Authentication",
      description:
        "JWT bearer tokens, the Authorization header and token handling guidance.",
      href: "/docs/authentication",
      icon: KeyRound,
    },
    {
      title: "API Reference",
      description: `${catalog.operationCount} operations across ${catalog.tags.length} sections, generated from OpenAPI tags.`,
      href: "/docs",
      icon: Layers,
    },
    {
      title: "Data Models",
      description: `${Object.keys(catalog.schemas).length} schemas with generated examples.`,
      href: "/docs/schemas",
      icon: Database,
    },
    {
      title: "Changelog",
      description: "API version history and specification updates.",
      href: "/changelog",
      icon: ScrollText,
    },
  ];

  return (
    <article className="max-w-4xl space-y-6">
      <header>
        <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-docs-green">
          Developer Docs
        </p>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-docs-text">
          Guides
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-docs-muted">
          Everything you need to integrate with the {catalog.info.title}.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {guides.map((guide) => {
          const Icon = guide.icon;
          return (
            <Link
              key={guide.href}
              href={guide.href}
              className="group rounded-xl border border-docs-border bg-docs-bg-elevated p-4 transition-colors hover:border-docs-border-strong"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-docs-green/30 bg-docs-green/10 text-docs-green">
                <Icon className="h-4 w-4" />
              </span>
              <h2 className="mt-3 text-[15px] font-bold text-docs-text transition-colors group-hover:text-docs-green">
                {guide.title}
              </h2>
              <p className="mt-1 text-[12.5px] leading-relaxed text-docs-muted">
                {guide.description}
              </p>
            </Link>
          );
        })}
      </div>
    </article>
  );
}
