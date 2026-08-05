import { Line } from "@/components/Line";

/**
 * ACTE II — LA VÉRITÉ.
 * Objection levée : « Est-ce que j’ai vraiment ce problème ? »
 * Traitement : manifeste typographique. Aucune carte, aucune grille de 3.
 */

const VERITES = [
  {
    constat: "Une carte vit.",
    detail:
      "Nouveaux millésimes, ruptures, plats de saison. Ce qui était juste en mars ne l’est plus en octobre.",
  },
  {
    constat: "Une équipe tourne.",
    detail:
      "Le savoir part avec celui qui s’en va. Chaque recrue repart de zéro, en plein service.",
  },
  {
    constat: "Un sommelier ne se démultiplie pas.",
    detail:
      "Il ne peut pas être à la table 12 et à la table 4 en même temps. Les autres tables commandent au hasard — ou ne commandent pas.",
  },
];

export function Verite() {
  return (
    <section className="px rythme relative">
      <div className="mx-auto max-w-[1500px]">
        <p className="eyebrow mb-14">La vérité du service</p>

        <h2 className="voix t-titre max-w-4xl text-os">
          <Line inView>Le vin est le poste le plus rentable</Line>
          <Line inView delay={0.08}>
            <span className="text-cendre">de votre salle —</span>
          </Line>
          <Line inView delay={0.16}>et le plus difficile à tenir.</Line>
        </h2>

        <div className="mt-20 border-t border-[color:var(--color-filet)]">
          {VERITES.map((v, i) => (
            <div
              key={v.constat}
              className="grid grid-cols-[auto_1fr] gap-x-6 border-b border-[color:var(--color-filet)] py-10 sm:grid-cols-[4rem_minmax(0,20rem)_minmax(0,32rem)] sm:gap-x-12"
            >
              <span className="data pt-2 text-[0.75rem] text-laiton">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="voix t-tete text-os">{v.constat}</p>
              <p className="t-corps col-start-2 mt-4 text-cendre sm:col-start-3 sm:mt-1">
                {v.detail}
              </p>
            </div>
          ))}
        </div>

        <p className="voix t-citation mt-20 max-w-3xl italic text-tungstene">
          Vintoria ne remplace pas votre sommelier. Il lui donne le don
          d’ubiquité.
        </p>
      </div>
    </section>
  );
}
