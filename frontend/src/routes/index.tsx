import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Github, Cpu, Database, Zap } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { EMOTION_META, EMOTIONS, MODEL_STATS } from "@/config/modelStats";
import { NetworkDiagram } from "@/components/diagram/NetworkDiagram";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

// Rotates through sample outputs on the hero card.
// Clearly labeled "SAMPLE OUTPUT" — not a real inference.
const SAMPLES = [
  { emotion: "happy" as const, confidence: 0.91 },
  { emotion: "surprise" as const, confidence: 0.78 },
  { emotion: "neutral" as const, confidence: 0.63 },
  { emotion: "sad" as const, confidence: 0.72 },
];

const HERO_TRACE_NODES = [
  { id: "in", label: "Input", sub: "48×48", x: 8, y: 50 },
  { id: "conv", label: "Conv", sub: "3 blocks", x: 34, y: 30 },
  { id: "fc", label: "Dense", sub: "128", x: 62, y: 70 },
  { id: "out", label: "Softmax", sub: "7 classes", x: 90, y: 40 },
];
const HERO_TRACE_EDGES = [
  { from: "in", to: "conv" },
  { from: "conv", to: "fc" },
  { from: "fc", to: "out" },
];

function Landing() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % SAMPLES.length), 2800);
    return () => window.clearInterval(t);
  }, []);

  const sample = SAMPLES[i];
  const meta = EMOTION_META[sample.emotion];

  return (
    <PageShell>
      {/* Hero */}
      <section className="grid gap-12 pb-16 md:grid-cols-[1.15fr_1fr] md:pb-20">
        <div className="flex flex-col justify-center">
          <div className="mono mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-text-tertiary">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            v0.1 · research preview
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl leading-[1.05] text-text-primary md:text-6xl"
          >
            Decode facial emotions
            <br />
            <span className="text-text-tertiary">using deep learning.</span>
          </motion.h1>
          <p className="mt-5 max-w-xl text-sm text-text-secondary md:text-base">
            A convolutional neural network trained on FER-2013 that classifies faces into seven emotion
            classes. Explore the model, run predictions, and inspect the pipeline end-to-end.
          </p>

          <div className="mono mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-5 text-xs text-text-secondary">
            <div>
              <span className="text-text-primary">{MODEL_STATS.accuracy}%</span>{" "}
              <span className="text-text-tertiary">val_acc</span>
            </div>
            <div>
              <span className="text-text-primary">{MODEL_STATS.classes}</span>{" "}
              <span className="text-text-tertiary">classes</span>
            </div>
            <div>
              <span className="text-text-primary">{MODEL_STATS.dataset}</span>{" "}
              <span className="text-text-tertiary">dataset</span>
            </div>
            <div>
              <span className="text-text-primary">{MODEL_STATS.datasetSize.toLocaleString()}</span>{" "}
              <span className="text-text-tertiary">images</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/predict">
                Open live demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>

        {/* Sample output card */}
        <div className="surface-card relative flex flex-col overflow-hidden p-6">
          <div className="mono flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
            <span>Sample output</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              cycling
            </span>
          </div>

          <div className="mt-6 flex flex-1 items-center justify-center gap-8">
            <ProgressRing value={sample.confidence} size={160} label="confidence" />
            <div className="flex flex-col items-start">
              <div className="text-5xl" aria-hidden="true">{meta.emoji}</div>
              <div className="mono mt-3 text-xs uppercase tracking-widest text-text-tertiary">
                predicted
              </div>
              <div className="mt-1 text-2xl text-text-primary">{meta.label}</div>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-5">
            <NetworkDiagram
              nodes={HERO_TRACE_NODES}
              edges={HERO_TRACE_EDGES}
              activeIndex={i % HERO_TRACE_NODES.length}
              height={90}
              ariaLabel="Model pipeline trace"
            />
          </div>
        </div>
      </section>

      {/* Capability strip */}
      <section className="grid gap-4 border-t border-border pt-10 md:grid-cols-3">
        {[
          {
            icon: Cpu,
            title: "Scratch CNN",
            body: "3 convolutional blocks, pooling, dense, dropout, softmax over 7 classes. Trained end-to-end.",
            to: "/model",
          },
          {
            icon: Database,
            title: "FER-2013",
            body: `${MODEL_STATS.datasetSize.toLocaleString()} labeled 48×48 grayscale faces across ${EMOTIONS.length} emotions.`,
            to: "/dataset",
          },
          {
            icon: Zap,
            title: "REST API",
            body: "POST an image to /predict, receive the top-1 emotion and confidence score.",
            to: "/api",
          },
        ].map((c) => (
          <Link
            key={c.title}
            to={c.to}
            className="surface-card group p-5 transition-colors hover:border-border-strong"
          >
            <c.icon className="h-4 w-4 text-accent" aria-hidden="true" />
            <div className="mt-4 text-sm text-text-primary">{c.title}</div>
            <p className="mt-1 text-xs text-text-secondary">{c.body}</p>
            <div className="mono mt-4 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-text-tertiary group-hover:text-accent">
              Explore <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
