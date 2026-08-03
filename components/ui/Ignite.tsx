"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Allumage doré — quand le fil d'or atteint une carte, elle « prend vie » :
 * un halo d'or parcourt son contour puis se retire. À poser en dernier
 * enfant d'un élément `relative` (la carte).
 */
export function Ignite({ radius = "rounded-2xl" }: { radius?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${radius}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: [0, 1, 0] }}
      viewport={{ once: true, amount: 0.55 }}
      transition={{ duration: 1.7, times: [0, 0.28, 1], ease: "easeOut" }}
      style={{
        boxShadow:
          "inset 0 0 0 1px rgba(212,185,106,0.5), 0 0 36px -6px rgba(212,185,106,0.4)",
      }}
    />
  );
}
