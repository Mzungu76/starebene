import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import { Home, ListChecks, Salad, Settings, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  href: Route;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: Home },
  { href: "/app/check-in", label: "Check-in", icon: ListChecks },
  { href: "/app/plan", label: "Piano", icon: Salad },
  { href: "/app/today", label: "Oggi", icon: Sparkles },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname: string;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl gap-6 px-4 pb-20 pt-6 md:pb-6">
        <aside className="hidden w-56 shrink-0 rounded-xl border border-border bg-card p-3 md:block">
          <p className="mb-4 px-2 text-sm font-semibold text-muted-foreground">Stare Bene</p>
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted",
                  pathname === href && "bg-muted font-medium",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 border-t border-border bg-card md:hidden">
        <ul className="grid grid-cols-5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 text-xs text-muted-foreground",
                  pathname === href && "text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
