import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        navy: "border-transparent bg-kiddo-navy text-white hover:bg-kiddo-navy/90",
        outline: "border-border bg-background text-foreground",
        mint: "border-transparent bg-kiddo-green/15 text-kiddo-green",
        orange: "border-transparent bg-kiddo-orange/15 text-kiddo-orange",
        sky: "border-transparent bg-kiddo-sky/20 text-kiddo-blue",
        info: "border-transparent bg-kiddo-sky/20 text-kiddo-blue",
        accent: "border-transparent bg-kiddo-orange/15 text-kiddo-orange",
        success: "border-transparent bg-kiddo-green/15 text-kiddo-green",
        warning: "border-transparent bg-kiddo-orange/15 text-kiddo-orange",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  className?: string;
  children?: React.ReactNode;
  key?: any;
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
