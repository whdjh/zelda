import type { Verification } from "@/lib/content";
import { ootContent } from "../../../content/ocarina-of-time/index";

// 공략과 퍼즐의 출처·판본·검증 고지를 같은 방식으로 읽을 수 있게 한다.
export function ContentSources({ verification }: { verification: Verification }) {
  const labels = { proposed: "출처 기반 초안", cross_checked: "자료 교차 확인", playtested: "직접 플레이 확인", compared: "판본 비교 확인" };
  return <aside aria-label="출처와 검증 상태" className="mt-x5 border-t border-stroke-neutral-muted pt-x4 t2-regular text-fg-neutral-muted">
    <p>{labels[verification.status]} · Nintendo Switch 2판</p>
    <p className="mt-x2">{verification.caveat}</p>
    <ul className="mt-x2 list-disc pl-x5">
      {verification.sourceIds.map((id) => {
        const source = ootContent.sources.find((entry) => entry.id === id);
        return source && <li key={id}><a href={source.url} target="_blank" rel="noreferrer" className="inline-block py-x2 underline">{source.title} ↗</a></li>;
      })}
    </ul>
    <p className="mt-x2">외부 자료에는 뒤 구간의 해법도 나올 수 있어요.</p>
  </aside>;
}
