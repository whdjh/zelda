export type CardId = "kokiri-gear" | "deku-tree";
export type HintId = "kokiri-gear-1" | "kokiri-gear-2" | "kokiri-gear-3";

export interface CardDefinition {
  id: CardId;
  icon: string;
  referenceUrl: string;
  hintIds: HintId[];
  nextCardIds: CardId[];
}

export const INITIAL_CARD_ID: CardId = "kokiri-gear";

export const CARDS: Record<CardId, CardDefinition> = {
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
    hintIds: [],
    nextCardIds: [],
  },
};

export function isCardId(value: unknown): value is CardId {
  return typeof value === "string" && value in CARDS;
}
