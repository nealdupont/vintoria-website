/**
 * PLUS DE VENTES — « est-ce que ça rapporte ? »
 *
 * Trois leviers, chacun montré en AVANT / APRÈS : c'est la seule forme qui
 * rende un gain crédible sans avancer de chiffre. Le site ne promet aucun
 * pourcentage, et la dernière phrase le dit explicitement — c'est ce refus
 * qui rend le reste croyable.
 *
 * Composant SERVEUR.
 */

const LEVIERS = [
  {
    titre: "Toute la carte travaille",
    avant:
      "Une poignée de références fait l’essentiel des ventes. Le reste de la cave dort et immobilise votre trésorerie.",
    apres:
      "Chaque plat rend une partie différente de la carte pertinente. Les références oubliées retrouvent une occasion d’être servies.",
  },
  {
    titre: "Le doute coûte cher",
    avant:
      "Un client qui n’ose pas demande « la deuxième moins chère ». C’est le réflexe le plus répandu en salle.",
    apres:
      "Une raison énoncée lève le doute. On ne vend pas plus cher : on vend le vin qui convient. Et il est rarement le plus modeste.",
  },
  {
    titre: "La cohérence, midi et soir",
    avant:
      "La qualité du conseil dépend de qui travaille ce soir-là. Le client, lui, ne fait pas la différence entre vos équipes.",
    apres:
      "Le conseil ne dépend plus de l’équipe : il arrive à la table, identique midi et soir.",
  },
];

const MESURES = [
  "Marge sur le vin",
  "Rotation de cave",
  "Ticket moyen",
  "Références servies",
];

export function Ventes() {
  return (
    <section id="ventes" className="px rythme relative overflow-hidden">
      <div
        aria-hidden
        className="robe-trace pointer-events-none absolute right-[-15%] top-[20%] h-[55vh] w-[55vh] rounded-full"
        style={{ "--trace-force": 0.07, "--trace-retard": "200ms" } as React.CSSProperties}
      />

      <div className="relative z-10 mx-auto max-w-[1180px]">
        <p className="eyebrow mb-7">Plus de ventes</p>
        <h2 className="voix t-titre max-w-[20ch] text-balance text-fort">
          Ce qu’un accord juste change dans vos comptes.
        </h2>

        <div className="mt-16 flex flex-col gap-10">
          {LEVIERS.map((l) => (
            <article key={l.titre} className="parait border-t border-filet pt-8">
              <h3 className="voix t-tete text-fort">{l.titre}</h3>
              <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-16">
                <div>
                  <p className="eyebrow mb-3">Aujourd’hui</p>
                  <p className="t-corps max-w-[46ch] text-faible">{l.avant}</p>
                </div>
                <div className="border-l border-filet pl-6 lg:pl-8">
                  <p className="eyebrow mb-3 text-accent">Avec Vintoria</p>
                  <p className="t-corps max-w-[46ch] text-texte">{l.apres}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Ce que vous mesurez — des indicateurs, jamais des promesses. */}
        <div className="parait mt-14 border-t border-filet-fort pt-12">
          <p className="eyebrow mb-7">Ce que vous mesurez</p>
          <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {MESURES.map((m) => (
              <li key={m} className="voix t-tete border-b border-filet pb-4 text-fort">
                {m}
              </li>
            ))}
          </ul>
          <p className="t-corps mt-10 max-w-[58ch] text-texte">
            Nous ne promettons pas un pourcentage. Nous branchons Vintoria sur votre
            carte et vous regardez vos propres chiffres bouger.
          </p>
        </div>
      </div>
    </section>
  );
}
