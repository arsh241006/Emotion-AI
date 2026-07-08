import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, hint, className }: Props) {
  return (
    <div className={cn("surface-card p-5", className)}>
      <div className="text-[10px] uppercase tracking-[0.16em] text-text-tertiary">{label}</div>
      <div className="mt-2 mono text-2xl text-text-primary tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-text-secondary">{hint}</div>}
    </div>
  );
}
