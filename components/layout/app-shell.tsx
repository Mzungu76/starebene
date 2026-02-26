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
  { href: "/app/settings", label: "Impostazioni", icon: Settings },
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
      <div className="mx-auto flex max-w-6xl gap-6 px-4 pb-24 pt-6 md:pb-6">
        <aside className="hidden w-60 shrink-0 rounded-2xl border border-border/80 bg-card/90 p-4 md:block">
          <p className="mb-5 px-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Stare Bene</p>
          <nav className="space-y-1.5">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                  pathname === href && "bg-muted text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <div className="mb-4 rounded-xl border border-border/80 bg-card/70 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Dashboard tecnica · mobile first
          </div>
          <main>{children}</main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 border-t border-border/80 bg-card/95 backdrop-blur md:hidden">
        <ul className="grid grid-cols-5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 text-[11px] text-muted-foreground",
                  pathname === href && "text-primary",
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
