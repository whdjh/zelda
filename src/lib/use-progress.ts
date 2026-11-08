"use client";

import { useEffect, useRef, useState } from "react";
import { ootContent } from "../../content/ocarina-of-time/index";
import { createProgress, loadProgress, saveProgress, STORAGE_KEY, type SavedProgress } from "./progress-storage";

export function useProgress() {
  const [progress, setProgress] = useState<SavedProgress | null>(null);
  const [notice, setNotice] = useState("");
  const [storageNotice, setStorageNotice] = useState("");
  const [protectedRaw, setProtectedRaw] = useState<string | null>(null);
  const [originalDownloaded, setOriginalDownloaded] = useState(false);
  const snapshot = useRef<string | null>(null);

  useEffect(() => {
    function restore() {
      const result = loadProgress(() => window.localStorage, ootContent);
      snapshot.current = result.raw;
      setOriginalDownloaded(false);
      if (result.ok) {
        setProgress(result.progress);
        setProtectedRaw(null);
        setStorageNotice("");
      } else {
        setProgress((current) => current ?? createProgress(ootContent));
        setProtectedRaw(result.raw);
        setStorageNotice(`${result.message} 현재 설정은 이 탭에서 사용할 수 있어요.`);
      }
    }
    // 첫 렌더는 중립 상태로 유지한 뒤 외부 저장소를 읽는다.
    restore();
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY || event.key === null) {
        restore();
        setNotice("다른 탭의 기록 변경을 반영했어요.");
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function commit(next: SavedProgress): boolean {
    setProgress(next);
    if (protectedRaw !== null && !originalDownloaded) {
      setNotice("원본을 먼저 내려받아 주세요. 현재 변경은 이 탭에만 적용했어요.");
      return false;
    }
    try {
      if (window.localStorage.getItem(STORAGE_KEY) !== snapshot.current) {
        setStorageNotice("다른 탭에서 기록이 바뀌었어요. 현재 기록을 백업한 뒤 새로고침해 주세요.");
        return false;
      }
    } catch {
      setStorageNotice("브라우저에 저장할 수 없어요. 현재 탭에서 계속 이용하고 백업 파일을 보관해 주세요.");
      return false;
    }
    if (!saveProgress(() => window.localStorage, next)) {
      setStorageNotice("브라우저에 저장할 수 없어요. 현재 탭에서 계속 이용하고 백업 파일을 보관해 주세요.");
      return false;
    }
    snapshot.current = JSON.stringify(next);
    setProtectedRaw(null);
    setStorageNotice("");
    return true;
  }

  return { progress, commit, notice, setNotice, storageNotice, protectedRaw, setOriginalDownloaded };
}
