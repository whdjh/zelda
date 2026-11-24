import { getMessages } from "../i18n/index.ts";
import type {
  AdventureView,
  ChoiceCardView,
  GameId,
  HintRevealMode,
  OotCardId,
  OotHintId,
  RevealedHintView,
} from "../api/types.ts";

export interface ServerCardDefinition {
  id: OotCardId;
  icon: string;
  referenceUrl: string;
  hintIds: readonly OotHintId[];
  nextCardIds: readonly OotCardId[];
}

export interface AdventureState {
  gameId: GameId;
  currentCardId: OotCardId;
  selectedHistory: OotCardId[];
  revealedHints: string[];
}

export const INITIAL_OOT_CARD_ID: OotCardId = "kokiri-gear";

export const OOT_CARDS: Record<OotCardId, ServerCardDefinition> = {
  "kokiri-gear": {
    id: "kokiri-gear",
    icon: "/assets/zelda/sword-shield.png",
    referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563396",
    hintIds: ["kokiri-gear-1", "kokiri-gear-2", "kokiri-gear-3"],
    nextCardIds: ["deku-tree"],
  },
  "deku-tree": {
    id: "deku-tree",
    icon: "/assets/zelda/adventure-emblem.png",
    referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563395",
    hintIds: ["deku-tree-1", "deku-tree-2", "deku-tree-3"],
    nextCardIds: ["hyrule-castle"],
  },
  "hyrule-castle": {
    id: "hyrule-castle",
    icon: "/assets/zelda/adventure-emblem.png",
    referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563310",
    hintIds: ["hyrule-castle-1", "hyrule-castle-2", "hyrule-castle-3"],
    nextCardIds: ["goron-main", "kakariko-prep", "songs-route"],
  },
  "goron-main": {
    id: "goron-main",
    icon: "/assets/zelda/sword-shield.png",
    referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563393",
    hintIds: [],
    nextCardIds: [],
  },
  "kakariko-prep": {
    id: "kakariko-prep",
    icon: "/assets/zelda/fairy-bottle.png",
    referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563393",
    hintIds: ["kakariko-prep-1", "kakariko-prep-2", "kakariko-prep-3"],
    nextCardIds: [],
  },
  "songs-route": {
    id: "songs-route",
    icon: "/assets/zelda/ocarina.png",
    referenceUrl: "https://gamewith.jp/zelda-tokino-ocarina/563310",
    hintIds: ["songs-route-1", "songs-route-2", "songs-route-3"],
    nextCardIds: [],
  },
};

export function isOotCardId(value: unknown): value is OotCardId {
  return typeof value === "string" && value in OOT_CARDS;
}

export function createInitialState(): AdventureState {
  return {
    gameId: "oot",
    currentCardId: INITIAL_OOT_CARD_ID,
    selectedHistory: [],
    revealedHints: [],
  };
}

export function sanitizeState(input: Partial<AdventureState> | null | undefined): AdventureState {
  if (!input) return createInitialState();
  const currentCardId = isOotCardId(input.currentCardId) ? input.currentCardId : INITIAL_OOT_CARD_ID;
  const selectedHistory = Array.isArray(input.selectedHistory)
    ? input.selectedHistory.filter(isOotCardId)
    : [];
  const revealedHints = Array.isArray(input.revealedHints)
    ? [...new Set(input.revealedHints.filter((item): item is string => typeof item === "string"))]
    : [];
  return {
    gameId: "oot",
    currentCardId,
    selectedHistory,
    revealedHints,
  };
}

export function applySelectNext(state: AdventureState, nextCardId: string): AdventureState {
  const current = OOT_CARDS[state.currentCardId];
  if (!isOotCardId(nextCardId) || !current.nextCardIds.includes(nextCardId)) {
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

export function applyRevealHint(state: AdventureState, mode: HintRevealMode): AdventureState {
  const current = OOT_CARDS[state.currentCardId];
  if (!current.hintIds.length) return state;
  if (mode === "all") {
    return {
      ...state,
      revealedHints: [...new Set([...state.revealedHints, ...current.hintIds])],
    };
  }
  const nextHint = current.hintIds.find((id) => !state.revealedHints.includes(id));
  if (!nextHint) return state;
  return {
    ...state,
    revealedHints: [...state.revealedHints, nextHint],
  };
}

export function buildAdventureView(state: AdventureState): AdventureView {
  const t = getMessages();
  const card = OOT_CARDS[state.currentCardId];
  const copy = t.cards[card.id];

  const revealedHints: RevealedHintView[] = card.hintIds
    .filter((id) => state.revealedHints.includes(id))
    .map((id, index) => {
      const level = (index + 1) as 1 | 2 | 3;
      return {
        id,
        level,
        label: t.guide.hintLevels[level],
        text: t.hints[id],
        isSolution: level === 3,
      };
    });

  const hasMoreHints = revealedHints.length < card.hintIds.length;
  const nextHintLevel = hasMoreHints ? ((revealedHints.length + 1) as 1 | 2 | 3) : null;

  const nextChoices: ChoiceCardView[] = card.nextCardIds.map((nextId) => {
    const nextDef = OOT_CARDS[nextId];
    const nextCopy = t.cards[nextId];
    return {
      id: nextId,
      badge: nextCopy.stepLabel,
      icon: nextDef.icon,
      title: nextCopy.title,
      description: nextCopy.steps[0] ?? "",
    };
  });

  return {
    gameId: state.gameId,
    card: {
      id: card.id,
      stepLabel: copy.stepLabel,
      icon: card.icon,
      title: copy.title,
      steps: copy.steps,
      referenceUrl: card.referenceUrl,
      hintQuestion: copy.hintQuestion,
      totalHints: card.hintIds.length,
      revealedHints,
      hasMoreHints,
      nextHintLevel,
    },
    nextChoices,
    canGoBack: state.selectedHistory.length > 0,
  };
}
