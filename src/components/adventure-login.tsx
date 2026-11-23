"use client";

import { ActionButton } from "@seed-design/react";
import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { loginWithAdventureId } from "@/app/actions/adventure";
import { getMessages } from "@/i18n";
import {
  ADVENTURE_ID_STORAGE_KEY,
  clearStoredAdventure,
  readStoredAdventure,
  saveStoredAdventure,
  validateAdventureId,
  type AdventureIdErrorCode,
} from "@/lib/adventure-id";

interface AdventureLoginProps {
  supabaseConfigured: boolean;
}

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

export function AdventureLogin({ supabaseConfigured }: AdventureLoginProps) {
  const t = getMessages();
  const adventureId = useSyncExternalStore(
    subscribeAdventureId,
    getClientAdventureId,
    getServerAdventureId,
  );
  const [input, setInput] = useState("");
  const [errorCode, setErrorCode] = useState<AdventureIdErrorCode | null>(null);
  const [syncedId, setSyncedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!adventureId || !supabaseConfigured || syncedId === adventureId) return;
    let active = true;
    void loginWithAdventureId(adventureId).then((result) => {
      if (!active || !result.ok) return;
      if (result.synced) setSyncedId(result.adventureId);
    });
    return () => {
      active = false;
    };
  }, [adventureId, supabaseConfigured, syncedId]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorCode(null);
    const checked = validateAdventureId(input);
    if (!checked.ok) {
      setErrorCode(checked.code);
      return;
    }

    startTransition(async () => {
      const result = await loginWithAdventureId(checked.value);
      if (!result.ok) {
        setErrorCode(result.code);
        return;
      }
      saveStoredAdventure(result.adventureId);
      window.dispatchEvent(new Event(LOCAL_EVENT));
      setSyncedId(result.synced ? result.adventureId : null);
      setInput("");
    });
  }

  function handleSwitchId() {
    clearStoredAdventure();
    window.dispatchEvent(new Event(LOCAL_EVENT));
    setSyncedId(null);
    setErrorCode(null);
  }

  if (adventureId === undefined) {
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-x3" noValidate>
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

  return (
    <section className="flex flex-col gap-x4">
      <div className="flex items-center justify-between gap-x3 rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default p-x5">
        <div className="flex items-center gap-x3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/zelda/ocarina.png"
            alt=""
            className="h-11 w-11 shrink-0 rounded-r3 object-cover"
          />
          <h1 className="t5-bold text-fg-neutral">{adventureId}</h1>
        </div>
        <ActionButton variant="neutralWeak" size="small" onClick={handleSwitchId}>
          {t.login.switchId}
        </ActionButton>
      </div>

      <div className="rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default p-x5">
        <div className="flex items-center gap-x3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/zelda/sword-shield.png"
            alt=""
            className="h-11 w-11 shrink-0 rounded-r3 object-cover"
          />
          <div>
            <h2 className="t4-bold text-fg-neutral">{t.login.emptyCardsTitle}</h2>
            <p className="mt-x1 t3-regular text-fg-neutral-muted">{t.login.emptyCardsBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
