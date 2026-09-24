"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const ReportsPage = dynamic(
  () => import("@/src/admin/pages/ReportsPage").then((mod) => mod.ReportsPage),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminReportsRoute() {
  return <ReportsPage />;
}
