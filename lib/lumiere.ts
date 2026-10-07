/**
 * L'ARC DU JOUR.
 *
 * L'accueil raconte UNE JOURNÉE DE SERVICE : le matin clair de la mise en
 * place, le plein jour de la cave, l'après-midi qui se réchauffe, le soir à
 * table, la dernière heure du jour. JAMAIS de noir — la lumière baisse, elle
 * ne s'éteint pas.
 *
 * TOUT L'ARC EST DANS LE THÈME `creme` DE LA MARQUE. Les fonds ne sont plus
 * des valeurs saisies : ce sont les surfaces crème de vintoria-brand
 * (`eleve`, `surface`, `fond`, la crème de la tuile, le `filet`) et leurs
 * mélanges, résolus par le navigateur. La « chaleur » de l'après-midi n'est
 * donc pas une couleur ajoutée — ni or, ni ambre : c'est la crème de la
 * marque qui s'approfondit, de l'`eleve` vers la crème de la tuile.
 *
 * Cette table est la SEULE SOURCE DE VÉRITÉ des fonds. Le bas de chaque heure
 * est EXACTEMENT le haut de la suivante : aucun raccord ne doit se voir. Un
 * test importe cette table et le vérifie.
 *
 * CONTRASTE. Le point le plus sombre de l'arc (crème de la tuile + 50 % de
 * filet, au pied) garde le texte discret de la marque à 4,7:1, le texte
 * secondaire à 6,0:1 et l'accent à 7,4:1. Ne pas descendre plus bas : à
 * 100 % de filet, le discret tombe à 4,46:1.
 */

/** Les surfaces crème de la marque (app/marque/vintoria.css). */
const ELEVE = "var(--vintoria-creme-eleve)";
const SURFACE = "var(--vintoria-creme-surface)";
const FOND = "var(--vintoria-creme-fond)";
const TUILE = "var(--vintoria-creme-tuile)";
const FILET = "var(--vintoria-creme-filet)";

/** Un mélange de deux surfaces de la marque — jamais une valeur saisie. */
const entre = (a: string, b: string, partDeB: number) =>
  `color-mix(in oklab, ${a}, ${b} ${partDeB}%)`;

/** Les paliers de l'arc, du plus clair au plus sombre. */
const MIDI = entre(SURFACE, FOND, 50);
const APRES_MIDI = entre(FOND, TUILE, 50);
const DERNIERE_HEURE = entre(TUILE, FILET, 35);
const POSE = entre(TUILE, FILET, 50);

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
    haut: FOND,
    bas: DERNIERE_HEURE,
    lumiere: "le matin, haute et franche — elle tombe sur la table",
  },
  {
    cle: "geste",
    titre: "Le geste",
    haut: DERNIERE_HEURE,
    bas: ELEVE,
    lumiere:
      "le jour se lève sur la table : la lumière remonte, teintée de feuille",
  },
  {
    cle: "cave",
    titre: "La cave",
    haut: ELEVE,
    bas: SURFACE,
    lumiere: "plein midi — la surface la plus claire de la marque",
  },
  {
    cle: "accord",
    titre: "L’accord",
    haut: SURFACE,
    bas: MIDI,
    lumiere: "début d’après-midi — la caméra entre dans l’écran",
  },
  {
    cle: "table",
    titre: "La table",
    haut: MIDI,
    bas: FOND,
    lumiere: "l’après-midi s’allonge, la salle se dresse",
  },
  {
    cle: "instant",
    titre: "L’instant",
    haut: FOND,
    bas: APRES_MIDI,
    lumiere:
      "le service : la lumière est basse et chaude, les écrans convives sont sombres",
  },
  {
    cle: "pourqui",
    titre: "Pour qui",
    haut: APRES_MIDI,
    bas: TUILE,
    lumiere: "une respiration — la crème de la tuile, teintée de sauge",
  },
  {
    cle: "invitation",
    titre: "L’invitation",
    haut: TUILE,
    bas: DERNIERE_HEURE,
    lumiere: "la dernière heure du jour",
  },
  {
    cle: "pied",
    titre: "Le pied",
    haut: DERNIERE_HEURE,
    bas: POSE,
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
