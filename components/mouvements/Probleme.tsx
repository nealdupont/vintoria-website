/**
 * LE PROBLÈME — « est-ce que j'ai ce problème ? »
 *
 * Trois constats, dans l'ordre où un restaurateur les vit : la carte change,
 * l'équipe change, et la personne qui sait n'est jamais partout à la fois.
 * Le troisième est le plus douloureux : il ferme donc le mouvement, en grand.
 *
 * Composant SERVEUR : rien n'est interactif, les entrées se font en CSS.
 * Pas une ligne de JavaScript n'est livrée pour ce mouvement.
 */

const CONSTATS = [
  {
    titre: "Une carte vit.",
    texte:
      "Nouveaux millésimes, ruptures, plats de saison. Ce qui était juste en mars ne l’est plus en octobre.",
  },
  {
    titre: "Une équipe tourne.",
    texte:
      "Le savoir s’en va avec ceux qui partent. Et le conseil reçu à table ne devrait jamais dépendre de qui travaille ce soir-là.",
  },
];

export function Probleme() {
  return (
    <section id="probleme" className="px rythme relative overflow-hidden">
      <div
        aria-hidden
        className="robe-trace pointer-events-none absolute left-[-20%] top-[10%] h-[60vh] w-[60vh] rounded-full"
        style={{ "--trace-force": 0.1 } as React.CSSProperties}
      />

      <div className="relative z-10 mx-auto max-w-[1180px]">
        <p className="eyebrow mb-7">Le problème</p>

        <h2 className="voix t-titre max-w-[22ch] text-balance text-fort">
          Le vin est le poste le plus rentable de votre salle, et le plus
          difficile à tenir.
        </h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:gap-16">
          {CONSTATS.map((c) => (
            <div key={c.titre} className="parait border-t border-filet pt-6">
              <h3 className="voix t-tete text-fort">{c.titre}</h3>
              <p className="t-corps mt-3 max-w-[42ch] text-texte">{c.texte}</p>
            </div>
          ))}
        </div>

        {/* Le constat qui fait mal — seul, en grand, après les deux autres. */}
        <div className="parait mt-14 border-t border-filet-fort pt-12">
          <h3 className="voix t-citation max-w-[20ch] text-balance text-fort">
            Un sommelier ne se démultiplie pas.
          </h3>
          <div className="mt-7 grid gap-8 sm:grid-cols-2 lg:gap-16">
            <p className="t-chapeau max-w-[44ch] text-texte">
              Il ne peut pas être à la table 12 et à la table 4 en même temps. Les
              autres tables commandent au hasard, ou ne commandent pas.
            </p>
            <p className="voix self-end text-[1.2rem] italic leading-snug text-fort">
              Vintoria ne remplace pas votre sommelier. Il lui donne le don
              d’ubiquité.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
