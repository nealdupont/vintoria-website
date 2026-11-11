import { Symbole } from "@/components/marque/Marque";

/**
 * L'ORIGINE. Vintoria n'a pas encore de clients à citer, et le site n'en
 * invente pas. Il a mieux : il a été pensé par quelqu'un qui a fait ce
 * métier, à des tables où il ne pardonne rien.
 *
 * Derrière la carte de verre défile le vocabulaire du métier, en très
 * grand, en deux rubans contraires : la robe, le nez, la bouche, l'accord.
 * Le verre le floute en passant : on devine le métier sous la phrase.
 */

const MOTS_HAUT = ["la robe", "le nez", "la bouche", "l’accord", "le service", "la cave"];
const MOTS_BAS = ["le millésime", "le terroir", "la carte", "le cépage", "la table", "le conseil"];

function Ruban({ mots, sens }: { mots: string[]; sens: "gauche" | "droite" }) {
  /* Deux fois la même suite : quand la première a défilé, la seconde est à
     sa place exacte, et la boucle ne se voit pas. */
  const suite = [...mots, ...mots];
  return (
    <div className={`org-ruban org-ruban--${sens}`} aria-hidden>
      <div className="org-piste">
        {suite.map((m, k) => (
          <span key={k} className={k % 2 ? "org-mot org-mot--plein" : "org-mot"}>
            {m}
            <span className="org-losange" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Origine() {
  return (
    <section className="section org" aria-labelledby="origine-titre">
      <Ruban mots={MOTS_HAUT} sens="gauche" />
      <div className="conteneur org-avant">
        <figure className="verre verre--brun origine" data-lumiere data-revele>
          <Symbole hauteur={44} className="origine-symbole" />
          <div>
            <h2 id="origine-titre" className="sr-only">
              L’origine de Vintoria
            </h2>
            <blockquote className="origine-texte">
              Vintoria est né en salle. Il a été conçu par un sommelier passé
              par des maisons étoilées, en Europe et à New York, pour donner à
              chaque restaurant ce qu’il faisait à chaque table.
            </blockquote>
            <figcaption className="petit origine-signature">
              Le geste du sommelier, mis à la portée de toute la salle.
            </figcaption>
          </div>
        </figure>
      </div>
      <Ruban mots={MOTS_BAS} sens="droite" />
    </section>
  );
}
