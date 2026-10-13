import type { CleFormule } from "./formules";

/**
 * lib/tarifs.ts — LA CONFIGURATION COMMERCIALE, ET ELLE EST SEULE.
 *
 * ── POURQUOI CE FICHIER EXISTE ─────────────────────────────────────────
 *
 * Le prix était écrit À DEUX ENDROITS : une fonction `Prix` dans
 * `app/tarifs/page.tsx`, une autre, presque identique, dans les cartes de
 * l'accueil. Deux copies de la même règle, dont la périodicité « / mois »
 * — qui n'est aujourd'hui confirmée nulle part. Le jour où les tarifs
 * seront arrêtés, il aurait fallu penser aux deux ; le jour où l'une
 * aurait changé sans l'autre, le site aurait annoncé deux prix
 * différents pour la même offre, et rien ne l'aurait signalé.
 *
 * TOUT CE QUI CONCERNE L'ARGENT VIT DONC ICI. `lib/formules.ts` dit ce
 * que le produit FAIT ; ce fichier dit ce qu'il COÛTE. Les composants ne
 * décident plus rien : ils demandent, et ils rendent.
 *
 * ── CE QU'IL FAUDRA FAIRE LE JOUR DE STRIPE ────────────────────────────
 *
 * Quatre gestes, tous dans ce fichier, et aucun ailleurs :
 *
 *   1. renseigner `montant` et `periodicite` pour chaque formule — ou
 *      marquer `surDevis` celle qui ne se vend pas sur étagère ;
 *   2. coller l'identifiant de prix Stripe dans `stripePriceId` ;
 *   3. passer `PRIX_CONFIRMES` à `true` — c'est la signature commerciale,
 *      distincte de la complétude technique ;
 *   4. lancer la suite : un garde-fou refuse une configuration partielle,
 *      et un autre vérifie que les cartes de l'accueil et la page
 *      `/tarifs` annoncent exactement la même chose.
 *
 * L'AFFICHAGE DEMANDE LES DEUX CONDITIONS, et c'est délibéré.
 * `PRIX_CONFIRMES` seul laisserait publier une configuration incomplète ;
 * la complétude seule laisserait publier des montants que personne n'a
 * validés. Il faut la décision ET les données.
 *
 * ── CE QUI RESTE HORS DE CE DÉPÔT ──────────────────────────────────────
 *
 * Le parcours d'abonnement lui-même vit dans l'application
 * (`vintoria-pro`), pas dans la vitrine. Les garde-fous d'ici couvrent les
 * DEUX surfaces que ce dépôt possède — les cartes de l'accueil et
 * `/tarifs` ; la troisième se vérifiera contre ce même fichier le jour où
 * les deux projets partageront cette configuration.
 */

/** Les périodicités possibles. Aucune n'est retenue à ce jour. */
export type Periodicite = "mensuel" | "annuel";

export const LIBELLE_PERIODICITE: Record<Periodicite, string> = {
  mensuel: "/ mois",
  annuel: "/ an",
};

export interface Tarif {
  /** En euros, hors taxes ou toutes taxes — à trancher avec le prix. */
  readonly montant: number | null;
  readonly periodicite: Periodicite | null;
  /** L'identifiant `price_…` du catalogue Stripe. */
  readonly stripePriceId: string | null;
  /**
   * Une formule qui ne se vend pas sur étagère est COMPLÈTE sans montant.
   * Le drapeau est une possibilité d'architecture, pas une décision prise :
   * il vaut `false` partout tant que personne ne l'a arbitré.
   */
  readonly surDevis: boolean;
}

/**
 * LA SIGNATURE COMMERCIALE. Elle ne se déduit de rien : c'est une
 * décision humaine, et elle est volontairement séparée de la complétude
 * des données ci-dessous.
 */
export const PRIX_CONFIRMES = false;

/**
 * LA CONFIGURATION. Vide, et c'est l'état voulu aujourd'hui : la
 * facturation n'est pas branchée, donc aucun prix n'est publiable.
 */
export const TARIFS: Record<CleFormule, Tarif> = {
  essential: {
    montant: null,
    periodicite: null,
    stripePriceId: null,
    surDevis: false,
  },
  business: {
    montant: null,
    periodicite: null,
    stripePriceId: null,
    surDevis: false,
  },
  enterprise: {
    montant: null,
    periodicite: null,
    stripePriceId: null,
    surDevis: false,
  },
};

/**
 * CE QUE LE CATALOGUE DU PRODUIT PORTE AUJOURD'HUI — et rien d'autre n'en
 * fait usage que l'avis de développement de `/tarifs`. Ces montants
 * existent dans `vintoria-pro/lib/subscription/catalog.ts` (PLAN_PRICING)
 * mais `STRIPE_PRICES` y est entièrement `null` : la facturation n'est pas
 * branchée, donc ils ne valent pas engagement. Ils ne sont JAMAIS rendus
 * en production ; un garde-fou le vérifie.
 */
export const CATALOGUE_PRODUIT: Record<CleFormule, number | null> = {
  essential: 69,
  business: 99,
  enterprise: null,
};

/** Ce qu'il manque à une formule pour être publiable. */
function manquesDe(cle: CleFormule): string[] {
  const t = TARIFS[cle];
  if (t.surDevis) return [];
  const m: string[] = [];
  if (t.montant === null) m.push("montant");
  if (t.periodicite === null) m.push("périodicité");
  if (t.stripePriceId === null) m.push("identifiant Stripe");
  return m;
}

/**
 * La configuration est-elle complète ? Renvoie aussi CE QUI MANQUE, pour
 * que l'avis de développement puisse le dire au lieu d'afficher « non ».
 */
export function configurationComplete(): {
  valide: boolean;
  manques: Partial<Record<CleFormule, string[]>>;
} {
  const manques: Partial<Record<CleFormule, string[]>> = {};
  for (const cle of Object.keys(TARIFS) as CleFormule[]) {
    const m = manquesDe(cle);
    if (m.length) manques[cle] = m;
  }
  return { valide: Object.keys(manques).length === 0, manques };
}

/** La décision ET les données. Les deux, ou rien ne s'affiche. */
export function tarifsPublies(): boolean {
  return PRIX_CONFIRMES && configurationComplete().valide;
}

export type PrixAffichable =
  | { readonly publie: false }
  | { readonly publie: true; readonly surDevis: true }
  | {
      readonly publie: true;
      readonly surDevis: false;
      readonly montant: number;
      readonly periodicite: string;
    };

/**
 * CE QU'IL FAUT AFFICHER POUR UNE FORMULE — la seule fonction que les
 * composants appellent. Tant qu'elle renvoie `publie: false`, ils rendent
 * « Sur demande », et ni le montant ni la périodicité n'existent pour eux.
 */
export function prixDe(cle: CleFormule): PrixAffichable {
  if (!tarifsPublies()) return { publie: false };
  const t = TARIFS[cle];
  if (t.surDevis) return { publie: true, surDevis: true };
  return {
    publie: true,
    surDevis: false,
    montant: t.montant as number,
    periodicite: LIBELLE_PERIODICITE[t.periodicite as Periodicite],
  };
}
