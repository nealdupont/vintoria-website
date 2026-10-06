/**
 * LA CAVE — le seul mouvement de jour.
 *
 * Un restaurant a deux temps. Le service se passe le soir, dans la nuit : c'est
 * tout le reste de cette page. Le travail de la cave se fait le matin, dans
 * la lumière, avec un carnet et des cartons. La bascule sur le crème n'est
 * pas une respiration graphique : c'est le changement d'heure qui raconte le
 * changement de métier.
 *
 * La classe `jour` redéfinit les jetons sémantiques pour tout le sous-arbre.
 * Les composants écrivent `text-fort` et `text-accent` comme partout
 * ailleurs — mais l'accent passe du bordeaux 400 (lisible sur la nuit) au bordeaux 700
 * (lisible sur le crème) : le thème crème de la marque. Voir app/globals.css.
 *
 * Les intitulés ci-dessous sont ceux de Vintoria Pro, repris mot pour mot
 * de ses dictionnaires : rien n'est inventé pour la vitrine.
 *
 * Composant SERVEUR.
 */

const ETAPES = [
  {
    lieu: "Vous envoyez",
    titre: "Votre carte, telle qu’elle est",
    texte:
      "Un PDF, une photo du menu, un tableur, ou du texte collé. Aucun format imposé, aucune ressaisie.",
  },
  {
    lieu: "Vintoria range",
    titre: "Chaque ligne devient une référence",
    texte:
      "Domaine, région, cépages, millésime, prix bouteille et prix au verre. Votre cave prend enfin une forme.",
  },
  {
    lieu: "Vous pilotez",
    titre: "Et vous n’y revenez qu’au besoin",
    texte:
      "Les stocks suivent le service, les alertes préviennent avant la rupture, et l’export remet une carte à jour entre vos mains.",
  },
];

/* Les indicateurs réels du tableau de bord, nommés comme dans le produit. */
const INDICATEURS = [
  "Valeur commerciale de la cave",
  "Valeur d’acquisition",
  "Marge brute potentielle",
  "Coefficient moyen",
];

export function Cave() {
  return (
    <section id="cave" className="jour px rythme-ample relative">
      <div className="mx-auto max-w-[1180px]">
        <p className="eyebrow mb-7">La cave</p>

        <h2 className="voix t-titre max-w-[18ch] text-balance text-fort">
          Le matin, la cave se tient toute seule.
        </h2>
        <p className="t-chapeau mt-6 max-w-[54ch] text-texte">
          Le service, c’est le soir. Le reste du temps, il y a une carte à mettre à
          jour, des bouteilles à compter et un tableur qui dérive. C’est ce
          travail-là que Vintoria reprend.
        </p>

        {/* Les trois temps */}
        <ol className="mt-16 grid gap-10 md:grid-cols-3 lg:gap-14">
          {ETAPES.map((e) => (
            <li key={e.lieu} className="parait border-t border-filet-fort pt-6">
              <p className="eyebrow text-accent">{e.lieu}</p>
              <h3 className="voix t-tete mt-3 text-balance text-fort">{e.titre}</h3>
              <p className="t-corps mt-3 text-texte">{e.texte}</p>
            </li>
          ))}
        </ol>

        {/* Ce que le tableau de bord vous rend — les vrais intitulés. */}
        <div className="parait mt-12 grid gap-12 border-t border-filet pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <p className="eyebrow mb-6">Ce que vous lisez d’un coup d’œil</p>
            <ul className="flex flex-col">
              {INDICATEURS.map((i) => (
                <li
                  key={i}
                  className="voix border-b border-filet py-3.5 text-[1.15rem] text-fort"
                >
                  {i}
                </li>
              ))}
            </ul>
            <p className="t-meta mt-6 text-faible">
              Plus les alertes de stock, les inventaires et l’export PDF de votre
              carte, prêt à imprimer.
            </p>
          </div>

          <div className="self-center">
            <blockquote className="border-l-2 border-accent pl-6">
              <p className="voix text-[1.35rem] italic leading-[1.5] text-fort sm:text-[1.55rem]">
                Une carte vit. Nouveaux millésimes, ruptures, plats de saison. La
                tenir à jour ne devrait pas être un travail du dimanche.
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
