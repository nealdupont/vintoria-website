"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ciel } from "@/lib/lumiere";

/**
 * MOUVEMENT II — LE GESTE.
 *
 * L'objection qu'il tue : « ça va me prendre des semaines à paramétrer ».
 * C'est la première qui vient à un restaurateur devant un logiciel, et aucun
 * argument ne la dissout — seule la vue du chemin le fait.
 *
 * LE BALAYAGE QUI RÉVÈLE. C'est ici, et NULLE PART AILLEURS, que la lumière
 * dessine l'interface au lieu de l'éclairer : le front du masque avance,
 * l'écran apparaît dans son sillage. Le geste dit exactement ce que dit la
 * section — ça n'est pas un chantier, c'est un passage.
 * Répété à chaque section, il ne voudrait plus rien dire. Une fois, il parle.
 *
 * Les trois entrées listées ne sont pas inventées : ce sont les trois que
 * l'écran propose réellement, dans ses propres mots.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
/** Le balayage part vite et se pose : une lumière ne jaillit pas, elle passe. */
const EASE_BALAI = [0.4, 0, 0.2, 1] as const;

const ENTREES = [
  {
    cle: "etiquette",
    quoi: "Photographier l’étiquette",
    dit: "Vintoria y lit le nom, le domaine et le millésime.",
  },
  {
    cle: "carte",
    quoi: "Importer une carte des vins",
    dit: "Un PDF ou une photo : tous les vins d’un coup.",
  },
  {
    cle: "liste",
    quoi: "Coller une liste",
    dit: "Un vin par ligne, prix compris.",
  },
] as const;

export function Geste() {
  const reduit = useReducedMotion();

  return (
    <section
      id="geste"
      className="grain-clair relative isolate overflow-x-clip pt-28 pb-32 sm:pt-36"
      style={{ background: ciel("geste") }}
    >
      {/* ── LA SCÈNE — le jour se lève, teinté de feuille ──────────
          La sauge arrive en `multiply`, comme toutes les couleurs de ce
          site : c'est de la lumière passée par une feuille, pas un aplat
          vert posé sur un fond. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="voile-sauge top-[34%] left-[-16%] h-[46%] w-[50%] opacity-70" />
        <div className="jet top-[-16%] left-[72%] h-[66%] opacity-70" />
      </div>

      <div className="px relative z-10 mx-auto w-full max-w-[1420px]">
        <div className="grid gap-y-16 lg:grid-cols-12 lg:gap-x-14">
          {/* ── LE PROPOS ────────────────────────────────────────── */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: reduit ? 0 : 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduit ? 0 : 0.9, ease: EASE }}
          >
            <p className="eyebrow text-[color:var(--color-faible)]">
              Pour commencer
            </p>
            <h2 className="strophe mt-5 text-[clamp(2rem,4.6vw,3.6rem)]">
              Votre carte entre
              <br />
              <em>en une fois.</em>
            </h2>
            <p className="t-chapeau mt-7 max-w-[42ch] text-pretty text-[color:var(--color-texte)]">
              Pas de saisie ligne à ligne, pas de tableur à préparer. Vous
              donnez ce que vous avez déjà — Vintoria complète le reste.
            </p>

            <motion.ul
              className="mt-12"
              initial="repos"
              whileInView="pose"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                pose: { transition: { staggerChildren: reduit ? 0 : 0.12 } },
              }}
            >
              {ENTREES.map((e) => (
                <motion.li
                  key={e.cle}
                  className="border-t border-[color:var(--color-filet)] py-5"
                  variants={{
                    repos: { opacity: 0, y: reduit ? 0 : 14 },
                    pose: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: reduit ? 0 : 0.7, ease: EASE }}
                >
                  <p className="voix t-tete text-[color:var(--color-fort)]">
                    {e.quoi}
                  </p>
                  <p className="t-meta mt-1.5 text-[color:var(--color-faible)]">
                    {e.dit}
                  </p>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ── L'ÉCRAN QUE LA LUMIÈRE DESSINE ───────────────────────
              Le conteneur porte l'orchestration ; il a TOUJOURS une
              taille réelle, et c'est lui qu'observe `whileInView`. Un
              observateur posé sur l'élément masqué aurait pu ne jamais
              se déclencher — le masque ne change pas la géométrie, mais
              une opacité nulle sur le même nœud, si. */}
          <motion.div
            className="relative lg:col-span-7"
            initial="repos"
            whileInView="revele"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="objet relative w-[112%] overflow-hidden sm:w-[106%] lg:w-[124%]">
              <motion.div
                className="revele"
                variants={{
                  repos: { "--balaye": "0%" },
                  revele: { "--balaye": "130%" },
                }}
                transition={{ duration: reduit ? 0 : 1.7, ease: EASE_BALAI }}
              >
                <Image
                  src="/demo/ajouter.webp"
                  alt="Vintoria Pro, ajout d’un vin : « Sancerre, Domaine du Silex, 2023 » saisi comme on le dirait, et trois entrées possibles — photographier l’étiquette, importer une carte des vins, coller une liste."
                  width={1500}
                  height={940}
                  sizes="(min-width: 1024px) 880px, 112vw"
                  loading="lazy"
                  className="block h-auto w-full"
                />
              </motion.div>

              {/* Le front lumineux : ce qu'on voit passer. Même angle que
                  le masque — sinon la lumière et la révélation divergent. */}
              {!reduit && (
                <motion.div
                  className="front"
                  variants={{
                    repos: { x: "-80%", opacity: 0 },
                    revele: { x: "125%", opacity: [0, 0.95, 0.95, 0] },
                  }}
                  transition={{
                    x: { duration: 1.7, ease: EASE_BALAI },
                    opacity: {
                      duration: 1.7,
                      times: [0, 0.1, 0.76, 1],
                      ease: "linear",
                    },
                  }}
                />
              )}
            </div>

            <p className="t-meta mt-6 max-w-[48ch] text-[color:var(--color-faible)]">
              Écran réel de Vintoria Pro 2.0.2. Une lecture de document compte
              comme un import du mois — le produit le dit lui-même, en bas du
              panneau.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
