/**
 * Contexte du mode d'affichage, partagé par toute l'application.
 *
 * Le mode est aussi posé sur l'élément racine (`data-mode`), ce qui permet à
 * la feuille de style d'ajuster ce qui doit l'être sans que chaque composant
 * ait à lire le contexte.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ecrireMode, lireMode } from '../lib/mode.js'

const ModeContext = createContext({ mode: 'adulte', estEnfant: false, changerMode: () => {} })

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(lireMode)

  useEffect(() => {
    document.documentElement.dataset.mode = mode
  }, [mode])

  const changerMode = useCallback((prochain) => {
    setMode(prochain)
    ecrireMode(prochain)
  }, [])

  const valeur = useMemo(
    () => ({ mode, estEnfant: mode === 'enfant', changerMode }),
    [mode, changerMode],
  )

  return <ModeContext.Provider value={valeur}>{children}</ModeContext.Provider>
}

export function useMode() {
  return useContext(ModeContext)
}
