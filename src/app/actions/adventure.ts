"use server";

import { validateAdventureId, type AdventureIdErrorCode } from "@/lib/adventure-id";
import { ADVENTURES_TABLE, createSupabaseClient, type AdventureRow } from "@/lib/supabase";

export type LoginActionResult =
  | {
      ok: true;
      adventureId: string;
      synced: boolean;
      record?: AdventureRow;
    }
  | {
      ok: false;
      code: AdventureIdErrorCode;
    };

export async function loginWithAdventureId(rawId: string): Promise<LoginActionResult> {
  const checked = validateAdventureId(rawId);
  if (!checked.ok) {
    return { ok: false, code: checked.code };
  }

  const supabase = createSupabaseClient();
  if (!supabase) {
    return {
      ok: true,
      adventureId: checked.value,
      synced: false,
    };
  }

  const { data: existing, error: selectError } = await supabase
    .from(ADVENTURES_TABLE)
    .select("adventure_id, current_card_id, selected_history, revealed_hints, updated_at")
    .eq("adventure_id", checked.value)
    .maybeSingle<AdventureRow>();

  if (selectError) {
    return { ok: true, adventureId: checked.value, synced: false };
  }

  if (existing) {
    return { ok: true, adventureId: checked.value, synced: true, record: existing };
  }

  const { data: created, error: insertError } = await supabase
    .from(ADVENTURES_TABLE)
    .insert({
      adventure_id: checked.value,
      current_card_id: null,
      selected_history: [],
      revealed_hints: [],
      updated_at: new Date().toISOString(),
    })
    .select("adventure_id, current_card_id, selected_history, revealed_hints, updated_at")
    .single<AdventureRow>();

  if (insertError) {
    return { ok: true, adventureId: checked.value, synced: false };
  }

  return { ok: true, adventureId: checked.value, synced: true, record: created };
}
