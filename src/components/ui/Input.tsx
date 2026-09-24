import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-kiddo-blue disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-kiddo-orange focus-visible:ring-kiddo-orange/30",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-bold text-kiddo-orange ml-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
