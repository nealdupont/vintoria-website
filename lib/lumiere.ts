/**
 * L'ARC DU JOUR.
 *
 * L'accueil raconte UNE JOURNÉE DE SERVICE : le matin clair de la mise en
 * place, le plein jour de la cave, l'après-midi qui se réchauffe, le soir à
 * table, l'heure dorée. JAMAIS de noir — la lumière baisse, elle ne s'éteint
 * pas.
 *
 * Cette table est la SEULE SOURCE DE VÉRITÉ des fonds. Le bas de chaque heure
 * est EXACTEMENT le haut de la suivante : aucun raccord ne doit se voir. Un
 * test importe cette table et le vérifie — une marche de cinq valeurs sur
 * 255 se lit à l'œil sur un aplat, et elle serait passée inaperçue en
 * relisant sept composants séparément.
 *
 * Tous ces fonds ont été vérifiés : l'échelle de texte (fort / texte /
 * faible / accent / feuille) tient 4,8:1 au minimum sur le plus sombre
 * d'entre eux.
 */

export type Heure = {
  readonly cle: string;
  readonly titre: string;
  readonly haut: string;
  readonly bas: string;
  /** Ce que la lumière fait à ce moment du jour. */
  readonly lumiere: string;
};

export const HEURES = [
  {
    cle: "ouverture",
    titre: "L’ouverture",
    haut: "#f7f4ed",
    bas: "#ded3bf",
    lumiere: "le matin, haute et franche — elle tombe sur le chêne",
  },
  {
    cle: "geste",
    titre: "Le geste",
    haut: "#ded3bf",
    bas: "#fcfaf5",
    lumiere:
      "le jour se lève sur la table : la lumière remonte, teintée de feuille",
  },
  {
    cle: "cave",
    titre: "La cave",
    haut: "#fcfaf5",
    bas: "#faf6ec",
    lumiere: "plein midi — la craie de l’Atelier lui-même",
  },
  {
    cle: "accord",
    titre: "L’accord",
    haut: "#faf6ec",
    bas: "#f7f0e2",
    lumiere: "début d’après-midi — la caméra entre dans l’écran",
  },
  {
    cle: "table",
    titre: "La table",
    haut: "#f7f0e2",
    bas: "#f4ead8",
    lumiere: "l’après-midi s’allonge, la salle se dresse",
  },
  {
    cle: "instant",
    titre: "L’instant",
    haut: "#f4ead8",
    bas: "#efe2cd",
    lumiere:
      "le service : la lumière est basse et chaude, les écrans convives sont sombres",
  },
  {
    cle: "pourqui",
    titre: "Pour qui",
    haut: "#efe2cd",
    bas: "#f1e8da",
    lumiere: "une respiration — la lumière reprend un peu, teintée de sauge",
  },
  {
    cle: "invitation",
    titre: "L’invitation",
    haut: "#f1e8da",
    bas: "#e9dcc4",
    lumiere: "l’heure dorée, la dernière du jour",
  },
  {
    cle: "pied",
    titre: "Le pied",
    haut: "#e9dcc4",
    bas: "#e3d4b8",
    lumiere: "la nuit n’arrive pas : le jour se pose",
  },
] as const satisfies readonly Heure[];

/** Les clés d'heure, en type : une faute de frappe devient une erreur de
    compilation plutôt qu'une exception au rendu. */
export type CleHeure = (typeof HEURES)[number]["cle"];

const PAR_CLE = new Map<CleHeure, Heure>(HEURES.map((h) => [h.cle, h]));

/** Le ciel d'une heure, en dégradé vertical prêt à poser. */
export function ciel(cle: CleHeure): string {
  const h = PAR_CLE.get(cle);
  if (!h) throw new Error(`Heure inconnue : ${cle}`);
  return `linear-gradient(to bottom, ${h.haut} 0%, ${h.bas} 100%)`;
}

/** Le fond d'arrivée d'une heure — utile pour tout voile qui doit s'y fondre. */
export function basDe(cle: CleHeure): string {
  const h = PAR_CLE.get(cle);
  if (!h) throw new Error(`Heure inconnue : ${cle}`);
  return h.bas;
}

export function hautDe(cle: CleHeure): string {
  const h = PAR_CLE.get(cle);
  if (!h) throw new Error(`Heure inconnue : ${cle}`);
  return h.haut;
}
