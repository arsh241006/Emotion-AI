import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { EMOTION_META, EMOTIONS, MODEL_STATS } from "@/config/modelStats";
import { StatCard } from "@/components/ui/StatCard";

export const Route = createFileRoute("/dataset")({
  head: () => ({
    meta: [
      { title: "Dataset — EmotionAI" },
      { name: "description", content: "FER-2013: 35,887 labeled 48×48 grayscale faces across 7 emotion classes." },
      { property: "og:title", content: "Dataset — EmotionAI" },
      { property: "og:description", content: "FER-2013 explorer." },
    ],
  }),
  component: DatasetPage,
});

function DatasetPage() {
  return (
    <PageShell
      eyebrow="Dataset"
      title="FER-2013"
      description="A public benchmark of 48×48 grayscale facial images introduced for the ICML 2013 Representation Learning challenge. Each image is labeled with one of seven emotion categories."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Images" value={MODEL_STATS.datasetSize.toLocaleString()} />
        <StatCard label="Resolution" value={`${MODEL_STATS.imageSize}×${MODEL_STATS.imageSize}`} hint="grayscale" />
        <StatCard label="Classes" value={MODEL_STATS.classes} />
        <StatCard label="Source" value="Kaggle · ICML 2013" />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {EMOTIONS.map((e) => {
          const m = EMOTION_META[e];
          const pct = m.count ? (m.count / MODEL_STATS.datasetSize) * 100 : 0;
          return (
            <div key={e} className="surface-card group relative overflow-hidden p-5 transition-colors hover:border-border-strong">
              <div className="flex items-center justify-between">
                <span className="text-3xl" aria-hidden="true">{m.emoji}</span>
                <span className="h-2 w-2 rounded-full" style={{ background: m.color }} aria-hidden="true" />
              </div>
              <div className="mt-4 text-sm text-text-primary">{m.label}</div>
              <div className="mono mt-3 flex items-baseline justify-between text-xs">
                <span className="text-text-primary tabular-nums">{m.count?.toLocaleString()}</span>
                <span className="text-text-tertiary tabular-nums">{pct.toFixed(1)}%</span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-raised">
                <div
                  className="h-full"
                  style={{ width: `${pct}%`, background: m.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="surface-card mt-8 p-6">
        <div className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
          Notes on the distribution
        </div>
        <p className="max-w-3xl text-sm text-text-secondary">
          FER-2013 is heavily imbalanced — <span className="text-text-primary">Happy</span> and{" "}
          <span className="text-text-primary">Neutral</span> dominate while{" "}
          <span className="text-text-primary">Disgust</span> accounts for less than 2% of samples.
          Per-class accuracy on the Model page reflects this imbalance directly.
        </p>
      </div>
    </PageShell>
  );
}
