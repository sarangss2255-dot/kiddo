'use client';

import { ErrorFallback } from '@/src/components/ErrorBoundary';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      fullScreen
      title="Something went wrong"
      description="An unexpected error interrupted this page. You can try again or reload the app."
    />
  );
}
