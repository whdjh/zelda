import assert from "node:assert/strict";
import { test } from "node:test";
import { ootContent } from "../../content/ocarina-of-time/index.ts";
import { validateContent } from "./validate-content.ts";
import { createProgress, parseProgress } from "./progress-storage.ts";
import { selectRoute } from "./route-selection.ts";

test("공개 초안은 시작부터 엔딩까지 본문·힌트·출처가 연결된다", () => {
  assert.deepEqual(validateContent(ootContent), []);
  assert.equal(ootContent.stops[0].id, "forest-equipment");
  assert.equal(ootContent.stops.at(-1)?.id, "final-battle");
  for (const stop of ootContent.stops) {
    assert.ok(stop.walkthrough && stop.walkthrough.length >= 3, stop.id);
    assert.ok(stop.puzzleIds.length > 0, stop.id);
    assert.ok(stop.verification.sourceIds.length > 0, stop.id);
    assert.equal(stop.verification.status, "proposed", "직접 플레이 검증으로 잘못 승격하지 않는다");
  }
});

test("실제 노선을 끝까지 진행하되 장비와 시대는 명시적 확인을 요구한다", () => {
  const progress = createProgress(ootContent);
  for (const stop of ootContent.stops) {
    const route = selectRoute(ootContent.stops, progress);
    assert.equal(route.currentId, stop.id);
    if (stop.requiredAge && progress.age !== stop.requiredAge) assert.ok(!route.availableIds.includes(stop.id));
    progress.age = stop.requiredAge ?? progress.age;
    for (const id of stop.prerequisiteItemIds) if (!progress.confirmedItemIds.includes(id)) progress.confirmedItemIds.push(id);
    assert.ok(selectRoute(ootContent.stops, progress).availableIds.includes(stop.id), stop.id);
    progress.completedStopIds.push(stop.id);
    assert.deepEqual(selectRoute(ootContent.stops, progress).conflictIds, []);
  }
  assert.equal(selectRoute(ootContent.stops, progress).currentId, null);
  assert.deepEqual(parseProgress(JSON.stringify(progress), ootContent), progress);
});

test("시대 필드가 없는 기존 백업은 미확인 상태로 읽고 잘못된 시대는 거절한다", () => {
  const old = createProgress(ootContent);
  delete old.age;
  assert.equal(parseProgress(JSON.stringify(old), ootContent).age, "unknown");
  assert.throws(() => parseProgress(JSON.stringify({ ...old, age: "future" }), ootContent), /시대/);
});
