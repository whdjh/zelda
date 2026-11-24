import type { AdventureIdErrorCode } from "../lib/adventure-id.ts";

export type GameId = "oot";
export type CardId = string;
export type HintRevealMode = "next" | "all";

export interface RevealedHintView {
  id: string;
  level: 1 | 2 | 3;
  label: string;
  text: string;
  isSolution: boolean;
}

export interface ChoiceCardView {
  id: CardId;
  badge: string;
  icon: string;
  title: string;
  description: string;
}

export interface AdventureView {
  gameId: GameId;
  card: {
    id: CardId;
    stepLabel: string;
    icon: string;
    title: string;
    steps: readonly string[];
    referenceUrl: string;
    hintQuestion: string;
    totalHints: number;
    revealedHints: RevealedHintView[];
    hasMoreHints: boolean;
    nextHintLevel: 1 | 2 | 3 | null;
  };
  nextChoices: ChoiceCardView[];
  canGoBack: boolean;
}

export interface AdventurePayload {
  adventureId: string;
  view: AdventureView;
}

export interface SelectNextRequest {
  adventureId: string;
  nextCardId: string;
}

export interface GoBackRequest {
  adventureId: string;
}

export interface RevealHintRequest {
  adventureId: string;
  mode: HintRevealMode;
}

export type ApiErrorCode = AdventureIdErrorCode | "invalid_request" | "network_error";

export type ApiSuccessResponse<T> = {
  ok: true;
  data: T;
};

export type ApiErrorResponse = {
  ok: false;
  code: ApiErrorCode;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
