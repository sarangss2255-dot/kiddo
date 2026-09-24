"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

export function AdminProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Toaster richColors position="top-right" theme="light" />
      {children}
    </AuthProvider>
  );
}
