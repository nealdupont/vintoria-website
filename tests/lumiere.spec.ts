import { test, expect } from "@playwright/test";

/**
 * L'ACCUEIL EN LUMIÈRE TRAVERSÉE.
 *
 * Ces tests ne jugent pas du goût. Ils gardent les défauts qui NE FONT
 * ÉCHOUER AUCUN BUILD — ceux qu'on ne voit qu'à l'œil, et seulement si on
 * pense à regarder au bon endroit :
 *
 *   · une ancre de navigation qui ne mène nulle part ;
 *   · `position: sticky` tué par un `overflow: hidden` sur un ancêtre ;
 *   · une couleur décorative passée en texte ;
 *   · la scène qui disparaît sous `prefers-reduced-motion` au lieu de
 *     s'immobiliser.
 *
 * Les deux premiers sont réellement survenus pendant la construction.
 */

test.describe("La scène existe sans parler", () => {
  test("la lumière est décorative : elle ne se lit pas", async ({ page }) => {
    await page.goto("/");
    // Le jet, le vin, la flaque : présents, et tous hors de l'arbre lu.
    for (const classe of [".jet", ".jet-vin", ".flaque", ".sol"]) {
      const n = await page.locator(classe).count();
      expect(n, `${classe} absent — la scène ne se rend pas`).toBeGreaterThan(
        0,
      );
    }
    const parlants = await page.evaluate(
      () =>
        [
          ...document.querySelectorAll(
            ".jet, .jet-vin, .flaque, .sol, .flaque-coeur",
          ),
        ].filter(
          (e) =>
            !e.closest("[aria-hidden='true']") &&
            e.getAttribute("aria-hidden") !== "true",
        ).length,
    );
    expect(
      parlants,
      "un élément de décor est exposé aux lecteurs d’écran",
    ).toBe(0);
  });

  test("les jetons clairs s’appliquent — et le texte n’est jamais pâle", async ({
    page,
  }) => {
    await page.goto("/");
    const fond = await page.evaluate(() =>
      getComputedStyle(document.querySelector(".lumiere")!)
        .getPropertyValue("--color-fond")
        .trim(),
    );
    expect(fond).toBe("#f7f4ed");

    /*
      L'or (1,7:1) et la sauge (2,9:1) sont INTERDITS en texte sur l'ivoire.
      On ne vérifie pas la règle dans la feuille de style — on vérifie
      qu'AUCUN élément de texte rendu n'a fini par les porter.
    */
    const interdits = await page.evaluate(() => {
      const proches = (c: string, cible: [number, number, number]) => {
        const m = c.match(/\d+/g);
        if (!m) return false;
        return cible.every((v, i) => Math.abs(Number(m[i]) - v) < 12);
      };
      return [...document.querySelectorAll<HTMLElement>("main *, section *")]
        .filter(
          (e) =>
            (e.textContent ?? "").trim().length > 0 && e.children.length === 0,
        )
        .filter((e) => {
          const c = getComputedStyle(e).color;
          return proches(c, [201, 169, 78]) || proches(c, [143, 165, 138]);
        })
        .map((e) => `${e.tagName}: ${(e.textContent ?? "").slice(0, 30)}`);
    });
    expect(
      interdits,
      `couleur décorative employée en texte : ${interdits.join(" | ")}`,
    ).toEqual([]);
  });
});

test.describe("Les ancres de navigation mènent quelque part", () => {
  test("chaque entrée du sommaire désigne une section réelle", async ({
    page,
  }) => {
    await page.goto("/");
    const cibles = await page.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLAnchorElement>('header a[href^="/#"]'),
      ].map((a) => a.getAttribute("href")!.slice(1)),
    );
    expect(cibles.length, "aucune ancre à vérifier").toBeGreaterThan(0);
    const mortes = await page.evaluate(
      (l) => l.filter((h) => !document.querySelector(h)),
      cibles,
    );
    expect(mortes, `ancre sans destination : ${mortes.join(", ")}`).toEqual([]);
  });
});

test.describe("L’écran convive avance au défilement", () => {
  /**
   * LES TROIS TEMPS SONT DES CARTES, ET ELLES S'OUVRENT VRAIMENT.
   *
   * Ce test remplace celui qui surveillait le mécanisme collant. La
   * section ne colle plus rien : elle coûtait 3,2 écrans de défilement
   * pour cent six mots, et trois blocs pleine hauteur y défilaient le
   * long d'une capture permanente. Le garde-fou précédent aurait
   * continué de passer — il mesurait un élément replié, de hauteur
   * nulle — sans plus rien vérifier. Il est donc remplacé, pas gardé.
   */
  test("les trois temps s’ouvrent, et disent leur état", async ({ page }) => {
    await page.goto("/");
    const cartes = page.locator("#instant button[aria-expanded]");
    await expect(cartes).toHaveCount(3);

    const premiere = cartes.first();
    await expect(premiere).toHaveAttribute("aria-expanded", "false");

    /* Le panneau que la carte commande existe, et il est bien le sien. */
    const idPanneau = await premiere.getAttribute("aria-controls");
    expect(idPanneau, "la carte ne commande aucun panneau").toBeTruthy();

    await premiere.click();
    await expect(premiere).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(`#${idPanneau} img`)).toBeVisible();

    /* Une seule à la fois : ouvrir la deuxième referme la première. */
    await cartes.nth(1).click();
    await expect(premiere).toHaveAttribute("aria-expanded", "false");
    await expect(cartes.nth(1)).toHaveAttribute("aria-expanded", "true");
  });

  test("la section ne mange plus le défilement", async ({ page }) => {
    await page.goto("/");
    const h = await page.evaluate(() => {
      const s = document.querySelector("#instant")!;
      return s.getBoundingClientRect().height / window.innerHeight;
    });
    /*
      Elle valait 3,2 écrans sur desktop. Le plafond est posé à 1,8 : de
      quoi respirer, pas de quoi reconstruire un tunnel.
    */
    expect(h, `la section occupe ${h.toFixed(1)} écrans`).toBeLessThan(1.8);
  });

  test("les trois temps sont de vraies captures, et toutes nommées", async ({
    page,
  }) => {
    await page.goto("/");
    const img = page.locator("#instant img");
    await expect(img).toHaveCount(3);
    for (const src of ["plats", "couleur", "resultat"]) {
      await expect(page.locator(`#instant img[src*="${src}"]`)).toHaveCount(1);
    }
    const sansNom = await page.evaluate(
      () =>
        [...document.querySelectorAll("#instant img")].filter(
          (i) => !(i.getAttribute("alt") ?? "").trim(),
        ).length,
    );
    expect(sansNom, "une capture sans alternative textuelle").toBe(0);
  });

  test("la carte se gouverne aussi au clavier", async ({ page }) => {
    await page.goto("/");
    const premiere = page.locator("#instant button[aria-expanded]").first();
    await premiere.focus();
    await expect(premiere).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(premiere).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Enter");
    await expect(premiere).toHaveAttribute("aria-expanded", "false");
  });

  /**
   * CE QUI SUIT GARDE TROIS DÉFAUTS QUI ONT VÉCU SANS ÊTRE VUS.
   *
   * Les trois passaient la suite entière. Le premier creusait 864 px de
   * blanc dans deux cartes sur trois dès qu'on en ouvrait une ; le
   * deuxième laissait une règle CSS sans aucun effet ; le troisième
   * posait une lumière qu'on ne distinguait pas de son absence. Aucun
   * n'était une erreur de logique : tous les trois étaient des erreurs de
   * RENDU, et seul le rendu pouvait les dire. Ces garde-fous mesurent
   * donc des pixels, pas des attributs.
   */
  test("ouvrir une carte ne gonfle pas ses voisines", async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== "bureau",
      "Le défaut n’existe qu’en rangée : mobile n’a qu’une colonne.",
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    /*
      ON MESURE DEUX CHOSES, PARCE QU'IL Y A DEUX FAÇONS DE RETOMBER.

      La CARTE est ce que le lecteur voit. La CASE est l'élément que la
      grille dispose — aujourd'hui l'enveloppe qui porte l'animation
      d'entrée, demain peut-être la carte elle-même. Ne surveiller que la
      carte laissait passer le retrait d'`items-start` : l'enveloppe
      encaissait l'étirement et la carte ne bronchait pas. Ne surveiller
      que la case laisserait passer l'inverse. Les deux, donc.
    */
    const mesurer = () =>
      page.evaluate(() => {
        const cartes = [...document.querySelectorAll("#instant article")];
        let grille = cartes[0].parentElement!;
        while (grille && getComputedStyle(grille).display !== "grid") {
          grille = grille.parentElement!;
        }
        const casDe = (c: Element) => {
          let e: Element = c;
          while (e.parentElement && e.parentElement !== grille) {
            e = e.parentElement;
          }
          return e;
        };
        const h = (e: Element) => Math.round(e.getBoundingClientRect().height);
        return {
          cartes: cartes.map(h),
          cases: cartes.map((c) => h(casDe(c))),
        };
      });

    const fermees = await mesurer();
    expect(
      fermees.cartes,
      "les trois cartes fermées ne font pas la même hauteur",
    ).toEqual([fermees.cartes[0], fermees.cartes[0], fermees.cartes[0]]);

    await page.locator("#instant button[aria-expanded]").nth(1).click();
    await page.waitForTimeout(800);
    const ouvertes = await mesurer();

    /* La carte ouverte grandit — sans quoi ce test ne mesurerait rien. */
    expect(
      ouvertes.cartes[1],
      "la carte ouverte n’a pas grandi : le test ne prouve rien",
    ).toBeGreaterThan(fermees.cartes[1] * 2);

    /* Et ses deux voisines n’ont bougé ni de carte, ni de case. */
    expect(
      [ouvertes.cartes[0], ouvertes.cartes[2]],
      `les cartes voisines ont gonflé de ${ouvertes.cartes[0] - fermees.cartes[0]} et ${ouvertes.cartes[2] - fermees.cartes[2]} px`,
    ).toEqual([fermees.cartes[0], fermees.cartes[2]]);
    expect(
      [ouvertes.cases[0], ouvertes.cases[2]],
      `les cases voisines se sont étirées de ${ouvertes.cases[0] - fermees.cases[0]} et ${ouvertes.cases[2] - fermees.cases[2]} px : la grille étire encore sa rangée`,
    ).toEqual([fermees.cases[0], fermees.cases[2]]);
  });

  test("la carte se lève vraiment, à la souris comme au clavier", async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== "bureau",
      "La levée répond au survol : elle n’a pas de sens au doigt.",
    );
    await page.goto("/");
    const carte = page.locator("#instant article").first();
    const bouton = page.locator("#instant button[aria-expanded]").first();
    await carte.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    const y = async () => (await carte.boundingBox())!.y;

    const repos = await y();
    await bouton.hover();
    await page.waitForTimeout(500);
    const survol = await y();
    expect(
      survol - repos,
      `la carte ne se lève pas au survol (${(survol - repos).toFixed(2)} px)`,
    ).toBeLessThan(-2);

    /* Au clavier, exactement la même chose : le focus vaut le survol. */
    await page.mouse.move(0, 0);
    await page.waitForTimeout(500);
    await bouton.focus();
    await page.waitForTimeout(500);
    const clavier = await y();
    expect(
      clavier - repos,
      `la carte ne se lève pas au focus (${(clavier - repos).toFixed(2)} px)`,
    ).toBeLessThan(-2);
  });

  test("le halo se voit — il ne suffit pas qu’il soit déclaré", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "bureau", "Une seule exécution suffit.");
    await page.goto("/");
    const carte = page.locator("#instant article").first();
    await carte.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);

    const r = (await carte.boundingBox())!;
    /* Le cœur du dégradé : l’angle haut-gauche, d’où part la lumière. */
    const coin = {
      x: Math.round(r.x + 8),
      y: Math.round(r.y + 8),
      width: 40,
      height: 40,
    };
    const eteint = (await page.screenshot({ clip: coin })).toString("base64");
    await carte.evaluate((e) => e.setAttribute("data-jour", "true"));
    await page.waitForTimeout(600);
    const allume = (await page.screenshot({ clip: coin })).toString("base64");

    const ecart = await page.evaluate(
      async ([a, b]: string[]) => {
        const moyenne = async (donnee: string) => {
          const im = new Image();
          im.src = "data:image/png;base64," + donnee;
          await im.decode();
          const t = document.createElement("canvas");
          t.width = im.width;
          t.height = im.height;
          const g = t.getContext("2d")!;
          g.drawImage(im, 0, 0);
          const p = g.getImageData(0, 0, im.width, im.height).data;
          let R = 0;
          let V = 0;
          let B = 0;
          for (let i = 0; i < p.length; i += 4) {
            R += p[i];
            V += p[i + 1];
            B += p[i + 2];
          }
          const n = p.length / 4;
          return [R / n, V / n, B / n];
        };
        const [u, v] = [await moyenne(a), await moyenne(b)];
        return Math.max(...v.map((x, i) => Math.abs(x - u[i])));
      },
      [eteint, allume],
    );

    /*
      PLANCHER À 15 SUR 255. L'ancien réglage rendait 9,8 — mesurable, mais
      au seuil du perceptible (ΔE 3,7). Le réglage actuel rend 20,4, soit
      ΔE 6,8. Le plancher est posé entre les deux : il refuse l'ancien
      sans exiger le maximum, et laisse la direction régler la teinte.
    */
    expect(
      ecart,
      `le halo ne déplace la couleur que de ${ecart.toFixed(1)}/255 : on ne le voit pas`,
    ).toBeGreaterThan(15);
  });
});

/**
 * LA REFONTE GLOBALE — CE QU'ELLE A PROMIS, ET QUI PEUT SE DÉFAIRE.
 *
 * Quatre promesses mesurables, quatre garde-fous. Aucun ne vérifie une
 * intention : tous mesurent le rendu, parce que c'est là que les trois
 * défauts du pilote s'étaient logés sans qu'aucun test les voie.
 */
test.describe("La refonte tient ses mesures", () => {
  test("le propos de l’accueil n’attend pas la scène", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "bureau", "Une seule exécution suffit.");
    /*
      MESURÉ AVANT CORRECTION : le titre valait 0,00 à 1,6 s et 0,50 à
      2,6 s ; l'appel à l'action n'était entier qu'à 4,2 s. La scène se
      jouait d'abord, le propos ensuite. Les seuils ci-dessous sont posés
      LARGES — deux secondes pour le titre, trois pour l'action — parce
      qu'une machine chargée a le droit d'être lente. Ils restent très en
      dessous de l'ancienne séquence, qu'ils refusent sans ambiguïté.
    */
    await page.goto("/", { waitUntil: "commit" });
    const depart = Date.now();

    await page.waitForTimeout(Math.max(0, 2000 - (Date.now() - depart)));
    const titre = await page.evaluate(() =>
      Math.min(
        ...[...document.querySelectorAll("#ouverture h1 span")].map(
          (e) => +getComputedStyle(e).opacity,
        ),
      ),
    );
    expect(
      titre,
      `le titre de l’accueil vaut encore ${titre.toFixed(2)} après deux secondes`,
    ).toBeGreaterThan(0.9);

    await page.waitForTimeout(Math.max(0, 3000 - (Date.now() - depart)));
    const action = await page.evaluate(() => {
      const b = document.querySelector("#ouverture .bouton-primaire")!;
      return +getComputedStyle(b.closest("[style]") ?? b).opacity;
    });
    expect(
      action,
      `l’appel à l’action vaut encore ${action.toFixed(2)} après trois secondes`,
    ).toBeGreaterThan(0.9);
  });

  test("rien d’essentiel ne reste caché sous les yeux du lecteur", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "bureau", "Une seule exécution suffit.");
    /*
      LA RÈGLE N'EST PAS « TOUT EST VISIBLE ». Un bloc sous la ligne de
      flottaison a le droit d'attendre son tour — c'est le principe même
      d'une révélation au défilement. La règle est : ce que le lecteur a
      SOUS LES YEUX doit être lisible. On arrive donc sur chaque ancre,
      comme depuis le sommaire, et on ne regarde que le champ visible.

      Les deux exceptions sont déclarées, pas tolérées : la feuille de la
      carte des vins joue une séquence de plusieurs secondes, et l'écran
      de la salle s'efface VOLONTAIREMENT pendant que le carré s'en
      détache. Les deux sont des gestes, pas des oublis.
    */
    const ancres = [
      "ouverture",
      "geste",
      "cave",
      "table",
      "instant",
      "pourqui",
      "formules",
      "invitation",
    ];
    const fautifs: string[] = [];
    for (const id of ancres) {
      await page.goto(`/#${id}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(2600);
      const vus = await page.evaluate(() => {
        const out: string[] = [];
        for (const x of document.querySelectorAll("section[id] *")) {
          if (
            x.closest("[aria-hidden='true']") ||
            x.classList.contains("jet") ||
            x.classList.contains("jet-vin") ||
            x.classList.contains("voile-sauge") ||
            /* Le geste de la salle : l'écran s'efface par construction. */
            x.closest("#table .objet")
          ) {
            continue;
          }
          if (+getComputedStyle(x).opacity >= 0.9) continue;
          const b = x.getBoundingClientRect();
          if (b.height < 4 || b.bottom <= 8 || b.top >= innerHeight - 8) {
            continue;
          }
          if (out.length > 6) break;
          out.push(
            `${x.tagName.toLowerCase()} « ${(x.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 34)} »`,
          );
        }
        return out;
      });
      if (vus.length) fautifs.push(`/#${id} → ${vus.join(" · ")}`);
    }
    expect(fautifs, `du contenu reste masqué dans le champ`).toEqual([]);
  });

  test("les deux écrans de la cave sont un vrai jeu d’onglets", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "bureau", "Le clavier suffit une fois.");
    await page.goto("/");
    await page.evaluate(() =>
      document.querySelector("#cave")!.scrollIntoView({ block: "center" }),
    );
    await page.waitForTimeout(1200);

    const onglets = page.locator("#cave [role='tab']");
    await expect(onglets).toHaveCount(2);
    await expect(onglets.first()).toHaveAttribute("aria-selected", "true");
    await expect(onglets.nth(1)).toHaveAttribute("aria-selected", "false");

    /* Le premier écran est le relevé, le second le réassort — et ce sont
       deux captures RÉELLES, nommées, pas deux cadrages de la même. */
    const src = async () =>
      page.locator("#cave [role='tabpanel'] img").getAttribute("src");
    expect(await src(), "le relevé n’est pas le premier écran").toContain(
      "cave",
    );

    /* Au clavier : une seule tabulation entre dans le jeu, les flèches
       changent d'écran. C'est le motif que les lecteurs d'écran annoncent. */
    await onglets.first().focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(600);
    await expect(onglets.nth(1)).toBeFocused();
    await expect(onglets.nth(1)).toHaveAttribute("aria-selected", "true");
    expect(await src(), "la flèche ne change pas d’écran").toContain(
      "reassort",
    );

    /* Et le cadre ne bouge pas d'un pixel en changeant d'écran : les deux
       captures n'ont pas le même format, la page ne doit pas le sentir. */
    const cadre = page.locator("#cave [role='tabpanel']");
    const avant = (await cadre.boundingBox())!.height;
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(700);
    const apres = (await cadre.boundingBox())!.height;
    expect(
      Math.round(apres),
      `le panneau change de hauteur en changeant d’écran (${Math.round(avant)} → ${Math.round(apres)})`,
    ).toBe(Math.round(avant));
  });

  test("les huit mouvements partagent un seul rythme vertical", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "bureau", "Une seule exécution suffit.");
    /*
      Chaque section déclarait sa propre respiration, et elles ne
      concordaient pas : 144 px en haut pour l'une, 112 pour sa voisine.
      `.mouvement` les tient maintenant toutes. L'ouverture en est exclue :
      elle occupe une hauteur d'écran entière, elle n'a pas de marge.
    */
    await page.goto("/");
    const r = await page.evaluate(() => {
      const s = [...document.querySelectorAll("section[id]")].filter(
        (x) => x.id !== "ouverture",
      );
      return {
        total: s.length,
        rythmees: s.filter((x) => x.classList.contains("mouvement")).length,
        hauts: [...new Set(s.map((x) => getComputedStyle(x).paddingTop))],
      };
    });
    expect(
      r.rythmees,
      `${r.total - r.rythmees} section(s) gardent leur propre respiration`,
    ).toBe(r.total);
    expect(
      r.hauts.length,
      `${r.hauts.length} respirations différentes : ${r.hauts.join(", ")}`,
    ).toBe(1);
  });
});

/**
 * LES TROIS FORMULES — CE QU'ELLES PROMETTENT, ET CE QU'ELLES TAISENT.
 *
 * Cette section est la seule de l'accueil qui parle d'argent. Deux
 * risques, donc, et deux natures de garde-fou : qu'elle publie un prix
 * qui n'est pas confirmé, et qu'elle annonce une fonctionnalité que
 * l'application ne rend pas. Les deux se vérifient contre la donnée,
 * jamais contre une chaîne écrite à la main dans le test.
 */
test.describe("Les formules disent le produit, et rien de plus", () => {
  test("aucun prix n’est publié tant qu’il n’est pas confirmé", async ({
    page,
  }) => {
    await page.goto("/");
    const texte = await page.evaluate(() =>
      (document.querySelector("#formules")?.textContent ?? "").replace(
        /\s+/g,
        " ",
      ),
    );
    if (!tarifsPublies()) {
      /* Les montants du catalogue ne doivent apparaître nulle part tant
         que la facturation n'est pas branchée — ni en chiffres, ni
         accompagnés d'une périodicité qui les rendrait crédibles. */
      for (const cle of ORDRE) {
        const montant = CATALOGUE_PRODUIT[cle];
        if (montant === null) continue;
        expect(
          texte,
          `le montant ${montant} € est publié alors que les tarifs ne sont pas publiables`,
        ).not.toContain(String(montant));
      }
      expect(
        texte,
        "une périodicité est affichée sous un prix qui n’existe pas",
      ).not.toContain("/ mois");
      expect(texte, "la réponse honnête manque").toContain("Sur demande");
    }
  });

  test("les trois formules s’ouvrent, une seule à la fois", async ({
    page,
  }) => {
    await page.goto("/");
    const boutons = page.locator("#formules button[aria-expanded]");
    await expect(boutons).toHaveCount(3);
    const region = page.locator("#formules [role='region']");
    await expect(region).toHaveAttribute("aria-hidden", "true");

    await boutons.nth(1).click();
    await expect(boutons.nth(1)).toHaveAttribute("aria-expanded", "true");
    await expect(region).toHaveAttribute("aria-hidden", "false");

    /* Ouvrir la troisième referme la deuxième : trois détails dépliés en
       même temps redonneraient le catalogue que la section remplace. */
    await boutons.nth(2).click();
    await expect(boutons.nth(1)).toHaveAttribute("aria-expanded", "false");
    await expect(boutons.nth(2)).toHaveAttribute("aria-expanded", "true");

    /* Et le panneau dit DE QUI il parle. */
    const titre = await region.getAttribute("aria-labelledby");
    expect(titre, "le panneau ne désigne pas la formule ouverte").toBeTruthy();
    expect(
      await page.locator(`#${titre}`).innerText(),
      "le panneau ne désigne pas la bonne formule",
    ).toContain(FORMULES[2].nom);
  });

  test("ouvrir une formule ne déplace pas les deux autres", async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== "bureau",
      "Le défaut n’existe qu’en rangée : mobile n’a qu’une colonne.",
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    const h = () =>
      page.evaluate(() =>
        [...document.querySelectorAll("#formules article")].map((a) =>
          Math.round(a.getBoundingClientRect().height),
        ),
      );
    const avant = await h();
    expect(
      avant,
      "les trois cartes fermées ne font pas la même hauteur",
    ).toEqual([avant[0], avant[0], avant[0]]);

    await page.locator("#formules button[aria-expanded]").nth(1).click();
    await page.waitForTimeout(800);
    expect(await h(), "une carte voisine a changé de hauteur").toEqual(avant);

    const panneau = await page.evaluate(() =>
      Math.round(
        document
          .querySelector("#formules [role='region']")!
          .getBoundingClientRect().height,
      ),
    );
    expect(panneau, "le détail ne s’est pas déplié").toBeGreaterThan(300);
  });

  test("le détail est celui du catalogue, pas une réécriture", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "bureau", "Une seule exécution suffit.");
    await page.goto("/");
    /* On ouvre la formule du milieu : c'est la seule qui ait à la fois des
       ajouts, des inclusions et des exclusions. */
    await page.locator("#formules button[aria-expanded]").nth(1).click();
    await page.waitForTimeout(700);
    const texte = (
      await page.locator("#formules [role='region']").innerText()
    ).replace(/\s+/g, " ");

    const cle = FORMULES[1].cle;
    for (const t of comprisDans(cle)) {
      expect(texte, `« ${t.intitule} » est compris et n’est pas dit`).toContain(
        t.intitule,
      );
    }
    for (const t of absentDe(cle)) {
      expect(
        texte,
        `« ${t.intitule} » n’est pas compris et la page ne le dit pas`,
      ).toContain(t.intitule);
    }
    expect(
      ajoutsSur(cle).length,
      "la formule du milieu n’ajoute rien : les trois offres ne sont plus différenciées",
    ).toBeGreaterThan(3);
  });

  test("l’accueil et /tarifs annoncent exactement le même prix", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "bureau", "Une seule exécution suffit.");
    /*
      DEUX SURFACES, UNE SEULE SOURCE. Avant, chacune portait sa propre
      fonction `Prix` : deux copies d'une règle commerciale, qui pouvaient
      diverger sans que rien ne se casse — deux pages annonçant deux prix
      différents pour la même offre se rendent très bien. Les deux lisent
      désormais `lib/tarifs.ts` par le même composant, et ce test le
      vérifie SUR LE RENDU, pas sur les imports.

      La troisième surface — le parcours d'abonnement — vit dans
      l'application, hors de ce dépôt. Elle se vérifiera contre la même
      configuration le jour où les deux projets la partageront.
    */
    const lire = async (url: string) => {
      await page.goto(url);
      return page.evaluate(() =>
        Object.fromEntries(
          [...document.querySelectorAll("[data-prix]")].map((e) => [
            e.getAttribute("data-prix"),
            /* ON COMPARE L'INFORMATION, PAS SA COMPOSITION. La carte
               d'accueil compose la mention en petites capitales, la page
               des formules en bas-de-casse : c'est une décision
               typographique, et elle n'a pas à faire échouer un test
               commercial. Ce qui ne doit jamais diverger, ce sont les
               MOTS et les CHIFFRES. */
            (e as HTMLElement).innerText
              .replace(/\s+/g, " ")
              .trim()
              .toLocaleLowerCase("fr"),
          ]),
        ),
      );
    };
    const accueil = await lire("/");
    const tarifs = await lire("/tarifs");

    expect(
      Object.keys(accueil).sort(),
      "les deux pages ne couvrent pas les mêmes formules",
    ).toEqual(Object.keys(tarifs).sort());
    expect(Object.keys(accueil).length, "aucun prix rendu").toBe(3);
    for (const cle of Object.keys(accueil)) {
      expect(
        accueil[cle],
        `« ${cle} » n’est pas annoncé pareil sur l’accueil et sur /tarifs`,
      ).toBe(tarifs[cle]);
    }
  });

  test("l’affichage des tarifs demande la décision ET les données", async ({}, info) => {
    test.skip(info.project.name !== "bureau", "C’est une règle, pas un rendu.");
    /*
      Deux conditions, et il en faut deux. Une signature commerciale seule
      laisserait publier une configuration incomplète — un montant sans
      périodicité, ou sans identifiant Stripe. Des données complètes seules
      laisseraient publier des montants que personne n'a validés.

      Aujourd'hui aucune des deux n'est remplie, et c'est l'état voulu.
    */
    const { valide, manques } = configurationComplete();
    expect(
      tarifsPublies(),
      "des tarifs sont publiables alors que Stripe n’est pas branché",
    ).toBe(false);
    expect(
      valide,
      "la configuration se dit complète alors qu’elle est vide",
    ).toBe(false);
    /* Et elle sait dire ce qui lui manque, formule par formule. */
    for (const cle of ORDRE) {
      expect(
        manques[cle],
        `la configuration ne signale rien pour « ${cle} »`,
      ).toContain("identifiant Stripe");
    }
  });

  test("la section ne porte aucun appel à l’action principal", async ({
    page,
  }) => {
    /*
      La page n'en a que deux — le héros et l'invitation. Trois cartes
      commerciales portant chacune un bouton plein les auraient noyés, et
      le lecteur sollicité quatre fois n'écoute plus. Les cartes proposent
      en second rang ; l'invitation reste la seule à demander.
    */
    await page.goto("/");
    await expect(page.locator("#formules .bouton-primaire")).toHaveCount(0);
    await expect(page.locator("#formules .bouton-second")).not.toHaveCount(0);
  });
});

test.describe("La page se tait quand on le lui demande", () => {
  test.use({ reducedMotion: "reduce" });

  test("rien ne s’anime, mais la scène reste COMPOSÉE", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(900);

    const enCours = await page.evaluate(
      () =>
        (
          document as Document & {
            getAnimations(o?: GetAnimationsOptions): Animation[];
          }
        )
          .getAnimations({ subtree: true })
          .filter((a) => a.playState === "running").length,
    );
    expect(
      enCours,
      "des animations tournent malgré prefers-reduced-motion",
    ).toBe(0);

    // On retire le MOUVEMENT, pas la lumière ni le propos.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('#ouverture img[src*="symbole"]')).toBeVisible();
    // Le verre est tracé ENTIÈREMENT : sans mouvement, pas de demi-verre.
    const trace = await page.evaluate(() =>
      [
        ...document.querySelectorAll(
          "#ouverture svg path, #ouverture svg ellipse",
        ),
      ]
        .filter((e) => getComputedStyle(e).strokeDasharray !== "none")
        .map((e) => Number.parseFloat(getComputedStyle(e).strokeDashoffset)),
    );
    expect(trace.length, "le verre ne se rend pas").toBeGreaterThan(2);
    expect(Math.max(...trace), "le verre reste à moitié tracé").toBe(0);
    await expect(page.locator(".jet").first()).toBeVisible();
    await expect(page.locator('#instant img[src*="resultat"]')).toBeVisible();
  });

  /*
    ON RETIRE LE DÉPLACEMENT, PAS L'ÉTAT. Une carte survolée doit rester
    reconnaissable comme survolée même sans mouvement : le halo et le
    filet portent l'information, la levée n'en porte aucune. C'est la
    distinction que ce test garde — et elle est fragile, parce que la
    levée appartient maintenant à Motion, qui pourrait l'oublier.
  */
  test("la carte garde sa lumière et perd son déplacement", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "bureau", "Le survol demande une souris.");
    await page.goto("/");
    const carte = page.locator("#instant article").first();
    await carte.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const avant = (await carte.boundingBox())!.y;
    await page.locator("#instant button[aria-expanded]").first().hover();
    await page.waitForTimeout(400);
    const apres = (await carte.boundingBox())!.y;

    expect(
      apres - avant,
      "la carte se déplace malgré prefers-reduced-motion",
    ).toBe(0);
    expect(
      await carte.evaluate((e) => getComputedStyle(e, "::before").opacity),
      "le halo s’est éteint avec le mouvement : l’état n’est plus lisible",
    ).toBe("1");
  });
});

test.describe("Rien ne déborde, à aucune largeur", () => {
  for (const l of [320, 390, 768, 1024, 1280, 1440, 1920]) {
    test(`l’objet posé ne pousse pas la page à ${l} px`, async ({ page }) => {
      await page.setViewportSize({ width: l, height: 900 });
      await page.goto("/");
      await page.waitForTimeout(400);
      /*
        `overflow-x` masquerait le défaut : on mesure la GÉOMÉTRIE. L'écran
        du héros déborde volontairement à droite ; il ne doit jamais pour
        autant élargir le document.
      */
      const { doc, vue } = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        vue: window.innerWidth,
      }));
      expect(
        doc,
        `${doc}px de document pour ${vue}px de fenêtre`,
      ).toBeLessThanOrEqual(vue + 1);
    });
  }
});

/* ══════════════════════════════════════════════════════════════
   L'ACCUEIL COMPLET — HUIT MOUVEMENTS

   Ces tests gardent ce qu'une relecture ne voit pas : l'ordre du récit,
   la continuité de l'arc de lumière, et l'ÉTAT FINAL de chaque geste.
   Un geste qui n'arrive pas à son terme ne casse aucun build : il laisse
   simplement un écran à moitié révélé, ou un carré qui ne part jamais.
   ══════════════════════════════════════════════════════════════ */

import { HEURES } from "../lib/lumiere";
import {
  FORMULES,
  ORDRE,
  absentDe,
  ajoutsSur,
  comprisDans,
} from "../lib/formules";
import {
  CATALOGUE_PRODUIT,
  configurationComplete,
  tarifsPublies,
} from "../lib/tarifs";
import {
  ADDITION,
  COMPOSITION,
  COMPTE,
  VALEUR,
} from "../lib/cave-demonstration";

/** Amène la page à son état stable : images paresseuses chargées, gestes
 *  déclenchés, arrivées posées. Sans cela on mesure un état transitoire. */
async function parcourir(page: import("@playwright/test").Page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(1600);
}

test.describe("L’arc du jour", () => {
  test("le bas de chaque heure est le haut de la suivante", () => {
    /*
      Une marche de cinq valeurs sur 255 se lit à l'œil sur un aplat, et
      elle est invisible quand on relit huit composants séparément. Elle
      s'est produite une fois, entre Le geste et La cave.
    */
    for (let i = 0; i < HEURES.length - 1; i++) {
      expect(
        HEURES[i].bas,
        `raccord ${HEURES[i].cle} → ${HEURES[i + 1].cle}`,
      ).toBe(HEURES[i + 1].haut);
    }
    // Et jamais de noir : la lumière baisse, elle ne s'éteint pas.
    for (const h of HEURES) {
      for (const c of [h.haut, h.bas]) {
        const l = Number.parseInt(c.slice(1, 3), 16);
        expect(l, `${h.cle} tire vers le noir (${c})`).toBeGreaterThan(0xc0);
      }
    }
  });

  test("les neuf mouvements sont montés, dans l’ordre du récit", async ({
    page,
  }) => {
    /*
      NEUF DEPUIS QUE LES FORMULES SONT ENTRÉES. Elles se placent entre la
      respiration et l'heure dorée : après « pour qui », où le lecteur
      s'est reconnu, et avant « l'invitation », qui demande. Déplacer
      cette ligne, c'est déplacer le moment où l'on parle d'argent — le
      test est là pour que ce soit une décision, pas un effet de bord.
    */
    await page.goto("/");
    const ids = await page.evaluate(() =>
      [...document.querySelectorAll("section[id]")].map((e) => e.id),
    );
    expect(ids).toEqual([
      "ouverture",
      "geste",
      "cave",
      "carte",
      "table",
      "instant",
      "pourqui",
      "formules",
      "invitation",
    ]);
  });

  test("un seul appel à l’action principal sur toute la page", async ({
    page,
  }) => {
    await page.goto("/");
    /*
      Un lecteur sollicité à chaque section n'écoute plus aucune
      sollicitation. Le héros ouvre, l'invitation ferme — rien entre les
      deux. (L'en-tête a le sien, il n'est pas dans le fil de lecture.)
    */
    const n = await page.locator("section .bouton-primaire").count();
    expect(n, "trop d’appels à l’action dans le fil de lecture").toBe(2);
  });
});

test.describe("Chaque geste arrive à son terme", () => {
  /*
   * LE MOUVEMENT II A CHANGÉ DE NATURE, et trois tests avec lui.
   * Il décrivait ; il propose désormais un choix. Les trois gardes qui
   * suivent remplacent celles qui gardaient l'ancienne décision —
   * hiérarchie de 01 sur 02-03, accent réservé à deux emplois, aucune
   * affordance — et qui seraient devenues fausses sans rien signaler.
   */

  test("les trois portes mènent réellement quelque part", async ({ page }) => {
    /*
      Une porte qui ne s'ouvre pas est pire qu'une absence de porte : la
      flèche, le survol et le curseur promettent, et rien ne tient. On
      vérifie donc que chacune ouvre un détail DISTINCT, et que le détail
      porte bien le titre de la porte dont on vient.
    */
    await page.goto("/");
    await parcourir(page);
    await page.evaluate(() =>
      document.querySelector("#geste")!.scrollIntoView({ block: "start" }),
    );
    await page.waitForTimeout(600);

    const portes = page.locator("#geste button[aria-controls='geste-detail']");
    await expect(portes).toHaveCount(3);

    const vus: string[] = [];
    for (let i = 0; i < 3; i++) {
      await portes.nth(i).click();
      await page.waitForTimeout(900);
      const r = await page.evaluate(() => {
        const visible = [
          ...document.querySelectorAll("#geste-detail > div:last-child > *"),
        ].find((e) => Number(getComputedStyle(e).opacity) > 0.9);
        return {
          titre: (visible?.querySelector("h3")?.textContent ?? "").trim(),
          ouvertes: [
            ...document.querySelectorAll(
              "#geste button[aria-controls='geste-detail'][aria-expanded='true']",
            ),
          ].length,
        };
      });
      expect(r.ouvertes, "deux portes se disent ouvertes à la fois").toBe(1);
      vus.push(r.titre);
      await page
        .locator("#geste-detail button", { hasText: "Les trois façons" })
        .click();
      await page.waitForTimeout(700);
    }
    expect(
      new Set(vus).size,
      `les détails se répètent : ${vus.join(" / ")}`,
    ).toBe(3);
  });

  test("le balayement ne déplace ni la page ni le lecteur", async ({
    page,
  }) => {
    /*
      C'EST LA GARDE LA PLUS UTILE DE LA SECTION. Un détail monté à la
      demande allonge le document de mille pixels d'un coup, le navigateur
      recale le défilement, et le lecteur se retrouve ailleurs — sans
      qu'aucun test ne tombe. Les quatre états partagent donc une même
      cellule de grille : la scène fait la hauteur du plus grand, une fois
      pour toutes. Si quelqu'un démonte cette superposition, ceci tombe.
    */
    await page.goto("/");
    await parcourir(page);
    await page.evaluate(() => {
      (window as unknown as { __n: number }).__n = 0;
      document.querySelector("#geste ul li button")!.scrollIntoView({
        block: "center",
      });
    });
    // On attend que le défilement doux soit VRAIMENT fini avant de mesurer.
    await page.waitForFunction(
      () => {
        const w = window as unknown as { __y?: number; __n?: number };
        const y = Math.round(scrollY);
        if (w.__y === y) w.__n = (w.__n ?? 0) + 1;
        else {
          w.__y = y;
          w.__n = 0;
        }
        return (w.__n ?? 0) > 6;
      },
      null,
      { polling: 60 },
    );

    const etat = () =>
      page.evaluate(() => ({
        y: Math.round(scrollY),
        doc: document.documentElement.scrollHeight,
      }));
    const avant = await etat();

    for (const geste of [
      () =>
        page.evaluate(() =>
          document.querySelector<HTMLElement>("#geste ul li button")!.click(),
        ),
      () =>
        page.evaluate(() =>
          document
            .querySelectorAll<HTMLElement>("#geste-detail button")[3]
            .click(),
        ),
      () =>
        page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>("#geste-detail button")]
            .find((b) => b.textContent!.includes("Les trois"))!
            .click(),
        ),
    ]) {
      await geste();
      await page.waitForTimeout(1100);
      const apres = await etat();
      expect(apres.doc, "le document a changé de hauteur").toBe(avant.doc);
      expect(apres.y, "la page a sauté sous le lecteur").toBe(avant.y);
    }
  });

  test("l’accent ne porte que la structure", async ({ page }) => {
    /*
      L'ancienne règle — deux emplois au plus — appartenait à une section
      sans numéros monumentaux. Ici le bordeaux EST la structure : le mot
      « mieux. » et les trois rangs. Au-delà, il redeviendrait une couleur
      d'ornement, et ne signalerait plus rien. Cinq est la limite.
    */
    await page.goto("/");
    await parcourir(page);
    const n = await page.evaluate(() => {
      const accent = getComputedStyle(document.querySelector("#geste")!)
        .getPropertyValue("--color-accent")
        .trim();
      const toile = document.createElement("canvas");
      toile.width = toile.height = 1;
      const c = toile.getContext("2d")!;
      const rgb = (v: string) => {
        c.fillStyle = v;
        c.fillRect(0, 0, 1, 1);
        return [...c.getImageData(0, 0, 1, 1).data].slice(0, 3).join(",");
      };
      const cible = rgb(accent);
      return [...document.querySelectorAll("#geste *")].filter(
        (e) =>
          e.children.length === 0 &&
          (e.textContent ?? "").trim().length > 0 &&
          /*
            LES TROIS DÉTAILS SONT MONTÉS EN PERMANENCE — c'est ce qui
            immobilise la scène. Compter leurs rangs reviendrait à compter
            trois bordeaux que personne ne voit : `offsetParent` ne les
            écarte pas, la visibilité oui.
          */
          e.checkVisibility({
            visibilityProperty: true,
            opacityProperty: true,
          }) &&
          rgb(getComputedStyle(e).color) === cible,
      ).length;
    });
    expect(
      n,
      `l’accent est employé ${n} fois dans le mouvement II`,
    ).toBeLessThanOrEqual(5);
  });

  test("les chiffres de la cave viennent de la donnée, pas de l’esquisse", async ({
    page,
  }) => {
    /*
      L'esquisse de référence affichait « 24 680 € » et « 12 alertes ».
      Ce sont des nombres de dessinateur. Ceux-ci sont recalculés depuis
      les fixtures du produit (voir tests/chiffres.spec.ts) et doivent
      arriver ici par lib/cave-demonstration.ts, pas par la frappe.
    */
    await page.goto("/");
    await parcourir(page);
    await page.evaluate(() =>
      document.querySelector("#geste")!.scrollIntoView({ block: "start" }),
    );
    await page.waitForTimeout(500);
    await page
      .locator("#geste button[aria-controls='geste-detail']")
      .nth(1)
      .click();
    await page.waitForTimeout(900);
    const r = await page.evaluate(() => {
      const vu = [
        ...document.querySelectorAll("#geste-detail > div:last-child > *"),
      ].find((e) => Number(getComputedStyle(e).opacity) > 0.9)!;
      return {
        /* Les trois chiffres posés en grand dans le jeu de cartes. */
        chiffres: [...vu.querySelectorAll(".jeu .gravure")].map((e) =>
          e.textContent!.trim(),
        ),
        /* Et tout ce que la vue écrit, pour y traquer l'esquisse. */
        tout: vu.textContent ?? "",
      };
    });

    /*
      UN SEUL CHIFFRE EST GRAVÉ, LES AUTRES SONT DESSINÉS.

      Les cartes de la cave portaient trois gravures : 15, 158 et le
      montant. Depuis que le volet est dessiné, le sommaire porte lui-même
      ses comptes et le bordereau porte son addition ; seule la valeur reste
      gravée, parce qu'elle est la conclusion du bordereau et que la graver
      DEUX fois aurait affaibli les deux.

      Le garde-fou suit ce déplacement sans rien relâcher : il vérifie que
      la gravure vaut le montant, ET que les deux autres chiffres sont bien
      ÉCRITS par la vue — `textContent` traverse le SVG, donc un dessin qui
      cesserait de lire `lib/cave-demonstration.ts` ferait échouer ici.
    */
    expect(
      r.chiffres,
      `la vue grave ${r.chiffres.length} chiffre(s) : ${r.chiffres.join(" · ")}`,
    ).toEqual([VALEUR.montant]);

    for (const [quoi, attendu] of [
      ["les références", COMPTE[0].nombre],
      ["les bouteilles", COMPTE[1].nombre],
      ["la plus grosse famille", COMPOSITION[0].bouteilles],
      ["la plus grosse ligne du bordereau", ADDITION.lignes[0].total],
    ] as const) {
      expect(
        r.tout
          .replace(/\u202f|\u00a0/g, " ")
          .includes(String(attendu).replace(/\B(?=(\d{3})+(?!\d))/g, " ")),
        `${quoi} : « ${attendu} » n'est écrit nulle part dans la vue`,
      ).toBe(true);
    }

    /*
      ET AUCUN CHIFFRE DE DESSINATEUR. Ces trois-là venaient de l'esquisse
      de référence ; les reprendre aurait été indécelable à la relecture et
      faux à la première question d'un restaurateur.
    */
    for (const invente of ["24 680", "24 680", "42 vins", "12 alertes"]) {
      expect(
        r.tout.includes(invente),
        `« ${invente} » vient de l’esquisse, pas du produit`,
      ).toBe(false);
    }
  });

  /**
   * LA CARTE EST UN OBJET, PAS UNE CAPTURE.
   *
   * Ce garde-fou remplace celui qui mesurait l'entrée de caméra dans
   * l'écran de la section « Les accords » — section retirée, parce qu'elle
   * répétait le troisième mouvement de « Geste ». Il vérifie désormais ce
   * qui compte à sa place : la carte des vins est composée de VRAI TEXTE,
   * sur du papier, sans aucune image de logiciel.
   */
  test("la carte des vins est une feuille composée, pas une image", async ({
    page,
  }) => {
    await page.goto("/");
    await parcourir(page);
    const r = await page.evaluate(() => {
      const s = document.querySelector("#carte")!;
      const feuille = s.querySelector(".carte-papier")!;
      return {
        images: s.querySelectorAll("img").length,
        lignes: feuille.querySelectorAll("li").length,
        texte: (feuille.textContent ?? "").replace(/\s+/g, " "),
        papier: getComputedStyle(feuille).backgroundColor,
      };
    });
    expect(r.images, "une image s’est glissée dans la section").toBe(0);
    /*
      LE COMPTE DÉPEND DE LA PHASE, et c'est voulu : la feuille montre onze
      lignes par famille, huit par région, et la séquence passe de l'une à
      l'autre. Un seuil strict rendait ce garde-fou dépendant de l'instant où
      il regarde — il a d'ailleurs échoué ainsi. On vérifie donc le plancher
      commun aux deux classements, et surtout que les mots sont là.
    */
    expect(
      r.lignes,
      "la carte ne porte pas assez de lignes",
    ).toBeGreaterThanOrEqual(8);
    for (const mot of ["Maison de Référence", "Carte des vins", "Meursault"]) {
      expect(r.texte, `« ${mot} » manque à la carte`).toContain(mot);
    }
  });

  /**
   * LE PARAGRAPHE DE PROVENANCE A QUITTÉ LA PAGE, et sa marge avec lui.
   * Il expliquait d'où venaient les chiffres de la cave ; cette précision
   * appartient au code, pas à la vitrine.
   */
  test("rien n’explique plus la provenance sous la démonstration", async ({
    page,
  }) => {
    await page.goto("/");
    await parcourir(page);
    const texte = await page.evaluate(() =>
      (document.querySelector("#cave")?.textContent ?? "").replace(/\s+/g, " "),
    );
    for (const reste of [
      "Vintoria Pro 2.0.2",
      "module de stock et ses exports",
      "sur sa propre démonstration",
    ]) {
      expect(texte, `« ${reste} » traîne encore sous la cave`).not.toContain(
        reste,
      );
    }
  });

  test("le carré quitte l’écran, et son trou est comblé", async ({ page }) => {
    await page.goto("/");
    await parcourir(page);
    const r = await page.evaluate(() => {
      const g = (s: string) => document.querySelector(s)!;
      const carre = getComputedStyle(g('#table [class*="rounded-[6%]"]'));
      const m = (carre.transform.match(/-?[\d.]+/g) ?? []).map(Number);
      return {
        echelle: m[0] ?? 1,
        deplace: Math.abs(m[4] ?? 0) + Math.abs(m[5] ?? 0),
        ecran: Number(getComputedStyle(g("#table .objet")).opacity),
        piece: Number(
          getComputedStyle(g('#table .objet [class*="rounded-[2%]"]')).opacity,
        ),
        etapes: Number(getComputedStyle(g("#table ol")).opacity),
      };
    });
    expect(r.echelle, "le carré n’a pas grandi").toBeGreaterThan(1.7);
    expect(r.deplace, "le carré n’est pas venu au centre").toBeGreaterThan(100);
    expect(r.ecran, "l’écran n’a pas reculé").toBeLessThan(0.35);
    // Sans la pièce, le QR imprimé dans la capture resurgit et on en voit DEUX.
    expect(
      r.piece,
      "le trou laissé par le carré n’est pas comblé",
    ).toBeGreaterThan(0.9);
    expect(r.etapes, "les trois étapes ne sont pas venues").toBeGreaterThan(
      0.9,
    );
  });

  test("les trois compteurs se verrouillent sur les chiffres du produit", async ({
    page,
  }) => {
    /*
      UN COMPTEUR PEUT RATER SANS RIEN CASSER, et c'est ce qui rend cette
      mesure nécessaire. Une roue arrêtée entre deux crans laisse deux
      moitiés de chiffre dans sa fenêtre ; une roue dont la course ne tombe
      pas juste s'arrête sur le MAUVAIS chiffre. Dans les deux cas le build
      passe, la page se rend — et le site publie un nombre que le produit
      ne calcule pas.

      On lit donc le GLYPHE RÉELLEMENT VISIBLE au centre de chaque fenêtre,
      par elementFromPoint. Le textContent ne dirait rien : il contient les
      quelques dizaines de crans de la roue.
    */
    await page.goto("/");
    await parcourir(page);

    const r = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("#cave .sr-only")]
        .map((sr) => sr.parentElement!)
        .map((n) => {
          // Chaque nombre est ramené dans le champ avant d'être lu : après
          // le parcours, la page est en bas et elementFromPoint ne voit rien.
          n.scrollIntoView({ block: "center", behavior: "instant" });
          return {
            annonce: n.querySelector(".sr-only")!.textContent,
            vu: [...n.children]
              .filter((c) => !c.classList.contains("sr-only"))
              .map((c) => {
                const b = c.getBoundingClientRect();
                const e = document.elementFromPoint(
                  Math.round(b.left + b.width / 2),
                  Math.round(b.top + b.height / 2),
                );
                return e && e.textContent!.length === 1 ? e.textContent! : "·";
              })
              .join(""),
            crans: [...n.querySelectorAll("[data-cadran]")].map(
              (c) => new DOMMatrixReadOnly(getComputedStyle(c).transform).f,
            ),
          };
        }),
    );

    const attendu = [COMPTE[0].nombre, COMPTE[1].nombre, VALEUR.montant];
    expect(
      r.map((n) => n.vu),
      "un compteur s’est arrêté sur un autre chiffre que celui de la donnée",
    ).toEqual(attendu);
    // Et la valeur annoncée à la voix reste la valeur, pas la suite des crans.
    expect(
      r.map((n) => n.annonce),
      "la valeur lue ne suit plus la donnée",
    ).toEqual(attendu);
    for (const n of r) {
      for (const f of n.crans) {
        expect(f, "une roue s’est arrêtée entre deux crans").toBeCloseTo(0, 3);
      }
    }
  });

  /**
   * LE CRESCENDO SE REJOUE — ET IL NE SE REJOUE PAS N'IMPORTE QUAND.
   *
   * Trois choses à garder, et aucune ne se voit sur une capture :
   *   · la valeur finale TIENT au moins vingt secondes. Un simple
   *     `once: false` ne le garantit pas : il suffit de repasser la
   *     frontière de la section pour que tout reparte de zéro ;
   *   · la remise à zéro n'a lieu que HORS DU CHAMP — sinon le lecteur
   *     voit ses chiffres s'effondrer sous ses yeux ;
   *   · un nouveau passage, lui, REJOUE.
   *
   * On lit la position des roues plutôt que les glyphes : une roue au
   * repos est à des milliers de pixels de son cran final, une roue
   * verrouillée est à zéro. Le signal est net, et il ne dépend pas de
   * l'instant exact où la capture tombe.
   */
  test("les compteurs tiennent vingt secondes, puis se rejouent", async ({
    page,
  }) => {
    /*
      CELUI-CI TOURNE AUX DEUX FORMATS, contrairement à ses voisins.
      Le déclencheur est un `IntersectionObserver` à 40 % : si le bloc du
      crescendo devenait plus haut que deux fois et demie la fenêtre, la
      fraction ne serait JAMAIS atteinte et les compteurs resteraient à
      zéro pour toujours. C'est une panne que seule la petite fenêtre
      peut attraper. (Mesuré : 585 px de bloc pour 812 de fenêtre.)
    */
    /* Le maintien dure vingt secondes par contrat : le test doit pouvoir
       l'attendre en entier, plus le roulement et les marges. */
    test.setTimeout(90_000);

    await page.goto("/");
    await page.addStyleTag({
      content: "html, body { scroll-behavior: auto !important; }",
    });

    /** Le plus grand décalage restant, en pixels. 0 = tout est verrouillé. */
    const roues = () =>
      page.evaluate(() => {
        const c = [...document.querySelectorAll("#cave [data-cadran]")];
        const f = c.map((e) =>
          Math.abs(new DOMMatrixReadOnly(getComputedStyle(e).transform).f),
        );
        return { nombre: c.length, decalage: Math.max(0, ...f) };
      });

    const versCave = () =>
      page.evaluate(() =>
        document
          .getElementById("cave")!
          .scrollIntoView({ block: "center", behavior: "instant" }),
      );
    const loin = () => page.evaluate(() => window.scrollTo(0, 0));

    await loin();
    await page.waitForTimeout(400);
    const depart = await roues();
    expect(depart.nombre, "aucune roue n’est montée").toBeGreaterThan(0);
    expect(
      depart.decalage,
      "les roues sont déjà posées alors que la cave n’a pas été vue",
    ).toBeGreaterThan(100);

    /* ── Premier passage : ça roule, puis ça se verrouille ── */
    const entree = Date.now();
    await versCave();
    await page.waitForTimeout(2600);
    expect(
      (await roues()).decalage,
      "les compteurs ne se sont pas verrouillés au premier passage",
    ).toBeCloseTo(0, 1);

    /* ── Aller-retour PENDANT le maintien : rien ne bouge ── */
    await loin();
    await page.waitForTimeout(900);
    expect(
      (await roues()).decalage,
      "les compteurs se sont réarmés pendant les vingt secondes de maintien",
    ).toBeCloseTo(0, 1);
    await versCave();
    await page.waitForTimeout(250);
    expect(
      (await roues()).decalage,
      "un aller-retour rapide a relancé les compteurs",
    ).toBeCloseTo(0, 1);

    /* ── Le maintien s'écoule, puis on sort : LÀ, ça se réarme ── */
    const MAINTIEN_MS = 20_000;
    const ROULEMENT_MS = 2_100;
    const reste = entree + MAINTIEN_MS + ROULEMENT_MS + 1_200 - Date.now();
    if (reste > 0) await page.waitForTimeout(reste);
    expect(
      (await roues()).decalage,
      "les compteurs se sont réarmés alors que la cave est restée visible",
    ).toBeCloseTo(0, 1);

    await loin();
    await page.waitForTimeout(600);
    expect(
      (await roues()).decalage,
      "les roues ne sont pas revenues à leur départ une fois sorties du champ",
    ).toBeGreaterThan(100);

    /* ── Et le passage suivant rejoue, jusqu'au verrouillage ── */
    await versCave();
    await page.waitForTimeout(2600);
    expect(
      (await roues()).decalage,
      "le second passage n’a pas reverrouillé les compteurs",
    ).toBeCloseTo(0, 1);

    /* La valeur annoncée n’a pas bougé d’un cycle à l’autre. */
    const annonce = await page.evaluate(() =>
      [...document.querySelectorAll("#cave .sr-only")].map(
        (n) => n.textContent,
      ),
    );
    expect(annonce, "la valeur lue a changé entre deux cycles").toEqual([
      COMPTE[0].nombre,
      COMPTE[1].nombre,
      VALEUR.montant,
    ]);
  });
});

test.describe("Mouvement réduit : la page se tient, entière", () => {
  test.use({ reducedMotion: "reduce" });

  test("aucun geste ne laisse d’état amputé", async ({ page }) => {
    await page.goto("/");
    await parcourir(page);

    const r = await page.evaluate(() => {
      const g = (s: string) => document.querySelector(s)!;
      return {
        enCours: (
          document as Document & {
            getAnimations(o?: GetAnimationsOptions): Animation[];
          }
        )
          .getAnimations({ subtree: true })
          .filter((a) => a.playState === "running").length,
        filet: getComputedStyle(g("#geste .origin-left")).transform,
        carre: getComputedStyle(g('#table [class*="rounded-[6%]"]')).transform,
        piece: Number(
          getComputedStyle(g('#table .objet [class*="rounded-[2%]"]')).opacity,
        ),
      };
    });

    expect(
      r.enCours,
      "des animations tournent malgré prefers-reduced-motion",
    ).toBe(0);
    // Le filet du choix principal est ENTIER : on retire le tracé, pas le trait.
    expect(r.filet, "le filet reste à moitié tracé sans le mouvement").toBe(
      "none",
    );
    /*
      LE CARRÉ NE SE DÉTACHE PAS. On ne montre pas l'état final d'un geste
      dont on a retiré le geste : ce serait un écran amputé de son QR, avec
      une pièce grise à la place. L'écran reste INTACT.
    */
    expect(r.carre, "le carré s’est détaché sans le geste").toBe("none");
    expect(r.piece, "le trou est comblé alors que rien n’est parti").toBe(0);
  });

  test("les chiffres de la cave sont là, sans une seule roue", async ({
    page,
  }) => {
    /*
      Le compteur ne se contente pas de ne pas tourner : il n'est pas monté
      du tout. Pas de fenêtre, pas de cran, pas de case vide le temps d'un
      retard — le nombre est du texte, au même endroit exactement.
    */
    await page.goto("/");
    await parcourir(page);
    const r = await page.evaluate(() => ({
      roues: document.querySelectorAll("#cave [data-cadran]").length,
      lu: [
        ...document.querySelectorAll(
          "#cave .data.justify-end, #cave .voix.mt-4",
        ),
      ].map((n) => n.textContent),
    }));
    expect(r.roues, "des roues sont montées malgré le mouvement réduit").toBe(
      0,
    );
    expect(r.lu, "les chiffres ne sont pas à leur valeur finale").toEqual([
      COMPTE[0].nombre,
      COMPTE[1].nombre,
      VALEUR.montant,
    ]);
  });
});

test.describe("Aucun reste de l’ère sombre", () => {
  test("rien n’est peint en encre sur l’accueil", async ({ page }) => {
    await page.goto("/");
    await parcourir(page);
    const sombres = await page.evaluate(() => {
      /*
        UNE SURFACE D'ENCRE EST OPAQUE ET GRANDE — et sa couleur se
        RÉSOUT, elle ne s'analyse pas à la main.

        Deux fois ce test a crié au loup. D'abord sur un filet d'un pixel à
        22 % d'alpha : un séparateur n'est pas une dalle. Puis sur l'en-tête,
        que Tailwind rend en `oklab(0.967 0.0005 0.0098 / 0.72)` — un ivoire
        translucide — dont mon extraction des « trois premiers nombres »
        lisait 0,96 / 0,0005 / 0,0098 comme des canaux 0-255, donc du noir.

        On passe donc la valeur calculée au navigateur, qui sait convertir
        n'importe quelle syntaxe (rgb, oklab, color-mix) en pixels.
      */
      const toile = document.createElement("canvas");
      toile.width = toile.height = 1;
      const ctx2 = toile.getContext("2d")!;
      const resoudre = (c: string) => {
        ctx2.clearRect(0, 0, 1, 1);
        ctx2.fillStyle = "#ffffff";
        ctx2.fillRect(0, 0, 1, 1);
        ctx2.fillStyle = c;
        ctx2.fillRect(0, 0, 1, 1);
        const sur = [...ctx2.getImageData(0, 0, 1, 1).data];
        ctx2.clearRect(0, 0, 1, 1);
        ctx2.fillStyle = "#000000";
        ctx2.fillRect(0, 0, 1, 1);
        ctx2.fillStyle = c;
        ctx2.fillRect(0, 0, 1, 1);
        const sous = [...ctx2.getImageData(0, 0, 1, 1).data];
        // Si la couleur est opaque, le fond d'épreuve ne change rien.
        const opaque = sur
          .slice(0, 3)
          .every((v, i) => Math.abs(v - sous[i]) < 6);
        return { rgb: sous.slice(0, 3), opaque };
      };

      const noir = (c: string, e: Element) => {
        const { rgb, opaque } = resoudre(c);
        if (!opaque) return false;
        if (rgb.some((v) => v >= 60)) return false;
        /*
          L'ENCRE EST NEUTRE, un brun ne l'est pas. Le volet « importer »
          pose une feuille de tabac — (57, 39, 29) — dont les trois canaux
          passent sous 60 sans qu'elle soit pour autant un reste de l'ère
          sombre : elle est franchement chromatique. L'encre du site, elle,
          est à deux unités près neutre (#0b0a0c, #121013). L'écart entre
          le canal le plus fort et le plus faible sépare donc les deux, là
          où la seule luminance les confondait.
        */
        if (Math.max(...rgb) - Math.min(...rgb) >= 18) return false;
        const b = e.getBoundingClientRect();
        return b.width >= 24 && b.height >= 24;
      };

      return [
        ...document.querySelectorAll("header, footer, section, section *"),
      ]
        .filter((e) => {
          // Les captures produit ont le droit d'être sombres : c'est le soir.
          if (e.tagName === "IMG") return false;
          const c = getComputedStyle(e);
          return noir(c.backgroundColor, e);
        })
        .map(
          (e) => `${e.tagName}.${(e.className || "").toString().split(" ")[0]}`,
        );
    });
    expect(
      sombres,
      `surface d’encre sur l’accueil : ${sombres.join(", ")}`,
    ).toEqual([]);
  });

  test("le canevas, le corps et le pied suivent la lumière", async ({
    page,
  }) => {
    await page.goto("/");
    const v = await page.evaluate(() => ({
      html: getComputedStyle(document.documentElement).backgroundColor,
      schema: getComputedStyle(document.documentElement).colorScheme,
      grain: getComputedStyle(document.body, "::after").display,
    }));
    // Le canevas, c'est ce qu'on voit dans le rebond élastique : pas du noir.
    expect(v.html).toBe("rgb(247, 244, 237)");
    // Sinon l'ascenseur du navigateur reste sombre le long d'une page claire.
    expect(v.schema).toBe("light");
    // Le grain de pellicule du soir est invisible sur l'ivoire : il ne doit
    // pas y être composé à chaque image pour rien.
    expect(v.grain, "le grain du soir est encore composé sur l’accueil").toBe(
      "none",
    );
  });

  test("les routes du soir n’ont pas bougé", async ({ page }) => {
    for (const r of ["/tarifs", "/demonstration"]) {
      await page.goto(r);
      const v = await page.evaluate(() => ({
        html: getComputedStyle(document.documentElement).backgroundColor,
        schema: getComputedStyle(document.documentElement).colorScheme,
        pied: getComputedStyle(document.querySelector("footer")!)
          .backgroundColor,
        grain: getComputedStyle(document.body, "::after").display,
        lumiere: document.querySelector(".lumiere") !== null,
      }));
      expect(v.html, `${r} a basculé en lumière`).toBe("rgb(11, 10, 12)");
      expect(v.schema, `${r} a changé de schéma`).toBe("dark");
      expect(v.pied, `${r} : le pied a changé`).toBe("rgb(11, 10, 12)");
      expect(v.grain, `${r} : le grain du soir a disparu`).not.toBe("none");
      expect(v.lumiere, `${r} porte l’enveloppe claire`).toBe(false);
    }
  });
});
