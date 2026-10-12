import { existsSync, readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import {
  ACCORD,
  AXES,
  ECARTE,
  PLAT,
  QUALITES,
  REGLAGES,
  VIN,
} from "../lib/accord-demonstration";

/**
 * LE MOUVEMENT III NE DOIT PAS DÉRIVER DU MOTEUR D'ACCORDS.
 *
 * Le site ne lance pas le moteur : il transcrit ce que le moteur fait sur
 * la démonstration du produit. Une transcription se démode en silence, et
 * ce dépôt en a déjà fait les frais (voir lib/cave-demonstration.ts, « 179
 * bouteilles »). Ici le risque est pire : les affirmations du volet 03 sont
 * DESSINÉES, donc introuvables par une recherche de texte.
 *
 * Ce fichier relit les sources du produit et vérifie, une par une, les
 * affirmations que la page publie. Il ne réimplémente aucune règle : il
 * compare des valeurs lues à des valeurs écrites.
 *
 * Lecture seule ; rien n'est écrit nulle part.
 */

const ATELIER = "/Users/nealdupont/Development/vintoria-pro-atelier";
const FIXTURE = `${ATELIER}/tests/reference/fixtures/cave.ts`;
const STOCK = `${ATELIER}/tests/reference/atelier/cave.ts`;
const ACCORDS = `${ATELIER}/lib/carte/accords.ts`;
const RESSENTI = `${ATELIER}/lib/menu/wine-experience.ts`;
const BUDGET = `${ATELIER}/lib/menu/budget.ts`;
const ENTREES = `${ATELIER}/lib/dishes/pairing-inputs.ts`;

/** Le même écartement des commentaires que tests/chiffres.spec.ts. */
function sansCommentaires(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

/** Un enregistrement `wine({...})` ou `dish({...})`, par identifiant. */
function lireBlocs(
  src: string,
  fabrique: "wine" | "dish",
): Map<string, string> {
  const m = new Map<string, string>();
  const re = new RegExp(`${fabrique}\\(\\{([^}]*)\\}\\)`, "g");
  for (const bloc of sansCommentaires(src).matchAll(re)) {
    const id = bloc[1].match(/id:\s*'([^']+)'/)?.[1];
    if (id) m.set(id, bloc[1]);
  }
  return m;
}

const champ = (bloc: string, nom: string): string | null =>
  bloc.match(new RegExp(`\\b${nom}:\\s*'([^']*)'`))?.[1] ??
  bloc.match(new RegExp(`\\b${nom}:\\s*([\\d.]+)`))?.[1] ??
  null;

/** Les accords du fixture : [plat, vin, score, phrase]. */
function lireAccords(
  src: string,
): { plat: string; vin: string; score: number; phrase: string }[] {
  const out: { plat: string; vin: string; score: number; phrase: string }[] =
    [];
  for (const l of sansCommentaires(src).matchAll(
    /\[\s*'(d-[a-z-]+)',\s*'(w-[a-z-]+)',\s*(\d+),\s*'((?:[^'\\]|\\.)*)'\s*\]/g,
  )) {
    out.push({
      plat: l[1],
      vin: l[2],
      score: Number(l[3]),
      phrase: l[4].replace(/\\'/g, "'"),
    });
  }
  return out;
}

const absent = () =>
  !existsSync(FIXTURE) ||
  !existsSync(STOCK) ||
  !existsSync(ACCORDS) ||
  !existsSync(RESSENTI) ||
  !existsSync(BUDGET) ||
  !existsSync(ENTREES);

test.describe("Le mouvement III dit ce que le moteur fait", () => {
  test("le plat, le vin et leur accord viennent du produit", ({}, info) => {
    test.skip(info.project.name !== "bureau", "Une seule exécution suffit.");
    test.skip(absent(), `Dépôt produit absent — à lire à côté de ${ATELIER}.`);

    const src = readFileSync(FIXTURE, "utf8");
    const plats = lireBlocs(src, "dish");
    const vins = lireBlocs(src, "wine");
    expect(plats.size, "aucun plat lu").toBeGreaterThan(4);
    expect(vins.size, "aucun vin lu").toBeGreaterThan(10);

    /* ── LE PLAT, ET SES TROIS CHAMPS ── */
    const boeuf = plats.get("d-boeuf");
    expect(
      boeuf,
      "le filet de bœuf a disparu de la démonstration",
    ).toBeTruthy();
    expect(champ(boeuf!, "name"), "le nom du plat a changé").toBe(PLAT.nom);
    expect(champ(boeuf!, "description"), "sa description a changé").toBe(
      PLAT.description,
    );
    expect(champ(boeuf!, "category"), "sa catégorie a changé").toBe(
      PLAT.categorie,
    );
    expect(
      `${champ(boeuf!, "price")} €`,
      "le prix affiché sur la planche a changé",
    ).toBe(PLAT.prix);

    /*
      ET LE MOTEUR NE LIT TOUJOURS QUE CES TROIS CHAMPS.
      C'est l'affirmation centrale de la carte 01 ; si la fonction se mettait
      à comparer un quatrième champ, la page mentirait sans rien casser.
    */
    const entrees = readFileSync(ENTREES, "utf8");
    const compares = [
      ...sansCommentaires(entrees).matchAll(/texte\(before\.(\w+)\)/g),
    ].map((m) => m[1]);
    expect(
      compares.sort(),
      "la génération d'accords ne lit plus exactement nom, description et catégorie",
    ).toEqual(["category", "description", "name"]);

    /* ── LE VIN ── */
    const se = vins.get("w-saint-emilion");
    expect(se, "le Saint-Émilion a disparu").toBeTruthy();
    expect(champ(se!, "name")).toBe(VIN.nom);
    expect(champ(se!, "domaine")).toBe(VIN.domaine);
    expect(champ(se!, "region")).toBe(VIN.region);
    expect(champ(se!, "grape_variety")).toBe(VIN.cepages);
    expect(champ(se!, "vintage")).toBe(VIN.millesime);
    expect(`${champ(se!, "price")} €`).toBe(VIN.prix);

    /* ── L'ACCORD, SCORE ET PHRASE ── */
    const sur = lireAccords(src).filter((a) => a.plat === "d-boeuf");
    expect(
      sur.length,
      "plus aucun accord sur le filet de bœuf",
    ).toBeGreaterThan(1);
    const retenu = sur.find((a) => a.vin === "w-saint-emilion");
    expect(retenu, "l'accord Saint-Émilion a disparu").toBeTruthy();
    expect(retenu!.score, "le score de l'accord a changé").toBe(ACCORD.score);
    expect(retenu!.phrase, "la phrase de l'accord a changé").toBe(
      ACCORD.phrase,
    );

    /* ── LE CONTRE-EXEMPLE : MIEUX NOTÉ, JAMAIS CONSEILLÉ ── */
    const ecarte = sur.find((a) => a.vin === "w-sans-prix");
    expect(
      ecarte,
      "la cuvée sans prix n'a plus d'accord sur ce plat",
    ).toBeTruthy();
    expect(ecarte!.score, "son score a changé").toBe(ECARTE.score);
    const cuvee = vins.get("w-sans-prix");
    expect(champ(cuvee!, "name")).toBe(ECARTE.nom);
    expect(champ(cuvee!, "domaine")).toBe(ECARTE.domaine);
    expect(
      /\bprice:\s*null/.test(cuvee!),
      "la cuvée a maintenant un prix : la démonstration de la carte 02 s'effondre",
    ).toBe(true);
    /* Tout l'intérêt de la carte 02 tient dans cette inégalité. */
    expect(
      ecarte!.score,
      "l'écartée n'est plus mieux notée que le retenu — la carte 02 ne démontre plus rien",
    ).toBeGreaterThan(retenu!.score);
  });

  test("les seuils, les axes et les réglages sont ceux du produit", ({}, info) => {
    test.skip(info.project.name !== "bureau", "Une seule exécution suffit.");
    test.skip(absent(), `Dépôt produit absent — à lire à côté de ${ATELIER}.`);

    /* ── LES QUATRE MOTS ET LEURS SEUILS ── */
    const acc = sansCommentaires(readFileSync(ACCORDS, "utf8"));
    const seuils = [...acc.matchAll(/score\s*>=\s*(\d+)/g)].map((m) =>
      Number(m[1]),
    );
    expect(seuils, "les seuils de qualité ont changé chez le produit").toEqual([
      90, 80, 70,
    ]);
    expect(
      QUALITES.map((q) => q.seuil),
      "la planche n'affiche plus les seuils du produit",
    ).toEqual([60, 70, 80, 90]);
    expect(
      QUALITES.at(-1)!.mot,
      "le mot du score 93 ne découle plus des seuils",
    ).toBe(ACCORD.mot);

    /* ── LES DEUX AXES, ET LEURS MOTS ── */
    const res = readFileSync(RESSENTI, "utf8");
    const poles = [
      "POLE_INTENSITY_L",
      "POLE_INTENSITY_R",
      "POLE_ENERGY_L",
      "POLE_ENERGY_R",
    ].map(
      (n) =>
        res.match(new RegExp(`${n}[^=]*=\\s*\\{\\s*fr:\\s*'([^']+)'`))?.[1],
    );
    expect(poles, "les mots des axes de ressenti ont changé").toEqual([
      AXES[0].gauche,
      AXES[0].droite,
      AXES[1].gauche,
      AXES[1].droite,
    ]);
    /* Il n'y en a que DEUX : en ajouter un rendrait la planche incomplète. */
    const nbAxes = (
      sansCommentaires(res).match(/emphasis:\s*\w+Pct\s*>=/g) ?? []
    ).length;
    expect(nbAxes, "le produit expose un nombre d'axes différent").toBe(
      AXES.length,
    );

    /* ── LES BUDGETS ── */
    const bud = sansCommentaires(readFileSync(BUDGET, "utf8"));
    const bouteille = bud.match(
      /BUDGETS_BOUTEILLE[^=]*=\s*\[([\s\S]*?)\n\]/,
    )?.[1];
    expect(bouteille, "l'échelle bouteille est introuvable").toBeTruthy();
    const valeurs = [...bouteille!.matchAll(/value:\s*'([^']+)'/g)].map(
      (m) => m[1],
    );
    expect(valeurs, "les paliers de budget ont changé").toEqual([
      "libre",
      "moins-50",
      "50-100",
      "plus-100",
    ]);
    expect(
      REGLAGES.budgets.length,
      "la planche n'affiche plus autant de paliers que le produit",
    ).toBe(valeurs.length);
    /*
      PALIER PAR PALIER, PAS GLOBALEMENT. Première version : on vérifiait que
      « 50 » et « 100 » apparaissaient quelque part dans les quatre libellés.
      Éprouvé par mutation, ce contrôle laissait passer « moins de 50 € »
      remplacé par « petit budget » — les deux bornes restaient présentes
      ailleurs. Chaque libellé répond maintenant de SES bornes.
    */
    const bornes = [
      ...bouteille!.matchAll(/min:\s*(null|\d+),\s*max:\s*(null|\d+)/g),
    ].map((m) => [m[1], m[2]].filter((x) => x !== "null"));
    expect(bornes.length, "les bornes de budget sont illisibles").toBe(
      REGLAGES.budgets.length,
    );
    bornes.forEach((bs, i) => {
      const libelle = REGLAGES.budgets[i];
      if (bs.length === 0) {
        expect(
          /\d/.test(libelle),
          `« ${libelle} » porte un chiffre alors que ce palier n'a pas de borne`,
        ).toBe(false);
        return;
      }
      for (const borne of bs) {
        expect(
          libelle.includes(borne),
          `« ${libelle} » ne porte plus sa borne de ${borne} €`,
        ).toBe(true);
      }
    });
  });

  test("la page publie bien ce que la donnée dit", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() =>
      document.querySelector("#geste")!.scrollIntoView({ block: "start" }),
    );
    await page.waitForTimeout(500);
    await page
      .locator("#geste button[aria-controls='geste-detail']")
      .nth(2)
      .click();
    await page.waitForTimeout(1100);

    const vu = await page.evaluate(() => {
      const f = [
        ...document.querySelectorAll("#geste-detail > div:last-child > *"),
      ].find((e) => Number(getComputedStyle(e).opacity) > 0.9)!;
      return (f.textContent ?? "").replace(/\s+/g, " ");
    });

    /*
      `textContent` traverse le SVG : si une planche cessait de lire
      lib/accord-demonstration.ts, ces lignes disparaîtraient de la page.
    */
    for (const [quoi, attendu] of [
      ["le nom du plat", PLAT.nom],
      ["sa description", PLAT.description],
      ["le domaine du vin", VIN.domaine],
      ["le score retenu", String(ACCORD.score)],
      ["le score écarté", String(ECARTE.score)],
      ["le pôle d'un axe", AXES[1].droite.toUpperCase()],
      ["la phrase de l'accord", ACCORD.phrase.replace(/^./, "").slice(0, 40)],
    ] as const) {
      expect(
        vu.includes(attendu),
        `${quoi} : « ${attendu} » n'est pas sur la page`,
      ).toBe(true);
    }

    /*
      ET AUCUNE PROMESSE QUE LE PRODUIT NE TIENT PAS. Ces formulations ont
      été explicitement écartées pendant la rédaction ; les voir réapparaître
      signalerait une reprise en main malheureuse.
    */
    for (const interdit of [
      "temps réel",
      "automatiquement synchronis",
      "chaque ingrédient",
      "analyse les ingrédients",
    ]) {
      expect(
        vu.toLowerCase().includes(interdit.toLowerCase()),
        `« ${interdit} » promet une capacité que le code ne porte pas`,
      ).toBe(false);
    }
  });
});
