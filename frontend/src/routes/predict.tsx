import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { PredictPanel } from "@/components/prediction/PredictPanel";

export const Route = createFileRoute("/predict")({
  head: () => ({
    meta: [
      { title: "Predict — EmotionAI" },
      {
        name: "description",
        content: "Upload a face image and run the FER-2013 CNN. See each stage of the inference pipeline in real time.",
      },
      { property: "og:title", content: "Predict — EmotionAI" },
      { property: "og:description", content: "Run the FER-2013 CNN on your own images." },
    ],
  }),
  component: PredictPage,
});

function PredictPage() {
  return (
    <PageShell
      eyebrow="Live demo"
      title="Run a prediction"
      description="Upload an image of a face. The pipeline detects, crops, resizes to 48×48 grayscale, and runs a forward pass through the CNN. Every stage is real — no fabricated numbers."
    >
      <PredictPanel />
    </PageShell>
  );
}
