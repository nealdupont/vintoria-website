import type { Metadata } from "next";
import Link from "next/link";
import {
  CHAPITRES,
  FORMULES,
  PRIX_CONFIRMES,
  PRIX_TROUVES,
  type CleFormule,
} from "@/lib/formules";

export const metadata: Metadata = {
  title: "Formules",
  description:
    "Trois formules : le conseil à chaque table, la gestion de cave, l’organisation à plusieurs adresses. Le détail de ce que chacune comprend.",
  alternates: { canonical: "/tarifs" },
};

/* ------------------------------------------------------------------ */

/**
 * Le prix n'est pas publié tant qu'il n'est pas confirmé commercialement.
 * « Sur demande » est une réponse honnête en vente B2B ; un chiffre inventé
 * ne l'est pas. En développement, l'attente est signalée franchement pour
 * que personne ne croie la page terminée.
 */
function Prix({ cle }: { cle: CleFormule }) {
  if (PRIX_CONFIRMES && PRIX_TROUVES[cle] !== null) {
    return (
      <p className="voix mt-5 text-[2.6rem] leading-none text-fort">
        {PRIX_TROUVES[cle]}&nbsp;€
        <span className="t-meta ml-2 align-middle font-sans text-faible">/ mois</span>
      </p>
    );
  }
  return (
    <p className="voix mt-5 text-[1.9rem] leading-none text-fort">
      Sur demande
      <span className="t-meta mt-2 block font-sans text-faible">
        Communiqué pendant la démonstration
      </span>
    </p>
  );
}

function AvisDeveloppement() {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <div className="px pt-6">
      <p
        className="mx-auto max-w-[1180px] rounded-xl border border-dashed border-braise-vive bg-braise/15 px-5 py-4 text-left"
        data-test="avis-tarifs"
      >
        <span className="eyebrow block text-braise-vive">Développement — prix non publiés</span>
        <span className="t-meta mt-2 block text-texte">
          La page rend « Sur demande ». Le catalogue du produit porte
          Essentiel&nbsp;{PRIX_TROUVES.essential}&nbsp;€, Business&nbsp;
          {PRIX_TROUVES.business}&nbsp;€, Enterprise sur devis, mais
          <code className="mx-1 text-fort">STRIPE_PRICES</code>y est entièrement
          <code className="mx-1 text-fort">null</code>: la facturation n’est pas branchée.
          Basculer <code className="mx-1 text-fort">PRIX_CONFIRMES</code>dans
          <code className="mx-1 text-fort">lib/formules.ts</code>une fois la grille arrêtée.
        </span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function Page() {
  return (
    <>
      <AvisDeveloppement />

      <section className="px rythme">
        <div className="mx-auto max-w-[1180px]">
          <p className="eyebrow mb-6">Les formules</p>
          <h1 className="voix t-display max-w-[17ch] text-balance text-fort">
            Une carte lisible, comme la vôtre.
          </h1>
          <p className="t-chapeau mt-7 max-w-[56ch] text-texte">
            Toutes les formules comprennent le conseil à chaque table : c’est le cœur
            de Vintoria et il n’est jamais optionnel. Ce qui change au-dessus, c’est
            la gestion de votre cave, puis l’organisation de vos équipes.
          </p>
        </div>
      </section>

      {/* ── Les trois entêtes ─────────────────────────────────────────── */}
      <section className="px pb-8" aria-labelledby="titre-formules">
        <h2 id="titre-formules" className="sr-only">
          Les trois formules
        </h2>
        <ul className="mx-auto grid max-w-[1180px] gap-px overflow-hidden rounded-2xl border border-filet bg-filet md:grid-cols-3">
          {FORMULES.map((f) => (
            <li
              key={f.cle}
              className="relative flex flex-col bg-encre p-7 lg:p-8"
              data-formule={f.cle}
            >
              {f.recommandee ? (
                <span className="eyebrow absolute right-7 top-7 text-accent lg:right-8 lg:top-8">
                  Conseillée
                </span>
              ) : null}
              <h3 className="voix t-tete text-fort">{f.nom}</h3>
              <p className="t-meta mt-2 text-faible">{f.pourQui}</p>
              <Prix cle={f.cle} />
              <p className="t-corps mt-5 flex-1 text-texte">{f.promesse}</p>
              <Link
                href="/demonstration"
                className={`bouton mt-7 ${f.recommandee ? "bouton-primaire" : "bouton-second"}`}
              >
                {f.recommandee ? "Demander une démonstration" : "En parler"}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Le détail, en lecture de carte ────────────────────────────── */}
      {CHAPITRES.map((chapitre) => (
        <section key={chapitre.titre} className="px pb-14" aria-labelledby={`c-${chapitre.titre}`}>
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-7 border-t border-filet pt-7">
              <h2 id={`c-${chapitre.titre}`} className="voix t-tete text-fort">
                {chapitre.titre}
              </h2>
              <p className="t-corps mt-1.5 max-w-[60ch] text-texte">{chapitre.intro}</p>
            </div>

            {/* Lecture large : les trois formules côte à côte. */}
            <table className="hidden w-full border-collapse md:table">
              <thead>
                <tr>
                  <th scope="col" className="sr-only">
                    Prestation
                  </th>
                  {FORMULES.map((f) => (
                    <th
                      key={f.cle}
                      scope="col"
                      className="eyebrow w-[16%] pb-4 text-left font-medium"
                    >
                      {f.nom}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chapitre.lignes.map((l) => (
                  <tr key={l.intitule} className="border-t border-filet">
                    <th scope="row" className="t-corps py-3.5 pr-8 text-left font-normal text-texte">
                      {l.intitule}
                    </th>
                    {FORMULES.map((f) => {
                      const v = l.valeurs[f.cle];
                      return (
                        <td key={f.cle} className="t-corps py-3.5 align-middle">
                          {v === null ? (
                            <span className="text-faible/60" aria-label="Non compris">
                              —
                            </span>
                          ) : (
                            <span className={v === "Compris" ? "text-fort" : "data text-fort"}>
                              {v}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {/*
              Lecture étroite : une ligne par prestation, et les trois valeurs
              SEULEMENT quand elles diffèrent. Répéter la liste pour chaque
              formule faisait lire trois fois la même chose à qui tient son
              téléphone — et doublait la hauteur de la page pour rien.
            */}
            <ul className="flex flex-col md:hidden">
              {chapitre.lignes.map((l) => {
                const vues = FORMULES.map((f) => l.valeurs[f.cle]);
                const partout = vues.every((v) => v === vues[0]);
                return (
                  <li key={l.intitule} className="border-b border-filet py-3.5">
                    <div className="flex items-baseline justify-between gap-5">
                      <span className="t-corps text-texte">{l.intitule}</span>
                      {partout ? (
                        <span className="t-corps shrink-0 text-right text-fort">
                          {vues[0] === null ? "—" : vues[0]}
                        </span>
                      ) : null}
                    </div>
                    {partout ? null : (
                      <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                        {FORMULES.map((f) => (
                          <div key={f.cle} className="flex items-baseline gap-1.5">
                            <dt className="eyebrow">{f.nom}</dt>
                            <dd
                              className={`t-meta ${
                                l.valeurs[f.cle] === null ? "text-faible/60" : "text-fort"
                              }`}
                            >
                              {l.valeurs[f.cle] ?? "—"}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ))}

      {/* ── Ce que ça remplace ────────────────────────────────────────── */}
      <section className="px rythme">
        <div className="mx-auto max-w-[1180px] border-t border-filet pt-14">
          <h2 className="voix t-titre max-w-[20ch] text-balance text-fort">
            Ce que Vintoria coûte, et ce qu’il remplace.
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {[
              {
                titre: "Un sommelier ne se démultiplie pas",
                texte:
                  "Il ne peut pas être à la table 12 et à la table 4 en même temps. Vintoria lui donne le don d’ubiquité, sans ajouter une personne au planning.",
              },
              {
                titre: "Une cave tenue à la main",
                texte:
                  "L’inventaire du dimanche, le tableur qui dérive, la carte réimprimée pour trois changements. Le temps que ça prend a un coût, lui aussi.",
              },
              {
                titre: "Les bouteilles qui dorment",
                texte:
                  "Une poignée de références fait l’essentiel des ventes pendant que le reste immobilise votre trésorerie. Chaque plat rend une autre partie de la carte pertinente.",
              },
            ].map((b) => (
              <div key={b.titre} className="parait">
                <h3 className="voix t-tete text-fort">{b.titre}</h3>
                <p className="t-corps mt-3 text-texte">{b.texte}</p>
              </div>
            ))}
          </div>
          <p className="t-meta mt-12 max-w-[62ch] text-faible">
            Nous ne promettons pas un pourcentage. Nous branchons Vintoria sur votre
            carte, et vous regardez vos propres chiffres bouger.
          </p>
        </div>
      </section>

      {/* ── Passage à l'acte ──────────────────────────────────────────── */}
      <section className="px pb-28">
        <div className="mx-auto flex max-w-[1180px] flex-col items-start gap-7 rounded-2xl border border-filet p-9 sm:p-12">
          <h2 className="voix t-citation max-w-[20ch] text-balance text-fort">
            Commencez par voir Vintoria sur votre propre carte.
          </h2>
          <Link href="/demonstration" className="bouton bouton-primaire">
            Demander une démonstration
          </Link>
          <p className="t-meta text-faible">
            Vingt minutes · réponse sous 24 h · sans engagement
          </p>
        </div>
      </section>
    </>
  );
}
