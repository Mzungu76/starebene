import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card/95 p-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}
