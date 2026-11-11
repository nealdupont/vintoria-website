/**
 * LES VIGNETTES DES ÉTAPES. Quatre petites scènes, une par étape, qui se
 * jouent quand leur étape devient active (`[data-actif="oui"]` sur un
 * parent). Toujours des objets du métier, jamais d'écran de l'application :
 * une carte qu'on lit, des plats qu'on accorde, un chevalet qu'on pose, un
 * verre qu'on sert.
 *
 * Les animations vivent dans globals.css (préfixe `vg-`) ; ici, seulement
 * le dessin et les rangs (`--k`) qui décalent les éléments d'une série.
 */

const TRAIT = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

const rang = (k: number) => ({ "--k": k }) as React.CSSProperties;
const VOIX = { fontFamily: "var(--f-voix)" };

/** I · La carte importée : un balayage d'or, et les vins reconnus un à un. */
export function VignetteImport({ p = "vg" }: { p?: string }) {
  const lignes = [64, 92, 120, 148, 176, 204, 232];
  const reconnus = [
    { nom: 72, app: 50 },
    { nom: 88, app: 62 },
    { nom: 64, app: 44 },
    { nom: 80, app: 56 },
  ];
  return (
    <svg viewBox="0 0 480 340" className="vg" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${p}-papier`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6efe2" />
          <stop offset="1" stopColor="#e2d5bf" />
        </linearGradient>
        <linearGradient id={`${p}-balai`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9d6a0" stopOpacity="0" />
          <stop offset="0.85" stopColor="#e9d6a0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff4d6" stopOpacity="1" />
        </linearGradient>
        <clipPath id={`${p}-page`}>
          <rect x="0" y="0" width="176" height="262" rx="3" />
        </clipPath>
      </defs>

      <g transform="translate(36 38) rotate(-3)">
        <rect x="0" y="0" width="176" height="262" rx="3" fill={`url(#${p}-papier)`} />
        <text x="88" y="34" textAnchor="middle" fontSize="15" fill="#2a1d18" style={VOIX}>
          Carte des vins
        </text>
        <path d="M68 44 H108" stroke="#8f6a2a" strokeWidth={1} />
        {lignes.map((y, k) => (
          <g key={y} opacity={0.55}>
            <rect x="18" y={y} width={56 + ((k * 23) % 40)} height="4" rx="2" fill="#2a1d18" />
            <rect x="140" y={y} width="18" height="4" rx="2" fill="#2a1d18" />
            <rect x="18" y={y + 9} width={36 + ((k * 17) % 30)} height="3" rx="1.5" fill="#2a1d18" opacity={0.45} />
          </g>
        ))}
        <g clipPath={`url(#${p}-page)`}>
          <rect className="vg-balai" x="-10" y="-60" width="196" height="60" fill={`url(#${p}-balai)`} />
        </g>
      </g>

      {reconnus.map((r, k) => (
        <g key={k} className="vg-reconnu" style={rang(k)}>
          <path d={`M214 ${86 + k * 58} C238 ${86 + k * 58} 238 ${78 + k * 58} 256 ${78 + k * 58}`} {...TRAIT} opacity={0.5} strokeDasharray="2 4" />
          <rect x="258" y={58 + k * 58} width="186" height="42" rx="13" fill="rgb(241 234 220 / 0.06)" stroke="rgb(217 190 116 / 0.35)" strokeWidth={1} />
          <circle cx="278" cy={79 + k * 58} r="4.5" fill="currentColor" />
          <rect x="294" y={70 + k * 58} width={r.nom} height="5" rx="2.5" fill="#f1eadc" opacity={0.85} />
          <rect x="294" y={82 + k * 58} width={r.app} height="4" rx="2" fill="#f1eadc" opacity={0.35} />
          <rect x="414" y={74 + k * 58} width="18" height="5" rx="2.5" fill="currentColor" opacity={0.8} />
        </g>
      ))}
    </svg>
  );
}

/** II · Les plats : un fil d'or se tire de chaque assiette vers son vin. */
export function VignettePlats({ p = "vg" }: { p?: string }) {
  const paires = [
    { plat: "Saint-Jacques", vin: "Meursault", y: 70 },
    { plat: "Pigeon rôti", vin: "Pommard", y: 170 },
    { plat: "Tarte au citron", vin: "Jurançon", y: 270 },
  ];
  return (
    <svg viewBox="0 0 480 340" className="vg" data-vignette={p} aria-hidden focusable="false">
      {paires.map((p, k) => (
        <g key={p.plat} style={rang(k)}>
          <g className="vg-assiette">
            <circle cx="70" cy={p.y} r="34" {...TRAIT} fill="rgb(241 234 220 / 0.04)" />
            <circle cx="70" cy={p.y} r="22" {...TRAIT} opacity={0.5} />
            <text x="120" y={p.y + 5} fontSize="17" fontStyle="italic" fill="#f1eadc" style={VOIX}>
              {p.plat}
            </text>
          </g>
          <path
            className="vg-fil"
            d={`M248 ${p.y} C300 ${p.y} 318 ${p.y} 352 ${p.y}`}
            pathLength={1}
            {...TRAIT}
            strokeWidth={1.6}
          />
          <circle className="vg-noeud" cx="300" cy={p.y} r="4" fill="#e9d6a0" />
          <g className="vg-vin">
            <path
              d={`M374 ${p.y - 30} H382 V${p.y - 12} C382 ${p.y - 6} 392 ${p.y - 2} 392 ${p.y + 6} V${p.y + 28} C392 ${p.y + 31} 390 ${p.y + 32} 387 ${p.y + 32} H369 C366 ${p.y + 32} 364 ${p.y + 31} 364 ${p.y + 28} V${p.y + 6} C364 ${p.y - 2} 374 ${p.y - 6} 374 ${p.y - 12} Z`}
              {...TRAIT}
              fill="rgb(143 45 70 / 0.35)"
            />
            <text x="404" y={p.y + 6} fontSize="17" fill="#f1eadc" style={VOIX}>
              {p.vin}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}

/* Le motif du QR : trois repères et des modules, chacun avec son rang. */
const MODULES: [number, number][] = [
  [3, 0], [4, 1], [3, 2], [4, 3], [0, 3], [1, 4], [2, 3], [3, 4], [4, 4], [5, 3],
  [6, 4], [3, 5], [4, 6], [5, 5], [6, 6], [4, 5], [6, 3], [5, 4], [3, 6], [6, 5],
];

/** III · Le chevalet : le code s'assemble, puis un reflet passe. */
export function VignetteQr({ p = "vg" }: { p?: string }) {
  const x0 = 186;
  const y0 = 92;
  const m = 15.5;
  return (
    <svg viewBox="0 0 480 340" className="vg" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${p}-reflet`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff4d6" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${p}-chevalet`}>
          <path d="M150 306 L170 56 H310 L330 306 Z" />
        </clipPath>
      </defs>
      <path d="M40 310 H440" {...TRAIT} opacity={0.4} />
      <path d="M150 306 L170 56 H310 L330 306 Z" {...TRAIT} fill="rgb(241 234 220 / 0.05)" />
      {[
        [0, 0],
        [4.6, 0],
        [0, 4.6],
      ].map(([rx, ry], k) => (
        <g key={k} className="vg-module" style={rang(k)}>
          <rect x={x0 + rx * m} y={y0 + ry * m} width={m * 2.4} height={m * 2.4} rx={m * 0.4} {...TRAIT} />
          <rect x={x0 + rx * m + m * 0.75} y={y0 + ry * m + m * 0.75} width={m * 0.9} height={m * 0.9} fill="currentColor" />
        </g>
      ))}
      {MODULES.map(([cx, cy], k) => (
        <rect
          key={`${cx}-${cy}`}
          className="vg-module"
          style={rang(3 + ((k * 7) % MODULES.length))}
          x={x0 + cx * m + m * 0.15}
          y={y0 + cy * m + m * 0.15}
          width={m * 0.7}
          height={m * 0.7}
          fill="currentColor"
        />
      ))}
      <text x="240" y="244" textAnchor="middle" fontSize="15" fontStyle="italic" fill="#f1eadc" opacity={0.85} style={VOIX}>
        Votre accord, en un scan
      </text>
      <path d="M200 262 H280" {...TRAIT} opacity={0.4} />
      <g clipPath={`url(#${p}-chevalet)`}>
        <rect className="vg-reflet" x="60" y="40" width="70" height="280" fill={`url(#${p}-reflet)`} transform="skewX(-18)" />
      </g>
    </svg>
  );
}

/** IV · Le verre servi : le vin monte, la recommandation se pose. */
export function VignetteVerre({ p = "vg" }: { p?: string }) {
  return (
    <svg viewBox="0 0 480 340" className="vg" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${p}-vin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c54b63" stopOpacity="0.9" />
          <stop offset="1" stopColor="#5d1a33" />
        </linearGradient>
        <clipPath id={`${p}-calice`}>
          <path d="M108 60 C98 128 108 178 150 192 C192 178 202 128 192 60 Z" />
        </clipPath>
        <radialGradient id={`${p}-halo`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e8c88c" stopOpacity="0.3" />
          <stop offset="1" stopColor="#e8c88c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy="170" rx="140" ry="120" fill={`url(#${p}-halo)`} />
      <g clipPath={`url(#${p}-calice)`}>
        <rect className="vg-niveau" x="90" y="40" width="120" height="160" fill={`url(#${p}-vin)`} />
      </g>
      <path d="M108 60 C98 128 108 178 150 192 C192 178 202 128 192 60 Z" {...TRAIT} />
      <path d="M150 192 V280" {...TRAIT} />
      <ellipse cx="150" cy="284" rx="36" ry="7" {...TRAIT} />
      <path className="vg-eclat" d="M118 76 C113 104 115 132 124 152" {...TRAIT} opacity={0.6} />

      <g className="vg-note">
        <rect x="246" y="92" width="200" height="150" rx="20" fill="rgb(241 234 220 / 0.06)" stroke="rgb(217 190 116 / 0.4)" strokeWidth={1} />
        <text x="270" y="126" fontSize="12" fill="#8e897f" style={{ fontFamily: "var(--f-texte)" }}>
          Le vin conseillé
        </text>
        <text x="270" y="164" fontSize="30" fill="#f1eadc" style={VOIX}>
          Meursault
        </text>
        <text x="270" y="188" fontSize="12.5" fill="#d9be74" style={{ fontFamily: "var(--f-texte)" }}>
          Bourgogne blanc, 2020
        </text>
        <path d="M270 208 H420" stroke="rgb(241 234 220 / 0.15)" strokeWidth={1} />
        <rect x="270" y="220" width="120" height="4" rx="2" fill="#f1eadc" opacity={0.3} />
      </g>
    </svg>
  );
}
