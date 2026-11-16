import { draft } from "./sources.ts";

export const routeTips = [
  { id: "ice-bottles", stopIds: ["ice-equipment"], title: "이미 가진 빈 병 활용", text: "빈 병이 여러 개 있다면 푸른 불을 나눠 담아 재충전 왕복을 줄일 수 있어요. 병을 새로 구하는 시간까지 비교한 팁은 아니에요.", verification: draft(["nl-ice"]) },
  { id: "fire-optional-song", stopIds: ["fire-hammer"], title: "추가 수집과 진행 구분", text: "허수아비 노래는 추가 상자와 수집에 유용한 선택 사항으로 안내돼 있어요. 현재 엔딩 경로의 필수 준비물에는 포함하지 않았어요.", verification: draft(["nl-fire"]) },
  { id: "water-magic", stopIds: ["water-levels", "water-guardian"], title: "전투 준비 선택지", text: "딘의 불꽃은 내부의 특정 전투에 도움이 되는 선택지로 소개돼 있어요. 물의 신전 입장 조건과는 구분해요.", verification: draft(["nl-water"]) },
  { id: "gerudo-horse-candidate", stopIds: ["gerudo-rescue"], title: "다리를 건너는 다른 방법", text: "에포나로 다리를 건너는 방법도 자료에 있어요. 다만 이 앱의 요새 내부 안내는 롱샷을 사용하므로, 말만 보유한 전체 대체 경로는 추가 검수 중이에요.", verification: draft(["gw-gerudo"]) },
];
