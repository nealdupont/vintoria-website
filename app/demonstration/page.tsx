import type { Metadata } from "next";
import Link from "next/link";
import { FormulaireDemonstration } from "@/components/formulaire/FormulaireDemonstration";

export const metadata: Metadata = {
  title: "Demander une démonstration",
  description:
    "Vingt minutes, sur votre carte des vins et vos plats. Nous chargeons votre carte avant l’appel. Sans engagement, aucune installation.",
  alternates: { canonical: "/demonstration" },
};

const ETAPES = [
  {
    quand: "Avant",
    titre: "Vous nous envoyez votre carte",
    texte:
      "Un PDF, une photo, un tableur. Nous la chargeons pour que la démonstration se fasse sur vos vins, pas sur les nôtres.",
  },
  {
    quand: "20 min",
    titre: "Nous vous montrons Vintoria à l’œuvre",
    texte:
      "Vos plats d’un côté, vos bouteilles de l’autre, et le conseil qui se forme entre les deux. Vous posez vos questions.",
  },
  {
    quand: "Après",
    titre: "Vous décidez",
    texte:
      "Aucun engagement, aucune installation, aucun matériel. Si ce n’est pas le moment, nous vous le dirons nous-mêmes.",
  },
];

export default function Page() {
  return (
    <>
      <section className="px rythme-ample">
        <div className="mx-auto max-w-[1180px]">
          <p className="eyebrow mb-6">La démonstration</p>
          <h1 className="voix t-display max-w-[16ch] text-balance text-fort">
            Vingt minutes, sur votre carte.
          </h1>
          <p className="t-chapeau mt-7 max-w-[52ch] text-texte">
            Nous chargeons vos vins et vos plats avant l’appel. Vous voyez Vintoria
            travailler sur votre établissement, pas sur une démonstration préparée.
          </p>
        </div>
      </section>

      <section className="px pb-24">
        <div className="mx-auto grid max-w-[1180px] gap-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
          <div className="parait">
            <FormulaireDemonstration />
          </div>

          <aside className="parait">
            <h2 className="eyebrow mb-8">Comment ça se passe</h2>
            <ol className="flex flex-col gap-9">
              {ETAPES.map((e) => (
                <li key={e.quand} className="border-l border-filet pl-5">
                  <p className="data t-meta mb-2 text-accent">{e.quand}</p>
                  <h3 className="voix t-tete text-fort">{e.titre}</h3>
                  <p className="t-corps mt-2 text-texte">{e.texte}</p>
                </li>
              ))}
            </ol>

            {/* Les liens isolés portent leur propre hauteur de cible : un
                lien de 14 px de haut n'est pas atteignable au pouce. */}
            <div className="mt-10 flex flex-col items-start border-t border-filet pt-4">
              <a
                className="t-meta inline-flex min-h-11 items-center text-texte underline underline-offset-4 hover:text-accent"
                href="mailto:contact@vintoria.com"
              >
                contact@vintoria.com
              </a>
              <Link
                className="t-meta inline-flex min-h-11 items-center text-texte underline underline-offset-4 hover:text-accent"
                href="/tarifs"
              >
                Voir les formules
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
