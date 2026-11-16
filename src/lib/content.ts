export type VerificationStatus = "proposed" | "cross_checked" | "playtested" | "compared";

export type Verification = {
  status: VerificationStatus;
  version: string;
  sourceIds: string[];
  guideSourceId?: string;
  verifiedAt?: string;
  evidence?: string;
  caveat?: string;
};

export type RouteStop = {
  id: string;
  title: string;
  summary: string[];
  walkthrough?: string[];
  requiredAge?: "child" | "adult";
  kind: "required" | "recommended" | "optional";
  prerequisiteStopIds: string[];
  prerequisiteItemIds: string[];
  rewardItemIds?: string[];
  routeNote?: string;
  routeVerification?: Verification;
  puzzleIds: string[];
  recommendationReason?: string;
  verification: Verification;
};

export type GuideContent = {
  version: string;
  gameVersion: string;
  sources: { id: string; title: string; url: string; version: string }[];
  items: { id: string; title: string; verification: Verification }[];
  stops: RouteStop[];
  tips?: { id: string; stopIds: string[]; title: string; text: string; verification: Verification }[];
  puzzles: {
    id: string;
    stopId: string;
    name: string;
    problemPhrase: string;
    hints: { id: string; level: 1 | 2 | 3; text: string }[];
    verification: Verification;
  }[];
};
