import { test, expect, type Page } from "@playwright/test";

/**
 * LE SOCLE : ce qui doit rester vrai sur les trois routes, à toute largeur.
 * Rien ici ne juge du goût, seulement ce qui se vérifie.
 */

const ROUTES = ["/", "/tarifs", "/demonstration"] as const;

test.describe("Accessibilité et structure", () => {
  for (const route of ROUTES) {
    test(`${route} · un seul h1, aucun saut de niveau`, async ({ page }) => {
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

    test(`${route} · toute image porte un alt`, async ({ page }) => {
      await page.goto(route);
      const sansAlt = await page
        .locator("img")
        .evaluateAll((imgs) => imgs.filter((i) => i.getAttribute("alt") === null).length);
      expect(sansAlt).toBe(0);
    });

    test(`${route} · le lien d’évitement prend le focus en premier`, async ({ page }) => {
      await page.goto(route);
      await page.keyboard.press("Tab");
      await expect(page.getByRole("link", { name: "Aller au contenu" })).toBeFocused();
    });

    test(`${route} · toute cible tactile atteint 44 px`, async ({ page }) => {
      await page.goto(route);
      await page.waitForTimeout(400);
      const petites = await page.evaluate(() =>
        [...document.querySelectorAll("a, button, input, textarea, select, summary")]
          .filter((e) => {
            const b = e.getBoundingClientRect();
            if (b.width === 0 || b.height === 0) return false;
            if (!e.checkVisibility({ visibilityProperty: true })) return false;
            // Hors mesure : le lien d'évitement (caché jusqu'au focus), le
            // leurre anti-robot (hors cadre), et les liens pris dans une
            // phrase, que les règles d'accessibilité exemptent.
            if (e.closest("[aria-hidden='true']")) return false;
            if (e.classList.contains("evitement")) return false;
            if (e.tagName === "A" && e.closest("p")) return false;
            return b.height < 44;
          })
          .map((e) => `${e.tagName} "${(e.textContent || "").trim().slice(0, 28)}"`),
      );
      expect(petites, petites.join(" | ")).toEqual([]);
    });
  }
});

test.describe("Référencement", () => {
  for (const route of ROUTES) {
    test(`${route} · titre, description et canonique`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveTitle(/Vintoria/);
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThan(70);
      const canonique = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonique).toContain(route === "/" ? "vintoria.com" : route);
    });
  }

  test("le plan du site déclare les trois routes", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const route of ["", "/demonstration", "/tarifs"])
      expect(xml).toContain(`https://vintoria.com${route}`);
  });
});

test.describe("L’en-tête", () => {
  /* Le verre n'attend pas le défilement : la barre diffuse dès l'arrivée. */
  for (const route of ROUTES) {
    test(`${route} · la barre est en verre dès l’arrivée`, async ({ page }) => {
      await page.goto(route);
      const r = await page.evaluate(() => {
        const s = getComputedStyle(document.querySelector(".entete-barre")!);
        const filtre = s.backdropFilter || s.getPropertyValue("-webkit-backdrop-filter");
        const flou = /blur\(([\d.]+)px\)/.exec(filtre);
        return { flou: flou ? Number(flou[1]) : 0, fond: s.backgroundColor };
      });
      expect(r.flou, "la barre ne diffuse rien").toBeGreaterThanOrEqual(12);
      expect(r.fond, "la vitre n’a pas de teinte").not.toBe("rgba(0, 0, 0, 0)");
    });
  }

  for (const largeur of [320, 360, 390, 768, 1024, 1280, 1440]) {
    test(`l’en-tête tient dans ${largeur} px`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: 800 });
      await page.goto("/");
      await page.waitForTimeout(300);
      const debord = await page.evaluate(() => {
        const barre = document.querySelector("header > div")!;
        const droite = Math.max(
          ...[...barre.querySelectorAll("*")].map((e) => e.getBoundingClientRect().right),
        );
        return Math.round(droite - window.innerWidth);
      });
      expect(debord, `dépasse de ${debord}px`).toBeLessThanOrEqual(1);
    });
  }

  test("le menu mobile s’ouvre, se ferme avec Échap et rend le focus", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const bouton = page.getByRole("button", { name: "Ouvrir le menu" });
    await bouton.click();
    const menu = page.locator("#menu-mobile");
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: "Fermer le menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Ouvrir le menu" })).toBeFocused();
  });

  const marque = (page: Page) => page.getByRole("link", { name: "Vintoria, accueil" });

  test("la marque ramène à l’accueil depuis une autre page", async ({ page }) => {
    await page.goto("/tarifs");
    await marque(page).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("la marque remonte et efface l’ancre, même sur l’accueil", async ({ page }) => {
    await page.goto("/#formules");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
    await marque(page).click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBe(0);
    await expect.poll(() => page.evaluate(() => location.hash)).toBe("");
  });
});

test.describe("Les formules", () => {
  test("aucun prix n’est publié tant qu’il n’est pas confirmé", async ({ page }) => {
    for (const route of ["/", "/tarifs"]) {
      await page.goto(route);
      const texte = (await page.locator("main").innerText()).replace(/\s/g, " ");
      // Les montants du catalogue du produit ne doivent pas fuiter.
      expect(texte).not.toMatch(/\b69\s*€/);
      expect(texte).not.toMatch(/\b99\s*€/);
      await expect(page.getByText("Tarif sur demande").first()).toBeVisible();
    }
  });

  test("les trois formules sont présentes et une seule est conseillée", async ({ page }) => {
    await page.goto("/tarifs");
    await expect(page.locator("[data-formule]")).toHaveCount(3);
    await expect(page.getByText("Conseillée", { exact: true })).toHaveCount(1);
  });

  test("l’avis de développement ne part jamais en production", async ({ page }) => {
    await page.goto("/tarifs");
    await expect(page.locator('[data-test="avis-tarifs"]')).toHaveCount(0);
  });
});

test.describe("Aucune route ne déborde, même sur le plus petit écran", () => {
  /* Le débordement horizontal est le défaut le plus silencieux du
     responsive : la page se rend, elle glisse simplement sous le doigt.
     On mesure le document, pas les éléments. */
  for (const route of ROUTES) {
    for (const largeur of [320, 360, 390]) {
      test(`${route} tient dans ${largeur} px`, async ({ page }) => {
        await page.setViewportSize({ width: largeur, height: 844 });
        await page.goto(route);
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 700) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 60));
          }
        });
        await page.waitForTimeout(400);
        const trop = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(trop, `la page glisse de ${trop} px sur le côté`).toBe(0);
      });
    }
  }
});
