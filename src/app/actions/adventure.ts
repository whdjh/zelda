"use server";

import { validateAdventureId, type AdventureIdErrorCode } from "@/lib/adventure-id";
import {
  applyGoBack,
  applyRevealHint,
  applySelectNext,
  buildAdventureView,
  type AdventureView,
} from "@/server/adventure-engine";
import { readAdventureState, writeAdventureState } from "@/server/adventure-store";

export type AdventureActionResult =
  | { ok: true; adventureId: string; view: AdventureView }
  | { ok: false; code: AdventureIdErrorCode };

export async function loadAdventureAction(rawId: string): Promise<AdventureActionResult> {
  const checked = validateAdventureId(rawId);
  if (!checked.ok) return { ok: false, code: checked.code };

  const state = await readAdventureState(checked.value);
  return {
    ok: true,
    adventureId: checked.value,
    view: buildAdventureView(state),
  };
}

export async function selectNextCardAction(
  rawId: string,
  nextCardId: string,
): Promise<AdventureActionResult> {
  const checked = validateAdventureId(rawId);
  if (!checked.ok) return { ok: false, code: checked.code };

  const current = await readAdventureState(checked.value);
  const next = applySelectNext(current, nextCardId);
  await writeAdventureState(checked.value, next);

  return {
    ok: true,
    adventureId: checked.value,
    view: buildAdventureView(next),
  };
}

export async function goBackCardAction(rawId: string): Promise<AdventureActionResult> {
  const checked = validateAdventureId(rawId);
  if (!checked.ok) return { ok: false, code: checked.code };

  const current = await readAdventureState(checked.value);
  const next = applyGoBack(current);
  await writeAdventureState(checked.value, next);

  return {
    ok: true,
    adventureId: checked.value,
    view: buildAdventureView(next),
  };
}

export async function revealHintAction(
  rawId: string,
  mode: "next" | "all",
): Promise<AdventureActionResult> {
  const checked = validateAdventureId(rawId);
  if (!checked.ok) return { ok: false, code: checked.code };

  const current = await readAdventureState(checked.value);
  const next = applyRevealHint(current, mode);
  await writeAdventureState(checked.value, next);

  return {
    ok: true,
    adventureId: checked.value,
    view: buildAdventureView(next),
  };
}
