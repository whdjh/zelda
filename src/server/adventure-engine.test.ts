import assert from "node:assert/strict";
import test from "node:test";
import { getMessages } from "../i18n/index.ts";
import {
  applyGoBack,
  applyRevealHint,
  applySelectNext,
  buildAdventureView,
  createInitialState,
} from "./adventure-engine.ts";

test("백엔드 격리: 클라이언트 i18n 사전에는 카드·힌트 원본이 포함되지 않는다", () => {
  const clientMessages = getMessages() as Record<string, unknown>;
  assert.equal("cards" in clientMessages, false);
  assert.equal("hints" in clientMessages, false);
});

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

  const deku = applySelectNext(initial, "deku-tree");
  assert.equal(deku.currentCardId, "deku-tree");
  assert.deepEqual(deku.selectedHistory, ["kokiri-gear"]);

  const viewDeku = buildAdventureView(deku);
  assert.equal(viewDeku.canGoBack, true);
  assert.equal(viewDeku.card.totalHints, 3);
  assert.equal(viewDeku.card.revealedHints.length, 0);
  assert.deepEqual(
    viewDeku.nextChoices.map((c) => c.id),
    ["hyrule-castle"],
  );

  const back = applyGoBack(deku);
  assert.equal(back.currentCardId, "kokiri-gear");
  assert.equal(back.selectedHistory.length, 0);
});

test("서버 엔진: 하이랄 성 이후 3갈래 증강 카드 선택 및 복귀", () => {
  const deku = applySelectNext(createInitialState(), "deku-tree");
  const castle = applySelectNext(deku, "hyrule-castle");
  const castleView = buildAdventureView(castle);

  assert.equal(castleView.card.id, "hyrule-castle");
  assert.equal(castleView.card.totalHints, 3);
  assert.equal(castleView.card.revealedHints.length, 0);
  assert.deepEqual(
    castleView.nextChoices.map((c) => c.id),
    ["goron-main", "kakariko-prep", "songs-route"],
  );

  const prep = applySelectNext(castle, "kakariko-prep");
  const prepView = buildAdventureView(prep);
  assert.equal(prepView.card.id, "kakariko-prep");
  assert.equal(prepView.card.totalHints, 3);
  assert.equal(prepView.card.revealedHints.length, 0);
  assert.equal(prepView.nextChoices.length, 0);

  const backToCastle = applyGoBack(prep);
  assert.equal(backToCastle.currentCardId, "hyrule-castle");
});
