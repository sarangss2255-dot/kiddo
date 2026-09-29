'use client';

import { ErrorFallback } from '@/src/components/ErrorBoundary';

export default function AdminError({
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
      title="Admin workspace error"
      description="The admin workspace hit an unexpected error. Retry the page or reload to continue."
    />
  );
}
