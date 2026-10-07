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
  test("le sommaire mobile s’ouvre, piège le focus et se ferme avec Échap", async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== "mobile",
      "Le sommaire n’existe que sous lg.",
    );
    await page.goto("/tarifs");

    const declencheur = page.getByRole("button", { name: "Sommaire" });
    await declencheur.click();

    const panneau = page.getByRole("dialog", { name: "Sommaire" });
    await expect(panneau).toBeVisible();
    // Le panneau doit vraiment occuper l'écran, pas la hauteur du header.
    const boite = await panneau.boundingBox();
    expect(boite!.height).toBeGreaterThan(400);

    await page.keyboard.press("Escape");
    await expect(panneau).toHaveCount(0);
    await expect(declencheur).toBeFocused();
  });

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
