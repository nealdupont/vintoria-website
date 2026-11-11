"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * L'ACCORD : la carte de verre de l'ouverture.
 *
 * Ce n'est pas une capture de l'application. C'est ce que Vintoria produit,
 * posé comme un sommelier le dirait : un plat, un vin de la carte, et la
 * raison. Quatre accords classiques défilent ; chacun est juste, parce
 * qu'un restaurateur le verra.
 *
 * Le défilement s'arrête au survol et au focus, et ne démarre jamais en
 * mouvement réduit : les quatre boutons suffisent alors.
 */

const ACCORDS = [
  {
    plat: "Saint-Jacques snackées, beurre noisette",
    vin: "Meursault",
    detail: "Bourgogne blanc, 2020",
    raison:
      "Le gras du beurre noisette appelle la rondeur du chardonnay ; sa fraîcheur garde la Saint-Jacques nette.",
  },
  {
    plat: "Pigeon rôti, jus corsé",
    vin: "Pommard 1er Cru",
    detail: "Bourgogne rouge, 2018",
    raison:
      "Un pinot noir de structure : assez de tanin pour tenir le jus, assez de fruit pour la chair rosée.",
  },
  {
    plat: "Comté affiné 24 mois",
    vin: "Château-Chalon",
    detail: "Vin jaune du Jura, 2015",
    raison:
      "Les notes de noix du vin jaune prolongent celles du comté. Le même terroir, réuni à table.",
  },
  {
    plat: "Tarte au citron meringuée",
    vin: "Jurançon moelleux",
    detail: "Sud-Ouest, 2021",
    raison:
      "L’acidité du petit manseng répond au citron, sa douceur fait écho à la meringue.",
  },
];

/**
 * Un mot composé ne se coupe jamais à son trait d'union : « Saint- » en
 * fin de ligne et « Jacques » au début de la suivante, c'est une faute de
 * composition qu'un lecteur de carte voit tout de suite.
 */
function insecable(texte: string) {
  return texte.split(" ").map((mot, k) => (
    <span key={k}>
      {k > 0 ? " " : null}
      {mot.includes("-") ? <span style={{ whiteSpace: "nowrap" }}>{mot}</span> : mot}
    </span>
  ));
}

const DUREE = 6500;
const REQUETE = "(prefers-reduced-motion: reduce)";

function abonner(rappel: () => void) {
  const m = window.matchMedia(REQUETE);
  m.addEventListener("change", rappel);
  return () => m.removeEventListener("change", rappel);
}

export function Accord() {
  const reduit = useSyncExternalStore(
    abonner,
    () => window.matchMedia(REQUETE).matches,
    () => false,
  );
  const [i, setI] = useState(0);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (reduit || pause) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % ACCORDS.length), DUREE);
    return () => window.clearTimeout(t);
  }, [i, pause, reduit]);

  const a = ACCORDS[i];

  return (
    <figure
      className="verre verre--brun accord accord-arrivee"
      style={{ "--duree": `${DUREE}ms` } as React.CSSProperties}
      data-lumiere
      data-auto={reduit ? "non" : "oui"}
      data-pause={pause ? "oui" : "non"}
      onPointerEnter={() => setPause(true)}
      onPointerLeave={() => setPause(false)}
      onFocus={() => setPause(true)}
      onBlur={() => setPause(false)}
      aria-label="Exemples d’accords proposés par Vintoria"
    >
      <span className="accord-lisere" aria-hidden />
      <div className="accord-tete">
        <span>Exemple d’accord</span>
      </div>

      <div className="accord-contenu" key={i}>
        <div>
          <span className="accord-legende">Le plat</span>
          <p className="accord-plat">{insecable(a.plat)}</p>
        </div>
        <div className="accord-fil" aria-hidden />
        <div>
          <span className="accord-legende">Le vin de votre carte</span>
          <p className="accord-vin">{a.vin}</p>
          <p className="accord-detail">{a.detail}</p>
        </div>
        <blockquote className="accord-raison">« {insecable(a.raison)} »</blockquote>
      </div>

      <div className="accord-pas">
        {ACCORDS.map((x, n) => (
          <button
            key={x.vin}
            type="button"
            aria-label={`Accord ${n + 1} : ${x.plat} et ${x.vin}`}
            aria-current={n === i}
            onClick={() => setI(n)}
          />
        ))}
      </div>
    </figure>
  );
}
