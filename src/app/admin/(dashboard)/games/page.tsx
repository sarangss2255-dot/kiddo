"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const GamesPage = dynamic(
  () => import("@/src/admin/pages/GamesPage").then((mod) => mod.GamesPage),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminGamesRoute() {
  return <GamesPage />;
}
