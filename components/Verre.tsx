"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * LE VERRE — l'objet emblématique de Vintoria.
 *
 * Un grand calice de dégustation de Bourgogne, dans l'esprit Zalto /
 * Josephinenhütte : panse généreuse presque aussi haute que large,
 * cheminée resserrée sans être étranglée, buvant d'une finesse extrême,
 * jambe élancée, pied fin et équilibré.
 *
 * PRINCIPE : l'objet est bâti par la LUMIÈRE, pas par le contour.
 *
 *  1. DOUBLE CONTOUR — paroi avant ET paroi arrière, deux lignes
 *     imbriquées. La signature optique du cristal.
 *  2. ARÊTES TANGENTIELLES — le cristal ne brille qu'aux extrêmes, là où
 *     sa surface devient tangente au regard. Au centre, il disparaît.
 *  3. LE VIN REMONTE — un ménisque grimpe contre la paroi ; la surface
 *     est un plan elliptique, jamais une bande.
 *  4. TRANSMISSION ET CAUSTIQUE — la robe descend dans la jambe et
 *     projette une flaque colorée sur le sol.
 *  5. PROFONDEUR DE CHAMP — la netteté décroît du buvant vers le pied.
 *
 * CRITÈRE DE RÉUSSITE : le cristal reste lisible même sans le vin.
 */

/* Paroi avant : rim 178→442 (r=132), panse r=200, fond rond à 592 */
const PAROI =
  "M178 150 C150 250 110 320 110 400 C110 490 190 578 310 592 C430 578 510 490 510 400 C510 320 470 250 442 150 Z";

/* Paroi arrière, vue à travers le cristal — le double contour */
const PAROI_ARRIERE =
  "M195 161 C169 256 131 325 131 400 C131 481 201 566 310 578 C419 566 489 481 489 400 C489 325 451 256 425 161 Z";

export function Verre({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      initial={{ opacity: 0, scale: reduce ? 1 : 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: reduce ? 0 : 2.4,
        delay: reduce ? 0 : 0.9,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <svg
        viewBox="0 0 620 1080"
        className="h-full w-full opacity-[0.66]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Profondeur de champ : du buvant net au pied dissous */}
          <filter id="g-net" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
          <filter id="g-calice" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.3" />
          </filter>
          <filter id="g-jambe" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.8" />
          </filter>
          <filter id="g-pied" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4.2" />
          </filter>
          <filter id="g-sol" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
          <filter id="g-halo" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="18" />
          </filter>

          {/* L'ARÊTE : le cristal ne brille qu'aux extrêmes */}
          <linearGradient id="arete" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fffdf7" stopOpacity="0.66" />
            <stop offset="0.045" stopColor="#fffdf7" stopOpacity="0.3" />
            <stop offset="0.18" stopColor="#ece5d8" stopOpacity="0.045" />
            <stop offset="0.5" stopColor="#ece5d8" stopOpacity="0.014" />
            <stop offset="0.82" stopColor="#ece5d8" stopOpacity="0.06" />
            <stop offset="0.955" stopColor="#fffdf7" stopOpacity="0.36" />
            <stop offset="1" stopColor="#fffdf7" stopOpacity="0.74" />
          </linearGradient>

          <linearGradient id="arete-arriere" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ece5d8" stopOpacity="0.22" />
            <stop offset="0.14" stopColor="#ece5d8" stopOpacity="0.04" />
            <stop offset="0.5" stopColor="#ece5d8" stopOpacity="0.008" />
            <stop offset="0.86" stopColor="#ece5d8" stopOpacity="0.05" />
            <stop offset="1" stopColor="#ece5d8" stopOpacity="0.26" />
          </linearGradient>

          <linearGradient id="cristal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ece5d8" stopOpacity="0.07" />
            <stop offset="0.12" stopColor="#ece5d8" stopOpacity="0.016" />
            <stop offset="0.5" stopColor="#ece5d8" stopOpacity="0.005" />
            <stop offset="0.88" stopColor="#ece5d8" stopOpacity="0.02" />
            <stop offset="1" stopColor="#ece5d8" stopOpacity="0.08" />
          </linearGradient>

          {/*
            LE VIN — un bordeaux naturel : grenat sombre, jamais magenta.
            Noir au plus épais, rubis profond au plus mince.
          */}
          <radialGradient id="vin-masse" cx="0.5" cy="0.88" r="0.95">
            <stop offset="0" stopColor="#0c0206" />
            <stop offset="0.3" stopColor="#170509" />
            <stop offset="0.62" stopColor="#1f0810" />
            <stop offset="1" stopColor="#340c15" />
          </radialGradient>

          {/* La lumière traverse le vin là où il s'amincit : contre la paroi */}
          <linearGradient id="vin-parois" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6b1c28" stopOpacity="0.26" />
            <stop offset="0.045" stopColor="#5c1724" stopOpacity="0.18" />
            <stop offset="0.14" stopColor="#000" stopOpacity="0.12" />
            <stop offset="0.42" stopColor="#000" stopOpacity="0.3" />
            <stop offset="0.7" stopColor="#000" stopOpacity="0.16" />
            <stop offset="0.92" stopColor="#5c1724" stopOpacity="0.14" />
            <stop offset="1" stopColor="#6b1c28" stopOpacity="0.2" />
          </linearGradient>

          {/* Le foyer : la braise au creux de la panse */}
          <radialGradient id="vin-foyer" cx="0.38" cy="0.58" r="0.42">
            <stop offset="0" stopColor="#8e2f40" stopOpacity="0.07" />
            <stop offset="1" stopColor="#8e2f40" stopOpacity="0" />
          </radialGradient>

          {/* La surface du vin, vue en perspective */}
          <linearGradient id="surface" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#160409" stopOpacity="0.96" />
            <stop offset="1" stopColor="#27090f" stopOpacity="0.9" />
          </linearGradient>

          {/* Le reflet de la source sur le plan liquide */}
          <radialGradient id="reflet-surface" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffe4cd" stopOpacity="0.15" />
            <stop offset="0.5" stopColor="#9c3a4c" stopOpacity="0.06" />
            <stop offset="1" stopColor="#9c3a4c" stopOpacity="0" />
          </radialGradient>

          {/* LA JAMBE : deux arêtes vives, un cœur sombre */}
          <linearGradient id="jambe" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fffdf7" stopOpacity="0.44" />
            <stop offset="0.26" stopColor="#ece5d8" stopOpacity="0.04" />
            <stop offset="0.5" stopColor="#ece5d8" stopOpacity="0.015" />
            <stop offset="0.76" stopColor="#ece5d8" stopOpacity="0.06" />
            <stop offset="1" stopColor="#fffdf7" stopOpacity="0.36" />
          </linearGradient>
          <linearGradient id="jambe-robe" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#340c15" stopOpacity="0.4" />
            <stop offset="0.34" stopColor="#42101c" stopOpacity="0.16" />
            <stop offset="1" stopColor="#42101c" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="pied" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fffdf7" stopOpacity="0.28" />
            <stop offset="0.2" stopColor="#ece5d8" stopOpacity="0.03" />
            <stop offset="0.8" stopColor="#ece5d8" stopOpacity="0.04" />
            <stop offset="1" stopColor="#fffdf7" stopOpacity="0.24" />
          </linearGradient>

          <clipPath id="clip-calice">
            <path d={PAROI} />
          </clipPath>
        </defs>

        {/* ── LE SOL ─────────────────────────────────────────────── */}
        <ellipse cx="310" cy="936" rx="182" ry="22" fill="#000" opacity="0.4" filter="url(#g-sol)" />
        {/* la caustique : la lumière a traversé le vin */}
        <ellipse cx="310" cy="930" rx="72" ry="12" fill="#42101c" opacity="0.34" filter="url(#g-sol)" />

        {/* ── LE PIED : fin, arête avant nette ───────────────────── */}
        <g filter="url(#g-pied)">
          <ellipse cx="310" cy="912" rx="140" ry="24" fill="url(#pied)" />
          <path
            d="M170 906 A140 24 0 0 0 450 906"
            fill="none"
            stroke="#fffdf7"
            strokeOpacity="0.14"
            strokeWidth="1.4"
          />
          <ellipse cx="310" cy="907" rx="46" ry="8" fill="#42101c" opacity="0.2" />
        </g>

        {/* ── LA JAMBE : élancée, la robe y descend ──────────────── */}
        <g filter="url(#g-jambe)">
          <path
            d="M301 578 C294 620 300 660 300 902 L320 902 C320 660 326 620 319 578 Z"
            fill="url(#jambe)"
          />
          <path
            d="M301 578 C295 622 301 662 301 800 L319 800 C319 662 325 622 319 578 Z"
            fill="url(#jambe-robe)"
          />
          {/* le nœud : le cristal s'épaissit au raccord et capte la lumière */}
          <ellipse cx="310" cy="590" rx="22" ry="7" fill="#fffdf7" opacity="0.1" />
        </g>

        {/* ── LE CALICE ──────────────────────────────────────────── */}
        <g filter="url(#g-calice)">
          {/* le halo de robe, derrière le cristal */}
          <ellipse
            cx="310"
            cy="480"
            rx="186"
            ry="122"
            fill="#42101c"
            opacity="0.2"
            filter="url(#g-halo)"
          />

          {/* le corps de cristal — un souffle */}
          <path d={PAROI} fill="url(#cristal)" />

          {/* LE VIN — un tiers du calice */}
          <g clipPath="url(#clip-calice)">
            <rect x="90" y="445" width="440" height="180" fill="url(#vin-masse)" />
            <rect x="90" y="445" width="440" height="180" fill="url(#vin-parois)" />
            <rect x="90" y="445" width="440" height="180" fill="url(#vin-foyer)" />
          </g>

          {/* LA SURFACE — un plan elliptique, pas une bande */}
          <g clipPath="url(#clip-calice)">
            <ellipse cx="310" cy="445" rx="193" ry="27" fill="url(#surface)" />
            {/* l'arc avant du ménisque : le fil de lumière */}
            <path
              d="M117 445 A193 27 0 0 0 503 445"
              fill="none"
              stroke="#7e2231"
              strokeOpacity="0.5"
              strokeWidth="1.4"
              filter="url(#g-net)"
            />
            {/* l'arc arrière, vu à travers le vin */}
            <path
              d="M117 445 A193 27 0 0 1 503 445"
              fill="none"
              stroke="#6b1c28"
              strokeOpacity="0.3"
              strokeWidth="1"
            />
            {/* le reflet de la source sur le plan liquide */}
            <ellipse cx="244" cy="440" rx="72" ry="6.5" fill="url(#reflet-surface)" filter="url(#g-net)" />
          </g>

          {/* LA PAROI ARRIÈRE — vue à travers le cristal */}
          <path d={PAROI_ARRIERE} fill="none" stroke="url(#arete-arriere)" strokeWidth="1" />

          {/* LA PAROI AVANT — l'arête maîtresse */}
          <path d={PAROI} fill="none" stroke="url(#arete)" strokeWidth="1.4" />

          {/* Spéculaire clé — gauche, étroit, il épouse la panse */}
          <path
            d="M162 246 C128 320 122 396 142 470"
            fill="none"
            stroke="#fffdf7"
            strokeOpacity="0.17"
            strokeWidth="5.5"
            strokeLinecap="round"
            filter="url(#g-net)"
          />
          {/* Remplissage — droite, large et sourd */}
          <path
            d="M462 282 C490 356 486 428 464 490"
            fill="none"
            stroke="#ece5d8"
            strokeOpacity="0.06"
            strokeWidth="18"
            strokeLinecap="round"
          />
        </g>

        {/* ── LE BUVANT : l'arête la plus fine et la plus nette ──── */}
        <g filter="url(#g-net)">
          {/* l'épaisseur du cristal juste sous le buvant */}
          <ellipse
            cx="310"
            cy="153"
            rx="132"
            ry="24"
            fill="none"
            stroke="url(#arete)"
            strokeWidth="2"
            strokeOpacity="0.3"
          />
          {/* le fil du buvant — un millimètre de cristal */}
          <ellipse
            cx="310"
            cy="150"
            rx="132"
            ry="24"
            fill="none"
            stroke="url(#arete)"
            strokeWidth="0.6"
          />
          {/* l'arc avant, le plus exposé à la lumière */}
          <path
            d="M178 150 A132 24 0 0 0 442 150"
            fill="none"
            stroke="#fffdf7"
            strokeOpacity="0.38"
            strokeWidth="0.9"
          />
        </g>
      </svg>
    </motion.div>
  );
}
