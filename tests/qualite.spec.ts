import { test, expect } from "@playwright/test";

/**
 * LE SOCLE — ce qui doit rester vrai sur les trois routes, à toute largeur.
 * Rien ici ne juge du goût : seulement ce qui se vérifie.
 */

const ROUTES = ["/", "/tarifs", "/demonstration"] as const;

test.describe("Accessibilité et structure", () => {
  for (const route of ROUTES) {
    test(`${route} — un seul h1, aucun saut de niveau`, async ({ page }) => {
      await page.goto(route);

      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

      const niveaux = await page
        .locator("h1,h2,h3,h4,h5,h6")
        .evaluateAll((e) => e.map((h) => Number(h.tagName[1])));
      for (let i = 1; i < niveaux.length; i++) {
        expect(
          niveaux[i] - niveaux[i - 1],
          `saut de h${niveaux[i - 1]} à h${niveaux[i]}`,
        ).toBeLessThanOrEqual(1);
      }
    });

    test(`${route} — toute image porte un alt`, async ({ page }) => {
      await page.goto(route);
      const sansAlt = await page
        .locator("img")
        .evaluateAll(
          (imgs) => imgs.filter((i) => i.getAttribute("alt") === null).length,
        );
      expect(sansAlt).toBe(0);
    });

    test(`${route} — aucun défilement horizontal`, async ({ page }) => {
      await page.goto(route);
      await page.waitForTimeout(400);
      const { doc, vue } = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        vue: window.innerWidth,
      }));
      expect(
        doc,
        `${doc}px de contenu pour ${vue}px de fenêtre`,
      ).toBeLessThanOrEqual(vue + 1);
    });

    test(`${route} — le lien d’évitement prend le focus en premier`, async ({
      page,
    }) => {
      await page.goto(route);
      await page.keyboard.press("Tab");
      await expect(
        page.getByRole("link", { name: "Aller au contenu" }),
      ).toBeFocused();
    });

    test(`${route} — toute cible tactile atteint 44 px`, async ({ page }) => {
      await page.goto(route);
      await page.waitForTimeout(400);
      const petites = await page.evaluate(() =>
        [...document.querySelectorAll("a, button, input, textarea, select")]
          .filter((e) => {
            const b = e.getBoundingClientRect();
            if (b.width === 0 || b.height === 0) return false;
            /*
             * ET CE QUI N'EST PAS VISIBLE N'EST PAS UNE CIBLE. Le sommaire
             * reste monté, replié derrière la vitre, pour que sa fermeture
             * ait une chorégraphie : ses liens ont donc une boîte sans être
             * atteignables. On mesure ce que le doigt peut toucher.
             */
            if (!e.checkVisibility({ visibilityProperty: true })) return false;
            // Hors mesure : le lien d'évitement (caché jusqu'au focus) et le
            // leurre anti-robot (hors cadre, hors tabulation).
            if (e.closest("[aria-hidden='true']")) return false;
            if ((e as HTMLElement).className?.toString().includes("sr-only"))
              return false;
            return b.height < 44;
          })
          .map(
            (e) =>
              `${e.tagName} "${(e.textContent || "").trim().slice(0, 28)}"`,
          ),
      );
      expect(petites, petites.join(" | ")).toEqual([]);
    });
  }
});

test.describe("Référencement", () => {
  for (const route of ROUTES) {
    test(`${route} — titre, description et canonique`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveTitle(/Vintoria/);
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThan(70);
      const canonique = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(canonique).toContain(route === "/" ? "vintoria.com" : route);
    });
  }

  test("le plan du site déclare les trois routes", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const route of ["", "/demonstration", "/tarifs"])
      expect(xml).toContain(`https://vintoria.com${route}`);
  });
});

test.describe("Navigation", () => {
  /*
   * LE SOMMAIRE EXISTE DÉSORMAIS À TOUTES LES LARGEURS : la liste en ligne
   * du grand écran a disparu, le ciseau ouvre les mêmes destinations
   * partout. Ce test ne se saute donc plus sous `lg` — il attend seulement
   * une ouverture plus ample sur petit écran, où la vitre prend toute la
   * fenêtre, que sur grand écran, où elle se déploie dans le haut.
   */
  test("le sommaire s’ouvre, piège le focus et se ferme avec Échap", async ({
    page,
  }, info) => {
    await page.goto("/tarifs");

    const declencheur = page.getByRole("button", { name: "Sommaire" });
    const panneau = page.getByRole("dialog", { name: "Sommaire" });
    // Fermé, il est rogné par la vitre : aucune hauteur, donc hors de vue.
    await expect(panneau).toBeHidden();

    await declencheur.click();
    await expect(panneau).toBeVisible();
    /*
     * Le panneau doit vraiment s'ouvrir, pas rester à la hauteur de la barre.
     * ON ATTEND LA FIN DE LA DESCENTE : `toBeVisible` passe dès la première
     * image — la vitre met 560 ms à s'ouvrir, et mesurer tout de suite
     * donnait 56 px pour un sommaire qui en fait 392.
     */
    await expect
      .poll(async () => (await panneau.boundingBox())!.height, {
        message: "le sommaire ne s’est pas déployé",
      })
      .toBeGreaterThan(info.project.name === "mobile" ? 400 : 280);

    // La page derrière est RETIRÉE, pas seulement recouverte.
    await expect(page.locator("#contenu")).toHaveAttribute("inert", "");
    const bloque = await page.evaluate(
      () => getComputedStyle(document.body).overflow,
    );
    expect(bloque, "le défilement n’est pas bloqué").toBe("hidden");

    await page.keyboard.press("Escape");
    await expect(panneau).toBeHidden();
    await expect(declencheur).toBeFocused();
    await expect(declencheur).toHaveAttribute("aria-expanded", "false");

    /*
     * AUCUN RÉSIDU. Un sommaire qui se referme en laissant le corps bloqué
     * ou le contenu inerte rend la page muette sans rien casser de visible :
     * le build passe, les autres tests passent, et le site ne défile plus.
     */
    await expect(page.locator("#contenu")).not.toHaveAttribute("inert", "");
    const rendu = await page.evaluate(
      () => getComputedStyle(document.body).overflow,
    );
    expect(rendu, "le défilement n’a pas été rendu").not.toBe("hidden");
  });

  test("choisir une destination referme le sommaire", async ({ page }) => {
    await page.goto("/tarifs");
    await page.getByRole("button", { name: "Sommaire" }).click();
    const panneau = page.getByRole("dialog", { name: "Sommaire" });
    await panneau.getByRole("link", { name: "L’accueil" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(panneau).toBeHidden();
  });

  /*
   * LE VERRE N'ATTEND PAS LE CLIC. C'est l'exigence centrale du chantier,
   * et elle est invisible à la relecture : une barre qui ne diffuse qu'une
   * fois ouverte se rend exactement comme une barre qui diffuse toujours,
   * tant qu'on ne regarde pas le style calculé à l'état fermé.
   */
  for (const route of ROUTES) {
    test(`${route} — la barre est en verre dès l’état fermé`, async ({
      page,
    }) => {
      await page.goto(route);
      const r = await page.evaluate(() => {
        const s = getComputedStyle(document.querySelector("header")!);
        const filtre =
          s.backdropFilter || s.getPropertyValue("-webkit-backdrop-filter");
        const flou = /blur\(([\d.]+)px\)/.exec(filtre);
        return {
          flou: flou ? Number(flou[1]) : 0,
          fond: s.backgroundColor,
          ouvert: document.querySelector("header")!.dataset.ouvert,
        };
      });
      expect(
        r.ouvert,
        "la barre est ouverte alors qu’on ne l’a pas ouverte",
      ).toBe("false");
      expect(
        r.flou,
        "la barre ne diffuse rien au repos",
      ).toBeGreaterThanOrEqual(12);
      // Et une teinte, sinon le texte posé dessus n'a aucun fond garanti.
      expect(r.fond, "la vitre n’a pas de teinte").not.toBe("rgba(0, 0, 0, 0)");
    });
  }

  /*
   * L'en-tête a débordé deux fois pendant la refonte : à 390 px le bouton
   * sortait du cadre, puis à 1024 px la barre complète ne tenait plus.
   * `overflow-x: hidden` sur le corps les CACHE au lieu de les signaler —
   * aucun test de défilement horizontal ne les attrape. Celui-ci mesure.
   */
  for (const largeur of [320, 360, 390, 768, 1024, 1280, 1440]) {
    test(`l’en-tête tient dans ${largeur} px`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: 800 });
      await page.goto("/");
      await page.waitForTimeout(300);
      const debord = await page.evaluate(() => {
        const barre = document.querySelector("header > div")!;
        const droite = Math.max(
          ...[...barre.children]
            .flatMap((e) => [e, ...e.querySelectorAll("*")])
            .map((e) => e.getBoundingClientRect().right),
        );
        return Math.round(droite - window.innerWidth);
      });
      expect(debord, `dépasse de ${debord}px`).toBeLessThanOrEqual(1);
    });
  }

  test("la marque ramène à l’accueil", async ({ page }) => {
    await page.goto("/tarifs");
    await page.getByRole("link", { name: "Vintoria, accueil" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("Les formules", () => {
  test("aucun prix n’est publié tant qu’il n’est pas confirmé", async ({
    page,
  }) => {
    await page.goto("/tarifs");
    const texte = (await page.locator("main").innerText()).replace(/ /g, " ");

    // Les montants trouvés dans le catalogue du produit ne doivent pas fuiter.
    expect(texte).not.toMatch(/\b69\s*€/);
    expect(texte).not.toMatch(/\b99\s*€/);
    await expect(page.getByText("Sur demande").first()).toBeVisible();
  });

  test("les trois formules sont présentes et une seule est conseillée", async ({
    page,
  }) => {
    await page.goto("/tarifs");
    await expect(page.locator("[data-formule]")).toHaveCount(3);
    await expect(page.getByText("Conseillée")).toHaveCount(1);
  });

  test("l’avis de développement ne part jamais en production", async ({
    page,
  }) => {
    await page.goto("/tarifs");
    await expect(page.locator('[data-test="avis-tarifs"]')).toHaveCount(0);
  });
});
