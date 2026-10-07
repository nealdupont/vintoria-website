"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ciel } from "@/lib/lumiere";

/**
 * MOUVEMENT V — LA TABLE.
 *
 * LE PASSAGE DU PRODUIT À L'EXPÉRIENCE CLIENT. C'est la charnière de
 * l'accueil : jusqu'ici on parlait au restaurateur de son outil ; à partir
 * d'ici on lui montre ce que vit son client.
 *
 * ET LE PRODUIT PORTE LUI-MÊME LA CHARNIÈRE. L'écran Salle contient déjà la
 * phrase « Un scan. Un plat. Un accord. » et les trois étapes du parcours.
 * Je n'invente donc pas une transition : je me sers de celle que le produit
 * a déjà écrite.
 *
 * LE CARRÉ SE DÉTACHE. Le QR est superposé À SON PROPRE EMPLACEMENT dans la
 * capture — mesuré au pixel : x 338, y 168, 298 × 296 sur 1600 × 1000, soit
 * 21,125 % / 16,8 % / 18,625 % / 29,6 %. Tant qu'il ne bouge pas il est
 * invisible, puisqu'il recouvre exactement ce qu'il copie. Puis il quitte
 * l'écran, grandit et vient au centre pendant que l'écran recule : l'objet
 * passe du logiciel à la salle — ce qui est littéralement ce qu'on fait
 * quand on imprime ce code et qu'on le pose sur une table.
 *
 * POURQUOI CE N'EST PAS PILOTÉ AU DÉFILEMENT, contrairement à L'instant et
 * à L'accord. Première version : oui. Mais en production, à fenêtre fixe, la
 * progression de défilement de cette section restait bloquée à zéro, et
 * selon la taille de la fenêtre certaines valeurs suivaient quand d'autres
 * restaient collées à leur état initial. Je n'ai pas su expliquer ce
 * comportement depuis l'extérieur de la bibliothèque, et je ne livre pas
 * l'animation charnière de la page sur un mécanisme que je ne sais pas
 * reproduire. Une orchestration déclenchée À L'ENTRÉE donne le même geste,
 * la même intention, un état final CONNU — donc vérifiable par un test — et
 * elle supprime au passage les 120 vh de course à vide qu'exigeait le
 * défilement.
 *
 * Le mouvement suivant ouvre sur le téléphone, AU CENTRE lui aussi : l'œil
 * est déjà au bon endroit. La continuité est spatiale, pas déclarée.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/** L'emplacement exact du carré dans la capture, en pourcentages. */
const CARRE = { gauche: 21.125, haut: 16.8, largeur: 18.625, hauteur: 29.6 };

/** Ce qu'il faut parcourir pour amener son centre au centre du cadre,
 *  exprimé dans SA propre taille — donc stable à toutes les largeurs. */
const VERS_CENTRE = {
  x: (50 - (CARRE.gauche + CARRE.largeur / 2)) / CARRE.largeur, // ≈ 1,05
  y: (50 - (CARRE.haut + CARRE.hauteur / 2)) / CARRE.hauteur, // ≈ 0,62
};

const ETAPES = ["Scanner", "Choisir son plat", "Découvrir l’accord"] as const;

export function Table() {
  const reduit = useReducedMotion();

  /*
    MOUVEMENT RÉDUIT : le carré NE SE DÉTACHE PAS. On ne montre pas l'état
    final d'un geste dont on a retiré le geste — ce serait un écran amputé
    de son QR, avec une pièce grise à la place. On montre l'écran intact,
    et les trois étapes, qui portent le propos à elles seules.
  */
  const t = (delai: number, duree: number) => ({
    duration: reduit ? 0 : duree,
    delay: reduit ? 0 : delai,
    ease: EASE,
  });

  return (
    <section
      id="table"
      className="grain-clair relative isolate overflow-x-clip pt-28 pb-36 sm:pt-36"
      style={{ background: ciel("table") }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="jet top-[-10%] left-[18%] h-[58%] opacity-60" />
        <div className="jet-vin top-[24%] left-[18%] h-[30%] opacity-45" />
      </div>

      <div className="px relative z-10 mx-auto w-full max-w-[1420px]">
        <motion.div
          className="max-w-[50ch]"
          initial={{ opacity: 0, y: reduit ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={t(0, 0.9)}
        >
          <p className="eyebrow text-[color:var(--color-faible)]">En salle</p>
          <h2 className="strophe mt-5 text-[clamp(2rem,4.6vw,3.6rem)]">
            Un scan.
            <br />
            <em>Un plat. Un accord.</em>
          </h2>
          <p className="t-chapeau mt-7 text-pretty text-[color:var(--color-texte)]">
            Vintoria vous rend un code à imprimer et à poser sur vos tables. Pas
            d’application à faire installer, pas de compte à créer : vos clients
            scannent, et ils y sont.
          </p>
        </motion.div>

        {/* ── LE DÉTACHEMENT ───────────────────────────────────────
            Un seul orchestrateur : les quatre pièces du geste partagent
            son déclenchement, donc elles ne peuvent pas se désynchroniser. */}
        <motion.div
          className="mt-16 flex flex-col items-center sm:mt-20"
          initial="pose"
          whileInView="detache"
          viewport={{ once: true, amount: 0.45 }}
        >
          <div className="relative w-full max-w-[1100px]">
            <motion.div
              className="objet overflow-hidden"
              variants={{
                pose: { scale: 1, opacity: 1 },
                detache: {
                  scale: reduit ? 1 : 0.92,
                  opacity: reduit ? 1 : 0.2,
                },
              }}
              transition={t(0.45, 1.2)}
            >
              <Image
                src="/produit/qr.webp"
                alt="Vintoria Pro, écran Salle : le QR code d’accès client, son lien public, le support imprimable en A6, et le parcours — scanner, choisir son plat, découvrir l’accord."
                width={1600}
                height={1000}
                sizes="(min-width: 1024px) 1100px, 94vw"
                loading="lazy"
                className="block h-auto w-full"
              />

              {/* Le QR est IMPRIMÉ dans la capture : une fois le carré parti,
                  son double resurgirait et on en verrait deux. Cette pièce
                  comble le trou — sa couleur est prélevée dans la capture
                  elle-même (#f2f1ed, la « pierre » de l'Atelier). */}
              <motion.div
                aria-hidden
                className="absolute rounded-[2%]"
                style={{
                  left: "19.8%",
                  top: "15.2%",
                  width: "21.4%",
                  height: "36.8%",
                  background: "#f2f1ed",
                }}
                variants={{
                  pose: { opacity: 0 },
                  detache: { opacity: reduit ? 0 : 1 },
                }}
                transition={t(0.6, 0.35)}
              />
            </motion.div>

            {/* Le carré, posé EXACTEMENT sur son double. */}
            <motion.div
              aria-hidden
              className="absolute overflow-hidden rounded-[6%]"
              style={{
                left: `${CARRE.gauche}%`,
                top: `${CARRE.haut}%`,
                width: `${CARRE.largeur}%`,
                height: `${CARRE.hauteur}%`,
              }}
              variants={{
                pose: {
                  x: "0%",
                  y: "0%",
                  scale: 1,
                  boxShadow: "0px 0px 0px 0px rgba(27,22,24,0)",
                },
                detache: reduit
                  ? { x: "0%", y: "0%", scale: 1 }
                  : {
                      x: `${VERS_CENTRE.x * 100}%`,
                      y: `${VERS_CENTRE.y * 100}%`,
                      scale: 2.4,
                      boxShadow: "0px 48px 90px -36px rgba(27,22,24,0.4)",
                    },
              }}
              transition={t(0.45, 1.3)}
            >
              <Image
                src="/produit/qr-carre.webp"
                alt=""
                width={760}
                height={755}
                sizes="(min-width: 1024px) 420px, 36vw"
                loading="lazy"
                className="block h-full w-full object-cover"
              />
            </motion.div>
          </div>

          {/* Les trois étapes — celles de l'écran, dans ses mots. */}
          <motion.ol
            className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
            variants={{ pose: { opacity: 0 }, detache: { opacity: 1 } }}
            transition={t(reduit ? 0 : 1.5, 0.8)}
          >
            {ETAPES.map((e, i) => (
              <li key={e} className="flex items-center gap-3">
                <span className="data text-[0.74rem] tracking-[0.16em] text-[color:var(--color-fort)] uppercase">
                  {e}
                </span>
                {i < ETAPES.length - 1 && (
                  <span
                    aria-hidden
                    className="text-[color:var(--color-accent)]"
                  >
                    →
                  </span>
                )}
              </li>
            ))}
          </motion.ol>
        </motion.div>

        <p className="t-meta mx-auto mt-16 max-w-[56ch] text-center text-[color:var(--color-faible)]">
          Écran réel de Vintoria Pro 2.0.2. Le lien public et le code sont ceux
          de l’établissement de démonstration.
        </p>
      </div>
    </section>
  );
}
