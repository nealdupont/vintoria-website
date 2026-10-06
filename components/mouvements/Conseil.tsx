"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Line } from "@/components/Line";
import { Lecture } from "@/components/Lecture";
import { useRobeRetenue } from "@/components/Salle";

/**
 * LE CONSEIL — « c'est quoi, concrètement ? »
 *
 * La démonstration jouable est le héros du mouvement : message à gauche,
 * geste vivant à droite. Le vin que le visiteur retient ici teinte le reste
 * de la page — son choix a une conséquence, c'est la promesse du produit
 * appliquée au site lui-même.
 *
 * La refonte y rattache le parcours en quatre secondes, qui vivait dans un
 * acte séparé : « il scanne / il comprend / il choisit » explique le MÊME
 * geste, le séparer obligeait à le raconter deux fois.
 */

const PARCOURS = [
  {
    quand: "0 s",
    titre: "Il scanne",
    texte:
      "Le QR code est posé sur la table, son téléphone suffit. Il indique ce qu’il mange ce soir.",
  },
  {
    quand: "4 s",
    titre: "Il comprend",
    texte:
      "Trois vins de votre carte, et pour chacun la raison. Pas une liste de noms : un conseil.",
  },
  {
    quand: "à table",
    titre: "Il choisit",
    texte:
      "Il ne commande plus au hasard, ni par défaut. Il ose. Et il se souvient de ce qu’il a bu.",
  },
];

export function Conseil() {
  const poserRobe = useRobeRetenue();

  return (
    <section id="conseil" className="px rythme relative overflow-hidden">
      {/* la lampe de salle — elle prend la robe du verre */}
      <div
        aria-hidden
        className="robe-halo pointer-events-none absolute right-[-10%] top-[-15%] h-[70vh] w-[70vh] rounded-full opacity-40"
      />

      <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-20">
        {/* Le message */}
        <div>
          <p className="eyebrow mb-8">Le conseil</p>

          <h2 className="voix t-titre text-fort">
            <Line inView>Voici ce que voit</Line>
            <Line inView delay={0.08}>
              <span className="italic text-accent">votre client.</span>
            </Line>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="t-chapeau mt-8 max-w-md text-texte"
          >
            Il choisit son plat. Votre carte se réordonne, et chaque vin retenu est
            accompagné de la raison qui le justifie. Comme si un sommelier s’était
            arrêté à sa table.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <Link href="/demonstration" className="bouton bouton-second group">
              Demander une démonstration
              <span
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <span className="eyebrow">20 minutes · sur votre carte</span>
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
          <div className="rounded-2xl border border-filet bg-nuit-2/70 p-6 backdrop-blur-sm sm:p-8">
            <Lecture onRobe={poserRobe} />
          </div>
        </motion.div>
      </div>

      {/* ── Le parcours, en quatre secondes ─────────────────────────────── */}
      <div className="relative z-10 mx-auto mt-12 max-w-[1180px] border-t border-filet pt-14">
        <h3 className="voix t-citation max-w-[18ch] text-balance text-fort">
          Quatre secondes. C’est tout ce que ça prend.
        </h3>

        <ol className="mt-10 grid gap-8 sm:grid-cols-3 lg:gap-16">
          {PARCOURS.map((e) => (
            <li key={e.quand} className="parait border-t border-filet pt-6">
              <p className="data t-meta mb-3 text-accent">{e.quand}</p>
              <h4 className="voix t-tete text-fort">{e.titre}</h4>
              <p className="t-corps mt-2.5 text-texte">{e.texte}</p>
            </li>
          ))}
        </ol>

        <p className="t-meta mt-12 max-w-[60ch] text-faible">
          Aucune application à télécharger, aucun matériel à installer. Vintoria
          s’ouvre dans le navigateur du téléphone de votre client.
        </p>
      </div>

      {/* ── La méthode — elle s'adresse au restaurateur, pas au client ──── */}
      <div className="relative z-10 mx-auto mt-14 max-w-[1180px] border-t border-filet pt-14">
        <p className="eyebrow mb-7 text-accent">Ce que Vintoria regarde</p>

        <dl className="grid gap-x-16 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="eyebrow">Le plat</dt>
            <dd className="t-corps mt-2 max-w-[40ch] text-texte">
              sa cuisson, sa sauce, son intensité et le moment qu’il accompagne
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Votre carte</dt>
            <dd className="t-corps mt-2 max-w-[40ch] text-texte">
              chaque vin réellement disponible ce soir, son millésime, sa maturité
            </dd>
          </div>
        </dl>

        <p className="t-corps mt-10 max-w-[62ch] text-texte">
          Une intelligence générale répond à une question : quel vin va avec ce
          plat ? Vintoria en pose une autre : parmi les vins que vous avez ce soir,
          lequel est le plus juste pour ce plat, à cette table ?
        </p>

        <p className="voix mt-6 text-[1.3rem] italic leading-snug text-fort">
          Ce n’est pas une meilleure réponse. C’est une autre question.
        </p>
      </div>
    </section>
  );
}
