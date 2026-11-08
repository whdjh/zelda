"use server";

import { ootContent } from "../../../content/ocarina-of-time/index";
import { parseProgress, type SavedProgress } from "@/lib/progress-storage";
import { selectRoute } from "@/lib/route-selection";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProgressResult =
  | { ok: true; progress: SavedProgress | null; revision: number; route: ReturnType<typeof selectRoute> | null }
  | { ok: false; message: string };

const gameId = "ocarina-of-time";

export async function readCloudProgress(): Promise<ProgressResult> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { ok: false, message: "서버 저장 연결을 준비하고 있어요." };
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { ok: false, message: "서버 기록을 이용하려면 로그인해 주세요." };
    const { data, error } = await supabase.from("user_progress").select("data,revision")
      .eq("user_id", user.id).eq("game_id", gameId).eq("game_version", ootContent.gameVersion).maybeSingle();
    if (error) return { ok: false, message: "서버 기록을 읽지 못했어요. 연결과 데이터베이스 설정을 확인해 주세요." };
    const progress = data ? parseProgress(JSON.stringify(data.data), ootContent) : null;
    return { ok: true, progress, revision: data?.revision ?? 0, route: progress ? selectRoute(ootContent.stops, progress) : null };
  } catch {
    return { ok: false, message: "서버 기록을 읽지 못했어요. 로컬 기록은 유지됩니다." };
  }
}

export async function writeCloudProgress(raw: string, expectedRevision: number): Promise<ProgressResult> {
  if (typeof raw !== "string" || !Number.isSafeInteger(expectedRevision) || expectedRevision < 0) {
    return { ok: false, message: "올바르지 않은 저장 요청입니다." };
  }
  let progress: SavedProgress;
  try {
    progress = parseProgress(raw, ootContent);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "기록을 확인할 수 없어요." };
  }
  // 모순된 완료 기록도 보존한다. 선행 조건을 자동 완료하거나 임의로 보정하지 않는다.
  const route = selectRoute(ootContent.stops, progress);
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { ok: false, message: "서버 저장 연결을 준비하고 있어요." };
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { ok: false, message: "서버에 저장하려면 로그인해 주세요." };
    const query = expectedRevision === 0
      ? supabase.from("user_progress").insert({ user_id: user.id, game_id: gameId, game_version: ootContent.gameVersion, data: progress })
      : supabase.from("user_progress").update({ data: progress }).eq("user_id", user.id).eq("game_id", gameId)
        .eq("game_version", ootContent.gameVersion).eq("revision", expectedRevision);
    const { data, error } = await query.select("revision").maybeSingle();
    if (error?.code === "23505" || (!error && !data)) {
      return { ok: false, message: "다른 기기에서 서버 기록이 바뀌었어요. 서버 기록을 다시 확인한 뒤 저장해 주세요." };
    }
    if (error || !data) return { ok: false, message: "서버 저장에 실패했어요. 로컬 백업은 그대로 사용할 수 있어요." };
    return { ok: true, progress, revision: data.revision, route };
  } catch {
    return { ok: false, message: "서버에 연결하지 못했어요. 로컬 기록은 유지됩니다." };
  }
}
