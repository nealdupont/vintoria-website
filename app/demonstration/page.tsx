import type { Metadata } from "next";
import { FormulaireDemonstration } from "@/components/formulaire/FormulaireDemonstration";
import { COURRIEL_CONTACT, INSCRIPTION } from "@/lib/liens";

export const metadata: Metadata = {
  title: "Demander une démonstration",
  description:
    "Vingt minutes, sur votre carte des vins et vos plats. Nous chargeons votre carte avant l’appel. Sans engagement, aucune installation.",
  alternates: { canonical: "/demonstration" },
};

/**
 * LA DÉMONSTRATION. La porte de ceux qui préfèrent qu'on leur montre :
 * un groupe, un hôtel, un restaurateur qui veut un interlocuteur. L'essai
 * gratuit reste proposé à côté, pour qui voudrait commencer tout de suite.
 */

const ETAPES = [
  {
    quand: "Avant l’appel",
    titre: "Vous nous envoyez votre carte",
    texte:
      "Un PDF, une photo, un tableur. Nous la chargeons pour que la démonstration se fasse sur vos vins, pas sur les nôtres.",
  },
  {
    quand: "Vingt minutes",
    titre: "Vous voyez Vintoria à l’œuvre",
    texte:
      "Vos plats d’un côté, vos bouteilles de l’autre, et le conseil qui se forme entre les deux. Vous posez vos questions.",
  },
  {
    quand: "Ensuite",
    titre: "Vous décidez",
    texte:
      "Aucun engagement, aucune installation, aucun matériel. Si ce n’est pas le moment, nous vous le dirons nous-mêmes.",
  },
];

export default function Page() {
  return (
    <>
      <section className="page-tete" aria-labelledby="demo-titre">
        <div className="conteneur">
          <h1 id="demo-titre" className="t-xl" style={{ maxWidth: "14ch" }}>
            Voyez Vintoria sur votre propre carte.
          </h1>
          <p className="chapeau">
            Vingt minutes en visio, sur vos vins et vos plats. Nous chargeons
            votre carte avant l’appel : vous voyez les accords que vos clients
            liraient ce soir.
          </p>
        </div>
      </section>

      <section className="conteneur demo" aria-label="Formulaire de demande">
        <div className="verre demo-formulaire">
          <FormulaireDemonstration />
        </div>

        <aside className="demo-cote">
          <h2>Comment ça se passe</h2>
          <ol>
            {ETAPES.map((e) => (
              <li key={e.quand}>
                <span>{e.quand}</span>
                <h3>{e.titre}</h3>
                <p className="corps">{e.texte}</p>
              </li>
            ))}
          </ol>

          <div className="verre verre--brun demo-essai" data-lumiere>
            <p className="corps">
              Vous préférez essayer seul, tout de suite ? L’essai est gratuit
              et ne demande aucune carte bancaire.
            </p>
            <a className="bouton bouton-or bouton-petit" href={INSCRIPTION}>
              Commencer l’essai gratuit
            </a>
          </div>

          <p className="petit" style={{ marginTop: "1.75rem" }}>
            Ou écrivez-nous :{" "}
            <a className="lien" href={`mailto:${COURRIEL_CONTACT}`}>
              {COURRIEL_CONTACT}
            </a>
          </p>
        </aside>
      </section>
    </>
  );
}
