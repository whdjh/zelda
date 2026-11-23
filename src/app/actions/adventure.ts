"use server";

import { validateAdventureId } from "@/lib/adventure-id";
import { ADVENTURES_TABLE, createSupabaseClient, type AdventureRow } from "@/lib/supabase";

export type LoginActionResult =
  | {
      ok: true;
      adventureId: string;
      synced: boolean;
      record?: AdventureRow;
      notice: string;
    }
  | {
      ok: false;
      error: string;
    };

export async function loginWithAdventureId(rawId: string): Promise<LoginActionResult> {
  const checked = validateAdventureId(rawId);
  if (!checked.ok) {
    return { ok: false, error: checked.error };
  }

  const supabase = createSupabaseClient();
  if (!supabase) {
    return {
      ok: true,
      adventureId: checked.value,
      synced: false,
      notice: "브라우저에 저장됐어요. Supabase 키를 연결하면 서버에도 자동 저장돼요.",
    };
  }

  const now = new Date().toISOString();
  const { data: existing, error: selectError } = await supabase
    .from(ADVENTURES_TABLE)
    .select("adventure_id, current_card_id, selected_history, revealed_hints, updated_at")
    .eq("adventure_id", checked.value)
    .maybeSingle<AdventureRow>();

  if (selectError) {
    return {
      ok: true,
      adventureId: checked.value,
      synced: false,
      notice: `로컬 로그인은 완료됐어요. Supabase 테이블(${ADVENTURES_TABLE})을 확인해 주세요.`,
    };
  }

  if (existing) {
    return {
      ok: true,
      adventureId: checked.value,
      synced: true,
      record: existing,
      notice: "Supabase에 저장된 모험 기록을 불러왔어요.",
    };
  }

  const { data: created, error: insertError } = await supabase
    .from(ADVENTURES_TABLE)
    .insert({
      adventure_id: checked.value,
      current_card_id: null,
      selected_history: [],
      revealed_hints: [],
      updated_at: now,
    })
    .select("adventure_id, current_card_id, selected_history, revealed_hints, updated_at")
    .single<AdventureRow>();

  if (insertError) {
    return {
      ok: true,
      adventureId: checked.value,
      synced: false,
      notice: `로컬 로그인은 완료됐어요. Supabase 저장 권한(${ADVENTURES_TABLE})을 확인해 주세요.`,
    };
  }

  return {
    ok: true,
    adventureId: checked.value,
    synced: true,
    record: created,
    notice: "새 모험 아이디를 Supabase에 등록했어요.",
  };
}
