import { test, expect } from "@playwright/test";

/**
 * LA VITRINE : ce que le site existe pour faire. Amener le restaurateur
 * dans l'application, et ne rien lui promettre que l'application ne tienne.
 */

const INSCRIPTION = "https://www.vintoria.app/register";
const CONNEXION = "https://www.vintoria.app/login";

test.describe("Les portes vers l’application", () => {
  for (const route of ["/", "/tarifs", "/demonstration"]) {
    test(`${route} · chaque « essai gratuit » mène à l’inscription`, async ({ page }) => {
      await page.goto(route);
      const essais = page.getByRole("link", { name: /essai gratuit/i });
      const n = await essais.count();
      expect(n, "aucun lien vers l’essai gratuit").toBeGreaterThan(0);
      for (let i = 0; i < n; i++) {
        await expect(essais.nth(i)).toHaveAttribute("href", INSCRIPTION);
      }
    });
  }

  test("« Se connecter » mène à la connexion", async ({ page }) => {
    await page.goto("/");
    const liens = page.getByRole("link", { name: "Se connecter" });
    expect(await liens.count()).toBeGreaterThan(0);
    for (let i = 0; i < (await liens.count()); i++) {
      await expect(liens.nth(i)).toHaveAttribute("href", CONNEXION);
    }
  });

  /* Sur un portable de 1280 × 720, l'essai gratuit se voit sans défiler. */
  test("l’essai gratuit est visible dès l’arrivée", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    // On attend la fin du générique d'ouverture (environ 3 s).
    await page.waitForTimeout(3500);
    const bouton = page.locator(".ouv-actions").getByRole("link", { name: /essai gratuit/i });
    const b = await bouton.boundingBox();
    expect(b, "le bouton n’est pas rendu").not.toBeNull();
    expect(b!.y + b!.height).toBeLessThanOrEqual(720);
  });
});

test.describe("La règle de marque, à l’écran", () => {
  /* Le script `verifier:tirets` lit les sources ; ce test lit la page
     RENDUE, où un texte composé à l'exécution pourrait encore glisser un
     tiret. Seul le tiret qui signale une case vide de tableau est permis. */
  for (const route of ["/", "/tarifs", "/demonstration"]) {
    test(`${route} · aucun tiret de ponctuation dans le texte visible`, async ({ page }) => {
      await page.goto(route);
      const lignes = (await page.locator("body").innerText())
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && l !== "—");
      const fautes = lignes.filter((l) => /[—–]| - /.test(l));
      expect(fautes, fautes.join(" | ")).toEqual([]);
    });
  }
});

test.describe("L’ouverture", () => {
  test("le titre reste lisible par les technologies d’assistance", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      "Chaque table mieux conseillée. Chaque bouteille mieux valorisée. Chaque cave mieux pilotée.",
    );
  });

  test("en mouvement réduit, tout est là d’emblée", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    await page.waitForTimeout(150);
    const opacite = await page
      .locator(".ouv-lettre")
      .first()
      .evaluate((e) => getComputedStyle(e).opacity);
    expect(opacite).toBe("1");
    await expect(page.locator(".ouv-actions").getByRole("link", { name: /essai gratuit/i })).toBeVisible();
    await ctx.close();
  });
});

test.describe("L’accord de l’ouverture", () => {
  test("il passe à l’accord suivant tout seul", async ({ page }) => {
    await page.goto("/");
    const pas = page.locator(".accord-pas button");
    await expect(pas.nth(0)).toHaveAttribute("aria-current", "true");
    await expect(pas.nth(1)).toHaveAttribute("aria-current", "true", { timeout: 9000 });
  });

  test("il ne bouge pas tout seul en mouvement réduit", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    await page.waitForTimeout(8000);
    await expect(page.locator(".accord-pas button").nth(0)).toHaveAttribute("aria-current", "true");
    await ctx.close();
  });

  test("on peut choisir un accord", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Accord 3/ }).click();
    await expect(page.locator(".accord-vin")).toHaveText("Château-Chalon");
  });
});
