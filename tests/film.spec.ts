import { test, expect } from "@playwright/test";

/**
 * LE FILM — il vit sur sa propre route, isolé du reste du site.
 *
 * Ces tests ne jugent pas du goût. Ils vérifient ce qui se mesure : qu'il se
 * rend, qu'il ne déborde pas, qu'il se tait quand on le lui demande, qu'il
 * reste lisible sans être vu, et qu'il ne coûte rien au fil principal.
 */

test.describe("Le film se rend", () => {
  test("la route existe et porte le film", async ({ page }) => {
    await page.goto("/film");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "démonstration",
    );
    await expect(page.locator("figure")).toHaveCount(1);
    // Le cadre a une taille : sans ratio, la page sauterait au chargement.
    const boite = await page.locator("figure > div").first().boundingBox();
    expect(boite!.width).toBeGreaterThan(200);
    expect(boite!.height).toBeGreaterThan(150);
  });

  test("il n’est pas référencé — c’est une page de validation", async ({
    page,
  }) => {
    await page.goto("/film");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  });

  test("aucun défilement horizontal", async ({ page }) => {
    await page.goto("/film");
    await page.waitForTimeout(500);
    const { doc, vue } = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth,
      vue: window.innerWidth,
    }));
    expect(doc, `${doc}px pour ${vue}px`).toBeLessThanOrEqual(vue + 1);
  });

  test("aucune erreur de console", async ({ page }) => {
    const erreurs: string[] = [];
    page.on("console", (m) => m.type() === "error" && erreurs.push(m.text()));
    page.on("pageerror", (e) => erreurs.push(e.message));
    await page.goto("/film");
    await page.waitForTimeout(2500);
    expect(erreurs, erreurs.join(" | ")).toEqual([]);
  });
});

test.describe("Le film se raconte sans être vu", () => {
  test("le propos existe en texte réel, pas seulement en pixels", async ({
    page,
  }) => {
    await page.goto("/film");
    const legende = await page.locator("figcaption").innerText();
    for (const phrase of [
      "Votre carte entre",
      "d’un seul coup d’œil",
      "sous son seuil",
      "inventaire",
      "chacun est conseillé",
      "Carte, cave, conseil, vente",
    ]) {
      expect(legende).toContain(phrase);
    }
  });

  test("la scène est décorative pour les technologies d’assistance", async ({
    page,
  }) => {
    await page.goto("/film");
    // La scène animée est masquée : c'est la légende qui porte le sens.
    await expect(
      page.locator("figure [aria-hidden='true']").first(),
    ).toBeVisible();
  });

  test("le bouton porte TOUJOURS un nom accessible", async ({ page }) => {
    await page.goto("/film");
    const bouton = page.locator("figure button");
    // au repos, pendant la lecture, et après : jamais de bouton muet
    for (const attente of [0, 1500]) {
      await page.waitForTimeout(attente);
      const nom = (await bouton.innerText()).trim();
      expect(nom.length, "bouton sans nom accessible").toBeGreaterThan(0);
    }
    const h = (await bouton.boundingBox())!.height;
    expect(h).toBeGreaterThanOrEqual(44);
  });
});

test.describe("Le film se tait quand on le lui demande", () => {
  test.use({ reducedMotion: "reduce" });

  test("mouvement réduit : rien ne s’anime, mais tout se lit", async ({
    page,
  }) => {
    await page.goto("/film");
    await page.waitForTimeout(800);
    const anims = await page.evaluate(
      () =>
        (
          document as Document & {
            getAnimations(o?: GetAnimationsOptions): Animation[];
          }
        )
          .getAnimations({ subtree: true })
          .filter((a) => a.playState === "running").length,
    );
    expect(anims, "des animations tournent malgré prefers-reduced-motion").toBe(
      0,
    );

    /*
      L'image d'arrivée reste COMPOSÉE : l'écran de la recommandation est là.
      Son texte vit dans la capture, donc en pixels — c'est la légende qui le
      porte pour les technologies d'assistance, et le test le vérifie là.
    */
    const ecran = page
      .locator("figure img")
      .filter({ hasNot: page.locator("x") })
      .first();
    await expect(ecran).toBeAttached();
    await expect(page.locator("figcaption")).toContainText(
      "chacun est conseillé",
    );
  });
});

test.describe("Le film ne coûte rien au fil principal", () => {
  test("aucune mise en page pendant la lecture", async ({ page }, info) => {
    test.skip(info.project.name !== "bureau", "Une seule mesure suffit.");
    await page.goto("/film");
    await page.waitForTimeout(600);

    const session = await page.context().newCDPSession(page);
    await session.send("Performance.enable");
    const lire = async () =>
      Object.fromEntries(
        (await session.send("Performance.getMetrics")).metrics.map((m) => [
          m.name,
          m.value,
        ]),
      );

    await page.evaluate(() => {
      for (const a of (
        document as Document & {
          getAnimations(o?: GetAnimationsOptions): Animation[];
        }
      ).getAnimations({ subtree: true })) {
        a.pause();
        a.currentTime = 6000;
      }
    });
    await page.waitForTimeout(300);
    const avant = await lire();
    await page.evaluate(async () => {
      for (const a of (
        document as Document & {
          getAnimations(o?: GetAnimationsOptions): Animation[];
        }
      ).getAnimations({ subtree: true }))
        a.play();
      await new Promise((r) => setTimeout(r, 4000));
    });
    const apres = await lire();

    const misesEnPage = Math.round(apres.LayoutCount - avant.LayoutCount);
    expect(
      misesEnPage,
      `${misesEnPage} mises en page en 4 s — une propriété non compositable s’est glissée dans la chorégraphie`,
    ).toBeLessThanOrEqual(2);
  });
});

/**
 * LE PIÈGE SILENCIEUX.
 *
 * Un élément qui déclare `animation-name` en CSS mais n'hérite d'aucune
 * DURÉE voit son animation durer zéro seconde : il saute à son état final.
 * Le build passe, la page se rend, et le défaut ne se voit qu'à l'œil — des
 * noms de vins crème sur crème, dans une version antérieure.
 *
 * On le vérifie À L'EXÉCUTION, et non en lisant la source : les classes
 * passent par des composants, et une heuristique textuelle criait au loup
 * sur neuf éléments parfaitement animés.
 */
test.describe("La chorégraphie est complète", () => {
  test("aucune animation de durée nulle", async ({ page }, info) => {
    test.skip(info.project.name !== "bureau", "Une mesure suffit.");
    await page.goto("/film");
    await page.waitForTimeout(1200);

    const fautifs = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("figure *")]
        .map((e) => ({ e, cs: getComputedStyle(e) }))
        .filter(({ cs }) => cs.animationName !== "none")
        .filter(({ cs }) => Number.parseFloat(cs.animationDuration) === 0)
        .map(
          ({ e, cs }) =>
            `${cs.animationName} sur .${e.className.toString().split(" ")[0]}`,
        ),
    );
    expect(fautifs, `durée nulle : ${fautifs.join(", ")}`).toEqual([]);

    // et le compte doit rester raisonnable : c'est aussi un budget
    const animes = await page.evaluate(
      () =>
        (
          document as Document & {
            getAnimations(o?: GetAnimationsOptions): Animation[];
          }
        ).getAnimations({ subtree: true }).length,
    );
    expect(animes, "trop d’éléments animés").toBeLessThanOrEqual(60);
    expect(animes, "aucune animation — le test ne mesure rien").toBeGreaterThan(
      20,
    );
  });
});
