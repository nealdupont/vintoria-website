"use client";

import { useEffect, useRef, useState } from "react";
import { VignetteImport, VignettePlats, VignetteQr, VignetteVerre } from "./Vignettes";

/**
 * III · COMMENT ÇA MARCHE, en scène épinglée.
 *
 * Sur grand écran, la section s'arrête à l'écran pendant qu'on défile : à
 * gauche les quatre étapes, à droite une scène de verre où se joue l'étape
 * en cours. Le défilement fait avancer le récit, un fil d'or descend le
 * long des étapes. C'est une vraie séquence, donc des numéros, en chiffres
 * romains comme sur une carte de cave.
 *
 * Sur téléphone, rien n'est épinglé : chaque étape porte sa vignette, dans
 * l'ordre, et se joue quand elle passe à l'écran.
 */

const ETAPES = [
  {
    n: "I",
    titre: "Importez votre carte",
    texte:
      "Un PDF, une photo ou un simple texte. Vintoria reconnaît chaque vin, son appellation, son millésime et son prix. Aucune ressaisie.",
    qui: "Vous, une seule fois",
    Vignette: VignetteImport,
  },
  {
    n: "II",
    titre: "Ajoutez vos plats",
    texte:
      "Vos entrées, vos plats, vos desserts. Vintoria prépare pour chacun les accords avec les vins que vous avez réellement.",
    qui: "Vous, à chaque nouvelle carte",
    Vignette: VignettePlats,
  },
  {
    n: "III",
    titre: "Posez le QR code sur vos tables",
    texte:
      "Vintoria vous fournit un code prêt à imprimer. Pas d’application à installer pour vos clients, pas de compte à créer.",
    qui: "Vous, avant le service",
    Vignette: VignetteQr,
  },
  {
    n: "IV",
    titre: "Vos clients choisissent leur vin",
    texte:
      "Ils scannent, choisissent leur plat et leurs envies, et découvrent le vin qui l’accompagne, expliqué comme le ferait un sommelier.",
    qui: "Vos clients, à chaque service",
    Vignette: VignetteVerre,
  },
];

export function Etapes() {
  const piste = useRef<HTMLDivElement>(null);
  const [actif, setActif] = useState(0);

  useEffect(() => {
    const el = piste.current;
    if (!el) return;
    let image = 0;
    const lire = () => {
      image = 0;
      const r = el.getBoundingClientRect();
      const course = r.height - window.innerHeight;
      if (course <= 0) return;
      const p = Math.min(Math.max(-r.top / course, 0), 1);
      el.style.setProperty("--p", p.toFixed(4));
      setActif(Math.min(ETAPES.length - 1, Math.floor(p * ETAPES.length * 0.999)));
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
    <section className="etp" aria-labelledby="etapes-titre">
      <div ref={piste} className="etp-piste">
        <div className="conteneur etp-ecran">
          <div className="etp-gauche">
            <h2 id="etapes-titre" className="t-l" data-revele="titre">
              En place avant le prochain service.
            </h2>
            <p className="chapeau">
              Aucun matériel, aucune installation, aucune formation de
              l’équipe. Quatre étapes, dont trois que vous ne faites qu’une fois.
            </p>

            <div className="etp-liste-cadre">
              <span className="etp-fil" aria-hidden />
              <ol className="etp-liste">
                {ETAPES.map((e, k) => (
                  <li
                    key={e.n}
                    className="etp-etape"
                    data-actif={k === actif ? "oui" : "non"}
                    data-passe={k < actif ? "oui" : "non"}
                  >
                    <span className="etp-chiffre" aria-hidden>
                      {e.n}
                    </span>
                    <div className="etp-corps">
                      <h3>{e.titre}</h3>
                      <div className="etp-detail">
                        <div>
                          <p className="corps">{e.texte}</p>
                          <span className="etp-qui">{e.qui}</span>
                        </div>
                      </div>
                      <div className="etp-vignette-mobile verre" data-actif="oui">
                        <e.Vignette p={`vgm${k}`} />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="etp-droite" aria-hidden>
            <div className="verre verre--brun etp-scene" data-lumiere>
              {ETAPES.map((e, k) => (
                <div key={e.n} className="etp-tableau" data-actif={k === actif ? "oui" : "non"}>
                  <e.Vignette p={`vgs${k}`} />
                </div>
              ))}
              <div className="etp-compteur">
                <span>{ETAPES[actif].n}</span>
                <span className="etp-compteur-sur">sur IV</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
