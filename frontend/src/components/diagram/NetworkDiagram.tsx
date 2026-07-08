import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DiagramNode {
  id: string;
  label: string;
  sub?: string;
  x: number; // 0..100 (percent inside the svg viewbox)
  y: number; // 0..100
}

export interface DiagramEdge {
  from: string;
  to: string;
}

interface Props {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  activeIndex?: number; // which node in `nodes` order is active (lit)
  onHover?: (id: string | null) => void;
  hoveredId?: string | null;
  height?: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * Directional node-and-line diagram, grayscale idle, accent on active path.
 * - Never a symmetric grid: caller supplies intentional x/y coordinates.
 * - Bounded to its container.
 * - Animates only on real state changes (activeIndex / hover).
 */
export function NetworkDiagram({
  nodes,
  edges,
  activeIndex = -1,
  onHover,
  hoveredId,
  height = 220,
  className,
  ariaLabel = "Pipeline diagram",
}: Props) {
  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const activeId = activeIndex >= 0 ? nodes[activeIndex]?.id : undefined;
  const activeSet = new Set<string>();
  if (activeIndex >= 0) {
    for (let i = 0; i <= activeIndex; i++) activeSet.add(nodes[i].id);
  }

  return (
    <div className={cn("relative w-full", className)} style={{ height }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {edges.map((e, i) => {
          const a = nodeById[e.from];
          const b = nodeById[e.to];
          if (!a || !b) return null;
          const lit = activeSet.has(e.from) && activeSet.has(e.to);
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={lit ? "var(--color-accent)" : "var(--color-border-strong)"}
              strokeWidth={lit ? 0.5 : 0.25}
              vectorEffect="non-scaling-stroke"
              style={{ transition: "stroke 400ms ease" }}
            />
          );
        })}
      </svg>

      {nodes.map((n, i) => {
        const isActive = n.id === activeId;
        const isPast = activeSet.has(n.id) && !isActive;
        const isHover = hoveredId === n.id;
        return (
          <motion.button
            key={n.id}
            type="button"
            onMouseEnter={() => onHover?.(n.id)}
            onMouseLeave={() => onHover?.(null)}
            onFocus={() => onHover?.(n.id)}
            onBlur={() => onHover?.(null)}
            initial={false}
            animate={{ scale: isActive ? 1.06 : 1 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 select-none rounded-md border px-2.5 py-1.5 text-left text-[10px] leading-tight transition-colors",
              "focus:outline-none focus-visible:ring-1 focus-visible:ring-accent",
              isActive
                ? "border-accent bg-accent-dim text-text-primary"
                : isPast
                ? "border-border-strong bg-surface-raised text-text-primary"
                : "border-border bg-surface text-text-secondary",
              isHover && "border-borderStrong"
            )}
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              boxShadow: isActive ? "0 0 0 1px var(--color-accent), 0 0 12px -2px var(--color-accent)" : undefined,
            }}
          >
            <div className="mono font-medium">{n.label}</div>
            {n.sub && <div className="text-[9px] text-text-tertiary">{n.sub}</div>}
          </motion.button>
        );
      })}
    </div>
  );
}
