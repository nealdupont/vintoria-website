"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * LE VERRE À BOURGOGNE — la cause physique de toute la direction.
 *
 * Jusqu'ici la page montrait ce que la lumière FAIT (le jet, le virage au
 * bordeaux, la flaque) sans jamais montrer ce qu'elle TRAVERSE. L'œil
 * complétait. Maintenant que le verre est là, la chaîne est entière :
 * ivoire → lumière → verre → bordeaux → matière.
 *
 * DESSINÉ, PAS PHOTOGRAPHIÉ. Une photo de verre derrière un titre fait un
 * site de caviste ; et une image de stock aurait apporté sa propre lumière,
 * son propre fond, sa propre direction — en contradiction avec celle-ci.
 * Un tracé ne porte que ce qu'on lui demande.
 *
 * LES PROPORTIONS SONT CELLES D'UN VRAI VERRE À BOURGOGNE, et c'est ce qui
 * le rend crédible sans être illustratif : calice très large et bas, buvant
 * resserré, jambe courte, pied ample. Rapportées à une hauteur de 1000 :
 * calice 470, jambe 336, pied 52 ; diamètre maximal du calice 500 contre
 * 310 au buvant. Un verre à bordeaux, plus haut et plus droit, ne dirait
 * pas la même chose.
 *
 * TRÈS BAS CONTRASTE, TOUJOURS DERRIÈRE. Le verre n'est jamais le sujet :
 * il est la raison de la lumière. Son trait vit à 14 % d'opacité — on le
 * devine avant de le voir, ce qui est exactement le but.
 */

/** Le corps du verre, d'un seul tracé : buvant gauche, calice, jambe, pied,
 *  puis tout remonte en miroir. Un seul chemin pour un seul geste de tracé. */
const CORPS =
  "M125,10 C52,80 28,164 30,226 C33,346 154,442 268,486 " +
  "L268,804 C268,814 244,820 186,836 C142,848 92,856 86,864 " +
  "L474,864 C468,856 418,848 374,836 C316,820 292,814 292,804 " +
  "L292,486 C406,442 527,346 530,226 C532,164 508,80 435,10";

/**
 * L'INTÉRIEUR DU CALICE, fermé — il sert de découpe au vin.
 *
 * Première version : le vin était un tracé « à la main » censé épouser la
 * paroi. Vérification au calcul : à y = 444, le vin passait à x = 188 pour
 * une paroi à x = 183. Il DÉBORDAIT du verre, de cinq unités, sur toute la
 * partie basse du calice — visible à l'œil une fois rendu.
 *
 * Plutôt que d'ajuster des points de contrôle jusqu'à ce que ça tombe juste
 * — réglage qui redeviendrait faux au premier changement de courbe — le vin
 * est DÉCOUPÉ sur la paroi elle-même. Il ne peut plus en sortir, par
 * construction.
 */
const CALICE =
  "M125,10 C52,80 28,164 30,226 C33,346 154,442 268,486 " +
  "L292,486 C406,442 527,346 530,226 C532,164 508,80 435,10 Z";

/** La masse de vin : elle épouse l'intérieur du calice. */
const VIN =
  "M40,237 C46,354 160,446 270,484 L290,484 C400,446 514,354 520,237 " +
  "A240,30 0 0,1 40,237 Z";

type Props = { className?: string; retard?: number };

export function VerreBourgogne({ className = "", retard = 0 }: Props) {
  const reduit = useReducedMotion();

  /* Le tracé se dessine : `pathLength={1}` normalise la longueur, donc le
     tiret et son décalage valent 1 quelle que soit la taille rendue —
     aucune mesure JavaScript, aucun recalcul au redimensionnement. */
  const trace = (delai: number, duree: number) => ({
    initial: { strokeDashoffset: reduit ? 0 : 1 },
    animate: { strokeDashoffset: 0 },
    transition: {
      duration: reduit ? 0 : duree,
      delay: reduit ? 0 : retard + delai,
      ease: [0.33, 0, 0.1, 1] as const,
    },
  });

  return (
    <svg
      viewBox="0 0 560 920"
      fill="none"
      aria-hidden
      className={className}
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        {/* Le vin se remplit par le BAS : une fenêtre de découpe qui remonte.
            On translate un rectangle plutôt que d'étirer la masse — sinon la
            surface du vin s'écraserait en montant, ce qu'un liquide ne fait
            pas. */}
        {/* La paroi : le vin ne peut pas en sortir. */}
        <clipPath id="vb-calice">
          <path d={CALICE} />
        </clipPath>

        <clipPath id="vb-remplissage">
          <motion.rect
            x="0"
            y="0"
            width="560"
            height="920"
            initial={{ y: reduit ? 0 : 640 }}
            animate={{ y: 0 }}
            transition={{
              duration: reduit ? 0 : 1.5,
              delay: reduit ? 0 : retard + 1.05,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        </clipPath>

        {/* Le vin n'est pas un aplat : il est profond au fond, et traversé
            au-dessus. C'est là que la lumière devient couleur. */}
        <linearGradient id="vb-vin" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="var(--color-accent)"
            stopOpacity="0.17"
          />
          <stop
            offset="46%"
            stopColor="var(--color-accent)"
            stopOpacity="0.3"
          />
          <stop
            offset="100%"
            stopColor="var(--color-accent)"
            stopOpacity="0.46"
          />
        </linearGradient>

        {/* Le trait du verre s'allège vers le bas : le pied est dans l'ombre
            portée, le buvant capte la lumière. */}
        <linearGradient id="vb-trait" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-fort)" stopOpacity="0.2" />
          <stop offset="55%" stopColor="var(--color-fort)" stopOpacity="0.13" />
          <stop
            offset="100%"
            stopColor="var(--color-fort)"
            stopOpacity="0.09"
          />
        </linearGradient>
      </defs>

      {/* ── LE VIN, sous le verre : le liquide est DANS le calice ───── */}
      {/* La densité du vin est pilotable : sur petit écran, le bloc de texte
          occupe presque toute la hauteur et la masse tombe derrière du texte
          COURANT au lieu du titre. Mesuré : 3,64:1 à 390 px. On la dilue
          là-bas, et seulement là-bas. */}
      <g clipPath="url(#vb-calice)" style={{ opacity: "var(--vb-densite, 1)" }}>
        <g clipPath="url(#vb-remplissage)">
          <path d={VIN} fill="url(#vb-vin)" />
          {/* La surface — le seul endroit où le vin a une arête nette. */}
          <ellipse
            cx="280"
            cy="237"
            rx="240"
            ry="30"
            fill="none"
            stroke="var(--color-accent)"
            strokeOpacity="0.22"
            strokeWidth="1.4"
          />
        </g>
      </g>

      {/* ── LE VERRE ────────────────────────────────────────────────── */}
      <motion.path
        d={CORPS}
        pathLength={1}
        stroke="url(#vb-trait)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1"
        {...trace(0.15, 1.7)}
      />
      {/* Le buvant, vu de très légèrement au-dessus. */}
      <motion.ellipse
        cx="280"
        cy="10"
        rx="155"
        ry="26"
        pathLength={1}
        stroke="var(--color-fort)"
        strokeOpacity="0.18"
        strokeWidth="1.7"
        strokeDasharray="1"
        {...trace(0.95, 1.1)}
      />

      {/* ── LE REFLET ───────────────────────────────────────────────
          Une seule arête de lumière, à gauche, là d'où vient le jet. Deux
          reflets feraient deux sources : il n'y en a qu'une. */}
      <motion.path
        d="M74,150 C62,206 70,284 108,342"
        pathLength={1}
        stroke="#ffffff"
        strokeOpacity="0.72"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="1"
        {...trace(1.5, 1.2)}
      />
    </svg>
  );
}
