import { Line } from "@/components/Line";

/**
 * ACTE IV — LA PREUVE.
 * Objection levée : « Est-ce que ça rapporte ? »
 * Parti pris : aucune statistique client inventée. On démontre le MÉCANISME —
 * plus crédible, et plus convaincant, pour un restaurateur qui connaît sa salle.
 */

const MECANIQUES = [
  {
    cle: "Toute la carte travaille",
    avant:
      "Une poignée de références fait l’essentiel des ventes. Le reste de la cave dort et immobilise votre trésorerie.",
    apres:
      "Chaque plat rend une partie différente de la carte pertinente. Les références oubliées retrouvent une occasion d’être servies.",
  },
  {
    cle: "Le doute coûte cher",
    avant:
      "Un client qui n’ose pas demande « la deuxième moins chère ». C’est le réflexe le plus répandu en salle.",
    apres:
      "Une raison énoncée lève le doute. On ne vend pas plus cher : on vend le vin qui convient. Et il est rarement le plus modeste.",
  },
  {
    cle: "La cohérence, midi et soir",
    avant:
      "La qualité du conseil dépend de qui travaille ce soir-là. Le client, lui, ne fait pas la différence entre vos équipes.",
    apres:
      "Le conseil ne dépend plus de l’équipe : il arrive à la table, identique midi et soir.",
  },
];

export function Preuve() {
  return (
    <section id="benefices" className="px rythme relative">
      {/* La trace du vin retenu — voir components/Salle.tsx */}
      <div
        aria-hidden
        className="robe-trace pointer-events-none absolute left-[2%] top-[12%] h-[56vh] w-[56vh] rounded-full"
        style={{ "--trace-force": "0.07", "--trace-retard": "240ms" } as React.CSSProperties}
      />

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <p className="eyebrow mb-14">La preuve</p>

        <h2 className="voix t-titre max-w-3xl text-os">
          <Line inView>Ce qu’un accord juste</Line>
          <Line inView delay={0.08}>
            <span className="italic text-tungstene">change dans vos comptes.</span>
          </Line>
        </h2>

        <div className="mt-20 border-t border-[color:var(--color-filet)]">
          {MECANIQUES.map((m) => (
            <div
              key={m.cle}
              className="grid gap-y-7 border-b border-[color:var(--color-filet)] py-11 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-14"
            >
              <h3 className="voix t-tete text-os">{m.cle}</h3>
              <div>
                <p className="eyebrow mb-3">Aujourd’hui</p>
                <p className="t-corps text-cendre">{m.avant}</p>
              </div>
              <div className="relative lg:pl-12">
                <span
                  aria-hidden
                  className="absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-laiton/50 to-transparent lg:block"
                />
                <p className="eyebrow mb-3 text-laiton">Avec Vintoria</p>
                <p className="t-corps text-os">{m.apres}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-baseline gap-x-10 gap-y-4">
          <p className="eyebrow">Ce que vous mesurez</p>
          {[
            "Marge sur le vin",
            "Rotation de cave",
            "Ticket moyen",
            "Références servies",
          ].map((k) => (
            <span key={k} className="t-corps text-cendre">
              {k}
            </span>
          ))}
        </div>

        <p className="t-meta mt-10 max-w-xl text-cendre-2">
          Nous ne promettons pas un pourcentage. Nous branchons Vintoria sur
          votre carte et vous regardez vos propres chiffres bouger.
        </p>
      </div>
    </section>
  );
}
