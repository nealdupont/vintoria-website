import Link from "next/link";
import { FORMULES, ajoutsSur, comprisDans, type CleFormule, type Trait } from "@/lib/formules";
import { prixDe } from "@/lib/tarifs";
import { INSCRIPTION } from "@/lib/liens";
import { Coche } from "@/components/accueil/Illustrations";

/**
 * LES TROIS FORMULES, en verre. Partagées par l'accueil et /tarifs.
 *
 * Rien n'est écrit à la main ici : ce que chaque carte comprend se déduit
 * de `lib/formules.ts`, lui-même repris du catalogue du produit. Le prix
 * passe par `prixDe`, qui ne rend aucun montant tant que la grille n'est
 * pas signée (`PRIX_CONFIRMES`) ET complète.
 *
 * L'Essentiel liste ce qu'il comprend ; les suivantes, ce qu'elles
 * AJOUTENT. C'est ainsi qu'on lit une gamme : par différence.
 */

function Ligne({ t }: { t: Trait }) {
  const compris = t.valeur === "Compris";
  return (
    <li>
      <Coche />
      <span>
        {t.intitule}
        {compris ? null : (
          <>
            {" : "}
            <strong>{t.valeur}</strong>
          </>
        )}
      </span>
    </li>
  );
}

function Prix({ cle }: { cle: CleFormule }) {
  const p = prixDe(cle);
  if (p.publie && !p.surDevis) {
    return (
      <p className="formule-prix">
        <strong>
          {p.montant} € {p.periodicite}
        </strong>
        <span>Après l’essai gratuit</span>
      </p>
    );
  }
  return (
    <p className="formule-prix">
      <strong>{p.publie ? "Sur devis" : "Tarif sur demande"}</strong>
      <span>
        {cle === "enterprise"
          ? "Adapté au nombre d’établissements"
          : "Essai gratuit, aucune carte bancaire requise"}
      </span>
    </p>
  );
}

export function CartesFormules({
  limite,
  revele = true,
}: {
  limite?: number;
  /** Faux sur /tarifs : les cartes y sont le sujet de la page, elles arrivent déjà posées. */
  revele?: boolean;
}) {
  return (
    <div className="formules">
      {FORMULES.map((f, rang) => {
        const traits = rang === 0 ? comprisDans(f.cle) : ajoutsSur(f.cle);
        const visibles = limite ? traits.slice(0, limite) : traits;
        const reste = traits.length - visibles.length;
        const precedente = rang > 0 ? FORMULES[rang - 1].nom : null;

        return (
          <article
            key={f.cle}
            data-lumiere
            className={`verre formule${f.recommandee ? " formule--conseillee verre--brun" : ""}`}
            aria-labelledby={`formule-${f.cle}`}
            data-formule={f.cle}
            data-revele={revele ? "" : undefined}
            style={{ "--i": rang } as React.CSSProperties}
          >
            {f.recommandee ? <span className="formule-aura" aria-hidden /> : null}
            <div className="formule-tete">
              <h3 id={`formule-${f.cle}`} className="formule-nom">
                {f.nom}
              </h3>
              {f.recommandee ? <span className="formule-badge">Conseillée</span> : null}
            </div>
            <p className="formule-pourqui">{f.pourQui}</p>
            <Prix cle={f.cle} />

            <ul className="formule-liste">
              {precedente ? (
                <li className="formule-inclus">
                  {precedente === "Essentiel" ? "Tout l’Essentiel, et :" : `Toute la formule ${precedente}, et :`}
                </li>
              ) : null}
              {visibles.map((t) => (
                <Ligne key={`${t.chapitre}${t.intitule}`} t={t} />
              ))}
              {reste > 0 ? (
                <li className="formule-inclus">
                  <Link className="lien lien-seul" href="/tarifs">
                    {reste === 1 ? "Et une fonction de plus" : `Et ${reste} fonctions de plus`}
                  </Link>
                </li>
              ) : null}
            </ul>

            {f.cle === "enterprise" ? (
              <Link className="bouton bouton-verre" href="/demonstration">
                Parler à l’équipe
              </Link>
            ) : (
              <a
                className={`bouton ${f.recommandee ? "bouton-or" : "bouton-verre"}`}
                href={INSCRIPTION}
              >
                Commencer l’essai gratuit
              </a>
            )}
          </article>
        );
      })}
    </div>
  );
}
