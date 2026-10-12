import { existsSync, readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import {
  ADDITION,
  COMPOSITION,
  COMPTE,
  SEUILS,
  VALEUR,
  VIGILANCE,
} from "../lib/cave-demonstration";

/**
 * LA VITRINE NE DOIT PAS DÉRIVER DE LA DÉMONSTRATION DU PRODUIT.
 *
 * Le site est statique : il n'appelle pas `computeFinancials`, il TRANSCRIT
 * ce que cette fonction donne sur les données de démonstration de Vintoria
 * Pro. Une transcription se démode en silence — c'est exactement ce qui
 * s'est produit : la page a publié « 179 bouteilles » et une alerte que le
 * logiciel ne calcule pas, pendant qu'elle affirmait le contraire.
 *
 * Ce test relit les DEUX fichiers du produit et réapplique leurs règles.
 *
 * CE N'EST PAS UNE SECONDE IMPLÉMENTATION MÉTIER : deux sommes et un
 * comptage, rien de plus. La marge, le coefficient et les prix moyens que
 * calcule `computeFinancials` ne paraissent nulle part sur le site et ne
 * sont pas réimplémentés ici.
 *
 * TROIS TROUS Y ONT ÉTÉ BOUCHÉS après une relecture adverse, et chacun
 * aurait laissé passer la panne qu'on cherche à empêcher :
 *   · une ligne MISE EN COMMENTAIRE chez le produit restait comptée comme
 *     une donnée vivante — le test vérifiait du texte, pas du code ;
 *   · le nombre de références venait de la table de STOCK alors que le
 *     produit compte les VINS : les deux coïncidaient par hasard, et un vin
 *     ajouté sans quantité de démonstration rendait la vitrine fausse sans
 *     rien casser ;
 *   · le chiffre de vigilance — celui qui avait été INVENTÉ — n'était
 *     comparé à rien du produit, alors que les seuils étaient déjà lus.
 *
 * Lecture seule des deux fichiers sources ; rien n'est écrit nulle part.
 */

const ATELIER = "/Users/nealdupont/Development/vintoria-pro-atelier";
const FIXTURE = `${ATELIER}/tests/reference/fixtures/cave.ts`;
const DEMO = `${ATELIER}/tests/reference/atelier/cave.ts`;

/**
 * ON NE LIT QUE DU CODE VIVANT.
 * Sans cela, une entrée commentée chez le produit continue d'alimenter le
 * calcul : on a vérifié qu'en commentant une seule ligne de DEMO_STOCK, le
 * test restait vert pendant que le produit, lui, passait de 158 à 132
 * bouteilles et de 7 972 € à 7 036 €.
 */
function sansCommentaires(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

/** Les vins de la cave de référence : identité et prix de vente. */
function lireVins(src: string): Map<string, number | null> {
  const m = new Map<string, number | null>();
  for (const bloc of sansCommentaires(src).matchAll(/wine\(\{([^}]*)\}\)/g)) {
    const id = bloc[1].match(/id:\s*'([^']+)'/)?.[1];
    if (!id) continue;
    const p = bloc[1].match(/\bprice:\s*([\d.]+)/)?.[1];
    m.set(id, p ? Number(p) : null);
  }
  return m;
}

/** Les vins en entier — ce que les PLANCHES dessinent. */
function lireVinsDetail(
  src: string,
): Map<string, { nom: string; couleur: string | null; prix: number | null }> {
  const m = new Map<
    string,
    { nom: string; couleur: string | null; prix: number | null }
  >();
  for (const bloc of sansCommentaires(src).matchAll(/wine\(\{([^}]*)\}\)/g)) {
    const id = bloc[1].match(/id:\s*'([^']+)'/)?.[1];
    if (!id) continue;
    const prix = bloc[1].match(/\bprice:\s*([\d.]+)/)?.[1];
    m.set(id, {
      nom: bloc[1].match(/name:\s*'([^']+)'/)?.[1] ?? id,
      couleur: bloc[1].match(/\bcolor:\s*'([^']+)'/)?.[1] ?? null,
      prix: prix ? Number(prix) : null,
    });
  }
  return m;
}

/** Le stock de démonstration de la planche Cave : [stock, seuil]. */
function lireStock(src: string): Map<string, [number | null, number | null]> {
  const m = new Map<string, [number | null, number | null]>();
  for (const l of sansCommentaires(src).matchAll(
    /'(w-[a-z-]+)':\s*\[\s*(null|\d+)\s*,\s*(null|\d+)\s*,\s*(?:null|[\d.]+)\s*\]/g,
  )) {
    m.set(l[1], [
      l[2] === "null" ? null : Number(l[2]),
      l[3] === "null" ? null : Number(l[3]),
    ]);
  }
  return m;
}

/** Le défaut de `lib/stock/types.ts` quand aucun seuil n'est posé. */
const SEUIL_DEFAUT = 3;

test.describe("Les chiffres de la vitrine suivent la démonstration du produit", () => {
  test("les quatre chiffres, recalculés depuis les fixtures", ({}, info) => {
    test.skip(info.project.name !== "bureau", "Une seule exécution suffit.");
    test.skip(
      !existsSync(FIXTURE) || !existsSync(DEMO),
      `Dépôt produit absent — ce garde-fou n'a de sens qu'à côté de ${ATELIER}.`,
    );

    const vins = lireVins(readFileSync(FIXTURE, "utf8"));
    const stock = lireStock(readFileSync(DEMO, "utf8"));

    /*
      ON REFUSE DE CALCULER SUR DU VIDE, et les bornes ne recopient AUCUN
      des chiffres que le test doit vérifier — sinon l'assertion devient
      tautologique et le message d'échec accuse le mauvais coupable.
      Les deux tables décrivent le même ensemble : c'est leur relation qu'on
      vérifie, pas leur taille absolue.
    */
    expect(vins.size, `aucun vin lu dans ${FIXTURE}`).toBeGreaterThan(10);
    expect(stock.size, `aucune quantité lue dans ${DEMO}`).toBeGreaterThan(10);
    const orphelins = [...stock.keys()].filter((id) => !vins.has(id));
    expect(
      orphelins,
      `quantités sans vin correspondant — une des deux lectures a dérivé : ${orphelins.join(", ")}`,
    ).toEqual([]);

    /*
      ON PARCOURT LES VINS, PAS LES QUANTITÉS — c'est ce que fait le produit :
      `DEMO_STOCK[w.id] ?? [null, null, null]`. Un vin ajouté à la cave de
      référence sans quantité de démonstration compte donc comme référence,
      et reste non suivi. Compter les quantités aurait ignoré ce vin.
    */
    let references = 0;
    let bouteilles = 0;
    let valeur = 0;
    let bas = 0;
    let epuise = 0;
    for (const [id, prix] of vins) {
      references++;
      const [q, seuil] = stock.get(id) ?? [null, null];
      if (q == null) continue; // stock non suivi : exclu de tout
      bouteilles += q;
      if (q === 0) epuise++;
      else if (q <= (seuil ?? SEUIL_DEFAUT)) bas++;
      // `finance.ts` ne valorise que les prix strictement positifs.
      if (prix != null && prix > 0) valeur += prix * q;
    }

    expect(
      String(references),
      "le nombre de références a changé chez le produit",
    ).toBe(COMPTE[0].nombre);
    expect(
      String(bouteilles),
      "le nombre de bouteilles a changé chez le produit",
    ).toBe(COMPTE[1].nombre);
    /*
      ON COMPARE DES NOMBRES, PAS DES CHAÎNES FORMATÉES.
      Première version : on reconstruisait « 7 972 € » avec toLocaleString
      puis on comparait les deux textes. Le séparateur de milliers rendu
      par toLocaleString dépend de l'ICU du moteur — fine insécable ici,
      insécable ordinaire ailleurs — et le test a effectivement échoué sur
      deux chaînes visuellement identiques, pour une raison étrangère à la
      justesse du chiffre.
      La valeur se compare donc en NOMBRE, et la typographie fait l'objet
      d'une assertion distincte, qui dit ce qu'elle vérifie.
    */
    const affiche = Number(VALEUR.montant.replace(/[^\d]/g, ""));
    expect(
      affiche,
      "la valeur commerciale ne correspond plus à Σ prix × stock",
    ).toBe(valeur);
    expect(
      VALEUR.montant,
      "le montant doit porter des espaces INSÉCABLES, sinon il se coupe en fin de ligne",
    ).not.toMatch(/\u0020/);
    /*
      Le panneau du produit groupe l'épuisé avec les vins sous leur seuil
      (« À RÉASSORTIR — 3 vins »), et la capture affichée le montre.
      C'est donc cette somme que la vitrine annonce.
    */
    expect(
      String(bas + epuise),
      `le nombre de références à traiter a changé (${bas} sous leur seuil, ${epuise} épuisée·s)`,
    ).toBe(VIGILANCE.nombre);
    expect(
      VIGILANCE.dit,
      "le détail de la vigilance ne décrit plus la réalité du produit",
    ).toBe(
      `${bas === 2 ? "deux" : String(bas)} sous leur seuil, ${epuise === 1 ? "un épuisé" : `${epuise} épuisés`}`,
    );
  });

  /**
   * LE DÉTAIL DESSINÉ TIENT À LA MÊME LAISSE.
   *
   * Les quatre chiffres annoncés étaient déjà gardés. Les planches du volet
   * « Piloter votre cave » en publient d'autres — la composition par
   * couleur, le détail de l'addition, les trois références sous
   * surveillance — et ceux-là passeraient inaperçus s'ils dérivaient : ils
   * sont DESSINÉS, donc invisibles à toute recherche de texte.
   */
  test("le détail que les planches dessinent, recalculé lui aussi", ({}, info) => {
    test.skip(info.project.name !== "bureau", "Une seule exécution suffit.");
    test.skip(
      !existsSync(FIXTURE) || !existsSync(DEMO),
      `Dépôt produit absent — ce garde-fou n'a de sens qu'à côté de ${ATELIER}.`,
    );

    const vins = lireVinsDetail(readFileSync(FIXTURE, "utf8"));
    const stock = lireStock(readFileSync(DEMO, "utf8"));
    expect(vins.size, `aucun vin lu dans ${FIXTURE}`).toBeGreaterThan(10);

    /* ── LA COMPOSITION PAR COULEUR ── */
    const parCouleur = new Map<string, number>();
    let bouteilles = 0;
    let valorisees = 0;
    for (const [id, v] of vins) {
      const [q] = stock.get(id) ?? [null, null];
      if (q == null) continue;
      bouteilles += q;
      if (v.prix != null && v.prix > 0) valorisees++;
      if (v.couleur)
        parCouleur.set(v.couleur, (parCouleur.get(v.couleur) ?? 0) + q);
    }

    for (const famille of COMPOSITION) {
      expect(
        parCouleur.get(famille.cle),
        `« ${famille.nom} » ne compte plus ${famille.bouteilles} bouteilles chez le produit`,
      ).toBe(famille.bouteilles);
    }
    /* Aucune couleur du produit ne doit manquer à la planche : une famille
       nouvelle la rendrait fausse sans rien faire échouer ailleurs. */
    expect(
      [...parCouleur.keys()].sort(),
      "une couleur du produit n'est pas dessinée par la planche",
    ).toEqual([...COMPOSITION.map((c) => c.cle)].sort());
    expect(
      COMPOSITION.reduce((somme, c) => somme + c.bouteilles, 0),
      "la composition ne somme plus au total de bouteilles",
    ).toBe(bouteilles);

    /* ── L'ADDITION DU BORDEREAU ── */
    let montre = 0;
    for (const ligne of ADDITION.lignes) {
      const trouve = [...vins.values()].find((v) => v.nom === ligne.nom);
      expect(
        trouve,
        `« ${ligne.nom} » n'existe plus dans la cave de référence`,
      ).toBeTruthy();
      const id = [...vins.entries()].find(([, v]) => v.nom === ligne.nom)![0];
      const [q] = stock.get(id) ?? [null, null];
      expect(trouve!.prix, `le prix de « ${ligne.nom} » a changé`).toBe(
        ligne.prix,
      );
      expect(q, `le stock de « ${ligne.nom} » a changé`).toBe(ligne.bouteilles);
      expect(
        ligne.prix * ligne.bouteilles,
        `la ligne « ${ligne.nom} » ne fait pas son propre total`,
      ).toBe(ligne.total);
      montre += ligne.total;
    }
    const total = Number(VALEUR.montant.replace(/[^\d]/g, ""));
    expect(
      ADDITION.reste.total,
      "le reste groupé ne complète plus l'addition",
    ).toBe(total - montre);
    expect(
      ADDITION.reste.references,
      "le nombre de références restantes a changé",
    ).toBe(valorisees - ADDITION.lignes.length);

    /* ── LES TROIS JAUGES ── */
    const sortiesDuLot: {
      nom: string;
      bouteilles: number;
      seuil: number | null;
    }[] = [];
    for (const [id, v] of vins) {
      const [q, seuil] = stock.get(id) ?? [null, null];
      if (q == null) continue;
      if (q === 0)
        sortiesDuLot.push({ nom: v.nom, bouteilles: 0, seuil: null });
      else if (q <= (seuil ?? SEUIL_DEFAUT))
        sortiesDuLot.push({
          nom: v.nom,
          bouteilles: q,
          seuil: seuil ?? SEUIL_DEFAUT,
        });
    }
    /* On compare les ENSEMBLES : une référence qui entrerait ou sortirait de
       la liste doit faire échouer, pas seulement un chiffre qui bouge. */
    const clef = (r: {
      nom: string;
      bouteilles: number;
      seuil: number | null;
    }) => `${r.nom}|${r.bouteilles}|${r.seuil}`;
    expect(
      sortiesDuLot.map(clef).sort(),
      "les références sous surveillance ne sont plus celles que la planche dessine",
    ).toEqual(SEUILS.map(clef).sort());
    expect(
      String(SEUILS.length),
      "le nombre de jauges ne suit plus le chiffre annoncé",
    ).toBe(VIGILANCE.nombre);
  });
});
