import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { NetworkDiagram, type DiagramNode } from "@/components/diagram/NetworkDiagram";
import { classificationReport, trainingCurves } from "@/data/mockDashboard";
import { EMOTION_META, type Emotion } from "@/config/modelStats";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/model")({
  head: () => ({
    meta: [
      { title: "Model — EmotionAI" },
      { name: "description", content: "Architecture, training curves, and per-class metrics for the FER-2013 CNN." },
      { property: "og:title", content: "Model — EmotionAI" },
      { property: "og:description", content: "CNN architecture and training metrics." },
    ],
  }),
  component: ModelPage,
});

interface Layer extends DiagramNode {
  type: string;
  outputShape: string;
  activation?: string;
  params?: string;
}

const LAYERS: Layer[] = [
  { id: "in",    label: "Input",    sub: "48×48×1",     x: 4,  y: 50, type: "Input",   outputShape: "(48, 48, 1)" },
  { id: "c1",    label: "Conv2D",   sub: "32 · 3×3",    x: 17, y: 30, type: "Conv2D",  outputShape: "(46, 46, 32)",  activation: "ReLU", params: "320" },
  { id: "p1",    label: "MaxPool",  sub: "2×2",          x: 28, y: 62, type: "MaxPool2D", outputShape: "(23, 23, 32)" },
  { id: "c2",    label: "Conv2D",   sub: "64 · 3×3",    x: 41, y: 30, type: "Conv2D",  outputShape: "(21, 21, 64)",  activation: "ReLU", params: "18,496" },
  { id: "p2",    label: "MaxPool",  sub: "2×2",          x: 52, y: 60, type: "MaxPool2D", outputShape: "(10, 10, 64)" },
  { id: "c3",    label: "Conv2D",   sub: "128 · 3×3",   x: 64, y: 28, type: "Conv2D",  outputShape: "(8, 8, 128)",   activation: "ReLU", params: "73,856" },
  { id: "fl",    label: "Flatten",  sub: "8192",         x: 76, y: 58, type: "Flatten", outputShape: "(8192,)" },
  { id: "d1",    label: "Dense",    sub: "128",          x: 86, y: 30, type: "Dense",   outputShape: "(128,)",         activation: "ReLU", params: "1,048,704" },
  { id: "drop",  label: "Dropout",  sub: "0.5",          x: 92, y: 60, type: "Dropout", outputShape: "(128,)" },
  { id: "out",   label: "Output",   sub: "7",            x: 97, y: 40, type: "Dense",   outputShape: "(7,)",           activation: "Softmax", params: "903" },
];
const EDGES = LAYERS.slice(0, -1).map((n, i) => ({ from: n.id, to: LAYERS[i + 1].id }));

const AXIS = { stroke: "#3A3A3F", fontSize: 10 };
const tooltipStyle = {
  background: "#141416",
  border: "1px solid #2A2A2E",
  borderRadius: 6,
  fontSize: 11,
  color: "#F5F5F5",
} as const;

function ModelPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const layer = LAYERS.find((l) => l.id === hovered);

  return (
    <PageShell
      eyebrow="Model"
      title="CNN architecture"
      description="A scratch convolutional network trained end-to-end on FER-2013. Hover a layer to inspect its output shape and activation."
    >
      <div className="surface-card p-6">
        <div className="mono mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
          <span>Forward pass · left → right</span>
          <span>{layer ? layer.type : "hover a layer"}</span>
        </div>
        <NetworkDiagram
          nodes={LAYERS}
          edges={EDGES}
          hoveredId={hovered}
          onHover={setHovered}
          height={260}
          ariaLabel="CNN architecture: input, three Conv+Pool blocks, flatten, dense, dropout, output softmax over 7 classes"
        />
        <div className="mt-6 grid gap-4 border-t border-border pt-4 md:grid-cols-4">
          <Field label="Layer" value={layer?.type ?? "—"} />
          <Field label="Output shape" value={layer?.outputShape ?? "—"} />
          <Field label="Activation" value={layer?.activation ?? "—"} />
          <Field label="Parameters" value={layer?.params ?? "—"} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Training vs. validation accuracy">
          <LineChart data={trainingCurves}>
            <CartesianGrid stroke="#2A2A2E" vertical={false} />
            <XAxis dataKey="epoch" {...AXIS} />
            <YAxis domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} {...AXIS} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="trainAcc" stroke="#F5F5F5" dot={false} strokeWidth={1.5} name="train" />
            <Line type="monotone" dataKey="valAcc" stroke="#FF6A1A" dot={false} strokeWidth={1.5} name="val" />
          </LineChart>
        </ChartCard>
        <ChartCard title="Training vs. validation loss">
          <LineChart data={trainingCurves}>
            <CartesianGrid stroke="#2A2A2E" vertical={false} />
            <XAxis dataKey="epoch" {...AXIS} />
            <YAxis {...AXIS} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="trainLoss" stroke="#F5F5F5" dot={false} strokeWidth={1.5} name="train" />
            <Line type="monotone" dataKey="valLoss" stroke="#FF6A1A" dot={false} strokeWidth={1.5} name="val" />
          </LineChart>
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="surface-card p-6">
          <div className="mono mb-4 text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
            Confusion matrix
          </div>
          <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border-strong bg-surface-raised">
            {/* Load a real /assets/confusion_matrix.png produced at training time. */}
            <div className="p-6 text-center">
              <div className="mono text-[10px] uppercase tracking-widest text-text-tertiary">
                image not provided
              </div>
              <p className="mt-2 max-w-xs text-xs text-text-secondary">
                Drop <code className="mono">public/assets/confusion_matrix.png</code> from your training
                run and it will render here. Live-heatmap values aren&apos;t exposed by the API.
              </p>
            </div>
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="mono mb-4 text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
            Classification report
          </div>
          <table className="w-full text-left text-xs">
            <thead className="mono text-[10px] uppercase tracking-widest text-text-tertiary">
              <tr>
                <th className="py-2 font-normal">Class</th>
                <th className="py-2 font-normal">Precision</th>
                <th className="py-2 font-normal">Recall</th>
                <th className="py-2 font-normal">F1</th>
                <th className="py-2 font-normal">Support</th>
              </tr>
            </thead>
            <tbody className="mono">
              {classificationReport.map((r) => (
                <tr key={r.emotion} className="border-t border-border">
                  <td className="py-2">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: EMOTION_META[r.emotion as Emotion].color }} />
                      {EMOTION_META[r.emotion as Emotion].label}
                    </span>
                  </td>
                  <td className="py-2 tabular-nums text-text-primary">{r.precision.toFixed(2)}</td>
                  <td className="py-2 tabular-nums text-text-primary">{r.recall.toFixed(2)}</td>
                  <td className="py-2 tabular-nums text-text-primary">{r.f1.toFixed(2)}</td>
                  <td className="py-2 tabular-nums text-text-tertiary">{r.support}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mono mt-4 text-[10px] uppercase tracking-widest text-text-tertiary">
            values above are illustrative — replace with real report from training
          </p>
        </div>
      </div>
    </PageShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mono text-[10px] uppercase tracking-widest text-text-tertiary">{label}</div>
      <div className="mono mt-1 text-sm text-text-primary">{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="surface-card p-6">
      <div className="mono mb-4 text-[10px] uppercase tracking-[0.2em] text-text-tertiary">{title}</div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </div>
  );
}
