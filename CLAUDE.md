@AGENTS.md

# Règle de marque : pas de tiret dans les textes visibles

Aucun texte vu par un visiteur ne contient de tiret employé comme ponctuation :
ni le tiret long (—), ni le tiret moyen (–), ni le trait d'union entouré d'espaces
( - ) quand il tient lieu de tiret. Ça fait texte écrit par une IA.

Les traits d'union à l'intérieur des mots ne changent pas : Saint-Émilion,
Côtes-du-Rhône, demi-bouteille, peut-être, appellations, noms de domaines et de
cuvées.

## Périmètre

Pages et composants, titres de page et métadonnées (SEO, partage), textes
alternatifs et noms accessibles, gabarits de courriels, messages d'erreur. Les
commentaires de code et la documentation interne ne sont pas concernés.

## Comment réécrire

Ne pas remplacer mécaniquement le tiret par une virgule. Réécrire la phrase pour
qu'elle sonne naturelle : deux phrases, une virgule, deux-points, parenthèses ou
une autre tournure. Garder le sens, le ton et la longueur.

* Plage de valeurs : « 50 à 100 € », jamais « 50 – 100 € ».
* Séparateur dans un titre ou une étiquette : le point médian « · ».
* Tiret seul qui signale une valeur vide dans un tableau : le laisser.

## Vérification

`npm run verifier:tirets` liste les fautes. Le script tourne aussi en `prebuild`,
donc un tiret dans un texte visible fait échouer le build et la Preview.

Une ligne peut être exemptée volontairement avec le commentaire `tiret-ok`, sur la
ligne elle-même ou juste au-dessus. Le seul cas aujourd'hui est la saisie brute de
`PlancheImport.tsx`, où les tirets sont précisément le sujet de la démonstration.
