"use client";

import { ActionButton } from "@seed-design/react";
import { useState } from "react";
import { CARDS, type CardId } from "@/data/cards";
import { getMessages } from "@/i18n";
import type { AdventureProgress } from "@/lib/adventure-progress";

interface AdventureCardFlowProps {
  progress: AdventureProgress;
  onUpdate: (next: AdventureProgress) => void;
}

export function AdventureCardFlow({ progress, onUpdate }: AdventureCardFlowProps) {
  const t = getMessages();
  const [hintOpen, setHintOpen] = useState(false);

  const card = CARDS[progress.currentCardId];
  const copy = t.cards[card.id];
  const revealedForCard = card.hintIds.filter((id) => progress.revealedHints.includes(id));
  const nextHintId = card.hintIds.find((id) => !progress.revealedHints.includes(id));
  const nextHintLevel = revealedForCard.length + 1;

  function revealHints(ids: string[]) {
    onUpdate({
      ...progress,
      revealedHints: [...new Set([...progress.revealedHints, ...ids])],
    });
  }

  function goToCard(nextId: CardId, pushHistory: boolean) {
    setHintOpen(false);
    onUpdate({
      ...progress,
      currentCardId: nextId,
      selectedHistory: pushHistory
        ? [...progress.selectedHistory, card.id]
        : progress.selectedHistory.slice(0, -1),
    });
  }

  const prevCardId = progress.selectedHistory.at(-1);
  const nextCardId = card.nextCardIds.length === 1 ? card.nextCardIds[0] : undefined;

  return (
    <section className="rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default p-x6">
      <div className="mb-x4 flex items-center justify-between gap-x3">
        <span className="rounded-r2 bg-bg-brand-weak px-x2 py-x1 t2-bold text-fg-brand-contrast">
          {copy.stepLabel}
        </span>
        {prevCardId && (
          <button
            type="button"
            onClick={() => goToCard(prevCardId, false)}
            className="t2-regular text-fg-neutral-subtle underline"
          >
            {t.guide.prevStep}
          </button>
        )}
      </div>

      <div className="mb-x5 flex items-center gap-x3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.icon}
          alt=""
          className="h-14 w-14 shrink-0 rounded-r3 object-cover"
        />
        <h2 className="t6-bold text-fg-neutral">{copy.title}</h2>
      </div>

      <ul className="mb-x5 flex flex-col gap-x2">
        {copy.steps.map((step) => (
          <li
            key={step}
            className="rounded-r3 bg-bg-neutral-muted px-x4 py-x3 t3-regular text-fg-neutral"
          >
            {step}
          </li>
        ))}
      </ul>

      <a
        href={card.referenceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-x5 flex min-h-11 items-center justify-between rounded-r3 border border-stroke-neutral-muted px-x4 t3-bold text-fg-neutral-muted"
      >
        <span>{t.guide.referenceLabel}</span>
      </a>

      {card.hintIds.length > 0 && hintOpen && (
        <div className="mb-x5 rounded-r3 border border-stroke-neutral-muted bg-bg-neutral-muted p-x4">
          <div className="mb-x3 flex items-center gap-x2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/zelda/hint-fairy.png"
              alt=""
              className="h-8 w-8 shrink-0 rounded-r2 object-cover"
            />
            <p className="t3-bold text-fg-neutral">{copy.hintQuestion}</p>
          </div>

          {revealedForCard.length > 0 && (
            <ol className="mb-x3 flex flex-col gap-x2" aria-live="polite">
              {revealedForCard.map((id, index) => {
                const level = (index + 1) as 1 | 2 | 3;
                const isSolution = level === 3;
                return (
                  <li
                    key={id}
                    className={
                      isSolution
                        ? "rounded-r3 bg-bg-warning-weak p-x3"
                        : "rounded-r3 bg-bg-layer-default p-x3"
                    }
                  >
                    <p
                      className={
                        isSolution
                          ? "mb-x1 t2-bold text-fg-warning-contrast"
                          : "mb-x1 t2-bold text-fg-informative"
                      }
                    >
                      {t.guide.hintLevels[level]}
                    </p>
                    <p className="t3-regular text-fg-neutral">{t.hints[id]}</p>
                  </li>
                );
              })}
            </ol>
          )}

          {nextHintId && (
            <div className="flex flex-wrap gap-x2">
              <ActionButton
                variant="brandSolid"
                size="small"
                onClick={() => revealHints([nextHintId])}
              >
                {nextHintLevel === 1
                  ? t.guide.nextHint1
                  : nextHintLevel === 2
                    ? t.guide.nextHint2
                    : t.guide.showSolution}
              </ActionButton>
              {nextHintLevel < 3 && (
                <ActionButton
                  variant="neutralWeak"
                  size="small"
                  onClick={() => revealHints(card.hintIds)}
                >
                  {t.guide.solveNow}
                </ActionButton>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-x2">
        {card.hintIds.length > 0 && (
          <ActionButton
            variant="neutralWeak"
            size="large"
            className="flex-1"
            onClick={() => setHintOpen((open) => !open)}
          >
            {hintOpen ? t.guide.closeHint : t.guide.openHint}
          </ActionButton>
        )}
        {nextCardId ? (
          <ActionButton
            variant="brandSolid"
            size="large"
            className="flex-1"
            onClick={() => goToCard(nextCardId, true)}
          >
            {t.guide.completeNext}
          </ActionButton>
        ) : (
          <p className="flex flex-1 items-center justify-center rounded-r3 bg-bg-neutral-muted px-x4 py-x3 t3-regular text-fg-neutral-muted">
            {t.guide.nextPending}
          </p>
        )}
      </div>
    </section>
  );
}
