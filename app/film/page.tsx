import type { Metadata } from "next";
import { Film } from "@/components/film/Film";

/**
 * LA ROUTE DE VALIDATION DU FILM.
 *
 * Le film se construit et se juge ISOLÉMENT avant toute décision sur sa
 * place dans le site. Cette page n'est montée nulle part ailleurs, n'est
 * liée depuis aucune navigation, et n'est pas indexée : elle sert à voir le
 * film dans de vraies conditions — vraie police, vrai fond, vraies largeurs —
 * sans rien changer à l'accueil.
 *
 * Son intégration éventuelle dans `/` sera décidée après validation.
 */

export const metadata: Metadata = {
  title: "Le film",
  description: "Page de validation du film Vintoria. Non référencée.",
  robots: { index: false, follow: false },
};

const SEQUENCES = [
  { t: "0 → 5,5 s", nom: "La carte", dit: "On colle une carte, on analyse, les références sont là." },
  { t: "5,5 → 11 s", nom: "La cave", dit: "Valeur commerciale, valeur d’acquisition, marge, coefficient." },
  { t: "11 → 15,5 s", nom: "Le stock", dit: "Une vente est journalisée, le stock passe de 10 à 9, l’alerte tombe." },
  { t: "15,5 → 20,5 s", nom: "L’inventaire", dit: "Un vrai PDF de quatre pages, généré par le produit." },
  { t: "20,5 → 27 s", nom: "Le client", dit: "Le plat, la couleur, puis la recommandation et sa raison." },
  { t: "27 → 30 s", nom: "La boucle", dit: "Carte, cave, conseil, vente — ce que Vintoria relie." },
  { t: "30 → 32 s", nom: "Vintoria", dit: "La sortie." },
];

export default function Page() {
  return (
    <>
      <section className="px rythme">
        <div className="mx-auto max-w-[1180px]">
          <p className="eyebrow mb-6">Validation</p>
          <h1 className="voix t-titre max-w-[18ch] text-balance text-fort">
            La démonstration, isolée.
          </h1>
          <p className="t-chapeau mt-6 max-w-[54ch] text-texte">
            Trente-deux secondes, sept séquences, un argument chacune. Cette page n’est
            liée depuis aucune navigation et n’est pas indexée : elle sert à juger
            la démonstration avant de décider de sa place.
          </p>
        </div>
      </section>

      <section className="px pb-16">
        <div className="mx-auto max-w-[1180px]">
          <Film />
        </div>
      </section>

      <section className="px pb-28">
        <div className="mx-auto max-w-[1180px] border-t border-filet pt-12">
          <p className="eyebrow mb-8">Les sept séquences</p>
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SEQUENCES.map((r) => (
              <li key={r.nom} className="border-t border-filet pt-5">
                <p className="data t-meta text-accent">{r.t}</p>
                <h2 className="voix t-tete mt-1.5 text-fort">{r.nom}</h2>
                <p className="t-corps mt-2 text-texte">{r.dit}</p>
              </li>
            ))}
          </ol>
          <p className="t-meta mt-12 max-w-[64ch] text-faible">
            Tous les écrans sont de vraies captures de Vintoria Pro, prises sur
            l’établissement de démonstration (15 références, 179 bouteilles). Le
            PDF d’inventaire est réellement généré par le produit. Les montants
            sont ceux que le logiciel calcule sur cette cave : ce sont des données
            de démonstration, jamais une moyenne ni une performance. Aucun
            pourcentage de chiffre d’affaires n’est avancé — nous n’en avons pas.
          </p>
        </div>
      </section>
    </>
  );
}
