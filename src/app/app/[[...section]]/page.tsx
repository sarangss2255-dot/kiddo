"use client";

import dynamic from "next/dynamic";
import { PageLoading } from "@/src/components/PageLoading";

const KiddoApp = dynamic(
  () => import("@/src/site/pages/app/KiddoApp").then((mod) => mod.KiddoApp),
  { ssr: false, loading: () => <PageLoading /> },
);

export default function KiddoAppRoute() {
  return <KiddoApp />;
}
