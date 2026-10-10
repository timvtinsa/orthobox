/**
 * Saved sessions panel of the session builder: save the plan being prepared
 * under a name, reopen it later, rename, delete, back up and restore.
 *
 * Everything is kept in this browser (see `lib/saved-sessions.js`). Destructive
 * actions (replacing the plan in progress, deleting a saved session) ask for
 * an inline confirmation instead of a pop-up, which is easier to reach on a
 * phone and cannot be blocked by the browser.
 */
import { useRef, useState } from 'react'
import { getGame } from '../games/registry.js'
import {
  MAX_NAME_LENGTH,
  deleteSession,
  exportSessions,
  importSessions,
  missingGames,
  openSession,
  readSavedSessions,
  renameSession,
  saveSession,
} from '../lib/saved-sessions.js'

const FAILURES = {
  name: 'Donnez un nom à la séance.',
  empty: 'La séance en cours est vide : ajoutez au moins un jeu.',
  full: 'Le nombre maximal de séances enregistrées est atteint : supprimez-en une.',
  storage: 'Le navigateur refuse d’enregistrer (stockage plein ou désactivé).',
  missing: 'Cette séance n’existe plus.',
  format: 'Ce fichier n’est pas une sauvegarde de séances Orthobox.',
}

function describe(entry) {
  const date = entry.savedAt
    ? new Date(entry.savedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''
  const count = `${entry.steps.length} jeu${entry.steps.length > 1 ? 'x' : ''}`
  return date ? `${count} · ${date}` : count
}

function titles(entry) {
  return entry.steps
    .map((step) => getGame(step.gameId)?.title)
    .filter(Boolean)
    .join(' · ')
}

export default function SavedSessions({ steps, onOpen }) {
  const [list, setList] = useState(readSavedSessions)
  const [name, setName] = useState('')
  const [activeId, setActiveId] = useState(null)
  const [confirming, setConfirming] = useState(null) // { type: 'open' | 'delete', id }
  const [renaming, setRenaming] = useState(null) // { id, value }
  const [message, setMessage] = useState('')
  const fileInput = useRef(null)

  const active = list.find((entry) => entry.id === activeId) ?? null
  const fail = (reason) => setMessage(FAILURES[reason] ?? FAILURES.storage)

  const save = (event) => {
    event.preventDefault()
    const result = saveSession(name, steps)
    if (!result.ok) return fail(result.reason)
    setList(result.list)
    setActiveId(result.entry.id)
    setName('')
    setMessage(`« ${result.entry.name} » est enregistrée.`)
  }

  const update = () => {
    if (!active) return
    const result = saveSession(active.name, steps, active.id)
    if (!result.ok) return fail(result.reason)
    setList(result.list)
    setMessage(`« ${result.entry.name} » est mise à jour.`)
  }

  const open = (entry) => {
    const plan = openSession(entry)
    if (plan.length === 0) {
      setMessage('Aucun jeu de cette séance n’existe plus dans Orthobox.')
      return
    }
    onOpen(plan)
    setActiveId(entry.id)
    setConfirming(null)
    const lost = missingGames(entry)
    setMessage(
      `« ${entry.name} » est ouverte.` +
        (lost > 0 ? ` ${lost} jeu${lost > 1 ? 'x' : ''} n’existe${lost > 1 ? 'nt' : ''} plus et a été retiré.` : ''),
    )
  }

  const askOpen = (entry) => {
    if (steps.length === 0) open(entry)
    else setConfirming({ type: 'open', id: entry.id })
  }

  const remove = (entry) => {
    setList(deleteSession(entry.id))
    if (activeId === entry.id) setActiveId(null)
    setConfirming(null)
    setMessage(`« ${entry.name} » est supprimée.`)
  }

  const rename = (event) => {
    event.preventDefault()
    const result = renameSession(renaming.id, renaming.value)
    if (!result.ok) return fail(result.reason)
    setList(result.list)
    setRenaming(null)
    setMessage('Séance renommée.')
  }

  const download = () => {
    const blob = new Blob([exportSessions(list)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'orthobox-seances.json'
    link.click()
    URL.revokeObjectURL(url)
    setMessage('Sauvegarde téléchargée.')
  }

  const upload = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    // A backup is a few kilobytes: anything bigger is not one.
    if (file.size > 1_000_000) return fail('format')
    const result = importSessions(await file.text())
    if (!result.ok) return fail(result.reason)
    setList(result.list)
    setMessage(
      result.added > 0
        ? `${result.added} séance${result.added > 1 ? 's' : ''} importée${result.added > 1 ? 's' : ''}` +
            (result.skipped > 0 ? `, ${result.skipped} déjà présente${result.skipped > 1 ? 's' : ''} ou ignorée${result.skipped > 1 ? 's' : ''}.` : '.')
        : 'Aucune nouvelle séance dans ce fichier.',
    )
  }

  return (
    <section className="saved" aria-labelledby="saved-title">
      <header className="saved__header">
        <h2 id="saved-title" className="session-column__title">
          Séances enregistrées
        </h2>
        {list.length > 0 && <span className="badge">{list.length}</span>}
      </header>

      <form className="saved__save" onSubmit={save}>
        <label className="saved__label" htmlFor="saved-name">
          Nom de la séance en cours
        </label>
        <div className="saved__row">
          <input
            id="saved-name"
            className="saved__input"
            type="text"
            maxLength={MAX_NAME_LENGTH}
            placeholder="Ex. Langage écrit, CE1"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button type="submit" className="btn" disabled={steps.length === 0}>
            Enregistrer
          </button>
          {active && (
            <button type="button" className="btn btn--subtle" disabled={steps.length === 0} onClick={update}>
              Mettre à jour « {active.name} »
            </button>
          )}
        </div>
      </form>

      <p className="saved__status" role="status">
        {message}
      </p>

      {list.length === 0 ? (
        <p className="saved__empty">
          Aucune séance enregistrée. Préparez une séance, donnez-lui un nom, et retrouvez-la au
          prochain rendez-vous.
        </p>
      ) : (
        <ul className="saved__list">
          {list.map((entry) => (
            <li key={entry.id} className={`saved__item${entry.id === activeId ? ' saved__item--active' : ''}`}>
              {renaming?.id === entry.id ? (
                <form className="saved__row" onSubmit={rename}>
                  <label className="visually-hidden" htmlFor={`rename-${entry.id}`}>
                    Nouveau nom
                  </label>
                  <input
                    id={`rename-${entry.id}`}
                    className="saved__input"
                    type="text"
                    maxLength={MAX_NAME_LENGTH}
                    value={renaming.value}
                    onChange={(event) => setRenaming({ ...renaming, value: event.target.value })}
                  />
                  <button type="submit" className="btn">
                    Valider
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={() => setRenaming(null)}>
                    Annuler
                  </button>
                </form>
              ) : (
                <>
                  <div className="saved__text">
                    <h3 className="saved__name">{entry.name}</h3>
                    <p className="saved__meta">{describe(entry)}</p>
                    <p className="saved__games">{titles(entry)}</p>
                  </div>

                  {confirming?.id === entry.id ? (
                    <div className="saved__actions" role="group" aria-label={`Confirmer pour ${entry.name}`}>
                      <span className="saved__confirm">
                        {confirming.type === 'open' ? 'Remplacer la séance en cours ?' : 'Supprimer cette séance ?'}
                      </span>
                      <button
                        type="button"
                        className={`btn ${confirming.type === 'delete' ? 'btn--danger' : ''}`}
                        onClick={() => (confirming.type === 'open' ? open(entry) : remove(entry))}
                      >
                        {confirming.type === 'open' ? 'Remplacer' : 'Supprimer'}
                      </button>
                      <button type="button" className="btn btn--ghost" onClick={() => setConfirming(null)}>
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <div className="saved__actions">
                      <button type="button" className="btn" onClick={() => askOpen(entry)}>
                        Ouvrir
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost"
                        aria-label={`Renommer ${entry.name}`}
                        onClick={() => setRenaming({ id: entry.id, value: entry.name })}
                      >
                        Renommer
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost"
                        aria-label={`Supprimer ${entry.name}`}
                        onClick={() => setConfirming({ type: 'delete', id: entry.id })}
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="saved__backup">
        <p className="saved__note">
          Les séances restent sur cet appareil, dans ce navigateur : elles disparaissent si les
          données du navigateur sont effacées. Une sauvegarde permet de les garder ou de les
          copier sur un autre appareil. Elle ne contient que des jeux et des réglages, aucune
          donnée patient.
        </p>
        <div className="saved__row">
          <button type="button" className="btn btn--ghost" disabled={list.length === 0} onClick={download}>
            Sauvegarder (fichier)
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => fileInput.current?.click()}>
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
      </div>
    </section>
  )
}
