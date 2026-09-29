"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const SchoolsPage = dynamic(
  () => import("@/src/admin/pages/SchoolsPage").then((mod) => mod.SchoolsPage),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminSchoolsRoute() {
  return <SchoolsPage />;
}
