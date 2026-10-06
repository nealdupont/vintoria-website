/**
 * lib/courriel.ts — l'envoi d'e-mail du site commercial.
 *
 * SERVEUR UNIQUEMENT. Ne jamais importer depuis un fichier 'use client' :
 * RESEND_API_KEY ne doit jamais atteindre le navigateur.
 *
 * Pourquoi `fetch` et non le paquet `resend`, que vintoria-pro emploie :
 * ce site n'envoie qu'UN seul type de message. L'API HTTP de Resend tient
 * en vingt lignes, ne vieillit pas, et n'ajoute aucune dépendance à un
 * site dont le poids livré est justement l'un des points à tenir.
 * Le fournisseur, le compte et la clé restent les mêmes que ceux du
 * produit — c'est la cohérence qui comptait, pas le transport.
 *
 * Le type de retour est repris tel quel de vintoria-pro
 * (`lib/email/send.ts`) : jamais d'exception, toujours un résultat lisible.
 */

export type Envoi = { ok: true } | { ok: false; erreur: string };

const INDISPONIBLE = "Le service d’envoi est momentanément indisponible.";

export function echapperHtml(entree: string): string {
  return entree
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface Message {
  sujet: string;
  html: string;
  /** L'adresse du prospect : répondre doit lui écrire à lui, pas à nous. */
  repondreA?: string;
}

export async function ecrireAuContact(message: Message): Promise<Envoi> {
  const cle = process.env.RESEND_API_KEY;
  const destinataire = process.env.CONTACT_EMAIL ?? "contact@vintoria.com";

  /*
   * Sans clé, on échoue FRANCHEMENT. Un formulaire qui affiche « merci »
   * alors que rien n'est parti est pire que pas de formulaire du tout :
   * le prospect attend un rappel qui n'arrivera jamais.
   */
  if (!cle) {
    console.error("[courriel] RESEND_API_KEY absente — aucun envoi effectué.");
    return { ok: false, erreur: INDISPONIBLE };
  }

  try {
    const reponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cle}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? "Vintoria <contact@vintoria.com>",
        to: [destinataire],
        subject: message.sujet,
        html: message.html,
        ...(message.repondreA ? { reply_to: message.repondreA } : {}),
      }),
      // Un formulaire ne doit pas faire patienter indéfiniment.
      signal: AbortSignal.timeout(10_000),
    });

    if (!reponse.ok) {
      const detail = await reponse.text().catch(() => "");
      console.error("[courriel] Resend a refusé :", reponse.status, detail.slice(0, 300));
      return { ok: false, erreur: INDISPONIBLE };
    }

    return { ok: true };
  } catch (e) {
    console.error("[courriel] Exception :", e instanceof Error ? e.message : String(e));
    return { ok: false, erreur: INDISPONIBLE };
  }
}
