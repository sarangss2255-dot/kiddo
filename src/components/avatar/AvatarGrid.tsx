'use client';

import { AVATARS } from '@/src/lib/avatars';
import { cn } from '@/src/lib/utils';

type AvatarGridProps = {
  value: string;
  onChange: (emoji: string) => void;
  className?: string;
};

export function AvatarGrid({ value, onChange, className }: AvatarGridProps) {
  return (
    <div className={cn('grid grid-cols-4 gap-3 sm:grid-cols-8', className)}>
      {AVATARS.map((avatar) => {
        const selected = value === avatar.emoji;
        return (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onChange(avatar.emoji)}
            aria-pressed={selected}
            aria-label={avatar.label}
            className={cn(
              'flex aspect-square items-center justify-center rounded-2xl border-2 text-2xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected
                ? 'scale-105 border-brand-orange bg-brand-orange/10 shadow-sm'
                : 'border-brand-navy/5 bg-white hover:border-brand-navy/15',
            )}
          >
            <span aria-hidden>{avatar.emoji}</span>
          </button>
        );
      })}
    </div>
  );
}
