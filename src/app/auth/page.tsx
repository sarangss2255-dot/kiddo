import { AuthPage } from "@/src/site/pages/app/AuthPage";

export default async function AuthRoute({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const initialMode = params.mode === "signup" ? "signup" : "login";

  return <AuthPage initialMode={initialMode} />;
}
