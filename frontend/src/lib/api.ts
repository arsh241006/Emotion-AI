import axios from "axios";
import type { Emotion } from "@/config/modelStats";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5000",
  timeout: 15000,
});

export interface PredictionResult {
  face_detected?: boolean;

  emotion: Emotion;
  confidence: number;
  inference_time: number;
  probabilities?: Record<Emotion, number>;
}

export async function predictEmotion(image: File): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("image", image);
  const { data } = await api.post<PredictionResult>("/predict", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function predictFrame(
    image: string
  ): Promise<PredictionResult> {
    const { data } = await api.post<PredictionResult>("/predict-frame", {
      image,
    });

    return data;
  }