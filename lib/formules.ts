/**
 * lib/formules.ts — les formules, reprises du produit.
 *
 * SOURCE DE VÉRITÉ : vintoria-pro/lib/subscription/catalog.ts
 * (constantes PLANS, FEATURES, LIMITS). Les droits et les quotas ci-dessous
 * sont ceux que l'application applique réellement — rien n'est inventé pour
 * les besoins de la page.
 *
 * LE PRIX N'EST PAS ICI. Ce fichier dit ce que le produit FAIT ; ce qu'il
 * COÛTE vit dans `lib/tarifs.ts`, seul, avec la configuration Stripe et la
 * règle qui autorise ou non l'affichage. La séparation n'est pas
 * cosmétique : elle fait qu'on ne peut pas publier un montant en touchant
 * à un fichier de fonctionnalités.
 */

export type CleFormule = "essential" | "business" | "enterprise";

export interface Formule {
  cle: CleFormule;
  nom: string;
  pourQui: string;
  promesse: string;
  recommandee?: boolean;
}

export const FORMULES: Formule[] = [
  {
    cle: "essential",
    nom: "Essentiel",
    pourQui: "Un établissement, une carte, un service.",
    promesse: "Le conseil à chaque table, dès le premier soir.",
  },
  {
    cle: "business",
    nom: "Business",
    pourQui: "Une maison qui tient sa cave et suit ses chiffres.",
    promesse: "Le conseil, plus la gestion complète de la cave.",
    recommandee: true,
  },
  {
    cle: "enterprise",
    nom: "Enterprise",
    pourQui: "Un groupe, plusieurs adresses, une équipe élargie.",
    promesse: "Plusieurs établissements, les rôles, les intégrations.",
  },
];

/**
 * La lecture se fait par GROUPE, comme une carte des vins : on ne compare
 * pas ligne à ligne, on regarde ce qu'un chapitre contient.
 */
export interface Chapitre {
  titre: string;
  intro: string;
  lignes: Ligne[];
}

export interface Ligne {
  intitule: string;
  /** Texte court par formule. `null` = non compris dans cette formule. */
  valeurs: Record<CleFormule, string | null>;
}

export const CHAPITRES: Chapitre[] = [
  {
    titre: "L’expérience client",
    intro:
      "Ce que vos clients voient à table. Compris dans toutes les formules.",
    lignes: [
      {
        intitule: "Conseil et accords mets-vins",
        valeurs: {
          essential: "Compris",
          business: "Compris",
          enterprise: "Compris",
        },
      },
      {
        intitule: "QR code et support imprimable",
        valeurs: {
          essential: "Compris",
          business: "Compris",
          enterprise: "Compris",
        },
      },
      {
        intitule: "Carte des vins en ligne",
        valeurs: {
          essential: "Compris",
          business: "Compris",
          enterprise: "Compris",
        },
      },
      {
        intitule: "Langues du parcours client",
        valeurs: {
          essential: "Compris",
          business: "Compris",
          enterprise: "Compris",
        },
      },
      {
        intitule: "Références à la carte",
        valeurs: {
          essential: "100",
          business: "Illimité",
          enterprise: "Illimité",
        },
      },
      {
        intitule: "Scans du QR code",
        valeurs: {
          essential: "Illimité",
          business: "Illimité",
          enterprise: "Illimité",
        },
      },
    ],
  },
  {
    titre: "La cave",
    intro: "Le travail quotidien : importer, ranger, suivre, exporter.",
    lignes: [
      {
        intitule: "Import d’une carte (PDF, image, texte)",
        valeurs: {
          essential: "10 par mois",
          business: "Illimité",
          enterprise: "Illimité",
        },
      },
      {
        intitule: "Import assisté",
        valeurs: {
          essential: null,
          business: "Compris",
          enterprise: "Compris",
        },
      },
      {
        intitule: "Stocks et mouvements",
        valeurs: {
          essential: null,
          business: "Compris",
          enterprise: "Compris",
        },
      },
      {
        intitule: "Inventaires",
        valeurs: {
          essential: null,
          business: "Compris",
          enterprise: "Compris",
        },
      },
      {
        intitule: "Valeur de cave et marge",
        valeurs: {
          essential: null,
          business: "Compris",
          enterprise: "Compris",
        },
      },
      {
        intitule: "Alertes de stock",
        valeurs: {
          essential: null,
          business: "Compris",
          enterprise: "Compris",
        },
      },
      {
        intitule: "Statistiques",
        valeurs: {
          essential: null,
          business: "Compris",
          enterprise: "Compris",
        },
      },
      {
        intitule: "Export PDF",
        valeurs: {
          essential: null,
          business: "Compris",
          enterprise: "Compris",
        },
      },
      {
        intitule: "Optimisation commerciale",
        valeurs: {
          essential: null,
          business: "Compris",
          enterprise: "Compris",
        },
      },
    ],
  },
  {
    titre: "L’organisation",
    intro:
      "Quand il y a plusieurs mains, plusieurs salles, plusieurs adresses.",
    lignes: [
      {
        intitule: "Membres d’équipe",
        valeurs: { essential: "1", business: "3", enterprise: "Illimité" },
      },
      {
        intitule: "Établissements",
        valeurs: { essential: "1", business: "1", enterprise: "5" },
      },
      {
        intitule: "Rôles et permissions",
        valeurs: { essential: null, business: null, enterprise: "Compris" },
      },
      {
        intitule: "Accès API",
        valeurs: { essential: null, business: null, enterprise: "Compris" },
      },
      {
        intitule: "Intégrations",
        valeurs: { essential: null, business: null, enterprise: "Compris" },
      },
      {
        intitule: "Support prioritaire",
        valeurs: { essential: null, business: null, enterprise: "Compris" },
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════
   CE QUE CHAQUE FORMULE COMPREND — LU, JAMAIS ÉCRIT.

   La page d'accueil montre les trois offres en cartes, et chaque carte
   ouverte doit dire ce qu'elle comprend, ce qu'elle ne comprend pas, et
   ce qu'elle apporte de plus que la précédente.

   AUCUNE DE CES TROIS LISTES N'EST SAISIE À LA MAIN. Les trois se
   déduisent de `CHAPITRES`, qui vient lui-même du catalogue du produit.
   Une ligne ajoutée au catalogue apparaît donc dans les cartes sans que
   personne y pense ; une ligne retirée en disparaît. C'est la seule
   manière de garantir que la vitrine ne promette pas ce que
   l'application ne fait pas.
   ══════════════════════════════════════════════════════════════════ */

/** L'ordre commercial des formules, du plus simple au plus large. */
export const ORDRE: readonly CleFormule[] = [
  "essential",
  "business",
  "enterprise",
];

export type Trait = {
  readonly chapitre: string;
  readonly intitule: string;
  /** La valeur pour cette formule : « Compris », « 3 », « 10 par mois »… */
  readonly valeur: string;
};

/** Tout ce que la formule comprend, dans l'ordre des chapitres. */
export function comprisDans(cle: CleFormule): Trait[] {
  return CHAPITRES.flatMap((ch) =>
    ch.lignes
      .filter((l) => l.valeurs[cle] !== null)
      .map((l) => ({
        chapitre: ch.titre,
        intitule: l.intitule,
        valeur: l.valeurs[cle] as string,
      })),
  );
}

/**
 * CE QUE LA FORMULE NE COMPREND PAS — et c'est une information
 * commerciale, pas un aveu. Un restaurateur qui lit « pas de stocks »
 * sur l'Essentiel comprend immédiatement à quoi sert la Business ; la
 * même page qui tairait la limite le ferait découvrir après la vente.
 */
export function absentDe(cle: CleFormule): Trait[] {
  return CHAPITRES.flatMap((ch) =>
    ch.lignes
      .filter((l) => l.valeurs[cle] === null)
      .map((l) => ({ chapitre: ch.titre, intitule: l.intitule, valeur: "—" })),
  );
}

/**
 * CE QUE CELLE-CI AJOUTE À LA PRÉCÉDENTE. Deux cas comptent comme un
 * ajout : une ligne absente qui devient comprise, et une ligne dont la
 * valeur change — passer de « 100 références » à « Illimité » est un
 * ajout, même si la ligne existait déjà.
 *
 * La première formule n'ajoute rien à personne : elle renvoie une liste
 * vide, et la carte n'affiche alors pas la rubrique.
 */
export function ajoutsSur(cle: CleFormule): Trait[] {
  const rang = ORDRE.indexOf(cle);
  if (rang <= 0) return [];
  const avant = ORDRE[rang - 1];
  return CHAPITRES.flatMap((ch) =>
    ch.lignes
      .filter(
        (l) => l.valeurs[cle] !== null && l.valeurs[cle] !== l.valeurs[avant],
      )
      .map((l) => ({
        chapitre: ch.titre,
        intitule: l.intitule,
        valeur: l.valeurs[cle] as string,
      })),
  );
}
