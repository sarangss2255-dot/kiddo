"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/src/admin/layouts/DashboardLayout";
import { useAuth } from "@/src/admin/context/AuthContext";
import { PageLoading } from "@/src/components/PageLoading";

export default function AdminProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
    }
  }, [token, router]);

  if (!token) {
    return <PageLoading />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
