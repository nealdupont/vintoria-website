import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/fr";

const dictionaries: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  fr: () => import("./dictionaries/fr"),
  en: () => import("./dictionaries/en"),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const load = dictionaries[locale] ?? dictionaries.fr;
  return (await load()).default;
}

export type { Dictionary };
