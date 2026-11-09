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
    assert.ok(route.neededIds.includes(stop.id), stop.id);
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


test("청년 시작에서 얼음·숲 준비가 병렬이며 활만 얻고 다른 신전으로 갈 수 있다", () => {
  const progress = { ...createProgress(ootContent), completedStopIds: ["time-door"], age: "adult" as const, confirmedItemIds: ["bottle", "hookshot", "bow", "bomb-bag", "iron-boots-tunic"] };
  const route = selectRoute(ootContent.stops, progress);
  for (const id of ["ice-equipment", "forest-bow", "fire-hammer", "water-levels"]) assert.ok(route.availableIds.includes(id), id);
  assert.ok(!route.neededIds.includes("ice-equipment"), "장비가 있으면 획득 경유를 제외한다");
  assert.ok(!route.dependencies["water-levels"].includes("fire-guardian"));
  assert.ok(!route.dependencies["fire-hammer"].includes("forest-guardian"));
  assert.ok(!progress.completedStopIds.includes("forest-guardian"));
});

test("목적지·장비·완료 취소가 남은 연결과 배치를 바꾼다", () => {
  const progress = { ...createProgress(ootContent), completedStopIds: ["time-door"], goalStopId: "water-levels" };
  const initial = selectRoute(ootContent.stops, progress);
  assert.ok(initial.neededIds.includes("ice-equipment"));
  assert.ok(initial.neededIds.includes("forest-bow"));
  assert.ok(!initial.neededIds.includes("fire-guardian"));
  const equipped = selectRoute(ootContent.stops, { ...progress, confirmedItemIds: ["iron-boots-tunic", "hookshot", "bow"] });
  assert.deepEqual(equipped.neededIds, ["water-levels"]);
  assert.notDeepEqual(initial.layers, equipped.layers);
  assert.deepEqual(selectRoute(ootContent.stops, { ...progress, completedStopIds: ["water-levels"] }).neededIds, []);
  assert.ok(selectRoute(ootContent.stops, progress).neededIds.length > 1);
});

test("우물·사막 경로에 불필요한 앞 목차 완료를 요구하지 않는다", () => {
  const progress = { ...createProgress(ootContent), age: "child" as const, completedStopIds: ["forest-guardian"], confirmedItemIds: ["storm-song"] };
  assert.ok(selectRoute(ootContent.stops, progress).availableIds.includes("well-lens"));
  const desert = selectRoute(ootContent.stops, { ...progress, age: "adult", completedStopIds: ["gerudo-rescue"], confirmedItemIds: ["longshot", "lens"] });
  assert.ok(desert.availableIds.includes("desert-crossing"));
  assert.ok(!desert.dependencies["desert-crossing"].includes("shadow-guardian"));
});

test("획득 경유를 완료해도 장비 확인을 생략하지 않으며 과거 기록을 자동 채우지 않는다", () => {
  const progress = { ...createProgress(ootContent), completedStopIds: ["time-door", "ice-equipment"], goalStopId: "water-levels" };
  const route = selectRoute(ootContent.stops, progress);
  assert.ok(route.requirements["water-levels"].items.includes("iron-boots-tunic"));
  assert.ok(!route.neededIds.includes("forest-equipment"));
  assert.deepEqual(progress.confirmedItemIds, []);
  assert.deepEqual(progress.completedStopIds, ["time-door", "ice-equipment"]);
});

test("목적지는 백업 검증 대상이며 이전 기본 공개 설정을 전체로 이행한다", () => {
  const progress = { ...createProgress(ootContent), goalStopId: "water-levels" };
  assert.deepEqual(parseProgress(JSON.stringify(progress), ootContent), progress);
  assert.throws(() => parseProgress(JSON.stringify({ ...progress, goalStopId: "invalid" }), ootContent), /목적지/);
  assert.equal(parseProgress(JSON.stringify({ ...progress, spoilerLevel: "default" }), ootContent).spoilerLevel, "full");
});
