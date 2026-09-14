/**
 * Contrat des fiches de jeu.
 *
 * Le registre découvre les jeux au build : rien ne relit leurs fiches avant
 * l'exécution. Ces vérifications tiennent lieu de garde-fou, pour qu'un jeu
 * ajouté plus tard ne casse ni la galerie, ni l'écran de réglages, ni le mode
 * séance.
 */
import { describe, expect, it } from 'vitest'
import { GAMES, getGame, getGamesByCategory, searchGames } from '../src/games/registry.js'
import { CATEGORY_IDS } from '../src/lib/categories.js'

describe('registre des jeux', () => {
  it('découvre les jeux présents dans src/games', () => {
    expect(GAMES.length).toBeGreaterThanOrEqual(20)
  })

  it('attribue un identifiant unique à chaque jeu', () => {
    const ids = GAMES.map((jeu) => jeu.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('retrouve un jeu par son identifiant', () => {
    expect(getGame(GAMES[0].id)).toBe(GAMES[0])
    expect(getGame('jeu-inexistant')).toBeNull()
  })

  it('range chaque jeu dans un domaine connu', () => {
    for (const jeu of GAMES) {
      expect(CATEGORY_IDS).toContain(jeu.category)
    }
    const total = CATEGORY_IDS.reduce(
      (somme, domaine) => somme + getGamesByCategory(domaine).length,
      0,
    )
    expect(total).toBe(GAMES.length)
  })

  it('renseigne les champs affichés par la galerie', () => {
    for (const jeu of GAMES) {
      expect(jeu.title, jeu.id).toBeTruthy()
      expect(jeu.tagline, jeu.id).toBeTruthy()
      expect(jeu.cover, jeu.id).toBeTruthy()
      expect(jeu.ages, jeu.id).toBeTruthy()
      expect(jeu.objectives.length, jeu.id).toBeGreaterThan(0)
      expect(jeu.instructions, jeu.id).toBeTruthy()
    }
  })

  it('n’annonce pas de durée, celle-ci dépendant du patient', () => {
    for (const jeu of GAMES) {
      expect(jeu.duration, jeu.id).toBeUndefined()
    }
  })

  it('n’utilise pas de tiret cadratin dans les textes', () => {
    for (const jeu of GAMES) {
      const textes = [jeu.title, jeu.tagline, jeu.instructions, ...jeu.objectives, ...jeu.materials]
      expect(textes.join(' '), jeu.id).not.toContain('—')
    }
  })
})

describe('réglages déclarés', () => {
  it('décrit des champs exploitables par l’écran de réglages', () => {
    for (const jeu of GAMES) {
      for (const champ of jeu.settings) {
        expect(champ.id, `${jeu.id}/${champ.label}`).toBeTruthy()
        expect(champ.label, `${jeu.id}/${champ.id}`).toBeTruthy()
        expect(['choice', 'number'], `${jeu.id}/${champ.id}`).toContain(champ.type)
        expect(champ.default, `${jeu.id}/${champ.id}`).toBeDefined()
      }
    }
  })

  it('place la valeur par défaut d’un nombre dans ses bornes', () => {
    for (const jeu of GAMES) {
      for (const champ of jeu.settings.filter((item) => item.type === 'number')) {
        const repere = `${jeu.id}/${champ.id}`
        expect(champ.min, repere).toBeLessThanOrEqual(champ.default)
        expect(champ.max, repere).toBeGreaterThanOrEqual(champ.default)
        // La valeur par défaut doit être atteignable au pas déclaré.
        expect((champ.default - champ.min) % (champ.step ?? 1), repere).toBe(0)
      }
    }
  })

  it('propose au moins deux options à un choix, dont la valeur par défaut', () => {
    for (const jeu of GAMES) {
      for (const champ of jeu.settings.filter((item) => item.type === 'choice')) {
        const repere = `${jeu.id}/${champ.id}`
        expect(champ.options.length, repere).toBeGreaterThanOrEqual(2)
        expect(champ.options.map((option) => option.id), repere).toContain(champ.default)
      }
    }
  })

  it('n’attribue pas deux fois le même identifiant de réglage', () => {
    for (const jeu of GAMES) {
      const ids = jeu.settings.map((champ) => champ.id)
      expect(new Set(ids).size, jeu.id).toBe(ids.length)
    }
  })
})

describe('recherche', () => {
  it('ignore la casse et les accents', () => {
    const resultats = searchGames(GAMES, 'MEMOIRE')
    expect(resultats.length).toBeGreaterThan(0)
    expect(searchGames(GAMES, 'mémoire').length).toBe(resultats.length)
  })

  it('rend la liste entière pour une recherche vide', () => {
    expect(searchGames(GAMES, '   ').length).toBe(GAMES.length)
  })

  it('ne renvoie rien pour un terme absent', () => {
    expect(searchGames(GAMES, 'zzzzz')).toHaveLength(0)
  })
})
