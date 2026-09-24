"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const TasksPage = dynamic(
  () => import("@/src/admin/pages/TasksPage").then((mod) => mod.TasksPage),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminMissionsRoute() {
  return <TasksPage />;
}
