import { AuthPage } from "@/src/site/pages/app/AuthPage";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";

export default async function AuthRoute({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const initialMode = params.mode === "signup" ? "signup" : "login";

  return (
    <ErrorBoundary
      title="Sign-in error"
      description="The login page hit an unexpected error. Retry or reload to continue."
    >
      <AuthPage initialMode={initialMode} />
    </ErrorBoundary>
  );
}
