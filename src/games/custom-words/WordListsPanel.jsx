/**
 * The practitioner's own word lists, managed on the settings screen of the
 * game « Mes mots » (its `setupPanel`), the only place they are used.
 *
 * Everything stays in the browser, like the session plan. One list is the
 * active one: it is the list the game plays. Every change is saved at once,
 * so the list is ready when « Démarrer » is pressed.
 */
import { useState } from 'react'
import {
  MAX_LISTS,
  MAX_NAME_LENGTH,
  MAX_WORDS,
  addList,
  parseWords,
  readWordLists,
  removeList,
  setActive,
  updateList,
  wordsToText,
  writeWordLists,
} from '../../lib/word-lists.js'

const PREVIEW = 8

export default function WordListsPanel() {
  const [state, setState] = useState(readWordLists)
  // `null`: nothing open; `'new'`: the creation form; a list id: that list's form.
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  const save = (next) => {
    setState(next)
    writeWordLists(next)
  }

  const submit = (name, text) => {
    save(editing === 'new' ? addList(state, name, text) : updateList(state, editing, name, text))
    setEditing(null)
  }

  const editedList = state.lists.find((list) => list.id === editing)
  const full = state.lists.length >= MAX_LISTS

  return (
    <section className="panel stack word-lists" aria-labelledby="word-lists-title">
      <header>
        <h2 id="word-lists-title" className="word-lists__title">
          Vos listes de mots
        </h2>
        <p className="muted">
          Le vocabulaire du moment : les mots d’un patient, un thème, un son travaillé. Les listes
          restent dans ce navigateur. Le jeu utilise la liste active.
        </p>
      </header>

      {state.lists.length === 0 && editing !== 'new' && (
        <p className="muted">Aucune liste pour le moment : créez-en une pour jouer.</p>
      )}

      <ul className="word-lists__items">
        {state.lists.map((list) => (
          <li key={list.id} className="word-list-card">
            {editing === list.id ? (
              <ListForm
                key={list.id}
                initialName={list.name}
                initialText={wordsToText(list.words)}
                onSubmit={submit}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <>
                <div className="word-list-card__head">
                  <h2 className="word-list-card__name">{list.name}</h2>
                  <span className="muted">
                    {list.words.length} mot{list.words.length > 1 ? 's' : ''}
                  </span>
                  {list.id === state.activeId && <span className="word-list-card__badge">Liste active</span>}
                </div>
                <p className="word-list-card__words">
                  {list.words.slice(0, PREVIEW).join(' · ')}
                  {list.words.length > PREVIEW && ` · … (+${list.words.length - PREVIEW})`}
                </p>
                <div className="word-list-card__actions">
                  {list.id !== state.activeId && (
                    <button type="button" className="btn" onClick={() => save(setActive(state, list.id))}>
                      Utiliser cette liste
                    </button>
                  )}
                  <button type="button" className="btn btn--ghost" onClick={() => setEditing(list.id)}>
                    Modifier
                  </button>
                  {pendingDelete === list.id ? (
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => {
                        save(removeList(state, list.id))
                        setPendingDelete(null)
                      }}
                    >
                      Confirmer la suppression
                    </button>
                  ) : (
                    <button type="button" className="btn btn--ghost" onClick={() => setPendingDelete(list.id)}>
                      Supprimer
                    </button>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {editing === 'new' ? (
        <div className="word-list-card">
          <ListForm initialName="" initialText="" onSubmit={submit} onCancel={() => setEditing(null)} />
        </div>
      ) : (
        <div className="game-actions">
          <button type="button" className="btn btn--lg" disabled={full} onClick={() => setEditing('new')}>
            Nouvelle liste
          </button>
          {full && <span className="muted">Limite de {MAX_LISTS} listes atteinte.</span>}
        </div>
      )}

      {!editedList && editing !== 'new' && state.lists.length > 0 && (
        <p className="muted">Une liste compte jusqu’à {MAX_WORDS} mots.</p>
      )}
    </section>
  )
}

function ListForm({ initialName, initialText, onSubmit, onCancel }) {
  const [name, setName] = useState(initialName)
  const [text, setText] = useState(initialText)
  const count = parseWords(text).length

  return (
    <form
      className="stack"
      onSubmit={(event) => {
        event.preventDefault()
        if (count > 0) onSubmit(name, text)
      }}
    >
      <label className="field">
        <span className="field__label">Nom de la liste</span>
        <input
          className="field__input"
          type="text"
          maxLength={MAX_NAME_LENGTH}
          value={name}
          placeholder="Les mots de Léo"
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label className="field">
        <span className="field__label">Les mots, un par ligne</span>
        <textarea
          className="field__input"
          rows={8}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <span className="muted">
          {count} mot{count > 1 ? 's' : ''} sur {MAX_WORDS} possibles
        </span>
      </label>
      <div className="game-actions">
        <button type="submit" className="btn btn--lg" disabled={count === 0}>
          Enregistrer
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  )
}
