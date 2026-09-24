"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { json } from "@codemirror/lang-json";
import { cn } from "@/src/lib/utils";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

export function JsonEditor({
  value,
  onChange,
  readOnly = false,
  height = "220px",
  className,
  label,
}: {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  className?: string;
  label?: string;
}) {
  const { resolvedTheme } = useTheme();
  const extensions = useMemo(() => [json()], []);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-docs-border bg-docs-code text-[12.5px]",
        className,
      )}
      aria-label={label}
    >
      <CodeMirror
        value={value}
        height={height}
        theme={resolvedTheme === "light" ? "light" : "dark"}
        extensions={extensions}
        editable={!readOnly}
        readOnly={readOnly}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          autocompletion: false,
          highlightActiveLine: !readOnly,
          highlightActiveLineGutter: !readOnly,
          bracketMatching: true,
        }}
      />
    </div>
  );
}
