import type { Verification } from "@/lib/content";
import { ootContent } from "../../../content/ocarina-of-time/index";

// 공략과 퍼즐의 출처·판본·검증 고지를 같은 방식으로 읽을 수 있게 한다.
export function ContentSources({ verification }: { verification: Verification }) {
  const guide = ootContent.sources.find((source) => source.id === verification.guideSourceId);
  const labels = { proposed: "출처 기반 초안", cross_checked: "자료 교차 확인", playtested: "직접 플레이 확인", compared: "판본 비교 확인" };
  return <aside aria-label="출처와 검증 상태" className="mt-x5 border-t border-stroke-neutral-muted pt-x4 t2-regular text-fg-neutral-muted">
    <p>{labels[verification.status]} · Nintendo Switch 2판</p>
    <p className="mt-x2">{verification.caveat}</p>
    {guide && <p className="mt-x2"><a href={guide.url} target="_blank" rel="noreferrer" className="inline-block py-x2 underline">참고 공략: {guide.title} ↗</a></p>}
    <p className="mt-x2">여러 자료를 대조한 초안이며, 참고 공략은 GameWith로 통일했어요. 최단시간은 검증하지 않았어요.</p>
    <p className="mt-x2">외부 자료에는 뒤 구간의 해법도 나올 수 있어요.</p>
  </aside>;
}
