"use client";

import { ActionButton, BottomSheet, Portal, SegmentedControl } from "@seed-design/react";
import { useState } from "react";
import type { useProgress } from "@/lib/use-progress";
import { ootContent } from "../../content/ocarina-of-time/index";
import {
  MAX_BACKUP_BYTES, parseProgress,
  type SavedProgress, type SpoilerLevel,
} from "@/lib/progress-storage";

const spoilerOptions: { value: SpoilerLevel; label: string; description: string }[] = [
  { value: "strict", label: "엄격", description: "완료한 곳과 현재 목적지만 공개해요." },
  { value: "full", label: "전체", description: "모든 목적지를 공개해요. 퍼즐의 답은 별도로 열어야 해요." },
];

function download(raw: string, filename: string) {
  const url = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ProgressSettings({ state }: { state: ReturnType<typeof useProgress> }) {
  const { progress, commit, notice, setNotice, storageNotice, protectedRaw, setOriginalDownloaded } = state;
  const [pendingImport, setPendingImport] = useState<SavedProgress | null>(null);

  function changeSpoiler(value: string) {
    if (!progress || !spoilerOptions.some((option) => option.value === value)) return;
    setNotice("");
    if (commit({ ...progress, spoilerLevel: value as SpoilerLevel, updatedAt: new Date().toISOString() })) {
      setNotice("스포일러 설정을 저장했어요.");
    }
  }

  async function readBackup(file: File | undefined) {
    if (!file) return;
    setPendingImport(null);
    setNotice("");
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error("백업 파일은 1MB 이하여야 합니다.");
      setPendingImport(parseProgress(await file.text(), ootContent));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "백업 파일을 읽지 못했어요.");
    }
  }

  return (
    <BottomSheet.Root>
      <BottomSheet.Trigger asChild>
        <ActionButton variant="neutralWeak" size="small" className="min-h-x11" disabled={!progress}>진행도·설정</ActionButton>
      </BottomSheet.Trigger>
      <Portal>
        <BottomSheet.Positioner>
          <BottomSheet.Backdrop />
          <BottomSheet.Content className="settings-sheet">
            <BottomSheet.Header>
              <BottomSheet.Title>진행도·설정</BottomSheet.Title>
              <BottomSheet.Description>이 브라우저의 기록과 스포일러 설정을 관리해요.</BottomSheet.Description>
            </BottomSheet.Header>
            <BottomSheet.Body>
              {!progress ? <p role="status">저장된 기록을 확인하고 있어요.</p> : (
                <div className="flex flex-col gap-x6 pb-x6">
                  <section aria-labelledby="spoiler-title">
                    <h2 id="spoiler-title" className="mb-x3 t4-bold">스포일러 공개 범위</h2>
                    <SegmentedControl.Root value={progress.spoilerLevel} onValueChange={changeSpoiler} aria-labelledby="spoiler-title">
                      <SegmentedControl.Indicator />
                      {spoilerOptions.map((option) => (
                        <SegmentedControl.Item key={option.value} value={option.value} className="min-h-x11 min-w-0 px-x2">
                          <SegmentedControl.ItemHiddenInput />
                          {option.label}
                        </SegmentedControl.Item>
                      ))}
                    </SegmentedControl.Root>
                    <p className="mt-x3 t3-regular text-fg-neutral-muted">
                      {spoilerOptions.find((option) => option.value === progress.spoilerLevel)?.description}
                    </p>
                  </section>

                  <section aria-labelledby="backup-title" className="border-t border-stroke-neutral-muted pt-x5">
                    <h2 id="backup-title" className="mb-x2 t4-bold">기록 백업·복원</h2>
                    <p className="mb-x4 t3-regular text-fg-neutral-muted">
                      완료한 역 {progress.completedStopIds.length}개 · 공개한 힌트 {progress.revealedHintIds.length}개
                    </p>
                    <ActionButton variant="neutralOutline" size="medium" onClick={() => download(JSON.stringify(progress, null, 2), "zelda-highpass-progress.json")}>
                      백업 내보내기
                    </ActionButton>
                    <label className="mt-x5 block t3-bold" htmlFor="backup-file">백업 파일 가져오기</label>
                    <input id="backup-file" type="file" accept=".json,application/json" className="mt-x2 block min-h-x11 w-full min-w-0 t3-regular"
                      onChange={(event) => { void readBackup(event.target.files?.[0]); event.target.value = ""; }} />
                    {pendingImport && (
                      <div className="mt-x3 rounded-r3 bg-bg-informative-weak p-x4">
                        <p className="mb-x3 t3-regular">
                          완료한 역 {pendingImport.completedStopIds.length}개, 공개한 힌트 {pendingImport.revealedHintIds.length}개를 가져왔어요.
                          현재 기록과 스포일러 설정을 이 백업으로 교체할까요?
                        </p>
                        <div className="flex flex-wrap gap-x2">
                          <ActionButton size="small" variant="neutralSolid" onClick={() => {
                            const saved = commit({ ...pendingImport, updatedAt: new Date().toISOString() });
                            setPendingImport(null);
                            if (saved) setNotice("백업을 복원하고 저장했어요.");
                          }}>백업으로 교체</ActionButton>
                          <ActionButton size="small" variant="neutralWeak" onClick={() => setPendingImport(null)}>취소</ActionButton>
                        </div>
                      </div>
                    )}
                  </section>

                  {storageNotice && <p role="alert" className="rounded-r3 bg-bg-informative-weak p-x4 t3-regular">{storageNotice}</p>}
                  {protectedRaw !== null && (
                    <ActionButton variant="neutralOutline" size="medium" onClick={() => {
                      download(protectedRaw, "zelda-highpass-original.json");
                      setOriginalDownloaded(true);
                      setNotice("원본 다운로드를 시작했어요. 파일을 보관한 뒤 설정을 변경하거나 유효한 백업을 가져와 주세요.");
                    }}>보존된 원본 내보내기</ActionButton>
                  )}
                  <p role="status" className="t3-regular">{notice}</p>
                  <p className="t2-regular text-fg-neutral-muted">
                    기록은 이 브라우저에 저장돼요. 브라우저 데이터를 삭제하거나 기기를 바꾸기 전에 백업을 보관해 주세요.
                  </p>
                </div>
              )}
            </BottomSheet.Body>
            <BottomSheet.CloseButton aria-label="설정 닫기">×</BottomSheet.CloseButton>
          </BottomSheet.Content>
        </BottomSheet.Positioner>
      </Portal>
    </BottomSheet.Root>
  );
}
