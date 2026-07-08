import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PredictionResult } from "@/lib/api";

export interface StoredPrediction extends PredictionResult {
  timestamp: number;
  imageFilename: string;
  thumbnail: string; // object URL / data URL
}

interface PredictionState {
  current: StoredPrediction | null;
  history: StoredPrediction[];
  pushPrediction: (p: StoredPrediction) => void;
  clearHistory: () => void;
}

export const usePredictionStore = create<PredictionState>()(
  persist(
    (set) => ({
      current: null,
      history: [],
      pushPrediction: (p) =>
        set((state) => ({
          current: p,
          history: [p, ...state.history].slice(0, 50),
        })),
      clearHistory: () => set({ current: null, history: [] }),
    }),
    {
      name: "emotionai-predictions",
      // Don't persist blob: URLs — they die on reload.
      partialize: (state) => ({
        history: state.history.map((h) => ({ ...h, thumbnail: "" })),
        current: state.current ? { ...state.current, thumbnail: "" } : null,
      }),
    }
  )
);
