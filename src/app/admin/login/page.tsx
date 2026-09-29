"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";

const LoginPage = dynamic(
  () => import("@/src/admin/pages/LoginPage").then((mod) => mod.LoginPage),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminLoginRoute() {
  return (
    <ErrorBoundary
      title="Admin sign-in error"
      description="The admin login page hit an unexpected error. Retry or reload to continue."
    >
      <LoginPage />
    </ErrorBoundary>
  );
}
