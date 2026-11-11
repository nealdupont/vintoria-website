"use client";

import { useEffect, useRef } from "react";

/**
 * LE VIN, EN TEMPS RÉEL.
 *
 * Un nuanceur WebGL écrit à la main, sans bibliothèque : une surface de vin
 * qui tourne lentement dans le verre, comme quand on l'aère. La matière
 * vient d'un bruit fractal replié sur lui-même (domain warping) ; on en
 * tire une pente, donc une normale, donc une vraie lumière : le curseur
 * est une bougie tenue au-dessus du verre, et l'or s'allume sur les
 * crêtes qu'elle touche.
 *
 * Les quatre secondes d'arrivée sont « le service » : le vin tourne vite
 * comme versé à l'instant, puis se pose. Ensuite il ne fait plus que
 * respirer.
 *
 * SOBRE AVEC LA MACHINE. Rendu à demi-résolution (un liquide est flou par
 * nature, l'œil ne voit pas la différence), arrêté hors de l'écran et
 * onglet caché. En mouvement réduit : une seule image, fixe. Sans WebGL :
 * le fond CSS de l'ouverture prend le relais, et rien ne casse.
 */

const SOMMETS = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// tiret-ok : du code GLSL (des soustractions), jamais lu par un visiteur.
const FRAGMENTS = `
#extension GL_OES_standard_derivatives : enable
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTemps;
uniform vec2 uSouris;
uniform vec2 uFoyer;
uniform float uIntro;
uniform float uSortie;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float bruit(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * bruit(p);
    p = m * p * 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTemps;

  // Le tournoiement : le liquide pivote autour du foyer, comme dans un verre.
  vec2 c = p - uFoyer;
  float ang = 0.2 * t * (0.6 + 0.4 * exp(-dot(c, c) * 2.0));
  mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  vec2 s = rot * c + uFoyer;

  // De grands plis lents : deux replis du bruit sur lui-même.
  vec2 q = vec2(fbm(s * 0.85 + vec2(0.0, t * 0.3)), fbm(s * 0.85 + vec2(5.2, 1.3) - t * 0.25));
  vec2 r = vec2(fbm(s * 0.95 + 2.2 * q + vec2(1.7, 9.2) + t * 0.35), fbm(s * 0.95 + 2.2 * q + vec2(8.3, 2.8) - t * 0.27));
  vec2 base = s * 0.8 + 2.6 * r;
  float h = fbm(base);

  // La pente, mesurée de part et d'autre : une normale lisse, donc une
  // lumière qui glisse sur la matière comme sur un satin.
  float e = 0.015;
  float hx = fbm(base + vec2(e, 0.0));
  float hy = fbm(base + vec2(0.0, e));
  vec3 n = normalize(vec3(-(hx - h) / e * 0.85, -(hy - h) / e * 0.85, 1.0));

  // La bougie, tenue au-dessus de la surface.
  vec3 lum = vec3(uSouris, 0.62);
  vec3 L = normalize(lum - vec3(p, 0.0));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float nh = clamp(dot(n, H), 0.0, 1.0);
  float diffus = clamp(dot(n, L), 0.0, 1.0);
  float eclat = pow(nh, 64.0);
  float satin = pow(nh, 9.0);
  float rasant = pow(1.0 - clamp(n.z, 0.0, 1.0), 1.4);
  float proche = exp(-dot(p - uSouris, p - uSouris) * 4.0);

  vec3 nuit = vec3(0.039, 0.063, 0.125);
  vec3 profond = vec3(0.05, 0.008, 0.025);
  vec3 vin = vec3(0.27, 0.045, 0.11);
  vec3 grenat = vec3(0.52, 0.13, 0.22);
  vec3 or = vec3(0.93, 0.80, 0.52);

  vec3 col = mix(profond, vin, smoothstep(0.2, 0.75, h));
  col = mix(col, grenat, smoothstep(0.55, 0.9, h + 0.2 * r.x) * 0.45);
  col *= 0.38 + 0.9 * diffus;
  col += grenat * satin * 0.08;
  col += or * eclat * (0.42 + 0.6 * proche);
  col += grenat * rasant * 0.22;

  // La composition : le vin vit autour du foyer, la nuit garde la gauche.
  float d = length((p - uFoyer) * vec2(0.82, 1.0));
  float masque = 1.0 - smoothstep(0.22, 1.08, d);
  col = mix(nuit, col, masque * uIntro);

  col *= 1.0 - 0.6 * uSortie;
  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) * (2.5 / 255.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

function compiler(gl: WebGLRenderingContext, type: number, source: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("[liquide]", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

/* Départ rapide, longue résolution : le vin versé qui se pose. */
const versement = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);

export function Liquide({
  className = "",
  sortie,
  foyer: placement = "auto",
}: {
  className?: string;
  /** Lu à chaque image : la part de l'ouverture déjà quittée (0 à 1). */
  sortie?: React.RefObject<number>;
  /** « auto » suit la carte de l'ouverture ; « centre » remplit une fenêtre. */
  foyer?: "auto" | "centre";
}) {
  const toile = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = toile.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    if (!gl || !gl.getExtension("OES_standard_derivatives")) return;

    const vs = compiler(gl, gl.VERTEX_SHADER, SOMMETS);
    const fs = compiler(gl, gl.FRAGMENT_SHADER, FRAGMENTS);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    /* Un seul triangle qui couvre l'écran. */
    const tampon = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tampon);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (nom: string) => gl.getUniformLocation(prog, nom);
    const uRes = u("uRes");
    const uTemps = u("uTemps");
    const uSouris = u("uSouris");
    const uFoyer = u("uFoyer");
    const uIntro = u("uIntro");
    const uSortie = u("uSortie");

    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tactile = !window.matchMedia("(pointer: fine)").matches;

    /* La géométrie : le foyer suit la carte de l'accord (à droite sur un
       écran large, en bas sur un téléphone). */
    let largeur = 1;
    let hauteur = 1;
    let foyer: [number, number] = [0.3, -0.04];
    const dimensionner = () => {
      const r = canvas.getBoundingClientRect();
      const echelle = Math.min(window.devicePixelRatio || 1, 2) * (tactile ? 0.42 : 0.55);
      largeur = Math.max(1, Math.round(r.width * echelle));
      hauteur = Math.max(1, Math.round(r.height * echelle));
      canvas.width = largeur;
      canvas.height = hauteur;
      gl.viewport(0, 0, largeur, hauteur);
      const aspect = r.width / Math.max(r.height, 1);
      foyer =
        placement === "centre" ? [0, -0.08] : aspect > 1.05 ? [aspect * 0.22, -0.04] : [0, -0.3];
    };
    dimensionner();
    const observateur = new ResizeObserver(dimensionner);
    observateur.observe(canvas);

    /* La bougie : position visée, et position lissée qui la rejoint. */
    const vers: [number, number] = [0.45, 0.22];
    const souris: [number, number] = [0.45, 0.22];
    const bouger = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      vers[0] = (e.clientX - r.left - r.width / 2) / r.height;
      vers[1] = -(e.clientY - r.top - r.height / 2) / r.height;
    };
    if (!tactile && !reduit) window.addEventListener("pointermove", bouger, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !image) image = requestAnimationFrame(peindre);
    });
    io.observe(canvas);

    const depart = performance.now();
    let image = 0;
    let premiere = true;

    function peindre(maintenant: number) {
      image = 0;
      if (!gl) return;
      const s = (maintenant - depart) / 1000;
      /* Le service : quatre secondes de tournoiement rapide, puis le calme. */
      const temps = reduit ? 14 : 6 + s * 0.11 + 2.6 * versement(s / 4);
      const intro = reduit ? 1 : versement((s - 0.15) / 2.2);
      souris[0] += (vers[0] - souris[0]) * 0.05;
      souris[1] += (vers[1] - souris[1]) * 0.05;
      if (tactile && !reduit) {
        /* Sans souris, la bougie fait le tour du verre toute seule. */
        souris[0] = foyer[0] + Math.cos(s * 0.35) * 0.35;
        souris[1] = foyer[1] + 0.25 + Math.sin(s * 0.35) * 0.18;
      }
      gl.uniform2f(uRes, largeur, hauteur);
      gl.uniform1f(uTemps, temps);
      gl.uniform2f(uSouris, souris[0], souris[1]);
      gl.uniform2f(uFoyer, foyer[0], foyer[1]);
      gl.uniform1f(uIntro, intro);
      gl.uniform1f(uSortie, sortie?.current ?? 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (premiere) {
        premiere = false;
        canvas!.dataset.pret = "oui";
      }
      if (reduit) return;
      if (visible && !document.hidden) image = requestAnimationFrame(peindre);
    }

    const reprendre = () => {
      if (!document.hidden && visible && !image && !reduit) image = requestAnimationFrame(peindre);
    };
    document.addEventListener("visibilitychange", reprendre);
    image = requestAnimationFrame(peindre);

    return () => {
      if (image) cancelAnimationFrame(image);
      observateur.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", bouger);
      document.removeEventListener("visibilitychange", reprendre);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [sortie, placement]);

  return <canvas ref={toile} className={className} aria-hidden />;
}
