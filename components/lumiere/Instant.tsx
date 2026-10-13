"use client";

import { useCallback, useId, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ciel } from "@/lib/lumiere";

/**
 * L'INSTANT — le moment où le client choisit.
 *
 * ── POURQUOI CETTE SECTION A ÉTÉ RECOMPOSÉE ────────────────────────────
 *
 * Elle coûtait 3,2 écrans de défilement sur desktop et 2,5 sur mobile —
 * pour CENT SIX MOTS. Trois blocs en `min-h-screen` défilaient le long
 * d'une capture collante : le visiteur traversait trois hauteurs d'écran
 * pour lire trois phrases, et ce qu'il voyait pendant ce temps était
 * l'interface du logiciel, en permanence.
 *
 * LE BÉNÉFICE D'ABORD, LE DÉTAIL À LA DEMANDE. Les trois temps sont
 * devenus trois cartes : fermées, elles disent ce que le restaurateur y
 * gagne ; ouvertes, elles montrent l'écran correspondant et la phrase qui
 * l'explique. On lit la promesse en un coup d'œil, on creuse si on veut.
 *
 * LES TROIS CAPTURES RESTENT, et c'est volontaire : elles sont réelles,
 * nommées, et prises sur l'établissement de démonstration. Elles ne sont
 * simplement plus le décor permanent de la section — elles en sont la
 * preuve, montrée quand on la demande.
 *
 * LE MÉCANISME COLLANT A DISPARU avec les trois hauteurs d'écran. Le
 * garde-fou qui le surveillait n'a plus d'objet ; celui qui compte les
 * captures et vérifie leurs alternatives textuelles, lui, reste entier.
 *
 * ── CE QUE LA CARTE EMPRUNTE AU SYSTÈME ────────────────────────────────
 *
 * `.surface` porte le rayon, l'élévation et le halo ; `.surface-prise`
 * dit que ça se touche. Le halo s'allume au survol ET au focus : au
 * clavier on voit ce que la souris voit. L'ouverture est un vrai
 * `<button aria-expanded>` qui commande un panneau — pas un `div` qui
 * écoute un clic.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const TEMPS = [
  {
    cle: "plat",
    rang: "01",
    repere: "Le plat",
    titre: "La question qui revient à chaque service.",
    texte:
      "« Qu’est-ce que vous me conseillez avec ça ? » Dans la plupart des salles, la réponse honnête est une approximation — et une approximation ne vend pas une bouteille.",
    ecran: {
      src: "/demo/plats.webp",
      alt: "Le parcours convive : le choix du plat.",
    },
  },
  {
    cle: "envie",
    rang: "02",
    repere: "L’envie",
    titre: "Deux gestes, et c’est tout.",
    texte:
      "Le client choisit son plat, puis ce dont il a envie. Aucune carte à déchiffrer, aucun vocabulaire à connaître, personne à solliciter.",
    ecran: {
      src: "/demo/couleur.webp",
      alt: "Le parcours convive : le choix de l’envie.",
    },
  },
  {
    cle: "vin",
    rang: "03",
    repere: "Le vin",
    titre: "Le vin de votre carte, et la raison.",
    texte:
      "Pas un catalogue : des propositions prises dans votre cave, expliquées comme le ferait un sommelier. Le client comprend pourquoi — et c’est là qu’il commande.",
    ecran: {
      src: "/demo/resultat.webp",
      alt: "Le parcours convive : la recommandation, et la raison qui l’accompagne.",
    },
  },
] as const;

function Carte({
  temps,
  ouverte,
  ouvrir,
  rang,
  reduit,
}: {
  temps: (typeof TEMPS)[number];
  ouverte: boolean;
  ouvrir: () => void;
  rang: number;
  reduit: boolean;
}) {
  const panneau = useId();

  /*
    LA LEVÉE EST UN ÉTAT DE REACT, pas une pseudo-classe CSS. Deux
    raisons, et la seconde est la vraie.

    D'abord, le survol ET le focus doivent lever la carte : au clavier on
    doit voir ce que la souris voit. Or le focus ne se pose pas sur la
    carte, il se pose sur le bouton qu'elle contient — `onFocus` et
    `onBlur` remontent, eux, ce que `whileFocus` ne saurait pas voir.

    Ensuite, et surtout : le transform de cette carte appartient à
    Motion. Deux écritures concurrentes sur la même propriété — une
    transition CSS et une animation Motion — se battent image par image.
    Une seule main tient le déplacement.
  */
  const [levee, setLevee] = useState(false);
  const relacher = useCallback((e: React.FocusEvent<HTMLElement>) => {
    /* On ne retombe que si le focus quitte vraiment la carte : passer du
       bouton au panneau ne doit pas la faire clignoter. */
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setLevee(false);
    }
  }, []);

  return (
    /*
      L'ENVELOPPE PORTE L'ENTRÉE, LA CARTE PORTE LA LEVÉE. Les deux sont
      des translations verticales ; sur un seul élément, `whileInView`
      masquerait `animate` une fois entré — la carte ne se lèverait plus
      jamais. Séparées, chacune garde son propre transform, et aucune ne
      écrase l'autre.
    */
    <motion.div
      initial={{ opacity: 0, y: reduit ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: reduit ? 0 : 0.7,
        delay: reduit ? 0 : rang * 0.12,
        ease: EASE,
      }}
    >
      <motion.article
        animate={{ y: levee && !reduit ? -3 : 0 }}
        transition={{ duration: reduit ? 0 : 0.24, ease: EASE }}
        onHoverStart={() => setLevee(true)}
        onHoverEnd={() => setLevee(false)}
        onFocus={() => setLevee(true)}
        onBlur={relacher}
        data-ouverte={ouverte ? "true" : "false"}
        className="surface surface-prise flex flex-col overflow-hidden"
      >
        <h3>
          <button
            type="button"
            onClick={ouvrir}
            aria-expanded={ouverte}
            aria-controls={panneau}
            className="flex w-full flex-col items-start gap-y-3 px-6 py-7 text-left outline-offset-2 focus-visible:outline-2 focus-visible:outline-[color:var(--color-accent)] sm:px-7 sm:py-8"
          >
            <span className="flex w-full items-center justify-between gap-4">
              <span className="data text-[0.62rem] tracking-[0.2em] text-[color:var(--color-faible)] uppercase">
                {temps.rang} — {temps.repere}
              </span>
              {/* L'INDICE D'INTERACTION tourne d'un quart de tour : fermé il
                invite à ouvrir, ouvert il invite à refermer. Une rotation
                plutôt qu'un changement de glyphe — l'œil suit le même
                objet. */}
              <motion.span
                aria-hidden
                animate={{ rotate: ouverte ? 45 : 0 }}
                transition={{ duration: reduit ? 0 : 0.3, ease: EASE }}
                className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-touche)] border border-[color:var(--color-filet)] text-[0.9rem] leading-none text-[color:var(--color-texte)]"
              >
                +
              </motion.span>
            </span>
            {/* DEUX LIGNES RÉSERVÉES, mais seulement en rangée. Côte à
              côte, les trois cartes doivent s'aligner par le bas : sans
              cette réserve, une promesse d'une ligne ferait une carte
              plus courte que ses voisines. Empilées — en dessous de
              `lg` —, la réserve n'aurait aucun sens et creuserait un
              blanc sous les titres courts. 2,5 em = deux fois 1,25
              d'interligne, exactement. */}
            <span className="voix text-[1.12rem] leading-[1.25] text-balance text-[color:var(--color-fort)] sm:text-[1.2rem] lg:min-h-[2.5em]">
              {temps.titre}
            </span>
          </button>
        </h3>

        {/*
        LE PANNEAU RESTE DANS LE FLUX, et sa hauteur s'anime. Un panneau
        posé en absolu aurait chevauché la carte suivante sur mobile ;
        une hauteur animée fait grandir la carte, et les voisines se
        replacent d'elles-mêmes. Le défilement ne saute pas, parce que
        l'ouverture vient toujours d'un geste du lecteur.
      */}
        <motion.div
          id={panneau}
          initial={false}
          animate={{ height: ouverte ? "auto" : 0, opacity: ouverte ? 1 : 0 }}
          transition={{ duration: reduit ? 0 : 0.42, ease: EASE }}
          style={{ overflow: "hidden" }}
          aria-hidden={!ouverte}
        >
          <div className="px-6 pb-7 sm:px-7 sm:pb-8">
            <p className="voix max-w-[42ch] text-[0.98rem] leading-[1.5] text-pretty text-[color:var(--color-texte)]">
              {temps.texte}
            </p>
            <div className="objet mt-6 overflow-hidden rounded-[var(--radius-touche)]">
              <Image
                src={temps.ecran.src}
                alt={temps.ecran.alt}
                width={720}
                height={1558}
                sizes="(min-width: 1024px) 360px, 86vw"
                loading="lazy"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </motion.div>
      </motion.article>
    </motion.div>
  );
}

export function Instant() {
  const reduit = useReducedMotion();
  const [ouverte, setOuverte] = useState<string | null>(null);

  return (
    <section
      id="instant"
      className="mouvement grain-clair relative isolate overflow-x-clip"
      style={{ background: ciel("instant") }}
    >
      <div className="px relative z-10 mx-auto w-full max-w-[1420px]">
        <motion.div
          initial={{ opacity: 0, y: reduit ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduit ? 0 : 0.9, ease: EASE }}
          className="max-w-[40ch]"
        >
          <p className="eyebrow text-[color:var(--color-faible)]">
            Le moment du choix
          </p>
          <h2 className="strophe mt-5 text-[clamp(1.9rem,4.2vw,3.2rem)]">
            Trois gestes,
            <br />
            et la table a choisi.
          </h2>
        </motion.div>

        {/*
          AUCUNE CARTE NE S'ÉTIRE À LA HAUTEUR DE SA VOISINE.

          Par défaut, les éléments d'une grille s'étirent à la hauteur de
          leur rangée. Une carte qui s'ouvrait emmenait donc ses deux
          voisines : trois cartes de 130 px devenaient trois cartes de
          994, dont deux vides — 864 px de blanc ajoutés à chacune.

          DEUX CHOSES L'EMPÊCHENT AUJOURD'HUI, et il faut dire laquelle
          agit. L'enveloppe de chaque carte — posée plus haut pour que
          l'entrée et la levée ne se disputent pas le même transform —
          encaisse l'étirement à sa place : c'est elle qui grandit, la
          carte garde sa hauteur, et rien ne se voit. `items-start`, lui,
          ne change aujourd'hui aucun pixel. Il reste parce que la règle
          appartient à la grille, pas à un détail d'implémentation : le
          jour où cette enveloppe disparaîtra, le défaut reviendrait sans
          lui. Le garde-fou mesure les deux, pour la même raison.
        */}
        <div className="mt-14 grid items-start gap-5 lg:grid-cols-3 lg:gap-6">
          {TEMPS.map((t, i) => (
            <Carte
              key={t.cle}
              temps={t}
              rang={i}
              reduit={!!reduit}
              ouverte={ouverte === t.cle}
              ouvrir={() => setOuverte((v) => (v === t.cle ? null : t.cle))}
            />
          ))}
        </div>

        <p className="t-meta mt-12 max-w-[46ch] text-[color:var(--color-faible)]">
          Captures du parcours convive de Vintoria Pro 2.0.2, prises sur
          l’établissement de démonstration.
        </p>
      </div>
    </section>
  );
}
