# Vintoria · site vitrine

Le site de vente de **Vintoria Pro**, le logiciel d’accords mets-vins et de
gestion de cave des restaurants. C’est le premier endroit où un restaurateur
découvre Vintoria. Il ne montre pas le logiciel : il le vend, et il mène à
l’application.

Le produit vit dans `vintoria-pro`, sur `www.vintoria.app`.

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis renseigner la clé Resend
npm run dev
```

| Commande | Ce qu’elle fait |
| --- | --- |
| `npm run dev` | serveur de développement |
| `npm run build` | build de production (vérifie d’abord la règle des tirets) |
| `npm run lint` | ESLint |
| `npm test` | tests de bout en bout Playwright, sur le **build de production** |
| `npm run verifier:tirets` | la règle de marque, seule |

## Les routes

| Route | Rôle |
| --- | --- |
| `/` | la vente : promesse, fonctionnalités, bénéfices, formules, questions |
| `/tarifs` | les trois formules en détail, sans montant tant qu’ils ne sont pas arrêtés |
| `/demonstration` | la demande de démonstration, pour qui préfère qu’on lui montre |

## La conversion

**Une seule action principale : l’essai gratuit.** Tous les boutons « Essai
gratuit » et « Commencer l’essai gratuit » mènent à
`https://www.vintoria.app/register` (inscription, aucune carte bancaire).
« Se connecter » mène à `/login`. Les deux adresses vivent dans
`lib/liens.ts`, et nulle part ailleurs.

La démonstration reste offerte en second, et pour la formule Enterprise.

## La direction artistique : nuit de cave

Tout est dans `app/globals.css`, sans Tailwind : une feuille, des classes
nommées par composant.

- **Couleurs** : nuit `#0A1020`, crème `#F1EADC`, or `#C9A54E`, verres brun
  et vert. Contrastes mesurés sur la nuit : crème 15,8:1, texte 8,4:1,
  faible 5,4:1, or 8,1:1.
- **Polices** : celles de `vintoria-brand`. Bodoni Moda (avec son axe de
  taille optique) pour la voix, Schibsted Grotesk pour l’information.
- **Le verre** (`.verre`, `.verre--brun`, `.verre--vert`) porte les accords,
  les fonctionnalités et les formules. Le texte courant reste sur la nuit.
- **La lumière au survol** : `components/site/Lumieres.tsx` pose la position
  du curseur sur tout élément `[data-lumiere]` ; le CSS en fait une lueur.
  Rien sur écran tactile ni en mouvement réduit.
- **Le mouvement** : une seule arrivée orchestrée (l’ouverture), le fil des
  étapes qui se tire au défilement, l’accord qui défile. Aucune bibliothèque.
  `prefers-reduced-motion` coupe tout.

Les illustrations (`components/accueil/Illustrations.tsx`) sont des objets de
salle et de cave tracés au fil d’or. **Aucune capture de l’application** sur
le site, par choix.

## Le formulaire de démonstration

Il passe par **Resend**, le même compte que `vintoria-pro`, appelé en `fetch`
direct. Voir `lib/courriel.ts` et `app/demonstration/action.ts`.

Sans `RESEND_API_KEY`, l’envoi **échoue franchement** et la saisie est
conservée. Il n’affiche jamais de remerciement sur un message qui n’est pas
parti. Un test de bout en bout verrouille ce comportement.

## Les prix

`lib/tarifs.ts` porte `PRIX_CONFIRMES = false` : les formules affichent
« Tarif sur demande ». Les droits de chaque formule viennent de
`lib/formules.ts`, repris du catalogue du produit, et ne s’écrivent jamais à
la main dans les composants. Basculer la constante une fois la grille arrêtée.

## À savoir sur cette version de Next

Next 16 **n’écrase plus** `scroll-behavior` pendant les navigations. Sans
l’attribut `data-scroll-behavior="smooth"` sur `<html>`, passer de `/` à
`/tarifs` ferait défiler toute la hauteur de la page. Voir `app/layout.tsx`.

Un module `"use server"` ne peut exporter **que** des fonctions asynchrones :
les types et l’état initial du formulaire vivent dans
`app/demonstration/etat.ts`.
