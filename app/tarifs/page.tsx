import type { Metadata } from "next";
import { CHAPITRES, FORMULES } from "@/lib/formules";
import { CATALOGUE_PRODUIT, configurationComplete } from "@/lib/tarifs";
import { CartesFormules } from "@/components/site/Formules";
import { Questions, type Question } from "@/components/site/Questions";
import { AppelFinal } from "@/components/site/AppelFinal";
import { Coche } from "@/components/accueil/Illustrations";

export const metadata: Metadata = {
  title: "Formules",
  description:
    "Essentiel, Business, Enterprise : le conseil à chaque table dans les trois, la gestion de cave et l’organisation à plusieurs adresses au-dessus. Essai gratuit, sans carte bancaire.",
  alternates: { canonical: "/tarifs" },
};

/**
 * L'AVIS DE DÉVELOPPEMENT. Il rappelle, en local seulement, que les tarifs
 * ne sont pas publiés et ce qu'il manque pour qu'ils le soient. Un test
 * vérifie qu'il ne part jamais en production.
 */
function AvisDeveloppement() {
  if (process.env.NODE_ENV !== "development") return null;
  const { valide, manques } = configurationComplete();
  return (
    <div className="conteneur" style={{ paddingTop: "7rem" }}>
      <div data-test="avis-tarifs" className="verre" style={{ padding: "1.25rem 1.5rem", borderRadius: 18 }}>
        <p className="petit">
          <strong className="fort">Tarifs en attente.</strong> La page rend « Tarif sur demande ». Le
          catalogue du produit porte Essentiel {CATALOGUE_PRODUIT.essential} €, Business{" "}
          {CATALOGUE_PRODUIT.business} €, Enterprise sur devis, mais la facturation n’est pas branchée.
        </p>
        <p className="petit" style={{ marginTop: 6 }}>
          {valide
            ? "La configuration est complète : il ne reste qu’à signer, en passant PRIX_CONFIRMES à true."
            : `Il manque, dans lib/tarifs.ts : ${Object.entries(manques)
                .map(([cle, m]) => `${cle} (${(m as string[]).join(", ")})`)
                .join(" ; ")}.`}
        </p>
      </div>
    </div>
  );
}

const QUESTIONS_TARIFS: Question[] = [
  {
    q: "L’essai est-il vraiment gratuit ?",
    r: "Oui. Vous créez votre espace avec une adresse e-mail, sans carte bancaire. Vous importez votre carte, vous voyez les accords, et vous décidez ensuite.",
  },
  {
    q: "Quelle formule choisir ?",
    r: "Si vous voulez d’abord le conseil à table, l’Essentiel suffit. Si vous voulez aussi tenir votre cave (stocks, inventaires, valeur, alertes), prenez la Business. Au-delà d’une adresse, parlons de l’Enterprise.",
  },
  {
    q: "Quand connaîtrai-je le tarif ?",
    r: "Avant tout engagement. Écrivez-nous ou demandez une démonstration : nous vous communiquons le tarif adapté à votre établissement.",
  },
];

export default function Page() {
  return (
    <>
      <AvisDeveloppement />

      <section className="page-tete" aria-labelledby="tarifs-titre">
        <div className="conteneur">
          <div className="formules-tete">
            <h1 id="tarifs-titre" className="t-xl">
              Une formule pour chaque maison.
            </h1>
            <p className="chapeau">
              Le conseil à chaque table est compris dans les trois : c’est le
              cœur de Vintoria. Au-dessus viennent la gestion de votre cave,
              puis l’organisation de plusieurs adresses.
            </p>
          </div>
          <h2 className="sr-only">Les trois formules</h2>
          <CartesFormules revele={false} />
        </div>
      </section>

      <section className="section" aria-labelledby="comparatif-titre" style={{ paddingTop: 0 }}>
        <div className="conteneur comparatif">
          <h2 id="comparatif-titre" className="t-l">
            Le détail, ligne à ligne.
          </h2>
          <div className="verre comparatif-defile" style={{ marginTop: "2.5rem" }}>
            <table>
              <caption className="sr-only">Ce que comprend chaque formule</caption>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">Fonction</span>
                  </th>
                  {FORMULES.map((f) => (
                    <th key={f.cle} scope="col">
                      {f.nom}
                    </th>
                  ))}
                </tr>
              </thead>
              {CHAPITRES.map((ch) => (
                <tbody key={ch.titre}>
                  <tr className="chapitre-ligne">
                    <th scope="colgroup" colSpan={FORMULES.length + 1}>
                      {ch.titre}
                      <span>{ch.intro}</span>
                    </th>
                  </tr>
                  {ch.lignes.map((l) => (
                    <tr key={l.intitule}>
                      <th scope="row">{l.intitule}</th>
                      {FORMULES.map((f) => {
                        const v = l.valeurs[f.cle];
                        if (v === null)
                          return (
                            <td key={f.cle} className="vide">
                              <span aria-hidden>—</span>
                              <span className="sr-only">Non compris</span>
                            </td>
                          );
                        if (v === "Compris")
                          return (
                            <td key={f.cle}>
                              <Coche />
                              <span className="sr-only">Compris</span>
                            </td>
                          );
                        return <td key={f.cle}>{v}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>

      <Questions questions={QUESTIONS_TARIFS} titre="Avant de vous lancer" />

      <AppelFinal titre="Essayez Vintoria sur votre propre carte." />
    </>
  );
}
