// // import "@mediapipe/face_mesh";
// // import "@tensorflow/tfjs-core";
// // Register WebGL backend.
// // import "@tensorflow/tfjs-backend-webgl";
// import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
// import Webcam from "react-webcam";

// // const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
// // const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshMediaPipeModelConfig =
// //   {
// //     runtime: "mediapipe",
// //     solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
// //     refineLandmarks: true,
// //     // or 'base/node_modules/@mediapipe/face_mesh' in npm.
// //   };

// // const detector = await faceLandmarksDetection.createDetector(
// //   model,
// //   detectorConfig
// // );

// export const runDetector = async (video: Webcam) => {
//   const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
//   const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshTfjsModelConfig =
//     {
//       runtime: "tfjs",
//       refineLandmarks: true,
//     };
//   const detector = await faceLandmarksDetection.createDetector(
//     model,
//     detectorConfig
//   );

//   const detect = async (net: faceLandmarksDetection.FaceLandmarksDetector) => {
//     const faces = await net.estimateFaces(video, estimationConfig);
//   };
//   detect(detector);
// };
