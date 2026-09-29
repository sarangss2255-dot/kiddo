import type { ReactNode } from 'react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { cn } from '@/src/lib/utils';

export type MetricAccent = 'blue' | 'orange' | 'green' | 'sky' | 'navy';

const accentStyles: Record<MetricAccent, { icon: string; bar: string }> = {
  blue: { icon: 'bg-kiddo-blue/15 text-kiddo-blue', bar: 'bg-kiddo-blue' },
  orange: { icon: 'bg-kiddo-orange/15 text-kiddo-orange', bar: 'bg-kiddo-orange' },
  green: { icon: 'bg-kiddo-green/15 text-kiddo-green', bar: 'bg-kiddo-green' },
  sky: { icon: 'bg-kiddo-sky/20 text-kiddo-navy', bar: 'bg-kiddo-sky' },
  navy: { icon: 'bg-kiddo-navy/10 text-kiddo-navy', bar: 'bg-kiddo-navy' },
};

function formatValue(value: string | number) {
  return typeof value === 'number' ? value.toLocaleString() : value;
}

export function MetricCard({
  label,
  value,
  hint,
  icon,
  accent = 'blue',
  loading = false,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: ReactNode;
  accent?: MetricAccent;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card className="h-full border border-kiddo-navy/5 bg-white shadow-sm">
        <CardContent className="flex items-start gap-4 p-5 sm:p-6">
          <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
          <div className="w-full space-y-2.5 pt-0.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-36" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const tones = accentStyles[accent];

  return (
    <Card className="group relative h-full overflow-hidden border border-kiddo-navy/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-kiddo-navy/10 hover:shadow-lg hover:shadow-kiddo-navy/5">
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-4 left-0 w-0.5 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          tones.bar,
        )}
      />
      <CardContent className="flex items-start gap-4 p-5 sm:p-6">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
            tones.icon,
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 space-y-1">
          <span className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-kiddo-muted">
            {label}
          </span>
          <p className="font-display text-3xl font-extrabold leading-none tracking-tight text-kiddo-navy">
            {formatValue(value)}
          </p>
          <p className="text-xs font-medium leading-relaxed text-kiddo-muted">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}
