"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Symbole } from "@/components/marque/Marque";
import { VerreBourgogne } from "./VerreBourgogne";

/**
 * MOUVEMENT I — L'OUVERTURE.
 *
 * UNE SCÈNE, PAS UNE LANDING PAGE. La version précédente posait le texte à
 * gauche et une capture produit à droite : c'est la grammaire de n'importe
 * quel SaaS, et elle réduisait l'ouverture à une démonstration de
 * fonctionnalité. L'écran produit est retiré ; il a sa place au mouvement
 * III, quand on a gagné le droit de montrer l'outil.
 *
 * COMPOSITION AXIALE. Tout est sur un seul axe vertical, centré, avec
 * beaucoup de vide autour : symbole, titre, filet, promesse, action. L'œil
 * n'a aucun arbitrage à faire — il descend.
 *
 * LE VERRE EST LA CAUSE. Jusqu'ici la page montrait ce que la lumière FAIT
 * sans montrer ce qu'elle traverse ; l'œil complétait. Le verre en place, la
 * chaîne est entière et elle se lit dans cet ordre exact :
 *   crème → jet → calice → le jet vire au bordeaux → flaque sur la table.
 * Le texte vit DANS le volume du calice, au-dessus du vin — là où, dans un
 * vrai verre, il n'y a que l'arôme.
 *
 * LA CHORÉGRAPHIE est lente et d'un seul tenant : la lumière entre, le verre
 * se trace, le vin monte, le reflet s'allume, puis seulement la marque et le
 * propos. La flaque se forme en DERNIER — c'est la chute : la lumière a
 * traversé, et elle a laissé quelque chose.
 * Aucun ressort, aucun rebond, aucun dépassement : des courbes à départ
 * lent et à longue résolution. Tout est en opacité et en translation, sauf
 * le tracé du verre, qui est un `stroke-dashoffset` — un seul chemin, une
 * seule fois.
 */

/* Départ lent, longue résolution. Pas d'ease-out brutal : on entre dans une
   salle, on ne surgit pas. */
const EASE = [0.32, 0.04, 0.12, 1] as const;

export function Ouverture() {
  const reduit = useReducedMotion();

  const pas = (delai: number, duree = 1.2) => ({
    duration: reduit ? 0 : duree,
    delay: reduit ? 0 : delai,
    ease: EASE,
  });
  const monte = (y = 16) => ({ opacity: 0, y: reduit ? 0 : y });
  const pose = { opacity: 1, y: 0 };

  return (
    <section
      id="ouverture"
      className="grain-clair relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* ══ LA SCÈNE ══════════════════════════════════════════════ */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* La table : le verre pose sur quelque chose. */}
        <div className="sol h-[26%] sm:h-[24%]" />
        <div className="arete bottom-[26%] sm:bottom-[24%]" />

        {/* Le jet entre par le haut, légèrement à gauche du verre : c'est
            de ce côté que le reflet s'allume, et de l'autre que la flaque
            tombe. Une seule source, et tout en découle. */}
        <motion.div
          className="jet left-[42%] sm:left-[44%]"
          style={{ transformOrigin: "top center" }}
          initial={{ opacity: 0, scaleY: reduit ? 1 : 0.55 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={pas(0, 2)}
        />

        {/* LE VERRE. Centré, bas, grand — et à peine visible. */}
        <motion.div
          className="absolute bottom-[24%] left-1/2 h-[56svh] -translate-x-1/2 sm:bottom-[13%] sm:h-[72svh] lg:h-[76svh]"
          style={{ aspectRatio: "560 / 920" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={pas(0.1, 1)}
        >
          <VerreBourgogne className="h-full w-full" retard={0.15} />
        </motion.div>

        {/* LA LUMIÈRE RESSORT COLORÉE. Elle sort du calice, donc elle est
            ÉTROITE — large comme le fond du verre, pas comme le verre.
            La classe `.jet-vin` est taillée pour une autre scène : 337 px
            de large et 36 px de flou y faisaient une brume bordeaux
            par-dessus l'appel à l'action. Ici, un faisceau. */}
        <motion.div
          className="pointer-events-none absolute"
          style={{
            top: "60%",
            left: "50%",
            width: "clamp(56px, 7vw, 104px)",
            height: "17%",
            transform: "translateX(-50%)",
            background:
              "linear-gradient(to bottom, color-mix(in srgb, var(--vintoria-bordeaux-700) 0%, transparent) 0%, color-mix(in srgb, var(--vintoria-bordeaux-700) 30%, transparent) 30%, color-mix(in srgb, var(--vintoria-vin) 28%, transparent) 74%, color-mix(in srgb, var(--vintoria-vin) 0%, transparent) 100%)",
            mixBlendMode: "multiply",
            filter: "blur(14px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={pas(1.5, 1.4)}
        />

        {/* La flaque — la chute. Décalée à droite du pied : la lumière
            réfractée ne retombe jamais à l'aplomb de sa source. */}
        <motion.div
          className="flaque"
          style={{
            bottom: "1%",
            left: "50%",
            width: "clamp(150px, 16vw, 260px)",
            transform: "translateX(-32%)",
          }}
          initial={{ opacity: 0, scale: reduit ? 1 : 0.84 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={pas(3.2, 1.3)}
        />
        <motion.div
          className="flaque-coeur"
          style={{
            bottom: "2.5%",
            left: "50%",
            width: "clamp(64px, 7vw, 116px)",
            transform: "translateX(-18%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={pas(3.5, 1.1)}
        />
      </div>

      {/* ══ LE PROPOS ═════════════════════════════════════════════ */}
      <div className="px relative z-10 w-full">
        <div className="mx-auto flex max-w-[38rem] flex-col items-center text-center">
          {/* 1 · LA MARQUE. Le symbole seul : le wordmark est déjà dans
              l'en-tête, et l'écrire deux fois l'affaiblirait. */}
          <motion.div
            initial={{ opacity: 0, y: reduit ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={pas(1.9, 1.3)}
          >
            <Symbole
              hauteur={58}
              priority
              className="h-[52px] w-auto sm:h-[58px]"
            />
          </motion.div>

          {/* 2 · LE TITRE */}
          <h1 className="strophe mt-9 text-[clamp(2.3rem,6.4vw,4.6rem)] sm:mt-10">
            <motion.span
              className="block"
              initial={monte(18)}
              animate={pose}
              transition={pas(2.15, 1.35)}
            >
              L’univers du vin,
            </motion.span>
            <motion.span
              className="block"
              initial={monte(18)}
              animate={pose}
              transition={pas(2.33, 1.35)}
            >
              <em>pensé autrement.</em>
            </motion.span>
          </h1>

          <motion.div
            className="mt-9 h-px w-24 bg-[color:var(--color-filet-fort)]"
            initial={{ opacity: 0, scaleX: reduit ? 1 : 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={pas(2.6, 1.2)}
          />

          {/* 4 · LA PROPOSITION DE VALEUR */}
          <motion.p
            className="t-chapeau mt-9 max-w-[34rem] text-pretty text-[color:var(--color-texte)]"
            initial={monte(12)}
            animate={pose}
            transition={pas(2.75, 1.3)}
          >
            Vos clients choisissent leur plat. Vintoria leur recommande le vin
            de votre carte qui l’accompagne — et leur explique pourquoi.
          </motion.p>

          {/* 5 · L'ACTION */}
          <motion.div
            className="mt-11 flex flex-col items-center gap-5"
            initial={monte(10)}
            animate={pose}
            transition={pas(3, 1.2)}
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
            <a href="#geste" className="lien-vif">
              <span className="text-[0.8rem] tracking-[0.1em] uppercase">
                Voir le produit
              </span>
              <span aria-hidden>↓</span>
            </a>
          </motion.div>

          {/* En texte SECONDAIRE et non discret : sur une fenêtre basse,
              cette ligne passe au-dessus de la flaque (sonde de
              tests/marque.spec.ts : 4,0:1 en discret, 5:1 ici). */}
          <motion.p
            className="t-meta mt-10 max-w-[36rem] text-balance text-[color:var(--color-texte)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={pas(3.35, 1.2)}
          >
            Pour les restaurants et les hôtels qui ont une carte des vins, et
            pas toujours un sommelier en salle.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
