"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return <AppShell pathname={pathname}>{children}</AppShell>;
}
