import type { NextRequest } from "next/server";
import type { AdventurePayload, GoBackRequest } from "@/api/types";
import { validateAdventureId } from "@/lib/adventure-id";
import { applyGoBack, buildAdventureView } from "@/server/adventure-engine";
import {
  readAdventureCatalog,
  readAdventureState,
  writeAdventureState,
} from "@/server/adventure-store";
import { apiFail, apiOk } from "@/server/api-response";

export async function POST(request: NextRequest) {
  let body: Partial<GoBackRequest>;
  try {
    body = (await request.json()) as Partial<GoBackRequest>;
  } catch {
    return apiFail("invalid_request", 400);
  }

  const checked = validateAdventureId(body.adventureId ?? "");
  if (!checked.ok) return apiFail(checked.code, 400);

  const catalog = await readAdventureCatalog("oot");
  const current = await readAdventureState(checked.value, catalog);
  const next = applyGoBack(current);
  await writeAdventureState(checked.value, next, catalog);

  return apiOk<AdventurePayload>({
    adventureId: checked.value,
    view: buildAdventureView(next, catalog),
  });
}
