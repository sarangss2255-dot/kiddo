import { getCatalog } from "@/src/lib/openapi/catalog";
import { DocsLayout } from "@/src/components/docs/docs-layout";

export default async function DocsGroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { catalog, source } = await getCatalog();

  return (
    <DocsLayout catalog={catalog} source={source}>
      {children}
    </DocsLayout>
  );
}
