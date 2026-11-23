import { INITIAL_CARD_ID, isCardId, type CardId } from "../data/cards.ts";

const PROGRESS_PREFIX = "zelda-highpass:progress:v1:";

export interface AdventureProgress {
  currentCardId: CardId;
  selectedHistory: CardId[];
  revealedHints: string[];
}

export function createInitialProgress(): AdventureProgress {
  return {
    currentCardId: INITIAL_CARD_ID,
    selectedHistory: [],
    revealedHints: [],
  };
}

export function sanitizeProgress(input: Partial<AdventureProgress> | null | undefined): AdventureProgress {
  if (!input) return createInitialProgress();
  const currentCardId = isCardId(input.currentCardId) ? input.currentCardId : INITIAL_CARD_ID;
  const selectedHistory = Array.isArray(input.selectedHistory)
    ? input.selectedHistory.filter(isCardId)
    : [];
  const revealedHints = Array.isArray(input.revealedHints)
    ? [...new Set(input.revealedHints.filter((item): item is string => typeof item === "string"))]
    : [];
  return { currentCardId, selectedHistory, revealedHints };
}

export function readStoredProgress(
  adventureId: string,
  storage?: Pick<Storage, "getItem">,
): AdventureProgress {
  const target = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
  if (!target) return createInitialProgress();
  try {
    const raw = target.getItem(`${PROGRESS_PREFIX}${adventureId}`);
    if (!raw) return createInitialProgress();
    return sanitizeProgress(JSON.parse(raw) as Partial<AdventureProgress>);
  } catch {
    return createInitialProgress();
  }
}

export function saveStoredProgress(
  adventureId: string,
  progress: AdventureProgress,
  storage?: Pick<Storage, "setItem">,
): boolean {
  const target = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
  if (!target) return false;
  try {
    target.setItem(`${PROGRESS_PREFIX}${adventureId}`, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
