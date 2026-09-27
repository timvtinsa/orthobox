import { useState } from 'react'
import Icon from './Icon.jsx'
import Modal from './Modal.jsx'

/**
 * Discreet support button: an icon alone in the header, no label.
 *
 * Set once a donation page exists (Patreon or similar): the button inside
 * the popup appears on its own as soon as this is filled in, nothing else
 * to change.
 */
const SUPPORT_URL = null

export default function DonateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="icon-round"
        aria-label="Soutenir Orthobox"
        onClick={() => setOpen(true)}
      >
        <Icon name="heart" size={18} filled={false} />
      </button>

      {open && (
        <Modal titleId="donate-title" title="Soutenir Orthobox" onClose={() => setOpen(false)}>
          <p className="modal__text">
            Orthobox est gratuit, sans publicité et sans compte, et le restera : aucune version
            payante n’est prévue.
          </p>

          <p className="modal__text">
            Le développer sur mon temps libre, ajouter des jeux et corriger ce qui doit l’être
            prend du temps. Si Orthobox vous fait gagner du vôtre en séance, un don, même
            modeste, est un vrai encouragement à continuer à le faire vivre — merci !
          </p>

          {SUPPORT_URL ? (
            <a href={SUPPORT_URL} target="_blank" rel="noreferrer" className="btn btn--lg">
              Faire un don
            </a>
          ) : (
            <p className="modal__note">Le lien pour faire un don arrive bientôt.</p>
          )}
        </Modal>
      )}
    </>
  )
}
