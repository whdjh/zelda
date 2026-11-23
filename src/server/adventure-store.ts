import "server-only";
import { ADVENTURES_TABLE, createSupabaseClient, type AdventureRow } from "@/lib/supabase";
import {
  createInitialState,
  sanitizeState,
  type AdventureState,
} from "@/server/adventure-engine";

// Supabase 테이블 미생성/오프라인 로컬 개발 시 서버 메모리 폴백
const fallbackStore = new Map<string, AdventureState>();

function rowToState(row: AdventureRow): AdventureState {
  return sanitizeState({
    currentCardId: row.current_card_id as AdventureState["currentCardId"],
    selectedHistory: row.selected_history as AdventureState["selectedHistory"],
    revealedHints: row.revealed_hints,
  });
}

export async function readAdventureState(adventureId: string): Promise<AdventureState> {
  const supabase = createSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from(ADVENTURES_TABLE)
      .select("adventure_id, current_card_id, selected_history, revealed_hints, updated_at")
      .eq("adventure_id", adventureId)
      .maybeSingle<AdventureRow>();

    if (!error) {
      if (data) {
        const state = rowToState(data);
        fallbackStore.set(adventureId, state);
        return state;
      }
      const initial = createInitialState();
      await writeAdventureState(adventureId, initial);
      return initial;
    }
  }

  const cached = fallbackStore.get(adventureId);
  if (cached) return cached;
  const initial = createInitialState();
  fallbackStore.set(adventureId, initial);
  return initial;
}

export async function writeAdventureState(adventureId: string, state: AdventureState): Promise<void> {
  const clean = sanitizeState(state);
  fallbackStore.set(adventureId, clean);

  const supabase = createSupabaseClient();
  if (!supabase) return;

  await supabase.from(ADVENTURES_TABLE).upsert({
    adventure_id: adventureId,
    current_card_id: clean.currentCardId,
    selected_history: clean.selectedHistory,
    revealed_hints: clean.revealedHints,
    updated_at: new Date().toISOString(),
  });
}
