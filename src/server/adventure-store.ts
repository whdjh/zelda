import "server-only";
import type { CardCategory, GameId } from "@/api/types";
import {
  ADVENTURES_TABLE,
  CARDS_TABLE,
  createSupabaseClient,
  HINTS_TABLE,
  type AdventureRow,
  type CardRow,
  type HintRow,
} from "@/lib/supabase";
import {
  createInitialState,
  sanitizeState,
  type AdventureState,
} from "@/server/adventure-engine";
import {
  DEFAULT_OOT_CATALOG,
  type AdventureCatalog,
  type CatalogCard,
  type CatalogHint,
} from "@/server/oot-catalog";

// Supabase 테이블 미생성/오프라인 로컬 개발 시 서버 메모리 폴백
const fallbackStore = new Map<string, AdventureState>();

function isValidLevel(value: unknown): value is 1 | 2 | 3 {
  return value === 1 || value === 2 || value === 3;
}

function normalizeCategory(value: unknown): CardCategory {
  if (value === "main" || value === "safety" || value === "utility") return value;
  return "main";
}

function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function buildCatalogFromRows(
  gameId: GameId,
  cardRows: CardRow[],
  hintRows: HintRow[],
): AdventureCatalog | null {
  if (!cardRows.length) return null;

  const hintsByCard = new Map<string, CatalogHint[]>();
  for (const row of hintRows) {
    if (!isValidLevel(row.level)) continue;
    const list = hintsByCard.get(row.card_id) ?? [];
    list.push({ id: row.hint_id, level: row.level, text: row.text });
    hintsByCard.set(row.card_id, list);
  }

  const cards: Record<string, CatalogCard> = {};
  let initialCardId: string | null = null;

  for (const row of cardRows) {
    if (row.is_initial && !initialCardId) {
      initialCardId = row.card_id;
    }
    const hints = (hintsByCard.get(row.card_id) ?? []).sort((a, b) => a.level - b.level);
    cards[row.card_id] = {
      id: row.card_id,
      category: normalizeCategory(row.category),
      stepLabel: row.step_label,
      title: row.title,
      icon: row.icon,
      steps: normalizeStringArray(row.steps),
      referenceUrl: row.reference_url,
      hintQuestion: row.hint_question ?? "",
      hints,
      requiresFlags: normalizeStringArray(row.requires_flags),
      grantsFlags: normalizeStringArray(row.grants_flags),
      priority: typeof row.priority === "number" ? row.priority : 50,
      boostWhenFlags: normalizeStringArray(row.boost_when_flags),
      sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
    };
  }

  const resolvedInitial = initialCardId ?? cardRows[0]?.card_id;
  if (!resolvedInitial || !(resolvedInitial in cards)) return null;

  return {
    gameId,
    initialCardId: resolvedInitial,
    cards,
  };
}

export async function readAdventureCatalog(gameId: GameId = "oot"): Promise<AdventureCatalog> {
  const supabase = createSupabaseClient();
  if (!supabase) return DEFAULT_OOT_CATALOG;

  const [cardsResult, hintsResult] = await Promise.all([
    supabase
      .from(CARDS_TABLE)
      .select(
        "game_id, card_id, is_initial, category, step_label, title, icon, steps, reference_url, hint_question, requires_flags, grants_flags, priority, boost_when_flags, sort_order",
      )
      .eq("game_id", gameId)
      .order("sort_order", { ascending: true }),
    supabase
      .from(HINTS_TABLE)
      .select("game_id, hint_id, card_id, level, text")
      .eq("game_id", gameId)
      .order("level", { ascending: true }),
  ]);

  if (cardsResult.error || hintsResult.error) {
    return DEFAULT_OOT_CATALOG;
  }

  const catalog = buildCatalogFromRows(
    gameId,
    (cardsResult.data ?? []) as CardRow[],
    (hintsResult.data ?? []) as HintRow[],
  );
  return catalog ?? DEFAULT_OOT_CATALOG;
}

function rowToState(row: AdventureRow, catalog: AdventureCatalog): AdventureState {
  return sanitizeState(
    {
      currentCardId: row.current_card_id ?? undefined,
      selectedHistory: row.selected_history,
      completedCards: Array.isArray(row.completed_cards) ? row.completed_cards : undefined,
      revealedHints: row.revealed_hints,
    },
    catalog,
  );
}

export async function readAdventureState(
  adventureId: string,
  catalog: AdventureCatalog = DEFAULT_OOT_CATALOG,
): Promise<AdventureState> {
  const supabase = createSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from(ADVENTURES_TABLE)
      .select(
        "adventure_id, current_card_id, selected_history, completed_cards, revealed_hints, updated_at",
      )
      .eq("adventure_id", adventureId)
      .maybeSingle<AdventureRow>();

    if (!error) {
      if (data) {
        const state = rowToState(data, catalog);
        fallbackStore.set(adventureId, state);
        return state;
      }
      const initial = createInitialState(catalog);
      await writeAdventureState(adventureId, initial, catalog);
      return initial;
    }
  }

  const cached = fallbackStore.get(adventureId);
  if (cached) return sanitizeState(cached, catalog);
  const initial = createInitialState(catalog);
  fallbackStore.set(adventureId, initial);
  return initial;
}

export async function writeAdventureState(
  adventureId: string,
  state: AdventureState,
  catalog: AdventureCatalog = DEFAULT_OOT_CATALOG,
): Promise<void> {
  const clean = sanitizeState(state, catalog);
  fallbackStore.set(adventureId, clean);

  const supabase = createSupabaseClient();
  if (!supabase) return;

  await supabase.from(ADVENTURES_TABLE).upsert({
    adventure_id: adventureId,
    current_card_id: clean.currentCardId,
    selected_history: clean.selectedHistory,
    completed_cards: clean.completedCards,
    revealed_hints: clean.revealedHints,
    updated_at: new Date().toISOString(),
  });
}
