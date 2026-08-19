/**
 * ACTE II — LA VÉRITÉ.
 * Objection levée : « Est-ce que j’ai vraiment ce problème ? »
 *
 * Direction « LE SILENCE ». On sort de l’Accord — dense, vivant, manipulable.
 * Ici, le bruit s’arrête : une seule colonne, aucune grille, aucun numéro,
 * aucun mouvement. C’est le seul acte de la page où rien ne bouge, et c’est
 * pour cela qu’on s’y arrête.
 *
 * Une règle porte toute la composition : L’IVOIRE N’APPARAÎT QU’UNE FOIS.
 * Le cadrage, les deux vérités mineures et la preuve sont en cendre ; la
 * résolution en tungstène. Un seul objet de la section est en os — la thèse.
 * La hiérarchie n’est donc pas seulement une affaire de corps : c’est la
 * seule chose entièrement éclairée de l’écran.
 */

/** Les deux constats qui préparent le troisième. Ils ne le concurrencent pas. */
const MINEURES = [
  {
    constat: "Une carte vit.",
    detail:
      "Nouveaux millésimes, ruptures, plats de saison. Ce qui était juste en mars ne l’est plus en octobre.",
  },
  {
    constat: "Une équipe tourne.",
    detail:
      "Le savoir s’en va avec ceux qui partent. Et le conseil reçu à table ne devrait jamais dépendre de qui travaille ce soir-là.",
  },
];

/*
  LA THÈSE — dimensionnée, pas subie.

  « ne se démultiplie pas. » mesure 413 px à 76 px de corps ; il n’y a que
  272 px de contenu à 320 px de large. `.t-display` tel quel se briserait en
  quatre lignes avec des orphelins (« pas. » seul). La rampe ci-dessous est
  calculée pour que la plus longue des deux lignes tienne d’un seul tenant de
  320 px à 1440 px : 28 px → 76 px. Les deux lignes sont explicites — la
  coupure est une décision, jamais un accident de repli.

  La marge restante à 320 px est d’environ 10 % : assez pour que la ligne
  tienne encore si Spectral n’est pas chargée et qu’une sérif de repli, plus
  large, prend sa place le temps du swap.

  Interlettrage et interligne repris de `.t-display`, dont c’est le degré.
*/
const THESE: React.CSSProperties = {
  fontSize: "clamp(1.6rem, 0.893rem + 4.286vw, 4.75rem)",
  lineHeight: 1.04,
  letterSpacing: "-0.024em",
};

export function Verite() {
  return (
    <section className="px rythme relative">
      {/* La trace du vin retenu — voir components/Salle.tsx */}
      <div
        aria-hidden
        className="robe-trace pointer-events-none absolute right-[2%] top-[8%] h-[58vh] w-[58vh] rounded-full"
        style={{ "--trace-force": "0.1", "--trace-retard": "0ms" } as React.CSSProperties}
      />

      <div className="relative z-10 mx-auto max-w-[1500px]">
        {/* I — Le cadrage. Il situe l’enjeu, il ne le porte pas. */}
        <p className="eyebrow">La vérité du service</p>
        <p className="t-corps mt-7 max-w-md text-cendre">
          Le vin est le poste le plus rentable de votre salle — et le plus
          difficile à tenir.
        </p>

        {/* II — Les deux vérités mineures. L’espace sépare : aucun filet. */}
        <div className="mt-16 sm:mt-20">
          {MINEURES.map((v) => (
            <div key={v.constat} className="mt-10 first:mt-0">
              <p className="voix t-tete text-cendre">{v.constat}</p>
              <p className="t-meta mt-2.5 max-w-md text-cendre-2">{v.detail}</p>
            </div>
          ))}
        </div>

        {/* III — Le silence. ~22 % de la hauteur d’écran, et rien dedans. */}
        <div aria-hidden className="h-[clamp(8rem,22vh,16rem)]" />

        {/* IV — La thèse. Le seul objet en os de la section. */}
        <h2 className="voix text-balance text-os" style={THESE}>
          <span className="block">Un sommelier</span>
          <span className="block">ne se démultiplie pas.</span>
        </h2>

        {/*
          V — La preuve, collée à la thèse : même bord gauche, 40 px dessous.
          Elle en était séparée de 368 px de vide latéral ; le lien doit être
          immédiat. L’écart de corps suffit à dire la subordination.
        */}
        <div className="mt-10 max-w-[36ch]">
          <p className="t-corps text-cendre">
            Il ne peut pas être à la table 12 et à la table 4 en même temps.
          </p>
          <p className="t-corps mt-3 text-cendre-2">
            Les autres tables commandent au hasard — ou ne commandent pas.
          </p>
        </div>

        {/* VI — La résolution. « Ubiquité » répond à « ne se démultiplie pas ». */}
        <div className="mt-24 sm:mt-28">
          <span aria-hidden className="block h-px w-10 bg-laiton/60" />
          <p className="voix t-citation mt-9 max-w-2xl italic text-tungstene">
            Vintoria ne remplace pas votre sommelier. Il lui donne le don
            d’ubiquité.
          </p>
        </div>
      </div>
    </section>
  );
}
