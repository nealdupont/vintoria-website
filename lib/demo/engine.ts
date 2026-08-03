import type { Locale } from "@/i18n/config";

/**
 * Moteur de démonstration Vintoria.
 *
 * Données d'exemple — pas encore le vrai moteur. COUTURE :
 * `getRecommendations()` est le seul point à remplacer plus tard par un
 * appel au moteur Vintoria réel (API). La signature peut devenir
 * asynchrone sans toucher aux composants.
 */

export type Dish = { id: string; label: string; hint: string };

export type Recommendation = {
  wine: string;
  appellation: string;
  vintage: string;
  grape: string;
  colorHex: string;
  match: number;
  why: string;
};

const DISHES: Record<Locale, Dish[]> = {
  fr: [
    { id: "boeuf", label: "Bœuf braisé au vin rouge", hint: "riche, tannique" },
    { id: "turbot", label: "Turbot rôti, beurre blanc", hint: "gras, iodé" },
    { id: "comte", label: "Comté affiné 24 mois", hint: "sec, salin" },
    { id: "chocolat", label: "Tarte au chocolat noir", hint: "sucré, amer" },
  ],
  en: [
    { id: "boeuf", label: "Braised beef in red wine", hint: "rich, tannic" },
    { id: "turbot", label: "Roasted turbot, beurre blanc", hint: "buttery, briny" },
    { id: "comte", label: "24-month aged Comté", hint: "dry, saline" },
    { id: "chocolat", label: "Dark chocolate tart", hint: "sweet, bitter" },
  ],
};

const RECS: Record<string, Record<Locale, Recommendation[]>> = {
  boeuf: {
    fr: [
      { wine: "Châteauneuf-du-Pape", appellation: "Rhône", vintage: "2019", grape: "Grenache · Syrah", colorHex: "#5a1220", match: 94, why: "Tannins fermes et fruits noirs épousent le gras de la viande braisée." },
      { wine: "Barolo", appellation: "Piémont", vintage: "2017", grape: "Nebbiolo", colorHex: "#6a1524", match: 90, why: "Structure tannique et notes de goudron tiennent tête au plat mijoté." },
      { wine: "Madiran", appellation: "Sud-Ouest", vintage: "2016", grape: "Tannat", colorHex: "#4a0f1a", match: 87, why: "Charpente rustique pour un accord de terroir, franc et puissant." },
    ],
    en: [
      { wine: "Châteauneuf-du-Pape", appellation: "Rhône", vintage: "2019", grape: "Grenache · Syrah", colorHex: "#5a1220", match: 94, why: "Firm tannins and dark fruit meet the fat of the braised meat." },
      { wine: "Barolo", appellation: "Piedmont", vintage: "2017", grape: "Nebbiolo", colorHex: "#6a1524", match: 90, why: "Tannic structure and tar notes stand up to the slow-cooked dish." },
      { wine: "Madiran", appellation: "South-West", vintage: "2016", grape: "Tannat", colorHex: "#4a0f1a", match: 87, why: "Rustic backbone for a frank, powerful regional match." },
    ],
  },
  turbot: {
    fr: [
      { wine: "Meursault", appellation: "Bourgogne", vintage: "2020", grape: "Chardonnay", colorHex: "#d9b25a", match: 93, why: "Rondeur beurrée et minéralité pour épouser la sauce." },
      { wine: "Blanc de Blancs", appellation: "Champagne", vintage: "2016", grape: "Chardonnay", colorHex: "#e6cd82", match: 89, why: "Bulle fine et tension qui allègent le beurre blanc." },
      { wine: "Chablis 1er Cru", appellation: "Bourgogne", vintage: "2020", grape: "Chardonnay", colorHex: "#e0c877", match: 86, why: "Fraîcheur iodée en écho à la chair du turbot." },
    ],
    en: [
      { wine: "Meursault", appellation: "Burgundy", vintage: "2020", grape: "Chardonnay", colorHex: "#d9b25a", match: 93, why: "Buttery roundness and minerality wrap around the sauce." },
      { wine: "Blanc de Blancs", appellation: "Champagne", vintage: "2016", grape: "Chardonnay", colorHex: "#e6cd82", match: 89, why: "Fine bubbles and tension lighten the beurre blanc." },
      { wine: "Chablis 1er Cru", appellation: "Burgundy", vintage: "2020", grape: "Chardonnay", colorHex: "#e0c877", match: 86, why: "Briny freshness echoes the flesh of the turbot." },
    ],
  },
  comte: {
    fr: [
      { wine: "Vin Jaune", appellation: "Jura", vintage: "2015", grape: "Savagnin", colorHex: "#c8912f", match: 96, why: "Noix et curry répondent à l'affinage long — accord régional." },
      { wine: "Château-Chalon", appellation: "Jura", vintage: "2014", grape: "Savagnin", colorHex: "#c98a2a", match: 92, why: "Profil oxydatif et salin, taillé pour les pâtes pressées." },
      { wine: "Vin de Paille", appellation: "Jura", vintage: "2016", grape: "Savagnin", colorHex: "#d0a24a", match: 85, why: "Douceur et longueur pour contraster le sel du fromage." },
    ],
    en: [
      { wine: "Vin Jaune", appellation: "Jura", vintage: "2015", grape: "Savagnin", colorHex: "#c8912f", match: 96, why: "Walnut and curry echo the long affinage — a regional match." },
      { wine: "Château-Chalon", appellation: "Jura", vintage: "2014", grape: "Savagnin", colorHex: "#c98a2a", match: 92, why: "Oxidative, saline profile cut out for pressed cheeses." },
      { wine: "Vin de Paille", appellation: "Jura", vintage: "2016", grape: "Savagnin", colorHex: "#d0a24a", match: 85, why: "Sweetness and length to contrast the salt of the cheese." },
    ],
  },
  chocolat: {
    fr: [
      { wine: "Maury", appellation: "Roussillon", vintage: "2018", grape: "Grenache noir", colorHex: "#3a0f18", match: 91, why: "Sucrosité du vin doux qui équilibre l'amertume du cacao." },
      { wine: "Banyuls", appellation: "Roussillon", vintage: "2017", grape: "Grenache", colorHex: "#45111c", match: 89, why: "Fruits confits et cacao se répondent, note pour note." },
      { wine: "Porto Tawny", appellation: "Douro", vintage: "10 ans", grape: "Touriga", colorHex: "#4d1420", match: 86, why: "Rancio et noix pour prolonger le dessert." },
    ],
    en: [
      { wine: "Maury", appellation: "Roussillon", vintage: "2018", grape: "Black Grenache", colorHex: "#3a0f18", match: 91, why: "The sweetness of the fortified wine balances the cocoa's bitterness." },
      { wine: "Banyuls", appellation: "Roussillon", vintage: "2017", grape: "Grenache", colorHex: "#45111c", match: 89, why: "Candied fruit and cocoa answer each other, note for note." },
      { wine: "Tawny Port", appellation: "Douro", vintage: "10 yrs", grape: "Touriga", colorHex: "#4d1420", match: 86, why: "Rancio and walnut notes to extend the dessert." },
    ],
  },
};

export type Bottle = { id: string; label: string; hint: string };

export type BottleReading = {
  wine: string;
  appellation: string;
  vintage: string;
  grape: string;
  colorHex: string;
  robe: string;
  nose: string;
  palate: string;
  apogee: string;
  pairing: string;
  story: string;
};

const BOTTLES: Record<Locale, Bottle[]> = {
  fr: [
    { id: "gevrey", label: "Gevrey-Chambertin 2018", hint: "Bourgogne" },
    { id: "cdp", label: "Châteauneuf-du-Pape 2019", hint: "Rhône" },
    { id: "sancerre", label: "Sancerre 2021", hint: "Loire" },
  ],
  en: [
    { id: "gevrey", label: "Gevrey-Chambertin 2018", hint: "Burgundy" },
    { id: "cdp", label: "Châteauneuf-du-Pape 2019", hint: "Rhône" },
    { id: "sancerre", label: "Sancerre 2021", hint: "Loire" },
  ],
};

const READS: Record<string, Record<Locale, BottleReading>> = {
  gevrey: {
    fr: { wine: "Gevrey-Chambertin", appellation: "Bourgogne", vintage: "2018", grape: "Pinot Noir", colorHex: "#6a1526", robe: "Rubis profond", nose: "Cerise noire, sous-bois", palate: "Tanins soyeux, longue finale", apogee: "2024 – 2032", pairing: "Volaille rôtie, champignons", story: "Un village mythique de la Côte de Nuits, aujourd'hui à son apogée." },
    en: { wine: "Gevrey-Chambertin", appellation: "Burgundy", vintage: "2018", grape: "Pinot Noir", colorHex: "#6a1526", robe: "Deep ruby", nose: "Black cherry, undergrowth", palate: "Silky tannins, long finish", apogee: "2024 – 2032", pairing: "Roast poultry, mushrooms", story: "A legendary village of the Côte de Nuits, now at its peak." },
  },
  cdp: {
    fr: { wine: "Châteauneuf-du-Pape", appellation: "Rhône", vintage: "2019", grape: "Grenache · Syrah", colorHex: "#5a1220", robe: "Grenat dense", nose: "Fruits noirs, garrigue", palate: "Ample, épicée, chaleureuse", apogee: "2024 – 2034", pairing: "Agneau, thym", story: "La chaleur du Sud, domptée par un grand terroir." },
    en: { wine: "Châteauneuf-du-Pape", appellation: "Rhône", vintage: "2019", grape: "Grenache · Syrah", colorHex: "#5a1220", robe: "Dense garnet", nose: "Dark fruit, garrigue", palate: "Full, spiced, warming", apogee: "2024 – 2034", pairing: "Lamb, thyme", story: "The warmth of the South, tamed by a great terroir." },
  },
  sancerre: {
    fr: { wine: "Sancerre", appellation: "Loire", vintage: "2021", grape: "Sauvignon Blanc", colorHex: "#dccf84", robe: "Or pâle", nose: "Agrumes, pierre à fusil", palate: "Vive, tendue, minérale", apogee: "À boire maintenant", pairing: "Fruits de mer, chèvre frais", story: "La minéralité de la Loire, dans sa jeunesse éclatante." },
    en: { wine: "Sancerre", appellation: "Loire", vintage: "2021", grape: "Sauvignon Blanc", colorHex: "#dccf84", robe: "Pale gold", nose: "Citrus, flint", palate: "Bright, taut, mineral", apogee: "Drink now", pairing: "Seafood, fresh goat cheese", story: "The minerality of the Loire, in its bright youth." },
  },
};

export function getBottles(locale: Locale): Bottle[] {
  return BOTTLES[locale] ?? BOTTLES.fr;
}

export function getBottleReading(bottleId: string, locale: Locale): BottleReading {
  const byLocale = READS[bottleId] ?? READS.gevrey;
  return byLocale[locale] ?? byLocale.fr;
}

export function getDishes(locale: Locale): Dish[] {
  return DISHES[locale] ?? DISHES.fr;
}

export function getRecommendations(
  dishId: string,
  locale: Locale,
): Recommendation[] {
  const byLocale = RECS[dishId] ?? RECS.boeuf;
  return byLocale[locale] ?? byLocale.fr;
}
