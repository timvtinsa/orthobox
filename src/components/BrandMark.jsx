/**
 * Orthobox's mark: the four-dot tile shown in the header banner next to the
 * title, and reused as is — scaled down — at the centre of a shared
 * settings' QR code. One drawing, not two copies to keep in sync.
 */
export function BrandMarkShapes() {
  return (
    <>
      <rect width="40" height="40" rx="12" fill="#a8c8ec" />
      <circle cx="13" cy="16" r="4" fill="#35608f" />
      <circle cx="27" cy="16" r="4" fill="#f6bdab" />
      <circle cx="13" cy="28" r="4" fill="#b9d8c2" />
      <circle cx="27" cy="28" r="4" fill="#cdc3ec" />
    </>
  )
}

export default function BrandMark({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <BrandMarkShapes />
    </svg>
  )
}
