"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ciel } from "@/lib/lumiere";

/**
 * MOUVEMENT III — LA CAVE.
 *
 * La preuve. Après le désir (I) et le manque (II), l'outil : il existe, il
 * est beau, et il parle de lui-même.
 *
 * LE FOND DEVIENT #FCFAF5 — la craie de l'Atelier lui-même. La page prend la
 * couleur du produit au moment où elle parle du produit : la marque et
 * l'outil cessent d'être deux mondes. C'est aussi pourquoi les quatre
 * couleurs de texte de ce site sont les jetons réels de Vintoria Pro.
 *
 * UN SEUL GESTE PAR SECTION : ça ne tourne pas, ÇA SE POSE. L'écran Cave
 * monte depuis le bas et s'installe au ressort ; l'écran Aujourd'hui arrive
 * un temps après, plus petit, en recouvrement, et soulevé plus haut — c'est
 * ce décalage d'ombre qui crée la profondeur, pas une parallaxe.
 *
 * LES CHIFFRES sont ceux de l'établissement de démonstration, et ils sont
 * ÉTIQUETÉS comme tels. Aucun pourcentage de chiffre d'affaires n'est
 * avancé : nous n'en avons pas.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const RESSORT = {
  type: "spring",
  stiffness: 58,
  damping: 17,
  mass: 1.1,
} as const;

const RELEVE = [
  { valeur: "15", unite: "références", dit: "entrées depuis votre carte" },
  {
    valeur: "179",
    unite: "bouteilles",
    dit: "comptées, millésime par millésime",
  },
  { valeur: "1", unite: "sous son seuil", dit: "signalé avant la rupture" },
] as const;

export function Cave() {
  const reduit = useReducedMotion();

  return (
    <section
      id="cave"
      className="grain-clair relative isolate overflow-x-clip pt-28 pb-32 sm:pt-36"
      style={{ background: ciel("cave") }}
    >
      {/* ── LA SCÈNE — le jour est levé : jet haut, droit, peu teinté ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="jet top-[-30%] left-[38%] h-[82%] opacity-80" />
        <div className="sol h-[22%] opacity-70" />
        <div className="arete bottom-[22%] opacity-60" />
      </div>

      <div className="px relative z-10 mx-auto w-full max-w-[1420px]">
        <motion.div
          initial={{ opacity: 0, y: reduit ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduit ? 0 : 0.9, ease: EASE }}
        >
          <p className="eyebrow text-[color:var(--color-faible)]">Côté cave</p>
          <h2 className="strophe mt-5 text-[clamp(2.1rem,5.6vw,4.4rem)]">
            Votre cave,
            <br />
            <em>d’un seul coup d’œil.</em>
          </h2>
          <p className="t-chapeau mt-7 max-w-[48ch] text-pretty text-[color:var(--color-texte)]">
            Ce que vous avez, ce que ça vaut, et ce qui va manquer. Vintoria
            tient l’inventaire que personne n’a le temps de tenir.
          </p>
        </motion.div>

        {/* ── LE RELEVÉ ────────────────────────────────────────────── */}
        <motion.ul
          className="mt-16 grid gap-px overflow-hidden sm:grid-cols-3"
          initial="repos"
          whileInView="pose"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            pose: { transition: { staggerChildren: reduit ? 0 : 0.09 } },
          }}
        >
          {RELEVE.map((r) => (
            <motion.li
              key={r.unite}
              className="border-t border-[color:var(--color-filet)] pt-6"
              variants={{
                repos: { opacity: 0, y: reduit ? 0 : 16 },
                pose: { opacity: 1, y: 0 },
              }}
              transition={{ duration: reduit ? 0 : 0.8, ease: EASE }}
            >
              <p className="flex items-baseline gap-2.5">
                <span className="data text-[2.6rem] leading-none text-[color:var(--color-accent)] tabular-nums">
                  {r.valeur}
                </span>
                <span className="t-meta text-[color:var(--color-fort)]">
                  {r.unite}
                </span>
              </p>
              <p className="t-meta mt-2.5 text-[color:var(--color-faible)]">
                {r.dit}
              </p>
            </motion.li>
          ))}
        </motion.ul>

        {/* ── LES DEUX OBJETS ──────────────────────────────────────── */}
        <div className="relative mt-20 sm:mt-24">
          <motion.div
            className="objet overflow-hidden"
            initial={{ opacity: 0, y: reduit ? 0 : 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={reduit ? { duration: 0 } : RESSORT}
          >
            <Image
              src="/produit/cave.webp"
              alt="Vintoria Pro, écran Cave : quinze références et cent soixante-dix-neuf bouteilles, chacune avec son millésime, son prix bouteille et son prix au verre, la composition de la cave par couleur, et le vin passé sous son seuil de réassort."
              width={1600}
              height={1000}
              sizes="(min-width: 1024px) 1150px, 92vw"
              loading="lazy"
              className="block h-auto w-full"
            />
          </motion.div>

          {/* L'ALERTE, EN RECOUVREMENT.
              Une seconde capture d'écran entière était ILLISIBLE à cette
              taille — 29 % d'un tableau de bord dense ne donne qu'une
              texture, et montrer une interface qu'on ne peut pas lire
              dessert l'argument. C'est donc un AGRANDISSEMENT du panneau
              d'alerte, découpé dans cette même capture : une seule chose,
              lisible, et c'est la plus probante de la section.
              Soulevée plus haut que l'écran qu'elle recouvre : l'ombre
              seule crée la profondeur, sans parallaxe. */}
          <motion.figure
            className="objet objet-leve absolute -bottom-12 left-0 m-0 w-[82%] overflow-hidden sm:-bottom-14 sm:w-[58%] lg:-bottom-16 lg:-left-8 lg:w-[42%]"
            initial={{ opacity: 0, y: reduit ? 0 : 40, x: reduit ? 0 : -14 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={reduit ? { duration: 0 } : { ...RESSORT, delay: 0.34 }}
          >
            <Image
              src="/produit/reassort.webp"
              alt="Vintoria Pro signale un vin à réassortir : Châteauneuf-du-Pape, Domaine du Mistral 2019, il en reste deux pour un seuil de trois."
              width={860}
              height={287}
              sizes="(min-width: 1024px) 480px, 80vw"
              loading="lazy"
              className="block h-auto w-full"
            />
            <figcaption className="t-meta border-t border-[color:var(--color-filet)] px-5 py-3.5 text-[color:var(--color-faible)]">
              Vintoria le signale. Vous commandez avant la rupture.
            </figcaption>
          </motion.figure>
        </div>

        <p /* La carte d’alerte porte une ombre bordeaux large : à mt-24, la
             mention tombait dedans (4,39:1 mesuré, sous le seuil AA). On
             l’écarte — rien n’est redessiné. */
          className="t-meta mt-36 max-w-[58ch] text-[color:var(--color-faible)]"
        >
          Écrans réels de Vintoria Pro 2.0.2. Les chiffres sont ceux que le
          logiciel calcule sur l’établissement de démonstration.
        </p>
      </div>
    </section>
  );
}
