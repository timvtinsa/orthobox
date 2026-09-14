/**
 * Single-answer option list, with visual correction.
 *
 * Once `choice` is set, the right answer is marked in green, a wrong answer
 * in red, and everything is disabled: the correction therefore does not rely
 * on colour alone, but also on the state of the buttons.
 */
export default function MultipleChoice({ options, correct, choice, onChoose, layout = 'list' }) {
  return (
    <div className={layout === 'grid' ? 'choice-grid choice-grid--wide' : 'quiz__options'}>
      {options.map((option, position) => {
        let modifier = ''
        if (choice !== null) {
          if (position === correct) modifier = '--correct'
          else if (position === choice) modifier = '--wrong'
        }
        const base = layout === 'grid' ? 'choice' : 'quiz__option'
        return (
          <button
            key={option}
            type="button"
            className={`${base}${modifier ? ` ${base}${modifier}` : ''}`}
            disabled={choice !== null}
            onClick={() => onChoose(position)}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
