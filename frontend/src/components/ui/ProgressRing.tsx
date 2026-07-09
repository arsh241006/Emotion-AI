import { cn } from "@/lib/utils";

interface Props {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  className?: string;
  label?: string;
}

export function ProgressRing({ value, size = 140, stroke = 8, className, label }: Props) {
  const percentage = Math.max(0, Math.min(100, value));
  const v = percentage / 100;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * v;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--color-border)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--color-accent)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          style={{ transition: "stroke-dasharray 700ms cubic-bezier(0.2,0.8,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="mono text-2xl text-text-primary tabular-nums">{percentage.toFixed(1)}%</span>
        {label && <span className="mt-0.5 text-[10px] uppercase tracking-widest text-text-tertiary">{label}</span>}
      </div>
    </div>
  );
}
