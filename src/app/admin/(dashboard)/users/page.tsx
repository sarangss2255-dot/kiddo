"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const UsersPage = dynamic(
  () => import("@/src/admin/pages/UsersPage").then((mod) => mod.UsersPage),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminUsersRoute() {
  return <UsersPage />;
}
