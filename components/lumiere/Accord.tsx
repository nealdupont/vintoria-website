"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ciel } from "@/lib/lumiere";

/**
 * MOUVEMENT IV — L'ACCORD.
 *
 * L'objection qu'il tue : « c'est une boîte noire — est-ce que ça va vraiment
 * trouver des vins sur MA carte ? »
 *
 * LE RAPPROCHEMENT. La caméra entre dans l'écran réel au lieu que j'en
 * découpe des morceaux. C'est une décision, pas une facilité : j'ai déjà
 * employé deux fois l'agrandissement découpé (l'alerte de réassort), et une
 * troisième en aurait fait un tic plutôt qu'une langue. Ici on regarde le
 * même écran de plus près — c'est le geste de quelqu'un qui se penche.
 *
 * CE QU'ON VIENT LIRE, et qui est le vrai argument : « Soupe du moment —
 * 0 vin, aucun vin retenu ». Un produit qui dit où il ne peut rien est plus
 * crédible qu'un produit qui prétend tout couvrir. On ne met donc pas en
 * avant le chiffre flatteur, on met en avant le trou.
 *
 * Transformations seules — échelle et translation. Aucune mise en page.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Accord() {
  const racine = useRef<HTMLDivElement>(null);
  const reduit = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: racine,
    offset: ["start end", "end start"],
  });

  /* Le rapprochement se fait sur le TIERS CENTRAL du passage : on arrive
     sur l'écran entier, on se penche, on repart. Sans ces plages mortes,
     le zoom serait déjà commencé quand la section entre dans le champ. */
  const echelle = useTransform(scrollYProgress, [0.18, 0.52, 0.82], [1, 2, 2]);
  const voile = useTransform(scrollYProgress, [0.18, 0.46], [0, 1]);

  return (
    <section
      id="accord"
      className="grain-clair relative isolate overflow-x-clip pt-28 pb-32 sm:pt-36"
      style={{ background: ciel("accord") }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="jet top-[-20%] left-[26%] h-[70%] opacity-55" />
      </div>

      <div
        ref={racine}
        className="px relative z-10 mx-auto w-full max-w-[1420px]"
      >
        <motion.div
          initial={{ opacity: 0, y: reduit ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduit ? 0 : 0.9, ease: EASE }}
          className="max-w-[52ch]"
        >
          <p className="eyebrow text-[color:var(--color-faible)]">
            Les accords
          </p>
          <h2 className="strophe mt-5 text-[clamp(2rem,4.6vw,3.6rem)]">
            Chaque plat trouve ses vins.
            <br />
            <em>Et Vintoria dit lesquels manquent.</em>
          </h2>
          <p className="t-chapeau mt-7 text-pretty text-[color:var(--color-texte)]">
            Vos plats d’un côté, votre cave de l’autre. Le produit fait le
            rapprochement, plat par plat — et quand il ne trouve rien, il
            l’écrit noir sur blanc plutôt que de proposer n’importe quoi.
          </p>
        </motion.div>

        {/* ── LE RAPPROCHEMENT ─────────────────────────────────────── */}
        <motion.figure
          className="objet relative mt-16 m-0 overflow-hidden sm:mt-20"
          initial={{ opacity: 0, y: reduit ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduit ? 0 : 1, ease: EASE }}
        >
          <motion.div
            style={{
              scale: reduit ? 1 : echelle,
              /* LE POINT FIXE DU ZOOM, calculé et non choisi à l'œil.
                 La capture fait 1500 × 940. La ligne « Soupe du moment —
                 0 vin » — celle que la légende désigne — est à y ≈ 330,
                 soit 35 %. Le premier réglage visait 46 % : il cadrait
                 « Filet de bœuf », et la légende pointait donc une ligne
                 sortie du cadre.
                 En x, 44 % garde les noms de plats (qui commencent à
                 x ≈ 296) ET la colonne des vins (x ≈ 920-1020) dans la
                 fenêtre visible à l'échelle 2. */
              transformOrigin: "44% 35%",
            }}
          >
            <Image
              src="/demo/carte.webp"
              alt="Vintoria Pro, écran Carte : huit plats, chacun avec le nombre de vins que Vintoria lui a trouvés — et « Soupe du moment, 0 vin, aucun vin retenu » quand il n’en trouve aucun."
              width={1500}
              height={940}
              sizes="(min-width: 1024px) 1360px, 94vw"
              loading="lazy"
              className="block h-auto w-full"
            />
          </motion.div>

          {/* La légende n'apparaît qu'une fois le rapprochement engagé :
              avant, elle désignerait quelque chose d'illisible. */}
          <motion.figcaption
            className="pointer-events-none absolute right-0 bottom-0 left-0 px-5 py-4 sm:px-7 sm:py-5"
            style={{
              opacity: reduit ? 1 : voile,
              background:
                "linear-gradient(to top, color-mix(in srgb, var(--vintoria-creme-surface) 97%, transparent) 0%, color-mix(in srgb, var(--vintoria-creme-surface) 90%, transparent) 58%, color-mix(in srgb, var(--vintoria-creme-surface) 0%, transparent) 100%)",
            }}
          >
            <p className="t-meta max-w-[62ch] text-[color:var(--color-texte)]">
              <span className="text-[color:var(--color-accent)]">
                « Soupe du moment — 0 vin, aucun vin retenu. »
              </span>{" "}
              Le produit signale ses propres trous. C’est ce qui rend le reste
              croyable.
            </p>
          </motion.figcaption>
        </motion.figure>

        <p className="t-meta mt-6 max-w-[56ch] text-[color:var(--color-faible)]">
          Écran réel de Vintoria Pro 2.0.2, sur l’établissement de
          démonstration. Les huit plats et leurs comptes de vins sont ceux que
          le logiciel calcule.
        </p>
      </div>
    </section>
  );
}
