"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * LE HEADER — fin, flottant, sans poids.
 *
 * À l'arrivée : ni fond, ni bordure. Il flotte au-dessus du noir.
 * Au scroll seulement, un voile et un filet se posent en fondu lent.
 *
 * NAVIGATION MOBILE — « le sommaire ».
 * Ce site ne contient aucune icône : un hamburger y serait la toute
 * première, et briserait le système. La marque parle par la typographie,
 * donc le déclencheur est un MOT, pas un symbole — et il bascule
 * « Sommaire » ↔ « Fermer » plutôt que d'afficher une croix.
 *
 * Il n'apparaît qu'une fois le Hero quitté : la pureté de l'ouverture est
 * préservée, et le mouvement porte un sens — il surgit quand il sert.
 *
 * Le panneau est composé comme un sommaire éditorial (numéro en laiton,
 * intitulé en Spectral, filets fins), jamais comme un tiroir.
 */

const LIENS = [
  { href: "#demonstration", id: "demonstration", label: "La démonstration" },
  { href: "#benefices", id: "benefices", label: "Les bénéfices" },
  { href: "#origine", id: "origine", label: "L’origine" },
];

/*
  Le sommaire ouvre sur l'accès au produit, puis déroule les sections.
  L'entrée n'a pas d'`id` : elle sort du site, elle n'est donc jamais
  « active » et reste hors de l'IntersectionObserver et de la nav
  « Sections » du desktop, qui ne connaissent que LIENS.
*/
const SOMMAIRE: { href: string; id?: string; label: string }[] = [
  { href: "https://vintoria.app", label: "Accéder à Vintoria" },
  ...LIENS,
];

export function Chrome() {
  const reduce = useReducedMotion();
  const [pose, setPose] = useState(false);
  const [horsOuverture, setHorsOuverture] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const [actif, setActif] = useState<string | null>(null);

  const declencheur = useRef<HTMLButtonElement>(null);
  const panneau = useRef<HTMLDivElement>(null);

  /* Le header se pose ; le sommaire n'apparaît qu'après l'Ouverture. */
  useEffect(() => {
    const onScroll = () => {
      setPose(window.scrollY > 40);
      setHorsOuverture(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Où suis-je ? — la section qui occupe le cœur de l'écran. */
  useEffect(() => {
    const cibles = LIENS.map((l) => document.getElementById(l.id)).filter(
      (e): e is HTMLElement => !!e,
    );
    if (!cibles.length) return;
    const io = new IntersectionObserver(
      (entrees) => {
        const vue = entrees
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vue) setActif(vue.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    cibles.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const fermer = useCallback(() => {
    setOuvert(false);
    declencheur.current?.focus();
  }, []);

  /* Panneau ouvert : défilement bloqué, Échap ferme, focus capturé. */
  useEffect(() => {
    if (!ouvert) return;
    const precedent = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        fermer();
        return;
      }
      if (e.key !== "Tab" || !panneau.current) return;
      const focusables = panneau.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables.length) return;
      const premier = focusables[0];
      const dernier = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === premier) {
        e.preventDefault();
        dernier.focus();
      } else if (!e.shiftKey && document.activeElement === dernier) {
        e.preventDefault();
        premier.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const t = setTimeout(
      () => panneau.current?.querySelector<HTMLElement>("a[href]")?.focus(),
      reduce ? 0 : 220,
    );
    return () => {
      document.body.style.overflow = precedent;
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [ouvert, fermer, reduce]);

  return (
    <>
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 1.2, delay: reduce ? 0 : 0.15 }}
      /* Le fond du bandeau part du bord haut de l'écran ; la marge haute
         fait commencer sa barre de 4,5 rem sous la zone système. */
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,border-color,backdrop-filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        pose || ouvert
          ? "border-b border-[color:var(--color-filet)] bg-encre/72 backdrop-blur-xl"
          : "border-b border-transparent"
      } ${ouvert ? "bg-encre" : ""}`}
    >
      <div className="px flex h-[4.5rem] items-center justify-between gap-4 sm:gap-8">
        {/* La marque */}
        <a
          href="#top"
          aria-label="Vintoria, accueil"
          className="flex min-h-11 shrink-0 items-center gap-3"
        >
          <Image
            src="/vintoria-logo.png"
            alt=""
            width={422}
            height={512}
            className="h-6 w-auto"
          />
          <span className="voix hidden text-[0.95rem] tracking-[0.3em] text-os sm:inline lg:hidden xl:inline">
            VINTORIA
          </span>
        </a>

        {/* Les liens — desktop, très espacés */}
        <nav className="hidden lg:block" aria-label="Sections">
          <ul className="flex items-center gap-10 xl:gap-14">
            {LIENS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={actif === l.id ? "true" : undefined}
                  className={`relative inline-flex min-h-11 items-center text-[0.9rem] transition-colors duration-300 hover:text-os after:absolute after:bottom-3 after:left-0 after:h-px after:bg-[color:var(--robe-lumiere)] after:transition-all after:duration-500 hover:after:w-full ${
                    actif === l.id
                      ? "text-os after:w-full"
                      : "text-cendre after:w-0"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          {/* Le sommaire — un mot, jamais une icône. Mobile seulement. */}
          <AnimatePresence>
            {(horsOuverture || ouvert) && (
              <motion.button
                ref={declencheur}
                type="button"
                onClick={() => setOuvert((v) => !v)}
                aria-expanded={ouvert}
                aria-controls="sommaire"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.5 }}
                className="eyebrow inline-flex min-h-11 items-center whitespace-nowrap text-os transition-colors duration-300 hover:text-os lg:hidden"
              >
                {ouvert ? "Fermer" : "Sommaire"}
              </motion.button>
            )}
          </AnimatePresence>

          {/*
            L'ACCÈS AU PRODUIT — pour qui connaît déjà Vintoria.
            Texte seul, en cendre-2 : le CTA reste le seul objet en ivoire et
            le seul entouré d'un contour. Deux intentions, deux registres,
            jamais deux boutons. Sous lg, il vit dans le sommaire.
          */}
          <a
            href="https://vintoria.app"
            className={`eyebrow min-h-11 shrink-0 items-center whitespace-nowrap transition-colors duration-300 hover:text-os ${
              /* Sous lg, la barre ne peut pas porter l'accès ET le
                 déclencheur du sommaire : dans l'Ouverture l'accès est
                 là, ensuite le sommaire le reprend en première entrée.
                 En deçà de 380 px, « Accéder à Vintoria » (172 px) ne
                 tient plus face à « Réserver » : le sommaire seul le
                 porte, plutôt que d'abréger le libellé. */
              horsOuverture
                ? "hidden lg:inline-flex"
                : "hidden min-[380px]:inline-flex lg:inline-flex"
            }`}
          >
            Accéder à Vintoria
          </a>

          {/* Le CTA */}
          <a
            href="#reserver"
            className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border border-[color:var(--color-filet-fort)] px-4 text-[0.72rem] uppercase tracking-[0.1em] text-os transition-colors duration-300 hover:border-os/40 hover:bg-white/[0.05] sm:px-6 sm:tracking-[0.14em]"
          >
            <span className="sm:hidden">Réserver</span>
            <span className="hidden sm:inline">Réserver une démonstration</span>
          </a>
        </div>
      </div>
    </motion.header>

      {/*
        LE SOMMAIRE — composé comme une page, pas comme un tiroir.
        Il vit HORS du header : `backdrop-filter` sur le header créerait un
        bloc conteneur et le panneau serait contraint à ses 72 px de haut.
      */}
      <AnimatePresence>
        {ouvert && (
          <motion.div
            id="sommaire"
            ref={panneau}
            role="dialog"
            aria-modal="true"
            aria-label="Sommaire"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 top-[calc(4.5rem_+_env(safe-area-inset-top))] z-40 overflow-y-auto bg-encre lg:hidden"
          >
            <div className="px flex min-h-full flex-col pb-[calc(3rem_+_env(safe-area-inset-bottom))] pt-6">
              <ul>
                {SOMMAIRE.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduce ? 0 : 0.6,
                      delay: reduce ? 0 : 0.06 + i * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-[color:var(--color-filet)]"
                  >
                    <a
                      href={l.href}
                      onClick={() => setOuvert(false)}
                      aria-current={actif === l.id ? "true" : undefined}
                      className="flex min-h-[4.5rem] items-baseline gap-5 py-5"
                    >
                      <span className="data w-6 shrink-0 text-[0.75rem] text-laiton">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`voix text-[1.75rem] leading-none transition-colors duration-300 ${
                          actif === l.id ? "text-os" : "text-cendre"
                        }`}
                      >
                        {l.label}
                      </span>
                      {actif === l.id && (
                        <span
                          aria-hidden
                          className="ml-auto h-1.5 w-1.5 shrink-0 self-center rounded-full bg-[color:var(--robe-lumiere)]"
                        />
                      )}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduce ? 0 : 0.6,
                  delay: reduce ? 0 : 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-auto pt-12"
              >
                <a
                  href="#reserver"
                  onClick={() => setOuvert(false)}
                  className="group inline-flex min-h-[3.25rem] w-full items-center justify-center gap-3 whitespace-nowrap rounded-full bg-os px-6 text-[0.75rem] uppercase tracking-[0.12em] text-encre"
                >
                  Réserver une démonstration
                  <span aria-hidden>→</span>
                </a>
                <p className="eyebrow mt-5 text-center">
                  20 minutes · sur votre carte
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
