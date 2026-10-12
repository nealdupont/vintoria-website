/**
 * LE PORTRAIT ÉCONOMIQUE DE LA CAVE DE DÉMONSTRATION.
 *
 * PROVENANCE, parce qu'elle a déjà été fausse une fois.
 *
 * Ces quatre chiffres sont ceux que Vintoria Pro 2.0.2 calcule sur SA PROPRE
 * démonstration. Deux sources, et rien d'autre :
 *   · les prix de vente — vintoria-pro-atelier/tests/reference/fixtures/cave.ts
 *   · le stock, les seuils et les coûts —
 *     vintoria-pro-atelier/tests/reference/atelier/cave.ts → DEMO_STOCK
 * et la règle de valorisation vient de lib/stock/finance.ts :
 *     « VALEUR COMMERCIALE : Σ prix de vente × stock, références
 *       valorisables uniquement. »
 *
 * Ils ont été vérifiés DEUX FOIS, par deux chemins indépendants : en
 * recalculant la somme depuis les deux fichiers, et en lisant l'écran Cave
 * rendu par le produit lui-même (« 15 références · 158 bouteilles en cave ·
 * 2 à réassortir · 1 épuisé »). Les deux concordent.
 *
 * CE QUI A ÉTÉ CORRIGÉ. La page affichait auparavant 179 bouteilles et une
 * alerte sur le Châteauneuf-du-Pape. Ces valeurs venaient du harnais de
 * capture que j'avais écrit pour le film : sept quantités que j'avais
 * choisies, et un repli cyclique pour les huit autres vins. Le logiciel ne
 * les calcule pas. La page affirmait pourtant qu'il le faisait.
 *
 * SI DEMO_STOCK CHANGE À LA SOURCE, ces chiffres et les deux captures
 * (public/produit/cave.webp, reassort.webp) doivent être refaits ensemble.
 */

export type Mesure = {
  /** Présent sur les mesures listées, qui ont besoin d'une clé React. */
  readonly cle?: string;
  /** Pour l'animation de révélation : la valeur sans son unité. */
  readonly nombre: string;
  readonly unite: string;
  readonly dit: string;
};

/** Ce que la maison possède, puis ce qu'elle en a. */
export const COMPTE = [
  {
    cle: "references",
    nombre: "15",
    unite: "références",
    dit: "entrées depuis votre carte",
  },
  {
    cle: "bouteilles",
    nombre: "158",
    unite: "bouteilles",
    dit: "comptées, millésime par millésime",
  },
] as const satisfies readonly Mesure[];

/** Le sommet : ce que cette cave représente. */
export const VALEUR = {
  montant: "7 972 €",
  dit: "au prix de votre carte",
  /* Reformulation FIDÈLE de la règle du code, pas une paraphrase
     commerciale : les deux exclusions de computeFinancials — référence sans
     prix, stock non suivi — y sont dites explicitement. Ce n'est pas une
     citation : le code ne contient pas cette phrase. */
  calcul:
    "Les prix de votre carte, multipliés par les bouteilles réellement en cave. Les références sans prix, et celles dont le stock n’est pas suivi, n’y entrent pas.",
} as const;

/**
 * Ce qui demande votre attention.
 *
 * LE PRODUIT SE CONTREDIT SUR SON PROPRE ÉCRAN, et la capture le montre :
 * son en-tête sépare (« 2 à réassortir · 1 épuisé ») quand son panneau de
 * droite groupe (« À RÉASSORTIR — 3 vins »). Reprendre l'un des deux mots
 * aurait donc été démenti par l'autre, à quelques centimètres de là.
 *
 * La formulation retenue est exacte dans les DEUX lectures : trois
 * références demandent une action, et le détail dit lesquelles. Aucune
 * logique métier n'a été touchée pour obtenir ce confort de lecture.
 */
export const VIGILANCE = {
  nombre: "3",
  unite: "demandent votre attention",
  dit: "deux sous leur seuil, un épuisé",
} as const satisfies Mesure;

/* ════════════════════════════════════════════════════════════════════
   LE DÉTAIL QUE LES PLANCHES DESSINENT

   Les quatre chiffres ci-dessus sont ceux que la page ANNONCE. Ceux qui
   suivent sont ceux qu'elle DESSINE — la composition par couleur, le
   détail de l'addition, les trois références sous surveillance. Même
   provenance, mêmes deux fichiers, même règle : ils sont recalculés par
   tests/chiffres.spec.ts à chaque exécution, exactement comme les autres.
   Les coder dans le composant de dessin les aurait soustraits à ce
   garde-fou, et c'est précisément ainsi que « 179 bouteilles » avait
   survécu.
   ════════════════════════════════════════════════════════════════════ */

/** L'espace fine insécable du site, celle de `VALEUR.montant`. */
const FINE = " ";

/** Un entier à la française : 4514 → « 4 514 ». */
export const fr = (n: number): string =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, FINE);

/**
 * La cave par couleur, en bouteilles.
 *
 * Les familles sont celles de `wines.color` chez le produit ; leur somme
 * vaut exactement le total de bouteilles, et le test le vérifie. On ne
 * reprend PAS `STOCK_CATEGORY_ORDER` : cet ordre d'affichage contient
 * « spiritueux », que la donnée ne produit pas encore.
 */
export const COMPOSITION = [
  /* `cle` est la valeur EXACTE de `wines.color` chez le produit, accents
     compris : le garde-fou joint les deux tables dessus, et une table de
     traduction aurait été un second endroit où se tromper. */
  { cle: "rouge", nom: "Rouges", bouteilles: 52 },
  { cle: "blanc", nom: "Blancs", bouteilles: 51 },
  { cle: "rosé", nom: "Rosés", bouteilles: 31 },
  { cle: "pétillant", nom: "Pétillants", bouteilles: 18 },
  { cle: "moelleux", nom: "Moelleux", bouteilles: 6 },
] as const;

/**
 * L'addition, telle qu'un bordereau la poserait.
 *
 * Les trois plus grosses lignes de la cave, puis le reste groupé. La somme
 * des quatre vaut `VALEUR.montant` au centime : c'est la règle de
 * `computeFinancials` — prix de vente × stock, références valorisables
 * seulement — écrite à la main plutôt qu'affirmée.
 */
export const ADDITION = {
  lignes: [
    { nom: "Champagne Brut Réserve", prix: 85, bouteilles: 18, total: 1530 },
    { nom: "Côtes de Provence", prix: 32, bouteilles: 31, total: 992 },
    { nom: "Morgon", prix: 36, bouteilles: 26, total: 936 },
  ],
  /** Les onze autres références valorisées, d'un bloc. */
  reste: { references: 11, total: 4514 },
} as const;

/**
 * Ce que la règle `isLowStock` sort du lot.
 *
 * « quantité ≤ seuil propre, ou trois par défaut » — et zéro vaut
 * « épuisé », pas « bas ». Le seuil est `null` quand la référence est
 * épuisée : à zéro, le produit ne la classe plus par rapport à un seuil.
 */
export const SEUILS = [
  { nom: "Meursault", bouteilles: 2, seuil: 3 },
  { nom: "Crozes-Hermitage", bouteilles: 5, seuil: 6 },
  { nom: "Crémant de Loire", bouteilles: 0, seuil: null },
] as const;
