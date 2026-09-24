"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { PageLoading } from "../components/PageLoading";

const AdminProvider = dynamic(
  () =>
    import("./AdminProvider").then((mod) => mod.AdminProvider),
  { ssr: false, loading: () => <PageLoading /> },
);

export function AdminShell({ children }: { children: ReactNode }) {
  return <AdminProvider>{children}</AdminProvider>;
}
