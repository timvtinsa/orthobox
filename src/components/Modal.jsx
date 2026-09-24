import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon.jsx'

/**
 * Portalled dialog, rendered straight under `<body>`.
 *
 * The header blurs what scrolls behind it (`backdrop-filter`), which turns
 * `position: fixed` into "fixed to that ancestor" instead of the viewport
 * for any descendant of it. Rendering outside the React tree through a
 * portal is what keeps a dialog centred on screen regardless of where its
 * trigger button lives.
 */
export default function Modal({ titleId, title, onClose, children }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return createPortal(
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="icon-round modal__close"
          aria-label="Fermer"
          onClick={onClose}
        >
          <Icon name="cross" size={18} filled={false} />
        </button>

        <h2 id={titleId} className="modal__title">
          {title}
        </h2>

        {children}
      </div>
    </div>,
    document.body,
  )
}
