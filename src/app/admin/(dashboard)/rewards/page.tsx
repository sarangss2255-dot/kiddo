"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const RewardsPage = dynamic(
  () => import("@/src/admin/pages/RewardsPage").then((mod) => mod.RewardsPage),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminRewardsRoute() {
  return <RewardsPage />;
}
