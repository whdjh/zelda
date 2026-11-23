"use client";

import { ActionButton, BottomSheet, Portal } from "@seed-design/react";
import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import {
  goBackCardAction,
  loadAdventureAction,
  revealHintAction,
  selectNextCardAction,
} from "@/app/actions/adventure";
import { getMessages } from "@/i18n";
import {
  ADVENTURE_ID_STORAGE_KEY,
  clearStoredAdventure,
  readStoredAdventure,
  saveStoredAdventure,
  validateAdventureId,
  type AdventureIdErrorCode,
} from "@/lib/adventure-id";
import type { AdventureView } from "@/server/adventure-engine";

const LOCAL_EVENT = "zelda-highpass:adventure-id-change";

function subscribeAdventureId(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (!event.key || event.key === ADVENTURE_ID_STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(LOCAL_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LOCAL_EVENT, onStoreChange);
  };
}

function getClientAdventureId(): string | null {
  return readStoredAdventure()?.adventureId ?? null;
}

function getServerAdventureId(): undefined {
  return undefined;
}

export function AdventureShell() {
  const t = getMessages();
  const adventureId = useSyncExternalStore(
    subscribeAdventureId,
    getClientAdventureId,
    getServerAdventureId,
  );
  const [input, setInput] = useState("");
  const [errorCode, setErrorCode] = useState<AdventureIdErrorCode | null>(null);
  const [view, setView] = useState<AdventureView | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [accountSheetOpen, setAccountSheetOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!adventureId || loadedId === adventureId) return;
    let active = true;
    void loadAdventureAction(adventureId).then((result) => {
      if (!active || !result.ok) return;
      setView(result.view);
      setLoadedId(result.adventureId);
    });
    return () => {
      active = false;
    };
  }, [adventureId, loadedId]);

  function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorCode(null);
    const checked = validateAdventureId(input);
    if (!checked.ok) {
      setErrorCode(checked.code);
      return;
    }

    startTransition(async () => {
      const result = await loadAdventureAction(checked.value);
      if (!result.ok) {
        setErrorCode(result.code);
        return;
      }
      saveStoredAdventure(result.adventureId);
      setView(result.view);
      setLoadedId(result.adventureId);
      setHintOpen(false);
      setInput("");
      window.dispatchEvent(new Event(LOCAL_EVENT));
    });
  }

  function handleSwitchId() {
    clearStoredAdventure();
    setAccountSheetOpen(false);
    setView(null);
    setLoadedId(null);
    setHintOpen(false);
    setErrorCode(null);
    window.dispatchEvent(new Event(LOCAL_EVENT));
  }

  function handleSelectNext(nextCardId: string) {
    if (!adventureId) return;
    startTransition(async () => {
      const result = await selectNextCardAction(adventureId, nextCardId);
      if (result.ok) {
        setView(result.view);
        setHintOpen(false);
      }
    });
  }

  function handleGoBack() {
    if (!adventureId) return;
    startTransition(async () => {
      const result = await goBackCardAction(adventureId);
      if (result.ok) {
        setView(result.view);
        setHintOpen(false);
      }
    });
  }

  function handleRevealHint(mode: "next" | "all") {
    if (!adventureId) return;
    startTransition(async () => {
      const result = await revealHintAction(adventureId, mode);
      if (result.ok) setView(result.view);
    });
  }

  if (adventureId === undefined || (adventureId && (!view || loadedId !== adventureId))) {
    return (
      <section className="rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default p-x6">
        <p role="status" className="t3-regular text-fg-neutral-muted">{t.login.loading}</p>
      </section>
    );
  }

  if (!adventureId) {
    return (
      <section className="rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default p-x6">
        <div className="mb-x5 flex items-center gap-x3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/zelda/ocarina.png"
            alt=""
            className="h-12 w-12 shrink-0 rounded-r3 object-cover"
          />
          <h1 className="t6-bold text-fg-neutral">{t.login.title}</h1>
        </div>

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-x3" noValidate>
          <label htmlFor="adventure-id-input" className="t3-bold text-fg-neutral">
            {t.login.idLabel}
          </label>
          <input
            id="adventure-id-input"
            name="adventureId"
            type="text"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              if (errorCode) setErrorCode(null);
            }}
            placeholder={t.login.idPlaceholder}
            maxLength={24}
            autoComplete="off"
            aria-invalid={Boolean(errorCode)}
            className="min-h-12 w-full rounded-r3 border border-stroke-neutral-subtle bg-bg-layer-default px-x4 t4-regular text-fg-neutral placeholder:text-fg-placeholder"
          />
          {errorCode && (
            <p role="alert" className="t3-regular text-fg-critical">
              {t.login.validation[errorCode]}
            </p>
          )}
          <div className="mt-x2">
            <ActionButton
              type="submit"
              variant="brandSolid"
              size="large"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? t.login.submitting : t.login.submit}
            </ActionButton>
          </div>
        </form>
      </section>
    );
  }

  if (!view) return null;

  const { card, nextChoices, canGoBack } = view;
  const singleNext = nextChoices.length === 1 ? nextChoices[0] : undefined;

  return (
    <>
      <button
        type="button"
        onClick={() => setAccountSheetOpen(true)}
        aria-label={`${t.login.accountSheetTitle}: ${adventureId}`}
        className="fixed right-4 top-4 z-20 inline-flex min-h-10 items-center gap-x2 rounded-full border border-stroke-neutral-muted bg-bg-layer-default py-x1 pl-x2 pr-x3 shadow-sm"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/zelda/ocarina.png"
          alt=""
          className="h-7 w-7 shrink-0 rounded-full object-cover"
        />
        <span className="max-w-28 truncate t2-bold text-fg-neutral">{adventureId}</span>
      </button>

      <section className="rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default p-x6">
        <div className="mb-x4 flex items-center justify-between gap-x3">
          <span className="rounded-r2 bg-bg-brand-weak px-x2 py-x1 t2-bold text-fg-brand-contrast">
            {card.stepLabel}
          </span>
          {canGoBack && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleGoBack}
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
          <h1 className="t6-bold text-fg-neutral">{card.title}</h1>
        </div>

        <ul className="mb-x5 flex flex-col gap-x2">
          {card.steps.map((step) => (
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

        {card.totalHints > 0 && hintOpen && (
          <div className="mb-x5 rounded-r3 border border-stroke-neutral-muted bg-bg-neutral-muted p-x4">
            <div className="mb-x3 flex items-center gap-x2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/zelda/hint-fairy.png"
                alt=""
                className="h-8 w-8 shrink-0 rounded-r2 object-cover"
              />
              <p className="t3-bold text-fg-neutral">{card.hintQuestion}</p>
            </div>

            {card.revealedHints.length > 0 && (
              <ol className="mb-x3 flex flex-col gap-x2" aria-live="polite">
                {card.revealedHints.map((hint) => (
                  <li
                    key={hint.id}
                    className={
                      hint.isSolution
                        ? "rounded-r3 bg-bg-warning-weak p-x3"
                        : "rounded-r3 bg-bg-layer-default p-x3"
                    }
                  >
                    <p
                      className={
                        hint.isSolution
                          ? "mb-x1 t2-bold text-fg-warning-contrast"
                          : "mb-x1 t2-bold text-fg-informative"
                      }
                    >
                      {hint.label}
                    </p>
                    <p className="t3-regular text-fg-neutral">{hint.text}</p>
                  </li>
                ))}
              </ol>
            )}

            {card.hasMoreHints && card.nextHintLevel && (
              <div className="flex flex-wrap gap-x2">
                <ActionButton
                  variant="brandSolid"
                  size="small"
                  disabled={isPending}
                  onClick={() => handleRevealHint("next")}
                >
                  {card.nextHintLevel === 1
                    ? t.guide.nextHint1
                    : card.nextHintLevel === 2
                      ? t.guide.nextHint2
                      : t.guide.showSolution}
                </ActionButton>
                {card.nextHintLevel < 3 && (
                  <ActionButton
                    variant="neutralWeak"
                    size="small"
                    disabled={isPending}
                    onClick={() => handleRevealHint("all")}
                  >
                    {t.guide.solveNow}
                  </ActionButton>
                )}
              </div>
            )}
          </div>
        )}

        {nextChoices.length > 1 ? (
          <div className="flex flex-col gap-x2">
            <p className="t3-bold text-fg-neutral">{t.guide.chooseBranchTitle}</p>
            {nextChoices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                disabled={isPending}
                onClick={() => handleSelectNext(choice.id)}
                className="flex items-center gap-x3 rounded-r3 border border-stroke-neutral-muted bg-bg-layer-default p-x3 text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={choice.icon}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-r2 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <span className="t1-bold text-fg-brand-contrast">{choice.badge}</span>
                  <p className="t4-bold text-fg-neutral">{choice.title}</p>
                  <p className="truncate t2-regular text-fg-neutral-muted">{choice.description}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-x2">
            {card.totalHints > 0 && (
              <ActionButton
                variant="neutralWeak"
                size="large"
                className="flex-1"
                onClick={() => setHintOpen((open) => !open)}
              >
                {hintOpen ? t.guide.closeHint : t.guide.openHint}
              </ActionButton>
            )}
            {singleNext ? (
              <ActionButton
                variant="brandSolid"
                size="large"
                className="flex-1"
                disabled={isPending}
                onClick={() => handleSelectNext(singleNext.id)}
              >
                {t.guide.completeNext}
              </ActionButton>
            ) : (
              <p className="flex flex-1 items-center justify-center rounded-r3 bg-bg-neutral-muted px-x4 py-x3 t3-regular text-fg-neutral-muted">
                {t.guide.nextPending}
              </p>
            )}
          </div>
        )}
      </section>

      <BottomSheet.Root open={accountSheetOpen} onOpenChange={setAccountSheetOpen}>
        <Portal>
          <BottomSheet.Positioner>
            <BottomSheet.Backdrop />
            <BottomSheet.Content className="settings-sheet">
              <BottomSheet.Header>
                <BottomSheet.Title>{t.login.accountSheetTitle}</BottomSheet.Title>
              </BottomSheet.Header>
              <BottomSheet.Body>
                <div className="flex flex-col gap-x4 pb-x6">
                  <div className="flex items-center gap-x3 rounded-r3 bg-bg-neutral-muted p-x4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/zelda/ocarina.png"
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-r3 object-cover"
                    />
                    <p className="t5-bold text-fg-neutral">{adventureId}</p>
                  </div>
                  <ActionButton
                    variant="neutralWeak"
                    size="large"
                    className="w-full"
                    onClick={handleSwitchId}
                  >
                    {t.login.switchId}
                  </ActionButton>
                </div>
              </BottomSheet.Body>
              <BottomSheet.CloseButton aria-label={t.login.closeSheet}>×</BottomSheet.CloseButton>
            </BottomSheet.Content>
          </BottomSheet.Positioner>
        </Portal>
      </BottomSheet.Root>
    </>
  );
}
