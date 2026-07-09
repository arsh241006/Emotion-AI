import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { NetworkDiagram } from "@/components/diagram/NetworkDiagram";

export const Route = createFileRoute("/api")({
  head: () => ({
    meta: [
      { title: "API — EmotionAI" },
      { name: "description", content: "REST API reference: POST /predict returns emotion and confidence." },
      { property: "og:title", content: "API — EmotionAI" },
      { property: "og:description", content: "Flask REST endpoint for the CNN." },
    ],
  }),
  component: ApiPage,
});

const NODES = [
  { id: "req",   label: "Request",    sub: "multipart/form-data", x: 8,  y: 50 },
  { id: "flask", label: "Flask",      sub: "/predict",             x: 30, y: 30 },
  { id: "cv",    label: "OpenCV",     sub: "face detect",          x: 52, y: 60 },
  { id: "tf",    label: "TensorFlow", sub: "forward pass",         x: 74, y: 30 },
  { id: "resp",  label: "Response",   sub: "JSON",                  x: 94, y: 55 },
];
const EDGES = NODES.slice(0, -1).map((n, i) => ({ from: n.id, to: NODES[i + 1].id }));

const BASE = "http://127.0.0.1:5000";

function ApiPage() {
  return (
    <PageShell
      eyebrow="API"
      title="REST reference"
      description="A single Flask endpoint accepts a face image and returns the top-1 emotion with its confidence."
    >
      <div className="surface-card p-6">
        <div className="mono mb-4 text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
          Request flow
        </div>
        <NetworkDiagram nodes={NODES} edges={EDGES} height={180} ariaLabel="API flow: request → Flask → OpenCV → TensorFlow → response" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <CodeBlock
          title="Request"
          code={`POST ${BASE}/predict
Content-Type: multipart/form-data

image=<binary jpeg/png>`}
        />
        <CodeBlock
          title="Response · 200 OK"
          code={`{
    "confidence": 76.63,
    "emotion": "angry",
    "inference_time": 310.77,
    "probabilities": {
        "angry": 76.63,
        "disgust": 1.33,
        "fear": 18.38,
        "happy": 0.79,
        "neutral": 0.05,
        "sad": 0.94,
        "surprise": 1.88
    }
}
`}
        />
      </div>

      <div className="surface-card mt-6 p-6">
        <div className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
          Notes
        </div>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li>· Frontend reads the base URL from <code className="mono text-text-primary">VITE_API_BASE_URL</code>. Defaults to <code className="mono text-text-primary">{BASE}</code>.</li>
          <li>· All requests are POST with <code className="mono text-text-primary">multipart/form-data</code> and a single <code className="mono text-text-primary">image</code> field.</li>
          <li>· The <code className="mono text-text-primary">probabilities</code> field will surface once the server returns the full softmax vector.</li>
        </ul>
      </div>
    </PageShell>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="surface-card p-0 overflow-hidden">
      <div className="mono flex items-center justify-between border-b border-border px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
        <span>{title}</span>
        <button
          onClick={() => navigator.clipboard?.writeText(code)}
          className="text-text-tertiary hover:text-text-primary"
        >
          copy
        </button>
      </div>
      <pre className="mono overflow-auto bg-background p-4 text-xs leading-relaxed text-text-primary">
{code}
      </pre>
    </div>
  );
}
