"use client";

import { motion } from "motion/react";
import { Line } from "@/components/Line";

/**
 * ACTE III — LE SERVICE.
 * Objection levée : « Est-ce que ça tient en plein coup de feu ? »
 * Le récit suit LE CLIENT à table — jamais l'équipe : c'est lui qui scanne,
 * comprend et choisit. Le restaurateur achète ; le client vit l'expérience.
 *
 * Traitement : une PARTITION temporelle — une seule ligne de temps, trois
 * instants posés dessus. Pas de cartes, pas de grille : le temps lui-même
 * est l’argument.
 */

const TEMPS = [
  {
    t: "0 s",
    titre: "Il scanne",
    detail:
      "Le QR code est posé sur la table, son téléphone suffit. Il indique ce qu’il mange ce soir.",
  },
  {
    t: "4 s",
    titre: "Il comprend",
    detail:
      "Trois vins de votre carte, et pour chacun la raison. Pas une liste de noms : un conseil.",
  },
  {
    t: "à table",
    titre: "Il choisit",
    detail:
      "Il ne commande plus au hasard, ni par défaut. Il ose. Et il se souvient de ce qu’il a bu.",
  },
];

export function Service() {
  return (
    <section className="px rythme relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-15%] top-1/2 h-[60vh] w-[60vh] -translate-y-1/2 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(232,200,140,0.10), transparent 68%)",
        }}
      />

      {/* La trace du vin retenu — voir components/Salle.tsx */}
      <div
        aria-hidden
        className="robe-trace pointer-events-none absolute right-[3%] top-1/2 h-[54vh] w-[54vh] -translate-y-1/2 rounded-full"
        style={{ "--trace-force": "0.085", "--trace-retard": "120ms" } as React.CSSProperties}
      />

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <p className="eyebrow mb-14">Le service</p>

        <h2 className="voix t-titre max-w-3xl text-os">
          <Line inView>Quatre secondes.</Line>
          <Line inView delay={0.08}>
            <span className="italic text-tungstene">
              C’est tout ce que ça prend.
            </span>
          </Line>
        </h2>

        {/* La ligne de temps */}
        <div className="relative mt-24">
          {/* le fil, qui se trace */}
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-0 hidden h-px w-full origin-left bg-gradient-to-r from-laiton/70 via-laiton/40 to-transparent md:block"
          />
          <span
            aria-hidden
            className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-laiton/60 to-transparent md:hidden"
          />

          <ol className="grid gap-14 md:grid-cols-3 md:gap-10">
            {TEMPS.map((m, i) => (
              <motion.li
                key={m.t}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.9,
                  delay: 0.25 + i * 0.18,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative pl-8 md:pl-0 md:pt-10"
              >
                {/* le point sur la ligne */}
                <span
                  aria-hidden
                  className="absolute left-[-3.5px] top-1.5 h-[7px] w-[7px] rounded-full bg-tungstene md:left-0 md:top-[-3.5px]"
                />
                <span className="data block text-[0.75rem] tracking-[0.16em] text-tungstene">
                  {m.t}
                </span>
                <h3 className="voix t-tete mt-5 text-os">{m.titre}</h3>
                <p className="t-corps mt-4 max-w-sm text-cendre">{m.detail}</p>
              </motion.li>
            ))}
          </ol>
        </div>

        <p className="t-corps mt-24 max-w-xl text-cendre">
          Aucune application à télécharger, aucun matériel à installer.
          Vintoria s’ouvre dans le navigateur du téléphone de votre client.
        </p>
      </div>
    </section>
  );
}
