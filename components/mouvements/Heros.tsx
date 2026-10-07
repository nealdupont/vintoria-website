"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Verre } from "@/components/Verre";
import { ROBES, variablesRobe } from "@/lib/robes";

/**
 * LE HÉROS.
 *
 * Une seule colonne centrée, beaucoup de vide. Le regard n'a aucun choix à
 * faire : à chaque étape, un seul élément est le plus contrasté de l'écran.
 *   sceau → VINTORIA → l'accroche → l'explication → le CTA → pour qui
 *
 * L'accroche crée l'émotion ; la ligne suivante supprime toute ambiguïté.
 * On raconte la valeur vécue par le CLIENT à table, jamais la mécanique
 * interne — c'est lui l'utilisateur, le restaurateur est l'acheteur.
 *
 * La ligne « pour qui » est l'ajout de la refonte : en vingt secondes, un
 * restaurateur doit savoir que cette page lui parle à LUI. Sans elle, le
 * héros était beau mais ne s'adressait à personne en particulier.
 *
 * Une seule séquence d'environ 3 s, puis plus rien ne bouge.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Heros() {
  const reduce = useReducedMotion();
  const t = (delai: number) => ({
    duration: reduce ? 0 : 1,
    delay: reduce ? 0 : delai,
    ease: EASE,
  });

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      /* Le héros porte le grenat : la robe de référence de la marque. */
      style={variablesRobe(ROBES.cdp)}
    >
      {/* Le verre — moitié droite, débordant du cadre */}
      <Verre className="absolute right-[-26%] top-1/2 h-[92%] w-[62%] -translate-y-1/2 sm:right-[-12%] sm:h-[104%] sm:w-[46%] lg:right-[-8%] lg:h-[108%] lg:w-[34%]" />

      {/* Le voile qui garantit que le texte domine toujours */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-encre via-encre/92 to-encre/45 sm:via-encre/85 sm:to-transparent"
      />

      <div className="px relative z-10 mx-auto w-full max-w-[1500px] py-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          {/* Le sceau */}
          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...t(0.15), duration: reduce ? 0 : 1.1 }}
          >
            <Image
              src="/vintoria-logo.webp"
              alt=""
              width={256}
              height={311}
              sizes="(min-width: 640px) 64px, 56px"
              priority
              className="h-14 w-auto sm:h-16"
            />
          </motion.div>

          <h1 className="mt-10 flex flex-col items-center">
            {/* VINTORIA — l'interlettrage se resserre en se posant */}
            <motion.span
              className="voix block text-[clamp(2.9rem,10.5vw,9rem)] leading-[0.92] text-os"
              initial={{ opacity: 0, letterSpacing: reduce ? "0.14em" : "0.42em" }}
              animate={{ opacity: 1, letterSpacing: "0.14em" }}
              transition={{ ...t(0.5), duration: reduce ? 0 : 1.4 }}
            >
              VINTORIA
            </motion.span>

            {/* L'accroche — l'émotion */}
            <motion.span
              className="voix mt-8 block max-w-[32rem] text-balance text-[clamp(1.35rem,2.9vw,2.15rem)] leading-[1.24] text-os"
              initial={{ opacity: 0, y: reduce ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(1.5)}
            >
              Chaque table mérite les conseils d’un sommelier.
            </motion.span>
          </h1>

          {/* L'explication — plus aucune ambiguïté */}
          <motion.p
            className="t-chapeau mt-7 max-w-[34rem] text-pretty text-cendre"
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(1.8)}
          >
            Vos clients scannent un QR code, choisissent leur plat, et découvrent
            les meilleurs vins de votre carte, expliqués comme le ferait un
            sommelier.
          </motion.p>

          {/* Les CTA — une action principale, une alternative pour qui doute */}
          <motion.div
            className="mt-12 flex flex-col items-center gap-5 sm:flex-row"
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...t(2.1), duration: reduce ? 0 : 0.9 }}
          >
            <Link href="/demonstration" className="bouton bouton-primaire group">
              Demander une démonstration
              <span
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <a href="#conseil" className="bouton bouton-fantome">
              Voir le produit
            </a>
          </motion.div>

          {/* Pour qui — la phrase qui fait que le lecteur se reconnaît */}
          <motion.p
            className="t-meta mt-10 max-w-[38rem] text-balance text-cendre-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...t(2.5), duration: reduce ? 0 : 0.9 }}
          >
            Pour les restaurants et les hôtels qui ont une carte des vins, et pas
            toujours un sommelier en salle.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
