import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePredictEmotion } from "@/hooks/usePredictEmotion";
import { NetworkDiagram } from "@/components/diagram/NetworkDiagram";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { EMOTION_META } from "@/config/modelStats";

const PIPELINE_NODES = [
  { id: "img",   label: "Image",       sub: "raw upload",    x: 6,  y: 55 },
  { id: "face",  label: "Face detect", sub: "OpenCV",        x: 22, y: 30 },
  { id: "crop",  label: "Crop",        sub: "bbox",          x: 38, y: 62 },
  { id: "resize",label: "Resize",      sub: "48×48",          x: 54, y: 32 },
  { id: "norm",  label: "Normalize",   sub: "/ 255",         x: 68, y: 60 },
  { id: "fwd",   label: "CNN",         sub: "forward pass",  x: 82, y: 30 },
  { id: "sm",    label: "Softmax",     sub: "7 classes",     x: 94, y: 58 },
];
const PIPELINE_EDGES = PIPELINE_NODES.slice(0, -1).map((n, i) => ({
  from: n.id,
  to: PIPELINE_NODES[i + 1].id,
}));

const STAGES = [
  "Loading model…",
  "Detecting face…",
  "Running inference…",
  "Computing probabilities…",
];

export function PredictPanel() {
  const [tab, setTab] = useState<"upload" | "webcam">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [stage, setStage] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const stageTimer = useRef<number | null>(null);
  const mutation = usePredictEmotion();

  const handleFile = useCallback((f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    mutation.reset();
    setStage(-1);
  }, [previewUrl, mutation]);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const runPredict = () => {
    if (!file || !previewUrl) return;
    setStage(0);
    // Staged loading — advances while the real request is in flight.
    if (stageTimer.current) window.clearInterval(stageTimer.current);
    stageTimer.current = window.setInterval(() => {
      setStage((s) => (s < STAGES.length - 1 ? s + 1 : s));
    }, 550);
    mutation.mutate(
      { file, previewUrl },
      {
        onSettled: () => {
          if (stageTimer.current) window.clearInterval(stageTimer.current);
          setStage(STAGES.length - 1);
        },
      }
    );
  };

  const clear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    mutation.reset();
    setStage(-1);
  };

  // Map stage to diagram active index (roughly proportional).
  const diagramActive =
    mutation.isSuccess ? PIPELINE_NODES.length - 1
    : stage < 0 ? -1
    : Math.min(PIPELINE_NODES.length - 1, Math.round(((stage + 1) / STAGES.length) * PIPELINE_NODES.length) - 1);

  const result = mutation.data;
  const meta = result ? EMOTION_META[result.emotion] : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      {/* Left — input */}
      <div className="surface-card p-6">
        {/* Tabs */}
        <div role="tablist" aria-label="Prediction mode" className="mb-6 flex gap-1 rounded-md border border-border bg-surface-raised p-1">
          {[
            { id: "upload", label: "Upload", icon: Upload },
            { id: "webcam", label: "Webcam", icon: Camera },
          ].map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id as "upload" | "webcam")}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-sm px-3 py-1.5 text-xs transition-colors",
                  active
                    ? "border border-accent bg-accent-dim text-text-primary"
                    : "border border-transparent text-text-secondary hover:text-text-primary"
                )}
              >
                <t.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {t.label}
                {t.id === "webcam" && (
                  <span className="mono ml-1 rounded-sm border border-border px-1 text-[9px] uppercase tracking-widest text-text-tertiary">
                    soon
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {tab === "upload" ? (
          <>
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload an image for emotion prediction"
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFile(e.dataTransfer.files?.[0] ?? null);
              }}
              className={cn(
                "relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border border-dashed border-border-strong bg-surface-raised transition-colors",
                dragOver && "border-accent bg-accent-dim",
                previewUrl && "border-solid border-border"
              )}
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Uploaded preview" className="h-full w-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); clear(); }}
                    aria-label="Remove image"
                    className="absolute right-2 top-2 rounded-md border border-border bg-background/80 p-1 text-text-secondary backdrop-blur hover:text-text-primary"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center">
                  <ImageIcon className="h-8 w-8 text-text-tertiary" aria-hidden="true" />
                  <div>
                    <div className="text-sm text-text-primary">Drop an image or click to browse</div>
                    <div className="mono mt-1 text-[10px] uppercase tracking-widest text-text-tertiary">
                      JPG · PNG · WEBP
                    </div>
                  </div>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="mono text-xs text-text-tertiary truncate">
                {file ? file.name : "no file selected"}
              </div>
              <Button
                onClick={runPredict}
                disabled={!file || mutation.isPending}
              >
                {mutation.isPending ? "Predicting…" : "Predict emotion"}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex aspect-square w-full flex-col items-center justify-center rounded-md border border-dashed border-border-strong bg-surface-raised p-6 text-center">
            <Camera className="h-8 w-8 text-text-tertiary" aria-hidden="true" />
            <div className="mt-3 text-sm text-text-primary">Webcam mode</div>
            <p className="mono mt-2 max-w-xs text-xs text-text-secondary">
              Real-time inference isn&apos;t wired up yet — the backend doesn&apos;t currently support
              streaming or rapid-poll requests.
            </p>
            <span className="mono mt-4 rounded-sm border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-text-tertiary">
              coming soon
            </span>
          </div>
        )}
      </div>

      {/* Right — pipeline + result */}
      <div className="flex flex-col gap-6">
        <div className="surface-card p-6">
          <div className="mono mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
            <span>Inference pipeline</span>
            <span aria-live="polite">
              {mutation.isPending && stage >= 0 && STAGES[stage]}
              {mutation.isSuccess && "Complete"}
              {mutation.isError && (
                <span className="text-accent">Request failed — is the API running?</span>
              )}
              {!mutation.isPending && !mutation.isSuccess && !mutation.isError && "Idle"}
            </span>
          </div>
          <NetworkDiagram
            nodes={PIPELINE_NODES}
            edges={PIPELINE_EDGES}
            activeIndex={diagramActive}
            height={220}
            ariaLabel="Prediction pipeline: image, face detection, crop, resize, normalize, CNN, softmax"
          />
        </div>

        <div className="surface-card p-6" aria-live="polite">
          {!result && !mutation.isPending && !mutation.isError && (
            <div className="flex h-56 flex-col items-center justify-center text-center">
              <div className="mono text-[10px] uppercase tracking-widest text-text-tertiary">
                awaiting prediction
              </div>
              <p className="mt-2 max-w-xs text-sm text-text-secondary">
                Upload an image on the left and press Predict.
              </p>
            </div>
          )}

          {mutation.isPending && (
            <div className="flex h-56 flex-col items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-border-strong border-t-accent" />
              <div className="mono mt-4 text-xs text-text-secondary">{STAGES[Math.max(0, stage)]}</div>
            </div>
          )}

          {mutation.isError && (
            <div className="flex h-56 flex-col items-center justify-center text-center">
              <div className="mono text-xs text-accent">Prediction failed</div>
              <p className="mt-2 max-w-sm text-xs text-text-secondary">
                Couldn&apos;t reach the model server. Check that the Flask API is running at{" "}
                <code className="mono">{import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5000"}</code>.
              </p>
            </div>
          )}

          {result && meta && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-8"
            >
              <ProgressRing value={result.confidence} size={160} label="confidence" />
              <div>
                <div className="mono text-[10px] uppercase tracking-widest text-text-tertiary">
                  predicted emotion
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-4xl" aria-hidden="true">{meta.emoji}</span>
                  <span className="text-2xl text-text-primary">{meta.label}</span>
                </div>
                <div className="mono mt-4 text-[10px] uppercase tracking-widest text-text-tertiary">
                  General characteristics typically associated with this emotion
                </div>
                <p className="mt-1 max-w-sm text-xs text-text-secondary">
                  {CHARACTERISTICS[result.emotion]}
                </p>
              </div>
            </motion.div>
          )}

          {/*
            "All probabilities" section — intentionally not rendered yet.
            TODO: Enable once /predict returns `probabilities` for all 7 classes.
            Fabricating the other 6 values from a single top-1 confidence would
            violate the data-honesty rule.
          */}
        </div>
      </div>
    </div>
  );
}

const CHARACTERISTICS: Record<string, string> = {
  happy: "Upturned mouth corners, raised cheeks, and softened eyes are commonly linked to happiness.",
  sad: "Drooping eyelids, downturned mouth, and inner-brow raise are commonly linked to sadness.",
  angry: "Lowered, drawn-together brows and tightened mouth are commonly linked to anger.",
  fear: "Raised, drawn-together brows and widened eyes are commonly linked to fear.",
  surprise: "Raised brows, widened eyes, and an open mouth are commonly linked to surprise.",
  disgust: "Wrinkled nose and raised upper lip are commonly linked to disgust.",
  neutral: "Relaxed facial muscles with no strong expression are commonly labeled as neutral.",
};
