"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * Une ligne de générique : révélée par un masque (translation depuis le bas).
 * `inView` : révélée au scroll. Sinon : à l’apparition (ouverture).
 *
 * Le déclencheur `whileInView` est posé sur l’élément EXTÉRIEUR (non masqué) —
 * l’inner est clippé par overflow-hidden et ne serait jamais « vu ».
 */
export function Line({
  children,
  delay = 0,
  inView = false,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  inView?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const inner: Variants = {
    hidden: { y: reduce ? "0%" : "115%" },
    show: { y: "0%" },
  };
  const trigger = inView
    ? ({ whileInView: "show", viewport: { once: true, amount: 0.3 } } as const)
    : ({ animate: "show" } as const);

  return (
    <motion.span
      className={`block overflow-hidden ${className}`}
      initial="hidden"
      {...trigger}
    >
      <motion.span
        className="block will-change-transform"
        variants={inner}
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
