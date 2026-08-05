"use client";

import { useCallback, useState } from "react";
import { motion } from "motion/react";
import { Line } from "@/components/Line";
import { Lecture } from "@/components/Lecture";
import { robeDe, variablesRobe } from "@/lib/robes";

/**
 * ACTE I — L’ACCORD.
 * Objection levée : « C’est quoi, concrètement ? »
 * La démonstration est le héros : message clair à gauche, geste vivant à droite.
 *
 * L’acte porte la robe du vin retenu : la salle s’accorde au verre.
 */
export function Accord() {
  const [vinRetenu, setVinRetenu] = useState<string | null>(null);
  const onRobe = useCallback((id: string | null) => setVinRetenu(id), []);
  const robe = robeDe(vinRetenu);

  return (
    <section
      id="demonstration"
      className="px rythme relative overflow-hidden"
      style={variablesRobe(robe)}
    >
      {/* la lampe de salle — elle prend la robe du verre */}
      <div
        aria-hidden
        className="robe-halo pointer-events-none absolute right-[-10%] top-[-15%] h-[70vh] w-[70vh] rounded-full opacity-40"
      />

      <div className="relative z-10 mx-auto grid max-w-[1500px] items-center gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-20">
        {/* Le message */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="eyebrow mb-8"
          >
            La démonstration
          </motion.p>

          <h2 className="voix t-titre text-os">
            <Line inView>Voici ce que voit</Line>
            <Line inView delay={0.08}>
              <span className="italic text-tungstene">votre client.</span>
            </Line>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="t-chapeau mt-8 max-w-md text-cendre"
          >
            Il choisit son plat. Votre carte se réordonne, et chaque vin retenu
            arrive avec la raison qui le justifie — comme si un sommelier
            s’était arrêté à sa table.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <a
              href="#reserver"
              className="group inline-flex min-h-[3rem] items-center gap-3 whitespace-nowrap rounded-full border border-[color:var(--color-filet-fort)] px-6 text-[0.75rem] uppercase tracking-[0.11em] text-os sm:px-8 sm:tracking-[0.16em] transition-colors duration-500 hover:border-os/40 hover:bg-white/[0.05]"
            >
              Réserver une démonstration
              <span
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <span className="eyebrow text-cendre-2">
              20 minutes · sur votre carte
            </span>
          </motion.div>
        </div>

        {/* Le geste */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="rounded-2xl border border-[color:var(--color-filet)] bg-encre-2/70 p-6 backdrop-blur-sm sm:p-8">
            <Lecture onRobe={onRobe} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
