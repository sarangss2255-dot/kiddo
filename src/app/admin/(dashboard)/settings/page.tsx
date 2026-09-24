"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const SettingsPage = dynamic(
  () =>
    import("@/src/admin/pages/SettingsPage").then((mod) => mod.SettingsPage),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminSettingsRoute() {
  return <SettingsPage />;
}
