"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ciel } from "@/lib/lumiere";
import { COMPTE } from "@/lib/cave-demonstration";

/**
 * MOUVEMENT VIII — L'INVITATION.
 *
 * L'HEURE DORÉE, la dernière lumière du jour. Elle se prolonge dans le pied
 * de page, qui reprend exactement le fond où cette section s'arrête : la
 * traversée ne s'interrompt pas sur une arête, elle se pose.
 *
 * Un seul appel à l'action sur toute la page porte le poids — celui-ci. Les
 * autres sections n'en ont aucun : un lecteur sollicité à chaque section
 * n'écoute plus aucune des sollicitations.
 *
 * Ce qui est promis ici est VÉRIFIABLE et modeste : vingt minutes, sur la
 * carte du visiteur. Aucun chiffre de performance, aucune promesse de
 * chiffre d'affaires — nous n'en avons pas.
 *
 * ── CE QUE LA REFONTE A CHANGÉ ─────────────────────────────────────────
 *
 * LE NOMBRE DE BOUTEILLES ÉTAIT FAUX. La note finale annonçait « cent
 * soixante-dix-neuf bouteilles » quand la section Cave en publie 158, lus
 * dans la cave de démonstration du produit. Deux chiffres contradictoires
 * sur la même page, dont l'un que le logiciel ne calcule pas. Le nombre
 * vient maintenant de `lib/cave-demonstration.ts`, à la source — il ne
 * peut plus diverger sans qu'un test le dise.
 *
 * ET L'ARRIVÉE EST SÉQUENCÉE. Tout le bloc fondait d'un seul tenant :
 * titre, filet, promesse, actions et note apparaissaient ensemble, ce qui
 * revient à n'avoir aucune hiérarchie à l'arrivée. Chaque pièce entre
 * maintenant à son tour, dans l'ordre où on la lit, sur six dixièmes de
 * seconde au total. Le filet d'or se tire au lieu de se révéler.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Invitation() {
  const reduit = useReducedMotion();

  /* La même entrée pour chaque pièce : elle monte de douze pixels et se
     révèle. Seul le rang change, et c'est le `staggerChildren` du parent
     qui le donne — rien n'est codé pièce par pièce. */
  const monte = {
    repos: { opacity: 0, y: reduit ? 0 : 12 },
    pose: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="invitation"
      className="mouvement grain-clair relative isolate overflow-x-clip"
      style={{ background: ciel("invitation") }}
    >
      {/*
        La lumière est basse et vient de la gauche : c'est la fin du jour.
        PAS DE FLAQUE ICI. Une flaque caustique est la TRACE d'un jet
        traversant un verre, reçue sur une surface. Sans jet au-dessus ni
        chêne dessous, elle ne se lit plus comme de la lumière mais comme
        une tache — exactement ce que la direction proscrit. La lueur
        rasante, elle, a une cause.
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 80% at 6% 12%, rgba(255,246,224,0.9) 0%, rgba(255,238,200,0.3) 38%, rgba(255,238,200,0) 70%)",
          }}
        />
      </div>

      <div className="px relative z-10 mx-auto w-full max-w-[1420px]">
        <motion.div
          initial="repos"
          whileInView="pose"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            pose: { transition: { staggerChildren: reduit ? 0 : 0.1 } },
          }}
        >
          <motion.h2
            className="strophe max-w-[18ch] text-[clamp(2.4rem,6vw,5rem)]"
            variants={monte}
            transition={{ duration: reduit ? 0 : 0.8, ease: EASE }}
          >
            Vingt minutes,
            <br />
            <em>sur votre propre carte.</em>
          </motion.h2>

          <motion.div
            className="filet-or mt-9 h-px w-44 origin-left"
            variants={{
              repos: { scaleX: reduit ? 1 : 0, opacity: 1 },
              pose: { scaleX: 1, opacity: 1 },
            }}
            transition={{ duration: reduit ? 0 : 0.5, ease: EASE }}
          />

          <motion.p
            className="t-chapeau mt-9 max-w-[46ch] text-pretty text-[color:var(--color-texte)]"
            variants={monte}
            transition={{ duration: reduit ? 0 : 0.8, ease: EASE }}
          >
            Nous faisons entrer votre carte des vins devant vous, et vous voyez
            l’écran que vos clients auraient ce soir. Pas de diaporama, pas de
            cave de démonstration : la vôtre.
          </motion.p>

          <motion.div
            className="mt-11 flex flex-col flex-wrap items-stretch gap-x-10 gap-y-6 sm:flex-row sm:items-center"
            variants={monte}
            transition={{ duration: reduit ? 0 : 0.8, ease: EASE }}
          >
            <Link
              href="/demonstration"
              className="bouton bouton-primaire group"
            >
              Demander une démonstration
              <span
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            {/*
              PAS DE `mailto:` ICI. Le pied de page offre l'adresse, et c'est
              sa place : à côté de l'appel à l'action, un lien courriel
              détourne la conversion hors du formulaire — le seul chemin
              instrumenté. Un test l'interdit depuis le chantier précédent,
              et il m'a rattrapé.
              L'action secondaire sert donc le lecteur qui hésite, sans le
              faire sortir du site : les formules.
            */}
            <Link href="/tarifs" className="lien-vif self-start sm:self-center">
              <span className="text-[0.82rem] tracking-[0.1em] uppercase">
                Voir les formules
              </span>
              <span aria-hidden>→</span>
            </Link>
          </motion.div>

          <motion.p
            className="t-meta relative z-10 mt-12 max-w-[52ch] text-[color:var(--color-faible)]"
            variants={monte}
            transition={{ duration: reduit ? 0 : 0.8, ease: EASE }}
          >
            Tous les écrans de cette page sont de vraies captures de Vintoria
            Pro 2.0.2, prises sur l’établissement de démonstration —{" "}
            {COMPTE[0].nombre} références, {COMPTE[1].nombre} bouteilles. Ce
            sont des données de démonstration, jamais une moyenne ni une
            performance.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
