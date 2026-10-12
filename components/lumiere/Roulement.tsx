"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * LE ROULEMENT DES CHIFFRES — un compteur mécanique, pas un nombre qui monte.
 *
 * LA DIFFÉRENCE, parce que la version précédente s'est trompée dessus.
 * Le dévoilement translatait le NOMBRE ENTIER derrière un cache : « 7 972 € »
 * arrivait d'en dessous, d'un bloc, ses glyphes inchangés. On voyait bouger un
 * objet ; on ne voyait aucun chiffre tourner.
 * Ici chaque rang est une ROUE : une colonne de chiffres qui défile dans sa
 * propre fenêtre. Le nombre ne se déplace pas d'un pixel — c'est son CONTENU
 * qui change, rang par rang, jusqu'au verrouillage. (Mesuré : la boîte du
 * montant reste à 240,4 px du bord, du premier tour au dernier cran.)
 *
 * LA GÉOMÉTRIE EST EXACTE PAR CONSTRUCTION, et c'est elle qui garantit
 * qu'aucun chiffre ne reste de travers à la fin :
 *   · un GABARIT invisible — le chiffre final lui-même — donne à la fenêtre
 *     la largeur et la hauteur EXACTES de son état d'arrivée ;
 *   · la roue est posée en absolu sur le BAS de cette fenêtre, son dernier
 *     cran étant le chiffre final ;
 *   · l'état d'arrivée est donc translateY(0). Aucun arrondi ne peut laisser
 *     apparaître une tranche du cran précédent, et la largeur de la colonne
 *     est celle du glyphe qui s'y arrête.
 * L'imprécision du pourcentage est ainsi repoussée à l'état de DÉPART, où
 * personne ne la voit.
 *
 * LA ROUE PART DE ZÉRO ET COMPTE : elle monte, elle ne descend jamais, comme
 * un odomètre qui avance. Sa vitesse est à peu près tenue (15 crans/s au
 * premier rang, 10 de plus à chaque rang vers la droite) : c'est le nombre de
 * TOURS qui s'ajuste à la durée, pas la vitesse qui s'ajuste aux tours. Sans
 * cela, le montant — qui roule plus longtemps pour s'arrêter après les deux
 * autres — tournerait visiblement plus lentement qu'eux.
 *
 * LE NOMBRE N'EXISTE QU'À PARTIR DE SON DÉPART, et c'est le point auquel la
 * première version se trompait. Les trois compteurs ne démarrent pas
 * ensemble ; celui du montant attend que les deux autres soient lancés.
 * Pendant ce temps, une roue au repos affichait 0 — et « 0 000 € » en corps
 * 6,6 rem n'est pas un compteur à l'arrêt : c'est un montant faux, affiché
 * gros, sous son propre libellé. La case reste donc vide, puis le compteur
 * s'allume AVEC son roulement. Jamais un chiffre que la cave ne vaut pas.
 *
 * ELLE N'A PAS D'OBSERVATEUR À ELLE. La séquence est conduite par le bloc du
 * mouvement III, qui propage « repos » puis « pose » ; chaque nombre n'apporte
 * que son retard et sa durée. Un observateur posé sur la roue ne la verrait
 * d'ailleurs jamais entrer dans le champ : au repos, elle est hors de sa
 * propre fenêtre.
 *
 * AU CLAVIER ET À LA VOIX, rien ne roule : les crans sont retirés de l'arbre
 * d'accessibilité et la valeur est lue une fois, telle quelle — espaces
 * insécables comprises. Avec `prefers-reduced-motion`, il ne reste que le
 * texte, dans le même conteneur, donc au même endroit exactement.
 */

/** Le rang de droite se verrouille le dernier : il roule un peu plus
 *  longtemps, et d'autant plus vite. */
const ECHELON = 0.08;
/** Crans par seconde, au premier rang puis de rang en rang. */
const VITESSE = 15;
const ACCELERATION = 10;

/** Part vite, ralentit, se verrouille. Aucun rebond : une roue ne rebondit
 *  pas, et un rebond ici dirait « widget ». */
const ROULEMENT = [0.26, 0.72, 0.05, 1] as const;

const CHIFFRE = /^[0-9]$/;

/** Un rang du compteur. */
function Cadran({
  chiffre,
  rang,
  delai,
  duree,
}: {
  chiffre: number;
  rang: number;
  delai: number;
  duree: number;
}) {
  const course = duree + rang * ECHELON;
  const tours = Math.max(
    1,
    Math.round(((VITESSE + ACCELERATION * rang) * course - chiffre) / 10),
  );
  /* De 0 inclus jusqu'au chiffre final : le dernier cran vaut
     (tours × 10 + chiffre) mod 10, soit exactement le chiffre attendu. */
  const crans = tours * 10 + chiffre + 1;

  return (
    <span aria-hidden className="relative block overflow-hidden">
      <span className="invisible block">{chiffre}</span>
      <motion.span
        data-cadran=""
        className="absolute inset-x-0 bottom-0 block"
        variants={{
          repos: { y: `${((crans - 1) / crans) * 100}%` },
          pose: { y: "0%" },
        }}
        transition={{ duration: course, delay: delai, ease: ROULEMENT }}
      >
        {Array.from({ length: crans }, (_, k) => (
          <span key={k} className="block">
            {k % 10}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function Roulement({
  valeur,
  delai,
  duree,
  className = "",
}: {
  /** La valeur finale, déjà formatée — espaces insécables comprises. */
  valeur: string;
  delai: number;
  duree: number;
  className?: string;
}) {
  const reduit = useReducedMotion();

  /* Le même conteneur flex dans les deux cas : c'est lui qui porte
     l'alignement (justify-end sur les lignes comptées). */
  if (reduit) {
    return <span className={`flex ${className}`}>{valeur}</span>;
  }

  let rang = -1;
  return (
    <motion.span
      className={`flex ${className}`}
      variants={{ repos: { opacity: 0 }, pose: { opacity: 1 } }}
      /* Le compteur s'allume en même temps qu'il part : assez vite pour qu'on
         ne le voie pas apparaître, assez lentement pour qu'il ne clignote
         pas. Le séparateur et le symbole s'allument avec lui — un « € » seul,
         suspendu au-dessus d'une case vide, serait pire que rien. */
      transition={{ duration: 0.16, delay: delai, ease: "linear" }}
    >
      <span className="sr-only">{valeur}</span>
      {[...valeur].map((c, i) => {
        if (!CHIFFRE.test(c)) {
          /* Séparateurs et symbole : ils ne tournent pas. `whitespace-pre`
             garde l'espace insécable étroite, qu'un élément flex seul
             laisserait tomber. */
          return (
            <span aria-hidden key={i} className="block whitespace-pre">
              {c}
            </span>
          );
        }
        rang += 1;
        return (
          <Cadran
            key={i}
            chiffre={Number(c)}
            rang={rang}
            delai={delai}
            duree={duree}
          />
        );
      })}
    </motion.span>
  );
}
