/**
 * Interrupteur entre le mode adulte et le mode enfant.
 *
 * Un seul bouton bascule d'un mode à l'autre : les deux libellés restent
 * visibles pour que l'état courant se lise sans avoir à interpréter la
 * position du curseur, et l'état est porté par `aria-checked`.
 */
import { useMode } from './ModeProvider.jsx'

export default function ModeSwitch() {
  const { mode, estEnfant, changerMode } = useMode()

  return (
    <div className="mode-switch">
      <span className={`mode-switch__label${estEnfant ? '' : ' mode-switch__label--actif'}`}>
        Adulte
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={estEnfant}
        aria-label="Mode enfant"
        className="mode-switch__piste"
        onClick={() => changerMode(estEnfant ? 'adulte' : 'enfant')}
      >
        <span className="mode-switch__curseur" />
      </button>
      <span className={`mode-switch__label${estEnfant ? ' mode-switch__label--actif' : ''}`}>
        Enfant
      </span>
      <span className="visually-hidden">
        Mode actuel : {mode === 'enfant' ? 'enfant' : 'adulte'}
      </span>
    </div>
  )
}
