/**
 * QUELLES ROUTES SONT ÉCLAIRÉES.
 *
 * L'accueil passe en lumière traversée — le thème `creme` de la marque. Les autres
 * routes (tarifs, démonstration, film) restent au jeu du soir : elles n'ont
 * pas été redessinées, et les y faire basculer serait les casser.
 *
 * Deux endroits lisent ce prédicat, et c'est voulu : l'accueil pose la classe
 * sur son propre enveloppe, l'en-tête — qui vit dans la mise en page racine,
 * hors de cette enveloppe — doit la déduire du chemin. Un seul fichier
 * détient donc la connaissance, et le rendu serveur reste exact : aucune
 * bascule de classe après coup, aucun clignotement au premier affichage.
 */
export function estEclairee(chemin: string | null): boolean {
  return chemin === "/";
}
