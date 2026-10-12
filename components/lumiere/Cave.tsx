"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
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
      className="grain-clair relative isolate overflow-x-clip pt-28 pb-36 sm:pt-36 sm:pb-44"
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

        {/* ══ LE CRESCENDO ════════════════════════════════════════
            Deux lignes sobres, le sommet, puis une ligne qui retombe.
            C'est la composition qui porte la hiérarchie. */}
        {/*
          UN SEUL DÉCLENCHEMENT POUR TOUTE LA SÉQUENCE.
          Le bloc tient à l'écran aux deux largeurs (695 px pour 900,
          633 px pour 844) : quand il entre dans le champ, les trois
          compteurs roulent sous les yeux du lecteur, dans l'ordre, et une
          seule fois.
        */}
        <motion.div
          className="mt-24 sm:mt-32 lg:mt-28 lg:w-[62%]"
          initial="repos"
          whileInView="pose"
          viewport={{ once: true, amount: 0.4 }}
        >
          {COMPTE.map((m, i) => (
            <motion.div
              key={m.cle}
              className="grid grid-cols-[4.5rem_1fr] items-baseline gap-x-5 border-t border-[color:var(--color-filet)] py-6 sm:grid-cols-[7rem_1fr] sm:gap-x-8 sm:py-7"
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
            className="grid grid-cols-[4.5rem_1fr] gap-x-5 border-t border-[color:var(--color-filet-fort)] pt-12 pb-14 sm:grid-cols-[7rem_1fr] sm:gap-x-8 sm:pt-16 sm:pb-20"
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
                className="voix mt-4 text-[clamp(3.2rem,9vw,6.6rem)] leading-[0.94] text-[color:var(--color-fort)] tabular-nums"
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
              <details className="group mt-8 max-w-[46ch]">
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
            className="grid grid-cols-[4.5rem_1fr] items-baseline gap-x-5 border-t border-b border-[color:var(--color-filet)] py-6 sm:grid-cols-[7rem_1fr] sm:gap-x-8 sm:py-7"
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

        {/* ══ LA PREUVE ═══════════════════════════════════════════ */}
        <div className="relative mt-24 sm:mt-28">
          {/*
            SUR PETIT ÉCRAN, L'ÉCRAN EST RECADRÉ — il n'est pas réduit.
            À 390 px, une capture de 1600 px rendue sur 342 px n'est plus
            une interface : c'est une texture, dont aucun mot ne se lit.
            Et la carte de détail la recouvrait presque entièrement.
            On montre donc le RAIL « Votre cave » du produit : son propre
            portrait économique — 158 bouteilles, les références suivies,
            la composition par couleur — lisible, et qui dit exactement le
            sujet de cette section. Au-delà du palier sm, l'écran entier
            revient : il y a la place pour qu'il se lise.
            Le recadrage se fait en CSS sur la MÊME image : aucun fichier
            de plus, aucun téléchargement de plus.
              région 1150,220 · 430 × 312 sur 1600 × 1003
              largeur  = 1600/430            = 372,09 %
              décalage = −1150/1600 × 372,09 = −267,44 %
                         −220/1600 × 372,09  =  −51,16 %
          */}
          <motion.div
            className="objet overflow-hidden"
            initial={{ opacity: 0, y: reduit ? 0 : 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={reduit ? { duration: 0 } : RESSORT}
          >
            <div className="relative aspect-[430/312] overflow-hidden sm:aspect-auto">
              <Image
                src="/produit/cave.webp"
                alt="Vintoria Pro, écran Cave : le relevé de la maison — cent cinquante-huit bouteilles, quatorze références suivies et une sans suivi — et la composition de la cave par couleur."
                width={1600}
                height={1003}
                sizes="(min-width: 640px) 1150px, 372vw"
                loading="lazy"
                className="ml-[-267.44%] mt-[-51.16%] block h-auto w-[372.09%] max-w-none sm:ml-0 sm:mt-0 sm:w-full"
              />
            </div>
          </motion.div>

          <motion.figure
            /* En flux sur petit écran, en recouvrement au-delà.
               Le chevauchement vertical est volontairement FAIBLE : à
               −2,75 rem, la carte mangeait la moitié de la composition du
               produit (Rosés, Rouges, Doux). Elle pend maintenant au coin
               sans rien cacher de ce qui fait reconnaître l'écran. */
            className="objet objet-leve relative m-0 mt-[-1rem] ml-auto w-[86%] overflow-hidden sm:absolute sm:-bottom-14 sm:left-0 sm:mt-0 sm:w-[58%] lg:-bottom-16 lg:-left-8 lg:w-[42%]"
            initial={{ opacity: 0, y: reduit ? 0 : 40, x: reduit ? 0 : -14 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={reduit ? { duration: 0 } : { ...RESSORT, delay: 0.34 }}
          >
            <Image
              src="/produit/reassort.webp"
              alt="Vintoria Pro signale trois vins à réassortir : le Crémant de Loire épuisé, le Meursault à deux bouteilles pour un seuil de trois, et le Crozes-Hermitage à cinq pour un seuil de six."
              width={980}
              height={571}
              sizes="(min-width: 1024px) 480px, 80vw"
              loading="lazy"
              className="block h-auto w-full"
            />
            <figcaption className="t-meta border-t border-[color:var(--color-filet)] px-5 py-3.5 text-[color:var(--color-faible)]">
              Vintoria le signale. Vous commandez avant la rupture.
            </figcaption>
          </motion.figure>
        </div>

        <p className="t-meta mt-36 max-w-[62ch] text-[color:var(--color-faible)]">
          Écrans réels de Vintoria Pro 2.0.2. Les chiffres sont ceux que le
          logiciel calcule sur sa propre démonstration : les trois premiers
          s’affichent sur l’écran ci-dessus. La valeur commerciale, elle,
          n’apparaît sur aucun de ces écrans — elle suit la règle du produit,
          les prix de la carte multipliés par les bouteilles en cave, et
          alimente son module de stock et ses exports.
        </p>
      </div>
    </section>
  );
}
