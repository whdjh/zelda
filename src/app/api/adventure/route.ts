import type { NextRequest } from "next/server";
import type { AdventurePayload } from "@/api/types";
import { validateAdventureId } from "@/lib/adventure-id";
import { buildAdventureView } from "@/server/adventure-engine";
import { readAdventureCatalog, readAdventureState } from "@/server/adventure-store";
import { apiFail, apiOk } from "@/server/api-response";

export async function GET(request: NextRequest) {
  const rawId = request.nextUrl.searchParams.get("id") ?? "";
  const checked = validateAdventureId(rawId);
  if (!checked.ok) return apiFail(checked.code, 400);

  const catalog = await readAdventureCatalog("oot");
  const state = await readAdventureState(checked.value, catalog);
  return apiOk<AdventurePayload>({
    adventureId: checked.value,
    view: buildAdventureView(state, catalog),
  });
}
