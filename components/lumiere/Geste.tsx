"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ciel } from "@/lib/lumiere";
import { VALEUR } from "@/lib/cave-demonstration";
import { PLANCHES } from "./PlancheImport";
import { PLANCHES_ACCORD } from "./PlancheAccord";
import { PLANCHES_CAVE } from "./PlancheCave";

/* LES DEUX JEUX DE PLANCHES SE LISENT PAR LA MÊME CLÉ. L'import en a trois,
   la cave quatre ; aucune clé ne se recouvre, et une carte ne sait pas de
   quel volet vient son dessin — ce qui est exactement ce qu'on veut le jour
   où le volet 03 aura les siennes. */
const TOUTES_PLANCHES = {
  ...PLANCHES,
  ...PLANCHES_CAVE,
  ...PLANCHES_ACCORD,
} as const;

/**
 * MOUVEMENT II — TROIS FAÇONS DE FAIRE MIEUX.
 *
 * CE QUI CHANGE, ET CE QUE ÇA COÛTE.
 * La version précédente était une page qui DÉCRIVAIT : trois manières de
 * faire entrer une carte, rien de cliquable, une hiérarchie où 01 dominait
 * parce qu'il traitait tout d'un coup. Elle était juste, et elle était sage.
 * Elle est remplacée par un CHOIX : trois portes, et derrière chacune une
 * page entière consacrée à une fonction du produit.
 *
 * Trois décisions antérieures tombent donc avec elle, et il faut le dire :
 *   · la section devient INTERACTIVE — « rien n'y promet une interaction
 *     qui n'existe pas » n'a plus d'objet, puisque l'interaction existe ;
 *   · 01 ne domine plus — les trois fonctions sont de même rang, ce qui
 *     est vrai : importer, piloter, accorder ne s'arbitrent pas ;
 *   · l'accent sort de sa réserve de deux emplois — il porte désormais les
 *     trois numéros, qui sont la structure même de la composition.
 * Les trois tests qui gardaient ces décisions sont réécrits, pas supprimés.
 *
 * LE BALAYEMENT EST UNE FEUILLE, pas un fondu. Le choix et le détail
 * occupent LA MÊME CELLULE de grille : la scène fait donc la hauteur du
 * plus haut des deux, et ouvrir ne change pas d'un pixel la hauteur du
 * document — aucun saut de défilement, jamais. La feuille monte de 101 %
 * jusqu'à zéro pendant que le choix s'efface vers le haut de 14 % : deux
 * vitesses, donc de la profondeur, et non deux calques qui se croisent.
 *
 * LES CHIFFRES NE SONT PAS DE L'ILLUSTRATION. Ceux de la cave viennent de
 * lib/cave-demonstration.ts, recalculés depuis les fixtures du produit et
 * gardés par un test. Les formats d'import ont été relus dans le produit
 * (lib/import/validation.ts : application/pdf, image/jpeg, image/png). Les
 * plats et le « aucun vin retenu » sont lus sur la capture elle-même.
 * L'esquisse de référence affichait « 24 680 € » et « 12 alertes » : ce
 * sont des nombres de dessinateur, ils n'entrent pas ici.
 */

/* Deux temps distincts, et c'est voulu : la feuille arrive avec de l'élan
   et se pose sans rebond ; le contenu, lui, suit sans traîner. */
const FEUILLE = [0.22, 1, 0.26, 1] as const;
const EASE = [0.16, 1, 0.3, 1] as const;

type Preuve = {
  readonly src: string;
  readonly alt: string;
  /** Recadrage CSS sur la MÊME image : aucun fichier de plus.
   *    largeur  = largeur de l'image / largeur de la région
   *    décalage = −origine / largeur de l'image × largeur
   *  Les deux pourcentages se résolvent sur la largeur du conteneur, ce
   *  qui rend le cadrage indépendant de la taille d'affichage. */
  readonly largeur: string;
  readonly gauche: string;
  readonly haut: string;
  readonly sizes: string;
};

type Carte = {
  readonly cle: string;
  readonly etiquette?: string;
  readonly titre: string;
  readonly corps?: string;
  readonly chiffres?: readonly {
    readonly valeur: string;
    readonly unite: string;
  }[];
  readonly liste?: readonly { readonly quoi: string; readonly dit: string }[];
  readonly ecran?: Preuve;
  /** Plus large dans le jeu : réservé aux écrans en paysage. */
  readonly large?: boolean;

  /* ── Propre au volet 01, où la carte EST une composition ──
     Trois scènes dessinées plutôt que trois captures, et trois formats
     différents : une rangée de cartes identiques se lit comme un
     tableau, pas comme une composition. */
  readonly sous?: string;
  /** Volet 01 : la planche dessinée qui occupe le haut de la carte. */
  readonly planche?: keyof typeof TOUTES_PLANCHES;
  readonly rangCarte?: string;
  readonly pied?: string;
  readonly papier?: "grege";
  readonly format?: "etroit" | "moyen" | "large";
  readonly hauteur?: string;
  readonly decalage?: string;
  readonly etapes?: readonly string[];
  readonly reperes?: readonly { readonly quoi: string; readonly dit: string }[];
};

type Porte = {
  readonly rang: string;
  readonly titre: readonly [string, string];
  readonly benefice: string;
  readonly cartes: readonly Carte[];
};

/*
 * LES TROIS PORTES, ET CE QU'IL Y A DERRIÈRE.
 *
 * TOUT CE QUI EST CHIFFRÉ ICI A ÉTÉ RELU DANS LE PRODUIT :
 *   · les formats — lib/import/validation.ts : application/pdf,
 *     image/jpeg, image/png, plus le collage de texte libre ;
 *   · la cave — lib/cave-demonstration.ts, recalculé depuis les
 *     fixtures et gardé par tests/chiffres.spec.ts ;
 *   · les plats, les comptes de vins et « aucun vin retenu » — lus sur
 *     l'écran Carte lui-même (public/demo/carte.webp) ;
 *   · l'accord du filet de bœuf — lu sur l'écran convive
 *     (public/demo/resultat.webp) : Saint-Émilion Grand Cru, Château
 *     Bellerive, Bordeaux, Merlot et Cabernet Franc, 2018, 95 €.
 * L'esquisse de référence portait « 42 vins importés », « Barolo 2017 »
 * et « Saint-Jacques rôties » : aucun des trois n'existe dans le
 * produit. Ce sont des nombres et des plats de dessinateur.
 */
const PORTES: readonly Porte[] = [
  {
    rang: "01",
    titre: ["Importer", "votre carte"],
    benefice: "Trois manières de la donner. Pas une ligne à ressaisir.",
    cartes: [
      {
        cle: "pdf",
        rangCarte: "01",
        titre: "Importer un PDF",
        corps:
          "Déposez votre carte des vins, lancez l’analyse, puis vérifiez l’aperçu avant de confirmer.",
        planche: "pdf",
        pied: "PDF, JPG ou PNG · 3 Mo maximum",
        format: "moyen",
        hauteur: "h-[clamp(25rem,88vw,30rem)]",
        decalage: "mt-6 sm:mt-8",
      },
      {
        cle: "etiquette",
        rangCarte: "02",
        titre: "Photographier une étiquette",
        corps:
          "Prenez l’étiquette en photo : Vintoria lit le nom, le domaine et le millésime. Vérifiez l’aperçu avant de confirmer.",
        planche: "etiquette",
        papier: "grege",
        format: "etroit",
        hauteur: "h-[clamp(26rem,94vw,32rem)]",
      },
      {
        cle: "liste",
        rangCarte: "03",
        titre: "Coller une liste",
        corps:
          "Copiez le texte de votre liste, un vin par ligne avec le prix. Vérifiez l’aperçu avant de confirmer.",
        planche: "liste",
        format: "large",
        hauteur: "h-[clamp(24rem,86vw,29rem)]",
        decalage: "mt-10 sm:mt-14",
      },
    ],
  },
  {
    rang: "02",
    titre: ["Piloter", "votre cave"],
    benefice: "Votre cave, d’un seul coup d’œil.",
    /*
      LES QUATRE CARTES DE LA CAVE — dessinées, et vraies.

      ORDRE ET FORMULATIONS ARRÊTÉS : la maîtrise, la valeur, la vigilance,
      le mouvement. Chaque corps a été écrit contre le code de Vintoria Pro
      2.0.2, pas contre une intention commerciale :

        · le classement par couleur, le tri et le filtre existent
          (lib/stock/types.ts — STOCK_CATEGORY_ORDER, StockSort, StockFilter) ;
          rien d'autre n'est promis, et surtout aucune « analyse » ;
        · la valeur affichée est la valeur COMMERCIALE de computeFinancials
          — Σ prix de vente × stock, références valorisables seulement. Le
          coût d'acquisition, la marge brute et le coefficient sont trois
          autres chiffres du même module : les confondre serait mentir, le
          pied de carte le dit donc explicitement ;
        · le seuil est « quantité ≤ seuil propre, ou trois par défaut »
          (isLowStock), et zéro vaut « épuisé », pas « bas ». Surtout :
          lib/stock/alerts.ts ne stocke RIEN, il recalcule à chaque visite.
          Écrire « vous êtes prévenu » laisserait croire à une notification
          qui n'existe pas ;
        · le journal est en ajout seul, écrit par record_stock_movement et
          complete_stock_inventory, et garde la quantité d'avant comme celle
          d'après. Aucune synchronisation, aucun temps réel, aucune
          automatisation ne sont promis.
    */
    cartes: [
      {
        cle: "maitrise",
        rangCarte: "01",
        etiquette: "La maîtrise",
        titre: "Votre cave, enfin lisible.",
        corps:
          "Vos vins groupés par couleur, triés et filtrés comme vous le voulez. Le compte suit ce que vous avez saisi : rien n’y est estimé.",
        planche: "maitrise",
        pied: "Une référence sans suivi, comptée à part",
        format: "moyen",
        hauteur: "h-[clamp(25rem,88vw,30rem)]",
        decalage: "mt-6 sm:mt-8",
      },
      {
        cle: "valeur",
        rangCarte: "02",
        etiquette: "La valeur",
        titre: "Ce que votre cave représente.",
        corps: VALEUR.calcul,
        planche: "valeur",
        chiffres: [{ valeur: VALEUR.montant, unite: VALEUR.dit }],
        pied: "Valeur commerciale : ni coût d’achat, ni marge",
        format: "large",
        /* LA PRÉSENCE DE CETTE CARTE VIENT DE SA LARGEUR, PAS DE SA HAUTEUR.
           Première version : 27rem de haut, soit plus que tout ce qui
           existait. La scène prend la hauteur du plus grand des quatre
           états — elle a donc grandi, et le dégradé chaud du panneau, dont
           le centre est en pourcentage, s'est rapproché de la barre du
           haut : le bouton de retour est passé de 4,71 à 4,41:1 sur un
           écran de 390 px. Une carte ne doit pas éclairer le texte d'une
           autre. Elle reprend donc la hauteur du plus grand du volet 01, et
           garde son format « large » — c'est la largeur, le filet double et
           le chiffre gravé qui lui donnent le dessus. */
        hauteur: "h-[clamp(26rem,94vw,32rem)]",
      },
      {
        cle: "vigilance",
        rangCarte: "03",
        etiquette: "La vigilance",
        titre: "Savoir ce qui manque avant qu’il ne manque.",
        corps:
          "Chaque référence a son seuil : le vôtre, ou trois par défaut. En dessous, elle ressort du lot ; à zéro, elle est épuisée.",
        planche: "vigilance",
        papier: "grege",
        pied: "Recalculé à chaque visite, jamais stocké",
        format: "moyen",
        hauteur: "h-[clamp(24rem,86vw,29rem)]",
        decalage: "mt-10 sm:mt-14",
      },
      {
        cle: "mouvement",
        rangCarte: "04",
        etiquette: "Le mouvement",
        titre: "Une cave qui suit le service.",
        corps:
          "Chaque entrée et chaque sortie s’inscrit au journal : la quantité d’avant, celle d’après, le motif et la date.",
        planche: "mouvement",
        pied: "Journal en ajout seul : rien n’est réécrit",
        format: "etroit",
        hauteur: "h-[clamp(26rem,96vw,31rem)]",
        decalage: "mt-4",
      },
    ],
  },
  {
    rang: "03",
    titre: ["Trouver", "les bons accords"],
    benefice:
      "Chaque plat trouve ses vins. Et Vintoria sait aussi reconnaître ce qui manque.",
    /*
      LES QUATRE CARTES DE L'ACCORD — et ce que le code autorise à en dire.

      01 — lib/dishes/pairing-inputs.ts : « La génération d'accords ne lit du
           plat que son nom, sa description et sa catégorie. » Trois champs.
           On n'écrit donc NI ingrédient analysé, NI technique de cuisson, NI
           nuance aromatique : rien de tout cela n'est lu. Le prix, lui, est
           explicitement sans effet sur les accords.
      02 — lib/carte/accords.ts : disponible ≠ proposé. Et la démonstration
           du produit le prouve elle-même — sur ce filet de bœuf, une cuvée
           note 95, plus haut que le Saint-Émilion, et n'est jamais
           conseillée faute de prix. On ne promet donc NI inventaire
           synchronisé, NI stock en temps réel : on dit la règle.
      03 — le convive lit un MOT (seuils 90/80/70, plancher 60) et deux axes
           de ressenti, pas une note : « Le restaurateur voit le nombre, le
           convive jamais. » La phrase de l'accord vient de la donnée.
      04 — lib/menu/budget.ts et PreferencesSheet.tsx : trois réglages
           réels — format, budget, goûts — et un goût n'est proposé que si la
           carte peut le servir. Le QR existe (/dashboard/qr) ; il reste une
           marque dans un coin, jamais un faux code.
    */
    cartes: [
      {
        cle: "plat",
        rangCarte: "01",
        etiquette: "Le plat",
        titre: "Tout commence dans l’assiette.",
        corps:
          "Son nom, sa description, sa catégorie : c’est ce que le sommelier lit. Touchez à l’un des trois, l’accord est à refaire.",
        planche: "plat",
        pied: "Le prix du plat n’y entre pas",
        format: "moyen",
        hauteur: "h-[clamp(25rem,88vw,30rem)]",
        decalage: "mt-6 sm:mt-8",
      },
      {
        cle: "vinjuste",
        rangCarte: "02",
        etiquette: "Le vin juste",
        titre: "Le bon vin, parmi ceux de votre cave.",
        corps:
          "Seules vos références entrent. Et disponible ne suffit pas : sans prix dans le format servi, un vin n’est jamais conseillé, même mieux noté.",
        planche: "vinjuste",
        pied: "Vos vins, pas une liste de vins",
        format: "large",
        hauteur: "h-[clamp(24rem,86vw,29rem)]",
      },
      {
        cle: "art",
        rangCarte: "03",
        etiquette: "L’art de l’accord",
        titre: "Comprendre pourquoi ils vont ensemble.",
        corps:
          "Deux axes, et un mot : harmonieux, bel accord, très bel accord, idéal. Le convive lit le mot ; le nombre reste de votre côté.",
        planche: "art",
        pied: "Chaque accord arrive avec sa phrase",
        format: "large",
        hauteur: "h-[clamp(26rem,94vw,32rem)]",
        decalage: "mt-9 sm:mt-12",
      },
      {
        cle: "choix",
        rangCarte: "04",
        etiquette: "Le choix du client",
        titre: "Le conseil du sommelier, à chaque table.",
        corps:
          "Le convive règle trois choses : le format, le budget, ses goûts. Chaque réponse resserre la proposition sur votre cave.",
        planche: "choix",
        papier: "grege",
        pied: "Un goût n’est proposé que si la carte peut le servir",
        format: "moyen",
        hauteur: "h-[clamp(23rem,82vw,28rem)]",
        decalage: "mt-14 sm:mt-20",
      },
    ],
  },
];

/**
 * LA COURBE — la paroi d'un verre, agrandie jusqu'à perdre son objet.
 * Un seul tracé, coupé par le cadre, en `multiply`. Elle n'illustre rien :
 * elle donne au vide de la composition une direction.
 */
function Courbe({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 420 760"
      preserveAspectRatio="none"
      className={`courbe ${className}`}
    >
      <defs>
        <linearGradient id="robe-geste" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--lie)" stopOpacity="0.52" />
          <stop offset="58%" stopColor="var(--braise)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--chene)" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path
        d="M420 0 C300 86 196 214 176 352 C156 490 238 612 420 688 L420 760 L130 760 C14 652 -28 470 22 304 C66 158 196 54 420 0 Z"
        fill="url(#robe-geste)"
      />
    </svg>
  );
}

/** La flèche : un trait qui s'allonge, pas une icône posée. */
function Fleche() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 72 12"
      className="h-3 w-[2.2rem] shrink-0 overflow-visible sm:w-[4.5rem] text-[color:var(--color-faible)] transition-colors duration-500 group-hover:text-[color:var(--color-accent)] group-focus-visible:text-[color:var(--color-accent)] sm:w-[4.5rem]"
    >
      <line
        x1="0"
        y1="6"
        x2="64"
        y2="6"
        stroke="currentColor"
        strokeWidth="1"
        className="origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-[1.14] group-focus-visible:scale-x-[1.14]"
      />
      <path
        d="M58 1.5 L64 6 L58 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[9px] group-focus-visible:translate-x-[9px]"
      />
    </svg>
  );
}

/**
 * LE JEU — des cartes posées, pas un carrousel.
 *
 * LE DÉFILEMENT EST NATIF, et c'est la décision qui porte toute
 * l'interaction. Un carrousel réécrit en JavaScript capture le geste :
 * sur un téléphone, le doigt qui voulait faire descendre la page se
 * retrouve à feuilleter des cartes. `scroll-snap` laisse le système
 * arbitrer — défilement vertical intact, inertie native, flèches du
 * clavier gratuites. On n'ajoute que ce que le CSS ne sait pas faire :
 * savoir OÙ l'on est, pour redresser la carte qu'on lit et l'annoncer.
 *
 * `scroll-snap-align: start` plutôt que `center` : les cartes s'alignent
 * sur la colonne de texte au-dessus. Centrées, elles auraient flotté
 * sans rapport avec la composition qui les introduit.
 */
function Jeu({
  cartes,
  actif,
  nom,
}: {
  cartes: readonly Carte[];
  actif: boolean;
  nom: string;
}) {
  const reduit = useReducedMotion();
  const piste = useRef<HTMLUListElement>(null);
  const [lu, setLu] = useState(0);

  /* Quelle carte occupe la fenêtre ? L'observateur a pour racine la
     piste elle-même : il mesure donc une position dans le jeu, pas une
     position dans la page. */
  useEffect(() => {
    const p = piste.current;
    if (!p) return;
    const io = new IntersectionObserver(
      (entrees) => {
        const vue = entrees
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vue) setLu(Number((vue.target as HTMLElement).dataset.rang));
      },
      { root: p, threshold: [0.5, 0.8, 1] },
    );
    for (const c of p.children) io.observe(c);
    return () => io.disconnect();
  }, []);

  /* On quitte la porte : le jeu revient à sa première carte. Sans cela,
     y revenir ouvrirait sur la troisième, au milieu d'une démonstration
     dont on a oublié le début. */
  useEffect(() => {
    if (actif) return;
    const p = piste.current;
    if (!p) return;
    p.scrollTo({ left: 0, behavior: "auto" });
    setLu(0);
  }, [actif]);

  const aller = (pas: number) => {
    const p = piste.current;
    if (!p) return;
    const k = Math.min(cartes.length - 1, Math.max(0, lu + pas));
    const cible = p.children[k] as HTMLElement | undefined;
    if (!cible) return;
    p.scrollTo({
      left: cible.offsetLeft,
      behavior: reduit ? "auto" : "smooth",
    });
  };

  return (
    <div className="mt-9 sm:mt-11">
      {/* La piste déborde volontairement à droite : on doit voir qu'il
          reste des cartes. Les commandes, elles, restent dans la
          colonne. */}
      <ul
        ref={piste}
        tabIndex={0}
        aria-label={`${nom} : ${cartes.length} cartes, à faire défiler`}
        /* `items-start` : sans lui, les cartes s'étirent toutes à la
           hauteur de la plus grande, et le volet 01 perd le décalage qui
           fait sa composition. */
        className="jeu relative -mt-3 flex items-start gap-4 overflow-x-auto pt-3 pr-[14%] pb-5 outline-offset-4 focus-visible:outline-2 focus-visible:outline-[color:var(--color-accent)] sm:gap-5 sm:pr-[22%]"
      >
        {cartes.map((c, k) => (
          <li
            key={c.cle}
            data-rang={k}
            data-lue={k === lu}
            style={
              {
                "--incl": `${[-2.1, 1.4, -1.2, 2.3][k % 4]}deg`,
              } as React.CSSProperties
            }
            className={`carte-posee shrink-0 origin-bottom ${
              c.hauteur ?? "h-[clamp(23rem,80vw,29rem)]"
            } ${c.decalage ?? ""} ${
              c.format === "etroit"
                ? "w-[66vw] max-w-[17rem] sm:w-[16rem] lg:w-[17.5rem]"
                : c.format === "large" || c.large
                  ? "w-[88vw] max-w-[30rem] sm:w-[26rem] lg:w-[29rem]"
                  : "w-[80vw] max-w-[21rem] sm:w-[20rem] lg:w-[23rem]"
            }`}
          >
            {/* ── LA CARTE DU VOLET 01 : UNE PLANCHE ──────────────
                Le dessin d'abord, les mots ensuite. C'est l'ordre d'une
                planche d'atelier, et c'est celui qui accroche : on
                comprend le geste avant de lire la phrase qui le nomme.
                Les volets 02 et 03 gardent leur composition. */}
            {c.planche ? (
              <article
                className={`carte-papier flex h-full flex-col overflow-hidden rounded-[10px] ${
                  c.papier === "grege" ? "papier-grege" : ""
                }`}
              >
                <div className="relative z-[1] flex h-full flex-col px-6 pt-6 pb-7 sm:px-7">
                  {/* LE BANDEAU : la pastille, et le nom du sujet à côté.
                      Le volet 01 n'avait que le numéro — trois gestes d'un
                      même geste n'ont pas besoin d'être nommés. Le volet 02
                      parle de quatre choses différentes (ce qu'on a, ce que
                      ça vaut, ce qui manque, ce qui bouge) : l'étiquette
                      est ce qui les sépare d'un coup d'œil. Elle est écrite
                      ici en clair plutôt qu'avec la classe « eyebrow », qui
                      impose sa couleur hors des couches Tailwind et ne
                      connaît pas le papier. */}
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="data flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-filet-fort)] text-[0.62rem] tracking-[0.1em] text-[color:var(--color-texte)] tabular-nums">
                      {c.rangCarte}
                    </span>
                    {c.etiquette && (
                      <span className="data text-[0.62rem] tracking-[0.2em] text-[color:var(--color-faible)] uppercase">
                        {c.etiquette}
                      </span>
                    )}
                  </div>

                  {/* la planche, dominante */}
                  <div className="my-5 min-h-0 flex-1">
                    {(() => {
                      const Planche = TOUTES_PLANCHES[c.planche!];
                      return <Planche />;
                    })()}
                  </div>

                  <h4 className="voix shrink-0 text-[1.32rem] leading-[1.14] text-[color:var(--color-accent)] sm:text-[1.5rem]">
                    {c.titre}
                  </h4>
                  {c.corps && (
                    <p className="voix mt-3 shrink-0 text-[0.95rem] leading-[1.42] text-pretty text-[color:var(--color-texte)]">
                      {c.corps}
                    </p>
                  )}
                  {/* LE CHIFFRE GRAVÉ — réservé à la valeur. Le bordereau
                      dessiné s'arrête au double filet du teneur de livres :
                      le total tombe ICI, en gravure. Le dessin conduit
                      l'addition, la carte la conclut. Une planche qui
                      écrirait déjà le total rendrait cette ligne redondante,
                      et aucune des deux ne porterait. */}
                  {c.chiffres && (
                    <div className="mt-4 shrink-0">
                      {c.chiffres.map((n) => (
                        <div key={n.unite}>
                          <p className="gravure text-[clamp(2.3rem,9vw,3rem)] leading-[0.9] text-[color:var(--color-fort)]">
                            {n.valeur}
                          </p>
                          <p className="voix mt-1 text-[0.86rem] text-[color:var(--color-faible)]">
                            {n.unite}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {c.pied && (
                    <p className="data mt-5 shrink-0 border-t border-[color:var(--color-filet)] pt-4 text-[0.62rem] tracking-[0.2em] text-[color:var(--color-faible)] uppercase">
                      {c.pied}
                    </p>
                  )}
                </div>
              </article>
            ) : (
              <article className="carte-ivoire flex h-full flex-col overflow-hidden rounded-[14px]">
                <div className="shrink-0 px-6 pt-6 sm:px-7 sm:pt-7">
                  <p className="eyebrow">{c.etiquette}</p>
                  <h4 className="voix mt-2.5 text-[1.22rem] leading-[1.18] text-[color:var(--color-fort)] sm:text-[1.3rem]">
                    {c.titre}
                  </h4>
                  {c.sous && (
                    <p className="data mt-2 text-[0.68rem] tracking-[0.18em] text-[color:var(--color-accent)] uppercase">
                      {c.sous}
                    </p>
                  )}
                  {c.corps && (
                    <p className="t-meta mt-3 text-pretty text-[color:var(--color-texte)]">
                      {c.corps}
                    </p>
                  )}
                </div>

                {/* ── LE PARCOURS RÉEL ────────────────────────────
                  Trois temps, dont le dernier est une VÉRIFICATION :
                  le produit propose, le restaurateur confirme. Écrire
                  « automatique » serait démenti au premier essai. */}
                {c.etapes && (
                  <ol className="shrink-0 border-t border-[color:var(--color-filet)] px-6 py-4 sm:px-7">
                    {c.etapes.map((e, k) => (
                      <li
                        key={e}
                        className="flex items-baseline gap-3 py-[0.22rem]"
                      >
                        <span className="data w-4 shrink-0 text-[0.62rem] text-[color:var(--color-accent)] tabular-nums">
                          {k + 1}
                        </span>
                        <span className="t-meta text-[color:var(--color-texte)]">
                          {e}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}

                {c.reperes && (
                  <dl className="shrink-0 border-t border-[color:var(--color-filet)] px-6 py-3 sm:px-7">
                    {c.reperes.map((r) => (
                      <div
                        key={r.quoi}
                        className="flex items-baseline justify-between gap-4 py-[0.18rem]"
                      >
                        <dt className="t-meta text-[color:var(--color-faible)]">
                          {r.quoi}
                        </dt>
                        <dd className="data shrink-0 text-[0.72rem] text-[color:var(--color-texte)]">
                          {r.dit}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {/* ── LES CHIFFRES ─────────────────────────────────── */}
                {c.chiffres && (
                  <div className="flex flex-1 flex-col justify-center gap-6 px-6 pb-7 sm:px-7">
                    {c.chiffres.map((n) => (
                      <div key={n.unite}>
                        <p className="gravure text-[clamp(2.6rem,11vw,3.6rem)] leading-[0.9] text-[color:var(--color-fort)]">
                          {n.valeur}
                        </p>
                        <p className="t-meta mt-1.5 text-[color:var(--color-faible)]">
                          {n.unite}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── LA LISTE ─────────────────────────────────────── */}
                {c.liste && (
                  <dl className="mt-auto px-6 pb-7 sm:px-7">
                    {c.liste.map((r) => (
                      <div
                        key={r.quoi}
                        className="border-t border-[color:var(--color-filet)] py-3"
                      >
                        <dt className="t-meta text-[color:var(--color-faible)]">
                          {r.quoi}
                        </dt>
                        <dd className="voix mt-1 text-[1.02rem] leading-snug text-[color:var(--color-fort)]">
                          {r.dit}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {/* ── L'ÉCRAN ──────────────────────────────────────── */}
                {c.ecran && (
                  <div className="relative mt-5 min-h-0 flex-1 overflow-hidden border-t border-[color:var(--color-filet)]">
                    <Image
                      src={c.ecran.src}
                      alt={c.ecran.alt}
                      width={1600}
                      height={1003}
                      sizes={c.ecran.sizes}
                      loading="lazy"
                      className="block h-auto max-w-none"
                      style={{
                        width: c.ecran.largeur,
                        marginLeft: c.ecran.gauche,
                        marginTop: c.ecran.haut,
                      }}
                    />
                  </div>
                )}
              </article>
            )}
          </li>
        ))}
      </ul>

      {/* ── OÙ EN EST-ON ─────────────────────────────────────────
          Un compte, pas une file de pastilles : avec quatre cartes, des
          points disent moins qu'un chiffre, et prennent plus de place. */}
      <div className="px mx-auto mt-1 flex w-full max-w-[1420px] items-center justify-between gap-4">
        <p className="data text-[0.72rem] tracking-[0.2em] text-[color:var(--color-faible)] tabular-nums">
          <span className="text-[color:var(--color-fort)]">
            {String(lu + 1).padStart(2, "0")}
          </span>{" "}
          / {String(cartes.length).padStart(2, "0")}
        </p>
        <div className="flex items-center gap-1">
          {([-1, 1] as const).map((pas) => (
            <button
              key={pas}
              type="button"
              onClick={() => aller(pas)}
              disabled={pas < 0 ? lu === 0 : lu === cartes.length - 1}
              aria-label={pas < 0 ? "Carte précédente" : "Carte suivante"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-filet)] text-[color:var(--color-texte)] outline-offset-2 transition-colors duration-300 hover:border-[color:var(--color-filet-fort)] hover:text-[color:var(--color-fort)] focus-visible:outline-2 focus-visible:outline-[color:var(--color-accent)] disabled:pointer-events-none disabled:opacity-30"
            >
              <span aria-hidden>{pas < 0 ? "←" : "→"}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Geste() {
  const reduit = useReducedMotion();
  const [actif, setActif] = useState<number | null>(null);
  /* La porte d'où l'on est entré : c'est à elle que le focus revient. */
  const [dernier, setDernier] = useState(0);
  const entrees = useRef<(HTMLButtonElement | null)[]>([]);
  const retour = useRef<HTMLButtonElement>(null);
  const ouvert = actif !== null;

  /*
   * LE FOCUS SUIT LE REGARD, dans les deux sens.
   * À l'ouverture il passe à « Les trois façons » : c'est la première
   * commande du nouvel espace, et elle en nomme la sortie. Au retour il
   * revient sur la porte ouverte — sans quoi il retombe sur le corps du
   * document et la tabulation repart du haut de la page.
   * `preventScroll` est indispensable : donner le focus à un élément le
   * ramène sinon dans le champ, et la page glissait de 616 px à chaque
   * ouverture — un saut que rien ne justifie puisque la scène, elle, ne
   * change pas de hauteur d’un pixel.
   * Le report au prochain tour de boucle laisse React démonter son inertie
   * avant qu'on cherche à donner le focus : un élément inerte le refuse.
   */
  const ouvrir = (i: number) => {
    setActif(i);
    setDernier(i);
    requestAnimationFrame(() => retour.current?.focus({ preventScroll: true }));
  };
  const fermer = () => {
    setActif(null);
    requestAnimationFrame(() =>
      entrees.current[dernier]?.focus({ preventScroll: true }),
    );
  };

  const duree = (d: number) => (reduit ? 0 : d);
  const pas = (delai: number, d = 0.95) => ({
    duration: duree(d),
    delay: duree(delai),
    ease: EASE,
  });

  /* L'ouverture et la fermeture ne se valent pas : on entre avec de
     l'élan, on sort plus sèchement. */
  const glisse = (entre: boolean) => ({
    duration: duree(entre ? 0.78 : 0.56),
    ease: entre ? FEUILLE : EASE,
  });

  return (
    <section
      id="geste"
      className="mouvement grain-clair relative isolate overflow-x-clip"
      /* LE PANNEAU OUVERT PASSE DEVANT. Le rai de lumière du mouvement III
         (« cave ») monte de 30 % au-dessus de sa propre section et vient
         frapper celle-ci par en dessous ; sur l'ivoire, c'est la lumière
         voulue, et rien ne doit changer. Sur la feuille de tabac, mesuré au
         pixel, il montait le fond de 58 à 197 de luminance : un projecteur
         blanc en travers d'un panneau brun. L'étage ne se lève donc QUE le
         temps de l'ouverture — la composition de l'accueil clair reste
         exactement celle qui a été validée. */
      style={{ background: ciel("geste"), zIndex: ouvert ? 2 : undefined }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* LE RAI APPARTIENT À L'ÉTAT CLAIR. Mesuré au pixel : posé sur la
            feuille de tabac, ce projecteur blanc montait le fond de 58 à 197
            de luminance en travers du panneau, juste sous les cartes. Une
            lumière ne traverse pas une cloison — quand le volet se referme
            sur la scène, elle s'éteint avec elle. L'extinction suit la même
            durée que la fermeture, pour qu'on lise un seul geste. */}
        <div
          className="jet top-[-16%] left-[74%] h-[60%]"
          style={{
            opacity: ouvert ? 0 : 0.5,
            transition: reduit
              ? undefined
              : `opacity ${duree(0.56)}s var(--ease-film)`,
          }}
        />
      </div>

      {/* LA SCÈNE EST PLEINE LARGEUR, et sa gouttière est portée par ce
          qu'elle contient. Confinée dans la colonne de texte, la feuille
          de tabac se lisait comme un panneau posé au milieu de l'ivoire ;
          d'un bord à l'autre, elle devient une autre pièce. */}
      <div className="relative z-10 w-full">
        {/*
          LA SCÈNE. Les deux états partagent la cellule 1/1 : la hauteur est
          celle du plus haut, elle ne bouge pas quand on ouvre, et le
          document ne se décale donc jamais sous le lecteur.
        */}
        {/* `minmax(0, 1fr)` N'EST PAS DÉCORATIF. Une colonne implicite vaut
              `auto`, c'est-à-dire le max-content de ses éléments : la scène
              s'élargissait à 417 px dans une colonne de 342, et les valeurs
              du détail se rognaient à droite sur un iPhone. */}
        <div className="relative grid grid-cols-[minmax(0,1fr)] overflow-hidden [overflow-anchor:none] [&>*]:[grid-area:1/1]">
          {/* ══════════════ ÉTAT A — LE CHOIX ══════════════ */}
          <motion.div
            inert={ouvert}
            initial={false}
            animate={{
              y: ouvert && !reduit ? "-14%" : "0%",
              opacity: ouvert ? 0 : 1,
            }}
            transition={glisse(!ouvert)}
            /* LE PLUS COURT DES DEUX ÉTATS SE CENTRE. La scène fait la
               hauteur du plus grand — c'est ce qui l'immobilise. Sans ce
               centrage, l'autre état s'accrochait en haut et laissait
               quatre cents pixels de vide sous lui, qui se lisaient comme
               une page interrompue et non comme de l'air. */
            className="px mx-auto flex h-full w-full max-w-[1420px] flex-col justify-center py-6"
          >
            <Courbe className="pointer-events-none absolute top-[6%] right-[-22%] h-[62%] w-[72%] sm:right-[-14%] sm:w-[52%] lg:top-[2%] lg:right-[-6%] lg:h-[86%] lg:w-[38%]" />

            <motion.p
              className="eyebrow relative text-[color:var(--color-faible)]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={pas(0, 0.8)}
            >
              Pour commencer
            </motion.p>

            {/*
              LE TITRE EST UN OBJET, pas un intitulé responsive. Les quatre
              lignes n'ont ni la même échelle ni la même origine : « de
              faire » rentre, « mieux. » ressort et bascule en italique.
              C'est le rythme qui fait la monumentalité autant que le corps.
            */}
            <h2 className="gravure relative mt-7 leading-[0.84] tracking-[-0.035em] text-[color:var(--color-fort)]">
              {[
                { mot: "Trois", classe: "text-[clamp(3.6rem,17vw,9.5rem)]" },
                {
                  mot: "façons",
                  classe: "text-[clamp(3.6rem,17vw,9.5rem)] ml-[7%] sm:ml-[9%]",
                },
                {
                  mot: "de faire",
                  classe:
                    "text-[clamp(2.6rem,12vw,6.6rem)] ml-[2%] text-[color:var(--color-texte)]",
                },
              ].map((l, i) => (
                <motion.span
                  key={l.mot}
                  className={`block ${l.classe}`}
                  initial={{ opacity: 0, y: reduit ? 0 : 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={pas(0.1 + i * 0.1, 1.05)}
                >
                  {l.mot}
                </motion.span>
              ))}
              <motion.span
                className="ml-[14%] block text-[clamp(3.6rem,17vw,9.5rem)] italic text-[color:var(--color-accent)] sm:ml-[18%]"
                initial={{ opacity: 0, y: reduit ? 0 : 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={pas(0.42, 1.05)}
              >
                mieux.
              </motion.span>
            </h2>

            <motion.p
              className="t-chapeau relative mt-10 max-w-[30ch] text-pretty text-[color:var(--color-texte)] lg:mt-12 lg:ml-[2%]"
              initial={{ opacity: 0, y: reduit ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={pas(0.6, 1)}
            >
              Trois gestes. Chacun retire de vos mains un travail que vous
              faites encore à la main.
            </motion.p>

            {/*
              LES TROIS PORTES. Elles ne sont pas trois lignes répétées :
              chacune a son retrait, et le deuxième mord plus loin que les
              autres. L'irrégularité est tenue par un alignement unique —
              la colonne des numéros — sans quoi elle serait du désordre.
            */}
            <ul className="relative mt-16 sm:mt-20 lg:mt-24">
              {PORTES.map((p, i) => (
                <motion.li
                  key={p.rang}
                  className={
                    [
                      "",
                      "ml-[10%] sm:ml-[16%] lg:ml-[24%]",
                      "ml-[3%] sm:ml-[5%]",
                    ][i]
                  }
                  initial={{ opacity: 0, y: reduit ? 0 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={pas(0.78 + i * 0.12, 1)}
                >
                  <button
                    ref={(n) => {
                      entrees.current[i] = n;
                    }}
                    type="button"
                    onClick={() => ouvrir(i)}
                    aria-expanded={actif === i}
                    aria-controls="geste-detail"
                    className="group flex w-full items-baseline gap-x-5 border-t border-[color:var(--color-filet)] py-7 text-left outline-offset-4 focus-visible:outline-2 focus-visible:outline-[color:var(--color-accent)] sm:gap-x-8 sm:py-9"
                  >
                    <span className="gravure shrink-0 text-[clamp(2.4rem,10vw,5rem)] leading-none text-[color:var(--color-accent)] transition-opacity duration-500 group-hover:opacity-70">
                      {p.rang}
                    </span>
                    <span className="gravure min-w-0 text-[clamp(1.5rem,7.4vw,3.2rem)] leading-[1.02] tracking-[-0.02em] text-[color:var(--color-fort)]">
                      {p.titre[0]}{" "}
                      <span className="whitespace-nowrap">{p.titre[1]}</span>
                    </span>
                    {/* LA FLÈCHE SUIT LE MOT, elle ne va pas au bord.
                        Ferrée à droite, les trois se seraient alignées sur
                        une même verticale — et auraient annulé, à elles
                        seules, le décalage des trois entrées. */}
                    <span className="ml-auto flex shrink-0 self-center pl-5 sm:ml-10 sm:pl-0">
                      <Fleche />
                    </span>
                  </button>
                </motion.li>
              ))}
              <li className="h-px bg-[color:var(--color-filet)]" />
            </ul>
          </motion.div>

          {/* ══════════════ ÉTAT C — LA FEUILLE ══════════════
              Ouvrir une porte change de pièce : la feuille porte le
              TABAC, quand la sélection reste en ivoire. C'est la
              rupture chromatique voulue, et le seul endroit du site où
              ce brun apparaît.

              LES TROIS DÉTAILS SONT TOUS MONTÉS, superposés dans une
              seule cellule. C'est ce qui rend la scène immobile : sa
              hauteur est celle du plus grand des quatre états, une fois
              pour toutes. La première version ne montait le détail qu'à
              l'ouverture — le document gagnait mille pixels d'un coup
              et le navigateur décalait le lecteur. */}
          <motion.div
            id="geste-detail"
            inert={!ouvert}
            initial={false}
            /* LE MOUVEMENT RÉDUIT SUPPRIME LA DURÉE, PAS L'ÉTAT. Cette
               feuille se tenait ici à « ouvert || reduit » : fermée, un
               lecteur en mouvement réduit recevait donc le panneau de tabac
               posé par-dessus les trois entrées — un pan brun presque vide,
               puisque son propre contenu reste, lui, conditionné à
               l'ouverture. La préférence ne dit pas quel état montrer, elle
               dit de ne pas l'animer : c'est « glisse » qui l'honore, en
               tombant à zéro seconde. La hauteur, elle, ne bouge pas pour
               autant — « visibility: hidden » garde la case, et la
               translation ne touche pas à la mise en page. */
            animate={{ y: ouvert ? "0%" : "101%" }}
            transition={glisse(ouvert)}
            className="tabac relative z-10 flex h-full min-w-0 flex-col justify-center py-7 sm:py-9"
            style={{ visibility: ouvert ? "visible" : "hidden" }}
          >
            {/* ── LA BARRE : sortir, ou passer à côté ── */}
            <div className="px mx-auto flex w-full min-w-0 max-w-[1420px] flex-col gap-y-2 border-b border-[color:var(--color-filet)] pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-5">
              <button
                ref={retour}
                type="button"
                onClick={() => fermer()}
                /* LE RETOUR SE MET AU NIVEAU DU RAIL, SON JUMEAU DANS LA
                   MÊME BARRE. Le rail est passé en valeur forte quand la
                   feuille a reçu sa matière : un fond qui respire de ±7
                   valeurs fait tomber douze pixels de texte sous le seuil
                   dès qu'ils rencontrent une bosse claire. Mesuré ici :
                   4,41:1 sur un écran de 390 px, et 98 au lieu de 109 de
                   luminance quand on retire la matière — la cause est
                   établie, pas supposée. Le rail avait été corrigé, pas lui.
                   La couleur est posée en ligne parce que « .eyebrow »
                   impose la sienne hors des couches Tailwind, et que
                   « .eyebrow-verre » appartient à l'en-tête : la retoucher
                   aurait débordé bien au-delà de cette barre. */
                style={{ color: "var(--color-fort)" }}
                className="eyebrow eyebrow-verre group inline-flex min-h-11 items-center gap-3 outline-offset-4 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-[color:var(--color-accent)]"
              >
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1"
                >
                  ←
                </span>
                Les trois façons
              </button>

              <div className="-ml-3 flex w-fit items-center gap-1 sm:ml-0">
                {PORTES.map((p, i) => (
                  <button
                    key={p.rang}
                    type="button"
                    onClick={() => {
                      setActif(i);
                      setDernier(i);
                    }}
                    aria-current={actif === i ? "true" : undefined}
                    aria-label={`${p.titre[0]} ${p.titre[1]}`}
                    className={`data relative inline-flex h-11 w-11 items-center justify-center text-[0.78rem] tracking-[0.16em] tabular-nums outline-offset-2 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-[color:var(--color-accent)] ${
                      /*
                        LE NUMÉRO ACTIF EST EN ENCRE CLAIRE, pas en cendre
                        rose : mesuré à 3,49:1 sur la matière du papier
                        mâché, qui relève le fond de vingt unités sous le
                        rail. La cendre descend donc sur le FILET — un
                        soulignement n'a pas de seuil de lisibilité, et il
                        dit « vous êtes ici » aussi bien qu'une couleur.
                      */
                      actif === i
                        ? "text-[color:var(--color-fort)] after:absolute after:bottom-2 after:h-px after:w-4 after:bg-[color:var(--color-accent)]"
                        : /* LE RAIL EST EN VALEUR FORTE, MÊME AU REPOS. Douze pixels
                             de chiffres posés sur une matière vivante : le fond
                             n'est plus un aplat, il respire de ±7 valeurs, et le
                             bouton le plus à gauche tombait sur une bosse claire
                             — mesuré 4,29:1 contre 4,5 exigé. Baisser la matière
                             ou assombrir le cognac revenait à payer la lisibilité
                             d'un rail avec la peau de toute la feuille. La valeur
                             forte donne 5,8:1 partout, et l'état courant reste lu
                             sans couleur, par son seul filet : l'accent ne porte
                             que la structure. */
                          "text-[color:var(--color-fort)]"
                    }`}
                  >
                    {p.rang}
                  </button>
                ))}
              </div>
            </div>

            {/* ── LES TROIS DÉTAILS, superposés ── */}
            <div className="relative mt-8 grid grid-cols-[minmax(0,1fr)] sm:mt-10 [&>*]:[grid-area:1/1]">
              {PORTES.map((p, i) => {
                const ici = actif === i;
                return (
                  <motion.div
                    key={p.rang}
                    inert={!ici}
                    aria-hidden={!ici}
                    initial={false}
                    animate={{
                      opacity: ici ? 1 : 0,
                      y: reduit ? "0%" : ici ? "0%" : "6%",
                    }}
                    transition={{
                      duration: duree(ici ? 0.52 : 0.26),
                      delay: duree(ici && ouvert ? 0.14 : 0),
                      ease: EASE,
                    }}
                    className={`flex flex-col justify-center ${ici ? "" : "pointer-events-none"}`}
                  >
                    {/* LE TITRE ET LA PROMESSE, en tête, puis le jeu.
                        La hiérarchie ne change pas d'une porte à l'autre
                        — ce sont les cartes qui changent de rythme. */}
                    <div className="px mx-auto w-full max-w-[1420px] lg:flex lg:items-end lg:justify-between lg:gap-x-14">
                      <h3 className="gravure flex items-start gap-x-5 leading-[0.88] tracking-[-0.03em] text-[color:var(--color-fort)] sm:gap-x-7">
                        <span className="shrink-0 text-[clamp(2.2rem,8vw,4rem)] text-[color:var(--color-accent)]">
                          {p.rang}
                        </span>
                        <span className="text-[clamp(2rem,8.6vw,4.6rem)]">
                          {p.titre[0]}
                          <br />
                          {p.titre[1]}
                        </span>
                      </h3>
                      <p className="voix mt-6 max-w-[26ch] text-[clamp(1.1rem,4.2vw,1.55rem)] leading-[1.3] text-pretty text-[color:var(--color-texte)] lg:mt-0 lg:max-w-[22ch] lg:pb-2 lg:text-right">
                        {p.benefice}
                      </p>
                    </div>

                    <Jeu
                      cartes={p.cartes}
                      actif={ici && ouvert}
                      nom={`${p.titre[0]} ${p.titre[1]}`}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
