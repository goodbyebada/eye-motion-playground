import {
  DrawingUtils,
  NormalizedLandmark,
  FaceLandmarker,
} from "@mediapipe/tasks-vision";
import { RefObject } from "react";

// TODO 왜 RefObject null일때 되지?
function drawBall(
  x: number,
  y: number,
  centerLeftIris: RefObject<{
    x: number;
    y: number;
  } | null>,
  canvas: HTMLCanvasElement,
  radius: number,
  canvasCtx: CanvasRenderingContext2D
) {
  // 현재 좌표를 기준으로 방향 비교
  const prev = centerLeftIris.current;

  // 시작 좌표
  let ballX = canvas.width / 2;
  let ballY = canvas.height / 2;

  if (prev) {
    // 중앙과 비교
    const deltaX = x - prev.x;
    const deltaY = y - prev.y;

    const threshold = 0.01;

    if (deltaX < -threshold) {
      ballX = radius; // 왼쪽
    } else if (deltaX > threshold) {
      ballX = canvas.width - radius; // 오른쪽
    }

    if (deltaY < -threshold) {
      ballY = radius; // 위쪽
    } else if (deltaY > threshold) {
      ballY = canvas.height - radius; // 아래쪽
    }
  }

  centerLeftIris.current = { x, y };

  // 공 그리기
  canvasCtx.beginPath();
  canvasCtx.arc(ballX, ballY, radius, 0, 2 * Math.PI);
  canvasCtx.fillStyle = "#27b944";
  canvasCtx.fill();
}

function drawTwoEyes(
  landmarks: NormalizedLandmark[],
  drawingUtils: DrawingUtils
) {
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

export { drawBall, drawTwoEyes };
