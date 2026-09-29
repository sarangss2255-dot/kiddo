'use client';

import { ErrorFallback } from '@/src/components/ErrorBoundary';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorFallback
          error={error}
          reset={reset}
          fullScreen
          title="Application error"
          description="KidDo hit an unexpected problem. Retry, and if it keeps happening reload the page."
        />
      </body>
    </html>
  );
}
