"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const LeaderboardPage = dynamic(
  () =>
    import("@/src/admin/pages/LeaderboardPage").then(
      (mod) => mod.LeaderboardPage,
    ),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminLeaderboardRoute() {
  return <LeaderboardPage />;
}
