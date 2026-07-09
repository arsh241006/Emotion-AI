import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { StatCard } from "@/components/ui/StatCard";
import { CountUp } from "@/components/ui/CountUp";
import { ChartTooltip } from "@/components/ui/ChartTooltip";
import { EMOTION_META, EMOTIONS, MODEL_STATS, type Emotion } from "@/config/modelStats";
import { usePredictionStore } from "@/store/predictionStore";
import { EmotionBadge } from "@/components/prediction/EmotionBadge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { classAccuracy } from "@/data/classAccuracy";
import { trainingMetrics } from "@/data/trainingMetrics";


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

// Softer, legible axis text — was #3A3A3F (nearly invisible on dark bg)
const AXIS = { stroke: "#9A9AA4", fontSize: 12, fontFamily: "inherit" };
// Grid recedes into the background instead of competing with bars
const GRID_STROKE = "#1E1E22";
const TOOLTIP_CURSOR = { fill: "rgba(255,106,26,0.08)" };
const ACCENT = "#FF6A1A";
// Orange-family palette so pie slices stay on-theme with the bar chart
// while still being distinguishable from each other
const ORANGE_SHADES = ["#FF6A1A", "#FFA24D", "#E85D04", "#FFC98A", "#C9450C", "#FF8C42", "#8A2E00"];

function DashboardPage() {
  const current = usePredictionStore((s) => s.current);
  const history = usePredictionStore((s) => s.history);
  const [activeSlice, setActiveSlice] = useState<number | null>(null);

  const distribution = useMemo(() => {
    const counts: Record<Emotion, number> = Object.fromEntries(EMOTIONS.map((e) => [e, 0])) as Record<Emotion, number>;
    history.forEach((h) => { counts[h.emotion]++; });
    return EMOTIONS.map((e, i) => ({
      emotion: e,
      count: counts[e],
      fill: ORANGE_SHADES[i % ORANGE_SHADES.length],
    })).filter((d) => d.count > 0);
  }, [history]);

  const avgConfidence = history.length
    ? history.reduce((a, h) => a + h.confidence, 0) / history.length
    : 0;

  const perClassAccuracy = classAccuracy;

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
            current ? (
              <CountUp end={current.inference_time} decimals={2} suffix=" ms" />
            ) : (
              <span className="text-text-tertiary text-sm">
                Run a prediction
              </span>
            )
          }
          hint="Latest prediction"
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
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                    stroke={GRID_STROKE}
                    strokeDasharray="3 3"
                    horizontal={false}
                />
                <XAxis type="number" domain={[0, 100]} {...AXIS} />
                <YAxis
                    type="category"
                    dataKey="emotion"
                    width={78}
                    tick={{ fill: "#C9C9D1", fontSize: 12, fontFamily: "inherit" }}
                    axisLine={{ stroke: GRID_STROKE }}
                    tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={TOOLTIP_CURSOR} />
                <Bar
                    dataKey="accuracy"
                    radius={[0, 6, 6, 0]}
                    animationDuration={1800}
                    fill="url(#barFill)"
                    maxBarSize={22}
                />
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
          <TrainingLineChart
              data={trainingMetrics}
              trainKey="trainAcc"
              valKey="valAcc"
              isPercent
              domain={[0, 1]}
          />
        </ChartCard>
        <ChartCard title="Training Loss">
          <TrainingLineChart
              data={trainingMetrics}
              trainKey="trainLoss"
              valKey="valLoss"
              domain={[0, 2]}
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
                  <defs>
                    {distribution.map((d) => (
                      <radialGradient
                          key={d.emotion}
                          id={`pieGrad-${d.emotion}`}
                          cx="35%"
                          cy="35%"
                          r="75%"
                      >
                        <stop offset="0%" stopColor={d.fill} stopOpacity={0.55} />
                        <stop offset="100%" stopColor={d.fill} stopOpacity={1} />
                      </radialGradient>
                    ))}
                  </defs>
                  <Pie
                      data={distribution}
                      dataKey="count"
                      nameKey="emotion"
                      innerRadius={40}
                      outerRadius={80}
                      stroke="#0A0A0B"
                      strokeWidth={2}
                      paddingAngle={2}
                      onMouseEnter={(_, i) => setActiveSlice(i)}
                      onMouseLeave={() => setActiveSlice(null)}
                  >
                    {distribution.map((d, i) => (
                      <Cell
                          key={d.emotion}
                          fill={`url(#pieGrad-${d.emotion})`}
                          opacity={activeSlice === null || activeSlice === i ? 1 : 0.35}
                          style={{ transition: "opacity 150ms ease" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} cursor={false} />
                  <Legend
                      verticalAlign="bottom"
                      height={28}
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span className="mono text-[10px] uppercase tracking-widest text-text-tertiary">
                          {value}
                        </span>
                      )}
                  />
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
              avg confidence <span className="text-text-primary">{(avgConfidence).toFixed(1)}%</span>
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
                    <tr
                        key={i}
                        className="border-t border-border transition-colors hover:bg-white/[0.03]"
                    >
                      <td className="py-2 text-text-tertiary">
                        {new Date(h.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2">
                        <EmotionBadge emotion={h.emotion} />
                      </td>
                      <td className="py-2 text-text-primary tabular-nums">
                        {(h.confidence).toFixed(1)}%
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

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="surface-card p-6">
      <div className="mono mb-4 text-[10px] uppercase tracking-[0.2em] text-text-tertiary">{title}</div>
      <div className="h-56">{children}</div>
    </div>
  );
}

function TrainingLineChart({
  data,
  trainKey,
  valKey,
  isPercent,
  domain,
}: {
  data: typeof trainingMetrics;
  trainKey: "trainAcc" | "trainLoss";
  valKey: "valAcc" | "valLoss";
  isPercent?: boolean;
  domain: [number, number];
}) {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  const toggle = (dataKey: string) =>
    setHidden((h) => ({ ...h, [dataKey]: !h[dataKey] }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id={`lineGrad-${valKey}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ACCENT} stopOpacity={0.55} />
            <stop offset="100%" stopColor={ACCENT} stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" vertical={false} />
        <XAxis
            dataKey="epoch"
            {...AXIS}
            tickLine={false}
            axisLine={{ stroke: GRID_STROKE }}
            label={{ value: "epoch", position: "insideBottomRight", offset: -2, fill: "#6E6E78", fontSize: 10 }}
        />
        <YAxis
            {...AXIS}
            domain={domain}
            tickLine={false}
            axisLine={{ stroke: GRID_STROKE }}
            tickFormatter={(v) => (isPercent ? `${Math.round(v * 100)}%` : v.toFixed(1))}
            width={40}
        />
        <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: ACCENT, strokeOpacity: 0.15, strokeWidth: 24 }}
        />
        <Legend
            onClick={(e) => toggle(e.dataKey as string)}
            iconType="plainline"
            iconSize={16}
            formatter={(value) => (
              <span className="mono cursor-pointer select-none text-[10px] uppercase tracking-widest text-text-tertiary hover:text-text-primary">
                {value}
              </span>
            )}
        />
        <Line
            type="monotone"
            dataKey={trainKey}
            name="train"
            stroke="#8A5A38"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#FFA25A", stroke: "#0A0A0B", strokeWidth: 2 }}
            hide={hidden[trainKey]}
            animationDuration={1400}
        />
        <Line
            type="monotone"
            dataKey={valKey}
            name="validation"
            stroke={`url(#lineGrad-${valKey})`}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: ACCENT, stroke: "#0A0A0B", strokeWidth: 2 }}
            hide={hidden[valKey]}
            animationDuration={1800}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}