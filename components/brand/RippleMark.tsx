"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * L'onde, en petit — déclinaison du symbole de la goutte.
 * Anneaux concentriques qui se propagent en boucle. Réutilisé pour
 * les séparateurs, la scission Pro/Mobile et l'état « le moteur réfléchit ».
 */
export function RippleMark({
  size = 44,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const rings = [0, 0.7, 1.4];
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span className="absolute h-1 w-1 rounded-full bg-gold" />
      {rings.map((delay, i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border border-gold/40"
          initial={{ scale: 0.15, opacity: 0.55 }}
          animate={
            reduce
              ? { scale: [0.4, 1][i % 2], opacity: 0.14 }
              : { scale: 1, opacity: 0 }
          }
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 2.6, repeat: Infinity, delay, ease: "easeOut" }
          }
        />
      ))}
    </span>
  );
}
