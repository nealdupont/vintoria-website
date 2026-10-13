import { prixDe } from "@/lib/tarifs";
import type { CleFormule } from "@/lib/formules";

/**
 * LE PRIX — UN SEUL RENDU, POUR TOUTES LES SURFACES.
 *
 * Il y en avait deux, presque identiques : une fonction locale dans
 * `app/tarifs/page.tsx`, une autre dans les cartes de l'accueil. Chacune
 * décidait elle-même quand afficher un montant et comment écrire sa
 * périodicité. Deux copies d'une règle commerciale, c'est une occasion de
 * les voir diverger — et la divergence aurait été invisible : deux pages
 * annonçant deux prix différents pour la même offre se rendent très bien.
 *
 * CE COMPOSANT NE DÉCIDE RIEN. Il demande à `lib/tarifs.ts` ce qu'il faut
 * afficher et il le rend. La seule chose qui lui appartienne est la
 * TAILLE : une page de formules porte un montant plus grand qu'une carte
 * d'accueil, et c'est une affaire de composition, pas de commerce.
 *
 * « Sur demande » n'est pas un trou dans la page. En vente B2B c'est une
 * réponse, et c'est la réponse honnête tant que les tarifs ne sont pas
 * arrêtés. Un chiffre inventé ne l'est pas.
 */

const TAILLES = {
  page: {
    montant: "voix text-[2.6rem] leading-none",
    attente: "voix text-[1.9rem] leading-none",
    mention: "t-meta mt-2 block font-sans",
  },
  carte: {
    montant: "voix text-[2.1rem] leading-none tabular-nums",
    attente: "voix text-[1.55rem] leading-none",
    mention:
      "data mt-2.5 block text-[0.68rem] leading-[1.5] tracking-[0.1em] uppercase",
  },
} as const;

export function Prix({
  cle,
  taille = "page",
  className = "",
}: {
  cle: CleFormule;
  taille?: keyof typeof TAILLES;
  className?: string;
}) {
  const t = TAILLES[taille];
  const prix = prixDe(cle);

  if (prix.publie && !prix.surDevis) {
    return (
      /* UN `span`, PAS UN `p` : sur l'accueil, le prix vit À L'INTÉRIEUR
         du bouton qui déplie la carte, et un paragraphe n'y est pas du
         HTML valide. `block` lui rend le comportement d'un bloc. */
      <span
        data-prix={cle}
        className={`block ${t.montant} text-[color:var(--color-fort)] ${className}`}
      >
        {prix.montant}&nbsp;€
        <span
          className={`ml-2 align-middle text-[0.72rem] tracking-[0.1em] text-[color:var(--color-faible)] ${taille === "carte" ? "data" : "t-meta font-sans"}`}
        >
          {prix.periodicite}
        </span>
      </span>
    );
  }

  return (
    <span
      /* UN REPÈRE STABLE. Le garde-fou qui vérifie que l'accueil et
         `/tarifs` annoncent la même chose a besoin de désigner le prix
         sans dépendre d'une classe de mise en forme. */
      data-prix={cle}
      className={`block ${t.attente} text-[color:var(--color-fort)] ${className}`}
    >
      {prix.publie ? "Sur devis" : "Sur demande"}
      <span className={`${t.mention} text-[color:var(--color-faible)]`}>
        Communiqué pendant la démonstration
      </span>
    </span>
  );
}
