"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const LoginPage = dynamic(
  () => import("@/src/admin/pages/LoginPage").then((mod) => mod.LoginPage),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminLoginRoute() {
  return <LoginPage />;
}
