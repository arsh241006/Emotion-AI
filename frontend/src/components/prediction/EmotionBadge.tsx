import type { Emotion } from "@/config/modelStats";
import { EMOTION_META } from "@/config/modelStats";
import { cn } from "@/lib/utils";

interface Props {
  emotion: Emotion;
  className?: string;
  size?: "sm" | "md";
}

export function EmotionBadge({ emotion, className, size = "sm" }: Props) {
  const meta = EMOTION_META[emotion];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-raised",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className
      )}
      aria-label={`Emotion: ${meta.label}`}
    >
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: meta.color }}
      />
      <span aria-hidden="true">{meta.emoji}</span>
      <span className="text-text-primary">{meta.label}</span>
    </span>
  );
}
