import type { NextRequest } from "next/server";
import type { AdventurePayload, SelectNextRequest } from "@/api/types";
import { validateAdventureId } from "@/lib/adventure-id";
import { applySelectNext, buildAdventureView } from "@/server/adventure-engine";
import {
  readAdventureCatalog,
  readAdventureState,
  writeAdventureState,
} from "@/server/adventure-store";
import { apiFail, apiOk } from "@/server/api-response";

export async function POST(request: NextRequest) {
  let body: Partial<SelectNextRequest>;
  try {
    body = (await request.json()) as Partial<SelectNextRequest>;
  } catch {
    return apiFail("invalid_request", 400);
  }

  const checked = validateAdventureId(body.adventureId ?? "");
  if (!checked.ok) return apiFail(checked.code, 400);
  if (typeof body.nextCardId !== "string") return apiFail("invalid_request", 400);

  const catalog = await readAdventureCatalog("oot");
  const current = await readAdventureState(checked.value, catalog);
  const next = applySelectNext(current, body.nextCardId, catalog);
  await writeAdventureState(checked.value, next, catalog);

  return apiOk<AdventurePayload>({
    adventureId: checked.value,
    view: buildAdventureView(next, catalog),
  });
}
