import type { CardCategory, CardId, GameId } from "../api/types.ts";

export interface CatalogHint {
  id: string;
  level: 1 | 2 | 3;
  text: string;
}

export interface CatalogCard {
  id: CardId;
  category: CardCategory;
  stepLabel: string;
  title: string;
  icon: string;
  steps: readonly string[];
  referenceUrl: string;
  hintQuestion: string;
  hints: readonly CatalogHint[];
  requiresFlags: readonly string[];
  grantsFlags: readonly string[];
  priority: number;
  boostWhenFlags: readonly string[];
  sortOrder: number;
}

export interface AdventureCatalog {
  gameId: GameId;
  initialCardId: CardId;
  cards: Record<CardId, CatalogCard>;
}

// Supabase zhp_cards / zhp_hints 미생성·오프라인 환경용 폴백 시드 카탈로그
export const DEFAULT_OOT_CATALOG: AdventureCatalog = {
  gameId: "oot",
  initialCardId: "kokiri-gear",
  cards: {
    "kokiri-gear": {
      id: "kokiri-gear",
      category: "main",
      stepLabel: "1단계",
      title: "출발 장비 확보",
      icon: "/assets/zelda/sword-shield.png",
      steps: [
        "코키리 숲에서 검과 방패를 구해 장착합니다.",
        "장비를 갖춘 뒤 마을 동쪽 길목의 미도에게 말을 겁니다.",
      ],
      referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563396",
      hintQuestion: "검과 방패를 어디서 얻는지 모르겠어요.",
      hints: [
        { id: "kokiri-gear-1", level: 1, text: "마을 남서쪽 훈련장과 상점을 살펴보세요." },
        {
          id: "kokiri-gear-2",
          level: 2,
          text: "훈련장 낮은 통로 너머에 바위가 굴러다니고, 방패는 40루피가 필요해요.",
        },
        {
          id: "kokiri-gear-3",
          level: 3,
          text: "훈련장 낮은 통로에서 바위를 피해 상자의 검을 얻고, 상점에서 40루피로 방패를 산 뒤 둘 다 장착하세요.",
        },
      ],
      requiresFlags: [],
      grantsFlags: ["kokiri-gear-done"],
      priority: 100,
      boostWhenFlags: [],
      sortOrder: 10,
    },
    "deku-tree": {
      id: "deku-tree",
      category: "main",
      stepLabel: "2단계",
      title: "데크나무님 속",
      icon: "/assets/zelda/adventure-emblem.png",
      steps: [
        "동쪽 길목을 지나 데크나무 안으로 들어가 요정의 새총을 확보합니다.",
        "거미줄을 뚫고 지하로 내려가 보스를 쓰러뜨린 뒤 코키리의 에메랄드를 얻습니다.",
      ],
      referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563395",
      hintQuestion: "1층 중앙 거미줄을 못 뚫고 막혔어요.",
      hints: [
        { id: "deku-tree-1", level: 1, text: "중앙 1층 바닥 거미줄을 더 높은 층에서 내려다보세요." },
        {
          id: "deku-tree-2",
          level: 2,
          text: "2층에서 뛰어내리면 튕겨 올라와요. 더 높은 3층 난간까지 올라가야 합니다.",
        },
        {
          id: "deku-tree-3",
          level: 3,
          text: "3층 난간에서 1층 거미줄 정중앙을 향해 뛰어내리면 거미줄을 뚫고 지하로 내려갑니다.",
        },
      ],
      requiresFlags: ["kokiri-gear-done"],
      grantsFlags: ["deku-tree-done", "fairy-ocarina"],
      priority: 95,
      boostWhenFlags: [],
      sortOrder: 20,
    },
    "hyrule-castle": {
      id: "hyrule-castle",
      category: "main",
      stepLabel: "3단계",
      title: "하이랄 성 잠입",
      icon: "/assets/zelda/adventure-emblem.png",
      steps: [
        "숲 출구 다리에서 요정의 오카리나를 받고 성하마을로 갑니다. (약국 벌레 잡기로 첫 빈 병도 챙길 수 있음)",
        "성 앞 말론에게 신기한 알을 받아 성문을 넘고, 자고 있는 타론을 깨워 안뜰로 들어갑니다.",
        "경비병을 피해 젤다 공주에게 편지를, 임파에게 젤다의 자장가를 배웁니다.",
      ],
      referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563394",
      hintQuestion: "성문이 닫혀 있어서 안으로 못 들어가요.",
      hints: [
        {
          id: "hyrule-castle-1",
          level: 1,
          text: "닫힌 성문 앞에서 말론이 서 있는 쪽 벽면을 살펴보세요.",
        },
        {
          id: "hyrule-castle-2",
          level: 2,
          text: "담쟁이덩굴을 타고 성문 위로 올라가면 반대편 사다리로 내려갈 수 있어요.",
        },
        {
          id: "hyrule-castle-3",
          level: 3,
          text: "말론 옆 담쟁이덩굴로 성문을 넘은 뒤, 부화한 꼬꼬로 해자 옆 타론을 깨우고 상자를 밀어 배수구로 들어가세요.",
        },
      ],
      requiresFlags: ["deku-tree-done"],
      grantsFlags: ["zelda-letter", "zelda-lullaby", "talon-awake"],
      priority: 90,
      boostWhenFlags: [],
      sortOrder: 30,
    },
    "goron-main": {
      id: "goron-main",
      category: "main",
      stepLabel: "메인 직행",
      title: "데스마운틴 & 고론 시티",
      icon: "/assets/zelda/sword-shield.png",
      steps: [
        "카카리코 마을 북쪽 관문에서 젤다의 편지를 보여주고 등산로로 오릅니다.",
        "고론 시티 최하층 문 앞에서 젤다의 자장가를 연주해 족장 다루니아를 만납니다.",
        "이후 도돈고의 동굴 진입 준비로 이어집니다.",
      ],
      referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563393",
      hintQuestion: "",
      hints: [],
      requiresFlags: ["zelda-letter", "zelda-lullaby"],
      grantsFlags: ["goron-city-visited"],
      priority: 85,
      boostWhenFlags: [],
      sortOrder: 40,
    },
    "kakariko-prep": {
      id: "kakariko-prep",
      category: "safety",
      stepLabel: "안전 준비",
      title: "카카리코 생존 · 태양의 노래",
      icon: "/assets/zelda/fairy-bottle.png",
      steps: [
        "카카리코 마을에서 흩어진 닭 7마리를 울타리에 모아 빈 병을 챙깁니다.",
        "밤에 마을 뒤 묘지에서 꽃이 놓인 비석을 당겨 하일리아 방패를 무료로 얻습니다. (소년기에는 웅크려 불·낙석을 막는 용도)",
        "묘지 안쪽 왕가의 무덤 앞에서 젤다의 자장가를 연주해 태양의 노래를 배웁니다.",
      ],
      referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/570653",
      hintQuestion: "묘지 비석이 안 움직이거나 왕가의 무덤이 안 열려요.",
      hints: [
        {
          id: "kakariko-prep-1",
          level: 1,
          text: "묘지에서는 낮과 밤에 할 수 있는 행동이 달라요. 민가 침대로도 밤을 만들 수 있습니다.",
        },
        {
          id: "kakariko-prep-2",
          level: 2,
          text: "방패가 숨겨진 비석은 밤에만 당길 수 있고, 왕가의 무덤 앞 바닥에는 트라이포스 문양이 있어요.",
        },
        {
          id: "kakariko-prep-3",
          level: 3,
          text: "밤에 꽃이 놓인 비석 뒤에서 당겨 방패를 챙기고, 가장 안쪽 왕가의 무덤 문양 위에서 젤다의 자장가를 연주하세요.",
        },
      ],
      requiresFlags: ["zelda-lullaby"],
      grantsFlags: ["bottle-kakariko", "hylian-shield", "suns-song"],
      priority: 80,
      boostWhenFlags: [],
      sortOrder: 41,
    },
    "songs-route": {
      id: "songs-route",
      category: "utility",
      stepLabel: "노래 선행",
      title: "론론 목장 · 미혹의 숲",
      icon: "/assets/zelda/ocarina.png",
      steps: [
        "낮에 하이랄 평원 중앙 론론 목장에서 말론에게 오카리나를 꺼내 에포나의 노래를 배웁니다.",
        "목장 건물 안 타론의 슈퍼 닭 찾기 미니게임으로 빈 병을 하나 더 챙길 수 있습니다.",
        "코키리 숲의 미혹의 숲에서 음악 소리가 커지는 통로를 따라 숲의 성역으로 가면 사리아의 노래를 미리 배웁니다.",
      ],
      referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/570656",
      hintQuestion: "미혹의 숲에서 자꾸 입구로 돌아와요.",
      hints: [
        {
          id: "songs-route-1",
          level: 1,
          text: "갈림길 통로 입구에 가까이 서서 배경 음악 소리가 커지는지 들어보세요.",
        },
        {
          id: "songs-route-2",
          level: 2,
          text: "음악 소리가 또렷하게 커지는 통로가 다음 정답 방향이에요.",
        },
        {
          id: "songs-route-3",
          level: 3,
          text: "미혹의 숲 입구에서 오른쪽 → 왼쪽 → 오른쪽 → 왼쪽 → 직진 → 왼쪽 → 오른쪽 순서로 가면 숲의 성역에 도착합니다.",
        },
      ],
      requiresFlags: ["zelda-letter", "talon-awake"],
      grantsFlags: ["eponas-song", "sarias-song", "bottle-ranch"],
      priority: 75,
      boostWhenFlags: ["goron-city-visited"],
      sortOrder: 42,
    },
  },
};
