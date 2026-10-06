# Vintoria — site commercial

Le site de vente de **Vintoria Pro**, le logiciel de cave et d’accords mets-vins
destiné aux restaurants et aux hôtels. Il ne présente pas le produit : il le vend.

Le produit lui-même vit dans `vintoria-pro` et se trouve à
[`www.vintoria.app`](https://www.vintoria.app), le domaine officiel du produit.
Ce site, lui, est servi sur `www.vintoria.com`.

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis renseigner la clé Resend
npm run dev
```

| Commande | Ce qu’elle fait |
| --- | --- |
| `npm run dev` | serveur de développement |
| `npm run build` | build de production |
| `npm run lint` | ESLint |
| `npm test` | tests de bout en bout Playwright, sur le **build de production** |

Les tests utilisent le Chrome déjà installé sur la machine (`channel: "chrome"`) :
aucun navigateur n’est téléchargé.

## Les routes

| Route | Rôle |
| --- | --- |
| `/` | la vente, en neuf mouvements |
| `/tarifs` | les formules, sans prix tant qu’ils ne sont pas arrêtés |
| `/demonstration` | le formulaire — le seul point de conversion du site |

## Le formulaire

Il passe par **Resend**, le même compte que `vintoria-pro`, appelé en `fetch`
direct (aucune dépendance ajoutée). Voir `lib/courriel.ts` et
`app/demonstration/action.ts`.

Sans `RESEND_API_KEY`, l’envoi **échoue franchement** et la saisie est conservée.
Il n’affiche jamais de remerciement sur un message qui n’est pas parti : un faux
succès laisserait un prospect attendre un rappel qui n’arriverait pas. Un test de
bout en bout verrouille ce comportement.

Protection anti-robot : un leurre hors-cadre et un seuil de cadence (trois
secondes). Aucun captcha.

## Les prix

`lib/formules.ts` porte `PRIX_CONFIRMES = false` : la page affiche « Sur demande ».
Le catalogue de `vintoria-pro` contient bien des montants, mais `STRIPE_PRICES`
y est entièrement `null` — la facturation n’est pas branchée, donc ces montants
ne sont pas confirmés. Basculer la constante une fois la grille arrêtée.

En développement, `/tarifs` affiche un avis qui rappelle l’attente. Un test
vérifie que cet avis ne part jamais en production, et qu’aucun montant ne fuite.

## La marque

L'identité vient de **vintoria-brand** (Brand System Vintoria 2026), la seule
source. Elle se synchronise, elle ne se modifie jamais ici :

```bash
node ../vintoria-brand/scripts/sync.mjs website --racine "$PWD"
node ../vintoria-brand/scripts/sync.mjs website --racine "$PWD" --verifier
```

Fichiers écrits (verrou : `app/marque/vintoria-brand.lock.json`) :
`app/marque/vintoria.css` et `tailwind.css` (jetons), `app/favicon.ico`,
`app/icon.png`, `app/apple-icon.png`, `app/opengraph-image.png`, et dans
`public/marque/` les icônes PWA, le symbole, le wordmark et les lockups.

- **Signature** : « Le vin à sa juste place » (titre, image de partage).
  « L’expertise du sommelier, à chaque table » reste un message secondaire.
- **Logo** : le site est sombre, il n'emploie donc que la variante `fonce` —
  symbole tonal crème (`symbole-tonal-creme.png`), wordmark crème
  (`wordmark-creme.svg`), lockup horizontal foncé. Jamais le symbole couleur
  sur la nuit, jamais le mot VINTORIA composé en texte.
- **Couleur** : le bordeaux `#722340` et son échelle, rien d'autre.

## Le système de design

Tout est dans `app/globals.css`, et chaque valeur y pointe vers un rôle de la
marque (`--vintoria-*`). `<html>` porte `data-vintoria-theme="nuit"` : le site
vit dans le thème nuit, et les classes `v-*` de la marque le suivent.

Les couleurs ne sont pas nommées par ce qu’elles **sont** mais par ce qu’elles
**font** : `fond`, `fort`, `texte`, `faible`, `accent`, `filet`. La classe `jour`
redéfinit ce jeu avec le thème crème pour la surface du mouvement « La cave ».
Un composant écrit `text-accent` et reste lisible des deux côtés : bordeaux 400
`#DE809C` sur la nuit, bordeaux 700 `#722340` sur le crème.

Contrastes mesurés, sur la nuit `#0F0D0E` puis sur le crème `#F8F1EA` :

| | nuit | crème |
| --- | --- | --- |
| `fort` | 15,9:1 | 15,1:1 |
| `texte` | 7,8:1 | 7,0:1 |
| `faible` | 6,0:1 | 5,5:1 |
| `accent` | 7,1:1 (bordeaux 400) | 9,2:1 (bordeaux 700) |

Typographie : **Bodoni Moda** pour la voix de la marque, **Schibsted Grotesk**
pour l’interface — les deux polices de la marque, chargées par `next/font` en
fontes variables.

Entrées au défilement : `animation-timeline: view()`, en CSS pur. Zéro octet de
JavaScript, et un repli correct là où la propriété manque — l’élément est
simplement déjà visible.

## À savoir sur cette version de Next

Next 16 **n’écrase plus** `scroll-behavior` pendant les navigations. Le site
emploie `scroll-behavior: smooth` pour ses ancres ; sans l’attribut
`data-scroll-behavior="smooth"` sur `<html>`, passer de `/` à `/tarifs` ferait
défiler toute la hauteur de la page au lieu d’arriver en haut. Voir
`app/layout.tsx`.

Un module `"use server"` ne peut exporter **que** des fonctions asynchrones. Les
types et l’état initial du formulaire vivent donc dans `app/demonstration/etat.ts`,
séparés de l’action. Le build ne signale pas l’erreur ; la page tombe à
l’exécution.

## Hors chantier

`components/film/` et `components/actes/Disque.tsx` sont un film DOM de 18
secondes réalisé avant la refonte. Ils ne sont montés par aucune page et
n’imposent rien à l’architecture. Conservés pour le chantier Motion Design à
venir — voir `components/film/NOTES.md`.
