import type { ReactNode } from "react";
import {
  Cadran,
  CarteImprimee,
  Casier,
  Courbe,
  Langues,
  Pictogramme,
  Reservation,
  Table,
  Telephone,
} from "./Illustrations";

/**
 * IV · LES FONCTIONNALITÉS.
 *
 * Rangées comme le restaurateur pense sa maison : la salle, la cave, la
 * carte. Chaque panneau dit d'abord ce que la fonction CHANGE pour lui, puis
 * comment. Les tailles ne sont pas égales parce que les fonctions ne le
 * sont pas : le conseil à table et la cave portent le produit, les autres
 * les prolongent.
 *
 * Les verres changent avec le lieu : brun pour la salle (le bois, la
 * lumière basse), vert pour la cave (la bouteille), clair pour le papier.
 */

type Panneau = {
  titre: string;
  texte: string;
  illu: ReactNode;
  taille: "majeure" | "mineure" | "demi";
  verre: "brun" | "vert" | "clair";
  points?: string[];
  droite?: boolean;
};

type Chapitre = {
  id: string;
  nom: string;
  titre: string;
  intro: string;
  panneaux: Panneau[];
};

const CHAPITRES: Chapitre[] = [
  {
    id: "salle",
    nom: "En salle",
    titre: "Le conseil d’un sommelier, à chaque table",
    intro: "Ce que vos clients vivent, du premier regard sur la carte au vin servi.",
    panneaux: [
      {
        titre: "Des accords mets-vins expliqués à vos clients",
        texte:
          "Vos clients scannent le QR code posé sur la table, choisissent leur plat et ce dont ils ont envie. Vintoria leur propose les vins de votre carte qui l’accompagnent, et leur dit pourquoi, en mots simples. Ils comprennent, ils choisissent, ils commandent.",
        illu: <Table />,
        taille: "majeure",
        verre: "brun",
        points: ["Uniquement vos vins", "Selon vos stocks", "Aucune application à installer"],
      },
      {
        titre: "La pré-commande depuis la table",
        texte:
          "Le client réserve sa bouteille depuis le QR code, avant même que le serveur arrive. Le choix est fait, la vente ne se perd plus entre deux allers et retours.",
        illu: <Reservation />,
        taille: "mineure",
        verre: "vert",
      },
      {
        titre: "Dans la langue de chaque client",
        texte:
          "Le conseil se lit dans la langue de votre client. Vos tables étrangères commandent avec la même assurance que les autres.",
        illu: <Langues />,
        taille: "mineure",
        verre: "clair",
      },
    ],
  },
  {
    id: "cave",
    nom: "En cave",
    titre: "Une cave tenue sans y penser",
    intro: "Ce que vous et votre équipe gagnez, loin des tables.",
    panneaux: [
      {
        titre: "Stocks, inventaires et alertes de réassort",
        texte:
          "Chaque bouteille est suivie, millésime par millésime : entrées, sorties, inventaires. Une alerte vous prévient avant la rupture, pas au milieu du service. Et une bouteille épuisée sort d’elle-même des accords.",
        illu: <Casier />,
        taille: "majeure",
        verre: "vert",
        points: ["Mouvements de stock", "Inventaires", "Seuils d’alerte", "Export PDF"],
        droite: true,
      },
      {
        titre: "La valeur de votre cave, et votre marge",
        texte:
          "Ce que vaut votre cave au prix d’achat et au prix de carte, la marge bouteille par bouteille. Vous savez ce qui dort, et ce que cela vous coûte.",
        illu: <Cadran />,
        taille: "mineure",
        verre: "clair",
      },
      {
        titre: "L’application mobile de l’équipe",
        texte:
          "Les tâches du jour, la remontée de cave, le réassort : votre équipe pilote la cave depuis son téléphone, sans passer par l’ordinateur.",
        illu: <Telephone />,
        taille: "mineure",
        verre: "brun",
      },
    ],
  },
  {
    id: "carte",
    nom: "Sur la carte",
    titre: "Une carte qui se compose, des chiffres qui se lisent",
    intro: "Ce que vos clients tiennent en main, et ce que vous en apprenez.",
    panneaux: [
      {
        titre: "Votre carte des vins, composée pour vous",
        texte:
          "Vintoria met en page votre carte à partir de votre cave. Vous choisissez le classement, le format et le style ; vous récupérez un PDF prêt à imprimer, toujours à jour.",
        illu: <CarteImprimee />,
        taille: "majeure",
        verre: "brun",
        points: ["Par couleur, région ou appellation", "A4 ou A5", "Classique, contemporain, premium", "Cinq langues"],
      },
      {
        titre: "Des analyses qui font vendre",
        texte:
          "Ce qui part, ce qui dort, ce que vos clients choisissent avec quels plats. Vous ajustez votre carte et mettez en avant les bouteilles à faire tourner.",
        illu: <Courbe />,
        taille: "mineure",
        verre: "vert",
      },
      {
        titre: "Plusieurs adresses, une seule cave à piloter",
        texte:
          "Jusqu’à cinq établissements, une équipe aux rôles distincts, et l’accès aux intégrations pour relier Vintoria à vos outils.",
        illu: <Pictogramme nom="groupe" className="fct-picto" />,
        taille: "mineure",
        verre: "clair",
      },
    ],
  },
];

const CLASSE_VERRE = {
  brun: "verre verre--brun",
  vert: "verre verre--vert",
  clair: "verre",
} as const;

export function Fonctionnalites() {
  return (
    <section id="fonctionnalites" className="section" aria-labelledby="fct-titre">
      <div className="conteneur">
        <div className="fct-tete">
          <h2 id="fct-titre" className="t-l" data-revele="titre">
            Tout ce qu’un sommelier ferait pour votre maison.
          </h2>
          <p className="chapeau">
            Vintoria travaille à trois endroits : en salle avec vos clients, en
            cave avec votre équipe, et sur la carte que vous leur tendez.
          </p>
        </div>

        {CHAPITRES.map((ch) => (
          <div key={ch.id} className="fct-chapitre">
            <div className="fct-chapitre-tete">
              <div>
                <span className="chapitre">{ch.nom}</span>
                <h3 id={`fct-${ch.id}`} data-revele="titre">
                  {ch.titre}
                </h3>
              </div>
              <p>{ch.intro}</p>
              <span className="fct-chapitre-fil" data-revele="fil" aria-hidden />
            </div>

            <div className="fct-grille">
              {ch.panneaux.map((p, i) => (
                <article
                  key={p.titre}
                  data-lumiere
                  data-revele
                  style={{ "--i": i } as React.CSSProperties}
                  className={[
                    CLASSE_VERRE[p.verre],
                    "fct",
                    `fct--${p.taille}`,
                    p.droite ? "fct--droite" : "",
                  ].join(" ")}
                >
                  {p.illu ? <div className="fct-illu">{p.illu}</div> : null}
                  <h4>{p.titre}</h4>
                  <p>{p.texte}</p>
                  {p.points ? (
                    <ul className="fct-points">
                      {p.points.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
