"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const AvatarsPage = dynamic(
  () => import("@/src/admin/pages/AvatarsPage").then((mod) => mod.AvatarsPage),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function AdminAvatarsRoute() {
  return <AvatarsPage />;
}
