"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const ParentsPage = dynamic(
  () => import("@/src/admin/pages/ParentsPage").then((mod) => mod.ParentsPage),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminParentsRoute() {
  return <ParentsPage />;
}
