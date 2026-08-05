"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/**
 * LE HEADER — fin, flottant, sans poids.
 *
 * À l'arrivée : ni fond, ni bordure. Il flotte au-dessus du noir.
 * Au scroll seulement, un voile et un filet se posent en fondu lent —
 * il s'installe sans jamais s'imposer.
 *
 * Marque à gauche · trois liens très espacés au centre · CTA à droite.
 */

const LIENS = [
  { href: "#demonstration", label: "La démonstration" },
  { href: "#benefices", label: "Les bénéfices" },
  { href: "#origine", label: "L’origine" },
];

export function Chrome() {
  const reduce = useReducedMotion();
  const [pose, setPose] = useState(false);

  useEffect(() => {
    const onScroll = () => setPose(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 1.2, delay: reduce ? 0 : 0.15 }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        pose
          ? "border-b border-[color:var(--color-filet)] bg-encre/72 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="px flex h-[4.5rem] items-center justify-between gap-8">
        {/* La marque */}
        <a
          href="#top"
          aria-label="Vintoria — accueil"
          className="flex min-h-11 shrink-0 items-center gap-3"
        >
          <Image
            src="/vintoria-logo.png"
            alt=""
            width={422}
            height={512}
            className="h-6 w-auto"
          />
          <span className="voix hidden text-[0.95rem] tracking-[0.3em] text-os sm:inline">
            VINTORIA
          </span>
        </a>

        {/* Les liens — très espacés */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-14">
            {LIENS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative inline-flex min-h-11 items-center text-[0.9rem] text-cendre transition-colors duration-300 hover:text-os after:absolute after:bottom-3 after:left-0 after:h-px after:w-0 after:bg-[color:var(--robe-lumiere)] after:transition-all after:duration-500 hover:after:w-full"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Le CTA */}
        <a
          href="#reserver"
          className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border border-[color:var(--color-filet-fort)] px-5 text-[0.72rem] uppercase tracking-[0.12em] text-os transition-colors duration-300 hover:border-os/40 hover:bg-white/[0.05] sm:px-6 sm:tracking-[0.14em]"
        >
          <span className="sm:hidden">Réserver</span>
          <span className="hidden sm:inline">Réserver une démonstration</span>
        </a>
      </div>
    </motion.header>
  );
}
