import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { StatCard } from "@/components/ui/StatCard";
import { CountUp } from "@/components/ui/CountUp";
import { EMOTION_META, EMOTIONS, MODEL_STATS, type Emotion } from "@/config/modelStats";
import { perClassAccuracy, trainingCurves } from "@/data/mockDashboard";
import { usePredictionStore } from "@/store/predictionStore";
import { EmotionBadge } from "@/components/prediction/EmotionBadge";
import { ProgressRing } from "@/components/ui/ProgressRing";


export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — EmotionAI" },
      { name: "description", content: "Live model status, training curves, per-class accuracy, and prediction history." },
      { property: "og:title", content: "Dashboard — EmotionAI" },
      { property: "og:description", content: "Live model status and prediction history." },
    ],
  }),
  component: DashboardPage,
});

const AXIS = { stroke: "#3A3A3F", fontSize: 10 };

function DashboardPage() {
  const current = usePredictionStore((s) => s.current);
  const history = usePredictionStore((s) => s.history);

  const distribution = useMemo(() => {
    const counts: Record<Emotion, number> = Object.fromEntries(EMOTIONS.map((e) => [e, 0])) as Record<Emotion, number>;
    history.forEach((h) => { counts[h.emotion]++; });
    return EMOTIONS.map((e) => ({ emotion: e, count: counts[e], fill: EMOTION_META[e].color }))
      .filter((d) => d.count > 0);
  }, [history]);

  const avgConfidence = history.length
    ? history.reduce((a, h) => a + h.confidence, 0) / history.length
    : 0;

  return (
    <PageShell
      eyebrow="Dashboard"
      title="Model at a glance"
      description="Live status, training performance, and every prediction you&apos;ve run this session."
    >
      {/* Top stat row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Model status"
          value={
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              {MODEL_STATS.status}
            </span>
          }
        />
        <StatCard
          label="Val accuracy"
          value={<CountUp end={MODEL_STATS.accuracy} decimals={1} suffix="%" />}
          hint={`on ${MODEL_STATS.dataset}`}
        />
        <StatCard
          label="Inference time"
          value={
            MODEL_STATS.inferenceMs !== null
              ? <CountUp end={MODEL_STATS.inferenceMs} suffix="ms" />
              : <span className="text-text-tertiary text-sm">not measured</span>
          }
          hint={MODEL_STATS.inferenceMs === null ? "measure and set in modelStats.ts" : undefined}
        />
        <StatCard
          label="Images processed"
          value={<CountUp end={history.length} />}
          hint="this session"
        />
        <StatCard label="Compute" value={<span className="text-lg">{MODEL_STATS.compute}</span>} />
      </div>

      {/* Current prediction */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="surface-card p-6">
          <div className="mono mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
            <span>Current prediction</span>
            <span>{current ? "live" : "—"}</span>
          </div>
          {current ? (
            <div className="flex items-center gap-6">
              <ProgressRing value={current.confidence} size={130} label="confidence" />
              <div>
                <div className="text-4xl" aria-hidden="true">{EMOTION_META[current.emotion].emoji}</div>
                <div className="mt-2 text-xl text-text-primary">{EMOTION_META[current.emotion].label}</div>
                <div className="mono mt-1 text-[10px] uppercase tracking-widest text-text-tertiary">
                  {new Date(current.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <div className="mono text-[10px] uppercase tracking-widest text-text-tertiary">no prediction yet</div>
              <Link to="/predict" className="mono mt-3 text-xs text-accent hover:underline">
                Run one now →
              </Link>
            </div>
          )}
        </div>

        <div className="surface-card p-6">
          <div className="mono mb-4 text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
            Per-class accuracy · training run
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perClassAccuracy} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid stroke="#2A2A2E" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} {...AXIS} />
                <YAxis type="category" dataKey="emotion" width={70} {...AXIS} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#1C1C1F" }} />
                <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                  {perClassAccuracy.map((r) => (
                    <Cell key={r.emotion} fill={EMOTION_META[r.emotion as Emotion].color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="sr-only">
            Per-class accuracy is highest for Happy (82%) and lowest for Disgust (39%).
          </p>
        </div>
      </div>

      {/* Training curves */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Training Accuracy">
          <img
              src="/images/improved_accuracy.png"
              alt="Training Accuracy"
              className="h-full w-full rounded object-contain"
          />
        </ChartCard>
        <ChartCard title="Training Loss">
          <img
              src="/images/improved_loss.png"
              alt="Training Loss"
              className="h-full w-full rounded object-contain"
          />
        </ChartCard>
      </div>

      {/* Session distribution + confidence */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="surface-card p-6">
          <div className="mono mb-4 text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
            Session emotion distribution
          </div>
          {distribution.length ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distribution} dataKey="count" nameKey="emotion" innerRadius={40} outerRadius={80} stroke="#0A0A0B">
                    {distribution.map((d) => <Cell key={d.emotion} fill={d.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-56 items-center justify-center text-xs text-text-tertiary">
              no predictions this session
            </div>
          )}
        </div>

        <div className="surface-card p-6">
          <div className="mono mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
            <span>Recent predictions</span>
            <span>
              avg confidence <span className="text-text-primary">{(avgConfidence * 100).toFixed(1)}%</span>
            </span>
          </div>
          {history.length ? (
            <div className="max-h-64 overflow-auto">
              <table className="w-full text-left text-xs">
                <thead className="mono sticky top-0 bg-surface text-[10px] uppercase tracking-widest text-text-tertiary">
                  <tr>
                    <th className="py-2 font-normal">Time</th>
                    <th className="py-2 font-normal">Emotion</th>
                    <th className="py-2 font-normal">Confidence</th>
                    <th className="py-2 font-normal">File</th>
                  </tr>
                </thead>
                <tbody className="mono">
                  {history.map((h, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="py-2 text-text-tertiary">
                        {new Date(h.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2">
                        <EmotionBadge emotion={h.emotion} />
                      </td>
                      <td className="py-2 text-text-primary tabular-nums">
                        {(h.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="py-2 truncate text-text-secondary">{h.imageFilename}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-xs text-text-tertiary">
              no history yet — run a prediction to populate this table
            </div>
          )}
          {/* TODO: replace with GET /predictions once backend persists history */}
        </div>
      </div>
    </PageShell>
  );
}

const tooltipStyle = {
  background: "#141416",
  border: "1px solid #2A2A2E",
  borderRadius: 6,
  fontSize: 11,
  color: "#F5F5F5",
} as const;

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
