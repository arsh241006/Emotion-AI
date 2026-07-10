import { useMutation } from "@tanstack/react-query";
import {
  predictEmotion,
  predictFrame,
  type PredictionResult,
} from "@/lib/api";
import { usePredictionStore } from "@/store/predictionStore";

export function usePredictEmotion() {
  const push = usePredictionStore((s) => s.pushPrediction);

  const uploadMutation = useMutation<
    PredictionResult,
    Error,
    { file: File; previewUrl: string }
  >({
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

  const webcamMutation = useMutation<
    PredictionResult,
    Error,
    string
  >({
    mutationFn: (image) => predictFrame(image),

    onSuccess: (data) => {
      push({
        ...data,
        timestamp: Date.now(),
        imageFilename: "Webcam",
        thumbnail: "",
      });
    },
  });

  return {
    ...uploadMutation,

    mutateFrameAsync: webcamMutation.mutateAsync,
  };
}