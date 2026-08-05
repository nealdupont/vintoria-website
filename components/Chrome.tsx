"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/** Habillage minimal : la marque, et l’invitation qui se révèle après l’ouverture. */
export function Chrome() {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="px pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between py-6">
      <a
        href="#top"
        className="voix pointer-events-auto inline-flex min-h-11 items-center text-lg tracking-[0.14em] text-os"
      >
        Vintoria
      </a>
      <AnimatePresence>
        {past && (
          <motion.a
            href="#reserver"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow pointer-events-auto flex min-h-11 shrink-0 items-center gap-2.5 whitespace-nowrap text-os/80 transition-colors hover:text-os"
          >
            <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-laiton" />
            <span className="sm:hidden">Réserver</span>
            <span className="hidden sm:inline">Réserver une démonstration</span>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
