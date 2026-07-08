import { useMutation } from "@tanstack/react-query";
import { predictEmotion, type PredictionResult } from "@/lib/api";
import { usePredictionStore } from "@/store/predictionStore";

export function usePredictEmotion() {
  const push = usePredictionStore((s) => s.pushPrediction);
  return useMutation<PredictionResult, Error, { file: File; previewUrl: string }>({
    mutationFn: ({ file }) => predictEmotion(file),
    onSuccess: (data, vars) => {
      push({
        ...data,
        timestamp: Date.now(),
        imageFilename: vars.file.name,
        thumbnail: vars.previewUrl,
      });
    },
  });
}
