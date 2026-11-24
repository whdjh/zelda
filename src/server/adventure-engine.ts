import { getMessages } from "../i18n/index.ts";
import type {
  AdventureView,
  CardId,
  ChoiceCardView,
  GameId,
  HintRevealMode,
  RevealedHintView,
} from "../api/types.ts";
import {
  DEFAULT_OOT_CATALOG,
  type AdventureCatalog,
  type CatalogCard,
} from "./oot-catalog.ts";

const PRIORITY_BOOST_BONUS = 30;
const MAX_RECOMMENDED_CHOICES = 3;

export interface AdventureState {
  gameId: GameId;
  currentCardId: CardId;
  selectedHistory: CardId[];
  completedCards: CardId[];
  revealedHints: string[];
}

export function isValidCardId(
  value: unknown,
  catalog: AdventureCatalog = DEFAULT_OOT_CATALOG,
): value is CardId {
  return typeof value === "string" && Object.hasOwn(catalog.cards, value);
}

export function createInitialState(
  catalog: AdventureCatalog = DEFAULT_OOT_CATALOG,
): AdventureState {
  return {
    gameId: catalog.gameId,
    currentCardId: catalog.initialCardId,
    selectedHistory: [],
    completedCards: [],
    revealedHints: [],
  };
}

export function sanitizeState(
  input: Partial<AdventureState> | null | undefined,
  catalog: AdventureCatalog = DEFAULT_OOT_CATALOG,
): AdventureState {
  if (!input) return createInitialState(catalog);
  const currentCardId = isValidCardId(input.currentCardId, catalog)
    ? input.currentCardId
    : catalog.initialCardId;
  const selectedHistory = Array.isArray(input.selectedHistory)
    ? input.selectedHistory.filter((item): item is CardId => isValidCardId(item, catalog))
    : [];
  // 이전 스키마(completedCards 없음)에서 복원 시 selectedHistory를 완료 카드로 승계
  const rawCompleted =
    Array.isArray(input.completedCards) && input.completedCards.length > 0
      ? input.completedCards
      : selectedHistory;
  const completedCards = [
    ...new Set(
      rawCompleted.filter(
        (item): item is CardId => isValidCardId(item, catalog) && item !== currentCardId,
      ),
    ),
  ];
  const revealedHints = Array.isArray(input.revealedHints)
    ? [...new Set(input.revealedHints.filter((item): item is string => typeof item === "string"))]
    : [];
  return {
    gameId: catalog.gameId,
    currentCardId,
    selectedHistory,
    completedCards,
    revealedHints,
  };
}

function collectUnlockedFlags(
  completedCardIds: Iterable<CardId>,
  catalog: AdventureCatalog,
): Set<string> {
  const flags = new Set<string>();
  for (const cardId of completedCardIds) {
    const card = catalog.cards[cardId];
    if (!card) continue;
    for (const flag of card.grantsFlags) {
      flags.add(flag);
    }
  }
  return flags;
}

function computeCardScore(card: CatalogCard, unlockedFlags: Set<string>): number {
  const boosted =
    card.boostWhenFlags.length > 0 &&
    card.boostWhenFlags.every((flag) => unlockedFlags.has(flag));
  return card.priority + (boosted ? PRIORITY_BOOST_BONUS : 0);
}

export function getEligibleNextCards(
  state: AdventureState,
  catalog: AdventureCatalog = DEFAULT_OOT_CATALOG,
): CatalogCard[] {
  const prospectiveCompleted = new Set<CardId>([...state.completedCards, state.currentCardId]);
  const prospectiveFlags = collectUnlockedFlags(prospectiveCompleted, catalog);

  return Object.values(catalog.cards)
    .filter((card) => {
      if (prospectiveCompleted.has(card.id)) return false;
      return card.requiresFlags.every((flag) => prospectiveFlags.has(flag));
    })
    .sort((a, b) => {
      const scoreDiff =
        computeCardScore(b, prospectiveFlags) - computeCardScore(a, prospectiveFlags);
      if (scoreDiff !== 0) return scoreDiff;
      return a.sortOrder - b.sortOrder;
    });
}

export function selectRecommendedNextCards(
  state: AdventureState,
  catalog: AdventureCatalog = DEFAULT_OOT_CATALOG,
  maxChoices: number = MAX_RECOMMENDED_CHOICES,
): CatalogCard[] {
  const eligible = getEligibleNextCards(state, catalog);
  if (!eligible.length) return [];

  const picked: CatalogCard[] = [];
  const topMain = eligible.find((card) => card.category === "main");
  if (topMain) {
    picked.push(topMain);
  }

  for (const card of eligible) {
    if (picked.length >= maxChoices) break;
    if (picked.some((existing) => existing.id === card.id)) continue;
    picked.push(card);
  }

  return picked;
}

export function applySelectNext(
  state: AdventureState,
  nextCardId: string,
  catalog: AdventureCatalog = DEFAULT_OOT_CATALOG,
): AdventureState {
  if (!isValidCardId(nextCardId, catalog)) return state;
  const eligibleIds = new Set(getEligibleNextCards(state, catalog).map((card) => card.id));
  if (!eligibleIds.has(nextCardId)) {
    return state;
  }
  return {
    ...state,
    currentCardId: nextCardId,
    selectedHistory: [...state.selectedHistory, state.currentCardId],
    completedCards: [...new Set([...state.completedCards, state.currentCardId])],
  };
}

export function applyGoBack(state: AdventureState): AdventureState {
  const prev = state.selectedHistory.at(-1);
  if (!prev) return state;
  return {
    ...state,
    currentCardId: prev,
    selectedHistory: state.selectedHistory.slice(0, -1),
    completedCards: state.completedCards.filter((id) => id !== prev),
  };
}

export function applyRevealHint(
  state: AdventureState,
  mode: HintRevealMode,
  catalog: AdventureCatalog = DEFAULT_OOT_CATALOG,
): AdventureState {
  const current = catalog.cards[state.currentCardId];
  if (!current || !current.hints.length) return state;
  const hintIds = current.hints.map((hint) => hint.id);
  if (mode === "all") {
    return {
      ...state,
      revealedHints: [...new Set([...state.revealedHints, ...hintIds])],
    };
  }
  const nextHint = hintIds.find((id) => !state.revealedHints.includes(id));
  if (!nextHint) return state;
  return {
    ...state,
    revealedHints: [...state.revealedHints, nextHint],
  };
}

export function buildAdventureView(
  state: AdventureState,
  catalog: AdventureCatalog = DEFAULT_OOT_CATALOG,
): AdventureView {
  const t = getMessages();
  const card = catalog.cards[state.currentCardId] ?? catalog.cards[catalog.initialCardId];

  const revealedHints: RevealedHintView[] = card.hints
    .filter((hint) => state.revealedHints.includes(hint.id))
    .map((hint) => ({
      id: hint.id,
      level: hint.level,
      label: t.guide.hintLevels[hint.level],
      text: hint.text,
      isSolution: hint.level === 3,
    }));

  const hasMoreHints = revealedHints.length < card.hints.length;
  const nextHintLevel = hasMoreHints
    ? (card.hints.find((hint) => !state.revealedHints.includes(hint.id))?.level ?? null)
    : null;

  const nextChoices: ChoiceCardView[] = selectRecommendedNextCards(state, catalog).map(
    (nextCard) => ({
      id: nextCard.id,
      category: nextCard.category,
      badge: nextCard.stepLabel,
      icon: nextCard.icon,
      title: nextCard.title,
      description: nextCard.steps[0] ?? "",
    }),
  );

  return {
    gameId: state.gameId,
    card: {
      id: card.id,
      stepLabel: card.stepLabel,
      icon: card.icon,
      title: card.title,
      steps: card.steps,
      referenceUrl: card.referenceUrl,
      hintQuestion: card.hintQuestion,
      totalHints: card.hints.length,
      revealedHints,
      hasMoreHints,
      nextHintLevel,
    },
    nextChoices,
    canGoBack: state.selectedHistory.length > 0,
  };
}
