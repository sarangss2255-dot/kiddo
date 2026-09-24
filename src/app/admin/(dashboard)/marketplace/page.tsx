"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const RewardStorePage = dynamic(
  () =>
    import("@/src/admin/pages/RewardStorePage").then(
      (mod) => mod.RewardStorePage,
    ),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminMarketplaceRoute() {
  return <RewardStorePage />;
}
