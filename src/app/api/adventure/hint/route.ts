import type { NextRequest } from "next/server";
import type { AdventurePayload, RevealHintRequest } from "@/api/types";
import { validateAdventureId } from "@/lib/adventure-id";
import { applyRevealHint, buildAdventureView } from "@/server/adventure-engine";
import {
  readAdventureCatalog,
  readAdventureState,
  writeAdventureState,
} from "@/server/adventure-store";
import { apiFail, apiOk } from "@/server/api-response";

export async function POST(request: NextRequest) {
  let body: Partial<RevealHintRequest>;
  try {
    body = (await request.json()) as Partial<RevealHintRequest>;
  } catch {
    return apiFail("invalid_request", 400);
  }

  const checked = validateAdventureId(body.adventureId ?? "");
  if (!checked.ok) return apiFail(checked.code, 400);
  if (body.mode !== "next" && body.mode !== "all") return apiFail("invalid_request", 400);

  const catalog = await readAdventureCatalog("oot");
  const current = await readAdventureState(checked.value, catalog);
  const next = applyRevealHint(current, body.mode, catalog);
  await writeAdventureState(checked.value, next, catalog);

  return apiOk<AdventurePayload>({
    adventureId: checked.value,
    view: buildAdventureView(next, catalog),
  });
}
