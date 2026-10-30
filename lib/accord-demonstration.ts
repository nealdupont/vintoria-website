/**
 * L'ACCORD DE DÉMONSTRATION — ce que Vintoria fait VRAIMENT d'un plat.
 *
 * PROVENANCE. Tout ce qui est ici a été lu dans le code de Vintoria Pro
 * 2.0.2, pas dans une intention commerciale. Les fichiers, et ce qu'ils
 * prouvent :
 *
 *   · lib/dishes/pairing-inputs.ts — « La génération d'accords ne lit du
 *     plat que son nom, sa description et sa catégorie. » Trois champs.
 *     Ni ingrédient, ni cuisson, ni nuance aromatique. Corriger un prix ne
 *     touche à aucun accord ; modifier l'un des trois passe le plat en
 *     « à régénérer ».
 *
 *   · lib/carte/accords.ts — le vocabulaire, pris au parcours du convive :
 *     DISPONIBLE (stock nul-non-suivi ou > 0 ; au verre, en plus
 *     `available_by_glass`) puis PROPOSÉ (disponible ET un prix dans le
 *     format). « Un vin disponible sans prix remplit un verre de la rangée,
 *     mais Vintoria ne le conseille jamais. »
 *     Les seuils de qualité : ≥ 90 idéal, ≥ 80 excellent, ≥ 70 bon, sinon
 *     harmonieux — et le plancher de génération est 60.
 *     « Le restaurateur voit le nombre, le convive jamais. »
 *
 *   · lib/menu/wine-experience.ts — DEUX axes de ressenti, pas davantage,
 *     et leurs mots exacts. « Position du curseur, en pourcentage (6-94) —
 *     jamais collé aux extrêmes. »
 *
 *   · lib/menu/budget.ts — deux échelles réelles, selon le format servi.
 *     « Libre = ni plancher ni plafond, jamais "pas de prix" : un vin sans
 *     prix reste exclu par le moteur, budget ou pas. »
 *
 *   · components/menu/result/PreferencesSheet.tsx — « une puce par goût
 *     réellement proposable par la carte, et pour chacune trois réponses :
 *     j'aime, sans préférence, j'évite ».
 *
 * LES DONNÉES CHIFFRÉES viennent de tests/reference/fixtures/cave.ts, et
 * tests/accords.spec.ts les y relit à chaque exécution. Le site n'appelle
 * pas le moteur : il transcrit. Une transcription se démode en silence —
 * c'est déjà arrivé une fois, voir lib/cave-demonstration.ts.
 */

/** Le plat, tel que le moteur le lit : trois champs, et rien d'autre. */
export const PLAT = {
  nom: "Filet de bœuf",
  description: "Jus corsé, pommes grenaille",
  categorie: "viandes",
  /** Lu pour l'affichage, JAMAIS par la génération d'accords. */
  prix: "38 €",
} as const;

/** Le vin retenu, avec l'identité que porte sa fiche. */
export const VIN = {
  nom: "Saint-Émilion Grand Cru",
  domaine: "Château Bellerive",
  region: "Bordeaux",
  cepages: "Merlot, Cabernet Franc",
  millesime: "2018",
  prix: "95 €",
} as const;

/**
 * L'accord lui-même.
 *
 * `score` est celui du fixture ; `mot` en découle par les seuils de
 * `qualiteDe` (93 ≥ 90, donc idéal). La phrase n'est pas une reformulation :
 * c'est celle que porte la donnée.
 */
export const ACCORD = {
  score: 93,
  mot: "Accord idéal",
  phrase:
    "La trame veloutée du Saint-Émilion enrobe le filet de bœuf et prolonge le jus corsé.",
} as const;

/**
 * LE CONTRE-EXEMPLE, ET IL EST DANS LA DONNÉE DU PRODUIT.
 *
 * Sur ce même filet de bœuf, une cuvée score 95 — plus haut que le
 * Saint-Émilion — et n'est jamais conseillée : elle n'a pas de prix, et son
 * stock n'est pas suivi. Le fixture la nomme lui-même « Cuvée sans prix »,
 * du « Domaine Oublié ». C'est la démonstration la plus nette que
 * disponible ne vaut pas proposé — et elle ne nous appartient pas, elle est
 * dans le produit.
 */
export const ECARTE = {
  nom: "Cuvée sans prix",
  domaine: "Domaine Oublié",
  score: 95,
  motif: "sans prix",
} as const;

/** Les quatre mots que lit le convive, et le seuil qui les sépare. */
export const QUALITES = [
  { mot: "Accord harmonieux", seuil: 60 },
  { mot: "Bel accord", seuil: 70 },
  { mot: "Très bel accord", seuil: 80 },
  { mot: "Accord idéal", seuil: 90 },
] as const;

/** Les deux axes de ressenti — il n'y en a pas d'autres. */
export const AXES = [
  { gauche: "Délicat", droite: "Intense" },
  { gauche: "Doux et rond", droite: "Vif et nerveux" },
] as const;

/** Les trois réglages du convive, à table. */
export const REGLAGES = {
  formats: ["au verre", "à la bouteille"],
  /** L'échelle bouteille ; celle du verre existe aussi (8 € / 15 €). */
  budgets: ["Libre", "moins de 50 €", "50 à 100 €", "plus de 100 €"],
  /** Trois réponses par goût proposable. */
  gouts: ["j’aime", "sans préférence", "j’évite"],
} as const;
