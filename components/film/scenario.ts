/**
 * LE SCÉNARIO — une démonstration produit.
 *
 * UNE SEULE SOURCE DE VÉRITÉ VISUELLE : Vintoria Pro v2.0.2, l'ATELIER
 * (branche feat/accueil-feuillet, worktree vintoria-pro-atelier).
 *
 * Toutes les captures viennent des trois écrans de l'Atelier — Aujourd'hui,
 * Cave, Carte — et du parcours convive. Le PDF est généré par cette même
 * version : il porte son numéro, 2.0.2, dans son propre bloc de métadonnées.
 *
 * AUCUN ÉLÉMENT D'INTERFACE N'EST RECONSTRUIT. La version précédente du film
 * redessinait des cartes de valeur et une ligne de mouvement de stock, parce
 * que l'ancien back-office était presque illisible. L'Atelier affiche tout
 * cela lui-même, et mieux : la caméra entre dans ses écrans, elle ne les
 * recouvre plus. Il ne reste en propre au film que SA voix — les phrases, la
 * boucle, la marque — et c'est à ce titre qu'elle emploie la typographie du
 * site et non celle du produit.
 *
 * Les montants sont ceux que le logiciel calcule sur la cave de démonstration
 * (15 références, 179 bouteilles). Données de démonstration, jamais une
 * moyenne ni une performance. Aucun pourcentage de chiffre d'affaires.
 */

/** Trente-deux secondes. 1 s = 3,125 % de la timeline CSS. */
export const DUREE_S = 32;

/** Les phrases portées à l'écran — une par séquence. */
export const PHRASES = [
  "Votre carte entre en quelques secondes.",
  "Votre cave, d’un seul coup d’œil.",
  "Un vin passe sous son seuil. Vous le savez.",
  "Votre inventaire, prêt à imprimer.",
  "Et à table, chacun est conseillé.",
] as const;

/** La boucle commerciale — quatre mots, dans l'ordre où ils s'enchaînent. */
export const BOUCLE = ["Carte", "Cave", "Conseil", "Vente"] as const;

/** Ce que lit une technologie d'assistance, à la place du film. */
export const RECIT = [
  "Démonstration de trente-deux secondes.",
  ...PHRASES,
  "Carte, cave, conseil, vente.",
  "Vintoria.",
].join(" ");
