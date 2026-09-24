"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const SubscriptionsPage = dynamic(
  () =>
    import("@/src/admin/pages/SubscriptionsPage").then(
      (mod) => mod.SubscriptionsPage,
    ),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminSubscriptionsRoute() {
  return <SubscriptionsPage />;
}
