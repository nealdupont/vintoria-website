"use client";

import { useEffect, useRef } from "react";
import { Pictogramme } from "./Illustrations";

/**
 * II · LE CONSTAT.
 *
 * Tout part d'une phrase que le restaurateur entend à chaque service. Elle
 * occupe l'écran, en très grand, et s'allume mot à mot à mesure qu'on
 * descend : on la lit au rythme où un client la prononce. Puis vient ce
 * qu'elle coûte, en trois maux dits avec ses mots à lui, et aucun chiffre.
 *
 * L'allumage est piloté par une seule variable (`--p`, de 0 à 1) que pose
 * un écouteur de défilement ; chaque mot connaît son rang et calcule sa
 * propre opacité en CSS. En mouvement réduit, la phrase est allumée.
 */

const QUESTION = "Qu’est-ce que vous me conseillez avec ça ?";

const MAUX = [
  {
    picto: "equipe",
    titre: "Une équipe qui tourne",
    texte:
      "Extras, saisonniers, nouveaux arrivés. Former chacun à toute la carte des vins est impossible, alors le conseil dépend de qui est là ce soir.",
  },
  {
    picto: "cave",
    titre: "Des bouteilles qui dorment",
    texte:
      "Ce qui n’est pas conseillé ne part pas. Les belles références restent en cave, et la trésorerie avec elles.",
  },
  {
    picto: "image",
    titre: "Une cave tenue de mémoire",
    texte:
      "Inventaires sur papier, ruptures découvertes en plein service, carte imprimée qui n’est plus à jour.",
  },
] as const;

export function Constat() {
  const phrase = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const el = phrase.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }
    let image = 0;
    const lire = () => {
      image = 0;
      const r = el.getBoundingClientRect();
      const h = window.innerHeight;
      /* 0 quand la phrase entre par le bas, 1 quand elle atteint le tiers haut. */
      const p = (h * 0.92 - r.top) / (h * 0.92 - h * 0.28 + r.height * 0.4);
      el.style.setProperty("--p", Math.min(Math.max(p, 0), 1).toFixed(3));
    };
    const defiler = () => {
      if (!image) image = requestAnimationFrame(lire);
    };
    image = requestAnimationFrame(lire);
    window.addEventListener("scroll", defiler, { passive: true });
    window.addEventListener("resize", defiler);
    return () => {
      window.removeEventListener("scroll", defiler);
      window.removeEventListener("resize", defiler);
      if (image) cancelAnimationFrame(image);
    };
  }, []);

  const mots = QUESTION.split(" ");

  return (
    <section id="constat" className="section cst" aria-labelledby="constat-titre">
      <div className="conteneur">
        <p className="cst-amorce">À chaque service, la même question.</p>
        <blockquote
          ref={phrase}
          className="cst-question"
          style={{ "--n": mots.length } as React.CSSProperties}
        >
          <span className="cst-guillemet" aria-hidden>
            {"«\u202f"}
          </span>
          {mots.map((m, i) => (
            <span key={i}>
              <span className="cst-mot" style={{ "--i": i } as React.CSSProperties}>
                {m}
              </span>
              {i < mots.length - 1 ? " " : null}
            </span>
          ))}
          <span className="cst-guillemet" aria-hidden>
            {"\u202f»"}
          </span>
        </blockquote>

        <div className="constat-tete">
          <h2 id="constat-titre" className="t-l" data-revele="titre">
            Une belle carte des vins ne se vend pas toute seule.
          </h2>
          <p className="chapeau">
            Sans sommelier en salle, la réponse dépend de qui est là ce soir.
            Elle est souvent approximative, et le vin reste sur la carte.
          </p>
        </div>

        <ul className="constat-maux">
          {MAUX.map((m, i) => (
            <li
              key={m.titre}
              className="verre cst-mal"
              data-lumiere
              data-revele
              style={{ "--i": i } as React.CSSProperties}
            >
              <Pictogramme nom={m.picto} className="cst-picto" />
              <h3 className="t-s">{m.titre}</h3>
              <p className="corps">{m.texte}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
