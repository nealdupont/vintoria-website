import Image from "next/image";

/**
 * LE PRODUIT — les écrans réels.
 *
 * Aucune maquette, aucune fonctionnalité inventée : ces images sont des
 * captures de Vintoria Pro, prises sur la cave de référence du projet
 * (« Maison de Référence »), avec ses quinze vins. Ce que la page montre
 * est exactement ce que le produit fait aujourd'hui.
 *
 * Le mouvement est construit sur l'asymétrie qui EST le produit : d'un côté
 * un écran de bureau que seul le restaurateur voit, de l'autre un téléphone
 * que seul le client tient. Les montrer côte à côte dit la proposition
 * mieux qu'une phrase.
 *
 * Composant SERVEUR. Les images sont chargées paresseusement : ce mouvement
 * est loin sous la ligne de flottaison.
 */

const PARCOURS = [
  {
    src: "/produit/plats.webp",
    alt: "Écran de téléphone : la carte des plats, chaque plat suivi de ses accompagnements, à toucher pour composer son repas.",
    legende: "Il compose son repas",
  },
  {
    src: "/produit/preference.webp",
    alt: "Écran de téléphone : le choix d’une couleur de vin, des pastilles rouge, blanc, moelleux, rosé et effervescent, avec une option « Laissez-moi choisir ».",
    legende: "Il dit son envie, ou pas",
  },
  {
    src: "/produit/resultat.webp",
    alt: "Écran de téléphone : la recommandation, un Saint-Émilion Grand Cru avec sa robe, son domaine, son prix et la phrase qui justifie l’accord.",
    legende: "Il reçoit le conseil",
  },
];

export function Produit() {
  return (
    <section id="produit" className="px rythme relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <p className="eyebrow mb-7">Le produit</p>
        <h2 className="voix t-titre max-w-[22ch] text-balance text-fort">
          Deux écrans. Le vôtre, et celui de votre client.
        </h2>
        <p className="t-chapeau mt-6 max-w-[54ch] text-texte">
          Vous tenez votre cave depuis un tableau de bord. Votre client ne voit
          jamais ce tableau de bord : il voit son téléphone, et un conseil.
        </p>

        {/* ── Le vôtre ────────────────────────────────────────────────── */}
        <figure className="parait mt-16">
          <div className="overflow-hidden rounded-2xl border border-filet">
            <Image
              src="/produit/cave.webp"
              alt="Vintoria Pro, écran Cave : quinze références et cent soixante-dix-neuf bouteilles, chacune avec son millésime, son prix bouteille et son prix au verre, la composition de la cave par couleur, et le vin passé sous son seuil de réassort."
              width={1600}
              height={1000}
              sizes="(min-width: 1024px) 1100px, 100vw"
              loading="lazy"
              className="w-full"
            />
          </div>
          <figcaption className="t-meta mt-4 text-faible">
            Votre cave, dans Vintoria Pro. Capture de l’établissement de
            démonstration.
          </figcaption>
        </figure>

        {/* ── Celui de votre client ───────────────────────────────────── */}
        <div className="parait mt-14 border-t border-filet pt-14">
          <h3 className="voix t-citation max-w-[20ch] text-balance text-fort">
            Ce que votre client tient dans la main.
          </h3>

          {/*
            Sur petit écran, trois captures de téléphone empilées en pleine
            largeur faisaient à elles seules huit mille pixels. Elles passent
            donc en rail qui se fait glisser — le geste reprend celui du
            parcours lui-même. Le rail est annoncé comme région et reçoit le
            focus, pour qu'on puisse le parcourir au clavier.
            Dès `sm`, elles reprennent leur place côte à côte.
          */}
          <ul
            role="region"
            aria-label="Le parcours du client, écran par écran"
            tabIndex={0}
            className="mt-12 -mx-[max(1.5rem,env(safe-area-inset-left))] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(1.5rem,env(safe-area-inset-left))] pb-3 sm:mx-0 sm:mx-auto sm:grid sm:max-w-[920px] sm:snap-none sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 lg:gap-8"
          >
            {PARCOURS.map((e) => (
              <li
                key={e.src}
                className="flex w-[68vw] shrink-0 snap-start flex-col sm:w-auto sm:shrink"
              >
                <div className="aspect-[9/13] overflow-hidden rounded-[1.75rem] border border-filet bg-nuit-2">
                  <Image
                    src={e.src}
                    alt={e.alt}
                    width={760}
                    height={1645}
                    sizes="(min-width: 640px) 300px, 68vw"
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <p className="t-meta mt-4 text-faible">{e.legende}</p>
              </li>
            ))}
          </ul>
          <p className="t-meta mt-3 text-faible sm:hidden" aria-hidden>
            Faites glisser →
          </p>
        </div>

        {/* ── Ce qui relie les deux ───────────────────────────────────── */}
        <div className="parait mt-12 grid items-center gap-12 border-t border-filet pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <p className="eyebrow mb-5 text-accent">Ce qui relie les deux</p>
            <h3 className="voix t-tete max-w-[16ch] text-balance text-fort">
              Un QR code sur la table. Rien d’autre à installer.
            </h3>
            <p className="t-corps mt-4 max-w-[44ch] text-texte">
              Vintoria vous donne un support imprimable, prêt à poser sur vos
              tables, vos cartes et vos menus. Votre client scanne, et il y est.
              Aucune application à télécharger.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-filet">
            <Image
              src="/produit/qr.webp"
              alt="Vintoria Pro, écran Salle : le QR code à poser sur les tables, son support imprimable en A6, le lien public de la carte et les formats d’export."
              width={1600}
              height={1000}
              sizes="(min-width: 1024px) 620px, 100vw"
              loading="lazy"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
