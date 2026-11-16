import type { GuideContent, Verification } from "./content.ts";

export function validateContent(content: GuideContent): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const sources = new Map(content.sources.map((source) => [source.id, source]));
  const stops = new Map(content.stops.map((stop) => [stop.id, stop]));
  const items = new Set(content.items.map((item) => item.id));
  const puzzles = new Map(content.puzzles.map((puzzle) => [puzzle.id, puzzle]));

  function text(value: string, label: string) {
    if (!value.trim()) errors.push(`${label}: 빈 문장입니다.`);
  }

  function register(id: string) {
    if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(id) || ids.has(id)) {
      errors.push(`${id}: 올바르지 않거나 중복된 ID입니다.`);
    }
    ids.add(id);
  }

  function verification(value: Verification, id: string) {
    if (value.version !== content.gameVersion) errors.push(`${id}: 대상 게임판이 다릅니다.`);
    if (value.guideSourceId && !sources.has(value.guideSourceId)) errors.push(`${id}: 없는 참고 공략 ${value.guideSourceId}`);
    if (value.sourceIds.length === 0) errors.push(`${id}: 출처가 필요합니다.`);
    for (const sourceId of value.sourceIds) {
      const source = sources.get(sourceId);
      if (!source) errors.push(`${id}: 없는 출처 ${sourceId}`);
      else if (value.status !== "proposed" && source.version !== content.gameVersion) {
        errors.push(`${id}: 과거판 출처만으로 검증 상태를 승격할 수 없습니다.`);
      }
    }
    if (value.status === "cross_checked" && new Set(value.sourceIds).size < 2) {
      errors.push(`${id}: 교차 확인에는 두 출처가 필요합니다.`);
    }
    if (["playtested", "compared"].includes(value.status)) {
      if (!value.evidence?.trim() || !value.verifiedAt || Number.isNaN(Date.parse(value.verifiedAt))) {
        errors.push(`${id}: 플레이/비교 증거와 검증일이 필요합니다.`);
      }
    }
  }

  text(content.version, "콘텐츠 버전");
  text(content.gameVersion, "게임판");
  for (const source of content.sources) {
    register(source.id);
    text(source.title, source.id);
    text(source.version, source.id);
    if (!URL.canParse(source.url) || new URL(source.url).protocol !== "https:") {
      errors.push(`${source.id}: HTTPS 출처 URL이 필요합니다.`);
    }
  }
  for (const item of content.items) {
    register(item.id);
    text(item.title, item.id);
    verification(item.verification, item.id);
  }
  for (const stop of content.stops) {
    register(stop.id);
    text(stop.title, stop.id);
    verification(stop.verification, stop.id);
    if (stop.routeVerification) verification(stop.routeVerification, stop.id);
    for (const id of stop.rewardItemIds ?? []) if (!items.has(id)) errors.push(`${stop.id}: 없는 획득물 ${id}`);
    if (stop.summary.length < 1 || stop.summary.length > 3) {
      errors.push(`${stop.id}: 행동 요약은 1~3문장이어야 합니다.`);
    }
    stop.summary.forEach((sentence) => text(sentence, stop.id));
    if (stop.walkthrough) {
      if (stop.walkthrough.length === 0) errors.push(`${stop.id}: 상세 공략이 비어 있습니다.`);
      stop.walkthrough.forEach((sentence) => text(sentence, stop.id));
    }
    if (stop.requiredAge && !["child", "adult"].includes(stop.requiredAge)) errors.push(`${stop.id}: 시대 조건이 올바르지 않습니다.`);
    if (stop.kind === "recommended" && !stop.recommendationReason?.trim()) {
      errors.push(`${stop.id}: 추천 경유 이유가 필요합니다.`);
    }
    for (const id of stop.prerequisiteStopIds) {
      if (!stops.has(id)) errors.push(`${stop.id}: 없는 선행 역 ${id}`);
    }
    for (const id of stop.prerequisiteItemIds) {
      if (!items.has(id)) errors.push(`${stop.id}: 없는 준비물 ${id}`);
    }
    for (const id of stop.puzzleIds) {
      if (puzzles.get(id)?.stopId !== stop.id) errors.push(`${stop.id}: 퍼즐 ${id}의 소속이 다릅니다.`);
    }
  }
  for (const tip of content.tips ?? []) {
    register(tip.id); text(tip.title, tip.id); text(tip.text, tip.id); verification(tip.verification, tip.id);
    if (!tip.stopIds.length) errors.push(`${tip.id}: 팁을 연결할 역이 필요합니다.`);
    for (const id of tip.stopIds) if (!stops.has(id)) errors.push(`${tip.id}: 없는 연결 역 ${id}`);
  }
  for (const puzzle of content.puzzles) {
    register(puzzle.id);
    text(puzzle.name, puzzle.id);
    text(puzzle.problemPhrase, puzzle.id);
    verification(puzzle.verification, puzzle.id);
    if (!stops.get(puzzle.stopId)?.puzzleIds.includes(puzzle.id)) {
      errors.push(`${puzzle.id}: 소속 역의 퍼즐 목록에 없습니다.`);
    }
    if (puzzle.hints.length < 1 || puzzle.hints.length > 3) {
      errors.push(`${puzzle.id}: 힌트는 1~3단계여야 합니다.`);
    }
    puzzle.hints.forEach((hint, index) => {
      register(hint.id);
      text(hint.text, hint.id);
      if (hint.level !== index + 1) errors.push(`${hint.id}: 힌트 단계가 연속되지 않습니다.`);
    });
  }

  const visited = new Set<string>();
  const visiting = new Set<string>();
  function visit(id: string) {
    if (visiting.has(id)) {
      errors.push(`${id}: 선행 조건이 순환합니다.`);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    const stop = stops.get(id);
    stop?.prerequisiteStopIds.forEach(visit);
    stop?.prerequisiteItemIds.forEach((item) => {
      const providers = content.stops.filter((entry) => entry.rewardItemIds?.includes(item));
      if (providers.length > 1) errors.push(`${item}: 획득 경유가 중복됩니다.`);
      providers.filter((entry) => entry.id !== id).forEach((entry) => visit(entry.id));
    });
    visiting.delete(id);
    visited.add(id);
  }
  content.stops.forEach((stop) => visit(stop.id));
  return errors;
}
