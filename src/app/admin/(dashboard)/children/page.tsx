"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const ChildrenPage = dynamic(
  () =>
    import("@/src/admin/pages/ChildrenPage").then((mod) => mod.ChildrenPage),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminChildrenRoute() {
  return <ChildrenPage />;
}
