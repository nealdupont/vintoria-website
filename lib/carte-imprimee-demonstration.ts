/**
 * LA CARTE IMPRIMÉE — ce que Vintoria sait VRAIMENT en faire.
 *
 * PROVENANCE. Tout vient de `vintoria-pro-carte`, branche `feat/carte-imprimee`
 * (v2.1.0), module `lib/carte-imprimee/`. Les fichiers, et ce qu'ils prouvent :
 *
 *   · formats.ts — DEUX formats, pas davantage : A4 (210 × 297 mm, marges
 *     24/22/22/22) et A5 (148 × 210, marges 16/15/14/14, échelle
 *     typographique 0,84). Un format est « des dimensions, des marges et une
 *     échelle ».
 *
 *   · gabarits.ts — TROIS styles : classique, contemporain, premium. Des
 *     données, pas du code. Deux voix seulement : Bodoni Moda pour les vins,
 *     la maison et les titres de famille ; Schibsted Grotesk pour ce qui se
 *     lit vite — détails, millésimes, prix, folios.
 *
 *   · types.ts — CINQ organisations (recommandée, couleur, région, pays,
 *     appellation) et CINQ langues (fr, en, de, it, es). Le millésime est
 *     « jamais deviné » ; la contenance ne s'écrit que si elle diffère de
 *     celle de la rubrique.
 *
 *   · organisation.ts — « Les vins servis au verre ouvrent la carte », puis
 *     les familles dans l'ordre de STOCK_CATEGORY_ORDER.
 *
 *   · CarteImprimee.tsx — l'écran : choisir les vins, l'organisation, le
 *     format, le style et la langue ; voir chaque page telle qu'elle
 *     s'imprimera ; télécharger le PDF. « L'aperçu et le PDF posent les
 *     mêmes lignes aux mêmes endroits », les mesures venant des chasses
 *     réelles des polices.
 *
 *   · qualite.ts — le contrôle « ne bloque jamais la génération ».
 *
 * CE QUI N'EST PAS PROMIS, PARCE QUE RIEN NE LE PORTE : aucun autre format
 * que A4 et A5, aucune impression directe depuis le produit (on télécharge
 * un PDF), aucun choix de police ni de couleur, aucune image.
 *
 * LES VINS sont ceux de la cave de démonstration du produit
 * (tests/reference/fixtures/cave.ts), relus par tests/carte-vins.spec.ts.
 * La « Cuvée sans prix » n'y figure pas : sans prix, elle ne porterait
 * aucune ligne de carte.
 */

export type Vin = {
  readonly nom: string;
  readonly domaine: string;
  readonly lieu: string;
  readonly millesime: string | null;
  readonly prix: string;
};

/** Les vins servis au verre ouvrent la carte — avec le prix du verre. */
export const AU_VERRE = {
  titre: "Au verre",
  /** La contenance la plus fréquente de la rubrique. */
  contenance: "12,5 cl",
  vins: [
    {
      nom: "Champagne Brut Réserve",
      domaine: "Maison Lambert",
      lieu: "Champagne",
      millesime: null,
      prix: "14",
    },
    {
      nom: "Petit Chablis",
      domaine: "Domaine des Falaises",
      lieu: "Bourgogne",
      millesime: "2022",
      prix: "9",
    },
    {
      nom: "Côtes de Provence",
      domaine: "Château des Pins",
      lieu: "Provence",
      millesime: "2023",
      prix: "7",
    },
    {
      nom: "Morgon",
      domaine: "Domaine de la Côte",
      lieu: "Beaujolais",
      millesime: "2022",
      prix: "8",
    },
  ],
} as const satisfies {
  titre: string;
  contenance: string;
  vins: readonly Vin[];
};

/** L'organisation « recommandée » : les familles, dans l'ordre du produit. */
export const PAR_FAMILLE = [
  {
    titre: "Champagnes",
    contenance: "75 cl",
    vins: [
      {
        nom: "Champagne Brut Réserve",
        domaine: "Maison Lambert",
        lieu: "Champagne",
        millesime: null,
        prix: "85",
      },
      {
        nom: "Crémant de Loire",
        domaine: "Caves du Coteau",
        lieu: "Loire",
        millesime: null,
        prix: "42",
      },
    ],
  },
  {
    titre: "Blancs",
    contenance: "75 cl",
    vins: [
      {
        nom: "Petit Chablis",
        domaine: "Domaine des Falaises",
        lieu: "Bourgogne",
        millesime: "2022",
        prix: "38",
      },
      {
        nom: "Sancerre",
        domaine: "Domaine du Silex",
        lieu: "Loire",
        millesime: "2023",
        prix: "45",
      },
      {
        nom: "Riesling Grand Cru",
        domaine: "Domaine du Rangen",
        lieu: "Alsace",
        millesime: "2021",
        prix: "40",
      },
      {
        nom: "Condrieu",
        domaine: "Domaine des Terrasses",
        lieu: "Rhône",
        millesime: "2021",
        prix: "78",
      },
      {
        nom: "Meursault",
        domaine: "Domaine du Clos",
        lieu: "Bourgogne",
        millesime: "2020",
        prix: "110",
      },
    ],
  },
  {
    titre: "Rosés",
    contenance: "75 cl",
    vins: [
      {
        nom: "Côtes de Provence",
        domaine: "Château des Pins",
        lieu: "Provence",
        millesime: "2023",
        prix: "32",
      },
    ],
  },
  {
    titre: "Rouges",
    contenance: "75 cl",
    vins: [
      {
        nom: "Morgon",
        domaine: "Domaine de la Côte",
        lieu: "Beaujolais",
        millesime: "2022",
        prix: "36",
      },
      {
        nom: "Bourgogne Pinot Noir",
        domaine: "Domaine des Falaises",
        lieu: "Bourgogne",
        millesime: "2021",
        prix: "48",
      },
      {
        nom: "Crozes-Hermitage",
        domaine: "Domaine des Terrasses",
        lieu: "Rhône",
        millesime: "2021",
        prix: "44",
      },
      {
        nom: "Saint-Émilion Grand Cru",
        domaine: "Château Bellerive",
        lieu: "Bordeaux",
        millesime: "2018",
        prix: "95",
      },
      {
        nom: "Châteauneuf-du-Pape",
        domaine: "Domaine du Mistral",
        lieu: "Rhône",
        millesime: "2019",
        prix: "120",
      },
    ],
  },
  {
    titre: "Doux",
    contenance: "75 cl",
    vins: [
      {
        nom: "Sauternes",
        domaine: "Château du Ciron",
        lieu: "Bordeaux",
        millesime: "2016",
        prix: "68",
      },
    ],
  },
] as const satisfies readonly {
  titre: string;
  contenance: string;
  vins: readonly Vin[];
}[];

/**
 * La même cave, organisée PAR RÉGION — l'un des cinq modes.
 *
 * L'ORDRE DES RÉGIONS N'EST PAS INDIFFÉRENT. La feuille ne montre que sa
 * première page, donc les trois premières rubriques. En plaçant la Loire en
 * deuxième, CINQ vins se retrouvent sur la première page des DEUX
 * classements — par famille et par région : ce sont eux qui glissent d'un
 * classement à l'autre pendant l'animation, au lieu de disparaître puis de
 * réapparaître. Aucune donnée n'est modifiée ; seul l'ordre l'est.
 * C'est ce que le deuxième temps de l'animation montre : les mêmes vins,
 * d'autres rubriques. Rien n'est ajouté ni retiré.
 */
export const PAR_REGION = [
  {
    titre: "Bourgogne",
    contenance: "75 cl",
    vins: [
      {
        nom: "Petit Chablis",
        domaine: "Domaine des Falaises",
        lieu: "Chablis",
        millesime: "2022",
        prix: "38",
      },
      {
        nom: "Meursault",
        domaine: "Domaine du Clos",
        lieu: "Côte de Beaune",
        millesime: "2020",
        prix: "110",
      },
      {
        nom: "Bourgogne Pinot Noir",
        domaine: "Domaine des Falaises",
        lieu: "Bourgogne",
        millesime: "2021",
        prix: "48",
      },
    ],
  },
  {
    titre: "Loire",
    contenance: "75 cl",
    vins: [
      {
        nom: "Sancerre",
        domaine: "Domaine du Silex",
        lieu: "Sancerre",
        millesime: "2023",
        prix: "45",
      },
      {
        nom: "Crémant de Loire",
        domaine: "Caves du Coteau",
        lieu: "Loire",
        millesime: null,
        prix: "42",
      },
    ],
  },
  {
    titre: "Rhône",
    contenance: "75 cl",
    vins: [
      {
        nom: "Crozes-Hermitage",
        domaine: "Domaine des Terrasses",
        lieu: "Rhône nord",
        millesime: "2021",
        prix: "44",
      },
      {
        nom: "Condrieu",
        domaine: "Domaine des Terrasses",
        lieu: "Rhône nord",
        millesime: "2021",
        prix: "78",
      },
      {
        nom: "Châteauneuf-du-Pape",
        domaine: "Domaine du Mistral",
        lieu: "Rhône sud",
        millesime: "2019",
        prix: "120",
      },
    ],
  },
  {
    titre: "Bordeaux",
    contenance: "75 cl",
    vins: [
      {
        nom: "Saint-Émilion Grand Cru",
        domaine: "Château Bellerive",
        lieu: "Saint-Émilion",
        millesime: "2018",
        prix: "95",
      },
      {
        nom: "Sauternes",
        domaine: "Château du Ciron",
        lieu: "Sauternes",
        millesime: "2016",
        prix: "68",
      },
    ],
  },
] as const satisfies readonly {
  titre: string;
  contenance: string;
  vins: readonly Vin[];
}[];

/** L'établissement de la démonstration du produit. */
export const MAISON = "Maison de Référence";

/** Les réglages réels, et rien de plus. */
export const REGLAGES = {
  organisations: ["recommandée", "couleur", "région", "pays", "appellation"],
  formats: ["A4", "A5"],
  styles: ["classique", "contemporain", "premium"],
  langues: ["fr", "en", "de", "it", "es"],
} as const;
