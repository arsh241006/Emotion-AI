import { EMOTIONS } from "@/config/modelStats";

export const trainingCurves = Array.from({ length: 30 }, (_, i) => ({
  epoch: i + 1,
  trainAcc: 0.28 + (1 - Math.exp(-i / 8)) * 0.42,
  valAcc: 0.26 + (1 - Math.exp(-i / 9)) * 0.34,
  trainLoss: 1.9 * Math.exp(-i / 10) + 0.55,
  valLoss: 1.85 * Math.exp(-i / 11) + 0.85,
}));

export const perClassAccuracy: { emotion: string; accuracy: number }[] = [
  { emotion: "happy", accuracy: 82 },
  { emotion: "surprise", accuracy: 75 },
  { emotion: "neutral", accuracy: 62 },
  { emotion: "angry", accuracy: 55 },
  { emotion: "sad", accuracy: 51 },
  { emotion: "fear", accuracy: 44 },
  { emotion: "disgust", accuracy: 39 },
];

export const classificationReport = EMOTIONS.map((e) => ({
  emotion: e,
  precision: 0.4 + Math.random() * 0.4,
  recall: 0.4 + Math.random() * 0.4,
  f1: 0.4 + Math.random() * 0.4,
  support: 300 + Math.round(Math.random() * 900),
}));
