"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ciel } from "@/lib/lumiere";
import {
  AU_VERRE,
  MAISON,
  PAR_FAMILLE,
  PAR_REGION,
  REGLAGES,
  type Vin,
} from "@/lib/carte-imprimee-demonstration";

/**
 * MOUVEMENT IV — DE VOTRE CAVE À VOTRE CARTE.
 *
 * CE QUE CETTE SECTION DOIT PROUVER : ce que le restaurateur EMPORTE. Les
 * trois mouvements de « Geste » racontent des gestes ; celui-ci montre un
 * OBJET, et le montre en train de se faire.
 *
 * ══ LE DÉFAUT QUI EXPLIQUAIT TOUS LES AUTRES ═══════════════════════════
 *
 * LA SECTION LOUAIT SA MATIÈRE À SON VOISIN. `.tabac` — le cuir cognac — et
 * `.carte-papier` — la feuille crème encadrée — sont la signature du
 * mouvement II : sept emplois dans `Geste.tsx`, deux ici. Le mouvement IV
 * n'avait donc aucune matière propre, et se lisait comme un reste du II.
 * Les six défauts consignés par la version précédente étaient tous des
 * défauts de MOUVEMENT ; celui-là est un défaut d'IDENTITÉ, et aucune
 * chorégraphie ne pouvait le corriger.
 *
 * S'y ajoutaient cinq mesures :
 *
 *   1. QUATRE RECTANGLES EMBOÎTÉS — section, panneau de cuir, ombre, carte
 *      de papier. L'œil lit « capture d'écran d'un menu ».
 *   2. LA PREUVE ÉTAIT LE PLUS PETIT OBJET DE LA COMPOSITION : 31 rem dans
 *      un panneau rembourré de 40 px, soit un tiers de la largeur. Or
 *      l'objection de cette section est « qu'est-ce que j'emporte ? ».
 *   3. LE BLOC BRUN BLOQUAIT L'ARC DU JOUR. La page s'appelle « la lumière
 *      traversée » ; ici elle butait sur un panneau sombre au milieu de
 *      l'ivoire.
 *   4. UNE GRILLE DE QUATRE RÉGLAGES en `dl` 2×2 — un catalogue de
 *      paramètres, qui ne démontre rien.
 *   5. MOBILE : 23 px de marge de section, 20 de panneau, 32 de carte —
 *      230 px de colonne utile pour une carte à points de conduite, après
 *      1 690 px de section.
 *
 * ══ LA DIRECTION — « LE BON À TIRER » ══════════════════════════════════
 *
 * La section ne montre plus l'IMAGE d'une carte posée sur une table : elle
 * EST l'épreuve que Vintoria rend. Une page à sa proportion réelle — 1:√2,
 * celle de l'A4 comme de l'A5 — tenue par ses traits de coupe et par son
 * encre, et non par un cadre.
 *
 * UNE PAGE N'A PAS DE CADRE : ELLE A DES MARGES ET DES TRAITS DE COUPE.
 *
 *   · LE PAPIER EST LA MÊME LUMIÈRE, UN CHEVEU PLUS BLANCHE — #fdfcf8 sur
 *     un fond qui va de #faf6ec à #f7f0e2. Ce n'est pas un rectangle clair
 *     posé sur un fond, c'est la lumière de l'heure arrêtée par du papier.
 *     Ce qui tient l'objet, c'est l'ENCRE. Voir `.epreuve` dans globals.css,
 *     qui REMONTE ses jetons : rien ici n'écrit une couleur en dur.
 *   · ANGLES VIFS, ZÉRO RAYON. Trois rayons vivent dans `@theme` et tout le
 *     site les porte. Une feuille n'en a aucun — et ce seul détail fait lire
 *     « papier » plutôt que « panneau ».
 *   · QUATRE TRAITS DE COUPE, détachés du papier, qui remplacent la
 *     bordure — et qui INFORMENT : la page a un bord vrai et une taille
 *     vraie, écrite sous elle.
 *   · LE JET DE LUMIÈRE DE L'HEURE TRAVERSE LA PAGE. La section rentre dans
 *     l'arc au lieu de l'interrompre.
 *   · LES RÉGLAGES DEVIENNENT DES ANNOTATIONS DE MARGE. Les cinq classements
 *     en liste, un repère sur celui en cours ; la spécification du travail
 *     en une phrase, pas en tableau. Et le classement se DÉMONTRE : le
 *     repère descend, la page se recompose.
 *
 * ══ LE MOBILE EST CONÇU, PAS ADAPTÉ ═══════════════════════════════════
 *
 * Un téléphone est déjà une page portrait. La page y prend TOUTE la largeur
 * utile — 343 px à 390 contre 230 avant — en une seule colonne, et c'est
 * l'A5 QUI EST MONTRÉ : l'autre format réel du produit, celui qu'on choisit
 * pour une petite carte, avec l'échelle typographique 0,84 de `formats.ts`.
 * Le format annoncé suit l'écran, et il reste vrai.
 *
 * UNE PAGE D'A5 PORTE MOINS DE LIGNES QU'UNE PAGE D'A4 : le téléphone montre
 * « Au verre » entier puis la rubrique suivante, et le folio dit que c'est la
 * page 1. Rien n'est coupé au milieu d'une ligne. La marge passe SOUS la
 * page : le propos fait trois blocs courts, la démonstration commence dans le
 * premier écran et demi.
 *
 * ══ LE MOUVEMENT — DEUX CHOSES, ET RIEN D'AUTRE ═══════════════════════
 *
 *   A · 0 → 1,9 s   l'encre arrive : la tête, puis rubrique par rubrique
 *   B · 3,4 s       le classement change — le repère descend, la page se
 *                   recompose
 *
 * Puis plus rien. LA PAGE NE VOLE PLUS depuis la droite inclinée de 1,6° :
 * un papier qui vole est un effet, une encre qui se pose est le SUJET. Et la
 * respiration infinie de 3 px a disparu — une animation qui tourne pour
 * toujours est exactement ce que « animation gratuite » désigne, et elle
 * maintenait une couche de composition vivante jusqu'à la fin de la visite.
 *
 * DEUX LEÇONS DÉJÀ PAYÉES SONT CONSERVÉES :
 *
 *   · LES DEUX CLASSEMENTS PARTAGENT UNE CASE DE GRILLE. Une animation de
 *     disposition — chaque vin glissant vers sa nouvelle place par
 *     `layoutId` — était juste à l'œil et coûtait 1,825 de décalage cumulé,
 *     dont deux sauts de 0,76 et 0,78 à la bascule : le navigateur laisse le
 *     DOM se recalculer avant de compenser. Mieux encore ici : la géométrie
 *     de la page vient d'un `aspect-ratio`, donc de sa LARGEUR seule. Le
 *     contenu ne peut plus déplacer quoi que ce soit.
 *   · `anime` ET `parti` RESTENT DEUX BOOLÉENS. Les confondre coûtait la
 *     scène entière : tant que la section n'était pas vue, les lignes se
 *     rendaient SANS état initial — donc pleinement visibles — et Motion
 *     n'applique jamais un `initial` après le montage. Mesuré alors : onze
 *     lignes sur onze posées à zéro milliseconde.
 *
 * ET LE DÉCLENCHEUR OBSERVE LA PAGE, PAS LA SECTION. Posé sur la section, ses
 * 35 % étaient atteints 182 px avant que la feuille entre dans l'écran.
 *
 * ══ CE QUI A ÉTÉ MESURÉ, ET LES DEUX CHOSES QUI NE TIENNENT PAS ══════
 *
 * La proportion est EXACTE — 1,414 au pixel — à 1440, 1024, 768, 640 et
 * 390 px de fenêtre. Elle se perd sur les petits téléphones : 1,49 à 360 px,
 * 1,69 à 320. La raison est arithmétique et sans remède propre : la hauteur
 * du texte ne rétrécit pas avec la largeur, tandis que le plancher, lui, la
 * suit. Tenir la proportion à 320 px aurait demandé de retirer la seconde
 * rubrique — donc de rendre la bascule de classement INVISIBLE sur ces
 * écrans. Une démonstration qui se voit vaut mieux qu'une proportion qui se
 * mesure ; la page s'allonge, elle ne déborde jamais, et son folio reste au
 * pied.
 *
 * ET LA PAGE DU CLASSEMENT PAR RÉGION EST PLUS CREUSE que celle par famille :
 * quatorze lignes contre dix-huit, soit un quart de page blanc en bas. Ce
 * n'est pas un défaut de composition mais la donnée — `PAR_REGION` ne porte
 * que la première page de ce classement, et ses quatre régions tiennent
 * largement. Les combler demanderait d'inventer des régions ou d'en ajouter
 * quatre qui, elles, ne tiendraient plus : la page resterait fausse, et
 * mentirait en plus.
 *
 * TOUT CE QUI EST ÉCRIT VIENT DE lib/carte-imprimee-demonstration.ts, qui dit
 * sa provenance, et que tests/carte-vins.spec.ts relit dans le produit.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/** Les instants — secondes pour les délais, millisecondes pour la bascule. */
const T = {
  tete: 0.2,
  /** La première rubrique. */
  rubriques: 0.42,
  /** D'une rubrique à la suivante. */
  rubrique: 0.11,
  /** D'une ligne à la suivante. */
  pas: 0.042,
  /** Dans une ligne : les détails, les points, puis le prix. */
  details: 0.055,
  points: 0.085,
  prix: 0.13,
  folio: 0.95,
  /* La page finie se tient une seconde et demie avant que le classement
     bascule : sans ce repos, on ne voyait jamais le premier état achevé. */
  classement: 3400,
} as const;

type Rubrique = {
  readonly titre: string;
  readonly contenance: string;
  readonly vins: readonly Vin[];
};

/* ══════════════════════════════════════════════════════════════
   UNE LIGNE DE CARTE
   Nom, points de conduite, prix ; le domaine et le millésime dessous.
   Chaque rôle a son délai — c'est ce qui donne à la composition son
   rythme de composeur plutôt qu'un fondu d'ensemble.
   ══════════════════════════════════════════════════════════════ */
function Ligne({
  vin,
  delai,
  anime,
  parti,
}: {
  vin: Vin;
  delai: number;
  anime: boolean;
  parti: boolean;
}) {
  const paraitre = (d: number) =>
    anime
      ? {
          initial: { opacity: 0, y: 6 },
          animate: parti
            ? { opacity: 1, y: 0 }
            : ({ opacity: 0, y: 6 } as const),
          transition: { duration: 0.4, delay: delai + d, ease: EASE },
        }
      : {};

  return (
    <li className="py-[0.22rem] md:py-[0.34rem]">
      <span className="flex items-baseline gap-2">
        <motion.span
          {...paraitre(0)}
          className="gravure shrink-0 text-[0.8rem] leading-[1.2] text-[color:var(--color-fort)] md:text-[0.95rem] md:leading-[1.3]"
        >
          {vin.nom}
        </motion.span>
        {/* LES POINTS S'ÉTENDENT, du nom jusqu'au prix. `scaleX` depuis la
            gauche : une largeur animée aurait fait repasser la mise en page
            à chaque image. */}
        <motion.span
          aria-hidden
          initial={anime ? { scaleX: 0 } : false}
          animate={{ scaleX: anime && !parti ? 0 : 1 }}
          transition={{
            duration: anime ? 0.34 : 0,
            delay: anime ? delai + T.points : 0,
            ease: EASE,
          }}
          style={{ transformOrigin: "left" }}
          className="mb-[0.2rem] min-w-5 grow border-b border-dotted border-[color:var(--color-filet-fort)]"
        />
        <motion.span
          {...paraitre(T.prix)}
          className="data shrink-0 text-[0.7rem] tabular-nums text-[color:var(--color-fort)] md:text-[0.78rem]"
        >
          {vin.prix}
        </motion.span>
      </span>
      <motion.span
        {...paraitre(T.details)}
        className="data mt-[0.1rem] block text-[0.55rem] leading-[1.2] tracking-[0.04em] text-[color:var(--color-faible)] md:text-[0.62rem] md:leading-[1.3]"
      >
        {vin.domaine} · {vin.lieu}
        {vin.millesime ? ` · ${vin.millesime}` : ""}
      </motion.span>
    </li>
  );
}

/* ══════════════════════════════════════════════════════════════
   UNE RUBRIQUE — son titre, son filet qui se tire, sa contenance.

   SA MARGE EST EN BAS, ET C'EST LA COLONNE QUI L'EXIGE. Au-delà de `md` les
   rubriques coulent dans deux colonnes, et une marge HAUTE s'applique aussi
   au premier élément de la seconde colonne : les deux colonnes ne
   commençaient plus à la même ligne de pied. Mesuré : 20 px d'écart, assez
   pour qu'une page composée paraisse mal imposée.
   ══════════════════════════════════════════════════════════════ */
function RubriqueCarte({
  rubrique,
  depart,
  anime,
  parti,
  a5,
}: {
  rubrique: Rubrique;
  depart: number;
  anime: boolean;
  parti: boolean;
  /** Vraie si la rubrique tient aussi sur la page d'A5, celle du téléphone. */
  a5: boolean;
}) {
  const paraitre = (d: number) =>
    anime
      ? {
          initial: { opacity: 0, y: 5 },
          animate: parti
            ? { opacity: 1, y: 0 }
            : ({ opacity: 0, y: 5 } as const),
          transition: { duration: 0.38, delay: depart + d, ease: EASE },
        }
      : {};

  return (
    <section
      className={`mb-3.5 break-inside-avoid last:mb-0 md:mb-4 ${a5 ? "" : "hidden md:block"}`}
    >
      <header className="relative flex items-baseline justify-between gap-3 pb-0.5 md:pb-1">
        <motion.h4
          {...paraitre(0)}
          className="gravure text-[0.72rem] tracking-[0.14em] text-[color:var(--color-fort)] uppercase md:text-[0.84rem]"
        >
          {rubrique.titre}
        </motion.h4>
        <motion.p
          {...paraitre(0.06)}
          className="data text-[0.52rem] tracking-[0.1em] text-[color:var(--color-faible)] md:text-[0.58rem]"
        >
          {rubrique.contenance} — Prix
        </motion.p>
        <motion.span
          aria-hidden
          initial={anime ? { scaleX: 0 } : false}
          animate={{ scaleX: anime && !parti ? 0 : 1 }}
          transition={{
            duration: anime ? 0.44 : 0,
            delay: anime ? depart + 0.05 : 0,
            ease: EASE,
          }}
          style={{ transformOrigin: "left" }}
          className="absolute inset-x-0 bottom-0 border-b border-[color:var(--color-filet-fort)]"
        />
      </header>
      <ul className="mt-1 md:mt-1.5">
        {rubrique.vins.map((v, i) => (
          <Ligne
            key={v.nom}
            vin={v}
            delai={depart + 0.2 + i * T.pas}
            anime={anime}
            parti={parti}
          />
        ))}
      </ul>
    </section>
  );
}

/**
 * LES DEUX CLASSEMENTS, et ce qui tient sur chaque format.
 *
 * `a5` dit qu'une rubrique tient aussi sur la page du téléphone. Ce n'est pas
 * un repli : une page d'A5 porte moins de lignes qu'une page d'A4, et la
 * légende sous la feuille annonce le format qu'elle montre. Le folio dit que
 * c'est la page 1 — ce qu'une carte de restaurant est toujours.
 *
 * LES VINS SERVIS AU VERRE OUVRENT LES DEUX CLASSEMENTS, parce que c'est la
 * règle du produit (`organisation.ts`, relu par le garde-fou) et non une
 * décision de mise en page. La tête de la page ne bouge donc pas à la
 * bascule : seules les rubriques en bouteille se réorganisent, et c'est
 * exactement ce que le deuxième temps doit faire comprendre.
 */
const ETATS = [
  {
    cle: "recommandée",
    rubriques: [
      { r: AU_VERRE as Rubrique, a5: true },
      ...PAR_FAMILLE.map((r, i) => ({ r: r as Rubrique, a5: i === 0 })),
    ],
  },
  {
    cle: "région",
    rubriques: [
      { r: AU_VERRE as Rubrique, a5: true },
      ...PAR_REGION.map((r, i) => ({ r: r as Rubrique, a5: i === 0 })),
    ],
  },
] as const;

export function CarteDesVins() {
  const reduit = useReducedMotion();
  const page = useRef<HTMLDivElement>(null);
  const vu = useInView(page, { once: true, amount: 0.2 });
  const [parRegion, setParRegion] = useState(false);
  const anime = !reduit;
  const parti = vu || !anime;

  useEffect(() => {
    if (!vu || !anime) return;
    const t = window.setTimeout(() => setParRegion(true), T.classement);
    return () => window.clearTimeout(t);
  }, [vu, anime]);

  const classement = parRegion ? "région" : "recommandée";
  const rang = REGLAGES.organisations.indexOf(classement);

  return (
    <section
      id="carte"
      className="mouvement grain-clair relative isolate overflow-x-clip"
      style={{ background: ciel("accord") }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Le jet tombe SUR la page, et non à côté : c'est la lumière de
            l'heure qui éclaire la feuille, pas un décor de fond. */}
        <div className="jet top-[-20%] left-[30%] h-[72%] opacity-50" />
      </div>

      {/*
        UNE MESURE DE 1 240 PX, ET NON 1 420 COMME LES AUTRES MOUVEMENTS.
        Une page et sa marge n'ont pas besoin de toute la largeur : étirées,
        l'annotation se détache de ce qu'elle annote, et la feuille ne peut
        pas suivre — une A4 de 56 rem ferait 1 268 px de haut. La marge
        gauche reste celle du site (`.px`) : seul le bord droit se resserre,
        là où le jet occupe l'air.
      */}
      <div className="px relative z-10 mx-auto grid w-full max-w-[1240px] gap-y-10 lg:grid-cols-[minmax(0,36rem)_minmax(0,1fr)] lg:gap-x-14 lg:gap-y-12">
        {/* ══ LE BANDEAU ══
            Il porte la MÊME grille que la composition : le titre tombe donc
            exactement sur la page, et le propos exactement sur la marge. */}
        <motion.header
          initial={{ opacity: 0, y: reduit ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduit ? 0 : 0.8, ease: EASE }}
          className="grid gap-y-7 border-b border-[color:var(--color-filet)] pb-9 lg:col-span-2 lg:grid-cols-[minmax(0,36rem)_minmax(0,1fr)] lg:items-end lg:gap-x-14"
        >
          <div>
            <p className="eyebrow text-[color:var(--color-faible)]">
              La carte des vins
            </p>
            <h2 className="strophe mt-5 text-[clamp(2rem,4.6vw,3.6rem)]">
              De votre cave
              <br />à votre carte.
            </h2>
          </div>
          <p className="voix max-w-[34ch] text-[1.05rem] leading-[1.5] text-pretty text-[color:var(--color-texte)]">
            Vos vins, mis en page automatiquement. Vous choisissez le
            classement, le format et le style ; Vintoria compose les pages et
            vous rend le PDF.
          </p>
        </motion.header>

        {/* ══ LA PAGE ══ */}
        <div ref={page} className="max-w-[30rem] md:max-w-[36rem]">
          {/*
            LE FOND PERDU N'ENTOURE QUE LA PAGE, et la légende reste dehors.
            Les deux étaient d'abord dans la même boîte : les traits de coupe
            se posaient alors 50 px sous la feuille, autour du bloc entier.
            Un trait de coupe qui ne tombe pas sur le bord à rogner ne dit
            plus rien — c'est redevenu un cadre, et un cadre faux.
          */}
          <div className="fond-perdu relative">
            {/* Ils se resserrent sur petit écran : à 8 px du bord ils ne
                volent pas de largeur au papier, et ils restent dans la marge
                de la section — donc jamais de débordement horizontal. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-2 sm:-inset-3"
            >
              <span className="coupe top-0 left-0 border-t border-l" />
              <span className="coupe top-0 right-0 border-t border-r" />
              <span className="coupe bottom-0 left-0 border-b border-l" />
              <span className="coupe right-0 bottom-0 border-r border-b" />
            </div>

            {/*
            LES MARGES SONT CELLES DU FORMAT, en pourcentage de la largeur —
            donc du format lui-même, et non d'un écran. `formats.ts` donne
            24/22 mm sur 210 pour l'A4 et 16/15 sur 148 pour l'A5 : 11,4 % et
            10,8 %. On tient 10 % sur le téléphone, 8 % au-delà de `md`, où
            la page gagne sa seconde colonne et où chaque millimètre de
            colonne compte.
          */}
            <article className="epreuve w-full px-[10%] pt-[7.5%] pb-[5.5%] md:px-[8%] md:pt-[6.5%] md:pb-[4.5%]">
              <div className="relative z-[1] flex flex-1 flex-col">
                {/* ── LA TÊTE ── */}
                <header className="text-center">
                  <motion.h3
                    initial={anime ? { opacity: 0, y: 6 } : false}
                    animate={parti ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: anime ? 0.5 : 0,
                      delay: anime ? T.tete : 0,
                      ease: EASE,
                    }}
                    className="gravure text-[0.95rem] tracking-[0.06em] text-[color:var(--color-fort)] md:text-[1.05rem]"
                  >
                    {MAISON}
                  </motion.h3>
                  <motion.p
                    initial={anime ? { opacity: 0 } : false}
                    animate={parti ? { opacity: 1 } : {}}
                    transition={{
                      duration: anime ? 0.42 : 0,
                      delay: anime ? T.tete + 0.1 : 0,
                      ease: EASE,
                    }}
                    className="data mt-1 text-[0.54rem] tracking-[0.3em] text-[color:var(--color-faible)] uppercase md:mt-1.5 md:text-[0.58rem]"
                  >
                    Carte des vins
                  </motion.p>
                  <motion.span
                    aria-hidden
                    initial={anime ? { scaleX: 0 } : false}
                    animate={parti ? { scaleX: 1 } : {}}
                    transition={{
                      duration: anime ? 0.55 : 0,
                      delay: anime ? T.tete + 0.16 : 0,
                      ease: EASE,
                    }}
                    className="mx-auto mt-2.5 block h-px w-10 bg-[color:var(--color-accent)] md:mt-3"
                  />
                </header>

                {/*
                ══ LES DEUX CLASSEMENTS, UNE SEULE CASE DE GRILLE ══

                Ils occupent le même espace : rien ne se recalcule, et la
                bascule n'est qu'une affaire d'opacité et de translation. On
                perd le voyage individuel de chaque ligne ; on gagne une page
                qui ne tremble jamais sous le lecteur — voir l'en-tête, et les
                1,825 de décalage cumulé qu'a coûté l'autre voie.

                `flex-1` donne à la case la hauteur qui reste : les rubriques
                coulent donc jusqu'au pied de la page, et le folio s'y pose.
                C'est aussi ce qui permet aux deux colonnes de s'équilibrer —
                un `columns` sans hauteur définie se contente de la hauteur la
                plus courte, et la page paraissait alors à moitié vide.
              */}
                <div className="relative mt-4 grid flex-1 grid-cols-[minmax(0,1fr)] md:mt-6">
                  {ETATS.map((etat) => {
                    const ici = etat.cle === classement;
                    return (
                      <motion.div
                        key={etat.cle}
                        aria-hidden={!ici}
                        initial={false}
                        animate={{
                          opacity: ici ? 1 : 0,
                          y: anime
                            ? ici
                              ? 0
                              : etat.cle === "région"
                                ? 10
                                : -10
                            : 0,
                        }}
                        transition={{ duration: anime ? 0.5 : 0, ease: EASE }}
                        style={{
                          gridArea: "1 / 1",
                          pointerEvents: ici ? undefined : "none",
                        }}
                        className="md:columns-2 md:gap-9"
                      >
                        {etat.rubriques.map(({ r, a5 }, i) => (
                          <RubriqueCarte
                            key={`${etat.cle}-${r.titre}`}
                            rubrique={r}
                            a5={a5}
                            depart={T.rubriques + i * T.rubrique}
                            anime={anime && etat.cle === "recommandée"}
                            parti={parti}
                          />
                        ))}
                      </motion.div>
                    );
                  })}
                </div>

                {/* LE FOLIO — une page de carte est toujours la page d'un
                  cahier. Il n'annonce pas de total : il n'en promet aucun. */}
                <motion.p
                  initial={anime ? { opacity: 0 } : false}
                  animate={parti ? { opacity: 1 } : {}}
                  transition={{
                    duration: anime ? 0.5 : 0,
                    delay: anime ? T.folio : 0,
                    ease: EASE,
                  }}
                  className="data mt-5 text-center text-[0.52rem] tracking-[0.2em] text-[color:var(--color-faible)] md:text-[0.56rem]"
                >
                  — 1 —
                </motion.p>
              </div>
            </article>
          </div>

          {/* LA TAILLE VRAIE, SOUS LA PAGE. C'est la légende d'un bon à
              tirer, et c'est elle qui fait des traits de coupe une
              information plutôt qu'un ornement. Le format suit l'écran
              parce que la page suit l'écran. */}
          <p className="data mt-7 text-[0.56rem] tracking-[0.16em] text-[color:var(--color-faible)] uppercase sm:mt-8">
            <span className="md:hidden">
              {REGLAGES.formats[1]} · 148 × 210 mm
            </span>
            <span className="hidden md:inline">
              {REGLAGES.formats[0]} · 210 × 297 mm
            </span>
            {" · page 1"}
          </p>
        </div>

        {/* ══ LA MARGE — les annotations du travail ══ */}
        <div className="max-w-[22rem] lg:pt-1">
          <p className="eyebrow text-[color:var(--color-faible)]">Classement</p>

          {/*
            LE REPÈRE DESCEND, IL NE SE DÉPLACE PAS D'UNE LIGNE À L'AUTRE.
            C'est un seul élément en absolu, haut d'exactement une ligne, que
            l'on translate de 100 % par rang : aucune disposition n'est
            recalculée, et la liste ne peut pas sauter. D'où `leading-[1.9]`,
            qui n'est pas un réglage de confort mais la hauteur du pas.

            La liste est la zone vive : le mot qui gagne « en cours » est
            annoncé, celui qui le perd aussi. Sans cela, la bascule serait
            muette pour qui ne voit pas le repère bouger.
          */}
          <ul
            aria-live="polite"
            className="relative mt-3 text-[0.95rem] leading-[1.9] text-[color:var(--color-faible)]"
          >
            <motion.span
              aria-hidden
              className="absolute top-0 left-0 flex h-[1.9em] items-center"
              initial={false}
              animate={{ y: `${rang * 100}%` }}
              transition={{ duration: anime ? 0.42 : 0, ease: EASE }}
            >
              <span className="block h-[3px] w-[3px] bg-[color:var(--color-accent)]" />
            </motion.span>
            {REGLAGES.organisations.map((o) => {
              const ici = o === classement;
              return (
                <li
                  key={o}
                  aria-current={ici ? "true" : undefined}
                  className={`voix pl-5 transition-colors duration-300 ${
                    ici ? "text-[color:var(--color-fort)]" : ""
                  }`}
                >
                  {o}
                  {ici ? (
                    <span className="sr-only"> — classement en cours</span>
                  ) : null}
                </li>
              );
            })}
          </ul>

          {/* ET LA SPÉCIFICATION DU TRAVAIL — une phrase, pas un tableau.
              Les valeurs viennent de REGLAGES : un format ajouté chez le
              produit s'écrit ici sans qu'on y touche. */}
          <p className="voix mt-7 max-w-[30ch] border-t border-[color:var(--color-filet)] pt-7 text-[0.95rem] leading-[1.55] text-pretty text-[color:var(--color-texte)]">
            Le même PDF en {REGLAGES.formats.join(" ou ")}, en style{" "}
            {REGLAGES.styles.slice(0, -1).join(", ")} ou{" "}
            {REGLAGES.styles[REGLAGES.styles.length - 1]}, et en{" "}
            {REGLAGES.langues.join(" · ")}.
          </p>
        </div>
      </div>
    </section>
  );
}
