import StateMark from './StateMark.jsx'
import { answerState, stateClass } from '../lib/answer-state.js'

/**
 * Single-answer option list, with visual correction.
 *
 * Once `choice` is set, each option carries its correction state: the answer
 * given, and the expected one revealed separately when it was missed. Every
 * state shows a border stroke, a corner pictogram and a tint, so none of them
 * rests on colour alone.
 */
export default function MultipleChoice({ options, correct, choice, onChoose, layout = 'list' }) {
  return (
    <div className={layout === 'grid' ? 'choice-grid choice-grid--wide' : 'quiz__options'}>
      {options.map((option, position) => {
        const state = answerState(position, { picked: choice, expected: correct })
        const base = layout === 'grid' ? 'choice' : 'quiz__option'
        return (
          <button
            key={option}
            type="button"
            className={`${base}${stateClass(state)}`}
            disabled={choice !== null}
            onClick={() => onChoose(position)}
          >
            {option}
            <StateMark state={state} />
          </button>
        )
      })}
    </div>
  )
}
