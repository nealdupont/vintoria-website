"use client";

import {
  Fragment,
  useCallback,
  useId,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ciel } from "@/lib/lumiere";
import {
  FORMULES,
  ORDRE,
  absentDe,
  ajoutsSur,
  comprisDans,
  type CleFormule,
  type Formule,
  type Trait,
} from "@/lib/formules";
import { Prix } from "@/components/Prix";

/**
 * MOUVEMENT VIII — LES FORMULES.
 *
 * ── CE QU'ELLE FAIT, ET POURQUOI ICI ───────────────────────────────────
 *
 * L'accueil racontait le produit sans jamais dire ce qu'il coûte. Le
 * lecteur convaincu devait quitter la page pour /tarifs, et un lecteur
 * qu'on fait sortir d'une page pour répondre à « combien ? » ne revient
 * pas toujours.
 *
 * ELLE S'INSÈRE ENTRE LA RESPIRATION ET L'HEURE DORÉE. Pour qui → les
 * formules → l'invitation : on se reconnaît, on regarde ce que ça
 * demande, on demande une démonstration. Inverser les deux derniers
 * reviendrait à faire signer avant d'avoir montré le prix.
 *
 * ── CE QUI EST ÉCRIT ICI, ET CE QUI NE L'EST PAS ───────────────────────
 *
 * RIEN DANS CETTE SECTION N'EST SAISI À LA MAIN. Les noms, les publics,
 * les promesses viennent de `lib/formules.ts` ; ce que chaque formule
 * comprend, ce qu'elle ne comprend pas et ce qu'elle ajoute à la
 * précédente sont DÉDUITS de `CHAPITRES`, qui vient du catalogue du
 * produit. Une fonctionnalité retirée de l'application disparaît des
 * cartes sans que personne y pense.
 *
 * CETTE SECTION NE SAIT RIEN DU PRIX, et c'est voulu. Elle appelle le
 * composant `<Prix>`, qui interroge `lib/tarifs.ts` — seul endroit du
 * dépôt où vivent les montants, les périodicités et les identifiants
 * Stripe. Tant que la configuration n'est pas complète ET signée, elle
 * répond « Sur demande ». La périodicité n'apparaîtra qu'avec le prix :
 * un « par mois » affiché sous un « sur demande » ne dit rien et engage
 * quand même.
 *
 * ── LA COMPOSITION ─────────────────────────────────────────────────────
 *
 * UN SEUL PANNEAU POUR LES TROIS CARTES, et c'est ce qui règle le
 * problème que la section « Instant » avait laissé ouvert : quand une
 * carte s'ouvre AU MILIEU d'une rangée, les deux voisines restent courtes
 * et la composition se creuse d'un grand blanc. Ici, les trois cartes
 * gardent leur hauteur et le détail s'ouvre SOUS la rangée, sur toute sa
 * largeur — ce qui lui donne au passage la place d'être lisible.
 *
 * Sur mobile, il n'y a pas de rangée : le panneau se replace juste sous
 * la carte qu'on vient d'ouvrir, par `order`, pour qu'on n'ait pas à
 * chercher où la réponse est apparue.
 *
 * UNE SEULE CARTE OUVERTE À LA FOIS. Trois détails dépliés en même temps
 * redonneraient le catalogue que la section remplace.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * SOMMES-NOUS EN RANGÉE ?
 *
 * PREMIÈRE VERSION, ÉCARTÉE : la propriété CSS `order` replaçait le
 * panneau sous la carte ouverte en colonne, et en dernier en rangée. Elle
 * marchait à l'œil et mentait au clavier — `order` déplace ce qu'on voit,
 * jamais l'ordre de tabulation. Sur mobile, le lecteur voyait le détail
 * sous la carte qu'il venait d'ouvrir, et la tabulation suivante
 * l'emmenait à la carte d'après, en sautant par-dessus.
 *
 * LE PANNEAU EST DONC DÉPLACÉ DANS LE DOM, PAS EN CSS. L'ordre vu et
 * l'ordre parcouru sont alors le même, aux deux largeurs. Le serveur rend
 * la composition en rangée — c'est la plus large, et celle qui ne dépend
 * d'aucune mesure ; le client corrige à l'instant du montage si la fenêtre
 * est étroite, sans décalage visible puisque rien n'est ouvert à ce
 * moment-là.
 */
const RANGEE = "(min-width: 1024px)";
function useRangee() {
  return useSyncExternalStore(
    (prevenir) => {
      const m = window.matchMedia(RANGEE);
      m.addEventListener("change", prevenir);
      return () => m.removeEventListener("change", prevenir);
    },
    () => window.matchMedia(RANGEE).matches,
    () => true,
  );
}

/** Une liste de traits, groupée par chapitre. */
function Liste({
  traits,
  sobre,
  deuxColonnes,
}: {
  traits: Trait[];
  sobre?: boolean;
  deuxColonnes?: boolean;
}) {
  const chapitres = [...new Set(traits.map((t) => t.chapitre))];
  return (
    /*
      LA LISTE DES INCLUSIONS COULE SUR DEUX COLONNES AU-DELÀ DE `lg`.
      Vingt et une lignes empilées faisaient neuf cents pixels de haut, et
      la colonne des exclusions — quatre lignes — laissait à côté un vide
      de la même hauteur. En deux colonnes, les deux listes se répondent.
      `break-inside: avoid` garde chaque chapitre d'un seul tenant : un
      chapitre coupé en deux ne se lirait plus comme un chapitre.
    */
    <div
      className={
        deuxColonnes
          ? "flex flex-col gap-6 lg:block lg:columns-2 lg:gap-x-10"
          : "flex flex-col gap-6"
      }
    >
      {chapitres.map((ch) => (
        <div
          key={ch}
          className={deuxColonnes ? "break-inside-avoid lg:mb-7" : undefined}
        >
          <p className="data text-[0.62rem] tracking-[0.18em] text-[color:var(--color-faible)] uppercase">
            {ch}
          </p>
          <ul className="mt-3 flex flex-col">
            {traits
              .filter((t) => t.chapitre === ch)
              .map((t) => (
                <li
                  key={t.intitule}
                  className="flex items-baseline justify-between gap-5 border-t border-[color:var(--color-filet)] py-2"
                >
                  <span
                    className={`t-meta ${sobre ? "text-[color:var(--color-faible)] line-through decoration-[color:var(--color-filet-fort)]" : "text-[color:var(--color-texte)]"}`}
                  >
                    {t.intitule}
                  </span>
                  {/* « Compris » ne s'écrit pas : la ligne y est, donc
                      c'est compris. Seule une QUANTITÉ mérite d'être dite. */}
                  {t.valeur !== "Compris" && t.valeur !== "—" ? (
                    <span className="data shrink-0 text-[0.7rem] tracking-[0.08em] text-[color:var(--color-fort)] tabular-nums">
                      {t.valeur}
                    </span>
                  ) : null}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * LE DÉTAIL D'UNE FORMULE — ce qu'elle vise, ce qu'elle ajoute, ce qu'elle
 * comprend et ce qu'elle ne comprend pas. Aucune de ces quatre listes
 * n'est écrite ici : toutes viennent de `lib/formules.ts`.
 */
function Detail({
  vue,
  compris,
  absent,
  ajouts,
}: {
  vue: Formule;
  compris: Trait[];
  absent: Trait[];
  ajouts: Trait[];
}) {
  return (
    <div className="surface mt-1 p-6 sm:p-8 lg:mt-2">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        {/* ── CE QU'ELLE VISE, ET CE QU'ELLE AJOUTE ── */}
        <div className="lg:col-span-4">
          <p className="data text-[0.62rem] tracking-[0.18em] text-[color:var(--color-faible)] uppercase">
            Pour qui
          </p>
          <p className="voix mt-3 text-[1.08rem] leading-[1.35] text-pretty text-[color:var(--color-fort)]">
            {vue.pourQui}
          </p>

          {ajouts.length ? (
            <div className="mt-8">
              <p className="data text-[0.62rem] tracking-[0.18em] text-[color:var(--color-accent)] uppercase">
                Ce qu’elle ajoute à la formule précédente
              </p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {ajouts.map((t) => (
                  <li
                    key={t.intitule}
                    className="t-meta flex items-baseline gap-2.5 text-[color:var(--color-texte)]"
                  >
                    <span
                      aria-hidden
                      className="text-[color:var(--color-accent)]"
                    >
                      +
                    </span>
                    <span>
                      {t.intitule}
                      {t.valeur !== "Compris" ? (
                        <span className="data ml-2 text-[0.7rem] text-[color:var(--color-fort)]">
                          {t.valeur}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="t-meta mt-8 max-w-[36ch] text-[color:var(--color-faible)]">
              C’est la formule de départ : tout ce que les deux autres
              comprennent commence ici.
            </p>
          )}

          {/* EN COLONNE, ET PAS EN RANGÉE : cette colonne fait quatre
              douzièmes de la largeur du panneau, et le bouton plus le lien
              n'y tenaient pas — le lien débordait sur la liste voisine. */}
          <div className="mt-9 flex flex-col items-start gap-5">
            <Link href="/demonstration" className="bouton bouton-second">
              Demander une démonstration
            </Link>
            <Link href="/tarifs" className="lien-vif">
              <span className="text-[0.78rem] tracking-[0.1em] uppercase">
                Comparer les trois
              </span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* ── CE QU'ELLE COMPREND ── */}
        <div className="mt-10 lg:col-span-6 lg:mt-0">
          <p className="data text-[0.62rem] tracking-[0.18em] text-[color:var(--color-fort)] uppercase">
            Ce qui est compris
          </p>
          <div className="mt-5">
            <Liste traits={compris} deuxColonnes />
          </div>
        </div>

        {/* ── ET CE QU'ELLE NE COMPREND PAS ── */}
        <div className="mt-10 lg:col-span-2 lg:mt-0">
          <p className="data text-[0.62rem] tracking-[0.18em] text-[color:var(--color-faible)] uppercase">
            Ce qui n’est pas compris
          </p>
          {absent.length ? (
            <div className="mt-5">
              <Liste traits={absent} sobre />
            </div>
          ) : (
            <p className="t-meta mt-5 max-w-[30ch] text-[color:var(--color-texte)]">
              Rien : cette formule comprend tout ce que Vintoria sait faire
              aujourd’hui.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Carte({
  formule,
  rang,
  ouverte,
  ouvrir,
  panneau,
  titreId,
  reduit,
}: {
  formule: Formule;
  rang: number;
  ouverte: boolean;
  ouvrir: () => void;
  panneau: string;
  titreId: string;
  reduit: boolean;
}) {
  /* La levée appartient à Motion, comme sur « Instant » : une transition
     CSS sur `transform` serait écrasée par le style en ligne de Motion. */
  const [levee, setLevee] = useState(false);
  const relacher = useCallback((e: React.FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setLevee(false);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: reduit ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: reduit ? 0 : 0.7,
        delay: reduit ? 0 : rang * 0.1,
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
        data-formule={formule.cle}
        data-ouverte={ouverte ? "true" : "false"}
        /* La carte conseillée garde sa lumière allumée en permanence :
           c'est exactement ce que `data-jour` est fait pour dire. */
        data-jour={formule.recommandee ? "true" : undefined}
        className="surface surface-prise flex h-full flex-col overflow-hidden"
      >
        <h3 id={titreId}>
          <button
            type="button"
            onClick={ouvrir}
            aria-expanded={ouverte}
            aria-controls={panneau}
            className="flex w-full flex-col items-start gap-y-5 px-6 pt-7 pb-6 text-left outline-offset-2 focus-visible:outline-2 focus-visible:outline-[color:var(--color-accent)] sm:px-7 sm:pt-8"
          >
            <span className="flex w-full items-start justify-between gap-4">
              {/*
                LA LIGNE DE L'ÉTIQUETTE EST RÉSERVÉE SUR LES TROIS CARTES,
                même sur celles qui n'en portent pas. Sans cette réserve,
                « Conseillée » poussait le prix de la carte du milieu vingt
                pixels plus bas que les deux autres : on demandait au
                lecteur de comparer trois montants qui n'étaient pas sur la
                même ligne. 2,9 rem = le nom, son interligne, et la place
                de l'étiquette.
              */}
              <span className="block min-h-[2.9rem]">
                <span className="voix block text-[1.3rem] leading-none text-[color:var(--color-fort)]">
                  {formule.nom}
                </span>
                {formule.recommandee ? (
                  <span className="data mt-2.5 block text-[0.6rem] tracking-[0.2em] text-[color:var(--color-accent)] uppercase">
                    Conseillée
                  </span>
                ) : null}
              </span>
              {/* L'INDICE D'OUVERTURE tourne d'un quart de tour : fermé il
                  invite à ouvrir, ouvert il invite à refermer. Le même
                  objet suit l'œil, au lieu d'un glyphe qui se remplace. */}
              <motion.span
                aria-hidden
                animate={{ rotate: ouverte ? 45 : 0 }}
                transition={{ duration: reduit ? 0 : 0.3, ease: EASE }}
                className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-touche)] border border-[color:var(--color-filet)] text-[0.9rem] leading-none text-[color:var(--color-texte)]"
              >
                +
              </motion.span>
            </span>

            <Prix cle={formule.cle} taille="carte" />

            <span className="block border-t border-[color:var(--color-filet)] pt-5">
              <span className="t-meta block text-[color:var(--color-faible)]">
                {formule.pourQui}
              </span>
              <span className="voix mt-2.5 block text-[1.02rem] leading-[1.35] text-balance text-[color:var(--color-fort)]">
                {formule.promesse}
              </span>
            </span>
          </button>
        </h3>

        {/* L'APPEL À L'ACTION EST DEHORS, et discret. Dehors parce qu'un
            lien dans un bouton n'est pas du HTML valide ; discret parce
            que la page n'a qu'UN appel principal, à l'invitation. Ici on
            propose, on ne réclame pas. */}
        <div className="mt-auto px-6 pb-7 sm:px-7">
          <Link
            href="/demonstration"
            className="bouton bouton-second w-full text-[0.72rem]"
          >
            Demander une démonstration
          </Link>
        </div>
      </motion.article>
    </motion.div>
  );
}

export function Formules() {
  const reduit = useReducedMotion();
  const base = useId();
  const [ouverte, setOuverte] = useState<CleFormule | null>(null);
  const rangOuvert = ouverte ? ORDRE.indexOf(ouverte) : -1;
  const panneau = `${base}-detail`;
  const vue = ouverte ? FORMULES.find((f) => f.cle === ouverte)! : null;

  const compris = vue ? comprisDans(vue.cle) : [];
  const absent = vue ? absentDe(vue.cle) : [];
  const ajouts = vue ? ajoutsSur(vue.cle) : [];

  const rangee = useRangee();
  /* Fermé, le panneau se range après la dernière carte : il doit exister
     quelque part pour pouvoir se déplier, et c'est là qu'il gêne le moins. */
  const placeEnColonne = rangOuvert < 0 ? FORMULES.length - 1 : rangOuvert;

  const detail = (
    <motion.div
      id={panneau}
      role="region"
      aria-labelledby={vue ? `${base}-t-${vue.cle}` : undefined}
      aria-hidden={!vue}
      className="lg:col-span-3"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: vue ? "auto" : 0, opacity: vue ? 1 : 0 }}
      transition={{ duration: reduit ? 0 : 0.42, ease: EASE }}
      style={{ overflow: "hidden" }}
    >
      {vue ? (
        <Detail vue={vue} compris={compris} absent={absent} ajouts={ajouts} />
      ) : null}
    </motion.div>
  );

  return (
    <section
      id="formules"
      className="mouvement grain-clair relative isolate overflow-x-clip"
      style={{ background: ciel("formules") }}
    >
      <div className="px relative z-10 mx-auto w-full max-w-[1420px]">
        <motion.div
          initial={{ opacity: 0, y: reduit ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduit ? 0 : 0.9, ease: EASE }}
          className="max-w-[46ch]"
        >
          <p className="eyebrow text-[color:var(--color-faible)]">
            Les formules
          </p>
          <h2 className="strophe mt-5 text-[clamp(1.9rem,4.2vw,3.2rem)]">
            Trois formules.
            <br />
            <em>La vôtre dépend de votre cave.</em>
          </h2>
          <p className="t-chapeau mt-7 text-pretty text-[color:var(--color-texte)]">
            Le conseil à table est compris dans les trois. Ce qui change, c’est
            ce que Vintoria fait de votre cave autour.
          </p>
        </motion.div>

        {/*
          EN COLONNE SUR MOBILE, EN RANGÉE AU-DELÀ DE `lg`.

          Le panneau de détail n'est pas au même endroit selon la largeur.
          En colonne, il se glisse juste après la carte ouverte — on lit la
          réponse là où on a posé la question. En rangée, il passe sous les
          trois et occupe toute la largeur : les cartes gardent leur
          hauteur, et le détail a la page entière pour se déployer.

          Il reste MONTÉ dans les deux cas, même fermé : c'est ce qui lui
          permet de se replier au lieu de disparaître.
        */}
        <div className="mt-14 flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:gap-6">
          {FORMULES.map((f, i) => (
            <Fragment key={f.cle}>
              <Carte
                formule={f}
                rang={i}
                reduit={!!reduit}
                panneau={panneau}
                titreId={`${base}-t-${f.cle}`}
                ouverte={ouverte === f.cle}
                ouvrir={() => setOuverte((v) => (v === f.cle ? null : f.cle))}
              />
              {!rangee && i === placeEnColonne ? detail : null}
            </Fragment>
          ))}
          {rangee ? detail : null}
        </div>
      </div>
    </section>
  );
}
