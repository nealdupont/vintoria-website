# La démonstration produit — components/film/

Trente-deux secondes, sept séquences, un argument commercial chacune. Elle
répond à une seule question : « pourquoi mon restaurant aurait intérêt à
utiliser Vintoria ? »

Vit sur **`/film`**, route de validation non indexée, liée depuis aucune
navigation, **non montée sur l'accueil**.

## Le moteur

Une seule animation CSS de 32 s, partagée : chaque élément s'y place par ses
pourcentages, `animation-play-state` est l'unique interrupteur. **Aucune image
n'est calculée en JavaScript.** Motion.dev ne sert que le bouton.

Repère : 1 s = 3,125 %.

## La règle de composition

Les **vraies captures** de Vintoria Pro portent le contexte ; tout ce qui doit
**bouger** est en DOM par-dessus, avec les libellés du produit. Ainsi rien n'a
à s'aligner au pixel près sur une image, et les chiffres restent nets.

## Le piège le plus coûteux : le cache d'images de Next

Remplacer un fichier de `public/` **sans changer son chemin** ne suffit pas :
`next/image` garde l'image optimisée dans `.next/cache/images`, indexée sur
l'URL source. L'ancienne version continue d'être servie — c'est ce qui a fait
réapparaître l'ancienne interface après chaque remplacement (72 entrées,
1,6 Mo en cache). Après tout échange d'actif :

```
rm -rf .next/cache/images && npm run build
```

## Les pièges payés — ne pas les refaire

- **Jamais de `background` sur l'élément qui porte `perspective` +
  `preserve-3d`.** Son fond est peint dans le plan z = 0 du contexte 3D, et
  tout descendant à Z négatif passe derrière lui. Mesuré : un plan à
  `translateZ(-90px)` tombait à 10,6 de luminance au lieu de 44,7, alors que
  son opacité valait 1. Le fond vit sur `.film`, pas sur `.scene`.
- **L'interface du produit est presque noire.** Sur une scène sombre elle
  disparaît : il lui faut un `filter: brightness()` STATIQUE et un liseré.
- **Les décalages (`.v1`…`.m4`) doivent être préfixés par `.film`** : sinon
  `.film [data-anim]` (0,2,0) l'emporte sur `.v1` (0,1,0) et impose la durée
  globale de 32 s.
- **Le voile des phrases ne peut pas vivre sur `.phrases::before`** : ce
  conteneur n'a pas de hauteur, ses décalages en pourcentage valent zéro. Il
  est sur `.vignette`, déclaré AVANT les phrases — déclaré après, il éteignait
  le texte qu'il devait rendre lisible.
- **Playwright réutilise un serveur existant sur le port 3100.** Si le harnais
  de `vintoria-pro` y tourne, les tests du site s'exécutent contre le produit
  et rendent « Page introuvable ». Libérer le port avant `npm test`.

## Les données

Tous les écrans sont de vraies captures, prises sur l'établissement de
démonstration via le harnais de test de `vintoria-pro` (15 références,
179 bouteilles). **Le PDF d'inventaire est réellement généré par le produit**
(`lib/stock/exporters/pdf.ts`, jspdf — 4 pages). Les montants sont ceux que le
logiciel calcule sur cette cave : données de démonstration, jamais une moyenne
ni une performance. Aucun pourcentage de chiffre d'affaires n'est avancé.

## Mesuré

0 tâche longue · **0 mise en page** sur les quatre segments · 0 propriété non
compositable · CLS 0 · 37 nœuds animés · 496 Ko transférés.

## Hors chantier

La version contemplative précédente (plan-séquence de 20 s, caméra unique) est
sauvegardée hors dépôt, dans le scratchpad de session
`film-contemplatif/`. Elle n'est plus référencée.
