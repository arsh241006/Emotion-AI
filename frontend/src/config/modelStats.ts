// Single source of truth for every stat shown in the app.
// Never hardcode these numbers anywhere else.
export const MODEL_STATS = {
  accuracy: 59.5, // FER-2013 validation accuracy
  inferenceMs: null as number | null, // TODO: measure real average and replace null
  classes: 7,
  dataset: "FER-2013",
  datasetSize: 35887,
  imageSize: 48,
  channels: 1,
  status: "Online" as const,
  compute: "CPU" as const, // TODO: set from real deployment
} as const;

export const EMOTIONS = [
  "angry",
  "disgust",
  "fear",
  "happy",
  "sad",
  "surprise",
  "neutral",
] as const;

export type Emotion = (typeof EMOTIONS)[number];

export const EMOTION_META: Record<Emotion, { label: string; emoji: string; color: string; count: number | null }> = {
  angry:    { label: "Angry",    emoji: "😠", color: "var(--color-emotion-angry)",    count: 4953 },
  disgust:  { label: "Disgust",  emoji: "🤢", color: "var(--color-emotion-disgust)",  count: 547 },
  fear:     { label: "Fear",     emoji: "😨", color: "var(--color-emotion-fear)",     count: 5121 },
  happy:    { label: "Happy",    emoji: "😄", color: "var(--color-emotion-happy)",    count: 8989 },
  sad:      { label: "Sad",      emoji: "😢", color: "var(--color-emotion-sad)",      count: 6077 },
  surprise: { label: "Surprise", emoji: "😲", color: "var(--color-emotion-surprise)", count: 4002 },
  neutral:  { label: "Neutral",  emoji: "😐", color: "var(--color-emotion-neutral)",  count: 6198 },
};
