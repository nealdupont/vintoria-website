"use client";

import Image from "next/image";
import { useRef } from "react";
import { ciel } from "@/lib/lumiere";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

/**
 * MOUVEMENT II — L'INSTANT.
 *
 * Le problème, JOUÉ et non plaidé. Pas de grille de trois douleurs : une
 * scène. Le moment exact où un restaurant perd une vente, c'est quand on lui
 * demande « qu'est-ce que vous me conseillez avec ça ? ».
 *
 * CE QUI EST EXPLOITÉ ICI. Trois des captures disponibles — plats, couleur,
 * résultat — ne sont pas trois images : ce sont TROIS TEMPS D'UN MÊME GESTE,
 * pris sur le vrai parcours convive. La version précédente les affichait côte
 * à côte, ce qui détruisait l'information. Ici l'écran AVANCE au défilement :
 * le produit se démontre lui-même, sans film, sans lecture automatique.
 *
 * CE N'EST PAS DU SCROLL-JACKING. Le défilement reste entièrement natif :
 * le lecteur garde son rythme, l'interface suit. Rien n'est capturé, rien
 * n'est ralenti, et la page se parcourt au clavier comme au doigt.
 *
 * COÛT. Aucun rendu React pendant le défilement : les trois opacités et les
 * trois repères sont des `MotionValue` branchés en style, donc interpolés
 * hors du cycle de rendu. Les écrans convives sont SOMBRES — le parcours
 * client se vit le soir, à table — ce qui justifie la lumière basse et
 * ambrée de ce mouvement.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const TEMPS = [
  {
    cle: "plat",
    repere: "le plat",
    titre: "« Qu’est-ce que vous me conseillez avec ça ? »",
    texte:
      "La question arrive à chaque service. Dans la plupart des salles, la réponse honnête est une approximation — et une approximation ne vend pas une bouteille.",
  },
  {
    cle: "envie",
    repere: "l’envie",
    titre: "Deux gestes, et c’est tout.",
    texte:
      "Le client choisit son plat, puis ce dont il a envie. Aucune carte à déchiffrer, aucun vocabulaire à connaître, personne à solliciter.",
  },
  {
    cle: "vin",
    repere: "le vin",
    titre: "Le vin de votre carte, et la raison.",
    texte:
      "Pas un catalogue : des propositions prises dans votre cave, expliquées comme le ferait un sommelier. Le client comprend pourquoi — et c’est là qu’il commande.",
  },
] as const;

const ECRANS = [
  { src: "/demo/plats.webp", alt: "Le parcours convive : le choix du plat." },
  {
    src: "/demo/couleur.webp",
    alt: "Le parcours convive : le choix de l’envie.",
  },
  {
    src: "/demo/resultat.webp",
    alt: "Le parcours convive : la recommandation, et la raison qui l’accompagne.",
  },
] as const;

export function Instant() {
  const racine = useRef<HTMLDivElement>(null);
  const reduit = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: racine,
    offset: ["start start", "end end"],
  });

  /* DEUX SEUILS, DEUX POUSSÉES.
     L'écran entrant vient de la droite et chasse le sortant vers la gauche.
     C'est une navigation, et c'est la transition qu'emploie le produit
     lui-même entre ses étapes : le geste se lit, là où un fondu aurait
     seulement signalé qu'il s'était passé quelque chose.
     (L'étape grisée en haut de « Votre préférence » n'est pas un reste de
     la transition : c'est l'interface réelle, qui garde l'étape accomplie
     sous les yeux du client.) */
  const A = [0.28, 0.37] as const; // le plat → l'envie
  const B = [0.62, 0.71] as const; // l'envie → le vin

  const x1 = useTransform(scrollYProgress, [A[0], A[1]], ["0%", "-26%"]);
  const x2 = useTransform(
    scrollYProgress,
    [A[0], A[1], B[0], B[1]],
    ["100%", "0%", "0%", "-26%"],
  );
  const x3 = useTransform(scrollYProgress, [B[0], B[1]], ["100%", "0%"]);
  const abscisses = [x1, x2, x3];

  /* Le sortant s'efface en partant : sans cela deux interfaces très
     contrastées se chevauchent franchement pendant la poussée. */
  const o1 = useTransform(scrollYProgress, [A[0], A[1]], [1, 0.2]);
  const o2 = useTransform(
    scrollYProgress,
    [A[0], A[1], B[0], B[1]],
    [1, 1, 1, 0.2],
  );
  const o3 = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const opacites = [o1, o2, o3];

  /* Les repères s'allument sur les mêmes seuils. */
  const r1 = useTransform(scrollYProgress, [A[0], A[1]], [1, 0.3]);
  const r2 = useTransform(
    scrollYProgress,
    [A[0], A[1], B[0], B[1]],
    [0.3, 1, 1, 0.3],
  );
  const r3 = useTransform(scrollYProgress, [B[0], B[1]], [0.3, 1]);
  const reperes = [r1, r2, r3];

  return (
    <section
      id="instant"
      /*
        `overflow-x-clip` ET NON `overflow-hidden` : `hidden` ferait de
        cette section le plus proche ancêtre défilant, ce qui DÉSACTIVE
        `position: sticky` à l'intérieur — l'écran décrochait au deuxième
        temps. `clip` rogne sans créer de conteneur de défilement.
      */
      className="grain-clair relative isolate overflow-x-clip"
    >
      {/* ── LA SCÈNE — la lumière a baissé et s'est réchauffée ──── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: ciel("instant"),
          }}
        />
      </div>

      <div
        ref={racine}
        className="px relative z-10 mx-auto w-full max-w-[1420px]"
      >
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* ── L'ÉCRAN, TENU DANS LA LUMIÈRE ─────────────────────
              Premier dans le DOM pour qu'il colle en haut du petit
              écran ; replacé à droite sur grand écran par la grille.
              Les repères vivent SOUS l'écran et non dans la colonne
              de texte : ils nomment ce qu'on est en train de voir,
              ils doivent donc rester à côté. */}
          <div className="sticky top-[4.5rem] z-10 lg:static lg:col-span-5 lg:col-start-8 lg:row-start-1">
            {/* Le voile du petit écran : le texte défile DESSOUS, il
                faut qu'il s'efface sans couper net. Flou plutôt
                qu'aplat — l'écran est TENU DEVANT la scène. */}
            <div
              aria-hidden
              className="absolute inset-x-[-1.5rem] -top-6 bottom-0 bg-[#f4efe4]/72 backdrop-blur-lg [mask-image:linear-gradient(to_bottom,black_74%,transparent)] sm:inset-x-[-2rem] lg:hidden"
            />

            <div className="relative flex flex-col items-center pt-5 pb-6 lg:sticky lg:top-0 lg:h-screen lg:justify-center lg:pt-0 lg:pb-0">
              <div className="relative aspect-[720/1558] h-[38vh] w-auto lg:h-[62vh]">
                {/* Le jet est DERRIÈRE l'écran et voyage avec lui : le
                    téléphone est tenu dans la lumière, il n'est pas posé
                    sur un fond qui brille. Il vit HORS du cadre, car le
                    cadre rogne — et une lumière rognée n'en est plus une. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-[22%] left-1/2 h-[118%] w-[230%] -translate-x-1/2"
                >
                  <div className="jet left-1/2 h-full opacity-60" />
                  <div className="jet-vin top-[34%] left-1/2 h-[58%] opacity-55" />
                </div>

                {/* L'appareil : c'est LUI qui rogne, comme une dalle. */}
                <div className="objet objet-leve absolute inset-0 overflow-hidden rounded-[22px]">
                  {ECRANS.map((e, i) => (
                    <motion.div
                      key={e.src}
                      className="absolute inset-0"
                      style={
                        reduit
                          ? { opacity: i === 2 ? 1 : 0 }
                          : { x: abscisses[i], opacity: opacites[i] }
                      }
                    >
                      <Image
                        src={e.src}
                        alt={e.alt}
                        width={720}
                        height={1558}
                        sizes="(min-width: 1024px) 300px, 40vh"
                        className="block h-full w-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Les repères. C'est l'un des rares endroits où une
                  numérotation serait justifiée — l'ordre porte vraiment
                  l'information. Les mots la portent mieux. */}
              <div className="mt-6 flex items-center gap-4 lg:mt-8 lg:gap-5">
                {TEMPS.map((t, i) => (
                  <motion.span
                    key={t.cle}
                    className="data text-[0.68rem] whitespace-nowrap text-[color:var(--color-accent)] uppercase tracking-[0.18em]"
                    style={{ opacity: reduit ? 1 : reperes[i] }}
                  >
                    {t.repere}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* ── LES TROIS TEMPS ──────────────────────────────────── */}
          <div className="lg:col-span-6 lg:col-start-1 lg:row-start-1">
            {TEMPS.map((t) => (
              <motion.div
                key={t.cle}
                className="flex min-h-[62vh] flex-col justify-center lg:min-h-screen"
                initial={{ opacity: 0, y: reduit ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: reduit ? 0 : 0.9, ease: EASE }}
              >
                <h2 className="strophe max-w-[24ch] text-[clamp(1.6rem,3.4vw,2.9rem)]">
                  {t.titre}
                </h2>
                <p className="t-chapeau mt-6 max-w-[44ch] text-pretty text-[color:var(--color-texte)]">
                  {t.texte}
                </p>
              </motion.div>
            ))}

            <p className="t-meta max-w-[46ch] border-t border-[color:var(--color-filet)] pt-6 pb-24 text-[color:var(--color-faible)]">
              Captures du parcours convive de Vintoria Pro 2.0.2, prises sur
              l’établissement de démonstration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
