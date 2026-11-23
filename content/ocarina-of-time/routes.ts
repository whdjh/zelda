import { draft } from "./sources.ts";

// 연결은 추천 목차가 아닌 조건이다. 분기 추론의 한계는 조사 기록 06에 남긴다.
export const routeRules: Record<string, { before: string[]; rewards: string[]; sources: string[]; note: string }> = {
  "forest-equipment": { before: [], rewards: ["sword-shield"], sources: ["gw-opening"], note: "출발 장비를 준비하는 구간입니다." },
  "deku-depths": { before: ["forest-equipment"], rewards: ["slingshot"], sources: ["gw-deku"], note: "첫 던전의 탐색과 새총 획득 구간입니다." },
  "deku-guardian": { before: ["deku-depths"], rewards: [], sources: ["gw-deku"], note: "첫 정령석을 얻는 구간입니다." },
  "royal-meeting": { before: ["deku-guardian"], rewards: ["royal-letter-lullaby"], sources: ["gw-castle"], note: "성에서 받은 편지와 곡은 이후 준비 조건으로 따로 확인합니다." },
  "mountain-access": { before: ["royal-meeting"], rewards: ["goron-bracelet"], sources: ["zd-dodongo"], note: "편지·노래를 이용하는 산길 준비 구간입니다." },
  "dodongo-tools": { before: ["mountain-access"], rewards: ["bomb-bag"], sources: ["gw-dodongo"], note: "폭탄을 얻은 시점과 동굴의 보스 완료는 별개로 기록합니다." },
  "dodongo-guardian": { before: ["dodongo-tools"], rewards: ["din-fire"], sources: ["gw-fairies", "nl-fairies"], note: "보스 뒤 산 정상의 샘도 확인하세요. 마법은 직접 습득했을 때만 보유로 표시합니다." },
  "zora-audience": { before: ["royal-meeting"], rewards: ["bottle"], sources: ["gw-jabu"], note: "이 안내의 강길은 폭탄을 사용합니다. 동굴 보스 완료를 강의 진입 조건으로 붙이지 않습니다." },
  "jabu-rescue": { before: ["zora-audience"], rewards: ["boomerang"], sources: ["gw-jabu"], note: "병을 이용해 입장하고 부메랑을 찾는 구간입니다." },
  "jabu-guardian": { before: ["jabu-rescue"], rewards: [], sources: ["gw-jabu"], note: "이 구간 완료는 다른 두 정령석의 획득을 뜻하지 않습니다." },
  "time-door": { before: ["deku-guardian", "dodongo-guardian", "jabu-guardian"], rewards: [], sources: ["zd-time"], note: "세 정령석 경로가 합류합니다. 시대는 게임 화면을 보고 따로 확인하세요." },
  "adult-preparation": { before: ["time-door"], rewards: ["hookshot", "storm-song"], sources: ["gw-forest", "gw-well"], note: "훅샷과 폭풍의 노래를 각각 확인하면 다른 준비 경로에 반영됩니다." },
  "forest-bow": { before: ["time-door"], rewards: ["bow"], sources: ["gw-forest"], note: "활을 얻었다면 보스를 완료하기 전에도 보유 기록을 바꿀 수 있습니다." },
  "forest-guardian": { before: ["forest-bow"], rewards: [], sources: ["gw-forest", "gw-well"], note: "숲의 신전 이후 시간의 신전에서 소년 시대로 돌아가는 길을 확인합니다." },
  "fire-hammer": { before: ["time-door"], rewards: ["hammer"], sources: ["gw-fire", "nl-fire"], note: "훅샷과 폭탄으로 접근합니다. 현재 상세 공략의 눈 스위치를 위해 활 조건은 유지합니다. 숲 보스 완료는 별도입니다." },
  "fire-guardian": { before: ["fire-hammer"], rewards: [], sources: ["gw-fire"], note: "해머 획득 이후 불의 신전을 마무리합니다." },
  "ice-equipment": { before: ["time-door"], rewards: ["iron-boots-tunic"], sources: ["gw-ice", "nl-ice"], note: "청년의 조라 지역에서 병으로 준비하는 경로입니다. 불의 신전 완료를 요구하는 조건은 자료에서 확인되지 않아 분리한 초안입니다." },
  "water-levels": { before: ["time-door"], rewards: [], sources: ["gw-water", "nl-water"], note: "수중 장비·훅샷·활을 준비하면 물 방면을 검토할 수 있습니다. 불 보스 완료와 분리한 초안입니다." },
  "water-guardian": { before: ["water-levels"], rewards: ["longshot", "fire-arrows"], sources: ["gw-water"], note: "이 안내의 보스 열쇠 경로는 해머를 사용합니다. 롱샷 획득과 보스 완료, 이후 불의 화살 획득은 각각 직접 기록하세요." },
  "well-lens": { before: ["forest-guardian"], rewards: ["lens"], sources: ["gw-well", "fb-songs"], note: "소년으로 돌아가는 조건과 폭풍의 노래가 필요합니다. 물의 신전 완료는 우물의 선행 조건으로 사용하지 않습니다." },
  "shadow-boots": { before: ["forest-guardian", "fire-guardian", "water-guardian"], rewards: ["hover-boots"], sources: ["gw-shadow", "fb-songs"], note: "세 신전 뒤 카카리코 사건과 입장곡을 확인하세요. 렌즈·마법 준비가 별도로 필요합니다." },
  "shadow-guardian": { before: ["shadow-boots"], rewards: [], sources: ["gw-shadow"], note: "현재 판본의 상세 공략은 해머를 사용하는 구간을 포함합니다." },
  "gerudo-rescue": { before: ["time-door"], rewards: [], sources: ["gw-gerudo"], note: "현재 안내는 롱샷 경로입니다. 에포나로 다리를 건너는 대안은 확인했지만 요새 내부 대체 동선은 추가 검수 대상입니다." },
  "desert-crossing": { before: ["gerudo-rescue"], rewards: ["spirit-song"], sources: ["gw-gerudo", "gw-spirit"], note: "요새 통행 이후 롱샷과 렌즈를 사용하는 사막 경로입니다. 어둠 보스 완료를 요구하지 않습니다." },
  "spirit-child": { before: ["forest-guardian"], rewards: ["silver-gauntlets"], sources: ["gw-spirit", "gw-well"], note: "소년으로 돌아가는 조건과 사막 귀환곡이 합류합니다." },
  "spirit-adult": { before: ["spirit-child"], rewards: ["mirror-shield"], sources: ["gw-spirit"], note: "소년 구간의 장비를 갖추고 청년으로 돌아와 진행합니다." },
  "spirit-guardian": { before: ["spirit-adult"], rewards: ["light-arrows"], sources: ["gw-spirit"], note: "빛의 화살은 신전 완료만으로 자동 획득하지 않습니다. 다른 신전 진행과 시간의 신전 사건을 확인하세요." },
  "castle-barriers": { before: ["forest-guardian", "fire-guardian", "water-guardian", "shadow-guardian", "spirit-guardian"], rewards: [], sources: ["gw-ganon-castle"], note: "특수 우회를 쓰지 않는 이 안내에서는 다섯 신전 경로를 합칩니다. 게임 내부의 최소 이벤트 조건이나 최단 경로를 뜻하지 않습니다. 여섯 결계는 한 구간으로 안내합니다." },
  "tower-escape": { before: ["castle-barriers"], rewards: [], sources: ["gw-ganon-castle"], note: "결계 해제 뒤 탑과 탈출로 이어집니다." },
  "final-battle": { before: ["tower-escape"], rewards: [], sources: ["gw-ganon"], note: "엔딩 확인은 사용자가 직접 기록합니다." },
};

export function routeData(id: string) {
  const rule = routeRules[id];
  if (!rule) throw new Error(`노선 근거가 없는 역: ${id}`);
  return { prerequisiteStopIds: rule.before, rewardItemIds: rule.rewards, routeNote: rule.note,
    routeVerification: draft(rule.sources, "출처의 접근 조건을 연결한 경로 초안입니다. 대체 순서·총시간은 직접 플레이로 검증하지 않았습니다.") };
}
