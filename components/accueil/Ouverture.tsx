"use client";

import { Fragment, useEffect, useRef } from "react";
import { INSCRIPTION } from "@/lib/liens";
import { Accord } from "./Accord";
import { Liquide } from "./Liquide";

/**
 * I · L'OUVERTURE, montée comme le générique d'un film.
 *
 *   0,00 s  un trait d'or naît au milieu de l'écran
 *   0,45 s  il se dédouble et s'ouvre comme un rideau : derrière, le vin
 *   0,85 s  le titre se compose lettre à lettre, vers après vers
 *   1,20 s  la barre descend
 *   1,25 s  la carte de l'accord se matérialise, puis un liseré d'or en fait le tour
 *   1,50 s  la promesse, puis la porte d'entrée
 *
 * Ensuite, plus rien ne se joue tout seul que le vin qui respire. Le reste
 * répond à la main : la bougie sur le vin, la carte qui s'incline vers le
 * curseur, les boutons qui l'attirent. Et en quittant l'ouverture, le titre
 * et la carte s'éloignent à des vitesses différentes : la profondeur.
 *
 * Tout le texte est dans le HTML dès le serveur. En mouvement réduit, il
 * est là d'emblée, sans rideau ni lettre qui tombe.
 */

const VERS: [string, string][] = [
  ["Chaque table", "mieux conseillée."],
  ["Chaque bouteille", "mieux valorisée."],
  ["Chaque cave", "mieux pilotée."],
];

const TITRE = VERS.map(([a, b]) => `${a} ${b}`).join(" ");

/** Une demi-ligne, découpée en lettres ; les mots ne se coupent jamais. */
function Lettres({ texte, rang }: { texte: string; rang: number }) {
  const mots = texte.split(" ");
  const debuts = mots.map((_, k) => mots.slice(0, k).join("").length);
  return (
    <>
      {mots.map((mot, k) => (
        <Fragment key={k}>
          {k > 0 ? " " : null}
          <span className="ouv-mot">
            {[...mot].map((l, n) => (
              <span
                key={n}
                className="ouv-lettre"
                style={{ "--l": rang, "--i": debuts[k] + n } as React.CSSProperties}
              >
                {l}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </>
  );
}

export function Ouverture() {
  const section = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const sortie = useRef(0);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduit) return;
    const fin = window.matchMedia("(pointer: fine)").matches;

    /* En quittant l'ouverture : la part déjà défilée, de 0 à 1. */
    let image = 0;
    const lire = () => {
      image = 0;
      const h = el.offsetHeight || 1;
      const p = Math.min(Math.max(window.scrollY / h, 0), 1);
      sortie.current = p;
      el.style.setProperty("--sortie", p.toFixed(4));
    };
    const defiler = () => {
      if (!image) image = requestAnimationFrame(lire);
    };
    window.addEventListener("scroll", defiler, { passive: true });
    image = requestAnimationFrame(lire);

    /* La carte s'incline vers la main, à peine. */
    const incliner = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      scene.current?.style.setProperty("--ry", `${(x * 9).toFixed(2)}deg`);
      scene.current?.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
    };
    if (fin) el.addEventListener("pointermove", incliner, { passive: true });

    return () => {
      window.removeEventListener("scroll", defiler);
      el.removeEventListener("pointermove", incliner);
      if (image) cancelAnimationFrame(image);
    };
  }, []);

  /* Les boutons attirent le curseur, de quelques pixels. */
  const attirer = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return;
    const b = e.currentTarget;
    const r = b.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    b.style.transform = `translate(${(dx * 0.16).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px)`;
  };
  const relacher = (e: React.PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = "";
  };

  return (
    <section ref={section} className="ouv" aria-labelledby="ouv-titre">
      <div className="ouv-fond" aria-hidden>
        <Liquide className="ouv-liquide" sortie={sortie} />
        <div className="ouv-voile" />
      </div>
      <span className="ouv-trait ouv-trait--haut" aria-hidden />
      <span className="ouv-trait ouv-trait--bas" aria-hidden />

      <div className="conteneur ouv-grille">
        <div className="ouv-propos">
          <h1 id="ouv-titre" className="t-xl ouv-titre" aria-label={TITRE}>
            {VERS.map(([debut, suite], k) => (
              <span key={debut} className="ouv-vers" aria-hidden>
                <span>
                  <Lettres texte={debut} rang={k * 2} />
                </span>
                <span className="ouv-suite">
                  <Lettres texte={suite} rang={k * 2 + 1} />
                </span>
              </span>
            ))}
          </h1>
          <p className="chapeau ouv-apparait" style={{ "--d": "1500ms" } as React.CSSProperties}>
            Vintoria donne à votre restaurant l’expertise d’un sommelier. Vos
            clients scannent un QR code, choisissent leur plat et découvrent
            le vin de votre carte qui l’accompagne, avec la raison. Vous vendez
            plus de vin, et votre cave se tient toute seule.
          </p>
          <div className="ouv-actions ouv-apparait" style={{ "--d": "1650ms" } as React.CSSProperties}>
            <a
              className="bouton bouton-or bouton-large"
              href={INSCRIPTION}
              onPointerMove={attirer}
              onPointerLeave={relacher}
            >
              Commencer l’essai gratuit
            </a>
            <a
              className="bouton bouton-verre bouton-large"
              href="#fonctionnalites"
              onPointerMove={attirer}
              onPointerLeave={relacher}
            >
              Voir les fonctionnalités
            </a>
          </div>
          <p className="petit ouv-garantie ouv-apparait" style={{ "--d": "1800ms" } as React.CSSProperties}>
            Essai gratuit, aucune carte bancaire requise.
          </p>
        </div>

        <div ref={scene} className="ouv-scene">
          <div className="ouv-carte">
            <Accord />
          </div>
        </div>
      </div>

      <a href="#constat" className="ouv-defiler">
        Découvrir
        <span aria-hidden />
      </a>
    </section>
  );
}
