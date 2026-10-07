# Vintoria — site commercial

Le site de vente de **Vintoria Pro**, le logiciel de cave et d’accords mets-vins
destiné aux restaurants et aux hôtels. Il ne présente pas le produit : il le vend.

Le produit lui-même vit dans `vintoria-pro` et se trouve à `vintoria.app`.

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

## Le système de design

Tout est dans `app/globals.css`.

Les couleurs ne sont pas nommées par ce qu’elles **sont** mais par ce qu’elles
**font** : `fond`, `fort`, `texte`, `faible`, `accent`, `filet`. La classe `jour`
redéfinit ce jeu pour la surface crème du mouvement « La cave ». Un composant
écrit `text-accent` et reste lisible des deux côtés — l’or y devient braise,
parce que `#d4b96a` ne donne que 1,53:1 sur le crème.

Contrastes mesurés, sur l’encre `#0b0a0c` puis sur le crème `#ece5d8` :

| | encre | crème |
| --- | --- | --- |
| `fort` | 15,8:1 | 15,8:1 |
| `texte` | 7,8:1 | 7,7:1 |
| `faible` | 4,8:1 | 4,7:1 |
| `accent` | 10,3:1 (or) | 9,5:1 (braise) |

Typographie : **Spectral** pour la marque, **Archivo** pour l’interface. Cinq
fontes chargées, toutes employées.

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
