/**
 * Jeu d'icônes maison (SVG), pour ne dépendre d'aucune police d'icônes
 * ni d'emoji : le rendu reste identique sur tous les postes.
 */
const PATHS = {
  star: (
    <path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8L12 3.6z" />
  ),
  sound: (
    <>
      <path d="M4 9.5h3.2L12 5.4v13.2L7.2 14.5H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z" />
      <path
        d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.6 7.6 0 0 1 0 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </>
  ),
  back: (
    <path
      d="M14 5l-7 7 7 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M15.5 15.5L20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  check: (
    <path
      d="M5 12.5l4.5 4.5L19 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  cross: (
    <path
      d="M6 6l12 12M18 6L6 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  ),
  settings: (
    <>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="9" cy="7" r="2.6" fill="var(--surface, #fff)" stroke="currentColor" strokeWidth="2" />
      <circle cx="15" cy="12" r="2.6" fill="var(--surface, #fff)" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="17" r="2.6" fill="var(--surface, #fff)" stroke="currentColor" strokeWidth="2" />
    </>
  ),
}

export default function Icon({ name, size = 20, filled = true, className = '' }) {
  const content = PATHS[name]
  if (!content) return null

  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="1.8"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {content}
    </svg>
  )
}
