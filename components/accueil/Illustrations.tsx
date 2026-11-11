/**
 * LES ILLUSTRATIONS. Aucune capture d'écran : des objets de la salle et de
 * la cave, tracés au fil d'or. Un chevalet sur une table, un casier, une
 * carte imprimée. Le restaurateur reconnaît son monde avant de reconnaître
 * un logiciel.
 *
 * Une seule grammaire pour toutes : trait de 1,25 en couleur courante,
 * aplats de verre très légers, le vin seul en couleur.
 */

const TRAIT = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

/* ---------------------------------------------------------------- */
/* L'ouverture                                                       */
/* ---------------------------------------------------------------- */

/** La voûte de la cave : des arcs qui reculent, et les claveaux du premier. */
export function Voute({ className = "" }: { className?: string }) {
  const rayons = [780, 660, 545, 435, 330];
  const claveaux = Array.from({ length: 25 }, (_, k) => (Math.PI * (k + 0.5)) / 25);
  return (
    <svg viewBox="0 0 1600 900" className={className} aria-hidden focusable="false">
      {rayons.map((r, k) => (
        <path
          key={r}
          d={`M${800 - r} 900 A${r} ${r} 0 0 1 ${800 + r} 900`}
          {...TRAIT}
          opacity={1 - k * 0.16}
        />
      ))}
      <path d="M60 900 A740 740 0 0 1 1540 900" {...TRAIT} opacity={0.7} />
      {claveaux.map((a) => (
        <line
          key={a}
          x1={800 - Math.cos(a) * 740}
          y1={900 - Math.sin(a) * 740}
          x2={800 - Math.cos(a) * 780}
          y2={900 - Math.sin(a) * 780}
          {...TRAIT}
          opacity={0.6}
        />
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* En salle                                                          */
/* ---------------------------------------------------------------- */

/* Un motif de QR stylisé : trois repères et des modules fixes. */
const MODULES = [
  [3, 0], [4, 1], [3, 2], [4, 3], [0, 3], [1, 4], [2, 3], [3, 4], [4, 4], [5, 3],
  [6, 4], [3, 5], [4, 6], [5, 5], [6, 6], [4, 5], [6, 3], [5, 4],
];

function Qr({ x, y, taille }: { x: number; y: number; taille: number }) {
  const m = taille / 7;
  const repere = (rx: number, ry: number) => (
    <g key={`${rx}${ry}`}>
      <rect x={x + rx * m} y={y + ry * m} width={m * 2.4} height={m * 2.4} rx={m * 0.4} {...TRAIT} />
      <rect x={x + rx * m + m * 0.75} y={y + ry * m + m * 0.75} width={m * 0.9} height={m * 0.9} fill="currentColor" />
    </g>
  );
  return (
    <g>
      {repere(0, 0)}
      {repere(4.6, 0)}
      {repere(0, 4.6)}
      {MODULES.map(([cx, cy], k) => (
        <rect
          key={`${cx}-${cy}`}
          className="il-qr"
          style={{ "--k": (k * 7) % MODULES.length } as React.CSSProperties}
          x={x + cx * m + m * 0.15}
          y={y + cy * m + m * 0.15}
          width={m * 0.7}
          height={m * 0.7}
          fill="currentColor"
          opacity={0.85}
        />
      ))}
    </g>
  );
}

/** Une table dressée : l'assiette, le chevalet au QR, le verre servi. */
export function Table() {
  return (
    <svg viewBox="0 0 420 250" aria-hidden focusable="false">
      <defs>
        <linearGradient id="tb-vin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c54b63" stopOpacity="0.85" />
          <stop offset="1" stopColor="#5d1a33" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="tb-lueur" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e8c88c" stopOpacity="0.28" />
          <stop offset="1" stopColor="#e8c88c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="215" cy="150" rx="190" ry="80" fill="url(#tb-lueur)" />
      {/* La table */}
      <path d="M10 206 H410" {...TRAIT} opacity={0.55} />
      <path d="M40 214 H380" {...TRAIT} opacity={0.2} />
      {/* L'assiette */}
      <ellipse cx="92" cy="198" rx="70" ry="11" {...TRAIT} />
      <ellipse cx="92" cy="196" rx="44" ry="6.5" {...TRAIT} opacity={0.6} />
      <path d="M70 193 C80 186 104 186 114 193" {...TRAIT} opacity={0.7} />
      {/* Le chevalet */}
      <path d="M176 204 L190 74 H252 L266 204" {...TRAIT} fill="rgb(241 234 220 / 0.05)" />
      <path d="M190 74 L196 70 H246 L252 74" {...TRAIT} opacity={0.6} />
      <Qr x={199} y={96} taille={44} />
      <path d="M200 162 H242" {...TRAIT} opacity={0.6} />
      <path d="M206 172 H236" {...TRAIT} opacity={0.35} />
      {/* Le verre servi */}
      <path d="M318 90 C312 126 318 152 342 160 C366 152 372 126 366 90 Z" {...TRAIT} fill="rgb(241 234 220 / 0.04)" />
      <path className="il-vin" d="M314.6 120 C317 144 326 154 342 159.5 C358 154 367 144 369.4 120 Z" fill="url(#tb-vin)" />
      <path d="M342 160 V200" {...TRAIT} />
      <ellipse cx="342" cy="202" rx="20" ry="4" {...TRAIT} />
      <path d="M325 98 C322 112 323 124 328 134" {...TRAIT} opacity={0.5} />
    </svg>
  );
}

/** La bouteille réservée depuis la table. */
export function Reservation() {
  return (
    <svg viewBox="0 0 230 150" aria-hidden focusable="false">
      <path
        d="M58 8 H72 V40 C72 50 90 56 90 72 V140 C90 144 87 146 83 146 H47 C43 146 40 144 40 140 V72 C40 56 58 50 58 40 Z"
        {...TRAIT}
        fill="rgb(47 93 78 / 0.25)"
      />
      <rect x="46" y="92" width="38" height="30" rx="2" {...TRAIT} opacity={0.7} />
      <path d="M52 102 H78 M56 110 H74" {...TRAIT} opacity={0.5} />
      <path d="M58 16 H72" {...TRAIT} opacity={0.6} />
      {/* L'étiquette de réservation */}
      <path d="M72 30 C98 26 112 38 126 52" {...TRAIT} opacity={0.6} strokeDasharray="2 4" />
      <g className="il-etiquette">
      <g transform="rotate(-8 170 66)">
        <rect x="124" y="44" width="92" height="44" rx="10" {...TRAIT} fill="rgb(201 165 78 / 0.1)" />
        <circle cx="132" cy="66" r="3" {...TRAIT} />
        <path d="M144 66 L151 73 L164 58" {...TRAIT} strokeWidth={1.6} />
        <path d="M174 61 H204 M174 71 H196" {...TRAIT} opacity={0.6} />
      </g>
      </g>
    </svg>
  );
}

/** Les langues : une illustration faite de mots, en HTML pour rester net. */
export function Langues() {
  const mots = [
    { m: "Bonsoir", x: "0%", y: "6%", t: "2.6rem", o: 0.95 },
    { m: "Good evening", x: "34%", y: "40%", t: "1.5rem", o: 0.55 },
    { m: "Buona sera", x: "4%", y: "64%", t: "1.35rem", o: 0.4 },
    { m: "Guten Abend", x: "52%", y: "4%", t: "1.15rem", o: 0.35 },
    { m: "Buenas noches", x: "56%", y: "74%", t: "1.1rem", o: 0.3 },
  ];
  return (
    <div className="langues" aria-hidden>
      {mots.map((w, k) => (
        <span key={w.m} style={{ left: w.x, top: w.y, fontSize: w.t, "--o": w.o, "--k": k } as React.CSSProperties}>
          {w.m}
        </span>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* En cave                                                           */
/* ---------------------------------------------------------------- */

/**
 * Le casier, vu de face : des culs de bouteilles. Les pleins sont dorés,
 * deux cases se vident (l'alerte, en vin), quelques-unes sont libres.
 */
export function Casier() {
  const colonnes = 8;
  const rangs = 5;
  const alerte = new Set(["2-5", "3-1"]);
  const libres = new Set(["0-6", "1-2", "4-7", "4-3", "2-0"]);
  const cases = [];
  for (let r = 0; r < rangs; r++) {
    for (let c = 0; c < colonnes; c++) {
      const cle = `${r}-${c}`;
      const cx = 40 + c * 46 + (r % 2 ? 23 : 0);
      const cy = 46 + r * 40;
      if (cx > 390) continue;
      if (libres.has(cle)) {
        cases.push(<circle key={cle} cx={cx} cy={cy} r="15" {...TRAIT} opacity={0.22} strokeDasharray="2 4" />);
        continue;
      } else if (alerte.has(cle)) {
        cases.push(
          <g key={cle} className="il-alerte">
            <circle className="il-alerte-halo" cx={cx} cy={cy} r="21" fill="#c54b63" opacity={0.16} />
            <circle cx={cx} cy={cy} r="15" fill="none" stroke="#e07a92" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            <circle cx={cx} cy={cy} r="5.5" fill="#e07a92" opacity={0.75} />
          </g>,
        );
      } else {
        cases.push(
          <g key={cle} className="il-case" style={{ "--k": r + c } as React.CSSProperties}>
            <circle cx={cx} cy={cy} r="15" {...TRAIT} fill="rgb(201 165 78 / 0.1)" />
            <circle cx={cx} cy={cy} r="6" {...TRAIT} opacity={0.65} />
          </g>,
        );
      }
    }
  }
  return (
    <svg viewBox="0 0 420 240" aria-hidden focusable="false">
      <defs>
        <radialGradient id="cs-lueur" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#a9c9b6" stopOpacity="0.16" />
          <stop offset="1" stopColor="#a9c9b6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="420" height="240" fill="url(#cs-lueur)" />
      <rect x="14" y="14" width="392" height="212" rx="6" {...TRAIT} opacity={0.35} />
      {cases}
    </svg>
  );
}

/** La valeur de la cave : un cadran, une aiguille. Aucun chiffre inventé. */
export function Cadran() {
  const graduations = Array.from({ length: 21 }, (_, k) => Math.PI + (Math.PI * k) / 20);
  const aiguille = Math.PI + Math.PI * 0.68;
  return (
    <svg viewBox="0 0 220 130" aria-hidden focusable="false">
      <path d="M20 118 A90 90 0 0 1 200 118" {...TRAIT} opacity={0.35} />
      <path className="il-arc" d="M20 118 A90 90 0 0 1 166 65" pathLength={1} {...TRAIT} strokeWidth={2} />
      {graduations.map((a, k) => (
        <line
          key={a}
          x1={110 + Math.cos(a) * 76}
          y1={118 + Math.sin(a) * 76}
          x2={110 + Math.cos(a) * (k % 5 === 0 ? 64 : 70)}
          y2={118 + Math.sin(a) * (k % 5 === 0 ? 64 : 70)}
          {...TRAIT}
          opacity={k % 5 === 0 ? 0.8 : 0.4}
        />
      ))}
      <line className="il-aiguille" x1="110" y1="118" x2={110 + Math.cos(aiguille) * 58} y2={118 + Math.sin(aiguille) * 58} {...TRAIT} strokeWidth={1.8} />
      <circle cx="110" cy="118" r="5" fill="currentColor" />
    </svg>
  );
}

/** L'application mobile : un téléphone et les tâches du jour. */
export function Telephone() {
  const lignes = [0, 1, 2];
  return (
    <svg viewBox="0 0 200 180" aria-hidden focusable="false">
      <rect x="54" y="4" width="92" height="170" rx="16" {...TRAIT} fill="rgb(241 234 220 / 0.04)" />
      <path d="M86 14 H114" {...TRAIT} opacity={0.5} />
      <path d="M66 34 H106" {...TRAIT} strokeWidth={2} />
      {lignes.map((k) => (
        <g key={k} transform={`translate(0 ${k * 30})`} className="il-tache" style={{ "--k": k } as React.CSSProperties}>
          <rect x="64" y="50" width="72" height="22" rx="7" {...TRAIT} opacity={0.45} />
          <circle cx="76" cy="61" r="5" {...TRAIT} fill={k === 0 ? "currentColor" : "none"} />
          {k === 0 ? <path d="M73.5 61 L75.5 63 L79 59" stroke="#0a1020" strokeWidth={1.4} fill="none" /> : null}
          <path d={`M88 58 H${k === 1 ? 126 : 120} M88 65 H${k === 2 ? 106 : 112}`} {...TRAIT} opacity={0.55} />
        </g>
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* Sur la carte                                                      */
/* ---------------------------------------------------------------- */

/** Une rangée de la carte : le nom, les points de conduite, le prix. */
function Rangee({ y, nom, prix }: { y: number; nom: number; prix: number }) {
  return (
    <g>
      <rect x="0" y={y} width={nom} height="4" rx="2" fill="#2a1d18" opacity={0.55} />
      <path d={`M${nom + 6} ${y + 3} H${148 - prix - 6}`} stroke="#2a1d18" strokeWidth={1} strokeDasharray="1 3" opacity={0.4} />
      <rect x={148 - prix} y={y} width={prix} height="4" rx="2" fill="#2a1d18" opacity={0.55} />
      <rect x="0" y={y + 8} width={nom * 0.7} height="3" rx="1.5" fill="#2a1d18" opacity={0.22} />
    </g>
  );
}

function Page({
  x,
  y,
  angle,
  titre,
  sections,
}: {
  x: number;
  y: number;
  angle: number;
  titre: boolean;
  sections: { nom: string; rangs: [number, number][] }[];
}) {
  /* La hauteur où commence chaque section, calculée d'avance. */
  const debuts = sections.reduce<number[]>(
    (acc, s, k) => [...acc, k === 0 ? (titre ? 64 : 22) : acc[k - 1] + 24 + sections[k - 1].rangs.length * 20],
    [],
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x="0" y="0" width="190" height="252" rx="3" fill="url(#cv-papier)" />
      <rect x="0" y="0" width="190" height="252" rx="3" fill="none" stroke="#000" strokeOpacity={0.15} />
      <g transform="translate(21 0)">
        {titre ? (
          <>
            <text x="74" y="34" textAnchor="middle" fontSize="15" fill="#2a1d18" style={{ fontFamily: "var(--f-voix)" }}>
              Carte des vins
            </text>
            <path d="M54 44 H94" stroke="#8f6a2a" strokeWidth={1} />
          </>
        ) : null}
        {sections.map((s, n) => {
          const debut = debuts[n];
          return (
            <g key={s.nom}>
              <text x="0" y={debut} fontSize="10" fontStyle="italic" fill="#8f2d46" style={{ fontFamily: "var(--f-voix)" }}>
                {s.nom}
              </text>
              {s.rangs.map(([n, p], k) => (
                <Rangee key={k} y={debut + 10 + k * 20} nom={n} prix={p} />
              ))}
            </g>
          );
        })}
      </g>
    </g>
  );
}

/** La carte des vins imprimée : deux pages, comme on les pose sur la table. */
export function CarteImprimee() {
  return (
    <svg viewBox="0 0 440 300" aria-hidden focusable="false">
      <defs>
        <linearGradient id="cv-papier" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6efe2" />
          <stop offset="1" stopColor="#e6dac5" />
        </linearGradient>
        <filter id="cv-ombre" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter="url(#cv-ombre)">
        <g className="il-page-arriere">
        <Page
          x={196}
          y={30}
          angle={6}
          titre={false}
          sections={[
            { nom: "Rouges", rangs: [[70, 14], [88, 14], [62, 14], [80, 18]] },
            { nom: "Liquoreux", rangs: [[74, 14], [58, 14]] },
          ]}
        />
        </g>
        <g className="il-page-avant">
        <Page
          x={56}
          y={18}
          angle={-4}
          titre
          sections={[
            { nom: "Champagnes", rangs: [[82, 14], [66, 14]] },
            { nom: "Blancs", rangs: [[60, 14], [86, 18], [72, 14], [64, 14]] },
          ]}
        />
        </g>
      </g>
    </svg>
  );
}

/** Les analyses : une courbe, un point qui ressort. Pas d'axe chiffré. */
export function Courbe() {
  const points = [
    [10, 112],
    [58, 96],
    [106, 104],
    [154, 72],
    [202, 80],
    [250, 44],
  ];
  const d = points.map(([x, y], k) => `${k ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <svg viewBox="0 0 260 130" aria-hidden focusable="false">
      <defs>
        <linearGradient id="cb-aire" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9a54e" stopOpacity="0.28" />
          <stop offset="1" stopColor="#c9a54e" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[30, 60, 90].map((y) => (
        <path key={y} d={`M0 ${y} H260`} {...TRAIT} opacity={0.12} />
      ))}
      <path d="M0 124 H260" {...TRAIT} opacity={0.35} />
      <path className="il-aire" d={`${d} L250 124 L10 124 Z`} fill="url(#cb-aire)" />
      <path className="il-courbe" d={d} pathLength={1} {...TRAIT} strokeWidth={1.6} />
      {points.map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3" fill="#0a1020" stroke="currentColor" strokeWidth={1.25} />
      ))}
      <path d="M250 44 V124" {...TRAIT} strokeDasharray="2 4" opacity={0.5} />
      <circle className="il-pouls" cx="250" cy="44" r="9" fill="currentColor" opacity={0.2} />
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* Petits pictogrammes                                               */
/* ---------------------------------------------------------------- */

export function Coche({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden focusable="false">
      <circle cx="10" cy="10" r="8.5" {...TRAIT} opacity={0.45} />
      <path d="M6.2 10.3 L8.8 12.8 L13.9 7.4" {...TRAIT} strokeWidth={1.5} />
    </svg>
  );
}

type Picto = "bistrot" | "gastronomie" | "hotel" | "groupe" | "vente" | "equipe" | "cave" | "temps" | "image" | "sommelier";

/** Les pictogrammes des bénéfices et des profils. */
export function Pictogramme({ nom, className = "" }: { nom: Picto; className?: string }) {
  const contenu: Record<Picto, React.ReactNode> = {
    bistrot: (
      <>
        <path d="M8 6 C7 12 8 16 13 17 C18 16 19 12 18 6 Z" {...TRAIT} />
        <path d="M13 17 V25 M9 25 H17" {...TRAIT} />
        <ellipse cx="28" cy="24" rx="9" ry="2.5" {...TRAIT} />
        <path d="M24 22 C25 18 31 18 32 22" {...TRAIT} />
      </>
    ),
    gastronomie: (
      <>
        <path d="M6 24 C6 15 12 10 20 10 C28 10 34 15 34 24 Z" {...TRAIT} />
        <path d="M3 27 H37 M20 7 V10" {...TRAIT} />
        <circle cx="20" cy="6" r="1.5" {...TRAIT} />
      </>
    ),
    hotel: (
      <>
        <circle cx="13" cy="15" r="6" {...TRAIT} />
        <circle cx="13" cy="15" r="2" {...TRAIT} />
        <path d="M18 18 L32 30 M27 26 L30 23 M30 28 L33 25" {...TRAIT} />
      </>
    ),
    groupe: (
      <>
        <path d="M12 30 C12 30 4 21 4 15 A8 8 0 0 1 20 15 C20 21 12 30 12 30 Z" {...TRAIT} />
        <circle cx="12" cy="15" r="2.5" {...TRAIT} />
        <path d="M28 33 C28 33 22 26 22 21.5 A6 6 0 0 1 34 21.5 C34 26 28 33 28 33 Z" {...TRAIT} opacity={0.6} />
      </>
    ),
    vente: (
      <>
        <path d="M5 30 L14 20 L20 25 L33 10" {...TRAIT} />
        <path d="M26 10 H33 V17" {...TRAIT} />
      </>
    ),
    equipe: (
      <>
        <circle cx="14" cy="13" r="5" {...TRAIT} />
        <path d="M5 31 C5 24 9 20 14 20 C19 20 23 24 23 31" {...TRAIT} />
        <circle cx="27" cy="15" r="4" {...TRAIT} opacity={0.6} />
        <path d="M25 21 C30 21 34 24 34 30" {...TRAIT} opacity={0.6} />
      </>
    ),
    cave: (
      <>
        <path d="M4 33 V18 A16 16 0 0 1 36 18 V33" {...TRAIT} />
        <circle cx="13" cy="25" r="3.5" {...TRAIT} />
        <circle cx="20" cy="25" r="3.5" {...TRAIT} />
        <circle cx="27" cy="25" r="3.5" {...TRAIT} />
        <circle cx="16.5" cy="18.5" r="3.5" {...TRAIT} />
        <circle cx="23.5" cy="18.5" r="3.5" {...TRAIT} />
      </>
    ),
    temps: (
      <>
        <circle cx="20" cy="20" r="14" {...TRAIT} />
        <path d="M20 11 V20 L26 24" {...TRAIT} />
      </>
    ),
    image: (
      <>
        <rect x="9" y="5" width="22" height="30" rx="2" {...TRAIT} />
        <path d="M14 12 H26 M14 18 H24 M14 23 H26 M14 28 H21" {...TRAIT} opacity={0.6} />
      </>
    ),
    sommelier: (
      <>
        <circle cx="20" cy="22" r="9" {...TRAIT} />
        <path d="M11 22 H29" {...TRAIT} opacity={0.5} />
        <path d="M20 13 V5 M15 5 H25" {...TRAIT} />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden focusable="false">
      {contenu[nom]}
    </svg>
  );
}
