import { existsSync, readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import {
  AU_VERRE,
  MAISON,
  PAR_FAMILLE,
  PAR_REGION,
  REGLAGES,
} from "../lib/carte-imprimee-demonstration";

/**
 * LA SECTION « DE VOTRE CAVE À VOTRE CARTE » NE DOIT RIEN PROMETTRE DE PLUS
 * QUE CE QUE LE GÉNÉRATEUR SAIT FAIRE.
 *
 * Le module vit dans un AUTRE worktree que les deux autres garde-fous :
 * `vintoria-pro-carte`, branche `feat/carte-imprimee`. Les chiffres que la
 * page publie — deux formats, trois styles, cinq classements, cinq langues —
 * y sont relus à chaque exécution. Un format ajouté chez le produit, et la
 * vitrine ment par omission ; un format retiré, et elle ment tout court.
 *
 * Lecture seule ; rien n'est écrit nulle part.
 */

const CARTE = "/Users/nealdupont/Development/vintoria-pro-carte";
const FORMATS = `${CARTE}/lib/carte-imprimee/formats.ts`;
const GABARITS = `${CARTE}/lib/carte-imprimee/gabarits.ts`;
const TYPES = `${CARTE}/lib/carte-imprimee/types.ts`;
const ORGANISATION = `${CARTE}/lib/carte-imprimee/organisation.ts`;
const FIXTURE =
  "/Users/nealdupont/Development/vintoria-pro-atelier/tests/reference/fixtures/cave.ts";

const sansCommentaires = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/[^\n]*/g, "$1");

const absent = () =>
  ![FORMATS, GABARITS, TYPES, ORGANISATION, FIXTURE].every(existsSync);

test.describe("La carte imprimée dit ce que le générateur sait faire", () => {
  test("les formats, styles, classements et langues sont ceux du module", ({}, info) => {
    test.skip(info.project.name !== "bureau", "Une seule exécution suffit.");
    test.skip(absent(), `Module absent — à lire à côté de ${CARTE}.`);

    /* ── LES FORMATS ── */
    const f = sansCommentaires(readFileSync(FORMATS, "utf8"));
    const ids = [...f.matchAll(/^\s{2}(\w+): \{ id: '(\w+)'/gm)].map(
      (m) => m[2],
    );
    expect(
      ids.map((x) => x.toUpperCase()),
      "les formats de page ont changé chez le produit",
    ).toEqual(REGLAGES.formats);

    /* ── LES STYLES ── */
    const g = sansCommentaires(readFileSync(GABARITS, "utf8"));
    const styles = g
      .match(/export type GabaritId = ([^\n]+)/)?.[1]
      .match(/'([a-z]+)'/g)
      ?.map((x) => x.replace(/'/g, ""));
    expect(styles, "les styles de carte ont changé").toEqual(REGLAGES.styles);

    /* ── LES CLASSEMENTS ET LES LANGUES ── */
    const t = sansCommentaires(readFileSync(TYPES, "utf8"));
    const modes = t
      .match(/export type ModeOrganisation = ([^\n]+)/)?.[1]
      .match(/'([a-zéè]+)'/g)
      ?.map((x) => x.replace(/'/g, ""));
    expect(modes, "les modes d’organisation ont changé").toEqual([
      "recommandee",
      "couleur",
      "region",
      "pays",
      "appellation",
    ]);
    expect(
      modes!.length,
      "la page n’annonce plus autant de classements que le produit",
    ).toBe(REGLAGES.organisations.length);

    const langues = t
      .match(/export type Langue = ([^\n]+)/)?.[1]
      .match(/'([a-z]{2})'/g)
      ?.map((x) => x.replace(/'/g, ""));
    expect(langues, "les langues de la carte ont changé").toEqual([
      ...REGLAGES.langues,
    ]);

    /* ── LES VINS AU VERRE OUVRENT LA CARTE ── */
    const o = readFileSync(ORGANISATION, "utf8");
    expect(
      /Les vins servis au verre ouvrent la carte/.test(o),
      "le verre n’ouvre plus la carte : l’ordre de la feuille est faux",
    ).toBe(true);
  });

  test("les vins de la feuille sont ceux de la cave de démonstration", ({}, info) => {
    test.skip(info.project.name !== "bureau", "Une seule exécution suffit.");
    test.skip(absent(), `Fixture absente — à lire à côté de ${CARTE}.`);

    const src = sansCommentaires(readFileSync(FIXTURE, "utf8"));
    const vins = new Map<
      string,
      { domaine: string | null; prix: string | null }
    >();
    for (const b of src.matchAll(/wine\(\{([^}]*)\}\)/g)) {
      const nom = b[1].match(/name:\s*'([^']+)'/)?.[1];
      if (!nom) continue;
      vins.set(nom, {
        domaine: b[1].match(/domaine:\s*'([^']+)'/)?.[1] ?? null,
        prix: b[1].match(/\bprice:\s*([\d.]+)/)?.[1] ?? null,
      });
    }
    expect(vins.size, "aucun vin lu dans la fixture").toBeGreaterThan(10);

    /* Les rubriques en bouteille portent le prix bouteille du produit. */
    for (const r of PAR_FAMILLE) {
      for (const v of r.vins) {
        const vu = vins.get(v.nom);
        expect(vu, `« ${v.nom} » n’existe plus dans la cave`).toBeTruthy();
        expect(vu!.domaine, `le domaine de « ${v.nom} » a changé`).toBe(
          v.domaine,
        );
        expect(vu!.prix, `le prix de « ${v.nom} » a changé`).toBe(v.prix);
      }
    }

    /*
      LE CLASSEMENT PAR RÉGION PORTE LES MÊMES VINS, ni plus ni moins — c'est
      tout le propos du deuxième temps de l'animation. Le verre et les vins
      sans prix bouteille sont les seules différences légitimes : la rubrique
      « Au verre » n'existe pas dans ce classement.
    */
    const parFamille = new Set(
      PAR_FAMILLE.flatMap((r) => r.vins.map((v) => v.nom)),
    );
    const parRegion = new Set(
      PAR_REGION.flatMap((r) => r.vins.map((v) => v.nom)),
    );
    for (const nom of parRegion) {
      expect(
        parFamille.has(nom),
        `« ${nom} » apparaît par région mais pas par famille : la feuille invente`,
      ).toBe(true);
    }

    /* Et les vins au verre portent bien un prix au verre chez le produit. */
    for (const v of AU_VERRE.vins) {
      const bloc = [...src.matchAll(/wine\(\{([^}]*)\}\)/g)].find((b) =>
        b[1].includes(`name: '${v.nom}'`),
      );
      expect(bloc, `« ${v.nom} » a disparu`).toBeTruthy();
      expect(
        bloc![1].match(/price_glass:\s*([\d.]+)/)?.[1],
        `le prix au verre de « ${v.nom} » a changé`,
      ).toBe(v.prix);
    }
  });

  test("la page publie la feuille, et aucune capture", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() =>
      document.querySelector("#carte")!.scrollIntoView({ block: "center" }),
    );
    await page.waitForTimeout(900);

    const r = await page.evaluate(() => {
      const s = document.querySelector("#carte")!;
      return {
        images: s.querySelectorAll("img").length,
        texte: (s.textContent ?? "").replace(/\s+/g, " "),
      };
    });

    expect(r.images, "une capture s’est glissée dans la section").toBe(0);
    expect(r.texte, "le nom de la maison manque").toContain(MAISON);
    expect(r.texte, "l’intitulé de la carte manque").toContain(
      "Carte des vins",
    );
    /* Les réglages annoncés sont ceux du module, et ils sont écrits. */
    for (const liste of Object.values(REGLAGES)) {
      for (const valeur of liste) {
        expect(
          r.texte,
          `le réglage « ${valeur} » n’est pas annoncé sur la page`,
        ).toContain(valeur);
      }
    }
    /* Et aucune promesse que le générateur ne tient pas. */
    for (const interdit of ["imprime", "impression directe", "sur mesure"]) {
      expect(
        r.texte.toLowerCase().includes(interdit),
        `« ${interdit} » promet ce que le module ne fait pas`,
      ).toBe(false);
    }
  });
});
