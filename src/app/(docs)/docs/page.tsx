import type { Metadata } from "next";
import { getCatalog } from "@/src/lib/openapi/catalog";
import { ApiOverview } from "@/src/components/docs/api-overview";

export const metadata: Metadata = {
  title: "API Reference",
  description:
    "KidDo REST API reference, generated from the OpenAPI specification.",
};

export default async function DocsOverviewPage() {
  const { catalog, spec } = await getCatalog();
  return <ApiOverview catalog={catalog} spec={spec} />;
}
