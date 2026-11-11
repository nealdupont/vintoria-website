"use client";

import { useEffect, useRef, useState } from "react";
import { INSCRIPTION } from "@/lib/liens";
import { Pictogramme } from "./Illustrations";

/**
 * V · CE QUE VOUS Y GAGNEZ.
 *
 * Six résultats que le restaurateur peut constater lui-même, sans chiffre
 * promis : le site n'annonce aucune performance qu'aucun client n'a encore
 * mesurée.
 *
 * LA LECTURE EST ÉCLAIRÉE. Le bénéfice qui passe au centre de l'écran
 * s'allume (titre en crème, pictogramme en or), les autres restent dans la
 * pénombre ; un fil d'or descend le long de la liste. On lit comme à la
 * bougie : une ligne à la fois. Le titre reste épinglé, la porte d'entrée
 * toujours à portée de main.
 */

const BENEFICES = [
  {
    picto: "vente",
    titre: "Vous vendez plus de vin.",
    texte:
      "Un client qui comprend pourquoi un vin accompagne son plat le choisit plus volontiers, et se laisse plus facilement guider vers la bouteille.",
  },
  {
    picto: "equipe",
    titre: "Chaque serveur conseille avec assurance.",
    texte:
      "Le nouveau de la semaine comme l’extra du samedi soir s’appuient sur le même conseil, juste et expliqué. Plus besoin de connaître toute la carte par cœur.",
  },
  {
    picto: "cave",
    titre: "Votre cave travaille pour vous.",
    texte:
      "Les bouteilles que vous voulez voir partir remontent dans les accords. Les ruptures se voient venir, les références qui dorment aussi.",
  },
  {
    picto: "temps",
    titre: "Vous reprenez des heures sur la semaine.",
    texte:
      "Inventaire, réassort, mise à jour de la carte : le travail administratif du vin se fait en quelques gestes, depuis l’ordinateur ou le téléphone.",
  },
  {
    picto: "image",
    titre: "Votre maison gagne en prestance.",
    texte:
      "Une carte des vins élégante, un conseil précis, dans la langue de chacun. Vos clients le remarquent, et s’en souviennent.",
  },
  {
    picto: "sommelier",
    titre: "Sans recruter de sommelier.",
    texte:
      "L’expertise d’un sommelier à chaque table et à chaque service, pour le prix d’un abonnement.",
  },
] as const;

export function Benefices() {
  const liste = useRef<HTMLDivElement>(null);
  const [actif, setActif] = useState(0);

  useEffect(() => {
    const el = liste.current;
    if (!el) return;
    let image = 0;
    const lire = () => {
      image = 0;
      const items = [...el.querySelectorAll<HTMLElement>("li")];
      const centre = window.innerHeight * 0.5;
      let meilleur = 0;
      let ecart = Infinity;
      items.forEach((li, k) => {
        const r = li.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - centre);
        if (d < ecart) {
          ecart = d;
          meilleur = k;
        }
      });
      setActif(meilleur);
      const r = el.getBoundingClientRect();
      const p = (centre - r.top) / Math.max(r.height, 1);
      el.style.setProperty("--p", Math.min(Math.max(p, 0), 1).toFixed(4));
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

  return (
    <section id="benefices" className="section" aria-labelledby="ben-titre">
      <div className="conteneur ben">
        <div className="ben-tete">
          <h2 id="ben-titre" className="t-l" data-revele="titre">
            Ce que Vintoria change pour votre maison.
          </h2>
          <p className="chapeau">
            Un sommelier ne se contente pas de conseiller : il fait vendre,
            il forme la salle, il tient la cave. Vintoria fait les trois, sans
            jamais quitter le service.
          </p>
          <a className="bouton bouton-or" href={INSCRIPTION}>
            Commencer l’essai gratuit
          </a>
        </div>

        <div ref={liste} className="ben-liste-cadre">
          <span className="ben-fil" aria-hidden />
          <ul className="ben-liste">
          {BENEFICES.map((b, k) => (
            <li key={b.titre} data-actif={k === actif ? "oui" : "non"}>
              <span className="ben-picto-cadre">
                <Pictogramme nom={b.picto} className="ben-picto" />
              </span>
              <div>
                <h3>{b.titre}</h3>
                <p className="corps">{b.texte}</p>
              </div>
            </li>
          ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
