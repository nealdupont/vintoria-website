"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { estEclairee } from "@/lib/scene";
import { LockupHorizontal, Symbole } from "@/components/marque/Marque";

/**
 * LE HEADER — fin, flottant, sans poids.
 *
 * À l'arrivée : ni fond, ni bordure. Il flotte au-dessus du noir.
 * Au défilement seulement, un voile et un filet se posent en fondu lent.
 *
 * NAVIGATION MOBILE — « le sommaire ».
 * Ce site ne contient aucune icône : un hamburger y serait la toute
 * première, et briserait le système. La marque parle par la typographie,
 * donc le déclencheur est un MOT, pas un symbole — et il bascule
 * « Sommaire » ↔ « Fermer » plutôt que d'afficher une croix.
 *
 * AUCUNE BIBLIOTHÈQUE D'ANIMATION ICI. Ce composant vit dans le layout
 * racine : tout ce qu'il importe est payé par /tarifs et /demonstration,
 * qui n'ont pas une seule animation. Les fondus et les décalages se font
 * en CSS, et le JavaScript se limite à ce que le CSS ne sait pas faire :
 * la position de défilement, le piège à focus, la touche Échap.
 */

interface Entree {
  href: string;
  /** Présent uniquement pour les ancres de l'accueil, suivies à l'œil. */
  id?: string;
  label: string;
  /** Sort du site : jamais « actif », jamais préchargé. */
  externe?: boolean;
}

/** Les mouvements de l'accueil — suivis par l'observateur. */
/*
 * LES ANCRES SUIVENT LA PAGE, et non l'inverse.
 * L'accueil est passé à trois mouvements ; `systeme`, `conseil` et `produit`
 * n'existent plus. Les laisser aurait donné trois entrées de navigation qui
 * ne mènent nulle part — un défaut qu'aucun build ne signale. Cette liste
 * s'étendra avec la page, pas avant.
 */
const MOUVEMENTS: Entree[] = [
  { href: "/#geste", id: "geste", label: "Commencer" },
  { href: "/#cave", id: "cave", label: "La cave" },
  { href: "/#table", id: "table", label: "En salle" },
  { href: "/#pourqui", id: "pourqui", label: "Pour qui" },
];

const FORMULES: Entree = { href: "/tarifs", label: "Formules" };
const ACCES: Entree = {
  href: "https://vintoria.app",
  label: "Accéder à Vintoria",
  externe: true,
};

export function Chrome() {
  const chemin = usePathname();
  const surAccueil = chemin === "/";
  /* L'accueil est passé en lumière traversée. L'en-tête doit suivre, et il
     ne le peut qu'en portant la classe : il est frère de `children`, pas
     son descendant. Il n'hérite donc de rien. */
  const eclairee = estEclairee(chemin);

  const [pose, setPose] = useState(false);
  const [horsOuverture, setHorsOuverture] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const [actif, setActif] = useState<string | null>(null);

  const declencheur = useRef<HTMLButtonElement>(null);
  const panneau = useRef<HTMLDivElement>(null);

  /* Le header se pose ; le sommaire n'apparaît qu'après l'ouverture. */
  useEffect(() => {
    const onScroll = () => {
      setPose(window.scrollY > 40);
      setHorsOuverture(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Hors de l'accueil, le sommaire est disponible dès le premier pixel :
     il n'y a pas d'ouverture à préserver. */
  const sommaireVisible = surAccueil ? horsOuverture || ouvert : true;

  /* Où suis-je ? — le mouvement qui occupe le cœur de l'écran. */
  useEffect(() => {
    if (!surAccueil) return;
    const cibles = MOUVEMENTS.map((l) => document.getElementById(l.id!)).filter(
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
  }, [surAccueil]);

  /* Hors de l'accueil, aucune ancre n'est active : la valeur se dérive, elle
     ne se remet pas à zéro dans un effet. */
  const actifCourant = surAccueil ? actif : null;

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
        "a[href], button:not([disabled])",
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
      200,
    );
    return () => {
      document.body.style.overflow = precedent;
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [ouvert, fermer]);

  /* Une navigation referme toujours le panneau. Ajusté PENDANT le rendu —
     un effet provoquerait un second rendu en cascade, et le panneau resterait
     visible le temps d'une image. */
  const [cheminVu, setCheminVu] = useState(chemin);
  if (chemin !== cheminVu) {
    setCheminVu(chemin);
    setOuvert(false);
  }

  const sommaire: Entree[] = surAccueil
    ? [ACCES, ...MOUVEMENTS, FORMULES]
    : [ACCES, { href: "/", label: "L’accueil" }, FORMULES];

  return (
    <>
      <header
        className={`${eclairee ? "lumiere" : ""} fixed inset-x-0 top-0 z-50 animate-[entree_1.2s_cubic-bezier(0.16,1,0.3,1)_0.15s_both] pt-[env(safe-area-inset-top)] transition-[background-color,border-color,backdrop-filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          pose || ouvert
            ? "border-b border-[color:var(--color-filet)] bg-fond/72 backdrop-blur-xl"
            : "border-b border-transparent"
        } ${ouvert ? "bg-fond" : ""}`}
      >
        <div className="px flex h-[4.5rem] items-center justify-between gap-4 lg:gap-6 xl:gap-8">
          {/* La marque */}
          <Link
            href="/"
            /*
             * Pas de préchargement sur la marque. Elle est visible dès le
             * premier pixel de chaque page : Next tirerait donc les morceaux
             * de l'accueil — dont la bibliothèque d'animation, 146 Ko — sur
             * /tarifs et /demonstration, qui n'en ont aucun usage. Un retour
             * à l'accueil se charge au clic, c'est bien assez.
             */
            prefetch={false}
            aria-label="Vintoria, accueil"
            className="flex min-h-11 min-w-11 shrink-0 items-center pr-1"
          >
            {/*
              LE LOGOTYPE VIENT DÉSORMAIS DE `vintoria-brand`.
              Ce qu'il y avait ici enfreignait deux règles de la charte : le
              V doré sur anneau appartient à l'ancienne identité, et le mot
              « VINTORIA » était COMPOSÉ EN TEXTE, en Spectral interlettré —
              or le wordmark ne se compose jamais, il a ses tracés.
              Le lockup horizontal est reconstitué aux proportions exactes
              du fichier officiel (voir components/marque/Marque.tsx), et
              il n'apparaît qu'à partir de `sm` : en dessous, le wordmark
              passerait sous sa largeur minimale de 80 px, donc le symbole
              reste seul.
            */}
            {/*
              LA BASCULE SE FAIT SUR UNE ENVELOPPE, pas sur le lockup.
              `LockupHorizontal` pose lui-même `inline-flex` ; une classe
              `hidden` passée en prop tombait dans la même couche Tailwind,
              et c'est l'ordre de la FEUILLE — non celui des classes — qui
              tranchait. Le lockup s'affichait donc à 320 px, où l'en-tête
              débordait de 37 px.

              Les paliers reprennent ceux de l'ancien en-tête, qui avaient
              raison : le wordmark s'efface quand la navigation devient
              dense (lg) et revient quand la place le permet (xl). Sous
              `sm`, il passerait sous sa largeur minimale de 80 px — le
              symbole reste donc seul.
            */}
            <span className="sm:hidden lg:block xl:hidden">
              <Symbole hauteur={28} priority />
            </span>
            <span className="hidden sm:block lg:hidden xl:block">
              <LockupHorizontal hauteur={32} priority />
            </span>
          </Link>

          {/* Les liens — grand écran, très espacés */}
          <nav className="hidden lg:block" aria-label="Navigation principale">
            <ul className="flex items-center gap-5 xl:gap-12">
              {(surAccueil ? [...MOUVEMENTS, FORMULES] : [FORMULES]).map(
                (l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={
                        l.id && actifCourant === l.id ? "true" : undefined
                      }
                      className={`relative inline-flex min-h-11 items-center text-[0.9rem] transition-colors duration-300 after:absolute after:bottom-3 after:left-0 after:h-px after:bg-[color:var(--robe-lumiere)] after:transition-all after:duration-500 hover:text-fort hover:after:w-full ${
                        l.id && actifCourant === l.id
                          ? "text-fort after:w-full"
                          : "text-texte after:w-0"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-3 lg:gap-4 xl:gap-5">
            {/* Le sommaire — un mot, jamais une icône. Petit écran seulement. */}
            {sommaireVisible && (
              <button
                ref={declencheur}
                type="button"
                onClick={() => setOuvert((v) => !v)}
                aria-expanded={ouvert}
                aria-controls="sommaire"
                className="eyebrow inline-flex min-h-11 items-center whitespace-nowrap text-fort transition-opacity duration-500 lg:hidden"
              >
                {ouvert ? "Fermer" : "Sommaire"}
              </button>
            )}

            {/*
              L'ACCÈS AU PRODUIT — pour qui connaît déjà Vintoria.
              Texte seul : le CTA reste le seul objet entouré d'un contour.
              Deux intentions, deux registres, jamais deux boutons.
              Sous lg, il vit dans le sommaire.
            */}
            <a
              href={ACCES.href}
              /*
               * Jamais sous `lg`. La barre étroite ne peut pas porter à la
               * fois l'accès au produit et l'appel à l'action : les deux se
               * chevauchaient à 390 px et le bouton sortait du cadre. Sous
               * `lg`, l'accès vit dans le sommaire, en première entrée.
               */
              className="eyebrow hidden min-h-11 shrink-0 items-center whitespace-nowrap transition-colors duration-300 hover:text-fort lg:inline-flex"
            >
              {ACCES.label}
            </a>

            {/* Le CTA — une vraie route, plus une ancre. */}
            <Link
              href="/demonstration"
              className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border border-[color:var(--color-filet-fort)] px-4 text-[0.72rem] uppercase tracking-[0.1em] text-fort transition-colors duration-300 hover:border-fort/40 hover:bg-fort/[0.05] sm:px-6 sm:tracking-[0.14em]"
            >
              <span className="sm:hidden">Démonstration</span>
              <span className="hidden sm:inline">
                Demander une démonstration
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/*
        LE SOMMAIRE — composé comme une page, pas comme un tiroir.
        Il vit HORS du header : `backdrop-filter` sur le header créerait un
        bloc conteneur et le panneau serait contraint à ses 4,5 rem de haut.
      */}
      {ouvert && (
        <div
          id="sommaire"
          ref={panneau}
          role="dialog"
          aria-modal="true"
          aria-label="Sommaire"
          className={`${eclairee ? "lumiere" : ""} fixed inset-x-0 bottom-0 top-[calc(4.5rem_+_env(safe-area-inset-top))] z-40 animate-[entree_0.32s_cubic-bezier(0.16,1,0.3,1)_both] overflow-y-auto bg-fond lg:hidden`}
        >
          <div className="px flex min-h-full flex-col pb-[calc(3rem_+_env(safe-area-inset-bottom))] pt-6">
            <ul>
              {sommaire.map((l, i) => {
                const contenu = (
                  <>
                    <span className="data w-6 shrink-0 text-[0.75rem] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`voix text-[1.75rem] leading-none transition-colors duration-300 ${
                        l.id && actifCourant === l.id
                          ? "text-fort"
                          : "text-texte"
                      }`}
                    >
                      {l.label}
                    </span>
                    {l.id && actifCourant === l.id && (
                      <span
                        aria-hidden
                        className="ml-auto h-1.5 w-1.5 shrink-0 self-center rounded-full bg-[color:var(--robe-lumiere)]"
                      />
                    )}
                  </>
                );
                const classe = "flex min-h-[4.5rem] items-baseline gap-5 py-5";
                return (
                  <li
                    key={l.href}
                    style={{ animationDelay: `${60 + i * 70}ms` }}
                    className="animate-[monte_0.6s_cubic-bezier(0.16,1,0.3,1)_both] border-b border-[color:var(--color-filet)]"
                  >
                    {l.externe ? (
                      <a href={l.href} onClick={fermer} className={classe}>
                        {contenu}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        onClick={fermer}
                        aria-current={
                          l.id && actifCourant === l.id ? "true" : undefined
                        }
                        className={classe}
                      >
                        {contenu}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            <div
              style={{ animationDelay: "300ms" }}
              className="mt-auto animate-[monte_0.6s_cubic-bezier(0.16,1,0.3,1)_both] pt-12"
            >
              <Link
                href="/demonstration"
                onClick={fermer}
                className="bouton bouton-primaire w-full"
              >
                Demander une démonstration
                <span aria-hidden>→</span>
              </Link>
              <p className="eyebrow mt-5 text-center">
                20 minutes · sur votre carte
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
