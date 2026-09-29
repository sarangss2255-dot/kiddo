'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback renderer. Receives the error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Optional heading shown by the default fallback. */
  title?: string;
  /** Optional supporting copy shown by the default fallback. */
  description?: string;
  /** Called after the boundary resets (e.g. to refetch data). */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/** Extracts a readable message from (possibly JSON-serialised) errors. */
export function errorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? '');
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.error) {
      const operation = parsed.operationType ? `${parsed.operationType} failed` : 'Operation failed';
      const path = parsed.path ? ` on ${parsed.path}` : '';
      return `${operation}${path}. ${parsed.error}`;
    }
  } catch {
    // Plain text error message.
  }
  return raw || 'Something went wrong.';
}

export function ErrorFallback({
  error,
  reset,
  title = 'Something went wrong',
  description = 'An unexpected error interrupted this page. You can retry or reload the app.',
  fullScreen = false,
}: {
  error: unknown;
  reset?: () => void;
  title?: string;
  description?: string;
  fullScreen?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center p-6',
        fullScreen ? 'min-h-screen bg-kiddo-warm' : 'min-h-[60vh]',
      )}
      role="alert"
    >
      <div className="w-full max-w-md rounded-3xl border border-kiddo-navy/10 bg-white p-8 text-center shadow-xl shadow-kiddo-navy/5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-kiddo-orange/15 text-kiddo-orange">
          <AlertTriangle size={26} />
        </div>
        <h2 className="mt-5 text-xl font-extrabold tracking-tight text-kiddo-navy">{title}</h2>
        <p className="mt-2 text-sm font-medium leading-relaxed text-kiddo-muted">{description}</p>
        <p className="mt-4 max-h-32 overflow-auto rounded-xl bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-500 break-words">
          {errorMessage(error)}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          {reset ? (
            <Button type="button" onClick={reset} className="flex-1">
              Try again
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            onClick={() => window.location.reload()}
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * React error boundary for client component subtrees. Route-level safety nets
 * live in `app/error.tsx`, `app/global-error.tsx` and `app/admin/error.tsx`.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback(error, this.reset);
    }

    return (
      <ErrorFallback
        error={error}
        reset={this.reset}
        title={this.props.title}
        description={this.props.description}
      />
    );
  }
}
