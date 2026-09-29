import { AlertTriangle } from 'lucide-react';

/**
 * Inline error banner for admin data loads. Rendered instead of pretending an
 * outage is an empty dataset.
 */
export function DataError({
  message,
  onRetry,
}: {
  message?: string | null;
  onRetry?: () => void;
}) {
  if (!message) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
      <AlertTriangle size={16} className="shrink-0" />
      <span className="flex-1">{message}</span>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-rose-300 px-3 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
