import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  HAUTEUR_MIN_HORIZONTAL,
  LOCKUP_HORIZONTAL,
  WORDMARK_MIN,
} from "../lib/marque";

/**
 * LA MARQUE VINTORIA 2026 — ce que ce site doit à vintoria-brand.
 *
 * Les jetons synchronisés (app/marque/vintoria.css) sont la référence : ces
 * tests les lisent tels quels, ils ne recopient aucune valeur.
 */

const CSS = readFileSync(
  join(__dirname, "..", "app", "marque", "vintoria.css"),
  "utf8",
);

/** La valeur d'un jeton de la marque, telle que synchronisée. */
function jeton(nom: string): string {
  const m = CSS.match(new RegExp(`--vintoria-${nom}:\\s*([^;]+);`));
  if (!m) throw new Error(`jeton absent : --vintoria-${nom}`);
  return m[1].trim();
}

const pct = (nom: string) => Number.parseFloat(jeton(nom)) / 100;

function rgb(hex: string): string {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16));
  return `rgb(${r}, ${g}, ${b})`;
}

test.describe("Le lockup suit la géométrie publiée", () => {
  test("les constantes du seuil des 80 px sont celles des jetons", () => {
    const [a, b] = jeton("lockup-horizontal-ratio")
      .split("/")
      .map((n) => Number.parseFloat(n));
    expect(LOCKUP_HORIZONTAL.ratio).toBeCloseTo(a / b, 6);
    expect(LOCKUP_HORIZONTAL.wordmarkL).toBeCloseTo(
      pct("lockup-horizontal-wordmark-l"),
      6,
    );
    // Au seuil, le wordmark fait bien ses 80 px ; un pixel plus bas, non.
    const l = (h: number) =>
      h * LOCKUP_HORIZONTAL.ratio * LOCKUP_HORIZONTAL.wordmarkL;
    expect(l(HAUTEUR_MIN_HORIZONTAL)).toBeGreaterThanOrEqual(WORDMARK_MIN);
    expect(l(HAUTEUR_MIN_HORIZONTAL - 1)).toBeLessThan(WORDMARK_MIN);
  });

  async function verifierLockups(page: Page) {
    const mesures = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("[data-lockup]")]
        .filter((e) => e.getClientRects().length > 0)
        .map((cadre) => {
          const c = cadre.getBoundingClientRect();
          const boite = (sel: string) => {
            const r = cadre.querySelector(sel)!.getBoundingClientRect();
            return {
              x: (r.left - c.left) / c.width,
              y: (r.top - c.top) / c.height,
              l: r.width / c.width,
              h: r.height / c.height,
              largeur: r.width,
            };
          };
          return {
            forme: cadre.dataset.lockup!,
            largeur: c.width,
            hauteur: c.height,
            symbole: boite('[data-element="symbole"]'),
            wordmark: boite('[data-element="wordmark"]'),
          };
        }),
    );
    expect(mesures.length, "aucun lockup visible").toBeGreaterThan(0);
    for (const m of mesures) {
      const [a, b] = jeton(`lockup-${m.forme}-ratio`)
        .split("/")
        .map((n) => Number.parseFloat(n));
      expect(m.largeur / m.hauteur, `ratio du cadre ${m.forme}`).toBeCloseTo(
        a / b,
        1,
      );
      for (const el of ["symbole", "wordmark"] as const) {
        for (const axe of ["x", "y", "l", "h"] as const) {
          const attendu = pct(`lockup-${m.forme}-${el}-${axe}`);
          // Au pixel près : la tolérance est d'un pixel du cadre.
          const tol =
            (axe === "x" || axe === "l" ? 1 / m.largeur : 1 / m.hauteur) + 1e-3;
          expect(
            Math.abs(m[el][axe] - attendu),
            `${m.forme} · ${el}.${axe} = ${m[el][axe].toFixed(4)}, jeton ${attendu}`,
          ).toBeLessThanOrEqual(tol);
        }
      }
      expect(
        m.wordmark.largeur,
        "le wordmark passe sous sa largeur minimale",
      ).toBeGreaterThanOrEqual(WORDMARK_MIN - 0.5);
    }
  }

  for (const route of ["/", "/tarifs"]) {
    test(`${route} — en-tête et pied aux boîtes officielles`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route);
      await verifierLockups(page);
      await page.locator("footer").scrollIntoViewIfNeeded();
      await verifierLockups(page);
    });
  }

  test("la bonne variante sur le bon fond", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const [route, symbole, wordmark] of [
      ["/", "/marque/symbole.png", "wordmark-bordeaux.svg"],
      ["/tarifs", "symbole-tonal-creme.png", "wordmark-creme.svg"],
    ] as const) {
      await page.goto(route);
      const srcs = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("[data-lockup]")]
          .filter((e) => e.getClientRects().length > 0)
          .map((e) =>
            [...e.querySelectorAll("img")].map((i) =>
              decodeURIComponent(i.currentSrc || i.src),
            ),
          ),
      );
      expect(srcs.length).toBeGreaterThan(0);
      for (const [s, w] of srcs) {
        expect(s, `${route} : symbole`).toContain(symbole);
        expect(w, `${route} : wordmark`).toContain(wordmark);
      }
    }
  });
});

test.describe("Thèmes : la crème à l'accueil, la nuit le soir", () => {
  test("la barre du navigateur suit le thème de la route", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      jeton("creme-fond"),
    );
    await page.goto("/tarifs");
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      jeton("nuit-fond"),
    );
  });

  test("l'action principale est le bordeaux de marque, partout", async ({
    page,
  }) => {
    for (const route of ["/", "/tarifs", "/demonstration"]) {
      await page.goto(route);
      const boutons = await page.evaluate(() =>
        [...document.querySelectorAll(".bouton-primaire")]
          .filter((e) => e.getClientRects().length > 0)
          .map((e) => {
            const s = getComputedStyle(e);
            return { fond: s.backgroundColor, texte: s.color };
          }),
      );
      expect(boutons.length, `${route} : aucun bouton primaire`).toBeGreaterThan(
        0,
      );
      for (const b of boutons) {
        expect(b.fond, route).toBe(rgb(jeton("creme-action")));
        expect(b.texte, route).toBe(rgb(jeton("creme-sur-action")));
      }
    }
  });

  test("l'anneau de focus est le rôle `focus`, jamais l'or", async ({
    page,
  }) => {
    for (const [route, focus] of [
      ["/", jeton("creme-focus")],
      ["/tarifs", jeton("nuit-focus")],
    ] as const) {
      await page.goto(route);
      await page.keyboard.press("Tab");
      const lien = page.getByRole("link", { name: "Aller au contenu" });
      await expect(lien).toBeFocused();
      expect(
        await lien.evaluate((e) => getComputedStyle(e).outlineColor),
        route,
      ).toBe(rgb(focus));
    }
  });
});

test.describe("Aucune trace de l'ancienne identité", () => {
  /** L'or, le laiton et la lie de l'ancien système (vintoria-brand, docs/02). */
  const INTERDITS = ["#D4B96A", "#C9A94E", "#C9A54E", "#C9A96E", "#6B1D38"];

  for (const route of ["/", "/tarifs", "/demonstration"]) {
    test(`${route} — ni or ni ancien bordeaux dans le rendu`, async ({
      page,
    }) => {
      await page.goto(route);
      const trouves = await page.evaluate((interdits) => {
        const cibles = interdits.map((h) => {
          const n = h.replace("#", "");
          return [0, 2, 4].map((i) => Number.parseInt(n.slice(i, i + 2), 16));
        });
        const proche = (c: string) => {
          const m = c.match(/rgba?\(([^)]+)\)/);
          if (!m) return false;
          const v = m[1].split(/[ ,/]+/).map(Number);
          if (v.length > 3 && v[3] === 0) return false;
          return cibles.some((t) => t.every((x, i) => Math.abs(v[i] - x) < 6));
        };
        const props = [
          "color",
          "backgroundColor",
          "borderTopColor",
          "outlineColor",
          "fill",
          "stroke",
        ] as const;
        const out: string[] = [];
        for (const e of document.querySelectorAll("body *")) {
          const s = getComputedStyle(e);
          for (const p of props) {
            if (proche(s[p] as string)) out.push(`${e.tagName}.${p}=${s[p]}`);
          }
          if (/rgba?\(\s*(201|212),\s*(169|185)/.test(s.backgroundImage))
            out.push(`${e.tagName}.backgroundImage`);
        }
        return out;
      }, INTERDITS);
      expect(trouves, trouves.join(" | ")).toEqual([]);
    });

    test(`${route} — Bodoni Moda et Schibsted Grotesk, rien d'autre`, async ({
      page,
    }) => {
      await page.goto(route);
      const familles = await page.evaluate(() => {
        const f = new Set<string>();
        for (const e of document.querySelectorAll("body, body *"))
          f.add(getComputedStyle(e).fontFamily);
        return [...f].join(" || ");
      });
      expect(familles).toMatch(/Bodoni Moda/);
      expect(familles).toMatch(/Schibsted Grotesk/);
      expect(familles).not.toMatch(/Spectral|Archivo|Jost|Libre Franklin/);
      await document_fonts_charges(page);
    });
  }
});

async function document_fonts_charges(page: Page) {
  const ok = await page.evaluate(async () => {
    await document.fonts.ready;
    return (
      document.fonts.check('400 48px "Bodoni Moda"') ||
      [...document.fonts].some((f) => /Bodoni/.test(f.family))
    );
  });
  expect(ok, "Bodoni Moda n'est pas chargée").toBe(true);
}

test.describe("Les titres de l'accueil, en Bodoni d'affichage", () => {
  test("la strophe est en Regular, axe optique actif", async ({ page }) => {
    await page.goto("/");
    const s = await page.evaluate(() => {
      const h = getComputedStyle(document.querySelector("h1")!);
      return {
        poids: h.fontWeight,
        optique: h.getPropertyValue("font-optical-sizing"),
      };
    });
    expect(s.poids).toBe("400");
    expect(s.optique).toBe("auto");
  });
});

test.describe("Le texte de l'accueil se lit sur le fond RÉELLEMENT peint", () => {
  test.use({ reducedMotion: "reduce" });

  /*
    LA SONDE. On relève la couleur de chaque texte, puis on rend tout le
    texte transparent et on photographie la page, ÉCRAN PAR ÉCRAN : les
    pixels sous chaque nœud sont le fond réellement peint — dégradés, flaques
    en `multiply`, grain compris. Le calcul sur jetons seuls ne verrait pas
    une flaque passer sous une ligne de texte.

    Pas de capture pleine page : elle agrandit la fenêtre à toute la hauteur
    du document, ce qui change les hauteurs en `svh` et décroche les
    éléments collants — on mesurerait une autre page que celle qu'on voit.
  */
  // À la largeur de chaque projet : 1280 × 720 (bureau) et 390 × 844 (mobile).
  test("tout texte atteint AA sur les pixels qui sont sous lui", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    // Chaque section entre une fois dans le champ : les arrivées se posent.
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 500) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(60);
    }

    // Les couleurs, relevées AVANT de rendre le texte transparent.
    const nombre = await page.evaluate(() => {
      let n = 0;
      const visite = (e: Element) => {
        if (e.closest("[aria-hidden='true'], .objet, img, svg, .sr-only"))
          return;
        const propre = [...e.childNodes].some(
          (c) => c.nodeType === 3 && (c.textContent ?? "").trim().length > 0,
        );
        if (propre) {
          const s = getComputedStyle(e);
          e.setAttribute("data-sonde", s.color);
          e.setAttribute(
            "data-sonde-grand",
            String(
              Number.parseFloat(s.fontSize) >= 24 ||
                (Number.parseFloat(s.fontSize) >= 18.66 &&
                  Number(s.fontWeight) >= 700),
            ),
          );
          n++;
        }
        for (const c of e.children) visite(c);
      };
      visite(document.querySelector("main")!);
      visite(document.querySelector("footer")!);
      return n;
    });
    expect(nombre).toBeGreaterThan(20);

    await page.addStyleTag({
      content:
        "main *, main *::before, main *::after, footer *, footer *::before, footer *::after { color: transparent !important; caret-color: transparent !important; text-shadow: none !important; }",
    });

    const echecs = new Set<string>();
    const mesures = new Set<string>();
    const vue = await page.evaluate(() => window.innerHeight);
    for (let y = 0; y < h + vue; y += Math.floor(vue * 0.6)) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(200);
      const image = await page.screenshot({ type: "png" });
      const res = await page.evaluate(
        async ({ b64 }) => {
          const img = new Image();
          img.src = `data:image/png;base64,${b64}`;
          await img.decode();
          const toile = document.createElement("canvas");
          toile.width = img.naturalWidth;
          toile.height = img.naturalHeight;
          const ctx = toile.getContext("2d", { willReadFrequently: true })!;
          ctx.drawImage(img, 0, 0);
          const k = img.naturalWidth / window.innerWidth;
          const lin = (v: number) => {
            const c = v / 255;
            return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
          };
          const lum = ([r, g, b]: number[]) =>
            0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
          const rapport = (a: number[], b: number[]) => {
            const [x, z] = [lum(a), lum(b)].sort((m, n) => n - m);
            return (x + 0.05) / (z + 0.05);
          };
          // L'en-tête fixe recouvre le haut de l'écran : on ne mesure pas
          // ce qui passe dessous.
          const haut = document.querySelector("header")!.getBoundingClientRect()
            .bottom;
          const out: { cle: string; echec?: string }[] = [];
          document.querySelectorAll<HTMLElement>("[data-sonde]").forEach((e, i) => {
            const r = e.getBoundingClientRect();
            if (r.width === 0 || r.top < haut + 2 || r.bottom > window.innerHeight - 2)
              return;
            let opacite = 1;
            for (let a: Element | null = e; a; a = a.parentElement)
              opacite *= Number(getComputedStyle(a).opacity);
            if (opacite < 0.9 || getComputedStyle(e).visibility === "hidden")
              return;
            const fg = (e.dataset.sonde!.match(/[\d.]+/g) ?? [])
              .slice(0, 3)
              .map(Number);
            const seuil = e.dataset.sondeGrand === "true" ? 3 : 4.5;
            let pire = Infinity;
            for (const fx of [0.1, 0.3, 0.5, 0.7, 0.9])
              for (const fy of [0.3, 0.5, 0.7]) {
                const px = r.left + r.width * fx;
                const py = r.top + r.height * fy;
                // Un texte RECOUVERT (l'écran collant du petit format, sous
                // lequel le texte défile à dessein) n'est pas lu à cet endroit.
                const dessus = document.elementFromPoint(px, py);
                if (!dessus || !(e === dessus || e.contains(dessus))) continue;
                // Moyenne d'une zone de 4 × 4 px CSS : le grain est une
                // texture, l'œil en lit la moyenne, pas un pixel isolé.
                const cote = Math.max(1, Math.round(4 * k));
                const d = ctx.getImageData(
                  Math.floor(px * k) - (cote >> 1),
                  Math.floor(py * k) - (cote >> 1),
                  cote,
                  cote,
                ).data;
                const moy = [0, 1, 2].map((c) => {
                  let t = 0;
                  for (let j = c; j < d.length; j += 4) t += d[j];
                  return t / (d.length / 4);
                });
                pire = Math.min(pire, rapport(fg, moy));
              }
            if (pire === Infinity) return;
            const texte = (e.textContent ?? "").trim().slice(0, 40);
            out.push({
              cle: `${i}`,
              echec:
                pire < seuil
                  ? `${pire.toFixed(2)}:1 < ${seuil} « ${texte} »`
                  : undefined,
            });
          });
          return out;
        },
        { b64: image.toString("base64") },
      );
      for (const r of res) {
        mesures.add(r.cle);
        if (r.echec) echecs.add(r.echec);
      }
    }
    expect(mesures.size, "trop peu de textes mesurés").toBeGreaterThan(20);
    expect([...echecs], [...echecs].join("\n")).toEqual([]);
  });
});
