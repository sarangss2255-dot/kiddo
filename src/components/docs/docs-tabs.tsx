"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

const TabsContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

export function Tabs({
  className,
  defaultValue,
  value,
  onValueChange,
  children,
}: React.HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  const [localValue, setLocalValue] = React.useState(value ?? defaultValue);

  React.useEffect(() => {
    if (value !== undefined) setLocalValue(value);
  }, [value]);

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) setLocalValue(nextValue);
      onValueChange?.(nextValue);
    },
    [value, onValueChange],
  );

  return (
    <TabsContext.Provider
      value={{ value: localValue, onValueChange: handleValueChange }}
    >
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-docs-border bg-docs-card-nested p-0.5",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  value,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => onValueChange?.(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-[11.5px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-docs-green",
        isSelected
          ? "bg-docs-card text-docs-text shadow-sm"
          : "text-docs-muted hover:text-docs-text",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  value,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const { value: selectedValue } = React.useContext(TabsContext);
  if (selectedValue !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn("mt-2.5 focus-visible:outline-none", className)}
      {...props}
    >
      {children}
    </div>
  );
}
