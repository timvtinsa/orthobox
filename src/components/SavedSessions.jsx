/**
 * Saved sessions of the session builder: two small buttons beside the title of
 * the plan, each opening a dialog, so the page itself stays light.
 *
 *   « Enregistrer »  save the plan under a name (typing the name of a session
 *                    already saved replaces it)
 *   « Mes séances »  reopen or delete a saved session, back up and restore
 *
 * Everything is kept in this browser (see `lib/saved-sessions.js`). Replacing
 * the plan in progress and deleting a session ask for a confirmation on the
 * line of the session concerned, not in another pop-up.
 */
import { useEffect, useRef, useState } from 'react'
import { getGame } from '../games/registry.js'
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
import Modal from './Modal.jsx'

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

export default function SavedSessions({ steps, onOpen }) {
  const [list, setList] = useState(readSavedSessions)
  const [dialog, setDialog] = useState(null) // 'save' | 'list'
  const [message, setMessage] = useState('')

  // The confirmation of what was just done fades on its own.
  useEffect(() => {
    if (!message) return undefined
    const timer = window.setTimeout(() => setMessage(''), 5000)
    return () => window.clearTimeout(timer)
  }, [message])

  return (
    <>
      <div className="saved-bar">
        {steps.length > 0 && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setDialog('save')}>
            Enregistrer
          </button>
        )}
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setDialog('list')}>
          Mes séances{list.length > 0 ? ` (${list.length})` : ''}
        </button>
      </div>

      <p className="saved-bar__status" role="status">
        {message}
      </p>

      {dialog === 'save' && (
        <SaveDialog
          steps={steps}
          list={list}
          onClose={() => setDialog(null)}
          onSaved={(nextList, entry) => {
            setList(nextList)
            setDialog(null)
            setMessage(`« ${entry.name} » est enregistrée.`)
          }}
        />
      )}

      {dialog === 'list' && (
        <ListDialog
          steps={steps}
          list={list}
          setList={setList}
          onClose={() => setDialog(null)}
          onOpened={(entry, lost) => {
            setDialog(null)
            setMessage(
              `« ${entry.name} » est ouverte.` +
                (lost > 0 ? ` ${plural(lost, 'jeu n’existe', 'jeux n’existent')} plus et a été retiré.` : ''),
            )
          }}
          onOpen={onOpen}
        />
      )}
    </>
  )
}

function SaveDialog({ steps, list, onClose, onSaved }) {
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
    onSaved(result.list, result.entry)
  }

  return (
    <Modal titleId="save-title" title="Enregistrer la séance" onClose={onClose}>
      <form className="saved-form" onSubmit={submit}>
        <label className="saved-form__label" htmlFor="saved-name">
          Nom de la séance
        </label>
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
        <p className="saved-form__hint" role="status">
          {problem ||
            (same
              ? `Une séance porte déjà ce nom : elle sera remplacée (${describe(same)}).`
              : `${plural(steps.length, 'jeu', 'jeux')} et leurs réglages. Aucune donnée patient.`)}
        </p>
        <div className="saved-form__actions">
          <button type="submit" className="btn btn--lg">
            {same ? 'Remplacer' : 'Enregistrer'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  )
}

function ListDialog({ steps, list, setList, onClose, onOpened, onOpen }) {
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
    onOpened(entry, missingGames(entry))
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
    <Modal titleId="saved-list-title" title="Mes séances" onClose={onClose}>
      {list.length === 0 ? (
        <p className="saved-empty">
          Aucune séance enregistrée. Composez une séance, puis appuyez sur « Enregistrer » pour la
          retrouver au prochain rendez-vous.
        </p>
      ) : (
        <ul className="saved-list">
          {list.map((entry) => {
            const games = entry.steps.map((step) => getGame(step.gameId)?.title).filter(Boolean)
            return (
              <li key={entry.id} className="saved-item">
                <div className="saved-item__text">
                  <h3 className="saved-item__name">{entry.name}</h3>
                  <p className="saved-item__meta" title={games.join(' · ')}>
                    {describe(entry)}
                  </p>
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
        <div className="saved-form__actions">
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
    </Modal>
  )
}
