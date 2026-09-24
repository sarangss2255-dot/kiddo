import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalog } from "@/src/lib/openapi/catalog";
import { findOperation, findTag } from "@/src/lib/openapi/parser";
import { ApiSection } from "@/src/components/docs/api-section";
import { EndpointDetails } from "@/src/components/docs/endpoint-details";

interface DocsSlugPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({
  params,
}: DocsSlugPageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const { catalog } = await getCatalog();

  if (slug.length === 1) {
    const tag = findTag(catalog, slug[0]);
    if (tag) {
      return {
        title: `${tag.name} API`,
        description: tag.description ?? `${tag.name} endpoints.`,
      };
    }
  }

  if (slug.length === 2) {
    const operation = findOperation(catalog, slug[0], slug[1]);
    if (operation) {
      return {
        title: `${operation.method.toUpperCase()} ${operation.path}`,
        description: operation.summary,
      };
    }
  }

  return { title: "API Reference" };
}

export default async function DocsSlugPage({ params }: DocsSlugPageProps) {
  const { slug = [] } = await params;
  const { catalog, spec } = await getCatalog();

  if (slug.length === 1) {
    const tag = findTag(catalog, slug[0]);
    if (!tag) notFound();
    return <ApiSection tag={tag} globalSecurity={catalog.security} />;
  }

  if (slug.length === 2) {
    const operation = findOperation(catalog, slug[0], slug[1]);
    if (!operation) notFound();
    return (
      <EndpointDetails
        key={operation.id}
        operation={operation}
        spec={spec}
      />
    );
  }

  notFound();
}
