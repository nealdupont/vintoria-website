/**
 * LES QUATRE PLANCHES DU VOLET 03 — « Trouver les bons accords ».
 *
 * LE REGISTRE CHANGE, PAS LA LANGUE. Les volets 01 et 02 parlaient de
 * structure : on y rangeait, on y comptait. Celui-ci parle d'une rencontre.
 * Même trame à 52°, même trait fin, mêmes deux fontes — mais les
 * compositions quittent le tableau et la liste pour le cercle, l'étiquette,
 * l'axe et le réglage. C'est le sujet qui change de forme, pas la marque.
 *
 * LES QUATRE PRINCIPES, UN PAR CARTE :
 *   01 — un CERCLE d'où partent trois fils. Lecture radiale, puis horizontale.
 *   02 — une ÉTIQUETTE, et en regard deux scores dont le plus haut perd.
 *   03 — deux AXES tendus d'un bord à l'autre, et une phrase dessous.
 *   04 — trois RÉGLAGES empilés, comme on les tourne à table.
 *
 * RIEN N'EST INVENTÉ. Chaque mot écrit dans ces dessins vient de
 * lib/accord-demonstration.ts, qui dit d'où il vient et que
 * tests/accords.spec.ts relit dans le produit. En particulier : le moteur ne
 * lit du plat que trois champs, et le vin le mieux noté de la démonstration
 * n'est pas celui qui est conseillé.
 */

import {
  ACCORD,
  AXES,
  ECARTE,
  PLAT,
  REGLAGES,
  VIN,
} from "@/lib/accord-demonstration";

import { Trame, traitFin, serif, grotesque } from "./PlancheImport";

const ENCRE = "currentColor";

/**
 * COUPER UNE PHRASE EN DEUX LIGNES ÉQUILIBRÉES.
 *
 * Le SVG ne replie pas le texte : il faut lui donner les lignes. Les écrire
 * à la main aurait détaché le dessin de `lib/accord-demonstration.ts`, et
 * la phrase de l'accord serait restée celle d'aujourd'hui pendant que la
 * donnée changeait. On coupe donc au dernier espace avant le milieu, et le
 * test vérifie que les deux lignes recollées redonnent la phrase.
 */
function couper(phrase: string): [string, string] {
  const milieu = Math.floor(phrase.length / 2);
  const coupe = phrase.lastIndexOf(" ", milieu);
  if (coupe <= 0) return [phrase, ""];
  return [phrase.slice(0, coupe), phrase.slice(coupe + 1)];
}
const ROUGE = "var(--color-accent)";

/* ══════════════════════════════════════════════════════════════
   01 — L'ASSIETTE, ET LES TROIS FILS QUI EN PARTENT
   « Tout commence dans l'assiette » — mais ce qui en sort n'est pas une
   photographie : ce sont trois lignes écrites. Le dessin montre
   exactement ce passage, parce que c'est là qu'est la vérité du produit.
   ══════════════════════════════════════════════════════════════ */
export function PlanchePlat() {
  const CHAMPS = [
    { quoi: "NOM", dit: PLAT.nom, y: 48 },
    { quoi: "DESCRIPTION", dit: PLAT.description, y: 96 },
    { quoi: "CATÉGORIE", dit: PLAT.categorie, y: 144 },
  ];

  return (
    <svg
      viewBox="0 0 300 210"
      role="img"
      aria-label={`Une assiette dessinée, d'où partent trois fils vers trois champs écrits : nom, ${PLAT.nom} ; description, ${PLAT.description} ; catégorie, ${PLAT.categorie}. Le prix est barré.`}
      className="h-full w-full text-[color:var(--color-fort)]"
    >
      <defs>
        <Trame id="ta-plat" pas={5} />
      </defs>

      {/* ── L'ASSIETTE ── */}
      <g>
        <circle cx="74" cy="100" r="58" {...traitFin} strokeWidth="1.2" />
        <circle
          cx="74"
          cy="100"
          r="46"
          {...traitFin}
          strokeWidth="0.8"
          opacity="0.55"
        />
        {/* la matière, posée au centre — une pièce et son jus, pas un décor */}
        <path
          d="M52 96 C 56 80, 84 76, 94 88 C 104 100, 98 118, 80 120 C 62 122, 48 112, 52 96 Z"
          fill="url(#ta-plat)"
          opacity="0.9"
        />
        <path
          d="M52 96 C 56 80, 84 76, 94 88 C 104 100, 98 118, 80 120 C 62 122, 48 112, 52 96 Z"
          {...traitFin}
          strokeWidth="1.1"
        />
        {/* trois grenailles, et le trait du jus */}
        <circle cx="44" cy="124" r="5.5" {...traitFin} strokeWidth="0.9" />
        <circle cx="58" cy="132" r="4.5" {...traitFin} strokeWidth="0.9" />
        <circle cx="94" cy="126" r="5" {...traitFin} strokeWidth="0.9" />
        <path
          d="M46 112 C 60 122, 84 124, 100 114"
          {...traitFin}
          strokeWidth="0.9"
          opacity="0.6"
        />
      </g>

      {/* ── LES TROIS FILS, ET CE QU'ILS PORTENT ── */}
      {CHAMPS.map((c) => (
        <g key={c.quoi}>
          <path
            d={`M126 100 C 136 100, 138 ${c.y}, 146 ${c.y}`}
            {...traitFin}
            strokeWidth="0.8"
            opacity="0.5"
          />
          <circle cx="146" cy={c.y} r="2" fill={ENCRE} />
          <text
            x="154"
            y={c.y - 7}
            {...grotesque}
            fill={ENCRE}
            fontSize="7"
            letterSpacing="1.5"
            opacity="0.68"
          >
            {c.quoi}
          </text>
          <text x="154" y={c.y + 9} {...serif} fill={ENCRE} fontSize="11">
            {c.dit}
          </text>
        </g>
      ))}

      {/* ── LA QUATRIÈME LIGNE, BARRÉE ──
          Le prix est bien dans la fiche du plat ; il n'est simplement pas
          lu par la génération d'accords. On le met donc au même rang que
          les trois autres, et on le raye : un champ présent, et sans effet.
          Écrit en légende à côté, il chevauchait son propre libellé. */}
      <g>
        <path
          d="M126 100 C 136 100, 138 190, 146 190"
          {...traitFin}
          strokeWidth="0.8"
          opacity="0.28"
          strokeDasharray="3 3"
        />
        <circle
          cx="146"
          cy="190"
          r="2"
          {...traitFin}
          strokeWidth="0.8"
          opacity="0.5"
        />
        <text
          x="154"
          y="183"
          {...grotesque}
          fill={ENCRE}
          fontSize="7"
          letterSpacing="1.5"
          opacity="0.45"
        >
          PRIX
        </text>
        <text x="154" y="199" {...serif} fill={ROUGE} fontSize="11">
          {PLAT.prix}
        </text>
        <line
          x1="151"
          y1="195"
          x2="182"
          y2="195"
          stroke={ROUGE}
          strokeWidth="1.1"
        />
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   02 — L'ÉTIQUETTE, ET LE SCORE QUI PERD
   La carte doit donner de la présence au vin : on lui donne donc son
   étiquette, gravée. Et en regard, la preuve que le produit se donne
   lui-même : sur ce plat, une cuvée note 95 et n'est jamais conseillée.
   ══════════════════════════════════════════════════════════════ */
export function PlancheVinJuste() {
  return (
    <svg
      viewBox="0 0 300 210"
      role="img"
      aria-label={`L'étiquette du ${VIN.nom}, ${VIN.domaine}, ${VIN.region}, ${VIN.cepages}, ${VIN.millesime}. En regard : ${ACCORD.score}, proposé ; ${ECARTE.score}, ${ECARTE.nom}, écartée faute de prix.`}
      className="h-full w-full text-[color:var(--color-fort)]"
    >
      <defs>
        <Trame id="ta-vin" pas={6} />
      </defs>

      {/* ── L'ÉTIQUETTE ── */}
      <g>
        {/* l'épaisseur du papier, puis la face */}
        <rect
          x="22"
          y="30"
          width="118"
          height="156"
          fill="url(#ta-vin)"
          opacity="0.4"
        />
        <rect
          x="16"
          y="24"
          width="118"
          height="156"
          {...traitFin}
          fill="var(--color-surface)"
        />
        <rect
          x="23"
          y="31"
          width="104"
          height="142"
          {...traitFin}
          strokeWidth="0.7"
          opacity="0.5"
        />

        <text
          x="75"
          y="54"
          {...serif}
          fill={ENCRE}
          fontSize="9"
          fontStyle="italic"
          textAnchor="middle"
        >
          {VIN.domaine}
        </text>
        <text
          x="75"
          y="80"
          {...serif}
          fill={ENCRE}
          fontSize="13"
          textAnchor="middle"
          letterSpacing="0.4"
        >
          SAINT-ÉMILION
        </text>
        <text
          x="75"
          y="96"
          {...grotesque}
          fill={ENCRE}
          fontSize="7.5"
          letterSpacing="2.2"
          textAnchor="middle"
          opacity="0.75"
        >
          GRAND CRU
        </text>
        <line
          x1="46"
          y1="110"
          x2="104"
          y2="110"
          stroke={ENCRE}
          strokeWidth="0.8"
          opacity="0.5"
        />
        <text
          x="75"
          y="132"
          {...serif}
          fill={ENCRE}
          fontSize="15"
          textAnchor="middle"
        >
          {VIN.millesime}
        </text>
        <text
          x="75"
          y="152"
          {...grotesque}
          fill={ENCRE}
          fontSize="6.6"
          letterSpacing="1"
          textAnchor="middle"
          opacity="0.7"
        >
          {VIN.region.toUpperCase()}
        </text>
        <text
          x="75"
          y="164"
          {...grotesque}
          fill={ENCRE}
          fontSize="5.8"
          letterSpacing="0.5"
          textAnchor="middle"
          opacity="0.7"
        >
          {VIN.cepages.toUpperCase()}
        </text>
      </g>

      {/* ── EN REGARD : LE RETENU, PUIS L'ÉCARTÉ ── */}
      <g>
        <text
          x="162"
          y="48"
          {...grotesque}
          fill={ENCRE}
          fontSize="7"
          letterSpacing="1.6"
          opacity="0.68"
        >
          SUR CE PLAT
        </text>

        {/* le retenu */}
        <text x="162" y="82" {...serif} fill={ENCRE} fontSize="26">
          {ACCORD.score}
        </text>
        <text
          x="206"
          y="76"
          {...grotesque}
          fill={ENCRE}
          fontSize="7"
          letterSpacing="1.4"
        >
          PROPOSÉ
        </text>
        <text
          x="206"
          y="88"
          {...serif}
          fill={ENCRE}
          fontSize="9"
          opacity="0.72"
        >
          {VIN.prix}
        </text>

        <line
          x1="162"
          y1="104"
          x2="286"
          y2="104"
          stroke={ENCRE}
          strokeWidth="0.8"
          opacity="0.4"
        />

        {/* l'écarté — mieux noté, jamais conseillé */}
        <text
          x="162"
          y="140"
          {...serif}
          fill={ENCRE}
          fontSize="26"
          opacity="0.52"
        >
          {ECARTE.score}
        </text>
        <line
          x1="160"
          y1="131"
          x2="200"
          y2="131"
          stroke={ROUGE}
          strokeWidth="1.4"
        />
        <text
          x="206"
          y="134"
          {...grotesque}
          fill={ROUGE}
          fontSize="7"
          letterSpacing="1.4"
        >
          ÉCARTÉE
        </text>
        <text
          x="206"
          y="146"
          {...serif}
          fill={ENCRE}
          fontSize="9"
          opacity="0.72"
        >
          {ECARTE.motif}
        </text>
        <text
          x="162"
          y="170"
          {...serif}
          fill={ENCRE}
          fontSize="9.5"
          fontStyle="italic"
          opacity="0.8"
        >
          {ECARTE.nom}
        </text>
        <text
          x="162"
          y="182"
          {...grotesque}
          fill={ENCRE}
          fontSize="6.6"
          letterSpacing="1"
          opacity="0.6"
        >
          {ECARTE.domaine.toUpperCase()}
        </text>
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   03 — LES DEUX AXES, ET LA PHRASE
   Le point de rencontre. On ne pose pas un verre à côté d'une assiette :
   on tend les deux axes que le convive lit vraiment, et on met dessous la
   phrase qui dit l'accord — celle que porte la donnée, mot pour mot.
   ══════════════════════════════════════════════════════════════ */
export function PlancheArt() {
  /* Les positions sont celles du FORMAT, pas celles de ce vin : le produit
     les calcule par vin, et nous n'avons pas ce calcul sous la main. On
     montre donc l'axe et son repère, jamais une mesure attribuée. */
  const AU = [0.66, 0.34];

  const X0 = 18;
  const X1 = 282;
  const [ligne1, ligne2] = couper(ACCORD.phrase);

  return (
    <svg
      viewBox="0 0 300 210"
      role="img"
      aria-label={`Deux axes de ressenti : ${AXES[0].gauche} à ${AXES[0].droite}, ${AXES[1].gauche} à ${AXES[1].droite}. Dessous, la phrase de l'accord : ${ACCORD.phrase}`}
      className="h-full w-full text-[color:var(--color-fort)]"
    >
      {AXES.map((a, i) => {
        const y = 46 + i * 46;
        const x = X0 + (X1 - X0) * AU[i];
        return (
          <g key={a.gauche}>
            <text
              x={X0}
              y={y - 11}
              {...grotesque}
              fill={ENCRE}
              fontSize="7.4"
              letterSpacing="1.2"
              opacity={AU[i] < 0.5 ? 1 : 0.55}
            >
              {a.gauche.toUpperCase()}
            </text>
            <text
              x={X1}
              y={y - 11}
              {...grotesque}
              fill={ENCRE}
              fontSize="7.4"
              letterSpacing="1.2"
              textAnchor="end"
              opacity={AU[i] >= 0.5 ? 1 : 0.55}
            >
              {a.droite.toUpperCase()}
            </text>
            <line
              x1={X0}
              y1={y}
              x2={X1}
              y2={y}
              stroke={ENCRE}
              strokeWidth="0.9"
              opacity="0.65"
            />
            {/* le repère : un disque plein, cerclé de papier — le verre en
                miniature, posé sur l'axe (c'est la forme du produit) */}
            <circle cx={x} cy={y} r="5.6" fill="var(--color-fond)" />
            <circle cx={x} cy={y} r="3.4" fill={ENCRE} />
          </g>
        );
      })}

      <text
        x={X0}
        y="112"
        {...grotesque}
        fill={ENCRE}
        fontSize="6.8"
        letterSpacing="1.3"
        opacity="0.62"
      >
        UNE POSITION ENTRE DEUX MOTS, JAMAIS UNE NOTE
      </text>

      <line
        x1={X0}
        y1="128"
        x2={X1}
        y2="128"
        stroke={ROUGE}
        strokeWidth="1.1"
      />

      {/* ── LA PHRASE, telle qu'elle est écrite dans la donnée ── */}
      <text
        x={X0}
        y="152"
        {...serif}
        fill={ENCRE}
        fontSize="11.5"
        fontStyle="italic"
      >
        « {ligne1}
      </text>
      <text
        x={X0}
        y="169"
        {...serif}
        fill={ENCRE}
        fontSize="11.5"
        fontStyle="italic"
      >
        {ligne2} »
      </text>

      <text
        x={X1}
        y="192"
        {...grotesque}
        fill={ROUGE}
        fontSize="7.4"
        letterSpacing="1.6"
        textAnchor="end"
      >
        {ACCORD.mot.toUpperCase()}
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   04 — LES TROIS RÉGLAGES
   La table. Le convive ne tape rien : il tourne trois boutons. On les
   empile comme sur la feuille basse du produit, et le QR n'est qu'une
   marque dans le coin — pas un code à scanner.
   ══════════════════════════════════════════════════════════════ */
export function PlancheChoix() {
  return (
    <svg
      viewBox="0 0 300 210"
      role="img"
      aria-label={`Trois réglages : le format, au verre ou à la bouteille ; le budget, de libre à plus de cent euros ; les goûts, j'aime, sans préférence ou j'évite.`}
      className="h-full w-full text-[color:var(--color-fort)]"
    >
      {/* ── LE FORMAT ── */}
      <g>
        <text
          x="16"
          y="34"
          {...grotesque}
          fill={ENCRE}
          fontSize="7"
          letterSpacing="1.6"
          opacity="0.68"
        >
          LE FORMAT
        </text>
        <text x="16" y="58" {...serif} fill={ENCRE} fontSize="12.5">
          {REGLAGES.formats[0]}
        </text>
        <text x="110" y="58" {...serif} fill={ENCRE} fontSize="12.5">
          {REGLAGES.formats[1]}
        </text>
        {/* le choix posé : une ellipse tracée à la main autour du mot */}
        <ellipse
          cx="156"
          cy="53"
          rx="52"
          ry="14"
          {...traitFin}
          strokeWidth="1.1"
          stroke={ROUGE}
        />
      </g>

      <line
        x1="16"
        y1="76"
        x2="284"
        y2="76"
        stroke={ENCRE}
        strokeWidth="0.7"
        opacity="0.25"
      />

      {/* ── LE BUDGET ── */}
      <g>
        <text
          x="16"
          y="98"
          {...grotesque}
          fill={ENCRE}
          fontSize="7"
          letterSpacing="1.6"
          opacity="0.68"
        >
          LE BUDGET
        </text>
        {REGLAGES.budgets.map((b, i) => {
          const y = 118 + i * 15;
          return (
            <g key={b}>
              <text
                x="30"
                y={y}
                {...serif}
                fill={ENCRE}
                fontSize="10"
                opacity={i === 0 ? 1 : 0.6}
              >
                {b}
              </text>
              {i === 0 && <circle cx="20" cy={y - 3.4} r="3" fill={ROUGE} />}
              {i !== 0 && (
                <circle
                  cx="20"
                  cy={y - 3.4}
                  r="3"
                  {...traitFin}
                  strokeWidth="0.8"
                  opacity="0.5"
                />
              )}
            </g>
          );
        })}
      </g>

      {/* ── LES GOÛTS ── */}
      <g>
        <text
          x="166"
          y="98"
          {...grotesque}
          fill={ENCRE}
          fontSize="7"
          letterSpacing="1.6"
          opacity="0.68"
        >
          LES GOÛTS
        </text>
        {REGLAGES.gouts.map((g, i) => {
          const y = 118 + i * 15;
          return (
            <g key={g}>
              <text
                x="182"
                y={y}
                {...serif}
                fill={ENCRE}
                fontSize="10"
                opacity={i === 0 ? 1 : 0.6}
              >
                {g}
              </text>
              {i === 0 ? (
                /* le cœur, au trait — c'est le pictogramme du produit */
                <path
                  d="M172 119 C 168.6 115.8, 168.8 112.2, 171.4 111.4 C 172.8 111, 173.8 111.8, 174 112.8 C 174.2 111.8, 175.2 111, 176.6 111.4 C 179.2 112.2, 179.4 115.8, 176 119 Z"
                  {...traitFin}
                  strokeWidth="0.9"
                  stroke={ROUGE}
                />
              ) : (
                <line
                  x1="169"
                  y1={y - 3.4}
                  x2="177"
                  y2={y - 3.4}
                  stroke={ENCRE}
                  strokeWidth="0.9"
                  opacity="0.5"
                />
              )}
            </g>
          );
        })}
      </g>

      {/* ── LA MARQUE DU CARTON, dans le coin ──
          Une suggestion, pas un code : quatre coins et deux repères. Un vrai
          QR dessiné serait un faux QR. */}
      <g opacity="0.5">
        {[
          [250, 168],
          [272, 168],
          [250, 190],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect
              x={x}
              y={y}
              width="12"
              height="12"
              {...traitFin}
              strokeWidth="0.9"
            />
            <rect x={x + 4} y={y + 4} width="4" height="4" fill={ENCRE} />
          </g>
        ))}
        <rect x="272" y="190" width="5" height="5" fill={ENCRE} />
        <rect x="280" y="197" width="4" height="4" fill={ENCRE} />
      </g>
    </svg>
  );
}

export const PLANCHES_ACCORD = {
  plat: PlanchePlat,
  vinjuste: PlancheVinJuste,
  art: PlancheArt,
  choix: PlancheChoix,
} as const;
