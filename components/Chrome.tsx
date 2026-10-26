"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { estEclairee } from "@/lib/scene";
import { LockupHorizontal, Symbole } from "@/components/marque/Marque";

/**
 * LE HEADER — UNE VITRE QUI S'OUVRE.
 *
 * LA BARRE ET LE SOMMAIRE SONT LE MÊME ÉLÉMENT. Ce n'est pas une
 * commodité de code : deux surfaces `backdrop-filter` posées bout à bout
 * échantillonnent chacune l'arrière-plan de SA propre boîte, avec serrage
 * des bords — la jointure se voit, en clair, sur toute la largeur. Il n'y
 * a donc qu'une vitre, et c'est sa HAUTEUR qui s'ouvre : 4,5 rem au repos,
 * toute la fenêtre sur petit écran, 27 rem au-delà de `lg`, où la page
 * reste visible dessous.
 *
 * LE VERRE EST PERMANENT. Il n'attend pas le clic : la barre diffuse en
 * continu ce qui passe sous elle. Le flou s'épaissit quand le sommaire
 * s'ouvre — de 16 à 26 px — parce que la diffusion fait alors partie de
 * la chorégraphie, pas parce qu'elle apparaîtrait.
 *
 * ET IL EST VRAIMENT TRANSPARENT : 44 % de teinte, non 64. La page se
 * voit passer dessous. Ce que la teinte ne retient plus, l'encre le
 * paie — `.verre` remonte ses propres `--color-texte` et
 * `--color-faible` dans globals.css, où la mesure est consignée.
 *
 * UNE SEULE NAVIGATION À TOUTES LES LARGEURS. La liste en ligne du grand
 * écran a disparu : elle et le sommaire disaient la même chose à deux
 * endroits, avec deux compositions et deux comportements. Le ciseau ouvre
 * désormais les mêmes destinations partout ; seule la composition change.
 *
 * AUCUNE BIBLIOTHÈQUE D'ANIMATION ICI, et la règle n'a pas bougé : ce
 * composant vit dans la mise en page racine, donc tout ce qu'il importe
 * est payé par /tarifs et /demonstration, qui n'ont pas une animation.
 * Toute la chorégraphie tient en transitions CSS (voir `.verre`,
 * `.ciseau` et `.entree-sommaire` dans globals.css) — que la règle
 * globale `prefers-reduced-motion` neutralise déjà, en `!important`.
 * Le JavaScript se limite à ce que le CSS ne sait pas faire : le
 * défilement, le piège à focus, Échap, l'inertie de l'arrière-plan.
 */

interface Entree {
  href: string;
  /** Présent uniquement pour les ancres de l'accueil, suivies à l'œil. */
  id?: string;
  label: string;
  /** Sort du site : jamais « actif », jamais préchargé. */
  externe?: boolean;
}

/*
 * LES DESTINATIONS SONT CELLES DU HEADER D'AVANT, réunies en une liste.
 * Rien n'a été inventé, rien n'a été perdu : les quatre mouvements et les
 * formules venaient de la barre du grand écran, l'accueil venait du
 * sommaire mobile. La liste est désormais la MÊME sur toutes les routes —
 * c'est ce qu'on attend d'une navigation globale, et cela rend les ancres
 * de l'accueil atteignables depuis /tarifs et /demonstration, ce qui
 * n'était pas le cas.
 *
 * /film n'y figure pas : cette page publie encore un nombre de bouteilles
 * que la section Cave contredit. On ne met pas en avant une page qui
 * dément le site. À reprendre avec elle, pas ici.
 */
const SOMMAIRE: Entree[] = [
  { href: "/", label: "L’accueil" },
  { href: "/#geste", id: "geste", label: "Commencer" },
  { href: "/#cave", id: "cave", label: "La cave" },
  { href: "/#table", id: "table", label: "En salle" },
  { href: "/#pourqui", id: "pourqui", label: "Pour qui" },
  { href: "/tarifs", label: "Les formules" },
];

const ACCES: Entree = {
  href: "https://vintoria.app",
  label: "Accéder à Vintoria",
  externe: true,
};
const COURRIEL: Entree = {
  href: "mailto:contact@vintoria.com",
  label: "contact@vintoria.com",
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
  const [ouvert, setOuvert] = useState(false);
  const [actif, setActif] = useState<string | null>(null);

  const declencheur = useRef<HTMLButtonElement>(null);
  const vitre = useRef<HTMLElement>(null);
  const panneau = useRef<HTMLDivElement>(null);

  /* Le filet bas ne se pose qu'une fois la page engagée : en haut de
     l'accueil, un trait en travers couperait le héros. Le VERRE, lui, est
     là dès le premier pixel — c'est le filet qui attend, pas la matière. */
  useEffect(() => {
    const onScroll = () => setPose(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Où suis-je ? — le mouvement qui occupe le cœur de l'écran. */
  useEffect(() => {
    if (!surAccueil) return;
    const cibles = SOMMAIRE.filter((l) => l.id)
      .map((l) => document.getElementById(l.id!))
      .filter((e): e is HTMLElement => !!e);
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

  /*
   * SOMMAIRE OUVERT : la page derrière est RETIRÉE, pas seulement
   * recouverte. `inert` sur le contenu et le pied fait les trois choses à
   * la fois — plus de clic, plus de tabulation, plus d'annonce par les
   * lecteurs d'écran — là où un simple z-index n'en fait aucune. La barre,
   * elle, reste vivante : elle porte le ciseau qui referme, et l'y rendre
   * inatteignable (ce que ferait `aria-modal` sur le seul panneau) serait
   * un piège. Le focus tourne donc dans la VITRE ENTIÈRE, barre comprise.
   */
  useEffect(() => {
    if (!ouvert) return;

    const corps = document.body;
    const defilementAvant = corps.style.overflow;
    corps.style.overflow = "hidden";

    const derriere = [
      document.getElementById("contenu"),
      document.querySelector("footer"),
    ].filter((e): e is HTMLElement => !!e);
    derriere.forEach((e) => e.setAttribute("inert", ""));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        fermer();
        return;
      }
      if (e.key !== "Tab" || !vitre.current) return;
      const focusables = [
        ...vitre.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ),
      ].filter((n) => n.offsetParent !== null);
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
    /* La vitre descend pendant 560 ms : on entre dans le sommaire quand il
       est là, pas pendant qu'il arrive. */
    const t = setTimeout(
      () => panneau.current?.querySelector<HTMLElement>("a[href]")?.focus(),
      220,
    );

    return () => {
      corps.style.overflow = defilementAvant;
      derriere.forEach((e) => e.removeAttribute("inert"));
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [ouvert, fermer]);

  /* Une navigation referme toujours la vitre. Ajusté PENDANT le rendu —
     un effet provoquerait un second rendu en cascade, et le sommaire
     resterait ouvert le temps d'une image. */
  const [cheminVu, setCheminVu] = useState(chemin);
  if (chemin !== cheminVu) {
    setCheminVu(chemin);
    setOuvert(false);
  }

  /*
   * LA MARQUE REMONTE À L'ACCUEIL, MÊME QUAND ON Y EST DÉJÀ.
   *
   * Depuis une AUTRE page, le lien natif suffit : la route change, et
   * l'ajustement ci-dessus referme la vitre. Depuis l'accueil, il ne se
   * passe rien — la route est identique, le routeur n'a donc rien à faire.
   * Mesuré : 748 px de défilement avant le clic, 748 après, sommaire resté
   * ouvert. Sur mobile, où le sommaire occupe tout l'écran, cliquer le V
   * ne produisait aucun effet visible : le défaut signalé.
   *
   * On refait donc les trois gestes qu'une arrivée sur l'accueil produit —
   * refermer la vitre, retirer l'ancre, remonter — et seulement ceux-là.
   *
   * `replaceState` et non `pushState` : revenir en arrière doit ramener
   * d'où l'on vient, pas rejouer l'ancre qu'on quitte.
   *
   * `scrollTo` sans `behavior` suit le `scroll-behavior` de la feuille,
   * que `prefers-reduced-motion` ramène déjà à `auto` — une seconde règle
   * ici aurait pu diverger de la première.
   *
   * On n'appelle PAS `fermer()` : il rend le focus au déclencheur du
   * sommaire, alors que le doigt vient de se poser sur la marque.
   */
  const versAccueil = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (chemin !== "/") return;
      /* ON NE CONFISQUE QUE LE CLIC ORDINAIRE. ⌘-clic, Ctrl-clic, clic du
         milieu ou Maj-clic ouvrent un onglet ou une fenêtre : le lien natif
         doit alors faire son travail, et `preventDefault` le lui volerait. */
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      e.preventDefault();
      setOuvert(false);
      if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname);
      }
      window.scrollTo({ top: 0 });
    },
    [chemin],
  );

  const lienSecondaire =
    "t-meta inline-flex min-h-11 items-center transition-colors duration-300 hover:text-[color:var(--color-fort)]";

  return (
    <header
      ref={vitre}
      data-ouvert={ouvert ? "true" : "false"}
      className={`${eclairee ? "lumiere" : ""} verre fixed inset-x-0 top-0 z-50 flex h-[calc(4.5rem+env(safe-area-inset-top))] flex-col overflow-hidden pt-[env(safe-area-inset-top)] animate-[entree_1.2s_cubic-bezier(0.16,1,0.3,1)_0.15s_both] data-[ouvert=true]:h-[100dvh] lg:data-[ouvert=true]:h-[27rem] xl:data-[ouvert=true]:h-[29rem] ${
        pose || ouvert
          ? "border-b border-[color:var(--color-filet)]"
          : "border-b border-transparent"
      }`}
    >
      {/* ══ LA BARRE ════════════════════════════════════════════ */}
      <div className="px flex h-[4.5rem] shrink-0 items-center justify-between gap-4 lg:gap-6 xl:gap-8">
        <Link
          href="/"
          /*
           * Pas de préchargement sur la marque. Elle est visible dès le
           * premier pixel de chaque page : Next tirerait donc les morceaux
           * de l'accueil — dont la bibliothèque d'animation, 146 Ko — sur
           * /tarifs et /demonstration, qui n'en ont aucun usage.
           */
          prefetch={false}
          onClick={versAccueil}
          aria-label="Vintoria — Accueil"
          className="flex min-h-11 min-w-11 shrink-0 items-center pr-1"
        >
          {/*
            LA BASCULE SE FAIT SUR UNE ENVELOPPE, pas sur le lockup.
            `LockupHorizontal` pose lui-même `inline-flex` ; une classe
            `hidden` passée en prop tombait dans la même couche Tailwind,
            et c'est l'ordre de la FEUILLE — non celui des classes — qui
            tranchait. Le lockup s'affichait donc à 320 px, où l'en-tête
            débordait de 37 px.
            Sous `sm`, le wordmark passerait sous sa largeur minimale de
            80 px : le symbole reste seul.
          */}
          <span className="sm:hidden">
            <Symbole hauteur={28} priority />
          </span>
          <span className="hidden sm:block">
            <LockupHorizontal hauteur={32} priority />
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-3 lg:gap-5">
          {/*
            L'ACCÈS AU PRODUIT — pour qui connaît déjà Vintoria.
            Jamais sous `lg` : la barre étroite ne peut pas porter à la
            fois l'accès et l'appel à l'action, ils se chevauchaient à
            390 px. En dessous, il vit dans le sommaire.
          */}
          <a
            href={ACCES.href}
            className="eyebrow eyebrow-verre hidden min-h-11 shrink-0 items-center whitespace-nowrap transition-colors duration-300 lg:inline-flex"
          >
            {ACCES.label}
          </a>

          {/* Le CTA — inchangé : même destination, même fonction. */}
          <Link
            href="/demonstration"
            className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border border-[color:var(--color-filet-fort)] px-4 text-[0.72rem] uppercase tracking-[0.1em] text-fort transition-colors duration-300 hover:border-fort/40 hover:bg-fort/[0.05] sm:px-6 sm:tracking-[0.14em]"
          >
            <span className="sm:hidden">Démonstration</span>
            <span className="hidden sm:inline">Demander une démonstration</span>
          </Link>

          {/*
            LE CISEAU. Zone tactile de 44 px ; les filets, eux, en font
            36 sur 1,5 — c'est le vide autour qui fait la cible, pas le
            trait. Le nom accessible reste « Sommaire » : c'est le mot de
            la maison, et il ne change pas selon l'état — `aria-expanded`
            dit l'état, le nom dit la destination.
          */}
          <button
            ref={declencheur}
            type="button"
            onClick={() => setOuvert((v) => !v)}
            aria-expanded={ouvert}
            aria-controls="sommaire"
            className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center text-[color:var(--color-fort)] outline-offset-4 focus-visible:outline-2 focus-visible:outline-[color:var(--color-accent)]"
          >
            <span className="sr-only">Sommaire</span>
            <span aria-hidden className="ciseau">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* ══ LE SOMMAIRE ═════════════════════════════════════════
          Il reste monté, et `inert` quand il est fermé : c'est ce qui
          permet à la fermeture d'avoir une chorégraphie, là où un
          démontage ferait disparaître les mots d'un coup pendant que la
          vitre, elle, remonte encore. Fermé, il est hors du champ (la
          vitre rogne), hors du focus et hors de l'arbre d'accessibilité. */}
      <div
        id="sommaire"
        ref={panneau}
        role="dialog"
        aria-label="Sommaire"
        inert={!ouvert}
        className="sommaire px flex min-h-0 flex-1 flex-col justify-end pb-[calc(2.25rem+env(safe-area-inset-bottom))] lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-10 lg:pb-14"
      >
        {/* LES DESTINATIONS — ferrées à droite, sous le ciseau qui les a
            ouvertes. Au grand écran elles gardent ce bord : le vide passe
            à gauche, où il devient une composition et non un reste. */}
        <ul className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
          {SOMMAIRE.map((l, i) => {
            const estActif = !!l.id && actifCourant === l.id;
            return (
              <li
                key={l.href}
                className="entree-sommaire"
                style={{ "--rang": i } as React.CSSProperties}
              >
                <Link
                  href={l.href}
                  onClick={fermer}
                  aria-current={estActif ? "true" : undefined}
                  className={`voix flex items-baseline justify-end gap-3 py-[0.55rem] text-[2rem] leading-none transition-colors duration-300 hover:text-[color:var(--color-fort)] lg:py-[0.6rem] lg:text-[1.75rem] ${
                    estActif
                      ? "text-[color:var(--color-fort)]"
                      : "text-[color:var(--color-texte)]"
                  }`}
                >
                  {l.label}
                  {/* La marque du mouvement en cours. Un point, pas un badge :
                      il dit « vous êtes ici », il ne nomme rien. */}
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 shrink-0 self-center rounded-full bg-[color:var(--color-accent)] transition-opacity duration-300 ${
                      estActif ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* LE SECOND REGISTRE — en pied sur petit écran, en bas à gauche
            au grand, où il tient le vide. Même matière, autre voix. */}
        <div
          className="entree-sommaire mt-9 text-right lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:text-left"
          style={{ "--rang": SOMMAIRE.length } as React.CSSProperties}
        >
          <p className="eyebrow eyebrow-verre hidden lg:block">Sommaire</p>
          <p className="voix mt-4 hidden max-w-[20ch] text-[1.3rem] italic leading-snug text-[color:var(--color-texte)] lg:block">
            L’univers du vin, pensé autrement.
          </p>
          <div className="flex flex-col items-end gap-2 text-[color:var(--color-texte)] lg:mt-9 lg:items-start">
            <a href={ACCES.href} className={lienSecondaire}>
              {ACCES.label}
            </a>
            <a href={COURRIEL.href} className={lienSecondaire}>
              {COURRIEL.label}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
