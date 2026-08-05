"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";

/**
 * L’instrument — le geste signature de Vintoria.
 *
 * Conviction : « Servir, c’est transmettre. »
 * Conséquence directe sur ce composant : AUCUN score visible. Un chiffre est
 * un verdict qui retient le savoir ; une phrase le rend. Le moteur classe en
 * interne, mais ce qui va à la table, ce sont des mots.
 *
 * La hiérarchie passe donc par la composition : le premier vin reçoit
 * l’espace, la taille et la parole. Les suivants nuancent. Le reste de la
 * carte s’efface — sans disparaître, car la carte entière travaille.
 *
 * Le geste se joue une fois seul, pour être compris sans clic.
 *
 * COUTURE : `accords` est la seule donnée à remplacer par le moteur réel.
 */

type Plat = { id: string; nom: string };
type Vin = { id: string; nom: string; region: string; millesime: string };

const PLATS: Plat[] = [
  { id: "boeuf", nom: "Bœuf braisé au vin rouge" },
  { id: "turbot", nom: "Turbot rôti, beurre blanc" },
  { id: "comte", nom: "Comté affiné 24 mois" },
];

const CARTE: Vin[] = [
  { id: "cdp", nom: "Châteauneuf-du-Pape", region: "Rhône", millesime: "2019" },
  { id: "barolo", nom: "Barolo", region: "Piémont", millesime: "2017" },
  { id: "meursault", nom: "Meursault", region: "Bourgogne", millesime: "2020" },
  { id: "chablis", nom: "Chablis 1ᵉʳ Cru", region: "Bourgogne", millesime: "2020" },
  { id: "vinjaune", nom: "Vin Jaune", region: "Jura", millesime: "2015" },
  { id: "chinon", nom: "Chinon", region: "Loire", millesime: "2021" },
];

/** Trois vins retenus, dans l’ordre, et les mots qui vont avec. */
const accords: Record<string, { ordre: string[]; mots: Record<string, string> }> = {
  boeuf: {
    ordre: ["cdp", "barolo", "chinon"],
    mots: {
      cdp: "Les tanins fermes et les fruits noirs épousent le gras du braisé. La garrigue prolonge la sauce jusqu’à la dernière bouchée.",
      barolo: "Plus austère, plus long. Pour une table qui prend son temps.",
      chinon: "Si l’on veut alléger : même registre, moins de puissance.",
    },
  },
  turbot: {
    ordre: ["meursault", "chablis", "vinjaune"],
    mots: {
      meursault:
        "La rondeur beurrée du chardonnay répond au beurre blanc. La minéralité relève la chair iodée sans jamais la couvrir.",
      chablis: "Plus tendu, plus droit. Il allège la sauce au lieu de l’accompagner.",
      vinjaune: "Pour un client curieux : l’accord inattendu de la soirée.",
    },
  },
  comte: {
    ordre: ["vinjaune", "chablis", "meursault"],
    mots: {
      vinjaune:
        "Noix et curry font écho à l’affinage long. Même terroir, même caractère : l’accord de la maison.",
      chablis: "La fraîcheur tranche le gras du fromage. Un contraste, pas un écho.",
      meursault: "Le choix consensuel, si la table hésite.",
    },
  },
};

export function Lecture({
  onRobe,
}: {
  /** Remonte l'identifiant du vin retenu : la salle s'accorde à sa robe. */
  onRobe?: (vinId: string | null) => void;
}) {
  const reduce = useReducedMotion();
  const racine = useRef<HTMLDivElement>(null);
  // Le geste ne se joue qu'une fois la démonstration atteinte — sinon il
  // se jouerait sans témoin, avant même qu'on ait fait défiler.
  const vu = useInView(racine, { once: true, amount: 0.35 });
  const [platId, setPlatId] = useState<string | null>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    if (!vu) return;
    const a = setTimeout(() => setPlatId("boeuf"), reduce ? 0 : 700);
    const b = setTimeout(() => setLit(true), reduce ? 0 : 1150);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [vu, reduce]);

  function lire(id: string) {
    if (id === platId) return;
    setLit(false);
    setPlatId(id);
    if (reduce) {
      setLit(true);
      return;
    }
    setTimeout(() => setLit(true), 420);
  }

  // La robe est portée par le vin retenu, et seulement une fois la lecture faite.
  const vinRetenu = lit && platId ? accords[platId].ordre[0] : null;
  useEffect(() => {
    onRobe?.(vinRetenu);
  }, [vinRetenu, onRobe]);

  const accord = platId ? accords[platId] : null;
  const rang = accord
    ? [
        ...accord.ordre.map((id) => CARTE.find((v) => v.id === id)!),
        ...CARTE.filter((v) => !accord.ordre.includes(v.id)),
      ]
    : CARTE;

  return (
    <div ref={racine} className="w-full">
      <span className="eyebrow">Ce soir, on sert</span>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {PLATS.map((p) => {
          const actif = p.id === platId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => lire(p.id)}
              aria-pressed={actif}
              className={`inline-flex min-h-[2.75rem] items-center rounded-full border px-4 text-[0.875rem] transition-[color,background-color,border-color] duration-300 ${
                actif
                  ? "border-tungstene/55 bg-tungstene/[0.09] text-os"
                  : "border-[color:var(--color-filet)] text-cendre hover:border-[color:var(--color-filet-fort)] hover:bg-white/[0.03] hover:text-os"
              }`}
            >
              {p.nom}
            </button>
          );
        })}
      </div>

      <div className="mt-9 border-t border-[color:var(--color-filet)] pt-1">
        <div className="flex items-baseline justify-between py-3.5">
          <span className="eyebrow">Votre carte</span>
          <span className="eyebrow">
            <AnimatePresence mode="wait">
              <motion.span
                key={lit ? "dit" : "cherche"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className={lit ? "robe-teinte" : "text-cendre"}
              >
                {platId === null
                  ? "en attente"
                  : lit
                    ? "ce que je servirais"
                    : "je regarde…"}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>

        <LayoutGroup>
          <ul className="border-t border-[color:var(--color-filet)]">
            {rang.map((v, i) => {
              const retenu = lit && accord ? accord.ordre.includes(v.id) : false;
              const premier = lit && i === 0;
              const mot = retenu && accord ? accord.mots[v.id] : null;
              return (
                <motion.li
                  key={v.id}
                  layout
                  transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-[color:var(--color-filet)]"
                >
                  <motion.div
                    animate={{ opacity: !lit || retenu ? 1 : 0.38 }}
                    transition={{ duration: 0.6 }}
                    className={premier ? "py-5" : "py-3.5"}
                  >
                    <div className="flex items-baseline gap-3">
                      <motion.span
                        aria-hidden
                        animate={{ opacity: premier ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                        className="robe-pastille h-1.5 w-1.5 shrink-0 rounded-full"
                      />
                      <span
                        className={`voix truncate transition-colors duration-500 ${
                          premier
                            ? "text-[1.3rem] text-os"
                            : retenu
                              ? "text-[1.0625rem] text-os"
                              : "text-[1.0625rem] text-cendre"
                        }`}
                      >
                        {v.nom}
                      </span>
                      <span className="data hidden shrink-0 text-[0.75rem] text-cendre-2 sm:inline">
                        {v.region} · {v.millesime}
                      </span>
                    </div>

                    <AnimatePresence>
                      {mot && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className={`overflow-hidden pl-[1.125rem] ${
                            premier
                              ? "text-[0.975rem] leading-[1.6] text-cendre"
                              : "text-[0.9rem] leading-[1.55] text-cendre-2"
                          }`}
                        >
                          <span className={premier ? "block pt-2.5" : "block pt-1.5"}>
                            {mot}
                          </span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.li>
              );
            })}
          </ul>
        </LayoutGroup>
      </div>
    </div>
  );
}
