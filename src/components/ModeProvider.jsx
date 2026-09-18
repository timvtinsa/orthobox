/**
 * Display mode context, shared across the whole application.
 *
 * The mode is also written on the root element (`data-mode`), so the
 * stylesheet can adjust what it needs to without every component having to
 * read the context.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readMode, writeMode } from '../lib/mode.js'

const ModeContext = createContext({ mode: 'adult', isChild: false, changeMode: () => {} })

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(readMode)

  useEffect(() => {
    document.documentElement.dataset.mode = mode
  }, [mode])

  const changeMode = useCallback((next) => {
    setMode(next)
    writeMode(next)
  }, [])

  const value = useMemo(
    () => ({ mode, isChild: mode === 'child', changeMode }),
    [mode, changeMode],
  )

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>
}

export function useMode() {
  return useContext(ModeContext)
}
