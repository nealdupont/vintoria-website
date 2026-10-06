import { defineConfig, devices } from "@playwright/test";

/**
 * Les tests tournent sur le BUILD DE PRODUCTION, pas sur le serveur de
 * développement : c'est la seule version que verra un visiteur, et c'est la
 * seule où l'on mesure quelque chose de vrai (rendu statique, images
 * optimisées, poids réel).
 *
 * `channel: "chrome"` utilise le Chrome déjà installé sur la machine — aucun
 * navigateur à télécharger, et c'est un moteur de production, pas une
 * version figée du paquet.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
  },
  projects: [
    { name: "bureau", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    /*
     * Le profil mobile part de Desktop Chrome et ne change QUE la fenêtre et
     * le tactile. Partir de `devices["iPhone 13"]` imposait WebKit, que le
     * canal « chrome » ne sait pas lancer. Ce que l'on veut vérifier ici est
     * la mise en page à 390 px et les cibles au doigt, pas un moteur de rendu.
     */
    {
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        hasTouch: true,
        isMobile: false,
      },
    },
  ],
  webServer: {
    command: "npm run build && npx next start --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    /*
     * Aucune clé Resend : le formulaire doit alors ÉCHOUER franchement.
     * C'est précisément ce que le test de conversion vérifie — un « merci »
     * affiché sans message envoyé serait le pire défaut possible de ce site.
     */
    env: { NODE_ENV: "production" },
  },
});
