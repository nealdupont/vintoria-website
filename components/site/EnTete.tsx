"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lockup } from "@/components/marque/Marque";
import { CONNEXION, INSCRIPTION } from "@/lib/liens";

/**
 * L'EN-TÊTE : une barre de verre qui flotte au-dessus de la page.
 *
 * Deux sorties seulement, et toujours visibles : « Se connecter » pour qui
 * a déjà un compte, « Essai gratuit » pour tous les autres. Sur mobile, la
 * connexion passe dans le menu, l'essai reste dans la barre.
 *
 * Le verre s'épaissit quand la page défile : en haut de l'accueil, il ne
 * doit pas couper la voûte ; plus bas, il doit rester lisible sur tout.
 */

const LIENS = [
  { href: "/#fonctionnalites", label: "Fonctionnalités" },
  { href: "/#benefices", label: "Bénéfices" },
  { href: "/tarifs", label: "Formules" },
  { href: "/#questions", label: "Questions" },
];

export function EnTete() {
  const chemin = usePathname();
  const [pose, setPose] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const bouton = useRef<HTMLButtonElement>(null);
  const panneau = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let image = 0;
    const lire = () => {
      image = 0;
      setPose(window.scrollY > 24);
    };
    const surDefilement = () => {
      if (!image) image = requestAnimationFrame(lire);
    };
    image = requestAnimationFrame(lire);
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => {
      window.removeEventListener("scroll", surDefilement);
      if (image) cancelAnimationFrame(image);
    };
  }, []);

  const fermer = useCallback((rendreLeFocus: boolean) => {
    setOuvert(false);
    if (rendreLeFocus) bouton.current?.focus();
  }, []);

  /*
   * LA MARQUE RAMÈNE EN HAUT DE L'ACCUEIL, même quand on y est déjà.
   * Sur la même route, Next ne fait rien d'un lien vers « / » : on remonte
   * donc nous-mêmes, on efface l'ancre de l'adresse et on referme le menu.
   */
  const versAccueil = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setOuvert(false);
    if (chemin !== "/") return;
    e.preventDefault();
    const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: doux ? "smooth" : "auto" });
    if (window.location.hash) window.history.replaceState(null, "", "/");
  };

  /* Échap ferme, et un clic hors du menu aussi. */
  useEffect(() => {
    if (!ouvert) return;
    const clavier = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer(true);
    };
    const clic = (e: PointerEvent) => {
      const cible = e.target as Node;
      if (panneau.current?.contains(cible) || bouton.current?.contains(cible)) return;
      fermer(false);
    };
    document.addEventListener("keydown", clavier);
    document.addEventListener("pointerdown", clic);
    panneau.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", clavier);
      document.removeEventListener("pointerdown", clic);
    };
  }, [ouvert, fermer]);

  return (
    <header
      className="entete"
      data-pose={pose ? "oui" : "non"}
      data-ouvert={ouvert ? "oui" : "non"}
    >
      <div className="entete-barre">
        <span className="entete-lecture" aria-hidden />
        <Link href="/" className="entete-marque" aria-label="Vintoria, accueil" onClick={versAccueil}>
          <Lockup hauteur={30} priority />
        </Link>

        <nav className="entete-nav" aria-label="Navigation principale">
          <ul>
            {LIENS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="entete-actions">
          <a className="entete-connexion" href={CONNEXION}>
            Se connecter
          </a>
          <a className="bouton bouton-or bouton-petit entete-essai" href={INSCRIPTION}>
            Essai gratuit
          </a>
          <button
            ref={bouton}
            type="button"
            className="entete-menu"
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOuvert((o) => !o)}
          >
            <span aria-hidden />
            <span aria-hidden />
          </button>
        </div>
      </div>

      {ouvert ? (
        <div ref={panneau} id="menu-mobile" className="entete-panneau">
          <nav aria-label="Menu">
            <ul>
              {LIENS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => fermer(false)}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="entete-panneau-actions">
            <a className="bouton bouton-or" href={INSCRIPTION}>
              Commencer l’essai gratuit
            </a>
            <a className="bouton bouton-verre" href={CONNEXION}>
              Se connecter
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
