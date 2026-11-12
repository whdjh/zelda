import assert from "node:assert/strict";
import { test } from "node:test";
import { ootContent } from "../../content/ocarina-of-time/index.ts";
import { selectRoute } from "./route-selection.ts";
import { layoutRoute } from "./route-layout.ts";

const empty = { completedStopIds: [], confirmedItemIds: [] };

test("같은 분기의 연속 역은 세로축을 유지하고 모바일 폭 안에 배치한다", () => {
  const route = selectRoute(ootContent.stops, empty);
  const layout = layoutRoute(route, false);
  assert.equal(layout.width, 288);
  assert.equal(layout.positions.size, ootContent.stops.length);
  for (const [from, to] of [["fire-hammer", "fire-guardian"], ["water-levels", "water-guardian"], ["forest-guardian", "well-lens"], ["zora-audience", "jabu-rescue"]]) {
    assert.equal(layout.positions.get(from)!.x, layout.positions.get(to)!.x);
  }
  assert.deepEqual(layoutRoute(route, false), layout);
});

test("모든 목적지·완료·장비 변경에서도 연결을 보존하고 터치 영역을 겹치지 않는다", () => {
  const scenarios = [
    empty,
    ...ootContent.stops.map((stop) => ({ ...empty, goalStopId: stop.id })),
    ...ootContent.stops.map((_, index) => ({ ...empty, completedStopIds: ootContent.stops.slice(0, index + 1).map((stop) => stop.id) })),
    ...ootContent.stops.map((stop) => ({ ...empty, completedStopIds: [stop.id] })),
    ...ootContent.items.map((item) => ({ ...empty, confirmedItemIds: [item.id] })),
  ];
  for (const progress of scenarios) for (const remaining of [false, true]) {
    const route = selectRoute(ootContent.stops, progress);
    const layout = layoutRoute(route, remaining);
    const points = [...layout.positions.values()];
    for (const [i, point] of points.entries()) {
      assert.ok(point.x >= 24 && point.x <= layout.width - 24);
      assert.ok(point.y >= 24 && point.y <= layout.height - 24);
      for (const other of points.slice(i + 1)) assert.ok(Math.abs(point.x - other.x) >= 48 || Math.abs(point.y - other.y) >= 48);
    }
    for (const edge of layout.connections) {
      assert.ok(route.dependencies[edge.to].includes(edge.from));
      assert.ok(layout.positions.get(edge.from)!.y < layout.positions.get(edge.to)!.y);
      assert.doesNotMatch(edge.path, /NaN|Infinity/);
    }
    function reachable(from: string, to: string): boolean {
      return layout.connections.some((edge) => edge.from === from && (edge.to === to || reachable(edge.to, to)));
    }
    for (const to of layout.positions.keys()) for (const from of route.dependencies[to]) {
      if (layout.positions.has(from)) assert.ok(reachable(from, to), `${from} → ${to}`);
    }
  }
});
