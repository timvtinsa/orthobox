/**
 * Game registry.
 *
 * Adding a game only takes creating `src/games/<id>/game.js`: the file is
 * picked up automatically at build time, with no central list to update.
 * See `src/games/README.md` for the full contract.
 */
import { isCategoryId } from '../lib/categories.js'

const modules = import.meta.glob('./*/game.js', { eager: true })

const REQUIRED = ['id', 'title', 'tagline', 'category', 'cover', 'component']

function validate(meta, path) {
  for (const field of REQUIRED) {
    if (!meta?.[field]) throw new Error(`${path} : champ « ${field} » manquant dans game.js`)
  }
  if (!isCategoryId(meta.category)) {
    throw new Error(`${path} : catégorie inconnue « ${meta.category} »`)
  }
  const folder = path.split('/')[1]
  if (folder !== meta.id) {
    throw new Error(`${path} : l'id « ${meta.id} » doit correspondre au dossier « ${folder} »`)
  }
}

function normalize(meta) {
  return {
    objectives: [],
    materials: [],
    settings: [],
    ages: 'Tous âges',
    instructions: null,
    ...meta,
  }
}

const collected = []
for (const [path, module] of Object.entries(modules)) {
  const meta = module.default
  validate(meta, path)
  collected.push(normalize(meta))
}

const duplicates = collected
  .map((game) => game.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index)
if (duplicates.length > 0) {
  throw new Error(`Identifiants de jeux en double : ${[...new Set(duplicates)].join(', ')}`)
}

/** Every game, sorted by title (French alphabetical order). */
export const GAMES = collected.sort((a, b) => a.title.localeCompare(b.title, 'fr'))

const BY_ID = new Map(GAMES.map((game) => [game.id, game]))

export function getGame(id) {
  return BY_ID.get(id) ?? null
}

export function getGamesByCategory(categoryId) {
  return GAMES.filter((game) => game.category === categoryId)
}

/** Plain search over title, tagline, objectives and keywords. */
export function searchGames(games, query) {
  const needle = normalizeText(query)
  if (!needle) return games
  return games.filter((game) => {
    const haystack = normalizeText(
      [game.title, game.tagline, game.ages, ...(game.objectives ?? []), ...(game.keywords ?? [])].join(' '),
    )
    return haystack.includes(needle)
  })
}

/** Lowercased and stripped of accents, so « executif » finds « exécutif ». */
export function normalizeText(value) {
  return (value ?? '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}
