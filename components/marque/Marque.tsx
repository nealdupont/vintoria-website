import Image from "next/image";

/**
 * LA MARQUE — composée d'après la géométrie OFFICIELLE.
 *
 * Source de vérité : le dépôt `vintoria-brand`. Ses règles, que ce fichier
 * respecte à la lettre :
 *   · le symbole ne se redessine jamais — on n'emploie que les dérivés de
 *     `dist/logo/symbole/` ;
 *   · le wordmark ne se compose jamais en texte — on emploie le tracé
 *     `dist/logo/wordmark/wordmark-bordeaux.svg`. L'en-tête affichait
 *     jusqu'ici « VINTORIA » en Spectral interlettré : c'était précisément
 *     ce que la marque interdit.
 *
 * LES PROPORTIONS NE SONT PAS INVENTÉES. Elles sont mesurées dans
 * `dist/logo/lockup/horizontal-clair.svg` (viewBox 1606,04 × 400) :
 *   symbole  x=0, largeur 487,18, hauteur 400
 *   wordmark translate(547,32 · 250), hauteur 102,29
 * d'où, rapportées à la hauteur du symbole :
 *   écart = (547,32 − 487,18) / 400 = 0,1504
 *   hauteur du wordmark = 102,29 / 400 = 0,2557
 * Les deux blocs sont centrés optiquement l'un sur l'autre (écart de 1,14
 * unité sur 400 dans le fichier officiel — négligeable).
 *
 * TAILLE MINIMALE. La charte interdit au wordmark de descendre sous 80 px
 * de large. Son rapport largeur/hauteur est de 10,35 ; il lui faut donc
 * 7,73 px de haut, soit un symbole d'au moins 30,2 px. D'où `hauteur = 32`
 * par défaut, et le symbole SEUL en dessous.
 */

/** Rapports relevés dans le lockup horizontal officiel. */
const ECART = 0.1504;
const WORDMARK = 0.2557;
/** Rapports propres aux fichiers sources. */
const SYMBOLE_RATIO = 950 / 780; // 1,218
const WORDMARK_RATIO = 1058.86 / 102.29; // 10,35

export function Symbole({
  hauteur,
  className = "",
  priority = false,
}: {
  hauteur: number;
  className?: string;
  priority?: boolean;
}) {
  const largeur = Math.round(hauteur * SYMBOLE_RATIO);
  return (
    <Image
      src="/marque/symbole-256.png"
      alt=""
      width={largeur}
      height={hauteur}
      sizes={`${largeur}px`}
      priority={priority}
      className={className}
      style={{ height: hauteur, width: largeur }}
    />
  );
}

/**
 * Le lockup horizontal : symbole + wordmark, à l'écart officiel.
 * `role="img"` et le nom accessible portent sur l'ENSEMBLE — le symbole est
 * décoratif, le wordmark est un tracé : ni l'un ni l'autre ne se lit seul.
 */
export function LockupHorizontal({
  hauteur = 32,
  className = "",
  priority = false,
}: {
  hauteur?: number;
  className?: string;
  priority?: boolean;
}) {
  const hWordmark = hauteur * WORDMARK;
  const lWordmark = hWordmark * WORDMARK_RATIO;
  return (
    <span
      role="img"
      aria-label="Vintoria"
      className={`inline-flex items-center ${className}`}
      style={{ gap: hauteur * ECART }}
    >
      <Symbole hauteur={hauteur} priority={priority} />
      <Image
        src="/marque/wordmark-bordeaux.svg"
        alt=""
        width={Math.round(lWordmark)}
        height={Math.round(hWordmark)}
        priority={priority}
        style={{ height: hWordmark, width: lWordmark }}
      />
    </span>
  );
}
