import { ko, type Messages } from "./ko.ts";

export type Locale = "ko";

const dictionaries: Record<Locale, Messages> = {
  ko,
};

export function getMessages(locale: Locale = "ko"): Messages {
  return dictionaries[locale];
}
