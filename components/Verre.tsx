"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * LE VERRE
 *
 * Un verre de dégustation dessiné pour ce Hero — pas une icône agrandie.
 * Inspiré du sceau Vintoria, mais traité comme un objet : galbe de tulipe
 * bordelaise, ménisque qui capte la lumière, deux spéculaires seulement.
 *
 * Règle absolue : il ne doit JAMAIS concurrencer le mot VINTORIA.
 * D'où le flou, l'opacité basse et l'absence de tout contour net.
 * On doit sentir sa présence avant de le regarder.
 *
 * Sa robe vient des tokens du système (--robe-profond / --robe-lumiere) :
 * le verre appartient à l'univers, il n'y est pas ajouté.
 */
export function Verre({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      initial={{ opacity: 0, scale: reduce ? 1 : 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduce ? 0 : 2.4, delay: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* la lumière chaude, derrière le verre */}
      <div
        className="absolute left-1/2 top-[34%] h-[62%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--robe-profond) 75%, transparent), transparent 70%)",
        }}
      />

      <svg
        viewBox="0 0 420 760"
        className="relative h-full w-full opacity-[0.62] [filter:blur(2.5px)] sm:opacity-[0.55] sm:[filter:blur(3.5px)]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* le cristal : à peine visible, deux arêtes de lumière */}
          <linearGradient id="v-cristal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ece5d8" stopOpacity="0.26" />
            <stop offset="0.16" stopColor="#ece5d8" stopOpacity="0.05" />
            <stop offset="0.5" stopColor="#ece5d8" stopOpacity="0.02" />
            <stop offset="0.84" stopColor="#ece5d8" stopOpacity="0.07" />
            <stop offset="1" stopColor="#ece5d8" stopOpacity="0.3" />
          </linearGradient>

          {/* le vin : une surface qui capte la lumière, un corps profond */}
          <linearGradient id="v-vin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--robe-lumiere)" stopOpacity="0.34" />
            <stop offset="0.07" stopColor="var(--robe-profond)" stopOpacity="0.92" />
            <stop offset="0.45" stopColor="var(--robe-profond)" stopOpacity="1" />
            <stop offset="1" stopColor="#1e060c" stopOpacity="1" />
          </linearGradient>

          {/* la lumière qui traverse le vin, en bas du calice */}
          <radialGradient id="v-braise" cx="0.62" cy="0.72" r="0.55">
            <stop offset="0" stopColor="var(--robe-lumiere)" stopOpacity="0.5" />
            <stop offset="1" stopColor="var(--robe-lumiere)" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="v-pied" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ece5d8" stopOpacity="0.2" />
            <stop offset="0.5" stopColor="#ece5d8" stopOpacity="0.04" />
            <stop offset="1" stopColor="#ece5d8" stopOpacity="0.22" />
          </linearGradient>

          {/* le calice, pour découper le vin */}
          <clipPath id="v-calice">
            <path d="M96 96 C96 250 108 356 152 410 C176 440 196 452 210 456 C224 452 244 440 268 410 C312 356 324 250 324 96 Z" />
          </clipPath>
        </defs>

        {/* le pied */}
        <ellipse cx="210" cy="712" rx="104" ry="17" fill="url(#v-pied)" />
        <ellipse
          cx="210"
          cy="712"
          rx="104"
          ry="17"
          fill="none"
          stroke="#ece5d8"
          strokeOpacity="0.16"
          strokeWidth="1"
        />

        {/* la jambe */}
        <path
          d="M203 456 L200 706 L220 706 L217 456 Z"
          fill="url(#v-pied)"
        />

        {/* le calice */}
        <path
          d="M96 96 C96 250 108 356 152 410 C176 440 196 452 210 456 C224 452 244 440 268 410 C312 356 324 250 324 96 Z"
          fill="url(#v-cristal)"
        />

        {/* le vin */}
        <g clipPath="url(#v-calice)">
          <rect x="80" y="286" width="260" height="200" fill="url(#v-vin)" />
          <rect x="80" y="286" width="260" height="200" fill="url(#v-braise)" />
          {/* le ménisque : le fil de lumière sur la surface */}
          <ellipse
            cx="210"
            cy="288"
            rx="118"
            ry="15"
            fill="none"
            stroke="var(--robe-lumiere)"
            strokeOpacity="0.5"
            strokeWidth="1.5"
          />
          <ellipse
            cx="210"
            cy="288"
            rx="118"
            ry="15"
            fill="var(--robe-lumiere)"
            fillOpacity="0.1"
          />
        </g>

        {/* le buvant — l'arête la plus nette du verre */}
        <ellipse
          cx="210"
          cy="96"
          rx="114"
          ry="21"
          fill="none"
          stroke="#ece5d8"
          strokeOpacity="0.32"
          strokeWidth="1.25"
        />

        {/* deux spéculaires, pas une de plus */}
        <path
          d="M126 130 C124 250 136 340 168 392"
          fill="none"
          stroke="#ece5d8"
          strokeOpacity="0.2"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M292 150 C292 240 284 316 262 366"
          fill="none"
          stroke="#ece5d8"
          strokeOpacity="0.09"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}
