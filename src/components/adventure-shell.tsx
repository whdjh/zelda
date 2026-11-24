"use client";

import { ActionButton, BottomSheet, Portal } from "@seed-design/react";
import { useState, useSyncExternalStore } from "react";
import {
  useAdventureQuery,
  useGoBackCardMutation,
  useLoginAdventureMutation,
  useRevealHintMutation,
  useSelectNextCardMutation,
} from "@/api/adventure";
import { ApiError } from "@/api/client";
import type { ApiErrorCode } from "@/api/types";
import { getMessages } from "@/i18n";
import {
  ADVENTURE_ID_STORAGE_KEY,
  clearStoredAdventure,
  readStoredAdventure,
  saveStoredAdventure,
  validateAdventureId,
} from "@/lib/adventure-id";

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
  const [errorCode, setErrorCode] = useState<ApiErrorCode | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [accountSheetOpen, setAccountSheetOpen] = useState(false);

  const adventureQuery = useAdventureQuery(adventureId);
  const loginMutation = useLoginAdventureMutation();
  const selectNextMutation = useSelectNextCardMutation(adventureId);
  const goBackMutation = useGoBackCardMutation(adventureId);
  const revealHintMutation = useRevealHintMutation(adventureId);

  const isMutating =
    loginMutation.isPending ||
    selectNextMutation.isPending ||
    goBackMutation.isPending ||
    revealHintMutation.isPending;

  function resolveErrorMessage(code: ApiErrorCode): string {
    if (code in t.login.validation) {
      return t.login.validation[code as keyof typeof t.login.validation];
    }
    return t.error.title;
  }

  function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorCode(null);
    const checked = validateAdventureId(input);
    if (!checked.ok) {
      setErrorCode(checked.code);
      return;
    }

    loginMutation.mutate(checked.value, {
      onSuccess: (payload) => {
        saveStoredAdventure(payload.adventureId);
        setHintOpen(false);
        setInput("");
        window.dispatchEvent(new Event(LOCAL_EVENT));
      },
      onError: (err) => {
        setErrorCode(err instanceof ApiError ? err.code : "network_error");
      },
    });
  }

  function handleSwitchId() {
    clearStoredAdventure();
    setAccountSheetOpen(false);
    setHintOpen(false);
    setErrorCode(null);
    window.dispatchEvent(new Event(LOCAL_EVENT));
  }

  function handleSelectNext(nextCardId: string) {
    selectNextMutation.mutate(nextCardId, {
      onSuccess: () => setHintOpen(false),
    });
  }

  function handleGoBack() {
    goBackMutation.mutate(undefined, {
      onSuccess: () => setHintOpen(false),
    });
  }

  if (adventureId === undefined || (adventureId && adventureQuery.isPending)) {
    return (
      <section className="my-auto rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default p-x5">
        <p role="status" className="t3-regular text-fg-neutral-muted">{t.login.loading}</p>
      </section>
    );
  }

  if (!adventureId) {
    return (
      <section className="my-auto rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default p-x5">
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
              {resolveErrorMessage(errorCode)}
            </p>
          )}
          <div className="mt-x2">
            <ActionButton
              type="submit"
              variant="brandSolid"
              size="large"
              disabled={loginMutation.isPending}
              className="w-full"
            >
              {loginMutation.isPending ? t.login.submitting : t.login.submit}
            </ActionButton>
          </div>
        </form>
      </section>
    );
  }

  if (adventureQuery.isError || !adventureQuery.data) {
    return (
      <section className="my-auto rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default p-x5">
        <p className="mb-x4 t4-bold text-fg-neutral">{t.error.title}</p>
        <ActionButton variant="brandSolid" size="medium" onClick={() => adventureQuery.refetch()}>
          {t.error.retry}
        </ActionButton>
      </section>
    );
  }

  const { card, nextChoices, canGoBack } = adventureQuery.data.view;
  const singleNext = nextChoices.length === 1 ? nextChoices[0] : undefined;

  return (
    <div className="flex flex-1 flex-col gap-x3">
      <header className="flex items-center justify-between gap-x3">
        <div className="flex items-center gap-x2">
          <span className="rounded-r2 bg-bg-brand-weak px-x2 py-x1 t2-bold text-fg-brand-contrast">
            {card.stepLabel}
          </span>
          {canGoBack && (
            <button
              type="button"
              disabled={isMutating}
              onClick={handleGoBack}
              className="t2-regular text-fg-neutral-subtle underline"
            >
              {t.guide.prevStep}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setAccountSheetOpen(true)}
          aria-label={`${t.login.accountSheetTitle}: ${adventureId}`}
          className="inline-flex min-h-10 items-center gap-x2 rounded-full border border-stroke-neutral-muted bg-bg-layer-default py-x1 pl-x2 pr-x3 shadow-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/zelda/ocarina.png"
            alt=""
            className="h-7 w-7 shrink-0 rounded-full object-cover"
          />
          <span className="max-w-28 truncate t2-bold text-fg-neutral">{adventureId}</span>
        </button>
      </header>

      <section className="flex flex-1 flex-col rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default p-x5">
        <div className="mb-x4 flex items-center gap-x3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.icon}
            alt=""
            className="h-14 w-14 shrink-0 rounded-r3 object-cover"
          />
          <h1 className="t6-bold text-fg-neutral">{card.title}</h1>
        </div>

        <ul className="mb-x4 flex flex-col gap-x2">
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
          className="mb-x4 flex min-h-11 items-center justify-between rounded-r3 border border-stroke-neutral-muted px-x4 t3-bold text-fg-neutral-muted"
        >
          <span>{t.guide.referenceLabel}</span>
        </a>

        {card.totalHints > 0 && hintOpen && (
          <div className="mb-x4 rounded-r3 border border-stroke-neutral-muted bg-bg-neutral-muted p-x4">
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
                  disabled={isMutating}
                  onClick={() => revealHintMutation.mutate("next")}
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
                    disabled={isMutating}
                    onClick={() => revealHintMutation.mutate("all")}
                  >
                    {t.guide.solveNow}
                  </ActionButton>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-auto pt-x4">
          {nextChoices.length > 1 ? (
            <div className="flex flex-col gap-x2">
              <div className="flex items-center justify-between gap-x2">
                <p className="t3-bold text-fg-neutral">{t.guide.chooseBranchTitle}</p>
                {card.totalHints > 0 && (
                  <ActionButton
                    variant="neutralWeak"
                    size="small"
                    onClick={() => setHintOpen((open) => !open)}
                  >
                    {hintOpen ? t.guide.closeHint : t.guide.openHint}
                  </ActionButton>
                )}
              </div>
              {nextChoices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  disabled={isMutating}
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
                  disabled={isMutating}
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
        </div>
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
    </div>
  );
}
