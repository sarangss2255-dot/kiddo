"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const DashboardPage = dynamic(
  () =>
    import("@/src/admin/pages/DashboardPage").then((mod) => mod.DashboardPage),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminDashboardRoute() {
  return <DashboardPage />;
}
