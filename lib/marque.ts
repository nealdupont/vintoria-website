/**
 * LE SEUIL DU LOCKUP HORIZONTAL — la seule arithmétique de la marque ici.
 *
 * `--vintoria-lockup-horizontal-ratio` (1606,04 / 400) et
 * `--vintoria-lockup-horizontal-wordmark-l` (65,93 %), repris de
 * app/marque/vintoria.css pour un seul usage : savoir sous quelle hauteur de
 * cadre le wordmark passerait sous ses 80 px minimum (docs/01-logo.md), et
 * rendre alors le symbole seul. La mise en page du lockup, elle, lit les
 * jetons CSS directement. tests/marque.spec.ts confronte ces deux nombres au
 * fichier synchronisé : une évolution de la marque fait échouer le test.
 */
export const LOCKUP_HORIZONTAL = { ratio: 1606.04 / 400, wordmarkL: 0.6593 };

/** Le wordmark seul ne descend pas sous 80 px de large. */
export const WORDMARK_MIN = 80;

/** La hauteur de cadre sous laquelle le wordmark passerait sous 80 px. */
export const HAUTEUR_MIN_HORIZONTAL = Math.ceil(
  WORDMARK_MIN / (LOCKUP_HORIZONTAL.ratio * LOCKUP_HORIZONTAL.wordmarkL),
);
