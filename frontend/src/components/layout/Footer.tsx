import { MODEL_STATS } from "@/config/modelStats";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-xs text-text-tertiary md:flex-row md:items-center md:justify-between">
        <div className="mono">
          EmotionAI — CNN on {MODEL_STATS.dataset} ({MODEL_STATS.datasetSize.toLocaleString()} images, {MODEL_STATS.classes} classes)
        </div>
        <div className="mono">val_acc {MODEL_STATS.accuracy}% · built for research</div>
      </div>
    </footer>
  );
}
