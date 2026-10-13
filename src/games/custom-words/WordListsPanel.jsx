/**
 * The practitioner's own word lists, managed on the settings screen of the
 * game « Mes mots » (its `setupPanel`), the only place they are used.
 *
 * Everything stays in the browser, like the session plan. One list is the
 * active one: it is the list the game plays. Every change is saved at once,
 * so the list is ready when « Démarrer » is pressed.
 */
import { useRef, useState } from 'react'
import Icon from '../../components/Icon.jsx'
import {
  MAX_LISTS,
  MAX_NAME_LENGTH,
  MAX_WORD_LENGTH,
  MAX_WORDS,
  addList,
  addWords,
  readWordLists,
  removeList,
  removeWord,
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
                initialWords={list.words}
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
          <ListForm initialName="" initialWords={[]} onSubmit={submit} onCancel={() => setEditing(null)} />
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

function ListForm({ initialName, initialWords, onSubmit, onCancel }) {
  const [name, setName] = useState(initialName)
  const [words, setWords] = useState(initialWords)
  const [draft, setDraft] = useState('')
  const [notice, setNotice] = useState('')
  const input = useRef(null)
  const full = words.length >= MAX_WORDS

  // What is typed joins the list; the field is cleared and keeps the focus,
  // so the next word can follow at once.
  const add = (text = draft) => {
    if (text.trim() === '') return
    const result = addWords(words, text)
    setWords(result.words)
    setDraft('')
    if (result.duplicates.length > 0) {
      setNotice(
        result.duplicates.length === 1
          ? `« ${result.duplicates[0]} » est déjà dans la liste.`
          : 'Ces mots sont déjà dans la liste : ' + result.duplicates.join(', ') + '.',
      )
    } else if (result.overflow > 0) {
      setNotice(`La liste est pleine (${MAX_WORDS} mots).`)
    } else {
      setNotice('')
    }
    input.current?.focus()
  }

  const remove = (word) => {
    setWords((current) => removeWord(current, word))
    setNotice('')
    input.current?.focus()
  }

  // A word typed but not yet added is not lost when the list is saved.
  const save = (event) => {
    event.preventDefault()
    const final = draft.trim() === '' ? words : addWords(words, draft).words
    if (final.length > 0) onSubmit(name, wordsToText(final))
  }

  const count = words.length

  return (
    <form className="stack" onSubmit={save}>
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

      <div className="field">
        <label className="field__label" htmlFor="word-draft">
          Ajouter un mot
        </label>
        <div className="word-entry">
          <input
            ref={input}
            id="word-draft"
            className="field__input"
            type="text"
            maxLength={MAX_WORD_LENGTH * 10}
            value={draft}
            disabled={full}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="done"
            placeholder={full ? 'Liste pleine' : 'Tapez un mot, puis Entrée'}
            onChange={(event) => setDraft(event.target.value)}
            onPaste={(event) => {
              // A column of words (from a spreadsheet, a document) arrives with
              // line breaks, which a single-line field would flatten into
              // spaces: each line becomes a word instead.
              const pasted = event.clipboardData?.getData('text') ?? ''
              if (/[\n\r;]/.test(pasted)) {
                event.preventDefault()
                add(pasted)
              }
            }}
            onKeyDown={(event) => {
              // Entrée ajoute le mot ; elle n'enregistre pas la liste.
              if (event.key === 'Enter') {
                event.preventDefault()
                add()
              }
            }}
          />
          <button type="button" className="btn" disabled={full || draft.trim() === ''} onClick={() => add()}>
            Ajouter
          </button>
        </div>
        <p className="muted word-entry__notice" role="status">
          {notice}
        </p>
      </div>

      {count > 0 ? (
        <ul className="word-chips" aria-label="Mots de la liste">
          {words.map((word) => (
            <li key={word} className="word-chip">
              <span>{word}</span>
              <button
                type="button"
                className="word-chip__remove"
                aria-label={`Retirer « ${word} »`}
                onClick={() => remove(word)}
              >
                <Icon name="cross" size={14} filled={false} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">Aucun mot pour le moment.</p>
      )}
      <p className="muted">
        {count} mot{count > 1 ? 's' : ''} sur {MAX_WORDS} possibles
      </p>

      <div className="game-actions">
        <button type="submit" className="btn btn--lg" disabled={count === 0 && draft.trim() === ''}>
          Enregistrer
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  )
}
