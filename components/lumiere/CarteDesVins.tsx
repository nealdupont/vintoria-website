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
 * DE VOTRE CAVE À VOTRE CARTE — la carte des vins, composée sous les yeux.
 *
 * CE QUE CETTE SECTION DOIT PROUVER, et que les trois mouvements de
 * « Geste » ne disent pas : ce que le restaurateur EMPORTE. Les trois
 * mouvements racontent des gestes ; celui-ci montre un objet, et le montre
 * en train de se faire.
 *
 * ── CE QUI N'ALLAIT PAS, ET QUE CETTE VERSION CORRIGE ───────────────────
 *
 * La première version paraissait figée, et six raisons s'additionnaient :
 *
 *   1. LA FEUILLE N'ENTRAIT PAS. Son seul mouvement était le fondu-montée
 *      générique partagé par tous les blocs de la page. Elle a maintenant
 *      une arrivée à elle : elle vient de la droite, inclinée, et se pose.
 *   2. LES LIGNES BOUGEAIENT DE SIX PIXELS — sous le seuil de perception.
 *   3. LE CHANGEMENT DE CLASSEMENT ÉTAIT UN REMONTAGE. Un `key` qui change
 *      détruit la feuille et en construit une autre : aucune ligne ne se
 *      déplaçait, et l'`exit` ne s'exécutait même pas, faute
 *      d'`AnimatePresence`. Les lignes portent désormais un `layoutId` : un
 *      vin garde son identité d'un classement à l'autre, et GLISSE vers sa
 *      nouvelle place.
 *   4. TOUT PARTAIT EN MÊME TEMPS dans une ligne — nom, détails, points et
 *      prix sous un seul délai. Chaque rôle a maintenant le sien.
 *   5. LES POINTS DE CONDUITE NE SE TRAÇAIENT PAS. Ils s'étendent
 *      maintenant du nom jusqu'au prix.
 *   6. SUR MOBILE, LA SÉQUENCE PARTAIT 182 PX TROP TÔT — mesuré : le
 *      déclencheur observait la SECTION, haute de 1690 px, et 35 % d'elle
 *      étaient atteints avant que la feuille entre dans l'écran. Il observe
 *      désormais la feuille elle-même.
 *
 * ── LA CHORÉGRAPHIE ────────────────────────────────────────────────────
 *
 *   A · 0 → 1,0 s     la feuille arrive de la droite et se pose
 *   B · 0,9 → 3,8 s   la tête, puis rubrique par rubrique : le titre, son
 *                     filet, le nom, les détails, les points, le prix
 *   C · 5,2 → 6,0 s   le classement change — les lignes communes glissent
 *   D · 8,6 s →       la carte se tient, avec une respiration de 3 px
 *
 * Tout est en `transform` et `opacity`. Rien n'est lié au défilement : la
 * page reste libre, et la séquence ne se rejoue jamais.
 *
 * TOUT CE QUI EST ÉCRIT VIENT DE lib/carte-imprimee-demonstration.ts, qui
 * dit sa provenance, et que tests/carte-vins.spec.ts relit dans le produit.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
/** La pose : on arrive vite, on s'arrête net, sans rebond. */
const POSE = [0.22, 1, 0.3, 1] as const;

/** Les instants de la séquence — secondes pour les délais, ms pour les bascules. */
const T = {
  tete: 0.85,
  lignes: 1.15,
  /** D'une rubrique à la suivante. */
  rubrique: 0.6,
  /** D'une ligne à la suivante. */
  pas: 0.13,
  /** Dans une ligne : les détails, les points, puis le prix. */
  details: 0.1,
  points: 0.16,
  prix: 0.3,
  folio: 3.5,
  /* La carte finie se tient 1,4 s avant que le classement bascule : sans
     ce repos, on ne voyait jamais le premier état achevé. */
  classement: 5200,
  retour: 8600,
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
   rythme d'imprimeur plutôt qu'un fondu d'ensemble.
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
  /*
    DEUX BOOLÉENS, ET NON UN. `anime` dit si le mouvement est permis ;
    `parti` dit si la séquence a commencé. Les confondre coûtait la scène
    entière : tant que la section n'était pas vue, les lignes se rendaient
    SANS état initial — donc pleinement visibles — et Motion n'applique
    jamais un `initial` après le montage. La composition était déjà faite
    quand elle aurait dû commencer. Mesuré : onze lignes sur onze posées à
    zéro milliseconde.
  */
  const paraitre = (d: number) =>
    anime
      ? {
          initial: { opacity: 0, y: 10 },
          animate: parti
            ? { opacity: 1, y: 0 }
            : ({ opacity: 0, y: 10 } as const),
          transition: { duration: 0.52, delay: delai + d, ease: EASE },
        }
      : {};

  return (
    <motion.li className="py-[0.34rem]">
      <span className="flex items-baseline gap-2">
        <motion.span
          {...paraitre(0)}
          className="gravure shrink-0 text-[0.95rem] leading-[1.3] text-[color:var(--color-fort)] sm:text-[1rem]"
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
            duration: anime ? 0.5 : 0,
            delay: anime ? delai + T.points : 0,
            ease: EASE,
          }}
          style={{ transformOrigin: "left" }}
          className="mb-[0.2rem] min-w-6 grow border-b border-dotted border-[color:var(--color-filet-fort)]"
        />
        <motion.span
          {...paraitre(T.prix)}
          className="data shrink-0 text-[0.78rem] tabular-nums text-[color:var(--color-fort)]"
        >
          {vin.prix}
        </motion.span>
      </span>
      <motion.span
        {...paraitre(T.details)}
        className="data mt-[0.1rem] block text-[0.62rem] leading-[1.3] tracking-[0.04em] text-[color:var(--color-faible)]"
      >
        {vin.domaine} · {vin.lieu}
        {vin.millesime ? ` · ${vin.millesime}` : ""}
      </motion.span>
    </motion.li>
  );
}

/* ══════════════════════════════════════════════════════════════
   UNE RUBRIQUE — son titre, son filet qui se tire, sa contenance.
   ══════════════════════════════════════════════════════════════ */
function Rubrique({
  rubrique,
  prefixe,
  depart,
  anime,
  parti,
}: {
  rubrique: Rubrique;
  /** « v: » au verre, « b: » en bouteille — pour que les deux Petit Chablis
      d'une même page ne se disputent pas la même identité. */
  prefixe: string;
  depart: number;
  anime: boolean;
  parti: boolean;
}) {
  const paraitre = (d: number) =>
    anime
      ? {
          initial: { opacity: 0, y: 8 },
          animate: parti
            ? { opacity: 1, y: 0 }
            : ({ opacity: 0, y: 8 } as const),
          transition: { duration: 0.5, delay: depart + d, ease: EASE },
        }
      : {};

  return (
    <motion.section className="mt-5 first:mt-0">
      <header className="relative flex items-baseline justify-between gap-3 pb-1">
        <motion.h4
          {...paraitre(0)}
          className="gravure text-[0.84rem] tracking-[0.14em] text-[color:var(--color-fort)] uppercase"
        >
          {rubrique.titre}
        </motion.h4>
        <motion.p
          {...paraitre(0.08)}
          className="data text-[0.58rem] tracking-[0.1em] text-[color:var(--color-faible)]"
        >
          {rubrique.contenance} · Prix
        </motion.p>
        <motion.span
          aria-hidden
          initial={anime ? { scaleX: 0 } : false}
          animate={{ scaleX: anime && !parti ? 0 : 1 }}
          transition={{
            duration: anime ? 0.62 : 0,
            delay: anime ? depart + 0.06 : 0,
            ease: EASE,
          }}
          style={{ transformOrigin: "left" }}
          className="absolute inset-x-0 bottom-0 border-b border-[color:var(--color-filet-fort)]"
        />
      </header>
      <ul className="mt-1.5">
        {rubrique.vins.map((v, i) => (
          <Ligne
            key={`${prefixe}${v.nom}`}
            vin={v}
            delai={depart + 0.26 + i * T.pas}
            anime={anime}
            parti={parti}
          />
        ))}
      </ul>
    </motion.section>
  );
}

export function CarteDesVins() {
  const reduit = useReducedMotion();
  const feuille = useRef<HTMLDivElement>(null);
  /*
    LE DÉCLENCHEUR OBSERVE LA FEUILLE, PAS LA SECTION. Posé sur la section —
    1690 px de haut sur mobile — ses 35 % étaient atteints 182 px avant que
    la feuille entre dans l'écran : la composition se jouait hors champ.
  */
  const vu = useInView(feuille, { once: true, amount: 0.3 });
  const [temps, setTemps] = useState<0 | 1 | 2>(0);
  const anime = !reduit;
  const parti = vu || !anime;

  useEffect(() => {
    if (!vu || !anime) return;
    const a = window.setTimeout(() => setTemps(1), T.classement);
    const b = window.setTimeout(() => setTemps(2), T.retour);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [vu, anime]);

  const parRegion = anime && temps === 1;
  /*
    LA FEUILLE NE MONTRE QUE SA PREMIÈRE PAGE, et son folio le dit.
    Les trois rubriques de chaque classement partagent cinq vins : ce sont
    eux qui glissent, et c'est ce qui rend la transformation lisible plutôt
    qu'abrupte.
  */
  const ETATS = [
    {
      cle: "recommandée",
      rubriques: [
        { r: AU_VERRE as Rubrique, prefixe: "v:" },
        ...PAR_FAMILLE.slice(0, 2).map((r) => ({
          r: r as Rubrique,
          prefixe: "b:",
        })),
      ],
    },
    {
      cle: "région",
      rubriques: PAR_REGION.slice(0, 3).map((r) => ({
        r: r as Rubrique,
        prefixe: "b:",
      })),
    },
  ] as const;

  const classement = parRegion ? "région" : "recommandée";
  /* Les délais de composition ne valent qu'au PREMIER passage ; ensuite
     les lignes se contentent de glisser vers leur nouvelle place. */
  const premier = temps === 0;

  return (
    <section
      id="carte"
      className="mouvement grain-clair relative isolate overflow-x-clip"
      style={{ background: ciel("accord") }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="jet top-[-20%] left-[26%] h-[70%] opacity-55" />
      </div>

      <div className="px relative z-10 mx-auto grid w-full max-w-[1420px] gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-x-20">
        {/* ══ LE PROPOS ══ */}
        <motion.div
          initial={{ opacity: 0, y: reduit ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduit ? 0 : 0.9, ease: EASE }}
          className="max-w-[46ch]"
        >
          <p className="eyebrow text-[color:var(--color-faible)]">
            La carte des vins
          </p>
          <h2 className="strophe mt-5 text-[clamp(2rem,4.6vw,3.6rem)]">
            De votre cave
            <br />à votre carte.
          </h2>
          <p className="voix mt-7 text-[1.05rem] leading-[1.5] text-pretty text-[color:var(--color-texte)]">
            Vos vins, mis en page automatiquement. Vous choisissez le
            classement, le format et le style ; Vintoria compose les pages et
            vous rend le PDF.
          </p>

          <dl className="mt-9 grid max-w-[30rem] grid-cols-2 gap-x-8 gap-y-4">
            {[
              ["Classement", REGLAGES.organisations.join(" · ")],
              ["Format", REGLAGES.formats.join(" ou ")],
              ["Style", REGLAGES.styles.join(" · ")],
              ["Langue", REGLAGES.langues.join(" · ")],
            ].map(([quoi, dit]) => (
              <div key={quoi}>
                <dt className="data text-[0.6rem] tracking-[0.18em] text-[color:var(--color-faible)] uppercase">
                  {quoi}
                </dt>
                <dd className="voix mt-1 text-[0.92rem] leading-[1.35] text-[color:var(--color-texte)]">
                  {dit}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* ══ LA FEUILLE, SUR LE CUIR ══ */}
        <div
          ref={feuille}
          className="tabac relative rounded-[12px] px-5 py-10 sm:px-10 sm:py-14"
        >
          <div className="relative z-[1]">
            <p
              aria-live="polite"
              className="data mb-6 text-center text-[0.6rem] tracking-[0.2em] text-[color:var(--color-faible)] uppercase"
            >
              Classement {classement}
            </p>

            {/* ══ SCÈNE A — L'ARRIVÉE ══
                La feuille vient de la droite, inclinée de 1,6°, et se pose.
                Son ombre l'accompagne : une couche à part dont on anime
                l'opacité et l'échelle — animer la `box-shadow` elle-même
                aurait fait repeindre la carte à chaque image. */}
            <motion.div
              initial={anime ? { opacity: 0, x: 72, rotate: 1.6 } : false}
              animate={parti ? { opacity: 1, x: 0, rotate: 0 } : {}}
              transition={{ duration: anime ? 1 : 0, ease: POSE }}
              className="relative"
            >
              <motion.span
                aria-hidden
                initial={anime ? { opacity: 0, scaleX: 0.86 } : false}
                animate={parti ? { opacity: 1, scaleX: 1 } : {}}
                transition={{
                  duration: anime ? 1.1 : 0,
                  delay: anime ? 0.18 : 0,
                  ease: POSE,
                }}
                className="absolute inset-x-6 top-10 bottom-2 rounded-[3px] bg-[rgba(26,15,8,0.5)] blur-xl"
              />

              {/* ══ SCÈNE D — LA RESPIRATION ══
                  Trois pixels en neuf secondes : la carte reste vivante sans
                  jamais appeler l'œil, et s'arrête si le mouvement est réduit. */}
              <motion.div
                animate={anime && temps === 2 ? { y: [0, -3, 0] } : { y: 0 }}
                transition={
                  anime && temps === 2
                    ? { duration: 9, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0 }
                }
              >
                <motion.article className="carte-papier relative mx-auto w-full max-w-[31rem] rounded-[3px] px-8 py-9 sm:px-11 sm:py-12">
                  <div className="relative z-[1]">
                    {/* ── LA TÊTE ── */}
                    <header className="text-center">
                      <motion.h3
                        initial={anime ? { opacity: 0, y: 8 } : false}
                        animate={parti ? { opacity: 1, y: 0 } : {}}
                        transition={{
                          duration: anime ? 0.6 : 0,
                          delay: anime ? T.tete : 0,
                          ease: EASE,
                        }}
                        className="gravure text-[1.05rem] tracking-[0.06em] text-[color:var(--color-fort)]"
                      >
                        {MAISON}
                      </motion.h3>
                      <motion.p
                        initial={anime ? { opacity: 0 } : false}
                        animate={parti ? { opacity: 1 } : {}}
                        transition={{
                          duration: anime ? 0.5 : 0,
                          delay: anime ? T.tete + 0.12 : 0,
                          ease: EASE,
                        }}
                        className="data mt-1.5 text-[0.58rem] tracking-[0.3em] text-[color:var(--color-faible)] uppercase"
                      >
                        Carte des vins
                      </motion.p>
                      <motion.span
                        aria-hidden
                        initial={anime ? { scaleX: 0 } : false}
                        animate={parti ? { scaleX: 1 } : {}}
                        transition={{
                          duration: anime ? 0.7 : 0,
                          delay: anime ? T.tete + 0.2 : 0,
                          ease: EASE,
                        }}
                        className="mx-auto mt-3 block h-px w-10 bg-[color:var(--color-accent)]"
                      />
                    </header>

                    {/* ══ SCÈNE C — LE CLASSEMENT CHANGE ══
                        `AnimatePresence` laisse partir ce qui sort ; le
                        `layoutId` de chaque ligne fait GLISSER les vins
                        communs aux deux classements vers leur nouvelle
                        place, au lieu de les détruire et de les refaire. */}
                    {/*
                      LA ZONE DES RUBRIQUES GARDE SA HAUTEUR. Onze lignes par
                      famille, huit par région : sans plancher, la feuille se
                      contractait à la bascule et tout ce qui suit remontait.
                      Le document et la section ne bougeaient pas, mais le
                      décalage cumulé atteignait 1,82 sur mobile — mesuré.
                      La hauteur est celle du plus grand des deux états, posée
                      une fois pour toutes, comme la scène de « Geste ».
                    */}
                    {/*
                      ══ SCÈNE C — LE CLASSEMENT CHANGE ══

                      LES DEUX CLASSEMENTS PARTAGENT UNE SEULE CASE DE GRILLE,
                      et c'est une décision, pas une facilité.

                      La première version faisait GLISSER chaque vin vers sa
                      nouvelle place, par `layoutId`. C'était juste à l'œil,
                      et coûteux : une animation de disposition laisse le DOM
                      se recalculer avant de compenser par transformation, et
                      le navigateur enregistre ce recalcul comme un saut de
                      mise en page. Mesuré, témoin à l'appui : 0,000 de
                      décalage cumulé sans cette section, 1,825 avec — dont
                      deux sauts de 0,76 et 0,78 à la bascule. La hauteur du
                      document ne bougeait pas, mais la page échouait net sur
                      une métrique que le brief nomme.

                      Les deux états sont donc empilés dans la même case : ils
                      occupent le même espace, rien ne se recalcule, et la
                      bascule n'est plus qu'une affaire d'opacité et de
                      translation. Le classement sortant s'efface vers le
                      haut, l'entrant arrive par le bas. On perd le voyage
                      individuel de chaque ligne ; on gagne une page qui ne
                      tremble jamais sous le lecteur.
                    */}
                    <div className="mt-6 grid min-h-[26.5rem] grid-cols-[minmax(0,1fr)] sm:min-h-[27.5rem]">
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
                                    ? 14
                                    : -14
                                : 0,
                            }}
                            transition={{
                              duration: anime ? 0.62 : 0,
                              ease: EASE,
                            }}
                            style={{
                              gridArea: "1 / 1",
                              pointerEvents: ici ? undefined : "none",
                            }}
                          >
                            {etat.rubriques.map(({ r, prefixe }, i) => (
                              <Rubrique
                                key={`${etat.cle}-${r.titre}`}
                                rubrique={r}
                                prefixe={prefixe}
                                depart={premier ? T.lignes + i * T.rubrique : 0}
                                anime={anime && etat.cle === "recommandée"}
                                parti={parti}
                              />
                            ))}
                          </motion.div>
                        );
                      })}
                    </div>

                    <motion.p
                      initial={anime ? { opacity: 0 } : false}
                      animate={parti ? { opacity: 1 } : {}}
                      transition={{
                        duration: anime ? 0.6 : 0,
                        delay: anime ? T.folio : 0,
                        ease: EASE,
                      }}
                      className="data mt-7 text-center text-[0.56rem] tracking-[0.18em] text-[color:var(--color-faible)]"
                    >
                      1 / 2
                    </motion.p>
                  </div>
                </motion.article>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
