"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ciel } from "@/lib/lumiere";

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
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Invitation() {
  const reduit = useReducedMotion();

  return (
    <section
      id="invitation"
      className="grain-clair relative isolate overflow-x-clip py-36 sm:py-44"
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
          initial={{ opacity: 0, y: reduit ? 0 : 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduit ? 0 : 1, ease: EASE }}
        >
          <h2 className="strophe max-w-[18ch] text-[clamp(2.4rem,6vw,5rem)]">
            Vingt minutes,
            <br />
            <em>sur votre propre carte.</em>
          </h2>

          <div className="filet-or mt-10 h-px w-44" />

          <p className="t-chapeau mt-10 max-w-[46ch] text-pretty text-[color:var(--color-texte)]">
            Nous faisons entrer votre carte des vins devant vous, et vous voyez
            l’écran que vos clients auraient ce soir. Pas de diaporama, pas de
            cave de démonstration : la vôtre.
          </p>

          <div className="mt-12 flex flex-col flex-wrap items-stretch gap-x-10 gap-y-6 sm:flex-row sm:items-center">
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
          </div>

          <p className="t-meta relative z-10 mt-14 max-w-[52ch] text-[color:var(--color-faible)]">
            Tous les écrans de cette page sont de vraies captures de Vintoria
            Pro 2.0.2, prises sur l’établissement de démonstration — quinze
            références, cent soixante-dix-neuf bouteilles. Ce sont des données
            de démonstration, jamais une moyenne ni une performance.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
