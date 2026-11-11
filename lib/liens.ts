/**
 * lib/liens.ts : les portes de sortie du site vers l'application.
 *
 * Le site vitrine n'a qu'un but : amener le restaurateur dans Vintoria Pro.
 * Ces adresses sont donc écrites UNE fois, ici, et tous les boutons les
 * importent. Vérifiées le 10 novembre 2026 :
 *   /register  « Créer votre espace », essai gratuit, aucune carte bancaire
 *   /login     connexion des comptes existants
 * L'application répond sur www.vintoria.app ; viser directement ce domaine
 * évite une redirection au clic.
 */

export const APP = "https://www.vintoria.app";

/** L'essai gratuit : le bouton principal de tout le site. */
export const INSCRIPTION = `${APP}/register`;

/** Pour les restaurateurs déjà inscrits. */
export const CONNEXION = `${APP}/login`;

export const COURRIEL_CONTACT = "contact@vintoria.com";
