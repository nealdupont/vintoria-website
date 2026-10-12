import { test, expect } from "@playwright/test";

/**
 * L'ACCUEIL EN LUMIÈRE TRAVERSÉE.
 *
 * Ces tests ne jugent pas du goût. Ils gardent les défauts qui NE FONT
 * ÉCHOUER AUCUN BUILD — ceux qu'on ne voit qu'à l'œil, et seulement si on
 * pense à regarder au bon endroit :
 *
 *   · une ancre de navigation qui ne mène nulle part ;
 *   · `position: sticky` tué par un `overflow: hidden` sur un ancêtre ;
 *   · une couleur décorative passée en texte ;
 *   · la scène qui disparaît sous `prefers-reduced-motion` au lieu de
 *     s'immobiliser.
 *
 * Les deux premiers sont réellement survenus pendant la construction.
 */

test.describe("La scène existe sans parler", () => {
  test("la lumière est décorative : elle ne se lit pas", async ({ page }) => {
    await page.goto("/");
    // Le jet, le vin, la flaque : présents, et tous hors de l'arbre lu.
    for (const classe of [".jet", ".jet-vin", ".flaque", ".sol"]) {
      const n = await page.locator(classe).count();
      expect(n, `${classe} absent — la scène ne se rend pas`).toBeGreaterThan(
        0,
      );
    }
    const parlants = await page.evaluate(
      () =>
        [
          ...document.querySelectorAll(
            ".jet, .jet-vin, .flaque, .sol, .flaque-coeur",
          ),
        ].filter(
          (e) =>
            !e.closest("[aria-hidden='true']") &&
            e.getAttribute("aria-hidden") !== "true",
        ).length,
    );
    expect(
      parlants,
      "un élément de décor est exposé aux lecteurs d’écran",
    ).toBe(0);
  });

  test("les jetons clairs s’appliquent — et le texte n’est jamais pâle", async ({
    page,
  }) => {
    await page.goto("/");
    const fond = await page.evaluate(() =>
      getComputedStyle(document.querySelector(".lumiere")!)
        .getPropertyValue("--color-fond")
        .trim(),
    );
    expect(fond).toBe("#f7f4ed");

    /*
      L'or (1,7:1) et la sauge (2,9:1) sont INTERDITS en texte sur l'ivoire.
      On ne vérifie pas la règle dans la feuille de style — on vérifie
      qu'AUCUN élément de texte rendu n'a fini par les porter.
    */
    const interdits = await page.evaluate(() => {
      const proches = (c: string, cible: [number, number, number]) => {
        const m = c.match(/\d+/g);
        if (!m) return false;
        return cible.every((v, i) => Math.abs(Number(m[i]) - v) < 12);
      };
      return [...document.querySelectorAll<HTMLElement>("main *, section *")]
        .filter(
          (e) =>
            (e.textContent ?? "").trim().length > 0 && e.children.length === 0,
        )
        .filter((e) => {
          const c = getComputedStyle(e).color;
          return proches(c, [201, 169, 78]) || proches(c, [143, 165, 138]);
        })
        .map((e) => `${e.tagName}: ${(e.textContent ?? "").slice(0, 30)}`);
    });
    expect(
      interdits,
      `couleur décorative employée en texte : ${interdits.join(" | ")}`,
    ).toEqual([]);
  });
});

test.describe("Les ancres de navigation mènent quelque part", () => {
  test("chaque entrée du sommaire désigne une section réelle", async ({
    page,
  }) => {
    await page.goto("/");
    const cibles = await page.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLAnchorElement>('header a[href^="/#"]'),
      ].map((a) => a.getAttribute("href")!.slice(1)),
    );
    expect(cibles.length, "aucune ancre à vérifier").toBeGreaterThan(0);
    const mortes = await page.evaluate(
      (l) => l.filter((h) => !document.querySelector(h)),
      cibles,
    );
    expect(mortes, `ancre sans destination : ${mortes.join(", ")}`).toEqual([]);
  });
});

test.describe("L’écran convive avance au défilement", () => {
  test("il reste à l’écran pendant toute la section", async ({ page }) => {
    /*
      LE PIÈGE. `overflow: hidden` sur la section fait d'elle le plus proche
      ancêtre défilant, ce qui désactive `position: sticky` à l'intérieur.
      Le build passe, la page se rend, et l'écran décroche simplement au
      deuxième temps. C'est arrivé. On mesure donc le comportement, pas la
      règle CSS qui le produit.
    */
    await page.goto("/");
    const section = page.locator("#instant");
    const boite = (await section.boundingBox())!;

    const vus: boolean[] = [];
    for (const part of [0.15, 0.45, 0.8]) {
      await page.evaluate(
        (y) => window.scrollTo(0, y),
        boite.y + boite.height * part,
      );
      await page.waitForTimeout(350);
      const tel = (await page
        .locator("#instant .objet")
        .first()
        .boundingBox())!;
      const h = await page.evaluate(() => window.innerHeight);
      // visible à l'écran : ni au-dessus, ni au-dessous du cadre
      vus.push(tel.y + tel.height > 0 && tel.y < h);
    }
    expect(
      vus,
      "l’écran décroche en cours de section — sticky est neutralisé",
    ).toEqual([true, true, true]);
  });

  test("les trois temps sont de vraies captures, et toutes nommées", async ({
    page,
  }) => {
    await page.goto("/");
    const img = page.locator("#instant img");
    await expect(img).toHaveCount(3);
    for (const src of ["plats", "couleur", "resultat"]) {
      await expect(page.locator(`#instant img[src*="${src}"]`)).toHaveCount(1);
    }
    const sansNom = await page.evaluate(
      () =>
        [...document.querySelectorAll("#instant img")].filter(
          (i) => !(i.getAttribute("alt") ?? "").trim(),
        ).length,
    );
    expect(sansNom, "une capture sans alternative textuelle").toBe(0);
  });

  test("le dernier temps finit bien en place", async ({ page }) => {
    await page.goto("/");
    const boite = (await page.locator("#instant").boundingBox())!;
    await page.evaluate(
      (y) => window.scrollTo(0, y),
      boite.y + boite.height - 50,
    );
    await page.waitForTimeout(500);
    const etat = await page.evaluate(() => {
      const d = document.querySelector(
        '#instant img[src*="resultat"]',
      )!.parentElement!;
      const t = getComputedStyle(d);
      return { opacite: Number(t.opacity), transform: t.transform };
    });
    expect(etat.opacite).toBeGreaterThan(0.95);
    // matrix(...) : la translation en X doit être revenue à zéro
    const tx = Number(
      (etat.transform.match(/-?[\d.]+/g) ?? ["0", "0", "0", "0", "0", "0"])[4],
    );
    expect(
      Math.abs(tx),
      "l’écran final n’est pas revenu en place",
    ).toBeLessThan(6);
  });
});

test.describe("La page se tait quand on le lui demande", () => {
  test.use({ reducedMotion: "reduce" });

  test("rien ne s’anime, mais la scène reste COMPOSÉE", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(900);

    const enCours = await page.evaluate(
      () =>
        (
          document as Document & {
            getAnimations(o?: GetAnimationsOptions): Animation[];
          }
        )
          .getAnimations({ subtree: true })
          .filter((a) => a.playState === "running").length,
    );
    expect(
      enCours,
      "des animations tournent malgré prefers-reduced-motion",
    ).toBe(0);

    // On retire le MOUVEMENT, pas la lumière ni le propos.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('#ouverture img[src*="symbole"]')).toBeVisible();
    // Le verre est tracé ENTIÈREMENT : sans mouvement, pas de demi-verre.
    const trace = await page.evaluate(() =>
      [
        ...document.querySelectorAll(
          "#ouverture svg path, #ouverture svg ellipse",
        ),
      ]
        .filter((e) => getComputedStyle(e).strokeDasharray !== "none")
        .map((e) => Number.parseFloat(getComputedStyle(e).strokeDashoffset)),
    );
    expect(trace.length, "le verre ne se rend pas").toBeGreaterThan(2);
    expect(Math.max(...trace), "le verre reste à moitié tracé").toBe(0);
    await expect(page.locator(".jet").first()).toBeVisible();
    await expect(page.locator('#instant img[src*="resultat"]')).toBeVisible();
  });
});

test.describe("Rien ne déborde, à aucune largeur", () => {
  for (const l of [320, 390, 768, 1024, 1280, 1440, 1920]) {
    test(`l’objet posé ne pousse pas la page à ${l} px`, async ({ page }) => {
      await page.setViewportSize({ width: l, height: 900 });
      await page.goto("/");
      await page.waitForTimeout(400);
      /*
        `overflow-x` masquerait le défaut : on mesure la GÉOMÉTRIE. L'écran
        du héros déborde volontairement à droite ; il ne doit jamais pour
        autant élargir le document.
      */
      const { doc, vue } = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        vue: window.innerWidth,
      }));
      expect(
        doc,
        `${doc}px de document pour ${vue}px de fenêtre`,
      ).toBeLessThanOrEqual(vue + 1);
    });
  }
});

/* ══════════════════════════════════════════════════════════════
   L'ACCUEIL COMPLET — HUIT MOUVEMENTS

   Ces tests gardent ce qu'une relecture ne voit pas : l'ordre du récit,
   la continuité de l'arc de lumière, et l'ÉTAT FINAL de chaque geste.
   Un geste qui n'arrive pas à son terme ne casse aucun build : il laisse
   simplement un écran à moitié révélé, ou un carré qui ne part jamais.
   ══════════════════════════════════════════════════════════════ */

import { HEURES } from "../lib/lumiere";
import {
  ADDITION,
  COMPOSITION,
  COMPTE,
  VALEUR,
} from "../lib/cave-demonstration";

/** Amène la page à son état stable : images paresseuses chargées, gestes
 *  déclenchés, arrivées posées. Sans cela on mesure un état transitoire. */
async function parcourir(page: import("@playwright/test").Page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(1600);
}

test.describe("L’arc du jour", () => {
  test("le bas de chaque heure est le haut de la suivante", () => {
    /*
      Une marche de cinq valeurs sur 255 se lit à l'œil sur un aplat, et
      elle est invisible quand on relit huit composants séparément. Elle
      s'est produite une fois, entre Le geste et La cave.
    */
    for (let i = 0; i < HEURES.length - 1; i++) {
      expect(
        HEURES[i].bas,
        `raccord ${HEURES[i].cle} → ${HEURES[i + 1].cle}`,
      ).toBe(HEURES[i + 1].haut);
    }
    // Et jamais de noir : la lumière baisse, elle ne s'éteint pas.
    for (const h of HEURES) {
      for (const c of [h.haut, h.bas]) {
        const l = Number.parseInt(c.slice(1, 3), 16);
        expect(l, `${h.cle} tire vers le noir (${c})`).toBeGreaterThan(0xc0);
      }
    }
  });

  test("les huit mouvements sont montés, dans l’ordre du récit", async ({
    page,
  }) => {
    await page.goto("/");
    const ids = await page.evaluate(() =>
      [...document.querySelectorAll("section[id]")].map((e) => e.id),
    );
    expect(ids).toEqual([
      "ouverture",
      "geste",
      "cave",
      "accord",
      "table",
      "instant",
      "pourqui",
      "invitation",
    ]);
  });

  test("un seul appel à l’action principal sur toute la page", async ({
    page,
  }) => {
    await page.goto("/");
    /*
      Un lecteur sollicité à chaque section n'écoute plus aucune
      sollicitation. Le héros ouvre, l'invitation ferme — rien entre les
      deux. (L'en-tête a le sien, il n'est pas dans le fil de lecture.)
    */
    const n = await page.locator("section .bouton-primaire").count();
    expect(n, "trop d’appels à l’action dans le fil de lecture").toBe(2);
  });
});

test.describe("Chaque geste arrive à son terme", () => {
  /*
   * LE MOUVEMENT II A CHANGÉ DE NATURE, et trois tests avec lui.
   * Il décrivait ; il propose désormais un choix. Les trois gardes qui
   * suivent remplacent celles qui gardaient l'ancienne décision —
   * hiérarchie de 01 sur 02-03, accent réservé à deux emplois, aucune
   * affordance — et qui seraient devenues fausses sans rien signaler.
   */

  test("les trois portes mènent réellement quelque part", async ({ page }) => {
    /*
      Une porte qui ne s'ouvre pas est pire qu'une absence de porte : la
      flèche, le survol et le curseur promettent, et rien ne tient. On
      vérifie donc que chacune ouvre un détail DISTINCT, et que le détail
      porte bien le titre de la porte dont on vient.
    */
    await page.goto("/");
    await parcourir(page);
    await page.evaluate(() =>
      document.querySelector("#geste")!.scrollIntoView({ block: "start" }),
    );
    await page.waitForTimeout(600);

    const portes = page.locator("#geste button[aria-controls='geste-detail']");
    await expect(portes).toHaveCount(3);

    const vus: string[] = [];
    for (let i = 0; i < 3; i++) {
      await portes.nth(i).click();
      await page.waitForTimeout(900);
      const r = await page.evaluate(() => {
        const visible = [
          ...document.querySelectorAll("#geste-detail > div:last-child > *"),
        ].find((e) => Number(getComputedStyle(e).opacity) > 0.9);
        return {
          titre: (visible?.querySelector("h3")?.textContent ?? "").trim(),
          ouvertes: [
            ...document.querySelectorAll(
              "#geste button[aria-controls='geste-detail'][aria-expanded='true']",
            ),
          ].length,
        };
      });
      expect(r.ouvertes, "deux portes se disent ouvertes à la fois").toBe(1);
      vus.push(r.titre);
      await page
        .locator("#geste-detail button", { hasText: "Les trois façons" })
        .click();
      await page.waitForTimeout(700);
    }
    expect(
      new Set(vus).size,
      `les détails se répètent : ${vus.join(" / ")}`,
    ).toBe(3);
  });

  test("le balayement ne déplace ni la page ni le lecteur", async ({
    page,
  }) => {
    /*
      C'EST LA GARDE LA PLUS UTILE DE LA SECTION. Un détail monté à la
      demande allonge le document de mille pixels d'un coup, le navigateur
      recale le défilement, et le lecteur se retrouve ailleurs — sans
      qu'aucun test ne tombe. Les quatre états partagent donc une même
      cellule de grille : la scène fait la hauteur du plus grand, une fois
      pour toutes. Si quelqu'un démonte cette superposition, ceci tombe.
    */
    await page.goto("/");
    await parcourir(page);
    await page.evaluate(() => {
      (window as unknown as { __n: number }).__n = 0;
      document.querySelector("#geste ul li button")!.scrollIntoView({
        block: "center",
      });
    });
    // On attend que le défilement doux soit VRAIMENT fini avant de mesurer.
    await page.waitForFunction(
      () => {
        const w = window as unknown as { __y?: number; __n?: number };
        const y = Math.round(scrollY);
        if (w.__y === y) w.__n = (w.__n ?? 0) + 1;
        else {
          w.__y = y;
          w.__n = 0;
        }
        return (w.__n ?? 0) > 6;
      },
      null,
      { polling: 60 },
    );

    const etat = () =>
      page.evaluate(() => ({
        y: Math.round(scrollY),
        doc: document.documentElement.scrollHeight,
      }));
    const avant = await etat();

    for (const geste of [
      () =>
        page.evaluate(() =>
          document.querySelector<HTMLElement>("#geste ul li button")!.click(),
        ),
      () =>
        page.evaluate(() =>
          document
            .querySelectorAll<HTMLElement>("#geste-detail button")[3]
            .click(),
        ),
      () =>
        page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>("#geste-detail button")]
            .find((b) => b.textContent!.includes("Les trois"))!
            .click(),
        ),
    ]) {
      await geste();
      await page.waitForTimeout(1100);
      const apres = await etat();
      expect(apres.doc, "le document a changé de hauteur").toBe(avant.doc);
      expect(apres.y, "la page a sauté sous le lecteur").toBe(avant.y);
    }
  });

  test("l’accent ne porte que la structure", async ({ page }) => {
    /*
      L'ancienne règle — deux emplois au plus — appartenait à une section
      sans numéros monumentaux. Ici le bordeaux EST la structure : le mot
      « mieux. » et les trois rangs. Au-delà, il redeviendrait une couleur
      d'ornement, et ne signalerait plus rien. Cinq est la limite.
    */
    await page.goto("/");
    await parcourir(page);
    const n = await page.evaluate(() => {
      const accent = getComputedStyle(document.querySelector("#geste")!)
        .getPropertyValue("--color-accent")
        .trim();
      const toile = document.createElement("canvas");
      toile.width = toile.height = 1;
      const c = toile.getContext("2d")!;
      const rgb = (v: string) => {
        c.fillStyle = v;
        c.fillRect(0, 0, 1, 1);
        return [...c.getImageData(0, 0, 1, 1).data].slice(0, 3).join(",");
      };
      const cible = rgb(accent);
      return [...document.querySelectorAll("#geste *")].filter(
        (e) =>
          e.children.length === 0 &&
          (e.textContent ?? "").trim().length > 0 &&
          /*
            LES TROIS DÉTAILS SONT MONTÉS EN PERMANENCE — c'est ce qui
            immobilise la scène. Compter leurs rangs reviendrait à compter
            trois bordeaux que personne ne voit : `offsetParent` ne les
            écarte pas, la visibilité oui.
          */
          e.checkVisibility({
            visibilityProperty: true,
            opacityProperty: true,
          }) &&
          rgb(getComputedStyle(e).color) === cible,
      ).length;
    });
    expect(
      n,
      `l’accent est employé ${n} fois dans le mouvement II`,
    ).toBeLessThanOrEqual(5);
  });

  test("les chiffres de la cave viennent de la donnée, pas de l’esquisse", async ({
    page,
  }) => {
    /*
      L'esquisse de référence affichait « 24 680 € » et « 12 alertes ».
      Ce sont des nombres de dessinateur. Ceux-ci sont recalculés depuis
      les fixtures du produit (voir tests/chiffres.spec.ts) et doivent
      arriver ici par lib/cave-demonstration.ts, pas par la frappe.
    */
    await page.goto("/");
    await parcourir(page);
    await page.evaluate(() =>
      document.querySelector("#geste")!.scrollIntoView({ block: "start" }),
    );
    await page.waitForTimeout(500);
    await page
      .locator("#geste button[aria-controls='geste-detail']")
      .nth(1)
      .click();
    await page.waitForTimeout(900);
    const r = await page.evaluate(() => {
      const vu = [
        ...document.querySelectorAll("#geste-detail > div:last-child > *"),
      ].find((e) => Number(getComputedStyle(e).opacity) > 0.9)!;
      return {
        /* Les trois chiffres posés en grand dans le jeu de cartes. */
        chiffres: [...vu.querySelectorAll(".jeu .gravure")].map((e) =>
          e.textContent!.trim(),
        ),
        /* Et tout ce que la vue écrit, pour y traquer l'esquisse. */
        tout: vu.textContent ?? "",
      };
    });

    /*
      UN SEUL CHIFFRE EST GRAVÉ, LES AUTRES SONT DESSINÉS.

      Les cartes de la cave portaient trois gravures : 15, 158 et le
      montant. Depuis que le volet est dessiné, le sommaire porte lui-même
      ses comptes et le bordereau porte son addition ; seule la valeur reste
      gravée, parce qu'elle est la conclusion du bordereau et que la graver
      DEUX fois aurait affaibli les deux.

      Le garde-fou suit ce déplacement sans rien relâcher : il vérifie que
      la gravure vaut le montant, ET que les deux autres chiffres sont bien
      ÉCRITS par la vue — `textContent` traverse le SVG, donc un dessin qui
      cesserait de lire `lib/cave-demonstration.ts` ferait échouer ici.
    */
    expect(
      r.chiffres,
      `la vue grave ${r.chiffres.length} chiffre(s) : ${r.chiffres.join(" · ")}`,
    ).toEqual([VALEUR.montant]);

    for (const [quoi, attendu] of [
      ["les références", COMPTE[0].nombre],
      ["les bouteilles", COMPTE[1].nombre],
      ["la plus grosse famille", COMPOSITION[0].bouteilles],
      ["la plus grosse ligne du bordereau", ADDITION.lignes[0].total],
    ] as const) {
      expect(
        r.tout
          .replace(/\u202f|\u00a0/g, " ")
          .includes(String(attendu).replace(/\B(?=(\d{3})+(?!\d))/g, " ")),
        `${quoi} : « ${attendu} » n'est écrit nulle part dans la vue`,
      ).toBe(true);
    }

    /*
      ET AUCUN CHIFFRE DE DESSINATEUR. Ces trois-là venaient de l'esquisse
      de référence ; les reprendre aurait été indécelable à la relecture et
      faux à la première question d'un restaurateur.
    */
    for (const invente of ["24 680", "24 680", "42 vins", "12 alertes"]) {
      expect(
        r.tout.includes(invente),
        `« ${invente} » vient de l’esquisse, pas du produit`,
      ).toBe(false);
    }
  });

  test("le rapprochement entre bien dans l’écran", async ({ page }) => {
    await page.goto("/");
    await parcourir(page);
    const t = await page.evaluate(
      () =>
        getComputedStyle(document.querySelector("#accord .objet > div")!)
          .transform,
    );
    const e = Number((t.match(/-?[\d.]+/g) ?? ["1"])[0]);
    expect(e, "la caméra n’est pas entrée dans l’écran").toBeGreaterThan(1.6);
  });

  test("le carré quitte l’écran, et son trou est comblé", async ({ page }) => {
    await page.goto("/");
    await parcourir(page);
    const r = await page.evaluate(() => {
      const g = (s: string) => document.querySelector(s)!;
      const carre = getComputedStyle(g('#table [class*="rounded-[6%]"]'));
      const m = (carre.transform.match(/-?[\d.]+/g) ?? []).map(Number);
      return {
        echelle: m[0] ?? 1,
        deplace: Math.abs(m[4] ?? 0) + Math.abs(m[5] ?? 0),
        ecran: Number(getComputedStyle(g("#table .objet")).opacity),
        piece: Number(
          getComputedStyle(g('#table .objet [class*="rounded-[2%]"]')).opacity,
        ),
        etapes: Number(getComputedStyle(g("#table ol")).opacity),
      };
    });
    expect(r.echelle, "le carré n’a pas grandi").toBeGreaterThan(1.7);
    expect(r.deplace, "le carré n’est pas venu au centre").toBeGreaterThan(100);
    expect(r.ecran, "l’écran n’a pas reculé").toBeLessThan(0.35);
    // Sans la pièce, le QR imprimé dans la capture resurgit et on en voit DEUX.
    expect(
      r.piece,
      "le trou laissé par le carré n’est pas comblé",
    ).toBeGreaterThan(0.9);
    expect(r.etapes, "les trois étapes ne sont pas venues").toBeGreaterThan(
      0.9,
    );
  });

  test("les trois compteurs se verrouillent sur les chiffres du produit", async ({
    page,
  }) => {
    /*
      UN COMPTEUR PEUT RATER SANS RIEN CASSER, et c'est ce qui rend cette
      mesure nécessaire. Une roue arrêtée entre deux crans laisse deux
      moitiés de chiffre dans sa fenêtre ; une roue dont la course ne tombe
      pas juste s'arrête sur le MAUVAIS chiffre. Dans les deux cas le build
      passe, la page se rend — et le site publie un nombre que le produit
      ne calcule pas.

      On lit donc le GLYPHE RÉELLEMENT VISIBLE au centre de chaque fenêtre,
      par elementFromPoint. Le textContent ne dirait rien : il contient les
      quelques dizaines de crans de la roue.
    */
    await page.goto("/");
    await parcourir(page);

    const r = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("#cave .sr-only")]
        .map((sr) => sr.parentElement!)
        .map((n) => {
          // Chaque nombre est ramené dans le champ avant d'être lu : après
          // le parcours, la page est en bas et elementFromPoint ne voit rien.
          n.scrollIntoView({ block: "center", behavior: "instant" });
          return {
            annonce: n.querySelector(".sr-only")!.textContent,
            vu: [...n.children]
              .filter((c) => !c.classList.contains("sr-only"))
              .map((c) => {
                const b = c.getBoundingClientRect();
                const e = document.elementFromPoint(
                  Math.round(b.left + b.width / 2),
                  Math.round(b.top + b.height / 2),
                );
                return e && e.textContent!.length === 1 ? e.textContent! : "·";
              })
              .join(""),
            crans: [...n.querySelectorAll("[data-cadran]")].map(
              (c) => new DOMMatrixReadOnly(getComputedStyle(c).transform).f,
            ),
          };
        }),
    );

    const attendu = [COMPTE[0].nombre, COMPTE[1].nombre, VALEUR.montant];
    expect(
      r.map((n) => n.vu),
      "un compteur s’est arrêté sur un autre chiffre que celui de la donnée",
    ).toEqual(attendu);
    // Et la valeur annoncée à la voix reste la valeur, pas la suite des crans.
    expect(
      r.map((n) => n.annonce),
      "la valeur lue ne suit plus la donnée",
    ).toEqual(attendu);
    for (const n of r) {
      for (const f of n.crans) {
        expect(f, "une roue s’est arrêtée entre deux crans").toBeCloseTo(0, 3);
      }
    }
  });
});

test.describe("Mouvement réduit : la page se tient, entière", () => {
  test.use({ reducedMotion: "reduce" });

  test("aucun geste ne laisse d’état amputé", async ({ page }) => {
    await page.goto("/");
    await parcourir(page);

    const r = await page.evaluate(() => {
      const g = (s: string) => document.querySelector(s)!;
      return {
        enCours: (
          document as Document & {
            getAnimations(o?: GetAnimationsOptions): Animation[];
          }
        )
          .getAnimations({ subtree: true })
          .filter((a) => a.playState === "running").length,
        filet: getComputedStyle(g("#geste .origin-left")).transform,
        carre: getComputedStyle(g('#table [class*="rounded-[6%]"]')).transform,
        piece: Number(
          getComputedStyle(g('#table .objet [class*="rounded-[2%]"]')).opacity,
        ),
      };
    });

    expect(
      r.enCours,
      "des animations tournent malgré prefers-reduced-motion",
    ).toBe(0);
    // Le filet du choix principal est ENTIER : on retire le tracé, pas le trait.
    expect(r.filet, "le filet reste à moitié tracé sans le mouvement").toBe(
      "none",
    );
    /*
      LE CARRÉ NE SE DÉTACHE PAS. On ne montre pas l'état final d'un geste
      dont on a retiré le geste : ce serait un écran amputé de son QR, avec
      une pièce grise à la place. L'écran reste INTACT.
    */
    expect(r.carre, "le carré s’est détaché sans le geste").toBe("none");
    expect(r.piece, "le trou est comblé alors que rien n’est parti").toBe(0);
  });

  test("les chiffres de la cave sont là, sans une seule roue", async ({
    page,
  }) => {
    /*
      Le compteur ne se contente pas de ne pas tourner : il n'est pas monté
      du tout. Pas de fenêtre, pas de cran, pas de case vide le temps d'un
      retard — le nombre est du texte, au même endroit exactement.
    */
    await page.goto("/");
    await parcourir(page);
    const r = await page.evaluate(() => ({
      roues: document.querySelectorAll("#cave [data-cadran]").length,
      lu: [
        ...document.querySelectorAll(
          "#cave .data.justify-end, #cave .voix.mt-4",
        ),
      ].map((n) => n.textContent),
    }));
    expect(r.roues, "des roues sont montées malgré le mouvement réduit").toBe(
      0,
    );
    expect(r.lu, "les chiffres ne sont pas à leur valeur finale").toEqual([
      COMPTE[0].nombre,
      COMPTE[1].nombre,
      VALEUR.montant,
    ]);
  });
});

test.describe("Aucun reste de l’ère sombre", () => {
  test("rien n’est peint en encre sur l’accueil", async ({ page }) => {
    await page.goto("/");
    await parcourir(page);
    const sombres = await page.evaluate(() => {
      /*
        UNE SURFACE D'ENCRE EST OPAQUE ET GRANDE — et sa couleur se
        RÉSOUT, elle ne s'analyse pas à la main.

        Deux fois ce test a crié au loup. D'abord sur un filet d'un pixel à
        22 % d'alpha : un séparateur n'est pas une dalle. Puis sur l'en-tête,
        que Tailwind rend en `oklab(0.967 0.0005 0.0098 / 0.72)` — un ivoire
        translucide — dont mon extraction des « trois premiers nombres »
        lisait 0,96 / 0,0005 / 0,0098 comme des canaux 0-255, donc du noir.

        On passe donc la valeur calculée au navigateur, qui sait convertir
        n'importe quelle syntaxe (rgb, oklab, color-mix) en pixels.
      */
      const toile = document.createElement("canvas");
      toile.width = toile.height = 1;
      const ctx2 = toile.getContext("2d")!;
      const resoudre = (c: string) => {
        ctx2.clearRect(0, 0, 1, 1);
        ctx2.fillStyle = "#ffffff";
        ctx2.fillRect(0, 0, 1, 1);
        ctx2.fillStyle = c;
        ctx2.fillRect(0, 0, 1, 1);
        const sur = [...ctx2.getImageData(0, 0, 1, 1).data];
        ctx2.clearRect(0, 0, 1, 1);
        ctx2.fillStyle = "#000000";
        ctx2.fillRect(0, 0, 1, 1);
        ctx2.fillStyle = c;
        ctx2.fillRect(0, 0, 1, 1);
        const sous = [...ctx2.getImageData(0, 0, 1, 1).data];
        // Si la couleur est opaque, le fond d'épreuve ne change rien.
        const opaque = sur
          .slice(0, 3)
          .every((v, i) => Math.abs(v - sous[i]) < 6);
        return { rgb: sous.slice(0, 3), opaque };
      };

      const noir = (c: string, e: Element) => {
        const { rgb, opaque } = resoudre(c);
        if (!opaque) return false;
        if (rgb.some((v) => v >= 60)) return false;
        /*
          L'ENCRE EST NEUTRE, un brun ne l'est pas. Le volet « importer »
          pose une feuille de tabac — (57, 39, 29) — dont les trois canaux
          passent sous 60 sans qu'elle soit pour autant un reste de l'ère
          sombre : elle est franchement chromatique. L'encre du site, elle,
          est à deux unités près neutre (#0b0a0c, #121013). L'écart entre
          le canal le plus fort et le plus faible sépare donc les deux, là
          où la seule luminance les confondait.
        */
        if (Math.max(...rgb) - Math.min(...rgb) >= 18) return false;
        const b = e.getBoundingClientRect();
        return b.width >= 24 && b.height >= 24;
      };

      return [
        ...document.querySelectorAll("header, footer, section, section *"),
      ]
        .filter((e) => {
          // Les captures produit ont le droit d'être sombres : c'est le soir.
          if (e.tagName === "IMG") return false;
          const c = getComputedStyle(e);
          return noir(c.backgroundColor, e);
        })
        .map(
          (e) => `${e.tagName}.${(e.className || "").toString().split(" ")[0]}`,
        );
    });
    expect(
      sombres,
      `surface d’encre sur l’accueil : ${sombres.join(", ")}`,
    ).toEqual([]);
  });

  test("le canevas, le corps et le pied suivent la lumière", async ({
    page,
  }) => {
    await page.goto("/");
    const v = await page.evaluate(() => ({
      html: getComputedStyle(document.documentElement).backgroundColor,
      schema: getComputedStyle(document.documentElement).colorScheme,
      grain: getComputedStyle(document.body, "::after").display,
    }));
    // Le canevas, c'est ce qu'on voit dans le rebond élastique : pas du noir.
    expect(v.html).toBe("rgb(247, 244, 237)");
    // Sinon l'ascenseur du navigateur reste sombre le long d'une page claire.
    expect(v.schema).toBe("light");
    // Le grain de pellicule du soir est invisible sur l'ivoire : il ne doit
    // pas y être composé à chaque image pour rien.
    expect(v.grain, "le grain du soir est encore composé sur l’accueil").toBe(
      "none",
    );
  });

  test("les routes du soir n’ont pas bougé", async ({ page }) => {
    for (const r of ["/tarifs", "/demonstration"]) {
      await page.goto(r);
      const v = await page.evaluate(() => ({
        html: getComputedStyle(document.documentElement).backgroundColor,
        schema: getComputedStyle(document.documentElement).colorScheme,
        pied: getComputedStyle(document.querySelector("footer")!)
          .backgroundColor,
        grain: getComputedStyle(document.body, "::after").display,
        lumiere: document.querySelector(".lumiere") !== null,
      }));
      expect(v.html, `${r} a basculé en lumière`).toBe("rgb(11, 10, 12)");
      expect(v.schema, `${r} a changé de schéma`).toBe("dark");
      expect(v.pied, `${r} : le pied a changé`).toBe("rgb(11, 10, 12)");
      expect(v.grain, `${r} : le grain du soir a disparu`).not.toBe("none");
      expect(v.lumiere, `${r} porte l’enveloppe claire`).toBe(false);
    }
  });
});
