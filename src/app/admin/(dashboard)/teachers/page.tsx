"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const TeachersPage = dynamic(
  () =>
    import("@/src/admin/pages/TeachersPage").then((mod) => mod.TeachersPage),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminTeachersRoute() {
  return <TeachersPage />;
}
