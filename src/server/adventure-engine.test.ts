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

test("DB 카탈로그: 외부에서 주입된 신규 카드·힌트도 코드 수정 없이 동작한다", () => {
  const customCatalog = {
    gameId: "oot" as const,
    initialCardId: "db-card-1",
    cards: {
      "db-card-1": {
        id: "db-card-1",
        stepLabel: "DB 테스트",
        title: "도돈고의 동굴",
        icon: "/assets/zelda/sword-shield.png",
        steps: ["폭탄 주머니를 확보합니다."],
        referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563393",
        hintQuestion: "입구가 막혔어요.",
        hints: [
          { id: "db-hint-1", level: 1 as const, text: "절벽 위를 보세요." },
          { id: "db-hint-2", level: 2 as const, text: "폭탄꽃을 던져보세요." },
          { id: "db-hint-3", level: 3 as const, text: "고론의 팔찌로 폭탄꽃을 던져 바위를 부수세요." },
        ],
        nextCardIds: ["db-card-2"],
      },
      "db-card-2": {
        id: "db-card-2",
        stepLabel: "다음",
        title: "조라의 마을",
        icon: "/assets/zelda/ocarina.png",
        steps: ["폭포 앞에서 노래를 연주합니다."],
        referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563310",
        hintQuestion: "",
        hints: [],
        nextCardIds: [],
      },
    },
  };

  const state0 = createInitialState(customCatalog);
  const view0 = buildAdventureView(state0, customCatalog);
  assert.equal(view0.card.id, "db-card-1");
  assert.equal(view0.card.revealedHints.length, 0);
  assert.deepEqual(
    view0.nextChoices.map((c) => c.id),
    ["db-card-2"],
  );

  const state1 = applyRevealHint(state0, "next", customCatalog);
  const view1 = buildAdventureView(state1, customCatalog);
  assert.equal(view1.card.revealedHints[0]?.text, "절벽 위를 보세요.");

  const state2 = applySelectNext(state1, "db-card-2", customCatalog);
  assert.equal(state2.currentCardId, "db-card-2");
});
