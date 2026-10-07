"use client";

import { motion, useReducedMotion } from "motion/react";
import { ciel } from "@/lib/lumiere";

/**
 * MOUVEMENT VII — POUR QUI.
 *
 * LA RESPIRATION. Après cinq sections denses où l'on a regardé des écrans de
 * près, il faut que l'œil se repose avant l'appel à l'action — sinon le CTA
 * arrive sur un lecteur saturé.
 *
 * C'est donc la SEULE section sans aucune interface. Pas d'animation non
 * plus, au-delà de l'arrivée : ajouter un mouvement ici détruirait
 * exactement ce qu'elle apporte. Une respiration qui bouge n'est pas une
 * respiration.
 *
 * La sauge n'apparaît qu'ici et au Geste — c'est la lumière passée par une
 * feuille, et elle marque les deux moments calmes de la page.
 *
 * AUCUNE DE CES TROIS LIGNES N'AVANCE DE CHIFFRE. Ce sont des situations,
 * pas des statistiques : le lecteur doit s'y reconnaître, pas y croire.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const MAISONS = [
  "Un bistrot de quarante références, où personne n’a le temps de tout connaître.",
  "Un hôtel dont le service change trois fois dans la journée.",
  "Une maison dont le sommelier ne peut pas être à toutes les tables à la fois.",
] as const;

export function PourQui() {
  const reduit = useReducedMotion();

  return (
    <section
      id="pourqui"
      className="grain-clair relative isolate overflow-x-clip py-36 sm:py-44"
      style={{ background: ciel("pourqui") }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="voile-sauge top-[8%] left-[52%] h-[70%] w-[56%]" />
      </div>

      <div className="px relative z-10 mx-auto w-full max-w-[1420px]">
        <motion.div
          className="max-w-[38ch]"
          initial={{ opacity: 0, y: reduit ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduit ? 0 : 1, ease: EASE }}
        >
          <p className="eyebrow text-[color:var(--color-faible)]">Pour qui</p>
          <h2 className="strophe mt-5 text-[clamp(2rem,4.8vw,3.8rem)]">
            Pour les maisons qui ont une carte,
            <br />
            <em>et pas toujours quelqu’un pour la défendre.</em>
          </h2>
        </motion.div>

        <motion.ul
          className="mt-20 grid gap-12 sm:mt-24 lg:grid-cols-3 lg:gap-14"
          initial="repos"
          whileInView="pose"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            pose: { transition: { staggerChildren: reduit ? 0 : 0.14 } },
          }}
        >
          {MAISONS.map((m) => (
            <motion.li
              key={m}
              className="max-w-[34ch]"
              variants={{
                repos: { opacity: 0, y: reduit ? 0 : 18 },
                pose: { opacity: 1, y: 0 },
              }}
              transition={{ duration: reduit ? 0 : 0.9, ease: EASE }}
            >
              <div className="filet-or h-px w-14" />
              <p className="t-chapeau mt-6 text-pretty text-[color:var(--color-texte)]">
                {m}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
