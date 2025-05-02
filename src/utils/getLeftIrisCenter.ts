// 480개 중 IRIS CENTER 만 그리기

// 왼쪽 눈의 가운데 홍채
// [0.0, 1.0]
export function getLeftIrisCenter(landmarks: any[], connection: any[]) {
  const coordinate = connection.map((elem) => elem.start);

  const [left, right] = [coordinate[0], coordinate[2]];
  const [up, down] = [coordinate[1], coordinate[3]];

  const centerX = (landmarks[left].x + landmarks[right].x) / 2;
  const centerY = (landmarks[up].y + landmarks[down].y) / 2;

  return { x: centerX, y: centerY };
}
