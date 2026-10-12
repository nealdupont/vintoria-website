/**
 * LES QUATRE PLANCHES DU VOLET 02 — « Piloter votre cave ».
 *
 * MÊME GRAMMAIRE QUE LE VOLET 01, AUTRES COMPOSITIONS. On reprend le
 * vocabulaire de `PlancheImport` — la trame à 52°, le trait fin, le sérif
 * et le grotesque — et on s'interdit d'en recopier les dessins. Chaque
 * planche est construite sur le propos de sa carte : un sommaire pour le
 * classement, un bordereau pour la valeur, des jauges pour les seuils, un
 * registre pour le journal.
 *
 * TOUT CE QUI EST ÉCRIT ICI A ÉTÉ RECALCULÉ, pas lu sur une capture. Les
 * deux fichiers de référence de Vintoria Pro 2.0.2 —
 * `tests/reference/fixtures/cave.ts` pour les prix et les couleurs,
 * `tests/reference/atelier/cave.ts` (DEMO_STOCK) pour les quantités et les
 * seuils — ont été relus et sommés selon la règle de `lib/stock/finance.ts`.
 * Le résultat : 15 références, 158 bouteilles, 7 972 € de valeur
 * commerciale, 2 sous leur seuil, 1 épuisée, 1 sans suivi. La composition
 * par couleur (52 rouges, 51 blancs, 31 rosés, 18 pétillants, 6 moelleux)
 * somme bien à 158, et les quatorze lignes « prix × bouteilles » somment
 * bien à 7 972. C'est la précaution qui manquait le jour où la page a
 * publié 179 bouteilles.
 *
 * AUCUNE PLANCHE NE RÉPÈTE LE CHIFFRE DE SA CARTE. Le sommaire dessine la
 * composition, la carte dit 15 et 158 ; le bordereau dessine le calcul, la
 * carte dit 7 972 €. Le dessin montre le chemin, la carte pose le résultat.
 */

import {
  ADDITION,
  COMPOSITION,
  COMPTE,
  SEUILS,
  fr,
} from "@/lib/cave-demonstration";

import { Trame, traitFin, serif, grotesque } from "./PlancheImport";

const ENCRE = "currentColor";

/**
 * L'ESPACE FINE NE SURVIT PAS AU SVG. `fr()` sépare les milliers par une
 * fine insécable (U+202F) : parfaite en HTML, où la gravure l'affiche, mais
 * absente des fontes du dessin — elle y disparaît sans rien séparer, et
 * « 4 514 » se lisait « 4514 ». On lui substitue l'insécable ordinaire, que
 * toutes les fontes portent. Le séparateur reste insécable des deux côtés :
 * un nombre ne se coupe pas en fin de ligne.
 */
const frDessin = (n: number): string => fr(n).replace(/\u202f/g, "\u00a0");
const ROUGE = "var(--color-accent)";

/* ══════════════════════════════════════════════════════════════
   01 — LE SOMMAIRE
   Un index imprimé : les familles, leurs points de conduite, leurs
   comptes, et à droite la même chose en hauteur. Le sujet est le
   CLASSEMENT — on dessine donc une table des matières, pas un graphique.
   ══════════════════════════════════════════════════════════════ */
export function PlancheMaitrise() {
  /* LES DENSITÉS DE TRAME, et rien d'autre, sont un choix de dessin : les
     familles et leurs comptes viennent de la source unique, recalculée à
     chaque exécution des tests. */
  const PAS = [3, 4, 5, 6, 8];
  const FAMILLES = COMPOSITION.map((c, i) => ({
    nom: c.nom,
    n: c.bouteilles,
    pas: PAS[i] ?? 5,
  }));
  const TOTAL = FAMILLES.reduce((somme, f) => somme + f.n, 0);

  /* La colonne de droite : 128 unités de haut, partagées au prorata.
     Le cumul est recalculé par segment plutôt que porté par un compteur
     muté dans le `map` — sur cinq familles le coût est nul, et une
     fonction de rendu n'a pas à garder de mémoire entre deux appels. */
  const HAUT = 36;
  const COURSE = 128;
  const segments = FAMILLES.map((f, i) => {
    const avant = FAMILLES.slice(0, i).reduce((somme, g) => somme + g.n, 0);
    return {
      ...f,
      y: HAUT + (avant / TOTAL) * COURSE,
      h: (f.n / TOTAL) * COURSE,
    };
  });

  return (
    <svg
      viewBox="0 0 300 200"
      role="img"
      aria-label="Un sommaire imprimé : rouges cinquante-deux, blancs cinquante et un, rosés trente et un, pétillants dix-huit, moelleux six ; et la même répartition en hauteur."
      className="h-full w-full text-[color:var(--color-fort)]"
    >
      <defs>
        {FAMILLES.map((f) => (
          <Trame key={f.nom} id={`tc-${f.nom}`} pas={f.pas} />
        ))}
      </defs>

      {/* ── L'INDEX ── */}
      {FAMILLES.map((f, i) => {
        const y = 46 + i * 27;
        return (
          <g key={f.nom}>
            <text
              x="14"
              y={y}
              {...grotesque}
              fill={ENCRE}
              fontSize="10.5"
              letterSpacing="1.2"
            >
              {f.nom.toUpperCase()}
            </text>
            {/* les points de conduite — la signature d'une table des matières */}
            <line
              x1="104"
              y1={y - 3.5}
              x2="186"
              y2={y - 3.5}
              stroke={ENCRE}
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="0.5 5"
              opacity="0.55"
            />
            <text
              x="214"
              y={y}
              {...serif}
              fill={ENCRE}
              fontSize="16"
              textAnchor="end"
            >
              {f.n}
            </text>
          </g>
        );
      })}

      {/* ── LE PIED : ce que l'index totalise ── */}
      <line x1="14" y1="172" x2="214" y2="172" stroke={ENCRE} strokeWidth="1" />
      <text
        x="14"
        y="188"
        {...grotesque}
        fill={ENCRE}
        fontSize="8.5"
        letterSpacing="1.6"
        opacity="0.72"
      >
        {COMPTE[0].nombre} {COMPTE[0].unite.toUpperCase()} · {COMPTE[1].nombre}{" "}
        {COMPTE[1].unite.toUpperCase()}
      </text>

      {/* ── LA COLONNE : l'index vu en hauteur ──
          Les familles se distinguent par la DENSITÉ de leur trame, pas par
          une couleur : le papier n'en a que deux, et une planche d'atelier
          se lit au trait. */}
      <g>
        {segments.map((s) => (
          <g key={s.nom}>
            <rect
              x="246"
              y={s.y}
              width="40"
              height={s.h}
              fill={`url(#tc-${s.nom})`}
              opacity="0.85"
            />
            <rect
              x="246"
              y={s.y}
              width="40"
              height={s.h}
              {...traitFin}
              strokeWidth="0.9"
            />
          </g>
        ))}
        <text
          x="266"
          y="178"
          {...grotesque}
          fill={ENCRE}
          fontSize="8"
          letterSpacing="1.4"
          textAnchor="middle"
          opacity="0.72"
        >
          LA CAVE
        </text>
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   02 — LE BORDEREAU
   La valeur n'est pas un chiffre tombé du ciel : c'est une addition.
   On dessine donc l'addition — prix de carte × bouteilles en cave —
   et on s'arrête au double filet. Le total, lui, est posé par la carte.
   ══════════════════════════════════════════════════════════════ */
export function PlancheValeur() {
  /* Les trois plus grosses lignes, puis le reste : la somme des quatre
     vaut le montant de la carte, et le test le revérifie. */
  const LIGNES = ADDITION.lignes.map((l) => ({
    nom: l.nom,
    prix: `${l.prix} €`,
    q: String(l.bouteilles),
    total: frDessin(l.total),
  }));

  return (
    <svg
      viewBox="0 0 300 200"
      role="img"
      aria-label="Un bordereau manuscrit : Champagne Brut Réserve quatre-vingt-cinq euros fois dix-huit font mille cinq cent trente, Côtes de Provence trente-deux fois trente et un font neuf cent quatre-vingt-douze, Morgon trente-six fois vingt-six font neuf cent trente-six, et onze autres références quatre mille cinq cent quatorze."
      className="h-full w-full text-[color:var(--color-fort)]"
    >
      <defs>
        <Trame id="tc-bord" pas={5} />
      </defs>

      {/* ── LA FEUILLE : son épaisseur d'abord, puis sa face ── */}
      <g transform="rotate(-1.1 150 100)">
        <path
          d="M22 22 L284 18 L286 178 L24 182 Z"
          fill="url(#tc-bord)"
          opacity="0.42"
        />
        <path
          d="M16 16 L278 12 L280 172 L18 176 Z"
          {...traitFin}
          fill="var(--color-surface)"
        />

        {/* l'en-tête du bordereau */}
        <text
          x="30"
          y="38"
          {...grotesque}
          fill={ENCRE}
          fontSize="8"
          letterSpacing="1.8"
          opacity="0.72"
        >
          PRIX DE CARTE
        </text>
        <text
          x="268"
          y="38"
          {...grotesque}
          fill={ENCRE}
          fontSize="8"
          letterSpacing="1.8"
          textAnchor="end"
          opacity="0.72"
        >
          × BOUTEILLES EN CAVE
        </text>
        <line
          x1="30"
          y1="46"
          x2="268"
          y2="46"
          stroke={ENCRE}
          strokeWidth="0.9"
          opacity="0.5"
        />

        {/* ── LES LIGNES ── */}
        {LIGNES.map((l, i) => {
          const y = 66 + i * 24;
          return (
            <g key={l.nom}>
              <text x="30" y={y} {...serif} fill={ENCRE} fontSize="11">
                {l.nom}
              </text>
              <text
                x="196"
                y={y}
                {...serif}
                fill={ENCRE}
                fontSize="10"
                textAnchor="end"
                opacity="0.78"
              >
                {l.prix} × {l.q}
              </text>
              <text
                x="268"
                y={y}
                {...serif}
                fill={ENCRE}
                fontSize="12"
                textAnchor="end"
              >
                {l.total}
              </text>
            </g>
          );
        })}

        {/* le reste de la cave, groupé — onze références, 4 514 € */}
        <text
          x="30"
          y="138"
          {...serif}
          fill={ENCRE}
          fontSize="11"
          fontStyle="italic"
          opacity="0.8"
        >
          et {ADDITION.reste.references} autres références
        </text>
        <text
          x="268"
          y="138"
          {...serif}
          fill={ENCRE}
          fontSize="12"
          textAnchor="end"
        >
          {frDessin(ADDITION.reste.total)}
        </text>

        {/* ── LE DOUBLE FILET ──
            La convention du teneur de livres : l'addition est close. Le
            total n'est pas écrit ici — il est gravé par la carte, juste
            dessous. Le dessin conduit l'œil, il ne le double pas. */}
        <line
          x1="150"
          y1="154"
          x2="268"
          y2="154"
          stroke={ROUGE}
          strokeWidth="1.1"
        />
        <line
          x1="150"
          y1="158"
          x2="268"
          y2="158"
          stroke={ROUGE}
          strokeWidth="1.1"
        />
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   03 — LES TROIS JAUGES
   Un seuil est un REPÈRE, pas une alarme. On dessine donc trois
   niveaux et trois traits de seuil, à la manière d'une éprouvette
   graduée — et le bordeaux ne sert qu'au repère.
   ══════════════════════════════════════════════════════════════ */
export function PlancheVigilance() {
  /* Les trois références que la règle `isLowStock` sort du lot : quantité
     ≤ seuil (le sien, ou trois par défaut) ; à zéro, c'est « épuisé » et
     non « bas ». */
  const JAUGES = SEUILS.map((r) => ({
    nom: r.nom,
    q: r.bouteilles,
    seuil: r.seuil,
    dit: String(r.bouteilles),
  }));

  const BAS = 150;
  const ECHELLE = 13.2; /* unités de dessin par bouteille, 8 bouteilles au plus */

  return (
    <svg
      viewBox="0 0 300 200"
      role="img"
      aria-label="Trois jauges graduées : le Meursault à deux bouteilles pour un seuil de trois, le Crozes-Hermitage à cinq pour un seuil de six, le Crémant de Loire épuisé."
      className="h-full w-full text-[color:var(--color-fort)]"
    >
      <defs>
        <Trame id="tc-jauge" pas={4} />
      </defs>

      {JAUGES.map((j, i) => {
        const x = 34 + i * 92;
        const hauteur = j.q * ECHELLE;
        return (
          <g key={j.nom}>
            {/* le niveau, écrit au-dessus */}
            <text
              x={x + 23}
              y="32"
              {...serif}
              fill={ENCRE}
              fontSize="17"
              textAnchor="middle"
            >
              {j.dit}
            </text>

            {/* l'éprouvette */}
            <rect
              x={x}
              y="44"
              width="46"
              height={BAS - 44}
              {...traitFin}
              strokeWidth="1"
            />

            {/* ce qu'il reste dedans */}
            {j.q > 0 && (
              <rect
                x={x}
                y={BAS - hauteur}
                width="46"
                height={hauteur}
                fill="url(#tc-jauge)"
                opacity="0.9"
              />
            )}

            {/* le seuil — le seul endroit où le bordeaux parle */}
            {j.seuil !== null && (
              <g>
                <line
                  x1={x - 7}
                  y1={BAS - j.seuil * ECHELLE}
                  x2={x + 53}
                  y2={BAS - j.seuil * ECHELLE}
                  stroke={ROUGE}
                  strokeWidth="1.3"
                />
                <text
                  x={x + 57}
                  y={BAS - j.seuil * ECHELLE + 3.5}
                  {...grotesque}
                  fill={ROUGE}
                  fontSize="8"
                  letterSpacing="0.6"
                >
                  {j.seuil}
                </text>
              </g>
            )}

            {/* le fond de l'éprouvette, appuyé */}
            <line
              x1={x}
              y1={BAS}
              x2={x + 46}
              y2={BAS}
              stroke={ENCRE}
              strokeWidth="1.6"
            />

            {/* LE NOM, PUIS L'ÉTAT — jamais l'un pris pour l'autre. La
                première version coupait le nom sur un trait d'union et
                mettait la seconde moitié en légende : « MEURSAULT / SOUS
                SEUIL » d'un côté, « CROZES / HERMITAGE » de l'autre. Deux
                lignes qui ne disaient pas la même chose. */}
            <text
              x={x + 23}
              y="166"
              {...grotesque}
              fill={ENCRE}
              fontSize="7.2"
              letterSpacing="0.5"
              textAnchor="middle"
            >
              {j.nom.toUpperCase()}
            </text>
            <text
              x={x + 23}
              y="178"
              {...grotesque}
              fill={ENCRE}
              fontSize="7.2"
              letterSpacing="0.5"
              textAnchor="middle"
              opacity="0.7"
            >
              {j.seuil === null ? "ÉPUISÉ" : "SOUS SON SEUIL"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   04 — LE REGISTRE
   Le journal est en AJOUT SEUL : chaque mouvement y laisse la quantité
   d'avant et celle d'après. On dessine donc un registre réglé, avec le
   vocabulaire exact du produit et le geste de chaque ligne — sans
   inventer une seule quantité, puisque le journal de la démonstration
   n'est pas une donnée de référence.
   ══════════════════════════════════════════════════════════════ */
export function PlancheMouvement() {
  /* Les mots sont ceux du produit : « Inventaire », « Réception »,
     « Vente », « Perte ou casse », « Dégustation », « Correction ». Le
     geste dit le sens du delta — et l'inventaire garde son trait droit,
     parce que le mouvement est inscrit même quand rien ne change. */
  const LIGNES = [
    { quoi: "Réception", sens: 1 },
    { quoi: "Vente", sens: -1 },
    { quoi: "Dégustation", sens: -1 },
    { quoi: "Inventaire", sens: 0 },
  ];

  return (
    <svg
      viewBox="0 0 300 200"
      role="img"
      aria-label="Un registre réglé : réception, vente, dégustation, inventaire ; chaque ligne porte la quantité d'avant et celle d'après."
      className="h-full w-full text-[color:var(--color-fort)]"
    >
      {/* ── L'EN-TÊTE DU REGISTRE ── */}
      <text
        x="16"
        y="30"
        {...grotesque}
        fill={ENCRE}
        fontSize="8"
        letterSpacing="1.8"
        opacity="0.72"
      >
        MOUVEMENT
      </text>
      <text
        x="196"
        y="30"
        {...grotesque}
        fill={ENCRE}
        fontSize="8"
        letterSpacing="1.8"
        textAnchor="middle"
        opacity="0.72"
      >
        AVANT
      </text>
      <text
        x="268"
        y="30"
        {...grotesque}
        fill={ENCRE}
        fontSize="8"
        letterSpacing="1.8"
        textAnchor="middle"
        opacity="0.72"
      >
        APRÈS
      </text>
      <line x1="16" y1="38" x2="284" y2="38" stroke={ENCRE} strokeWidth="1" />

      {/* ── LES LIGNES RÉGLÉES ── */}
      {LIGNES.map((l, i) => {
        const y = 60 + i * 28;
        /* Les deux repères : celui d'avant, puis celui d'après, plus haut
           ou plus bas selon le sens. Aucune valeur n'est écrite — le
           journal de la démonstration n'en fournit pas de vérifiée. */
        const avant = y - 4;
        const apres = y - 4 - l.sens * 7;
        return (
          <g key={l.quoi}>
            <text x="16" y={y} {...serif} fill={ENCRE} fontSize="11.5">
              {l.quoi}
            </text>
            <line
              x1="186"
              y1={avant}
              x2="206"
              y2={avant}
              stroke={ENCRE}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="206"
              y1={avant}
              x2="258"
              y2={apres}
              stroke={ENCRE}
              strokeWidth="1"
              opacity="0.55"
              strokeDasharray={l.sens === 0 ? "0 0" : "3 3"}
            />
            <line
              x1="258"
              y1={apres}
              x2="278"
              y2={apres}
              stroke={l.sens === 0 ? ENCRE : ROUGE}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="16"
              y1={y + 10}
              x2="284"
              y2={y + 10}
              stroke={ENCRE}
              strokeWidth="0.7"
              opacity="0.22"
            />
          </g>
        );
      })}

      {/* ── LA NOTE DU TENEUR DE REGISTRE ── */}
      <text
        x="16"
        y="190"
        {...grotesque}
        fill={ENCRE}
        fontSize="8"
        letterSpacing="1.4"
        opacity="0.7"
      >
        PERTE OU CASSE · CORRECTION
      </text>
    </svg>
  );
}

export const PLANCHES_CAVE = {
  maitrise: PlancheMaitrise,
  valeur: PlancheValeur,
  vigilance: PlancheVigilance,
  mouvement: PlancheMouvement,
} as const;
