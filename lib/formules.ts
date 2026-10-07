/**
 * lib/formules.ts — les formules, reprises du produit.
 *
 * SOURCE DE VÉRITÉ : vintoria-pro/lib/subscription/catalog.ts
 * (constantes PLANS, FEATURES, LIMITS). Les droits et les quotas ci-dessous
 * sont ceux que l'application applique réellement — rien n'est inventé pour
 * les besoins de la page.
 *
 * LE PRIX, LUI, N'EST PAS PUBLIÉ. Le catalogue porte bien des montants
 * (PLAN_PRICING), mais STRIPE_PRICES y est entièrement `null` : la
 * facturation n'est pas branchée, donc ces montants ne sont pas confirmés
 * comme commerciaux. Tant que `PRIX_CONFIRMES` vaut false, la page affiche
 * « Sur demande » en production et signale franchement l'attente en
 * développement. Aucun prix fictif ne sera jamais rendu.
 */

export const PRIX_CONFIRMES = false;

/** Ce que le catalogue du produit porte aujourd'hui, à confirmer. */
export const PRIX_TROUVES = {
  essential: 69,
  business: 99,
  enterprise: null,
} as const;

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
    intro: "Ce que vos clients voient à table. Compris dans toutes les formules.",
    lignes: [
      {
        intitule: "Conseil et accords mets-vins",
        valeurs: { essential: "Compris", business: "Compris", enterprise: "Compris" },
      },
      {
        intitule: "QR code et support imprimable",
        valeurs: { essential: "Compris", business: "Compris", enterprise: "Compris" },
      },
      {
        intitule: "Carte des vins en ligne",
        valeurs: { essential: "Compris", business: "Compris", enterprise: "Compris" },
      },
      {
        intitule: "Langues du parcours client",
        valeurs: { essential: "Compris", business: "Compris", enterprise: "Compris" },
      },
      {
        intitule: "Références à la carte",
        valeurs: { essential: "100", business: "Illimité", enterprise: "Illimité" },
      },
      {
        intitule: "Scans du QR code",
        valeurs: { essential: "Illimité", business: "Illimité", enterprise: "Illimité" },
      },
    ],
  },
  {
    titre: "La cave",
    intro: "Le travail quotidien : importer, ranger, suivre, exporter.",
    lignes: [
      {
        intitule: "Import d’une carte (PDF, image, texte)",
        valeurs: { essential: "10 par mois", business: "Illimité", enterprise: "Illimité" },
      },
      {
        intitule: "Import assisté",
        valeurs: { essential: null, business: "Compris", enterprise: "Compris" },
      },
      {
        intitule: "Stocks et mouvements",
        valeurs: { essential: null, business: "Compris", enterprise: "Compris" },
      },
      {
        intitule: "Inventaires",
        valeurs: { essential: null, business: "Compris", enterprise: "Compris" },
      },
      {
        intitule: "Valeur de cave et marge",
        valeurs: { essential: null, business: "Compris", enterprise: "Compris" },
      },
      {
        intitule: "Alertes de stock",
        valeurs: { essential: null, business: "Compris", enterprise: "Compris" },
      },
      {
        intitule: "Statistiques",
        valeurs: { essential: null, business: "Compris", enterprise: "Compris" },
      },
      {
        intitule: "Export PDF",
        valeurs: { essential: null, business: "Compris", enterprise: "Compris" },
      },
      {
        intitule: "Optimisation commerciale",
        valeurs: { essential: null, business: "Compris", enterprise: "Compris" },
      },
    ],
  },
  {
    titre: "L’organisation",
    intro: "Quand il y a plusieurs mains, plusieurs salles, plusieurs adresses.",
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
