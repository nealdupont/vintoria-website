#!/usr/bin/env node
/**
 * Regle de marque : aucun tiret employe comme ponctuation dans un texte visible.
 *
 * Ce script lit les fichiers suivis par git, isole ce qu'un utilisateur peut lire
 * (chaines de caracteres et texte JSX, jamais les commentaires) et echoue si l'un
 * d'eux contient un tiret long, un tiret moyen, ou un trait d'union entoure
 * d'espaces tenant lieu de tiret.
 *
 * Restent autorises : les traits d'union a l'interieur des mots (Saint-Emilion),
 * le point median en separateur, le tiret seul qui signale une cellule vide, et
 * toute ligne portant le commentaire tiret-ok.
 *
 * Usage : node scripts/verifier-tirets.mjs   (ou deno run -A scripts/verifier-tirets.mjs)
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'

const LONG = '—'
const MOYEN = '–'
const EXT_CODE = new Set(['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs'])
const EXT_LUES = new Set([...EXT_CODE, 'json', 'html'])

/** Hors perimetre : code non lu par un utilisateur, doc interne, tests. */
const IGNORES = [
  /^docs\//, /^\.github\//, /^scripts\//,
  /\.md$/,
  /(^|\/)tests?\//, /__tests__\//, /\.test\./, /\.spec\./,
  /package-lock\.json$/, /tsconfig[^/]*\.json$/, /\.lock\.json$/,
]

/** Retire commentaires de ligne et de bloc, en preservant les chaines. */
function sansCommentaires(src) {
  let out = ''
  let i = 0
  let etat = null
  let quote = null
  while (i < src.length) {
    const c = src[i]
    const suivant = src[i + 1] ?? ''
    if (etat === null) {
      if (c === '/' && suivant === '/') { etat = 'ligne'; out += '  '; i += 2; continue }
      if (c === '/' && suivant === '*') { etat = 'bloc'; out += '  '; i += 2; continue }
      if (c === '"' || c === "'" || c === '`') { etat = 'chaine'; quote = c; out += c; i++; continue }
      out += c; i++
    } else if (etat === 'ligne') {
      out += c === '\n' ? '\n' : ' '
      if (c === '\n') etat = null
      i++
    } else if (etat === 'bloc') {
      if (c === '*' && suivant === '/') { etat = null; out += '  '; i += 2; continue }
      out += c === '\n' ? '\n' : ' '
      i++
    } else {
      if (c === '\\') { out += '  '; i += 2; continue }
      if (c === quote) etat = null
      out += c; i++
    }
  }
  return out
}

const CHAINE = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/gs
/**
 * Texte nu entre deux balises. L'ancre est une balise ouvrante ou la fin d'une
 * interpolation ; la balise suivante est seulement anticipee, pour ne pas la
 * consommer et rater le texte d'apres. Sur ce texte on ne cherche que les tirets
 * long et moyen : du code JSX voisin peut contenir une soustraction.
 */
const TEXTE_JSX = /(?:<\/?[A-Za-z][^<>]*>|\})([^<>{}]+)(?=<)/g
const TIRET_SEUL = new RegExp(`^\\s*[${LONG}${MOYEN}]\\s*$`)

/**
 * Le texte visible, une fois retirees les expressions interpolees. Chacune laisse
 * un jeton colle au texte voisin : `${a}-${b}` ne doit pas devenir un faux tiret.
 */
function visible(s) {
  let out = ''
  let i = 0
  while (i < s.length) {
    if (s[i] === '$' && s[i + 1] === '{') {
      let profondeur = 1
      let j = i + 2
      while (j < s.length && profondeur > 0) {
        if (s[j] === '{') profondeur++
        else if (s[j] === '}') profondeur--
        j++
      }
      out += 'X'
      i = j
      continue
    }
    out += s[i]
    i++
  }
  return out
}

function motif(s) {
  if (s.includes(LONG)) return 'tiret long'
  if (s.includes(MOYEN)) return 'tiret moyen'
  // Trait d'union entoure d'espaces. calc() est une expression CSS, pas du texte.
  if (!s.includes('calc(') && / - /.test(s)) return "trait d'union en tiret"
  return null
}

/** Dossiers jamais parcourus par le repli : rien d'ecrit a la main. */
const DOSSIERS_EXCLUS = new Set([
  'node_modules', '.git', '.next', '.expo', '.vercel', 'dist', 'build',
  'coverage', 'ios', 'android', 'out', 'public', 'assets', 'playwright-report',
])

/** Repli quand git est absent : certains builds n'ont pas le depot. */
function parcourir(racine, prefixe = '') {
  const trouves = []
  for (const entree of readdirSync(racine, { withFileTypes: true })) {
    if (entree.name.startsWith('.') && entree.name !== '.github') continue
    const chemin = prefixe ? `${prefixe}/${entree.name}` : entree.name
    if (entree.isDirectory()) {
      if (DOSSIERS_EXCLUS.has(entree.name)) continue
      trouves.push(...parcourir(`${racine}/${entree.name}`, chemin))
    } else if (entree.isFile()) {
      trouves.push(chemin)
    }
  }
  return trouves
}

function fichiersSuivis() {
  try {
    const sortie = execFileSync('git', ['ls-files'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    const liste = sortie.split('\n').map((f) => f.trim()).filter(Boolean)
    if (liste.length > 0) return liste
  } catch {
    // Pas de depot sous la main : on parcourt le dossier.
  }
  return parcourir('.')
}

const fautes = []
for (const fichier of fichiersSuivis()) {
  if (IGNORES.some((r) => r.test(fichier))) continue
  const ext = fichier.split('.').pop()?.toLowerCase() ?? ''
  if (!EXT_LUES.has(ext)) continue

  let brut
  try { brut = readFileSync(fichier, 'utf8') } catch { continue }
  const lignes = brut.split('\n')
  const ligneDe = (index, source) => source.slice(0, index).split('\n').length

  const signaler = (noLigne, texte, raison) => {
    // L'exemption vaut sur la ligne elle-meme ou sur celle qui la precede.
    const porteuse = `${lignes[noLigne - 1] ?? ''}\n${lignes[noLigne - 2] ?? ''}`
    if (porteuse.includes('tiret-ok')) return
    fautes.push({ fichier, ligne: noLigne, raison, texte: texte.trim().slice(0, 120) })
  }

  if (EXT_CODE.has(ext)) {
    const src = sansCommentaires(brut)
    for (const m of src.matchAll(CHAINE)) {
      const s = m[1] ?? m[2] ?? m[3] ?? ''
      if (TIRET_SEUL.test(s)) continue
      const raison = motif(visible(s))
      if (raison) signaler(ligneDe(m.index, src), s, raison)
    }
    if (ext === 'tsx' || ext === 'jsx') for (const m of src.matchAll(TEXTE_JSX)) {
      const s = m[1] ?? ''
      if (!s.trim() || TIRET_SEUL.test(s)) continue
      const raison = s.includes(LONG) ? 'tiret long' : s.includes(MOYEN) ? 'tiret moyen' : null
      if (raison) signaler(ligneDe(m.index, src), s, raison)
    }
  } else {
    lignes.forEach((l, i) => {
      const raison = motif(l)
      if (raison) signaler(i + 1, l, raison)
    })
  }
}

if (fautes.length === 0) {
  console.log('Regle de marque : aucun tiret dans les textes visibles.')
  process.exit(0)
}

console.error(`\nRegle de marque : ${fautes.length} tiret(s) dans des textes visibles.\n`)
let courant = null
for (const f of fautes) {
  if (f.fichier !== courant) { console.error(`  ${f.fichier}`); courant = f.fichier }
  console.error(`    ligne ${f.ligne} (${f.raison}) : ${f.texte}`)
}
console.error(`
Reecrivez la phrase, ne remplacez pas le tiret par une virgule : deux phrases, une
virgule, deux-points, parentheses. Les traits d'union dans les mots (Saint-Emilion)
ne sont pas concernes. Ligne volontairement exemptee : ajoutez le commentaire tiret-ok.
`)
process.exit(1)
