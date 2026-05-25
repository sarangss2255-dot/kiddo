import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'premium' | 'glass' | 'outline';
}

export const Card = ({ className, variant = 'premium', children, ...props }: CardProps) => {
  const variants = {
    premium: 'bg-white border border-brand-navy/5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300',
    glass: 'bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl',
    outline: 'border border-brand-navy/10 rounded-3xl',
  };

  return (
    <div className={cn(variants[variant], 'p-6', className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('font-kids text-xl font-bold leading-none', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-brand-muted', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('pt-0', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center pt-4 border-t border-brand-navy/5', className)} {...props}>
    {children}
  </div>
);
