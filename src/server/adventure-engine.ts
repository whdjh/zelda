import { getMessages } from "../i18n/index.ts";
import type {
  AdventureView,
  CardId,
  ChoiceCardView,
  GameId,
  HintRevealMode,
  RevealedHintView,
} from "../api/types.ts";
import { DEFAULT_OOT_CATALOG, type AdventureCatalog } from "./oot-catalog.ts";

export interface AdventureState {
  gameId: GameId;
  currentCardId: CardId;
  selectedHistory: CardId[];
  revealedHints: string[];
}

export function isValidCardId(
  value: unknown,
  catalog: AdventureCatalog = DEFAULT_OOT_CATALOG,
): value is CardId {
  return typeof value === "string" && value in catalog.cards;
}

export function createInitialState(
  catalog: AdventureCatalog = DEFAULT_OOT_CATALOG,
): AdventureState {
  return {
    gameId: catalog.gameId,
    currentCardId: catalog.initialCardId,
    selectedHistory: [],
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
  const revealedHints = Array.isArray(input.revealedHints)
    ? [...new Set(input.revealedHints.filter((item): item is string => typeof item === "string"))]
    : [];
  return {
    gameId: catalog.gameId,
    currentCardId,
    selectedHistory,
    revealedHints,
  };
}

export function applySelectNext(
  state: AdventureState,
  nextCardId: string,
  catalog: AdventureCatalog = DEFAULT_OOT_CATALOG,
): AdventureState {
  const current = catalog.cards[state.currentCardId];
  if (!current || !isValidCardId(nextCardId, catalog) || !current.nextCardIds.includes(nextCardId)) {
    return state;
  }
  return {
    ...state,
    currentCardId: nextCardId,
    selectedHistory: [...state.selectedHistory, state.currentCardId],
  };
}

export function applyGoBack(state: AdventureState): AdventureState {
  const prev = state.selectedHistory.at(-1);
  if (!prev) return state;
  return {
    ...state,
    currentCardId: prev,
    selectedHistory: state.selectedHistory.slice(0, -1),
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

  const nextChoices: ChoiceCardView[] = card.nextCardIds
    .filter((nextId) => nextId in catalog.cards)
    .map((nextId) => {
      const nextCard = catalog.cards[nextId];
      return {
        id: nextCard.id,
        badge: nextCard.stepLabel,
        icon: nextCard.icon,
        title: nextCard.title,
        description: nextCard.steps[0] ?? "",
      };
    });

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
