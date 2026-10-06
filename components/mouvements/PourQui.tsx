/**
 * POUR QUI — le mouvement où le lecteur doit se reconnaître.
 *
 * Il arrive tard volontairement : avant d'avoir compris ce que fait
 * Vintoria, « pour qui » ne veut rien dire. Après, c'est la question qui
 * décide — « est-ce que c'est pour une maison comme la mienne ? »
 *
 * La deuxième colonne compte autant que la première. Dire à qui le produit
 * ne s'adresse pas est ce qui rend crédible tout ce qui précède, et évite
 * des démonstrations qui ne mèneront nulle part — pour eux comme pour nous.
 *
 * Composant SERVEUR.
 */

const MAISONS = [
  {
    titre: "Les restaurants qui ont une carte",
    texte:
      "Vingt références ou trois cents. À partir du moment où un client doit choisir, il y a un conseil à donner.",
  },
  {
    titre: "Les hôtels et leurs restaurants",
    texte:
      "Une clientèle qui change tous les soirs, souvent étrangère, et une équipe de salle qui tourne. Le conseil doit arriver sans dépendre de qui est là.",
  },
  {
    titre: "Les maisons sans sommelier permanent",
    texte:
      "C’est le cas le plus fréquent, et celui pour lequel Vintoria a été fait. Le savoir existe : il manque un moyen de l’amener à la table.",
  },
  {
    titre: "Les maisons qui en ont un",
    texte:
      "Vintoria ne le remplace pas. Il prend les tables qu’il ne peut pas prendre, pendant qu’il s’occupe de celles qui le demandent.",
  },
];

export function PourQui() {
  return (
    <section id="pour-qui" className="px rythme relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1180px]">
        <p className="eyebrow mb-7">Pour qui</p>
        <h2 className="voix t-titre max-w-[20ch] text-balance text-fort">
          Pour les maisons où le vin compte.
        </h2>

        <ul className="mt-12 grid gap-x-16 gap-y-10 sm:grid-cols-2">
          {MAISONS.map((m) => (
            <li key={m.titre} className="parait border-t border-filet pt-6">
              <h3 className="voix t-tete text-balance text-fort">{m.titre}</h3>
              <p className="t-corps mt-3 max-w-[44ch] text-texte">{m.texte}</p>
            </li>
          ))}
        </ul>

        {/* Dire non est ce qui rend le oui crédible. */}
        <div className="parait mt-12 border-t border-filet-fort pt-10">
          <p className="eyebrow mb-4">Ce n’est pas pour vous si</p>
          <p className="t-corps max-w-[62ch] text-texte">
            votre carte tient en cinq références, ou si le vin n’est pas un sujet
            dans votre salle. Vintoria ne vous apporterait rien, et nous vous le
            dirons pendant la démonstration plutôt qu’après.
          </p>
        </div>
      </div>
    </section>
  );
}
