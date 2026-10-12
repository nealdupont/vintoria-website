/**
 * LES TROIS PLANCHES DU VOLET 01 — dessinées, pas capturées.
 *
 * POURQUOI DU DESSIN. Une dalle de logiciel posée dans une page de marque
 * raconte l'outil ; elle ne raconte pas le geste. Et elle vieillit à la
 * première refonte du produit. Ces trois planches montrent ce que le
 * restaurateur FAIT — il tend un document, il vise une étiquette, il colle
 * un texte — avec le vocabulaire d'une planche d'atelier.
 *
 * LA TYPOGRAPHIE EST DANS LE DESSIN, pas posée dessus. Un calque HTML
 * placé en pourcentages au-dessus d'un SVG se décale au premier
 * changement de corps ou de langue ; ici le lettrage vit dans le même
 * repère que le trait, et l'ensemble grandit d'un bloc. C'est aussi ce
 * qui en fait une PLANCHE et non une image légendée.
 *
 * LE TREMBLÉ EST DANS LES TRACÉS, pas dans un filtre. L'irrégularité de
 * la main s'écrit ici en dur — des courbes là où une règle donnerait des
 * droites, des points de contrôle volontairement décalés, un bord déchiré
 * dent par dent. Un `feDisplacementMap` donnait le même effet en deux
 * lignes, mais un filtre SVG se recalcule à CHAQUE transformation de
 * l'élément filtré : or ces cartes tournent, se redressent et changent
 * d'échelle à chaque passage du jeu. Mesuré : les six tests qui ouvrent ce
 * volet passaient de quelques secondes à plus de trois minutes, jusqu'au
 * dépassement de délai. Le dessin paie une fois, à l'écriture ; le filtre
 * payait à chaque image.
 *
 * CE QUI EST ÉCRIT DANS LES PLANCHES EST VRAI. Les vins et les prix sont
 * ceux de la cave de démonstration (Champagne Brut Réserve 85 €, Meursault
 * 110 €, Condrieu 78 €, Crémant de Loire 42 €, Petit Chablis 38 €) ; le
 * Meursault de l'étiquette est le Domaine du Clos, Bourgogne, 2020. Les
 * formats et la limite de poids viennent de l'écran d'import du produit.
 * Une planche a le droit d'être dessinée ; elle n'a pas le droit de
 * mentir.
 */

const ENCRE = "currentColor";

/**
 * La trame de hachure : une seule, inclinée, partagée par les trois.
 *
 * PARTAGÉE AU-DELÀ DE CE FICHIER depuis le volet 02 : les planches de la
 * cave sont bâties sur le même vocabulaire, et deux définitions de la même
 * trame auraient dérivé l'une de l'autre à la première retouche. Seul le
 * mot-clé change ici ; aucun dessin du volet 01 n'est modifié.
 */
export function Trame({ id, pas = 4 }: { id: string; pas?: number }) {
  return (
    <pattern
      id={id}
      width={pas}
      height={pas}
      patternTransform="rotate(52)"
      patternUnits="userSpaceOnUse"
    >
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={pas}
        stroke={ENCRE}
        strokeWidth="0.7"
        opacity="0.5"
      />
    </pattern>
  );
}

export const traitFin = {
  fill: "none",
  stroke: ENCRE,
  strokeWidth: 1.1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const serif = { fontFamily: "var(--font-voix), serif" };
export const grotesque = { fontFamily: "var(--font-structure), sans-serif" };

/* ══════════════════════════════════════════════════════════════
   01 — LA CARTE QUE L'ON TEND
   Une feuille imprimée à gauche, une flèche, et la même carte rangée
   à droite. Le sujet est le PASSAGE : c'est lui qu'on dessine.
   ══════════════════════════════════════════════════════════════ */
export function PlanchePdf() {
  /* Quatre vins de la cave de démonstration, choisis COURTS : la colonne
     du dessin fait 86 unités, et « Champagne Brut Réserve » y chevauchait
     son prix. Un dessin doit se lire de loin. */
  const VINS = [
    ["Condrieu", "78 €"],
    ["Meursault", "110 €"],
    ["Petit Chablis", "38 €"],
    ["Sancerre", "45 €"],
  ];

  return (
    <svg
      viewBox="0 0 300 196"
      role="img"
      aria-label="Une carte des vins imprimée, une flèche, et les mêmes vins rangés en lignes avec leurs prix."
      className="h-full w-full text-[color:var(--color-fort)]"
    >
      <defs>
        <Trame id="tr-pdf" />
      </defs>

      {/* ── LE TRAIT ── */}
      <g>
        {/* l'épaisseur de la feuille : un second bord, décalé */}
        <path
          d="M18 34 L116 26 L124 166 L26 174 Z"
          fill="url(#tr-pdf)"
          opacity="0.5"
        />
        <path
          d="M13 30 L111 22 L119 162 L21 170 Z"
          {...traitFin}
          fill="var(--color-surface)"
        />

        {/* le filet du titre */}
        <path
          d="M29 62 C 48 59, 70 58, 95 56"
          {...traitFin}
          strokeWidth="0.9"
        />
        {/* une volute : la petite marque d'un en-tête imprimé */}
        <path
          d="M46 71 c 5 -4, 10 2, 15 -2 c 4 -3, 8 1, 12 -2"
          {...traitFin}
          strokeWidth="0.9"
          opacity="0.75"
        />

        {/* les lignes de la carte */}
        {[88, 101, 114, 127, 140].map((y, i) => (
          <path
            key={y}
            d={`M30 ${y} C 55 ${y - 1.4}, 78 ${y + 1}, ${104 - i * 9} ${y - 0.6}`}
            {...traitFin}
            strokeWidth="0.85"
            opacity="0.6"
          />
        ))}

        {/* la flèche du passage */}
        <path
          d="M131 84 C 146 66, 160 70, 171 86"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M165 78 L172 88 L161 89"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* la feuille rangée */}
        <path
          d="M178 58 L292 62 L290 184 L176 180 Z"
          {...traitFin}
          fill="var(--color-surface)"
        />
        {/* le filet qui tient la colonne */}
        <path
          d="M188 74 L188 170"
          stroke="var(--color-accent)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        {/* les lignes de base des quatre entrées */}
        {[96, 122, 148, 172].map((y) => (
          <path
            key={y}
            d={`M196 ${y} L282 ${y + 0.6}`}
            {...traitFin}
            strokeWidth="0.6"
            opacity="0.35"
          />
        ))}
      </g>

      {/* ── LE LETTRAGE ── */}
      <g fill={ENCRE}>
        <text
          x="66"
          y="46"
          textAnchor="middle"
          style={serif}
          fontSize="11"
          transform="rotate(-4.6 66 46)"
        >
          CARTE
        </text>
        <text
          x="66"
          y="57"
          textAnchor="middle"
          style={serif}
          fontSize="11"
          transform="rotate(-4.6 66 57)"
        >
          DES VINS
        </text>

        {VINS.map(([nom, prix], i) => (
          <g key={nom}>
            <text
              x="196"
              y={91}
              style={serif}
              fontSize="8"
              transform={`translate(0 ${i * 26})`}
            >
              {nom}
            </text>
            <text
              x="282"
              y={96 - 5}
              textAnchor="end"
              style={grotesque}
              fontSize="8"
              opacity="0.8"
              transform={`translate(0 ${i * 26})`}
            >
              {prix}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   02 — L'ÉTIQUETTE QUE L'ON VISE
   Une étiquette est déjà un objet typographique : on la grave. Quatre
   équerres de bordeaux cadrent ce que le produit déclare lire, et rien
   d'autre.
   ══════════════════════════════════════════════════════════════ */
export function PlancheEtiquette() {
  const equerres = [
    "M58 44 L44 44 L44 58",
    "M202 44 L216 44 L216 58",
    "M58 176 L44 176 L44 162",
    "M202 176 L216 176 L216 162",
  ];

  return (
    <svg
      viewBox="0 0 260 210"
      role="img"
      aria-label="L’étiquette d’un Meursault du Domaine du Clos, millésime 2020, cadrée par quatre équerres de visée."
      className="h-full w-full text-[color:var(--color-fort)]"
    >
      <defs>
        <Trame id="tr-eti" pas={3.2} />
      </defs>

      <g>
        {/* l'épaule de la bouteille, en hachure dense */}
        <path
          d="M78 2 C 78 26, 62 36, 62 62 L62 208 L198 208 L198 62 C 198 36, 182 26, 182 2 Z"
          fill="url(#tr-eti)"
          opacity="0.55"
        />
        <path
          d="M78 2 C 78 26, 62 36, 62 62 L62 208 M182 2 C 182 26, 198 36, 198 62 L198 208"
          {...traitFin}
          strokeWidth="1"
          opacity="0.6"
        />

        {/* l'étiquette : bords haut et bas légèrement courbés, comme collée
            sur un verre rond */}
        <path
          d="M48 50 C 100 44, 160 44, 212 50 L212 170 C 160 176, 100 176, 48 170 Z"
          {...traitFin}
          fill="var(--color-surface)"
          strokeWidth="1.2"
        />
        {/* le filet intérieur de l'étiquette */}
        <path
          d="M56 58 C 103 53, 157 53, 204 58 L204 162 C 157 167, 103 167, 56 162 Z"
          {...traitFin}
          strokeWidth="0.55"
          opacity="0.45"
        />
        {/* le trait du millésime */}
        <path
          d="M118 128 L142 128"
          {...traitFin}
          strokeWidth="0.9"
          opacity="0.7"
        />

        {/* les équerres de visée */}
        {equerres.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        ))}
      </g>

      <g fill={ENCRE} textAnchor="middle">
        <text x="130" y="76" style={serif} fontSize="8.6" opacity="0.85">
          Domaine du Clos
        </text>
        <text x="130" y="104" style={serif} fontSize="19" letterSpacing="0.5">
          MEURSAULT
        </text>
        <text x="130" y="150" style={serif} fontSize="15">
          2020
        </text>
        <text
          x="130"
          y="166"
          style={grotesque}
          fontSize="5.6"
          letterSpacing="1.6"
          opacity="0.7"
        >
          BOURGOGNE
        </text>
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   03 — LE TEXTE QUE L'ON COLLE
   Une bande déchirée — le morceau arraché d'un document — et dessous le
   même contenu mis au carré. Le sujet est le RYTHME : du désordre à
   l'alignement.
   ══════════════════════════════════════════════════════════════ */
export function PlancheListe() {
  const BRUT = [
    "condrieu  domaine des terrasses 2021  78",
    "Meursault - Domaine du Clos - 2020 - 110€",
    "petit chablis, dom. des falaises, 2022, 38 €",
  ];
  const RANGE = [
    ["Condrieu", "2021", "78 €"],
    ["Meursault", "2020", "110 €"],
    ["Petit Chablis", "2022", "38 €"],
  ];

  /* LE BORD DÉCHIRÉ, et il revient vers la GAUCHE — c'est tout le sujet.
     Écrit dans l'autre sens, il repartait vers la droite et fermait un
     triangle au lieu d'une bande. Les vingt-six dents totalisent −236
     unités : la bande part de x=248 et retombe exactement sur x=12. */
  const dents =
    "l-9 4 l-8 -5 l-10 5 l-8 -4 l-11 6 l-9 -5 l-8 3 l-10 -4 l-9 5 l-8 -3 l-11 4 l-9 -5 l-8 4 l-10 -3 l-9 5 l-8 -4 l-11 3 l-9 -4 l-8 5 l-10 -4 l-7 3 l-9 -4 l-9 4 l-8 -4 l-10 5 l-11 -4";
  const bande = `M12 14 L246 10 L248 72 ${dents} Z`;
  const bordDechire = `M248 72 ${dents}`;

  return (
    <svg
      viewBox="0 0 300 200"
      role="img"
      aria-label="Une bande de texte collée, déchirée sur un bord, et dessous les mêmes vins rangés en colonnes avec millésime et prix."
      className="h-full w-full text-[color:var(--color-fort)]"
    >
      <defs>
        <Trame id="tr-lst" pas={4.4} />
      </defs>

      <g>
        {/* la bande collée, légèrement de travers */}
        <g transform="rotate(-2.4 150 48)">
          <path
            d={bande}
            {...traitFin}
            fill="var(--color-surface)"
            strokeWidth="1"
          />
          {/* le relief de la déchirure : le même bord, repassé plus clair */}
          <path
            d={bordDechire}
            {...traitFin}
            strokeWidth="0.75"
            opacity="0.5"
            transform="translate(0 2.5)"
          />
        </g>

        {/* la flèche qui descend vers le rangement */}
        <path
          d="M196 92 C 206 104, 206 112, 200 122"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M194 114 L200 124 L206 115"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* le tableau rangé */}
        <path
          d="M96 128 L292 126 L292 192 L96 194 Z"
          {...traitFin}
          fill="var(--color-surface)"
          strokeWidth="1.1"
        />
        <path
          d="M96 128 L292 126"
          stroke="var(--color-accent)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {[150, 172].map((y) => (
          <path
            key={y}
            d={`M104 ${y} L284 ${y - 0.4}`}
            {...traitFin}
            strokeWidth="0.55"
            opacity="0.3"
          />
        ))}
        {/* une pointe de hachure dans l'angle : l'épaisseur du bloc */}
        <path
          d="M274 178 L292 176 L292 192 L282 193 Z"
          fill="url(#tr-lst)"
          opacity="0.4"
        />
      </g>

      <g fill={ENCRE}>
        <g transform="rotate(-2.4 150 48)" opacity="0.55">
          {BRUT.map((l, i) => (
            <text key={l} x="24" y={32 + i * 15} style={grotesque} fontSize="7">
              {l}
            </text>
          ))}
        </g>

        {RANGE.map(([nom, an, prix], i) => (
          <g key={nom} transform={`translate(0 ${i * 22})`}>
            <text x="106" y="144" style={serif} fontSize="9">
              {nom}
            </text>
            <text
              x="222"
              y="144"
              style={grotesque}
              fontSize="7.6"
              opacity="0.7"
            >
              {an}
            </text>
            <text
              x="284"
              y="144"
              textAnchor="end"
              style={grotesque}
              fontSize="8"
            >
              {prix}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export const PLANCHES = {
  pdf: PlanchePdf,
  etiquette: PlancheEtiquette,
  liste: PlancheListe,
} as const;
