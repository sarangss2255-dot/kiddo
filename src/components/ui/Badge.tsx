import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'info';
}

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
  const variants = {
    default: 'bg-brand-navy/10 text-brand-navy',
    accent: 'bg-brand-orange/10 text-brand-orange',
    success: 'bg-brand-mint/10 text-brand-mint',
    warning: 'bg-brand-yellow/10 text-brand-yellow',
    info: 'bg-brand-blue/10 text-brand-blue',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
