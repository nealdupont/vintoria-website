"use client";

import { motion, useReducedMotion } from "motion/react";
import { ciel } from "@/lib/lumiere";

/**
 * MOUVEMENT II — LE GESTE.
 *
 * L'objection qu'il tue : « ça va me prendre des semaines à paramétrer ».
 * C'est la première qui vient à un restaurateur devant un logiciel.
 *
 * CE QUI A CHANGÉ, ET POURQUOI.
 * La version précédente alignait les trois entrées au même poids, à côté
 * d'une capture de 880 px. Deux défauts : on lisait une LISTE DE
 * FONCTIONNALITÉS — « voici trois choses que le produit sait faire » — et le
 * visiteur devait arbitrer entre trois options équivalentes. Or il n'a pas à
 * choisir : il a déjà sa carte sous une forme précise, et c'est Vintoria qui
 * s'y adapte.
 *
 * D'où la hiérarchie : 01 domine, 02 et 03 sont des recours. L'import d'une
 * carte est le seul des trois qui traite TOUT d'un coup — c'est donc le
 * chemin recommandé, et le dire est plus honnête que de les présenter à
 * égalité.
 *
 * ET LA CAPTURE EST PARTIE. Une page éditoriale ne porte pas une dalle de
 * capture d'écran ; la preuve arrive juste après, et les mouvements III à VI
 * en sont pleins. Ce mouvement-ci n'a pas à prouver, il a à inviter.
 *
 * LE BALAYAGE N'EST PAS PERDU : son principe — la lumière qui DESSINE au
 * lieu d'éclairer — passe sur le filet du choix principal, qui se trace de
 * gauche à droite. Plus discret, et toujours le même geste.
 *
 * RIEN N'EST CLIQUABLE ICI, et c'est délibéré. Cette section décrit ce que
 * le produit sait faire ; elle ne le fait pas. Une flèche, un survol ou un
 * état pressé sur du texte inerte seraient une promesse d'interaction que
 * rien ne tient. Le seul appel à l'action de la page est en VIII.
 *
 * L'ACCENT N'APPARAÎT QUE DEUX FOIS sur tout l'écran : l'italique du titre,
 * et le numéro 01. Employé partout il ne signalerait plus rien.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Les trois manières, dans l'ordre de ce qu'elles couvrent. Les libellés
 * sont ceux de l'écran réel du produit — je ne les réécris pas.
 *
 * LEURS TROIS DESCRIPTIONS FORMENT UNE ÉCHELLE, et c'est elle qui porte la
 * hiérarchie dans les mots comme la place verticale la porte dans l'espace :
 *
 *   01  « Pas une ligne à saisir. »   — rien
 *   02  « Un vin par ligne. »         — une ligne par vin
 *   03  « Bouteille par bouteille. »  — une opération par bouteille
 *
 * La première version disait « Toute votre carte en une fois. » : un écho
 * mot pour mot du titre, dont le lecteur n'apprenait rien. « Tous les vins
 * d'un coup » aurait répété la même chose autrement — « d'un coup » et « en
 * une fois » disent le même fait. Ce qui manquait, c'était l'EFFORT : ce que
 * chaque manière demande au restaurateur. C'est la seule information que le
 * titre ne donne pas, et c'est celle qui fait choisir.
 */
const PRINCIPALE = {
  rang: "01",
  quoi: "Importer une carte des vins",
  support: "PDF · Photo",
  dit: "Pas une ligne à saisir.",
};

const RECOURS = [
  { rang: "02", quoi: "Coller une liste", dit: "Un vin par ligne." },
  {
    rang: "03",
    quoi: "Photographier une étiquette",
    dit: "Bouteille par bouteille.",
  },
] as const;

export function Geste() {
  const reduit = useReducedMotion();

  const pas = (delai: number, duree = 0.95) => ({
    duration: reduit ? 0 : duree,
    delay: reduit ? 0 : delai,
    ease: EASE,
  });
  const monte = (y = 14) => ({ opacity: 0, y: reduit ? 0 : y });
  const pose = { opacity: 1, y: 0 };

  return (
    <section
      id="geste"
      className="grain-clair relative isolate overflow-x-clip pt-28 pb-36 sm:pt-36 sm:pb-44"
      style={{ background: ciel("geste") }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="voile-sauge top-[34%] left-[-16%] h-[46%] w-[50%] opacity-70" />
        <div className="jet top-[-16%] left-[74%] h-[60%] opacity-60" />
      </div>

      <motion.div
        className="px relative z-10 mx-auto w-full max-w-[1420px]"
        initial="repos"
        whileInView="pose"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* ══ 1 · LE PROPOS ════════════════════════════════════════
            Asymétrie : le titre tient la gauche, la promesse se décale
            vers la droite. Deux blocs qui ne s'alignent pas créent plus
            de rythme qu'un empilement centré. */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-14">
          <div className="lg:col-span-7">
            <motion.p
              className="eyebrow text-[color:var(--color-faible)]"
              variants={{ repos: { opacity: 0 }, pose: { opacity: 1 } }}
              transition={pas(0, 0.8)}
            >
              Pour commencer
            </motion.p>

            <h2 className="strophe mt-6 text-[clamp(2.2rem,5.4vw,4.2rem)]">
              <motion.span
                className="block"
                variants={{ repos: monte(16), pose }}
                transition={pas(0.12, 1.05)}
              >
                Votre carte,
              </motion.span>
              <motion.span
                className="block"
                variants={{ repos: monte(16), pose }}
                transition={pas(0.26, 1.05)}
              >
                <em>en une fois.</em>
              </motion.span>
            </h2>
          </div>

          <motion.p
            className="t-chapeau mt-10 max-w-[30ch] text-pretty text-[color:var(--color-texte)] lg:col-span-4 lg:col-start-8 lg:mt-0 lg:self-center lg:pt-6"
            variants={{ repos: monte(12), pose }}
            transition={pas(0.46, 1)}
          >
            Vous donnez à Vintoria ce que vous avez déjà.
            <br />
            Elle s’occupe du reste.
          </motion.p>
        </div>

        {/* ══ 2 · LES TROIS MANIÈRES ═══════════════════════════════
            Pas une liste : une hiérarchie. 01 reçoit deux fois et demie
            la place verticale des deux autres, et c'est cette place —
            pas un encadré, pas une ombre — qui dit qu'il est recommandé. */}
        {/* Les trois manières vivent dans la MÊME colonne que le titre :
            le filet borde ce qu'il sépare, au lieu de traverser la page. */}
        <div className="mt-24 sm:mt-32 lg:mt-28 lg:w-[58.5%]">
          {/* Le filet du choix principal SE TRACE, de gauche à droite.
              C'est le balayage du mouvement précédent, ramené à un trait. */}
          <motion.div
            className="h-px origin-left bg-[color:var(--color-filet-fort)]"
            variants={{
              repos: { scaleX: reduit ? 1 : 0 },
              pose: { scaleX: 1 },
            }}
            transition={pas(0.86, 1.3)}
          />

          <motion.div
            className="grid grid-cols-[2.25rem_1fr] gap-x-5 pt-9 pb-14 sm:grid-cols-[5rem_1fr] sm:gap-x-8 sm:pt-12 sm:pb-20 lg:grid-cols-[7rem_1fr]"
            variants={{ repos: monte(16), pose }}
            transition={pas(0.68, 1.05)}
          >
            <p className="data pt-1.5 text-[0.78rem] tracking-[0.16em] text-[color:var(--color-accent)] tabular-nums">
              {PRINCIPALE.rang}
            </p>
            <div>
              <h3 className="voix max-w-[15ch] text-[clamp(1.35rem,3.1vw,2.4rem)] leading-[1.14] sm:max-w-none text-[color:var(--color-fort)]">
                {PRINCIPALE.quoi}
              </h3>
              <p className="data mt-3 text-[0.72rem] tracking-[0.18em] text-[color:var(--color-faible)] uppercase">
                {PRINCIPALE.support}
              </p>
              <p className="t-chapeau mt-6 max-w-[28ch] text-[color:var(--color-texte)]">
                {PRINCIPALE.dit}
              </p>
            </div>
          </motion.div>

          {/* Les recours. Compacts, scannables, une ligne chacun. */}
          {RECOURS.map((r, i) => (
            <motion.div
              key={r.rang}
              className="grid grid-cols-[2.25rem_1fr] items-baseline gap-x-5 border-t border-[color:var(--color-filet)] py-6 sm:grid-cols-[5rem_1fr] sm:gap-x-8 sm:py-7 lg:grid-cols-[7rem_1fr]"
              variants={{ repos: monte(12), pose }}
              transition={pas(1 + i * 0.12, 0.9)}
            >
              <p className="data text-[0.78rem] tracking-[0.16em] text-[color:var(--color-faible)] tabular-nums">
                {r.rang}
              </p>
              <div className="flex flex-col gap-y-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-8">
                <h3 className="voix text-[clamp(1.1rem,1.9vw,1.4rem)] text-[color:var(--color-fort)]">
                  {r.quoi}
                </h3>
                <p className="t-meta shrink-0 text-[color:var(--color-faible)]">
                  {r.dit}
                </p>
              </div>
            </motion.div>
          ))}

          <motion.div
            className="h-px bg-[color:var(--color-filet)]"
            variants={{ repos: { opacity: 0 }, pose: { opacity: 1 } }}
            transition={pas(1.3, 0.8)}
          />
        </div>
      </motion.div>
    </section>
  );
}
