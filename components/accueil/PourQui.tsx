"use client";

import { useRef, useState } from "react";
import { Pictogramme } from "./Illustrations";

/**
 * VI · POUR QUI : une liste qu'on parcourt du doigt.
 *
 * Quatre maisons, en grand, comme les lignes d'une carte. Celle que l'on
 * survole (ou que l'on touche, ou que l'on atteint au clavier) s'avance,
 * se souligne d'or et ouvre à droite ce que Vintoria fait pour elle. Sur
 * grand écran, un médaillon de verre suit la main avec l'emblème de la
 * maison. La cible première est la première citée : le restaurant qui a
 * une belle carte et personne pour la défendre.
 *
 * Structure d'accordéon accessible : chaque titre porte un bouton qui
 * annonce s'il est ouvert. Sur téléphone, tout est ouvert.
 */

const PROFILS = [
  {
    picto: "bistrot",
    titre: "Le restaurant sans sommelier",
    texte:
      "Une belle carte, une équipe engagée, et personne pour la défendre à chaque table. C’est d’abord pour vous que Vintoria existe.",
    points: ["Accords à table", "Carte composée pour vous", "Alertes de réassort"],
  },
  {
    picto: "gastronomie",
    titre: "La maison gastronomique",
    texte:
      "Votre sommelier ne peut pas être à toutes les tables. Vintoria le relaie en salle, et lui rend le temps de la cave.",
    points: ["Pré-commande", "Analyses des ventes", "Valeur de cave"],
  },
  {
    picto: "hotel",
    titre: "L’hôtel et son restaurant",
    texte:
      "Une clientèle internationale, des services qui s’enchaînent du déjeuner au bar : le même conseil, dans la langue de chacun.",
    points: ["Dans la langue du client", "Carte en cinq langues", "Application de l’équipe"],
  },
  {
    picto: "groupe",
    titre: "Le groupe de restaurants",
    texte:
      "Plusieurs adresses, une même exigence. Les établissements, les équipes et les chiffres réunis au même endroit.",
    points: ["Jusqu’à cinq établissements", "Rôles et permissions", "Intégrations"],
  },
] as const;

export function PourQui() {
  const [actif, setActif] = useState(0);
  const [suivi, setSuivi] = useState(false);
  const liste = useRef<HTMLDivElement>(null);
  const medaillon = useRef<HTMLDivElement>(null);

  const bouger = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !liste.current || !medaillon.current) return;
    const r = liste.current.getBoundingClientRect();
    medaillon.current.style.setProperty("--cx", `${Math.round(e.clientX - r.left)}px`);
    medaillon.current.style.setProperty("--cy", `${Math.round(e.clientY - r.top)}px`);
    if (!suivi) setSuivi(true);
  };

  return (
    <section className="section" aria-labelledby="qui-titre">
      <div className="conteneur">
        <h2 id="qui-titre" className="t-l qui-tete" data-revele="titre">
          Pour les maisons qui ont une carte, et pas toujours quelqu’un pour la défendre.
        </h2>

        <div
          ref={liste}
          className="qui-liste"
          onPointerMove={bouger}
          onPointerLeave={() => setSuivi(false)}
        >
          {PROFILS.map((p, k) => (
            <div
              key={p.titre}
              className="qui-ligne"
              data-actif={k === actif ? "oui" : "non"}
              data-revele
              style={{ "--i": k } as React.CSSProperties}
              onPointerEnter={() => setActif(k)}
            >
              <h3 className="qui-titre">
                <button
                  type="button"
                  aria-expanded={k === actif}
                  aria-controls={`qui-detail-${k}`}
                  onClick={() => setActif(k)}
                  onFocus={() => setActif(k)}
                >
                  <Pictogramme nom={p.picto} className="qui-picto" />
                  <span>{p.titre}</span>
                </button>
              </h3>
              <div id={`qui-detail-${k}`} className="qui-detail">
                <p className="corps">{p.texte}</p>
                <ul className="fct-points">
                  {p.points.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <div ref={medaillon} className="qui-medaillon verre verre--brun" data-suivi={suivi ? "oui" : "non"} aria-hidden>
            {PROFILS.map((p, k) => (
              <Pictogramme
                key={p.titre}
                nom={p.picto}
                className={k === actif ? "qui-embleme qui-embleme--actif" : "qui-embleme"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
