import type { selectRoute } from "./route-selection.ts";

type Point = { x: number; y: number };

// 선의 긴 곡률 대신 수직선과 45도 대각선을 쓰고, 꺾이는 부분만 둥글게 한다.
function connectionPath(points: Point[]) {
  const corners = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const start = points[i - 1], end = points[i];
    const diagonal = Math.abs(end.x - start.x);
    const lead = (end.y - start.y - diagonal) / 2;
    if (diagonal) corners.push({ x: start.x, y: start.y + lead }, { x: end.x, y: end.y - lead });
    corners.push(end);
  }
  let path = `M${corners[0].x} ${corners[0].y}`;
  for (let i = 1; i < corners.length - 1; i++) {
    const previous = corners[i - 1], point = corners[i], next = corners[i + 1];
    const before = Math.hypot(point.x - previous.x, point.y - previous.y);
    const after = Math.hypot(next.x - point.x, next.y - point.y);
    const radius = Math.min(8, before / 2, after / 2);
    const entry = { x: point.x + (previous.x - point.x) * radius / before, y: point.y + (previous.y - point.y) * radius / before };
    const exit = { x: point.x + (next.x - point.x) * radius / after, y: point.y + (next.y - point.y) * radius / after };
    path += ` L${entry.x} ${entry.y} Q${point.x} ${point.y} ${exit.x} ${exit.y}`;
  }
  const end = corners.at(-1)!;
  return `${path} L${end.x} ${end.y}`;
}

export function layoutRoute(route: ReturnType<typeof selectRoute>, remainingOnly: boolean) {
  const layers = route.layers.map((layer) => layer.filter((id) => !remainingOnly || route.neededIds.includes(id))).filter((layer) => layer.length);
  const rows = new Map(layers.flatMap((layer, row) => layer.map((id) => [id, row] as const)));
  // 중간 역이 이미 표현하는 선행 관계만 축약하며 실제 진행 조건은 바꾸지 않는다.
  function reaches(from: string, target: string, visited = new Set<string>()): boolean {
    if (visited.has(from)) return false;
    visited.add(from);
    return route.dependencies[from].some((id) => id === target || reaches(id, target, visited));
  }
  const connections = layers.flat().flatMap((to) => {
    const dependencies = route.dependencies[to];
    return dependencies.filter((from) => rows.has(from) && !dependencies.some((other) => other !== from && reaches(other, from))).map((from) => ({ from, to, via: [from] }));
  });
  const tracks = layers.map((layer) => [...layer]);
  const parents = new Map<string, string[]>();
  // 여러 줄을 건너뛰는 연결에도 자리를 예약해 관계없는 역을 관통하지 않게 한다.
  for (const edge of connections) {
    for (let row = rows.get(edge.from)! + 1; row < rows.get(edge.to)!; row++) {
      const waypoint = `${edge.from}:${edge.to}:${row}`;
      tracks[row].push(waypoint);
      edge.via.push(waypoint);
    }
    edge.via.push(edge.to);
    for (let i = 1; i < edge.via.length; i++) {
      const id = edge.via[i];
      parents.set(id, [...(parents.get(id) ?? []), edge.via[i - 1]]);
    }
  }
  const laneCount = Math.max(3, ...tracks.map((layer) => layer.length));
  const center = (laneCount - 1) / 2;
  const lanes = new Map<string, number>();
  for (const layer of tracks) {
    const preferred = (id: string) => {
      const previous = parents.get(id) ?? [];
      return previous.length ? previous.reduce((sum, parent) => sum + lanes.get(parent)!, 0) / previous.length : center;
    };
    layer.sort((a, b) => preferred(a) - preferred(b));
    let last = -1;
    layer.forEach((id, index) => {
      const lane = layer.length === 1 ? center : Math.max(last + 1, Math.min(laneCount - layer.length + index, Math.round(preferred(id))));
      lanes.set(id, lane);
      last = lane;
    });
  }
  const width = Math.max(288, (laneCount - 1) * 72 + 96);
  const positions = new Map<string, Point>();
  let y = 32;
  tracks.forEach((layer, row) => {
    if (row) {
      const widest = Math.max(0, ...layer.flatMap((id) => (parents.get(id) ?? []).map((parent) => Math.abs(lanes.get(id)! - lanes.get(parent)!) * 72)));
      y += Math.max(80, widest + 48);
    }
    layer.forEach((id) => positions.set(id, { x: width / 2 + (lanes.get(id)! - center) * 72, y }));
  });
  return {
    width, height: y + 112, layers,
    positions: new Map(layers.flat().map((id) => [id, positions.get(id)!])),
    connections: connections.map((edge) => ({ ...edge, path: connectionPath(edge.via.map((id) => positions.get(id)!)) })),
  };
}
