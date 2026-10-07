import Image from "next/image";
import type { CSSProperties } from "react";
import {
  HAUTEUR_MIN_HORIZONTAL,
  LOCKUP_HORIZONTAL,
} from "@/lib/marque";

/**
 * LA MARQUE — la composition HTML OFFICIELLE du lockup.
 *
 * Source de vérité : `vintoria-brand` (docs/01-logo.md). Un lockup s'affiche
 * de deux façons, et de deux seulement : le fichier de `dist/logo/lockup/`,
 * ou la composition du symbole et du wordmark officiels avec la géométrie
 * PUBLIÉE dans les jetons. C'est la seconde, ici : l'en-tête et le pied n'ont
 * pas à charger un SVG qui embarque le symbole en PNG (≈ 140 à 290 Ko).
 *
 * AUCUNE PROPORTION N'EST MESURÉE DANS CE FICHIER. Le cadre prend le ratio
 * `--vintoria-lockup-<forme>-ratio`, et chaque élément la boîte
 * `--vintoria-lockup-<forme>-<élément>-{x,y,l,h}` (en % du cadre), toutes
 * synchronisées dans app/marque/vintoria.css. Ce sont exactement les valeurs
 * qui produisent les fichiers lockup (même calcul, testé dans vintoria-brand) ;
 * tests/marque.spec.ts vérifie que le rendu les respecte au pixel près.
 *
 *   · le symbole ne se redessine jamais : `symbole.png` (couleur, fonds
 *     clairs) ou `symbole-tonal-creme.png` (fonds sombres) ;
 *   · le wordmark ne se compose jamais en texte : `wordmark-bordeaux.svg`
 *     (clair) ou `wordmark-creme.svg` (foncé). Nom accessible : « Vintoria ».
 *
 * TAILLE MINIMALE. Le wordmark ne descend pas sous 80 px de large. Il occupe
 * `--vintoria-lockup-horizontal-wordmark-l` (65,93 %) d'un cadre de ratio
 * 1606,04 / 400, soit 2,647 × la hauteur du cadre : il faut au moins 31 px
 * de haut. En dessous, `LockupHorizontal` rend le symbole seul, comme le veut
 * la charte (seuil et constantes : lib/marque.ts).
 */

export type Variante = "clair" | "fonce";

/** Rapports des fichiers SOURCES — ils ne servent qu'aux dimensions
 *  intrinsèques des images, jamais à la mise en page du lockup. */
const SYMBOLE_RATIO = 950 / 780;
const WORDMARK_RATIO = 1058.86 / 102.29;

const FICHIERS = {
  clair: {
    symbole: "/marque/symbole.png",
    wordmark: "/marque/wordmark-bordeaux.svg",
  },
  fonce: {
    symbole: "/marque/symbole-tonal-creme.png",
    wordmark: "/marque/wordmark-creme.svg",
  },
} as const;

type Forme =
  | "horizontal"
  | "horizontal-signature"
  | "vertical"
  | "vertical-signature";

/** La boîte officielle d'un élément du lockup, lue dans les jetons. */
function boite(forme: Forme, element: "symbole" | "wordmark"): CSSProperties {
  const v = (axe: string) =>
    `var(--vintoria-lockup-${forme}-${element}-${axe})`;
  return {
    position: "absolute",
    left: v("x"),
    top: v("y"),
    width: v("l"),
    height: v("h"),
    maxWidth: "none",
  };
}

export function Symbole({
  hauteur,
  variante = "clair",
  className = "",
  priority = false,
}: {
  hauteur: number;
  variante?: Variante;
  className?: string;
  priority?: boolean;
}) {
  const largeur = Math.round(hauteur * SYMBOLE_RATIO);
  return (
    <Image
      src={FICHIERS[variante].symbole}
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
 * Le lockup horizontal : symbole + wordmark, aux boîtes officielles.
 * `role="img"` et le nom accessible portent sur l'ENSEMBLE — le symbole est
 * décoratif, le wordmark est un tracé : ni l'un ni l'autre ne se lit seul.
 */
export function LockupHorizontal({
  hauteur = 32,
  variante = "clair",
  className = "",
  priority = false,
}: {
  hauteur?: number;
  variante?: Variante;
  className?: string;
  priority?: boolean;
}) {
  if (hauteur < HAUTEUR_MIN_HORIZONTAL) {
    // La charte : sous 80 px de wordmark, le symbole seul.
    return (
      <Symbole
        hauteur={hauteur}
        variante={variante}
        className={className}
        priority={priority}
      />
    );
  }
  const forme: Forme = "horizontal";
  const lSymbole = Math.round(hauteur * SYMBOLE_RATIO);
  const lWordmark = Math.round(
    hauteur * LOCKUP_HORIZONTAL.ratio * LOCKUP_HORIZONTAL.wordmarkL,
  );
  return (
    <span
      role="img"
      aria-label="Vintoria"
      data-lockup={forme}
      className={`relative inline-block shrink-0 align-middle ${className}`}
      style={{
        height: hauteur,
        aspectRatio: `var(--vintoria-lockup-${forme}-ratio)`,
      }}
    >
      <Image
        src={FICHIERS[variante].symbole}
        alt=""
        width={lSymbole}
        height={hauteur}
        sizes={`${lSymbole}px`}
        priority={priority}
        data-element="symbole"
        style={boite(forme, "symbole")}
      />
      <Image
        src={FICHIERS[variante].wordmark}
        alt=""
        width={lWordmark}
        height={Math.round(lWordmark / WORDMARK_RATIO)}
        priority={priority}
        data-element="wordmark"
        style={boite(forme, "wordmark")}
      />
    </span>
  );
}
