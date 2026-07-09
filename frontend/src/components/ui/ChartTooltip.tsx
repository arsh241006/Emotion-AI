// components/ui/ChartTooltip.tsx
import { TooltipProps } from "recharts";

export function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="animate-tooltip-in"
      style={{
        backgroundColor: "#141416",
        border: "1px solid #2A2A2E",
        borderRadius: "10px",
        padding: "10px 12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
        minWidth: "140px",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "#6B6B70",
          marginBottom: "8px",
        }}
      >
        {label}
      </div>
      <div className="flex flex-col gap-1.5">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span style={{ fontSize: "11px", color: "#A1A1AA" }}>{entry.name}</span>
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                fontWeight: 500,
                fontVariantNumeric: "tabular-nums",
                color: "#F5F5F5",
              }}
            >
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}