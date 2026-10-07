/**
 * Les types et l'état initial du formulaire.
 *
 * Ils vivent HORS du fichier d'action : un module « use server » ne peut
 * exporter que des fonctions asynchrones. Exporter `ETAT_INITIAL` depuis
 * l'action compilait sans erreur et faisait tomber la page à l'exécution —
 * un défaut que seul un test de bout en bout révèle.
 */

export type Champ =
  | "etablissement"
  | "nom"
  | "courriel"
  | "telephone"
  | "ville"
  | "couverts"
  | "references"
  | "mot";

/** Trois états seulement, parce qu'un formulaire n'en demande pas plus.
 *  `valeurs` revient avec l'erreur : personne ne retape sa fiche. */
export type EtatDemande =
  | { phase: "attente" }
  | {
      phase: "erreur";
      message: string;
      champs: Partial<Record<Champ, string>>;
      valeurs: Partial<Record<Champ, string>>;
    }
  | { phase: "envoye"; etablissement: string };

export const ETAT_INITIAL: EtatDemande = { phase: "attente" };
