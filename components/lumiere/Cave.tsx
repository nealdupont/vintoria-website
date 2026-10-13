"use client";

import { useCallback, useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ciel } from "@/lib/lumiere";
import { COMPTE, VALEUR, VIGILANCE } from "@/lib/cave-demonstration";
import { Roulement } from "./Roulement";

/**
 * MOUVEMENT III — LA CAVE.
 *
 * UN PORTRAIT ÉCONOMIQUE, PAS UN TABLEAU DE BORD.
 * La version précédente alignait trois statistiques de même poids. Elles
 * disaient ce que la cave CONTIENT ; elles ne disaient pas ce qu'elle VAUT.
 * Or le sous-titre promettait déjà « ce que ça vaut » — la composition ne
 * tenait pas la promesse du texte.
 *
 * LA SECTION RACONTE DÉSORMAIS UNE PROGRESSION :
 *   composition → quantité → VALEUR → vigilance
 * dans cet ordre de lecture, parce que c'est l'ordre dans lequel on
 * comprend une cave : ce qu'on a, combien il y en a, ce que ça représente,
 * ce qui demande attention.
 *
 * LA VALEUR N'EST PAS UN QUATRIÈME INDICATEUR. Elle est le SOMMET du
 * crescendo : deux lignes sobres, puis le montant qui enfle, puis une ligne
 * qui retombe. Sa hiérarchie vient de son corps et de l'air autour — ni
 * carte, ni fond, ni ombre, ni icône. Le même principe qu'au mouvement II :
 * la place, pas le badge.
 *
 * LES TROIS NOMBRES ROULENT. Chaque rang est une roue : elle part de zéro,
 * défile vite, ralentit, se verrouille. Références, puis bouteilles, puis le
 * montant — trois arrêts nettement perceptibles, avec un court chevauchement
 * entre eux. La mécanique est dans components/lumiere/Roulement.tsx ; cette
 * section ne conduit que l'ordre.
 *
 * ── CE QUE LA REFONTE A CHANGÉ ─────────────────────────────────────────
 *
 * ELLE COÛTAIT 2,44 ÉCRANS DE DÉFILEMENT POUR QUATRE-VINGT-SIX MOTS — le
 * profil exact de « L'instant » avant sa refonte : trente-cinq mots par
 * écran, le plus creux de la page. La raison n'était pas le crescendo, qui
 * est dense ; c'était l'EMPILEMENT. Le portrait chiffré, puis une capture
 * de 1600 px de large, puis une seconde capture pendue à son coin : trois
 * hauteurs successives pour un seul propos.
 *
 * LE CRESCENDO ET LA PREUVE SE REGARDENT MAINTENANT. Côte à côte au-delà
 * de `lg`, empilés en dessous. Les chiffres à gauche, l'écran qui les
 * produit à droite : le lecteur n'a plus à se souvenir des uns en
 * découvrant l'autre.
 *
 * ET LA SECONDE CAPTURE N'EST PLUS PENDUE À LA PREMIÈRE. Elle montrait le
 * réassort — une information distincte, qui méritait mieux qu'un coin.
 * Les deux écrans sont devenus DEUX ÉTATS d'un même panneau, et le lecteur
 * choisit celui qu'il regarde. Rien n'est caché : les deux onglets
 * annoncent leur contenu, et le second est à un geste.
 *
 * D'OÙ VIENNENT LES CHIFFRES : voir lib/cave-demonstration.ts. Ils ont été
 * refaits — la page publiait 179 bouteilles et une alerte que le logiciel ne
 * produit pas.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const RESSORT = {
  type: "spring",
  stiffness: 58,
  damping: 17,
  mass: 1.1,
} as const;

/**
 * LA SÉQUENCE DU CRESCENDO, en un seul endroit.
 * références → bouteilles → valeur, puis la vigilance qui retombe. Les
 * retards sont courts : on décale pour faire sentir un ordre, pas pour
 * faire attendre une information.
 */
const SEQUENCE = {
  references: 0,
  bouteilles: 0.12,
  valeur: 0.3,
  vigilance: 0.48,
} as const;

/**
 * ET LA SÉQUENCE DES ROULEMENTS, qui est l'autre.
 * Les fondus ci-dessus installent la composition ; ceux-ci font tourner les
 * roues.
 *
 * CE QUI EST ÉCHELONNÉ ICI, CE SONT LES ARRÊTS, pas les départs. Un relais
 * de départs seuls obligerait à laisser une case vide sous un libellé déjà
 * lisible — et plus le compteur attend, plus le trou se voit. Les trois
 * partent donc rapprochés, et c'est la DURÉE qui s'allonge de l'un à
 * l'autre : chacun démarre pendant que le précédent ralentit encore, et se
 * verrouille plus d'une demi-seconde après lui.
 *   références  départ 0,06 → arrêt 0,86 s
 *   bouteilles  départ 0,34 → arrêt 1,40 s
 *   valeur      départ 0,62 → arrêt 2,00 s
 * (arrêt = départ + durée + 0,08 s par rang au-delà du premier)
 */
const ROULE = {
  references: { delai: 0.06, duree: 0.72 },
  bouteilles: { delai: 0.34, duree: 0.9 },
  valeur: { delai: 0.62, duree: 1.14 },
} as const;

/**
 * LES DEUX ÉCRANS DU PANNEAU.
 *
 * Ce sont les DEUX captures qui étaient empilées, telles quelles : mêmes
 * fichiers, mêmes alternatives textuelles, mêmes dimensions. Seule leur
 * mise en scène change.
 *
 * `cadrage` tient le recadrage du relevé sous `sm`. À 390 px, une capture
 * de 1600 px rendue sur 342 px n'est plus une interface : c'est une
 * texture, dont aucun mot ne se lit. On montre donc le RAIL « Votre cave »
 * — son propre portrait économique, lisible, et qui dit exactement le sujet
 * de la section. Au-delà de `sm`, l'écran entier revient.
 *   région 1150,220 · 430 × 312 sur 1600 × 1003
 *   largeur  = 1600/430            = 372,09 %
 *   décalage = −1150/1600 × 372,09 = −267,44 %
 *              −220/1600 × 372,09  =  −51,16 %
 */
const ECRANS = [
  {
    cle: "releve",
    onglet: "Le relevé",
    dit: "Quinze références, cent cinquante-huit bouteilles, et la composition par couleur.",
    src: "/produit/cave.webp",
    largeur: 1600,
    hauteur: 1003,
    alt: "Vintoria Pro, écran Cave : le relevé de la maison — cent cinquante-huit bouteilles, quatorze références suivies et une sans suivi — et la composition de la cave par couleur.",
    cadrage:
      "ml-[-267.44%] mt-[-51.16%] w-[372.09%] max-w-none sm:ml-0 sm:mt-0 sm:w-full",
  },
  {
    cle: "reassort",
    onglet: "Le réassort",
    dit: "Vintoria le signale. Vous commandez avant la rupture.",
    src: "/produit/reassort.webp",
    largeur: 980,
    hauteur: 571,
    alt: "Vintoria Pro signale trois vins à réassortir : le Crémant de Loire épuisé, le Meursault à deux bouteilles pour un seuil de trois, et le Crozes-Hermitage à cinq pour un seuil de six.",
    cadrage: "w-full",
  },
] as const;

/**
 * LE PANNEAU À DEUX ÉTATS.
 *
 * C'EST UN VRAI JEU D'ONGLETS, pas deux boutons qui changent une image.
 * `tablist` / `tab` / `tabpanel`, sélection annoncée, et un `tabindex`
 * roulant : au clavier on entre dans le jeu par une seule tabulation, on
 * change d'écran aux flèches, on en sort par une autre tabulation. C'est le
 * comportement que les lecteurs d'écran annoncent déjà ; en reproduire un
 * autre obligerait l'utilisateur à l'apprendre.
 *
 * LE CADRE NE CHANGE JAMAIS DE TAILLE. Les deux captures n'ont pas le même
 * format — 1,60 contre 1,72 — et laisser le panneau s'ajuster ferait sauter
 * la page à chaque bascule. Le cadre garde donc le format du relevé, et le
 * réassort s'y pose en entier, centré.
 */
function Panneau({ reduit }: { reduit: boolean }) {
  const base = useId();
  const [vu, setVu] = useState(0);
  const onglets = useRef<(HTMLButtonElement | null)[]>([]);

  const auClavier = useCallback((e: React.KeyboardEvent, i: number) => {
    const pas =
      e.key === "ArrowRight"
        ? 1
        : e.key === "ArrowLeft"
          ? -1
          : e.key === "Home"
            ? -i
            : e.key === "End"
              ? ECRANS.length - 1 - i
              : 0;
    if (!pas) return;
    e.preventDefault();
    const suivant = (i + pas + ECRANS.length) % ECRANS.length;
    setVu(suivant);
    onglets.current[suivant]?.focus();
  }, []);

  const ecran = ECRANS[vu];

  return (
    <motion.div
      className="surface overflow-hidden"
      data-jour="true"
      initial={{ opacity: 0, y: reduit ? 0 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={reduit ? { duration: 0 } : RESSORT}
    >
      <div
        role="tablist"
        aria-label="Les deux écrans de la cave"
        className="flex gap-1 border-b border-[color:var(--color-filet)] p-2"
      >
        {ECRANS.map((x, i) => (
          <button
            key={x.cle}
            ref={(n) => {
              onglets.current[i] = n;
            }}
            role="tab"
            id={`${base}-o-${x.cle}`}
            aria-selected={i === vu}
            aria-controls={`${base}-p-${x.cle}`}
            tabIndex={i === vu ? 0 : -1}
            onClick={() => setVu(i)}
            onKeyDown={(e) => auClavier(e, i)}
            className="data relative min-h-11 flex-1 rounded-[var(--radius-touche)] px-4 text-[0.68rem] tracking-[0.16em] uppercase outline-offset-2 transition-colors duration-[var(--duree-etat)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-accent)] aria-selected:text-[color:var(--color-fort)] [&:not([aria-selected='true'])]:text-[color:var(--color-faible)] [&:not([aria-selected='true'])]:hover:text-[color:var(--color-texte)]"
          >
            {/* LE FOND DE L'ONGLET ACTIF GLISSE d'un onglet à l'autre : une
                seule pièce qui se déplace, pas deux qui s'allument et
                s'éteignent. L'œil suit le même objet. */}
            {i === vu && (
              <motion.span
                aria-hidden
                layoutId={`${base}-actif`}
                transition={
                  reduit ? { duration: 0 } : { duration: 0.32, ease: EASE }
                }
                className="absolute inset-0 -z-10 rounded-[var(--radius-touche)] border border-[color:var(--color-filet-fort)] bg-[color:var(--color-jour-2)]"
              />
            )}
            {x.onglet}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${base}-p-${ecran.cle}`}
        aria-labelledby={`${base}-o-${ecran.cle}`}
        tabIndex={0}
        className="outline-offset-[-2px] focus-visible:outline-2 focus-visible:outline-[color:var(--color-accent)]"
      >
        <div className="relative aspect-[430/312] overflow-hidden sm:aspect-[1600/1003]">
          {/* PAS DE `popLayout` ICI : il sort l'élément du flux pour le
              faire disparaître, et les deux écrans sont DÉJÀ en absolu
              dans un cadre à format fixe. Le mode par défaut les laisse se
              recouvrir le temps du fondu, sans toucher à la mise en page. */}
          <AnimatePresence initial={false}>
            <motion.div
              key={ecran.cle}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: reduit ? 1 : 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduit ? 1 : 0.995 }}
              transition={{ duration: reduit ? 0 : 0.34, ease: EASE }}
            >
              <Image
                src={ecran.src}
                alt={ecran.alt}
                width={ecran.largeur}
                height={ecran.hauteur}
                sizes="(min-width: 1024px) 660px, (min-width: 640px) 92vw, 372vw"
                loading="lazy"
                className={`block h-auto ${ecran.cadrage}`}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        {/*
          DEUX LIGNES RÉSERVÉES À LA LÉGENDE. Les deux écrans ne se
          décrivent pas en autant de mots : « Quinze références, cent
          cinquante-huit bouteilles, et la composition par couleur » tient
          sur deux lignes, « Vintoria le signale » sur une. Le panneau
          sautait donc de vingt pixels à chaque bascule — un saut de mise
          en page provoqué par un simple changement d'onglet. `2lh` vaut
          exactement deux de SES lignes, quelle que soit la largeur — et le
          rembourrage s'y ajoute, parce que `min-height` mesure la boîte de
          bordure : sans les 2 rem et le filet, il manquait trente-trois
          pixels et le saut restait entier.
        */}
        <p className="t-meta min-h-[calc(2lh+2rem+1px)] border-t border-[color:var(--color-filet)] px-5 py-4 text-[color:var(--color-faible)]">
          {ecran.dit}
        </p>
      </div>
    </motion.div>
  );
}

export function Cave() {
  const reduit = useReducedMotion();
  const pas = (delai: number, duree = 0.9) => ({
    duration: reduit ? 0 : duree,
    delay: reduit ? 0 : delai,
    ease: EASE,
  });

  return (
    <section
      id="cave"
      className="mouvement grain-clair relative isolate overflow-x-clip"
      style={{ background: ciel("cave") }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="jet top-[-30%] left-[38%] h-[82%] opacity-80" />
      </div>

      <div className="px relative z-10 mx-auto w-full max-w-[1420px]">
        {/* ══ LE PROPOS ═══════════════════════════════════════════ */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-14">
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: reduit ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={pas(0)}
          >
            <p className="eyebrow text-[color:var(--color-faible)]">
              Côté cave
            </p>
            <h2 className="strophe mt-6 text-[clamp(2.1rem,5.2vw,4rem)]">
              Votre cave,
              <br />
              <em>d’un seul coup d’œil.</em>
            </h2>
          </motion.div>

          <motion.p
            className="t-chapeau mt-10 max-w-[32ch] text-pretty text-[color:var(--color-texte)] lg:col-span-4 lg:col-start-8 lg:mt-0 lg:self-center lg:pt-6"
            initial={{ opacity: 0, y: reduit ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={pas(0.25)}
          >
            Ce que vous avez, ce que ça vaut, et ce qui va manquer. Vintoria
            tient l’inventaire que personne n’a le temps de tenir.
          </motion.p>
        </div>

        {/*
          ══ LES CHIFFRES ET LEUR PREUVE, CÔTE À CÔTE ════════════

          Le crescendo tient six colonnes, le panneau cinq, et la colonne
          vide entre les deux est ce qui les sépare sans trait. En dessous
          de `lg`, l'un sous l'autre — un tableau de chiffres et une capture
          d'écran ne se partagent pas trois cent quatre-vingt-dix pixels.
        */}
        <div className="mt-16 lg:mt-20 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
          {/* ── LE CRESCENDO ─────────────────────────────────────
              Deux lignes sobres, le sommet, puis une ligne qui retombe.
              C'est la composition qui porte la hiérarchie.

              UN SEUL DÉCLENCHEMENT POUR TOUTE LA SÉQUENCE : quand le bloc
              entre dans le champ, les trois compteurs roulent sous les
              yeux du lecteur, dans l'ordre, et une seule fois. */}
          <motion.div
            className="lg:col-span-6"
            initial="repos"
            whileInView="pose"
            viewport={{ once: true, amount: 0.4 }}
          >
            {COMPTE.map((m, i) => (
              <motion.div
                key={m.cle}
                className="grid grid-cols-[4.5rem_1fr] items-baseline gap-x-5 border-t border-[color:var(--color-filet)] py-5 sm:grid-cols-[7rem_1fr] sm:gap-x-8 sm:py-6"
                variants={{ repos: { opacity: 0 }, pose: { opacity: 1 } }}
                transition={pas(
                  i === 0 ? SEQUENCE.references : SEQUENCE.bouteilles,
                  0.7,
                )}
              >
                <Roulement
                  valeur={m.nombre}
                  {...(i === 0 ? ROULE.references : ROULE.bouteilles)}
                  className="data justify-end text-[1.9rem] leading-none text-[color:var(--color-fort)] tabular-nums sm:text-[2.3rem]"
                />
                <div className="flex flex-col gap-y-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-8">
                  <p className="voix text-[1.05rem] text-[color:var(--color-fort)] sm:text-[1.25rem]">
                    {m.unite}
                  </p>
                  <p className="t-meta shrink-0 text-[color:var(--color-faible)]">
                    {m.dit}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* ── LE SOMMET ──────────────────────────────────────── */}
            <motion.div
              className="grid grid-cols-[4.5rem_1fr] gap-x-5 border-t border-[color:var(--color-filet-fort)] pt-10 pb-12 sm:grid-cols-[7rem_1fr] sm:gap-x-8 sm:pt-12 sm:pb-14"
              variants={{ repos: { opacity: 0 }, pose: { opacity: 1 } }}
              transition={pas(SEQUENCE.valeur, 0.8)}
            >
              {/* GOUTTIÈRE VIDE, et c'est voulu : les trois lignes comptées
                  portent leur nombre ici ; le sommet porte le sien dans la
                  colonne, en grand. Le vide signale que cette ligne rompt le
                  rythme — et il évite de répéter « valeur » deux fois. */}
              <span aria-hidden />
              <div>
                <p className="data text-[0.7rem] tracking-[0.18em] text-[color:var(--color-faible)] uppercase">
                  Valeur commerciale
                </p>
                <Roulement
                  valeur={VALEUR.montant}
                  {...ROULE.valeur}
                  className="voix mt-4 text-[clamp(3rem,7vw,5.4rem)] leading-[0.94] text-[color:var(--color-fort)] tabular-nums"
                />
                <p className="t-chapeau mt-5 text-[color:var(--color-texte)]">
                  {VALEUR.dit}
                </p>

                {/*
                  LA DÉFINITION, DISCRÈTE ET NATIVE.
                  `<details>` plutôt qu'une modale : elle s'ouvre sans
                  JavaScript, se lit au clavier, s'annonce correctement aux
                  lecteurs d'écran, et ne concurrence jamais le montant.
                  Le texte décrit la règle RÉELLE de computeFinancials.
                */}
                <details className="group mt-7 max-w-[46ch]">
                  <summary className="data inline-flex min-h-12 cursor-pointer list-none items-center gap-2 text-[0.72rem] tracking-[0.1em] text-[color:var(--color-faible)] uppercase transition-colors duration-300 hover:text-[color:var(--color-accent)] [&::-webkit-details-marker]:hidden">
                    Comment est-elle calculée ?
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-open:rotate-90"
                    >
                      ›
                    </span>
                  </summary>
                  <p className="t-meta mt-4 border-l border-[color:var(--color-filet)] pl-5 text-[color:var(--color-texte)]">
                    {VALEUR.calcul}
                  </p>
                </details>
              </div>
            </motion.div>

            {/* ── LA RETOMBÉE ────────────────────────────────────── */}
            <motion.div
              className="grid grid-cols-[4.5rem_1fr] items-baseline gap-x-5 border-t border-b border-[color:var(--color-filet)] py-5 sm:grid-cols-[7rem_1fr] sm:gap-x-8 sm:py-6"
              variants={{ repos: { opacity: 0 }, pose: { opacity: 1 } }}
              transition={pas(SEQUENCE.vigilance, 0.7)}
            >
              {/* Elle RETOMBE : un fondu, pas un roulement. Le crescendo est
                  derrière, et lui donner un quatrième compteur le banaliserait. */}
              <p className="data text-right text-[1.9rem] leading-none text-[color:var(--color-accent)] tabular-nums sm:text-[2.3rem]">
                {VIGILANCE.nombre}
              </p>
              <div className="flex flex-col gap-y-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-8">
                <p className="voix text-[1.05rem] text-[color:var(--color-fort)] sm:text-[1.25rem]">
                  {VIGILANCE.unite}
                </p>
                <p className="t-meta shrink-0 text-[color:var(--color-faible)]">
                  {VIGILANCE.dit}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ══ LA PREUVE ═════════════════════════════════════════ */}
          <div className="mt-14 lg:col-span-5 lg:col-start-8 lg:mt-2">
            <Panneau reduit={!!reduit} />
          </div>
        </div>
      </div>
    </section>
  );
}
