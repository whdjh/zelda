import assert from "node:assert/strict";
import { test } from "node:test";
import { ootContent } from "../../content/ocarina-of-time/index.ts";
import type { GuideContent } from "./content.ts";
import { validateContent } from "./validate-content.ts";

// 검사 전용 가상 데이터이며 실제 게임 사실이나 배포 콘텐츠가 아니다.
function fixture(): GuideContent {
  const verification = { status: "proposed" as const, version: "test", sourceIds: ["source-1"] };
  return {
    version: "test-1", gameVersion: "test",
    sources: [{ id: "source-1", title: "검사 전용 출처", url: "https://example.com/", version: "test" }],
    items: [{ id: "item-1", title: "검사용 조건", verification }],
    stops: [
      { id: "stop-1", title: "검사용 출발", summary: ["검사용 문장"], kind: "required", prerequisiteStopIds: [], prerequisiteItemIds: [], puzzleIds: ["puzzle-1"], verification },
      { id: "stop-2", title: "검사용 도착", summary: ["검사용 문장"], kind: "required", prerequisiteStopIds: ["stop-1"], prerequisiteItemIds: ["item-1"], puzzleIds: [], verification },
    ],
    puzzles: [{ id: "puzzle-1", stopId: "stop-1", name: "검사용 문제", problemPhrase: "검사용 목표", hints: [{ id: "hint-1", level: 1, text: "검사용 해법" }], verification }],
  };
}

test("빈 콘텐츠를 허용하고 유효한 역·출처·퍼즐 참조를 통과시킨다", () => {
  assert.deepEqual(validateContent(ootContent), []);
  assert.deepEqual(validateContent(fixture()), []);
});

test("순환, 없는 참조, 중복 ID를 검출한다", () => {
  const content = fixture();
  content.stops[0].prerequisiteStopIds = ["stop-2", "missing"];
  content.stops[1].prerequisiteItemIds.push("missing");
  content.sources.push({ ...content.sources[0] });
  const errors = validateContent(content).join("\n");
  assert.match(errors, /순환/);
  assert.match(errors, /없는 선행 역/);
  assert.match(errors, /없는 준비물/);
  assert.match(errors, /중복/);
});

test("요약 길이, 추천 이유, 퍼즐 소속 및 힌트 단계를 검사한다", () => {
  const content = fixture();
  content.stops[0].summary = ["1", "2", "3", "4"];
  content.stops[1].kind = "recommended";
  content.puzzles[0].stopId = "stop-2";
  content.puzzles[0].hints[0].level = 3;
  const errors = validateContent(content).join("\n");
  for (const pattern of [/1~3문장/, /추천 경유/, /소속/, /연속/]) assert.match(errors, pattern);
});

test("출처가 없거나 과거판인 콘텐츠의 검증 승격과 증거 없는 플레이 확인을 막는다", () => {
  const content = fixture();
  content.stops[0].verification = { status: "cross_checked", version: "test", sourceIds: ["source-1"] };
  content.stops[1].verification = { status: "playtested", version: "test", sourceIds: ["missing"] };
  content.sources[0].version = "old";
  const errors = validateContent(content).join("\n");
  for (const pattern of [/과거판/, /두 출처/, /없는 출처/, /검증일/]) assert.match(errors, pattern);
});
