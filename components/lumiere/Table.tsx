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
 *
 * ── CE QUE LA REFONTE A CHANGÉ ─────────────────────────────────────────
 *
 * ELLE COÛTAIT 1,67 ÉCRAN POUR CINQUANTE-SIX MOTS — trente-quatre mots par
 * écran, le deuxième plus creux de la page après la cave. Rien à retirer :
 * le texte est court et le geste est le sujet. C'était l'EMPILEMENT, encore
 * une fois : un propos pleine largeur, puis une capture de 1100 px, puis
 * trois étapes centrées dessous, puis une note. Quatre hauteurs pour une
 * seule idée.
 *
 * LE PROPOS ET LE GESTE SE REGARDENT. Le texte, les trois étapes et la note
 * tiennent quatre colonnes à gauche ; la scène en occupe huit à droite. Le
 * lecteur lit « un scan, un plat, un accord » PENDANT que le carré se
 * détache — ce qui est la même phrase, dite deux fois, dans deux langues.
 *
 * ET LES TROIS ÉTAPES SONT DEVENUES UNE LISTE VERTICALE, numérotée. Elles
 * étaient une rangée de mots séparés par des flèches, centrée sous l'écran :
 * une frise. En colonne, à gauche, elles redeviennent ce qu'elles sont —
 * un parcours en trois temps, qu'on lit de haut en bas comme le reste.
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
      className="mouvement grain-clair relative isolate overflow-x-clip"
      style={{ background: ciel("table") }}
    >
      {/*
        LA LUMIÈRE A SUIVI LA COMPOSITION. Les deux faisceaux tombaient à
        18 % de la largeur, là où il n'y avait rien ; depuis que le propos
        occupe cette colonne, le faisceau bordeaux passait DERRIÈRE le titre
        et s'y lisait comme une tache — exactement ce que la direction
        proscrit. Le jet clair reste à gauche, où il éclaire la lecture ;
        le bordeaux part à droite, sous la scène, où il a une cause : c'est
        la lumière du vin qui tombe sur la table.
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="jet top-[-10%] left-[12%] h-[58%] opacity-50" />
        {/* La scène n'est pas au même endroit selon la largeur : à droite
            du propos au-delà de `lg`, en dessous de lui avant. Le faisceau
            bordeaux la suit, sans quoi il retomberait sur le texte. */}
        <div className="jet-vin top-[62%] left-[38%] h-[30%] opacity-35 lg:top-[30%] lg:left-[66%] lg:h-[34%] lg:opacity-40" />
      </div>

      <div className="px relative z-10 mx-auto w-full max-w-[1420px]">
        {/*
          UN SEUL ORCHESTRATEUR POUR TOUTE LA SECTION — et c'est maintenant
          la grille elle-même. Les quatre pièces du geste partagent son
          déclenchement, donc elles ne peuvent pas se désynchroniser ; les
          trois étapes, qui vivent désormais dans l'autre colonne, en font
          partie au même titre. Le bloc de titre garde son propre fondu :
          il doit être lisible avant que le geste commence.
        */}
        <motion.div
          className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-14"
          initial="pose"
          whileInView="detache"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* ══ LE PROPOS, LE PARCOURS, LA PROVENANCE ══════════════ */}
          <div className="lg:col-span-4">
            <motion.div
              className="max-w-[50ch]"
              initial={{ opacity: 0, y: reduit ? 0 : 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={t(0, 0.9)}
            >
              <p className="eyebrow text-[color:var(--color-faible)]">
                En salle
              </p>
              <h2 className="strophe mt-5 text-[clamp(2rem,4.6vw,3.6rem)]">
                Un scan.
                <br />
                <em>Un plat. Un accord.</em>
              </h2>
              <p className="t-chapeau mt-7 text-pretty text-[color:var(--color-texte)]">
                Vintoria vous rend un code à imprimer et à poser sur vos tables.
                Pas d’application à faire installer, pas de compte à créer : vos
                clients scannent, et ils y sont.
              </p>
            </motion.div>

            {/* Les trois étapes — celles de l'écran, dans ses mots.
                Elles arrivent APRÈS le geste : le carré se détache, puis on
                nomme ce qui vient ensuite. */}
            <motion.ol
              className="mt-10 flex flex-col"
              variants={{ pose: { opacity: 0 }, detache: { opacity: 1 } }}
              transition={t(reduit ? 0 : 1.5, 0.8)}
            >
              {ETAPES.map((e, i) => (
                <li
                  key={e}
                  className="flex items-baseline gap-4 border-t border-[color:var(--color-filet)] py-4 last:border-b"
                >
                  <span
                    aria-hidden
                    className="data w-6 shrink-0 text-[0.7rem] tracking-[0.14em] text-[color:var(--color-accent)] tabular-nums"
                  >
                    {`0${i + 1}`}
                  </span>
                  <span className="voix text-[1.02rem] text-[color:var(--color-fort)] sm:text-[1.1rem]">
                    {e}
                  </span>
                </li>
              ))}
            </motion.ol>

            <p className="t-meta mt-8 max-w-[44ch] text-[color:var(--color-faible)]">
              Écran réel de Vintoria Pro 2.0.2. Le lien public et le code sont
              ceux de l’établissement de démonstration.
            </p>
          </div>

          {/* ══ LE DÉTACHEMENT ════════════════════════════════════ */}
          <div className="mt-14 lg:col-span-8 lg:mt-0">
            <div className="relative w-full">
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
                  alt="Vintoria Pro, écran Salle : le QR code d’accès client, son lien public, le support imprimable en A6, et le parcours : scanner, choisir son plat, découvrir l’accord."
                  width={1600}
                  height={1000}
                  sizes="(min-width: 1024px) 820px, 94vw"
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
                  sizes="(min-width: 1024px) 320px, 36vw"
                  loading="lazy"
                  className="block h-full w-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
