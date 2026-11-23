import assert from "node:assert/strict";
import test from "node:test";
import {
  applyGoBack,
  applyRevealHint,
  applySelectNext,
  buildAdventureView,
  createInitialState,
} from "./adventure-engine.ts";

test("서버 엔진: 미공개 힌트는 뷰모델에 포함되지 않는다", () => {
  const initial = createInitialState();
  const view0 = buildAdventureView(initial);
  assert.equal(view0.card.id, "kokiri-gear");
  assert.equal(view0.card.revealedHints.length, 0);
  assert.equal(view0.card.nextHintLevel, 1);

  const after1 = applyRevealHint(initial, "next");
  const view1 = buildAdventureView(after1);
  assert.equal(view1.card.revealedHints.length, 1);
  assert.equal(view1.card.revealedHints[0]?.isSolution, false);
  assert.equal(view1.card.nextHintLevel, 2);

  const afterAll = applyRevealHint(after1, "all");
  const viewAll = buildAdventureView(afterAll);
  assert.equal(viewAll.card.revealedHints.length, 3);
  assert.equal(viewAll.card.revealedHints[2]?.isSolution, true);
  assert.equal(viewAll.card.hasMoreHints, false);
});

test("서버 엔진: 허용된 다음 카드로 이동 및 이전 카드 복귀", () => {
  const initial = createInitialState();
  const invalid = applySelectNext(initial, "not-allowed");
  assert.equal(invalid.currentCardId, "kokiri-gear");

  const next = applySelectNext(initial, "deku-tree");
  assert.equal(next.currentCardId, "deku-tree");
  assert.deepEqual(next.selectedHistory, ["kokiri-gear"]);

  const viewNext = buildAdventureView(next);
  assert.equal(viewNext.canGoBack, true);
  assert.equal(viewNext.nextChoices.length, 0);

  const back = applyGoBack(next);
  assert.equal(back.currentCardId, "kokiri-gear");
  assert.equal(back.selectedHistory.length, 0);
});
