/**
 * LE SYSTÈME — la signature de la page.
 *
 * Carte → Cave → Conseil → Table → Vente. La réponse générique à cette
 * demande est un schéma à flèches. Celle-ci suit UNE SEULE BOUTEILLE, la
 * même, à travers ses cinq états : une ligne dans un PDF, une référence en
 * cave, une raison énoncée, un verre à table, une ligne sur l'addition.
 *
 * Le dispositif tient à une chose : le nom du vin revient cinq fois, et
 * c'est sa TRANSFORMATION qui raconte le produit. Pas une flèche, pas une
 * boîte. Le vin est réel — Château Bellerive est dans les données de
 * référence de Vintoria Pro.
 *
 * Les étapes ne sont pas numérotées : elles portent le nom du lieu où la
 * bouteille se trouve. « La cave » dit plus que « 02 ».
 *
 * Composant SERVEUR, entrées en CSS : zéro octet de JavaScript.
 */

const VIN = {
  nom: "Saint-Émilion Grand Cru",
  domaine: "Château Bellerive",
  region: "Bordeaux",
  cepages: "Merlot, Cabernet Franc",
  millesime: "2018",
  prix: "95",
  verre: "18",
};

function Etape({
  lieu,
  titre,
  texte,
  children,
}: {
  lieu: string;
  titre: string;
  texte: string;
  children: React.ReactNode;
}) {
  return (
    <li className="parait relative grid gap-7 pb-16 pl-7 last:pb-0 sm:pl-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
      {/* Le point sur le fil : la bouteille, à cet instant de son parcours. */}
      <span
        aria-hidden
        className="absolute left-0 top-[0.45rem] h-2.5 w-2.5 -translate-x-[calc(50%_+_0.5px)] rounded-full bg-accent sm:left-0"
      />
      <div>
        <p className="eyebrow text-accent">{lieu}</p>
        <h3 className="voix t-tete mt-3 text-balance text-fort">{titre}</h3>
        <p className="t-corps mt-3 max-w-[38ch] text-texte">{texte}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </li>
  );
}

export function Systeme() {
  return (
    <section id="systeme" className="px rythme-ample relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1180px]">
        <p className="eyebrow mb-7">Le système</p>
        <h2 className="voix t-titre max-w-[20ch] text-balance text-fort">
          Une bouteille, cinq états.
        </h2>
        <p className="t-chapeau mt-6 max-w-[54ch] text-texte">
          Suivez {VIN.domaine} depuis la ligne d’un PDF jusqu’à la ligne d’une
          addition. C’est tout ce que Vintoria fait, et c’est tout ce qu’il y a à
          comprendre.
        </p>

        {/* Le fil : il relie les cinq états et porte le regard vers le bas. */}
        <ol className="relative mt-12 border-l border-filet">
          <Etape
            lieu="La carte"
            titre="Une ligne dans un document"
            texte="Vous nous envoyez votre carte telle qu’elle est : un PDF, une photo, un tableur. Rien à ressaisir."
          >
            <div className="rounded-xl border border-filet bg-surface/60 p-5 sm:p-7">
              <p className="t-meta mb-4 text-faible">carte-des-vins.pdf</p>
              <p className="data flex items-baseline gap-3 text-fort">
                <span className="truncate">
                  {VIN.nom}, {VIN.domaine} {VIN.millesime}
                </span>
                <span
                  aria-hidden
                  className="min-w-6 flex-1 self-center border-b border-dotted border-filet-fort"
                />
                <span className="shrink-0">{VIN.prix} €</span>
              </p>
              <p className="data mt-3 flex items-baseline gap-3 text-faible">
                <span className="truncate">Châteauneuf-du-Pape, Domaine du Mistral 2019</span>
                <span
                  aria-hidden
                  className="min-w-6 flex-1 self-center border-b border-dotted border-filet"
                />
                <span className="shrink-0">120 €</span>
              </p>
            </div>
          </Etape>

          <Etape
            lieu="La cave"
            titre="Une référence qui se tient"
            texte="Chaque ligne devient une fiche : domaine, région, cépages, millésime, prix, disponibilité. Votre cave existe enfin quelque part."
          >
            <dl className="overflow-hidden rounded-xl border border-filet">
              {[
                ["Vin", VIN.nom],
                ["Domaine", VIN.domaine],
                ["Région", `${VIN.region} · ${VIN.cepages}`],
                ["Millésime", VIN.millesime],
                ["Prix", `${VIN.prix} € la bouteille · ${VIN.verre} € le verre`],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="grid gap-x-6 border-b border-filet px-5 py-3 last:border-b-0 sm:grid-cols-[7rem_1fr] sm:px-7"
                >
                  <dt className="eyebrow self-center">{k}</dt>
                  <dd className="t-corps mt-1 text-fort sm:mt-0">{v}</dd>
                </div>
              ))}
            </dl>
          </Etape>

          <Etape
            lieu="Le conseil"
            titre="Une raison, pas une liste"
            texte="Pour le plat que votre client a choisi, Vintoria retient ce vin et dit pourquoi. C’est la phrase qui lève le doute."
          >
            <blockquote className="rounded-xl border border-filet bg-surface/60 p-6 sm:p-8">
              <p className="t-meta text-faible">Pour un filet de bœuf, jus corsé</p>
              <p className="voix mt-4 text-[1.35rem] italic leading-[1.45] text-fort sm:text-[1.5rem]">
                « Puissant et velouté, il a l’étoffe qu’il faut pour tenir tête à
                votre repas : ses tanins soyeux fondent dans chaque bouchée et en
                révèlent la saveur. »
              </p>
            </blockquote>
          </Etape>

          <Etape
            lieu="La table"
            titre="Un client qui ose"
            texte="Il ne commande plus « la deuxième moins chère ». Il commande le vin qui convient, parce qu’on lui a dit pourquoi."
          >
            <div className="flex items-center gap-6 rounded-xl border border-filet p-6 sm:gap-8 sm:p-8">
              {/* La robe, vue du dessus : cœur, bord, lisière. */}
              {/* La robe vue du dessus : cœur, bord, lisière — comme le
                  disque de Vintoria Pro. Plate, jamais sphérique : on
                  regarde un verre par en haut, pas une bille. */}
              <span
                aria-hidden
                className="relative h-20 w-20 shrink-0 rounded-full ring-1 ring-[color:var(--color-filet-fort)] sm:h-24 sm:w-24"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, var(--vintoria-vin) 0%, #7a1528 38%, var(--vintoria-bordeaux-700) 62%, var(--vintoria-bordeaux-900) 84%, color-mix(in srgb, var(--vintoria-nuit-texte) 32%, transparent) 93%, color-mix(in srgb, var(--vintoria-nuit-texte) 10%, transparent) 100%)",
                }}
              >
                <span
                  aria-hidden
                  className="absolute left-[22%] top-[18%] h-[26%] w-[34%] -rotate-[28deg] rounded-full"
                  style={{ background: "linear-gradient(120deg, rgba(255,246,232,.42), transparent 70%)" }}
                />
              </span>
              <div className="min-w-0">
                <p className="eyebrow text-accent">Meilleur accord</p>
                <p className="voix t-tete mt-1.5 text-balance text-fort">{VIN.nom}</p>
                <p className="t-meta mt-1.5 text-faible">
                  {VIN.domaine} · {VIN.millesime}
                </p>
              </div>
            </div>
          </Etape>

          <Etape
            lieu="La vente"
            titre="Une ligne de plus sur l’addition"
            texte="Le vin juste est rarement le plus modeste. On ne vend pas plus cher : on vend ce qui convient, et toute la carte se remet à travailler."
          >
            <div className="rounded-xl border border-filet bg-surface/60 p-5 sm:p-7">
              <p className="t-meta mb-4 text-faible">Table 12</p>
              <p className="data flex items-baseline justify-between gap-6 text-faible">
                <span className="truncate">2 × Filet de bœuf</span>
                <span className="shrink-0">68,00 €</span>
              </p>
              <p className="data mt-3 flex items-baseline justify-between gap-6 text-fort">
                <span className="truncate">1 × {VIN.nom}</span>
                <span className="shrink-0 text-accent">{VIN.prix},00 €</span>
              </p>
            </div>
          </Etape>
        </ol>
      </div>
    </section>
  );
}
