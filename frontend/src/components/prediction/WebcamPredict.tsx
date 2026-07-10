import { useEffect, useRef, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:5000";

interface Prediction {
  emotion: string;
  confidence: number;
  inference_time: number;
}

export default function WebcamPredict() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [running, setRunning] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  // Start webcam
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    setRunning(true);
  };

  // Stop webcam
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;

    stream?.getTracks().forEach((track) => track.stop());

    setRunning(false);
  };

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext("2d");

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      ctx?.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      const image = canvasRef.current.toDataURL("image/jpeg");

      try {
        const { data } = await axios.post(`${API}/predict-frame`, {
          image,
        });

        setPrediction(data);
      } catch (err) {
        console.log(err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  return (
    <div className="space-y-6">

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-xl border border-border"
      />

      <canvas ref={canvasRef} hidden />

      {!running ? (
        <button
          onClick={startCamera}
          className="rounded-lg bg-orange-500 px-4 py-2 text-white"
        >
          Start Webcam
        </button>
      ) : (
        <button
          onClick={stopCamera}
          className="rounded-lg bg-red-500 px-4 py-2 text-white"
        >
          Stop Webcam
        </button>
      )}

      {prediction && (
        <div className="rounded-xl border border-border p-4">

          <h3 className="text-xl font-semibold">
            {prediction.emotion}
          </h3>

          <p>
            Confidence: {prediction.confidence.toFixed(2)}%
          </p>

          <p>
            Inference Time: {prediction.inference_time.toFixed(2)} ms
          </p>

        </div>
      )}

    </div>
  );
}