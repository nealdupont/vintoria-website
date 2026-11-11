"use client";

import { useEffect } from "react";

/**
 * LA BOUGIE. Un seul écouteur pour tout le site.
 *
 * Tout élément qui porte `data-lumiere` reçoit la position du curseur dans
 * ses propres coordonnées, en `--mx` et `--my`. Le CSS fait le reste : une
 * lueur chaude qui suit la main sur le verre, et dans l'ouverture.
 *
 * Les éléments imbriqués sont tous servis (la carte de l'accord ET
 * l'ouverture qui la contient), sinon la lueur de fond se figerait dès que
 * le curseur passe sur le verre.
 *
 * Rien sur écran tactile ni en mouvement réduit : il n'y a pas de curseur à
 * suivre, et une lueur qui sauterait au doigt n'aurait aucun sens.
 */
export function Lumieres() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cibles: HTMLElement[] = [];
    let x = 0;
    let y = 0;
    let image = 0;

    const peindre = () => {
      image = 0;
      for (const el of cibles) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${Math.round(x - r.left)}px`);
        el.style.setProperty("--my", `${Math.round(y - r.top)}px`);
      }
    };

    const bouger = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const trouvees: HTMLElement[] = [];
      let el = (e.target as Element | null)?.closest?.("[data-lumiere]") as HTMLElement | null;
      while (el) {
        trouvees.push(el);
        el = el.parentElement?.closest("[data-lumiere]") as HTMLElement | null;
      }
      cibles = trouvees;
      if (!image) image = requestAnimationFrame(peindre);
    };

    document.addEventListener("pointermove", bouger, { passive: true });
    return () => {
      document.removeEventListener("pointermove", bouger);
      if (image) cancelAnimationFrame(image);
    };
  }, []);

  return null;
}
