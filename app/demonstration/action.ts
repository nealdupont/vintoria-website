"use server";

import { ecrireAuContact, echapperHtml } from "@/lib/courriel";

/**
 * La demande de démonstration — le seul endroit du site où un prospect se
 * déclare. Tout est validé ICI : le navigateur aide, il ne décide pas.
 *
 * Ce module n'exporte QUE l'action. Les types et l'état initial vivent dans
 * ./etat : un fichier « use server » ne peut rien exporter d'autre que des
 * fonctions asynchrones.
 */

import type { Champ, EtatDemande } from "./etat";

/** Le délai sous lequel aucun humain ne remplit quatre champs. */
const SEUIL_ROBOT_MS = 3000;

const COURRIEL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function texte(donnees: FormData, nom: string): string {
  const v = donnees.get(nom);
  return typeof v === "string" ? v.trim() : "";
}

export async function demanderDemonstration(
  _precedent: EtatDemande,
  donnees: FormData,
): Promise<EtatDemande> {
  const valeurs = {
    etablissement: texte(donnees, "etablissement"),
    nom: texte(donnees, "nom"),
    courriel: texte(donnees, "courriel"),
    telephone: texte(donnees, "telephone"),
    ville: texte(donnees, "ville"),
    couverts: texte(donnees, "couverts"),
    references: texte(donnees, "references"),
    mot: texte(donnees, "mot"),
  };

  /*
   * ANTI-ROBOT — deux pièges, aucun captcha.
   *
   * 1. Le leurre : un champ que seul un automate remplit. Il est retiré du
   *    flux d'accessibilité ET de la tabulation, donc aucun humain, lecteur
   *    d'écran compris, ne peut le rencontrer.
   * 2. L'horloge : un envoi en moins de trois secondes n'est pas humain.
   *
   * Dans les deux cas on répond « envoyé » sans rien envoyer. Dire la vérité
   * à un robot, c'est lui apprendre à passer. Aucun humain n'est trompé :
   * un humain ne déclenche jamais ces deux conditions.
   */
  const ouvertureA = Number(texte(donnees, "ouverture"));
  const tropVite =
    Number.isFinite(ouvertureA) && ouvertureA > 0 && Date.now() - ouvertureA < SEUIL_ROBOT_MS;

  if (valeurs.mot !== "" || tropVite) {
    console.warn("[demonstration] Envoi écarté (leurre ou cadence).");
    return { phase: "envoye", etablissement: valeurs.etablissement || "votre établissement" };
  }

  // --- Validation serveur ---------------------------------------------
  const champs: Partial<Record<Champ, string>> = {};
  if (valeurs.etablissement.length < 2)
    champs.etablissement = "Indiquez le nom de votre établissement.";
  if (valeurs.nom.length < 2) champs.nom = "Indiquez votre nom.";
  if (!COURRIEL.test(valeurs.courriel))
    champs.courriel = "Cette adresse e-mail ne semble pas valide.";
  if (valeurs.couverts && !/^\d{1,5}$/.test(valeurs.couverts))
    champs.couverts = "Indiquez un nombre.";
  if (valeurs.references && !/^\d{1,5}$/.test(valeurs.references))
    champs.references = "Indiquez un nombre.";

  if (Object.keys(champs).length > 0) {
    return {
      phase: "erreur",
      message:
        Object.keys(champs).length === 1
          ? "Un champ demande une correction."
          : `${Object.keys(champs).length} champs demandent une correction.`,
      champs,
      valeurs,
    };
  }

  // --- Envoi ------------------------------------------------------------
  /*
   * Courriel interne, aux couleurs du thème crème de la marque (vintoria-brand) :
   * fond crème #F8F1EA, texte encre #241A1D, discret #6A5F62, filet #E6DACF,
   * bordeaux #722340. Écrites en clair : un client de messagerie ne lit pas
   * les variables CSS.
   */
  const ligne = (etiquette: string, v: string) =>
    v ? `<tr><td style="padding:4px 16px 4px 0;color:#6A5F62">${etiquette}</td><td style="padding:4px 0"><strong>${echapperHtml(v)}</strong></td></tr>` : "";

  const resultat = await ecrireAuContact({
    sujet: `Démonstration — ${valeurs.etablissement}`,
    repondreA: valeurs.courriel,
    html: `
      <div style="font-family:system-ui,sans-serif;background:#F8F1EA;color:#241A1D;line-height:1.6;padding:24px">
        <p style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#722340;margin:0 0 4px">Demande de démonstration</p>
        <h1 style="font-size:22px;margin:0 0 20px">${echapperHtml(valeurs.etablissement)}</h1>
        <table style="border-collapse:collapse;font-size:15px">
          ${ligne("Contact", valeurs.nom)}
          ${ligne("E-mail", valeurs.courriel)}
          ${ligne("Téléphone", valeurs.telephone)}
          ${ligne("Ville", valeurs.ville)}
          ${ligne("Couverts par service", valeurs.couverts)}
          ${ligne("Références à la carte", valeurs.references)}
        </table>
        ${
          texte(donnees, "message")
            ? `<p style="margin:22px 0 0;padding-top:16px;border-top:1px solid #E6DACF;white-space:pre-wrap">${echapperHtml(texte(donnees, "message"))}</p>`
            : ""
        }
      </div>
    `,
  });

  /*
   * Si l'envoi échoue, on le DIT, et on rend les valeurs saisies. Jamais
   * de « merci » sur un message qui n'est pas parti.
   */
  if (!resultat.ok) {
    return { phase: "erreur", message: resultat.erreur, champs: {}, valeurs };
  }

  return { phase: "envoye", etablissement: valeurs.etablissement };
}
