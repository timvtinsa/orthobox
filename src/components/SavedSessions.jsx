/**
 * Saved sessions of the session builder.
 *
 * Two pieces, both inline (no pop-up):
 *
 *   SaveForm    a name field that opens under the title of the plan; typing
 *               the name of a session already saved replaces it
 *   SavedList   the saved sessions, shown in place of the plan editor, each
 *               with an overview of its games: reopen or delete
 *
 * `useSavedSessions` keeps the list and the short confirmation message they
 * share. Everything is stored in this browser (see `lib/saved-sessions.js`).
 * Replacing the plan in progress and deleting a session ask for a confirmation
 * on the line of the session concerned.
 */
import { useEffect, useRef, useState } from 'react'
import { getGame } from '../games/registry.js'
import { categoryStyle, getCategory } from '../lib/categories.js'
import {
  MAX_NAME_LENGTH,
  cleanName,
  deleteSession,
  exportSessions,
  importSessions,
  missingGames,
  openSession,
  readSavedSessions,
  saveSession,
} from '../lib/saved-sessions.js'
import Icon from './Icon.jsx'

const FAILURES = {
  name: 'Donnez un nom à la séance.',
  empty: 'La séance en cours est vide : ajoutez au moins un jeu.',
  full: 'Le nombre maximal de séances enregistrées est atteint : supprimez-en une.',
  storage: 'Le navigateur refuse d’enregistrer (stockage plein ou désactivé).',
  missing: 'Cette séance n’existe plus.',
  format: 'Ce fichier n’est pas une sauvegarde de séances Orthobox.',
}

function plural(count, one, many) {
  return `${count} ${count > 1 ? many : one}`
}

function describe(entry) {
  const date = entry.savedAt
    ? new Date(entry.savedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''
  const count = plural(entry.steps.length, 'jeu', 'jeux')
  return date ? `${count} · ${date}` : count
}

/** The saved sessions, and the confirmation of what was just done (it fades). */
export function useSavedSessions() {
  const [list, setList] = useState(readSavedSessions)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!message) return undefined
    const timer = window.setTimeout(() => setMessage(''), 5000)
    return () => window.clearTimeout(timer)
  }, [message])

  return { list, setList, message, setMessage }
}

export function SaveForm({ steps, saved, onDone }) {
  const { list, setList, setMessage } = saved
  const [name, setName] = useState('')
  const [problem, setProblem] = useState('')
  const same = list.find((entry) => entry.name.toLowerCase() === cleanName(name).toLowerCase())

  const submit = (event) => {
    event.preventDefault()
    const result = saveSession(name, steps, same?.id ?? null)
    if (!result.ok) {
      setProblem(FAILURES[result.reason] ?? FAILURES.storage)
      return
    }
    setList(result.list)
    setMessage(`« ${result.entry.name} » est enregistrée.`)
    onDone()
  }

  return (
    <form className="saved-form" onSubmit={submit}>
      <label className="saved-form__label" htmlFor="saved-name">
        Nom de la séance
      </label>
      <div className="saved-form__row">
        <input
          id="saved-name"
          className="saved-form__input"
          type="text"
          autoFocus
          maxLength={MAX_NAME_LENGTH}
          placeholder="Ex. Langage écrit, CE1"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            setProblem('')
          }}
        />
        <button type="submit" className="btn">
          {same ? 'Remplacer' : 'Enregistrer'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onDone}>
          Annuler
        </button>
      </div>
      <p className="saved-form__hint" role="status">
        {problem ||
          (same
            ? `Une séance porte déjà ce nom : elle sera remplacée (${describe(same)}).`
            : `${plural(steps.length, 'jeu', 'jeux')} et leurs réglages. Aucune donnée patient.`)}
      </p>
    </form>
  )
}

export function SavedList({ steps, saved, onOpen, onBack }) {
  const { list, setList, setMessage } = saved
  const [confirming, setConfirming] = useState(null) // { type: 'open' | 'delete', id }
  const [problem, setProblem] = useState('')
  const [info, setInfo] = useState('')
  const fileInput = useRef(null)

  const open = (entry) => {
    const plan = openSession(entry)
    if (plan.length === 0) {
      setProblem('Aucun jeu de cette séance n’existe plus dans Orthobox.')
      setConfirming(null)
      return
    }
    onOpen(plan)
    const lost = missingGames(entry)
    setMessage(
      `« ${entry.name} » est ouverte.` +
        (lost > 0 ? ` ${plural(lost, 'jeu n’existe', 'jeux n’existent')} plus et a été retiré.` : ''),
    )
    onBack()
  }

  const askOpen = (entry) => {
    setProblem('')
    if (steps.length === 0) open(entry)
    else setConfirming({ type: 'open', id: entry.id })
  }

  const remove = (entry) => {
    setList(deleteSession(entry.id))
    setConfirming(null)
    setInfo(`« ${entry.name} » est supprimée.`)
  }

  const download = () => {
    const blob = new Blob([exportSessions(list)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'orthobox-seances.json'
    link.click()
    URL.revokeObjectURL(url)
    setInfo('Sauvegarde téléchargée.')
  }

  const upload = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setProblem('')
    // A backup is a few kilobytes: anything bigger is not one.
    if (file.size > 1_000_000) return setProblem(FAILURES.format)
    const result = importSessions(await file.text())
    if (!result.ok) return setProblem(FAILURES[result.reason] ?? FAILURES.format)
    setList(result.list)
    setInfo(
      result.added > 0
        ? `${plural(result.added, 'séance importée', 'séances importées')}` +
            (result.skipped > 0 ? `, ${plural(result.skipped, 'déjà présente', 'déjà présentes')}.` : '.')
        : 'Aucune nouvelle séance dans ce fichier.',
    )
  }

  return (
    <div className="saved-view">
      {list.length === 0 ? (
        <p className="saved-empty">
          Aucune séance enregistrée. Composez une séance, puis appuyez sur « Enregistrer » pour la
          retrouver au prochain rendez-vous.
        </p>
      ) : (
        <ul className="saved-list">
          {list.map((entry) => {
            const games = entry.steps.map((step) => getGame(step.gameId)).filter(Boolean)
            return (
              <li key={entry.id} className="saved-item">
                <div className="saved-item__head">
                  <div className="saved-item__text">
                    <h3 className="saved-item__name">{entry.name}</h3>
                    <p className="saved-item__meta">{describe(entry)}</p>
                  </div>

                  {confirming?.id === entry.id ? (
                    <div className="saved-item__confirm" role="group" aria-label={`Confirmer pour ${entry.name}`}>
                      <span>{confirming.type === 'open' ? 'Remplacer la séance en cours ?' : 'Supprimer cette séance ?'}</span>
                      <button
                        type="button"
                        className={`btn btn--sm${confirming.type === 'delete' ? ' btn--danger' : ''}`}
                        onClick={() => (confirming.type === 'open' ? open(entry) : remove(entry))}
                      >
                        {confirming.type === 'open' ? 'Remplacer' : 'Supprimer'}
                      </button>
                      <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirming(null)}>
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <div className="saved-item__actions">
                      <button type="button" className="btn" onClick={() => askOpen(entry)}>
                        Ouvrir
                      </button>
                      <button
                        type="button"
                        className="icon-btn icon-btn--danger"
                        aria-label={`Supprimer ${entry.name}`}
                        onClick={() => setConfirming({ type: 'delete', id: entry.id })}
                      >
                        <Icon name="cross" size={18} filled={false} />
                      </button>
                    </div>
                  )}
                </div>

                <ol className="saved-games" aria-label={`Jeux de ${entry.name}`}>
                  {games.map((game, index) => (
                    <li key={`${game.id}-${index}`} className="saved-game" style={categoryStyle(getCategory(game.category))}>
                      <img src={game.cover} alt="" width="320" height="200" />
                      <span>{game.title}</span>
                    </li>
                  ))}
                </ol>
              </li>
            )
          })}
        </ul>
      )}

      <p className="saved-form__hint" role="status">
        {problem || info}
      </p>

      <details className="saved-backup">
        <summary>Sauvegarde et copie sur un autre appareil</summary>
        <p>
          Les séances restent dans ce navigateur : elles disparaissent si ses données sont
          effacées. Un fichier de sauvegarde les garde ou les copie ailleurs. Il ne contient que
          des jeux et des réglages, aucune donnée patient.
        </p>
        <div className="saved-form__row">
          <button type="button" className="btn btn--ghost btn--sm" disabled={list.length === 0} onClick={download}>
            Télécharger la sauvegarde
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => fileInput.current?.click()}>
            Importer une sauvegarde
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="visually-hidden"
            tabIndex={-1}
            aria-label="Fichier de sauvegarde à importer"
            onChange={upload}
          />
        </div>
      </details>
    </div>
  )
}
