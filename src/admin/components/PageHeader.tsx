import type { ReactNode } from 'react';
import { Badge } from '../../components/ui/Badge';

export function PageHeader({
  title,
  description,
  eyebrow = 'Control Center',
  action,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <Badge
          variant="accent"
          className="rounded-full border-none bg-kiddo-orange/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-kiddo-orange"
        >
          {eyebrow}
        </Badge>
        <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-kiddo-navy md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm font-medium text-kiddo-muted md:text-base">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
