/**
 * LE SYSTÈME DE LA ROBE
 *
 * La couleur d'accent de Vintoria n'est pas choisie : elle est PORTÉE.
 * Elle vient du vin que l'on regarde. Personne ne sélectionne un thème.
 *
 * Chaque robe a deux tons, et deux seulement :
 *   · profond  — la bouteille. Halos, fonds, matière. Jamais du texte.
 *   · lumiere  — le vin incliné vers la lampe. Texte et filets.
 *                Toujours ≥ 6:1 sur le fond nuit (#0F0D0E).
 *
 * Elle ne touche que trois éléments : la pastille de l'accord, le libellé
 * de service, et le halo de la salle. Au-delà, c'est un thème coloré.
 *
 * Quand aucun vin n'est lu, la robe se retire : la page reprend le bordeaux
 * de la marque (thème nuit).
 */

export type Robe = {
  /** Le nom que dirait un sommelier. */
  nom: string;
  /** La bouteille — matière et halos. */
  profond: string;
  /** Le vin devant la lampe — texte et filets. ≥ 6:1 sur le fond nuit. */
  lumiere: string;
};

/** Aucune lecture en cours : la couleur de la marque, sans vin. */
export const ROBE_NEUTRE: Robe = {
  nom: "bordeaux Vintoria",
  profond: "var(--vintoria-bordeaux-900)",
  lumiere: "var(--vintoria-nuit-accent)",
};

export const ROBES: Record<string, Robe> = {
  cdp: { nom: "grenat profond", profond: "#5a0f1e", lumiere: "#c97a87" },
  chinon: { nom: "rubis", profond: "#7a1226", lumiere: "#d97f86" },
  barolo: { nom: "tuilé", profond: "#7a2a18", lumiere: "#d9906b" },
  vinjaune: { nom: "ambré", profond: "#8a5a18", lumiere: "#d9ae6b" },
  meursault: { nom: "or pâle", profond: "#8a7420", lumiere: "#d9c87f" },
  chablis: { nom: "paille", profond: "#8a7c2e", lumiere: "#d8ce8e" },
};

export function robeDe(vinId: string | null | undefined): Robe {
  if (!vinId) return ROBE_NEUTRE;
  return ROBES[vinId] ?? ROBE_NEUTRE;
}

/** Les variables CSS à poser sur un conteneur. */
export function variablesRobe(robe: Robe): React.CSSProperties {
  return {
    "--robe-profond": robe.profond,
    "--robe-lumiere": robe.lumiere,
  } as React.CSSProperties;
}
