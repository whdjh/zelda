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
import type { AdventureCatalog } from "./oot-catalog.ts";

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

test("서버 엔진: 선형 해금 및 이전 카드 복귀 시 완료 상태가 복원된다", () => {
  const initial = createInitialState();
  const invalid = applySelectNext(initial, "hyrule-castle");
  assert.equal(invalid.currentCardId, "kokiri-gear");

  const deku = applySelectNext(initial, "deku-tree");
  assert.equal(deku.currentCardId, "deku-tree");
  assert.deepEqual(deku.completedCards, ["kokiri-gear"]);

  const viewDeku = buildAdventureView(deku);
  assert.equal(viewDeku.canGoBack, true);
  assert.deepEqual(
    viewDeku.nextChoices.map((c) => c.id),
    ["hyrule-castle"],
  );

  const back = applyGoBack(deku);
  assert.equal(back.currentCardId, "kokiri-gear");
  assert.deepEqual(back.completedCards, []);
});

test("풀 추천: 비선형 순서(2 → 3 → 1)로 진행해도 막다른 길 없이 남은 카드가 이어진다", () => {
  const deku = applySelectNext(createInitialState(), "deku-tree");
  const castle = applySelectNext(deku, "hyrule-castle");
  const castleView = buildAdventureView(castle);

  assert.deepEqual(
    castleView.nextChoices.map((c) => c.id),
    ["goron-main", "kakariko-prep", "songs-route"],
  );

  // 2번(카카리코 생존)을 먼저 선택해도 남은 1번(메인)·3번(노래)이 바로 추천된다
  const prep = applySelectNext(castle, "kakariko-prep");
  const prepView = buildAdventureView(prep);
  assert.deepEqual(
    prepView.nextChoices.map((c) => c.id),
    ["goron-main", "songs-route"],
  );

  // 3번(노래 선행)까지 마치면 남은 1번(고론 시티)이 단일 다음 단계로 이어진다
  const songs = applySelectNext(prep, "songs-route");
  const songsView = buildAdventureView(songs);
  assert.deepEqual(
    songsView.nextChoices.map((c) => c.id),
    ["goron-main"],
  );

  // 1번까지 완료하면 남은 풀은 0개
  const goron = applySelectNext(songs, "goron-main");
  assert.equal(buildAdventureView(goron).nextChoices.length, 0);
});

test("풀 추천: 고론 시티 직행 시 사리아의 노래 카드가 시점 가산점으로 최우선 추천된다", () => {
  const deku = applySelectNext(createInitialState(), "deku-tree");
  const castle = applySelectNext(deku, "hyrule-castle");
  const goron = applySelectNext(castle, "goron-main");
  const goronView = buildAdventureView(goron);

  assert.deepEqual(
    goronView.nextChoices.map((c) => c.id),
    ["songs-route", "kakariko-prep"],
  );
});

test("풀 추천: 열린 후보가 4장 이상일 때 메인 1장 + 최고 추천 2장만 Top 3로 선별한다", () => {
  const richCatalog: AdventureCatalog = {
    gameId: "oot",
    initialCardId: "start",
    cards: {
      start: {
        id: "start",
        category: "main",
        stepLabel: "시작",
        title: "시작",
        icon: "/assets/zelda/adventure-emblem.png",
        steps: ["출발"],
        referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563310",
        hintQuestion: "",
        hints: [],
        requiresFlags: [],
        grantsFlags: ["open"],
        priority: 100,
        boostWhenFlags: [],
        sortOrder: 1,
      },
      "main-next": {
        id: "main-next",
        category: "main",
        stepLabel: "메인",
        title: "도돈고의 동굴",
        icon: "/assets/zelda/sword-shield.png",
        steps: ["폭탄 확보"],
        referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563393",
        hintQuestion: "",
        hints: [],
        requiresFlags: ["open"],
        grantsFlags: ["bombs"],
        priority: 60,
        boostWhenFlags: [],
        sortOrder: 2,
      },
      "side-low": {
        id: "side-low",
        category: "utility",
        stepLabel: "낮은 우선순위",
        title: "미니게임",
        icon: "/assets/zelda/ocarina.png",
        steps: ["사격장"],
        referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563310",
        hintQuestion: "",
        hints: [],
        requiresFlags: ["open"],
        grantsFlags: [],
        priority: 40,
        boostWhenFlags: [],
        sortOrder: 3,
      },
      "side-high": {
        id: "side-high",
        category: "safety",
        stepLabel: "높은 추천",
        title: "대요정의 샘",
        icon: "/assets/zelda/fairy-bottle.png",
        steps: ["회전베기 획득"],
        referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563324",
        hintQuestion: "",
        hints: [],
        requiresFlags: ["open"],
        grantsFlags: ["magic"],
        priority: 95,
        boostWhenFlags: [],
        sortOrder: 4,
      },
      "side-boosted": {
        id: "side-boosted",
        category: "utility",
        stepLabel: "시점 추천",
        title: "에포나의 노래",
        icon: "/assets/zelda/ocarina.png",
        steps: ["말 호출 노래"],
        referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563310",
        hintQuestion: "",
        hints: [],
        requiresFlags: ["open"],
        grantsFlags: ["epona"],
        priority: 70,
        boostWhenFlags: ["open"],
        sortOrder: 5,
      },
    },
  };

  const view = buildAdventureView(createInitialState(richCatalog), richCatalog);
  // 메인(main-next)이 1순위 고정, 나머지 풀 중 점수 높은 side-boosted(100)·side-high(95)가 2·3순위, side-low(40)는 제외
  assert.deepEqual(
    view.nextChoices.map((c) => c.id),
    ["main-next", "side-boosted", "side-high"],
  );
});
