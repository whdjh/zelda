"use client";

import { ActionButton } from "@seed-design/react";
import type { GuideContent } from "@/lib/content";

export function HintReveal({ puzzle, revealedIds, onReveal }: {
  puzzle: GuideContent["puzzles"][number]; revealedIds: string[]; onReveal: (ids: string[]) => void;
}) {
  const next = puzzle.hints.find((hint) => !revealedIds.includes(hint.id));
  const solution = puzzle.hints.at(-1);
  return (
    <section aria-label="퍼즐 도움" className="mt-x5">
      <h2 className="mb-x2 t5-bold">{puzzle.name}</h2>
      <p className="mb-x4 t3-regular">{puzzle.problemPhrase}</p>
      <ol className="flex flex-col gap-x3" aria-live="polite" aria-label="공개한 힌트">
        {puzzle.hints.filter((hint) => revealedIds.includes(hint.id)).map((hint) => (
          <li key={hint.id} className="rounded-r3 bg-bg-neutral-weak p-x4">
            <p className="mb-x2 t3-bold">{hint.id === solution?.id ? "해법" : `힌트 ${hint.level}`}</p>
            <p className="t3-regular">{hint.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-x4 flex flex-wrap gap-x3">
        {next && <ActionButton variant="neutralSolid" onClick={() => onReveal([next.id])}>{next.id === solution?.id ? "해법 보기" : `힌트 ${next.level} 보기`}</ActionButton>}
        {next && next.id !== solution?.id && <ActionButton variant="neutralOutline" onClick={() => onReveal(puzzle.hints.map((hint) => hint.id))}>바로 정답 보기</ActionButton>}
      </div>
    </section>
  );
}
