import { test, expect } from "@playwright/test";

/**
 * LE PARCOURS DE CONVERSION — ce que le site existe pour faire.
 *
 * Un seul de ces tests compte vraiment : celui qui vérifie qu'un envoi
 * impossible ne produit JAMAIS un « merci ». Un formulaire qui remercie sans
 * avoir rien envoyé laisse un prospect attendre un rappel qui n'arrivera pas.
 */

/** Le serveur de test tourne sans clé Resend : l'envoi doit donc échouer. */
const SANS_CLE_RESEND = !process.env.RESEND_API_KEY;

/** Le piège de cadence écarte tout envoi fait en moins de trois secondes. */
const SEUIL_ROBOT_MS = 3200;

async function remplirCorrectement(page: import("@playwright/test").Page) {
  await page.getByLabel(/Établissement/).fill("Maison d’Essai");
  await page.getByLabel(/Votre nom/).fill("Camille Martin");
  await page.getByLabel(/E-mail/).fill("camille@maison-essai.fr");
}

test.describe("Le formulaire de démonstration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demonstration");
  });

  test("refuse un envoi vide et désigne le premier champ fautif", async ({
    page,
  }) => {
    await page.waitForTimeout(SEUIL_ROBOT_MS);
    await page
      .getByRole("button", { name: /Demander la démonstration/ })
      .click();

    await expect(
      page.getByText(/champs demandent une correction/),
    ).toBeVisible();
    await expect(
      page.getByText("Indiquez le nom de votre établissement."),
    ).toBeVisible();
    await expect(page.getByText("Indiquez votre nom.")).toBeVisible();

    // Le curseur part sur le premier champ à corriger, pas en haut de page.
    await expect(page.getByLabel(/Établissement/)).toBeFocused();
    // Et le champ se déclare invalide aux technologies d'assistance.
    await expect(page.getByLabel(/Établissement/)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  test("refuse une adresse e-mail malformée", async ({ page }) => {
    await page.waitForTimeout(SEUIL_ROBOT_MS);
    await page.getByLabel(/Établissement/).fill("Maison d’Essai");
    await page.getByLabel(/Votre nom/).fill("Camille Martin");
    await page.getByLabel(/E-mail/).fill("camille.at.maison");
    await page
      .getByRole("button", { name: /Demander la démonstration/ })
      .click();

    await expect(
      page.getByText("Cette adresse e-mail ne semble pas valide."),
    ).toBeVisible();
    await expect(page.getByLabel(/E-mail/)).toBeFocused();
  });

  test("conserve les valeurs saisies quand il refuse", async ({ page }) => {
    await page.waitForTimeout(SEUIL_ROBOT_MS);
    await page.getByLabel(/Établissement/).fill("Maison d’Essai");
    await page.getByLabel(/Ville/).fill("Annecy");
    await page.getByLabel(/Couverts par service/).fill("60");
    await page
      .getByRole("button", { name: /Demander la démonstration/ })
      .click();

    // Personne ne doit retaper sa fiche parce qu'un champ manquait.
    await expect(page.getByLabel(/Établissement/)).toHaveValue(
      "Maison d’Essai",
    );
    await expect(page.getByLabel(/Ville/)).toHaveValue("Annecy");
    await expect(page.getByLabel(/Couverts par service/)).toHaveValue("60");
  });

  test("n’affiche JAMAIS de succès quand l’envoi est impossible", async ({
    page,
  }) => {
    test.skip(
      !SANS_CLE_RESEND,
      "Une clé Resend est présente : l’envoi aboutirait.",
    );

    await page.waitForTimeout(SEUIL_ROBOT_MS);
    await remplirCorrectement(page);
    await page
      .getByRole("button", { name: /Demander la démonstration/ })
      .click();

    await expect(
      page.getByText(/service d’envoi est momentanément indisponible/),
    ).toBeVisible();
    // Le mot interdit : aucun remerciement ne doit apparaître.
    await expect(page.getByText(/Nous revenons vers/)).toHaveCount(0);
    await expect(page.getByText(/Demande reçue/)).toHaveCount(0);
    // Et la fiche est toujours là, prête à être renvoyée.
    await expect(page.getByLabel(/Établissement/)).toHaveValue(
      "Maison d’Essai",
    );
  });

  test("écarte un envoi trop rapide pour être humain", async ({ page }) => {
    // Pas d'attente : on soumet immédiatement, comme un automate.
    await remplirCorrectement(page);
    await page
      .getByRole("button", { name: /Demander la démonstration/ })
      .click();

    // Le robot reçoit un accusé, et rien n'est parti. Aucun humain ne
    // déclenche ce chemin : remplir trois champs prend plus de trois secondes.
    await expect(page.getByText(/Demande reçue/)).toBeVisible();
  });

  test("désactive le bouton pendant l’envoi", async ({ page }) => {
    await page.waitForTimeout(SEUIL_ROBOT_MS);
    await remplirCorrectement(page);
    const bouton = page.getByRole("button", {
      name: /Demander la démonstration/,
    });
    await bouton.click();
    // Soit on attrape l'état d'envoi, soit la réponse est déjà là : les deux
    // sont corrects, mais le bouton ne doit jamais rester cliquable sans retour.
    await expect(
      page
        .getByRole("button", { name: /Envoi…/ })
        .or(page.getByText(/indisponible|Demande reçue/)),
    ).toBeVisible();
  });
});

test.describe("Les chemins vers la conversion", () => {
  for (const route of ["/", "/tarifs"]) {
    test(`${route} mène à la démonstration`, async ({ page }) => {
      await page.goto(route);
      const vers = page.locator('a[href="/demonstration"]');
      expect(await vers.count()).toBeGreaterThan(0);
      await vers.first().click();
      await expect(page).toHaveURL(/\/demonstration$/);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        "Vingt minutes",
      );
    });
  }

  test("aucun mailto: ne remplace le formulaire sur l’accueil", async ({
    page,
  }) => {
    await page.goto("/");
    // Le pied peut offrir une adresse ; aucun APPEL À L'ACTION ne doit le faire.
    const mailtosDansLeContenu = page.locator('main a[href^="mailto:"]');
    await expect(mailtosDansLeContenu).toHaveCount(0);
  });
});
