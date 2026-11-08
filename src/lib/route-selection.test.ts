import assert from "node:assert/strict";
import { test } from "node:test";
import type { RouteStop } from "./content.ts";
import { isStopVisible, selectRoute } from "./route-selection.ts";

const stops: RouteStop[] = ["a", "b", "c"].map((id, index, ids) => ({
  id, title: `검사용 ${id}`, summary: ["테스트 전용"], kind: "required",
  prerequisiteStopIds: index ? [ids[index - 1]] : [], prerequisiteItemIds: [], puzzleIds: [],
  verification: { status: "proposed", version: "test", sourceIds: ["test"] },
}));

test("완료를 반영하고 되돌리면 다음 목표를 다시 계산한다", () => {
  assert.equal(selectRoute(stops, { completedStopIds: [], confirmedItemIds: [] }).currentId, "a");
  const route = selectRoute(stops, { completedStopIds: ["a"], confirmedItemIds: [] });
  assert.equal(route.currentId, "b");
  assert.equal(route.nextId, "c");
  assert.deepEqual(route.conflictIds, []);
});

test("후반 완료는 앞선 역이나 준비물을 자동 획득하지 않는다", () => {
  const progress = { completedStopIds: ["c"], confirmedItemIds: [] };
  const route = selectRoute(stops, progress);
  assert.deepEqual(route.conflictIds, ["c"]);
  assert.equal(route.currentId, "a");
  assert.deepEqual(progress.completedStopIds, ["c"]);
  const locked = stops.map((stop) => ({ ...stop, prerequisiteItemIds: ["item"] }));
  assert.equal(selectRoute(locked, progress).currentId, null);
  assert.equal(selectRoute(locked, { ...progress, confirmedItemIds: ["item"] }).currentId, "a");
});

test("엄격·기본·전체 모드는 각각 현재·다음·미래 이름을 제한한다", () => {
  const progress = { completedStopIds: [], confirmedItemIds: [] };
  const route = selectRoute(stops, progress);
  assert.equal(isStopVisible("a", "strict", progress, route), true);
  assert.equal(isStopVisible("b", "strict", progress, route), false);
  assert.equal(isStopVisible("b", "default", progress, route), true);
  assert.equal(isStopVisible("c", "default", progress, route), false);
  assert.equal(isStopVisible("c", "full", progress, route), true);
});
