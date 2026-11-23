"use client";

import { ActionButton } from "@seed-design/react";
import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { loginWithAdventureId } from "@/app/actions/adventure";
import {
  ADVENTURE_ID_STORAGE_KEY,
  clearStoredAdventure,
  readStoredAdventure,
  saveStoredAdventure,
  validateAdventureId,
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
  const adventureId = useSyncExternalStore(
    subscribeAdventureId,
    getClientAdventureId,
    getServerAdventureId,
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [syncedId, setSyncedId] = useState<string | null>(null);
  const [historyCount, setHistoryCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!adventureId || !supabaseConfigured || syncedId === adventureId) return;
    let active = true;
    void loginWithAdventureId(adventureId).then((result) => {
      if (!active || !result.ok) return;
      if (result.synced) setSyncedId(result.adventureId);
      setHistoryCount(result.record?.selected_history.length ?? 0);
      setNotice(result.notice);
    });
    return () => {
      active = false;
    };
  }, [adventureId, supabaseConfigured, syncedId]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const checked = validateAdventureId(input);
    if (!checked.ok) {
      setError(checked.error);
      return;
    }

    startTransition(async () => {
      const result = await loginWithAdventureId(checked.value);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const saved = saveStoredAdventure(result.adventureId);
      window.dispatchEvent(new Event(LOCAL_EVENT));
      setSyncedId(result.synced ? result.adventureId : null);
      setHistoryCount(result.record?.selected_history.length ?? 0);
      setNotice(
        saved
          ? result.notice
          : `${result.notice} (브라우저 저장 공간이 막혀 있어 새로고침 시 다시 입력해야 할 수 있어요.)`,
      );
      setInput("");
    });
  }

  function handleSwitchId() {
    clearStoredAdventure();
    window.dispatchEvent(new Event(LOCAL_EVENT));
    setSyncedId(null);
    setHistoryCount(0);
    setNotice("");
    setError("");
  }

  if (adventureId === undefined) {
    return (
      <section className="rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default p-x6">
        <p role="status" className="t3-regular text-fg-neutral-muted">저장된 모험 아이디를 확인하고 있어요.</p>
      </section>
    );
  }

  if (!adventureId) {
    return (
      <section className="rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default p-x6">
        <div className="mb-x5 flex items-center gap-x4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/zelda/adventure-emblem.png"
            alt="젤다 하이패스 문장"
            className="h-14 w-14 shrink-0 rounded-r3 object-cover"
          />
          <div>
            <span className="inline-block rounded-r2 bg-bg-brand-weak px-x2 py-x1 t1-bold text-fg-brand-contrast">
              개인정보 없는 간편 로그인
            </span>
            <h1 className="mt-x1 t6-bold text-fg-neutral">모험 아이디만 적고 시작해요</h1>
          </div>
        </div>

        <p className="mb-x5 t3-regular text-fg-neutral-muted">
          비밀번호·이메일·JWT 없이 자유 아이디 하나만 입력합니다. 브라우저에 저장되어 다음에도 자동으로 이어집니다.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-x3" noValidate>
          <label htmlFor="adventure-id-input" className="t3-bold text-fg-neutral">
            내 모험 아이디
          </label>
          <input
            id="adventure-id-input"
            name="adventureId"
            type="text"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              if (error) setError("");
            }}
            placeholder="예: hyrule-link, 코키리01"
            maxLength={24}
            autoComplete="off"
            aria-invalid={Boolean(error)}
            className="min-h-12 w-full rounded-r3 border border-stroke-neutral-subtle bg-bg-layer-default px-x4 t4-regular text-fg-neutral placeholder:text-fg-placeholder"
          />
          <p className="t2-regular text-fg-neutral-subtle">
            이메일·전화번호 같은 개인정보는 넣지 말고, 편한 별명(2~24자)만 적어 주세요.
          </p>
          {error && (
            <p role="alert" className="t3-regular text-fg-critical">
              {error}
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
              {isPending ? "연결하는 중..." : "이 아이디로 시작하기"}
            </ActionButton>
          </div>
        </form>

        <p className="mt-x5 border-t border-stroke-neutral-muted pt-x4 t2-regular text-fg-neutral-subtle">
          Supabase 상태: {supabaseConfigured ? "키 연결됨 (zhp_adventures 자동 동기화)" : "키 미설정 (브라우저 로컬 저장 모드로 동작)"}
        </p>
      </section>
    );
  }

  const synced = syncedId === adventureId;

  return (
    <section className="flex flex-col gap-x4">
      <div className="rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default p-x6">
        <div className="flex items-center justify-between gap-x3">
          <div className="flex items-center gap-x3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/zelda/adventure-emblem.png"
              alt="모험 문장"
              className="h-12 w-12 shrink-0 rounded-r3 object-cover"
            />
            <div>
              <p className="t2-regular text-fg-neutral-subtle">로그인 유지 중</p>
              <h1 className="t5-bold text-fg-neutral">{adventureId}</h1>
            </div>
          </div>
          <span
            className={
              synced
                ? "rounded-r2 bg-bg-positive-weak px-x2 py-x1 t2-bold text-fg-positive-contrast"
                : "rounded-r2 bg-bg-neutral-weak px-x2 py-x1 t2-bold text-fg-neutral-muted"
            }
          >
            {synced ? "Supabase 연동됨" : "로컬 저장"}
          </span>
        </div>

        {notice && (
          <p role="status" className="mt-x4 rounded-r3 bg-bg-neutral-muted px-x4 py-x3 t3-regular text-fg-neutral-muted">
            {notice}
          </p>
        )}

        <div className="mt-x5 flex flex-wrap items-center justify-between gap-x3 border-t border-stroke-neutral-muted pt-x4">
          <p className="t2-regular text-fg-neutral-subtle">
            선택한 증강 카드 {historyCount}개 · 새로고침해도 로그인 유지
          </p>
          <ActionButton variant="neutralWeak" size="small" onClick={handleSwitchId}>
            아이디 바꾸기
          </ActionButton>
        </div>
      </div>

      <div className="rounded-r4 border border-stroke-neutral-muted bg-bg-neutral-muted p-x5">
        <div className="flex items-start gap-x3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/zelda/sword-shield.png"
            alt=""
            className="h-11 w-11 shrink-0 rounded-r3 object-cover"
          />
          <div>
            <h2 className="t4-bold text-fg-neutral">다음 단계: 같이 플레이하며 증강 카드 채우기</h2>
            <p className="mt-x1 t3-regular text-fg-neutral-muted">
              시간의 오카리나를 직접 플레이하며 검증된 갈래와 3단계 힌트만 한 장씩 추가합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
