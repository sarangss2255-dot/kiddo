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
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <Badge variant="accent" className="px-3 py-1 mb-2 font-bold bg-amber-100 text-amber-800 border-none rounded-full">
          {eyebrow}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800">{title}</h1>
        {description && <p className="text-base text-slate-500 mt-2 font-medium">{description}</p>}
      </div>
      {action}
    </div>
  );
}
