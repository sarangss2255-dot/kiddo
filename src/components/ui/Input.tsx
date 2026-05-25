import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        <input
          ref={ref}
          className={cn(
            'flex h-12 w-full rounded-2xl border border-brand-navy/10 bg-white px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-brand-orange focus:ring-brand-orange/20 focus:border-brand-orange',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-bold text-brand-orange ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
