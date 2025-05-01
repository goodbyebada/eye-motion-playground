import React, { useEffect, useRef } from "react";
import {
  DrawingUtils,
  FilesetResolver,
  FaceLandmarker,
  FaceDetector,
} from "@mediapipe/tasks-vision";
import { FaceMesh } from "@mediapipe/face_mesh";

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const runningMode = "VIDEO";
  const lastVideoTimeRef = useRef(-1);
  const webcamRunningRef = useRef(true);

  const initFaceLandmarker = async () => {
    // const vision = await FilesetResolver.forVisionTasks(
    //   "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    // );

    // faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
    //   baseOptions: {
    //     modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float32/1/face_landmarker.task`,
    //     delegate: "GPU",
    //   },
    //   outputFaceBlendshapes: true,
    //   runningMode: "VIDEO",
    //   numFaces: 1,
    // });

    const vision = await FilesetResolver.forVisionTasks(
      // path/to/wasm/root
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
        delegate: "GPU",
      },
      outputFaceBlendshapes: true,
      runningMode,
      numFaces: 1,
    });
  };

  const predictWebcam = async () => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const canvasCtx = canvas.getContext("2d")!;
    const faceLandmarker = faceLandmarkerRef.current!;
    const drawingUtils = new DrawingUtils(canvasCtx);

    canvas.style.width = `${video.videoWidth}px`;
    canvas.style.height = `${video.videoHeight}}px`;

    const nowInMs = performance.now();

    if (lastVideoTimeRef.current !== video.currentTime) {
      lastVideoTimeRef.current = video.currentTime;
      const results = faceLandmarker.detectForVideo(video, nowInMs);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.faceLandmarks) {
        for (const landmarks of results.faceLandmarks) {
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_TESSELATION,
            { color: "#C0C0C070", lineWidth: 1 }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
            { color: "#FF3030" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
            { color: "#FF3030" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
            { color: "#30FF30" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
            { color: "#30FF30" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
            { color: "#E0E0E0" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LIPS,
            { color: "#E0E0E0" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
            { color: "#FF3030" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
            { color: "#30FF30" }
          );
        }
      }

      drawBlendShapes(canvas, results.faceBlendshapes);
    }

    if (webcamRunningRef.current) {
      window.requestAnimationFrame(predictWebcam);
    }
  };

  const drawBlendShapes = (
    canvas: HTMLCanvasElement,
    faceBlendshapes: Array<{
      categories: Array<{ score: number; categoryName: string }>;
    }>
  ) => {
    if (!canvas || !faceBlendshapes || faceBlendshapes.length === 0) return;

    // const ctx = canvas.getContext("2d");
    // if (!ctx) return;

    // const barWidth = 150;
    // const barHeight = 10;
    // const startX = 10;
    // let startY = 10;

    // // 첫 번째 얼굴만 시각화
    // const categories = faceBlendshapes[0].categories;

    // categories.forEach(({ score, categoryName }) => {
    //   ctx.fillStyle = "#000";
    //   ctx.font = "12px sans-serif";
    //   ctx.fillText(`${categoryName}: ${score.toFixed(2)}`, startX, startY + 8);

    //   ctx.fillStyle = "#00BFFF";
    //   ctx.fillRect(startX + 110, startY, barWidth * score, barHeight);

    //   startY += 15;
    // });
  };

  useEffect(() => {
    const start = async () => {
      await initFaceLandmarker();

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current!.srcObject = stream;
      videoRef.current!.addEventListener("loadeddata", predictWebcam);
    };

    start();
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        id="webcam"
        width="640"
        height="480"
        autoPlay
        muted
        playsInline
        style={{ display: "absolute", top: 0 }}
      />

      <canvas
        ref={canvasRef}
        id="output_canvas"
        width="640"
        height="480"
        style={{ display: "absolute" }}
      />
    </div>
  );
};

export default App;
