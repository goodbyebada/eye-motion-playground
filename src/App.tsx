import { useEffect, useRef, useState } from "react";
import {
  DrawingUtils,
  FilesetResolver,
  FaceLandmarker,
} from "@mediapipe/tasks-vision";
import { getLeftIrisCenter } from "./utils/getLeftIrisCenter";
import { drawBall, drawTwoEyes } from "./utils/draw";

const RADIUS = 20;

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const lastVideoTimeRef = useRef(-1);

  // 이전 홍채 위치 저장
  const centerLeftIris = useRef<{ x: number; y: number } | null>(null);
  const hasCenterIrisRef = useRef<boolean>(false);
  const [hasCenterIris, setHasCenterIris] = useState(false);

  const initFaceLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO",
      numFaces: 1,
    });
  };

  /**
   * 화면 중앙에 있는 버튼 눌렀을 시,
   * 사용자 왼쪽 눈동자 좌표 저장
   */
  const handleCenterIris = () => {
    // 화면에서 iris 좌표를 검색하고 centerLeftIris에 저장
    const video = videoRef.current!;
    const nowInMs = performance.now();
    const faceLandmarker = faceLandmarkerRef.current!;
    const results = faceLandmarker.detectForVideo(video, nowInMs);

    if (results.faceLandmarks.length > 0) {
      const landmarks = results.faceLandmarks[0];
      const { x, y } = getLeftIrisCenter(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS
      );
      centerLeftIris.current = { x, y };
      console.log("Iris Center Position:", centerLeftIris.current);
      hasCenterIrisRef.current = true;
      setHasCenterIris(true);
    }
  };

  useEffect(() => {
    // hasCenterIris 값이 변경될 때마다 실행
    console.log("hasCenterIris 바뀌었음!");
    console.log(hasCenterIrisRef.current);
  }, [hasCenterIrisRef.current]); // hasCenterIris가 변경될 때마다 실행

  const predictWebcam = async () => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const canvasCtx = canvas?.getContext("2d")!;
    const faceLandmarker = faceLandmarkerRef.current!;
    const drawingUtils = new DrawingUtils(canvasCtx);
    const nowInMs = performance.now();

    if (lastVideoTimeRef.current !== video.currentTime) {
      lastVideoTimeRef.current = video.currentTime;
      const results = faceLandmarker.detectForVideo(video, nowInMs);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];
        drawTwoEyes(landmarks, drawingUtils);

        if (hasCenterIrisRef.current) {
          const { x, y } = getLeftIrisCenter(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS
          );
          drawBall(x, y, centerLeftIris, canvas, RADIUS, canvasCtx);
        }
      }
    }

    window.requestAnimationFrame(predictWebcam);
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
    <div id="wrapper">
      {!hasCenterIris && (
        <button style={{ zIndex: 100 }} onClick={handleCenterIris}>
          화면 정중앙 버튼
        </button>
      )}
      <video
        id="webcam"
        ref={videoRef}
        width={640}
        height={480}
        autoPlay
        muted
        playsInline
        style={{ position: "absolute" }}
      />
      <canvas
        ref={canvasRef}
        id="output_canvas"
        width={640}
        height={480}
        style={{ position: "absolute" }}
      />
    </div>
  );
};

export default App;
